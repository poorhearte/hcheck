-- 001_create_glucose_records.sql
-- Run this in Neon Query editor or via psql using your unpooled host

CREATE TABLE IF NOT EXISTS t_data(
  ser SERIAL PRIMARY KEY,
  created_at 			TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- CURRENT_TIMESTAMP=now(), CURRENT_TIMESTAMP가 SQL표준이라서 사용하겠음
  updated_at          	TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type varchar,
  value NUMERIC(10,2), --int와 달리 소수점 지원
  note varchar,
);

-- CREATE INDEX IF NOT EXISTS idx_t_data_timestamp ON t_data (created_at DESC);
