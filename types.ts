export interface Project {
  id: string;
  numericId: number;
  title: string;
  category: string;
  year: string;
  location: string;
  description: string;
  coverImage: string;
  images: string[];
  layout?: number[];
  tags?: string[];
}

export interface NavItem {
  label: string;
  path: string;
}
