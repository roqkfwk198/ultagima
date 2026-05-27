export interface SkinTypeDetail {
  code: string;
  summary: string;
  sunscreenRecommendation: string;
  avoidOrCaution: string;
  carePoint: string;
  cleansingMethod: string;
  cleansingRoutine?: CleansingRoutine;
}

export interface CleansingRoutineSection {
  title: string;
  description: string;
  points: string[];
}

export interface CleansingRoutine {
  morning: CleansingRoutineSection;
  evening: CleansingRoutineSection;
  caution: CleansingRoutineSection;
}

export const skinTypeData: Record<string, SkinTypeDetail> = {
  DSPW: {
    code: 'DSPW',
    summary: '건조하고 민감하며 색소와 탄력 고민이 함께 나타나기 쉬운 타입',
    sunscreenRecommendation: '보습감 있는 무기자차 또는 저자극 혼합자차를 권장해요.',
    avoidOrCaution: '강한 향료, 고농도 산 성분, 뽀득한 세정 제품은 피해주세요.',
    carePoint: '장벽 보습과 진정, 색소 관리, 탄력 케어를 함께 챙기는 것이 좋아요.',
    cleansingMethod: '약산성 젤 또는 밀크 클렌저로 짧고 부드럽게 세안하세요. 진한 메이크업이 아니라면 강한 이중세안은 피하고 미온수로 충분히 헹구는 것이 좋아요.',
  },
  DSPT: {
    code: 'DSPT',
    summary: '건조하고 민감하며 색소 고민이 있지만 탄력은 비교적 안정적인 타입',
    sunscreenRecommendation: '수분감 있는 저자극 선크림을 매일 충분히 발라주세요.',
    avoidOrCaution: '스크럽, 알코올감 강한 토너, 자극적인 미백 제품은 주의하세요.',
    carePoint: '피부 장벽을 안정시키면서 색소가 짙어지지 않도록 자외선 차단을 꾸준히 해요.',
    cleansingMethod: '순한 약산성 클렌저를 손에서 충분히 거품 낸 뒤 30초 안팎으로 가볍게 세안하세요. 세안 후 바로 보습을 올려 당김을 줄여주세요.',
  },
  DSNW: {
    code: 'DSNW',
    summary: '건조하고 민감하며 탄력 저하가 고민되기 쉬운 타입',
    sunscreenRecommendation: '보습과 진정을 함께 주는 크림 타입 선케어가 잘 맞아요.',
    avoidOrCaution: '세정력이 강한 폼, 뜨거운 물, 잦은 각질 제거는 피해주세요.',
    carePoint: '수분 장벽 회복과 탄력 케어를 꾸준히 병행하는 것이 중요해요.',
    cleansingMethod: '밀크나 크림 타입 클렌저로 마찰을 줄여 세안하세요. 아침에는 물세안 또는 아주 순한 클렌저만 사용해도 충분해요.',
  },
  DSNT: {
    code: 'DSNT',
    summary: '건조하고 민감하지만 색소와 주름 고민은 비교적 적은 타입',
    sunscreenRecommendation: '수분 장벽을 지켜주는 저자극 데일리 선크림을 추천해요.',
    avoidOrCaution: '잦은 이중세안과 강한 계면활성제 제품은 건조함을 키울 수 있어요.',
    carePoint: '자극을 줄이고 보습 루틴을 안정적으로 유지하는 것이 핵심이에요.',
    cleansingMethod: '약산성 저자극 클렌저로 필요한 만큼만 세안하세요. 세안 후 당김이 느껴지면 클렌저 양과 시간을 줄이는 것이 좋아요.',
  },
  DRPW: {
    code: 'DRPW',
    summary: '건조하지만 자극에는 강하고 색소와 탄력 고민이 있는 타입',
    sunscreenRecommendation: '보습감과 광차단력이 균형 잡힌 선크림이 좋아요.',
    avoidOrCaution: '과한 각질 제거와 건조한 마무리감의 클렌저는 주의하세요.',
    carePoint: '보습을 충분히 유지하면서 색소와 탄력 관리를 함께 해주세요.',
    cleansingMethod: '부드러운 폼 또는 젤 클렌저를 사용하고 세안 시간을 길게 끌지 마세요. 선크림 잔여감이 있을 때만 순한 1차 세안을 더해주세요.',
  },
  DRPT: {
    code: 'DRPT',
    summary: '건조하지만 비교적 튼튼하며 색소 고민이 생기기 쉬운 타입',
    sunscreenRecommendation: '촉촉한 제형의 고차단 선크림을 꾸준히 사용하는 것이 좋아요.',
    avoidOrCaution: '건조한 마무리의 클렌징 제품과 과한 필링은 피해주세요.',
    carePoint: '보습과 자외선 차단을 중심으로 색소 고민을 예방해요.',
    cleansingMethod: '보습 성분이 있는 약산성 폼으로 저녁 세안을 깔끔하게 해주세요. 세안 직후 토너나 크림으로 수분 증발을 막아주세요.',
  },
  DRNW: {
    code: 'DRNW',
    summary: '건조하고 저항성은 좋지만 탄력 저하가 고민되기 쉬운 타입',
    sunscreenRecommendation: '리치한 보습 선크림이나 크림형 선케어가 잘 맞아요.',
    avoidOrCaution: '피부가 뽀득해질 정도의 세안은 탄력 관리에 방해가 될 수 있어요.',
    carePoint: '수분 보유력을 높이고 탄력 성분을 꾸준히 더해주세요.',
    cleansingMethod: '저녁에는 순한 젤 클렌저로 한 번 세안하고, 아침에는 가벼운 물세안 위주로 관리하세요. 세안 후 보습막을 빠르게 채워주세요.',
  },
  DRNT: {
    code: 'DRNT',
    summary: '건조하지만 피부 장벽이 안정적이고 큰 고민이 적은 타입',
    sunscreenRecommendation: '보습감 있는 데일리 선크림을 편안하게 사용할 수 있어요.',
    avoidOrCaution: '불필요한 강한 세정과 잦은 클렌징 도구 사용은 줄여주세요.',
    carePoint: '현재 장벽을 유지하면서 건조함만 꾸준히 보완하면 좋아요.',
    cleansingMethod: '순한 약산성 클렌저로 저녁에만 꼼꼼히 세안하세요. 아침에는 피부 상태에 따라 물세안으로도 충분해요.',
  },
  OSPW: {
    code: 'OSPW',
    summary: '유분이 많고 민감하며 색소와 탄력 고민이 함께 생기기 쉬운 타입',
    sunscreenRecommendation: '가벼운 진정 선젤이나 논코메도제닉 선크림을 추천해요.',
    avoidOrCaution: '강한 세정으로 유분을 모두 제거하려는 습관은 오히려 자극을 키울 수 있어요.',
    carePoint: '피지 조절과 진정, 색소 예방을 균형 있게 관리해주세요.',
    cleansingMethod: '약산성 젤 클렌저로 T존은 꼼꼼히, 볼은 가볍게 세안하세요. 오일 클렌저는 진한 메이크업 날에만 짧게 사용하는 것이 좋아요.',
  },
  OSPT: {
    code: 'OSPT',
    summary: '유분이 많고 민감하며 색소 고민이 생기기 쉬운 타입',
    sunscreenRecommendation: '산뜻한 저자극 선젤과 무겁지 않은 로션 타입이 잘 맞아요.',
    avoidOrCaution: '알갱이 스크럽, 고알코올 제품, 과한 피지 제거 루틴은 피해주세요.',
    carePoint: '피지는 조절하되 장벽을 자극하지 않는 루틴이 중요해요.',
    cleansingMethod: '저자극 젤 클렌저로 하루 1~2회 부드럽게 세안하세요. 번들거림이 있어도 세안 후 당김이 생기면 세정력이 약한 제품으로 바꿔주세요.',
  },
  OSNW: {
    code: 'OSNW',
    summary: '유분이 많고 민감하며 탄력 저하가 고민되기 쉬운 타입',
    sunscreenRecommendation: '가벼운 진정 선케어를 얇게 여러 번 바르는 방식이 좋아요.',
    avoidOrCaution: '강한 클렌징과 잦은 각질 제거는 민감도와 탄력 고민을 악화시킬 수 있어요.',
    carePoint: '피지 조절과 진정, 수분 공급을 함께 챙겨주세요.',
    cleansingMethod: '거품이 부드러운 약산성 클렌저로 마찰 없이 세안하세요. 피지가 많은 부위만 조금 더 롤링하고 나머지는 짧게 마무리해요.',
  },
  OSNT: {
    code: 'OSNT',
    summary: '유분이 많고 민감하지만 색소와 주름 고민은 비교적 적은 타입',
    sunscreenRecommendation: '가볍고 순한 수분 선젤을 추천해요.',
    avoidOrCaution: '과한 피지 제거 제품과 뽀득한 세안 습관은 피해주세요.',
    carePoint: '번들거림을 줄이되 피부 장벽을 편안하게 유지하는 것이 좋아요.',
    cleansingMethod: '순한 젤 클렌저로 저녁에 꼼꼼히 세안하고, 아침에는 유분 상태에 따라 가볍게만 세안하세요. 세안 후 산뜻한 보습제를 꼭 사용해요.',
  },
  ORPW: {
    code: 'ORPW',
    summary: '유분이 많고 비교적 튼튼하며 색소와 탄력 고민이 있는 타입',
    sunscreenRecommendation: '보송하게 마무리되는 고차단 선크림이 잘 맞아요.',
    avoidOrCaution: '세안 후 건조할 정도의 강한 클렌징은 피지 균형을 무너뜨릴 수 있어요.',
    carePoint: '피지와 모공을 관리하면서 색소와 탄력 케어를 병행해주세요.',
    cleansingMethod: '젤 또는 폼 클렌저로 피지 많은 부위를 중심으로 세안하세요. 주 1~2회 정도만 부드러운 각질 케어를 더하면 좋아요.',
  },
  ORPT: {
    code: 'ORPT',
    summary: '유분이 많고 장벽이 안정적이며 색소 고민이 생기기 쉬운 타입',
    sunscreenRecommendation: '산뜻한 고차단 선크림과 보송한 마무리 제형이 좋아요.',
    avoidOrCaution: '과도한 클렌징 오일 사용은 모공 답답함을 만들 수 있어요.',
    carePoint: '피지 균형과 색소 예방을 위해 자외선 차단을 꾸준히 해주세요.',
    cleansingMethod: '가벼운 폼 클렌저로 저녁 세안을 꼼꼼히 하고, 선크림을 많이 바른 날에는 순한 1차 세안을 추가하세요.',
  },
  ORNW: {
    code: 'ORNW',
    summary: '유분이 많고 자극에는 강하지만 탄력 저하가 고민되기 쉬운 타입',
    sunscreenRecommendation: '가벼운 선젤이나 보송한 로션형 선케어가 잘 맞아요.',
    avoidOrCaution: '강한 피지 제거 루틴만 반복하면 속건조와 탄력 고민이 생길 수 있어요.',
    carePoint: '피지를 조절하면서 수분과 탄력 케어를 함께 유지해주세요.',
    cleansingMethod: '피지 많은 부위는 폼 클렌저로 충분히 롤링하고 볼 부위는 짧게 세안하세요. 세안 후 수분 젤이나 로션으로 균형을 맞춰주세요.',
  },
  ORNT: {
    code: 'ORNT',
    summary: '유분이 많지만 피부 장벽이 안정적이고 큰 고민이 적은 타입',
    sunscreenRecommendation: '산뜻한 데일리 선크림을 편안하게 사용할 수 있어요.',
    avoidOrCaution: '불필요한 강한 이중세안은 속건조를 만들 수 있어요.',
    carePoint: '피지와 수분 균형을 유지하며 기본 자외선 차단을 꾸준히 해주세요.',
    cleansingMethod: '저녁에는 산뜻한 젤 또는 폼 클렌저로 한 번 세안하세요. 아침에는 번들거림 정도에 따라 가볍게 세안하면 충분해요.',
  },
};

