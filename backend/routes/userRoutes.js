import express from 'express';
import {newloginusers } from '../controllers/loginusers.js';

const router = express.Router();

router.post("/login",newloginusers);

export default router;