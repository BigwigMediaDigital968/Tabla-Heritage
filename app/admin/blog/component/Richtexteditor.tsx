"use client";

// ─── RichTextEditor.tsx ───────────────────────────────────────────────────────
// A fully-featured standalone rich-text editor built on Tiptap.
// Supports: text styles (P / H1-H6), font sizes, font family, bold, italic,
// underline, strikethrough, highlight (multi-color), text color, inline code,
// code block, subscript, superscript, alignment, bullet/ordered lists, blockquote,
// HR, link, image (via prop callback), undo/redo, word/char count.
//
// Props:
//   content       – HTML string (controlled)
//   onChange      – called with new HTML on every change
//   onImageClick  – called when the image toolbar button is clicked
//   onLinkClick   – called when the link toolbar button is clicked
//   placeholder   – editor placeholder text

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CharacterCount from "@tiptap/extension-character-count";
import FontFamily from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";

// ─── FontSize extension (Tiptap doesn't ship one, so we roll a small one) ────
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    } as any;
  },
});

// ─── Image extension with an inline alt-text editor ──────────────────────────
// Clicking any image in the content opens a small panel directly beneath it
// with an input pre-filled with the current alt text. Enter/Save commits the
// change (via a direct node-attribute transaction, so undo/redo and onChange
// both keep working normally); Escape/Cancel discards it. Images missing alt
// text get a dashed amber outline as a gentle accessibility nudge.
const ImageWithAltEditor = Image.extend({
  addNodeView() {
    return ({ node, editor, getPos }: any) => {
      const baseClass = (this.options as any)?.HTMLAttributes?.class || "";

      const wrapper = document.createElement("div");
      wrapper.className = "rte-image-wrapper";

      const img = document.createElement("img");
      img.className = `${baseClass} rte-image`.trim();
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      if (node.attrs.title) img.title = node.attrs.title;
      wrapper.appendChild(img);

      const syncEmptyAltFlag = () => {
        img.classList.toggle("rte-image-no-alt", !node.attrs.alt);
      };
      syncEmptyAltFlag();

      let panel: HTMLDivElement | null = null;
      let outsideHandler: ((e: MouseEvent) => void) | null = null;

      const closePanel = () => {
        if (!panel) return;
        panel.remove();
        panel = null;
        if (outsideHandler) {
          document.removeEventListener("mousedown", outsideHandler);
          outsideHandler = null;
        }
      };

      const commitAlt = (value: string) => {
        if (typeof getPos !== "function") return;
        const pos = getPos();
        const tr = editor.state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          alt: value,
        });
        editor.view.dispatch(tr);
      };

      const openPanel = () => {
        if (panel) return;

        panel = document.createElement("div");
        panel.className = "rte-image-alt-panel";

        const label = document.createElement("label");
        label.className = "rte-image-alt-label";
        label.textContent = "Alt text (for accessibility & SEO)";

        const row = document.createElement("div");
        row.className = "rte-image-alt-row";

        const input = document.createElement("input");
        input.type = "text";
        input.value = node.attrs.alt || "";
        input.placeholder = "Describe this image…";
        input.className = "rte-image-alt-input";

        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.textContent = "Save";
        saveBtn.className = "rte-image-alt-save";

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "rte-image-alt-cancel";

        const commit = () => {
          commitAlt(input.value.trim());
          closePanel();
        };

        saveBtn.addEventListener("mousedown", (e) => { e.preventDefault(); e.stopPropagation(); commit(); });
        cancelBtn.addEventListener("mousedown", (e) => { e.preventDefault(); e.stopPropagation(); closePanel(); });
        input.addEventListener("mousedown", (e) => e.stopPropagation());
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") { e.preventDefault(); closePanel(); }
        });

        row.append(input, saveBtn, cancelBtn);
        panel.append(label, row);
        wrapper.appendChild(panel);

        requestAnimationFrame(() => input.focus());

        outsideHandler = (e: MouseEvent) => {
          if (!wrapper.contains(e.target as Node)) closePanel();
        };
        document.addEventListener("mousedown", outsideHandler);
      };

      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        panel ? closePanel() : openPanel();
      });

      return {
        dom: wrapper,
        update(updatedNode: any) {
          if (updatedNode.type.name !== node.type.name) return false;
          node = updatedNode;
          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || "";
          syncEmptyAltFlag();
          return true;
        },
        selectNode() {
          img.classList.add("rte-image-selected");
        },
        deselectNode() {
          img.classList.remove("rte-image-selected");
        },
        destroy() {
          closePanel();
        },
        // Let our own input/buttons handle their events instead of ProseMirror
        // trying to interpret keystrokes/clicks inside the panel as doc edits.
        stopEvent(event: Event) {
          return !!(panel && panel.contains(event.target as Node));
        },
      };
    };
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RichTextEditorHandle {
  getHTML: () => string;
  setContent: (html: string) => void;
  insertImage: (url: string, alt?: string) => void;
  setLink: (url: string) => void;
  unsetLink: () => void;
  getLinkUrl: () => string;
  focus: () => void;
}

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  onImageClick?: () => void;
  onLinkClick?: () => void;
  placeholder?: string;
  /** Called with a pasted/dropped image File. Must resolve to a hosted URL (e.g. via /api/upload). */
  onUploadImage?: (file: File) => Promise<string>;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const FONT_SIZES = ["10px","11px","12px","13px","14px","15px","16px","18px","20px","22px","24px","28px","32px","36px","42px","48px","56px","64px","72px"];
