import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { PROJECTS } from '../data';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const projectIndex = PROJECTS.findIndex(p => p.id === id);
  const project = PROJECTS[projectIndex];

  // Handle case where project not found
  useEffect(() => {
    if (!project) {
      navigate('/work');
    }
  }, [project, navigate]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Intersection Observer to track active image
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveImageIndex(index);
            }
          },
          { threshold: 0.5 } // Trigger when 50% visible
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, [project]);

  // Show thumbnails only when SECOND image is visible
  useEffect(() => {
    // Ensure we have at least 2 images, otherwise fallback to 0
    const targetIndex = project?.images.length > 1 ? 1 : 0;
    const targetImage = imageRefs.current[targetIndex];

    if (!targetImage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show when the top of the second image passes the bottom of the viewport (isIntersecting)
        // or is above the viewport.
        setShowThumbnails(entry.isIntersecting || entry.boundingClientRect.top < 0);
      },
      { threshold: 0.1 }
    );

    observer.observe(targetImage);
    return () => observer.disconnect();
  }, [project]);

  // Auto-scroll thumbnails to keep active one centered with silky smooth animation
  useEffect(() => {
    if (thumbnailContainerRef.current && thumbnailRefs.current[activeImageIndex]) {
      const container = thumbnailContainerRef.current;
      const thumbnail = thumbnailRefs.current[activeImageIndex];

      if (thumbnail) {
        const containerCenter = container.offsetHeight / 2;
        const thumbnailCenter = thumbnail.offsetTop + thumbnail.offsetHeight / 2;
        const scrollPos = thumbnailCenter - containerCenter;

        // Use Framer Motion's animate function for custom easing
        const controls = animate(container.scrollTop, scrollPos, {
          type: "tween",
          ease: [0.25, 0.46, 0.45, 0.94], // Custom bezier for "silky" feel
          duration: 0.8,
          onUpdate: (v) => container.scrollTop = v
        });

        return () => controls.stop();
      }
    }
  }, [activeImageIndex]);

  if (!project) return null;

  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(projectIndex - 1 + PROJECTS.length) % PROJECTS.length];

  const scrollToImage = (index: number) => {
    const target = imageRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // Helper to chunk images based on layout
  const renderImageGrid = () => {
    const layout = project.layout || [1]; // Default to single column if no layout
    let currentImageIndex = 0;
    const gridElements = [];

    // Loop through layout configuration
    for (let i = 0; i < layout.length; i++) {
      if (currentImageIndex >= project.images.length) break;

      const colCount = layout[i];
      const rowImages = project.images.slice(currentImageIndex, currentImageIndex + colCount);
      const startIndex = currentImageIndex;

      // Determine grid columns class
      let gridClass = "grid-cols-1";
      if (colCount === 2) gridClass = "grid-cols-1 md:grid-cols-2";
      if (colCount === 3) gridClass = "grid-cols-1 md:grid-cols-3";

      gridElements.push(
        <div key={`row-${i}`} className={`grid ${gridClass} gap-4 md:gap-8 w-full max-w-[1800px] mx-auto`}>
          {rowImages.map((img, idx) => {
            const globalIndex = startIndex + idx;
            return (
              <motion.div
                key={globalIndex}
                ref={el => imageRefs.current[globalIndex] = el}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, viewport: { margin: "-100px" } }}
                className="relative w-full"
              >
                <motion.img
                  src={img}
                  alt={`Detail ${globalIndex}`}
                  className="w-full h-auto object-cover block"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <div className="absolute bottom-4 right-4 text-xs text-white/50 tracking-widest pointer-events-none mix-blend-difference">
                  IMAGE 0{globalIndex + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      );

      currentImageIndex += colCount;
    }

    // If there are remaining images not covered by layout, render them as single columns
    while (currentImageIndex < project.images.length) {
      const globalIndex = currentImageIndex;
      gridElements.push(
        <div key={`row-rest-${globalIndex}`} className="grid grid-cols-1 gap-8 w-full max-w-[1800px] mx-auto">
          <motion.div
            key={globalIndex}
            ref={el => imageRefs.current[globalIndex] = el}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, viewport: { margin: "-100px" } }}
            className="relative w-full"
          >
            <motion.img
              src={project.images[globalIndex]}
              alt={`Detail ${globalIndex}`}
              className="w-full h-auto object-cover block"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <div className="absolute bottom-4 right-4 text-xs text-white/50 tracking-widest pointer-events-none mix-blend-difference">
              IMAGE 0{globalIndex + 1}
            </div>
          </motion.div>
        </div>
      );
      currentImageIndex++;
    }

    return gridElements;
  };

  return (
    <motion.div
      className="bg-stone-950 min-h-screen text-stone-50 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Full Screen Hero */}
      <div className="relative w-full h-[80vh] md:h-screen">
        <motion.div
          className="absolute inset-0"
          layoutId={`cover-${project.id}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-950 z-10" />
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 lg:p-24">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div>
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif leading-none mb-4">{project.title}</h1>
                <div className="flex gap-6 text-sm md:text-base tracking-widest text-stone-400">
                  <span>{project.category}</span>
                  <span>—</span>
                  <span>{project.year}</span>
                </div>
              </div>
              <div className="max-w-md text-stone-300 leading-relaxed">
                <p>{project.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Project Meta Grid */}
      <div className="px-6 md:px-12 lg:px-24 py-16 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Role</h3>
            <p className="text-lg">Lead Designer</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Tools</h3>
            <p className="text-lg">Blender, React, Figma</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Client</h3>
            <p className="text-lg">Internal Project</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => <span key={tag} className="text-sm opacity-70">#{tag}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex">
        {/* Gallery Images */}
        <div className="w-full px-4 md:px-12 lg:px-24 py-24 space-y-4 md:space-y-8">
          {renderImageGrid()}
        </div>

        {/* Right Side Thumbnail Navigation */}
        <AnimatePresence>
          {showThumbnails && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: "-50%" }}
              animate={{ opacity: 1, x: 0, y: "-50%" }}
              exit={{ opacity: 0, x: 20, y: "-50%" }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block fixed right-12 top-1/2 z-30"
            >
              <div className="relative bg-black/20 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                {/* Thumbnails Container */}
                <div
                  ref={thumbnailContainerRef}
                  className="flex flex-col gap-3 overflow-y-auto no-scrollbar scroll-smooth py-2 px-1 transition-all duration-500"
                  style={{ maxHeight: 'calc(7 * 3rem + 6 * 0.75rem + 1rem)' }} // 7 items * (h-12 + gap-3) + padding
                >
                  {project.images.map((img, index) => (
                    <button
                      key={index}
                      ref={el => thumbnailRefs.current[index] = el}
                      onClick={() => scrollToImage(index)}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden transition-all duration-300 ${activeImageIndex === index
                          ? 'ring-2 ring-white scale-110 opacity-100'
                          : 'opacity-40 hover:opacity-80 hover:scale-105'
                        }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumb ${index}`} />
                    </button>
                  ))}
                </div>

                {/* Scroll to Bottom Button */}
                <div className="mt-4 flex justify-center border-t border-white/10 pt-3">
                  <button
                    onClick={scrollToBottom}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors group"
                    title="Scroll to Bottom"
                  >
                    <ArrowDown size={16} className="text-stone-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnail Navigation / Next Project */}
      <div className="mt-24 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[40vh] md:h-[50vh]">
          <Link to={`/project/${prevProject.id}`} className="relative group border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-stone-900 group-hover:bg-stone-800 transition-colors" />
            <img src={prevProject.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm group-hover:blur-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
              <span className="text-xs tracking-widest uppercase mb-4 opacity-70 group-hover:translate-y-2 transition-transform">Previous</span>
              <h2 className="text-3xl md:text-5xl font-serif group-hover:-translate-y-2 transition-transform duration-300">{prevProject.title}</h2>
            </div>
          </Link>
          <Link to={`/project/${nextProject.id}`} className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-stone-900 group-hover:bg-stone-800 transition-colors" />
            <img src={nextProject.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm group-hover:blur-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
              <span className="text-xs tracking-widest uppercase mb-4 opacity-70 group-hover:translate-y-2 transition-transform">Next Project</span>
              <h2 className="text-3xl md:text-5xl font-serif group-hover:-translate-y-2 transition-transform duration-300">{nextProject.title}</h2>
            </div>
          </Link>
        </div>
      </div>

    </motion.div>
  );
};

export default ProjectDetail;
