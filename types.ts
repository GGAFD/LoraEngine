
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export type GenerationStatus = 'pending' | 'generating' | 'success' | 'error';

export interface GenerationSlot {
  id: string;
  status: GenerationStatus;
  image?: GeneratedImage;
  prompt: string;
  error?: string;
}

export interface HistoryItem {
  id:string;
  type: 'base' | 'variation' | 'edit';
  timestamp: number;
  resultImage: GeneratedImage;
  sourceImages: { data: string; mimeType: string }[];
  age?: number;
  editPrompt?: string;
}
