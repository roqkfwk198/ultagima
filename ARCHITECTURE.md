# 얼타지마 (Ultagima) — 아키텍처 및 기능 문서

> 스마트한 자외선 차단 및 피부 관리 솔루션
> 최종 업데이트: 2026-05-27

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 앱 이름 | 얼타지마 (Ultagima) |
| 목적 | UV 지수 실시간 확인 + 피부 타입별 선케어/세안 가이드 |
| 타겟 | 모바일 웹 (PWA 지원) |
| 컨셉 | 듀오링고 스타일 부재 추적 + 실시간 UV 데이터 기반 피부 관리 |

---

## 2. 기술 스택

### 프론트엔드

| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| React | 19.0.1 | UI 프레임워크 |
| TypeScript | 5.8.x | 타입 안전성 |
| Vite | 6.2.x | 빌드 도구 / Dev Server |
| Tailwind CSS | 4.1.x | 유틸리티 CSS 스타일링 |
| motion/react | 12.x | 화면 전환 애니메이션 |
| lucide-react | 0.546.x | SVG 아이콘 라이브러리 |

### 외부 API

| API | 키 필요 | 용도 |
|-----|---------|------|
| Open-Meteo | ❌ 무료 | UV 지수 실시간 데이터 |
| Web Geolocation API | ❌ 브라우저 내장 | 사용자 위치 |

### PWA / 브라우저 기능

| 기능 | 설명 |
|------|------|
| Service Worker | 백그라운드 부재 알림 스케줄링 |
| Web Notifications API | 2시간/5시간/7시간 부재 알림 |
| localStorage | 피부 타입, 마지막 방문 시간 영구 저장 |
| Canvas API | 파비콘 동적 변경 (부재 레벨 이미지 적용) |
| Web Manifest | PWA 홈 화면 추가 지원 |

---

## 3. 디렉터리 구조

```
ultagima/
├── public/
│   ├── sw.js              # Service Worker (부재 알림 스케줄러)
│   ├── manifest.json      # PWA 매니페스트
│   └── icons/
│       ├── stage1.jpg     # 부재 1단계 아이콘 (2~5시간)
│       ├── stage2.jpg     # 부재 2단계 아이콘 (5~7시간)
│       └── stage3.jpg     # 부재 4단계 아이콘 (7시간+)
│
├── src/
│   ├── main.tsx           # React 진입점
│   ├── App.tsx            # 루트 컴포넌트 (라우팅 + 상태)
│   ├── types.ts           # 공통 TypeScript 타입
│   │
│   ├── components/
│   │   ├── Header.tsx         # 상단 헤더 (동적 아이콘 뱃지)
│   │   ├── Navigation.tsx     # 하단 플로팅 네비게이션
│   │   └── AbsenceBanner.tsx  # 부재 복귀 모달 배너
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx     # 홈 (UV API + 시간대별 예보)
│   │   ├── TimerScreen.tsx    # 선크림 재도포 타이머
│   │   ├── SurveyScreen.tsx   # 피부 MBTI 설문 (4단계)
│   │   ├── RecommendScreen.tsx # 맞춤 제품 추천
│   │   └── CleansingScreen.tsx # 세안법 가이드
│   │
│   ├── hooks/
│   │   └── useAbsenceTracker.ts # 부재 추적 훅 (핵심)
│   │
│   ├── utils/
│   │   └── uvApi.ts           # Open-Meteo UV API 유틸리티
│   │
│   └── data/
│       └── skinTypeData.ts    # 16가지 피부 타입 데이터 + 루틴 생성
│
├── index.html             # 앱 엔트리 HTML (PWA 메타태그)
├── vite.config.ts
├── tsconfig.json
├── package.json
└── ARCHITECTURE.md        # 이 파일
```

---

## 4. 화면(탭) 구조

### 4.1 탭 목록 (하단 네비게이션)

| 탭 ID | 탭 이름 | 아이콘 | 주요 기능 |
|-------|---------|--------|----------|
| `home` | 홈 | ☀️ Sun | UV 지수 슬라이더, 시간대별 예보, 외출 환경 위젯 |
| `timer` | 타이머 | 🕐 Clock | 선크림 재도포 카운트다운, 스마트 알림 |
| `survey` | 피부 설정 | ✨ Sparkles | 4단계 피부 MBTI 설문 |
| `recommend` | 추천 | ⭐ Star | 피부 타입별 선케어/클렌징 제품 추천 |
| `cleansing` | 세안법 | 💧 Droplets | 아침/저녁 세안 루틴 가이드 |

### 4.2 화면 전환 규칙

| 전환 | 타입 |
|------|------|
| `survey → recommend` (결과 확인하기) | Push (슬라이드 인) |
| 나머지 모든 탭 전환 | 즉시 (애니메이션 없음) |

---

## 5. 핵심 기능 상세

### 5.1 UV 지수 실시간 연동

```
흐름: 앱 마운트 → Geolocation API → Open-Meteo API → UV 지수 + 시간대별 예보 업데이트
갱신 주기: 30분 자동 갱신
폴백: API 실패 시 Mock 데이터 (서울 평균값) 사용
```

**API 엔드포인트:**
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=uv_index
  &hourly=uv_index
  &timezone=auto
  &forecast_days=1
