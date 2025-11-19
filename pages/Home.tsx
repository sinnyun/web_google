import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../data';

// Preloader Component
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Start exit animation after a delay
    const timer = setTimeout(() => {
      setExit(true);
    }, 2000); // Show grid for 2s
    return () => clearTimeout(timer);
  }, []);

  // Placeholder images for the grid (distinct from projects)
  const PLACEHOLDERS = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614851099511-773084f6911d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523054-61c2792f9e09?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    // Index 7 is Center (Row 1, Col 2)
    PROJECTS[0].coverImage,
    'https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614850523054-61c2792f9e09?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  ];

  // Generate 15 items (5 cols x 3 rows)
  // Center is index 7 (Row 1, Col 2)
  // Row 0: 0, 1, 2, 3, 4
  // Row 1: 5, 6, 7, 8, 9
  // Row 2: 10, 11, 12, 13, 14

  const gridItems = Array.from({ length: 15 }, (_, i) => {
    if (i === 7) return { id: 'hero', src: PROJECTS[0].coverImage, isHero: true };
    return { id: `placeholder-${i}`, src: PLACEHOLDERS[i], isHero: false };
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-stone-950 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 1 } }}
    >
      <div className="grid grid-cols-5 gap-4 w-full h-full p-4">
        {gridItems.map((item, i) => {
          const col = i % 5;

          // Exit Logic
          // All columns slide out.
          // Even cols (0, 2, 4) -> Up
          // Odd cols (1, 3) -> Down

          const isEvenCol = col % 2 === 0;
          const customYExit = isEvenCol ? '-100vh' : '100vh';

          return (
            <motion.div
              key={i}
              className="relative w-full h-full overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                exit
                  ? { y: customYExit, opacity: 0 }
                  : { opacity: 1, scale: 1 }
              }
              transition={{
                duration: 1.2,
                ease: [0.43, 0.13, 0.23, 0.96],
                delay: exit ? 0 : i * 0.05,
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
                className="w-full h-full object-cover"
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

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 1000) return; // Debounce 1s

    if (e.deltaY > 0) {
      nextSlide();
      lastWheelTime.current = now;
    } else if (e.deltaY < 0) {
      prevSlide();
      lastWheelTime.current = now;
    }
  };

  const currentProject = PROJECTS[currentIndex];

  // Variants for slide animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
      zIndex: 1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      // Parallax exit: move slightly in opposite direction to prevent gaps (black borders)
      x: direction < 0 ? '20%' : '-20%',
      opacity: 0.5,
    })
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
      ) : (
        <motion.div
          key="home"
          className="relative w-full h-screen overflow-hidden bg-stone-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
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
                transition={{
                  x: { type: "tween", ease: "easeInOut", duration: 1 }, // Smoother slow in/out
                  opacity: { duration: 0.5 },
                  scale: { duration: 1 }
                }}
                className="absolute inset-0 w-full h-full"
              >
                <div className="absolute inset-0 bg-black/30 z-10" /> {/* Overlay for text readability */}
                <motion.img
                  src={currentProject.coverImage}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 6, ease: "linear" }} // Ken Burns effect
                />

                {/* Central Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-4 pointer-events-none">
                  <motion.span
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    className="text-sm md:text-base tracking-[0.3em] uppercase mb-4"
                  >
                    {currentProject.category} — {currentProject.year}
                  </motion.span>
                  <motion.h1
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-9xl font-serif mb-8 pointer-events-auto cursor-default"
                    whileHover={{ scale: 1.05, letterSpacing: "0.05em", color: "#d6d3d1" }} // Enhanced hover
                  >
                    <Link to={`/project/${currentProject.id}`} className="transition-colors">
                      {currentProject.title}
                    </Link>
                  </motion.h1>
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                    className="pointer-events-auto"
                  >
                    <Link
                      to={`/project/${currentProject.id}`}
                      className="inline-flex items-center gap-2 border border-white/30 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                    >
                      View Project <ArrowRight size={18} />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls - Left/Right */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border border-white/10 hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            <ArrowRight size={24} />
          </button>

          {/* Bottom Navigation / Thumbnails */}
          <div className="absolute bottom-0 left-0 w-full z-30 bg-gradient-to-t from-black/80 to-transparent pt-24 pb-8 md:pb-12 px-6 md:px-12">
            <div className="flex justify-between items-end">
              {/* Slide Counter */}
              <div className="hidden md:block text-sm tracking-widest font-mono">
                {String(currentIndex + 1).padStart(2, '0')} <span className="text-white/30">/</span> {String(PROJECTS.length).padStart(2, '0')}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar max-w-full pb-2">
                {PROJECTS.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => goToSlide(index)}
                    className={`relative flex-shrink-0 w-24 h-16 md:w-40 md:h-24 overflow-hidden transition-all duration-500 ${index === currentIndex ? 'opacity-100 scale-110 z-10 shadow-lg' : 'opacity-40 grayscale hover:opacity-80 hover:scale-105'
                      }`}
                  >
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                    {index === currentIndex && (
                      <motion.div layoutId="activeGlow" className="absolute inset-0 bg-white/10" />
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