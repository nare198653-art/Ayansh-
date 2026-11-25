export type ImageResolution = '1K' | '2K' | '4K';

export type AgeGroup = 'toddler' | 'kids' | 'older';

export interface ColoringPage {
  id: string;
  pageNumber: number;
  title: string;
  sceneDescription: string;
  rhymeCaption: string;
  imageUrl: string;
  isGenerating?: boolean;
  error?: string;
}

export interface ColoringBook {
  id: string;
  childName: string;
  theme: string;
  ageGroup: AgeGroup;
  imageSize: ImageResolution;
  coverTitle: string;
  coverSubtitle: string;
  coverDedication: string;
  pages: ColoringPage[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
