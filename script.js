// =====================================
// YONO LOOT HUB — SINGLE GAME CONTROLLER
// Firebase + Search + Filters + Top 3 + Download
// =====================================

const firebaseContainer = document.getElementById("firebaseGamesList");
const searchInput = document.getElementById("searchInput");
const tabs = document.querySelectorAll(".tab-btn");
const chips = document.querySelectorAll(".chip");

let allFirebaseGames = [];
let currentCategory = "all";
let currentFilter = "all";
let currentSearch = "";

const clean = (v) => String(v ?? "").trim();

function escapeHTML(value) {
    return clean(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function numericValue(value, fallback = 0) {
    const n = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : fallback;
}

// =====================================
// IMAGE
// =====================================

function getGameImage(game) {
    const image = clean(game.image);

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    if (image.startsWith("images/")) {
        return image;
    }

    if (image) {
        return "images/" + image.replace(/^\/+/, "");
    }

    const name = clean(game.name)
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

    return name ? `images/${name}.png` : "images/logo.png";
}

// =====================================
// GAME RULES
// =====================================

function getCategory(game) {
    return clean(game.category || "all").toLowerCase();
}

function getBadge(game) {
    const category = getCategory(game);

    // Manage Games category has priority for NEW / UPCOMING.
    if (category === "new") return "NEW";
    if (category === "upcoming") return "UPCOMING";

    return clean(game.badge || "NEW").toUpperCase();
}

function getBonus(game) {
    const raw = game.reward ?? game.bonus ?? "58";
    const value = String(raw).replace(/[^\d.-]/g, "");
    return value || "58";
}

function getWithdraw(game) {
    const raw = game.withdraw ?? "110";
    const value = String(raw).replace(/[^\d.-]/g, "");
    return value || "110";
}

function getLink(game) {
    let link = clean(game.link);
    if (!link) return "";

    // Accept normal web URLs, protocol-relative URLs, and links entered
    // without the protocol in Manage Games.
    if (link.startsWith("//")) return "https:" + link;
    if (/^https?:\/\//i.test(link)) return link;
    if (/^www\./i.test(link)) return "https://" + link;

    // A relative link is valid on the current website.
    if (link.startsWith("/") || link.startsWith("./") || link.startsWith("../")) {
        return link;
    }

    // Treat a bare domain such as example.com/path as an external URL.
    if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(link)) {
        return "https://" + link;
    }

    return link;
}

function getOrder(game) {
    const n = Number(game.order);
    return Number.isFinite(n) ? n : 999999;
}

function matchesSearch(game) {
    if (!currentSearch) return true;

    const text = [
        game.name,
        game.badge,
        game.category,
        game.reward,
        game.bonus,
        game.withdraw
    ].map(clean).join(" ").toLowerCase();

    return text.includes(currentSearch);
}

function matchesFilter(game) {
    const category = getCategory(game);

    if (currentCategory !== "all" && category !== currentCategory) {
        return false;
    }

    if (currentFilter === "new") {
        return category === "new" || getBadge(game) === "NEW";
    }

    if (currentFilter === "upcoming") {
        return category === "upcoming" || getBadge(game) === "UPCOMING";
    }

    if (currentFilter === "bonus") {
        return numericValue(game.reward ?? game.bonus, -1) >= 0;
    }

    if (currentFilter === "fast") {
        return numericValue(game.withdraw, 999999) <= 110;
    }

    if (currentFilter === "trending") {
        return numericValue(game.topPosition, 0) > 0 || game.top === true;
    }

    return true;
}

function getVisibleGames() {
    return allFirebaseGames
        .filter(matchesSearch)
        .filter(matchesFilter)
        .slice()
        .sort((a, b) => getOrder(a) - getOrder(b));
}

// =====================================
// RENDER
// =====================================

function renderFirebaseGames(games = null) {

    // Firebase se fresh full list aaye tabhi master list update hogi
    if (Array.isArray(games)) {
        allFirebaseGames = games.slice();
    }

    if (!firebaseContainer) return;

    // Search / filter ke time original Firebase list kabhi overwrite nahi hogi
    const visibleGames = getVisibleGames();

    firebaseContainer.innerHTML = "";

    if (!visibleGames.length) {
        firebaseContainer.innerHTML = `
            <div class="game-card firebase-game-card">
                <div class="game-left">
                    <div class="game-info">
                        <h3>No Games Found</h3>
                        <small>Try another game name or filter.</small>
                    </div>
                </div>
            </div>`;
        updateGameCount(0);
        renderTopApps([]);
        return;
    }

    const html = visibleGames.map(game => {
        const name = escapeHTML(game.name || "Game");
        const image = escapeHTML(getGameImage(game));
        const badge = escapeHTML(getBadge(game));
        const bonus = escapeHTML(getBonus(game));
        const withdraw = escapeHTML(getWithdraw(game));
        const link = getLink(game);

        const download = link
            ? `<a href="${escapeHTML(link)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="install-btn">
                    📥 Download
               </a>`
            : `<button class="install-btn" type="button" disabled>
                    📥 Download
               </button>`;

        return `
        <div class="game-card firebase-game-card"
             data-name="${name.toLowerCase()}"
             data-category="${escapeHTML(getCategory(game))}"
             data-badge="${badge}">

            <div class="game-left">

                <img src="${image}"
                     class="game-logo"
                     alt="${name}"
                     onerror="this.onerror=null;this.src='images/logo.png';">

                <div class="game-info">

                    <div class="game-top">
                        <h3>${name}</h3>
                        <span class="game-badge">${badge}</span>
                    </div>

                    <p>
                        🎁 <span style="color:#ff3b30;font-weight:700;">
                            Sign Up Bonus ₹${bonus}
                        </span>
                    </p>

                    <small>
                        🏦 <span style="color:#003366;font-weight:700;">
                            Min Withdraw ₹${withdraw}
                        </span>
                    </small>

                </div>
            </div>

            ${download}

        </div>`;
    }).join("");

    firebaseContainer.innerHTML = html;

    updateGameCount(visibleGames.length);

    // Top 3 hamesha ORIGINAL Firebase list se
    renderTopApps(allFirebaseGames);

    animateCards();
}

    firebaseContainer.innerHTML = "";

    if (!games.length) {
        firebaseContainer.innerHTML = `
            <div class="game-card firebase-game-card">
                <div class="game-left">
                    <div class="game-info">
                        <h3>No Games Found</h3>
                        <small>Try another game name or filter.</small>
                    </div>
                </div>
            </div>`;
        updateGameCount(0);
        renderTopApps([]);
        return;
    }

    const html = games.map(game => {
        const name = escapeHTML(game.name || "Game");
        const image = escapeHTML(getGameImage(game));
        const badge = escapeHTML(getBadge(game));
        const bonus = escapeHTML(getBonus(game));
        const withdraw = escapeHTML(getWithdraw(game));
        const link = getLink(game);

        const download = link
            ? `<a href="${escapeHTML(link)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="install-btn">
                    📥 Download
               </a>`
            : `<button class="install-btn" type="button" disabled
                    style="opacity:.55;cursor:not-allowed;">
                    📥 Download
               </button>`;

        return `
        <div class="game-card firebase-game-card"
             data-name="${name.toLowerCase()}"
             data-category="${escapeHTML(getCategory(game))}"
             data-badge="${badge}">
            <div class="game-left">
                <img src="${image}"
                     class="game-logo"
                     alt="${name}"
                     onerror="this.onerror=null;this.src='images/logo.png';">

                <div class="game-info">
                    <div class="game-top">
                        <h3>${name}</h3>
                        <span class="game-badge">${badge}</span>
                    </div>

                    <p>🎁 <span style="color:#ff3b30;font-weight:700;">
                        Sign Up Bonus ₹${bonus}
                    </span></p>

                    <small>🏦 <span style="color:#003366;font-weight:700;">
                        Min Withdraw ₹${withdraw}
                    </span></small>
                </div>
            </div>

            ${download}
        </div>`;
    }).join("");

    firebaseContainer.innerHTML = html;

    updateGameCount(games.length);
    renderTopApps(allFirebaseGames);
    animateCards();
}

window.renderFirebaseGames = renderFirebaseGames;

// =====================================
// GAME COUNT
// =====================================

function updateGameCount(count = getVisibleGames().length) {
    const heading = document.querySelector(".games-heading p");
    if (heading) {
        heading.textContent = `${count} Games Available`;
    }
}

// =====================================
// TOP 3
// =====================================

function renderTopApps(games = allFirebaseGames) {
    const container = document.getElementById("topAppsContainer");
    if (!container) return;

    const topGames = games
        .filter(game => numericValue(game.topPosition, 0) > 0 || game.top === true)
        .sort((a, b) => numericValue(a.topPosition, 999) - numericValue(b.topPosition, 999))
        .slice(0, 3);

    container.innerHTML = topGames.map((game, index) => {
        const name = escapeHTML(game.name || "Game");
        const image = escapeHTML(getGameImage(game));
        const badge = escapeHTML(getBadge(game));
        const bonus = escapeHTML(getBonus(game));
        const withdraw = escapeHTML(getWithdraw(game));
        const link = getLink(game);

        const download = link
            ? `<a href="${escapeHTML(link)}" target="_blank"
                  rel="noopener noreferrer"
                  style="display:block;background:#FFC107;color:#000;font-weight:700;
                  padding:12px;border-radius:30px;text-decoration:none;margin-top:12px;">
                  ⬇️ Download
               </a>`
            : "";

        return `
        <div class="top-app-card">
            <span class="rank rank-${index + 1}">${index + 1}</span>
            <span class="new-tag">${badge}</span>

            <img src="${image}" alt="${name}"
                 style="width:78px;height:78px;object-fit:contain;margin:8px auto 6px;display:block;"
                 onerror="this.onerror=null;this.src='images/logo.png';">

            <h3 style="font-size:18px;font-weight:800;margin:8px 0;
                       text-transform:uppercase;line-height:1.1;">
                ${name}
            </h3>

            <p>🎁 <span style="color:#ff3b30;font-weight:700;">
                Sign Up Bonus ₹${bonus}
            </span></p>

            <small>🏦 <span style="color:#003366;font-weight:700;">
                Min Withdraw ₹${withdraw}
            </span></small>

            ${download}
        </div>`;
    }).join("");
}

window.renderTopApps = renderTopApps;


// =====================================
// DOWNLOAD LINKS — RELIABLE CLICK
// =====================================
document.addEventListener("click", (event) => {
    const btn = event.target.closest("a.install-btn");
    if (!btn) return;
    const href = btn.getAttribute("href");
    if (!href || href === "#") {
        event.preventDefault();
        return;
    }
    // Do not intercept normal navigation; the anchor opens in a new tab.
});

// =====================================
// SEARCH — FIXED
// =====================================

if (searchInput) {
    searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value.trim().toLowerCase();
        renderFirebaseGames();
    });
}

