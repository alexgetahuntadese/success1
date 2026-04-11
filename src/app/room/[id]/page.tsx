'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, type Socket } from 'socket.io-client';
import { getGrade9Questions, type Grade9Question } from '@/data/grade9Questions';

export default function RoomPage() {
  const { id } = useParams();
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);
  const iceQueue = useRef<RTCIceCandidateInit[]>([]);
  const [status, setStatus] = useState('Connecting to room...');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [quizTitle, setQuizTitle] = useState('Waiting for quiz...');
  const [quizQuestionSet, setQuizQuestionSet] = useState<Grade9Question[] | null>(null);
  const [grade9Questions, setGrade9Questions] = useState<Grade9Question[]>([]);
  const [questionInput, setQuestionInput] = useState('');
  const [grade9LoadError, setGrade9LoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    socket.current = io('http://localhost:5000');
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.current.ontrack = (event) => {
      const stream = event.streams[0];
      if (remoteVideo.current) remoteVideo.current.srcObject = stream;
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

    socket.current.on('quiz-update', (data: { question?: string; title?: string; questions?: Grade9Question[] }) => {
      if (data?.questions && data.questions.length > 0) {
        setQuizTitle(data.title ?? 'Live exam questions');
        setQuizQuestionSet(data.questions);
      } else if (data?.question) {
        setQuizTitle(data.question);
        setQuizQuestionSet(null);
      }
    });

    const stopStream = (stream: MediaStream | null) => {
      stream?.getTracks().forEach((track) => track.stop());
    };

    const cleanupMedia = () => {
      stopStream(localVideo.current?.srcObject as MediaStream | null);
      stopStream(remoteVideo.current?.srcObject as MediaStream | null);
    };

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

        setAudioEnabled(true);
        setVideoEnabled(true);
        setCameraError(null);
        setStatus('Camera active — waiting for peer');
      } catch (error) {
        const err = error as Error & { name?: string };
        console.error('Camera error:', err);

        if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setCameraError('Camera is already in use by another app or tab. Only audio will be used for now.');
          setStatus('Audio-only mode — camera unavailable');
          setAudioEnabled(true);
          setVideoEnabled(false);

          try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (localVideo.current) {
              localVideo.current.srcObject = null;
            }
            audioStream.getTracks().forEach((track) => {
              if (track.kind === 'audio') {
                pc.current?.addTrack(track, audioStream);
              }
            });
          } catch (audioError) {
            console.error('Audio fallback failed:', audioError);
            setAudioEnabled(false);
            setCameraError('Unable to access microphone. Please allow device access.');
          }
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera permission denied. Please allow access to continue.');
          setStatus('Camera permission required');
        } else {
          setCameraError('Unable to access camera. Please check your device settings.');
          setStatus('Camera unavailable');
        }
      }
    };

    startCamera();

    return () => {
      socket.current?.disconnect();
      pc.current?.close();
      cleanupMedia();
    };
  }, [id]);

  useEffect(() => {
    getGrade9Questions('Mathematics', 'Unit 1: Further on Sets', 'easy', 8)
      .then((questions) => {
        setGrade9Questions(questions);
        setGrade9LoadError(null);
      })
      .catch((error) => {
        console.error('Unable to load Grade 9 Mathematics Unit 1 questions', error);
        setGrade9LoadError('Unable to load Grade 9 Mathematics questions.');
      });
  }, []);

  const sendQuiz = (payload: { question?: string; title?: string; questions?: Grade9Question[] }) => {
    if (!socket.current) return;

    if (payload.questions && payload.questions.length > 0) {
      setQuizTitle(payload.title ?? 'Live exam questions');
      setQuizQuestionSet(payload.questions);
    } else if (payload.question) {
      setQuizTitle(payload.question);
      setQuizQuestionSet(null);
    }

    socket.current.emit('quiz-update', { roomId: id, ...payload });
  };

  const sendGrade9Questions = () => {
    if (!grade9Questions.length) return;
    sendQuiz({
      title: 'Grade 9 Mathematics: Unit 1 Easy Questions',
      questions: grade9Questions,
    });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#050816', color: '#fff' }}>
      <div
        style={{
          height: '120px',
          display: 'flex',
          gap: '10px',
          padding: '10px',
          background: '#111',
          overflowX: 'auto',
        }}
      >
        <video
          ref={localVideo}
          autoPlay
          playsInline
          muted
          style={{ height: '100px', borderRadius: '10px', background: '#000' }}
        />
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          style={{ height: '100px', borderRadius: '10px', background: '#000' }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1080px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Room: {id}</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>{status}</div>
          </div>

          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '24px',
              minHeight: '360px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#94a3b8' }}>
                Live exam
              </div>
              <div style={{ marginTop: '14px', fontSize: '28px', fontWeight: 700, lineHeight: 1.1 }}>
                {quizTitle}
              </div>
              {quizQuestionSet?.length ? (
                <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                  <div style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    {quizQuestionSet.length} synced Grade 9 questions loaded
                  </div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {quizQuestionSet.map((question, index) => (
                      <div
                        key={question.id}
                        style={{
                          padding: '16px',
                          borderRadius: '18px',
                          background: '#08121f',
                          border: '1px solid #334155',
                        }}
                      >
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>
                          {index + 1}. {question.question}
                        </div>
                        <div style={{ marginTop: '8px', color: '#94a3b8', fontSize: '13px' }}>
                          {question.options.length} options · {question.difficulty}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '20px', color: '#94a3b8', fontSize: '16px' }}>
                  {grade9LoadError ?? 'Share a question or send the Grade 9 Unit 1 easy question set to sync it in the room.'}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                value={questionInput}
                onChange={(event) => setQuestionInput(event.target.value)}
                placeholder="Send a synced question to the room"
                style={{
                  flex: 1,
                  minWidth: '240px',
                  borderRadius: '999px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: '#fff',
                  padding: '14px 18px',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (questionInput.trim()) {
                    sendQuiz({ question: questionInput.trim() });
                    setQuestionInput('');
                  }
                }}
                style={{
                  borderRadius: '999px',
                  border: 'none',
                  background: '#22c55e',
                  color: '#0f172a',
                  padding: '14px 22px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Send quiz
              </button>
              <button
                type="button"
                onClick={sendGrade9Questions}
                disabled={!grade9Questions.length}
                style={{
                  borderRadius: '999px',
                  border: 'none',
                  background: grade9Questions.length ? '#2563eb' : '#334155',
                  color: '#fff',
                  padding: '14px 22px',
                  fontWeight: 700,
                  cursor: grade9Questions.length ? 'pointer' : 'not-allowed',
                }}
              >
                Send Grade 9 Unit 1 easy questions
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '14px' }}>
              <span>{audioEnabled ? 'Mic on' : 'Mic off'}</span>
              <span>{videoEnabled ? 'Camera on' : 'Camera off'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
