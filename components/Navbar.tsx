'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-4xl">🧠</span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bilgoo
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                Türkiye'nin En Eğlenceli Quiz Oyunu
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/">Ana Sayfa</NavLink>
            <NavLink href="/categories">Kategoriler</NavLink>
            <NavLink href="/leaderboard">Lider Tablosu</NavLink>
            <NavLink href="/stats">İstatistikler</NavLink>
            <NavLink href="/about">Hakkımızda</NavLink>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/play"
              className="btn-primary flex items-center space-x-2"
            >
              <span>🎮</span>
              <span>Oyuna Başla</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <MobileNavLink href="/">Ana Sayfa</MobileNavLink>
            <MobileNavLink href="/categories">Kategoriler</MobileNavLink>
            <MobileNavLink href="/leaderboard">Lider Tablosu</MobileNavLink>
            <MobileNavLink href="/stats">İstatistikler</MobileNavLink>
            <MobileNavLink href="/about">Hakkımızda</MobileNavLink>
            <div className="pt-3 space-y-2">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                href="/play"
                className="block w-full text-center btn-primary"
              >
                🎮 Oyuna Başla
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 font-medium transition-colors"
    >
      {children}
    </Link>
  );
}
