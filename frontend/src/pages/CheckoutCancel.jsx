import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

function CheckoutCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-gray-900 border border-gray-800 p-8 text-center shadow-2xl">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Checkout canceled</h1>
        <p className="text-gray-300 mb-8">
          No payment was taken. You can return to the cart and try again.
        </p>
        <Link
          to="/cart"
          className="inline-flex px-5 py-3 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}

export default CheckoutCancel;