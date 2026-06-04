import type { ComicProject, DialogueBox, Panel } from "./types";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderDialogue = (dialogue: DialogueBox) => `
  <div class="comic-dialogue-overlay comic-dialogue-${escapeHtml(dialogue.type)}" style="left:${dialogue.x}%;top:${dialogue.y}%;">
    ${escapeHtml(dialogue.text || `[${dialogue.type}]`)}
  </div>
`;

const renderPanel = (panel: Panel) => {
  const imageMarkup = panel.generatedImageUrl
    ? `
      <div class="comic-panel-image-wrap">
        <img class="comic-panel-image" src="${escapeHtml(panel.generatedImageUrl)}" alt="${escapeHtml(panel.scene || "Comic panel")}" />
        ${panel.dialogue.map(renderDialogue).join("")}
      </div>
    `
    : `
      <div class="comic-preview-placeholder">
        <strong>Panel art not generated yet.</strong>
        <p>${escapeHtml(panel.scene || "Generate this panel to include finished art in the shared preview.")}</p>
      </div>
    `;

  const dialogueList = panel.dialogue.length > 0
    ? `
      <ul class="comic-preview-dialogue-list">
        ${panel.dialogue.map((dialogue) => `
          <li><strong>${escapeHtml(dialogue.type)}:</strong> ${escapeHtml(dialogue.text || "Empty")}</li>
        `).join("")}
      </ul>
    `
    : "";

  return `
    <article class="comic-preview-panel">
      <div class="comic-panel-badge">Panel</div>
      ${imageMarkup}
      ${dialogueList}
    </article>
  `;
};

export function buildComicHtmlDocument(project: ComicProject): string {
  const totalPanels = project.pages.reduce((count, page) => count + page.panels.length, 0);
  const readyPanels = project.pages.reduce(
    (count, page) => count + page.panels.filter((panel) => panel.generatedImageUrl).length,
    0,
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(project.title)} — Comic Preview</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, system-ui, sans-serif;
        background: #0a0e17;
        color: #e4e4e7;
        padding: 24px;
      }
      .comic-preview {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .comic-preview-header,
      .comic-preview-page,
      .comic-preview-empty,
      .comic-preview-panel {
        background: #12161f;
        border: 1px solid #2a2f3d;
        border-radius: 12px;
      }
      .comic-preview-header,
      .comic-preview-empty,
      .comic-preview-page {
        padding: 20px;
      }
      .comic-preview-panel {
        padding: 16px;
      }
      .comic-preview-header h1,
      .comic-page-title {
        margin: 0 0 8px;
      }
      .muted { color: #a0a0b0; }
      .comic-preview-panel-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
      .comic-panel-badge {
        font-size: 12px;
        color: #a63cff;
        font-weight: 600;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .comic-panel-image-wrap {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
      }
      .comic-panel-image {
        width: 100%;
        display: block;
      }
      .comic-preview-placeholder {
        min-height: 180px;
        padding: 20px;
        border-radius: 8px;
        background: linear-gradient(135deg, rgba(25,242,255,0.08), rgba(166,60,255,0.12));
      }
      .comic-preview-placeholder p {
        margin-bottom: 0;
      }
      .comic-dialogue-overlay {
        position: absolute;
        padding: 6px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        max-width: 45%;
      }
      .comic-dialogue-speech { background: #fff; color: #111; border: 2px solid #111; }
      .comic-dialogue-thought { background: rgba(255,255,255,0.85); color: #111; border: 2px dashed #888; border-radius: 999px; }
      .comic-dialogue-narration { background: rgba(255,214,0,0.9); color: #111; }
      .comic-dialogue-caption { background: rgba(0,0,0,0.8); color: #fff; }
      .comic-dialogue-sfx { color: #ff6a9a; font-size: 18px; font-style: italic; background: none; }
      .comic-preview-dialogue-list {
        margin: 12px 0 0;
        padding-left: 18px;
        color: #cfd3de;
      }
      .comic-page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
      @media (max-width: 720px) {
        body { padding: 16px; }
        .comic-preview-header,
        .comic-preview-page,
        .comic-preview-empty,
        .comic-preview-panel {
          padding: 14px;
        }
      }
    </style>
  </head>
  <body>
    <main class="comic-preview">
      <header class="comic-preview-header">
        <h1>${escapeHtml(project.title)}</h1>
        <p class="muted">${project.pages.length} pages · ${readyPanels}/${totalPanels} panels ready · Updated ${escapeHtml(new Date(project.updatedAt).toLocaleString())}</p>
      </header>
      ${project.pages.length > 0
        ? project.pages.map((page) => `
            <section class="comic-preview-page">
              <div class="comic-page-header">
                <h2 class="comic-page-title">Page ${page.pageNumber}</h2>
                <span class="muted">${page.panels.length} panels</span>
              </div>
              <div class="comic-preview-panel-grid">
                ${page.panels.map(renderPanel).join("")}
              </div>
            </section>
          `).join("")
        : `
          <section class="comic-preview-empty">
            <strong>No pages yet.</strong>
            <p>Add pages and panels in Comic Book Builder before exporting a preview.</p>
          </section>
        `}
    </main>
  </body>
</html>`;
}
