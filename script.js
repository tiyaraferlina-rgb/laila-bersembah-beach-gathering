const body = document.body;
const openButton = document.getElementById("openInvitation");
const openingScreen = document.getElementById("openingScreen");
const mainContent = document.getElementById("mainContent");
const music = document.getElementById("bgMusic");
const musicPlayer = document.getElementById("musicPlayer");
const musicStatus = document.getElementById("musicStatus");
const musicToggle = document.getElementById("musicToggle");
const musicPrev = document.getElementById("musicPrev");
const musicNext = document.getElementById("musicNext");
const musicMute = document.getElementById("musicMute");
const backToTop = document.getElementById("backToTop");
const countdown = document.getElementById("countdown");
const scrollProgressBar = document.getElementById("scrollProgressBar");
const parallaxNodes = Array.from(
  document.querySelectorAll(
    ".luxury-beam, .sparkle, .petal, .opening-chip, .opening-ribbon span, .glow-streak, .corner-flower, .floating-fruit, .drink-illustration, .closing-disco, .scene-postcard, .scene-stamp, .scene-palm-shadow, .scene-shell, .scene-wave, .scene-cocktail, .scene-citrus, .scene-ball, .sign-post, .sand-dune, .memory-note, .memory-flower, .scene-glitter, .scene-note, .scene-map, .scene-ribbon, .scene-flowers",
  ),
);

let hasOpened = false;
let parallaxFrame = null;
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const burst = (sourceElement, count = 10) => {
  if (!sourceElement) {
    return;
  }

  const rect = sourceElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / count;
    const distance = 18 + Math.random() * 32;
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance - 8;

    particle.className = "burst-particle";
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.setProperty("--dx", `${offsetX.toFixed(2)}px`);
    particle.style.setProperty("--dy", `${offsetY.toFixed(2)}px`);
    particle.style.setProperty(
      "--rot",
      `${(Math.random() * 180 - 90).toFixed(2)}deg`,
    );
    particle.style.width = `${8 + Math.random() * 8}px`;
    particle.style.height = particle.style.width;

    document.body.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1000);
  }
};

// Subtle parallax keeps the invitation feeling alive without heavy runtime cost.
const updateParallax = () => {
  if (reduceMotion) {
    parallaxFrame = null;
    return;
  }

  const scrollY = window.scrollY;
  const viewport = Math.max(window.innerHeight, 1);

  parallaxNodes.forEach((element, index) => {
    const depth = (index % 6) + 1;

    // Scroll-only drift (no pointer tracking) for an elegant, non-chaotic feel.
    const driftX =
      Math.sin(scrollY / 320 + index * 0.35) * (1.5 + depth * 0.55);
    const driftY =
      Math.sin(scrollY / 240 + index * 0.55) * (2.0 + depth * 1.05) +
      (scrollY / viewport) * depth * 1.0;

    element.style.translate = `${driftX.toFixed(2)}px ${driftY.toFixed(2)}px`;
  });

  parallaxFrame = null;
};

const scheduleParallax = () => {
  if (parallaxFrame !== null) {
    return;
  }

  parallaxFrame = window.requestAnimationFrame(updateParallax);
};

const updateScrollProgress = () => {
  if (!scrollProgressBar) {
    return;
  }

  const root = document.documentElement;
  const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
  scrollProgressBar.style.width = `${(progress * 100).toFixed(2)}%`;
};

const setMusicState = () => {
  if (!musicToggle || !music) {
    return;
  }

  const isPaused = music.paused;
  musicToggle.classList.toggle("is-paused", isPaused);
  if (musicMute) {
    musicMute.classList.toggle("is-muted", music.muted);
    musicMute.setAttribute(
      "aria-label",
      music.muted ? "Unmute music" : "Mute music",
    );
    musicMute.textContent = music.muted ? "✕" : "♪";
  }
  if (musicStatus) {
    musicStatus.textContent = isPaused
      ? "Paused"
      : music.muted
        ? "Muted"
        : "Now Playing";
  }
  musicToggle.setAttribute(
    "aria-label",
    isPaused ? "Play background music" : "Pause background music",
  );
};

