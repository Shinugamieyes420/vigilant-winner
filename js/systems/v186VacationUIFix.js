
/* v18.6 Vacation UI Click Fix + normal game layout */
(function(){
  function r186(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function p186(a){return a[Math.floor(Math.random()*a.length)]}
  function c186(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money186(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast186(t){try{toast(t)}catch(e){console.log(t)}}
  function save186(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function apply186(stats){
    try{applyStats(stats||{})}
    catch(e){
      state.stats=state.stats||{};stats=stats||{};
      Object.keys(stats).forEach(k=>{
        if(k==='Fitness')state.fitness=c186((state.fitness||50)+stats[k]);
        else if(k==='Stamina')state.stamina=c186((state.stamina||50)+stats[k]);
        else state.stats[k]=c186((state.stats[k]||50)+stats[k]);
      });
    }
  }
  function msg186(icon,title,text,stats,cash,type){
    if(cash)state.money=(state.money||0)+cash;
    apply186(stats||{});
    try{addLog('<b>'+title+'</b><br>'+text,type||'good',false)}catch(e){}
    try{
      showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p><button class="btn" onclick="closeModal()">Verder</button></div>`);
    }catch(e){toast186(title)}
    save186();
  }
  function norm186(x){
    x=(x||'').toString().toLowerCase();
    if(['usa','us','america','united_states','united states','amerika'].includes(x))return 'america';
    if(['japan','tokyo'].includes(x))return 'japan';
    if(['spain','spanje','alkmaar','barcelona','madrid','malaga','valencia','sevilla'].includes(x))return 'spain';
    if(['amsterdam'].includes(x))return 'amsterdam';
    if(['jamaica','kingston'].includes(x))return 'jamaica';
    if(['nightcity','night_city','night city','nc'].includes(x))return 'nightcity';
    if(['enkhuizen','nl','nederland','netherlands','home','normal'].includes(x))return 'enkhuizen';
    return x||'enkhuizen';
  }
  function label186(p){p=norm186(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function icon186(p){p=norm186(p);return {enkhuizen:'🏠',amsterdam:'🌉',spain:'🇪🇸',america:'🇺🇸',japan:'🇯🇵',jamaica:'🇯🇲',nightcity:'🌃'}[p]||'🌍'}
  function normalize186(){
    if(!state)return;
    ['vacation','world','city','placeId','homePlaceId','homeWorldBeforeVacation'].forEach(k=>{if(state[k])state[k]=norm186(state[k])});
  }
  function current186(){normalize186();return state.vacation?norm186(state.vacation):norm186(state.world||state.city||state.placeId||'enkhuizen')}
  function jail186(){try{if(typeof isInJail==='function')return !!isInJail()}catch(e){}return !!(state&&state.jail&&state.jail.yearsLeft>0)}
  function high186(){return !!(state.addiction&&(state.addiction.underInfluence||state.addiction.weedTrip||state.addiction.high||state.addiction.stoned))}
  function travelDeny186(){if(jail186())return 'Je zit vast. Vakantie/verhuizen is geblokkeerd.';if(high186())return 'Je bent onder invloed. Eerst uitrusten/ontnuchteren.';return ''}
  function dlcState186(place){
    place=norm186(place);
    state.dlcTravel=state.dlcTravel||{};
    state.dlcTravel[place]=state.dlcTravel[place]||{days:0,vibe:50,contacts:0,souvenirs:0,spent:0,memories:0,party:0,localRep:0};
    return state.dlcTravel[place];
  }
  function spend186(place,cost){
    cost=cost||0;
    if((state.money||0)<cost){toast186('Niet genoeg geld: '+money186(cost));return false}
    state.money-=cost;
    const d=dlcState186(place);
    d.spent=(d.spent||0)+cost;
    return true;
  }
  function setVacation186(place,cost){
    place=norm186(place);normalize186();
    const deny=travelDeny186(); if(deny)return toast186(deny);
    if(state.vacation)return toast186('Je bent al op vakantie. Keer eerst terug naar huis.');
    if(!spend186(place,cost))return;
    state.homeWorldBeforeVacation=state.world||state.city||state.placeId||'enkhuizen';
    state.vacation=place;
    const d=dlcState186(place); d.days=(d.days||0)+1;
    msg186(icon186(place),'Vakantie naar '+label186(place),`Je bent aangekomen in ${label186(place)}. De vakantie-DLC staat open met normale donkere BitzLife-layout.`,{Happiness:5,Stamina:-3},0,'good');
  }
  window.currentPlace180=current186;
  window.travelMode180=function(){return state.vacation?'vacation':'resident'};
  window.isInPlace180=function(place){place=norm186(place);return norm186(state.vacation)===place||norm186(state.world)===place||norm186(state.city)===place||norm186(state.placeId)===place};
  window.travelSpain180=function(){setVacation186('spain',1300)};
  window.travelAlkmaar180=window.travelSpain180;
  window.travelAmerica180=function(){setVacation186('america',3600)};
  window.travelJapan180=function(){setVacation186('japan',2800)};
  window.travelAmsterdam180=function(){setVacation186('amsterdam',120)};
  window.travelJamaica180=function(){setVacation186('jamaica',1800)};
  window.travelNightCity180=function(){setVacation186('nightcity',1200)};
  window.returnHome180=function(){
    normalize186();
    const deny=travelDeny186(); if(deny)return toast186(deny);
    if(!state.vacation)return toast186('Je bent niet op vakantie.');
    const from=state.vacation;
    state.vacation=null;
    state.world=state.homeWorldBeforeVacation||state.world||'enkhuizen';
    state.placeId=state.world;
    msg186('✈️','Terug naar huis',`Je vakantie in ${label186(from)} is voorbij.`,{Happiness:1,Stamina:-2},0,'good');
  };
  window.soberUp180=function(){
    state.addiction=state.addiction||{};
    ['underInfluence','weedTrip','high','stoned'].forEach(k=>state.addiction[k]=false);
    msg186('💧','Uitrusten / ontnuchteren','Je rustte uit en bent weer helder genoeg om veilig te reizen.',{Health:1,Stamina:8,Happiness:1},0,'good');
  };

  const CONFIG186={
    spain:{theme:'spain',travel:1300,move:2600,desc:'Zon, tapas, La Liga, strand, flamenco en nightlife.'},
    america:{theme:'america',travel:3600,move:7200,desc:'Roadtrips, diners, Hollywood, live sports, UFC en WWE.'},
    japan:{theme:'japan',travel:2800,move:5600,desc:'Ramen, Tokyo arcade, Shibuya, dojo, shrine en karaoke.'},
    amsterdam:{theme:'amsterdam',travel:120,move:800,desc:'Grachten, festivals, uitgaan, musea en creatieve media.'},
    jamaica:{theme:'jamaica',travel:1800,move:3600,desc:'Strand, reggae, local market, boat trips en beach football.'},
    nightcity:{theme:'nightcity',travel:1200,move:2400,desc:'Neon, clubs, fixers, fight pits en cyber clinics.'}
  };
  const ACTIONS186={
    spain:[
      ['Activiteiten','tapas','🥘','Tapas avond','Kies goedkoop lokaal, luxe rooftop of met locals eten',0,'choice'],
      ['Activiteiten','beach','🏖️','Costa del Sol stranddag','Relaxen, beach football of boottocht',0,'choice'],
      ['Activiteiten','football','⚽','La Liga voetbalbeleving','Wedstrijd, pickup match of scout/coach spreken',0,'choice'],
      ['Activiteiten','culture','⛪','Barcelona sightseeing','Architectuur, content en lokale geschiedenis',80,'run'],
      ['Activiteiten','language','📚','Spaanse taalles','Spanish skill voor betere Spanje-events',90,'run'],
      ['Activiteiten','gym','🥊','Spaanse boxing/fight gym','Combat training met hitte en discipline',130,'run'],
      ['Uitgaan & social','night','🌃','Uitgaan in Madrid','Tapasbar, club of flamenco night',0,'choice',18],
      ['Shop / content','market','🛍️','Mercado & souvenirs','Spaanse items, local food en contacten',60,'run'],
      ['Specials','special','✨','Spanje special event','Random locals, festival, voetbal of siësta event',0,'special'],
      ['Wonen / resident','tourism','🏨','Tourism network','Resident-only horeca/toerisme netwerk',120,'run',18,'resident'],
      ['Wonen / resident','business','🍹','Beach bar business check','Resident-only business kans',450,'run',18,'resident']
    ],
    america:[
      ['Activiteiten','diner','🍔','American Diner','Classic burger, eating challenge of locals spreken',0,'choice'],
      ['Activiteiten','road','🛣️','Roadtrip','Texas highway, national park of motel chaos',0,'choice',16],
      ['Activiteiten','hollywood','🎬','Hollywood / fame','Content, casting of Walk of Fame',0,'choice'],
      ['Activiteiten','sports','🏟️','Live sports night','NBA/NFL/MLS show en crowd vibe',140,'run'],
      ['Training','ufc','🥊','UFC Gym visit','MMA training en gym contact',160,'run',16],
      ['Training','wwe','🤼','WWE Performance Center','Wrestling drills en promo-vibe',220,'run',16],
      ['Specials','special','✨','USA special event','Celebrity, roadtrip, fight of hustle event',0,'special'],
      ['Wonen / resident','pitch','💼','Startup pitch','Resident-only business/investor route',900,'run',18,'resident']
    ],
    japan:[
      ['Activiteiten','ramen','🍜','Ramen route','Classic bowl, spicy challenge of hidden local spot',0,'choice'],
      ['Activiteiten','arcade','🕹️','Akihabara arcade','Retro, gacha of arcade tournament',0,'choice'],
      ['Uitgaan & social','night','🌃','Shibuya night','Night walk, karaoke of locals meet',0,'choice',14],
      ['Activiteiten','temple','⛩️','Tempel / shrine','Rust, wens en cultuur event',40,'run'],
      ['Training','dojo','🥋','Dojo training','Discipline, fight IQ en combat',160,'run',12],
      ['Activiteiten','language','📚','Japanse taalles','Japanese skill en smarts',120,'run',12],
      ['Specials','special','✨','Japan special event','Festival, train chaos, anime of arcade event',0,'special'],
      ['Wonen / resident','work','🏢','Werkcultuur netwerk','Resident-only job/culture route',220,'run',18,'resident']
    ],
    amsterdam:[
      ['Activiteiten','canal','🌉','Grachten dag','Wandeling, rondvaart of canal social',0,'choice'],
      ['Uitgaan & social','night','🎧','Uitgaan / club night','Club, comedy of late snack',0,'choice',18],
      ['Activiteiten','festival','🎪','Festival / event','Music, foodtruck of creator meet',120,'run',16],
      ['Activiteiten','museum','🖼️','Museum / cultuur','Smarts, content en rust',65,'run'],
      ['Shop / content','creative','📸','Creative content day','Camera/media netwerk en social groei',70,'run',13],
      ['Specials','special','✨','Amsterdam special event','Grachten, festival of lokale ontmoeting',0,'special'],
      ['Wonen / resident','media','💼','Media netwerkborrel','Resident-only creatieve business route',90,'run',18,'resident']
    ],
    jamaica:[
      ['Activiteiten','beach','🏖️','Beach day','Relax, snorkelen of beach football',0,'choice'],
      ['Uitgaan & social','music','🎸','Reggae night','Live band, dancehall of jam met locals',0,'choice',16],
      ['Shop / content','market','🛍️','Local market','Souvenir, food of local contact',55,'run'],
      ['Activiteiten','boat','⛵','Boat trip','Sea vibe, memories en kleine risico’s',120,'run',12],
      ['Activiteiten','football','⚽','Voetbal op strand','Fitness, friends en fun',0,'run',6],
      ['Specials','special','✨','Jamaica special event','Beach, music of local event',0,'special'],
      ['Wonen / resident','tourism','🏝️','Tour guide network','Resident-only tourism route',100,'run',18,'resident']
    ],
    nightcity:[
      ['Activiteiten','neon','🌃','Neon walk','Street vibe, danger en memories',30,'run',16],
      ['Uitgaan & social','club','🎛️','Neon club night','Main floor, backroom contact of veilig weg',0,'choice',18],
      ['Specials','fixer','🕶️','Meet fixer','Risky network en street cred',120,'run',18],
      ['Training','fight','🥊','Underground fight pit','Combat risk/reward',180,'run',18],
      ['Specials','special','✨','Night City special event','Neon, crime, tech of survival event',0,'special',16],
      ['Wonen / resident','clinic','🦾','Cyber clinic','Resident-only cyberware route',800,'run',18,'resident']
    ]
  };
  const CHOICES186={
    'spain:tapas':[
      ['🥖','Goedkope local tapas','€35 · happiness/health',35,{Happiness:5,Health:1},'Je zat tussen locals en kreeg gerechten die je niet kon uitspreken, maar wel onthield.','contact'],
      ['🍽️','Luxe rooftop tapas','€140 · looks/social',140,{Happiness:8,Looks:2,Stamina:-2},'De rooftop was duur, maar Spanje voelde ineens premium.','party'],
      ['👥','Tapas met locals','€60 · contacten',60,{Happiness:6,Smarts:1},'Je kreeg tips van locals die niet in toeristenapps staan.','contact']
    ],
    'spain:beach':[
      ['😴','Relaxen en herstellen','€20 · herstel',20,{Happiness:6,Health:2,Stamina:8},'Je deed weinig. Precies wat vakantie soms moet zijn.','relax'],
      ['⚽','Beach football','gratis · fitness/voetbal',0,{Fitness:3,Happiness:5,Stamina:-4},'Je speelde voetbal op het strand en werd technisch getest.','football'],
      ['⛵','Boottocht','€180 · memories/risico',180,{Happiness:9,Stamina:-5},'De boottocht was prachtig, al was je maag minder enthousiast.','memory']
    ],
    'spain:football':[
      ['🎟️','La Liga wedstrijd kijken','€110 · voetbal vibe',110,{Happiness:8,Smarts:1},'Het stadion voelde als theater met tackles. Pure voetbalcultuur.','football'],
      ['🥅','Pickup match meedoen','€15 · fitness/form',15,{Fitness:4,Happiness:5,Stamina:-6},'Je deed mee met een pickup match en moest technisch aan de bak.','football'],
      ['🕵️','Scout/coach aanspreken','€40 · kans op boost',40,{Smarts:2,Happiness:2},'Een lokale coach gaf feedback. Geen contract, wel richting.','contact']
    ],
    'spain:night':[
      ['🍻','Tapasbar avond','€70 · veilig social',70,{Happiness:7,Looks:1,Stamina:-4},'Je koos sfeer boven chaos. Slimme avond.','party'],
      ['🎧','Club in Madrid','€160 · party/fame/risico',160,{Happiness:10,Looks:2,Health:-1,Stamina:-10},'De club ging laat los. Je kwam terug met verhalen en weinig energie.','party'],
      ['💃','Flamenco night','€85 · cultuur/looks',85,{Happiness:8,Smarts:2,Stamina:-4},'Flamenco was intenser dan verwacht. Ritme, emotie en vuur.','culture']
    ],
    'america:diner':[
      ['🍔','Classic burger meal','€35 · simpel geluk',35,{Happiness:5,Health:-1},'De portie was belachelijk groot. Amerika in één bord.','memory'],
      ['🔥','Eating challenge','€55 · fame/risico',55,{Happiness:6,Health:-3},'Je deed een eating challenge. Niet slim, wel memorabel.','party'],
      ['👥','Praat met locals','€25 · contacten',25,{Happiness:4,Smarts:1},'Je raakte in gesprek over sport, werk en rare snelwegen.','contact']
    ],
    'america:road':[
      ['🛣️','Texas highway','€320 · classic roadtrip',320,{Happiness:9,Stamina:-9},'Lange wegen, diners en zonsondergang. Alles voelde groot.','memory'],
      ['🏞️','National park route','€260 · health/memories',260,{Happiness:8,Health:3,Stamina:-6},'De natuur was groter dan je telefoon kon vastleggen.','memory'],
      ['🏚️','Motel chaos stop','€120 · goedkoop/risico',120,{Happiness:4,Smarts:1,Stamina:-4},'Het motel was goedkoop en vreemd. Je sliep met één oog open.','danger']
    ],
    'america:hollywood':[
      ['📸','Content maken','€80 · social/looks',80,{Happiness:6,Looks:2},'Je maakte content in Hollywood en pakte online aandacht.','content'],
      ['🎭','Casting proberen','€140 · fame-kans',140,{Smarts:1,Happiness:4},'Je deed een kleine casting. Geen garantie, wel ervaring.','fame'],
      ['🚶','Walk of Fame tour','€55 · toerist maar leuk',55,{Happiness:5,Stamina:-2},'Toeristisch? Ja. Maar soms is dat precies vakantie.','memory']
    ],
    'japan:ramen':[
      ['🍜','Classic bowl','€28 · warm herstel',28,{Happiness:5,Health:1},'Een simpele kom ramen deed meer dan verwacht.','memory'],
      ['🌶️','Spicy challenge','€40 · risico/fame',40,{Happiness:6,Health:-1},'Je mond stond in brand, maar de mensen naast je juichten.','party'],
      ['🗺️','Hidden local spot','€60 · culture/contact',60,{Happiness:7,Smarts:2},'Je vond een klein zaakje buiten de drukte.','contact']
    ],
    'japan:arcade':[
      ['🕹️','Retro cabinets','€45 · gaming vibe',45,{Happiness:6,Smarts:1},'Je speelde oude cabinets en voelde pure arcade-energie.','memory'],
      ['🏆','Arcade tournament','€80 · skill/fame kans',80,{Happiness:8,Smarts:2,Stamina:-4},'Je deed mee aan een toernooi. Je handen deden pijn, je ego leefde.','fame'],
      ['🎁','Gacha hunt','€55 · souvenir kans',55,{Happiness:5},'Je bleef te lang hangen bij gacha machines. Natuurlijk.','souvenir']
    ],
    'japan:night':[
      ['🚶','Shibuya night walk','€60 · city vibe',60,{Happiness:7,Looks:1,Stamina:-3},'Shibuya voelde als een videogame met te veel NPC’s.','memory'],
      ['🎤','Karaoke box','€90 · social',90,{Happiness:9,Stamina:-5},'Je zong alsof niemand je kende. Dat hielp.','party'],
      ['👥','Meet locals','€70 · contact',70,{Happiness:5,Smarts:1},'Je kreeg tips voor plekken die je anders nooit zou vinden.','contact']
    ],
    'amsterdam:canal':[
      ['🚶','Grachten wandeling','gratis · rust',0,{Happiness:4,Stamina:-1},'Je liep langs de grachten en vergat even de drukte.','memory'],
      ['⛵','Rondvaart','€35 · toerist maar leuk',35,{Happiness:6,Smarts:1},'De rondvaart was toeristisch, maar eerlijk: best mooi.','memory'],
      ['💬','Canal social','€45 · relatie/social',45,{Happiness:6,Looks:1},'Je had een sociaal moment langs het water.','contact']
    ],
    'amsterdam:night':[
      ['🎧','Club night','€90 · party',90,{Happiness:8,Looks:1,Stamina:-8},'De club was druk en luid. Precies de bedoeling.','party'],
      ['😂','Comedy avond','€60 · happiness/smarts',60,{Happiness:7,Smarts:1},'De comedy avond was scherper dan verwacht.','memory'],
      ['🍟','Late snack run','€18 · veilig herstel',18,{Happiness:4,Health:-1},'Een late snack loste meer op dan je wilde toegeven.','relax']
    ],
    'jamaica:beach':[
      ['😴','Relax day','€25 · herstel',25,{Happiness:7,Health:2,Stamina:8},'Je deed bijna niks en dat was precies de winst.','relax'],
      ['🏊','Zwemmen/snorkel','€70 · health/memories',70,{Happiness:8,Health:2,Stamina:-4},'Het water was helder en je hoofd ook.','memory'],
      ['⚽','Beach football','gratis · fitness',0,{Fitness:3,Happiness:5,Stamina:-4},'Voetbal op strand is zwaarder dan het eruitziet.','football']
    ],
    'jamaica:music':[
      ['🎸','Live reggae band','€75 · music vibe',75,{Happiness:9,Stamina:-4},'De band speelde alsof de avond geen eindtijd had.','party'],
      ['💃','Dancehall night','€100 · social/risico',100,{Happiness:10,Looks:1,Health:-1,Stamina:-8},'Dancehall was energie, zweet en chaos.','party'],
      ['🪘','Jam met locals','€45 · contact/skill',45,{Happiness:7,Smarts:1},'Je jamde met locals en werd niet eens weggejaagd.','contact']
    ],
    'nightcity:club':[
      ['🎛️','Main floor','€90 · neon party',90,{Happiness:8,Looks:1,Stamina:-8},'Bass, neon en lichamen. Night City verkocht illusie per minuut.','party'],
      ['🕶️','Backroom contact','€150 · street cred/heat',150,{Smarts:2,Happiness:3},'Je kwam in een backroom terecht. Interessant, niet veilig.','danger'],
      ['🚪','Veilig terugtrekken','gratis · weinig risico',0,{Stamina:4,Happiness:1},'Je koos veiligheid. In Night City is dat soms de slimste flex.','relax']
    ]
  };
  function hero186(place){
    place=norm186(place);
    const d=dlcState186(place), cfg=CONFIG186[place]||{};
    return `<div class="vac186-hero ${cfg.theme||place}">
      <div class="vac186-title">${icon186(place)} ${label186(place)} DLC</div>
      <div class="vac186-sub">${cfg.desc||'Lokale vakantie-activiteiten.'}<br>${state.vacation?'Vakantie mode: tijdelijke fun, locals, nightlife en souvenirs.':'Wonen mode: resident routes, business en vaste netwerken.'}</div>
      <div class="vac186-badges"><span class="vac186-badge">Vibe ${d.vibe||50}%</span><span class="vac186-badge">Contacts ${d.contacts||0}</span><span class="vac186-badge">Memories ${d.memories||0}</span><span class="vac186-badge">Spent ${money186(d.spent||0)}</span></div>
    </div>`;
  }
  function actionDeny186(a){
    const minAge=a[7]||0, modeLock=a[8]||'both';
    if(jail186())return 'gevangenis-lock';
    if((state.age||0)<minAge)return 'vanaf '+minAge;
    if(modeLock==='resident'&&!state.vacation)return '';
    if(modeLock==='resident'&&state.vacation)return 'alleen wonen';
    if(modeLock==='vacation'&&!state.vacation)return 'alleen vakantie';
    if((state.money||0)<(a[5]||0))return 'te weinig geld';
    return '';
  }
  function row186(place,a){
    const section=a[0], id=a[1], ico=a[2], title=a[3], sub=a[4], cost=a[5]||0, type=a[6];
    const deny=actionDeny186(a);
    const fn = type==='choice' ? `dlc186Choice('${place}','${id}')` : type==='special' ? `dlc186Special('${place}')` : `dlc186Run('${place}','${id}')`;
    return `<div class="vac186-row ${deny?'locked':''}" onclick="${deny?'':fn}"><div class="ico">${ico}</div><div><div class="title">${title}</div><div class="sub">${sub}${cost?' · '+money186(cost):''}${deny?' · '+deny:''}</div></div><div class="chev">›</div></div>`;
  }
  function hubBody186(place){
    place=norm186(place);
    const actions=ACTIONS186[place]||[];
    const groups={};
    actions.forEach(a=>{groups[a[0]]=groups[a[0]]||[];groups[a[0]].push(a)});
    let body=hero186(place);
    Object.keys(groups).forEach(g=>{body+=`<div class="vac186-section">${g}</div>`+groups[g].map(a=>row186(place,a)).join('')});
    if(state.vacation)body+=`<div class="vac186-section">Reizen</div><div class="vac186-row" onclick="returnHome180()"><div class="ico">✈️</div><div><div class="title">Terug naar huis</div><div class="sub">Vakantie afsluiten</div></div><div class="chev">›</div></div>`;
    if(high186())body+=`<button class="btn" onclick="soberUp180()">💧 Uitrusten / ontnuchteren</button>`;
    return body;
  }
  window.vacationHub180=function(place){
    place=norm186(place||current186());
    if(jail186())return toast186('Je zit vast. Vakantie en verhuizen zijn geblokkeerd.');
    if(!window.isInPlace180(place))return toast186('Je bent niet in '+label186(place)+'.');
    showModal(`<div class="modalTop"><div class="avatar">${icon186(place)}</div><div class="modalTitle">${label186(place)} DLC</div></div><div class="modalBody vac186-wrap">${hubBody186(place)}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.spainHub180=function(){vacationHub180('spain')};
  window.alkmaarHub180=window.spainHub180;
  window.usaHub180=function(){vacationHub180('america')};
  window.japanHub180=function(){vacationHub180('japan')};
  window.amsterdamHub180=function(){vacationHub180('amsterdam')};
  window.jamaicaHub180=function(){vacationHub180('jamaica')};
  window.nightCityVacationHub180=function(){vacationHub180('nightcity')};

  window.dlc186Choice=function(place,key){
    place=norm186(place);
    const list=CHOICES186[place+':'+key]||[];
    if(!list.length)return dlc186Run(place,key);
    const rows=list.map((ch,i)=>{
      const locked=(state.money||0)<ch[3];
      return `<div class="vac186-row ${locked?'locked':''}" onclick="${locked?'':`dlc186ChoicePick('${place}','${key}',${i})`}"><div class="ico">${ch[0]}</div><div><div class="title">${ch[1]}</div><div class="sub">${ch[2]}</div></div><div class="chev">›</div></div>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">${icon186(place)}</div><div class="modalTitle">${label186(place)} keuze</div></div><div class="modalBody vac186-wrap">${hero186(place)}${rows}<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button></div>`);
  };
  window.dlc186ChoicePick=function(place,key,i){
    place=norm186(place);
    const ch=(CHOICES186[place+':'+key]||[])[i];
    if(!ch)return toast186('Keuze niet gevonden.');
    if(!spend186(place,ch[3]))return;
    const d=dlcState186(place);
    d.vibe=c186((d.vibe||50)+r186(2,7));
    d.memories=(d.memories||0)+1;
    if(ch[6]==='contact')d.contacts=(d.contacts||0)+1;
    if(ch[6]==='party')d.party=(d.party||0)+1;
    if(ch[6]==='souvenir'){d.souvenirs=(d.souvenirs||0)+1}
    if(ch[6]==='content'||ch[6]==='fame')state.social=(state.social||0)+r186(8,60);
    if(ch[6]==='football'){state.football=state.football||{};state.football.form=c186((state.football.form||50)+r186(2,6))}
    if(ch[6]==='danger'){state.nc=state.nc||{};state.nc.heat=c186((state.nc.heat||0)+r186(3,9));state.nc.streetCred=c186((state.nc.streetCred||0)+r186(2,7))}
    msg186(ch[0],ch[1],ch[5],ch[4],0,ch[6]==='danger'?'warn':'good');
  };
  window.dlc186Run=function(place,id){
    place=norm186(place);
    const act=(ACTIONS186[place]||[]).find(a=>a[1]===id);
    if(act&&act[5]&&!spend186(place,act[5]))return;
    const d=dlcState186(place);
    d.memories=(d.memories||0)+1; d.vibe=c186((d.vibe||50)+r186(1,5));
    let title='DLC activiteit', icon=icon186(place), text='Je deed een lokale activiteit.', stats={Happiness:3}, type='good';
    const set=(ic,ti,tx,st,tp)=>{icon=ic;title=ti;text=tx;stats=st||stats;type=tp||type};
    if(place==='spain'&&id==='culture')set('⛪','Barcelona sightseeing','Je liep langs architectuur, pleinen en straatmuziek. Spanje voelde ineens veel minder leeg.',{Smarts:3,Happiness:6,Looks:1,Stamina:-4});
    if(place==='spain'&&id==='language'){state.skills=state.skills||{};state.skills.spanish=(state.skills.spanish||0)+r186(6,14);set('📚','Spaanse taalles','Je leerde genoeg Spaans om minder toerist te lijken. Lokale kansen worden makkelijker.',{Smarts:4,Stamina:-1});}
    if(place==='spain'&&id==='gym'){state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r186(2,5);set('🥊','Spaanse boxing/fight gym','Je trainde in een warme boxing gym. Geen glamour, wel discipline.',{Fitness:3,Stamina:-6,Health:-1});}
    if(place==='spain'&&id==='market'){d.souvenirs=(d.souvenirs||0)+1;if(typeof giveItem180==='function'&&Math.random()<.6)giveItem180('spain_jersey');set('🛍️','Mercado','Je liep door een Spaanse mercado. Tussen shirts, eten en souvenirs pakte je echte vakantievibe.',{Happiness:5});}
    if(place==='spain'&&id==='tourism'){state.skills=state.skills||{};state.skills.tourism=(state.skills.tourism||0)+r186(4,10);d.contacts++;set('🏨','Tourism network','Je bouwde resident netwerk op in toerisme en horeca. Handig voor werk en business.',{Smarts:2,Happiness:2});}
    if(place==='spain'&&id==='business'){if(Math.random()<.55){state.businesses=state.businesses||[];state.businesses.push({name:'Costa Beach Bar',type:'horeca',city:'spain',level:1,reputation:25,customers:20,quality:24,marketing:22,monthlyRevenue:900,monthlyCosts:650,risk:28,debt:0});set('🍹','Beach bar business','Je vond een kans voor een kleine beach bar. Geen goudmijn, wel een echte Spaanse business-route.',{Smarts:2,Happiness:6})}else set('🍹','Beach bar business','De beach bar deal zag er leuk uit, maar de cijfers waren zwak. Je liep op tijd weg.',{Smarts:3,Happiness:-1},'warn')}
    if(place==='america'&&id==='sports')set('🏟️','Live Sports Night','De show rond de wedstrijd was bijna groter dan de sport zelf.',{Happiness:7,Smarts:1,Stamina:-3});
    if(place==='america'&&id==='ufc'){state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r186(2,5);set('🥊','UFC Gym Visit','Je trainde in een Amerikaanse MMA-gym. Hard, direct en leerzaam.',{Fitness:3,Stamina:-6,Health:-1});}
    if(place==='america'&&id==='wwe'){state.skills=state.skills||{};state.skills.wrestling=(state.skills.wrestling||0)+r186(2,5);set('🤼','WWE Performance Center','Je deed drills en promo-oefeningen. Zelfs de rondleiding voelde als try-out.',{Fitness:2,Happiness:5,Stamina:-4});}
    if(place==='america'&&id==='pitch')set('💼','Startup pitch','Je pitchte een idee. Amerika maakte de droom groter, maar de druk ook.',{Smarts:3,Happiness:2});
    if(place==='japan'&&id==='temple')set('⛩️','Shrine visit','Rust, ritueel en even geen haast. Dat is ook progressie.',{Smarts:2,Happiness:5,Stamina:2});
    if(place==='japan'&&id==='dojo'){state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r186(2,5);set('🥋','Dojo Training','Je trainde in een dojo. Minder show, meer discipline.',{Fitness:3,Smarts:2,Stamina:-5});}
    if(place==='japan'&&id==='language'){state.skills=state.skills||{};state.skills.japanese=(state.skills.japanese||0)+r186(5,12);set('📚','Japanse taalles','Je leerde basiszinnen en cultuurregels.',{Smarts:4,Stamina:-2});}
    if(place==='japan'&&id==='work'){d.contacts++;set('🏢','Werkcultuur netwerk','Je bouwde resident netwerk op. De lat ligt hoog, maar de route opent.',{Smarts:3,Happiness:-1});}
    if(place==='amsterdam'&&id==='festival'){state.social=(state.social||0)+r186(15,55);set('🎪','Festival / event','Veel mensen, muziek en energie. Amsterdam voelde weer levend.',{Happiness:8,Looks:1,Stamina:-10});}
    if(place==='amsterdam'&&id==='museum')set('🖼️','Museumdag','Je deed cultuur. Niet alles bleef hangen, maar je werd wel scherper.',{Smarts:4,Happiness:3,Stamina:-3});
    if(place==='amsterdam'&&id==='creative'){state.social=(state.social||0)+r186(10,45);set('📸','Creative content day','Je maakte content en sprak creatieve types. Goed voor media-vibe.',{Smarts:2,Looks:2,Happiness:4});}
    if(place==='amsterdam'&&id==='media'){d.contacts++;set('💼','Media netwerkborrel','Je sprak creatieve mensen. Eén contact kan later waarde hebben.',{Smarts:2,Looks:1});}
    if(place==='jamaica'&&id==='market'){d.souvenirs++;if(typeof giveItem180==='function')giveItem180('jamaica_souvenir');set('🛍️','Local Market','Je kocht iets kleins en kreeg een verhaal erbij. Zo hoort vakantie te werken.',{Happiness:4});}
    if(place==='jamaica'&&id==='boat')set('⛵','Boat trip','De boottocht was mooi, warm en net spannend genoeg.',{Happiness:8,Health:1,Stamina:-5});
    if(place==='jamaica'&&id==='football')set('⚽','Beach football','Voetbal op zand is zwaar, maar de sfeer maakte alles beter.',{Fitness:3,Happiness:5,Stamina:-4});
    if(place==='jamaica'&&id==='tourism'){d.contacts++;set('🏝️','Tour guide network','Je bouwde resident netwerk op in toerisme. Rustige vibe, echte kansen.',{Smarts:2,Happiness:3});}
    if(place==='nightcity'&&id==='neon'){state.nc=state.nc||{};state.nc.streetCred=c186((state.nc.streetCred||0)+r186(1,3));set('🌃','Neon walk','Elke straat voelde als kans én waarschuwing.',{Happiness:4,Smarts:1,Stamina:-5},'warn');}
    if(place==='nightcity'&&id==='fixer'){state.nc=state.nc||{};state.nc.streetCred=c186((state.nc.streetCred||0)+r186(2,6));state.nc.heat=c186((state.nc.heat||0)+r186(1,5));set('🕶️','Meet Fixer','Geen vragen, alleen risico en beloning.',{Smarts:2,Happiness:1},'warn');}
    if(place==='nightcity'&&id==='fight'){state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r186(1,4);set('🥊','Underground Fight Pit','Je zag of deed mee aan een rauwe fight night. Niet netjes, wel leerzaam.',{Fitness:2,Health:-3,Stamina:-8,Happiness:3},'warn');}
    if(place==='nightcity'&&id==='clinic'){state.nc=state.nc||{};state.nc.cyberware=c186((state.nc.cyberware||0)+r186(3,8));state.nc.humanity=c186((state.nc.humanity||100)-r186(2,7));set('🦾','Cyber Clinic','De kliniek rook naar metaal en slechte keuzes. Cyberware omhoog, menselijkheid omlaag.',{Fitness:2,Health:-2},'warn');}
    msg186(icon,title,text,stats,0,type);
  };
  window.dlc186Special=function(place){
    place=norm186(place);
    const d=dlcState186(place);d.memories=(d.memories||0)+1;
    const events={
      spain:[['🎭','Straatfestival','Je belandde in een Spaans straatfestival. Muziek, eten en chaos maakten de dag memorabel.',{Happiness:9,Looks:1,Stamina:-5},'good'],['⚽','Voetbalmoment','Een lokale groep vroeg je mee te spelen. Technisch getest, sociaal gewonnen.',{Fitness:3,Happiness:6,Stamina:-5},'good'],['🔥','Hitte en siësta','De hitte sloeg hard toe. Je koos rust boven koppigheid en herstelde goed.',{Health:2,Stamina:8,Happiness:2},'good']],
      america:[['🎬','Celebrity sighting','Je zag een bekende kop en je content ging beter dan normaal.',{Happiness:7,Looks:1},'good'],['🚓','Roadside weirdness','Een rare roadtrip situatie kostte energie, maar leverde een verhaal op.',{Smarts:2,Stamina:-5},'warn']],
      japan:[['🎎','Matsuri festival','Je kwam terecht in een lokaal festival vol eten, licht en ritueel.',{Happiness:9,Smarts:2,Stamina:-4},'good'],['🚆','Trein chaos','Je pakte de verkeerde trein, maar ontdekte een leuke wijk.',{Smarts:2,Happiness:3,Stamina:-5},'warn']],
      amsterdam:[['🌧️','Regenbui','Je werd natgeregend maar vond een gezellige plek om te schuilen.',{Happiness:3,Stamina:-2},'warn'],['🎶','Straatmuziek','Een straatmuzikant maakte de stad even filmisch.',{Happiness:5},'good']],
      jamaica:[['🌅','Sunset moment','De zonsondergang voelde als een save point.',{Happiness:8,Health:1},'good'],['🎶','Local jam','Je werd meegetrokken in muziek en ritme.',{Happiness:8,Stamina:-3},'good']],
      nightcity:[['🧨','Neon trouble','Een deal in de buurt liep bijna mis. Je kwam weg, maar heat steeg.',{Smarts:2,Health:-2},'warn'],['💾','Data shard','Je vond een vreemde data shard. Mogelijk nuttig, mogelijk gevaarlijk.',{Smarts:3},'warn']]
    };
    const ev=p186(events[place]||events.spain);
    msg186(ev[0],ev[1],ev[2],ev[3],0,ev[4]);
  };

  // Use a deduped dark world map too.
  window.moveResident185=function(id){
    id=norm186(id);
    const deny=travelDeny186(); if(deny)return toast186(deny);
    const cost=(CONFIG186[id]||{}).move||1600;
    if((state.money||0)<cost)return toast186('Niet genoeg geld: '+money186(cost));
    state.money-=cost;state.vacation=null;state.world=id;state.placeId=id;state.homePlaceId=id;
    msg186(icon186(id),'Verhuisd naar '+label186(id),`Je woont nu in ${label186(id)}. Resident-only opties staan open.`,{Happiness:2,Stamina:-4},0,'good');
  };
  window.worldMapScreen174=function(){
    normalize186();
    const order=['enkhuizen','amsterdam','spain','america','japan','jamaica','nightcity'];
    const rows=order.map(id=>{
      const cfg=CONFIG186[id]||{}, active=current186()===id;
      const sub = id==='enkhuizen' ? 'Thuisbasis / Nederland' : `vakantie ${money186(cfg.travel||0)} · wonen ${money186(cfg.move||0)}`;
      return `<div class="vac186-row ${active?'locked':''}" onclick="${active?`vacationHub180('${id}')`:`placeDetailScreen174('${id}')`}"><div class="ico">${icon186(id)}</div><div><div class="title">${label186(id)}${active?' · HIER':''}</div><div class="sub">${sub}</div></div><div class="chev">›</div></div>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">🌍</div><div class="modalTitle">Wereldkaart v18.6</div></div><div class="modalBody vac186-wrap"><div class="vac186-card"><b>Wereld & DLC</b><br>Spanje staat één keer. Alkmaar is verwijderd uit de lijst en oude Alkmaar-saves gaan naar Spanje.</div>${rows}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.worldMapScreen169=window.worldMapScreen174;
  try{worldMapScreen169=window.worldMapScreen174}catch(e){}
  window.placeDetailScreen174=function(id){
    id=norm186(id);
    const cfg=CONFIG186[id]||{};
    const canTravel=id!=='enkhuizen';
    const travelFn={spain:'travelSpain180()',america:'travelAmerica180()',japan:'travelJapan180()',amsterdam:'travelAmsterdam180()',jamaica:'travelJamaica180()',nightcity:'travelNightCity180()'}[id];
    const body=`${hero186(id)}${current186()===id?`<div class="vac186-row" onclick="vacationHub180('${id}')"><div class="ico">${icon186(id)}</div><div><div class="title">Open ${label186(id)} hub</div><div class="sub">Activiteiten, uitgaan, specials en resident routes</div></div><div class="chev">›</div></div>`:''}${canTravel?`<div class="vac186-row" onclick="${travelFn}"><div class="ico">✈️</div><div><div class="title">Op vakantie</div><div class="sub">${money186(cfg.travel||0)}</div></div><div class="chev">›</div></div><div class="vac186-row" onclick="moveResident185('${id}')"><div class="ico">🏠</div><div><div class="title">Hier wonen</div><div class="sub">${money186(cfg.move||0)} · resident routes</div></div><div class="chev">›</div></div>`:''}<button class="btn alt" onclick="worldMapScreen174()">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">${icon186(id)}</div><div class="modalTitle">${label186(id)}</div></div><div class="modalBody vac186-wrap">${body}</div>`);
  };
  window.placeDetailScreen169=window.placeDetailScreen174;
  try{placeDetailScreen169=window.placeDetailScreen174}catch(e){}

  // Final activities override after all other systems: keeps rich DLC clickable and dark.
  const oldAct186=window.activitiesHTML||(typeof activitiesHTML==='function'?activitiesHTML:null);
  window.activitiesHTML=function(){
    normalize186();
    if(state.vacation){
      const place=norm186(state.vacation);
      return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">${icon186(place)} ${label186(place)} vakantie-DLC</div>`+hubBody186(place);
    }
    const base=oldAct186?oldAct186():'';
    const place=current186();
    if(CONFIG186[place]&&place!=='enkhuizen'){
      return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">${icon186(place)} ${label186(place)} resident-DLC</div>`+hubBody186(place)+base;
    }
    return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">Wereld & vakantie-DLC</div>${row('🌍','Wereldkaart v18.6','Spanje, USA, Japan, Amsterdam, Jamaica en Night City','worldMapScreen174()')}`+base;
  };
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  // Aliases to final hubs
  [['spainVacationScreen','spainHub180'],['spainHub','spainHub180'],['showSpain','spainHub180'],['alkmaarVacationScreen','spainHub180'],['alkmaarHub','spainHub180'],['showAlkmaar','spainHub180'],['americaVacationScreen','usaHub180'],['usaVacationScreen','usaHub180'],['americaHub','usaHub180'],['usaHub','usaHub180'],['showAmerica','usaHub180'],['showUSA','usaHub180'],['japanVacationScreen','japanHub180'],['tokyoVacationScreen','japanHub180'],['japanHub','japanHub180'],['tokyoHub','japanHub180'],['showJapan','japanHub180'],['amsterdamVacationScreen','amsterdamHub180'],['amsterdamHub','amsterdamHub180'],['showAmsterdam','amsterdamHub180'],['jamaicaVacationScreen','jamaicaHub180'],['jamaicaHub','jamaicaHub180'],['showJamaica','jamaicaHub180'],['nightCityVacationScreen','nightCityVacationHub180'],['nightCityHub','nightCityVacationHub180']].forEach(pair=>{window[pair[0]]=window[pair[1]];try{globalThis[pair[0]]=window[pair[1]]}catch(e){}});
  const oldMig186=window.migrate||(typeof migrate==='function'?migrate:null);
  if(oldMig186&&!oldMig186.__v186){
    window.migrate=function(s){s=oldMig186(s);try{state=s;normalize186()}catch(e){}return s};
    window.migrate.__v186=true;try{migrate=window.migrate}catch(e){}
  }
  setTimeout(()=>{try{normalize186();save186()}catch(e){}},300);
})();
