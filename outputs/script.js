const notes = [
  "Que seu novo ciclo venha leve, lindo e cheio de motivos para sorrir. Eu amo estar do seu lado.",
  "Você é meu carinho preferido, minha paz em forma de pessoa e a melhor parte dos meus dias.",
  "Hoje o mundo comemora você. Eu comemoro a sorte de poder te amar.",
  "Que a vida te devolva em dobro toda a luz que você coloca nas pessoas.",
  "Meu presente favorito ainda é qualquer momento em que eu posso ficar pertinho de você."
];

const noteElement = document.querySelector("#special-note");
const surpriseButton = document.querySelector("#surprise-btn");
const celebrateButton = document.querySelector("#celebrate-btn");
const photoButtons = document.querySelectorAll(".photo-card");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector("#lightbox-close");
const canvas = document.querySelector("#confetti-canvas");
const ctx = canvas.getContext("2d");

let noteIndex = 0;
let confetti = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function makePiece(x = Math.random() * window.innerWidth, y = -20) {
  const colors = ["#c94c66", "#733443", "#326f5f", "#326e91", "#c58a37"];

  return {
    x,
    y,
    size: 6 + Math.random() * 9,
    speed: 1.4 + Math.random() * 2.8,
    drift: -1.2 + Math.random() * 2.4,
    spin: Math.random() * Math.PI,
    spinSpeed: -0.06 + Math.random() * 0.12,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 0.65 + Math.random() * 0.35
  };
}

function drawConfettiPiece(piece) {
  ctx.save();
  ctx.globalAlpha = piece.alpha;
  ctx.translate(piece.x, piece.y);
  ctx.rotate(piece.spin);
  ctx.fillStyle = piece.color;
  ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
  ctx.restore();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confetti.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.spin += piece.spinSpeed;
    drawConfettiPiece(piece);
  });

  confetti = confetti.filter((piece) => piece.y < window.innerHeight + 60);
  requestAnimationFrame(animateConfetti);
}

function burstConfetti(amount = 90) {
  const originX = window.innerWidth / 2;

  for (let index = 0; index < amount; index += 1) {
    confetti.push(makePiece(originX + (-180 + Math.random() * 360), -30 - Math.random() * 140));
  }
}

function burstHearts(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  for (let index = 0; index < 22; index += 1) {
    const heart = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 104;

    heart.className = "heart-pop";
    heart.style.left = `${originX + Math.cos(angle) * distance}px`;
    heart.style.top = `${originY + Math.sin(angle) * distance}px`;
    heart.style.background = index % 4 === 0 ? "#c58a37" : "#c94c66";
    heart.style.animationDelay = `${Math.random() * 140}ms`;
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

function showNextNote() {
  noteIndex = (noteIndex + 1) % notes.length;
  const hide = noteElement.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(10px)" }
    ],
    { duration: 160, easing: "ease-out" }
  );

  hide.onfinish = () => {
    noteElement.textContent = notes[noteIndex];
    noteElement.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 260, easing: "ease-out" }
    );
  };
}

function openLightbox(src) {
  lightboxImage.src = src;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

surpriseButton.addEventListener("click", () => {
  const rect = surpriseButton.getBoundingClientRect();
  showNextNote();
  burstConfetti(110);
  burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

celebrateButton.addEventListener("click", () => {
  burstConfetti(140);
  burstHearts(window.innerWidth / 2, window.innerHeight * 0.42);
});

photoButtons.forEach((button) => {
  button.addEventListener("click", () => openLightbox(button.dataset.photo));
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
burstConfetti(38);
animateConfetti();
