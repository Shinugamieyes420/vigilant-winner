
/* v18.4 Combat Merge + School Tracks + Relationship Group Talk */
(function(){
  function r184(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function c184(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money184(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast184(t){try{toast(t)}catch(e){console.log(t)}}
  function addLog184(title,text,type){try{addLog('<b>'+title+'</b><br>'+text,type||'good',false)}catch(e){}}
  function apply184(stats){try{applyStats(stats||{})}catch(e){stats=stats||{};state.stats=state.stats||{};for(const k in stats){if(k==='Fitness')state.fitness=c184((state.fitness||50)+stats[k]);else if(k==='Stamina')state.stamina=c184((state.stamina||50)+stats[k]);else state.stats[k]=c184((state.stats[k]||50)+stats[k]);}}}
  function modal184(icon,title,body){showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody combat-body">${body}</div>`)}
  function row184(cls,icon,title,sub,fn,locked){
    return `<div class="${cls} ${locked?'locked':''}" onclick="${locked?'':fn}"><div class="ico">${icon}</div><div><div class="title">${title}</div><div class="sub">${sub}</div></div><div class="chev">›</div></div>`;
  }
  function meter184(label,val){
    val=c184(val);let cl=val>=70?'good':val>=40?'warn':'bad';
    return `<b>${label}: ${val}%</b><div class="school184-meter ${cl}"><span style="width:${val}%"></span></div>`;
  }
  function inJail184(){try{if(typeof isInJail==='function')return !!isInJail()}catch(e){}return !!(state&&state.jail&&state.jail.yearsLeft>0)}
  function isSchoolAge184(){return state.age>=4&&state.age<18}
  const TRACKS184={
    vmbo:{label:'VMBO',years:4,gradAge:16,unlock:'MBO',desc:'Praktischer route. Na VMBO kun je logisch door naar MBO.'},
    havo:{label:'HAVO',years:5,gradAge:17,unlock:'HBO',desc:'Middenroute. Na HAVO kun je direct naar HBO of MBO.'},
    vwo:{label:'VWO',years:6,gradAge:18,unlock:'Universiteit',desc:'Theoretische route. Na VWO kun je direct naar universiteit of HBO.'}
  };
  function recommendTrack184(){
    const sm=state.stats?.Smarts||50;
    const g=state.schoolSystem?.grades||50;
    if(sm>=72||g>=75)return 'vwo';
    if(sm>=58||g>=60)return 'havo';
    return 'vmbo';
  }
  function schoolPhase184(){
    if(state.age<4)return 'thuis';
    if(state.age<12)return 'basisschool';
    if(state.age<18)return 'middelbare';
    if(state.schoolSystem?.postSecondary?.active)return state.schoolSystem.postSecondary.type;
    return 'volwassen';
  }
  function ensureSchool184(){
    state.education=state.education||{primary:false,highschool:false,mbo:false,hbo:false,uni:false,studying:null,studyYears:0};
    state.schoolSystem=state.schoolSystem||{};
    const s=state.schoolSystem;
    s.grades=c184(s.grades??(state.stats?.Smarts||50));
    s.attendance=c184(s.attendance??88);
    s.behavior=c184(s.behavior??70);
    s.stress=c184(s.stress??20);
    s.homework=c184(s.homework??45);
    s.teacherRelation=c184(s.teacherRelation??55);
    s.friends=c184(s.friends??50);
    s.track=s.track||null;
    s.trackYear=s.trackYear||0;
    s.diplomas=s.diplomas||{};
    s.history=s.history||[];
    s.postSecondary=s.postSecondary||{active:false,type:null,year:0,progress:0,field:null,stress:0};
    if(state.age>=4&&state.age<12){s.type='basisschool';s.track=null;s.trackYear=0;}
    if(state.age>=12&&state.age<18){s.type='middelbare';if(!s.track)s.track=recommendTrack184();if(!s.trackYear)s.trackYear=Math.max(1,state.age-11);}
    if(state.education.mbo)s.diplomas.mbo=true;
    if(state.education.hbo)s.diplomas.hbo=true;
    if(state.education.uni)s.diplomas.uni=true;
    return s;
  }
  function schoolStatusCard184(){
    const s=ensureSchool184();
    let phase=schoolPhase184();
    let track=s.track?TRACKS184[s.track]?.label:'Nog geen';
    let next=s.track?TRACKS184[s.track]?.unlock:'Nog geen advies';
    let post=s.postSecondary?.active?`${s.postSecondary.type.toUpperCase()} jaar ${s.postSecondary.year} · ${s.postSecondary.field||'algemeen'} · progress ${s.postSecondary.progress||0}%`:'Geen vervolgopleiding actief';
    return `<div class="school184-card"><b>Schoolstatus</b><br>Fase: ${phase}<br>Track: ${track}${s.trackYear?` jaar ${s.trackYear}`:''}<br>Logische doorstroom: ${next}<br>${post}<div>${meter184('Cijfers',s.grades)}${meter184('Aanwezigheid',s.attendance)}${meter184('Gedrag',s.behavior)}${meter184('Stress',100-s.stress)}</div><span class="school184-chip good">Huiswerk ${s.homework}%</span><span class="school184-chip">Mentor ${s.teacherRelation}%</span><span class="school184-chip">Schoolvrienden ${s.friends}%</span></div>`;
  }
  function canStartPost184(type){
    const s=ensureSchool184();
    if(state.age<16)return 'te jong';
    if(type==='mbo'){
      if(s.diplomas.vmbo||s.diplomas.havo||s.diplomas.vwo||state.education.highschool||state.age>=16)return '';
      return 'VMBO of middelbare basis nodig';
    }
    if(type==='hbo'){
      if(s.diplomas.havo||s.diplomas.vwo||s.diplomas.mbo||state.education.hbo)return '';
      return 'HAVO, VWO of MBO nodig';
    }
    if(type==='uni'){
      if(s.diplomas.vwo||s.diplomas.hbo||state.education.uni)return '';
      return 'VWO of HBO nodig';
    }
    return '';
  }
  window.schoolHub184=function(){
    const s=ensureSchool184();
    const phase=schoolPhase184();
    let body=schoolStatusCard184();
    if(state.age>=12&&state.age<16){
      body+=`<div class="school184-card"><b>Schooltrack kiezen</b><br>VMBO/HAVO/VWO bepaalt je latere route. Je kunt bijsturen, maar slechte cijfers en stress maken opstroom moeilijker.</div>`;
      Object.keys(TRACKS184).forEach(k=>{
        const t=TRACKS184[k], rec=recommendTrack184()===k?' · advies':'';
        body+=row184('school184-row','🎓',t.label+rec,t.desc,`chooseSchoolTrack184('${k}')`,false);
      });
    }
    if(phase==='basisschool'||phase==='middelbare'){
      body+=`<div class="section">Schoolacties</div>`;
      body+=row184('school184-row','📚','Huiswerk / leren','Cijfers omhoog, stress iets omhoog','schoolAction184("study")',false);
      body+=row184('school184-row','🧑‍🏫','Extra hulp vragen','Mentorrelatie en cijfers omhoog','schoolAction184("help")',false);
      body+=row184('school184-row','👥','Schoolvrienden spreken','Vrienden/happiness omhoog, huiswerk iets omlaag','schoolAction184("friends")',false);
      body+=row184('school184-row','🏃','Sport op school','Fitness en gedrag omhoog','schoolAction184("sport")',false);
      body+=row184('school184-row','😈','Spijbelen','Stress omlaag maar aanwezigheid/gedrag omlaag','schoolAction184("skip")',false);
    }
    body+=`<div class="section">Vervolgopleiding</div>`;
    ['mbo','hbo','uni'].forEach(type=>{
      const deny=canStartPost184(type);
      const label={mbo:'MBO starten',hbo:'HBO starten',uni:'Universiteit starten'}[type];
      const sub={mbo:'Logisch na VMBO, ook mogelijk na HAVO/VWO',hbo:'Direct na HAVO/VWO of na MBO',uni:'Direct na VWO of na HBO'}[type];
      body+=row184('school184-row',type==='mbo'?'🛠️':type==='hbo'?'🏫':'🎓',label,deny?sub+' · '+deny:sub,`startPostSecondary184('${type}')`,!!deny);
    });
    if(s.postSecondary?.active){
      body+=`<div class="section">Studie actief</div>`;
      body+=row184('school184-row','📖','College / project doen','Studieprogress omhoog, stress omhoog','postStudyAction184("study")',false);
      body+=row184('school184-row','🏢','Stage / leerwerk zoeken','Werkervaring en route-XP','postStudyAction184("internship")',false);
      body+=row184('school184-row','🧘','Studiedruk verlagen','Stress omlaag, progress iets omlaag','postStudyAction184("rest")',false);
      body+=row184('school184-row','🛑','Stoppen / pauzeren','Studie stoppen, stress omlaag','postStudyAction184("quit")',false);
    }
    body+=`<button class="btn alt" onclick="closeModal()">Terug</button>`;
    modal184('🎓','Education v18.4',body);
  };
  window.chooseSchoolTrack184=function(track){
    const s=ensureSchool184();
    if(!TRACKS184[track])return toast184('Onbekende track.');
    const rec=recommendTrack184();
    let ok=true, msg='';
    if(track==='vwo'&&rec==='vmbo'&&s.grades<68){ok=false;msg='VWO is nu te hoog gegrepen. Verbeter eerst je cijfers.'}
    if(track==='havo'&&rec==='vmbo'&&s.grades<52){ok=false;msg='HAVO kan, maar je cijfers moeten eerst iets beter.'}
    if(!ok)return toast184(msg);
    s.track=track;s.trackYear=Math.max(1,state.age-11);
    addLog184('Schooltrack gekozen',`Ik koos ${TRACKS184[track].label}. Doorstroom: ${TRACKS184[track].unlock}.`,'good');
    safeSaveRender184(); schoolHub184();
  };
  window.schoolAction184=function(kind){
    const s=ensureSchool184();
    let text='',stats={},type='good';
    if(kind==='study'){s.grades=c184(s.grades+r184(3,8));s.homework=c184(s.homework+r184(8,15));s.stress=c184(s.stress+r184(3,7));stats={Smarts:2,Stamina:-2};text='Ik maakte huiswerk en leerde voor toetsen. Niet leuk, wel nuttig.'}
    if(kind==='help'){s.teacherRelation=c184(s.teacherRelation+r184(6,12));s.grades=c184(s.grades+r184(2,5));s.stress=c184(s.stress-r184(2,6));stats={Smarts:1,Happiness:1};text='Ik vroeg extra hulp. De mentor zag dat ik het serieus nam.'}
    if(kind==='friends'){s.friends=c184(s.friends+r184(6,14));s.homework=c184(s.homework-r184(2,7));stats={Happiness:5};text='Ik sprak schoolvrienden. Goed voor mijn hoofd, iets minder voor huiswerk.'}
    if(kind==='sport'){s.behavior=c184(s.behavior+r184(2,6));s.stress=c184(s.stress-r184(2,5));stats={Fitness:2,Health:1,Stamina:-3};text='Ik deed mee met sport op school. Bewegen hielp mijn focus.'}
    if(kind==='skip'){s.attendance=c184(s.attendance-r184(5,12));s.behavior=c184(s.behavior-r184(4,10));s.stress=c184(s.stress-r184(5,10));stats={Happiness:2,Smarts:-1};type='warn';text='Ik spijbelde. Even rust, maar school merkte het bijna meteen.'}
    addLog184('School',text,type); apply184(stats); safeSaveRender184(); schoolHub184();
  };
  window.startPostSecondary184=function(type){
    const deny=canStartPost184(type); if(deny)return toast184(deny);
    const s=ensureSchool184();
    const fields={mbo:['ICT beheer','Zorg & welzijn','Sociaal werk','Sport & bewegen','Horeca/toerisme'],hbo:['ICT','Sociaal werk','Management','Media','Sportkunde'],uni:['Rechten','Psychologie','Computer Science','Economie','Geneeskunde']}[type];
    s.postSecondary={active:true,type,year:1,progress:0,field:fields[0],stress:20};
    state.education.studying=type; state.education.studyYears=1;
    addLog184('Opleiding gestart',`Ik startte ${type.toUpperCase()}. Richting: ${fields[0]}.`,'good');
    safeSaveRender184(); schoolHub184();
  };
  window.postStudyAction184=function(kind){
    const s=ensureSchool184(), ps=s.postSecondary;
    if(!ps?.active)return toast184('Geen studie actief.');
    let text='',stats={},type='good';
    if(kind==='study'){ps.progress=c184((ps.progress||0)+r184(8,16));ps.stress=c184((ps.stress||0)+r184(5,10));s.grades=c184(s.grades+r184(1,4));stats={Smarts:2,Stamina:-3};text='Ik werkte aan colleges, projecten en deadlines.'}
    if(kind==='internship'){ps.progress=c184((ps.progress||0)+r184(6,12));state.careerXP=(state.careerXP||0)+r184(5,15);stats={Smarts:1,Happiness:2,Stamina:-4};text='Ik zocht stage/leerwerk en bouwde echte werkervaring op.'}
    if(kind==='rest'){ps.stress=c184((ps.stress||0)-r184(10,20));s.stress=c184(s.stress-r184(6,12));ps.progress=c184((ps.progress||0)-r184(0,4));stats={Happiness:2,Stamina:5};text='Ik verlaagde studiedruk. Minder progress, maar beter vol te houden.'}
    if(kind==='quit'){ps.active=false;state.education.studying=null;state.education.studyYears=0;type='warn';stats={Happiness:1,Smarts:-1};text='Ik stopte of pauzeerde mijn opleiding. Opgelucht, maar ook onzeker.'}
    addLog184('Studie',text,type); apply184(stats); safeSaveRender184(); schoolHub184();
  };
  function schoolYear184(){
    const s=ensureSchool184();
    let lines=[];
    if(state.age===12&&!s.track){s.track=recommendTrack184();s.trackYear=1;lines.push(`Mijn schooladvies werd ${TRACKS184[s.track].label}.`)}
    if(state.age>=12&&state.age<18&&s.track){
      s.trackYear=Math.max(s.trackYear||1,state.age-11);
      const pressure=(state.sideJob?.weeklyHours||0)+(state.combatSports?.weeklyLoad||0)+(state.football?.active?4:0);
      if(pressure>14){s.stress=c184(s.stress+8);s.grades=c184(s.grades-4);lines.push('School, werk en sport botsten: mijn cijfers kregen druk.')}
      if(s.attendance<55){s.grades=c184(s.grades-6);lines.push('Door lage aanwezigheid zakten mijn cijfers.')}
      const tr=TRACKS184[s.track];
      if(state.age>=tr.gradAge&&!s.diplomas[s.track]){
        if(s.grades>=45&&s.attendance>=55){
          s.diplomas[s.track]=true;state.education.highschool=true;state.education.highschoolTrack=s.track;
          lines.push(`Ik haalde mijn ${tr.label}-diploma. Doorstroom: ${tr.unlock}.`);
        }else{
          s.trackYear=Math.max(1,(s.trackYear||1)-1);s.stress=c184(s.stress+10);
          lines.push(`Ik haalde mijn ${tr.label}-diploma nog niet en moest blijven zitten/inhaaltraject doen.`);
        }
      }
    }
    if(s.postSecondary?.active){
      const ps=s.postSecondary;
      const workLoad=(state.job?.weeklyHours||0)+(state.sideJob?.weeklyHours||0);
      if(workLoad>20){ps.stress=c184((ps.stress||0)+8);ps.progress=c184((ps.progress||0)-4);lines.push('Werkuren maakten mijn studie zwaarder.')}
      if((ps.progress||0)>=100){
        if(ps.type==='mbo'){state.education.mbo=true;s.diplomas.mbo=true}
        if(ps.type==='hbo'){state.education.hbo=true;s.diplomas.hbo=true}
        if(ps.type==='uni'){state.education.uni=true;s.diplomas.uni=true}
        lines.push(`Ik haalde mijn ${ps.type.toUpperCase()}-diploma.`);
        s.postSecondary={active:false,type:null,year:0,progress:0,field:null,stress:0};state.education.studying=null;state.education.studyYears=0;
      }else{ps.year=(ps.year||1)+1;state.education.studyYears=ps.year;ps.progress=c184((ps.progress||0)+r184(8,16));}
    }
    if(lines.length) addLog184('Schooljaar',lines.join('<br>'),'good');
  }

  // Relationship group talks
  function people184(){
    const arr=[];
    if(state.mother)arr.push(['mother',state.mother,'Moeder']);
    if(state.father)arr.push(['father',state.father,'Vader']);
    (state.siblings||[]).forEach((p,i)=>arr.push(['sibling'+i,p,p.role||'Sibling']));
    if(state.partner)arr.push(['partner',state.partner,state.partner.married?'Partner/echtgenoot':'Partner']);
    (state.children||[]).forEach((p,i)=>arr.push(['child'+i,p,'Kind']));
    (state.friends||[]).forEach((p,i)=>arr.push(['friend'+i,p,'Vriend']));
    return arr.filter(x=>x[1]);
  }
  function relChange184(person,delta){person.rel=c184((person.rel??50)+delta)}
  function relCard184(){
    const ps=people184();
    const avg=ps.length?Math.round(ps.reduce((a,x)=>a+(x[1].rel??50),0)/ps.length):0;
    const fam=ps.filter(x=>!x[0].startsWith('friend')).length;
    const fr=ps.filter(x=>x[0].startsWith('friend')).length;
    return `<div class="group184-card"><b>Relatie-overzicht</b><br>Gemiddelde band: ${avg}%<br>Familie/partner/kinderen: ${fam}<br>Vrienden: ${fr}<br><span class="group184-chip">Eén knop = meerdere gesprekken</span></div>`;
  }
  window.groupTalkHub184=function(){
    let body=relCard184();
    body+=row184('group184-row','🏠','Gezinsgesprek','Moeder, vader, partner, kinderen en siblings tegelijk checken','groupTalk184("family")',false);
    body+=row184('group184-row','👪','Ouders spreken','Moeder en vader tegelijk spreken','groupTalk184("parents")',false);
    body+=row184('group184-row','👥','Vriendengroep appen','Alle vrienden tegelijk sociaal onderhouden','groupTalk184("friends")',false);
    body+=row184('group184-row','🌍','Iedereen check-in','Korte check-in met familie, partner en vrienden','groupTalk184("all")',false);
    body+=row184('group184-row','🧯','Ruzies gladstrijken','Relaties met lage band krijgen extra aandacht','groupTalk184("repair")',false);
    body+='<button class="btn alt" onclick="closeModal()">Terug</button>';
    modal184('💬','Groepsgesprekken',body);
  };
  window.groupTalk184=function(kind){
    const ps=people184(); if(!ps.length)return toast184('Je hebt nog niemand om te spreken.');
    let targets=ps;
    if(kind==='parents')targets=ps.filter(x=>x[0]==='mother'||x[0]==='father');
    if(kind==='family')targets=ps.filter(x=>!x[0].startsWith('friend'));
    if(kind==='friends')targets=ps.filter(x=>x[0].startsWith('friend'));
    if(kind==='repair')targets=ps.filter(x=>(x[1].rel??50)<55);
    if(!targets.length)return toast184('Geen passende relaties voor dit gesprek.');
    let total=0; targets.forEach(x=>{let d=kind==='repair'?r184(6,14):r184(2,7);relChange184(x[1],d);total+=d});
    let txt={family:'Ik had een gezinsgesprek. Niet alles perfect, maar iedereen voelde zich meer gezien.',parents:'Ik sprak mijn ouders tegelijk. Minder losse kliks, meer duidelijkheid.',friends:'Ik appte/hing met de vriendengroep. De band bleef warm zonder iedereen apart af te gaan.',all:'Ik deed een korte check-in met iedereen die belangrijk is.',repair:'Ik pakte zwakke relaties actief aan en probeerde de lucht te klaren.'}[kind];
    apply184({Happiness:kind==='repair'?2:4,Stamina:kind==='all'?-3:-2});
    addLog184('Groepsgesprek',`${txt}<br>Gesproken met ${targets.length} personen. Totale relatieboost: +${total}.`,'good');
    safeSaveRender184(); groupTalkHub184();
  };

  // Combat merge/access foundation
  const oldCombatHub184=window.combatCareerHub177||window.combatCareerHub||null;
  const oldGloryHub184=window.gloryUfcCareerScreen||window.fightCareerScreen||null;
  function ensureCombatSports184(){
    state.combatSports=state.combatSports||{};
    const cs=state.combatSports;
    cs.active=cs.active||!!(state.fightCareer?.active||state.combat?.active);
    cs.route=cs.route||((state.combat?.ruleset==='kickboxing'||state.fightCareer?.level==='glory')?'glory':'mma');
    cs.level=cs.level||'trial';
    cs.skill=c184(cs.skill??Math.max(state.fightCareer?.skill||0,state.combat?.stats?Math.round(((state.combat.stats.striking||0)+(state.combat.stats.wrestling||0)+(state.combat.stats.grappling||0))/3):0,20));
    cs.form=c184(cs.form??(state.fightCareer?.form||50));
    cs.coachTrust=c184(cs.coachTrust??(state.combat?.coachRelation||45));
    cs.fame=c184(cs.fame??(state.fightCareer?.fame||0));
    cs.record=cs.record||{wins:state.fightCareer?.wins||state.combat?.record?.wins||0,losses:state.fightCareer?.losses||state.combat?.record?.losses||0};
    cs.health=cs.health||{freshness:65,overtraining:20,injuryRisk:20,injuredYears:0,injury:null};
    cs.access=cs.access||{gymMember:false,sparringApproved:false,amateurDebut:false,manager:false,proContract:false};
    cs.weeklyLoad=cs.weeklyLoad||0;
    return cs;
  }
  function combatCard184(){
    const cs=ensureCombatSports184(), h=cs.health;
    return `<div class="combat184-card"><b>Combat Sports</b><br>Route: ${cs.route==='glory'?'GLORY Kickboxing':'MMA / UFC'}<br>Niveau: ${cs.level}<br>Record: ${cs.record.wins||0}-${cs.record.losses||0}<br>Skill ${cs.skill}% · Form ${cs.form}% · Coach ${cs.coachTrust}% · Fame ${cs.fame}%<br><span class="combat184-chip ${cs.access.gymMember?'good':'warn'}">Gym ${cs.access.gymMember?'member':'geen lid'}</span><span class="combat184-chip ${cs.access.sparringApproved?'good':'warn'}">Sparring ${cs.access.sparringApproved?'approved':'locked'}</span><span class="combat184-chip ${h.injuryRisk>70?'bad':h.injuryRisk>45?'warn':'good'}">Blessurerisico ${h.injuryRisk}%</span><span class="combat184-chip">Freshness ${h.freshness}%</span></div>`;
  }
  function canCombat184(action){
    const cs=ensureCombatSports184(), h=cs.health;
    if(inJail184())return 'Je zit vast.';
    if(action!=='join'&&!cs.access.gymMember)return 'Word eerst lid van een lokale gym.';
    if(h.injuredYears>0&&!['recovery','light','join'].includes(action))return 'Je bent geblesseerd. Eerst herstellen.';
    if(action==='light'&&cs.skill<15)return 'Doe eerst techniektraining.';
    if(action==='hard'&&!cs.access.sparringApproved)return 'Coach approval nodig voor harde sparring.';
    if(action==='hard'&&h.injuryRisk>65)return 'Blessurerisico te hoog voor hard sparren.';
    if(action==='fight'&&(!cs.access.amateurDebut||cs.form<45||h.injuryRisk>70))return 'Nog niet veilig/klaar voor wedstrijd.';
    return '';
  }
  window.combatSportsHub184=function(){
    const cs=ensureCombatSports184();
    let body=combatCard184();
    body+=row184('combat184-row','🧭','Route kiezen',cs.route==='glory'?'Nu: GLORY Kickboxing':'Nu: MMA / UFC','combatRoute184()',false);
    body+=row184('combat184-row','🏚️','Lokale gym lid worden','Laagdrempelige toegang tot trainen','combatAction184("join")',false);
    body+=row184('combat184-row','🥊','Techniektraining','Makkelijk toegankelijk, laag blessurerisico','combatAction184("technique")',!!canCombat184('technique'));
    body+=row184('combat184-row','🏃','Cardio / conditie','Form omhoog, matig blessurerisico','combatAction184("cardio")',!!canCombat184('cardio'));
    body+=row184('combat184-row','🧤','Lichte sparring','Basis nodig, skill en fight IQ omhoog','combatAction184("light")',!!canCombat184('light'));
    body+=row184('combat184-row','🔥','Harde sparring','Coach approval nodig, hoog risico','combatAction184("hard")',!!canCombat184('hard'));
    body+=row184('combat184-row','🏆','Wedstrijd vechten','Alleen als vorm/skill/herstel logisch is','combatAction184("fight")',!!canCombat184('fight'));
    body+=row184('combat184-row','📈','Hoger niveau zoeken','Wins, skill, coach en fame bepalen toelating','combatAction184("levelup")',false);
    body+=row184('combat184-row','🩹','Herstel & blessurepreventie','Rust, fysio en medische check','combatAction184("recovery")',false);
    if(oldCombatHub184)body+=row184('combat184-row','🎮','Advanced Fight Night / Move Set','Gebruik het v17.7 Fight Night systeem','combatAdvanced184()',false);
    if(oldGloryHub184)body+=row184('combat184-row','🥋','Oude training details','Open oude GLORY/UFC details als subpagina','combatOldGlory184()',false);
    body+='<button class="btn alt" onclick="closeModal()">Terug</button>';
    modal184('🥊','Combat Sports v18.4',body);
  };
  window.combatRoute184=function(){
    let body=combatCard184();
    body+=row184('combat184-row','🥊','MMA / UFC route','Striking, wrestling, grappling en submissions','setCombatRoute184("mma")',false);
    body+=row184('combat184-row','🥋','GLORY Kickboxing route','Stand-up, low kicks, cardio, geen takedowns','setCombatRoute184("glory")',false);
    body+='<button class="btn alt" onclick="combatSportsHub184()">Terug</button>';
    modal184('🧭','Combat route kiezen',body);
  };
  window.setCombatRoute184=function(route){const cs=ensureCombatSports184();cs.route=route;state.fightCareer=state.fightCareer||{};state.fightCareer.active=true;state.fightCareer.level=route==='glory'?'glory':'mma';addLog184('Combat route',`Ik koos ${route==='glory'?'GLORY Kickboxing':'MMA / UFC'} als hoofdroute.`,'good');safeSaveRender184();combatSportsHub184()};
  window.combatAction184=function(action){
    const cs=ensureCombatSports184(), h=cs.health;
    const deny=canCombat184(action); if(deny&&action!=='join'&&action!=='levelup'&&action!=='recovery')return toast184(deny);
    let text='',type='good',stats={};
    if(action==='join'){cs.active=true;cs.access.gymMember=true;cs.level=cs.level==='trial'?'local_gym':cs.level;text='Ik werd lid van een lokale gym. Trainen is nu laagdrempelig mogelijk.';stats={Fitness:1,Happiness:3}}
    if(action==='technique'){cs.skill=c184(cs.skill+r184(3,7));cs.form=c184(cs.form+r184(1,3));h.injuryRisk=c184(h.injuryRisk+r184(1,4));h.freshness=c184(h.freshness-r184(2,5));text='Ik deed techniektraining. Laag risico, goede basis.';stats={Fitness:1,Stamina:-2}}
    if(action==='cardio'){cs.form=c184(cs.form+r184(4,8));h.overtraining=c184(h.overtraining+r184(4,9));h.injuryRisk=c184(h.injuryRisk+r184(4,8));h.freshness=c184(h.freshness-r184(5,10));text='Ik werkte aan cardio en conditie. Nuttig, maar het lichaam voelt het.';stats={Fitness:2,Stamina:-5}}
    if(action==='light'){cs.skill=c184(cs.skill+r184(2,5));cs.coachTrust=c184(cs.coachTrust+r184(1,4));h.injuryRisk=c184(h.injuryRisk+r184(5,10));h.freshness=c184(h.freshness-r184(6,12));text='Lichte sparring gaf timing zonder meteen oorlog te maken.';stats={Fitness:1,Stamina:-5}}
    if(action==='hard'){cs.skill=c184(cs.skill+r184(4,8));cs.form=c184(cs.form+r184(2,4));h.injuryRisk=c184(h.injuryRisk+r184(12,22));h.overtraining=c184(h.overtraining+r184(8,16));h.freshness=c184(h.freshness-r184(12,22));text='Harde sparring maakte me beter, maar het blessurerisico schoot omhoog.';stats={Fitness:2,Health:-2,Stamina:-10};if(h.injuryRisk>85&&Math.random()<.35){h.injuredYears=1;h.injury='sparring blessure';text+='<br>Ik raakte geblesseerd door te hard doortrainen.';type='bad'}}
    if(action==='fight'){let win=Math.random()<((cs.skill+cs.form+cs.coachTrust-h.injuryRisk)/220);if(win){cs.record.wins++;cs.fame=c184(cs.fame+r184(4,10));text='Ik won mijn fight en bouwde naam op.';stats={Happiness:8,Fitness:1,Health:-3}}else{cs.record.losses++;text='Ik verloor mijn fight. Leerzaam, maar pijnlijk.';type='bad';stats={Happiness:-6,Health:-6}}h.injuryRisk=c184(h.injuryRisk+r184(10,20));h.freshness=c184(h.freshness-r184(18,28));cs.access.amateurDebut=true}
    if(action==='levelup'){let req='';if(!cs.access.sparringApproved&&cs.skill>=20&&cs.form>=35&&cs.coachTrust>=35){cs.access.sparringApproved=true;req='Coach gaf toestemming voor sparring.'}else if(!cs.access.amateurDebut&&cs.skill>=28&&cs.form>=45&&h.injuryRisk<60){cs.access.amateurDebut=true;cs.level='amateur_ready';req='Ik werd klaar gezet voor amateurdebuut.'}else if((cs.record.wins||0)>=2&&cs.skill>=35){cs.level='regional';req='Ik steeg naar regionaal niveau.'}else if((cs.record.wins||0)>=5&&cs.skill>=55&&cs.fame>=15){cs.level=cs.route==='glory'?'glory_prospect':'ufc_prospect';req='Ik kreeg serieuze pro-aandacht.'}else req='Nog niet genoeg bewijs. Train, herstel, win fights en bouw coach trust.';text=req;type=req.startsWith('Nog')?'warn':'good'}
    if(action==='recovery'){h.freshness=c184(h.freshness+r184(18,30));h.injuryRisk=c184(h.injuryRisk-r184(15,28));h.overtraining=c184(h.overtraining-r184(12,24));if(h.injuredYears>0&&Math.random()<.45){h.injuredYears=0;h.injury=null;text='Ik nam herstel serieus: rust, mobiliteit en medische check. De blessure trok weg.'}else text='Ik herstelde met rust, mobiliteit en fysio. Blessurerisico ging omlaag.';stats={Health:4,Stamina:8,Happiness:2}}
    cs.weeklyLoad = ['technique','cardio','light','hard','fight'].includes(action)?(cs.weeklyLoad||0)+4:Math.max(0,(cs.weeklyLoad||0)-4);
    addLog184('Combat Sports',text,type);apply184(stats);safeSaveRender184();combatSportsHub184();
  };
  window.combatAdvanced184=function(){if(oldCombatHub184)return oldCombatHub184();toast184('Advanced Fight Night niet gevonden.')};
  window.combatOldGlory184=function(){if(oldGloryHub184)return oldGloryHub184();toast184('Oude GLORY/UFC pagina niet gevonden.')};
  // Redirect old public combat entries into one main hub.
  window.combatCareerHub177=window.combatSportsHub184;
  window.gloryUfcCareerScreen=window.combatSportsHub184;
  window.fightCareerScreen=window.combatSportsHub184;
  try{combatCareerHub177=window.combatSportsHub184;gloryUfcCareerScreen=window.combatSportsHub184;fightCareerScreen=window.combatSportsHub184}catch(e){}

  const oldActivities184=window.activitiesHTML||(typeof activitiesHTML==='function'?activitiesHTML:null);
  window.activitiesHTML=function(){
    let h=oldActivities184?oldActivities184():'';
    if(!h.includes('Education v18.4'))h+=`<div class="section">School & opleiding</div>${row('🎓','Education v18.4','VMBO/HAVO/VWO, MBO/HBO/Uni, stage en schoolbalans','schoolHub184()')}`;
    if(!h.includes('Combat Sports v18.4'))h+=`<div class="section">Combat Sports</div>${row('🥊','Combat Sports v18.4','Eén route voor MMA/UFC/GLORY, gym access en herstel','combatSportsHub184()',state.age<12)}`;
    return h;
  };
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  const oldRel184=window.relationshipsHTML||(typeof relationshipsHTML==='function'?relationshipsHTML:null);
  window.relationshipsHTML=function(){
    let h=oldRel184?oldRel184():'';
    if(!h.includes('Groepsgesprekken'))h=`<div class="section">Groepsgesprekken</div>${row('💬','Groepsgesprekken','Praat met ouders, gezin, vrienden of iedereen tegelijk','groupTalkHub184()')}`+h;
    return h;
  };
  try{relationshipsHTML=window.relationshipsHTML}catch(e){}

  const oldAge184=window.ageUp||(typeof ageUp==='function'?ageUp:null);
  window.ageUp=function(){if(oldAge184)oldAge184();try{schoolYear184();ensureCombatSports184();if(state.combatSports?.weeklyLoad)state.combatSports.weeklyLoad=Math.max(0,state.combatSports.weeklyLoad-6);safeSaveRender184()}catch(e){console.warn('[v18.4 school/combat year]',e)}};
  try{ageUp=window.ageUp}catch(e){}

  const oldMigrate184=window.migrate||(typeof migrate==='function'?migrate:null);
  if(oldMigrate184&&!oldMigrate184.__v184){
    window.migrate=function(s){s=oldMigrate184(s);try{state=s;ensureSchool184();ensureCombatSports184();}catch(e){}return s};
    window.migrate.__v184=true;try{migrate=window.migrate}catch(e){}
  }
  setTimeout(()=>{try{ensureSchool184();ensureCombatSports184();safeSaveRender184()}catch(e){}},350);
})();