const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Sans-serif", value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

const TEXT_STYLES = [
  { label: "Paragraph", tag: "p" as const, level: undefined },
  { label: "Heading 1", tag: "h" as const, level: 1 },
  { label: "Heading 2", tag: "h" as const, level: 2 },
  { label: "Heading 3", tag: "h" as const, level: 3 },
  { label: "Heading 4", tag: "h" as const, level: 4 },
  { label: "Heading 5", tag: "h" as const, level: 5 },
  { label: "Heading 6", tag: "h" as const, level: 6 },
];

// ─── Toolbar sub-components ───────────────────────────────────────────────────
function ToolBtn({
  onClick, active, title, disabled, children,
}: {
  onClick: () => void; active?: boolean; title: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors disabled:opacity-40 ${
        active ? "bg-[#1fa8e8] text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 mx-0.5 flex-shrink-0" />;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  Bold:        () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/></svg>,
  Italic:      () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M10 4v2h2.5l-3 12H7v2h7v-2h-2.5l3-12H17V4z"/></svg>,
  Underline:   () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M5 21h14v-2H5v2zM12 17a6 6 0 0 0 6-6V3h-2v8a4 4 0 0 1-8 0V3H6v8a6 6 0 0 0 6 6z"/></svg>,
  Strike:      () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.116H3v-2h18v2h-3.846zM11.26 5c-0.927 0-1.66.243-2.197.73-.538.486-.806 1.144-.806 1.974 0 .64.161 1.173.484 1.6.323.428.805.77 1.446 1.026l2.86 1.092c.1-.022.203-.044.305-.069H20v2H3v-2H4.5a6.9 6.9 0 0 1-.362-.606C3.713 10.17 3.5 9.375 3.5 8.5c0-1.457.548-2.61 1.645-3.46C6.242 4.192 7.647 3.8 9.36 3.8c1.455 0 2.916.39 4.38 1.17l-1.08 1.7c-1.19-.583-2.267-.87-3.4-.87z"/></svg>,
  Code:        () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
  CodeBlock:   () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H4V5h16v14zM6.293 15.707l1.414 1.414L12 12.828l-4.293-4.293-1.414 1.414L9.172 12l-2.879 2.879zm5.707.293h6v-2h-6v2z"/></svg>,
  BulletList:  () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M4 6h2v2H4zm0 5h2v2H4zm0 5h2v2H4zM8 6h12v2H8zm0 5h12v2H8zm0 5h12v2H8z"/></svg>,
  OrderedList: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H8zm0 14h14v-2H8v2zm0-6h14v-2H8v2z"/></svg>,
  Blockquote:  () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>,
  Hr:          () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20 11H4v2h16z"/></svg>,
  AlignLeft:   () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3 3h18v2H3zM3 7h12v2H3zM3 11h18v2H3zM3 15h12v2H3zM3 19h18v2H3z"/></svg>,
  AlignCenter: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3 3h18v2H3zM6 7h12v2H6zM3 11h18v2H3zM6 15h12v2H6zM3 19h18v2H3z"/></svg>,
  AlignRight:  () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3 3h18v2H3zM9 7h12v2H9zM3 11h18v2H3zM9 15h12v2H9zM3 19h18v2H3z"/></svg>,
  AlignJustify:() => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3 3h18v2H3zM3 7h18v2H3zM3 11h18v2H3zM3 15h18v2H3zM3 19h18v2H3z"/></svg>,
  Link:        () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/></svg>,
  Image:       () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  Highlight:   () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36C21.78 20.68 23 19.72 23 18.42V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.28-.79z"/></svg>,
  Subscript:   () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20 18h-2v1h3v1h-4v-2.5c0-.28.22-.5.5-.5h2v-1h-2.5v-1H20c.28 0 .5.22.5.5V15c0 .28-.22.5-.5.5zm-8.37-3L5.96 3H8.3l4.03 7.76L16.36 3h2.34L12.99 12l3.69 7H14.3l-4.42-8.38L5.42 19H3.09z"/></svg>,
  Superscript: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20 8h-2v1h3v1h-4V7.5c0-.28.22-.5.5-.5h2v-1h-2.5V5H20c.28 0 .5.22.5.5V6c0 .28-.22.5-.5.5zm-8.37 7L5.96 3H8.3l4.03 7.76L16.36 3h2.34L12.99 12l3.69 7H14.3l-4.42-8.38L5.42 19H3.09z"/></svg>,
  Undo:        () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62C8.72 11.36 10.53 10.5 12.5 10.5c3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>,
  Redo:        () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>,
  ClearFormat: () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.93L16.73 21 18 19.73 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>,
  SourceCode:  () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
};

// ─── Default upload helper ────────────────────────────────────────────────────
// Used when the parent doesn't supply its own onUploadImage. Hits the same
// /api/upload endpoint the toolbar's Image modal already uses (Cloudinary etc).
async function defaultUploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Upload failed");
  return data.url as string;
}

// Converts a base64 data: URL (as produced by clipboard paste of rich HTML
// from apps like Word/Google Docs) into a real File object we can upload.
function dataUrlToFile(dataUrl: string, filename: string): File | null {
  const match = dataUrl.match(/^data:(.+?);base64,(.*)$/);
  if (!match) return null;
  const mime = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

// ─── HTML pretty-printer ──────────────────────────────────────────────────────
// Tiptap's getHTML() returns one unbroken line with no indentation, which is
// unreadable in a code-view textarea. This is a small, dependency-free
// formatter: block-level tags (p, h1-h6, ul/ol/li, blockquote, etc.) get their
// own indented line; inline tags (strong, em, a, code, span...) and text stay
// glued together on the same line as their containing block, since breaking
// those up makes the markup harder to read, not easier. A final pass collapses
// simple leaf blocks like "<h1>\n  Title\n</h1>" back onto one line.
const BLOCK_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "ul", "ol", "li",
  "blockquote", "pre", "hr", "table", "thead", "tbody", "tr", "td", "th",
  "section", "article", "figure", "figcaption",
]);
const VOID_TAGS = new Set(["img", "br", "hr", "input", "meta", "link"]);

