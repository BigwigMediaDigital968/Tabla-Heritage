export const editorStyles = `
.rte-content:focus { outline: none; }
.rte-content {
  min-height: 400px;
  padding: 1.25rem;
  font-size: 1rem;
  line-height: 1.7;
  color: #1e293b;
}
/* ── Headings ── */
.rte-content h1 { font-size: 2rem;    font-weight: 700; line-height: 1.2; margin: 1rem 0 0.5rem; }
.rte-content h2 { font-size: 1.5rem;  font-weight: 700; line-height: 1.25; margin: 1rem 0 0.5rem; }
.rte-content h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.3;  margin: 1rem 0 0.5rem; }
.rte-content h4 { font-size: 1.1rem;  font-weight: 600; line-height: 1.35; margin: 0.75rem 0 0.4rem; }
.rte-content h5 { font-size: 1rem;    font-weight: 600; line-height: 1.4;  margin: 0.75rem 0 0.4rem; }
.rte-content h6 { font-size: 0.875rem;font-weight: 600; line-height: 1.4;  margin: 0.75rem 0 0.4rem; color: #475569; }
/* ── Block elements ── */
.rte-content p  { margin: 0.5rem 0; }
.rte-content ul { list-style: disc;    padding-left: 1.5rem; margin: 0.5rem 0; }
.rte-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
.rte-content li { margin: 0.2rem 0; }
.rte-content blockquote {
  border-left: 3px solid #1fa8e8;
  padding: 0.5rem 1rem;
  margin: 0.75rem 0;
  color: #475569;
  background: #f8fafc;
  border-radius: 0 0.5rem 0.5rem 0;
}
.rte-content hr { border: none; border-top: 2px solid #e2e8f0; margin: 1rem 0; }
.rte-content pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.75rem 0;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
}
.rte-content code:not(pre code) {
  background: #f1f5f9;
  color: #e11d48;
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
  font-family: ui-monospace, monospace;
  font-size: 0.875em;
}
.rte-content a { color: #1fa8e8; text-decoration: underline; }
.rte-content img { border-radius: 0.75rem; max-width: 100%; margin: 1rem auto; display: block; }
.rte-content mark { border-radius: 0.2em; padding: 0.05em 0.15em; }
/* ── Image alt-text editor ── */
.rte-image-wrapper { position: relative; }
.rte-image {
  cursor: pointer;
  outline: 2px solid transparent;
  outline-offset: 3px;
  transition: outline-color 0.15s ease;
}
.rte-image:hover { outline-color: #bfdbfe; }
.rte-image-selected { outline-color: #1fa8e8; }
.rte-image-no-alt { outline-style: dashed; outline-color: #fbbf24; }
.rte-image-alt-panel {
  margin: 0.4rem auto 1rem;
  max-width: 480px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.6rem 0.75rem;
}
.rte-image-alt-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 0.35rem;
}
.rte-image-alt-row { display: flex; gap: 0.4rem; }
.rte-image-alt-input {
  flex: 1;
  min-width: 0;
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #1e293b;
  background: #fff;
}
.rte-image-alt-input:focus {
  outline: none;
  border-color: #1fa8e8;
  box-shadow: 0 0 0 2px rgba(31, 168, 232, 0.15);
}
.rte-image-alt-save, .rte-image-alt-cancel {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.4rem 0.7rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}
.rte-image-alt-save { color: #fff; background: linear-gradient(90deg, #1fa8e8, #6dbb45); }
.rte-image-alt-cancel { color: #64748b; background: #e2e8f0; }
.rte-image-alt-cancel:hover { background: #cbd5e1; }
/* ── Placeholder ── */
.rte-content p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #cbd5e1;
  pointer-events: none;
  float: left;
  height: 0;
}
/* ── Toolbar dropdown hover fix ── */
.rte-toolbar .group:hover > div { display: block; }
`;