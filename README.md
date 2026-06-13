간단한 혈당관리 앱 (Vercel DB 연동)

설명

- 혈당 수치를 입력받아 Vercel Postgres DB에 저장하는 웹 앱
- Vercel Serverless Functions로 API 서버 제공
- 오프라인 폴백: localStorage 사용 (인터넷 없을 때 로컬 저장)

빠른 시작

## 개발 환경 (로컬)

```bash
# 프로젝트 폴더에서
npm install

# 개발 서버 시작 (필요시)
npm run dev
```

브라우저에서 `index.html` 파일을 열어 사용합니다:

- 로컬: `file:///path/to/hcheck/index.html`
- 또는 VSCode의 Live Server 확장으로 실행

**주의**: 로컬에서는 Vercel DB에 연결할 수 없으므로, 데이터가 localStorage에 저장됩니다.

## Vercel 배포 (클라우드)

### 1단계: Vercel 프로젝트 생성 및 DB 연동

[guide/vercel-setup.md](guide/vercel-setup.md) 참고 — Vercel Postgres DB 초기화 가이드

### 2단계: Git 배포

```bash
# 리포지토리 생성 및 푸시
git init
git add .
git commit -m "Initial commit - glucose management app"
git remote add origin https://github.com/YOUR_USERNAME/hcheck.git
git push -u origin main

# Vercel에서 자동으로 배포 (GitHub 연동 후)
```

또는 Vercel CLI 사용:

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

### 3단계: 환경변수 설정

Vercel Dashboard → Settings → Environment Variables:

- `POSTGRES_URL_NON_POOLING` (자동으로 설정됨)

### 4단계: 배포 확인

배포 후 앱에 접속하면 Vercel Postgres DB에 직접 데이터 저장됩니다.

파일 구조

```
hcheck/
├── index.html          # 메인 UI
├── app.js              # 클라이언트 로직 (API 호출)
├── styles.css          # 스타일
├── package.json        # 의존성 (Node.js용 — 배포 시만 필요)
├── vercel.json         # Vercel 설정
├── .env.example        # 환경변수 템플릿
├── .env.local          # 로컬 환경변수 (git 무시)
├── api/
│   └── glucose.js      # Serverless Function (POST/GET/DELETE)
├── guide/
│   ├── vercel-setup.md # Vercel DB 셋업 가이드
│   └── dev.md          # 개발 및 DB 선택 사항
└── README.md           # 이 파일

기능

- **혈당 기록 입력**: 수치 + 선택적 메모 + 시간(수정 가능)
- **기록 목록**: 시간순 정렬 + 최신값/평균값 표시
- **기록 삭제**: 개별 삭제 버튼
- **모두 삭제**: 전체 데이터 삭제 (확인 필요)
- **오프라인 지원**: 인터넷 없을 때 localStorage 사용

향후 기능 계획

- [ ] 혈당 차트 (Chart.js 추가)
- [ ] 식사 기록
- [ ] 인슐린 기록
- [ ] 알림
- [ ] PWA 변환 (오프라인 모드)
- [ ] 데이터 내보내기 (CSV)

개발 가이드

**데이터 저장 아키텍처**:
```

클라이언트 (app.js)
↓ fetch
API (api/glucose.js)
↓ SQL
Vercel Postgres DB

```

**추상화 계층**: API 엔드포인트(`api/glucose.js`)를 수정하면 코드 재사용성 높음
- 나중에 다른 DB로 이전 시 `api/` 폴더만 수정하면 됨

라이선스

개인 학습/사용 목적
```
