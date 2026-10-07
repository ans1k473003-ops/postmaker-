export type PlatformType = 'instagram' | 'tiktok' | 'facebook' | 'telegram' | 'youtube';

export type StyleType = 'professional' | 'friendly' | 'selling' | 'engaging' | 'humorous' | 'expert';

export type LengthType = 'short' | 'medium' | 'long';

export type GoalType = 'ads' | 'sales' | 'informative' | 'entertainment' | 'personal_blog';

export interface UploadedMedia {
  id: string;
  type: 'image' | 'video';
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  base64Data?: string; // for images
  mimeType: string;
  extractedFrames?: {
    timestamp: number;
    base64Data: string;
    mimeType: string;
    previewUrl: string;
  }[]; // for videos
}

export interface PostSettings {
  platform: PlatformType;
  style: StyleType;
  length: LengthType;
  language: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
  goal: GoalType;
}

export interface AlternativePost {
  label: string;
  fullText: string;
  toneHint: string;
}

export interface GeneratedPostData {
  id: string;
  timestamp: number;
  headline: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  fullText: string;
  mediaAnalysis?: string;
  clarificationQuestion?: string;
  alternatives: AlternativePost[];
  settings: PostSettings;
  mediaPreviews?: { type: 'image' | 'video'; url: string }[];
  descriptionPrompt?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'agency';
  generationsLeft: number;
  totalGenerations: number;
  joinedDate: string;
}
