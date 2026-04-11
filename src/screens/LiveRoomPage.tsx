"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Zap, TrendingUp, Clock, SkipForward } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import LiveLeaderboard from "@/components/live/LiveLeaderboard";
import LiveQuizPanel from "@/components/live/LiveQuizPanel";
import { useAuth } from "@/contexts/auth-context";
