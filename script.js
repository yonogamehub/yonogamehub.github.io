// =====================================
// DOM ELEMENTS
// =====================================

const firebaseContainer =
document.getElementById("firebaseGamesList");

const tabs = document.querySelectorAll(".tab-btn");
const chips = document.querySelectorAll(".chip");
let allFirebaseGames = [];

// =====================================
// SEARCH
// =====================================

function searchGames() {

    if (!searchInput) return;

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".game-card").forEach(card => {

            const title = card.querySelector("h3").textContent.toLowerCase();

            if (title.includes(value)) {

                card.style.display = "flex";

            } else {

                card.style.display = "none";

            }

        });

    });

}

// =====================================
// TAB BUTTONS
// =====================================

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(btn => btn.classList.remove("active"));
        tab.classList.add("active");

        const t = tab.textContent.trim().toLowerCase();

        if (t === "all apps") {

    renderFirebaseGames(allFirebaseGames);
    renderTopApps(allFirebaseGames);

}
else if (t === "new apps") {

    const games = allFirebaseGames.filter(game =>
        (game.category || "all").toLowerCase() === "new"
    );

    renderFirebaseGames(games);
    renderTopApps(games);
}
else if (t === "upcoming") {

    const games = allFirebaseGames.filter(game =>
        (game.category || "all").toLowerCase() === "upcoming"
    );

    renderFirebaseGames(games);
    renderTopApps(games);
}
    });

});

// =====================================
// FILTER BUTTONS
// =====================================

chips.forEach(chip => {
    chip.addEventListener("click", () => {
        chips.forEach(btn => btn.classList.remove("active"));
        chip.classList.add("active");
        const t=(chip.textContent||"").toLowerCase();
        let g=allFirebaseGames;
        if (t.includes("new")) {
    g = g.filter(x => (x.category || "all") === "new");
}
else if (t.includes("upcoming")) {
    g = g.filter(x => (x.category || "all") === "upcoming");
}
else if (t.includes("all")) {
    g = g;
}
else if (t.includes("bonus")) {
    g = g.filter(x => String(x.reward || "").toLowerCase().includes("bonus"));
}
else if (t.includes("fast")) {
    g = g.filter(x => Number(x.withdraw || 0) <= 100);
}
else if (t.includes("trend")) {
    g = g.filter(x => Number(x.topPosition) > 0);
}

renderFirebaseGames(g);
    });
});

// =====================================
// INSTALL BUTTON EFFECT
// =====================================

document.addEventListener("click", e => {

    if (!e.target.classList.contains("install-btn")) return;

    e.target.style.transform = "scale(.92)";

    setTimeout(() => {

        e.target.style.transform = "";

    },150);

});

// =====================================
// START
// =====================================

searchGames();
// =====================================
// FIREBASE GAME RENDER
// =====================================
// =====================================
// HELPERS
// =====================================

function getGameImage(game) {

    // Firebase URL
    if (game.image && game.image.startsWith("http")) {
        return game.image;
    }

    // GitHub image
    if (game.image) {
        return "images/" + game.image;
    }

    // Default by game name
    const name = (game.name || "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

    return `images/${name}.png`;
}

function getGameBadge(game) {

    return game.badge || "NEW";
}

function getGameReward(game) {

    return game.reward || game.bonus || "🎁 Welcome Bonus";
}

function getGameRating(game) {

    if (!game.rating) return "⭐ 5.0";

    return game.rating.toString().startsWith("⭐")
        ? game.rating
        : "⭐ " + game.rating;
}

function renderFirebaseGames(games = []) {
    if (allFirebaseGames.length === 0) {
    allFirebaseGames = games.slice();
    }

    if (!firebaseContainer) return;

    firebaseContainer.innerHTML = "";

    if (!games.length) {

        firebaseContainer.innerHTML = `
        <div class="game-card">
            <div class="game-left">
                <div class="game-info">
                    <h3>No Games Found</h3>
                    <small>Please check again later.</small>
                </div>
            </div>
        </div>`;

        return;

    }

    games.forEach(game => {
const category = (game.category || "all").toLowerCase();
        let badge = getGameBadge(game);

if (category === "new") {
    badge = " New";
}
else if (category === "upcoming") {
    badge = " Upcoming";
}
        
        const reward = game.reward || "🎁 Welcome Bonus 58";
        const rating = game.rating || "⭐ 5.0";
        const rawImage = getGameImage(game);
const image = rawImage.startsWith("http") || rawImage.startsWith("images/")
    ? rawImage
    : "images/" + rawImage;

        firebaseContainer.innerHTML += `
<div class="game-card firebase-game-card">

    <div class="game-left">

        <img src="${image}"
             class="game-logo"
             alt="${game.name}"
             onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(game.name)}&background=1d43c5&color=ffffff&size=256&bold=true';">

        <div class="game-info">

            <div class="game-top">
                <h3>${game.name}</h3>
                <span class="game-badge">${badge}</span>
            </div>

            <p>
    🎁 <span style="color:#ff3b30;font-weight:700;">
        Sign Up Bonus ₹${String(game.reward || game.bonus || "58").replace(/[^\d.-]/g, "")}
    </span>
</p>

<small>
    🏦 <span style="color:#003366;font-weight:700;">
        Min Withdraw ₹${String(game.withdraw || "110").replace(/[^\d.-]/g, "")}
    </span>
</small>

        </div>

    </div>

    <a href="game-details.html?game=${encodeURIComponent(
    (game.name || "").toLowerCase().replace(/\s+/g, "")
)}"
   class="install-btn">
   📥 Download
</a>

</div>
`;

    });

    updateGameCount();
renderTopApps(games);
}
window.renderFirebaseGames = renderFirebaseGames;
// =====================================
// GAME COUNT
// =====================================

function updateGameCount() {

    const heading = document.querySelector(".games-heading p");

    if (!heading) return;

    heading.textContent =
        document.querySelectorAll(".game-card").length +
        " Games Available";

}

// =====================================
// CARD ANIMATION
// =====================================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

});

