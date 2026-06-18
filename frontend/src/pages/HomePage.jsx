import React,{useEffect , onClick} from 'react'
import { useProductStore } from '../store/useProduct'
import Hero from './Hero'
import { PlusCircleIcon, RefreshCwIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PackageIcon } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import ProtectedRoute from '../components/ProtectedRoute';
import { useUser } from '@clerk/clerk-react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
const HomePage = () => {
  const {products , loading , error , fetchProducts, getFilteredProducts, searchQuery, selectedCategory} = useProductStore();
  const {user} = useUser();
  const filteredProducts = getFilteredProducts();
  
  useEffect(() =>{
    fetchProducts();
  },[fetchProducts])
//  console.log(user?.publicMetadata?.role == 'admin')
  console.log(products);
  const hasRealProducts = filteredProducts.length > 0;

  return (
   <div className="bg-base-200 min-h-screen">
    <Hero />

   <hr className="border-t border-base-300 " />

    <main
      id="product-section"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
    >
     <div className="mb-6 sm:mb-8 text-center">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-primary font-semibold mb-2">
          Handpicked for you
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Explore Our Latest Products
        </h2>
        <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
          Browse a curated collection of tech, accessories and everyday essentials
          with a clean, modern shopping experience.
        </p>
      </div>
     <ProtectedRoute>
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
  <div>
    {user?.publicMetadata?.role?.trim() === 'admin' && (
      <button
        className="btn btn-sm sm:btn-md btn-primary flex items-center"
        onClick={() => document.getElementById("add_product_modal").showModal()}
      >
        <PlusCircleIcon className="size-4 sm:size-5 mr-2" />
        Add Product
      </button>
    )}
  </div>

  <button
    className="btn btn-sm sm:btn-md btn-ghost btn-circle"
    onClick={fetchProducts}
    title="Refresh products"
  >
    <RefreshCwIcon className="size-4 sm:size-5" />
  </button>
</div>

      {/* Search & Filters – only when real products exist */}
      {products.length > 0 && (
        <>
          <div className="mb-6 sm:mb-8">
            <SearchBar />
          </div>

          <div className="mb-6 sm:mb-8">
            <CategoryFilter />
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <div className="mb-4 text-sm sm:text-base text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          )}
        </>
      )}

      <AddProductModal />
         </ProtectedRoute>
       
       {error && <div className='alert alert-error mb-8'>{error}</div>}

       
       {loading ?(
         <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
           </div>
       ):(
         hasRealProducts && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
         )
       )}
      
    </main>
   </div>
  )
}

export default HomePage
