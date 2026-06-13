(function(){
  // API 기본 URL (Vercel 배포 시 자동으로 프로덕션 URL 사용)
  const API_URL = window.location.origin === 'http://localhost:5500' || window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : window.location.origin;

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

  async function loadRecords(){
    try{
      const response = await fetch(`${API_URL}/api/glucose`);
      if(!response.ok) throw new Error('데이터 조회 실패');
      return await response.json();
    }catch(e){
      console.error('loadRecords', e);
      // 오프라인 폴백: localStorage 사용
      const raw = localStorage.getItem('glucoseRecords_v1');
      return raw ? JSON.parse(raw) : [];
    }
  }

  async function saveRecords(value, timestamp, note){
    try{
      const response = await fetch(`${API_URL}/api/glucose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, timestamp, note })
      });
      if(!response.ok) throw new Error('저장 실패');
      return await response.json();
    }catch(e){
      console.error('saveRecords', e);
      // 오프라인 폴백: localStorage 사용
      const records = JSON.parse(localStorage.getItem('glucoseRecords_v1') || '[]');
      const rec = { 
        id: Date.now().toString(36) + Math.random().toString(36).slice(2,8), 
        value: Number(value), 
        timestamp: new Date(timestamp).toISOString(), 
        note: note||'' 
      };
      records.push(rec);
      localStorage.setItem('glucoseRecords_v1', JSON.stringify(records));
      return rec;
    }
  }

  async function deleteRecord(id){
    try{
      const response = await fetch(`${API_URL}/api/glucose`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if(!response.ok) throw new Error('삭제 실패');
    }catch(e){
      console.error('deleteRecord', e);
      // 오프라인 폴백: localStorage에서 삭제
      let records = JSON.parse(localStorage.getItem('glucoseRecords_v1') || '[]');
      records = records.filter(r=>r.id!==id);
      localStorage.setItem('glucoseRecords_v1', JSON.stringify(records));
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
      statsEl.textContent = '';
      return;
    }

    const latest = records[0];
    const avg = (records.reduce((s,r)=>s+Number(r.value),0)/records.length).toFixed(1);
    statsEl.innerHTML = `<strong>최신:</strong> ${latest.value} mg/dL (${new Date(latest.timestamp).toLocaleString()}) — <strong>평균:</strong> ${avg} mg/dL (최근 ${records.length}건)`;

    records.forEach(r=>{
      const li = document.createElement('li');
      li.className = 'record';
      const dt = new Date(r.timestamp);
      li.innerHTML = `<div class="left"><div class="val">${r.value} mg/dL</div><div class="time">${dt.toLocaleString()}</div></div><div class="right"><div class="note">${r.note||''}</div><button data-id="${r.id}" class="del">삭제</button></div>`;
      listEl.appendChild(li);
    });

    listEl.querySelectorAll('button.del').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-id');
        deleteRecord(id);
      });
    });
  }

  function clearAll(){
    if(!confirm('모든 기록을 삭제하시겠습니까?')) return;
    localStorage.removeItem('glucoseRecords_v1');
    render();
  }

  // init
  document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('recordForm');
    const datetime = document.getElementById('datetime');
    datetime.value = nowLocalDatetimeInputValue();

    form.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const value = document.getElementById('glucose').value;
      const dt = document.getElementById('datetime').value;
      const note = document.getElementById('note').value;
      if(!value){ alert('혈당을 입력하세요'); return; }
      const timestamp = dt ? new Date(dt) : new Date();
      await saveRecords(value, timestamp, note);
      document.getElementById('glucose').value = '';
      document.getElementById('note').value = '';
      datetime.value = nowLocalDatetimeInputValue();
      render();
    });

    document.getElementById('clearAll').addEventListener('click', clearAll);

    render();
  });

})();
