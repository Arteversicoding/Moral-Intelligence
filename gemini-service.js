import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "https://esm.run/@google/generative-ai";
import { geminiApiKey } from "./config.js";

const genAI = new GoogleGenerativeAI(geminiApiKey);
genAI.apiVersion = "v1"; // pastikan gunakan versi terbaru

// Daftar model yang akan dicoba secara berurutan
const MODEL_PRIORITY = [
  "gemini-1.5-flash",
  "gemini-1.5-pro"
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
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Test koneksi dengan format baru
      await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: "Test connection" }] }
        ]
      });
      
      activeModel = model;
      console.log(`✅ Using model: ${modelName}`);
      return model;
    } catch (error) {
      console.warn(`⚠️ Failed to use model ${modelName}:`, error.message);
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
    
    // Tambahkan instruksi dalam prompt pengguna
    const indonesianPrompt = `Anda adalah asisten AI yang membantu pengguna dalam bahasa Indonesia. 
    Tolong jawab pertanyaan berikut dalam bahasa Indonesia yang baik dan benar. 
    
    Format respons yang diharapkan:
    - Gunakan paragraf pendek (maksimal 3 kalimat per paragraf)
    - Gunakan poin-poin (•) untuk daftar
    - Gunakan nomor (1., 2., dst) untuk langkah-langkah
    - Jangan gunakan tanda bintang (*)
    - Beri jarak antara poin-poin untuk keterbacaan yang lebih baik
    
    Berikut pertanyaannya: ${prompt}`;
    
    // Pastikan history dimulai dengan role 'user' jika kosong
    let updatedHistory = [...history];
    if (updatedHistory.length === 0) {
      updatedHistory.push({
        role: "user",
        parts: [{ text: "Halo, tolong bantu saya dalam bahasa Indonesia." }]
      });
      updatedHistory.push({
        role: "model",
        parts: [{ text: "Tentu, saya akan membantu Anda dalam bahasa Indonesia yang baik dan benar, dan tidak akan menggunakan tanda bintang (*) dalam respons saya." }]
      });
    }
    
    const chat = await model.startChat({
      history: updatedHistory,
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(indonesianPrompt);
    const response = result.response;
    let responseText = response.text();
    
    // Sederhanakan format respons
    responseText = responseText.replace(/\*/g, ''); // Hapus tanda bintang
    
    // Format daftar bernomor dan poin-poin
    responseText = responseText
      .replace(/(\d+)\.\s*/g, '\n$1. ')
      .replace(/(^|\n)([-•])\s*/g, '$1• ');
      
    // Bersihkan spasi berlebih
    responseText = responseText
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return responseText;

  } catch (error) {
    console.error("Error getting chat response:", error);
    
    if (error.message.includes('429')) {
      return "Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu sejenak dan coba lagi.";
    }
    
    if (error.message.includes('503') || error.message.includes('overload')) {
      // Reset active model agar dicoba model lain di request berikutnya
      activeModel = null;
      return "Server sedang sibuk. Silakan coba beberapa saat lagi.";
    }
    
    if (error.message.includes('API key not valid')) {
      return "Error: API Key tidak valid. Mohon periksa kembali di file config.js.";
    }
    
    return "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.";
  }
}

/**
 * Menghasilkan respons dari AI dengan konteks tambahan dari file/materi.
 */
export async function getResponseWithContext(context, question, history = []) {
  try {
    const model = await getModelWithFallback();
    
    // Tambahkan instruksi untuk merespons dalam bahasa Indonesia dan tanpa tanda bintang
    const indonesianPrompt = `Berdasarkan konteks yang diberikan, jawablah pertanyaan berikut dalam bahasa Indonesia yang baik dan benar. 
    
    Format respons yang diharapkan:
    - Gunakan paragraf pendek (maksimal 3 kalimat per paragraf)
    - Gunakan poin-poin (•) untuk daftar
    - Gunakan nomor (1., 2., dst) untuk langkah-langkah
    - Jangan gunakan tanda bintang (*)
    - Beri jarak antara poin-poin untuk keterbacaan yang lebih baik
    
    Berikut konteks dan pertanyaannya:
    Konteks: ${context}
    Pertanyaan: ${question}`;
    
    // Siapkan history dengan urutan yang benar
    let updatedHistory = [...history];
    
    // Pastikan history dimulai dengan role 'user' jika kosong
    if (updatedHistory.length === 0) {
      updatedHistory.push({
        role: "user",
        parts: [{ text: "Halo, tolong bantu saya memahami materi ini dalam bahasa Indonesia." }]
      });
      updatedHistory.push({
        role: "model",
        parts: [{ text: "Tentu, saya akan membantu Anda memahami materi ini dalam bahasa Indonesia yang baik dan benar, dan tidak akan menggunakan tanda bintang (*) dalam respons saya." }]
      });
    }
    
    // Tambahkan konteks dan pertanyaan ke dalam history
    updatedHistory.push({
      role: "user",
      parts: [{ text: indonesianPrompt }]
    });
    
    const chat = await model.startChat({
      history: updatedHistory,
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(question);
    const response = result.response;
    let responseText = response.text();
    
    // Sederhanakan format respons
    responseText = responseText.replace(/\*/g, ''); // Hapus tanda bintang
    
    // Format daftar bernomor dan poin-poin
    responseText = responseText
      .replace(/(\d+)\.\s*/g, '\n$1. ')
      .replace(/(^|\n)([-•])\s*/g, '$1• ');
      
    // Bersihkan spasi berlebih
    responseText = responseText
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return responseText;
    
  } catch (error) {
    console.error("Error in getResponseWithContext:", error);
    return "Maaf, terjadi kesalahan saat memproses file. Pastikan format file sesuai dan coba lagi.";
  }
}