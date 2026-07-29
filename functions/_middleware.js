/**
 * Cloudflare Pages Functions middleware that makes the static export
 * agent-readable. It does two things, both on top of files the build already
 * emits (see scripts/generate-llms.mjs):
 *
 *   1. RFC 8288 `Link` response headers on every page, pointing agents at
 *      /llms.txt (the machine-readable index of the site), the sitemap, the
 *      blog feed, and the page's own Markdown mirror.
 *   2. Content negotiation for Markdown: a request that prefers
 *      `text/markdown` over HTML is served the page's pre-generated `.md`
 *      mirror as `text/markdown`. Browsers, which never ask for Markdown, keep
 *      getting HTML.
 *
 * Only page routes run through here — public/_routes.json excludes the static
 * assets so images, fonts and /_next/* are served straight from the CDN.
 */

/** Links advertised on every page, independent of the route. */
const SITE_LINKS = [
  '</llms.txt>; rel="service-doc"; type="text/plain"; title="Nano Collective llms.txt"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</feed.xml>; rel="alternate"; type="application/rss+xml"; title="Nano Collective blog"',
];

export async function onRequest(context) {
  const { env, next, request } = context;
  const url = new URL(request.url);
  const mirror = markdownMirrorFor(url.pathname);
  const isRead = request.method === "GET" || request.method === "HEAD";

  if (mirror && isRead && prefersMarkdown(request.headers.get("accept"))) {
    const markdown = await serveMarkdown(env, url, mirror);
    if (markdown) return markdown;
  }

  // Resolved alongside the page itself so the mirror lookup costs no latency.
  const [response, hasMirror] = await Promise.all([
    next(),
    mirror ? mirrorExists(env, url, mirror) : false,
  ]);

  return withLinkHeaders(response, hasMirror ? mirror : null);
}

/**
 * The Markdown mirror for a page route: /nanocoder -> /nanocoder.md, / ->
 * /index.md. Returns null for anything that is already a file (an asset, or a
 * `.md` mirror being fetched directly).
 */
function markdownMirrorFor(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (path === "" || path === "/") return "/index.md";
  const lastSegment = path.slice(path.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) return null;
  return `${path}.md`;
}

/**
 * True when the client asks for Markdown at least as strongly as HTML. Browser
 * Accept headers never mention `text/markdown`, so they always fall through to
 * HTML.
 */
function prefersMarkdown(accept) {
  if (!accept) return false;

  let markdown = -1;
  let html = -1;

  for (const entry of accept.split(",")) {
    const [rawType, ...params] = entry.split(";");
    const type = rawType.trim().toLowerCase();
    const q = quality(params);

    if (type === "text/markdown") {
      markdown = Math.max(markdown, q);
    } else if (type === "text/html" || type === "text/*" || type === "*/*") {
      html = Math.max(html, q);
    }
  }

  return markdown > 0 && markdown >= html;
}

/** The q-value of an Accept entry's parameters, defaulting to 1. */
function quality(params) {
  for (const param of params) {
    const [name, value] = param.split("=");
    if (name.trim().toLowerCase() !== "q") continue;
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? 1 : parsed;
  }
  return 1;
}

/** Serve a Markdown mirror, or null when the page has no mirror. */
async function serveMarkdown(env, url, mirror) {
  const asset = await fetchAsset(env, url, mirror);
  if (!asset) return null;

  const body = await asset.text();
  const headers = new Headers({
    "content-type": "text/markdown; charset=utf-8",
    // Approximate: agents use this to budget a fetch, not to bill anyone.
    "x-markdown-tokens": String(Math.ceil(body.length / 4)),
    "cache-control": asset.headers.get("cache-control") ?? "public, max-age=0",
    vary: "Accept",
  });
  headers.append("link", SITE_LINKS.join(", "));

  return new Response(body, { status: 200, headers });
}

/** Whether a Markdown mirror exists, without reading its body. */
async function mirrorExists(env, url, mirror) {
  const asset = await fetchAsset(env, url, mirror);
  if (!asset) return false;
  await discard(asset);
  return true;
}

/** Fetch a file from the static export, or null when it is not there. */
async function fetchAsset(env, url, path) {
  try {
    const asset = await env.ASSETS.fetch(new URL(path, url.origin));
    if (asset.ok) return asset;
    await discard(asset);
    return null;
  } catch {
    return null;
  }
}

async function discard(response) {
  try {
    await response.body?.cancel();
  } catch {
    // A body that cannot be cancelled is already done with.
  }
}

/** Attach the agent-discovery links to an HTML page response. */
function withLinkHeaders(response, mirror) {
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status !== 200 || !contentType.includes("text/html")) {
    return response;
  }

  const links = mirror
    ? [`<${mirror}>; rel="alternate"; type="text/markdown"`, ...SITE_LINKS]
    : SITE_LINKS;

  const withLinks = new Response(response.body, response);
  withLinks.headers.append("link", links.join(", "));
  withLinks.headers.append("vary", "Accept");
  return withLinks;
}
