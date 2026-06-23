/* v17.4 Travel Guard: stoned/impaired travel lock + country resident/vacation consistency */
(function(){
  function hasState(){ return typeof state !== 'undefined' && state; }
  function clamp174(n,min=0,max=100){ return Math.max(min, Math.min(max, Math.round(n || 0))); }
  function pick174(a){ return a[Math.floor(Math.random()*a.length)]; }
  function euro174(n){ try { return money(n); } catch(e){ return '€' + Math.round(n || 0); } }
  function add174(title, text, stats, cash, tone){
    try { return action(title, text, stats || {}, cash || 0, tone || 'good'); }
    catch(e){
      try { addLog('<b>'+title+'</b><br>'+text, tone || 'good', false); if(stats && typeof applyStats === 'function') applyStats(stats); if(cash) state.money=(state.money||0)+cash; safeSave(); render(); } catch(_){}
    }
  }
  function places174(){ return window.BITZ_PLACES || {}; }
  function place174(id){ return places174()[id] || places174().enkhuizen || {id:'enkhuizen', name:'Enkhuizen', icon:'🏘️'}; }
  function currentPlace174(){
    if(!hasState()) return 'enkhuizen';
    if(state.vacation) return state.vacation;
    if(state.placeId) return state.placeId;
    if(state.homePlaceId) return state.homePlaceId;
    if(state.world === 'nightcity') return 'nightcity';
    return 'enkhuizen';
  }
  function isVacation174(){ return !!(hasState() && state.vacation); }
  function isResident174(id){ return hasState() && !state.vacation && (state.placeId === id || state.homePlaceId === id || (id === 'nightcity' && state.world === 'nightcity')); }
  function inCountry174(id){ return hasState() && (state.vacation === id || state.placeId === id || state.homePlaceId === id || (id === 'nightcity' && state.world === 'nightcity')); }
  function ensureTravel174(){
    if(!hasState()) return;
    state.placeId = state.placeId || (state.world === 'nightcity' ? 'nightcity' : 'enkhuizen');
    state.homePlaceId = state.homePlaceId || state.placeId;
    state.worldSystems = state.worldSystems || {visited:{}, migrations:0, vacations:0, residences:{}};
    state.worldSystems.visited = state.worldSystems.visited || {};
    state.worldSystems.residences = state.worldSystems.residences || {};
    state.worldSystems.visited[currentPlace174()] = true;
    state.travelMode = state.vacation ? 'vacation' : 'resident';
  }

  // Stoned/high/under-influence detector. Weed Trip is the important one for the bug.
  function isImpaired174(){
    if(!hasState()) return false;
    if(state.weedTrip && state.weedTrip.active) return true;
    if(state.flags && state.flags.weedTripActive) return true;
    if(state.addiction && state.addiction.underInfluence) return true;
    if(state.addictions && state.addictions.drugs && state.addictions.drugs.underInfluence) return true;
    if(state.addictions && state.addictions.alcohol && state.addictions.alcohol.underInfluence) return true;
    return false;
  }
  function impairmentLabel174(){
    if(!hasState()) return 'onder invloed';
    if(state.weedTrip && state.weedTrip.active) return 'stoned/high';
    if(state.flags && state.flags.weedTripActive) return 'stoned/high';
    return 'onder invloed';
  }
  window.isTravelBlocked174 = isImpaired174;

  function blockTravel174(){
    const msg = 'Je bent '+impairmentLabel174()+'. Niet logisch/veilig om nu naar een ander land of andere stad te reizen. Rust eerst uit of word nuchter.';
    try{ toast(msg); }catch(e){}
    return false;
  }
  function canTravel174(){ return !isImpaired174() || blockTravel174(); }

  window.soberRest174 = function(){
    if(!hasState()) return;
    if(state.weedTrip && typeof soberUp146 === 'function') return soberUp146(false);
    if(state.weedTrip){ state.weedTrip = null; }
    state.flags = state.flags || {};
    state.flags.weedTripActive = false;
    if(state.addiction) state.addiction.underInfluence = false;
    if(state.addictions && state.addictions.drugs) state.addictions.drugs.underInfluence = false;
    if(state.addictions && state.addictions.alcohol) state.addictions.alcohol.underInfluence = false;
    add174('Uitgerust', 'Ik nam rust tot ik weer helder genoeg was om normale keuzes te maken.', {Stamina:8, Health:1, Happiness:1}, 0, 'good');
    try{ safeSave(); render(); openScreen('activities'); }catch(e){}
  };

  function travelStatusCard174(){
    ensureTravel174();
    const here = place174(currentPlace174());
    const home = place174(state.homePlaceId || state.placeId || 'enkhuizen');
    const mode = state.vacation ? '✈️ Vakantie' : '🏠 Wonen';
    const impaired = isImpaired174();
    return `<div class="card"><b>🌍 Reisstatus</b><br>${mode} · nu: ${here.icon||'🌍'} ${here.name}<br>Thuisbasis: ${home.icon||'🏠'} ${home.name}<br><span class="mini">Vakantie = tijdelijk events/training/contacts. Wonen = jobs, business, sportcarrière, kosten en yearly events.</span>${impaired?'<br><br><b>🚫 Travel lock:</b> je bent '+impairmentLabel174()+'. Eerst ontnuchteren voordat je naar een ander land/stad reist.<br><button class="btn gold" onclick="soberRest174()">🌤️ Uitrusten / ontnuchteren</button>':''}</div>`;
  }
  window.travelStatusCard174 = travelStatusCard174;

  // Wrap every known cross-country/city travel entry point so old buttons cannot bypass the rule.
  function wrapTravelFunction174(name){
    const old = window[name] || (typeof globalThis[name] === 'function' ? globalThis[name] : null);
    if(!old || old.__travelGuard174) return;
    const wrapped = function(){ if(!canTravel174()) return null; return old.apply(this, arguments); };
    wrapped.__travelGuard174 = true;
    window[name] = wrapped;
    try{ globalThis[name] = wrapped; }catch(e){}
  }
  ['startPlaceVacation170','moveToPlace170','moveToPlace169','startAmericaVacation169','startAmsterdamTrip152','takeVacation','executeVacation130','moveToNightCity'].forEach(wrapTravelFunction174);

  // Returning home is also a travel action. Do not let the player teleport home while high; provide sober button instead.
  function wrapReturnFunction174(name){
    const old = window[name] || (typeof globalThis[name] === 'function' ? globalThis[name] : null);
    if(!old || old.__travelReturnGuard174) return;
    const wrapped = function(){ if(!canTravel174()) return null; return old.apply(this, arguments); };
    wrapped.__travelReturnGuard174 = true;
    window[name] = wrapped;
    try{ globalThis[name] = wrapped; }catch(e){}
  }
  ['returnHome170','endAmsterdamTrip152'].forEach(wrapReturnFunction174);

  const oldAmericaAction174 = window.americaAction169;
  if(oldAmericaAction174 && !oldAmericaAction174.__guarded174){
    window.americaAction169 = function(kind){
      ensureTravel174();
      const inAmerica = inCountry174('america');
      if(!inAmerica) return toast('Je bent niet in Amerika.');
      if(kind === 'back'){
        if(!canTravel174()) return null;
        if(!state.vacation) return toast('Je woont hier al. Gebruik de wereldkaart als je wilt verhuizen.');
      }
      // Residents can use USA actions too. Old function only accepts vacation, so temporarily allow it.
      const oldVacation = state.vacation;
      if(!oldVacation && isResident174('america')) state.vacation = 'america';
      try{ return oldAmericaAction174(kind); }
      finally{ if(!oldVacation && isResident174('america')) state.vacation = null; }
    };
    window.americaAction169.__guarded174 = true;
    try{ americaAction169 = window.americaAction169; }catch(e){}
  }

  const oldJapanAction174 = window.japanAction119 || (typeof japanAction119 === 'function' ? japanAction119 : null);
  if(oldJapanAction174 && !oldJapanAction174.__guarded174){
    window.japanAction119 = function(kind){
      ensureTravel174();
      const inJapan = inCountry174('japan');
      if(!inJapan) return toast('Je bent niet in Japan.');
      if(kind === 'back'){
        if(!canTravel174()) return null;
        if(!state.vacation) return toast('Je woont hier al. Gebruik de wereldkaart als je wilt verhuizen.');
      }
      const oldVacation = state.vacation;
      if(!oldVacation && isResident174('japan')) state.vacation = 'japan';
      try{ return oldJapanAction174(kind); }
      finally{ if(!oldVacation && isResident174('japan')) state.vacation = null; }
    };
    window.japanAction119.__guarded174 = true;
    try{ japanAction119 = window.japanAction119; }catch(e){}
  }

  // If old Japan V115 buttons still exist, guard them too.
  const oldJapanV115 = window.japanActionV115;
  if(oldJapanV115 && !oldJapanV115.__guarded174){
    window.japanActionV115 = function(kind){
      ensureTravel174();
      if(!inCountry174('japan')) return toast('Je bent niet in Japan.');
      if(kind === 'back'){
        if(!canTravel174()) return null;
        if(!state.vacation) return toast('Je woont hier al. Gebruik de wereldkaart als je wilt verhuizen.');
      }
      const oldVacation = state.vacation;
      if(!oldVacation && isResident174('japan')) state.vacation = 'japan';
      try{ return oldJapanV115(kind); }
      finally{ if(!oldVacation && isResident174('japan')) state.vacation = null; }
    };
    window.japanActionV115.__guarded174 = true;
    try{ japanActionV115 = window.japanActionV115; }catch(e){}
  }

  // Central travel functions, used by the new route screen. These are simple and predictable.
  window.startPlaceVacation174 = function(id){
    ensureTravel174();
    const pl = place174(id);
    const cost = pl.travelCost || (id === 'america' ? 3600 : id === 'japan' ? 4200 : 900);
    if(!canTravel174()) return null;
    if(state.vacation) return toast('Je bent al op vakantie. Eerst terug naar huis of ontnuchteren als je high bent.');
    if(currentPlace174() === id) return toast('Je bent hier al.');
    if((state.money||0) < cost) return toast('Niet genoeg geld voor deze reis.');
    state.money -= cost;
    state.previousWorld = state.world || 'normal';
    state.previousPlaceId = state.placeId || state.homePlaceId || 'enkhuizen';
    state.homeWorldBeforeVacation = state.world || 'normal';
    state.homePlaceId = state.homePlaceId || state.placeId || 'enkhuizen';
    state.vacation = id;
    state.travelMode = 'vacation';
    state.worldSystems.vacations = (state.worldSystems.vacations||0) + 1;
    state.worldSystems.visited[id] = true;
    if(id === 'japan') state.japan = state.japan || {days:1,vibe:55,spent:cost,friends:0,memories:['Aangekomen in Tokyo als toerist.']};
    if(id === 'america') state.america = state.america || {days:1,hype:50,spent:cost,contacts:0,state:pick174(['New York','Los Angeles','Miami','Las Vegas','Texas','Chicago']),mode:'vacation'};
    if(id === 'amsterdam') state.amsterdam = state.amsterdam || {days:1,cityVibe:55,touristStress:15,spent:cost,mode:'vacation'};
    add174('Vakantie gestart', `Ik ging tijdelijk naar ${pl.name}. Vakantie geeft events, training, contacten en souvenirs; geen vaste baan of lokale business.`, {Happiness:8, Smarts:2, Stamina:-4}, 0, 'good');
    try{ safeSave(); render(); closeModal(); openScreen('activities'); }catch(e){}
  };

  window.moveToPlace174 = function(id){
    ensureTravel174();
    const pl = place174(id);
    const old = place174(state.homePlaceId || state.placeId || 'enkhuizen');
    const cost = pl.permanentMoveCost || Math.round((pl.travelCost || 900) * 1.8);
    if(!canTravel174()) return null;
    if(state.vacation) return toast('Eerst terugkomen van vakantie voordat je permanent verhuist.');
    if(state.age < 18) return toast('Onder 18 kun je niet zelfstandig naar een ander land/stad verhuizen.');
    if(currentPlace174() === id) return toast('Je woont hier al.');
    if((state.money||0) < cost) return toast('Niet genoeg geld om te verhuizen.');
    state.money -= cost;
    state.placeId = id;
    state.homePlaceId = id;
    state.vacation = null;
    state.travelMode = 'resident';
    state.world = id === 'nightcity' ? 'nightcity' : 'normal';
    state.worldSystems.migrations = (state.worldSystems.migrations||0) + 1;
    state.worldSystems.residences[id] = true;
    state.worldSystems.visited[id] = true;
    if(id === 'japan') state.japanResidence = state.japanResidence || {years:0,localNetwork:10,language:5,workPermit:true};
    if(id === 'america') state.americaResidence = state.americaResidence || {years:0,localNetwork:10,visaStress:12,workPermit:true};
    add174('Verhuisd', `Ik verhuisde van ${old.name} naar ${pl.name}. Vanaf nu gelden lokale jobs, business, sportkansen, kosten en yearly events als woonlogica.`, {Happiness:6, Smarts:3, Stamina:-6}, 0, 'good');
    try{ safeSave(); render(); closeModal(); openScreen('life'); }catch(e){}
  };

  window.returnHome174 = function(){
    ensureTravel174();
    if(!state.vacation) return toast('Je bent niet op vakantie.');
    if(!canTravel174()) return null;
    const from = place174(state.vacation);
    const home = state.previousPlaceId || state.homePlaceId || state.placeId || 'enkhuizen';
    state.vacation = null;
    state.placeId = home;
    state.homePlaceId = state.homePlaceId || home;
    state.world = state.homeWorldBeforeVacation || state.previousWorld || (home === 'nightcity' ? 'nightcity' : 'normal');
    state.travelMode = 'resident';
    addLog(`<b>Terug naar huis</b><br>Ik kwam terug van ${from.name}. Vakantie voorbij; mijn vaste woonplaats is weer ${place174(state.homePlaceId).name}.`, 'good', false);
    try{ safeSave(); render(); closeModal(); openScreen('life'); }catch(e){}
  };

  function placeDetailHTML174(id){
    ensureTravel174();
    const pl = place174(id);
    const here = currentPlace174() === id;
    const travelCost = pl.travelCost || (id === 'america' ? 3600 : id === 'japan' ? 4200 : 900);
    const moveCost = pl.permanentMoveCost || Math.round(travelCost * 1.8);
    const impaired = isImpaired174();
    const travelOff = here || state.vacation || impaired || (state.money||0) < travelCost;
    const moveOff = here || state.vacation || impaired || state.age < 18 || (state.money||0) < moveCost;
    const sports = pl.sports ? Object.keys(pl.sports).join(', ') : '-';
    const biz = pl.business && pl.business.bestTypes ? pl.business.bestTypes.join(', ') : '-';
    return `<div class="modalTop"><div class="avatar">${pl.icon||'🌍'}</div><div class="modalTitle">${pl.name}</div></div><div class="modalBody">
      ${travelStatusCard174()}
      <div class="card"><b>Land:</b> ${pl.country||'-'}<br><b>Type:</b> ${pl.type||'-'}<br><b>Sportfocus:</b> ${sports}<br><b>Beste business:</b> ${biz}<br><b>Huur:</b> x${pl.rentMultiplier||1} · <b>Jobs:</b> x${pl.jobMultiplier||1} · <b>Klanten:</b> x${pl.customerMultiplier||1} · <b>Risico:</b> ${pl.crimeRisk||0}%<br><br>${pl.notes||''}</div>
      <button class="btn ${travelOff?'locked':''}" onclick="${travelOff?'':`startPlaceVacation174('${id}')`}">✈️ Vakantie / city trip · ${euro174(travelCost)}<br><span class="mini">Tijdelijk: events, training, contacten, souvenirs</span></button>
      <button class="btn ${moveOff?'locked':''}" onclick="${moveOff?'':`moveToPlace174('${id}')`}">🏠 Verhuizen en wonen · ${euro174(moveCost)}<br><span class="mini">18+ · jobs, business, sportcarrière en yearly events</span></button>
      ${state.vacation?`<button class="btn gold" onclick="returnHome174()">✈️ Terug naar huis</button>`:''}
      <button class="btn alt" onclick="worldMapScreen174()">Terug naar wereldkaart</button>
    </div>`;
  }

  window.placeDetailScreen174 = function(id){ showModal(placeDetailHTML174(id)); };
  window.placeDetailScreen169 = window.placeDetailScreen174;
  try{ placeDetailScreen169 = window.placeDetailScreen174; }catch(e){}

  window.worldMapScreen174 = function(){
    ensureTravel174();
    const list = Object.values(places174()).sort((a,b)=>(a.name||'').localeCompare(b.name||''));
    const rows = list.map(pl=>{
      const active = currentPlace174() === pl.id;
      const locked = isImpaired174() && !active;
      return `<button class="btn ${active?'green':locked?'locked':''}" onclick="${active?'':`placeDetailScreen174('${pl.id}')`}">${pl.icon||'🌍'} ${pl.name}${active?' · HIER':''}<br><span class="mini">${pl.country||''} · huur x${pl.rentMultiplier||1} · jobs x${pl.jobMultiplier||1} · risico ${pl.crimeRisk||0}%${locked?' · travel lock actief':''}</span></button>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">🌍</div><div class="modalTitle">Wereldkaart v17.4</div></div><div class="modalBody">${travelStatusCard174()}<div class="section">Plaatsen / DLC routes</div>${rows}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.worldMapScreen169 = window.worldMapScreen174;
  try{ worldMapScreen169 = window.worldMapScreen174; }catch(e){}

  function usaButtons174(resident){
    const a = state.america || {days:1,hype:50,spent:0,contacts:0,state:'USA'};
    return `<div class="section">🇺🇸 Amerika ${resident?'wonen':'vakantie'}</div><div class="card"><b>USA status</b><br>Plek: ${a.state||'USA'}<br>${resident?'Woonmodus: lokale jobs/business/sport staan aan.':'Vakantie: tijdelijke events en contacts.'}<br>Hype: ${a.hype||50}% · Contacten: ${a.contacts||0}<br>Uitgegeven: ${euro174(a.spent||0)}</div>
      ${row('🚶','City walk','Random USA city-events','americaAction169("walk")')}
      ${row('🚗','Road trip','Diners, snelwegen en grote afstanden','americaAction169("road")')}
      ${row('🥊','UFC/MMA gym','Training en fight vibe','americaAction169("ufc")')}
      ${row('🤼','WWE/performance center','Wrestling showmanship en try-out sfeer','americaAction169("wwe")')}
      ${row('🏋️','Hard trainen','Amerikaanse gym-intensiteit','americaAction169("gym")')}
      ${row('💼','Business pitch','Investeerders, netwerk en startup-vibe','americaAction169("business")')}
      ${row('🎬','Hollywood / fame','Content, casting en social hype','americaAction169("hollywood")')}
      ${row('🛍️','Shopping','Gear en status items','americaAction169("shop")')}
      ${row('🏥','USA clinic','Duur maar sterk herstel','americaAction169("doctor")')}
      ${resident?row('🏪','Lokale business','Business starten als bewoner','businessScreen()'):row('🏨','Langer blijven','Extra dag voor €420','americaAction169("stay")')}
      ${resident?row('🌍','Wereldkaart','Reizen of verhuizen','worldMapScreen174()'):row('✈️','Terug naar huis','Vakantie beëindigen','returnHome174()')}`;
  }

  function japanButtons174(resident){
    const extra = resident ? '<br>Woonmodus: lokale jobs/business/sport staan aan.' : '<br>Vakantie: tijdelijke events, souvenirs en herinneringen.';
    return `<div class="section">🇯🇵 Japan / Tokyo ${resident?'wonen':'vakantie'}</div><div class="card"><b>Tokyo status</b>${extra}</div>
      ${row('🚶','Wandelen door Tokyo','City-events, crossing, steegkat, metro','japanAction119("walk")')}
      ${row('🎲','Random Tokyo moment','Gacha, snacks, regen, arcade rivalen','japanAction119("random")')}
      ${row('🍜','Ramen eten','Classic, spicy of challenge','japanAction119("ramen")')}
      ${row('🏪','Konbini run','Convenience store snacks','japanAction119("konbini")')}
      ${row('🎮','Akihabara arcade','Toernooi, gacha of racing cabinet','japanAction119("arcade")')}
      ${row('⛩️','Tempel bezoeken','Wens, helpen of foto maken','japanAction119("temple")')}
      ${row('♨️','Onsen','Rust/herstel','japanAction119("onsen")')}
      ${row('🗻','Mount Fuji dagtrip','Challenge of sightseeing','japanAction119("fuji")')}
      ${row('🎤','Karaoke / nachtleven','Bar, karaoke, veilig terug','japanAction119("night")')}
      ${row('👥','Mensen ontmoeten','Vriend, fling of contact','japanAction119("meet")')}
      ${row('🛍️','Tokyo items kopen','Souvenirs en gameplay items','japanAction119("shop")')}
      ${row('🏥','Tokyo clinic','Dokter/check-up','japanAction119("doctor")')}
      ${resident?row('🏪','Lokale business','Business starten als bewoner','businessScreen()'):row('🏨','Langer blijven','Extra dag','japanAction119("stay")')}
      ${resident?row('🌍','Wereldkaart','Reizen of verhuizen','worldMapScreen174()'):row('✈️','Terug naar huis','Vakantie beëindigen','returnHome174()')}`;
  }

  function residentHub174(id){
    const pl = place174(id);
    let country = '';
    if(id === 'america') country = usaButtons174(true);
    else if(id === 'japan') country = japanButtons174(true);
    else country = `<div class="section">${pl.icon||'🌍'} Wonen in ${pl.name}</div><div class="card"><b>Woonmodus</b><br>Lokale jobs, business, sportkansen en yearly events tellen hier mee.</div>${row('🚶','Lokale dag','Normaal leven, netwerk en kleine events','residentAction170 ? residentAction170("local") : openScreen("life")')}${row('🏪','Business starten','Alleen als bewoner logisch beschikbaar','businessScreen()')}${row('🧩','Systemen hub','Sport, business, rankings en money-systemen','systemsHub169()')}${row('🌍','Wereldkaart','Reizen of verhuizen','worldMapScreen174()')}`;
    return travelStatusCard174() + country;
  }

  function vacationHub174(id){
    let body = travelStatusCard174();
    if(id === 'america') body += usaButtons174(false);
    else if(id === 'japan') body += japanButtons174(false);
    else if(id === 'amsterdam' && typeof amsterdamActivitiesHTML152 === 'function') body += amsterdamActivitiesHTML152().replace(/endAmsterdamTrip152\(\)/g,'returnHome174()');
    else body += `<div class="section">Vakantie</div><div class="card">Je bent op vakantie in ${place174(id).name}. Je kunt lokale vakantie-events doen, maar vaste banen/business horen bij wonen.</div>${row('🌍','Wereldkaart','Plaatsen bekijken','worldMapScreen174()')}${row('✈️','Terug naar huis','Vakantie beëindigen','returnHome174()')}`;
    return body;
  }

  // Final activities router: vacation should show vacation options; residence abroad should show resident options; stoned adds lock + sober button.
  const oldActivities174 = window.activitiesHTML || (typeof activitiesHTML === 'function' ? activitiesHTML : null);
  window.activitiesHTML = function(){
    ensureTravel174();
    if(state.vacation) return vacationHub174(state.vacation);
    if(['japan','america','nightcity','amsterdam'].includes(currentPlace174())){
      const extra = oldActivities174 ? oldActivities174() : '';
      return residentHub174(currentPlace174()) + extra;
    }
    const h = oldActivities174 ? oldActivities174() : '';
    if(h.includes('Wereldkaart / plaatsen') || h.includes('Wereldkaart v17.4')) return travelStatusCard174() + h;
    return travelStatusCard174() + `<div class="section">Wereld & routes</div>${row('🌍','Wereldkaart / plaatsen','Vakantie, wonen, Japan, Amerika, Amsterdam en Night City','worldMapScreen174()')}` + h;
  };
  try{ activitiesHTML = window.activitiesHTML; }catch(e){}

  // Make life page show the new travel status, but do not duplicate endlessly.
  const oldLife174 = window.lifeHTML || (typeof lifeHTML === 'function' ? lifeHTML : null);
  window.lifeHTML = function(){
    const h = oldLife174 ? oldLife174() : '';
    if(h.includes('Reisstatus')) return h;
    return `<div class="section">Reizen / wonen</div>${travelStatusCard174()}` + h;
  };
  try{ lifeHTML = window.lifeHTML; }catch(e){}

  // Business start guard: vacation cannot start local business, residence can in other countries.
  const oldStartBusiness174 = window.startWorldBusiness169;
  if(oldStartBusiness174 && !oldStartBusiness174.__businessGuard174){
    window.startWorldBusiness169 = function(id){
      if(hasState() && state.vacation) return toast('Je bent op vakantie. Vaste business starten kan pas als je hier woont.');
      return oldStartBusiness174.apply(this, arguments);
    };
    window.startWorldBusiness169.__businessGuard174 = true;
    try{ startWorldBusiness169 = window.startWorldBusiness169; }catch(e){}
  }

  // Render theme classes for resident mode too, not only vacation.
  const oldRender174 = window.render || (typeof render === 'function' ? render : null);
  window.render = function(){
    ensureTravel174();
    const ret = oldRender174 ? oldRender174() : null;
    try{
      document.body.classList.toggle('america-theme', inCountry174('america'));
      document.body.classList.toggle('japan-theme-full', inCountry174('japan'));
      document.body.classList.toggle('amsterdam', inCountry174('amsterdam'));
    }catch(e){}
    return ret;
  };
  try{ render = window.render; }catch(e){}

  setTimeout(function(){ try{ ensureTravel174(); safeSave(); render(); }catch(e){} }, 250);
})();
