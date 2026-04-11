'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, type Socket } from 'socket.io-client';

export default function RoomPage() {
  const { id } = useParams();
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo1 = useRef<HTMLVideoElement | null>(null);
  const remoteVideo2 = useRef<HTMLVideoElement | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);
  const iceQueue = useRef<RTCIceCandidateInit[]>([]);
  const [status, setStatus] = useState('Connecting to room...');

  useEffect(() => {
    if (!id) return;

    socket.current = io('http://localhost:5000');
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.current.ontrack = (event) => {
      const stream = event.streams[0];
      if (remoteVideo1.current) remoteVideo1.current.srcObject = stream;
      if (remoteVideo2.current) remoteVideo2.current.srcObject = stream;
      setStatus('Peer connected');
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate && socket.current) {
        socket.current.emit('ice-candidate', {
          roomId: id,
          candidate: event.candidate,
        });
      }
    };

    socket.current.on('connect', () => {
      setStatus('Connected to signaling server');
      socket.current?.emit('join-room', id);
    });

    socket.current.on('user-joined', async () => {
      if (!pc.current) return;
      setStatus('New peer joined — creating offer');
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.current?.emit('offer', { roomId: id, offer });
    });

    socket.current.on('offer', async (offer) => {
      if (!pc.current) return;
      setStatus('Incoming offer — sending answer');
      await pc.current.setRemoteDescription(offer);
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.current?.emit('answer', { roomId: id, answer });
      if (iceQueue.current.length) {
        for (const candidate of iceQueue.current) {
          await pc.current.addIceCandidate(candidate);
        }
        iceQueue.current = [];
      }
    });

    socket.current.on('answer', async (answer) => {
      if (!pc.current) return;
      setStatus('Answer received — connecting');
      await pc.current.setRemoteDescription(answer);
    });

    socket.current.on('ice-candidate', async (candidate) => {
      if (!pc.current) return;
      try {
        if (pc.current.remoteDescription?.type) {
          await pc.current.addIceCandidate(candidate);
        } else {
          iceQueue.current.push(candidate);
        }
      } catch (error) {
        console.error('ICE candidate error:', error);
      }
    });

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });

        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          pc.current?.addTrack(track, stream);
        });

        setStatus('Camera active — waiting for peer');
      } catch (error) {
        console.error('Camera error:', error);
        setStatus('Camera permission required');
      }
    };

    startCamera();

    return () => {
      socket.current?.disconnect();
      pc.current?.close();
      if (localVideo.current?.srcObject instanceof MediaStream) {
        localVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (remoteVideo1.current?.srcObject instanceof MediaStream) {
        remoteVideo1.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (remoteVideo2.current?.srcObject instanceof MediaStream) {
        remoteVideo2.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-amber-300/80">Room</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">{id}</h1>
            </div>
            <div className="rounded-3xl bg-slate-800/90 px-4 py-3 text-slate-200 shadow-inner">
              <span className="block text-xs uppercase text-slate-400">Status</span>
              <span className="mt-1 block text-base font-medium">{status}</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-700 bg-black shadow-2xl">
            <video
              ref={remoteVideo1}
              autoPlay
              playsInline
              className="h-[520px] w-full object-cover"
            />
            <div className="absolute right-6 bottom-6 rounded-3xl border border-slate-700 bg-slate-950/88 p-3 shadow-lg">
              <p className="text-xs uppercase text-slate-400">You</p>
              <video
                ref={localVideo}
                autoPlay
                muted
                playsInline
                className="mt-3 h-[140px] w-[220px] rounded-3xl object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-5 shadow-2xl">
              <h2 className="mb-4 text-xl font-semibold text-white">Remote video grid</h2>
              <div className="grid gap-4">
                <div className="overflow-hidden rounded-3xl border border-slate-700 bg-black">
                  <video
                    ref={remoteVideo2}
                    autoPlay
                    playsInline
                    className="h-64 w-full object-cover"
                  />
                </div>
                <div className="rounded-3xl border border-dashed border-slate-700/70 bg-slate-950/60 p-6 text-center text-slate-400">
                  <p className="font-semibold text-slate-100">Second remote slot</p>
                  <p className="mt-2 text-sm">Invite another user to fill this tile.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="mb-3 text-xl font-semibold text-white">Quick controls</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 text-center">
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Mic</p>
                  <p className="mt-2 text-lg font-medium text-slate-100">On</p>
                </div>
                <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 text-center">
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Camera</p>
                  <p className="mt-2 text-lg font-medium text-slate-100">On</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
