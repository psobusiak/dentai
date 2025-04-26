import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import AudioService from '../services/audioService';

interface AudioRecorderProps {
  onAudioData?: (data: Blob) => void;
  wsUrl: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onAudioData,
  wsUrl
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const audioServiceRef = useRef<AudioService | null>(null);

  useEffect(() => {
    audioServiceRef.current = new AudioService(wsUrl);

    const audioService = audioServiceRef.current;

    audioService.on('data', (data: Blob) => {
      // Send audio chunk to backend
      onAudioData?.(data);
    });

    audioService.on('wsConnected', () => {
      setIsConnected(true);
    });

    audioService.on('wsDisconnected', () => {
      setIsConnected(false);
    });

    audioService.on('wsError', (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    });

    return () => {
      if (audioService.isCurrentlyRecording()) {
        audioService.stopRecording();
      }
    };
  }, [onAudioData, wsUrl]);

  const handleStartRecording = async () => {
    try {
      await audioServiceRef.current?.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = () => {
    audioServiceRef.current?.stopRecording();
    setIsRecording(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isRecording ? (
        <button
          onClick={handleStartRecording}
          className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          title="Start Recording"
        >
          <Mic size={24} />
        </button>
      ) : (
        <button
          onClick={handleStopRecording}
          className={`p-4 rounded-full text-white transition-colors shadow-lg ${
            isConnected ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
          title={isConnected ? "Stop Recording" : "Recording (No Connection)"}
        >
          <MicOff size={24} />
        </button>
      )}
    </div>
  );
};

export default AudioRecorder; 