function formatHtml(html: string, indentSize = 2): string {
  if (!html.trim()) return "";

  const tokens = html.match(/<[^>]+>|[^<]+/g) || [];
  const indentUnit = " ".repeat(indentSize);
  let depth = 0;
  const lines: string[] = [];
  let buffer = ""; // accumulates inline content for the current open block

  const flushBuffer = () => {
    if (buffer.trim()) lines.push(indentUnit.repeat(depth) + buffer.trim());
    buffer = "";
  };

  for (const raw of tokens) {
    if (!raw) continue;
    const isTag = raw.startsWith("<");

    if (!isTag) {
      // Plain text — collapse internal whitespace/newlines, glue to buffer.
      buffer += raw.replace(/\s+/g, " ");
      continue;
    }

    const tagNameMatch = raw.match(/^<\/?([a-zA-Z0-9-]+)/);
    const tagName = (tagNameMatch?.[1] || "").toLowerCase();
    const isClosing = raw.startsWith("</");
    const isVoid = VOID_TAGS.has(tagName) || raw.endsWith("/>");
    const isBlock = BLOCK_TAGS.has(tagName);

    if (!isBlock) {
      // Inline tag (or unrecognized tag) — keep glued to current buffer
      // so formatting like <strong>bold</strong> doesn't get fragmented.
      buffer += raw;
      continue;
    }

    if (isClosing) {
      flushBuffer();
      depth = Math.max(0, depth - 1);
      lines.push(indentUnit.repeat(depth) + raw);
    } else {
      flushBuffer();
      lines.push(indentUnit.repeat(depth) + raw);
      if (!isVoid) depth += 1;
    }
  }
  flushBuffer();

  // Collapse "<tag>" / single content line / "</tag>" triples onto one line
  // when the content has no nested block tags of its own, e.g.
  // <h1>\n  Title\n</h1>  →  <h1>Title</h1>
  const collapsed: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const openMatch = lines[i].trim().match(/^<([a-zA-Z0-9-]+)([^>]*)>$/);
    if (openMatch && i + 2 < lines.length && lines[i + 2].trim() === `</${openMatch[1]}>`) {
      const contentLine = lines[i + 1].trim();
      const contentIsBlockOpen =
        /^<[a-zA-Z0-9-]+[^>]*>$/.test(contentLine) &&
        BLOCK_TAGS.has((contentLine.match(/^<([a-zA-Z0-9-]+)/)?.[1] || "").toLowerCase());
      if (!contentIsBlockOpen) {
        const indent = lines[i].match(/^\s*/)?.[0] || "";
        collapsed.push(`${indent}<${openMatch[1]}${openMatch[2]}>${contentLine}</${openMatch[1]}>`);
        i += 2;
        continue;
      }
    }
    collapsed.push(lines[i]);
  }

  return collapsed.join("\n");
}

