import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Users, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BeautifulLoader } from "@/components/BeautifulLoader";
import { VideoGrid } from "@/components/VideoGrid";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { toast } from "sonner";
import { getMatricQuestions } from "@/data/matricExams";

interface ExamSession {
  id: string;
  roomId: string;
  year: string;
  stream: string;
  subject: string;
  status: "active" | "finished";
  startTime: string;
  endTime?: string;
  participants: ExamParticipant[];
  currentQuestion: number;
  totalQuestions: number;
  timeLimit: number; // in seconds
}

interface ExamParticipant {
  id: string;
  name: string;
  answers: Record<number, string>;
  score?: number;
  finished: boolean;
  finishedAt?: string;
}

interface MatricQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

const MatricExamSessionPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { roomId } = useParams();
  
  const [session, setSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<MatricQuestion[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebRTC hook for video during exam
  const {
    localStream,
    remoteStreams,
    isVideoEnabled,
    isAudioEnabled,
    startLocalVideo,
    toggleVideo,
    toggleAudio,
    cleanup: cleanupWebRTC
  } = useWebRTC(roomId || "", user?.id || "");

  // Anti-cheat hook
  const {
    violations: antiCheatViolations,
    activateMonitoring,
    deactivateMonitoring,
    reportViolation
  } = useAntiCheat();

  useEffect(() => {
    const initializeExamSession = async () => {
      if (!roomId) return;

      try {
        // Load exam session
        await loadExamSession();
        
        // Start video for exam monitoring
        await startLocalVideo();
      } catch (error) {
        console.error('Failed to initialize exam session:', error);
        toast.error("Failed to load exam session");
        navigate("/matric");
      }
    };

    initializeExamSession();

    return () => {
      deactivateMonitoring();
      cleanupWebRTC();
    };
  }, [roomId]);

  useEffect(() => {
    if (session?.status === "active" && timeRemaining > 0 && !finished) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session?.status, timeRemaining, finished]);

  const loadExamSession = async () => {
    try {
      setLoading(true);
      
      // Mock session data - in real app, fetch from API
      const mockSession: ExamSession = {
        id: Math.random().toString(36).substr(2, 9),
        roomId: roomId || "",
        year: "2014",
        stream: "Natural Science",
        subject: "Physics",
        status: "active",
        startTime: new Date().toISOString(),
        participants: [
          {
            id: user?.uid || "user1",
            name: profile?.name || "You",
            answers: {},
            finished: false
          },
          {
            id: "user2",
            name: "Student B",
            answers: {},
            finished: false
          }
        ],
        currentQuestion: 0,
        totalQuestions: 10,
        timeLimit: 1800 // 30 minutes
      };

      // Load questions
      const examQuestions = await getMatricQuestions(mockSession.year, mockSession.stream, mockSession.subject);
      const limitedQuestions = examQuestions.slice(0, mockSession.totalQuestions);
      
      setQuestions(limitedQuestions);
      setSession(mockSession);
      setTimeRemaining(mockSession.timeLimit);
    } catch (error) {
      toast.error("Failed to load exam session");
      navigate("/matric");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer);
    
    // Save answer locally
    if (session && user) {
      const updatedSession = {
        ...session,
        participants: session.participants.map(p => 
          p.id === user.id 
            ? { ...p, answers: { ...p.answers, [session.currentQuestion]: answer } }
            : p
        )
      };
      setSession(updatedSession);
    }
  };

  const nextQuestion = () => {
    if (!session || !questions.length) return;
    
    const nextIndex = session.currentQuestion + 1;
    if (nextIndex >= questions.length) {
      finishExam();
    } else {
      setSession({ ...session, currentQuestion: nextIndex });
      setCurrentAnswer(session.participants.find(p => p.id === user.id)?.answers[nextIndex] || "");
    }
  };

  const previousQuestion = () => {
    if (!session || session.currentQuestion <= 0) return;
    
    const prevIndex = session.currentQuestion - 1;
    
    setSession({ ...session, currentQuestion: prevIndex });
    setCurrentAnswer(session.participants.find(p => p.id === user.id)?.answers[prevIndex] || "");
  };

  const finishExam = async () => {
    if (!session || !user || finished) return;
    
    setFinished(true);
    
    // Calculate score
    const userParticipant = session.participants.find(p => p.id === user.id);
    if (userParticipant) {
      let correct = 0;
      questions.forEach((q, index) => {
        if (userParticipant.answers[index] === q.correctAnswer) {
          correct++;
        }
      });
      
      const score = Math.round((correct / questions.length) * 100);
      
      const results = { score, answers: userParticipant.answers };
      
      // Submit results via socket for real-time sync
      socketService.socket?.emit('exam:finish', session.roomId, results);
      
      const updatedSession = {
        ...session,
        status: "finished" as const,
        endTime: new Date().toISOString(),
        participants: session.participants.map(p => 
          p.id === user.id 
            ? { ...p, finished: true, finishedAt: new Date().toISOString(), score }
            : p
        )
      };
      
      setSession(updatedSession);
      setShowResults(true);
      
      toast.success(`Exam completed! Your score: ${score}%`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!session || !questions.length) return 0;
    return ((session.currentQuestion + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    if (!session || !user) return 0;
    const userParticipant = session.participants.find(p => p.id === user.uid);
    return userParticipant ? Object.keys(userParticipant.answers).length : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950">
        <BeautifulLoader size="lg" text="Loading exam session..." />
      </div>
    );
  }

  if (!session || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <div className="text-white text-xl">Session not found</div>
            <Button onClick={() => navigate("/matric")} className="mt-4">
              Back to Matric
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestionData = questions[session.currentQuestion];
  const userParticipant = session.participants.find(p => p.id === user?.uid);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Leave Session
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/70">
              <Users className="h-4 w-4" />
              {session.participants.length} participants
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="h-4 w-4" />
              <span className={timeRemaining < 300 ? "text-red-400" : ""}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Exam Info */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">
                  {session.year} E.C. - {session.subject}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {session.stream} Stream
                </CardDescription>
              </div>
              <Badge className="bg-green-500/20 text-green-200 border-green-400/20">
                {session.status === "active" ? "In Progress" : "Finished"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-white/70 text-sm">
                <span>Question {session.currentQuestion + 1} of {questions.length}</span>
                <span>Answered: {getAnsweredCount()}/{questions.length}</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Exam Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Grid */}
            <VideoGrid
              localStream={localStream}
              remoteStreams={remoteStreams}
              participants={session.participants.map(p => ({
                id: p.id,
                name: p.name,
                isHost: false,
                videoEnabled: true,
                audioEnabled: true
              }))}
              currentUserId={user?.id || ""}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
              className="max-h-64"
            />

            {/* Results View */}
            {showResults && userParticipant?.score !== undefined ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <CardTitle className="text-3xl text-white">Exam Completed!</CardTitle>
                    <CardDescription className="text-white/70">
                      Here are your results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-6xl font-bold text-white mb-4">
                      {userParticipant.score}%
                    </div>
                    <div className="text-white/70 mb-6">
                      You answered {getAnsweredCount()} out of {questions.length} questions
                    </div>
                    <Button onClick={() => navigate("/matric")} size="lg">
                      Back to Matric
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              /* Question View */
              <AnimatePresence mode="wait">
                <motion.div
                  key={session.currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">
                        Question {session.currentQuestion + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-lg text-white leading-relaxed">
                        {currentQuestionData.question}
                      </div>
                      
                      <RadioGroup
                        value={currentAnswer}
                        onValueChange={handleAnswerChange}
                        className="space-y-3"
                      >
                        {currentQuestionData.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value={option} 
                              id={`option-${index}`}
                              className="border-white/20 text-white"
                            />
                            <Label 
                              htmlFor={`option-${index}`}
                              className="text-white cursor-pointer flex-1 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      <div className="flex items-center justify-between pt-4">
                        <Button
                          variant="outline"
                          onClick={previousQuestion}
                          disabled={session.currentQuestion === 0}
                          className="text-white/70 border-white/20"
                        >
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <span>Progress:</span>
                          <span>{getAnsweredCount()}/{questions.length}</span>
                        </div>

                        {session.currentQuestion === questions.length - 1 ? (
                          <Button
                            onClick={finishExam}
                            disabled={!currentAnswer}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white"
                          >
                            Finish Exam
                          </Button>
                        ) : (
                          <Button
                            onClick={nextQuestion}
                            disabled={!currentAnswer}
                            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white"
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">
                          {participant.name}
                        </div>
                        <div className="text-white/60 text-xs">
                          {participant.finished ? (
                            <span className="text-green-400">Finished</span>
                          ) : (
                            <span>In Progress</span>
                          )}
                        </div>
                      </div>
                      {participant.finished && participant.score && (
                        <Badge className="bg-green-500/20 text-green-200 border-green-400/20 text-xs">
                          {participant.score}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Violations */}
            {(antiCheatViolations.length > 0 || !isVideoEnabled) && (
              <Card className="bg-red-500/10 backdrop-blur-lg border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-lg text-red-200 flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Violations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isVideoEnabled && (
                    <div className="text-red-300 text-sm mb-2">
                      Camera is disabled
                    </div>
                  )}
                  {antiCheatViolations.map((violation, index) => (
                    <div key={index} className="text-red-300 text-xs">
                      {violation}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatricExamSessionPage;
