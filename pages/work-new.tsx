
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../data';
import { ArrowRight, Grid, List } from 'lucide-react';

// --- 全局配置部分 ---

// 定义每一行的项目序列
const ROW_SEQUENCES = {
  row1: [1, 3, 5, 2, 7, 9], // 第一行的项目ID序列，扩展以填充更宽的间隙
  row2: [2, 4, 8, 3, 1, 5], // 第二行的项目ID序列
  row3: [9, 7, 1, 6, 4, 3], // 第三行的项目ID序列
};

// 根据数字ID查找项目的辅助函数
const getProject = (numericId: number) => PROJECTS.find((p) => p.numericId === numericId);

// --- 组件部分 ---

// 项目卡片组件 - 展示单个项目的基本信息和缩略图
const ProjectCard: React.FC<{ projectId: number; className?: string }> = ({ projectId, className }) => {
  const project = getProject(projectId);
  if (!project) return null;

  return (
    <div className={`relative ${className}`}>
      <Link to={`/project/${project.id}`} className="group relative block w-full h-full">
        {/* 图片容器 */}
        <div className="relative overflow-hidden bg-stone-900 aspect-[4/3] w-[260px] md:w-[300px] lg:w-[340px] shadow-2xl transition-transform duration-300 group-hover:scale-105">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-opacity duration-700 opacity-70 group-hover:opacity-100"
          />
          {/* 叠加层 */}
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0" />
        </div>

        {/* 鼠标悬停时显示的项目信息区域 */}
        <div className="absolute bottom-0 left-0 w-full p-3 bg-black/60 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <div className="flex justify-between items-start">
            <div>
              {/* 项目标题 */}
              <h3 className="text-lg font-serif text-white leading-tight">{project.title}</h3>
              {/* 项目类别和年份 */}
              <p className="text-[10px] tracking-widest uppercase text-stone-400 mt-1">
                {project.category} — {project.year}
              </p>
            </div>
            {/* 点击进入详情的箭头按钮 */}
            <div className="bg-white text-black p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// 作品集页面主组件 - 展示所有项目的网格视图和列表视图
const WorkNew: React.FC = () => {
  // 视图模式状态控制：'visuals'为网格视图，'names'为列表视图
  const [viewMode, setViewMode] = useState<'visuals' | 'names'>('visuals');

  // 鼠标视差效果相关变量
  const mouseX = useMotionValue(0); // 鼠标X坐标
  const mouseY = useMotionValue(0); // 鼠标Y坐标

  // 使用弹簧物理效果平滑鼠标移动，创造"巨大物体"的感觉
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  // 3D变换效果 - 根据鼠标位置计算变换值
  // 根据X位置旋转Y轴（左右看）
  const rotateY = useTransform(smoothX, [0, window.innerWidth], [8, -8]);
  // 根据Y位置旋转X轴（上下看 - 较微妙的效果）
  const rotateX = useTransform(smoothY, [0, window.innerHeight], [-3, 3]);
  // 基于鼠标的X轴平移（移动视口）
  const x = useTransform(smoothX, [0, window.innerWidth], ['2%', '-2%']);
  // 基于鼠标的Y轴平移
  const y = useTransform(smoothY, [0, window.innerHeight], ['0.5%', '-0.5%']);

  // 鼠标移动事件处理函数
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // 列表视图显示的项目列表（当前显示所有项目）
  const filteredList = PROJECTS;

  return (
    <div
      className="relative w-full h-screen bg-stone-950 overflow-hidden text-stone-100 selection:bg-white/30"
      onMouseMove={handleMouseMove}
      style={{ perspective: "2000px" }} // 添加3D透视效果
    >
      {/* --- 主要内容区域 --- */}
      <AnimatePresence mode="wait">
        {viewMode === 'visuals' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 平面框架容器 - 响应鼠标移动的跟随效果 */}
            <motion.div
              key="visuals"
              className="relative flex flex-col justify-center gap-16"
              style={{ 
                rotateY, 
                rotateX, 
                x, 
                y,
                width: "120vw",
                height: "120vh",
                padding: "0 8rem"
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 第一行项目卡片 - 平面排列 */}
              <div className="flex justify-center gap-16">
                {ROW_SEQUENCES.row1.map((id, idx) => (
                  <div key={`r1-${idx}`} className="relative">
                    <ProjectCard projectId={id} />
                  </div>
                ))}
              </div>

              {/* 第二行项目卡片 - 平面排列 */}
              <div className="flex justify-center gap-16">
                {ROW_SEQUENCES.row2.map((id, idx) => (
                  <div key={`r2-${idx}`} className="relative">
                    <ProjectCard projectId={id} />
                  </div>
                ))}
              </div>

              {/* 第三行项目卡片 - 平面排列 */}
              <div className="flex justify-center gap-16">
                {ROW_SEQUENCES.row3.map((id, idx) => (
                  <div key={`r3-${idx}`} className="relative">
                    <ProjectCard projectId={id} />
                  </div>
                ))}
              </div>
            </motion.div>
            {/* 用于聚焦的暗角叠加层 */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-stone-950/80 pointer-events-none z-20" />
          </div>
        ) : (
          // 列表视图：显示所有项目的文本列表
          <motion.div
            key="names"
            className="absolute inset-0 overflow-y-auto pt-32 px-6 md:px-24 pb-32 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4">
              {filteredList.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }} // 依次出现的动画效果
                >
                  <Link
                    to={`/project/${project.id}`}
                    className="group flex items-center justify-between border-b border-white/10 hover:border-white py-6 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-8">
                      {/* 项目编号 */}
                      <span className="text-stone-600 font-mono text-sm w-8">
                        {String(project.numericId).padStart(2, '0')}
                      </span>
                      {/* 项目标题 */}
                      <h3 className="text-3xl md:text-5xl font-serif text-stone-400 group-hover:text-white transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    {/* 项目类别 */}
                    <span className="text-xs uppercase tracking-widest text-stone-500 group-hover:text-white transition-colors">
                      {project.category}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 底部控制按钮（居中） --- */}
      <div className="fixed bottom-12 left-0 w-full z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/10 shadow-2xl flex gap-1">
          {/* 网格视图切换按钮 */}
          <button
            onClick={() => setViewMode('visuals')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === 'visuals'
              ? 'bg-white text-black shadow-lg'
              : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Grid size={14} />
            <span className="hidden md:inline">Gallery</span>
          </button>
          {/* 列表视图切换按钮 */}
          <button
            onClick={() => setViewMode('names')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${viewMode === 'names'
              ? 'bg-white text-black shadow-lg'
              : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <List size={14} />
            <span className="hidden md:inline">Names</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkNew;