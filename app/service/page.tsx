import FAQs from "../component/website/FAQs";
import Footer from "../component/website/Footer";
import Navbar from "../component/website/Navbar";
import { servicePageFaqData } from "../faqData";
import ServiceHero from "./component/ServiceHero";
import TablaService from "./component/TablaService";

export default function ServicePage() {
  return (
    <>
      <Navbar />
      <ServiceHero />
      <TablaService />
      <FAQs
        title="Service & Program FAQs"
        subtitle="Rhythmic Details"
        items={servicePageFaqData}
      />
      <Footer />
    </>
  );
}
