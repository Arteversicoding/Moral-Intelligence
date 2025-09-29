// gemini-service.js - Improved version compatible dengan existing system
import { geminiApiKey, appConfig } from "./config.js";

// Cache untuk konfigurasi AI
let genAI = null;
let GoogleGenerativeAI = null;
let availableModels = null;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Rate limiting management untuk free tier
let lastRequestTime = 0;
let requestCount = 0;
let dailyRequestCount = parseInt(localStorage.getItem('gemini_daily_requests') || '0');
let lastResetDate = localStorage.getItem('gemini_last_reset') || new Date().toDateString();

// Reset daily counter jika hari baru
if (lastResetDate !== new Date().toDateString()) {
    dailyRequestCount = 0;
    localStorage.setItem('gemini_daily_requests', '0');
    localStorage.setItem('gemini_last_reset', new Date().toDateString());
}

// Rate limiting constants untuk free tier
const FREE_TIER_LIMITS = {
    RPM: 15,           // Requests per minute
    DAILY: 1500,       // Daily requests
    MIN_INTERVAL: 4000 // Minimum interval between requests (4 detik)
};

// Inisialisasi Gemini AI
async function initializeGemini() {
    if (!genAI) {
        try {
            if (!GoogleGenerativeAI) {
                const module = await import('https://esm.run/@google/generative-ai');
                GoogleGenerativeAI = module.GoogleGenerativeAI;
            }
            genAI = new GoogleGenerativeAI(geminiApiKey);
            console.log('✅ Gemini AI initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Gemini AI:', error);
            genAI = null;
        }
    }
    return genAI;
}

// Fungsi untuk delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting check
async function checkRateLimit() {
    const now = Date.now();
    
    // Check daily limit
    if (dailyRequestCount >= FREE_TIER_LIMITS.DAILY) {
        throw new Error('Daily quota exceeded. Please wait until tomorrow or upgrade to paid plan.');
    }
    
    // Check minimum interval between requests
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < FREE_TIER_LIMITS.MIN_INTERVAL) {
        const waitTime = FREE_TIER_LIMITS.MIN_INTERVAL - timeSinceLastRequest;
        console.log(`🕒 Rate limiting: waiting ${waitTime}ms before next request`);
        await delay(waitTime);
    }
    
    lastRequestTime = Date.now();
    requestCount++;
    dailyRequestCount++;
    
    // Update localStorage
    localStorage.setItem('gemini_daily_requests', dailyRequestCount.toString());
}

// Fungsi untuk mendapatkan daftar model (prioritas free tier models)
async function getAvailableModels() {
    if (availableModels) return availableModels;
    
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        availableModels = data.models
            .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
            .map(model => model.name.replace('models/', ''))
            .filter(model => 
                // Prioritas model gratis yang stabil
                model.includes('gemini-1.5-flash') || 
                model.includes('gemini-pro') ||
                model.includes('gemini-1.5-pro')
            )
            .sort((a, b) => {
                // Flash models lebih cocok untuk free tier
                if (a.includes('flash')) return -1;
                if (b.includes('flash')) return 1;
                return 0;
            });
        
        console.log('✅ Available models:', availableModels);
        return availableModels;
    } catch (error) {
        console.error('❌ Failed to fetch available models:', error);
        // Fallback ke model gratis yang paling stabil
        return ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro'];
    }
}

// Fungsi untuk mendapatkan model dengan fallback
async function getModelWithFallback(retryCount = 0) {
    const ai = await initializeGemini();
    if (!ai) {
        throw new Error('Gemini AI is not properly initialized. Please check your API key.');
    }

    const models = await getAvailableModels();
    
    if (!models || models.length === 0) {
        throw new Error('No models available. Please check your API key permissions.');
    }

    let lastError = null;

    for (const modelName of models) {
        try {
            const model = ai.getGenerativeModel({ model: modelName });
            console.log(`✅ Using model: ${modelName}`);
            return model;
        } catch (error) {
            console.warn(`⚠️ Failed to use model ${modelName}:`, error.message);
            lastError = error;
        }
    }
    
    throw new Error(`All models are currently unavailable. Last error: ${lastError?.message}`);
}

// Fungsi untuk menangani error dengan lebih baik
function getErrorMessage(error) {
    const errorMsg = error.message || error.toString();
    
    if (errorMsg.includes('quota') || errorMsg.includes('429')) {
        if (errorMsg.includes('free_tier')) {
            return {
                message: "Quota gratis telah habis. Silakan tunggu beberapa menit atau upgrade ke paid plan di https://aistudio.google.com/",
                type: 'quota',
                waitTime: 60000 // 1 menit
            };
        }
        return {
            message: "API quota exceeded. Menunggu reset quota...",
            type: 'quota',
            waitTime: 60000
        };
    }
    
    if (errorMsg.includes('API key') || errorMsg.includes('401')) {
        return {
            message: "API key tidak valid. Generate API key baru di https://aistudio.google.com/app/apikey",
            type: 'auth'
        };
    }
    
    if (errorMsg.includes('503')) {
        return {
            message: "Server Gemini sedang sibuk. Mencoba lagi...",
            type: 'server',
            waitTime: 5000
        };
    }
    
    if (errorMsg.includes('404')) {
        return {
            message: "Model tidak tersedia. Periksa API key di https://aistudio.google.com/app/apikey",
            type: 'model'
        };
    }
    
    return {
        message: "Terjadi kesalahan. Silakan coba lagi dalam beberapa saat.",
        type: 'general',
        waitTime: 3000
    };
}

