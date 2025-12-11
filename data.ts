import { Project } from './types';

/**
 * ============================================
 * 项目数据配置文件
 * ============================================
 * 
 * 这个文件包含了网站所有项目的数据信息。
 * 如果你想修改项目内容，只需要编辑下面的数据即可。
 * 
 * 主要内容：
 * 1. HOME_SHOWCASE_ORDER - 控制主页展示哪些项目
 * 2. PROJECTS - 所有项目的详细信息
 */

// ============================================
// 主页展示配置
// ============================================
/**
 * 控制主页幻灯片展示哪些项目，以及展示顺序
 * 
 * 修改方法：
 * - 数组中的数字对应下面项目的 numericId
 * - 例如 [3, 5, 9] 表示展示 numericId 为 3、5、9 的项目
 * - 调整数字顺序可以改变主页展示顺序
 * - 可以添加或删除数字来改变展示的项目数量
 */
export const HOME_SHOWCASE_ORDER = [1, 3, 9, 6, 2];

// ============================================
// 辅助函数：自动生成图片路径
// ============================================
/**
 * 这个函数会自动生成项目详情页的图片路径
 * 
 * 参数说明：
 * - projectId: 项目的英文ID（如 'neon-void'）
 * - count: 该项目有多少张详情图片
 * 
 * 图片命名规则：
 * - 封面图：/images/项目ID/cover.jpg
 * - 详情图：/images/项目ID/detail-1.jpg, detail-2.jpg, ...
 */
