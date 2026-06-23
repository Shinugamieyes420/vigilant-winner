/* v17.2 Career Unified: Werk 1.0 + Werk 2.0 logisch samengevoegd */
(function(){
  'use strict';

  const VERSION = '17.2';

  const ROUTES = {
    survival: {
      icon:'🧹', name:'Bijbaan & instapwerk',
      desc:'Kleine banen, bijbanen en tijdelijk werk. Goed voor snel geld, weinig echte carrière-opbouw.',
      steps:['los klusje','bijbaan','vaste instapbaan','ervaren medewerker'], skills:['discipline','stamina']
    },
    retail: {
      icon:'📱', name:'Retail & sales',
      desc:'Winkel, telecom, klantenadvies en verkoop. Logisch voor social/looks/sales en later teamleider of eigen shop.',
      steps:['winkelmedewerker','verkoopadviseur','senior adviseur','teamleider retail','store manager','eigen winkel/webshop'], skills:['social','looks','discipline']
    },
    hospitality: {
      icon:'🍔', name:'Horeca & service',
      desc:'Afwasser, fastfood, barista, kok en later eigen foodtruck/restaurant.',
      steps:['afwasser','fastfood medewerker','barista/kok','shift lead','restaurantmanager','eigen horeca'], skills:['stamina','social','stress control']
    },
    logistics: {
      icon:'📦', name:'Logistiek & productie',
      desc:'Magazijn, koerier, productie en montage. Praktisch werk met doorgroei naar voorman/teamleider.',
      steps:['hulp/koerier','magazijnmedewerker','ervaren medewerker','voorman','teamleider productie'], skills:['fitness','discipline']
    },
    social: {
      icon:'🤝', name:'Sociaal werk',
      desc:'Jongerenwerk, begeleiding, re-integratie en sociale werkplaats. MBO/HBO, mensenwerk en stressbeheersing.',
      steps:['vrijwilliger/stagiair','begeleider','jongerenwerker','jobcoach','teamleider','beleids/manager sociaal domein'], skills:['empathy','communication','stress control']
    },
    care: {
      icon:'🏥', name:'Zorg',
      desc:'Zorgmedewerker, verpleegkundige, psycholoog/arts-route. Veel verantwoordelijkheid en stress.',
      steps:['zorgassistent','zorgmedewerker','verpleegkundige','specialist','teamleider zorg','medisch specialist'], skills:['smarts','discipline','health']
    },
    ict: {
      icon:'💻', name:'ICT & tech',
      desc:'Helpdesk, beheer, development, data en security. Sterk afhankelijk van smarts/opleiding.',
      steps:['helpdesk','junior beheerder','systeembeheerder','developer/data','security/cloud specialist','IT manager/eigen IT-bedrijf'], skills:['smarts','tech skill','discipline']
    },
    technical: {
      icon:'🔧', name:'Techniek',
      desc:'Monteur, elektromonteur en technische doorgroei. Praktisch, stabiel en goed voor MBO-route.',
      steps:['leerling monteur','monteur','specialist','voorman','projectleider techniek'], skills:['smarts','fitness','discipline']
    },
    government: {
      icon:'🏛️', name:'Overheid & administratie',
      desc:'Gemeente, uitkering, administratie, beleid en toezicht. Rustiger maar met regels en diploma-eisen.',
      steps:['administratief medewerker','klantcontact overheid','consulent','beleidsmedewerker','senior/manager'], skills:['smarts','discipline','communication']
    },
    education: {
      icon:'📚', name:'Onderwijs',
      desc:'Onderwijsassistent, docent en begeleiding. Goed met social/smarts en stresscontrole.',
      steps:['onderwijsassistent','docent','mentor/coördinator','teamleider onderwijs'], skills:['smarts','communication','patience']
    },
    security: {
      icon:'👮', name:'Veiligheid',
      desc:'Beveiliging, politie en risico-werk. Fitness, discipline en stressbestendigheid tellen zwaar.',
      steps:['beveiliger','aspirant','agent','specialist/recherche','teamleider veiligheid'], skills:['fitness','discipline','courage']
    },
    management: {
      icon:'📈', name:'Management',
      desc:'Leidinggeven, projectmanagement en senior management. Vereist ervaring en reputatie.',
      steps:['meewerkend voorman','teamleider','projectleider','manager','senior manager/directeur'], skills:['leadership','communication','stress control']
    },
    finance: {
      icon:'💶', name:'Finance & vastgoed',
      desc:'Boekhouding, controller, makelaar/vastgoed en financiële groei.',
      steps:['administratie','boekhouder','controller','vastgoedbeheer','finance manager/eigen vastgoedbedrijf'], skills:['smarts','discipline','risk control']
    },
    legal: {
      icon:'⚖️', name:'Juridisch',
      desc:'Jurist/advocaat-route. Hoog diploma, hoge beloning, hoge druk.',
      steps:['juridisch medewerker','jurist','advocaat','senior jurist/partner'], skills:['smarts','discipline','communication']
    },
    medical: {
      icon:'🩺', name:'Medisch hoog niveau',
      desc:'Arts/chirurg route. Uni, hoge smarts en veel stress.',
      steps:['student geneeskunde','arts','specialist','chirurg','top specialist'], skills:['smarts','discipline','health']
    },
    creative: {
      icon:'🎬', name:'Media, marketing & fame',
      desc:'Marketing, content, entertainment en fame-business. Sterk in Amsterdam/Amerika/Japan.',
      steps:['content/marketing junior','medior creative','campagne lead','agency/fame','eigen merk'], skills:['social','looks','creativity']
    },
    pro_sports: {
      icon:'🏆', name:'Pro sport',
      desc:'Voetbal, WWE, UFC/Glory. Dit loopt via Sports Career, maar pro-contracten tellen als werk.',
      steps:['amateur','semi-pro','pro contract','main card/basis','champion/international','trainer/business'], skills:['fitness','stamina','sport talent']
    }
  };

  const FIELD_ROUTE_RULES = [
    [/ict|software|data|developer|cloud|security/i, 'ict'],
    [/sociaal|jongeren|re-integratie|participatie|jobcoach|welzijn|begeleider/i, 'social'],
    [/zorg|verpleeg|arts|psycholoog|medisch|chirurg/i, 'care'],
    [/overheid|gemeente|administratie|belasting|beleid|uitkering/i, 'government'],
    [/retail|verkoop|telecom|winkel|supermarkt/i, 'retail'],
    [/horeca|barista|kok|fastfood|afwasser/i, 'hospitality'],
    [/logistiek|magazijn|bezorg|koerier|productie|warehouse/i, 'logistics'],
    [/techniek|monteur|elektro|engineer/i, 'technical'],
    [/politie|veiligheid|beveilig/i, 'security'],
    [/onderwijs|docent|teacher/i, 'education'],
    [/management|teamleider|projectmanager|leiding/i, 'management'],
    [/finance|financ|boekhouder|controller|vastgoed|makelaar/i, 'finance'],
    [/jurid|law|advocaat/i, 'legal'],
    [/marketing|media|content|fame/i, 'creative']
  ];

  function hasState(){ return typeof state !== 'undefined' && !!state; }
  function money172(n){ return (typeof money === 'function') ? money(n||0) : ('€' + Math.round(n||0)); }
  function clamp172(n){ return (typeof clamp === 'function') ? clamp(n) : Math.max(0, Math.min(100, Math.round(n||0))); }
  function rand172(a,b){ return (typeof r === 'function') ? r(a,b) : Math.floor(Math.random()*(b-a+1))+a; }
  function pick172(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function eduRank172(){ return (typeof eduRank === 'function') ? eduRank() : 'none'; }
  function eduScore172(v){ return (typeof eduScore === 'function') ? eduScore(v) : ({none:0,primary:1,highschool:2,mbo:3,hbo:4,uni:5}[v]||0); }
  function htmlEscape172(s){ return String(s??'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function currentPlace172(){
    if(!hasState()) return null;
    const id = state.world || state.place || state.city || 'normal';
    if(typeof PLACES !== 'undefined' && PLACES && PLACES[id]) return PLACES[id];
    if(window.BITZ_PLACES && window.BITZ_PLACES[id]) return window.BITZ_PLACES[id];
    return {id:'normal', name:'Nederland', country:'Nederland', costMultiplier:1, jobMultiplier:1, jobs:[]};
  }

  function inferRoute172(job){
    const txt = `${job.id||''} ${job.title||''} ${job.field||''}`;
    for(const [re, route] of FIELD_ROUTE_RULES){ if(re.test(txt)) return route; }
    if((job.minAge||0) < 18 || /bijbaan|kranten|oppas/i.test(txt)) return 'survival';
    return 'survival';
  }

  function routeTier172(job){
    const salary = job.fteGrossAnnual || job.grossAnnual || job.salary || 0;
    const edu = job.edu || job.education || 'none';
    if((job.minAge||0) < 18) return 0;
    if(edu === 'none' || edu === 'highschool') return salary >= 28000 ? 1 : 0;
    if(edu === 'mbo') return salary >= 43000 ? 3 : 2;
    if(edu === 'hbo') return salary >= 65000 ? 5 : 4;
    if(edu === 'uni') return salary >= 85000 ? 6 : 5;
    return 1;
  }

  function normalizeJob172(job){
    if(!job) return job;
    job.route = job.route || inferRoute172(job);
    job.tier = Number.isFinite(job.tier) ? job.tier : routeTier172(job);
    job.workSystem = job.tier <= 1 || job.route === 'survival' ? 'werk1' : 'career2';
    job.contractType = job.contractType || ((job.minAge||0) < 18 ? 'bijbaan' : (job.tier>=4 ? 'carrière' : 'normale baan'));
    job.hours = job.hours || ((job.minAge||0) < 18 ? 8 : 32);
    job.standardHours = job.standardHours || ((job.minAge||0) < 18 ? 12 : 36);
    job.fteGrossAnnual = job.fteGrossAnnual || job.grossAnnual || job.salary || 0;
    job.grossAnnual = job.grossAnnual || Math.round(job.fteGrossAnnual * Math.max(0.1, (job.hours||32)/(job.standardHours||36)));
    return job;
  }

  function normalizeJobs172(){
    if(typeof DATA === 'undefined' || !DATA || !Array.isArray(DATA.jobs)) return;
    DATA.jobs.forEach(normalizeJob172);
    DATA.jobs.sort((a,b)=>(a.minAge-b.minAge)||(eduScore172(a.edu)-eduScore172(b.edu))||((a.salary||0)-(b.salary||0)));
  }

  function ensureCareer172(){
    if(!hasState()) return null;
    state.career = state.career || {};
    state.work = state.work || {};
    if(state.job) normalizeJob172(state.job);
    const route = state.job ? (state.job.route || inferRoute172(state.job)) : (state.career.route || null);
    const c = state.career;
    c.route = route;
    c.experience = c.experience || 0;
    c.reputation = clamp172(c.reputation ?? 45);
    c.performance = clamp172(c.performance ?? state.work.performance ?? state.job?.performance ?? 50);
    c.stress = clamp172(c.stress ?? state.work.stress ?? state.job?.stress ?? 20);
    c.bossRelation = clamp172(c.bossRelation ?? state.work.managerRel ?? 50);
    c.coworkerRelation = clamp172(c.coworkerRelation ?? state.work.coworkerRel ?? 50);
    c.warnings = c.warnings || 0;
    c.promotions = c.promotions || 0;
    c.lastRouteOfferAge = c.lastRouteOfferAge ?? -99;
    state.work.performance = c.performance;
    state.work.stress = c.stress;
    if(state.job){ state.job.performance = c.performance; state.job.stress = c.stress; }
    return c;
  }

  function playerJobEligible172(job){
    normalizeJob172(job);
    const minAgeOk = (state.age||0) >= (job.minAge||0);
    const eduOk = eduScore172(eduRank172()) >= eduScore172(job.edu || job.education || 'none');
    const smartOk = (state.stats?.Smarts||50) >= (job.smart||0);
    const proBlock = (typeof currentProSport163 === 'function' && currentProSport163());
    return {ok:minAgeOk && eduOk && smartOk && !proBlock, minAgeOk, eduOk, smartOk, proBlock};
  }

  function requirement172(job){
    const req=[];
    if((state.age||0)<(job.minAge||0)) req.push(`${job.minAge}+ jaar`);
    if(eduScore172(eduRank172())<eduScore172(job.edu||job.education||'none')) req.push(`diploma: ${job.edu||job.education}`);
    if((state.stats?.Smarts||50)<(job.smart||0)) req.push(`smarts ${job.smart}+`);
    if(typeof currentProSport163 === 'function' && currentProSport163()) req.push('geen actief pro-sportcontract');
    return req.join(' · ') || 'beschikbaar';
  }

  function placeJobFit172(job){
    const p=currentPlace172();
    if(!p || !Array.isArray(p.jobs)) return 1;
    const route = job.route || inferRoute172(job);
    const hay = `${job.id||''} ${job.field||''} ${job.title||''} ${route}`.toLowerCase();
    const direct = p.jobs.some(x=> hay.includes(String(x).toLowerCase()) || String(x).toLowerCase()===route);
    if(direct) return 1.2;
    if((p.tags||[]).some(t=>hay.includes(String(t).toLowerCase()))) return 1.1;
    return 0.92;
  }

  function salaryLine172(job){
    normalizeJob172(job);
    const gross = job.grossAnnual || job.salary || 0;
    const hours = job.hours || 32;
    let net = Math.round(gross * (gross < 16000 ? 0.92 : gross < 40000 ? 0.76 : gross < 70000 ? 0.68 : 0.60));
    return `bruto ${money172(gross)}/jaar · netto ± ${money172(net)}/jaar · ${hours}u/wk`;
  }

  function jobCard172(job){
    normalizeJob172(job);
    const elig=playerJobEligible172(job);
    const route=ROUTES[job.route] || ROUTES.survival;
    const placeFit=placeJobFit172(job);
    const local = placeFit>1 ? ' · lokale bonus' : placeFit<1 ? ' · minder lokaal passend' : '';
    const label = job.workSystem==='werk1' ? 'Werk 1.0' : 'Werk 2.0';
    return `<button class="btn ${elig.ok?'':'locked'}" onclick="${elig.ok?`careerStartInterview172('${job.id}')`:''}">${route.icon} ${htmlEscape172(job.title)}<br><span class="mini">${label} · ${htmlEscape172(route.name)} · ${salaryLine172(job)}${local}${elig.ok?'':`<br>Locked: ${requirement172(job)}`}</span></button>`;
  }

  function currentJobStatus172(){
    ensureCareer172();
    const p=currentPlace172();
    if(!state.job){
      return `<div class="card"><b>Geen baan</b><br>Woonplaats: ${htmlEscape172(p?.name||'Nederland')}<br>Kies Werk 1.0 voor snel geld of Werk 2.0 voor een echte route.</div>`;
    }
    const j=normalizeJob172(state.job);
    const route=ROUTES[j.route]||ROUTES.survival;
    return `<div class="card"><b>${route.icon} ${htmlEscape172(j.title)}</b><br>
      Systeem: ${j.workSystem==='werk1'?'Werk 1.0 / normale baan':'Werk 2.0 / carrièrepad'}<br>
      Route: ${htmlEscape172(route.name)}<br>
      ${salaryLine172(j)}<br>
      Ervaring: ${state.jobYears||0} jaar · route XP: ${state.career?.experience||0}<br>
      Level: ${(state.careerLevel||0)+1} · reputatie ${state.career?.reputation??45}%<br>
      Performance ${state.career?.performance??50}% · stress ${state.career?.stress??20}%<br>
      Baasrelatie ${state.career?.bossRelation??50}% · collega-relatie ${state.career?.coworkerRelation??50}%</div>`;
  }

  function routeProgress172(routeId){
    const route=ROUTES[routeId]||ROUTES.survival;
    const lvl=Math.min(route.steps.length-1, Math.max(0, state.careerLevel||0));
    const next=route.steps[Math.min(route.steps.length-1,lvl+1)];
    return `<div class="card"><b>${route.icon} ${route.name}</b><br>${route.desc}<br><br><b>Route:</b><br>${route.steps.map((s,i)=>`${i===lvl?'➡️':'•'} ${htmlEscape172(s)}`).join('<br>')}<br><br><b>Belangrijke skills:</b> ${route.skills.join(', ')}<br><b>Volgende logische stap:</b> ${htmlEscape172(next)}</div>`;
  }

  window.careerHub172 = function(){
    if(!hasState()) return;
    normalizeJobs172(); ensureCareer172();
    const p=currentPlace172();
    const pro = (typeof currentProSport163 === 'function' && currentProSport163()) || null;
    showModal(`<div class="modalTop"><div class="avatar">💼</div><div class="modalTitle">Career Hub 17.2</div></div>
    <div class="modalBody">
      <div class="card"><b>Werk is nu één systeem.</b><br>Werk 1.0 = gewone baan/bijbaan. Werk 2.0 = route met ervaring, reputatie, promoties, stress en doorgroei. Sport en business sluiten hier logisch op aan.</div>
      <div class="card"><b>Woonplaats:</b> ${htmlEscape172(p?.name||'Nederland')}<br><b>Lokale kansen:</b> ${(p?.jobs||[]).join(', ')||'algemeen'}${pro?`<br><b>Pro-sport actief:</b> ${pro} — normale banen geblokkeerd.`:''}</div>
      ${currentJobStatus172()}
      <div class="section">Werk zoeken</div>
      <button class="btn" onclick="careerFindJobs172('werk1')">🧰 Werk 1.0: bijbaan / normale baan</button>
      <button class="btn gold" onclick="careerFindJobs172('career2')">📈 Werk 2.0: carrièrepad zoeken</button>
      <button class="btn" onclick="careerFindJobs172('local')">📍 Lokale banen in ${htmlEscape172(p?.name||'deze plaats')}</button>
      <div class="section">Mijn carrière</div>
      <button class="btn" onclick="careerActions172()">🧠 Werkacties / werkdag</button>
      <button class="btn" onclick="careerPaths172()">🗺️ Carrièrepaden bekijken</button>
      <button class="btn" onclick="careerNextStep172()">➡️ Volgende logische stap</button>
      <button class="btn" onclick="careerSwitchRoute172()">🔄 Omscholen / route wisselen</button>
      <div class="section">Andere inkomsten</div>
      <button class="btn" onclick="sportsContractHub163 ? sportsContractHub163() : (footballCareerScreen ? footballCareerScreen() : toast('Sportmenu niet gevonden'))">🏆 Sportcarrière / pro-contracten</button>
      <button class="btn" onclick="businessHub172()">🏢 Business / eigen bedrijf</button>
      <button class="btn" onclick="educationScreen ? educationScreen() : toast('Education menu niet gevonden')">🎓 Education</button>
      <button class="btn alt" onclick="closeModal()">Terug</button>
    </div>`);
  };

  window.careerFindJobs172 = function(filter){
    normalizeJobs172(); ensureCareer172();
    let jobs = (DATA.jobs||[]).filter(j=>{
      normalizeJob172(j);
      if(filter==='werk1') return j.workSystem==='werk1';
      if(filter==='career2') return j.workSystem==='career2';
      if(filter==='local') return placeJobFit172(j)>1;
      return true;
    });
    if(filter==='career2') jobs = jobs.filter(j=>(j.minAge||0)>=18);
    jobs = jobs.slice(0,80);
    const title = filter==='werk1'?'Werk 1.0 zoeken':filter==='career2'?'Werk 2.0 carrière zoeken':'Lokale banen';
    const help = filter==='werk1'?'Snel geld, laagdrempelig, weinig carrière-risico. Onder 18 alleen bijbanen/stage-achtige opties.':filter==='career2'?'Routebanen tellen zwaarder mee voor promotie, reputatie en volgende carrièrestappen.':'Deze banen passen extra goed bij je woonplaats/DLC.';
    showModal(`<div class="modalTop"><div class="avatar">🔎</div><div class="modalTitle">${title}</div></div><div class="modalBody">
      <div class="card">${help}</div>
      ${jobs.map(jobCard172).join('')||'<div class="card">Geen banen gevonden voor deze filter.</div>'}
      <button class="btn alt" onclick="careerHub172()">Terug</button>
    </div>`);
  };

  window.careerStartInterview172 = function(id){
    if(typeof currentProSport163 === 'function' && currentProSport163()) return toast('Je hebt een actief pro-sport contract. Stop dat eerst voordat je normaal werk aanneemt.');
    if(typeof startJobInterview === 'function') return startJobInterview(id);
    return toast('Sollicitatiesysteem niet gevonden.');
  };

  window.careerActions172 = function(){
    ensureCareer172();
    if(!state.job) return showModal(`<div class="modalTop"><div class="avatar">💼</div><div class="modalTitle">Werkacties</div></div><div class="modalBody"><div class="card">Je hebt nog geen baan.</div><button class="btn" onclick="careerFindJobs172('werk1')">Werk zoeken</button><button class="btn alt" onclick="careerHub172()">Terug</button></div>`);
    const route=ROUTES[state.job.route]||ROUTES.survival;
    showModal(`<div class="modalTop"><div class="avatar">🧠</div><div class="modalTitle">Werkacties</div></div>
    <div class="modalBody">
      ${currentJobStatus172()}${routeProgress172(state.job.route)}
      <button class="btn" onclick="careerDoAction172('hard')">💪 Hard werken</button>
      <button class="btn" onclick="careerDoAction172('network')">🤝 Netwerken</button>
      <button class="btn" onclick="careerDoAction172('learn')">📚 Training / skills volgen</button>
      <button class="btn" onclick="careerDoAction172('balance')">🧘 Rustiger werken</button>
      <button class="btn" onclick="careerDoAction172('raise')">💬 Salarisverhoging vragen</button>
      <button class="btn gold" onclick="careerDoAction172('promotion')">📈 Promotie / volgende stap vragen</button>
      <button class="btn red" onclick="careerQuit172()">🚪 Ontslag nemen</button>
      <button class="btn alt" onclick="careerHub172()">Terug</button>
    </div>`);
  };

  window.careerDoAction172 = function(kind){
    ensureCareer172();
    if(!state.job) return toast('Je hebt geen baan.');
    const c=state.career;
    const j=state.job;
    let title='Werk', txt='', stats={}, cash=0, type='good';
    if(kind==='hard'){
      c.performance=clamp172(c.performance+rand172(5,11)); c.stress=clamp172(c.stress+rand172(4,10)); c.experience+=rand172(3,7); c.reputation=clamp172(c.reputation+rand172(1,4));
      txt='Ik werkte hard. Mijn performance ging omhoog, maar mijn stress ook.'; stats={Smarts:1,Happiness:-2,Stamina:-5}; cash=Math.round((j.grossAnnual||j.salary||0)*0.03);
    }
    if(kind==='network'){
      c.bossRelation=clamp172(c.bossRelation+rand172(3,8)); c.coworkerRelation=clamp172(c.coworkerRelation+rand172(4,10)); c.reputation=clamp172(c.reputation+rand172(2,5)); c.experience+=rand172(1,4);
      txt='Ik netwerkte slim met mijn baas en collega’s. Minder directe skills, maar meer kansen.'; stats={Happiness:1,Smarts:1};
    }
    if(kind==='learn'){
      c.performance=clamp172(c.performance+rand172(2,6)); c.experience+=rand172(5,10); c.reputation=clamp172(c.reputation+rand172(1,3)); c.stress=clamp172(c.stress+rand172(1,4));
      txt='Ik volgde training en bouwde echte route-ervaring op.'; stats={Smarts:3,Stamina:-3}; cash=-(state.age<18?0:rand172(0,250));
    }
    if(kind==='balance'){
      c.stress=clamp172(c.stress-rand172(6,14)); c.performance=clamp172(c.performance-rand172(0,4)); c.coworkerRelation=clamp172(c.coworkerRelation+rand172(0,4));
      txt='Ik deed rustiger aan. Minder promotiedruk, maar beter voor mijn hoofd.'; stats={Happiness:4,Health:1,Stamina:6};
    }
    if(kind==='raise'){
      const chance=(c.performance+c.reputation+c.bossRelation)/330 - c.stress/500 + (state.jobYears||0)*0.03;
      if(Math.random()<chance){
        const inc=1+rand172(3,9)/100; j.grossAnnual=Math.round((j.grossAnnual||j.salary||0)*inc); j.salary=j.grossAnnual; j.fteGrossAnnual=Math.max(j.fteGrossAnnual||0,j.grossAnnual);
        txt=`Ik vroeg salarisverhoging en kreeg hem. Nieuw salaris: ${salaryLine172(j)}.`; stats={Happiness:8};
      }else{ txt='Ik vroeg salarisverhoging, maar mijn onderbouwing was nog niet sterk genoeg.'; stats={Happiness:-4}; type='warn'; c.bossRelation=clamp172(c.bossRelation-rand172(0,4)); }
    }
    if(kind==='promotion'){
      const chance=(c.performance*0.32+c.reputation*0.28+c.experience*0.22+c.bossRelation*0.18)/100 - c.stress/220 + (state.jobYears||0)*0.03;
      if(Math.random()<chance){
        state.careerLevel=(state.careerLevel||0)+1; c.promotions++; c.experience=Math.max(0,c.experience-rand172(8,18));
        const inc=1+rand172(8,16)/100; j.grossAnnual=Math.round((j.grossAnnual||j.salary||0)*inc); j.salary=j.grossAnnual; j.tier=Math.max(j.tier||0, state.careerLevel||0);
        txt=`Ik maakte een logische carrièrestap binnen ${ROUTES[j.route]?.name||'mijn werk'}. Nieuw level: ${(state.careerLevel||0)+1}.`; stats={Happiness:10,Smarts:2};
      }else{ txt='Ik wilde een stap omhoog, maar mijn routeprofiel was nog niet sterk genoeg. Meer performance, reputatie of ervaring nodig.'; stats={Happiness:-5,Smarts:1}; type='warn'; }
    }
    state.work.performance=c.performance; state.work.stress=c.stress; j.performance=c.performance; j.stress=c.stress;
    closeModal();
    if(typeof action === 'function') action(title, txt, stats, cash, type); else { addLog(`<b>${title}</b><br>${txt}`, type, false); if(cash) state.money+=cash; }
    safeSave(); render();
  };

  window.careerQuit172 = function(){
    if(!state.job) return toast('Je hebt geen baan.');
    const old=state.job.title;
    state.job=null; state.jobYears=0; state.careerLevel=0;
    if(state.career){ state.career.route=null; state.career.performance=50; state.career.stress=15; }
    closeModal();
    if(typeof action==='function') action('Werk',`Ik nam ontslag als ${old}. Mijn route-ervaring blijft deels als reputatie hangen.`,{Happiness:rand172(-2,5)},0,'warn');
    else addLog(`<b>Werk</b><br>Ik nam ontslag als ${old}.`,'warn',false);
    safeSave(); render();
  };

  window.careerPaths172 = function(){
    ensureCareer172();
    const routeButtons=Object.entries(ROUTES).map(([id,rt])=>`<button class="btn" onclick="careerPathDetail172('${id}')">${rt.icon} ${rt.name}<br><span class="mini">${rt.steps.join(' → ')}</span></button>`).join('');
    showModal(`<div class="modalTop"><div class="avatar">🗺️</div><div class="modalTitle">Carrièrepaden</div></div><div class="modalBody">
      <div class="card">Werk 2.0 gebruikt routes. Een baan is niet alleen salaris, maar ook richting, ervaring en volgende stap.</div>
      ${routeButtons}
      <button class="btn alt" onclick="careerHub172()">Terug</button>
    </div>`);
  };

  window.careerPathDetail172 = function(id){
    showModal(`<div class="modalTop"><div class="avatar">${ROUTES[id]?.icon||'💼'}</div><div class="modalTitle">${ROUTES[id]?.name||id}</div></div><div class="modalBody">
      ${routeProgress172(id)}
      <button class="btn" onclick="careerFindRouteJobs172('${id}')">Banen in deze route zoeken</button>
      <button class="btn alt" onclick="careerPaths172()">Terug</button>
    </div>`);
  };

  window.careerFindRouteJobs172 = function(id){
    normalizeJobs172();
    const jobs=(DATA.jobs||[]).filter(j=>{normalizeJob172(j); return j.route===id;});
    showModal(`<div class="modalTop"><div class="avatar">${ROUTES[id]?.icon||'💼'}</div><div class="modalTitle">Routebanen</div></div><div class="modalBody">
      <div class="card">Banen binnen: <b>${ROUTES[id]?.name||id}</b></div>
      ${jobs.map(jobCard172).join('')||'<div class="card">Nog geen banen in deze route.</div>'}
      <button class="btn alt" onclick="careerPathDetail172('${id}')">Terug</button>
    </div>`);
  };

  window.careerNextStep172 = function(){
    ensureCareer172();
    if(!state.job) return showModal(`<div class="modalTop"><div class="avatar">➡️</div><div class="modalTitle">Volgende stap</div></div><div class="modalBody"><div class="card">Je hebt nog geen route. Start met Werk 1.0 voor geld of kies Werk 2.0 voor een carrièrepad.</div><button class="btn" onclick="careerFindJobs172('career2')">Werk 2.0 zoeken</button><button class="btn alt" onclick="careerHub172()">Terug</button></div>`);
    const routeId=state.job.route||'survival';
    const route=ROUTES[routeId]||ROUTES.survival;
    const lvl=Math.min(route.steps.length-1, Math.max(0,state.careerLevel||0));
    const next=route.steps[Math.min(route.steps.length-1,lvl+1)];
    const needs=[];
    if((state.career.performance||50)<65) needs.push('performance richting 65+');
    if((state.career.reputation||45)<60) needs.push('reputatie richting 60+');
    if((state.career.experience||0)<20) needs.push('meer route XP');
    if((state.career.stress||20)>75) needs.push('stress omlaag');
    const routeJobs=(DATA.jobs||[]).filter(j=>{normalizeJob172(j); return j.route===routeId && (j.tier||0)>(state.job.tier||0);}).slice(0,8);
    showModal(`<div class="modalTop"><div class="avatar">➡️</div><div class="modalTitle">Volgende stap</div></div><div class="modalBody">
      ${routeProgress172(routeId)}
      <div class="card"><b>Volgende stap:</b> ${htmlEscape172(next)}<br><b>Nu nodig:</b> ${needs.join(', ')||'Je profiel is sterk genoeg voor promotie/sollicitatie.'}</div>
      <button class="btn gold" onclick="careerDoAction172('promotion')">📈 Promotie proberen</button>
      <div class="section">Mogelijke betere banen</div>
      ${routeJobs.map(jobCard172).join('')||'<div class="card">Geen duidelijke hogere vacature in deze route. Werk aan promotie of route wisselen.</div>'}
      <button class="btn alt" onclick="careerHub172()">Terug</button>
    </div>`);
  };

  window.careerSwitchRoute172 = function(){
    const buttons=Object.entries(ROUTES).filter(([id])=>id!=='pro_sports').map(([id,rt])=>`<button class="btn" onclick="careerSetRouteInterest172('${id}')">${rt.icon} ${rt.name}</button>`).join('');
    showModal(`<div class="modalTop"><div class="avatar">🔄</div><div class="modalTitle">Omscholen / route wisselen</div></div><div class="modalBody">
      <div class="card">Route wisselen betekent niet direct een nieuwe baan. Het zet je interesse en maakt passende vacatures/opleiding logischer.</div>
      ${buttons}
      <button class="btn alt" onclick="careerHub172()">Terug</button>
    </div>`);
  };

  window.careerSetRouteInterest172 = function(id){
    ensureCareer172();
    state.career.routeInterest=id;
    state.career.reputation=clamp172((state.career.reputation||45)-3);
    closeModal();
    if(typeof action==='function') action('Omscholing',`Ik richt mijn carrière-interesse nu op ${ROUTES[id]?.name||id}. Vacatures en keuzes in die richting worden logischer.`,{Smarts:2,Happiness:1},0,'good');
    safeSave(); render();
  };

  window.businessHub172 = function(){
    if(typeof businessScreen === 'function') return businessScreen();
    if(typeof openBusinessScreen === 'function') return openBusinessScreen();
    showModal(`<div class="modalTop"><div class="avatar">🏢</div><div class="modalTitle">Business</div></div><div class="modalBody"><div class="card">Business-systeem staat klaar in data, maar het oude business-menu is in deze build niet als aparte functie gevonden. Logisch ontwerp: alleen 18+, alleen wonen/resident-mode, winst via stad-modifiers.</div><button class="btn alt" onclick="careerHub172()">Terug</button></div>`);
  };

  function careerYearlyEvent172(){
    if(!hasState() || !state.job) return;
    ensureCareer172();
    const c=state.career, j=state.job, rt=ROUTES[j.route]||ROUTES.survival;
    c.experience += rand172(4,10) + Math.max(0, state.careerLevel||0);
    c.performance = clamp172(c.performance + rand172(-4,7));
    c.stress = clamp172(c.stress + rand172(-3,8));
    if(c.performance>70) c.reputation=clamp172(c.reputation+rand172(1,4));
    if(c.stress>80){ c.warnings++; addLog(`<b>Werkstress</b><br>Mijn werk in ${rt.name} trok zwaar aan me. Als dit zo doorgaat, stijgt burn-out/ontslagrisico.`, 'warn', false); }
    if(c.performance<25 && Math.random()<0.25){ c.warnings++; addLog(`<b>Werkwaarschuwing</b><br>Mijn performance was te laag. Ik kreeg een officiële waarschuwing.`, 'bad', false); }
    if(j.workSystem==='career2' && c.experience>35 && c.performance>62 && c.reputation>55 && Math.random()<0.22){
      addLog(`<b>Carrièrekans</b><br>Door mijn groei in ${rt.name} kwam er een logische kans op promotie of een betere baan.`, 'good', false);
      c.lastRouteOfferAge=state.age;
    }
    if(state.age<18){ c.stress=Math.min(c.stress,65); }
    state.work.performance=c.performance; state.work.stress=c.stress; j.performance=c.performance; j.stress=c.stress;
  }

  const oldAnswerJob172 = window.answerJobInterview || (typeof answerJobInterview === 'function' ? answerJobInterview : null);
  window.answerJobInterview = function(i){
    const beforeJob = hasState() && state.job ? state.job.id : null;
    const ret = oldAnswerJob172 ? oldAnswerJob172(i) : null;
    setTimeout(()=>{
      try{
        if(hasState() && state.job && state.job.id !== beforeJob){
          normalizeJob172(state.job);
          state.career = {route:state.job.route, routeInterest:state.job.route, experience:0, reputation:45, performance:50, stress:20, bossRelation:50, coworkerRelation:50, warnings:0, promotions:0, lastRouteOfferAge:-99};
          state.work = state.work || {}; state.work.performance=50; state.work.stress=20;
          safeSave(); render();
        }
      }catch(e){ console.warn('[career v17.2 answer patch]', e); }
    }, 60);
    return ret;
  };
  try{ answerJobInterview = window.answerJobInterview; }catch(e){}

  const oldYearlyIncome172 = window.yearlyIncome || (typeof yearlyIncome === 'function' ? yearlyIncome : null);
  window.yearlyIncome = function(){
    const ret = oldYearlyIncome172 ? oldYearlyIncome172() : null;
    try{ careerYearlyEvent172(); }catch(e){ console.warn('[career v17.2 yearly]', e); }
    return ret;
  };
  try{ yearlyIncome = window.yearlyIncome; }catch(e){}

  const oldWorkScreen172 = window.workScreen || (typeof workScreen === 'function' ? workScreen : null);
  window.workScreen = function(){ return window.careerHub172(); };
  try{ workScreen = window.workScreen; }catch(e){}

  const oldLifeHTML172 = window.lifeHTML || (typeof lifeHTML === 'function' ? lifeHTML : null);
  if(oldLifeHTML172){
    window.lifeHTML = function(){
      let h = oldLifeHTML172();
      try{
        if(!h.includes('Career Hub 17.2')){
          h = h.replace(/onclick="workScreen\(\)"/g, 'onclick="careerHub172()"');
          h = h.replace('Work</span>', 'Career</span>');
          h = h.replace('>Work<', '>Career<');
        }
      }catch(e){}
      return h;
    };
    try{ lifeHTML = window.lifeHTML; }catch(e){}
  }

  const oldRender172 = window.render || (typeof render === 'function' ? render : null);
  window.render = function(){
    try{ normalizeJobs172(); if(hasState()) ensureCareer172(); }catch(e){}
    return oldRender172 ? oldRender172() : null;
  };
  try{ render = window.render; }catch(e){}

  window.BITZ_SYSTEMS = window.BITZ_SYSTEMS || {};
  window.BITZ_SYSTEMS.careerUnified = {
    version: VERSION,
    principle: 'Werk 1.0 is gewone baan/bijbaan; Werk 2.0 is route met ervaring, reputatie, performance, stress en logische doorgroei.',
    routes: ROUTES
  };

  normalizeJobs172();
  setTimeout(()=>{ try{ if(hasState()){ ensureCareer172(); safeSave(); render(); } }catch(e){} }, 300);
})();
