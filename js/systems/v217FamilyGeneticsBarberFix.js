
/* v21.7 Family Genetics + Sprite Barber Fix
   - Player/children genetics now inherit more logically from parents
   - Prevents very dark/light child mismatch when both parents are much lighter/darker
   - Barber is now sprite-aware: only sprite-supported hair colors are offered visually
   - Hairdresser no longer lies about hairstyles that do not exist in the sprite sheet
*/
(function(){
  const SPRITE_HAIR217 = ['blond','brown','black'];
  const AGE_LABEL217 = {baby:'Baby', child:'Kind', teen:'Tiener', adult:'Volwassene'};

  function rnd217(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function clamp217(v,min=0,max=100){ return Math.max(min,Math.min(max,Math.round(v||0))); }
  function money217(v){ try{return money(v)}catch(e){ return '€ '+Math.round(v); } }
  function toast217(t){ try{toast(t)}catch(e){} }
  function action217(title, txt, stats, cash=0, type='good'){
    try{return action(title, txt, stats, cash, type);}catch(e){
      try{applyStats(stats||{})}catch(_e){}
      if(cash) state.money=(state.money||0)+cash;
      try{addLog('<b>'+title+'</b><br>'+txt,'good',false);safeSave();render();}catch(_e){}
    }
  }
  function rr217(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function section217(t){ return `<div class="section">${t}</div>`; }
  function card217(h){ return `<div class="card">${h}</div>`; }

  function gender217(p){
    const g=(p&&p.gender)||state?.gender||'male';
    return String(g).toLowerCase()==='female'?'female':'male';
  }
  function supportedHair217(col){
    col=String(col||'brown');
    if(col==='blond'||col==='brown'||col==='black') return col;
    if(col==='darkBrown') return 'brown';
    if(col==='red') return 'brown';
    if(col==='gray'||col==='white') return 'blond';
    if(col==='blue'||col==='pink') return 'black';
    return 'brown';
  }
  function skinGroup217(t){ return clamp217(t) >= 55 ? 'dark' : 'light'; }
  function skinLabel217(t){
    t=clamp217(t);
    if(t<=20)return 'zeer lichte huid';
    if(t<=40)return 'lichte huid';
    if(t<=60)return 'getinte/lichtbruine huid';
    if(t<=80)return 'bruine huid';
    return 'donkere huid';
  }
  function hairLabel217(x){ return {blond:'blond', brown:'bruin', black:'zwart'}[supportedHair217(x)]||'bruin'; }
  function eyeLabel217(x){ return {blue:'blauwe ogen', green:'groene ogen', brown:'bruine ogen', gray:'grijze ogen', cyber:'cyberogen'}[x]||'bruine ogen'; }
  function ageStage217(p){
    const a = Number((p&&p.age) ?? state?.age ?? 18);
    if(a<=3) return 'baby';
    if(a<=12) return 'child';
    if(a<=17) return 'teen';
    return 'adult';
  }
  function normalizeOrigin217(o){
    o=o||{}; const sum=Object.values(o).reduce((a,v)=>a+(+v||0),0)||1; const out={};
    Object.keys(o).forEach(k=>out[k]=Math.round(((+o[k]||0)*100)/sum)); return out;
  }
  function mixOrigin217(a,b){
    a=a||{}; b=b||{}; const keys=new Set([...Object.keys(a),...Object.keys(b)]); const out={};
    keys.forEach(k=>out[k]=Math.round(((+a[k]||0)+(+b[k]||0))/2));
    return normalizeOrigin217(out);
  }
  function pickWeighted217(obj){
    const entries=Object.entries(obj||{}); const total=entries.reduce((a,[,v])=>a+(+v||0),0)||1; let r=Math.random()*total;
    for(const [k,v] of entries){ r-= (+v||0); if(r<=0) return k; }
    return entries[0]?.[0] || 'brown';
  }
  function ensureApp217(p, region){
    if(window.ensureAppearance199) window.ensureAppearance199(p, region);
    p.appearance=p.appearance||{};
    if(typeof p.appearance.skinTone!=='number') p.appearance.skinTone=25;
    p.appearance.hairColor=supportedHair217(p.appearance.hairColor||p.appearance.naturalHairColor||'brown');
    p.appearance.naturalHairColor=supportedHair217(p.appearance.naturalHairColor||p.appearance.hairColor||'brown');
    p.appearance.hairStyle='default';
    p.appearance.spriteStyle='default';
    p.appearance.lockedSkin=true;
    p.appearance.skinLabel=skinLabel217(p.appearance.skinTone);
    p.appearance.spriteSkinGroup=skinGroup217(p.appearance.skinTone);
    if(!p.appearance.eyeColor) p.appearance.eyeColor='brown';
    return p.appearance;
  }
  function geneticSkinTone217(pa,pb){
    const sa=clamp217(pa?.skinTone ?? 25), sb=clamp217(pb?.skinTone ?? 25);
    const ga=skinGroup217(sa), gb=skinGroup217(sb);
    let min,max,base;
    if(ga===gb && ga==='light'){
      base=Math.round((sa+sb)/2);
      min=Math.max(6, Math.min(sa,sb)-8);
      max=Math.min(46, Math.max(sa,sb)+8);
    } else if(ga===gb && ga==='dark'){
      base=Math.round((sa+sb)/2);
      min=Math.max(54, Math.min(sa,sb)-8);
      max=Math.min(95, Math.max(sa,sb)+8);
    } else {
      base=Math.round((sa+sb)/2);
      min=Math.max(22, Math.min(sa,sb)-10);
      max=Math.min(84, Math.max(sa,sb)+10);
    }
    return clamp217(base + rnd217(-6,6), min, max);
  }
  function weightedTrait217(a,b,fallback){
    const pool={};
    if(a) pool[a]=(pool[a]||0)+46;
    if(b) pool[b]=(pool[b]||0)+46;
    if(fallback) fallback.forEach(k=>pool[k]=(pool[k]||0)+2);
    return pickWeighted217(pool);
  }
  function generateGeneticAppearance217(parentA,parentB,child,existing){
    const a = ensureApp217(parentA||{}, state?.world||'enkhuizen');
    const b = ensureApp217(parentB||{}, state?.world||'enkhuizen');
    const naturalHairColor = supportedHair217(weightedTrait217(
      supportedHair217(a.naturalHairColor||a.hairColor),
      supportedHair217(b.naturalHairColor||b.hairColor),
      ['brown','black','blond']
    ));
    const eyeColor = weightedTrait217(a.eyeColor,b.eyeColor,['brown','blue','green','gray']);
    const skinTone = geneticSkinTone217(a,b);
    const base={
      skinTone,
      skinLabel:skinLabel217(skinTone),
      hairColor:naturalHairColor,
      naturalHairColor,
      hairStyle:'default',
      spriteStyle:'default',
      eyeColor,
      regionOrigin:'genetic',
      originMix:mixOrigin217(a.originMix,b.originMix),
      lockedSkin:true,
      geneticLocked217:true,
      geneticParents217:[(parentA&&parentA.name)||'Moeder',(parentB&&parentB.name)||'Vader'],
      spriteSkinGroup:skinGroup217(skinTone)
    };
    if(existing && typeof existing==='object'){
      const dyed = existing.hairColor && supportedHair217(existing.hairColor)!==naturalHairColor;
      base.hairColor = dyed ? supportedHair217(existing.hairColor) : naturalHairColor;
      base.naturalHairColor = naturalHairColor;
      base.dyedColor217 = dyed;
      if(existing.eyeColor) base.eyeColor = existing.eyeColor; // allow stable save if already set
    }
    return base;
  }
  function appearanceText217(p){
    const a=ensureApp217(p);
    return `${skinLabel217(a.skinTone)} · ${hairLabel217(a.hairColor)} haar · ${eyeLabel217(a.eyeColor)}`;
  }
  window.appearanceText199 = appearanceText217;

  function syncFamilyGenetics217(){
    if(!state) return;
    // make sure parent appearances exist first
    if(state.mother){ state.mother.gender='female'; ensureApp217(state.mother, state.world||'enkhuizen'); }
    if(state.father){ state.father.gender='male'; ensureApp217(state.father, state.world||'enkhuizen'); }

    // Player appearance: if parents exist, player should fit them genetically.
    if(state.mother && state.father){
      const current=state.appearance||{};
      const base=generateGeneticAppearance217(state.mother,state.father,{age:state.age,gender:state.gender,name:state.name},current);
      state.appearance = Object.assign({}, current, base, {
        hairColor: current.hairColor ? supportedHair217(current.hairColor) : base.hairColor,
        naturalHairColor: base.naturalHairColor,
        skinTone: base.skinTone,
        skinLabel: base.skinLabel,
        spriteSkinGroup: base.spriteSkinGroup,
        eyeColor: base.eyeColor,
        originMix: base.originMix,
        regionOrigin:'genetic',
        lockedSkin:true,
        geneticLocked217:true,
        hairStyle:'default',
        spriteStyle:'default'
      });
      if(!current.hairColor || current.hairColor===current.naturalHairColor) state.appearance.hairColor = base.naturalHairColor;
    } else {
      state.appearance = state.appearance || {};
      ensureApp217({appearance:state.appearance,gender:state.gender,age:state.age}, state.world||'enkhuizen');
    }

    // Siblings are genetic children from same parents
    (state.siblings||[]).forEach(s=>{
      s.gender=s.gender||'male';
      s.appearance = generateGeneticAppearance217(state.mother||{}, state.father||{}, s, s.appearance||{});
      ensureApp217(s, state.world||'enkhuizen');
    });

    // Existing children inherit from player + partner if possible
    (state.children||[]).forEach(ch=>{
      const other=(state.partner&&state.partner.appearance)?state.partner:(state.spouse&&state.spouse.appearance)?state.spouse:(state.exPartner&&state.exPartner.appearance)?state.exPartner:null;
      if(other){
        ch.appearance = generateGeneticAppearance217({appearance:state.appearance, gender:state.gender, age:state.age, name:state.name}, other, ch, ch.appearance||{});
      } else {
        ensureApp217(ch, state.world||'enkhuizen');
      }
      ensureApp217(ch, state.world||'enkhuizen');
    });

    if(state.partner) ensureApp217(state.partner, state.partner.place||state.world||'enkhuizen');
    (state.friends||[]).forEach(f=>ensureApp217(f, f.place||f.metAt||state.world||'enkhuizen'));
    (state.vacationContacts||[]).forEach(c=>ensureApp217(c, c.place||state.vacation||state.world||'amsterdam'));

    // v21.8 stability: do NOT call refreshSprites212() from here.
    // refreshSprites212() calls applyAppearanceToPeople199(), which points back to genetics sync.
    // Sprite refresh is handled after sync by v21.8 in a guarded way.
  }
  window.syncFamilyGenetics217 = syncFamilyGenetics217;
  window.generateChildAppearance199 = function(parentA,parentB,child){
    return generateGeneticAppearance217(parentA,parentB,child, child&&child.appearance);
  };
  window.applyAppearanceToPeople199 = function(){
    syncFamilyGenetics217();
  };

  // --- Sprite-aware barber system ---
  function barberTarget217(){
    state.appearance = state.appearance || {};
    syncFamilyGenetics217();
    return {name:state.name||'Jij', age:state.age||0, gender:state.gender||'male', appearance:state.appearance};
  }
  function barberPrice217(kind){
    const age=state?.age||0;
    if(kind==='cut') return age<6?0:age<12?12:age<18?28:45;
    if(kind==='treatment') return age<12?0:20;
    if(kind==='dye') return age<12?9999:age<18?40:60;
    return 0;
  }
  function barberCanDye217(){ return (state?.age||0) >= 12; }
  function spriteHairOptions217(){ return SPRITE_HAIR217.map(c=>`<button class="btn" onclick="barberDye217('${c}')">🎨 ${hairLabel217(c)}<br><span class="mini">${money217(-barberPrice217('dye')).replace('-', '')}</span></button>`).join(''); }
  function barberHeaderCard217(p){
    const a=ensureApp217(p);
    const stage=AGE_LABEL217[ageStage217(p)] || 'Persoon';
    return `<div class="card ava199Card">${typeof renderPersonAvatar199==='function'?renderPersonAvatar199(p,'big'):''}<b>Kapper</b><br>${stage} · ${appearanceText217(p)}<br><span class="mini">Sprite-systeem: visuele kleurkeuzes = blond, bruin of zwart. Huidtint en afkomst zijn genetisch en veranderen niet bij de kapper.</span>${a.naturalHairColor?`<br><span class="mini">Natuurlijke haarkleur: ${hairLabel217(a.naturalHairColor)}</span>`:''}</div>`;
  }
  window.barberShop199 = function(){
    const p=barberTarget217();
    const age=state.age||0;
    let h=barberHeaderCard217(p);
    h+=section217('Knippen');
    if(age<6){
      h+=rr217('✂️','Eerste knipbeurt','Rustige baby/peuterknip, vooral looks en happiness','barberCut217()');
    }else if(age<12){
      h+=rr217('✂️','Kinderknipbeurt','Netjes kapsel voor school en spelen','barberCut217()');
      h+=rr217('🧴','Haar verzorgen','Milde verzorging, kleine looks boost','barberTreatment217()');
    }else if(age<18){
      h+=rr217('✂️','Tienerknipbeurt','Frisse coupe binnen het huidige sprite-systeem','barberCut217()');
      h+=rr217('🧴','Haarbehandeling','Verzorging voor hair/looks','barberTreatment217()');
      h+=section217('Kleur verven');
      h+=spriteHairOptions217();
      h+=rr217('↩️','Terug naar natuurlijke kleur','Verwijder verf en ga terug naar je natuurlijke haar','barberResetColor217()');
    }else{
      h+=rr217('✂️','Barber / salon knipbeurt','Volwassen knipbeurt met betere looks boost','barberCut217()');
      h+=rr217('🧴','Haarbehandeling','Verzorging en een frisse look','barberTreatment217()');
      h+=section217('Kleur verven');
      h+=spriteHairOptions217();
      h+=rr217('↩️','Terug naar natuurlijke kleur','Verwijder verf en ga terug naar je natuurlijke haar','barberResetColor217()');
    }
    h+=`<button class="btn alt" onclick="closeModal()">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">💈</div><div class="modalTitle">Kapper</div></div><div class="modalBody">${h}</div>`);
  };
  function spend217(cost){
    if(cost<=0) return true;
    if((state.money||0) < cost){ toast217('Niet genoeg geld: '+money217(cost)); return false; }
    state.money -= cost; return true;
  }
  window.barberCut217 = function(){
    syncFamilyGenetics217();
    const cost=barberPrice217('cut');
    if(!spend217(cost)) return;
    const age=state.age||0;
    state.appearance = state.appearance||{};
    state.appearance.hairStyle='default';
    let txt=''; let stats={Looks:2,Happiness:1};
    if(age<6){ txt='Ik kreeg mijn eerste rustige knipbeurt. Ik zag er meteen netter uit.'; stats={Looks:2,Happiness:2}; }
    else if(age<12){ txt='Ik kreeg een nette kinderknipbeurt. Mijn haar zat weer fris.'; stats={Looks:3,Happiness:2}; }
    else if(age<18){ txt='Ik nam een frisse tienerknipbeurt. Binnen het huidige sprite-systeem ziet mijn look er weer strak uit.'; stats={Looks:3,Happiness:2}; }
    else { txt='Ik ging naar de kapper/barber en kwam verzorgd terug.'; stats={Looks:4,Happiness:2}; }
    state.appearance.lastBarberAge217=state.age;
    closeModal(); action217('Kapper',txt,stats,0,'good'); syncFamilyGenetics217(); safeSave(); render(); setTimeout(()=>barberShop199(),40);
  };
  window.barberTreatment217 = function(){
    const cost=barberPrice217('treatment');
    if(!spend217(cost)) return;
    closeModal(); action217('Haarbehandeling','Ik nam een verzorgende behandeling. Mijn haar voelde beter en ik oogde frisser.',{Looks:2,Happiness:1},0,'good'); syncFamilyGenetics217(); safeSave(); render(); setTimeout(()=>barberShop199(),40);
  };
  window.barberDye217 = function(color){
    color=supportedHair217(color);
    if(!barberCanDye217()) return toast217('Haar verven kan pas vanaf 12 jaar.');
    const cost=barberPrice217('dye');
    if(!spend217(cost)) return;
    state.appearance = state.appearance || {};
    const natural=supportedHair217(state.appearance.naturalHairColor||'brown');
    state.appearance.hairColor = color;
    state.appearance.naturalHairColor = natural;
    state.appearance.dyedColor217 = color!==natural;
    closeModal(); action217('Haarkleur',`Ik verfde mijn haar ${hairLabel217(color)}.`,{Looks:2,Happiness:2},0,'good'); syncFamilyGenetics217(); safeSave(); render(); setTimeout(()=>barberShop199(),40);
  };
  window.barberResetColor217 = function(){
    state.appearance = state.appearance || {};
    const natural=supportedHair217(state.appearance.naturalHairColor||state.appearance.hairColor||'brown');
    if(state.appearance.hairColor===natural) return toast217('Je haar heeft al zijn natuurlijke kleur.');
    if(!spend217(10)) return;
    state.appearance.hairColor = natural;
    state.appearance.dyedColor217 = false;
    closeModal(); action217('Haarkleur',`Ik ging terug naar mijn natuurlijke haarkleur: ${hairLabel217(natural)}.`,{Looks:1,Happiness:1},0,'good'); syncFamilyGenetics217(); safeSave(); render(); setTimeout(()=>barberShop199(),40);
  };

  // Patch activity hubs so barber remains under gezondheid/uiterlijk in original style.
  const oldHealth217 = window.healthLooksHub204 || null;
  if(oldHealth217 && !oldHealth217.__barber217){
    window.healthLooksHub204=function(){
      let h=card217('<b>Gezondheid & Uiterlijk</b><br>Health, stamina, looks en verzorging.');
      if((state.age||0)<14){ h+=section217('Kindertijd'); h+=rr217('🧒','Kindertijd & Spelen','Buiten spelen, verstoppertje, tikkertje, speeltuin en schoolplein','childhoodPlayHub215()'); }
      h+=section217('Gezondheid');
      h+=rr217('🏥','Dokter','Gezondheid verbeteren en check-up','doctorHub215()');
      if(typeof gymScreen==='function') h+=rr217('💪',(state.age||0)<12?'Sport / buiten bewegen':'Gym / Sport basis','Fitness, stamina en health trainen','gymScreen()');
      if(typeof mentalHealthScreen==='function') h+=rr217('🧠','Mental Health','Stress, trauma, burn-out en herstel','mentalHealthScreen()');
      h+=section217('Uiterlijk');
      h+=rr217('💈','Kapper','Sprite-gestuurde kapper voor knippen, verven en verzorging','barberShop199()');
      if(typeof appearanceProfile199==='function') h+=rr217('🧬','Appearance profiel','Genetisch uiterlijk en avatar bekijken','appearanceProfile199()');
      showModal(`<div class="modalTop"><div class="avatar">💪</div><div class="modalTitle">Gezondheid & Uiterlijk</div></div><div class="modalBody">${h}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
    };
    window.healthLooksHub204.__barber217=true;
  }

  // Build a better appearance profile if missing.
  window.appearanceProfile199 = function(){
    syncFamilyGenetics217();
    const p=barberTarget217(); const a=ensureApp217(p);
    let h=card217(`${typeof renderPersonAvatar199==='function'?renderPersonAvatar199(p,'big'):''}<b>Appearance profiel</b><br>${appearanceText217(p)}<br><span class="mini">Huidtint en afkomst zijn genetisch/familiaal. Kapper kan alleen haar en verzorging aanpassen.</span>`);
    h+=card217(`<b>Details</b><br>Leeftijdsfase: ${AGE_LABEL217[ageStage217(p)]}<br>Huidgroep sprite: ${a.spriteSkinGroup==='dark'?'donker':'licht'}<br>Natuurlijke haarkleur: ${hairLabel217(a.naturalHairColor)}<br>Huidige haarkleur: ${hairLabel217(a.hairColor)}${a.dyedColor217?' (geverfd)':''}<br>Oogkleur: ${eyeLabel217(a.eyeColor)}`);
    if(state.mother && state.father){
      h+=card217(`<b>Familie-genetica</b><br>Moeder: ${appearanceText217(state.mother)}<br>Vader: ${appearanceText217(state.father)}<br><span class="mini">Jouw huidtint/origine is nu logisch afgeleid van je ouders om rare sprite-combinaties te voorkomen.</span>`);
    }
    showModal(`<div class="modalTop"><div class="avatar">🧬</div><div class="modalTitle">Appearance profiel</div></div><div class="modalBody">${h}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  // Reapply on load / save / render.
  const oldRender217 = null; // disabled by v21.8 stability fix;
  if(oldRender217 && !oldRender217.__genetics217){
    window.render=function(){ try{syncFamilyGenetics217()}catch(e){} return oldRender217.apply(this,arguments); };
    window.render.__genetics217=true; try{render=window.render}catch(e){}
  }
  const oldSafeSave217 = null; // disabled by v21.8 stability fix;
  if(oldSafeSave217 && !oldSafeSave217.__genetics217){
    window.safeSave=function(){ try{syncFamilyGenetics217()}catch(e){} return oldSafeSave217.apply(this,arguments); };
    window.safeSave.__genetics217=true; try{safeSave=window.safeSave}catch(e){}
  }
  const oldMigrate217 = null; // disabled by v21.8 stability fix;
  if(oldMigrate217 && !oldMigrate217.__genetics217){
    window.migrate=function(s){ const res=oldMigrate217.apply(this,arguments); try{state=res;syncFamilyGenetics217()}catch(e){} return res; };
    window.migrate.__genetics217=true; try{migrate=window.migrate}catch(e){}
  }
  // If the birth/name confirm hook exists, make sure newborn children use the new genetics too.
  const oldConfirmChild217 = window.confirmChildName198 || null;
  if(oldConfirmChild217 && !oldConfirmChild217.__genetics217){
    window.confirmChildName198=function(){
      const before=(state.children||[]).length;
      const res=oldConfirmChild217.apply(this,arguments);
      try{
        const after=(state.children||[]).length;
        if(after>before){
          const ch=state.children[after-1];
          const partner=state.partner||state.spouse||state.exPartner||null;
          if(ch){
            if(partner && partner.appearance) ch.appearance=generateGeneticAppearance217({appearance:state.appearance,gender:state.gender,age:state.age,name:state.name}, partner, ch, ch.appearance||{});
            else ensureApp217(ch, state.world||'enkhuizen');
          }
        }
        syncFamilyGenetics217();
      }catch(e){}
      return res;
    };
    window.confirmChildName198.__genetics217=true;
  }

  window.familyGeneticsDebug217=function(){
    syncFamilyGenetics217();
    const you={name:state.name,age:state.age,gender:state.gender,appearance:state.appearance};
    let h=card217(`<b>Speler</b><br>${typeof renderPersonAvatar199==='function'?renderPersonAvatar199(you,'big'):''}${appearanceText217(you)}`);
    if(state.mother) h+=card217(`<b>Moeder</b><br>${typeof renderPersonAvatar199==='function'?renderPersonAvatar199(state.mother,'big'):''}${appearanceText217(state.mother)}`);
    if(state.father) h+=card217(`<b>Vader</b><br>${typeof renderPersonAvatar199==='function'?renderPersonAvatar199(state.father,'big'):''}${appearanceText217(state.father)}`);
    h+=card217('<span class="mini">De speler en siblings worden nu genetisch afgestemd op de ouders. De kapper verandert alleen haar/verzorging.</span>');
    showModal(`<div class="modalTop"><div class="avatar">🧬</div><div class="modalTitle">Familie-genetica debug</div></div><div class="modalBody">${h}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  /* v21.8: disabled v21.7 startup render/save to prevent recursive freeze. */
})();
