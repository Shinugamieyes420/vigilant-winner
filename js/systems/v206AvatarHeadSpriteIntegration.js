
/* v20.6 Avatar Head Sprite Integration
   Uses cut avatar head sprites instead of plain emoji for compact icons/rows/cards.
   Current sheet supports 12 combinations:
   male/female × light/dark skin × blond/brown/black hair.
   Structure is ready for more sprites later (e.g. Asian-specific sheet).
*/
(function(){
  const SPRITE_BASE206 = 'assets/avatar_sprites/';
  const FALLBACK206 = 'male_light_brown';
  const HAIR_MAP206 = {
    blond:'blond', yellow:'blond', white:'blond',
    brown:'brown', darkBrown:'brown', red:'brown',
    black:'black', gray:'black', blue:'black', pink:'brown'
  };
  function clamp206(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function hairGroup206(c){ return HAIR_MAP206[c] || 'brown'; }
  function skinGroup206(p){
    const a = p && p.appearance ? p.appearance : null;
    const tone = a && typeof a.skinTone === 'number' ? a.skinTone : 25;
    return tone >= 55 ? 'dark' : 'light';
  }
  function genderGroup206(p,g){
    let gg = g || (p && p.gender) || 'male';
    gg = String(gg).toLowerCase();
    return gg === 'female' ? 'female' : 'male';
  }
  function spriteKey206(person, g){
    const gender = genderGroup206(person,g);
    const skin = skinGroup206(person);
    const hairColor = hairGroup206(person?.appearance?.hairColor || 'brown');
    return `${gender}_${skin}_${hairColor}`;
  }
  function spritePath206(key){ return SPRITE_BASE206 + key + '.png'; }
  function spriteHTML206(person, size='md', g=null){
    const key = spriteKey206(person,g);
    return `<img class="headSprite206 ${size}" src="${spritePath206(key)}" alt="${key}">`;
  }
  window.spriteHTML206 = spriteHTML206;
  window.spriteKey206 = spriteKey206;

  function walkPeople206(root, fn){
    if(!root || typeof root !== 'object') return;
    const seen = new Set();
    function visit(x){
      if(!x || typeof x !== 'object' || seen.has(x)) return;
      seen.add(x);
      if(x.name || x.gender || x.appearance) fn(x);
      Object.keys(x).forEach(k=>{
        const v=x[k];
        if(Array.isArray(v)) v.forEach(visit);
        else if(v && typeof v==='object') visit(v);
      });
    }
    visit(root);
  }
  function refreshSprites206(){
    if(typeof state === 'undefined' || !state) return;
    walkPeople206(state, p=>{
      if(p.appearance){
        p.icon = spriteHTML206(p,'md');
      }
    });
  }
  window.refreshSprites206 = refreshSprites206;

  // Use sprites where the appearance system normally creates compact emoji.
  window.renderPersonEmoji199 = function(p){
    return spriteHTML206(p,'md');
  };

  // Generic fallback icon if called with only gender/age.
  window.humanIcon = function(g, age=18, person=null){
    if(person && typeof person === 'object'){
      return spriteHTML206(person,'md', g);
    }
    return spriteHTML206({gender:g||'male', appearance:{skinTone:25, hairColor:'brown'}},'md',g);
  };
  try{humanIcon = window.humanIcon;}catch(e){}

  // Refresh before every render so barber / genetics / classmates all stay visually synced.
  const oldRender206 = window.render || (typeof render === 'function' ? render : null);
  if(oldRender206 && !oldRender206.__sprite206){
    window.render = function(){
      try{ if(typeof ensureAppearance199==='function') applyAppearanceToPeople199?.(); }catch(e){}
      try{ refreshSprites206(); }catch(e){}
      return oldRender206.apply(this, arguments);
    };
    window.render.__sprite206 = true;
    try{render = window.render;}catch(e){}
  }

  // Make sure fresh game state also gets sprite icons.
  const oldFresh206 = window.fresh || (typeof fresh === 'function' ? fresh : null);
  if(oldFresh206 && !oldFresh206.__sprite206){
    window.fresh = function(){
      const res = oldFresh206.apply(this, arguments);
      try{ state = res; applyAppearanceToPeople199?.(); refreshSprites206(); }catch(e){}
      return res;
    };
    window.fresh.__sprite206 = true;
    try{fresh = window.fresh;}catch(e){}
  }

  // Small helper screen so you can see which 12 sprites are loaded.
  window.avatarSpriteLibrary206 = function(){
    const keys = [
      'male_light_blond','male_light_brown','male_light_black',
      'female_light_blond','female_light_brown','female_light_black',
      'male_dark_blond','male_dark_brown','male_dark_black',
      'female_dark_blond','female_dark_brown','female_dark_black'
    ];
    let html = `<div class="card"><b>Avatar Sprite Library</b><br>12 simpele hoofdjes voor man/vrouw × blank/donker × blond/bruin/zwart.<br><span class="mini">Klaar om later uit te breiden met meer sets zoals Asian, kids, ouderen of extra hairstyles.</span></div><div class="spriteGrid206">`;
    html += keys.map(k=>`<div class="spriteCell206"><img class="headSprite206 xl" src="${spritePath206(k)}"><div class="mini">${k}</div></div>`).join('');
    html += `</div>`;
    showModal(`<div class="modalTop"><div class="avatar">🧩</div><div class="modalTitle">Avatar sprites</div></div><div class="modalBody">${html}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{
    try{ applyAppearanceToPeople199?.(); refreshSprites206(); safeSave?.(); render?.(); }catch(e){}
  }, 400);
})();
