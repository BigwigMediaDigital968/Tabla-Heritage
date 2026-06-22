export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const tablaFaqData: FAQItem[] = [
  {
    id: "faq-1",
    category: "Classes & Curriculum",
    question: "Do I need to own a Tabla set before joining my first class?",
    answer:
      "For your initial trial or first few introductory sessions, we can arrange an instrument at the academy. However, for consistent progress and daily practice (Riyaz), we highly recommend acquiring a verified, high-quality Tabla set. We can guide you on choosing the right scale and drum weights based on your age and vocal/instrumental preferences.",
  },
  {
    id: "faq-2",
    category: "Classes & Curriculum",
    question: "Which musical Gharana is taught at the academy?",
    answer:
      "Our foundational techniques and traditional compositions are deeply rooted in the legendary Benaras Gharana lineage (inspired by Shrimati Rachna Mehra) and continue through advanced structural training under the philosophy of the master lineages via Pandit Nishikant Barodekar, a senior disciple of Ustad Allah Rakha.",
  },
  {
    id: "faq-3",
    category: "Admissions & Schedule",
    question: "Are lessons available for absolute beginners and children?",
    answer:
      "Yes, absolutely. We offer structured lessons tailored for students of all ages (starting from 7+) and backgrounds. Beginners focus heavily on core balance, clear syllable execution (Nikash), and basic rhythm cycles like Teental (16 beats), while advanced students dive into complex accompaniment structures.",
  },
  {
    id: "faq-4",
    category: "Classes & Curriculum",
    question:
      "Do you offer training in classical dance or vocal accompaniment?",
    answer:
      "Yes. Part of our specialized performance curriculum involves teaching the intricate mechanics of live accompaniment. Students learn how to follow, communicate with, and elevate classical vocalists, instrumentalists, and Kathak dancers across diverse traditional styles.",
  },
  {
    id: "faq-5",
    category: "Admissions & Schedule",
    question: "What is your policy regarding missed classes or reschedules?",
    answer:
      "We request a minimum of 24 hours' notice for any cancellations or rescheduling requests. This allows us to reallocate the slot to other students on our waitlist. Missed sessions without prior notice cannot be refunded or carried forward.",
  },
];

export const servicePageFaqData: FAQItem[] = [
  {
    id: "srv-faq-1",
    category: "Tutoring & Lessons",
    question:
      "What is the core difference between the Tabla and Dholak courses?",
    answer:
      "Our Tabla training is structured heavily around classical foundations, focusing on solo performance structures, intricate rhythmic mathematics, and traditional Gharana lineages (such as Benaras and Punjab). Dholak lessons, on the other hand, are highly focused on practical accompaniment styles, training students primarily to back various folk genres, Bollywood arrangements, devotional Chowki setups, and community festival rhythms.",
  },
  {
    id: "srv-faq-2",
    category: "Tutoring & Lessons",
    question: "Do you train students to accompany live vocalists or dancers?",
    answer:
      "Yes, advanced live accompaniment is a signature pillar of our academy. Students learn the crucial mechanics of rhythmic communication—how to follow a vocalist's key changes, maintain steady tempo tracks (Laya) for classical Kathak dance footwork, and provide dynamic accent placement during high-velocity live performances.",
  },
  {
    id: "srv-faq-3",
    category: "Events & Bookings",
    question:
      "How far in advance do we need to book percussionists for Chowki or Bhajan events?",
    answer:
      "For traditional devotional events, Chowkis, and private musical gatherings, we request booking confirmation at least 4 to 6 weeks in advance. This ensures adequate time to align with your acoustic instrumentalists, review specific spiritual compositions, and map out the venue's acoustic sound profile.",
  },
  {
    id: "srv-faq-4",
    category: "Programs & Workshops",
    question: "What should we expect from a Corporate Rhythm Program?",
    answer:
      "Our corporate team-building workshops use accessible group percussion structures to mirror organizational teamwork. Participants don't need any musical background. We provide all instruments, using simple drum circles and interactive call-and-response rhythm patterns to break down communication barriers, balance focus, and reduce stress.",
  },
  {
    id: "srv-faq-5",
    category: "Tutoring & Lessons",
    question: "Can I switch from learning Tabla to Dholak mid-semester?",
    answer:
      "While both are percussion instruments, their hand techniques (Nikash) and underlying physical mechanics are vastly different. We recommend completing your foundational module first to avoid disrupting muscle memory. However, if your long-term goals shift toward folk and festival accompaniment rather than classical solo tracking, our instructors will guide a smooth transition.",
  },
];
