// Tooth surface types
export type ToothSurface = 'mesial' | 'distal' | 'buccal' | 'lingual' | 'occlusal' | 'incisal' | 'labial' | 'full';

// Condition types that can be marked on teeth
export type DentalCondition = 'decay' | 'filling' | 'crown' | 'root-canal' | 'missing' | 'bridge' | 'implant' | 'healthy';

// Represents colors for different conditions
export interface ConditionColors {
  [key: string]: string;
}

// Structure for a tooth in the dental chart
export interface Tooth {
  id: number;
  quadrant: 1 | 2 | 3 | 4; // 1: upper right, 2: upper left, 3: lower left, 4: lower right
  surfaces: {
    [key in ToothSurface]?: DentalCondition;
  };
  isSelected: boolean;
}

// Patient information
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  lastVisit: string;
}