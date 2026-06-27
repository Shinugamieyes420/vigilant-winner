
/* v23.5 Home Tap + Rich Risk + Island Command
   - Fixes Home Activities mobile tapping via delegated modal actions.
   - Adds high-net-worth risks above €50M: lawsuits, hacking, one-life kidnapping.
   - Adds legal/security defense and court mini-game.
   - Adds Island Command: defense, raids/attacks as abstract game events, takeover of rival islands,
     humane population policy choices, expanded buildings including hospital/schools/university/space platform.
   NOTE: This is fictional game logic only. No real-world tactical weapon instructions.
*/
(function(){
  const HOME_ATTR='data-home-action-235';
  const RISK_ATTR='data-risk-action-235';
  const ISLAND_ATTR='data-island-action-235';

  function clamp235(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(Number(v)||0)))}
  function r235(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick235(a){return a[Math.floor(Math.random()*a.length)]}
  function money235(v){try{return money(v)}catch(e){return '€ '+Math.round(Number(v)||0).toLocaleString('nl-NL')}}
  function toast235(t){try{toast(t)}catch(e){console.log(t)}}
  function apply235(s){try{applyStats(s||{})}catch(e){}}
  function saveRender235(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function sec235(t){return `<div class="section">${t}</div>`}
  function card235(h){return `<div class="card">${h}</div>`}
  function modal235(icon,title,body,back='closeModal()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody v235Body">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`);
    setTimeout(bindTaps235,0);
  }
  function row235(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function tapRow235(attr,action,icon,title,sub,locked=false){
    return `<div class="row ${locked?'locked':''}" ${locked?'':`${attr}="${action}"`} role="button" tabindex="0">
      <div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div>
    </div>`;
  }
  function result235(icon,title,txt,stats={},cash=0,type='good',back='closeModal()'){
    if(cash)state.money=(Number(state.money)||0)+cash;
    apply235(stats);
    try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(e){}
    saveRender235();
    modal235(icon,title,card235(`${txt}<br><br><span class="mini">✅ Verwerkt.</span>`),back);
  }
  function age235(){return (state&&state.age)||0}
  function inJail235(){try{return isInJail()}catch(e){return !!(state&&state.jail&&state.jail.yearsLeft>0)}}

  function bindTaps235(){
    try{
      const modal=document.getElementById('modal');
      if(!modal)return;
      if(!modal.__tap235){
        modal.__tap235=true;
        const handler=function(ev){
          const home=ev.target.closest&&ev.target.closest(`[${HOME_ATTR}]`);
          const risk=ev.target.closest&&ev.target.closest(`[${RISK_ATTR}]`);
          const island=ev.target.closest&&ev.target.closest(`[${ISLAND_ATTR}]`);
          const el=home||risk||island;
          if(!el||!modal.contains(el))return;
          ev.preventDefault(); ev.stopPropagation();
          if(home)return dispatchHome235(home.getAttribute(HOME_ATTR));
          if(risk)return dispatchRisk235(risk.getAttribute(RISK_ATTR));
          if(island)return dispatchIsland235(island.getAttribute(ISLAND_ATTR));
        };
        modal.addEventListener('click',handler,true);
        modal.addEventListener('touchend',handler,true);
        modal.addEventListener('pointerup',handler,true);
      }
      document.querySelectorAll(`#modal [${HOME_ATTR}],#modal [${RISK_ATTR}],#modal [${ISLAND_ATTR}],#modal .row,#modal .btn`).forEach(el=>{
        el.style.pointerEvents='auto';
        el.style.touchAction='manipulation';
        el.style.position='relative';
        el.style.zIndex='20';
      });
    }catch(e){}
  }
  window.bindTaps235=bindTaps235;

  /* ================= HOME TAP FIX ================= */
  function normalizeHome235(h){
    if(!h||typeof h!=='object')return h;
    h.icon=h.icon||(h.owned?'🏠':'🏢');
    h.cleanliness=clamp235(h.cleanliness ?? h.clean ?? 60);
    h.comfort=clamp235(h.comfort ?? 50);
    h.quality=clamp235(h.quality ?? 50);
    h.condition=clamp235(h.condition ?? 60);
    h.houseMood=clamp235(h.houseMood ?? Math.round((h.cleanliness+h.comfort+h.condition)/3));
    return h;
  }
  function homeObj235(){
    state.houses=state.houses||[];
    let h=state.houses.find(x=>x.primary)||state.houses[0];
    if(h)return {house:normalizeHome235(h), family:false};
    state.familyHome228=state.familyHome228||{name:'Thuis bij ouders',icon:'🏠',owned:false,familyHome:true,cleanliness:62,comfort:45,condition:60,quality:50,houseMood:50};
    return {house:normalizeHome235(state.familyHome228), family:true};
  }
  function cleaner235(){
    state.homeServices228=state.homeServices228||{};
    return state.homeServices228.cleaner||null;
  }
  function cleanerText235(){
    const c=cleaner235();
    return c?`${c.name||c.serviceName||'Schoonmaker'} · ${money235(c.monthly||0)}/mnd · kwaliteit ${c.quality||50}%`:'Geen schoonmaker ingesteld';
  }
  function homeStatus235(h){return `Schoon ${h.cleanliness}% · comfort ${h.comfort}% · staat ${h.condition}% · vibe ${h.houseMood}%`}
  window.homeLifeScreen=function(){
    if(inJail235())return toast235('Je zit vast; thuisactiviteiten zijn nu niet beschikbaar.');
    const o=homeObj235(), h=o.house;
    let body=card235(`<b>${o.family?'Familiehuis / kamer':'Thuis bij '+h.name}</b><br>${homeStatus235(h)}<br><span class="mini">v23.5 tap-fix: hele row werkt op mobiel.</span>`);
    body+=sec235('Thuis activiteiten');
    body+=tapRow235(HOME_ATTR,'friends','🛋️','Chillen met vrienden','Vrienden over de vloer, praten, bankhangen',age235()<10);
    body+=tapRow235(HOME_ATTR,'gaming','🖥️','Gamen','Gamen op pc/console of telefoon');
    body+=tapRow235(HOME_ATTR,'relax','😌','Relaxen','Rust, herstel en stress omlaag');
    body+=tapRow235(HOME_ATTR,'hang','🧃','Hangen thuis','Op de bank hangen, series, snacks, niks doen');
    body+=tapRow235(HOME_ATTR,'party','🎉','House party / vrienden over de vloer','Gezellig maar rommel en burenkans',age235()<14);
    body+=sec235('Huis bijhouden');
    body+=tapRow235(HOME_ATTR,'clean','🧽','Zelf schoonmaken','Schoonheid omhoog, discipline erbij');
    body+=tapRow235(HOME_ATTR,'cleaner','🧹','Schoonmaker regelen',cleanerText235());
    body+=tapRow235(HOME_ATTR,'cleanerVisit','✨','Schoonmaker laten komen',cleaner235()?'Directe schoonmaakbeurt':'Eerst schoonmaker instellen',!cleaner235());
    body+=sec235('Extra');
    body+=tapRow235(HOME_ATTR,'social','📱','Social media thuis','Scrollen of posten vanaf thuis',typeof socialMedia!=='function');
    modal235(h.icon||'🏠','Thuis activiteiten',body,'closeModal()');
  };
  try{homeLifeScreen=window.homeLifeScreen}catch(e){}
  function dispatchHome235(a){
    if(a==='cleaner')return typeof cleanerHub228==='function'?cleanerHub228():toast235('Schoonmaker systeem niet gevonden.');
    if(a==='cleanerVisit')return typeof cleanerVisit228==='function'?cleanerVisit228():toast235('Schoonmaker niet gevonden.');
    if(a==='social')return typeof socialMedia==='function'?socialMedia():toast235('Social media niet beschikbaar.');
    return homeAction235(a);
  }
  function homeAction235(kind){
    const o=homeObj235(), h=o.house;
    let txt='', stats={}, cash=0, type='good';
    state.talents=state.talents||{};
    if(kind==='friends'){
      if(age235()<10)return toast235('Chillen met vrienden kan vanaf 10 jaar.');
      let f=(state.friends&&state.friends.length)?pick235(state.friends):null;
      txt=`Ik chillde thuis met ${f?f.name:'een paar mensen uit de buurt'}. Er werd gepraat, gelachen en op de bank gehangen.`;
      stats={Happiness:7,Stamina:-4};
      h.cleanliness=clamp235(h.cleanliness-r235(3,8)); h.houseMood=clamp235(h.houseMood+r235(1,5));
      state.talents.social=clamp235((state.talents.social||0)+2);
      if(f){try{addRel(f,r235(3,8))}catch(e){f.rel=clamp235((f.rel||50)+r235(3,8))}}
    }
    if(kind==='gaming'){const owns=(state.items||[]).some(it=>/gaming pc|pc|computer|console/i.test(String(it.name||'')));txt=owns?'Ik ging thuis gamen op mijn setup. De tijd vloog voorbij.':'Ik ging gamen op mijn telefoon. Niet perfect, wel ontspannend.';stats={Happiness:owns?8:5,Smarts:1,Stamina:-4};h.cleanliness=clamp235(h.cleanliness-r235(0,3));h.houseMood=clamp235(h.houseMood+2);}
    if(kind==='relax'){txt='Ik relaxte thuis en deed even helemaal niks. Mijn batterij laadde weer op.';stats={Happiness:5,Stamina:12,Health:2};h.houseMood=clamp235(h.houseMood+3);}
    if(kind==='hang'){txt='Ik hing thuis op de bank met snacks en een serie. Niet productief, wel lekker.';stats={Happiness:4,Stamina:6,Smarts:-1};h.cleanliness=clamp235(h.cleanliness-r235(1,5));}
    if(kind==='party'){if(age235()<14)return toast235('House party kan vanaf 14 jaar.');txt='Ik had vrienden over de vloer. Het werd gezellig, luid en rommelig.';stats={Happiness:10,Stamina:-14,Health:-2};cash=-Math.min(state.money||0,r235(25,160));h.cleanliness=clamp235(h.cleanliness-r235(12,28));h.condition=clamp235(h.condition-r235(0,5));h.houseMood=clamp235(h.houseMood+r235(2,8));if(Math.random()<0.22){txt+=' De buren klaagden over lawaai.';type='warn';}}
    if(kind==='clean'){txt='Ik hield een schoonmaakdag. Saai, maar het huis voelde daarna veel beter.';stats={Happiness:3,Health:3,Stamina:-7};h.cleanliness=clamp235(h.cleanliness+r235(18,32));h.condition=clamp235(h.condition+r235(1,4));h.houseMood=clamp235(h.houseMood+r235(4,8));state.talents.discipline=clamp235((state.talents.discipline||0)+2);}
    normalizeHome235(h);
    result235('🏠','Thuis',txt,stats,cash,type,'homeLifeScreen()');
  }
  window.homeActivity235=homeAction235;
  window.homeAction=function(kind){
    const map={chill:'friends',party:'party',clean:'clean',relax:'relax',window:'hang',game:'gaming',gaming:'gaming',hang:'hang'};
    return homeAction235(map[kind]||kind);
  };
  try{homeAction=window.homeAction}catch(e){}

  /* ================= SECURITY / LEGAL / RICH RISK ================= */
  function ensureSecurity235(){
    state.security235=state.security235||{};
    const s=state.security235;
    s.personalCyber=clamp235(s.personalCyber ?? 20);
    s.familyCyber=clamp235(s.familyCyber ?? 15);
    s.familyPhysical=clamp235(s.familyPhysical ?? 10);
    s.privacy=clamp235(s.privacy ?? 20);
    s.legalShield=clamp235(s.legalShield ?? 10);
    s.businessCompliance=clamp235(s.businessCompliance ?? 10);
    s.crisisTeam=clamp235(s.crisisTeam ?? 0);
    s.hackCount=Number(s.hackCount||0);
    s.kidnapUsed=!!s.kidnapUsed;
    s.lastProcessedAge=s.lastProcessedAge ?? -99;
    s.lastHackAge=s.lastHackAge ?? -99;
    s.lastLawsuitAge=s.lastLawsuitAge ?? -99;
    s.pendingEvent=s.pendingEvent||null;
    s.events=s.events||[];
    s.activeServices=s.activeServices||{bodyguard:false,crisis:false,legal:false,cyber:false,umbrella:false,compliance:false,islandDefense:false};
    return s;
  }
  window.ensureSecurity235=ensureSecurity235;
  function num235(x){return Number(x||0)||0}
  function netWorth235(){
    let n=num235(state.money);
    try{(state.houses||[]).forEach(h=>n+=num235(h.value||h.price))}catch(e){}
    try{(state.cars||[]).forEach(c=>n+=num235(c.value||c.price))}catch(e){}
    try{(state.items||[]).forEach(i=>n+=num235(i.value||i.price||i.purchaseValue))}catch(e){}
    try{(state.aviation230?.aircraft||[]).forEach(a=>n+=num235(a.value||a.price))}catch(e){}
    try{if(state.privateIsland230)n+=num235(state.privateIsland230.value||100000000)}catch(e){}
    try{(state.islandCommand235?.ownedIslands||[]).forEach(i=>{if(!i.primarySource)n+=num235(i.value)})}catch(e){}
    try{(state.lifestyle?.investments||[]).forEach(i=>n+=num235(i.value))}catch(e){}
    try{(state.lifestyle?.businesses||[]).forEach(b=>n+=num235(b.value||b.cash||b.cashReserve))}catch(e){}
    try{(state.businessManager205?.businesses||[]).forEach(b=>n+=num235(b.value||b.valuation||b.cashReserve||b.cash))}catch(e){}
    return Math.round(n);
  }
  window.netWorth235=netWorth235;
  function securityYearlyCost235(){
    const s=ensureSecurity235(); let c=0;
    if(s.activeServices.bodyguard)c+=950000;
    if(s.activeServices.crisis)c+=1200000;
    if(s.activeServices.legal)c+=750000;
    if(s.activeServices.cyber)c+=450000;
    if(s.activeServices.umbrella)c+=350000;
    if(s.activeServices.compliance)c+=600000;
    if(s.activeServices.islandDefense)c+=2500000;
    return c;
  }
  function securityStatus235(){
    const s=ensureSecurity235(), nw=netWorth235();
    return card235(`<b>Security, Legal & Risk</b><br>
      Net worth: ${money235(nw)} ${nw>=50000000?'· high-profile actief':'· onder €50M grens'}<br>
      Legal shield: ${s.legalShield}% · compliance ${s.businessCompliance}%<br>
      Privacy: ${s.privacy}% · cyber ${s.personalCyber}/${s.familyCyber}%<br>
      Familie security: ${s.familyPhysical}% · crisis ${s.crisisTeam}%<br>
      Jaarlijkse bescherming: ${money235(securityYearlyCost235())}<br>
      ${s.pendingEvent?`<span style="color:#ffd166"><b>Open event:</b> ${s.pendingEvent.title}</span>`:'<span class="mini">Geen open rijkdom-risk event.</span>'}`);
  }
  const LAWYERS235=[
    {id:'cheap',icon:'👨‍⚖️',name:'Lokale advocaat',retainer:100000,win:8,settle:5,desc:'Goedkoop, beperkt bij miljoenenzaken.'},
    {id:'solid',icon:'⚖️',name:'Corporate advocaat',retainer:1000000,win:18,settle:13,desc:'Sterk voor zakelijke claims.'},
    {id:'top',icon:'🏛️',name:'Topkantoor',retainer:5000000,win:32,settle:24,desc:'Duur, maar veel betere kans.'},
    {id:'elite',icon:'🛡️',name:'Elite crisis-law firm',retainer:12000000,win:45,settle:35,desc:'Voor miljardair-problemen.'}
  ];
  window.securityLegalHub235=function(){
    const s=ensureSecurity235();
    let h=securityStatus235();
    h+=sec235('Bescherming');
    h+=tapRow235(RISK_ATTR,'buy:cyber','🔐','Cybersecurity consultant',`${money235(450000)}/jr · privé/familie cyber`);
    h+=tapRow235(RISK_ATTR,'buy:privacy','🕶️','Privacy management',`${money235(250000)} eenmalig · minder ex/fling/media claims`,(state.money||0)<250000);
    h+=tapRow235(RISK_ATTR,'buy:bodyguard','🛡️','Familie securityteam',`${money235(950000)}/jr · minder ontvoering/stalking`);
    h+=tapRow235(RISK_ATTR,'buy:legal','⚖️','Legal retainer',`${money235(750000)}/jr · betere rechtszaken`);
    h+=tapRow235(RISK_ATTR,'buy:umbrella','☂️','Umbrella liability insurance',`${money235(350000)}/jr · dekt kleinere claims`);
    h+=tapRow235(RISK_ATTR,'buy:compliance','🏢','Business compliance office',`${money235(600000)}/jr · minder klanten/werknemersclaims`);
    h+=tapRow235(RISK_ATTR,'buy:crisis','🚨','Crisis response team',`${money235(1200000)}/jr · beter bij hack/kidnap/lawsuit`);
    h+=sec235('Events');
    if(s.pendingEvent)h+=tapRow235(RISK_ATTR,'pending','🔔',s.pendingEvent.title,`${String(s.pendingEvent.text||'').replace(/<[^>]+>/g,'').slice(0,90)}...`);
    h+=tapRow235(RISK_ATTR,'history','📜','Risk history',`${s.events.length} events opgeslagen`);
    h+=tapRow235(RISK_ATTR,'forceLawsuit','🧪','Test rechtszaak-event','Debug/test: forceer lawsuit check',netWorth235()<50000000);
    h+=sec235('Privé-eiland');
    h+=tapRow235(RISK_ATTR,'war','🏝️','Island Command / Warfare','Kartel-aanvallen, verdediging, overnames en eilandbouw',!hasAnyIsland235());
    modal235('🛡️','Security, Legal & Island Command',h,'closeModal()');
  };
  function buySecurity235(kind){
    const s=ensureSecurity235(), svc=s.activeServices;
    let txt='';
    if(kind==='cyber'){svc.cyber=!svc.cyber;s.personalCyber=clamp235(s.personalCyber+(svc.cyber?25:-15));s.familyCyber=clamp235(s.familyCyber+(svc.cyber?20:-10));txt=svc.cyber?'Cybersecurity consultant actief.':'Cybersecurity consultant gestopt.';}
    if(kind==='privacy'){const cost=250000;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;s.privacy=clamp235(s.privacy+r235(12,22));txt='Privacy management geregeld.';}
    if(kind==='bodyguard'){svc.bodyguard=!svc.bodyguard;s.familyPhysical=clamp235(s.familyPhysical+(svc.bodyguard?30:-20));txt=svc.bodyguard?'Familie securityteam actief.':'Familie securityteam gestopt.';}
    if(kind==='legal'){svc.legal=!svc.legal;s.legalShield=clamp235(s.legalShield+(svc.legal?25:-15));txt=svc.legal?'Legal retainer actief.':'Legal retainer gestopt.';}
    if(kind==='umbrella'){svc.umbrella=!svc.umbrella;s.legalShield=clamp235(s.legalShield+(svc.umbrella?12:-8));txt=svc.umbrella?'Umbrella insurance actief.':'Umbrella insurance gestopt.';}
    if(kind==='compliance'){svc.compliance=!svc.compliance;s.businessCompliance=clamp235(s.businessCompliance+(svc.compliance?28:-16));txt=svc.compliance?'Business compliance office actief.':'Business compliance office gestopt.';}
    if(kind==='crisis'){svc.crisis=!svc.crisis;s.crisisTeam=clamp235(s.crisisTeam+(svc.crisis?35:-22));txt=svc.crisis?'Crisis response team actief.':'Crisis response team gestopt.';}
    result235('🛡️','Security & Legal',`${txt}<br>Jaarlijkse kosten nu: ${money235(securityYearlyCost235())}.`,{Smarts:1},0,'good','securityLegalHub235()');
  }

  function randClaimAmount235(type){
    const nw=netWorth235();
    let min=1000000, max=Math.min(100000000, Math.max(2000000, Math.round(nw*(type==='business_customer'||type==='employee'?0.50:0.30))));
    return r235(min,max);
  }
  function hasBusinessExposure235(){return !!((state.lifestyle?.businesses||[]).length || (state.businessManager205?.businesses||[]).length)}
  function pickLawsuitType235(){const opts=['fling','media'];if((state.exes||[]).length)opts.push('ex','ex');if(hasBusinessExposure235())opts.push('business_customer','employee','contractor','business_customer');return pick235(opts)}
  function plaintiff235(type){
    if(type==='ex'&&(state.exes||[]).length)return pick235(state.exes).name||'een ex';
    if(type==='fling')return pick235(['een ex-fling','een oude date','iemand uit je privéleven']);
    if(type==='business_customer')return pick235(['een klantengroep','een boze zakelijke klant','een premium klant']);
    if(type==='employee')return pick235(['een ex-medewerker','een manager','een contractor']);
    if(type==='contractor')return pick235(['een leverancier','een bouwpartner','een consultant']);
    return pick235(['een roddelblad','een influencer','een journalistiek platform']);
  }
  function lawsuitText235(type,name,claim){
    const map={ex:`${name} klaagt je aan en zegt dat jij financieel/privé schade hebt veroorzaakt.`,fling:`${name} claimt emotionele en reputatieschade na jullie fling.`,business_customer:`${name} claimt schade door je bedrijf, service of product.`,employee:`${name} claimt onterecht ontslag, stress of misgelopen bonussen.`,contractor:`${name} claimt contractbreuk rond je bedrijf/vastgoed/eiland.`,media:`${name} dreigt met privacy/reputatiezaak rond je rijke levensstijl.`};
    return `${map[type]||map.media}<br>Claim: <b>${money235(claim)}</b>.`;
  }
  function createLawsuit235(force=false){
    const s=ensureSecurity235(); if(s.pendingEvent&&!force)return s.pendingEvent;
    const type=pickLawsuitType235(), claim=randClaimAmount235(type), name=plaintiff235(type);
    const ev={id:'lawsuit_'+Date.now()+Math.floor(Math.random()*9999),type:'lawsuit',subType:type,title:'Rechtszaak dreigt',plaintiff:name,claim,text:lawsuitText235(type,name,claim),severity:'bad',prep:0,evidence:0,media:0,lawyer:null,stage:'new',age:age235()};
    s.pendingEvent=ev;s.events.unshift(ev);s.events=s.events.slice(0,30);s.lastLawsuitAge=age235();
    try{addLog(`<b>${ev.title}</b><br>${ev.text}`,'bad',false)}catch(e){}
    return ev;
  }
  window.createLawsuit235=createLawsuit235;
  function securityEventPopup235(){const ev=ensureSecurity235().pendingEvent;if(!ev)return securityLegalHub235();if(ev.type==='lawsuit')return lawsuitHub235();if(ev.type==='hack')return hackEvent235();if(ev.type==='kidnap')return kidnapEvent235();return securityLegalHub235()}
  window.securityEventPopup235=securityEventPopup235;
  window.lawsuitHub235=function(){
    const s=ensureSecurity235(), ev=s.pendingEvent;if(!ev||ev.type!=='lawsuit')return securityLegalHub235();
    let h=securityStatus235()+card235(`<b>${ev.title}</b><br>${ev.text}<br><br>Advocaat: ${ev.lawyer?ev.lawyer.name:'nog geen'}<br>Voorbereiding: ${ev.prep}% · bewijs: ${ev.evidence}% · media: ${ev.media}%`);
    h+=sec235('Advocaat huren');LAWYERS235.forEach((l,i)=>h+=tapRow235(RISK_ATTR,`lawyer:${i}`,l.icon,l.name,`${money235(l.retainer)} retainer · win +${l.win} · settlement +${l.settle}`,(state.money||0)<l.retainer));
    h+=sec235('Voorbereiden');
    h+=tapRow235(RISK_ATTR,'case:evidence','📁','Bewijs verzamelen',`${money235(250000)} · sterker in rechtbank`,(state.money||0)<250000);
    h+=tapRow235(RISK_ATTR,'case:media','📰','PR / media strategie',`${money235(400000)} · reputatieschade beperken`,(state.money||0)<400000);
    h+=tapRow235(RISK_ATTR,'case:negotiate','🤝','Onderhandelen / schikken','Vaak goedkoper dan verliezen');
    h+=tapRow235(RISK_ATTR,'case:court','🏛️','Naar rechtbank mini-game','3 rondes: statement, bewijs, kruisverhoor',!ev.lawyer);
    modal235('⚖️','Rechtszaak',h,'securityLegalHub235()');
  };
  function hireLawyer235(idx){const s=ensureSecurity235(), ev=s.pendingEvent, l=LAWYERS235[idx];if(!ev||!l)return;if((state.money||0)<l.retainer)return toast235('Niet genoeg geld voor retainer.');state.money-=l.retainer;ev.lawyer=Object.assign({},l);ev.prep=clamp235((ev.prep||0)+l.win);result235(l.icon,'Advocaat ingehuurd',`Je huurde ${l.name} in voor ${money235(l.retainer)}.`,{Smarts:2},0,'good','lawsuitHub235()')}
  function lawsuitAction235(kind){
    const s=ensureSecurity235(), ev=s.pendingEvent;if(!ev||ev.type!=='lawsuit')return;
    if(kind==='evidence'){const cost=250000;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;ev.evidence=clamp235((ev.evidence||0)+r235(12,28));ev.prep=clamp235((ev.prep||0)+r235(5,12));return result235('📁','Bewijs verzameld',`Bewijs staat nu op ${ev.evidence}%.`,{Smarts:1},0,'good','lawsuitHub235()')}
    if(kind==='media'){const cost=400000;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;ev.media=clamp235((ev.media||0)+r235(12,24));return result235('📰','PR strategie',`Media-control staat nu op ${ev.media}%.`,{Smarts:1,Happiness:-1},0,'good','lawsuitHub235()')}
    if(kind==='negotiate'){const shield=s.legalShield+(ev.lawyer?.settle||0)+ev.prep*.25+ev.media*.15;const pct=clamp235(r235(35,85)-Math.round(shield/4),12,90);const settlement=Math.round(ev.claim*pct/100);let h=card235(`<b>Schikkingsvoorstel</b><br>Claim: ${money235(ev.claim)}<br>Voorstel: ${money235(settlement)} (${pct}% van claim).`);h+=tapRow235(RISK_ATTR,`settle:${settlement}`,'💰','Schikking betalen','Event eindigt',(state.money||0)<settlement);h+=tapRow235(RISK_ATTR,'case:court','🏛️','Toch naar rechtbank','Meer risico, kan goedkoper zijn',!ev.lawyer);return modal235('🤝','Onderhandelen',h,'lawsuitHub235()')}
    if(kind==='court')return courtStart235();
  }
  function settle235(amount){const s=ensureSecurity235(), ev=s.pendingEvent;amount=Number(amount||0);if(!ev)return;if((state.money||0)<amount)return toast235('Niet genoeg geld.');state.money-=amount;ev.resolved=true;ev.result='settled';ev.settlement=amount;s.pendingEvent=null;result235('🤝','Rechtszaak geschikt',`Je schikte met ${ev.plaintiff} voor ${money235(amount)}.`,{Happiness:-6,Smarts:2},0,'warn','securityLegalHub235()')}
  function courtStart235(){const ev=ensureSecurity235().pendingEvent;if(!ev||!ev.lawyer)return toast235('Huur eerst een advocaat.');ev.court={round:1,score:0,opp:0,log:[]};courtRound235()}
  function courtRound235(){
    const ev=ensureSecurity235().pendingEvent;if(!ev||!ev.court)return lawsuitHub235();
    const labels={1:'Openingsstatement',2:'Bewijs presenteren',3:'Kruisverhoor'};
    let h=card235(`<b>${labels[ev.court.round]}</b><br>Rechtszaak tegen ${ev.plaintiff}<br>Score: jij ${ev.court.score} · tegenpartij ${ev.court.opp}<br><span class="mini">${ev.court.log.slice(-1)[0]||'Kies je aanpak.'}</span>`);
    h+=sec235('Aanpak');
    h+=tapRow235(RISK_ATTR,'court:aggressive','🔥','Agressief aanvallen','Sterk als bewijs hoog is, risico op backfire');
    h+=tapRow235(RISK_ATTR,'court:calm','🧠','Kalm en technisch','Veiliger, gebruikt legal shield');
    h+=tapRow235(RISK_ATTR,'court:settleTone','🤝','Schikkingsvriendelijk','Schade beperken als je verliest');
    modal235('🏛️','Rechtbank mini-game',h,'lawsuitHub235()');
  }
  function courtChoice235(choice){
    const s=ensureSecurity235(), ev=s.pendingEvent;if(!ev||!ev.court)return;
    let base=(ev.lawyer?.win||0)+s.legalShield*.35+s.businessCompliance*.20+ev.prep*.35+ev.evidence*.35+ev.media*.15+r235(-20,25);
    let risk=0,line='';
    if(choice==='aggressive'){base+=ev.evidence>45?18:-8;risk=ev.evidence<35?14:4;line='Je advocaat viel de claim hard aan.'}
    if(choice==='calm'){base+=s.legalShield*.25;risk=4;line='Je advocaat bleef kalm en technisch.'}
    if(choice==='settleTone'){base+=8;risk=2;ev.settleTone=true;line='Je team stuurde op schadebeperking.'}
    const opp=55+r235(-18,24)+risk;
    if(base>=opp){ev.court.score+=10;ev.court.opp+=r235(6,9);line+=' Ronde gewonnen.'}else{ev.court.score+=r235(6,9);ev.court.opp+=10;line+=' Ronde verloren.'}
    ev.court.log.push(`R${ev.court.round}: ${line}`);
    if(ev.court.round>=3)return courtFinish235();
    ev.court.round++; courtRound235();
  }
  function courtFinish235(){
    const s=ensureSecurity235(), ev=s.pendingEvent;const win=ev.court.score>=ev.court.opp;let cost=0,txt='',type='good';
    if(win){cost=Math.min(state.money||0,Math.round((ev.lawyer?.retainer||500000)*0.25));state.money-=cost;txt=`Je won de rechtszaak tegen ${ev.plaintiff}. Extra kosten: ${money235(cost)}.<br>${ev.court.log.join('<br>')}`;type='good'}
    else{let pct=ev.settleTone?r235(22,58):r235(45,100);pct=clamp235(pct-Math.round((s.legalShield+s.businessCompliance+ev.media)/12),10,100);cost=Math.round(ev.claim*pct/100);state.money-=Math.min(state.money||0,cost);txt=`Je verloor of moest zwaar betalen: ${money235(cost)} (${pct}% van claim).<br>${ev.court.log.join('<br>')}`;type='bad'}
    ev.resolved=true;ev.result=win?'won':'lost';ev.finalCost=cost;s.pendingEvent=null;result235('🏛️','Uitspraak rechtbank',txt,{Happiness:win?4:-16,Smarts:2},0,type,'securityLegalHub235()')
  }
  function hackEvent235(){const s=ensureSecurity235(),ev=s.pendingEvent;if(!ev)return;let h=securityStatus235()+card235(`<b>${ev.title}</b><br>${ev.text}`);h+=tapRow235(RISK_ATTR,'hack:contain','🔐','Incident response','Probeer geld terug te halen / schade te beperken');h+=tapRow235(RISK_ATTR,'buy:cyber','🧑‍💻','Cybersecurity consultant aan/uit','Verbeter toekomstige beveiliging');modal235('💻','Cyberaanval',h,'securityLegalHub235()')}
  function resolveHack235(){const s=ensureSecurity235(),ev=s.pendingEvent;if(!ev)return;const power=s.personalCyber+s.familyCyber+s.crisisTeam+r235(0,80);let recovered=0;if(power>150)recovered=Math.round(ev.stolen*r235(60,100)/100);else if(power>90)recovered=Math.round(ev.stolen*r235(20,60)/100);state.money+=recovered;s.personalCyber=clamp235(s.personalCyber+r235(3,9));s.pendingEvent=null;result235('🔐','Hack afgehandeld',`Er was ${money235(ev.stolen)} gestolen. Je haalde ${money235(recovered)} terug.`,{Smarts:3,Happiness:-4},0,recovered>0?'warn':'bad','securityLegalHub235()')}
  function kidnapEvent235(){const s=ensureSecurity235(),ev=s.pendingEvent;if(!ev)return;let h=securityStatus235()+card235(`<b>${ev.title}</b><br>${ev.text}`);h+=tapRow235(RISK_ATTR,'kidnap:pay','💰','Losgeld betalen',money235(ev.ransom),(state.money||0)<ev.ransom);h+=tapRow235(RISK_ATTR,'kidnap:police','🚔','Autoriteiten inschakelen','Risico, maar kan goedkoper zijn');h+=tapRow235(RISK_ATTR,'kidnap:crisis','🚨','Crisis/security team inzetten','Beste kans als crisis/family security hoog is');modal235('🚨','Ontvoering',h,'securityLegalHub235()')}
  function resolveKidnap235(kind){
    const s=ensureSecurity235(),ev=s.pendingEvent;if(!ev)return;let ok=false,cost=0,txt='';
    if(kind==='pay'){cost=ev.ransom;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;ok=true;txt=`Je betaalde ${money235(cost)}. ${ev.targetName} kwam veilig terug.`}
    if(kind==='police'){ok=Math.random()<((s.familyPhysical+s.privacy+45)/150);cost=ok?r235(100000,1000000):r235(1000000,5000000);state.money-=Math.min(state.money||0,cost);txt=ok?`De autoriteiten hielpen. ${ev.targetName} kwam terug. Kosten: ${money235(cost)}.`:`De operatie liep chaotisch en kostte ${money235(cost)}. Het trauma blijft groot.`}
    if(kind==='crisis'){ok=Math.random()<((s.familyPhysical+s.crisisTeam+70)/180);cost=1500000;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;txt=ok?`Je crisis/security team loste het professioneel op. ${ev.targetName} kwam terug.`:`Zelfs met je team werd het een nachtmerrie. Je verloor geld en vertrouwen.`}
    s.pendingEvent=null;result235('🚨','Ontvoering opgelost',txt,{Happiness:ok?-8:-25,Health:ok?-2:-8},0,ok?'warn':'bad','securityLegalHub235()')
  }

  /* ================= ISLAND COMMAND ================= */
  const BUILDINGS235={
    villa:{icon:'🏡',name:'Eiland villa',cost:2500000,upkeep:90000,income:0,infra:0,tourism:0,stability:2,defense:0,science:0,education:0,health:0,desc:'Eigen woning op het eiland.'},
    mansion:{icon:'🏰',name:'Mega mansion',cost:18000000,upkeep:450000,income:0,infra:0,tourism:4,stability:1,defense:0,science:0,education:0,health:0,desc:'Luxe hoofdhuis voor rijke owner.'},
    docks:{icon:'⚓',name:'Haven / pier',cost:3500000,upkeep:160000,income:150000,infra:15,tourism:12,stability:3,defense:3,science:0,education:0,health:0,desc:'Bevoorrading, jachten en handel.'},
    airstrip:{icon:'🛬',name:'Privé landingsbaan',cost:12000000,upkeep:500000,income:250000,infra:22,tourism:20,stability:4,defense:4,science:0,education:0,health:0,desc:'Vliegtuigtoegang en evacuaties.'},
    power:{icon:'🔋',name:'Solar + powergrid',cost:7000000,upkeep:220000,income:0,infra:20,tourism:0,stability:6,defense:1,science:0,education:0,health:0,desc:'Stroomvoorziening.'},
    water:{icon:'💧',name:'Waterzuivering',cost:5500000,upkeep:180000,income:0,infra:18,tourism:0,stability:7,defense:0,science:0,education:0,health:4,desc:'Schoon water.'},
    shops:{icon:'🛍️',name:'Winkels / marina shops',cost:4000000,upkeep:240000,income:600000,infra:0,tourism:18,stability:1,defense:0,science:0,education:0,health:0,desc:'Winkels en kleine economie.'},
    resort:{icon:'🏨',name:'Boutique resort',cost:25000000,upkeep:1500000,income:3500000,infra:0,tourism:35,stability:-2,defense:0,science:0,education:0,health:0,desc:'Toerisme en cashflow.'},
    hospital:{icon:'🏥',name:'Ziekenhuis',cost:45000000,upkeep:3500000,income:900000,infra:10,tourism:2,stability:18,defense:0,science:4,education:0,health:30,desc:'Gezondheid, crisiszorg en bevolkingstevredenheid.'},
    clinic:{icon:'🏥',name:'Kliniek',cost:9000000,upkeep:650000,income:120000,infra:8,tourism:0,stability:10,defense:0,science:1,education:0,health:12,desc:'Basiszorg voor bewoners/toeristen.'},
    school:{icon:'🏫',name:'School/community center',cost:8000000,upkeep:550000,income:0,infra:6,tourism:0,stability:12,defense:0,science:0,education:18,health:0,desc:'Educatie en stabiliteit.'},
    university:{icon:'🎓',name:'Private university',cost:120000000,upkeep:9000000,income:12000000,infra:18,tourism:8,stability:14,defense:0,science:20,education:35,health:0,desc:'Hoger onderwijs, talent en inkomsten.'},
    research:{icon:'🔬',name:'Research campus',cost:250000000,upkeep:18000000,income:30000000,infra:22,tourism:5,stability:8,defense:2,science:45,education:20,health:4,desc:'Tech, biotech en kennisindustrie.'},
    nasa:{icon:'🚀',name:'NASA-style launch platform',cost:3500000000,upkeep:180000000,income:350000000,infra:45,tourism:20,stability:5,defense:8,science:80,education:25,health:0,desc:'Ruimtevaartplatform met miljardenkosten en prestige.'},
    bank:{icon:'🏦',name:'Offshore bank district',cost:300000000,upkeep:25000000,income:65000000,infra:18,tourism:4,stability:-6,defense:0,science:0,education:0,health:0,desc:'Veel geld, meer rechtszaak/media-risico.'},
    factory:{icon:'🏭',name:'Light industry zone',cost:90000000,upkeep:8000000,income:18000000,infra:22,tourism:-4,stability:-5,defense:0,science:6,education:0,health:-4,desc:'Industrie en export.'},
    logistics:{icon:'📦',name:'Logistics hub',cost:60000000,upkeep:4500000,income:12000000,infra:28,tourism:2,stability:3,defense:2,science:0,education:0,health:0,desc:'Haven, voorraad en supply chains.'}
  };
  const DEFENSE235={
    personnel:{icon:'🛡️',name:'Eiland security personeel',cost:1500000,upkeep:400000,power:14,stability:4,risk:-3,desc:'Patrouilles en fysieke bescherming.'},
    surveillance:{icon:'📡',name:'Surveillance netwerk',cost:2500000,upkeep:300000,power:12,stability:3,risk:-6,desc:'Camera’s, sensoren en monitoring.'},
    drones:{icon:'🚁',name:'Drone surveillance',cost:5000000,upkeep:650000,power:20,stability:2,risk:-8,desc:'Overzicht rond eiland, puur game-systeem.'},
    boats:{icon:'🚤',name:'Patrol boats',cost:9000000,upkeep:1000000,power:26,stability:5,risk:-10,desc:'Kustbewaking en snelle response.'},
    safehouse:{icon:'🏚️',name:'Safehouse netwerk',cost:3500000,upkeep:250000,power:8,stability:10,risk:-4,desc:'Veilige plekken voor familie/personeel.'},
    cyberOps:{icon:'💻',name:'Island cyber ops',cost:6000000,upkeep:700000,power:16,stability:3,risk:-8,desc:'Beschermt stroom, haven en banksystemen.'},
    crisisHQ:{icon:'🚨',name:'Crisis HQ bunker',cost:12000000,upkeep:1200000,power:25,stability:12,risk:-10,desc:'Commandocentrum voor rampen/aanvallen.'},
    vehicles:{icon:'🚙',name:'Beschermde voertuigen',cost:4500000,upkeep:500000,power:13,stability:4,risk:-5,desc:'Veilige verplaatsing van familie/staf.'}
  };
  const RIVALS235=[
    {id:'cartel',icon:'💀',name:'Kustkartel',power:62,aggression:75,value:85000000,pop:1200,desc:'Wil smokkelroutes en invloed rond je eiland.'},
    {id:'pirates',icon:'🏴‍☠️',name:'Piratenbende-eiland',power:48,aggression:60,value:55000000,pop:430,desc:'Valt jachten, bevoorrading en toeristen aan.'},
    {id:'rivalResort',icon:'🏨',name:'Rivaliserend resort-eiland',power:42,aggression:45,value:140000000,pop:800,desc:'Sabotage, media en juridische druk.'},
    {id:'warlord',icon:'⚔️',name:'Warlord atol',power:78,aggression:82,value:120000000,pop:2100,desc:'Zwaar instabiel buureiland met gewapende facties.'},
    {id:'research',icon:'🔬',name:'Verlaten research island',power:35,aggression:25,value:220000000,pop:120,desc:'Veel infrastructuur, weinig bevolking, veel claims.'}
  ];
  function hasAnyIsland235(){return !!(state.privateIsland230 || (state.islandCommand235&&state.islandCommand235.ownedIslands&&state.islandCommand235.ownedIslands.length))}
  function ensureIsland235(){
    state.islandCommand235=state.islandCommand235||{};
    const c=state.islandCommand235;
    c.ownedIslands=c.ownedIslands||[];
    c.rivals=c.rivals||RIVALS235.map(x=>Object.assign({},x,{known:true,controlled:false,heat:r235(25,65)}));
    c.lastProcessedAge=c.lastProcessedAge??-99;
    c.pendingWar=c.pendingWar||null;
    c.history=c.history||[];
    c.activeIslandId=c.activeIslandId||null;
    if(state.privateIsland230 && !c.ownedIslands.some(i=>i.primarySource==='privateIsland230')){
      const i=state.privateIsland230;
      c.ownedIslands.unshift({id:'main_private',primarySource:'privateIsland230',icon:'🏝️',name:i.name||'Privé-eiland',value:i.value||100000000,population:i.population||0,buildings:i.buildings||{},defense:20,stability:i.stability||55,infrastructure:i.infrastructure||10,tourism:i.tourism||0,education:0,health:0,science:0,heat:25,policy:'residents',yearlyIncome:i.yearlyIncome||0,yearlyCosts:i.yearlyCosts||750000});
    }
    c.ownedIslands.forEach((i,idx)=>{
      i.id=i.id||('island_'+idx+'_'+Date.now());
      i.icon=i.icon||'🏝️'; i.name=i.name||'Eiland';
      i.value=Math.max(0,Math.round(i.value||100000000));
      i.population=Math.max(0,Math.round(i.population||0));
      i.buildings=i.buildings||{};
      i.defense=clamp235(i.defense??20);
      i.stability=clamp235(i.stability??50);
      i.infrastructure=clamp235(i.infrastructure??10);
      i.tourism=clamp235(i.tourism??0);
      i.education=clamp235(i.education??0);
      i.health=clamp235(i.health??0);
      i.science=clamp235(i.science??0);
      i.heat=clamp235(i.heat??25);
      i.policy=i.policy||'residents';
      i.yearlyIncome=Number(i.yearlyIncome||0);
      i.yearlyCosts=Number(i.yearlyCosts||0);
    });
    if(c.ownedIslands.length && !c.ownedIslands.some(i=>i.id===c.activeIslandId))c.activeIslandId=c.ownedIslands[0].id;
    return c;
  }
  function activeIsland235(){
    const c=ensureIsland235();
    return c.ownedIslands.find(i=>i.id===c.activeIslandId)||c.ownedIslands[0]||null;
  }
  function islandStats235(i){
    return `${money235(i.value)} · pop ${i.population} · def ${i.defense}% · stab ${i.stability}% · infra ${i.infrastructure}% · science ${i.science}%`;
  }
  window.islandCommandHub235=function(){
    const c=ensureIsland235(), i=activeIsland235();
    if(!i)return toast235('Koop eerst een privé-eiland.');
    let h=card235(`<b>Actief eiland:</b> ${i.name}<br>${islandStats235(i)}<br><span class="mini">Abstracte game-mode: verdediging, overnames, diplomatie, sancties, economie.</span>`);
    h+=sec235('Command');
    h+=tapRow235(ISLAND_ATTR,'select','🏝️','Eiland kiezen',`${c.ownedIslands.length} eilanden in bezit`);
    h+=tapRow235(ISLAND_ATTR,'build','🏗️','Bouwen op eiland','Bedrijven, scholen, ziekenhuizen, research, NASA-platform');
    h+=tapRow235(ISLAND_ATTR,'defense','🛡️','Defense kopen','Security, surveillance, patrol boats, crisis HQ');
    h+=tapRow235(ISLAND_ATTR,'rivals','🗺️','Rivalen & overnames','Eilanden scouten, onderhandelen, overnemen');
    h+=tapRow235(ISLAND_ATTR,'war','⚔️','Warfare events','Verdedigen tegen kartels/rivalen en abstracte operaties');
    h+=tapRow235(ISLAND_ATTR,'population','👥','Bevolkingsbeleid','Burgerschap, residenten, autonomie, tribunaal/verbanning');
    h+=tapRow235(ISLAND_ATTR,'year','📊','Jaarupdate eiland-command','Inkomsten, kosten, stabiliteit, aanvallen');
    modal235('🏝️','Island Command',h,'securityLegalHub235()');
  };
  window.islandSelect235=function(){
    const c=ensureIsland235();
    let h=card235('Kies welk eiland je actief beheert.');
    c.ownedIslands.forEach((i,idx)=>h+=tapRow235(ISLAND_ATTR,`select:${idx}`,i.icon||'🏝️',`${i.id===c.activeIslandId?'✅ ':''}${i.name}`,islandStats235(i)));
    modal235('🏝️','Eiland kiezen',h,'islandCommandHub235()');
  };
  function setActiveIsland235(idx){const c=ensureIsland235(), i=c.ownedIslands[idx];if(!i)return; c.activeIslandId=i.id; result235('🏝️','Actief eiland',`${i.name} is nu actief.`,{Smarts:1},0,'good','islandCommandHub235()')}
  window.islandBuildHub235=function(){
    const i=activeIsland235(); if(!i)return;
    let h=card235(`<b>${i.name}</b><br>${islandStats235(i)}`)+sec235('Bouwen');
    Object.entries(BUILDINGS235).forEach(([k,b])=>{
      const count=i.buildings[k]||0;
      h+=tapRow235(ISLAND_ATTR,`build:${k}`,b.icon,`${b.name}${count?` x${count}`:''}`,`${money235(b.cost)} · upkeep ${money235(b.upkeep)}/jr · ${b.desc}`,(state.money||0)<b.cost);
    });
    modal235('🏗️','Eiland bouwen',h,'islandCommandHub235()');
  };
  function buildIsland235(k){
    const i=activeIsland235(), b=BUILDINGS235[k]; if(!i||!b)return;
    if((state.money||0)<b.cost)return toast235('Niet genoeg geld.');
    state.money-=b.cost;
    i.buildings[k]=(i.buildings[k]||0)+1;
    i.value+=Math.round(b.cost*.82);
    i.yearlyIncome+=b.income||0; i.yearlyCosts+=b.upkeep||0;
    i.infrastructure=clamp235(i.infrastructure+(b.infra||0));
    i.tourism=clamp235(i.tourism+(b.tourism||0));
    i.stability=clamp235(i.stability+(b.stability||0));
    i.defense=clamp235(i.defense+(b.defense||0));
    i.education=clamp235(i.education+(b.education||0));
    i.health=clamp235(i.health+(b.health||0));
    i.science=clamp235(i.science+(b.science||0));
    if(k==='villa'||k==='mansion'){
      state.houses=state.houses||[];
      state.houses.push({name:b.name+' op '+i.name,owned:true,primary:false,value:b.cost,upkeep:b.upkeep,icon:b.icon,world:'privateIsland',condition:90,quality:90,comfort:90,security:80,energy:70,rooms:k==='mansion'?9:5});
    }
    result235(b.icon,'Eiland bouwproject',`${b.name} gebouwd op ${i.name} voor ${money235(b.cost)}.`,{Happiness:4,Smarts:2},0,'good','islandBuildHub235()');
  }
  window.islandDefenseHub235=function(){
    const i=activeIsland235(); if(!i)return;
    let h=card235(`<b>${i.name}</b><br>Defense ${i.defense}% · stabiliteit ${i.stability}% · heat ${i.heat}%`)+sec235('Defense assets');
    Object.entries(DEFENSE235).forEach(([k,d])=>{
      const count=i.defenseAssets&&i.defenseAssets[k]||0;
      h+=tapRow235(ISLAND_ATTR,`defense:${k}`,d.icon,`${d.name}${count?` x${count}`:''}`,`${money235(d.cost)} · upkeep ${money235(d.upkeep)}/jr · power +${d.power} · ${d.desc}`,(state.money||0)<d.cost);
    });
    modal235('🛡️','Island Defense',h,'islandCommandHub235()');
  };
  function buyDefense235(k){
    const i=activeIsland235(), d=DEFENSE235[k]; if(!i||!d)return;
    if((state.money||0)<d.cost)return toast235('Niet genoeg geld.');
    state.money-=d.cost;
    i.defenseAssets=i.defenseAssets||{};
    i.defenseAssets[k]=(i.defenseAssets[k]||0)+1;
    i.defense=clamp235(i.defense+d.power);
    i.stability=clamp235(i.stability+d.stability);
    i.heat=clamp235(i.heat+d.risk);
    i.yearlyCosts+=d.upkeep;
    result235(d.icon,'Defense gekocht',`${d.name} toegevoegd aan ${i.name}.`,{Smarts:1},0,'good','islandDefenseHub235()');
  }
  window.rivalsHub235=function(){
    const c=ensureIsland235(), i=activeIsland235(); if(!i)return;
    let h=card235(`<b>${i.name}</b><br>Defense ${i.defense}% · heat ${i.heat}%`)+sec235('Rivalen');
    c.rivals.filter(r=>!r.controlled).forEach((r,idx)=>{
      h+=tapRow235(ISLAND_ATTR,`rival:${r.id}`,r.icon,r.name,`Waarde ${money235(r.value)} · pop ${r.pop} · power ${r.power}% · heat ${r.heat}% · ${r.desc}`);
    });
    if(!c.rivals.some(r=>!r.controlled))h+=card235('Geen rivalen meer. Je bezit of neutraliseerde alles in deze regio.');
    modal235('🗺️','Rivalen & overnames',h,'islandCommandHub235()');
  };
  function rivalDetail235(id){
    const c=ensureIsland235(), r=c.rivals.find(x=>x.id===id); if(!r)return rivalsHub235();
    let h=card235(`<b>${r.icon} ${r.name}</b><br>${r.desc}<br>Waarde ${money235(r.value)} · bevolking ${r.pop}<br>Power ${r.power}% · aggression ${r.aggression}% · heat ${r.heat}%`);
    h+=sec235('Overname-opties');
    h+=tapRow235(ISLAND_ATTR,`takeover:buy:${id}`,'💰','Kopen / uitkopen',`Prijs ± ${money235(Math.round(r.value*1.35))} · veiligste optie`,(state.money||0)<Math.round(r.value*1.35));
    h+=tapRow235(ISLAND_ATTR,`takeover:diplomacy:${id}`,'🤝','Diplomatie / protectoraat','Kans op zachte overname, kost geld en tijd');
    h+=tapRow235(ISLAND_ATTR,`takeover:legal:${id}`,'⚖️','Juridische claim','Advocaten, contracten en governance claim');
    h+=tapRow235(ISLAND_ATTR,`takeover:operation:${id}`,'⚔️','Abstracte operatie','Risky mini-game, heat/sancties mogelijk');
    modal235(r.icon,'Rival detail',h,'rivalsHub235()');
  }
  function takeover235(mode,id){
    const c=ensureIsland235(), home=activeIsland235(), r=c.rivals.find(x=>x.id===id); if(!home||!r)return;
    let cost=0, chance=0, heat=0, txt='', type='good';
    if(mode==='buy'){cost=Math.round(r.value*1.35);if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;chance=.98;heat=2;txt=`Je kocht ${r.name} uit voor ${money235(cost)}.`}
    if(mode==='diplomacy'){cost=Math.round(r.value*.18);if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;chance=(home.stability+home.tourism+40-r.aggression)/140;heat=8;txt=`Je onderhandelde over protectoraat/status met ${r.name}.`}
    if(mode==='legal'){cost=Math.round(r.value*.12);if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;chance=(ensureSecurity235().legalShield+home.infrastructure+45-r.power/2)/140;heat=12;txt=`Je gebruikte juridische claims en contracten tegen ${r.name}.`}
    if(mode==='operation'){cost=Math.round(r.value*.08);if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;chance=(home.defense+ensureSecurity235().crisisTeam+40-r.power)/130;heat=28;txt=`Je startte een abstracte eilandoperatie tegen ${r.name}.`}
    const ok=Math.random()<chance;
    home.heat=clamp235(home.heat+heat+(ok?0:15));
    if(ok){
      r.controlled=true;
      const ni={id:'taken_'+r.id+'_'+Date.now(),icon:r.icon,name:r.name,value:r.value,population:r.pop,buildings:{},defense:Math.max(10,Math.round(r.power*.35)),stability:mode==='buy'?62:mode==='diplomacy'?54:mode==='legal'?45:35,infrastructure:r235(8,35),tourism:r.id==='rivalResort'?45:r235(0,20),education:r235(5,25),health:r235(5,25),science:r.id==='research'?45:r235(0,12),heat:heat,policy:'undecided',yearlyIncome:Math.round(r.value*.03),yearlyCosts:Math.round(r.value*.015),takeoverMode:mode};
      c.ownedIslands.push(ni); c.activeIslandId=ni.id;
      c.history.unshift(`Leeftijd ${age235}: ${r.name} overgenomen via ${mode}.`);
      result235('🏝️','Eiland overgenomen',`${txt}<br><b>${r.name}</b> is nu jouw bezit. Kies nu een bevolkingsbeleid: bewoners, autonomie, evacuatie/herhuisvesting, tribunaal of bezetting.`,{Happiness:8,Smarts:3},0,'good','populationPolicyHub235()');
    }else{
      home.stability=clamp235(home.stability-r235(4,16));
      c.history.unshift(`Leeftijd ${age235}: overname van ${r.name} mislukte via ${mode}.`);
      if(Math.random()<.35)createLawsuit235(true);
      result235('⚠️','Overname mislukt',`${txt}<br>De poging mislukte. Heat en instabiliteit stegen. Mogelijk volgen claims/sancties.`,{Happiness:-8,Smarts:1},0,'bad','rivalsHub235()');
    }
  }
  window.populationPolicyHub235=function(){
    const i=activeIsland235(); if(!i)return;
    let h=card235(`<b>${i.name}</b><br>Bevolking: ${i.population}<br>Huidig beleid: ${i.policy}<br><span class="mini">Geen slavernij/genocide-opties. Wel harde bezetting, tribunaal, verbanning van leiders, burgerschap of autonomie met gameplay-gevolgen.</span>`);
    h+=sec235('Bevolkingsbeleid');
    h+=tapRow235(ISLAND_ATTR,'policy:residents','👥','Bewoners maken / burgerschap','Stabiliteit omhoog, kosten omhoog, betere lange termijn');
    h+=tapRow235(ISLAND_ATTR,'policy:protected','🛡️','Beschermde residenten','Veiligheid en herstel, matige groei');
    h+=tapRow235(ISLAND_ATTR,'policy:autonomy','🤝','Autonomie geven','Minder inkomsten, veel minder opstand/heat');
    h+=tapRow235(ISLAND_ATTR,'policy:evacuate','🚌','Evacueren / herhuisvesten','Duur, populatie omlaag, humanitaire reputatie omhoog');
    h+=tapRow235(ISLAND_ATTR,'policy:tribunal','⚖️','Leiders tribunaal / verbannen','Harde aanpak tegen factieleiders, stabiliteit kan schommelen');
    h+=tapRow235(ISLAND_ATTR,'policy:occupation','🚧','Militair bezet houden','Meer controle en inkomsten, hoge heat/sancties/opstanden');
    modal235('👥','Bevolkingsbeleid',h,'islandCommandHub235()');
  };
  function setPolicy235(policy){
    const i=activeIsland235(); if(!i)return;
    let txt='', type='good', cost=0;
    if(policy==='residents'){i.policy='residents';i.stability=clamp235(i.stability+r235(8,18));i.yearlyCosts+=Math.round(i.population*900);txt='Je gaf bewoners burgerschap/residentstatus. Dat kost voorzieningen, maar stabiliteit stijgt.'}
    if(policy==='protected'){i.policy='protected';i.stability=clamp235(i.stability+r235(5,14));i.defense=clamp235(i.defense+r235(2,6));i.yearlyCosts+=Math.round(i.population*600);txt='Je zette beschermde residentstatus in met veiligheid en basisrechten.'}
    if(policy==='autonomy'){i.policy='autonomy';i.stability=clamp235(i.stability+r235(12,25));i.heat=clamp235(i.heat-r235(8,20));i.yearlyIncome=Math.round(i.yearlyIncome*.75);txt='Je gaf lokale autonomie. Minder inkomsten, maar veel minder opstand/heat.'}
    if(policy==='evacuate'){cost=Math.round(i.population*4500);if((state.money||0)<cost)return toast235('Niet genoeg geld voor humane herhuisvesting.');state.money-=cost;i.population=Math.max(0,Math.round(i.population*.65));i.stability=clamp235(i.stability+r235(4,12));i.heat=clamp235(i.heat-r235(5,14));txt=`Je organiseerde evacuatie/herhuisvesting voor ${money235(cost)}. Populatie daalde, humanitaire reputatie steeg.`}
    if(policy==='tribunal'){i.policy='tribunal';i.stability=clamp235(i.stability+r235(-4,14));i.heat=clamp235(i.heat+r235(2,10));txt='Je zette corrupte/gewelddadige leiders voor een tribunaal of verbande ze. Sommige groepen zijn boos, anderen opgelucht.';type='warn'}
    if(policy==='occupation'){i.policy='occupation';i.defense=clamp235(i.defense+r235(5,12));i.stability=clamp235(i.stability-r235(5,18));i.heat=clamp235(i.heat+r235(15,30));i.yearlyIncome=Math.round(i.yearlyIncome*1.15);txt='Je hield het eiland hard bezet. Meer controle/inkomsten, maar hoge heat, sancties en opstandrisico.';type='bad'}
    result235('👥','Bevolkingsbeleid',txt,{Smarts:2,Happiness:policy==='occupation'?-6:2},0,type,'populationPolicyHub235()');
  }
  window.islandWarfareHub235=function(){
    const i=activeIsland235(); if(!i)return;
    let h=card235(`<b>${i.name}</b><br>Defense ${i.defense}% · stabiliteit ${i.stability}% · heat ${i.heat}%<br>Beleid: ${i.policy}`);
    h+=sec235('Acties');
    h+=tapRow235(ISLAND_ATTR,'war:scout','🔎','Dreiging scouten','Verlaagt verrassing, kan rivalen onthullen');
    h+=tapRow235(ISLAND_ATTR,'war:defend','🛡️','Verdedigingsoefening','Defense/stabiliteit omhoog, kosten');
    h+=tapRow235(ISLAND_ATTR,'war:negotiate','🤝','Onderhandelen met dreiging','Kan heat verlagen of rivalen kalmeren');
    h+=tapRow235(ISLAND_ATTR,'war:operation','⚔️','Abstracte tegenoperatie','Risico, kan dreiging verlagen maar heat stijgt');
    h+=tapRow235(ISLAND_ATTR,'war:simulate','💥','Simuleer aanval op jouw eiland','Test combat/resolution');
    modal235('⚔️','Island Warfare',h,'islandCommandHub235()');
  };
  function warAction235(action){
    const i=activeIsland235(), c=ensureIsland235(); if(!i)return;
    let cost=0, txt='', type='good';
    if(action==='scout'){cost=250000;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;i.heat=clamp235(i.heat-r235(2,8));txt='Je securityteam scoutte de regio. Heat daalde en je bent minder verrast.'}
    if(action==='defend'){cost=750000;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;i.defense=clamp235(i.defense+r235(3,9));i.stability=clamp235(i.stability+r235(1,5));txt='Je deed een verdedigingsoefening. Defense en stabiliteit stegen.'}
    if(action==='negotiate'){cost=500000;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;const ok=Math.random()<((i.stability+ensureSecurity235().legalShield+40)/150);if(ok){i.heat=clamp235(i.heat-r235(8,18));txt='Onderhandeling lukte. Dreiging/heat daalde.'}else{i.heat=clamp235(i.heat+r235(3,12));txt='Onderhandeling mislukte. Rivalen zien je als zwak.';type='warn'}}
    if(action==='operation'){cost=1500000;if((state.money||0)<cost)return toast235('Niet genoeg geld.');state.money-=cost;const ok=Math.random()<((i.defense+ensureSecurity235().crisisTeam+35)/155);i.heat=clamp235(i.heat+r235(10,24));if(ok){i.defense=clamp235(i.defense+r235(1,5));txt='Abstracte tegenoperatie lukte. Dreiging tijdelijk teruggedrongen, maar heat steeg.';type='warn'}else{i.stability=clamp235(i.stability-r235(8,20));txt='Tegenoperatie mislukte. Stabiliteit daalde en heat steeg.';type='bad'}}
    if(action==='simulate')return simulateAttack235(true);
    c.history.unshift(`Leeftijd ${age235}: warfare ${action} op ${i.name}.`);
    result235('⚔️','Island Warfare',txt,{Smarts:2,Happiness:type==='bad'?-5:0},0,type,'islandWarfareHub235()');
  }
  function simulateAttack235(manual=false){
    const i=activeIsland235(); if(!i)return;
    const rival=pick235(ensureIsland235().rivals);
    const attack=rival.power+r235(-20,25)+i.heat*.25;
    const defense=i.defense+i.stability*.25+ensureSecurity235().crisisTeam*.25+r235(-15,25);
    let txt='', type='warn';
    if(defense>=attack){
      const damage=r235(100000,1200000);
      state.money-=Math.min(state.money||0,damage);
      i.heat=clamp235(i.heat-r235(2,7));
      i.stability=clamp235(i.stability+r235(1,5));
      txt=`${rival.name} probeerde jouw eiland te raken, maar je defense hield stand. Schade/kosten: ${money235(damage)}.`;
      type='good';
    }else{
      const damage=r235(1000000,15000000);
      state.money-=Math.min(state.money||0,damage);
      i.stability=clamp235(i.stability-r235(8,22));
      i.value=Math.max(0,Math.round(i.value-damage*.5));
      i.heat=clamp235(i.heat+r235(5,15));
      txt=`${rival.name} raakte jouw eiland. Schade: ${money235(damage)}. Stabiliteit en waarde daalden.`;
      type='bad';
      if(Math.random()<.25)createLawsuit235(true);
    }
    ensureIsland235().history.unshift(`Leeftijd ${age235}: aanval ${rival.name} op ${i.name}.`);
    if(manual)result235('💥','Aanval op eiland',txt,{Happiness:type==='bad'?-12:-2},0,type,'islandWarfareHub235()');
    else try{addLog(`<b>Aanval op eiland</b><br>${txt}`,type,false)}catch(e){}
  }
  function processIslandCommandYear235(force=false){
    const c=ensureIsland235(); if(!force && c.lastProcessedAge===age235())return;
    c.lastProcessedAge=age235();
    c.ownedIslands.forEach(i=>{
      let income=i.yearlyIncome+Math.round(i.population*1800)+Math.round(i.tourism*18000)+Math.round(i.science*90000);
      let costs=i.yearlyCosts+Math.round(i.population*900);
      if(i.policy==='autonomy')income=Math.round(income*.78);
      if(i.policy==='occupation'){income=Math.round(income*1.12);costs=Math.round(costs*1.18);}
      if(i.policy==='residents'||i.policy==='protected')costs=Math.round(costs*1.08);
      const net=income-costs;
      state.money+=net;
      i.value=Math.max(0,Math.round(i.value+net*.25+i.infrastructure*20000+i.education*25000+i.health*20000+i.science*70000));
      i.stability=clamp235(i.stability+r235(-3,4)+(i.health>40?1:0)+(i.education>40?1:0)-(i.policy==='occupation'?3:0));
      i.heat=clamp235(i.heat+r235(-4,5)+(i.policy==='occupation'?5:0));
      if(i.heat>60 && Math.random()<((i.heat-40)/100))simulateAttack235(false);
      try{addLog(`<b>Island Command jaarupdate</b><br>${i.name}: inkomen ${money235(income)}, kosten ${money235(costs)}, netto ${money235(net)}, waarde ${money235(i.value)}.`, 'warn', false)}catch(e){}
    });
  }

  /* ================= RISK PROCESSING ================= */
  function processRichRisk235(force=false){
    const s=ensureSecurity235();
    if(!force && s.lastProcessedAge===age235())return;
    s.lastProcessedAge=age235();
    const yearly=securityYearlyCost235();
    if(yearly>0){
      if((state.money||0)>=yearly){state.money-=yearly;try{addLog(`<b>Security & Legal kosten</b><br>Jaarlijkse bescherming kostte ${money235(yearly)}.`,'warn',false)}catch(e){}}
      else try{addLog(`<b>Security waarschuwing</b><br>Je kon je security/legal services niet volledig betalen.`,'bad',false)}catch(e){}
    }
    if(s.pendingEvent)return;
    if(netWorth235()<50000000)return;
    // Lawsuit risk
    const lawsuitRisk=Math.max(0.03,0.12-(s.legalShield+s.privacy+s.businessCompliance)/1800);
    if(age235()-s.lastLawsuitAge>=2 && (force || Math.random()<lawsuitRisk)){
      createLawsuit235(true); setTimeout(()=>securityEventPopup235(),120); return;
    }
    // Hack risk
    const hackRisk=Math.max(0.015,0.09-(s.personalCyber+s.familyCyber+s.privacy+s.crisisTeam)/2200);
    if(age235()-s.lastHackAge>=5 && Math.random()<hackRisk){
      const stolen=2000000;
      const blocked=(s.personalCyber+s.familyCyber+s.crisisTeam+r235(0,80))>160;
      s.lastHackAge=age235(); s.hackCount++;
      if(blocked){try{addLog(`<b>Hackpoging geblokkeerd</b><br>Je beveiliging hield een grote aanval tegen.`,'good',false)}catch(e){}}
      else{
        state.money-=Math.min(state.money||0,stolen);
        const ev={id:'hack_'+Date.now(),type:'hack',title:'Cyberaanval',stolen,text:`Je accounts/bedrijven zijn gehackt. Er is ${money235(stolen)} verdwenen.`,age:age235()};
        s.pendingEvent=ev;s.events.unshift(ev);try{addLog(`<b>Cyberaanval</b><br>${ev.text}`,'bad',false)}catch(e){};setTimeout(()=>securityEventPopup235(),120);return;
      }
    }
    // One-life kidnapping
    const targets=[]; if(state.partner)targets.push({kind:'partner',name:state.partner.name}); (state.children||[]).forEach(ch=>targets.push({kind:'child',name:ch.name}));
    const kidnapRisk=Math.max(0,0.035-(s.familyPhysical+s.privacy+s.crisisTeam)/5000);
    if(!s.kidnapUsed && targets.length && Math.random()<kidnapRisk){
      const t=pick235(targets);
      const ev={id:'kidnap_'+Date.now(),type:'kidnap',title:'Ontvoering',targetKind:t.kind,targetName:t.name,ransom:20000000,text:`${t.name} is ontvoerd. Er wordt ${money235(20000000)} losgeld geëist.`,age:age235()};
      s.kidnapUsed=true;s.pendingEvent=ev;s.events.unshift(ev);try{addLog(`<b>Ontvoering</b><br>${ev.text}`,'bad',false)}catch(e){};setTimeout(()=>securityEventPopup235(),120);
    }
  }

  function dispatchRisk235(a){
    if(a==='pending')return securityEventPopup235();
    if(a==='history')return riskHistory235();
    if(a==='forceLawsuit'){createLawsuit235(true);return lawsuitHub235();}
    if(a==='war')return islandCommandHub235();
    if(a.startsWith('buy:'))return buySecurity235(a.split(':')[1]);
    if(a.startsWith('lawyer:'))return hireLawyer235(Number(a.split(':')[1]));
    if(a.startsWith('case:'))return lawsuitAction235(a.split(':')[1]);
    if(a.startsWith('settle:'))return settle235(Number(a.split(':')[1]));
    if(a.startsWith('court:'))return courtChoice235(a.split(':')[1]);
    if(a==='hack:contain')return resolveHack235();
    if(a.startsWith('kidnap:'))return resolveKidnap235(a.split(':')[1]);
  }
  function dispatchIsland235(a){
    if(a==='select')return islandSelect235();
    if(a.startsWith('select:'))return setActiveIsland235(Number(a.split(':')[1]));
    if(a==='build')return islandBuildHub235();
    if(a.startsWith('build:'))return buildIsland235(a.split(':')[1]);
    if(a==='defense')return islandDefenseHub235();
    if(a.startsWith('defense:'))return buyDefense235(a.split(':')[1]);
    if(a==='rivals')return rivalsHub235();
    if(a.startsWith('rival:'))return rivalDetail235(a.split(':')[1]);
    if(a.startsWith('takeover:')){const p=a.split(':');return takeover235(p[1],p[2]);}
    if(a==='population')return populationPolicyHub235();
    if(a.startsWith('policy:'))return setPolicy235(a.split(':')[1]);
    if(a==='war')return islandWarfareHub235();
    if(a.startsWith('war:'))return warAction235(a.split(':')[1]);
    if(a==='year'){processIslandCommandYear235(true);saveRender235();return islandCommandHub235();}
  }
  window.dispatchRisk235=dispatchRisk235; window.dispatchIsland235=dispatchIsland235;

  function riskHistory235(){
    const s=ensureSecurity235();
    let h=securityStatus235()+sec235('History');
    h+=s.events.length?card235(s.events.slice(0,10).map(e=>`Leeftijd ${e.age||'?'}: <b>${e.title}</b> · ${String(e.text||'').replace(/<[^>]+>/g,'').slice(0,100)}`).join('<br><br>')):card235('Nog geen risk-events.');
    modal235('📜','Risk history',h,'securityLegalHub235()');
  }

  /* ================= INTEGRATION ================= */
  const oldAssets235=window.assetsHTML||(typeof assetsHTML==='function'?assetsHTML:null);
  if(oldAssets235 && !oldAssets235.__riskIsland235){
    window.assetsHTML=function(){
      let html=oldAssets235.apply(this,arguments);
      if(!String(html).includes('Security, Legal & Island Command')){
        html+=sec235('Security, Legal & Island Command');
        html+=row235('🛡️','Security, Legal & Island Command','Rijkdom-risico, rechtszaken, cyber, ontvoering, eilandverdediging','securityLegalHub235()');
        if(hasAnyIsland235())html+=row235('🏝️','Island Command','Bouwen, defense, overnames, bevolking en warfare','islandCommandHub235()');
      }
      return html;
    };
    window.assetsHTML.__riskIsland235=true; try{assetsHTML=window.assetsHTML}catch(e){}
  }
  const oldPrivateHub235=window.privateIslandHub230||null;
  if(oldPrivateHub235 && !oldPrivateHub235.__cmd235){
    window.privateIslandHub230=function(){
      oldPrivateHub235.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody'); if(!body||body.innerHTML.includes('islandCommandHub235'))return;
          const alt=body.querySelector('.btn.alt');
          const s=document.createElement('div');s.className='section';s.textContent='Island Command';
          const wrap=document.createElement('div');
          wrap.innerHTML=row235('🏝️','Island Command','Bouwen, defense, overnames, bevolking en warfare','islandCommandHub235()');
          body.insertBefore(s,alt||null); while(wrap.firstElementChild)body.insertBefore(wrap.firstElementChild,alt||null);
        }catch(e){}
      },0);
    };
    window.privateIslandHub230.__cmd235=true;
  }
  const oldAge235=window.ageUp||(typeof ageUp==='function'?ageUp:null);
  if(oldAge235 && !oldAge235.__riskIsland235){
    window.ageUp=function(){
      const before=state&&state.age;
      const ret=oldAge235.apply(this,arguments);
      try{
        if(state&&state.age!==before){processRichRisk235(false);processIslandCommandYear235(false);}
        saveRender235();
      }catch(e){console.warn('[v23.5 yearly]',e)}
      return ret;
    };
    window.ageUp.__riskIsland235=true; try{ageUp=window.ageUp}catch(e){}
  }
  const oldYearly235=window.yearlyAssets||(typeof yearlyAssets==='function'?yearlyAssets:null);
  if(oldYearly235 && !oldYearly235.__riskIsland235){
    window.yearlyAssets=function(){
      if(oldYearly235)oldYearly235.apply(this,arguments);
      try{processRichRisk235(false);processIslandCommandYear235(false)}catch(e){}
    };
    window.yearlyAssets.__riskIsland235=true; try{yearlyAssets=window.yearlyAssets}catch(e){}
  }
  const oldSave235=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave235 && !oldSave235.__riskIsland235){
    window.safeSave=function(){try{ensureSecurity235();ensureIsland235()}catch(e){}return oldSave235.apply(this,arguments)};
    window.safeSave.__riskIsland235=true; try{safeSave=window.safeSave}catch(e){}
  }
  const oldShow235=window.showModal||(typeof showModal==='function'?showModal:null);
  if(oldShow235 && !oldShow235.__tap235){
    window.showModal=function(html){const ret=oldShow235.call(this,html);setTimeout(bindTaps235,0);return ret};
    window.showModal.__tap235=true; try{showModal=window.showModal}catch(e){}
  }

  window.debugV235=function(){
    ensureSecurity235();ensureIsland235();
    let h=card235(`<b>v23.5 debug</b><br>Net worth: ${money235(netWorth235())}<br>Eilanden: ${ensureIsland235().ownedIslands.length}<br>Risk pending: ${ensureSecurity235().pendingEvent?ensureSecurity235().pendingEvent.title:'geen'}<br>Home tap / Legal / Island Command actief.`);
    h+=tapRow235(RISK_ATTR,'forceLawsuit','⚖️','Force lawsuit','Test legal mini-game',netWorth235()<50000000);
    h+=row235('🏠','Test thuis activiteiten','Open home tap fixed menu','homeLifeScreen()');
    h+=row235('🛡️','Security hub','Open Security/Legal/Island Command','securityLegalHub235()');
    if(hasAnyIsland235())h+=row235('🏝️','Island Command','Open island command','islandCommandHub235()');
    modal235('🛠️','v23.5 Debug',h,'closeModal()');
  };
  setTimeout(()=>{try{ensureSecurity235();ensureIsland235();bindTaps235();safeSave();render()}catch(e){}},400);
})();
