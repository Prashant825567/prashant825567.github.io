<!DOCTYPE html>
<html>
<head>
  <title>One Chat (All-in-One)</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f1f1f1;
      padding: 20px;
    }
    h2 {
      color: green;
    }
    .form {
      background: white;
      padding: 15px;
      max-width: 400px;
      margin-bottom: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px #ccc;
    }
    .form input, .form button {
      width: 100%;
      padding: 10px;
      margin: 6px 0;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    #messages {
      background: #fff;
      padding: 10px;
      height: 300px;
      overflow-y: auto;
      border: 1px solid #ccc;
      margin-bottom: 10px;
      border-radius: 10px;
    }
  </style>
</head>
<body>

  <h2>🟢 One Chat Login</h2>

  <div class="form" id="loginForm">
    <input type="email" id="email" placeholder="Enter email" />
    <input type="password" id="password" placeholder="Enter password" />
    <button id="registerBtn">Register</button>
    <button id="loginBtn">Login</button>
  </div>

  <div id="chatSection" style="display:none;">
    <h2>💬 Chat Room</h2>
    <div id="messages"></div>
    <input type="text" id="msgInput" placeholder="Type a message..." />
    <button onclick="sendMessage()">Send</button>
  </div>

  <!-- Firebase JS SDKs -->
  <script type="module">
    import {{ initializeApp }} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import {{ getAnalytics }} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
    import {{
      getAuth,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      onAuthStateChanged
    }} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    import {{
      getDatabase,
      ref,
      push,
      set,
      onChildAdded
    }} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

    const firebaseConfig = {{
      apiKey: "AIzaSyAvR_eBm_fKrHQunRsaPvPV6uQ779Ms7lA",
      authDomain: "one-chat-9a387.firebaseapp.com",
      databaseURL: "https://one-chat-9a387-default-rtdb.firebaseio.com",
      projectId: "one-chat-9a387",
      storageBucket: "one-chat-9a387.appspot.com",
      messagingSenderId: "409201868084",
      appId: "1:409201868084:web:88058893d63411d176f961",
      measurementId: "G-R64VHZP3ML"
    }};

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const db = getDatabase(app);

    // Register
    document.getElementById("registerBtn").onclick = () => {{
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {{
          alert("Registration successful!");
        }})
        .catch((error) => {{
          alert("Error: " + error.message);
        }});
    }};

    // Login
    document.getElementById("loginBtn").onclick = () => {{
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {{
          document.getElementById("loginForm").style.display = "none";
          document.getElementById("chatSection").style.display = "block";
        }})
        .catch((error) => {{
          alert("Login Failed: " + error.message);
        }});
    }};

    // Auth State Check
    let currentUser = null;
    onAuthStateChanged(auth, (user) => {{
      if (user) {{
        currentUser = user;
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("chatSection").style.display = "block";
      }}
    }});

    // Send Message
    window.sendMessage = function () {{
      const msg = document.getElementById("msgInput").value;
      if (!msg || !currentUser) return;

      const msgRef = ref(db, "messages");
      const newMsg = push(msgRef);
      set(newMsg, {{
        name: currentUser.email,
        message: msg,
        time: new Date().toLocaleTimeString()
      }});

      document.getElementById("msgInput").value = "";
    }};

    // Receive Messages
    const messagesRef = ref(db, "messages");
    onChildAdded(messagesRef, (snapshot) => {{
      const data = snapshot.val();
      const box = document.getElementById("messages");
      const div = document.createElement("div");
      div.innerHTML = `<b>${{data.name}}</b>: ${{data.message}} <small>(${{data.time}})</small>`;
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
    }});
  </script>

</body>
</html>
