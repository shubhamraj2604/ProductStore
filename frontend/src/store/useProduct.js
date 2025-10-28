import { create } from 'zustand';
import axios from "axios";
import toast from 'react-hot-toast';


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

    formData: {
    name: "",
    price: "",
    image: "",
    },

    

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });
    try {
      const {formData} = get();
      const response = await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in addProduct function", error);
      toast.error("Something went wrong");
    }finally{
      set({loading : false})
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      const products = response.data?.data || [];
      set({ products, error: null });
    } catch (err) {
      const status = err.response?.status;
      if (status === 429) {
        set({ error: "Rate limit exceeded", products: [] });
      } else {
        
      }
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct:async(id) => {
      set({
        loading: true
      });
      try {
        await axios.delete(`${BASE_URL}/api/products/${id}`);
        set(prev => ({
          products: prev.products.filter(product => product.id !== id)}));
          toast.success("Product deleted successfully");
      } catch (error) {
        console.log("Error in deleting Product", error);
        toast.error("Something Went Wrong");
      }finally{
        set({loading:false})
      }
  },

  fetchProduct: async (id) => {
  set({ loading: true });
  try {
    const response = await axios.get(`${BASE_URL}/api/products/${id}`);
    const data = response.data.data;
    set({
      currentProduct: data,
      formData: { ...data },  
      error: null
    });
  } catch (error) {
    console.log("Error in fetching Product", error);
    set({ error: "Something went wrong", currentProduct: null });
  } finally {
    set({ loading: false });
  }
},

  updateProduct : async(id) =>{
    set({ loading: true });
    try {
      const {formData} = get();
      const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
      set({currentProduct : response.data.data ,
        error:null })
        toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Something went wrong")
      console.log("ERROR",error);
    }
    finally{
    set({loading:false});
  }
},


}));

  
  
