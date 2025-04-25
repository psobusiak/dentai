import React, { createContext, useContext, useState } from 'react';
import { DentalCondition, Patient, Tooth, ToothSurface } from '../types';
import { generateInitialTeeth } from '../utils/constants';

interface DentalContextType {
  teeth: Record<number, Tooth>;
  selectedTooth: number | null;
  selectedSurface: ToothSurface | null;
  selectedCondition: DentalCondition;
  patient: Patient | null;
  selectTooth: (toothId: number) => void;
  selectSurface: (surface: ToothSurface) => void;
  selectCondition: (condition: DentalCondition) => void;
  markCondition: () => void;
  clearSelection: () => void;
  setPatient: (patient: Patient) => void;
}

const DentalContext = createContext<DentalContextType | undefined>(undefined);

export const DentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teeth, setTeeth] = useState<Record<number, Tooth>>(generateInitialTeeth());
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<ToothSurface | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<DentalCondition>('decay');
  const [patient, setPatient] = useState<Patient | null>({
    id: '12345',
    name: 'John Doe',
    dateOfBirth: '1985-06-15',
    lastVisit: '2023-10-10'
  });

  const selectTooth = (toothId: number) => {
    setSelectedTooth(toothId);
    
    // Unselect all teeth first
    const updatedTeeth = { ...teeth };
    Object.keys(updatedTeeth).forEach(key => {
      updatedTeeth[Number(key)].isSelected = false;
    });
    
    // Select the clicked tooth
    updatedTeeth[toothId].isSelected = true;
    setTeeth(updatedTeeth);
  };

  const selectSurface = (surface: ToothSurface) => {
    setSelectedSurface(surface);
  };

  const selectCondition = (condition: DentalCondition) => {
    setSelectedCondition(condition);
  };

  const markCondition = () => {
    if (selectedTooth !== null && selectedSurface !== null) {
      const updatedTeeth = { ...teeth };
      
      // Handle 'full' surface specially
      if (selectedSurface === 'full') {
        // If marking the full tooth, apply to all surfaces for simplicity
        for (const surface of ['mesial', 'distal', 'buccal', 'lingual', 'occlusal', 'incisal', 'labial'] as ToothSurface[]) {
          updatedTeeth[selectedTooth].surfaces[surface] = selectedCondition;
        }
      } else {
        // Otherwise just mark the selected surface
        updatedTeeth[selectedTooth].surfaces[selectedSurface] = selectedCondition;
      }
      
      setTeeth(updatedTeeth);
    }
  };

  const clearSelection = () => {
    setSelectedTooth(null);
    setSelectedSurface(null);
    
    // Unselect all teeth
    const updatedTeeth = { ...teeth };
    Object.keys(updatedTeeth).forEach(key => {
      updatedTeeth[Number(key)].isSelected = false;
    });
    setTeeth(updatedTeeth);
  };

  return (
    <DentalContext.Provider
      value={{
        teeth,
        selectedTooth,
        selectedSurface,
        selectedCondition,
        patient,
        selectTooth,
        selectSurface,
        selectCondition,
        markCondition,
        clearSelection,
        setPatient,
      }}
    >
      {children}
    </DentalContext.Provider>
  );
};

export const useDental = () => {
  const context = useContext(DentalContext);
  if (context === undefined) {
    throw new Error('useDental must be used within a DentalProvider');
  }
  return context;
};