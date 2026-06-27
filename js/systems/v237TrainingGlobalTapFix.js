
/* v23.7 Training Global Tap Fix
   Fixes old combat/training/recovery rows that still render without modern data attributes.
   Recognizes rows by text and executes training/recovery/fight actions directly.
*/
(function(){
  const TRAIN_ATTR='data-training-action-237';

  function clamp237(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(Number(v)||0)))}
  function r237(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function toast237(t){try{toast(t)}catch(e){console.log(t)}}
  function money237(v){try{return money(v)}catch(e){return '€ '+Math.round(Number(v)||0).toLocaleString('nl-NL')}}
  function apply237(s){try{applyStats(s||{})}catch(e){}}
  function saveRender237(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function sec237(t){return `<div class="section">${t}</div>`}
  function card237(h){return `<div class="card">${h}</div>`}
  function row237(icon,title,sub,action,locked=false){
    return `<div class="row ${locked?'locked':''}" ${locked?'':`${TRAIN_ATTR}="${action}"`} role="button" tabindex="0">
      <div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div>
    </div>`;
  }
  function modal237(icon,title,body,back='combatTrainingMenu237()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody v237TrainingBody">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`);
    setTimeout(patchTrainingRows237,0);
  }
  function result237(icon,title,txt,stats={},cash=0,type='good',back='combatTrainingMenu237()'){
    if(cash)state.money=(Number(state.money)||0)+cash;
    apply237(stats);
    try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(e){}
    saveRender237();
    modal237(icon,title,card237(`${txt}<br><br><span class="mini">✅ Actie uitgevoerd.</span>`),back);
  }
  function stat237(k){
    const s=state||{}, st=s.stats||{}, t=s.talents||{}, c=s.combat237||s.combat232||s.combat229||s.combat226||{}, cs=s.combatSports||{}, fc=s.fightCareer||{};
    if(k==='combat')return clamp237(Math.max(t.combat||0,t.fight||0,t.martialArts||0,c.skill||0,cs.skill||0,fc.skill||0,s.combat||0));
    if(k==='discipline')return clamp237(Math.max(t.discipline||0,c.discipline||0,cs.discipline||0,fc.discipline||0,st.Discipline||0,s.discipline||0));
    if(k==='fitness')return clamp237(Math.max(s.fitness||0,st.Fitness||0,50));
    if(k==='stamina')return clamp237(Math.max(s.stamina||0,st.Stamina||0,50));
    if(k==='health')return clamp237(Math.max(st.Health||0,s.health||0,50));
    return 0;
  }
  const LEVELS237=['none','gym','amateur','semipro','regional','prospect','pro','ranked','contender','title','champion'];
  function normLevel237(l){
    l=String(l||'none').toLowerCase();
    if(['trial','local_gym','local gym','ufc','glory','mma','kickboxing'].includes(l))return 'gym';
    if(['semi','semi-pro','semi_pro'].includes(l))return 'semipro';
    if(!LEVELS237.includes(l))return 'gym';
    return l;
  }
  function ensureCombat237(){
    state.combat237=state.combat237||{};
    const c=state.combat237, old=state.combat232||state.combat229||state.combat226||{}, cs=state.combatSports||{}, fc=state.fightCareer||{};
    c.route=(String(c.route||old.route||cs.route||fc.level||'mma').includes('glory')||String(c.route||'').includes('kick'))?'glory':'mma';
    c.active=!!(c.active||old.active||cs.active||cs.access?.gymJoined||cs.access?.gymMember||fc.active);
    let lvl=c.level||old.level||cs.level||fc.combatLevel||fc.stage||'none';
    if(cs.access?.amateurDebut && ['none','gym'].includes(normLevel237(lvl)))lvl='amateur';
    if(fc.active && ['none','gym'].includes(normLevel237(lvl)) && ((fc.wins||0)+(fc.losses||0)>0))lvl='amateur';
    c.level=normLevel237(lvl);
    if(c.active && c.level==='none')c.level='gym';
    c.skill=clamp237(c.skill ?? old.skill ?? cs.skill ?? fc.skill ?? stat237('combat'));
    c.discipline=clamp237(c.discipline ?? old.discipline ?? cs.discipline ?? fc.discipline ?? stat237('discipline'));
    c.form=clamp237(c.form ?? old.form ?? cs.form ?? fc.form ?? 50);
    c.coachTrust=clamp237(c.coachTrust ?? old.coachTrust ?? cs.coachTrust ?? fc.coachTrust ?? 50);
    c.freshness=clamp237(c.freshness ?? old.freshness ?? cs.health?.freshness ?? 65);
    c.injuryRisk=clamp237(c.injuryRisk ?? old.injuryRisk ?? cs.health?.injuryRisk ?? fc.injuryRisk ?? 20);
    c.fame=clamp237(c.fame ?? old.fame ?? cs.fame ?? fc.fame ?? 0);
    c.wins=Number(c.wins ?? old.wins ?? cs.record?.wins ?? fc.wins ?? 0);
    c.losses=Number(c.losses ?? old.losses ?? cs.record?.losses ?? fc.losses ?? 0);
    c.kos=Number(c.kos ?? old.kos ?? fc.kos ?? 0);
    c.subs=Number(c.subs ?? old.subs ?? fc.subs ?? 0);
    c.injured=Number(c.injured ?? old.injured ?? fc.injured ?? 0);

    state.combat232=Object.assign(state.combat232||{},c);
    state.combat229=Object.assign(state.combat229||{},c);
    state.combat226=Object.assign(state.combat226||{},c);
    state.combatSports=state.combatSports||{};
    state.combatSports.route=c.route; state.combatSports.level=c.level; state.combatSports.active=c.active; state.combatSports.skill=c.skill; state.combatSports.form=c.form; state.combatSports.coachTrust=c.coachTrust; state.combatSports.fame=c.fame;
    state.combatSports.record={wins:c.wins,losses:c.losses};
    state.combatSports.access=state.combatSports.access||{};
    state.combatSports.access.gymMember=c.active; state.combatSports.access.gymJoined=c.active; state.combatSports.access.sparringApproved=c.active && c.skill>=20; state.combatSports.access.amateurDebut=LEVELS237.indexOf(c.level)>=LEVELS237.indexOf('amateur');
    state.combatSports.health=state.combatSports.health||{};
    state.combatSports.health.freshness=c.freshness; state.combatSports.health.injuryRisk=c.injuryRisk;
    state.fightCareer=state.fightCareer||{};
    state.fightCareer.active=c.active; state.fightCareer.level=c.route; state.fightCareer.combatLevel=c.level; state.fightCareer.skill=c.skill; state.fightCareer.form=c.form; state.fightCareer.coachTrust=c.coachTrust; state.fightCareer.fame=c.fame; state.fightCareer.wins=c.wins; state.fightCareer.losses=c.losses; state.fightCareer.injured=c.injured;
    return c;
  }
  window.ensureCombat237=ensureCombat237;
  window.ensureCombat232=ensureCombat237;
  window.ensureCombat229=ensureCombat237;
  window.ensureCombat226=ensureCombat237;

  function bar237(v){v=clamp237(v);return `<div class="miniBar"><div class="miniFill ${v<30?'low':''}" style="width:${v}%"></div></div>`}
  function status237(){
    const c=ensureCombat237();
    return card237(`<b>Combat Sports</b><br>
      Route: ${c.route==='glory'?'GLORY Kickboxing':'MMA / UFC'}<br>
      Niveau: ${c.level}<br>
      Skill: ${c.skill}% ${bar237(c.skill)}
      Discipline: ${c.discipline}% ${bar237(c.discipline)}
      Form: ${c.form}% ${bar237(c.form)}
      Freshness: ${c.freshness}% ${bar237(c.freshness)}
      Blessurerisico: ${c.injuryRisk}% ${bar237(c.injuryRisk)}
      <span class="mini">v23.7: training rows werken nu ook als oude popup geladen wordt.</span>`);
  }

  window.combatTrainingMenu237=function(){
    const c=ensureCombat237();
    let h=status237()+sec237('Training');
    h+=row237('🥊','Techniektraining','Combat skill omhoog, laag risico','train:tech',!c.active);
    h+=row237('🏃','Cardio / conditie','Form, fitness en stamina verbeteren','train:cardio',!c.active);
    h+=row237('🧤','Lichte sparring','Fight IQ en timing, matig risico','train:light',!c.active);
    h+=row237('🔥','Harde sparring','Snelle groei, hoog blessurerisico','train:hard',!c.active||c.injuryRisk>80||c.freshness<25);
    h+=row237('🧘','Discipline / gameplan','Discipline omhoog, minder risico','train:discipline',!c.active);
    modal237('🏋️','Training',h,'combatHub237()');
  };
  window.combatRecoveryMenu237=function(){
    const c=ensureCombat237();
    let h=status237()+sec237('Herstel');
    h+=row237('😴','Rustweek','Freshness omhoog, risico omlaag','recover:rest',!c.active);
    h+=row237('🧊','Fysio / ijsbad',`${money237(180)} · risico flink omlaag`,'recover:physio',!c.active||(state.money||0)<180);
    h+=row237('🏥','Medische check',`${money237(650)} · blessure sneller herstel`,'recover:medical',!c.active||(state.money||0)<650);
    modal237('🩹','Herstel',h,'combatHub237()');
  };
  window.combatHub237=function(){
    const c=ensureCombat237();
    let h=status237()+sec237('Combat');
    h+=row237('🏋️','Training','Techniek, cardio, sparring, discipline','menu:training',!c.active);
    h+=row237('🩹','Herstel','Rust, fysio, medische check','menu:recovery',!c.active);
    h+=row237('📝','Fight try-outs','Amateur/semi/pro unlocks','menu:tryouts');
    h+=row237('🥊','Fight Mode','Start fight als unlocked','menu:fight',!(c.active&&LEVELS237.indexOf(c.level)>=2&&c.freshness>=25&&c.injured<=0));
    modal237('🥊','Combat Sports',h,'closeModal()');
  };

  function doTrain237(kind){
    const c=ensureCombat237();
    if(!c.active){c.active=true;if(c.level==='none')c.level='gym';}
    let label='', type='good', hp=0;
    if(kind==='tech'){c.skill=clamp237(c.skill+r237(4,8));c.freshness=clamp237(c.freshness-r237(4,8));c.injuryRisk=clamp237(c.injuryRisk+r237(1,3));label='techniektraining';}
    if(kind==='cardio'){c.form=clamp237(c.form+r237(5,10));c.freshness=clamp237(c.freshness-r237(7,12));c.injuryRisk=clamp237(c.injuryRisk+r237(2,5));label='cardio/conditie';}
    if(kind==='light'){c.skill=clamp237(c.skill+r237(3,6));c.coachTrust=clamp237(c.coachTrust+r237(2,5));c.freshness=clamp237(c.freshness-r237(8,14));c.injuryRisk=clamp237(c.injuryRisk+r237(3,7));label='lichte sparring';}
    if(kind==='hard'){if(c.freshness<25)return toast237('Te weinig freshness. Herstel eerst.');c.skill=clamp237(c.skill+r237(6,12));c.form=clamp237(c.form+r237(2,8));c.freshness=clamp237(c.freshness-r237(15,24));c.injuryRisk=clamp237(c.injuryRisk+r237(10,22));label='harde sparring';type='warn';hp=-4;if(Math.random()<0.08+c.injuryRisk/500){c.injured=Math.max(c.injured,1);label+=' en raakte geblesseerd';type='bad';}}
    if(kind==='discipline'){c.discipline=clamp237(c.discipline+r237(5,10));c.coachTrust=clamp237(c.coachTrust+r237(2,6));c.injuryRisk=clamp237(c.injuryRisk-r237(4,10));label='discipline/gameplan';}
    state.talents=state.talents||{};
    state.talents.combat=clamp237(Math.max(state.talents.combat||0,c.skill));
    state.talents.discipline=clamp237(Math.max(state.talents.discipline||0,c.discipline));
    ensureCombat237();
    result237('🏋️','Combat training',`Ik deed ${label}.<br>Skill ${c.skill}% · discipline ${c.discipline}% · form ${c.form}% · freshness ${c.freshness}% · risico ${c.injuryRisk}%.`,{Fitness:2,Stamina:-6,Health:hp,Happiness:2},0,type,'combatTrainingMenu237()');
  }
  function doRecover237(kind){
    const c=ensureCombat237();
    if(!c.active){c.active=true;if(c.level==='none')c.level='gym';}
    if(kind==='rest'){c.freshness=clamp237(c.freshness+r237(18,30));c.injuryRisk=clamp237(c.injuryRisk-r237(8,18));}
    if(kind==='physio'){
      if((state.money||0)<180)return toast237('Niet genoeg geld.');
      state.money-=180;c.freshness=clamp237(c.freshness+15);c.injuryRisk=clamp237(c.injuryRisk-22);if(c.injured>0&&Math.random()<.45)c.injured--;
    }
    if(kind==='medical'){
      if((state.money||0)<650)return toast237('Niet genoeg geld.');
      state.money-=650;c.freshness=clamp237(c.freshness+12);c.injuryRisk=clamp237(c.injuryRisk-35);if(c.injured>0)c.injured--;
    }
    ensureCombat237();
    result237('🩹','Herstel',`Herstel uitgevoerd.<br>Freshness ${c.freshness}% · blessurerisico ${c.injuryRisk}% · blessure ${c.injured||0} jaar.`,{Health:5,Stamina:8,Happiness:1},0,'good','combatRecoveryMenu237()');
  }

  const textMap237=[
    [/techniektraining/i,'train:tech'],
    [/cardio|conditie/i,'train:cardio'],
    [/lichte sparring/i,'train:light'],
    [/harde sparring/i,'train:hard'],
    [/discipline|gameplan/i,'train:discipline'],
    [/rustweek/i,'recover:rest'],
    [/fysio|ijsbad/i,'recover:physio'],
    [/medische check/i,'recover:medical'],
    [/training$/i,'menu:training'],
    [/herstel$/i,'menu:recovery']
  ];
  function rowAction237(row){
    const text=((row.querySelector('.rTitle')?.textContent||'')+' '+(row.querySelector('.sub')?.textContent||'')+' '+(row.textContent||'')).trim();
    for(const [re,act] of textMap237){
      if(re.test(text))return act;
    }
    return null;
  }
  function patchTrainingRows237(root=document){
    try{
      const modal=document.getElementById('modal');
      if(!modal)return;
      modal.querySelectorAll('.row').forEach(row=>{
        const act=row.getAttribute(TRAIN_ATTR)||rowAction237(row);
        if(act){
          row.setAttribute(TRAIN_ATTR,act);
          row.removeAttribute('onclick');
          row.classList.remove('locked');
          row.style.pointerEvents='auto';
          row.style.touchAction='manipulation';
          row.style.position='relative';
          row.style.zIndex='40';
          row.style.cursor='pointer';
        }
      });
    }catch(e){}
  }
  window.patchTrainingRows237=patchTrainingRows237;

  function dispatch237(action){
    if(!action)return;
    if(action==='menu:training')return window.combatTrainingMenu237();
    if(action==='menu:recovery')return window.combatRecoveryMenu237();
    if(action==='menu:tryouts')return (typeof combatTryoutMenu232==='function'?combatTryoutMenu232():typeof combatTryoutMenu229==='function'?combatTryoutMenu229():toast237('Try-out menu niet gevonden.'));
    if(action==='menu:fight')return (typeof combatFightStart232==='function'?combatFightStart232():typeof combatFightStart229==='function'?combatFightStart229():toast237('Fight mode niet gevonden.'));
    if(action.startsWith('train:'))return doTrain237(action.split(':')[1]);
    if(action.startsWith('recover:'))return doRecover237(action.split(':')[1]);
  }
  window.dispatchTraining237=dispatch237;

  function bindGlobalTraining237(){
    if(document.__trainingGlobal237)return;
    document.__trainingGlobal237=true;
    const handler=function(ev){
      try{
        const modal=document.getElementById('modal');
        if(!modal||!modal.contains(ev.target))return;
        const row=ev.target.closest&&ev.target.closest(`[${TRAIN_ATTR}], #modal .row`);
        if(!row||!modal.contains(row))return;
        const act=row.getAttribute(TRAIN_ATTR)||rowAction237(row);
        if(!act)return;
        ev.preventDefault();
        ev.stopPropagation();
        dispatch237(act);
      }catch(e){console.warn('[v23.7 training tap]',e)}
    };
    document.addEventListener('click',handler,true);
    document.addEventListener('touchend',handler,true);
    document.addEventListener('pointerup',handler,true);
  }
  window.bindGlobalTraining237=bindGlobalTraining237;

  // Hard override older training/recovery entry points.
  window.combatTrainingMenu237=window.combatTrainingMenu237;
  window.combatTrainingMenu232=window.combatTrainingMenu237;
  window.combatTrainingMenu229=window.combatTrainingMenu237;
  window.combatTrainingMenu227=window.combatTrainingMenu237;
  window.combatTrainingMenu226=window.combatTrainingMenu237;
  window.combatRecoveryMenu237=window.combatRecoveryMenu237;
  window.combatRecoveryMenu232=window.combatRecoveryMenu237;
  window.combatRecoveryMenu229=window.combatRecoveryMenu237;
  window.combatRecoveryMenu227=window.combatRecoveryMenu237;
  window.combatRecoveryMenu226=window.combatRecoveryMenu237;
  try{
    combatTrainingMenu232=window.combatTrainingMenu237; combatTrainingMenu229=window.combatTrainingMenu237; combatTrainingMenu227=window.combatTrainingMenu237; combatTrainingMenu226=window.combatTrainingMenu237;
    combatRecoveryMenu232=window.combatRecoveryMenu237; combatRecoveryMenu229=window.combatRecoveryMenu237; combatRecoveryMenu227=window.combatRecoveryMenu237; combatRecoveryMenu226=window.combatRecoveryMenu237;
  }catch(e){}
  window.combatTrain237=doTrain237;
  window.combatTrain232=doTrain237;
  window.combatTrain229=doTrain237;
  window.combatTrain227=doTrain237;
  window.combatTrain226=doTrain237;
  window.combatRecover237=doRecover237;
  window.combatRecover232=doRecover237;
  window.combatRecover229=doRecover237;
  window.combatRecover227=doRecover237;
  window.combatRecover226=doRecover237;
  window.fightTrain118=function(kind){return doTrain237(kind==='cardio'?'cardio':kind==='discipline'?'discipline':kind==='spar'?'light':'tech')};
  window.combatAction184=function(a){
    if(a==='technique')return doTrain237('tech');
    if(a==='cardio')return doTrain237('cardio');
    if(a==='light')return doTrain237('light');
    if(a==='hard')return doTrain237('hard');
    if(a==='recovery')return window.combatRecoveryMenu237();
    if(a==='fight')return dispatch237('menu:fight');
    return window.combatHub237();
  };

  const oldShow237=window.showModal||(typeof showModal==='function'?showModal:null);
  if(oldShow237 && !oldShow237.__training237){
    window.showModal=function(html){
      const ret=oldShow237.call(this,html);
      setTimeout(()=>{patchTrainingRows237(document);bindGlobalTraining237()},0);
      return ret;
    };
    window.showModal.__training237=true;
    try{showModal=window.showModal}catch(e){}
  }
  const oldRender237=window.render||(typeof render==='function'?render:null);
  if(oldRender237 && !oldRender237.__training237){
    window.render=function(){
      try{ensureCombat237()}catch(e){}
      const ret=oldRender237.apply(this,arguments);
      setTimeout(()=>patchTrainingRows237(document),0);
      return ret;
    };
    window.render.__training237=true;
    try{render=window.render}catch(e){}
  }
  const oldSave237=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave237 && !oldSave237.__training237){
    window.safeSave=function(){try{ensureCombat237()}catch(e){}return oldSave237.apply(this,arguments)};
    window.safeSave.__training237=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  window.debugTrainingTap237=function(){
    let h=status237()+sec237('Tap test');
    h+=row237('🥊','Techniektraining','Test training action','train:tech');
    h+=row237('🏃','Cardio / conditie','Test cardio action','train:cardio');
    h+=row237('😴','Rustweek','Test recovery action','recover:rest');
    modal237('🛠️','Training tap debug',h,'closeModal()');
  };

  bindGlobalTraining237();
  setTimeout(()=>{try{ensureCombat237();patchTrainingRows237(document);safeSave();render()}catch(e){}},400);
})();
