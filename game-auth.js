import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSgG2ZWSklzTcZZZjd1cs0q3wYKrMPkZs",
  authDomain: "mars-future-ai.firebaseapp.com",
  projectId: "mars-future-ai",
  storageBucket: "mars-future-ai.firebasestorage.app",
  messagingSenderId: "836937842227",
  appId: "1:836937842227:web:6c0bfbb45a3a6dbf206d46",
  measurementId: "G-EYVBGG7XQ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  // 전역으로 UID 노출 (game.js에서 사용)
  window.playerUID = user.uid;

  // 🔥 Firestore 연결 테스트 (처음 한 번만)
  await setDoc(doc(db, "users", user.uid), {
    createdAt: Date.now(),
    bestScore: 0,
    totalPlayTime: 0,
    bestRound: 0
  }, { merge: true });

  console.log("🔥 Firestore user doc ready:", user.uid);
});
