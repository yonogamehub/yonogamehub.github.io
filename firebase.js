// =====================================
// YONO LOOT HUB — FIREBASE GAME LOADER
// SAME DATABASE AS ADD/MANAGE GAMES
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMl53E0np-l4zF0gLFyDPtcTmStISkglI",
    authDomain: "yonoappskiduniya.firebaseapp.com",
    projectId: "yonoappskiduniya",
    storageBucket: "yonoappskiduniya.firebasestorage.app",
    messagingSenderId: "474330790853",
    appId: "1:474330790853:web:da1f01d00a7ffedbc4e9ac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gamesRef = collection(db, "games");

console.log("✅ Firebase connected:", firebaseConfig.projectId);

async function loadGames() {
    try {
        // Same collection and order field used by Add Game / Manage Games.
        const snapshot = await getDocs(query(gamesRef, orderBy("order", "asc")));

        const games = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`✅ Games loaded: ${games.length}`);

        if (typeof window.renderFirebaseGames === "function") {
            window.renderFirebaseGames(games);
        }
    } catch (error) {
        console.error("❌ Firestore Error:", error);

        // No popup/alert. Keep the page clean.
        const container = document.getElementById("firebaseGamesList");
        if (container) {
            container.innerHTML = `
                <div class="game-card firebase-game-card">
                    <div class="game-left">
                        <div class="game-info">
                            <h3>Games could not be loaded</h3>
                            <small>Check Firebase connection/rules.</small>
                        </div>
                    </div>
                </div>`;
        }
    }
}

window.addEventListener("load", () => {
    const waitForRenderer = () => {
        if (typeof window.renderFirebaseGames === "function") {
            loadGames();
        } else {
            setTimeout(waitForRenderer, 50);
        }
    };
    waitForRenderer();
});
