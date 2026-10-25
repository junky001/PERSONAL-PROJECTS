// ==========================================================
// othoro.js
// ==========================================================

// ---------- 1. Grab elements once ----------
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const galleryImages = document.querySelectorAll(".gallery__item img");

const toTop = document.getElementById("toTop");
const yearSpan = document.getElementById("year");

// ---------- 2. Mobile menu ----------
function setMenu(open) {
    primaryNav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
});

// Close the menu after choosing a link
primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

// Close with the Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
});

// Reset when the window grows back to desktop size
window.matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
});

// ---------- 3. Header shadow and back-to-top button on scroll ----------
function onScroll() {
    const scrolled = window.scrollY > 10;
    header.classList.toggle("is-scrolled", scrolled);
    toTop.classList.toggle("is-visible", window.scrollY > 600);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll(); // run once on load

toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0 });
});

// ---------- 4. Gallery lightbox ----------
galleryImages.forEach((img) => {
    img.closest("button").addEventListener("click", () => {
        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = img.title || img.alt;
        lightbox.showModal();
    });
});

lightboxClose.addEventListener("click", () => lightbox.close());

// Clicking the dark area outside the photo also closes it
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
});

// ---------- 5. Footer year ----------
yearSpan.textContent = new Date().getFullYear();