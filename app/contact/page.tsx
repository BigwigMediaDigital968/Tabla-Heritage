import Footer from "../component/website/Footer";
import Navbar from "../component/website/Navbar";
import ContactHero from "./component/ContactHero";
import LeadForm from "./component/LeadForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactHero />
      <LeadForm />
      <Footer />
    </>
  );
}
