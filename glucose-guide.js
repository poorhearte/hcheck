// 혈당 수치 기준 설명표 (첫 화면 표시)
// index.html 의 <section id="glucoseGuide"></section> 안에 렌더링됩니다.
(function(){
  // 열(검사 항목)
  const COLUMNS = [
    { title: '공복혈당',      sub: '8시간 금식' },
    { title: '식후 2시간 혈당', sub: '첫 수저 뜬 시점에서 2시간' },
    { title: '당화혈색소',    sub: 'HbA1c' }
  ];

  // 행(판정 단계). values 순서는 COLUMNS 순서와 동일
  const ROWS = [
    { label: '관리목표',   cls: 'lv-goal',   values: ['80~130',           '180이하',          '6.5%미만'] },
    { label: '당뇨병',     cls: 'lv-high',   values: ['126이상',          '200이상',          '6.5%이상'] },
    { label: '전단계', cls: 'lv-mid',    values: ['100이상 126 미만', '140이상 200미만', '5.7%이상 6.5%미만'] },
    { label: '정상',       cls: 'lv-normal', values: ['100미만',          '140미만',          '5.7%미만'] }
  ];

  function buildTable(){
    const head = COLUMNS
      .map(c => `<th>${c.title}<span class="sub">(${c.sub})</span></th>`)
      .join('');

    const body = ROWS.map(r => {
      const cells = r.values.map(v => {
        // 당뇨병 행은 기준 숫자(126,200,6.5)를 굵은 빨강, 전단계 행은 앞 숫자(100,140,5.7)를 굵은 주황으로 강조
        let text = v;
        if (r.cls === 'lv-high') {
          text = v.replace(/^([\d.]+)/, '<strong class="hi-num">$1</strong>');
        } else if (r.cls === 'lv-mid') {
          text = v.replace(/^([\d.]+)/, '<strong class="mid-num">$1</strong>');
        }
        return `<td>${text}</td>`;
      }).join('');
      return `<tr class="${r.cls}"><th scope="row">${r.label}</th>${cells}</tr>`;
    }).join('');

    return `<details class="guide-details">
      <summary>혈당 수치 기준</summary>
      <div class="guide-scroll">
        <table class="glucose-guide">
          <thead><tr><th></th>${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
      <div class="guide-foot">
        <p class="guide-source">출처: <a href="https://www.diabetes.or.kr/general/info/treat/treat_01.php" target="_blank" rel="noopener noreferrer">대한당뇨병학회</a></p>
        <p class="guide-unit">단위: mg/dL (당화혈색소는 %)</p>
      </div>
    </details>`;
  }

  function render(){
    const el = document.getElementById('glucoseGuide');
    if(el) el.innerHTML = buildTable();
  }

  document.addEventListener('DOMContentLoaded', render);
})();
