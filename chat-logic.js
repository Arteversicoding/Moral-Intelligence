// chat-logic.js - Fixed version
import { getChatResponse, getResponseWithContext } from './gemini-service.js';

// State management untuk chat
let fileContext = null;
let chatHistory = [];
let isProcessing = false;

// Setup event listeners untuk chat (dipanggil dari test-logic.js)
export function setupChatListeners() {
    console.log('🔧 Setting up chat listeners...');
    
    const sendButton = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');
    
    if (sendButton) {
        sendButton.addEventListener('click', handleSendClick);
        console.log('✅ Send button listener added');
    } else {
        console.error('❌ Send button not found');
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendClick();
            }
        });

        // Auto-resize textarea
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            const newHeight = Math.min(chatInput.scrollHeight, 120);
            chatInput.style.height = `${newHeight}px`;
        });
        console.log('✅ Chat input listeners added');
    } else {
        console.error('❌ Chat input not found');
    }

    // File upload
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileInput = document.getElementById('file-input');
    
    if (fileUploadButton) {
        fileUploadButton.addEventListener('click', () => fileInput.click());
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    console.log('✅ Chat listeners setup complete');
}

// Handle send button click
async function handleSendClick() {
    if (isProcessing) {
        console.log('🔄 Already processing, skipping...');
        return;
    }
    
    console.log('🚀 Send button clicked');
    await sendMessage();
}

// Add message to chat UI
export function addMessageToChat(message, sender, isLoading = false) {
    console.log(`📝 Adding message - Sender: ${sender}, Loading: ${isLoading}`);
    console.log('Message content:', message);
    
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) {
        console.error('❌ Chat container not found!');
        return null;
    }
    
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let messageHTML = '';
    
    if (sender === 'user') {
        messageHTML = `
            <div class="flex items-start space-x-3 justify-end mb-4">
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl rounded-br-none p-4 shadow-lg max-w-2xl">
                    <p class="text-sm whitespace-pre-wrap">${escapeHtml(message)}</p>
                </div>
            </div>`;
    } else {
        messageHTML = `
            <div id="${messageId}" class="flex items-start space-x-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">AI</div>
                <div class="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg max-w-2xl">
                    <div class="text-gray-800 text-sm message-content">
                        ${isLoading ? '<div class="dot-flashing"></div>' : formatAIMessage(message)}
                    </div>
                </div>
            </div>`;
    }
    
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
    
    console.log(`✅ Message added with ID: ${messageId}`);
    return messageId;
}

// Format AI message with markdown support
function formatAIMessage(message) {
    if (!message) return '';
    
    return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update existing message
function updateMessage(messageId, newText) {
    console.log(`🔄 Updating message ${messageId}`);
    console.log('New text:', newText);
    
    if (!messageId) {
        console.error('❌ No messageId provided for update');
        return;
    }
    
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
        const textElement = messageElement.querySelector('.message-content');
        if (textElement) {
            textElement.innerHTML = formatAIMessage(newText);
            console.log('✅ Message updated successfully');
        } else {
            console.error('❌ Message content element not found');
        }
    } else {
        console.error('❌ Message element not found:', messageId);
    }
}

// Scroll chat to bottom
function scrollToBottom() {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
        setTimeout(() => {
            chatContainer.scrollTo({ 
                top: chatContainer.scrollHeight, 
                behavior: 'smooth' 
            });
        }, 100);
    }
}

// Send message handler
async function sendMessage() {
    if (isProcessing) return;
    
    console.log('📤 Starting send message...');
    
    const input = document.getElementById('chat-input');
    if (!input) {
        console.error('❌ Chat input not found!');
        return;
    }
    
    const message = input.value.trim();
    console.log('User message:', message);
    
    if (message === '' && !fileContext) {
        console.log('Empty message, returning');
        return;
    }
    
    isProcessing = true;
    
    // Clear input
    input.value = '';
    input.style.height = '48px';

    try {
        if (fileContext) {
            const promptWithMessage = message || "Tolong analisis dan berikan ringkasan dari dokumen ini.";
            await handleChatInteraction(promptWithMessage, fileContext);
            clearFileContext();
        } else {
            await handleChatInteraction(message);
        }
    } catch (error) {
        console.error('Error in sendMessage:', error);
    } finally {
        isProcessing = false;
    }
}

