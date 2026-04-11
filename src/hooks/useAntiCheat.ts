"use client";

import { useEffect, useState, useCallback } from "react";
import { socketService } from "@/lib/socket";

interface UseAntiCheatReturn {
  violations: string[];
  isActive: boolean;
  activateMonitoring: (roomId: string, userId: string) => void;
  deactivateMonitoring: () => void;
  reportViolation: (violation: string) => void;
}

export const useAntiCheat = (): UseAntiCheatReturn => {
  const [violations, setViolations] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [roomId, setRoomId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Report violation to server
  const reportViolation = useCallback((violation: string) => {
    if (isActive && roomId && userId) {
      socketService.socket?.emit('violation', roomId, userId, violation);
      setViolations(prev => [...prev, `${violation} at ${new Date().toLocaleTimeString()}`]);
    }
  }, [isActive, roomId, userId]);

  // Activate anti-cheat monitoring
  const activateMonitoring = useCallback((newRoomId: string, newUserId: string) => {
    setRoomId(newRoomId);
    setUserId(newUserId);
    setIsActive(true);
  }, []);

  // Deactivate anti-cheat monitoring
  const deactivateMonitoring = useCallback(() => {
    setIsActive(false);
    setViolations([]);
    setRoomId("");
    setUserId("");
  }, []);

  // Tab switching detection
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation("Tab switched - user left the exam window");
      }
    };

    const handleBlur = () => {
      reportViolation("Window lost focus - possible tab switching");
    };

    const handleFocus = () => {
      // User returned to window
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isActive, reportViolation]);

  // Right-click prevention
  useEffect(() => {
    if (!isActive) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      reportViolation("Right-click attempted - possible cheating");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common keyboard shortcuts
      if (
        e.key === 'F12' || // Developer tools
        e.key === 'F5' || // Refresh
        (e.ctrlKey && e.key === 'r') || // Refresh
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Dev tools
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Dev tools
        (e.ctrlKey && e.key === 'u') || // View source
        (e.altKey && e.key === 'Tab') // Alt+Tab
      ) {
        e.preventDefault();
        reportViolation(`Keyboard shortcut blocked: ${e.key}`);
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      reportViolation("Copy attempt detected");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      reportViolation("Paste attempt detected");
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [isActive, reportViolation]);

  // Window resize detection (possible dev tools)
  useEffect(() => {
    if (!isActive) return;

    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // Check if window size changed significantly (possible dev tools)
      if (Math.abs(currentWidth - lastWidth) > 200 || Math.abs(currentHeight - lastHeight) > 200) {
        reportViolation("Significant window resize detected - possible dev tools");
      }
      
      lastWidth = currentWidth;
      lastHeight = currentHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, reportViolation]);

  // Listen for violation updates from server
  useEffect(() => {
    if (!isActive || !roomId) return;

    const handleViolationLogged = (violationUserId: string, violation: string) => {
      if (violationUserId === userId) {
        setViolations(prev => [...prev, `${violation} at ${new Date().toLocaleTimeString()}`]);
      }
    };

    socketService.socket?.on('violation:logged', handleViolationLogged);

    return () => {
      socketService.socket?.off('violation:logged', handleViolationLogged);
    };
  }, [isActive, roomId, userId]);

  return {
    violations,
    isActive,
    activateMonitoring,
    deactivateMonitoring,
    reportViolation
  };
};
