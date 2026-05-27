/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, HelpCircle } from 'lucide-react';
import { Screen, Product } from '../types';

interface RecommendScreenProps {
  onNavigate: (screen: Screen) => void;
  userSkinType: string;
}

export default function RecommendScreen({ onNavigate, userSkinType }: RecommendScreenProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'suncare' | 'cleansing'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Triggering visual Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Static product list matching design specifications
  const products: Product[] = [
    {
      id: 'prod1',
      name: '모이스처라이징 선 크림',
      description: '건성 피부를 위한 수분 잠금 보호막. 백탁 현상 없이 투명하게 밀착됩니다.',
      price: 28000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN4TG2bgjFRmd4Uz0MGNUj7fqlSaaHN85FeTE7jXDW8CXDxOBWPIR6Nv6PctwUBeTPahkSBytvT7TBk8UjgdlhieuryKqZ4mt99IsAmWoKS9NraH33JRS6s1Isfz2Zd1UQZKbDROMZSpn0gOBUsE6_mCUiIxYtLEd0TZD9euhAwHwTUD498XFnZtjIZk__5zwZTTa4EU3zheUrQiVScrN6QsdhmsmvwhpIUuHL364Cb7hmCQLp8Q7O0epNT3_XLKv_2Pj4Mf6NvTr7',
      category: 'suncare',
      best: true,
      tag: 'DSPW 추천',
    },
    {
      id: 'prod2',
      name: '수딩 선 스틱',
      description: '민감한 부위에도 자극 없이. 덧바르기 쉬운 휴대용 진정 선케어 솔루션.',
      price: 22500,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK8DDZwLr0N6fTfT0zoEHUDhHizwIYiCeSCl1Ie885lfQjztfKbi8yZb7Z_blWGF4LTe5Ak4mTiJ7nbiuji-Ipp2Aasumb522NZz5UWqct13rp0UortAt9UPTyuHX-m5JfNPxYI0Iuo3ITvS9gZKcSb1Vu3fvhOigSMmhASf-KXe1fB516ZEYaHGMMUTRjppSKtCF_htMQxqMFIUtQ2dtOyfYVbXFKhtFK1wqNqOQbGV2NTENcjaiSdFWc9O-npTA-brV4n-HJYos0',
      category: 'suncare',
    },
    {
      id: 'prod3',
      name: '건성용 클렌징 오일',
      description: '메이크업과 노폐물을 부드럽게 녹여내는 고보습 오일로 당김없는 수분 영양을 충전합니다.',
      price: 31000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClTchup5IsPZSyBlRtuimavr8s6cbQbj68Nxr06Wnp4Nik445Y0RODUhIK46LVaVnTmC-FnPLbudsoaQUFfKh-jGwViF-9UNPdNApqc6amAf8zP4_-_zroRO91fFMCE5qnQiaTBLifJETsuDSFxmAo7KqIDmmaWPhVV6RajjBuOpKgzPjbAv7tAlT-A3Tagr9yubmT-M3mZWzWpu4fzk7n-VnWT-zGVSegu4HgGDO9TsPYjomag9Q4LrSnxLmEBIBJMDQI5y1gMgZT',
      category: 'cleansing',
      tag: '저자극 포뮬러',
    },
    {
      id: 'prod4',
      name: '순한 클렌징 밀크',
      description: '약산성 포뮬러로 세안 후에도 당김없는 부드러움을 유지하는 로션 타입 클렌저.',
      price: 19000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmfVeA7BV0b5o-uYeoiOeGGUN6pgXMaN_gzj8viiv8ZOD5BbSRntkrybeptyELPaZSlEFm_62OQ_BJF7DNIseTulfRLyglqC75i_P4F07A_2iMaBgtQCuJC1siUeM04ApmQE6FuU7lImXeEdba-nTQCysVpviLzFPkwQn8JwcZ4cAyQvAk65yOwsmnnxYRIIBtclyG-rcrDo0ZsCYCR5rhHJG0vz0rUhpBPvks-_IibJw3A9c1PP5BoqMRBPhAfzPXFf_At2ewwXuN',
      category: 'cleansing',
    },
  ];

  // Dynamically filtered products
  const filteredProducts = products.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  );

  // Dynamic analysis block text helper based on computed skin MBTI
  const isDry = userSkinType.startsWith('D');
  const isSensitive = userSkinType.includes('S');
  
  const getDynamicAnalysisText = () => {
    let result = `사용자의 <strong class="text-gray-900">${userSkinType}</strong> 타입은 `;
    if (isDry && isSensitive) {
      result += `피부 장벽이 약해지기 쉽고 색소 침착에 취약합니다. 제안된 선크림은 강력한 차단력과 동시에 진정 성분을 함유하고 있으며, 클렌징 라인은 유수분 밸런스를 해치지 않는 저자극 제품들로 구성되었습니다.`;
    } else if (!isDry && isSensitive) {
      result += `유분이 많으나 민감한 지성 트러블성 장벽을 보입니다. 오일프리 선 젤과 저자극 파우더 워시 클렌저를 사용하여 진정과 피지 흡착을 동시에 도와주는 것이 이상적입니다.`;
    } else if (isDry && !isSensitive) {
      result += `건조하고 당김이 심하지만 저항력이 양호해 비교적 튼튼한 상태입니다. 고함량 세라마이드 수분 자외선 크림과 도톰한 밤 타입 클렌저를 매칭해 수분을 가두는 리치 루틴을 권장합니다.`;
    } else {
      result += `유분 방어가 잘 되고 장벽이 높은 지조형(지성 내성형) 피부입니다. 매트 피니시 선블록을 편안히 사용 가능하며, 딥클렌징 클레이 워시를 통해 블랙헤드를 주기적으로 비워내면 좋습니다.`;
    }
    return result;
  };

  return (
    <div id="recommend-screen-container" className="flex flex-col gap-6 max-w-md mx-auto">
      {/* Dynamic Toast Alert */}
      {toastMessage && (
        <div 
          id="toast-notification"
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-3 px-5 rounded-full shadow-lg z-50 animate-fade-in font-semibold flex items-center gap-1.5"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Feature Banner */}
      <section id="recommend-banner" className="bg-[#ff9500] rounded-2xl p-5 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-1 text-white">
          <p className="text-sm font-bold opacity-90">{userSkinType} 맞춤형 제안</p>
          <p className="text-xs opacity-80 leading-relaxed">
            사용자의 {userSkinType} 타입을 분석하여<br />
            가장 적합한 특화 솔루션 제품을 매칭해 드립니다.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section id="recommend-category-filter" className="flex gap-2.5">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'all'
              ? 'bg-[#8c5000] text-white shadow-sm'
              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setActiveCategory('suncare')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'suncare'
              ? 'bg-[#8c5000] text-white shadow-sm'
              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          선케어
        </button>
        <button
          onClick={() => setActiveCategory('cleansing')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'cleansing'
              ? 'bg-[#8c5000] text-white shadow-sm'
              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          클렌징
        </button>
      </section>

      {/* Recommended Suncare/Cleansing heading */}
      <section id="recommended-products-list" className="flex flex-col gap-5">
        <div className="flex justify-between items-center px-1 border-b border-gray-100 pb-2">
          <h2 className="text-lg font-bold text-gray-800">
            {activeCategory === 'all' ? '추천 제품 라인업' : activeCategory === 'suncare' ? '추천 자외선 차단제' : '추천 저자극 클렌저'}
          </h2>
          <span className="text-xs font-bold bg-[#ffdbc9] text-[#934b19] px-3 py-1 rounded-full">
            {userSkinType} 추천
          </span>
        </div>

        {/* Dynamic products stream loops */}
        <div className="flex flex-col gap-6">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              id={`product-card-${prod.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:border-[#ffe171] transition-all flex flex-col group"
            >
              {/* Product Visual */}
              <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                <img 
                  alt={prod.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={prod.image}
                />
                {prod.best && (
                  <div className="absolute top-3 right-3 bg-[#ff9500] text-[#643700] text-xs font-black px-2.5 py-1 rounded-md shadow-sm">
                    BEST
                  </div>
                )}
              </div>

              {/* Product texts */}
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-[#8c5000]">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {prod.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-3">
                  <span className="text-[#8c5000] text-base font-extrabold font-mono">
                    ₩{prod.price.toLocaleString()}
                  </span>
                  
                  <button 
                    onClick={() => triggerToast(`🛒 ${prod.name} 공식 파트너 쇼핑몰 장바구니에 담겼습니다.`)}
                    className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    구매하기 
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Descriptive dynamic logic analysis footer summary */}
      <section id="recommend-logical-reasoning" className="bg-gray-100 rounded-2xl p-5 mb-8 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-md font-bold text-gray-800">왜 이 제품들인가요?</h3>
        </div>
        
        <p 
          className="text-xs text-gray-600 leading-relaxed pl-1"
          dangerouslySetInnerHTML={{ __html: getDynamicAnalysisText() }}
        />
      </section>
    </div>
  );
}
