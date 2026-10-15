import { cp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products, site } from "../content/products.mjs";
import { guides } from "../content/guides.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const out = path.join(root, "dist");
const releases = JSON.parse(
  await readFile(path.join(root, "content/releases.json"), "utf8"),
);
// The generated directory is fixed under this project, never a caller-supplied path.
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, "assets"), path.join(out, "assets"), {
  recursive: true,
});

export const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const e = escape;
const href = (route) => `${site.base}${route}`;
const date = (value) =>
  new Date(value)
    .toLocaleDateString("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", ".");
const size = (value) => `${(value / 1024 / 1024).toFixed(1)} MB`;
const icons = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  external: '<path d="M13 5h6v6m0-6-9 9M9 5H5v14h14v-4"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  document: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  heart:
    '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 1 9 8 15 7-6 12-11 8-15Z"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"/>',
  image:
    '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="8" r="1.5"/><path d="m3 17 5-5 5 4 3-5 5 6"/>',
  briefcase:
    '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12c6 4 12 4 18 0m-9 1v4"/>',
  cards:
    '<rect x="6" y="6" width="15" height="15" rx="2"/><path d="M16 3H5a2 2 0 0 0-2 2v11m7-5h7m-7 4h5"/>',
  sync: '<path d="M4 9a8 8 0 0 1 13-4l3 3m0-5v5h-5M20 15A8 8 0 0 1 7 19l-3-3m0 5v-5h5"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
  code: '<path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18"/>',
  shield:
    '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  windows:
    '<path d="m3 5 8-1v7H3V5Zm10-1 8-1v8h-8V4ZM3 13h8v7l-8-1v-6Zm10 0h8v8l-8-1v-7Z"/>',
  mobile:
    '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.arrow}</svg>`;
const logo =
  '<svg class="site-mark" viewBox="0 0 36 36" aria-hidden="true"><rect x="1" y="1" width="34" height="34" rx="11" fill="currentColor"/><path d="M11 10v16m14-16v16M11 18h14" stroke="#faf9f6" stroke-width="3" stroke-linecap="round"/><circle cx="25" cy="11" r="3" fill="#d2dfb5"/></svg>';
const button = (text, url, options = "") =>
  `<a class="button ${options}" href="${e(url)}">${text}${icon("arrow")}</a>`;
const appIcon = (p) =>
  `<img class="app-icon" src="${href(`assets/${p.icon}`)}" alt="${e(p.name)} 图标" width="64" height="64">`;
const platform = (p) =>
  p.platforms
    .map(
      (v) => `<span>${icon(v === "Windows" ? "windows" : "mobile")}${v}</span>`,
    )
    .join("");
const sourceLink = (p) => `https://github.com/${p.repo}`;
const releaseFor = (p, channel = "stable") =>
  releases.products[p.id]?.[channel];
const setupFor = (p) =>
  releaseFor(p)?.assets.find((a) => /Setup.*\.exe$/i.test(a.name));
const paths = [];

