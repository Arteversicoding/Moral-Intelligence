// test-logic.js - Quiz logic dengan Firestore integration
import { setupChatListeners, addMessageToChat } from './chat-logic.js';
import { auth } from './firebase-init.js';
import { 
    saveQuizResultToFirestore, 
    getQuizHistoryFromFirestore,
    deleteQuizResult
} from './quiz-firestore-service.js';

// === Data Soal & Kata Kunci === (tetap sama seperti sebelumnya)
const questions = {
    empati: [
        "Bagaimana Anda merespons perasaan orang lain dalam situasi sosial, misalnya dengan kata-kata, sentuhan, atau ekspresi wajah?",
        "Perilaku apa yang Anda tunjukkan yang peka terhadap kebutuhan dan perasaan orang lain, seperti menawarkan bantuan atau berbagi?",
        "Bagaimana Anda mengidentifikasi isyarat non-verbal orang lain (gerak tubuh, bahasa tubuh, ekspresi wajah, nada suara) secara akurat?",
        "Bagaimana Anda merespons dengan tepat terhadap berbagai ekspresi wajah yang ditunjukkan oleh orang lain?",
        "Ketika Anda mengamati seseorang dalam keadaan tertekan, bagaimana Anda meresponsnya dengan tepat, misalnya menawarkan kenyamanan atau bantuan?",
        "Bagaimana Anda menyatakan atau menunjukkan pemahaman Anda terhadap perasaan orang lain melalui tindakan, seperti mengangguk atau meniru ekspresi?",
        "Bagaimana Anda menunjukkan reaksi emosional, seperti menangis atau ekspresi sedih, sebagai respons terhadap orang lain yang tertekan?",
        "Tindakan apa yang Anda ambil saat mengamati seseorang diperlakukan tidak adil atau tidak baik, misalnya membela atau menyuarakan keprihatinan?",
        "Bagaimana Anda mendiskusikan atau mengajukan pertanyaan untuk memahami sudut pandang orang lain?",
        "Bagaimana Anda mengidentifikasi dan menyebutkan (secara verbal) perasaan yang dialami oleh orang lain?"
    ],
    hatiNurani: [
        "Bagaimana Anda mengakui kesalahan dan menyatakan permintaan maaf?",
        "Bagaimana Anda mengidentifikasi perilaku salah Anda dan menjelaskan mengapa itu salah?",
        "Bagaimana Anda menunjukkan kejujuran dan memenuhi janji Anda?",
        "Dalam situasi apa Anda mengambil inisiatif untuk bertindak benar tanpa perlu pengingat atau teguran dari figur otoritas?",
        "Bagaimana Anda mengartikulasikan konsekuensi dari perilaku tidak pantas Anda?",
        "Bagaimana Anda menerima kesalahan dan tidak mencoba menyalahkan orang lain saat Anda salah?",
        "Bagaimana Anda mengekspresikan rasa malu atau bersalah atas tindakan salah atau tidak pantas Anda?",
        "Jelaskan situasi di mana Anda melakukan apa yang benar meskipun ditekan oleh orang lain untuk tidak melakukannya.",
        "Upaya apa yang Anda lakukan untuk memperbaiki kerugian fisik atau emosional yang Anda sebabkan?",
        "Bagaimana Anda merumuskan cara untuk mengubah tindakan yang salah menjadi benar?"
    ],
    pengendalianDiri: [
        "Bagaimana Anda menunjukkan pengendalian diri dalam interaksi kelompok, misalnya dengan mengangkat tangan atau menunggu giliran untuk berbicara?",
        "Bagaimana Anda mengamati dan mematuhi aturan giliran saat bermain atau berinteraksi dengan orang lain?",
        "Bagaimana Anda mengendalikan dorongan internal Anda, seperti keinginan untuk membeli sesuatu atau makan berlebihan, tanpa intervensi eksternal?",
        "Strategi apa yang Anda gunakan untuk menenangkan diri ketika emosi Anda meningkat atau terasa kuat, misalnya mengambil napas dalam atau menghitung sampai sepuluh?",
        "Bagaimana Anda menghindari ledakan amarah atau reaksi emosional yang berlebihan dalam situasi menekan?",
        "Bagaimana Anda menahan diri dari agresi fisik, seperti memukul, menendang, atau mendorong, saat menghadapi konflik atau provokasi?",
        "Bagaimana Anda mempertimbangkan konsekuensi dan merencanakan tindakan sebelum bertindak atau membuat keputusan sembrono?",
        "Bagaimana Anda menunjukkan kesabaran dan menunggu gratifikasi, misalnya untuk hadiah atau giliran bermain, meskipun ada dorongan untuk bertindak impulsif?",
        "Bagaimana Anda melakukan perilaku yang sesuai dan diharapkan tanpa perlu pengingat atau teguran terus-menerus dari orang dewasa?",
        "Bagaimana Anda kembali tenang dan menyesuaikan diri dengan cepat setelah mengalami kekecewaan atau situasi yang membuat frustrasi?"
    ],
    hormat: [
        "Bagaimana Anda menunjukkan perilaku hormat terhadap orang lain tanpa memandang usia, kepercayaan, budaya, atau jenis kelamin?",
        "Bagaimana Anda menggunakan nada suara yang hormat dan menghindari perkataan atau sikap kurang ajar?",
        "Bagaimana Anda memperlakukan diri sendiri dengan cara yang terhormat, seperti menjaga kebersihan diri dan menghindari tindakan merugikan diri?",
        "Bagaimana Anda menghormati privasi orang lain, misalnya dengan mengetuk sebelum memasuki ruangan?",
        "Bagaimana Anda menahan diri dari bergosip atau membicarakan orang lain dengan cara yang tidak baik?",
        "Bagaimana Anda memperlakukan barang milik Anda dan properti orang lain dengan hormat, misalnya tidak merusak atau menggunakan tanpa izin?",
        "Bagaimana Anda menunjukkan postur tubuh yang hormat saat mendengarkan orang lain?",
        "Bagaimana Anda mengucapkan frasa sopan seperti 'Permisi,' 'Tolong,' dan 'Maaf' tanpa perlu diingatkan?",
        "Bagaimana Anda mendengarkan ide-ide secara terbuka dan tidak menyela saat orang lain berbicara?",
        "Bagaimana Anda menahan diri dari bersumpah atau menggunakan isyarat cabul?"
    ],
    kebaikanHati: [
        "Bagaimana Anda mengucapkan komentar positif yang membangun orang lain, tanpa diminta?",
        "Bagaimana Anda menunjukkan keprihatinan yang tulus ketika seseorang diperlakukan tidak adil atau tidak baik?",
        "Bagaimana Anda membela individu yang diusik atau dikucilkan oleh orang lain?",
        "Bagaimana Anda memperlakukan orang lain dengan lembut dan bertindak ketika melihat orang lain diperlakukan dengan tidak baik?",
        "Bagaimana Anda berbagi sumber daya, membantu orang lain dalam kesulitan, atau menghibur mereka yang sedih tanpa mengharapkan imbalan?",
        "Bagaimana Anda menolak untuk berpartisipasi dalam menghina, mengintimidasi, atau mengejek orang lain?",
        "Bagaimana Anda mengamati kebutuhan orang lain dan melakukan tindakan berdasarkan kebutuhan tersebut?",
        "Bagaimana Anda memberikan dukungan atau perhatian lembut kepada seseorang yang membutuhkan bantuan?",
        "Bagaimana Anda melakukan tindakan baik untuk orang lain secara sukarela karena melihat orang lain bahagia?",
        "Bagaimana Anda menginisiasi perbuatan baik atau mencari kesempatan untuk membantu orang lain secara proaktif?"
    ],
    toleransi: [
        "Bagaimana Anda menampilkan toleransi terhadap orang lain tanpa memandang usia, agama, keyakinan, budaya, atau jenis kelamin?",
        "Bagaimana Anda menunjukkan rasa hormat terhadap orang dewasa dan figur otoritas?",
        "Bagaimana Anda membuka diri untuk mengenal orang-orang dengan latar belakang dan keyakinan yang berbeda dari Anda?",
        "Bagaimana Anda menyuarakan ketidaknyamanan dan keprihatinan ketika seseorang dihina atau direndahkan?",
        "Bagaimana Anda membela mereka yang lemah (underdog) dan tidak membiarkan ketidakadilan atau intoleransi terjadi?",
        "Bagaimana Anda menahan diri untuk tidak membuat komentar atau lelucon yang merendahkan kelompok atau orang lain?",
        "Bagaimana Anda menunjukkan kebanggaan pada budaya dan warisan Anda sendiri?",
        "Bagaimana Anda bersikap ramah dan terbuka terhadap orang-orang tanpa memandang latar belakang mereka?",
        "Bagaimana Anda berfokus pada sifat-sifat positif orang lain daripada pada perbedaan mereka?",
        "Bagaimana Anda menahan diri dari menghakimi, mengategorikan, atau membuat stereotip orang lain?"
    ],
    keadilan: [
        "Bagaimana Anda menikmati kesempatan untuk melayani orang lain?",
        "Bagaimana Anda menunggu giliran dengan sabar?",
        "Bagaimana Anda tidak menyalahkan orang lain sembarangan?",
        "Bagaimana Anda bersedia berkompromi agar kebutuhan semua orang terpenuhi?",
        "Bagaimana Anda menunjukkan pikiran terbuka, yaitu mendengarkan semua pihak sebelum membentuk opini?",
        "Bagaimana Anda menampilkan sportivitas yang baik, baik saat menang maupun kalah?",
        "Bagaimana Anda bersedia berbagi kepemilikan tanpa bujukan atau pengingat?",
        "Bagaimana Anda mencoba menyelesaikan masalah dengan damai dan adil?",
        "Bagaimana Anda bermain sesuai aturan dan tidak mengubahnya di tengah jalan demi keuntungan Anda?",
        "Bagaimana Anda memperhatikan hak-hak orang lain untuk memastikan mereka diperlakukan secara setara dan adil?"
    ]
};

