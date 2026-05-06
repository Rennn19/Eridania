let CHAR_DATA = {};
let RACE_DATA = {};

let panzoom;

async function loadCharacterData() {
  const res = await fetch("assets/data/characters.json");
   CHAR_DATA = await res.json();
}

document.addEventListener("DOMContentLoaded", async function() {

  const points = document.querySelectorAll(".point");
  const clickSound = document.getElementById("clickSound");
  const openSound = document.getElementById("openSound");
  await loadCharacterData();
console.log("CHAR_DATA:", CHAR_DATA);
console.log("VALIR:", CHAR_DATA["valir"]);

await loadRaceData();
renderRaces();

let currentRace = null;

const mainMenu = document.getElementById("main-menu");
const raceMenu = document.getElementById("race-menu");
const menuBtn = document.getElementById("menuBtn");
const racePanel = document.getElementById("race-panel");

const raceBtn = document.getElementById("raceBtn");
const backBtn = document.getElementById("backBtn");

function renderSubRaces(raceId) {
  const container = document.getElementById("subrace-list");
  container.innerHTML = "";

  const subs = RACE_DATA[raceId].sub;

  Object.entries(subs).forEach(([id, s]) => {
    container.innerHTML += `
      <div class="subrace-card" data-id="${id}">
        <div class="subrace-header">
          <div class="subrace-name">${s.name}</div>
          <div class="subrace-tier tier-${s.tier}">${s.tier}</div>
        </div>

        <div class="subrace-characters" id="char-${id}"></div>
      </div>
    `;
  });
}

document.addEventListener("click", (e) => {

  const sub = e.target.closest(".subrace-card");
  if (sub) {
  const subId = sub.dataset.id;

  // active highlight
  document.querySelectorAll(".subrace-card")
    .forEach(c => c.classList.remove("active"));

  sub.classList.add("active");

  filterCharacterBySubRace(currentRace, subId);
}
});

function filterCharacterBySubRace(raceId, subId) {

  // 🔥 tutup semua dulu
  document.querySelectorAll(".subrace-characters").forEach(el => {
    el.innerHTML = "";
    el.style.display = "none";
  });

  const container = document.getElementById(`char-${subId}`);
  if (!container) return;

  let found = false;

  Object.entries(CHAR_DATA).forEach(([id, char]) => {

    if (char.race === raceId && char.subRace === subId) {

      container.innerHTML += `
        <div class="character-card">
          <img src="${char.img}">
          <div class="char-info">
            <h4>${char.name}</h4>
            <span>${char.desc}</span>
          </div>
          <button class="char-btn" data-id="${id}">Detail</button>
        </div>
      `;

      found = true;
    }

  });

  container.style.display = "block";

  if (!found) {
    container.innerHTML = "<p>Tidak ada karakter</p>";
  }
}

const backToRace = document.getElementById("backToRace");

backToRace.addEventListener("click", () => {
  document.getElementById("subrace-menu").style.display = "none";
  raceMenu.style.display = "block";
});

raceBtn.addEventListener("click", () => {
  mainMenu.style.display = "none";
  raceMenu.style.display = "block";
});

backBtn.addEventListener("click", () => {
  raceMenu.style.display = "none";
  mainMenu.style.display = "block";
});

menuBtn.addEventListener("click", () => {
  racePanel.classList.toggle("active");
  document.body.classList.toggle("panel-open");

  document.getElementById("overlay").classList.toggle("active");
});

document.getElementById("overlay").addEventListener("click", () => {
  racePanel.classList.remove("active");
  document.body.classList.remove("panel-open");
  document.getElementById("overlay").classList.remove("active");
});

async function loadRaceData() {
  const res = await fetch("assets/data/races.json");
  RACE_DATA = await res.json();
}

function renderRaces() {
  const container = document.getElementById("race-list");
  container.innerHTML = "";

  Object.entries(RACE_DATA).forEach(([id, r]) => {
    container.innerHTML += `
  <div class="race-card" data-id="${id}">
    <div class="race-name">${r.name}</div>
    <div class="race-meta">Click to explore</div>
  </div>
`;
  });

  document.querySelectorAll(".race-card").forEach(card => {
  card.addEventListener("click", () => {

    document.querySelectorAll(".race-card")
      .forEach(c => c.classList.remove("active"));

    card.classList.add("active");

    const raceId = card.dataset.id;
     currentRace = raceId;
     
    console.log("RACE CLICK:", raceId);

  mainMenu.style.display = "none";
  raceMenu.style.display = "none";
  document.getElementById("subrace-menu").style.display = "block";

  renderSubRaces(raceId);
  console.log("SUB:", RACE_DATA[raceId]);

 });
});
}

  // PANZOOM
  const elem = document.getElementById('map');

  panzoom = Panzoom(elem, {
    maxScale: 3,
    minScale: 1,
    contain: 'outside',
    step: 0.2,
    animate: true
  });

  // 🔥 INI YANG BENER BUAT HP
panzoom.bind();

elem.addEventListener('wheel', panzoom.zoomWithWheel);

  // FUNCTION FOCUS
  function focusToPoint(point) {

  const rect = elem.getBoundingClientRect();

  const xPercent = parseFloat(point.style.left);
  const yPercent = parseFloat(point.style.top);

  const x = rect.width * (xPercent / 100);
  const y = rect.height * (yPercent / 100);

  const scale = 2.5;

  // 🔥 HITUNG OFFSET BIAR CENTER
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

panzoom.zoom(scale);

panzoom.pan(
  elem.clientWidth / 2 - x,
  elem.clientHeight / 2 - y
);

}

  // CLICK POINT
  points.forEach(point => {
    point.addEventListener("click", () => {
      const target = point.dataset.target;

      // SOUND
      clickSound.currentTime = 0;
      clickSound.play();

      if (window.location.hash === "#" + target) {
        window.location.hash = "";
      } else {
        window.location.hash = target;

        openSound.currentTime = 0;
        openSound.play();

        points.forEach(p => p.classList.remove("active"));
        point.classList.add("active");

        focusToPoint(point);
      }
    });
  });

  // KEYBOARD NAV
  document.addEventListener("keydown", function(e) {
    const order = [
      "frostheim","valnoria","eldorin","granvia","riverdale",
      "kazmir","azuren","solterra","lumenia","thalassar",
      "veridia","dunespire","stormward","nyxis","aurelia"
    ];

    let current = window.location.hash.replace("#","");
    let index = order.indexOf(current);

    if (e.key === "ArrowRight") {
      index = (index + 1) % order.length;
      window.location.hash = order[index];
    }

    if (e.key === "ArrowLeft") {
      index = (index - 1 + order.length) % order.length;
      window.location.hash = order[index];
    }

    if (e.key === "Escape") {
      window.location.hash = "";
    }
  });

  // TAB SYSTEM
 const tabSound = document.getElementById("tabSound");

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        tabSound.currentTime = 0;
    tabSound.play().catch(() => {});

      const panel = btn.closest(".panel");

      panel.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      panel.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
     panel.querySelector(`.tab-content[data-tab="${btn.dataset.tab}"]`).classList.add("active");
    });
  });

