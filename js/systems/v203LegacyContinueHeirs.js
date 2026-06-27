
/* v20.3 Legacy Continue Heirs
   Continue after death as child, sibling, grandchild/niece/nephew where available.
   Preserves legacy and transfers assets logically.
*/
(function(){
  function r203(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function clamp203(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function clone203(x){try{return clone(x)}catch(e){return JSON.parse(JSON.stringify(x||{}))}}
  function money203(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function human203(g,a,p){try{return humanIcon(g,a,p)}catch(e){return g==='female'?(a>=60?'👵':a<13?'👧':'👩'):(a>=60?'👴':a<13?'👦':'👨')}}
  function gender203(p){
    let g=(p&&p.gender)||'';
    try{g=normalizeDateGender(g||'any')}catch(e){}
    if(g==='male'||g==='female')return g;
    const n=((p&&p.name)||'').toLowerCase();
    return /a$|e$|ie$|y$|lotte|eva|sanne|sofia|aiko|maria|nina/.test(n)?'female':'male';
  }
  function first203(name){return String(name||'Nieuwe generatie').split(' ')[0]||'Nieuwe'}
  function last203(name){const p=String(name||'Familie').trim().split(/\s+/);return p.length>1?p[p.length-1]:'Familie'}
  function makePerson203(p, fallbackLast){
    p=p||{};
    let g=gender203(p), age=clamp203(p.age||0,0,110);
    let name=p.name||((g==='female'?'Dochter':'Zoon')+' '+fallbackLast);
    return {...p,name,firstName:first203(name),gender:g,age,icon:p.icon||human203(g,age,p),rel:typeof p.rel==='number'?p.rel:60};
  }
  function heirList203(){
    const list=[];
    (state.children||[]).forEach((c,i)=>{
      if(!c.dead)list.push({type:'child',index:i,person:c,label:'Kind',sub:`${c.age||0} jaar · ${gender203(c)==='female'?'Vrouw':'Man'}`});
      (c.children||[]).forEach((gc,gi)=>{
        if(!gc.dead)list.push({type:'grandchild',index:i,subIndex:gi,person:gc,label:'Kleinkind',sub:`kind van ${c.name} · ${gc.age||0} jaar`});
      });
    });
    (state.siblings||[]).forEach((s,i)=>{
      if(!s.dead)list.push({type:'sibling',index:i,person:s,label:(s.role||'Broer/zus'),sub:`${s.age||0} jaar · ${gender203(s)==='female'?'Vrouw':'Man'}`});
      (s.children||[]).forEach((n,ni)=>{
        if(!n.dead)list.push({type:'nieceNephew',index:i,subIndex:ni,person:n,label:(gender203(n)==='female'?'Nichtje':'Neefje'),sub:`kind van ${s.name} · ${n.age||0} jaar`});
      });
    });
    return list;
  }
  function netWorth203(old){
    try{return netWorth()}catch(e){}
    old=old||state;
    const houses=(old.houses||[]).reduce((s,h)=>s+(h.value||0),0);
    const cars=(old.cars||[]).reduce((s,c)=>s+(c.value||0),0);
    const items=(old.items||[]).reduce((s,i)=>s+(i.price||i.value||0)*0.45,0);
    const inv=(old.lifestyle?.investments||[]).reduce((s,i)=>s+(i.value||0),0);
    const biz=(old.lifestyle?.businesses||[]).reduce((s,b)=>s+(b.value||0),0);
    return Math.round((old.money||0)+houses+cars+items+inv+biz-(old.debts||0));
  }
  function parentFromOld203(old, roleForHeir){
    const g=old.gender||'male';
    return {
      name:old.name,
      age:old.age,
      gender:g,
      icon:human203(g,old.age||50,old),
      job:'overleden ouder',
      rel:65,
      dead:true,
      deathAge:old.age,
      role:roleForHeir||'overleden ouder',
      appearance:old.appearance||null
    };
  }
  function otherParent203(old, heirGender){
    if(old.partner){
      const p=clone203(old.partner);
      p.age=p.age||old.age;
      p.gender=gender203(p);
      p.icon=p.icon||human203(p.gender,p.age,p);
      p.job=p.job||'ouder';
      p.rel=p.rel||65;
      return p;
    }
    const g=heirGender==='female'?'male':'female';
    return {name:g==='female'?'Onbekende moeder':'Onbekende vader',age:old.age||40,gender:g,icon:human203(g,old.age||40),job:'onbekend',rel:35};
  }
  function safeFresh203(g,name){
    let ns=null;
    try{ns=fresh(g,name)}catch(e){}
    if(!ns){
      ns={name:name||'Nieuwe generatie',firstName:first203(name),gender:g,age:0,stats:{Happiness:50,Health:70,Smarts:50,Looks:50},money:0,log:[],children:[],siblings:[],pets:[],houses:[],cars:[],items:[],businesses:[],lifestyle:{items:[],investments:[],businesses:[],loans:[],yearlyCosts:0},flags:{},legacy:{generation:1,familyName:last203(name),fame:0}};
    }
    ns.stats=ns.stats||{Happiness:50,Health:70,Smarts:50,Looks:50};
    ns.log=ns.log||[];
    ns.flags=ns.flags||{};
    ns.children=ns.children||[];
    ns.siblings=ns.siblings||[];
    ns.pets=ns.pets||[];
    ns.houses=ns.houses||[];
    ns.cars=ns.cars||[];
    ns.items=ns.items||[];
    ns.businesses=ns.businesses||[];
    ns.lifestyle=ns.lifestyle||{items:[],investments:[],businesses:[],loans:[],yearlyCosts:0};
    ns.lifestyle.items=ns.lifestyle.items||[];
    ns.lifestyle.investments=ns.lifestyle.investments||[];
    ns.lifestyle.businesses=ns.lifestyle.businesses||[];
    ns.lifestyle.loans=ns.lifestyle.loans||[];
    return ns;
  }
  function transferAssets203(old, ns, heir){
    const age=ns.age||0;
    const cash=Math.max(0,old.money||0);
    const debt=Math.max(0,old.debts||0);
    const inheritanceRate = age>=18 ? 0.75 : 0.45;
    const debtPenalty = Math.round(debt * (age>=18 ? 0.35 : 0.10));
    const inherited=Math.max(0,Math.round(cash*inheritanceRate)-debtPenalty);
    ns.money=(ns.money||0)+inherited;

    ns.inheritance203={
      from:old.name,
      deathAge:old.age,
      netWorth:netWorth203(old),
      cashInherited:inherited,
      trustFund:0,
      assetsInherited:false,
      note:''
    };

    if(age>=18){
      ns.houses=(old.houses||[]).map(h=>({...clone203(h),inheritedFrom:old.name,primary:false}));
      ns.cars=(old.cars||[]).map(c=>({...clone203(c),inheritedFrom:old.name}));
      ns.items=(old.items||[]).map(i=>({...clone203(i),inheritedFrom:old.name}));
      ns.pets=(old.pets||[]).map(p=>({...clone203(p),rel:clamp203((p.rel||60)-8),inheritedFrom:old.name}));
      ns.businesses=(old.businesses||[]).map(b=>({...clone203(b),inheritedFrom:old.name}));
      ns.lifestyle.items=[...(old.lifestyle?.items||[]).map(x=>({...clone203(x),inheritedFrom:old.name})), ...(ns.lifestyle.items||[])];
      ns.lifestyle.investments=(old.lifestyle?.investments||[]).map(x=>({...clone203(x),inheritedFrom:old.name}));
      ns.lifestyle.businesses=(old.lifestyle?.businesses||[]).map(x=>({...clone203(x),inheritedFrom:old.name}));
      ns.inheritance203.assetsInherited=true;
      ns.inheritance203.note='Volwassen erfgenaam: huizen, auto’s, items, pets, investeringen en businesses zijn overgezet.';
    }else{
      const trust = Math.max(0, Math.round((old.houses||[]).reduce((s,h)=>s+(h.value||0),0)*0.08 + (old.lifestyle?.investments||[]).reduce((s,i)=>s+(i.value||0),0)*0.50 + (old.lifestyle?.businesses||[]).reduce((s,b)=>s+(b.value||0),0)*0.40));
      ns.inheritance203.trustFund=trust;
      ns.flags.trustFund203=trust;
      ns.pets=(old.pets||[]).slice(0,2).map(p=>({...clone203(p),rel:clamp203((p.rel||60)-12),inheritedFrom:old.name}));
      ns.inheritance203.note='Minderjarige erfgenaam: geld is deels trust fund; grote assets blijven onder beheer tot volwassenheid.';
    }
    return inherited;
  }
  function oldAsDeadSibling203(old, relationLabel){
    return {
      name:old.name,
      age:old.age,
      gender:old.gender||'male',
      icon:human203(old.gender||'male',old.age||50,old),
      rel:0,
      dead:true,
      deathAge:old.age,
      role:relationLabel||'overleden familielid',
      children:(old.children||[]).map(c=>makePerson203(c,last203(old.name))),
      partner:old.partner?clone203(old.partner):null,
      appearance:old.appearance||null
    };
  }
  function buildForChild203(old, child, idx){
    const last=last203(child.name||old.name);
    const p=makePerson203(child,last);
    const ns=safeFresh203(p.gender, first203(p.name));
    ns.name=p.name; ns.firstName=first203(p.name); ns.age=p.age; ns.gender=p.gender; ns.icon=human203(p.gender,p.age,p); ns.appearance=p.appearance||ns.appearance;
    ns.stats={Happiness:clamp203(38+r203(-10,8)),Health:clamp203(65+r203(-15,15)),Smarts:clamp203((p.smarts||50)+r203(-8,8)),Looks:clamp203((p.looks||50)+r203(-8,8))};
    const deadParent=parentFromOld203(old,'overleden ouder');
    const other=otherParent203(old,p.gender);
    if((old.gender||'male')==='female'){ns.mother=deadParent;ns.father=other}else{ns.father=deadParent;ns.mother=other}
    ns.siblings=(old.children||[]).filter((_,i)=>i!==idx).map(s=>makePerson203({...s,from:'broer/zus'},last));
    ns.children=(p.children||[]).map(k=>makePerson203(k,last));
    ns.partner=p.partner?clone203(p.partner):null;
    return ns;
  }
  function buildForSibling203(old, sib, idx){
    const last=last203(sib.name||old.name);
    const p=makePerson203(sib,last);
    const ns=safeFresh203(p.gender, first203(p.name));
    ns.name=p.name; ns.firstName=first203(p.name); ns.age=p.age; ns.gender=p.gender; ns.icon=human203(p.gender,p.age,p); ns.appearance=p.appearance||ns.appearance;
    ns.stats={Happiness:clamp203(42+r203(-8,10)),Health:clamp203(65+r203(-12,12)),Smarts:clamp203(50+r203(-12,15)),Looks:clamp203(50+r203(-12,15))};
    ns.mother=old.mother?clone203(old.mother):{name:'Moeder',age:(p.age||20)+28,gender:'female',icon:'👩',rel:50};
    ns.father=old.father?clone203(old.father):{name:'Vader',age:(p.age||20)+31,gender:'male',icon:'👨',rel:50};
    ns.siblings=[oldAsDeadSibling203(old, (old.gender==='female'?'overleden zus':'overleden broer')), ...(old.siblings||[]).filter((_,i)=>i!==idx).map(s=>makePerson203(s,last))];
    ns.children=(p.children||[]).map(k=>makePerson203(k,last));
    ns.partner=p.partner?clone203(p.partner):null;
    ns.job=p.job?{title:p.job, salary:0, inherited:true}:null;
    return ns;
  }
  function buildForGrandChild203(old, childIdx, gcIdx){
    const parent=(old.children||[])[childIdx]||{};
    const gc=(parent.children||[])[gcIdx]||{};
    const p=makePerson203(gc,last203(gc.name||parent.name||old.name));
    const ns=buildForChild203(old,{...p,children:[]},childIdx);
    ns.mother = gender203(parent)==='female'?makePerson203(parent,last203(parent.name)):ns.mother;
    ns.father = gender203(parent)==='male'?makePerson203(parent,last203(parent.name)):ns.father;
    ns.siblings=(parent.children||[]).filter((_,i)=>i!==gcIdx).map(s=>makePerson203(s,last203(p.name)));
    return ns;
  }
  function buildForNieceNephew203(old, sibIdx, nIdx){
    const sib=(old.siblings||[])[sibIdx]||{};
    const n=(sib.children||[])[nIdx]||{};
    const p=makePerson203(n,last203(n.name||sib.name||old.name));
    const ns=buildForSibling203(old,{...p,children:[]},sibIdx);
    if(gender203(sib)==='female') ns.mother=makePerson203(sib,last203(sib.name));
    else ns.father=makePerson203(sib,last203(sib.name));
    ns.siblings=(sib.children||[]).filter((_,i)=>i!==nIdx).map(s=>makePerson203(s,last203(p.name)));
    return ns;
  }
  function addLegacyLog203(ns, old, heirLabel, inherited){
    ns.legacy=ns.legacy||{};
    ns.legacy.generation=(old.legacy?.generation||1)+1;
    ns.legacy.familyName=old.legacy?.familyName||last203(ns.name);
    ns.legacy.fame=(old.legacy?.fame||0)+Math.max(0,Math.round((old.fame||0)/4));
    ns.legacy.memorials=old.legacy?.memorials||[];
    ns.legacy.memorials.push({name:old.name,age:old.age,netWorth:netWorth203(old),continuedAs:ns.name,heirLabel,atAge:ns.age});
    ns.log=[];
    ns.log.push({html:`<b>Nieuwe generatie</b><br>${old.name} is overleden op ${old.age}-jarige leeftijd. Ik leef nu verder als ${ns.name} (${heirLabel}).<br>Erfenis cash: ${money203(inherited)}.<br>${ns.inheritance203?.note||''}`,type:'good',age:ns.age});
    if(ns.flags?.trustFund203){
      ns.log.push({html:`<b>Trust fund</b><br>Omdat ik minderjarig ben, staat er ongeveer ${money203(ns.flags.trustFund203)} onder beheer tot ik volwassen ben.`,type:'warn',age:ns.age});
    }
  }
  window.legacyHeirs203=heirList203;
  window.deathHTML=function(){
    const heirs=heirList203();
    let h=`<div class="deadBox"><h1>☠️ ${state.name}</h1><p>Overleden op ${state.age}-jarige leeftijd.</p><p>Net worth: <b>${money203(netWorth203(state))}</b></p>`;
    if(heirs.length){
      h+=`<div class="section">Verder spelen als erfgenaam</div><p>Kies iemand uit je familie om de legacy voort te zetten.</p>`;
      h+=heirs.map((x,idx)=>{
        const p=makePerson203(x.person,last203(state.name));
        const icon=p.icon||human203(p.gender,p.age,p);
        return `<button class="btn green" onclick="continueAsHeir203(${idx})">${icon} Verder als ${p.name}<br><span class="mini">${x.label} · ${x.sub}</span></button>`;
      }).join('');
    }else{
      h+=`<div class="card">Je hebt geen levende kinderen, siblings, kleinkinderen of neefjes/nichtjes om als verder te spelen.</div>`;
    }
    h+=`<button class="btn" onclick="newLife()">Start New Life</button></div>`;
    return h;
  };
  try{deathHTML=window.deathHTML}catch(e){}
  window.continueAsHeir203=function(heirIdx){
    if(!state.dead)return;
    const old=clone203(state);
    const heirs=heirList203();
    const h=heirs[heirIdx];
    if(!h)return alert('Erfgenaam niet gevonden.');
    let ns;
    if(h.type==='child') ns=buildForChild203(old,(old.children||[])[h.index],h.index);
    else if(h.type==='sibling') ns=buildForSibling203(old,(old.siblings||[])[h.index],h.index);
    else if(h.type==='grandchild') ns=buildForGrandChild203(old,h.index,h.subIndex);
    else if(h.type==='nieceNephew') ns=buildForNieceNephew203(old,h.index,h.subIndex);
    else return alert('Onbekend erfgenaam-type.');
    const inherited=transferAssets203(old,ns,h.person);
    addLegacyLog203(ns,old,h.label,inherited);
    ns.dead=false;
    ns.jail=null;
    ns.flags=ns.flags||{};
    ns.flags.continuedLegacy203=true;
    ns.flags.previousLifeName203=old.name;
    ns.snapshots=[];
    state=ns;
    try{if(typeof syncFamilyAges197==='function')syncFamilyAges197()}catch(e){}
    try{if(typeof ensureAppearance199==='function'){ensureAppearance199(state.mother);ensureAppearance199(state.father)}}catch(e){}
    try{safeSave();render();toast('Je leeft nu verder als '+state.name+'.')}catch(e){console.warn(e)}
  };
  // Keep old function name working, but use upgraded logic.
  window.continueAsChild=function(i){
    const heirs=heirList203();
    const idx=heirs.findIndex(h=>h.type==='child'&&h.index===i);
    return window.continueAsHeir203(idx>=0?idx:0);
  };
  try{continueAsChild=window.continueAsChild}catch(e){}
  // Trust fund unlock at 18.
  const oldAgeUp203=window.ageUp || (typeof ageUp==='function'?ageUp:null);
  if(oldAgeUp203 && !oldAgeUp203.__legacy203){
    window.ageUp=function(){
      const before=state.age||0;
      const res=oldAgeUp203.apply(this,arguments);
      try{
        if((before<18) && (state.age||0)>=18 && state.flags?.trustFund203){
          const v=state.flags.trustFund203;
          state.money=(state.money||0)+v;
          state.flags.trustFund203=0;
          addLog(`<b>Trust fund vrijgekomen</b><br>Ik werd volwassen en kreeg ${money203(v)} uit de erfenis/trust fund.`, 'good', false);
          safeSave(); render();
        }
      }catch(e){}
      return res;
    };
    window.ageUp.__legacy203=true;
    try{ageUp=window.ageUp}catch(e){}
  }
})();
