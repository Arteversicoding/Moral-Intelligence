// config.js - Versi sederhana tanpa rate limiting untuk debug - Updated: 2025-01-01 14:30
export const firebaseConfig = {
    apiKey: "AIzaSyBwbrFIX-ywTm5eAOTNIRlbAiBmnOhsRL0",
    authDomain: "mi-app-8ff5c.firebaseapp.com",
    projectId: "mi-app-8ff5c",
    storageBucket: "mi-app-8ff5c.appspot.com", // ✅ FIX DI SINI
    messagingSenderId: "320717032422",
    appId: "1:320717032422:web:452ebbffb5055f83a02427",
    measurementId: "G-Q1GV4BGLBR"
};  

// ========================================
// 🔑 API KEY ROTATION SYSTEM
// ========================================

// Array of all available API keys
export const geminiApiKeys = [
    // Original batch (11 keys)
    "AIzaSyAkIyXZk5Xk36eG4hrQ0aKlRlkg6B5gaw8", // Key 0
    "AIzaSyDNn9PAXXe5vkPL2kesLCov2yhvK5Z_hrk", // Key 1
    "AIzaSyA_Muoo3zPUUDz8VJqxGX6L7ihBk2kSY5E", // Key 2
    "AIzaSyAypw-D7tQt94YT0-w2aZID6CjP3IaYyhk", // Key 3
    "AIzaSyApCcXjl9LgbYtQ6ayNkHL8ZWKia7QIGqA", // Key 4
    "AIzaSyD8qGfqXGXDbWCocN4gu1MrGWwISgM4z2w", // Key 5
    "AIzaSyAi6ja3iD0X2XHDMeHr1lCAwt9WPbK9vx8", // Key 6
    "AIzaSyA6ERLEXZjG_hikfoHnmiHCfCKYwLijSdM", // Key 7
    "AIzaSyBSEtCxq5P7WRUPkThbVie8EmqperQw1T4", // Key 8
    "AIzaSyCXCfEZ76JHsffPo11JEzLcWNqgmX2SLB8", // Key 9
    "AIzaSyCmBmKwUACg4o1k8b9rT7OEXz9snHw3KAY", // Key 10

    // Second batch (10 keys)
    "AIzaSyC9LjK655-35UOYeiQiGSEvXZaNjopqQSA", // Key 11
    "AIzaSyApjpmK7n1hoVFXYEHfTvHG3_NQYFEnp6M", // Key 12
    "AIzaSyC70vlDUsFHI0FC--_MDc9ipPelsWYNBPk", // Key 13
    "AIzaSyAWENrJhgGreBDcHZYh878sHPfIPXWpQUM", // Key 14
    "AIzaSyAJa475Zq8TCyMznhYZ2utHYpm-53VplJI", // Key 15
    "AIzaSyBbYs24ttO_lVo42geKWBHp8K0VbEvCMww", // Key 16
    "AIzaSyA7PnHyMLiPAAGecXRpX6ackKkhNE2O6Lk", // Key 17
    "AIzaSyDYxeXyCdTeTV0z9IFdq-A3-_9PpWlnea0", // Key 18
    "AIzaSyD4TLDrXXd1LHpDRyI4pUNNIo5UsuXAuB4", // Key 19
    "AIzaSyBLmMpuAcrkOmK97rCw8F1nfBmwCZ_mKyE", // Key 20

    // Third batch (10 keys)
    "AIzaSyBjZMLm37dUOi0HLMYHWC2Xjl3BZtYuXI4", // Key 21
    "AIzaSyC6rsxLfSbAssBJdspljIdYK9I2N22qgMk", // Key 22
    "AIzaSyAAkPqFVaZPvYUgpYD4bgVPlSy6Zx7juMI", // Key 23
    "AIzaSyC4T4ThZY4zVBcIqY0nn6NpyiT8broc5y4", // Key 24
    "AIzaSyDYBn71ANFnMjwuNHcRtHj2IwzlOMQs_VU", // Key 25
    "AIzaSyCmuIDNkV8NhmIZO4ko6BFKhSQQdb3z4yg", // Key 26
    "AIzaSyB_G6TldWTuGUkoox_Inpem0JWUYhSwQY0", // Key 27
    "AIzaSyDb3a3XoNEqA_CdaUSbt11ia9LeNS1obd4", // Key 28
    "AIzaSyDob9xpwXEF4jZ5XhKKycbVDNzyrEfemfU", // Key 29
    "AIzaSyBGcR0IavPDFy_HGf8ij1s-tbXH7TX6G10", // Key 30

    // Fourth batch (15 keys) - Added 2025-01-28
    "AIzaSyA-ZoIRZlgoTkmX_qThSBZ01ZA-0ih6YV4", // Key 31
    "AIzaSyCOF4_0huNa6bVFdUVrxR20SZCTeujK7s0", // Key 32
    "AIzaSyAqDQ6rsPphNIRssDnN9Uuk7-tFZgCQdFw", // Key 33
    "AIzaSyBlj2WDaKWMhH_tzHheIS2f46rdOcco1E8", // Key 34
    "AIzaSyA8BHi7EaXMeSjzjFG7HEzPKJqbT4QQTjQ", // Key 35
    "AIzaSyCPgRFbNAjSbcVYsieH0wEgkjk-11Ww14E", // Key 36
    "AIzaSyBBfi5gbRmD6E5fokpnlkMpyrSVXyd3fqE", // Key 37
    "AIzaSyBd3GTqWhL4b0W4xCyf5zXepPMNrMmAHP4", // Key 38
    "AIzaSyC6TlNxpwrMO6Vu3XDkfPt_XrGqwngv7cI", // Key 39
    "AIzaSyCrHwihPS5McIeMOnkTh2ROQa5E9Bv55LA", // Key 40
    "AIzaSyCOkVJ5c-m-YzoQr9HgnLZ7Ms-wNfPihFU", // Key 41
    "AIzaSyBi7yQcdecv-DCa7JISf6Of85K8MlYGb8c", // Key 42
    "AIzaSyCA4LDys6Rz_w2UswC1i2UrS4DOSY4jF68", // Key 43
    "AIzaSyBpMLtkYe1dmElWyDQlxz6pKP5Ddi0-EaI", // Key 44
    "AIzaSyCTzN1ZNx8UFj7HLP0POolJIiPJd912L6Y"  // Key 45
];

