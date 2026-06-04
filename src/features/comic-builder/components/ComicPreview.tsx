import type { ComicProject, DialogueBox, Panel } from "../types";

interface Props {
  project: ComicProject;
}

function DialogueOverlay({ dialogue }: { dialogue: DialogueBox }) {
  return (
    <div
      className={`comic-dialogue-overlay comic-dialogue-${dialogue.type}`}
      style={{ left: `${dialogue.x}%`, top: `${dialogue.y}%` }}
    >
      {dialogue.text || `[${dialogue.type}]`}
    </div>
  );
}

function PreviewPanel({ panel }: { panel: Panel }) {
  return (
    <article className="comic-preview-panel">
      <div className="comic-panel-badge">Panel</div>
      {panel.generatedImageUrl ? (
        <div className="comic-panel-image-wrap comic-preview-image-wrap">
          <img src={panel.generatedImageUrl} alt={panel.scene || "Comic panel preview"} className="comic-panel-image" />
          {panel.dialogue.map((dialogue) => (
            <DialogueOverlay key={dialogue.id} dialogue={dialogue} />
          ))}
        </div>
      ) : (
        <div className="comic-preview-placeholder">
          <strong>Panel art not generated yet.</strong>
          <p>{panel.scene || "Add a scene description and generate panel art to preview it here."}</p>
        </div>
      )}

      {panel.dialogue.length > 0 && (
        <ul className="comic-preview-dialogue-list">
          {panel.dialogue.map((dialogue) => (
            <li key={dialogue.id}>
              <strong>{dialogue.type}:</strong> {dialogue.text || "Empty"}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function ComicPreview({ project }: Props) {
  const totalPanels = project.pages.reduce((count, page) => count + page.panels.length, 0);
  const readyPanels = project.pages.reduce(
    (count, page) => count + page.panels.filter((panel) => panel.generatedImageUrl).length,
    0,
  );

  return (
    <section className="comic-preview">
      <header className="comic-preview-header">
        <div>
          <h3>{project.title}</h3>
          <p className="muted">
            {project.pages.length} pages · {readyPanels}/{totalPanels} panels ready
          </p>
        </div>
        <p className="muted">Review the full reading flow here before exporting or sharing.</p>
      </header>

      {project.pages.length === 0 ? (
        <div className="comic-preview-empty">
          <strong>No pages yet.</strong>
          <p>Add pages and panels to assemble the comic preview.</p>
        </div>
      ) : (
        <div className="comic-preview-pages">
          {project.pages.map((page) => (
            <section key={page.id} className="comic-preview-page">
              <div className="comic-page-header">
                <h3>Page {page.pageNumber}</h3>
                <span className="muted">{page.panels.length} panels</span>
              </div>
              <div className="comic-preview-panel-grid">
                {page.panels.map((panel) => (
                  <PreviewPanel key={panel.id} panel={panel} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