function layout({
  title,
  description,
  route = "",
  nav = "",
  body,
  extra = "",
}) {
  const canonical = site.origin + href(route);
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="#f7f8f2">
<title>${e(title)} · ${site.name}</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${canonical}"><link rel="icon" type="image/svg+xml" href="${href("assets/favicon.svg")}"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)} · ${site.name}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.origin}${href("assets/social.svg")}"><link rel="stylesheet" href="${href("assets/style.css")}"><script src="${href("assets/app.js")}" defer></script>${extra}</head>
<body><a class="skip-link" href="#main">跳到正文</a>
<header class="site-header"><div class="shell header-inner"><a class="brand" href="${href("")}" aria-label="Haru 软件集首页">${logo}<span>Haru<span class="brand-sub">软件集</span></span></a>
<button class="menu-toggle" aria-controls="navigation" aria-expanded="false" aria-label="打开导航菜单">${icon("menu")}</button>
<nav id="navigation" aria-label="主导航">${[
    ["软件", "", "home"],
    ["下载中心", "downloads/", "downloads"],
    ["使用教程", "guides/", "guides"],
    ["更新日志", "updates/", "updates"],
  ]
    .map(
      ([label, url, id]) =>
        `<a href="${href(url)}" ${id === nav ? 'aria-current="page"' : ""}>${label}</a>`,
    )
    .join(
      "",
    )}<a class="nav-github" href="https://github.com/scj040921" target="_blank" rel="noopener noreferrer">GitHub ${icon("external")}</a></nav></div></header>
<main id="main">${body}</main>
<footer class="site-footer"><div class="shell"><div class="footer-top"><div><a class="brand" href="${href("")}">${logo}<span>Haru<span class="brand-sub">软件集</span></span></a><p>${site.subtitle}</p></div><div class="footer-links"><a href="${href("guides/")}">使用教程</a><a href="${href("privacy/")}">隐私说明</a><a href="${href("about/")}">关于与反馈</a><a href="https://github.com/scj040921/haruapps" target="_blank" rel="noopener noreferrer">网站源码 ${icon("external")}</a></div></div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} Haru 软件集 · 开源作品，持续打磨。</span><span>Made for the everyday.</span></div></div></footer>
<div class="toast" role="status" aria-live="polite" hidden></div></body></html>`;
}

async function page(route, options) {
  const file = path.join(out, route, "index.html");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, layout({ route, ...options }));
  paths.push(route);
}

function landscape(index = 0) {
  const palettes = [
    ["#bfd5d5", "#6c8f83", "#32574c", "#f0dfbc"],
    ["#e4cbb2", "#bc977e", "#886e5d", "#fff1d7"],
    ["#c6d3dc", "#7f97a3", "#455d69", "#f7e3bc"],
    ["#d4d6b4", "#9eaa82", "#546e56", "#f4e8bd"],
    ["#c5d2d6", "#90a5ab", "#4c757a", "#f8e6c8"],
    ["#d8c8c0", "#b39387", "#725c57", "#f7e1bb"],
  ];
  const [sky, back, front, sun] = palettes[index % palettes.length];
  return `<svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="300" height="220" fill="${sky}"/><circle cx="${210 - index * 14}" cy="${46 + index * 4}" r="${21 + index * 2}" fill="${sun}"/><path d="M0 ${140 - index * 9} ${65 + index * 6} ${68 + index * 7} 160 145 230 ${85 + index * 6} 300 144V220H0Z" fill="${back}"/><path d="M0 166 85 ${125 + index * 4} 180 176 300 ${113 + index * 5}V220H0Z" fill="${front}"/><path d="M0 204q90-22 170 0t130-7v23H0" fill="${sky}" opacity=".3"/></svg>`;
}

function resumePreview() {
  return `<div class="app-window resume-window" aria-label="拾简界面示意，使用示例数据"><div class="window-chrome"><span class="traffic"><i></i><i></i><i></i></span><span>拾简 Resume Studio</span><span>─ &nbsp; □ &nbsp; ×</span></div><div class="resume-ui"><aside class="mock-sidebar"><div class="mock-app-brand">${appIcon(products[0])}<b>拾简</b></div><span class="selected">${icon("document")}简历工作台</span><span>${icon("briefcase")}我的求职</span><span>${icon("cards")}面试背诵</span><span class="mock-settings">${icon("sync")}设置与同步</span></aside><div class="mock-editor"><div class="mock-toolbar"><b>我的简历</b><span>已保存 ${icon("check")}</span></div><div class="mock-editor-inner"><div class="mock-field"><span>简历名称</span><b>我的第一份简历</b></div><div class="mock-field"><span>模块</span><b>基本信息 <i>⌄</i></b></div><div class="mock-lines"><i></i><i></i><i></i></div><div class="mock-field"><span>教育经历</span><b>让每一份努力，都被看见</b></div><div class="mock-lines"><i></i><i></i></div></div></div><div class="mock-page-wrap"><div class="mock-page"><b class="mock-name">林同学</b><small>求职意向：软件工程师</small><div class="mock-contact">示例简历 · 非真实个人资料</div><strong>教育经历</strong><b class="mock-university">某某大学 <span>2023 — 2027</span></b><div class="paper-lines"><i></i><i></i></div><strong>项目经历</strong><b class="mock-university">把想法变成作品</b><div class="paper-lines"><i></i><i></i><i></i></div><strong>专业技能</strong><div class="paper-lines"><i></i><i></i></div></div></div></div><div class="mock-caption"><span>内容自动保存</span><span>界面示意 · 示例数据</span></div></div>`;
}

function photoPreview() {
  return `<div class="app-window photo-window" aria-label="Haruphoto 界面示意，使用原创风景插画"><div class="window-chrome"><span class="traffic"><i></i><i></i><i></i></span><span>Haruphoto</span><span>─ &nbsp; □ &nbsp; ×</span></div><div class="photo-ui"><div class="photo-toolbar"><span><b>每一个，值得珍藏的日常。</b><small>我的图库 <em> / </em> 旅行与生活</small></span><span class="mock-photo-icons">${icon("search")}${icon("grid")}${icon("heart")}</span></div><div class="photo-gallery">${Array.from({ length: 6 }, (_, i) => `<div class="photo-cell photo-${i}">${landscape(i)}${i === 0 ? "<span>♡</span>" : ""}</div>`).join("")}</div><div class="mock-caption"><span>山海之间 · 示例相册</span><span>界面示意 · 原创插画</span></div></div></div>`;
}

function guideCard(g, compact = false) {
  const p = products.find((p) => p.id === g.product);
  return `<a class="guide-card ${compact ? "compact" : ""}" href="${href(`guides/${g.slug}/`)}" data-guide data-product="${g.product}" data-search="${e(`${g.title} ${g.description} ${g.category} ${p?.name || ""} ${p?.english || ""}`.toLowerCase())}"><div class="guide-meta"><span>${p ? p.name : "通用指南"} <i>/</i> ${g.category}</span><span>${g.minutes} 分钟</span></div><h3>${g.title}${icon("arrow")}</h3><p>${g.description}</p><span class="guide-read">阅读指南 ${icon("arrow")}</span></a>`;
}

await page("", {
  title: "好用的软件，让日常从容一点",
  description:
    "发现拾简 Resume Studio 与 Haruphoto。软件介绍、Windows 与 Android 下载、使用教程和版本更新，在这里找到。",
  nav: "home",
  body: `<section class="hero shell"><div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span>独立开发 · 用心打磨</div><h1>小而用心，<br>让日常<span class="text-accent">更从容。</span></h1><p class="hero-description">为下一次机会做好准备，<br>也为平凡生活留住值得珍藏的瞬间。</p><div class="hero-actions">${button("发现软件", "#software", "primary")}<a class="text-link" href="${href("guides/")}">从使用指南开始 ${icon("arrow")}</a></div><div class="hero-notes"><span>${icon("code")}开源作品</span><span>${icon("shield")}资料由你掌握</span><span>${icon("heart")}持续打磨</span></div></div><div class="hero-visual"><div class="visual-orbit"></div><div class="hero-photo">${photoPreview()}</div><div class="hero-resume">${resumePreview()}</div><div class="visual-label"><span class="live-dot"></span>认真做工具，也认真过生活。</div></div></section>
