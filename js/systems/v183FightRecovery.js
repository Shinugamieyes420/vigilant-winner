/* v18.3 Fight Recovery + Injury Prevention */
(function(){
  function r183(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function c183(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function m183(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function apply183(stats){try{applyStats(stats||{})}catch(e){stats=stats||{};for(const k in stats){if(k==='Fitness')state.fitness=c183((state.fitness||50)+stats[k]);else if(k==='Stamina')state.stamina=c183((state.stamina||50)+stats[k]);else state.stats[k]=c183((state.stats[k]||50)+stats[k]);}}}
  function ensureF183(){
    state.fightCareer=state.fightCareer||{active:false,level:'none',skill:0,form:50,wins:0,losses:0,fame:0};
    const f=state.fightCareer;
    f.injuryRisk=c183(f.injuryRisk==null?12:f.injuryRisk,0,100);
    f.recovery=f.recovery||{freshness:60,overtraining:0,therapy:0,lastRecoveryAge:-99};
    f.recovery.freshness=c183(f.recovery.freshness==null?60:f.recovery.freshness);
    f.recovery.overtraining=c183(f.recovery.overtraining||0);
    if(typeof f.contract==='object'&&f.contract){
      f.contractLabel=[f.contract.org,f.contract.level,f.contract.pro?'pro':''].filter(Boolean).join(' · ')||'contract';
    }
    return f;
  }
  function contractText183(f){
    if(!f.contract)return 'geen';
    if(typeof f.contract==='string')return f.contract;
    let parts=[];
    if(f.contract.org)parts.push(f.contract.org);
    if(f.contract.level)parts.push(f.contract.level);
    if(f.contract.baseSalary)parts.push(m183(f.contract.baseSalary)+'/jaar');
    if(f.contract.bookingBonus)parts.push('bonus '+m183(f.contract.bookingBonus));
    if(f.contract.yearsLeft)parts.push(f.contract.yearsLeft+' jr');
    return parts.join(' · ')||'contract';
  }
  function recoveryStatus183(){
    const f=ensureF183();
    const risk=f.injured>0?100:f.injuryRisk||0;
    let advice='Je lichaam is redelijk klaar voor training.';
    if(f.injured>0)advice='Je bent geblesseerd. Eerst herstellen, niet hard trainen.';
    else if(risk>=70)advice='Hoog blessurerisico. Doe herstel voor je weer sparring/cardio knalt.';
    else if(risk>=45)advice='Matig risico. Een herstelblok verlaagt kans op blessures.';
    return `<div class="card"><b>Herstelstatus</b><br>Freshness: ${f.recovery.freshness}%<br>Overtraining: ${f.recovery.overtraining}%<br>Blessurerisico: ${risk}%<br>${f.injured>0?`Geblesseerd: ${f.injured} jaar herstel<br>`:''}<span class="mini">${advice}</span></div>`;
  }
  function toast183(t){try{return toast(t)}catch(e){}}
  function doRecovery183(title,text,stats,cash,tone){
    if(cash){state.money=(state.money||0)+cash}
    apply183(stats||{});
    try{addLog('<b>'+title+'</b><br>'+text,tone||'good',false)}catch(e){}
    try{safeSave();render()}catch(e){}
    try{showModal(`<div class="modalTop"><div class="avatar">🩹</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${recoveryStatus183()}<button class="btn" onclick="fightRecoveryScreen183()">Herstelmenu</button><button class="btn alt" onclick="gloryUfcCareerScreen()">Terug naar fight career</button></div>`)}catch(e){}
  }
  window.fightRecoveryScreen183=function(){
    const f=ensureF183();
    if(!f.active)return toast183('Start eerst je fight career.');
    showModal(`<div class="modalTop"><div class="avatar">🩹</div><div class="modalTitle">Herstel & blessurepreventie</div></div><div class="modalBody">
      ${recoveryStatus183()}
      <button class="btn green" onclick="fightRecover183('rest')">😴 Rustdag / herstelweek</button>
      <button class="btn" onclick="fightRecover183('mobility')">🧘 Mobiliteit + lichte techniek</button>
      <button class="btn" onclick="fightRecover183('physio')">🧊 Fysio / ijsbad (${m183(180)})</button>
      <button class="btn" onclick="fightRecover183('medical')">🏥 Medische check (${m183(650)})</button>
      <button class="btn gold" onclick="fightRecover183('campPause')">📆 Fight camp pauzeren</button>
      <button class="btn alt" onclick="gloryUfcCareerScreen()">Terug</button>
    </div>`);
  };
  window.fightRecover183=function(kind){
    const f=ensureF183();
    if(!f.active)return toast183('Start eerst je fight career.');
    if(kind==='rest'){
      f.recovery.freshness=c183((f.recovery.freshness||50)+r183(16,26));
      f.recovery.overtraining=c183((f.recovery.overtraining||0)-r183(12,22));
      f.injuryRisk=c183((f.injuryRisk||12)-r183(8,16));
      f.form=c183((f.form||50)+r183(1,4));
      doRecovery183('Rustdag / herstelweek','Ik nam bewust gas terug. Geen ego-training, wel herstel. Mijn lichaam voelde minder gesloopt.',{Health:4,Stamina:14,Happiness:2},0,'good');
      return;
    }
    if(kind==='mobility'){
      f.recovery.freshness=c183((f.recovery.freshness||50)+r183(6,12));
      f.recovery.overtraining=c183((f.recovery.overtraining||0)-r183(5,10));
      f.injuryRisk=c183((f.injuryRisk||12)-r183(4,9));
      f.skill=c183((f.skill||0)+r183(1,3));
      f.form=c183((f.form||50)+r183(1,3));
      doRecovery183('Mobiliteit + lichte techniek','Ik deed mobiliteit, rekken en rustige techniek. Geen harde klappen, wel scherp blijven.',{Health:2,Stamina:5,Smarts:1},0,'good');
      return;
    }
    if(kind==='physio'){
      if((state.money||0)<180)return toast183('Niet genoeg geld voor fysio.');
      state.money-=180;
      f.recovery.freshness=c183((f.recovery.freshness||50)+r183(10,18));
      f.recovery.overtraining=c183((f.recovery.overtraining||0)-r183(10,18));
      f.injuryRisk=c183((f.injuryRisk||12)-r183(12,22));
      if(f.injured>0&&Math.random()<0.55)f.injured=Math.max(0,(f.injured||0)-1);
      doRecovery183('Fysio / ijsbad','Ik deed fysio, ijsbad en herstelwerk. Niet stoer, maar precies wat mijn lichaam nodig had.',{Health:6,Stamina:8,Happiness:1},0,'good');
      return;
    }
    if(kind==='medical'){
      if((state.money||0)<650)return toast183('Niet genoeg geld voor medische check.');
      state.money-=650;
      f.recovery.freshness=c183((f.recovery.freshness||50)+r183(8,14));
      f.recovery.overtraining=c183((f.recovery.overtraining||0)-r183(14,25));
      f.injuryRisk=c183((f.injuryRisk||12)-r183(20,35));
      if(f.injured>0)f.injured=Math.max(0,(f.injured||0)-1);
      doRecovery183('Medische check','De arts checkte mijn blessurebelasting. Ik kreeg groen licht voor rustig opbouwen, niet voor dom doorrammen.',{Health:8,Smarts:2,Stamina:4},0,'good');
      return;
    }
    if(kind==='campPause'){
      f.recovery.freshness=c183((f.recovery.freshness||50)+r183(24,36));
      f.recovery.overtraining=0;
      f.injuryRisk=c183((f.injuryRisk||12)-r183(18,30));
      f.form=c183((f.form||50)-r183(0,4));
      if(f.injured>0)f.injured=Math.max(0,(f.injured||0)-1);
      doRecovery183('Fight camp pauzeren','Ik pauzeerde mijn fight camp. Mijn vorm bleef redelijk, maar mijn blessurerisico zakte flink.',{Health:7,Stamina:18,Happiness:-1},0,'warn');
      return;
    }
  };

  // Rewrite the visible fight career screen with a recovery button and readable contract text.
  const oldScreen183=window.gloryUfcCareerScreen;
  window.gloryUfcCareerScreen=function(){
    const f=ensureF183();
    if(state.age < 15){
      showModal(`<div class="modalTop"><div class="avatar">🥊</div><div class="modalTitle">Glory → UFC Career</div></div><div class="modalBody"><div class="card">Beschikbaar vanaf 15 jaar.<br>Tot die tijd helpen voetbal, vechtsport, fitness en discipline om je kansen later te verhogen.</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
      return;
    }
    const status=f.active?`
      <b>Organisatie:</b> ${f.org||'none'}<br>
      <b>Niveau:</b> ${typeof fightLevelName118==='function'?fightLevelName118(f.level):f.level}<br>
      <b>Gym:</b> ${f.gym||'-'}<br>
      <b>Stijl:</b> ${f.style||'-'}<br>
      <b>Skill:</b> ${f.skill||0}%<br>
      <b>Vorm:</b> ${f.form||50}%<br>
      <b>Coach trust:</b> ${f.coachTrust||50}%<br>
      <b>Record:</b> ${f.wins||0}-${f.losses||0}<br>
      <b>Fame:</b> ${f.fame||0}%<br>
      <b>Contract:</b> ${contractText183(f)}<br>
      <b>Salaris:</b> ${m183(f.salary||0)}/jaar
      ${f.injured>0?`<br><span style="color:#ff7669"><b>Geblesseerd:</b> ${f.injured} jaar herstel</span>`:''}
    `:`Je hebt nog geen fight career.<br>Begin bij een kickbox- of MMA-gym. Goede fitness, stamina, combat en discipline verhogen je kans.`;
    showModal(`<div class="modalTop"><div class="avatar">🥊</div><div class="modalTitle">Glory Kickbox → UFC</div></div><div class="modalBody">
      <div class="card">${status}</div>
      ${f.active?recoveryStatus183():''}
      ${!f.active?`
        <button class="btn" onclick="fightTryout118('kickbox')">🥊 Try-out Kickbox Gym</button>
        <button class="btn" onclick="fightTryout118('mma')">🥋 Try-out MMA Gym</button>
      `:`
        <button class="btn green" onclick="fightRecoveryScreen183()">🩹 Herstel & blessurepreventie</button>
        <button class="btn" onclick="fightTrain118('tech')">🥊 Techniektraining</button>
        <button class="btn" onclick="fightTrain118('cardio')">🏃 Cardio & weight cut</button>
        <button class="btn" onclick="fightTrain118('spar')">🥋 Sparren</button>
        <button class="btn" onclick="fightTrain118('discipline')">🧘 Discipline / gameplan</button>
        <button class="btn green" onclick="fightMatch118()">🏟️ Wedstrijd vechten</button>
        <button class="btn gold" onclick="fightLevelUp118()">📈 Hoger niveau zoeken</button>
        <button class="btn" onclick="fightManager118()">🧑‍💼 Manager / zaakwaarnemer</button>
        <button class="btn red" onclick="fightRetire118()">Stoppen met fight career</button>
      `}
      <button class="btn alt" onclick="closeModal()">Terug</button>
    </div>`);
  };
  try{gloryUfcCareerScreen=window.gloryUfcCareerScreen}catch(e){}

  // Training now builds fatigue/risk. Recovery lowers it. Very high risk blocks dumb hard sparring.
  const oldTrain183=window.fightTrain118;
  if(typeof oldTrain183==='function'&&!oldTrain183.__recovery183){
    window.fightTrain118=function(kind){
      const f=ensureF183();
      if(!f.active)return toast183('Start eerst je fight career.');
      const hard={tech:9,cardio:14,spar:18,discipline:-4}[kind]||8;
      if(f.injured>0 && kind!=='discipline')return toast183('Je bent geblesseerd. Gebruik Herstel & blessurepreventie of discipline/gameplan.');
      if(kind==='spar' && (f.injuryRisk||0)>=78)return toast183('Blessurerisico is te hoog voor hard sparren. Doe eerst herstel/fysio.');
      const beforeRisk=f.injuryRisk||12;
      const beforeFresh=f.recovery.freshness||60;
      oldTrain183.apply(this, arguments);
      f.recovery= f.recovery || {freshness:60,overtraining:0};
      if(kind==='discipline'){
        f.recovery.freshness=c183((f.recovery.freshness||beforeFresh)+r183(1,5));
        f.recovery.overtraining=c183((f.recovery.overtraining||0)-r183(2,6));
        f.injuryRisk=c183((f.injuryRisk||beforeRisk)-r183(1,4));
      }else{
        f.recovery.freshness=c183((f.recovery.freshness||beforeFresh)-r183(6,14));
        f.recovery.overtraining=c183((f.recovery.overtraining||0)+r183(5,hard));
        f.injuryRisk=c183((f.injuryRisk||beforeRisk)+r183(Math.max(1,Math.floor(hard/3)),hard));
        if((f.recovery.freshness||0)<25)f.injuryRisk=c183((f.injuryRisk||0)+r183(4,9));
        if((f.injuryRisk||0)>70 && Math.random()<0.14){
          try{addLog('<b>Overbelasting</b><br>Mijn lichaam voelt zwaar. Blessurerisico is nu hoog; herstel is slim voordat ik weer hard train.','warn',false)}catch(e){}
        }
      }
      try{safeSave();render()}catch(e){}
    };
    window.fightTrain118.__recovery183=true;
    try{fightTrain118=window.fightTrain118}catch(e){}
  }

  // Fight injuries depend more on current risk/freshness now.
  const oldMatch183=window.fightMatch118;
  if(typeof oldMatch183==='function'&&!oldMatch183.__recovery183){
    window.fightMatch118=function(){
      const f=ensureF183();
      if(!f.active)return toast183('Start eerst je fight career.');
      if(f.injured>0)return toast183('Je bent geblesseerd en kunt nu niet vechten. Gebruik herstelopties.');
      if((f.injuryRisk||0)>=85)return toast183('Blessurerisico is extreem. Doe eerst herstel, fysio of medische check.');
      oldMatch183.apply(this, arguments);
      f.recovery.freshness=c183((f.recovery.freshness||60)-r183(12,22));
      f.recovery.overtraining=c183((f.recovery.overtraining||0)+r183(8,18));
      f.injuryRisk=c183((f.injuryRisk||12)+r183(5,14));
      try{safeSave();render()}catch(e){}
    };
    window.fightMatch118.__recovery183=true;
    try{fightMatch118=window.fightMatch118}catch(e){}
  }

  // Yearly decay: some natural recovery each birthday, but serious injuries need time/menu.
  const oldAge183=window.ageUp||(typeof ageUp==='function'?ageUp:null);
  if(oldAge183&&!oldAge183.__fightRecovery183){
    window.ageUp=function(){
      if(oldAge183)oldAge183.apply(this,arguments);
      try{
        const f=ensureF183();
        if(f.active){
          f.recovery.freshness=c183((f.recovery.freshness||60)+r183(8,14));
          f.recovery.overtraining=c183((f.recovery.overtraining||0)-r183(8,16));
          f.injuryRisk=c183((f.injuryRisk||12)-r183(5,12));
        }
        safeSave();
      }catch(e){}
    };
    window.ageUp.__fightRecovery183=true;
    try{ageUp=window.ageUp}catch(e){}
  }
  setTimeout(()=>{try{ensureF183();safeSave()}catch(e){}},300);
})();
