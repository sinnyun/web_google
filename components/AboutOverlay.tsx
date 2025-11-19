/**
 * ============================================
 * 关于页面弹窗组件 (AboutOverlay.tsx)
 * ============================================
 * 
 * 这个文件控制"关于"页面的内容显示。
 * 点击导航栏的"About"按钮时会弹出这个页面。
 * 
 * 你可以在这里修改：
 * 1. 个人简介文字
 * 2. 联系方式
 * 3. 社交媒体链接
 * 4. 客户列表
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Instagram, Linkedin, ArrowRight } from 'lucide-react';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutOverlay: React.FC<AboutOverlayProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-stone-950 text-stone-50 flex flex-col overflow-hidden"
        >
          {/* ========== 顶部栏 ========== */}
          <div className="flex justify-between items-center p-8 md:p-12">
            {/* 
              网站名称/Logo
              修改方法：将 "Sinnyun" 替换为你的名字
            */}
            <div className="text-xl tracking-widest font-bold uppercase">Sinnyun</div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-full transition-colors group"
            >
              <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* ========== 主要内容区域 ========== */}
          <div className="flex-1 flex flex-col md:flex-row p-8 md:p-12 gap-12 overflow-y-auto">

            {/* ========== 左侧：大标题 ========== */}
            <div className="md:w-1/2 flex flex-col justify-center space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-8xl font-serif leading-tight"
              >
                {/* 
                  主标题文字
                  修改方法：
                  - 直接修改文字内容
                  - <br /> 表示换行
                  - <span className="italic text-stone-400"> 表示斜体灰色文字
                  
                  示例：
                  设计师 <br />
                  <span className="italic text-stone-400">用心</span> 创作 <br />
                  每一个作品。
                */}
                Creating digital <br />
                <span className="italic text-stone-400">silence</span> amidst <br />
                the noise.
              </motion.h2>
            </div>

            {/* ========== 右侧：详细信息 ========== */}
            <div className="md:w-1/2 flex flex-col justify-center space-y-12">

              {/* ========== 个人简介 ========== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6 text-lg md:text-xl font-light text-stone-300 max-w-xl"
              >
                {/* 
                  简介段落
                  修改方法：
                  - 每个 <p> 标签包含一段文字
                  - 可以添加或删除段落
                  - 直接修改文字内容即可
                  
                  示例：
                  <p>
                    我是一名设计师，专注于视觉设计和用户体验。
                  </p>
                  <p>
                    拥有5年的设计经验，服务过多家知名品牌。
                  </p>
                */}
                <p>
                  I am Sinnyun, a multidisciplinary designer based in Tokyo. My work bridges the gap between brutalist architecture principles and ephemeral digital experiences.
                </p>
                <p>
                  With over 10 years of experience in visual design, photography, and interactive media, I strive to strip away the unnecessary, leaving only pure emotion and function.
                </p>
              </motion.div>

              {/* ========== 联系方式 ========== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                {/* 
                  "Contact" 标题
                  修改方法：将 "Contact" 替换为 "联系方式" 或其他文字
                */}
                <h3 className="text-sm uppercase tracking-widest text-stone-500">Contact</h3>

                {/* 
                  邮箱地址
                  修改方法：
                  - href="mailto:你的邮箱" 设置邮箱链接
                  - 显示文字也要同步修改
                  
                  示例：
                  <a href="mailto:your@email.com" ...>
                    <Mail ... /> your@email.com
                  </a>
                */}
                <a href="mailto:hello@sinnyun.design" className="flex items-center gap-4 text-2xl hover:text-stone-400 transition-colors group">
                  <Mail className="group-hover:scale-110 transition-transform" /> hello@sinnyun.design
                </a>

                {/* 
                  社交媒体链接
                  修改方法：
                  - href="#" 替换为你的社交媒体链接
                  - 可以添加更多社交媒体图标
                  
                  示例：
                  <a href="https://instagram.com/你的用户名" ...>
                    <Instagram size={28} />
                  </a>
                  <a href="https://linkedin.com/in/你的用户名" ...>
                    <Linkedin size={28} />
                  </a>
                */}
                <div className="flex gap-6 pt-4">
                  <a href="#" className="hover:text-stone-400 transition-colors"><Instagram size={28} /></a>
                  <a href="#" className="hover:text-stone-400 transition-colors"><Linkedin size={28} /></a>
                </div>
              </motion.div>

              {/* ========== 客户列表 ========== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8"
              >
                {/* 
                   "Selected Clients" 标题
                   修改方法：将 "Selected Clients" 替换为 "合作客户" 或其他文字
                 */}
                <h3 className="text-sm uppercase tracking-widest text-stone-500 mb-4">Selected Clients</h3>

                {/* 
                   客户列表
                   修改方法：
                   - 每个 <li> 标签包含一个客户名称
                   - 可以添加或删除 <li> 来增减客户
                   - grid-cols-2 表示两列显示，可改为 grid-cols-3（三列）
                   
                   示例：
                   <ul className="grid grid-cols-2 gap-2 text-stone-400">
                     <li>客户A</li>
                     <li>客户B</li>
                     <li>客户C</li>
                     <li>客户D</li>
                   </ul>
                 */}
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
          {/* 
            大型背景文字
            修改方法：将 "PORTFOLIO" 替换为其他文字
            这是纯装饰性元素，可以删除整个 div
          */}
          <div className="p-8 md:p-12 text-stone-800 text-[10vw] leading-none font-serif opacity-20 select-none pointer-events-none absolute bottom-[-2vw] right-0">
            PORTFOLIO
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutOverlay;

/**
 * ============================================
 * 快速修改指南
 * ============================================
 * 
 * 1. 修改个人简介：
 *    找到 <p> 标签，直接修改其中的文字
 * 
 * 2. 修改邮箱：
 *    找到 href="mailto:..." 和显示的邮箱文字
 *    两处都要修改
 * 
 * 3. 添加社交媒体：
 *    复制一个 <a href="#"> 标签
 *    修改链接和图标
 * 
 * 4. 修改客户列表：
 *    在 <ul> 中添加或删除 <li> 标签
 * 
 * 5. 修改大标题：
 *    找到 <motion.h2> 标签
 *    修改其中的文字和换行
 * 
 * 注意事项：
 * - 保持 HTML 标签的完整性（开始和结束标签要配对）
 * - 不要删除 className 属性
 * - 修改后保存文件，刷新浏览器查看效果
 */
