"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Play, ArrowLeft, UserPlus, Crown, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BeautifulLoader } from "@/components/BeautifulLoader";
import { VideoGrid } from "@/components/VideoGrid";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { socketService } from "@/lib/socket";
import { toast } from "sonner";

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  joinedAt: number;
}

interface Room {
  id: string;
  hostId: string;
  hostName: string;
  year: string;
  stream: string;
  subject: string;
  participants: Participant[];
  status: "waiting" | "starting" | "active" | "finished";
  maxParticipants: number;
  createdAt: string;
}

const VideoLobbyPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [examStarted, setExamStarted] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);

  // WebRTC hook
  const {
    localStream,
    remoteStreams,
    isVideoEnabled,
    isAudioEnabled,
    startLocalVideo,
    toggleVideo,
    toggleAudio,
    cleanup
  } = useWebRTC(roomId || "", user?.id || "");

  // Anti-cheat hook
  const {
    violations: antiCheatViolations,
    activateMonitoring,
    deactivateMonitoring,
    reportViolation
  } = useAntiCheat();

  useEffect(() => {
    const initializeVideoLobby = async () => {
      if (!roomId || !user || !profile) {
        toast.error("Invalid room or user not authenticated");
        navigate("/matric");
        return;
      }

      try {
        await socketService.connect();
        
        // Join room via socket
        socketService.socket?.emit('room:join', roomId, {
          id: user.id || "temp-user",
          name: profile.name || "Student"
        });

        // Set up socket listeners
        socketService.socket?.on('room:participants', (participants: Participant[]) => {
          if (room) {
            setRoom({
              ...room,
              participants
            });
          }
        });

        socketService.socket?.on('room:countdown', (seconds: number) => {
          setTimeRemaining(seconds);
          if (room) {
            setRoom({ ...room, status: "starting" });
          }
          
          // Activate anti-cheat when countdown starts
          if (seconds === 30) {
            activateMonitoring(roomId, user.id || "temp-user");
          }
        });

        socketService.socket?.on('exam:begin', (examData: { questions: any[]; timeLimit: number }) => {
          setExamStarted(true);
          // Navigate to exam session after countdown
          setTimeout(() => {
            navigate(`/matric/session/${roomId}`);
          }, 1000);
        });

        socketService.socket?.on('video:toggled', (userId: string, enabled: boolean) => {
          if (room) {
            setRoom({
              ...room,
              participants: room.participants.map(p => 
                p.id === userId ? { ...p, videoEnabled: enabled } : p
              )
            });
          }
        });

        socketService.socket?.on('audio:toggled', (userId: string, enabled: boolean) => {
          if (room) {
            setRoom({
              ...room,
              participants: room.participants.map(p => 
                p.id === userId ? { ...p, audioEnabled: enabled } : p
              )
            });
          }
        });

        socketService.socket?.on('violation:logged', (userId: string, violation: string) => {
          if (userId === user.id) {
            setViolations(prev => [...prev, violation]);
          }
        });

        socketService.socket?.on('error', (error: string) => {
          toast.error(error);
          if (error.includes("full")) {
            navigate("/matric");
          }
        });

        // Mock room data for UI
        const mockRoom: Room = {
          id: roomId,
          hostId: "mock-host",
          hostName: "Study Host",
          year: "2014",
          stream: "Natural Science",
          subject: "Physics",
          participants: [
            {
              id: "mock-host",
              name: "Study Host",
              isHost: true,
              videoEnabled: true,
              audioEnabled: true,
              joinedAt: Date.now()
            },
            {
              id: user.id || "temp-user",
              name: profile.name || "Student",
              isHost: false,
              videoEnabled: true,
              audioEnabled: true,
              joinedAt: Date.now()
            }
          ],
          status: "waiting",
          maxParticipants: 4,
          createdAt: new Date().toISOString()
        };

        setRoom(mockRoom);
        
        // Start video
        await startLocalVideo();
        
      } catch (error) {
        console.error('Failed to initialize video lobby:', error);
        toast.error("Failed to join video lobby");
        navigate("/matric");
      } finally {
        setLoading(false);
      }
    };

    initializeVideoLobby();

    return () => {
      deactivateMonitoring();
      cleanup();
      socketService.disconnect();
    };
  }, [roomId, user, profile]);

  const startSession = () => {
    if (!room || room.participants.length < 2) {
      toast.error("Need at least 2 participants to start");
      return;
    }

    if (room.hostId !== user?.id) {
      toast.error("Only the host can start the session");
      return;
    }

    // Check if all participants have video enabled
    const participantsWithoutVideo = room.participants.filter(p => !p.videoEnabled);
    if (participantsWithoutVideo.length > 0) {
      toast.error("All participants must enable video to start");
      return;
    }

    // Start session via socket
    socketService.socket?.emit('room:start', roomId);
  };

  const leaveRoom = () => {
    cleanup();
    navigate("/matric");
  };

  const copyRoomLink = () => {
    if (room) {
      navigator.clipboard.writeText(`${window.location.origin}/room/${room.id}`);
      toast.success("Room link copied!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950">
        <BeautifulLoader size="lg" text="Joining video lobby..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <div className="text-white text-xl">Room not found</div>
            <Button onClick={() => navigate("/matric")} className="mt-4">
              Back to Matric
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isHost = room.hostId === user?.id;
  const canStart = room.participants.length >= 2 && isHost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={leaveRoom}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Leave Room
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/70">
              <Users className="h-4 w-4" />
              {room.participants.length}/{room.maxParticipants}
            </div>
            <Badge 
              className={
                room.status === "waiting" ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/20" :
                room.status === "starting" ? "bg-blue-500/20 text-blue-200 border-blue-400/20" :
                "bg-green-500/20 text-green-200 border-green-400/20"
              }
            >
              {room.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={copyRoomLink}
              className="text-white/70 border-white/20 hover:text-white"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>
        </div>

        {/* Room Info */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">Video Study Room</CardTitle>
                <CardDescription className="text-white/70">
                  {room.year} E.C. - {room.stream} - {room.subject}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-white text-sm mb-1">Room Code</div>
                <div className="text-white/70 font-mono text-lg">{room.id}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Countdown */}
        {room.status === "starting" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <Card className="bg-blue-500/10 backdrop-blur-lg border-blue-400/20">
              <CardContent className="py-8">
                <div className="text-6xl font-bold text-white mb-4">
                  {timeRemaining}
                </div>
                <div className="text-xl text-blue-200">
                  Exam starting in...
                </div>
                <div className="text-white/60 text-sm mt-2">
                  Please keep your camera on and stay focused
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Video Grid */}
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
          participants={room.participants}
          currentUserId={user?.id || ""}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
          className="mb-6"
        />

        {/* Controls */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Session Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-white/70 text-sm">
                  {room.participants.length >= 2 ? (
                    <span className="text-green-400">Ready to start</span>
                  ) : (
                    <span>Need {2 - room.participants.length} more participant(s)</span>
                  )}
                </div>
                {violations.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {violations.length} violation(s)
                  </Badge>
                )}
              </div>
              
              {isHost && (
                <Button
                  onClick={startSession}
                  disabled={!canStart}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Session
                </Button>
              )}
            </div>
            
            {/* Violations */}
            {violations.length > 0 && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-red-200 text-sm font-medium mb-2">Violations:</div>
                <div className="space-y-1">
                  {violations.map((violation, index) => (
                    <div key={index} className="text-red-300 text-xs">
                      {violation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoLobbyPage;
