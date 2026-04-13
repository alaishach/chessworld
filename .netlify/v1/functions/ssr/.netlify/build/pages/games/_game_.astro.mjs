import { f as createComponent, j as renderComponent, r as renderTemplate, i as createAstro, m as maybeRenderHead, h as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_CarCqUpx.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../../chunks/Base_VoOIF_L1.mjs';
import { g as getGameContent, R as RATING_COLORS, a as RATING_LABELS } from '../../chunks/games_DM25tz1R.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

function renderMarkdown(md) {
  let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/((?:^\|.+\|\n?)+)/gm, (tableBlock) => {
    const rows = tableBlock.trim().split("\n");
    if (rows.length < 2) return tableBlock;
    const parseRow = (row) => row.split("|").slice(1, -1).map((cell) => cell.trim());
    const headers = parseRow(rows[0]);
    const body = rows.slice(2);
    const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${body.map((row) => `<tr>${parseRow(row).map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
  });
  html = html.replace(/((?:^[-*] .+\n?)+)/gm, (block) => {
    const items = block.trim().split("\n").map((line) => `<li>${line.replace(/^[-*] /, "")}</li>`).join("");
    return `<ul>${items}</ul>`;
  });
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
    const items = block.trim().split("\n").map((line) => `<li>${line.replace(/^\d+\. /, "")}</li>`).join("");
    return `<ol>${items}</ol>`;
  });
  html = html.replace(/^---$/gm, "<hr>");
  const blockTags = /^<(h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|hr|blockquote)/;
  html = html.split("\n\n").map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (blockTags.test(trimmed)) return trimmed;
    return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
  }).join("\n");
  return html;
}

const $$Astro = createAstro();
const $$game = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$game;
  const { game: gameId } = Astro2.params;
  const content = gameId ? getGameContent(gameId) : null;
  if (!content) {
    return Astro2.redirect("/games");
  }
  const { manifest: game, description, rules } = content;
  const gameEntryUrl = `/games/${game.id}/${game.entry}`;
  const ratingColor = RATING_COLORS[game.rating];
  const ratingLabel = RATING_LABELS[game.rating];
  const githubUrl = `https://github.com/${game.author}`;
  const descriptionHtml = description ? renderMarkdown(description) : null;
  const rulesHtml = rules ? renderMarkdown(rules) : null;
  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  const sortedChangelog = [...game.changelog ?? []].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": game.title, "description": game.description, "data-astro-cid-kpmccmae": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="game-page" data-astro-cid-kpmccmae> <!-- Back navigation --> <div class="back-nav container" data-astro-cid-kpmccmae> <a href="/" class="back-link" data-astro-cid-kpmccmae>← Home</a> <a href="/games" class="back-link" data-astro-cid-kpmccmae>← Game Listing</a> </div> <!-- Game header --> <div class="game-header container" data-astro-cid-kpmccmae> <div class="game-header-top" data-astro-cid-kpmccmae> <h1 class="game-title" data-astro-cid-kpmccmae>${game.title}</h1> <div class="game-meta-row" data-astro-cid-kpmccmae> <a${addAttribute(githubUrl, "href")} target="_blank" rel="noopener" class="author-link" data-astro-cid-kpmccmae>
by ${game.author} ↗
</a> <span class="rating-badge"${addAttribute(`background:${ratingColor.bg};color:${ratingColor.text};border-color:${ratingColor.text}30`, "style")} data-astro-cid-kpmccmae> ${game.rating} — ${ratingLabel} </span> <span class="version-badge" data-astro-cid-kpmccmae>v${game.version}</span> </div> <div class="game-tags-row" data-astro-cid-kpmccmae> ${game.tags.map((tag) => renderTemplate`<span class="tag" data-astro-cid-kpmccmae>${tag}</span>`)} ${game.chessRelation && renderTemplate`<span class="chess-tag" data-astro-cid-kpmccmae>♟ ${game.chessRelation}</span>`} </div> </div> </div> <!-- Iframe fills the middle --> <div class="game-frame-wrap" data-astro-cid-kpmccmae> <iframe${addAttribute(gameEntryUrl, "src")}${addAttribute(game.title, "title")} class="game-frame" allow="fullscreen" sandbox="allow-scripts allow-same-origin allow-forms" data-astro-cid-kpmccmae></iframe> </div> <!-- Description above rules/changelog --> <div class="game-content container" data-astro-cid-kpmccmae> <section class="description-section" data-astro-cid-kpmccmae> ${descriptionHtml ? renderTemplate`<div class="md-body" data-astro-cid-kpmccmae>${unescapeHTML(descriptionHtml)}</div>` : renderTemplate`<p class="no-content" data-astro-cid-kpmccmae>No description provided.</p>`} </section> <div class="content-lower" data-astro-cid-kpmccmae> <section class="rules-section" data-astro-cid-kpmccmae> <h2 class="section-label" data-astro-cid-kpmccmae>Rules &amp; Controls</h2> ${rulesHtml ? renderTemplate`<div class="md-body" data-astro-cid-kpmccmae>${unescapeHTML(rulesHtml)}</div>` : renderTemplate`<p class="no-content" data-astro-cid-kpmccmae>No rules provided.</p>`} </section> <section class="changelog-section" data-astro-cid-kpmccmae> <h2 class="section-label" data-astro-cid-kpmccmae>Changelog</h2> ${sortedChangelog.length > 0 ? renderTemplate`<div class="changelog" data-astro-cid-kpmccmae> ${sortedChangelog.map((entry, i) => renderTemplate`<div${addAttribute(`changelog-entry${i === 0 ? " latest" : ""}`, "class")} data-astro-cid-kpmccmae> <div class="changelog-header" data-astro-cid-kpmccmae> <span class="changelog-version" data-astro-cid-kpmccmae>v${entry.version}</span> ${i === 0 && renderTemplate`<span class="latest-badge" data-astro-cid-kpmccmae>Latest</span>`} <span class="changelog-date" data-astro-cid-kpmccmae>${formatDate(entry.date)}</span> </div> <p class="changelog-notes" data-astro-cid-kpmccmae>${entry.notes}</p> </div>`)} </div>` : renderTemplate`<p class="no-content" data-astro-cid-kpmccmae>No changelog entries.</p>`} </section> </div> </div> </div> ` })} `;
}, "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/games/[game].astro", void 0);

const $$file = "D:/Documents/-My Stuff-/2. Creative Stuff/1. Projects/0014_zenith64/chessworld.games/chess_world/game.chessworld_repo/src/pages/games/[game].astro";
const $$url = "/games/[game]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$game,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
