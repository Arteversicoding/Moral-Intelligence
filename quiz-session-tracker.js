// quiz-session-tracker.js - Track Quiz Sessions
import { db } from './firebase-init.js';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Save a quiz session to Firestore
 * Call this function when a user completes a quiz or has a significant interaction
 */
export async function saveQuizSession(sessionData) {
    try {
        // Get current user
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (!userData.uid) {
            console.warn('No user logged in, skipping quiz session save');
            return null;
        }

        const quizSessionRef = collection(db, 'quizSessions');
        
        const session = {
            userId: userData.uid,
            userEmail: userData.email,
            userName: userData.displayName || userData.email || 'Anonymous',
            
            // Session details
            sessionType: sessionData.type || 'quiz', // 'quiz', 'chat', 'practice'
            topic: sessionData.topic || 'General',
            questionsAnswered: sessionData.questionsAnswered || 0,
            correctAnswers: sessionData.correctAnswers || 0,
            score: sessionData.score || 0,
            
            // Timing
            duration: sessionData.duration || 0, // in seconds
            startTime: sessionData.startTime || new Date().toISOString(),
            endTime: new Date().toISOString(),
            
            // Additional data
            difficulty: sessionData.difficulty || 'medium',
            completed: sessionData.completed !== false, // default true
            
            // Metadata
            timestamp: serverTimestamp(),
            device: getDeviceType(),
            browser: getBrowserInfo()
        };

        const docRef = await addDoc(quizSessionRef, session);
        console.log('✅ Quiz session saved with ID:', docRef.id);
        
        return docRef.id;
    } catch (error) {
        console.error('❌ Error saving quiz session:', error);
        return null;
    }
}

/**
 * Get quiz sessions for a specific user
 */
export async function getUserQuizSessions(userId) {
    try {
        const quizSessionRef = collection(db, 'quizSessions');
        const q = query(quizSessionRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        
        const sessions = [];
        snapshot.forEach(doc => {
            sessions.push({ id: doc.id, ...doc.data() });
        });
        
        return sessions;
    } catch (error) {
        console.error('Error getting user quiz sessions:', error);
        return [];
    }
}

/**
 * Get user's quiz statistics
 */
export async function getUserQuizStats(userId) {
    try {
        const sessions = await getUserQuizSessions(userId);
        
        if (sessions.length === 0) {
            return {
                totalSessions: 0,
                totalQuestions: 0,
                totalCorrect: 0,
                averageScore: 0,
                totalTime: 0
            };
        }

        const stats = {
            totalSessions: sessions.length,
            totalQuestions: sessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0),
            totalCorrect: sessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0),
            totalTime: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
            completedSessions: sessions.filter(s => s.completed).length
        };

        stats.averageScore = stats.totalQuestions > 0 
            ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) 
            : 0;

        return stats;
    } catch (error) {
        console.error('Error calculating quiz stats:', error);
        return null;
    }
}

/**
 * Helper: Get device type
 */
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
        return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

/**
 * Helper: Get browser info
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    
    if (ua.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
    } else if (ua.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
    } else if (ua.indexOf('Safari') > -1) {
        browserName = 'Safari';
    } else if (ua.indexOf('Edge') > -1) {
        browserName = 'Edge';
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
        browserName = 'Opera';
    }
    
    return browserName;
}

/**
 * Quick save function for simple quiz completions
 * Use this in your quiz pages when a user completes a quiz
 */
export async function quickSaveQuizCompletion(questionsAnswered, correctAnswers, duration) {
    return await saveQuizSession({
        type: 'quiz',
        questionsAnswered,
        correctAnswers,
        score: Math.round((correctAnswers / questionsAnswered) * 100),
        duration,
        completed: true
    });
}

/**
 * Save a chat/AI interaction session
 */
export async function saveChatSession(messageCount, duration, topic = 'General') {
    return await saveQuizSession({
        type: 'chat',
        topic,
        questionsAnswered: messageCount,
        duration,
        completed: true
    });
}

// Auto-track page sessions (optional)
let sessionStartTime = null;
let messageCount = 0;

/**
 * Start tracking a session automatically
 */
export function startSessionTracking() {
    sessionStartTime = Date.now();
    messageCount = 0;
    console.log('📊 Session tracking started');
}

/**
 * Increment message count (call this when user sends a message)
 */
export function incrementMessageCount() {
    messageCount++;
}

/**
 * End and save the session automatically
 */
export async function endSessionTracking(type = 'chat', additionalData = {}) {
    if (!sessionStartTime) {
        console.warn('No session to end');
        return;
    }

    const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
    
    await saveQuizSession({
        type,
        questionsAnswered: messageCount,
        duration,
        completed: true,
        ...additionalData
    });

    sessionStartTime = null;
    messageCount = 0;
    
    console.log('📊 Session tracking ended and saved');
}

// Example integration for quiz pages:
// 
// Import at the top of your quiz page:
// import { quickSaveQuizCompletion } from './quiz-session-tracker.js';
//
// When quiz is completed:
// await quickSaveQuizCompletion(10, 8, 120); // 10 questions, 8 correct, 120 seconds

// Example integration for chat pages:
//
// Import at the top:
// import { startSessionTracking, incrementMessageCount, endSessionTracking } from './quiz-session-tracker.js';
//
// When page loads:
// startSessionTracking();
//
// When user sends message:
// incrementMessageCount();
//
// When leaving page or user logs out:
// await endSessionTracking('chat', { topic: 'Moral Education' });