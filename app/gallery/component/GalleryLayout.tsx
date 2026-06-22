"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Play,
  Image as ImageIcon,
  Film,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

interface MediaItem {
  id: string;
  type: "image" | "video";
  title: string;
  description: string;
  src: string;
  aspectRatio: string;
  instagramHandle?: string;
  publishDate?: string;
  extendedText?: string;
}

const galleryMediaData: MediaItem[] = [
  {
    id: "med-1",
    type: "image",
    title: "Vocal Accompaniment Live Class",
    description:
      "Students tracking semi-classical performance metrics during live vocal accompaniment exercises.",
    src: "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10",
    aspectRatio: "aspect-[3/4]",
    instagramHandle: "_taalsadhana",
    publishDate: "September 24, 2024",
    extendedText:
      "Tabla Girls @avani.jatindranath and @jhanavi_devipriya playing a small part of a Rela and chakradhar.\n\nThe two talented sisters are dedicated students of music. They not only excel in tabla, but also dance and singing. Avani and Jhanavi frequently perform at the Radha Krishna Mandir, and for many other programs throughout the GTA.",
  },
  {
    id: "med-2",
    type: "video",
    title: "Traditional Chowki Event In-Action",
    description:
      "High-velocity rhythmic transitions executed live during a community bhajan assembly.",
    src: "https://assets.mixkit.co/videos/preview/mixkit-playing-traditional-drums-closer-look-34351-large.mp4",
    aspectRatio: "aspect-[9/16]",
    instagramHandle: "_taalsadhana",
    publishDate: "October 12, 2024",
    extendedText:
      "Live classical configurations tracked across complex time divisions.",
  },
  {
    id: "med-3",
    type: "image",
    title: "Classical Solo Masterclass Performance",
    description:
      "Deep research into the intricate subdivision patterns of the Benaras Gharana time-cycles.",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    aspectRatio: "aspect-[16/10]",
    instagramHandle: "_taalsadhana",
    publishDate: "November 02, 2024",
    extendedText:
      "Exploring structured dynamic accent mapping cycles inside classical gharana techniques.",
  },
  {
    id: "med-4",
    type: "image",
    title: "Bollywood & Folk Groove Frameworks",
    description:
      "Exploring the synchronization patterns behind commercial rhythms and traditional North Indian folk structures.",
    src: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6",
    aspectRatio: "aspect-[4/5]",
    instagramHandle: "_taalsadhana",
    publishDate: "December 15, 2024",
    extendedText:
      "A cross-genre breakdown balancing live stage performance dynamics with acoustic balancing layouts.",
  },
  {
    id: "med-5",
    type: "image",
    title: "Young Tabla Ensemble Rehearsal",
    description:
      "Students practicing synchronized kaidas and relas during a group ensemble session.",
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    aspectRatio: "aspect-[4/5]",
    instagramHandle: "_taalsadhana",
    publishDate: "January 10, 2025",
    extendedText:
      "Building confidence through ensemble playing and developing listening skills among young percussionists.",
  },
  {
    id: "med-6",
    type: "video",
    title: "Teen Taal Performance Showcase",
    description:
      "Advanced students presenting complex rhythmic compositions in Teen Taal.",
    src: "https://assets.mixkit.co/videos/preview/mixkit-musician-playing-drums-on-stage-1204-large.mp4",
    aspectRatio: "aspect-[9/16]",
    instagramHandle: "_taalsadhana",
    publishDate: "January 28, 2025",
    extendedText:
      "A showcase of intricate bols and rhythmic improvisations inspired by traditional gharana styles.",
  },
  {
    id: "med-7",
    type: "image",
    title: "Children's Rhythm Workshop",
    description:
      "Introducing young learners to basic rhythm patterns through interactive activities.",
    src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
    aspectRatio: "aspect-[3/4]",
    instagramHandle: "_taalsadhana",
    publishDate: "February 08, 2025",
    extendedText:
      "A joyful session focused on rhythm awareness, hand coordination, and musical expression.",
  },
  {
    id: "med-8",
    type: "image",
    title: "Guru-Shishya Practice Session",
    description:
      "Traditional one-on-one training emphasizing precision and tonal clarity.",
    src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    aspectRatio: "aspect-[16/10]",
    instagramHandle: "_taalsadhana",
    publishDate: "February 21, 2025",
    extendedText:
      "A glimpse into the timeless guru-shishya tradition where every stroke is refined with patience and dedication.",
  },
  {
    id: "med-9",
    type: "video",
    title: "Dholak Folk Rhythm Session",
    description:
      "Energetic folk grooves performed during a community cultural gathering.",
    src: "https://assets.mixkit.co/videos/preview/mixkit-musician-playing-percussion-in-a-concert-34417-large.mp4",
    aspectRatio: "aspect-[9/16]",
    instagramHandle: "_taalsadhana",
    publishDate: "March 04, 2025",
    extendedText:
      "Celebrating the vibrant rhythms of North Indian folk traditions through dholak accompaniment.",
  },
  {
    id: "med-10",
    type: "image",
    title: "Annual Student Recital",
    description:
      "Students presenting solo and group performances during the annual music showcase.",
    src: "https://images.unsplash.com/photo-1503095396549-807759245b35",
    aspectRatio: "aspect-[4/5]",
    instagramHandle: "_taalsadhana",
    publishDate: "March 19, 2025",
    extendedText:
      "An inspiring evening where students demonstrated their growth and passion for rhythm.",
  },
  {
    id: "med-11",
    type: "image",
    title: "Fusion Music Collaboration",
    description:
      "Combining Indian percussion with modern instrumental arrangements.",
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    aspectRatio: "aspect-[16/10]",
    instagramHandle: "_taalsadhana",
    publishDate: "April 05, 2025",
    extendedText:
      "Exploring creative boundaries by blending classical tabla with contemporary music styles.",
  },
  {
    id: "med-12",
    type: "video",
    title: "Temple Bhajan Accompaniment",
    description:
      "Live devotional performance featuring tabla accompaniment during bhajans.",
    src: "https://assets.mixkit.co/videos/preview/mixkit-live-band-performance-at-a-concert-34422-large.mp4",
    aspectRatio: "aspect-[9/16]",
    instagramHandle: "_taalsadhana",
    publishDate: "April 18, 2025",
    extendedText:
      "A spiritually enriching experience where rhythm and devotion come together beautifully.",
  },
  {
    id: "med-13",
    type: "image",
    title: "Beginner Tabla Fundamentals Class",
    description:
      "Students learning basic hand techniques and foundational bols.",
    src: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34",
    aspectRatio: "aspect-[3/4]",
    instagramHandle: "_taalsadhana",
    publishDate: "May 02, 2025",
    extendedText:
      "The first steps into the world of Indian percussion with emphasis on posture and hand positioning.",
  },
  {
    id: "med-14",
    type: "image",
    title: "Cultural Festival Performance",
    description:
      "A dynamic stage performance celebrating India's rich rhythmic heritage.",
    src: "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
    aspectRatio: "aspect-[4/5]",
    instagramHandle: "_taalsadhana",
    publishDate: "May 20, 2025",
    extendedText:
      "Students and teachers came together to present a vibrant display of rhythm and tradition.",
  },
  {
    id: "med-15",
    type: "video",
    title: "Advanced Tabla Solo Recital",
    description:
      "A powerful solo presentation featuring peshkar, kaida, rela, and chakradhar compositions.",
    src: "https://assets.mixkit.co/videos/preview/mixkit-concert-stage-with-musicians-performing-34418-large.mp4",
    aspectRatio: "aspect-[9/16]",
    instagramHandle: "_taalsadhana",
    publishDate: "June 12, 2025",
    extendedText:
      "An advanced recital demonstrating technical excellence, creativity, and deep understanding of classical rhythm.",
  },
];

const itemCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

export default function GalleryLayout() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );

  // Guard body scroll locks when modal expands
  useEffect(() => {
    if (selectedItemIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItemIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex !== null) {
      setSelectedItemIndex(
        selectedItemIndex === 0
          ? galleryMediaData.length - 1
          : selectedItemIndex - 1,
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIndex !== null) {
      setSelectedItemIndex(
        selectedItemIndex === galleryMediaData.length - 1
          ? 0
          : selectedItemIndex + 1,
      );
    }
  };

  const activeItem =
    selectedItemIndex !== null ? galleryMediaData[selectedItemIndex] : null;

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#111111]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-neutral-400 block">
            Our Artistic Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white font-serif">
            Tabla | Dholak | Events & Program
          </h2>
          <div className="h-1 w-16 bg-[#c5a880] mx-auto rounded-full mt-2" />
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 w-full">
          {galleryMediaData.map((item, idx) => (
            <MasonryCard
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => setSelectedItemIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* ==========================================
          MODAL INTERACTIVE CANVAS DETAILED FRAME
          ========================================== */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItemIndex(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            {/* Modal Inner Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-white dark:bg-[#141312] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[80vh]"
            >
              {/* LEFT COLUMN: Visual Media Presentation Window */}
              <div className="md:col-span-7 bg-black flex items-center justify-center relative min-h-[300px] sm:min-h-[400px] md:h-full group/media">
                {activeItem.type === "image" ? (
                  <img
                    src={activeItem.src}
                    alt={activeItem.title}
                    className="max-w-full max-h-[45vh] md:max-h-[80vh] object-contain w-full h-full select-none"
                  />
                ) : (
                  <video
                    src={activeItem.src}
                    controls
                    autoPlay
                    playsInline
                    className="max-w-full max-h-[45vh] md:max-h-[80vh] object-contain w-full h-full"
                  />
                )}

                {/* Left Arrow */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-all cursor-pointer z-10"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-all cursor-pointer z-10"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* RIGHT COLUMN: Text content, Metadata ledger & Attributes */}
              <div className="md:col-span-5 flex flex-col h-[45vh] md:h-full border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141312]">
                {/* Social Header Card Section */}
                <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#141312] z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-800 dark:text-neutral-200">
                      <FaInstagram size={18} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-800 dark:text-white">
                      {activeItem.instagramHandle || "_taalsadhana"}
                    </span>
                  </div>

                  {/* Close Window Frame Controller */}
                  <button
                    onClick={() => setSelectedItemIndex(null)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scrollable Context Box */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-left">
                  <div className="flex items-center gap-4 text-neutral-400 text-xs font-semibold">
                    <button
                      onClick={handlePrev}
                      className="hover:text-neutral-600 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <button
                      onClick={handleNext}
                      className="hover:text-neutral-600 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white leading-tight">
                    {activeItem.title}
                  </h3>

                  <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-3 whitespace-pre-line font-sans leading-relaxed">
                    {activeItem.extendedText || activeItem.description}
                  </div>
                </div>

                {/* Footer Meta Timestamp info */}
                <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#1a1917] text-[11px] text-neutral-400 font-sans font-medium tracking-wide">
                  {activeItem.publishDate || "September 24, 2024"}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ==========================================================================
    ISOLATED MASONRY GRID CARD COMPONENT
   ========================================================================== */
interface CardProps {
  item: MediaItem;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

function MasonryCard({
  item,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
}: CardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    onHoverStart();
    if (item.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    onHoverEnd();
    if (item.type === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={itemCardVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`break-inside-avoid relative w-full mb-5 rounded-[14px] overflow-hidden bg-neutral-50 dark:bg-[#161616] border border-neutral-100 dark:border-neutral-800/60 shadow-xs group cursor-pointer ${item.aspectRatio}`}
    >
      <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white/90 flex items-center gap-1.5 pointer-events-none text-[10px] font-sans uppercase tracking-wider font-medium">
        {item.type === "video" ? <Film size={12} /> : <ImageIcon size={12} />}
        {item.type}
      </div>

      <div className="w-full h-full relative overflow-hidden">
        {item.type === "image" ? (
          <img
            src={item.src}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full relative bg-black">
            <video
              ref={videoRef}
              src={item.src}
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div
              className={`absolute inset-0 flex items-center justify-center text-white/70 transition-all duration-300 ${isHovered ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
            >
              <div className="p-4 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                <Play size={20} fill="currentColor" className="ml-0.5" />
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 text-left pointer-events-none">
        <div className="space-y-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-[0.25,1,0.5,1]">
          <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
            {item.title}
          </h3>
          <p className="font-sans font-light text-[11px] sm:text-xs text-neutral-300/90 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
