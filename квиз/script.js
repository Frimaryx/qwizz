/* ============================================================
   Математикалық викторина — логика
   Тақырып: 10, 100 және 1000-ға көбейту мен бөлу
   Барлық сұрақ, жауап және түсіндірме осы массивте сақталады.
   ============================================================ */

const QUESTIONS = [
  {
    question: "5 × 10 = ?",
    options: ["50", "15", "500", "55"],
    correct: 0,
    explanation:
      "5 × 10 = 50. 10-ға көбейткенде сан 10 есе үлкейеді, сондықтан соңына бір нөл қосылады.",
  },
  {
    question: "70 ÷ 10 = ?",
    options: ["7", "17", "70", "700"],
    correct: 0,
    explanation:
      "70 ÷ 10 = 7. 10-ға бөлгенде сан 10 есе кішірейеді, сондықтан бір нөл азаяды.",
  },
  {
    question: "8 × 100 = ?",
    options: ["80", "800", "108", "8000"],
    correct: 1,
    explanation:
      "8 × 100 = 800. 100-ге көбейткенде сан 100 есе үлкейеді — соңына екі нөл қосылады.",
  },
  {
    question: "400 ÷ 100 = ?",
    options: ["4", "40", "14", "400"],
    correct: 0,
    explanation:
      "400 ÷ 100 = 4. 100-ге бөлгенде сан 100 есе кішірейеді — екі нөл азаяды.",
  },
  {
    question: "6 × 1000 = ?",
    options: ["600", "106", "6000", "60000"],
    correct: 2,
    explanation:
      "6 × 1000 = 6000. 1000-ға көбейткенде сан 1000 есе үлкейеді — соңына үш нөл қосылады.",
  },
  {
    question: "9000 ÷ 1000 = ?",
    options: ["9", "90", "19", "900"],
    correct: 0,
    explanation:
      "9000 ÷ 1000 = 9. 1000-ға бөлгенде сан 1000 есе кішірейеді — үш нөл азаяды.",
  },
  {
    question: "25 × 10 = ?",
    options: ["35", "250", "2500", "205"],
    correct: 1,
    explanation:
      "25 × 10 = 250. 10-ға көбейткенде соңына бір нөл қосылады: 25 → 250.",
  },
  {
    question: "560 ÷ 10 = ?",
    options: ["56", "65", "560", "5060"],
    correct: 0,
    explanation:
      "560 ÷ 10 = 56. 10-ға бөлгенде сан 10 есе кішірейеді — соңғы нөл азаяды.",
  },
  {
    question: "12 × 100 = ?",
    options: ["120", "112", "1200", "12000"],
    correct: 2,
    explanation:
      "12 × 100 = 1200. 100-ге көбейткенде соңына екі нөл қосылады: 12 → 1200.",
  },
  {
    question: "45000 ÷ 1000 = ?",
    options: ["45", "450", "405", "4500"],
    correct: 0,
    explanation:
      "45000 ÷ 1000 = 45. 1000-ға бөлгенде сан 1000 есе кішірейеді — соңынан үш нөл азаяды.",
  },
];

const LETTERS = ["А", "Ә", "Б", "В"];
const TOTAL = QUESTIONS.length;

/* ---------------- DOM элементтері ---------------- */
const el = {
  screens: {
    start: document.getElementById("screen-start"),
    quiz: document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results"),
    reviewDone: document.getElementById("screen-review-done"),
  },
  modeLabel: document.getElementById("quiz-mode-label"),
  counter: document.getElementById("quiz-counter"),
  progress: document.querySelector(".progress"),
  progressFill: document.getElementById("progress-fill"),
  question: document.getElementById("quiz-question"),
  options: document.getElementById("quiz-options"),
  feedback: document.getElementById("quiz-feedback"),
  feedbackIcon: document.getElementById("feedback-icon"),
  feedbackTitle: document.getElementById("feedback-title"),
  feedbackText: document.getElementById("feedback-text"),
  btnNext: document.getElementById("btn-next"),
  btnStart: document.getElementById("btn-start"),
  btnReview: document.getElementById("btn-review"),
  btnRestart: document.getElementById("btn-restart"),
  btnReviewAgain: document.getElementById("btn-review-again"),
  btnBackResults: document.getElementById("btn-back-results"),
  btnRestart2: document.getElementById("btn-restart-2"),
  resultsTitle: document.getElementById("results-title"),
  resultsScore: document.getElementById("results-score"),
  statCorrect: document.getElementById("stat-correct"),
  statWrong: document.getElementById("stat-wrong"),
  resultsMessage: document.getElementById("results-message"),
  reviewDoneCorrect: document.getElementById("review-done-correct"),
  reviewDoneWrong: document.getElementById("review-done-wrong"),
  reviewDoneText: document.getElementById("review-done-text"),
};

