import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECTS, HOME_SHOWCASE_ORDER } from '../data';

// Filter and sort projects for the homepage slider
const SLIDER_PROJECTS = HOME_SHOWCASE_ORDER
  .map(id => PROJECTS.find(p => p.numericId === id))
  .filter((p): p is typeof PROJECTS[0] => p !== undefined);

// --- Constants & Utilities ---
// The "Camille Mormal" signature bezier curve for heavy, premium movement
const CUSTOM_EASE = [0.25, 0.46, 0.45, 0.94];

// Preloader Component
const Preloader = ({ onComplete, heroImageSrc }: { onComplete: () => void, heroImageSrc: string }) => {
  const [exit, setExit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Real image preloading
    const img = new Image();
    img.src = heroImageSrc;
    img.onload = () => {
      // Add a small minimum delay to prevent flickering on fast connections
      setTimeout(() => setLoaded(true), 800);
    };
  }, [heroImageSrc]);

  useEffect(() => {
    if (loaded) {
      // Start exit sequence
      setExit(true);
    }
  }, [loaded]);

  // Placeholder images for the grid
  const PLACEHOLDERS = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614851099511-773084f6911d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523054-61c2792f9e09?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    // Index 7 is Center (Row 1, Col 2) - The Hero Image
    heroImageSrc,
    'https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523054-61c2792f9e09?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  ];

  const gridItems = Array.from({ length: 15 }, (_, i) => {
    if (i === 7) return { id: 'hero', src: heroImageSrc, isHero: true };
    return { id: `placeholder-${i}`, src: PLACEHOLDERS[i], isHero: false };
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-stone-950 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: CUSTOM_EASE } }}
    >
      <div className="grid grid-cols-5 gap-4 w-full h-full p-4">
        {gridItems.map((item, i) => {
          const col = i % 5;
          const isEvenCol = col % 2 === 0;
          const customYExit = isEvenCol ? '-105vh' : '105vh';

          return (
            <motion.div
              key={i}
              className="relative w-full h-full overflow-hidden z-10 bg-stone-900"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                exit
                  ? { y: customYExit }
                  : { opacity: 1, scale: 1 }
              }
              transition={{
                duration: 1.5,
                ease: CUSTOM_EASE,
                delay: exit ? 0 : i * 0.02, // Stagger in
              }}
              onAnimationComplete={() => {
                if (exit && i === 7) {
                  onComplete();
                }
              }}
            >
              <img
                src={item.src}
                alt="grid"
                className="w-full h-full object-cover opacity-80"
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const lastWheelTime = React.useRef(0);

  // Auto-advance
  useEffect(() => {
    if (isLoading) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, isLoading]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDER_PROJECTS.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDER_PROJECTS.length) % SLIDER_PROJECTS.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 1000) return;

    if (e.deltaY > 0) {
      nextSlide();
      lastWheelTime.current = now;
    } else if (e.deltaY < 0) {
      prevSlide();
      lastWheelTime.current = now;
    }
  };

  const currentProject = SLIDER_PROJECTS[currentIndex];

  // --- Animation Variants ---
  const slideVariants = {
    enter: (direction: number) => ({
      clipPath: direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      scale: 1.1,
      filter: "brightness(0.5)",
    }),
    center: {
      clipPath: "inset(0 0 0 0)",
      scale: 1,
      filter: "brightness(1)",
      transition: {
        duration: 1.2,
        ease: CUSTOM_EASE,
      }
    },
    exit: (direction: number) => ({
      clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
      scale: 1.1,
      filter: "brightness(0.5)",
      transition: {
        duration: 1.2,
        ease: CUSTOM_EASE,
      }
    })
  };

  return (
    <AnimatePresence>
      {isLoading ? (
        <Preloader
          onComplete={() => setIsLoading(false)}
          heroImageSrc={SLIDER_PROJECTS[0].coverImage}
        />
      ) : (
        <motion.div
          key="home"
          className="relative w-full h-screen overflow-hidden bg-stone-950"
          onWheel={handleWheel}
        >
          {/* Main Slider */}
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: 1 }}
              >
                <div className="absolute inset-0 bg-black/20 z-10" />
                <motion.img
                  src={currentProject.coverImage}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                  // Subtle parallax/Ken Burns during the slide's static state
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 8, ease: "linear" }}
                />

                {/* Central Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-4 pointer-events-none">

                  {/* Category */}
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, ease: CUSTOM_EASE, delay: 0.4 }}
                    className="block text-sm md:text-base tracking-[0.3em] uppercase text-stone-300 mb-4"
                  >
                    {currentProject.category} — {currentProject.year}
                  </motion.span>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 40, rotate: 2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -40, rotate: -2 }}
                    transition={{ duration: 1.0, ease: CUSTOM_EASE, delay: 0.5 }}
                    className="block text-5xl md:text-8xl lg:text-9xl font-serif pointer-events-auto cursor-pointer mb-8 py-2"
                  >
                    <Link to={`/project/${currentProject.id}`} className="hover:text-stone-300 transition-colors">
                      {currentProject.title}
                    </Link>
                  </motion.h1>

                  {/* Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                    className="pointer-events-auto"
                  >
                    <Link
                      to={`/project/${currentProject.id}`}
                      className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-500"
                    >
                      <span className="tracking-widest uppercase text-xs">View Project</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls - Left/Right */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-4 md:px-12 pointer-events-none">
            <button
              onClick={prevSlide}
              className="pointer-events-auto p-4 rounded-full border border-white/10 bg-black/20 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="pointer-events-auto p-4 rounded-full border border-white/10 bg-black/20 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Bottom Navigation / Thumbnails */}
          <div className="absolute bottom-0 left-0 w-full z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-32 pb-8 md:pb-12 px-6 md:px-12">
            <div className="flex justify-between items-end border-t border-white/10 pt-8">
              {/* Slide Counter */}
              <div className="hidden md:block">
                <div className="text-xs tracking-widest text-stone-400 mb-2">CURRENT</div>
                <div className="text-xl font-serif">
                  {String(currentIndex + 1).padStart(2, '0')} <span className="text-stone-600 mx-2">/</span> {String(SLIDER_PROJECTS.length).padStart(2, '0')}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar max-w-full pb-2">
                {SLIDER_PROJECTS.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => goToSlide(index)}
                    className={`relative flex-shrink-0 w-20 h-14 md:w-32 md:h-20 overflow-hidden transition-all duration-500 group ${index === currentIndex ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                      }`}
                  >
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${index === currentIndex ? 'scale-110' : 'scale-100 group-hover:scale-105'
                        }`}
                    />
                    {index === currentIndex && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute inset-0 bg-white/10"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Home;