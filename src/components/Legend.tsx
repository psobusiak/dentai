import React from 'react';
import { CONDITION_COLORS, CONDITION_DESCRIPTIONS } from '../utils/constants';

const Legend: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Condition Legend</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(CONDITION_COLORS)
          .filter(([condition]) => condition !== 'healthy') // Skip 'healthy' as it's transparent
          .map(([condition, color]) => (
            <div key={condition} className="flex items-center">
              <div
                className="w-4 h-4 mr-2 rounded-full"
                style={{
                  backgroundColor: color,
                }}
              ></div>
              <span className="text-sm text-gray-700">{CONDITION_DESCRIPTIONS[condition]}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Legend;