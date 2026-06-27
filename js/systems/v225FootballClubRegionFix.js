
/* v22.5 Football Club Region Fix
   Fixes invalid football clubs from countries/routes not in the game.
   Arsenal/England and Dortmund/Germany are removed until those countries exist as game routes.
*/
(function(){
  function clamp225(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function pick225(a){return a[Math.floor(Math.random()*a.length)]}
  function money225(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast225(t){try{toast(t)}catch(e){console.log(t)}}
  function rr225(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }

  const CLUBS225={
    youth:[
      'FC Enkhuizen O17',
      'FC Enkhuizen O18',
      'West-Friesland Youth',
      'Hoorn Youth Academy',
      'Oranje Talenten O18',
      'Tobias Dahl Academy'
    ],
    street:[
      'Parkplein Straatteam',
      'Parkplein Street XI',
      'Haven Boys Straatteam',
      'Havenplein Street XI',
      'Koopgoot Five'
    ],
    amateur:[
      'VV Enkhuizen',
      'West-Friesland FC',
      'CSV Jong Holland',
      'FC Medemblik',
      'Hollandia Amateurs',
      'SV De Dijk Amateurs'
    ],
    academy:[
      'AZ Scoutdag',
      'AZ Academy',
      'Ajax Talentendag',
      'Ajax Open Academy',
      'FC Utrecht Talentendag',
      'FC Utrecht Academy',
      'PSV Regionale Academy'
    ],
    semi:[
      'FC Volendam Jong',
      'Jong AZ Regionaal',
      'Jong Ajax Regionaal',
      'West-Friesland Semi-Pro',
      'Hollandia Semi-Pro'
    ],
    pro:[
      'FC Volendam',
      'AZ',
      'FC Utrecht',
      'Sparta Rotterdam',
      'Ajax',
      'PSV',
      'Feyenoord'
    ],
    top:[
      'Ajax',
      'PSV',
      'Feyenoord',
      'AZ'
    ],
    spain:[
      'FC Barcelona B',
      'FC Barcelona',
      'Real Madrid Castilla',
      'Atlético Madrid B',
      'Sevilla FC'
    ],
    america:[
      'LA Galaxy',
      'Inter Miami',
      'New York City FC',
      'Seattle Sounders'
    ],
    japan:[
      'Tokyo Verdy',
      'FC Tokyo',
      'Yokohama F. Marinos',
      'Kashima Antlers'
    ],
    jamaica:[
      'Kingston Harbour FC',
      'Montego Bay United',
      'Portmore United'
    ],
    nightcity:[
      'Night City Strikers B',
      'Night City Strikers',
      'Night City United',
      'Neon Cage FC'
    ]
  };

  const INVALID_CLUBS225=new Set([
    'Arsenal',
    'Borussia Dortmund',
    'Pro Football Club',
    'England FC',
    'London FC',
    'Manchester FC',
    'Bayern München',
    'Bayern Munich',
    'AC Milan',
    'Juventus',
    'Paris Saint-Germain',
    'PSG'
  ]);

  const LEVEL_LABEL225={none:'Geen club',youth:'Jeugdteam',street:'Straatvoetbalteam',amateur:'Amateurclub',academy:'Academy/Scoutdag',semi:'Semi-prof',pro:'Profclub',top:'Topclub'};
  const SALARY225={
    youth:{min:0,max:0,contract:false,title:null},
    street:{min:0,max:1200,contract:false,title:null},
    amateur:{min:500,max:2500,contract:false,title:null},
    academy:{min:0,max:0,contract:false,title:null},
    semi:{min:12000,max:32000,contract:true,title:'Semi-prof voetballer'},
    pro:{min:42000,max:220000,contract:true,title:'Profvoetballer'},
    top:{min:350000,max:1600000,contract:true,title:'Topvoetballer'}
  };

  function allGameClubs225(){
    return Object.values(CLUBS225).flat();
  }
  function region225(){
    const s=String((state&&(state.world||state.vacation||state.placeId||'enkhuizen'))||'enkhuizen').toLowerCase();
    if(s.includes('spain')||s.includes('spanje')||s.includes('barcelona'))return 'spain';
    if(s.includes('america')||s.includes('usa'))return 'america';
    if(s.includes('japan')||s.includes('tokyo'))return 'japan';
    if(s.includes('jamaica'))return 'jamaica';
    if(s.includes('night'))return 'nightcity';
    return 'netherlands';
  }
  function level225(lvl){
    lvl=String(lvl||'none').toLowerCase();
    if(lvl==='professional'||lvl==='prof')return 'pro';
    if(lvl==='topclub'||lvl==='international'||lvl==='legende')return 'top';
    if(lvl==='semi-pro'||lvl==='semipro'||lvl==='beloften')return 'semi';
    if(lvl==='jeugdopleiding')return 'academy';
    if(!SALARY225[lvl]&&lvl!=='none')return 'amateur';
    return lvl;
  }
  function clubListFor225(level){
    level=level225(level);
    let list=[...(CLUBS225[level]||CLUBS225.amateur)];
    const reg=region225();

    // Only add clubs from game routes that actually exist in this game.
    if(reg==='spain' && ['semi','pro','top'].includes(level)) list=list.concat(CLUBS225.spain);
    if(reg==='america' && ['academy','semi','pro'].includes(level)) list=list.concat(CLUBS225.america);
    if(reg==='japan' && ['academy','semi','pro'].includes(level)) list=list.concat(CLUBS225.japan);
    if(reg==='jamaica' && ['street','amateur','semi'].includes(level)) list=list.concat(CLUBS225.jamaica);
    if(reg==='nightcity') list=list.concat(CLUBS225.nightcity);

    // De-dupe and remove invalids
    return [...new Set(list)].filter(x=>!INVALID_CLUBS225.has(x));
  }
  function validClub225(name){
    return !!name && allGameClubs225().includes(name) && !INVALID_CLUBS225.has(name);
  }
  function clubFor225(level,current=null){
    level=level225(level);
    const list=clubListFor225(level);
    if(current && list.includes(current) && validClub225(current))return current;
    return pick225(list.length?list:CLUBS225.amateur);
  }
  function salaryRange225(level){return SALARY225[level225(level)]||SALARY225.amateur}
  function salary225(level,keep=0){
    const s=salaryRange225(level);
    if(!s.max)return 0;
    let v=keep||Math.round(s.min+Math.random()*(s.max-s.min));
    return Math.max(s.min,Math.min(Math.round(s.max*1.5),v));
  }

  function repairFootballClub225(log=false){
    if(!state)return;
    state.football=state.football||{};
    const f=state.football;
    if(!f.active)return;
    f.level=level225(f.level||'amateur');
    const before=f.club;
    if(!validClub225(f.club) || INVALID_CLUBS225.has(f.club)){
      f.club=clubFor225(f.level,null);
      if(log)try{addLog(`<b>Voetbalclub gerepareerd</b><br>${before||'Ongeldige club'} zat niet in de game-landen/routes. Nieuwe club: ${f.club}.`, 'warn', false)}catch(e){}
    }else{
      f.club=clubFor225(f.level,f.club);
    }

    f.salaryAnnual=Number(f.salaryAnnual||f.salary||0);
    if(salaryRange225(f.level).contract && f.salaryAnnual<=0)f.salaryAnnual=salary225(f.level);
    if(!salaryRange225(f.level).contract && f.salaryAnnual>salaryRange225(f.level).max)f.salaryAnnual=salary225(f.level);
    f.salary=f.salaryAnnual;
    f.matchFee=0;
    f.contract=salaryRange225(f.level).contract;

    if(f.contract){
      const info=salaryRange225(f.level);
      state.job={
        id:'football_'+f.level,
        title:info.title,
        company:f.club,
        club:f.club,
        salary:f.salaryAnnual,
        grossAnnual:f.salaryAnnual,
        pay:f.salaryAnnual,
        payType:'grossAnnual',
        hours:32,
        standardHours:32,
        fteGrossAnnual:f.salaryAnnual,
        req:'none',
        minAge:16,
        field:'Sport',
        sport:'football',
        sportContract:true
      };
    }else if(state.job && (state.job.sport==='football'||/voetbal/i.test(state.job.title||''))){
      state.job=null;
    }
  }
  window.repairFootballClub225=repairFootballClub225;

  const oldEnsure224 = window.ensureFootball224 || null;
  window.ensureFootball224=function(){
    let f=null;
    try{if(oldEnsure224)f=oldEnsure224.apply(this,arguments)}catch(e){}
    repairFootballClub225(false);
    return state.football;
  };

  window.footballTransferScreen=function(){
    repairFootballClub225(false);
    const f=state.football||{};
    if(!f.active)return toast225('Je hebt nog geen club. Doe eerst een try-out.');
    const list=clubListFor225(f.level);
    const nextLevel=(f.level==='youth')?'amateur':(f.level==='street')?'amateur':(f.level==='amateur')?'semi':(f.level==='academy')?'semi':(f.level==='semi')?'pro':(f.level==='pro')?'top':'top';
    const nextList=clubListFor225(nextLevel);
    showModal(`<div class="modalTop"><div class="avatar">🔎</div><div class="modalTitle">Andere club zoeken</div></div><div class="modalBody"><div class="card"><b>Huidige club:</b> ${f.club||'geen'}<br><b>Niveau:</b> ${LEVEL_LABEL225[f.level]||f.level}<br><b>Regio:</b> ${region225()}<br><br><b>Clubs huidig niveau:</b><br><span class="mini">${list.join(', ')}</span><br><br><b>Volgend niveau:</b> ${LEVEL_LABEL225[nextLevel]||nextLevel}<br><span class="mini">${nextList.join(', ')}</span><br><br>Alleen clubs uit landen/routes die in de game zitten. Geen Arsenal/Engeland of Dortmund/Duitsland zolang die landen niet bestaan.</div><button class="btn" onclick="footballApplyClub225('same')">🔁 Andere club op zelfde niveau</button><button class="btn gold" onclick="footballApplyClub225('up')">⬆️ Niveau omhoog proberen</button><button class="btn alt" onclick="footballCareerScreen()">Terug</button></div>`);
  };

  function nextLevel225(lvl){
    lvl=level225(lvl);
    if(lvl==='youth'||lvl==='street')return 'amateur';
    if(lvl==='amateur'||lvl==='academy')return 'semi';
    if(lvl==='semi')return 'pro';
    if(lvl==='pro')return 'top';
    return 'top';
  }

  window.footballApplyClub225=function(mode){
    repairFootballClub225(false);
    const f=state.football||{};
    if(!f.active)return toast225('Je hebt geen actieve voetbalclub.');
    const target=mode==='up'?nextLevel225(f.level):f.level;
    let score=55+(f.skill||0)*.18+(f.form||0)*.15+(f.coachTrust||0)*.10+(f.fame||0)*.12+(f.scout?12:0)+(mode==='up'?-20:0);
    const ok=Math.random()*100<score;
    if(!ok){
      closeModal();
      try{action('Transfer',`Ik zocht een club, maar kreeg geen goed aanbod.`,{Happiness:-4,Stamina:-4},0,'warn')}catch(e){}
      return;
    }
    const old=f.club;
    f.level=level225(target);
    f.club=clubFor225(f.level,null);
    f.salaryAnnual=salary225(f.level);
    f.salary=f.salaryAnnual;
    f.matchFee=0;
    f.contract=salaryRange225(f.level).contract;
    repairFootballClub225(false);
    closeModal();
    try{action('Transfer',`${old?old+' → ':''}${f.club}. ${f.contract?`Nieuw jaarcontract: ${money225(f.salaryAnnual)}/jaar.`:'Nog geen vol profcontract.'}`,{Happiness:10,Fitness:2},0,'good')}catch(e){}
  };

  // Patch old function name too, so old buttons still work but use region-safe clubs.
  window.footballApplyClub=function(mode){return window.footballApplyClub225(mode)};

  const oldCareer225=window.footballCareerScreen||null;
  if(oldCareer225&&!oldCareer225.__region225){
    window.footballCareerScreen=function(){
      repairFootballClub225(false);
      return oldCareer225.apply(this,arguments);
    };
    window.footballCareerScreen.__region225=true;
  }

  const oldSave225=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave225&&!oldSave225.__region225){
    window.safeSave=function(){
      try{repairFootballClub225(false)}catch(e){}
      return oldSave225.apply(this,arguments);
    };
    window.safeSave.__region225=true; try{safeSave=window.safeSave}catch(e){}
  }

  const oldRender225=window.render||(typeof render==='function'?render:null);
  if(oldRender225&&!oldRender225.__region225){
    window.render=function(){
      try{repairFootballClub225(false)}catch(e){}
      return oldRender225.apply(this,arguments);
    };
    window.render.__region225=true; try{render=window.render}catch(e){}
  }

  window.footballRegionDebug225=function(){
    repairFootballClub225(false);
    const f=state.football||{};
    const all=allGameClubs225();
    showModal(`<div class="modalTop"><div class="avatar">⚽</div><div class="modalTitle">Football region debug</div></div><div class="modalBody"><div class="card"><b>Huidige club:</b> ${f.club||'geen'}<br><b>Geldig:</b> ${validClub225(f.club)?'ja':'nee'}<br><b>Regio:</b> ${region225()}<br><b>Alle geldige clubs:</b><br><span class="mini">${all.join(', ')}</span><br><br>Arsenal, Dortmund, Engeland en Duitsland zijn verwijderd zolang die routes niet in de game zitten.</div><button class="btn" onclick="repairFootballClub225(true);safeSave();render();closeModal()">Repair club now</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{try{repairFootballClub225(true);safeSave();render()}catch(e){}},300);
})();
