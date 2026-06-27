
/* v22.4 Football Club + Salary Sync
   Fixes football career logic:
   - salary is annual contract salary, never per match
   - football job/economy uses the same gross annual salary
   - transfers only use clubs from the in-game club lists
   - invalid fallback clubs are repaired to real game clubs
*/
(function(){
  function clamp224(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r224(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick224(a){return a[Math.floor(Math.random()*a.length)]}
  function money224(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast224(t){try{toast(t)}catch(e){console.log(t)}}
  function action224(title,txt,stats={},cash=0,type='good'){
    try{return action(title,txt,stats,cash,type)}catch(e){
      if(cash)state.money=(state.money||0)+cash;
      try{applyStats(stats)}catch(_){}
      try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(_){}
      try{safeSave();render()}catch(_){}
    }
  }
  function rr224(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function bar224(v){try{return skillBar(v)}catch(e){return ''}}
  function saveRender224(){try{safeSave()}catch(e){}try{render()}catch(e){}}

  const CLUBS224={
    youth:['FC Enkhuizen O17','West-Friesland Youth','Tobias Dahl Academy','Oranje Talenten O18','FC Enkhuizen O18','Hoorn Youth Academy'],
    street:['Parkplein Street XI','Haven Boys Straatteam','Koopgoot Five','Night Court Ballers','Havenplein Street XI','Neon Cage FC','Parkplein Straatteam'],
    amateur:['VV Enkhuizen','CSV Jong Holland','West-Friesland FC','SV De Dijk Amateurs','FC Medemblik'],
    academy:['AZ Scoutdag','Ajax Open Academy','FC Utrecht Talentendag','PSV Regionale Proeftraining','AZ Academy','Ajax Talentendag','FC Utrecht Academy','PSV Regionale Academy'],
    semi:['FC Volendam Jong','Jong AZ Regionaal','West-Friesland Semi-Pro','Night City Strikers B','Hollandia Semi-Pro'],
    pro:['FC Volendam','AZ','FC Utrecht','Sparta Rotterdam','Night City Strikers','Ajax'],
    top:['Ajax','PSV','Feyenoord','Borussia Dortmund','Arsenal','Night City United','FC Barcelona B']
  };
  const LEVEL_LABEL224={none:'Geen club',youth:'Jeugdteam',street:'Straatvoetbalteam',amateur:'Amateurclub',academy:'Academy/Scoutdag',semi:'Semi-prof',pro:'Profclub',top:'Topclub'};
  const LEVEL_ORDER224=['youth','street','amateur','academy','semi','pro','top'];
  const SALARY224={
    youth:{min:0,max:0,contract:false,title:null},
    street:{min:0,max:1200,contract:false,title:null},
    amateur:{min:500,max:2500,contract:false,title:null},
    academy:{min:0,max:0,contract:false,title:null},
    semi:{min:12000,max:32000,contract:true,title:'Semi-prof voetballer'},
    pro:{min:42000,max:220000,contract:true,title:'Profvoetballer'},
    top:{min:350000,max:2600000,contract:true,title:'Topvoetballer'}
  };
  function canonicalLevel224(lvl){
    lvl=String(lvl||'none').toLowerCase();
    if(lvl==='prof'||lvl==='professional')return 'pro';
    if(lvl==='basisplaats')return 'pro';
    if(lvl==='topclub'||lvl==='international'||lvl==='legende')return 'top';
    if(lvl==='beloften'||lvl==='semi-pro'||lvl==='semipro')return 'semi';
    if(lvl==='jeugdopleiding')return 'academy';
    if(!CLUBS224[lvl]&&lvl!=='none')return 'amateur';
    return lvl;
  }
  function allClubs224(){
    return Object.values(CLUBS224).flat();
  }
  function clubForLevel224(level, current=null){
    level=canonicalLevel224(level);
    const list=CLUBS224[level]||CLUBS224.amateur;
    if(current && list.includes(current))return current;
    // If current exists in some other valid list, keep it only if level mismatch is minor? Better sync: choose level list.
    return pick224(list);
  }
  function isValidClub224(name){
    return allClubs224().includes(name);
  }
  function nextLevel224(level){
    level=canonicalLevel224(level);
    if(level==='street')return 'amateur';
    if(level==='academy')return 'semi';
    const i=LEVEL_ORDER224.indexOf(level);
    if(i<0)return 'youth';
    return LEVEL_ORDER224[Math.min(LEVEL_ORDER224.length-1,i+1)];
  }
  function salaryRange224(level){
    return SALARY224[canonicalLevel224(level)]||SALARY224.amateur;
  }
  function salaryForLevel224(level, manager=null, keep=0){
    const s=salaryRange224(level);
    if(!s.max)return 0;
    let val=keep||r224(s.min,s.max);
    if(manager)val=Math.round(val*(1+(manager.bonus||0)/100));
    return Math.max(s.min,Math.min(Math.round(s.max*1.6),val));
  }
  function ensureFootball224(){
    let f;
    try{f=ensureFootball()}catch(e){}
    state.football=state.football||f||{};
    f=state.football;
    f.level=canonicalLevel224(f.level||'none');
    f.matches=Number(f.matches||0); f.goals=Number(f.goals||0); f.assists=Number(f.assists||0);
    f.skill=clamp224(f.skill||0); f.form=clamp224(f.form||50); f.coachTrust=clamp224(f.coachTrust||50); f.fame=clamp224(f.fame||0);
    f.injuryRisk=clamp224(f.injuryRisk||10);
    if(f.active && f.level!=='none'){
      f.club=clubForLevel224(f.level,f.club);
      f.salaryAnnual=Number(f.salaryAnnual||f.salary||f.contract?.baseSalary||0);
      if(!salaryRange224(f.level).contract && f.salaryAnnual>salaryRange224(f.level).max)f.salaryAnnual=salaryForLevel224(f.level,f.manager);
      if(salaryRange224(f.level).contract && f.salaryAnnual<=0)f.salaryAnnual=salaryForLevel224(f.level,f.manager);
      f.salary=f.salaryAnnual;
      f.matchFee=0;
      f.contract=salaryRange224(f.level).contract;
    }else{
      f.active=!!f.active;
      if(!f.active){f.level='none';f.club=null;f.contract=false;f.salary=0;f.salaryAnnual=0;f.matchFee=0;}
    }
    syncFootballJob224(false);
    return f;
  }
  window.ensureFootball224=ensureFootball224;

  function syncFootballJob224(writeLog=false){
    const f=state.football||{};
    const info=salaryRange224(f.level);
    if(f.active && info.contract){
      f.contract=true;
      f.salaryAnnual=Number(f.salaryAnnual||f.salary||salaryForLevel224(f.level,f.manager));
      f.salary=f.salaryAnnual;
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
        baseHours:32,
        fteGrossAnnual:f.salaryAnnual,
        req:'none',
        minAge:16,
        field:'Sport',
        sport:'football',
        sportContract:true
      };
      if(writeLog)try{addLog(`<b>Voetbalcontract sync</b><br>${f.club}: ${money224(f.salaryAnnual)}/jaar bruto.`, 'good', false)}catch(e){}
    }else{
      f.contract=false;
      if(state.job && (state.job.sport==='football'||/voetbal/i.test(state.job.title||''))){
        state.job=null;
      }
    }
  }
  window.syncFootballJob224=syncFootballJob224;

  window.footballCareerScreen=function(){
    const f=ensureFootball224();
    if(state.age<15){
      showModal(`<div class="modalTop"><div class="avatar">⚽</div><div class="modalTitle">Football Career</div></div><div class="modalBody"><div class="card">Beschikbaar vanaf 15 jaar.<br>Blijf tot die tijd voetballen/kinder sport doen om sporttalent op te bouwen.</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
      return;
    }
    const salaryTxt=f.contract?`${money224(f.salaryAnnual||0)}/jaar bruto contract`:(f.salaryAnnual?`${money224(f.salaryAnnual)}/jaar vergoeding`:'geen salaris');
    const jobTxt=f.contract&&state.job?`<br><b>Economy sync:</b> job inkomen = ${money224(state.job.grossAnnual||state.job.salary||0)}/jaar`:'';
    const injured=f.injured?`<br><span style="color:#ff6b5a"><b>Geblesseerd:</b> ${f.injuryYears||1} jaar herstel</span>`:'';
    showModal(`<div class="modalTop"><div class="avatar">⚽</div><div class="modalTitle">Football Career</div></div><div class="modalBody">
      <div class="card"><b>Status:</b> ${LEVEL_LABEL224[f.level]||f.level}<br><b>Club:</b> ${f.club||'geen'}<br><b>Positie:</b> ${f.position||'nog niet gekozen'}<br><b>Salaris:</b> ${salaryTxt}${jobTxt}<br><b>Let op:</b> wedstrijden betalen geen basissalaris; salaris komt jaarlijks via contract/job.<br><b>Coach vertrouwen:</b> ${f.coachTrust}% ${bar224(f.coachTrust)}<br><b>Vorm:</b> ${f.form}% ${bar224(f.form)}<br><b>Football Skill:</b> ${f.skill}% ${bar224(f.skill)}<br><b>Fame:</b> ${f.fame}% ${bar224(f.fame)}<br><b>Stats:</b> ${f.matches} wedstrijden · ${f.goals} goals · ${f.assists} assists${injured}</div>
      ${!f.active?`<button class="btn" onclick="footballTryoutScreen()">📝 Try-out doen</button>`:`<button class="btn" onclick="footballTrainScreen()">🏋️ Trainen</button><button class="btn ${f.injured?'locked':''}" onclick="${f.injured?'':`footballMatch()`}">🏟️ Wedstrijd spelen</button><button class="btn" onclick="footballCoachTalk()">🧢 Coach spreken</button><button class="btn" onclick="footballContractScreen()">📄 Contract / manager</button><button class="btn gold" onclick="footballTransferScreen()">🔎 Andere club / niveau omhoog</button><button class="btn" onclick="footballRestRehab()">🩹 Rust / revalidatie</button><button class="btn red" onclick="footballQuit()">Stoppen met voetbal</button>`}
      <button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  try{footballCareerScreen=window.footballCareerScreen}catch(e){}

  window.footballTryoutScreen=function(){
    showModal(`<div class="modalTop"><div class="avatar">📝</div><div class="modalTitle">Try-out</div></div><div class="modalBody"><div class="card">Je try-out kans hangt af van sporttalent, fitness, stamina, health, discipline en leeftijd.<br>Clubs worden alleen gekozen uit de game-clublijsten.</div>${[['youth','Jeugdteam'],['amateur','Amateurclub'],['street','Straatvoetbalteam'],['academy','Academy / scoutdag']].map(x=>`<button class="btn" onclick="footballPickPosition('${x[0]}')">${x[1]}<br><span class="mini">${(CLUBS224[x[0]]||[]).slice(0,3).join(', ')}</span></button>`).join('')}<button class="btn alt" onclick="footballCareerScreen()">Terug</button></div>`);
  };
  try{footballTryoutScreen=window.footballTryoutScreen}catch(e){}

  window.footballTryout=function(type,pos){
    let f=ensureFootball224(), t=state.talents||{};
    type=canonicalLevel224(type);
    let base=(t.sport||0)*.35+(state.fitness||50)*.22+(state.stamina||50)*.14+(state.stats?.Health||50)*.12+(t.discipline||0)*.10+(state.stats?.Smarts||50)*.07;
    let ageBonus=state.age<=19?8:state.age<=24?2:-8;
    let typeDiff={youth:38,street:42,amateur:50,academy:58}[type]||45;
    let chance=clamp224(Math.round(base+ageBonus-typeDiff+50));
    let ok=r224(1,100)<=chance;
    closeModal();
    if(ok){
      f.active=true; f.level=type; f.club=clubForLevel224(type); f.position=pos;
      f.skill=clamp224(Math.round((t.sport||0)*.55+(state.fitness||50)*.25+r224(5,20)));
      f.form=r224(45,70); f.coachTrust=r224(42,66); f.injuryRisk=r224(8,18);
      f.salaryAnnual=salaryForLevel224(type,f.manager);
      f.salary=f.salaryAnnual; f.matchFee=0; f.contract=salaryRange224(type).contract;
      syncFootballJob224(false);
      action224('Try-out',`Ik deed try-out als ${pos} bij ${f.club}. Ik werd aangenomen.${f.salaryAnnual?` Vergoeding/salaris: ${money224(f.salaryAnnual)}/jaar.`:''}`,{Happiness:12,Fitness:3,Stamina:-10},0,'good');
      try{addLog(`<b>Football Career</b><br>Mijn kans was ongeveer ${chance}%. Ik zit nu bij ${f.club}.`, 'good', false)}catch(e){}
    }else{
      state.talents=state.talents||{}; state.talents.sport=clamp224((state.talents.sport||0)+2);
      action224('Try-out',`Ik deed try-out als ${pos}, maar was nog niet goed genoeg.`,{Happiness:-4,Fitness:1,Stamina:-10},0,'warn');
      try{addLog(`<b>Try-out</b><br>Mijn kans was ongeveer ${chance}%. Ik werd afgewezen, maar leerde ervan.`,'warn',false)}catch(e){}
    }
  };
  try{footballTryout=window.footballTryout}catch(e){}

  window.footballMatch=function(){
    let f=ensureFootball224(), t=state.talents||{};
    if(!f.active)return toast224('Je hebt nog geen club.');
    if(f.injured)return toast224('Je bent geblesseerd.');
    let matchPower=f.skill*.38+f.form*.22+f.coachTrust*.14+(state.fitness||50)*.12+(state.stamina||50)*.08+(t.discipline||0)*.06+r224(-20,35);
    let great=matchPower>78, good=matchPower>58, bad=matchPower<35;
    f.matches++;
    f.form=clamp224(f.form+(great?r224(4,10):good?r224(1,5):-r224(3,9)));
    f.coachTrust=clamp224(f.coachTrust+(great?r224(5,10):good?r224(1,4):-r224(4,10)));
    let goals=0,assists=0;
    if(f.position==='Aanvaller')goals=great?r224(1,3):(good&&Math.random()<.45?1:0);
    if(f.position==='Middenvelder')assists=great?r224(1,3):(good&&Math.random()<.55?1:0);
    if(f.position==='Verdediger'&&great&&Math.random()<.25)goals=1;
    f.goals+=goals; f.assists+=assists;
    let text=great?`Ik speelde fantastisch. ${goals?`Ik scoorde ${goals} keer. `:''}${assists?`Ik gaf ${assists} assist(s). `:''}De coach was zichtbaar tevreden.`:good?`Ik speelde een degelijke wedstrijd. ${goals?'Ik prikte er eentje in. ':''}${assists?'Ik gaf een assist. ':''}`:`Ik speelde zwak. Mijn timing zat verkeerd en de coach keek niet blij.`;
    text += `<br><span class="mini">Geen salaris per wedstrijd: je basissalaris is je jaarcontract.</span>`;
    let scoutChance=(great?0.30:good?0.10:0.01)+(f.level==='academy'?0.15:0);
    if(Math.random()<scoutChance&&state.age-(f.lastScoutAge??-99)>1){
      f.scout=true; f.lastScoutAge=state.age;
      try{addLog(`<b>Scout</b><br>Een scout zat op de tribune en noteerde mijn naam na de wedstrijd.`, 'good', false)}catch(e){}
    }
    let injChance=f.injuryRisk*.004+(bad?0.04:0.015);
    closeModal();
    if(Math.random()<injChance){footballInjury('wedstrijd');return}
    action224('Voetbalwedstrijd',text,{Happiness:great?11:good?5:-5,Fitness:2,Stamina:-14},0,great||good?'good':'warn');
    footballMaybeProgress();
  };
  try{footballMatch=window.footballMatch}catch(e){}

  window.footballMaybeProgress=function(){
    let f=ensureFootball224();
    if(!f.active)return;
    let score=f.skill+f.form+f.coachTrust+f.fame+(f.scout?20:0);
    function move(level,msgTitle){
      const old=f.club;
      f.level=canonicalLevel224(level);
      f.club=clubForLevel224(f.level);
      f.salaryAnnual=salaryForLevel224(f.level,f.manager);
      f.salary=f.salaryAnnual; f.matchFee=0; f.contract=salaryRange224(f.level).contract;
      syncFootballJob224(false);
      try{addLog(`<b>${msgTitle}</b><br>${old?old+' → ':''}${f.club}. ${f.salaryAnnual?`Jaarcontract: ${money224(f.salaryAnnual)}/jaar.`:'Nog geen betaald contract.'}`, 'good', false)}catch(e){}
    }
    if(f.level==='youth'&&state.age>=16&&score>210)move('amateur','Transfer');
    else if((f.level==='amateur'||f.level==='academy')&&score>260)move('semi','Contract');
    else if(f.level==='semi'&&score>315)move('pro','Profcontract');
    else if(f.level==='pro'&&score>370&&f.fame>55)move('top','Toptransfer');
  };
  try{footballMaybeProgress=window.footballMaybeProgress}catch(e){}

  window.footballTransferScreen=function(){
    let f=ensureFootball224();
    if(!f.active)return toast224('Je hebt nog geen club. Doe eerst een try-out.');
    let next=nextLevel224(f.level);
    let score=footballTransferScore();
    let status=score>80?'grote kans':score>60?'redelijke kans':score>42?'twijfelgeval':'lastig';
    let clubsNow=(CLUBS224[f.level]||[]).join(', ');
    let clubsNext=(CLUBS224[next]||[]).join(', ');
    showModal(`<div class="modalTop"><div class="avatar">🔎</div><div class="modalTitle">Andere club zoeken</div></div><div class="modalBody"><div class="card"><b>Huidige club:</b> ${f.club||'geen'}<br><b>Huidig niveau:</b> ${LEVEL_LABEL224[f.level]||f.level}<br><b>Transferprofiel:</b> ${status}<br><b>Clubs huidig niveau:</b><br><span class="mini">${clubsNow}</span><br><br><b>Volgend niveau:</b> ${LEVEL_LABEL224[next]||next}<br><span class="mini">${clubsNext}</span><br><br>Transfers kiezen alleen uit deze game-clubs.</div><button class="btn" onclick="footballApplyClub('same')">🔁 Andere club op zelfde niveau zoeken</button>${next!==f.level?`<button class="btn gold" onclick="footballApplyClub('up')">⬆️ Niveau omhoog proberen naar ${LEVEL_LABEL224[next]||next}</button>`:''}<button class="btn" onclick="footballOpenTrials()">👀 Open proeftraining zoeken</button><button class="btn alt" onclick="footballCareerScreen()">Terug</button></div>`);
  };
  try{footballTransferScreen=window.footballTransferScreen}catch(e){}

  window.footballTransferScore=function(){
    let f=ensureFootball224(), t=state.talents||{};
    let ageBonus=state.age<18?8:state.age<25?12:state.age<31?6:-8;
    let injuryPenalty=f.injured?35:0;
    return Math.round((f.skill||0)*.30+(f.form||0)*.20+(f.coachTrust||0)*.14+(t.sport||0)*.16+(f.fame||0)*.16+(f.scout?12:0)+ageBonus-injuryPenalty+r224(-10,10));
  };
  try{footballTransferScore=window.footballTransferScore}catch(e){}

  window.footballApplyClub=function(mode){
    let f=ensureFootball224();
    let target=mode==='up'?nextLevel224(f.level):f.level;
    let score=footballTransferScore()-(mode==='up'?18:0);
    let chance=Math.max(8,Math.min(92,score));
    let roll=r224(1,100);
    if(roll<=chance){
      let old=f.club;
      f.level=canonicalLevel224(target);
      f.club=clubForLevel224(f.level, null);
      f.scout=false; f.form=clamp224((f.form||50)+r224(2,10)); f.coachTrust=clamp224(45+r224(0,22));
      f.salaryAnnual=salaryForLevel224(f.level,f.manager);
      f.salary=f.salaryAnnual; f.matchFee=0; f.contract=salaryRange224(f.level).contract;
      syncFootballJob224(false);
      closeModal();
      action224('Transfer',`${old?old+' liet me gaan. ':''}Ik kreeg een aanbod van ${f.club} en maakte de stap naar ${LEVEL_LABEL224[f.level]||f.level}. ${f.salaryAnnual?`Mijn jaarcontract werd ${money224(f.salaryAnnual)}/jaar.`:'Het bleef onbetaald/voor ervaring.'}`,{Happiness:12,Fitness:2},0,'good');
      return;
    }
    let near=roll<=chance+18;
    if(near){
      f.form=clamp224((f.form||50)+r224(-3,4)); f.coachTrust=clamp224((f.coachTrust||50)-r224(1,5));
      closeModal(); action224('Proeftraining',`Ik mocht meetrainen, maar de club twijfelde. Ze vonden mijn niveau nog net niet overtuigend genoeg.`,{Happiness:-3,Smarts:1,Stamina:-8},0,'warn');return;
    }
    f.form=clamp224((f.form||50)-r224(4,12)); f.coachTrust=clamp224((f.coachTrust||50)-r224(2,8));
    closeModal(); action224('Afwijzing',`Ik zocht een nieuwe club, maar kreeg een harde afwijzing.`,{Happiness:-8,Stamina:-4},0,'bad');
  };
  try{footballApplyClub=window.footballApplyClub}catch(e){}

  window.footballContractScreen=function(){
    let f=ensureFootball224();
    let managerTxt=f.manager?`${f.manager.name} · bonus ${f.manager.bonus}% · drama ${f.manager.drama}%`:'geen manager';
    let type=f.contract?'Jaarcontract / sportbaan':(f.salaryAnnual?'Jaarvergoeding':'Geen betaald contract');
    showModal(`<div class="modalTop"><div class="avatar">📄</div><div class="modalTitle">Contract & Manager</div></div><div class="modalBody"><div class="card"><b>Club:</b> ${f.club||'geen'}<br><b>Niveau:</b> ${LEVEL_LABEL224[f.level]||f.level}<br><b>Contracttype:</b> ${type}<br><b>Jaarsalaris/vergoeding:</b> ${money224(f.salaryAnnual||0)}/jaar<br><b>Per wedstrijd:</b> €0 basissalaris<br><b>Economy sync:</b> ${f.contract&&state.job?money224(state.job.grossAnnual||state.job.salary||0)+'/jaar via job':'geen sportbaan'}<br><b>Manager:</b> ${managerTxt}</div><button class="btn" onclick="footballHireManager('cheap')">Goedkope zaakwaarnemer (€300)</button><button class="btn" onclick="footballHireManager('solid')">Betrouwbare zaakwaarnemer (€1500)</button><button class="btn" onclick="footballHireManager('top')">Topmanager (€8000)</button><button class="btn" onclick="footballNegotiate()">💬 Contract onderhandelen</button><button class="btn alt" onclick="footballCareerScreen()">Terug</button></div>`);
  };
  try{footballContractScreen=window.footballContractScreen}catch(e){}

  window.footballNegotiate=function(){
    let f=ensureFootball224();
    if(!f.active||!f.club)return toast224('Geen club om mee te onderhandelen.');
    let chance=35+f.coachTrust*.25+f.fame*.25+(f.manager?f.manager.bonus:0);
    let ok=r224(1,100)<chance;
    if(ok){
      let current=Number(f.salaryAnnual||f.salary||salaryForLevel224(f.level,f.manager));
      let add=Math.max(200,Math.round(current*r224(8,28)/100));
      f.salaryAnnual=current+add; f.salary=f.salaryAnnual; f.matchFee=0;
      syncFootballJob224(false);
      closeModal(); action224('Contract',`Mijn onderhandeling lukte. Ik kreeg ${money224(add)} per jaar erbij.<br>Nieuw jaarcontract: ${money224(f.salaryAnnual)}/jaar.`,{Happiness:7},0,'good');
    }else{
      f.coachTrust=clamp224(f.coachTrust-r224(2,8));
      closeModal(); action224('Contract',`De club vond mijn eisen te hoog. De sfeer werd iets kouder.`,{Happiness:-4},0,'warn');
    }
  };
  try{footballNegotiate=window.footballNegotiate}catch(e){}

  window.footballYearly=function(){
    if(!state||state.dead)return;
    let f=ensureFootball224();
    if(!f.active)return;
    if(f.injured){
      f.injuryYears=Math.max(0,(f.injuryYears||1)-1);
      if(f.injuryYears<=0){f.injured=false;try{addLog('<b>Voetbal</b><br>Mijn blessure is hersteld. Ik kan weer spelen, maar mijn vorm moet terugkomen.','good',false)}catch(e){}}
      else try{addLog(`<b>Voetbal</b><br>Ik ben nog geblesseerd. Herstel duurt nog ${f.injuryYears} jaar.`, 'warn', false)}catch(e){}
    }
    f.form=clamp224(f.form+r224(-8,8));
    f.injuryRisk=clamp224(f.injuryRisk+r224(-4,5));
    // Annual money: only non-job stipends are paid here. Real contract salary is paid by job/economy.
    if(f.salaryAnnual && !f.contract){
      state.money=(state.money||0)+f.salaryAnnual;
      try{addLog(`<b>Voetbalvergoeding</b><br>Mijn club betaalde mijn jaarlijkse vergoeding: ${money224(f.salaryAnnual)}.`, 'good', false)}catch(e){}
    }
    if(f.contract)syncFootballJob224(false);
    if(f.manager&&Math.random()*100<f.manager.drama){
      try{addLog(`<b>Zaakwaarnemer</b><br>${f.manager.name} zorgde voor gedoe rond mijn contract.`, 'warn', false)}catch(e){}
      f.coachTrust=clamp224(f.coachTrust-r224(2,8));
    }
    if(f.matches>0&&state.age-(f.lastMediaAge??-99)>=2&&Math.random()<.18){
      f.lastMediaAge=state.age;
      let positive=f.form+f.fame+r224(0,70)>100;
      if(positive){f.fame=clamp224(f.fame+r224(3,9));try{addLog('<b>Media</b><br>Een lokale sportpagina schreef positief over mijn seizoen.', 'good', false)}catch(e){}}
      else{state.mental=state.mental||{};state.mental.stress=clamp224((state.mental.stress||0)+r224(3,8));try{addLog('<b>Media</b><br>Na een slechte reeks kreeg ik online kritiek.', 'warn', false)}catch(e){}}
    }
    footballMaybeProgress();
  };
  try{footballYearly=window.footballYearly}catch(e){}

  window.normalizeFootballContract163=function(){
    ensureFootball224();
  };

  window.footballClubSalaryDebug224=function(){
    const f=ensureFootball224();
    const valid=isValidClub224(f.club);
    showModal(`<div class="modalTop"><div class="avatar">⚽</div><div class="modalTitle">Football sync debug</div></div><div class="modalBody"><div class="card"><b>Club:</b> ${f.club||'geen'} ${valid?'✅':'❌'}<br><b>Niveau:</b> ${LEVEL_LABEL224[f.level]||f.level}<br><b>SalaryAnnual:</b> ${money224(f.salaryAnnual||0)}/jaar<br><b>MatchFee:</b> ${money224(f.matchFee||0)}<br><b>Contract:</b> ${f.contract?'ja':'nee'}<br><b>Job:</b> ${state.job?state.job.title+' · '+money224(state.job.grossAnnual||state.job.salary||0)+'/jaar':'geen'}<br><br>Wedstrijden betalen geen basissalaris. Salaris loopt via jaarcontract/job.</div><button class="btn" onclick="ensureFootball224();syncFootballJob224(true);safeSave();render();closeModal()">Repair football sync</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  const oldRender224 = window.render || (typeof render==='function'?render:null);
  if(oldRender224&&!oldRender224.__football224){
    window.render=function(){
      try{ensureFootball224()}catch(e){}
      return oldRender224.apply(this,arguments);
    };
    window.render.__football224=true; try{render=window.render}catch(e){}
  }
  const oldSafeSave224 = window.safeSave || (typeof safeSave==='function'?safeSave:null);
  if(oldSafeSave224&&!oldSafeSave224.__football224){
    window.safeSave=function(){
      try{ensureFootball224()}catch(e){}
      return oldSafeSave224.apply(this,arguments);
    };
    window.safeSave.__football224=true; try{safeSave=window.safeSave}catch(e){}
  }

  setTimeout(()=>{try{ensureFootball224();safeSave();render()}catch(e){}},300);
})();
