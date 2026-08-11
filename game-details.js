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

let gameKey = (params.get("game") || "").toLowerCase().trim();

if (!gameKey) {
    const path = window.location.pathname
        .replace(/^\/+|\/+$/g, "")
        .toLowerCase();

    if (path && path !== "game-details.html") {
        gameKey = path;
    }
}

// =====================================
// NORMALIZE NAME
// =====================================

function makeSlug(name) {
    return String(name || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
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

      const firebaseName = makeSlug(data.name);
const firebaseSlug = String(data.shareSlug || makeSlug(data.name))
    .toLowerCase()
    .trim();

if (
    if (
    firebaseName === makeSlug(gameKey) ||
    firebaseSlug === gameKey
) {

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
// ================================
// DYNAMIC ABOUT GAME
// ================================

const aboutName = document.getElementById("aboutGameName");
const aboutName2 = document.getElementById("aboutGameName2");
const aboutName3 = document.getElementById("aboutGameName3");
const aboutName4 = document.getElementById("aboutGameName4");
const aboutBox = document.getElementById("gameAbout");

if (aboutName) aboutName.textContent = name;
if (aboutName2) aboutName2.textContent = name;
if (aboutName3) aboutName3.textContent = name;
if (aboutName4) aboutName4.textContent = name;

if (aboutBox) {
    aboutBox.innerHTML = `
        <p>
            Discover <strong>${name}</strong> and enjoy a smooth,
            fast and mobile-friendly gaming experience designed
            for easy access and entertainment.
        </p>

        <p>
            <strong>${name}</strong> offers a simple and convenient
            platform with attractive offers, smooth navigation
            and an optimized experience for mobile users.
        </p>

        <h3>Why Choose ${name}?</h3>

        <ul>
            <li>🎁 Attractive promotional offers</li>
            <li>⚡ Fast and smooth gaming experience</li>
            <li>💰 Convenient withdrawal options</li>
            <li>📱 Mobile-friendly interface</li>
        </ul>
    `;
}

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
