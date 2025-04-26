type EventCallback<T = unknown> = (data: T) => void;

class EventEmitter {
  private events: { [key: string]: EventCallback<unknown>[] } = {};

  on<T>(event: string, callback: EventCallback<T>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback as EventCallback<unknown>);
  }

  emit<T>(event: string, data: T): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  removeListener(event: string, callback: EventCallback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export default class AudioService extends EventEmitter {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private isRecording: boolean = false;
  private ws: WebSocket | null = null;

  constructor(private wsUrl: string) {
    super();
  }

  private connectWebSocket(): void {
    this.ws = new WebSocket(this.wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.emit('wsConnected', null);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.emit('wsDisconnected', null);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('wsError', error);
    };
  }

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Send audio chunk through WebSocket if connected
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(event.data);
          }
          this.emit('data', event.data);
        }
      };

      // Connect WebSocket before starting recording
      this.connectWebSocket();

      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;
      this.emit('start', null);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
      this.isRecording = false;
      
      // Close WebSocket connection
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      
      this.emit('stop', null);
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  isWebSocketConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
} 