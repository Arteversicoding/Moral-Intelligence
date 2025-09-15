import { getChatResponse, getResponseWithContext } from './gemini-service.js';

// State untuk menyimpan konteks dari file dan histori chat
let fileContext = null;
let chatHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();

    const sendButton = document.querySelector('button.bg-gradient-to-r');
    const chatInput = document.getElementById('chatInput');
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileInput = document.getElementById('file-input');

    if(sendButton) sendButton.addEventListener('click', sendMessage);
    if(chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    if(fileUploadButton) fileUploadButton.addEventListener('click', () => fileInput.click());
    if(fileInput) fileInput.addEventListener('change', handleFileUpload);

    document.querySelectorAll('button[onclick^="sendQuickMessage"]').forEach(button => {
        const message = button.getAttribute('onclick').match(/'([^']+)'/)[1];
        button.removeAttribute('onclick'); // Hapus onclick inline
        button.addEventListener('click', () => sendQuickMessage(message));
    });
});

function setActiveNav() {
    document.querySelectorAll('.nav-button').forEach(button => {
        if (button.dataset.page === 'chat') {
            button.classList.add('active');
        }
    });
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
                <div class="w-10 h-10 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">BS</div>
            </div>
        `;
    } else { // AI sender
        const loadingIndicator = isLoading ? '<div class="dot-flashing"></div>' : '';
        messageHTML = `
            <div id="${messageId}" class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">AI</div>
                <div class="bg-white rounded-2xl rounded-tl-none p-4 shadow-lg max-w-xs">
                    <p class="text-gray-800 text-sm">${message} ${loadingIndicator}</p>
                    <span class="text-gray-400 text-xs block text-right mt-2">${time}</span>
                </div>
            </div>
        `;
    }
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
    return messageId;
}

async function handleChatInteraction(prompt) {
    addMessageToChat(prompt, 'user');
    const loadingMsgId = addMessageToChat('', 'ai', true);

    try {
        let responseText;
        if (fileContext) {
            // Saat ada konteks file, kita tidak mengirim histori chat sebelumnya agar fokus pada file.
            // Ini bisa disesuaikan jika ingin AI tetap mengingat chat sebelumnya.
            responseText = await getResponseWithContext(fileContext, prompt, []); 
        } else {
            responseText = await getChatResponse(prompt, chatHistory);
        }
        updateMessage(loadingMsgId, responseText);
        scrollToBottom(); // Scroll after AI response
        
        // Simpan ke histori hanya jika tidak ada konteks file
        if (!fileContext) {
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            chatHistory.push({ role: "model", parts: [{ text: responseText }] });
        }

    } catch (error) {
        console.error(error);
        updateMessage(loadingMsgId, "Gagal mendapatkan respons dari AI.");
        scrollToBottom(); // Scroll after error message
    }
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
    const input = document.getElementById('chatInput');
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
        const pElement = messageElement.querySelector('p');
        if (pElement) {
            pElement.innerHTML = newText; // Hapus loading indicator dan set teks baru
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
                scrollToBottom(); // Scroll after file upload completion
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

// Menambahkan style untuk loading indicator
const style = document.createElement('style');
style.innerHTML = `
.dot-flashing { position: relative; width: 5px; height: 5px; border-radius: 5px; background-color: #9880ff; color: #9880ff; animation: dotFlashing 1s infinite linear alternate; animation-delay: .5s; display: inline-block; margin-left: 5px; }
.dot-flashing::before, .dot-flashing::after { content: ''; display: inline-block; position: absolute; top: 0; }
.dot-flashing::before { left: -10px; width: 5px; height: 5px; border-radius: 5px; background-color: #9880ff; color: #9880ff; animation: dotFlashing 1s infinite alternate; animation-delay: 0s; }
.dot-flashing::after { left: 10px; width: 5px; height: 5px; border-radius: 5px; background-color: #9880ff; color: #9880ff; animation: dotFlashing 1s infinite alternate; animation-delay: 1s; }
@keyframes dotFlashing { 0% { background-color: #9880ff; } 50%, 100% { background-color: #ebe6ff; } }
`;
document.head.appendChild(style);