const getLocalImages = (projectId: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/${projectId}/detail-${i + 1}.jpg`);

// ============================================
// 所有项目数据
// ============================================
/**
 * 这里定义了网站的所有项目
 * 每个项目包含以下信息，你可以根据需要修改：
 */
export const PROJECTS: Project[] = [
  {
    // ========== 项目1：Neon Void ==========
    id: 'neon-void',              // 项目的唯一英文标识符（用于URL，不要修改）
    numericId: 1,                 // 项目的数字ID（用于主页展示配置）

    /**
     * layout: 控制项目详情页的图片布局
     * - 1 = 单列（图片占满宽度）
     * - 2 = 两列（两张图片并排）
     * - 3 = 三列（三张图片并排）
     * 
     * 例如 [1, 2, 3, 2, 1] 表示：
     * - 第1张图：单列
     * - 第2-3张图：两列并排
     * - 第4-6张图：三列并排
     * - 第7-8张图：两列并排
     * - 第9张图：单列
     */
    layout: [1, 2, 3, 2, 1, 2, 3],

    title: '霓虹虚空',           // 项目标题（显示在网站上）
    category: '视觉识别',  // 项目分类（用于筛选功能）
    year: '2024',                 // 项目年份
    location: '东京，日本',     // 项目地点

    // 项目描述（显示在项目详情页）
    description: '探索数字空间中的光与虚空。这个项目使用平面美学原理结合光线追踪照明模拟，挑战深度的感知。',

    coverImage: '/images/neon-void/cover.jpg',  // 封面图片路径
    images: getLocalImages('neon-void', 12),    // 自动生成12张详情图片路径
    tags: ['3D渲染', '动画', '概念设计'],   // 项目标签（最多显示2个）
  },

  {
    // ========== 项目2：Urban Echo ==========
    id: 'urban-echo',
    numericId: 2,
    layout: [2, 2, 2, 2, 2, 2],   // 全部使用两列布局
    title: '城市回响',
    category: '摄影',
    year: '2023',
    location: '柏林，德国',
    description: '记录野兽派建筑与有机城市生长之间的无声对话。一项关于大都市环境中对比、质感和时间流逝的研究。',
    coverImage: '/images/urban-echo/cover.jpg',
    images: getLocalImages('urban-echo', 14),
    tags: ['摄影', '建筑', '黑白'],
  },

  {
    // ========== 项目3：Organic Flow ==========
    id: 'organic-flow',
    numericId: 3,
    layout: [1, 1, 1, 1, 1, 1, 1, 1],  // 全部使用单列布局（适合展示大图）
    title: '有机流动',
    category: '用户体验设计',
    year: '2023',
    location: '哥本哈根，丹麦',
    description: '为一个可持续时尚品牌打造的全面设计系统。专注于可访问性、大地色调和模仿自然生长的流畅导航模式。',
    coverImage: '/images/organic-flow/cover.jpg',
    images: getLocalImages('organic-flow', 10),
    tags: ['界面设计', '网页设计', '品牌设计'],
  },

  {
    // ========== 项目4：Silent Noise ==========
    id: 'silent-noise',
    numericId: 4,
    layout: [3, 3, 3, 3, 3],      // 全部使用三列布局（密集画廊风格）
    title: '寂静噪音',
    category: '用户体验设计',
    year: '2022',
    location: '伦敦，英国',
    description: '一个将环境室内噪音实时转换为生成性视觉艺术模式的互动视听装置。',
    coverImage: '/images/silent-noise/cover.jpg',
    images: getLocalImages('silent-noise', 15),
    tags: ['装置艺术', '互动设计', '声音设计'],
  },

  {
    // ========== 项目5：Chromatic Abyss ==========
    id: 'chromatic-abyss',
    numericId: 5,
    layout: [1, 3, 1, 3, 1, 3],   // 单列和三列交替（节奏感布局）
    title: '色彩深渊',
    category: '视觉识别',
    year: '2024',
    location: '雷克雅未克，冰岛',
    description: '为一家深海探索科技初创公司打造的品牌识别。视觉语言模仿了海洋最深处发现的生物发光现象。',
    coverImage: '/images/chromatic-abyss/cover.jpg',
    images: getLocalImages('chromatic-abyss', 12),
    tags: ['品牌设计', '视觉识别', '科技'],
  },

  {
    // ========== 项目6：Paper Dreams ==========
    id: 'paper-dreams',
    numericId: 6,
    layout: [2, 1, 2, 1, 2, 1],   // 两列和单列交替
    title: '纸艺之梦',
    category: '编辑设计',
    year: '2023',
    location: '纽约，美国',
    description: '一本以纸雕艺术为特色的限量版艺术书籍。布局强调质感和阴影，将纸张的触感特质带到数字屏幕上。',
    coverImage: '/images/paper-dreams/cover.jpg',
    images: getLocalImages('paper-dreams', 11),
    tags: ['编辑设计', '印刷', '版式'],
  },

  {
    // ========== 项目7：Kinetic Type ==========
    id: 'kinetic-type',
    numericId: 7,
    layout: [1, 2, 3, 2, 1],      // 金字塔式布局（从单列到三列再回到单列）
    title: '动态字体',
    category: '动态图形',
    year: '2024',
    location: '首尔，韩国',
    description: '一个探索动态字体表现潜力的实验性动态图形系列。文字通过破碎、重组和舞蹈来传达超越语义的意义。',
    coverImage: '/images/kinetic-type/cover.jpg',
    images: getLocalImages('kinetic-type', 13),
    tags: ['动画', '字体设计', '特效'],
  },

  {
    // ========== 项目8：Glass House ==========
    id: 'glass-house',
    numericId: 8,
    layout: [3, 1, 3, 1, 3],      // 三列和单列交替（倒金字塔节奏）
    title: '玻璃之屋',
    category: '建筑可视化',
    year: '2023',
    location: '温哥华，加拿大',
    description: '在茂密森林中的概念玻璃房子的写实3D可视化。项目专注于反射、折射和环境融合的相互作用。',
    coverImage: '/images/glass-house/cover.jpg',
    images: getLocalImages('glass-house', 10),
    tags: ['建筑可视化', '3D', '环境'],
  },

  {
    // ========== 项目9：Analog Glitch ==========
    id: 'analog-glitch',
    numericId: 9,
    layout: [1, 1, 2, 2, 3, 3],   // 渐进式布局（从单列逐渐增加到三列）
    title: '模拟故障',
    category: '混合媒介',
    year: '2022',
    location: '巴黎，法国',
    description: '一系列经过物理处理和重新扫描的模拟照片。项目探索破坏的美感和物理媒介的纹理特征。',
    coverImage: '/images/analog-glitch/cover.jpg',
    images: getLocalImages('analog-glitch', 15),
    tags: ['摄影', '混合媒介', '模拟'],
  },
];

/**
 * ============================================
 * 如何添加新项目？
 * ============================================
 * 
 * 1. 准备图片：
 *    - 在 public/images/ 文件夹下创建新文件夹（用项目ID命名）
 *    - 放入封面图 cover.jpg
 *    - 放入详情图 detail-1.jpg, detail-2.jpg, ...
 * 
 * 2. 在上面的 PROJECTS 数组中添加新项目对象：
 *    {
 *      id: '项目英文ID',
 *      numericId: 下一个数字,
 *      layout: [1, 2, 3],  // 根据需要设计布局
 *      title: '项目标题',
 *      category: '项目分类',
 *      year: '年份',
 *      location: '地点',
 *      description: '项目描述...',
 *      coverImage: '/images/项目ID/cover.jpg',
 *      images: getLocalImages('项目ID', 图片数量),
 *      tags: ['标签1', '标签2', '标签3'],
 *    }
 * 
 * 3. 如果想在主页展示，在 HOME_SHOWCASE_ORDER 中添加项目的 numericId
 * 
 * ============================================
 * 常见修改示例
 * ============================================
 * 
 * 修改项目标题：
 *   找到对应项目，修改 title: '新标题'
 * 
 * 修改项目描述：
 *   找到对应项目，修改 description: '新描述...'
 * 
 * 修改项目分类：
 *   找到对应项目，修改 category: '新分类'
 * 
 * 修改主页展示顺序：
 *   调整 HOME_SHOWCASE_ORDER 数组中数字的顺序
 * 
 * 修改详情页布局：
 *   调整 layout 数组，使用 1（单列）、2（两列）、3（三列）组合
 */
