/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen } from './types';
import Header from './components/Header';
import Navigation from './components/Navigation';

import HomeScreen from './screens/HomeScreen';
import TimerScreen from './screens/TimerScreen';
import SurveyScreen from './screens/SurveyScreen';
import RecommendScreen from './screens/RecommendScreen';
import CleansingScreen from './screens/CleansingScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [lastScreen, setLastScreen] = useState<Screen>('home');
  const [uvIndex, setUvIndex] = useState<number>(8); // default index 8
  const [userSkinType, setUserSkinType] = useState<string>(() => {
    return window.localStorage.getItem('skinTypeCode') ?? 'DSPW';
  }); // default skin type
  const [transitionType, setTransitionType] = useState<'none' | 'push'>('none');

  // Custom Navigation function with transitions mapping specifications
  const handleNavigate = (targetScreen: Screen) => {
    setLastScreen(currentScreen);
    
    // Spec: "피부 MBTI 설문" -> "맞춤 추천" (결과 확인하기 클릭 시) 이동은 push transition
    if (currentScreen === 'survey' && targetScreen === 'recommend') {
      setTransitionType('push');
    } else {
      setTransitionType('none');
    }

    setCurrentScreen(targetScreen);
  };

  // Screen animation variant configurations
  const getVariants = () => {
    if (transitionType === 'push') {
      return {
        initial: { x: '100vw', opacity: 0.8 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '-100vw', opacity: 0.8 },
      };
    }
    // No transition defaults
    return {
      initial: { x: 0, opacity: 1 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 0, opacity: 1 },
    };
  };

  const currentVariants = getVariants();

  return (
    <div 
      id="app-root-container"
      className="bg-[#f8f9fa] min-h-screen text-gray-800 flex flex-col relative pb-32 max-w-md mx-auto shadow-xl border-x border-gray-100/50 overflow-hidden"
    >
      {/* Visual Header */}
      <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Main Container Layer */}
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
              <HomeScreen 
                onNavigate={handleNavigate} 
                uvIndex={uvIndex} 
                setUvIndex={setUvIndex} 
              />
            )}
            {currentScreen === 'timer' && (
              <TimerScreen uvIndex={uvIndex} />
            )}
            {currentScreen === 'survey' && (
              <SurveyScreen 
                onNavigate={handleNavigate} 
                setUserSkinType={setUserSkinType} 
              />
            )}
            {currentScreen === 'recommend' && (
              <RecommendScreen 
                onNavigate={handleNavigate} 
                userSkinType={userSkinType} 
              />
            )}
            {currentScreen === 'cleansing' && (
              <CleansingScreen onNavigate={handleNavigate} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigator */}
      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  );
}
