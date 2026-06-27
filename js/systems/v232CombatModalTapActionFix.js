
/* v23.2 Combat Modal Tap Action Fix
   Problem: combat rows could visually click on mobile but old inline onclick / modal overlays did not always execute.
   Fix: render combat rows with data-action and attach one delegated pointer/touch/click handler to #modal.
   This bypasses dead inline handlers and old mixed combat screens.
*/
(function(){
  const ACTION_ATTR='data-combat-action-232';

  function clamp232(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r232(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function money232(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast232(t){try{toast(t)}catch(e){console.log(t)}}
  function apply232(s){try{applyStats(s||{})}catch(e){}}
  function saveRender232(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function card232(h){return `<div class="card">${h}</div>`}
  function sec232(t){return `<div class="section">${t}</div>`}
  function modal232(icon,title,body,backAction='close'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody v232CombatBody">${body}<button class="btn alt" ${ACTION_ATTR}="${backAction}">Terug</button></div>`);
    setTimeout(bindCombatClicks232,0);
  }
  function cRow232(icon,title,sub,action,locked=false){
    return `<div class="row ${locked?'locked':''}" ${locked?'':`${ACTION_ATTR}="${action}"`} role="button" tabindex="0">
      <div class="rIco">${icon}</div>
      <div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div>
      <div class="chev">›</div>
    </div>`;
  }
  function result232(icon,title,txt,stats={},cash=0,type='good',back='hub'){
    if(cash)state.money=(state.money||0)+cash;
    apply232(stats);
    try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(e){}
    saveRender232();
    modal232(icon,title,card232(`${txt}<br><br><span class="mini">✅ Verwerkt. Tik terug om verder te gaan.</span>`),back);
  }
  function bar232(v){v=clamp232(v);return `<div class="miniBar"><div class="miniFill ${v<30?'low':''}" style="width:${v}%"></div></div>`}
  function stat232(k){
    const s=state||{}, st=s.stats||{}, t=s.talents||{}, c=s.combat232||s.combat229||s.combat226||{}, cs=s.combatSports||{}, fc=s.fightCareer||{};
    if(k==='combat')return clamp232(Math.max(t.combat||0,t.fight||0,t.martialArts||0,c.skill||0,cs.skill||0,fc.skill||0,s.combat||0));
    if(k==='discipline')return clamp232(Math.max(t.discipline||0,c.discipline||0,cs.discipline||0,fc.discipline||0,st.Discipline||0,s.discipline||0));
    if(k==='fitness')return clamp232(Math.max(s.fitness||0,st.Fitness||0,50));
    if(k==='stamina')return clamp232(Math.max(s.stamina||0,st.Stamina||0,50));
    if(k==='health')return clamp232(Math.max(st.Health||0,s.health||0,50));
    return 0;
  }

  const LEVELS232=['none','gym','amateur','semipro','regional','prospect','pro','ranked','contender','title','champion'];
  const LABEL232={none:'Geen route',gym:'Lokale gym',amateur:'Amateur',semipro:'Semi-pro',regional:'Regionaal',prospect:'Prospect',pro:'Pro',ranked:'Ranked',contender:'Contender',title:'Title fight',champion:'Champion'};
  function norm232(l){
    l=String(l||'none').toLowerCase();
    if(['trial','local_gym','local gym','ufc','glory','mma','kickboxing'].includes(l))return 'gym';
    if(['semi','semi-pro','semi_pro'].includes(l))return 'semipro';
    if(!LEVELS232.includes(l))return 'gym';
    return l;
  }
  function ensureCombat232(){
    state.combat232=state.combat232||{};
    const c=state.combat232, a=state.combat229||state.combat226||{}, cs=state.combatSports||{}, fc=state.fightCareer||{};
    c.route=(String(c.route||a.route||cs.route||fc.level||'mma').includes('glory')||String(c.route||'').includes('kick'))?'glory':'mma';
    c.active=!!(c.active||a.active||cs.active||cs.access?.gymJoined||cs.access?.gymMember||fc.active);
    let lvl=c.level||a.level||cs.level||fc.combatLevel||fc.stage||'none';
    if(cs.access?.amateurDebut && ['none','gym'].includes(norm232(lvl)))lvl='amateur';
    if(fc.active && ['none','gym'].includes(norm232(lvl)) && ((fc.wins||0)+(fc.losses||0)>0))lvl='amateur';
    c.level=norm232(lvl);
    if(c.active && c.level==='none')c.level='gym';
    c.skill=clamp232(c.skill ?? a.skill ?? cs.skill ?? fc.skill ?? stat232('combat'));
    c.discipline=clamp232(c.discipline ?? a.discipline ?? cs.discipline ?? fc.discipline ?? stat232('discipline'));
    c.form=clamp232(c.form ?? a.form ?? cs.form ?? fc.form ?? 50);
    c.coachTrust=clamp232(c.coachTrust ?? a.coachTrust ?? cs.coachTrust ?? fc.coachTrust ?? 50);
    c.freshness=clamp232(c.freshness ?? a.freshness ?? cs.health?.freshness ?? 65);
    c.injuryRisk=clamp232(c.injuryRisk ?? a.injuryRisk ?? cs.health?.injuryRisk ?? fc.injuryRisk ?? 20);
    c.fame=clamp232(c.fame ?? a.fame ?? cs.fame ?? fc.fame ?? 0);
    c.wins=Number(c.wins ?? a.wins ?? cs.record?.wins ?? fc.wins ?? 0);
    c.losses=Number(c.losses ?? a.losses ?? cs.record?.losses ?? fc.losses ?? 0);
    c.kos=Number(c.kos ?? a.kos ?? fc.kos ?? 0);
    c.subs=Number(c.subs ?? a.subs ?? fc.subs ?? 0);
    c.injured=Number(c.injured ?? a.injured ?? fc.injured ?? 0);

    // Mirror to older states so old checks stop locking the career.
    state.combat229=Object.assign(state.combat229||{},c);
    state.combat226=Object.assign(state.combat226||{},c);
    state.combatSports=state.combatSports||{};
    state.combatSports.route=c.route; state.combatSports.level=c.level; state.combatSports.active=c.active; state.combatSports.skill=c.skill; state.combatSports.form=c.form; state.combatSports.coachTrust=c.coachTrust; state.combatSports.fame=c.fame;
    state.combatSports.record={wins:c.wins,losses:c.losses};
    state.combatSports.access=state.combatSports.access||{};
    state.combatSports.access.gymMember=c.active; state.combatSports.access.gymJoined=c.active; state.combatSports.access.sparringApproved=c.active && c.skill>=20; state.combatSports.access.amateurDebut=LEVELS232.indexOf(c.level)>=LEVELS232.indexOf('amateur');
    state.combatSports.health=state.combatSports.health||{}; state.combatSports.health.freshness=c.freshness; state.combatSports.health.injuryRisk=c.injuryRisk;
    state.fightCareer=state.fightCareer||{};
    state.fightCareer.active=c.active; state.fightCareer.level=c.route; state.fightCareer.combatLevel=c.level; state.fightCareer.skill=c.skill; state.fightCareer.form=c.form; state.fightCareer.coachTrust=c.coachTrust; state.fightCareer.fame=c.fame; state.fightCareer.wins=c.wins; state.fightCareer.losses=c.losses; state.fightCareer.injured=c.injured;
    return c;
  }
  window.ensureCombat232=ensureCombat232;
  window.ensureCombat229=ensureCombat232;
  window.ensureCombat227=ensureCombat232;
  window.ensureCombat226=ensureCombat232;

  function status232(){
    const c=ensureCombat232(), hard=stat232('discipline')>=50 && stat232('combat')>=60;
    return card232(`<b>Combat Sports</b><br>
      Route: ${c.route==='glory'?'GLORY Kickboxing':'MMA / UFC'}<br>
      Niveau: ${LABEL232[c.level]||c.level}<br>
      Record: ${c.wins}-${c.losses} · KO ${c.kos} · SUB ${c.subs}<br>
      Combat: ${stat232('combat')}% ${bar232(stat232('combat'))}
      Discipline: ${stat232('discipline')}% ${bar232(stat232('discipline'))}
      Skill: ${c.skill}% ${bar232(c.skill)}
      Form: ${c.form}% ${bar232(c.form)}
      Freshness: ${c.freshness}% ${bar232(c.freshness)}
      Blessurerisico: ${c.injuryRisk}% ${bar232(c.injuryRisk)}
      ${c.injured>0?`<br><span style="color:#ff7669"><b>Geblesseerd:</b> ${c.injured} jaar</span>`:''}
      <br><span class="mini">Deze v23.2 rows gebruiken tap-events, dus klikken werkt ook op mobiel.</span>`);
  }

  window.combatHub232=function(){
    const c=ensureCombat232();
    const unlocked=c.active && LEVELS232.indexOf(c.level)>=LEVELS232.indexOf('amateur') && c.freshness>=25 && c.injured<=0;
    let h=status232();
    h+=sec232('Combat');
    h+=cRow232('🧭','Route kiezen','MMA/UFC of GLORY Kickboxing','route');
    h+=cRow232('📝','Fight try-outs','Gym, amateur, semi-pro, pro','tryouts');
    h+=cRow232('🏋️','Training','Techniek, cardio, sparring, discipline','training',!c.active);
    h+=cRow232('🥊','Fight Mode',unlocked?'Start een 3-ronde fight':'Eerst amateur/semi/pro en genoeg freshness','fight',!unlocked);
    h+=cRow232('🩹','Herstel','Rust, fysio, medische check','recovery',!c.active);
    h+=cRow232('📄','Status','Record, route en contractstatus','status');
    modal232('🥊','Combat Sports',h,'close');
  };
  ['combatHub229','combatHub227','combatHub226','combatSportsHub184','fightCareerScreen','gloryUfcCareerScreen','combatCareerHub177'].forEach(n=>{window[n]=window.combatHub232;try{eval(n+'=window.combatHub232')}catch(e){}});

  window.combatRouteMenu232=function(){
    let h=status232()+sec232('Route kiezen');
    h+=cRow232('🥋','MMA / UFC route','Striking, grappling, wrestling en submissions','setRoute:mma');
    h+=cRow232('🥊','GLORY Kickboxing route','Stand-up, low kicks, defense en KO bonus','setRoute:glory');
    modal232('🧭','Combat route kiezen',h,'hub');
  };
  ['combatRouteMenu229','combatRouteMenu227','combatRouteMenu226','combatRoute184'].forEach(n=>{window[n]=window.combatRouteMenu232;try{eval(n+'=window.combatRouteMenu232')}catch(e){}});

  function chance232(target){
    if(stat232('discipline')>=50 && stat232('combat')>=60)return {chance:100,hard:true};
    const diff={gym:15,amateur:35,semipro:52,regional:58,prospect:66,pro:78}[target]||35;
    const c=ensureCombat232();
    return {chance:clamp232(Math.round(stat232('combat')*.43+stat232('discipline')*.30+stat232('fitness')*.10+stat232('stamina')*.07+stat232('health')*.07+c.form*.06+c.coachTrust*.05-diff+35),5,95),hard:false};
  }
  window.combatTryoutMenu232=function(){
    let h=status232()+sec232('Try-outs');
    [['gym','🏚️','Lokale fight gym','Start route en trainen'],['amateur','🥉','Amateur try-out','Unlock Fight Mode'],['semipro','🥈','Semi-pro try-out','Serieuzere fights'],['pro','🥇','Pro try-out','Pro circuit en contractstatus']].forEach(x=>{
      const ch=chance232(x[0]);
      h+=cRow232(x[1],x[2],`${x[3]} · kans ${ch.chance}%${ch.hard?' · gegarandeerd':''}`,`tryout:${x[0]}`,state.age<12);
    });
    modal232('📝','Fight try-outs',h,'hub');
  };
  ['combatTryoutMenu229','combatTryoutMenu227','combatTryoutMenu226'].forEach(n=>{window[n]=window.combatTryoutMenu232;try{eval(n+'=window.combatTryoutMenu232')}catch(e){}});

  window.combatTrainingMenu232=function(){
    let h=status232()+sec232('Training');
    h+=cRow232('🥊','Techniektraining','Combat skill omhoog, laag risico','train:tech');
    h+=cRow232('🏃','Cardio / conditie','Form, fitness en stamina verbeteren','train:cardio');
    h+=cRow232('🧤','Lichte sparring','Fight IQ en timing, matig risico','train:light');
    h+=cRow232('🔥','Harde sparring','Snelle groei, hoog blessurerisico','train:hard');
    h+=cRow232('🧘','Discipline / gameplan','Discipline omhoog, minder risico','train:discipline');
    modal232('🏋️','Training',h,'hub');
  };
  ['combatTrainingMenu229','combatTrainingMenu227','combatTrainingMenu226'].forEach(n=>{window[n]=window.combatTrainingMenu232;try{eval(n+'=window.combatTrainingMenu232')}catch(e){}});

  window.combatRecoveryMenu232=function(){
    let h=status232()+sec232('Herstel');
    h+=cRow232('😴','Rustweek','Freshness omhoog, risico omlaag','recover:rest');
    h+=cRow232('🧊','Fysio / ijsbad',`${money232(180)} · risico flink omlaag`,'recover:physio',(state.money||0)<180);
    h+=cRow232('🏥','Medische check',`${money232(650)} · blessure sneller herstel`,'recover:medical',(state.money||0)<650);
    modal232('🩹','Herstel',h,'hub');
  };
  ['combatRecoveryMenu229','combatRecoveryMenu227','combatRecoveryMenu226','fightRecoveryScreen183'].forEach(n=>{window[n]=window.combatRecoveryMenu232;try{eval(n+'=window.combatRecoveryMenu232')}catch(e){}});

  function doSetRoute232(route){
    const c=ensureCombat232(); c.route=route==='glory'?'glory':'mma'; c.active=true; if(c.level==='none')c.level='gym';
    result232(route==='glory'?'🥊':'🥋','Combat route',`Ik koos ${c.route==='glory'?'GLORY Kickboxing':'MMA / UFC'}.`,{Happiness:3,Smarts:1},0,'good','hub');
  }
  function doTryout232(target){
    if(state.age<12)return toast232('Fight try-outs kan vanaf 12 jaar.');
    const c=ensureCombat232(), ch=chance232(target), ok=ch.hard||Math.random()*100<ch.chance;
    c.active=true;
    if(ok){
      c.level=target==='gym'?'gym':target;
      c.skill=clamp232(Math.max(c.skill,stat232('combat'))+r232(3,8));
      c.discipline=clamp232(Math.max(c.discipline,stat232('discipline'))+r232(1,6));
      c.form=clamp232(c.form+r232(4,12)); c.coachTrust=clamp232(c.coachTrust+r232(5,14));
      ensureCombat232();
      result232('📝','Fight try-out',`Ik werd aangenomen voor ${LABEL232[c.level]}. ${ch.hard?'Door 50% discipline + 60% combat was dit gegarandeerd.':`Kans was ${ch.chance}%.`} ${LEVELS232.indexOf(c.level)>=2?'Fight Mode is nu unlocked.':''}`,{Happiness:10,Fitness:2,Stamina:-8},0,'good','hub');
    }else{
      c.discipline=clamp232(c.discipline+2); c.form=clamp232(c.form-4);
      result232('📝','Try-out mislukt',`Ik werd afgewezen. Kans was ${ch.chance}%. Train combat en discipline.`,{Happiness:-5,Stamina:-8},0,'warn','tryouts');
    }
  }
  function doTrain232(kind){
    const c=ensureCombat232(); if(!c.active)return toast232('Doe eerst een try-out of kies een route.');
    let label='', type='good', hp=0;
    if(kind==='tech'){c.skill=clamp232(c.skill+r232(4,8));c.freshness=clamp232(c.freshness-r232(4,8));c.injuryRisk=clamp232(c.injuryRisk+r232(1,3));label='techniektraining';}
    if(kind==='cardio'){c.form=clamp232(c.form+r232(5,10));c.freshness=clamp232(c.freshness-r232(7,12));c.injuryRisk=clamp232(c.injuryRisk+r232(2,5));label='cardio/conditie';}
    if(kind==='light'){c.skill=clamp232(c.skill+r232(3,6));c.coachTrust=clamp232(c.coachTrust+r232(2,5));c.freshness=clamp232(c.freshness-r232(8,14));c.injuryRisk=clamp232(c.injuryRisk+r232(3,7));label='lichte sparring';}
    if(kind==='hard'){c.skill=clamp232(c.skill+r232(6,12));c.form=clamp232(c.form+r232(2,8));c.freshness=clamp232(c.freshness-r232(15,24));c.injuryRisk=clamp232(c.injuryRisk+r232(10,22));label='harde sparring';type='warn';hp=-4;if(Math.random()<0.08+c.injuryRisk/500){c.injured=Math.max(c.injured,1);label+=' en raakte geblesseerd';type='bad';}}
    if(kind==='discipline'){c.discipline=clamp232(c.discipline+r232(5,10));c.coachTrust=clamp232(c.coachTrust+r232(2,6));c.injuryRisk=clamp232(c.injuryRisk-r232(4,10));label='discipline/gameplan';}
    state.talents=state.talents||{}; state.talents.combat=clamp232(Math.max(state.talents.combat||0,c.skill)); state.talents.discipline=clamp232(Math.max(state.talents.discipline||0,c.discipline));
    ensureCombat232();
    result232('🏋️','Combat training',`Ik deed ${label}.<br>Skill ${c.skill}% · discipline ${c.discipline}% · form ${c.form}% · freshness ${c.freshness}% · risico ${c.injuryRisk}%.`,{Fitness:2,Stamina:-6,Health:hp,Happiness:2},0,type,'training');
  }
  function doRecover232(kind){
    const c=ensureCombat232(); let cost=0;
    if(kind==='rest'){c.freshness=clamp232(c.freshness+r232(18,30));c.injuryRisk=clamp232(c.injuryRisk-r232(8,18));}
    if(kind==='physio'){cost=180;if((state.money||0)<cost)return toast232('Niet genoeg geld.');state.money-=cost;c.freshness=clamp232(c.freshness+15);c.injuryRisk=clamp232(c.injuryRisk-22)}
    if(kind==='medical'){cost=650;if((state.money||0)<cost)return toast232('Niet genoeg geld.');state.money-=cost;c.freshness=clamp232(c.freshness+12);c.injuryRisk=clamp232(c.injuryRisk-35);if(c.injured>0)c.injured--}
    ensureCombat232();
    result232('🩹','Herstel',`Herstel uitgevoerd.<br>Freshness ${c.freshness}% · blessurerisico ${c.injuryRisk}% · blessure ${c.injured||0} jaar.`,{Health:5,Stamina:8,Happiness:1},0,'good','recovery');
  }

  window.combatFightStart232=function(){
    const c=ensureCombat232();
    const ok=c.active && LEVELS232.indexOf(c.level)>=LEVELS232.indexOf('amateur') && c.freshness>=25 && c.injured<=0;
    if(!ok)return toast232('Je bent nog niet klaar voor wedstrijden. Doe amateur/semi/pro try-out en herstel genoeg.');
    c.currentFight232={round:1,playerHP:100,oppHP:100,playerScore:0,oppScore:0,oppSkill:clamp232(c.skill+r232(-12,14)),opponent:['Rico Storm','Dante Silva','Kenji Tanaka','Miguel Vega','Nordin Blade'][r232(0,4)],log:[]};
    fightRound232();
  };
  ['combatFightStart229','combatFightStart227','combatFightStart226','fightMatch118','combatAdvanced184'].forEach(n=>{window[n]=window.combatFightStart232;try{eval(n+'=window.combatFightStart232')}catch(e){}});
  function fightRound232(){
    const c=ensureCombat232(), f=c.currentFight232;
    let h=card232(`<b>${f.opponent}</b><br>Ronde ${f.round}/3<br>Jij HP ${f.playerHP} · Opponent HP ${f.oppHP}<br>Score ${f.playerScore}-${f.oppScore}<br><span class="mini">Tik een tactiek; elke tik verwerkt direct de ronde.</span>`);
    h+=sec232('Tactiek');
    if(c.route==='glory'){
      [['pressure','🔥','Druk zetten','veel volume'],['counter','🛡️','Counterstriken','veilig en slim'],['lowkick','🦵','Low kicks','sterker later'],['points','📋','Punten pakken','scorecards']].forEach(x=>h+=cRow232(x[1],x[2],x[3],`fightChoice:${x[0]}`));
    }else{
      [['jab','🥊','Striking openen','veilig op punten'],['grapple','🤼','Worstelen / grappling','control en submission'],['counter','🛡️','Counteren','minder risico'],['allin','🔥','Alles of niets','finishkans, risico']].forEach(x=>h+=cRow232(x[1],x[2],x[3],`fightChoice:${x[0]}`));
    }
    modal232('🥊','Fight Mode',h,'hub');
  }
  function fightChoice232(choice){
    const c=ensureCombat232(), f=c.currentFight232; if(!f)return window.combatFightStart232();
    let power=c.skill*.40+c.form*.20+c.discipline*.15+c.freshness*.10+c.coachTrust*.05+r232(-18,24), risk=8, text='';
    if(choice==='jab'||choice==='points'){power+=5;risk-=2;text='Ik vocht slim op punten.'}
    if(choice==='grapple'){power+=c.discipline*.10;risk+=3;text='Ik zocht grappling en controle.'}
    if(choice==='counter'){power+=c.discipline*.08;risk-=5;text='Ik wachtte op counters.'}
    if(choice==='allin'){power+=18;risk+=18;text='Ik ging alles of niets.'}
    if(choice==='pressure'){power+=14;risk+=10;text='Ik zette druk met volume.'}
    if(choice==='lowkick'){power+=f.round>=2?18:7;risk+=4;text='Ik werkte met low kicks.'}
    const margin=power-(f.oppSkill+r232(-12,18));
    let pd=0,od=0,ps=0,os=0;
    if(margin>18){od=r232(20,38);pd=r232(2,10);ps=10;os=8;text+=' Ik won de ronde duidelijk.'}
    else if(margin>3){od=r232(12,24);pd=r232(5,15);ps=10;os=9;text+=' Ik pakte de ronde nipt.'}
    else if(margin>-8){od=r232(7,17);pd=r232(7,17);ps=10;os=10;text+=' Close ronde.'}
    else{od=r232(3,10);pd=r232(14,28);ps=8;os=10;text+=' Ik verloor de ronde.'}
    if(choice==='allin'&&Math.random()<0.12+c.skill/500){od+=45;text+=' Ik raakte hem bijna perfect.'}
    f.playerHP=clamp232(f.playerHP-pd,0,100); f.oppHP=clamp232(f.oppHP-od,0,100); f.playerScore+=ps; f.oppScore+=os; f.log.push(`R${f.round}: ${text}`);
    if(f.oppHP<=0||f.playerHP<=0||f.round>=3)return finishFight232();
    f.round++; fightRound232();
  }
  function finishFight232(){
    const c=ensureCombat232(), f=c.currentFight232; let win=false, method='decision';
    if(f.oppHP<=0){win=true;method='KO/TKO';c.kos++}
    else if(f.playerHP<=0){win=false;method='TKO verlies'}
    else win=f.playerScore>=f.oppScore;
    if(c.route==='mma'&&win&&method==='decision'&&Math.random()<.10+c.discipline/500){method='submission';c.subs++}
    if(win){c.wins++;c.form=clamp232(c.form+r232(4,10));c.coachTrust=clamp232(c.coachTrust+r232(3,8));c.fame=clamp232(c.fame+r232(2,7))}
    else{c.losses++;c.form=clamp232(c.form-r232(4,10));c.coachTrust=clamp232(c.coachTrust-r232(2,7))}
    c.freshness=clamp232(c.freshness-r232(14,24)); c.injuryRisk=clamp232(c.injuryRisk+r232(8,18));
    if(Math.random()<0.04+c.injuryRisk/450)c.injured=Math.max(c.injured,1);
    c.currentFight232=null; ensureCombat232();
    result232('🥊','Fight Night',`${win?'Ik won':'Ik verloor'} via ${method}.<br>${f.log.join('<br>')}<br><br>Record: ${c.wins}-${c.losses}.`,{Happiness:win?10:-7,Fitness:2,Health:win?-3:-8,Stamina:-18},0,win?'good':'bad','hub');
  }

  function dispatch232(action){
    if(!action)return;
    if(action==='close')return closeModal();
    if(action==='hub')return window.combatHub232();
    if(action==='route')return window.combatRouteMenu232();
    if(action==='tryouts')return window.combatTryoutMenu232();
    if(action==='training')return window.combatTrainingMenu232();
    if(action==='recovery')return window.combatRecoveryMenu232();
    if(action==='fight')return window.combatFightStart232();
    if(action==='status')return modal232('📄','Combat status',status232(),'hub');
    if(action.startsWith('setRoute:'))return doSetRoute232(action.split(':')[1]);
    if(action.startsWith('tryout:'))return doTryout232(action.split(':')[1]);
    if(action.startsWith('train:'))return doTrain232(action.split(':')[1]);
    if(action.startsWith('recover:'))return doRecover232(action.split(':')[1]);
    if(action.startsWith('fightChoice:'))return fightChoice232(action.split(':')[1]);
  }

  function bindCombatClicks232(){
    try{
      const modal=document.getElementById('modal');
      if(!modal || modal.__combatTap232)return;
      modal.__combatTap232=true;
      const handler=function(ev){
        const el=ev.target && ev.target.closest && ev.target.closest(`[${ACTION_ATTR}]`);
        if(!el || !modal.contains(el))return;
        ev.preventDefault();
        ev.stopPropagation();
        const action=el.getAttribute(ACTION_ATTR);
        dispatch232(action);
      };
      modal.addEventListener('click',handler,true);
      modal.addEventListener('touchend',handler,true);
      modal.addEventListener('pointerup',handler,true);
    }catch(e){}
    try{
      document.querySelectorAll(`#modal [${ACTION_ATTR}]`).forEach(el=>{
        el.style.pointerEvents='auto';
        el.style.touchAction='manipulation';
        el.style.position='relative';
        el.style.zIndex='20';
      });
    }catch(e){}
  }
  window.bindCombatClicks232=bindCombatClicks232;

  // Make old direct inline calls still execute if they are somehow rendered.
  window.combatSetRoute229=doSetRoute232; window.combatSetRoute227=doSetRoute232; window.combatSetRoute226=doSetRoute232; window.setCombatRoute184=doSetRoute232;
  window.combatTryout229=doTryout232; window.combatTryout227=doTryout232; window.combatTryout226=doTryout232;
  window.combatTrain229=doTrain232; window.combatTrain227=doTrain232; window.combatTrain226=doTrain232;
  window.combatRecover229=doRecover232; window.combatRecover227=doRecover232; window.combatRecover226=doRecover232;
  window.combatAction184=function(a){
    if(a==='join')return doTryout232('gym');
    if(a==='technique')return doTrain232('tech');
    if(a==='cardio')return doTrain232('cardio');
    if(a==='light')return doTrain232('light');
    if(a==='hard')return doTrain232('hard');
    if(a==='fight')return window.combatFightStart232();
    if(a==='recovery')return window.combatRecoveryMenu232();
    return window.combatHub232();
  };
  window.fightTryout118=function(route){doSetRoute232(route==='glory'||route==='kickbox'?'glory':'mma');return window.combatTryoutMenu232()};
  window.fightTrain118=function(kind){return doTrain232(kind==='cardio'?'cardio':kind==='discipline'?'discipline':kind==='spar'?'light':'tech')};

  const oldSport232=window.sportCombatMasterHub204||null;
  window.sportCombatMasterHub204=function(){
    let h=card232('<b>Sport & Combat</b><br>Combat is nu één werkend systeem met tap-fix.');
    h+=sec232('Sport');
    h+=cRow232('💪','Gym / algemene training','Fitness, stamina en health basis','native:gym');
    h+=cRow232('⚽','Football Career','Club, academy, contract, vorm en voetbalroute','native:football');
    h+=sec232('Combat');
    h+=cRow232('🥊','Combat Sports','MMA/UFC + GLORY, try-outs, training, fight mode en herstel','hub',state.age<12);
    if(typeof wrestlingCareerScreen163==='function')h+=cRow232('🤼','WWE route','Promo skill, ring work, storylines','native:wwe',state.age<18);
    modal232('🥊','Sport & Combat',h,'close');
    // small native shortcuts
    setTimeout(()=>{
      try{
        const m=document.getElementById('modal');
        m.addEventListener('click',function(ev){
          const el=ev.target.closest('[data-combat-action-232]');
          if(!el)return;
          const a=el.getAttribute('data-combat-action-232');
          if(a==='native:gym'){ev.preventDefault();ev.stopPropagation();return gymScreen();}
          if(a==='native:football'){ev.preventDefault();ev.stopPropagation();return footballCareerScreen();}
          if(a==='native:wwe'){ev.preventDefault();ev.stopPropagation();return wrestlingCareerScreen163();}
        },true);
      }catch(e){}
    },0);
  };
  window.combatCareerStage204=function(stage){
    if(stage==='glory')return doSetRoute232('glory');
    if(stage==='ufc')return doSetRoute232('mma');
    if(stage==='amateur')return doTryout232('amateur');
    if(stage==='semipro')return doTryout232('semipro');
    if(stage==='pro')return doTryout232('pro');
    return window.combatHub232();
  };

  const oldShow232=window.showModal||(typeof showModal==='function'?showModal:null);
  if(oldShow232&&!oldShow232.__combatTap232){
    window.showModal=function(html){const ret=oldShow232.call(this,html);setTimeout(bindCombatClicks232,0);return ret};
    window.showModal.__combatTap232=true; try{showModal=window.showModal}catch(e){}
  }
  const oldRender232=window.render||(typeof render==='function'?render:null);
  if(oldRender232&&!oldRender232.__combat232){
    window.render=function(){try{ensureCombat232()}catch(e){}const ret=oldRender232.apply(this,arguments);setTimeout(bindCombatClicks232,0);return ret};
    window.render.__combat232=true; try{render=window.render}catch(e){}
  }
  const oldSave232=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave232&&!oldSave232.__combat232){
    window.safeSave=function(){try{ensureCombat232()}catch(e){}return oldSave232.apply(this,arguments)};
    window.safeSave.__combat232=true; try{safeSave=window.safeSave}catch(e){}
  }

  window.combatClickDebug232=function(){
    ensureCombat232();
    let h=status232();
    h+=cRow232('✅','Test tap actie','Als deze werkt krijg je direct resultaat','test');
    modal232('🛠️','Combat click debug',h,'close');
  };
  const oldDispatch=dispatch232;
  dispatch232=function(action){
    if(action==='test')return result232('✅','Tap werkt','De modal-tap handler werkt. Combat rows gebruiken nu dezelfde handler.',{Happiness:1},0,'good','hub');
    return oldDispatch(action);
  };

  setTimeout(()=>{try{ensureCombat232();bindCombatClicks232();safeSave();render()}catch(e){}},350);
})();
