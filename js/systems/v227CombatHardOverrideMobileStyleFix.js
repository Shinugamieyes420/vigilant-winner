
/* v22.7 Combat Hard Override + Mobile Click Fix
   Final hard override so no old combat v18.4/v17.7 screens leak through.
   - combatRoute184, setCombatRoute184, old training/fight functions all route to v22.7/v22.6
   - pure original dark row style
   - mobile modal/row click guard
*/
(function(){
  function clamp227(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r227(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function money227(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast227(t){try{toast(t)}catch(e){console.log(t)}}
  function rr227(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}">
        <div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div>
      </div>`;
    }
  }
  function sec227(t){return `<div class="section">${t}</div>`}
  function card227(h){return `<div class="card">${h}</div>`}
  function modal227(icon,title,body,back='closeModal()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody combat227Body">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`);
    setTimeout(fixCombatClicks227,0);
  }
  function stat227(name){
    const s=state||{}, st=s.stats||{}, t=s.talents||{}, c=s.combat226||{}, cs=s.combatSports||{}, fc=s.fightCareer||{};
    if(name==='combat')return clamp227(Math.max(t.combat||0,t.fight||0,t.martialArts||0,c.skill||0,cs.skill||0,fc.skill||0,s.combat||0));
    if(name==='discipline')return clamp227(Math.max(t.discipline||0,c.discipline||0,cs.discipline||0,fc.discipline||0,st.Discipline||0,s.discipline||0));
    if(name==='fitness')return clamp227(Math.max(s.fitness||0,st.Fitness||0,50));
    if(name==='stamina')return clamp227(Math.max(s.stamina||0,st.Stamina||0,50));
    if(name==='health')return clamp227(Math.max(st.Health||0,s.health||0,50));
    return 0;
  }
  function bar227(v){
    v=clamp227(v);
    let cls=v<30?'low':'';
    return `<div class="miniBar"><div class="miniFill ${cls}" style="width:${v}%"></div></div>`;
  }
  const ROUTES227={
    mma:{icon:'🥋',name:'MMA / UFC',sub:'Striking, worstelen, grappling en submissions'},
    glory:{icon:'🥊',name:'GLORY Kickboxing',sub:'Stand-up, low kicks, cardio, geen takedowns'}
  };
  const LABEL227={none:'Geen route',gym:'Lokale gym',amateur:'Amateur',regional:'Regionaal',prospect:'Prospect',pro:'Pro',ranked:'Ranked',contender:'Contender',title:'Title fight',champion:'Champion'};

  function ensure227(){
    let c;
    try{ if(typeof ensureCombat226==='function') c=ensureCombat226(); }catch(e){}
    state.combat226=state.combat226||{};
    c=state.combat226;
    c.route = (c.route==='glory')?'glory':'mma';
    c.level = c.level || (c.active?'gym':'none');
    if(c.level==='trial'||c.level==='local_gym')c.level='gym';
    c.active=!!c.active || c.level!=='none';
    c.skill=clamp227(c.skill ?? stat227('combat'));
    c.discipline=clamp227(c.discipline ?? stat227('discipline'));
    c.form=clamp227(c.form ?? 50);
    c.coachTrust=clamp227(c.coachTrust ?? 50);
    c.freshness=clamp227(c.freshness ?? 65);
    c.injuryRisk=clamp227(c.injuryRisk ?? 20);
    c.fame=clamp227(c.fame ?? 0);
    c.wins=Number(c.wins||0); c.losses=Number(c.losses||0); c.kos=Number(c.kos||0); c.subs=Number(c.subs||0);
    // sync old statuses so old cards stop saying trial/gym geen lid
    state.combatSports=state.combatSports||{};
    state.combatSports.level=c.level;
    state.combatSports.route=c.route;
    state.combatSports.active=c.active;
    state.combatSports.skill=c.skill;
    state.combatSports.form=c.form;
    state.combatSports.coachTrust=c.coachTrust;
    state.combatSports.fame=c.fame;
    state.combatSports.access=state.combatSports.access||{};
    state.combatSports.access.gymMember=c.active;
    state.combatSports.access.gymJoined=c.active;
    state.combatSports.access.sparringApproved=c.active && c.skill>=20;
    state.combatSports.health=state.combatSports.health||{};
    state.combatSports.health.freshness=c.freshness;
    state.combatSports.health.injuryRisk=c.injuryRisk;
    state.fightCareer=state.fightCareer||{};
    state.fightCareer.active=c.active;
    state.fightCareer.level=c.route;
    state.fightCareer.skill=c.skill;
    state.fightCareer.form=c.form;
    state.fightCareer.coachTrust=c.coachTrust;
    state.fightCareer.fame=c.fame;
    return c;
  }
  window.ensureCombat227=ensure227;

  function statusCard227(){
    const c=ensure227();
    const hard=stat227('discipline')>=50 && stat227('combat')>=60;
    return card227(`<b>Combat Sports</b><br>
      Route: ${ROUTES227[c.route].name}<br>
      Niveau: ${LABEL227[c.level]||c.level}<br>
      Record: ${c.wins}-${c.losses}<br>
      Combat: ${stat227('combat')}% ${bar227(stat227('combat'))}
      Discipline: ${stat227('discipline')}% ${bar227(stat227('discipline'))}
      Form: ${c.form}% ${bar227(c.form)}
      Coach trust: ${c.coachTrust}% ${bar227(c.coachTrust)}
      Freshness: ${c.freshness}% ${bar227(c.freshness)}
      Blessurerisico: ${c.injuryRisk}% ${bar227(c.injuryRisk)}
      <span class="mini">Try-out hard rule: 50% discipline + 60% combat = automatisch aangenomen. Status: ${hard?'✅ gegarandeerd':'❌ kansberekening'}</span>`);
  }

  window.combatHub227=function(){
    const c=ensure227();
    let h=statusCard227();
    h+=sec227('Combat');
    h+=rr227('🧭','Route kiezen','MMA/UFC of GLORY Kickboxing','combatRouteMenu227()');
    h+=rr227('📝','Fight try-outs','Gym, amateur, regional, prospect of pro','combatTryoutMenu227()');
    h+=rr227('🏋️','Training','Techniek, cardio, sparring, discipline','combatTrainingMenu227()',!c.active);
    h+=rr227('🥊','Fight Mode','3 rondes met klikbare tactische keuzes','combatFightStart226()',!c.active || c.freshness<25 || c.injured>0);
    h+=rr227('🩹','Herstel','Rust, fysio, medical check','combatRecoveryMenu227()',!c.active);
    h+=rr227('📄','Contract / status','Salaris, record en route sync','combatContract226()',!c.active && typeof combatContract226==='function');
    modal227('🥊','Combat Sports',h,'closeModal()');
  };
  window.combatHub226=window.combatHub227;
  window.combatSportsHub184=window.combatHub227;
  window.fightCareerScreen=window.combatHub227;
  window.gloryUfcCareerScreen=window.combatHub227;
  window.combatCareerHub177=window.combatHub227;
  try{combatSportsHub184=window.combatHub227;fightCareerScreen=window.combatHub227;gloryUfcCareerScreen=window.combatHub227;combatCareerHub177=window.combatHub227}catch(e){}

  window.combatRouteMenu227=function(){
    let h=statusCard227();
    h+=sec227('Route kiezen');
    h+=rr227('🥋','MMA / UFC route','Striking, worstelen, grappling en submissions','combatSetRoute227("mma")');
    h+=rr227('🥊','GLORY Kickboxing route','Stand-up, low kicks, cardio, geen takedowns','combatSetRoute227("glory")');
    modal227('🧭','Combat route kiezen',h,'combatHub227()');
  };
  window.combatRouteMenu226=window.combatRouteMenu227;
  window.combatRoute184=window.combatRouteMenu227;
  try{combatRoute184=window.combatRouteMenu227}catch(e){}

  window.combatSetRoute227=function(route){
    const c=ensure227();
    c.route=(route==='glory')?'glory':'mma';
    c.active=true;
    if(c.level==='none'||c.level==='trial')c.level='gym';
    try{combatSetRoute226(c.route)}catch(e){}
    ensure227();
    try{safeSave()}catch(e){}
    combatHub227();
  };
  window.combatSetRoute226=window.combatSetRoute227;
  window.setCombatRoute184=window.combatSetRoute227;
  try{setCombatRoute184=window.combatSetRoute227}catch(e){}

  function chance227(target){
    if(stat227('discipline')>=50 && stat227('combat')>=60)return {chance:100,hard:true};
    const diff={gym:18,amateur:38,regional:55,prospect:67,pro:78}[target]||35;
    const c=ensure227();
    let val=stat227('combat')*.43+stat227('discipline')*.30+stat227('fitness')*.10+stat227('stamina')*.07+stat227('health')*.07+c.form*.06+c.coachTrust*.05-diff+35;
    return {chance:clamp227(Math.round(val),5,95),hard:false};
  }
  window.combatTryoutMenu227=function(){
    let h=statusCard227();
    h+=sec227('Try-outs');
    [['gym','🏚️','Lokale fight gym','Start route en training'],['amateur','🥉','Amateur try-out','Eerste echte fights'],['regional','🥈','Regionaal team','Sterkere tegenstanders'],['prospect','🥇','Prospect try-out','Pro-aandacht'],['pro','🏆','UFC/GLORY prelim try-out','Professionele route']].forEach(x=>{
      const ch=chance227(x[0]);
      h+=rr227(x[1],x[2],`${x[3]} · kans ${ch.chance}%${ch.hard?' · gegarandeerd':''}`,`combatTryout227('${x[0]}')`,state.age<12);
    });
    modal227('📝','Fight try-outs',h,'combatHub227()');
  };
  window.combatTryoutMenu226=window.combatTryoutMenu227;

  window.combatTryout227=function(target){
    const c=ensure227();
    if(state.age<12)return toast227('Fight try-outs kan vanaf 12 jaar.');
    const ch=chance227(target);
    const ok=ch.hard || Math.random()*100<ch.chance;
    c.active=true;
    if(ok){
      c.level=target==='gym'?'gym':target;
      c.skill=clamp227(Math.max(c.skill,stat227('combat'))+r227(2,7));
      c.discipline=clamp227(Math.max(c.discipline,stat227('discipline'))+r227(1,5));
      c.form=clamp227(c.form+r227(3,10));
      c.coachTrust=clamp227(c.coachTrust+r227(4,12));
      try{action('Fight try-out',`Ik werd aangenomen voor ${LABEL227[target]||target}.${ch.hard?' Door 50% discipline + 60% combat was dit gegarandeerd.':` Kans: ${ch.chance}%.`}`,{Happiness:10,Fitness:2,Stamina:-8},0,'good')}catch(e){}
    }else{
      c.discipline=clamp227(c.discipline+2);
      c.form=clamp227(c.form-4);
      try{action('Fight try-out',`Ik werd afgewezen. Kans was ${ch.chance}%. Train combat en discipline.`,{Happiness:-5,Stamina:-8},0,'warn')}catch(e){}
    }
    ensure227();try{safeSave();render()}catch(e){}
  };
  window.combatTryout226=window.combatTryout227;

  window.combatTrainingMenu227=function(){
    const c=ensure227();
    let h=statusCard227();
    h+=sec227('Training');
    h+=rr227('🥊','Techniektraining','Combat skill omhoog, laag risico','combatTrain227("tech")');
    h+=rr227('🏃','Cardio / conditie','Form, fitness en stamina verbeteren','combatTrain227("cardio")');
    h+=rr227('🧤','Lichte sparring','Fight IQ en timing, matig risico','combatTrain227("light")');
    h+=rr227('🔥','Harde sparring','Snelle groei, hoog blessurerisico','combatTrain227("hard")',c.injuryRisk>70 || c.freshness<35);
    h+=rr227('🧘','Discipline / gameplan','Discipline omhoog, minder risico','combatTrain227("discipline")');
    modal227('🏋️','Training',h,'combatHub227()');
  };
  window.combatTrainingMenu226=window.combatTrainingMenu227;

  window.combatTrain227=function(kind){
    const c=ensure227();
    if(!c.active)return toast227('Doe eerst een try-out of kies een route.');
    if(kind==='tech'){c.skill=clamp227(c.skill+r227(4,8)); c.freshness=clamp227(c.freshness-r227(4,8)); c.injuryRisk=clamp227(c.injuryRisk+r227(1,3));}
    if(kind==='cardio'){c.form=clamp227(c.form+r227(5,10)); c.freshness=clamp227(c.freshness-r227(7,12)); c.injuryRisk=clamp227(c.injuryRisk+r227(2,5));}
    if(kind==='light'){c.skill=clamp227(c.skill+r227(3,6)); c.coachTrust=clamp227(c.coachTrust+r227(2,5)); c.freshness=clamp227(c.freshness-r227(8,14)); c.injuryRisk=clamp227(c.injuryRisk+r227(3,7));}
    if(kind==='hard'){c.skill=clamp227(c.skill+r227(6,12)); c.form=clamp227(c.form+r227(2,8)); c.freshness=clamp227(c.freshness-r227(15,24)); c.injuryRisk=clamp227(c.injuryRisk+r227(10,22));}
    if(kind==='discipline'){c.discipline=clamp227(c.discipline+r227(5,10)); c.coachTrust=clamp227(c.coachTrust+r227(2,6)); c.injuryRisk=clamp227(c.injuryRisk-r227(4,10));}
    state.talents=state.talents||{};
    state.talents.combat=clamp227(Math.max(state.talents.combat||0,c.skill));
    state.talents.discipline=clamp227(Math.max(state.talents.discipline||0,c.discipline));
    try{action('Combat training',`Ik deed ${kind==='tech'?'techniektraining':kind==='cardio'?'cardio/conditie':kind==='light'?'lichte sparring':kind==='hard'?'harde sparring':'discipline/gameplan'}.`,{Fitness:2,Stamina:-6,Happiness:2},0,kind==='hard'?'warn':'good')}catch(e){}
    ensure227();try{safeSave();render()}catch(e){}
  };
  window.combatTrain226=window.combatTrain227;

  window.combatRecoveryMenu227=function(){
    let h=statusCard227();
    h+=sec227('Herstel');
    h+=rr227('😴','Rustweek','Freshness omhoog, risico omlaag','combatRecover227("rest")');
    h+=rr227('🧘','Mobiliteit / techniek licht','Veilig herstel en klein skill plusje','combatRecover227("mobility")');
    h+=rr227('🧊','Fysio / ijsbad',`${money227(180)} · minder blessurerisico`,'combatRecover227("physio")',(state.money||0)<180);
    h+=rr227('🏥','Medische check',`${money227(650)} · blessure sneller herstellen`,'combatRecover227("medical")',(state.money||0)<650);
    modal227('🩹','Herstel',h,'combatHub227()');
  };
  window.combatRecoveryMenu226=window.combatRecoveryMenu227;
  window.fightRecoveryScreen183=window.combatRecoveryMenu227;
  try{fightRecoveryScreen183=window.combatRecoveryMenu227}catch(e){}

  window.combatRecover227=function(kind){
    const c=ensure227();
    let cost=0;
    if(kind==='rest'){c.freshness=clamp227(c.freshness+r227(18,30)); c.injuryRisk=clamp227(c.injuryRisk-r227(8,18));}
    if(kind==='mobility'){c.freshness=clamp227(c.freshness+r227(8,16)); c.skill=clamp227(c.skill+2); c.injuryRisk=clamp227(c.injuryRisk-r227(5,12));}
    if(kind==='physio'){cost=180;if((state.money||0)<cost)return toast227('Niet genoeg geld.');state.money-=cost;c.freshness=clamp227(c.freshness+15); c.injuryRisk=clamp227(c.injuryRisk-22);}
    if(kind==='medical'){cost=650;if((state.money||0)<cost)return toast227('Niet genoeg geld.');state.money-=cost;c.freshness=clamp227(c.freshness+12); c.injuryRisk=clamp227(c.injuryRisk-35); if(c.injured>0)c.injured--;}
    try{action('Herstel','Ik werkte aan herstel en blessurepreventie.',{Health:5,Stamina:8,Happiness:1},0,'good')}catch(e){}
    ensure227();try{safeSave();render()}catch(e){}
  };
  window.combatRecover226=window.combatRecover227;

  // Old function hard redirects
  window.combatAction184=function(action){
    if(action==='join')return combatTryout227('gym');
    if(action==='technique')return combatTrain227('tech');
    if(action==='cardio')return combatTrain227('cardio');
    if(action==='light')return combatTrain227('light');
    if(action==='hard')return combatTrain227('hard');
    if(action==='fight')return combatFightStart226();
    if(action==='levelup')return (typeof combatLevelUp226==='function'?combatLevelUp226():combatHub227());
    if(action==='recovery')return combatRecoveryMenu227();
    return combatHub227();
  };
  window.combatAdvanced184=function(){return combatFightStart226()};
  window.combatOldGlory184=window.combatHub227;
  window.combatStartScreen177=window.combatHub227;
  window.combatCareerStage204=function(){return combatHub227()};
  window.fightTryout118=function(route){combatSetRoute227(route==='glory'||route==='kickbox'?'glory':'mma'); return combatTryoutMenu227()};
  window.fightTrain118=function(kind){return combatTrain227(kind==='cardio'?'cardio':kind==='discipline'?'discipline':kind==='spar'?'light':'tech')};
  window.fightMatch118=function(){return combatFightStart226()};
  window.fightLevelUp118=function(){return typeof combatLevelUp226==='function'?combatLevelUp226():combatHub227()};
  window.fightManager118=function(){return typeof combatContract226==='function'?combatContract226():combatHub227()};
  window.fightRetire118=function(){return typeof combatRetire226==='function'?combatRetire226():combatHub227()};
  try{
    combatAction184=window.combatAction184; combatAdvanced184=window.combatAdvanced184; combatOldGlory184=window.combatOldGlory184;
    combatStartScreen177=window.combatStartScreen177; fightTryout118=window.fightTryout118; fightTrain118=window.fightTrain118; fightMatch118=window.fightMatch118;
  }catch(e){}

  function fixCombatClicks227(){
    try{
      const modal=document.getElementById('modal');
      const shade=document.getElementById('modalShade');
      if(modal){modal.style.pointerEvents='auto';}
      if(shade){shade.style.pointerEvents='auto';}
      document.querySelectorAll('#modal .row,#modal .btn').forEach(el=>{
        el.style.pointerEvents='auto';
        el.style.touchAction='manipulation';
        el.style.position='relative';
        el.style.zIndex='5';
      });
      // kill white old combat route blocks if still rendered by an older call
      document.querySelectorAll('#modal .combat184-row').forEach(el=>{
        el.classList.remove('combat184-row');
      });
    }catch(e){}
  }
  window.fixCombatClicks227=fixCombatClicks227;

  window.combatDebug227=function(){
    ensure227();
    let h=statusCard227();
    h+=card227(`<b>Hard override actief</b><br>Oude combatRoute184/setCombatRoute184/training/fight functies zijn nu omgeleid naar v22.7.<br>Alle rows/buttons krijgen mobile click guard.`);
    h+=rr227('🥊','Open Combat hub','Test hoofdmenu','combatHub227()');
    h+=rr227('🧭','Open Route kiezen','Test route menu','combatRouteMenu227()');
    h+=rr227('🏋️','Open Training','Test training menu','combatTrainingMenu227()');
    modal227('🛠️','Combat debug v22.7',h,'closeModal()');
  };

  const oldShow227=window.showModal || (typeof showModal==='function'?showModal:null);
  if(oldShow227 && !oldShow227.__combatClick227){
    window.showModal=function(html){
      const ret=oldShow227.call(this,html);
      setTimeout(fixCombatClicks227,0);
      return ret;
    };
    window.showModal.__combatClick227=true; try{showModal=window.showModal}catch(e){}
  }

  const oldRender227=window.render || (typeof render==='function'?render:null);
  if(oldRender227 && !oldRender227.__combat227){
    window.render=function(){
      try{ensure227()}catch(e){}
      const ret=oldRender227.apply(this,arguments);
      setTimeout(fixCombatClicks227,0);
      return ret;
    };
    window.render.__combat227=true; try{render=window.render}catch(e){}
  }

  setTimeout(()=>{try{ensure227();fixCombatClicks227();safeSave();render()}catch(e){}},350);
})();