export function generateCleansingRoutine(code: string): CleansingRoutine {
  const isDry = code.includes('D');
  const isOily = code.includes('O');
  const isSensitive = code.includes('S');
  const isResistant = code.includes('R');
  const isPigmented = code.includes('P');
  const isWrinkled = code.includes('W');

  const morningDescription = isDry
    ? isSensitive
      ? '건조하고 민감한 피부이므로 아침에는 물세안 또는 약산성 클렌저로 가볍게 세안하는 것이 좋아요.'
      : '건조함이 쉽게 느껴질 수 있어 아침에는 물세안이나 보습감 있는 약산성 클렌저가 잘 맞아요.'
    : isSensitive
      ? '피지는 정리하되 민감 반응이 생기지 않도록 순한 젤 클렌저로 가볍게 세안해요.'
      : '피지와 번들거림을 가볍게 정리하는 기본 세안 루틴이 잘 맞아요.';

  const eveningDescription = isDry
    ? isSensitive
      ? '선크림은 부드럽게 제거하되, 강한 이중세안은 피하고 저자극 클렌저를 사용하는 것이 좋아요.'
      : '선크림 잔여물은 순한 1차 세안으로 정리하고, 세안 후 당김이 오래가지 않게 보습을 바로 더해주세요.'
    : isSensitive
      ? '선크림과 피지는 꼼꼼히 제거하되, 색소침착과 민감 반응을 막기 위해 마찰은 줄여야 해요.'
      : '선크림과 피지를 깔끔하게 제거하되 과한 이중세안은 피해주세요.';

  const cautionDescription = isSensitive
    ? isDry || isPigmented
      ? '마찰과 자극이 피부에 부담이 될 수 있으므로, 뜨거운 물과 강한 필링 제품은 피해주세요.'
      : '민감 반응이 올라올 수 있으니 세정력보다 저자극과 충분한 헹굼을 우선해주세요.'
    : isResistant
      ? '피부가 강한 편이어도 과세정은 장벽 손상으로 이어질 수 있어요.'
      : '피부 상태가 흔들릴 때는 세안 단계와 세정력을 먼저 줄여주세요.';

  const morningPoints = isDry
    ? ['미온수 사용', isSensitive ? '문지르지 않기' : '당김이 있으면 물세안만 하기', '세안 후 바로 보습']
    : ['약산성 젤 클렌저', '피지 많은 T존 중심 세안', isSensitive ? '세게 문지르지 않기' : '산뜻한 보습'];

  const eveningPoints = isDry
    ? ['보습감 있는 저자극 클렌저', isPigmented ? '강한 스크럽 금지' : '강한 이중세안 피하기', isWrinkled ? '세안 후 진정 보습' : '세안 후 수분 보충']
    : ['논코메도제닉 클렌저', isPigmented ? '부드러운 롤링' : '꼼꼼한 헹굼', isSensitive ? '충분히 헹구기' : '가벼운 보습'];

  const cautionPoints = [
    isWrinkled ? '뜨거운 물 피하기' : '하루 여러 번 세안 금지',
    isSensitive ? '향료/알코올/스크럽 주의' : '강한 세정제 반복 사용 금지',
    isPigmented ? '강한 필링과 세게 문지르기 피하기' : '세안 후 수분 공급',
    isSensitive ? '따가우면 세안 단계 줄이기' : isDry ? '뽀득한 세안감에 집착하지 않기' : '과한 이중세안 피하기',
  ];

  return {
    morning: {
      title: '아침 세안 루틴',
      description: morningDescription,
      points: morningPoints,
    },
    evening: {
      title: '저녁 세안 루틴',
      description: eveningDescription,
      points: eveningPoints,
    },
    caution: {
      title: '주의할 점',
      description: cautionDescription,
      points: cautionPoints,
    },
  };
}