<section class="software-section shell" id="software"><div class="section-heading"><div><div class="eyebrow">THE COLLECTION <span>/ 01—02</span></div><h2>为两种日常，认真做的软件。</h2></div><p>让工具回归简单，<br>把时间留给真正重要的事。</p></div>
<div class="product-grid">${products.map((p) => `<article class="product-card ${p.color}"><div class="product-card-top">${appIcon(p)}<span class="product-number">${p.number} <i>/</i> ${p.category}</span></div><div class="product-heading"><h3>${p.name}</h3><span>${p.english}</span></div><p class="product-tagline">${p.tagline}</p><div class="product-preview">${p.id === "resume-studio" ? resumePreview() : photoPreview()}</div><p class="product-description">${p.description}</p><div class="product-platforms">${platform(p)}<span class="version-label">${e(releaseFor(p)?.tag || "")} 正式版</span></div><div class="product-card-bottom">${button("了解软件", href(`software/${p.id}/`), "light")}<a class="text-link" href="${href(`downloads/?software=${p.id}`)}">免费下载 ${icon("download")}</a></div></article>`).join("")}</div></section>
<section class="principles shell"><div class="principle-intro"><span class="eyebrow">LESS FRICTION, MORE LIFE</span><h2>恰到好处，<br>就很好。</h2></div><div>${icon("document")}<h3>从你的日常出发</h3><p>围绕真实的使用场景，让整理、准备与回顾更顺手。</p></div><div>${icon("shield")}<h3>数据的选择权在你</h3><p>应用资料优先存放在本机，联网与同步的边界清晰可见。</p></div><div>${icon("code")}<h3>开放，也持续改进</h3><p>源码与更新记录公开，欢迎带着具体问题和想法一起打磨。</p></div></section>
<section class="guides-section shell"><div class="section-heading"><div><div class="eyebrow">A LITTLE GUIDANCE</div><h2>从第一次打开，到用得顺手。</h2></div><a class="text-link" href="${href("guides/")}">全部使用教程 ${icon("arrow")}</a></div><div class="guides-grid">${[guides[0], guides[5], guides[3]].map((g) => guideCard(g, true)).join("")}</div></section>
<section class="closing-section shell"><div><span class="eyebrow">GOOD TO HAVE YOU HERE</span><h2>下一步，从一个小工具开始。</h2><p>选一款适合你的软件，试着让今天更轻松一点。</p></div>${button("前往下载中心", href("downloads/"), "primary")}</section>`,
});

for (const p of products) {
  const release = releaseFor(p);
  const related = guides.filter((g) => g.product === p.id).slice(0, 3);
  await page(`software/${p.id}/`, {
    title: `${p.name} ${p.english} · 软件介绍`,
    description: p.description,
    nav: "home",
    extra: `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: `${p.name} ${p.english}`, operatingSystem: p.platforms.join(", "), applicationCategory: p.id === "haruphoto" ? "MultimediaApplication" : "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" }, softwareVersion: release?.tag, url: site.origin + href(`software/${p.id}/`) }).replaceAll("<", "\\u003c")}</script>`,
    body: `<section class="product-hero shell ${p.color}"><a class="breadcrumb" href="${href("")}">软件集 ${icon("arrow")} ${p.name}</a><div class="product-hero-grid"><div><div class="app-identity">${appIcon(p)}<div><div class="eyebrow">${p.category}</div><h1>${p.name}<small>${p.english}</small></h1></div></div><h2>${p.tagline}</h2><p>${p.description}</p><div class="hero-actions">${button("免费下载", href(`downloads/?software=${p.id}`), "primary")}<a class="text-link" href="${href(`guides/?software=${p.id}`)}">使用教程 ${icon("book")}</a></div><div class="product-platforms">${platform(p)}<span>${e(release?.tag)} 正式版</span></div><p class="requirements">${p.requirements}</p></div><div class="detail-preview">${p.id === "resume-studio" ? resumePreview() : photoPreview()}</div></div></section>
