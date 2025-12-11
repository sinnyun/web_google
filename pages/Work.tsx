import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../data';
import { ArrowRight } from 'lucide-react';

const Work: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Momentum/Snap Refs
  const velX = useRef(0);
  const lastX = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get top 5 categories by project count
  const allCategories = PROJECTS.map(p => p.category);
  const categoryCounts = allCategories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const top5Categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat]) => cat);

  const categories = ['All', ...top5Categories];

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedCategory);

  const handleMouseDown = (e: MouseEvent) => {
    if (!sliderRef.current) return;
    stopAnimation();
    setIsDown(true);
    isDragging.current = true;
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    lastX.current = e.pageX;
    velX.current = 0;
  };

  const handleMouseLeave = () => {
    if (isDown) {
      setIsDown(false);
      isDragging.current = false;
      beginMomentum();
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
    isDragging.current = false;
    beginMomentum();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;

    const delta = e.pageX - lastX.current;
    lastX.current = e.pageX;
    velX.current = delta;
  };

  const beginMomentum = () => {
    if (Math.abs(velX.current) < 0.5) {
      snapToNearest();
      return;
    }

    velX.current *= 0.95;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= velX.current * 2;
    }

    animationFrameId.current = requestAnimationFrame(beginMomentum);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (sliderRef.current) {
      stopAnimation();
      velX.current -= e.deltaY * 0.5;

      if (velX.current > 100) velX.current = 100;
      if (velX.current < -100) velX.current = -100;

      beginMomentum();
    }
  };

  const stopAnimation = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      clearTimeout(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const snapToNearest = () => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const center = container.scrollLeft + container.clientWidth / 2;

    let closestElement: HTMLElement | null = null;
    let minDistance = Infinity;

    const children = Array.from(container.children);
    children.forEach((child) => {
      const htmlChild = child as HTMLElement;
      const childCenter = htmlChild.offsetLeft + htmlChild.offsetWidth / 2;
      const distance = Math.abs(childCenter - center);

      if (distance < minDistance) {
        minDistance = distance;
        closestElement = htmlChild;
      }
    });

    if (closestElement) {
      const index = children.indexOf(closestElement);
      const currentCenter = closestElement.offsetLeft + closestElement.offsetWidth / 2;

      if (velX.current > 0.5 && index > 0) {
        if (center < currentCenter && index > 0) {
          closestElement = children[index - 1] as HTMLElement;
        }
      } else if (velX.current < -0.5 && index < children.length - 1) {
        if (center > currentCenter && index < children.length - 1) {
          closestElement = children[index + 1] as HTMLElement;
        }
      }

      if (Math.abs(velX.current) < 0.5 && Math.abs(velX.current) > 0.01) {
        if (velX.current > 0 && index > 0) {
          if (center < currentCenter) {
            closestElement = children[index - 1] as HTMLElement;
          }
        }
        if (velX.current < 0 && index < children.length - 1) {
          if (center > currentCenter) {
            closestElement = children[index + 1] as HTMLElement;
          }
        }
      }
    }

    if (closestElement) {
      scrollToElement(closestElement as HTMLElement);
    }
  };

  const scrollToElement = (element: HTMLElement) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const targetScroll = element.offsetLeft - (container.clientWidth / 2) + (element.offsetWidth / 2);

    animateScroll(container, targetScroll);
  };

  const animateScroll = (element: HTMLElement, target: number) => {
    const start = element.scrollLeft;
    const distance = target - start;
    const duration = 600;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = 1 - Math.pow(1 - progress, 3);

      element.scrollLeft = start + (distance * ease);

      if (timeElapsed < duration) {
        animationFrameId.current = requestAnimationFrame(animation);
      }
    };

    animationFrameId.current = requestAnimationFrame(animation);
  };

  return (
    <motion.div
      className="relative h-screen w-full bg-stone-950 overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with inline Category Filter */}
      <div className="absolute top-32 left-6 md:left-12 right-6 md:right-12 z-10 flex justify-between items-end pb-12">
        <h2 className="text-6xl md:text-8xl font-serif opacity-10 md:opacity-20 text-stone-100 pointer-events-none">精选作品集</h2>

        {/* Category Filter - Right Aligned */}
        <div className="flex gap-4 pointer-events-auto">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={sliderRef}
        className={`flex-1 overflow-x-auto overflow-y-hidden flex items-center px-6 md:px-12 gap-6 md:gap-24 no-scrollbar mt-32`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        data-cursor="drag"
      >
        {/* Intro Spacer / Title Card */}
        <div className="snap-center shrink-0 w-[80vw] md:w-[30vw] h-[60vh] flex flex-col justify-center pointer-events-none select-none">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">探索 <br /> 项目</h1>
          <p className="text-stone-400 max-w-xs text-sm leading-relaxed">
            横向滑动或滚动，即可浏览精心挑选的作品合集，其中涵盖数字艺术、摄影和装置艺术。
          </p>
          <div className="mt-8 w-24 h-[1px] bg-stone-700"></div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>

        {/* End Spacer */}
        <div className="snap-center shrink-0 w-[20vw]"></div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="absolute bottom-8 left-0 w-full px-12 hidden md:flex justify-center pointer-events-none">
        <span className="text-xs tracking-widest uppercase text-stone-600">滚动或水平拖动</span>
      </div>
    </motion.div>
  );
};

const ProjectCard: React.FC<{ project: typeof PROJECTS[0] }> = ({ project }) => {
  const ref = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-[60vh] md:h-[70vh] relative group perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      layout
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="w-full h-full relative"
      >
        <Link to={`/project/${project.id}`} className="block w-full h-full relative overflow-hidden rounded-sm shadow-2xl" draggable="false">
          <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
          <motion.img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            layoutId={`cover-${project.id}`}
            draggable="false"
            style={{ translateZ: "0px" }}
          />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ transform: "translateZ(50px)" }}>
            <div className="flex justify-between items-end border-b border-white/20 pb-4">
              <div>
                <span className="text-xs tracking-[0.2em] uppercase text-stone-300 block mb-2">{project.category}</span>
                <h3 className="text-3xl md:text-4xl font-serif">{project.title}</h3>
              </div>
              <div className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform">
                <ArrowRight size={20} />
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              {project.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-widest border border-white/20 px-2 py-1 rounded text-stone-400">{tag}</span>
              ))}
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default Work;
