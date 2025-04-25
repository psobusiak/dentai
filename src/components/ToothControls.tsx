import React from 'react';
import { useDental } from '../contexts/DentalContext';
import { CONDITION_COLORS, CONDITION_DESCRIPTIONS, DENTAL_CONDITIONS, SURFACE_DESCRIPTIONS, TOOTH_SURFACES } from '../utils/constants';

const ToothControls: React.FC = () => {
  const { 
    selectedTooth, 
    selectedSurface, 
    selectedCondition, 
    teeth,
    selectSurface, 
    selectCondition, 
    markCondition,
    clearSelection
  } = useDental();
  
  const handleSurfaceSelect = (surface: string) => {
    selectSurface(surface as any);
  };
  
  const handleConditionSelect = (condition: string) => {
    selectCondition(condition as any);
  };
  
  const handleApply = () => {
    markCondition();
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Controls</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-600 mb-2">Selected Tooth</h3>
        {selectedTooth ? (
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <span className="font-semibold">Tooth #{selectedTooth}</span>
            <p className="text-sm text-gray-600 mt-1">
              {selectedSurface ? `Surface: ${SURFACE_DESCRIPTIONS[selectedSurface]}` : 'No surface selected'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <p className="text-gray-500">No tooth selected</p>
          </div>
        )}
      </div>
      
      {selectedTooth && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-md font-medium text-gray-600 mb-2">Select Surface</h3>
              <div className="grid grid-cols-2 gap-2">
                {TOOTH_SURFACES.map(surface => (
                  <button
                    key={surface}
                    onClick={() => handleSurfaceSelect(surface)}
                    className={`p-2 rounded-md text-sm text-left transition-all 
                               ${selectedSurface === surface 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {SURFACE_DESCRIPTIONS[surface]}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-600 mb-2">Select Condition</h3>
              <div className="grid grid-cols-2 gap-2">
                {DENTAL_CONDITIONS.map(condition => (
                  <button
                    key={condition}
                    onClick={() => handleConditionSelect(condition)}
                    className={`p-2 rounded-md text-sm text-left transition-all flex items-center
                               ${selectedCondition === condition 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <div 
                      className="w-4 h-4 mr-2 rounded-full" 
                      style={{ 
                        backgroundColor: CONDITION_COLORS[condition],
                        border: condition === 'healthy' ? '1px solid #ccc' : 'none'
                      }}
                    ></div>
                    {CONDITION_DESCRIPTIONS[condition]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleApply}
              disabled={!selectedSurface}
              className={`px-4 py-2 rounded-md ${
                selectedSurface 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              Apply
            </button>
            
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ToothControls;