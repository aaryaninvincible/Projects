import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0NePQUJR5pglCxLiXDsavPFxSioExfvw",
  authDomain: "aimldatastore.firebaseapp.com",
  projectId: "aimldatastore",
  storageBucket: "aimldatastore.firebasestorage.app",
  messagingSenderId: "411113479860",
  appId: "1:411113479860:web:5e516a2d65181c27f941e1",
  measurementId: "G-C77KYWK0FZ",
};

const CAMPAIGN_ID = "akanksha_valentine";
const IST_OFFSET = "+05:30";

const now = new Date();
const currentYear = now.getFullYear();
const feb14ThisYear = new Date(`${currentYear}-02-14T23:59:59${IST_OFFSET}`);
const eventYear = now > feb14ThisYear ? currentYear + 1 : currentYear;

const DAYS = [
  {
    id: "rose_day",
    date: `${eventYear}-02-07`,
    label: "Rose Day",
    gift: "rose",
    rainEmoji: ["🌹", "🌺"],
    prompt:
      "If you want this rose, imagine me saying: Akanksha tu boht sundar hai. Do you want this rose?",
  },
  {
    id: "propose_day",
    date: `${eventYear}-02-08`,
    label: "Propose Day",
    gift: "proposal",
    rainEmoji: ["💍", "💌", "❤️"],
    prompt: "Will you accept my cute proposal for this Valentine week?",
  },
  {
    id: "chocolate_day",
    date: `${eventYear}-02-09`,
    label: "Chocolate Day",
    gift: "chocolate",
    rainEmoji: ["🍫", "🍬", "🍭"],
    prompt: "Do you want chocolates on Chocolate Day?",
  },
  {
    id: "teddy_day",
    date: `${eventYear}-02-10`,
    label: "Teddy Day",
    gift: "teddy",
    rainEmoji: ["🧸", "💝", "✨"],
    prompt: "Do you want a soft teddy from me?",
  },
  {
    id: "promise_day",
    date: `${eventYear}-02-11`,
    label: "Promise Day",
    gift: "promise",
    rainEmoji: ["🤝", "💖", "🌟"],
    prompt: "Can I make a sweet promise to always care for you?",
  },
  {
    id: "hug_day",
    date: `${eventYear}-02-12`,
    label: "Hug Day",
    gift: "hug",
    rainEmoji: ["🤗", "💞", "✨"],
    prompt: "Can I send you a warm virtual hug today?",
  },
  {
    id: "kiss_day",
    date: `${eventYear}-02-13`,
    label: "Kiss Day",
    gift: "kiss",
    rainEmoji: ["😘", "💋", "💕"],
    prompt: "Sending a shy virtual kiss. Do you accept?",
  },
  {
    id: "valentine_day",
    date: `${eventYear}-02-14`,
    label: "Valentine's Day",
    gift: "valentine surprise",
    rainEmoji: ["💘", "🌹", "🎉"],
    prompt: "Final day: Will you be my Valentine?",
  },
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pageType = location.pathname.toLowerCase().includes("admin")
  ? "admin"
  : "visitor";
const sessionId = crypto.randomUUID();
const appRoot = document.getElementById("appRoot");
const statusText = document.getElementById("statusText");
const bgHearts = document.getElementById("bgHearts");

const state = {
  responses: {},
  manualUnlockIndex: -1,
  eventLogs: [],
  timerId: null,
};

function setStatus(text) {
  if (statusText) {
    statusText.textContent = text;
  }
}

function dayStart(day) {
  return new Date(`${day.date}T00:00:00${IST_OFFSET}`);
}

function formatDate(day) {
  return new Date(`${day.date}T00:00:00${IST_OFFSET}`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function getDateUnlockIndex(nowDate = new Date()) {
  let index = -1;
  DAYS.forEach((day, i) => {
    if (nowDate >= dayStart(day)) {
      index = i;
    }
  });
  return index;
}

function getUnlockedIndex() {
  return Math.max(getDateUnlockIndex(), Number(state.manualUnlockIndex || -1));
}

function getNextPendingIndex(unlocked) {
  for (let i = 0; i <= unlocked; i += 1) {
    if (!state.responses[DAYS[i].id]) {
      return i;
    }
  }
  return -1;
}

function clearTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startCountdown(targetDate, element) {
  clearTimer();
  function tick() {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) {
      element.textContent = "Unlocked now. Refreshing...";
      clearTimer();
      renderVisitor();
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    element.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
  }
  tick();
  state.timerId = setInterval(tick, 1000);
}

function createHearts() {
  if (!bgHearts) return;
  for (let i = 0; i < 30; i += 1) {
    const span = document.createElement("span");
    span.textContent = Math.random() > 0.5 ? "❤" : "💗";
    span.style.position = "absolute";
    span.style.left = `${Math.random() * 100}vw`;
    span.style.top = `${Math.random() * 100}vh`;
    span.style.opacity = `${0.08 + Math.random() * 0.2}`;
    span.style.fontSize = `${10 + Math.random() * 18}px`;
    bgHearts.appendChild(span);
  }
}

function rain(emojiSet, count = 32) {
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("div");
    piece.className = "rain-piece";
    piece.textContent = emojiSet[Math.floor(Math.random() * emojiSet.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.fontSize = `${18 + Math.random() * 22}px`;
    piece.style.animationDuration = `${2.3 + Math.random() * 1.7}s`;
    piece.style.opacity = `${0.65 + Math.random() * 0.3}`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4300);
  }
}

async function logEvent(step, payload = {}) {
  try {
    await addDoc(collection(db, "valentine_events"), {
      step,
      pageType,
      sessionId,
      campaignId: CAMPAIGN_ID,
      createdAt: serverTimestamp(),
      ...payload,
    });
  } catch (error) {
    console.error("logEvent failed", error);
  }
}

async function ensureDocs() {
  const sessionRef = doc(db, "valentine_campaigns", CAMPAIGN_ID);
  const adminRef = doc(db, "valentine_admin", CAMPAIGN_ID);

  const sessionSnap = await getDoc(sessionRef);
  if (!sessionSnap.exists()) {
    await setDoc(sessionRef, {
      campaignId: CAMPAIGN_ID,
      responses: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  const adminSnap = await getDoc(adminRef);
  if (!adminSnap.exists()) {
    await setDoc(adminRef, {
      campaignId: CAMPAIGN_ID,
      manualUnlockIndex: -1,
      updatedAt: serverTimestamp(),
    });
  }
}

function responseLine(day, answer) {
  if (answer === "yes") {
    const cap = day.gift[0].toUpperCase() + day.gift.slice(1);
    return `Your response has been sent to Aryan. ${cap} is on the way.`;
  }
  return `Your response has been sent to Aryan. You selected no for ${day.label}.`;
}

async function submitDayResponse(dayIndex, answer) {
  const day = DAYS[dayIndex];
  const sessionRef = doc(db, "valentine_campaigns", CAMPAIGN_ID);
  try {
    await updateDoc(sessionRef, {
      [`responses.${day.id}`]: {
        answer,
        dayId: day.id,
        dayLabel: day.label,
        bySession: sessionId,
        submittedAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });
    await logEvent("visitor_response_submitted", {
      dayId: day.id,
      dayIndex,
      answer,
    });
    if (answer === "yes") {
      rain(day.rainEmoji);
    }
  } catch (error) {
    setStatus("Could not save response. Check Firestore rules.");
    console.error(error);
  }
}

function renderLockedState(nextIndex) {
  const day = DAYS[nextIndex] || DAYS[0];
  appRoot.innerHTML = `
    <div class="panel lock-box">
      This page is locked before ${formatDate(day)} (IST).<br/>
      Wait for unlock date or admin unlock.
      <div id="countdown"></div>
    </div>
  `;
  startCountdown(dayStart(day), document.getElementById("countdown"));
}

function renderWaitState(unlockedIndex) {
  const nextDay = DAYS[unlockedIndex + 1];
  if (!nextDay) {
    appRoot.innerHTML = `
      <div class="panel response-box">
        Journey complete till Valentine's Day.<br/>
        All responses have been sent to Aryan.
      </div>
    `;
    return;
  }
  appRoot.innerHTML = `
    <div class="panel countdown-box">
      Your latest response is sent.<br/>
      Wait for <strong>${nextDay.label}</strong> (${formatDate(nextDay)} IST).
      <div id="countdown"></div>
    </div>
  `;
  startCountdown(dayStart(nextDay), document.getElementById("countdown"));
}

function renderVisitorDay(dayIndex, unlockedIndex) {
  const day = DAYS[dayIndex];
  const prev = DAYS[dayIndex - 1];
  const prevResponse = prev ? state.responses[prev.id] : null;
  const prevBanner =
    prev && prevResponse && prevResponse.answer === "yes"
      ? `<div class="panel response-box">${prev.label} accepted. ${prev.gift} is on the way, wait please.</div>`
      : "";

  appRoot.innerHTML = `
    ${prevBanner}
    <div class="panel">
      <div class="hero-emoji">${day.rainEmoji[0]}</div>
      <h2 class="day-title">${day.label}</h2>
      <p class="day-date">${formatDate(day)} (IST)</p>
      <p class="prompt">${day.prompt}</p>
      <div class="choice-row">
        <button class="btn btn-yes" id="yesBtn">Yes</button>
        <button class="btn btn-no" id="noBtn">No</button>
      </div>
      <div class="response-box" id="responseNote">Choose your response.</div>
    </div>
    <ul class="timeline">
      ${DAYS.map((d, i) => {
        const answered = state.responses[d.id];
        const unlocked = i <= unlockedIndex;
        const badgeClass = answered ? "done" : unlocked ? "open" : "locked";
        const badgeLabel = answered
          ? `Done (${answered.answer})`
          : unlocked
            ? "Open"
            : "Locked";
        return `<li><strong>${d.label}</strong> - ${formatDate(d)} <span class="badge ${badgeClass}">${badgeLabel}</span></li>`;
      }).join("")}
    </ul>
  `;

  if (prev && prevResponse && prevResponse.answer === "yes") {
    rain(prev.rainEmoji, 24);
  }

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const responseNote = document.getElementById("responseNote");

  yesBtn.addEventListener("click", async () => {
    yesBtn.disabled = true;
    noBtn.disabled = true;
    responseNote.textContent = "Sending your response...";
    await submitDayResponse(dayIndex, "yes");
    responseNote.textContent = responseLine(day, "yes");
    setStatus("Response sent.");
    setTimeout(renderVisitor, 900);
  });

  noBtn.addEventListener("click", async () => {
    yesBtn.disabled = true;
    noBtn.disabled = true;
    responseNote.textContent = "Sending your response...";
    await submitDayResponse(dayIndex, "no");
    responseNote.textContent = responseLine(day, "no");
    setStatus("Response sent.");
    setTimeout(renderVisitor, 900);
  });
}

function renderVisitor() {
  clearTimer();
  const unlockedIndex = getUnlockedIndex();
  const nextPending = getNextPendingIndex(unlockedIndex);

  if (unlockedIndex < 0) {
    setStatus(`Locked. First unlock: ${formatDate(DAYS[0])} (IST).`);
    renderLockedState(0);
    return;
  }

  if (nextPending === -1) {
    setStatus("No pending step right now.");
    renderWaitState(unlockedIndex);
    return;
  }

  setStatus(`Now active: ${DAYS[nextPending].label}`);
  renderVisitorDay(nextPending, unlockedIndex);
}

async function setManualUnlock(index) {
  const adminRef = doc(db, "valentine_admin", CAMPAIGN_ID);
  await updateDoc(adminRef, {
    manualUnlockIndex: index,
    updatedAt: serverTimestamp(),
  });
  await logEvent("admin_manual_unlock_changed", { manualUnlockIndex: index });
}

function renderAdmin() {
  clearTimer();
  const autoUnlock = getDateUnlockIndex();
  const effectiveUnlock = getUnlockedIndex();

  appRoot.innerHTML = `
    <div class="panel">
      <strong>Auto unlock by date (IST):</strong> ${autoUnlock}<br/>
      <strong>Manual unlock index:</strong> ${state.manualUnlockIndex}<br/>
      <strong>Effective unlock index:</strong> ${effectiveUnlock}
    </div>
    <div class="panel">
      <div class="select-row">
        <select id="unlockSelect">
          ${DAYS.map(
            (d, i) => `<option value="${i}">${i} - ${d.label} (${d.date})</option>`
          ).join("")}
        </select>
        <button class="btn btn-primary" id="unlockBtn">Unlock Till Selected Day</button>
        <button class="btn btn-no" id="resetBtn">Reset Manual Unlock</button>
      </div>
    </div>
    <ul class="timeline">
      ${DAYS.map((d, i) => {
        const resp = state.responses[d.id];
        const unlocked = i <= effectiveUnlock;
        const badgeClass = resp ? "done" : unlocked ? "open" : "locked";
        const badgeLabel = resp
          ? `Answered: ${resp.answer}`
          : unlocked
            ? "Open"
            : "Locked";
        return `<li><strong>${i}. ${d.label}</strong> - ${formatDate(d)} <span class="badge ${badgeClass}">${badgeLabel}</span></li>`;
      }).join("")}
    </ul>
    <div class="panel">
      <strong>Recent Event Logs</strong>
      <ul class="log-list">
        ${state.eventLogs
          .map((log) => {
            const at = log.createdAt?.toDate
              ? log.createdAt.toDate().toLocaleString()
              : "pending_time";
            const ans = log.answer ? ` | answer: ${log.answer}` : "";
            return `<li><strong>${log.step}</strong> | ${at}${ans}</li>`;
          })
          .join("")}
      </ul>
    </div>
  `;

  const unlockSelect = document.getElementById("unlockSelect");
  const unlockBtn = document.getElementById("unlockBtn");
  const resetBtn = document.getElementById("resetBtn");
  unlockSelect.value = String(Math.max(state.manualUnlockIndex, 0));

  unlockBtn.addEventListener("click", async () => {
    const index = Number(unlockSelect.value);
    await setManualUnlock(index);
    setStatus(`Manual unlock updated to ${index}.`);
  });

  resetBtn.addEventListener("click", async () => {
    await setManualUnlock(-1);
    setStatus("Manual unlock reset.");
  });
}

async function bootstrap() {
  createHearts();
  setStatus("Connecting to Firestore...");

  try {
    await ensureDocs();
  } catch (error) {
    setStatus("Could not initialize Firestore docs. Check rules.");
    console.error(error);
    return;
  }

  const sessionRef = doc(db, "valentine_campaigns", CAMPAIGN_ID);
  const adminRef = doc(db, "valentine_admin", CAMPAIGN_ID);
  const eventsQuery = query(
    collection(db, "valentine_events"),
    orderBy("createdAt", "desc"),
    limit(40)
  );

  onSnapshot(
    sessionRef,
    (snap) => {
      state.responses = (snap.data() || {}).responses || {};
      if (pageType === "visitor") {
        renderVisitor();
      } else {
        renderAdmin();
      }
    },
    (error) => {
      setStatus(`Session read blocked: ${error.code || "permission error"}`);
    }
  );

  onSnapshot(
    adminRef,
    (snap) => {
      state.manualUnlockIndex = (snap.data() || {}).manualUnlockIndex ?? -1;
      if (pageType === "visitor") {
        renderVisitor();
      } else {
        renderAdmin();
      }
    },
    (error) => {
      setStatus(`Admin config blocked: ${error.code || "permission error"}`);
    }
  );

  onSnapshot(
    eventsQuery,
    (snap) => {
      state.eventLogs = snap.docs.map((d) => d.data());
      if (pageType === "admin") {
        renderAdmin();
      }
    },
    () => {}
  );

  logEvent("page_opened", { pageType }).catch(() => {});
}

bootstrap();
