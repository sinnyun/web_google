/**
 * ============================================
 * 主应用文件 (App.tsx)
 * ============================================
 * 
 * 这是网站的核心文件，负责：
 * 1. 路由配置（页面跳转）
 * 2. 导航栏
 * 3. 关于页面弹窗
 * 4. 自定义光标
 * 
 * 一般情况下，你只需要修改导航栏的文字内容。
 */

import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import AboutOverlay from './components/AboutOverlay';
import { AnimatePresence } from 'framer-motion';

import Cursor from './components/Cursor';

/**
 * ============================================
 * 导航栏组件
 * ============================================
 * 
 * 显示在页面顶部的导航栏，包含：
 * - 网站Logo/名称（左侧）
 * - Work链接（中间，桌面端显示）
 * - About按钮（右侧）
 */
const Navbar: React.FC<{ onOpenAbout: () => void }> = ({ onOpenAbout }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center bg-gradient-to-b from-black/10 to-transparent text-white transition-colors duration-500`}>

      {/* ========== Logo/网站名称 ========== */}
      {/* 
        修改方法：
        - 将 "Sinnyun" 替换为你的名字或品牌名
        - tracking-[0.2em] 控制字母间距
        - uppercase 表示大写显示
      */}
      <Link to="/" className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
        Sinnyun
      </Link>

      {/* ========== 右侧导航链接 ========== */}
      <div className="flex items-center gap-8 md:gap-12">

        {/* Work 链接（仅在桌面端显示） */}
        {/* 
          修改方法：
          - 将 "Work" 替换为你想要的文字
          - hidden md:block 表示手机端隐藏，桌面端显示
        */}
        <Link to="/work" className={`hidden md:block text-sm tracking-widest uppercase hover:underline underline-offset-8 ${location.pathname === '/work' ? 'underline' : ''}`}>
          Work
        </Link>

        {/* About 按钮 */}
        {/* 
          修改方法：
          - 将 "About" 替换为你想要的文字
          - 点击会打开关于页面弹窗
        */}
        <button
          onClick={onOpenAbout}
          className="flex items-center gap-2 text-sm tracking-widest uppercase hover:opacity-70 transition-opacity group"
        >
          <span className="hidden md:inline">About</span>
          <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

/**
 * ============================================
 * 主应用组件
 * ============================================
 * 
 * 整合所有页面和组件的主容器
 */
const App: React.FC = () => {
  // 控制关于页面弹窗的显示/隐藏
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <HashRouter>
      {/* ========== 主容器 ========== */}
      {/* 
        样式说明：
        - bg-stone-950: 深灰黑色背景
        - text-stone-50: 浅灰白色文字
        - cursor-none: 隐藏默认光标（使用自定义光标）
      */}
      <div className="bg-stone-950 min-h-screen text-stone-50 selection:bg-white selection:text-black cursor-none">

        {/* 自定义光标组件 */}
        <Cursor />

        {/* 导航栏 */}
        <Navbar onOpenAbout={() => setIsAboutOpen(true)} />

        {/* 关于页面弹窗 */}
        <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

        {/* ========== 页面路由配置 ========== */}
        {/* 
          定义了网站的所有页面：
          - / (首页): 显示项目幻灯片
          - /work (作品页): 显示所有项目列表
          - /project/:id (项目详情页): 显示单个项目的详细信息
          
          注意：不要修改这部分，除非你知道自己在做什么
        */}
        <AnimatePresence mode='wait'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </AnimatePresence>
      </div>
    </HashRouter>
  );
};

export default App;

/**
 * ============================================
 * 常见修改说明
 * ============================================
 * 
 * 1. 修改网站名称/Logo：
 *    找到 <Link to="/">Sinnyun</Link>
 *    将 "Sinnyun" 替换为你的名字
 * 
 * 2. 修改导航链接文字：
 *    - Work链接：找到 <Link to="/work">Work</Link>
 *    - About按钮：找到 <span>About</span>
 *    替换其中的文字即可
 * 
 * 3. 修改背景颜色：
 *    找到 className="bg-stone-950..."
 *    将 bg-stone-950 替换为其他颜色类：
 *    - bg-black (纯黑)
 *    - bg-slate-900 (深蓝灰)
 *    - bg-zinc-900 (深灰)
 * 
 * 4. 修改文字颜色：
 *    找到 text-stone-50
 *    替换为其他颜色类：
 *    - text-white (纯白)
 *    - text-gray-100 (浅灰)
 *    - text-stone-100 (米白)
 * 
 * 注意：
 * - 不要修改 className 中的其他部分
 * - 保持引号和空格不变
 * - 修改后刷新浏览器查看效果
 */
