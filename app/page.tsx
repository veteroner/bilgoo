import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CategoriesGrid from '@/components/CategoriesGrid'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategoriesGrid />
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            <p>&copy; 2025 Bilgoo - Tüm hakları saklıdır</p>
          </div>
        </footer>
      </main>
    </>
  )
}
