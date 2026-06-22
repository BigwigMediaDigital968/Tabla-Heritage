"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Link,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  Trash2,
  ArrowLeft,
  RotateCcw,
  FileText,
  Globe,
  HelpCircle,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface TextEditorProps {
  initialData?: {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    content: string;
    bannerImage: string;
    bannerAltText: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    faqs: FAQItem[];
    status: "published" | "draft";
  };
}

export default function TextEditor({ initialData }: TextEditorProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const editorRef = useRef<HTMLDivElement>(null);

  // Active Tab View Workspace State
  const [activeTab, setActiveTab] = useState<
    "general" | "editor" | "code" | "seo" | "faqs"
  >("general");

  // Complete Input State Matrix
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || "",
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [bannerImage, setBannerImage] = useState(
    initialData?.bannerImage || "",
  );
  const [bannerAltText, setBannerAltText] = useState(
    initialData?.bannerAltText || "",
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription || "",
  );
  const [keywordsRaw, setKeywordsRaw] = useState(
    initialData?.metaKeywords?.join(", ") || "",
  );
  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status || "draft",
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(
    initialData?.faqs?.length
      ? initialData.faqs
      : [{ question: "", answer: "" }],
  );

  // Media Upload Modal Context States
  const [showAltModal, setShowAltModal] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState("");
  const [altText, setAltText] = useState("");

  // Sync editor innerHTML safely when content or view modes shift
  useEffect(() => {
    if (
      activeTab === "editor" &&
      editorRef.current &&
      editorRef.current.innerHTML !== content
    ) {
      editorRef.current.innerHTML = content;
    }
  }, [activeTab]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      );
    }
  };

  const executeCommand = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const uploadAssetToCloudinary = async (
    file: File,
  ): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.success ? data.url : null;
    } catch (err) {
      console.error("Asset dispatch failure:", err);
      return null;
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const uploadedUrl = await uploadAssetToCloudinary(file);
          if (uploadedUrl) promptImageAltConfiguration(uploadedUrl);
        }
      }
    }
  };

  const handleLocalImagePick = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadAssetToCloudinary(file);
      if (uploadedUrl) promptImageAltConfiguration(uploadedUrl);
    }
  };

  const promptImageAltConfiguration = (url: string) => {
    setPendingImageUrl(url);
    setAltText("");
    setShowAltModal(true);
  };

  const insertImageIntoEditor = () => {
    if (!pendingImageUrl) return;
    const imgTag = `<img src="${pendingImageUrl}" alt="${altText || "Blog asset layout"}" class="max-w-full h-auto rounded-xl border border-neutral-800 my-4 block" />`;

    if (activeTab === "editor" && editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, imgTag);
      setContent(editorRef.current.innerHTML);
    } else {
      setContent((prev) => prev + "\n" + imgTag);
    }
    setShowAltModal(false);
    setPendingImageUrl("");
  };

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: initialData?._id,
      title,
      slug,
      shortDescription,
      content,
      bannerImage,
      bannerAltText,
      metaTitle,
      metaDescription,
      status,
      metaKeywords: keywordsRaw
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k),
      faqs: faqs.filter((f) => f.question && f.answer),
    };

    try {
      const res = await fetch("/api/blog", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save rejected");
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-white p-6 font-sans text-left">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumbs */}
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Articles Ledger
        </button>

        <div className="border-b border-neutral-800 pb-5">
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            {isEditing ? "Modify Blog Attributes" : "Compose New Publication"}
          </h1>
          <p className="text-xs text-neutral-400">
            Complete content layout composition workspace engine
          </p>
        </div>

        {/* Tab Control Header Navigation */}
        <div className="flex space-x-1 border-b border-neutral-800 bg-[#141312] p-1 rounded-t-2xl">
          {[
            { id: "general", label: "General Ledger", icon: FileText },
            { id: "editor", label: "Visual Editor", icon: ImageIcon },
            { id: "code", label: "HTML Source Code", icon: Code },
            { id: "seo", label: "SEO Configs", icon: Globe },
            { id: "faqs", label: "Structured FAQs", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#c5a880] text-white"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Document Body Context Form Wrapper */}
        <form
          onSubmit={handleSaveWorkspace}
          className="bg-[#141312] border border-neutral-800 border-t-0 p-8 rounded-b-3xl shadow-xl space-y-6"
        >
          {/* TAB 1: GENERAL DATA DETAILS */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1a1917] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    URL Route Path Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                    }
                    className="w-full px-4 py-2.5 bg-[#1a1917] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Short Summary Abstract
                </label>
                <textarea
                  rows={3}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1a1917] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-sm text-white resize-none focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Banner Image URL
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1a1917] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Banner Alt Accessibility String
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerAltText}
                    onChange={(e) => setBannerAltText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1a1917] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL RICH TEXT INTERACTIVE WYSIWYG */}
          {activeTab === "editor" && (
            <div className="space-y-3">
              <div className="w-full border border-neutral-800 bg-[#161513] rounded-2xl overflow-hidden focus-within:border-[#c5a880] transition-colors relative">
                {/* Toolbelt Management Controls */}
                <div className="p-2.5 bg-[#1a1917] border-b border-neutral-800 flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => executeCommand("formatBlock", "<h1>")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Heading 1"
                  >
                    <Heading1 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("formatBlock", "<h2>")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Heading 2"
                  >
                    <Heading2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("formatBlock", "<h3>")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Heading 3"
                  >
                    <Heading3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("formatBlock", "<h4>")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Heading 4"
                  >
                    <Heading4 size={15} />
                  </button>
                  <div className="w-px h-4 bg-neutral-800 mx-1" />
                  <button
                    type="button"
                    onClick={() => executeCommand("bold")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Bold"
                  >
                    <Bold size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("italic")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Italic"
                  >
                    <Italic size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("insertUnorderedList")}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Bullet List"
                  >
                    <List size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("removeFormat")}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-neutral-800"
                    title="Clear Formatting"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <div className="w-px h-4 bg-neutral-800 mx-1" />
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt("Enter link path URL:");
                      if (url) executeCommand("createLink", url);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                    title="Insert Link"
                  >
                    <Link size={15} />
                  </button>

                  {/* Media Embed Triggers */}
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt(
                        "Specify image asset source string URL:",
                      );
                      if (url) promptImageAltConfiguration(url);
                    }}
                    className="p-1.5 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-neutral-800"
                    title="Insert Image via String URL"
                  >
                    <Link size={15} className="rotate-45" />
                  </button>
                  <label
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer flex items-center justify-center"
                    title="Upload Local Device Asset"
                  >
                    <ImageIcon size={15} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLocalImagePick}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Fixed placeholder error by leveraging data-attribute tied with custom module css below */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={() => setContent(editorRef.current?.innerHTML || "")}
                  onPaste={handlePaste}
                  className="p-4 min-h-[380px] max-h-[600px] overflow-y-auto font-sans text-sm text-neutral-200 outline-none bg-[#141312] prose prose-invert max-w-none relative editor-canvas"
                  data-placeholder="Compose rich informative visual block structures directly or paste screenshot files safely..."
                />
              </div>
            </div>
          )}

          {/* TAB 3: HTML MARKUP SOURCE CODE INTERFACE */}
          {activeTab === "code" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                HTML Core Markup Editor
              </label>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 bg-[#161513] border border-neutral-800 focus:border-[#c5a880] rounded-xl font-mono text-xs text-emerald-400 focus:outline-none leading-relaxed"
              />
            </div>
          )}

          {/* TAB 4: ORGANIC SEO METADATA PARAMETERS */}
          {activeTab === "seo" && (
            <div className="space-y-4 bg-[#1a1917] p-5 rounded-2xl border border-neutral-800">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c5a880] block">
                Search Engine Meta Configurations
              </span>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                    Meta Title Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141312] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                    Meta Description Snippet
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141312] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-xs text-white resize-none focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                    Target Keywords (Comma Separated Values)
                  </label>
                  <input
                    type="text"
                    required
                    value={keywordsRaw}
                    onChange={(e) => setKeywordsRaw(e.target.value)}
                    placeholder="tabla loops, rhythm metrics, classical training"
                    className="w-full px-3 py-2 bg-[#141312] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NESTED STRUCTURED FAQS ACCORDION MATRIX */}
          {activeTab === "faqs" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Structured Schema FAQ Entries
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFaqs([...faqs, { question: "", answer: "" }])
                  }
                  className="text-xs text-[#c5a880] font-bold uppercase hover:underline"
                >
                  + Add Entry Row
                </button>
              </div>
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-[#1a1917] border border-neutral-800 rounded-xl"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Question Parameters"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[index].question = e.target.value;
                          setFaqs(updated);
                        }}
                        className="w-full px-3 py-2 bg-[#141312] border border-neutral-800 rounded-lg text-xs text-white focus:outline-none"
                      />
                      <textarea
                        placeholder="Answer Statement Context"
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[index].answer = e.target.value;
                          setFaqs(updated);
                        }}
                        className="w-full px-3 py-2 bg-[#141312] border border-neutral-800 rounded-lg text-xs text-white resize-none focus:outline-none"
                      />
                    </div>
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setFaqs(faqs.filter((_, i) => i !== index))
                        }
                        className="text-neutral-500 hover:text-rose-400 self-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Lifecycle Workflow Visibility Status Toggle */}
          <div className="space-y-1.5 pt-4 border-t border-neutral-800/60">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
              Workspace Distribution State Visibility
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-4 py-2 bg-[#1a1917] border border-neutral-800 text-xs text-white rounded-xl focus:outline-none focus:border-[#c5a880]"
            >
              <option value="draft">
                Draft (Hidden globally from public clients)
              </option>
              <option value="published">
                Published (Visible on runtime route pipelines)
              </option>
            </select>
          </div>

          {/* Global Operations Executable Action Bar */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-400 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#b3956d] text-white font-semibold text-xs rounded-xl uppercase tracking-wider shadow-md"
            >
              Commit Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Pop-Up Alt Text Metadata Assignment Modal Layout */}
      {showAltModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#1a1917] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl text-left">
            <div>
              <h4 className="text-sm font-semibold text-white">
                Configure Accessibility Metadata
              </h4>
              <p className="text-[11px] text-neutral-400">
                Specify alternative text fields for SEO index mapping validation
                checks
              </p>
            </div>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g., Close-up shot of instrument key structure patterns"
              className="w-full px-3 py-2 bg-[#141312] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-xs text-white focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAltModal(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImageIntoEditor}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#c5a880] text-white"
              >
                Embed Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Structural CSS Rules injection to mimic a native div text placeholder */}
      <style jsx global>{`
        .editor-canvas:empty:before {
          content: attr(data-placeholder);
          position: absolute;
          color: #525252;
          font-style: italic;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
