// Keep these imports and chat logic
let chatLogic = null;
try {
    import('./chat-logic.js').then(module => {
        chatLogic = module;
    });
} catch (e) {
    console.log('Chat logic not available in standalone mode');
}

// === Data Soal & Kata Kunci ===
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
    empati: [
        "peduli","prihatin","empati","tolong","bantu","rasakan","perasaan",
        "pahami","simpati","perhatian","teman","bela","berbagi","menghibur","tenang",
        "senang","sedih","khawatir","canggung","terharu","menolong","kasihan","iba"
    ],
    hatiNurani: [
        "jujur","kejujuran","bertanggung","tanggung jawab","maaf","minta maaf","janji",
        "salah","benar","dosa","akui","memperbaiki","perbaikan","kesalahan",
        "malu","rasa bersalah","menyesal","integritas","adil","kebaikan","moral","etika"
    ],
    pengendalianDiri: [
        "sabar","kesabaran","tenang","napas","tarik napas","kontrol","kendali",
        "menahan diri","mengendalikan","tidak marah","tidak emosi","fokus","berhati-hati",
        "disiplin","teratur","tertib","aturlah","kontrol diri","diam","tidak terburu-buru","mengatur"
    ],
    hormat: [
        "hormat","menghormati","menghargai","tenggang rasa","sopan","santun",
        "permisi","tolong","maaf","sopan santun","etika","tatakrama","nilai",
        "adab","unggah-ungguh","dengar","mendengarkan","memperhatikan","tidak mengejek","tidak menghina","menghargai"
    ],
    kebaikanHati: [
        "baik","kebaikan","ramah","lembut","kasih sayang","welas asih","peduli",
        "empati","simpati","murah hati","dermawan","penolong","menolong","bantu",
        "menghibur","dukung","dukungan","pemaaf","pengertian","ikhlas","tulus","baik hati"
    ],
    toleransi: [
        "toleransi","menerima","penerimaan","menghargai","keterbukaan","berpikiran terbuka",
        "saling menghargai","kesetaraan","tidak diskriminasi","perbedaan","berbeda",
        "beragam","plural","ramah","tidak menghakimi","tidak stereotip","sabar","adil","solidaritas","saling menghormati","inklusif"
    ],
    keadilan: [
        "adil","keadilan","jujur","kejujuran","setara","kesetaraan","hak","hak-hak",
        "aturan","peraturan","sportif","sportivitas","gilir","bergiliran","berbagi",
        "kompromi","win-win","kesepakatan","mendengarkan","transparan","tidak pilih kasih","tidak curang","fair","objektif"
    ]
};

// === State Tes ===
let aspects = Object.keys(keywords);
let currentAspect = null;  // Add this line if it's needed
let currentAspectIndex = 0;
let currentQuestionIndex = 0;
let currentQuestionNumber = 1; 
let answers = {};
let scores = {};
let totalQuestions = 70;
let radarChartInstance = null;
let isQuizStarted = false;

// Add this near the top with other global variables
let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
let currentResults = null;
let currentChart = null;

// Add this after your global variables
const aspectDisplayNames = {
    'empati': 'Empati',
    'hatiNurani': 'Hati Nurani',
    'kontrolDiri': 'Kontrol Diri',
    'rasaHormat': 'Rasa Hormat',
    'kebaikanHati': 'Kebaikan Hati',
    'toleransi': 'Toleransi',
    'keadilan': 'Keadilan',
};

// Update the completeQuiz function to save results
function completeQuiz() {
    try {
        const resultsModal = document.getElementById('results-modal');
        const resultsContent = document.getElementById('results-content');
        
        if (resultsModal) resultsModal.classList.remove('hidden');
        if (resultsContent) resultsContent.classList.remove('hidden');
        
        showResults();
    } catch (error) {
        console.error('Error in completeQuiz:', error);
        // Fallback behavior if showing results fails
        alert('Quiz selesai! Terima kasih telah mengerjakan.');
    }
}

// Add these functions to handle history display
function showQuizHistory() {
    document.getElementById('results-content').classList.add('hidden');
    document.getElementById('history-tab').classList.remove('hidden');
    
    const historyContainer = document.getElementById('quiz-history-container');
    if (!historyContainer) return;
    
    if (quizHistory.length === 0) {
        historyContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada riwayat kuis</p>';
        return;
    }
    
    historyContainer.innerHTML = quizHistory.map((attempt, index) => {
        const date = new Date(attempt.date);
        const formattedDate = date.toLocaleString('id-ID');
        
        return `
            <div class="bg-white rounded-xl shadow-md p-4 mb-4">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-semibold">Percobaan #${index + 1}</h3>
                    <span class="text-sm text-gray-500">${formattedDate}</span>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-2xl font-bold">${attempt.overallScore}/100</span>
                        <span class="ml-2 px-2 py-1 rounded-full text-xs ${getCategoryColor(attempt.category)}">
                            ${attempt.category}
                        </span>
                    </div>
                    <button onclick="showHistoryAttempt(${index})" class="text-indigo-600 hover:text-indigo-800">
                        Lihat Detail
                    </button>
                </div>
                <div id="history-chart-${index}" class="mt-3" style="height: 200px;"></div>
            </div>
        `;
    }).join('');
    
    // Draw charts for each history entry
    setTimeout(() => {
        quizHistory.forEach((attempt, index) => {
            if (document.getElementById(`history-chart-${index}`)) {
                drawHistoryChart(attempt, index);
            }
        });
    }, 100);
}

