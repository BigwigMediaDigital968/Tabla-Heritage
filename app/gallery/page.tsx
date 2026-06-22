import Footer from "../component/website/Footer";
import Navbar from "../component/website/Navbar";
import GalleryHero from "./component/GalleryHero";
import GalleryLayout from "./component/GalleryLayout";

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <GalleryHero />
      <GalleryLayout />
      <Footer />
    </>
  );
}
