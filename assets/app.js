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

  const filters = document.querySelector("[data-filter-scope]");
  if (filters) {
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
        history.replaceState(null, "", next);
      }
    }
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      const { filter, value } = button.dataset;
      if (!allowed[filter]?.includes(value)) return;
      state[filter] = value;
      update();
    });
    input?.addEventListener("input", () => {
      state.q = input.value;
      update();
    });
    document.querySelector("[data-reset]")?.addEventListener("click", () => {
      Object.assign(state, {
        software: "all",
        channel: "stable",
        platform: "all",
        q: "",
      });
      if (input) input.value = "";
      update();
    });
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
})();
