import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import handler from './glucose.js';
import hospitalHandler from './hospital.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 정적 파일 서빙 (index.html, styles.css, app.js)
app.use(express.static(join(__dirname, '..')));

// API 라우트
app.all('/api/glucose', handler);
app.all('/api/hospital', hospitalHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
