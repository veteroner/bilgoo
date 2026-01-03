'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Bilgi Yarışmasının
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Yeni Adresi
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              8 farklı kategoride binlerce soru, arkadaşlarınla yarış,
              yeteneklerini geliştir ve lider tablosunda yerini al!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/categories"
                className="btn-primary text-center text-lg"
              >
                <span className="mr-2">🚀</span>
                Hemen Başla
              </Link>
              <Link
                href="/about"
                className="btn-secondary text-center text-lg"
              >
                <span className="mr-2">📖</span>
                Nasıl Oynanır?
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <StatItem value="10,000+" label="Soru" />
              <div className="h-12 w-px bg-gray-300" />
              <StatItem value="50,000+" label="Oyuncu" />
              <div className="h-12 w-px bg-gray-300" />
              <StatItem value="8" label="Kategori" />
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:h-[500px] flex items-center justify-center">
            <QuizCard />
            <FloatingIcon icon="🎯" className="absolute top-10 right-10" delay={0} />
            <FloatingIcon icon="⭐" className="absolute top-1/2 right-0" delay={1} />
            <FloatingIcon icon="🏆" className="absolute bottom-20 left-0" delay={2} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function QuizCard() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between items-center mb-6">
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Soru #1
        </span>
        <span className="text-orange-500 font-semibold">⏱️ 30s</span>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="text-lg font-semibold text-gray-800">
          Türkiye'nin başkenti neresidir?
        </p>
      </div>

      <div className="space-y-3">
        <QuizOption letter="A" text="İstanbul" />
        <QuizOption letter="B" text="Ankara" correct />
        <QuizOption letter="C" text="İzmir" />
        <QuizOption letter="D" text="Bursa" />
      </div>
    </div>
  );
}

function QuizOption({ letter, text, correct }: { letter: string; text: string; correct?: boolean }) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        correct
          ? 'bg-green-50 border-green-500 text-green-700'
          : 'border-gray-200 hover:border-purple-300'
      }`}
    >
      <span className="font-semibold">{letter})</span> {text}
    </div>
  );
}

function FloatingIcon({ icon, className, delay }: { icon: string; className: string; delay: number }) {
  return (
    <div
      className={`${className} bg-white rounded-2xl shadow-lg p-4 text-4xl animate-float`}
      style={{ animationDelay: `${delay}s` }}
    >
      {icon}
    </div>
  );
}
