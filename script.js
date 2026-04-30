document.addEventListener("DOMContentLoaded", function() {

  const points = document.querySelectorAll(".point");
  const clickSound = document.getElementById("clickSound");
  const openSound = document.getElementById("openSound");

  // PANZOOM
  const elem = document.getElementById('map');

  const panzoom = Panzoom(elem, {
    maxScale: 3,
    minScale: 1,
    contain: 'outside',
    step: 0.2,
    animate: true
  });

  // 🔥 INI YANG BENER BUAT HP
panzoom.bind();

  
elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
  const zoomLevels = {
  frostheim: 2.5,
  valnoria: 2.2,
  azuren: 3
};

elem.addEventListener('wheel', panzoom.zoomWithWheel);

// 🔥 INI YANG BENER BUAT HP
panzoom.bind();

  // FUNCTION FOCUS
  function focusToPoint(point) {

  const rect = elem.getBoundingClientRect();

  const xPercent = parseFloat(point.style.left);
  const yPercent = parseFloat(point.style.top);

  const x = rect.width * (xPercent / 100);
  const y = rect.height * (yPercent / 100);

  const scale = zoomLevels[point.dataset.target] || 2.5;

  // 🔥 HITUNG OFFSET BIAR CENTER
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const dx = centerX - x;
  const dy = centerY - y;

  panzoom.zoomTo(x, y, scale, {
  animate: true,
  duration: 500
});

panzoom.pan(
  elem.clientWidth / 2 - x,
  elem.clientHeight / 2 - y,
  { animate: true }
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
      panel.querySelector("#" + btn.dataset.tab).classList.add("active");
    });
  });

  // CHARACTER SYSTEM
  document.querySelectorAll(".char-item").forEach(item => {
    item.addEventListener("click", () => {
      const panel = item.closest(".panel");
      const detail = panel.querySelector(".char-detail");

      detail.innerHTML = `
        <h4>${item.dataset.name}</h4>
        <p>${item.dataset.desc}</p>
      `;
    });
  });

  document.querySelectorAll(".city-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const card = btn.closest(".city-card");

    const name = card.dataset.name;
    const desc = card.dataset.desc;

    const popup = document.getElementById("city-popup");
const title = document.getElementById("popup-title");
const descEl = document.getElementById("popup-desc");

title.textContent = name;
descEl.textContent = desc;

popup.classList.add("active");
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

document.querySelectorAll(".char-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const name = btn.dataset.name;
    const desc = btn.dataset.desc;

    const popup = document.getElementById("char-popup");
    const title = document.getElementById("char-title");
    const descEl = document.getElementById("char-desc");

    title.textContent = name;
    descEl.textContent = desc;

    popup.classList.add("active");
  });
});

// CLOSE
document.getElementById("char-close").addEventListener("click", () => {
  document.getElementById("char-popup").classList.remove("active");
});

const img = document.getElementById("char-img");
img.src = btn.closest(".character-card").querySelector("img").src;

});
