
/* v22.1 Travel Activities In Main List + Return Home + Gender Sprite Fix
   - Current place DLC activities appear directly in Activities when travelling/living there
   - Vacation gets a clear "Terug naar huis" button
   - Fixes obvious female-name/male-sprite and male-name/female-sprite mismatches
*/
(function(){
  function exists221(name){
    try{return typeof window[name]==='function' || typeof eval(name)==='function'}catch(e){return false}
  }
  function rr221(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function section221(t){return `<div class="section">${t}</div>`}
  function card221(h){return `<div class="card">${h}</div>`}
  function modal221(icon,title,body){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  }
  function norm221(p){
    p=String(p||'').toLowerCase();
    if(['usa','us','america','amerika','united_states','united states'].includes(p))return 'america';
    if(p.includes('spain')||p.includes('spanje')||p.includes('barcelona'))return 'spain';
    if(p.includes('japan')||p.includes('tokyo'))return 'japan';
    if(p.includes('amsterdam'))return 'amsterdam';
    if(p.includes('jamaica'))return 'jamaica';
    if(p.includes('night'))return 'nightcity';
    if(p.includes('enkhuizen')||p.includes('nederland')||p.includes('nether')||p==='home'||p==='normal')return 'enkhuizen';
    return p||'enkhuizen';
  }
  function currentPlace221(){
    return norm221((state&&(state.vacation||state.world||state.placeId||state.city))||'enkhuizen');
  }
  function isVacation221(){return !!(state&&state.vacation)}
  function label221(p){
    p=norm221(p);
    return {enkhuizen:'Enkhuizen',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',amsterdam:'Amsterdam',jamaica:'Jamaica',nightcity:'Night City'}[p]||p;
  }
  function icon221(p){
    try{if(typeof flagIcon216==='function')return flagIcon216(norm221(p))}catch(e){}
    return {spain:'🇪🇸',america:'🇺🇸',japan:'🇯🇵',amsterdam:'🌉',jamaica:'🇯🇲',nightcity:'🌃',enkhuizen:'🏠'}[norm221(p)]||'🌍';
  }
  function high221(){
    return !!(state&&state.addiction&&(state.addiction.underInfluence||state.addiction.weedTrip||state.addiction.high||state.addiction.stoned||state.addiction.alcoholBuzz));
  }
  function saveRender221(){try{safeSave()}catch(e){}try{render()}catch(e){}}

  const ACT221={
    spain:[
      ['🥘','Tapas avond','tapas','Tapas, locals en social'],
      ['🏖️','Stranddag','beach','Zon, beach en ontspanning'],
      ['⚽','La Liga voetbal','football','Voetbal vibe en sport'],
      ['⛪','Barcelona sightseeing','culture','Cultuur en stad'],
      ['📚','Spaanse taalles','language','Taal en smarts'],
      ['🥊','Fight gym','gym','Training en stamina'],
      ['🏨','Tourism network','tourism','Werk/contacten'],
      ['🍹','Beach bar business','business','Business kans']
    ],
    america:[
      ['🍔','American Diner','diner','Eten, locals en sfeer'],
      ['🛣️','Roadtrip','road','Roadtrip en memories'],
      ['🎬','Hollywood / fame','hollywood','Fame en media'],
      ['🏟️','Live sports night','sports','Sportavond'],
      ['🥊','UFC Gym visit','ufc','MMA route'],
      ['🤼','WWE Performance Center','wwe','Wrestling route'],
      ['💼','Startup pitch','pitch','Business kans']
    ],
    japan:[
      ['🍜','Ramen route','ramen','Food en locals'],
      ['🕹️','Akihabara arcade','arcade','Arcade/social'],
      ['⛩️','Tempel / shrine','temple','Rust en cultuur'],
      ['🥋','Dojo training','dojo','Martial arts'],
      ['📚','Japanse taalles','language','Taal en smarts'],
      ['🏢','Werkcultuur netwerk','work','Business/contacten']
    ],
    amsterdam:[
      ['🌉','Grachten dag','canal','Walk, rondvaart of canal social'],
      ['🎪','Festival / event','festival','Music, foodtruck of creator meet'],
      ['🖼️','Museum / cultuur','museum','Smarts, content en rust'],
      ['📸','Creative content day','creative','Camera/media network en social groei'],
      ['🌃','Amsterdam uitgaan','nightlife','Drinken, flirten/daten, club, comedy of late snack']
    ],
    jamaica:[
      ['🏖️','Beach day','beach','Beach, locals en relaxation'],
      ['⛵','Boat trip','boat','Boottocht en memories'],
      ['⚽','Voetbal op strand','football','Sport/social'],
      ['🛍️','Local market','market','Souvenirs en contacts'],
      ['🏝️','Tour guide network','tourism','Tourism business']
    ],
    nightcity:[
      ['🌃','Neon walk','neon','Night streets en vibe'],
      ['🕶️','Meet fixer','fixer','Risk en contacts'],
      ['🥊','Underground fight pit','fight','Fight risk'],
      ['🦾','Cyber clinic','clinic','Cyberware/health']
    ]
  };
  const SHOP_PLACES221 = ['spain','america','japan','amsterdam','jamaica','nightcity'];

  window.travelReturnHome221=function(){
    if(!state||!state.vacation)return toast('Je bent niet op vakantie.');
    if(high221())return toast('Je bent onder invloed. Eerst uitrusten/ontnuchteren voor je veilig naar huis gaat.');
    const from=label221(state.vacation);
    const home=norm221(state.homeWorldBeforeVacation||state.homePlaceId||state.worldBeforeVacation||'enkhuizen');
    state.vacation=null;
    state.world=home;
    state.placeId=home;
    state.currentPlace=home;
    try{addLog(`<b>Terug naar huis</b><br>Ik ging terug naar huis vanaf ${from}.`, 'good', false)}catch(e){}
    try{applyStats({Happiness:2,Stamina:-4})}catch(e){}
    closeModal();
    saveRender221();
    toast('Je bent weer thuis.');
  };

  function travelRows221(place, direct=false){
    place=norm221(place);
    let h='';
    if(isVacation221()){
      h+=section221('Vakantie status');
      h+=rr221('🏠','Terug naar huis',`Ga terug naar ${label221(state.homeWorldBeforeVacation||'enkhuizen')}`,'travelReturnHome221()',high221());
      if(high221()&&exists221('soberUp180'))h+=rr221('💧','Uitrusten / ontnuchteren','Eerst helder worden voor je reist','soberUp180()');
    }
    if(ACT221[place]){
      h+=section221(`${label221(place)} activiteiten`);
      h+=ACT221[place].map(a=>{
        let fn = a[2]==='nightlife' ? `dlc187Nightlife('${place}')` : `vacationActivity196('${place}','${a[2]}')`;
        let locked = a[2]==='nightlife' ? !exists221('dlc187Nightlife') : !exists221('vacationActivity196');
        return rr221(a[0],a[1],a[3],fn,locked);
      }).join('');
      h+=section221(`${label221(place)} sociaal & shops`);
      h+=rr221('🍹','Nightlife / uitgaan','Drinken, lol, mensen ontmoeten, flirten en contacts',`dlc187Nightlife('${place}')`,!exists221('dlc187Nightlife'));
      h+=rr221('🛍️','Shops / souvenirs','Landitems, kleding, camera, collectibles',`dlc187Shop('${place}')`,!exists221('dlc187Shop')||!SHOP_PLACES221.includes(place));
      h+=rr221('📇','Contacten / romance','Appen, dates en vakantiecontacten',`vacationContactsScreen191('${place}')`,!exists221('vacationContactsScreen191'));
      h+=rr221(icon221(place),`${label221(place)} volledige DLC hub`,'Open alle DLC opties in popup',`vacationHub180('${place}')`,!exists221('vacationHub180'));
    }
    return h;
  }

  window.currentPlaceActivities221=function(){
    const place=currentPlace221();
    let h=card221(`<b>${label221(place)} activiteiten</b><br>${isVacation221()?'Je bent hier op vakantie.':'Je bent hier momenteel.'}<br>Alle relevante DLC/plaats-acties staan hier direct in de lijst.`);
    h+=travelRows221(place,true);
    modal221(icon221(place),`${label221(place)} activiteiten`,h);
  };

  const oldMaster221 = window.masterActivities204 || null;
  if(oldMaster221 && !oldMaster221.__travel221){
    window.masterActivities204=function(){
      let h=oldMaster221.apply(this,arguments);
      if(String(h).includes('Vastgezet'))return h;
      const place=currentPlace221();
      if(ACT221[place] && !String(h).includes('currentPlaceActivities221')){
        const block=section221(`${label221(place)} direct`) + rr221(icon221(place),`${label221(place)} activiteiten`,isVacation221()?'Alle vakantie/DLC acties + terug naar huis':'Alle lokale DLC acties direct zichtbaar','currentPlaceActivities221()');
        // Put high near the top, after "Activiteiten" if possible.
        h=String(h).replace(section221('Activiteiten'), section221('Activiteiten')+block);
      }
      return h;
    };
    window.masterActivities204.__travel221=true;
    window.activitiesHTML=function(){return window.masterActivities204()};
    try{activitiesHTML=window.activitiesHTML}catch(e){}
  }

  // Patch travel hub and DLC place hub so return home is visible there too.
  const oldTravelHub221 = window.travelWorldMasterHub204 || null;
  if(oldTravelHub221 && !oldTravelHub221.__travel221){
    window.travelWorldMasterHub204=function(){
      oldTravelHub221.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body && isVacation221() && !body.innerHTML.includes('travelReturnHome221')){
            const sec=document.createElement('div'); sec.className='section'; sec.textContent='Vakantie';
            const wrap=document.createElement('div');
            wrap.innerHTML=rr221('🏠','Terug naar huis',`Ga terug naar ${label221(state.homeWorldBeforeVacation||'enkhuizen')}`,'travelReturnHome221()',high221());
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(sec,alt||null);
            body.insertBefore(wrap.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.travelWorldMasterHub204.__travel221=true;
  }

  const oldDlcPlace221 = window.dlcPlaceMaster204 || null;
  if(oldDlcPlace221 && !oldDlcPlace221.__travel221){
    window.dlcPlaceMaster204=function(place){
      oldDlcPlace221.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          place=norm221(place);
          if(body && isVacation221() && state.vacation===place && !body.innerHTML.includes('travelReturnHome221')){
            const sec=document.createElement('div'); sec.className='section'; sec.textContent='Vakantie';
            const wrap=document.createElement('div');
            wrap.innerHTML=rr221('🏠','Terug naar huis',`Ga terug naar ${label221(state.homeWorldBeforeVacation||'enkhuizen')}`,'travelReturnHome221()',high221());
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(sec,alt||null);
            body.insertBefore(wrap.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.dlcPlaceMaster204.__travel221=true;
  }

  // Gender fix: obvious female/male name -> matching sprite gender.
  const FEMALE221 = new Set(('Anna Noor Lucy Romy Nienke Emi Lisa Eva Sophie Sofia Sara Sarah Emma Julia Mila Tess Lotte Sanne Lieke Lynn Fleur Laura Maud Yara Aiko Hana Sakura Maria Marieke Shanna Iris Nina Olivia Isabella Amy Emily Charlotte Chloe Zoey Roos Saar Femke Kim Jasmijn Esmee').toLowerCase().split(/\s+/));
  const MALE221 = new Set(('Jan Jayden Tygo Rens Stijn Victor Jason James Smit Daan Bram Sem Luuk Liam Noah Lucas Finn Mees Jesse Milan Thomas Tim Mark Mike David Peter Parker Mulder Vermeulen Bakker Boer Sander Ruben Levi Max Adam Sam Jack John').toLowerCase().split(/\s+/));

  function firstName221(name){
    return String(name||'').trim().split(/\s+/)[0].toLowerCase();
  }
  function inferGenderByName221(p){
    if(!p||!p.name)return null;
    const f=firstName221(p.name);
    if(FEMALE221.has(f))return 'female';
    if(MALE221.has(f))return 'male';
    // suffix fallback: Dutch-ish female names often end in a/e/y, but avoid too aggressive.
    if(/[ae]$/.test(f) && !['jayde','jaye','mike'].includes(f))return 'female';
    return null;
  }
  function fixPersonGender221(p, ctx=''){
    if(!p||typeof p!=='object')return;
    const guess=inferGenderByName221(p);
    if(guess && p.gender!==guess){
      p.gender=guess;
      p.genderFixedByName221=true;
    }
    try{
      if(typeof ensureAppearance199==='function')ensureAppearance199(p);
      if(typeof spriteHTML218==='function')p.icon=spriteHTML218(p,'md',ctx);
      else if(typeof renderPersonEmoji199==='function')p.icon=renderPersonEmoji199(p);
    }catch(e){}
  }
  function walkPeople221(){
    if(!state)return;
    if(state.mother){state.mother.gender='female';fixPersonGender221(state.mother,'mother')}
    if(state.father){state.father.gender='male';fixPersonGender221(state.father,'father')}
    ;['partner'].forEach(k=>{if(state[k])fixPersonGender221(state[k],k)});
    ;['children','siblings','friends','vacationContacts','flings','exes','colleagues'].forEach(k=>{
      if(Array.isArray(state[k]))state[k].forEach((p,i)=>fixPersonGender221(p,`${k}[${i}]`));
    });
    if(state.school){
      if(state.school.teacher){
        // Teachers should be adult; gender from title/name.
        const n=String(state.school.teacher.name||'').toLowerCase();
        if(/juf|mevrouw|mrs|miss/.test(n))state.school.teacher.gender='female';
        else if(/meester|meneer|mr/.test(n))state.school.teacher.gender='male';
        fixPersonGender221(state.school.teacher,'teacher');
      }
      if(Array.isArray(state.school.classmates))state.school.classmates.forEach((p,i)=>fixPersonGender221(p,`classmate[${i}]`));
    }
  }
  window.fixGenderSprites221=function(){
    walkPeople221();
    try{safeSave()}catch(e){}
    try{render()}catch(e){}
  };

  const oldRender221=window.render || (typeof render==='function'?render:null);
  if(oldRender221 && !oldRender221.__gender221){
    window.render=function(){
      try{walkPeople221()}catch(e){}
      return oldRender221.apply(this,arguments);
    };
    window.render.__gender221=true;
    try{render=window.render}catch(e){}
  }

  const oldSafeSave221=window.safeSave || (typeof safeSave==='function'?safeSave:null);
  if(oldSafeSave221 && !oldSafeSave221.__gender221){
    window.safeSave=function(){
      try{walkPeople221()}catch(e){}
      return oldSafeSave221.apply(this,arguments);
    };
    window.safeSave.__gender221=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  window.travelGenderDebug221=function(){
    walkPeople221();
    const place=currentPlace221();
    let h=card221(`<b>Travel/Gender debug</b><br>Current place: ${label221(place)}<br>Vacation: ${state.vacation||'nee'}<br>Home: ${label221(state.homeWorldBeforeVacation||'enkhuizen')}`);
    h+=card221(`<b>Gender fixes</b><br>Vrouwennamen/mannennamen worden nu gecontroleerd voor sprite-gender. Gebruik fixGenderSprites221() om save direct te repareren.`);
    h+=travelRows221(place);
    modal221('🛠️','Travel/Gender Debug',h);
  };

  setTimeout(()=>{try{walkPeople221(); if(typeof safeSave==='function')safeSave(); if(typeof render==='function')render();}catch(e){}},300);
})();