<section class="shell detail-features"><div class="section-heading"><div><div class="eyebrow">MADE FOR YOUR EVERYDAY</div><h2>${p.summary}</h2></div><p class="detail-description">${p.detail}</p></div><div class="feature-grid">${p.features.map((f) => `<article>${icon(f.icon)}<h3>${f.title}</h3><p>${f.text}</p></article>`).join("")}</div></section>
<section class="shell getting-started"><div><span class="eyebrow">YOUR FIRST STEPS</span><h2>打开它，然后开始。</h2><p>不用先注册本站账号，下载后即可开始使用。</p></div><ol>${p.steps.map((s, i) => `<li><span>0${i + 1}</span>${s}</li>`).join("")}</ol></section>
<section class="shell product-notes"><h2>使用前，了解这些细节。</h2><ul>${p.notes.map((n) => `<li>${n}</li>`).join("")}</ul><a class="text-link" href="${sourceLink(p)}" target="_blank" rel="noopener noreferrer">查看项目源码与完整说明 ${icon("external")}</a></section>
<section class="shell guides-section"><div class="section-heading"><h2>让上手再简单一点。</h2><a class="text-link" href="${href(`guides/?software=${p.id}`)}">全部教程 ${icon("arrow")}</a></div><div class="guides-grid">${related.map((g) => guideCard(g, true)).join("")}</div></section>`,
  });
}

function assetKind(asset) {
  if (/\.apk$/i.test(asset.name)) return ["Android APK", "android", "mobile"];
  if (/Setup.*\.exe$/i.test(asset.name))
    return ["Windows 安装版", "windows", "windows"];
  if (/\.zip$/i.test(asset.name))
    return ["Windows 便携版", "windows", "document"];
  return null;
}

function downloadCard(p, channel) {
  const r = releaseFor(p, channel);
  if (!r) return "";
  const priority = (a) =>
    /Setup.*\.exe$/i.test(a.name) ? 0 : /\.zip$/i.test(a.name) ? 1 : 2;
  const files = r.assets
    .filter((a) => assetKind(a))
    .sort((a, b) => priority(a) - priority(b));
  const sums = r.assets.find((a) => a.name === "SHA256SUMS.txt");
  return `<article class="download-card" data-download-card data-product="${p.id}" data-channel="${channel}" ${channel !== "stable" ? "hidden" : ""}><div class="download-card-head">${appIcon(p)}<div><h2>${p.name} <small>${p.english}</small></h2><div class="download-release"><span class="badge ${channel}">${channel === "stable" ? "Stable 正式版" : "Nightly 测试版"}</span><span>${e(r.tag)}</span><span>${date(r.published)} 发布</span></div></div><a class="icon-link" href="${e(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${p.name} ${e(r.tag)} 官方发行页面">${icon("external")}</a></div><p class="download-requirements">${icon("check")}${p.requirements}</p><div class="download-assets">${files
    .map((a) => {
      const [label, system, symbol] = assetKind(a);
      return `<div class="download-file" data-platform="${system}"><div class="file-icon">${icon(symbol)}</div><div class="file-description"><h3>${label}${/Setup/i.test(a.name) ? '<span class="recommended">推荐</span>' : ""}</h3><p class="file-name">${e(a.name)}</p><span>${size(a.size)}${/\.zip$/i.test(a.name) ? " · 完整解压后运行" : /\.apk$/i.test(a.name) ? " · Android 8.0+" : " · 双击安装"}</span></div><a class="button download-button" href="${e(a.url)}" data-download aria-label="下载 ${p.name} ${label} ${e(r.tag)}">${icon("download")}<span>下载</span></a><details class="checksum"><summary>SHA-256 文件校验</summary>${a.sha256 ? `<code>${e(a.sha256)}</code><button type="button" class="copy-button" data-copy="${e(a.sha256)}" aria-label="复制 ${e(a.name)} 的 SHA-256">复制校验值</button>` : "<p>GitHub 未提供此文件的摘要，请查看发行方校验清单。</p>"}</details></div>`;
    })
    .join(
      "",
    )}</div><div class="download-card-footer"><a href="${href(`guides/${p.id === "resume-studio" ? "resume-install" : "haruphoto-install"}/`)}">安装说明 ${icon("arrow")}</a>${sums ? `<a href="${e(sums.url)}">SHA256SUMS.txt ${icon("external")}</a>` : ""}<a href="${href(`updates/?software=${p.id}`)}">更新日志 ${icon("arrow")}</a></div></article>`;
}

await page("downloads/", {
  title: "下载中心",
  description:
    "下载拾简 Resume Studio 与 Haruphoto 正式版或 Nightly。Windows 安装版、便携 ZIP 与 Android APK，附系统要求及 SHA-256。",
  nav: "downloads",
  body: `<section class="page-intro shell"><div class="eyebrow">READY WHEN YOU ARE</div><h1>好工具，现在就开始。</h1><p>选择适合你的软件和版本。所有安装包均来自项目官方发行。</p></section><section class="shell downloads-layout"><div class="download-main"><div class="filter-panel" data-filter-scope="downloads"><div class="filter-row"><span class="filter-label">软件</span><div class="segmented" role="group" aria-label="选择软件">${[
    ["all", "全部软件"],
    ["resume-studio", "拾简"],
    ["haruphoto", "Haruphoto"],
  ]
    .map(
      ([v, l]) =>
        `<button type="button" data-filter="software" data-value="${v}" aria-pressed="${v === "all"}">${l}</button>`,
    )
    .join(
      "",
    )}</div></div><div class="filter-row"><span class="filter-label">通道</span><div class="segmented" role="group" aria-label="选择发布通道"><button type="button" data-filter="channel" data-value="stable" aria-pressed="true">Stable 正式版</button><button type="button" data-filter="channel" data-value="nightly" aria-pressed="false">Nightly 测试版</button></div></div><div class="filter-row"><span class="filter-label">平台</span><div class="segmented" role="group" aria-label="选择系统平台">${[
    ["all", "全部"],
    ["windows", "Windows"],
    ["android", "Android"],
  ]
    .map(
      ([v, l]) =>
        `<button type="button" data-filter="platform" data-value="${v}" aria-pressed="${v === "all"}">${l}</button>`,
    )
    .join(
      "",
    )}</div></div></div><div class="notice nightly-notice" hidden><strong>你正在浏览 Nightly 测试版。</strong>可能存在尚未解决的问题，建议先备份资料。日常使用优先选择正式版。</div><p class="results-summary" role="status" aria-live="polite" data-results></p><div class="download-list">${products.map((p) => ["stable", "nightly"].map((c) => downloadCard(p, c)).join("")).join("")}</div><div class="empty-state" data-empty hidden>${icon("search")}<h2>这个组合暂时没有安装包</h2><p>Haruphoto 目前仅支持 Windows。可切换平台，或选择拾简 Android 版。</p><button class="button primary" type="button" data-reset>查看全部正式版</button></div><p class="snapshot-time">版本信息核对于 ${date(releases.checkedAt)} · <a href="https://github.com/scj040921/haruapps/actions/workflows/deploy.yml" target="_blank" rel="noopener noreferrer">查看网站更新状态 ${icon("external")}</a></p></div><aside class="download-aside"><div class="aside-note"><span class="eyebrow">FIRST TIME HERE?</span><h2>第一次下载？</h2><ol><li><b>优先选择正式版</b><p>适合日常使用的 Stable 通道。</p></li><li><b>Windows 推荐安装版</b><p>双击 Setup.exe 即可安装，无需自己配置开发环境。</p></li><li><b>Android 选择 APK</b><p>拾简支持 Android 8.0 及以上。</p></li></ol><a class="text-link" href="${href("guides/channels-downloads/")}">下载与校验指南 ${icon("arrow")}</a></div><div class="aside-plain"><h3>下载遇到问题？</h3><p>文件通过 GitHub 提供，速度取决于网络。可以打开对应版本的官方发行页重试。</p><p>Haruphoto 安装器尚未商业签名；出现提示时先核对来源与校验值。</p><a class="text-link" href="${href("about/#feedback")}">反馈问题 ${icon("arrow")}</a></div></aside></section><noscript><p class="shell notice">筛选需要启用 JavaScript；下面的默认列表已提供两款软件的正式版下载。Nightly 可从各项目官方发行页面获取。</p></noscript>`,
});

