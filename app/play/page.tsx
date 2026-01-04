'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const CATEGORIES: Record<string, { name: string; icon: string }> = {
  'genel-kultur': { name: 'Genel Kültür', icon: '🌍' },
  'tarih': { name: 'Tarih', icon: '📜' },
  'cografya': { name: 'Coğrafya', icon: '🗺️' },
  'bilim': { name: 'Bilim', icon: '🔬' },
  'edebiyat': { name: 'Edebiyat', icon: '📖' },
  'spor': { name: 'Spor', icon: '⚽' },
  'muzik': { name: 'Müzik', icon: '🎵' },
  'teknoloji': { name: 'Teknoloji', icon: '💻' }
};

function QuizGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'genel-kultur';
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push('/login');
      else loadQuestions();
    });
    return () => unsubscribe();
  }, [category]);

  const loadQuestions = async () => {
    try {
      const response = await fetch(`/languages/tr/questions.json`);
      const data = await response.json();
      const filtered = data.filter((q: any) => 
        q.category?.toLowerCase().replace(/ı/g, 'i').replace(/ /g, '-') === category
      );
      setQuestions(filtered.sort(() => Math.random() - 0.5).slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentIndex].correct) setScore(score + 10);
    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) setGameOver(true);
      else {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      }
    }, 2000);
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">Yükleniyor...</div>;
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Oyun Bitti!</h2>
          <div className="text-5xl font-bold text-primary mb-6">{score} Puan</div>
          <p className="text-gray-600 mb-8">{questions.length} sorudan {score / 10} doğru</p>
          <div className="flex gap-3">
            <button onClick={() => window.location.reload()} className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg">Tekrar</button>
            <button onClick={() => router.push('/')} className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg">Ana Sayfa</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const cat = CATEGORIES[category];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{cat?.icon}</span>
              <div>
                <h2 className="text-xl font-bold">{cat?.name}</h2>
                <p className="text-sm opacity-80">Soru {currentIndex + 1}/{questions.length}</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{timeLeft}s</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold mb-6">{q?.question}</h3>
          <div className="space-y-3">
            {q?.options.map((option: string, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left font-medium transition ${
                  showResult && i === q.correct ? 'bg-green-500 text-white' :
                  showResult && selectedAnswer === i && i !== q.correct ? 'bg-red-500 text-white' :
                  'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {String.fromCharCode(65 + i)}) {option}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between text-sm">
            <div>Puan: <span className="font-bold">{score}</span></div>
            <button onClick={() => router.push('/')} className="text-gray-500">Çıkış</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl">Yükleniyor...</div>}>
      <QuizGame />
    </Suspense>
  );
}
