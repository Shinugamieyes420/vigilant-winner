
/* v20.8 Age Stage Avatar Sprites
   Adds baby/child/teen/adult avatar stage selection on top of the sprite avatar system.
*/
(function(){
  function ageStage208(age){
    age = Number(age || 0);
    if(age <= 3) return 'baby';
    if(age <= 12) return 'child';
    if(age <= 17) return 'teen';
    return 'adult';
  }
  window.ageStage208 = ageStage208;

  function genderGroup208(p,g){
    let gg = g || (p && p.gender) || 'male';
    gg = String(gg).toLowerCase();
    return gg === 'female' ? 'female' : 'male';
  }

  function hairGroup208(color){
    color = String(color || 'brown');
    const map = {
      blond:'blond', yellow:'blond', white:'blond',
      brown:'brown', darkBrown:'brown', red:'brown',
      black:'black', gray:'black', blue:'black', pink:'brown'
    };
    return map[color] || 'brown';
  }

  function skinGroup208(p){
    const tone = p && p.appearance && typeof p.appearance.skinTone === 'number'
      ? p.appearance.skinTone
      : 25;
    return tone >= 55 ? 'dark' : 'light';
  }

  function spriteFileKey208(person, g, age){
    const gender = genderGroup208(person, g);
    const skin = skinGroup208(person || {});
    const hair = hairGroup208(person?.appearance?.hairColor || 'brown');
    const stage = ageStage208(age != null ? age : (person && person.age));
    const core = `${gender}_${skin}_${hair}`;
    return stage === 'adult' ? core : `${stage}_${core}`;
  }
  window.spriteFileKey208 = spriteFileKey208;

  function spritePath208(person, g, age){
    const key = spriteFileKey208(person, g, age);
    return 'assets/avatar_sprites/' + key + '.png';
  }
  window.spritePath208 = spritePath208;

  function spriteHTML208(person, size='md', g=null, age=null){
    const key = spriteFileKey208(person, g, age);
    return `<img class="headSprite206 ${size}" src="assets/avatar_sprites/${key}.png" alt="${key}">`;
  }
  window.spriteHTML208 = spriteHTML208;

  // Override the prior sprite integration so age now matters.
  window.renderPersonEmoji199 = function(p){
    return spriteHTML208(p, 'md', p && p.gender, p && p.age);
  };

  window.humanIcon = function(g, age=18, person=null){
    if(person && typeof person === 'object'){
      return spriteHTML208(person, 'md', g || person.gender, age != null ? age : person.age);
    }
    return spriteHTML208({gender:g||'male', age:age||18, appearance:{skinTone:25, hairColor:'brown'}}, 'md', g, age);
  };
  try{ humanIcon = window.humanIcon; }catch(e){}

  function walkPeople208(root, fn){
    if(!root || typeof root !== 'object') return;
    const seen = new Set();
    function visit(x){
      if(!x || typeof x !== 'object' || seen.has(x)) return;
      seen.add(x);
      if(x.name || x.gender || x.appearance || typeof x.age !== 'undefined') fn(x);
      Object.keys(x).forEach(k=>{
        const v = x[k];
        if(Array.isArray(v)) v.forEach(visit);
        else if(v && typeof v === 'object') visit(v);
      });
    }
    visit(root);
  }

  window.refreshSprites208 = function(){
    if(typeof state === 'undefined' || !state) return;
    walkPeople208(state, p=>{
      if(!p.appearance && typeof ensureAppearance199 === 'function'){
        try{ ensureAppearance199(p); }catch(e){}
      }
      p.icon = spriteHTML208(p, 'md', p.gender, p.age);
    });
  };

  const oldRender208 = window.render || (typeof render === 'function' ? render : null);
  if(oldRender208 && !oldRender208.__ageStage208){
    window.render = function(){
      try{ if(typeof applyAppearanceToPeople199 === 'function') applyAppearanceToPeople199(); }catch(e){}
      try{ if(typeof refreshSprites208 === 'function') refreshSprites208(); }catch(e){}
      return oldRender208.apply(this, arguments);
    };
    window.render.__ageStage208 = true;
    try{ render = window.render; }catch(e){}
  }

  // Tiny library preview modal
  window.avatarAgeSpriteLibrary208 = function(){
    const stages = ['baby','child','teen','adult'];
    const cores = [
      'male_light_blond','male_light_brown','male_light_black',
      'female_light_blond','female_light_brown','female_light_black',
      'male_dark_blond','male_dark_brown','male_dark_black',
      'female_dark_blond','female_dark_brown','female_dark_black'
    ];
    let html = `<div class="card"><b>Avatar leeftijd sprites</b><br>Nu ook aparte hoofdjes voor baby, kind, tiener en volwassene.</div>`;
    html += `<div class="section">Sprite library</div><div class="spriteGrid206">`;
    stages.forEach(stage=>{
      cores.forEach(core=>{
        const key = stage === 'adult' ? core : `${stage}_${core}`;
        html += `<div class="spriteCell206"><img class="headSprite206 xl" src="assets/avatar_sprites/${key}.png"><div class="mini">${key}</div></div>`;
      });
    });
    html += `</div>`;
    showModal(`<div class="modalTop"><div class="avatar">🧒</div><div class="modalTitle">Leeftijd sprites</div></div><div class="modalBody">${html}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{
    try{
      if(typeof applyAppearanceToPeople199 === 'function') applyAppearanceToPeople199();
      if(typeof refreshSprites208 === 'function') refreshSprites208();
      if(typeof safeSave === 'function') safeSave();
      if(typeof render === 'function') render();
    }catch(e){}
  }, 500);
})();
