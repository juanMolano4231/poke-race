const selectionDiv = document.getElementById("selection");
const raceDiv = document.getElementById("race");
const resultDiv = document.getElementById("result");

const startBtn = document.getElementById("startBtn");

const logsPanel = document.getElementById("logsPanel");

const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");

const userSelect = document.getElementById("userSelect");
const groupSelect = document.getElementById("groupSelect");
const loadLogsBtn = document.getElementById("loadLogsBtn");

let pokemons = [];
let selectedId = null;

let streak = 0;

let currentUser = null;

async function login() {

  const name = usernameInput.value.trim();

  if (!name) {
    alert("Enter username");
    return;
  }

  const res = await fetch("api/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name
    })
  });

  currentUser = await res.json();

  alert(`Logged in as ${currentUser.name}`);

  loadUsers();
}

loginBtn.onclick = login;

async function loadUsers() {

  const res = await fetch("api/get_users.php");

  const users = await res.json();

  userSelect.innerHTML = "";

  users.forEach(user => {

    const option = document.createElement("option");

    option.value = user.name;
    option.textContent = user.name;

    userSelect.appendChild(option);
  });
}

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

  pokemons = await Promise.all((await Promise.all(promises)).map(async p => {

    const speedStat =
      p.stats.find(s => s.stat.name === "speed").base_stat;

    const species =
      await fetch(p.species.url).then(r => r.json());

    const gen = species.generation.name;

    return {
      ...p,
      speedStat,
      gen
    };
  }));

  pokemons.forEach(p => {

    const container = document.createElement("div");

    container.style.textAlign = "center";

    const img = document.createElement("img");

    img.src = p.sprites.front_default;

    img.className = "poke";

    img.dataset.id = p.id;

    const label = document.createElement("div");

    label.style.fontSize = "12px";

    label.textContent =
      `${p.name} (${p.gen.replace("generation-", "Gen ")})`;

    img.onclick = () => {

      document.querySelectorAll(".poke")
        .forEach(el => el.classList.remove("selected"));

      img.classList.add("selected");

      selectedId = p.id;
    };

    container.appendChild(img);

    container.appendChild(label);

    selectionDiv.appendChild(container);
  });
}

startBtn.onclick = () => {

  if (!currentUser) {
    alert("Login first");
    return;
  }

  if (!selectedId) {
    return;
  }

  startRace();
};

async function writeLog(action, pokemon) {

  await fetch("api/write_log.php", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      user: currentUser.name,
      action,
      streak,
      pokemon
    })
  });
}

async function saveScore() {

  await fetch("api/save_score.php", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      user_id: currentUser.id,
      score: streak
    })
  });
}

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
      name: p.name,
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

        r.burstTime =
          Math.floor(Math.random() * 20) + 10;

        r.v =
          r.baseSpeed + Math.random() * r.baseSpeed;
      }

      if (r.burstTime > 0) {

        r.burstTime--;

        r.v *= 0.97;

      } else {

        r.v *= 0.9;
      }

      const jitter =
        Math.random() * (r.baseSpeed / 4);

      r.x +=
        r.v + r.baseSpeed * 0.3 + jitter;

      r.el.style.transform =
        `translateX(${r.x}px)`;

      if (r.x >= finish && !winner) {
        winner = r;
      }
    });

    if (!winner) {

      requestAnimationFrame(step);

    } else {

      if (winner.id === selectedId) {

        streak++;

        resultDiv.textContent =
          `Win! Streak: ${streak}`;

        writeLog(
          "win",
          winner.name
        );

      } else {

        const finalScore = streak;

        resultDiv.textContent =
          `Lose. Final streak: ${finalScore}`;

        writeLog(
          "loss",
          winner.name
        );

        saveScore();

        streak = 0;
      }

      setTimeout(() => {

        raceDiv.innerHTML = "";

        loadPokemons();

      }, 1000);
    }
  }

  requestAnimationFrame(step);
}

loadLogsBtn.onclick = async () => {

  const user = userSelect.value;

  const group = groupSelect.value;

  const res = await fetch(
    `api/get_logs.php?user=${user}&group=${group}`
  );

  const data = await res.json();

  logsPanel.innerHTML = "";

  Object.keys(data).forEach(key => {

    const div = document.createElement("div");

    div.className = "group";

    const title = document.createElement("h3");

    title.textContent = key;

    div.appendChild(title);

    data[key].forEach(log => {

      const p = document.createElement("p");

      p.textContent = log;

      div.appendChild(p);
    });

    logsPanel.appendChild(div);
  });
};

loadUsers();

loadPokemons();