export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  coverImage: string;
  images: string[];
  tags: string[];
}

export interface NavItem {
  label: string;
  path: string;
}