const keywords = {
    empati: ["peduli","prihatin","empati","tolong","bantu","rasakan","perasaan","pahami","simpati","perhatian","teman","bela","berbagi","menghibur","tenang","senang","sedih","khawatir","canggung","terharu","menolong","kasihan","iba"],
    hatiNurani: ["jujur","kejujuran","bertanggung","tanggung jawab","maaf","minta maaf","janji","salah","benar","dosa","akui","memperbaiki","perbaikan","kesalahan","malu","rasa bersalah","menyesal","integritas","adil","kebaikan","moral","etika"],
    pengendalianDiri: ["sabar","kesabaran","tenang","napas","tarik napas","kontrol","kendali","menahan diri","mengendalikan","tidak marah","tidak emosi","fokus","berhati-hati","disiplin","teratur","tertib","aturlah","kontrol diri","diam","tidak terburu-buru","mengatur"],
    hormat: ["hormat","menghormati","menghargai","tenggang rasa","sopan","santun","permisi","tolong","maaf","sopan santun","etika","tatakrama","nilai","adab","unggah-ungguh","dengar","mendengarkan","memperhatikan","tidak mengejek","tidak menghina","menghargai"],
    kebaikanHati: ["baik","kebaikan","ramah","lembut","kasih sayang","welas asih","peduli","empati","simpati","murah hati","dermawan","penolong","menolong","bantu","menghibur","dukung","dukungan","pemaaf","pengertian","ikhlas","tulus","baik hati"],
    toleransi: ["toleransi","menerima","penerimaan","menghargai","keterbukaan","berpikiran terbuka","saling menghargai","kesetaraan","tidak diskriminasi","perbedaan","berbeda","beragam","plural","ramah","tidak menghakimi","tidak stereotip","sabar","adil","solidaritas","saling menghormati","inklusif"],
    keadilan: ["adil","keadilan","jujur","kejujuran","setara","kesetaraan","hak","hak-hak","aturan","peraturan","sportif","sportivitas","gilir","bergiliran","berbagi","kompromi","win-win","kesepakatan","mendengarkan","transparan","tidak pilih kasih","tidak curang","fair","objektif"]
};

