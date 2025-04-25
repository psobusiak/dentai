import React, { useState } from 'react';
import { useDental } from '../contexts/DentalContext';
import { Clipboard, FileText, Printer, Save } from 'lucide-react';

const PatientInfo: React.FC = () => {
  const { patient } = useDental();
  const [notes, setNotes] = useState<string>('');
  const [notesHistory, setNotesHistory] = useState<{date: string, note: string}[]>([
    { date: '2023-10-10', note: 'Initial examination. Patient reports sensitivity on upper right molar.' },
    { date: '2023-09-15', note: 'Cleaned teeth and applied fluoride treatment.' }
  ]);
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const handleAddNote = () => {
    if (notes.trim()) {
      const today = new Date().toISOString().split('T')[0];
      setNotesHistory([{ date: today, note: notes }, ...notesHistory]);
      setNotes('');
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Patient Information</h2>
        
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <Save size={18} />
          </button>
          <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <Printer size={18} />
          </button>
          <button className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <FileText size={18} />
          </button>
        </div>
      </div>
      
      {patient ? (
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500">Patient Name</p>
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Patient ID</p>
              <p className="font-medium">{patient.id}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Visit</p>
            <p className="font-medium">{formatDate(patient.lastVisit)}</p>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-gray-500">No patient selected</p>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-600 mb-2">Treatment Notes</h3>
        <div className="flex space-x-2">
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add new treatment notes..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={handleAddNote}
            disabled={!notes.trim()}
            className={`px-4 py-2 rounded-md ${
              notes.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors self-end`}
          >
            Add Note
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium text-gray-600 mb-2">Previous Notes</h3>
        <div className="max-h-40 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-md">
          {notesHistory.map((item, index) => (
            <div key={index} className="p-2 bg-white rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">{formatDate(item.date)}</p>
                <button className="text-gray-400 hover:text-gray-600">
                  <Clipboard size={14} />
                </button>
              </div>
              <p className="text-sm text-gray-700">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;