// Apple Demo Hesabı için Firebase Firestore Veri Yapısı

// Demo hesap bilgileri
const demoAccount = {
  email: "demo@bilgoo.com",
  password: "DemoTest123!",
  userData: {
    username: "Apple_Reviewer_Demo",
    email: "demo@bilgoo.com",
    createdAt: "2025-08-19T10:00:00Z",
    totalQuizzes: 45,
    totalCorrect: 320,
    totalWrong: 88,
    totalScore: 15640,
    level: 8,
    xp: 8420,
    streak: 12,
    favoriteCategoryId: "genel-kultur",
    lastActive: "2025-08-19T12:00:00Z",
    achievements: [
      "first_quiz", "quiz_master", "perfect_score", 
      "social_butterfly", "week_streak", "level_5"
    ],
    statistics: {
      averageScore: 347,
      bestStreak: 18,
      totalPlayTime: 7200, // seconds
      bestCategory: "genel-kultur",
      worstCategory: "matematik",
      weeklyQuizzes: 12,
      monthlyQuizzes: 45
    },
    friends: [
      {
        userId: "friend1_demo",
        username: "TestUser1",
        addedAt: "2025-08-15T14:30:00Z",
        status: "online"
      },
      {
        userId: "friend2_demo", 
        username: "TestUser2",
        addedAt: "2025-08-16T09:15:00Z",
        status: "offline"
      },
      {
        userId: "friend3_demo",
        username: "TestUser3", 
        addedAt: "2025-08-17T16:45:00Z",
        status: "in_game"
      }
    ],
    recentGames: [
      {
        gameId: "game_demo_1",
        categoryId: "genel-kultur",
        score: 850,
        correctAnswers: 9,
        totalQuestions: 10,
        duration: 180,
        difficulty: "medium",
        completedAt: "2025-08-19T11:30:00Z",
        rank: 1
      },
      {
        gameId: "game_demo_2", 
        categoryId: "tarih",
        score: 720,
        correctAnswers: 8,
        totalQuestions: 10,
        duration: 165,
        difficulty: "medium",
        completedAt: "2025-08-19T10:15:00Z",
        rank: 2
      },
      {
        gameId: "game_demo_3",
        categoryId: "bilim",
        score: 650,
        correctAnswers: 7,
        totalQuestions: 10, 
        duration: 200,
        difficulty: "hard",
        completedAt: "2025-08-18T19:45:00Z",
        rank: 3
      }
    ],
    jokers: {
      fifty_fifty: 3,
      hint: 2,
      time_extend: 4,
      skip: 1
    },
    preferences: {
      theme: "dark",
      language: "tr",
      soundEnabled: true,
      notificationsEnabled: true,
      difficulty: "medium",
      autoplay: false
    }
  }
};

// Kategoriler için demo veri
const demoCategories = [
  {
    id: "genel-kultur",
    name: "Genel Kültür",
    icon: "fas fa-brain",
    totalQuestions: 1250,
    userPlayed: 15,
    userBestScore: 920
  },
  {
    id: "tarih", 
    name: "Tarih",
    icon: "fas fa-landmark",
    totalQuestions: 890,
    userPlayed: 8,
    userBestScore: 780
  },
  {
    id: "bilim",
    name: "Bilim",
    icon: "fas fa-flask",
    totalQuestions: 1100,
    userPlayed: 12,
    userBestScore: 850
  },
  {
    id: "spor",
    name: "Spor", 
    icon: "fas fa-futbol",
    totalQuestions: 750,
    userPlayed: 5,
    userBestScore: 690
  },
  {
    id: "sanat",
    name: "Sanat ve Edebiyat",
    icon: "fas fa-palette",
    totalQuestions: 920,
    userPlayed: 3,
    userBestScore: 620
  },
  {
    id: "cografya",
    name: "Coğrafya",
    icon: "fas fa-globe",
    totalQuestions: 680,
    userPlayed: 2,
    userBestScore: 510
  }
];

// Lider tablosu için demo veri
const demoLeaderboard = [
  {
    rank: 1,
    username: "QuizMaster2025",
    totalScore: 28450,
    level: 15,
    avatar: "👑"
  },
  {
    rank: 2,
    username: "BrainGenius", 
    totalScore: 24380,
    level: 13,
    avatar: "🧠"
  },
  {
    rank: 3,
    username: "Apple_Reviewer_Demo",
    totalScore: 15640,
    level: 8,
    avatar: "🍎"
  },
  {
    rank: 4,
    username: "SmartPlayer",
    totalScore: 14200,
    level: 7,
    avatar: "🎯"
  },
  {
    rank: 5,
    username: "KnowledgeSeeker",
    totalScore: 12980,
    level: 6,
    avatar: "📚"
  }
];

// Demo sorular (her kategori için birkaç örnek)
const demoQuestions = [
  {
    id: "demo_q1",
    categoryId: "genel-kultur",
    question: "Türkiye'nin başkenti neresidir?",
    options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Türkiye'nin başkenti 1923 yılından beri Ankara'dır."
  },
  {
    id: "demo_q2", 
    categoryId: "tarih",
    question: "Osmanlı İmparatorluğu hangi yılda kurulmuştur?",
    options: ["1299", "1326", "1354", "1389"],
    correctAnswer: 0,
    difficulty: "medium",
    explanation: "Osmanlı İmparatorluğu 1299 yılında Osman Gazi tarafından kurulmuştur."
  },
  {
    id: "demo_q3",
    categoryId: "bilim", 
    question: "Su'nun kimyasal formülü nedir?",
    options: ["H2O", "CO2", "O2", "H2SO4"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "Su molekülü iki hidrojen ve bir oksijen atomundan oluşur: H2O"
  }
];

// Firebase'de bu verileri kullanmak için:
// 1. Authentication: demo@bilgoo.com / DemoTest123!
// 2. Firestore: users/{demoUserId} koleksiyonuna userData'yı kaydet
// 3. categories koleksiyonuna demoCategories'i kaydet
// 4. leaderboard koleksiyonuna demoLeaderboard'u kaydet
// 5. questions koleksiyonuna demoQuestions'ı kaydet

export { demoAccount, demoCategories, demoLeaderboard, demoQuestions };
