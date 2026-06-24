
/* v19.4 Group Talk Expanded Fix
   Fixes broken onclicks by using single-quote-safe handlers and adds richer group conversation choices.
*/
(function(){
  function r194(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function c194(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function toast194(t){try{toast(t)}catch(e){console.log(t)}}
  function save194(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function rr194(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function rel194(p){
    if(!p)return 50;
    if(typeof p.rel==='number')return p.rel;
    if(typeof p.relationship==='number')return p.relationship;
    if(typeof p.closeness==='number')return p.closeness;
    if(typeof p.band==='number')return p.band;
    return 50;
  }
  function setRel194(p,v){
    if(!p)return;
    v=c194(v);
    p.rel=v;
    if(typeof p.relationship==='number')p.relationship=v;
    if(typeof p.closeness==='number')p.closeness=v;
    if(typeof p.band==='number')p.band=v;
  }
  function addRel194(p,d){setRel194(p,rel194(p)+d)}
  function people194(){
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
  function targets194(kind){
    const all=people194();
    if(kind==='parents')return all.filter(x=>x.group==='parents');
    if(kind==='family')return all.filter(x=>x.group==='parents'||x.group==='family');
    if(kind==='friends')return all.filter(x=>x.group==='friends');
    if(kind==='repair')return all.filter(x=>rel194(x.person)<65);
    return all;
  }
  function apply194(stats){
    stats=stats||{};
    try{applyStats(stats)}catch(e){
      state.stats=state.stats||{};
      Object.keys(stats).forEach(k=>{
        const d=stats[k]; if(!d)return;
        if(['Happiness','Health','Smarts','Looks'].includes(k))state.stats[k]=c194((state.stats[k]??50)+d);
        if(k==='Stamina')state.stamina=c194((state.stamina??50)+d);
        if(k==='Social')state.social=c194((state.social??0)+d,0,999999);
      });
    }
    if(typeof state.happiness==='number'&&stats.Happiness)state.happiness=c194(state.happiness+stats.Happiness);
    if(typeof state.health==='number'&&stats.Health)state.health=c194(state.health+stats.Health);
    if(typeof state.smarts==='number'&&stats.Smarts)state.smarts=c194(state.smarts+stats.Smarts);
    if(typeof state.looks==='number'&&stats.Looks)state.looks=c194(state.looks+stats.Looks);
  }
  function fx194(stats){
    return Object.keys(stats||{}).filter(k=>stats[k]).map(k=>k+' '+(stats[k]>0?'+':'')+stats[k]).join(' · ');
  }
  function result194(icon,title,text,stats,type){
    stats=stats||{};
    apply194(stats);
    const fx=fx194(stats);
    try{addLog('<b>'+title+'</b><br>'+text+(fx?'<br><span class="mini">Effect: '+fx+'</span>':''),type||'good',false)}catch(e){}
    try{
      showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${fx?`<div class="vac187-effect">Effect: ${fx}</div>`:''}<button class="btn" onclick="closeModal()">Verder</button></div>`);
    }catch(e){toast194(title)}
    save194();
  }
  function overview194(){
    const all=people194();
    const avg=all.length?Math.round(all.reduce((a,x)=>a+rel194(x.person),0)/all.length):0;
    const family=all.filter(x=>x.group==='parents'||x.group==='family').length;
    const friends=all.filter(x=>x.group==='friends').length;
    return `<div class="card"><b>Relatie-overzicht</b><br>Gemiddelde band: ${avg}%<br>Familie/partner/kinderen: ${family}<br>Vrienden/contacten: ${friends}<br><span class="mini">Kies eerst groep, daarna het soort gesprek.</span></div>`;
  }
  const OPTIONS194={
    family:[
      ['🍽️','Samen eten / bijpraten','Warme gezinsboost, weinig risico','warm'],
      ['🧠','Serieus gesprek','Sterker effect, maar kan spanning geven','serious'],
      ['🎮','Samen iets leuks doen','Meer happiness, lichte relatieboost','fun'],
      ['🧹','Praktische hulp aanbieden','Relatie omhoog, stamina omlaag','help']
    ],
    parents:[
      ['☕','Rustig bijpraten','Veilige relatieboost met ouders','warm'],
      ['🙏','Advies vragen','Smarts/relatie omhoog','advice'],
      ['🧯','Excuses / ruzie oplossen','Sterk bij lage band','repair'],
      ['🏆','Goed nieuws delen','Happiness en ouderband omhoog','proud']
    ],
    friends:[
      ['📱','Groepsapp checken','Snelle social boost','chat'],
      ['🎮','Game/film avond plannen','Happiness en vriendenband omhoog','fun'],
      ['🌃','Uitgaan plannen','Meer happiness/social, stamina omlaag','party'],
      ['🤝','Iemand helpen','Sterke relatieboost bij vrienden','help']
    ],
    all:[
      ['🌍','Iedereen korte check-in','Snel alles onderhouden','checkin'],
      ['📣','Groot nieuws delen','Iedereen krijgt kleine boost','news'],
      ['🆘','Hulp vragen','Relatie kan stijgen, stress omlaag','support'],
      ['🎉','Iets vieren','Happiness/social omhoog','party']
    ],
    repair:[
      ['🧯','Ruzie rustig uitpraten','Beste optie voor lage relaties','repair'],
      ['💬','Eerlijk sorry zeggen','Relatie omhoog, ego omlaag','sorry'],
      ['🎁','Goedmaken met aandacht','Sterke boost, kost energie','gift'],
      ['🚶','Even afstand nemen','Minder stress, kleine relatieboost','space']
    ]
  };
  function groupTitle194(kind){
    return {family:'Gezinsgesprek',parents:'Ouders spreken',friends:'Vriendengroep',all:'Iedereen check-in',repair:'Ruzies gladstrijken'}[kind]||'Groepsgesprek';
  }
  window.groupTalkHub184=function(){
    let out=overview194();
    out += `<div class="section">Groepsgesprekken</div>`;
    out += rr194('🏠','Gezinsgesprek','Moeder, vader, partner, kinderen en siblings tegelijk checken',"groupTalkChoose194('family')");
    out += rr194('👪','Ouders spreken','Moeder en vader tegelijk spreken',"groupTalkChoose194('parents')");
    out += rr194('👥','Vriendengroep appen','Alle vrienden en vakantiecontacten sociaal onderhouden',"groupTalkChoose194('friends')");
    out += rr194('🌍','Iedereen check-in','Korte check-in met familie, partner, vrienden en contacten',"groupTalkChoose194('all')");
    out += rr194('🧯','Ruzies gladstrijken','Relaties onder 65% krijgen extra aandacht',"groupTalkChoose194('repair')");
    out += `<button class="btn alt" onclick="closeModal()">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">💬</div><div class="modalTitle">Groepsgesprekken</div></div><div class="modalBody" style="text-align:left">${out}</div>`);
  };
  window.groupTalkChoose194=function(kind){
    const t=targets194(kind);
    if(!t.length){
      if(kind==='parents')return toast194('Geen ouders gevonden.');
      if(kind==='friends')return toast194('Geen vrienden/contacten gevonden.');
      if(kind==='repair')return toast194('Geen relaties onder 65% gevonden.');
      return toast194('Geen passende relaties gevonden.');
    }
    let out=`<div class="card"><b>${groupTitle194(kind)}</b><br>Je spreekt met ${t.length} personen.<br><span class="mini">Kies hoe je het gesprek aanpakt.</span></div>`;
    out += `<div class="section">Gesprekstype</div>`;
    (OPTIONS194[kind]||OPTIONS194.all).forEach(opt=>{
      out += rr194(opt[0],opt[1],opt[2],`groupTalkDo194('${kind}','${opt[3]}')`);
    });
    out += `<button class="btn alt" onclick="groupTalkHub184()">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">💬</div><div class="modalTitle">${groupTitle194(kind)}</div></div><div class="modalBody" style="text-align:left">${out}</div>`);
  };
  window.groupTalk184=function(kind){
    // Backward compatibility: old direct buttons now open the richer chooser.
    return groupTalkChoose194(kind);
  };
  window.groupTalkDo194=function(kind,style){
    const t=targets194(kind);
    if(!t.length)return toast194('Geen passende relaties gevonden.');
    let min=3,max=8,stats={Happiness:3,Social:3,Stamina:-2},type='good',extra='';
    if(style==='warm'){min=5;max=10;stats={Happiness:4,Social:3,Stamina:-1};extra='Het gesprek bleef warm en normaal.'}
    if(style==='serious'){min=6;max=13;stats={Smarts:1,Happiness:1,Social:4,Stamina:-4};extra='Het werd serieus, maar daardoor ook nuttiger.'}
    if(style==='fun'){min=4;max=9;stats={Happiness:6,Social:4,Stamina:-3};extra='Samen iets leuks doen werkte beter dan alleen praten.'}
    if(style==='help'){min=7;max=14;stats={Happiness:2,Social:5,Stamina:-5};extra='Je hielp praktisch mee en dat werd gewaardeerd.'}
    if(style==='advice'){min=5;max=11;stats={Smarts:2,Happiness:2,Social:3,Stamina:-1};extra='Advies vragen gaf ook meer begrip.'}
    if(style==='repair'||style==='sorry'){min=9;max=18;stats={Happiness:2,Social:5,Stamina:-4};extra='Je pakte spanning actief aan. Niet alles perfect, maar wel vooruitgang.'}
    if(style==='proud'||style==='news'){min=4;max=10;stats={Happiness:5,Social:3,Stamina:-1};extra='Goed nieuws delen maakte de sfeer beter.'}
    if(style==='chat'||style==='checkin'){min=2;max=6;stats={Happiness:3,Social:4,Stamina:-1};extra='Een snelle check-in hield de band warm.'}
    if(style==='party'){min=4;max=9;stats={Happiness:7,Social:5,Health:-1,Stamina:-6};extra='Leuk, maar vermoeiend.'}
    if(style==='support'){min=5;max=12;stats={Happiness:3,Social:4,Stamina:1};extra='Hulp vragen luchtte op en liet zien wie om je geeft.'}
    if(style==='gift'){min=8;max=16;stats={Happiness:3,Social:4,Stamina:-3};extra='Aandacht geven werkte beter dan alleen woorden.'}
    if(style==='space'){min=2;max=5;stats={Happiness:1,Social:1,Stamina:3};extra='Afstand nemen voorkwam meer schade.'}

    let total=0;
    const names=[];
    t.forEach(x=>{
      let boost=r194(min,max);
      if(kind==='repair' && rel194(x.person)<45)boost+=r194(3,8);
      addRel194(x.person,boost);
      total+=boost;
      names.push((x.person.name||x.label||'Iemand'));
    });

    let text=`Je sprak met ${t.length} personen. ${extra}<br><br>Relatieboost totaal: +${total}.`;
    if(names.length<=5)text += `<br>Gesproken met: ${names.join(', ')}.`;
    else text += `<br>Gesproken met o.a.: ${names.slice(0,5).join(', ')} en meer.`;

    result194('💬',groupTitle194(kind),text,stats,type);
  };

  // Aliases
  window.groupTalkScreen=window.groupTalkHub184;
  window.relationshipGroupTalk=window.groupTalkHub184;

  // Final relationships output cleanup + one clean row.
  const oldRel194=window.relationshipsHTML || (typeof relationshipsHTML==='function' ? relationshipsHTML : null);
  window.relationshipsHTML=function(){
    let h=oldRel194?oldRel194():'';
    // DOM-based cleanup if available, otherwise regex fallback.
    try{
      const tmp=document.createElement('div');
      tmp.innerHTML=String(h);
      tmp.querySelectorAll('.section').forEach(el=>{
        if((el.textContent||'').trim().toLowerCase()==='groepsgesprekken')el.remove();
      });
      tmp.querySelectorAll('.row').forEach(el=>{
        const oc=String(el.getAttribute('onclick')||'').toLowerCase();
        const txt=(el.textContent||'').toLowerCase();
        if(oc.includes('grouptalk')||txt.includes('groepsgesprekken'))el.remove();
      });
      h=tmp.innerHTML;
    }catch(e){
      h=String(h).replace(/<div class="section">Groepsgesprekken<\/div>/g,'');
    }
    return `<div class="section">Groepsgesprekken</div>${rr194('💬','Groepsgesprekken','Ouders, gezin, vrienden en contacten tegelijk spreken',"groupTalkHub184()")}`+h;
  };
  try{relationshipsHTML=window.relationshipsHTML}catch(e){}
})();
