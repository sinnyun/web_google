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
// 加载动画的贝塞尔曲线参数 - 控制网格动画的缓动效果
const LOADING_EASE = {
  GRID: [0.82, 0, 0.36, 1],    // 网格展开动画的贝塞尔曲线
  SCALE: [0.165, 0.84, 0.44, 1], // 英雄图片缩放动画的贝塞尔曲线
};

// "Camille Mormal" 签名贝塞尔曲线 - 用于重质感的移动效果
const CUSTOM_EASE = [0.25, 0.46, 0.45, 0.94];

// 动画阶段类型定义
type AnimationPhase = 'loading' | 'expanding' | 'heroExpanding';

// Preloader Component
interface PreloaderProps {
  onComplete: () => void;
  heroImageSrc: string;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete, heroImageSrc }) => {
  const [phase, setPhase] = useState<AnimationPhase>('loading');

  // Home images for the grid
  const HOME_IMAGES = [
    '/homeimg/home_00.jpg', '/homeimg/home_01.jpg', '/homeimg/home_02.jpg', '/homeimg/home_03.jpg',
    '/homeimg/home_04.jpg', '/homeimg/home_05.jpg', '/homeimg/home_06.jpg', '/homeimg/home_07.jpg',
  ];

  // 5x5 Grid placeholders
  const PLACEHOLDERS = [
    // Column 1
    HOME_IMAGES[0], HOME_IMAGES[1], HOME_IMAGES[2], HOME_IMAGES[3], HOME_IMAGES[4],
    // Column 2
    HOME_IMAGES[5], HOME_IMAGES[6], HOME_IMAGES[7], HOME_IMAGES[0], HOME_IMAGES[1],
    // Column 3 (Hero at index 12)
    HOME_IMAGES[2], HOME_IMAGES[3], heroImageSrc, HOME_IMAGES[5], HOME_IMAGES[6],
    // Column 4
    HOME_IMAGES[7], HOME_IMAGES[0], HOME_IMAGES[1], HOME_IMAGES[2], HOME_IMAGES[3],
    // Column 5
    HOME_IMAGES[4], HOME_IMAGES[5], HOME_IMAGES[6], HOME_IMAGES[7], HOME_IMAGES[0],
  ];

  // 动画时间线配置 - 这里是加载动画的核心时间参数
  const CONFIG = {
    loadingDelay: 50,        // 加载初始延迟（毫秒）- 确保图片加载前的最小延迟时间
    expandDuration: 3000,    // 网格展开动画持续时间（毫秒）- 从小网格扩展到正常大小
    heroExpandDuration: 1000, // 英雄图片展开动画持续时间（毫秒）- 从网格扩展到全屏
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runSequence = async () => {
      // 1. Loading Phase - 加载阶段：显示小网格缩略图
      setPhase('loading');

      // 确保英雄图片已加载
      const img = new Image();
      img.src = heroImageSrc;
      await new Promise((resolve) => {
        img.onload = resolve;
        // 同时满足最小延迟时间 CONFIG.loadingDelay
        setTimeout(resolve, CONFIG.loadingDelay);
      });

      // 2. Expanding Phase - 展开阶段：网格从小尺寸扩展到正常尺寸
      // 持续时间由 CONFIG.expandDuration 控制（默认3000毫秒）
      setPhase('expanding');
      await new Promise(r => setTimeout(r, CONFIG.expandDuration));

      // 3. Hero Expanding Phase - 英雄图片展开阶段：网格放大到全屏
      // 持续时间由 CONFIG.heroExpandDuration 控制（默认1000毫秒）
      setPhase('heroExpanding');
      await new Promise(r => setTimeout(r, CONFIG.heroExpandDuration));

      // 4. Complete -> 触发主页过渡动画
      onComplete();
    };

    runSequence();

    return () => clearTimeout(timer);
  }, [heroImageSrc]);

  // Helper: Get images for a specific column
  const getColumnImages = (colIndex: number) => {
    const start = colIndex * 5;
    return PLACEHOLDERS.slice(start, start + 5).map((src, i) => ({
      id: `img-${start + i}`,
      src,
      isHero: (start + i) === 12
    }));
  };

  // Helper: Get column animation variants
  const getColumnVariants = (colIndex: number) => {
    const isOdd = colIndex % 2 !== 0;
    const startY = isOdd ? '-250vh' : '250vh';

    return {
      initial: { y: startY },
      animate: (currentPhase: AnimationPhase) => {
        if (currentPhase === 'loading') return { y: startY };
        return { y: '0vh' };
      }
    };
  };

  return (
    // 使用 bg-stone-950 统一背景色
    <motion.div
      className="fixed inset-0 z-50 bg-stone-950 flex items-center justify-center overflow-hidden"
      // 添加退出动画：整体淡出
      exit={{ opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }}
    >
      {/* Grid Container */}
      {/* 网格容器 - 控制整体缩放动画 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.23, opacity: 1 }} // 初始状态：小尺寸缩略图
        animate={{
          scale: phase === 'loading' ? 0.23 : (phase === 'heroExpanding' ? 2.5 : 1), // 动画目标：小网格->正常尺寸->全屏
          opacity: phase === 'heroExpanding' ? 1 : 1 // 英雄图片展开时淡出
        }}
        transition={{
          // 动画持续时间根据阶段动态变化：使用配置中的时间参数
          duration: phase === 'heroExpanding' ? CONFIG.heroExpandDuration / 1000 : CONFIG.expandDuration / 1000,
          ease: phase === 'heroExpanding' ? LOADING_EASE.SCALE : LOADING_EASE.GRID // 使用对应的缓动曲线
        }}
      >
        <div className="flex justify-center items-center gap-4">
          {[0, 1, 2, 3, 4].map(colIndex => {
            const variant = getColumnVariants(colIndex);

            return (
              // 每列图片容器 - 控制列的滑入动画
              <motion.div
                key={colIndex}
                className="flex flex-col gap-4 w-[25vw]"
                initial={variant.initial} // 初始状态：从屏幕外滑入
                animate={variant.animate(phase)} // 根据当前动画阶段改变状态
                transition={{
                  duration: CONFIG.expandDuration / 1000, // 使用配置中的展开时间
                  ease: LOADING_EASE.GRID // 使用网格缓动曲线
                }}
              >
                {getColumnImages(colIndex).map((item, idx) => (
                  <div key={idx} className="w-full h-[30vh] relative overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={item.src}
                      className="w-full h-full object-cover opacity-90"
                      alt=""
                    />
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Hero Overlay - 英雄图片覆盖层 */}
      {/* 这个层在英雄图片展开阶段显示，全屏展示英雄图片，最终淡出露出主页背景 */}
      {phase === 'heroExpanding' && (
        <motion.div
          className="absolute inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }} // 初始透明
          animate={{ opacity: 1 }} // 逐渐显示
          transition={{
            duration: CONFIG.heroExpandDuration / 1000, // 使用配置中的英雄展开时间
            ease: LOADING_EASE.SCALE // 使用缩放缓动曲线
          }}
        >
          <img
            src={heroImageSrc}
            className="w-full h-full object-cover"
            alt="Hero Fullscreen"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const lastWheelTime = React.useRef(0);
  const lastButtonTime = React.useRef(0);

  /*
   * 加载动画时间参数修改指南：
   * 
   * 1. 主要时间参数（CONFIG对象）：
   *    - loadingDelay: 50ms - 加载初始延迟
   *    - expandDuration: 3000ms - 网格展开动画时间
   *    - heroExpandDuration: 1000ms - 英雄图片展开时间
   *    
   * 2. 首次加载后元素显示时间：
   *    - 类别标签：5.0秒后显示
   *    - 标题：5.2秒后显示
   *    - 按钮：5.5秒后显示
   *    - 底部导航：4.8秒后显示
   *    
   * 3. 自动轮播参数：
   *    - 首次延迟：3000ms (3秒)
   *    - 轮播间隔：6000ms (6秒)
   * 
   * 总加载动画时间 = loadingDelay + expandDuration + heroExpandDuration ≈ 4.05秒
   */

  // Auto-advance - 自动轮播设置
  useEffect(() => {
    if (isLoading) return;
    
    let lastAutoSwitch = Date.now();
    
    // 延迟2秒后开始自动轮播
    const startDelay = setTimeout(() => {
      const timer = setInterval(() => {
        const now = Date.now();
        // 确保距离上次切换至少6秒，防止快速切换
        if (now - lastAutoSwitch >= 6000) {
          nextSlide(true); // 传递true表示这是自动切换
          lastAutoSwitch = now;
        }
      }, 1000); // 每秒检查一次
      
      return () => clearInterval(timer);
    }, 2000);

    return () => clearTimeout(startDelay);
  }, [isLoading]); // 只依赖isLoading

  const nextSlide = (isAuto = false) => {
    const now = Date.now();
    // 添加与动画时间相同的节流保护（1.2秒 + 0.1秒缓冲）
    if (!isAuto && now - lastButtonTime.current < 1300) return;
    
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDER_PROJECTS.length);
    lastButtonTime.current = now;
  };

  const prevSlide = () => {
    const now = Date.now();
    // 添加与动画时间相同的节流保护（1.2秒 + 0.1秒缓冲）
    if (now - lastButtonTime.current < 1300) return;
    
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDER_PROJECTS.length) % SLIDER_PROJECTS.length);
    lastButtonTime.current = now;
  };

  const goToSlide = (index: number) => {
    const now = Date.now();
    // 添加与动画时间相同的节流保护（1.2秒 + 0.1秒缓冲）
    if (now - lastButtonTime.current < 1300) return;
    
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    lastButtonTime.current = now;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    // 使用与按钮切换相同的节流保护
    if (now - lastWheelTime.current < 1300) return;

    if (e.deltaY > 0) {
      nextSlide();
      lastWheelTime.current = now;
    } else if (e.deltaY < 0) {
      prevSlide();
      lastWheelTime.current = now;
    }
  };

  const currentProject = SLIDER_PROJECTS[currentIndex];
  // Determine if this is the first slide after loading to disable initial animation
  const isFirstSlide = !isLoading && currentIndex === 0 && direction === 0;

  // --- Animation Variants ---
  const slideVariants = {
    enter: (direction: number) => ({
      clipPath: direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      scale: 1.1,
      filter: "brightness(0.5)",
      transition: {
        duration: 1.2,
        ease: CUSTOM_EASE,
      }
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
    // 使用 Fragment 使得 Preloader 和 Home 内容可以同级渲染
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader
            key="preloader"
            onComplete={() => setIsLoading(false)}
            heroImageSrc={SLIDER_PROJECTS[0].coverImage}
          />
        )}
      </AnimatePresence>

      {/* Home Content - Always render but hidden behind preloader initially */}
      <motion.div
        key="home"
        className="fixed inset-0 w-full h-full overflow-hidden bg-stone-950"
        onWheel={handleWheel}
      >
        {/* 当Preloader消失时，这里已经是可见的了 */}
        {/* Main Slider - 移除 initial={false} 或设为 true，确保第一屏文字动画生效 */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence custom={direction} mode="popLayout">
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
                /* Subtle parallax/Ken Burns. Disable initial scale for first slide to match preloader. */
                initial={{ scale: isFirstSlide ? 1 : 1.1 }}
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
                  // 首次加载后延迟5.0秒显示 (预加载约4.5秒 + 0.5秒缓冲) - 确保在英雄图片展开后才显示
                  // 如果要调整首次加载后文字出现的时间，请修改这里的5.0值
                  transition={{ duration: 0.8, ease: CUSTOM_EASE, delay: isFirstSlide ? 3.0 : 0.4 }}
                  className="block text-sm md:text-base tracking-[0.3em] uppercase text-stone-300 mb-4"
                >
                  {currentProject.category} — {currentProject.year}
                </motion.span>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 40, rotate: 2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -40, rotate: -2 }}
                  // 首次加载后延迟5.2秒显示标题 - 比类别标签稍晚0.2秒
                  // 如果要调整首次加载后标题出现的时间，请修改这里的5.2值
                  transition={{ duration: 1.0, ease: CUSTOM_EASE, delay: isFirstSlide ? 2.2 : 0.5 }}
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
                  // 首次加载后延迟5.5秒显示按钮 - 比标题再晚0.3秒
                  // 如果要调整首次加载后按钮出现的时间，请修改这里的5.5值
                  transition={{ delay: isFirstSlide ? 2.5 : 0.8, duration: 0.8, ease: "easeOut" }}
                  className="pointer-events-auto"
                >
                  <Link
                    to={`/project/${currentProject.id}`}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-500"
                  >
                    <span className="tracking-widest uppercase text-xs">查看项目</span>
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
        {/* Add entry animation for bottom bar */}
        <motion.div
          initial={{ y: "100%" }} // 初始状态：从底部滑入
          animate={{ y: 0 }} // 动画到正常位置
          transition={{ 
            duration: 1.0, // 动画持续时间1秒
            ease: CUSTOM_EASE, // 使用自定义缓动曲线
            delay: 4.8 // 首次加载后延迟4.8秒显示 - 在所有元素显示前显示底部导航
            // 如果要调整底部导航栏出现的时间，请修改这里的4.8值
          }}
          className="absolute bottom-0 left-0 w-full z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-32 pb-8 md:pb-12 px-6 md:px-12"
        >
          <div className="flex justify-between items-end border-t border-white/10 pt-8">
            {/* Slide Counter */}
            <div className="hidden md:block">
              <div className="text-xs tracking-widest text-stone-400 mb-2">当前</div>
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
        </motion.div>
      </motion.div>
    </>
  );
};

export default Home;