await page("guides/", {
  title: "使用教程",
  description:
    "拾简与 Haruphoto 使用指南：安装、PDF 导出、Android、WebDAV 同步、面试题库、照片整理、对比选片与地图相册。",
  nav: "guides",
  body: `<section class="page-intro shell"><div class="eyebrow">FIND YOUR WAY</div><h1>一点指引，就能顺手。</h1><p>从安装到日常使用，按你的节奏慢慢来。</p></section><section class="shell guide-index"><div class="guide-controls" data-filter-scope="guides"><div class="segmented" role="group" aria-label="按软件筛选教程">${[
    ["all", "全部教程"],
    ["resume-studio", "拾简 Resume Studio"],
    ["haruphoto", "Haruphoto"],
  ]
    .map(
      ([v, l]) =>
        `<button type="button" data-filter="software" data-value="${v}" aria-pressed="${v === "all"}">${l}</button>`,
    )
    .join(
      "",
    )}</div><label class="search-input">${icon("search")}<span class="sr-only">搜索教程</span><input type="search" id="guide-search" placeholder="搜索安装、同步、照片…" autocomplete="off"></label></div><p class="results-summary" role="status" aria-live="polite" data-results>共 ${guides.length} 篇教程</p><div class="guides-grid guide-index-grid">${guides.map((g) => guideCard(g)).join("")}</div><div class="empty-state" data-empty hidden>${icon("search")}<h2>没有找到对应的教程</h2><p>试试「安装」「同步」「照片」，或清除筛选条件。</p><button class="button primary" type="button" data-reset>重置搜索</button></div></section>`,
});

