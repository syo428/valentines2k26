// =========================
// Floating hearts background
// =========================
function createFloatingHearts() {
  const container = document.querySelector(".hearts-container");
  if (!container) return;

  const HEARTS_COUNT = 18;

  for (let i = 0; i < HEARTS_COUNT; i++) {
    const heart = document.createElement("span");
    heart.classList.add("heart");
    heart.textContent = "❤";

    const size = 14 + Math.random() * 18;
    const left = Math.random() * 100;
    const duration = 18 + Math.random() * 16;
    const delay = Math.random() * -duration;
    const opacity = 0.3 + Math.random() * 0.4;

    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.opacity = opacity.toString();

    container.appendChild(heart);
  }
}

// =========================
// Scroll animations
// =========================
function setupScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window) || !elements.length) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// =========================
// Music handling
// =========================
function setupMusic() {
  const btnStart = document.getElementById("btn-start-music");
  const softTrack = document.getElementById("music-soft");
  const intenseTrack = document.getElementById("music-intense");
  const finalSection = document.getElementById("final");

  if (!btnStart || !softTrack || !intenseTrack || !finalSection) return;

  let hasStarted = false;
  let isInFinal = false;

  softTrack.volume = 0.6;
  intenseTrack.volume = 0.0;

  btnStart.addEventListener("click", () => {
    // User gesture: required for autoplay on most browsers
    const playPromise = softTrack.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          hasStarted = true;
          btnStart.textContent = "Mettre la musique en pause";
          btnStart.classList.add("is-playing");
        })
        .catch(() => {
          // If autoplay fails, keep the button as is
        });
    } else {
      hasStarted = true;
      btnStart.textContent = "Mettre la musique en pause";
      btnStart.classList.add("is-playing");
    }
  });

  // Toggle music when button clicked again
  btnStart.addEventListener("click", () => {
    if (!hasStarted) return;

    if (!softTrack.paused || !intenseTrack.paused) {
      softTrack.pause();
      intenseTrack.pause();
      btnStart.textContent = "Relancer la musique";
      btnStart.classList.remove("is-playing");
    } else {
      const toPlay = isInFinal ? intenseTrack : softTrack;
      toPlay
        .play()
        .then(() => {
          btnStart.textContent = "Mettre la musique en pause";
          btnStart.classList.add("is-playing");
        })
        .catch(() => {});
    }
  });

  // When reaching the final section, crossfade to intense track
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!hasStarted) return;

          if (entry.isIntersecting) {
            isInFinal = true;
            crossfadeTracks(softTrack, intenseTrack);
          } else {
            isInFinal = false;
            crossfadeTracks(intenseTrack, softTrack);
          }
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(finalSection);
  }
}

function crossfadeTracks(fromTrack, toTrack) {
  const fadeDuration = 2500; // ms
  const steps = 25;
  const stepTime = fadeDuration / steps;

  if (toTrack.paused) {
    toTrack.play().catch(() => {});
  }

  let currentStep = 0;
  const startVolumeFrom = fromTrack.volume;
  const startVolumeTo = toTrack.volume;

  const fadeInterval = setInterval(() => {
    currentStep += 1;
    const progress = Math.min(currentStep / steps, 1);

    fromTrack.volume = startVolumeFrom * (1 - progress);
    toTrack.volume = startVolumeTo + (0.6 - startVolumeTo) * progress;

    if (progress >= 1) {
      clearInterval(fadeInterval);
      fromTrack.pause();
    }
  }, stepTime);
}

// =========================
// Init
// =========================
document.addEventListener("DOMContentLoaded", () => {
  createFloatingHearts();
  setupScrollReveal();
  setupMusic();
});

