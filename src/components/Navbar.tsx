"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-500">IntelliScan AI™</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-gray-600 hover:text-brand-500 transition-colors">
              Pricing
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-gray-600 hover:text-brand-500 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="text-gray-600 hover:text-brand-500 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-600 hover:text-brand-500 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/signup" className="btn-primary text-sm !py-2 !px-4">
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/pricing" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>
              Pricing
            </Link>
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/signup" className="block px-3 py-2 text-brand-500 font-medium hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
