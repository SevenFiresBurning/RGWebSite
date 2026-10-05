const roles = ["writer", "actor", "producer", "first-woman"];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const roleButtons = [...document.querySelectorAll("[data-role]")];
const mobileLinks = [...document.querySelectorAll("[data-mobile-role]")];
const sections = [...document.querySelectorAll("[data-section]")];
let animationInFlight = false;

function setActiveRole(role) {
  roleButtons.forEach((button) => {
    const active = button.dataset.role === role;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  mobileLinks.forEach((link) => {
    const active = link.dataset.mobileRole === role;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

function makeFallingHat(source, role) {
  const visual = source.querySelector(".hat-visual");
  if (!visual) return null;
  const clone = visual.cloneNode(true);
  clone.classList.add("falling-hat", `falling-${role}`);
  [".hat-crown", ".hat-band", ".hat-brim"].forEach((selector) => {
    const originalPart = visual.querySelector(selector);
    const clonedPart = clone.querySelector(selector);
    if (!originalPart || !clonedPart) return;
    const rendered = getComputedStyle(originalPart);
    clonedPart.style.background = rendered.background;
    clonedPart.style.borderRadius = rendered.borderRadius;
  });
  const sourceRect = visual.getBoundingClientRect();
  const sourceIsVisible = sourceRect.bottom > 0 && sourceRect.top < window.innerHeight;
  clone.style.left = `${sourceIsVisible ? sourceRect.left : window.innerWidth - 110}px`;
  clone.style.top = `${sourceIsVisible ? sourceRect.top : 82}px`;
  clone.style.position = "fixed";
  document.body.append(clone);
  source.classList.add("launching");
  return clone;
}

async function jumpToRole(role, source, animate = true) {
  const target = document.getElementById(role);
  const dock = document.querySelector(`[data-dock="${role}"]`);
  if (!target || !dock) return;
  setActiveRole(role);

  if (prefersReducedMotion.matches || !animate) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    dock.classList.remove("settled");
    requestAnimationFrame(() => dock.classList.add("settled"));
    return;
  }

  if (animationInFlight) return;
  animationInFlight = true;

  const fallingHat = source?.classList.contains("hat-button") ? makeFallingHat(source, role) : null;
  if (!fallingHat) {
    animationInFlight = false;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const release = fallingHat.animate([
    { transform: "translate(0, 0) rotate(0deg) scale(1)" },
    { transform: "translate(-10px, 55px) rotate(12deg) scale(1.02)", offset: .58 },
    { transform: "translate(16px, 125px) rotate(-11deg) scale(.96)" }
  ], { duration: 560, easing: "cubic-bezier(.35,.02,.72,1)", fill: "forwards" });

  await release.finished;
  const releasedRect = fallingHat.getBoundingClientRect();
  release.cancel();
  fallingHat.style.left = `${releasedRect.left}px`;
  fallingHat.style.top = `${releasedRect.top}px`;
  fallingHat.style.transform = "none";

  const carried = fallingHat.animate([
    { transform: "translateY(0) rotate(-11deg) scale(.96)" },
    { transform: `translateY(${Math.max(70, window.innerHeight * .2)}px) rotate(16deg) scale(.82)` }
  ], { duration: 720, easing: "cubic-bezier(.28,.08,.68,1)", fill: "forwards" });
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  await carried.finished;
  const carriedRect = fallingHat.getBoundingClientRect();
  carried.cancel();
  fallingHat.style.left = `${carriedRect.left}px`;
  fallingHat.style.top = `${carriedRect.top}px`;

  const to = dock.getBoundingClientRect();
  const dx = to.left + to.width / 2 - (carriedRect.left + carriedRect.width / 2);
  const dy = to.top + to.height / 2 - (carriedRect.top + carriedRect.height / 2);
  const landing = fallingHat.animate([
    { transform: "translate(0, 0) rotate(-10deg) scale(.9)", opacity: 1 },
    { transform: `translate(${dx * .52}px, ${dy * .42 - 55}px) rotate(17deg) scale(.82)`, opacity: 1, offset: .5 },
    { transform: `translate(${dx}px, ${dy}px) rotate(-5deg) scale(.68)`, opacity: .98 }
  ], { duration: 560, easing: "cubic-bezier(.22,.68,.26,1)", fill: "forwards" });
  await landing.finished;
  fallingHat.remove();
  source?.classList.remove("launching");
  animationInFlight = false;
  dock.classList.remove("settled");
  requestAnimationFrame(() => dock.classList.add("settled"));
}

roleButtons.forEach((button) => button.addEventListener("click", () => jumpToRole(button.dataset.role, button, true)));
mobileLinks.forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  const source = document.querySelector(`.hat-button[data-role="${link.dataset.mobileRole}"]`);
  jumpToRole(link.dataset.mobileRole, source, true);
}));

const sectionVisibility = new Map();
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => sectionVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
  const visible = [...sectionVisibility.entries()].sort((a, b) => b[1] - a[1])[0];
  if (visible?.[1] > 0) setActiveRole(visible[0].dataset.section);
}, { rootMargin: "-20% 0px -55%", threshold: [0, .15, .35, .6] });
sections.forEach((section) => observer.observe(section));

window.addEventListener("keydown", (event) => {
  const current = roleButtons.findIndex((button) => button.classList.contains("active"));
  if (event.altKey && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const next = roles[(Math.max(0, current) + direction + roles.length) % roles.length];
    const source = document.querySelector(`.hat-button[data-role="${next}"]`);
    jumpToRole(next, source, true);
    source?.focus({ preventScroll: true });
  }
});

setActiveRole("writer");