const aspectDisplayNames = {
    empati: 'Empati',
    hatiNurani: 'Hati Nurani',
    pengendalianDiri: 'Pengendalian Diri',
    hormat: 'Hormat',
    kebaikanHati: 'Kebaikan Hati',
    toleransi: 'Toleransi',
    keadilan: 'Keadilan',
};

// State variables
let aspects = Object.keys(questions);
let currentAspectIndex = 0;
let currentQuestionIndex = 0;
let currentQuestionNumber = 1;
let currentMode = 'quiz';
let answers = {};
let scores = {};
let totalQuestions = 70;
let radarChartInstance = null;
let quizHistory = [];
let quizStartTime = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Quiz logic initializing...');
    
    // Load quiz history from Firestore
    loadQuizHistory();
    
    // Initialize quiz
    initializeQuiz();
    
    // Setup event listeners
    setupQuizEventListeners();
    setupModeToggle();
    
    // Setup chat listeners
    setupChatListeners();
    
    console.log('Quiz logic initialized');
});

// Load quiz history from Firestore
async function loadQuizHistory() {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log('User not logged in, waiting...');
            // Wait for auth state to be ready
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    quizHistory = await getQuizHistoryFromFirestore(user.uid, 10);
                    console.log(`Loaded ${quizHistory.length} quiz history from Firestore`);
                }
            });
        } else {
            quizHistory = await getQuizHistoryFromFirestore(user.uid, 10);
            console.log(`Loaded ${quizHistory.length} quiz history from Firestore`);
        }
    } catch (error) {
        console.error('Error loading quiz history:', error);
        quizHistory = [];
    }
}

