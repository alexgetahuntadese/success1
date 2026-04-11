import { NextRequest } from 'next/server';
import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextRequest, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Store rooms data
    const rooms = new Map<string, {
      host: string;
      participants: Map<string, { 
        name: string; 
        isHost: boolean; 
        answers: Record<number, string>; 
        currentQuestion: number; 
        finished: boolean;
        violations: string[];
        videoEnabled: boolean;
        audioEnabled: boolean;
        joinedAt: number;
      }>;
      status: 'waiting' | 'starting' | 'active' | 'finished';
      examData?: { questions: any[]; timeLimit: number };
      startTime?: number;
      maxParticipants: number;
    }>();

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('room:join', (roomId: string, user: { id: string; name: string }) => {
        console.log(`User ${user.name} joining room ${roomId}`);
        
        if (!rooms.has(roomId)) {
          rooms.set(roomId, {
            host: user.id,
            participants: new Map(),
            status: 'waiting',
            maxParticipants: 4
          });
        }

        const room = rooms.get(roomId)!;
        
        // Check room capacity
        if (room.participants.size >= room.maxParticipants) {
          socket.emit('error', 'Room is full (max 4 participants)');
          return;
        }

        const isHost = room.host === user.id;
        
        room.participants.set(user.id, {
          name: user.name,
          isHost,
          answers: {},
          currentQuestion: 0,
          finished: false,
          violations: [],
          videoEnabled: true,
          audioEnabled: true,
          joinedAt: Date.now()
        });

        socket.join(roomId);
        
        // Notify all participants
        const participants = Array.from(room.participants.entries()).map(([id, data]) => ({
          id,
          name: data.name,
          isHost: data.isHost,
          videoEnabled: data.videoEnabled,
          audioEnabled: data.audioEnabled
        }));
        
        io.to(roomId).emit('room:participants', participants);
        
        // Notify others about new user for WebRTC
        socket.to(roomId).emit('user:joined', user.id);
      });

      socket.on('room:leave', (roomId: string, userId: string) => {
        console.log(`User ${userId} leaving room ${roomId}`);
        
        const room = rooms.get(roomId);
        if (room) {
          room.participants.delete(userId);
          
          // If host leaves, assign new host or close room
          if (room.host === userId && room.participants.size > 0) {
            room.host = Array.from(room.participants.keys())[0];
          }
          
          const participants = Array.from(room.participants.entries()).map(([id, data]) => ({
            id,
            name: data.name,
            isHost: data.isHost
          }));
          
          io.to(roomId).emit('room:participants', participants);
        }
        
        socket.leave(roomId);
      });

      socket.on('room:start', (roomId: string) => {
        console.log(`Starting session in room ${roomId}`);
        
        const room = rooms.get(roomId);
        if (!room || room.status !== 'waiting') return;
        
        // Check if at least 2 participants
        if (room.participants.size < 2) {
          socket.emit('error', 'Need at least 2 participants to start');
          return;
        }

        room.status = 'starting';
        
        // Start countdown
        let countdown = 30;
        const countdownInterval = setInterval(() => {
          countdown--;
          io.to(roomId).emit('room:countdown', countdown);
          
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            startExam(roomId);
          }
        }, 1000);
      });

      const startExam = (roomId: string) => {
        const room = rooms.get(roomId);
        if (!room) return;

        room.status = 'active';
        room.startTime = Date.now();

        // Mock exam data - in real app, fetch from database
        const examData = {
          questions: [
            {
              id: 1,
              question: "What is the speed of light in vacuum?",
              options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "298,792,458 m/s"],
              correctAnswer: "299,792,458 m/s"
            },
            {
              id: 2,
              question: "What is the chemical symbol for gold?",
              options: ["Go", "Gd", "Au", "Ag"],
              correctAnswer: "Au"
            },
            {
              id: 3,
              question: "What is the largest planet in our solar system?",
              options: ["Earth", "Mars", "Jupiter", "Saturn"],
              correctAnswer: "Jupiter"
            },
            {
              id: 4,
              question: "What is the powerhouse of the cell?",
              options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
              correctAnswer: "Mitochondria"
            },
            {
              id: 5,
              question: "What is the chemical formula for water?",
              options: ["H2O", "CO2", "O2", "H2O2"],
              correctAnswer: "H2O"
            }
          ],
          timeLimit: 1800 // 30 minutes
        };

        room.examData = examData;
        
        // Reset all participants' exam state
        room.participants.forEach((participant, userId) => {
          participant.answers = {};
          participant.currentQuestion = 0;
          participant.finished = false;
        });

        io.to(roomId).emit('exam:begin', examData);
      };

      socket.on('exam:answer', (roomId: string, questionIndex: number, answer: string) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const participant = room.participants.get(socket.id);
        if (!participant) return;

        participant.answers[questionIndex] = answer;
        
        // Broadcast answer to all participants
        io.to(roomId).emit('exam:answer', socket.id, questionIndex, answer);
      });

      socket.on('exam:progress', (roomId: string, questionIndex: number) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const participant = room.participants.get(socket.id);
        if (!participant) return;

        participant.currentQuestion = questionIndex;
        
        // Broadcast progress to all participants
        io.to(roomId).emit('exam:progress', socket.id, questionIndex);
      });

      socket.on('exam:finish', (roomId: string, results: { score: number; answers: Record<number, string> }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const participant = room.participants.get(socket.id);
        if (!participant) return;

        participant.finished = true;
        participant.answers = results.answers;
        
        // Broadcast finish to all participants
        io.to(roomId).emit('exam:finish', socket.id, results);

        // Check if all participants finished
        const allFinished = Array.from(room.participants.values()).every(p => p.finished);
        if (allFinished) {
          room.status = 'finished';
        }
      });

      // WebRTC signaling events
      socket.on('offer', (roomId: string, peerId: string, offer: RTCSessionDescriptionInit) => {
        socket.to(peerId).emit('offer', socket.id, offer);
      });

      socket.on('answer', (roomId: string, peerId: string, answer: RTCSessionDescriptionInit) => {
        socket.to(peerId).emit('answer', socket.id, answer);
      });

      socket.on('ice:candidate', (roomId: string, peerId: string, candidate: RTCIceCandidateInit) => {
        socket.to(peerId).emit('ice:candidate', socket.id, candidate);
      });

      // Video/Audio toggle events
      socket.on('video:toggle', (roomId: string, userId: string, enabled: boolean) => {
        const room = rooms.get(roomId);
        if (room) {
          const participant = room.participants.get(userId);
          if (participant) {
            participant.videoEnabled = enabled;
            io.to(roomId).emit('video:toggled', userId, enabled);
          }
        }
      });

      socket.on('audio:toggle', (roomId: string, userId: string, enabled: boolean) => {
        const room = rooms.get(roomId);
        if (room) {
          const participant = room.participants.get(userId);
          if (participant) {
            participant.audioEnabled = enabled;
            io.to(roomId).emit('audio:toggled', userId, enabled);
          }
        }
      });

      // Anti-cheat violations
      socket.on('violation', (roomId: string, userId: string, violation: string) => {
        const room = rooms.get(roomId);
        if (room) {
          const participant = room.participants.get(userId);
          if (participant) {
            participant.violations.push(`${violation} at ${new Date().toISOString()}`);
            io.to(roomId).emit('violation:logged', userId, violation);
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Remove from all rooms
        rooms.forEach((room, roomId) => {
          if (room.participants.has(socket.id)) {
            room.participants.delete(socket.id);
            
            // Notify others about user leaving for WebRTC
            socket.to(roomId).emit('user:left', socket.id);
            
            const participants = Array.from(room.participants.entries()).map(([id, data]) => ({
              id,
              name: data.name,
              isHost: data.isHost,
              videoEnabled: data.videoEnabled,
              audioEnabled: data.audioEnabled
            }));
            
            io.to(roomId).emit('room:participants', participants);
          }
        });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
