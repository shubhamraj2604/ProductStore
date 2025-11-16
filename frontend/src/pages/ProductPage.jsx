import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProduct";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

function ProductPage() {
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
      <button onClick={() => navigate("/")} className="btn btn-sm sm:btn-md btn-ghost mb-6 sm:mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* PRODUCT IMAGE */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100 aspect-square">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* PRODUCT FORM */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-xl sm:text-2xl mb-4 sm:mb-6 text-green-600">Edit Product</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProduct(id);
              }}
              className="space-y-6"
            >
              {/* PRODUCT NAME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Product Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* PRODUCT PRICE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Price</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Image URL</span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              {/* PRODUCT CATEGORY */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Category</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  <option value="Phone">Phone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              {/* FORM ACTIONS */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
                <button type="button" onClick={handleDelete} className="btn btn-sm sm:btn-md btn-error order-2 sm:order-1">
                  <Trash2Icon className="size-4 mr-2" />
                  Delete Product
                </button>

                <button
                  type="submit"
                  className="btn btn-sm sm:btn-md btn-primary order-1 sm:order-2"
                  disabled={loading || !formData.name || !formData.price || !formData.image}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <SaveIcon className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductPage;