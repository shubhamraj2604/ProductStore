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
// import { testProducts } from '../constants/test';
const HomePage = () => {
  const {products , loading , error , fetchProducts, getFilteredProducts, searchQuery, selectedCategory} = useProductStore();
  const {user} = useUser();
  const filteredProducts = getFilteredProducts();
  
  useEffect(() =>{
    fetchProducts();
  },[fetchProducts])
//  console.log(user?.publicMetadata?.role == 'admin')
  console.log(products);
  return (
    <div>
    <Hero />

   <hr className="border-t border-gray-300 " />

    <main id = "product-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-6 sm:mt-10">
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

      {/* Search Bar */}
      <div className="mb-6 sm:mb-8">
        <SearchBar />
      </div>

      {/* Category Filter */}
      <div className="mb-6 sm:mb-8">
        <CategoryFilter />
      </div>

      {/* Results count */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="mb-4 text-sm sm:text-base text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}

      <AddProductModal />
         </ProtectedRoute>
       
       {error && <div className='alert alert-error mb-8'>{error}</div>}
         {/* When There is a zero product show this message */}
         {filteredProducts.length === 0 && !loading && (
           <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4 px-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12 sm:size-16" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-semibold">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No products match your search' 
                : 'No products found'}
            </h3>
            <p className="text-gray-500 max-w-sm text-sm sm:text-base">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first product to the inventory'}
            </p>
          </div>
        </div>
      )}

       
       {loading ?(
         <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
           </div>
       ):(
         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
       )}
      
    </main>
   </div>
  )
}

export default HomePage