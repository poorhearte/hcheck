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

  function formatGlucoseValue(value){
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return Number.isInteger(num) ? String(num) : String(num).replace(/\.0+$|(?<=\.[0-9]*[1-9])0+$/,'');
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
      listEl.innerHTML = '<li class="empty">기록이 없습니다.</li>';
      statsEl.textContent = lastFetchError ? '서버에서 데이터를 가져올 수 없습니다. 콘솔을 확인하세요.' : '';
      return;
    }

    const latest = records[0];
    const avgValue = records.reduce((s,r)=>s+Number(r.value),0)/records.length;
    const avg = Math.round(avgValue);
    statsEl.innerHTML = `<strong>평균:</strong> ${avg} mg/dL (총 ${records.length}건)`;

    records.forEach(r=>{
      const li = document.createElement('li');
      li.className = 'record';
      li.dataset.id = r.id;
      const dt = new Date(r.timestamp);
      li.innerHTML = `<div class="left"><div class="val">${formatGlucoseValue(r.value)} mg/dL</div><div class="time">${dt.toLocaleString()}</div></div><div class="right"><div class="note">${r.note||''}</div></div>`;
      attachLongPressDelete(li, r.id);
      listEl.appendChild(li);
    });
  }

  // 길게 누르면(롱프레스) 해당 기록을 삭제
  function attachLongPressDelete(li, id){
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
        if(confirm('이 기록을 삭제하시겠습니까?')) deleteRecord(id);
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

    render();
  });

})();
