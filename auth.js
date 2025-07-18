// Firebase imports via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAvR_eBm_fKrHQunRsaPvPV6uQ779Ms7lA",
  authDomain: "one-chat-9a387.firebaseapp.com",
  databaseURL: "https://one-chat-9a387-default-rtdb.firebaseio.com",
  projectId: "one-chat-9a387",
  storageBucket: "one-chat-9a387.firebasestorage.app",
  messagingSenderId: "409201868084",
  appId: "1:409201868084:web:88058893d63411d176f961",
  measurementId: "G-R64VHZP3ML"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// 🔐 Auth Code
if (document.getElementById("registerBtn")) {
  document.getElementById("registerBtn").onclick = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Registration successful!");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };
}

if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").onclick = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Login successful!");
        window.location.href = "chat.html";
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };
}

// 💬 Chat Screen Logic
if (window.location.pathname.includes("chat.html")) {
  let currentUser = null;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      console.log("User logged in:", user.email);
    } else {
      window.location.href = "index.html";
    }
  });

  window.sendMessage = function () {
    const msg = document.getElementById("msgInput").value;
    if (!msg || !currentUser) return;

    const msgRef = ref(db, "messages");
    const newMsg = push(msgRef);
    set(newMsg, {
      name: currentUser.email,
      message: msg,
      time: new Date().toLocaleTimeString()
    });

    document.getElementById("msgInput").value = "";
  };

  const messagesRef = ref(db, "messages");
  onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    showMessage(data.name, data.message, data.time);
  });

  function showMessage(name, msg, time) {
    const box = document.getElementById("messages");
    const div = document.createElement("div");
    div.innerHTML = `<b>${name}</b>: ${msg} <small>(${time})</small>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
}
