/**
 * 장시간 부재 후 복귀 시 표시되는 오버레이 배너
 * 듀오링고 스타일 - 부재 레벨에 따라 다른 이미지와 메시지 표시
 */

import React from 'react';
import { X } from 'lucide-react';
import { AbsenceLevel, STAGE_ICONS, STAGE_INFO } from '../hooks/useAbsenceTracker';

interface AbsenceBannerProps {
  level: AbsenceLevel;
  onDismiss: () => void;
}

export default function AbsenceBanner({ level, onDismiss }: AbsenceBannerProps) {
  if (level === 0) return null;

  const info = STAGE_INFO[level];
  const icon = STAGE_ICONS[level];

  if (!info || !icon) return null;

  const stageLabelMap: Record<AbsenceLevel, string> = {
    0: '',
    1: '1단계',
    2: '2단계',
    3: '4단계',
  };

  const borderColors: Record<AbsenceLevel, string> = {
    0: '',
    1: 'border-orange-400',
    2: 'border-orange-600',
    3: 'border-red-600',
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border-2 ${borderColors[level]}`}
      >
        {/* 스테이지 이미지 */}
        <div className="relative">
          <img
            src={icon}
            alt={`부재 ${stageLabelMap[level]}`}
            className="w-full h-52 object-cover object-center"
          />
          {/* 스테이지 뱃지 */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-black shadow-lg"
            style={{ backgroundColor: info.color }}
          >
            {stageLabelMap[level]}
          </div>
          {/* 닫기 버튼 */}
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 메시지 */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <p className="text-2xl mb-1">{info.emoji}</p>
            <h2 className="text-lg font-black text-gray-800 leading-snug">{info.title}</h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">{info.body}</p>
          </div>

          <button
            onClick={onDismiss}
            className="w-full py-3.5 rounded-2xl font-black text-white text-sm transition-all active:scale-95 shadow-lg"
            style={{ backgroundColor: info.color }}
          >
            지금 바로 관리하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
