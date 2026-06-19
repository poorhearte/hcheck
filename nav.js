// 상단 탭 메뉴 전환 (혈당 / 병원 진료)
(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const tabs = document.querySelectorAll('.tab');
    const views = {
      glucose:  document.querySelector('.view-glucose'),
      hospital: document.querySelector('.view-hospital')
    };

    tabs.forEach(tab=>{
      tab.addEventListener('click', ()=>{
        const target = tab.dataset.view;
        tabs.forEach(t=> t.classList.toggle('active', t === tab));
        Object.keys(views).forEach(key=>{
          if(views[key]) views[key].hidden = (key !== target);
        });
      });
    });
  });
})();
