// PWA — 서비스워커 등록 + '앱으로 설치' 버튼 처리
(function(){
  // 서비스워커 등록
  if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW 등록 실패', err));
    });
  }

  // 이미 앱으로 설치되어 standalone으로 실행 중인지
  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  let deferredPrompt = null;

  document.addEventListener('DOMContentLoaded', ()=>{
    const installBtn = document.getElementById('installApp');
    if(!installBtn) return;

    // 이미 설치되어 실행 중이면 버튼 숨김
    if(isStandalone()){ installBtn.hidden = true; return; }

    // 브라우저가 설치 가능하다고 알리면 프롬프트를 보관
    window.addEventListener('beforeinstallprompt', (e)=>{
      e.preventDefault();
      deferredPrompt = e;
    });

    installBtn.addEventListener('click', async ()=>{
      if(!deferredPrompt){
        alert('설치 안내\n\n• Chrome/Edge: 주소창 오른쪽의 설치(⊕) 아이콘을 눌러 설치할 수 있어요.\n• iPhone(Safari): 공유 → "홈 화면에 추가"\n• 이미 설치된 경우 다시 설치할 수 없습니다.');
        return;
      }
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if(outcome === 'accepted') installBtn.hidden = true;
    });

    // 설치 완료 시 버튼 숨김
    window.addEventListener('appinstalled', ()=>{ installBtn.hidden = true; });
  });
})();
