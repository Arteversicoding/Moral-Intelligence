// admin-stats-realtime.js - Real-time Statistics Management
import { db } from './firebase-init.js';
import { supabase } from './supabase.js';
import { 
    collection, 
    onSnapshot, 
    getDocs,
    query,
    orderBy,
    limit,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Initialize real-time statistics
export function initializeAdminStats() {
    console.log('Initializing admin stats...');
    
    // Set initial loading state
    updateStatDisplay('totalUsers', 'Loading...');
    updateStatDisplay('totalMaterials', 'Loading...');
    updateStatDisplay('totalQuizSessions', 'Loading...');
    updateStatDisplay('totalSurveyResponses', 'Loading...');
    
    // Start listeners
    setupUsersListener();
    setupMaterialsListener();
    setupQuizSessionsListener();
    setupSurveyResponsesListener();
    setupForumPostsListener();
}

// 1. Total Users - Real-time from userStats collection
function setupUsersListener() {
    try {
        const userStatsRef = collection(db, 'userStats');
        
        onSnapshot(userStatsRef, (snapshot) => {
            const totalUsers = snapshot.size;
            updateStatDisplay('totalUsers', totalUsers);
            console.log('Total Users:', totalUsers);
        }, (error) => {
            console.error('Error listening to users:', error);
            updateStatDisplay('totalUsers', 0);
        });
    } catch (error) {
        console.error('Error setting up users listener:', error);
        updateStatDisplay('totalUsers', 0);
    }
}

// 2. Total Materials - Real-time from Supabase Storage
async function setupMaterialsListener() {
    // Initial load
    await updateMaterialCount();
    
    // Poll every 30 seconds for changes
    setInterval(async () => {
        await updateMaterialCount();
    }, 30000);
}

async function updateMaterialCount() {
    try {
        const { data: files, error } = await supabase
            .storage
            .from('Mobile-Intelligence')
            .list('materi');

        if (error) {
            console.error('Error getting materials:', error);
            updateStatDisplay('totalMaterials', 0);
            return;
        }

        // Filter out placeholder files
        const actualFiles = files ? files.filter(f => f.name !== '.emptyFolderPlaceholder') : [];
        const totalMaterials = actualFiles.length;
        
        updateStatDisplay('totalMaterials', totalMaterials);
        console.log('Total Materials:', totalMaterials);
    } catch (error) {
        console.error('Error updating material count:', error);
        updateStatDisplay('totalMaterials', 0);
    }
}

// 3. Quiz Sessions - Real-time from quizSessions collection
function setupQuizSessionsListener() {
    try {
        const quizSessionsRef = collection(db, 'quizSessions');
        
        onSnapshot(quizSessionsRef, (snapshot) => {
            const totalSessions = snapshot.size;
            updateStatDisplay('totalQuizSessions', totalSessions);
            console.log('Quiz Sessions:', totalSessions);
        }, (error) => {
            console.error('Error listening to quiz sessions:', error);
            updateStatDisplay('totalQuizSessions', 0);
        });
    } catch (error) {
        console.error('Error setting up quiz sessions listener:', error);
        updateStatDisplay('totalQuizSessions', 0);
    }
}

// 4. Survey Responses - Real-time from surveyResponses collection
function setupSurveyResponsesListener() {
    try {
        const surveyRef = collection(db, 'surveyResponses');
        
        onSnapshot(surveyRef, (snapshot) => {
            const totalResponses = snapshot.size;
            updateStatDisplay('totalSurveyResponses', totalResponses);
            console.log('Survey Responses:', totalResponses);
            
            // Update the survey responses list
            displaySurveyResponses(snapshot);
        }, (error) => {
            console.error('Error listening to survey responses:', error);
            updateStatDisplay('totalSurveyResponses', 0);
        });
    } catch (error) {
        console.error('Error setting up survey responses listener:', error);
        updateStatDisplay('totalSurveyResponses', 0);
    }
}

// 5. Forum Posts
function setupForumPostsListener() {
    try {
        const postsRef = collection(db, 'posts');
        
        onSnapshot(postsRef, (snapshot) => {
            const totalPosts = snapshot.size;
            updateStatDisplay('totalForumPosts', totalPosts);
            console.log('Forum Posts:', totalPosts);
        }, (error) => {
            console.error('Error listening to forum posts:', error);
            updateStatDisplay('totalForumPosts', 0);
        });
    } catch (error) {
        console.error('Error setting up forum posts listener:', error);
        updateStatDisplay('totalForumPosts', 0);
    }
}

// Helper function to update stat displays
function updateStatDisplay(statId, value) {
    const elements = document.querySelectorAll(`#${statId}, [data-stat="${statId}"]`);
    
    if (elements.length === 0) {
        console.warn(`No elements found for stat: ${statId}`);
        return;
    }
    
    elements.forEach(el => {
        el.textContent = value;
        
        // Add pulse animation only for numeric values
        if (typeof value === 'number') {
            el.classList.add('stat-pulse');
            setTimeout(() => {
                el.classList.remove('stat-pulse');
            }, 2000);
        }
    });
}

// Display survey responses for admin
function displaySurveyResponses(snapshot) {
    const container = document.getElementById('survey-responses-list');
    if (!container) return;

    if (snapshot.empty) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-clipboard-list text-4xl mb-4"></i>
                <p>Belum ada survey response</p>
            </div>
        `;
        return;
    }

    const responses = [];
    snapshot.forEach(doc => {
        responses.push({ id: doc.id, ...doc.data() });
    });

    // Sort by timestamp (newest first)
    responses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = responses.map(response => `
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h4 class="font-bold text-lg text-gray-800">${response.userName || 'Anonymous'}</h4>
                    <p class="text-sm text-gray-500">${response.userEmail || 'No email'}</p>
                    <p class="text-xs text-gray-400 mt-1">
                        ${response.timestamp ? new Date(response.timestamp).toLocaleString('id-ID') : 'No date'}
                    </p>
                </div>
                <button onclick="viewSurveyDetail('${response.id}')" 
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <i class="fas fa-eye mr-2"></i>Detail
                </button>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-blue-50 p-3 rounded-lg">
                    <p class="text-xs text-blue-600 font-medium">Perangkat</p>
                    <p class="text-sm font-bold text-blue-800">${response.device || 'N/A'}</p>
                </div>
                <div class="bg-green-50 p-3 rounded-lg">
                    <p class="text-xs text-green-600 font-medium">Frekuensi</p>
                    <p class="text-sm font-bold text-green-800">${response.frequency || 'N/A'}</p>
                </div>
                <div class="bg-purple-50 p-3 rounded-lg">
                    <p class="text-xs text-purple-600 font-medium">Fitur Favorit</p>
                    <p class="text-sm font-bold text-purple-800">${response.mostUsedFeature || 'N/A'}</p>
                </div>
                <div class="bg-orange-50 p-3 rounded-lg">
                    <p class="text-xs text-orange-600 font-medium">Tujuan</p>
                    <p class="text-sm font-bold text-orange-800">${response.purpose || 'N/A'}</p>
                </div>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-xs text-gray-600 font-medium mb-2">Rating Rata-rata</p>
                <div class="flex items-center">
                    <span class="text-2xl font-bold text-yellow-600">${calculateAverageRating(response.ratings)}</span>
                    <span class="text-sm text-gray-500 ml-2">/ 5.0</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Calculate average rating
function calculateAverageRating(ratings) {
    if (!ratings) return 'N/A';
    const values = Object.values(ratings);
    if (values.length === 0) return 'N/A';
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(1);
}

// View survey detail in modal
window.viewSurveyDetail = async function(surveyId) {
    try {
        const docRef = doc(db, 'surveyResponses', surveyId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            showSurveyModal(data);
        } else {
            alert('Survey tidak ditemukan');
        }
    } catch (error) {
        console.error('Error fetching survey detail:', error);
        alert('Gagal memuat detail survey');
    }
};

// Show survey modal
function showSurveyModal(data) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">${data.userName || 'Anonymous'}</h2>
                    <p class="text-gray-600">${data.userEmail || 'No email'}</p>
                    <p class="text-sm text-gray-500 mt-1">
                        ${data.timestamp ? new Date(data.timestamp).toLocaleString('id-ID') : 'No date'}
                    </p>
                </div>
                <button onclick="this.closest('.fixed').remove()" 
                        class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <i class="fas fa-times text-xl text-gray-600"></i>
                </button>
            </div>
            
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Detail Penilaian</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${data.ratings ? Object.entries(data.ratings).map(([key, value]) => `
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-600 mb-2">${formatRatingKey(key)}</p>
                                <div class="flex items-center">
                                    <div class="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full" 
                                             style="width: ${(value/5)*100}%"></div>
                                    </div>
                                    <span class="ml-3 font-bold text-yellow-600">${value}/5</span>
                                </div>
                            </div>
                        `).join('') : '<p class="text-gray-500">No ratings available</p>'}
                    </div>
                </div>
                
                <div>
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Informasi Penggunaan</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <p class="text-sm text-blue-600 mb-1">Perangkat</p>
                            <p class="font-bold text-blue-800">${data.device || 'N/A'}</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <p class="text-sm text-green-600 mb-1">Frekuensi</p>
                            <p class="font-bold text-green-800">${data.frequency || 'N/A'}</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <p class="text-sm text-purple-600 mb-1">Fitur Favorit</p>
                            <p class="font-bold text-purple-800">${data.mostUsedFeature || 'N/A'}</p>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg">
                            <p class="text-sm text-orange-600 mb-1">Tujuan</p>
                            <p class="font-bold text-orange-800">${data.purpose || 'N/A'}</p>
                        </div>
                    </div>
                </div>
                
                ${data.additionalFeedback ? `
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Saran & Masukan</h3>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-gray-700">${data.additionalFeedback}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Format rating key for display
function formatRatingKey(key) {
    const labels = {
        textReadability: 'Teks Mudah Dibaca',
        colorLayout: 'Warna dan Tata Letak',
        attractiveDesign: 'Desain Menarik',
        crossPlatform: 'Lintas Platform',
        easeOfUse: 'Kemudahan Penggunaan',
        chatbotRelevance: 'Relevansi Chatbot',
        mediaSupport: 'Media Pendukung',
        materialClarity: 'Kejelasan Materi',
        questionVariety: 'Variasi Soal',
        learningSupport: 'Dukungan Pembelajaran'
    };
    return labels[key] || key;
}