
/* v21.0 Replace Old CSS Avatars With Real Sprites
   Fix: old v19.9 ava199 CSS avatars were still shown in profile/detail cards.
   This patch converts those old CSS avatars into the real PNG head sprites from assets/avatar_sprites.
*/
(function(){
  function strip210(s){
    return String(s||'')
      .replace(/\s+/g,' ')
      .replace(/[^\p{L}\p{N}' -]/gu,'')
      .trim();
  }

  function allPeople210(){
    const out=[];
    const seen=new Set();
    function visit(x,path){
      if(!x || typeof x!=='object' || seen.has(x)) return;
      seen.add(x);
      if(x.name && (x.gender || x.appearance || typeof x.age!=='undefined')){
        out.push(x);
      }
      Object.keys(x).forEach(k=>{
        const v=x[k];
        if(Array.isArray(v)) v.forEach((a,i)=>visit(a,path+'.'+k+'['+i+']'));
        else if(v && typeof v==='object') visit(v,path+'.'+k);
      });
    }
    try{ visit(state,'state'); }catch(e){}
    return out;
  }

  function findPersonByName210(nameOrText){
    const text=strip210(nameOrText).toLowerCase();
    if(!text) return null;
    const people=allPeople210();

    // exact / contained match
    let found=people.find(p=>strip210(p.name).toLowerCase()===text);
    if(found) return found;
    found=people.find(p=>{
      const n=strip210(p.name).toLowerCase();
      return n && (text.includes(n) || n.includes(text));
    });
    if(found) return found;

    // try name parts from modal title/body
    const words=text.split(' ').filter(w=>w.length>=2);
    for(let i=0;i<words.length;i++){
      for(let j=i+1;j<=Math.min(words.length,i+4);j++){
        const chunk=words.slice(i,j).join(' ');
        found=people.find(p=>strip210(p.name).toLowerCase()===chunk);
        if(found) return found;
      }
    }
    return null;
  }

  function fallbackPersonFromOldClass210(el){
    // Derive a fallback person from classes like: ava199 skin-mediumDark hair-blond female teen
    const cls = String(el && el.className || '');
    const female = /\bfemale\b/.test(cls);
    let skinTone = 25;
    if(/\bskin-dark\b/.test(cls)) skinTone=85;
    else if(/\bskin-mediumDark\b/.test(cls)) skinTone=70;
    else if(/\bskin-medium\b/.test(cls)) skinTone=52;
    else if(/\bskin-lightMedium\b/.test(cls)) skinTone=35;
    else skinTone=20;

    let hairColor='brown';
    const m=cls.match(/\bhair-([A-Za-z0-9_-]+)/);
    if(m) hairColor=m[1];

    let age=22;
    if(/\bbaby\b/.test(cls)) age=1;
    else if(/\bchild\b/.test(cls)) age=8;
    else if(/\bteen\b/.test(cls)) age=15;
    else if(/\belder\b/.test(cls)) age=68;

    return {name:'avatar', gender:female?'female':'male', age, appearance:{skinTone,hairColor}};
  }

  function spriteHTML210(person,size='xl'){
    try{
      if(typeof ensureAppearance199==='function') ensureAppearance199(person);
    }catch(e){}
    try{
      if(typeof spriteHTML208==='function') return spriteHTML208(person,size,person&&person.gender,person&&person.age);
    }catch(e){}
    try{
      if(typeof spriteHTML206==='function') return spriteHTML206(person,size,person&&person.gender);
    }catch(e){}
    const g=(person&&person.gender)==='female'?'female':'male';
    const tone=person&&person.appearance&&typeof person.appearance.skinTone==='number'?person.appearance.skinTone:25;
    const skin=tone>=55?'dark':'light';
    const hc=String(person&&person.appearance&&person.appearance.hairColor||'brown');
    const hair=hc==='blond'||hc==='black'?hc:'brown';
    const age=Number(person&&person.age||18);
    let stage='adult';
    if(age<=3)stage='baby';
    else if(age<=12)stage='child';
    else if(age<=17)stage='teen';
    const key=(stage==='adult'?'':stage+'_')+`${g}_${skin}_${hair}`;
    return `<img class="headSprite206 ${size}" src="assets/avatar_sprites/${key}.png" alt="${key}">`;
  }

  function modalPerson210(root){
    try{
      const title=root.querySelector('.modalTitle')?.textContent || '';
      let p=findPersonByName210(title);
      if(p) return p;
      const btxt=[...root.querySelectorAll('.card b,.rTitle')].map(x=>x.textContent).join(' ');
      p=findPersonByName210(btxt);
      if(p) return p;
      const all=root.textContent || '';
      return findPersonByName210(all);
    }catch(e){return null}
  }

  function replaceInRoot210(root){
    if(!root) return;
    const old=[...root.querySelectorAll('.ava199')];
    if(!old.length) return;
    let p=modalPerson210(root);
    old.forEach(el=>{
      const person=p || fallbackPersonFromOldClass210(el);
      const wrap=document.createElement('span');
      wrap.innerHTML=spriteHTML210(person,'xl');
      const img=wrap.firstElementChild;
      if(img) el.replaceWith(img);
    });
  }

  function transformHTML210(html){
    try{
      if(!String(html).includes('ava199')) return html;
      const tmp=document.createElement('div');
      tmp.innerHTML=html;
      replaceInRoot210(tmp);
      return tmp.innerHTML;
    }catch(e){
      return html;
    }
  }

  // Override old avatar renderers.
  window.renderPersonAvatar199=function(p,size='big'){
    return spriteHTML210(p,size==='big'?'xl':size);
  };
  window.avatarHTML199=window.renderPersonAvatar199;

  // Make row/profile icons use real sprites too.
  window.renderPersonEmoji199=function(p){
    return spriteHTML210(p,'md');
  };

  window.humanIcon=function(g,age=18,person=null){
    if(person && typeof person==='object') return spriteHTML210(person,'md');
    return spriteHTML210({gender:g||'male',age:age||18,appearance:{skinTone:25,hairColor:'brown'}},'md');
  };
  try{humanIcon=window.humanIcon}catch(e){}

  // Wrap showModal so any old injected ava199 block becomes a real PNG sprite.
  const oldShowModal210 = window.showModal || (typeof showModal==='function'?showModal:null);
  if(oldShowModal210 && !oldShowModal210.__replaceSprite210){
    window.showModal=function(html){
      const fixed=transformHTML210(html);
      const res=oldShowModal210.call(this,fixed);
      setTimeout(()=>{try{replaceInRoot210(document.getElementById('modal')||document.body)}catch(e){}},0);
      return res;
    };
    window.showModal.__replaceSprite210=true;
    try{showModal=window.showModal}catch(e){}
  }

  // Patch modal/detail functions defensively after they run.
  function wrapAfter210(name){
    try{
      const old=window[name] || eval(name);
      if(typeof old!=='function' || old.__replaceSprite210) return;
      window[name]=function(){
        const r=old.apply(this,arguments);
        setTimeout(()=>{try{replaceInRoot210(document.getElementById('modal')||document.body)}catch(e){}},0);
        return r;
      };
      window[name].__replaceSprite210=true;
      try{eval(name+'=window["'+name+'"]')}catch(e){}
    }catch(e){}
  }
  [
    'parentScreen','childScreen','siblingScreen','classScreen','classmateScreen',
    'friendScreen','dateProfile','partnerScreen','vacationContactsScreen191',
    'legacyScreen','familySocialHub204','relationshipsScreen'
  ].forEach(wrapAfter210);

  // Refresh persisted icons.
  window.refreshAllAvatarSprites210=function(){
    try{
      const people=allPeople210();
      people.forEach(p=>{
        try{ if(typeof ensureAppearance199==='function') ensureAppearance199(p); }catch(e){}
        p.icon=spriteHTML210(p,'md');
      });
      if(state){
        state.icon=spriteHTML210({name:state.name,gender:state.gender,age:state.age,appearance:state.appearance},'md');
      }
    }catch(e){}
  };

  const oldRender210 = window.render || (typeof render==='function'?render:null);
  if(oldRender210 && !oldRender210.__replaceSprite210){
    window.render=function(){
      try{refreshAllAvatarSprites210()}catch(e){}
      const r=oldRender210.apply(this,arguments);
      setTimeout(()=>{try{replaceInRoot210(document.body)}catch(e){}},0);
      return r;
    };
    window.render.__replaceSprite210=true;
    try{render=window.render}catch(e){}
  }

  window.avatarSpriteDebug210=function(){
    let p=null;
    try{p=modalPerson210(document.getElementById('modal')||document.body)}catch(e){}
    const people=allPeople210();
    showModal(`<div class="modalTop"><div class="avatar">🧩</div><div class="modalTitle">Sprite debug</div></div><div class="modalBody"><div class="card"><b>Real sprite renderer actief</b><br>Personen gevonden: ${people.length}<br>Huidige modalpersoon: ${p?p.name:'niet gevonden'}<br>Oude CSS avatars worden automatisch vervangen.</div><button class="btn" onclick="avatarAgeSpriteLibrary209 ? avatarAgeSpriteLibrary209() : closeModal()">Bekijk sprite library</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{
    try{
      refreshAllAvatarSprites210();
      if(typeof safeSave==='function') safeSave();
      if(typeof render==='function') render();
      replaceInRoot210(document.body);
    }catch(e){}
  },500);
})();
