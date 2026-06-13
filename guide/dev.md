1. 데이터 저장 (RDB) — 요구 및 권장

- 목표: 무료로 시작 가능한 관리형 RDB를 사용하여 기록을 영구 저장하고, 필요시 백업 및 확장이 가능해야 함.
- 후보 서비스 및 비교표:

| 항목                | Supabase                 | ElephantSQL      | Railway            | Neon             | PlanetScale      | Vercel DB               |
| ------------------- | ------------------------ | ---------------- | ------------------ | ---------------- | ---------------- | ----------------------- |
| **DB 엔진**         | PostgreSQL               | PostgreSQL       | PostgreSQL         | PostgreSQL       | MySQL 8.0+       | PostgreSQL              |
| **무료 기간**       | 영구 (일부 제한)         | 영구 (5MB)       | 크레딧 ($5/월)     | 영구 (일부 제한) | 영구 (일부 제한) | 영구 (일부 제한)        |
| **저장용량**        | 500MB (무료)             | 5MB              | $5 크레딧 내       | 3GB (무료)       | 5GB (무료)       | 1GB (무료)              |
| **동시연결**        | 제한 없음                | 1개              | 크레딧 내          | 3개              | 제한 없음        | 제한 없음               |
| **백업**            | 일일 자동                | 없음             | 크레딧 내          | 자동             | 자동             | 자동                    |
| **SSL/보안**        | ✓                        | ✓                | ✓                  | ✓                | ✓                | ✓                       |
| **JS 클라이언트**   | supabase-js (최고)       | psycopg2/node-pg | 직접               | node-postgres    | mysql2           | @vercel/postgres (편의) |
| **REST API**        | ✓ (자동 생성)            | ✗                | ✗                  | ✗ (Proxy 유료)   | ✗ (Proxy 유료)   | ✗                       |
| **실시간 기능**     | ✓                        | ✗                | ✗                  | ✗                | ✗                | ✗                       |
| **인증/권한**       | 내장 (Auth)              | ✗                | ✗                  | ✗                | ✗                | ✗                       |
| **설정 난이도**     | 매우 쉬움                | 쉬움             | 중간               | 중간             | 중간             | 쉬움                    |
| **데이터 레지던시** | US (기본), EU 옵션       | US, EU           | 선택 가능          | US, EU, APAC     | US, EU, APAC     | US (기본)               |
| **Vercel 통합**     | 낮음                     | 낮음             | 낮음               | 낮음             | 낮음             | 매우 높음 (최적)        |
| **권장 용도**       | 빠른 스타트, 실시간 필요 | 테스트/PoC       | 배포 편의성 중요시 | 확장성 필요      | 높은 성능/확장성 | Vercel 배포 시 최적     |

**Neon vs Supabase**:

- **Neon**: PostgreSQL 서버리스 제공자입니다. Vercel과 통합하여 DB 연결을 쉽게 해주며, 별도 백엔드 플랫폼 없이 순수 DB를 제공합니다.
- **Supabase**: PostgreSQL 기반 백엔드 플랫폼입니다. DB 외에도 인증(Auth), 스토리지, 자동 REST API, 실시간 기능 등을 함께 제공해서 풀스택 개발에 유리합니다.
- **차이점 요약**:
  - Neon은 **DB 서비스** 그 자체
  - Supabase는 **DB + Backend-as-a-Service**
  - Neon은 DB만 필요할 때 더 간단하고 비용 예측이 쉬움
  - Supabase는 인증/실시간/REST 기능이 필요할 때 빠르게 개발 가능

- 결정기준:
  - 장기 무료 사용 가능 여부 vs 무료 크레딧
  - 저장 용량/동시연결 제한
  - 백업/스냅샷 지원 여부
  - 보안 및 데이터레지던시 필요성
  - 웹/JS 클라이언트 연동의 용이성

- 권장안(초기): Supabase 무료 tier로 시작 — 빠르게 연동해서 기능 구현 및 검증 후 필요하면 다른 매니지드 DB로 이전.

**주의: Supabase에서 다른 DB로 이전 시 고려사항**

- **문제점**: Supabase의 자동 REST API와 JS 클라이언트(`supabase-js`)는 Supabase 종속적 코드가 될 수 있음.
- **실제 영향**:
  - 테이블 스키마(SQL) 자체는 표준 PostgreSQL이므로 내보내기 쉬움.
  - 하지만 프론트 코드에 `supabase-js` 라이브러리가 많이 포함되면 이전 시 수정 범위가 큼.