function showHistoryAttempt(index) {
    const attempt = quizHistory[index];
    if (!attempt) return;
    
    // Update the results modal with history data
    document.getElementById('overall-score').textContent = attempt.overallScore + '/100';
    document.getElementById('overall-category').textContent = attempt.category;
    
    // Update the chart
    updateResultsChart(attempt.scores);
    
    // Show the results tab
    showResultsTab();
}

function showResults() {
    // Define all required elements
    const requiredElements = [
        'results-modal',
        'results-content',
        'history-tab',
        'detailed-results',
        'overall-score',
        'overall-category',
        'results-chart'
    ];

    // Initialize elements object
    const elements = {};
    let allElementsExist = true;

    // Check all required elements
    requiredElements.forEach(id => {
        elements[id] = document.getElementById(id);
        if (!elements[id]) {
            console.error(`Element with ID '${id}' not found`);
            allElementsExist = false;
        }
    });

    if (!allElementsExist) {
        console.error('Required elements not found in the DOM');
        return;
    }

    // Show results modal and hide history
    elements['results-modal'].classList.remove('hidden');
    elements['results-content'].classList.remove('hidden');
    elements['history-tab'].classList.add('hidden');

    // Show the results tab
    showResultsTab();

    requestAnimationFrame(() => {
        try {
            const results = calculateFinalResults();
            const { aspectLabels, aspectScores, overallScore, overallCategory } = results;
            
            // Clear previous results
            elements['detailed-results'].innerHTML = '';

            // Process each aspect
            aspects.forEach((aspect, index) => {
                if (scores[aspect] && scores[aspect].length > 0) {
                    const sum = scores[aspect].reduce((a, b) => a + (b || 0), 0);
                    const maxScore = scores[aspect].length * 10;
                    const percentage = maxScore > 0 ? (sum / maxScore) * 100 : 0;
                    const category = getScoreCategory(percentage);
                    
                    // Create result item
                    const resultItem = document.createElement('div');
                    resultItem.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2';
                    resultItem.innerHTML = `
                        <div>
                            <span class="font-medium text-gray-800">${aspectDisplayNames[aspect] || capitalize(aspect)}</span>
                            <div class="text-xs text-gray-500">${scores[aspect].length} soal dijawab</div>
                        </div>
                        <div class="text-right">
                            <span class="text-lg font-bold text-indigo-600">${percentage.toFixed(1)}%</span>
                            <div class="text-sm ${getCategoryColor(category)}">${category}</div>
                        </div>
                    `;
                    elements['detailed-results'].appendChild(resultItem);
                }
            });

            // Update overall score display
            elements['overall-score'].textContent = `${overallScore.toFixed(1)}%`;
            elements['overall-category'].textContent = overallCategory;
            elements['overall-category'].className = `text-lg font-medium ${getCategoryColor(overallCategory)}`;

            // Initialize chart with a small delay to ensure DOM is ready
            // In the showResults function, update the chart initialization:
            setTimeout(() => {
                const ctx = document.getElementById('results-chart');
                if (ctx) {
                    // Force a small delay to ensure the container is visible
                    setTimeout(() => {
                        updateChart(ctx, aspectLabels, aspectScores);
                    }, 100);
                } else {
                    console.error('Chart canvas element not found');
                }
            }, 100);

            // Save to history
            const historyItem = {
                date: new Date().toISOString(),
                score: overallScore,
                category: overallCategory,
                aspectScores: Object.fromEntries(
                    aspects.map((aspect, i) => [
                        aspect,
                        aspectScores[i] || 0
                    ])
                )
            };

            // Update history in localStorage
            const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
            history.unshift(historyItem);
            localStorage.setItem('quizHistory', JSON.stringify(history));

        } catch (error) {
            console.error('Error showing results:', error);
            alert('Terjadi kesalahan saat menampilkan hasil. Silakan coba lagi.');
        }
    });   
}

function drawHistoryChart(attempt, index) {
    const container = document.getElementById(`history-chart-${index}`);
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    const labels = Object.keys(attempt.scores);
    const data = Object.values(attempt.scores);
    
    new Chart(canvas, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Skor Aspek',
                data: data,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
    setupQuizEventListeners();
});

function initializeQuiz() {
    // Reset state
    answers = {};
    scores = {};
    currentAspectIndex = 0;
    currentQuestionIndex = 0;
    currentQuestionNumber = 1;
    currentAspect = aspects[0];  // Initialize currentAspect
    
    // Initialize answers and scores for each aspect
    aspects.forEach(aspect => {
        answers[aspect] = [];
        scores[aspect] = [];
    });
    
    // Show the first question
    showCurrentQuestion();
}

