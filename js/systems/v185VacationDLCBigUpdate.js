
/* v18.5 Vacation DLC Big Update
   Fixes: duplicate Spain/Alkmaar in world list + restores interactive vacation/resident DLC actions. */
(function(){
  function r185(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function p185(a){return a[Math.floor(Math.random()*a.length)]}
  function c185(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function m185(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast185(t){try{toast(t)}catch(e){console.log(t)}}
  function save185(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function apply185(stats){
    try{applyStats(stats||{})}
    catch(e){
      stats=stats||{};state.stats=state.stats||{};
      for(const k in stats){
        if(k==='Fitness')state.fitness=c185((state.fitness||50)+stats[k]);
        else if(k==='Stamina')state.stamina=c185((state.stamina||50)+stats[k]);
        else state.stats[k]=c185((state.stats[k]||50)+stats[k]);
      }
    }
  }
  function msg185(icon,title,text,stats,cash,type){
    if(cash)state.money=(state.money||0)+cash;
    apply185(stats||{});
    try{addLog('<b>'+title+'</b><br>'+text,type||'good',false)}catch(e){}
    try{showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p><button class="btn" onclick="closeModal()">Verder</button></div>`)}catch(e){toast185(title)}
    save185();
  }
  function norm185(x){
    x=(x||'').toString().toLowerCase();
    if(['usa','us','america','united_states','united states','amerika'].includes(x))return 'america';
    if(['japan','tokyo'].includes(x))return 'japan';
    if(['spain','spanje','alkmaar','barcelona','madrid','malaga','valencia','sevilla'].includes(x))return 'spain';
    if(['amsterdam'].includes(x))return 'amsterdam';
    if(['jamaica','kingston'].includes(x))return 'jamaica';
    if(['nightcity','night_city','night city','nc'].includes(x))return 'nightcity';
    if(['enkhuizen','nl','netherlands','nederland','normal','home'].includes(x))return 'enkhuizen';
    return x||'enkhuizen';
  }
  function label185(p){p=norm185(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function icon185(p){p=norm185(p);return {enkhuizen:'🏠',amsterdam:'🌉',spain:'🇪🇸',america:'🇺🇸',japan:'🇯🇵',jamaica:'🇯🇲',nightcity:'🌃'}[p]||'🌍'}
  function jail185(){try{if(typeof isInJail==='function')return !!isInJail()}catch(e){}return !!(state&&state.jail&&state.jail.yearsLeft>0)}
  function high185(){return !!(state.addiction&&(state.addiction.underInfluence||state.addiction.weedTrip||state.addiction.high||state.addiction.stoned))}
  function normalize185(){
    if(!state)return;
    ['vacation','world','city','placeId','homePlaceId','homeWorldBeforeVacation'].forEach(k=>{if(state[k])state[k]=norm185(state[k])});
    // Hard migration: old Alkmaar lives/saves become Spain. Keep home if empty.
    if(state.world==='alkmaar')state.world='spain';
    if(state.placeId==='alkmaar')state.placeId='spain';
    if(state.homePlaceId==='alkmaar')state.homePlaceId='spain';
  }
  function current185(){normalize185();return state.vacation?norm185(state.vacation):norm185(state.world||state.city||state.placeId||'enkhuizen')}
  window.currentPlace180=current185;
  window.travelMode180=function(){return state.vacation?'vacation':'resident'};
  window.isInPlace180=function(place){place=norm185(place);return norm185(state.vacation)===place||norm185(state.world)===place||norm185(state.city)===place||norm185(state.placeId)===place};
  function travelDeny185(){if(jail185())return 'Je zit vast. Vakantie/verhuizen is geblokkeerd.';if(high185())return 'Je bent onder invloed. Eerst uitrusten/ontnuchteren.';return ''}
  function ensureDLCState185(place){
    place=norm185(place);
    state.dlcTravel=state.dlcTravel||{};
    state.dlcTravel[place]=state.dlcTravel[place]||{days:0,vibe:50,contacts:0,souvenirs:0,party:0,spent:0,memories:0,localRep:0};
    return state.dlcTravel[place];
  }
  function spend185(place,cost){
    if((state.money||0)<cost){toast185('Niet genoeg geld: '+m185(cost));return false}
    state.money-=cost;
    const d=ensureDLCState185(place);d.spent=(d.spent||0)+cost;return true;
  }
  function setVacation185(place,cost){
    normalize185();place=norm185(place);
    const deny=travelDeny185();if(deny)return toast185(deny);
    if(state.vacation)return toast185('Je bent al op vakantie. Keer eerst terug naar huis.');
    if(!spend185(place,cost))return;
    state.homeWorldBeforeVacation=state.world||state.city||state.placeId||'enkhuizen';
    state.vacation=place;ensureDLCState185(place).days++;
    msg185(icon185(place),'Vakantie naar '+label185(place),`Je bent aangekomen in ${label185(place)}. Dit is nu een echte vakantie-DLC met keuzes, locals, specials en risico's.`,{Happiness:5,Stamina:-3},0,'good');
  }
  window.travelSpain180=function(){return setVacation185('spain',1300)};
  window.travelAlkmaar180=window.travelSpain180;
  window.travelAmerica180=function(){return setVacation185('america',3600)};
  window.travelJapan180=function(){return setVacation185('japan',2800)};
  window.travelAmsterdam180=function(){return setVacation185('amsterdam',120)};
  window.travelJamaica180=function(){return setVacation185('jamaica',1800)};
  window.travelNightCity180=function(){return setVacation185('nightcity',1200)};
  window.returnHome180=function(){
    normalize185();
    const deny=travelDeny185();if(deny)return toast185(deny);
    if(!state.vacation)return toast185('Je bent niet op vakantie.');
    const from=state.vacation;state.vacation=null;
    state.world=state.homeWorldBeforeVacation||state.world||'enkhuizen';state.placeId=state.world;
    msg185('✈️','Terug naar huis',`Je vakantie in ${label185(from)} is voorbij. Je bent terug in ${label185(state.world)}.`,{Happiness:1,Stamina:-2},0,'good');
  };
  window.soberUp180=function(){state.addiction=state.addiction||{};['underInfluence','weedTrip','high','stoned'].forEach(k=>state.addiction[k]=false);msg185('💧','Uitrusten / ontnuchteren','Je nam rust, dronk water en werd weer helder genoeg om veilig te reizen.',{Health:1,Stamina:8,Happiness:1},0,'good')};

  const DLC185={
    spain:{
      theme:'spain',
      desc:'Zon, tapas, La Liga, flamenco, strand, nightlife en toerisme/business.',
      travelCost:1300, moveCost:2600,
      actions:[
        ['food','🥘','Tapas avond','Kies tussen goedkoop lokaal, toeristisch of luxe tapas','vacation',0,0,'dlc185Choice("spain","tapas")'],
        ['beach','🏖️','Costa del Sol stranddag','Relax, beach football of boottocht','vacation',0,0,'dlc185Choice("spain","beach")'],
        ['football','⚽','La Liga voetbalbeleving','Wedstrijd kijken, pickup spelen of scout ontmoeten','vacation',0,0,'dlc185Choice("spain","football")'],
        ['night','🌃','Uitgaan in Madrid','Tapasbar, club, flamenco of veilige rustige avond','vacation',18,0,'dlc185Choice("spain","night")'],
        ['culture','⛪','Barcelona sightseeing','Architectuur, content en lokale geschiedenis','vacation',0,80,'dlc185Run("spain","culture")'],
        ['market','🛍️','Mercado & souvenirs','Koop of vind Spaanse items en lokale contacten','vacation',0,60,'dlc185Run("spain","market")'],
        ['language','📚','Spaanse taalles','Spanish skill voor betere Spanje-events','both',12,90,'dlc185Run("spain","language")'],
        ['gym','🥊','Spaanse boxing/fight gym','Combat training met hitte en discipline','both',16,130,'dlc185Run("spain","gym")'],
        ['special','✨','Spanje special event','Random mini-event met locals, voetbal of festival','vacation',0,0,'dlc185Special("spain")'],
        ['resident1','🏨','Tourism network','Resident-only horeca/toerisme netwerk','resident',18,120,'dlc185Run("spain","tourism")'],
        ['resident2','🍹','Beach bar business check','Resident-only business kans','resident',18,450,'dlc185Run("spain","business")']
      ]
    },
    america:{
      theme:'america',
      desc:'Roadtrips, diners, Hollywood, live sports, UFC gym en WWE Performance Center.',
      travelCost:3600, moveCost:7200,
      actions:[
        ['diner','🍔','American Diner','Classic diner, eating challenge of social hangout','vacation',0,0,'dlc185Choice("america","diner")'],
        ['road','🛣️','Roadtrip','Texas highway, motel stop of national park route','vacation',16,0,'dlc185Choice("america","road")'],
        ['hollywood','🎬','Hollywood / fame','Sightseeing, casting of content grind','vacation',0,0,'dlc185Choice("america","hollywood")'],
        ['sports','🏟️','Live sports night','NBA/NFL/MLS vibe met crowd event','vacation',0,140,'dlc185Run("america","sports")'],
        ['ufc','🥊','UFC Gym visit','MMA training en possible gym contact','both',16,160,'dlc185Run("america","ufc")'],
        ['wwe','🤼','WWE Performance Center','Wrestling drills, promo en scouting-vibe','both',16,220,'dlc185Run("america","wwe")'],
        ['special','✨','USA special event','Random celebrity, road, fight of hustle event','vacation',0,0,'dlc185Special("america")'],
        ['resident1','💼','Startup pitch','Resident-only business/investor route','resident',18,900,'dlc185Run("america","pitch")']
      ]
    },
    japan:{
      theme:'japan',
      desc:'Tokyo arcade, ramen, Shibuya, tempel, dojo, taal en anime/game-cultuur.',
      travelCost:2800, moveCost:5600,
      actions:[
        ['ramen','🍜','Ramen route','Cheap bowl, spicy challenge of hidden local spot','vacation',0,0,'dlc185Choice("japan","ramen")'],
        ['arcade','🕹️','Akihabara arcade','Gacha, rhythm game, tournament of retro hunt','vacation',0,0,'dlc185Choice("japan","arcade")'],
        ['night','🌃','Shibuya night','Night walk, karaoke of locals meet','vacation',14,0,'dlc185Choice("japan","night")'],
        ['temple','⛩️','Tempel / shrine','Rust, wens of culture event','vacation',0,40,'dlc185Run("japan","temple")'],
        ['dojo','🥋','Dojo training','Discipline, fight IQ en combat','both',12,160,'dlc185Run("japan","dojo")'],
        ['language','📚','Japanse taalles','Japanese skill en smarts','both',12,120,'dlc185Run("japan","language")'],
        ['special','✨','Japan special event','Random anime, festival, train of food event','vacation',0,0,'dlc185Special("japan")'],
        ['resident1','🏢','Werkcultuur netwerk','Resident-only job/culture route','resident',18,220,'dlc185Run("japan","work")']
      ]
    },
    amsterdam:{
      theme:'amsterdam',
      desc:'Grachten, uitgaan, festivals, musea, creatieve media en city socials.',
      travelCost:120, moveCost:800,
      actions:[
        ['canal','🌉','Grachten dag','Walk, rondvaart of canal date','vacation',0,0,'dlc185Choice("amsterdam","canal")'],
        ['night','🎧','Uitgaan / club night','Club, comedy, bar of rustige late snack','vacation',18,0,'dlc185Choice("amsterdam","night")'],
        ['festival','🎪','Festival / event','Music, foodtruck of creator meet','vacation',16,120,'dlc185Run("amsterdam","festival")'],
        ['museum','🖼️','Museum / cultuur','Smarts, content en rust','vacation',0,65,'dlc185Run("amsterdam","museum")'],
        ['creative','📸','Creative content day','Camera/media netwerk en social groei','both',13,70,'dlc185Run("amsterdam","creative")'],
        ['special','✨','Amsterdam special event','Random grachten, festival of lokale ontmoeting','vacation',0,0,'dlc185Special("amsterdam")'],
        ['resident1','💼','Media netwerkborrel','Resident-only creatieve business route','resident',18,90,'dlc185Run("amsterdam","media")']
      ]
    },
    jamaica:{
      theme:'jamaica',
      desc:'Reggae, strand, markt, voetbal op het strand, boottocht en relaxed herstel.',
      travelCost:1800, moveCost:3600,
      actions:[
        ['beach','🏖️','Beach day','Relax, zwemmen of beach football','vacation',0,0,'dlc185Choice("jamaica","beach")'],
        ['music','🎸','Reggae night','Live band, dancehall of rustige jam','vacation',16,0,'dlc185Choice("jamaica","music")'],
        ['market','🛍️','Local market','Souvenir, food of local contact','vacation',0,55,'dlc185Run("jamaica","market")'],
        ['boat','⛵','Boat trip','Sea vibe, memories en kleine risico’s','vacation',12,120,'dlc185Run("jamaica","boat")'],
        ['football','⚽','Voetbal op strand','Fitness, friends en fun','vacation',6,0,'dlc185Run("jamaica","football")'],
        ['special','✨','Jamaica special event','Random beach, music of local event','vacation',0,0,'dlc185Special("jamaica")'],
        ['resident1','🏝️','Tour guide network','Resident-only tourism route','resident',18,100,'dlc185Run("jamaica","tourism")']
      ]
    },
    nightcity:{
      theme:'nightcity',
      desc:'Neon, fixer deals, clubs, fight pits, cyber clinics en hoge risico’s.',
      travelCost:1200, moveCost:2400,
      actions:[
        ['neon','🌃','Neon walk','Street vibe, danger en memories','vacation',16,30,'dlc185Run("nightcity","neon")'],
        ['club','🎛️','Neon club night','Dance, contacts of risky backroom','vacation',18,0,'dlc185Choice("nightcity","club")'],
        ['fixer','🕶️','Meet fixer','Risky network en street cred','both',18,120,'dlc185Run("nightcity","fixer")'],
        ['fight','🥊','Underground fight pit','Combat risk/reward','vacation',18,180,'dlc185Run("nightcity","fight")'],
        ['clinic','🦾','Cyber clinic','Resident-only cyberware route','resident',18,800,'dlc185Run("nightcity","clinic")'],
        ['special','✨','Night City special event','Random neon, crime, tech of survival event','vacation',16,0,'dlc185Special("nightcity")']
      ]
    }
  };

  const CHOICES185={
    'spain:tapas':[
      ['🥖','Goedkope local tapas','€35 · happiness/health',35,{Happiness:5,Health:1},'Je zat tussen locals en kreeg drie gerechten die je niet kon uitspreken, maar wel onthield.'],
      ['🍷','Luxe rooftop tapas','€140 · looks/social',140,{Happiness:8,Looks:2,Stamina:-2},'De rooftop was duur, maar het uitzicht maakte je vakantie ineens filmisch.'],
      ['👥','Tapas met locals','€60 · contacten',60,{Happiness:6,Smarts:1},'Je raakte aan de praat met locals en kreeg tips die niet in toeristenapps staan.','contact']
    ],
    'spain:beach':[
      ['😴','Relaxen en herstellen','€20 · herstel',20,{Happiness:6,Health:2,Stamina:8},'Je deed weinig. Precies wat vakantie soms moet zijn.'],
      ['⚽','Beach football','gratis · fitness/voetbal',0,{Fitness:3,Happiness:5,Stamina:-4},'Je speelde voetbal op het strand en merkte hoe technisch de locals waren.'],
      ['⛵','Boottocht','€180 · memories/risico',180,{Happiness:9,Stamina:-5},'De boottocht was prachtig, al werd je maag minder enthousiast dan je ogen.']
    ],
    'spain:football':[
      ['🎟️','La Liga wedstrijd kijken','€110 · voetbal vibe',110,{Happiness:8,Smarts:1},'Het stadion voelde als theater met tackles. Pure voetbalcultuur.'],
      ['🥅','Pickup match meedoen','€15 · fitness/form',15,{Fitness:4,Happiness:5,Stamina:-6},'Je deed mee met een pickup match en werd meteen getest op techniek.'],
      ['🕵️','Scout/coach aanspreken','€40 · kans op football boost',40,{Smarts:2,Happiness:2},'Je sprak een lokale coach. Geen contract, maar wel nuttige feedback.','football']
    ],
    'spain:night':[
      ['🍻','Tapasbar avond','€70 · veilig social',70,{Happiness:7,Looks:1,Stamina:-4},'Je koos een tapasbar in plaats van chaos. Goede sfeer, weinig drama.'],
      ['🎧','Club in Madrid','€160 · party/fame/risico',160,{Happiness:10,Looks:2,Health:-1,Stamina:-10},'De club ging laat los. Je kwam terug met verhalen en weinig energie.','party'],
      ['💃','Flamenco night','€85 · cultuur/looks',85,{Happiness:8,Smarts:2,Stamina:-4},'Flamenco was intenser dan verwacht. Ritme, emotie en vuur.']
    ],
    'america:diner':[
      ['🍔','Classic burger meal','€35 · simpel geluk',35,{Happiness:5,Health:-1},'De portie was belachelijk groot. Amerika in één bord.'],
      ['🔥','Eating challenge','€55 · fame/risico',55,{Happiness:6,Health:-3},'Je deed een eating challenge. Niet slim, wel memorabel.','party'],
      ['👥','Praat met locals','€25 · contacten',25,{Happiness:4,Smarts:1},'Je raakte in gesprek met locals over sport, werk en rare snelwegen.','contact']
    ],
    'america:road':[
      ['🛣️','Texas highway','€320 · classic roadtrip',320,{Happiness:9,Stamina:-9},'Lange wegen, diners en zonsondergang. Alles voelde groot.'],
      ['🏞️','National park route','€260 · health/memories',260,{Happiness:8,Health:3,Stamina:-6},'De natuur was groter dan je telefoon kon vastleggen.'],
      ['🏚️','Motel chaos stop','€120 · goedkoop/risico',120,{Happiness:4,Smarts:1,Stamina:-4},'Het motel was goedkoop en vreemd. Je sliep met één oog open.']
    ],
    'america:hollywood':[
      ['📸','Content maken','€80 · social/looks',80,{Happiness:6,Looks:2},'Je maakte content in Hollywood en pakte online aandacht.','content'],
      ['🎭','Casting proberen','€140 · fame-kans',140,{Smarts:1,Happiness:4},'Je deed een kleine casting. Geen garantie, wel ervaring.','fame'],
      ['🚶','Walk of Fame tour','€55 · toerist maar leuk',55,{Happiness:5,Stamina:-2},'Toeristisch? Ja. Maar soms is dat precies vakantie.']
    ],
    'japan:ramen':[
      ['🍜','Classic bowl','€28 · warm herstel',28,{Happiness:5,Health:1},'Een simpele kom ramen deed meer dan verwacht.'],
      ['🌶️','Spicy challenge','€40 · risico/fame',40,{Happiness:6,Health:-1},'Je mond stond in brand, maar de mensen naast je juichten.','party'],
      ['🗺️','Hidden local spot','€60 · culture/contact',60,{Happiness:7,Smarts:2},'Je vond een klein zaakje buiten de drukte. Beter dan de toeristische route.','contact']
    ],
    'japan:arcade':[
      ['🕹️','Retro cabinets','€45 · gaming vibe',45,{Happiness:6,Smarts:1},'Je speelde oude cabinets en voelde pure arcade-energie.'],
      ['🏆','Arcade tournament','€80 · skill/fame kans',80,{Happiness:8,Smarts:2,Stamina:-4},'Je deed mee aan een klein toernooi. Je handen deden pijn, maar je ego leefde.','fame'],
      ['🎁','Gacha hunt','€55 · souvenir kans',55,{Happiness:5},'Je bleef te lang hangen bij gacha machines. Natuurlijk.','souvenir']
    ],
    'japan:night':[
      ['🚶','Shibuya night walk','€60 · city vibe',60,{Happiness:7,Looks:1,Stamina:-3},'Shibuya voelde als een videogame met te veel NPC’s.'],
      ['🎤','Karaoke box','€90 · social',90,{Happiness:9,Stamina:-5},'Je zong alsof niemand je kende. Dat hielp.','party'],
      ['👥','Meet locals','€70 · contact',70,{Happiness:5,Smarts:1},'Je ontmoette locals en kreeg tips voor plekken die je anders nooit zou vinden.','contact']
    ],
    'amsterdam:canal':[
      ['🚶','Grachten wandeling','gratis · rust',0,{Happiness:4,Stamina:-1},'Je liep langs de grachten en vergat even de drukte.'],
      ['⛵','Rondvaart','€35 · toerist maar leuk',35,{Happiness:6,Smarts:1},'De rondvaart was toeristisch, maar eerlijk: best mooi.'],
      ['💬','Canal date/social','€45 · relatie/social',45,{Happiness:6,Looks:1},'Je had een sociaal moment langs het water. Amsterdam werkte mee.','contact']
    ],
    'amsterdam:night':[
      ['🎧','Club night','€90 · party',90,{Happiness:8,Looks:1,Stamina:-8},'De club was druk en luid. Precies de bedoeling.','party'],
      ['😂','Comedy avond','€60 · happiness/smarts',60,{Happiness:7,Smarts:1},'De comedy avond was scherper dan verwacht.'],
      ['🍟','Late snack run','€18 · veilig herstel',18,{Happiness:4,Health:-1},'Een late snack loste meer op dan je wilde toegeven.']
    ],
    'jamaica:beach':[
      ['😴','Relax day','€25 · herstel',25,{Happiness:7,Health:2,Stamina:8},'Je deed bijna niks en dat was precies de winst.'],
      ['🏊','Zwemmen/snorkel','€70 · health/memories',70,{Happiness:8,Health:2,Stamina:-4},'Het water was helder en je hoofd ook.'],
      ['⚽','Beach football','gratis · fitness',0,{Fitness:3,Happiness:5,Stamina:-4},'Voetbal op strand is zwaarder dan het eruitziet.']
    ],
    'jamaica:music':[
      ['🎸','Live reggae band','€75 · music vibe',75,{Happiness:9,Stamina:-4},'De band speelde alsof de avond geen eindtijd had.','party'],
      ['💃','Dancehall night','€100 · social/risico',100,{Happiness:10,Looks:1,Health:-1,Stamina:-8},'Dancehall was energie, zweet en chaos.','party'],
      ['🪘','Jam met locals','€45 · contact/skill',45,{Happiness:7,Smarts:1},'Je jamde met locals en werd niet eens weggejaagd.','contact']
    ],
    'nightcity:club':[
      ['🎛️','Main floor','€90 · neon party',90,{Happiness:8,Looks:1,Stamina:-8},'Bass, neon en lichamen. Night City verkocht illusie per minuut.','party'],
      ['🕶️','Backroom contact','€150 · street cred/heat',150,{Smarts:2,Happiness:3},'Je kwam in een backroom terecht. Interessant, maar niet veilig.','danger'],
      ['🚪','Veilig terugtrekken','gratis · weinig risico',0,{Stamina:4,Happiness:1},'Je koos veiligheid. In Night City is dat soms de slimste flex.']
    ]
  };

  function actionDeny185(a){
    if(jail185())return 'gevangenis-lock';
    const mode=state.vacation?'vacation':'resident';
    if((state.age||0)<(a[5]||0))return 'vanaf '+a[5];
    if(a[4]==='vacation'&&mode!=='vacation')return 'alleen vakantie';
    if(a[4]==='resident'&&mode!=='resident')return 'alleen wonen';
    if((state.money||0)<(a[6]||0))return 'te weinig geld';
    return '';
  }
  function dlcRow185(place,a){
    const deny=actionDeny185(a);
    const click=deny?'':a[8];
    return `<div class="dlc185-row ${deny?'locked':''}" onclick="${click}"><div class="ico">${a[1]}</div><div><div class="title">${a[2]}</div><div class="sub">${a[3]}${a[6]?' · '+m185(a[6]):''}${deny?' · '+deny:''}</div></div><div class="chev">›</div></div>`;
  }
  function hero185(place){
    const d=ensureDLCState185(place), cfg=DLC185[place]||{};
    const mode=state.vacation?'Vakantie':'Wonen';
    return `<div class="dlc185-hero ${cfg.theme||place}"><div class="dlc185-title">${icon185(place)} ${label185(place)} DLC</div><div class="dlc185-sub">${cfg.desc||'Lokale activiteiten en specials.'}<br><b>${mode} mode</b>: ${state.vacation?'tijdelijke fun, locals, nightlife en souvenirs.':'resident routes, werk, business en vaste netwerken.'}</div><div class="dlc185-badges"><span class="dlc185-badge">Vibe ${d.vibe||50}%</span><span class="dlc185-badge">Contacts ${d.contacts||0}</span><span class="dlc185-badge">Memories ${d.memories||0}</span><span class="dlc185-badge">Spent ${m185(d.spent||0)}</span>${high185()?'<span class="dlc185-badge">Travel lock: onder invloed</span>':''}</div></div>`;
  }
  function dlcHome185(place){
    normalize185();place=norm185(place||current185());
    const cfg=DLC185[place]; if(!cfg)return '';
    let groups={};
    cfg.actions.forEach(a=>{
      const key=a[4]==='resident'?'Wonen / resident':(['night','club'].includes(a[0])?'Uitgaan & social':(['special'].includes(a[0])?'Specials':(['market','creative'].includes(a[0])?'Shop / content':'Activiteiten')));
      groups[key]=groups[key]||[];groups[key].push(a);
    });
    let body=hero185(place);
    Object.keys(groups).forEach(g=>{body+=`<div class="dlc185-section">${g}</div>`+groups[g].map(a=>dlcRow185(place,a)).join('')});
    if(state.vacation)body+=dlcRow185(place,['return','✈️','Terug naar huis','Vakantie afsluiten','vacation',0,0,'',`returnHome180()`]);
    if(high185())body+=`<button class="btn" onclick="soberUp180()">💧 Uitrusten / ontnuchteren</button>`;
    return body;
  }
  window.vacationHub180=function(place){
    place=norm185(place||current185());
    if(jail185())return toast185('Je zit vast. Vakantie en verhuizen zijn geblokkeerd.');
    if(!window.isInPlace180(place))return toast185('Je bent niet in '+label185(place)+'.');
    showModal(`<div class="modalTop"><div class="avatar">${icon185(place)}</div><div class="modalTitle">${label185(place)} DLC</div></div><div class="modalBody dlc185-wrap">${dlcHome185(place)}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.spainHub180=function(){vacationHub180('spain')}; window.alkmaarHub180=window.spainHub180;
  window.usaHub180=function(){vacationHub180('america')}; window.japanHub180=function(){vacationHub180('japan')};
  window.amsterdamHub180=function(){vacationHub180('amsterdam')}; window.jamaicaHub180=function(){vacationHub180('jamaica')}; window.nightCityVacationHub180=function(){vacationHub180('nightcity')};
  [['spainVacationScreen','spainHub180'],['spainHub','spainHub180'],['showSpain','spainHub180'],['alkmaarVacationScreen','spainHub180'],['alkmaarHub','spainHub180'],['showAlkmaar','spainHub180'],['americaVacationScreen','usaHub180'],['usaVacationScreen','usaHub180'],['americaHub','usaHub180'],['usaHub','usaHub180'],['showAmerica','usaHub180'],['showUSA','usaHub180'],['japanVacationScreen','japanHub180'],['tokyoVacationScreen','japanHub180'],['japanHub','japanHub180'],['tokyoHub','japanHub180'],['showJapan','japanHub180'],['amsterdamVacationScreen','amsterdamHub180'],['amsterdamHub','amsterdamHub180'],['showAmsterdam','amsterdamHub180'],['jamaicaVacationScreen','jamaicaHub180'],['jamaicaHub','jamaicaHub180'],['showJamaica','jamaicaHub180'],['nightCityVacationScreen','nightCityVacationHub180'],['nightCityHub','nightCityVacationHub180']].forEach(pair=>{window[pair[0]]=window[pair[1]];try{globalThis[pair[0]]=window[pair[1]]}catch(e){}});

  window.dlc185Choice=function(place,key){
    place=norm185(place);
    const list=CHOICES185[place+':'+key]||[];
    if(!list.length)return dlc185Run(place,key);
    const buttons=list.map((ch,i)=>{
      const locked=(state.age||0)<0||(state.money||0)<ch[3];
      return `<div class="dlc185-row ${locked?'locked':''}" onclick="${locked?'':`dlc185ChoicePick('${place}','${key}',${i})`}"><div class="ico">${ch[0]}</div><div><div class="title">${ch[1]}</div><div class="sub">${ch[2]}</div></div><div class="chev">›</div></div>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">${icon185(place)}</div><div class="modalTitle">${label185(place)} keuze</div></div><div class="modalBody dlc185-wrap">${hero185(place)}${buttons}<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button></div>`);
  };
  window.dlc185ChoicePick=function(place,key,i){
    place=norm185(place);
    const ch=(CHOICES185[place+':'+key]||[])[i]; if(!ch)return;
    if(!spend185(place,ch[3]))return;
    const d=ensureDLCState185(place); d.vibe=c185((d.vibe||50)+r185(2,7));d.memories=(d.memories||0)+1;
    if(ch[6]==='contact')d.contacts=(d.contacts||0)+1;
    if(ch[6]==='party')d.party=(d.party||0)+1;
    if(ch[6]==='souvenir'){d.souvenirs=(d.souvenirs||0)+1;if(typeof giveItem180==='function'&&place==='japan')giveItem180('samurai_mask')}
    if(ch[6]==='football'){state.football=state.football||{};state.football.form=c185((state.football.form||50)+r185(2,6))}
    if(ch[6]==='fame'||ch[6]==='content')state.social=(state.social||0)+r185(8,60);
    if(ch[6]==='danger'){state.nc=state.nc||{};state.nc.heat=c185((state.nc.heat||0)+r185(3,9));state.nc.streetCred=c185((state.nc.streetCred||0)+r185(2,7));}
    msg185(ch[0],ch[1],ch[5],ch[4],0,ch[6]==='danger'?'warn':'good');
  };
  window.dlc185Run=function(place,id){
    place=norm185(place);
    const cost=(DLC185[place]?.actions||[]).find(a=>a[0]===id)?.[6]||0;
    if(cost&&!spend185(place,cost))return;
    const d=ensureDLCState185(place);d.memories=(d.memories||0)+1;d.vibe=c185((d.vibe||50)+r185(1,5));
    let title='DLC event', txt='Je deed een lokale activiteit.', stats={Happiness:3}, icon=icon185(place), type='good';
    if(place==='spain'&&id==='culture'){title='Barcelona sightseeing';txt='Je liep langs architectuur, pleinen en straatmuziek. Spanje voelde ineens veel minder leeg.';stats={Smarts:3,Happiness:6,Looks:1,Stamina:-4};icon='⛪'}
    if(place==='spain'&&id==='market'){title='Mercado';txt='Je liep door een Spaanse mercado. Tussen shirts, eten en souvenirs pakte je echte vakantievibe.';stats={Happiness:5};icon='🛍️';d.souvenirs++;if(typeof giveItem180==='function'&&Math.random()<.6)giveItem180('spain_jersey')}
    if(place==='spain'&&id==='language'){title='Spaanse taalles';txt='Je leerde genoeg Spaans om minder toerist te lijken. Lokale kansen worden makkelijker.';stats={Smarts:4,Stamina:-1};icon='📚';state.skills=state.skills||{};state.skills.spanish=(state.skills.spanish||0)+r185(6,14)}
    if(place==='spain'&&id==='gym'){title='Spaanse fight gym';txt='Je trainde in een warme boxing gym. Geen glamour, wel discipline.';stats={Fitness:3,Stamina:-6,Health:-1};icon='🥊';state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r185(2,5)}
    if(place==='spain'&&id==='tourism'){title='Tourism network';txt='Je bouwde resident netwerk op in toerisme en horeca. Handig voor werk en business.';stats={Smarts:2,Happiness:2};icon='🏨';state.skills=state.skills||{};state.skills.tourism=(state.skills.tourism||0)+r185(4,10)}
    if(place==='spain'&&id==='business'){title='Beach bar business check';icon='🍹';if(Math.random()<.55){txt='Je vond een kans voor een kleine beach bar. Geen goudmijn, wel een echte Spaanse business-route.';stats={Smarts:2,Happiness:6};state.businesses=state.businesses||[];state.businesses.push({name:'Costa Beach Bar',type:'horeca',city:'spain',level:1,reputation:25,customers:20,quality:24,marketing:22,monthlyRevenue:900,monthlyCosts:650,risk:28,debt:0})}else{txt='De beach bar deal zag er leuk uit, maar de cijfers waren zwak. Je liep op tijd weg.';stats={Smarts:3,Happiness:-1};type='warn'}}
    if(place==='america'&&id==='sports'){title='Live Sports Night';txt='De show rond de wedstrijd was bijna groter dan de sport zelf.';stats={Happiness:7,Smarts:1,Stamina:-3};icon='🏟️'}
    if(place==='america'&&id==='ufc'){title='UFC Gym Visit';txt='Je trainde in een Amerikaanse MMA-gym. Hard, direct en leerzaam.';stats={Fitness:3,Stamina:-6,Health:-1};icon='🥊';state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r185(2,5)}
    if(place==='america'&&id==='wwe'){title='WWE Performance Center';txt='Je deed drills en promo-oefeningen. Zelfs de rondleiding voelde als try-out.';stats={Fitness:2,Happiness:5,Stamina:-4};icon='🤼';state.skills=state.skills||{};state.skills.wrestling=(state.skills.wrestling||0)+r185(2,5)}
    if(place==='america'&&id==='pitch'){title='Startup pitch';txt='Je pitchte een idee. Amerika maakte de droom groter, maar de druk ook.';stats={Smarts:3,Happiness:2};icon='💼'}
    if(place==='japan'&&id==='temple'){title='Shrine visit';txt='Rust, ritueel en even geen haast. Dat is ook progressie.';stats={Smarts:2,Happiness:5,Stamina:2};icon='⛩️'}
    if(place==='japan'&&id==='dojo'){title='Dojo Training';txt='Je trainde in een dojo. Minder show, meer discipline.';stats={Fitness:3,Smarts:2,Stamina:-5};icon='🥋';state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r185(2,5)}
    if(place==='japan'&&id==='language'){title='Japanse taalles';txt='Je leerde basiszinnen en cultuurregels.';stats={Smarts:4,Stamina:-2};icon='📚';state.skills=state.skills||{};state.skills.japanese=(state.skills.japanese||0)+r185(5,12)}
    if(place==='japan'&&id==='work'){title='Werkcultuur netwerk';txt='Je bouwde resident netwerk op. De lat ligt hoog, maar de route opent.';stats={Smarts:3,Happiness:-1};icon='🏢'}
    if(place==='amsterdam'&&id==='festival'){title='Festival / event';txt='Veel mensen, muziek en energie. Amsterdam voelde weer levend.';stats={Happiness:8,Looks:1,Stamina:-10};icon='🎪';state.social=(state.social||0)+r185(15,55)}
    if(place==='amsterdam'&&id==='museum'){title='Museumdag';txt='Je deed cultuur. Niet alles bleef hangen, maar je werd wel scherper.';stats={Smarts:4,Happiness:3,Stamina:-3};icon='🖼️'}
    if(place==='amsterdam'&&id==='creative'){title='Creative content day';txt='Je maakte content en sprak creatieve types. Goed voor media-vibe.';stats={Smarts:2,Looks:2,Happiness:4};icon='📸';state.social=(state.social||0)+r185(10,45)}
    if(place==='amsterdam'&&id==='media'){title='Media netwerkborrel';txt='Je sprak creatieve mensen. Eén contact kan later waarde hebben.';stats={Smarts:2,Looks:1};icon='💼';d.contacts++}
    if(place==='jamaica'&&id==='market'){title='Local Market';txt='Je kocht iets kleins en kreeg een verhaal erbij. Zo hoort vakantie te werken.';stats={Happiness:4};icon='🛍️';d.souvenirs++;if(typeof giveItem180==='function')giveItem180('jamaica_souvenir')}
    if(place==='jamaica'&&id==='boat'){title='Boat trip';txt='De boottocht was mooi, warm en net spannend genoeg.';stats={Happiness:8,Health:1,Stamina:-5};icon='⛵'}
    if(place==='jamaica'&&id==='football'){title='Beach football';txt='Voetbal op zand is zwaar, maar de sfeer maakte alles beter.';stats={Fitness:3,Happiness:5,Stamina:-4};icon='⚽'}
    if(place==='jamaica'&&id==='tourism'){title='Tour guide network';txt='Je bouwde resident netwerk op in toerisme. Rustige vibe, echte kansen.';stats={Smarts:2,Happiness:3};icon='🏝️';d.contacts++}
    if(place==='nightcity'&&id==='neon'){title='Neon walk';txt='Elke straat voelde als kans én waarschuwing.';stats={Happiness:4,Smarts:1,Stamina:-5};icon='🌃';type='warn';state.nc=state.nc||{};state.nc.streetCred=c185((state.nc.streetCred||0)+r185(1,3))}
    if(place==='nightcity'&&id==='fixer'){title='Meet Fixer';txt='Geen vragen, alleen risico en beloning.';stats={Smarts:2,Happiness:1};icon='🕶️';type='warn';state.nc=state.nc||{};state.nc.streetCred=c185((state.nc.streetCred||0)+r185(2,6));state.nc.heat=c185((state.nc.heat||0)+r185(1,5))}
    if(place==='nightcity'&&id==='fight'){title='Underground Fight Pit';txt='Je zag of deed mee aan een rauwe fight night. Niet netjes, wel leerzaam.';stats={Fitness:2,Health:-3,Stamina:-8,Happiness:3};icon='🥊';type='warn';state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r185(1,4)}
    if(place==='nightcity'&&id==='clinic'){title='Cyber Clinic';txt='De kliniek rook naar metaal en slechte keuzes. Cyberware omhoog, menselijkheid omlaag.';stats={Fitness:2,Health:-2};icon='🦾';type='warn';state.nc=state.nc||{};state.nc.cyberware=c185((state.nc.cyberware||0)+r185(3,8));state.nc.humanity=c185((state.nc.humanity||100)-r185(2,7))}
    msg185(icon,title,txt,stats,0,type);
  };
  window.dlc185Special=function(place){
    place=norm185(place);
    const d=ensureDLCState185(place);d.memories=(d.memories||0)+1;
    const events={
      spain:[['🎭','Straatfestival','Je belandde onverwacht in een Spaans straatfestival. Muziek, eten en chaos maakten de dag memorabel.',{Happiness:9,Looks:1,Stamina:-5},'good'],['⚽','Voetbalmoment','Een lokale groep vroeg je mee te spelen. Technisch werd je getest, sociaal won je punten.',{Fitness:3,Happiness:6,Stamina:-5},'good'],['🔥','Hitte en siësta','De hitte sloeg hard toe. Je koos rust boven koppigheid en herstelde goed.',{Health:2,Stamina:8,Happiness:2},'good']],
      america:[['🎬','Celebrity sighting','Je zag een bekende kop en je content ging iets beter dan normaal.',{Happiness:7,Looks:1},'good'],['🚓','Roadside weirdness','Een rare roadtrip situatie kostte energie, maar leverde een verhaal op.',{Smarts:2,Stamina:-5},'warn'],['🥊','Fight poster','Je zag een lokale fight poster en kreeg zin om te trainen.',{Fitness:1,Happiness:4},'good']],
      japan:[['🎎','Matsuri festival','Je kwam terecht in een lokaal festival vol eten, licht en ritueel.',{Happiness:9,Smarts:2,Stamina:-4},'good'],['🚆','Trein chaos','Je pakte de verkeerde trein, maar ontdekte een leuke wijk.',{Smarts:2,Happiness:3,Stamina:-5},'warn'],['🎮','Arcade rival','Een random speler daagde je uit en je won respect.',{Happiness:6,Smarts:2},'good']],
      amsterdam:[['🌧️','Regenbui','Je werd natgeregend maar vond een gezellige plek om te schuilen.',{Happiness:3,Stamina:-2},'warn'],['🎶','Straatmuziek','Een straatmuzikant maakte de stad even filmisch.',{Happiness:5},'good'],['🚲','Fietschaos','Amsterdamse fietsers testten je reactievermogen.',{Smarts:1,Stamina:-2},'warn']],
      jamaica:[['🌅','Sunset moment','De zonsondergang voelde als een save point.',{Happiness:8,Health:1},'good'],['🎶','Local jam','Je werd meegetrokken in muziek en ritme.',{Happiness:8,Stamina:-3},'good'],['🌧️','Tropische bui','Alles werd nat, maar de sfeer bleef goed.',{Happiness:2,Stamina:-2},'warn']],
      nightcity:[['🧨','Neon trouble','Een deal in de buurt liep bijna mis. Je kwam weg, maar heat steeg.',{Smarts:2,Health:-2},'warn'],['💾','Data shard','Je vond een vreemde data shard. Mogelijk nuttig, mogelijk gevaarlijk.',{Smarts:3},'warn'],['🎛️','Underground DJ','Een clubavond werd beter dan veilig was.',{Happiness:8,Stamina:-8},'warn']]
    };
    const ev=p185(events[place]||events.spain);
    msg185(ev[0],ev[1],ev[2],ev[3],0,ev[4]);
  };

  // Deduped world map: Spain once, no Alkmaar duplicate.
  function placeObj185(id){
    const p=(window.BITZ_PLACES||{})[id]||{};
    if(id==='spain')return Object.assign({id:'spain',name:'Spanje',country:'Spanje',icon:'🇪🇸',travelCost:1300,permanentMoveCost:2600,rentMultiplier:1.18,jobMultiplier:.98,crimeRisk:8},p,{id:'spain',name:'Spanje',icon:'🇪🇸'});
    return Object.assign({id,name:label185(id),icon:icon185(id)},p,{id:norm185(id),name:label185(id),icon:icon185(id)});
  }
  function moveResident185(id){
    id=norm185(id);
    const deny=travelDeny185(); if(deny)return toast185(deny);
    const cfg=DLC185[id]||{}, cost=cfg.moveCost||1600;
    if((state.money||0)<cost)return toast185('Niet genoeg geld: '+m185(cost));
    state.money-=cost;state.vacation=null;state.world=id;state.placeId=id;state.homePlaceId=id;
    msg185(icon185(id),'Verhuisd naar '+label185(id),`Je woont nu in ${label185(id)}. Resident-only opties staan open.`,{Happiness:2,Stamina:-4},0,'good');
  }
  window.moveResident185=moveResident185;
  window.worldMapScreen174=function(){
    normalize185();
    const order=['enkhuizen','amsterdam','spain','america','japan','jamaica','nightcity'];
    const rows=order.map(id=>{
      const p=placeObj185(id), active=current185()===id, cfg=DLC185[id]||{};
      const travel=cfg.travelCost||p.travelCost||0, move=cfg.moveCost||p.permanentMoveCost||0;
      return `<div class="dlc185-row ${active?'locked':''}" onclick="${active?`vacationHub180('${id}')`:`placeDetailScreen174('${id}')`}"><div class="ico">${p.icon}</div><div><div class="title">${p.name}${active?' · HIER':''}</div><div class="sub">${p.country||''} · vakantie ${travel?m185(travel):'thuis'} · wonen ${move?m185(move):'-'} · jobs x${p.jobMultiplier||1}</div></div><div class="chev">›</div></div>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">🌍</div><div class="modalTitle">Wereldkaart v18.5</div></div><div class="modalBody dlc185-wrap"><div class="dlc185-card"><b>Geen dubbele Spanje meer</b><br>Alkmaar is verwijderd uit de lijst en oude Alkmaar-saves worden naar Spanje geleid.</div>${rows}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.worldMapScreen169=window.worldMapScreen174;
  try{worldMapScreen169=window.worldMapScreen174}catch(e){}
  window.placeDetailScreen174=function(id){
    id=norm185(id); const p=placeObj185(id), cfg=DLC185[id]||{};
    const at=current185()===id;
    const vacationBtn=id==='enkhuizen'?'':`<button class="btn" onclick="travel${id==='spain'?'Spain':id==='america'?'America':id==='japan'?'Japan':id==='amsterdam'?'Amsterdam':id==='jamaica'?'Jamaica':'NightCity'}180()">✈️ Op vakantie · ${m185(cfg.travelCost||p.travelCost||0)}</button>`;
    const moveBtn=id==='enkhuizen'?'':`<button class="btn gold" onclick="moveResident185('${id}')">🏠 Hier wonen · ${m185(cfg.moveCost||p.permanentMoveCost||0)}</button>`;
    showModal(`<div class="modalTop"><div class="avatar">${p.icon}</div><div class="modalTitle">${p.name}</div></div><div class="modalBody dlc185-wrap">${hero185(id)}${at?`<button class="btn green" onclick="vacationHub180('${id}')">Open ${p.name} DLC hub</button>`:''}${vacationBtn}${moveBtn}<button class="btn alt" onclick="worldMapScreen174()">Terug</button></div>`);
  };
  window.placeDetailScreen169=window.placeDetailScreen174;
  try{placeDetailScreen169=window.placeDetailScreen174}catch(e){}

  // Final activities override, loaded after school/combat patch: vacation gets rich actions, resident gets resident hub + other systems.
  const oldActivities185=window.activitiesHTML||(typeof activitiesHTML==='function'?activitiesHTML:null);
  window.activitiesHTML=function(){
    normalize185();
    if(state.vacation){
      const place=norm185(state.vacation);
      return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">${icon185(place)} ${label185(place)} vakantie-DLC</div>`+dlcHome185(place);
    }
    const base=oldActivities185?oldActivities185():'';
    const place=current185();
    if(DLC185[place]&&place!=='enkhuizen'){
      return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">${icon185(place)} ${label185(place)} resident-DLC</div>`+dlcHome185(place)+base;
    }
    if(base.includes('Wereldkaart v18.5'))return base;
    return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">Wereld & vakantie-DLC</div>${row('🌍','Wereldkaart v18.5','Spanje, USA, Japan, Amsterdam, Jamaica en Night City','worldMapScreen174()')}`+base;
  };
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  const oldMigrate185=window.migrate||(typeof migrate==='function'?migrate:null);
  if(oldMigrate185&&!oldMigrate185.__v185){
    window.migrate=function(s){s=oldMigrate185(s);try{state=s;normalize185()}catch(e){}return s};
    window.migrate.__v185=true;try{migrate=window.migrate}catch(e){}
  }
  setTimeout(()=>{try{normalize185();if(window.BITZ_PLACES&&window.BITZ_PLACES.alkmaar)window.BITZ_PLACES.alkmaar.hidden=true;save185()}catch(e){}},350);
})();
