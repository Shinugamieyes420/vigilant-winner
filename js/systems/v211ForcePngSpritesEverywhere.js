
/* v21.1 Force PNG Sprites Everywhere
   Fix: old saves/UI still showed stored emoji icons like 👶 instead of actual PNG sprites.
   This patch hard-renders PNG sprite <img> in topbar, bottom tabs, rows, modals and state icons.
*/
(function(){
  const BASE211='assets/avatar_sprites/';
  const CORES211=[
    'male_light_blond','male_light_brown','male_light_black',
    'female_light_blond','female_light_brown','female_light_black',
    'male_dark_blond','male_dark_brown','male_dark_black',
    'female_dark_blond','female_dark_brown','female_dark_black'
  ];

  function ageStage211(age){
    age=Number(age||0);
    if(age<=3)return 'baby';
    if(age<=12)return 'child';
    if(age<=17)return 'teen';
    return 'adult';
  }
  function gender211(p,g){
    let x=(g || (p&&p.gender) || 'male')+'';
    return x.toLowerCase()==='female'?'female':'male';
  }
  function hair211(p){
    let h=(p&&p.appearance&&p.appearance.hairColor)||'brown';
    h=String(h);
    if(h==='blond'||h==='black')return h;
    return 'brown';
  }
  function skin211(p){
    let t=(p&&p.appearance&&typeof p.appearance.skinTone==='number') ? p.appearance.skinTone : 25;
    return t>=55?'dark':'light';
  }
  function key211(p,g,age){
    const core=`${gender211(p,g)}_${skin211(p)}_${hair211(p)}`;
    const stage=ageStage211(age!=null?age:(p&&p.age));
    return stage==='adult'?core:`${stage}_${core}`;
  }
  function img211(p,size='md',g=null,age=null){
    const k=key211(p,g,age);
    return `<img class="headSprite206 sprite211 ${size}" src="${BASE211}${k}.png" alt="${k}" data-sprite-key="${k}">`;
  }
  window.forceSpriteKey211=key211;
  window.forceSpriteHTML211=img211;

  function normalizeAppearance211(p){
    if(!p || typeof p!=='object')return p;
    try{ if(typeof ensureAppearance199==='function')ensureAppearance199(p); }catch(e){}
    p.appearance=p.appearance||{};
    if(typeof p.appearance.skinTone!=='number')p.appearance.skinTone=25;
    if(!p.appearance.hairColor)p.appearance.hairColor='brown';
    return p;
  }

  function playerPerson211(){
    return normalizeAppearance211({
      name: state&&state.name,
      gender: state&&state.gender,
      age: state&&state.age,
      appearance: state&&state.appearance
    });
  }

  function walkPeople211(root,fn){
    if(!root || typeof root!=='object')return;
    const seen=new Set();
    function visit(x){
      if(!x || typeof x!=='object' || seen.has(x))return;
      seen.add(x);
      if(x.name || x.gender || x.appearance || typeof x.age!=='undefined')fn(x);
      Object.keys(x).forEach(k=>{
        const v=x[k];
        if(Array.isArray(v))v.forEach(visit);
        else if(v && typeof v==='object')visit(v);
      });
    }
    visit(root);
  }

  window.refreshSprites211=function(){
    if(!state)return;
    try{ if(typeof applyAppearanceToPeople199==='function')applyAppearanceToPeople199(); }catch(e){}
    walkPeople211(state,p=>{
      normalizeAppearance211(p);
      // hard overwrite old emoji strings saved in state
      p.icon=img211(p,'md');
      p.avatarSpriteKey211=key211(p);
    });
    state.icon=img211(playerPerson211(),'md',state.gender,state.age);
    state.avatarSpriteKey211=key211(playerPerson211(),state.gender,state.age);
  };

  // Hard override all icon renderers.
  window.spriteHTML208=function(person,size='md',g=null,age=null){return img211(normalizeAppearance211(person||{}),size,g,age)};
  window.spriteHTML206=window.spriteHTML208;
  window.renderPersonEmoji199=function(p){return img211(normalizeAppearance211(p||{}),'md')};
  window.renderPersonAvatar199=function(p,size='xl'){return img211(normalizeAppearance211(p||{}),size==='big'?'xl':size)};
  window.avatarHTML199=window.renderPersonAvatar199;
  window.humanIcon=function(g,age=18,person=null){
    if(person && typeof person==='object')return img211(normalizeAppearance211(person),'md',g,age);
    return img211({gender:g||'male',age:age||18,appearance:{skinTone:25,hairColor:'brown'}},'md',g,age);
  };
  try{humanIcon=window.humanIcon}catch(e){}

  // Patch avatar() too: app topbar often uses avatar() not humanIcon directly.
  window.avatar=function(){
    if(!state)return img211({gender:'male',age:18,appearance:{skinTone:25,hairColor:'brown'}},'md');
    if(state.dead)return '☠️';
    return img211(playerPerson211(),'md',state.gender,state.age);
  };
  try{avatar=window.avatar}catch(e){}

  // Patch classmate avatar.
  window.classmateAvatar=function(g,p){
    if(p && typeof p==='object')return img211(normalizeAppearance211(p),'md');
    return img211({gender:g||'male',age:(state&&state.age)||8,appearance:{skinTone:25,hairColor:'brown'}},'md',g,(state&&state.age)||8);
  };
  try{classmateAvatar=window.classmateAvatar}catch(e){}

  function replaceEmojiInAvatarBoxes211(root){
    if(!root)return;
    // Replace topbar/main avatar if it contains emoji/text, but don't touch pet icons.
    const candidates=[...root.querySelectorAll('.avatar,.rIco')];
    candidates.forEach(el=>{
      if(el.querySelector('img.headSprite206'))return;
      const text=(el.textContent||'').trim();
      // human-looking old emoji/fallbacks only
      if(/[👶🧒👦👧👨👩👵👴]/u.test(text)){
        el.innerHTML=img211(playerPerson211(),'md');
      }
    });
  }

  function replaceOldCssAvatar211(root){
    if(!root)return;
    [...root.querySelectorAll('.ava199')].forEach(el=>{
      let person=playerPerson211();
      const card=el.closest('.card,.modalBody');
      if(card){
        const txt=(card.textContent||'').toLowerCase();
        const people=[];
        try{walkPeople211(state,p=>people.push(p))}catch(e){}
        const found=people.find(p=>p.name && txt.includes(String(p.name).toLowerCase()));
        if(found)person=found;
      }
      const span=document.createElement('span');
      span.innerHTML=img211(normalizeAppearance211(person),'xl');
      el.replaceWith(span.firstElementChild);
    });
  }

  function postProcessDOM211(){
    try{
      refreshSprites211();
      replaceOldCssAvatar211(document.body);
      replaceEmojiInAvatarBoxes211(document.body);
      // Fix bottom tab baby label icon specifically if it is old emoji.
      [...document.querySelectorAll('.tab,.bottomNav .row,.navItem')].forEach(el=>{
        if((el.textContent||'').includes('Baby') && !el.querySelector('img.headSprite206')){
          const first=el.querySelector('.rIco,.avatar,span,div') || el;
          first.innerHTML=img211(playerPerson211(),'md') + (first===el ? ' Baby' : '');
        }
      });
    }catch(e){}
  }

  const oldShowModal211=window.showModal || (typeof showModal==='function'?showModal:null);
  if(oldShowModal211 && !oldShowModal211.__forcePng211){
    window.showModal=function(html){
      try{refreshSprites211()}catch(e){}
      let fixed=html;
      try{
        // HTML string fix: replace any old ava199 blocks after render too.
        fixed=String(fixed).replace(/<div class="ava199[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g, img211(playerPerson211(),'xl'));
      }catch(e){}
      const res=oldShowModal211.call(this,fixed);
      setTimeout(postProcessDOM211,0);
      return res;
    };
    window.showModal.__forcePng211=true;
    try{showModal=window.showModal}catch(e){}
  }

  const oldRender211=window.render || (typeof render==='function'?render:null);
  if(oldRender211 && !oldRender211.__forcePng211){
    window.render=function(){
      try{refreshSprites211()}catch(e){}
      const r=oldRender211.apply(this,arguments);
      setTimeout(postProcessDOM211,0);
      return r;
    };
    window.render.__forcePng211=true;
    try{render=window.render}catch(e){}
  }

  const oldSafeSave211=window.safeSave || (typeof safeSave==='function'?safeSave:null);
  if(oldSafeSave211 && !oldSafeSave211.__forcePng211){
    window.safeSave=function(){
      try{refreshSprites211()}catch(e){}
      return oldSafeSave211.apply(this,arguments);
    };
    window.safeSave.__forcePng211=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  window.spriteTest211=function(){
    const p=playerPerson211();
    const k=key211(p,state.gender,state.age);
    showModal(`<div class="modalTop"><div class="avatar">${img211(p,'md')}</div><div class="modalTitle">Sprite test</div></div><div class="modalBody"><div class="card">${img211(p,'xl')}<b>Huidige sprite</b><br>Key: ${k}<br>Pad: assets/avatar_sprites/${k}.png<br><br>Als je dit ziet als plaatje, gebruikt de game nu echt PNG sprites.</div><button class="btn" onclick="avatarAgeSpriteLibrary209 ? avatarAgeSpriteLibrary209() : closeModal()">Bekijk library</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  // Also expose a repair button via console/function.
  window.forceRepairSpriteSave211=function(){
    try{refreshSprites211(); if(typeof safeSave==='function')safeSave(); if(typeof render==='function')render(); postProcessDOM211();}catch(e){}
  };

  setTimeout(()=>{try{forceRepairSpriteSave211()}catch(e){}},250);
  setTimeout(()=>{try{postProcessDOM211()}catch(e){}},1000);
})();