function setupQuizEventListeners() {
    // Answer input events
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-answer-btn');
    const quickAskBtn = document.getElementById('quick-ask-ai-btn');
    const explainBtn = document.getElementById('explain-aspect-btn');
    const prevBtn = document.getElementById('prev-question-btn'); // Tombol baru
    
    if (answerInput) {
        answerInput.addEventListener('input', updateCharCount);
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                submitAnswer();
            }
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitAnswer);
    }
    
    if (quickAskBtn) {
        quickAskBtn.addEventListener('click', quickAskAI);
    }
    
    if (explainBtn) {
        explainBtn.addEventListener('click', explainCurrentAspect);
    }

    if (prevBtn) { // Event listener untuk tombol baru
        prevBtn.addEventListener('click', moveToPreviousQuestion);
    }
}

function showCurrentQuestion() {
        // Initialize answers object if it doesn't exist
        if (!answers) answers = {};
        
        // Get current aspect with null check and assign to currentAspect
        currentAspect = aspects && aspects[currentAspectIndex];
        if (!currentAspect) {
            console.error('Aspect not found at index:', currentAspectIndex);
            return;
        }
        
        // Get display name with fallback to formatted aspect name
        const displayName = aspectDisplayNames[currentAspect] || 
                           currentAspect.replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
        
        // Initialize answers array for current aspect if needed
        if (!answers[currentAspect]) answers[currentAspect] = [];    
    
    // Get questions for current aspect
    const currentQuestions = questions[currentAspect];
    if (!currentQuestions || currentQuestionIndex >= currentQuestions.length) {
        moveToNextQuestion();
        return;
    }

    // Get all DOM elements at once
    const questionElement = document.getElementById('question-text');
    const aspectNameElement = document.getElementById('aspect-name');
    const questionTitleElement = document.getElementById('question-title');
    const questionNumberElement = document.getElementById('question-number');
    const answerInput = document.getElementById('answer-input');
    
    // Update question text
    if (questionElement) {
        questionElement.textContent = currentQuestions[currentQuestionIndex];
    }
    
    // Update aspect name display
    if (aspectNameElement) {
        aspectNameElement.textContent = displayName;
    }
    
    // Update question title
    if (questionTitleElement) {
        questionTitleElement.textContent = `Pertanyaan ${displayName}`;
    }
    
    // Update question number
    if (questionNumberElement) {
        questionNumberElement.textContent = currentQuestionNumber;
    }
    
    // Update progress display
    updateProgressDisplay();
    
    // Restore previous answer if exists
    if (answerInput) {
        const previousAnswer = answers[currentAspect] && answers[currentAspect][currentQuestionIndex] || '';
        answerInput.value = previousAnswer;
        answerInput.focus();
    }
    
    // Update character count
    updateCharCount();
}

function updateProgressDisplay() {
    const prevBtn = document.getElementById('prev-question-btn');
    if (prevBtn) {
        prevBtn.style.display = (currentQuestionNumber > 1) ? 'block' : 'none';
    }

    // Calculate total questions across all aspects
    let totalQuestionsCount = 0;
    let questionsSoFar = 0;
    
    // Calculate total questions
    aspects.forEach(aspect => {
        totalQuestionsCount += questions[aspect]?.length || 0;
    });
    
    // Calculate questions completed so far
    for (let i = 0; i < currentAspectIndex; i++) {
        questionsSoFar += questions[aspects[i]]?.length || 0;
    }
    questionsSoFar += currentQuestionIndex; // Add current aspect's questions
    
    // Update progress text
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.textContent = `Pertanyaan ${questionsSoFar + 1} dari ${totalQuestionsCount}`;
    }

    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const progress = ((questionsSoFar) / totalQuestionsCount) * 100;
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = `${Math.round(progress)}%`;
    }
}

function updateCharCount() {
    const input = document.getElementById('answer-input');
    const charCountElement = document.getElementById('char-count');
    const submitBtn = document.getElementById('submit-answer-btn');
    
    if (!input) return;
    
    const count = input.value.length;
    if (charCountElement) {
        charCountElement.textContent = count;
    }
    
    if (submitBtn) {
        submitBtn.disabled = count < 10;
    }
}

function submitAnswer() {
    const answer = document.getElementById('answer-input').value.trim();
    if (!answer) return;
    
    if (!currentAspect) {
        console.error('Current aspect is undefined');
        return;
    }
    
    // Save answer
    if (!answers[currentAspect]) {
        answers[currentAspect] = [];
    }
    answers[currentAspect][currentQuestionIndex] = answer;
    
    // Score the answer
    const score = scoreAnswer(answer, currentAspect);
    
    // Save score
    if (!scores[currentAspect]) {
        scores[currentAspect] = [];
    }
    scores[currentAspect][currentQuestionIndex] = score;

    showAnswerFeedback(score, currentAspect);
    moveToNextQuestion();
}

function scoreAnswer(answer, aspect) {
    // Debug logging
    console.log('Scoring answer for aspect:', aspect);
    console.log('Available keywords:', Object.keys(keywords));
    
    // Check if aspect exists in keywords
    if (!aspect || !keywords[aspect] || !Array.isArray(keywords[aspect])) {
        console.error(`Cannot score answer: invalid aspect '${aspect}'`);
        return 5; // Return a default score if aspect is invalid
    }
    
    const words = answer.toLowerCase().split(/\s+/);
    const answerLower = answer.toLowerCase();
    let count = 0;

    keywords[aspect].forEach(keyword => {
        if (answerLower.includes(keyword.toLowerCase())) {
            count++;
        }
    });
    
    const maxKeywords = keywords[aspect].length;
    const score = maxKeywords > 0 ? Math.min(10, Math.round((count / maxKeywords) * 10)) : 5;
    
    console.log(`${aspect} - Skor: ${score}/10 - ${getFeedback(score)}`);
    return score;
}