// ─── Highlight Colors ─────────────────────────────────────────────────────────
const HIGHLIGHT_COLORS = [
  "#fef08a","#bbf7d0","#bfdbfe","#fecaca","#f5d0fe",
  "#fed7aa","#e0e7ff","#ccfbf1","#fce7f3","#ffffff",
];

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function Toolbar({
  editor,
  onImageClick,
  onLinkClick,
  codeViewActive,
  onToggleCodeView,
}: {
  editor: ReturnType<typeof useEditor> | null;
  onImageClick: () => void;
  onLinkClick: () => void;
  codeViewActive: boolean;
  onToggleCodeView: () => void;
}) {
  if (!editor) return null;

  // Determine active text style label
  const activeStyle = TEXT_STYLES.find((s) =>
    s.level
      ? editor.isActive("heading", { level: s.level })
      : editor.isActive("paragraph")
  );

  // Determine active font size
  const activeFontSize = editor.getAttributes("textStyle").fontSize || "";

  // Determine active font family
  const activeFontFamily = editor.getAttributes("textStyle").fontFamily || "";
  const activeFontLabel =
    FONT_FAMILIES.find((f) => f.value === activeFontFamily)?.label || "Font";

  const applyStyle = (s: (typeof TEXT_STYLES)[0]) => {
    if (s.level) {
      editor.chain().focus().toggleHeading({ level: s.level as any }).run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  };

  return (
    <div className="rte-toolbar border-b border-slate-200 bg-slate-50 rounded-t-2xl">
      <div className={codeViewActive ? "opacity-40 pointer-events-none" : ""}>
        {/* Row 1: Style / Font / Size / Colors */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-100">
        {/* Text style dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1 px-2 h-8 rounded-lg text-sm text-slate-600 hover:bg-slate-100 whitespace-nowrap min-w-[110px]"
            title="Text style"
          >
            <span className="flex-1 text-left text-xs font-medium">
              {activeStyle?.label || "Paragraph"}
            </span>
            <Icons.ChevronDown />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[150px] py-1 hidden group-hover:block">
            {TEXT_STYLES.map((s) => (
              <button
                key={s.label}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); applyStyle(s); }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors ${
                  (s.level
                    ? editor.isActive("heading", { level: s.level })
                    : editor.isActive("paragraph"))
                    ? "text-[#1fa8e8] font-medium"
                    : "text-slate-700"
                }`}
                style={
                  s.level
                    ? { fontSize: `${Math.max(0.75, 1.4 - (s.level - 1) * 0.15)}rem`, fontWeight: 700 }
                    : {}
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        {/* Font family dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1 px-2 h-8 rounded-lg text-sm text-slate-600 hover:bg-slate-100 whitespace-nowrap min-w-[90px]"
            title="Font family"
          >
            <span className="flex-1 text-left text-xs">{activeFontLabel}</span>
            <Icons.ChevronDown />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[170px] py-1 hidden group-hover:block">
            {FONT_FAMILIES.map((f) => (
              <button
                key={f.label}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  f.value
                    ? editor.chain().focus().setFontFamily(f.value).run()
                    : editor.chain().focus().unsetFontFamily().run();
                }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors ${
                  activeFontFamily === f.value ? "text-[#1fa8e8] font-medium" : "text-slate-700"
                }`}
                style={{ fontFamily: f.value || "inherit" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        {/* Font size dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1 px-2 h-8 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
            title="Font size"
          >
            <span className="text-xs min-w-[30px] text-left">{activeFontSize || "Size"}</span>
            <Icons.ChevronDown />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 min-w-[80px] py-1 hidden group-hover:block max-h-60 overflow-y-auto">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); (editor.chain().focus() as any).unsetFontSize().run(); }}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50"
            >
              Default
            </button>
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); (editor.chain().focus() as any).setFontSize(size).run(); }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
                  activeFontSize === size ? "text-[#1fa8e8] font-medium" : "text-slate-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        {/* Text color */}
        <div className="flex items-center gap-1 px-1" title="Text color">
          <span className="text-xs font-bold text-slate-600">A</span>
          <input
            type="color"
            className="w-5 h-5 cursor-pointer rounded border-0 p-0 bg-transparent"
            value={editor.getAttributes("textStyle").color || "#000000"}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            title="Text color"
          />
        </div>

        {/* Highlight colors */}
        <div className="relative group">
          <button
            type="button"
            className={`flex items-center gap-0.5 w-8 h-8 justify-center rounded-lg transition-colors ${
              editor.isActive("highlight") ? "bg-[#1fa8e8] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Highlight color"
          >
            <Icons.Highlight />
          </button>
          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 hidden group-hover:block">
            <div className="grid grid-cols-5 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleHighlight({ color }).run();
                  }}
                  className="w-5 h-5 rounded border border-slate-200 hover:scale-110 transition-transform"
                  style={{ background: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); }}
              className="mt-1 w-full text-xs text-slate-400 hover:text-slate-600 text-center"
            >
              None
            </button>
          </div>
        </div>

        <Divider />

        {/* Clear formatting */}
        <ToolBtn title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <Icons.ClearFormat />
        </ToolBtn>
      </div>

      {/* Row 2: Inline / Structure / Align / Media */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        {/* Undo / Redo */}
        <ToolBtn title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Icons.Undo />
        </ToolBtn>
        <ToolBtn title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Icons.Redo />
        </ToolBtn>

        <Divider />

        {/* Inline formatting */}
        <ToolBtn title="Bold (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Icons.Bold />
        </ToolBtn>
        <ToolBtn title="Italic (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Icons.Italic />
        </ToolBtn>
        <ToolBtn title="Underline (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Icons.Underline />
        </ToolBtn>
        <ToolBtn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Icons.Strike />
        </ToolBtn>
        <ToolBtn title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Icons.Code />
        </ToolBtn>
        <ToolBtn title="Subscript" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
          <Icons.Subscript />
        </ToolBtn>
        <ToolBtn title="Superscript" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
          <Icons.Superscript />
        </ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <Icons.AlignLeft />
        </ToolBtn>
        <ToolBtn title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <Icons.AlignCenter />
        </ToolBtn>
        <ToolBtn title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <Icons.AlignRight />
        </ToolBtn>
        <ToolBtn title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <Icons.AlignJustify />
        </ToolBtn>

        <Divider />

        {/* Lists & structure */}
        <ToolBtn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <Icons.BulletList />
        </ToolBtn>
        <ToolBtn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <Icons.OrderedList />
        </ToolBtn>
        <ToolBtn title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Icons.Blockquote />
        </ToolBtn>
        <ToolBtn title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Icons.CodeBlock />
        </ToolBtn>
        <ToolBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Icons.Hr />
        </ToolBtn>

        <Divider />

        {/* Link & Image */}
        <ToolBtn title="Insert / edit link" active={editor.isActive("link")} onClick={onLinkClick}>
          <Icons.Link />
        </ToolBtn>
        <ToolBtn title="Insert image" onClick={onImageClick}>
          <Icons.Image />
        </ToolBtn>
        </div>
      </div>

      {/* Source toggle lives outside the disabled wrapper so it's always clickable */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-t border-slate-100">
        <ToolBtn title={codeViewActive ? "Back to visual editor" : "View / edit HTML source"} active={codeViewActive} onClick={onToggleCodeView}>
          <Icons.SourceCode />
        </ToolBtn>
        <span className="text-xs text-slate-400 ml-1">{codeViewActive ? "Editing HTML source" : "View HTML source"}</span>
      </div>
    </div>
  );
}

// ─── Editor Styles ────────────────────────────────────────────────────────────
// We inject a <style> tag because Tailwind's preflight / prose resets strip
// heading sizes. These selectors target only the .rte-content area.
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

// ─── Main component ───────────────────────────────────────────────────────────
export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor(
    {
      content = "",
      onChange,
      onImageClick,
      onLinkClick,
      placeholder = "Start writing here…",
      onUploadImage,
    },
    ref
  ) {
    const uploadImage = onUploadImage ?? defaultUploadImage;

    // editor is assigned below; handlePaste/handleDrop close over this ref
    // since editorProps is evaluated before useEditor() returns the instance.
    const editorRef = useRef<ReturnType<typeof useEditor>>(null);

    const handleImageFile = useCallback(
      async (file: File) => {
        const ed = editorRef.current;
        if (!ed) return;

        // Insert a uniquely-identifiable placeholder node at the current
        // cursor position, and remember its position so we can swap it for
        // the real image later without disturbing anything the user typed
        // in the meantime (string-replace on HTML would break on duplicate
        // filenames or special characters, so we track the actual doc position).
        const placeholderText = `⏳ Uploading ${file.name}…`;

        ed.chain()
          .focus()
          .insertContent({ type: "paragraph", content: [{ type: "text", text: placeholderText }] })
          .run();

        try {
          const url = await uploadImage(file);

          // Locate the placeholder text fresh (positions may have shifted if
          // the user kept typing elsewhere while the upload was in flight).
          let foundFrom = -1;
          let foundTo = -1;
          ed.state.doc.nodesBetween(0, ed.state.doc.content.size, (node, pos) => {
            if (node.isText && node.text?.includes(placeholderText)) {
              const idx = node.text.indexOf(placeholderText);
              foundFrom = pos + idx;
              foundTo = foundFrom + placeholderText.length;
            }
          });

          if (foundFrom === -1) {
            // Placeholder text not found (e.g. user deleted it) — append image instead.
            ed.chain().focus().setImage({ src: url, alt: file.name }).run();
            return;
          }

          ed.chain()
            .focus()
            .deleteRange({ from: foundFrom, to: foundTo })
            .setImage({ src: url, alt: file.name })
            .run();
        } catch (err) {
          console.error("Image upload failed:", err);

          let foundFrom = -1;
          let foundTo = -1;
          ed.state.doc.nodesBetween(0, ed.state.doc.content.size, (node, pos) => {
            if (node.isText && node.text?.includes(placeholderText)) {
              const idx = node.text.indexOf(placeholderText);
              foundFrom = pos + idx;
              foundTo = foundFrom + placeholderText.length;
            }
          });
          if (foundFrom !== -1) {
            ed.chain()
              .focus()
              .insertContentAt(
                { from: foundFrom, to: foundTo },
                `⚠️ Failed to upload ${file.name}`
              )
              .run();
          }
        }
      },
      [uploadImage]
    );

    // Converts the rest of the non-text HTML (headings, paragraphs, lists,
    // etc.) untouched, but rewrites every base64 <img src="data:..."> to a
    // real hosted URL by uploading each one, then inserts the resulting HTML.
    const handlePastedHtmlWithEmbeddedImages = useCallback(
      async (html: string) => {
        const ed = editorRef.current;
        if (!ed) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const imgs = Array.from(doc.querySelectorAll('img[src^="data:image/"]'));

        if (imgs.length === 0) {
          ed.chain().focus().insertContent(html).run();
          return;
        }

        // Insert a placeholder immediately so paste doesn't feel like a no-op
        // while uploads run in the background.
        const placeholderText = `⏳ Uploading ${imgs.length} pasted image${imgs.length > 1 ? "s" : ""}…`;
        ed.chain()
          .focus()
          .insertContent({ type: "paragraph", content: [{ type: "text", text: placeholderText }] })
          .run();

        try {
          await Promise.all(
            imgs.map(async (img) => {
              const dataUrl = img.getAttribute("src") || "";
              const file = dataUrlToFile(dataUrl, `pasted-image-${Date.now()}.png`);
              if (!file) return;
              const url = await uploadImage(file);
              img.setAttribute("src", url);
            })
          );

          const finalHtml = doc.body.innerHTML;

          let foundFrom = -1;
          let foundTo = -1;
          ed.state.doc.nodesBetween(0, ed.state.doc.content.size, (node, pos) => {
            if (node.isText && node.text?.includes(placeholderText)) {
              const idx = node.text.indexOf(placeholderText);
              foundFrom = pos + idx;
              foundTo = foundFrom + placeholderText.length;
            }
          });

          if (foundFrom === -1) {
            ed.chain().focus().insertContent(finalHtml).run();
            return;
          }

          ed.chain()
            .focus()
            .deleteRange({ from: foundFrom, to: foundTo })
            .insertContent(finalHtml)
            .run();
        } catch (err) {
          console.error("Pasted image upload failed:", err);
          let foundFrom = -1;
          let foundTo = -1;
          ed.state.doc.nodesBetween(0, ed.state.doc.content.size, (node, pos) => {
            if (node.isText && node.text?.includes(placeholderText)) {
              const idx = node.text.indexOf(placeholderText);
              foundFrom = pos + idx;
              foundTo = foundFrom + placeholderText.length;
            }
          });
          if (foundFrom !== -1) {
            ed.chain()
              .focus()
              .insertContentAt({ from: foundFrom, to: foundTo }, "⚠️ Failed to upload pasted image(s)")
              .run();
          }
        }
      },
      [uploadImage]
    );

    const editor = useEditor({
      extensions: [
        StarterKit.configure({ codeBlock: { HTMLAttributes: { class: "" } } }),
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Highlight.configure({ multicolor: true }),
        TextStyle,
        Color,
        FontFamily,
        FontSize,
        Subscript,
        Superscript,
        CharacterCount,
        Link.configure({
          openOnClick: false,
          autolink: false,
          HTMLAttributes: { class: "text-[#1fa8e8] underline" },
        }),
        Placeholder.configure({ placeholder }),
        ImageWithAltEditor.configure({
          inline: false,
          allowBase64: false,
          HTMLAttributes: { class: "rounded-xl max-w-full my-4 mx-auto block" },
        }),
      ],
      content,
      editorProps: {
        attributes: { class: "rte-content" },
        handlePaste(view, event) {
          const items = Array.from(event.clipboardData?.items || []);

          // Case 1: a raw image is on the clipboard (screenshots, "copy image"
          // from most apps, copying an image from a file manager, etc).
          const imageItem = items.find((it) => it.type.startsWith("image/"));
          if (imageItem) {
            const file = imageItem.getAsFile();
            if (file) {
              event.preventDefault();
              handleImageFile(file);
              return true;
            }
          }

          // Case 2: rich HTML is on the clipboard (e.g. pasted from Word,
          // Google Docs, Notion, a webpage) and that HTML embeds images as
          // base64 data URLs. allowBase64 is intentionally false so these
          // would otherwise be silently dropped — intercept and upload them.
          const html = event.clipboardData?.getData("text/html");
          if (html && /<img[^>]+src=["']data:image\//i.test(html)) {
            event.preventDefault();
            handlePastedHtmlWithEmbeddedImages(html);
            return true;
          }

          return false; // let Tiptap handle everything else as usual
        },
        handleDrop(view, event) {
          const files = Array.from(event.dataTransfer?.files || []);
          const imageFile = files.find((f) => f.type.startsWith("image/"));
          if (!imageFile) return false; // let Tiptap/browser handle non-image drops

          event.preventDefault();
          handleImageFile(imageFile);
          return true;
        },
      },
      onUpdate({ editor }) {
        onChange?.(editor.getHTML());
      },
      immediatelyRender: false,
    });

    // Keep editorRef in sync so handlePaste/handleDrop (defined above, before
    // `editor` existed) always have access to the live editor instance.
    useEffect(() => {
      editorRef.current = editor;
    }, [editor]);

    // Sync external content changes (e.g. when loading a blog for editing)
    const prevContent = useRef(content);
    useEffect(() => {
      if (!editor || content === prevContent.current) return;
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content, {
            emitUpdate: false
          });
      }
      prevContent.current = content;
    }, [editor, content]);

    // Expose imperative API to parent (BlogFormPage) for image/link modal insertion
    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => editor?.getHTML() ?? "",
        setContent: (html: string) => {
          editor?.commands.setContent(html, {
            emitUpdate: false
          });
        },
        insertImage: (url: string, alt?: string) => {
          if (!url || !editor) return;
          editor.chain().focus().setImage({ src: url, alt: alt || "" }).run();
        },
        setLink: (url: string) => {
          if (!url || !editor) return;
          // If no text is selected, insert the URL as the link text
          if (editor.state.selection.empty) {
            editor
              .chain()
              .focus()
              .insertContent(`<a href="${url}">${url}</a>`)
              .run();
          } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }
        },
        unsetLink: () => {
          editor?.chain().focus().extendMarkRange("link").unsetLink().run();
        },
        getLinkUrl: () => editor?.getAttributes("link").href || "",
        focus: () => editor?.commands.focus(),
      }),
      [editor]
    );

    const wordCount = editor?.storage.characterCount.words() ?? 0;
    const charCount = editor?.storage.characterCount.characters() ?? 0;

    const handleImageClick = useCallback(() => onImageClick?.(), [onImageClick]);
    const handleLinkClick  = useCallback(() => onLinkClick?.(),  [onLinkClick]);

    // ── Code view (raw HTML) ──
    // Lets the user inspect and hand-edit the underlying HTML. Switching back
    // to the visual editor parses whatever HTML is in the textarea and loads
    // it into Tiptap, so manual edits (or pasted markup) take effect.
    const [codeViewActive, setCodeViewActive] = useState(false);
    const [htmlDraft, setHtmlDraft] = useState("");
    const [htmlError, setHtmlError] = useState("");

    const handleToggleCodeView = useCallback(() => {
      if (!editor) return;
      if (!codeViewActive) {
        // Entering code view: seed the textarea with current editor HTML,
        // pretty-printed so nested tags are readable instead of one long line.
        setHtmlDraft(formatHtml(editor.getHTML()));
        setHtmlError("");
        setCodeViewActive(true);
      } else {
        // Leaving code view: push the edited HTML back into the editor.
        // Whitespace/indentation in htmlDraft doesn't affect parsing here.
        try {
          editor.commands.setContent(htmlDraft, {
            emitUpdate: false
          });
          onChange?.(editor.getHTML());
          setCodeViewActive(false);
          setHtmlError("");
        } catch (err) {
          // setContent on malformed HTML rarely throws (the browser's HTML
          // parser is very forgiving), but guard anyway so a bad paste can't
          // silently lose the user's work.
          setHtmlError("Couldn't parse that HTML — fix any errors and try again.");
        }
      }
    }, [editor, codeViewActive, htmlDraft, onChange]);

    return (
      <>
        {/* Inject scoped editor styles once */}
        <style>{editorStyles}</style>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Toolbar
            editor={editor}
            onImageClick={handleImageClick}
            onLinkClick={handleLinkClick}
            codeViewActive={codeViewActive}
            onToggleCodeView={handleToggleCodeView}
          />

          {codeViewActive ? (
            <div>
              <textarea
                value={htmlDraft}
                onChange={(e) => { setHtmlDraft(e.target.value); setHtmlError(""); }}
                spellCheck={false}
                className="w-full min-h-[400px] px-5 py-4 font-mono text-sm text-slate-700 bg-slate-900/[0.02] focus:outline-none resize-y"
                placeholder="<p>Your HTML here…</p>"
              />
              {htmlError && (
                <p className="px-5 pb-2 text-xs text-red-500">{htmlError}</p>
              )}
              <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-t border-slate-100 bg-slate-50">
                <span className="text-xs text-slate-400">Editing raw HTML — switch back to the visual editor to apply it.</span>
                <button
                  type="button"
                  onClick={handleToggleCodeView}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ background: "linear-gradient(90deg,#1fa8e8,#6dbb45)" }}
                >
                  Apply &amp; preview
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="max-h-[600px] overflow-y-scroll">
                <EditorContent editor={editor} />
              </div>

              {/* Word / char count */}
              <div className="flex items-center justify-end gap-4 px-5 py-2 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                <span className="text-xs text-slate-400">{wordCount} words</span>
                <span className="text-xs text-slate-400">{charCount} characters</span>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
);