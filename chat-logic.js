import { getChatResponse, getResponseWithContext } from './gemini-service.js';

// === PERBAIKAN: Pastikan baris-baris ini ada di paling atas ===
let fileContext = null;
let chatHistory = [];
let currentMode = 'quiz'; // 'quiz' atau 'chat'
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initializeInterface();
    setupEventListeners();
});

function initializeInterface() {
    switchMode('quiz');
}

function setupEventListeners() {
    // Mode toggle buttons
    const quizModeBtn = document.getElementById('quiz-mode-btn');
    const chatModeBtn = document.getElementById('chat-mode-btn');
    if (quizModeBtn) quizModeBtn.addEventListener('click', () => switchMode('quiz'));
    if (chatModeBtn) chatModeBtn.addEventListener('click', () => switchMode('chat'));

    // Chat functionality
    const sendButton = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');
    
    if (sendButton) sendButton.addEventListener('click', sendMessage);
    
    if (chatInput) {
        // Logika untuk mengirim pesan
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { // Kirim jika Enter ditekan (tanpa Shift)
                e.preventDefault(); // Mencegah baris baru
                sendMessage();
            }
        });

        // Logika untuk membuat textarea membesar otomatis
        const maxHeight = 120; // Batas tinggi maksimal (sekitar 5 baris)
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto'; // Reset tinggi
            const newHeight = Math.min(chatInput.scrollHeight, maxHeight);
            chatInput.style.height = `${newHeight}px`;
        });
    }

    // File upload
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileInput = document.getElementById('file-input');
    if (fileUploadButton) fileUploadButton.addEventListener('click', () => fileInput.click());
    if (fileInput) fileInput.addEventListener('change', handleFileUpload);
    
    // Event listener untuk tombol close pada chip file
    const fileChipClose = document.getElementById('file-chip-close');
    if(fileChipClose) fileChipClose.addEventListener('click', clearFileContext);
}

function setActiveNav() {
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
        if (button.href.includes('chat.html')) {
            button.classList.add('active');
        }
    });
}

function switchMode(mode) {
    currentMode = mode;
    const body = document.body;
    
    body.classList.remove('quiz-mode', 'chat-mode');
    body.classList.add(`${mode}-mode`);
    
    const headerStatus = document.getElementById('header-status');
    if (headerStatus) {
        headerStatus.textContent = mode === 'quiz' ? 'Mode Quiz' : 'Chat dengan AI';
    }
    
    const quizBtn = document.getElementById('quiz-mode-btn');
    const chatBtn = document.getElementById('chat-mode-btn');
    
    if (quizBtn && chatBtn) {
        if (mode === 'quiz') {
            quizBtn.classList.add('bg-white', 'text-indigo-600');
            quizBtn.classList.remove('text-white');
            chatBtn.classList.remove('bg-white', 'text-indigo-600');
            chatBtn.classList.add('text-white');
        } else { // mode === 'chat'
            chatBtn.classList.add('bg-white', 'text-indigo-600');
            chatBtn.classList.remove('text-white');
            quizBtn.classList.remove('bg-white', 'text-indigo-600');
            quizBtn.classList.add('text-white');
        }
    }
}

function addMessageToChat(message, sender, isLoading = false) {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;
    const messageId = `msg-${Date.now()}`;
    const messageHTML = sender === 'user' ? 
        `<div class="flex items-start space-x-3 justify-end">
            <div class="bg-indigo-500 text-white rounded-2xl rounded-br-none p-4 shadow-lg max-w-md">
                <p class="text-sm">${message}</p>
            </div>
        </div>` :
        `<div id="${messageId}" class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">AI</div>
            <div class="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg max-w-md">
                <div class="text-gray-800 text-sm">${formatAIMessage(message)} ${isLoading ? '<div class="dot-flashing"></div>' : ''}</div>
            </div>
        </div>`;
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
    return messageId;
}

function formatAIMessage(message) {
    return message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

async function handleChatInteraction(prompt, context = null) {
    addMessageToChat(prompt, 'user');
    const loadingMsgId = addMessageToChat('', 'ai', true);

    try {
        let responseText;
        if (context) {
            responseText = await getResponseWithContext(context, prompt, chatHistory);
        } else if (isQuizRelatedQuery(prompt)) {
            responseText = getQuizContextualResponse(prompt);
        } else {
            responseText = await getChatResponse(prompt, chatHistory);
        }
        
        updateMessage(loadingMsgId, responseText);
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });
    } catch (error) {
        console.error(error);
        updateMessage(loadingMsgId, "Maaf, terjadi kesalahan. Silakan coba lagi.");
    }
}

