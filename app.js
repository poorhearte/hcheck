(function(){
  const API_PATH = '/api/glucose';

  function nowLocalDatetimeInputValue() {
    const d = new Date();
    const pad = n => String(n).padStart(2,'0');
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth()+1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
  }

  let lastFetchError = null;

  async function loadRecords(){
    try{
      console.log('loadRecords request to', API_PATH);
      const response = await fetch(API_PATH);
      if(!response.ok) throw new Error('데이터 조회 실패');
      lastFetchError = null;
      return await response.json();
    }catch(e){
      console.error('loadRecords', e);
      lastFetchError = e;
      return [];
    }
  }

  async function saveRecords(value, timestamp, note){
    const response = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, timestamp, note })
    });

    if(!response.ok) {
      throw new Error('저장 실패');
    }

    return await response.json();
  }

  async function updateRecord(id, value, timestamp, note){
    const response = await fetch(API_PATH, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, value, timestamp, note })
    });
    if(!response.ok) throw new Error('수정 실패');
    return await response.json();
  }

  // Date → datetime-local 입력값 (YYYY-MM-DDTHH:mm:ss)
  function toLocalInputValue(date){
    const d = new Date(date);
    const pad = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function formatGlucoseValue(value){
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return Number.isInteger(num) ? String(num) : String(num).replace(/\.0+$|(?<=\.[0-9]*[1-9])0+$/,'');
  }

  // 혈당 구간(임의시간/식후 기준) — 점 색상
  function levelColor(v){
    if(v < 70)  return '#2f7fd6';   // 저혈당
    if(v < 140) return '#1f9d4d';   // 정상
    if(v < 200) return '#ef7d1a';   // 주의
    return '#d32020';               // 높음
  }

  // 최근 5건 SVG 선 그래프 (recordsDesc: 최신순 배열)
  function buildLatestChart(recordsDesc){
    const data = recordsDesc.slice(0, 5)
      .map(r => ({ value: Number(r.value), t: new Date(r.timestamp) }))
      .filter(d => !Number.isNaN(d.value))
      .reverse(); // 오래된→최신 (왼→오른)
    if(data.length === 0) return '';

    const WEEKDAYS = ['일','월','화','수','목','금','토'];
    const W = 640, H = 200;
    const pad = { top: 28, right: 20, bottom: 40, left: 20 };
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

    let grid = '';
    const ticks = 4;
    for(let i=0; i<=ticks; i++){
      const v = dMin + (dMax - dMin) * (i/ticks);
      const y = yFor(v);
      grid += `<line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${W-pad.right}" y2="${y.toFixed(1)}" stroke="#eef3fb"/>`;
    }

    const linePts = data.map((d,i)=> `${xFor(i).toFixed(1)},${yFor(d.value).toFixed(1)}`).join(' ');
    const polyline = n > 1 ? `<polyline points="${linePts}" fill="none" stroke="#0b79ff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` : '';

    let dots = '';
    data.forEach((d,i)=>{
      const x = xFor(i), y = yFor(d.value);
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${levelColor(d.value)}" stroke="#fff" stroke-width="2"/>`;
      dots += `<text x="${x.toFixed(1)}" y="${(y-14).toFixed(1)}" text-anchor="middle" class="ax val">${formatGlucoseValue(d.value)}</text>`;
      let dAnchor = 'middle';
      if(n > 1 && i === 0) dAnchor = 'start';
      else if(n > 1 && i === n-1) dAnchor = 'end';
      dots += `<text x="${x.toFixed(1)}" y="${H-12}" text-anchor="${dAnchor}" class="ax">${d.t.getMonth()+1}/${d.t.getDate()}${WEEKDAYS[d.t.getDay()]}</text>`;
    });

    return `<svg viewBox="0 0 ${W} ${H}" class="glucose-chart mini" role="img" aria-label="최근 5건 혈당 그래프">`
      + grid + polyline + dots + `</svg>`;
  }

  function renderLatestChart(recordsDesc){
    const panel = document.getElementById('glucoseChartPanel');
    const el = document.getElementById('glucoseMiniChart');
    if(!panel || !el) return;
    if(recordsDesc.length === 0){
      panel.hidden = true;
      el.innerHTML = '';
      return;
    }
    el.innerHTML = buildLatestChart(recordsDesc);

    // 캡션: 최근 5건 평균(반올림)
    const caption = document.getElementById('chartCaption');
    if(caption){
      const vals = recordsDesc.slice(0, 5).map(r => Number(r.value)).filter(v => !Number.isNaN(v));
      if(vals.length){
        const avg = Math.round(vals.reduce((s,v)=>s+v,0) / vals.length);
        caption.textContent = `평균: ${avg} mg/dL (최근 5건)`;
      }
    }

    panel.hidden = false;
  }

  async function deleteRecord(id){
    try{
      const response = await fetch(API_PATH, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if(!response.ok) throw new Error('삭제 실패');
    }catch(e){
      console.error('deleteRecord', e);
      alert('기록 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    render();
  }

  async function render(){
    const listEl = document.getElementById('recordList');
    const statsEl = document.getElementById('stats');
    const records = (await loadRecords()).slice().sort((a,b)=> new Date(b.timestamp) - new Date(a.timestamp));
    listEl.innerHTML = '';

    if(records.length===0){
      renderLatestChart([]);
      listEl.innerHTML = '<li class="empty">기록이 없습니다.</li>';
      statsEl.textContent = lastFetchError ? '서버에서 데이터를 가져올 수 없습니다. 콘솔을 확인하세요.' : '';
      return;
    }

    renderLatestChart(records);

    const latest = records[0];
    const avgValue = records.reduce((s,r)=>s+Number(r.value),0)/records.length;
    const avg = Math.round(avgValue);
    // statsEl.innerHTML = `<strong>평균:</strong> ${avg} mg/dL (총 ${records.length}건)`;

    records.forEach(r=>{
      const li = document.createElement('li');
      li.className = 'record';
      li.dataset.id = r.id;
      const dt = new Date(r.timestamp);
      li.innerHTML = `<div class="left"><div class="val">${formatGlucoseValue(r.value)} mg/dL</div><div class="time">${dt.toLocaleString()}</div></div><div class="right"><div class="note">${r.note||''}</div></div>`;
      attachLongPress(li, r);
      listEl.appendChild(li);
    });
  }

  // 길게 누르면(롱프레스) 수정/삭제 팝업 열기
  function attachLongPress(li, record){
    const HOLD_MS = 700;
    let timer = null;

    const cancel = ()=>{
      if(timer){ clearTimeout(timer); timer = null; }
      li.classList.remove('holding');
    };

    const start = (ev)=>{
      // 마우스는 좌클릭만
      if(ev.type === 'mousedown' && ev.button !== 0) return;
      li.classList.add('holding');
      timer = setTimeout(()=>{
        timer = null;
        li.classList.remove('holding');
        openEditModal(record);
      }, HOLD_MS);
    };

    li.addEventListener('mousedown', start);
    li.addEventListener('touchstart', start, { passive: true });
    ['mouseup','mouseleave','touchend','touchcancel','touchmove'].forEach(evt=>{
      li.addEventListener(evt, cancel);
    });
    // 롱프레스 중 컨텍스트 메뉴/텍스트 선택 방지
    li.addEventListener('contextmenu', e=> e.preventDefault());
  }

  // ===== 수정/삭제 팝업 =====
  let editingId = null;

  function openEditModal(record){
    editingId = record.id;
    document.getElementById('editGlucose').value = formatGlucoseValue(record.value);
    document.getElementById('editDatetime').value = toLocalInputValue(record.timestamp);
    document.getElementById('editNote').value = record.note || '';
    document.getElementById('editModal').hidden = false;
  }

  function closeEditModal(){
    editingId = null;
    document.getElementById('editModal').hidden = true;
  }

  async function submitEdit(){
    if(editingId == null) return;
    const value = document.getElementById('editGlucose').value;
    if(!value){ alert('혈당을 입력하세요'); return; }
    const dt = document.getElementById('editDatetime').value;
    const note = document.getElementById('editNote').value;
    const timestamp = dt ? new Date(dt) : new Date();
    try{
      await updateRecord(editingId, value, timestamp, note);
    }catch(e){
      console.error('updateRecord', e);
      alert('기록 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }
    closeEditModal();
    render();
  }

  async function deleteFromModal(){
    const id = editingId;
    if(id == null) return;
    if(!confirm('이 기록을 삭제하시겠습니까?')) return;
    closeEditModal();
    await deleteRecord(id);
  }

  async function clearAll(){
    if(!confirm('모든 기록을 삭제하시겠습니까?')) return;
    const records = await loadRecords();
    await Promise.all(records.map(r => deleteRecord(r.id)));
    render();
  }

  // init
  document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('recordForm');
    const datetime = document.getElementById('datetime');
    datetime.value = nowLocalDatetimeInputValue();

    // 사용자가 일시를 직접 수정했는지 추적. 수정 안 했으면 저장 시점의 '현재 시각'을 사용
    let datetimeDirty = false;
    datetime.addEventListener('input', ()=> { datetimeDirty = true; });

    form.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const value = document.getElementById('glucose').value;
      const dt = document.getElementById('datetime').value;
      const note = document.getElementById('note').value;
      if(!value){ alert('혈당을 입력하세요'); return; }
      // 일시를 직접 바꿨으면 그 값을, 아니면 지금 시각을 기록
      const timestamp = (datetimeDirty && dt) ? new Date(dt) : new Date();
      await saveRecords(value, timestamp, note);
      document.getElementById('glucose').value = '';
      document.getElementById('note').value = '';
      datetime.value = nowLocalDatetimeInputValue();
      datetimeDirty = false;
      render();
    });

    const clearAllBtn = document.getElementById('clearAll');
    if(clearAllBtn) clearAllBtn.addEventListener('click', clearAll);

    // 수정/삭제 팝업 버튼
    document.getElementById('editSave').addEventListener('click', submitEdit);
    document.getElementById('editDelete').addEventListener('click', deleteFromModal);
    document.getElementById('editCancel').addEventListener('click', closeEditModal);
    // 바깥 영역 클릭 시 닫기
    const modal = document.getElementById('editModal');
    modal.addEventListener('click', (e)=>{ if(e.target === modal) closeEditModal(); });

    render();
  });

})();
