/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sun, CloudRain, Shield, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { Screen, UVHourData } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  uvIndex: number;
  setUvIndex: (index: number) => void;
}

export default function HomeScreen({ onNavigate, uvIndex, setUvIndex }: HomeScreenProps) {
  // Available list of simulated hours
  const hourlyData: UVHourData[] = [
    { hour: '10시', uvIndex: 8, bgColor: '#FFD600' },
    { hour: '11시', uvIndex: 9, bgColor: '#FFD600' },
    { hour: '12시', uvIndex: 10, bgColor: '#FF9500' },
    { hour: '13시', uvIndex: 11, bgColor: '#FF9500' },
    { hour: '14시', uvIndex: 9, bgColor: '#FFD600' },
    { hour: '15시', uvIndex: 7, bgColor: '#fdd404' },
    { hour: '16시', uvIndex: 5, bgColor: '#ffe171' },
    { hour: '17시', uvIndex: 3, bgColor: '#ffe171' },
    { hour: '18시', uvIndex: 1, bgColor: '#e1e3e4' },
    { hour: '19시', uvIndex: 0, bgColor: '#e1e3e4' },
  ];

  // Dynamic status based on UV index
  const getUVStatus = (index: number) => {
    if (index <= 2) return { label: '낮음', color: '#FFD600', text: '자외선이 미미합니다. 안전하게 야외활동이 가능합니다.' };
    if (index <= 5) return { label: '보통', color: '#ffe171', text: '약간의 자외선 노출이 있습니다. 자외선 차단제를 바르세요.' };
    if (index <= 7) return { label: '높음', color: '#FF9500', text: '외출 시 모자나 선글라스를 착용하고 차단제를 꼼꼼히 바르세요.' };
    return { label: '매우높음', color: '#ba1a1a', text: '그늘에 머무르세요. 햇볕에 노출 시 피부 화상을 입을 수 있습니다.' };
  };

  const status = getUVStatus(uvIndex);

  // Position of slider dot based on index
  const getSliderPosition = (idx: number) => {
    // scale 0 to 11 to percentage (approx)
    const percentage = Math.min(100, Math.max(0, (idx / 11) * 100));
    return `${percentage}%`;
  };

  return (
    <div id="home-screen-container" className="flex flex-col gap-3.5">
      {/* Gauge Section */}
      <section id="uv-gauge-section" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center gap-3.5">
        <div id="uv-header" className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#ff9500] fill-[#ff9500] animate-pulse" />
            <span className="text-[12px] font-bold text-gray-400 tracking-wider">현재 자외선 지수</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100">
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-[#8c5000]">{uvIndex}</span>
              <span className="text-[10px] text-gray-400 font-bold">/11</span>
            </div>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white shadow-sm" style={{ backgroundColor: status.color }}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Custom Interactive Gauge Slider */}
        <div id="uv-gauge-control" className="relative w-full h-8 flex items-center">
          <input
            id="uv-index-slider"
            type="range"
            min="0"
            max="11"
            value={uvIndex}
            onChange={(e) => setUvIndex(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            aria-label="UV Index Adjuster"
          />
          <div className="absolute inset-x-0 h-2.5 rounded-full overflow-hidden flex shadow-inner">
            <div className="w-[18%] bg-[#FFD600]" title="낮음 (0-2)" />
            <div className="w-[27%] bg-[#fdd404]" title="보통 (3-5)" />
            <div className="w-[18%] bg-[#FF9500]" title="높음 (6-7)" />
            <div className="w-[37%] bg-[#ba1a1a]" title="매우높음 (8-11)" />
          </div>
          
          {/* Custom Slider Thumb */}
          <div 
            id="uv-slider-thumb"
            className="absolute -translate-x-1/2 flex flex-col items-center z-10 transition-all pointer-events-none"
            style={{ left: getSliderPosition(uvIndex) }}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-lg border-4 border-[#8c5000] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#8c5000] rounded-full" />
            </div>
          </div>
        </div>

        <div id="uv-levels-text" className="flex justify-between w-full px-1">
          <span className="text-[10px] font-bold text-gray-400">낮음</span>
          <span className="text-[10px] font-bold text-gray-400">보통</span>
          <span className="text-[10px] font-bold text-gray-400">높음</span>
          <span className="text-[10px] font-bold text-gray-400">매우높음</span>
        </div>

        {/* Dynamic Tip Warning Panel */}
        <div 
          id="uv-alert-banner" 
          className="w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 active:scale-98 transition-transform cursor-pointer"
          style={{ 
            backgroundColor: uvIndex >= 8 ? '#ffdad6' : uvIndex >= 6 ? '#ffeacc' : uvIndex >= 3 ? '#fff9db' : '#eafaf1',
            color: uvIndex >= 8 ? '#93000a' : uvIndex >= 6 ? '#8c5000' : uvIndex >= 3 ? '#705d00' : '#1e4620'
          }}
          onClick={() => onNavigate('timer')}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-[11px] font-bold leading-tight truncate">
              {status.text}
            </span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 animate-bounce-horizontal" />
        </div>
      </section>

      {/* Hourly UV Forecast */}
      <section id="hourly-forecast-section" className="flex flex-col gap-2">
        <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 px-0.5">
          <Sun className="w-4 h-4 text-[#8c5000]" />
          시간대별 자외선 지수
        </h3>
        <div 
          id="hourly-forecast-scroll" 
          className="flex overflow-x-auto gap-2.5 pb-1 scrollbar-hide snap-x"
        >
          {hourlyData.map((data, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center min-w-[56px] bg-white rounded-xl p-2 border border-gray-100 shadow-sm snap-start shrink-0"
            >
              <span className="text-[11px] font-bold text-gray-400">{data.hour}</span>
              <div 
                className="w-2.5 h-2.5 rounded-full my-1.5 border border-white shadow-sm"
                style={{ backgroundColor: data.uvIndex >= 8 ? '#ba1a1a' : data.uvIndex >= 6 ? '#FF9500' : '#FFD600' }}
              />
              <span className="text-xs font-black text-gray-800">{data.uvIndex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Widgets (Grid Layout) */}
      <section id="dashboard-widgets-section" className="grid grid-cols-2 gap-3.5">
        {/* Left Column: Outing Environment Widget */}
        <div 
          id="outing-info-card" 
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#ffe171] transition-all min-h-[125px]"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-gray-400 tracking-wider">외출 환경</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-[#8c5000] tracking-tighter">28°C</span>
              <Sun className="w-6 h-6 animate-spin-slow text-[#ff9500] shrink-0" />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-gray-400 leading-none">맑음 · 습도 62%</p>
            <span className="inline-block self-start bg-[#ffdcbf] text-[#2d1600] text-[9px] font-black px-2.5 py-1 rounded-lg">
              테니스 지수 좋음
            </span>
          </div>
        </div>

        {/* Right Column: Skincare Survey Widget */}
        <div 
          id="skincare-survey-shortcut" 
          className="bg-gradient-to-br from-[#ffe171] to-[#fdd404] rounded-2xl p-4 shadow-sm border border-[#ffe171]/50 flex flex-col justify-between min-h-[125px]"
        >
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#705d00] shrink-0" />
              <span className="text-[11px] font-bold text-[#554600] tracking-wider">피부 MBTI</span>
            </div>
            <h4 className="text-[12px] font-black text-[#221b00] mt-1.5 leading-snug">
              내 피부 타입을 안다면?
            </h4>
            <p className="text-[9px] text-[#554600]/80 leading-tight">
              맞춤 자외선 차단 추천 받기
            </p>
          </div>
          <button 
            onClick={() => onNavigate('survey')}
            className="w-full mt-2 bg-white hover:bg-gray-50 text-[#8c5000] font-black text-[10px] py-1.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            설문 시작
          </button>
        </div>
      </section>
    </div>
  );
}