// Fungsi utama untuk mendapatkan respons dari Gemini (compatible dengan existing system)
export async function getChatResponse(prompt, chatHistory = [], retryCount = 0) {
    try {
        // Check rate limit before making request
        await checkRateLimit();
        
        const model = await getModelWithFallback();
        
        const generationConfig = {
            temperature: appConfig.temperature || 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: Math.min(appConfig.maxTokens || 1024, 1024), // Batasi untuk free tier
        };
        
        const safetySettings = [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ];

        const systemPrompt = `Anda adalah AI asisten yang ahli dalam moral intelligence dan pengembangan karakter. Anda membantu pengguna memahami 7 aspek moral intelligence: Empati, Hati Nurani, Pengendalian Diri, Hormat, Kebaikan Hati, Toleransi, dan Keadilan.

Berikan jawaban yang:
- Praktis dan mudah dipahami
- Berdasarkan teori moral intelligence yang solid
- Menggunakan contoh nyata dari kehidupan sehari-hari
- Mendorong refleksi dan pengembangan diri
- Ramah dan mendukung

Jawab dalam bahasa Indonesia yang natural dan mudah dipahami.`;

        const history = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Baik, saya siap membantu Anda dengan topik moral intelligence dan pengembangan karakter." }] },
            ...chatHistory.slice(-8) // Batasi history untuk menghemat token
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: history
        });

        // Try different approaches if response is empty
        let result, response, text;
        
        try {
            // First try with chat
            console.log('Sending message to Gemini with chat...');
            result = await chat.sendMessage(prompt);
            response = await result.response;
            text = response.text();
            console.log('Response received from chat:', text);
            
            // Check if response is blocked or empty
            if (!text || text.trim() === '') {
                console.log('Empty response from chat, checking candidates...');
                
                if (response.candidates && response.candidates[0]) {
                    const candidate = response.candidates[0];
                    console.log('Candidate info:', {
                        finishReason: candidate.finishReason,
                        safetyRatings: candidate.safetyRatings
                    });
                    
                    if (candidate.finishReason === 'SAFETY') {
                        return "Maaf, respons diblokir oleh filter keamanan. Coba ajukan pertanyaan dengan cara yang berbeda.";
                    } else if (candidate.finishReason === 'RECITATION') {
                        return "Maaf, respons mengandung konten yang mungkin adalah kutipan. Coba pertanyaan lain.";
                    }
                }
                
                // Try direct generation as fallback
                console.log('Trying direct generation as fallback...');
                const directResult = await model.generateContent(prompt);
                const directResponse = await directResult.response;
                text = directResponse.text();
                console.log('Response from direct generation:', text);
            }
        } catch (chatError) {
            console.log('Chat method failed, trying direct generation:', chatError.message);
            // Fallback to direct generation
            const directResult = await model.generateContent(prompt);
            const directResponse = await directResult.response;
            text = directResponse.text();
            console.log('Response from fallback direct generation:', text);
        }

        // Final check for empty response
        if (!text || text.trim() === '') {
            console.warn('Still empty response after all attempts');
            return "Maaf, saya tidak dapat memberikan respons saat ini. Silakan coba dengan pertanyaan yang lebih spesifik tentang moral intelligence.";
        }

        console.log(`📊 Requests today: ${dailyRequestCount}/${FREE_TIER_LIMITS.DAILY}`);
        return text.trim();

    } catch (error) {
        console.error('❌ Error getting chat response:', error);
        
        const errorInfo = getErrorMessage(error);
        
        // Retry logic dengan backoff eksponensial
        if (errorInfo.type === 'quota' || errorInfo.type === 'server') {
            if (retryCount < MAX_RETRIES) {
                const waitTime = errorInfo.waitTime * (retryCount + 1);
                console.log(`🔄 Retrying in ${waitTime}ms... (${retryCount + 1}/${MAX_RETRIES})`);
                await delay(waitTime);
                return getChatResponse(prompt, chatHistory, retryCount + 1);
            }
        }
        
        return errorInfo.message;
    }
}

// Fungsi untuk mendapatkan respons dengan konteks (compatible dengan existing system)
export async function getResponseWithContext(context, prompt, chatHistory = []) {
    try {
        await checkRateLimit();
        
        const model = await getModelWithFallback();

        const generationConfig = {
            temperature: 0.6,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1024, // Batasi untuk free tier
        };

        // Batasi context untuk menghemat token
        const limitedContext = context.substring(0, 2000) + (context.length > 2000 ? '...' : '');
        
        const contextPrompt = `Berdasarkan dokumen/konten berikut:

${limitedContext}

Pertanyaan: ${prompt}

Berikan analisis yang komprehensif dan praktis berdasarkan konten tersebut. Fokus pada insights yang berguna dan actionable.`;

        const chat = model.startChat({
            generationConfig,
            history: chatHistory.slice(-6) // Batasi history
        });

        const result = await chat.sendMessage(contextPrompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();

    } catch (error) {
        console.error('❌ Error getting context response:', error);
        const errorInfo = getErrorMessage(error);
        return errorInfo.message;
    }
}

// Fungsi untuk cek status quota
export function getQuotaStatus() {
    return {
        dailyUsed: dailyRequestCount,
        dailyLimit: FREE_TIER_LIMITS.DAILY,
        remaining: FREE_TIER_LIMITS.DAILY - dailyRequestCount,
        resetTime: 'midnight UTC'
    };
}

// Export untuk penggunaan global (compatible dengan existing system)
window.getChatResponse = getChatResponse;
window.getResponseWithContext = getResponseWithContext;
window.getQuotaStatus = getQuotaStatus;

console.log('✅ Improved Gemini service module loaded');
console.log(`📊 Current quota: ${dailyRequestCount}/${FREE_TIER_LIMITS.DAILY} requests used today`);