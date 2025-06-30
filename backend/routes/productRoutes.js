import express from 'express';
import { createProducts, getProducts , updateProduct, deleteProduct, getProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts );
router.get('/:id', getProduct);
router.post("/", createProducts);
router.put("/:id",updateProduct);
router.delete("/:id",deleteProduct);
export default router;