const levelData = [
  {
    id: 0,
    name: "L0",
    status: "Level Unlocked",
    statusIcon: "unlock",
    titleClass: "",
    gem: "assets/img_9.png",
    background: "assets/img_8.png",
    cards: [
      {
        title: "L0 Rights",
        icon: "assets/img_9.png",
        rows: [
          ["Minimum Quantitative Amount", "0"],
          ["Maximum Quantitative Amount", "100"],
          ["Daily Quantitative Times", "3 times"],
          ["Profit Ratio", "2% ~ 2.2%"]
        ]
      }
    ]
  },
  {
    id: 1,
    name: "L1",
    status: "Level Locked",
    statusIcon: "lock",
    titleClass: "level-gold",
    gem: "assets/L1-CL83WJM9.png",
    background: "assets/img_11.png",
    cards: [
      {
        title: "L1 Upgrade Conditions",
        icon: "assets/L1-CL83WJM9.png",
        rows: [["Effective Fund", "0/50"]]
      },
      {
        title: "L1 Rights",
        icon: "assets/L1-CL83WJM9.png",
        rows: [
          ["Minimum Quantitative Amount", "50"],
          ["Maximum Quantitative Amount", "1000"],
          ["Daily Quantitative Times", "3 times"],
          ["Profit Ratio", "2% ~ 2.2%"]
        ]
      }
    ]
  },
  {
    id: 2,
    name: "L2",
    status: "Level Locked",
    statusIcon: "lock",
    titleClass: "level-cyan",
    gem: "assets/img_0.png",
    background: "assets/img_14.png",
    cards: [
      {
        title: "L2 Upgrade Conditions",
        icon: "assets/img_0.png",
        rows: [
          ["Effective Fund", "0/500"],
          ["L1 Members", "0/5"]
        ]
      },
      {
        title: "L2 Rights",
        icon: "assets/img_0.png",
        rows: [
          ["Minimum Quantitative Amount", "500"],
          ["Maximum Quantitative Amount", "5000"],
          ["Daily Quantitative Times", "5 times"],
          ["Profit Ratio", "2.3% ~ 2.5%"]
        ]
      }
    ]
  }
];

const state = {
  currentLevel: 0,
  totalAssets: 0
};

const totalAssetsElement = document.getElementById("totalAssets");
const levelName = document.getElementById("levelName");
const levelStatus = document.getElementById("levelStatus");
const levelGem = document.getElementById("levelGem");
const levelBg = document.getElementById("levelBg");
const detailsArea = document.getElementById("detailsArea");
const sliderDots = document.getElementById("sliderDots");
const levelCard = document.getElementById("levelCard");
const swipeArea = document.getElementById("levelSwipeArea");

function setAssetsValue(value) {
  state.totalAssets = value;
  totalAssetsElement.textContent = String(value);
}

function createDots() {
  sliderDots.innerHTML = "";

  levelData.forEach((level, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to ${level.name}`);
    dot.addEventListener("click", () => setLevel(index));
    sliderDots.appendChild(dot);
  });
}

function createInfoCard(card) {
  const rows = card.rows
    .map(
      ([label, value]) => `
        <div class="info-row">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
    )
    .join("");

  return `
    <article class="info-card">
      <div class="info-card-header">
        <img src="${card.icon}" alt="${card.title} icon" />
        <h4>${card.title}</h4>
      </div>
      ${rows}
    </article>
  `;
}

function renderDetails(level) {
  detailsArea.innerHTML = level.cards.map(createInfoCard).join("");
}

function renderDots() {
  [...sliderDots.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === state.currentLevel);
  });
}

function animateCard(direction = 1) {
  levelCard.animate(
    [
      { opacity: 0.84, transform: `translateX(${direction * 16}px) scale(0.988)` },
      { opacity: 1, transform: "translateX(0) scale(1)" }
    ],
    { duration: 240, easing: "ease-out" }
  );
}

function setLevel(index, direction = 1) {
  state.currentLevel = (index + levelData.length) % levelData.length;
  const level = levelData[state.currentLevel];

  levelName.className = level.titleClass ? level.titleClass : "";
  levelName.textContent = level.name;

  const iconClass = level.statusIcon === "unlock" ? "bx bxs-lock-open-alt" : "bx bxs-lock-alt";
  levelStatus.innerHTML = `<i class="${iconClass}"></i> ${level.status}`;

  levelGem.src = level.gem;
  levelGem.alt = `${level.name} emblem`;
  levelBg.src = level.background;
  levelBg.alt = `${level.name} background`;

  renderDetails(level);
  renderDots();
  animateCard(direction);
}

function nextLevel() {
  setLevel(state.currentLevel + 1, 1);
}

function prevLevel() {
  setLevel(state.currentLevel - 1, -1);
}

let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
  const distance = touchEndX - touchStartX;
  if (Math.abs(distance) < 35) return;
  if (distance < 0) nextLevel();
  else prevLevel();
}

document.getElementById("nextLevel").addEventListener("click", nextLevel);
document.getElementById("prevLevel").addEventListener("click", prevLevel);

document.getElementById("depositBtn").addEventListener("click", () => {
  console.log("Deposit button clicked");
});

document.getElementById("withdrawBtn").addEventListener("click", () => {
  console.log("Withdraw button clicked");
});

swipeArea.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].clientX;
  },
  { passive: true }
);

swipeArea.addEventListener(
  "touchend",
  (event) => {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
  },
  { passive: true }
);

window.assetPageApi = {
  setAssetsValue,
  setLevel,
  getCurrentLevel() {
    return levelData[state.currentLevel];
  },
  getAllLevels() {
    return levelData;
  }
};

createDots();
setAssetsValue(0);
setLevel(0);
