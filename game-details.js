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
  apiKey: "AIzaSyAM153E0np-14pFQgLFyDPcTm5TISkglT",
  authDomain: "yonoappskiduniya.firebaseapp.com",
  projectId: "yonoappskiduniya",
  storageBucket: "yonoappskiduniya.firebasestorage.app",
  messagingSenderId: "474330790853",
  appId: "1:474330790853:web:da1f01d00a7ffebdc4e9ac"
};


// =====================================
// INITIALIZE FIREBASE
// =====================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gamesRef = collection(db, "games");


// =====================================
// GET GAME KEY
// =====================================

const params = new URLSearchParams(window.location.search);

let gameKey = (params.get("game") || "").trim();


// Also support path if needed
if (!gameKey) {

  const path = window.location.pathname
    .replace(/\/+$/, "")
    .toLowerCase();

  if (path && path !== "/game-details.html") {
    gameKey = path.split("/").pop().trim();
  }
}


// =====================================
// NORMALIZE
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

  if (el) {
    el.textContent = value ?? "";
  }
}


function setImage(id, value) {

  const el = document.getElementById(id);

  if (!el) return;

  let image = value || "images/logo.png";

  if (
    image &&
    !image.startsWith("http://") &&
    !image.startsWith("https://") &&
    !image.startsWith("images/")
  ) {
    image = "images/" + image;
  }

  el.src = image;

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
// LOADING
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


function showError(message = "This game is currently unavailable.") {

  hideLoading();

  const content = document.getElementById("gameContent");
  const error = document.getElementById("error");

  if (content) {
    content.style.display = "none";
  }

  if (error) {

    error.style.display = "block";

    const text =
      error.querySelector(".error-message") ||
      error.querySelector("p");

    if (text) {
      text.textContent = message;
    }
  }
}


// =====================================
// LOAD GAME
// =====================================

async function loadGameDetails() {

  console.log("GAME KEY:", gameKey);

  try {

    // -------------------------------
    // NO KEY
    // -------------------------------

    if (!gameKey) {
  showError("Game link is missing.");
  return;
}

const snapshot = await getDocs(gamesRef);

let game = null;

function cleanKey(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\.html$/i, "")
    .replace(/[^a-z0-9]/g, "");
}

const requestedKey = cleanKey(
  decodeURIComponent(gameKey)
);

snapshot.forEach(docSnap => {

  const data = docSnap.data() || {};

  const possibleKeys = [
    docSnap.id,
    data.id,
    data.name,
    data.slug,
    data.gameSlug,
    data.gameId,
    data.gameID,
    data.key,
    data.title
  ];

  const matched = possibleKeys.some(value =>
    cleanKey(value) === requestedKey
  );

  if (matched) {
    game = {
      id: docSnap.id,
      ...data
    };
  }
});

// GAME NOT FOUND
if (!game) {
  console.error("Game not found:", gameKey);
  showError();
  return;
}

    // -------------------------------
    // GAME NOT FOUND
    // -------------------------------

    if (!game) {

      console.error("GAME NOT FOUND:", gameKey);

      showError("This game is currently unavailable.");

      return;
    }


    console.log("GAME FOUND:", game);


    // ==============slu===============
    // GAME DATA
    // =================================

    const name =
      game.name ||
      game.title ||
      "Game";


    const image =
      game.image ||
      game.logo ||
      "images/logo.png";


    const bonus =
      game.reward ||
      game.bonus ||
      game.welcomeBonus ||
      "Welcome Bonus";


    const withdraw =
      game.withdraw ||
      game.minWithdraw ||
      game.minwithdraw ||
      "₹100";


    const rating =
      game.rating ||
      "★★★★★";


    const category =
      game.category ||
      "Earning App";


    const description =
      game.description ||
      `${name} offers exciting gaming and earning opportunities for users.`;


    const downloadLink =
      game.link ||
      game.download ||
      game.downloadLink ||
      "#";


    // =================================
    // PAGE TITLE
    // =================================

    document.title =
      `${name} - Download | UONO APPS STORE`;


    // =================================
    // UPDATE TEXT
    // =================================

    setText("gameName", name);
    setText("finalGameName", name);

    setText("aboutGameName", name);
    setText("aboutGameName2", name);
    setText("aboutGameName3", name);
    setText("aboutGameName4", name);

    setText("gameBonus", bonus);
    setText("gameRating", rating);
    setText("gameCategory", category);
    setText("gameWithdraw", withdraw);

    setText("gameDescription", description);


    // =================================
    // ABOUT GAME
    // =================================

    const aboutBox =
      document.getElementById("gameAbout");

    if (aboutBox) {

      aboutBox.innerHTML = `
        <p>
          Discover <strong>${name}</strong> and enjoy
          a smooth, fast and mobile-friendly gaming
          experience designed for easy access and entertainment.
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


    // =================================
    // IMAGE
    // =================================

    setImage("gameImage", image);


    document
      .querySelectorAll(".game-logo")
      .forEach((img) => {

        img.src = image;

        img.onerror = function () {

          this.onerror = null;

          this.src = "images/logo.png";

        };

      });


    // =================================
    // DOWNLOAD BUTTONS
    // =================================

    setLink("downloadButton", downloadLink);
    setLink("finalDownloadButton", downloadLink);
    setLink("downloadBtn", downloadLink);
    setLink("downloadBtn2", downloadLink);


    document
      .querySelectorAll(
        ".download-btn, .download-now, .final-download"
      )
      .forEach((btn) => {

        btn.href = downloadLink;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";

      });


    // =================================
    // OPTIONAL GAME CLASSES
    // =================================

    document
      .querySelectorAll(".game-name")
      .forEach((el) => {
        el.textContent = name;
      });


    document
      .querySelectorAll(".game-bonus")
      .forEach((el) => {
        el.textContent = bonus;
      });


    document
      .querySelectorAll(".game-rating")
      .forEach((el) => {
        el.textContent = rating;
      });


    document
      .querySelectorAll(".game-category")
      .forEach((el) => {
        el.textContent = category;
      });


    document
      .querySelectorAll(".game-withdraw")
      .forEach((el) => {
        el.textContent = withdraw;
      });


    document
      .querySelectorAll(".game-description")
      .forEach((el) => {
        el.textContent = description;
      });


    // =================================
    // SUCCESS
    // =================================

    console.log("✅ GAME DETAILS LOADED:", game);

    showGameContent();


  } catch (error) {

    console.error("❌ GAME DETAILS ERROR:", error);

    showError(
      "Unable to load this game. Please try again."
    );

  }

}


// =====================================
// START
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  loadGameDetails
);
