import { getChatResponse, getResponseWithContext } from './gemini-service.js';

// State untuk menyimpan konteks dari file dan histori chat
let fileContext = null;
let chatHistory = [];
let currentMode = 'quiz'; // 'quiz' atau 'chat'
let quizInstance = null; // Reference ke quiz instance

document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initializeInterface();
    setupEventListeners();
    
    // Initialize quiz if test-logic.js is loaded
    if (typeof initializeQuiz === 'function') {
        quizInstance = initializeQuiz();
    }
});

function initializeInterface() {
    // Set default mode to quiz
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
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // File upload (jika ada)
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileInput = document.getElementById('file-input');
    
    if (fileUploadButton) fileUploadButton.addEventListener('click', () => fileInput.click());
    if (fileInput) fileInput.addEventListener('change', handleFileUpload);

    // Quick message buttons
    document.querySelectorAll('button[onclick^="sendQuickMessage"]').forEach(button => {
        const message = button.getAttribute('onclick').match(/'([^']+)'/)?.[1];
        if (message) {
            button.removeAttribute('onclick');
            button.addEventListener('click', () => sendQuickMessage(message));
        }
    });

    // Quick actions buttons
    const showScoreBtn = document.querySelector('button[onclick="showCurrentScore()"]');
    const getHelpBtn = document.querySelector('button[onclick="getQuizHelp()"]');
    const explainBtn = document.querySelector('button[onclick="explainCurrentAspect()"]');
    
    if (showScoreBtn) {
        showScoreBtn.removeAttribute('onclick');
        showScoreBtn.addEventListener('click', showCurrentScoreInChat);
    }
    if (getHelpBtn) {
        getHelpBtn.removeAttribute('onclick');
        getHelpBtn.addEventListener('click', getQuizHelpInChat);
    }
    if (explainBtn) {
        explainBtn.removeAttribute('onclick');
        explainBtn.addEventListener('click', explainCurrentAspectInChat);
    }
}

function setActiveNav() {
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
        if (button.dataset.page === 'chat' || button.href.includes('chat.html')) {
            button.classList.add('active');
        }
    });
}

function switchMode(mode) {
    currentMode = mode;
    const body = document.body;
    
    // Update body classes
    body.classList.remove('quiz-mode', 'chat-mode');
    body.classList.add(`${mode}-mode`);
    
    // Update header
    const headerStatus = document.getElementById('header-status');
    if (headerStatus) {
        headerStatus.textContent = mode === 'quiz' ? 'Mode Quiz' : 'Chat dengan AI';
    }
    
    // Update toggle buttons
    const quizBtn = document.getElementById('quiz-mode-btn');
    const chatBtn = document.getElementById('chat-mode-btn');
    
    if (quizBtn && chatBtn) {
        if (mode === 'quiz') {
            quizBtn.classList.add('bg-white', 'text-indigo-600');
            quizBtn.classList.remove('text-white');
            chatBtn.classList.remove('bg-white', 'text-indigo-600');
            chatBtn.classList.add('text-white');
        } else {
            chatBtn.classList.add('bg-white', 'text-indigo-600');
            chatBtn.classList.remove('text-white');
            quizBtn.classList.remove('bg-white', 'text-indigo-600');
            quizBtn.classList.add('text-white');
        }
    }

    // Show/hide sections
    const quizSection = document.querySelector('.quiz-section');
    const chatSection = document.querySelector('.chat-section');
    
    if (quizSection && chatSection) {
        if (mode === 'quiz') {
            quizSection.style.display = 'flex';
            chatSection.style.display = 'none';
        } else {
            quizSection.style.display = 'none';
            chatSection.style.display = 'flex';
        }
    }
}

function addMessageToChat(message, sender, isLoading = false) {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    const messageId = `msg-${Date.now()}`;
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    let messageHTML;
    if (sender === 'user') {
        messageHTML = `
            <div class="flex items-start space-x-3 justify-end">
                <div class="bg-indigo-500 text-white rounded-2xl rounded-br-none p-4 shadow-lg max-w-xs">
                    <p class="text-sm">${message}</p>
                    <span class="text-indigo-200 text-xs block text-left mt-2">${time}</span>
                </div>
                <div class="w-10 h-10 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">U</div>
            </div>
        `;
    } else { // AI sender
        const loadingIndicator = isLoading ? '<div class="dot-flashing"></div>' : '';
        messageHTML = `
            <div id="${messageId}" class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">AI</div>
                <div class="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg max-w-xs">
                    <div class="text-gray-800 text-sm">${formatAIMessage(message)} ${loadingIndicator}</div>
                    <span class="text-gray-400 text-xs block text-right mt-2">${time}</span>
                </div>
            </div>
        `;
    }
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
    return messageId;
}

