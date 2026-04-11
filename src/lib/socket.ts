import { io, Socket } from 'socket.io-client';

export interface RoomEvents {
  'room:join': (roomId: string, user: { id: string; name: string }) => void;
  'room:leave': (roomId: string, userId: string) => void;
  'room:participants': (participants: Array<{ id: string; name: string; isHost: boolean }>) => void;
  'room:start': (roomId: string) => void;
  'room:countdown': (seconds: number) => void;
  'exam:begin': (examData: { questions: any[]; timeLimit: number }) => void;
  'exam:answer': (userId: string, questionIndex: number, answer: string) => void;
  'exam:finish': (userId: string, results: { score: number; answers: Record<number, string> }) => void;
  'exam:progress': (userId: string, questionIndex: number) => void;
}

class SocketService {
  public socket: Socket | null = null;
  private currentRoom: string | null = null;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : 'http://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
        path: '/api/socket/io'
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentRoom = null;
  }

  joinRoom(roomId: string, user: { id: string; name: string }) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    
    this.currentRoom = roomId;
    this.socket.emit('room:join', roomId, user);
  }

  leaveRoom(roomId: string) {
    if (!this.socket || !this.currentRoom) return;
    
    this.socket.emit('room:leave', roomId, this.socket.id);
    this.currentRoom = null;
  }

  startSession(roomId: string) {
    if (!this.socket) throw new Error('Socket not connected');
    this.socket.emit('room:start', roomId);
  }

  submitAnswer(questionIndex: number, answer: string) {
    if (!this.socket || !this.currentRoom) return;
    this.socket.emit('exam:answer', this.currentRoom, questionIndex, answer);
  }

  updateProgress(questionIndex: number) {
    if (!this.socket || !this.currentRoom) return;
    this.socket.emit('exam:progress', this.currentRoom, questionIndex);
  }

  finishExam(results: { score: number; answers: Record<number, string> }) {
    if (!this.socket || !this.currentRoom) return;
    this.socket.emit('exam:finish', this.currentRoom, results);
  }

  // Event listeners
  onParticipantsUpdate(callback: (participants: Array<{ id: string; name: string; isHost: boolean }>) => void) {
    this.socket?.on('room:participants', callback);
  }

  onCountdownStart(callback: (seconds: number) => void) {
    this.socket?.on('room:countdown', callback);
  }

  onExamBegin(callback: (examData: { questions: any[]; timeLimit: number }) => void) {
    this.socket?.on('exam:begin', callback);
  }

  onAnswerSubmitted(callback: (userId: string, questionIndex: number, answer: string) => void) {
    this.socket?.on('exam:answer', callback);
  }

  onExamFinished(callback: (userId: string, results: { score: number; answers: Record<number, string> }) => void) {
    this.socket?.on('exam:finish', callback);
  }

  onProgressUpdate(callback: (userId: string, questionIndex: number) => void) {
    this.socket?.on('exam:progress', callback);
  }

  // Remove event listeners
  off(event: string, callback?: Function) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();
