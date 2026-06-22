import Footer from "../component/website/Footer";
import Navbar from "../component/website/Navbar";
import BlogGrid from "./component/BlogGrid";
import BlogHero from "./component/BlogHero";

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BlogHero />
      <BlogGrid />
      <Footer />
    </>
  );
}
