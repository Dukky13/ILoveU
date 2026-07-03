const body = document.body;
const experience = document.querySelector("#experience");
const enterButton = document.querySelector("#enterButton");
const revealElements = document.querySelectorAll(".reveal");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const magneticElements = document.querySelectorAll(".magnetic");
const celebrationLayer = document.querySelector("#celebrationLayer");

const editableLetter = "Olá amorrr, 3 meses, nem acreditoo. E tenho amado este tempocontigo, tu és simplesmente uma namorada perfeita, PERFEITA. Eu quero mesmo te agradecer de como me tratas todos os dia e como tu me fazes sentir";

enterButton.addEventListener("click", () => {
  body.classList.add("entered");
  experience.setAttribute("aria-hidden", "false");
  setTimeout(() => document.querySelector("#hero").scrollIntoView({ behavior: "smooth" }), 450);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealElements.forEach((element) => revealObserver.observe(element));

document.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  cursorDot.style.left = `${clientX}px`;
  cursorDot.style.top = `${clientY}px`;
  cursorRing.animate({ left: `${clientX}px`, top: `${clientY}px` }, { duration: 420, fill: "forwards" });

  document.querySelectorAll("[data-parallax]").forEach((element) => {
    const strength = Number(element.dataset.parallax);
    const x = (clientX - window.innerWidth / 2) * strength;
    const y = (clientY - window.innerHeight / 2) * strength;
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
});

document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("mouseenter", () => cursorRing.classList.add("is-hovering"));
  element.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hovering"));
});

magneticElements.forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
  });
});

document.querySelectorAll(".ripple").forEach((element) => {
  element.addEventListener("click", (event) => {
    const rect = element.getBoundingClientRect();
    const ink = document.createElement("span");
    const size = Math.max(rect.width, rect.height);

    ink.className = "ink";
    ink.style.width = `${size}px`;
    ink.style.height = `${size}px`;
    ink.style.left = `${event.clientX - rect.left - size / 2}px`;
    ink.style.top = `${event.clientY - rect.top - size / 2}px`;
    element.appendChild(ink);
    ink.addEventListener("animationend", () => ink.remove());
  });
});

document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("is-flipped"));
});

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");

document.querySelectorAll(".photo-card").forEach((card) => {
  card.addEventListener("click", () => {
    lightboxImage.style.backgroundImage = `url("${card.dataset.image}")`;
    lightboxTitle.textContent = card.dataset.title;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

document.querySelector("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const counter = document.querySelector(".counter");
const startDate = new Date(counter.dataset.startDate);

function getDateParts(start, end) {
  if (end < start) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let years = end.getFullYear() - start.getFullYear();
  let yearAnchor = new Date(start);
  yearAnchor.setFullYear(start.getFullYear() + years);

  if (yearAnchor > end) {
    years -= 1;
    yearAnchor = new Date(start);
    yearAnchor.setFullYear(start.getFullYear() + years);
  }

  let months = 0;
  let monthAnchor = new Date(yearAnchor);

  while (months < 11) {
    const nextMonth = new Date(monthAnchor);
    nextMonth.setMonth(monthAnchor.getMonth() + 1);
    if (nextMonth > end) break;
    monthAnchor = nextMonth;
    months += 1;
  }

  const totalSeconds = Math.floor((end - monthAnchor) / 1000);

  return {
    years,
    months,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  };
}

function updateCounter() {
  const now = new Date();
  const { years, months, days, hours, minutes, seconds } = getDateParts(startDate, now);

  document.querySelector("#years").textContent = years;
  document.querySelector("#months").textContent = months;
  document.querySelector("#days").textContent = days;
  document.querySelector("#hours").textContent = hours;
  document.querySelector("#minutes").textContent = minutes;
  document.querySelector("#seconds").textContent = seconds;
}

updateCounter();
setInterval(updateCounter, 1000);

const typedLetter = document.querySelector("#typedLetter");
let letterIndex = 0;

function typeLetter() {
  if (letterIndex <= editableLetter.length) {
    typedLetter.textContent = editableLetter.slice(0, letterIndex);
    letterIndex += 1;
    setTimeout(typeLetter, 34);
  }
}

const letterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    typeLetter();
    letterObserver.disconnect();
  }
}, { threshold: 0.35 });

letterObserver.observe(document.querySelector(".letter"));

document.querySelector("#letterButton").addEventListener("click", () => {
  document.querySelector("#letterMore").classList.add("is-visible");
  document.querySelector("#letterButton").style.display = "none";
});

document.querySelector("#capsuleButton").addEventListener("click", () => {
  document.querySelector("#capsuleMessage").classList.add("is-open");
});

document.querySelector("#finalButton").addEventListener("click", () => {
  document.querySelector("#finalMessage").classList.add("is-visible");
  launchCelebration();
});

function launchCelebration() {
  celebrationLayer.innerHTML = "";
  const colors = ["#f7a9c2", "#c94d78", "#d9a83f", "#ffffff", "#ffd2e1"];

  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement("span");
    piece.className = index % 4 === 0 ? "falling-heart" : "confetti";
    piece.textContent = piece.className === "falling-heart" ? "❤️" : "";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = piece.className === "confetti" ? colors[index % colors.length] : "transparent";
    piece.style.animationDuration = `${2.4 + Math.random() * 2.4}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    celebrationLayer.appendChild(piece);
  }

  setTimeout(() => {
    celebrationLayer.innerHTML = "";
  }, 6200);
}