function getFeedback(score) {
    if (score >= 9) return '👍 Luar biasa! Jawaban Anda sangat komprehensif.';
    if (score >= 7) return '👍 Bagus! Anda menunjukkan pemahaman yang baik.';
    if (score >= 5) return '👍 Cukup baik. Pertimbangkan untuk lebih mendalam.';
    return 'Coba lebih rinci dalam menjawab.';
}

// Add the showAnswerFeedback function here
function showAnswerFeedback(score, aspect) {
    const feedback = getFeedback(score);
    console.log(`${aspect} - Skor: ${score}/10 - ${feedback}`);
    
    // You can add UI feedback here if needed
    // For example, showing a toast notification
    const feedbackElement = document.getElementById('feedback-message');
    if (feedbackElement) {
        feedbackElement.textContent = feedback;
        feedbackElement.className = `p-3 rounded-lg mb-4 ${
            score >= 7 ? 'bg-green-100 text-green-800' : 
            score >= 5 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
        }`;
        feedbackElement.classList.remove('hidden');
    }
}

function moveToNextQuestion() {
    // Get current aspect and questions
    const currentAspect = aspects[currentAspectIndex];
    const currentQuestions = questions[currentAspect];
    
    if (!currentAspect || !currentQuestions) {
        console.error('Invalid aspect or questions not found');
        return;
    }

    // Save current answer if input exists
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        const answer = answerInput.value.trim();
        if (answer) {
            if (!answers[currentAspect]) {
                answers[currentAspect] = [];
            }
            answers[currentAspect][currentQuestionIndex] = answer;
        }
    }

    // Check if we can move to next question in current aspect
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        currentQuestionNumber++;
    } else {
        // Move to next aspect
        if (currentAspectIndex < aspects.length - 1) {
            currentAspectIndex++;
            currentQuestionIndex = 0;
            currentQuestionNumber++;
            // Update currentAspect to the new aspect
            currentAspect = aspects[currentAspectIndex];
        } else {
            // Quiz completed
            completeQuiz();
            return;
        }
    }
    
    // Update progress display and show next question
    updateProgressDisplay();
    showCurrentQuestion();
}

// === FUNGSI BARU UNTUK KEMBALI ===
function moveToPreviousQuestion() {
    if (currentQuestionNumber <= 1) {
        return; // Tidak bisa kembali dari soal pertama
    }

    currentQuestionNumber--;
    currentQuestionIndex--;

    if (currentQuestionIndex < 0) {
        currentAspectIndex--;
        // Atur ke soal terakhir dari aspek sebelumnya
        const prevAspect = aspects[currentAspectIndex];
        currentQuestionIndex = questions[prevAspect].length - 1;
    }

    showCurrentQuestion();
}

// Update the completeQuiz function to save results to history
function completeQuiz() {
    const results = calculateFinalResults();
    
    // Save to history
    const historyEntry = {
        date: new Date().toISOString(),
        scores: results.aspectScores,
        overallScore: results.overallScore,
        category: results.overallCategory
    };
    
    quizHistory.unshift(historyEntry); // Add to beginning of array
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    
    showResults();
}

function calculateFinalResults() {
    const aspectScores = {};
    let totalScore = 0;
    let totalMaxScore = 0;

    // Calculate scores for each aspect
    aspects.forEach(aspect => {
        const aspectQuestions = questions[aspect] || [];
        const aspectAnswers = answers[aspect] || [];
        const aspectScoresList = scores[aspect] || [];
        
        // Calculate average score for this aspect
        const aspectTotal = aspectScoresList.reduce((sum, score) => sum + (score || 0), 0);
        const aspectAverage = aspectScoresList.length > 0 
            ? (aspectTotal / aspectScoresList.length) * 10 
            : 0;
            
        aspectScores[aspect] = {
            score: Math.round(aspectAverage * 10) / 10, // Round to 1 decimal place
            maxScore: 100,
            category: getScoreCategory(aspectAverage)
        };
        
        totalScore += aspectAverage * aspectQuestions.length;
        totalMaxScore += 100 * aspectQuestions.length;
    });
    
    // Calculate overall score
    const overallScore = totalMaxScore > 0 
        ? Math.round((totalScore / totalMaxScore) * 1000) / 10 
        : 0;
    
    return {
        aspectScores,
        overallScore,
        overallCategory: getScoreCategory(overallScore),
        timestamp: new Date().toISOString()
    };
}

