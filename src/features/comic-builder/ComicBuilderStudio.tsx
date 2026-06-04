import { useCallback, useEffect, useState } from "react";
import { FalKeyGate } from "./components/FalKeyGate";
import { CharacterManager } from "./components/CharacterManager";
import { StyleControls } from "./components/StyleControls";
import { PanelEditor } from "./components/PanelEditor";
import { ComicPreview } from "./components/ComicPreview";
import { buildComicHtmlDocument } from "./export-html";
import { createProject, loadBuilderState, saveBuilderState } from "./storage";
import type { CharacterReference, ComicPage, ComicProject, Panel } from "./types";

type Tab = "pages" | "preview" | "characters" | "style" | "export";

function buildProjectSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "comic";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function createPanel(): Panel {
  return {
    id: crypto.randomUUID(),
    scene: "",
    characterIds: [],
    shotType: "medium",
    extraKeywords: [],
    dialogue: [],
    generatedImageUrl: null,
    seed: null,
    seedLocked: false,
  };
}

function createPage(pageNumber: number): ComicPage {
  return { id: crypto.randomUUID(), pageNumber, panels: [createPanel()] };
}

export function ComicBuilderStudio() {
  const [state, setState] = useState(() => loadBuilderState());
  const [tab, setTab] = useState<Tab>("pages");
  const [newTitle, setNewTitle] = useState("");
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Active project
  const project = state.projects.find((p) => p.id === state.activeProjectId) ?? null;

  // Persist on change
  useEffect(() => { saveBuilderState(state); }, [state]);

  const updateProject = useCallback((updater: (p: ComicProject) => ComicProject) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => (p.id === s.activeProjectId ? updater(p) : p)),
    }));
  }, []);

  // ── Project CRUD ──────────────────────────────────────────────────────────

  const handleCreateProject = () => {
    if (!newTitle.trim()) return;
    const p = createProject(newTitle.trim());
    setState((s) => ({
      ...s,
      projects: [...s.projects, p],
      activeProjectId: p.id,
      falKeyStored: s.falKeyStored,
    }));
    setNewTitle("");
  };

  const handleSelectProject = (id: string) => {
    setState((s) => ({ ...s, activeProjectId: id }));
  };

  const handleDeleteProject = (id: string) => {
    setState((s) => ({
      ...s,
      projects: s.projects.filter((p) => p.id !== id),
      activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
      falKeyStored: s.falKeyStored,
    }));
  };

  // ── Characters ────────────────────────────────────────────────────────────

  const addCharacter = (char: CharacterReference) => {
    updateProject((p) => ({ ...p, characters: [...p.characters, char], updatedAt: new Date().toISOString() }));
  };
  const removeCharacter = (id: string) => {
    updateProject((p) => ({ ...p, characters: p.characters.filter((c) => c.id !== id), updatedAt: new Date().toISOString() }));
  };
  const updateCharacter = (char: CharacterReference) => {
    updateProject((p) => ({
      ...p,
      characters: p.characters.map((c) => (c.id === char.id ? char : c)),
      updatedAt: new Date().toISOString(),
    }));
  };

  // ── Pages / Panels ────────────────────────────────────────────────────────

  const addPage = () => {
    updateProject((p) => ({
      ...p,
      pages: [...p.pages, createPage(p.pages.length + 1)],
      updatedAt: new Date().toISOString(),
    }));
  };

  const addPanel = (pageId: string) => {
    updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) =>
        pg.id === pageId ? { ...pg, panels: [...pg.panels, createPanel()] } : pg,
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updatePanel = (pageId: string, panel: Panel) => {
    updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) =>
        pg.id === pageId
          ? { ...pg, panels: pg.panels.map((pn) => (pn.id === panel.id ? panel : pn)) }
          : pg,
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const removePanel = (pageId: string, panelId: string) => {
    updateProject((p) => ({
      ...p,
      pages: p.pages.map((pg) =>
        pg.id === pageId ? { ...pg, panels: pg.panels.filter((pn) => pn.id !== panelId) } : pg,
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const removePage = (pageId: string) => {
    updateProject((p) => ({
      ...p,
      pages: p.pages.filter((pg) => pg.id !== pageId).map((pg, i) => ({ ...pg, pageNumber: i + 1 })),
      updatedAt: new Date().toISOString(),
    }));
  };

  // ── Export ────────────────────────────────────────────────────────────────

  const handleExportJSON = () => {
    if (!project) return;
    setExportMessage(null);
    const slug = buildProjectSlug(project.title);
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${slug}-comic.json`);
  };

  const handleExportPreviewHTML = () => {
    if (!project) return;
    setExportMessage(null);
    const slug = buildProjectSlug(project.title);
    const blob = new Blob([buildComicHtmlDocument(project)], { type: "text/html" });
    downloadBlob(blob, `${slug}-comic-preview.html`);
  };

  const handleShareComic = async () => {
    if (!project) return;

    const slug = buildProjectSlug(project.title);
    const file = new File([buildComicHtmlDocument(project)], `${slug}-comic-preview.html`, {
      type: "text/html",
    });

    if (typeof navigator.share === "function") {
      try {
        if (typeof navigator.canShare !== "function" || navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${project.title} comic preview`,
            text: `Sharing ${project.title} as a standalone comic preview.`,
            files: [file],
          });
          setExportMessage("Comic preview shared.");
          return;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setExportMessage(null);
          return;
        }
      }
    }

    downloadBlob(file, file.name);
    setExportMessage("Native sharing is unavailable here, so the preview HTML was downloaded instead.");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="comic-builder-shell">
      <header className="comic-header">
        <a href="/" className="comic-back">← Hub</a>
        <h1>Comic Book Builder</h1>
        <span className="muted">Powered by Nano Banana 2 on fal.ai</span>
      </header>

      <FalKeyGate>
        {/* Project selector */}
        {!project ? (
          <div className="comic-project-select">
            <h2>Projects</h2>
            <div className="comic-project-create">
              <input
                className="comic-input"
                placeholder="New project title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
              />
              <button className="comic-btn" onClick={handleCreateProject} disabled={!newTitle.trim()}>
                + Create
              </button>
            </div>
            {state.projects.length > 0 && (
              <div className="comic-project-list">
                {state.projects.map((p) => (
                  <div key={p.id} className="comic-project-item">
                    <button className="comic-project-item-btn" onClick={() => handleSelectProject(p.id)}>
                      <strong>{p.title}</strong>
                      <span className="muted">{p.pages.length} pages · {p.characters.length} chars</span>
                    </button>
                    <button className="comic-btn-sm comic-btn-danger" onClick={() => handleDeleteProject(p.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Tabs */}
            <nav className="comic-tabs">
              {(["pages", "preview", "characters", "style", "export"] as Tab[]).map((t) => (
                <button
                  key={t}
                  className={`comic-tab ${tab === t ? "comic-tab-active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              <button className="comic-btn-sm" onClick={() => setState((s) => ({ ...s, activeProjectId: null }))}>
                ← Projects
              </button>
            </nav>

            {/* Pages tab */}
            {tab === "pages" && (
              <div className="comic-pages">
                {project.pages.map((page) => (
                  <section key={page.id} className="comic-page-section">
                    <div className="comic-page-header">
                      <h3>Page {page.pageNumber}</h3>
                      <div>
                        <button className="comic-btn-sm" onClick={() => addPanel(page.id)}>+ Panel</button>
                        <button className="comic-btn-sm comic-btn-danger" onClick={() => removePage(page.id)}>
                          Delete Page
                        </button>
                      </div>
                    </div>
                    <div className="comic-panels-grid">
                      {page.panels.map((panel, pi) => (
                        <div key={panel.id} className="comic-panel-wrap">
                          <div className="comic-panel-badge">Panel {pi + 1}</div>
                          <PanelEditor
                            panel={panel}
                            characters={project.characters}
                            style={project.style}
                            onUpdate={(p) => updatePanel(page.id, p)}
                          />
                          <button
                            className="comic-btn-sm comic-btn-danger"
                            onClick={() => removePanel(page.id, panel.id)}
                          >
                            Remove Panel
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
                <button className="comic-btn" onClick={addPage}>+ Add Page</button>
              </div>
            )}

            {/* Preview tab */}
            {tab === "preview" && <ComicPreview project={project} />}

            {/* Characters tab */}
            {tab === "characters" && (
              <CharacterManager
                characters={project.characters}
                onAdd={addCharacter}
                onRemove={removeCharacter}
                onUpdate={updateCharacter}
              />
            )}

            {/* Style tab */}
            {tab === "style" && (
              <StyleControls
                style={project.style}
                onChange={(s) => updateProject((p) => ({ ...p, style: s, updatedAt: new Date().toISOString() }))}
              />
            )}

            {/* Export tab */}
            {tab === "export" && (
              <div className="comic-export">
                <h3>Export Project</h3>
                <p className="muted">Download the source JSON, export a standalone preview, or share the finished comic file directly.</p>
                <div className="comic-export-actions">
                  <button className="comic-btn" onClick={handleExportJSON}>
                    📦 Download JSON
                  </button>
                  <button className="comic-btn" onClick={handleExportPreviewHTML}>
                    🖼️ Download Preview HTML
                  </button>
                  <button className="comic-btn comic-btn-generate" onClick={() => void handleShareComic()}>
                    📤 Share Comic
                  </button>
                </div>
                {exportMessage && <p className="muted">{exportMessage}</p>}
              </div>
            )}
          </>
        )}
      </FalKeyGate>
    </div>
  );
}
