
/* v22.8 Home Activities + Cleaner Fix
   - restores full home activities in original BitzLife style
   - chillen, gamen, relaxen, hangen, vrienden over de vloer, schoonmaken
   - cleaner service can be hired/filled in, visited, yearly processed
   - works for family home, rental and owned homes
*/
(function(){
  function clamp228(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r228(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick228(a){return a[Math.floor(Math.random()*a.length)]}
  function money228(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast228(t){try{toast(t)}catch(e){console.log(t)}}
  function rr228(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}">
        <div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div>
      </div>`;
    }
  }
  function sec228(t){return `<div class="section">${t}</div>`}
  function card228(h){return `<div class="card">${h}</div>`}
  function modal228(icon,title,body,back='closeModal()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`);
  }
  function act228(title,txt,stats={},cash=0,type='good'){
    try{return action(title,txt,stats,cash,type)}catch(e){
      if(cash)state.money=(state.money||0)+cash;
      try{applyStats(stats)}catch(_){}
      try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(_){}
      try{safeSave();render()}catch(_){}
    }
  }
  function age228(){return (state&&state.age)||0}
  function inJail228(){try{return isInJail()}catch(e){return !!(state&&state.jail&&state.jail.yearsLeft>0)}}
  function hasAdultHome228(){
    return !!(state && Array.isArray(state.houses) && state.houses.length);
  }
  function homeObj228(){
    state.houses=state.houses||[];
    let h=state.houses.find(x=>x.primary)||state.houses[0];
    if(h){
      normalizeHome228(h);
      return {house:h,index:state.houses.indexOf(h),family:false};
    }
    // Family home / bedroom, especially for children/teens.
    state.familyHome228=state.familyHome228||{
      name:'Thuis bij ouders',
      icon:'🏠',
      owned:false,
      primary:true,
      familyHome:true,
      cleanliness:62,
      comfort:45,
      quality:50,
      condition:60,
      security:45,
      energy:40,
      rooms:3,
      houseMood:50
    };
    normalizeHome228(state.familyHome228);
    return {house:state.familyHome228,index:-1,family:true};
  }
  function normalizeHome228(h){
    if(!h||typeof h!=='object')return h;
    h.icon=h.icon||(h.owned?'🏠':'🏢');
    h.cleanliness=clamp228(h.cleanliness ?? h.clean ?? 60);
    h.comfort=clamp228(h.comfort ?? 50);
    h.quality=clamp228(h.quality ?? 50);
    h.condition=clamp228(h.condition ?? 60);
    h.security=clamp228(h.security ?? 40);
    h.energy=clamp228(h.energy ?? 35);
    h.houseMood=clamp228(h.houseMood ?? Math.round((h.cleanliness+h.comfort+h.condition)/3));
    return h;
  }
  function allHomes228(){
    const arr=[...(state.houses||[])];
    if(state.familyHome228)arr.push(state.familyHome228);
    arr.forEach(normalizeHome228);
    return arr;
  }
  function homeName228(){
    const o=homeObj228();
    return o.house.name || (o.family?'Thuis bij ouders':'Mijn woning');
  }
  function homeStatus228(h){
    normalizeHome228(h);
    return `Schoon ${h.cleanliness}% · comfort ${h.comfort}% · staat ${h.condition}% · vibe ${h.houseMood}%`;
  }

  function services228(){
    state.homeServices228=state.homeServices228||{};
    state.homeServices228.cleaner=state.homeServices228.cleaner||null;
    return state.homeServices228;
  }
  function cleaner228(){
    return services228().cleaner;
  }
  const CLEANERS228=[
    {id:'budget',icon:'🧹',name:'Budget schoonmaker',monthly:90,quality:45,trust:45,desc:'Goedkoop, basis schoonmaken.'},
    {id:'normal',icon:'🧽',name:'Vaste schoonmaker',monthly:180,quality:65,trust:62,desc:'Betrouwbaar, goede kwaliteit.'},
    {id:'premium',icon:'✨',name:'Premium schoonmaakservice',monthly:420,quality:84,trust:75,desc:'Duur, snel en professioneel.'},
    {id:'luxury',icon:'🏛️',name:'Huishoudmanager',monthly:1200,quality:95,trust:85,desc:'Voor rijke levens: regelt schoonmaak, was, planning en voorraad.'}
  ];
  function cleanerSub228(c){
    if(!c)return 'Geen schoonmaker ingesteld';
    return `${c.name} · ${money228(c.monthly)}/mnd · kwaliteit ${c.quality}% · vertrouwen ${c.trust}%`;
  }

  window.homeLifeScreen=function(){
    if(inJail228())return toast228('Je zit vast; thuisactiviteiten zijn nu niet beschikbaar.');
    const o=homeObj228(), h=o.house, c=cleaner228();
    let body=card228(`<b>${o.family?'Familiehuis / kamer':'Thuis bij '+h.name}</b><br>${homeStatus228(h)}<br><span class="mini">Deze activiteiten werken nu weer vanuit je huis/kamer, huurwoning of koopwoning.</span>`);
    body+=sec228('Thuis activiteiten');
    body+=rr228('🛋️','Chillen met vrienden','Vrienden over de vloer, praten, bankhangen','homeActivity228("friends")',age228()<10);
    body+=rr228('🖥️','Gamen','Gamen op pc/console of telefoon','homeActivity228("gaming")');
    body+=rr228('😌','Relaxen','Rust, herstel en stress omlaag','homeActivity228("relax")');
    body+=rr228('🧃','Hangen thuis','Op de bank hangen, series, snacks, niks doen','homeActivity228("hang")');
    body+=rr228('🎉','House party / vrienden over de vloer','Gezellig maar rommel en burenkans','homeActivity228("party")',age228()<14);
    body+=sec228('Huis bijhouden');
    body+=rr228('🧽','Zelf schoonmaken','Schoonheid omhoog, discipline erbij','homeActivity228("clean")');
    body+=rr228('🧹','Schoonmaker regelen',cleanerSub228(c),'cleanerHub228()');
    body+=rr228('✨','Schoonmaker laten komen',c?'Laat je schoonmaker vandaag langskomen':'Eerst schoonmaker instellen','cleanerVisit228()',!c);
    body+=sec228('Extra');
    body+=rr228('📱','Social media thuis','Scrollen of posten vanaf thuis','socialMedia()',typeof socialMedia!=='function');
    if(typeof chillWithFriendsScreen==='function')body+=rr228('👥','Chillen classic menu','Oude chill/gamen/drugs menu, als extra route','chillWithFriendsScreen()',age228()<10);
    modal228(h.icon||'🏠','Thuis activiteiten',body,'closeModal()');
  };
  try{homeLifeScreen=window.homeLifeScreen}catch(e){}

  window.homeActivity228=function(kind){
    const o=homeObj228(), h=o.house;
    let txt='',stats={},cash=0,type='good';
    state.talents=state.talents||{};
    if(kind==='friends'){
      if(age228()<10)return toast228('Chillen met vrienden kan vanaf 10 jaar.');
      let f=(state.friends&&state.friends.length)?pick228(state.friends):null;
      let name=f?f.name:'een paar gasten uit de buurt';
      txt=`Ik chillde thuis met ${name}. Er werd gepraat, gelachen en veel te lang op de bank gehangen.`;
      stats={Happiness:7,Stamina:-4};
      h.cleanliness=clamp228(h.cleanliness-r228(3,8));
      h.houseMood=clamp228(h.houseMood+r228(1,4));
      state.talents.social=clamp228((state.talents.social||0)+2);
      if(f&&typeof addRel==='function')addRel(f,r228(3,8));
      if(!f && Math.random()<0.25 && typeof DATE_NAMES!=='undefined' && typeof DATA!=='undefined'){
        let g=Math.random()<0.5?'male':'female';
        let nf={name:pick228(DATE_NAMES[g]||DATA.firstNames)+' '+pick228(DATA.lastNames),age:age228(),gender:g,rel:r228(35,65),from:'thuis chillen'};
        try{nf.icon=humanIcon(g,age228())}catch(e){}
        state.friends=state.friends||[];
        state.friends.push(nf);
        txt+=` Ik leerde ook ${nf.name} kennen.`;
      }
    }
    if(kind==='gaming'){
      const ownsPC=(state.items||[]).some(it=>/gaming pc|pc|computer|console/i.test(String(it.name||'')));
      txt=ownsPC?pick228([
        'Ik ging thuis gamen op mijn setup. De tijd vloog voorbij.',
        'Ik speelde online met vrienden en werd veel te fanatiek.',
        'Ik ging gamen en voelde me even helemaal uit de wereld.'
      ]):pick228([
        'Ik ging gamen op mijn telefoon. Niet de beste setup, maar wel ontspannend.',
        'Ik speelde wat simpele games thuis en kwam tot rust.',
        'Ik keek gameclips en speelde een tijdje mobiel.'
      ]);
      stats={Happiness:ownsPC?8:5,Smarts:1,Stamina:-4};
      h.houseMood=clamp228(h.houseMood+2);
      h.cleanliness=clamp228(h.cleanliness-r228(0,3));
    }
    if(kind==='relax'){
      txt=pick228([
        'Ik relaxte thuis en deed even helemaal niks. Dat had ik nodig.',
        'Ik zette alles uit, ging liggen en kwam eindelijk een beetje tot rust.',
        'Ik bleef thuis, nam rust en voelde mijn batterij langzaam opladen.'
      ]);
      stats={Happiness:5,Stamina:12,Health:2};
      h.houseMood=clamp228(h.houseMood+3);
    }
    if(kind==='hang'){
      txt=pick228([
        'Ik hing thuis op de bank met snacks en een serie.',
        'Ik deed een hangdag thuis. Niet productief, wel lekker.',
        'Ik bleef thuis rondhangen en liet de dag een beetje voorbij glijden.'
      ]);
      stats={Happiness:4,Stamina:6,Smarts:-1};
      h.cleanliness=clamp228(h.cleanliness-r228(1,5));
    }
    if(kind==='party'){
      if(age228()<14)return toast228('House party kan vanaf 14 jaar.');
      txt=pick228([
        'Ik had vrienden over de vloer. Het werd gezellig, luid en rommelig.',
        'Ik gaf een kleine house party. Goede sfeer, slechte opruimfase.',
        'Mijn huis werd even de vaste hangplek van de groep.'
      ]);
      stats={Happiness:10,Stamina:-14,Health:-2};
      cash=-Math.min(state.money||0,r228(25,160));
      h.cleanliness=clamp228(h.cleanliness-r228(12,28));
      h.condition=clamp228(h.condition-r228(0,5));
      h.houseMood=clamp228(h.houseMood+r228(2,8));
      if(Math.random()<0.22){txt+=' De buren klaagden over lawaai.';stats.Happiness-=3;type='warn';}
    }
    if(kind==='clean'){
      txt=pick228([
        'Ik hield een schoonmaakdag. Saai, maar het huis voelde daarna veel beter.',
        'Ik ruimde op, maakte schoon en gooide oude troep weg.',
        'Ik poetste de boel en voelde me daarna verrassend volwassen.'
      ]);
      stats={Happiness:3,Health:3,Stamina:-7};
      h.cleanliness=clamp228(h.cleanliness+r228(18,32));
      h.condition=clamp228(h.condition+r228(1,4));
      h.houseMood=clamp228(h.houseMood+r228(4,8));
      state.talents.discipline=clamp228((state.talents.discipline||0)+2);
    }
    normalizeHome228(h);
    closeModal();
    act228('Thuis',txt,stats,cash,type);
  };

  // Keep old homeAction compatible
  window.homeAction=function(kind){
    const map={chill:'friends',party:'party',clean:'clean',relax:'relax',window:'hang',game:'gaming',gaming:'gaming',hang:'hang'};
    return homeActivity228(map[kind]||kind);
  };
  try{homeAction=window.homeAction}catch(e){}

  window.cleanerHub228=function(){
    const o=homeObj228(), h=o.house, c=cleaner228();
    let body=card228(`<b>Schoonmaker</b><br>Huidig: ${cleanerSub228(c)}<br>Woning: ${h.name}<br>${homeStatus228(h)}<br><span class="mini">Een schoonmaker kost maandelijks geld en verwerkt jaarlijks automatisch mee. Je kunt ook handmatig laten langskomen.</span>`);
    body+=sec228('Schoonmaker kiezen');
    CLEANERS228.forEach((x,i)=>{
      body+=rr228(x.icon,x.name,`${money228(x.monthly)}/mnd · kwaliteit ${x.quality}% · ${x.desc}`,`hireCleaner228(${i})`,age228()<18 && !hasAdultHome228());
    });
    body+=sec228('Acties');
    body+=rr228('✨','Schoonmaker laten komen',c?'Directe schoonmaakbeurt':'Eerst schoonmaker kiezen','cleanerVisit228()',!c);
    body+=rr228('📝','Schoonmaker naam invullen','Geef je vaste schoonmaker een eigen naam','setCleanerName228()',!c);
    body+=rr228('❌','Schoonmaker stoppen','Abonnement opzeggen','fireCleaner228()',!c);
    modal228('🧹','Schoonmaker regelen',body,'homeLifeScreen()');
  };

  window.hireCleaner228=function(i){
    const base=CLEANERS228[i];
    if(!base)return;
    if(age228()<18 && !hasAdultHome228())return toast228('Een vaste schoonmaker regel je zelf vanaf 18 jaar of met eigen woning.');
    if((state.money||0)<base.monthly)return toast228('Niet genoeg geld voor de eerste maand.');
    state.money-=base.monthly;
    const names=['Samira','Fatima','Anja','Monique','Sofia','Rosa','Nadia','Kim','Linda','Yara','Mila','Olga'];
    services228().cleaner={
      id:base.id,
      icon:base.icon,
      name:pick228(names),
      serviceName:base.name,
      monthly:base.monthly,
      quality:base.quality,
      trust:base.trust,
      visits:0,
      active:true,
      hiredAge:age228()
    };
    cleanerVisit228(true);
  };

  window.setCleanerName228=function(){
    const c=cleaner228();
    if(!c)return toast228('Je hebt nog geen schoonmaker.');
    const cur=c.name||'';
    const html=`<div class="modalTop"><div class="avatar">📝</div><div class="modalTitle">Schoonmaker naam</div></div><div class="modalBody"><div class="card">Vul de naam in van je vaste schoonmaker.</div><input id="cleanerName228" class="input" value="${cur.replace(/"/g,'&quot;')}" placeholder="Naam"><button class="btn" onclick="saveCleanerName228()">Opslaan</button><button class="btn alt" onclick="cleanerHub228()">Terug</button></div>`;
    showModal(html);
  };
  window.saveCleanerName228=function(){
    const c=cleaner228();
    if(!c)return;
    const el=document.getElementById('cleanerName228');
    const val=(el&&el.value||'').trim();
    if(!val)return toast228('Vul een naam in.');
    c.name=val.slice(0,32);
    try{safeSave()}catch(e){}
    cleanerHub228();
  };

  window.cleanerVisit228=function(fromHire=false){
    const c=cleaner228();
    if(!c)return toast228('Je hebt nog geen schoonmaker ingesteld.');
    const o=homeObj228(), h=o.house;
    if(!fromHire && (state.money||0)<Math.round(c.monthly/2))return toast228('Niet genoeg geld voor een losse schoonmaakbeurt.');
    if(!fromHire)state.money-=Math.round(c.monthly/2);
    c.visits=(c.visits||0)+1;
    c.trust=clamp228(c.trust+r228(1,4));
    const cleanGain=Math.round(c.quality*0.35)+r228(6,14);
    h.cleanliness=clamp228(h.cleanliness+cleanGain);
    h.condition=clamp228(h.condition+Math.round(c.quality/28));
    h.houseMood=clamp228(h.houseMood+Math.round(c.quality/18));
    normalizeHome228(h);
    closeModal();
    act228('Schoonmaker',fromHire?`Ik nam ${c.name} aan als ${c.serviceName}. De eerste schoonmaakbeurt werd meteen gedaan.`:`${c.name} kwam schoonmaken. Het huis voelde meteen frisser.`,{Happiness:4,Health:2,Stamina:fromHire?0:2},0,'good');
  };

  window.fireCleaner228=function(){
    const c=cleaner228();
    if(!c)return toast228('Je hebt geen schoonmaker.');
    const name=c.name||'de schoonmaker';
    services228().cleaner=null;
    closeModal();
    act228('Schoonmaker',`Ik stopte de schoonmaakservice van ${name}.`,{Happiness:-1},0,'warn');
  };

  function processCleanerYear228(){
    const c=cleaner228();
    if(!c||!c.active)return;
    const annual=(c.monthly||0)*12;
    let paid=false;
    if((state.money||0)>=annual){
      state.money-=annual; paid=true;
      allHomes228().forEach(h=>{
        h.cleanliness=clamp228(h.cleanliness+Math.round(c.quality/2));
        h.condition=clamp228(h.condition+Math.round(c.quality/35));
        h.houseMood=clamp228(h.houseMood+Math.round(c.quality/24));
      });
      c.visits=(c.visits||0)+12;
      c.trust=clamp228(c.trust+r228(2,6));
      try{addLog(`<b>Schoonmaker</b><br>${c.name} hield het huis dit jaar netjes. Kosten: ${money228(annual)}.`, 'good', false)}catch(e){}
    }else{
      c.trust=clamp228(c.trust-r228(8,18));
      try{addLog(`<b>Schoonmaker</b><br>Ik kon de schoonmaker niet betalen. De service staat op pauze.`, 'warn', false)}catch(e){}
      c.active=false;
    }
    allHomes228().forEach(h=>{
      h.cleanliness=clamp228(h.cleanliness-r228(3,9));
      h.houseMood=clamp228(Math.round((h.cleanliness+h.comfort+h.condition)/3));
    });
  }
  window.processCleanerYear228=processCleanerYear228;

  const oldAge228=window.ageUp||(typeof ageUp==='function'?ageUp:null);
  if(oldAge228&&!oldAge228.__cleaner228){
    window.ageUp=function(){
      const ret=oldAge228.apply(this,arguments);
      try{processCleanerYear228();safeSave();render()}catch(e){}
      return ret;
    };
    window.ageUp.__cleaner228=true;
    try{ageUp=window.ageUp}catch(e){}
  }

  // Inject home activities inside house asset details too
  const oldAssetHouse228=window.assetHouse||(typeof assetHouse==='function'?assetHouse:null);
  if(oldAssetHouse228&&!oldAssetHouse228.__home228){
    window.assetHouse=function(i){
      const ret=oldAssetHouse228.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body && !body.innerHTML.includes('homeLifeScreen()')){
            const sec=document.createElement('div');sec.className='section';sec.textContent='Thuis';
            const wrap=document.createElement('div');
            wrap.innerHTML=rr228('🛋️','Thuis activiteiten','Chillen, gamen, relaxen, hangen, schoonmaker','homeLifeScreen()');
            const wrap2=document.createElement('div');
            wrap2.innerHTML=rr228('🧹','Schoonmaker regelen',cleanerSub228(cleaner228()),'cleanerHub228()');
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(sec,alt||null);
            body.insertBefore(wrap.firstElementChild,alt||null);
            body.insertBefore(wrap2.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
      return ret;
    };
    window.assetHouse.__home228=true;
    try{assetHouse=window.assetHouse}catch(e){}
  }

  // Add direct home row to money/lifestyle hub and free-time hubs if visible
  const oldMoney228=window.moneyLifestyleMasterHub204||null;
  if(oldMoney228&&!oldMoney228.__home228){
    window.moneyLifestyleMasterHub204=function(){
      oldMoney228.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body && !body.innerHTML.includes('homeLifeScreen()')){
            const sec=document.createElement('div');sec.className='section';sec.textContent='Thuis';
            const wrap=document.createElement('div');wrap.innerHTML=rr228('🛋️','Thuis activiteiten','Chillen, gamen, relaxen, hangen, schoonmaker','homeLifeScreen()');
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(sec,alt||null);body.insertBefore(wrap.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.moneyLifestyleMasterHub204.__home228=true;
  }

  window.homeCleanerDebug228=function(){
    const o=homeObj228(), c=cleaner228();
    let body=card228(`<b>Home debug</b><br>Home: ${o.house.name}<br>${homeStatus228(o.house)}<br>Cleaner: ${cleanerSub228(c)}`);
    body+=rr228('🛋️','Open thuis activiteiten','Test alle huisacties','homeLifeScreen()');
    body+=rr228('🧹','Open schoonmaker','Test schoonmaker invullen/bezoeken','cleanerHub228()');
    modal228('🛠️','Home/Cleaner debug',body,'closeModal()');
  };

  const oldSave228=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave228&&!oldSave228.__home228){
    window.safeSave=function(){
      try{allHomes228()}catch(e){}
      return oldSave228.apply(this,arguments);
    };
    window.safeSave.__home228=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  setTimeout(()=>{try{allHomes228();safeSave();render()}catch(e){}},300);
})();
