import express from "express";
import { sql } from '../config/db.js';

// export const loginusers = async (req, res) => {
//     const {username, email, password} = req.body;
//     try{
//         const user = await sql`SELECT * FROM users WHERE email = ${email}`;
//         if(user.length > 0){
//             res.status(400).json({message: "User already exists"});
//         }
//     }catch(error){
//         res.status(500).json({message: "Internal server error"});
//     }
// };

export const newloginusers = async (req, res) => {
  const { username, email } = req.body;
  const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
  return res.status(409).json({ message: "Username or email already exists" });
  }
  try {
    const user = await sql`INSERT INTO users (username, email) VALUES (${username}, ${email})`;
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};