# Next.js 프로덕션 환경에서 Firebase OAuth 로그인 오류 해결하기

## 1. 문제 상황

### 1-1. 개발 환경과 프로덕션 환경의 차이점

Next.js 프로젝트에서 Firebase Authentication을 사용하여 Google OAuth 로그인을 구현할 때, 개발 환경(`npm run dev`)에서는 정상적으로 작동하지만 프로덕션 환경(`npm run build` 후 `npm run start`)에서는 다음과 같은 오류가 발생하는 경우가 있다.

```bash
GET https://food-finder-app-6397c.firebaseapp.com/__/firebase/init.json 404 (Not Found)
```

### 1-2. 오류 발생 원인 분석

이 문제는 Firebase Authentication의 OAuth 로그인 방식 차이에서 발생한다.

- **개발 환경**: 새 창(팝업) 방식으로 OAuth 인증 수행
- **프로덕션 환경**: 기존 창(리디렉션) 방식으로 OAuth 인증 수행

#### 1-2-1. 팝업 방식과 리디렉션 방식의 차이점

| 특징        | 팝업 방식 (`signInWithPopup`)           | 리디렉션 방식 (`signInWithRedirect`)              |
| ----------- | --------------------------------------- | ------------------------------------------------- |
| 작동 원리   | 새 창에서 인증 후 부모 창으로 결과 전달 | 현재 창에서 Firebase 서버로 이동 후 돌아옴        |
| 환경 의존성 | 상대적으로 환경 문제에 덜 민감          | Firebase Hosting 환경에 특화됨                    |
| 오류 발생   | 팝업 차단 시에만 문제 발생              | Next.js 서버에서 `init.json` 경로 부재로 404 오류 |

## 2. 문제 해결 방법

### 2-1. 기존 코드 분석

문제가 발생한 기존 코드는 환경에 따라 다른 OAuth 방식을 사용하도록 구현되어 있었다.

```typescript
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    if (process.env.NODE_ENV === "development") {
      // 개발 환경: 팝업 방식
      const result = await signInWithPopup(auth, provider);
      // ... 권한 체크 로직
    } else {
      // 프로덕션 환경: 리디렉션 방식
      await signInWithRedirect(auth, provider);
    }
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};
```

### 2-2. 해결책 적용

#### 2-2-1. 모든 환경에서 팝업 방식 사용

가장 효과적인 해결책은 모든 환경에서 `signInWithPopup`을 사용하는 것이다.

```typescript
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    // 모든 환경에서 팝업 방식 사용 (Next.js 서버에서 안정적)
    const result = await signInWithPopup(auth, provider);
    const userEmail = result.user.email;

    // 관리자 권한 체크
    if (!checkIsAdmin(userEmail)) {
      await firebaseSignOut(auth);
      alert("관리자 권한이 없습니다. 시스템 관리자에게 문의하세요.");
      router.push("/");
      return;
    }

    // 관리자인 경우 admin 페이지로 이동
    router.push("/admin/restaurants");
  } catch (error) {
    console.error("Error signing in with Google", error);
    alert("로그인 중 오류가 발생했습니다.");
  }
};
```

#### 2-2-2. 불필요한 리디렉션 처리 코드 제거

리디렉션 방식을 사용하지 않으므로 관련 코드를 제거한다.

```typescript
// 제거된 코드
useEffect(() => {
  // 프로덕션 환경에서만 리다이렉트 결과 처리
  const handleRedirectResult = async () => {
    if (process.env.NODE_ENV === "production") {
      try {
        const result = await getRedirectResult(auth);
        // ... 리디렉션 결과 처리 로직
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    }
  };

  handleRedirectResult();
  // ...
}, [router]);
```

```typescript
// 수정된 코드
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
    setIsAdmin(checkIsAdmin(user?.email || null));
    setLoading(false);
  });

  return () => unsubscribe();
}, [router]);
```

#### 2-2-3. 사용하지 않는 import 정리

```typescript
// 수정 전
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from "firebase/auth";

// 수정 후
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
```

## 3. 대안적 해결 방법

### 3-1. 리디렉션 방식을 유지해야 하는 경우

모바일 환경 지원 등의 이유로 리디렉션 방식이 필수적인 경우, 다음과 같은 방법을 사용할 수 있다.

#### 3-1-1. 수동 리디렉션 결과 처리

```typescript
import { getRedirectResult } from "firebase/auth";

useEffect(() => {
  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        // 리디렉션 로그인 성공 처리
        console.log("Redirect sign in successful:", result.user);
      }
    } catch (error) {
      console.error("Redirect sign in failed:", error);
    }
  };

  handleRedirectResult();
}, []);
```

#### 3-1-2. Firebase Hosting 사용

Next.js 애플리케이션을 Firebase Hosting에 배포하면 `/__/firebase/init.json` 경로가 자동으로 제공되어 리디렉션 방식이 정상적으로 작동한다.

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 프로젝트 초기화
firebase init hosting

# Next.js 빌드 후 배포
npm run build
firebase deploy
```

### 3-2. 하이브리드 접근법

환경과 디바이스에 따라 적절한 방식을 선택하는 방법이다.

```typescript
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    // 모바일 환경 감지
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // 모바일에서는 리디렉션 방식 사용
      await signInWithRedirect(auth, provider);
    } else {
      // 데스크톱에서는 팝업 방식 사용
      const result = await signInWithPopup(auth, provider);
      // ... 결과 처리
    }
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};
```

## 4. 주의사항 및 권장사항

### 4-1. 팝업 차단 대응

팝업 방식을 사용할 때 브라우저의 팝업 차단 기능으로 인한 문제를 대비해야 한다.

```typescript
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    // ... 성공 처리
  } catch (error) {
    if (error.code === "auth/popup-blocked") {
      alert("팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.");
    } else if (error.code === "auth/popup-closed-by-user") {
      console.log("사용자가 팝업을 닫았습니다.");
    } else {
      console.error("로그인 오류:", error);
    }
  }
};
```

### 4-2. 보안 고려사항

- **HTTPS 사용**: OAuth 인증은 반드시 HTTPS 환경에서 수행되어야 한다.
- **도메인 검증**: Firebase Console에서 승인된 도메인만 OAuth 리디렉션을 허용하도록 설정한다.
- **토큰 관리**: 인증 토큰의 만료 시간을 적절히 관리하고 갱신 로직을 구현한다.

### 4-3. 성능 최적화

```typescript
// GoogleAuthProvider 인스턴스를 컴포넌트 외부에서 생성하여 재사용
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // ... 처리 로직
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};
```

## 5. 결론

Next.js 프로덕션 환경에서 Firebase OAuth 로그인 시 발생하는 `init.json` 404 오류는 리디렉션 방식과 팝업 방식의 차이에서 비롯된다. 가장 간단하고 효과적인 해결책은 모든 환경에서 `signInWithPopup`을 사용하는 것이다. 이 방법은 Next.js 서버 환경에서 안정적으로 작동하며, Firebase Hosting에 의존하지 않는다는 장점이 있다.

특별한 요구사항이 없다면 팝업 방식을 권장하며, 모바일 환경 지원이 필수적인 경우에만 리디렉션 방식과 적절한 후속 처리를 고려하는 것이 바람직하다.
