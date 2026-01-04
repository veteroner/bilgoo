'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Çıkış yapılamadı:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-4xl">🧠</span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bilgoo
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-gray-600 text-sm">Merhaba, <span className="font-semibold">{user.displayName || 'Misafir'}</span></span>
                <button onClick={handleLogout} className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium">
                  Çıkış
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary">Giriş Yap</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
