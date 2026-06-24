
/* v18.2 Spain DLC + Final Vacation Router Override */
(function(){
  function r182(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function c182(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function m182(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function safeSaveRender182(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function apply182(stats){try{applyStats(stats||{})}catch(e){stats=stats||{};for(const k in stats){if(k==='Fitness')state.fitness=c182((state.fitness||50)+stats[k]);else if(k==='Stamina')state.stamina=c182((state.stamina||50)+stats[k]);else state.stats[k]=c182((state.stats[k]||50)+stats[k]);}}}
  function msg182(title,text,stats,cash,type,icon){
    if(cash)state.money=(state.money||0)+cash;
    apply182(stats||{});
    try{addLog('<b>'+title+'</b><br>'+text,type||'good',false)}catch(e){}
    try{showModal('<div class="modalTop"><div class="avatar">'+(icon||'🇪🇸')+'</div><div class="modalTitle">'+title+'</div></div><div class="modalBody"><p>'+text+'</p><button class="btn" onclick="closeModal()">Verder</button></div>')}catch(e){try{toast(title)}catch(_){}} 
    safeSaveRender182();
  }
  function norm182(x){
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
  function label182(p){p=norm182(p);return {america:'Amerika / USA',japan:'Japan / Tokyo',spain:'Spanje',amsterdam:'Amsterdam',jamaica:'Jamaica',nightcity:'Night City',enkhuizen:'Enkhuizen'}[p]||p}
  function placeIcon182(p){p=norm182(p);return {america:'🇺🇸',japan:'🇯🇵',spain:'🇪🇸',amsterdam:'🌉',jamaica:'🇯🇲',nightcity:'🌃',enkhuizen:'🏠'}[p]||'🌍'}
  function isJail182(){try{if(typeof isInJail==='function')return !!isInJail()}catch(e){}return !!(state&&state.jail&&state.jail.yearsLeft>0)}
  function jailMsg182(){try{toast('Je zit vast. Vakantie, verhuizen en emigreren zijn geblokkeerd.')}catch(e){}return true}
  function high182(){return !!(state.addiction&&(state.addiction.underInfluence||state.addiction.weedTrip||state.addiction.high||state.addiction.stoned))}
  window.currentPlace180=function(){return state.vacation?norm182(state.vacation):norm182(state.world||state.city||state.placeId||'enkhuizen')};
  window.travelMode180=function(){return state.vacation?'vacation':'resident'};
  window.isInPlace180=function(place){place=norm182(place);return norm182(state.vacation)===place||norm182(state.world)===place||norm182(state.city)===place||norm182(state.placeId)===place};
  function normalize182(){
    if(!state)return;
    if(state.vacation)state.vacation=norm182(state.vacation);
    if(state.world)state.world=norm182(state.world);
    if(state.city)state.city=norm182(state.city);
    if(state.placeId)state.placeId=norm182(state.placeId);
    if(state.homePlaceId)state.homePlaceId=norm182(state.homePlaceId);
    if(state.homeWorldBeforeVacation)state.homeWorldBeforeVacation=norm182(state.homeWorldBeforeVacation);
  }
  function travelLock182(){if(isJail182())return 'jail';if(high182())return 'high';return ''}
  window.soberUp180=function(){state.addiction=state.addiction||{};['underInfluence','weedTrip','high','stoned'].forEach(k=>state.addiction[k]=false);msg182('Uitrusten / ontnuchteren','Ik nam rust, dronk water en werd weer helder genoeg om veilig te reizen.',{Health:1,Stamina:8,Happiness:1},0,'good','💧')};
  function setVacation182(place,cost){
    normalize182(); place=norm182(place);
    if(isJail182())return jailMsg182();
    if(high182())return toast('Je bent onder invloed. Eerst uitrusten/ontnuchteren voordat je reist.');
    if(state.vacation)return toast('Je bent al op vakantie. Keer eerst terug naar huis.');
    if((state.money||0)<cost)return toast('Niet genoeg geld: '+m182(cost));
    state.homeWorldBeforeVacation=state.world||state.city||state.placeId||'enkhuizen';
    state.vacation=place; state.money-=cost;
    msg182('Vakantie naar '+label182(place),'Ik vertrok naar '+label182(place)+'. De lokale DLC-activiteiten staan nu open.',{Happiness:4,Stamina:-4},0,'good',placeIcon182(place));
  }
  window.travelSpain180=function(){return setVacation182('spain',1300)};
  window.travelAlkmaar180=window.travelSpain180;
  window.travelAmerica180=function(){return setVacation182('america',3600)};
  window.travelJapan180=function(){return setVacation182('japan',2800)};
  window.travelAmsterdam180=function(){return setVacation182('amsterdam',120)};
  window.travelJamaica180=function(){return setVacation182('jamaica',1800)};
  window.travelNightCity180=function(){return setVacation182('nightcity',1200)};
  window.returnHome180=function(){normalize182();if(isJail182())return jailMsg182();if(high182())return toast('Je bent onder invloed. Eerst uitrusten/ontnuchteren voordat je reist.');if(!state.vacation)return toast('Je bent niet op vakantie.');let from=state.vacation;state.vacation=null;state.world=state.homeWorldBeforeVacation||state.world||'enkhuizen';state.placeId=state.world;msg182('Terug naar huis','Ik kwam terug van '+label182(from)+'. Vakantie voorbij.',{Happiness:1,Stamina:-2},0,'good','✈️')};

  const A={};
  function add(place,id,icon,title,mode,age,cost,desc,run){place=norm182(place);A[place]=A[place]||[];A[place].push({id,icon,title,mode,age,cost,desc,run})}
  function moneyOut(cost){state.money=(state.money||0)-cost}

  // SPAIN DLC: full vacation + resident package
  add('spain','tapas','🥘','Tapas avond','vacation',0,45,'Eten, sfeer, happiness en lichte health boost.',function(){moneyOut(45);msg182('Tapas avond','Ik at tapas in Spanje. Kleine bordjes, grote vibe, en precies genoeg chaos aan tafel.',{Happiness:7,Health:1},0,'good','🥘')});
  add('spain','beach','🏖️','Costa del Sol stranddag','vacation',0,35,'Rust, zon, health en stamina herstel.',function(){moneyOut(35);msg182('Costa del Sol','Ik lag aan het strand. Zon, zee en rust: mijn hoofd ging eindelijk even uit.',{Happiness:8,Health:2,Stamina:5},0,'good','🏖️')});
  add('spain','laliga','⚽','La Liga wedstrijd','vacation',0,110,'Voetbalinspiratie, social en football form.',function(){moneyOut(110);state.football=state.football||{};state.football.form=c182((state.football.form||50)+r182(2,7));state.social=(state.social||0)+r182(5,28);msg182('La Liga wedstrijd','Ik bezocht een Spaanse wedstrijd. Techniek, theater en stadiongeluid kwamen tegelijk binnen.',{Happiness:8,Fitness:1,Smarts:1},0,'good','⚽')});
  add('spain','footballclinic','🥅','Voetbal clinic','both',8,95,'Techniektraining, fitness en voetbalroute.',function(){moneyOut(95);state.football=state.football||{};state.football.goals=(state.football.goals||0)+r182(0,2);state.football.form=c182((state.football.form||50)+r182(4,9));msg182('Voetbal clinic','Ik trainde op Spaanse techniek: aannames, passing en rustig blijven onder druk.',{Fitness:3,Stamina:-4,Happiness:4},0,'good','🥅')});
  add('spain','spanishclass','📚','Spaanse taalles','both',12,90,'Spanish skill, smarts en betere Spanje-events.',function(){moneyOut(90);state.skills=state.skills||{};state.skills.spanish=(state.skills.spanish||0)+r182(6,14);msg182('Spaanse taalles','Ik leerde Spaanse zinnen en kon eindelijk meer zeggen dan hola en gracias.',{Smarts:4,Stamina:-1},0,'good','📚')});
  add('spain','flamenco','💃','Flamenco night','vacation',14,75,'Cultuur, social, looks en avondvibe.',function(){moneyOut(75);state.social=(state.social||0)+r182(8,32);msg182('Flamenco night','De flamenco avond had vuur, ritme en emotie. Zelfs mijn awkward klapritme werd geaccepteerd.',{Happiness:7,Looks:1,Stamina:-4},0,'good','💃')});
  add('spain','sagrada','⛪','Barcelona sightseeing','vacation',0,80,'Cultuur, smarts en content.',function(){moneyOut(80);state.social=(state.social||0)+r182(8,40);msg182('Barcelona sightseeing','Ik bezocht Barcelona en maakte content tussen architectuur, drukte en zonlicht.',{Smarts:3,Happiness:5,Looks:1,Stamina:-4},0,'good','⛪')});
  add('spain','market','🛍️','Mercado / lokale markt','vacation',0,60,'Souvenir, itemkans en lokale vibe.',function(){moneyOut(60);if(typeof giveItem180==='function'&&Math.random()<.55)giveItem180('spain_jersey');msg182('Mercado','Ik liep over een Spaanse markt. Tussen eten, shirts en souvenirs voelde Spanje eindelijk als DLC.',{Happiness:4},0,'good','🛍️')});
  add('spain','siesta','😴','Siësta / herstel','vacation',0,0,'Gratis herstel en stress omlaag.',function(){msg182('Siësta','Ik deed een siësta. Geen productiviteit, wel mentale winst.',{Stamina:12,Health:2,Happiness:2},0,'good','😴')});
  add('spain','nightlife','🌃','Madrid nightlife','vacation',18,130,'Social, looks, stamina omlaag en kleine risico’s.',function(){moneyOut(130);state.social=(state.social||0)+r182(15,55);let bad=Math.random()<.18;msg182('Madrid nightlife',bad?'De nacht was geweldig, maar ik raakte bijna mijn telefoon kwijt. Spanje testte mijn chaos-resistentie.':'Ik ging uit in Madrid. Laat eten, late muziek, late keuzes.',{Happiness:bad?3:8,Looks:2,Stamina:-10,Health:bad?-1:0},0,bad?'warn':'good','🌃')});
  add('spain','gym','🥊','Boxing / fight gym','both',16,130,'Combat, cardio en discipline.',function(){moneyOut(130);state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r182(2,5);if(state.combat&&state.combat.stats){state.combat.stats.striking=c182((state.combat.stats.striking||35)+r182(1,4));state.combat.stats.cardio=c182((state.combat.stats.cardio||35)+r182(1,3))}msg182('Spaanse fight gym','Ik trainde in een hete gym waar niemand onder de indruk was van excuses.',{Fitness:3,Stamina:-6,Health:-1},0,'good','🥊')});
  add('spain','tourismnetwork','🏨','Tourism network','resident',18,120,'Resident-only: horeca/toerisme netwerk en jobkansen.',function(){moneyOut(120);state.skills=state.skills||{};state.skills.tourism=(state.skills.tourism||0)+r182(4,9);msg182('Tourism network','Ik bouwde netwerk op in Spaanse horeca en toerisme. Niet rijk in één dag, wel echte kansen.',{Smarts:2,Happiness:2},0,'good','🏨')});
  add('spain','smallbusiness','🍹','Beach bar business check','resident',18,450,'Resident-only: businesskans voor horeca/toerisme.',function(){moneyOut(450);state.businesses=state.businesses||[];if(Math.random()<.55){state.businesses.push({name:'Costa Beach Bar',type:'horeca',city:'spain',level:1,reputation:25,customers:20,quality:24,marketing:22,monthlyRevenue:900,monthlyCosts:650,risk:28,debt:0});msg182('Beach bar business','Ik vond een kleine beach bar kans. Geen goudmijn, maar wel een echte business-route.',{Smarts:2,Happiness:6},0,'good','🍹')}else msg182('Beach bar business','De deal zag er leuk uit, maar de cijfers stonken. Ik liep weg voordat het geld kostte.',{Smarts:3,Happiness:-1},0,'warn','🍹')});

  // Other destinations kept working from the same final router
  add('america','diner','🍔','American Diner','vacation',0,35,'Burger, refill en USA sfeer.',function(){moneyOut(35);msg182('American Diner','Ik at in een Amerikaanse diner. Veel te groot, veel te vet, precies de vibe.',{Happiness:5,Health:-1},0,'good','🍔')});
  add('america','roadtrip','🛣️','Texas Roadtrip','vacation',16,320,'Roadtrip door Texas.',function(){moneyOut(320);msg182('Texas Roadtrip','Ik maakte een roadtrip door Texas. Alles was groter: wegen, porties en verhalen.',{Happiness:8,Looks:1,Stamina:-9},0,'good','🛣️')});
  add('america','ufc','🥊','UFC Gym Visit','both',16,160,'Combat training en fight vibe.',function(){moneyOut(160);state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r182(2,5);msg182('UFC Gym Visit','Ik trainde in een Amerikaanse UFC gym. Hard, direct en leerzaam.',{Fitness:3,Stamina:-6,Health:-1},0,'good','🥊')});
  add('america','wwe','🤼','WWE Performance Center','both',16,220,'Wrestling promo en ring IQ.',function(){moneyOut(220);state.skills=state.skills||{};state.skills.wrestling=(state.skills.wrestling||0)+r182(2,5);msg182('WWE Performance Center','Ik bezocht het WWE Performance Center. Zelfs de rondleiding voelde als een try-out.',{Fitness:2,Happiness:5,Stamina:-4},0,'good','🤼')});
  add('america','hollywood','🎬','Hollywood Sightseeing','vacation',0,180,'Fame/social moment.',function(){moneyOut(180);state.social=(state.social||0)+r182(15,80);msg182('Hollywood','Ik maakte content in Hollywood alsof ik al beroemd was.',{Happiness:6,Looks:2},0,'good','🎬')});

  add('japan','ramen','🍜','Ramen Shop','vacation',0,28,'Eten en sfeer.',function(){moneyOut(28);msg182('Ramen Shop','Ik at ramen in Japan. Simpel, warm en precies goed.',{Happiness:5,Health:1},0,'good','🍜')});
  add('japan','arcade','🕹️','Tokyo Arcade','vacation',0,55,'Gaming en social.',function(){moneyOut(55);state.social=(state.social||0)+r182(4,18);msg182('Tokyo Arcade','Ik verdween in een arcade vol licht, geluid en fanatieke spelers.',{Happiness:7,Smarts:1,Stamina:-3},0,'good','🕹️')});
  add('japan','language','📚','Japanse taalles','both',12,120,'Japanese skill en smarts.',function(){moneyOut(120);state.skills=state.skills||{};state.skills.japanese=(state.skills.japanese||0)+r182(5,12);msg182('Japanse taalles','Ik leerde basiszinnen en cultuurregels.',{Smarts:4,Stamina:-2},0,'good','📚')});
  add('japan','dojo','🥋','Dojo Training','both',12,160,'Discipline, combat en fitness.',function(){moneyOut(160);state.skills=state.skills||{};state.skills.combat=(state.skills.combat||0)+r182(2,5);msg182('Dojo Training','Ik trainde in een dojo. Minder show, meer discipline.',{Fitness:3,Smarts:2,Stamina:-5},0,'good','🥋')});
  add('japan','shibuya','🌃','Shibuya Night Walk','vacation',14,60,'Social en looks.',function(){moneyOut(60);state.social=(state.social||0)+r182(10,35);msg182('Shibuya Night Walk','Ik liep door Shibuya tussen neon en eindeloze energie.',{Happiness:6,Looks:2,Stamina:-4},0,'good','🌃')});

  add('amsterdam','canal','🌉','Canal Walk','vacation',0,0,'Gratis city vibe.',function(){msg182('Amsterdam Walk','Ik liep langs de grachten. Druk, mooi en chaotisch.',{Happiness:4,Stamina:-2},0,'good','🌉')});
  add('amsterdam','museum','🖼️','Museumdag','vacation',0,65,'Cultuur en smarts.',function(){moneyOut(65);msg182('Museumdag','Ik bezocht musea en deed alsof ik alles begreep. Een deel bleef hangen.',{Smarts:4,Happiness:3,Stamina:-3},0,'good','🖼️')});
  add('amsterdam','festival','🎪','Festival / event','vacation',16,120,'Social/fame maar vermoeiend.',function(){moneyOut(120);state.social=(state.social||0)+r182(15,55);msg182('Festival','Ik ging naar een Amsterdams event. Veel mensen, veel muziek, weinig energie over.',{Happiness:8,Looks:1,Stamina:-10},0,'good','🎪')});

  add('jamaica','beach','🏖️','Beach Day','vacation',0,40,'Rust en herstel.',function(){moneyOut(40);msg182('Beach Day','Ik lag op het strand en liet mijn hoofd eindelijk even uit staan.',{Happiness:9,Health:2,Stamina:4},0,'good','🏖️')});
  add('jamaica','reggae','🎸','Reggae Night','vacation',16,75,'Music/social vibe.',function(){moneyOut(75);state.social=(state.social||0)+r182(8,30);msg182('Reggae Night','De reggae avond had meer ritme dan mijn hele week.',{Happiness:8,Stamina:-4},0,'good','🎸')});
  add('jamaica','market','🛍️','Local Market','vacation',0,55,'Souvenir en local vibe.',function(){moneyOut(55);if(typeof giveItem180==='function')giveItem180('jamaica_souvenir');msg182('Local Market','Ik kocht een souvenir op de markt. Niet duur, wel herinnering.',{Happiness:3},0,'good','🛍️')});

  add('nightcity','neon','🌃','Neon Walk','vacation',16,30,'Street cred maar danger.',function(){moneyOut(30);state.nc=state.nc||{};state.nc.streetCred=c182((state.nc.streetCred||0)+r182(1,3));msg182('Neon Walk','Ik liep door Night City. Elke straat voelde als kans én waarschuwing.',{Happiness:4,Smarts:1,Stamina:-5},0,'warn','🌃')});
  add('nightcity','fixer','🕶️','Meet Fixer','both',18,120,'Risky klus/netwerk.',function(){moneyOut(120);state.nc=state.nc||{};state.nc.streetCred=c182((state.nc.streetCred||0)+r182(2,6));state.nc.heat=c182((state.nc.heat||0)+r182(1,5));msg182('Fixer Meet','Ik sprak een fixer. Geen vragen, alleen risico en beloning.',{Smarts:2,Happiness:1},0,'warn','🕶️')});

  Object.keys(A).forEach(place=>add(place,'return','✈️','Terug naar huis','vacation',0,0,'Vakantie afsluiten.',function(){returnHome180()}));

  function actionDeny182(a){
    if(isJail182())return 'gevangenis-lock';
    const mode=travelMode180();
    if(state.age<(a.age||0))return 'vanaf '+a.age;
    if(a.mode==='vacation'&&mode!=='vacation')return 'alleen vakantie';
    if(a.mode==='resident'&&mode!=='resident')return 'alleen wonen';
    if((state.money||0)<(a.cost||0))return 'te weinig geld';
    return '';
  }
  window.runVacationAction180=function(place,id){
    normalize182(); place=norm182(place);
    if(!isInPlace180(place))return toast('Je bent niet in '+label182(place)+'.');
    const a=(A[place]||[]).find(x=>x.id===id);
    if(!a)return toast('Deze actie bestaat niet.');
    const deny=actionDeny182(a);
    if(deny)return toast(deny);
    if(id==='return'&&high182())return toast('Je bent onder invloed. Eerst uitrusten/ontnuchteren voordat je reist.');
    a.run();
  };
  function actionRow182(place,a){
    const deny=actionDeny182(a);
    const click=deny?'':`runVacationAction180('${place}','${a.id}')`;
    return `<div class="vac-row ${deny?'locked':''}" onclick="${click}"><div class="rIco">${a.icon}</div><div><div class="rTitle">${a.title}</div><div class="sub">${a.desc}${a.cost?' · '+m182(a.cost):''}${deny?' · '+deny:''}</div></div><div class="chev">›</div></div>`;
  }
  window.vacationHub180=function(place){
    normalize182(); place=norm182(place||currentPlace180());
    if(isJail182())return jailMsg182();
    if(!isInPlace180(place))return toast('Je bent niet in '+label182(place)+'.');
    const mode=travelMode180();
    const status=`<div class="place-card"><b>${placeIcon182(place)} ${label182(place)} ${mode==='vacation'?'Vacation':'Resident'} DLC</b><br>${mode==='vacation'?'Tijdelijke events, training, contacten, souvenirs en lokale acties.':'Je woont hier: resident-only routes zoals business, werk en vaste netwerken gaan open.'}<div class="place-badges"><span class="place-badge good">${place}</span><span class="place-badge warn">${mode}</span>${high182()?'<span class="place-badge warn">onder invloed: reizen geblokkeerd</span>':''}</div></div>`;
    const rows=(A[place]||[]).map(a=>actionRow182(place,a)).join('');
    showModal(`<div class="modalTop"><div class="avatar">${placeIcon182(place)}</div><div class="modalTitle">${label182(place)} DLC</div></div><div class="modalBody combat-body">${status}${rows}${high182()?'<button class="btn" onclick="soberUp180()">💧 Uitrusten / ontnuchteren</button>':''}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.spainHub180=function(){vacationHub180('spain')};
  window.alkmaarHub180=window.spainHub180;
  window.usaHub180=function(){vacationHub180('america')};
  window.japanHub180=function(){vacationHub180('japan')};
  window.amsterdamHub180=function(){vacationHub180('amsterdam')};
  window.jamaicaHub180=function(){vacationHub180('jamaica')};
  window.nightCityVacationHub180=function(){vacationHub180('nightcity')};

  // Force all old route names to the final working hubs.
  [
    ['spainVacationScreen','spainHub180'],['spainHub','spainHub180'],['showSpain','spainHub180'],['spainActions','spainHub180'],
    ['alkmaarVacationScreen','spainHub180'],['alkmaarHub','spainHub180'],['showAlkmaar','spainHub180'],['alkmaarActions','spainHub180'],
    ['americaVacationScreen','usaHub180'],['usaVacationScreen','usaHub180'],['americaHub','usaHub180'],['usaHub','usaHub180'],['showAmerica','usaHub180'],['showUSA','usaHub180'],
    ['japanVacationScreen','japanHub180'],['tokyoVacationScreen','japanHub180'],['japanHub','japanHub180'],['tokyoHub','japanHub180'],['showJapan','japanHub180'],
    ['amsterdamVacationScreen','amsterdamHub180'],['amsterdamHub','amsterdamHub180'],['showAmsterdam','amsterdamHub180'],
    ['jamaicaVacationScreen','jamaicaHub180'],['jamaicaHub','jamaicaHub180'],['showJamaica','jamaicaHub180'],
    ['nightCityVacationScreen','nightCityVacationHub180'],['ncVacationScreen','nightCityVacationHub180'],['nightCityHub','nightCityVacationHub180']
  ].forEach(pair=>{window[pair[0]]=window[pair[1]];try{globalThis[pair[0]]=window[pair[1]]}catch(e){}});

  // Add Spain-specific items if old item list exists.
  window.giveSpainStarterItem182=function(){if(typeof giveItem180==='function')giveItem180('spain_jersey')};

  // Final activities override: this loads after worldTravelGuard174, so Spain no longer falls back to empty vacation.
  const oldActivities182=window.activitiesHTML||(typeof activitiesHTML==='function'?activitiesHTML:null);
  window.activitiesHTML=function(){
    normalize182();
    if(state.vacation)return (typeof travelStatusCard174==='function'?travelStatusCard174():'') + `<div class="section">${placeIcon182(state.vacation)} ${label182(state.vacation)} DLC</div>` + (A[norm182(state.vacation)]||[]).map(a=>actionRow182(norm182(state.vacation),a)).join('') + (high182()?row('💧','Uitrusten / ontnuchteren','Nodig voordat je terug kunt reizen','soberUp180()'):'');
    const place=currentPlace180();
    if(['spain','america','japan','amsterdam','jamaica','nightcity'].includes(place)){
      const base=(typeof travelStatusCard174==='function'?travelStatusCard174():'');
      const extra=oldActivities182?oldActivities182():'';
      return base + `<div class="section">${placeIcon182(place)} ${label182(place)} resident DLC</div>` + (A[place]||[]).map(a=>actionRow182(place,a)).join('') + extra;
    }
    return oldActivities182?oldActivities182():'';
  };
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  // World map detail for Spain/Alkmaar names.
  setTimeout(()=>{try{normalize182();safeSaveRender182()}catch(e){}},250);
})();
