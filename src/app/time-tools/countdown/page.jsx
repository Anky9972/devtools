"use client";
import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Plus, Bell, BellOff, Trash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PRESETS = {
  'Pomodoro': { hours: 0, minutes: 25, seconds: 0 },
  'Short Break': { hours: 0, minutes: 5, seconds: 0 },
  'Long Break': { hours: 0, minutes: 15, seconds: 0 },
  'Custom': { hours: 0, minutes: 0, seconds: 0 }
};

const CountdownTimer = () => {
  const [timers, setTimers] = useState([
    { id: 1, name: 'Timer 1', timeLeft: { hours: 0, minutes: 0, seconds: 0 }, 
      inputTime: { hours: 0, minutes: 0, seconds: 0 }, 
      isRunning: false, totalSeconds: 0 }
  ]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTimer, setActiveTimer] = useState(1);

  useEffect(() => {
    const intervals = timers.map(timer => {
      if (timer.isRunning && timer.totalSeconds > 0) {
        return setInterval(() => {
          setTimers(prevTimers => 
            prevTimers.map(t => {
              if (t.id === timer.id) {
                const newSeconds = t.totalSeconds - 1;
                if (newSeconds <= 0 && soundEnabled) {
                  new Audio('/notification.mp3').play().catch(() => {});
                }
                return {
                  ...t,
                  totalSeconds: newSeconds <= 0 ? 0 : newSeconds,
                  isRunning: newSeconds > 0
                };
              }
              return t;
            })
          );
        }, 1000);
      }
      return null;
    });

    return () => intervals.forEach(interval => interval && clearInterval(interval));
  }, [timers, soundEnabled]);

  useEffect(() => {
    setTimers(prevTimers =>
      prevTimers.map(timer => {
        const hours = Math.floor(timer.totalSeconds / 3600);
        const minutes = Math.floor((timer.totalSeconds % 3600) / 60);
        const seconds = timer.totalSeconds % 60;
        return {
          ...timer,
          timeLeft: { hours, minutes, seconds }
        };
      })
    );
  }, [timers.map(t => t.totalSeconds).join(',')]);

  const addTimer = () => {
    setTimers(prev => [...prev, {
      id: Date.now(),
      name: `Timer ${prev.length + 1}`,
      timeLeft: { hours: 0, minutes: 0, seconds: 0 },
      inputTime: { hours: 0, minutes: 0, seconds: 0 },
      isRunning: false,
      totalSeconds: 0
    }]);
  };

  const removeTimer = (id) => {
    setTimers(prev => prev.filter(t => t.id !== id));
    if (activeTimer === id) {
      setActiveTimer(timers[0]?.id);
    }
  };

  const updateTimer = (id, updates) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id ? { ...timer, ...updates } : timer
    ));
  };

  const startTimer = (id) => {
    const timer = timers.find(t => t.id === id);
    const seconds = 
      parseInt(timer.inputTime.hours) * 3600 + 
      parseInt(timer.inputTime.minutes) * 60 + 
      parseInt(timer.inputTime.seconds);
    
    if (seconds > 0) {
      updateTimer(id, { totalSeconds: seconds, isRunning: true });
    }
  };

  const toggleTimer = (id) => {
    const timer = timers.find(t => t.id === id);
    if (timer.totalSeconds === 0) {
      startTimer(id);
    } else {
      updateTimer(id, { isRunning: !timer.isRunning });
    }
  };

  const resetTimer = (id) => {
    updateTimer(id, {
      isRunning: false,
      totalSeconds: 0,
      timeLeft: { hours: 0, minutes: 0, seconds: 0 }
    });
  };

  const applyPreset = (id, preset) => {
    const presetTime = PRESETS[preset];
    updateTimer(id, {
      inputTime: { ...presetTime },
      isRunning: false,
      totalSeconds: 0,
      timeLeft: { hours: 0, minutes: 0, seconds: 0 }
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            Countdown Timer
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </Button>
          </CardTitle>
          <Button variant="outline" onClick={addTimer} disabled={timers.length >= 4}>
            <Plus className="w-4 h-4 mr-2" /> Add Timer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={String(activeTimer)} onValueChange={(v) => setActiveTimer(Number(v))}>
          <TabsList className="grid grid-cols-4">
            {timers.map(timer => (
              <TabsTrigger key={timer.id} value={String(timer.id)} className="relative">
                {timer.name}
                {timers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-4 w-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTimer(timer.id);
                    }}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {timers.map(timer => (
            <TabsContent key={timer.id} value={String(timer.id)} className="space-y-6">
              <div className="text-7xl font-mono text-center">
                {String(timer.timeLeft.hours).padStart(2, '0')}:
                {String(timer.timeLeft.minutes).padStart(2, '0')}:
                {String(timer.timeLeft.seconds).padStart(2, '0')}
              </div>

              <div className="flex gap-4 justify-center">
                {Object.keys(PRESETS).map(preset => (
                  <Badge
                    key={preset}
                    variant={preset === 'Custom' ? 'outline' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => applyPreset(timer.id, preset)}
                  >
                    {preset}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Object.keys(timer.inputTime).map((unit) => (
                  <div key={unit}>
                    <label className="block text-sm font-medium mb-2">
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max={unit === 'hours' ? 23 : 59}
                      value={timer.inputTime[unit]}
                      onChange={(e) => {
                        const value = Math.min(
                          unit === 'hours' ? 23 : 59,
                          Math.max(0, parseInt(e.target.value) || 0)
                        );
                        updateTimer(timer.id, {
                          inputTime: { ...timer.inputTime, [unit]: value }
                        });
                      }}
                      disabled={timer.isRunning || timer.totalSeconds > 0}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => toggleTimer(timer.id)}
                  variant={timer.isRunning ? "secondary" : "default"}
                  className="gap-2"
                >
                  {timer.isRunning ? (
                    <><Pause className="w-4 h-4" /> Pause</>
                  ) : (
                    <><Play className="w-4 h-4" /> Start</>
                  )}
                </Button>
                <Button
                  onClick={() => resetTimer(timer.id)}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Reset
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;