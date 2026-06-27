
/* v23.6 Home Global Tap Fix
   Problem: old v22.8/v22.x home rows could still render without v23.5 data attributes.
   Fix: global modal row recognizer maps row text to home actions, even if old inline onclick fails.
*/
(function(){
  const HOME236='data-home-action-236';

  function clamp236(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(Number(v)||0)))}
  function r236(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick236(a){return a[Math.floor(Math.random()*a.length)]}
  function toast236(t){try{toast(t)}catch(e){console.log(t)}}
  function apply236(s){try{applyStats(s||{})}catch(e){}}
  function saveRender236(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function sec236(t){return `<div class="section">${t}</div>`}
  function card236(h){return `<div class="card">${h}</div>`}
  function rr236(icon,title,sub,action,locked=false){
    return `<div class="row ${locked?'locked':''}" ${locked?'':`${HOME236}="${action}"`} role="button" tabindex="0">
      <div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div>
    </div>`;
  }
  function modal236(icon,title,body,back='closeModal()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody v236HomeBody">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`);
    setTimeout(patchHomeRows236,0);
  }
  function result236(icon,title,txt,stats={},cash=0,type='good',back='homeLifeScreen()'){
    if(cash)state.money=(Number(state.money)||0)+cash;
    apply236(stats);
    try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(e){}
    saveRender236();
    modal236(icon,title,card236(`${txt}<br><br><span class="mini">✅ Actie uitgevoerd.</span>`),back);
  }
  function money236(v){try{return money(v)}catch(e){return '€ '+Math.round(Number(v)||0).toLocaleString('nl-NL')}}

  function normalizeHome236(h){
    if(!h||typeof h!=='object')return h;
    h.icon=h.icon||(h.owned?'🏠':'🏢');
    h.cleanliness=clamp236(h.cleanliness ?? h.clean ?? 60);
    h.comfort=clamp236(h.comfort ?? 50);
    h.quality=clamp236(h.quality ?? 50);
    h.condition=clamp236(h.condition ?? 60);
    h.houseMood=clamp236(h.houseMood ?? Math.round((h.cleanliness+h.comfort+h.condition)/3));
    return h;
  }
  function homeObj236(){
    state.houses=state.houses||[];
    let h=state.houses.find(x=>x.primary)||state.houses[0];
    if(h)return {house:normalizeHome236(h),family:false};
    state.familyHome228=state.familyHome228||{name:'Thuis bij ouders',icon:'🏠',owned:false,familyHome:true,cleanliness:62,comfort:45,condition:60,quality:50,houseMood:50};
    return {house:normalizeHome236(state.familyHome228),family:true};
  }
  function cleaner236(){
    state.homeServices228=state.homeServices228||{};
    return state.homeServices228.cleaner||null;
  }
  function cleanerText236(){
    const c=cleaner236();
    return c?`${c.name||c.serviceName||'Schoonmaker'} · ${money236(c.monthly||0)}/mnd · kwaliteit ${c.quality||50}%`:'Geen schoonmaker ingesteld';
  }

  window.homeLifeScreen=function(){
    const o=homeObj236(), h=o.house;
    let body=card236(`<b>${o.family?'Familiehuis / kamer':'Thuis bij '+(h.name||'woning')}</b><br>Schoon ${h.cleanliness}% · comfort ${h.comfort}% · staat ${h.condition}% · vibe ${h.houseMood}%<br><span class="mini">v23.6: oude en nieuwe thuis-rows werken nu met globale tap-fix.</span>`);
    body+=sec236('Thuis activiteiten');
    body+=rr236('🛋️','Chillen met vrienden','Vrienden over de vloer, praten, bankhangen','friends',(state.age||0)<10);
    body+=rr236('🖥️','Gamen','Gamen op pc/console of telefoon','gaming');
    body+=rr236('😌','Relaxen','Rust, herstel en stress omlaag','relax');
    body+=rr236('🧃','Hangen thuis','Op de bank hangen, series, snacks, niks doen','hang');
    body+=rr236('🎉','House party / vrienden over de vloer','Gezellig maar rommel en burenkans','party',(state.age||0)<14);
    body+=sec236('Huis bijhouden');
    body+=rr236('🧽','Zelf schoonmaken','Schoonheid omhoog, discipline erbij','clean');
    body+=rr236('🧹','Schoonmaker regelen',cleanerText236(),'cleaner');
    body+=rr236('✨','Schoonmaker laten komen',cleaner236()?'Directe schoonmaakbeurt':'Eerst schoonmaker instellen','cleanerVisit',!cleaner236());
    body+=sec236('Extra');
    body+=rr236('📱','Social media thuis','Scrollen of posten vanaf thuis','social',typeof socialMedia!=='function');
    modal236(h.icon||'🏠','Thuis activiteiten',body,'closeModal()');
  };
  try{homeLifeScreen=window.homeLifeScreen}catch(e){}

  function dispatchHome236(action){
    if(!action)return;
    if(action==='cleaner')return typeof cleanerHub228==='function'?cleanerHub228():toast236('Schoonmaker-menu niet gevonden.');
    if(action==='cleanerVisit')return typeof cleanerVisit228==='function'?cleanerVisit228():toast236('Schoonmaker niet gevonden.');
    if(action==='social')return typeof socialMedia==='function'?socialMedia():toast236('Social media niet beschikbaar.');
    return doHome236(action);
  }
  window.dispatchHome236=dispatchHome236;

  function doHome236(kind){
    const o=homeObj236(), h=o.house;
    let txt='', stats={}, cash=0, type='good';
    state.talents=state.talents||{};
    if(kind==='friends'){
      if((state.age||0)<10)return toast236('Chillen met vrienden kan vanaf 10 jaar.');
      let f=(state.friends&&state.friends.length)?pick236(state.friends):null;
      txt=`Ik chillde thuis met ${f?f.name:'een paar mensen uit de buurt'}. Er werd gepraat, gelachen en op de bank gehangen.`;
      stats={Happiness:7,Stamina:-4};
      h.cleanliness=clamp236(h.cleanliness-r236(3,8));
      h.houseMood=clamp236(h.houseMood+r236(1,5));
      state.talents.social=clamp236((state.talents.social||0)+2);
      if(f){try{addRel(f,r236(3,8))}catch(e){f.rel=clamp236((f.rel||50)+r236(3,8))}}
    }
    if(kind==='gaming'){
      const owns=(state.items||[]).some(it=>/gaming pc|pc|computer|console/i.test(String(it.name||'')));
      txt=owns?'Ik ging thuis gamen op mijn setup. De tijd vloog voorbij.':'Ik ging gamen op mijn telefoon. Niet perfect, wel ontspannend.';
      stats={Happiness:owns?8:5,Smarts:1,Stamina:-4};
      h.cleanliness=clamp236(h.cleanliness-r236(0,3));
      h.houseMood=clamp236(h.houseMood+2);
    }
    if(kind==='relax'){
      txt='Ik relaxte thuis en deed even helemaal niks. Mijn batterij laadde weer op.';
      stats={Happiness:5,Stamina:12,Health:2};
      h.houseMood=clamp236(h.houseMood+3);
    }
    if(kind==='hang'){
      txt='Ik hing thuis op de bank met snacks en een serie. Niet productief, wel lekker.';
      stats={Happiness:4,Stamina:6,Smarts:-1};
      h.cleanliness=clamp236(h.cleanliness-r236(1,5));
    }
    if(kind==='party'){
      if((state.age||0)<14)return toast236('House party kan vanaf 14 jaar.');
      txt='Ik had vrienden over de vloer. Het werd gezellig, luid en rommelig.';
      stats={Happiness:10,Stamina:-14,Health:-2};
      cash=-Math.min(state.money||0,r236(25,160));
      h.cleanliness=clamp236(h.cleanliness-r236(12,28));
      h.condition=clamp236(h.condition-r236(0,5));
      h.houseMood=clamp236(h.houseMood+r236(2,8));
      if(Math.random()<0.22){txt+=' De buren klaagden over lawaai.'; type='warn';}
    }
    if(kind==='clean'){
      txt='Ik hield een schoonmaakdag. Saai, maar het huis voelde daarna veel beter.';
      stats={Happiness:3,Health:3,Stamina:-7};
      h.cleanliness=clamp236(h.cleanliness+r236(18,32));
      h.condition=clamp236(h.condition+r236(1,4));
      h.houseMood=clamp236(h.houseMood+r236(4,8));
      state.talents.discipline=clamp236((state.talents.discipline||0)+2);
    }
    normalizeHome236(h);
    result236('🏠','Thuis',txt,stats,cash,type,'homeLifeScreen()');
  }
  window.homeActivity236=doHome236;
  window.homeAction236=doHome236;

  // Override old functions too, so old inline onclicks also work.
  window.homeActivity228=function(kind){return dispatchHome236(kind)};
  window.homeAction=function(kind){
    const map={chill:'friends',party:'party',clean:'clean',relax:'relax',window:'hang',game:'gaming',gaming:'gaming',hang:'hang'};
    return dispatchHome236(map[kind]||kind);
  };
  try{homeActivity228=window.homeActivity228; homeAction=window.homeAction}catch(e){}

  const textMap236=[
    [/chillen met vrienden/i,'friends'],
    [/^gamen/i,'gaming'],
    [/relaxen/i,'relax'],
    [/hangen thuis/i,'hang'],
    [/house party|vrienden over de vloer/i,'party'],
    [/zelf schoonmaken/i,'clean'],
    [/schoonmaker regelen/i,'cleaner'],
    [/schoonmaker laten komen/i,'cleanerVisit'],
    [/social media thuis/i,'social']
  ];

  function actionFromRowText236(row){
    const title=(row.querySelector('.rTitle')?.textContent||row.textContent||'').trim();
    for(const [re,act] of textMap236){
      if(re.test(title))return act;
    }
    return null;
  }

  function patchHomeRows236(root=document){
    try{
      const modal=document.getElementById('modal');
      if(!modal)return;
      modal.style.pointerEvents='auto';
      modal.querySelectorAll('.row').forEach(row=>{
        let act=row.getAttribute(HOME236) || actionFromRowText236(row);
        if(act){
          row.setAttribute(HOME236,act);
          row.removeAttribute('onclick'); // prevent dead/old inline click from swallowing behavior
          row.classList.remove('locked');
          row.style.pointerEvents='auto';
          row.style.touchAction='manipulation';
          row.style.position='relative';
          row.style.zIndex='30';
          row.style.cursor='pointer';
        }
      });
    }catch(e){}
  }
  window.patchHomeRows236=patchHomeRows236;

  function bindGlobalHome236(){
    if(document.__homeGlobal236)return;
    document.__homeGlobal236=true;
    const handler=function(ev){
      try{
        const modal=document.getElementById('modal');
        if(!modal || !modal.contains(ev.target))return;
        let row=ev.target.closest && ev.target.closest(`[${HOME236}], #modal .row`);
        if(!row || !modal.contains(row))return;
        const act=row.getAttribute(HOME236)||actionFromRowText236(row);
        if(!act)return;
        ev.preventDefault();
        ev.stopPropagation();
        dispatchHome236(act);
      }catch(e){console.warn('[v23.6 home tap]',e)}
    };
    document.addEventListener('click',handler,true);
    document.addEventListener('touchend',handler,true);
    document.addEventListener('pointerup',handler,true);
  }
  window.bindGlobalHome236=bindGlobalHome236;

  const oldShow236=window.showModal||(typeof showModal==='function'?showModal:null);
  if(oldShow236 && !oldShow236.__home236){
    window.showModal=function(html){
      const ret=oldShow236.call(this,html);
      setTimeout(()=>{patchHomeRows236(document);bindGlobalHome236()},0);
      return ret;
    };
    window.showModal.__home236=true;
    try{showModal=window.showModal}catch(e){}
  }
  const oldRender236=window.render||(typeof render==='function'?render:null);
  if(oldRender236 && !oldRender236.__home236){
    window.render=function(){
      const ret=oldRender236.apply(this,arguments);
      setTimeout(()=>patchHomeRows236(document),0);
      return ret;
    };
    window.render.__home236=true;
    try{render=window.render}catch(e){}
  }

  // If old asset/house details inject old homeLifeScreen, force our version.
  const oldAssetHouse236=window.assetHouse||(typeof assetHouse==='function'?assetHouse:null);
  if(oldAssetHouse236 && !oldAssetHouse236.__home236){
    window.assetHouse=function(i){
      const ret=oldAssetHouse236.apply(this,arguments);
      setTimeout(()=>patchHomeRows236(document),0);
      return ret;
    };
    window.assetHouse.__home236=true;
    try{assetHouse=window.assetHouse}catch(e){}
  }

  window.debugHomeTap236=function(){
    let h=card236('<b>Home tap debug</b><br>Deze rows gebruiken v23.6 globale tap handler. Als je hierop tikt, moet direct resultaat komen.');
    h+=rr236('🛋️','Chillen met vrienden','Test friends action','friends');
    h+=rr236('🖥️','Gamen','Test gaming action','gaming');
    h+=rr236('😌','Relaxen','Test relax action','relax');
    modal236('🛠️','Home tap debug',h,'closeModal()');
  };

  bindGlobalHome236();
  setTimeout(()=>{try{patchHomeRows236(document);safeSave();render()}catch(e){}},400);
})();
