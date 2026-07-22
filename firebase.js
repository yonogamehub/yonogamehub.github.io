// =====================================
// FIREBASE IMPORTS
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// =====================================
// YONOGAMESHUB FIREBASE
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

// Firestore Collection
const gamesRef = collection(db, "games");

console.log("✅ YONOGAMESHUB Firebase Connected");
// =====================================
// LOAD GAMES FROM FIRESTORE
// =====================================

async function loadGames() {

    try {

        const snapshot = await getDocs(gamesRef);

        const games = [];

        snapshot.forEach((doc) => {

            games.push({

                id: doc.id,
                ...doc.data()

            });

        });

        console.log("✅ Games Loaded:", games);

        if (typeof window.renderFirebaseGames === "function") {

            window.renderFirebaseGames(games);

        } else {

            console.error("renderFirebaseGames is not defined");

        }

    } catch (error) {

        console.error("❌ Firestore Error:", error);

    }

}

// =====================================
// AUTO LOAD
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    loadGames();

});
