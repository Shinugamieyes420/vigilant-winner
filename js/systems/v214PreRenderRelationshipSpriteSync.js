
/* v21.4 Pre-Render Relationship Sprite Sync
   Fix: relationship rows briefly showed wrong/old sprites before delayed cleanup corrected them.
   This patch fixes sprites BEFORE relationshipsHTML/familySocialHub HTML is generated.
*/
(function(){
  const BASE214='assets/avatar_sprites/';

  function norm214(p){
    if(!p || typeof p!=='object')return p;
    try{ if(typeof ensureAppearance199==='function')ensureAppearance199(p); }catch(e){}
    p.appearance=p.appearance||{};
    if(typeof p.appearance.skinTone!=='number')p.appearance.skinTone=25;
    if(!p.appearance.hairColor)p.appearance.hairColor='brown';
    return p;
  }
  function g214(p){
    return String((p&&p.gender)||'male').toLowerCase()==='female'?'female':'male';
  }
  function h214(p){
    const h=String((p&&p.appearance&&p.appearance.hairColor)||'brown');
    return h==='blond'||h==='black'?h:'brown';
  }
  function s214(p){
    const t=(p&&p.appearance&&typeof p.appearance.skinTone==='number')?p.appearance.skinTone:25;
    return t>=55?'dark':'light';
  }
  function stage214(p,ctx=''){
    ctx=String(ctx||'').toLowerCase();
    if(ctx.includes('mother')||ctx.includes('father')||ctx.includes('parent'))return 'adult';
    try{ if(p && state && (p===state.mother || p===state.father))return 'adult'; }catch(e){}
    const role=String((p&&p.role)||'').toLowerCase();
    if(/moeder|vader|ouder|parent|docent|teacher|coach|manager|baas|boss/.test(role))return 'adult';
    let age=Number(p&&p.age);
    if(!Number.isFinite(age))return 'adult';
    if(age<=3)return 'baby';
    if(age<=12)return 'child';
    if(age<=17)return 'teen';
    return 'adult';
  }
  function key214(p,ctx=''){
    p=norm214(p||{});
    const core=`${g214(p)}_${s214(p)}_${h214(p)}`;
    const st=stage214(p,ctx);
    return st==='adult'?core:`${st}_${core}`;
  }
  function img214(p,size='md',ctx=''){
    const k=key214(p,ctx);
    return `<img class="headSprite206 sprite211 sprite212 sprite213 sprite214 ${size}" src="${BASE214}${k}.png" alt="${k}" data-sprite-key="${k}">`;
  }
  window.spriteKey214=key214;
  window.spriteHTML214=img214;

  function preSync214(){
    if(!state)return;
    try{ if(typeof applyAppearanceToPeople199==='function')applyAppearanceToPeople199(); }catch(e){}
    if(state.mother){
      norm214(state.mother);
      state.mother.gender='female';
      state.mother.icon=img214(state.mother,'md','mother');
      state.mother.avatarSpriteKey214=key214(state.mother,'mother');
    }
    if(state.father){
      norm214(state.father);
      state.father.gender='male';
      state.father.icon=img214(state.father,'md','father');
      state.father.avatarSpriteKey214=key214(state.father,'father');
    }
    (state.children||[]).forEach((c,i)=>{
      norm214(c);
      c.icon=img214(c,'md',`children[${i}]`);
      c.avatarSpriteKey214=key214(c,`children[${i}]`);
    });
    (state.siblings||[]).forEach((s,i)=>{
      norm214(s);
      s.icon=img214(s,'md',`siblings[${i}]`);
      s.avatarSpriteKey214=key214(s,`siblings[${i}]`);
    });
    (state.friends||[]).forEach((f,i)=>{
      norm214(f);
      f.icon=img214(f,'md',`friends[${i}]`);
      f.avatarSpriteKey214=key214(f,`friends[${i}]`);
    });
    if(state.appearance){
      const player={name:state.name,gender:state.gender,age:state.age,appearance:state.appearance};
      state.icon=img214(player,'md','player');
    }
  }
  window.preSyncRelationshipSprites214=preSync214;

  function replaceRowIconByOnclick214(html,needle,person,ctx){
    if(!person)return html;
    const icon=img214(person,'md',ctx).replace(/\$/g,'$$$$');
    // Replace first rIco content within row whose onclick contains the needle.
    const esc=needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const re=new RegExp(`(<div class="row[^"]*" onclick="[^"]*${esc}[^"]*"[^>]*>\\s*<div class="rIco">)([\\s\\S]*?)(<\\/div>)`,'g');
    return String(html).replace(re, `$1${icon}$3`);
  }

  function fixRelationshipHTMLString214(html){
    preSync214();
    let h=String(html||'');
    h=replaceRowIconByOnclick214(h, "parentScreen('mother')", state.mother, 'mother');
    h=replaceRowIconByOnclick214(h, 'parentScreen("mother")', state.mother, 'mother');
    h=replaceRowIconByOnclick214(h, "parentScreen('father')", state.father, 'father');
    h=replaceRowIconByOnclick214(h, 'parentScreen("father")', state.father, 'father');
    (state.children||[]).forEach((p,i)=>{ h=replaceRowIconByOnclick214(h, `childScreen(${i})`, p, `children[${i}]`); });
    (state.siblings||[]).forEach((p,i)=>{ h=replaceRowIconByOnclick214(h, `siblingScreen(${i})`, p, `siblings[${i}]`); });
    return h;
  }

  // Override all sprite renderers once more, role-aware and pre-render safe.
  window.renderPersonEmoji199=function(p){return img214(p||{},'md')};
  window.renderPersonAvatar199=function(p,size='xl'){return img214(p||{},size==='big'?'xl':size)};
  window.avatarHTML199=window.renderPersonAvatar199;
  window.spriteHTML208=function(p,size='md',g=null,age=null){
    const pp=Object.assign({},p||{});
    if(g)pp.gender=g;
    if(age!=null)pp.age=age;
    return img214(pp,size);
  };
  window.spriteHTML206=window.spriteHTML208;
  window.spriteHTML213=window.spriteHTML208;
  window.humanIcon=function(g,age=18,p=null){
    if(p && typeof p==='object')return img214(Object.assign({},p,{gender:g||p.gender,age:age!=null?age:p.age}),'md');
    return img214({gender:g||'male',age:age||18,appearance:{skinTone:25,hairColor:'brown'}},'md');
  };
  try{humanIcon=window.humanIcon}catch(e){}
  window.avatar=function(){
    if(!state)return img214({gender:'male',age:18,appearance:{skinTone:25,hairColor:'brown'}},'md');
    if(state.dead)return '☠️';
    return img214({name:state.name,gender:state.gender,age:state.age,appearance:state.appearance},'md','player');
  };
  try{avatar=window.avatar}catch(e){}

  // Main fix: wrap relationshipsHTML BEFORE it returns.
  const oldRelationships214 = window.relationshipsHTML || (typeof relationshipsHTML==='function'?relationshipsHTML:null);
  if(oldRelationships214 && !oldRelationships214.__preSprite214){
    window.relationshipsHTML=function(){
      preSync214();
      const html=oldRelationships214.apply(this,arguments);
      return fixRelationshipHTMLString214(html);
    };
    window.relationshipsHTML.__preSprite214=true;
    try{relationshipsHTML=window.relationshipsHTML}catch(e){}
  }

  // Family hub also uses state.mother.icon directly, so pre-sync before opening.
  const oldFamilyHub214 = window.familySocialHub204 || null;
  if(oldFamilyHub214 && !oldFamilyHub214.__preSprite214){
    window.familySocialHub204=function(){
      preSync214();
      return oldFamilyHub214.apply(this,arguments);
    };
    window.familySocialHub204.__preSprite214=true;
  }

  // Pre-sync before render so old HTML builders never see stale icon values.
  const oldRender214 = window.render || (typeof render==='function'?render:null);
  if(oldRender214 && !oldRender214.__preSprite214){
    window.render=function(){
      try{preSync214()}catch(e){}
      return oldRender214.apply(this,arguments);
    };
    window.render.__preSprite214=true;
    try{render=window.render}catch(e){}
  }

  const oldShowModal214 = window.showModal || (typeof showModal==='function'?showModal:null);
  if(oldShowModal214 && !oldShowModal214.__preSprite214){
    window.showModal=function(html){
      try{preSync214()}catch(e){}
      return oldShowModal214.call(this,html);
    };
    window.showModal.__preSprite214=true;
    try{showModal=window.showModal}catch(e){}
  }

  const oldSafeSave214 = window.safeSave || (typeof safeSave==='function'?safeSave:null);
  if(oldSafeSave214 && !oldSafeSave214.__preSprite214){
    window.safeSave=function(){
      try{preSync214()}catch(e){}
      return oldSafeSave214.apply(this,arguments);
    };
    window.safeSave.__preSprite214=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  window.spriteNoFlickerDebug214=function(){
    preSync214();
    showModal(`<div class="modalTop"><div class="avatar">${avatar()}</div><div class="modalTitle">No-flicker sprite debug</div></div><div class="modalBody"><div class="card">
      <b>Moeder pre-render</b><br>${state.mother?img214(state.mother,'xl','mother'):'geen'}<br>${state.mother?key214(state.mother,'mother'):''}<br>
      <b>Vader pre-render</b><br>${state.father?img214(state.father,'xl','father'):'geen'}<br>${state.father?key214(state.father,'father'):''}<br>
      <span class="mini">Deze sprites worden nu gezet vóór relationshipsHTML wordt gemaakt.</span>
    </div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{try{preSync214(); if(typeof safeSave==='function')safeSave(); if(typeof render==='function')render();}catch(e){}},250);
})();
