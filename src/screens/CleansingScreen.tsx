/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle, Droplets, Moon, ShieldCheck, Sparkles, Sun, Waves } from 'lucide-react';
import { Screen } from '../types';
import { CleansingRoutine, generateCleansingRoutine, SkinTypeDetail, skinTypeData } from '../data/skinTypeData';

interface CleansingScreenProps {
  onNavigate: (screen: Screen) => void;
}

const STORAGE_KEYS = {
  SKIN_TYPE_CODE: 'skinTypeCode',
  SKIN_TYPE_DETAIL: 'skinTypeDetail',
};

export default function CleansingScreen({ onNavigate }: CleansingScreenProps) {
  const [skinTypeCode, setSkinTypeCode] = useState<string | null>(null);
  const [skinTypeDetail, setSkinTypeDetail] = useState<SkinTypeDetail | null>(null);
  const [cleansingRoutine, setCleansingRoutine] = useState<CleansingRoutine | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'morning' | 'evening' | 'caution'>('all');

  const loadSkinTypeForCleansing = () => {
    const code = window.localStorage.getItem(STORAGE_KEYS.SKIN_TYPE_CODE);
    const rawDetail = window.localStorage.getItem(STORAGE_KEYS.SKIN_TYPE_DETAIL);
    let detail: SkinTypeDetail | null = null;

    if (rawDetail) {
      try {
        detail = JSON.parse(rawDetail) as SkinTypeDetail;
      } catch {
        detail = code ? skinTypeData[code] ?? null : null;
      }
    } else if (code) {
      detail = skinTypeData[code] ?? null;
    }

    setSkinTypeCode(code);
    setSkinTypeDetail(detail);

    const routine = code ? generateCleansingRoutine(code) : null;
    setCleansingRoutine(routine);

    console.log('Cleansing tab loaded skinTypeCode:', code);
    console.log('Cleansing tab loaded skinTypeDetail:', detail);
    console.log('Current skin type for cleansing:', code);
    console.log('Generated cleansing routine:', routine);
  };

  useEffect(() => {
    loadSkinTypeForCleansing();
  }, []);

  const hasSavedSkinType = Boolean(skinTypeCode && skinTypeDetail);
  const cleansingCards = useMemo(() => {
    if (!skinTypeDetail || !cleansingRoutine) return [];

    return [
      {
        id: 'morning',
        title: cleansingRoutine.morning.title,
        description: cleansingRoutine.morning.description,
        tips: cleansingRoutine.morning.points,
        tag: '아침 관리',
        icon: Sun,
        accentClass: 'bg-[#fff8df] border-[#ffe8a8]',
        iconClass: 'bg-[#fdd404] text-[#8c5000]',
        helperIcon: Droplets,
      },
      {
        id: 'evening',
        title: cleansingRoutine.evening.title,
        description: cleansingRoutine.evening.description,
        tips: cleansingRoutine.evening.points,
        tag: '선크림 제거',
        icon: Moon,
        accentClass: 'bg-[#fbf4ea] border-[#ead8c4]',
        iconClass: 'bg-[#8c5000] text-white',
        helperIcon: Waves,
      },
      {
        id: 'caution',
        title: cleansingRoutine.caution.title,
        description: cleansingRoutine.caution.description,
        tips: cleansingRoutine.caution.points,
        tag: '주의',
        icon: AlertTriangle,
        accentClass: 'bg-[#fff0ea] border-[#ffd7c7]',
        iconClass: 'bg-[#ff9500] text-white',
        helperIcon: ShieldCheck,
      },
    ] as const;
  }, [skinTypeDetail, cleansingRoutine]);

  const filteredCards = cleansingCards.filter(
    (card) => activeCategory === 'all' || card.id === activeCategory
  );

  return (
    <div id="cleansing-screen-container" className="flex flex-col gap-6 max-w-md mx-auto pb-36">
      {hasSavedSkinType ? (
        <>
          <section id="cleansing-banner" className="bg-[#ff9500] rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-1 text-white">
              <p className="text-sm font-bold opacity-90">{skinTypeCode} 맞춤 세안법</p>
              <p className="text-xs opacity-80 leading-relaxed">
                사용자의 {skinTypeCode} 타입을 분석하여<br />
                피부 자극을 줄이는 세안 루틴을 추천해 드립니다.
              </p>
            </div>
          </section>

          <section id="cleansing-category-filter" className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {([
              { id: 'all', label: '전체' },
              { id: 'morning', label: '아침 세안' },
              { id: 'evening', label: '저녁 세안' },
              { id: 'caution', label: '주의사항' },
            ] as const).map((category) => {
              const isSelected = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#8c5000] text-white shadow-sm'
                      : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </section>

          <section id="cleansing-summary-section" className="flex flex-col gap-5">
            <div className="flex justify-between items-center px-1 border-b border-gray-100 pb-2">
              <h2 className="text-lg font-bold text-gray-800">맞춤 세안 카드</h2>
              <span className="text-xs font-bold bg-[#ffdbc9] text-[#934b19] px-3 py-1 rounded-full">
                {skinTypeCode} 루틴
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#fff3db] text-[#ff9500] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-800">{skinTypeCode} 피부 타입 요약</p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">{skinTypeDetail.summary}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {filteredCards.map((card) => {
                const Icon = card.icon;
                const HelperIcon = card.helperIcon;
                return (
                  <article
                    key={card.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#ffe171] transition-all flex flex-col"
                  >
                    <div className="p-5 flex flex-col gap-4">
                      {card.id !== 'caution' && (
                        <div className={`rounded-2xl border ${card.accentClass} p-4 flex items-center justify-between overflow-hidden`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl ${card.iconClass} flex items-center justify-center shadow-sm`}>
                              <Icon className="w-7 h-7" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <Droplets className="w-3.5 h-3.5 text-[#ff9500]" />
                                <Waves className="w-4 h-4 text-[#8c5000]" />
                              </div>
                              <span className="text-[10px] font-black text-[#8c5000]">
                                {skinTypeCode} 맞춤
                              </span>
                            </div>
                          </div>
                          <div className="w-11 h-11 rounded-full bg-white/80 border border-white flex items-center justify-center text-[#8c5000]">
                            <HelperIcon className="w-5 h-5" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            card.id === 'caution' ? 'bg-[#fff0ea] text-[#8c5000]' : 'bg-[#fff3db] text-[#ff9500]'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-800">{card.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium mt-1">
                              {card.description}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-[10px] font-black bg-[#ffdbc9] text-[#934b19] px-2.5 py-1 rounded-full">
                          {card.tag}
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-3 flex flex-col gap-2.5">
                        {card.tips.map((tip, index) => (
                          <div key={`${card.id}-${index}`} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-[#ff9500] shrink-0 mt-0.5" />
                            <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <>
          <section id="cleansing-empty-banner" className="bg-[#ff9500] rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-1 text-white">
              <p className="text-sm font-bold opacity-90">맞춤 세안법</p>
              <p className="text-xs opacity-80 leading-relaxed">
                피부 타입을 설정하면<br />
                내 피부에 맞는 세안 루틴을 추천해 드립니다.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-[#fff3db] text-[#ff9500] flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-800">
                아직 피부 타입이 설정되지 않았어요.
              </h2>
              <p className="mt-2 text-sm font-semibold text-gray-500 leading-relaxed">
                피부 설정 탭에서 피부 타입을 먼저 선택하면 맞춤 세안법을 추천해드려요.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('survey')}
              className="w-full bg-[#ff9500] text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#8c5000] transition-colors shadow-lg shadow-[#ff9500]/20 font-black"
            >
              피부 타입 설정하러 가기
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        </>
      )}
    </div>
  );
}
