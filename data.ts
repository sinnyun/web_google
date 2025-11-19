import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'neon-void',
    title: 'Neon Void',
    category: 'Digital Art',
    year: '2024',
    description: 'An exploration of light and absence in digital spaces. This project challenges the perception of depth using flat aesthetic principles combined with ray-traced lighting simulations.',
    coverImage: 'https://picsum.photos/id/10/1920/1080',
    images: [
      'https://picsum.photos/id/11/1200/800',
      'https://picsum.photos/id/12/800/1200',
      'https://picsum.photos/id/13/1200/800',
      'https://picsum.photos/id/14/1200/800',
      'https://picsum.photos/id/15/800/1200',
    ],
    tags: ['3D Render', 'Motion', 'Concept'],
  },
  {
    id: 'urban-echo',
    title: 'Urban Echo',
    category: 'Photography',
    year: '2023',
    description: 'Documenting the silent conversations between brutalist architecture and organic city growth. A study in contrast, texture, and the passage of time in metropolitan environments.',
    coverImage: 'https://picsum.photos/id/26/1920/1080',
    images: [
      'https://picsum.photos/id/27/1200/800',
      'https://picsum.photos/id/28/800/1200',
      'https://picsum.photos/id/29/1200/800',
      'https://picsum.photos/id/30/1200/800',
    ],
    tags: ['Photography', 'Architecture', 'B&W'],
  },
  {
    id: 'organic-flow',
    title: 'Organic Flow',
    category: 'UX/UI Design',
    year: '2023',
    description: 'A comprehensive design system for a sustainable fashion brand. Focusing on accessibility, earth tones, and fluid navigation patterns that mimic natural growth.',
    coverImage: 'https://picsum.photos/id/42/1920/1080',
    images: [
      'https://picsum.photos/id/43/1200/800',
      'https://picsum.photos/id/44/800/1200',
      'https://picsum.photos/id/45/1200/800',
      'https://picsum.photos/id/46/1200/800',
    ],
    tags: ['UI/UX', 'Web Design', 'Branding'],
  },
  {
    id: 'silent-noise',
    title: 'Silent Noise',
    category: 'Installation',
    year: '2022',
    description: 'An interactive audio-visual installation that translates ambient room noise into generative visual art patterns in real-time.',
    coverImage: 'https://picsum.photos/id/56/1920/1080',
    images: [
      'https://picsum.photos/id/57/1200/800',
      'https://picsum.photos/id/58/800/1200',
      'https://picsum.photos/id/59/1200/800',
    ],
    tags: ['Installation', 'Interactive', 'Sound Design'],
  },
];
