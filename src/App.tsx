import React from 'react';
import DentalChart from './components/DentalChart';
import ToothControls from './components/ToothControls';
import PatientInfo from './components/PatientInfo';
import { DentalProvider } from './contexts/DentalContext';
import { Bluetooth as Tooth } from 'lucide-react';

function App() {
  return (
    <DentalProvider>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <header className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Tooth className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">DentalChart Pro</h1>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-medium text-gray-600">Dr. Smith's Dental Practice</h2>
              <p className="text-sm text-gray-500">123 Main St, Anytown, USA</p>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto space-y-6">
          <DentalChart />
          <ToothControls />
          <PatientInfo />
        </main>
        
        <footer className="max-w-7xl mx-auto mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-500">
            <p>© 2025 DentalChart Pro. All rights reserved.</p>
            <p>Version 1.0.0</p>
          </div>
        </footer>
      </div>
    </DentalProvider>
  );
}

export default App;