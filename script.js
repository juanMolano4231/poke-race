const selectionDiv = document.getElementById("selection");
const raceDiv = document.getElementById("race");
const resultDiv = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const rankingBtn = document.getElementById("rankingBtn");

let pokemons = [];
let selectedId = null;

let streak = 0;
let rankings = JSON.parse(localStorage.getItem("rankings") || "[]");

// Load Pokémon with speed stat
async function loadPokemons() {
  selectedId = null;
  selectionDiv.innerHTML = "";

  const ids = new Set();
  while (ids.size < 10) {
    ids.add(Math.floor(Math.random() * 1025) + 1);
  }

  const promises = [...ids].map(id =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(r => r.json())
  );

  pokemons = (await Promise.all(promises)).map(p => {
    const speedStat = p.stats.find(s => s.stat.name === "speed").base_stat;
    return { ...p, speedStat };
  });

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

rankingBtn.onclick = () => {
  const text =
    rankings
      .sort((a, b) => b.streak - a.streak)
      .map((r, i) => `${i + 1}. ${r.name} - ${r.streak}`)
      .join("\n") || "No rankings yet";

  alert(text);
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
      v: 0,
      burstTime: 0,
      baseSpeed: p.speedStat / 20
    };
  });

  const finish = 800;
  let winner = null;

  function step() {
    racers.forEach(r => {
      if (r.burstTime <= 0 && Math.random() < 0.04) {
        r.burstTime = Math.floor(Math.random() * 20) + 10;
        r.v = r.baseSpeed + Math.random() * r.baseSpeed;
      }

      if (r.burstTime > 0) {
        r.burstTime--;
        r.v *= 0.97;
      } else {
        r.v *= 0.9;
      }

      const jitter = Math.random() * (r.baseSpeed / 4);

      r.x += r.v + r.baseSpeed * 0.3 + jitter;
      r.el.style.transform = `translateX(${r.x}px)`;

      if (r.x >= finish && !winner) {
        winner = r;
      }
    });

    if (!winner) {
      requestAnimationFrame(step);
    } else {
      if (winner.id === selectedId) {
        streak++;
        resultDiv.textContent = `Win! Streak: ${streak}`;
      } else {
        resultDiv.textContent = `Lose. Final streak: ${streak}`;
        const name = prompt("Enter your name:");
        if (name) {
          rankings.push({ name, streak });
          localStorage.setItem("rankings", JSON.stringify(rankings));
        }
        streak = 0;
      }

      setTimeout(() => {
        raceDiv.innerHTML = "";   // clear sprites
        loadPokemons();           // draw new set
      }, 1000);
    }
  }

  requestAnimationFrame(step);
}

loadPokemons();