
/* v21.8 Stability Debug Runtime Fix
   Full fix for v21.7 freeze:
   - removes recursion between genetics sync and sprite refresh
   - guarded render/save wrappers
   - safe one-shot genetics + sprite refresh
   - keeps barber/family genetics without blocking clicks
*/
(function(){
  let syncing218 = false;
  let rendering218 = false;
  let saving218 = false;

  function log218(){ try{ console.log.apply(console, ['[v21.8]'].concat([].slice.call(arguments))); }catch(e){} }

  function guarded218(fn, fallback){
    try{ return typeof fn === 'function' ? fn() : fallback; }catch(e){ console.warn('[v21.8 guarded]', e); return fallback; }
  }

  function normHair218(c){
    c=String(c||'brown');
    if(c==='blond'||c==='black'||c==='brown') return c;
    if(c==='darkBrown'||c==='red') return 'brown';
    if(c==='gray'||c==='white') return 'blond';
    return 'brown';
  }
  function clamp218(v,min=0,max=100){ return Math.max(min, Math.min(max, Math.round(v||0))); }
  function skinGroup218(t){ return clamp218(t)>=55 ? 'dark' : 'light'; }
  function stage218(p){
    const a = Number((p && p.age) ?? (p && p._age) ?? 18);
    if(a<=3) return 'baby';
    if(a<=12) return 'child';
    if(a<=17) return 'teen';
    return 'adult';
  }
  function isAdultRole218(p, ctx=''){
    ctx=String(ctx||'').toLowerCase();
    if(ctx.includes('mother')||ctx.includes('father')||ctx.includes('parent')) return true;
    try{ if(p && state && (p===state.mother || p===state.father)) return true; }catch(e){}
    const role=String((p&&p.role)||'').toLowerCase();
    return /moeder|vader|ouder|parent|docent|teacher|coach|manager|baas|boss/.test(role);
  }
  function ensureApp218(p){
    if(!p || typeof p!=='object') return {skinTone:25,hairColor:'brown',naturalHairColor:'brown',eyeColor:'brown'};
    p.appearance = p.appearance || {};
    const a=p.appearance;
    if(typeof a.skinTone !== 'number') a.skinTone = 25;
    a.skinTone = clamp218(a.skinTone);
    a.skinLabel = (typeof skinLabel199==='function') ? skinLabel199(a.skinTone) : (a.skinTone>=55?'donkere huid':'lichte huid');
    a.hairColor = normHair218(a.hairColor || a.naturalHairColor || 'brown');
    a.naturalHairColor = normHair218(a.naturalHairColor || a.hairColor || 'brown');
    a.eyeColor = a.eyeColor || 'brown';
    a.hairStyle = 'default';
    a.spriteStyle = 'default';
    a.spriteSkinGroup = skinGroup218(a.skinTone);
    a.lockedSkin = true;
    return a;
  }
  function spriteKey218(p, ctx=''){
    p = p || {};
    const a=ensureApp218(p);
    const gender = String(p.gender || 'male').toLowerCase()==='female' ? 'female' : 'male';
    const skin = skinGroup218(a.skinTone);
    const hair = normHair218(a.hairColor);
    const st = isAdultRole218(p,ctx) ? 'adult' : stage218(p);
    const core = `${gender}_${skin}_${hair}`;
    return st === 'adult' ? core : `${st}_${core}`;
  }
  function sprite218(p, size='md', ctx=''){
    const key=spriteKey218(p,ctx);
    return `<img class="headSprite206 sprite218 ${size}" src="assets/avatar_sprites/${key}.png" alt="${key}" data-sprite-key="${key}">`;
  }
  window.spriteKey218 = spriteKey218;
  window.spriteHTML218 = sprite218;

  function geneticTone218(a,b){
    const ta=clamp218(a&&a.skinTone!=null?a.skinTone:25);
    const tb=clamp218(b&&b.skinTone!=null?b.skinTone:25);
    const ga=skinGroup218(ta), gb=skinGroup218(tb);
    const base=Math.round((ta+tb)/2);
    if(ga===gb && ga==='light') return clamp218(base, Math.max(6, Math.min(ta,tb)-8), Math.min(46, Math.max(ta,tb)+8));
    if(ga===gb && ga==='dark') return clamp218(base, Math.max(54, Math.min(ta,tb)-8), Math.min(95, Math.max(ta,tb)+8));
    return clamp218(base, Math.max(22, Math.min(ta,tb)-10), Math.min(84, Math.max(ta,tb)+10));
  }
  function pickTrait218(a,b){
    a=normHair218(a); b=normHair218(b);
    if(a===b) return a;
    return Math.random()<0.5?a:b;
  }

  function syncGeneticsCore218(){
    if(!state || syncing218) return;
    syncing218 = true;
    try{
      if(state.mother){ state.mother.gender='female'; ensureApp218(state.mother); }
      if(state.father){ state.father.gender='male'; ensureApp218(state.father); }

      if(state.mother && state.father){
        const ma=ensureApp218(state.mother), fa=ensureApp218(state.father);
        state.appearance = state.appearance || {};
        const currentHair = normHair218(state.appearance.hairColor || state.appearance.naturalHairColor || pickTrait218(ma.hairColor, fa.hairColor));
        const natural = normHair218(state.appearance.naturalHairColor || pickTrait218(ma.naturalHairColor||ma.hairColor, fa.naturalHairColor||fa.hairColor));
        const tone = geneticTone218(ma,fa);
        state.appearance.skinTone = tone;
        state.appearance.skinLabel = (typeof skinLabel199==='function') ? skinLabel199(tone) : (tone>=55?'donkere huid':'lichte huid');
        state.appearance.spriteSkinGroup = skinGroup218(tone);
        state.appearance.naturalHairColor = natural;
        state.appearance.hairColor = currentHair;
        state.appearance.eyeColor = state.appearance.eyeColor || (Math.random()<0.5?(ma.eyeColor||'brown'):(fa.eyeColor||'brown'));
        state.appearance.hairStyle='default';
        state.appearance.spriteStyle='default';
        state.appearance.regionOrigin='genetic';
        state.appearance.lockedSkin=true;
        state.appearance.geneticLocked218=true;
      }else{
        state.appearance = state.appearance || {};
        ensureApp218({appearance:state.appearance, gender:state.gender, age:state.age});
      }

      const player={name:state.name, gender:state.gender, age:state.age, appearance:state.appearance};

      (state.siblings||[]).forEach((s,i)=>{
        if(state.mother && state.father){
          const ma=ensureApp218(state.mother), fa=ensureApp218(state.father);
          s.appearance = s.appearance || {};
          s.appearance.skinTone = geneticTone218(ma,fa);
          s.appearance.naturalHairColor = normHair218(s.appearance.naturalHairColor || pickTrait218(ma.naturalHairColor||ma.hairColor, fa.naturalHairColor||fa.hairColor));
          s.appearance.hairColor = normHair218(s.appearance.hairColor || s.appearance.naturalHairColor);
          s.appearance.eyeColor = s.appearance.eyeColor || (Math.random()<0.5?(ma.eyeColor||'brown'):(fa.eyeColor||'brown'));
        }
        ensureApp218(s);
        s.icon=sprite218(s,'md',`siblings[${i}]`);
      });

      (state.children||[]).forEach((ch,i)=>{
        ensureApp218(ch);
        ch.icon=sprite218(ch,'md',`children[${i}]`);
      });

      if(state.mother) state.mother.icon=sprite218(state.mother,'md','mother');
      if(state.father) state.father.icon=sprite218(state.father,'md','father');
      if(state.partner){ ensureApp218(state.partner); state.partner.icon=sprite218(state.partner,'md','partner'); }
      (state.friends||[]).forEach((f,i)=>{ ensureApp218(f); f.icon=sprite218(f,'md',`friends[${i}]`); });

      state.icon=sprite218(player,'md','player');
    }catch(e){
      console.warn('[v21.8 sync]',e);
    }finally{
      syncing218 = false;
    }
  }
  window.syncGeneticsCore218 = syncGeneticsCore218;

  // Replace recursive public hooks with guarded non-recursive versions.
  window.applyAppearanceToPeople199 = function(){ syncGeneticsCore218(); };
  window.syncFamilyGenetics217 = function(){ syncGeneticsCore218(); };
  window.refreshSprites212 = function(){ syncGeneticsCore218(); };
  window.refreshSprites213 = function(){ syncGeneticsCore218(); };
  window.refreshSprites214 = function(){ syncGeneticsCore218(); };

  window.renderPersonEmoji199 = function(p){ ensureApp218(p||{}); return sprite218(p||{}, 'md'); };
  window.renderPersonAvatar199 = function(p, size='xl'){ ensureApp218(p||{}); return sprite218(p||{}, size==='big'?'xl':size); };
  window.avatarHTML199 = window.renderPersonAvatar199;
  window.humanIcon = function(g, age=18, p=null){
    if(p && typeof p==='object'){ p.gender=p.gender||g; p.age=age!=null?age:p.age; return sprite218(p,'md'); }
    return sprite218({gender:g||'male',age:age||18,appearance:{skinTone:25,hairColor:'brown',naturalHairColor:'brown'}},'md');
  };
  try{ humanIcon = window.humanIcon; }catch(e){}

  window.avatar=function(){
    if(!state)return sprite218({gender:'male',age:18,appearance:{skinTone:25,hairColor:'brown'}},'md');
    if(state.dead)return '☠️';
    return sprite218({name:state.name,gender:state.gender,age:state.age,appearance:state.appearance},'md','player');
  };
  try{ avatar=window.avatar; }catch(e){}

  // Keep barber usable and avoid save/render double loops.
  const oldBarber217 = window.barberShop199;
  if(typeof oldBarber217 === 'function'){
    window.barberShop199=function(){
      syncGeneticsCore218();
      return oldBarber217.apply(this,arguments);
    };
  }

  function patchRows218(root=document){
    try{
      if(!state)return;
      function set(needle,p,ctx){
        if(!p)return;
        root.querySelectorAll('.row').forEach(row=>{
          const oc=row.getAttribute('onclick')||'';
          if(oc.includes(needle)){
            const ico=row.querySelector('.rIco');
            if(ico)ico.innerHTML=sprite218(p,'md',ctx);
          }
        });
      }
      set("parentScreen('mother')",state.mother,'mother');
      set('parentScreen("mother")',state.mother,'mother');
      set("parentScreen('father')",state.father,'father');
      set('parentScreen("father")',state.father,'father');
      (state.children||[]).forEach((c,i)=>set(`childScreen(${i})`,c,`children[${i}]`));
      (state.siblings||[]).forEach((s,i)=>set(`siblingScreen(${i})`,s,`siblings[${i}]`));
    }catch(e){}
  }
  window.patchRows218 = patchRows218;

  function postDOM218(){
    try{
      patchRows218(document);
      // remove any full-screen invisible accidental blockers if left by crashed modals
      const shade=document.getElementById('modalShade');
      const modal=document.getElementById('modal');
      if(shade && shade.classList.contains('show') && modal && !modal.innerHTML.trim()){
        shade.classList.remove('show');
      }
    }catch(e){}
  }

  // Wrap render/save exactly once, with guards.
  const realRender218 = window.render || (typeof render==='function'?render:null);
  if(realRender218 && !realRender218.__stable218){
    window.render=function(){
      if(rendering218) return realRender218.apply(this,arguments);
      rendering218=true;
      try{ syncGeneticsCore218(); }
      catch(e){ console.warn('[v21.8 pre-render]',e); }
      try{ return realRender218.apply(this,arguments); }
      finally{ rendering218=false; setTimeout(postDOM218,0); }
    };
    window.render.__stable218=true;
    try{render=window.render}catch(e){}
  }

  const realSafeSave218 = window.safeSave || (typeof safeSave==='function'?safeSave:null);
  if(realSafeSave218 && !realSafeSave218.__stable218){
    window.safeSave=function(){
      if(saving218) return realSafeSave218.apply(this,arguments);
      saving218=true;
      try{ syncGeneticsCore218(); return realSafeSave218.apply(this,arguments); }
      finally{ saving218=false; }
    };
    window.safeSave.__stable218=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  // Patch showModal only for post DOM, no sync recursion.
  const realShow218 = window.showModal || (typeof showModal==='function'?showModal:null);
  if(realShow218 && !realShow218.__stable218){
    window.showModal=function(html){
      const r=realShow218.call(this,html);
      setTimeout(postDOM218,0);
      return r;
    };
    window.showModal.__stable218=true;
    try{showModal=window.showModal}catch(e){}
  }

  // Runtime self test panel
  window.stabilityDebug218=function(){
    const ok = {
      syncing: syncing218,
      renderExists: typeof window.render==='function',
      saveExists: typeof window.safeSave==='function',
      applyExists: typeof window.applyAppearanceToPeople199==='function',
      modalShade: !!document.getElementById('modalShade'),
      activities: typeof window.activitiesHTML==='function' || typeof activitiesHTML==='function'
    };
    showModal(`<div class="modalTop"><div class="avatar">🛠️</div><div class="modalTitle">Stability debug v21.8</div></div><div class="modalBody"><div class="card"><b>Runtime status</b><br>${Object.entries(ok).map(([k,v])=>`${v?'✅':'❌'} ${k}: ${v}`).join('<br>')}<br><br><b>Fix</b><br>Recursion tussen genetics ↔ sprite refresh is verwijderd. Render/save hebben guards.</div><button class="btn" onclick="openScreen('activities')">Open Activities test</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  // Initial safe run without calling safeSave/render recursively.
  setTimeout(()=>{
    try{ syncGeneticsCore218(); }
    catch(e){ console.warn('[v21.8 init sync]',e); }
    try{ if(realSafeSave218) realSafeSave218(); }catch(e){}
    try{ if(typeof window.render==='function') window.render(); }catch(e){ console.warn('[v21.8 init render]',e); }
  }, 100);
})();
