import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { products } from "../content/products.mjs";

const target = fileURLToPath(
  new URL("../content/releases.json", import.meta.url),
);
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "haruapps",
};
if (process.env.GITHUB_TOKEN)
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

export function selectReleases(releases, repo) {
  const valid = releases
    .filter(
      (r) =>
        !r.draft &&
        r.assets?.some((a) =>
          /(?:Setup.*\.exe|\.apk|(?:portable|windows-x64)\.zip)$/i.test(a.name),
        ),
    )
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
  const normalize = (release) =>
    release
      ? {
          tag: release.tag_name,
          name: release.name || release.tag_name,
          channel: release.prerelease ? "nightly" : "stable",
          published: release.published_at,
          url: release.html_url,
          body: (release.body || "").replace(/<!--[\s\S]*?-->/g, "").trim(),
          assets: release.assets
            .filter((a) =>
              /(?:Setup.*\.exe|\.apk|(?:portable|windows-x64)\.zip|SHA256SUMS\.txt)$/i.test(
                a.name,
              ),
            )
            .map((a) => {
              const prefix = `https://github.com/${repo}/releases/download/`;
              if (!a.browser_download_url.startsWith(prefix))
                throw new Error(`Untrusted release URL: ${a.name}`);
              return {
                name: a.name,
                size: a.size,
                url: a.browser_download_url,
                sha256: a.digest?.startsWith("sha256:")
                  ? a.digest.slice(7)
                  : null,
              };
            }),
        }
      : null;
  return {
    stable: normalize(valid.find((r) => !r.prerelease)),
    nightly: normalize(valid.find((r) => r.prerelease)),
    history: valid
      .filter((r) => !r.prerelease)
      .slice(0, 5)
      .map(normalize),
  };
}

async function main() {
  // Write only after every repository succeeds, so a failed refresh retains the complete previous snapshot.
  const results = await Promise.all(
    products.map(async (product) => {
      const response = await fetch(
        `https://api.github.com/repos/${product.repo}/releases?per_page=100`,
        { headers, signal: AbortSignal.timeout(30000) },
      );
      if (!response.ok)
        throw new Error(`${product.repo}: GitHub HTTP ${response.status}`);
      const selected = selectReleases(await response.json(), product.repo);
      if (!selected.stable)
        throw new Error(`${product.repo}: no downloadable Stable release`);
      console.log(
        `${product.id}: Stable ${selected.stable.tag}; Nightly ${selected.nightly?.tag || "none"}`,
      );
      return [product.id, selected];
    }),
  );
  const data = {
    checkedAt: new Date().toISOString(),
    products: Object.fromEntries(results),
  };
  // Avoid rewriting a snapshot solely for its timestamp when versions and assets are unchanged.
  const previous = await readFile(target, "utf8")
    .then(JSON.parse)
    .catch(() => null);
  if (JSON.stringify(previous?.products) === JSON.stringify(data.products))
    console.log("Release data unchanged.");
  else await writeFile(target, `${JSON.stringify(data, null, 2)}\n`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(`Release sync failed: ${error.message}`);
    process.exitCode = 1;
  });
}
