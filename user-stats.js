// user-stats.js - Enhanced version with realtime tracking and material progress

import { auth, db } from './firebase-init.js';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, onSnapshot, collection, query, where } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

class UserStatsManager {
    constructor() {
        this.currentUser = null;
        this.unsubscribeListeners = [];
        this.statsCache = {
            activeDays: 0,
            forumPosts: 0,
            materialsRead: 0,
            materialsCompleted: 0
        };
        
        // Material tracking properties
        this.currentMaterial = null;
        this.progressInterval = null;
        this.readingStartTime = null;
        this.lastScrollPosition = 0;
        this.isTracking = false;
        this.progressThreshold = 0.8; // 80% for completion
        this.maxScrollReached = 0;
        this.totalScrollHeight = 0;

        console.log('Firebase db instance:', db);
        if (!db) {
            console.error('Firestore db is not initialized!');
            return;
        }
        
        this.initializeAuth();
        this.initializeMaterialTracking();
    }

    initializeAuth() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.currentUser = user;

                // Real-time active days calculation
                if (user.metadata.creationTime) {
                    const creationTime = new Date(user.metadata.creationTime);
                    const now = new Date();
                    const diffTime = Math.abs(now - creationTime);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    // Directly update the DOM for active-days
                    document.querySelectorAll('[data-stat="active-days"]').forEach(el => {
                        el.textContent = diffDays;
                    });
                }

