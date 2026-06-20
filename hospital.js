// 병원 진료 기록 입력/조회 (t_hospital_visit)
(function(){
  const API = '/api/hospital';

  function pad(n){ return String(n).padStart(2,'0'); }

  // datetime-local 기본값 (년월일 시분)
  function nowLocalValue(){
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatDuration(mins){
    if(mins == null) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if(h && m) return `${h}시간 ${m}분`;
    if(h) return `${h}시간`;
    return `${m}분`;
  }

  async function loadVisits(){
    try{
      const res = await fetch(API);
      if(!res.ok) throw new Error('병원 진료 기록 조회 실패');
      return await res.json();
    }catch(e){
      console.error('loadVisits', e);
      return [];
    }
  }

  async function saveVisit(payload){
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('저장 실패');
    return await res.json();
  }

  async function deleteVisit(id){
    try{
      const res = await fetch(API, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if(!res.ok) throw new Error('삭제 실패');
    }catch(e){
      console.error('deleteVisit', e);
      alert('기록 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    render();
  }

  async function render(){
    const listEl = document.getElementById('visitList');
    if(!listEl) return;
    const rows = await loadVisits();
    listEl.innerHTML = '';

    if(rows.length === 0){
      listEl.innerHTML = '<li class="empty">병원 진료 기록이 없습니다.</li>';
      return;
    }

    rows.forEach(v=>{
      const li = document.createElement('li');
      li.className = 'record';
      const when = v.start_at || '예약시간 미정';
      const dur = formatDuration(v.duration_minutes);
      const sub = dur ? `${when} · 소요 ${dur}` : when;
      li.innerHTML = `<div class="left"><div class="val">${v.hospital || '병원'}</div><div class="time">${sub}</div></div><div class="right"><div class="note">${v.memo || ''}</div></div>`;
      attachLongPressDelete(li, v.id);
      listEl.appendChild(li);
    });
  }

  // 길게 누르면 삭제 (혈당 기록과 동일 UX)
  function attachLongPressDelete(li, id){
    const HOLD_MS = 700;
    let timer = null;

    const cancel = ()=>{
      if(timer){ clearTimeout(timer); timer = null; }
      li.classList.remove('holding');
    };

    const start = (ev)=>{
      if(ev.type === 'mousedown' && ev.button !== 0) return;
      li.classList.add('holding');
      timer = setTimeout(()=>{
        timer = null;
        li.classList.remove('holding');
        if(confirm('이 기록을 삭제하시겠습니까?')) deleteVisit(id);
      }, HOLD_MS);
    };

    li.addEventListener('mousedown', start);
    li.addEventListener('touchstart', start, { passive: true });
    ['mouseup','mouseleave','touchend','touchcancel','touchmove'].forEach(evt=>{
      li.addEventListener(evt, cancel);
    });
    li.addEventListener('contextmenu', e=> e.preventDefault());
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('visitForm');
    if(!form) return;

    const reserved = document.getElementById('visitReserved');
    reserved.value = nowLocalValue();

    form.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const hospital = document.getElementById('visitHospital').value.trim();
      const reservedAt = document.getElementById('visitReserved').value;
      const h = parseInt(document.getElementById('visitHours').value || '0', 10);
      const m = parseInt(document.getElementById('visitMinutes').value || '0', 10);
      const memo = document.getElementById('visitMemo').value.trim();

      if(!hospital && !reservedAt){
        alert('병원명 또는 예약시간을 입력하세요');
        return;
      }

      const durationMinutes = (h || m) ? (h * 60 + m) : null;

      await saveVisit({
        reservedAt: reservedAt || null,
        durationMinutes,
        hospital,
        memo
      });

      document.getElementById('visitHospital').value = '';
      document.getElementById('visitHours').value = '';
      document.getElementById('visitMinutes').value = '';
      document.getElementById('visitMemo').value = '';
      reserved.value = nowLocalValue();
      render();
    });

    // 병원 진료 탭을 열 때 로드 — 시작 시 미리 불러오지 않아 첫 화면(혈당) 로딩이 빨라짐
    const hospitalTab = document.querySelector('.tab[data-view="hospital"]');
    if(hospitalTab) hospitalTab.addEventListener('click', render);
  });
})();
