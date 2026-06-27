
/* v19.7 Family Age + Role Sync
   Fixes siblings aging faster than the player and keeps "zusje/broertje" relative labels stable.
   Also shows parent ages in the Relationships list.
*/
(function(){
  function clamp197(v,min=0,max=120){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function toast197(t){try{toast(t)}catch(e){console.log(t)}}
  function save197(){try{safeSave()}catch(e){}}
  function rr197(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function gender197(p){
    let g=(p&&p.gender)||'';
    if(g==='female'||g==='male')return g;
    try{return inferPersonGender(p,g)}catch(e){}
    return g||'female';
  }
  function hicon197(g,age){
    try{return humanIcon(g,age)}catch(e){return g==='female'?(age>=18?'👩':'👧'):(age>=18?'👨':'👦')}
  }
  function rel197(p){
    if(!p)return 50;
    if(typeof p.rel==='number')return p.rel;
    if(typeof p.relationship==='number')return p.relationship;
    return 50;
  }
  function siblingRelative197(b){
    const g=gender197(b);
    const raw=((b&&b.role)||'').toString().toLowerCase();
    if(b && b._relativeToPlayer197)return b._relativeToPlayer197;
    if(raw.includes('zusje')||raw.includes('broertje')||raw.includes('jongere'))return 'younger';
    if(raw.includes('oudere'))return 'older';
    const diff=(b.age||0)-(state.age||0);
    if(diff<0)return 'younger';
    if(diff===0)return 'twin';
    // If a sibling is suddenly far older but has no adult life, assume age drift/corruption.
    if(diff>6 && !b.movedOut && !b.job && !b.partner && !(b.children&&b.children.length))return 'younger';
    return 'older';
  }
  function siblingRole197(b){
    const g=gender197(b);
    const rel=siblingRelative197(b);
    if(rel==='younger')return g==='female'?'zusje':'broertje';
    if(rel==='older')return g==='female'?'oudere zus':'oudere broer';
    return g==='female'?'tweelingzus':'tweelingbroer';
  }
  function lockParent197(p,who){
    if(!p)return;
    p.gender=who==='mother'?'female':'male';
    if(typeof p.age!=='number' || !Number.isFinite(p.age) || p.age<13){
      p.age=clamp197((state.age||0)+(who==='mother'?28:31),16,90);
    }
    if(typeof p._ageOffset197!=='number'){
      p._ageOffset197=clamp197(p.age-(state.age||0),13,80);
    }
    p.age=clamp197((state.age||0)+p._ageOffset197,16,100);
    p.icon=p.icon||hicon197(p.gender,p.age);
  }
  function lockSibling197(b){
    if(!b)return;
    b.gender=gender197(b);
    if(typeof b.age!=='number' || !Number.isFinite(b.age))b.age=0;
    if(!b._relativeToPlayer197)b._relativeToPlayer197=siblingRelative197(b);
    if(typeof b._ageOffset197!=='number'){
      let diff=b.age-(state.age||0);
      if(b._relativeToPlayer197==='younger'){
        if(diff>=0)diff=-1;
        b._ageOffset197=diff;
      }else if(b._relativeToPlayer197==='older'){
        if(diff<=0)diff=1;
        b._ageOffset197=diff;
      }else{
        b._ageOffset197=0;
      }
    }
    // Absolute rule: age is always player age + locked offset.
    b.age=clamp197((state.age||0)+b._ageOffset197,0,100);
    // If a younger sibling still landed same/older due old corruption, correct hard.
    if(b._relativeToPlayer197==='younger' && b.age>=(state.age||0)){
      b._ageOffset197=-1;
      b.age=clamp197((state.age||0)-1,0,100);
    }
    b.role=siblingRole197(b);
    b.icon=hicon197(b.gender,b.age);
    // Children/partners should also not age through repeated wrappers endlessly; lock them when seen.
    (b.children||[]).forEach(k=>{
      if(typeof k.age!=='number')k.age=0;
      if(typeof k._ageOffsetFromPlayer197!=='number')k._ageOffsetFromPlayer197=k.age-(state.age||0);
      k.age=clamp197((state.age||0)+k._ageOffsetFromPlayer197,0,100);
      k.gender=gender197(k);
      k.icon=k.icon||hicon197(k.gender,k.age);
    });
    if(b.partner){
      if(typeof b.partner.age!=='number')b.partner.age=Math.max(16,b.age);
      if(typeof b.partner._ageOffsetFromSibling197!=='number')b.partner._ageOffsetFromSibling197=b.partner.age-b.age;
      b.partner.age=clamp197(b.age+b.partner._ageOffsetFromSibling197,16,100);
      b.partner.gender=gender197(b.partner);
      b.partner.icon=b.partner.icon||hicon197(b.partner.gender,b.partner.age);
    }
  }
  function syncFamily197(){
    if(!state)return;
    state.flags=state.flags||{};
    lockParent197(state.mother,'mother');
    lockParent197(state.father,'father');
    (state.siblings||[]).forEach(lockSibling197);
  }
  window.syncFamilyAges197=syncFamily197;

  window.setSiblingYounger197=function(i){
    const b=state.siblings&&state.siblings[i]; if(!b)return;
    b._relativeToPlayer197='younger';
    b._ageOffset197=Math.min(-1,(typeof b.age==='number'?b.age-(state.age||0):-1));
    b.age=clamp197((state.age||0)+b._ageOffset197,0,100);
    b.role=siblingRole197(b); b.icon=hicon197(gender197(b),b.age);
    save197();
    try{render()}catch(e){}
    setTimeout(()=>siblingScreen(i),0);
    toast197('Gecorrigeerd als jonger zusje/broertje.');
  };
  window.setSiblingOlder197=function(i){
    const b=state.siblings&&state.siblings[i]; if(!b)return;
    b._relativeToPlayer197='older';
    b._ageOffset197=Math.max(1,(typeof b.age==='number'?b.age-(state.age||0):1));
    b.age=clamp197((state.age||0)+b._ageOffset197,0,100);
    b.role=siblingRole197(b); b.icon=hicon197(gender197(b),b.age);
    save197();
    try{render()}catch(e){}
    setTimeout(()=>siblingScreen(i),0);
    toast197('Gecorrigeerd als oudere broer/zus.');
  };
  window.setSiblingTwin197=function(i){
    const b=state.siblings&&state.siblings[i]; if(!b)return;
    b._relativeToPlayer197='twin'; b._ageOffset197=0; b.age=state.age||0;
    b.role=siblingRole197(b); b.icon=hicon197(gender197(b),b.age);
    save197(); try{render()}catch(e){}; setTimeout(()=>siblingScreen(i),0);
    toast197('Gecorrigeerd als tweeling.');
  };

  const oldSiblingScreen197=window.siblingScreen || (typeof siblingScreen==='function'?siblingScreen:null);
  window.siblingScreen=function(i){
    syncFamily197();
    const b=state.siblings&&state.siblings[i];
    if(!b)return;
    let status=[];
    if(b.movedOut)status.push('uit huis'); else status.push('woont thuis');
    if(b.job)status.push('werk: '+b.job);
    if(b.partner)status.push(`${b.married?'getrouwd met':'relatie met'} ${b.partner.name} (${b.partner.age||'?'} jaar)`);
    else if(b.age>=16)status.push('single');
    let kids=(b.children||[]).map((k,ki)=>`<button class="btn" onclick="nieceNephewScreen(${i},${ki})">${k.icon||hicon197(k.gender,k.age)} ${k.name}<br><span class="mini">${k.gender==='female'?'Nichtje':'Neefje'} · ${k.age} jaar</span></button>`).join('');
    const offset=b._ageOffset197||0;
    const relText=offset<0?`${Math.abs(offset)} jaar jonger dan jij`:offset>0?`${offset} jaar ouder dan jij`:'even oud als jij';
    showModal(`<div class="modalTop"><div class="avatar">${b.icon||hicon197(b.gender,b.age)}</div><div class="modalTitle">${b.name}</div></div><div class="modalBody"><div class="card"><b>${siblingRole197(b)}</b><br>${b.age} jaar · ${relText}<br>${status.join('<br>')}<br>Relatie: ${rel197(b)}% ${typeof relationBar==='function'?relationBar(rel197(b)):''}</div><button class="btn" onclick="talkSibling(${i})">💬 Gesprek</button><button class="btn" onclick="spendSibling(${i})">🕒 Tijd doorbrengen</button><button class="btn" onclick="complimentSibling(${i})">😘 Compliment</button><button class="btn red" onclick="insultSibling(${i})">🤬 Beledigen</button><div class="section">Leeftijd/rol corrigeren</div><button class="btn alt" onclick="setSiblingYounger197(${i})">👧 Dit is mijn jongere zusje/broertje</button><button class="btn alt" onclick="setSiblingOlder197(${i})">🧑 Dit is mijn oudere broer/zus</button><button class="btn alt" onclick="setSiblingTwin197(${i})">👥 Dit is mijn tweeling</button>${kids?`<div class="section">Neefjes / nichtjes</div>${kids}`:''}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  try{siblingScreen=window.siblingScreen}catch(e){}

  const oldRelationships197=window.relationshipsHTML || (typeof relationshipsHTML==='function'?relationshipsHTML:null);
  window.relationshipsHTML=function(){
    syncFamily197();
    let h=oldRelationships197?oldRelationships197():'';
    // Modify the already-existing rows rather than rebuilding the whole screen, so other patches stay intact.
    try{
      const tmp=document.createElement('div');
      tmp.innerHTML=String(h);
      function setSubByOnclick(match,sub){
        const rowEl=[...tmp.querySelectorAll('.row')].find(el=>String(el.getAttribute('onclick')||'').includes(match));
        if(rowEl){
          const s=rowEl.querySelector('.sub');
          if(s)s.innerHTML=sub;
        }
      }
      if(state.mother)setSubByOnclick("parentScreen('mother')",`${state.mother.name||'Moeder'} · Vrouw · ${state.mother.age} jaar · relatie ${rel197(state.mother)}%`);
      if(state.father)setSubByOnclick("parentScreen('father')",`${state.father.name||'Vader'} · Man · ${state.father.age} jaar · relatie ${rel197(state.father)}%`);
      (state.siblings||[]).forEach((b,i)=>{
        const rowEl=[...tmp.querySelectorAll('.row')].find(el=>String(el.getAttribute('onclick')||'').includes(`siblingScreen(${i})`));
        if(rowEl){
          const s=rowEl.querySelector('.sub');
          if(s)s.innerHTML=`${siblingRole197(b)} · ${b.age} jaar · relatie ${rel197(b)}%`;
        }
      });
      h=tmp.innerHTML;
    }catch(e){}
    return h;
  };
  try{relationshipsHTML=window.relationshipsHTML}catch(e){}

  const oldParentScreen197=window.parentScreen || (typeof parentScreen==='function'?parentScreen:null);
  window.parentScreen=function(who){
    syncFamily197();
    if(oldParentScreen197)return oldParentScreen197(who);
  };
  try{parentScreen=window.parentScreen}catch(e){}

  const oldAgeUp197=window.ageUp || (typeof ageUp==='function'?ageUp:null);
  if(oldAgeUp197 && !oldAgeUp197.__familySync197){
    window.ageUp=function(){
      const beforeAge=state&&state.age;
      const beforeOffsets=(state&&state.siblings||[]).map(b=>({b,off:typeof b._ageOffset197==='number'?b._ageOffset197:null,rel:b._relativeToPlayer197||null}));
      const res=oldAgeUp197.apply(this,arguments);
      try{
        // Restore locks after any old/patched yearly aging.
        beforeOffsets.forEach(x=>{
          if(x.off!==null)x.b._ageOffset197=x.off;
          if(x.rel)x.b._relativeToPlayer197=x.rel;
        });
        syncFamily197();
        save197();
        try{render()}catch(e){}
      }catch(e){}
      return res;
    };
    window.ageUp.__familySync197=true;
    try{ageUp=window.ageUp}catch(e){}
  }

  const oldMigrate197=window.migrate || (typeof migrate==='function'?migrate:null);
  if(oldMigrate197 && !oldMigrate197.__familySync197){
    window.migrate=function(s){
      s=oldMigrate197(s);
      try{state=s; syncFamily197();}catch(e){}
      return s;
    };
    window.migrate.__familySync197=true;
    try{migrate=window.migrate}catch(e){}
  }

  setTimeout(()=>{try{syncFamily197();save197();try{render()}catch(e){}}catch(e){}},400);
})();
