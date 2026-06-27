
/* v19.9 Appearance Genetics + Regional Avatar System
   - skinTone 0-100, hairColor, hairStyle, eyeColor, hairTexture
   - regional NPC appearance pools
   - genetic child appearance
   - emoji skin modifiers + custom CSS avatar
   - barber changes hair only, never skin/origin
*/
(function(){
  const SKIN_MOD199 = {light:'🏻', lightMedium:'🏼', medium:'🏽', mediumDark:'🏾', dark:'🏿'};
  const REGION199 = {
    enkhuizen:{skin:[[0,22,58],[23,38,22],[39,58,10],[59,78,6],[79,100,4]], hair:{blond:34,brown:30,darkBrown:18,black:8,red:4,gray:2}, eyes:{blue:32,green:14,brown:42,gray:12}, origin:{northWestEurope:82,mediterranean:6,caribbean:4,eastAsian:3,westAfrica:3,other:2}},
    amsterdam:{skin:[[0,22,42],[23,38,24],[39,58,16],[59,78,10],[79,100,8]], hair:{blond:24,brown:28,darkBrown:20,black:18,red:3,gray:2}, eyes:{blue:24,green:10,brown:56,gray:10}, origin:{northWestEurope:58,mediterranean:10,caribbean:10,westAfrica:8,eastAsian:6,other:8}},
    spain:{skin:[[0,22,18],[23,38,38],[39,58,30],[59,78,10],[79,100,4]], hair:{black:34,darkBrown:32,brown:24,blond:6,red:1,gray:2}, eyes:{brown:72,green:10,blue:12,gray:6}, origin:{mediterranean:78,northWestEurope:8,northAfrica:5,caribbean:3,westAfrica:3,other:3}},
    america:{skin:[[0,22,38],[23,38,18],[39,58,15],[59,78,14],[79,100,15]], hair:{brown:24,darkBrown:24,black:24,blond:18,red:4,gray:2}, eyes:{brown:56,blue:24,green:9,gray:11}, origin:{northWestEurope:48,westAfrica:14,latinAmerica:14,eastAsian:7,mediterranean:7,caribbean:5,other:5}},
    japan:{skin:[[0,22,22],[23,38,50],[39,58,22],[59,78,5],[79,100,1]], hair:{black:78,darkBrown:17,brown:4,blond:1}, eyes:{brown:88,gray:6,blue:3,green:3}, origin:{eastAsian:88,northWestEurope:3,southEastAsian:4,other:5}},
    jamaica:{skin:[[0,22,2],[23,38,5],[39,58,15],[59,78,30],[79,100,48]], hair:{black:72,darkBrown:18,brown:7,blond:1,red:1,gray:1}, eyes:{brown:88,gray:5,green:4,blue:3}, origin:{caribbean:55,westAfrica:32,northWestEurope:5,latinAmerica:4,other:4}},
    nightcity:{skin:[[0,22,18],[23,38,18],[39,58,22],[59,78,20],[79,100,22]], hair:{black:38,darkBrown:20,brown:14,blond:8,red:5,gray:2,blue:5,pink:5,white:3}, eyes:{brown:50,blue:15,green:10,gray:15,cyber:10}, origin:{other:35,northWestEurope:20,eastAsian:15,westAfrica:12,caribbean:8,mediterranean:5,latinAmerica:5}}
  };
  const HAIR_STYLES199 = ['short','long','curly','wavy','buzz','fade','afro','dreads','braids','ponytail','bob'];
  const HAIR_COLORS199 = ['black','darkBrown','brown','blond','red','gray','white','blue','pink'];
  function rnd199(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function clamp199(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function pickW199(obj){
    const entries=Array.isArray(obj)?obj:Object.entries(obj||{});
    const total=entries.reduce((a,e)=>a+(Array.isArray(e)?e[1]:e.weight||0),0)||1;
    let r=Math.random()*total;
    for(const e of entries){const k=Array.isArray(e)?e[0]:e.key; const w=Array.isArray(e)?e[1]:e.weight||0; if((r-=w)<=0)return k}
    return Array.isArray(entries[0])?entries[0][0]:entries[0]?.key;
  }
  function normPlace199(x){
    x=(x||'').toString().toLowerCase();
    if(['usa','us','america','amerika','united_states','united states'].includes(x))return 'america';
    if(['japan','tokyo'].includes(x))return 'japan';
    if(['spain','spanje','alkmaar'].includes(x))return 'spain';
    if(['jamaica','kingston'].includes(x))return 'jamaica';
    if(['nightcity','night_city','night city','nc'].includes(x))return 'nightcity';
    if(['amsterdam'].includes(x))return 'amsterdam';
    return 'enkhuizen';
  }
  function skinBucket199(t){
    t=clamp199(t);
    if(t<=20)return 'light';
    if(t<=40)return 'lightMedium';
    if(t<=60)return 'medium';
    if(t<=80)return 'mediumDark';
    return 'dark';
  }
  function skinLabel199(t){
    t=clamp199(t);
    if(t<=20)return 'zeer lichte huid';
    if(t<=40)return 'lichte huid';
    if(t<=60)return 'getinte/lichtbruine huid';
    if(t<=80)return 'bruine huid';
    return 'donkere huid';
  }
  function hairLabel199(x){
    return {black:'zwart',darkBrown:'donkerbruin',brown:'bruin',blond:'blond',red:'rood',gray:'grijs',white:'wit',blue:'blauw geverfd',pink:'roze geverfd'}[x]||x||'bruin';
  }
  function styleLabel199(x){
    return {short:'kort',long:'lang',curly:'krullend',wavy:'golvend',buzz:'buzz cut',fade:'fade',afro:'afro',dreads:'dreads',braids:'vlechten',ponytail:'paardenstaart',bob:'bob'}[x]||x||'kort';
  }
  function eyeLabel199(x){
    return {blue:'blauwe ogen',green:'groene ogen',brown:'bruine ogen',gray:'grijze ogen',cyber:'cyberogen'}[x]||'bruine ogen';
  }
  function sampleSkin199(region){
    const pool=(REGION199[normPlace199(region)]||REGION199.enkhuizen).skin;
    const bands=pool.map((b,i)=>[i,b[2]]);
    const idx=pickW199(bands);
    const b=pool[idx]||pool[0];
    return rnd199(b[0],b[1]);
  }
  function sampleObj199(obj){return pickW199(obj)}
  function originMix199(region){
    const o=(REGION199[normPlace199(region)]||REGION199.enkhuizen).origin;
    return Object.assign({},o);
  }
  function gender199(p){
    const g=(p&&p.gender)||'';
    if(g==='male'||g==='female')return g;
    const n=((p&&p.name)||'').toLowerCase();
    if(/(a|e|i|y|anne|lotte|sofia|lisa|eva|maria|aiko|hana|sakura)$/.test(n))return 'female';
    return 'male';
  }
  function ageLook199(p){
    const a=(p&&p.age)||state?.age||20;
    if(a<13)return 'child';
    if(a<20)return 'teen';
    if(a<60)return 'adult';
    return 'elder';
  }
  function baseEmoji199(p){
    const g=gender199(p), a=(p&&p.age)||state?.age||20;
    if(g==='female'){
      if(a<13)return '👧'; if(a>=60)return '👵'; return '👩';
    }
    if(a<13)return '👦'; if(a>=60)return '👴'; return '👨';
  }
  function emoji199(p){
    const app=ensureAppearance199(p);
    const b=skinBucket199(app.skinTone);
    return baseEmoji199(p)+SKIN_MOD199[b];
  }
  function normalizeOrigin199(o){
    o=o||{};
    const total=Object.values(o).reduce((a,v)=>a+(+v||0),0)||1;
    const out={};
    Object.keys(o).forEach(k=>out[k]=Math.round((+o[k]||0)*100/total));
    return out;
  }
  function mixOrigin199(a,b){
    a=a||{}; b=b||{};
    const keys=new Set([...Object.keys(a),...Object.keys(b)]);
    const out={};
    keys.forEach(k=>out[k]=Math.round(((a[k]||0)+(b[k]||0))/2));
    return normalizeOrigin199(out);
  }
  function weightedParentTrait199(a,b,mutations){
    const pool={};
    if(a)pool[a]=(pool[a]||0)+45;
    if(b)pool[b]=(pool[b]||0)+45;
    (mutations||[]).forEach(m=>pool[m]=(pool[m]||0)+3);
    return sampleObj199(pool);
  }
  function randomHairStyle199(g,age){
    if(age<13)return sampleObj199({short:24,long:22,curly:18,wavy:18,bob:10,braids:8});
    if(g==='female')return sampleObj199({long:24,short:16,curly:14,wavy:16,bob:12,braids:8,ponytail:8,dreads:2});
    return sampleObj199({short:32,fade:22,buzz:14,curly:10,wavy:10,dreads:4,afro:5,long:3});
  }
  function generateAppearanceByRegion199(region, person){
    region=normPlace199(region);
    const cfg=REGION199[region]||REGION199.enkhuizen;
    const g=gender199(person||{});
    const age=(person&&person.age)||state?.age||20;
    const skinTone=sampleSkin199(region);
    const hairColor=sampleObj199(cfg.hair);
    const eyeColor=sampleObj199(cfg.eyes);
    const hairStyle=randomHairStyle199(g,age);
    return {skinTone,skinLabel:skinLabel199(skinTone),hairColor,hairStyle,hairTexture:hairStyle==='afro'?'coily':hairStyle==='curly'?'curly':hairStyle==='wavy'?'wavy':'straight',eyeColor,regionOrigin:region,originMix:originMix199(region),lockedSkin:true};
  }
  function generateChildAppearance199(parentA,parentB,child){
    const a=ensureAppearance199(parentA||{}), b=ensureAppearance199(parentB||{});
    const skinTone=clamp199(Math.round((a.skinTone+b.skinTone)/2)+rnd199(-10,10));
    const hairColor=weightedParentTrait199(a.hairColor,b.hairColor,['brown','darkBrown','black','blond','red']);
    const eyeColor=weightedParentTrait199(a.eyeColor,b.eyeColor,['brown','blue','green','gray']);
    const g=gender199(child||{});
    const age=(child&&child.age)||0;
    const naturalTexture=weightedParentTrait199(a.hairTexture,b.hairTexture,['straight','wavy','curly','coily']);
    const hairStyle=randomHairStyle199(g,age);
    return {skinTone,skinLabel:skinLabel199(skinTone),hairColor,hairStyle,hairTexture:naturalTexture,eyeColor,regionOrigin:'genetic',originMix:mixOrigin199(a.originMix,b.originMix),lockedSkin:true};
  }
  function ensureAppearance199(p, region){
    if(!p)return generateAppearanceByRegion199(region||state?.world||'enkhuizen',{});
    if(!p.appearance){
      const reg=region||p.place||p.city||p.metAt||p.from||state?.world||state?.placeId||'enkhuizen';
      p.appearance=generateAppearanceByRegion199(reg,p);
    }
    if(typeof p.appearance.skinTone!=='number')p.appearance.skinTone=sampleSkin199(p.appearance.regionOrigin||region||'enkhuizen');
    p.appearance.skinLabel=skinLabel199(p.appearance.skinTone);
    if(!p.appearance.hairColor)p.appearance.hairColor='brown';
    if(!p.appearance.hairStyle)p.appearance.hairStyle=randomHairStyle199(gender199(p),p.age||state?.age||20);
    if(!p.appearance.eyeColor)p.appearance.eyeColor='brown';
    if(!p.appearance.originMix)p.appearance.originMix=originMix199(p.appearance.regionOrigin||region||'enkhuizen');
    p.icon=emoji199.__rendering?p.icon:renderPersonEmoji199(p);
    return p.appearance;
  }
  function renderPersonEmoji199(p){
    try{emoji199.__rendering=true; return emoji199(p)}finally{emoji199.__rendering=false}
  }
  function appearanceText199(p){
    const a=ensureAppearance199(p);
    return `${skinLabel199(a.skinTone)} · ${hairLabel199(a.hairColor)} ${styleLabel199(a.hairStyle)} haar · ${eyeLabel199(a.eyeColor)}`;
  }
  function avatarHTML199(p, size='big'){
    const a=ensureAppearance199(p);
    const g=gender199(p);
    const age=ageLook199(p);
    return `<div class="ava199 ${size} skin-${skinBucket199(a.skinTone)} hair-${a.hairColor} style-${a.hairStyle} ${g} ${age}" title="${appearanceText199(p)}"><div class="ava199Face"><span class="ava199Eyes">${a.eyeColor==='cyber'?'◉':'• •'}</span><span class="ava199Mouth">⌣</span></div><div class="ava199Hair"></div></div>`;
  }
  function applyAppearanceToPeople199(){
    if(!state)return;
    const player={gender:state.gender||state.sex||'male',age:state.age,name:state.name,appearance:state.appearance};
    if(!state.appearance)state.appearance=generateAppearanceByRegion199(state.world||state.placeId||'enkhuizen',player);
    player.appearance=state.appearance;
    ensureAppearance199(player,state.world||'enkhuizen');
    state.appearance=player.appearance;
    if(state.mother){state.mother.gender='female';ensureAppearance199(state.mother,state.world||'enkhuizen')}
    if(state.father){state.father.gender='male';ensureAppearance199(state.father,state.world||'enkhuizen')}
    (state.siblings||[]).forEach(s=>{
      if(!s.appearance && state.mother && state.father)s.appearance=generateChildAppearance199(state.mother,state.father,s);
      ensureAppearance199(s,state.world||'enkhuizen');
    });
    (state.children||[]).forEach(ch=>{
      if(!ch.appearance){
        const other=state.partner||state.spouse||state.exPartner||{};
        ch.appearance=other.appearance?generateChildAppearance199(player,other,ch):generateAppearanceByRegion199(state.world||'enkhuizen',ch);
      }
      ensureAppearance199(ch,state.world||'enkhuizen');
    });
    if(state.partner)ensureAppearance199(state.partner,state.partner.place||state.world||'enkhuizen');
    (state.friends||[]).forEach(f=>ensureAppearance199(f,f.place||f.metAt||state.world||'enkhuizen'));
    (state.vacationContacts||[]).forEach(c=>ensureAppearance199(c,c.place||state.vacation||state.world||'amsterdam'));
  }
  window.generateAppearanceByRegion199=generateAppearanceByRegion199;
  window.generateChildAppearance199=generateChildAppearance199;
  window.ensureAppearance199=ensureAppearance199;
  window.renderPersonEmoji199=renderPersonEmoji199;
  window.renderPersonAvatar199=avatarHTML199;
  window.appearanceText199=appearanceText199;
  window.skinLabel199=skinLabel199;

  const oldHumanIcon199=window.humanIcon || (typeof humanIcon==='function'?humanIcon:null);
  window.humanIcon=function(g,a,p){
    if(p&&typeof p==='object')return renderPersonEmoji199(p);
    if(oldHumanIcon199)return oldHumanIcon199(g,a);
    if(g==='female'){if(a<13)return '👧'; if(a>=60)return '👵'; return '👩'}
    if(a<13)return '👦'; if(a>=60)return '👴'; return '👨';
  };
  try{humanIcon=window.humanIcon}catch(e){}

  function injectAppearanceCard199(html,p){
    try{
      if(!p)return html;
      if(String(html).includes('ava199'))return html;
      const card=`<div class="card ava199Card">${avatarHTML199(p)}<b>Uiterlijk</b><br>${appearanceText199(p)}<br><span class="mini">Huidtint is genetisch/regionaal. Kapper verandert alleen haar.</span></div>`;
      return String(html).replace('<div class="modalBody">',`<div class="modalBody">${card}`).replace('<div class="modalBody" style="text-align:left">',`<div class="modalBody" style="text-align:left">${card}`);
    }catch(e){return html}
  }

  const oldChildScreen199=window.childScreen || (typeof childScreen==='function'?childScreen:null);
  if(oldChildScreen199){
    window.childScreen=function(i){
      applyAppearanceToPeople199();
      const beforeShow=window.showModal;
      window.showModal=function(html){try{return beforeShow.call(this,injectAppearanceCard199(html,state.children&&state.children[i]))}finally{window.showModal=beforeShow;try{showModal=beforeShow}catch(e){}}};
      return oldChildScreen199.apply(this,arguments);
    };
    try{childScreen=window.childScreen}catch(e){}
  }
  const oldSiblingScreen199=window.siblingScreen || (typeof siblingScreen==='function'?siblingScreen:null);
  if(oldSiblingScreen199){
    window.siblingScreen=function(i){
      applyAppearanceToPeople199();
      const beforeShow=window.showModal;
      window.showModal=function(html){try{return beforeShow.call(this,injectAppearanceCard199(html,state.siblings&&state.siblings[i]))}finally{window.showModal=beforeShow;try{showModal=beforeShow}catch(e){}}};
      return oldSiblingScreen199.apply(this,arguments);
    };
    try{siblingScreen=window.siblingScreen}catch(e){}
  }
  const oldParentScreen199=window.parentScreen || (typeof parentScreen==='function'?parentScreen:null);
  if(oldParentScreen199){
    window.parentScreen=function(who){
      applyAppearanceToPeople199();
      const p=who==='mother'?state.mother:state.father;
      const beforeShow=window.showModal;
      window.showModal=function(html){try{return beforeShow.call(this,injectAppearanceCard199(html,p))}finally{window.showModal=beforeShow;try{showModal=beforeShow}catch(e){}}};
      return oldParentScreen199.apply(this,arguments);
    };
    try{parentScreen=window.parentScreen}catch(e){}
  }

  function barberTarget199(){
    state.appearance=state.appearance||generateAppearanceByRegion199(state.world||'enkhuizen',{gender:state.gender||'male',age:state.age,name:state.name});
    return {name:state.name||'Jij',age:state.age,gender:state.gender||state.sex||'male',appearance:state.appearance};
  }
  window.barberShop199=function(){
    const p=barberTarget199();
    const a=ensureAppearance199(p);
    let out=`<div class="card ava199Card">${avatarHTML199(p)}<b>Kapper</b><br>${appearanceText199(p)}<br><span class="mini">De kapper verandert kapsel/haarkleur. Huidtint, ogen en genetische afkomst blijven hetzelfde.</span></div>`;
    out+=`<div class="section">Kapsel</div>`;
    ['short','long','curly','wavy','buzz','fade','afro','dreads','braids','ponytail','bob'].forEach(st=>{
      out+=`<button class="btn" onclick="setHairStyle199('${st}')">✂️ ${styleLabel199(st)}</button>`;
    });
    out+=`<div class="section">Haarkleur</div>`;
    ['black','darkBrown','brown','blond','red','gray','white','blue','pink'].forEach(col=>{
      out+=`<button class="btn" onclick="setHairColor199('${col}')">🎨 ${hairLabel199(col)}</button>`;
    });
    out+=`<button class="btn alt" onclick="closeModal()">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">💈</div><div class="modalTitle">Kapper</div></div><div class="modalBody">${out}</div>`);
  };
  window.setHairStyle199=function(st){
    const cost=35;
    if((state.money||0)<cost){try{toast('Niet genoeg geld: €35')}catch(e){}return}
    state.money-=cost;
    state.appearance=state.appearance||generateAppearanceByRegion199(state.world||'enkhuizen',{gender:state.gender||'male',age:state.age});
    state.appearance.hairStyle=st;
    state.appearance.hairTexture=st==='afro'?'coily':st==='curly'?'curly':st==='wavy'?'wavy':state.appearance.hairTexture||'straight';
    try{applyStats({Looks:2,Happiness:1})}catch(e){}
    try{addLog(`<b>Kapper</b><br>Nieuw kapsel: ${styleLabel199(st)}.<br><span class="mini">Effect: Looks +2 · Happiness +1</span>`,'good',false)}catch(e){}
    try{safeSave();render()}catch(e){}
    barberShop199();
  };
  window.setHairColor199=function(col){
    const cost=(col==='blue'||col==='pink'||col==='white')?70:45;
    if((state.money||0)<cost){try{toast('Niet genoeg geld: '+cost)}catch(e){}return}
    state.money-=cost;
    state.appearance=state.appearance||generateAppearanceByRegion199(state.world||'enkhuizen',{gender:state.gender||'male',age:state.age});
    state.appearance.hairColor=col;
    try{applyStats({Looks:2,Happiness:1})}catch(e){}
    try{addLog(`<b>Kapper</b><br>Nieuwe haarkleur: ${hairLabel199(col)}.<br><span class="mini">Effect: Looks +2 · Happiness +1</span>`,'good',false)}catch(e){}
    try{safeSave();render()}catch(e){}
    barberShop199();
  };

  const oldChildNameConfirm199=window.confirmChildName198 || null;
  if(oldChildNameConfirm199){
    window.confirmChildName198=function(){
      const before=(state.children||[]).length;
      const res=oldChildNameConfirm199.apply(this,arguments);
      try{
        const after=(state.children||[]).length;
        if(after>before){
          const ch=state.children[after-1];
          const player=barberTarget199();
          if(ch && !ch.appearance){
            const partner=state.partner||state.spouse||{};
            ch.appearance=partner.appearance?generateChildAppearance199(player,partner,ch):generateAppearanceByRegion199(state.world||'enkhuizen',ch);
            ch.icon=renderPersonEmoji199(ch);
          }
        }
        applyAppearanceToPeople199(); safeSave();
      }catch(e){}
      return res;
    };
  }

  const oldRelationships199=window.relationshipsHTML || (typeof relationshipsHTML==='function'?relationshipsHTML:null);
  if(oldRelationships199){
    window.relationshipsHTML=function(){
      applyAppearanceToPeople199();
      let h=oldRelationships199.apply(this,arguments);
      try{
        const tmp=document.createElement('div'); tmp.innerHTML=String(h);
        (state.siblings||[]).forEach((p,i)=>{
          const el=[...tmp.querySelectorAll('.row')].find(x=>String(x.getAttribute('onclick')||'').includes(`siblingScreen(${i})`));
          if(el){const ico=el.querySelector('.rIco'); if(ico)ico.textContent=renderPersonEmoji199(p);}
        });
        (state.children||[]).forEach((p,i)=>{
          const el=[...tmp.querySelectorAll('.row')].find(x=>String(x.getAttribute('onclick')||'').includes(`childScreen(${i})`));
          if(el){const ico=el.querySelector('.rIco'); if(ico)ico.textContent=renderPersonEmoji199(p);}
        });
        const m=[...tmp.querySelectorAll('.row')].find(x=>String(x.getAttribute('onclick')||'').includes("parentScreen('mother')"));
        if(m&&state.mother){const ico=m.querySelector('.rIco'); if(ico)ico.textContent=renderPersonEmoji199(state.mother);}
        const f=[...tmp.querySelectorAll('.row')].find(x=>String(x.getAttribute('onclick')||'').includes("parentScreen('father')"));
        if(f&&state.father){const ico=f.querySelector('.rIco'); if(ico)ico.textContent=renderPersonEmoji199(state.father);}
        h=tmp.innerHTML;
      }catch(e){}
      return h;
    };
    try{relationshipsHTML=window.relationshipsHTML}catch(e){}
  }

  // Patch vacation/new contact creators when they exist: regional appearance for locals.
  const oldNewContact195=window.newContact195 || null;
  if(oldNewContact195){
    window.newContact195=function(place,source){
      const c=oldNewContact195.apply(this,arguments);
      try{c.appearance=generateAppearanceByRegion199(place,c); c.icon=renderPersonEmoji199(c)}catch(e){}
      return c;
    };
  }
  const oldVacationMeet191=window.vacationMeetPeople191 || null;
  if(oldVacationMeet191){
    window.vacationMeetPeople191=function(place){
      const before=(state.vacationContacts||[]).length;
      const res=oldVacationMeet191.apply(this,arguments);
      try{(state.vacationContacts||[]).slice(before).forEach(c=>{c.appearance=generateAppearanceByRegion199(place||c.place,c);c.icon=renderPersonEmoji199(c)})}catch(e){}
      return res;
    };
  }

  // Add barber row to activities if not already present.
  const oldActivities199=window.activitiesHTML || (typeof activitiesHTML==='function'?activitiesHTML:null);
  if(oldActivities199){
    window.activitiesHTML=function(){
      applyAppearanceToPeople199();
      let h=oldActivities199.apply(this,arguments);
      if(!String(h).includes('barberShop199')){
        const rowHtml=`<div class="section">Uiterlijk</div>${(typeof row==='function'?row('💈','Kapper','Kapsel of haarkleur wijzigen zonder huid/genetica te veranderen','barberShop199()'):`<button class="btn" onclick="barberShop199()">💈 Kapper</button>`)}`;
        h=String(h)+rowHtml;
      }
      return h;
    };
    try{activitiesHTML=window.activitiesHTML}catch(e){}
  }
  const oldMigrate199=window.migrate || (typeof migrate==='function'?migrate:null);
  if(oldMigrate199){
    window.migrate=function(s){
      const res=oldMigrate199.apply(this,arguments);
      try{state=res;applyAppearanceToPeople199()}catch(e){}
      return res;
    };
    try{migrate=window.migrate}catch(e){}
  }
  setTimeout(()=>{try{applyAppearanceToPeople199();safeSave();render()}catch(e){}},500);
})();