// Setup mode toggle
function setupModeToggle() {
    const quizModeBtn = document.getElementById('quiz-mode-btn');
    const chatModeBtn = document.getElementById('chat-mode-btn');
    
    if (quizModeBtn) {
        quizModeBtn.addEventListener('click', () => switchMode('quiz'));
    }
    
    if (chatModeBtn) {
        chatModeBtn.addEventListener('click', () => switchMode('chat'));
    }
}

// Switch mode between quiz and chat
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
            quizBtn.classList.remove('text-white', 'hover:bg-white/10');
            chatBtn.classList.remove('bg-white', 'text-indigo-600');
            chatBtn.classList.add('text-white', 'hover:bg-white/10');
        } else {
            chatBtn.classList.add('bg-white', 'text-indigo-600');
            chatBtn.classList.remove('text-white', 'hover:bg-white/10');
            quizBtn.classList.remove('bg-white', 'text-indigo-600');
            quizBtn.classList.add('text-white', 'hover:bg-white/10');
        }
    }
}

// Initialize quiz
function initializeQuiz() {
    currentAspectIndex = 0;
    currentQuestionIndex = 0;
    currentQuestionNumber = 1;
    answers = {};
    scores = {};
    quizStartTime = Date.now();
    
    aspects.forEach(aspect => {
        answers[aspect] = [];
        scores[aspect] = [];
    });
    
    showCurrentQuestion();
    updateProgressDisplay();
}

// Setup quiz event listeners
function setupQuizEventListeners() {
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-answer-btn');
    
    if (answerInput) {
        answerInput.addEventListener('input', updateCharCount);
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                submitBtn.click();
            }
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitAnswer);
    }
}

// Show current question
function showCurrentQuestion() {
    const aspect = aspects[currentAspectIndex];
    const question = questions[aspect][currentQuestionIndex];
    const displayName = aspectDisplayNames[aspect] || capitalize(aspect);
    
    document.getElementById('question-title').textContent = `Pertanyaan ${displayName}`;
    document.getElementById('question-text').textContent = question;
    document.getElementById('aspect-name').textContent = displayName;
    document.getElementById('current-aspect-display').textContent = displayName;
    document.getElementById('question-number').textContent = currentQuestionNumber;
    
    const prevBtn = document.getElementById('prev-question-btn');
    prevBtn.style.display = currentQuestionNumber > 1 ? 'inline-flex' : 'none';
    prevBtn.onclick = moveToPreviousQuestion;

    const answerInput = document.getElementById('answer-input');
    answerInput.value = (answers[aspect] && answers[aspect][currentQuestionIndex]) || '';
    answerInput.focus();
    
    updateCharCount();
    updateProgressDisplay();
}

// Update progress display
function updateProgressDisplay() {
    document.getElementById('progress-text').textContent = `Soal ${currentQuestionNumber} dari ${totalQuestions}`;
    const progress = (currentQuestionNumber / totalQuestions) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-percentage').textContent = `${progress.toFixed(1)}%`;
}

// Update character count
function updateCharCount() {
    const count = document.getElementById('answer-input').value.length;
    document.getElementById('char-count').textContent = count;
    document.getElementById('submit-answer-btn').disabled = count < 10;
}

// Submit answer
function submitAnswer() {
    const answer = document.getElementById('answer-input').value.trim();
    if (answer.length < 10) return;

    const aspect = aspects[currentAspectIndex];
    const currentScore = scoreAnswer(answer, aspect);
    
    answers[aspect][currentQuestionIndex] = answer;
    scores[aspect][currentQuestionIndex] = currentScore;

    showAnswerFeedback(currentScore, aspect);
    moveToNextQuestion();
}

// Show feedback
function showAnswerFeedback(score, aspect) {
    const feedbackMessages = {
        low: 'Jawaban Anda baik, coba berikan lebih banyak detail dan contoh.',
        medium: 'Bagus! Anda menunjukkan pemahaman yang cukup baik.',
        high: 'Luar biasa! Jawaban yang sangat mendalam dan relevan.'
    };
    let category = 'low';
    if (score >= 8) category = 'high';
    else if (score >= 5) category = 'medium';
    const displayName = aspectDisplayNames[aspect] || capitalize(aspect);
    console.log(`${displayName} - Skor: ${score.toFixed(1)}/10 - ${feedbackMessages[category]}`);
}

