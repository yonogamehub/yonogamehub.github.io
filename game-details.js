
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
  apiKey: "AIzaSyAMl53E0np-l4zF0gLFyDPtcTmStISkglI",
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
// GET GAME ID FROM URL
// =====================================

const params = new URLSearchParams(window.location.search);
const gameKey = (params.get("game") || "").toLowerCase().trim();


// =====================================
// NORMALIZE GAME NAME
// =====================================

function normalizeName(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}


// =====================================
// LOAD GAME
// =====================================

async function loadGameDetails() {

    try {

        if (!gameKey) {
            console.error("Game name missing from URL");
            return;
        }

        const snapshot = await getDocs(gamesRef);

        let game = null;

        snapshot.forEach(doc => {

            const data = doc.data();

            const firebaseName = normalizeName(data.name);

            if (firebaseName === gameKey) {
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

            document.body.innerHTML = `
                <div style="
                    min-height:100vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#f5f7fa;
                    font-family:Arial,sans-serif;
                    padding:20px;
                    text-align:center;
                ">

                    <div>
                        <h2>Game Not Found</h2>
                        <p>This game is currently unavailable.</p>

                        <a href="index.html"
                           style="
                           display:inline-block;
                           padding:14px 25px;
                           background:#ffc107;
                           color:#111;
                           text-decoration:none;
                           border-radius:30px;
                           font-weight:bold;
                           ">
                           ← Back to Home
                        </a>
                    </div>

                </div>
            `;

            return;
        }


        // =====================================
        // DATA
        // =====================================

        const name = game.name || "Game";

        const image =
            game.image ||
            game.logo ||
            "images/logo.png";

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

        document.title = `${name} - Download | UONO APPS STORE`;


        // =====================================
        // UPDATE ELEMENTS
        // =====================================

        const setText = (selector, value) => {

            const el = document.querySelector(selector);

            if (el) {
                el.textContent = value;
            }

        };


        const setImage = (selector, value) => {

            const el = document.querySelector(selector);

            if (el) {

                el.src = value;

                el.onerror = () => {
                    el.src = "images/logo.png";
                };

            }

        };


        const setLink = (selector, value) => {

            const el = document.querySelector(selector);

            if (el) {
                el.href = value;
            }

        };


        // =====================================
        // COMMON SELECTORS
        // =====================================

        setText("#gameName", name);
        setText("#gameBonus", bonus);
        setText("#gameRating", rating);
        setText("#gameCategory", category);
        setText("#gameWithdraw", withdraw);
        setText("#gameDescription", description);

        setImage("#gameImage", image);

        setLink("#downloadBtn", downloadLink);
        setLink("#downloadBtn2", downloadLink);


        // =====================================
        // OPTIONAL ELEMENTS
        // =====================================

        setText(".game-name", name);
        setText(".game-bonus", bonus);
        setText(".game-rating", rating);
        setText(".game-category", category);
        setText(".game-withdraw", withdraw);
        setText(".game-description", description);

        const images = document.querySelectorAll(".game-logo");

        images.forEach(img => {

            img.src = image;

            img.onerror = () => {
                img.src = "images/logo.png";
            };

        });


        const downloadButtons =
            document.querySelectorAll(".download-btn, .download-now");

        downloadButtons.forEach(btn => {

            btn.href = downloadLink;

            btn.target = "_blank";
            btn.rel = "noopener noreferrer";

        });


        console.log("✅ Game Details Loaded:", game);

    }

    catch (error) {

        console.error("❌ Game Details Error:", error);

    }

}


// =====================================
// START
// =====================================

loadGameDetails();
