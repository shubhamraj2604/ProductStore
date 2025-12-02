import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EditIcon, 
  Trash2Icon, 
  ShoppingCart, 
  Heart,
  Star,
  Eye,
  Share2
} from 'lucide-react'; 
import { useThemeStore } from '../store/useThemeStore';
import { useProductStore } from '../store/useProduct';
import { useCartStore } from '../store/useAddtoCart';
import { useUser } from '@clerk/clerk-react';

const ProductCard = ({ product }) => {
  const { user } = useUser();
  const { deleteProduct } = useProductStore();
  const { addToCart } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    // You could add a toast notification here
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div 
      className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        {/* Badge for discounts/new items */}
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            NEW
          </div>
        )}
        
        {product.discount && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{product.discount}%
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay with quick actions */}
          <div className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              <Link 
                to={`/product/${product.id}`}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
              </Link>
              
              <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-6">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
            {product.category || 'Electronics'}
          </span>
          
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                  i < (product.rating || 4) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-0.5 sm:ml-1 hidden sm:inline">
              ({product.reviews || 23})
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 hidden sm:block">
          {product.description || 'Premium quality product with excellent features and design.'}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-base sm:text-lg text-gray-500 line-through">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {typeof product.stock !== 'undefined' && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock > 10
                    ? 'bg-green-500'
                    : product.stock > 0
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  product.stock > 10
                    ? 'text-green-600'
                    : product.stock > 0
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {product.stock > 10
                  ? 'In Stock'
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        {user?.publicMetadata?.role === "admin" && !product.isMock ? (
          <div className="flex gap-2">
            <Link 
              to={`/product/${product.id}`} 
              className="flex-1 btn btn-sm sm:btn-md btn-outline btn-info hover:scale-105 transition-transform duration-200 active:scale-95"
            >
              <EditIcon className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
            <button
              className="btn btn-sm sm:btn-md btn-outline btn-error hover:scale-105 transition-transform duration-200 active:scale-95"
              onClick={() => deleteProduct(product.id)}
            >
              <Trash2Icon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button 
              className="flex-1 btn btn-sm sm:btn-md btn-primary hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="text-xs sm:text-sm">
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