function formatAIMessage(message) {
    // Format markdown-like syntax
    return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/• /g, '• ');
}

async function handleChatInteraction(prompt) {
    addMessageToChat(prompt, 'user');
    const loadingMsgId = addMessageToChat('', 'ai', true);

    try {
        let responseText;
        
        // Check if this is a quiz-related question
        if (isQuizRelatedQuery(prompt)) {
            responseText = await getQuizContextualResponse(prompt);
        } else if (fileContext) {
            responseText = await getResponseWithContext(fileContext, prompt, []);
        } else {
            responseText = await getChatResponse(prompt, chatHistory);
        }
        
        updateMessage(loadingMsgId, responseText);
        scrollToBottom();
        
        // Save to history if not quiz-specific
        if (!isQuizRelatedQuery(prompt) && !fileContext) {
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            chatHistory.push({ role: "model", parts: [{ text: responseText }] });
        }

    } catch (error) {
        console.error(error);
        updateMessage(loadingMsgId, "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.");
        scrollToBottom();
    }
}

function isQuizRelatedQuery(query) {
    const quizKeywords = [
        'quiz', 'soal', 'pertanyaan', 'skor', 'nilai', 'moral intelligence', 
        'empati', 'hati nurani', 'pengendalian diri', 'hormat', 'kebaikan hati', 
        'toleransi', 'keadilan', 'jawaban', 'tips', 'bantuan'
    ];
    
    const lowerQuery = query.toLowerCase();
    return quizKeywords.some(keyword => lowerQuery.includes(keyword));
}

async function getQuizContextualResponse(prompt) {
    // Generate contextual response based on quiz state
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('skor') || lowerPrompt.includes('nilai')) {
        return generateScoreResponse();
    } else if (lowerPrompt.includes('tips') || lowerPrompt.includes('bantuan') || lowerPrompt.includes('cara menjawab')) {
        return generateTipsResponse();
    } else if (lowerPrompt.includes('aspek') || lowerPrompt.includes('jelaskan')) {
        return generateAspectExplanation();
    } else if (lowerPrompt.includes('pertanyaan ini') || lowerPrompt.includes('soal ini')) {
        return generateCurrentQuestionHelp();
    } else {
        // Use regular AI for general moral intelligence questions
        const contextPrompt = `${prompt}\n\nKonteks: User sedang mengerjakan quiz moral intelligence dengan 7 aspek (empati, hati nurani, pengendalian diri, hormat, kebaikan hati, toleransi, keadilan). Berikan jawaban yang relevan dengan pengembangan karakter moral.`;
        return await getChatResponse(contextPrompt, []);
    }
}

function generateScoreResponse() {
    if (typeof getQuizProgress === 'function') {
        return getQuizProgress();
    }
    return "Untuk melihat skor Anda, silakan kembali ke mode quiz dan pastikan Anda sudah menjawab beberapa soal.";
}

function generateTipsResponse() {
    return `💡 **Tips Menjawab Quiz Moral Intelligence:**

**1. Berikan Contoh Konkret**
Jangan hanya jawab teoretis. Ceritakan pengalaman nyata Anda.

**2. Tunjukkan Perasaan dan Motivasi**
Jelaskan apa yang Anda rasakan dan mengapa Anda bertindak demikian.

**3. Gunakan Kata Kunci Moral**
Sertakan kata seperti: peduli, menghormati, bertanggung jawab, empati, adil, sabar.

**4. Ceritakan Dampak**
Bagaimana tindakan Anda mempengaruhi orang lain secara positif?

**Contoh Jawaban Baik:**
*"Ketika melihat teman yang kesulitan memahami pelajaran, saya merasa empati dan ingin membantu. Saya menghampiri dengan sabar, mendengarkan kesulitannya, lalu menawarkan bantuan belajar bersama. Melihat dia mengerti dan tersenyum membuat saya merasa bahwa berbagi ilmu adalah hal yang bermakna."*`;
}

