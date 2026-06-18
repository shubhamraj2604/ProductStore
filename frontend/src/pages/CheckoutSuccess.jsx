import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "../store/useAddtoCart";

function CheckoutSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-gray-900 border border-gray-800 p-8 text-center shadow-2xl">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Payment successful</h1>
        <p className="text-gray-300 mb-8">
          Your order was placed through Stripe Checkout. Your cart has been cleared.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-3 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors"
          >
            Back to shop
          </button>
          <Link
            to="/cart"
            className="px-5 py-3 rounded-xl border border-gray-700 text-gray-200 font-semibold hover:bg-gray-800 transition-colors"
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;