-- 002_create_hospital_visit.sql
-- 병원 진료 기록 테이블 (혈당 t_data 와 분리)
-- Run this in Neon Query editor or via psql using your unpooled host

-- 신규 설치용 (기존 테이블이 있으면 무시됨)
CREATE TABLE IF NOT EXISTS t_hospital_visit(
  ser SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  start_at    TIMESTAMP,   -- 예약시간 (년월일 시분, 로컬 기준)
  duration    INTERVAL,    -- 소요시간 (몇시간 몇분)
  hospital    varchar,     -- 병원명
  memo        varchar      -- 메모
);

-- 이미 만들어진 테이블 보정 (없는 컬럼만 추가, 여러 번 실행해도 안전)
ALTER TABLE t_hospital_visit ADD COLUMN IF NOT EXISTS start_at TIMESTAMP;
ALTER TABLE t_hospital_visit ADD COLUMN IF NOT EXISTS duration INTERVAL;
ALTER TABLE t_hospital_visit ADD COLUMN IF NOT EXISTS hospital varchar;
ALTER TABLE t_hospital_visit ADD COLUMN IF NOT EXISTS memo varchar;
