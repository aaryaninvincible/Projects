import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  limit,
  query,
  orderBy,
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

const hasFirebaseConfig = true;

let db = null;
if (hasFirebaseConfig) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

const singleRose = document.getElementById("singleRose");
const roseBtn = document.getElementById("roseBtn");
const statusText = document.getElementById("statusText");
const messageBlock = document.getElementById("messageBlock");
const responseBlock = document.getElementById("responseBlock");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const bgHearts = document.getElementById("bgHearts");

const sessionId = crypto.randomUUID();
const pageType = location.pathname.toLowerCase().includes("admin")
  ? "admin"
  : "visitor";

function setStatus(text) {
  if (statusText) {
    statusText.textContent = text;
  }
}

function createFloatingHeart() {
  const span = document.createElement("span");
  span.textContent = Math.random() > 0.5 ? "❤" : "💗";
  span.style.position = "absolute";
  span.style.left = `${Math.random() * 100}vw`;
  span.style.top = `${Math.random() * 100}vh`;
  span.style.opacity = `${0.08 + Math.random() * 0.2}`;
  span.style.fontSize = `${10 + Math.random() * 18}px`;
  bgHearts.appendChild(span);
}

for (let i = 0; i < 28; i += 1) {
  if (bgHearts) {
    createFloatingHeart();
  }
}

async function logEvent(step, payload = {}) {
  if (!db) {
    return;
  }
  try {
    await addDoc(collection(db, "rose_day_events"), {
      step,
      pageType,
      sessionId,
      userAgent: navigator.userAgent,
      createdAt: serverTimestamp(),
      ...payload,
    });
  } catch (error) {
    if (statusText) {
      statusText.textContent = "UI is working. Firebase write blocked by rules.";
    }
    console.error("Firestore write failed:", error);
  }
}

function roseRain(count = 34) {
  for (let i = 0; i < count; i += 1) {
    const rose = document.createElement("div");
    rose.className = "rain-rose";
    rose.textContent = Math.random() > 0.4 ? "🌹" : "🌺";
    rose.style.left = `${Math.random() * 100}vw`;
    rose.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
    rose.style.opacity = `${0.65 + Math.random() * 0.35}`;
    rose.style.fontSize = `${18 + Math.random() * 20}px`;
    document.body.appendChild(rose);
    setTimeout(() => rose.remove(), 4300);
  }
}

function reactionBurst(emojiSet) {
  for (let i = 0; i < 20; i += 1) {
    const item = document.createElement("span");
    item.className = "burst";
    item.textContent = emojiSet[Math.floor(Math.random() * emojiSet.length)];
    item.style.left = `${50 + (Math.random() * 18 - 9)}%`;
    item.style.top = `${58 + (Math.random() * 12 - 6)}%`;
    item.style.fontSize = `${18 + Math.random() * 18}px`;
    item.style.setProperty("--x", `${Math.random() * 340 - 170}px`);
    item.style.setProperty("--y", `${Math.random() * -320}px`);
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 1600);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function transformToBouquet() {
  setStatus("Rose rain incoming...");
  roseRain();
  logEvent("rose_button_clicked");

  singleRose.classList.add("stage-1");
  logEvent("bouquet_stage_1");
  await sleep(820);

  setStatus("The rose is becoming a bouquet...");
  singleRose.classList.remove("stage-1");
  singleRose.classList.add("stage-2");
  logEvent("bouquet_stage_2");
  await sleep(820);

  singleRose.classList.remove("stage-2");
  singleRose.classList.add("stage-3", "to-bouquet");
  logEvent("bouquet_stage_3_complete");
  await sleep(600);

  messageBlock.classList.remove("hidden");
  setStatus("Your bouquet is ready.");
}

function finishResponse(answer) {
  messageBlock.classList.add("hidden");
  responseBlock.classList.remove("hidden");
  responseBlock.textContent = "Your response has been sent to Aryan.";

  if (answer === "yes") {
    responseBlock.textContent += " Chocolate day confirmed.";
    reactionBurst(["🍫", "💝", "🌹"]);
  } else {
    responseBlock.textContent += " Maybe next time for chocolate.";
    reactionBurst(["💌", "🌸", "✨"]);
  }
}

async function handleAnswer(answer) {
  yesBtn.disabled = true;
  noBtn.disabled = true;
  setStatus("Sending your response...");
  logEvent("chocolate_response_submitted", { answer });
  await sleep(500);
  finishResponse(answer);
  setStatus("Response sent.");
}

if (hasFirebaseConfig) {
  logEvent("page_opened").catch(() => {});
} else {
  setStatus("Add Firebase config in app.js to start storing responses.");
}

if (roseBtn && singleRose && messageBlock) {
  roseBtn.addEventListener("click", async () => {
    roseBtn.disabled = true;
    await transformToBouquet();
  });
}

if (yesBtn && noBtn) {
  yesBtn.addEventListener("click", async () => {
    await handleAnswer("yes");
  });

  noBtn.addEventListener("click", async () => {
    await handleAnswer("no");
  });
}

// Optional mini-monitor if this file is loaded in admin page.
const logList = document.getElementById("logList");
if (logList && db) {
  const q = query(
    collection(db, "rose_day_events"),
    orderBy("createdAt", "desc"),
    limit(40)
  );
  onSnapshot(
    q,
    (snapshot) => {
      const rows = snapshot.docs.map((doc) => doc.data());
      logList.innerHTML = rows
        .map((row) => {
          const at = row.createdAt?.toDate
            ? row.createdAt.toDate().toLocaleString()
            : "pending_time";
          const ans = row.answer ? ` | answer: ${row.answer}` : "";
          return `<li><strong>${row.step}</strong> | ${at}${ans}</li>`;
        })
        .join("");
    },
    (error) => {
      logList.innerHTML = `<li>Firestore read blocked: ${error.code || "permission error"}</li>`;
      console.error("Firestore read failed:", error);
    }
  );
}
