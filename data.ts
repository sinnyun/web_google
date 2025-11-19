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
export const HOME_SHOWCASE_ORDER = [3, 5, 9, 6, 1];

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

    title: 'Neon Void',           // 项目标题（显示在网站上）
    category: 'Visual Identity',  // 项目分类（用于筛选功能）
    year: '2024',                 // 项目年份
    location: 'Tokyo, Japan',     // 项目地点

    // 项目描述（显示在项目详情页）
    description: 'An exploration of light and absence in digital spaces. This project challenges the perception of depth using flat aesthetic principles combined with ray-traced lighting simulations.',

    coverImage: '/images/neon-void/cover.jpg',  // 封面图片路径
    images: getLocalImages('neon-void', 12),    // 自动生成12张详情图片路径
    tags: ['3D Render', 'Motion', 'Concept'],   // 项目标签（最多显示2个）
  },

  {
    // ========== 项目2：Urban Echo ==========
    id: 'urban-echo',
    numericId: 2,
    layout: [2, 2, 2, 2, 2, 2],   // 全部使用两列布局
    title: 'Urban Echo',
    category: 'Photography',
    year: '2023',
    location: 'Berlin, Germany',
    description: 'Documenting the silent conversations between brutalist architecture and organic city growth. A study in contrast, texture, and the passage of time in metropolitan environments.',
    coverImage: '/images/urban-echo/cover.jpg',
    images: getLocalImages('urban-echo', 14),
    tags: ['Photography', 'Architecture', 'B&W'],
  },

  {
    // ========== 项目3：Organic Flow ==========
    id: 'organic-flow',
    numericId: 3,
    layout: [1, 1, 1, 1, 1, 1, 1, 1],  // 全部使用单列布局（适合展示大图）
    title: 'Organic Flow',
    category: 'UX/UI Design',
    year: '2023',
    location: 'Copenhagen, Denmark',
    description: 'A comprehensive design system for a sustainable fashion brand. Focusing on accessibility, earth tones, and fluid navigation patterns that mimic natural growth.',
    coverImage: '/images/organic-flow/cover.jpg',
    images: getLocalImages('organic-flow', 10),
    tags: ['UI/UX', 'Web Design', 'Branding'],
  },

  {
    // ========== 项目4：Silent Noise ==========
    id: 'silent-noise',
    numericId: 4,
    layout: [3, 3, 3, 3, 3],      // 全部使用三列布局（密集画廊风格）
    title: 'Silent Noise',
    category: 'UX/UI Design',
    year: '2022',
    location: 'London, UK',
    description: 'An interactive audio-visual installation that translates ambient room noise into generative visual art patterns in real-time.',
    coverImage: '/images/silent-noise/cover.jpg',
    images: getLocalImages('silent-noise', 15),
    tags: ['Installation', 'Interactive', 'Sound Design'],
  },

  {
    // ========== 项目5：Chromatic Abyss ==========
    id: 'chromatic-abyss',
    numericId: 5,
    layout: [1, 3, 1, 3, 1, 3],   // 单列和三列交替（节奏感布局）
    title: 'Chromatic Abyss',
    category: 'Visual Identity',
    year: '2024',
    location: 'Reykjavik, Iceland',
    description: 'A brand identity for a deep-sea exploration tech startup. The visual language mimics the bioluminescence found in the deepest parts of the ocean.',
    coverImage: '/images/chromatic-abyss/cover.jpg',
    images: getLocalImages('chromatic-abyss', 12),
    tags: ['Branding', 'Visual Identity', 'Tech'],
  },

  {
    // ========== 项目6：Paper Dreams ==========
    id: 'paper-dreams',
    numericId: 6,
    layout: [2, 1, 2, 1, 2, 1],   // 两列和单列交替
    title: 'Paper Dreams',
    category: 'Editorial Design',
    year: '2023',
    location: 'New York, USA',
    description: 'A limited edition art book featuring papercraft sculptures. The layout emphasizes texture and shadow, bringing the tactile nature of paper to the digital screen.',
    coverImage: '/images/paper-dreams/cover.jpg',
    images: getLocalImages('paper-dreams', 11),
    tags: ['Editorial', 'Print', 'Layout'],
  },

  {
    // ========== 项目7：Kinetic Type ==========
    id: 'kinetic-type',
    numericId: 7,
    layout: [1, 2, 3, 2, 1],      // 金字塔式布局（从单列到三列再回到单列）
    title: 'Kinetic Type',
    category: 'Motion Graphics',
    year: '2024',
    location: 'Seoul, South Korea',
    description: 'An experimental motion graphics series exploring the expressive potential of kinetic typography. Words break, reform, and dance to convey meaning beyond semantics.',
    coverImage: '/images/kinetic-type/cover.jpg',
    images: getLocalImages('kinetic-type', 13),
    tags: ['Motion', 'Typography', 'After Effects'],
  },

  {
    // ========== 项目8：Glass House ==========
    id: 'glass-house',
    numericId: 8,
    layout: [3, 1, 3, 1, 3],      // 三列和单列交替（倒金字塔节奏）
    title: 'Glass House',
    category: 'Architectural Viz',
    year: '2023',
    location: 'Vancouver, Canada',
    description: 'Photorealistic 3D visualization of a conceptual glass house in a dense forest. The project focuses on the interplay of reflection, refraction, and environmental integration.',
    coverImage: '/images/glass-house/cover.jpg',
    images: getLocalImages('glass-house', 10),
    tags: ['ArchViz', '3D', 'Environment'],
  },

  {
    // ========== 项目9：Analog Glitch ==========
    id: 'analog-glitch',
    numericId: 9,
    layout: [1, 1, 2, 2, 3, 3],   // 渐进式布局（从单列逐渐增加到三列）
    title: 'Analog Glitch',
    category: 'Mixed Media',
    year: '2022',
    location: 'Paris, France',
    description: 'A series of analog photographs physically manipulated and re-scanned. The project explores the beauty of destruction and the artifacts of the physical medium.',
    coverImage: '/images/analog-glitch/cover.jpg',
    images: getLocalImages('analog-glitch', 15),
    tags: ['Photography', 'Mixed Media', 'Analog'],
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
