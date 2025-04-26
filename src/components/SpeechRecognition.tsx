import * as React from 'react';
import { useMicVAD } from "@ricky0123/vad-react";
import { Mic, MicOff } from 'lucide-react';

interface SpeechRecognitionProps {
  onTranscriptUpdate: (transcript: string, isInterim?: boolean) => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionError {
  error: string;
}

interface WebkitSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onend: ((this: WebkitSpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: WebkitSpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: WebkitSpeechRecognition, ev: SpeechRecognitionError) => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => WebkitSpeechRecognition;
  }
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ onTranscriptUpdate }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const recognitionRef = React.useRef<WebkitSpeechRecognition | null>(null);

  const { userSpeaking } = useMicVAD({
    onSpeechEnd: () => {
      onTranscriptUpdate('\n--------Silence-------\n');
    },
  });

  const startRecognition = React.useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  }, []);

  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pl-PL';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onTranscriptUpdate(finalTranscript);
        } else if (interimTranscript) {
          onTranscriptUpdate(interimTranscript, true);
        }
      };

      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error:', event.error);
        // Restart recognition on error
        setTimeout(startRecognition, 1000);
      };

      recognition.onend = () => {
        // Restart recognition when it ends
        if (isRecording) {
          setTimeout(startRecognition, 1000);
        }
      };
    } else {
      console.error('Speech recognition not supported');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptUpdate, isRecording, startRecognition]);

  const handleStartRecording = () => {
    startRecognition();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
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
            userSpeaking ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
          }`}
          title={userSpeaking ? "Recording (Speaking)" : "Recording (Silent)"}
        >
          <MicOff size={24} />
        </button>
      )}
    </div>
  );
};

export default SpeechRecognition; 