"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, User, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  participants: Array<{
    id: string;
    name: string;
    isHost: boolean;
    videoEnabled: boolean;
    audioEnabled: boolean;
  }>;
  currentUserId: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  className?: string;
}

interface VideoTileProps {
  stream?: MediaStream;
  name: string;
  isHost: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  isLocal: boolean;
  className?: string;
}

const VideoTile: React.FC<VideoTileProps> = ({
  stream,
  name,
  isHost,
  videoEnabled,
  audioEnabled,
  isLocal,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(error => {
        console.error('Error playing video:', error);
        setIsVideoPlaying(false);
      });
    }
  }, [stream]);

  return (
    <Card className={cn(
      "relative bg-slate-900 border-slate-700 overflow-hidden",
      className
    )}>
      <CardContent className="p-0 aspect-video">
        {/* Video element */}
        {stream && videoEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <User className="h-16 w-16 text-slate-600" />
          </div>
        )}

        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">{name}</span>
              {isHost && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/20 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Host
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!videoEnabled && (
                <Badge variant="destructive" className="text-xs">
                  <VideoOff className="h-3 w-3 mr-1" />
                  Video Off
                </Badge>
              )}
              {!audioEnabled && (
                <Badge variant="destructive" className="text-xs">
                  <MicOff className="h-3 w-3 mr-1" />
                  Muted
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Connection status indicator */}
        <div className="absolute top-2 right-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            stream ? "bg-green-500" : "bg-red-500"
          )} />
        </div>
      </CardContent>
    </Card>
  );
};

export const VideoGrid: React.FC<VideoGridProps> = ({
  localStream,
  remoteStreams,
  participants,
  currentUserId,
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  className
}) => {
  // Create participant map with stream info
  const participantStreams = new Map<string, MediaStream>();
  
  // Add local stream
  if (localStream) {
    participantStreams.set(currentUserId, localStream);
  }
  
  // Add remote streams
  remoteStreams.forEach((stream, userId) => {
    participantStreams.set(userId, stream);
  });

  // Sort participants: host first, then others
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.isHost) return -1;
    if (b.isHost) return 1;
    return 0;
  });

  const totalParticipants = participants.length;
  
  // Determine grid layout based on participant count
  const getGridClass = () => {
    if (totalParticipants === 1) return "grid-cols-1";
    if (totalParticipants === 2) return "grid-cols-2";
    if (totalParticipants === 3) return "grid-cols-3";
    if (totalParticipants === 4) return "grid-cols-2 grid-rows-2";
    return "grid-cols-2";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Local video controls */}
      <div className="flex justify-center gap-2">
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="sm"
          onClick={onToggleVideo}
          className="flex items-center gap-2"
        >
          {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          {isVideoEnabled ? "Video On" : "Video Off"}
        </Button>
        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="sm"
          onClick={onToggleAudio}
          className="flex items-center gap-2"
        >
          {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          {isAudioEnabled ? "Mic On" : "Mic Off"}
        </Button>
      </div>

      {/* Video grid */}
      <div className={cn(
        "grid gap-4 max-w-6xl mx-auto",
        getGridClass()
      )}>
        {sortedParticipants.map((participant) => (
          <VideoTile
            key={participant.id}
            stream={participantStreams.get(participant.id)}
            name={participant.name}
            isHost={participant.isHost}
            videoEnabled={participant.videoEnabled}
            audioEnabled={participant.audioEnabled}
            isLocal={participant.id === currentUserId}
            className={totalParticipants === 1 ? "max-w-2xl mx-auto" : ""}
          />
        ))}
      </div>

      {/* Empty slots for room capacity */}
      {totalParticipants < 4 && (
        <div className="grid gap-4 max-w-6xl mx-auto">
          {Array.from({ length: 4 - totalParticipants }).map((_, index) => (
            <Card key={`empty-${index}`} className="bg-slate-800/50 border-slate-700 border-dashed">
              <CardContent className="p-8 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <User className="h-12 w-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Empty Slot</p>
                  <p className="text-slate-600 text-xs">Waiting for participant...</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
