/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Clock, Sparkles, Star, Droplets } from 'lucide-react';
import { Screen } from '../types';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  // Navigation items mapping Screen to label and Icons
  const navItems = [
    { id: 'home' as Screen, label: '홈', icon: Sun },
    { id: 'timer' as Screen, label: '타이머', icon: Clock },
    { id: 'survey' as Screen, label: '피부 설정', icon: Sparkles },
    { id: 'recommend' as Screen, label: '추천', icon: Star },
    { id: 'cleansing' as Screen, label: '세안법', icon: Droplets },
  ];

  return (
    <>
      <nav 
        id="app-bottom-nav"
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center px-4 max-w-md mx-auto h-[76px] rounded-full bg-white/90 backdrop-blur-md shadow-2xl border border-gray-100"
      >
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          
          if (isActive) {
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center bg-[#fdd404] text-[#221b00] rounded-full w-14 h-14 shadow-lg active:scale-95 transition-all duration-300 relative -top-3"
              >
                <Icon className="w-6 h-6 stroke-[2.5]" />
                <span className="text-[10px] font-semibold mt-1 whitespace-nowrap">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center text-[#554334] hover:text-[#8c5000] px-3 py-2 active:scale-90 transition-all duration-200"
            >
              <Icon className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] font-medium mt-1 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Subtle overlay for beautiful scroll blend at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f8f9fa] to-transparent pointer-events-none z-40 max-w-md mx-auto" />
    </>
  );
}
