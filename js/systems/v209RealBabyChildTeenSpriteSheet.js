
/* v20.9 Real Baby/Child/Teen Sprite Sheet
   Replaces generated/scaled age variants with real 36-sprite sheet cuts.
   Keeps v20.8 age-stage selection:
   baby 0-3, child 4-12, teen 13-17, adult 18+.
*/
(function(){
  window.avatarSpriteSheetVersion209 = 'v20.9 real baby child teen sheet';

  function spriteKey209(person){
    if(typeof spriteFileKey208 === 'function'){
      return spriteFileKey208(person, person && person.gender, person && person.age);
    }
    return 'male_light_brown';
  }

  window.avatarAgeSpriteLibrary209 = function(){
    const stages = ['baby','child','teen'];
    const skins = ['light','dark'];
    const variants = [
      ['male','blond'], ['male','brown'], ['male','black'],
      ['female','blond'], ['female','brown'], ['female','black']
    ];
    let html = `<div class="card"><b>Real Baby / Child / Teen Sprite Sheet</b><br>36 echte uitgesneden sprites uit de nieuwe sheet.<br><span class="mini">Adult sprites blijven uit de bestaande volwassen set komen.</span></div>`;
    html += `<div class="spriteGrid206">`;
    stages.forEach(stage=>{
      skins.forEach(skin=>{
        variants.forEach(v=>{
          const key = `${stage}_${v[0]}_${skin}_${v[1]}`;
          html += `<div class="spriteCell206"><img class="headSprite206 xl" src="assets/avatar_sprites/${key}.png"><div class="mini">${key}</div></div>`;
        });
      });
    });
    html += `</div>`;
    showModal(`<div class="modalTop"><div class="avatar">🧒</div><div class="modalTitle">Age Sprite Sheet v20.9</div></div><div class="modalBody">${html}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  // Patch status helper for debugging.
  window.checkAvatarSprites209 = function(){
    const required = [];
    ['baby','child','teen'].forEach(stage=>{
      ['light','dark'].forEach(skin=>{
        [['male','blond'],['male','brown'],['male','black'],['female','blond'],['female','brown'],['female','black']].forEach(v=>{
          required.push(`${stage}_${v[0]}_${skin}_${v[1]}.png`);
        });
      });
    });
    showModal(`<div class="modalTop"><div class="avatar">🧩</div><div class="modalTitle">Avatar sprites</div></div><div class="modalBody"><div class="card">Verwacht: ${required.length} baby/kind/tiener sprites.<br>Map: assets/avatar_sprites/<br>Renderer: ${typeof spriteHTML208 === 'function' ? 'v20.8 actief' : 'niet gevonden'}</div><button class="btn" onclick="avatarAgeSpriteLibrary209()">Bekijk sprite library</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
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