for (const g of guides) {
  const p = products.find((p) => p.id === g.product);
  const related = guides
    .filter(
      (other) =>
        other.slug !== g.slug &&
        (other.product === g.product || other.product === "all"),
    )
    .slice(0, 2);
  await page(`guides/${g.slug}/`, {
    title: g.title,
    description: g.description,
    nav: "guides",
    body: `<div class="shell article-layout"><aside class="article-sidebar"><a class="breadcrumb" href="${href(`guides/${p ? `?software=${p.id}` : ""}`)}">${icon("arrow")}全部教程</a><div class="eyebrow">${p?.name || "通用指南"}</div><nav aria-label="同类教程">${guides
      .filter((other) => other.product === g.product)
      .map(
        (other) =>
          `<a href="${href(`guides/${other.slug}/`)}" ${g.slug === other.slug ? 'aria-current="page"' : ""}>${other.title}</a>`,
      )
      .join(
        "",
      )}</nav><a class="text-link" href="${href(`downloads/${p ? `?software=${p.id}` : ""}`)}">前往下载 ${icon("download")}</a></aside><article class="guide-article"><div class="eyebrow">${g.category} <span>/ 约 ${g.minutes} 分钟</span></div><h1>${g.title}</h1><p class="article-description">${g.description}</p><div class="article-info"><span>适用：${p ? `${p.name} ${p.english}` : "两款软件"}</span><span>教程核对：${date(site.contentReviewedAt)}</span></div><nav class="article-toc" aria-label="本篇目录"><b>这篇指南包含</b>${g.sections.map((s, i) => `<a href="#step-${i + 1}">${String(i + 1).padStart(2, "0")} ${s.title}</a>`).join("")}</nav>${g.sections.map((s, i) => `<section id="step-${i + 1}" class="article-section"><h2><span>${String(i + 1).padStart(2, "0")}</span>${s.title}</h2>${(s.paragraphs || []).map((t) => `<p>${e(t)}</p>`).join("")}${s.steps ? `<ol>${s.steps.map((t) => `<li>${e(t)}</li>`).join("")}</ol>` : ""}${s.code ? `<pre><code>${e(s.code)}</code></pre>` : ""}${s.tip ? `<aside class="article-tip"><b>小提示</b><p>${e(s.tip)}</p></aside>` : ""}</section>`).join("")}<div class="article-end"><p>遇到与教程不一致的地方？请附上软件版本和具体操作，帮助我们改进。</p><a class="text-link" href="${p ? `${sourceLink(p)}/issues` : href("about/#feedback")}" ${p ? 'target="_blank" rel="noopener noreferrer"' : ""}>反馈问题 ${icon("external")}</a></div><div class="related-guides"><h2>接下来可以看看</h2>${related.map((other) => guideCard(other, true)).join("")}</div></article></div>`,
  });
}

