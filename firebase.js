// =====================================
// FIREBASE — SAME DATABASE AS MANAGE GAMES
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// This is the SAME Firebase project used by add-game.html and manage-games-updated.html.
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

console.log("✅ Manage Games Firebase connected:", firebaseConfig.projectId);

async function loadGames() {
    try {
        const snapshot = await getDocs(gamesRef);

        const games = [];
        snapshot.forEach(doc => {
            games.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`✅ Games loaded: ${games.length}`);

        if (typeof window.setFirebaseGames === "function") {
            window.setFirebaseGames(games);
        } else {
            console.error("❌ Game renderer not ready.");
        }
    } catch (error) {
        console.error("❌ Firestore Error:", error);

        const container = document.getElementById("firebaseGamesList");
        if (container) {
            container.innerHTML = `
                <div class="game-card firebase-game-card">
                    <div class="game-left">
                        <div class="game-info">
                            <h3>Games could not be loaded</h3>
                            <small>Please check Firebase rules / connection.</small>
                        </div>
                    </div>
                </div>`;
            }
        }
    }
}

window.addEventListener("load", () => {
    const waitForRenderer = () => {
        if (typeof window.setFirebaseGames === "function") {
            loadGames();
        } else {
            setTimeout(waitForRenderer, 50);
        }
    };

    waitForRenderer();
});
