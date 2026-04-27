const selectionDiv = document.getElementById("selection");
const raceDiv = document.getElementById("race");
const resultDiv = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

let pokemons = [];
let selectedId = null;

async function loadPokemons() {
  const ids = new Set();
  while (ids.size < 10) {
    ids.add(Math.floor(Math.random() * 1025) + 1);
  }

  const promises = [...ids].map(id =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
  );

  pokemons = await Promise.all(promises);

  pokemons.forEach(p => {
    const img = document.createElement("img");
    img.src = p.sprites.front_default;
    img.className = "poke";
    img.dataset.id = p.id;

    img.onclick = () => {
      document.querySelectorAll(".poke").forEach(el => el.classList.remove("selected"));
      img.classList.add("selected");
      selectedId = p.id;
    };

    selectionDiv.appendChild(img);
  });
}

startBtn.onclick = () => {
  if (!selectedId) return;

  startRace();
};

function startRace() {
  raceDiv.innerHTML = "";
  resultDiv.textContent = "";

  const racers = pokemons.map((p, i) => {
    const img = document.createElement("img");
    img.src = p.sprites.front_default;
    img.className = "racer";
    img.style.top = `${i * 35}px`;

    raceDiv.appendChild(img);

    return {
      id: p.id,
      el: img,
      x: 0,
      v: 0,          // current velocity
      burstTime: 0   // frames remaining in burst
    };
  });

  const finish = 800;
  let winner = null;

  function step() {
    racers.forEach(r => {
      // Start a burst randomly if not already in one
      if (r.burstTime <= 0 && Math.random() < 0.04) {
        r.burstTime = Math.floor(Math.random() * 20) + 10; // duration
        r.v = Math.random() * 8 + 4; // strong impulse
      }

      if (r.burstTime > 0) {
        r.burstTime--;
        // slight decay during burst
        r.v *= 0.97;
      } else {
        // slow down when not bursting
        r.v *= 0.92;
      }

      // small jitter so ties break and movement never fully stops
      const jitter = Math.random() * 0.5;

      r.x += r.v + jitter;
      r.el.style.transform = `translateX(${r.x}px)`;

      if (r.x >= finish && !winner) {
        winner = r;
      }
    });

    if (!winner) {
      requestAnimationFrame(step);
    } else {
      resultDiv.textContent =
        winner.id === selectedId ? "Congratulations!" : "Game Over";
    }
  }

  requestAnimationFrame(step);
}

loadPokemons();