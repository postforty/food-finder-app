# 🍽️ Food Finder

**맛있는 음식을 쉽게 찾아보세요!**

Food Finder는 주변의 최고의 음식점을 발견하고, 리뷰를 확인하고, 즐겨찾기에 저장할 수 있는 Progressive Web App입니다.

![Food Finder](https://img.shields.io/badge/Next.js-16.0.8-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa)

## ✨ 주요 기능

### 사용자 기능

- 🔍 **음식점 검색** - 이름, 주소, 메뉴로 검색
- 🏷️ **카테고리 필터** - 한식, 중식, 일식, 양식, 카페, 디저트
- ⭐ **평점 및 리뷰** - 다른 사용자의 리뷰 확인 및 작성
- ❤️ **즐겨찾기** - 마음에 드는 음식점 저장
- 🗺️ **위치 기반** - 거리순 정렬 및 지도 표시
- 📱 **PWA 지원** - 홈 화면에 추가하여 앱처럼 사용

### 관리자 기능

- 🔐 **관리자 인증** - Google 로그인
- ➕ **음식점 관리** - 추가, 수정, 삭제
- 📊 **대시보드** - 통계 및 음식점 목록 관리
- 🔍 **검색 및 필터** - 관리자용 검색 및 카테고리 필터

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Inter, Playfair Display (next/font)

### Backend & Services

- **Authentication**: Firebase Auth (Google Login)
- **Database**: Firebase Firestore
- **Hosting**: Vercel (<https://food-finder-app-hazel.vercel.app/>)

### PWA

- **Service Worker**: next-pwa
- **Offline Support**: Runtime caching
- **Installable**: Web App Manifest

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- Firebase 프로젝트

### 설치

1. **저장소 클론**
   ```bash
   git clone https://github.com/yourusername/food-finder-app.git
   cd food-finder-app
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env.local
   ```

`.env.local` 파일을 열어 Firebase 설정값을 입력하세요:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
food-finder-app/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── admin/ # 관리자 페이지
│ │ │ ├── login/ # 관리자 로그인
│ │ │ ├── dashboard/ # 관리자 대시보드
│ │ │ └── restaurants/ # 음식점 관리
│ │ ├── restaurants/ # 음식점 목록 및 상세
│ │ ├── favorites/ # 즐겨찾기
│ │ ├── layout.tsx # 루트 레이아웃
│ │ ├── page.tsx # 홈페이지
│ │ └── globals.css # 전역 스타일
│ ├── components/ # 재사용 컴포넌트
│ │ ├── Header.tsx # 헤더
│ │ └── providers/ # Context Providers
│ ├── context/ # React Context
│ │ └── AuthContext.tsx # 인증 Context
│ └── lib/ # 유틸리티 및 설정
│ └── firebase/ # Firebase 설정
├── public/ # 정적 파일
│ ├── manifest.json # PWA Manifest
│ ├── icon-192.png # PWA 아이콘
│ └── icon-512.png # PWA 아이콘
├── .env.example # 환경 변수 예시
└── next.config.ts # Next.js 설정
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: `hsl(24, 95%, 53%)` - 따뜻한 오렌지
- **Accent**: `hsl(350, 89%, 60%)` - 생동감 있는 빨강
- **Secondary**: `hsl(45, 100%, 51%)` - 밝은 노랑

### 타이포그래피

- **본문**: Inter (Google Fonts)
- **제목**: Playfair Display (Google Fonts)

### 특징

- 🌗 다크 모드 지원
- 🎭 글래스모피즘 효과
- 🌈 그라데이션 디자인
- ✨ 부드러운 애니메이션
- 📱 모바일 퍼스트 반응형

## 📱 PWA 기능

### 설치 방법

1. 모바일 브라우저에서 앱 접속
2. "홈 화면에 추가" 선택
3. 앱 아이콘이 홈 화면에 추가됨

### 오프라인 지원

- 정적 리소스 캐싱
- 이미지 및 폰트 캐싱
- 페이지 캐싱 (24시간)

## 🧪 PWA 테스트 방법

### 1. 프로덕션 빌드 및 실행

```bash
# PWA는 프로덕션 모드에서만 활성화됩니다
npm run build
npm start
```

### 2. 브라우저에서 PWA 기능 확인

#### Chrome DevTools 확인:

1. **F12** → **Application** 탭 열기
2. **Service Workers**: 등록된 SW 확인 (`/sw.js`)
3. **Manifest**: PWA 설정 확인 (`/manifest.json`)
4. **Storage** → **Cache Storage**: 캐시된 파일들 확인
   - `start-url`: 메인 페이지 캐시
   - `static-image-assets`: 이미지 파일 캐시
   - `google-fonts-webfonts`: 폰트 캐시
   - `static-js-assets`: JavaScript 파일 캐시

#### PWA 설치 테스트:

1. **데스크톱 Chrome**: 주소창 오른쪽 **설치** 버튼 클릭
2. **모바일 Chrome**: **메뉴** → **홈 화면에 추가**
3. **iOS Safari**: **공유** 버튼 → **홈 화면에 추가**

#### 오프라인 테스트:

1. **Network** 탭에서 **Offline** 체크박스 선택
2. 페이지 새로고침 → 캐시된 콘텐츠로 정상 동작 확인
3. 이미지, CSS, JS 파일들이 캐시에서 로드되는지 확인

### 3. PWA 점수 확인

```bash
# Lighthouse로 PWA 점수 측정
npx lighthouse http://localhost:3000 --view
```

### 4. 모바일 테스트

- **Android**: Chrome에서 "홈 화면에 추가" 후 앱 아이콘으로 실행
- **iOS**: Safari에서 "홈 화면에 추가" 후 앱처럼 실행
- **Standalone 모드**: 브라우저 UI 없이 앱처럼 실행되는지 확인

### 5. 캐싱 전략 테스트

- **이미지**: 한 번 로드된 이미지가 캐시에서 빠르게 로드
- **폰트**: Google Fonts가 캐시에서 로드
- **정적 자산**: CSS, JS 파일들이 캐시에서 로드
- **API 데이터**: NetworkFirst 전략으로 최신 데이터 우선 로드

### ⚠️ 주의사항

- PWA는 **HTTPS**에서만 완전히 작동 (localhost 제외)
- 개발 모드(`npm run dev`)에서는 PWA 비활성화
- 프로덕션 배포 시 HTTPS 필수
- Service Worker 업데이트는 페이지 새로고침 후 적용

## 🔐 Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication 활성화 (Google 로그인)
3. Firestore Database 생성
4. 웹 앱 추가 및 설정값 복사
5. `.env.local`에 설정값 입력

## 🚀 배포

### Vercel 배포

```bash
npm run build
vercel deploy
```

### 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정하세요.

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Food Finder Team

---

**Made with ❤️ and 🍽️**
