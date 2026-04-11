'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Link, ArrowRight } from 'lucide-react';

export default function RoomIndexPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const createRoom = () => {
    const id = Math.random().toString(36).substr(2, 9);
    router.push(`/room/${id}`);
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      setError('Enter a room ID to join');
      return;
    }

    setError('');
    router.push(`/room/${roomId.trim()}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Card className="overflow-hidden border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="px-8 py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-slate-950 shadow-xl">
              <Users className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-semibold">Collaborative Room</CardTitle>
            <CardDescription className="mt-2 text-slate-400">
              Create a new study room or join an existing session with peers.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-10 pt-2">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Create room</p>
                <p className="mt-3 text-lg font-medium text-white">Start a new video room in one click.</p>
                <Button onClick={createRoom} className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950 shadow-lg shadow-emerald-500/20">
                  Create Room
                </Button>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Join existing</p>
                    <p className="mt-3 text-lg font-medium text-white">Paste a room ID below.</p>
                  </div>
                  <Link className="h-5 w-5 text-slate-400" />
                </div>
                <div className="mt-5 space-y-3">
                  <Input
                    value={roomId}
                    onChange={(event) => setRoomId(event.target.value)}
                    placeholder="Room ID"
                    className="bg-slate-950/90 text-white border-slate-700"
                  />
                  {error && <p className="text-sm text-rose-400">{error}</p>}
                  <Button onClick={joinRoom} className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/20">
                    Join Room
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-5 text-slate-400">
              <p className="font-medium text-white">Room URL</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your room will open at <span className="text-white">/room/&lt;room-id&gt;</span>. Share that URL with participants.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
