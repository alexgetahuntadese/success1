import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "@/lib/router";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Play, ArrowLeft, ArrowRight, UserPlus, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BeautifulLoader } from "@/components/BeautifulLoader";
import { toast } from "sonner";
import { getMatricYears, getMatricStreamsForYear, getMatricSubjectsForYear, getMatricQuestions } from "@/data/matricExams";

interface Room {
  id: string;
  hostId: string;
  hostName: string;
  year: string;
  stream: string;
  subject: string;
  participants: Participant[];
  status: "waiting" | "starting" | "active" | "finished";
  createdAt: string;
  startedAt?: string;
  timeRemaining?: number;
}

interface Participant {
  id: string;
  name: string;
  joinedAt: string;
  isHost: boolean;
}

const MatricStudyRoomPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams();
  
  const location = useLocation();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [step, setStep] = useState<"create" | "year" | "stream" | "subject" | "waiting">("create");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [examStarted, setExamStarted] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [prefillYear, setPrefillYear] = useState("");
  const [prefillStream, setPrefillStream] = useState("");
  const [prefillSubject, setPrefillSubject] = useState("");
  const [autoCreated, setAutoCreated] = useState(false);

  const years = getMatricYears();
  const streams = selectedYear ? getMatricStreamsForYear(parseInt(selectedYear)) : [];
  const subjects = selectedYear && selectedStream ? getMatricSubjectsForYear(parseInt(selectedYear), selectedStream) : [];

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
    } else {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (room?.status === "starting" && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && room?.status === "starting") {
      startExam();
    }
  }, [room?.status, timeRemaining]);

  const createRoom = (prefill?: Partial<Pick<Room, 'year' | 'stream' | 'subject'>>) => {
    if (!user || !profile) {
      toast.error("Please sign in to create a room");
      navigate("/login");
      return;
    }

    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      hostId: user.id || "temp-host",
      hostName: profile.name || "Host",
      year: prefill?.year || "",
      stream: prefill?.stream || "",
      subject: prefill?.subject || "",
      participants: [{
        id: user.id || "temp-host",
        name: profile.name || "Host",
        joinedAt: new Date().toISOString(),
        isHost: true
      }],
      status: "waiting",
      createdAt: new Date().toISOString()
    };

    setRoom(newRoom);
    setSelectedYear(newRoom.year);
    setSelectedStream(newRoom.stream);
    setSelectedSubject(newRoom.subject);
    setStep(newRoom.year && newRoom.stream && newRoom.subject ? "waiting" : "year");
  };

  const joinRoom = (roomId: string) => {
    if (!user || !profile) {
      toast.error("Please sign in to join room");
      navigate("/login");
      return;
    }

    // Create room state for the joining user
    const joinedRoom: Room = {
      id: roomId,
      hostId: "host-" + roomId,
      hostName: "Room Host",
      year: "2014",
      stream: "Natural Science",
      subject: "Physics",
      participants: [
        {
          id: "host-" + roomId,
          name: "Room Host",
          joinedAt: new Date().toISOString(),
          isHost: true
        },
        {
          id: user.id || "temp-user",
          name: profile.name || "Student",
          joinedAt: new Date().toISOString(),
          isHost: false
        }
      ],
      status: "waiting",
      createdAt: new Date().toISOString()
    };

    setRoom(joinedRoom);
    setStep("waiting");
    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const yearQuery = params.get("year") ?? "";
    const streamQuery = params.get("stream") ?? "";
    const subjectQuery = params.get("subject") ?? "";

    if (yearQuery || streamQuery || subjectQuery) {
      setPrefillYear(yearQuery);
      setPrefillStream(streamQuery);
      setPrefillSubject(subjectQuery);
      setSelectedYear(yearQuery);
      setSelectedStream(streamQuery || "natural");
      setSelectedSubject(subjectQuery);
    }
  }, [location.search]);

  useEffect(() => {
    if (!roomId && !room && !autoCreated && (prefillYear || prefillStream || prefillSubject)) {
      createRoom({
        year: prefillYear,
        stream: prefillStream,
        subject: prefillSubject,
      });
      setAutoCreated(true);
    }
  }, [roomId, room, autoCreated, prefillYear, prefillStream, prefillSubject]);

  const selectYear = (year: string) => {
    setSelectedYear(year);
    setStep("stream");
  };

  const selectStream = (stream: any) => {
    setSelectedStream(stream.key);
    setStep("subject");
  };

  const selectSubject = (subject: any) => {
    setSelectedSubject(subject.subject);
    
    if (room) {
      const updatedRoom = {
        ...room,
        year: selectedYear,
        stream: selectedStream,
        subject: subject.subject
      };
      setRoom(updatedRoom);
    }
    
    setStep("waiting");
  };

  const startSession = () => {
    if (!room) return;

    // For demo: allow starting with 1+ participants
    const updatedRoom = {
      ...room,
      status: "starting" as const,
      startedAt: new Date().toISOString()
    };
    setRoom(updatedRoom);
  };

  const startExam = () => {
    setExamStarted(true);
    if (room) {
      const updatedRoom = {
        ...room,
        status: "active" as const
      };
      setRoom(updatedRoom);
      // Navigate to exam session
      navigate(`/matric/session/${room.id}`);
    }
  };

  const openVideoRoom = () => {
    if (room) {
      try {
        localStorage.setItem(
          `roomMeta:${room.id}`,
          JSON.stringify({
            year: room.year,
            stream: room.stream,
            subject: room.subject,
          }),
        );
      } catch (error) {
        console.warn("Unable to persist room metadata", error);
      }
      window.location.href = `/room/${room.id}`;
    }
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
        <BeautifulLoader size="lg" text="Joining study room..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 p-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Room Not Found</CardTitle>
            <CardDescription className="text-white/70">
              Unable to join this study room
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate("/matric")}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white"
            >
              Back to Matric
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/matric")}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Matric
          </Button>
          
          {room && (
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="outline" className="text-white/70 border-white/20">
                Room Code: {room.id}
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
              <Button
                variant="outline"
                size="sm"
                onClick={openVideoRoom}
                className="text-white/70 border-white/20 hover:text-white"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Open Video Room
              </Button>
            </div>
          )}
        </div>

        {/* Room Creation Flow */}
        {!roomId && step === "create" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Create Study Room</CardTitle>
                <CardDescription className="text-white/70">
                  Host a collaborative matric exam session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={createRoom}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white"
                  size="lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Create Room
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Year Selection */}
        {step === "year" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Select Matric Year</CardTitle>
                <CardDescription className="text-white/70">
                  Choose the exam year for your study session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {years.map((year) => (
                    <Button
                      key={year}
                      variant="outline"
                      onClick={() => selectYear(year)}
                      className="h-20 text-lg bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      {year} E.C.
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stream Selection */}
        {step === "stream" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Select Stream</CardTitle>
                <CardDescription className="text-white/70">
                  Choose your academic stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {streams.map((stream, index) => (
                    <Button
                      key={stream.key}
                      variant="outline"
                      onClick={() => selectStream(stream)}
                      className="w-full h-16 text-left bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-lg">{stream.label}</span>
                        <Badge className="bg-violet-500/20 text-violet-200 border-violet-400/20">
                          {stream.subjects?.length || 0} subjects
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Subject Selection */}
        {step === "subject" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Select Subject</CardTitle>
                <CardDescription className="text-white/70">
                  Choose the subject for your exam session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((subject) => (
                    <Button
                      key={subject.subject}
                      variant="outline"
                      onClick={() => selectSubject(subject)}
                      className="h-16 text-left bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-sm text-white/60">
                          {subject.questionCount} questions
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Waiting Room */}
        {step === "waiting" && room && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Room Info */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white">Study Room</CardTitle>
                      <CardDescription className="text-white/70">
                        {room.year} E.C. - {room.stream} - {room.subject}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={
                        room.status === "waiting" ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/20" :
                        room.status === "starting" ? "bg-blue-500/20 text-blue-200 border-blue-400/20" :
                        room.status === "active" ? "bg-green-500/20 text-green-200 border-green-400/20" :
                        "bg-gray-500/20 text-gray-200 border-gray-400/20"
                      }
                    >
                      {room.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Countdown Timer */}
                  {room.status === "starting" && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="text-6xl font-bold text-white mb-4">
                        {timeRemaining}
                      </div>
                      <div className="text-xl text-white/70">
                        Exam starting in...
                      </div>
                    </motion.div>
                  )}

                  {/* Exam Active */}
                  {examStarted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <div className="text-2xl text-white font-semibold mb-2">
                        Exam in Progress
                      </div>
                      <div className="text-white/70">
                        All participants are now taking the exam
                      </div>
                    </motion.div>
                  )}

                  {/* Waiting for participants */}
                  {room.status === "waiting" && (
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 text-violet-400 mx-auto mb-4" />
                      <div className="text-xl text-white font-semibold mb-2">
                        Waiting for Participants
                      </div>
                      <div className="text-white/70 mb-4">
                        Share this room code to invite others
                      </div>
                      <div className="bg-white/10 backdrop-blur-lg border-white/20 rounded-lg p-4 mb-4">
                        <div className="text-white/60 text-sm mb-1">Room Code</div>
                        <div className="text-white font-mono text-2xl font-bold mb-2">
                          {room.id}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/room/${room.id}`)}
                          className="text-white/70 border-white/20 hover:text-white"
                        >
                          Copy Link
                        </Button>
                      </div>
                      {room.participants.length >= 2 && user?.id === room.hostId && (
                        <Button
                          onClick={startSession}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                          size="lg"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Start Session
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Participants */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Participants ({room.participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {room.participants.map((participant, index) => (
                        <motion.div
                          key={participant.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">
                              {participant.name}
                            </div>
                            {participant.isHost && (
                              <Badge className="bg-violet-500/20 text-violet-200 border-violet-400/20 text-xs">
                                Host
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {room.participants.length < 2 && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="text-yellow-200 text-sm">
                        Need at least 2 participants to start
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MatricStudyRoomPage;
