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
      // 혈당 기록 추가
      const { value, timestamp, note } = req.body;

      if (!value) {
        return res.status(400).json({ error: '혈당 수치는 필수입니다' });
      }

      const ts = timestamp ? new Date(timestamp) : new Date();

      const result = await sql`
        INSERT INTO t_data (created_at, value, type, note)
        VALUES (${ts.toISOString()}, ${parseFloat(value)}, 'glucose', ${note || null})
        RETURNING *;
      `;

      return res.status(201).json(result.rows[0]);
    }

    if (req.method === 'GET') {
      // 혈당 기록 조회
      const result = await sql`
        SELECT ser as id, created_at as timestamp, value, note FROM t_data
        WHERE type = 'glucose'
        ORDER BY created_at DESC
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

      await sql`DELETE FROM t_data WHERE ser = ${id};`;

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
