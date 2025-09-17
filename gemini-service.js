import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "https://esm.run/@google/generative-ai";
import { geminiApiKey } from "./config.js";

const genAI = new GoogleGenerativeAI(geminiApiKey);

// Daftar model yang akan dicoba secara berurutan
const MODEL_PRIORITY = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro"
];

const generationConfig = {
  temperature: 1,
  topK: 64,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Cache untuk model yang sudah berhasil digunakan
let activeModel = null;

/**
 * Mencoba membuat model dengan fallback jika gagal
 */
async function getModelWithFallback() {
  if (activeModel) return activeModel;
  
  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
      });
      // Test the model with a simple request
      await model.generateContent("Test connection");
      activeModel = model;
      console.log(`Using model: ${modelName}`);
      return model;
    } catch (error) {
      console.warn(`Failed to use model ${modelName}:`, error.message);
      continue;
    }
  }
  
  throw new Error("All models are currently unavailable. Please try again later.");
}

/**
 * Fungsi utama untuk berinteraksi dengan AI.
 */
export async function getChatResponse(prompt, history = []) {
  try {
    const model = await getModelWithFallback();
    const chat = await model.startChat({
      history: history,
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();

  } catch (error) {
    console.error("Error getting chat response:", error);
    
    if (error.message.includes('429')) {
      return "⚠️ Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu sejenak dan coba lagi.";
    }
    
    if (error.message.includes('503') || error.message.includes('overload')) {
      // Reset active model agar dicoba model lain di request berikutnya
      activeModel = null;
      return "⚠️ Server sedang sibuk. Silakan coba beberapa saat lagi.";
    }
    
    if (error.message.includes('API key not valid')) {
      return "❌ Error: API Key tidak valid. Mohon periksa kembali di file config.js.";
    }
    
    return "❌ Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.";
  }
}

/**
 * Menghasilkan respons dari AI dengan konteks tambahan dari file/materi.
 */
export async function getResponseWithContext(context, question, history = []) {
  try {
    const model = await getModelWithFallback();
    const chat = await model.startChat({
      history: [
        ...history,
        {
          role: "user",
          parts: [{ text: `Konteks: ${context}\n\nPertanyaan: ${question}` }],
        },
      ],
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(question);
    const response = result.response;
    return response.text();
    
  } catch (error) {
    console.error("Error in getResponseWithContext:", error);
    return "❌ Maaf, terjadi kesalahan saat memproses file. Pastikan format file sesuai dan coba lagi.";
  }
}