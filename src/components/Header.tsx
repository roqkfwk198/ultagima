/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  return (
    <header 
      id="app-header"
      className="sticky top-0 z-40 w-full max-w-md mx-auto bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex justify-between items-center transition-all"
    >
      <div 
        id="header-logo-group"
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onNavigate('home')}
      >
        <Sun className="w-7 h-7 text-[#8c5000] fill-[#8c5000]" />
        <span className="text-2xl font-bold text-[#8c5000] tracking-tight">얼타지마</span>
      </div>
      
      <button 
        id="header-profile-button"
        className="w-10 h-10 rounded-full border-2 border-gray-100 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#8c5000] active:scale-95 transition-transform"
        onClick={() => onNavigate('survey')}
        title="피부 MBTI 설정 바로가기"
      >
        <img 
          id="profile-img"
          alt="User profile" 
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8M9dfx5LjD7v4XZ12JFgIaEyOFcYUktgRa9CWywo_YFcz3Dg9-WFtULY_pELbbeFs39thhLgnCeO_6wO802IwrK0uZFce50-ouReBDwz7gr-RFS-sKuHBJ-HuR5nkkH27ivoEO7kygJf7XewraCCUR_5Z7XybRxp33TfNcQG_EOdXPHt7VLF1y3L9SHiwAvNQ3ra-EVAhQn9H3vxbYovI0HnmIhmBs4PwmLIlUuFmTnpMA_QM8sbbj-yUnWokWSgBkbFlPCOG_40t"
        />
      </button>
    </header>
  );
}
