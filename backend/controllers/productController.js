import {sql} from "../config/db.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert dollar string/number to integer cents */
const toCents = (price) => Math.round(Number(price) * 100);

/** Convert cents integer to dollar string e.g. 1299 → "12.99" */
const toDollars = (cents) => (cents / 100).toFixed(2);

/** Get or create a category by name. Returns id or null. */
async function upsertCategory(name) {
  if (!name) return null;
  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  const [cat] = await sql`
    INSERT INTO categories (name, slug)
    VALUES (${name.trim()}, ${slug})
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `;
  return cat.id;
}

/** Shape a raw DB row into the API response object */
const formatProduct = (row) => ({
  id:         row.id,
  name:       row.name,
  price:      toDollars(row.price_cents),
  image:      row.image_url ?? null,
  category:   row.category_name ?? null,
  is_active:  row.is_active,
  created_at: row.created_at,
});

// ── Controllers ───────────────────────────────────────────────────────────────

export const getProducts = async (req, res) => {
  try {
    const rows = await sql`
      SELECT p.id, p.name, p.price_cents, p.is_active, p.created_at,
             c.name AS category_name, pi.image_url
      FROM products p
      LEFT JOIN categories     c  ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
    `;
    res.status(200).json({ success: true, data: rows.map(formatProduct) });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await sql`
      SELECT p.id, p.name, p.price_cents, p.is_active, p.created_at,
             c.name AS category_name, pi.image_url
      FROM products p
      LEFT JOIN categories     c  ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE p.id = ${id}
      LIMIT 1
    `;
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: formatProduct(rows[0]) });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

export const createProducts = async (req, res) => {
  const { name, price, image, category } = req.body;
  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "Please fill in all fields" });
  }
  try {
    const priceCents = toCents(price);
    const categoryId = await upsertCategory(category);

    const [newProduct] = await sql`
      INSERT INTO products (name, price_cents, category_id)
      VALUES (${name}, ${priceCents}, ${categoryId})
      RETURNING *
    `;

    await sql`
      INSERT INTO product_images (product_id, image_url, is_primary)
      VALUES (${newProduct.id}, ${image}, TRUE)
    `;

    console.log("New product added:", newProduct.id);
    res.status(201).json({
      success: true,
      data: {
        id:         newProduct.id,
        name:       newProduct.name,
        price:      toDollars(newProduct.price_cents),
        image,
        category:   category ?? null,
        is_active:  newProduct.is_active,
        created_at: newProduct.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Error creating product" });
  }
};

export const updateProduct = async (req, res) => {
  const { id }                            = req.params;
  const { name, price, image, category }  = req.body;
  try {
    const priceCents = price    != null ? toCents(price)            : null;
    const categoryId = category != null ? await upsertCategory(category) : null;

    const updatedRows = await sql`
      UPDATE products
      SET
        name        = COALESCE(${name       ?? null}, name),
        price_cents = COALESCE(${priceCents       }, price_cents),
        category_id = COALESCE(${categoryId       }, category_id)
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedRows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Replace primary image if a new one was supplied
    if (image) {
      await sql`UPDATE product_images SET is_primary = FALSE WHERE product_id = ${id}`;
      await sql`
        INSERT INTO product_images (product_id, image_url, is_primary)
        VALUES (${id}, ${image}, TRUE)
        ON CONFLICT DO NOTHING
      `;
      await sql`
        UPDATE product_images SET is_primary = TRUE
        WHERE product_id = ${id} AND image_url = ${image}
      `;
    }

    const rows = await sql`
      SELECT p.id, p.name, p.price_cents, p.is_active, p.created_at,
             c.name AS category_name, pi.image_url
      FROM products p
      LEFT JOIN categories     c  ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE p.id = ${id}
      LIMIT 1
    `;

    console.log("Product updated:", id);
    res.status(200).json({ success: true, data: formatProduct(rows[0]) });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await sql`DELETE FROM products WHERE id = ${id} RETURNING *`;
    if (deleted.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    console.log("Product deleted:", id);
    res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};
