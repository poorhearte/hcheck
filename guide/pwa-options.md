# PWA 구현 옵션 요약

웹앱을 PWA로 만들 때 선택할 수 있는 방법들과 장단점, 플랫폼 제약을 정리한 요약입니다.

## 빠른 목록

1. 수동 설정 (Minimal PWA)
2. Workbox 사용
3. 프레임워크 플러그인 / 템플릿 (CRA, Next.js, Vite)
4. PWABuilder / 온라인 도구
5. TWA (Trusted Web Activity) — Play Store 등록용
6. Capacitor / Cordova 래핑 — Play/App Store 등록용
7. Ionic PWA Toolkit
8. TWA + Digital Asset Links 설정

---

## 각 방식 설명

1. 수동 설정 (Minimal PWA)

- 파일: `manifest.json`, `sw.js`, 메타 태그
- 장점: 간단하고 완전 제어 가능
- 단점: 캐싱/업데이트 로직 직접 구현 필요

2. Workbox

- Google에서 제공하는 서비스워커 라이브러리
- 전략: precache, runtime caching, background sync 등
- 장점: 안정적이고 권장되는 패턴 제공

3. 프레임워크 플러그인 / 템플릿

- CRA: PWA 템플릿
- Next.js: `next-pwa` (SSR + PWA 통합)
- Vite: `vite-plugin-pwa`
- 장점: 빌드 파이프라인과 연동되어 설정 간소화

4. PWABuilder 등 온라인 도구

- 아이콘/메타 자동 생성, 호환성 검사, 스캐폴드 제공
- 빠르게 시작할 때 유용

5. TWA (Trusted Web Activity)

- Android 전용: 웹을 Chrome 기반 네이티브로 패키징
- Play Store 등록 가능
- 장점: 웹 코드 재사용, 높은 네이티브 호환성
- 단점: Android 전용, 일부 네이티브 설정 필요

6. Capacitor / Cordova 래핑

- 웹앱을 네이티브 컨테이너로 감싸서 APK/IPA 생성
- 장점: Play/App Store 모두 등록 가능, 네이티브 플러그인 사용
- 단점: 네이티브 빌드 환경 필요(Xcode/Android Studio)

7. Ionic PWA Toolkit

- 모바일 친화적 UI 컴포넌트 + PWA 빌드 지원
- Capacitor와 호환하여 스토어 배포 가능

8. TWA + Digital Asset Links

- Play Store에 앱 설치 시 도메인과 앱을 연결하여 원활한 도메인-앱 매핑 제공

---

## 추가로 지원 가능한 웹 기능들

- Push 알림 (Web Push, Android 우수; iOS 제한)
- 홈 화면 설치 (Add to Home screen)
- 오프라인 실행 (Service Worker + IndexedDB)
- Background Sync (제한적)
- Periodic Sync (브라우저별 제한)
- Badging API (브라우저 지원 제한)
- Web Share / Share Target
- Media Session API
- Screen Wake Lock
- File System Access (제한적)
- WebAuthn / Credential Management
- Web Bluetooth / WebUSB / NFC (권한·지원 제약)
- getUserMedia / WebRTC
- Payment Request API
- Deep linking / URL handling
- Fullscreen / Orientation lock

---

## 플랫폼 제약 요약

- Android (Chrome 등): PWA 기능 지원이 풍부함 (Push, SW, Badging 등)
- iOS (Safari): Push, Background Sync, Badging 등 제약이 큼 → 푸시가 필요하면 네이티브 래퍼 권장
- Play Store 등록: TWA 또는 Capacitor/Cordova를 사용해서 가능
- App Store 등록: iOS는 PWA 직접 등록 불가 → 네이티브 래퍼(Capacitor 등)로 제출 필요

---

## 권장 전략 (당신의 혈당관리 앱 기준)

- 단순 리마인더·간헐적 푸시: `Minimal PWA` 또는 `Workbox`로 구현 후 `Capacitor`로 래핑하여 Play Store 등록 검토
- 센서 연동·24/7 백그라운드 작업이 필요하면: 네이티브(React Native / Flutter) 고려

---

## 빠른 시작 체크리스트

1. `manifest.json` 작성 (앱명, 아이콘, 테마 색)
2. `sw.js` 생성 → 기본 precache 및 runtime caching 구성
3. HTTPS로 호스팅 (필수)
4. Lighthouse로 PWA 점수 점검
5. Android: TWA 또는 Capacitor로 패키징
6. iOS: Capacitor로 네이티브 빌드 후 App Store 제출

---

원하시면 여기서 `manifest.json`과 `sw.js` 스켈레톤을 `api/`나 루트에 만들어 드리겠습니다.
