
export enum AudienceType {
  CHILD = 'CHILD',
  TEEN = 'TEEN',
  ADULT = 'ADULT'
}

export enum ReadingPlanType {
  CANONICAL = 'CANONICAL',
  COMBINED = 'COMBINED',
  CHRONOLOGICAL = 'CHRONOLOGICAL',
  REDEMPTIVE = 'REDEMPTIVE'
}

export interface GenerationRequest {
  text: string;
  audience: AudienceType;
}

export interface GenerationResponse {
  content: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  audience: AudienceType;
  response: string;
  timestamp: number;
}

export interface OfflineItem {
  id: string;
  title: string;
  content: string;
  type: 'bible' | 'devotional' | 'explanation';
  timestamp: number;
  preview: string;
}

export type InputMode = 'free' | 'bible' | 'search' | 'study' | 'thematic' | 'devotional' | 'offline';
