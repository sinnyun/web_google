import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../data';
import { ArrowRight } from 'lucide-react';

const Work: React.FC = () => {
  // We are using native horizontal scroll for better accessibility and performance,
  // but enriching it with Framer Motion for entrance animations.
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Momentum/Snap Refs
  const velX = useRef(0);
  const lastX = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const isDragging = useRef(false);

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
    const walk = (x - startX) * 2; // Scroll-fast
    sliderRef.current.scrollLeft = scrollLeft - walk;

    // Calculate velocity
    const delta = e.pageX - lastX.current;
    lastX.current = e.pageX;
    velX.current = delta;
  };

  const beginMomentum = () => {
    if (Math.abs(velX.current) < 0.5) {
      snapToNearest();
      return;
    }

    velX.current *= 0.95; // Friction
    if (sliderRef.current) {
      // For drag: velX is positive when moving right (mouse moves right).
      // If mouse moves right, we want to scroll left (pulling content).
      // So scrollLeft -= velX.

      // For wheel: we adjusted handleWheel to subtract from velX.
      // So if wheel down (scroll right), velX is negative.
      // scrollLeft -= (-val) -> scrollLeft += val. Scroll increases. Correct.

      sliderRef.current.scrollLeft -= velX.current * 2;
    }

    animationFrameId.current = requestAnimationFrame(beginMomentum);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (sliderRef.current) {
      stopAnimation();
      // Wheel down (positive deltaY) -> Scroll Right (increase scrollLeft)
      // beginMomentum does: scrollLeft -= velX
      // So we need negative velX to increase scrollLeft
      velX.current -= e.deltaY * 0.5;

      // Cap velocity
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

    // Find closest child
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

    // Directional Snapping Logic
    // If we have significant velocity or moved enough, force next/prev
    if (closestElement) {
      const index = children.indexOf(closestElement);
      const currentCenter = closestElement.offsetLeft + closestElement.offsetWidth / 2;

      // Positive Velocity = Drag Right = Scroll Left -> Go Prev (Left)
      // We want to go to the previous item if we are moving left.
      if (velX.current > 0.5 && index > 0) {
        // Only force prev if closestElement is NOT already the previous one (i.e., it's the current one we are leaving)
        // If center < currentCenter, we are to the left of the closest element's center.
        // If we are moving left (velX > 0), and we are still to the right of the target's center, we might need to push.

        // Simpler check:
        // If closestElement is the one we are currently looking at (roughly), and we move left, we want index - 1.
        // If closestElement is ALREADY index - 1 (because we scrolled past midpoint), we don't need to do anything.

        // How do we know if closestElement is "current" or "next"?
        // We compare center (scroll position) with currentCenter.

        // If we are moving Left (velX > 0):
        // We want to end up at a position where center approx equals targetCenter.
        // If center > currentCenter, we are to the right of the closest element. 
        // This means closestElement is to our Left. It IS the target. So we stick with it.

        // If center < currentCenter, we are to the left of the closest element.
        // This means closestElement is to our Right. It is the "Current" or "Next" one we are leaving.
        // So we want to go to index - 1.

        if (center < currentCenter && index > 0) {
          closestElement = children[index - 1] as HTMLElement;
        }
      } else if (velX.current < -0.5 && index < children.length - 1) {
        // Negative Velocity = Drag Left = Scroll Right -> Go Next (Right)
        // If center > currentCenter, we are to the right of the closest element.
        // This means closestElement is to our Left. It is the "Current" or "Prev" one.
        // So we want to go to index + 1.

        if (center > currentCenter && index < children.length - 1) {
          closestElement = children[index + 1] as HTMLElement;
        }
      }

      // Special case: if velocity is very low but we are "in between", bias towards direction
      // This handles the "small scroll" case
      if (Math.abs(velX.current) < 0.5 && Math.abs(velX.current) > 0.01) {
        // If we slightly scrolled left (positive vel), prefer prev
        if (velX.current > 0 && index > 0) {
          // If closestElement is to our Right (center < currentCenter), it's the one we are leaving. Go prev.
          if (center < currentCenter) {
            closestElement = children[index - 1] as HTMLElement;
          }
        }
        // If we slightly scrolled right (negative vel), prefer next
        if (velX.current < 0 && index < children.length - 1) {
          // If closestElement is to our Left (center > currentCenter), it's the one we are leaving. Go next.
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
    const duration = 600; // ms
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Ease out cubic
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
      {/* Fixed Header Space */}
      <div className="absolute top-24 left-6 md:left-12 z-10 pointer-events-none">
        <h2 className="text-6xl md:text-8xl font-serif opacity-10 md:opacity-20 text-stone-100">Selected Works</h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={sliderRef}
        className={`flex-1 overflow-x-auto overflow-y-hidden flex items-center px-6 md:px-12 gap-6 md:gap-24 no-scrollbar ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
      >

        {/* Intro Spacer / Title Card */}
        <div className="snap-center shrink-0 w-[80vw] md:w-[30vw] h-[60vh] flex flex-col justify-center pointer-events-none select-none">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">Explore <br /> Projects</h1>
          <p className="text-stone-400 max-w-xs text-sm leading-relaxed">
            Swipe or scroll horizontally to navigate through the curated collection of works spanning digital art, photography, and installations.
          </p>
          <div className="mt-8 w-24 h-[1px] bg-stone-700"></div>
        </div>

        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {/* End Spacer */}
        <div className="snap-center shrink-0 w-[20vw]"></div>
      </div>

      {/* Scroll Progress Indicator (Visual Only) */}
      <div className="absolute bottom-8 left-0 w-full px-12 hidden md:flex justify-center pointer-events-none">
        <span className="text-xs tracking-widest uppercase text-stone-600">Scroll or Drag Horizontal</span>
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
      className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-[60vh] md:h-[70vh] relative group cursor-pointer perspective-1000"
      initial={{ opacity: 0.5, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ margin: "-10% 0px -10% 0px", once: false }}
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
              {project.tags.slice(0, 2).map(tag => (
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
