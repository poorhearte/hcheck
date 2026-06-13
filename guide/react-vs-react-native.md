# React vs React Native 비교 가이드

React와 React Native의 차이점을 명확히 이해하고, 프로젝트에 맞는 선택을 하기 위한 가이드입니다.

## 📑 목차

- [핵심 차이점](#핵심-차이점)
- [비교 표](#비교-표)
- [사용하는 언어](#사용하는-언어)
- [컴포넌트 비교](#컴포넌트-비교)
- [렌더링 방식](#렌더링-방식)
- [쉬운 비유](#쉬운-비유)
- [프로젝트별 선택 가이드](#프로젝트별-선택-가이드)
- [현재 혈당관리 앱에 맞는 선택](#현재-혈당관리-앱에-맞는-선택)

---

## 핵심 차이점

### React

- **목적**: 웹 UI 개발
- **실행**: 웹 브라우저에서 실행
- **배포**: 웹사이트로 배포
- **예시**: Facebook.com, Netflix.com, Gmail (웹 버전)

### React Native

- **목적**: 모바일 앱 개발
- **실행**: iOS/Android 앱으로 실행
- **배포**: App Store / Play Store에 배포
- **예시**: Facebook 앱, Instagram 앱, Uber 앱 (모바일)

---

## 비교 표

| 구분            | React                         | React Native                        |
| --------------- | ----------------------------- | ----------------------------------- |
| **목적**        | 웹 UI 개발                    | 모바일 앱 개발                      |
| **실행 환경**   | 웹 브라우저                   | iOS/Android 앱                      |
| **UI 컴포넌트** | HTML (`<div>`, `<button>` 등) | 네이티브 (`<View>`, `<Text>` 등)    |
| **배포처**      | 웹서버 (Vercel, AWS 등)       | App Store / Play Store              |
| **성능**        | 좋음 (웹)                     | 우수 (네이티브)                     |
| **개발 언어**   | JavaScript/JSX                | JavaScript/JSX                      |
| **학습곡선**    | 낮음                          | 중간                                |
| **커뮤니티**    | 매우 큼                       | 중간                                |
| **배포 비용**   | 무료~저가                     | $25(Play Store) + $99/년(App Store) |

---

## 사용하는 언어

### 공통점: 둘 다 JavaScript/JSX 사용

```javascript
// React (웹)
import React from "react";

function App() {
  return (
    <div className="card">
      <h1>혈당 기록</h1>
      <p>값: 120 mg/dL</p>
      <button onClick={saveRecord}>저장</button>
    </div>
  );
}

export default App;
```

```javascript
// React Native (모바일)
import React from "react";
import { View, Text, Button } from "react-native";

function App() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>혈당 기록</Text>
      <Text>값: 120 mg/dL</Text>
      <Button title="저장" onPress={saveRecord} />
    </View>
  );
}
```

**공통점**: 같은 JavaScript 로직, JSX 문법  
**차이점**: 컴포넌트와 스타일링만 다름

---

## 컴포넌트 비교

### React (웹) - HTML 태그 사용

```javascript
<div>           // 컨테이너
<button>        // 버튼
<input>         // 입력 필드
<h1>            // 제목
<ul><li>        // 리스트
<form>          // 폼
<img>           // 이미지
```

### React Native (모바일) - 네이티브 컴포넌트 사용

```javascript
<View>              // 컨테이너 (div 대체)
<Button>            // 버튼
<TextInput>         // 입력 필드
<Text>              // 텍스트 (h1, p 대체)
<FlatList>          // 리스트
<ScrollView>        // 스크롤
<Image>             // 이미지
<TouchableOpacity>  // 터치 버튼
```

---

## 렌더링 방식

### React (웹)

```
JavaScript 코드
  ↓
브라우저의 DOM으로 변환
  ↓
HTML/CSS/JavaScript로 렌더링
  ↓
웹페이지 표시
```

### React Native

```
JavaScript 코드
  ↓
iOS/Android 네이티브 코드로 컴파일
  ↓
원본 네이티브 UI 컴포넌트 사용
  ↓
진정한 모바일 앱처럼 실행
```

**핵심**: React Native는 웹 래퍼가 아니라 **진정한 네이티브 앱**입니다.

---

## 쉬운 비유

```
React        = 웹사이트 만드는 도구 (HTML로 렌더링)
React Native = 스마트폰 앱 만드는 도구 (네이티브로 렌더링)

둘 다 같은 언어(JavaScript)를 쓰지만,
만드는 것이 완전히 다른 결과물
```

### 일상 예시

```
React        = 카카오톡 웹 (PC 브라우저에서 채팅)
React Native = 카카오톡 앱 (스마트폰 앱)

같은 회사 제품이지만, 완전히 다른 플랫폼
```

---

## 프로젝트별 선택 가이드

### React를 선택해야 할 때 ✅

- 웹사이트/웹 애플리케이션 개발
- 데스크톱 브라우저에서 사용
- 빠른 개발과 배포
- 기존 웹 기술 활용
- 예: 대시보드, SNS, 이커머스 웹사이트

### React Native를 선택해야 할 때 ✅

- iOS/Android 모바일 앱 필요
- 네이티브 성능 중요
- 앱 스토어 배포 필수
- 모바일 기기 기능 활용 (카메라, GPS 등)
- 예: 카카오톡 앱, 우버 앱, 인스타그램 앱

### 둘 다 필요할 때 ⚠️

```
옵션 1: 별도 개발
- React로 웹 개발
- React Native로 앱 개발
- 단점: 개발 시간 2배, 코드 유지보수 어려움

옵션 2: PWA + Capacitor (권장)
- React로 웹 개발
- PWA로 웹 최적화
- Capacitor로 앱 래핑
- 장점: 한 번의 개발, 웹+앱 모두 지원
```

---

## 현재 혈당관리 앱에 맞는 선택

### 프로젝트 요구사항

- ✅ 웹: 브라우저에서 접속
- ✅ 모바일 앱: Play Store에 배포
- ✅ 데이터 저장: PostgreSQL
- ✅ 최소 개발 시간

### 추천: **PWA + Capacitor** ⭐

```
1. 기존 Vanilla JS (또는 React) 웹앱 유지
2. PWA 설정 추가 (manifest.json + Service Worker)
3. Capacitor로 Android/iOS 앱 래핑
4. Play Store에 배포

결과:
- 웹: https://yourapp.vercel.app에서 접속 가능
- 모바일: Play Store에서 다운로드 설치 가능
- 코드베이스: 1개 (웹과 앱이 동일 코드 사용)
```

---

## 시나리오별 개발 전략

### 시나리오 1: 웹만 필요 (지금 선택 권장)

```
Vanilla JS 또는 React
  ↓
Vercel 배포
  ↓
끝!
```

**개발 시간**: 1주

---

### 시나리오 2: 웹 + Play Store 앱 필요 (현재 상황) ⭐

#### 방법 A: PWA + Capacitor (권장)

```
웹앱 개발 (Vanilla JS 또는 React)
  ↓
PWA 설정 (manifest.json + SW)
  ↓
Capacitor로 앱 래핑
  ↓
Play Store 배포
```

**개발 시간**: 2~3주  
**코드베이스**: 1개  
**전체 비용**: $25

---

#### 방법 B: React + React Native (비권장)

```
React로 웹앱 개발
  ↓
React Native로 앱 개발 (새로 작성)
  ↓
App Store / Play Store 배포
```

**개발 시간**: 4~5주  
**코드베이스**: 2개  
**전체 비용**: $25 + $99/년

---

### 시나리오 3: 네이티브 성능 필수

```
React Native로 앱 개발
  ↓
App Store / Play Store 배포
(웹은 따로 React로 개발)
```

**개발 시간**: 3~4주  
**코드베이스**: 2개  
**전체 비용**: $25 + $99/년

---

## 결론

| 질문                                  | 답변                              |
| ------------------------------------- | --------------------------------- |
| React와 React Native가 같은 언어인가? | ✅ 둘 다 JavaScript/JSX           |
| React로 모바일 앱 만들 수 있나?       | ❌ React는 웹만 가능              |
| React Native로 웹 만들 수 있나?       | ⚠️ 가능하지만 복잡함 (권장 안 함) |
| 웹+앱 모두 필요하면?                  | ✅ PWA + Capacitor 추천           |
| 개발을 가장 빠르게 하려면?            | ✅ PWA + Capacitor                |

---

## 다음 단계

### 현재 프로젝트 진행 순서

1. **기존 웹앱 완성** (지금 상태)
   - Vanilla JS 웹앱
   - API 연동
   - 차트 기능 추가

2. **PWA 설정** (1시간)
   - manifest.json 작성
   - Service Worker 구현
   - 모바일 테스트

3. **Capacitor 설정** (1시간)
   - Capacitor 설치
   - Android 프로젝트 생성

4. **Play Store 배포** (몇 시간)
   - 개발자 계정 등록 ($25)
   - 앱 빌드 및 배포

---

## 참고 자료

- [React 공식 문서](https://react.dev)
- [React Native 공식 문서](https://reactnative.dev)
- [Capacitor 공식 문서](https://capacitorjs.com)
- [PWA 가이드](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
