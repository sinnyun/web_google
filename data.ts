import { Project } from './types';

// Configuration for Homepage Slider
// Define the numeric IDs of projects to show on the homepage in the desired order.
export const HOME_SHOWCASE_ORDER = [3, 5, 9, 6, 1];

// Helper to generate local image paths
const getLocalImages = (projectId: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/${projectId}/detail-${i + 1}.jpg`);

export const PROJECTS: Project[] = [
  {
    id: 'neon-void',
    numericId: 1,
    layout: [1, 2, 3, 2, 1, 2, 3], // Varied mix
    title: 'Neon Void',
    category: 'Visual Identity',
    year: '2024',
    location: 'Tokyo, Japan',
    description: 'An exploration of light and absence in digital spaces. This project challenges the perception of depth using flat aesthetic principles combined with ray-traced lighting simulations.',
    coverImage: '/images/neon-void/cover.jpg',
    images: getLocalImages('neon-void', 12),
    tags: ['3D Render', 'Motion', 'Concept'],
  },
  {
    id: 'urban-echo',
    numericId: 2,
    layout: [2, 2, 2, 2, 2, 2], // Grid focus
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
    id: 'organic-flow',
    numericId: 3,
    layout: [1, 1, 1, 1, 1, 1, 1, 1], // Single column scroll
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
    id: 'silent-noise',
    numericId: 4,
    layout: [3, 3, 3, 3, 3], // Dense gallery
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
    id: 'chromatic-abyss',
    numericId: 5,
    layout: [1, 3, 1, 3, 1, 3], // Rhythmic
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
    id: 'paper-dreams',
    numericId: 6,
    layout: [2, 1, 2, 1, 2, 1], // Alternating
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
    id: 'kinetic-type',
    numericId: 7,
    layout: [1, 2, 3, 2, 1], // Pyramid
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
    id: 'glass-house',
    numericId: 8,
    layout: [3, 1, 3, 1, 3], // Inverted Rhythmic
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
    id: 'analog-glitch',
    numericId: 9,
    layout: [1, 1, 2, 2, 3, 3], // Progressive
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