                this.initializeUserStats();
                this.updateLastActiveDate();
                this.startRealtimeListeners();
            } else {
                this.currentUser = null;
                this.cleanup();
                 // Reset display on logout
                document.querySelectorAll('[data-stat="active-days"]').forEach(el => {
                    el.textContent = 0;
                });
            }
        });
    }

    async initializeUserStats() {
        if (!this.currentUser) return;
        
        try {
            const userStatsRef = doc(db, 'userStats', this.currentUser.uid);
            const statsDoc = await getDoc(userStatsRef);
            
            if (!statsDoc.exists()) {
                // Create initial stats for new user (rating removed)
                const initialStats = {
                    userId: this.currentUser.uid,
                    email: this.currentUser.email,
                    activeDays: 1,
                    forumPosts: 0,
                    materialsRead: 0,
                    materialsCompleted: 0,
                    materialsStarted: [],
                    materialsFinished: [],
                    firstLoginDate: serverTimestamp(),
                    lastActiveDate: serverTimestamp(),
                    activeDatesHistory: [new Date().toDateString()],
                    createdAt: serverTimestamp()
                };
                
                await setDoc(userStatsRef, initialStats);
                this.statsCache = initialStats;
            } else {
                const data = statsDoc.data();
                this.statsCache = {
                    activeDays: data.activeDays || 0,
                    forumPosts: data.forumPosts || 0,
                    materialsRead: data.materialsRead || 0,
                    materialsCompleted: data.materialsCompleted || 0
                };
            }
            
            this.updateStatsDisplay();
        } catch (error) {
            console.error('Error initializing user stats:', error);
        }
    }

    startRealtimeListeners() {
        if (!this.currentUser) return;

        // Listen to user stats changes
        const userStatsRef = doc(db, 'userStats', this.currentUser.uid);
        const unsubscribeStats = onSnapshot(userStatsRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                this.statsCache = {
                    activeDays: data.activeDays || 0,
                    forumPosts: data.forumPosts || 0,
                    materialsRead: data.materialsRead || 0,
                    materialsCompleted: data.materialsCompleted || 0
                };
                this.updateStatsDisplay();
            }
        });

        this.unsubscribeListeners.push(unsubscribeStats);

        // Listen to global forum posts for community stats
        const postsQuery = query(collection(db, 'posts'));
        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            const totalPosts = snapshot.size;
            this.updateGlobalStats('totalForumPosts', totalPosts);
        });

        this.unsubscribeListeners.push(unsubscribePosts);
    }

    async updateLastActiveDate() {
        if (!this.currentUser) return;
        
        try {
            const userStatsRef = doc(db, 'userStats', this.currentUser.uid);
            const today = new Date().toDateString();
            
            // Get current stats
            const statsDoc = await getDoc(userStatsRef);
            if (statsDoc.exists()) {
                const currentStats = statsDoc.data();
                const activeDatesHistory = currentStats.activeDatesHistory || [];
                
                // Check if today is already recorded
                if (!activeDatesHistory.includes(today)) {
                    // Add today to history and increment active days
                    await updateDoc(userStatsRef, {
                        activeDays: increment(1),
                        lastActiveDate: serverTimestamp(),
                        activeDatesHistory: [...activeDatesHistory, today]
                    });
                    
                    this.statsCache.activeDays += 1;
                    this.updateStatsDisplay();
                } else {
                    // Just update last active time
                    await updateDoc(userStatsRef, {
                        lastActiveDate: serverTimestamp()
                    });
                }
            }
        } catch (error) {
            console.error('Error updating last active date:', error);
        }
    }

    // Forum post tracking
    async incrementForumPosts() {
        if (!this.currentUser) return;
        
        try {
            const userStatsRef = doc(db, 'userStats', this.currentUser.uid);
            await updateDoc(userStatsRef, {
                forumPosts: increment(1),
                lastActiveDate: serverTimestamp()
            });
            
            // Update local cache immediately for better UX
            this.statsCache.forumPosts += 1;
            this.updateStatsDisplay();

            // Trigger custom event for other components
            window.dispatchEvent(new CustomEvent('forumPostAdded', {
                detail: { newCount: this.statsCache.forumPosts }
            }));

            console.log('Forum posts incremented:', this.statsCache.forumPosts);
        } catch (error) {
            console.error('Error incrementing forum posts:', error);
        }
    }

    // Material reading tracking
    async startReadingMaterial(materialId, materialName) {
        if (!this.currentUser) return;

        try {
            const userStatsRef = doc(db, 'userStats', this.currentUser.uid);
            const userStatsDoc = await getDoc(userStatsRef);
            
            if (userStatsDoc.exists()) {
                const data = userStatsDoc.data();
                const materialsStarted = data.materialsStarted || [];
                
                // Check if material is not already started
                const alreadyStarted = materialsStarted.find(m => m.id === materialId);
                
                if (!alreadyStarted) {
                    // Use current timestamp instead of serverTimestamp() in array
                    const now = new Date().toISOString();
                    
                    await updateDoc(userStatsRef, {
                        materialsRead: increment(1),
                        materialsStarted: [...materialsStarted, {
                            id: materialId,
                            name: materialName,
                            startedAt: now,
                            progress: 0
                        }],
                        lastActiveDate: serverTimestamp()
                    });

                    this.statsCache.materialsRead += 1;
                    this.updateStatsDisplay();

                    console.log('Started reading material:', materialName);
                }
            }
        } catch (error) {
            console.error('Error tracking material start:', error);
        }
    }

    async updateMaterialProgress(materialId, progress) {
        if (!this.currentUser) return;

        try {
            const userStatsRef = doc(db, 'userStats', this.currentUser.uid);
            const userStatsDoc = await getDoc(userStatsRef);
            
            if (userStatsDoc.exists()) {
                const data = userStatsDoc.data();
                const materialsStarted = data.materialsStarted || [];
                
                // Update progress for the material
                const updatedMaterials = materialsStarted.map(material => {
                    if (material.id === materialId) {
                        return { 
                            ...material, 
                            progress, 
                            lastRead: new Date().toISOString() // Use ISO string instead of serverTimestamp()
                        };
                    }
                    return material;
                });

                await updateDoc(userStatsRef, {
                    materialsStarted: updatedMaterials,
                    lastActiveDate: serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error updating material progress:', error);
        }
    }

    async completeMaterial(materialId, materialName) {
        if (!this.currentUser) return;

        try {
            const userStatsRef = doc(db, 'userStats', this.currentUser.uid);
            const userStatsDoc = await getDoc(userStatsRef);
            
            if (userStatsDoc.exists()) {
                const data = userStatsDoc.data();
                const materialsFinished = data.materialsFinished || [];
                
                // Check if material is not already completed
                const alreadyCompleted = materialsFinished.find(m => m.id === materialId);
                
                if (!alreadyCompleted) {
                    // Use current timestamp instead of serverTimestamp() in array
                    const now = new Date().toISOString();
                    
                    await updateDoc(userStatsRef, {
                        materialsCompleted: increment(1),
                        materialsFinished: [...materialsFinished, {
                            id: materialId,
                            name: materialName,
                            completedAt: now // Use ISO string instead of serverTimestamp()
                        }],
                        lastActiveDate: serverTimestamp()
                    });

                    this.statsCache.materialsCompleted += 1;
                    this.updateStatsDisplay();

                    // Show completion notification
                    this.showCompletionNotification(materialName);
                    console.log('Material completed:', materialName);
                }
            }
        } catch (error) {
            console.error('Error tracking material completion:', error);
        }
    }

    // Material tracking initialization
    initializeMaterialTracking() {
        // Set up scroll tracking
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Set up beforeunload tracking
        window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
        
        // Set up visibility change tracking
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    startMaterialTracking(materialId, materialName, materialType = 'document') {
        if (this.isTracking && this.currentMaterial?.id === materialId) {
            return; // Already tracking this material
        }

        // Stop previous tracking if any
        this.stopMaterialTracking();

        this.currentMaterial = {
            id: materialId,
            name: materialName,
            type: materialType,
            startTime: Date.now()
        };

        this.readingStartTime = Date.now();
        this.lastScrollPosition = window.pageYOffset;
        this.maxScrollReached = 0;
        this.isTracking = true;

        // Calculate total scrollable height
        this.updateScrollMetrics();

        // Start reading material tracking
        this.startReadingMaterial(materialId, materialName);

        // Start progress interval tracking
        this.progressInterval = setInterval(() => {
            this.updateProgress();
        }, 5000); // Update every 5 seconds

        console.log(`Started tracking material: ${materialName}`);
        this.showTrackingNotification(`Mulai membaca: ${materialName}`);
    }

    stopMaterialTracking() {
        if (!this.isTracking) return;

        // Clear interval
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }

        // Final progress update
        this.updateProgress();

        // Check if material should be marked as completed
        const progress = this.calculateProgress();
        if (progress >= this.progressThreshold) {
            this.markAsCompleted();
        }

        console.log(`Stopped tracking material: ${this.currentMaterial?.name}`);
        
        this.currentMaterial = null;
        this.isTracking = false;
        this.readingStartTime = null;
    }

    handleScroll() {
        if (!this.isTracking) return;

        const currentScroll = window.pageYOffset;
        
        // Update max scroll reached
        if (currentScroll > this.maxScrollReached) {
            this.maxScrollReached = currentScroll;
            
            // Update scroll metrics
            this.updateScrollMetrics();
            
            // Update progress immediately when user scrolls further
            this.updateProgress();
        }

        this.lastScrollPosition = currentScroll;
    }

    handlePageUnload() {
        if (this.isTracking) {
            this.stopMaterialTracking();
        }
    }

    handleVisibilityChange() {
        if (!this.isTracking) return;

        if (document.hidden) {
            // Page is hidden, pause tracking
            this.pauseTracking();
        } else {
            // Page is visible again, resume tracking
            this.resumeTracking();
        }
    }

    pauseTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    resumeTracking() {
        if (!this.progressInterval && this.isTracking) {
            this.progressInterval = setInterval(() => {
                this.updateProgress();
            }, 5000);
        }
    }

    updateScrollMetrics() {
        this.totalScrollHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        ) - window.innerHeight;
    }

    calculateProgress() {
        if (this.totalScrollHeight <= 0) return 0;
        
        const scrollProgress = Math.min(this.maxScrollReached / this.totalScrollHeight, 1);
        
        // Also consider time spent reading
        const timeProgress = Math.min((Date.now() - this.readingStartTime) / (2 * 60 * 1000), 1); // 2 minutes for full time progress
        
        // Combine scroll and time progress (weighted)
        return (scrollProgress * 0.7) + (timeProgress * 0.3);
    }

    updateProgress() {
        if (!this.isTracking || !this.currentMaterial) return;

        const progress = this.calculateProgress();

        // Update progress in Firebase
        this.updateMaterialProgress(this.currentMaterial.id, progress);

        // Update progress indicator if it exists
        this.updateProgressIndicator(progress);

        // Auto-complete if threshold reached
        if (progress >= this.progressThreshold && !this.currentMaterial.completed) {
            this.markAsCompleted();
        }
    }

    markAsCompleted() {
        if (!this.currentMaterial || this.currentMaterial.completed) return;

        this.currentMaterial.completed = true;
        this.currentMaterial.completedAt = Date.now();

        // Mark as completed in Firebase
        this.completeMaterial(this.currentMaterial.id, this.currentMaterial.name);

        console.log(`Material completed: ${this.currentMaterial.name}`);
    }

    updateProgressIndicator(progress) {
        const progressBar = document.getElementById('material-progress-bar');
        const progressText = document.getElementById('material-progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress * 100)}% selesai`;
        }
    }

    updateStatsDisplay() {
        // Update forum posts count
        const forumPostElements = document.querySelectorAll('[data-stat="forum-posts"]');
        forumPostElements.forEach(el => {
            el.textContent = this.statsCache.forumPosts;
        });

        // Update materials read count
        const materialsReadElements = document.querySelectorAll('[data-stat="materials-read"]');
        materialsReadElements.forEach(el => {
            el.textContent = this.statsCache.materialsRead;
        });

        // Update materials completed count
        const materialsCompletedElements = document.querySelectorAll('[data-stat="materials-completed"]');
        materialsCompletedElements.forEach(el => {
            el.textContent = this.statsCache.materialsCompleted;
        });

        // Update combined display for beranda
        const berandaStatsElements = document.querySelectorAll('[data-stat="post-forum"]');
        berandaStatsElements.forEach(el => {
            el.textContent = this.statsCache.forumPosts;
        });

        const berandaMateriElements = document.querySelectorAll('[data-stat="materi-selesai"]');
        berandaMateriElements.forEach(el => {
            el.textContent = this.statsCache.materialsCompleted;
        });
    }

    updateGlobalStats(statType, value) {
        const elements = document.querySelectorAll(`[data-global-stat="${statType}"]`);
        elements.forEach(el => {
            el.textContent = value;
        });
    }

    showCompletionNotification(materialName) {
        // Create and show completion notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-2xl">🎉</div>
                <div>
                    <div class="font-semibold">Materi Selesai!</div>
                    <div class="text-sm opacity-90">${materialName}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    showTrackingNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="text-lg">📖</div>
                <div class="text-sm font-medium">${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Method to manually mark material as completed
    forceCompleteMaterial() {
        if (this.isTracking && this.currentMaterial) {
            this.markAsCompleted();
        }
    }

    // Get current tracking status
    getTrackingStatus() {
        if (!this.isTracking) return null;
        
        return {
            material: this.currentMaterial,
            progress: this.calculateProgress(),
            readingTime: this.readingStartTime ? Date.now() - this.readingStartTime : 0,
            isCompleted: this.currentMaterial?.completed || false
        };
    }

    // Get current stats
    getStats() {
        return this.statsCache;
    }

    // Calculate streak (consecutive active days)
    calculateStreak() {
        if (!this.statsCache.activeDatesHistory) return 0;
        
        const dates = this.statsCache.activeDatesHistory
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => b - a); // Sort descending
        
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < dates.length; i++) {
            const date = new Date(dates[i]);
            date.setHours(0, 0, 0, 0);
            
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            
            if (date.getTime() === expectedDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    // Clean up listeners
    cleanup() {
        this.unsubscribeListeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.unsubscribeListeners = [];
        
        // Stop material tracking
        if (this.isTracking) {
            this.stopMaterialTracking();
        }
    }
}

// user-stats.js - Script untuk mengambil dan menampilkan statistik pengguna
console.log('🔄 Loading user stats...');

// Function to get quiz history from localStorage
function getQuizHistory() {
    try {
        const data = localStorage.getItem('quizHistory');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.warn('Error loading quiz history:', error);
        return [];
    }
}

// Function to get forum posts count (placeholder - sesuaikan dengan sistem forum Anda)
function getForumPostsCount() {
    try {
        const count = localStorage.getItem('userForumPosts');
        return count ? parseInt(count, 10) : 0;
    } catch (error) {
        console.warn('Error loading forum posts count:', error);
        return 0;
    }
}

// Function to calculate active days from quiz history
function getActiveDaysCount() {
    try {
        const quizHistory = getQuizHistory();
        const uniqueDays = new Set();
        
        quizHistory.forEach(quiz => {
            if (quiz.date) {
                const date = new Date(quiz.date).toDateString();
                uniqueDays.add(date);
            }
        });
        
        // Also add today if user has visited
        const today = new Date().toDateString();
        uniqueDays.add(today);
        
        return uniqueDays.size;
    } catch (error) {
        console.warn('Error calculating active days:', error);
        return 0;
    }
}

// Function to calculate average quiz score
function getAverageQuizScore() {
    try {
        const quizHistory = getQuizHistory();
        
        if (quizHistory.length === 0) {
            return 0;
        }
        
        const totalScore = quizHistory.reduce((sum, quiz) => {
            return sum + (quiz.overallScore || 0);
        }, 0);
        
        return Math.round(totalScore / quizHistory.length);
    } catch (error) {
        console.warn('Error calculating average score:', error);
        return 0;
    }
}

// Function to update all statistics in the profile page
function updateUserStatistics() {
    try {
        console.log('📊 Updating user statistics...');
        
        // Get statistics data
        const activeDays = getActiveDaysCount();
        const forumPosts = getForumPostsCount();
        const quizCompleted = getQuizHistory().length;
        const averageScore = getAverageQuizScore();
        
        // Update DOM elements
        const activeDaysEl = document.querySelector('[data-stat="active-days"]');
        const forumPostsEl = document.querySelector('[data-stat="forum-posts"]');
        const quizCompletedEl = document.querySelector('[data-stat="quiz-completed"]');
        const avgScoreEl = document.querySelector('[data-stat="avg-score"]');
        
        if (activeDaysEl) {
            activeDaysEl.textContent = activeDays;
            animateNumber(activeDaysEl, activeDays);
        }
        
        if (forumPostsEl) {
            forumPostsEl.textContent = forumPosts;
            animateNumber(forumPostsEl, forumPosts);
        }
        
        if (quizCompletedEl) {
            quizCompletedEl.textContent = quizCompleted;
            animateNumber(quizCompletedEl, quizCompleted);
        }
        
        if (avgScoreEl) {
            avgScoreEl.textContent = averageScore;
            animateNumber(avgScoreEl, averageScore);
        }
        
        console.log('✅ User statistics updated:', {
            activeDays,
            forumPosts,
            quizCompleted,
            averageScore
        });
        
    } catch (error) {
        console.error('Error updating user statistics:', error);
    }
}

// Function to animate numbers
function animateNumber(element, targetNumber) {
    const startNumber = 0;
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = Math.floor(easeOutQuart * targetNumber);
        
        element.textContent = currentNumber;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = targetNumber;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Function to increment forum posts (untuk testing atau ketika user posting di forum)
function incrementForumPosts() {
    try {
        const currentCount = getForumPostsCount();
        const newCount = currentCount + 1;
        localStorage.setItem('userForumPosts', newCount.toString());
        
        // Update display if element exists
        const forumPostsEl = document.querySelector('[data-stat="forum-posts"]');
        if (forumPostsEl) {
            forumPostsEl.textContent = newCount;
            animateNumber(forumPostsEl, newCount);
        }
        
        console.log('📝 Forum posts incremented to:', newCount);
        return newCount;
    } catch (error) {
        console.error('Error incrementing forum posts:', error);
        return 0;
    }
}

function decrementForumPosts() {
  try {
    const currentCount = getForumPostsCount();
    const newCount = currentCount > 0 ? currentCount - 1 : 0;
    localStorage.setItem('userForumPosts', newCount.toString());

    // Update display if element exists
    const forumPostsEl = document.querySelector('[data-stat="forum-posts"]');
    if (forumPostsEl) {
      forumPostsEl.textContent = newCount;
      animateNumber(forumPostsEl, newCount);
    }

    console.log('📝 Forum posts decremented to:', newCount);
    return newCount;
  } catch (error) {
    console.error('Error decrementing forum posts:', error);
    return 0;
  }
}


// Function to get detailed quiz statistics
function getDetailedQuizStats() {
    try {
        const quizHistory = getQuizHistory();
        
        if (quizHistory.length === 0) {
            return {
                totalCompleted: 0,
                averageScore: 0,
                bestScore: 0,
                latestScore: 0,
                improvement: 0
            };
        }
        
        const scores = quizHistory.map(quiz => quiz.overallScore || 0);
        const totalCompleted = quizHistory.length;
        const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / totalCompleted);
        const bestScore = Math.max(...scores);
        const latestScore = scores[0] || 0; // Latest is first (newest)
        
        // Calculate improvement (compare latest vs first attempt)
        const firstScore = scores[scores.length - 1] || 0;
        const improvement = totalCompleted > 1 ? latestScore - firstScore : 0;
        
        return {
            totalCompleted,
            averageScore,
            bestScore,
            latestScore,
            improvement
        };
    } catch (error) {
        console.error('Error getting detailed quiz stats:', error);
        return {
            totalCompleted: 0,
            averageScore: 0,
            bestScore: 0,
            latestScore: 0,
            improvement: 0
        };
    }
}

// Initialize statistics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 User stats script initialized');
    
    // Update statistics after a short delay to ensure DOM is ready
    setTimeout(updateUserStatistics, 500);
});

// Listen for quiz completion events (if dispatched from quiz page)
window.addEventListener('quizCompleted', (event) => {
    console.log('🎯 Quiz completed event received');
    
    // Update statistics after quiz completion
    setTimeout(updateUserStatistics, 1000);
});

// Export functions for use in other scripts
window.updateUserStatistics = updateUserStatistics;
window.getDetailedQuizStats = getDetailedQuizStats;
window.incrementForumPosts = incrementForumPosts;
window.getQuizHistory = getQuizHistory;

console.log('✅ User stats module loaded');


// Create global instance
const userStats = new UserStatsManager();

// Export functions for global use (updated to match previous interface)
window.userStats = userStats;
window.realtimeStats = userStats; // Alias for compatibility
window.incrementForumPosts = () => userStats.incrementForumPosts();
window.startReadingMaterial = (id, name) => userStats.startReadingMaterial(id, name);
window.updateMaterialProgress = (id, progress) => userStats.updateMaterialProgress(id, progress);
window.completeMaterial = (id, name) => userStats.completeMaterial(id, name);
window.startMaterialTracking = (id, name, type) => userStats.startMaterialTracking(id, name, type);
window.stopMaterialTracking = () => userStats.stopMaterialTracking();
window.forceCompleteMaterial = () => userStats.forceCompleteMaterial();

// Alias for material tracker compatibility
window.materialTracker = {
    startTracking: (id, name, type) => userStats.startMaterialTracking(id, name, type),
    stopTracking: () => userStats.stopMaterialTracking(),
    forceComplete: () => userStats.forceCompleteMaterial(),
    getTrackingStatus: () => userStats.getTrackingStatus()
};

export default userStats;