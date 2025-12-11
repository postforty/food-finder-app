# PWA 기능 확인 가이드

## ✅ 구현된 PWA 기능들

### 1. 기본 PWA 설정

- ✅ **Manifest 파일**: `/public/manifest.json`
- ✅ **Service Worker**: `/public/sw.js`
- ✅ **PWA 아이콘**: 192x192, 512x512 크기
- ✅ **메타태그**: Apple Web App, 테마 컬러 등

### 2. 캐싱 전략

- ✅ **정적 자산 프리캐싱**: HTML, CSS, JS 파일들
- ✅ **런타임 캐싱**:
  - Google Fonts (CacheFirst)
  - 이미지 파일 (StaleWhileRevalidate)
  - Next.js 이미지 최적화 (StaleWhileRevalidate)
  - CSS/JS 파일 (StaleWhileRevalidate)
  - API 데이터 (NetworkFirst)

### 3. 오프라인 지원

- ✅ **오프라인 페이지 접근**: 캐시된 페이지들
- ✅ **자동 업데이트**: skipWaiting으로 즉시 업데이트

## 🔍 브라우저에서 확인하는 방법

### Chrome DevTools에서 확인:

1. **F12** → **Application** 탭
2. **Service Workers**: 등록된 SW 확인
3. **Manifest**: PWA 설정 확인
4. **Storage**: 캐시된 파일들 확인

### PWA 설치 테스트:

1. Chrome에서 주소창 오른쪽 **설치** 버튼 클릭
2. 또는 **메뉴** → **앱 설치**

### 오프라인 테스트:

1. **Network** 탭에서 **Offline** 체크
2. 페이지 새로고침해서 오프라인 동작 확인

## 📱 모바일에서 확인

### Android Chrome:

1. **메뉴** → **홈 화면에 추가**
2. 앱처럼 실행되는지 확인

### iOS Safari:

1. **공유** 버튼 → **홈 화면에 추가**
2. 앱 아이콘으로 실행 확인

## 🚀 현재 서버 정보

- **로컬 서버**: http://localhost:3000
- **네트워크**: http://192.168.10.115:3000

## ⚠️ 주의사항

- PWA는 **HTTPS**에서만 완전히 작동 (localhost 제외)
- 프로덕션 배포 시 HTTPS 필수
- 개발 모드에서는 PWA 비활성화됨
