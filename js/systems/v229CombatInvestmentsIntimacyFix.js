
/* v22.9 Combat Execution + Investment Shares + Adult Intimacy
   - Combat menus hard override old broken menus and every action shows a result.
   - Investments can be bought by typed shares OR typed amount; same assets aggregate together.
   - Vastgoed/crypto/index/etc move yearly up/down with clearer market changes.
   - Adult intimacy/FWB integrated via partner/friends/adult classmates/dates, 18+ only, non-graphic.
*/
(function(){
  function clamp229(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r229(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick229(a){return a[Math.floor(Math.random()*a.length)]}
  function money229(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast229(t){try{toast(t)}catch(e){console.log(t)}}
  function apply229(s){try{applyStats(s||{})}catch(e){}}
  function saveRender229(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function rr229(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function sec229(t){return `<div class="section">${t}</div>`}
  function card229(h){return `<div class="card">${h}</div>`}
  function modal229(icon,title,body,back='closeModal()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody v229Body">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`);
    setTimeout(clickFix229,0);
  }
  function result229(icon,title,txt,stats={},cash=0,type='good',back='closeModal()'){
    if(cash)state.money=(state.money||0)+cash;
    apply229(stats);
    try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(e){}
    saveRender229();
    const color=type==='bad'?'#ff7669':type==='warn'?'#ffd166':'#63dff0';
    modal229(icon,title,card229(`<b style="color:${color}">${title}</b><br>${txt}<br><br><span class="mini">Actie verwerkt in je save.</span>`),back);
  }
  function clickFix229(){
    try{
      const m=document.getElementById('modal');
      if(m)m.style.pointerEvents='auto';
      document.querySelectorAll('#modal .row,#modal .btn').forEach(el=>{
        el.style.pointerEvents='auto';
        el.style.touchAction='manipulation';
        el.style.position='relative';
        el.style.zIndex='9';
      });
    }catch(e){}
  }

  /* ================= COMBAT ================= */
  function cStat229(k){
    const s=state||{}, st=s.stats||{}, t=s.talents||{}, c=s.combat229||s.combat226||{}, cs=s.combatSports||{}, fc=s.fightCareer||{};
    if(k==='combat')return clamp229(Math.max(t.combat||0,t.fight||0,t.martialArts||0,c.skill||0,cs.skill||0,fc.skill||0,s.combat||0));
    if(k==='discipline')return clamp229(Math.max(t.discipline||0,c.discipline||0,cs.discipline||0,fc.discipline||0,st.Discipline||0,s.discipline||0));
    if(k==='fitness')return clamp229(Math.max(s.fitness||0,st.Fitness||0,50));
    if(k==='stamina')return clamp229(Math.max(s.stamina||0,st.Stamina||0,50));
    if(k==='health')return clamp229(Math.max(st.Health||0,s.health||0,50));
    return 0;
  }
  function bar229(v){v=clamp229(v);return `<div class="miniBar"><div class="miniFill ${v<30?'low':''}" style="width:${v}%"></div></div>`}
  const CLEVELS229=['none','gym','amateur','semipro','regional','prospect','pro','ranked','contender','title','champion'];
  const CLABEL229={none:'Geen route',gym:'Lokale gym',amateur:'Amateur',semipro:'Semi-pro',regional:'Regionaal',prospect:'Prospect',pro:'Pro',ranked:'Ranked',contender:'Contender',title:'Title fight',champion:'Champion'};
  function normLevel229(l){
    l=String(l||'none').toLowerCase();
    if(['trial','local_gym','local gym','ufc','glory','mma','kickboxing'].includes(l))return 'gym';
    if(['semi','semi-pro','semi_pro'].includes(l))return 'semipro';
    if(!CLEVELS229.includes(l))return 'gym';
    return l;
  }
  function ensureCombat229(){
    state.combat229=state.combat229||{};
    const c=state.combat229, old=state.combat226||{}, cs=state.combatSports||{}, fc=state.fightCareer||{};
    c.route=(String(c.route||old.route||cs.route||fc.level||'mma').includes('glory')||String(c.route||'').includes('kick'))?'glory':'mma';
    c.active=!!(c.active||old.active||cs.active||cs.access?.gymJoined||cs.access?.gymMember||fc.active);
    let lvl=c.level||old.level||cs.level||fc.combatLevel||fc.stage||'none';
    if(cs.access?.amateurDebut && ['none','gym'].includes(normLevel229(lvl)))lvl='amateur';
    if(fc.active && ['none','gym'].includes(normLevel229(lvl)) && (fc.wins||fc.losses||0)>0)lvl='amateur';
    c.level=normLevel229(lvl);
    if(c.active && c.level==='none')c.level='gym';
    c.skill=clamp229(c.skill ?? old.skill ?? cs.skill ?? fc.skill ?? cStat229('combat'));
    c.discipline=clamp229(c.discipline ?? old.discipline ?? cs.discipline ?? fc.discipline ?? cStat229('discipline'));
    c.form=clamp229(c.form ?? old.form ?? cs.form ?? fc.form ?? 50);
    c.coachTrust=clamp229(c.coachTrust ?? old.coachTrust ?? cs.coachTrust ?? fc.coachTrust ?? 50);
    c.freshness=clamp229(c.freshness ?? old.freshness ?? cs.health?.freshness ?? 65);
    c.injuryRisk=clamp229(c.injuryRisk ?? old.injuryRisk ?? cs.health?.injuryRisk ?? fc.injuryRisk ?? 20);
    c.fame=clamp229(c.fame ?? old.fame ?? cs.fame ?? fc.fame ?? 0);
    c.wins=Number(c.wins ?? old.wins ?? cs.record?.wins ?? fc.wins ?? 0);
    c.losses=Number(c.losses ?? old.losses ?? cs.record?.losses ?? fc.losses ?? 0);
    c.kos=Number(c.kos ?? old.kos ?? fc.kos ?? 0);
    c.subs=Number(c.subs ?? old.subs ?? fc.subs ?? 0);
    c.injured=Number(c.injured ?? old.injured ?? fc.injured ?? 0);
    // sync old objects
    state.combat226=Object.assign(state.combat226||{},c);
    state.combatSports=state.combatSports||{};
    state.combatSports.route=c.route; state.combatSports.level=c.level; state.combatSports.active=c.active; state.combatSports.skill=c.skill; state.combatSports.form=c.form; state.combatSports.coachTrust=c.coachTrust; state.combatSports.fame=c.fame;
    state.combatSports.record={wins:c.wins,losses:c.losses};
    state.combatSports.access=state.combatSports.access||{};
    state.combatSports.access.gymMember=c.active; state.combatSports.access.gymJoined=c.active; state.combatSports.access.sparringApproved=c.active&&c.skill>=20; state.combatSports.access.amateurDebut=CLEVELS229.indexOf(c.level)>=CLEVELS229.indexOf('amateur');
    state.combatSports.health=state.combatSports.health||{}; state.combatSports.health.freshness=c.freshness; state.combatSports.health.injuryRisk=c.injuryRisk;
    state.fightCareer=state.fightCareer||{}; state.fightCareer.active=c.active; state.fightCareer.level=c.route; state.fightCareer.combatLevel=c.level; state.fightCareer.skill=c.skill; state.fightCareer.form=c.form; state.fightCareer.coachTrust=c.coachTrust; state.fightCareer.fame=c.fame; state.fightCareer.wins=c.wins; state.fightCareer.losses=c.losses; state.fightCareer.injured=c.injured;
    return c;
  }
  window.ensureCombat229=ensureCombat229;
  window.ensureCombat227=ensureCombat229;
  window.ensureCombat226=ensureCombat229;

  function combatStatus229(){
    const c=ensureCombat229(), hard=cStat229('discipline')>=50 && cStat229('combat')>=60;
    return card229(`<b>Combat Sports</b><br>
      Route: ${c.route==='glory'?'GLORY Kickboxing':'MMA / UFC'}<br>
      Niveau: ${CLABEL229[c.level]||c.level}<br>
      Record: ${c.wins}-${c.losses} · KO ${c.kos} · SUB ${c.subs}<br>
      Combat: ${cStat229('combat')}% ${bar229(cStat229('combat'))}
      Discipline: ${cStat229('discipline')}% ${bar229(cStat229('discipline'))}
      Skill: ${c.skill}% ${bar229(c.skill)}
      Form: ${c.form}% ${bar229(c.form)}
      Coach trust: ${c.coachTrust}% ${bar229(c.coachTrust)}
      Freshness: ${c.freshness}% ${bar229(c.freshness)}
      Blessurerisico: ${c.injuryRisk}% ${bar229(c.injuryRisk)}
      ${c.injured>0?`<br><span style="color:#ff7669"><b>Geblesseerd:</b> ${c.injured} jaar</span>`:''}
      <br><span class="mini">Hard rule: 50% discipline + 60% combat = automatisch aangenomen. Status: ${hard?'✅ gegarandeerd':'❌ kansberekening'}</span>`);
  }
  window.combatHub229=function(){
    const c=ensureCombat229();
    const fightUnlocked=c.active && CLEVELS229.indexOf(c.level)>=CLEVELS229.indexOf('amateur') && c.freshness>=25 && c.injured<=0;
    let h=combatStatus229();
    h+=sec229('Combat');
    h+=rr229('🧭','Route kiezen','MMA/UFC of GLORY Kickboxing','combatRouteMenu229()');
    h+=rr229('📝','Fight try-outs','Gym, amateur, semi-pro, pro','combatTryoutMenu229()');
    h+=rr229('🏋️','Training','Techniek, cardio, sparring, discipline','combatTrainingMenu229()',!c.active);
    h+=rr229('🥊','Fight Mode',fightUnlocked?'Start een 3-ronde fight':'Na amateur try-out/level en genoeg freshness','combatFightStart229()',!fightUnlocked);
    h+=rr229('🩹','Herstel','Rust, fysio, medical check','combatRecoveryMenu229()',!c.active);
    h+=rr229('📄','Contract / status','Salaris, record en route sync','combatContract229()',!c.active);
    modal229('🥊','Combat Sports',h,'closeModal()');
  };
  ['combatHub226','combatHub227','combatSportsHub184','fightCareerScreen','gloryUfcCareerScreen','combatCareerHub177'].forEach(n=>{window[n]=window.combatHub229; try{eval(n+'=window.combatHub229')}catch(e){}});
  window.combatRouteMenu229=function(){
    let h=combatStatus229();
    h+=sec229('Route kiezen');
    h+=rr229('🥋','MMA / UFC route','Striking, grappling, wrestling en submissions','combatSetRoute229("mma")');
    h+=rr229('🥊','GLORY Kickboxing route','Stand-up, low kicks, defense en KO bonus','combatSetRoute229("glory")');
    modal229('🧭','Combat route kiezen',h,'combatHub229()');
  };
  ['combatRouteMenu226','combatRouteMenu227','combatRoute184'].forEach(n=>{window[n]=window.combatRouteMenu229; try{eval(n+'=window.combatRouteMenu229')}catch(e){}});
  window.combatSetRoute229=function(route){
    const c=ensureCombat229(); c.route=route==='glory'?'glory':'mma'; c.active=true; if(c.level==='none')c.level='gym';
    result229(c.route==='glory'?'🥊':'🥋','Combat route',`Ik koos de ${c.route==='glory'?'GLORY Kickboxing':'MMA / UFC'} route.`,{Happiness:3,Smarts:1},0,'good','combatHub229()');
  };
  window.setCombatRoute184=window.combatSetRoute229; window.combatSetRoute226=window.combatSetRoute229; window.combatSetRoute227=window.combatSetRoute229;
  function tryChance229(target){
    if(cStat229('discipline')>=50 && cStat229('combat')>=60)return {chance:100,hard:true};
    const diff={gym:15,amateur:35,semipro:52,regional:58,prospect:66,pro:78}[target]||35;
    const c=ensureCombat229();
    const chance=Math.round(cStat229('combat')*.43+cStat229('discipline')*.30+cStat229('fitness')*.10+cStat229('stamina')*.07+cStat229('health')*.07+c.form*.06+c.coachTrust*.05-diff+35);
    return {chance:clamp229(chance,5,95),hard:false};
  }
  window.combatTryoutMenu229=function(){
    let h=combatStatus229();
    h+=sec229('Try-outs');
    [['gym','🏚️','Lokale fight gym','start route en trainen'],['amateur','🥉','Amateur try-out','unlock Fight Mode'],['semipro','🥈','Semi-pro try-out','kleine betalingen en serieuzere fights'],['pro','🥇','Pro try-out','pro circuit en contractstatus']].forEach(x=>{
      const ch=tryChance229(x[0]);
      h+=rr229(x[1],x[2],`${x[3]} · kans ${ch.chance}%${ch.hard?' · gegarandeerd':''}`,`combatTryout229('${x[0]}')`,state.age<12);
    });
    modal229('📝','Fight try-outs',h,'combatHub229()');
  };
  window.combatTryoutMenu226=window.combatTryoutMenu229; window.combatTryoutMenu227=window.combatTryoutMenu229;
  window.combatTryout229=function(target){
    if(state.age<12)return toast229('Fight try-outs kan vanaf 12 jaar.');
    const c=ensureCombat229(), ch=tryChance229(target), ok=ch.hard || Math.random()*100<ch.chance;
    c.active=true;
    if(ok){
      c.level=target==='gym'?'gym':target;
      c.skill=clamp229(Math.max(c.skill,cStat229('combat'))+r229(3,8));
      c.discipline=clamp229(Math.max(c.discipline,cStat229('discipline'))+r229(1,6));
      c.form=clamp229(c.form+r229(4,12)); c.coachTrust=clamp229(c.coachTrust+r229(5,14));
      if(['semipro','pro'].includes(c.level))c.salaryAnnual=c.level==='pro'?r229(18000,65000):r229(2500,12000);
      ensureCombat229();
      result229('📝','Fight try-out',`Ik werd aangenomen voor ${CLABEL229[c.level]}. ${ch.hard?'Door 50% discipline + 60% combat was dit gegarandeerd.':`Kans was ${ch.chance}%.`} ${CLEVELS229.indexOf(c.level)>=CLEVELS229.indexOf('amateur')?'Fight Mode is nu unlocked.':''}`,{Happiness:10,Fitness:2,Stamina:-8},0,'good','combatHub229()');
    }else{
      c.discipline=clamp229(c.discipline+2); c.form=clamp229(c.form-4); ensureCombat229();
      result229('📝','Try-out mislukt',`Ik werd niet aangenomen. Kans was ${ch.chance}%. Train combat en discipline.`,{Happiness:-5,Stamina:-8},0,'warn','combatTryoutMenu229()');
    }
  };
  window.combatTryout226=window.combatTryout229; window.combatTryout227=window.combatTryout229;
  window.combatTrainingMenu229=function(){
    const c=ensureCombat229();
    let h=combatStatus229();
    h+=sec229('Training');
    h+=rr229('🥊','Techniektraining','Combat skill omhoog, laag risico','combatTrain229("tech")');
    h+=rr229('🏃','Cardio / conditie','Form, fitness en stamina verbeteren','combatTrain229("cardio")');
    h+=rr229('🧤','Lichte sparring','Fight IQ en timing, matig risico','combatTrain229("light")');
    h+=rr229('🔥','Harde sparring','Snelle groei, hoog blessurerisico','combatTrain229("hard")',c.injuryRisk>70||c.freshness<35);
    h+=rr229('🧘','Discipline / gameplan','Discipline omhoog, minder risico','combatTrain229("discipline")');
    modal229('🏋️','Training',h,'combatHub229()');
  };
  window.combatTrainingMenu226=window.combatTrainingMenu229; window.combatTrainingMenu227=window.combatTrainingMenu229;
  window.combatTrain229=function(kind){
    const c=ensureCombat229(); if(!c.active)return toast229('Doe eerst een try-out of kies een route.');
    let label='training', type='good', hp=0;
    if(kind==='tech'){c.skill=clamp229(c.skill+r229(4,8));c.freshness=clamp229(c.freshness-r229(4,8));c.injuryRisk=clamp229(c.injuryRisk+r229(1,3));label='techniektraining';}
    if(kind==='cardio'){c.form=clamp229(c.form+r229(5,10));c.freshness=clamp229(c.freshness-r229(7,12));c.injuryRisk=clamp229(c.injuryRisk+r229(2,5));label='cardio/conditie';}
    if(kind==='light'){c.skill=clamp229(c.skill+r229(3,6));c.coachTrust=clamp229(c.coachTrust+r229(2,5));c.freshness=clamp229(c.freshness-r229(8,14));c.injuryRisk=clamp229(c.injuryRisk+r229(3,7));label='lichte sparring';}
    if(kind==='hard'){c.skill=clamp229(c.skill+r229(6,12));c.form=clamp229(c.form+r229(2,8));c.freshness=clamp229(c.freshness-r229(15,24));c.injuryRisk=clamp229(c.injuryRisk+r229(10,22));label='harde sparring';type='warn';hp=-4;if(Math.random()<0.08+c.injuryRisk/500){c.injured=Math.max(c.injured,1);label+=' en raakte geblesseerd';type='bad';}}
    if(kind==='discipline'){c.discipline=clamp229(c.discipline+r229(5,10));c.coachTrust=clamp229(c.coachTrust+r229(2,6));c.injuryRisk=clamp229(c.injuryRisk-r229(4,10));label='discipline/gameplan';}
    state.talents=state.talents||{}; state.talents.combat=clamp229(Math.max(state.talents.combat||0,c.skill)); state.talents.discipline=clamp229(Math.max(state.talents.discipline||0,c.discipline));
    ensureCombat229();
    result229('🏋️','Combat training',`Ik deed ${label}.<br>Skill ${c.skill}% · discipline ${c.discipline}% · form ${c.form}% · freshness ${c.freshness}% · risico ${c.injuryRisk}%.`,{Fitness:2,Stamina:-6,Health:hp,Happiness:2},0,type,'combatTrainingMenu229()');
  };
  window.combatTrain226=window.combatTrain229; window.combatTrain227=window.combatTrain229;
  window.combatFightStart229=function(){
    const c=ensureCombat229();
    const ok=c.active && CLEVELS229.indexOf(c.level)>=CLEVELS229.indexOf('amateur') && c.freshness>=25 && c.injured<=0;
    if(!ok)return toast229('Je bent nog niet klaar voor wedstrijden. Doe amateur try-out/level up en herstel genoeg.');
    c.currentFight={round:1,playerHP:100,oppHP:100,playerScore:0,oppScore:0,oppSkill:clamp229(c.skill+r229(-12,14)),log:[],opponent:pick229(['Rico Storm','Dante Silva','Kenji Tanaka','Miguel Vega','Nordin Blade'])};
    combatFightRound229();
  };
  window.combatFightStart226=window.combatFightStart229; window.combatFightStart227=window.combatFightStart229; window.fightMatch118=window.combatFightStart229; window.combatAdvanced184=window.combatFightStart229;
  function combatFightRound229(){
    const c=ensureCombat229(), f=c.currentFight;
    let h=card229(`<b>${f.opponent}</b><br>Ronde ${f.round}/3<br>Jij HP ${f.playerHP} · Opponent HP ${f.oppHP}<br>Score ${f.playerScore}-${f.oppScore}<br><span class="mini">Kies je tactiek. Dit werkt nu direct met resultaat per ronde.</span>`);
    h+=sec229('Tactiek');
    if(c.route==='glory'){
      [['pressure','🔥','Druk zetten','veel volume, hoog stamina-verbruik'],['counter','🛡️','Counterstriken','veilig, slim'],['lowkick','🦵','Low kicks','sterker later in de fight'],['points','📋','Punten pakken','veilig via scorecards']].forEach(x=>h+=rr229(x[1],x[2],x[3],`combatFightChoice229('${x[0]}')`));
    }else{
      [['jab','🥊','Striking openen','veilig op punten'],['grapple','🤼','Worstelen / grappling','control en submission kans'],['counter','🛡️','Counteren','minder risico'],['allin','🔥','Alles of niets','grote finishkans, hoog risico']].forEach(x=>h+=rr229(x[1],x[2],x[3],`combatFightChoice229('${x[0]}')`));
    }
    modal229('🥊','Fight Mode',h,'combatHub229()');
  }
  window.combatFightChoice229=function(choice){
    const c=ensureCombat229(), f=c.currentFight; if(!f)return combatFightStart229();
    let power=c.skill*.40+c.form*.20+c.discipline*.15+c.freshness*.10+c.coachTrust*.05+r229(-18,24), risk=8, text='';
    if(choice==='jab'||choice==='points'){power+=5;risk-=2;text='Ik vocht slim op punten.'}
    if(choice==='grapple'){power+=c.discipline*.10;risk+=3;text='Ik zocht grappling en controle.'}
    if(choice==='counter'){power+=c.discipline*.08;risk-=5;text='Ik wachtte op counters.'}
    if(choice==='allin'){power+=18;risk+=18;text='Ik ging alles of niets.'}
    if(choice==='pressure'){power+=14;risk+=10;text='Ik zette druk met volume.'}
    if(choice==='lowkick'){power+=f.round>=2?18:7;risk+=4;text='Ik werkte met low kicks.'}
    const margin=power-(f.oppSkill+r229(-12,18));
    let pd=0,od=0,ps=0,os=0;
    if(margin>18){od=r229(20,38);pd=r229(2,10);ps=10;os=8;text+=' Ik won de ronde duidelijk.'}
    else if(margin>3){od=r229(12,24);pd=r229(5,15);ps=10;os=9;text+=' Ik pakte de ronde nipt.'}
    else if(margin>-8){od=r229(7,17);pd=r229(7,17);ps=10;os=10;text+=' Close ronde.'}
    else{od=r229(3,10);pd=r229(14,28);ps=8;os=10;text+=' Ik verloor de ronde.'}
    if(choice==='allin'&&Math.random()<0.12+c.skill/500){od+=45;text+=' Ik raakte hem bijna perfect.'}
    f.playerHP=clamp229(f.playerHP-pd,0,100); f.oppHP=clamp229(f.oppHP-od,0,100); f.playerScore+=ps; f.oppScore+=os; f.log.push(`R${f.round}: ${text}`);
    if(f.oppHP<=0 || f.playerHP<=0 || f.round>=3)return combatFightFinish229();
    f.round++; combatFightRound229();
  };
  window.combatFightChoice226=window.combatFightChoice229; window.combatFightChoice227=window.combatFightChoice229;
  function combatFightFinish229(){
    const c=ensureCombat229(), f=c.currentFight;
    let win=false, method='decision';
    if(f.oppHP<=0){win=true;method='KO/TKO';c.kos++}
    else if(f.playerHP<=0){win=false;method='TKO verlies'}
    else win=f.playerScore>=f.oppScore;
    if(c.route==='mma'&&win&&method==='decision'&&Math.random()<.10+c.discipline/500){method='submission';c.subs++}
    if(win){c.wins++;c.form=clamp229(c.form+r229(4,10));c.coachTrust=clamp229(c.coachTrust+r229(3,8));c.fame=clamp229(c.fame+r229(2,7))}
    else{c.losses++;c.form=clamp229(c.form-r229(4,10));c.coachTrust=clamp229(c.coachTrust-r229(2,7))}
    c.freshness=clamp229(c.freshness-r229(14,24)); c.injuryRisk=clamp229(c.injuryRisk+r229(8,18));
    if(Math.random()<0.04+c.injuryRisk/450){c.injured=Math.max(c.injured,1)}
    c.currentFight=null; ensureCombat229();
    result229('🥊','Fight Night',`${win?'Ik won':'Ik verloor'} via ${method}.<br>${f.log.join('<br>')}<br><br>Record: ${c.wins}-${c.losses}.`,{Happiness:win?10:-7,Fitness:2,Health:win?-3:-8,Stamina:-18},0,win?'good':'bad','combatHub229()');
  }
  window.combatRecoveryMenu229=function(){
    let c=ensureCombat229(), h=combatStatus229();
    h+=sec229('Herstel');
    h+=rr229('😴','Rustweek','Freshness omhoog, risico omlaag','combatRecover229("rest")');
    h+=rr229('🧊','Fysio / ijsbad',`${money229(180)} · risico flink omlaag`,'combatRecover229("physio")',(state.money||0)<180);
    h+=rr229('🏥','Medische check',`${money229(650)} · blessure sneller herstel`,'combatRecover229("medical")',(state.money||0)<650);
    modal229('🩹','Herstel',h,'combatHub229()');
  };
  window.combatRecoveryMenu226=window.combatRecoveryMenu229; window.combatRecoveryMenu227=window.combatRecoveryMenu229; window.fightRecoveryScreen183=window.combatRecoveryMenu229;
  window.combatRecover229=function(kind){
    const c=ensureCombat229(); let cost=0;
    if(kind==='rest'){c.freshness=clamp229(c.freshness+r229(18,30));c.injuryRisk=clamp229(c.injuryRisk-r229(8,18))}
    if(kind==='physio'){cost=180;if((state.money||0)<cost)return toast229('Niet genoeg geld.');state.money-=cost;c.freshness=clamp229(c.freshness+15);c.injuryRisk=clamp229(c.injuryRisk-22)}
    if(kind==='medical'){cost=650;if((state.money||0)<cost)return toast229('Niet genoeg geld.');state.money-=cost;c.freshness=clamp229(c.freshness+12);c.injuryRisk=clamp229(c.injuryRisk-35);if(c.injured>0)c.injured--}
    ensureCombat229(); result229('🩹','Herstel','Ik werkte aan herstel. Freshness en blessurerisico zijn bijgewerkt.',{Health:5,Stamina:8,Happiness:1},0,'good','combatHub229()');
  };
  window.combatContract229=function(){
    const c=ensureCombat229();
    modal229('📄','Combat status',card229(`<b>Route:</b> ${c.route==='glory'?'GLORY':'MMA/UFC'}<br><b>Niveau:</b> ${CLABEL229[c.level]}<br><b>Record:</b> ${c.wins}-${c.losses}<br><b>Salaris:</b> ${money229(c.salaryAnnual||0)}/jaar<br><b>Fight Mode:</b> ${CLEVELS229.indexOf(c.level)>=2?'unlocked':'nog locked'}`),'combatHub229()');
  };
  window.combatAction184=function(a){
    if(a==='join')return combatTryout229('gym');
    if(a==='technique')return combatTrain229('tech');
    if(a==='cardio')return combatTrain229('cardio');
    if(a==='light')return combatTrain229('light');
    if(a==='hard')return combatTrain229('hard');
    if(a==='fight')return combatFightStart229();
    if(a==='recovery')return combatRecoveryMenu229();
    return combatHub229();
  };
  window.combatCareerStage204=function(stage){
    if(stage==='glory')return combatSetRoute229('glory');
    if(stage==='ufc')return combatSetRoute229('mma');
    if(stage==='amateur')return combatTryout229('amateur');
    if(stage==='semipro')return combatTryout229('semipro');
    if(stage==='pro')return combatTryout229('pro');
    return combatHub229();
  };
  window.fightTryout118=function(route){combatSetRoute229(route==='glory'||route==='kickbox'?'glory':'mma');return combatTryoutMenu229()};
  window.fightTrain118=function(kind){return combatTrain229(kind==='cardio'?'cardio':kind==='discipline'?'discipline':kind==='spar'?'light':'tech')};
  window.fightLevelUp118=function(){return combatTryoutMenu229()};
  window.fightManager118=window.combatContract229;
  window.fightRetire118=function(){const c=ensureCombat229();c.active=false;c.level='none';result229('🚪','Fight career','Ik stopte met mijn fight career.',{Happiness:1},0,'warn','combatHub229()')};

  window.sportCombatMasterHub204=function(){
    let h=card229('<b>Sport & Combat</b><br>Alles staat nu onder één werkende hub. Oude kapotte circuit/route-knoppen zijn vervangen.');
    h+=sec229('Sport');
    h+=rr229('💪','Gym / algemene training','Fitness, stamina en health basis','gymScreen()',typeof gymScreen!=='function');
    h+=rr229('⚽','Football Career','Club, academy, contract, vorm en voetbalroute','footballCareerScreen()',typeof footballCareerScreen!=='function');
    h+=sec229('Combat');
    h+=rr229('🥊','Combat Sports','MMA/UFC + GLORY, try-outs, training, fight mode en herstel','combatHub229()',state.age<12);
    h+=rr229('🤼','WWE route','Promo skill, ring work, storylines, NXT en main roster','wrestlingCareerScreen163()',typeof wrestlingCareerScreen163!=='function'||state.age<18);
    h+=rr229('🏆','Rankings & Tactical Fights','Rankings/titles als extra sportmodule','sportsRankingsHub164()',typeof sportsRankingsHub164!=='function');
    modal229('🥊','Sport & Combat',h,'closeModal()');
  };

  /* ================= INVESTMENTS SHARES ================= */
  const IMETA229={
    savings:{icon:'🏦',name:'Spaarrekening',price:1,minShares:100,range:[1,4],crash:0,desc:'Rustig, klein rendement.'},
    index:{icon:'📈',name:'Indexfonds',price:50,minShares:1,range:[-12,18],crash:.04,desc:'Breed fonds met normale schommelingen.'},
    crypto:{icon:'🪙',name:'Crypto',price:250,minShares:0.01,range:[-65,110],crash:.13,desc:'Extreem volatiel: grote winst of zware daling.'},
    realestate:{icon:'🏢',name:'Vastgoedfonds',price:1000,minShares:1,range:[-15,24],crash:.05,desc:'Vastgoed kan huurmarkt/waarde volgen.'},
    scam:{icon:'⚠️',name:'Vage garantie investering',price:100,minShares:1,range:[-100,140],crash:.38,desc:'Hoog risico, vaak ellende.'}
  };
  function ensureInvest229(){
    state.lifestyle=state.lifestyle||{items:[],investments:[],businesses:[],loans:[]};
    state.lifestyle.investments=state.lifestyle.investments||[];
    const grouped={};
    state.lifestyle.investments.forEach(inv=>{
      const type=inv.type||'index', m=IMETA229[type]||IMETA229.index;
      const value=Number(inv.value||0), price=Number(inv.price||m.price), shares=Number(inv.shares|| (price?value/price:0));
      if(!grouped[type])grouped[type]={type,name:m.name,icon:m.icon,shares:0,price:price||m.price,value:0,costBasis:0,startedAge:inv.startedAge||state.age,history:[]};
      grouped[type].shares+=shares;
      grouped[type].costBasis+=Number(inv.costBasis||inv.amountInvested||value||shares*price);
      grouped[type].price=Number(inv.price||grouped[type].price||m.price);
      grouped[type].value=Math.round(grouped[type].shares*grouped[type].price);
      if(inv.history)grouped[type].history=(grouped[type].history||[]).concat(inv.history).slice(-8);
    });
    state.lifestyle.investments=Object.values(grouped).map(inv=>{inv.value=Math.round(inv.shares*inv.price); return inv;});
    return state.lifestyle.investments;
  }
  window.ensureInvest229=ensureInvest229;
  function invTotals229(){return ensureInvest229().reduce((s,i)=>s+(i.value||0),0)}
  function invLine229(inv){
    const gain=(inv.value||0)-(inv.costBasis||0);
    const pct=inv.costBasis?Math.round(gain/inv.costBasis*100):0;
    return `${inv.icon||'📈'} ${inv.name}<br><span class="mini">${Number(inv.shares).toLocaleString('nl-NL',{maximumFractionDigits:4})} aandelen · koers ${money229(inv.price)} · waarde ${money229(inv.value)} · resultaat ${gain>=0?'+':''}${money229(gain)} (${pct>=0?'+':''}${pct}%)</span>`;
  }
  window.investmentHub165=function(){
    const cur=ensureInvest229().map((inv,i)=>rr229(inv.icon||'📈',inv.name,`${Number(inv.shares).toLocaleString('nl-NL',{maximumFractionDigits:4})} aandelen · waarde ${money229(inv.value)} · klik voor beheer`,`investmentDetail229('${inv.type}')`)).join('')||card229('Nog geen investeringen.');
    let h=card229(`<b>Investeringen</b><br>Totale waarde: ${money229(invTotals229())}<br><span class="mini">Zelfde type wordt bij elkaar opgeteld. Vastgoed/crypto/index bewegen jaarlijks omhoog én omlaag.</span>`);
    h+=sec229('Huidig'); h+=cur;
    h+=sec229('Nieuw kopen');
    Object.entries(IMETA229).forEach(([k,m])=>h+=rr229(m.icon,m.name,`${m.desc} · koers ${money229(m.price)} · min ${m.minShares} aandeel`,`investAmount165('${k}')`));
    modal229('📈','Investeren',h,'moneyLifestyleHub165()');
  };
  window.investAmount165=function(type){
    const m=IMETA229[type]||IMETA229.index;
    let h=card229(`<b>${m.icon} ${m.name}</b><br>Koers: ${money229(m.price)} per aandeel<br>Minimaal: ${m.minShares} aandeel<br>${m.desc}`);
    h+=`<div class="card"><label class="mini">Aantal aandelen</label><input id="invShares229" class="input" type="number" step="0.01" min="0" placeholder="bijv. 10"><button class="btn" onclick="buyInvestmentShares229('${type}')">Koop aantal aandelen</button></div>`;
    h+=`<div class="card"><label class="mini">Of bedrag in euro</label><input id="invAmount229" class="input" type="number" step="1" min="0" placeholder="bijv. 2500"><button class="btn" onclick="buyInvestmentAmount229('${type}')">Investeer bedrag</button></div>`;
    [m.price*m.minShares,500,1000,2500,5000,10000,25000,100000].filter(x=>x>=m.price*m.minShares).forEach(v=>h+=rr229('💰',money229(v),`Koop automatisch ${(v/m.price).toFixed(4)} aandelen`,`buyInvestment229('${type}',${v/m.price})`,(state.money||0)<v));
    modal229(m.icon,'Investering kopen',h,'investmentHub165()');
  };
  window.buyInvestmentShares229=function(type){
    const el=document.getElementById('invShares229');
    const shares=Number(el&&el.value);
    return buyInvestment229(type,shares);
  };
  window.buyInvestmentAmount229=function(type){
    const el=document.getElementById('invAmount229'), amount=Number(el&&el.value);
    const m=IMETA229[type]||IMETA229.index;
    return buyInvestment229(type,amount/m.price);
  };
  window.buyInvestment229=function(type,shares){
    const m=IMETA229[type]||IMETA229.index;
    shares=Number(shares);
    if(!isFinite(shares)||shares<=0)return toast229('Vul een geldig aantal aandelen of bedrag in.');
    if(shares<m.minShares)return toast229('Minimum is '+m.minShares+' aandeel.');
    const cost=Math.round(shares*m.price);
    if((state.money||0)<cost)return toast229('Niet genoeg geld: '+money229(cost));
    ensureInvest229();
    let inv=state.lifestyle.investments.find(x=>x.type===type);
    if(!inv){inv={type,name:m.name,icon:m.icon,shares:0,price:m.price,value:0,costBasis:0,startedAge:state.age,history:[]};state.lifestyle.investments.push(inv);}
    inv.shares+=shares; inv.costBasis+=cost; inv.value=Math.round(inv.shares*inv.price);
    state.money-=cost;
    result229(m.icon,'Investering gekocht',`Ik kocht ${shares.toLocaleString('nl-NL',{maximumFractionDigits:4})} aandelen ${m.name} voor ${money229(cost)}.<br>Nieuwe positie: ${invLine229(inv)}`,{Smarts:1},0,'good','investmentHub165()');
  };
  window.buyInvestment165=function(type,amount){const m=IMETA229[type]||IMETA229.index;return buyInvestment229(type,Number(amount)/m.price)};
  window.investmentDetail229=function(type){
    const inv=ensureInvest229().find(x=>x.type===type); if(!inv)return investmentHub165();
    let h=card229(invLine229(inv));
    h+=sec229('Beheer');
    h+=rr229('➕','Bij kopen','Aantal aandelen of bedrag typen','investAmount165("'+type+'")');
    h+=rr229('➖','Deel verkopen','Typ aantal aandelen om te verkopen','sellInvestmentSharesMenu229("'+type+'")');
    h+=rr229('💰','Alles verkopen','Verkoop hele positie','sellInvestmentAll229("'+type+'")');
    h+=sec229('Historie');
    h+=(inv.history&&inv.history.length?card229(inv.history.slice(-5).join('<br>')):card229('Nog geen jaarresultaten.'));
    modal229(inv.icon||'📈',inv.name,h,'investmentHub165()');
  };
  window.sellInvestmentSharesMenu229=function(type){
    const inv=ensureInvest229().find(x=>x.type===type); if(!inv)return investmentHub165();
    let h=card229(`Je hebt ${inv.shares.toLocaleString('nl-NL',{maximumFractionDigits:4})} aandelen ${inv.name}. Koers: ${money229(inv.price)}.`);
    h+=`<div class="card"><label class="mini">Aantal aandelen verkopen</label><input id="sellShares229" class="input" type="number" step="0.01" min="0"><button class="btn red" onclick="sellInvestmentShares229('${type}')">Verkoop aandelen</button></div>`;
    modal229('➖','Investering verkopen',h,'investmentDetail229("'+type+'")');
  };
  window.sellInvestmentShares229=function(type){
    const inv=ensureInvest229().find(x=>x.type===type), el=document.getElementById('sellShares229');
    let shares=Number(el&&el.value);
    if(!inv||!isFinite(shares)||shares<=0)return toast229('Vul geldig aantal in.');
    if(shares>inv.shares)shares=inv.shares;
    const value=Math.round(shares*inv.price);
    const basisPart=inv.shares?inv.costBasis*(shares/inv.shares):0;
    inv.shares-=shares; inv.costBasis=Math.max(0,inv.costBasis-basisPart); inv.value=Math.round(inv.shares*inv.price);
    state.money+=value;
    if(inv.shares<=0.000001)state.lifestyle.investments=state.lifestyle.investments.filter(x=>x!==inv);
    result229('➖','Investering verkocht',`Ik verkocht ${shares.toLocaleString('nl-NL',{maximumFractionDigits:4})} aandelen voor ${money229(value)}.`,{Happiness:1},0,'good','investmentHub165()');
  };
  window.sellInvestmentAll229=function(type){
    const inv=ensureInvest229().find(x=>x.type===type); if(!inv)return;
    state.money+=inv.value;
    state.lifestyle.investments=state.lifestyle.investments.filter(x=>x!==inv);
    result229('💰','Investering verkocht',`Ik verkocht mijn hele positie ${inv.name} voor ${money229(inv.value)}.`,{Happiness:1},0,'good','investmentHub165()');
  };
  window.sellInvestment165=function(i){ensureInvest229();const inv=state.lifestyle.investments[i];if(inv)return sellInvestmentAll229(inv.type)};
  window.processInvestments229=function(force=false){
    ensureInvest229();
    state.flags=state.flags||{};
    const key='investProcessedAge229';
    if(!force && state.flags[key]===state.age)return;
    state.flags[key]=state.age;
    if(!state.lifestyle.investments.length)return;
    const mood=r229(-8,8);
    let lines=[];
    state.lifestyle.investments.forEach(inv=>{
      const m=IMETA229[inv.type]||IMETA229.index;
      let pct=r229(m.range[0],m.range[1])+mood;
      if(Math.random()<m.crash)pct=inv.type==='scam'?-100:r229(-70,-20);
      if(inv.type==='savings')pct=Math.max(0,pct);
      if(inv.type==='realestate' && (state.houses||[]).some(h=>h.owned))pct+=r229(0,5);
      const oldPrice=inv.price, oldValue=inv.value;
      inv.price=Math.max(0.01,Math.round(inv.price*(1+pct/100)*100)/100);
      inv.value=Math.max(0,Math.round(inv.shares*inv.price));
      const line=`${m.icon} ${m.name}: ${pct>=0?'+':''}${pct}% · koers ${money229(oldPrice)} → ${money229(inv.price)} · waarde ${money229(oldValue)} → ${money229(inv.value)}`;
      inv.history=inv.history||[]; inv.history.push(`Leeftijd ${state.age}: ${line}`); inv.history=inv.history.slice(-12);
      lines.push(line);
    });
    try{addLog('<b>Investeringen jaarupdate</b><br>'+lines.join('<br>'),'warn',false)}catch(e){}
  };

  /* ================= ADULT INTIMACY/FWB ================= */
  function adult229(p){return state.age>=18 && (!p || Number(p.age||18)>=18)}
  function rel229(p){return clamp229(p&&p.rel!=null?p.rel:50)}
  function labelPerson229(p){return (p&&p.name)||'de ander'}
  function addRel229(p,n){if(!p)return; p.rel=clamp229((p.rel||50)+n)}
  function pregnancyPossible229(p){
    if(!p||state.age<18)return false;
    const pg=String(state.gender||'male').toLowerCase(), og=String(p.gender||'female').toLowerCase();
    return (pg!==og) && ((pg==='female'&&state.age<48)||(og==='female'&&Number(p.age||30)<48));
  }
  function maybePregnancy229(p,serious=false){
    if(!pregnancyPossible229(p))return '';
    const chance=serious?0.10:0.045;
    if(Math.random()>chance)return '';
    const momIsPlayer=String(state.gender||'male').toLowerCase()==='female';
    let g=Math.random()<.5?'male':'female';
    let surname=String(state.name||'').split(' ').slice(-1)[0] || 'Baby';
    let baby={name:(typeof DATE_NAMES!=='undefined'?pick229(DATE_NAMES[g]):(g==='male'?'Baby':'Baby'))+' '+surname,age:0,rel:r229(55,95),gender:g};
    try{baby.icon=humanIcon(g,0)}catch(e){}
    state.children=state.children||[]; state.children.push(baby);
    return `<br><b>Gevolg:</b> ${momIsPlayer?'Ik werd zwanger':'Er ontstond een zwangerschap'} en later werd ${baby.name} geboren.`;
  }
  window.adultIntimacy229=function(kind,idx,mode='romantic'){
    let p=null, back='closeModal()';
    if(kind==='partner'){p=state.partner;back='partnerScreen()'}
    if(kind==='friend'){p=state.friends&&state.friends[idx];back=`friendScreen(${idx})`}
    if(kind==='classmate'){p=state.school&&state.school.classmates&&state.school.classmates[idx];back=`classmateScreen(${idx})`}
    if(kind==='loveInterest'){p=window._loveInterest;back='loveScreen()'}
    if(!p)return toast229('Persoon niet gevonden.');
    if(!adult229(p))return toast229('Alleen 18+ volwassenen.');
    const name=labelPerson229(p), relation=rel229(p);
    const consentChance=mode==='fwb'?relation+10:mode==='serious'?relation+25:relation;
    if(consentChance<45 || Math.random()*100>consentChance){
      addRel229(p,-r229(2,8));
      return result229('❤️','Intimiteit',`${name} voelde zich er niet prettig bij. Ik respecteerde dat en hield afstand.`,{Happiness:-3},0,'warn',back);
    }
    let txt='', stats={Happiness:7,Stamina:-6};
    if(mode==='fwb'){
      p.fwb=true; addRel229(p,r229(2,8));
      txt=`${name} en ik spraken af om friends with benefits te blijven. Geen vaste relatie, wel duidelijke grenzen en wederzijds akkoord.`;
    }else if(mode==='serious'){
      addRel229(p,r229(4,12));
      txt=`${name} en ik hadden een intieme avond samen. Het voelde vertrouwd en bracht ons dichter bij elkaar.`;
    }else{
      addRel229(p,r229(1,6));
      txt=`${name} en ik brachten de nacht samen door. Het bleef volwassen, wederzijds en zonder gedoe.`;
    }
    if(Math.random()<0.035){txt+=`<br><b>Gezondheid:</b> ik maakte me zorgen en liet me testen. Alles bleef onder controle.`; stats.Health=(stats.Health||0)-1;}
    txt+=maybePregnancy229(p,mode==='serious'||kind==='partner');
    result229('❤️','Intimiteit',txt,stats,0,'good',back);
  };
  window.fwbMenu229=function(kind,idx){
    let p=kind==='friend'?state.friends[idx]:kind==='classmate'?state.school.classmates[idx]:null;
    if(!p)return;
    let h=card229(`<b>${p.name}</b><br>Relatie: ${p.rel||50}%<br><span class="mini">Alleen 18+, consensueel en non-graphic.</span>`);
    h+=rr229('🌙','Samen de nacht doorbrengen','Volwassen intimiteit zonder vaste relatie','adultIntimacy229("'+kind+'",'+idx+',"casual")');
    h+=rr229('🖤','Friends with benefits','Duidelijke afspraak zonder relatiegarantie','adultIntimacy229("'+kind+'",'+idx+',"fwb")');
    modal229('❤️','Volwassen dynamiek',h,kind==='friend'?`friendScreen(${idx})`:`classmateScreen(${idx})`);
  };
  const oldPartner229=window.partnerScreen||null;
  if(oldPartner229&&!oldPartner229.__intimacy229){
    window.partnerScreen=function(){
      oldPartner229.apply(this,arguments);
      setTimeout(()=>{
        try{
          if(!state.partner||!adult229(state.partner))return;
          const body=document.querySelector('#modal .modalBody');
          if(body&&!body.innerHTML.includes('adultIntimacy229')){
            const wrap=document.createElement('div'); wrap.innerHTML=rr229('🌙','Intimiteit / samen nacht','Volwassen, wederzijds en relatie-effecten','adultIntimacy229("partner",0,"serious")');
            const childBtn=[...body.querySelectorAll('.btn')].find(b=>/Kind proberen/i.test(b.textContent||''));
            body.insertBefore(wrap.firstElementChild,childBtn||body.querySelector('.btn.alt'));
          }
        }catch(e){}
      },0);
    }; window.partnerScreen.__intimacy229=true; try{partnerScreen=window.partnerScreen}catch(e){}
  }
  const oldFriend229=window.friendScreen||null;
  if(oldFriend229&&!oldFriend229.__intimacy229){
    window.friendScreen=function(i){
      oldFriend229.apply(this,arguments);
      setTimeout(()=>{try{
        const f=state.friends&&state.friends[i],body=document.querySelector('#modal .modalBody');
        if(f&&adult229(f)&&body&&!body.innerHTML.includes('fwbMenu229')){
          const wrap=document.createElement('div');wrap.innerHTML=rr229('🖤','Volwassen dynamiek','Date, samen nacht of friends with benefits','fwbMenu229("friend",'+i+')',rel229(f)<45);
          body.insertBefore(wrap.firstElementChild,body.querySelector('.btn.alt'));
        }
      }catch(e){}},0);
    }; window.friendScreen.__intimacy229=true; try{friendScreen=window.friendScreen}catch(e){}
  }
  const oldClassmate229=window.classmateScreen||null;
  if(oldClassmate229&&!oldClassmate229.__intimacy229){
    window.classmateScreen=function(i){
      oldClassmate229.apply(this,arguments);
      setTimeout(()=>{try{
        const c=state.school&&state.school.classmates&&state.school.classmates[i],body=document.querySelector('#modal .modalBody');
        if(c&&adult229(c)&&body&&!body.innerHTML.includes('fwbMenu229')){
          const wrap=document.createElement('div');wrap.innerHTML=rr229('🖤','Volwassen dynamiek','Alleen als jullie allebei 18+ zijn','fwbMenu229("classmate",'+i+')',rel229(c)<45);
          body.insertBefore(wrap.firstElementChild,body.querySelector('.btn.alt'));
        }
      }catch(e){}},0);
    }; window.classmateScreen.__intimacy229=true; try{classmateScreen=window.classmateScreen}catch(e){}
  }
  const oldLoveModal229=window.loveInterestModal||null;
  if(oldLoveModal229&&!oldLoveModal229.__intimacy229){
    window.loveInterestModal=function(p,mode='date'){
      oldLoveModal229.apply(this,arguments);
      setTimeout(()=>{try{
        const body=document.querySelector('#modal .modalBody');
        if(p&&adult229(p)&&body&&!body.innerHTML.includes('adultIntimacy229')){
          const wrap=document.createElement('div');wrap.innerHTML=rr229('🌙','Volwassen avond samen','Alleen 18+, wederzijds en zonder relatiegarantie','adultIntimacy229("loveInterest",0,"casual")');
          body.insertBefore(wrap.firstElementChild,body.querySelector('.btn.alt'));
        }
      }catch(e){}},0);
    }; window.loveInterestModal.__intimacy229=true; try{loveInterestModal=window.loveInterestModal}catch(e){}
  }

  /* yearly hooks */
  const oldYearly229=window.yearlyAssets||(typeof yearlyAssets==='function'?yearlyAssets:null);
  if(oldYearly229&&!oldYearly229.__invest229){
    window.yearlyAssets=function(){
      if(oldYearly229)oldYearly229.apply(this,arguments);
      try{processInvestments229(false)}catch(e){console.warn('[v22.9 investments]',e)}
    };
    window.yearlyAssets.__invest229=true; try{yearlyAssets=window.yearlyAssets}catch(e){}
  }
  const oldAge229=window.ageUp||(typeof ageUp==='function'?ageUp:null);
  if(oldAge229&&!oldAge229.__invest229){
    window.ageUp=function(){
      const before=state&&state.age;
      const ret=oldAge229.apply(this,arguments);
      try{if(state&&state.age!==before)processInvestments229(false);safeSave();render()}catch(e){}
      return ret;
    };
    window.ageUp.__invest229=true; try{ageUp=window.ageUp}catch(e){}
  }

  const oldShow229=window.showModal||(typeof showModal==='function'?showModal:null);
  if(oldShow229&&!oldShow229.__click229){
    window.showModal=function(html){const ret=oldShow229.call(this,html);setTimeout(clickFix229,0);return ret};
    window.showModal.__click229=true; try{showModal=window.showModal}catch(e){}
  }
  const oldSave229=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave229&&!oldSave229.__v229){
    window.safeSave=function(){try{ensureCombat229();ensureInvest229()}catch(e){}return oldSave229.apply(this,arguments)};
    window.safeSave.__v229=true; try{safeSave=window.safeSave}catch(e){}
  }

  window.debugV229=function(){
    ensureCombat229();ensureInvest229();
    let h=card229(`<b>v22.9 debug</b><br>Combat level: ${state.combat229.level}<br>Investeringen: ${money229(invTotals229())}<br>Adult intimacy: geïntegreerd in relaties/friends/dates.`);
    h+=rr229('🥊','Open Combat','Test combat acties','combatHub229()');
    h+=rr229('📈','Open Investeren','Test aandelen typen/groeperen','investmentHub165()');
    modal229('🛠️','v22.9 debug',h,'closeModal()');
  };

  setTimeout(()=>{try{ensureCombat229();ensureInvest229();clickFix229();safeSave();render()}catch(e){}},350);
})();