// Score answer
function scoreAnswer(answer, aspect) {
    const answerLower = answer.toLowerCase();
    let keywordCount = 0;

    keywords[aspect].forEach(key => {
        if (answerLower.includes(key)) keywordCount++;
    });

    if (keywordCount === 0) return 0;

    const lengthBonus = Math.min(Math.floor(answer.length / 50), 3);
    const score = (keywordCount * 1.5) + lengthBonus;

    return Math.min(score, 10);
}

// Move to next question
function moveToNextQuestion() {
    if (currentQuestionNumber >= totalQuestions) {
        completeQuiz();
        return;
    }
    currentQuestionNumber++;
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions[aspects[currentAspectIndex]].length) {
        currentAspectIndex++;
        currentQuestionIndex = 0;
    }
    showCurrentQuestion();
}

// Move to previous question
function moveToPreviousQuestion() {
    if (currentQuestionNumber <= 1) return;
    currentQuestionNumber--;
    currentQuestionIndex--;
    if (currentQuestionIndex < 0) {
        currentAspectIndex--;
        currentQuestionIndex = questions[aspects[currentAspectIndex]].length - 1;
    }
    showCurrentQuestion();
}

// Complete quiz
async function completeQuiz() {
    const resultsData = calculateFinalResults();
    
    // Calculate time spent
    const timeSpentMs = Date.now() - quizStartTime;
    const timeSpentMinutes = Math.round(timeSpentMs / 60000);
    resultsData.timeSpent = timeSpentMinutes;
    resultsData.totalQuestions = totalQuestions;
    resultsData.answers = answers; // Include answers for admin review
    
    try {
        // Save to Firestore
        const docId = await saveQuizResultToFirestore(resultsData);
        console.log('Quiz saved to Firestore with ID:', docId);
        
        // Reload history
        await loadQuizHistory();
        
        // Show results
        displayResults(resultsData);
        
    } catch (error) {
        console.error('Error saving quiz:', error);
        alert('Gagal menyimpan hasil quiz. Pastikan Anda sudah login.');
    }
}

// Calculate final results
function calculateFinalResults() {
    const aspectScoresData = [];
    aspects.forEach(aspect => {
        let score = 0;
        if (scores[aspect] && scores[aspect].length > 0) {
            const sum = scores[aspect].reduce((a, b) => a + b, 0);
            score = (sum / (scores[aspect].length * 10)) * 100;
        }
        aspectScoresData.push({ aspect, score });
    });
    const totalScore = aspectScoresData.reduce((sum, item) => sum + item.score, 0);
    const finalScore = aspectScoresData.length > 0 ? totalScore / aspectScoresData.length : 0;
    return {
        aspectScores: aspectScoresData,
        overallScore: finalScore,
        overallCategory: getScoreCategory(finalScore)
    };
}

// Display results
function displayResults(resultsData) {
    const { aspectScores, overallScore, overallCategory } = resultsData;
    document.getElementById('results-modal').classList.remove('hidden');
    showResultsTab();
    document.getElementById('overall-score').textContent = `${overallScore.toFixed(0)}/100`;
    document.getElementById('overall-category').textContent = overallCategory;
    document.getElementById('overall-interpretation').textContent = getFinalInterpretation(aspectScores);

    const detailedResultsContainer = document.getElementById('detailed-results');
    detailedResultsContainer.innerHTML = '';
    aspectScores.forEach(data => {
        const category = getScoreCategory(data.score);
        const displayName = aspectDisplayNames[data.aspect] || capitalize(data.aspect);
        detailedResultsContainer.innerHTML += `
            <div class="flex justify-between items-start p-3 bg-gray-50 rounded-lg border">
                <div class="flex-1 pr-4">
                    <span class="font-medium text-gray-800">${displayName}</span>
                    <p class="text-xs text-gray-500 mt-1">${getAspectInterpretation(data.aspect, data.score)}</p>
                </div>
                <div class="text-right flex-shrink-0">
                    <span class="text-lg font-bold text-indigo-600">${data.score.toFixed(0)}/100</span>
                    <div class="text-sm font-semibold ${getCategoryColor(category)}">${category}</div>
                </div>
            </div>`;
    });

    setTimeout(() => {
        drawResultsChart(aspectScores.map(d => aspectDisplayNames[d.aspect]), aspectScores.map(d => d.score));
    }, 150);
}

