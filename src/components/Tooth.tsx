import React from 'react';
import { useDental } from '../contexts/DentalContext';
import ToothSurface from './ToothSurface';

interface ToothProps {
  toothId: number;
}

const Tooth: React.FC<ToothProps> = ({ toothId }) => {
  const { teeth, selectTooth, selectedTooth } = useDental();
  
  const tooth = teeth[toothId];
  const isSelected = tooth.isSelected;
  
  const isMolar = [1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32].includes(toothId);
  const isPremolar = [4, 5, 12, 13, 20, 21, 28, 29].includes(toothId);
  const isCanine = [6, 11, 22, 27].includes(toothId);
  const isIncisor = [7, 8, 9, 10, 23, 24, 25, 26].includes(toothId);
  
  const isFrontTooth = isIncisor || isCanine;
  
  const handleClick = () => {
    selectTooth(toothId);
  };
  
  return (
    <div 
      className={`relative w-12 h-12 m-0.5 rounded-md ${isSelected ? 'bg-blue-100' : 'bg-gray-50'} 
                 border ${isSelected ? 'border-blue-500' : 'border-gray-300'} 
                 cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-50`}
      onClick={handleClick}
    >
      {/* Tooth ID label */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
        {toothId}
      </div>
      
      {/* Mesial surface */}
      <ToothSurface 
        surface="mesial"
        toothId={toothId}
        position={{
          top: '25%',
          left: '0',
          width: '25%',
          height: '50%'
        }}
      />
      
      {/* Distal surface */}
      <ToothSurface 
        surface="distal"
        toothId={toothId}
        position={{
          top: '25%',
          right: '0',
          width: '25%',
          height: '50%'
        }}
      />
      
      {/* Buccal surface */}
      <ToothSurface 
        surface="buccal"
        toothId={toothId}
        position={{
          top: '0',
          left: '25%',
          width: '50%',
          height: '25%'
        }}
      />
      
      {/* Lingual surface */}
      <ToothSurface 
        surface="lingual"
        toothId={toothId}
        position={{
          bottom: '0',
          left: '25%',
          width: '50%',
          height: '25%'
        }}
      />
      
      {/* Occlusal/Incisal surface (center) */}
      <ToothSurface 
        surface={isFrontTooth ? "incisal" : "occlusal"}
        toothId={toothId}
        position={{
          top: '25%',
          left: '25%',
          width: '50%',
          height: '50%'
        }}
      />
      
      {/* For front teeth, show labial instead of buccal */}
      {isFrontTooth && (
        <ToothSurface 
          surface="labial"
          toothId={toothId}
          position={{
            top: '0',
            left: '25%',
            width: '50%',
            height: '25%'
          }}
        />
      )}
    </div>
  );
};

export default Tooth;