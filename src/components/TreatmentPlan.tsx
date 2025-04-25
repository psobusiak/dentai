import React, { useState } from 'react';
import { useDental } from '../contexts/DentalContext';
import { SURFACE_DESCRIPTIONS, TREATMENT_DESCRIPTIONS, TREATMENT_PRICES } from '../utils/constants';
import { Calendar, Clock, Bell } from 'lucide-react';

interface ScheduledTreatment {
  toothId: number;
  surface: string;
  condition: string;
  scheduledDate: string;
  scheduledTime: string;
}

interface Treatment {
  toothId: number;
  surface: string;
  condition: string;
  price: number;
  description: string;
}

const TreatmentPlan: React.FC = () => {
  const { teeth } = useDental();
  const [scheduledTreatments, setScheduledTreatments] = useState<ScheduledTreatment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showScheduler, setShowScheduler] = useState<number | null>(null);

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Generate time slots (9:00 AM to 5:00 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const time = new Date(2000, 0, 1, hour, minutes);
        slots.push(time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }));
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  
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
    }).filter(Boolean) as Treatment[];
  });

  const totalCost = treatments.reduce((sum, treatment) => sum + treatment.price, 0);

  const handleSchedule = (treatment: Treatment) => {
    if (!selectedDate || !selectedTime) return;

    const newScheduledTreatment: ScheduledTreatment = {
      toothId: treatment.toothId,
      surface: treatment.surface,
      condition: treatment.condition,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime
    };

    setScheduledTreatments(prev => [...prev, newScheduledTreatment]);
    setShowScheduler(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const isScheduled = (toothId: number, surface: string) => {
    return scheduledTreatments.some(
      t => t.toothId === toothId && t.surface === surface
    );
  };

  const getScheduledDateTime = (toothId: number, surface: string) => {
    const treatment = scheduledTreatments.find(
      t => t.toothId === toothId && t.surface === surface
    );
    if (!treatment) return null;

    const appointmentDate = new Date(treatment.scheduledDate);
    const reminderDate = new Date(appointmentDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // Set reminder to day before appointment

    return {
      date: treatment.scheduledDate,
      time: treatment.scheduledTime,
      reminderDate: reminderDate.toISOString().split('T')[0]
    };
  };

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
        {treatments.map((treatment, index) => {
          const scheduled = isScheduled(treatment.toothId, treatment.surface);
          const scheduledDateTime = getScheduledDateTime(treatment.toothId, treatment.surface);
          
          return (
            <div key={`${treatment.toothId}-${treatment.surface}-${index}`} 
                 className="p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-800">
                    Tooth #{treatment.toothId} - {SURFACE_DESCRIPTIONS[treatment.surface]}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{treatment.description}</p>
                  {scheduled && scheduledDateTime && (
                    <div className="text-sm text-blue-600 mt-1 space-y-1">
                      <p className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(scheduledDateTime.date).toLocaleDateString()}
                        <Clock size={14} className="ml-2 mr-1" />
                        {scheduledDateTime.time}
                      </p>
                      <p className="flex items-center text-gray-500">
                        <Bell size={14} className="mr-1" />
                        Reminder will be sent on {new Date(scheduledDateTime.reminderDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-800 block">
                    ${treatment.price.toLocaleString()}
                  </span>
                  {!scheduled && (
                    <div className="mt-2">
                      {showScheduler === index ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-500" />
                              <input
                                type="date"
                                min={minDate}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="text-sm p-1 border rounded w-36"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-gray-500" />
                              <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="text-sm p-1 border rounded w-32"
                              >
                                <option value="">Select time</option>
                                {timeSlots.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setShowScheduler(null);
                                setSelectedDate('');
                                setSelectedTime('');
                              }}
                              className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSchedule(treatment)}
                              disabled={!selectedDate || !selectedTime}
                              className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              Schedule
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowScheduler(index)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Schedule Visit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
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