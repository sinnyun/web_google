/**
 * ============================================
 * 主页加载动画调试组件 (LoadingDebug.tsx)
 * ============================================
 * 
 * 重构版本：按照4个标准阶段实现的5x5网格动画
 * 
 * 动画流程 (4个阶段):
 * 1. loading (0-1.8s): 初始状态，准备资源
 * 2. expanding (1.8-4.3s): 网格展开 & 列交替滑入
 * 3. heroExpanding (4.3-5.3s): Hero图片扩展填满屏幕
 * 4. complete (5.3s+): 动画完成，准备下一次循环
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../data';

// === 缓动曲线配置 ===
const EASE = {
  GRID: [0.82, 0, 0.36, 1],        // 网格展开 & 列滑入
  SCALE: [0.165, 0.84, 0.44, 1],   // Hero扩展
};

// === 动画阶段定义 ===
type AnimationPhase = 'loading' | 'expanding' | 'heroExpanding' | 'complete';

const LoadingAnimation: React.FC = () => {
  // 状态管理
  const [currentCycle, setCurrentCycle] = useState(1);
  const [phase, setPhase] = useState<AnimationPhase>('loading');

  // 图片资源
  const heroImageSrc = PROJECTS[0]?.coverImage || '/homeimg/home_00.jpg';
  const HOME_IMAGES = [
    '/homeimg/home_00.jpg', '/homeimg/home_01.jpg', '/homeimg/home_02.jpg', '/homeimg/home_03.jpg',
    '/homeimg/home_04.jpg', '/homeimg/home_05.jpg', '/homeimg/home_06.jpg', '/homeimg/home_07.jpg',
  ];

  // 生成25张图片数据 (5列 x 5行)
  const PLACEHOLDERS = [
    // 第1列
    HOME_IMAGES[0], HOME_IMAGES[1], HOME_IMAGES[2], HOME_IMAGES[3], HOME_IMAGES[4],
    // 第2列
    HOME_IMAGES[5], HOME_IMAGES[6], HOME_IMAGES[7], HOME_IMAGES[0], HOME_IMAGES[1],
    // 第3列 (中间是Hero)
    HOME_IMAGES[2], HOME_IMAGES[3], heroImageSrc, HOME_IMAGES[5], HOME_IMAGES[6],
    // 第4列
    HOME_IMAGES[7], HOME_IMAGES[0], HOME_IMAGES[1], HOME_IMAGES[2], HOME_IMAGES[3],
    // 第5列
    HOME_IMAGES[4], HOME_IMAGES[5], HOME_IMAGES[6], HOME_IMAGES[7], HOME_IMAGES[0],
  ];

  // === 动画配置参数 ===
  const CONFIG = {
    // 阶段时长 (ms)
    loadingDelay: 50,       // 阶段1: 等待时长
    expandDuration: 3500,     // 阶段2: 展开时长
    heroExpandDuration: 1000, // 阶段3: Hero扩展时长
    cycleInterval: 2000,      // 阶段4: 停留多久后重启

    // 调试开关
    showDebug: true,
  };

  // === 动画生命周期控制 ===
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runSequence = async () => {
      // 1. Loading 阶段
      setPhase('loading');
      await new Promise(r => setTimeout(r, CONFIG.loadingDelay));

      // 2. Expanding 阶段
      setPhase('expanding');
      await new Promise(r => setTimeout(r, CONFIG.expandDuration));

      // 3. HeroExpanding 阶段
      setPhase('heroExpanding');
      await new Promise(r => setTimeout(r, CONFIG.heroExpandDuration));

      // 4. Complete 阶段
      setPhase('complete');

      // 准备下一次循环
      setTimeout(() => {
        setCurrentCycle(c => c + 1);
        // 循环会触发useEffect重新执行 (依赖 currentCycle)
      }, CONFIG.cycleInterval);
    };

    runSequence();

    return () => clearTimeout(timer); // 清理可能的定时器
  }, [currentCycle]);


  // === 辅助函数 ===

  // 获取列图片数据
  const getColumnImages = (colIndex: number) => {
    const start = colIndex * 5;
    return PLACEHOLDERS.slice(start, start + 5).map((src, i) => ({
      id: `img-${start + i}`,
      src,
      isHero: (start + i) === 12 // 索引12是中心点 (第3列第3个)
    }));
  };

  // 获取列动画属性 (交替滑入)
  const getColumnVariants = (colIndex: number) => {
    const isOdd = colIndex % 2 !== 0; // 1, 3
    // 奇数列从上(-100vh)滑入，偶数列从下(100vh)滑入
    const startY = isOdd ? '-200vh' : '200vh';

    return {
      initial: { y: startY },
      animate: (currentPhase: AnimationPhase) => {
        if (currentPhase === 'loading') return { y: startY };
        // 在 expanding 及之后阶段，都保持在中间 (y: 0)
        return { y: '0vh' };
      }
    };
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#141414]">
      {/* 调试信息 */}
      {CONFIG.showDebug && (
        <div className="absolute top-4 left-4 z-[100] bg-black/80 text-white p-4 rounded text-sm font-mono pointer-events-none">
          <div className="text-yellow-400 font-bold mb-1">调试模式 (重构版)</div>
          <div>Cycle: {currentCycle}</div>
          <div>Phase: <span className="text-green-400">{phase}</span></div>
          <div className="mt-2 text-xs opacity-70">
            1. loading (0-1.8s)<br />
            2. expanding (1.8-4.3s)<br />
            3. heroExpanding (4.3-5.3s)<br />
            4. complete
          </div>
        </div>
      )}

      {/* === 核心网格容器 === */}
      {/* 负责整体缩放和淡出动画 */}
      <motion.div
        key={`grid-${currentCycle}`}
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.23, opacity: 1 }}
        animate={{
          // 阶段1: 0.23
          // 阶段2: 1.0
          // 阶段3: 2.5 (放大)
          scale: phase === 'loading' ? 0.23 : (phase === 'heroExpanding' || phase === 'complete' ? 2.5 : 1),
          // 阶段3时淡出，让位给HeroOverlay
          opacity: (phase === 'heroExpanding' || phase === 'complete') ? 0 : 1
        }}
        transition={{
          duration: phase === 'heroExpanding' ? CONFIG.heroExpandDuration / 1000 : CONFIG.expandDuration / 1000,
          ease: phase === 'heroExpanding' ? EASE.SCALE : EASE.GRID
        }}
      >
        <div className="flex justify-center items-center gap-4">
          {[0, 1, 2, 3, 4].map(colIndex => {
            const variant = getColumnVariants(colIndex);

            return (
              <motion.div
                key={colIndex}
                className="flex flex-col gap-4 w-[25vw]" // 固定宽度确保布局稳定
                initial={variant.initial}
                animate={variant.animate(phase)}
                transition={{
                  duration: CONFIG.expandDuration / 1000,
                  ease: EASE.GRID
                }}
              >
                {getColumnImages(colIndex).map((item, idx) => (
                  <div key={idx} className="w-full h-[30vh] relative overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={item.src}
                      className="w-full h-full object-cover opacity-90"
                      alt=""
                    />
                    {item.isHero && CONFIG.showDebug && (
                      <div className="absolute inset-0 border-4 border-red-500/50 flex items-center justify-center text-red-500 font-bold">
                        HERO
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* === Hero全屏覆盖层 === */}
      {/* 仅在 heroExpanding 阶段显示，负责最终的全屏效果 */}
      {(phase === 'heroExpanding' || phase === 'complete') && (
        <motion.div
          className="absolute inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: CONFIG.heroExpandDuration / 1000,
            ease: EASE.SCALE
          }}
        >
          <img
            src={heroImageSrc}
            className="w-full h-full object-cover"
            alt="Hero Fullscreen"
          />
        </motion.div>
      )}
    </div>
  );
};

export default LoadingAnimation;