
/* v21.2 Adult Role Sprite Stage Fix
   Fix: v21.1 could replace old parent emoji rows with the player's sprite.
   Parents/teachers/bosses/coaches now force adult sprites, while children/classmates use their own age.
*/
(function(){
  const BASE212='assets/avatar_sprites/';

  function gender212(p,g){
    let x=(g || (p&&p.gender) || 'male')+'';
    return x.toLowerCase()==='female'?'female':'male';
  }
  function hair212(p){
    let h=(p&&p.appearance&&p.appearance.hairColor)||'brown';
    h=String(h);
    if(h==='blond'||h==='black')return h;
    return 'brown';
  }
  function skin212(p){
    let t=(p&&p.appearance&&typeof p.appearance.skinTone==='number') ? p.appearance.skinTone : 25;
    return t>=55?'dark':'light';
  }
  function normalize212(p){
    if(!p || typeof p!=='object')return p;
    try{ if(typeof ensureAppearance199==='function')ensureAppearance199(p); }catch(e){}
    p.appearance=p.appearance||{};
    if(typeof p.appearance.skinTone!=='number')p.appearance.skinTone=25;
    if(!p.appearance.hairColor)p.appearance.hairColor='brown';
    return p;
  }
  function isSame212(a,b){
    return !!(a && b && typeof a==='object' && typeof b==='object' && a===b);
  }
  function isAdultRole212(p, ctx=''){
    ctx=String(ctx||'').toLowerCase();
    if(ctx.includes('mother')||ctx.includes('father')||ctx.includes('parent'))return True212();
    if(ctx.includes('teacher')||ctx.includes('docent')||ctx.includes('boss')||ctx.includes('coach')||ctx.includes('manager'))return True212();
    try{
      if(isSame212(p,state.mother)||isSame212(p,state.father))return true;
      if(p && state && (p.name===state.mother?.name || p.name===state.father?.name))return true;
    }catch(e){}
    const role=String((p&&p.role)||'').toLowerCase();
    if(/moeder|vader|ouder|parent|teacher|docent|juf|meester|coach|manager|boss|baas/.test(role))return true;
    if(p && p.job && (typeof p.age==='undefined' || Number(p.age)>=18))return true;
    return false;
  }
  function True212(){return true}
  function stage212(p, ctx=''){
    p=p||{};
    if(isAdultRole212(p,ctx))return 'adult';
    let age=Number(p.age);
    if(!Number.isFinite(age)){
      // Unknown people with adult flags/jobs default adult, otherwise use player-age only for player.
      try{ if(p.name && state && p.name===state.name) age=Number(state.age||0); }catch(e){}
      if(!Number.isFinite(age)) return 'adult';
    }
    if(age<=3)return 'baby';
    if(age<=12)return 'child';
    if(age<=17)return 'teen';
    return 'adult';
  }
  function key212(p, ctx='', g=null, age=null){
    p=normalize212(p||{});
    let stage = age!=null ? stage212(Object.assign({},p,{age}),ctx) : stage212(p,ctx);
    const core=`${gender212(p,g)}_${skin212(p)}_${hair212(p)}`;
    return stage==='adult'?core:`${stage}_${core}`;
  }
  function img212(p,size='md',ctx='',g=null,age=null){
    const k=key212(p,ctx,g,age);
    return `<img class="headSprite206 sprite211 sprite212 ${size}" src="${BASE212}${k}.png" alt="${k}" data-sprite-key="${k}">`;
  }
  window.spriteKey212=key212;
  window.spriteHTML212=img212;

  function player212(){
    return normalize212({name:state?.name,gender:state?.gender,age:state?.age,appearance:state?.appearance});
  }

  // Override previous hard fix with role-aware version.
  window.spriteHTML208=function(person,size='md',g=null,age=null){return img212(person||{},size,'',g,age)};
  window.spriteHTML206=window.spriteHTML208;
  window.forceSpriteHTML211=window.spriteHTML208;
  window.renderPersonEmoji199=function(p){return img212(p||{},'md')};
  window.renderPersonAvatar199=function(p,size='xl'){return img212(p||{},size==='big'?'xl':size)};
  window.avatarHTML199=window.renderPersonAvatar199;
  window.humanIcon=function(g,age=18,person=null){
    if(person && typeof person==='object')return img212(person,'md','',g,age);
    return img212({gender:g||'male',age:age||18,appearance:{skinTone:25,hairColor:'brown'}},'md','',g,age);
  };
  try{humanIcon=window.humanIcon}catch(e){}
  window.avatar=function(){
    if(!state)return img212({gender:'male',age:18,appearance:{skinTone:25,hairColor:'brown'}},'md');
    if(state.dead)return '☠️';
    return img212(player212(),'md','player',state.gender,state.age);
  };
  try{avatar=window.avatar}catch(e){}

  function walk212(root,fn,path='state'){
    if(!root || typeof root!=='object')return;
    const seen=new Set();
    function visit(x,pth){
      if(!x || typeof x!=='object' || seen.has(x))return;
      seen.add(x);
      if(x.name || x.gender || x.appearance || typeof x.age!=='undefined')fn(x,pth);
      Object.keys(x).forEach(k=>{
        const v=x[k];
        if(Array.isArray(v))v.forEach((a,i)=>visit(a,`${pth}.${k}[${i}]`));
        else if(v && typeof v==='object')visit(v,`${pth}.${k}`);
      });
    }
    visit(root,path);
  }

  window.refreshSprites212=function(){
    if(!state)return;
    try{ if(typeof applyAppearanceToPeople199==='function')applyAppearanceToPeople199(); }catch(e){}
    walk212(state,(p,path)=>{
      normalize212(p);
      p.icon=img212(p,'md',path);
      p.avatarSpriteKey212=key212(p,path);
    });
    if(state.mother){state.mother.icon=img212(state.mother,'md','mother');state.mother.avatarSpriteKey212=key212(state.mother,'mother');}
    if(state.father){state.father.icon=img212(state.father,'md','father');state.father.avatarSpriteKey212=key212(state.father,'father');}
    state.icon=img212(player212(),'md','player',state.gender,state.age);
  };

  function setIconForOnclick212(root, needle, person, ctx){
    if(!root || !person)return;
    [...root.querySelectorAll('.row')].forEach(row=>{
      const oc=row.getAttribute('onclick')||'';
      if(oc.includes(needle)){
        const ico=row.querySelector('.rIco');
        if(ico) ico.innerHTML=img212(person,'md',ctx);
      }
    });
  }

  function fixRelationshipRows212(root=document){
    try{
      if(!state)return;
      setIconForOnclick212(root, "parentScreen('mother')", state.mother, 'mother');
      setIconForOnclick212(root, 'parentScreen("mother")', state.mother, 'mother');
      setIconForOnclick212(root, "parentScreen('father')", state.father, 'father');
      setIconForOnclick212(root, 'parentScreen("father")', state.father, 'father');

      (state.children||[]).forEach((p,i)=>setIconForOnclick212(root, `childScreen(${i})`, p, `children[${i}]`));
      (state.siblings||[]).forEach((p,i)=>setIconForOnclick212(root, `siblingScreen(${i})`, p, `siblings[${i}]`));

      // Topbar/avatar should be player only.
      const top=document.querySelector('.top .avatar, #top .avatar, header .avatar');
      if(top)top.innerHTML=img212(player212(),'md','player');
    }catch(e){}
  }

  function replaceBadHumanEmoji212(root=document){
    // Only replace obvious topbar/player avatar emoji. Do NOT blindly replace every row with player sprite.
    try{
      const topCandidates=[...root.querySelectorAll('.top .avatar,#top .avatar,header .avatar')];
      topCandidates.forEach(el=>{
        if(!el.querySelector('img.headSprite206'))el.innerHTML=img212(player212(),'md','player');
      });
    }catch(e){}
  }

  function fixOldCssAvatar212(root=document){
    try{
      [...root.querySelectorAll('.ava199')].forEach(el=>{
        let p=player212(), ctx='player';
        const text=(el.closest('.card,.modalBody')?.textContent||'').toLowerCase();
        if(state?.mother?.name && text.includes(String(state.mother.name).toLowerCase())){p=state.mother;ctx='mother'}
        else if(state?.father?.name && text.includes(String(state.father.name).toLowerCase())){p=state.father;ctx='father'}
        else {
          (state?.children||[]).forEach((c,i)=>{if(c.name&&text.includes(String(c.name).toLowerCase())){p=c;ctx=`children[${i}]`}})
          ;(state?.siblings||[]).forEach((s,i)=>{if(s.name&&text.includes(String(s.name).toLowerCase())){p=s;ctx=`siblings[${i}]`}})
        }
        const wrap=document.createElement('span');
        wrap.innerHTML=img212(p,'xl',ctx);
        el.replaceWith(wrap.firstElementChild);
      });
    }catch(e){}
  }

  function post212(){
    try{
      refreshSprites212();
      fixOldCssAvatar212(document);
      fixRelationshipRows212(document);
      replaceBadHumanEmoji212(document);
    }catch(e){}
  }

  const oldRender212=window.render || (typeof render==='function'?render:null);
  if(oldRender212 && !oldRender212.__adultStage212){
    window.render=function(){
      try{refreshSprites212()}catch(e){}
      const r=oldRender212.apply(this,arguments);
      setTimeout(post212,0);
      return r;
    };
    window.render.__adultStage212=true;
    try{render=window.render}catch(e){}
  }

  const oldShowModal212=window.showModal || (typeof showModal==='function'?showModal:null);
  if(oldShowModal212 && !oldShowModal212.__adultStage212){
    window.showModal=function(html){
      try{refreshSprites212()}catch(e){}
      const r=oldShowModal212.call(this,html);
      setTimeout(post212,0);
      return r;
    };
    window.showModal.__adultStage212=true;
    try{showModal=window.showModal}catch(e){}
  }

  const oldSafeSave212=window.safeSave || (typeof safeSave==='function'?safeSave:null);
  if(oldSafeSave212 && !oldSafeSave212.__adultStage212){
    window.safeSave=function(){
      try{refreshSprites212()}catch(e){}
      return oldSafeSave212.apply(this,arguments);
    };
    window.safeSave.__adultStage212=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  window.spriteRoleDebug212=function(){
    const m=state?.mother, f=state?.father, p=player212();
    showModal(`<div class="modalTop"><div class="avatar">${img212(p,'md','player')}</div><div class="modalTitle">Sprite role debug</div></div><div class="modalBody"><div class="card">
      <b>Player</b><br>${img212(p,'xl','player')}<br>${key212(p,'player')}<br>
      <b>Moeder</b><br>${m?img212(m,'xl','mother'):'geen'}<br>${m?key212(m,'mother'):'geen'}<br>
      <b>Vader</b><br>${f?img212(f,'xl','father'):'geen'}<br>${f?key212(f,'father'):'geen'}<br>
      <span class="mini">Ouders/teachers/coaches worden altijd adult sprites.</span>
    </div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{try{refreshSprites212(); if(typeof safeSave==='function')safeSave(); if(typeof render==='function')render(); post212();}catch(e){}},350);
  setTimeout(post212,1200);
})();
