
/* v22.0 Original Activities Restore + Age Hubs
   Restores original app.js activities that became hidden after the master Activities sorting.
   Keeps clean categories and avoids restoring old duplicate combat/DLC/business rows.
*/
(function(){
  function exists220(name){
    try{return typeof window[name]==='function' || typeof eval(name)==='function'}catch(e){return false}
  }
  function call220(name,args){
    args=args||[];
    try{
      const fn=window[name] || eval(name);
      if(typeof fn==='function') return fn.apply(null,args);
    }catch(e){console.warn('[v22.0 call]',name,e)}
    try{toast('Functie niet gevonden: '+name)}catch(e){}
  }
  window.call220=call220;

  function rr220(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}">
        <div class="rIco">${icon}</div><div><div class="rTitle">${title}</div>
        <div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function section220(t){return `<div class="section">${t}</div>`}
  function card220(h){return `<div class="card">${h}</div>`}
  function modal220(icon,title,body){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  }
  function age220(){return (state&&state.age)||0}
  function inNormalWorld220(){
    return !!state && !state.vacation && state.world!=='nightcity' && !(state.jail&&state.jail.yearsLeft>0);
  }
  function hasCars220(){return !!(state&&state.cars&&state.cars.length)}
  function hasHome220(){try{return typeof hasHome==='function'?hasHome():!!(state&&state.houses&&state.houses.length)}catch(e){return !!(state&&state.houses&&state.houses.length)}}

  window.freeTimeOutingsHub220=function(){
    let h=card220(`<b>Vrije tijd & Uitgaan</b><br>Normale wereld activiteiten die eerder uit het hoofdmenu verdwenen waren. Vakantie-nightlife blijft onder Reizen & Wereld.`);
    h+=section220('Sociaal / vrije tijd');
    h+=rr220('🛋️','Chillen met vrienden',age220()>=10?'Hangen, gamen of soms risico nemen':'Vanaf 10 jaar','chillWithFriendsScreen()',age220()<10||!exists220('chillWithFriendsScreen'));
    h+=rr220('📱','Social media',age220()>=10?'Scrollen, posten, volgers en virals':'Vanaf 10 jaar','socialMedia()',age220()<10||!exists220('socialMedia'));
    h+=rr220('🚶','Walk / Wandelen',age220()>=8?'Wandelen, park/wijk en random encounters':'Vanaf 8 jaar','walkScreen()',age220()<8||!exists220('walkScreen'));
    h+=rr220('🏡','Thuis activiteiten',hasHome220()?'Chillen, house party, schoonmaken en relaxen':'Eerst eigen woning nodig','homeLifeScreen()',!hasHome220()||!exists220('homeLifeScreen'));
    h+=section220('Uitgaan');
    h+=rr220('🌃','Uitgaan met vrienden',age220()>=16?'Clubs, drinken, flirten, lol en risico':'Vanaf 16 jaar','goOutWithFriends()',age220()<16||!exists220('goOutWithFriends'));
    h+=rr220('❤️','Love / Dating',age220()>=16?'Date, dating app, hook up en relaties':'Vanaf 16 jaar','loveScreen()',age220()<16||!exists220('loveScreen'));
    h+=section220('Vakantie classic');
    h+=rr220('✈️','Vakantie classic','Originele gewone vakantie-opties naast de DLC-wereldkaart','vacation()',!exists220('vacation')||((state.money||0)<500));
    modal220('🌃','Vrije tijd & Uitgaan',h);
  };

  window.streetRiskHub220=function(){
    let h=card220(`<b>Straat & Risico</b><br>Hier staan de normale wereld risico-functies terug. Geen combat/DLC/business duplicaten.`);
    h+=section220('Straat');
    h+=rr220('🧱','De Gekke Steeg',age220()>=16?'Rare encounters, mini-games en rewards':'Vanaf 16 jaar','gekkeSteegScreen()',age220()<16||!exists220('gekkeSteegScreen')||!inNormalWorld220());
    h+=rr220('😈','Crime',age220()>=14?'Kleine criminaliteit, risico en gevolgen':'Vanaf 14 jaar','crimeScreen()',age220()<14||!exists220('crimeScreen'));
    h+=rr220('🥊','Fight / straatruzie','Random fight en tactical fight routes staan onder Sport & Combat, crime blijft hier','crimeScreen()',age220()<14||!exists220('crimeScreen'));
    h+=section220('Gokken / risico');
    h+=rr220('🎰','Casino',age220()>=18?'Gokken met risico':'Vanaf 18 jaar','casinoScreen()',age220()<18||!exists220('casinoScreen'));
    if(exists220('gamble')) h+=rr220('🎲','Gamble quick','Snelle gokactie / fallback','gamble()',age220()<18);
    h+=section220('Night City');
    if(state&&state.world==='nightcity'){
      h+=rr220('🌌','Night City uitgaan','Clubs, fixers en gevaarlijke nightlife','ncClubScreen()',!exists220('ncClubScreen'));
      h+=rr220('🚨','Night City danger','Straatrisico en overvallen','ncDangerEncounter()',!exists220('ncDangerEncounter'));
    }else{
      h+=rr220('🌃','Verhuis naar Night City',age220()>=21&&!state.job?'Nieuwe start na werkloosheid':'Alleen 21+ en werkloos','showNightCityOffer("werkloosheid")',!(age220()>=21&&!state.job)||state.world==='nightcity'||!exists220('showNightCityOffer'));
    }
    modal220('🧱','Straat & Risico',h);
  };

  window.substancesRecoveryHub220=function(){
    let h=card220(`<b>Middelen & Herstel</b><br>Coffeeshop/jonko, alcohol/drugs-risico en herstel staan hier overzichtelijk bij elkaar.`);
    h+=section220('Gebruik / uitgaan');
    h+=rr220('☕','Coffeeshop',age220()>=18?'Coffee of joint kopen':'Vanaf 18 jaar','coffeeshopScreen()',age220()<18||!exists220('coffeeshopScreen'));
    h+=rr220('🚬','Chillen: drugs gebruiken',age220()>=16?'Via vrienden chillen, met risico':'Vanaf 16 jaar','chillWithFriendsScreen()',age220()<16||!exists220('chillWithFriendsScreen'));
    h+=rr220('🌃','Uitgaan / alcohol',age220()>=16?'Clubs met drink/lol/flirt opties':'Vanaf 16 jaar','goOutWithFriends()',age220()<16||!exists220('goOutWithFriends'));
    if(exists220('weedShop146')) h+=rr220('🌿','Wiet shop / trip mode','Extra weed-items en trip mode','weedShop146()',age220()<18);
    h+=section220('Herstel');
    h+=rr220('🫂','Afkickkliniek / AA meeting','Hulp bij alcohol, drugs of wiet','recoveryClinicScreen()',!exists220('recoveryClinicScreen'));
    h+=rr220('🏥','Hospital / Injury','Herstellen van zware schade / trauma','hospitalScreen()',!exists220('hospitalScreen'));
    h+=rr220('🧠','Mental Health','Stress, trauma, therapie en rust','mentalHealthScreen()',!exists220('mentalHealthScreen'));
    modal220('☕','Middelen & Herstel',h);
  };

  window.mobilityCarsHub220=function(){
    let h=card220(`<b>Auto & Mobiliteit</b><br>Rijbewijs, auto kopen, rijden, racen en wandelen/fietsen staan hier.`);
    h+=section220('Rijbewijs');
    h+=rr220('🚗','Driving Test',age220()>=18?(state.license?'Rijbewijs gehaald':'Rijbewijs halen vanaf 18'):'Vanaf 18 jaar','drivingTest()',age220()<18||!!state.license||!exists220('drivingTest'));
    h+=section220('Auto');
    h+=rr220('🛒','Auto kopen',state.license?'Koop een auto als je geld hebt':'Eerst rijbewijs halen','buyCarScreen()',!state.license||!exists220('buyCarScreen'));
    if(hasCars220()){
      (state.cars||[]).forEach((c,i)=>{
        h+=rr220(c.icon||'🚘',c.name||('Auto '+(i+1)),'Rondje rijden, skills of racen',`carLifeScreen(${i})`,!exists220('carLifeScreen'));
      });
    }else{
      h+=card220(state.license?'Je hebt nog geen auto. Koop er één via Auto kopen.':'Je hebt nog geen rijbewijs/auto.');
    }
    h+=section220('Buiten bewegen');
    h+=rr220('🚶','Walk / Wandelen',age220()>=8?'Park, wijk en encounters':'Vanaf 8 jaar','walkScreen()',age220()<8||!exists220('walkScreen'));
    if(exists220('rideBike')) h+=rr220('🚲','Fietsen','Rondje fietsen als je fiets hebt','rideBike()');
    modal220('🚗','Auto & Mobiliteit',h);
  };

  window.moneySideHustleRestoreHub220=function(){
    let h=card220(`<b>Geld extra</b><br>Side hustle en oude geld/asset routes die niet dubbel zijn.`);
    h+=section220('Klein geld');
    h+=rr220('💰','Bijbaan / side hustle',age220()>=15?'Extra geld verdienen naast school/werk':'Vanaf 15 jaar','sideHustle()',age220()<15||!exists220('sideHustle'));
    h+=rr220('📱','Social media geld/fame',age220()>=10?'Posten, volgers en soms geld bij viral':'Vanaf 10 jaar','socialMedia()',age220()<10||!exists220('socialMedia'));
    h+=section220('Assets');
    h+=rr220('🚗','Auto kopen / beheren','Rijbewijs, auto, rijden en racen','mobilityCarsHub220()');
    h+=rr220('🏠','Thuis / woning acties',hasHome220()?'House party, schoonmaken, relaxen':'Eerst woning nodig','homeLifeScreen()',!hasHome220()||!exists220('homeLifeScreen'));
    modal220('💰','Geld extra',h);
  };

  // Patch existing master Activities list with restored original hubs.
  const oldMaster220 = window.masterActivities204 || null;
  if(oldMaster220 && !oldMaster220.__restore220){
    window.masterActivities204=function(){
      let h=oldMaster220.apply(this,arguments);

      // If jail, vacation, or night city special activities are active, keep existing special handling but still allow relevant hubs if master displayed.
      if(String(h).includes('Vastgezet')) return h;

      // Insert restored category after main section.
      const block =
        section220('Originele activiteiten terug')+
        rr220('🌃','Vrije tijd & Uitgaan','Chillen, social media, wandelen, thuis, uitgaan, love en vakantie classic','freeTimeOutingsHub220()')+
        rr220('🧱','Straat & Risico','De Gekke Steeg, crime, casino en Night City risico','streetRiskHub220()')+
        rr220('☕','Middelen & Herstel','Coffeeshop/jonko, alcohol/drugs-risico, afkickkliniek, hospital','substancesRecoveryHub220()')+
        rr220('🚗','Auto & Mobiliteit','Rijbewijs, auto kopen, rijden, racen, wandelen/fietsen','mobilityCarsHub220()');

      if(!String(h).includes('freeTimeOutingsHub220')){
        h = String(h).replace(section220('Activiteiten'), section220('Activiteiten') + block);
      }
      return h;
    };
    window.masterActivities204.__restore220=true;
    window.activitiesHTML=function(){return window.masterActivities204()};
    try{activitiesHTML=window.activitiesHTML}catch(e){}
  }

  // Patch Money hub with side hustle and auto extra routes.
  const oldMoney220 = window.moneyLifestyleMasterHub204 || null;
  if(oldMoney220 && !oldMoney220.__restore220){
    window.moneyLifestyleMasterHub204=function(){
      oldMoney220.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body && !body.innerHTML.includes('moneySideHustleRestoreHub220')){
            const sec=document.createElement('div');
            sec.className='section';
            sec.textContent='Extra geld & assets';
            const btn=document.createElement('div');
            btn.innerHTML = rr220('💰','Side hustle / social / auto','Herstelde originele geld- en asset routes','moneySideHustleRestoreHub220()');
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(sec,alt||null);
            body.insertBefore(btn.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.moneyLifestyleMasterHub204.__restore220=true;
  }

  // Patch Health hub with substances/herstel shortcut.
  const oldHealth220 = window.healthLooksHub204 || null;
  if(oldHealth220 && !oldHealth220.__restore220){
    window.healthLooksHub204=function(){
      oldHealth220.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body && !body.innerHTML.includes('substancesRecoveryHub220')){
            const sec=document.createElement('div');
            sec.className='section';
            sec.textContent='Middelen & herstel';
            const btn=document.createElement('div');
            btn.innerHTML=rr220('☕','Coffeeshop / herstel','Coffeeshop, uitgaan, afkickkliniek, hospital','substancesRecoveryHub220()');
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(sec,alt||null);
            body.insertBefore(btn.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.healthLooksHub204.__restore220=true;
  }

  window.originalActivitiesReport220=function(){
    const found=[
      ['🌃','Uitgaan met vrienden','goOutWithFriends()',exists220('goOutWithFriends'),'Vrije tijd & Uitgaan / Middelen & Herstel'],
      ['🧱','De Gekke Steeg','gekkeSteegScreen()',exists220('gekkeSteegScreen'),'Straat & Risico'],
      ['☕','Coffeeshop / joint','coffeeshopScreen()',exists220('coffeeshopScreen'),'Middelen & Herstel'],
      ['🫂','Afkickkliniek / AA','recoveryClinicScreen()',exists220('recoveryClinicScreen'),'Middelen & Herstel'],
      ['🚗','Driving Test','drivingTest()',exists220('drivingTest'),'Auto & Mobiliteit'],
      ['🛒','Auto kopen','buyCarScreen()',exists220('buyCarScreen'),'Auto & Mobiliteit'],
      ['🚘','Auto rijden/racen','carLifeScreen()',exists220('carLifeScreen'),'Auto & Mobiliteit'],
      ['🚶','Walk / Wandelen','walkScreen()',exists220('walkScreen'),'Vrije tijd / Auto & Mobiliteit'],
      ['💰','Side Hustle','sideHustle()',exists220('sideHustle'),'Geld extra'],
      ['📱','Social media','socialMedia()',exists220('socialMedia'),'Vrije tijd / Geld extra'],
      ['🎰','Casino','casinoScreen()',exists220('casinoScreen'),'Straat & Risico'],
      ['🏥','Hospital / Injury','hospitalScreen()',exists220('hospitalScreen'),'Middelen & Herstel'],
      ['🏡','Thuis activiteiten','homeLifeScreen()',exists220('homeLifeScreen'),'Vrije tijd & Uitgaan'],
      ['✈️','Vakantie classic','vacation()',exists220('vacation'),'Vrije tijd & Uitgaan']
    ];
    let h=card220('<b>Controle originele activiteiten</b><br>Deze functies zaten nog in app.js, maar waren door master-sortering te ver verstopt. Ze zijn nu opnieuw onder goede categorieën gezet.');
    h+=found.map(x=>card220(`${x[3]?'✅':'❌'} ${x[0]} <b>${x[1]}</b><br><span class="mini">${x[2]} → ${x[4]}</span>`)).join('');
    modal220('🛠️','Original Activities Report',h);
  };

  // Add report into Legacy/Debug hub
  const oldLegacy220 = window.legacyStatusMasterHub204 || null;
  if(oldLegacy220 && !oldLegacy220.__restore220){
    window.legacyStatusMasterHub204=function(){
      oldLegacy220.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body && !body.innerHTML.includes('originalActivitiesReport220')){
            const btn=document.createElement('button');
            btn.className='btn';
            btn.setAttribute('onclick','originalActivitiesReport220()');
            btn.innerHTML='🛠️ Controle originele activiteiten<br><span class="mini">Uitgaan, Gekke Steeg, auto, rijbewijs, casino, coffeeshop enz.</span>';
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(btn,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.legacyStatusMasterHub204.__restore220=true;
  }

  setTimeout(()=>{try{if(typeof render==='function')render();}catch(e){}},250);
})();
