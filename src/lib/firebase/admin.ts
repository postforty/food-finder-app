import "server-only";
import { initializeApp, getApps, getApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 환경 변수에서 서비스 계정 정보 가져오기
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

// Private Key 처리 로직 강화:
// 1. 이미 줄바꿈이 되어 있을 수도 있고
// 2. "\n" 문자열로 되어 있을 수도 있음
// 3. 따옴표가 포함되어 있을 수도 있음
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = rawPrivateKey
  ? rawPrivateKey.replace(/\\n/g, '\n').replace(/"/g, '') // 이스케이프된 줄바꿈과 따옴표 제거
  : undefined;

console.log('Firebase Admin Init Debug:');
console.log('- Project ID:', projectId);
console.log('- Client Email:', clientEmail);
console.log('- Private Key Length:', privateKey ? privateKey.length : 'UNDEFINED');
if (privateKey) {
    console.log('- Private Key Start:', privateKey.substring(0, 30));
    console.log('- Private Key End:', privateKey.substring(privateKey.length - 30));
}

let app;

// ... (rest of the file)

if (!getApps().length) {
  if (projectId && clientEmail && privateKey) {
    // 1. 환경 변수에 모든 정보가 있는 경우 (권장)
    const serviceAccount: ServiceAccount = {
      projectId,
      clientEmail,
      privateKey,
    };
    
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // 2. 환경 변수가 부족한 경우 - 개발 환경에서만 작동하거나 에러 발생
    // 로컬 개발 환경에서 GOOGLE_APPLICATION_CREDENTIALS 환경 변수가 설정되어 있다면 
    // 기본 자격 증명을 사용할 수 있습니다.
    console.warn("Firebase Admin 환경 변수가 충분하지 않습니다. (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY 필요). 기본 자격 증명(Application Default Credentials)을 시도합니다.");
    try {
        app = initializeApp();
    } catch (e) {
        console.error("Firebase Admin 초기화 실패: 환경 변수를 확인해주세요.");
        throw e;
    }
  }
} else {
  app = getApp();
}

const db = getFirestore(app);

export { db };
