// ==========================================================
// admissions.js
// ==========================================================

// ---------- 1. Grab elements once ----------
const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

const form = document.getElementById("admissionForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

const yearSpan = document.getElementById("year");

// ---------- 2. Mobile menu (same as the home page) ----------
function setMenu(open) {
    primaryNav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
});

window.matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
});

// ---------- 3. Header shadow on scroll ----------
function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- 4. Footer year ----------
yearSpan.textContent = new Date().getFullYear();

// ---------- 5. Validation ----------
// Each rule returns an error message, or "" when the value is fine.
// The key must match the field's id (and its error box id: <id>-error).
const rules = {
    firstName(value) {
        if (!value) return "Enter the student's first name.";
        if (!/^[\p{L}][\p{L}' -]+$/u.test(value)) return "Use letters only (at least 2).";
        return "";
    },
    lastName(value) {
        if (!value) return "Enter the student's last name.";
        if (!/^[\p{L}][\p{L}' -]+$/u.test(value)) return "Use letters only (at least 2).";
        return "";
    },
    kcpeScore(value) {
        if (!value) return "Enter the KCPE score.";
        const score = Number(value);
        if (!Number.isInteger(score) || score < 0 || score > 500) {
            return "Enter a whole number from 0 to 500.";
        }
        return "";
    },
    kcpeIndex(value) {
        if (!value) return "Enter the KCPE index number.";
        // Digits only, 8 to 12 long. Change the numbers if your format differs.
        if (!/^\d{8,12}$/.test(value)) return "Use digits only, 8 to 12 numbers.";
        return "";
    },
    grade(value) {
        if (!value) return "Select the grade.";
        return "";
    },
    guardianName(value) {
        if (!value) return "Enter the parent or guardian's names.";
        if (value.length < 3) return "Enter the full names.";
        return "";
    },
    guardianPhone(value) {
        if (!value) return "Enter the parent or guardian's phone number.";
        if (!/^\+?[0-9\s-]{9,15}$/.test(value)) return "Enter a valid phone number, e.g. 0712 345 678.";
        return "";
    },
};

function validateField(name) {
    const input = document.getElementById(name);
    const errorBox = document.getElementById(`${name}-error`);
    const message = rules[name](input.value.trim());

    errorBox.textContent = message;
    input.classList.toggle("is-invalid", message !== "");
    input.setAttribute("aria-invalid", String(message !== ""));
    return message === "";
}

// Check a field when the user leaves it, and re-check while typing once it's invalid
Object.keys(rules).forEach((name) => {
    const input = document.getElementById(name);
    input.addEventListener("blur", () => validateField(name));
    input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => {
        if (input.tagName === "SELECT" || input.classList.contains("is-invalid")) {
            validateField(name);
        }
    });
});

// ---------- 6. Submit ----------
function setStatus(message, isError) {
    formStatus.textContent = message;
    formStatus.classList.toggle("is-error", Boolean(isError));
}

form.addEventListener("submit", (event) => {
    // Check every field (no short-circuit, so all errors show at once)
    const results = Object.keys(rules).map(validateField);

    if (!results.every(Boolean)) {
        event.preventDefault();
        setStatus("Fix the highlighted fields and try again.", true);
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    setStatus("Submitting...", false);
    submitBtn.disabled = true;
    // The form now submits normally to the action URL in admissions.html
});

// If the user presses Back after submitting, re-enable the button
window.addEventListener("pageshow", () => {
    submitBtn.disabled = false;
    setStatus("", false);
});