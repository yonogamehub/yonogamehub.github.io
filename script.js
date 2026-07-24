// =====================================
// DOM ELEMENTS
// =====================================

const searchInput = document.querySelector(".search-box input");
const firebaseContainer = document.getElementById("firebaseGames");

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
        if(t.includes("new")) g=g.filter(x=>(x.badge||"NEW").toLowerCase().includes("new"));
        else if(t.includes("bonus")) g=g.filter(x=>String(x.reward||"").toLowerCase().includes("bonus"));
        else if(t.includes("fast")) g=g.filter(x=>String(x.reward||"").toLowerCase().includes("withdraw"));
        else if(t.includes("trend")) g=allFirebaseGames;
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

    if (!game.image) return "images/logo.png";

    if (game.image.startsWith("http")) return game.image;

    if (game.image.startsWith("images/")) return game.image;

    return "images/" + game.image;
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
    allFirebaseGames = games.slice();

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

        const badge = game.badge || "NEW";
        const reward = game.reward || "🎁 Welcome Bonus 58";
        const rating = game.rating || "⭐ 5.0";
        const image = "images/" + (game.image || "logo.png");

        firebaseContainer.innerHTML += `

        <div class="game-card">

            <div class="game-left">

                <img src="${image}"
                     class="game-logo"
                     alt="${game.name}">

                <div class="game-info">

                    <div class="game-top">

                        <h3>${game.name}</h3>

                        <span class="game-badge">${badge}</span>

                    </div>

                    <p>${reward}</p>

                    <small>${rating}</small>

                </div>

            </div>

            <a href="${game.link}"
               target="_blank"
               class="install-btn">

               INSTALL

            </a>

        </div>

        `;

    });

    updateGameCount();
renderTopApps(games);
}

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
function renderTopApps(games = []) {

    const container = document.getElementById("topAppsContainer");
    if (!container) return;

    const topGames = games
        .filter(game => game.top === true)
        .sort((a, b) => (a.order || 999) - (b.order || 999))
        .slice(0, 3);

    container.innerHTML = "";

    topGames.forEach((game, index) => {

        const badge = game.badge || "NEW";
        const reward = game.reward || game.bonus || "Bonus";
        const image = game.image.startsWith("images/")
            ? game.image
            : "images/" + game.image;

        container.innerHTML += `
        <div class="top-app-card">
            <span class="rank">#${index + 1}</span>
            <span class="new-tag">${badge}</span>

            <img src="${image}" alt="${game.name}">

            <h3>${game.name}</h3>

            <p>${reward}</p>

            <small>⭐ ${game.rating} | Min Withdraw ₹100</small>

            <a href="${game.link}"
   target="_blank"
   class="download-btn">
   Download
</a>
        </div>`;
    });
}
