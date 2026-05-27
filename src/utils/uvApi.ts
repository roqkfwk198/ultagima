/**
 * Open-Meteo UV 데이터 유틸리티
 * - API Key 불필요 (완전 무료)
 * - 현재 UV 지수 + 시간대별 예보 제공
 */

import { UVHourData } from '../types';

export interface UVApiResult {
  currentUVIndex: number;
  hourlyData: UVHourData[];
  locationName?: string;
}

/** UV 지수에 따른 색상 반환 */
function getUVColor(uv: number): string {
  if (uv <= 2) return '#e1e3e4';
  if (uv <= 5) return '#ffe171';
  if (uv <= 7) return '#FFD600';
  if (uv <= 9) return '#FF9500';
  return '#ba1a1a';
}

/** 브라우저 Geolocation API로 위치 가져오기 (실패 시 서울 기본값) */
export async function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 37.5665, lon: 126.978 }); // 서울
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve({ lat: 37.5665, lon: 126.978 }), // 거부 시 서울
      { timeout: 6000, maximumAge: 5 * 60 * 1000 }
    );
  });
}

/** Open-Meteo API에서 UV 지수 데이터 가져오기 */
export async function fetchUVData(lat: number, lon: number): Promise<UVApiResult> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat.toFixed(4));
  url.searchParams.set('longitude', lon.toFixed(4));
  url.searchParams.set('current', 'uv_index');
  url.searchParams.set('hourly', 'uv_index');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '1');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);

  const data = await res.json();

  const currentUVIndex = Math.round(data.current?.uv_index ?? 0);

  const times: string[] = data.hourly?.time ?? [];
  const uvValues: number[] = data.hourly?.uv_index ?? [];

  const now = new Date();
  const currentHour = now.getHours();
  // 야간(20시 이후)이면 오늘 전체(6~20시) 데이터 표시, 낮이면 현재~20시
  const fromHour = currentHour >= 20 ? 6 : Math.max(currentHour, 6);

  // 오늘 날짜만, fromHour~20시 범위 필터링
  const hourlyData: UVHourData[] = times
    .map((timeStr, i) => {
      const d = new Date(timeStr);
      return { d, uvIndex: Math.max(0, Math.round(uvValues[i])) };
    })
    .filter(({ d }) => {
      const isSameDay =
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate();
      return isSameDay && d.getHours() >= fromHour && d.getHours() <= 20;
    })
    .slice(0, 10)
    .map(({ d, uvIndex }) => ({
      hour: `${d.getHours()}시`,
      uvIndex,
      bgColor: getUVColor(uvIndex),
    }));

  return { currentUVIndex, hourlyData };
}

/** 폴백용 목 데이터 (API 실패 시) */
export function getMockUVData(): UVApiResult {
  const now = new Date();
  const h = now.getHours();

  const allHours = [
    { hour: '9시', uvIndex: 4, bgColor: '#ffe171' },
    { hour: '10시', uvIndex: 6, bgColor: '#FFD600' },
    { hour: '11시', uvIndex: 8, bgColor: '#FF9500' },
    { hour: '12시', uvIndex: 10, bgColor: '#FF9500' },
    { hour: '13시', uvIndex: 11, bgColor: '#ba1a1a' },
    { hour: '14시', uvIndex: 9, bgColor: '#FF9500' },
    { hour: '15시', uvIndex: 7, bgColor: '#FFD600' },
    { hour: '16시', uvIndex: 5, bgColor: '#ffe171' },
    { hour: '17시', uvIndex: 3, bgColor: '#ffe171' },
    { hour: '18시', uvIndex: 1, bgColor: '#e1e3e4' },
    { hour: '19시', uvIndex: 0, bgColor: '#e1e3e4' },
    { hour: '20시', uvIndex: 0, bgColor: '#e1e3e4' },
  ];

  const hourlyData = allHours.filter((_, i) => i + 9 >= h).slice(0, 10);
  const nowHourData = allHours.find((_, i) => i + 9 === h);
  const currentUVIndex = nowHourData?.uvIndex ?? 0;

  return { currentUVIndex, hourlyData };
}
