let questions = [];
let currentIndex = 0;
let scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
};

// UI Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const progressFill = document.getElementById('progress-fill');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionNumber = document.getElementById('question-number');
const progressPercent = document.getElementById('progress-percent');

// Type Data
const mbtiTypes = {
    'INTJ': { name: '建築師', desc: '富有想像力和戰略性的思想家，一切皆在計劃之中。' },
    'INTP': { name: '邏輯學家', desc: '具有創造力的發明家，對知識有著止不住的渴望。' },
    'ENTJ': { name: '指揮官', desc: '大膽、富有想像力且意志強大的領導者，總能找到或創造解決問題的方法。' },
    'ENTP': { name: '辯論家', desc: '聰明好奇的思想者，無法抗拒智力上的挑戰。' },
    'INFJ': { name: '提倡者', desc: '安靜而神秘，同時鼓舞人心且不倦的理想主義者。' },
    'INFP': { name: '調停者', desc: '詩意、善良且利他主義的人，總是渴望幫助身邊的人。' },
    'ENFJ': { name: '主人公', desc: '富有魅力且鼓舞人心的領導者，能夠使聽眾聽得出神。' },
    'ENFP': { name: '競選者', desc: '熱情、有創造力且自由自在的靈魂，總能找到理由微笑。' },
    'ISTJ': { name: '物流師', desc: '務實且注重事實的人，可靠性不容置疑。' },
    'ISFJ': { name: '守護者', desc: '非常專注而溫暖的守護者，時刻準備著保護愛的人。' },
    'ESTJ': { name: '總經理', desc: '優秀的管理者，在管理事物或人方面有著無與倫比的能力。' },
    'ESFJ': { name: '執政官', desc: '極度關心他人、社交型且受歡迎的人，總是熱心提供幫助。' },
    'ISTP': { name: '鑑賞家', desc: '大膽且實際的實驗家，擅長使用各類工具。' },
    'ISFP': { name: '探險家', desc: '靈活有魅力的藝術家，時刻準備著探索和體驗新鮮事物。' },
    'ESTP': { name: '企業家', desc: '聰明、精力充沛且感知的敏銳者，真正享受冒險。' },
    'ESFP': { name: '表演者', desc: '自發的、精力充沛且熱情的表演者 —— 生活在他們身邊永不無聊。' }
};

// Initialize
async function init() {
    try {
        const response = await fetch('mbti_questions.json');
        questions = await response.json();

        document.getElementById('start-btn').addEventListener('click', startQuiz);
        document.getElementById('restart-btn').addEventListener('click', () => location.reload());
    } catch (error) {
        console.error('Error loading questions:', error);
        questionText.innerText = "無法載入題目，請稍後再試。";
    }
}

function startQuiz() {
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    showQuestion();
}

function showQuestion() {
    const q = questions[currentIndex];
    questionText.innerText = q.question;
    questionNumber.innerText = `第 ${currentIndex + 1} 題`;

    // Update progress
    const percent = Math.round((currentIndex / questions.length) * 100);
    progressFill.style.width = `${percent}%`;
    progressPercent.innerText = `${percent}%`;

    optionsContainer.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(opt.score);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(scoreLetter) {
    scores[scoreLetter]++;
    currentIndex++;

    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');

    // Calculate MBTI Code
    const mbti = [
        scores.E >= scores.I ? 'E' : 'I',
        scores.S >= scores.N ? 'S' : 'N',
        scores.T >= scores.F ? 'T' : 'F',
        scores.J >= scores.P ? 'J' : 'P'
    ].join('');

    const typeInfo = mbtiTypes[mbti] || { name: '未知', desc: '性格太特殊了，我們暫時無法精確定義。' };

    document.getElementById('mbti-code').innerText = mbti;
    document.getElementById('mbti-name').innerText = typeInfo.name;
    document.getElementById('mbti-description').innerText = typeInfo.desc;

    // Show Dimension Stats
    const statsContainer = document.getElementById('dimensions-scores');
    statsContainer.innerHTML = '';

    const dimensions = [
        { left: 'E', right: 'I', label: '能量' },
        { left: 'S', right: 'N', label: '感知' },
        { left: 'T', right: 'F', label: '判斷' },
        { left: 'J', right: 'P', label: '生活' }
    ];

    dimensions.forEach(dim => {
        const total = scores[dim.left] + scores[dim.right];
        const leftPercent = total === 0 ? 50 : (scores[dim.left] / total) * 100;

        const row = document.createElement('div');
        row.className = 'dim-row';
        row.innerHTML = `
            <span class="dim-label">${dim.left}</span>
            <div class="dim-track">
                <div class="dim-bar" style="width: ${leftPercent}%"></div>
            </div>
            <span class="dim-label">${dim.right}</span>
        `;
        statsContainer.appendChild(row);
    });
}

init();
