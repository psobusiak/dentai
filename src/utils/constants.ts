import { ConditionColors, DentalCondition, ToothSurface } from '../types';

// All possible tooth surfaces
export const TOOTH_SURFACES: ToothSurface[] = [
  'mesial', 
  'distal', 
  'buccal', 
  'lingual', 
  'occlusal', 
  'incisal', 
  'labial',
  'full'
];

// All possible dental conditions
export const DENTAL_CONDITIONS: DentalCondition[] = [
  'healthy',
  'decay',
  'filling',
  'crown',
  'root-canal',
  'missing',
  'bridge',
  'implant'
];

// Colors for different dental conditions
export const CONDITION_COLORS: ConditionColors = {
  'healthy': 'transparent',
  'decay': '#FF5C5C', // Red
  'filling': '#5C7CFF', // Blue
  'crown': '#FFD700', // Gold
  'root-canal': '#8B4513', // Brown
  'missing': '#CCCCCC', // Gray
  'bridge': '#9370DB', // Purple
  'implant': '#32CD32', // Green
};

// Initial tooth data structure to initialize the dental chart
export const generateInitialTeeth = () => {
  const teeth: { [key: number]: any } = {};
  
  // Generate teeth 1-32 (based on the universal numbering system)
  // Teeth 1-8: Upper right
  // Teeth 9-16: Upper left
  // Teeth 17-24: Lower left
  // Teeth 25-32: Lower right
  
  // Upper right (teeth 1-8)
  for (let i = 1; i <= 8; i++) {
    teeth[i] = {
      id: i,
      quadrant: 1,
      surfaces: {},
      isSelected: false
    };
  }
  
  // Upper left (teeth 9-16)
  for (let i = 9; i <= 16; i++) {
    teeth[i] = {
      id: i,
      quadrant: 2,
      surfaces: {},
      isSelected: false
    };
  }
  
  // Lower left (teeth 17-24)
  for (let i = 17; i <= 24; i++) {
    teeth[i] = {
      id: i,
      quadrant: 3,
      surfaces: {},
      isSelected: false
    };
  }
  
  // Lower right (teeth 25-32)
  for (let i = 25; i <= 32; i++) {
    teeth[i] = {
      id: i,
      quadrant: 4,
      surfaces: {},
      isSelected: false
    };
  }
  
  return teeth;
};

// Friendly names for tooth surfaces with descriptions
export const SURFACE_DESCRIPTIONS = {
  'mesial': 'Mesial - Towards Midline',
  'distal': 'Distal - Away from midline',
  'buccal': 'Buccal - Facing cheek',
  'lingual': 'Lingual - Facing tongue',
  'occlusal': 'Occlusal - Chewing surface',
  'incisal': 'Incisal - Cutting edge (front teeth only)',
  'labial': 'Labial/Facial - Facing lip (front teeth only)',
  'full': 'Full Tooth'
};

// Friendly names for conditions
export const CONDITION_DESCRIPTIONS = {
  'healthy': 'Healthy',
  'decay': 'Decay/Caries',
  'filling': 'Filling',
  'crown': 'Crown',
  'root-canal': 'Root Canal',
  'missing': 'Missing Tooth',
  'bridge': 'Bridge',
  'implant': 'Implant'
};