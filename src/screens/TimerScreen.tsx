/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pause, Play, Volume2, AlertCircle } from 'lucide-react';

interface TimerScreenProps {
  uvIndex: number;
}

export default function TimerScreen({ uvIndex }: TimerScreenProps) {
  // Initial 1 hour 15 minutes (4500 seconds)
  const initialSeconds = 4500;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [smartAlert, setSmartAlert] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic interval calculation based on UV Index and Smart Alert status
  // If Smart Alert is enabled, higher UV Index leads to faster alerts
  const alertInterval = smartAlert 
    ? uvIndex >= 8 ? 60 : uvIndex >= 5 ? 90 : 120 
    : 120;

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  // Format seconds into hh:mm:ss style or mm:ss
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    const formattedHrs = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    
    return `${formattedHrs}${formattedMins}:${formattedSecs}`;
  };

  const resetTimer = () => {
    setSecondsLeft(initialSeconds);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // SVG parameters for circular progression
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / initialSeconds) * circumference;

  return (
    <div id="timer-screen-container" className="flex flex-col gap-6 max-w-md mx-auto">
      {/* Circular Progress Gauge */}
      <section id="timer-gauge-section" className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Circular SVG Gauge Progress */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              className="stroke-gray-100 fill-transparent"
              strokeWidth="12"
            />
            {/* Foreground Progress Circle */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              className="stroke-[#ff9500] fill-transparent transition-all duration-1000 ease-linear"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Texts inside timer */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-sm font-semibold text-gray-400">남은 시간</span>
            <span className="text-4xl font-black text-[#8c5000] my-1 font-mono">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs font-semibold text-gray-500 bg-[#ffe171]/50 px-2.5 py-0.5 rounded-full mt-1">
              목표: 2시간
            </span>
          </div>
        </div>
      </section>

      {/* Action buttons */}
      <section id="timer-actions-section" className="flex flex-col gap-3">
        <button
          id="btn-timer-reset"
          onClick={resetTimer}
          className="w-full bg-[#8c5000] text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#6a3b00] active:scale-98 transition-all shadow-md font-semibold"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-base font-bold">타이머 재설정</span>
        </button>

        <button
          id="btn-timer-toggle"
          onClick={toggleTimer}
          className="w-full bg-gray-100 text-gray-800 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-98 transition-all font-semibold"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 text-gray-600" />
              <span className="text-base font-bold">타이머 일시정지</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 text-[#8c5000] fill-[#8c5000]" />
              <span className="text-base font-bold">타이머 다시시작</span>
            </>
          )}
        </button>
      </section>

      {/* Info Status Cards */}
      <section id="timer-settings-summary" className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400">알림 주기</span>
          <span className="text-xl font-bold text-[#8c5000]">{alertInterval}분</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400">알림 소리</span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <span className="text-base font-bold">기본음</span>
          </div>
        </div>
      </section>

      {/* Smart Alert Switch */}
      <section id="smart-alert-section" className="bg-[#ffe171] rounded-xl p-4 border border-[#ffe171]/50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#fdd404] text-[#2d1600] flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2d1600]">스마트 알림</h3>
            <p className="text-xs text-[#2d1600]/80 mt-0.5">자외선 지수에 따라 주기를 자동 조절합니다</p>
          </div>
        </div>
        
        {/* Toggle widget */}
        <button
          id="smart-alert-toggle"
          onClick={() => setSmartAlert(!smartAlert)}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
            smartAlert ? 'bg-[#8c5000]' : 'bg-gray-300'
          }`}
          aria-label="Smart Alert Toggle"
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
              smartAlert ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </section>
    </div>
  );
}
