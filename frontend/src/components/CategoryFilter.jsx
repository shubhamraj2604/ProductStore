import React from 'react';
import { FilterIcon } from 'lucide-react';
import { useProductStore } from '../store/useProduct';

const CategoryFilter = () => {
  const { selectedCategory, setSelectedCategory, getCategories } = useProductStore();
  const categories = getCategories();
  
  // Common categories if none exist yet
  const commonCategories = ['Phone', 'Laptop', 'Tablet', 'Accessories', 'Electronics', 'Clothing', 'Shoes', 'Books', 'Home', 'Sports'];
  
  // Use existing categories or common ones
  const availableCategories = categories.length > 0 ? categories : commonCategories;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <FilterIcon className="size-4 sm:size-5 text-primary" />
        <h3 className="text-sm sm:text-base font-semibold text-base-content">Filter by Category</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`btn btn-sm sm:btn-md ${
            selectedCategory === 'all'
              ? 'btn-primary'
              : 'btn-outline btn-ghost'
          } transition-all duration-200 active:scale-95`}
        >
          All Products
        </button>
        
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn btn-sm sm:btn-md ${
              selectedCategory.toLowerCase() === category.toLowerCase()
                ? 'btn-primary'
                : 'btn-outline btn-ghost'
            } transition-all duration-200 active:scale-95 capitalize`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

