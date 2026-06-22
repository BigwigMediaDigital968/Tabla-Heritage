import About from "./component/website/About";
import AboutTeacher from "./component/website/AboutTeacher";
import Blogs from "./component/website/Blogs";
import CTA from "./component/website/CTA";
import FAQs from "./component/website/FAQs";
import Footer from "./component/website/Footer";
import Gallery from "./component/website/Gallery";
import Hero from "./component/website/Hero";
import Navbar from "./component/website/Navbar";
import Service from "./component/website/Service";
import Testimonial from "./component/website/Testimonial";
import { tablaFaqData } from "./faqData";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Service />
      <AboutTeacher />
      <Gallery />
      <Testimonial />
      <CTA />
      <Blogs />
      <FAQs
        title="Frequently Asked Questions"
        subtitle="Rhythmic Wisdom"
        items={tablaFaqData}
      />

      <Footer />
    </>
  );
}