function releaseBody(body) {
  // Release descriptions are remote content: escape everything and support only plain headings/lists.
  const lines = body
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => !/^Source commit:/i.test(line));
  let html = "",
    inList = false;
  for (const line of lines) {
    const bullet = /^\s*[-*]\s+(.+)$/.exec(line);
    const heading = /^#{1,6}\s+(.+)$/.exec(line);
    if (bullet) {
      if (!inList) html += "<ul>";
      inList = true;
      html += `<li>${e(bullet[1])}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (heading) html += `<h3>${e(heading[1])}</h3>`;
      else if (line.trim()) html += `<p>${e(line)}</p>`;
    }
  }
  return html + (inList ? "</ul>" : "");
}

await page("updates/", {
  title: "更新日志",
  description:
    "查看拾简与 Haruphoto 的正式版及 Nightly 更新说明、发布日期和对应官方版本。",
  nav: "updates",
  body: `<section class="page-intro shell"><div class="eyebrow">ALWAYS A LITTLE BETTER</div><h1>每次更新，都向前一点。</h1><p>公开记录每一次修复、改进和新的尝试。</p></section><section class="shell updates-index"><div class="guide-controls" data-filter-scope="updates"><div class="segmented" role="group" aria-label="按软件筛选更新">${[
    ["all", "全部软件"],
    ["resume-studio", "拾简"],
    ["haruphoto", "Haruphoto"],
  ]
    .map(
      ([v, l]) =>
        `<button type="button" data-filter="software" data-value="${v}" aria-pressed="${v === "all"}">${l}</button>`,
    )
    .join(
      "",
    )}</div><div class="segmented" role="group" aria-label="按发布通道筛选更新">${[
    ["stable", "正式版"],
    ["nightly", "Nightly 测试版"],
  ]
    .map(
      ([v, l]) =>
        `<button type="button" data-filter="channel" data-value="${v}" aria-pressed="${v === "stable"}">${l}</button>`,
    )
    .join(
      "",
    )}</div></div><p class="results-summary" role="status" aria-live="polite" data-results></p><div class="updates-list">${products
    .flatMap((p) =>
      [
        ...releases.products[p.id].history,
        ...(releaseFor(p, "nightly") ? [releaseFor(p, "nightly")] : []),
      ].map((r) => ({ p, r })),
    )
    .sort((a, b) => Date.parse(b.r.published) - Date.parse(a.r.published))
    .map(
      ({ p, r }) =>
        `<article class="release-entry" data-release data-product="${p.id}" data-channel="${r.channel}" ${r.channel === "nightly" ? "hidden" : ""}><div class="release-date">${date(r.published)}<span>${p.name}</span></div><div class="release-content"><div class="release-title"><h2>${e(r.tag)}</h2><span class="badge ${r.channel}">${r.channel === "stable" ? "正式版" : "Nightly 测试版"}</span></div><details class="release-details"><summary>阅读完整更新说明 ${icon("arrow")}</summary><div class="release-body">${releaseBody(r.body)}</div></details><div class="release-links"><a href="${e(r.url)}" target="_blank" rel="noopener noreferrer">官方发行页面 ${icon("external")}</a><a href="${href(`downloads/?software=${p.id}&channel=${r.channel}`)}">${r.channel === "stable" ? "下载当前正式版" : "下载当前测试版"} ${icon("download")}</a></div></div></article>`,
    )
    .join(
      "",
    )}</div><div class="empty-state" data-empty hidden><h2>暂时没有对应的更新记录</h2><button class="button primary" type="button" data-reset>查看正式版</button></div><p class="snapshot-time">版本信息核对于 ${date(releases.checkedAt)}。完整历史请查看对应项目 Releases。</p></section>`,
});

await page("privacy/", {
  title: "隐私说明",
  description:
    "了解 Haru 软件集网站、本地软件、第三方下载与可选网络服务的数据边界。",
  body: `<section class="shell prose-page"><div class="eyebrow">YOUR DATA, YOUR CHOICE</div><h1>隐私与数据说明</h1><p class="article-description">了解网站与软件各自做什么，把选择留在自己手里。</p><h2>这个网站</h2><p>本站为静态介绍、下载与教程网站。没有用户注册、登录、评论或在线上传功能，也没有接入广告、第三方统计脚本或追踪 Cookie。教程搜索与筛选在浏览器内完成，不会把搜索词提交给我们的服务器。</p><p>网站由 GitHub Pages 提供托管。访问时，托管服务可能按自身政策记录 IP 地址、请求信息等技术日志；请查阅 <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub 隐私声明</a>。</p><h2>软件安装包下载</h2><p>下载按钮直接指向两个项目在 GitHub Releases 的公开文件。点击后会向 GitHub 发起下载请求。本站不代收文件，不获取你的 GitHub 登录令牌，也不要求提交个人资料。</p><h2>拾简 Resume Studio</h2><p>简历与求职资料默认保存在设备本机。WebDAV 是你选择并配置的同步服务，资料包以明文存放在所选服务器。平台 Cookie、AI Key 与 WebDAV 密码不会随资料包同步；电脑与手机需要分别配置凭据。</p><p>主动使用 AI 优化时，相关请求会发往你配置的接口。职位查询、内置网站登录与软件更新会访问相应外部服务，具体以功能操作及项目文档为准。</p><h2>Haruphoto</h2><p>照片、图库整理记录、地点与批注保存在本机。地图底图访问 OpenStreetMap；提交地点搜索时，输入的地名发送给 Nominatim 服务。更新功能访问 GitHub。本站不会接收你的照片。</p><h2>反馈问题</h2><p>项目问题通过 GitHub Issues 反馈，提交内容可能公开。请先隐藏姓名、联系方式、简历内容、照片路径和访问密钥，再提供截图或日志。</p><a class="text-link" href="${href("about/#feedback")}">前往反馈入口 ${icon("arrow")}</a></section>`,
});

