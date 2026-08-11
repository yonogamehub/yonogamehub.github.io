// =====================================
// GAME DETAILS - FIREBASE
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";


// =====================================
// FIREBASE CONFIG
// =====================================

const firebaseConfig = {
  apiKey: "AIzaSyAMl53E0np-l4zF0gLFyDPtcTm5TISkglT",
  authDomain: "yonoappskiduniya.firebaseapp.com",
  projectId: "yonoappskiduniya",
  storageBucket: "yonoappskiduniya.firebasestorage.app",
  messagingSenderId: "474330790853",
  appId: "1:474330790853:web:da1f01d00a7ffedbc4e9ac"
};


// =====================================
// INITIALIZE FIREBASE
// =====================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gamesRef = collection(db, "games");


// =====================================
// URL GAME NAME
// =====================================

const params = new URLSearchParams(window.location.search);
const gameKey = (params.get("game") || "").toLowerCase().trim();


// =====================================
// NORMALIZE NAME
// =====================================

function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}


// =====================================
// HELPERS
// =====================================

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}


function setImage(id, value) {
  const el = document.getElementById(id);

  if (!el) return;

  el.src = value || "images/logo.png";

  el.onerror = function () {
    this.onerror = null;
    this.src = "images/logo.png";
  };
}


function setLink(id, value) {
  const el = document.getElementById(id);

  if (!el) return;

  el.href = value || "#";
  el.target = "_blank";
  el.rel = "noopener noreferrer";
}


// =====================================
// SHOW / HIDE
// =====================================

function hideLoading() {
  const loading = document.getElementById("loading");

  if (loading) {
    loading.style.display = "none";
  }
}


function showGameContent() {
  hideLoading();

  const content = document.getElementById("gameContent");

  if (content) {
    content.style.display = "block";
  }
}


function showError() {
  hideLoading();

  const content = document.getElementById("gameContent");
  const error = document.getElementById("error");

  if (content) content.style.display = "none";

  if (error) error.style.display = "block";
}


// =====================================
// LOAD GAME
// =====================================

async function loadGameDetails() {

  try {

    // No game in URL
    if (!gameKey) {
      console.error("Game name missing from URL");
      showError();
      return;
    }


    // Get all Firebase games
    const snapshot = await getDocs(gamesRef);

    let game = null;


    snapshot.forEach(doc => {

      const data = doc.data();

      const firebaseName = normalizeName(data.name);

      if (firebaseName === normalizeName(gameKey)) {

        game = {
          id: doc.id,
          ...data
        };

      }

    });


    // =====================================
    // GAME NOT FOUND
    // =====================================

    if (!game) {

      console.error("Game not found:", gameKey);

      showError();

      return;
    }


    // =====================================
    // GAME DATA
    // =====================================

    const name = game.name || "Game";

    let image =
      game.image ||
      game.logo ||
      "images/logo.png";

    if (
      image &&
      !image.startsWith("http") &&
      !image.startsWith("images/")
    ) {
      image = "images/" + image;
    }


    const bonus =
      game.reward ||
      game.bonus ||
      "Welcome Bonus";


    const withdraw =
      game.withdraw ||
      game.minWithdraw ||
      "₹100";


    const rating =
      game.rating ||
      "4.0";


    const downloadLink =
      game.link ||
      game.download ||
      "#";


    const category =
      game.category ||
      "Earning App";


    const description =
      game.description ||
      `${name} offers exciting gaming and earning opportunities for users.`;



    // =====================================
    // PAGE TITLE
    // =====================================

    document.title =
      `${name} - Download | UONO APPS STORE`;



    // =====================================
    // UPDATE GAME DETAILS
    // =====================================

    setText("gameName", name);
    setText("finalGameName", name);

    setText("aboutGameName", name);

    setText("gameBonus", bonus);
    setText("gameRating", rating);
    setText("gameCategory", category);
    setText("gameWithdraw", withdraw);

    setText("gameDescription", description);
    setText("gameAbout", description);


    // =====================================
    // IMAGE
    // =====================================

    setImage("gameImage", image);


    // =====================================
    // DOWNLOAD BUTTONS
    // =====================================

    setLink("downloadButton", downloadLink);

    setLink("finalDownloadButton", downloadLink);

    setLink("downloadBtn", downloadLink);

    setLink("downloadBtn2", downloadLink);


    // =====================================
    // OTHER DOWNLOAD BUTTONS
    // =====================================

    document
      .querySelectorAll(".download-btn, .download-now, .final-download")
      .forEach(btn => {

        btn.href = downloadLink;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";

      });


    // =====================================
    // OPTIONAL CLASS ELEMENTS
    // =====================================

    document.querySelectorAll(".game-name")
      .forEach(el => el.textContent = name);

    document.querySelectorAll(".game-bonus")
      .forEach(el => el.textContent = bonus);

    document.querySelectorAll(".game-rating")
      .forEach(el => el.textContent = rating);

    document.querySelectorAll(".game-category")
      .forEach(el => el.textContent = category);

    document.querySelectorAll(".game-withdraw")
      .forEach(el => el.textContent = withdraw);

    document.querySelectorAll(".game-description")
      .forEach(el => el.textContent = description);


    // =====================================
    // OTHER GAME LOGOS
    // =====================================

    document.querySelectorAll(".game-logo")
      .forEach(img => {

        img.src = image;

        img.onerror = function () {
          this.onerror = null;
          this.src = "images/logo.png";
        };

      });


    // =====================================
    // FINISHED
    // =====================================

    console.log("✅ GAME DETAILS LOADED:", game);

    showGameContent();


  } catch (error) {

    console.error("❌ GAME DETAILS ERROR:", error);

    showError();

  }

}


// =====================================
// START
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  loadGameDetails();
});