function showResults() {
    const resultsModal = document.getElementById('results-modal');
    const resultsContent = document.getElementById('results-content');
    const historyTab = document.getElementById('history-tab');
    
    if (!resultsModal || !resultsContent || !historyTab) {
        console.error('Required elements not found in the DOM');
        return;
    }

    resultsModal.classList.remove('hidden');
    resultsContent.classList.remove('hidden');
    historyTab.classList.add('hidden');
    
    const results = calculateFinalResults();
    
    const aspectScores = [];
    const aspectLabels = [];
    let totalScore = 0;
    let totalMaxScore = 0;
    
    const detailedResults = document.getElementById('detailed-results');
    if (detailedResults) {
        detailedResults.innerHTML = '';
    }

    aspects.forEach(aspect => {
        if (scores[aspect] && scores[aspect].length > 0) {
            const sum = scores[aspect].reduce((a, b) => a + b, 0);
            const maxScore = scores[aspect].length * 10;
            const percentage = (sum / maxScore) * 100;
            const category = getScoreCategory(percentage);
            
            totalScore += sum;
            totalMaxScore += maxScore;
            
            aspectScores.push(percentage);
            aspectLabels.push(capitalize(aspect));
            
            if (detailedResults) {
                const resultItem = document.createElement('div');
                resultItem.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200';
                resultItem.innerHTML = `
                    <div>
                        <span class="font-medium text-gray-800">${capitalize(aspect)}</span>
                        <div class="text-xs text-gray-500">${scores[aspect].length} soal dijawab</div>
                    </div>
                    <div class="text-right">
                        <span class="text-lg font-bold text-indigo-600">${percentage.toFixed(1)}%</span>
                        <div class="text-sm ${getCategoryColor(category)}">${category}</div>
                    </div>
                `;
                detailedResults.appendChild(resultItem);
            }
        }
    });

    const finalScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    const overallScore = document.getElementById('overall-score');
    const overallInterpretation = document.getElementById('overall-interpretation');
    
    if (overallScore) {
        overallScore.textContent = `${finalScore.toFixed(1)}%`;
    }
    
    if (overallInterpretation) {
        overallInterpretation.textContent = getScoreInterpretation(finalScore);
    }

    updateChart(aspectLabels, aspectScores);
}

function getScoreCategory(score) {
    if (score <= 25) return "Perlu Perbaikan";
    if (score <= 50) return "Cukup Baik";
    if (score <= 75) return "Baik";
    return "Sangat Baik";
}

function getCategoryColor(category) {
    const colors = {
        'Sangat Baik': '#2E7D32',  // Hijau
        'Baik': '#689F38',         // Hijau Muda
        'Cukup': '#FFA000',        // Kuning
        'Kurang': '#FF6D00',       // Orange
        'Sangat Kurang': '#D32F2F' // Merah
    };
    return colors[category] || '#000000';
}

function getScoreInterpretation(score) {
    if (score <= 25) return "Anda memiliki potensi besar untuk mengembangkan moral intelligence. Mari fokus pada empati dan kejujuran sebagai langkah awal.";
    if (score <= 50) return "Moral intelligence Anda sudah cukup baik, namun masih ada ruang untuk peningkatan dalam memahami dan merespons orang lain.";
    if (score <= 75) return "Anda menunjukkan moral intelligence yang baik. Terus kembangkan aspek-aspek yang masih perlu diperkuat.";
    return "Selamat! Anda memiliki moral intelligence yang sangat baik. Pertahankan dan terus jadilah teladan bagi orang lain.";
}

