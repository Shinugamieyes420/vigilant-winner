
/* v18.8 Vacation Original Look
   Keeps v18.7 functionality but re-renders vacation DLCs in the original BitzLife-style layout. */
(function(){
  function norm188(x){
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
  function label188(p){p=norm188(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function icon188(p){p=norm188(p);return {enkhuizen:'🏠',amsterdam:'🌉',spain:'🇪🇸',america:'🇺🇸',japan:'🇯🇵',jamaica:'🇯🇲',nightcity:'🌃'}[p]||'🌍'}
  function money188(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast188(t){try{toast(t)}catch(e){console.log(t)}}
  function normalize188(){
    if(!state)return;
    ['vacation','world','city','placeId','homePlaceId','homeWorldBeforeVacation'].forEach(k=>{if(state[k])state[k]=norm188(state[k])});
  }
  function current188(){normalize188();return state.vacation?norm188(state.vacation):norm188(state.world||state.city||state.placeId||'enkhuizen')}
  function dlc188(place){
    state.dlcTravel=state.dlcTravel||{};
    place=norm188(place);
    state.dlcTravel[place]=state.dlcTravel[place]||{days:0,vibe:50,contacts:0,souvenirs:0,spent:0,memories:0,party:0,localRep:0,romance:0};
    return state.dlcTravel[place];
  }
  function rr188(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="left"><div class="ico">${icon}</div><div><div class="title">${title}</div><div class="sub">${sub||''}</div></div></div><div class="chev">›</div></div>`;
    }
  }
  const CFG188={
    spain:{desc:'Zon, tapas, La Liga, flamenco, strand, nightlife en toerisme/business.',theme:'spain',travel:1300,move:2600},
    america:{desc:'Roadtrips, diners, Hollywood, live sports, UFC en WWE.',theme:'america',travel:3600,move:7200},
    japan:{desc:'Ramen, Tokyo arcade, Shibuya, dojo, shrine en karaoke.',theme:'japan',travel:2800,move:5600},
    amsterdam:{desc:'Grachten, festivals, uitgaan, musea en creatieve media.',theme:'amsterdam',travel:120,move:800},
    jamaica:{desc:'Strand, reggae, local market, boat trips en beach football.',theme:'jamaica',travel:1800,move:3600},
    nightcity:{desc:'Neon, clubs, fixers, fight pits en cyber clinics.',theme:'nightcity',travel:1200,move:2400}
  };
  const ACTIONS188={
    spain:{
      'Activiteiten':[
        ['🥘','Tapas avond','Eten met echte stat-effecten · '+money188(45),`dlc187Run('spain','tapas')`,false],
        ['🏖️','Costa del Sol stranddag','Relax, beach football of herstel · '+money188(35),`dlc187Run('spain','beach')`,false],
        ['⚽','La Liga voetbalbeleving','Wedstrijd/pickup/scout vibe · '+money188(110),`dlc187Run('spain','football')`,false],
        ['⛪','Barcelona sightseeing','Architectuur, content en lokale geschiedenis · '+money188(80),`dlc187Run('spain','culture')`,false],
      ],
      'Training':[
        ['📚','Spaanse taalles','Spanish skill en smarts · '+money188(90),`dlc187Run('spain','language')`,(state.age||0)<12],
        ['🥊','Spaanse boxing/fight gym','Combat training met hitte en discipline · '+money188(130),`dlc187Run('spain','gym')`,(state.age||0)<16],
      ],
      'Uitgaan & social':[
        ['🌃','Uitgaan in Madrid','Drinken, flirten/daten, dansen of rustig socializen',`dlc187Nightlife('spain')`,(state.age||0)<18],
      ],
      'Shop / items':[
        ['🛍️','Spaanse shop & souvenirs','Shirt, flamenco gitaar, zonnebril, camera gear',`dlc187Shop('spain')`,false],
      ],
      'Specials':[
        ['✨','Spanje special event','Random locals, festival, voetbal of siësta event',`dlc187Special('spain')`,false],
      ],
      'Wonen / resident':[
        ['🏨','Tourism network','Resident-only horeca/toerisme netwerk · '+money188(120),`dlc187Run('spain','tourism')`,!!state.vacation||(state.age||0)<18],
        ['🍹','Beach bar business check','Resident-only business kans · '+money188(450),`dlc187Run('spain','business')`,!!state.vacation||(state.age||0)<18],
      ]
    },
    america:{
      'Activiteiten':[
        ['🍔','American Diner','Diner food met happiness/health-effect · '+money188(35),`dlc187Run('america','diner')`,false],
        ['🛣️','Roadtrip','Texas highway, nature of motel chaos · '+money188(260),`dlc187Run('america','road')`,(state.age||0)<16],
        ['🎬','Hollywood / fame','Content, casting of fame-kans · '+money188(120),`dlc187Run('america','hollywood')`,false],
        ['🏟️','Live sports night','NBA/NFL/MLS crowd vibe · '+money188(140),`dlc187Run('america','sports')`,false],
      ],
      'Training':[
        ['🥊','UFC Gym visit','MMA training en gym contact · '+money188(160),`dlc187Run('america','ufc')`,(state.age||0)<16],
        ['🤼','WWE Performance Center','Wrestling drills en promo-vibe · '+money188(220),`dlc187Run('america','wwe')`,(state.age||0)<16],
      ],
      'Uitgaan & social':[
        ['🌃','USA nightlife','Drinks, flirten, dansen, rooftop of safe diner',`dlc187Nightlife('america')`,(state.age||0)<18],
      ],
      'Shop / items':[
        ['🛍️','USA shop','UFC glove, cowboy boots, Hollywood headshots, camera',`dlc187Shop('america')`,false],
      ],
      'Specials':[
        ['✨','USA special event','Celebrity, roadtrip, fight of hustle event',`dlc187Special('america')`,false],
      ],
      'Wonen / resident':[
        ['💼','Startup pitch','Resident-only business/investor route · '+money188(900),`dlc187Run('america','pitch')`,!!state.vacation||(state.age||0)<18],
      ]
    },
    japan:{
      'Activiteiten':[
        ['🍜','Ramen route','Food, spicy challenge of hidden local spot · '+money188(28),`dlc187Run('japan','ramen')`,false],
        ['🕹️','Akihabara arcade','Retro, gacha of arcade tournament · '+money188(55),`dlc187Run('japan','arcade')`,false],
        ['⛩️','Tempel / shrine','Rust, wens en cultuur event · '+money188(40),`dlc187Run('japan','temple')`,false],
      ],
      'Training':[
        ['🥋','Dojo training','Discipline, fight IQ en combat · '+money188(160),`dlc187Run('japan','dojo')`,(state.age||0)<12],
        ['📚','Japanse taalles','Japanese skill en smarts · '+money188(120),`dlc187Run('japan','language')`,(state.age||0)<12],
      ],
      'Uitgaan & social':[
        ['🌃','Shibuya / karaoke night','Drinks, karaoke, flirten of locals meet',`dlc187Nightlife('japan')`,(state.age||0)<18],
      ],
      'Shop / items':[
        ['🛍️','Tokyo shop','Anime figure, samurai mask, arcade pass, streetwear',`dlc187Shop('japan')`,false],
      ],
      'Specials':[
        ['✨','Japan special event','Festival, train chaos, anime of arcade event',`dlc187Special('japan')`,false],
      ],
      'Wonen / resident':[
        ['🏢','Werkcultuur netwerk','Resident-only job/culture route · '+money188(220),`dlc187Run('japan','work')`,!!state.vacation||(state.age||0)<18],
      ]
    },
    amsterdam:{
      'Activiteiten':[
        ['🌉','Grachten dag','Walk, rondvaart of canal social',`dlc187Run('amsterdam','canal')`,false],
        ['🎪','Festival / event','Music, foodtruck of creator meet · '+money188(120),`dlc187Run('amsterdam','festival')`,(state.age||0)<16],
        ['🖼️','Museum / cultuur','Smarts, content en rust · '+money188(65),`dlc187Run('amsterdam','museum')`,false],
        ['📸','Creative content day','Camera/media netwerk en social groei · '+money188(70),`dlc187Run('amsterdam','creative')`,(state.age||0)<13],
      ],
      'Uitgaan & social':[
        ['🎧','Amsterdam uitgaan','Drinken, flirten/daten, club, comedy of late snack',`dlc187Nightlife('amsterdam')`,(state.age||0)<18],
      ],
      'Shop / items':[
        ['🛍️','Amsterdam shop','Museumkaart, festival outfit, designer jacket, camera',`dlc187Shop('amsterdam')`,false],
      ],
      'Specials':[
        ['✨','Amsterdam special event','Grachten, festival of lokale ontmoeting',`dlc187Special('amsterdam')`,false],
      ],
      'Wonen / resident':[
        ['💼','Media netwerkborrel','Resident-only creatieve business route · '+money188(90),`dlc187Run('amsterdam','media')`,!!state.vacation||(state.age||0)<18],
      ]
    },
    jamaica:{
      'Activiteiten':[
        ['🏖️','Beach day','Relax, snorkelen of beach football · '+money188(25),`dlc187Run('jamaica','beach')`,false],
        ['⛵','Boat trip','Sea vibe, memories en kleine risico’s · '+money188(120),`dlc187Run('jamaica','boat')`,(state.age||0)<12],
        ['⚽','Voetbal op strand','Fitness, friends en fun',`dlc187Run('jamaica','football')`,(state.age||0)<6],
        ['🛍️','Local market','Souvenir, food of local contact · '+money188(55),`dlc187Run('jamaica','market')`,false],
      ],
      'Uitgaan & social':[
        ['🎸','Reggae / dancehall night','Drinken, dansen, flirten of live band',`dlc187Nightlife('jamaica')`,(state.age||0)<18],
      ],
      'Shop / items':[
        ['🏝️','Jamaica shop','Souvenir, beach outfit, music item, travel camera',`dlc187Shop('jamaica')`,false],
      ],
      'Specials':[
        ['✨','Jamaica special event','Beach, music of local event',`dlc187Special('jamaica')`,false],
      ],
      'Wonen / resident':[
        ['🏝️','Tour guide network','Resident-only tourism route · '+money188(100),`dlc187Run('jamaica','tourism')`,!!state.vacation||(state.age||0)<18],
      ]
    },
    nightcity:{
      'Activiteiten':[
        ['🌃','Neon walk','Street vibe, danger en memories · '+money188(30),`dlc187Run('nightcity','neon')`,(state.age||0)<16],
      ],
      'Training':[
        ['🥊','Underground fight pit','Combat risk/reward · '+money188(180),`dlc187Run('nightcity','fight')`,(state.age||0)<18],
      ],
      'Uitgaan & social':[
        ['🎛️','Neon club night','Drinks, flirten, backroom contact of safe exit',`dlc187Nightlife('nightcity')`,(state.age||0)<18],
      ],
      'Shop / items':[
        ['💽','Night City shop','Street mask, cyberdeck, neon jacket, medkit',`dlc187Shop('nightcity')`,(state.age||0)<16],
      ],
      'Specials':[
        ['🕶️','Meet fixer','Risky network en street cred · '+money188(120),`dlc187Run('nightcity','fixer')`,(state.age||0)<18],
        ['✨','Night City special event','Neon, crime, tech of survival event',`dlc187Special('nightcity')`,(state.age||0)<16],
      ],
      'Wonen / resident':[
        ['🦾','Cyber clinic','Resident-only cyberware route · '+money188(800),`dlc187Run('nightcity','clinic')`,!!state.vacation||(state.age||0)<18],
      ]
    }
  };
  const NIGHT188={
    spain:[
      ['🍷','Drankjes in tapasbar','Happiness/Social +, Health/Stamina - · '+money188(55),`dlc187NightPick('spain',0)`],
      ['💬','Flirten / date zoeken','Looks/Social/Happiness + · '+money188(40),`dlc187NightPick('spain',1)`],
      ['💃','Flamenco & dansen','Happiness/Fitness + · '+money188(85),`dlc187NightPick('spain',2)`],
      ['🌙','Rustige avondwandeling','Veilige optie · gratis',`dlc187NightPick('spain',3)`],
    ],
    america:[
      ['🍺','Drinks in sports bar','Happiness/Social + · '+money188(70),`dlc187NightPick('america',0)`],
      ['💬','Flirten / date zoeken','Looks/Social + · '+money188(60),`dlc187NightPick('america',1)`],
      ['🎧','LA club night','Fame/Looks/Happiness + · '+money188(180),`dlc187NightPick('america',2)`],
      ['🍔','Late night diner','Veilige optie · '+money188(35),`dlc187NightPick('america',3)`],
    ],
    japan:[
      ['🍶','Izakaya drinks','Happiness/Social + · '+money188(65),`dlc187NightPick('japan',0)`],
      ['🎤','Karaoke box','Happiness/Social + · '+money188(90),`dlc187NightPick('japan',1)`],
      ['💬','Flirten / locals ontmoeten','Social/Smarts + · '+money188(55),`dlc187NightPick('japan',2)`],
      ['🚶','Shibuya night walk','Veilige optie · '+money188(30),`dlc187NightPick('japan',3)`],
    ],
    amsterdam:[
      ['🍻','Drinken in bar','Happiness/Social + · '+money188(50),`dlc187NightPick('amsterdam',0)`],
      ['💬','Flirten / date zoeken','Looks/Social + · '+money188(35),`dlc187NightPick('amsterdam',1)`],
      ['🎧','Club night','Happiness/Looks + · '+money188(90),`dlc187NightPick('amsterdam',2)`],
      ['🍟','Late snack run','Kleine happiness · '+money188(18),`dlc187NightPick('amsterdam',3)`],
    ],
    jamaica:[
      ['🍹','Drinks bij strandbar','Happiness/Social + · '+money188(55),`dlc187NightPick('jamaica',0)`],
      ['💃','Dancehall night','Party/social · '+money188(100),`dlc187NightPick('jamaica',1)`],
      ['💬','Flirten / beach social','Social/Looks + · '+money188(40),`dlc187NightPick('jamaica',2)`],
      ['🎸','Live reggae band','Happiness + · '+money188(75),`dlc187NightPick('jamaica',3)`],
    ],
    nightcity:[
      ['🍸','Neon drinks','Happiness/Social +, risk · '+money188(80),`dlc187NightPick('nightcity',0)`],
      ['💬','Flirten in neon club','Looks/Social +, risk · '+money188(90),`dlc187NightPick('nightcity',1)`],
      ['🎛️','Main floor club','Party/heat · '+money188(120),`dlc187NightPick('nightcity',2)`],
      ['🚪','Veilig terugtrekken','Health/Stamina + · gratis',`dlc187NightPick('nightcity',3)`],
    ]
  };
  const SHOP188={
    spain:[
      ['🇪🇸','Spaans voetbalshirt',money188(95)+' · Happiness +3 · Looks +1',`dlc187BuyItem('spain',0)`],
      ['🎸','Flamenco gitaar',money188(430)+' · Happiness +4 · Smarts +1',`dlc187BuyItem('spain',1)`],
      ['🕶️','Spaanse zonnebril',money188(65)+' · Looks +2 · Happiness +1',`dlc187BuyItem('spain',2)`],
      ['📷','Travel camera gear',money188(900)+' · Smarts +2 · Looks +1',`dlc187BuyItem('spain',3)`],
    ],
    america:[
      ['🥊','Signed UFC glove',money188(1200)+' · Happiness +3 · Fame +1',`dlc187BuyItem('america',0)`],
      ['🤠','Cowboy boots',money188(220)+' · Looks +2 · Happiness +2',`dlc187BuyItem('america',1)`],
      ['🎬','Hollywood headshots',money188(350)+' · Looks +2 · Fame +2',`dlc187BuyItem('america',2)`],
      ['📷','Roadtrip camera',money188(650)+' · Smarts +1 · Happiness +2',`dlc187BuyItem('america',3)`],
    ],
    japan:[
      ['🧸','Anime figure',money188(120)+' · Happiness +3',`dlc187BuyItem('japan',0)`],
      ['👺','Samurai mask',money188(900)+' · Happiness +3 · Smarts +1',`dlc187BuyItem('japan',1)`],
      ['🕹️','Arcade pass',money188(160)+' · Happiness +4 · Smarts +1',`dlc187BuyItem('japan',2)`],
      ['🧥','Tokyo streetwear jacket',money188(620)+' · Looks +5 · Happiness +3',`dlc187BuyItem('japan',3)`],
    ],
    amsterdam:[
      ['🖼️','Museumkaart',money188(75)+' · Smarts +2 · Happiness +1',`dlc187BuyItem('amsterdam',0)`],
      ['🎪','Festival outfit',money188(180)+' · Looks +3 · Happiness +2',`dlc187BuyItem('amsterdam',1)`],
      ['🧥','Designer jacket',money188(950)+' · Looks +6 · Happiness +2',`dlc187BuyItem('amsterdam',2)`],
      ['📷','Camera gear',money188(900)+' · Smarts +2 · Looks +1',`dlc187BuyItem('amsterdam',3)`],
    ],
    jamaica:[
      ['🏝️','Jamaica souvenir',money188(55)+' · Happiness +2',`dlc187BuyItem('jamaica',0)`],
      ['🩳','Beach outfit',money188(85)+' · Looks +2 · Happiness +2',`dlc187BuyItem('jamaica',1)`],
      ['🎸','Reggae record',money188(70)+' · Happiness +3',`dlc187BuyItem('jamaica',2)`],
      ['📷','Travel camera',money188(650)+' · Smarts +1 · Happiness +2',`dlc187BuyItem('jamaica',3)`],
    ],
    nightcity:[
      ['😷','Night City street mask',money188(350)+' · Looks +2',`dlc187BuyItem('nightcity',0)`],
      ['💽','Cyberdeck',money188(2400)+' · Smarts +6',`dlc187BuyItem('nightcity',1)`],
      ['🧥','Neon jacket',money188(520)+' · Looks +4 · Happiness +2',`dlc187BuyItem('nightcity',2)`],
      ['🧰','Black-market medkit',money188(450)+' · Health +3',`dlc187BuyItem('nightcity',3)`],
    ]
  };
  function topCard188(place){
    place=norm188(place);
    const d=dlc188(place), cfg=CFG188[place];
    const statusLine = state.vacation ? 'Vakantie mode: tijdelijke fun, uitgaan, shops, specials en contacten.' : 'Wonen mode: resident-routes, business en lokale netwerken.';
    return `<div class="vac188Card vac188Theme-${cfg.theme}">
      <div class="vac188Title">${icon188(place)} ${label188(place)} DLC</div>
      <div class="vac188Sub">${cfg.desc}<br>${statusLine}</div>
      <div class="vac188Pills">
        <span class="pill">Vibe ${d.vibe||50}%</span>
        <span class="pill">Contacts ${d.contacts||0}</span>
        <span class="pill">Romance ${d.romance||0}</span>
        <span class="pill">Memories ${d.memories||0}</span>
        <span class="pill">Spent ${money188(d.spent||0)}</span>
      </div>
    </div>`;
  }
  function hubHTML188(place){
    place=norm188(place);
    let out = topCard188(place);
    const blocks=ACTIONS188[place]||{};
    Object.keys(blocks).forEach(sectionName=>{
      out += `<div class="section">${sectionName}</div>`;
      blocks[sectionName].forEach(r=>{
        out += rr188(r[0],r[1],r[2],r[3],!!r[4]);
      });
    });
    out += `<div class="section">Reizen</div>`;
    if(state.vacation){
      out += rr188('✈️','Terug naar huis','Vakantie beëindigen',"returnHome180()");
      if(state.addiction && (state.addiction.underInfluence||state.addiction.high||state.addiction.stoned||state.addiction.alcoholBuzz||state.addiction.weedTrip)){
        out += rr188('💧','Uitrusten / ontnuchteren','Eerst weer helder worden',"soberUp180()");
      }
    } else {
      out += rr188('🌍','Wereldkaart / plaatsen','Andere plekken bekijken',"worldMapScreen174()");
    }
    return out;
  }

  // Main vacation hub in original style
  window.vacationHub180 = function(place){
    place = norm188(place||current188());
    if(!(window.isInPlace180 ? window.isInPlace180(place) : true)) return toast188('Je bent niet in '+label188(place)+'.');
    showModal(`<div class="modalTop"><div class="avatar">${icon188(place)}</div><div class="modalTitle">${label188(place)} DLC</div></div><div class="modalBody" style="text-align:left">${hubHTML188(place)}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.spainHub180=function(){vacationHub180('spain')};
  window.alkmaarHub180=window.spainHub180;
  window.usaHub180=function(){vacationHub180('america')};
  window.japanHub180=function(){vacationHub180('japan')};
  window.amsterdamHub180=function(){vacationHub180('amsterdam')};
  window.jamaicaHub180=function(){vacationHub180('jamaica')};
  window.nightCityVacationHub180=function(){vacationHub180('nightcity')};

  // Nightlife chooser in original style
  window.dlc187Nightlife = function(place){
    place = norm188(place);
    if((state.age||0)<18) return toast188('Uitgaan met drank/flirten is 18+.');
    let out = topCard188(place) + `<div class="section">Uitgaan keuzes</div>`;
    (NIGHT188[place]||[]).forEach(r=>{ out += rr188(r[0],r[1],r[2],r[3]); });
    showModal(`<div class="modalTop"><div class="avatar">🌃</div><div class="modalTitle">${label188(place)} nightlife</div></div><div class="modalBody" style="text-align:left">${out}<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button></div>`);
  };

  // Shop chooser in original style
  window.dlc187Shop = function(place){
    place = norm188(place);
    let out = topCard188(place) + `<div class="section">Items kopen</div>`;
    (SHOP188[place]||[]).forEach(r=>{ out += rr188(r[0],r[1],r[2],r[3]); });
    showModal(`<div class="modalTop"><div class="avatar">🛍️</div><div class="modalTitle">${label188(place)} shop</div></div><div class="modalBody" style="text-align:left">${out}<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button></div>`);
  };

  // Original-style world map
  window.worldMapScreen174 = function(){
    normalize188();
    const order=['enkhuizen','amsterdam','spain','america','japan','jamaica','nightcity'];
    let out=`<div class="vac188Info"><b>Wereld & vakantie-DLC</b><br>Vakanties, wonen, nightlife, shops en specials. Spanje staat nog maar één keer in de lijst.</div>`;
    order.forEach(id=>{
      const here = current188()===id;
      const sub = id==='enkhuizen'
        ? 'Thuisbasis / Nederland'
        : `Vakantie ${money188((CFG188[id]||{}).travel||0)} · Wonen ${money188((CFG188[id]||{}).move||0)}`;
      out += rr188(icon188(id), label188(id)+(here?' · HIER':''), sub, here ? `vacationHub180('${id}')` : `placeDetailScreen174('${id}')`, false);
    });
    showModal(`<div class="modalTop"><div class="avatar">🌍</div><div class="modalTitle">Wereldkaart v18.8</div></div><div class="modalBody" style="text-align:left">${out}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.worldMapScreen169 = window.worldMapScreen174;
  try{ worldMapScreen169 = window.worldMapScreen174 }catch(e){}

  // Place detail screen in original style
  window.placeDetailScreen174 = function(id){
    id=norm188(id);
    const cfg=CFG188[id]||{}, active=current188()===id;
    let out = topCard188(id);
    if(active) out += rr188(icon188(id),'Open '+label188(id)+' hub','Activiteiten, uitgaan, shops, specials en resident-routes',`vacationHub180('${id}')`);
    if(id!=='enkhuizen'){
      const travelFn = {spain:'travelSpain180()',america:'travelAmerica180()',japan:'travelJapan180()',amsterdam:'travelAmsterdam180()',jamaica:'travelJamaica180()',nightcity:'travelNightCity180()'}[id];
      out += `<div class="section">Reizen</div>`;
      out += rr188('✈️','Op vakantie',money188(cfg.travel||0),travelFn,false);
      out += rr188('🏠','Hier wonen',money188(cfg.move||0),`moveResident185('${id}')`,false);
    }
    showModal(`<div class="modalTop"><div class="avatar">${icon188(id)}</div><div class="modalTitle">${label188(id)}</div></div><div class="modalBody" style="text-align:left">${out}<button class="btn alt" onclick="worldMapScreen174()">Terug</button></div>`);
  };
  window.placeDetailScreen169 = window.placeDetailScreen174;
  try{ placeDetailScreen169 = window.placeDetailScreen174 }catch(e){}

  // Final activities override in original look
  const prevActivities188 = window.activitiesHTML || (typeof activitiesHTML==='function' ? activitiesHTML : null);
  window.activitiesHTML = function(){
    normalize188();
    if(state.vacation){
      const place = norm188(state.vacation);
      return (typeof travelStatusCard174==='function'?travelStatusCard174():'')
        + `<div class="section">${icon188(place)} ${label188(place)} vakantie-DLC</div>`
        + hubHTML188(place);
    }
    const base = prevActivities188 ? prevActivities188() : '';
    const place = current188();
    if(CFG188[place] && place!=='enkhuizen'){
      return (typeof travelStatusCard174==='function'?travelStatusCard174():'')
        + `<div class="section">${icon188(place)} ${label188(place)} resident-DLC</div>`
        + hubHTML188(place)
        + base;
    }
    return (typeof travelStatusCard174==='function'?travelStatusCard174():'')
      + `<div class="section">Wereld & systemen</div>`
      + rr188('🌍','Wereldkaart / plaatsen','Nederland, Japan, Amerika, Night City en stads-DLC’s',"worldMapScreen174()")
      + base;
  };
  try{ activitiesHTML = window.activitiesHTML }catch(e){}

  // keep aliases
  [['spainVacationScreen','spainHub180'],['spainHub','spainHub180'],['showSpain','spainHub180'],['alkmaarVacationScreen','spainHub180'],['alkmaarHub','spainHub180'],['showAlkmaar','spainHub180'],['americaVacationScreen','usaHub180'],['usaVacationScreen','usaHub180'],['americaHub','usaHub180'],['usaHub','usaHub180'],['showAmerica','usaHub180'],['showUSA','usaHub180'],['japanVacationScreen','japanHub180'],['tokyoVacationScreen','japanHub180'],['japanHub','japanHub180'],['tokyoHub','japanHub180'],['showJapan','japanHub180'],['amsterdamVacationScreen','amsterdamHub180'],['amsterdamHub','amsterdamHub180'],['showAmsterdam','amsterdamHub180'],['jamaicaVacationScreen','jamaicaHub180'],['jamaicaHub','jamaicaHub180'],['showJamaica','jamaicaHub180'],['nightCityVacationScreen','nightCityVacationHub180'],['nightCityHub','nightCityVacationHub180'],['showNightCity','nightCityVacationHub180']].forEach(pair=>{ try{ window[pair[0]] = window[pair[1]]; }catch(e){} });
})();
