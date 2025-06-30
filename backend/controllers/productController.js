import {sql} from "../config/db.js";

// CRUD OPERATION IN POSTGRE-SQL

export const getProducts = async (req, res) => {
   try {
    const products = await sql`
    SELECT * FROM products
    ORDER BY created_at DESC
    `;
    console.log(products);
    res.status(200).json({ success: true, data: products });

   } catch(error){
     console.log(error);
     res.status(500).json({ success: false, message: "Error fetching products" });
   }
};

export const createProducts = async (req, res) =>  {
    const {name, price,image} = req.body
    if(!name || !price || !image){
        return res.status(400).json({success: false, message: "Please fill in all fields"});
    }

    try{ 
        const newProduct = await sql`
        INSERT INTO products (name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *                                
        `;  // TO RETURN THE INSERTED VALUES

        console.log("new product added:",newProduct);
        res.status(201).json({success: true, data: newProduct[0]});
     
    }catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating product" });
    }
}

export const getProduct = async (req, res) =>{
    const {id} = req.params;    //paramas = parameter
    console.log(id);
    try{
        const product = await sql`
        SELECT * FROM products WHERE id=${id}
        `;
        console.log("product displayed",product);
        res.status(200).json({success: true, data: product[0]});
    }catch(error){
        console.log("ERROR IN GETTING PRODUCT",error);
        res.status(500).json({ success: false, message: "Error fetching product" });
    }

};
export const updateProduct = async (req, res) =>{
     const id = req.params.id;
     const {name, price, image} = req.body
     try {
        const updatedProduct = await sql`
         UPDATE products 
         SET name=${name}, price=${price}, image=${image} 
         WHERE id=${id}
         RETURNING *
        `;
        if(updateProduct.length == 0){
            return res.status(404).json({
            success: false, 
            message: "Product not found"
        });
        }
        console.log("product updated:",updatedProduct);
        res.status(200).json({success: true, data: updatedProduct[0]});
     } catch (error) {
        console.log("INTERNAL ERROR", error);
        res.status(500).json({ success: false, message: "Error updating product" });
     }

};
export const deleteProduct = async (req, res) =>{
    const {id} = req.params;
    try{
        const deletedProduct = await sql`
        DELETE FROM products 
        WHERE id=${id}
        RETURNING *
        `;

        if(deletedProduct.length == 0){
            return res.status(404).json({
                success: false,
                message: "Product not found"
                });
        }

        console.log("Deleted Successfully", deletedProduct);
        res.status(200).json({success: true, data: deletedProduct});
    }
    catch(error){
        console.log("ERROR IN DELETING PRODUCT",error);
        res.status(500).json({ success: false, message: "Error deleting product" });
    }
};