```

**응답 파싱:**
- `current.uv_index` → 현재 UV 지수
- `hourly.time` + `hourly.uv_index` → 시간대별 예보 (오늘 현재 시간 ~ 20시 필터)

### 5.2 선크림 재도포 타이머

| UV 지수 | 스마트 알림 ON | 스마트 알림 OFF |
|---------|---------------|----------------|
| UV ≥ 8 | 60분 | 120분 |
| UV ≥ 5 | 90분 | 120분 |
| UV < 5 | 120분 | 120분 |

- **타이머 완료 시**: 초록색 완료 UI + 재도포 안내 메시지
- **기존 버그 수정**: `initialSeconds = 4500`(75분) → UV/스마트 알림 기반 동적 계산

### 5.3 부재 추적 시스템 (듀오링고 스타일)

```
앱 실행 → localStorage.ultagima_lastVisit 읽기 → 경과 시간 계산
         ↓
  경과 < 2시간  → Level 0 (정상, 기본 프로필)
  2h ≤ 경과 < 5시간 → Level 1 (1단계 아이콘)
  5h ≤ 경과 < 7시간 → Level 2 (2단계 아이콘)
  경과 ≥ 7시간  → Level 3 (4단계 아이콘)
         ↓
  현재 방문 시간 저장 + SW에 알림 스케줄 등록
```

**부재 레벨별 반응:**

| 레벨 | 조건 | 아이콘 | 파비콘 | 배너 |
|------|------|--------|--------|------|
| 0 | 정상 | 기본 프로필 | 기본 | ❌ |
| 1 | 2~5시간 | stage1.jpg (주황) | stage1 | ✅ |
| 2 | 5~7시간 | stage2.jpg (진주황) | stage2 | ✅ |
| 3 | 7시간+ | stage3.jpg (빨강) | stage3 | ✅ |

### 5.4 Service Worker 알림

```javascript
// 앱 실행 시 SW에 알림 스케줄 등록
// sw.js가 setTimeout으로 알림 예약 (브라우저가 열려 있어야 동작)

Stage 1 알림 (2시간 후):
  제목: "피부가 걱정돼요 😟"
  내용: "2시간 동안 얼타지마를 안 여셨어요. 선크림 재도포 잊지 마세요!"

Stage 2 알림 (5시간 후):
  제목: "선크림 잊으셨나요? 😫"
  내용: "5시간이나 지났어요! 자외선이 피부를 공격하고 있어요."

Stage 3 알림 (7시간 후):
  제목: "🚨 피부 긴급 경보!"
  내용: "7시간 동안 얼타지마를 방치하셨어요! 지금 바로 확인하세요!"
```

> **Note**: Web SW의 setTimeout은 브라우저가 SW를 종료하면 취소됩니다.
> 프로덕션 환경에서는 Firebase Cloud Messaging 같은 Push 서버가 필요합니다.

### 5.5 피부 MBTI 시스템

**4축 분류:**

| 축 | 옵션 A | 옵션 B |
|----|--------|--------|
| 유수분 | D (Dry 건성) | O (Oily 지성) |
| 민감도 | S (Sensitive 민감) | R (Resistant 저항) |
| 색소 | P (Pigmented 색소) | N (Non-Pigmented 비색소) |
| 탄력 | W (Wrinkled 주름) | T (Tight 탄탄) |

**총 16가지 조합** → 각각에 맞는 요약, 선크림 추천, 세안법 저장

**저장 키 (localStorage):**
```
skinTypeCode        → "DSPW" 등 4글자 코드
skinTypeDetail      → JSON (상세 정보)
moistureType        → "D" 또는 "O"
sensitivityType     → "S" 또는 "R"
pigmentType         → "P" 또는 "N"
wrinkleType         → "W" 또는 "T"
```

---

## 6. 데이터 플로우

```
App.tsx (전역 상태)
  ├── uvIndex: number          ← HomeScreen이 API에서 받아 업데이트
  ├── userSkinType: string     ← SurveyScreen이 설문 완료 후 저장
  ├── currentScreen: Screen    ← Navigation/handleNavigate가 관리
  └── absenceLevel: 0|1|2|3   ← useAbsenceTracker 훅이 계산
       ├── → Header (프로필 아이콘 + 뱃지)
       ├── → AbsenceBanner (복귀 모달)
       └── → 파비콘 (Canvas API 동적 변경)
```

---

## 7. 실행 방법

```bash
# 개발 서버 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크
npm run lint
```

---

## 8. 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `GEMINI_API_KEY` | Gemini AI API 키 (현재 미사용) | - |
| `APP_URL` | 서비스 URL (AI Studio 자동 주입) | - |

> Open-Meteo UV API는 API 키가 필요 없습니다.

---

## 9. 향후 개선 방향

| 항목 | 설명 |
|------|------|
| Push Server 연동 | Firebase FCM으로 브라우저 닫혀도 알림 동작 |
| 날씨 API 연동 | 실제 온도/습도/날씨 상태 표시 |
| 제품 구매 연동 | 실제 쇼핑몰 API 연결 |
| Gemini AI 추천 | 피부 상태 사진 분석 후 맞춤 추천 |
| 오프라인 지원 | SW 캐싱으로 오프라인 대응 |
| 알림 권한 안내 | 알림 거부 시 인앱 가이드 UI |