document.getElementById("popup-close").addEventListener("click", () => {
  document.getElementById("city-popup").classList.remove("active");
});

document.querySelectorAll(".tabs").forEach(tabs => {
  const indicator = tabs.querySelector(".tab-indicator");
  const buttons = tabs.querySelectorAll(".tab-btn");

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      indicator.style.left = (index * 50) + "%";
    });
  });
});

document.addEventListener("click", (e) => {

    const cityBtn = e.target.closest(".city-btn");
  if (cityBtn) {
    e.stopPropagation();

    const card = cityBtn.closest(".city-card");

    const name = card.dataset.name;
    const desc = card.dataset.desc;

    document.getElementById("popup-title").textContent = name;
    document.getElementById("popup-desc").textContent = desc;

    document.getElementById("city-popup").classList.add("active");
    return;
  }

  const btn = e.target.closest(".char-btn");
  if (!btn) return;

  e.stopPropagation();

  const data = CHAR_DATA[btn.dataset.id];

  console.log("CLICK:", btn.dataset.id);
  console.log("DATA:", data);

  if (!data) {
    console.error("Character tidak ditemukan:", btn.dataset.id);
    return;
  }

  const charPopup = document.getElementById("char-popup");

  document.getElementById("char-name").textContent = data.name;
  document.getElementById("char-desc").textContent = data.desc;
  document.getElementById("char-img").src = data.img;

  charPopup.classList.add("active");
});

// CLOSE
document.getElementById("char-close").addEventListener("click", () => {
  document.getElementById("char-popup").classList.remove("active");
});

});

window.addEventListener("hashchange", () => {
  if (window.location.hash) {
    document.body.classList.add("panel-open");

    panzoom.setOptions({ disablePan: true });

  } else {
    document.body.classList.remove("panel-open");

    panzoom.setOptions({ disablePan: false });
  }

    // 🔥 MATIIN PANZOOM
    panzoom.setOptions({ disablePan: true });
panzoom.setOptions({ disablePan: false });
});

