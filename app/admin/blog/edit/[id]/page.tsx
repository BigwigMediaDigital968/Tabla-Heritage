'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogForm from '../../component/BlogForm';

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;

  console.log("id", id)

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);

        if (!res.ok) return;

        const data = await res.json();
        console.log(data)
        setBlogData(data.data);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!blogData) {
    return (
      <div className="min-h-screen bg-[#0c0c0b] text-neutral-400 flex items-center justify-center text-xs font-mono">
        Blog not found.
      </div>
    );
  }

  return <BlogForm initialData={blogData} />;
}