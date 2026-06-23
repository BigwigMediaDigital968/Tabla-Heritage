"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ArrowLeft,
  FileText,
  Code,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  Plus,
} from "lucide-react";
import {
  RichTextEditor,
  RichTextEditorHandle,
} from "@/app/admin/blog/component/Richtexteditor";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogFormInitialData {
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
}

interface TextEditorProps {
  initialData?: BlogFormInitialData;
}

type TabId = "general" | "editor" | "code" | "seo" | "faqs";

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "general", label: "General", icon: FileText },
  { id: "editor", label: "Visual Editor", icon: ImageIcon },
  { id: "code", label: "HTML Source", icon: Code },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
];

const EMPTY_FAQ: FAQItem = { question: "", answer: "" };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function BlogEditor({ initialData }: TextEditorProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  // Imperative handle into the Tiptap-based RichTextEditor, used to insert
  // images/links at the current cursor position from outside the editor
  // (toolbar callbacks fire before we have a URL, so the actual insert
  // happens later once upload + alt-text confirmation finish).
  const richTextRef = useRef<RichTextEditorHandle>(null);

  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form fields
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription ?? ""
  );
  const [content, setContent] = useState(initialData?.content ?? "");
  // Banner image: a new pick is held as a File (not uploaded yet) and only
  // sent to the server at save time, inside the same request as the rest
  // of the blog data. If editing and no new file is picked, the original
  // hosted URL travels as plain text so the server keeps the existing banner.
  const [bannerImageUrl, setBannerImageUrl] = useState(initialData?.bannerImage ?? "");
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(initialData?.bannerImage ?? "");
  const [bannerAltText, setBannerAltText] = useState(
    initialData?.bannerAltText ?? ""
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription ?? ""
  );
  const [keywordsRaw, setKeywordsRaw] = useState(
    initialData?.metaKeywords?.join(", ") ?? ""
  );
  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status ?? "draft"
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(
    initialData?.faqs?.length ? initialData.faqs : [EMPTY_FAQ]
  );

  // Image-insert modal state (toolbar image button -> choose Upload or URL,
  // enter alt text, then insert). One modal, two source tabs, single alt field.
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalTab, setImageModalTab] = useState<"upload" | "url">("upload");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [imageModalError, setImageModalError] = useState("");
  const pickerInputRef = useRef<HTMLInputElement>(null);

  // Link insertion modal state (toolbar link button -> ask URL -> insert)
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Local banner upload (replaces typing a raw URL)
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugLocked) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugLocked(true);
    setSlug(val.toLowerCase().replace(/\s+/g, "-"));
  };

  const uploadAssetToCloudinary = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data?.success ? data.url : null;
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Banner image: just pick the file and preview it locally. No network
  // call here — the file itself rides along in the save request below,
  // and the server is responsible for uploading it to Cloudinary.
  const handleBannerFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setBannerImageFile(file);
    setBannerPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.bannerImage;
      return next;
    });
  };

  // Revoke the blob preview URL on unmount to avoid leaking memory.
  useEffect(() => {
    return () => {
      if (bannerPreviewUrl && bannerPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fired by RichTextEditor's toolbar "Insert image" button. Opens the
  // combined modal instead of going straight to a file picker, since the
  // user can choose either Upload or URL from here.
  const handleToolbarImageClick = useCallback(() => {
    setImageModalTab("upload");
    setPendingFile(null);
    setPendingPreviewUrl("");
    setImageUrlInput("");
    setAltText("");
    setImageModalError("");
    setShowImageModal(true);
  }, []);

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setImageModalError("");
    setPendingFile(file);
    setPendingPreviewUrl(URL.createObjectURL(file));
  };

  const closeImageModal = () => {
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setShowImageModal(false);
    setPendingFile(null);
    setPendingPreviewUrl("");
    setImageUrlInput("");
    setAltText("");
    setImageModalError("");
  };

  const confirmImageInsert = async () => {
    setImageModalError("");

    let urlToInsert: string | null = null;

    if (imageModalTab === "upload") {
      if (!pendingFile) {
        setImageModalError("Choose an image file to upload.");
        return;
      }
      urlToInsert = await uploadAssetToCloudinary(pendingFile);
      if (!urlToInsert) {
        setImageModalError("Upload failed. Please try again.");
        return;
      }
    } else {
      const trimmed = imageUrlInput.trim();
      if (!trimmed) {
        setImageModalError("Enter an image URL.");
        return;
      }
      urlToInsert = trimmed;
    }

    richTextRef.current?.insertImage(urlToInsert, altText || "Blog content image");
    setContent(richTextRef.current?.getHTML() ?? content);
    closeImageModal();
  };

  // Fired by RichTextEditor's toolbar "Insert / edit link" button.
  const handleToolbarLinkClick = useCallback(() => {
    setLinkUrl(richTextRef.current?.getLinkUrl() ?? "");
    setShowLinkModal(true);
  }, []);

  const confirmLink = () => {
    const trimmed = linkUrl.trim();
    if (trimmed) {
      richTextRef.current?.setLink(trimmed);
    } else {
      richTextRef.current?.unsetLink();
    }
    setContent(richTextRef.current?.getHTML() ?? content);
    setShowLinkModal(false);
    setLinkUrl("");
  };

  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Title is required.";
    if (!slug.trim()) next.slug = "Slug is required.";
    if (!shortDescription.trim()) next.shortDescription = "Short description is required.";
    if (!bannerImageFile && !bannerImageUrl.trim()) next.bannerImage = "Banner image is required.";
    if (!bannerAltText.trim()) next.bannerAltText = "Banner alt text is required.";
    if (!metaTitle.trim()) next.metaTitle = "Meta title is required.";
    if (!metaDescription.trim()) next.metaDescription = "Meta description is required.";
    if (!content.trim() || content.trim() === "<p></p>") next.content = "Blog content is required.";
    setErrors(next);
    return next;
  }, [title, slug, shortDescription, bannerImageFile, bannerImageUrl, bannerAltText, metaTitle, metaDescription, content]);

  const firstErrorTab = (errs: Record<string, string>): TabId | null => {
    if (errs.title || errs.slug || errs.shortDescription || errs.bannerImage || errs.bannerAltText)
      return "general";
    if (errs.content) return "editor";
    if (errs.metaTitle || errs.metaDescription) return "seo";
    return null;
  };

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      const tab = firstErrorTab(validationErrors);
      if (tab) setActiveTab(tab);
      return;
    }

    setIsSaving(true);

    // FormData (not JSON) because the banner may be a raw File the user
    // just picked. The server uploads it to Cloudinary and stores the
    // resulting URL; everything else travels as plain string fields.
    //
    // - New/changed banner -> "bannerImage" field holds the File.
    // - Editing with no new pick -> "bannerImageUrl" holds the existing
    //   hosted URL, telling the server to keep using it as-is.
    const formData = new FormData();
    if (initialData?._id) formData.append("id", initialData._id);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("shortDescription", shortDescription);
    formData.append("content", content);
    formData.append("bannerAltText", bannerAltText);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("status", status);
    formData.append(
      "metaKeywords",
      JSON.stringify(
        keywordsRaw
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      )
    );
    formData.append(
      "faqs",
      JSON.stringify(faqs.filter((f) => f.question.trim() && f.answer.trim()))
    );

    if (bannerImageFile) {
      formData.append("bannerImage", bannerImageFile);
    } else if (bannerImageUrl) {
      formData.append("bannerImageUrl", bannerImageUrl);
    }

    try {
      const res = await fetch("/api/blog", {
        method: isEditing ? "PATCH" : "POST",
        body: formData,
        // No Content-Type header — the browser sets the correct
        // multipart/form-data boundary automatically for FormData bodies.
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // console.log(data)

        throw new Error(data?.error || "Something went wrong while saving. Please try again.");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      console.log(err)
      const message = err instanceof Error ? err.message : "Something went wrong while saving.";
      setErrors((prev) => ({ ...prev, submit: message }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="font-sans text-left text-[var(--foreground)]">
      <div className="w-full mx-auto space-y-6">
        {/* Breadcrumb */}
        <Link
          type="button"
          href={"/admin/blog"}
          className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Blogs
        </Link>

        <div className="border-b border-[var(--border)] pb-5">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {isEditing ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {isEditing
              ? "Update the content and metadata for this post."
              : "Write a new post and configure its SEO and FAQs."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-[var(--border)] bg-[var(--muted)] p-1 rounded-t-2xl">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const hasError =
              (tab.id === "general" &&
                (errors.title || errors.slug || errors.shortDescription || errors.bannerImage || errors.bannerAltText)) ||
              (tab.id === "editor" && errors.content) ||
              (tab.id === "seo" && (errors.metaTitle || errors.metaDescription));
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white"
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {hasError && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden />
                )}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSaveWorkspace}
          className="bg-white border border-[var(--border)] border-t-0 p-8 rounded-b-3xl shadow-md space-y-6"
        >
          {/* GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Blog Title" error={errors.title}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={inputClass(!!errors.title)}
                    placeholder="e.g. Understanding Chronic Cough"
                  />
                </Field>
                <Field label="URL Slug" error={errors.slug}>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className={inputClass(!!errors.slug)}
                    placeholder="understanding-chronic-cough"
                  />
                </Field>
              </div>

              <Field label="Short Description" error={errors.shortDescription}>
                <textarea
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className={`${inputClass(!!errors.shortDescription)} resize-none`}
                  placeholder="A one to two sentence summary shown on the blog listing page."
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Banner Image" error={errors.bannerImage}>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed rounded-xl text-xs font-medium transition-colors ${
                        errors.bannerImage
                          ? "border-red-400 text-red-500 hover:border-red-500"
                          : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      }`}
                    >
                      <ImageIcon size={14} />
                      {bannerPreviewUrl ? "Choose a different image" : "Choose an image from your computer"}
                    </button>
                  </div>
                  {bannerImageFile && (
                    <p className="text-[11px] text-[var(--muted-foreground)] truncate mt-1">
                      {bannerImageFile.name} — uploads when you save
                    </p>
                  )}
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFilePicked}
                    className="hidden"
                  />
                </Field>
                <Field label="Banner Alt Text" error={errors.bannerAltText}>
                  <input
                    type="text"
                    value={bannerAltText}
                    onChange={(e) => setBannerAltText(e.target.value)}
                    className={inputClass(!!errors.bannerAltText)}
                    placeholder="Describe the banner image for accessibility"
                  />
                </Field>
              </div>

              {bannerPreviewUrl && (
                <div className="rounded-xl border border-[var(--border)] overflow-hidden max-w-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bannerPreviewUrl}
                    alt={bannerAltText || "Banner preview"}
                    className="w-full h-40 object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>
          )}

          {/* VISUAL EDITOR */}
          {activeTab === "editor" && (
            <div className="space-y-3">
              {errors.content && <p className="text-xs text-red-600">{errors.content}</p>}

              <RichTextEditor
                ref={richTextRef}
                content={content}
                onChange={setContent}
                onImageClick={handleToolbarImageClick}
                onLinkClick={handleToolbarLinkClick}
                onUploadImage={uploadAssetToCloudinary as (file: File) => Promise<string>}
                placeholder="Start writing your post, or paste an image directly..."
              />
            </div>
          )}

          {/* HTML SOURCE */}
          {activeTab === "code" && (
            <Field label="HTML Source" error={errors.content}>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`${inputClass(!!errors.content)} font-mono text-xs leading-relaxed`}
                placeholder="<p>Write raw HTML here...</p>"
              />
            </Field>
          )}

          {/* SEO */}
          {activeTab === "seo" && (
            <div className="space-y-4 bg-[var(--muted)] p-5 rounded-2xl border border-[var(--border)]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] block">
                Search Engine Metadata
              </span>
              <Field label="Meta Title" error={errors.metaTitle}>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className={inputClass(!!errors.metaTitle, true)}
                />
              </Field>
              <Field label="Meta Description" error={errors.metaDescription}>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className={`${inputClass(!!errors.metaDescription, true)} resize-none`}
                />
              </Field>
              <Field label="Keywords (comma separated)">
                <input
                  type="text"
                  value={keywordsRaw}
                  onChange={(e) => setKeywordsRaw(e.target.value)}
                  placeholder="chronic cough, pulmonology, breathing tests"
                  className={inputClass(false, true)}
                />
              </Field>
            </div>
          )}

          {/* FAQS */}
          {activeTab === "faqs" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  FAQ Entries
                </label>
                <button
                  type="button"
                  onClick={() => setFaqs((prev) => [...prev, { ...EMPTY_FAQ }])}
                  className="flex items-center gap-1 text-xs text-[var(--primary)] font-bold uppercase hover:underline"
                >
                  <Plus size={13} /> Add Entry
                </button>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-[var(--muted)] border border-[var(--border)] rounded-xl"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => {
                          setFaqs((prev) =>
                            prev.map((f, i) => (i === index ? { ...f, question: e.target.value } : f))
                          );
                        }}
                        className={inputClass(false, true)}
                      />
                      <textarea
                        placeholder="Answer"
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          setFaqs((prev) =>
                            prev.map((f, i) => (i === index ? { ...f, answer: e.target.value } : f))
                          );
                        }}
                        className={`${inputClass(false, true)} resize-none`}
                      />
                    </div>
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== index))}
                        className="text-[var(--muted-foreground)] hover:text-red-600 self-center"
                        aria-label="Remove FAQ"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATUS */}
          <div className="space-y-1.5 pt-4 border-t border-[var(--border)]">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] block">
              Visibility
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "published" | "draft")}
              className="px-4 py-2 bg-white border border-[var(--border)] text-xs text-[var(--foreground)] rounded-xl focus:outline-none focus:border-[var(--primary)]"
            >
              <option value="draft">Draft (hidden from public site)</option>
              <option value="published">Published (visible on the site)</option>
            </select>
          </div>

          {errors.submit && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {errors.submit}
            </p>
          )}

          {/* ACTIONS */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              disabled={isSaving}
              className="px-5 py-2.5 bg-white border border-[var(--border)] text-[var(--muted-foreground)] font-semibold text-xs rounded-xl hover:bg-[var(--muted)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-semibold text-xs rounded-xl uppercase tracking-wider shadow-md disabled:opacity-60"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? "Save Changes" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>

      {/* IMAGE INSERT MODAL — for the toolbar's "Insert image" button.
          Lets the user either upload a file or paste a URL, plus one
          shared alt-text field, before inserting into the editor. */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white border border-[var(--border)] rounded-2xl p-5 space-y-4 shadow-lg text-left">
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)]">Insert Image</h4>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                Upload a file or paste an image URL.
              </p>
            </div>

            {/* Source tabs */}
            <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setImageModalTab("upload");
                  setImageModalError("");
                }}
                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  imageModalTab === "upload"
                    ? "bg-white text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageModalTab("url");
                  setImageModalError("");
                }}
                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  imageModalTab === "url"
                    ? "bg-white text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Image URL
              </button>
            </div>

            {imageModalTab === "upload" ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => pickerInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-[var(--border)] rounded-xl text-xs font-medium text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  <ImageIcon size={14} />
                  {pendingFile ? "Choose a different file" : "Choose a file"}
                </button>
                <input
                  ref={pickerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFilePicked}
                  className="hidden"
                />
                {pendingPreviewUrl && (
                  <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pendingPreviewUrl} alt="" className="w-full h-32 object-cover" />
                  </div>
                )}
                {pendingFile && (
                  <p className="text-[11px] text-[var(--muted-foreground)] truncate">{pendingFile.name}</p>
                )}
              </div>
            ) : (
              <input
                type="url"
                autoFocus
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={inputClass(false, true)}
              />
            )}

            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Alt text — e.g., Doctor reviewing chest X-ray with patient"
              className={inputClass(false, true)}
            />

            {imageModalError && <p className="text-[11px] text-red-600">{imageModalError}</p>}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeImageModal}
                disabled={isUploading}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmImageInsert}
                disabled={isUploading}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-light)] disabled:opacity-60"
              >
                {isUploading && <Loader2 size={13} className="animate-spin" />}
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LINK MODAL — for the toolbar's "Insert / edit link" button flow */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-white border border-[var(--border)] rounded-2xl p-5 space-y-4 shadow-lg text-left">
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)]">Insert Link</h4>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                Leave blank and confirm to remove an existing link.
              </p>
            </div>
            <input
              type="url"
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className={inputClass(false, true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  confirmLink();
                }
              }}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl("");
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLink}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-light)]"
              >
                {linkUrl.trim() ? "Insert Link" : "Remove Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

function inputClass(hasError: boolean, compact = false) {
  return `w-full ${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"} bg-white border ${
    hasError ? "border-red-400 focus:border-red-500" : "border-[var(--border)] focus:border-[var(--primary)]"
  } rounded-xl text-[var(--foreground)] focus:outline-none transition-colors`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}