- **해결 방안** (추천):
  1. **추상화 계층 만들기**: 프론트에서 직접 `supabase-js` 호출하지 말고, `api.js` 같은 별도 파일에서 함수로 감싸기.
     ```javascript
     // api.js (한 곳에만 Supabase 호출)
     export async function saveGlucose(value, timestamp, note) {
       return supabase
         .from("glucose_records")
         .insert([{ value, timestamp, note }]);
     }
     // App.js (추상화된 함수만 사용)
     import { saveGlucose } from "./api.js";
     await saveGlucose(120, new Date(), "기록");
     ```
  2. **나중에 이전할 때**: `api.js`만 수정하면 프론트 코드 손상 최소화.
  3. **데이터 백업**: 정기적으로 PostgreSQL 덤프 또는 CSV로 내보내기 (Supabase 제공 기능).

---

2. Supabase vs Vercel DB 선택 기준

**Supabase 선택하면 좋은 경우**:

- 실시간 기능 필요 (다중 기기 동시 업데이트 필요 시) ✓
- REST API 자동 생성 활용 (복잡한 쿼리/필터 자주 함) ✓
- 내장 인증 필요 (회원가입/로그인) ✓
- 비Vercel 배포 계획 (GitHub Pages, Netlify, 자체호스팅 등) ✓
- 더 많은 웹 개발 자료 필요 ✓

**Vercel DB 선택하면 좋은 경우**:

- Vercel에 배포 예정 (최고 통합, 한 곳에서 관리) ✓
- 저장용량 2배 필요 (1GB vs 500MB) ✓
- 간단한 쿼리만 사용 ✓
- 배포 설정을 최소화하고 싶음 ✓

**Vercel DB 지역 정보**:

- Vercel이 직접 Postgres를 제공하던 시절은 종료되었고, 현재는 Marketplace를 통해 Neon 같은 Postgres 공급자를 연결합니다.
- 따라서 "Washington, D.C., USA (East)만 무료"라는 제한은 Vercel 자체 정책이 아니라, 실제 공급자(Neon 등)의 지역 정책에 따라 달라집니다.
- 일반적으로 Vercel Marketplace 통합에서는 선택 가능한 지역이 제공되며, 무료 테어가 특정 지역에만 제한되는 경우도 있지만 전체적으로는 여러 리전 중 선택할 수 있습니다.
- 정확한 무료 리전은 선택하는 공급자와 플랜에 따라 다르므로, 실제 생성 화면에서 확인하는 것이 안전합니다.

**Neon DB 사용 가능 지역** (Vercel Marketplace에서 선택 가능):
| 지역 | 코드 | 비고 |
|------|------|------|
| Washington, D.C., USA (East) | iad1 | ⭐ Recommended (무료 기본 권장) |
| Cleveland, USA (East) | Cle1 | 무료 |
| Portland, USA (West) | Pdx1 | 무료 |
| Frankfurt, Germany (West) | Fra1 | 무료 |
| London, United Kingdom (West) | Lhr1 | 무료 |
| Sydney, Australia (Southeast) | Syd1 | 무료 |
| Singapore (Southeast) | Sin1 | 무료 (한국에서 최저 지연) |
| São Paulo, Brazil (East) | Gru1 | 무료 |

- **추천**: 한국에서 사용하면 **Singapore** 선택이 최고의 성능을 제공합니다. 그 다음 **Frankfurt** 또는 **London**을 선택해도 괜찮습니다. 안정성 최우선이면 **Washington D.C.** 선택하면 됩니다.
- **모든 지역이 무료 범위 내 제공**되므로, 속도와 규정(데이터 레지던시)에 따라 선택하면 됩니다.

**사용 사례별 추천**:
| 시나리오 | 추천 | 이유 |
|--------|------|------|
| 개인 혈당 기록 + Vercel 배포 | **Vercel DB** | 통합 최적, 설정 간단 |
| 개인 혈당 기록 + 다른 배포 | **Supabase** | REST API + 유연성 |
| 가족 공유 + 실시간 동기화 | **Supabase** | 실시간 기능 필수 |
| 의료팀 협력 + 복잡한 쿼리 | **Supabase** | REST API 필터링 강력 |

**마이그레이션 관점**:

- 둘 다 PostgreSQL 기반 → 데이터 덤프로 쉽게 이전 가능.
- 추상화 계층 있으면 코드 수정 최소화.

**MySQL / MariaDB 옵션**:

- Vercel 자체는 주로 PostgreSQL 계열을 제공합니다. MySQL/MariaDB를 직접 생성하는 메뉴는 기본 Vercel DB에서 제공되지 않습니다.
- **AWS RDS MySQL / AWS RDS MariaDB** 같은 외부 DB는 Vercel 앱에서 충분히 사용할 수 있습니다.
- 이 경우 다음이 필요합니다:
  1. 외부 DB 연결 문자열
  2. MySQL/MariaDB 드라이버 설치 (`mysql2`, `mariadb`, `Prisma` 등)
  3. SQL 문법 및 API 코드 수정
  4. 네트워크 설정(퍼블릭 엔드포인트, 보안 그룹, SSL 등)
- **왜 PostgreSQL 기반이 더 일반적인가**:
  - Vercel과 통합이 더 쉽다
  - 현재 코드가 PostgreSQL 문법 기반이다
  - MySQL/MariaDB는 추가 설정과 코드 변경이 필요하다