// Konfigurasi quota per API key (Free Tier Gemini)
export const API_KEY_LIMITS = {
    RPM: 15,        // Requests per minute per key
    DAILY: 1500,    // Daily requests per key
    MIN_INTERVAL: 4000  // Minimum 4 seconds between requests
};

// ========================================
// API Key Rotation Manager
// ========================================
class APIKeyManager {
    constructor() {
        this.currentKeyIndex = parseInt(localStorage.getItem('gemini_current_key_index') || '0');
        this.loadKeyStats();

        // Auto-skip ke available key saat initialization
        if (!this.canUseCurrentKey()) {
            console.warn(`⚠️ Key #${this.currentKeyIndex} not available on init, finding next available...`);
            const rotated = this.rotateToNextKey();
            if (!rotated) {
                console.error('❌ No available keys on initialization!');
            } else {
                console.log(`✅ Auto-switched to Key #${this.currentKeyIndex} on init`);
            }
        }
    }

    // Load stats untuk semua keys dari localStorage
    loadKeyStats() {
        const today = new Date().toDateString();
        const savedStats = localStorage.getItem('gemini_key_stats');

        if (savedStats) {
            try {
                this.keyStats = JSON.parse(savedStats);

                // Reset daily counts jika hari berbeda
                Object.keys(this.keyStats).forEach(keyIndex => {
                    if (this.keyStats[keyIndex].lastReset !== today) {
                        this.keyStats[keyIndex].dailyCount = 0;
                        this.keyStats[keyIndex].lastReset = today;
                        this.keyStats[keyIndex].lastRequestTime = 0;
                    }
                });
            } catch (e) {
                this.initializeKeyStats();
            }
        } else {
            this.initializeKeyStats();
        }
    }

    // Initialize stats untuk semua keys
    initializeKeyStats() {
        this.keyStats = {};
        const today = new Date().toDateString();

        geminiApiKeys.forEach((_, index) => {
            this.keyStats[index] = {
                dailyCount: 0,
                lastRequestTime: 0,
                lastReset: today,
                failCount: 0,
                isBlocked: false
            };
        });

        this.saveKeyStats();
    }

    // Save stats ke localStorage
    saveKeyStats() {
        localStorage.setItem('gemini_key_stats', JSON.stringify(this.keyStats));
    }

    // Get current active API key
    getCurrentKey() {
        return geminiApiKeys[this.currentKeyIndex];
    }

    // Get current key index
    getCurrentKeyIndex() {
        return this.currentKeyIndex;
    }

