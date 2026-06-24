
/* v19.2 Group Talk Original UI Fix
   Fixes broken/wrong-styled Groepsgesprekken menu by using original row/card/section layout and robust relationship updates.
*/
(function(){
  function r192(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function c192(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function toast192(t){try{toast(t)}catch(e){console.log(t)}}
  function save192(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function rr192(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function relationValue192(p){
    if(!p)return 50;
    if(typeof p.rel==='number')return p.rel;
    if(typeof p.relationship==='number')return p.relationship;
    if(typeof p.closeness==='number')return p.closeness;
    if(typeof p.band==='number')return p.band;
    return 50;
  }
  function setRelation192(p,val){
    if(!p)return;
    val=c192(val);
    if(typeof p.rel==='number' || !('relationship' in p && typeof p.relationship==='number')) p.rel=val;
    if(typeof p.relationship==='number')p.relationship=val;
    if(typeof p.closeness==='number')p.closeness=val;
    if(typeof p.band==='number')p.band=val;
  }
  function addRel192(p,delta){
    setRelation192(p, relationValue192(p)+delta);
  }
  function name192(p,fallback){
    return (p && (p.name||p.title||p.firstName)) || fallback || 'Onbekend';
  }
  function people192(){
    const arr=[];
    if(state.mother)arr.push({key:'mother',person:state.mother,label:'Moeder',group:'parents'});
    if(state.father)arr.push({key:'father',person:state.father,label:'Vader',group:'parents'});
    if(state.parent1)arr.push({key:'parent1',person:state.parent1,label:'Ouder',group:'parents'});
    if(state.parent2)arr.push({key:'parent2',person:state.parent2,label:'Ouder',group:'parents'});
    if(state.partner)arr.push({key:'partner',person:state.partner,label:'Partner',group:'family'});
    (state.siblings||[]).forEach((p,i)=>arr.push({key:'sibling'+i,person:p,label:p.role||'Sibling',group:'family'}));
    (state.children||[]).forEach((p,i)=>arr.push({key:'child'+i,person:p,label:'Kind',group:'family'}));
    (state.friends||[]).forEach((p,i)=>arr.push({key:'friend'+i,person:p,label:'Vriend',group:'friends'}));
    (state.vacationContacts||[]).forEach((p,i)=>arr.push({key:'vacation'+i,person:p,label:'Vakantiecontact',group:'friends'}));
    return arr.filter(x=>x.person);
  }
  function targets192(kind){
    const all=people192();
    if(kind==='parents')return all.filter(x=>x.group==='parents');
    if(kind==='family')return all.filter(x=>x.group==='parents'||x.group==='family');
    if(kind==='friends')return all.filter(x=>x.group==='friends');
    if(kind==='repair')return all.filter(x=>relationValue192(x.person)<60);
    return all;
  }
  function overview192(){
    const all=people192();
    const avg=all.length?Math.round(all.reduce((a,x)=>a+relationValue192(x.person),0)/all.length):0;
    const family=all.filter(x=>x.group==='parents'||x.group==='family').length;
    const friends=all.filter(x=>x.group==='friends').length;
    return `<div class="card"><b>Relatie-overzicht</b><br>Gemiddelde band: ${avg}%<br>Familie/partner/kinderen: ${family}<br>Vrienden/contacten: ${friends}<br><span class="mini">Eén knop = meerdere gesprekken tegelijk.</span></div>`;
  }
  function effectText192(effects){
    return Object.keys(effects||{}).filter(k=>effects[k]).map(k=>k+' '+(effects[k]>0?'+':'')+effects[k]).join(' · ');
  }
  function applyStats192(stats){
    stats=stats||{};
    try{applyStats(stats)}catch(e){
      state.stats=state.stats||{};
      Object.keys(stats).forEach(k=>{
        if(k==='Happiness')state.stats.Happiness=c192((state.stats.Happiness??50)+stats[k]);
        else if(k==='Health')state.stats.Health=c192((state.stats.Health??50)+stats[k]);
        else if(k==='Smarts')state.stats.Smarts=c192((state.stats.Smarts??50)+stats[k]);
        else if(k==='Looks')state.stats.Looks=c192((state.stats.Looks??50)+stats[k]);
        else if(k==='Stamina')state.stamina=c192((state.stamina??50)+stats[k]);
        else if(k==='Social')state.social=c192((state.social??0)+stats[k],0,999999);
      });
    }
    if(typeof state.happiness==='number' && stats.Happiness)state.happiness=c192(state.happiness+stats.Happiness);
    if(typeof state.health==='number' && stats.Health)state.health=c192(state.health+stats.Health);
    if(typeof state.smarts==='number' && stats.Smarts)state.smarts=c192(state.smarts+stats.Smarts);
    if(typeof state.looks==='number' && stats.Looks)state.looks=c192(state.looks+stats.Looks);
  }
  function resultModal192(title,text,stats){
    stats=stats||{};
    applyStats192(stats);
    const fx=effectText192(stats);
    try{addLog('<b>'+title+'</b><br>'+text+(fx?'<br><span class="mini">Effect: '+fx+'</span>':''),'good',false)}catch(e){}
    showModal(`<div class="modalTop"><div class="avatar">💬</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${fx?`<div class="vac187-effect">Effect: ${fx}</div>`:''}<button class="btn" onclick="closeModal()">Verder</button></div>`);
    save192();
  }
  window.groupTalkHub184=function(){
    let out=overview192();
    out += `<div class="section">Groepsgesprekken</div>`;
    out += rr192('🏠','Gezinsgesprek','Moeder, vader, partner, kinderen en siblings tegelijk checken','groupTalk184("family")');
    out += rr192('👪','Ouders spreken','Moeder en vader tegelijk spreken','groupTalk184("parents")');
    out += rr192('👥','Vriendengroep appen','Alle vrienden en vakantiecontacten sociaal onderhouden','groupTalk184("friends")');
    out += rr192('🌍','Iedereen check-in','Korte check-in met familie, partner, vrienden en contacten','groupTalk184("all")');
    out += rr192('🧯','Ruzies gladstrijken','Relaties onder 60% krijgen extra aandacht','groupTalk184("repair")');
    out += `<button class="btn alt" onclick="closeModal()">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">💬</div><div class="modalTitle">Groepsgesprekken</div></div><div class="modalBody" style="text-align:left">${out}</div>`);
  };
  window.groupTalk184=function(kind){
    const t=targets192(kind);
    if(!t.length){
      if(kind==='parents')return toast192('Geen ouders gevonden om te spreken.');
      if(kind==='friends')return toast192('Geen vrienden/contacten gevonden om te appen.');
      if(kind==='repair')return toast192('Geen relaties onder 60% gevonden.');
      return toast192('Geen passende relaties gevonden.');
    }
    let total=0;
    t.forEach(x=>{
      const boost = kind==='repair' ? r192(8,16) : kind==='all' ? r192(2,6) : r192(4,10);
      addRel192(x.person,boost);
      total+=boost;
    });
    let title='Groepsgesprek';
    let text='';
    let stats={Happiness:3,Social:3,Stamina:-2};
    if(kind==='family'){title='Gezinsgesprek';text=`Je sprak met ${t.length} familieleden/gezinsleden tegelijk. De band werd sterker zonder iedereen apart aan te klikken.`;stats={Happiness:4,Social:3,Stamina:-2};}
    else if(kind==='parents'){title='Ouders gesproken';text=`Je sprak je ouder(s) tegelijk. Minder gedoe, meer duidelijkheid.`;stats={Happiness:3,Social:2,Stamina:-1};}
    else if(kind==='friends'){title='Vriendengroep geappt';text=`Je appte of sprak met ${t.length} vrienden/contacten tegelijk. Je sociale netwerk bleef warm.`;stats={Happiness:4,Social:5,Stamina:-2};}
    else if(kind==='repair'){title='Ruzies gladgestreken';text=`Je gaf extra aandacht aan ${t.length} zwakkere relaties. Niet alles is opgelost, maar de band ging merkbaar omhoog.`;stats={Happiness:2,Social:4,Stamina:-3};}
    else {title='Iedereen check-in';text=`Je deed een korte check-in met ${t.length} belangrijke mensen tegelijk.`;stats={Happiness:4,Social:4,Stamina:-3};}
    text += `<br><br>Relatieboost totaal: +${total}.`;
    resultModal192(title,text,stats);
  };

  // Keep old alias names working.
  window.groupTalkScreen=window.groupTalkHub184;
  window.relationshipGroupTalk=window.groupTalkHub184;

  // Add/replace one clean row in Relationships screen.
  const oldRel192 = window.relationshipsHTML || (typeof relationshipsHTML==='function' ? relationshipsHTML : null);
  window.relationshipsHTML=function(){
    let h=oldRel192?oldRel192():'';
    // Remove previous duplicate group-talk rows as far as possible.
    h=String(h).replace(/<div class="section">Groepsgesprekken<\/div>/g,'');
    h=h.replace(/<div class="row[^"]*"[^>]*onclick="groupTalkHub184\(\)"[\s\S]*?<\/div><\/div><div class="chev">›<\/div><\/div>/g,'');
    h=h.replace(/<div class="row[^"]*"[^>]*onclick="groupTalkScreen\(\)"[\s\S]*?<\/div><\/div><div class="chev">›<\/div><\/div>/g,'');
    return `<div class="section">Groepsgesprekken</div>${rr192('💬','Groepsgesprekken','Ouders, gezin, vrienden en contacten tegelijk spreken','groupTalkHub184()')}`+h;
  };
  try{relationshipsHTML=window.relationshipsHTML}catch(e){}
})();
