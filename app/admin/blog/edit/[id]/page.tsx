import BlogForm from "../../component/BlogForm";

async function getBlogProfileData(id: string) {
  // Leverage base system absolute url references safely
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog?admin=true`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.find((b: any) => b._id === id) || null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const resolvedParams = await params;
  const blogData = await getBlogProfileData(resolvedParams.id);

  if (!blogData) {
    return (
      <div className="min-h-screen bg-[#0c0c0b] text-neutral-400 flex items-center justify-center text-xs font-mono">
        Target document cluster matching profile reference context not found.
      </div>
    );
  }

  return <BlogForm initialData={blogData} />;
}