// Show quiz history from Firestore
async function showQuizHistory() {
    document.getElementById('results-content').classList.add('hidden');
    document.getElementById('history-content').classList.remove('hidden');
    document.getElementById('results-tab-btn').classList.remove('border-indigo-500', 'text-indigo-600');
    document.getElementById('history-tab-btn').classList.add('border-indigo-500', 'text-indigo-600');

    // Reload history to get latest data
    await loadQuizHistory();

    const container = document.getElementById('quiz-history-container');
    
    if (quizHistory.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-500">Tidak ada riwayat tes.</p>`;
        return;
    }
    
    container.innerHTML = quizHistory.map((attempt, index) => {
        const date = new Date(attempt.date).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-center">
                    <div class="flex-1">
                        <p class="font-semibold">Tes Selesai: ${date}</p>
                        <p class="text-sm text-gray-600">Skor Akhir: <span class="font-bold">${attempt.overallScore.toFixed(0)}/100</span> (${attempt.overallCategory})</p>
                        ${attempt.timeSpent ? `<p class="text-xs text-gray-500 mt-1">Waktu pengerjaan: ${attempt.timeSpent} menit</p>` : ''}
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="viewHistoryDetail('${attempt.id}')" class="text-indigo-600 hover:underline text-sm font-medium">
                            Lihat Detail
                        </button>
                        <button onclick="deleteHistory('${attempt.id}')" class="text-red-600 hover:underline text-sm font-medium">
                            Hapus
                        </button>
                    </div>
                </div>
            </div>`;
    }).join('');
}

// View history detail
window.viewHistoryDetail = function(quizId) {
    const attempt = quizHistory.find(h => h.id === quizId);
    if (attempt) {
        displayResults(attempt);
    }
};

// Delete history
window.deleteHistory = async function(quizId) {
    if (!confirm('Apakah Anda yakin ingin menghapus riwayat quiz ini?')) {
        return;
    }
    
    try {
        const success = await deleteQuizResult(quizId);
        if (success) {
            alert('Riwayat berhasil dihapus');
            await loadQuizHistory();
            showQuizHistory();
        } else {
            alert('Gagal menghapus riwayat');
        }
    } catch (error) {
        console.error('Error deleting history:', error);
        alert('Terjadi kesalahan saat menghapus riwayat');
    }
};

// Show results tab
function showResultsTab() {
    document.getElementById('history-content').classList.add('hidden');
    document.getElementById('results-content').classList.remove('hidden');
    document.getElementById('history-tab-btn').classList.remove('border-indigo-500', 'text-indigo-600');
    document.getElementById('results-tab-btn').classList.add('border-indigo-500', 'text-indigo-600');
}

// Helper functions for scoring
function getScoreCategory(score) {
    if (score <= 40) return "Kurang";
    if (score <= 60) return "Cukup";
    if (score <= 80) return "Baik";
    return "Sangat Baik";
}

function getCategoryColor(category) {
    const colors = { 
        "Kurang": "text-red-600", 
        "Cukup": "text-yellow-600", 
        "Baik": "text-blue-600", 
        "Sangat Baik": "text-green-600" 
    };
    return colors[category] || "text-gray-600";
}

function getAspectInterpretation(aspect, score) {
    const interpretations = {
        empati: { 
            Kurang: "Perlu lebih peka dalam mengenali dan merespons perasaan orang di sekitar Anda.", 
            Cukup: "Sudah mulai bisa memahami perasaan orang lain, tingkatkan inisiatif untuk membantu.", 
            Baik: "Cukup baik dalam berempati. Terus asah kepekaan pada isyarat non-verbal.", 
            "Sangat Baik": "Sangat baik dalam memahami dan merasakan apa yang orang lain rasakan." 
        },
        hatiNurani: { 
            Kurang: "Perlu penguatan pada prinsip kejujuran dan tanggung jawab atas tindakan.", 
            Cukup: "Mulai menunjukkan integritas, namun perlu lebih konsisten dalam menepati janji.", 
            Baik: "Memiliki hati nurani yang baik. Pertahankan untuk selalu bertindak benar.", 
            "Sangat Baik": "Sangat menjunjung tinggi kejujuran dan berani bertanggung jawab." 
        },
        pengendalianDiri: { 
            Kurang: "Cenderung impulsif. Latih kesabaran dan berpikir sebelum bertindak.", 
            Cukup: "Sudah bisa menahan diri dalam beberapa situasi, namun mudah terpancing emosi.", 
            Baik: "Mampu mengelola emosi dan dorongan dengan cukup baik.", 
            "Sangat Baik": "Sangat baik dalam mengendalikan diri, bahkan di bawah tekanan." 
        },
        hormat: { 
            Kurang: "Perlu belajar cara menghargai orang lain melalui tutur kata dan perbuatan.", 
            Cukup: "Kadang masih kurang sopan. Biasakan menggunakan kata 'tolong', 'maaf', 'terima kasih'.", 
            Baik: "Menunjukkan sikap hormat yang baik kepada orang lain.", 
            "Sangat Baik": "Sangat santun dan mampu menghargai perbedaan pendapat." 
        },
        kebaikanHati: { 
            Kurang: "Tingkatkan keinginan untuk menolong orang lain tanpa mengharap imbalan.", 
            Cukup: "Sudah mau membantu jika diminta, coba untuk lebih proaktif menawarkan bantuan.", 
            Baik: "Memiliki sifat penolong dan baik hati. Terus sebarkan energi positif.", 
            "Sangat Baik": "Sangat murah hati dan tulus dalam membantu sesama." 
        },
        toleransi: { 
            Kurang: "Cenderung sulit menerima perbedaan. Buka diri untuk belajar dari orang lain.", 
            Cukup: "Masih sering menilai orang dari latar belakangnya. Fokus pada kesamaan.", 
            Baik: "Mampu menghargai dan menerima perbedaan dengan baik.", 
            "Sangat Baik": "Sangat terbuka dan menghormati keberagaman dalam masyarakat." 
        },
        keadilan: { 
            Kurang: "Seringkali tidak sabar dan ingin menang sendiri. Belajar untuk adil dan sportif.", 
            Cukup: "Sudah mau berbagi, namun perlu belajar berkompromi untuk kebaikan bersama.", 
            Baik: "Memiliki prinsip keadilan yang baik dan tidak memihak.", 
            "Sangat Baik": "Sangat adil, sportif, dan selalu mempertimbangkan hak orang lain." 
        }
    };
    return interpretations[aspect][getScoreCategory(score)] || "Terus kembangkan aspek ini.";
}

function getFinalInterpretation(aspectScores) {
    if (!aspectScores || aspectScores.length === 0) return "Tidak ada data untuk diinterpretasi.";
    const sortedScores = [...aspectScores].sort((a, b) => b.score - a.score);
    const strengths = sortedScores.slice(0, 2).map(item => aspectDisplayNames[item.aspect] || capitalize(item.aspect));
    const weakness = sortedScores.slice(-1)[0];
    if (!weakness) return "Analisis belum dapat ditampilkan.";
    const balance = Math.max(...sortedScores.map(i => i.score)) - Math.min(...sortedScores.map(i => i.score));
    let mainProfile = balance < 25 ? "Profil moral intelligence Anda secara umum cukup seimbang. " : "Profil Anda menunjukkan adanya kekuatan dan area pengembangan yang jelas. ";
    return `${mainProfile}Kekuatan utama Anda ada pada aspek ${strengths.join(' dan ')}. Aspek yang perlu menjadi fokus pengembangan adalah ${aspectDisplayNames[weakness.aspect] || capitalize(weakness.aspect)}.`;
}

// Draw results chart
function drawResultsChart(labels, data) {
    const canvas = document.getElementById('results-chart');
    if (!canvas) return;
    if (radarChartInstance) radarChartInstance.destroy();
    radarChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Skor (%)', 
                data: data, 
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgb(99, 102, 241)',
                pointBackgroundColor: 'rgb(99, 102, 241)',
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: { 
                r: { 
                    beginAtZero: true, 
                    max: 100, 
                    pointLabels: { 
                        font: { size: 12 } 
                    } 
                } 
            },
            plugins: { 
                legend: { display: false } 
            }
        }
    });
}

// Export to PDF (sama seperti sebelumnya)
async function exportToPDF() {
    const participantName = prompt("Silakan masukkan nama Anda untuk laporan:", "Peserta Tes");
    if (!participantName) {
        alert("Pembuatan laporan dibatalkan.");
        return;
    }

    const exportBtn = document.querySelector('button[onclick="exportToPDF()"]');
    const originalBtnText = exportBtn.textContent;
    exportBtn.disabled = true;
    exportBtn.textContent = 'Membuat PDF...';

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const results = calculateFinalResults();
        const { aspectScores, overallScore, overallCategory } = results;
        
        doc.setFont("helvetica");
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229);
        doc.text('Laporan Hasil Tes Moral Intelligence', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Nama: ${participantName}`, 20, 40);
        doc.text(`Tanggal Tes: ${new Date().toLocaleDateString('id-ID')}`, 20, 50);
        
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text('Skor Keseluruhan', 20, 70);
        
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Skor: ${overallScore.toFixed(0)}/100`, 20, 85);
        doc.text(`Kategori: ${overallCategory}`, 20, 95);
        
        doc.setFontSize(12);
        const interpretation = getFinalInterpretation(aspectScores);
        const splitInterpretation = doc.splitTextToSize(interpretation, 170);
        doc.text(splitInterpretation, 20, 110);
        
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text('Rincian Skor per Aspek', 20, 140);
        
        let yPosition = 155;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        aspectScores.forEach((data) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            const displayName = aspectDisplayNames[data.aspect] || capitalize(data.aspect);
            const category = getScoreCategory(data.score);
            const aspectInterpretation = getAspectInterpretation(data.aspect, data.score);
            
            doc.setFont("helvetica", "bold");
            doc.text(`${displayName}: ${data.score.toFixed(0)}/100 (${category})`, 20, yPosition);
            
            doc.setFont("helvetica", "normal");
            const splitAspectInterpretation = doc.splitTextToSize(aspectInterpretation, 170);
            doc.text(splitAspectInterpretation, 20, yPosition + 8);
            
            yPosition += 25;
        });
        
        try {
            const canvas = document.getElementById('results-chart');
            if (canvas && radarChartInstance) {
                const chartImage = canvas.toDataURL('image/png');
                doc.addPage();
                doc.setFontSize(16);
                doc.setTextColor(79, 70, 229);
                doc.text('Grafik Radar Skor', 105, 20, { align: 'center' });
                doc.addImage(chartImage, 'PNG', 30, 30, 150, 150);
            }
        } catch (chartError) {
            console.warn('Could not add chart to PDF:', chartError);
        }
        
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Halaman ${i} dari ${pageCount} | Generated by AI Moral Intelligence Test`, 
                    105, 290, { align: 'center' });
        }
        
        const fileName = `Hasil_Tes_Moral_Intelligence_${participantName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        doc.save(fileName);
        
    } catch (error) {
        console.error('Gagal membuat PDF:', error);
        alert('Gagal membuat PDF. Pastikan koneksi internet stabil untuk memuat library PDF.');
    } finally {
        exportBtn.disabled = false;
        exportBtn.textContent = originalBtnText;
    }
}

// UI control functions
function closeResults() {
    document.getElementById('results-modal').classList.add('hidden');
}

function restartQuiz() {
    if (confirm('Apakah Anda yakin ingin mengulang quiz? Progres saat ini akan hilang.')) {
        closeResults();
        initializeQuiz();
        switchMode('quiz');
    }
}

function discussResults() {
    closeResults();
    switchMode('chat');
    
    setTimeout(() => {
        const message = "Saya baru saja menyelesaikan quiz moral intelligence. Bisakah kamu membantu saya memahami hasil saya dan memberikan saran untuk pengembangan?";
        if (window.handleChatInteraction) {
            window.handleChatInteraction(message);
        }
    }, 300);
}

// Global helper for chat integration
window.quickAskAI = function() {
    switchMode('chat');
    const currentQuestion = document.getElementById('question-text');
    if (currentQuestion) {
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.value = `Tolong bantu saya menjawab pertanyaan ini: "${currentQuestion.textContent}"`;
                chatInput.focus();
            }
        }, 100);
    }
};

window.explainCurrentAspect = function() {
    switchMode('chat');
    const aspectName = document.getElementById('current-aspect-display');
    if (aspectName) {
        setTimeout(() => {
            const message = `Tolong jelaskan tentang aspek "${aspectName.textContent}" dalam moral intelligence.`;
            if (window.handleChatInteraction) {
                window.handleChatInteraction(message);
            }
        }, 100);
    }
};

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export global functions
window.closeResults = closeResults;
window.displayResults = displayResults;
window.discussResults = discussResults;
window.exportToPDF = exportToPDF;
window.restartQuiz = restartQuiz;
window.showResultsTab = showResultsTab;
window.showQuizHistory = showQuizHistory;
window.switchMode = switchMode;
window.quizHistory = quizHistory;

console.log('Test logic module with Firestore loaded');