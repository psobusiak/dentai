import React from 'react';
import Tooth from './Tooth';

const DentalChart: React.FC = () => {
  const upperRight = [1, 2, 3, 4, 5, 6, 7, 8];
  const upperLeft = [9, 10, 11, 12, 13, 14, 15, 16];
  const lowerLeft = [17, 18, 19, 20, 21, 22, 23, 24];
  const lowerRight = [25, 26, 27, 28, 29, 30, 31, 32];

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Patient Dental Chart</h2>
      
      {/* Upper teeth section */}
      <div className="flex justify-center mb-2">
        <div className="text-sm font-medium text-gray-500">Upper</div>
      </div>
      
      {/* Upper teeth row */}
      <div className="flex justify-center mb-4 border-b-2 border-yellow-400 pb-4">
        <div className="flex">
          {upperRight.map(toothId => (
            <Tooth key={toothId} toothId={toothId} />
          ))}
        </div>
        <div className="mx-1 w-0.5 bg-yellow-400"></div>
        <div className="flex">
          {upperLeft.map(toothId => (
            <Tooth key={toothId} toothId={toothId} />
          ))}
        </div>
      </div>
      
      {/* Left/Right labels */}
      <div className="flex justify-between px-6 mb-4">
        <div className="text-sm font-medium text-gray-500">Right</div>
        <div className="text-sm font-medium text-gray-500">Left</div>
      </div>
      
      {/* Lower teeth row */}
      <div className="flex justify-center mb-4 border-t-2 border-yellow-400 pt-4">
        <div className="flex">
          {lowerRight.reverse().map(toothId => (
            <Tooth key={toothId} toothId={toothId} />
          ))}
        </div>
        <div className="mx-1 w-0.5 bg-yellow-400"></div>
        <div className="flex">
          {lowerLeft.reverse().map(toothId => (
            <Tooth key={toothId} toothId={toothId} />
          ))}
        </div>
      </div>
      
      {/* Lower label */}
      <div className="flex justify-center mt-2">
        <div className="text-sm font-medium text-gray-500">Lower</div>
      </div>
    </div>
  );
};

export default DentalChart;