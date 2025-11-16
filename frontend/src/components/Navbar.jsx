import { ShoppingCartIcon, ShoppingBagIcon } from 'lucide-react';
import React from 'react';
import { Link, useResolvedPath } from 'react-router-dom';
import ThemeSelector from './ThemeSelector';
import { useThemeStore } from '../store/useThemeStore';
import { useCartStore } from "../store/useAddtoCart";
import { SignedIn, SignedOut, SignInButton, UserButton  , useUser} from '@clerk/clerk-react';

const Navbar = () => {
  const user = useUser();
  const { pathname } = useResolvedPath();
  const isHomePage = pathname === "/";

  const { theme, setTheme } = useThemeStore();
  const { cart } = useCartStore();

  return (
    <div className="bg-base-100/90 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-3 sm:px-4 lg:px-6 min-h-[3.5rem] sm:min-h-[4rem] justify-between">
          {/* LOGO */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShoppingCartIcon className="size-7 sm:size-8 lg:size-9 text-primary" />
                <span
                  className="font-semibold font-mono tracking-wide sm:tracking-widest text-lg sm:text-xl lg:text-2xl 
                  bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  <span className="hidden sm:inline">NEXTONICSTORE</span>
                  <span className="sm:hidden">NEXTONIC</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <ThemeSelector />

            {/* Show Cart Icon only on home page */}
            {isHomePage && (
              <Link to="/cart" className="indicator">
                <div className="p-1.5 sm:p-2 rounded-full hover:bg-base-200 transition-colors relative">
                  <ShoppingBagIcon className="size-4 sm:size-5" />
                  {cart.length > 0 && (
                    <span className="badge badge-xs sm:badge-sm badge-primary indicator-item">
                      {cart.length}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* Clerk Auth */}
            <div className="flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn btn-sm sm:btn-md btn-primary text-xs sm:text-sm">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