function animateCards() {

    document.querySelectorAll(".game-card").forEach(card => {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = ".4s";

        observer.observe(card);

    });

}

window.addEventListener("load", () => {

    animateCards();

});

// =====================================
// GLOBAL FUNCTION
// =====================================

window.renderFirebaseGames = renderFirebaseGames;
window.renderTopApps = renderTopApps;
function renderTopApps(games = []) {

    const container = document.getElementById("topAppsContainer");
    if (!container) return;

    const topGames = games
    .filter(game => Number(game.topPosition || 0) > 0 || game.top === true)
    .sort((a, b) => {
        const aPos = Number(a.topPosition || 999);
        const bPos = Number(b.topPosition || 999);
        return aPos - bPos;
    })
    .slice(0, 3);

    container.innerHTML = "";

    topGames.forEach((game, index) => {

        const badge = game.badge || (index === 0 ? "NEW" : "HOT");
        const reward = game.reward || game.bonus || "Bonus";
        const image = getGameImage(game);

        container.innerHTML += `
        <div class="top-app-card">
            <span class="rank rank-${index + 1}">${index + 1}</span>
            <span class="new-tag">${badge}</span>

            <img src="${image}" alt="${game.name}"
style="width:78px;height:78px;object-fit:contain;margin:8px auto 6px;display:block;">

            <h3 style="font-size:18px;font-weight:800;margin:8px 0 8px;text-transform:uppercase;line-height:1.1;">
${game.name}
</h3>

            <p>
🎁 <span style="color:#ff3b30;font-weight:700;">${reward.replace("🎁 Welcome Bonus ","")}</span>
</p>

            <small>
  🏦 <span style="color:#003366;font-weight:700;">Min Withdraw ₹${String(game.withdraw || "100").replace(/[^\d.-]/g, "")}</span>
</small>



            <a href="game-details.html?game=${encodeURIComponent(
    (game.name || "").toLowerCase().trim()
)}"
style="display:block;background:#FFC107;color:#000;font-weight:700;
padding:12px;border-radius:30px;text-decoration:none;margin-top:12px;">
⬇️ Download
</a>
        </div>
        `;
    });
}
// ===== ONLY INDEX HARD-CODED GAMES FIX =====
document.addEventListener("DOMContentLoaded", function () {

    const hardCodeContainer = document.querySelector("#gamesContainer");
    if (!hardCodeContainer) return;

    // Sirf direct hard-coded cards
    hardCodeContainer.querySelectorAll(":scope > .game-card").forEach(function(card) {

        // 🎁 BONUS
        const bonus = card.querySelector(".game-info p");

        if (bonus && !bonus.textContent.includes("Sign Up Bonus")) {
            bonus.innerHTML = bonus.innerHTML.replace(
                /Bonus/i,
                "Sign Up Bonus"
            );
        }

        // 🏦 MIN WITHDRAW
        const withdraw = card.querySelector(".game-info small");

        if (withdraw) {
            let amount = withdraw.textContent.match(/\d+/);

            if (amount) {
                withdraw.innerHTML = "🏦 Min Withdraw ₹" + amount[0];
            }
        }

    });

});
/* ===== INSTALL → 📥 Download (ALL GAMES) ===== */
function changeInstallToDownload() {
    document.querySelectorAll('.game-card a, .game-card button, .firebase-game-card a, .firebase-game-card button')
    .forEach(btn => {
        if (btn.textContent.trim().toUpperCase() === 'INSTALL') {
            btn.innerHTML = '📥 Download';
        }
    });
}

/* Hardcoded games */
changeInstallToDownload();

/* Firebase games load hone ke baad bhi automatically change */
const downloadObserver = new MutationObserver(() => {
    changeInstallToDownload();
});

downloadObserver.observe(document.body, {
    childList: true,
    subtree: true
});
