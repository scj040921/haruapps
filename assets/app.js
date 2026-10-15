(() => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#navigation");
  const setMenu = (open) => {
    menu?.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("is-open", open);
  };
  menu?.addEventListener("click", () =>
    setMenu(menu.getAttribute("aria-expanded") !== "true"),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  function initFilters(signal) {
    const filters = document.querySelector("[data-filter-scope]");
    if (!filters) return;
    const scope = filters.dataset.filterScope;
    const allowed = {
      software: ["all", "resume-studio", "haruphoto"],
      channel: ["stable", "nightly"],
      platform: ["all", "windows", "android"],
    };
    const params = new URLSearchParams(location.search);
    const state = {
      software: "all",
      channel: "stable",
      platform: "all",
      q: params.get("q") || "",
    };
    for (const key of Object.keys(allowed))
      if (allowed[key].includes(params.get(key))) state[key] = params.get(key);
    const input = document.querySelector("#guide-search");
    if (input) input.value = state.q;
    const summary = document.querySelector("[data-results]");
    const empty = document.querySelector("[data-empty]");
    function update(pushUrl = true) {
      filters
        .querySelectorAll("[data-filter]")
        .forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            String(state[button.dataset.filter] === button.dataset.value),
          ),
        );
      let count = 0;
      if (scope === "downloads") {
        document.querySelectorAll("[data-download-card]").forEach((card) => {
          const matches =
            (state.software === "all" ||
              card.dataset.product === state.software) &&
            card.dataset.channel === state.channel;
          let visibleFiles = 0;
          card.querySelectorAll("[data-platform]").forEach((file) => {
            file.hidden = !(
              state.platform === "all" ||
              file.dataset.platform === state.platform
            );
            if (!file.hidden) visibleFiles++;
          });
          card.hidden = !matches || !visibleFiles;
          if (!card.hidden) count += visibleFiles;
        });
        const notice = document.querySelector(".nightly-notice");
        if (notice) notice.hidden = state.channel !== "nightly";
        if (summary)
          summary.textContent = `找到 ${count} 个${state.channel === "nightly" ? "测试版" : "正式版"}安装包`;
      } else if (scope === "guides") {
        const tokens = state.q
          .toLocaleLowerCase()
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        document.querySelectorAll("[data-guide]").forEach((card) => {
          const matches =
            (state.software === "all" ||
              card.dataset.product === state.software ||
              card.dataset.product === "all") &&
            tokens.every((word) => card.dataset.search.includes(word));
          card.hidden = !matches;
          if (matches) count++;
        });
        if (summary)
          summary.textContent = `共 ${count} 篇教程${state.q ? ` · 搜索「${state.q}」` : ""}`;
      } else if (scope === "updates") {
        document.querySelectorAll("[data-release]").forEach((card) => {
          card.hidden = !(
            (state.software === "all" ||
              card.dataset.product === state.software) &&
            card.dataset.channel === state.channel
          );
          if (!card.hidden) count++;
        });
        if (summary)
          summary.textContent = `共 ${count} 条${state.channel === "nightly" ? "测试版" : "正式版"}更新记录`;
      }
      if (empty) empty.hidden = count > 0;
      if (pushUrl) {
        const next = new URL(location.href);
        for (const [key, value] of Object.entries(state)) {
          const defaultValue = {
            software: "all",
            channel: "stable",
            platform: "all",
            q: "",
          }[key];
          if (value !== defaultValue) next.searchParams.set(key, value);
          else next.searchParams.delete(key);
        }
        history.replaceState(history.state, "", next);
      }
    }
    filters.addEventListener(
      "click",
      (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        const { filter, value } = button.dataset;
        if (!allowed[filter]?.includes(value)) return;
        state[filter] = value;
        update();
      },
      { signal },
    );
    input?.addEventListener(
      "input",
      () => {
        state.q = input.value;
        update();
      },
      { signal },
    );
    document.querySelector("[data-reset]")?.addEventListener(
      "click",
      () => {
        Object.assign(state, {
          software: "all",
          channel: "stable",
          platform: "all",
          q: "",
        });
        if (input) input.value = "";
        update();
      },
      { signal },
    );
    update(false);
  }

  let toastTimeout;
  const notify = (message) => {
    const toast = document.querySelector(".toast");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.hidden = true;
    }, 3500);
  };
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      notify("SHA-256 校验值已复制");
    } catch {
      const code = button.parentElement.querySelector("code");
      if (code) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      notify("请复制已选中的校验值");
    }
  });

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  let lifecycle = new AbortController();
  let pageAnimation;

  function initShowcase(signal) {
    document.querySelectorAll("[data-story]").forEach((stage) => {
      const scenes = [...stage.querySelectorAll(".story-scene")];
      const buttons = [...stage.querySelectorAll("[data-scene]")];
      if (scenes.length < 2) return;
      stage.classList.add("story-interactive");
      const select = (index) => {
        scenes.forEach((scene, i) => {
          scene.classList.toggle("is-current", i === index);
          scene.inert = i !== index;
          scene.setAttribute("aria-hidden", String(i !== index));
        });
        buttons.forEach((button, i) =>
          button.setAttribute("aria-pressed", String(i === index)),
        );
      };
      select(
        Math.max(
          0,
          buttons.findIndex(
            (button) => button.getAttribute("aria-pressed") === "true",
          ),
        ),
      );
      stage.addEventListener(
        "click",
        (event) => {
          const button = event.target.closest("[data-scene]");
          if (button) select(Number(button.dataset.scene));
        },
        { signal },
      );
    });
  }

  function initMotion(signal) {
    const main = document.querySelector("main");
    if (!main) return;
    if (reducedMotion.matches) return;
    const targets = main.querySelectorAll(
      ".section-heading, .product-card, .feature-grid article, .principles > div, .closing-section, .getting-started",
    );
    if ("IntersectionObserver" in window) {
      const reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              reveal.unobserve(entry.target);
            }
        },
        { threshold: 0.08, rootMargin: "0px 0px 24px 0px" },
      );
      for (const target of targets) {
        target.classList.add("reveal-ready");
        reveal.observe(target);
      }
      signal.addEventListener("abort", () => reveal.disconnect(), {
        once: true,
      });
    }
  }

  function initPage(animate = false) {
    lifecycle.abort();
    lifecycle = new AbortController();
    initFilters(lifecycle.signal);
    initShowcase(lifecycle.signal);
    initMotion(lifecycle.signal);
    pageAnimation?.cancel();
    if (animate && !reducedMotion.matches) {
      pageAnimation = document.querySelector("main").animate(
        [
          { opacity: 0.65, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 210, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }
  }

  function initNavigation() {
    const base = document.querySelector('meta[name="haru-base"]')?.content;
    if (!base || !("fetch" in window) || !("DOMParser" in window)) return;
    const build = document.querySelector('meta[name="haru-build"]')?.content;
    const cache = new Map([
      [location.pathname, document.documentElement.outerHTML],
    ]);
    const pending = new Map();
    const connection = navigator.connection;
    const canPrefetch = () =>
      !connection?.saveData &&
      !/^(slow-)?2g$/.test(connection?.effectiveType || "");
    let sequence = 0;
    let intentTimer;
    let progressTimer;
    let idleTask;
    let displayedKey = history.state?.haruKey || crypto.randomUUID();
    const positions = new Map();
    history.scrollRestoration = "manual";
    history.replaceState(
      { ...history.state, haruKey: displayedKey, haruScroll: scrollY },
      "",
    );
    const remember = (path, html) => {
      cache.delete(path);
      cache.set(path, html);
      if (cache.size > 8) cache.delete(cache.keys().next().value);
    };
    async function load(url) {
      if (cache.has(url.pathname)) return cache.get(url.pathname);
      if (pending.has(url.pathname)) return pending.get(url.pathname);
      const request = (async () => {
        const response = await fetch(`${url.pathname}?_haru=${build}`, {
          credentials: "same-origin",
          signal: AbortSignal.timeout(12000),
          headers: { Accept: "text/html" },
        });
        if (
          !response.ok ||
          !response.headers.get("content-type")?.includes("text/html")
        )
          throw new Error("Page unavailable");
        const html = await response.text();
        remember(url.pathname, html);
        return html;
      })();
      pending.set(url.pathname, request);
      try {
        return await request;
      } finally {
        pending.delete(url.pathname);
      }
    }
    function internalLink(anchor) {
      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        anchor.target ||
        anchor.hasAttribute("data-no-router")
      )
        return null;
      const url = new URL(anchor.href, location.href);
      if (
        url.origin !== location.origin ||
        !url.pathname.startsWith(base) ||
        !url.pathname.endsWith("/")
      )
        return null;
      if (url.pathname === location.pathname && url.search === location.search)
        return null;
      return url;
    }
    function updateHead(next) {
      document.title = next.title;
      for (const selector of [
        'meta[name="description"]',
        'link[rel="canonical"]',
        'meta[property^="og:"]',
        'script[type="application/ld+json"]',
      ]) {
        document.head
          .querySelectorAll(selector)
          .forEach((node) => node.remove());
        next.head
          .querySelectorAll(selector)
          .forEach((node) => document.head.append(node.cloneNode(true)));
      }
      const nextLinks = next.querySelectorAll("#navigation a");
      document.querySelectorAll("#navigation a").forEach((link, index) => {
        if (nextLinks[index]?.hasAttribute("aria-current"))
          link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }
    function scrollToTarget(url, position, focus) {
      if (url.hash) {
        const target = document.getElementById(
          decodeURIComponent(url.hash.slice(1)),
        );
        if (target) {
          target.scrollIntoView({ behavior: "instant", block: "start" });
          return;
        }
      }
      window.scrollTo({ top: position || 0, behavior: "instant" });
      if (focus) {
        const main = document.querySelector("main");
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    }
    async function navigate(
      url,
      { pop = false, position = 0, focus = true } = {},
    ) {
      const ticket = ++sequence;
      positions.set(displayedKey, scrollY);
      clearTimeout(progressTimer);
      document.documentElement.classList.remove("is-navigating");
      progressTimer = setTimeout(() => {
        document.documentElement.classList.add("is-navigating");
        document.querySelector("main")?.setAttribute("aria-busy", "true");
      }, 140);
      setMenu(false);
      try {
        const html = await load(url);
        if (ticket !== sequence) return;
        const next = new DOMParser().parseFromString(html, "text/html");
        const main = next.querySelector("main");
        if (
          !main ||
          next.querySelector('meta[name="haru-build"]')?.content !== build
        )
          throw new Error("New deployment");
        if (!pop) {
          history.replaceState({ ...history.state, haruScroll: scrollY }, "");
          history.pushState(
            { haruKey: crypto.randomUUID(), haruScroll: 0 },
            "",
            url,
          );
        }
        displayedKey = history.state?.haruKey || crypto.randomUUID();
        lifecycle.abort();
        document.querySelector("main").replaceWith(main);
        updateHead(next);
        initPage(true);
        scrollToTarget(url, position, focus);
        document.dispatchEvent(
          new CustomEvent("haru:navigation", { detail: { url: url.href } }),
        );
      } catch {
        if (ticket === sequence) location.assign(url.href);
      } finally {
        if (ticket === sequence) {
          clearTimeout(progressTimer);
          document.documentElement.classList.remove("is-navigating");
          document.querySelector("main")?.removeAttribute("aria-busy");
        }
      }
    }
    document.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      )
        return;
      const url = internalLink(event.target.closest("a"));
      if (!url) return;
      event.preventDefault();
      navigate(url);
    });
    window.addEventListener("popstate", (event) => {
      navigate(new URL(location.href), {
        pop: true,
        position:
          positions.get(event.state?.haruKey) ?? event.state?.haruScroll ?? 0,
        focus: false,
      });
    });
    const prefetch = (event) => {
      const url = internalLink(event.target.closest("a"));
      clearTimeout(intentTimer);
      if (!url || !canPrefetch() || pending.size >= 2) return;
      intentTimer = setTimeout(
        () => load(url).catch(() => {}),
        event.type === "touchstart" ? 0 : 70,
      );
    };
    document.addEventListener("pointerover", prefetch, { passive: true });
    document.addEventListener("focusin", prefetch);
    document.addEventListener("touchstart", prefetch, { passive: true });
    document.addEventListener(
      "pointerout",
      (event) => {
        if (event.target.closest("a")) clearTimeout(intentTimer);
      },
      { passive: true },
    );
    const warm = () => {
      if (!canPrefetch() || document.hidden) return;
      const links = [...document.querySelectorAll("#navigation a")]
        .map(internalLink)
        .filter(Boolean)
        .slice(0, 2);
      links.forEach((url) => load(url).catch(() => {}));
    };
    const scheduleWarm = () => {
      if ("requestIdleCallback" in window)
        idleTask = requestIdleCallback(warm, { timeout: 2500 });
      else idleTask = setTimeout(warm, 1500);
    };
    if (document.readyState === "complete") scheduleWarm();
    else window.addEventListener("load", scheduleWarm, { once: true });
    window.addEventListener("pagehide", () => {
      if ("cancelIdleCallback" in window) cancelIdleCallback(idleTask);
      else clearTimeout(idleTask);
    });
  }

  initNavigation();
  initPage();
  reducedMotion.addEventListener("change", () => {
    document
      .querySelectorAll(".reveal-ready")
      .forEach((node) => node.classList.add("is-revealed"));
    initPage();
  });
})();
