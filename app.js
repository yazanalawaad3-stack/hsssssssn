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
  totalAssets: 0,
  isTransitioning: false,
  isDragging: false,
  activePointerId: null,
  dragStartX: 0,
  dragCurrentX: 0,
  dragOffsetX: 0
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
const nextButton = document.getElementById("nextLevel");
const prevButton = document.getElementById("prevLevel");

function clampLevel(index) {
  return Math.max(0, Math.min(index, levelData.length - 1));
}

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
    dot.addEventListener("click", () => setLevel(index, index > state.currentLevel ? 1 : -1));
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

function updateNavState() {
  prevButton.disabled = state.currentLevel === 0;
  nextButton.disabled = state.currentLevel === levelData.length - 1;
}

function animateCard(direction = 1) {
  const safeDirection = direction === 0 ? 0 : direction > 0 ? 1 : -1;
  levelCard.animate(
    [
      { opacity: 0.84, transform: `translateX(${safeDirection * 16}px) scale(0.988)` },
      { opacity: 1, transform: "translateX(0) scale(1)" }
    ],
    { duration: 240, easing: "ease-out" }
  );
}

function updateDragPosition(offsetX) {
  levelCard.style.transform = `translateX(${offsetX}px)`;
}

function resetDragPosition(animated = true) {
  levelCard.style.transition = animated ? "transform 180ms ease-out" : "none";
  updateDragPosition(0);

  window.setTimeout(() => {
    levelCard.style.transition = "";
  }, 220);
}

function setLevel(index, direction = 1) {
  const nextIndex = clampLevel(index);
  const level = levelData[nextIndex];

  state.currentLevel = nextIndex;

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
  updateNavState();
  resetDragPosition(false);
  animateCard(direction);
}

function withTransitionLock(callback) {
  if (state.isTransitioning) return;

  state.isTransitioning = true;
  callback();

  window.setTimeout(() => {
    state.isTransitioning = false;
  }, 280);
}

function nextLevel() {
  if (state.currentLevel >= levelData.length - 1) {
    resetDragPosition(true);
    return;
  }

  withTransitionLock(() => setLevel(state.currentLevel + 1, 1));
}

function prevLevel() {
  if (state.currentLevel <= 0) {
    resetDragPosition(true);
    return;
  }

  withTransitionLock(() => setLevel(state.currentLevel - 1, -1));
}

function canStartDrag(target) {
  return !target.closest("button, a");
}

function beginDrag(pointerId, clientX) {
  if (state.isTransitioning || state.isDragging) return;

  state.isDragging = true;
  state.activePointerId = pointerId;
  state.dragStartX = clientX;
  state.dragCurrentX = clientX;
  state.dragOffsetX = 0;
  levelCard.style.transition = "none";
  swipeArea.classList.add("dragging");
}

function moveDrag(pointerId, clientX) {
  if (!state.isDragging || state.activePointerId !== pointerId) return;

  state.dragCurrentX = clientX;
  const rawOffset = clientX - state.dragStartX;
  const atFirst = state.currentLevel === 0 && rawOffset > 0;
  const atLast = state.currentLevel === levelData.length - 1 && rawOffset < 0;
  const resistance = atFirst || atLast ? 0.24 : 1;

  state.dragOffsetX = rawOffset * resistance;
  updateDragPosition(state.dragOffsetX);
}

function endDrag(pointerId) {
  if (!state.isDragging || state.activePointerId !== pointerId) return;

  state.isDragging = false;
  state.activePointerId = null;
  swipeArea.classList.remove("dragging");

  const threshold = Math.min(70, swipeArea.clientWidth * 0.18);
  const distance = state.dragOffsetX;

  if (Math.abs(distance) >= threshold) {
    if (distance < 0) {
      nextLevel();
    } else {
      prevLevel();
    }
    return;
  }

  resetDragPosition(true);
}

swipeArea.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (!canStartDrag(event.target)) return;

  beginDrag(event.pointerId, event.clientX);
  swipeArea.setPointerCapture(event.pointerId);
});

swipeArea.addEventListener("pointermove", (event) => {
  moveDrag(event.pointerId, event.clientX);
});

swipeArea.addEventListener("pointerup", (event) => {
  endDrag(event.pointerId);
});

swipeArea.addEventListener("pointercancel", (event) => {
  endDrag(event.pointerId);
});

swipeArea.addEventListener("lostpointercapture", (event) => {
  endDrag(event.pointerId);
});

nextButton.addEventListener("click", nextLevel);
prevButton.addEventListener("click", prevLevel);

document.getElementById("depositBtn").addEventListener("click", () => {
  console.log("Deposit button clicked");
});

document.getElementById("withdrawBtn").addEventListener("click", () => {
  console.log("Withdraw button clicked");
});

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
setLevel(0, 0);