function updateChart(ctx, labels, data) {
    // Validate input parameters
    if (!ctx || !ctx.getContext) {
        console.error('Invalid canvas element or context not supported');
        return;
    }

    // Ensure the canvas is visible
    ctx.style.display = 'block';
    ctx.width = ctx.parentElement.offsetWidth;
    ctx.height = ctx.parentElement.offsetHeight;
    
    // If there's an existing chart, destroy it first
    if (window.resultsChart) {
        window.resultsChart.destroy();
    }

    try {
        // Create new chart
        window.resultsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skor Aspek',
                    data: data,
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        angleLines: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20,
                            backdropColor: 'transparent',
                            color: 'rgba(0, 0, 0, 0.7)',
                            font: {
                                size: 10
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 13,
                                weight: 'bold'
                            },
                            color: '#374151'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.raw}%`;
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.1
                    }
                }
            }
        });
    } catch (error) {
        console.error('Failed to create chart:', error);
    }
}

// === Helper Functions for Chat Integration ===
function getCurrentQuestion() {
    if (currentAspectIndex >= aspects.length) return null;
    
    const aspect = aspects[currentAspectIndex];
    const question = questions[aspect][currentQuestionIndex];
    const relevantKeywords = keywords[aspect].slice(0, 10).join(', ');
    
    return {
        aspect: aspect,
        question: question,
        keywords: relevantKeywords,
        questionNumber: currentQuestionNumber,
        totalQuestions: totalQuestions
    };
}

function getCurrentAspectName() {
    if (currentAspectIndex >= aspects.length) return null;
    return aspects[currentAspectIndex];
}

function getQuizProgress() {
    if (!isQuizStarted) {
        return "Quiz belum dimulai. Silakan mulai menjawab soal untuk melihat progress.";
    }
    
    if (Object.keys(scores).length === 0) {
        return "Anda belum menjawab soal apapun. Silakan kembali ke mode quiz dan mulai menjawab!";
    }
    
    let message = "📊 **Progress Quiz Anda:**\n\n";
    let totalAnswered = 0;
    let totalScore = 0;
    let totalMaxScore = 0;
    
    aspects.forEach(aspect => {
        if (scores[aspect] && scores[aspect].length > 0) {
            const sum = scores[aspect].reduce((a, b) => a + b, 0);
            const maxScore = scores[aspect].length * 10;
            const percentage = (sum / maxScore) * 100;
            const category = getScoreCategory(percentage);
            
            message += `**${capitalize(aspect)}:** ${scores[aspect].length} soal → ${percentage.toFixed(1)}% (${category})\n`;
            totalAnswered += scores[aspect].length;
            totalScore += sum;
            totalMaxScore += maxScore;
        }
    });
    
    const overallPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    
    message += `\n**Total Progres:**\n`;
    message += `• Soal dijawab: ${totalAnswered} dari ${totalQuestions}\n`;
    message += `• Kemajuan: ${((totalAnswered / totalQuestions) * 100).toFixed(1)}%\n`;
    
    if (totalAnswered > 0) {
        message += `• Skor rata-rata: ${overallPercentage.toFixed(1)}%\n`;
        message += `• Kategori: ${getScoreCategory(overallPercentage)}`;
    }
    
    return message;
}

// === Quick Actions ===
function quickAskAI() {
    if (typeof switchMode === 'function') {
        switchMode('chat');
        
        const currentQ = getCurrentQuestion();
        if (currentQ && typeof handleChatInteraction === 'function') {
            const message = `Saya kesulitan menjawab pertanyaan ini. Bisa bantu berikan panduan?\n\n**Pertanyaan ${currentQ.questionNumber}** (Aspek: ${capitalize(currentQ.aspect)}):\n"${currentQ.question}"\n\nBagaimana cara menjawab yang baik?`;
            
            // Add slight delay to ensure UI is ready
            setTimeout(() => {
                handleChatInteraction(message);
            }, 300);
        }
    } else {
        alert('Fitur chat AI tidak tersedia. Silakan gunakan tips berikut:\n\n1. Berikan contoh konkret dari pengalaman Anda\n2. Jelaskan perasaan dan motivasi Anda\n3. Ceritakan dampak positif dari tindakan Anda\n4. Gunakan kata-kata yang menunjukkan empati dan kepedulian');
    }
}

function explainCurrentAspect() {
    const currentAspect = getCurrentAspectName();
    if (!currentAspect) return;
    
    if (typeof switchMode === 'function') {
        switchMode('chat');
        
        const message = `Tolong jelaskan aspek "${capitalize(currentAspect)}" dalam moral intelligence secara detail beserta contoh praktisnya dalam kehidupan sehari-hari.`;
        
        setTimeout(() => {
            if (typeof handleChatInteraction === 'function') {
                handleChatInteraction(message);
            }
        }, 300);
    } else {
        const explanations = {
            empati: "Empati adalah kemampuan memahami dan merasakan perasaan orang lain. Contoh: mendengarkan dengan perhatian saat teman bercerita tentang masalahnya.",
            hatiNurani: "Hati nurani adalah suara moral internal yang membantu membedakan benar dan salah. Contoh: mengakui kesalahan dan meminta maaf dengan tulus.",
            pengendalianDiri: "Pengendalian diri adalah kemampuan mengatur emosi dan perilaku. Contoh: tetap tenang dan tidak marah saat dikritik.",
            hormat: "Hormat adalah sikap menghargai diri sendiri dan orang lain. Contoh: mendengarkan pendapat orang lain tanpa menyela.",
            kebaikanHati: "Kebaikan hati adalah kecenderungan berbuat baik tanpa pamrih. Contoh: membantu orang lain tanpa mengharapkan imbalan.",
            toleransi: "Toleransi adalah kemampuan menerima perbedaan. Contoh: menghormati teman yang memiliki kepercayaan berbeda.",
            keadilan: "Keadilan adalah prinsip memperlakukan semua orang secara setara. Contoh: tidak pilih kasih dalam memberikan kesempatan."
        };
        
        alert(explanations[currentAspect] || "Aspek moral intelligence yang penting untuk karakter.");
    }
}

// === Results Actions ===
function closeResults() {
    const modal = document.getElementById('results-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function discussResults() {
    closeResults();
    
    if (typeof switchMode === 'function') {
        switchMode('chat');
        
        // Generate comprehensive results summary for AI discussion
        const resultsMessage = generateResultsSummaryForAI();
        
        setTimeout(() => {
            if (typeof addMessageToChat === 'function') {
                addMessageToChat('Diskusikan hasil quiz saya', 'user');
                addMessageToChat(resultsMessage, 'ai');
            } else if (typeof handleChatInteraction === 'function') {
                handleChatInteraction('Saya sudah menyelesaikan quiz moral intelligence. Bisa bantu analisis hasil dan berikan saran pengembangan?');
            }
        }, 300);
    }
}

function generateResultsSummaryForAI() {
    let message = "🎯 **Hasil Quiz Moral Intelligence Anda:**\n\n";
    
    let totalScore = 0;
    let totalMaxScore = 0;
    const aspectAnalysis = [];
    
    aspects.forEach(aspect => {
        if (scores[aspect] && scores[aspect].length > 0) {
            const sum = scores[aspect].reduce((a, b) => a + b, 0);
            const maxScore = scores[aspect].length * 10;
            const percentage = (sum / maxScore) * 100;
            const category = getScoreCategory(percentage);
            
            totalScore += sum;
            totalMaxScore += maxScore;
            
            message += `**${capitalize(aspect)}:** ${percentage.toFixed(1)}% → ${category}\n`;
            
            if (percentage < 50) {
                aspectAnalysis.push(`${capitalize(aspect)} perlu diperkuat`);
            } else if (percentage >= 75) {
                aspectAnalysis.push(`${capitalize(aspect)} sudah sangat baik`);
            }
        }
    });
    
    const finalScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    message += `\n**Skor Keseluruhan:** ${finalScore.toFixed(1)}%\n`;
    message += `**Interpretasi:** ${getScoreInterpretation(finalScore)}\n\n`;
    
    if (aspectAnalysis.length > 0) {
        message += `**Analisis Singkat:**\n${aspectAnalysis.join('\n')}\n\n`;
    }
    
    message += "Bagaimana menurut Anda? Ada aspek tertentu yang ingin kita bahas lebih dalam? Saya bisa memberikan tips praktis untuk pengembangan karakter moral.";
    
    return message;
}

function downloadResults() {
    // Simple implementation - could be enhanced with actual PDF generation
    const resultsText = generateTextReport();
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hasil-Quiz-Moral-Intelligence-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateTextReport() {
    let report = "LAPORAN HASIL QUIZ MORAL INTELLIGENCE\n";
    report += "=====================================\n\n";
    report += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n`;
    report += `Total Soal: ${totalQuestions}\n\n`;
    
    report += "DETAIL SKOR PER ASPEK:\n";
    report += "----------------------\n";
    
    let totalScore = 0;
    let totalMaxScore = 0;
    
    aspects.forEach(aspect => {
        if (scores[aspect] && scores[aspect].length > 0) {
            const sum = scores[aspect].reduce((a, b) => a + b, 0);
            const maxScore = scores[aspect].length * 10;
            const percentage = (sum / maxScore) * 100;
            const category = getScoreCategory(percentage);
            
            totalScore += sum;
            totalMaxScore += maxScore;
            
            report += `${capitalize(aspect).padEnd(20)}: ${percentage.toFixed(1)}% (${category})\n`;
        }
    });
    
    const finalScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    report += "\nSKOR KESELURUHAN:\n";
    report += "-----------------\n";
    report += `Total Skor: ${finalScore.toFixed(1)}%\n`;
    report += `Kategori: ${getScoreCategory(finalScore)}\n\n`;
    report += `Interpretasi: ${getScoreInterpretation(finalScore)}\n\n`;
    
    report += "REKOMENDASI PENGEMBANGAN:\n";
    report += "------------------------\n";
    
    aspects.forEach(aspect => {
        if (scores[aspect] && scores[aspect].length > 0) {
            const sum = scores[aspect].reduce((a, b) => a + b, 0);
            const maxScore = scores[aspect].length * 10;
            const percentage = (sum / maxScore) * 100;
            
            if (percentage < 50) {
                report += `- Fokus mengembangkan aspek ${capitalize(aspect)}\n`;
            }
        }
    });
    
    return report;
}