const tryPlayMusic = async () => {
  if (!music || !musicToggle) {
    return;
  }

  musicToggle.hidden = false;
  music.load();

  try {
    await music.play();
  } catch (error) {
    musicToggle.classList.add("is-paused");
  }

  setMusicState();
};

const openInvitation = () => {
  if (hasOpened) {
    return;
  }

  hasOpened = true;
  body.classList.add("invitation-open");
  burst(openButton, 14);
  tryPlayMusic();

  window.setTimeout(() => {
    mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
    openingScreen.setAttribute("aria-hidden", "true");
  }, 520);
};

openButton.addEventListener("click", openInvitation);

if (music) {
  music.addEventListener("play", setMusicState);
  music.addEventListener("pause", setMusicState);
  music.addEventListener("volumechange", setMusicState);
  music.addEventListener("error", () => {
    if (musicToggle) {
      musicToggle.hidden = true;
    }
  });
}

if (musicToggle) {
  musicToggle.addEventListener("click", async () => {
    if (!music) {
      return;
    }

    burst(musicToggle, 8);

    if (music.paused) {
      try {
        await music.play();
      } catch (error) {
        musicToggle.classList.add("is-paused");
      }
    } else {
      music.pause();
    }

    setMusicState();
  });
}

if (musicPrev) {
  musicPrev.addEventListener("click", () => {
    if (!music) {
      return;
    }

    burst(musicPrev, 6);
    music.currentTime = 0;
    if (!music.paused) {
      music.play().catch(() => undefined);
    }
    setMusicState();
  });
}

if (musicNext) {
  musicNext.addEventListener("click", () => {
    if (!music) {
      return;
    }

    burst(musicNext, 6);
    music.currentTime = 0;
    if (!music.paused) {
      music.play().catch(() => undefined);
    }
    setMusicState();
  });
}

if (musicMute) {
  musicMute.addEventListener("click", () => {
    if (!music) {
      return;
    }

    burst(musicMute, 8);
    music.muted = !music.muted;
    setMusicState();
  });
}

const padNumber = (value) => String(value).padStart(2, "0");

const updateCountdown = () => {
  if (!countdown) {
    return;
  }

  const target = new Date(countdown.dataset.target).getTime();
  const now = Date.now();
  const gap = target - now;

  if (Number.isNaN(target)) {
    return;
  }

  if (gap <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    countdown.setAttribute("aria-label", "The gathering day has arrived");
    return;
  }

  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const days = Math.floor(gap / day);
  const hours = Math.floor((gap % day) / hour);
  const minutes = Math.floor((gap % hour) / minute);
  const seconds = Math.floor((gap % minute) / 1000);

  document.getElementById("days").textContent = padNumber(days);
  document.getElementById("hours").textContent = padNumber(hours);
  document.getElementById("minutes").textContent = padNumber(minutes);
  document.getElementById("seconds").textContent = padNumber(seconds);
};

updateCountdown();
window.setInterval(updateCountdown, 1000);

// Reveal sections only when they enter the viewport.
const revealElements = document.querySelectorAll(".reveal, .reveal-item");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const toggleBackToTop = () => {
  if (!backToTop) {
    return;
  }

  backToTop.classList.toggle("is-visible", window.scrollY > 520);
};

window.addEventListener("scroll", toggleBackToTop, { passive: true });
window.addEventListener("scroll", scheduleParallax, { passive: true });
window.addEventListener("scroll", updateScrollProgress, { passive: true });
// Pointer tracking intentionally removed for desktop elegance.
// Decorations should react subtly to scroll only, not the user's cursor.

toggleBackToTop();
scheduleParallax();
updateScrollProgress();

window.addEventListener("resize", updateScrollProgress, { passive: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(() => body.classList.add("is-loaded"), 60);
  });
} else {
  window.setTimeout(() => body.classList.add("is-loaded"), 60);
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (musicPlayer && music) {
  musicPlayer.addEventListener("pointerenter", scheduleParallax);
  musicPlayer.addEventListener("pointermove", scheduleParallax);
}
