import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products, site } from "../content/products.mjs";
import { guides } from "../content/guides.mjs";
import { selectReleases } from "./sync-releases.mjs";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const snapshot = JSON.parse(
  await readFile(new URL("../content/releases.json", import.meta.url), "utf8"),
);
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else files.push(absolute);
  }
}
await walk(root);
let checkedLinks = 0;
const iconBytes =
  (await stat(path.join(root, "assets/resume-studio.png"))).size +
  (await stat(path.join(root, "assets/haruphoto.png"))).size;
assert(
  iconBytes < 120000,
  `App icons exceed 120 KB performance budget: ${iconBytes}`,
);
assert(
  (await stat(path.join(root, "assets/app.js"))).size < 30000,
  "Client script exceeds 30 KB performance budget",
);
const decode = (s) =>
  s.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const html = await readFile(file, "utf8");
  assert.match(html, /<html lang="zh-CN">/, file);
  assert.match(html, /<title>.+<\/title>/, file);
  assert.match(html, /<meta name="description" content="[^"]+">/, file);
  assert.match(
    html,
    /<meta name="haru-build" content="[a-f0-9]{12}">/,
    `Missing deployment identity: ${file}`,
  );
  assert.match(
    html,
    /assets\/app\.js\?v=[a-f0-9]{12}/,
    `Missing cache version: ${file}`,
  );
  assert.equal(
    (html.match(/<h1[ >]/g) || []).length,
    1,
    `Exactly one h1: ${file}`,
  );
  assert(
    !/TODO|lorem ipsum|href="#"|example\.com/i.test(html),
    `Placeholder in ${file}`,
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate id in ${file}`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const raw = decode(match[1]);
    if (/^(?:https?:|mailto:)/.test(raw)) continue;
    const url = new URL(
      raw,
      `https://test.invalid${site.base}${path.relative(root, file).replaceAll("\\", "/")}`,
    );
    assert(
      url.pathname.startsWith(site.base),
      `Link outside configured base: ${raw}`,
    );
    let target = path.join(
      root,
      decodeURIComponent(url.pathname.slice(site.base.length)),
    );
    if (url.pathname.endsWith("/")) target = path.join(target, "index.html");
    assert(
      files.includes(target),
      `Broken local link ${raw} in ${path.relative(root, file)}`,
    );
    if (url.hash) {
      const targetHtml =
        target === file ? html : await readFile(target, "utf8");
      assert(
        targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `Missing anchor ${raw}`,
      );
    }
    checkedLinks++;
  }
}
for (const p of products) {
  assert(snapshot.products[p.id].stable, `Stable missing: ${p.id}`);
  for (const channel of ["stable", "nightly"]) {
    const release = snapshot.products[p.id][channel];
    if (!release) continue;
    assert.equal(release.channel, channel);
    assert(
      release.url.startsWith(`https://github.com/${p.repo}/releases/tag/`),
    );
    for (const asset of release.assets) {
      assert(
        asset.url.startsWith(`https://github.com/${p.repo}/releases/download/`),
      );
      assert(asset.size > 0);
      if (asset.sha256) assert.match(asset.sha256, /^[a-f0-9]{64}$/i);
    }
  }
}
// GitHub's release ordering can differ from publication order: verify channel selection independently.
const make = (tag, published, prerelease, draft = false) => ({
  tag_name: tag,
  published_at: published,
  prerelease,
  draft,
  html_url: `https://github.com/test/repo/releases/tag/${tag}`,
  assets: [
    {
      name: "app-Setup.exe",
      size: 10,
      browser_download_url: `https://github.com/test/repo/releases/download/${tag}/app-Setup.exe`,
    },
  ],
});
const selected = selectReleases(
  [
    make("nightly-old", "2026-10-12T00:00:00Z", true),
    make("v1", "2026-10-13T00:00:00Z", false),
    make("nightly-new", "2026-10-15T00:00:00Z", true),
    make("draft", "2026-10-16T00:00:00Z", false, true),
    make("v2", "2026-10-14T00:00:00Z", false),
  ],
  "test/repo",
);
assert.equal(selected.nightly.tag, "nightly-new");
assert.equal(selected.stable.tag, "v2");
assert.equal(selected.history.length, 2);
assert.equal(guides.length, 10);
console.log(
  `PASS: ${files.filter((f) => f.endsWith(".html")).length} HTML pages; ${checkedLinks} local links/anchors; 10 guides; release provenance, checksums, and Stable/Nightly sorting.`,
);
