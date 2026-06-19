-- 001_create_glucose_records.sql
-- Run this in Neon Query editor or via psql using your unpooled host

-- DROP TABLE public.t_data;
CREATE TABLE IF NOT EXISTS t_data(
  ser SERIAL PRIMARY KEY,
  created_at 			TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- CURRENT_TIMESTAMP=now(), CURRENT_TIMESTAMP가 SQL표준이라서 사용하겠음
  updated_at          	TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type varchar, --HbA1c 당화혈색소, 혈당blood sugar
  value NUMERIC(10,2), --int와 달리 소수점 지원
  note varchar,
  memo varchar,
  start_at TIMESTAMP,
  duration INTERVAL
);

-- CREATE INDEX IF NOT EXISTS idx_t_data_timestamp ON t_data (created_at DESC);
