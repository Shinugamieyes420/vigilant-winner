
/* v20.0 iPhone Safari Safe-Area Bottom Fix */
(function(){
  function isIOS200(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  }
  function ensureViewport200(){
    try{
      let vp=document.querySelector('meta[name="viewport"]');
      if(!vp){
        vp=document.createElement('meta');
        vp.name='viewport';
        document.head.appendChild(vp);
      }
      const current=vp.getAttribute('content')||'';
      const parts=current.split(',').map(x=>x.trim()).filter(Boolean);
      const has=(k)=>parts.some(p=>p.split('=')[0]===k);
      if(!has('width'))parts.unshift('width=device-width');
      if(!has('initial-scale'))parts.push('initial-scale=1');
      if(!has('viewport-fit'))parts.push('viewport-fit=cover');
      vp.setAttribute('content',parts.join(', '));
    }catch(e){}
  }
  function apply200(){
    try{
      ensureViewport200();
      document.documentElement.classList.toggle('iosSafari200', isIOS200());
      document.body.classList.toggle('iosSafari200', isIOS200());
      if(isIOS200()){
        const safe = getComputedStyle(document.documentElement).getPropertyValue('--ios-safe-bottom') || '0px';
        document.documentElement.style.setProperty('--detected-safe-bottom-200', safe);
      }
    }catch(e){}
  }
  window.fixIphoneSafariSafeArea200=apply200;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply200);
  else apply200();
  window.addEventListener('resize',apply200,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(apply200,250),{passive:true});
})();
