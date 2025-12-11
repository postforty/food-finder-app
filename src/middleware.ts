import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // admin 경로에 대한 접근 제어
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 모든 admin 경로는 클라이언트 사이드에서 권한 체크 후 리다이렉트 처리
    // 실제 인증과 권한 체크는 layout.tsx에서 처리됩니다.

    // 추가적인 서버 사이드 보안 로직을 여기에 구현할 수 있습니다.
    // 예: 특정 헤더 확인, IP 제한 등

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
