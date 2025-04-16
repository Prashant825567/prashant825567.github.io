<!doctype html>
<html> 
 <head> 
  <title>PM Movies - All In One</title> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Firebase Scripts --> 
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script> 
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script> <!-- Firebase Config --> 
  <script>
    const firebaseConfig = {
      apiKey: "AIzaSyDTWFhhamMmBi4iJJkOTFPQtoOVctpwobY",
      authDomain: "go-pro-dc14e-84eef.firebaseapp.com",
      databaseURL: "https://go-pro-dc14e-84eef-default-rtdb.firebaseio.com",
      projectId: "go-pro-dc14e-84eef",
      storageBucket: "go-pro-dc14e-84eef.firebasestorage.app",
      messagingSenderId: "538880172451",
      appId: "1:538880172451:web:faa7ed3461e7cb19767a16",
      measurementId: "G-QTQDJH9WFM"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
  </script> 
  <style>
    body {
      font-family: Arial;
      background: #111;
      color: white;
      padding: 20px;
    }

    h1, h2 {
      text-align: center;
    }

    .search, .input-field, button {
      margin: 10px auto;
      display: block;
      padding: 10px;
      width: 90%;
      max-width: 400px;
      border-radius: 8px;
      border: none;
    }

    .movie {
      margin: 15px;
      display: inline-block;
      width: 150px;
      vertical-align: top;
      cursor: pointer;
      position: relative;
    }

    .movie img {
      width: 100%;
      border-radius: 8px;
    }

    .movie h4 {
      text-align: center;
      margin-top: 5px;
    }

    .delete-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      background: red;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 12px;
      display: none;
    }

    .admin .delete-btn {
      display: block;
    }

    #videoPopup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      display: none;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      z-index: 9999;
    }

    video {
      width: 90%;
      max-width: 600px;
    }

    #videoPopup button {
      margin-top: 10px;
    }
  </style> 
 </head> 
 <body> 
  <h1>PM Movies</h1> <!-- Search + Movie List --> 
  <input class="search" type="text" id="search" placeholder="Search movies..."> 
  <div id="movieList"></div> <!-- Video Player Popup --> 
  <div id="videoPopup"> 
   <h2 id="videoTitle"></h2> 
   <video id="video" controls autoplay></video> <button onclick="closeVideo()">Close</button> 
  </div> 
  <hr> <!-- Admin Panel --> 
  <h2>Admin Panel</h2> 
  <input class="input-field" type="password" id="adminPass" placeholder="Enter admin password"> 
  <div id="adminForm" style="display:none;"> 
   <input class="input-field" type="text" id="title" placeholder="Movie Title"> 
   <input class="input-field" type="text" id="thumbnail" placeholder="Thumbnail URL"> 
   <input class="input-field" type="text" id="videoUrl" placeholder="Video URL"> <button onclick="uploadMovie()">Upload Movie</button> 
   <p id="msg" style="text-align:center;"></p> 
  </div> 
  
<script>
  const movieList = document.getElementById("movieList");
  const search = document.getElementById("search");
  const adminPass = document.getElementById("adminPass");
  const adminForm = document.getElementById("adminForm");
  const videoPopup = document.getElementById("videoPopup");
  const video = document.getElementById("video");
  const videoTitle = document.getElementById("videoTitle");

  let isAdmin = false;

  // Password Check
  adminPass.addEventListener("input", () => {
    if (adminPass.value === "prashant") {
      adminForm.style.display = "block";
      isAdmin = true;
      fetchMovies();
    } else {
      adminForm.style.display = "none";
      isAdmin = false;
      fetchMovies();
    }
  });

  // Upload Movie
  function uploadMovie() {
    const title = document.getElementById("title").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const videoUrl = document.getElementById("videoUrl").value;

    if (!title || !thumbnail || !videoUrl) {
      alert("Please fill all fields!");
      return;
    }

    db.ref("movies").push({ title, thumbnail, video: videoUrl }).then(() => {
      document.getElementById("msg").innerText = "Movie uploaded!";
      document.getElementById("title").value = "";
      document.getElementById("thumbnail").value = "";
      document.getElementById("videoUrl").value = "";
      fetchMovies(); // refresh movie list
    });
  }

  // Delete Movie
  function deleteMovie(id) {
    if (confirm("Delete this movie?")) {
      db.ref("movies/" + id).remove().then(() => {
        fetchMovies(); // refresh after delete
      });
    }
  }

  // Display movies
  function displayMovies(movies) {
    movieList.innerHTML = "";
    for (const key in movies) {
      const m = movies[key];
      const div = document.createElement("div");
      div.className = "movie" + (isAdmin ? " admin" : "");
      div.innerHTML = `
        <img src="${m.thumbnail}" alt="${m.title}">
        <h4>${m.title}</h4>
        ${isAdmin ? `<button class="delete-btn" onclick="event.stopPropagation(); deleteMovie('${key}')">X</button>` : ""}
      `;
      div.addEventListener("click", (event) => {
        if (!event.target.classList.contains("delete-btn")) {
          playMovie(m.title, m.video);
        }
      });
      movieList.appendChild(div);
    }
  }

  // Fetch movies
  function fetchMovies() {
    db.ref("movies").once("value", snapshot => {
      const data = snapshot.val() || {};
      displayMovies(data);
    });
  }

  fetchMovies();

  // Search function
  search.addEventListener("input", () => {
    const query = search.value.toLowerCase();
    db.ref("movies").once("value", snapshot => {
      const filtered = {};
      snapshot.forEach(child => {
        const val = child.val();
        if (val.title.toLowerCase().includes(query)) {
          filtered[child.key] = val;
        }
      });
      displayMovies(filtered);
    });
  });

  // Video player
  function playMovie(title, url) {
    video.src = url;
    videoTitle.innerText = title;
    videoPopup.style.display = "flex";
  }

  function closeVideo() {
    video.pause();
    video.src = "";
    videoPopup.style.display = "none";
  }
</script>
 </body>
</html>
