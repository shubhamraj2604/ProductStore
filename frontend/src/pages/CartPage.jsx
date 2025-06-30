import React from "react";
import { useCartStore } from "../store/useAddtoCart";
import { ArrowLeftIcon, ShoppingCartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8 mr-10">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      

      <h2 className="text-4xl mb-6 flex items-center gap-3 font-semibold">
        <ShoppingCartIcon color="purple" className="size-8 mt-2" />
        <span>Cart</span>
      </h2>

      {cart.length === 0 ? (
        // if the cart is empty
        <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 mt-10">
          <div className="bg-base-100 rounded-full p-6 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.2a1 1 0 001 1.3h11.6a1 1 0 001-1.3L17 13M7 13V6h13"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl text-gray-600 font-semibold">
              Your cart is empty
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't added anything to your cart yet. Explore products and
              start shopping now.
            </p>
          </div>

          <button onClick={() => navigate("/")} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="card card-side bg-base-100 shadow-md border"
              >
                <figure>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{item.name}</h2>
                  <p className="text-sm text-gray-500">${item.price}</p>
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-error btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-base-100 shadow-md border mt-6">
            <div className="card-body text-right">
              <h3 className="text-xl font-semibold">Total: ${total}</h3>
              <button className="btn btn-primary mt-2">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
