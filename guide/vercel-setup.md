# Vercel DB 셋업 가이드

## 1단계: Vercel 계정 및 프로젝트 생성

1. [vercel.com](https://vercel.com)에서 GitHub/GitLab/Bitbucket 계정으로 가입
2. 새 프로젝트 생성:
   - "Import Project" → "Git Repository" 선택
   - 또는 "New Project" → "Create Git Repository"
3. 프로젝트명: `hcheck` (또는 원하는 이름)

## 2단계: Vercel Postgres DB 초기화

1. Vercel Dashboard → 프로젝트 선택
2. "Storage" 탭 클릭
3. "Create Database" → "Postgres" 선택
4. DB명: `glucose_db` (또는 원하는 이름)
5. Region: 기본값 (또는 가장 가까운 지역)
6. "Create" 클릭

**자동 생성 항목**:
- `POSTGRES_PRISMA_URL` (연결 URL)
- `POSTGRES_URL_NON_POOLING` (논-풀링 연결)

이 정보는 자동으로 환경변수 설정됩니다.

## 3단계: 테이블 생성

Vercel Dashboard → Storage → Database 선택 → "Query" 탭에서 SQL 실행:

```sql
CREATE TABLE glucose_records (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  value DECIMAL(10, 2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_glucose_timestamp ON glucose_records(timestamp DESC);
```

## 4단계: 환경변수 확인

Vercel Dashboard → Settings → Environment Variables에서 확인:
- `POSTGRES_URL_NON_POOLING` (클라이언트용 권장)

로컬에서 테스트하려면 `.env.local` 파일 생성:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
POSTGRES_URL_NON_POOLING=postgres://user:password@host:port/dbname
```

(실제 값은 Vercel Dashboard에서 복사)

## 5단계: 로컬 개발 (Node.js 필요)

```bash
# 프로젝트 폴더에서
npm install @vercel/postgres

# 또는
yarn add @vercel/postgres
```

## 6단계: 배포

```bash
# 로컬에서 Git 커밋
git add .
git commit -m "Add Vercel DB integration"
git push

# Vercel이 자동으로 배포 (GitHub 연동 시)
```

## 주의사항

- **공개 URL에 민감정보 노출금지**: DB 연결 문자열을 클라이언트 환경변수에 넣지 않기
- **환경변수**: `NEXT_PUBLIC_` 접두어는 브라우저에 노출되므로 사용 금지
- **서버 API 구축**: API 경로에서만 DB 연결하기 (권장)

---

현재 이 프로젝트는 **순수 HTML/CSS/JS 웹앱**이므로, 두 가지 선택지가 있습니다:

**A. 간단함 (권장)**: Vercel Serverless Functions 사용
- `api/` 폴더에 Node.js 엔드포인트 작성
- 프론트에서 API 호출

**B. 풀스택**: Next.js로 마이그레이션
- React + Next.js 구조로 전환
- API 경로 자동 생성

현재 가이드는 **A번 방식**으로 진행합니다 (기존 구조 유지).
