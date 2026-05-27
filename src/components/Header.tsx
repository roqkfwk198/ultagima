/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Screen } from '../types';
import { AbsenceLevel, STAGE_ICONS } from '../hooks/useAbsenceTracker';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  absenceLevel: AbsenceLevel;
}

// 부재 레벨별 아이콘 테두리 색상
const ringColors: Record<AbsenceLevel, string> = {
  0: 'border-transparent',
  1: 'border-orange-400',
  2: 'border-orange-600',
  3: 'border-red-500',
};

export default function Header({ onNavigate, absenceLevel }: HeaderProps) {
  const stageIcon = STAGE_ICONS[absenceLevel]; // 항상 string (0단계 = stage0.png)

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full max-w-md mx-auto bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center transition-all"
    >
      {/* 왼쪽 로고: 단계 아이콘 + 앱 이름 */}
      <div
        id="header-logo-group"
        className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onNavigate('home')}
      >
        {/* 해 아이콘 자리에 단계 이미지 표시 */}
        <div className="relative">
          <div
            className={`w-9 h-9 rounded-full border-2 overflow-hidden shadow-sm ${ringColors[absenceLevel]}`}
          >
            <img
              id="profile-img"
              src={stageIcon}
              alt={`얼타지마 ${absenceLevel}단계`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 부재 뱃지 (1단계 이상) */}
          {absenceLevel > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[8px] font-black flex items-center justify-center shadow-md"
              style={{
                backgroundColor:
                  absenceLevel === 3 ? '#ba1a1a' : absenceLevel === 2 ? '#e07000' : '#FF9500',
              }}
            >
              {absenceLevel === 3 ? '!' : absenceLevel}
            </span>
          )}
        </div>

        <span className="text-2xl font-bold text-[#8c5000] tracking-tight">얼타지마</span>
      </div>
    </header>
  );
}
