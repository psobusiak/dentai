import React from 'react';
import { ToothSurface as ToothSurfaceType } from '../types';
import { CONDITION_COLORS } from '../utils/constants';
import { useDental } from '../contexts/DentalContext';

interface ToothSurfaceProps {
  surface: ToothSurfaceType;
  toothId: number;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    width: string;
    height: string;
    transform?: string;
  };
}

const ToothSurface: React.FC<ToothSurfaceProps> = ({ surface, toothId, position }) => {
  const { teeth, selectedTooth, selectedSurface, selectSurface } = useDental();
  
  const tooth = teeth[toothId];
  const condition = tooth.surfaces[surface];
  const isSelected = selectedTooth === toothId && selectedSurface === surface;
  
  // Style for the tooth surface
  const surfaceStyle = {
    position: 'absolute',
    top: position.top,
    left: position.left,
    right: position.right,
    bottom: position.bottom,
    width: position.width,
    height: position.height,
    transform: position.transform,
    backgroundColor: condition ? CONDITION_COLORS[condition] : 'transparent',
    border: isSelected ? '2px solid #000' : '1px solid #ccc',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedTooth === toothId) {
      selectSurface(surface);
    }
  };
  
  return (
    <div 
      style={surfaceStyle}
      onClick={handleClick}
      className={`hover:opacity-80 ${isSelected ? 'z-10' : 'z-0'}`}
    />
  );
};

export default ToothSurface;