import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      // 병원 진료 기록 추가. start_at 은 시간대 없는 컬럼이므로 로컬 문자열 그대로 저장
      const { reservedAt, durationMinutes, hospital, memo } = req.body;

      const startAt = reservedAt || null; // 'YYYY-MM-DDTHH:MM' 로컬 문자열
      const mins = (durationMinutes === '' || durationMinutes == null)
        ? null
        : parseInt(durationMinutes, 10);

      const result = await sql`
        INSERT INTO t_hospital_visit (start_at, duration, hospital, memo)
        VALUES (
          ${startAt},
          ${mins}::int * interval '1 minute',
          ${hospital || null},
          ${memo || null}
        )
        RETURNING ser as id;
      `;

      return res.status(201).json(result.rows[0]);
    }

    if (req.method === 'GET') {
      // 병원 진료 기록 조회. 예약시간은 표시용 문자열, 소요시간은 분 단위로 환산
      const result = await sql`
        SELECT ser as id,
               to_char(start_at, 'YYYY-MM-DD HH24:MI') AS start_at,
               (EXTRACT(EPOCH FROM duration) / 60)::int AS duration_minutes,
               hospital,
               memo
        FROM t_hospital_visit
        ORDER BY start_at DESC NULLS LAST, created_at DESC
        LIMIT 100;
      `;

      return res.status(200).json(result.rows);
    }

    if (req.method === 'DELETE') {
      // 기록 삭제
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID는 필수입니다' });
      }

      await sql`DELETE FROM t_hospital_visit WHERE ser = ${id};`;

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Hospital API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