// Handle chat interaction with AI
async function handleChatInteraction(prompt, context = null) {
    console.log('🤖 Starting chat interaction...');
    console.log('Prompt:', prompt);
    console.log('Has context:', !!context);
    
    // Add user message
    addMessageToChat(prompt, 'user');
    
    // Add loading message
    const loadingMsgId = addMessageToChat('Sedang berpikir...', 'ai', true);
    console.log('Loading message ID:', loadingMsgId);
    
    if (!loadingMsgId) {
        console.error('❌ Failed to create loading message');
        return;
    }

    try {
        let responseText = '';
        
        if (context) {
            console.log('🔍 Using context response...');
            responseText = await getResponseWithContext(context, prompt, chatHistory);
        } else if (isQuizRelatedQuery(prompt)) {
            console.log('🎯 Using quiz contextual response...');
            responseText = getQuizContextualResponse(prompt);
        } else {
            console.log('💬 Using regular chat response...');
            
            // Verify function exists
            if (typeof getChatResponse !== 'function') {
                console.error('❌ getChatResponse is not available!');
                responseText = 'Maaf, fungsi chat tidak tersedia saat ini.';
            } else {
                console.log('📡 Calling getChatResponse...');
                responseText = await getChatResponse(prompt, chatHistory);
                console.log('📥 Response received:', responseText);
            }
        }
        
        // Pastikan ada response
        if (!responseText || responseText.trim() === '') {
            responseText = 'Maaf, saya tidak dapat memberikan respons saat ini.';
        }
        
        // Update message with response
        console.log('🔄 Updating message with response...');
        updateMessage(loadingMsgId, responseText);
        
        // Update chat history
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });
        
        console.log('✅ Chat interaction completed successfully');
        
    } catch (error) {
        console.error('❌ Error in chat interaction:', error);
        
        const errorMessage = `Maaf, terjadi kesalahan: ${error.message}`;
        updateMessage(loadingMsgId, errorMessage);
    }
}

// Check if query is quiz-related
function isQuizRelatedQuery(query) {
    const keywords = [
        'quiz', 'soal', 'skor', 'aspek', 'progress',
        'empati', 'hati nurani', 'pengendalian diri', 
        'hormat', 'kebaikan hati', 'toleransi', 'keadilan'
    ];
    return keywords.some(keyword => query.toLowerCase().includes(keyword));
}

// Get quiz contextual response
function getQuizContextualResponse(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('skor') || lowerPrompt.includes('progress')) {
        return typeof window.getQuizProgress === 'function' 
            ? window.getQuizProgress() 
            : "Fungsi skor belum siap.";
    }
    
    if (lowerPrompt.includes('pertanyaan ini') || lowerPrompt.includes('soal ini')) {
        return typeof window.getCurrentQuestionHelp === 'function' 
            ? window.getCurrentQuestionHelp() 
            : "Tidak bisa mendapat bantuan untuk soal saat ini.";
    }
    
    if (lowerPrompt.includes('jelaskan aspek')) {
        return typeof window.generateAspectExplanation === 'function' 
            ? window.generateAspectExplanation() 
            : "Tidak bisa menjelaskan aspek saat ini.";
    }
    
    return "Saya siap membantu dengan quiz. Apa yang ingin Anda tanyakan?";
}

// Handle file upload (PDF)
async function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        addMessageToChat('Maaf, saat ini hanya file PDF yang didukung.', 'ai');
        return;
    }
    
    addMessageToChat(`📄 Menganalisis file: ${file.name}...`, 'ai');

    try {
        // Load PDF.js if not already loaded
        if (!window.pdfjsLib) {
            await loadPDFLibrary();
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
                
                let textContent = '';
                for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    textContent += text.items.map(s => s.str).join(' ') + '\n';
                }
                
                fileContext = textContent;
                addMessageToChat(`✅ File "${file.name}" berhasil dimuat. Silakan ajukan pertanyaan tentang dokumen ini.`, 'ai');
                
            } catch (pdfError) {
                console.error('Error parsing PDF:', pdfError);
                addMessageToChat('❌ Gagal membaca konten PDF. Pastikan file tidak terenkripsi.', 'ai');
                clearFileContext();
            }
        };
        
        reader.onerror = () => {
            addMessageToChat('❌ Gagal membaca file.', 'ai');
            clearFileContext();
        };
        
        reader.readAsArrayBuffer(file);

    } catch (error) {
        console.error('Error processing PDF:', error);
        addMessageToChat('❌ Gagal memproses file PDF.', 'ai');
        clearFileContext();
    }
    
    event.target.value = '';
}

// Load PDF.js library
async function loadPDFLibrary() {
    return new Promise((resolve, reject) => {
        if (window.pdfjsLib) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Clear file context
function clearFileContext() {
    fileContext = null;
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
}

// Export for global use
window.handleChatInteraction = handleChatInteraction;
window.addMessageToChat = addMessageToChat;
window.testChatFunction = async function() {
    console.log('🧪 Testing chat function...');
    await handleChatInteraction('Test pesan');
};

console.log('✅ Fixed Chat logic module loaded');

// Test saat startup
setTimeout(() => {
    console.log('🔍 Checking chat elements...');
    console.log('Chat input:', !!document.getElementById('chat-input'));
    console.log('Send button:', !!document.getElementById('send-chat-btn'));
    console.log('Chat messages:', !!document.getElementById('chat-messages'));
    console.log('getChatResponse available:', typeof getChatResponse);
}, 1000);