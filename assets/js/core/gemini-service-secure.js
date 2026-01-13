// gemini-service-secure.js - Secure frontend client (No API keys exposed!)
// This version calls the backend proxy instead of Gemini API directly

// Configuration
// Always use Cloudflare Worker (local & production)
const API_BASE_URL = 'https://moral-api.hanirafg.workers.dev';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// State
let quotaStats = null;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get chat response from secure backend proxy
 * @param {string} prompt - User's message
 * @param {Array} chatHistory - Previous chat history
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<string>} - AI response text
 */
export async function getChatResponse(prompt, chatHistory = [], retryCount = 0) {
    try {
        console.log(`🔒 Calling secure proxy API... (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);

        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                chatHistory: chatHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content || msg.parts?.[0]?.text || '' }]
                }))
            })
        });

        const data = await response.json();

        // Handle errors
        if (!response.ok) {
            // If server suggests retry (key rotated)
            if (data.shouldRetry && retryCount < MAX_RETRIES) {
                console.log('🔄 Server rotated key, retrying...');
                await delay(RETRY_DELAY);
                return getChatResponse(prompt, chatHistory, retryCount + 1);
            }

            throw new Error(data.error || `Server error: ${response.status}`);
        }

        // Success - update stats
        if (data.stats) {
            quotaStats = data.stats;
            console.log(`📊 Proxy stats: Key #${data.stats.keyIndex} | Requests: ${data.stats.totalRequests} | Available keys: ${data.stats.availableKeys}`);
        }

        return data.response;

    } catch (error) {
        console.error('❌ Error calling proxy API:', error);

        // Network error - retry
        if (retryCount < MAX_RETRIES && (
            error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError') ||
            error.message.includes('timeout')
        )) {
            console.log(`🔄 Network error, retrying in ${RETRY_DELAY}ms...`);
            await delay(RETRY_DELAY);
            return getChatResponse(prompt, chatHistory, retryCount + 1);
        }

        // User-friendly error messages
        if (error.message.includes('All API keys')) {
            return 'Maaf, sistem sedang mencapai batas penggunaan. Silakan coba lagi dalam beberapa saat.';
        }
        if (error.message.includes('Failed to fetch')) {
            return 'Tidak dapat terhubung ke server. Pastikan koneksi internet Anda aktif.';
        }
        if (error.message.includes('Too many requests')) {
            return 'Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.';
        }

        return `Terjadi kesalahan: ${error.message}. Silakan coba lagi.`;
    }
}

/**
 * Get quota statistics from backend
 * @returns {Promise<Object>} - Quota stats
 */
export async function getQuotaStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/stats`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to get stats');
        }

        quotaStats = data.stats;
        return data.stats;

    } catch (error) {
        console.error('❌ Error getting quota status:', error);
        return null;
    }
}

/**
 * Get cached quota stats (no API call)
 * @returns {Object|null} - Last known stats
 */
export function getCachedQuotaStatus() {
    return quotaStats;
}

/**
 * Get response with document context
 * @param {string} context - Document/file context
 * @param {string} prompt - User's question about the context
 * @param {Array} chatHistory - Previous chat history
 * @returns {Promise<string>} - AI response text
 */
export async function getResponseWithContext(context, prompt, chatHistory = []) {
    // For context-based queries, we send the context along with the prompt
    const contextPrompt = `Berdasarkan dokumen/konten berikut:

${context.substring(0, 2000)}${context.length > 2000 ? '...' : ''}

Pertanyaan: ${prompt}

Berikan analisis yang komprehensif dan praktis berdasarkan konten tersebut. Fokus pada insights yang berguna dan actionable.`;

    return getChatResponse(contextPrompt, chatHistory);
}

/**
 * Check if backend is healthy
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();

        if (data.status === 'ok') {
            console.log('✅ Backend proxy is healthy');
            return true;
        }

        console.warn('⚠️ Backend proxy unhealthy:', data);
        return false;

    } catch (error) {
        console.error('❌ Backend proxy unreachable:', error);
        return false;
    }
}

// Auto-check backend health on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkBackendHealth().then(healthy => {
            if (!healthy) {
                console.warn('⚠️ Backend proxy tidak dapat diakses. Chat mungkin tidak berfungsi.');
            }
        });
    });
} else {
    checkBackendHealth();
}

// Export for window access (legacy compatibility)
window.getChatResponse = getChatResponse;
window.getQuotaStatus = getQuotaStatus;
window.checkBackendHealth = checkBackendHealth;

console.log('✅ Secure Gemini service loaded (No API keys exposed!)');
console.log(`🔗 Backend: ${API_BASE_URL}`);
