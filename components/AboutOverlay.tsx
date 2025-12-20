/**
 * ============================================
 * 关于页面弹窗组件 (AboutOverlay.tsx)
 * ============================================
 * 
 * 这个文件控制"关于"页面的内容显示。
 * 点击导航栏的"About"按钮时会弹出这个页面。
 * 
 * 修复内容：
 * - 确保关于页面完全覆盖整个屏幕
 * - 打开时禁用底层页面滚动
 * - 只允许关于页面内容区域滚动
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Instagram, Linkedin, ArrowRight } from 'lucide-react';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutOverlay: React.FC<AboutOverlayProps> = ({ isOpen, onClose }) => {
  // 修复：当关于页面打开时，禁用底层页面的滚动
  useEffect(() => {
    if (isOpen) {
      // 保存当前滚动位置
      const scrollY = window.scrollY;
      
      // 禁用 body 滚动
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // 清理函数：关闭时恢复滚动和位置
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // 恢复之前的滚动位置
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          // 修复：确保完全覆盖整个视口
          // - fixed: 固定定位，脱离文档流
          // - inset-0: top/right/bottom/left 都为 0
          // - z-50: 确保在最上层
          // - h-screen w-screen: 完整视口高度和宽度
          // - overflow-hidden: 防止整个容器滚动
          className="fixed inset-0 z-50 text-stone-50 overflow-hidden h-screen w-screen"
        >
          {/* ========== 背景图片层 ========== */}
          {/* 修复：确保背景层也是全屏的 */}
          <div className="absolute inset-0 z-0 h-full w-full">
            {/* 背景图片 */}
            <motion.img
              src="/homeimg/aboutbg.jpg"
              alt=""
              className="w-full h-full object-cover opacity-50"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            {/* 渐变毛玻璃遮罩层 */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/70 to-stone-950/85 backdrop-blur-md"></div>
          </div>

          {/* ========== 内容层 ========== */}
          {/* 修复：使用 flex 布局确保内容区域正确填充 */}
          <div className="relative z-10 flex flex-col h-full w-full">
            
            {/* ========== 顶部栏 ========== */}
            {/* 修复：固定高度，不参与滚动 */}
            <div className="flex-shrink-0 flex justify-between items-center p-8 md:p-12">
              <img src="/logo.svg" alt="Sinnyun" className="h-8" />
              <button
                onClick={onClose}
                aria-label="关闭关于页面"
                className="p-2 hover:bg-stone-800 rounded-full transition-colors group"
              >
                <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* ========== 主要内容区域 ========== */}
            {/* 修复：
                - flex-1: 占据剩余空间
                - overflow-y-auto: 只在这个区域内垂直滚动
                - overflow-x-hidden: 防止水平滚动
            */}
            <div className="flex-1 flex flex-col md:flex-row p-8 md:p-12 gap-12 overflow-y-auto overflow-x-hidden">

              {/* ========== 左侧：头像和大标题 ========== */}
              <div className="md:w-1/2 flex flex-col justify-center space-y-8 md:pl-16 lg:pl-24">
                
                {/* 头像图片 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center md:justify-start"
                >
                  <img
                    src="/avatar.jpg"
                    alt="罗祥云(sinnyun)的个人头像"
                    className="w-48 h-48 md:w-64 md:h-64 rounded-md object-cover border-2 border-stone-600"
                  />
                </motion.div>

                {/* 主标题 */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl lg:text-8xl font-serif leading-tight"
                >
                  <span className="italic text-stone-400">HI！你好！</span> <br />
                  越努力，越幸运。<br />
                </motion.h2>
              </div>

              {/* ========== 右侧：详细信息 ========== */}
              <div className="md:w-1/2 flex flex-col justify-center space-y-12">

                {/* ========== 个人简介 ========== */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6 text-lg md:text-xl font-light text-stone-300 max-w-2xl"
                >
                  <p>
                    我的名字叫 罗祥云sinnyun，来自于有"万里长江第一城"之称的四川宜宾，现在主要工作在成都。
                  </p>
                  <p>
                    其实对于设计这个行业，是在大学的时候才开始真正的接触的。虽然时间算不上很长，但设计的内涵一直在深深的吸引着我。设计是一段很奇妙的思想路程，既可以让人回忆起以往的一个瞬间，又会带给我们进入不同于现在的未来之中。 努力做一个不断求成长的设计师。
                  </p>
                </motion.div>

                {/* ========== 联系方式 ========== */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm uppercase tracking-widest text-stone-500">联系方式</h3>
                  <a href="mailto:l616631804@gmail.com" className="flex items-center gap-4 text-2xl hover:text-stone-400 transition-colors group">
                    <Mail className="group-hover:scale-110 transition-transform" /> l616631804@gmail.com
                  </a>
                  <div className="flex gap-6 pt-4">
                    <a 
                      href="https://github.com/sinnyun" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-stone-400 transition-colors" 
                      title="GitHub"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com/in/yourusername" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-stone-400 transition-colors" 
                      title="LinkedIn"
                    >
                      <Linkedin size={28} />
                    </a>
                  </div>
                </motion.div>

                {/* ========== 技能专长 ========== */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="space-y-6"
                >
                  <h3 className="text-sm uppercase tracking-widest text-stone-500">技能专长</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">UI/UX设计</h4>
                      <p className="text-stone-400 text-sm">创造直观且引人入胜的用户界面</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">前端开发</h4>
                      <p className="text-stone-400 text-sm">构建响应式和交互式网站</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">视觉设计</h4>
                      <p className="text-stone-400 text-sm">开发独特的品牌视觉识别</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">动效设计</h4>
                      <p className="text-stone-400 text-sm">创作流畅的界面动画</p>
                    </div>
                  </div>
                </motion.div>

                {/* ========== 客户列表 ========== */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="pt-8"
                >
                  <h3 className="text-sm uppercase tracking-widest text-stone-500 mb-4">合作客户</h3>
                  <ul className="grid grid-cols-2 gap-2 text-stone-400">
                    <li>Mori Art Museum</li>
                    <li>Sony Design</li>
                    <li>Issey Miyake</li>
                    <li>Uniqlo</li>
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* ========== 底部装饰文字 ========== */}
            {/* 修复：使用 pointer-events-none 确保不影响滚动 */}
            <div className="p-8 md:p-12 text-stone-800 text-[10vw] leading-none font-serif opacity-20 select-none pointer-events-none absolute bottom-[-2vw] right-0">
              PORTFOLIO
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutOverlay;

/**
 * ============================================
 * 修复说明
 * ============================================
 * 
 * 1. 添加了 useEffect 钩子来禁用底层页面滚动
 *    - 打开时：锁定 body 滚动
 *    - 关闭时：恢复 body 滚动和位置
 * 
 * 2. 确保关于页面完全覆盖整个屏幕
 *    - h-screen w-screen: 完整视口尺寸
 *    - fixed inset-0: 固定定位覆盖全屏
 *    - z-50: 确保在最上层
 * 
 * 3. 优化滚动行为
 *    - 容器：overflow-hidden（不滚动）
 *    - 内容区域：overflow-y-auto（可滚动）
 *    - 顶部栏：flex-shrink-0（固定不滚动）
 * 
 * 4. 背景层确保全屏
 *    - h-full w-full 确保背景完全填充
 */
