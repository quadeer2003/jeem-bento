"use client";

import { BentoItem } from "@/lib/types";
import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

interface PomodoroItemProps {
  item: BentoItem;
  onUpdate: (content: any) => void;
  editable: boolean;
}

export default function PomodoroItem({ item, onUpdate, editable }: PomodoroItemProps) {
  // Default times in minutes
  const defaultWorkTime = 25;
  const defaultBreakTime = 5;
  
  // Get saved settings or use defaults
  const [workMinutes, setWorkMinutes] = useState(item.content?.workMinutes || defaultWorkTime);
  const [breakMinutes, setBreakMinutes] = useState(item.content?.breakMinutes || defaultBreakTime);
  const [isWorking, setIsWorking] = useState(item.content?.isWorking !== false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(item.content?.timeLeft || workMinutes * 60);
  const [showSettings, setShowSettings] = useState(false);
  
  // Save settings when they change
  useEffect(() => {
    onUpdate({
      ...item.content,
      workMinutes,
      breakMinutes,
      isWorking,
      timeLeft
    });
  }, [workMinutes, breakMinutes, isWorking, timeLeft]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime: number) => {
          if (prevTime <= 1) {
            // Switch between work and break
            const newIsWorking = !isWorking;
            setIsWorking(newIsWorking);
            
            // Play sound
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            
            // Reset timer based on new mode
            return newIsWorking ? workMinutes * 60 : breakMinutes * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isWorking, workMinutes, breakMinutes]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle start/pause
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isWorking ? workMinutes * 60 : breakMinutes * 60);
  };

  // Save settings
  const saveSettings = (newWorkMinutes: number, newBreakMinutes: number) => {
    setWorkMinutes(newWorkMinutes);
    setBreakMinutes(newBreakMinutes);
    setTimeLeft(isWorking ? newWorkMinutes * 60 : newBreakMinutes * 60);
    setShowSettings(false);
    setIsRunning(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {showSettings ? (
        <div className="w-full space-y-4">
          <h3 className="text-center font-medium">Pomodoro Settings</h3>
          
          <div className="space-y-2">
            <label className="block text-sm">Work Time (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(parseInt(e.target.value) || defaultWorkTime)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm">Break Time (minutes)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(parseInt(e.target.value) || defaultBreakTime)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowSettings(false)}
              className="px-3 py-1 bg-secondary rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => saveSettings(workMinutes, breakMinutes)}
              className="px-3 py-1 bg-primary text-primary-foreground rounded"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={`text-4xl font-bold mb-4 ${isWorking ? 'text-primary' : 'text-green-500'}`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="text-lg mb-6">
            {isWorking ? 'Focus Time' : 'Break Time'}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={toggleTimer}
              className="p-2 bg-primary text-primary-foreground rounded-full"
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={resetTimer}
              className="p-2 bg-secondary rounded-full"
            >
              <RotateCcw size={24} />
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-secondary rounded-full"
            >
              <Settings size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
} 