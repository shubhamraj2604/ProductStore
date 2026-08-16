import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import {sql} from './config/db.js';
import {aj} from './lib/arcjet.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from "./routes/uploadRoutes.js";
import fs from "fs";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Capture raw body for Stripe webhook route before JSON body parser
app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      req.rawBody = Buffer.concat(chunks);
      next();
    });
    req.on("error", (err) => next(err));
  } else {
    next();
  }
});

app.use(express.json());
// cors is a small code you add to your backend to say:
// “Hey browser, it's okay! I allow this request.”   
app.use(cors());
app.use(helmet({
  contentSecurityPolicy:false,
}));
app.use(morgan("dev")); //"dev" is a format string that tells Morgan how to log requests in the console. "common"

//apply arcjet 
app.use(async (req,res,next) =>{
   try {
    const decision = await aj.protect(req,{
        requested:1
    })
            
    if(decision.isDenied()){
        if(decision.reason.isRateLimit()){
            res.status(429).json({message:"Rate limit exceeded"});   //429 = rate limiting
        } 
        else if(decision.reason.isBot()){
            res.status(403).json({message:"You are a bot"});  //403 = bot
        }
        else{
            res.status(401).json({message:"Forbidden"});  //401 = unauthorized
        }
        return;
    }
    // CHECK FOR SPOOFED BOTS(WHEN A BOTS TRIES TO ACT LIKE IT IS NOT A BOT) 
    if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
        res.status(403).json({message:"You are a spoofed bot"});  
        return;
    }
    next();
   } catch (error) {
       console.error("arcjet error",error);
       next();
   }
});

app.use("/api/products",productRoutes);
app.use("/api/users",userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/stripe", stripeRoutes);

app.use("/api/upload", uploadRoutes);
app.get("/", (_req, res) => {
  res.json({ service: "api", ok: true });
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "frontend", "dist");

  // console.log("NODE_ENV =", process.env.NODE_ENV);
  // console.log("__dirname =", __dirname);
  // console.log("distPath =", distPath);

  console.log(
    "index exists:",
    fs.existsSync(path.join(distPath, "index.html"))
  );

  app.use(express.static(distPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    console.log("SPA Route Hit:", req.path);
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

async function initDb() {
  try {
    // ── Create tables only if they don't already exist (safe on every restart) ─
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id            BIGSERIAL PRIMARY KEY,
        clerk_user_id VARCHAR(255) NOT NULL UNIQUE,
        username      VARCHAR(255),
        email         VARCHAR(255) UNIQUE,
        created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id   BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(120) NOT NULL UNIQUE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id          BIGSERIAL PRIMARY KEY,
        category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
        name        VARCHAR(255) NOT NULL,
        price_cents INTEGER      NOT NULL CHECK (price_cents >= 0),
        is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
        created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS product_images (
        id         BIGSERIAL PRIMARY KEY,
        product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        image_url  TEXT   NOT NULL,
        is_primary BOOLEAN NOT NULL DEFAULT FALSE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS carts (
        id         BIGSERIAL PRIMARY KEY,
        user_id    BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id         BIGSERIAL PRIMARY KEY,
        cart_id    BIGINT  NOT NULL REFERENCES carts(id)    ON DELETE CASCADE,
        product_id BIGINT  NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity   INTEGER NOT NULL CHECK (quantity > 0),
        UNIQUE (cart_id, product_id)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id                       BIGSERIAL PRIMARY KEY,
        user_id                  BIGINT REFERENCES users(id) ON DELETE SET NULL,
        status                   VARCHAR(32)  NOT NULL,
        currency                 VARCHAR(10)  NOT NULL DEFAULT 'usd',
        subtotal_cents           INTEGER      NOT NULL DEFAULT 0 CHECK (subtotal_cents >= 0),
        tax_cents                INTEGER      NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
        total_cents              INTEGER      NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
        customer_email           VARCHAR(255),
        stripe_session_id        VARCHAR(255) UNIQUE,
        stripe_payment_intent_id VARCHAR(255) UNIQUE,
        created_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id                    BIGSERIAL PRIMARY KEY,
        order_id              BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id            BIGINT REFERENCES products(id) ON DELETE SET NULL,
        product_name_snapshot VARCHAR(255) NOT NULL,
        unit_price_cents      INTEGER NOT NULL CHECK (unit_price_cents >= 0),
        quantity              INTEGER NOT NULL CHECK (quantity > 0),
        line_total_cents      INTEGER NOT NULL CHECK (line_total_cents >= 0)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id                  BIGSERIAL PRIMARY KEY,
        order_id            BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        provider            VARCHAR(50)  NOT NULL,
        provider_payment_id VARCHAR(255),
        amount_cents        INTEGER NOT NULL CHECK (amount_cents >= 0),
        status              VARCHAR(32) NOT NULL,
        paid_at             TIMESTAMP,
        raw_payload         JSONB
      )
    `;

    console.log("DATABASE INITIALIZED SUCCESSFULLY — normalized schema ready.");
  } catch (error) {
    console.error("DB init error:", error);
  }
}

initDb().then(()=>{
  app.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
  });
});
