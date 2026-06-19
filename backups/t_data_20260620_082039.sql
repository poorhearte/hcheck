-- t_data 백업 (7건) 2026-06-19T23:20:39.175Z
-- 복원 예: psql "$DATABASE_URL_UNPOOLED" -f 이파일.sql
BEGIN;
INSERT INTO t_data (ser, created_at, updated_at, type, value, note, memo, start_at, duration) VALUES (3, 'Sun Jun 14 2026 07:01:43 GMT+0900 (Korean Standard Time)', 'Sun Jun 14 2026 07:02:02 GMT+0900 (Korean Standard Time)', 'glucose', '131.00', NULL, NULL, NULL, NULL);
INSERT INTO t_data (ser, created_at, updated_at, type, value, note, memo, start_at, duration) VALUES (6, 'Mon Jun 15 2026 05:11:49 GMT+0900 (Korean Standard Time)', 'Mon Jun 15 2026 05:12:15 GMT+0900 (Korean Standard Time)', 'glucose', '110.00', NULL, NULL, NULL, NULL);
INSERT INTO t_data (ser, created_at, updated_at, type, value, note, memo, start_at, duration) VALUES (7, 'Tue Jun 16 2026 05:01:33 GMT+0900 (Korean Standard Time)', 'Tue Jun 16 2026 05:01:51 GMT+0900 (Korean Standard Time)', 'glucose', '131.00', NULL, NULL, NULL, NULL);
INSERT INTO t_data (ser, created_at, updated_at, type, value, note, memo, start_at, duration) VALUES (8, 'Wed Jun 17 2026 05:13:57 GMT+0900 (Korean Standard Time)', 'Wed Jun 17 2026 05:14:09 GMT+0900 (Korean Standard Time)', 'glucose', '119.00', NULL, NULL, NULL, NULL);
INSERT INTO t_data (ser, created_at, updated_at, type, value, note, memo, start_at, duration) VALUES (9, 'Thu Jun 18 2026 05:22:58 GMT+0900 (Korean Standard Time)', 'Thu Jun 18 2026 05:23:09 GMT+0900 (Korean Standard Time)', 'glucose', '149.00', NULL, NULL, NULL, NULL);
INSERT INTO t_data (ser, created_at, updated_at, type, value, note, memo, start_at, duration) VALUES (10, 'Fri Jun 19 2026 04:57:53 GMT+0900 (Korean Standard Time)', 'Fri Jun 19 2026 04:58:04 GMT+0900 (Korean Standard Time)', 'glucose', '133.00', NULL, NULL, NULL, NULL);
INSERT INTO t_data (ser, created_at, updated_at, type, value, note, memo, start_at, duration) VALUES (11, 'Sat Jun 20 2026 06:25:01 GMT+0900 (Korean Standard Time)', 'Sat Jun 20 2026 06:25:16 GMT+0900 (Korean Standard Time)', 'glucose', '120.00', NULL, NULL, NULL, NULL);
COMMIT;
