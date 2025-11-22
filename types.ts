export enum Tone {
  Standard = 'Standard',
  Casual = 'Casual',
  Professional = 'Professional',
  Academic = 'Academic',
  Creative = 'Creative',
  Empathetic = 'Empathetic'
}

export interface HumanizationConfig {
  tone: Tone;
  simplifyComplexTerms: boolean;
  improveFlow: boolean;
  targetAudience: string;
}

export interface FileData {
  name: string;
  mimeType: string;
  data: string; // Base64
  size: number;
}

export enum ProcessingStatus {
  Idle = 'idle',
  Uploading = 'uploading',
  Processing = 'processing',
  Complete = 'complete',
  Error = 'error',
}

export interface ApiError {
  message: string;
}