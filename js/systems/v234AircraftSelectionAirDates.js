
/* v23.4 Aircraft Selection + Air Dates
   - Assets now lets you choose active aircraft.
   - If you own aircraft, you can make a local flight directly from Assets.
   - Fly solo, with partner, or with adult fling/date.
   - Adult aircraft intimacy is non-graphic, 18+ only, consent/relationship consequences.
*/
(function(){
  function clamp234(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r234(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick234(a){return a[Math.floor(Math.random()*a.length)]}
  function money234(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast234(t){try{toast(t)}catch(e){console.log(t)}}
  function apply234(s){try{applyStats(s||{})}catch(e){}}
  function saveRender234(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function rr234(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function sec234(t){return `<div class="section">${t}</div>`}
  function card234(h){return `<div class="card">${h}</div>`}
  function modal234(icon,title,body,back='closeModal()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody v234Body">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`);
    setTimeout(fixClick234,0);
  }
  function result234(icon,title,txt,stats={},cash=0,type='good',back='closeModal()'){
    if(cash)state.money=(state.money||0)+cash;
    apply234(stats);
    try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(e){}
    saveRender234();
    modal234(icon,title,card234(txt),back);
  }
  function fixClick234(){
    try{
      document.querySelectorAll('#modal .row,#modal .btn').forEach(el=>{
        el.style.pointerEvents='auto';
        el.style.touchAction='manipulation';
        el.style.position='relative';
        el.style.zIndex='9';
      });
    }catch(e){}
  }

  const AIR_ICON234={
    cessna172:'🛩️', piperpa28:'🛩️', cirrussr22:'✈️',
    beechcraft:'✈️', pilatuspc12:'✈️', citationm2:'🛫',
    phenom300:'🛫', gulfstream:'🛬'
  };

  function ensureAviation234(){
    try{ if(typeof ensureAviation233==='function') ensureAviation233(); }catch(e){}
    try{ if(typeof ensureAviationIsland230==='function') ensureAviationIsland230(); }catch(e){}
    state.aviation230=state.aviation230||{theory:0,flightHours:0,license:false,aircraft:[]};
    const a=state.aviation230;
    a.aircraft=a.aircraft||[];
    a.activeAircraftId=a.activeAircraftId||null;
    a.aircraft.forEach((p,i)=>{
      p.localId=p.localId||('plane_'+(p.id||'air')+'_'+(p.boughtAge||state.age||0)+'_'+i+'_'+Math.floor(Math.random()*9999));
      p.icon=AIR_ICON234[p.id] || (/gulfstream/i.test(p.name||'')?'🛬':/citation|phenom|jet/i.test(p.name||'')?'🛫':/cessna|piper/i.test(p.name||'')?'🛩️':'✈️');
      delete p.appearance; delete p.avatarSpriteKey211; delete p.avatarSpriteKey212; delete p.avatarSpriteKey213; delete p.avatarSpriteKey218;
      p.condition=clamp234(p.condition??85,1,100);
      p.hours=Number(p.hours||0);
      p.value=Math.max(0,Math.round(p.value||p.price||0));
      p.selected=!!p.selected;
    });
    if(a.aircraft.length && !a.aircraft.some(p=>p.localId===a.activeAircraftId)){
      a.activeAircraftId=a.aircraft[0].localId;
      a.aircraft[0].selected=true;
    }
    a.aircraft.forEach(p=>p.selected=(p.localId===a.activeAircraftId));
    return a;
  }
  window.ensureAviation234=ensureAviation234;

  function activePlane234(){
    const a=ensureAviation234();
    return a.aircraft.find(p=>p.localId===a.activeAircraftId) || a.aircraft[0] || null;
  }
  function planeLabel234(p){
    if(!p)return 'Geen vliegtuig gekozen';
    return `${p.icon||'✈️'} ${p.name} · staat ${p.condition}% · ${p.hours.toFixed(1)} uur`;
  }
  function flightCost234(p,kind='local'){
    if(!p)return 0;
    const base = kind==='island'?2500:kind==='date'?900:kind==='local'?450:700;
    const jet=/Gulfstream|Citation|Phenom|King Air|Pilatus/i.test(p.name||'');
    const condPenalty=p.condition<50?1.6:1;
    return Math.round((jet?base*2.5:base)*condPenalty);
  }
  function usePlaneWear234(p,kind='local'){
    const hrs=kind==='island'?r234(2,7):Math.round((0.6+Math.random()*1.4)*10)/10;
    p.hours=Number(p.hours||0)+hrs;
    state.aviation230.flightHours=Number(state.aviation230.flightHours||0)+hrs;
    p.condition=clamp234(p.condition-r234(kind==='date'?2:1,kind==='island'?6:4),1,100);
    return hrs;
  }

  window.chooseAircraftHub234=function(){
    const a=ensureAviation234();
    let h=card234(`<b>Actief vliegtuig</b><br>${planeLabel234(activePlane234())}<br><span class="mini">Dit vliegtuig wordt gebruikt voor rondjes vliegen, vakantiekorting en privé-eiland reizen.</span>`);
    h+=sec234('Kies vliegtuig');
    h+=a.aircraft.length?a.aircraft.map((p,i)=>rr234(p.icon||'✈️',`${p.selected?'✅ ':''}${p.name}`,`${money234(p.value)} · staat ${p.condition}% · ${p.rented?'charter':'eigen gebruik'}`,`setActiveAircraft234(${i})`)).join(''):card234('Je bezit nog geen vliegtuig.');
    h+=sec234('Acties');
    h+=rr234('🛫','Rondje vliegen',a.aircraft.length?'Solo, met partner of met fling/date':'Koop eerst een vliegtuig','aircraftFlightMenu234()',!a.aircraft.length);
    h+=rr234('🛒','Vliegtuig kopen','Naar vliegtuigmarkt','aircraftMarket230()',typeof aircraftMarket230!=='function');
    modal234('✈️','Vliegtuig kiezen',h,'aviationHub230()');
  };
  window.setActiveAircraft234=function(i){
    const a=ensureAviation234();
    const p=a.aircraft[i]; if(!p)return toast234('Vliegtuig niet gevonden.');
    a.activeAircraftId=p.localId;
    a.aircraft.forEach(x=>x.selected=(x.localId===p.localId));
    result234(p.icon||'✈️','Actief vliegtuig gekozen',`${p.name} is nu je actieve vliegtuig.`,{Happiness:1},0,'good','chooseAircraftHub234()');
  };

  window.aircraftFlightMenu234=function(){
    const p=activePlane234();
    if(!p)return toast234('Je hebt nog geen vliegtuig.');
    if(p.condition<30)return toast234('Je vliegtuig is in te slechte staat. Eerst onderhoud.');
    let h=card234(`<b>${planeLabel234(p)}</b><br>Rondje vliegen gebruikt dit actieve vliegtuig.<br>Kosten lokaal: ${money234(flightCost234(p,'local'))}`);
    h+=sec234('Rondje vliegen');
    h+=rr234('🛫','Solo rondje vliegen','Gewoon even de lucht in','aircraftLocalFlight234("solo")',(state.money||0)<flightCost234(p,'local'));
    h+=rr234('💑','Samen vliegen met partner',state.partner?'Partner mee de lucht in':'Je hebt geen partner','aircraftLocalFlight234("partner")',!state.partner||(state.money||0)<flightCost234(p,'date'));
    h+=rr234('🖤','Vliegen met fling / date','18+ date mee; kan vreemdgaan zijn als je monogaam bent','aircraftFlingSetup234()',state.age<18||(state.money||0)<flightCost234(p,'date'));
    h+=sec234('Beheer');
    h+=rr234('✅','Ander vliegtuig kiezen','Selecteer actief vliegtuig','chooseAircraftHub234()');
    if(typeof aircraftDetail230==='function'){
      const idx=ensureAviation234().aircraft.indexOf(p);
      h+=rr234('🛠️','Vliegtuig beheren','Onderhoud, charter, verkopen','aircraftDetail230('+idx+')');
    }
    modal234('🛫','Rondje vliegen',h,'chooseAircraftHub234()');
  };

  window.aircraftLocalFlight234=function(mode='solo',person=null){
    const p=activePlane234();
    if(!p)return toast234('Geen vliegtuig.');
    if(p.condition<30)return toast234('Te slechte staat. Eerst onderhoud.');
    let cost=flightCost234(p,mode==='solo'?'local':'date');
    if((state.money||0)<cost)return toast234('Niet genoeg geld voor vluchtkosten.');
    state.money-=cost;
    const hrs=usePlaneWear234(p,mode==='solo'?'local':'date');
    let txt='', stats={Happiness:8,Stamina:-4,Smarts:1}, type='good';

    if(mode==='solo'){
      txt=`Ik maakte een rondje vliegen met mijn ${p.name}. De wereld leek even klein onder mij.<br>Kosten: ${money234(cost)} · +${hrs} vlieguren · staat vliegtuig ${p.condition}%.`;
      return result234('🛫','Rondje vliegen',txt,stats,0,type,'aircraftFlightMenu234()');
    }

    if(mode==='partner'){
      const partner=state.partner;
      if(!partner)return toast234('Je hebt geen partner.');
      const d=ensureRelationshipIfPossible234();
      const happy=clamp234((partner.rel||50)+(d?d.satisfaction||50:50)+r234(-20,25));
      if(happy>70){
        partner.rel=clamp234((partner.rel||50)+r234(5,12));
        if(d)d.satisfaction=clamp234((d.satisfaction||50)+r234(5,12));
        txt=`Ik nam ${partner.name} mee voor een privévlucht in mijn ${p.name}. Het voelde luxe en romantisch.`;
        stats.Happiness=12;
      }else{
        partner.rel=clamp234((partner.rel||50)+r234(0,4));
        txt=`Ik vloog samen met ${partner.name}. Het was bijzonder, maar niet alles voelde vanzelf romantisch.`;
        stats.Happiness=6;
        type='warn';
      }
      txt+=`<br>Kosten: ${money234(cost)} · +${hrs} vlieguren · staat vliegtuig ${p.condition}%.`;
      return result234('💑','Samen vliegen',txt,stats,0,type,'aircraftFlightMenu234()');
    }

    if(mode==='fling'){
      let other=person||genFling234();
      const consent=adult234(other) && Math.random()<((other.rel||55)+25)/120;
      if(!consent){
        txt=`Ik nam ${other.name} mee voor een vlucht, maar de klik was er niet echt. We hielden het gewoon bij praten en uitzicht.`;
        stats={Happiness:2,Stamina:-3};
        type='warn';
      }else{
        txt=`Ik vloog met ${other.name}. De sfeer werd flirterig en we brachten een volwassen, intieme avond samen in alle discretie.`;
        stats={Happiness:10,Stamina:-7,Looks:1};
        if(state.partner){
          try{
            if(typeof playerCheat233==='function') playerCheat233('aircraft_fling',other);
            else markCheating234(other);
          }catch(e){markCheating234(other);}
          txt+=`<br><span class="mini">Let op: omdat je een partner hebt, kan dit relatiegevolgen krijgen.</span>`;
        }
      }
      txt+=`<br>Kosten: ${money234(cost)} · +${hrs} vlieguren · staat vliegtuig ${p.condition}%.`;
      return result234('🖤','Vlucht met fling',txt,stats,0,type,'aircraftFlightMenu234()');
    }
  };

  function adult234(p){return state.age>=18 && (!p || Number(p.age||18)>=18)}
  function genFling234(){
    const g=Math.random()<.5?'male':'female';
    let first=g==='female'?'Mila':'Luca', last='Smit';
    try{first=pick234(DATE_NAMES[g]||[first]); last=pick234(DATA.lastNames||[last]);}catch(e){}
    const p={name:first+' '+last,age:Math.max(18,state.age+r234(-4,7)),gender:g,rel:r234(45,80),source:'aircraft_fling'};
    try{p.icon=humanIcon(g,p.age)}catch(e){p.icon=g==='female'?'👩':'👨'}
    return p;
  }
  window.aircraftFlingSetup234=function(){
    if(state.age<18)return toast234('Alleen 18+.');
    const p=activePlane234(); if(!p)return toast234('Geen vliegtuig.');
    const people=[genFling234(),genFling234(),genFling234()];
    window._airFling234=people;
    let h=card234(`<b>Fling / date vlucht</b><br>Kies iemand om mee te nemen. Alleen 18+, consensueel en non-graphic.<br>Vluchtkosten: ${money234(flightCost234(p,'date'))}.`);
    h+=people.map((x,i)=>rr234(x.icon||'👤',x.name,`${x.age} jaar · klik ${x.rel}% · vliegtuigdate`, `aircraftFlingPick234(${i})`)).join('');
    modal234('🖤','Vliegen met fling/date',h,'aircraftFlightMenu234()');
  };
  window.aircraftFlingPick234=function(i){
    const p=window._airFling234&&window._airFling234[i];
    if(!p)return toast234('Date niet gevonden.');
    aircraftLocalFlight234('fling',p);
  };

  function ensureRelationshipIfPossible234(){
    try{if(typeof ensureRelationship233==='function')return ensureRelationship233()}catch(e){}
    state.relationship233=state.relationship233||{type:'monogamy',trust:50,satisfaction:50,jealousy:50,events:[],polyPartners:[]};
    return state.relationship233;
  }
  function markCheating234(other){
    const d=ensureRelationshipIfPossible234();
    d.playerCheated=true;
    d.trust=clamp234((d.trust||50)-r234(8,18));
    d.satisfaction=clamp234((d.satisfaction||50)-r234(3,10));
    try{addLog(`<b>Relatie-risico</b><br>Ik ging buiten mijn relatie om met ${other.name}. Als mijn partner dit hoort kan het grote gevolgen hebben.`, 'warn', false)}catch(e){}
  }

  // Extend existing v230 aircraft detail with active select + flight options.
  const oldAircraftDetail234 = window.aircraftDetail230 || null;
  if(oldAircraftDetail234 && !oldAircraftDetail234.__airDate234){
    window.aircraftDetail230=function(i){
      ensureAviation234();
      oldAircraftDetail234.apply(this,arguments);
      setTimeout(()=>{
        try{
          const a=ensureAviation234().aircraft[i];
          const body=document.querySelector('#modal .modalBody');
          if(!a||!body||body.innerHTML.includes('aircraftLocalFlight234'))return;
          const alt=body.querySelector('.btn.alt');
          const s=document.createElement('div');s.className='section';s.textContent='Vliegen & kiezen';
          const wrap=document.createElement('div');
          wrap.innerHTML=
            rr234('✅','Kies als actief vliegtuig',a.selected?'Dit is je actieve vliegtuig':'Gebruik dit vliegtuig standaard',`setActiveAircraft234(${i})`)+
            rr234('🛫','Rondje vliegen met dit vliegtuig','Solo, partner of fling/date',`setActiveAircraft234(${i});aircraftFlightMenu234()`,a.condition<30);
          body.insertBefore(s,alt||null);
          while(wrap.firstElementChild)body.insertBefore(wrap.firstElementChild,alt||null);
        }catch(e){}
      },0);
    };
    window.aircraftDetail230.__airDate234=true;
  }

  // Add directly into Assets, even if older assetsHTML already patched.
  const oldAssetsHTML234=window.assetsHTML||(typeof assetsHTML==='function'?assetsHTML:null);
  if(oldAssetsHTML234 && !oldAssetsHTML234.__airDate234){
    window.assetsHTML=function(){
      ensureAviation234();
      let html=oldAssetsHTML234.apply(this,arguments);
      const a=state.aviation230;
      const p=activePlane234();
      let block='';
      block+=sec234('Vliegtuig kiezen & vliegen');
      block+=rr234('✅','Actief vliegtuig kiezen',p?planeLabel234(p):'Je bezit nog geen vliegtuig','chooseAircraftHub234()',!a.aircraft.length);
      block+=rr234('🛫','Rondje vliegen',p?'Solo, met partner of met fling/date':'Koop eerst een vliegtuig','aircraftFlightMenu234()',!p);
      if(p)block+=rr234(p.icon||'✈️',`Actief: ${p.name}`,`Staat ${p.condition}% · ${p.hours.toFixed(1)} uur · klik voor beheer`,`aircraftDetail230(${a.aircraft.indexOf(p)})`,typeof aircraftDetail230!=='function');
      // Put near aviation block if possible, otherwise append.
      if(!String(html).includes('Vliegtuig kiezen & vliegen')){
        if(String(html).includes('Luchtvaart & Privé-eiland')){
          html=String(html).replace('Luchtvaart & Privé-eiland</div>','Luchtvaart & Privé-eiland</div>'+block);
        }else html+=block;
      }
      return html;
    };
    window.assetsHTML.__airDate234=true;
    try{assetsHTML=window.assetsHTML}catch(e){}
  }

  // Improve aviation hub with direct choose/flight rows.
  const oldAviationHub234=window.aviationHub230||null;
  if(oldAviationHub234 && !oldAviationHub234.__airDate234){
    window.aviationHub230=function(){
      ensureAviation234();
      oldAviationHub234.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(!body||body.innerHTML.includes('chooseAircraftHub234'))return;
          const p=activePlane234();
          const alt=body.querySelector('.btn.alt');
          const s=document.createElement('div');s.className='section';s.textContent='Vliegen';
          const wrap=document.createElement('div');
          wrap.innerHTML=
            rr234('✅','Actief vliegtuig kiezen',p?planeLabel234(p):'Nog geen vliegtuig','chooseAircraftHub234()',!p)+
            rr234('🛫','Rondje vliegen',p?'Solo, met partner of fling/date':'Koop eerst vliegtuig','aircraftFlightMenu234()',!p);
          body.insertBefore(s,alt||null);
          while(wrap.firstElementChild)body.insertBefore(wrap.firstElementChild,alt||null);
        }catch(e){}
      },0);
    };
    window.aviationHub230.__airDate234=true;
  }

  // Make aircraft icons immune to broad asset sprite patches.
  function cleanupAircraft234(root=document){
    try{
      const a=ensureAviation234();
      a.aircraft.forEach(p=>{
        root.querySelectorAll('.row').forEach(row=>{
          if((row.textContent||'').includes(p.name)){
            const ico=row.querySelector('.rIco'); if(ico)ico.innerHTML=p.icon||'✈️';
            row.querySelectorAll('img.headSprite206,img.headSprite208,img.headSprite211,img').forEach(img=>{
              if((row.textContent||'').includes(p.name)) img.replaceWith(document.createTextNode(p.icon||'✈️'));
            });
          }
        });
      });
    }catch(e){}
  }
  window.cleanupAircraftIcons234=cleanupAircraft234;

  const oldItemIcon234=window.itemIcon||null;
  window.itemIcon=function(name){
    const s=String(name||'');
    if(/cessna|piper|cirrus|beechcraft|pilatus|citation|phenom|gulfstream|vliegtuig|aircraft|jet|skyhawk|cherokee/i.test(s)){
      if(/gulfstream/i.test(s))return '🛬';
      if(/citation|phenom|jet/i.test(s))return '🛫';
      if(/cessna|piper|skyhawk|cherokee/i.test(s))return '🛩️';
      return '✈️';
    }
    return oldItemIcon234?oldItemIcon234.apply(this,arguments):'🎁';
  };
  try{itemIcon=window.itemIcon}catch(e){}

  const oldShow234=window.showModal||(typeof showModal==='function'?showModal:null);
  if(oldShow234 && !oldShow234.__airDate234){
    window.showModal=function(html){
      const ret=oldShow234.call(this,html);
      setTimeout(()=>{fixClick234();cleanupAircraft234(document)},0);
      return ret;
    };
    window.showModal.__airDate234=true; try{showModal=window.showModal}catch(e){}
  }
  const oldRender234=window.render||(typeof render==='function'?render:null);
  if(oldRender234 && !oldRender234.__airDate234){
    window.render=function(){
      try{ensureAviation234()}catch(e){}
      const ret=oldRender234.apply(this,arguments);
      setTimeout(()=>cleanupAircraft234(document),0);
      return ret;
    };
    window.render.__airDate234=true; try{render=window.render}catch(e){}
  }
  const oldSave234=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave234 && !oldSave234.__airDate234){
    window.safeSave=function(){try{ensureAviation234()}catch(e){}return oldSave234.apply(this,arguments)};
    window.safeSave.__airDate234=true; try{safeSave=window.safeSave}catch(e){}
  }

  window.debugAircraftDates234=function(){
    ensureAviation234();
    let h=card234(`<b>Aircraft date debug</b><br>Actief: ${planeLabel234(activePlane234())}<br>Vliegtuigen: ${state.aviation230.aircraft.length}`);
    h+=rr234('✅','Actief vliegtuig kiezen','Assets keuze menu','chooseAircraftHub234()');
    h+=rr234('🛫','Rondje vliegen','Solo/partner/fling','aircraftFlightMenu234()',!activePlane234());
    modal234('🛠️','Aircraft dates debug',h,'closeModal()');
  };

  setTimeout(()=>{try{ensureAviation234();cleanupAircraft234(document);safeSave();render()}catch(e){}},350);
})();
