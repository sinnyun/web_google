// Work.tsx - 作品集页面组件
// 主要功能：展示项目作品的水平滚动画廊，支持分类筛选、拖拽滑动和3D倾斜效果

// 1. 导入依赖
import React, { useRef, useState, MouseEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'; // 动画库
import { Link } from 'react-router-dom'; // 路由导航
import { PROJECTS } from '../data'; // 项目数据
import { ArrowRight } from 'lucide-react'; // 箭头图标

// 2. Work 组件 - 主页面组件
const Work: React.FC = () => {
  // 2.1 滑动控制状态
  const sliderRef = useRef<HTMLDivElement>(null); // 滑动容器引用
  const [isDown, setIsDown] = useState(false); // 鼠标按下状态
  const [startX, setStartX] = useState(0); // 鼠标开始位置
  const [scrollLeft, setScrollLeft] = useState(0); // 滚动初始位置

  // 2.2 动量滑动相关引用
  const velX = useRef(0); // X轴速度
  const lastX = useRef(0); // 上次鼠标位置
  const animationFrameId = useRef<number | null>(null); // 动画帧ID
  const isDragging = useRef(false); // 拖拽状态

  // 2.3 分类筛选状态
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // 当前选中的分类
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true); // 是否是初始加载
  const [prevCategory, setPrevCategory] = useState<string>('All'); // 上一次选中的分类
  const [isScrollingToStart, setIsScrollingToStart] = useState<boolean>(false); // 是否正在滚动到起始位置

  // 2.4 分类计算逻辑 - 获取项目数量最多的前5个分类
  const allCategories = PROJECTS.map(p => p.category); // 所有项目分类
  const categoryCounts = allCategories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1; // 统计每个分类的项目数量
    return acc;
  }, {} as Record<string, number>);

  const top5Categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1]) // 按数量降序排序
    .slice(0, 5) // 取前5个
    .map(([cat]) => cat); // 只保留分类名

  const categories = ['All', ...top5Categories]; // 添加"全部"选项

  // 2.5 根据选中分类筛选项目
  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS // 如果是"全部"，显示所有项目
    : PROJECTS.filter(p => p.category === selectedCategory); // 否则只显示选中分类的项目

  // 2.6 处理分类选择 - 统一所有标签的动画行为
  const handleCategoryChange = (category: string) => {
    // 如果点击的是当前已选中的分类，不执行任何操作
    if (category === selectedCategory || isScrollingToStart) return;
    
    setPrevCategory(selectedCategory);
    
    // 所有标签切换都使用相同的动画流程
    if (sliderRef.current) {
      setIsScrollingToStart(true);
      
      // 使用动画滚动到起始位置
      animateScroll(sliderRef.current, 0);
      
      // 延迟更新分类，等待滚动动画完成
      setTimeout(() => {
        setSelectedCategory(category);
        setIsScrollingToStart(false);
      }, 650);
    }
  };

  // 2.7 鼠标按下事件处理 - 开始拖拽
  const handleMouseDown = (e: MouseEvent) => {
    if (!sliderRef.current) return;
    stopAnimation(); // 停止当前动画
    setIsDown(true);
    isDragging.current = true;
    setStartX(e.pageX - sliderRef.current.offsetLeft); // 记录初始鼠标位置
    setScrollLeft(sliderRef.current.scrollLeft); // 记录当前滚动位置
    lastX.current = e.pageX; // 记录上次位置
    velX.current = 0; // 重置速度
  };

  // 2.8 鼠标离开事件处理
  const handleMouseLeave = () => {
    if (isDown) {
      setIsDown(false);
      isDragging.current = false;
      beginMomentum(); // 开始动量滑动
    }
  };

  // 2.9 鼠标松开事件处理
  const handleMouseUp = () => {
    setIsDown(false);
    isDragging.current = false;
    beginMomentum(); // 开始动量滑动
  };

  // 2.10 鼠标移动事件处理 - 拖拽滑动
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft; // 计算相对位置
    const walk = (x - startX) * 2; // 计算滑动距离 (乘以2增加滑动速度)
    sliderRef.current.scrollLeft = scrollLeft - walk; // 设置滚动位置

    // 计算速度
    const delta = e.pageX - lastX.current;
    lastX.current = e.pageX;
    velX.current = delta; // 保存当前速度
  };

  // 2.11 动量滑动效果 - 惯性滑动
  const beginMomentum = () => {
    // 如果速度太小，停止惯性滑动并对齐到最近的元素
    if (Math.abs(velX.current) < 0.5) {
      snapToNearest();
      return;
    }

    velX.current *= 0.95; // 减速系数 (0.95 每帧减速5%)
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= velX.current * 2; // 应用速度
    }

    // 递归调用，实现连续动画
    animationFrameId.current = requestAnimationFrame(beginMomentum);
  };

  // 2.12 鼠标滚轮事件处理 - 横向滚动
  const handleWheel = (e: React.WheelEvent) => {
    if (sliderRef.current) {
      stopAnimation(); // 停止当前动画
      velX.current -= e.deltaY * 0.5; // 将垂直滚动转换为水平速度 (0.5是滚动敏感度)

      // 限制最大速度
      if (velX.current > 100) velX.current = 100;
      if (velX.current < -100) velX.current = -100;

      beginMomentum(); // 开始动量滑动
    }
  };

  // 2.13 停止动画函数
  const stopAnimation = () => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current); // 取消动画帧
      animationFrameId.current = null; // 重置ID
    }
  };

  // 2.14 对齐到最近的元素
  const snapToNearest = () => {
    if (!sliderRef.current) return;

    const container = sliderRef.current;
    const center = container.scrollLeft + container.clientWidth / 2; // 计算容器中心点

    let closestElement: HTMLElement | null = null;
    let minDistance = Infinity;

    // 查找最近的元素
    const children = Array.from(container.children);
    children.forEach((child) => {
      const htmlChild = child as HTMLElement;
      const childCenter = htmlChild.offsetLeft + htmlChild.offsetWidth / 2; // 元素中心点
      const distance = Math.abs(childCenter - center); // 计算距离

      if (distance < minDistance) {
        minDistance = distance;
        closestElement = htmlChild; // 保存最近的元素
      }
    });

    // 根据速度和位置判断应该对齐到哪个元素
    if (closestElement) {
      const index = children.indexOf(closestElement);
      const currentCenter = closestElement.offsetLeft + closestElement.offsetWidth / 2;
      let targetIndex = index; // 默认对齐到最近的元素
      
      // 根据滑动方向和速度决定目标元素
      if (velX.current > 0.01) { // 向右滑动
        // 高速滑动或有明显偏移时，对齐到前一个元素
        if ((Math.abs(velX.current) > 0.5 || center < currentCenter) && index > 0) {
          targetIndex = index - 1;
        }
      } else if (velX.current < -0.01) { // 向左滑动
        // 高速滑动或有明显偏移时，对齐到后一个元素
        if ((Math.abs(velX.current) > 0.5 || center > currentCenter) && index < children.length - 1) {
          targetIndex = index + 1;
        }
      }
      
      // 更新目标元素
      closestElement = children[targetIndex] as HTMLElement;
    }

    // 滚动到目标元素
    if (closestElement) {
      scrollToElement(closestElement as HTMLElement);
    }
  };

  // 2.15 滚动到指定元素
  const scrollToElement = (element: HTMLElement) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    // 计算目标滚动位置，使元素居中
    const targetScroll = element.offsetLeft - (container.clientWidth / 2) + (element.offsetWidth / 2);

    animateScroll(container, targetScroll); // 使用动画滚动
  };

  // 2.16 平滑滚动动画
  const animateScroll = (element: HTMLElement, target: number) => {
    const start = element.scrollLeft; // 起始位置
    const distance = target - start; // 滚动距离
    const duration = 600; // 动画持续时间 (毫秒)
    let startTime: number | null = null; // 动画开始时间

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime; // 首次调用记录开始时间
      const timeElapsed = currentTime - startTime; // 已经过的时间
      const progress = Math.min(timeElapsed / duration, 1); // 动画进度 (0-1)

      // 缓动函数 easeOutCubic: 1 - Math.pow(1 - progress, 3)
      const ease = 1 - Math.pow(1 - progress, 3);

      // 应用缓动，更新滚动位置
      element.scrollLeft = start + (distance * ease);

      // 如果动画未完成，继续下一帧
      if (timeElapsed < duration) {
        animationFrameId.current = requestAnimationFrame(animation);
      }
    };

    // 启动动画
    animationFrameId.current = requestAnimationFrame(animation);
  };

  // 3. JSX 渲染部分
  return (
    // 3.1 主容器 - 全屏深色背景，垂直弹性布局
    <motion.div
      className="relative h-screen w-full bg-stone-950 overflow-hidden flex flex-col"
      initial={{ opacity: 0 }} // 初始状态: 透明
      animate={{ opacity: 1 }} // 动画状态: 完全不透明
      exit={{ opacity: 0 }} // 退出状态: 透明
      transition={{ duration: 0.5 }} // 动画过渡时间: 0.5秒
    >
      {/* 3.2 页面头部 - 包含标题和分类筛选 */}
      <div className="relative pt-32 px-6 md:px-12 z-10 flex justify-between items-end pb-8">
        {/* 页面标题 */}
        <h2 className="text-6xl md:text-8xl font-serif opacity-10 md:opacity-20 text-stone-100 pointer-events-none">精选作品集</h2>

        {/* 3.3 分类筛选按钮组 - 右对齐 */}
        <div className="flex gap-4 pointer-events-auto mb-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${selectedCategory === category
                  ? 'bg-white text-black' // 选中状态: 白色背景黑色文字
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white' // 未选中状态: 半透明白色背景
                }`}
              whileHover={{ scale: 1.05 }} // 悬停时轻微放大
              whileTap={{ scale: 0.95 }} // 点击时轻微缩小
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 3.4 水平滚动容器 - 包含所有项目卡片 */}
      <div
        ref={sliderRef}
        className={`flex-1 overflow-x-auto overflow-y-hidden flex items-center px-6 md:px-12 gap-6 md:gap-24 no-scrollbar mb-12`}
        // 样式说明:
        // - flex-1: 占据剩余空间
        // - overflow-x-auto: 水平方向可滚动
        // - overflow-y-hidden: 垂直方向不显示滚动条
        // - px-6 md:px-12: 左右内边距，移动端较小
        // - gap-6 md:gap-24: 元素间距，移动端较小
        // - no-scrollbar: 隐藏滚动条的自定义类
        // - mt-32: 顶部边距，为标题留出空间
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        data-cursor="drag"
      >
        {/* 3.5 介绍卡片/标题卡片 - 第一个不可交互的卡片 */}
        <div className="snap-center shrink-0 w-[80vw] md:w-[15vw] h-[60vh] flex flex-col justify-center pointer-events-none select-none">
          {/* 样式说明:
          // - snap-center: 滚动时对齐到中心
          // - shrink-0: 防止在弹性布局中收缩
          // - w-[80vw] md:w-[15vw]: 响应式宽度，移动端占80%视口宽度，桌面端占15%
          // - h-[60vh]: 高度占60%视口高度
          // - pointer-events-none select-none: 禁用鼠标事件和文本选择 */}
          <h1 className="text-4xl md:text-5xl font-serif mb-6">探索 <br /> 项目</h1>
          <p className="text-stone-400 max-w-xs text-sm leading-relaxed">
            横向滑动或滚动，即可浏览精心挑选的作品合集，其中涵盖数字艺术、摄影和装置艺术。
          </p>
          <div className="mt-8 w-24 h-[1px] bg-stone-700"></div>
        </div>

        {/* 3.6 项目卡片列表 - 使用动画容器管理动画 */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={`${selectedCategory}-${project.id}`} // 包含分类在键中，确保分类切换时重新创建组件
              project={project} 
              index={index}
              isInitialLoad={isInitialLoad}
              prevCategory={prevCategory}
              selectedCategory={selectedCategory}
              isScrollingToStart={isScrollingToStart}
              shouldAnimateFromRight={isInitialLoad || prevCategory !== selectedCategory} // 新增prop，明确指示是否应该从右侧滑入
            />
          ))}
        </AnimatePresence>

        {/* 3.7 末尾占位卡片 - 为最后一个项目提供间距 */}
        <div className="snap-center shrink-0 w-[20vw]"></div>
      </div>

      {/* 3.8 底部滚动提示 - 仅在桌面端显示 */}
      <div className="absolute bottom-8 left-0 w-full px-12 hidden md:flex justify-center pointer-events-none">
        <span className="text-xs tracking-widest uppercase text-stone-600">滚动或水平拖动</span>
      </div>
    </motion.div>
  );
};

// 4. ProjectCard 组件 - 单个项目卡片
const ProjectCard: React.FC<{ 
  project: typeof PROJECTS[0]; 
  index: number; 
  isInitialLoad: boolean;
  prevCategory: string;
  selectedCategory: string;
  isScrollingToStart: boolean;
  shouldAnimateFromRight: boolean; // 新增：是否应该从右侧滑入
}> = ({ project, index, isInitialLoad, prevCategory, selectedCategory, isScrollingToStart, shouldAnimateFromRight }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false); // 追踪卡片是否被悬停
  const [isCardHovered, setIsCardHovered] = useState(false); // 追踪整个卡片是否被悬停

  // 4.1 3D 倾斜效果相关的 motion 值
  const x = useMotionValue(0); // X轴运动值
  const y = useMotionValue(0); // Y轴运动值

  // 使用 spring 动画使鼠标移动更平滑
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 }); // 刚度150，阻尼15
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // 将鼠标位置映射到旋转角度
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]); // Y轴鼠标位置映射到X轴旋转
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]); // X轴鼠标位置映射到Y轴旋转
  
  // 4.2 统一动画逻辑 - 所有分类切换都使用相同动画
  // 每次分类切换时，所有卡片都从右侧滑入
  const shouldSlideInFromRight = !isScrollingToStart && shouldAnimateFromRight;

  // 4.3 鼠标移动事件处理 - 计算3D倾斜效果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect(); // 获取元素位置信息
    const width = rect.width;
    const height = rect.height;
    // 计算鼠标相对于元素中心的偏移量
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    // 将偏移量归一化 (0-1 范围)
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  // 4.4 鼠标进入事件处理 - 设置悬停状态（整个卡片区域）
const handleMouseEnter = () => {
  setIsCardHovered(true);
  setIsHovered(true);
};

// 4.5 鼠标离开事件处理 - 重置3D效果和悬停状态（整个卡片区域）
const handleMouseLeave = () => {
  x.set(0); // 重置X轴位置
  y.set(0); // 重置Y轴位置
  setIsCardHovered(false);
  setIsHovered(false); // 取消悬停状态
};

// 4.5 渲染项目卡片
return (
  // 4.5.1 外层容器 - 管理整体动画和3D效果
  <motion.div
    ref={ref}
    className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-[60vh] md:h-[70vh] relative group perspective-1000"
    /* 样式说明:
    // - snap-center: 滚动时对齐到中心
    // - shrink-0: 防止在弹性布局中收缩
    // - w-[85vw] md:w-[60vw] lg:w-[45vw]: 响应式宽度，从移动端到桌面端宽度递减
    // - h-[60vh] md:h-[70vh]: 响应式高度，桌面端略高
    // - perspective-1000: 透视效果，增强3D感 */
    initial={shouldSlideInFromRight 
      ? { opacity: 0, x: 150, scale: 0.9 } // 从右侧滑入: 透明、右侧偏移150px且缩小
      : { opacity: 0, x: -100, scale: 0.9 } // 默认状态: 透明、左侧偏移100px且缩小
    }
    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} // 动画状态: 完全不透明、回到原位且恢复正常大小
    exit={{ opacity: 0, x: -150, scale: 0.9 }} // 退出状态: 透明、向左侧偏移150px且缩小
    transition={{ 
      duration: 0.6, // 统一的动画持续时间
      ease: [0.16, 1, 0.3, 1], // 更流畅的贝塞尔曲线
      delay: shouldSlideInFromRight ? index * 0.1 : index * 0.05 // 分类切换时延迟更长，创造波浪式效果
    }}
    layout // 启用布局动画，当元素位置变化时自动过渡
    layoutId={`project-card-${project.id}`} // 用于布局动画的唯一标识
    onMouseMove={handleMouseMove}
    onMouseEnter={handleMouseEnter}  // 鼠标进入整个卡片区域时触发
    onMouseLeave={handleMouseLeave}
    style={{
      perspective: 1000 // 3D透视效果
    }}
  >
    {/* 4.5.2 3D变换容器 - 应用旋转和3D效果 */}
    <motion.div
      style={{
        rotateX, // X轴旋转
        rotateY, // Y轴旋转
        transformStyle: "preserve-3d" // 保持3D变换
      }}
      className="w-full h-full relative"
    >
      {/* 4.5.3 项目链接 - 可点击的整个卡片区域 */}
      <Link to={`/project/${project.id}`} className="block w-full h-full relative overflow-hidden rounded-sm shadow-2xl" draggable="false">
        {/* 4.5.4 悬停时的遮罩层 */}
        <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
        
        {/* 4.5.5 项目封面图片 */}
        <motion.img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          /* 图片悬停时缓慢放大，1.5秒过渡 */
          layoutId={`cover-${project.id}`} // 用于页面切换时的共享元素动画
          draggable="false" // 禁止拖拽图片
          style={{ translateZ: "0px" }} // 设置Z轴位置
          transition={{ 
            duration: 0.4, // 与卡片保持一致的过渡时间
            ease: [0.25, 0.46, 0.45, 0.94] // 与卡片保持一致的缓动函数
          }}
        />

        {/* 4.5.6 项目信息底部面板 - 根据卡片悬停状态显示 */}
        <motion.div
          className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent z-20"
          style={{ transform: "translateZ(50px)" }}
          initial={{ y: 16, opacity: 0 }} // 初始状态: 向下偏移16px且透明
          animate={isCardHovered ? { y: 0, opacity: 1 } : { y: 16, opacity: 0 }} // 根据 isCardHovered 状态控制显示/隐藏
          transition={{
            duration: 0.3, // 更快的过渡响应鼠标悬停
            ease: [0.25, 0.46, 0.45, 0.94] // 与卡片保持一致的缓动函数
          }}
        >
          {/*  样式说明:
          // - bg-gradient-to-t from-black/90 to-transparent: 从底部半透明黑色渐变到透明
          // - transform: "translateZ(50px)": 在3D空间中向前移动50px，增强层次感 */ }
          
          {/* 4.5.7 项目标题和分类 - 左侧 */}
          <div className="flex justify-between items-end border-b border-white/20 pb-4">
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-stone-300 block mb-2">{project.category}</span>
              <h3 className="text-3xl md:text-4xl font-serif">{project.title}</h3>
            </div>
            {/* 4.5.8 查看详情按钮 - 右侧圆形按钮 */}
            <div className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform">
              <ArrowRight size={20} />
            </div>
          </div>
          {/* 4.5.9 项目标签 - 显示最多2个标签 */}
          <div className="pt-4 flex gap-3">
            {project.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-widest border border-white/20 px-2 py-1 rounded text-stone-400">{tag}</span>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  </motion.div>
);

}

export default Work;