function generateAspectExplanation() {
    if (typeof getCurrentAspectName === 'function') {
        const currentAspect = getCurrentAspectName();
        const explanations = {
            'empati': '**Empati** adalah kemampuan memahami dan merasakan perasaan orang lain. Melibatkan mengenali emosi, merespons dengan tepat, dan menunjukkan kepedulian tulus.',
            'hatiNurani': '**Hati Nurani** adalah suara moral internal yang membantu membedakan benar dan salah. Melibatkan kejujuran, tanggung jawab, dan keberanian mengakui kesalahan.',
            'pengendalianDiri': '**Pengendalian Diri** adalah kemampuan mengatur emosi dan perilaku. Melibatkan kesabaran, disiplin, dan kemampuan berpikir sebelum bertindak.',
            'hormat': '**Hormat** adalah sikap menghargai diri sendiri dan orang lain. Melibatkan kesopanan, mendengarkan dengan baik, dan memperlakukan semua orang dengan bermartabat.',
            'kebaikanHati': '**Kebaikan Hati** adalah kecenderungan berbuat baik tanpa pamrih. Melibatkan kemurahan hati, kasih sayang, dan keinginan membantu sesama.',
            'toleransi': '**Toleransi** adalah kemampuan menerima dan menghargai perbedaan. Melibatkan keterbukaan pikiran, tidak menghakimi, dan menghormati keberagaman.',
            'keadilan': '**Keadilan** adalah prinsip memperlakukan semua orang secara setara dan fair. Melibatkan kejujuran, sportivitas, dan mempertahankan hak-hak orang lain.'
        };
        
        return explanations[currentAspect] || 'Ini adalah salah satu dari 7 aspek penting dalam moral intelligence yang membantu membentuk karakter yang baik.';
    }
    
    return 'Moral Intelligence terdiri dari 7 aspek: Empati, Hati Nurani, Pengendalian Diri, Hormat, Kebaikan Hati, Toleransi, dan Keadilan. Masing-masing aspek penting untuk pengembangan karakter moral yang baik.';
}

function generateCurrentQuestionHelp() {
    if (typeof getCurrentQuestion === 'function') {
        const questionInfo = getCurrentQuestion();
        return `**Bantuan untuk pertanyaan saat ini:**

${questionInfo.question}

**Tips menjawab:**
- Pikirkan pengalaman konkret yang pernah Anda alami
- Jelaskan perasaan dan motivasi Anda
- Ceritakan tindakan spesifik yang Anda lakukan
- Sebutkan dampak positif dari tindakan tersebut
- Refleksikan mengapa hal ini penting secara moral

**Kata kunci yang relevan:** ${questionInfo.keywords || 'Gunakan kata-kata yang menunjukkan pemahaman moral Anda'}`;
    }
    
    return 'Untuk mendapatkan bantuan spesifik, silakan kembali ke mode quiz dan klik "Tanya AI tentang pertanyaan ini" pada soal yang sedang Anda kerjakan.';
}

// Quick action functions for chat
function showCurrentScoreInChat() {
    const response = generateScoreResponse();
    addMessageToChat('Tampilkan skor sementara saya', 'user');
    addMessageToChat(response, 'ai');
}

function getQuizHelpInChat() {
    const response = generateTipsResponse();
    addMessageToChat('Berikan tips menjawab quiz', 'user');
    addMessageToChat(response, 'ai');
}

function explainCurrentAspectInChat() {
    const response = generateAspectExplanation();
    addMessageToChat('Jelaskan aspek yang sedang dikerjakan', 'user');
    addMessageToChat(response, 'ai');
}

// Smooth autoscroll function
function scrollToBottom() {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;
    
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '') return;
    input.value = '';
    await handleChatInteraction(message);
}

async function sendQuickMessage(message) {
    await handleChatInteraction(message);
}

function updateMessage(messageId, newText) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
        const textElement = messageElement.querySelector('.text-gray-800') || messageElement.querySelector('p');
        if (textElement) {
            textElement.innerHTML = formatAIMessage(newText);
        }
    }
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        addMessageToChat('Maaf, saat ini saya hanya bisa memproses file PDF.', 'ai');
        return;
    }

    // Switch to chat mode for file processing
    switchMode('chat');
    const loadingMsgId = addMessageToChat(`Menganalisis file: <b>${file.name}</b>...`, 'ai', true);

    try {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let textContent = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    textContent += text.items.map(s => s.str).join(' \n');
                }
                fileContext = textContent;
                updateMessage(loadingMsgId, `Analisis <b>${file.name}</b> selesai. Sekarang Anda bisa bertanya tentang isi dokumen ini.`);
                scrollToBottom();
            } catch (pdfError) {
                console.error('Error parsing PDF:', pdfError);
                updateMessage(loadingMsgId, 'Gagal membaca konten PDF.');
                fileContext = null;
            }
        };
        reader.readAsArrayBuffer(file);

    } catch (error) {
        console.error('Error processing PDF:', error);
        updateMessage(loadingMsgId, 'Gagal memproses file PDF.');
        fileContext = null;
    }
}

// Global functions for external access
window.switchMode = switchMode;
window.sendQuickMessage = sendQuickMessage;
window.showCurrentScoreInChat = showCurrentScoreInChat;
window.getQuizHelpInChat = getQuizHelpInChat;
window.explainCurrentAspectInChat = explainCurrentAspectInChat;

// Export for use by test-logic.js
export { 
    switchMode, 
    addMessageToChat, 
    formatAIMessage,
    generateScoreResponse,
    handleChatInteraction
};