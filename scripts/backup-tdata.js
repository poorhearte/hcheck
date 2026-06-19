// t_data 테이블 백업 스크립트
// 실행: node scripts/backup-tdata.js
// 결과: backups/t_data_YYYYMMDD_HHmmss.json  (무손실 원본)
//       backups/t_data_YYYYMMDD_HHmmss.sql   (복원용 INSERT 문)
import { sql } from '@vercel/postgres';
import { mkdir, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const backupDir = join(__dirname, '..', 'backups');

function pad(n){ return String(n).padStart(2, '0'); }
function stamp(){
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// SQL 리터럴 이스케이프
function lit(v){
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  return `'${String(v).replace(/'/g, "''")}'`;
}

async function main(){
  await mkdir(backupDir, { recursive: true });

  const { rows } = await sql`SELECT * FROM t_data ORDER BY ser ASC;`;
  const s = stamp();

  // 1) JSON (무손실 원본)
  const jsonPath = join(backupDir, `t_data_${s}.json`);
  await writeFile(jsonPath, JSON.stringify(rows, null, 2), 'utf8');

  // 2) SQL INSERT (복원용)
  const cols = rows.length ? Object.keys(rows[0]) : [];
  let sqlOut = `-- t_data 백업 (${rows.length}건) ${new Date().toISOString()}\n`;
  sqlOut += `-- 복원 예: psql "$DATABASE_URL_UNPOOLED" -f 이파일.sql\nBEGIN;\n`;
  for (const r of rows){
    const vals = cols.map(c => lit(r[c])).join(', ');
    sqlOut += `INSERT INTO t_data (${cols.join(', ')}) VALUES (${vals});\n`;
  }
  sqlOut += `COMMIT;\n`;
  const sqlPath = join(backupDir, `t_data_${s}.sql`);
  await writeFile(sqlPath, sqlOut, 'utf8');

  console.log(`백업 완료: ${rows.length}건`);
  console.log(` - ${jsonPath}`);
  console.log(` - ${sqlPath}`);
  process.exit(0);
}

main().catch(e => { console.error('백업 실패:', e); process.exit(1); });
