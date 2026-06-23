"use client";

import BlogEditor from "@/app/component/admin/BlogEditor";

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFormProps {
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

export default function BlogForm({ initialData }: BlogFormProps) {
  // Pass the initialData directly down into the consolidated text editor
  // The editor now handles tabs for general fields, visual wysiwyg, raw html code, seo, and faqs.
  console.log("initialData", initialData)
  return <BlogEditor initialData={initialData} />;
}
