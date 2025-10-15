import React from "react";
import { useCartStore } from "../store/useAddtoCart";
import { ArrowLeftIcon, ShoppingCartIcon, PlusIcon, MinusIcon, TrashIcon, HeartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();
  const total = getCartTotal();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/")} 
            className="group flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 mb-6"
          >
            <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Products</span>
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl">
                <ShoppingCartIcon className="size-6 text-white" />
              </div>
              Shopping Cart
            </h1>
            {cart.length > 0 && (
              <div className="text-right">
                <p className="text-gray-300 text-sm">Total Items</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <ShoppingCartIcon className="size-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">0</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Your cart is empty
              </h3>
              <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
                Discover amazing products and add them to your cart. Start your shopping journey now!
              </p>
            </div>

            <button 
              onClick={() => navigate("/")} 
              className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white border-none hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 px-8 py-3 rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1 font-bold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 overflow-hidden border border-gray-700/50 hover:border-purple-500/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="relative sm:w-48 h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            {item.name}
                          </h3>
                          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            ${item.price}
                          </p>
                        </div>
                        <button className="p-2 rounded-full hover:bg-pink-500/20 transition-colors duration-300">
                          <HeartIcon className="size-5 text-gray-400 hover:text-pink-400 transition-colors duration-300" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-700/50 backdrop-blur-sm rounded-xl p-2">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-10 h-10 rounded-lg bg-gray-600/50 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-110 border border-gray-600/50"
                          >
                            <MinusIcon className="size-4" />
                          </button>
                          <span className="text-xl font-bold text-white min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-10 h-10 rounded-lg bg-gray-600/50 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-110 border border-gray-600/50"
                          >
                            <PlusIcon className="size-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-400 mb-1">Subtotal</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300 font-medium border border-red-500/30"
                      >
                        <TrashIcon className="size-4" />
                        Remove from Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span className="text-white font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span className="text-green-400 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax</span>
                      <span className="text-white font-medium">${(total * 0.08).toFixed(2)}</span>
                    </div>
                    <hr className="border-gray-600/50" />
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-2xl">
                        ${(total * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* PAYMENT INTEGRATION */}
                  <button className="w-full bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/25">
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">🔒 Secure checkout guaranteed</p>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-6 mt-6 border border-gray-600/50">
                  <h4 className="font-bold text-white mb-3">Have a promo code?</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                    />
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CartPage;