- **그래도 MySQL/MariaDB를 선택할 때**:
  - 기존 데이터가 MySQL/MariaDB에 이미 있는 경우
  - 특정 도구/라이브러리가 MySQL을 요구하는 경우
  - RDS의 특정 기능(Aurora 등)이 필요한 경우
- **추천**: 새로운 앱이라면 PostgreSQL 기반을 유지하는 편이 더 간단하고 빠릅니다.

**최종 추천** (현재 상황 모름):

- **일단 Supabase 권장** — 더 많은 기능이 필요할 때 문제 없음. 나중에 Vercel DB로 이전도 간단.
- **확실히 Vercel 배포할 거면** → Vercel DB (간단, 한 대시보드 관리)

---

3. 플레이 스토어 배포 시 호스팅 및 비용 고려사항

**중요: 현재 앱은 웹 앱입니다**

- 현재 만드는 것: HTML/CSS/JavaScript 웹 앱
- 플레이 스토어: Android 앱(.apk/.aab) 형식만 등록 가능
- **직접 등록 불가**: 웹 앱을 그대로 플레이 스토어에 올릴 수 없음

**플레이 스토어 등록을 위한 선택지**:

| 방식                      | 설명                                           | 호스팅 필요          | 비용                             |
| ------------------------- | ---------------------------------------------- | -------------------- | -------------------------------- |
| **PWA (권장)**            | 웹 앱을 Android 앱처럼 래핑 (Capacitor, Tauri) | **필수** (Vercel)    | Vercel 호스팅만 (무료/유료)      |
| **React Native 재작성**   | 웹 코드를 React Native로 다시 씀               | 백엔드만 필요 (선택) | Supabase 무료 또는 백엔드 호스팅 |
| **Flutter 재작성**        | Dart로 완전히 다시 씀                          | 선택                 | Supabase 무료 또는 백엔드 호스팅 |
| **WebView 래퍼 (비추천)** | Android 앱이 웹을 띄우기만 함                  | **필수** (Vercel)    | Vercel 호스팅만 (무료/유료)      |

**PWA (가장 간단) 선택 시 Vercel 호스팅 비용**:

**무료 tier (Vercel Hobby)**:

- 무제한 배포
- 매월 100GB 대역폭 (충분)
- 매월 100시간 서버리스 함수 (필요 없음)
- **추가 비용: 0원**
- 제약: 소규모 앱에 충분

**Pro tier (Vercel Pro)** — 유료 전환 필요한 경우:

- $20/월 (또는 더 높은 플랜)
- 월간 대역폭 1TB
- 서버리스 함수 무제한
- 우선 지원

**플레이 스토어 등록 자체 비용**:

- **Google Play 개발자 계정**: $25 (일회성)
- **앱 호스팅 비용**: Vercel 무료 또는 Pro

**결론: 플레이 스토어 등록 시**:

1. **PWA + Vercel 무료 호스팅**: 충분 (대부분의 혈당 관리 앱 수준)
   - 초기 비용: 구글 $25만 필요
   - 월간 호스팅 비용: 0원
2. **트래픽 많으면**: Vercel Pro $20/월 (나중에 필요할 때만)
3. **DB 비용**: Supabase/Vercel DB 무료 tier 충분 (개인 앱 수준)

**예상 총 비용** (초기):

- 개발: 무료 (자신이 함)
- 호스팅: 무료 (Vercel Hobby)
- DB: 무료 (Supabase/Vercel DB)
- 플레이스토어 등록: $25 (일회성)
- **월간 운영비: $0** (트래픽 적을 때)

---

**4. DB 선택 확정: Vercel DB (2026-06-13)**

- **결정**: Vercel DB 선택
- **이유**: Vercel 호스팅 통합 최적, 1GB 무료 저장, 설정 간단, Vercel Hobby 무료
- **완료된 작업** (2026-06-13):
  1. ✅ Vercel DB 비교 분석 (Supabase vs Vercel DB vs 기타)
  2. ✅ Vercel Serverless Functions 기반 API 설계 (`/api/glucose.js`)
  3. ✅ 앱 코드 업데이트 (localStorage → Vercel DB API 호출)
  4. ✅ 환경설정 파일 작성 (package.json, vercel.json, .env.example)
  5. ✅ 배포 가이드 작성 (README.md, guide/vercel-setup.md)
  6. ✅ 오프라인 폴백 (API 오류 시 localStorage 사용)

- **다음 단계**:
  1. Vercel 프로젝트 생성 및 Vercel Postgres DB 초기화 (guide/vercel-setup.md 참고)
  2. 테이블 스키마 실행 (SQL)
  3. Git 배포 및 환경변수 설정
  4. 실제 배포 후 테스트
  5. 차트 기능 추가 (필요시)
  6. PWA 변환 (플레이스토어 등록 시)

---
