/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Screen } from '../types';
import { generateCleansingRoutine, skinTypeData } from '../data/skinTypeData';

interface SurveyScreenProps {
  onNavigate: (screen: Screen) => void;
  setUserSkinType: (type: string) => void;
}

const STORAGE_KEYS = {
  MOISTURE_TYPE: 'moistureType',
  SENSITIVITY_TYPE: 'sensitivityType',
  PIGMENT_TYPE: 'pigmentType',
  WRINKLE_TYPE: 'wrinkleType',
  SKIN_TYPE_CODE: 'skinTypeCode',
  SKIN_TYPE_DETAIL: 'skinTypeDetail',
};

const STEP_STORAGE_KEYS: Record<number, string> = {
  1: STORAGE_KEYS.MOISTURE_TYPE,
  2: STORAGE_KEYS.SENSITIVITY_TYPE,
  3: STORAGE_KEYS.PIGMENT_TYPE,
  4: STORAGE_KEYS.WRINKLE_TYPE,
};

export default function SurveyScreen({ onNavigate, setUserSkinType }: SurveyScreenProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const surveySteps = [
    {
      id: 1,
      title: '유수분 밸런스',
      question: '피부가 건조한 편인가요, 피지가 많은 편인가요?',
      options: [
        { code: 'D', name: '건성', english: 'Dry' },
        { code: 'O', name: '지성', english: 'Oily' },
      ],
    },
    {
      id: 2,
      title: '피부 민감도',
      question: '피부가 자극에 민감한 편인가요?',
      options: [
        { code: 'S', name: '민감성', english: 'Sensitive' },
        { code: 'R', name: '저항성', english: 'Resistant' },
      ],
    },
    {
      id: 3,
      title: '색소 고민',
      question: '기미, 잡티, 색소침착이 잘 생기는 편인가요?',
      options: [
        { code: 'P', name: '색소성', english: 'Pigmented' },
        { code: 'N', name: '비색소성', english: 'Non-Pigmented' },
      ],
    },
    {
      id: 4,
      title: '주름/탄력',
      question: '잔주름이나 탄력 저하가 고민인가요?',
      options: [
        { code: 'W', name: '주름', english: 'Wrinkled' },
        { code: 'T', name: '탄탄함', english: 'Tight' },
      ],
    },
  ];

  const selectedCodes = surveySteps.map((step) => answers[step.id] ?? '-');
  const completedCount = selectedCodes.filter((code) => code !== '-').length;
  const isComplete = completedCount === surveySteps.length;
  const skinTypeCode = selectedCodes.join('');
  const currentSelectionCode = isComplete ? skinTypeCode : selectedCodes.join(' ');

  const selectionLabels: Record<string, string> = {
    D: '건성',
    O: '지성',
    S: '민감성',
    R: '저항성',
    P: '색소성',
    N: '비색소성',
    W: '주름',
    T: '탄탄함',
  };

  const selectionDescriptions: Record<string, string> = {
    D: '수분과 유분이 부족해 당김과 건조함을 느끼기 쉬운 타입',
    O: '피지 분비가 많아 번들거림과 모공 고민이 생기기 쉬운 타입',
    S: '외부 자극에 쉽게 붉어지거나 따가움을 느끼기 쉬운 타입',
    R: '피부 장벽이 비교적 안정적이고 자극에 강한 타입',
    P: '기미, 잡티, 색소침착이 생기기 쉬운 타입',
    N: '눈에 띄는 색소 고민은 적지만 기본 자외선 차단은 필요한 타입',
    W: '잔주름이나 탄력 저하가 고민되기 쉬운 타입',
    T: '탄력이 비교적 좋고 주름 고민이 적은 타입',
  };

  const selectedDescriptions = selectedCodes.filter((code) => code !== '-');

  const skinTypeDetail = useMemo(() => {
    return selectedCodes
      .filter((code) => code !== '-')
      .map((code) => selectionLabels[code])
      .join(' · ');
  }, [selectedCodes]);

  const saveSkinSelection = (nextAnswers: Record<number, string>) => {
    const moistureType = nextAnswers[1];
    const sensitivityType = nextAnswers[2];
    const pigmentType = nextAnswers[3];
    const wrinkleType = nextAnswers[4];
    const nextSkinTypeCode = [moistureType, sensitivityType, pigmentType, wrinkleType].join('');
    const hasCompleteSelection = Boolean(moistureType && sensitivityType && pigmentType && wrinkleType);

    Object.entries(STEP_STORAGE_KEYS).forEach(([stepId, storageKey]) => {
      const value = nextAnswers[Number(stepId)];
      if (value) {
        window.localStorage.setItem(storageKey, value);
      }
    });

    if (hasCompleteSelection) {
      const nextSkinTypeDetail = [moistureType, sensitivityType, pigmentType, wrinkleType]
        .map((code) => selectionLabels[code])
        .join(' · ');
      const nextSkinTypeData = skinTypeData[nextSkinTypeCode];
      const detailToSave = {
        ...(nextSkinTypeData ?? { code: nextSkinTypeCode, summary: nextSkinTypeDetail }),
        cleansingRoutine: generateCleansingRoutine(nextSkinTypeCode),
      };

      window.localStorage.setItem(STORAGE_KEYS.SKIN_TYPE_CODE, nextSkinTypeCode);
      window.localStorage.setItem(
        STORAGE_KEYS.SKIN_TYPE_DETAIL,
        JSON.stringify(detailToSave)
      );
      setUserSkinType(nextSkinTypeCode);
    }

    console.log('Saved skin selection:', {
      moistureType,
      sensitivityType,
      pigmentType,
      wrinkleType,
      skinTypeCode: hasCompleteSelection ? nextSkinTypeCode : undefined,
    });
  };

  const loadSavedSkinSelection = () => {
    const savedAnswers: Record<number, string> = {};
    const moistureType = window.localStorage.getItem(STORAGE_KEYS.MOISTURE_TYPE) ?? undefined;
    const sensitivityType = window.localStorage.getItem(STORAGE_KEYS.SENSITIVITY_TYPE) ?? undefined;
    const pigmentType = window.localStorage.getItem(STORAGE_KEYS.PIGMENT_TYPE) ?? undefined;
    const wrinkleType = window.localStorage.getItem(STORAGE_KEYS.WRINKLE_TYPE) ?? undefined;
    const savedSkinTypeCode = window.localStorage.getItem(STORAGE_KEYS.SKIN_TYPE_CODE) ?? undefined;

    if (moistureType) savedAnswers[1] = moistureType;
    if (sensitivityType) savedAnswers[2] = sensitivityType;
    if (pigmentType) savedAnswers[3] = pigmentType;
    if (wrinkleType) savedAnswers[4] = wrinkleType;

    setAnswers(savedAnswers);

    if (savedSkinTypeCode) {
      setUserSkinType(savedSkinTypeCode);
    }

    console.log('Loaded skin selection:', {
      moistureType,
      sensitivityType,
      pigmentType,
      wrinkleType,
      skinTypeCode: savedSkinTypeCode,
    });
  };

  useEffect(() => {
    loadSavedSkinSelection();
  }, []);

  const handleSelectOption = (stepId: number, code: string) => {
    setAnswers(prev => {
      const nextAnswers = { ...prev, [stepId]: code };
      saveSkinSelection(nextAnswers);
      return nextAnswers;
    });
  };

  const handleSubmit = () => {
    if (!isComplete) return;

    saveSkinSelection(answers);
    setUserSkinType(skinTypeCode);
    window.localStorage.setItem(STORAGE_KEYS.SKIN_TYPE_CODE, skinTypeCode);
    window.localStorage.setItem(
      STORAGE_KEYS.SKIN_TYPE_DETAIL,
      JSON.stringify({
        ...(skinTypeData[skinTypeCode] ?? { code: skinTypeCode, summary: skinTypeDetail }),
        cleansingRoutine: generateCleansingRoutine(skinTypeCode),
      })
    );
    window.alert('피부 타입이 저장되었어요.');
    onNavigate('recommend');
  };

  return (
    <div id="survey-screen-container" className="max-w-md mx-auto">
      <div id="survey-title-row" className="flex justify-between items-end border-b border-gray-100 pb-2">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-[#ff9500]" />
          피부 MBTI 설문
        </h1>
        <span className="text-sm font-bold text-[#8c5000]">{completedCount}/4</span>
      </div>

      <p className="mt-2 text-xs font-semibold text-gray-500 leading-relaxed">
        4가지 기준을 선택하면 나에게 맞는 선크림과 세안법을 추천해드려요.
      </p>

      <div className="mt-3 grid grid-cols-4 gap-2" aria-label="피부 MBTI 선택 진행 상태">
        {surveySteps.map((step) => {
          const isDone = Boolean(answers[step.id]);
          return (
            <div
              key={step.id}
              className={`h-2.5 rounded-full transition-colors ${isDone ? 'bg-[#ff9500]' : 'bg-gray-200'}`}
            />
          );
        })}
      </div>

      <div id="survey-scroll-content" className="mt-4 flex flex-col gap-2 pb-36">
        {surveySteps.map((step) => {
          return (
            <section
              key={step.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2.5 flex flex-col gap-1.5"
            >
              <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] items-center gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-[#fff3db] px-2 py-0.5 text-[10px] font-black text-[#8c5000]">
                      STEP {step.id}
                    </span>
                    {answers[step.id] && (
                      <span className="h-4 w-4 shrink-0 rounded-full bg-[#ff9500] text-white flex items-center justify-center shadow-sm shadow-[#ff9500]/25">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1 text-sm font-black text-gray-800 leading-tight">{step.title}</h2>
                  <p className="mt-1 text-[10px] font-semibold text-gray-500 leading-snug">
                    {step.question}
                  </p>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-1.5">
                  {step.options.map((option, optionIndex) => {
                    const isSelected = answers[step.id] === option.code;
                    return (
                      <React.Fragment key={option.code}>
                        {optionIndex === 1 && (
                          <div className="flex items-center justify-center">
                            <span className="text-[9px] font-black text-[#8c5000] bg-[#fff8e8] border border-[#ffe1a8] rounded-full px-1.5 py-0.5">
                              VS
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSelectOption(step.id, option.code)}
                          className={`min-h-[58px] rounded-xl border px-1.5 py-1.5 text-center active:scale-[0.98] transition-all ${
                            isSelected
                              ? 'bg-[#ff9500] border-[#ff9500] text-white shadow-md shadow-[#ff9500]/25'
                              : 'bg-[#fbf9f6] border-gray-200 text-gray-700 hover:bg-white hover:border-[#ffd08a]'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <span className={`block text-lg font-black leading-none ${isSelected ? 'text-white' : 'text-[#8c5000]'}`}>
                            {option.code}
                          </span>
                          <span className="mt-1 block text-[10px] font-black leading-tight">{option.name}</span>
                          <span className={`block text-[8px] font-bold leading-tight ${isSelected ? 'text-white/85' : 'text-gray-400'}`}>
                            {option.english}
                          </span>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}

        <div className="bg-[#fffdf5] border border-[#ffe6b8] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xs font-black text-gray-700">현재 선택</h3>
              <p className="mt-1 text-[10px] font-semibold text-gray-400">
                선택한 피부 특성을 바로 확인해요.
              </p>
            </div>
            <span className="shrink-0 text-base font-black tracking-[0.18em] text-[#8c5000]">
              {currentSelectionCode}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {selectedDescriptions.length > 0 ? (
              selectedDescriptions.map((code) => (
                <div key={code} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded-full bg-[#fff3db] border border-[#ffe1a8] px-2 py-0.5 text-[10px] font-black text-[#8c5000]">
                    {code} {selectionLabels[code]}
                  </span>
                  <p className="text-[11px] font-semibold text-gray-500 leading-snug">
                    {selectionDescriptions[code]}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[11px] font-semibold text-gray-400 leading-relaxed">
                아직 선택되지 않았어요.
              </p>
            )}
          </div>
        </div>

        <button
          id="btn-survey-result"
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-black ${
            isComplete
              ? 'bg-[#ff9500] text-white hover:bg-[#8c5000] shadow-lg shadow-[#ff9500]/20 active:scale-[0.99]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          결과 확인하기
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
