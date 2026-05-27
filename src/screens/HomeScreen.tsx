/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sun, AlertTriangle, ArrowRight, Shield, RefreshCw, MapPin, Loader2 } from 'lucide-react';
import { Screen, UVHourData } from '../types';
import { fetchUVData, getUserLocation, getMockUVData } from '../utils/uvApi';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  uvIndex: number;
  setUvIndex: (index: number) => void;
}

type LoadState = 'idle' | 'loading' | 'success' | 'error';

export default function HomeScreen({ onNavigate, uvIndex, setUvIndex }: HomeScreenProps) {
  const [hourlyData, setHourlyData] = useState<UVHourData[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  /** 실제 UV 데이터 가져오기 */
  const loadUVData = async () => {
    setLoadState('loading');
    try {
      const { lat, lon } = await getUserLocation();
      const result = await fetchUVData(lat, lon);

      setUvIndex(result.currentUVIndex);
      setHourlyData(result.hourlyData.length > 0 ? result.hourlyData : getMockUVData().hourlyData);
      setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      setLoadState('success');
    } catch (err) {
      console.warn('[HomeScreen] UV API failed, using mock data:', err);
      const mock = getMockUVData();
      setUvIndex(mock.currentUVIndex);
      setHourlyData(mock.hourlyData);
      setLoadState('error');
    }
  };

  useEffect(() => {
    loadUVData();
    // 30분마다 자동 갱신
    const interval = setInterval(loadUVData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // UV 상태 텍스트
  const getUVStatus = (index: number) => {
    if (index <= 2)
      return { label: '낮음', color: '#FFD600', text: '자외선이 미미합니다. 안전하게 야외활동이 가능합니다.' };
    if (index <= 5)
      return { label: '보통', color: '#ffe171', text: '약간의 자외선 노출이 있습니다. 자외선 차단제를 바르세요.' };
    if (index <= 7)
      return { label: '높음', color: '#FF9500', text: '외출 시 모자나 선글라스를 착용하고 차단제를 꼼꼼히 바르세요.' };
    return { label: '매우높음', color: '#ba1a1a', text: '그늘에 머무르세요. 햇볕에 노출 시 피부 화상을 입을 수 있습니다.' };
  };

  const status = getUVStatus(uvIndex);

  const getSliderPosition = (idx: number) => {
    const percentage = Math.min(100, Math.max(0, (idx / 11) * 100));
    return `${percentage}%`;
  };

  return (
    <div id="home-screen-container" className="flex flex-col gap-3.5">
      {/* UV 게이지 섹션 */}
      <section
        id="uv-gauge-section"
        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center gap-3.5"
      >
        {/* 헤더: 제목 + UV 수치 + 갱신 버튼 */}
        <div id="uv-header" className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#ff9500] fill-[#ff9500] animate-pulse" />
            <span className="text-[12px] font-bold text-gray-400 tracking-wider">현재 자외선 지수</span>
            {loadState === 'loading' && (
              <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
            )}
            {loadState === 'success' && lastUpdated && (
              <span className="text-[9px] text-gray-300 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> {lastUpdated} 기준
              </span>
            )}
            {loadState === 'error' && (
              <span className="text-[9px] text-orange-400">추정값</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* 수동 갱신 버튼 */}
            <button
              onClick={loadUVData}
              disabled={loadState === 'loading'}
              className="p-1 rounded-lg text-gray-400 hover:text-[#8c5000] hover:bg-gray-50 transition-colors disabled:opacity-40"
              title="UV 데이터 갱신"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadState === 'loading' ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-[#8c5000]">{uvIndex}</span>
                <span className="text-[10px] text-gray-400 font-bold">/11</span>
              </div>
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white shadow-sm"
                style={{ backgroundColor: status.color }}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* UV 게이지 (API 기반, 읽기 전용) */}
        <div id="uv-gauge-control" className="relative w-full h-8 flex items-center">
          <div className="absolute inset-x-0 h-2.5 rounded-full overflow-hidden flex shadow-inner">
            <div className="w-[18%] bg-[#FFD600]" title="낮음 (0-2)" />
            <div className="w-[27%] bg-[#fdd404]" title="보통 (3-5)" />
            <div className="w-[18%] bg-[#FF9500]" title="높음 (6-7)" />
            <div className="w-[37%] bg-[#ba1a1a]" title="매우높음 (8-11)" />
          </div>
          <div
            id="uv-slider-thumb"
            className="absolute -translate-x-1/2 flex flex-col items-center z-10 transition-all pointer-events-none"
            style={{ left: getSliderPosition(uvIndex), borderColor: status.color }}
          >
            <div
              className="w-6 h-6 bg-white rounded-full shadow-lg border-4 flex items-center justify-center"
              style={{ borderColor: status.color }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
            </div>
          </div>
        </div>

        <div id="uv-levels-text" className="flex justify-between w-full px-1">
          <span className="text-[10px] font-bold text-gray-400">낮음</span>
          <span className="text-[10px] font-bold text-gray-400">보통</span>
          <span className="text-[10px] font-bold text-gray-400">높음</span>
          <span className="text-[10px] font-bold text-gray-400">매우높음</span>
        </div>

        {/* 경고 배너 */}
        <div
          id="uv-alert-banner"
          className="w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 active:scale-98 transition-transform cursor-pointer"
          style={{
            backgroundColor:
              uvIndex >= 8 ? '#ffdad6' : uvIndex >= 6 ? '#ffeacc' : uvIndex >= 3 ? '#fff9db' : '#eafaf1',
            color:
              uvIndex >= 8 ? '#93000a' : uvIndex >= 6 ? '#8c5000' : uvIndex >= 3 ? '#705d00' : '#1e4620',
          }}
          onClick={() => onNavigate('timer')}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-[11px] font-bold leading-tight truncate">{status.text}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 animate-bounce-horizontal" />
        </div>
      </section>

      {/* 시간대별 UV 예보 (실제 API 데이터) */}
      <section id="hourly-forecast-section" className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-[#8c5000]" />
            시간대별 자외선 지수
          </h3>
          {loadState === 'error' && (
            <span className="text-[9px] text-orange-400 bg-orange-50 px-2 py-0.5 rounded-full font-bold">
              추정값 (오프라인)
            </span>
          )}
          {loadState === 'success' && (
            <span className="text-[9px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">
              실시간
            </span>
          )}
        </div>

        {loadState === 'loading' && hourlyData.length === 0 ? (
          <div className="flex gap-2.5 pb-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center min-w-[56px] bg-white rounded-xl p-2 border border-gray-100 shadow-sm shrink-0 animate-pulse"
              >
                <div className="h-3 w-8 bg-gray-200 rounded mb-1.5" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200 my-1.5" />
                <div className="h-3 w-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div
            id="hourly-forecast-scroll"
            className="flex overflow-x-auto gap-2.5 pb-1 scrollbar-hide snap-x"
          >
            {(hourlyData.length > 0 ? hourlyData : getMockUVData().hourlyData).map((data, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center min-w-[56px] bg-white rounded-xl p-2 border border-gray-100 shadow-sm snap-start shrink-0"
              >
                <span className="text-[11px] font-bold text-gray-400">{data.hour}</span>
                <div
                  className="w-2.5 h-2.5 rounded-full my-1.5 border border-white shadow-sm"
                  style={{
                    backgroundColor:
                      data.uvIndex >= 8
                        ? '#ba1a1a'
                        : data.uvIndex >= 6
                        ? '#FF9500'
                        : data.uvIndex >= 3
                        ? '#FFD600'
                        : '#e1e3e4',
                  }}
                />
                <span className="text-xs font-black text-gray-800">{data.uvIndex}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 대시보드 위젯 (2열 그리드) */}
      <section id="dashboard-widgets-section" className="grid grid-cols-2 gap-3.5">
        {/* 날씨 위젯 */}
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

        {/* 피부 MBTI 숏컷 */}
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
            <p className="text-[9px] text-[#554600]/80 leading-tight">맞춤 자외선 차단 추천 받기</p>
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