    // Check if current key is available
    canUseCurrentKey() {
        const stats = this.keyStats[this.currentKeyIndex];

        if (!stats || stats.isBlocked) {
            return false;
        }

        // Check daily limit
        if (stats.dailyCount >= API_KEY_LIMITS.DAILY) {
            console.warn(`⚠️ Key ${this.currentKeyIndex} mencapai daily limit (${stats.dailyCount}/${API_KEY_LIMITS.DAILY})`);
            return false;
        }

        // Check rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - stats.lastRequestTime;

        if (timeSinceLastRequest < API_KEY_LIMITS.MIN_INTERVAL) {
            console.log(`⏳ Key ${this.currentKeyIndex} dalam cooldown (${API_KEY_LIMITS.MIN_INTERVAL - timeSinceLastRequest}ms)`);
            return false;
        }

        return true;
    }

    // Rotate to next available key
    rotateToNextKey() {
        const startIndex = this.currentKeyIndex;
        let attempts = 0;

        while (attempts < geminiApiKeys.length) {
            this.currentKeyIndex = (this.currentKeyIndex + 1) % geminiApiKeys.length;
            attempts++;

            if (this.canUseCurrentKey()) {
                console.log(`✅ Rotated to API Key #${this.currentKeyIndex}`);
                localStorage.setItem('gemini_current_key_index', this.currentKeyIndex.toString());
                return true;
            }
        }

        // Semua keys tidak available
        console.error('❌ Semua API keys mencapai limit atau diblokir!');
        return false;
    }

    // Mark request for current key
    markRequest() {
        const stats = this.keyStats[this.currentKeyIndex];
        stats.dailyCount++;
        stats.lastRequestTime = Date.now();
        this.saveKeyStats();

        console.log(`📊 Key #${this.currentKeyIndex}: ${stats.dailyCount}/${API_KEY_LIMITS.DAILY} requests today`);
    }

    // Mark key as failed
    markFailure(errorMessage = '') {
        const stats = this.keyStats[this.currentKeyIndex];
        stats.failCount++;

        // Jika error quota/429, block key untuk hari ini
        if (errorMessage.includes('quota') || errorMessage.includes('429')) {
            stats.isBlocked = true;
            console.warn(`🚫 Key #${this.currentKeyIndex} diblokir karena quota exceeded`);
        }

        this.saveKeyStats();
    }

    // Get overall statistics
    getOverallStats() {
        let totalRequests = 0;
        let availableKeys = 0;
        let blockedKeys = 0;

        Object.values(this.keyStats).forEach(stats => {
            totalRequests += stats.dailyCount;
            if (stats.isBlocked) {
                blockedKeys++;
            } else if (stats.dailyCount < API_KEY_LIMITS.DAILY) {
                availableKeys++;
            }
        });

        return {
            totalKeys: geminiApiKeys.length,
            currentKey: this.currentKeyIndex,
            totalRequests,
            availableKeys,
            blockedKeys,
            maxDailyCapacity: geminiApiKeys.length * API_KEY_LIMITS.DAILY
        };
    }

    // Reset blocked status (untuk testing atau manual reset)
    resetBlockedKeys() {
        Object.keys(this.keyStats).forEach(keyIndex => {
            this.keyStats[keyIndex].isBlocked = false;
            this.keyStats[keyIndex].failCount = 0;
        });
        this.saveKeyStats();
        console.log('✅ Semua blocked keys telah direset');
    }
}

// Create singleton instance
export const apiKeyManager = new APIKeyManager();

// Backward compatibility - export single key
export const geminiApiKey = apiKeyManager.getCurrentKey();

// Konfigurasi aplikasi
export const appConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    maxTokens: 2048,
    temperature: 0.7
};