/* ---------------- Күй (state) ---------------- */
let session = null;   // ағымдағы сессия
let mainWrong = [];   // негізгі викторинада қате кеткен сұрақ индекстері
let lastReviewWrong = []; // қайталау кезінде қате кеткен сұрақтар

/* ---------------- Экран ауыстыру ---------------- */
function showScreen(name) {
  Object.values(el.screens).forEach((s) => s.classList.remove("active"));
  el.screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- Сессия бастау ---------------- */
function startSession(order, mode) {
  session = {
    order,
    mode,               // "quiz" | "review"
    current: 0,
    correctCount: 0,
    wrongCount: 0,
    answered: false,
    selected: null,
    results: [],        // { qIndex, selected, correct }
  };
  el.modeLabel.textContent = mode === "review" ? "Қателерді түзету" : "Викторина";
  el.modeLabel.classList.toggle("review", mode === "review");
  showScreen("quiz");
  renderQuestion();
}

/* ---------------- Сұрақты көрсету ---------------- */
function renderQuestion() {
  const qIndex = session.order[session.current];
  const q = QUESTIONS[qIndex];
  const len = session.order.length;

  session.answered = false;
  session.selected = null;

  el.counter.textContent = (session.current + 1) + "/" + len;
  setProgress(session.current / len);
  el.question.textContent = q.question;

  el.options.innerHTML = q.options
    .map(
      (opt, i) =>
        '<button class="option" type="button" data-index="' + i + '">' +
        '<span class="option-key">' + LETTERS[i] + "</span>" +
        '<span class="option-text">' + opt + "</span>" +
        "</button>"
    )
    .join("");

  el.feedback.hidden = true;
  el.feedback.classList.remove("is-wrong");
  el.btnNext.disabled = true;
  el.btnNext.textContent = nextButtonLabel();
}

function nextButtonLabel() {
  const isLast = session.current === session.order.length - 1;
  if (session.mode === "review") return isLast ? "Аяқтау" : "Келесі сұрақ";
  return isLast ? "Нәтижені көру" : "Келесі сұрақ";
}

function setProgress(ratio) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const len = session ? session.order.length : TOTAL;
  el.progressFill.style.width = clamped * 100 + "%";
  el.progress.setAttribute("aria-valuemin", "0");
  el.progress.setAttribute("aria-valuemax", String(len));
  el.progress.setAttribute("aria-valuenow", String(Math.round(clamped * len)));
}

/* ---------------- Жауап беру ---------------- */
function answer(selectedIndex) {
  if (session.answered) return; // қайта жауап беруге жол берілмейді
  session.answered = true;
  session.selected = selectedIndex;

  const q = QUESTIONS[session.order[session.current]];
  const isCorrect = selectedIndex === q.correct;

  const buttons = el.options.querySelectorAll(".option");
  buttons.forEach((btn) => {
    const idx = Number(btn.dataset.index);
    btn.disabled = true;
    if (idx === q.correct) btn.classList.add("correct");
    else if (idx === selectedIndex) btn.classList.add("wrong");
    else btn.classList.add("dim");
  });

  if (isCorrect) session.correctCount++;
  else session.wrongCount++;

  session.results.push({
    qIndex: session.order[session.current],
    selected: selectedIndex,
    correct: isCorrect,
  });

  renderFeedback(q, isCorrect, selectedIndex);
  setProgress((session.current + 1) / session.order.length);
  el.btnNext.disabled = false;
  el.btnNext.focus({ preventScroll: true });
}

function renderFeedback(q, isCorrect, selectedIndex) {
  el.feedback.hidden = false;
  el.feedback.classList.toggle("is-wrong", !isCorrect);
  el.feedbackIcon.textContent = isCorrect ? "✓" : "✕";

  if (isCorrect) {
    el.feedbackTitle.textContent = "Дұрыс! Жарайсың!";
    el.feedbackText.innerHTML =
      '<span class="answer-hl">' + q.options[q.correct] + "</span> — " + q.explanation;
  } else {
    el.feedbackTitle.textContent = "Қате жауап";
    el.feedbackText.innerHTML =
      "Дұрыс жауап: <span class=\"answer-hl\">" + q.options[q.correct] + "</span>.<br>" +
      q.explanation;
  }
}

