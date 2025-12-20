import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { PROJECTS } from '../data';

const ProjectDetail: React.FC = () => {
  // 获取路由参数和导航对象
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 状态管理：当前活动图片索引和缩略图显示状态
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  
  // 引用：用于直接操作DOM元素
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 根据ID查找当前项目和其在数组中的索引
  const projectIndex = PROJECTS.findIndex(p => p.id === id);
  const project = PROJECTS[projectIndex];

  // 处理项目未找到的情况：重定向到作品列表页
  useEffect(() => {
    if (!project) {
      navigate('/work');
    }
  }, [project, navigate]);

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 使用Intersection Observer跟踪当前可见的图片
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // 为每张图片创建观察器，当图片进入视口时更新当前活动图片索引
    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveImageIndex(index);
            }
          },
          { threshold: 0.5 } // 当50%可见时触发
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    // 清理函数：断开所有观察器
    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, [project]);

  // 仅当第二张图片可见时显示缩略图导航
  useEffect(() => {
    // 确保至少有2张图片，否则回退到第0张
    const targetIndex = project?.images.length > 1 ? 1 : 0;
    const targetImage = imageRefs.current[targetIndex];

    if (!targetImage) return;

    // 观察第二张图片，当它进入视口或在视口上方时显示缩略图导航
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当第二张图片顶部通过视口底部(isIntersecting)或在视口上方时显示缩略图
        setShowThumbnails(entry.isIntersecting || entry.boundingClientRect.top < 0);
      },
      { threshold: 0.1 } // 当10%可见时触发
    );

    observer.observe(targetImage);
    return () => observer.disconnect();
  }, [project]);

  // 自动滚动缩略图以保持当前活动缩略图居中，使用丝滑动画
  useEffect(() => {
    if (thumbnailContainerRef.current && thumbnailRefs.current[activeImageIndex]) {
      const container = thumbnailContainerRef.current;
      const thumbnail = thumbnailRefs.current[activeImageIndex];

      if (thumbnail) {
        // 计算容器中心和缩略图中心的位置
        const containerCenter = container.offsetHeight / 2;
        const thumbnailCenter = thumbnail.offsetTop + thumbnail.offsetHeight / 2;
        const scrollPos = thumbnailCenter - containerCenter;

        // 使用Framer Motion的animate函数实现自定义缓动
        const controls = animate(container.scrollTop, scrollPos, {
          type: "tween",
          ease: [0.25, 0.46, 0.45, 0.94], // 自定义贝塞尔曲线，实现丝滑感
          duration: 0.8,
          onUpdate: (v) => container.scrollTop = v
        });

        return () => controls.stop();
      }
    }
  }, [activeImageIndex]);

  // 如果项目不存在，返回null
  if (!project) return null;

  // 计算上一个和下一个项目（循环导航）
  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(projectIndex - 1 + PROJECTS.length) % PROJECTS.length];

  // 滚动到指定图片
  const scrollToImage = (index: number) => {
    const target = imageRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 滚动到页面底部
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // 滚动到页面顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 根据布局配置渲染图片网格
  const renderImageGrid = () => {
    const layout = project.layout || [1]; // 如果没有布局配置，默认为单列
    let currentImageIndex = 0;
    const gridElements = [];

    // 遍历布局配置
    for (let i = 0; i < layout.length; i++) {
      if (currentImageIndex >= project.images.length) break;

      const colCount = layout[i]; // 当前行列数
      const rowImages = project.images.slice(currentImageIndex, currentImageIndex + colCount);
      const startIndex = currentImageIndex;

      // 根据列数确定网格CSS类
      let gridClass = "grid-cols-1";
      if (colCount === 2) gridClass = "grid-cols-1 md:grid-cols-2";
      if (colCount === 3) gridClass = "grid-cols-1 md:grid-cols-3";

      // 创建网格行
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

      currentImageIndex += colCount; // 更新当前图片索引
    }

    // 如果有未被布局覆盖的剩余图片，则渲染为单列
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
      {/* 全屏英雄区域 */}
      <div className="relative w-full h-[80vh] md:h-screen">
        <motion.div
          className="absolute inset-0"
          layoutId={`cover-${project.id}`}
        >
          {/* 渐变遮罩，使文字更清晰可见 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-950 z-10" />
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* 项目标题和描述区域 */}
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 lg:p-24">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              <div>
                {/* 项目标题 */}
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif leading-none mb-4">{project.title}</h1>
                {/* 项目分类和年份 */}
                <div className="flex gap-6 text-sm md:text-base tracking-widest text-stone-400">
                  <span>{project.category}</span>
                  <span>—</span>
                  <span>{project.year}</span>
                </div>
              </div>
              {/* 项目描述 */}
              <div className="max-w-md text-stone-300 leading-relaxed">
                <p>{project.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 项目信息网格 */}
      <div className="px-6 md:px-12 lg:px-24 py-16 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">角色</h3>
            <p className="text-lg">主设计师</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">工具</h3>
            <p className="text-lg">Blender, React, Figma</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">客户</h3>
            <p className="text-lg">内部项目</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">标签</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => <span key={tag} className="text-sm opacity-70">#{tag}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex">
        {/* 图片画廊 */}
        <div className="w-full px-4 md:px-12 lg:px-24 py-24 space-y-4 md:space-y-8">
          {renderImageGrid()}
        </div>

        {/* 右侧缩略图导航 */}
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
                {/* 滚动到顶部按钮 */}
                <div className="mb-4 flex justify-center border-b border-white/10 pb-3">
                  <button
                    onClick={scrollToTop}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors group"
                    title="滚动到顶部"
                  >
                    <ArrowUp size={16} className="text-stone-400 group-hover:text-white transition-colors" />
                  </button>
                </div>

                {/* 缩略图容器 */}
                <div
                  ref={thumbnailContainerRef}
                  className="flex flex-col gap-3 overflow-y-auto no-scrollbar scroll-smooth py-2 px-1 transition-all duration-500"
                  style={{ maxHeight: 'calc(7 * 3rem + 6 * 0.75rem + 1rem)' }} // 7个项目 * (高度 + 间距) + 内边距
                >
                  {project.images.map((img, index) => (
                    <button
                      key={index}
                      ref={el => thumbnailRefs.current[index] = el}
                      onClick={() => scrollToImage(index)}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden transition-all duration-300 ${activeImageIndex === index
                          ? 'ring-2 ring-white scale-110 opacity-100' // 活动缩略图样式
                          : 'opacity-40 hover:opacity-80 hover:scale-105' // 非活动缩略图样式
                        }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumb ${index}`} />
                    </button>
                  ))}
                </div>

                {/* 滚动到底部按钮 */}
                <div className="mt-4 flex justify-center border-t border-white/10 pt-3">
                  <button
                    onClick={scrollToBottom}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors group"
                    title="滚动到底部"
                  >
                    <ArrowDown size={16} className="text-stone-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 缩略图导航 / 下一个项目 */}
      <div className="mt-24 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[40vh] md:h-[50vh]">
          {/* 上一个项目链接 */}
          <Link to={`/project/${prevProject.id}`} className="relative group border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-stone-900 group-hover:bg-stone-800 transition-colors" />
            <img src={prevProject.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm group-hover:blur-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
              <span className="text-xs tracking-widest uppercase mb-4 opacity-70 group-hover:translate-y-2 transition-transform">上一个</span>
              <h2 className="text-3xl md:text-5xl font-serif group-hover:-translate-y-2 transition-transform duration-300">{prevProject.title}</h2>
            </div>
          </Link>
          {/* 下一个项目链接 */}
          <Link to={`/project/${nextProject.id}`} className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-stone-900 group-hover:bg-stone-800 transition-colors" />
            <img src={nextProject.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm group-hover:blur-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
              <span className="text-xs tracking-widest uppercase mb-4 opacity-70 group-hover:translate-y-2 transition-transform">下一个</span>
              <h2 className="text-3xl md:text-5xl font-serif group-hover:-translate-y-2 transition-transform duration-300">{nextProject.title}</h2>
            </div>
          </Link>
        </div>
      </div>

    </motion.div>
  );
};

export default ProjectDetail;
