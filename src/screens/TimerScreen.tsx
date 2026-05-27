/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pause, Play, Volume2, AlertCircle } from 'lucide-react';

interface TimerScreenProps {
  uvIndex: number;
}

/** 자외선 지수별 권장 재도포 간격 (분) */
function getReapplyMinutes(uvIndex: number, smartAlert: boolean): number {
  if (!smartAlert) return 120;
  if (uvIndex >= 8) return 60;
  if (uvIndex >= 5) return 90;
  return 120;
}

/** 총 목표 시간(초) 계산 - 권장 재도포 주기 × 2 사이클 = 최대 4시간, 최소 2시간 */
function getTargetSeconds(uvIndex: number, smartAlert: boolean): number {
  const mins = getReapplyMinutes(uvIndex, smartAlert);
  // 목표: 재도포 주기에 맞춰 타이머를 1회 설정 (최대 2시간)
  return Math.min(mins, 120) * 60;
}

export default function TimerScreen({ uvIndex }: TimerScreenProps) {
  const [smartAlert, setSmartAlert] = useState(true);
  const alertIntervalMinutes = getReapplyMinutes(uvIndex, smartAlert);

  // 타이머 목표 = 권장 재도포 간격 (분) 변환
  // ※ 기존 코드에서 4500초(75분)로 되어 있던 버그를 수정:
  //   UV 지수와 스마트알림에 따라 60~120분으로 정확히 설정
  const initialSeconds = alertIntervalMinutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // smartAlert 또는 uvIndex 변경 시 타이머 재설정
  const prevAlertRef = useRef(alertIntervalMinutes);
  useEffect(() => {
    if (prevAlertRef.current !== alertIntervalMinutes) {
      prevAlertRef.current = alertIntervalMinutes;
      setSecondsLeft(alertIntervalMinutes * 60);
      setIsRunning(true);
    }
  }, [alertIntervalMinutes]);

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

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const h = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';
    return `${h}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setSecondsLeft(initialSeconds);
    setIsRunning(true);
  };

  const toggleTimer = () => setIsRunning((prev) => !prev);

  // SVG 원형 프로그레스
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / initialSeconds) * circumference;

  // 타이머 완료 여부
  const isDone = secondsLeft === 0;

  return (
    <div id="timer-screen-container" className="flex flex-col gap-6 max-w-md mx-auto">
      {/* 원형 게이지 */}
      <section
        id="timer-gauge-section"
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r={radius} className="stroke-gray-100 fill-transparent" strokeWidth="12" />
            <circle
              cx="128"
              cy="128"
              r={radius}
              className={`fill-transparent transition-all duration-1000 ease-linear ${isDone ? 'stroke-green-500' : 'stroke-[#ff9500]'}`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute flex flex-col items-center text-center">
            <span className="text-sm font-semibold text-gray-400">
              {isDone ? '재도포 시간!' : '다음 재도포까지'}
            </span>
            <span
              className={`text-4xl font-black my-1 font-mono ${isDone ? 'text-green-600' : 'text-[#8c5000]'}`}
            >
              {isDone ? '✓ 완료' : formatTime(secondsLeft)}
            </span>
            <span className="text-xs font-semibold text-gray-500 bg-[#ffe171]/50 px-2.5 py-0.5 rounded-full mt-1">
              목표: {alertIntervalMinutes}분 후 재도포
            </span>
          </div>
        </div>

        {/* 완료 메시지 */}
        {isDone && (
          <div className="mt-3 w-full px-4 py-3 bg-green-50 rounded-xl border border-green-200 text-center">
            <p className="text-sm font-black text-green-700">☀️ 선크림 재도포 시간입니다!</p>
            <p className="text-xs text-green-600 mt-0.5">타이머 재설정 후 다시 외출을 즐기세요.</p>
          </div>
        )}
      </section>

      {/* 액션 버튼 */}
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
          disabled={isDone}
          className="w-full bg-gray-100 text-gray-800 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-98 transition-all font-semibold disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 text-gray-600" />
              <span className="text-base font-bold">일시정지</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 text-[#8c5000] fill-[#8c5000]" />
              <span className="text-base font-bold">다시시작</span>
            </>
          )}
        </button>
      </section>

      {/* 상태 카드 */}
      <section id="timer-settings-summary" className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400">재도포 주기</span>
          <span className="text-xl font-bold text-[#8c5000]">{alertIntervalMinutes}분</span>
          <span className="text-[9px] text-gray-400">
            UV {uvIndex} 기준{smartAlert ? ' (스마트)' : ''}
          </span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-semibold text-gray-400">알림 소리</span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <span className="text-base font-bold">기본음</span>
          </div>
        </div>
      </section>

      {/* 스마트 알림 토글 */}
      <section
        id="smart-alert-section"
        className="bg-[#ffe171] rounded-xl p-4 border border-[#ffe171]/50 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#fdd404] text-[#2d1600] flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2d1600]">스마트 알림</h3>
            <p className="text-xs text-[#2d1600]/80 mt-0.5">
              UV 지수에 따라 재도포 주기를 자동 조절합니다
            </p>
            <p className="text-[9px] text-[#2d1600]/60 mt-0.5">
              UV≥8 → 60분 / UV≥5 → 90분 / 그 외 → 120분
            </p>
          </div>
        </div>

        <button
          id="smart-alert-toggle"
          onClick={() => setSmartAlert((prev) => !prev)}
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
