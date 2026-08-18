(() => {
  "use strict";

  const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const finePointerQuery = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  );

  const motionAllowed = () =>
    !reduceMotionQuery.matches && finePointerQuery.matches;

  function createDecorativeElement(className) {
    const element = document.createElement("span");
    element.className = className;
    element.setAttribute("aria-hidden", "true");
    return element;
  }

  function initScrollProgress() {
    const progress = createDecorativeElement("motion-scroll-progress");
    document.body.appendChild(progress);

    let frameId = 0;
    const update = () => {
      frameId = 0;
      if (reduceMotionQuery.matches) return;
      const root = document.documentElement;
      const scrollable = Math.max(root.scrollHeight - root.clientHeight, 1);
      const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
      root.style.setProperty("--motion-scroll-progress", ratio.toFixed(4));
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    reduceMotionQuery.addEventListener("change", requestUpdate);
  }

  function initPointerFollower() {
    const glow = createDecorativeElement("motion-cursor-glow");
    const ring = createDecorativeElement("motion-cursor-ring");
    document.body.append(glow, ring);

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let frameId = 0;

    const render = () => {
      ringX += (targetX - ringX) * 0.22;
      ringY += (targetY - ringY) * 0.22;
      glow.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(targetX - ringX) > 0.15 || Math.abs(targetY - ringY) > 0.15) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    };

    const requestRender = () => {
      if (!frameId) frameId = window.requestAnimationFrame(render);
    };

    document.addEventListener(
      "pointermove",
      (event) => {
        if (!motionAllowed()) {
          document.body.classList.remove(
            "motion-pointer-visible",
            "motion-pointer-interactive",
          );
          return;
        }
        if (event.pointerType && event.pointerType !== "mouse") return;
        targetX = event.clientX;
        targetY = event.clientY;
        document.body.classList.add("motion-pointer-visible");
        requestRender();
      },
      { passive: true },
    );

    document.addEventListener("pointerover", (event) => {
      if (!motionAllowed()) return;
      if (!(event.target instanceof Element)) return;
      const candidate = event.target.closest(
        "a, button, input, select, textarea, [role='button'], [tabindex]",
      );
      const interactive =
        candidate &&
        !candidate.matches(":disabled, [aria-disabled='true']");
      document.body.classList.toggle(
        "motion-pointer-interactive",
        Boolean(interactive),
      );
    });

    document.documentElement.addEventListener("mouseleave", () => {
      document.body.classList.remove(
        "motion-pointer-visible",
        "motion-pointer-interactive",
      );
    });
  }

  function initSurfaceSheen() {
    const selector = [
      ".card",
      ".stat-card",
      ".support-card",
      ".review-card",
      ".check-card",
      ".profile-card",
      ".feedback-form",
      ".login-box",
      ".not-found-card",
      ".guide-container .box",
      ".review-summary",
      ".faq-item",
      ".panel",
    ].join(",");

    const ensureSheen = (surface) => {
      if (surface.querySelector(":scope > .motion-sheen")) return;
      surface.classList.add("motion-surface");
      surface.appendChild(createDecorativeElement("motion-sheen"));
    };

    document.querySelectorAll(selector).forEach(ensureSheen);

    let activeSurface = null;
    let pointerX = 0;
    let pointerY = 0;
    let frameId = 0;

    const setActiveSurface = (surface) => {
      if (surface === activeSurface) return;
      activeSurface?.classList.remove("motion-surface-active");
      activeSurface = surface;
      if (activeSurface) {
        ensureSheen(activeSurface);
        activeSurface.classList.add("motion-surface-active");
      }
    };

    const renderSheen = () => {
      frameId = 0;
      if (!activeSurface || !motionAllowed()) return;
      const bounds = activeSurface.getBoundingClientRect();
      activeSurface.style.setProperty(
        "--motion-sheen-x",
        `${pointerX - bounds.left}px`,
      );
      activeSurface.style.setProperty(
        "--motion-sheen-y",
        `${pointerY - bounds.top}px`,
      );
    };

    document.addEventListener("pointerover", (event) => {
      if (!motionAllowed()) return;
      if (event.pointerType && event.pointerType !== "mouse") return;
      if (!(event.target instanceof Element)) return;
      const surface = event.target.closest(selector);
      setActiveSurface(surface);
    });

    document.addEventListener(
      "pointermove",
      (event) => {
        if (!motionAllowed()) {
          setActiveSurface(null);
          return;
        }
        if (event.pointerType && event.pointerType !== "mouse") return;
        if (!(event.target instanceof Element)) return;
        const surface = event.target.closest(selector);
        setActiveSurface(surface);
        if (!surface) return;

        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!frameId) frameId = window.requestAnimationFrame(renderSheen);
      },
      { passive: true },
    );

    document.addEventListener(
      "pointerout",
      (event) => {
        if (!activeSurface || !(event.target instanceof Element)) return;
        if (
          event.relatedTarget instanceof Node &&
          activeSurface.contains(event.relatedTarget)
        ) {
          return;
        }
        if (activeSurface.contains(event.target)) setActiveSurface(null);
      },
      { passive: true },
    );

    window.addEventListener("blur", () => setActiveSurface(null));
  }

  function createParticleBurst(x, y) {
    const colors = ["#0f8f83", "#2fc7b3", "#ffd447", "#ffffff"];
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      const distance = 24 + (index % 3) * 7;
      const particle = createDecorativeElement("motion-particle");
      particle.style.setProperty("--motion-start-x", `${x - 3}px`);
      particle.style.setProperty("--motion-start-y", `${y - 3}px`);
      particle.style.setProperty(
        "--motion-dx",
        `${Math.cos(angle) * distance}px`,
      );
      particle.style.setProperty(
        "--motion-dy",
        `${Math.sin(angle) * distance}px`,
      );
      particle.style.background = colors[index % colors.length];
      particle.addEventListener("animationend", () => particle.remove(), {
        once: true,
      });
      window.setTimeout(() => particle.remove(), 800);
      fragment.appendChild(particle);
    }

    document.body.appendChild(fragment);
  }

  function initClickFeedback() {
    const clickableSelector = [
      "button",
      ".nav-links a",
      ".logo",
      ".auth-nav-link",
      ".kiemtra",
      ".btn-primary",
      ".btn-login",
      ".btn-feedback",
      ".login-btn",
      ".settings-link",
      ".feedback-links a",
      ".chip",
      ".tab-btn",
    ].join(",");

    let lastFeedbackAt = 0;

    document.addEventListener("pointerdown", (event) => {
      if (
        !motionAllowed() ||
        event.button !== 0 ||
        (event.pointerType && event.pointerType !== "mouse")
      ) {
        return;
      }

      if (!(event.target instanceof Element)) return;
      const target = event.target.closest(clickableSelector);
      if (!target || target.matches(":disabled, [aria-disabled='true']")) return;

      const now = window.performance.now();
      if (now - lastFeedbackAt < 80) return;
      lastFeedbackAt = now;

      const bounds = target.getBoundingClientRect();
      const size = Math.max(bounds.width, bounds.height) * 2.2;
      const ripple = createDecorativeElement("motion-ripple");
      ripple.style.setProperty("--motion-ripple-size", `${size}px`);
      ripple.style.setProperty("--motion-ripple-x", `${event.clientX}px`);
      ripple.style.setProperty("--motion-ripple-y", `${event.clientY}px`);
      ripple.addEventListener("animationend", () => ripple.remove(), {
        once: true,
      });
      window.setTimeout(() => ripple.remove(), 800);
      document.body.appendChild(ripple);

      createParticleBurst(event.clientX, event.clientY);
    });
  }

  function initMotion() {
    initScrollProgress();
    initPointerFollower();
    initSurfaceSheen();
    initClickFeedback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMotion, { once: true });
  } else {
    initMotion();
  }
})();