await page("about/", {
  title: "关于与反馈",
  description:
    "Haru 软件集收录拾简与 Haruphoto，提供开源项目、反馈入口和网站说明。",
  body: `<section class="shell prose-page"><div class="eyebrow">SMALL TOOLS, THOUGHTFUL DETAILS</div><h1>认真做一点，<br>日常用得上的东西。</h1><p class="article-description">这里是拾简 Resume Studio 与 Haruphoto 的统一介绍、下载和教程入口。</p><p>一个围绕简历与求职准备，一个围绕照片整理与欣赏。它们服务不同的日常，也有相同的出发点：把具体的小事做好，把数据的选择权留给使用者。</p><h2>开放的作品</h2><p>两个项目都公开源码。软件的真实能力、运行要求与发布状态以各自仓库和发行记录为准。本站展示的应用窗口为使用示例数据制作的界面示意，不是用户的真实简历或照片，也不是逐像素的产品截图。</p><div class="about-projects">${products.map((p) => `<a href="${sourceLink(p)}" target="_blank" rel="noopener noreferrer">${appIcon(p)}<span><b>${p.name}</b><small>${p.repo}</small></span>${icon("external")}</a>`).join("")}</div><h2 id="feedback">有问题，也有想法？</h2><p>请在对应项目提交 Issue。描述软件版本、Windows / Android 版本、复现步骤、预期与实际表现；必要时附上隐藏个人信息后的截图或错误日志。</p><div class="feedback-links">${products.map((p) => button(`${p.name} 反馈`, `${sourceLink(p)}/issues`, "light")).join("")}</div><h2>关于网站</h2><p>本站无需注册即可浏览、阅读教程与下载。全部资源文件随网站部署，不依赖在线字体或图片服务。当前未建立国内下载镜像，GitHub 下载速度依网络环境而异。</p><p>网站源代码与维护说明在独立的 <a href="https://github.com/scj040921/haruapps" target="_blank" rel="noopener noreferrer">haruapps 仓库</a>，后续可继续加入新的软件或迁移托管服务。</p></section>`,
});

await writeFile(
  path.join(out, "404.html"),
  layout({
    title: "页面没有找到",
    description: "这条链接暂时没有对应页面，请回到首页或查看教程。",
    route: "404.html",
    body: `<section class="shell not-found"><span class="eyebrow">404 / TAKE A SMALL DETOUR</span><h1>好像走到了<br>还没写下的一页。</h1><p>检查一下地址，或回到软件集继续看看。</p>${button("返回首页", href(""), "primary")}</section>`,
  }),
);
await writeFile(path.join(out, ".nojekyll"), "");
await writeFile(
  path.join(out, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${site.origin}${href("sitemap.xml")}\n`,
);
await writeFile(
  path.join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((route) => `<url><loc>${site.origin}${href(route)}</loc></url>`).join("")}</urlset>`,
);
await writeFile(
  path.join(out, "releases.json"),
  `${JSON.stringify(releases, null, 2)}\n`,
);
console.log(`Built ${paths.length} pages + 404 in ${out}`);
