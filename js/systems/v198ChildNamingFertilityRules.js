/* v19.8 Child Naming + Fertility Rules
   - Lets the player name newborn/adopted children.
   - Natural pregnancy blocked when the biological female is 48+.
   - Adds realistic fertility chance by age and adoption as a logical alternative.
*/
(function(){
  function r198(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick198(a){return a[Math.floor(Math.random()*a.length)]}
  function clamp198(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function toast198(t){try{toast(t)}catch(e){console.log(t)}}
  function save198(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function money198(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function lastName198(){
    const n=(state&&state.name)||'';
    const parts=n.trim().split(/\s+/).filter(Boolean);
    return parts.length?parts[parts.length-1]:'Van der Bitz';
  }
  function cleanName198(s,max=22){
    return String(s||'').replace(/[^A-Za-zÀ-ÿ' -]/g,'').replace(/\s+/g,' ').trim().slice(0,max);
  }
  function genderLabel198(g){return g==='female'?'dochter':'zoon'}
  function hicon198(g,age){try{return humanIcon(g,age||0)}catch(e){return g==='female'?'👧':'👦'}}
  function rr198(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function personGender198(p){
    if(!p)return null;
    if(p.gender==='female'||p.gender==='male')return p.gender;
    try{return inferPersonGender(p,p.gender)}catch(e){}
    return p.gender||null;
  }
  function biologicalFemaleAge198(){
    if(state.gender==='female')return state.age||0;
    if(state.partner && personGender198(state.partner)==='female')return state.partner.age||18;
    return null;
  }
  function biologicalMaleAge198(){
    if(state.gender==='male')return state.age||0;
    if(state.partner && personGender198(state.partner)==='male')return state.partner.age||18;
    return null;
  }
  function femaleFertilityFactor198(age){
    if(age==null)return 0;
    if(age<18)return 0;
    if(age<=34)return 1;
    if(age<=39)return 0.65;
    if(age<=44)return 0.30;
    if(age<=47)return 0.10;
    return 0;
  }
  function maleFertilityFactor198(age){
    if(age==null)return 0.35;
    if(age<18)return 0;
    if(age<=49)return 1;
    if(age<=64)return 0.85;
    return 0.60;
  }
  function fertilityInfo198(){
    const fAge=biologicalFemaleAge198();
    const mAge=biologicalMaleAge198();
    const ff=femaleFertilityFactor198(fAge);
    const mf=maleFertilityFactor198(mAge);
    let status='';
    if(fAge==null)status='Geen biologische vrouwelijke partner gevonden voor natuurlijke zwangerschap.';
    else if(fAge>=48)status=`Natuurlijke zwangerschap is niet meer mogelijk: vrouw is ${fAge} jaar. Logische opties: adoptie of later eventueel dure IVF/draagmoeder-route.`;
    else if(fAge>=45)status=`Heel lage kans: vrouw is ${fAge} jaar.`;
    else if(fAge>=40)status=`Lage kans: vrouw is ${fAge} jaar.`;
    else if(fAge>=35)status=`Verminderde kans: vrouw is ${fAge} jaar.`;
    else status=`Normale kans: vrouw is ${fAge} jaar.`;
    let base=state.partner?.married?0.40:0.23;
    let health=((state.stats&&state.stats.Health)||50)/70;
    let chance=Math.max(0,Math.min(0.55,base*ff*mf*health));
    return {femaleAge:fAge,maleAge:mAge,chance,status};
  }
  function addLogAction198(title,text,stats,cash,type){
    try{action(title,text,stats||{},cash||0,type||'good')}
    catch(e){
      if(cash)state.money=(state.money||0)+cash;
      try{applyStats(stats||{})}catch(_e){}
      try{addLog('<b>'+title+'</b><br>'+text,type||'good',false)}catch(_e){}
      save198();
    }
  }
  function randomFirst198(g){
    try{return pick(DATE_NAMES[g]||DATE_NAMES.male)}catch(e){return g==='female'?pick198(['Sophie','Luna','Emma','Mila','Noa','Sara']):pick198(['Lucas','Milan','Daan','Noah','Sem','Finn'])}
  }
  window.openChildNamePopup198=function(mode,gender,age,cost){
    gender=gender||((Math.random()<0.5)?'male':'female');
    age=Number.isFinite(age)?age:0;
    const first=randomFirst198(gender), last=lastName198();
    window._pendingChild198={mode:mode||'birth',gender,age,cost:cost||0,defaultFirst:first,defaultLast:last};
    const label=mode==='adoption'?'adoptiekind':genderLabel198(gender);
    showModal(`<div class="modalTop"><div class="avatar">${hicon198(gender,age)}</div><div class="modalTitle">Naam geven</div></div><div class="modalBody"><p>Je krijgt een ${label}. Geef zelf een naam. Laat je het leeg, dan gebruikt de game een random naam.</p><input id="childFirst198" type="text" placeholder="Voornaam" value="${first}" maxlength="20" style="width:100%;padding:12px;border-radius:9px;border:1px solid #556;background:#15171b;color:#fff;font-size:18px;margin:6px 0 8px"><input id="childLast198" type="text" placeholder="Achternaam" value="${last}" maxlength="22" style="width:100%;padding:12px;border-radius:9px;border:1px solid #556;background:#15171b;color:#fff;font-size:18px;margin:0 0 10px"><button class="btn" onclick="confirmChildName198()">✅ Naam bevestigen</button><button class="btn alt" onclick="randomizeChildName198()">🎲 Random naam</button><button class="btn alt" onclick="closeModal()">Annuleren</button></div>`);
    setTimeout(()=>{try{document.getElementById('childFirst198').focus()}catch(e){}},60);
  };
  window.randomizeChildName198=function(){
    const p=window._pendingChild198;if(!p)return;
    const el=document.getElementById('childFirst198');
    if(el)el.value=randomFirst198(p.gender);
  };
  window.confirmChildName198=function(){
    const p=window._pendingChild198;if(!p)return toast198('Geen kind om te benoemen.');
    let first=cleanName198(document.getElementById('childFirst198')?.value||p.defaultFirst,20)||randomFirst198(p.gender);
    let last=cleanName198(document.getElementById('childLast198')?.value||p.defaultLast,22)||lastName198();
    const full=(first+' '+last).trim();
    state.children=state.children||[];
    const child={name:full,firstName:first,lastName:last,age:p.age||0,rel:r198(55,95),happiness:r198(55,90),school:50,gender:p.gender,icon:hicon198(p.gender,p.age||0),birthType:p.mode==='adoption'?'adoption':'biological',customNamed:true};
    state.children.push(child);
    const partnerName=state.partner?state.partner.name:'mijn partner';
    const txt=p.mode==='adoption'
      ? `${partnerName} en ik adopteerden ${child.name}. Ik koos zelf de naam.`
      : `${partnerName} en ik kregen een kind: ${child.name}. Ik koos zelf de naam.`;
    closeModal();
    addLogAction198(p.mode==='adoption'?'Adoptie':'Kind',txt,{Happiness:p.mode==='adoption'?12:15},-(p.cost||0),'good');
    window._pendingChild198=null;
  };
  window.tryChild=function(){
    if(!state.partner||state.age<18)return toast198('Je hebt een partner nodig en moet 18+ zijn.');
    const info=fertilityInfo198();
    if(info.femaleAge==null){
      return showModal(`<div class="modalTop"><div class="avatar">👶</div><div class="modalTitle">Kind proberen</div></div><div class="modalBody"><p>${info.status}</p><button class="btn" onclick="adoptChild198()">🏡 Adoptie starten</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
    }
    if(info.femaleAge>=48){
      return showModal(`<div class="modalTop"><div class="avatar">👶</div><div class="modalTitle">Vruchtbaarheid</div></div><div class="modalBody"><p>${info.status}</p><button class="btn" onclick="adoptChild198()">🏡 Adoptie starten</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
    }
    closeModal();
    if(Math.random()<info.chance){
      const g=Math.random()<0.5?'male':'female';
      const cost=r198(900,2400);
      openChildNamePopup198('birth',g,0,cost);
    }else{
      addLogAction198('Kind',`We probeerden een kind te krijgen, maar het lukte dit jaar niet.<br><span class="mini">${info.status} Kans ongeveer ${Math.round(info.chance*100)}%.</span>`,{Happiness:-2},0,'warn');
    }
  };
  try{tryChild=window.tryChild}catch(e){}
  window.adoptChild198=function(){
    if(!state.partner||state.age<18)return toast198('Je hebt een partner nodig en moet 18+ zijn.');
    const cost=6500;
    if((state.money||0)<cost)return toast198('Adoptie kost '+money198(cost)+'. Niet genoeg geld.');
    const rel=(state.partner.rel||50);
    if(rel<35)return toast198('Jullie relatie is te instabiel voor adoptie. Werk eerst aan je partnerrelatie.');
    const ok=Math.random()<Math.min(0.85,0.45+rel/160+(state.partner.married?0.15:0));
    closeModal();
    if(!ok)return addLogAction198('Adoptie','De adoptieprocedure liep vast. De instanties vonden onze situatie nog niet stabiel genoeg.',{Happiness:-4,Smarts:1},-350,'warn');
    const g=Math.random()<0.5?'male':'female';
    const age=r198(0,5);
    openChildNamePopup198('adoption',g,age,cost);
  };
  window.renameChild198=function(i){
    const c=state.children&&state.children[i];if(!c)return;
    const parts=(c.name||'').split(/\s+/);
    const first=c.firstName||parts[0]||randomFirst198(c.gender);
    const last=c.lastName||parts.slice(1).join(' ')||lastName198();
    window._renameChild198=i;
    showModal(`<div class="modalTop"><div class="avatar">${c.icon||hicon198(c.gender,c.age)}</div><div class="modalTitle">Naam wijzigen</div></div><div class="modalBody"><p>Nieuwe naam voor ${c.name}.</p><input id="renameChildFirst198" type="text" placeholder="Voornaam" value="${first}" maxlength="20" style="width:100%;padding:12px;border-radius:9px;border:1px solid #556;background:#15171b;color:#fff;font-size:18px;margin:6px 0 8px"><input id="renameChildLast198" type="text" placeholder="Achternaam" value="${last}" maxlength="22" style="width:100%;padding:12px;border-radius:9px;border:1px solid #556;background:#15171b;color:#fff;font-size:18px;margin:0 0 10px"><button class="btn" onclick="confirmRenameChild198()">✅ Opslaan</button><button class="btn alt" onclick="childScreen(${i})">Terug</button></div>`);
  };
  window.confirmRenameChild198=function(){
    const i=window._renameChild198; const c=state.children&&state.children[i]; if(!c)return toast198('Kind niet gevonden.');
    const old=c.name;
    const first=cleanName198(document.getElementById('renameChildFirst198')?.value||c.firstName||'',20)||randomFirst198(c.gender);
    const last=cleanName198(document.getElementById('renameChildLast198')?.value||c.lastName||'',22)||lastName198();
    c.firstName=first;c.lastName=last;c.name=(first+' '+last).trim();c.customNamed=true;
    try{addLog('<b>Naam gewijzigd</b><br>'+old+' heet nu '+c.name+'.','good',false)}catch(e){}
    save198();
    childScreen(i);
  };
  const oldChildScreen198=window.childScreen || (typeof childScreen==='function'?childScreen:null);
  window.childScreen=function(i){
    const c=state.children&&state.children[i];if(!c)return;
    let bio=c.birthType==='adoption'?'Adoptiekind':'Biologisch kind';
    showModal(`<div class="modalTop"><div class="avatar">${c.icon||hicon198(c.gender,c.age)}</div><div class="modalTitle">${c.icon||hicon198(c.gender,c.age)} ${c.name}</div></div><div class="modalBody"><div class="card">${bio}<br>Leeftijd: ${c.age}<br>${genderLabel(c)} · relatie ${c.rel}%</div><button class="btn" onclick="renameChild198(${i})">✏️ Naam wijzigen</button><button class="btn" onclick="spendChild(${i})">⏰ Spend Time</button><button class="btn" onclick="watchPokemonWithChild(${i})">📺 Samen Pokémon kijken</button><button class="btn" onclick="personAction('child',${i},'compliment')">😘 Compliment</button><button class="btn" onclick="personAction('child',${i},'movie')">🎭 Movie Theater</button><button class="btn" onclick="personAction('child',${i},'gift')">🎁 Gift</button><button class="btn" onclick="personAction('child',${i},'giveMoney')">💸 Give Money</button><button class="btn red" onclick="personAction('child',${i},'insult')">🤬 Insult</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  try{childScreen=window.childScreen}catch(e){}
  const oldPartnerScreen198=window.partnerScreen || (typeof partnerScreen==='function'?partnerScreen:null);
  window.partnerScreen=function(){
    const p=state.partner;if(!p)return;
    const info=fertilityInfo198();
    const fertility=`<div class="card"><b>Gezin & vruchtbaarheid</b><br>${info.status}<br>${info.femaleAge!=null&&info.femaleAge<48?'Natuurlijke kans dit jaar: ongeveer '+Math.round(info.chance*100)+'%.':'Natuurlijke kans dit jaar: 0%.'}</div>`;
    showModal(`<div class="modalTop"><div class="avatar">${p.married?'💍':(p.icon||'💘')}</div><div class="modalTitle">${p.icon||'💘'} ${p.name}</div></div><div class="modalBody"><div class="card">${p.married?'Getrouwd':'Partner'}<br>${(p.gender==='female'?'Vrouw':'Man')} · Leeftijd: ${p.age}<br>Relatie: ${p.rel}%</div>${fertility}<button class="btn" onclick="talkPartner()">Praat</button><button class="btn pink" onclick="flirtPartner()">Flirt</button><button class="btn" onclick="spendPartner()">Tijd doorbrengen</button>${!p.married?'<button class="btn gold" onclick="propose()">💍 Trouwen</button>':'<button class="btn red" onclick="divorce()">Scheiden</button>'}<button class="btn" onclick="tryChild()">👶 Kind proberen</button><button class="btn" onclick="adoptChild198()">🏡 Kind adopteren</button><button class="btn red" onclick="breakup()">Uit elkaar</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  try{partnerScreen=window.partnerScreen}catch(e){}
})();
