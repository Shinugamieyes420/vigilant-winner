
/* v20.4 Activities Master Router + Original BitzLife Style
   One clean Activities list. Old patch functions stay available, but the main list is controlled here.
   Hubs use original row/section/card/modal style.
*/
(function(){
  function exists204(name){try{return typeof window[name]==='function' || typeof eval(name)==='function'}catch(e){return false}}
  function callName204(name,args){
    args=args||[];
    try{
      const fn=window[name] || eval(name);
      if(typeof fn==='function')return fn.apply(null,args);
    }catch(e){console.warn('[v20.4 call]',name,e)}
    try{toast('Nog niet beschikbaar: '+name)}catch(e){alert('Nog niet beschikbaar: '+name)}
  }
  window.call204=callName204;

  function rr204(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}">
        <div class="rIco">${icon}</div>
        <div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div>
        <div class="chev">›</div>
      </div>`;
    }
  }
  function section204(t){return `<div class="section">${t}</div>`}
  function card204(h){return `<div class="card">${h}</div>`}
  function age204(){return (state&&state.age)||0}
  function locked204(min){return age204()<min}
  function money204(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function place204(){return (state&&(state.vacation||state.placeId||state.world||state.currentPlace))||'enkhuizen'}
  function placeLabel204(p){
    p=(p||'').toString().toLowerCase();
    return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',spanje:'Spanje',america:'Amerika / USA',usa:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City','night city':'Night City'}[p] || p || 'Enkhuizen';
  }
  function safeModal204(icon,title,body){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  }

  window.masterActivities204=function(){
    let h='';
    if(state&&state.jail&&state.jail.yearsLeft>0){
      h+=section204('Vastgezet');
      h+=card204(`<b>${state.jail.facility||'Gevangenis'}</b><br>Reden: ${state.jail.reason||'onbekend'}<br>Nog ${state.jail.yearsLeft} jaar.`);
      h+=rr204('🍽️','Cafeteria','Praat met anderen en houd jezelf rustig','jailAction("cafeteria")',!exists204('jailAction'));
      h+=rr204('😢','Alles eruit laten','Mentale ontlading','jailAction("cry")',!exists204('jailAction'));
      h+=rr204('🏥','Infirmary','Medische hulp','jailAction("infirmary")',!exists204('jailAction'));
      h+=rr204('✉️','Brief naar huis','Contact houden','jailAction("letter")',!exists204('jailAction'));
      h+=rr204('🛠️','Gevangenis werk','Kleine betaling en routine','jailAction("work")',!exists204('jailAction'));
      h+=rr204('🏃','Ontsnappen','Groot risico','jailAction("escape")',!exists204('jailAction'),'red');
      return h;
    }
    h+=section204('Activiteiten');
    h+=rr204('🎓','Werk & School','Opleiding, baan, sollicitaties en carrière','workSchoolHub204()');
    h+=rr204('💪','Gezondheid & Uiterlijk','Gym, dokter, mental health en kapper','healthLooksHub204()');
    h+=rr204('👨‍👩‍👧','Relaties & Familie','Ouders, kinderen, partner, vrienden en groepsgesprekken','familySocialHub204()');
    h+=rr204('💰','Geld & Lifestyle','Huis, shopping, investeren, business en leningen','moneyLifestyleMasterHub204()');
    h+=rr204('🌍','Reizen & Wereld','Wereldkaart, vakantie, DLC landen en nightlife','travelWorldMasterHub204()');
    h+=rr204('🥊','Sport & Combat','Football, amateur, pro, UFC, GLORY, WWE en rankings','sportCombatMasterHub204()');
    h+=rr204('🐾','Huisdieren','Dierenasiel, fokkers, pet store, verzorging en risico','petsMasterHub204()');
    h+=rr204('🚔','Crime & Risico','Crime, justice, dierenhandel-gevolgen en familie-risico','crimeRiskMasterHub204()');
    h+=rr204('🌳','Legacy & Status','Family tree, achievements, life goals, death legacy en debug','legacyStatusMasterHub204()');
    return h;
  };
  window.activitiesHTML=function(){return window.masterActivities204()};
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  window.workSchoolHub204=function(){
    let h=card204('<b>Werk & School</b><br>Alles rond opleiding, baan, carrière en planning staat hier. Geen losse dubbele Work/Education rijen meer.');
    h+=section204('School & opleiding');
    h+=rr204('🎓','Education','School, MBO/HBO/uni, studie en schoolacties','educationScreen()',!exists204('educationScreen'));
    if(exists204('schoolScreen'))h+=rr204('🏫','School / klas','Klasgenoten, leraar en schoolacties','schoolScreen()');
    h+=section204('Werk');
    h+=rr204('💼','Work','Baan zoeken, werken, ontslag en carrière','workScreen()',!exists204('workScreen'));
    if(exists204('careerHub173'))h+=rr204('📈','Carrière progressie','Performance, promotie, stress en reputatie','careerHub173()');
    if(exists204('timeSystemHub176'))h+=rr204('🕒','Tijdschema / uren','Uren, stress en weekindeling','timeSystemHub176()');
    safeModal204('🎓','Werk & School',h);
  };

  window.healthLooksHub204=function(){
    let h=card204('<b>Gezondheid & Uiterlijk</b><br>Health, stamina, looks en mentale status staan op één plek.');
    h+=section204('Gezondheid');
    h+=rr204('💪','Gym / Sport basis','Fitness, stamina en health trainen','gymScreen()',!exists204('gymScreen'));
    if(exists204('doctorScreen'))h+=rr204('🏥','Dokter','Ziekte, behandeling en check-ups','doctorScreen()');
    if(exists204('mentalHealthScreen'))h+=rr204('🧠','Mental Health','Stress, trauma, burn-out en herstel','mentalHealthScreen()');
    h+=section204('Uiterlijk');
    h+=rr204('💈','Kapper','Kapsel/haarkleur wijzigen; huid/genetica blijft gelijk','barberShop199()',!exists204('barberShop199'));
    if(exists204('appearanceProfile199'))h+=rr204('🧬','Appearance profiel','Genetisch uiterlijk en avatar bekijken','appearanceProfile199()');
    safeModal204('💪','Gezondheid & Uiterlijk',h);
  };

  window.familySocialHub204=function(){
    let h=card204('<b>Relaties & Familie</b><br>Ouders, kinderen, partner, vrienden, groepsgesprekken en familie-risico bij elkaar.');
    h+=section204('Familie');
    if(state&&state.mother)h+=rr204(state.mother.icon||'👩','Moeder',`${state.mother.name||'Moeder'} · relatie ${state.mother.rel||50}%`,"parentScreen('mother')",!exists204('parentScreen'));
    if(state&&state.father)h+=rr204(state.father.icon||'👨','Vader',`${state.father.name||'Vader'} · relatie ${state.father.rel||50}%`,"parentScreen('father')",!exists204('parentScreen'));
    if(state&&(state.children||[]).length)h+=(state.children||[]).map((c,i)=>rr204(c.icon||'🧒',c.name||'Kind',`${c.age||0} jaar · relatie ${c.rel||50}%`,`childScreen(${i})`,!exists204('childScreen'))).join('');
    if(state&&(state.siblings||[]).length)h+=(state.siblings||[]).map((s,i)=>rr204(s.icon||'🧑',s.name||'Broer/zus',`${s.role||'familie'} · ${s.age||0} jaar`,`siblingScreen(${i})`,!exists204('siblingScreen'))).join('');
    h+=section204('Sociaal');
    if(exists204('relationshipsScreen'))h+=rr204('📒','Relaties overzicht','Alle relaties bekijken','relationshipsScreen()');
    if(exists204('groupTalkHub184'))h+=rr204('💬','Groepsgesprekken','Gezin, ouders, vrienden, iedereen check-in','groupTalkHub184()');
    if(exists204('dateScreen'))h+=rr204('❤️','Dating / partner','Dates, relatie en liefde','dateScreen()');
    h+=section204('Familie-risico');
    h+=rr204('🏚️','Familie-financiën','Oudersteun, fietsen, faillissement en verhuizing','parentBankruptcyInfo201()',!exists204('parentBankruptcyInfo201'));
    if(state&&state.orphanMode201)h+=rr204('🧒','Wees mode','Jeugdzorg, pleeggezin en gevolgen','orphanModeScreen201()',!exists204('orphanModeScreen201'));
    safeModal204('👨‍👩‍👧','Relaties & Familie',h);
  };

  window.moneyLifestyleMasterHub204=function(){
    let h=card204(`<b>Geld & Lifestyle</b><br>Cash: ${money204((state&&state.money)||0)}<br>Business en investeren zijn vanaf 18 jaar.`);
    h+=section204('Lifestyle');
    h+=rr204('💰','Money & Lifestyle hub','Shopping, huis-upgrades, leningen, investeren en business','moneyLifestyleHub165()',!exists204('moneyLifestyleHub165'));
    if(exists204('houseUpgradeHub165'))h+=rr204('🏠','Huis & kamer-upgrades','Kamerupgrades, meubels en woningwaarde','houseUpgradeHub165()');
    if(exists204('shoppingHub165'))h+=rr204('🛍️','Shopping','Kleding, items en lifestyle aankopen','shoppingHub165()');
    h+=section204('18+ geldsystemen');
    h+=rr204('📈','Investeren','Indexfonds, crypto, vastgoedfonds en risico-investeringen','investmentHub165()',!exists204('investmentHub165')||locked204(18));
    h+=rr204('🏪','Eigen business','Webshop, snackbar, gym, gamestudio en andere bedrijven','businessHub165()',!exists204('businessHub165')||locked204(18));
    if(exists204('businessScreen'))h+=rr204('🏬','Business classic','Oude business functie, gekoppeld onder geld','businessScreen()',locked204(18));
    if(exists204('loansHub165'))h+=rr204('💳','Leningen & schulden','Lenen, aflossen en schuldbeheer','loansHub165()');
    safeModal204('💰','Geld & Lifestyle',h);
  };

  const DLC_PLACES_204=[
    ['🇪🇸','Spanje','spain','Tapas, strand, La Liga, business en nightlife'],
    ['🇺🇸','Amerika / USA','america','Roadtrip, diner, Hollywood, UFC/WWE en business'],
    ['🇯🇵','Japan / Tokyo','japan','Ramen, arcade, tempel, dojo en werkcultuur'],
    ['🌉','Amsterdam','amsterdam','Grachten, festival, museum, creatief en media'],
    ['🇯🇲','Jamaica','jamaica','Beach, boat trip, reggae, markt en tourism'],
    ['🌃','Night City','nightcity','Neon, fixer, fight pit, cyber clinic en risico']
  ];

  window.travelWorldMasterHub204=function(){
    const current=place204();
    let h=card204(`<b>Reizen & Wereld</b><br>Huidige locatie: ${placeLabel204(current)}<br>DLC's zijn hier per land en type netjes geordend.`);
    h+=section204('Wereld');
    h+=rr204('🌍','Wereldkaart','Landen, verhuizen, vakantie en wereldkaart','worldMapScreen174()',!exists204('worldMapScreen174'));
    if(exists204('worldMapScreen'))h+=rr204('🗺️','Wereldkaart classic','Oude wereldkaart fallback','worldMapScreen()');
    h+=section204('Vakantie / huidige locatie');
    h+=rr204('🏖️','Huidige vakantie hub',`Open hub voor ${placeLabel204(current)}` ,`vacationHub180('${current}')`,!exists204('vacationHub180'));
    h+=rr204('📇','Vakantie contacten','Mensen die je op vakantie hebt ontmoet',`vacationContactsScreen191('${current}')`,!exists204('vacationContactsScreen191'));
    h+=section204('DLC landen');
    h+=DLC_PLACES_204.map(p=>rr204(p[0],p[1],p[3],`dlcPlaceMaster204('${p[2]}')`)).join('');
    safeModal204('🌍','Reizen & Wereld',h);
  };

  window.dlcPlaceMaster204=function(place){
    const rec=DLC_PLACES_204.find(x=>x[2]===place)||['🌍',place,place,''];
    let h=card204(`<b>${rec[1]}</b><br>${rec[3]}<br><br>Alles van deze DLC staat hier: basis hub, originele activiteit-logica, nightlife, shops en contacten.`);
    h+=section204('DLC hub');
    h+=rr204(rec[0],`${rec[1]} hub`,'Alle land-specifieke opties openen',`vacationHub180('${place}')`,!exists204('vacationHub180'));
    if(exists204('placeDetailScreen174'))h+=rr204('📍','Plaats detail','Info, reizen/verhuizen en lokale systemen',`placeDetailScreen174('${place}')`);
    h+=section204('Activiteiten');
    h+=rr204('🎲','Originele activiteit-logica','Keuze-menu’s met kans, kosten, contact, item of fail',`dlcActivityList204('${place}')`,!exists204('vacationActivity196'));
    h+=rr204('🍹','Nightlife / uitgaan','Drinken, lol, mensen ontmoeten, flirten en contacts',`dlc187Nightlife('${place}')`,!exists204('dlc187Nightlife'));
    h+=rr204('🛍️','Shops / souvenirs','Landitems, kleding, camera, collectibles',`dlc187Shop('${place}')`,!exists204('dlc187Shop'));
    h+=rr204('📇','Contacten / romance','Appen, dates en vakantiecontacten',`vacationContactsScreen191('${place}')`,!exists204('vacationContactsScreen191'));
    safeModal204(rec[0],rec[1],h);
  };

  const ACTS204={
    spain:[['🥘','Tapas avond','tapas'],['🏖️','Stranddag','beach'],['⚽','La Liga voetbal','football'],['⛪','Barcelona sightseeing','culture'],['📚','Spaanse taalles','language'],['🥊','Boxing/fight gym','gym'],['🏨','Tourism network','tourism'],['🍹','Beach bar business','business']],
    america:[['🍔','American Diner','diner'],['🛣️','Roadtrip','road'],['🎬','Hollywood / fame','hollywood'],['🏟️','Live sports night','sports'],['🥊','UFC Gym visit','ufc'],['🤼','WWE Performance Center','wwe'],['💼','Startup pitch','pitch']],
    japan:[['🍜','Ramen route','ramen'],['🕹️','Akihabara arcade','arcade'],['⛩️','Tempel / shrine','temple'],['🥋','Dojo training','dojo'],['📚','Japanse taalles','language'],['🏢','Werkcultuur netwerk','work']],
    amsterdam:[['🌉','Grachten dag','canal'],['🎪','Festival / event','festival'],['🖼️','Museum / cultuur','museum'],['📸','Creative content day','creative'],['💼','Media netwerkborrel','media']],
    jamaica:[['🏖️','Beach day','beach'],['⛵','Boat trip','boat'],['⚽','Voetbal op strand','football'],['🛍️','Local market','market'],['🏝️','Tour guide network','tourism']],
    nightcity:[['🌃','Neon walk','neon'],['🕶️','Meet fixer','fixer'],['🥊','Underground fight pit','fight'],['🦾','Cyber clinic','clinic']]
  };
  window.dlcActivityList204=function(place){
    let list=ACTS204[place]||[];
    let h=card204('<b>Originele activiteit-logica</b><br>Elke activiteit opent een keuze-menu met kosten, succes/faal, rewards en risico.');
    h+=section204('Activiteiten');
    h+=list.map(a=>rr204(a[0],a[1],'Open keuze-menu',`vacationActivity196('${place}','${a[2]}')`,!exists204('vacationActivity196'))).join('');
    h+=rr204('⬅️','Terug naar DLC','Naar landhub',`dlcPlaceMaster204('${place}')`);
    safeModal204('🎲','DLC activiteiten',h);
  };

  window.sportCombatMasterHub204=function(){
    let h=card204('<b>Sport & Combat</b><br>Alles van basis sport tot amateur, semi-pro, pro, UFC, GLORY, WWE, rankings en title fights staat hier onder één hub.');
    h+=section204('Basis sport');
    h+=rr204('💪','Gym / algemene training','Fitness, stamina en health basis','gymScreen()',!exists204('gymScreen'));
    h+=rr204('⚽','Football Career','Club, academy, contract, vorm en voetbalroute','footballCareerScreen()',!exists204('footballCareerScreen'));
    h+=section204('Combat carrière');
    h+=rr204('🥊','Combat Career Hub','Hoofdroute voor fight career, training, camps en recovery','combatCareerHub177()',!exists204('combatCareerHub177'));
    h+=rr204('🥉','Amateur Circuit','Begin als amateur, lokale fights en record opbouwen','combatCareerStage204("amateur")',!exists204('combatCareerHub177'));
    h+=rr204('🥈','Semi-Pro Circuit','Sterkere tegenstanders, kleine betalingen en manager zoeken','combatCareerStage204("semipro")',!exists204('combatCareerHub177')||locked204(18));
    h+=rr204('🥇','Pro Circuit','Pro contracten, sponsors, main card en grotere risico’s','combatCareerStage204("pro")',!exists204('combatCareerHub177')||locked204(18));
    h+=section204('Routes');
    h+=rr204('🇺🇸','UFC / MMA route','Striking, grappling, wrestling, cardio en rankings','combatCareerStage204("ufc")',!exists204('combatCareerHub177')||locked204(18));
    h+=rr204('🥊','GLORY / Kickboxing route','Punches, kicks, defense, KO bonus en title fights','combatCareerStage204("glory")',!exists204('combatCareerHub177')||locked204(18));
    h+=rr204('🤼','WWE route','Promo skill, ring work, storylines, NXT en main roster','wrestlingCareerScreen163()',!exists204('wrestlingCareerScreen163')||locked204(18));
    h+=section204('Rankings & titles');
    h+=rr204('🏆','Rankings & Tactical Fights','Alle rankings, contenders, title fights en tactical matches','sportsRankingsHub164()',!exists204('sportsRankingsHub164'));
    safeModal204('🥊','Sport & Combat',h);
  };
  window.combatCareerStage204=function(stage){
    const data={
      amateur:['🥉','Amateur Circuit','Lokale fights, jeugd/amateur toernooien, laag geld, hoge leerwaarde. Bouw record, stamina, striking en grappling op.'],
      semipro:['🥈','Semi-Pro Circuit','Vanaf 18: kleine contracten, betere tegenstanders, manager zoeken en fight camp betalen.'],
      pro:['🥇','Pro Circuit','Pro contract, sponsors, rankings, blessures, medical checks en title contention.'],
      ufc:['🇺🇸','UFC / MMA route','MMA record, striking, grappling, wrestling, cardio, weight cut, rankings en title shot.'],
      glory:['🥊','GLORY / Kickboxing route','Kickboxing record, punch power, kicks, defense, KO bonus, rankings en belt fights.']
    }[stage]||['🥊','Combat','Route'];
    let h=card204(`<b>${data[1]}</b><br>${data[2]}`);
    h+=section204('Open systemen');
    h+=rr204('🥊','Combat Career Hub','Train, fight, recover en bouw carrière','combatCareerHub177()',!exists204('combatCareerHub177'));
    h+=rr204('🏆','Rankings & Tactical Fights','Rankings, title fights en tactical match keuzes','sportsRankingsHub164()',!exists204('sportsRankingsHub164'));
    h+=rr204('💪','Gym / herstel','Basisfitness en stamina','gymScreen()',!exists204('gymScreen'));
    safeModal204(data[0],data[1],h);
  };

  window.petsMasterHub204=function(){
    let sold=state&&state.animalCrime201?state.animalCrime201.lifetimeSold:0;
    let h=card204(`<b>Huisdieren</b><br>Adopteren, kopen, verzorgen en verkopen staat hier. Dieren verkopen telt lifetime mee: ${sold||0}/5.`);
    h+=section204('Pets');
    h+=rr204('🐾','Pets hoofdmenu','Animal shelter, breeders, pet store en jouw dieren','petsMainScreen()',!exists204('petsMainScreen'));
    h+=section204('Risico');
    h+=rr204('⚠️','Dierenverkoop gevolgen','4e verkoop = attack event, 5e verkoop = illegale dierenhandel','parentBankruptcyInfo201()',!exists204('parentBankruptcyInfo201'));
    safeModal204('🐾','Huisdieren',h);
  };

  window.crimeRiskMasterHub204=function(){
    let h=card204('<b>Crime & Risico</b><br>Misdaad, gevangenis, dierenhandel, ouder-failliet en wees mode staan hier bij elkaar.');
    h+=section204('Crime / justice');
    h+=rr204('🚔','Crime','Kattenkwaad, diefstal, hacken, burglary en arrestatie','crimeScreen()',!exists204('crimeScreen'));
    if(state&&state.jail&&state.jail.yearsLeft>0)h+=rr204('⚖️','Gevangenis','Je zit vast; acties openen via Activities hoofdscherm','openScreen("activities")');
    h+=section204('Familie & dieren risico');
    h+=rr204('🏚️','Familie-financiën & risico','Oudersteun, fietsen, faillissement, dierenhandel','parentBankruptcyInfo201()',!exists204('parentBankruptcyInfo201'));
    if(state&&state.orphanMode201)h+=rr204('🧒','Wees mode','Jeugdzorg, pleeggezin en gevolgen','orphanModeScreen201()',!exists204('orphanModeScreen201'));
    safeModal204('🚔','Crime & Risico',h);
  };

  window.legacyStatusMasterHub204=function(){
    let h=card204('<b>Legacy & Status</b><br>Familieboom, achievements, doelen, erfgenamen en debug staan hier.');
    h+=section204('Legacy');
    h+=rr204('🌳','Family Tree / Legacy','Generaties, familie-reputatie en memorials','legacyScreen()',!exists204('legacyScreen'));
    h+=rr204('🎯','Life Goals','Routes en levensdoelen','lifeGoalsScreen()',!exists204('lifeGoalsScreen'));
    h+=rr204('🏆','Achievements','Behaalde prestaties','achievements()',!exists204('achievements'));
    if(exists204('legacyHeirs203'))h+=rr204('☠️','Erfgenamen systeem','Na dood verder als kind/sibling/kleinkind/neef/nicht','legacyHeirsInfo204()');
    h+=section204('Debug');
    h+=rr204('🛠️','Patch Status','Check of systemen geladen zijn','patchStatus202()',!exists204('patchStatus202'));
    h+=rr204('🧪','Patch Status v20.4','Check master router hubs','patchStatus204()');
    safeModal204('🌳','Legacy & Status',h);
  };
  window.legacyHeirsInfo204=function(){
    let heirs=[];
    try{heirs=legacyHeirs203()}catch(e){}
    let h=card204(`<b>Legacy Continue</b><br>Als je doodgaat kun je verder als erfgenaam. Beschikbare erfgenamen nu: ${heirs.length}.`);
    if(heirs.length)h+=heirs.map((x,i)=>rr204(x.person.icon||'🧑',x.person.name||'Erfgenaam',`${x.label} · ${x.sub||''}`,'closeModal()',true)).join('');
    safeModal204('☠️','Erfgenamen systeem',h);
  };

  const oldScreenHTML204 = window.screenHTML || (typeof screenHTML==='function'?screenHTML:null);
  if(oldScreenHTML204 && !oldScreenHTML204.__master204){
    window.screenHTML=function(name){
      if(name==='activities')return window.masterActivities204();
      return oldScreenHTML204.apply(this,arguments);
    };
    window.screenHTML.__master204=true;
    try{screenHTML=window.screenHTML}catch(e){}
  }

  window.patchStatus204=function(){
    const checks=[
      ['Master Activities router', typeof masterActivities204==='function'],
      ['Werk & School hub', typeof workSchoolHub204==='function'],
      ['Gezondheid & Uiterlijk hub', typeof healthLooksHub204==='function'],
      ['Relaties & Familie hub', typeof familySocialHub204==='function'],
      ['Geld & Lifestyle hub', typeof moneyLifestyleMasterHub204==='function'],
      ['Reizen & Wereld/DLC hub', typeof travelWorldMasterHub204==='function'],
      ['Sport & Combat hub', typeof sportCombatMasterHub204==='function'],
      ['Pets hub', typeof petsMasterHub204==='function'],
      ['Crime & Risico hub', typeof crimeRiskMasterHub204==='function'],
      ['Legacy & Status hub', typeof legacyStatusMasterHub204==='function']
    ];
    let h=card204(checks.map(x=>(x[1]?'✅ ':'❌ ')+x[0]).join('<br>'));
    safeModal204('🛠️','Patch status v20.4',h);
  };

  setTimeout(()=>{try{if(typeof safeSave==='function')safeSave(); if(typeof render==='function')render();}catch(e){}},300);
})();
