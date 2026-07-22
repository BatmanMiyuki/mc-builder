export interface Block {
  id: string;
  name: string;
  color: string;
}

export interface PlacedBlock {
  position: { x: number; y: number; z: number };
  blockId: string;
  step: number;
}

export interface MaterialCount {
  blockId: string;
  blockName: string;
  count: number;
  color: string;
}

export interface Structure {
  name: string;
  description: string;
  blocks: PlacedBlock[];
  totalSteps: number;
  dimensions: { width: number; height: number; depth: number };
  materials: MaterialCount[];
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type BuildCategory = 'houses' | 'castles' | 'towers' | 'farms' | 'decorations' | 'bridges' | 'statues' | 'interiors' | 'redstone' | 'medieval' | 'modern' | 'fantasy';

export interface BuildEntry {
  id: string;
  name: string;
  description: string;
  category: BuildCategory;
  difficulty: Difficulty;
  estimatedTime: string;
  emoji: string;
  tags: string[];
  structure: Structure;
}
