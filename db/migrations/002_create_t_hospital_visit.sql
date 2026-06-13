-- 001_create_glucose_records.sql
-- Run this in Neon Query editor or via psql using your unpooled host

-- DROP TABLE public.t_hospital_visit;
CREATE TABLE IF NOT EXISTS t_hospital_visit(
  ser SERIAL PRIMARY KEY,
  data_ser int4, -- t_data의 ser 참조, 방문마다 여러 혈당 기록 가능하도록
  created_at 			TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- CURRENT_TIMESTAMP=now(), CURRENT_TIMESTAMP가 SQL표준이라서 사용하겠음
  updated_at          	TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type varchar, --HbA1c 당화혈색소, 혈당blood sugar
  value NUMERIC(10,2), --int와 달리 소수점 지원
  note varchar,
  memo varchar,
  start_at TIMESTAMP,
  duration INTERVAL
);

-- CREATE INDEX IF NOT EXISTS idx_t_hospital_visit_timestamp ON t_hospital_visit (created_at DESC);