// Fungsi untuk menampilkan notifikasi
export function showNotification(message, type = 'info') {
    const existingNotif = document.getElementById('api-notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const colors = {
        success: 'bg-green-100 text-green-800 border-green-200',
        error: 'bg-red-100 text-red-800 border-red-200',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    const notificationHTML = `
        <div id="api-notification" class="fixed top-4 right-4 z-50 ${colors[type]} border rounded-lg p-4 shadow-lg max-w-sm">
            <div class="flex items-center justify-between">
                <p class="text-sm font-medium">${message}</p>
                <button onclick="document.getElementById('api-notification').remove()" class="ml-3 text-lg leading-none">&times;</button>
            </div>
        </div>`;
    
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
    
    setTimeout(() => {
        const notif = document.getElementById('api-notification');
        if (notif) notif.remove();
    }, 5000);
}

// Test koneksi API - DISABLED (using Cloudflare Workers now)
async function testAPIConnection() {
    try {
        console.log('ℹ️ API test disabled - using Cloudflare Workers backend');
        return;

        // DISABLED - Old code
        /*
        console.log('🔍 Testing API connection with rotation...');

        // Check if we have keys
        if (!geminiApiKeys || geminiApiKeys.length === 0) {
            console.error('❌ No API keys configured!');
            showNotification('API keys belum dikonfigurasi!', 'error');
            return;
        }

        console.log(`📊 Total keys available: ${geminiApiKeys.length}`);
        console.log(`🔑 Starting with Key #${apiKeyManager.getCurrentKeyIndex()}`);

        // Import getChatResponse yang sudah support rotation
        const { getChatResponse } = await import('/assets/js/core/gemini-service.js');

        // Test dengan prompt sederhana - sistem akan auto-rotate jika needed
        const response = await getChatResponse("Hi");

        if (response && !response.includes('Error:') && !response.includes('Maaf') && !response.includes('gangguan') && !response.includes('limit')) {
            const stats = apiKeyManager.getOverallStats();
            console.log('✅ API connection successful');
            console.log(`📊 Current stats: Key #${stats.currentKey}, ${stats.availableKeys}/${stats.totalKeys} keys available`);
            showNotification(`API Gemini berhasil terhubung! (Key #${stats.currentKey})`, 'success');
        } else if (response.includes('limit')) {
            console.warn('⚠️ Quota issues detected, but rotation should handle it');
            showNotification('API terhubung dengan rotasi aktif', 'warning');
        } else {
            console.warn('⚠️ API responded but with issues');
            showNotification('API terhubung tetapi ada masalah kecil.', 'warning');
        }

    } catch (error) {
        console.error('❌ API connection test failed:', error);

        // Check if it's a quota error
        if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
            console.warn('⚠️ Quota error detected - rotation should handle this automatically');
            showNotification('Beberapa keys mencapai limit. Sistem akan auto-rotate.', 'warning');
        } else {
            showNotification('Test koneksi gagal. Sistem tetap akan mencoba auto-rotate saat digunakan.', 'info');
        }
        */
    } catch (error) {
        console.error('Error in testAPIConnection:', error);
    }
}

// Emergency utilities - accessible via console
window.emergencyResetAllKeys = function() {
    console.log('🚨 EMERGENCY RESET - Resetting all API keys...');
    apiKeyManager.resetBlockedKeys();

    // Reset counts juga
    Object.keys(apiKeyManager.keyStats).forEach(keyIndex => {
        apiKeyManager.keyStats[keyIndex].dailyCount = 0;
        apiKeyManager.keyStats[keyIndex].lastRequestTime = 0;
    });
    apiKeyManager.saveKeyStats();

    console.log('✅ All keys reset! Ready to use.');
    console.log(`📊 Available: ${apiKeyManager.getOverallStats().availableKeys}/${geminiApiKeys.length}`);
};

window.skipToNextKey = function() {
    const oldKey = apiKeyManager.getCurrentKeyIndex();
    const rotated = apiKeyManager.rotateToNextKey();

    if (rotated) {
        console.log(`✅ Skipped from Key #${oldKey} to Key #${apiKeyManager.getCurrentKeyIndex()}`);
    } else {
        console.error('❌ No available keys to skip to!');
    }
};

window.viewKeyStatus = function() {
    const stats = apiKeyManager.getOverallStats();
    console.log('📊 API Keys Status:');
    console.log(`   Total: ${stats.totalKeys}`);
    console.log(`   Available: ${stats.availableKeys}`);
    console.log(`   Blocked: ${stats.blockedKeys}`);
    console.log(`   Current: #${stats.currentKey}`);
    console.log(`   Total Requests: ${stats.totalRequests}/${stats.maxDailyCapacity}`);

    console.log('\n🔑 Individual Keys:');
    Object.keys(apiKeyManager.keyStats).forEach(keyIndex => {
        const stat = apiKeyManager.keyStats[keyIndex];
        const status = stat.isBlocked ? '🚫' : stat.dailyCount >= 1500 ? '⚠️' : '✅';
        console.log(`   ${status} Key #${keyIndex}: ${stat.dailyCount}/1500 requests`);
    });
};

// Export untuk global access
window.showNotification = showNotification;

// Inisialisasi saat DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Config loaded with API Key Rotation v2.0');
    console.log(`📊 Total API Keys: ${geminiApiKeys.length}`);
    console.log(`🔑 Current Key: #${apiKeyManager.getCurrentKeyIndex()}`);

    // DISABLE auto-test on production to avoid unnecessary quota usage
    // Users can manually test when needed
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

    if (isProduction) {
        console.log('🌐 Production mode - auto-test disabled to save quota');
        console.log('💡 API will be tested when first chat message is sent');
    } else {
        // Only test on localhost/development
        console.log('🛠️ Development mode - testing API connection...');
        setTimeout(() => {
            testAPIConnection();
        }, 3000);
    }
});