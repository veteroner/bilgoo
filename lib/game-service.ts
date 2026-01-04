import { auth, database, firestore } from './firebase';
import { ref, set, get, update, push } from 'firebase/database';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// User profile oluştur
export async function createUserProfile(userId: string, email: string, displayName?: string) {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: null,
        coins: 0,
        stats: {
          totalGames: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          highestScore: 0
        },
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      console.log('User profile created:', userId);
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
}

// Skoru kaydet (Realtime Database)
export async function saveScore(userId: string, category: string, score: number, username: string) {
  try {
    const scoreRef = ref(database, `scores/${category}/${userId}`);
    const snapshot = await get(scoreRef);
    
    // Eğer mevcut skor daha düşükse güncelle
    if (!snapshot.exists() || snapshot.val().score < score) {
      await set(scoreRef, {
        score,
        username,
        timestamp: Date.now()
      });
      console.log('Score saved:', { category, score });
    }
  } catch (error) {
    console.error('Error saving score:', error);
  }
}

// Oyun geçmişini kaydet (Firestore)
export async function saveGameHistory(
  userId: string,
  category: string,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  questions: any[]
) {
  try {
    const gameRef = collection(firestore, 'gameHistory');
    await addDoc(gameRef, {
      userId,
      category,
      score,
      totalQuestions,
      correctAnswers,
      questions,
      timestamp: serverTimestamp()
    });
    
    console.log('Game history saved');
  } catch (error) {
    console.error('Error saving game history:', error);
  }
}

// Kullanıcı istatistiklerini güncelle
export async function updateUserStats(
  userId: string,
  totalQuestions: number,
  correctAnswers: number,
  score: number
) {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const currentStats = userSnap.data().stats || {
        totalGames: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        highestScore: 0
      };
      
      const newTotalGames = currentStats.totalGames + 1;
      const newTotalQuestions = currentStats.totalQuestions + totalQuestions;
      const newCorrectAnswers = currentStats.correctAnswers + correctAnswers;
      const newAccuracy = Math.round((newCorrectAnswers / newTotalQuestions) * 100);
      const newHighestScore = Math.max(currentStats.highestScore, score);
      
      await updateDoc(userRef, {
        stats: {
          totalGames: newTotalGames,
          totalQuestions: newTotalQuestions,
          correctAnswers: newCorrectAnswers,
          accuracy: newAccuracy,
          highestScore: newHighestScore
        },
        coins: (userSnap.data().coins || 0) + (correctAnswers * 5) // Her doğru cevap 5 coin
      });
      
      console.log('User stats updated');
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

// Kullanıcı istatistiklerini getir
export async function getUserStats(userId: string) {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

// Liderlik tablosunu getir (category bazında)
export async function getLeaderboard(category: string, limit: number = 100) {
  try {
    const leaderboardRef = ref(database, `scores/${category}`);
    const snapshot = await get(leaderboardRef);
    
    if (snapshot.exists()) {
      const scores = snapshot.val();
      const leaderboard = Object.entries(scores).map(([userId, data]: any) => ({
        userId,
        ...data
      })).sort((a: any, b: any) => b.score - a.score).slice(0, limit);
      
      return leaderboard;
    }
    return [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}