function isQuizRelatedQuery(query) {
    const keywords = ['quiz', 'soal', 'skor', 'aspek', 'empati', 'hati nurani', 'pengendalian diri', 'hormat', 'kebaikan hati', 'toleransi', 'keadilan'];
    return keywords.some(keyword => query.toLowerCase().includes(keyword));
}

function getQuizContextualResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('skor') || lowerPrompt.includes('progress')) {
        return typeof getQuizProgress === 'function' ? getQuizProgress() : "Fungsi skor belum siap.";
    }
    if (lowerPrompt.includes('pertanyaan ini') || lowerPrompt.includes('soal ini')) {
        return typeof getCurrentQuestionHelp === 'function' ? getCurrentQuestionHelp() : "Tidak bisa mendapat bantuan untuk soal saat ini.";
    }
    if (lowerPrompt.includes('jelaskan aspek')) {
        return typeof generateAspectExplanation === 'function' ? generateAspectExplanation() : "Tidak bisa menjelaskan aspek saat ini.";
    }
    return "Saya siap membantu dengan quiz. Apa yang ingin Anda tanyakan?";
}

function scrollToBottom() {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '' && !fileContext) return;
    
    input.value = '';
    input.style.height = '48px'; // Reset tinggi textarea

    if (fileContext) {
        const promptWithMessage = message || "Tolong analisis dan berikan ringkasan dari dokumen ini.";
        await handleChatInteraction(promptWithMessage, fileContext);
        clearFileContext();
    } else {
        await handleChatInteraction(message);
    }
}

function updateMessage(messageId, newText) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
        const textElement = messageElement.querySelector('.text-gray-800');
        if (textElement) textElement.innerHTML = formatAIMessage(newText);
    }
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
        if(file) addMessageToChat('Maaf, saat ini saya hanya bisa memproses file PDF.', 'ai');
        return;
    }
    
    addMessageToChat(`Menganalisis file: <b>${file.name}</b>...`, 'ai');

    try {
        if (!window['pdfjs-dist/build/pdf']) { // Muat library jika belum ada
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
            window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await window['pdfjs-dist/build/pdf'].getDocument(typedarray).promise;
                let textContent = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    textContent += text.items.map(s => s.str).join(' ');
                }
                fileContext = textContent;
                
                document.getElementById('file-chip-name').textContent = file.name;
                document.getElementById('file-chip').classList.remove('hidden');
                
            } catch (pdfError) {
                console.error('Error parsing PDF:', pdfError);
                addMessageToChat('Gagal membaca konten PDF.', 'ai');
                clearFileContext();
            }
        };
        reader.readAsArrayBuffer(file);

    } catch (error) {
        console.error('Error processing PDF:', error);
        addMessageToChat('Gagal memproses file PDF.', 'ai');
        clearFileContext();
    }
}

function clearFileContext() {
    fileContext = null;
    document.getElementById('file-chip').classList.add('hidden');
    document.getElementById('file-input').value = ''; 
}

// Membuat fungsi-fungsi ini tersedia secara global
window.switchMode = switchMode;
window.handleChatInteraction = handleChatInteraction;

window.showCurrentScoreInChat = () => {
    const response = typeof getQuizProgress === 'function' ? getQuizProgress() : "Belum ada skor.";
    addMessageToChat('Tampilkan skor dan progress saya.', 'user');
    addMessageToChat(response, 'ai');
};

window.getQuizHelpInChat = () => {
    const response = "Tentu! Untuk menjawab dengan baik, coba ceritakan pengalaman nyata, jelaskan perasaan dan alasan Anda, serta tunjukkan dampak positif dari tindakan Anda.";
    addMessageToChat('Berikan saya tips menjawab quiz.', 'user');
    addMessageToChat(response, 'ai');
};

window.explainCurrentAspectInChat = () => {
    const response = typeof generateAspectExplanation === 'function' ? generateAspectExplanation() : "Saya belum bisa menjelaskan aspek ini.";
    addMessageToChat('Jelaskan tentang aspek moral intelligence.', 'user');
    addMessageToChat(response, 'ai');
};