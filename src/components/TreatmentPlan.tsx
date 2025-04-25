import React from 'react';
import { useDental } from '../contexts/DentalContext';
import { SURFACE_DESCRIPTIONS, TREATMENT_DESCRIPTIONS, TREATMENT_PRICES } from '../utils/constants';

const TreatmentPlan: React.FC = () => {
  const { teeth } = useDental();
  
  // Get all treatments needed
  const treatments = Object.entries(teeth).flatMap(([toothId, tooth]) => {
    return Object.entries(tooth.surfaces).map(([surface, condition]) => {
      if (condition === 'healthy') return null;
      
      return {
        toothId: Number(toothId),
        surface,
        condition,
        price: TREATMENT_PRICES[condition],
        description: TREATMENT_DESCRIPTIONS[condition]
      };
    }).filter(Boolean); // Remove null entries
  });

  const totalCost = treatments.reduce((sum, treatment) => sum + treatment.price, 0);

  if (treatments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Treatment Plan</h2>
        <p className="text-gray-500">No treatments planned. Select teeth conditions to see recommended procedures.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Treatment Plan</h2>
      
      <div className="space-y-4">
        {treatments.map((treatment, index) => (
          <div key={`${treatment.toothId}-${treatment.surface}-${index}`} 
               className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">
                  Tooth #{treatment.toothId} - {SURFACE_DESCRIPTIONS[treatment.surface]}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{treatment.description}</p>
              </div>
              <span className="font-medium text-gray-800">
                ${treatment.price.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">Total Estimated Cost</span>
            <span className="text-xl font-bold text-blue-600">
              ${totalCost.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * Prices are estimates and may vary based on specific conditions and requirements
          </p>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlan; 