// =====================================
// TOP TABS
// =====================================

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(btn => btn.classList.remove("active"));
        tab.classList.add("active");

        const text = tab.textContent.trim().toLowerCase();

        if (text.includes("new")) {
            currentCategory = "new";
            currentFilter = "all";
        } else if (text.includes("upcoming")) {
            currentCategory = "upcoming";
            currentFilter = "all";
        } else {
            currentCategory = "all";
            currentFilter = "all";
        }

        // Reset search when changing main tab.
        if (searchInput) searchInput.value = "";
        currentSearch = "";

        // Keep chip selection visually consistent.
        chips.forEach(btn => btn.classList.remove("active"));
        const allChip = [...chips].find(btn =>
            btn.textContent.trim().toLowerCase() === "all"
        );
        if (allChip) allChip.classList.add("active");

        renderFirebaseGames();
    });
});

// =====================================
// FILTER CHIPS
// =====================================

chips.forEach(chip => {
    chip.addEventListener("click", () => {
        chips.forEach(btn => btn.classList.remove("active"));
        chip.classList.add("active");

        const text = chip.textContent.trim().toLowerCase();

        if (text.includes("new")) currentFilter = "new";
        else if (text.includes("upcoming")) currentFilter = "upcoming";
        else if (text.includes("bonus")) currentFilter = "bonus";
        else if (text.includes("fast")) currentFilter = "fast";
        else if (text.includes("trend")) currentFilter = "trending";
        else currentFilter = "all";

        renderFirebaseGames();
    });
});

// =====================================
// BUTTON PRESS EFFECT
// =====================================

document.addEventListener("click", event => {
    const btn = event.target.closest(".install-btn");
    if (!btn || btn.tagName === "BUTTON" && btn.disabled) return;

    btn.style.transform = "scale(.94)";
    setTimeout(() => {
        btn.style.transform = "";
    }, 150);
});

// =====================================
// CARD ANIMATION
// =====================================

function animateCards() {
    document.querySelectorAll("#firebaseGamesList .game-card").forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";
        card.style.transition = ".25s ease";

        requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        });
    });
}

// =====================================
// INITIAL STATE
// =====================================

window.addEventListener("load", () => {
    updateGameCount();
});
