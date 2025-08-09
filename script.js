firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("chatScreen").style.display = "block";
        document.getElementById("userEmail").innerText = user.email;
        loadMessages();
        loadUsers();
    }
});

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(error => document.getElementById("authMessage").innerText = error.message);
}

function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(error => document.getElementById("authMessage").innerText = error.message);
}

function logout() {
    firebase.auth().signOut();
}

function sendMessage() {
    const msg = document.getElementById("messageInput").value;
    const user = firebase.auth().currentUser;
    if (msg.trim() === "") return;
    firebase.database().ref("messages").push({
        sender: user.email,
        text: msg,
        timestamp: Date.now()
    });
    document.getElementById("messageInput").value = "";
}

function loadMessages() {
    firebase.database().ref("messages").on("child_added", snapshot => {
        const msg = snapshot.val();
        const div = document.createElement("div");
        div.className = "message";
        div.innerText = msg.sender + ": " + msg.text;
        document.getElementById("messages").appendChild(div);
    });
}

function uploadImage() {
    const file = document.getElementById("imageInput").files[0];
    if (!file) return;
    const storageRef = firebase.storage().ref("images/" + Date.now() + "_" + file.name);
    storageRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
            const user = firebase.auth().currentUser;
            firebase.database().ref("messages").push({
                sender: user.email,
                text: "Image: " + url,
                timestamp: Date.now()
            });
        });
    });
}

function loadUsers() {
    const user = firebase.auth().currentUser;
    firebase.database().ref("users").on("value", snap => {
        const users = snap.val();
        const listDiv = document.getElementById("usersList");
        listDiv.innerHTML = "";
        for (const uid in users) {
            if (users[uid].email !== user.email) {
                const p = document.createElement("p");
                p.innerText = users[uid].email;
                listDiv.appendChild(p);
            }
        }
    });
}

// Save user to users list
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        firebase.database().ref("users/" + user.uid).set({
            email: user.email,
            online: true
        });
        window.addEventListener("beforeunload", () => {
            firebase.database().ref("users/" + user.uid).update({ online: false });
        });
    }
});
