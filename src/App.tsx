/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen } from './types';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AbsenceBanner from './components/AbsenceBanner';
import { useAbsenceTracker } from './hooks/useAbsenceTracker';

import HomeScreen from './screens/HomeScreen';
import TimerScreen from './screens/TimerScreen';
import SurveyScreen from './screens/SurveyScreen';
import RecommendScreen from './screens/RecommendScreen';
import CleansingScreen from './screens/CleansingScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [uvIndex, setUvIndex] = useState<number>(0);
  const [userSkinType, setUserSkinType] = useState<string>(() => {
    return window.localStorage.getItem('skinTypeCode') ?? 'DSPW';
  });
  const [transitionType, setTransitionType] = useState<'none' | 'push'>('none');

  // 부재 추적 (듀오링고 스타일)
  const { absenceLevel, showBanner, dismissBanner } = useAbsenceTracker();

  // 화면 전환
  const handleNavigate = (targetScreen: Screen) => {
    if (currentScreen === 'survey' && targetScreen === 'recommend') {
      setTransitionType('push');
    } else {
      setTransitionType('none');
    }
    setCurrentScreen(targetScreen);
  };

  const getVariants = () => {
    if (transitionType === 'push') {
      return {
        initial: { x: '100vw', opacity: 0.8 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100vw', opacity: 0.8 },
      };
    }
    return {
      initial: { x: 0, opacity: 1 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 0, opacity: 1 },
    };
  };

  const currentVariants = getVariants();

  return (
    <>
      {/* 부재 복귀 배너 (듀오링고 스타일) */}
      {showBanner && <AbsenceBanner level={absenceLevel} onDismiss={dismissBanner} />}

      <div
        id="app-root-container"
        className="bg-[#f8f9fa] min-h-screen text-gray-800 flex flex-col relative pb-32 max-w-md mx-auto shadow-xl border-x border-gray-100/50 overflow-hidden"
      >
        {/* 헤더 (부재 레벨 반영) */}
        <Header currentScreen={currentScreen} onNavigate={handleNavigate} absenceLevel={absenceLevel} />

        {/* 메인 컨텐츠 */}
        <main id="app-main-content" className="flex-1 px-5 pt-3 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              variants={currentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', duration: transitionType === 'push' ? 0.35 : 0 }}
              className="w-full h-full"
            >
              {currentScreen === 'home' && (
                <HomeScreen onNavigate={handleNavigate} uvIndex={uvIndex} setUvIndex={setUvIndex} />
              )}
              {currentScreen === 'timer' && <TimerScreen uvIndex={uvIndex} />}
              {currentScreen === 'survey' && (
                <SurveyScreen onNavigate={handleNavigate} setUserSkinType={setUserSkinType} />
              )}
              {currentScreen === 'recommend' && (
                <RecommendScreen onNavigate={handleNavigate} userSkinType={userSkinType} />
              )}
              {currentScreen === 'cleansing' && <CleansingScreen onNavigate={handleNavigate} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 하단 플로팅 네비게이션 */}
        <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      </div>
    </>
  );
}
