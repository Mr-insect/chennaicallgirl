"use strict";

/* ========== SETTINGS ========== */

const CONFIG = {
  countryCode: "91",
  callNumber: "7375830372",
  whatsappNumber: "7375830372",
  telegramUsername: "mstsaalon",
  whatsappMessage: "Hello Chennai Call Girl, ",
  imageExtension: "jpg",
  galleryCount: 15,
  groupSize: 5,
  galleryNotes: ["", "", ""],
};

/* ========== CONTACT LINKS ========== */

function getPhoneNumber(number) {
  return String(number).replace(/\D/g, "");
}

function getCallUrl() {
  return `tel:+${CONFIG.countryCode}${getPhoneNumber(CONFIG.callNumber)}`;
}

function getWhatsAppUrl() {
  const number = `${CONFIG.countryCode}${getPhoneNumber(CONFIG.whatsappNumber)}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
}

function getTelegramUrl() {
  const username = CONFIG.telegramUsername.replace(/^@/, "").trim();
  return `https://t.me/${encodeURIComponent(username)}`;
}

function initializeContactLinks() {
  document.querySelectorAll("[data-call]").forEach((link) => {
    link.href = getCallUrl();
  });

  document.querySelectorAll("[data-wa]").forEach((link) => {
    link.href = getWhatsAppUrl();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-tg]").forEach((link) => {
    link.href = getTelegramUrl();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const dockCall = document.getElementById("dockCall");
  const dockWa = document.getElementById("dockWa");

  if (dockCall) dockCall.textContent = "Call Now";
  if (dockWa) dockWa.textContent = "WhatsApp";
}

/* ========== FEATURE IMAGES ========== */

function initializeFeatureImages() {
  const containers = document.querySelectorAll(".fimg[data-src]");

  containers.forEach((container) => {
    const source = container.dataset.src;

    if (!source) return;

    const image = document.createElement("img");
    image.src = source;
    image.alt = "Gallery feature photo";
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("load", () => {
      const placeholder = container.querySelector(".ph");
      if (placeholder) placeholder.remove();
    });

    image.addEventListener("error", () => {
      image.remove();
    });

    container.appendChild(image);
  });
}

/* ========== GALLERY ========== */

const galleryImages = Array.from(
  { length: CONFIG.galleryCount },
  (_, index) => `images/${index + 1}.${CONFIG.imageExtension}`
);

const galleryRoot = document.getElementById("groups");

function createGalleryTile(source, index) {
  const tile = document.createElement("div");
  tile.className = "tile";

  const openButton = document.createElement("button");
  openButton.className = "open";
  openButton.type = "button";
  openButton.setAttribute("aria-label", `Open photo ${index + 1}`);

  const image = document.createElement("img");
  image.src = source;
  image.alt = `Gallery photo ${index + 1}`;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener("error", () => {
    image.remove();
    openButton.textContent = "Photo unavailable";
    openButton.disabled = true;
  });

  openButton.appendChild(image);
  openButton.addEventListener("click", () => openLightbox(index));

  tile.appendChild(openButton);

  const actions = document.createElement("div");
  actions.className = "tbtns";

  const callLink = document.createElement("a");
  callLink.className = "tb";
  callLink.href = getCallUrl();
  callLink.setAttribute("aria-label", "Call now");
  callLink.textContent = "☎";

  const whatsappLink = document.createElement("a");
  whatsappLink.className = "tb w";
  whatsappLink.href = getWhatsAppUrl();
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  whatsappLink.setAttribute("aria-label", "Contact on WhatsApp");
  whatsappLink.textContent = "✉";

  actions.append(callLink, whatsappLink);
  tile.appendChild(actions);

  return tile;
}

function initializeGallery() {
  if (!galleryRoot) return;

  galleryRoot.replaceChildren();

  const totalGroups = Math.ceil(
    galleryImages.length / CONFIG.groupSize
  );

  for (let groupIndex = 0; groupIndex < totalGroups; groupIndex++) {
    const grid = document.createElement("div");
    grid.className = "grid";

    const start = groupIndex * CONFIG.groupSize;
    const end = Math.min(
      start + CONFIG.groupSize,
      galleryImages.length
    );

    for (let index = start; index < end; index++) {
      grid.appendChild(
        createGalleryTile(galleryImages[index], index)
      );
    }

    galleryRoot.appendChild(grid);

    const note = CONFIG.galleryNotes[groupIndex];

    if (note && note.trim()) {
      const paragraph = document.createElement("p");
      paragraph.className = "gnote";
      paragraph.textContent = note;
      galleryRoot.appendChild(paragraph);
    } else if (groupIndex < totalGroups - 1) {
      const spacing = document.createElement("div");
      spacing.className = "gnote";
      spacing.setAttribute("aria-hidden", "true");
      galleryRoot.appendChild(spacing);
    }
  }
}

/* ========== LIGHTBOX ========== */

const lightbox = document.getElementById("lb");
const lightboxStage = document.getElementById("lbStage");
const lightboxClose = document.getElementById("lbX");
const lightboxPrevious = document.getElementById("lbP");
const lightboxNext = document.getElementById("lbN");

let activePhotoIndex = 0;
let lastFocusedElement = null;

function renderLightboxPhoto() {
  if (!lightboxStage || galleryImages.length === 0) return;

  const image = document.createElement("img");
  image.src = galleryImages[activePhotoIndex];
  image.alt = `Gallery photo ${activePhotoIndex + 1}`;
  image.decoding = "async";

  image.addEventListener("error", () => {
    const message = document.createElement("p");
    message.textContent = "Photo could not be loaded.";
    message.style.textAlign = "center";
    lightboxStage.replaceChildren(message);
  });

  lightboxStage.replaceChildren(image);
}

function openLightbox(index) {
  if (!lightbox || galleryImages.length === 0) return;

  lastFocusedElement = document.activeElement;
  activePhotoIndex = index;

  renderLightboxPhoto();

  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.hidden = true;
  document.body.style.overflow = "";

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

function changeLightboxPhoto(direction) {
  if (galleryImages.length === 0) return;

  activePhotoIndex =
    (activePhotoIndex + direction + galleryImages.length) %
    galleryImages.length;

  renderLightboxPhoto();
}

function initializeLightbox() {
  if (!lightbox) return;

  lightboxClose?.addEventListener("click", closeLightbox);

  lightboxPrevious?.addEventListener("click", () => {
    changeLightboxPhoto(-1);
  });

  lightboxNext?.addEventListener("click", () => {
    changeLightboxPhoto(1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      changeLightboxPhoto(-1);
    } else if (event.key === "ArrowRight") {
      changeLightboxPhoto(1);
    } else if (event.key === "Tab") {
      const controls = [
        lightboxClose,
        lightboxPrevious,
        lightboxNext,
      ].filter((element) => element instanceof HTMLElement);

      if (controls.length === 0) return;

      const first = controls[0];
      const last = controls[controls.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  let touchStartX = 0;

  lightboxStage?.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  lightboxStage?.addEventListener(
    "touchend",
    (event) => {
      const difference =
        event.changedTouches[0].screenX - touchStartX;

      if (Math.abs(difference) < 50) return;

      changeLightboxPhoto(difference < 0 ? 1 : -1);
    },
    { passive: true }
  );
}

/* ========== FOOTER MARQUEE ========== */

function initializeMarquee() {
  const track = document.getElementById("track");
  if (!track) return;

  const items = [
    "Chennai Call Girl",
    "T. Nagar",
    "Adyar",
    "Nandanam",
    "R A Puram",
  ];

  const fragment = document.createDocumentFragment();

  for (let repeat = 0; repeat < 2; repeat++) {
    items.forEach((item) => {
      const span = document.createElement("span");

      const text = document.createTextNode(item);
      const separator = document.createElement("i");
      separator.textContent = "✦";

      span.append(text, separator);
      fragment.appendChild(span);
    });
  }

  track.replaceChildren(fragment);
}

/* ========== FOOTER YEAR ========== */

function initializeFooterYear() {
  const yearElement = document.getElementById("yr");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
}

/* ========== INITIALIZE ========== */

function initializeWebsite() {
  initializeContactLinks();
  initializeFeatureImages();
  initializeGallery();
  initializeLightbox();
  initializeMarquee();
  initializeFooterYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite, {
    once: true,
  });
} else {
  initializeWebsite();
}