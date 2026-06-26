export interface MediaVariant {
  url: string;
  quality: 'Original' | 'Full HD' | 'HD' | 'Standard' | 'Low';
  resolution: string;
  format: 'mp4' | 'jpg' | 'png' | 'gif';
  sizeText?: string;
}

export interface PinterestMediaResponse {
  success: boolean;
  originalUrl: string;
  resolvedUrl: string;
  mediaType: 'image' | 'video' | 'gif';
  title: string;
  previewImage: string;
  variants: MediaVariant[];
  fallbackNotice?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  mediaType: 'image' | 'video' | 'gif';
  thumbnail: string;
  timestamp: number;
}
