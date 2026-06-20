// 혈당 통계 화면 — 월/주 모드 + 기간 이동 + SVG 선 그래프 (외부 라이브러리 없음)
(function(){
  const API_PATH = '/api/glucose';

  // 혈당 구간(임의시간/식후 기준) — 점 색상 표시용
  function levelColor(v){
    if(v < 70)  return '#2f7fd6';   // 저혈당
    if(v < 140) return '#1f9d4d';   // 정상
    if(v < 200) return '#ef7d1a';   // 주의
    return '#d32020';               // 높음
  }

  let cache = [];                 // 마지막으로 불러온 전체 기록
  let mode = 'week';              // 'month' | 'week' — 기본: 주
  let anchor = startOfDay(new Date()); // 현재 보고 있는 기간 내의 기준 날짜 (기본: 오늘)

  function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }

  // 일요일 시작 주
  function startOfWeek(d){
    const x = startOfDay(d);
    x.setDate(x.getDate() - x.getDay());
    return x;
  }

  // 현재 모드 기준 기간의 [시작, 끝]
  function periodRange(a){
    if(mode === 'month'){
      const start = new Date(a.getFullYear(), a.getMonth(), 1, 0,0,0,0);
      const end   = new Date(a.getFullYear(), a.getMonth()+1, 0, 23,59,59,999);
      return { start, end };
    }
    const start = startOfWeek(a);
    const end = new Date(start);
    end.setDate(end.getDate()+6);
    end.setHours(23,59,59,999);
    return { start, end };
  }

  // 기간 라벨
  function periodLabel(a){
    if(mode === 'month') return `${a.getFullYear()}년 ${a.getMonth()+1}월`;
    const { start, end } = periodRange(a);
    return `${fmtDateDow(start)} ~ ${fmtDateDow(end)}`;
  }

  // 기간 이동 (delta: -1 이전, +1 다음)
  function shift(delta){
    if(mode === 'month'){
      anchor = new Date(anchor.getFullYear(), anchor.getMonth()+delta, 1);
    }else{
      const x = new Date(anchor);
      x.setDate(x.getDate() + delta*7);
      anchor = x;
    }
  }

  // 현재(오늘) 기간 이후로는 '다음' 비활성화
  function isAtCurrentPeriod(){
    const cur = periodRange(startOfDay(new Date())).start;
    const here = periodRange(anchor).start;
    return here.getTime() >= cur.getTime();
  }

  async function loadRecords(){
    try{
      const res = await fetch(API_PATH);
      if(!res.ok) throw new Error('데이터 조회 실패');
      return await res.json();
    }catch(e){
      console.error('stats loadRecords', e);
      return null;
    }
  }

  const WEEKDAYS = ['일','월','화','수','목','금','토'];
  function dow(d){ return WEEKDAYS[d.getDay()]; }

  function fmtNum(v){
    const n = Number(v);
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }
  function fmtDate(d){ return `${d.getMonth()+1}/${d.getDate()}`; }
  function fmtDateDow(d){ return `${d.getMonth()+1}/${d.getDate()}(${dow(d)})`; }

  // 현재 기간의 데이터 (오래된→최신)
  function dataForPeriod(){
    const { start, end } = periodRange(anchor);
    return cache
      .map(r => ({ value: Number(r.value), t: new Date(r.timestamp), note: r.note }))
      .filter(r => !Number.isNaN(r.value) && r.t >= start && r.t <= end)
      .sort((a, b) => a.t - b.t);
  }

  function buildChart(data){
    const W = 640, H = 460;
    const pad = { top: 28, right: 20, bottom: 44, left: 56 };
    const innerW = W - pad.left - pad.right;
    const innerH = H - pad.top - pad.bottom;
    const n = data.length;

    const values = data.map(d=>d.value);
    let minV = Math.min(...values), maxV = Math.max(...values);
    const margin = Math.max(10, (maxV - minV) * 0.15);
    let dMin = Math.floor((minV - margin) / 10) * 10;
    let dMax = Math.ceil((maxV + margin) / 10) * 10;
    if(dMin < 0) dMin = 0;
    if(dMax === dMin) dMax = dMin + 10;

    const xFor = i => n === 1 ? pad.left + innerW/2 : pad.left + innerW * (i/(n-1));
    const yFor = v => pad.top + innerH * (1 - (v - dMin)/(dMax - dMin));

    const avg = values.reduce((s,v)=>s+v,0)/n;

    let grid = '';
    const ticks = 5;
    for(let i=0; i<=ticks; i++){
      const v = dMin + (dMax - dMin) * (i/ticks);
      const y = yFor(v);
      grid += `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${W-pad.right}" y2="${y.toFixed(1)}" stroke="#eef3fb"/>`;
      grid += `<text x="${pad.left-8}" y="${(y+4).toFixed(1)}" text-anchor="end" class="ax">${Math.round(v)}</text>`;
    }

    const avgY = yFor(avg);
    const avgLine = `<line x1="${pad.left}" y1="${avgY.toFixed(1)}" x2="${W-pad.right}" y2="${avgY.toFixed(1)}" stroke="#94a3b8" stroke-dasharray="5 4"/>`
      + `<text x="${W-pad.right}" y="${(avgY-6).toFixed(1)}" text-anchor="end" class="ax avg">평균 ${Math.round(avg)}</text>`;

    const linePts = data.map((d,i)=> `${xFor(i).toFixed(1)},${yFor(d.value).toFixed(1)}`).join(' ');
    const polyline = n > 1 ? `<polyline points="${linePts}" fill="none" stroke="#0b79ff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` : '';

    let xlabels = '';
    const step = Math.max(1, Math.ceil(n/4));
    data.forEach((d,i)=>{
      if(i % step === 0 || i === n-1){
        xlabels += `<text x="${xFor(i).toFixed(1)}" y="${H-12}" text-anchor="middle" class="ax">${fmtDateDow(d.t)}</text>`;
      }
    });

    let dots = '';
    const showValues = n <= 12;
    data.forEach((d,i)=>{
      const x = xFor(i), y = yFor(d.value);
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${levelColor(d.value)}" stroke="#fff" stroke-width="2"/>`;
      if(showValues){
        dots += `<text x="${x.toFixed(1)}" y="${(y-14).toFixed(1)}" text-anchor="middle" class="ax val">${fmtNum(d.value)}</text>`;
      }
    });

    return `<svg viewBox="0 0 ${W} ${H}" class="glucose-chart" role="img" aria-label="혈당 추이 그래프">`
      + grid + avgLine + polyline + dots + xlabels + `</svg>`;
  }

  function buildSummary(data){
    const values = data.map(d=>d.value);
    const avg = Math.round(values.reduce((s,v)=>s+v,0)/values.length);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const latest = data[data.length-1];
    const card = (label, val, sub='') =>
      `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${val}</div>${sub?`<div class="stat-sub">${sub}</div>`:''}</div>`;
    return `<div class="stat-grid">`
      + card('평균', `${avg}`, 'mg/dL')
      + card('최저', `${fmtNum(min)}`, 'mg/dL')
      + card('최고', `${fmtNum(max)}`, 'mg/dL')
      // + card('최근', `${fmtNum(latest.value)}`, fmtDate(latest.t))
      + card('기록 수', `${data.length}`, '건')
      + `</div>`;
  }

  // 라벨/버튼 상태 갱신
  function updateControls(){
    const label = document.getElementById('periodLabel');
    if(label) label.textContent = periodLabel(anchor);

    const nextBtn = document.getElementById('nextPeriod');
    if(nextBtn) nextBtn.disabled = isAtCurrentPeriod();

    document.querySelectorAll('.mode-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.mode === mode));
  }

  // 현재 기간 기준 차트/요약 렌더 + 컨트롤 갱신
  function renderView(){
    updateControls();
    const root = document.getElementById('statsView');
    if(!root) return;
    const data = dataForPeriod();
    if(data.length === 0){
      const msg = mode === 'month'
        ? `${anchor.getMonth()+1}월에 혈당 기록이 없습니다.`
        : '이 주에 혈당 기록이 없습니다.';
      root.innerHTML = `<p class="empty">${msg}</p>`;
      return;
    }
    root.innerHTML = buildSummary(data) + `<div class="chart-wrap">${buildChart(data)}</div>`;
  }

  // 데이터를 새로 불러와 갱신
  async function refresh(){
    const all = await loadRecords();
    if(all === null){
      const root = document.getElementById('statsView');
      if(root) root.innerHTML = `<p class="empty">서버에서 데이터를 가져올 수 없습니다.</p>`;
      return;
    }
    cache = all;
    renderView();
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    // 월/주 모드 전환 — 전환 시 현재(오늘) 기간으로 초기화
    document.querySelectorAll('.mode-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        mode = btn.dataset.mode;
        anchor = startOfDay(new Date());
        renderView();
      });
    });

    // 이전/다음 기간 이동
    const prev = document.getElementById('prevPeriod');
    const next = document.getElementById('nextPeriod');
    if(prev) prev.addEventListener('click', ()=>{ shift(-1); renderView(); });
    if(next) next.addEventListener('click', ()=>{ if(next.disabled) return; shift(1); renderView(); });

    // 통계 탭을 열 때(그리고 열 때마다) 최신 데이터로 갱신.
    // 시작 시 미리 불러오지 않아 첫 화면(혈당 탭) 로딩이 빨라짐 — 탭을 처음 열 때 로드됨
    const statsTab = document.querySelector('.tab[data-view="stats"]');
    if(statsTab) statsTab.addEventListener('click', refresh);
  });
})();
