
/* v21.9 School Sprite Variety + Teacher Adult Fix
   - class screen uses real sprite variety for classmates
   - teacher is always adult and never a baby sprite
   - classmate/teacher icons stay synced in buttons and modals
*/
(function(){
  function clamp219(v,min=0,max=100){ return Math.max(min,Math.min(max,Math.round(v||0))); }
  function pick219(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function g219(g){ return String(g||'male').toLowerCase()==='female'?'female':'male'; }
  function sprite219(person,size='md',ctx=''){
    try{
      if(typeof spriteHTML218==='function') return spriteHTML218(person,size,ctx);
      if(typeof spriteHTML212==='function') return spriteHTML212(person,size,ctx);
      if(typeof renderPersonAvatar199==='function') return renderPersonAvatar199(person,size==='big'?'big':size);
    }catch(e){}
    return '🙂';
  }
  function region219(){
    const base = String((state && (state.homeWorldBeforeVacation || state.world || 'enkhuizen')) || 'enkhuizen').toLowerCase();
    if(base.includes('jamaica')) return 'jamaica';
    if(base.includes('japan') || base.includes('tokyo')) return 'japan';
    if(base.includes('spain') || base.includes('spanje')) return 'spain';
    if(base.includes('america') || base.includes('usa')) return 'usa';
    if(base.includes('amsterdam')) return 'amsterdam';
    if(base.includes('night')) return 'nightcity';
    return 'netherlands';
  }
  function weightedPick219(entries){
    let total=entries.reduce((a,x)=>a+(+x[1]||0),0);
    let r=Math.random()*total;
    for(const [k,w] of entries){ r-= (+w||0); if(r<=0) return k; }
    return entries[0][0];
  }
  function appearancePreset219(kind='classmate'){
    const reg = region219();
    let skinWeights=[['light',80],['dark',20]];
    let hairWeights=[['blond',28],['brown',46],['black',26]];
    if(reg==='japan'){
      skinWeights=[['light',92],['dark',8]];
      hairWeights=[['blond',5],['brown',25],['black',70]];
    }else if(reg==='jamaica'){
      skinWeights=[['light',8],['dark',92]];
      hairWeights=[['blond',6],['brown',18],['black',76]];
    }else if(reg==='spain'){
      skinWeights=[['light',68],['dark',32]];
      hairWeights=[['blond',16],['brown',54],['black',30]];
    }else if(reg==='usa'){
      skinWeights=[['light',58],['dark',42]];
      hairWeights=[['blond',20],['brown',42],['black',38]];
    }else if(reg==='nightcity'){
      skinWeights=[['light',50],['dark',50]];
      hairWeights=[['blond',20],['brown',35],['black',45]];
    }else if(reg==='amsterdam' || reg==='netherlands'){
      skinWeights=[['light',82],['dark',18]];
      hairWeights=[['blond',34],['brown',42],['black',24]];
    }
    const skinGroup = weightedPick219(skinWeights);
    const skinTone = skinGroup==='dark' ? clamp219(60 + Math.random()*28,55,90) : clamp219(10 + Math.random()*30,8,44);
    const hairColor = weightedPick219(hairWeights);
    const eyeColor = weightedPick219([['brown',56],['blue',20],['green',14],['gray',10]]);
    return {
      skinTone, hairColor, naturalHairColor:hairColor, eyeColor,
      hairStyle:'default', spriteStyle:'default', lockedSkin:true,
      spriteSkinGroup: skinTone>=55 ? 'dark' : 'light',
      regionOrigin:'school-region'
    };
  }
  function ensureAppearance219(p, kind='classmate'){
    if(!p || typeof p!=='object') return null;
    if(typeof ensureAppearance199==='function'){
      try{ ensureAppearance199(p, region219()); }catch(e){}
    }
    p.appearance = p.appearance || appearancePreset219(kind);
    const a = p.appearance;
    if(typeof a.skinTone !== 'number') a.skinTone = appearancePreset219(kind).skinTone;
    a.skinTone = clamp219(a.skinTone);
    a.hairColor = ['blond','brown','black'].includes(a.hairColor) ? a.hairColor : 'brown';
    a.naturalHairColor = ['blond','brown','black'].includes(a.naturalHairColor) ? a.naturalHairColor : a.hairColor;
    a.eyeColor = a.eyeColor || 'brown';
    a.hairStyle = 'default';
    a.spriteStyle = 'default';
    a.lockedSkin = true;
    a.spriteSkinGroup = a.skinTone>=55 ? 'dark' : 'light';
    return a;
  }
  function inferTeacherGender219(name){
    name=String(name||'').toLowerCase();
    if(/mrs\.|mevrouw|juf|miss/.test(name)) return 'female';
    if(/mr\.|meneer|meester/.test(name)) return 'male';
    return Math.random()<0.5 ? 'female' : 'male';
  }
  function teacherNames219(){
    return {
      female:['Juf Anna','Juf Noor','Mevrouw Visser','Mrs. Eriksen','Mevrouw Jansen','Miss Parker'],
      male:['Meester Smit','Meneer De Boer','Mr. Bakker','Meneer Mulder','Meester Janssen','Mr. Collins']
    };
  }
  function ensureTeacher219(){
    if(!state) return null;
    state.school = state.school || {teacher:null,classmates:[]};
    let t = state.school.teacher || {};
    if(!t.name){
      const gender = Math.random()<0.5 ? 'female' : 'male';
      t.name = pick219(teacherNames219()[gender]);
    }
    t.gender = inferTeacherGender219(t.name);
    t.role = 'teacher';
    if(!Number.isFinite(Number(t.age)) || Number(t.age) < 21) t.age = 24 + Math.floor(Math.random()*28);
    t.rel = clamp219(t.rel ?? (35 + Math.random()*35),0,100);
    ensureAppearance219(t,'teacher');
    t.icon = sprite219(t,'md','teacher');
    state.school.teacher = t;
    return t;
  }
  function ensureClassmate219(c, i){
    if(!c || typeof c!=='object') c={};
    c.gender = g219(c.gender || (Math.random()<0.5 ? 'female' : 'male'));
    c.role = 'classmate';
    c.age = Number.isFinite(Number(c.age)) ? Number(c.age) : Number(state?.age || 8);
    c.rel = clamp219(c.rel ?? (20 + Math.random()*60),0,100);
    c.friend = !!c.friend;
    ensureAppearance219(c,'classmate');
    c.icon = sprite219(c,'md',`classmate[${i}]`);
    return c;
  }
  function normalizeSchool219(forceRebuild=false){
    if(!state) return;
    state.school = state.school || {teacher:null,classmates:[]};
    ensureTeacher219();
    if(!Array.isArray(state.school.classmates)) state.school.classmates = [];
    if(forceRebuild && state.school.classmates.length){
      state.school.classmates = state.school.classmates.map((c,i)=>({
        ...c,
        appearance: appearancePreset219('classmate')
      }));
    }
    state.school.classmates = state.school.classmates.map((c,i)=>ensureClassmate219(c,i));
  }

  const oldInitClass219 = window.initClass || (typeof initClass==='function' ? initClass : null);
  window.initClass = function(force=false){
    if(oldInitClass219) oldInitClass219.apply(this,arguments);
    normalizeSchool219(false);
    return state.school;
  };
  try{ initClass = window.initClass; }catch(e){}

  // Screen overrides
  window.classScreen = function(){
    if(typeof isInSchool==='function' && !isInSchool()) return toast('Je hebt nu geen actieve klas.');
    initClass();
    const t = ensureTeacher219();
    const cls = (state.school.classmates||[]).map((c,i)=>
      `<button class="btn" onclick="classmateScreen(${i})">${c.icon||sprite219(c,'md',`classmate[${i}]`)} ${c.name}${c.friend?' (Friend)':''}<br><span class="mini">Classmate · relatie ${c.rel}%</span></button>`
    ).join('');
    showModal(
      `<div class="modalTop"><div class="avatar">👥</div><div class="modalTitle">Klas</div></div>`+
      `<div class="modalBody">`+
      `<div class="card"><b>Klasoverzicht</b><br>Leraar en klasgenoten gebruiken nu leeftijd-correcte sprites met meer variatie in huidskleur en haarkleur.</div>`+
      `<button class="btn" onclick="teacherScreen()">${t.icon||sprite219(t,'md','teacher')} ${t.name}<br><span class="mini">Teacher · relatie ${t.rel}%</span></button>`+
      cls+
      `<button class="btn alt" onclick="schoolScreen()">Terug</button></div>`
    );
  };
  try{ classScreen = window.classScreen; }catch(e){}

  window.teacherScreen = function(){
    initClass();
    const t = ensureTeacher219();
    showModal(
      `<div class="modalTop"><div class="avatar">${t.icon||sprite219(t,'md','teacher')}</div><div class="modalTitle">${t.name}</div></div>`+
      `<div class="modalBody">`+
      `<div class="card">${sprite219(t,'big','teacher')}<b>Teacher</b><br>Relatie: ${t.rel}% ${typeof relationBar==='function' ? relationBar(t.rel) : ''}<br><span class="mini">Volwassene · ${t.gender==='female'?'vrouw':'man'} · schoolcontact</span></div>`+
      `<button class="btn" onclick="teacherAction('compliment')">😘 Compliment</button>`+
      `<button class="btn" onclick="teacherAction('befriend')">🤝 Befriend</button>`+
      `<button class="btn" onclick="teacherAction('suckup')">🤐 Suck up</button>`+
      `<button class="btn" onclick="teacherAction('actup')">🤡 Act up</button>`+
      `<button class="btn red" onclick="teacherAction('insult')">🤬 Insult</button>`+
      `<button class="btn alt" onclick="classScreen()">Terug</button></div>`
    );
  };
  try{ teacherScreen = window.teacherScreen; }catch(e){}

  window.classmateScreen = function(i){
    initClass();
    const c = state.school?.classmates?.[i];
    if(!c) return toast('Geen klasgenoot gevonden.');
    ensureClassmate219(c,i);
    showModal(
      `<div class="modalTop"><div class="avatar">${c.icon||sprite219(c,'md',`classmate[${i}]`)}</div><div class="modalTitle">${c.name}</div></div>`+
      `<div class="modalBody">`+
      `<div class="card">${sprite219(c,'big',`classmate[${i}]`)}<b>Classmate${c.friend?' · Friend':''}</b><br>Relatie: ${c.rel}% ${typeof relationBar==='function' ? relationBar(c.rel) : ''}<br><span class="mini">${c.gender==='female'?'Meisje':'Jongen'} · ${c.age} jaar</span></div>`+
      `${state.age>=16?`<button class="btn pink" onclick="classmateAction(${i},'askout')">❤️ Ask Out</button><button class="btn pink" onclick="classmateAction(${i},'flirt')">💋 Flirt</button>`:''}`+
      `<button class="btn" onclick="classmateAction(${i},'conversation')">👥 Conversation</button>`+
      `<button class="btn" onclick="classmateAction(${i},'befriend')">🤝 Befriend</button>`+
      `<button class="btn" onclick="classmateAction(${i},'compliment')">😘 Compliment</button>`+
      `<button class="btn" onclick="classmateAction(${i},'gift')">🎁 Gift</button>`+
      `<button class="btn red" onclick="classmateAction(${i},'insult')">🤬 Insult</button>`+
      `<button class="btn alt" onclick="classScreen()">Terug</button></div>`
    );
  };
  try{ classmateScreen = window.classmateScreen; }catch(e){}

  // Keep partner/friend icons correct after school actions.
  const oldClassmateAction219 = window.classmateAction || null;
  if(oldClassmateAction219){
    window.classmateAction = function(i,kind){
      const res = oldClassmateAction219.apply(this,arguments);
      try{
        initClass();
        const c = state.school?.classmates?.[i];
        if(c){
          ensureClassmate219(c,i);
          if(state.partner && state.partner.name===c.name){
            state.partner.icon = c.icon;
            state.partner.gender = c.gender;
            state.partner.age = c.age;
            state.partner.appearance = JSON.parse(JSON.stringify(c.appearance||{}));
          }
          (state.friends||[]).forEach(f=>{
            if(f.name===c.name){
              f.icon = c.icon;
              f.gender = c.gender;
              f.age = c.age;
              f.appearance = JSON.parse(JSON.stringify(c.appearance||{}));
            }
          });
        }
      }catch(e){}
      return res;
    };
    try{ classmateAction = window.classmateAction; }catch(e){}
  }

  // Optional force refresh helper
  window.schoolSpriteDebug219 = function(regen=false){
    if(regen) normalizeSchool219(true); else normalizeSchool219(false);
    const t = state.school?.teacher;
    const sample = (state.school?.classmates||[]).slice(0,6).map((c,i)=>`<div class="card">${c.icon||sprite219(c,'md',`classmate[${i}]`)} <b>${c.name}</b><br>${c.gender} · ${c.age} jaar</div>`).join('');
    showModal(`<div class="modalTop"><div class="avatar">🏫</div><div class="modalTitle">School sprite debug</div></div><div class="modalBody"><div class="card"><b>Teacher</b><br>${t ? (t.icon||sprite219(t,'md','teacher'))+' '+t.name+' · '+t.age+' jaar' : 'geen'}</div>${sample}<button class="btn" onclick="schoolSpriteDebug219(true)">Nieuwe variatie genereren</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  // Run once after load
  setTimeout(()=>{
    try{
      if(state && state.school){
        normalizeSchool219(false);
        if(typeof safeSave==='function') safeSave();
      }
    }catch(e){ console.warn('[v21.9 school]', e); }
  }, 220);
})();
