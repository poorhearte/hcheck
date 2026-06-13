# 모바일 & PC 멀티플랫폼 배포 가이드

현재 웹 앱을 모바일(iOS/Android) 및 PC 플랫폼에서 동작하도록 지원하는 방식의 비교 및 추천 로드맵입니다.

## 📑 목차

- [1. PWA (Progressive Web App)](#1-pwa-progressive-web-app--추천-1단계)
- [2. PWA + Capacitor](#2-pwa--capacitor--추천-최적)
- [3. React Native](#3-react-native-전체-리팩토링)
- [4. Flutter](#4-flutter-전체-리팩토링)
- [5. Tauri](#5-tauri-가벼운-버전)
- [추천 로드맵](#추천-로드맵-)
  - [Phase 1: PWA 구현](#phase-1-pwa-구현-우선순위-높음)
  - [Phase 2: Capacitor로 Play Store 배포](#phase-2-capacitor로-play-store-배포-우선순위-중간)
  - [Phase 3: iOS 지원](#phase-3-ios-지원-우선순위-낮음)
- [빠른 비교 표](#빠른-비교-표)
- [추천](#추천)

---

## 1. PWA (Progressive Web App) ⭐ 추천 (1단계)

### 개요

```
현재 웹앱 → manifest.json + Service Worker 추가
```

### 특징

- **설정**: 10분 이내
- **개발 변경**: 최소화 (기존 코드 유지)
- **플랫폼 지원**: 모든 모던 브라우저 (iOS Safari, Chrome, Firefox 등)
- **기능**:
  - 홈 화면에 앱 아이콘으로 설치
  - 오프라인 지원 (Service Worker 캐싱)
  - 푸시 알림 (일부 브라우저)
  - 네이티브 앱처럼 전체 화면 실행

### 장점

- 가장 빠른 구현
- 모바일 최적화된 반응형 UI만으로 충분
- Play Store 등 앱 스토어 별도 배포 불필요
- 업데이트가 자동 반영

### 단점

- App Store / Play Store에 정식 앱으로 등록 불가
- 웹 기반이므로 네이티브 플러그인(카메라 등) 일부 제한

### 대상 사용자

- 웹만 사용해도 충분한 경우
- Play Store 배포 불필요

### 추가 설정

```
프로젝트 루트에 추가할 파일:
- manifest.json (앱 메타데이터)
- sw.js (Service Worker - 오프라인 캐싱)
- index.html에 manifest 링크 추가
```

---

## 2. PWA + Capacitor ⭐ 추천 (최적)

### 개요

```
PWA 완성 → Capacitor로 iOS/Android 래핑 → App Store/Play Store 배포
```

### 특징

- **설정**: 30분~1시간
- **개발 변경**: 기존 웹 코드 그대로 사용
- **플랫폼 지원**: iOS, Android, Web, Electron(데스크톱)
- **Play Store 배포**: 가능 ✅

### 구현 흐름

```
1. PWA 완성 (manifest.json + Service Worker)
2. Capacitor 설치: npm install @capacitor/core @capacitor/cli
3. capacitor init 실행
4. capacitor android / capacitor ios로 네이티브 프로젝트 생성
5. Android Studio / Xcode로 빌드 및 배포
```

### 장점

- 기존 웹 코드 그대로 재사용
- Play Store / App Store 정식 배포 가능
- 네이티브 플러그인 접근 가능:
  - Camera API
  - Geolocation
  - Notifications
  - File System
  - etc.
- 크로스 플랫폼: 한 코드베이스로 iOS/Android 모두 지원

### 단점

- 네이티브 프로젝트 관리 필요 (Android Studio 등)
- Play Store 등록 비용: $25 (일회)
- App Store 배포: 맥 필수, 연간 $99

### 대상 사용자

- Play Store 배포 필수
- 네이티브 기능 필요 (선택적)
- 모바일 앱으로서의 공식 배포 원함

### 배포 비용

| 플랫폼     | 비용 | 주기 |
| ---------- | ---- | ---- |
| Play Store | $25  | 일회 |
| App Store  | $99  | 연간 |
| 웹         | 무료 | -    |

---

## 3. React Native (전체 리팩토링)

### 개요

```
현재 코드 → React Native로 전체 재작성
```

### 특징

- **설정**: 며칠~주 단위
- **개발 언어**: JavaScript (React)
- **플랫폼 지원**: iOS, Android, Web (Expo Web)

### 장점

- 네이티브 성능
- React 친숙 (이미 알면 학습곡선 낮음)
- Expo로 빠른 프로토타이핑
- 큰 커뮤니티

### 단점

- **기존 코드 사용 불가** (완전 재작성 필요)
- 번들 크기 큼
- 웹 버전은 별도 지원 (React Native Web)

### 대상 사용자

- 장기 프로젝트
- 네이티브 성능 필수
- React 경험 있음

---

## 4. Flutter (전체 리팩토링)

### 개요

```
현재 코드 → Flutter로 전체 재작성 (Dart)
```

### 특징

- **설정**: 며칠~주 단위
- **개발 언어**: Dart
- **플랫폼 지원**: iOS, Android, Web, Desktop

### 장점

- 뛰어난 성능
- 아름다운 기본 UI 컴포넌트
- 빠른 개발 (Hot Reload)
- 웹 지원도 포함

### 단점

- **기존 코드 사용 불가** (Dart로 재작성)
- 새로운 언어 학습 필요
- 한국 커뮤니티 작음

### 대상 사용자

- 장기 프로젝트
- 고성능 UI/UX 중요
- Dart 학습에 시간 투자 가능

---

## 5. Tauri (가벼운 버전)

### 개요

```
현재 웹앱 → Tauri로 래핑
```

### 특징

- **설정**: 30분~1시간
- **개발 언어**: Rust + JavaScript (혼합)
- **플랫폼**: 데스크톱(Windows, macOS, Linux), 모바일(베타)

### 장점

- 매우 가벼운 번들 크기
- 빠른 성능 (Rust 기반)
- 웹 프론트엔드 그대로 사용

### 단점

- 모바일 지원 아직 베타 상태
- Rust 학습 필요 (플러그인 작성 시)
- 모바일 앱 스토어 배포 미성숙

### 대상 사용자

- 데스크톱 앱도 필요한 경우
- 가벼운 앱 중요
- 모바일은 선택사항

---

## 추천 로드맵 🗺️

### Phase 1: PWA 구현 (우선순위: 높음)

**예상 시간**: 1~2시간

```
1. manifest.json 작성 (앱 이름, 아이콘, 테마 색상)
2. Service Worker (sw.js) 작성 (오프라인 캐싱)
3. index.html에 manifest 링크 추가
4. 모바일 뷰포트 메타 태그 확인
5. 모바일 기기에서 테스트
```

**결과**: 모바일 브라우저에서 앱처럼 설치 가능

---

### Phase 2: Capacitor로 Play Store 배포 (우선순위: 중간)

**예상 시간**: 2~3시간

```
1. Phase 1 완료 필수
2. Capacitor CLI 설치
3. capacitor init로 프로젝트 생성
4. capacitor android로 Android 프로젝트 생성
5. Android Studio로 빌드 및 테스트
6. Play Store 개발자 계정 등록 ($25)
7. Play Store에 앱 업로드
```

**결과**: Play Store에서 공식 앱으로 배포 및 설치 가능

---

### Phase 3: iOS 지원 (우선순위: 낮음)

**예상 시간**: 2~3시간 + 맥 필수

```
1. capacitor ios로 iOS 프로젝트 생성
2. Xcode로 빌드
3. App Store 개발자 계정 ($99/년)
4. App Store에 배포
```

**필수 조건**: 맥 컴퓨터, App Store 계정

---

## 빠른 비교 표

| 구분                 | PWA  | PWA+Capacitor | React Native | Flutter | Tauri |
| -------------------- | ---- | ------------- | ------------ | ------- | ----- |
| **설정 시간**        | 10분 | 1시간         | 며칠         | 며칠    | 1시간 |
| **기존 코드 재사용** | ✅   | ✅            | ❌           | ❌      | ✅    |
| **Play Store 배포**  | ❌   | ✅            | ✅           | ✅      | ❌    |
| **App Store 배포**   | ❌   | ✅            | ✅           | ✅      | ❌    |
| **웹 지원**          | ✅   | ✅            | ⚠️           | ✅      | ❌    |
| **성능**             | 좋음 | 좋음          | 우수         | 우수    | 우수  |
| **학습곡선**         | 낮음 | 낮음          | 중간         | 높음    | 높음  |
| **배포 비용**        | 무료 | $25+          | 무료         | 무료    | 무료  |

---

## 추천

### 🎯 최적의 선택: **PWA + Capacitor**

**이유**:

1. 기존 웹 코드 100% 재사용
2. 최소 설정으로 Play Store 배포 가능
3. 총 개발 시간 3~4시간
4. 웹/Android/iOS 모두 지원 (단계별)
5. 비용 최소화 ($25 일회)

**시작하기**: Phase 1 (PWA)부터 시작 → 테스트 후 Phase 2 (Capacitor) 진행

---

## 참고 자료

- [PWA 공식 문서](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Capacitor 공식 문서](https://capacitorjs.com/)
- [Play Store 앱 등록](https://play.google.com/console)
- [App Store 앱 등록](https://appstoreconnect.apple.com/)
