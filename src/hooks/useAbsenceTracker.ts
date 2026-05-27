/**
 * 얼타지마 부재 추적 훅 (듀오링고 스타일)
 *
 * 부재 레벨:
 *  0 = 정상 (2시간 미만)    → stage0.png (쿨한 태양 😎)
 *  1 = 1단계 (2~5시간)     → stage1.jpg
 *  2 = 2단계 (5~7시간)     → stage2.jpg
 *  3 = 4단계 (7시간+)      → stage3.jpg
 */
import { useState, useEffect } from 'react';

export type AbsenceLevel = 0 | 1 | 2 | 3;

const TWO_HOURS   = 2 * 60 * 60 * 1000;
const FIVE_HOURS  = 5 * 60 * 60 * 1000;
const SEVEN_HOURS = 7 * 60 * 60 * 1000;

export const STAGE_ICONS: Record<AbsenceLevel, string> = {
  0: '/icons/stage0.png',   // 쿨한 태양 - 기본(0단계) 아이콘
  1: '/icons/stage1.jpg',
  2: '/icons/stage2.jpg',
  3: '/icons/stage3.jpg',
};

export const STAGE_INFO: Record<
  AbsenceLevel,
  { emoji: string; title: string; body: string; color: string } | null
> = {
  0: null,
  1: {
    emoji: '😟',
    title: '2시간 만에 돌아오셨군요!',
    body: '피부가 걱정됐어요. 선크림 재도포 시간을 확인해보세요.',
    color: '#FF9500',
  },
  2: {
    emoji: '😫',
    title: '벌써 5시간이나 지났어요!',
    body: '자외선이 피부를 공격하고 있어요. 지금 바로 선크림을 바르고 관리를 시작하세요!',
    color: '#e07000',
  },
  3: {
    emoji: '🚨',
    title: '피부 긴급 경보!',
    body: '7시간 동안 얼타지마를 안 여셨어요. 지금 즉시 피부를 점검하고 선크림을 재도포하세요!',
    color: '#ba1a1a',
  },
};

/** 경과 시간으로 부재 레벨 계산 */
export function calcAbsenceLevel(lastVisitMs: number): AbsenceLevel {
  const elapsed = Date.now() - lastVisitMs;
  if (elapsed >= SEVEN_HOURS) return 3;
  if (elapsed >= FIVE_HOURS)  return 2;
  if (elapsed >= TWO_HOURS)   return 1;
  return 0;
}

/** 파비콘을 스테이지 아이콘으로 변경 */
function applyFavicon(iconUrl: string) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 원형 클립
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 0, 0, 32, 32);

    const dataUrl = canvas.toDataURL('image/png');
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }
    link.href = dataUrl;
  };
  img.src = iconUrl;
}

/** Service Worker 등록 + 알림 스케줄링 */
async function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    // 기존 SW가 있으면 재사용
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    console.log('[AbsenceTracker] SW registered:', reg.scope);

    // 알림 권한 요청
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.warn('[AbsenceTracker] Notifications not permitted');
      return;
    }

    // SW가 활성화될 때까지 대기 후 메시지 전송
    const sendSchedule = (target: ServiceWorker) => {
      target.postMessage({
        type: 'SCHEDULE_NOTIFICATIONS',
        notifications: [
          {
            delay: TWO_HOURS,
            title: '피부가 걱정돼요 😟',
            body: '2시간 동안 얼타지마를 안 여셨어요. 선크림 재도포 잊지 마세요!',
            icon: '/icons/stage1.jpg',
            tag: 'absence-2h',
          },
          {
            delay: FIVE_HOURS,
            title: '선크림 잊으셨나요? 😫',
            body: '5시간이나 지났어요! 자외선이 피부를 공격하고 있어요.',
            icon: '/icons/stage2.jpg',
            tag: 'absence-5h',
          },
          {
            delay: SEVEN_HOURS,
            title: '🚨 피부 긴급 경보!',
            body: '7시간 동안 얼타지마를 방치하셨어요! 지금 바로 확인하세요!',
            icon: '/icons/stage3.jpg',
            tag: 'absence-7h',
          },
        ],
      });
    };

    if (reg.active) {
      sendSchedule(reg.active);
    } else {
      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        if (installing) {
          installing.addEventListener('statechange', () => {
            if (installing.state === 'activated') {
              sendSchedule(installing);
            }
          });
        }
      });
    }

    // controller가 있으면 바로 전송
    if (navigator.serviceWorker.controller) {
      sendSchedule(navigator.serviceWorker.controller);
    }
  } catch (e) {
    console.warn('[AbsenceTracker] SW setup failed:', e);
  }
}

const SESSION_LEVEL_KEY = 'ultagima_session_level';

/** 메인 훅 */
export function useAbsenceTracker() {
  const [absenceLevel, setAbsenceLevel] = useState<AbsenceLevel>(0);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // React StrictMode는 개발 환경에서 effect를 두 번 실행합니다.
    // 첫 번째 실행 시 localStorage를 현재 시간으로 덮어쓰므로,
    // sessionStorage에 이번 세션에서 계산한 레벨을 저장해 두 번째 실행에서 복원합니다.
    const savedSessionLevel = sessionStorage.getItem(SESSION_LEVEL_KEY);
    if (savedSessionLevel !== null) {
      // 두 번째 실행 (StrictMode remount) → 이미 계산된 레벨 복원
      const level = parseInt(savedSessionLevel, 10) as AbsenceLevel;
      applyFavicon(STAGE_ICONS[level]); // 0단계도 포함해서 항상 favicon 적용
      if (level > 0) {
        setAbsenceLevel(level);
        setShowBanner(true);
      }
      return;
    }

    const lastStr = localStorage.getItem('ultagima_lastVisit');
    const now = Date.now();
    let level: AbsenceLevel = 0;

    if (lastStr) {
      const lastMs = parseInt(lastStr, 10);
      if (!isNaN(lastMs)) {
        level = calcAbsenceLevel(lastMs);
        setAbsenceLevel(level);
        if (level > 0) setShowBanner(true);
      }
    }

    // 레벨에 관계없이 항상 favicon 적용 (0단계 = stage0.png)
    applyFavicon(STAGE_ICONS[level]);

    // 이번 세션의 레벨을 sessionStorage에 저장 (StrictMode 두 번째 실행 대비)
    sessionStorage.setItem(SESSION_LEVEL_KEY, level.toString());

    // 현재 방문 시간 저장
    localStorage.setItem('ultagima_lastVisit', now.toString());

    // Service Worker + 알림 초기화
    initServiceWorker();
  }, []);

  const dismissBanner = () => setShowBanner(false);

  return { absenceLevel, showBanner, dismissBanner };
}
