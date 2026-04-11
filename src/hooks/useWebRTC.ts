"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { socketService } from "@/lib/socket";

interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  peers: Map<string, PeerConnection>;
  remoteStreams: Map<string, MediaStream>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  startLocalVideo: () => Promise<MediaStream>;
  stopLocalVideo: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  createPeerConnection: (peerId: string) => RTCPeerConnection;
  handleOffer: (peerId: string, offer: RTCSessionDescriptionInit) => Promise<void>;
  handleAnswer: (peerId: string, answer: RTCSessionDescriptionInit) => Promise<void>;
  handleIceCandidate: (peerId: string, candidate: RTCIceCandidateInit) => Promise<void>;
  cleanup: () => void;
}

export const useWebRTC = (roomId: string, userId: string): UseWebRTCReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());

  // ICE servers configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  };

  // Start local video stream
  const startLocalVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to existing peer connections
      peersRef.current.forEach((peer) => {
        stream.getTracks().forEach((track) => {
          peer.connection.addTrack(track, stream);
        });
      });

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  // Stop local video stream
  const stopLocalVideo = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        // Notify peers about video state change
        socketService.socket?.emit('video:toggle', roomId, userId, videoTrack.enabled);
      }
    }
  }, [localStream, roomId, userId]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        // Notify peers about audio state change
        socketService.socket?.emit('audio:toggle', roomId, userId, audioTrack.enabled);
      }
    }
  }, [localStream, roomId, userId]);

  // Create peer connection
  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const connection = new RTCPeerConnection(iceServers);

    // Handle ICE candidates
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.socket?.emit('ice:candidate', roomId, peerId, event.candidate);
      }
    };

    // Handle remote stream
    connection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams((prev) => new Map(prev.set(peerId, remoteStream)));
      remoteStreamsRef.current.set(peerId, remoteStream);
    };

    // Add local stream tracks if available
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        connection.addTrack(track, localStream);
      });
    }

    // Store peer connection
    const peerConnection: PeerConnection = {
      peerId,
      connection
    };

    setPeers((prev) => new Map(prev.set(peerId, peerConnection)));
    peersRef.current.set(peerId, peerConnection);

    return connection;
  }, [localStream, roomId]);

  // Create and send offer
  const createOffer = useCallback(async (peerId: string) => {
    const connection = peersRef.current.get(peerId)?.connection || createPeerConnection(peerId);
    
    try {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      socketService.socket?.emit('offer', roomId, peerId, offer);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [roomId, createPeerConnection]);

  // Handle incoming offer
  const handleOffer = useCallback(async (peerId: string, offer: RTCSessionDescriptionInit) => {
    try {
      const connection = peersRef.current.get(peerId)?.connection || createPeerConnection(peerId);
      
      await connection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      
      socketService.socket?.emit('answer', roomId, peerId, answer);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [roomId, createPeerConnection]);

  // Handle incoming answer
  const handleAnswer = useCallback(async (peerId: string, answer: RTCSessionDescriptionInit) => {
    try {
      const connection = peersRef.current.get(peerId)?.connection;
      if (connection) {
        await connection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, []);

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (peerId: string, candidate: RTCIceCandidateInit) => {
    try {
      const connection = peersRef.current.get(peerId)?.connection;
      if (connection) {
        await connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }, []);

  // Cleanup peer connections
  const cleanupPeer = useCallback((peerId: string) => {
    const peer = peersRef.current.get(peerId);
    if (peer) {
      peer.connection.close();
      peersRef.current.delete(peerId);
      setPeers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(peerId);
        return newMap;
      });
    }

    // Remove remote stream
    remoteStreamsRef.current.delete(peerId);
    setRemoteStreams((prev) => {
      const newMap = new Map(prev);
      newMap.delete(peerId);
      return newMap;
    });
  }, []);

  // Cleanup all connections
  const cleanup = useCallback(() => {
    stopLocalVideo();
    
    peersRef.current.forEach((peer, peerId) => {
      cleanupPeer(peerId);
    });
    
    setPeers(new Map());
    setRemoteStreams(new Map());
  }, [stopLocalVideo, cleanupPeer]);

  // Setup socket listeners
  useEffect(() => {
    if (!roomId || !userId) return;

    // Handle user joined
    const handleUserJoined = (peerId: string) => {
      if (peerId !== userId) {
        createOffer(peerId);
      }
    };

    // Handle user left
    const handleUserLeft = (peerId: string) => {
      cleanupPeer(peerId);
    };

    // Setup socket event listeners
    socketService.socket?.on('user:joined', handleUserJoined);
    socketService.socket?.on('user:left', handleUserLeft);
    socketService.socket?.on('offer', handleOffer);
    socketService.socket?.on('answer', handleAnswer);
    socketService.socket?.on('ice:candidate', handleIceCandidate);

    return () => {
      socketService.socket?.off('user:joined', handleUserJoined);
      socketService.socket?.off('user:left', handleUserLeft);
      socketService.socket?.off('offer', handleOffer);
      socketService.socket?.off('answer', handleAnswer);
      socketService.socket?.off('ice:candidate', handleIceCandidate);
    };
  }, [roomId, userId, createOffer, handleOffer, handleAnswer, handleIceCandidate, cleanupPeer]);

  // Auto-start video when component mounts
  useEffect(() => {
    if (roomId && userId) {
      startLocalVideo().catch(console.error);
    }

    return () => {
      cleanup();
    };
  }, [roomId, userId, startLocalVideo, cleanup]);

  return {
    localStream,
    peers: peersRef.current,
    remoteStreams: remoteStreamsRef.current,
    isVideoEnabled,
    isAudioEnabled,
    startLocalVideo,
    stopLocalVideo,
    toggleVideo,
    toggleAudio,
    createPeerConnection,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    cleanup
  };
};