function restartQuiz() {
    if (confirm('Apakah Anda yakin ingin mengulang quiz? Semua jawaban sebelumnya akan hilang.')) {
        // Reset quiz state
        currentAspectIndex = 0;
        currentQuestionIndex = 0;
        currentQuestionNumber = 1;
        answers = {};
        scores = {};
        
        closeResults();
        showCurrentQuestion();
        
        if (typeof switchMode === 'function') {
            switchMode('quiz');
        }
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function exportToWord() {
    try {
        const results = calculateFinalResults();
        if (!results) {
            throw new Error('No results to export');
        }

        // Get aspect scores and labels
        const aspectScores = [];
        const aspectLabels = [];
        
        // Calculate scores for each aspect
        aspects.forEach(aspect => {
            if (scores[aspect] && scores[aspect].length > 0) {
                const sum = scores[aspect].reduce((a, b) => a + (b || 0), 0);
                const maxScore = scores[aspect].length * 10;
                const percentage = maxScore > 0 ? (sum / maxScore) * 100 : 0;
                
                aspectScores.push(percentage);
                aspectLabels.push(aspectDisplayNames[aspect] || capitalize(aspect));
            }
        });

        // Calculate overall score
        const totalScore = aspectScores.reduce((sum, score) => sum + score, 0);
        const overallScore = aspectScores.length > 0 ? totalScore / aspectScores.length : 0;
        const overallCategory = getScoreCategory(overallScore);

        // Create HTML content for Word document
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    h1 { color: #1a365d; }
                    h2 { color: #2c5282; margin-top: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .score { font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>Hasil Tes Kecerdasan Moral</h1>
                <p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
                
                <h2>Ringkasan Hasil</h2>
                <p>Skor Keseluruhan: <span class="score">${overallScore.toFixed(1)}%</span> (${overallCategory})</p>
                
                <h2>Detail Aspek</h2>
                <table>
                    <tr>
                        <th>Aspek</th>
                        <th>Skor</th>
                        <th>Kategori</th>
                    </tr>
        `;

        // Add aspect scores to the table
        aspectLabels.forEach((label, index) => {
            const score = aspectScores[index];
            const category = getScoreCategory(score);
            html += `
                <tr>
                    <td>${label}</td>
                    <td>${score.toFixed(1)}%</td>
                    <td>${category}</td>
                </tr>
            `;
        });

        // Close the HTML
        html += `
                </table>
                <p>Interpretasi: ${getScoreInterpretation(overallScore)}</p>
            </body>
            </html>
        `;

        // Create a Blob with the HTML content
        const blob = new Blob(
            ['\ufeff', html], // Add BOM for UTF-8
            { type: 'application/msword;charset=utf-8' }
        );

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hasil-tes-kecerdasan-moral-${new Date().toISOString().split('T')[0]}.doc`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Export error:', error);
        alert('Gagal mengekspor ke Word. Silakan coba lagi nanti.');
    }
}

// === Global Functions ===
window.getCurrentQuestion = getCurrentQuestion;
window.getCurrentAspectName = getCurrentAspectName;
window.getQuizProgress = getQuizProgress;
window.quickAskAI = quickAskAI;
window.explainCurrentAspect = explainCurrentAspect;
window.closeResults = closeResults;
window.discussResults = discussResults;
window.downloadResults = downloadResults;
window.restartQuiz = restartQuiz;
window.initializeQuiz = initializeQuiz;
window.exportToWord = exportToWord;
window.showResultsTab = showResultsTab;
window.showQuizHistory = showQuizHistory;
window.showHistoryAttempt = showHistoryAttempt;


// Add this function to display history
function showQuizHistory() {
    const historyContainer = document.getElementById('quiz-history-container');
    if (!historyContainer) return;
    
    if (quizHistory.length === 0) {
        historyContainer.innerHTML = '<p class="text-gray-500">Belum ada riwayat kuis</p>';
        return;
    }
    
    historyContainer.innerHTML = quizHistory.map((attempt, index) => {
        const date = new Date(attempt.date);
        const formattedDate = date.toLocaleString('id-ID');
        
        return `
            <div class="bg-white rounded-xl shadow-md p-4 mb-4">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-semibold">Percobaan #${quizHistory.length - index}</h3>
                    <span class="text-sm text-gray-500">${formattedDate}</span>
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-2xl font-bold">${attempt.overallScore}/100</span>
                        <span class="ml-2 px-2 py-1 rounded-full text-xs ${getCategoryColor(attempt.category)}">
                            ${attempt.category}
                        </span>
                    </div>
                    <button onclick="showHistoryAttempt(${index})" class="text-indigo-600 hover:text-indigo-800">
                        Lihat Detail
                    </button>
                </div>
                <div id="history-chart-${index}" class="mt-3" style="height: 200px;"></div>
            </div>
        `;
    }).join('');
    
    // Draw charts for each history entry
    quizHistory.forEach((attempt, index) => {
        if (document.getElementById(`history-chart-${index}`)) {
            drawHistoryChart(attempt, index);
        }
    });
}

// Add this function to draw charts for history entries
function drawHistoryChart(attempt, index) {
    const ctx = document.createElement('canvas');
    document.getElementById(`history-chart-${index}`).appendChild(ctx);
    
    const labels = Object.keys(attempt.scores);
    const data = Object.values(attempt.scores);
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Skor Aspek',
                data: data,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

// Add this function to handle showing the results tab
function showResultsTab() {
    document.getElementById('results-content').classList.remove('hidden');
    document.getElementById('history-tab').classList.add('hidden');
    // Update active tab styling
    document.getElementById('results-tab-btn').classList.add('text-indigo-600', 'border-indigo-600');
    document.getElementById('results-tab-btn').classList.remove('text-gray-500');
    document.getElementById('history-tab-btn').classList.remove('text-indigo-600', 'border-indigo-600');
    document.getElementById('history-tab-btn').classList.add('text-gray-500');
}

// Add this function to show a specific attempt in detail
function showHistoryAttempt(index) {
    const attempt = quizHistory[index];
    if (!attempt) return;
    
    // Update the results modal with history data
    document.getElementById('overall-score').textContent = attempt.overallScore + '/100';
    document.getElementById('overall-category').textContent = attempt.category;
    
    // Show the results modal
    document.getElementById('results-modal').classList.remove('hidden');
    
    // Update the chart
    const ctx = document.getElementById('results-chart');
    if (ctx) {
        // Clear previous chart if exists
        if (window.resultsChart) {
            window.resultsChart.destroy();
        }
        
        // Draw new chart
        const labels = Object.keys(attempt.scores);
        const data = Object.values(attempt.scores);
        
        window.resultsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skor Aspek',
                    data: data,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
    setupQuizEventListeners();
    
    // Set initial back button state
    const prevBtn = document.getElementById('prev-question-btn');
    if (prevBtn) {
        prevBtn.style.display = 'none'; // Hide on first question
    }

    // Load history if needed
    if (document.getElementById('quiz-history-container')) {
        showQuizHistory();
    }
});