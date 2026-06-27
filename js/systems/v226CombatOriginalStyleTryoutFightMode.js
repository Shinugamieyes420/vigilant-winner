
/* v22.6 Combat Original Style + Tryout + Fight Mode Fix
   - replaces broken/click-problem fight UI with original BitzLife row/modal style
   - 50% discipline + 60% combat = guaranteed accepted at fight tryouts
   - two complete working routes: MMA/UFC and GLORY Kickboxing
   - syncs old state.combatSports and state.fightCareer with one stable state.combat226
*/
(function(){
  function clamp226(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r226(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick226(a){return a[Math.floor(Math.random()*a.length)]}
  function money226(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast226(t){try{toast(t)}catch(e){console.log(t)}}
  function stat226(stats){try{applyStats(stats||{})}catch(e){}}
  function saveRender226(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function action226(title,txt,stats={},cash=0,type='good'){
    try{return action(title,txt,stats,cash,type)}catch(e){
      if(cash)state.money=(state.money||0)+cash;
      stat226(stats);
      try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(_){}
      saveRender226();
    }
  }
  function rr226(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function section226(t){return `<div class="section">${t}</div>`}
  function card226(h){return `<div class="card">${h}</div>`}
  function modal226(icon,title,body){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="combatHub226()">Terug</button></div>`);
  }
  function bar226(v){try{return skillBar(clamp226(v))}catch(e){return `<div class="bar"><i style="width:${clamp226(v)}%"></i></div>`}}
  function age226(){return (state&&state.age)||0}
  function statVal226(name){
    const s=state||{};
    const st=s.stats||{};
    const t=s.talents||{};
    const cs=s.combatSports||{};
    const fc=s.fightCareer||{};
    if(name==='combat')return clamp226(Math.max(t.combat||0, t.fight||0, t.martialArts||0, cs.skill||0, fc.skill||0, s.combat||0));
    if(name==='discipline')return clamp226(Math.max(t.discipline||0, cs.discipline||0, fc.discipline||0, s.discipline||0, st.Discipline||0));
    if(name==='fitness')return clamp226(Math.max(s.fitness||0, st.Fitness||0, 50));
    if(name==='stamina')return clamp226(Math.max(s.stamina||0, st.Stamina||0, 50));
    if(name==='health')return clamp226(Math.max(st.Health||0, s.health||0, 50));
    return 0;
  }

  const ROUTES226 = {
    mma:{
      icon:'🥋',
      name:'MMA / UFC route',
      orgs:['Lokale MMA Gym','Amateur MMA Circuit','Regional MMA','Contender Series','UFC Prelims','UFC Main Card','UFC Ranked','UFC Title Fight'],
      choices:[
        ['jab','🥊','Striking openen','Veilig op punten, klein KO-kans'],
        ['grapple','🤼','Worstelen / grappling','Control en submission kans'],
        ['counter','🛡️','Counteren','Minder risico, slimme counters'],
        ['allin','🔥','Alles of niets','Grote finishkans, hoog risico']
      ]
    },
    glory:{
      icon:'🥊',
      name:'GLORY Kickboxing route',
      orgs:['Lokale Kickbox Gym','Amateur Kickboxing','Regionaal Kickboxing','GLORY Prelims','GLORY Ranked','GLORY Contender','GLORY Title Fight'],
      choices:[
        ['pressure','🔥','Druk zetten','Veel volume, veel stamina kwijt'],
        ['counter','🛡️','Counterstriken','Slim en minder risico'],
        ['lowkick','🦵','Low kicks','Benen slopen, late rondes sterker'],
        ['points','📋','Punten pakken','Veilig winnen via scorecards']
      ]
    }
  };
  const LEVELS226 = ['none','gym','amateur','regional','prospect','pro','ranked','contender','title','champion'];
  const LEVEL_LABEL226 = {
    none:'Geen route', gym:'Lokale gym', amateur:'Amateur', regional:'Regionaal', prospect:'Prospect', pro:'Pro prelims', ranked:'Ranked fighter', contender:'Contender', title:'Title fight', champion:'Champion'
  };

  function ensureCombat226(){
    state.combat226 = state.combat226 || {};
    const c=state.combat226;
    const oldCS=state.combatSports||{};
    const oldF=state.fightCareer||{};
    c.active = !!(c.active || oldCS.access?.gymJoined || oldF.active);
    c.route = c.route || oldCS.route || (oldF.level==='glory'?'glory':'mma');
    if(!ROUTES226[c.route]) c.route='mma';
    c.level = c.level || oldCS.level || oldF.level || (c.active?'gym':'none');
    if(['glory','mma'].includes(c.level)) c.level='gym';
    if(!LEVELS226.includes(c.level)) c.level='gym';
    c.skill = clamp226(c.skill ?? oldCS.skill ?? oldF.skill ?? statVal226('combat'));
    c.discipline = clamp226(c.discipline ?? statVal226('discipline'));
    c.form = clamp226(c.form ?? oldCS.form ?? oldF.form ?? 50);
    c.coachTrust = clamp226(c.coachTrust ?? oldCS.coachTrust ?? oldF.coachTrust ?? 45);
    c.fame = clamp226(c.fame ?? oldCS.fame ?? oldF.fame ?? 0);
    c.freshness = clamp226(c.freshness ?? oldCS.health?.freshness ?? oldF.recovery?.freshness ?? 65);
    c.injuryRisk = clamp226(c.injuryRisk ?? oldCS.health?.injuryRisk ?? oldF.injuryRisk ?? 12);
    c.wins = Number(c.wins ?? oldCS.record?.wins ?? oldF.wins ?? 0);
    c.losses = Number(c.losses ?? oldCS.record?.losses ?? oldF.losses ?? 0);
    c.kos = Number(c.kos ?? oldF.kos ?? 0);
    c.subs = Number(c.subs ?? oldF.subs ?? 0);
    c.salaryAnnual = Number(c.salaryAnnual ?? oldF.salary ?? oldF.contract?.baseSalary ?? 0);
    c.contract = c.contract || oldF.contract || null;
    c.tryoutHistory = c.tryoutHistory || [];
    c.trainingThisYear = c.trainingThisYear || 0;
    c.injured = Number(c.injured ?? oldF.injured ?? 0);

    // Sync old systems so old buttons/saves do not split into separate careers.
    state.combatSports = state.combatSports || {};
    state.combatSports.route = c.route;
    state.combatSports.level = c.level;
    state.combatSports.skill = c.skill;
    state.combatSports.form = c.form;
    state.combatSports.coachTrust = c.coachTrust;
    state.combatSports.fame = c.fame;
    state.combatSports.record = {wins:c.wins, losses:c.losses};
    state.combatSports.health = state.combatSports.health || {};
    state.combatSports.health.freshness = c.freshness;
    state.combatSports.health.injuryRisk = c.injuryRisk;
    state.combatSports.access = state.combatSports.access || {};
    state.combatSports.access.gymJoined = c.active;
    state.combatSports.access.sparringApproved = c.skill>=25 || c.coachTrust>=50;
    state.combatSports.access.amateurDebut = ['amateur','regional','prospect','pro','ranked','contender','title','champion'].includes(c.level);

    state.fightCareer = state.fightCareer || {};
    state.fightCareer.active = c.active;
    state.fightCareer.level = c.route;
    state.fightCareer.org = c.route==='glory'?'GLORY / Kickboxing':'MMA / UFC';
    state.fightCareer.skill = c.skill;
    state.fightCareer.form = c.form;
    state.fightCareer.coachTrust = c.coachTrust;
    state.fightCareer.fame = c.fame;
    state.fightCareer.wins = c.wins;
    state.fightCareer.losses = c.losses;
    state.fightCareer.injuryRisk = c.injuryRisk;
    state.fightCareer.injured = c.injured;
    state.fightCareer.salary = c.salaryAnnual;
    state.fightCareer.contract = c.contract;
    return c;
  }
  window.ensureCombat226=ensureCombat226;

  function combatOverview226(){
    const c=ensureCombat226();
    const route=ROUTES226[c.route];
    const guaranteed = statVal226('discipline')>=50 && statVal226('combat')>=60;
    let h=card226(`${route.icon} <b>${route.name}</b><br>
      Niveau: ${LEVEL_LABEL226[c.level]||c.level}<br>
      Record: ${c.wins}-${c.losses} · KO ${c.kos} · SUB ${c.subs}<br>
      Combat skill: ${c.skill}% ${bar226(c.skill)}
      Discipline: ${c.discipline}% ${bar226(c.discipline)}
      Form: ${c.form}% ${bar226(c.form)}
      Coach trust: ${c.coachTrust}% ${bar226(c.coachTrust)}
      Freshness: ${c.freshness}% ${bar226(c.freshness)}
      Blessurerisico: ${c.injuryRisk}% ${bar226(c.injuryRisk)}
      ${c.injured>0?`<br><span style="color:#ff7669"><b>Geblesseerd:</b> ${c.injured} jaar herstel</span>`:''}
      <br><span class="mini">Try-out hard rule: discipline 50% + combat 60% = automatisch aangenomen. Jouw status: ${guaranteed?'✅ gegarandeerd':'❌ nog kansberekening'}</span>`);
    return h;
  }

  window.combatHub226=function(){
    const c=ensureCombat226();
    let h=combatOverview226();
    h+=section226('Route & toegang');
    h+=rr226('🧭','Route kiezen',ROUTES226[c.route].name,'combatRouteMenu226()');
    h+=rr226('📝','Fight try-outs','Gym/amateur/prospect toelating op basis van combat + discipline','combatTryoutMenu226()');
    h+=section226('Training & fight mode');
    h+=rr226('🏋️','Training camp','Techniek, cardio, sparring en discipline trainen','combatTrainingMenu226()',age226()<12);
    h+=rr226('🥊','Fight Mode / Fight Night','Originele-style 3-ronde fight met keuzes','combatFightStart226()',!c.active || c.injured>0 || c.freshness<25);
    h+=rr226('📈','Hoger niveau zoeken','Promotie naar amateur/regional/pro/ranked/title','combatLevelUp226()',!c.active);
    h+=section226('Herstel & carrière');
    h+=rr226('🩹','Herstel & blessurepreventie','Rust, fysio, medische check en camp pauze','combatRecoveryMenu226()',!c.active);
    h+=rr226('📄','Contract / status','Bekijk salaris, route, contract en synchronisatie','combatContract226()',!c.active);
    h+=rr226('🚪','Stoppen met fight career','Carrière beëindigen','combatRetire226()',!c.active);
    showModal(`<div class="modalTop"><div class="avatar">🥊</div><div class="modalTitle">Combat Sports</div></div><div class="modalBody">${h}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  try{combatSportsHub184=window.combatHub226; fightCareerScreen=window.combatHub226; gloryUfcCareerScreen=window.combatHub226; combatCareerHub177=window.combatHub226}catch(e){}
  window.combatSportsHub184=window.combatHub226;
  window.fightCareerScreen=window.combatHub226;
  window.gloryUfcCareerScreen=window.combatHub226;
  window.combatCareerHub177=window.combatHub226;

  window.combatRouteMenu226=function(){
    let h=combatOverview226();
    h+=section226('Routes');
    h+=rr226('🥋','MMA / UFC route','Striking, worstelen, grappling en submissions','combatSetRoute226("mma")');
    h+=rr226('🥊','GLORY Kickboxing route','Stand-up, low kicks, counteren en punten pakken','combatSetRoute226("glory")');
    modal226('🧭','Combat route kiezen',h);
  };
  window.combatSetRoute226=function(route){
    const c=ensureCombat226();
    c.route=ROUTES226[route]?route:'mma';
    c.active=true;
    if(c.level==='none')c.level='gym';
    action226('Combat route',`Ik koos ${ROUTES226[c.route].name}.`,{Happiness:3,Smarts:1},0,'good');
    saveRender226();
    combatHub226();
  };

  function tryoutChance226(target){
    const combat=statVal226('combat'), discipline=statVal226('discipline'), fit=statVal226('fitness'), stam=statVal226('stamina'), health=statVal226('health');
    const c=ensureCombat226();
    if(discipline>=50 && combat>=60) return {chance:100, guaranteed:true, reason:'discipline 50% + combat 60% gehaald'};
    const diff={gym:20,amateur:42,regional:58,prospect:68,pro:78}[target]||35;
    let chance = Math.round(combat*.42 + discipline*.30 + fit*.12 + stam*.08 + health*.08 + c.form*.08 + c.coachTrust*.05 - diff + 35);
    return {chance:clamp226(chance,5,95), guaranteed:false, reason:'kansberekening'};
  }
  window.combatTryoutMenu226=function(){
    const c=ensureCombat226();
    const rows=[
      ['gym','🏚️','Lokale fight gym','Start route en krijg toegang tot trainen'],
      ['amateur','🥉','Amateur try-out','Toegang tot amateurdebuut'],
      ['regional','🥈','Regionaal team','Hoger niveau met betere tegenstanders'],
      ['prospect','🥇','Pro prospect try-out','Serieuze pro-aandacht'],
      ['pro','🏆','UFC/GLORY prelim try-out','Professionele stap']
    ];
    let h=card226(`<b>Try-out regels</b><br>Discipline: ${statVal226('discipline')}%<br>Combat: ${statVal226('combat')}%<br><br><b>Hard rule:</b> bij discipline 50% en combat 60% word je sowieso aangenomen.`);
    h+=section226('Fight try-outs');
    rows.forEach(x=>{
      const ch=tryoutChance226(x[0]);
      const locked = age226()<12 || (x[0]==='pro' && !['prospect','pro','ranked','contender','title','champion'].includes(c.level));
      h+=rr226(x[1],x[2],`${x[3]} · kans ${ch.chance}%${ch.guaranteed?' · gegarandeerd':''}`,`combatTryout226('${x[0]}')`,locked);
    });
    modal226('📝','Fight try-outs',h);
  };
  window.combatTryout226=function(target){
    const c=ensureCombat226();
    if(age226()<12)return toast226('Fight gym/try-outs kan vanaf 12 jaar.');
    const ch=tryoutChance226(target);
    const ok = ch.guaranteed || r226(1,100)<=ch.chance;
    c.tryoutHistory.push({age:age226(), target, chance:ch.chance, ok});
    c.active=true;
    if(ok){
      c.level=target==='gym'?'gym':target;
      c.skill=clamp226(Math.max(c.skill, statVal226('combat')) + r226(2,8));
      c.discipline=clamp226(Math.max(c.discipline, statVal226('discipline')) + r226(1,5));
      c.form=clamp226(c.form+r226(4,12));
      c.coachTrust=clamp226(Math.max(c.coachTrust,45)+r226(4,14));
      if(['pro','prospect'].includes(target)){
        c.salaryAnnual = target==='pro'?r226(18000,65000):r226(3500,12000);
        c.contract = {org:c.route==='glory'?'GLORY':'Regional MMA', level:target, baseSalary:c.salaryAnnual, yearsLeft:2};
      }
      closeModal();
      action226('Fight try-out',`Ik deed try-out voor ${LEVEL_LABEL226[target]||target}. Ik werd aangenomen.${ch.guaranteed?' Mijn combat/discipline waren sterk genoeg, dus dit was gegarandeerd.':` Kans was ${ch.chance}%.`}`,{Happiness:10,Fitness:2,Stamina:-8},0,'good');
    }else{
      c.form=clamp226(c.form-r226(2,8));
      c.discipline=clamp226(c.discipline+r226(1,3));
      closeModal();
      action226('Fight try-out',`Ik deed try-out, maar werd niet aangenomen. Kans was ${ch.chance}%. Train combat en discipline.`,{Happiness:-5,Smarts:1,Stamina:-8},0,'warn');
    }
    saveRender226();
  };

  window.combatTrainingMenu226=function(){
    const c=ensureCombat226();
    if(!c.active)return toast226('Doe eerst een try-out of word lid van een fight gym.');
    let h=combatOverview226();
    h+=section226('Training');
    h+=rr226('🥊','Techniektraining','Skill omhoog, laag risico','combatTrain226("tech")');
    h+=rr226('🏃','Cardio / conditie','Form en stamina omhoog, iets meer belasting','combatTrain226("cardio")');
    h+=rr226('🧤','Lichte sparring','Fight IQ en skill, matig risico','combatTrain226("light")',c.injuryRisk>80);
    h+=rr226('🔥','Harde sparring','Snelle groei maar hoog blessurerisico','combatTrain226("hard")',c.injuryRisk>65 || c.freshness<35);
    h+=rr226('🧘','Discipline / gameplan','Discipline en coach trust omhoog, risico omlaag','combatTrain226("discipline")');
    modal226('🏋️','Training camp',h);
  };
  window.combatTrain226=function(kind){
    const c=ensureCombat226();
    if(!c.active)return toast226('Start eerst je fight career.');
    if(c.injured>0 && kind!=='discipline')return toast226('Je bent geblesseerd. Kies herstel of gameplan.');
    let txt='',stats={},type='good';
    if(kind==='tech'){
      c.skill=clamp226(c.skill+r226(4,8)); c.form=clamp226(c.form+r226(1,4)); c.freshness=clamp226(c.freshness-r226(5,10)); c.injuryRisk=clamp226(c.injuryRisk+r226(1,4));
      txt='Ik deed techniektraining. Minder show, meer echte fundamentals.'; stats={Fitness:2,Stamina:-6,Smarts:1};
    }
    if(kind==='cardio'){
      c.form=clamp226(c.form+r226(5,10)); c.freshness=clamp226(c.freshness-r226(8,14)); c.injuryRisk=clamp226(c.injuryRisk+r226(2,6));
      txt='Ik deed cardio en conditiewerk. Zwaar, maar nuttig voor de latere rondes.'; stats={Fitness:4,Health:2,Stamina:-10};
    }
    if(kind==='light'){
      c.skill=clamp226(c.skill+r226(3,7)); c.form=clamp226(c.form+r226(2,6)); c.coachTrust=clamp226(c.coachTrust+r226(2,5)); c.freshness=clamp226(c.freshness-r226(10,16)); c.injuryRisk=clamp226(c.injuryRisk+r226(4,9));
      txt='Ik deed lichte sparring en leerde timing zonder dom te forceren.'; stats={Fitness:3,Health:-1,Stamina:-12};
    }
    if(kind==='hard'){
      c.skill=clamp226(c.skill+r226(5,12)); c.form=clamp226(c.form+r226(2,8)); c.coachTrust=clamp226(c.coachTrust+r226(0,6)); c.freshness=clamp226(c.freshness-r226(16,26)); c.injuryRisk=clamp226(c.injuryRisk+r226(12,24));
      txt='Ik ging hard sparren. Ik werd beter, maar mijn lichaam kreeg klappen.'; stats={Fitness:4,Health:-4,Stamina:-18}; type='warn';
      if(Math.random()<0.10+(c.injuryRisk/500)){c.injured=1;txt+=' Ik liep ook een blessure op.'; stats.Health=(stats.Health||0)-8; type='bad';}
    }
    if(kind==='discipline'){
      c.discipline=clamp226(c.discipline+r226(5,10)); c.coachTrust=clamp226(c.coachTrust+r226(3,7)); c.injuryRisk=clamp226(c.injuryRisk-r226(4,9)); c.freshness=clamp226(c.freshness+r226(1,5));
      state.talents=state.talents||{}; state.talents.discipline=clamp226(Math.max(state.talents.discipline||0,c.discipline));
      txt='Ik werkte aan discipline, gameplan en rust. Geen ego, wel progressie.'; stats={Smarts:2,Happiness:2,Stamina:2};
    }
    state.talents=state.talents||{};
    state.talents.combat=clamp226(Math.max(state.talents.combat||0,c.skill));
    c.trainingThisYear++;
    closeModal();
    action226('Combat training',txt,stats,0,type);
    saveRender226();
  };

  function canFight226(c){
    if(!c.active)return 'Start eerst je fight career.';
    if(c.injured>0)return 'Je bent geblesseerd.';
    if(c.freshness<25)return 'Te weinig freshness. Herstel eerst.';
    if(c.injuryRisk>88)return 'Blessurerisico extreem hoog. Herstel eerst.';
    if(!['amateur','regional','prospect','pro','ranked','contender','title','champion'].includes(c.level))return 'Je bent nog niet klaar voor wedstrijden. Doe try-out of level up.';
    return '';
  }
  window.combatFightStart226=function(){
    const c=ensureCombat226();
    const deny=canFight226(c);
    if(deny)return toast226(deny);
    const route=ROUTES226[c.route];
    const oppLevel = c.level==='champion'?90:c.level==='title'?82:c.level==='contender'?76:c.level==='ranked'?70:c.level==='pro'?64:c.level==='prospect'?58:c.level==='regional'?50:42;
    c.currentFight226 = {
      round:1, playerScore:0, oppScore:0, playerHP:100, oppHP:100,
      opponent:`${pick226(['Rico','Dante','Miguel','Kenji','Jay','Marco','Ivan','Carlos','Nordin','Alex'])} ${pick226(['Storm','Silva','Tanaka','King','Hunt','Vega','Bones','Santos','Kara','Blade'])}`,
      oppSkill:clamp226(oppLevel+r226(-8,10)),
      log:[]
    };
    let h=card226(`${route.icon} <b>Fight Night</b><br>Tegenstander: ${c.currentFight226.opponent}<br>Ronde 1 van 3<br>Jij HP 100 · Tegenstander HP 100<br><span class="mini">Kies per ronde een gameplan. Alles is klikbaar in originele stijl.</span>`);
    h+=section226('Gameplan ronde 1');
    route.choices.forEach(ch=>{h+=rr226(ch[1],ch[2],ch[3],`combatFightChoice226('${ch[0]}')`)});
    showModal(`<div class="modalTop"><div class="avatar">🥊</div><div class="modalTitle">Fight Mode</div></div><div class="modalBody">${h}<button class="btn alt" onclick="combatHub226()">Stop / terug</button></div>`);
  };
  window.combatFightChoice226=function(choice){
    const c=ensureCombat226(), f=c.currentFight226;
    if(!f)return combatFightStart226();
    const route=ROUTES226[c.route];
    const skill=c.skill, form=c.form, disc=c.discipline, fresh=c.freshness;
    let power=skill*.38+form*.20+disc*.16+fresh*.10+c.coachTrust*.08+r226(-18,22);
    let risk=8;
    let desc='';
    if(choice==='jab'||choice==='points'){power+=5;risk-=2;desc='Ik vocht slim op punten.'}
    if(choice==='grapple'){power+=disc*.10;risk+=3;desc='Ik zocht grappling en controle.'}
    if(choice==='counter'){power+=disc*.08;risk-=5;desc='Ik wachtte op counters.'}
    if(choice==='allin'){power+=18;risk+=18;desc='Ik ging alles of niets.'}
    if(choice==='pressure'){power+=14;risk+=10;desc='Ik zette druk met volume.'}
    if(choice==='lowkick'){power+=f.round>=2?18:7;risk+=4;desc='Ik werkte met low kicks.'}
    const opp= f.oppSkill + r226(-15,20);
    const margin=power-opp;
    let playerDmg=0, oppDmg=0, playerPts=0, oppPts=0, line='';
    if(margin>20){oppDmg=r226(22,38);playerDmg=r226(2,10);playerPts=10;oppPts=8;line=`${desc} Ik won de ronde duidelijk.`}
    else if(margin>5){oppDmg=r226(12,24);playerDmg=r226(5,15);playerPts=10;oppPts=9;line=`${desc} Ik pakte de ronde nipt.`}
    else if(margin>-8){oppDmg=r226(7,17);playerDmg=r226(7,17);playerPts=10;oppPts=10;line=`${desc} De ronde was close.`}
    else{oppDmg=r226(3,10);playerDmg=r226(14,28);playerPts=8;oppPts=10;line=`${desc} Ik verloor de ronde.`}
    if(choice==='allin' && Math.random()<0.12+(skill/500)){oppDmg+=45;line+=' Ik raakte hem bijna perfect.'}
    if(Math.random()*100<risk+(c.injuryRisk*.12)){playerDmg+=r226(5,18);c.injuryRisk=clamp226(c.injuryRisk+r226(2,8));}
    f.playerHP=clamp226(f.playerHP-playerDmg,0,100);
    f.oppHP=clamp226(f.oppHP-oppDmg,0,100);
    f.playerScore+=playerPts;
    f.oppScore+=oppPts;
    f.log.push(`R${f.round}: ${line} Schade: jij -${playerDmg}, opponent -${oppDmg}.`);
    if(f.oppHP<=0 || f.playerHP<=0 || f.round>=3){
      combatFightFinish226();
      return;
    }
    f.round++;
    let h=card226(`<b>Ronde ${f.round} van 3</b><br>Jij HP ${f.playerHP} · Tegenstander HP ${f.oppHP}<br>Score: ${f.playerScore}-${f.oppScore}<br><span class="mini">${f.log[f.log.length-1]}</span>`);
    h+=section226(`Gameplan ronde ${f.round}`);
    route.choices.forEach(ch=>{h+=rr226(ch[1],ch[2],ch[3],`combatFightChoice226('${ch[0]}')`)});
    showModal(`<div class="modalTop"><div class="avatar">🥊</div><div class="modalTitle">Fight Mode</div></div><div class="modalBody">${h}<button class="btn alt" onclick="combatHub226()">Stop / terug</button></div>`);
  };
  window.combatFightFinish226=function(){
    const c=ensureCombat226(), f=c.currentFight226;
    if(!f)return combatHub226();
    let win=false, method='decision';
    if(f.oppHP<=0){win=true;method='KO/TKO';c.kos++;}
    else if(f.playerHP<=0){win=false;method='TKO verlies';}
    else win=f.playerScore>=f.oppScore;
    if(c.route==='mma' && win && method==='decision' && Math.random()<0.10+(c.discipline/500)){method='submission';c.subs++;}
    if(win){c.wins++;c.fame=clamp226(c.fame+r226(3,10));c.form=clamp226(c.form+r226(4,12));c.coachTrust=clamp226(c.coachTrust+r226(4,10));}
    else{c.losses++;c.form=clamp226(c.form-r226(4,12));c.coachTrust=clamp226(c.coachTrust-r226(2,8));}
    c.freshness=clamp226(c.freshness-r226(15,25));
    c.injuryRisk=clamp226(c.injuryRisk+r226(8,18));
    let inj='';
    if(Math.random()<0.04+(c.injuryRisk/450) || f.playerHP<25){
      c.injured=Math.max(c.injured||0,1);
      inj='<br><span style="color:#ff7669">Ik liep een blessure op. Herstel is nodig.</span>';
    }
    const text=`${win?'Ik won':'Ik verloor'} via ${method}.<br>${f.log.join('<br>')}${inj}<br><span class="mini">Fight mode werkt nu via 3 klikbare rondes in originele stijl.</span>`;
    c.currentFight226=null;
    closeModal();
    action226('Fight Night',text,{Happiness:win?10:-7,Fitness:2,Health:win?-3:-8,Stamina:-18},0,win?'good':'bad');
    combatMaybeProgress226();
    saveRender226();
  };

  window.combatMaybeProgress226=function(){
    const c=ensureCombat226();
    const score=c.skill+c.form+c.coachTrust+c.fame+(c.wins*8)-(c.losses*5);
    const old=c.level;
    if(c.level==='amateur' && c.wins>=2 && score>190)c.level='regional';
    else if(c.level==='regional' && c.wins>=4 && score>240)c.level='prospect';
    else if(c.level==='prospect' && c.wins>=6 && score>285){c.level='pro';c.salaryAnnual=r226(18000,70000);c.contract={org:c.route==='glory'?'GLORY':'Regional MMA',level:'pro',baseSalary:c.salaryAnnual,yearsLeft:2};}
    else if(c.level==='pro' && c.wins>=8 && c.fame>25 && score>325)c.level='ranked';
    else if(c.level==='ranked' && c.wins>=11 && c.fame>40 && score>365)c.level='contender';
    else if(c.level==='contender' && c.wins>=13 && c.fame>55 && score>400)c.level='title';
    else if(c.level==='title' && c.wins>=14 && score>420)c.level='champion';
    if(old!==c.level){
      try{addLog(`<b>Combat level up</b><br>${LEVEL_LABEL226[old]} → ${LEVEL_LABEL226[c.level]}.`, 'good', false)}catch(e){}
    }
  };
  window.combatLevelUp226=function(){
    const c=ensureCombat226();
    if(!c.active)return toast226('Start eerst je fight career.');
    const before=c.level;
    combatMaybeProgress226();
    if(before===c.level){
      const needed='Train skill/form/discipline, win fights en bouw fame/coach trust.';
      toast226('Nog niet genoeg voor hoger niveau. '+needed);
    }else{
      combatHub226();
    }
  };

  window.combatRecoveryMenu226=function(){
    const c=ensureCombat226();
    let h=combatOverview226();
    h+=section226('Herstel');
    h+=rr226('😴','Rustweek','Freshness omhoog, blessurerisico omlaag','combatRecover226("rest")');
    h+=rr226('🧘','Mobiliteit + lichte techniek','Klein skill plusje, veilig herstel','combatRecover226("mobility")');
    h+=rr226('🧊','Fysio / ijsbad',`${money226(180)} · blessurerisico flink omlaag`,'combatRecover226("physio")',(state.money||0)<180);
    h+=rr226('🏥','Medische check',`${money226(650)} · blessure sneller herstellen`,'combatRecover226("medical")',(state.money||0)<650);
    h+=rr226('📆','Fight camp pauzeren','Veel herstel, vorm iets minder','combatRecover226("pause")');
    modal226('🩹','Herstel & blessurepreventie',h);
  };
  window.combatRecover226=function(kind){
    const c=ensureCombat226();
    let txt='',stats={Health:3,Stamina:5,Happiness:1},cost=0,type='good';
    if(kind==='rest'){c.freshness=clamp226(c.freshness+r226(18,30));c.injuryRisk=clamp226(c.injuryRisk-r226(8,18));txt='Ik nam rust. Mijn lichaam voelde minder gesloopt.';stats={Health:4,Stamina:15,Happiness:2};}
    if(kind==='mobility'){c.freshness=clamp226(c.freshness+r226(8,16));c.injuryRisk=clamp226(c.injuryRisk-r226(5,12));c.skill=clamp226(c.skill+r226(1,3));txt='Ik deed mobiliteit en lichte techniek. Veilig en nuttig.';stats={Health:2,Stamina:7,Smarts:1};}
    if(kind==='physio'){cost=180;if((state.money||0)<cost)return toast226('Niet genoeg geld.');state.money-=cost;c.freshness=clamp226(c.freshness+r226(12,22));c.injuryRisk=clamp226(c.injuryRisk-r226(14,28));if(c.injured>0&&Math.random()<0.5)c.injured--;txt='Fysio en ijsbad hielpen mijn herstel.';stats={Health:6,Stamina:8};}
    if(kind==='medical'){cost=650;if((state.money||0)<cost)return toast226('Niet genoeg geld.');state.money-=cost;c.injuryRisk=clamp226(c.injuryRisk-r226(22,40));c.freshness=clamp226(c.freshness+r226(8,16));if(c.injured>0)c.injured--;txt='De medische check gaf duidelijkheid en herstelplan.';stats={Health:8,Smarts:2};}
    if(kind==='pause'){c.freshness=clamp226(c.freshness+r226(28,40));c.injuryRisk=clamp226(c.injuryRisk-r226(18,30));c.form=clamp226(c.form-r226(0,5));if(c.injured>0)c.injured--;txt='Ik pauzeerde fight camp. Minder vorm, maar veel meer herstel.';stats={Health:7,Stamina:20,Happiness:-1};type='warn';}
    closeModal();
    action226('Herstel',txt,stats,0,type);
    saveRender226();
  };

  window.combatContract226=function(){
    const c=ensureCombat226();
    const contract=c.contract?`${c.contract.org||ROUTES226[c.route].name} · ${c.contract.level||c.level} · ${money226(c.contract.baseSalary||c.salaryAnnual||0)}/jaar · ${c.contract.yearsLeft||1} jr`:'geen contract';
    let h=card226(`<b>Route:</b> ${ROUTES226[c.route].name}<br><b>Niveau:</b> ${LEVEL_LABEL226[c.level]||c.level}<br><b>Record:</b> ${c.wins}-${c.losses}<br><b>Contract:</b> ${contract}<br><b>Salaris:</b> ${money226(c.salaryAnnual||0)}/jaar<br><span class="mini">Fight career is nu gesynchroniseerd met oude combatSports/fightCareer data.</span>`);
    h+=section226('Acties');
    h+=rr226('💬','Contract onderhandelen','Alleen logisch bij pro/prospect niveau','combatNegotiate226()',!['prospect','pro','ranked','contender','title','champion'].includes(c.level));
    modal226('📄','Contract / status',h);
  };
  window.combatNegotiate226=function(){
    const c=ensureCombat226();
    if(!['prospect','pro','ranked','contender','title','champion'].includes(c.level))return toast226('Je hebt nog geen serieuze contractpositie.');
    let base=c.salaryAnnual||r226(3500,18000);
    let chance=35+c.fame*.35+c.wins*3+c.coachTrust*.15;
    if(Math.random()*100<chance){
      let add=Math.round(base*r226(8,25)/100);
      c.salaryAnnual=base+add;
      c.contract={org:c.route==='glory'?'GLORY':'MMA Promotion',level:c.level,baseSalary:c.salaryAnnual,yearsLeft:2};
      closeModal();action226('Contract',`Mijn onderhandeling lukte. Nieuw salaris: ${money226(c.salaryAnnual)}/jaar.`,{Happiness:6},0,'good');
    }else{
      c.coachTrust=clamp226(c.coachTrust-r226(2,6));
      closeModal();action226('Contract',`De promotie vond mijn eisen te hoog.`,{Happiness:-3},0,'warn');
    }
  };
  window.combatRetire226=function(){
    const c=ensureCombat226();
    c.active=false;c.level='none';c.contract=null;c.salaryAnnual=0;c.currentFight226=null;
    state.combatSports=state.combatSports||{};state.combatSports.access={};
    state.fightCareer=state.fightCareer||{};state.fightCareer.active=false;
    closeModal();action226('Fight career',`Ik stopte met mijn fight career.`,{Happiness:1},0,'warn');
  };

  // Redirect older functions/buttons into the new complete system.
  window.combatAction184=function(action){
    if(action==='join')return combatTryout226('gym');
    if(action==='technique')return combatTrain226('tech');
    if(action==='cardio')return combatTrain226('cardio');
    if(action==='light')return combatTrain226('light');
    if(action==='hard')return combatTrain226('hard');
    if(action==='fight')return combatFightStart226();
    if(action==='levelup')return combatLevelUp226();
    if(action==='recovery')return combatRecoveryMenu226();
    return combatHub226();
  };
  window.combatAdvanced184=window.combatFightStart226;
  window.combatOldGlory184=window.combatHub226;
  window.fightRecoveryScreen183=window.combatRecoveryMenu226;
  window.fightTryout118=function(route){return combatSetRoute226(route==='kickbox'?'glory':'mma') || combatTryoutMenu226()};
  window.fightTrain118=function(kind){
    const map={tech:'tech',cardio:'cardio',spar:'light',discipline:'discipline'};
    return combatTrain226(map[kind]||'tech');
  };
  window.fightMatch118=window.combatFightStart226;
  window.fightLevelUp118=window.combatLevelUp226;
  window.fightManager118=window.combatContract226;
  window.fightRetire118=window.combatRetire226;

  const oldMaster226=window.masterActivities204||null;
  if(oldMaster226&&!oldMaster226.__combat226){
    window.masterActivities204=function(){
      let html=oldMaster226.apply(this,arguments);
      if(!String(html).includes('combatHub226')){
        html=String(html).replace('<div class="section">Activiteiten</div>','<div class="section">Activiteiten</div>'+rr226('🥊','Combat Sports','MMA/UFC + GLORY, try-outs, training en Fight Mode','combatHub226()',age226()<12));
      }
      return html;
    };
    window.masterActivities204.__combat226=true;
    window.activitiesHTML=function(){return window.masterActivities204()};
    try{activitiesHTML=window.activitiesHTML}catch(e){}
  }

  const oldRender226=window.render||(typeof render==='function'?render:null);
  if(oldRender226&&!oldRender226.__combat226){
    window.render=function(){try{ensureCombat226()}catch(e){}return oldRender226.apply(this,arguments)};
    window.render.__combat226=true;try{render=window.render}catch(e){}
  }
  const oldSave226=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave226&&!oldSave226.__combat226){
    window.safeSave=function(){try{ensureCombat226()}catch(e){}return oldSave226.apply(this,arguments)};
    window.safeSave.__combat226=true;try{safeSave=window.safeSave}catch(e){}
  }

  window.combatDebug226=function(){
    const c=ensureCombat226();
    showModal(`<div class="modalTop"><div class="avatar">🛠️</div><div class="modalTitle">Combat debug v22.6</div></div><div class="modalBody"><div class="card"><b>active:</b> ${c.active}<br><b>route:</b> ${c.route}<br><b>level:</b> ${c.level}<br><b>combat:</b> ${statVal226('combat')}%<br><b>discipline:</b> ${statVal226('discipline')}%<br><b>guaranteed tryout:</b> ${statVal226('discipline')>=50&&statVal226('combat')>=60?'ja':'nee'}<br><b>click style:</b> originele rows/modals</div><button class="btn" onclick="combatHub226()">Open Combat hub</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{try{ensureCombat226();safeSave();render()}catch(e){}},300);
})();
