
/* v18.7 Vacation Effects + Nightlife + DLC Shops
   Fixes: vacation actions now directly update visible stats + adds nightlife/flirt/drinks/items for every DLC. */
(function(){
  function r187(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function p187(a){return a[Math.floor(Math.random()*a.length)]}
  function c187(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money187(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast187(t){try{toast(t)}catch(e){console.log(t)}}
  function save187(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function norm187(x){
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
  function label187(p){p=norm187(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function icon187(p){p=norm187(p);return {enkhuizen:'🏠',amsterdam:'🌉',spain:'🇪🇸',america:'🇺🇸',japan:'🇯🇵',jamaica:'🇯🇲',nightcity:'🌃'}[p]||'🌍'}
  function normalize187(){
    if(!state)return;
    ['vacation','world','city','placeId','homePlaceId','homeWorldBeforeVacation'].forEach(k=>{if(state[k])state[k]=norm187(state[k])});
  }
  function current187(){normalize187();return state.vacation?norm187(state.vacation):norm187(state.world||state.city||state.placeId||'enkhuizen')}
  function jail187(){try{if(typeof isInJail==='function')return !!isInJail()}catch(e){}return !!(state&&state.jail&&state.jail.yearsLeft>0)}
  function high187(){return !!(state.addiction&&(state.addiction.underInfluence||state.addiction.weedTrip||state.addiction.high||state.addiction.stoned||state.addiction.alcoholBuzz))}
  function travelDeny187(){if(jail187())return 'Je zit vast. Vakantie/verhuizen is geblokkeerd.';if(high187())return 'Je bent onder invloed. Eerst uitrusten/ontnuchteren.';return ''}
  function dlcState187(place){
    place=norm187(place);
    state.dlcTravel=state.dlcTravel||{};
    state.dlcTravel[place]=state.dlcTravel[place]||{days:0,vibe:50,contacts:0,souvenirs:0,spent:0,memories:0,party:0,localRep:0,romance:0};
    return state.dlcTravel[place];
  }
  function spend187(place,cost){
    cost=cost||0;
    if((state.money||0)<cost){toast187('Niet genoeg geld: '+money187(cost));return false}
    state.money-=cost;
    const d=dlcState187(place); d.spent=(d.spent||0)+cost;
    return true;
  }
  function effectText187(stats,cash){
    const parts=[];
    stats=stats||{};
    Object.keys(stats).forEach(k=>{if(stats[k])parts.push(`${k} ${stats[k]>0?'+':''}${stats[k]}`)});
    if(cash)parts.push(`Money ${cash>0?'+':''}${money187(cash)}`);
    return parts.join(' · ');
  }
  function bumpRaw187(key,delta){
    if(!delta)return;
    state.stats=state.stats||{};
    const top = {Happiness:'happiness',Health:'health',Smarts:'smarts',Looks:'looks'}[key];
    if(['Happiness','Health','Smarts','Looks'].includes(key)) state.stats[key]=c187((state.stats[key]??50)+delta);
    if(top && typeof state[top]==='number') state[top]=c187(state[top]+delta);
    if(key==='Fitness') state.fitness=c187((state.fitness??50)+delta);
    if(key==='Stamina') state.stamina=c187((state.stamina??50)+delta);
    if(key==='Social') state.social=c187((state.social??0)+delta,0,9999);
    if(key==='Fame') state.fame=c187((state.fame??0)+delta,0,9999);
  }
  function apply187(stats){
    stats=stats||{};
    try{applyStats(stats)}catch(e){}
    Object.keys(stats).forEach(k=>bumpRaw187(k,stats[k]));
  }
  function logMsg187(icon,title,text,stats,cash,type){
    stats=stats||{};
    if(cash)state.money=(state.money||0)+cash;
    apply187(stats);
    const fx=effectText187(stats,cash);
    try{addLog('<b>'+title+'</b><br>'+text+(fx?'<br><span class="mini">Effect: '+fx+'</span>':''),type||'good',false)}catch(e){}
    try{
      showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${fx?`<div class="vac187-effect">Effect: ${fx}</div>`:''}<button class="btn" onclick="closeModal()">Verder</button></div>`);
    }catch(e){toast187(title)}
    save187();
  }
  function setVacation187(place,cost){
    place=norm187(place);normalize187();
    const deny=travelDeny187(); if(deny)return toast187(deny);
    if(state.vacation)return toast187('Je bent al op vakantie. Keer eerst terug naar huis.');
    if(!spend187(place,cost))return;
    state.homeWorldBeforeVacation=state.world||state.city||state.placeId||'enkhuizen';
    state.vacation=place;
    const d=dlcState187(place); d.days=(d.days||0)+1;
    logMsg187(icon187(place),'Vakantie naar '+label187(place),`Je bent aangekomen in ${label187(place)}. Vakantie-acties geven nu zichtbaar effect op stats, geld, contacten, items en herinneringen.`,{Happiness:5,Stamina:-3},0,'good');
  }
  window.currentPlace180=current187;
  window.travelMode180=function(){return state.vacation?'vacation':'resident'};
  window.isInPlace180=function(place){place=norm187(place);return norm187(state.vacation)===place||norm187(state.world)===place||norm187(state.city)===place||norm187(state.placeId)===place};
  window.travelSpain180=function(){setVacation187('spain',1300)};
  window.travelAlkmaar180=window.travelSpain180;
  window.travelAmerica180=function(){setVacation187('america',3600)};
  window.travelJapan180=function(){setVacation187('japan',2800)};
  window.travelAmsterdam180=function(){setVacation187('amsterdam',120)};
  window.travelJamaica180=function(){setVacation187('jamaica',1800)};
  window.travelNightCity180=function(){setVacation187('nightcity',1200)};
  window.returnHome180=function(){
    normalize187();
    const deny=travelDeny187(); if(deny)return toast187(deny);
    if(!state.vacation)return toast187('Je bent niet op vakantie.');
    const from=state.vacation;
    state.vacation=null;
    state.world=state.homeWorldBeforeVacation||state.world||'enkhuizen';
    state.placeId=state.world;
    logMsg187('✈️','Terug naar huis',`Je vakantie in ${label187(from)} is voorbij.`,{Happiness:1,Stamina:-2},0,'good');
  };
  window.soberUp180=function(){
    state.addiction=state.addiction||{};
    ['underInfluence','weedTrip','high','stoned','alcoholBuzz'].forEach(k=>state.addiction[k]=false);
    logMsg187('💧','Uitrusten / ontnuchteren','Je nam rust, water en eten. Je bent weer helder genoeg om veilig te reizen.',{Health:2,Stamina:10,Happiness:1},0,'good');
  };

  const CONFIG187={
    spain:{theme:'spain',travel:1300,move:2600,desc:'Zon, tapas, La Liga, strand, flamenco en nightlife.'},
    america:{theme:'america',travel:3600,move:7200,desc:'Roadtrips, diners, Hollywood, live sports, UFC en WWE.'},
    japan:{theme:'japan',travel:2800,move:5600,desc:'Ramen, Tokyo arcade, Shibuya, dojo, shrine en karaoke.'},
    amsterdam:{theme:'amsterdam',travel:120,move:800,desc:'Grachten, festivals, uitgaan, musea en creatieve media.'},
    jamaica:{theme:'jamaica',travel:1800,move:3600,desc:'Strand, reggae, local market, boat trips en beach football.'},
    nightcity:{theme:'nightcity',travel:1200,move:2400,desc:'Neon, clubs, fixers, fight pits en cyber clinics.'}
  };
  const ACTIONS187={
    spain:[
      ['Activiteiten','tapas','🥘','Tapas avond','Eten met echte stat-effecten',45,'run'],
      ['Activiteiten','beach','🏖️','Costa del Sol stranddag','Relax, beach football of herstel',35,'run'],
      ['Activiteiten','football','⚽','La Liga voetbalbeleving','Wedstrijd/pickup/scout vibe',110,'run'],
      ['Activiteiten','culture','⛪','Barcelona sightseeing','Architectuur, content en lokale geschiedenis',80,'run'],
      ['Training','language','📚','Spaanse taalles','Spanish skill en smarts',90,'run',12],
      ['Training','gym','🥊','Spaanse boxing/fight gym','Combat training met hitte en discipline',130,'run',16],
      ['Uitgaan & social','nightlife','🌃','Uitgaan in Madrid','Drinken, flirten/daten, dansen of rustig socializen',0,'night',18],
      ['Shop / items','shop','🛍️','Spaanse shop & souvenirs','Shirt, flamenco gitaar, camera gear, zonnebril',0,'shop'],
      ['Specials','special','✨','Spanje special event','Random locals, festival, voetbal of siësta event',0,'special'],
      ['Wonen / resident','tourism','🏨','Tourism network','Resident-only horeca/toerisme netwerk',120,'run',18,'resident'],
      ['Wonen / resident','business','🍹','Beach bar business check','Resident-only business kans',450,'run',18,'resident']
    ],
    america:[
      ['Activiteiten','diner','🍔','American Diner','Diner food met zichtbare happiness/health',35,'run'],
      ['Activiteiten','road','🛣️','Roadtrip','Texas highway, nature of motel chaos',260,'run',16],
      ['Activiteiten','hollywood','🎬','Hollywood / fame','Content, casting of fame-kans',120,'run'],
      ['Activiteiten','sports','🏟️','Live sports night','NBA/NFL/MLS crowd vibe',140,'run'],
      ['Training','ufc','🥊','UFC Gym visit','MMA training en gym contact',160,'run',16],
      ['Training','wwe','🤼','WWE Performance Center','Wrestling drills en promo-vibe',220,'run',16],
      ['Uitgaan & social','nightlife','🌃','USA nightlife','Drinks, flirten, dansen, rooftop of safe diner',0,'night',18],
      ['Shop / items','shop','🛍️','USA shop','UFC glove, cowboy boots, Hollywood headshots, camera',0,'shop'],
      ['Specials','special','✨','USA special event','Celebrity, roadtrip, fight of hustle event',0,'special'],
      ['Wonen / resident','pitch','💼','Startup pitch','Resident-only business/investor route',900,'run',18,'resident']
    ],
    japan:[
      ['Activiteiten','ramen','🍜','Ramen route','Food, spicy challenge of hidden local spot',28,'run'],
      ['Activiteiten','arcade','🕹️','Akihabara arcade','Retro, gacha of arcade tournament',55,'run'],
      ['Activiteiten','temple','⛩️','Tempel / shrine','Rust, wens en cultuur event',40,'run'],
      ['Training','dojo','🥋','Dojo training','Discipline, fight IQ en combat',160,'run',12],
      ['Training','language','📚','Japanse taalles','Japanese skill en smarts',120,'run',12],
      ['Uitgaan & social','nightlife','🌃','Shibuya / karaoke night','Drinks, karaoke, flirten of locals meet',0,'night',18],
      ['Shop / items','shop','🛍️','Tokyo shop','Anime figure, samurai mask, arcade pass, streetwear',0,'shop'],
      ['Specials','special','✨','Japan special event','Festival, train chaos, anime of arcade event',0,'special'],
      ['Wonen / resident','work','🏢','Werkcultuur netwerk','Resident-only job/culture route',220,'run',18,'resident']
    ],
    amsterdam:[
      ['Activiteiten','canal','🌉','Grachten dag','Walk, rondvaart of canal social',0,'run'],
      ['Activiteiten','festival','🎪','Festival / event','Music, foodtruck of creator meet',120,'run',16],
      ['Activiteiten','museum','🖼️','Museum / cultuur','Smarts, content en rust',65,'run'],
      ['Shop / items','creative','📸','Creative content day','Camera/media netwerk en social groei',70,'run',13],
      ['Uitgaan & social','nightlife','🎧','Amsterdam uitgaan','Drinken, flirten/daten, club, comedy of late snack',0,'night',18],
      ['Shop / items','shop','🛍️','Amsterdam shop','Museumkaart, festival outfit, designer jacket, camera',0,'shop'],
      ['Specials','special','✨','Amsterdam special event','Grachten, festival of lokale ontmoeting',0,'special'],
      ['Wonen / resident','media','💼','Media netwerkborrel','Resident-only creatieve business route',90,'run',18,'resident']
    ],
    jamaica:[
      ['Activiteiten','beach','🏖️','Beach day','Relax, snorkelen of beach football',25,'run'],
      ['Activiteiten','boat','⛵','Boat trip','Sea vibe, memories en kleine risico’s',120,'run',12],
      ['Activiteiten','football','⚽','Voetbal op strand','Fitness, friends en fun',0,'run',6],
      ['Uitgaan & social','nightlife','🎸','Reggae / dancehall night','Drinken, dansen, flirten of live band',0,'night',18],
      ['Shop / items','market','🛍️','Local market','Souvenir, food of local contact',55,'run'],
      ['Shop / items','shop','🏝️','Jamaica shop','Souvenir, beach outfit, music item, travel camera',0,'shop'],
      ['Specials','special','✨','Jamaica special event','Beach, music of local event',0,'special'],
      ['Wonen / resident','tourism','🏝️','Tour guide network','Resident-only tourism route',100,'run',18,'resident']
    ],
    nightcity:[
      ['Activiteiten','neon','🌃','Neon walk','Street vibe, danger en memories',30,'run',16],
      ['Uitgaan & social','nightlife','🎛️','Neon club night','Drinks, flirten, backroom contact of safe exit',0,'night',18],
      ['Specials','fixer','🕶️','Meet fixer','Risky network en street cred',120,'run',18],
      ['Training','fight','🥊','Underground fight pit','Combat risk/reward',180,'run',18],
      ['Shop / items','shop','💽','Night City shop','Street mask, cyberdeck, neon jacket, medkit',0,'shop',16],
      ['Specials','special','✨','Night City special event','Neon, crime, tech of survival event',0,'special',16],
      ['Wonen / resident','clinic','🦾','Cyber clinic','Resident-only cyberware route',800,'run',18,'resident']
    ]
  };
  const NIGHT187={
    spain:[
      ['🍷','Drankjes in tapasbar','€55 · Happiness/Social +, Health/Stamina -',55,{Happiness:7,Social:8,Health:-1,Stamina:-4},'Je deed drankjes in een tapasbar. Sfeer top, energie iets minder.','drink'],
      ['💬','Flirten / date zoeken','€40 · Looks/Social/Happiness +',40,{Happiness:6,Looks:2,Social:10,Stamina:-2},'Je flirtte met iemand in Madrid. Geen garantie op liefde, wel een leuke avond.','romance'],
      ['💃','Flamenco & dansen','€85 · Happiness/Fitness +',85,{Happiness:8,Fitness:2,Stamina:-6},'Je danste en keek flamenco. Spanje voelde eindelijk levend.','party'],
      ['🌙','Rustige avondwandeling','gratis · Stamina/Health +',0,{Happiness:3,Health:1,Stamina:4},'Je koos een rustige avond. Soms is slim ook leuk.','safe']
    ],
    america:[
      ['🍺','Drinks in sports bar','€70 · Happiness/Social +',70,{Happiness:7,Social:8,Health:-1,Stamina:-4},'Je deed drankjes in een sports bar. Schermen overal, gesprekken overal.','drink'],
      ['💬','Flirten / date zoeken','€60 · Looks/Social +',60,{Happiness:6,Looks:2,Social:12,Stamina:-3},'Je flirtte tijdens een avond uit. Amerikaans direct, soms cringe, soms raak.','romance'],
      ['🎧','LA club night','€180 · Fame/Looks/Happiness +, risico',180,{Happiness:10,Looks:2,Fame:2,Health:-1,Stamina:-10},'De club was duur, luid en filmisch. Je kreeg aandacht, maar je lichaam betaalde.','party'],
      ['🍔','Late night diner','€35 · veilige social',35,{Happiness:5,Health:-1,Stamina:1},'Je eindigde veilig in een diner. Minder chaos, wel goed verhaal.','safe']
    ],
    japan:[
      ['🍶','Izakaya drinks','€65 · Happiness/Social +',65,{Happiness:7,Social:7,Health:-1,Stamina:-4},'Je dronk in een izakaya. Klein, warm, druk en sociaal.','drink'],
      ['🎤','Karaoke box','€90 · Happiness/Social +',90,{Happiness:9,Social:10,Stamina:-6},'Je zong alsof niemand je kende. Dat hielp enorm.','party'],
      ['💬','Flirten / locals ontmoeten','€55 · Social/Smarts +',55,{Happiness:5,Social:10,Smarts:1,Stamina:-2},'Je raakte aan de praat met locals. Niet makkelijk, wel waardevol.','romance'],
      ['🚶','Shibuya night walk','€30 · veilig city vibe',30,{Happiness:5,Looks:1,Stamina:-2},'Je liep door Shibuya zonder jezelf kapot te maken. Slimme vakantie.','safe']
    ],
    amsterdam:[
      ['🍻','Drinken in bar','€50 · Happiness/Social +',50,{Happiness:7,Social:8,Health:-1,Stamina:-4},'Je deed drankjes in Amsterdam. Gezellig, duurder dan gehoopt.','drink'],
      ['💬','Flirten / date zoeken','€35 · Looks/Social +',35,{Happiness:6,Looks:2,Social:10,Stamina:-2},'Je flirtte tijdens het uitgaan. Niet iedereen hapte, maar de avond leefde.','romance'],
      ['🎧','Club night','€90 · Happiness/Looks +',90,{Happiness:9,Looks:2,Health:-1,Stamina:-9},'De club was druk en hard. Precies waarvoor je kwam.','party'],
      ['🍟','Late snack run','€18 · kleine happiness',18,{Happiness:4,Health:-1},'Een late snack loste meer op dan je wilde toegeven.','safe']
    ],
    jamaica:[
      ['🍹','Drinks bij strandbar','€55 · Happiness/Social +',55,{Happiness:8,Social:7,Health:-1,Stamina:-3},'Je dronk bij een strandbar. Rustig begin, sterke sfeer.','drink'],
      ['💃','Dancehall night','€100 · party/social',100,{Happiness:10,Looks:1,Social:12,Health:-1,Stamina:-8},'Dancehall was energie, zweet en chaos.','party'],
      ['💬','Flirten / beach social','€40 · Social/Looks +',40,{Happiness:6,Looks:2,Social:9,Stamina:-2},'Je maakte contact op het strand. Relaxed, direct en vrolijk.','romance'],
      ['🎸','Live reggae band','€75 · happiness',75,{Happiness:9,Stamina:-4},'De band speelde alsof de avond geen eindtijd had.','safe']
    ],
    nightcity:[
      ['🍸','Neon drinks','€80 · Happiness/Social +, risk',80,{Happiness:8,Social:8,Health:-2,Stamina:-5},'De drankjes gloeiden bijna. Night City blijft slecht voor je gezondheid.','drink'],
      ['💬','Flirten in neon club','€90 · Looks/Social +, heat risk',90,{Happiness:6,Looks:2,Social:12,Stamina:-4},'Je flirtte in neonlicht. Mooi, gevaarlijk, niet helemaal betrouwbaar.','romance'],
      ['🎛️','Main floor club','€120 · party/heat',120,{Happiness:10,Looks:1,Health:-2,Stamina:-10},'Bass, rook en neon. Geweldig en twijfelachtig tegelijk.','party'],
      ['🚪','Veilig terugtrekken','gratis · Health/Stamina +',0,{Health:2,Stamina:5,Happiness:1},'Je koos veiligheid. In Night City is dat soms de slimste move.','safe']
    ]
  };
  const SHOP187={
    spain:[
      ['spain_jersey','🇪🇸','Spaans voetbalshirt',95,{Happiness:3,Looks:1},'Een Spaans voetbalshirt. Perfect voor La Liga en beach football.'],
      ['flamenco_guitar','🎸','Flamenco gitaar',430,{Happiness:4,Smarts:1},'Een flamenco gitaar. Muziekroute en content vibe.'],
      ['travel_sunglasses','🕶️','Spaanse zonnebril',65,{Looks:2,Happiness:1},'Zonnebril met vakantiegevoel.'],
      ['camera_gear','📷','Travel camera gear',900,{Smarts:2,Looks:1},'Camera gear voor betere content.']
    ],
    america:[
      ['ufc_gloves_signed','🥊','Signed UFC glove',1200,{Happiness:3,Fame:1},'Een gesigneerde UFC glove voor je collectie.'],
      ['cowboy_boots','🤠','Cowboy boots',220,{Looks:2,Happiness:2},'Cowboy boots. Niet subtiel, wel Amerika.'],
      ['hollywood_headshots','🎬','Hollywood headshots',350,{Looks:2,Fame:2},'Headshots voor fame/casting route.'],
      ['roadtrip_camera','📷','Roadtrip camera',650,{Smarts:1,Happiness:2},'Camera voor roadtrip content.']
    ],
    japan:[
      ['anime_figure','🧸','Anime figure',120,{Happiness:3},'Een anime figure voor je collectie.'],
      ['samurai_mask','👺','Samurai mask',900,{Happiness:3,Smarts:1},'Samurai mask met stijl en verhaal.'],
      ['arcade_pass','🕹️','Arcade pass',160,{Happiness:4,Smarts:1},'Arcade pass voor Tokyo vibe.'],
      ['tokyo_jacket','🧥','Tokyo streetwear jacket',620,{Looks:5,Happiness:3},'Tokyo streetwear jacket.']
    ],
    amsterdam:[
      ['museumkaart','🖼️','Museumkaart',75,{Smarts:2,Happiness:1},'Museumkaart voor cultuurdagen.'],
      ['festival_outfit','🎪','Festival outfit',180,{Looks:3,Happiness:2},'Festival outfit voor Amsterdam events.'],
      ['designer_jacket','🧥','Designer jacket',950,{Looks:6,Happiness:2},'Designer jacket. Duur maar status.'],
      ['camera_gear','📷','Camera gear',900,{Smarts:2,Looks:1},'Camera gear voor content.']
    ],
    jamaica:[
      ['jamaica_souvenir','🏝️','Jamaica souvenir',55,{Happiness:2},'Souvenir met strandvibe.'],
      ['beach_outfit','🩳','Beach outfit',85,{Looks:2,Happiness:2},'Beach outfit voor relax en social.'],
      ['reggae_record','🎸','Reggae record',70,{Happiness:3},'Reggae record voor thuis.'],
      ['travel_camera','📷','Travel camera',650,{Smarts:1,Happiness:2},'Camera voor vakantiefoto’s.']
    ],
    nightcity:[
      ['nightcity_mask','😷','Night City street mask',350,{Looks:2},'Street mask voor neon-straten.'],
      ['cyberdeck','💽','Cyberdeck',2400,{Smarts:6},'Cyberdeck voor digitale klussen.'],
      ['neon_jacket','🧥','Neon jacket',520,{Looks:4,Happiness:2},'Neon jacket. Subtiel is dood.'],
      ['black_market_medkit','🧰','Black-market medkit',450,{Health:3},'Medkit. Handig maar shady.']
    ]
  };
  function itemGive187(id,icon,name,price,effects,desc,place){
    state.items=state.items||[];
    state.items.push({id:id,name:name,icon:icon,cat:'DLC '+label187(place),price:price,value:price,durability:100,broken:false,createdAge:state.age,source:'v18.7 vacation shop',use:desc,effects:effects});
  }
  function actionDeny187(a){
    const minAge=a[7]||0, mode=a[8]||'both';
    if(jail187())return 'gevangenis-lock';
    if((state.age||0)<minAge)return 'vanaf '+minAge;
    if(mode==='resident'&&state.vacation)return 'alleen wonen';
    if(mode==='vacation'&&!state.vacation)return 'alleen vakantie';
    if((state.money||0)<(a[5]||0))return 'te weinig geld';
    return '';
  }
  function hero187(place){
    place=norm187(place);
    const d=dlcState187(place), cfg=CONFIG187[place]||{};
    return `<div class="vac186-hero ${cfg.theme||place}">
      <div class="vac186-title">${icon187(place)} ${label187(place)} DLC</div>
      <div class="vac186-sub">${cfg.desc}<br>${state.vacation?'Vakantie mode: stats, nightlife, shops, specials en contacten.':'Wonen mode: resident routes, business en lokale netwerken.'}</div>
      <div class="vac186-badges"><span class="vac186-badge">Vibe ${d.vibe||50}%</span><span class="vac186-badge">Contacts ${d.contacts||0}</span><span class="vac186-badge">Romance ${d.romance||0}</span><span class="vac186-badge">Memories ${d.memories||0}</span><span class="vac186-badge">Spent ${money187(d.spent||0)}</span></div>
    </div>`;
  }
  function row187(place,a){
    const deny=actionDeny187(a);
    const type=a[6], id=a[1];
    const fn=type==='night'?`dlc187Nightlife('${place}')`:type==='shop'?`dlc187Shop('${place}')`:type==='special'?`dlc187Special('${place}')`:`dlc187Run('${place}','${id}')`;
    return `<div class="vac186-row ${deny?'locked':''}" onclick="${deny?'':fn}"><div class="ico">${a[2]}</div><div><div class="title">${a[3]}</div><div class="sub">${a[4]}${a[5]?' · '+money187(a[5]):''}${deny?' · '+deny:''}</div></div><div class="chev">›</div></div>`;
  }
  function hubBody187(place){
    place=norm187(place);
    const groups={};
    (ACTIONS187[place]||[]).forEach(a=>{groups[a[0]]=groups[a[0]]||[];groups[a[0]].push(a)});
    let body=hero187(place);
    Object.keys(groups).forEach(g=>{body+=`<div class="vac186-section">${g}</div>`+groups[g].map(a=>row187(place,a)).join('')});
    if(state.vacation)body+=`<div class="vac186-section">Reizen</div><div class="vac186-row" onclick="returnHome180()"><div class="ico">✈️</div><div><div class="title">Terug naar huis</div><div class="sub">Vakantie afsluiten</div></div><div class="chev">›</div></div>`;
    if(high187())body+=`<button class="btn" onclick="soberUp180()">💧 Uitrusten / ontnuchteren</button>`;
    return body;
  }
  window.vacationHub180=function(place){
    place=norm187(place||current187());
    if(jail187())return toast187('Je zit vast. Vakantie en verhuizen zijn geblokkeerd.');
    if(!window.isInPlace180(place))return toast187('Je bent niet in '+label187(place)+'.');
    showModal(`<div class="modalTop"><div class="avatar">${icon187(place)}</div><div class="modalTitle">${label187(place)} DLC</div></div><div class="modalBody vac186-wrap">${hubBody187(place)}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.dlc187Run=function(place,id){
    place=norm187(place);
    const act=(ACTIONS187[place]||[]).find(a=>a[1]===id);
    if(act&&act[5]&&!spend187(place,act[5]))return;
    const d=dlcState187(place); d.memories=(d.memories||0)+1; d.vibe=c187((d.vibe||50)+r187(2,6));
    let icon=icon187(place), title='DLC activiteit', text='Je deed een lokale activiteit.', stats={Happiness:4}, type='good';
    const set=(ic,ti,tx,st,tp)=>{icon=ic;title=ti;text=tx;stats=st||stats;type=tp||type};
    if(place==='spain'&&id==='tapas')set('🥘','Tapas avond','Tapas werkte nu wél door: sfeer, eten en vakantiegevoel gingen omhoog.',{Happiness:7,Health:1,Social:3});
    if(place==='spain'&&id==='beach')set('🏖️','Costa del Sol stranddag','Stranddag met zichtbare herstelboost. Dit is waarom vakantie nuttig is.',{Happiness:8,Health:2,Stamina:7});
    if(place==='spain'&&id==='football'){state.football=state.football||{};state.football.form=c187((state.football.form||50)+r187(3,8));set('⚽','La Liga voetbalbeleving','Je kreeg voetbalinspiratie en je form ging mee omhoog.',{Happiness:8,Fitness:2,Smarts:1,Stamina:-3});}
    if(place==='spain'&&id==='culture')set('⛪','Barcelona sightseeing','Barcelona gaf cultuur, content en city-vibe.',{Smarts:3,Happiness:6,Looks:1,Stamina:-4});
    if(place==='spain'&&id==='language'){state.skills=state.skills||{};state.skills.spanish=(state.skills.spanish||0)+r187(6,14);set('📚','Spaanse taalles','Je Spanish skill ging omhoog en lokale events worden logischer.',{Smarts:4,Stamina:-1});}
    if(place==='spain'&&id==='gym'){state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r187(2,5);set('🥊','Spaanse boxing/fight gym','Je trainde serieus in Spanje. Combat en fitness kregen echte progressie.',{Fitness:3,Stamina:-6,Health:-1});}
    if(place==='spain'&&id==='tourism'){d.contacts++;state.skills=state.skills||{};state.skills.tourism=(state.skills.tourism||0)+r187(4,10);set('🏨','Tourism network','Resident netwerk in toerisme/horeca ging omhoog.',{Smarts:2,Happiness:2,Social:4});}
    if(place==='spain'&&id==='business'){if(Math.random()<.55){state.businesses=state.businesses||[];state.businesses.push({name:'Costa Beach Bar',type:'horeca',city:'spain',level:1,reputation:25,customers:20,quality:24,marketing:22,monthlyRevenue:900,monthlyCosts:650,risk:28,debt:0});set('🍹','Beach bar business','Je vond een echte Spaanse beach-bar business route.',{Smarts:2,Happiness:6,Fame:1})}else set('🍹','Beach bar business','De deal zag er leuk uit, maar de cijfers waren zwak. Je liep op tijd weg.',{Smarts:3,Happiness:-1},'warn')}
    if(place==='america'&&id==='diner')set('🍔','American Diner','De diner gaf happiness, maar ook een kleine health-hit.',{Happiness:6,Health:-1,Social:2});
    if(place==='america'&&id==='road')set('🛣️','Roadtrip','Roadtrip gaf memories, happiness en vermoeidheid.',{Happiness:9,Stamina:-8,Smarts:1});
    if(place==='america'&&id==='hollywood'){state.social=(state.social||0)+r187(10,60);set('🎬','Hollywood / fame','Hollywood gaf social/fame-kans en looks boost.',{Happiness:6,Looks:2,Fame:2,Stamina:-3});}
    if(place==='america'&&id==='sports')set('🏟️','Live sports night','Live sports gaf sfeer, social en happiness.',{Happiness:8,Smarts:1,Social:4,Stamina:-3});
    if(place==='america'&&id==='ufc'){state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r187(2,5);set('🥊','UFC Gym Visit','UFC Gym gaf combat progressie en fitness.',{Fitness:3,Stamina:-6,Health:-1});}
    if(place==='america'&&id==='wwe'){state.skills=state.skills||{};state.skills.wrestling=(state.skills.wrestling||0)+r187(2,5);set('🤼','WWE Performance Center','WWE drills gaven wrestling en promo vibe.',{Fitness:2,Happiness:5,Fame:1,Stamina:-4});}
    if(place==='america'&&id==='pitch')set('💼','Startup pitch','Je pitchte een idee en bouwde business-netwerk.',{Smarts:3,Happiness:2,Social:4});
    if(place==='japan'&&id==='ramen')set('🍜','Ramen route','Ramen gaf happiness en kleine health boost.',{Happiness:6,Health:1});
    if(place==='japan'&&id==='arcade'){state.social=(state.social||0)+r187(5,25);set('🕹️','Akihabara arcade','Arcade gaf gaming vibe, smarts en social.',{Happiness:7,Smarts:2,Stamina:-3});}
    if(place==='japan'&&id==='temple')set('⛩️','Shrine visit','Shrine visit gaf rust, smarts en stamina.',{Smarts:2,Happiness:5,Stamina:2});
    if(place==='japan'&&id==='dojo'){state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r187(2,5);set('🥋','Dojo Training','Dojo training gaf combat, discipline en fitness.',{Fitness:3,Smarts:2,Stamina:-5});}
    if(place==='japan'&&id==='language'){state.skills=state.skills||{};state.skills.japanese=(state.skills.japanese||0)+r187(5,12);set('📚','Japanse taalles','Japanese skill ging omhoog.',{Smarts:4,Stamina:-2});}
    if(place==='japan'&&id==='work'){d.contacts++;set('🏢','Werkcultuur netwerk','Resident netwerk in Japan ging omhoog.',{Smarts:3,Social:3,Happiness:-1});}
    if(place==='amsterdam'&&id==='canal')set('🌉','Grachten dag','Grachtenwandeling gaf rust en happiness.',{Happiness:5,Stamina:-1});
    if(place==='amsterdam'&&id==='festival'){state.social=(state.social||0)+r187(15,55);set('🎪','Festival / event','Festival gaf happiness, looks en social.',{Happiness:8,Looks:1,Social:5,Stamina:-10});}
    if(place==='amsterdam'&&id==='museum')set('🖼️','Museumdag','Museum gaf smarts en rustige happiness.',{Smarts:4,Happiness:3,Stamina:-3});
    if(place==='amsterdam'&&id==='creative'){state.social=(state.social||0)+r187(10,45);set('📸','Creative content day','Content dag gaf looks, smarts en social.',{Smarts:2,Looks:2,Happiness:4,Social:4});}
    if(place==='amsterdam'&&id==='media'){d.contacts++;set('💼','Media netwerkborrel','Resident media-netwerk ging omhoog.',{Smarts:2,Looks:1,Social:4});}
    if(place==='jamaica'&&id==='beach')set('🏖️','Beach day','Beach day gaf herstel en happiness.',{Happiness:8,Health:2,Stamina:8});
    if(place==='jamaica'&&id==='boat')set('⛵','Boat trip','Boat trip gaf memories, happiness en vermoeidheid.',{Happiness:8,Health:1,Stamina:-5});
    if(place==='jamaica'&&id==='football')set('⚽','Beach football','Beach football gaf fitness en fun.',{Fitness:3,Happiness:5,Stamina:-4});
    if(place==='jamaica'&&id==='market'){d.souvenirs++;if(typeof giveItem180==='function')giveItem180('jamaica_souvenir');set('🛍️','Local Market','Market gaf souvenir, contact en happiness.',{Happiness:4,Social:2});}
    if(place==='jamaica'&&id==='tourism'){d.contacts++;set('🏝️','Tour guide network','Resident tourism netwerk ging omhoog.',{Smarts:2,Happiness:3,Social:3});}
    if(place==='nightcity'&&id==='neon'){state.nc=state.nc||{};state.nc.streetCred=c187((state.nc.streetCred||0)+r187(1,3));set('🌃','Neon walk','Neon walk gaf street cred, maar kostte energie.',{Happiness:4,Smarts:1,Stamina:-5},'warn');}
    if(place==='nightcity'&&id==='fixer'){state.nc=state.nc||{};state.nc.streetCred=c187((state.nc.streetCred||0)+r187(2,6));state.nc.heat=c187((state.nc.heat||0)+r187(1,5));set('🕶️','Meet Fixer','Fixer contact gaf street cred en heat.',{Smarts:2,Happiness:1,Social:2},'warn');}
    if(place==='nightcity'&&id==='fight'){state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r187(1,4);set('🥊','Underground Fight Pit','Fight pit gaf combat progressie, maar gezondheid ging omlaag.',{Fitness:2,Health:-3,Stamina:-8,Happiness:3},'warn');}
    if(place==='nightcity'&&id==='clinic'){state.nc=state.nc||{};state.nc.cyberware=c187((state.nc.cyberware||0)+r187(3,8));state.nc.humanity=c187((state.nc.humanity||100)-r187(2,7));set('🦾','Cyber Clinic','Cyberware omhoog, menselijkheid omlaag.',{Fitness:2,Health:-2},'warn');}
    logMsg187(icon,title,text,stats,0,type);
  };
  window.dlc187Nightlife=function(place){
    place=norm187(place);
    if((state.age||0)<18)return toast187('Uitgaan met drank/flirten is 18+.');
    const rows=(NIGHT187[place]||NIGHT187.spain).map((n,i)=>{
      const locked=(state.money||0)<n[3];
      return `<div class="vac186-row ${locked?'locked':''}" onclick="${locked?'':`dlc187NightPick('${place}',${i})`}"><div class="ico">${n[0]}</div><div><div class="title">${n[1]}</div><div class="sub">${n[2]}</div></div><div class="chev">›</div></div>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">🌃</div><div class="modalTitle">${label187(place)} nightlife</div></div><div class="modalBody vac186-wrap">${hero187(place)}<div class="vac186-section">Uitgaan keuzes</div>${rows}<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button></div>`);
  };
  window.dlc187NightPick=function(place,i){
    place=norm187(place);
    const n=(NIGHT187[place]||NIGHT187.spain)[i]; if(!n)return;
    if(!spend187(place,n[3]))return;
    const d=dlcState187(place); d.party=(d.party||0)+1; d.memories=(d.memories||0)+1; d.vibe=c187((d.vibe||50)+r187(3,8));
    if(n[6]==='drink'){state.addiction=state.addiction||{};state.addiction.alcoholBuzz=true;state.addiction.underInfluence=true;}
    if(n[6]==='romance'){d.romance=(d.romance||0)+1; d.contacts=(d.contacts||0)+1; if(Math.random()<.35){state.friends=state.friends||[];state.friends.push({name:p187(['Sofia','Maya','Lina','Jess','Aiko','Rosa','Naomi','Elena']),rel:45,metAt:label187(place),type:'vacation_contact'});}}
    logMsg187(n[0],n[1],n[4],n[5],0,n[6]==='drink'?'warn':'good');
  };
  window.dlc187Shop=function(place){
    place=norm187(place);
    const rows=(SHOP187[place]||[]).map((it,i)=>{
      const locked=(state.money||0)<it[3];
      return `<div class="vac186-row ${locked?'locked':''}" onclick="${locked?'':`dlc187BuyItem('${place}',${i})`}"><div class="ico">${it[1]}</div><div><div class="title">${it[2]}</div><div class="sub">${money187(it[3])} · ${effectText187(it[4],0)}</div></div><div class="chev">›</div></div>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">🛍️</div><div class="modalTitle">${label187(place)} shop</div></div><div class="modalBody vac186-wrap">${hero187(place)}<div class="vac186-section">Items kopen</div>${rows}<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button></div>`);
  };
  window.dlc187BuyItem=function(place,i){
    place=norm187(place);
    const it=(SHOP187[place]||[])[i]; if(!it)return;
    if(!spend187(place,it[3]))return;
    const d=dlcState187(place); d.souvenirs=(d.souvenirs||0)+1;
    itemGive187(it[0],it[1],it[2],it[3],it[4],it[5],place);
    logMsg187(it[1],'Item gekocht: '+it[2],it[5],it[4],0,'good');
  };
  window.dlc187Special=function(place){
    place=norm187(place);
    const d=dlcState187(place); d.memories=(d.memories||0)+1; d.vibe=c187((d.vibe||50)+r187(2,8));
    const events={
      spain:[['🎭','Straatfestival','Je belandde in een Spaans straatfestival. Muziek, eten en chaos maakten de dag memorabel.',{Happiness:9,Looks:1,Stamina:-5},'good'],['⚽','Voetbalmoment','Een lokale groep vroeg je mee te spelen. Technisch getest, sociaal gewonnen.',{Fitness:3,Happiness:6,Stamina:-5},'good'],['🔥','Hitte en siësta','De hitte sloeg hard toe. Je koos rust boven koppigheid en herstelde goed.',{Health:2,Stamina:8,Happiness:2},'good']],
      america:[['🎬','Celebrity sighting','Je zag een bekende kop en je content ging beter dan normaal.',{Happiness:7,Looks:1,Fame:1},'good'],['🚓','Roadside weirdness','Een rare roadtrip situatie kostte energie, maar leverde een verhaal op.',{Smarts:2,Stamina:-5},'warn']],
      japan:[['🎎','Matsuri festival','Je kwam terecht in een lokaal festival vol eten, licht en ritueel.',{Happiness:9,Smarts:2,Stamina:-4},'good'],['🚆','Trein chaos','Je pakte de verkeerde trein, maar ontdekte een leuke wijk.',{Smarts:2,Happiness:3,Stamina:-5},'warn']],
      amsterdam:[['🌧️','Regenbui','Je werd natgeregend maar vond een gezellige plek om te schuilen.',{Happiness:3,Stamina:-2},'warn'],['🎶','Straatmuziek','Een straatmuzikant maakte de stad even filmisch.',{Happiness:5},'good']],
      jamaica:[['🌅','Sunset moment','De zonsondergang voelde als een save point.',{Happiness:8,Health:1},'good'],['🎶','Local jam','Je werd meegetrokken in muziek en ritme.',{Happiness:8,Stamina:-3},'good']],
      nightcity:[['🧨','Neon trouble','Een deal in de buurt liep bijna mis. Je kwam weg, maar heat steeg.',{Smarts:2,Health:-2},'warn'],['💾','Data shard','Je vond een vreemde data shard. Mogelijk nuttig, mogelijk gevaarlijk.',{Smarts:3},'warn']]
    };
    const ev=p187(events[place]||events.spain);
    logMsg187(ev[0],ev[1],ev[2],ev[3],0,ev[4]);
  };

  function itemGive187(id,icon,name,price,effects,desc,place){
    state.items=state.items||[];
    state.items.push({id,name,icon,cat:'DLC '+label187(place),price,value:price,durability:100,broken:false,createdAge:state.age,source:'v18.7 vacation shop',use:desc,effects});
  }
  function moveResident187(id){
    id=norm187(id);
    const deny=travelDeny187(); if(deny)return toast187(deny);
    const cost=(CONFIG187[id]||{}).move||1600;
    if((state.money||0)<cost)return toast187('Niet genoeg geld: '+money187(cost));
    state.money-=cost;state.vacation=null;state.world=id;state.placeId=id;state.homePlaceId=id;
    logMsg187(icon187(id),'Verhuisd naar '+label187(id),`Je woont nu in ${label187(id)}. Resident-only opties staan open.`,{Happiness:2,Stamina:-4},0,'good');
  }
  window.moveResident185=moveResident187;
  window.worldMapScreen174=function(){
    normalize187();
    const order=['enkhuizen','amsterdam','spain','america','japan','jamaica','nightcity'];
    const rows=order.map(id=>{
      const cfg=CONFIG187[id]||{}, active=current187()===id;
      const sub=id==='enkhuizen'?'Thuisbasis / Nederland':`vakantie ${money187(cfg.travel||0)} · wonen ${money187(cfg.move||0)}`;
      return `<div class="vac186-row ${active?'locked':''}" onclick="${active?`vacationHub180('${id}')`:`placeDetailScreen174('${id}')`}"><div class="ico">${icon187(id)}</div><div><div class="title">${label187(id)}${active?' · HIER':''}</div><div class="sub">${sub}</div></div><div class="chev">›</div></div>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">🌍</div><div class="modalTitle">Wereldkaart v18.7</div></div><div class="modalBody vac186-wrap"><div class="vac186-card"><b>Wereld & DLC</b><br>Vakanties hebben nu echte stat-effecten, nightlife en shops.</div>${rows}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.worldMapScreen169=window.worldMapScreen174;
  try{worldMapScreen169=window.worldMapScreen174}catch(e){}
  window.placeDetailScreen174=function(id){
    id=norm187(id);
    const cfg=CONFIG187[id]||{}, canTravel=id!=='enkhuizen';
    const travelFn={spain:'travelSpain180()',america:'travelAmerica180()',japan:'travelJapan180()',amsterdam:'travelAmsterdam180()',jamaica:'travelJamaica180()',nightcity:'travelNightCity180()'}[id];
    const body=`${hero187(id)}${current187()===id?`<div class="vac186-row" onclick="vacationHub180('${id}')"><div class="ico">${icon187(id)}</div><div><div class="title">Open ${label187(id)} hub</div><div class="sub">Activiteiten, uitgaan, shops, specials en resident routes</div></div><div class="chev">›</div></div>`:''}${canTravel?`<div class="vac186-row" onclick="${travelFn}"><div class="ico">✈️</div><div><div class="title">Op vakantie</div><div class="sub">${money187(cfg.travel||0)}</div></div><div class="chev">›</div></div><div class="vac186-row" onclick="moveResident185('${id}')"><div class="ico">🏠</div><div><div class="title">Hier wonen</div><div class="sub">${money187(cfg.move||0)} · resident routes</div></div><div class="chev">›</div></div>`:''}<button class="btn alt" onclick="worldMapScreen174()">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">${icon187(id)}</div><div class="modalTitle">${label187(id)}</div></div><div class="modalBody vac186-wrap">${body}</div>`);
  };
  window.placeDetailScreen169=window.placeDetailScreen174;
  try{placeDetailScreen169=window.placeDetailScreen174}catch(e){}

  const oldAct187=window.activitiesHTML||(typeof activitiesHTML==='function'?activitiesHTML:null);
  window.activitiesHTML=function(){
    normalize187();
    if(state.vacation){
      const place=norm187(state.vacation);
      return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">${icon187(place)} ${label187(place)} vakantie-DLC</div>`+hubBody187(place);
    }
    const base=oldAct187?oldAct187():'';
    const place=current187();
    if(CONFIG187[place]&&place!=='enkhuizen'){
      return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">${icon187(place)} ${label187(place)} resident-DLC</div>`+hubBody187(place)+base;
    }
    return (typeof travelStatusCard174==='function'?travelStatusCard174():'')+`<div class="section">Wereld & vakantie-DLC</div>${row('🌍','Wereldkaart v18.7','Vakanties met effecten, nightlife en shops','worldMapScreen174()')}`+base;
  };
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  [['spainVacationScreen','spainHub180'],['spainHub','spainHub180'],['showSpain','spainHub180'],['alkmaarVacationScreen','spainHub180'],['alkmaarHub','spainHub180'],['showAlkmaar','spainHub180'],['americaVacationScreen','usaHub180'],['usaVacationScreen','usaHub180'],['americaHub','usaHub180'],['usaHub','usaHub180'],['showAmerica','usaHub180'],['showUSA','usaHub180'],['japanVacationScreen','japanHub180'],['tokyoVacationScreen','japanHub180'],['japanHub','japanHub180'],['tokyoHub','japanHub180'],['showJapan','japanHub180'],['amsterdamVacationScreen','amsterdamHub180'],['amsterdamHub','amsterdamHub180'],['showAmsterdam','amsterdamHub180'],['jamaicaVacationScreen','jamaicaHub180'],['jamaicaHub','jamaicaHub180'],['showJamaica','jamaicaHub180'],['nightCityVacationScreen','nightCityVacationHub180'],['nightCityHub','nightCityVacationHub180']].forEach(pair=>{window[pair[0]]=window[pair[1]];try{globalThis[pair[0]]=window[pair[1]]}catch(e){}});
  window.spainHub180=function(){vacationHub180('spain')};window.alkmaarHub180=window.spainHub180;
  window.usaHub180=function(){vacationHub180('america')};window.japanHub180=function(){vacationHub180('japan')};window.amsterdamHub180=function(){vacationHub180('amsterdam')};window.jamaicaHub180=function(){vacationHub180('jamaica')};window.nightCityVacationHub180=function(){vacationHub180('nightcity')};

  const oldMig187=window.migrate||(typeof migrate==='function'?migrate:null);
  if(oldMig187&&!oldMig187.__v187){
    window.migrate=function(s){s=oldMig187(s);try{state=s;normalize187()}catch(e){}return s};
    window.migrate.__v187=true;try{migrate=window.migrate}catch(e){}
  }
  setTimeout(()=>{try{normalize187();save187()}catch(e){}},350);
})();
