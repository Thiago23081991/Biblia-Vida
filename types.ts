
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

export type InputMode = 'free' | 'bible' | 'search' | 'study' | 'thematic' | 'devotional';
