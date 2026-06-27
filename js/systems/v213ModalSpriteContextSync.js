
/* v21.3 Modal Sprite Context Sync
   Fix: relationship rows could show the right parent sprite, while the modal/profile card showed a different sprite.
   This patch tracks the clicked person and forces top icon + large appearance sprite to the same person/context.
*/
(function(){
  const BASE213='assets/avatar_sprites/';
  let currentPerson213=null;
  let currentContext213='';

  function clean213(s){
    return String(s||'')
      .replace(/<[^>]*>/g,' ')
      .replace(/[^\p{L}\p{N}' -]/gu,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function normalize213(p){
    if(!p || typeof p!=='object')return p;
    try{ if(typeof ensureAppearance199==='function')ensureAppearance199(p); }catch(e){}
    p.appearance=p.appearance||{};
    if(typeof p.appearance.skinTone!=='number')p.appearance.skinTone=25;
    if(!p.appearance.hairColor)p.appearance.hairColor='brown';
    return p;
  }
  function gender213(p,g){
    let x=String(g || (p&&p.gender) || 'male').toLowerCase();
    return x==='female'?'female':'male';
  }
  function hair213(p){
    let h=String((p&&p.appearance&&p.appearance.hairColor)||'brown');
    return h==='blond'||h==='black'?h:'brown';
  }
  function skin213(p){
    const t=(p&&p.appearance&&typeof p.appearance.skinTone==='number')?p.appearance.skinTone:25;
    return t>=55?'dark':'light';
  }
  function adultRole213(p,ctx=''){
    ctx=String(ctx||'').toLowerCase();
    if(ctx.includes('mother')||ctx.includes('father')||ctx.includes('parent'))return true;
    try{
      if(p && state && (p===state.mother || p===state.father))return true;
      if(p?.name && state && (p.name===state.mother?.name || p.name===state.father?.name))return true;
    }catch(e){}
    const role=String((p&&p.role)||'').toLowerCase();
    return /moeder|vader|ouder|parent|teacher|docent|juf|meester|coach|manager|boss|baas/.test(role);
  }
  function stage213(p,ctx=''){
    if(adultRole213(p,ctx))return 'adult';
    let age=Number(p&&p.age);
    if(!Number.isFinite(age)){
      try{if(p?.name===state?.name)age=Number(state.age||0)}catch(e){}
      if(!Number.isFinite(age))return 'adult';
    }
    if(age<=3)return 'baby';
    if(age<=12)return 'child';
    if(age<=17)return 'teen';
    return 'adult';
  }
  function key213(p,ctx='',g=null,age=null){
    p=normalize213(p||{});
    const pp = age!=null ? Object.assign({},p,{age}) : p;
    const core=`${gender213(pp,g)}_${skin213(pp)}_${hair213(pp)}`;
    const st=stage213(pp,ctx);
    return st==='adult'?core:`${st}_${core}`;
  }
  function img213(p,size='md',ctx='',g=null,age=null){
    const k=key213(p,ctx,g,age);
    return `<img class="headSprite206 sprite211 sprite212 sprite213 ${size}" src="${BASE213}${k}.png" alt="${k}" data-sprite-key="${k}">`;
  }
  window.spriteKey213=key213;
  window.spriteHTML213=img213;

  function allPeople213(){
    const out=[];
    const seen=new Set();
    function visit(x,path){
      if(!x || typeof x!=='object' || seen.has(x))return;
      seen.add(x);
      if(x.name || x.gender || x.appearance || typeof x.age!=='undefined')out.push({p:x,path});
      Object.keys(x).forEach(k=>{
        const v=x[k];
        if(Array.isArray(v))v.forEach((a,i)=>visit(a,`${path}.${k}[${i}]`));
        else if(v && typeof v==='object')visit(v,`${path}.${k}`);
      });
    }
    try{visit(state,'state')}catch(e){}
    return out;
  }
  function findByName213(text){
    text=clean213(text).toLowerCase();
    if(!text)return null;
    const people=allPeople213();
    let hit=people.find(x=>clean213(x.p.name).toLowerCase()===text);
    if(hit)return hit;
    hit=people.find(x=>{
      const n=clean213(x.p.name).toLowerCase();
      return n && text.includes(n);
    });
    return hit||null;
  }
  function modalPerson213(root){
    if(currentPerson213)return {p:currentPerson213,path:currentContext213};
    const title=root?.querySelector('.modalTitle')?.textContent||'';
    let hit=findByName213(title);
    if(hit)return hit;
    const cardTitle=[...root.querySelectorAll('.card b,.rTitle')].map(x=>x.textContent).join(' ');
    hit=findByName213(cardTitle);
    if(hit)return hit;
    return findByName213(root?.textContent||'');
  }

  function setModalSprites213(root=document){
    try{
      const modal=root.querySelector ? (root.querySelector('#modal')||root) : document.getElementById('modal');
      if(!modal)return;
      const hit=modalPerson213(modal);
      if(!hit || !hit.p)return;
      const p=normalize213(hit.p);
      const ctx=hit.path||currentContext213||'profile';

      // Only profile/person modals: must actually mention the person.
      const text=(modal.textContent||'').toLowerCase();
      const personName=String(p.name||'').toLowerCase();
      if(personName && !text.includes(personName))return;

      // Modal top avatar and any sprite inside title should match this person.
      const topAvatar=modal.querySelector('.modalTop .avatar');
      if(topAvatar)topAvatar.innerHTML=img213(p,'md',ctx);
      modal.querySelectorAll('.modalTitle img.headSprite206').forEach(im=>{
        const span=document.createElement('span');
        span.innerHTML=img213(p,'md',ctx);
        im.replaceWith(span.firstElementChild);
      });

      // Replace old CSS avatar.
      modal.querySelectorAll('.ava199').forEach(el=>{
        const span=document.createElement('span');
        span.innerHTML=img213(p,'xl',ctx);
        el.replaceWith(span.firstElementChild);
      });

      // Replace wrong large sprite in appearance/profile cards.
      const appearanceCards=[...modal.querySelectorAll('.card')].filter(card=>{
        const t=(card.textContent||'').toLowerCase();
        return t.includes('uiterlijk') || t.includes('huid') || t.includes('haar') || t.includes('ogen');
      });
      appearanceCards.forEach(card=>{
        const existing=card.querySelector('img.headSprite206');
        const span=document.createElement('span');
        span.innerHTML=img213(p,'xl',ctx);
        if(existing) existing.replaceWith(span.firstElementChild);
        else card.insertBefore(span.firstElementChild, card.firstChild);
      });

      // Update cached icon on the actual person too.
      p.icon=img213(p,'md',ctx);
      p.avatarSpriteKey213=key213(p,ctx);
    }catch(e){console.warn('[v21.3 modal sprite]',e)}
  }

  function setRow213(root,needle,p,ctx){
    if(!root || !p)return;
    root.querySelectorAll('.row').forEach(row=>{
      const oc=row.getAttribute('onclick')||'';
      if(oc.includes(needle)){
        const ico=row.querySelector('.rIco');
        if(ico)ico.innerHTML=img213(p,'md',ctx);
      }
    });
  }
  function fixRows213(root=document){
    try{
      if(!state)return;
      setRow213(root,"parentScreen('mother')",state.mother,'mother');
      setRow213(root,'parentScreen("mother")',state.mother,'mother');
      setRow213(root,"parentScreen('father')",state.father,'father');
      setRow213(root,'parentScreen("father")',state.father,'father');
      (state.children||[]).forEach((c,i)=>setRow213(root,`childScreen(${i})`,c,`children[${i}]`));
      (state.siblings||[]).forEach((s,i)=>setRow213(root,`siblingScreen(${i})`,s,`siblings[${i}]`));
    }catch(e){}
  }

  function refresh213(){
    try{
      if(typeof applyAppearanceToPeople199==='function')applyAppearanceToPeople199();
      allPeople213().forEach(x=>{
        normalize213(x.p);
        x.p.icon=img213(x.p,'md',x.path);
        x.p.avatarSpriteKey213=key213(x.p,x.path);
      });
      if(state){
        const player={name:state.name,gender:state.gender,age:state.age,appearance:state.appearance};
        state.icon=img213(player,'md','player');
      }
    }catch(e){}
  }

  // Override sprite renderers again with context-safe renderer.
  window.spriteHTML208=function(person,size='md',g=null,age=null){return img213(person||{},size,'',g,age)};
  window.spriteHTML206=window.spriteHTML208;
  window.forceSpriteHTML211=window.spriteHTML208;
  window.spriteHTML212=window.spriteHTML208;
  window.renderPersonEmoji199=function(p){return img213(p||{},'md')};
  window.renderPersonAvatar199=function(p,size='xl'){return img213(p||{},size==='big'?'xl':size)};
  window.avatarHTML199=window.renderPersonAvatar199;
  window.humanIcon=function(g,age=18,person=null){
    if(person && typeof person==='object')return img213(person,'md','',g,age);
    return img213({gender:g||'male',age:age||18,appearance:{skinTone:25,hairColor:'brown'}},'md','',g,age);
  };
  try{humanIcon=window.humanIcon}catch(e){}

  function wrapProfile213(name, resolver){
    try{
      const old=window[name] || eval(name);
      if(typeof old!=='function' || old.__modalCtx213)return;
      window[name]=function(){
        try{
          const res=resolver ? resolver.apply(this,arguments) : null;
          currentPerson213=res && res.p ? res.p : null;
          currentContext213=res && res.ctx ? res.ctx : '';
        }catch(e){currentPerson213=null;currentContext213=''}
        const r=old.apply(this,arguments);
        setTimeout(()=>{setModalSprites213(document);fixRows213(document)},0);
        setTimeout(()=>{setModalSprites213(document);fixRows213(document)},120);
        return r;
      };
      window[name].__modalCtx213=true;
      try{eval(name+'=window["'+name+'"]')}catch(e){}
    }catch(e){}
  }

  wrapProfile213('parentScreen', function(who){
    return {p:state && state[who],ctx:who==='mother'?'mother':'father'};
  });
  wrapProfile213('childScreen', function(i){
    return {p:state && state.children && state.children[i],ctx:`children[${i}]`};
  });
  wrapProfile213('siblingScreen', function(i){
    return {p:state && state.siblings && state.siblings[i],ctx:`siblings[${i}]`};
  });
  wrapProfile213('friendScreen', function(i){
    return {p:state && state.friends && state.friends[i],ctx:`friends[${i}]`};
  });
  wrapProfile213('classmateScreen', function(i){
    return {p:state && state.school && state.school.classmates && state.school.classmates[i],ctx:`school.classmates[${i}]`};
  });

  const oldShowModal213=window.showModal || (typeof showModal==='function'?showModal:null);
  if(oldShowModal213 && !oldShowModal213.__modalCtx213){
    window.showModal=function(html){
      try{refresh213()}catch(e){}
      const r=oldShowModal213.call(this,html);
      setTimeout(()=>{setModalSprites213(document);fixRows213(document)},0);
      setTimeout(()=>{setModalSprites213(document);fixRows213(document)},120);
      return r;
    };
    window.showModal.__modalCtx213=true;
    try{showModal=window.showModal}catch(e){}
  }

  const oldRender213=window.render || (typeof render==='function'?render:null);
  if(oldRender213 && !oldRender213.__modalCtx213){
    window.render=function(){
      try{refresh213()}catch(e){}
      const r=oldRender213.apply(this,arguments);
      setTimeout(()=>{fixRows213(document);setModalSprites213(document)},0);
      return r;
    };
    window.render.__modalCtx213=true;
    try{render=window.render}catch(e){}
  }

  const oldSafeSave213=window.safeSave || (typeof safeSave==='function'?safeSave:null);
  if(oldSafeSave213 && !oldSafeSave213.__modalCtx213){
    window.safeSave=function(){
      try{refresh213()}catch(e){}
      return oldSafeSave213.apply(this,arguments);
    };
    window.safeSave.__modalCtx213=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  window.spriteModalDebug213=function(){
    const hit=modalPerson213(document.getElementById('modal')||document);
    showModal(`<div class="modalTop"><div class="avatar">🧩</div><div class="modalTitle">Modal sprite debug</div></div><div class="modalBody"><div class="card"><b>Huidige modal persoon</b><br>${hit&&hit.p?hit.p.name:'niet gevonden'}<br>${hit&&hit.p?img213(hit.p,'xl',hit.path):''}<br>${hit&&hit.p?key213(hit.p,hit.path):''}</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{try{refresh213();fixRows213(document);setModalSprites213(document);if(typeof safeSave==='function')safeSave();if(typeof render==='function')render()}catch(e){}},400);
})();
