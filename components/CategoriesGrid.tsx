'use client';

import Link from 'next/link';

const categories = [
  { id: 'genel-kultur', name: 'Genel Kültür', icon: '🌍', color: 'from-blue-500 to-blue-600', questions: 2500 },
  { id: 'tarih', name: 'Tarih', icon: '📜', color: 'from-red-500 to-red-600', questions: 1800 },
  { id: 'cografya', name: 'Coğrafya', icon: '🗺️', color: 'from-green-500 to-green-600', questions: 1500 },
  { id: 'bilim', name: 'Bilim', icon: '🔬', color: 'from-purple-500 to-purple-600', questions: 1200 },
  { id: 'edebiyat', name: 'Edebiyat', icon: '📖', color: 'from-pink-500 to-pink-600', questions: 1000 },
  { id: 'spor', name: 'Spor', icon: '⚽', color: 'from-orange-500 to-orange-600', questions: 900 },
  { id: 'muzik', name: 'Müzik', icon: '🎵', color: 'from-cyan-500 to-cyan-600', questions: 800 },
  { id: 'teknoloji', name: 'Teknoloji', icon: '💻', color: 'from-indigo-500 to-indigo-600', questions: 700 },
];

export default function CategoriesGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kategorileri Keşfet
          </h2>
          <p className="text-xl text-gray-600">
            İstediğin kategoride bilgini test et ve lider tablosunda yerini al
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: typeof categories[0] }) {
  return (
    <Link
      href={`/play?category=${category.id}`}
      className="card p-6 group relative overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative">
        {/* Icon */}
        <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          {category.icon}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {category.name}
        </h3>

        {/* Stats */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Soru</div>
            <div className="text-lg font-bold text-purple-600">{category.questions}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Doğru</div>
            <div className="text-lg font-bold text-green-600">0</div>
          </div>
        </div>

        {/* Button */}
        <button
          className={`w-full bg-gradient-to-r ${category.color} text-white py-3 rounded-lg font-semibold flex items-center justify-center group-hover:shadow-lg transition-all duration-200`}
        >
          <span>Başla</span>
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>
    </Link>
  );
}
