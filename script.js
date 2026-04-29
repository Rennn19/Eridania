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
    step: 0.2
  });

  elem.parentElement.addEventListener('touchmove', panzoom.zoomWithWheel);

  // FUNCTION FOCUS
  function focusToPoint(point) {
    const rect = elem.getBoundingClientRect();

    const xPercent = parseFloat(point.style.left);
    const yPercent = parseFloat(point.style.top);

    const x = rect.width * (xPercent / 100);
    const y = rect.height * (yPercent / 100);

    panzoom.zoomTo(x, y, 2, {
      animate: true,
      duration: 400
    });
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
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
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

});