/* ---------------- Келесі сұрақ ---------------- */
function next() {
  if (!session.answered) return;
  if (session.current < session.order.length - 1) {
    session.current++;
    renderQuestion();
  } else {
    finishSession();
  }
}

function finishSession() {
  if (session.mode === "review") {
    lastReviewWrong = buildWrongList(session);
    showReviewDone();
  } else {
    mainWrong = buildWrongList(session);
    showResults();
  }
}

/* session ішіндегі қате сұрақ индекстерін жинау */
function buildWrongList(sess) {
  return sess.results
    .filter(function (r) { return !r.correct; })
    .map(function (r) { return r.qIndex; });
}

/* ---------------- Нәтиже экраны ---------------- */
function showResults() {
  const score = session.correctCount;
  const correct = score;
  const wrong = TOTAL - score;

  el.resultsScore.textContent = String(score);
  el.statCorrect.textContent = String(correct);
  el.statWrong.textContent = String(wrong);
  el.resultsMessage.textContent = encouragingMessage(score);
  el.resultsTitle.textContent = score >= 8 ? "Керемет нәтиже!" : "Викторина аяқталды";

  // қате болмаса — қайталау батырмасын жасыру
  el.btnReview.style.display = wrong > 0 ? "" : "none";

  showScreen("results");
}

function encouragingMessage(score) {
  if (score === TOTAL) {
    return "Тамаша! 🏆 10 ұпай — сен нағыз математика чемпионысың!";
  }
  if (score >= 8) {
    return "Керемет! 10, 100 және 1000-ға көбейту мен бөлуді жақсы меңгердің. Осылай жалғастыр!";
  }
  if (score >= 6) {
    return "Жарайсың! Тағы аздап жаттықсаң, ең жоғары нәтижеге жетесің. Қателеріңді қайталап көр.";
  }
  if (score >= 4) {
    return "Жаман емес! Ережелерді есіңе түсіріп, қателерді қайталау режимінде бекітіп ал.";
  }
  return "Батыл бол! Қателерді бірге түзетейік — сен міндетті түрде үйренесің. Қайта байқап көр!";
}

/* ---------------- Қайталау (Review Mistakes) ---------------- */
function startReview() {
  if (mainWrong.length === 0) return;
  startSession(mainWrong.slice(), "review");
}

function showReviewDone() {
  el.reviewDoneCorrect.textContent = String(session.correctCount);
  el.reviewDoneWrong.textContent = String(session.wrongCount);

  const again = lastReviewWrong.length > 0;
  el.btnReviewAgain.style.display = again ? "" : "none";
  el.reviewDoneText.textContent = again
    ? "Тағы бірнеше сұрақта қате кетті. Оларды қайталап шығып, ережені бекітіп алайық!"
    : "Барлық қате сұрақты пысықтадың. Енді ережелерді жақсы түсінесің, жарайсың!";

  showScreen("reviewDone");
}

/* ---------------- Қайта бастау ---------------- */
function restart() {
  mainWrong = [];
  lastReviewWrong = [];
  session = null;
  showScreen("start");
}

/* ============================================================
   Оқиғаларды (events) тіркеу
   ============================================================ */

el.btnStart.addEventListener("click", function () {
  startSession(
    QUESTIONS.map(function (_, i) { return i; }),
    "quiz"
  );
});

el.options.addEventListener("click", function (e) {
  const btn = e.target.closest(".option");
  if (!btn || btn.disabled || !session || session.answered) return;
  answer(Number(btn.dataset.index));
});

el.btnNext.addEventListener("click", next);

el.btnReview.addEventListener("click", startReview);
el.btnRestart.addEventListener("click", restart);
el.btnRestart2.addEventListener("click", restart);
el.btnBackResults.addEventListener("click", function () {
  showScreen("results");
});
el.btnReviewAgain.addEventListener("click", function () {
  if (lastReviewWrong.length > 0) {
    startSession(lastReviewWrong.slice(), "review");
  }
});

/* Пернетақта қолдауы: 1-4 — нұсқа таңдау, Enter — келесі */
document.addEventListener("keydown", function (e) {
  if (!el.screens.quiz.classList.contains("active") || !session) return;
  const n = Number(e.key);
  if (n >= 1 && n <= 4 && !session.answered) {
    const btn = el.options.querySelector('.option[data-index="' + (n - 1) + '"]');
    if (btn) btn.click();
  } else if (e.key === "Enter" && !el.btnNext.disabled) {
    next();
  }
});
