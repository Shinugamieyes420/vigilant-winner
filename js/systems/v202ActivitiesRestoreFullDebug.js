
/* v20.2 Activities Restore + Full Patch Debug
   Fixes v20.1 typo that could set activitiesHTML to undefined.
   Rebuilds a safe Activities screen when older wrappers break.
   Keeps all existing systems reachable and adds v20.1 risk systems correctly.
*/
(function(){
  function safeCall202(fn, fallback){
    try{ return typeof fn === 'function' ? fn() : fallback; }catch(e){ console.warn('[v20.2 safeCall]', e); return fallback; }
  }
  function row202(icon,title,sub,fn,locked=false,cls=''){
    try{ return row(icon,title,sub,fn,locked,cls); }catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}">
        <div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function has202(h,needle){ return String(h||'').toLowerCase().includes(String(needle||'').toLowerCase()); }
  function section202(title){ return `<div class="section">${title}</div>`; }
  function addRow202(h, needle, html){
    if(!has202(h, needle)) h += html;
    return h;
  }
  function money202(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function ensureState202(){
    try{
      state.flags=state.flags||{};
      state.stats=state.stats||{Happiness:50,Health:50,Smarts:50,Looks:50};
      state.pets=state.pets||[];
      state.children=state.children||[];
      state.siblings=state.siblings||[];
      state.items=state.items||[];
      state.houses=state.houses||[];
      state.cars=state.cars||[];
      state.businesses=state.businesses||[];
      state.lifestyle=state.lifestyle||{items:[],investments:[],businesses:[],loans:[],yearlyCosts:0};
      state.lifestyle.items=state.lifestyle.items||[];
      state.lifestyle.investments=state.lifestyle.investments||[];
      state.lifestyle.businesses=state.lifestyle.businesses||[];
      state.lifestyle.loans=state.lifestyle.loans||[];
    }catch(e){}
  }
  function coreActivities202(){
    ensureState202();
    let h = '';
    h += section202('Activiteiten');
    h += row202('💼','Work','Baan, carrière, solliciteren en werkacties','workScreen()');
    h += row202('🎓','Education','School, studie en opleiding','educationScreen()');
    h += row202('💪','Gym / Sport','Fitness, health en stamina trainen','gymScreen()');
    h += row202('🐾','Pets','Dierenasiel, fokkers, pet store en jouw huisdieren','petsMainScreen()');
    h += row202('💈','Kapper','Kapsel of haarkleur wijzigen zonder huid/genetica te veranderen','barberShop199()', typeof barberShop199!=='function');
    h += row202('🧑‍🤝‍🧑','Friends / Uitgaan','Vrienden, sociale acties en nightlife','friendsHub ? friendsHub() : relationshipsScreen && relationshipsScreen()', true);
    h += section202('Geld & Lifestyle');
    h += row202('💰','Geld & Lifestyle','Shopping, huis-upgrades, investeren, business en leningen','moneyLifestyleHub165()', typeof moneyLifestyleHub165!=='function');
    h += row202('🏪','Business','Eigen business beheren','businessScreen()', typeof businessScreen!=='function' || (state.age||0)<18);
    h += section202('Wereld & reizen');
    h += row202('🌍','Wereldkaart / Reizen','Vakantie, landen en wereldsystemen','worldMapScreen174 ? worldMapScreen174() : worldMapScreen()', (typeof worldMapScreen174!=='function' && typeof worldMapScreen!=='function'));
    h += row202('🏖️','Vakantie hub','DLC vakanties en activiteiten','vacationHub180 ? vacationHub180(state.vacation||state.world||"spain") : worldMapScreen174()', (typeof vacationHub180!=='function' && typeof worldMapScreen174!=='function'));
    h += section202('Risico & systemen');
    h += row202('🚔','Crime','Kattenkwaad, misdaad en justice systeem','crimeScreen()', typeof crimeScreen!=='function');
    h += row202('🏚️','Familie-financiën & risico','Oudersteun, fietsen, dierenverkoop, wees mode','parentBankruptcyInfo201()', typeof parentBankruptcyInfo201!=='function');
    if(state && state.orphanMode201) h += row202('🧒','Wees mode','Jeugdzorg, pleeggezin en gevolgen','orphanModeScreen201()', typeof orphanModeScreen201!=='function');
    h += section202('Sport & carrières');
    if(typeof footballCareerScreen==='function') h += row202('⚽','Football Career','Clubs, trainingen en wedstrijden','footballCareerScreen()');
    if(typeof combatCareerHub177==='function') h += row202('🥊','Combat Career','UFC/GLORY/WWE routes en fights','combatCareerHub177()');
    if(typeof sportsRankingsHub164==='function') h += row202('🏆','Rankings & Tactical Fights','WWE/GLORY/UFC rankings en title fights','sportsRankingsHub164()');
    h += section202('Debug');
    h += row202('🛠️','Patch status','Controleer of de nieuwste systemen geladen zijn','patchStatus202()');
    return h;
  }

  const brokenValues202 = new Set([undefined, null, false]);
  const oldActivities202 = (typeof window.activitiesHTML === 'function') ? window.activitiesHTML : (typeof activitiesHTML === 'function' ? activitiesHTML : null);

  function repairedActivities202(){
    ensureState202();
    let h = '';
    let oldOk = false;
    if(oldActivities202 && oldActivities202 !== repairedActivities202){
      try{
        h = oldActivities202();
        oldOk = typeof h === 'string' && h.trim().length > 40;
      }catch(e){
        console.warn('[v20.2] old activitiesHTML crashed, using rebuilt fallback', e);
        oldOk = false;
      }
    }
    if(!oldOk) h = coreActivities202();

    // Add missing essentials without duplicating existing sections.
    h = addRow202(h, 'moneyLifestyleHub165', section202('Geld & Lifestyle') + row202('💰','Geld & Lifestyle','Shopping, huis-upgrades, investeren, business en leningen','moneyLifestyleHub165()', typeof moneyLifestyleHub165!=='function'));
    h = addRow202(h, 'petsMainScreen', section202('Huisdieren') + row202('🐾','Pets','Dierenasiel, fokkers, pet store en jouw huisdieren','petsMainScreen()', typeof petsMainScreen!=='function'));
    h = addRow202(h, 'gymScreen', section202('Gezondheid') + row202('💪','Gym / Sport','Fitness, health en stamina trainen','gymScreen()', typeof gymScreen!=='function'));
    h = addRow202(h, 'crimeScreen', section202('Risico') + row202('🚔','Crime','Misdaad en justice systeem','crimeScreen()', typeof crimeScreen!=='function'));
    h = addRow202(h, 'parentBankruptcyInfo201', section202('Risico systemen') + row202('🏚️','Familie-financiën & risico','Oudersteun, fietsen, dierenverkoop, wees mode','parentBankruptcyInfo201()', typeof parentBankruptcyInfo201!=='function'));
    h = addRow202(h, 'barberShop199', section202('Uiterlijk') + row202('💈','Kapper','Kapsel of haarkleur wijzigen zonder huid/genetica te veranderen','barberShop199()', typeof barberShop199!=='function'));

    if(state && state.orphanMode201){
      h = addRow202(h, 'orphanModeScreen201', section202('Wees mode') + row202('🧒','Wees mode','Jeugdzorg, pleeggezin en gevolgen','orphanModeScreen201()', typeof orphanModeScreen201!=='function'));
    }

    // If a bad patch left a duplicate broken "Risico systemen", clean light duplicates.
    try{
      const div=document.createElement('div');
      div.innerHTML=String(h);
      const seen=new Set();
      [...div.querySelectorAll('.row')].forEach(el=>{
        const oc=el.getAttribute('onclick')||'';
        const title=el.querySelector('.rTitle')?.textContent||'';
        const key=oc||title;
        if(key && seen.has(key)) el.remove();
        else if(key) seen.add(key);
      });
      h=div.innerHTML;
    }catch(e){}

    return h;
  }
  window.activitiesHTML = repairedActivities202;
  try{ activitiesHTML = window.activitiesHTML; }catch(e){}

  // Safety patch screenHTML too: activities tab should never crash from undefined activitiesHTML again.
  const oldScreenHTML202 = window.screenHTML || (typeof screenHTML==='function' ? screenHTML : null);
  if(oldScreenHTML202 && !oldScreenHTML202.__v202){
    window.screenHTML = function(name){
      if(name==='activities'){
        try{ return window.activitiesHTML(); }catch(e){ console.warn('[v20.2 screen activities fallback]', e); return coreActivities202(); }
      }
      try{ return oldScreenHTML202.apply(this,arguments); }catch(e){
        console.warn('[v20.2 screenHTML fallback]', name, e);
        if(name==='life' && typeof lifeHTML==='function') return safeCall202(lifeHTML,'');
        if(name==='assets' && typeof assetsHTML==='function') return safeCall202(assetsHTML,'');
        if(name==='relationships' && typeof relationshipsHTML==='function') return safeCall202(relationshipsHTML,'');
        return coreActivities202();
      }
    };
    window.screenHTML.__v202 = true;
    try{ screenHTML = window.screenHTML; }catch(e){}
  }

  // Fix v20.1 typo live if that script already poisoned globals.
  if(typeof window.activitiesHTML !== 'function'){
    window.activitiesHTML = repairedActivities202;
    try{ activitiesHTML = window.activitiesHTML; }catch(e){}
  }

  window.patchStatus202=function(){
    ensureState202();
    const checks=[
      ['Activiteiten hersteld', typeof window.activitiesHTML==='function'],
      ['Pets systeem', typeof petsMainScreen==='function' && typeof petAction==='function'],
      ['Dierenverkoop crime', typeof recordPetSaleCrime201==='function'],
      ['Ouder failliet systeem', typeof parentBankruptcyInfo201==='function' && typeof recordParentSupport201==='function'],
      ['Wees mode', typeof orphanModeScreen201==='function'],
      ['Business/invest 18+', typeof businessHub165==='function' || typeof businessScreen==='function'],
      ['Kapper/avatar', typeof barberShop199==='function'],
      ['iPhone safe-area', typeof fixIphoneSafariSafeArea200==='function']
    ];
    const rows=checks.map(c=>`${c[1]?'✅':'❌'} ${c[0]}`).join('<br>');
    showModal(`<div class="modalTop"><div class="avatar">🛠️</div><div class="modalTitle">Patch status v20.2</div></div><div class="modalBody"><div class="card">${rows}</div><div class="card"><b>Tip</b><br>Als je na updaten nog een oud scherm ziet: refresh Safari/Chrome volledig of sluit de tab en open opnieuw.</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{
    try{
      ensureState202();
      if(typeof safeSave==='function') safeSave();
      if(typeof render==='function') render();
    }catch(e){ console.warn('[v20.2 delayed render]', e); }
  }, 300);
})();
