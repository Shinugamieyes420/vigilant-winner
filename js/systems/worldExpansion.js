/* v16.9 World Expansion: Japan + America + central systems hub */
(function(){
  function c(n){ return Math.max(0, Math.min(100, Math.round(n || 0))); }
  function p(a){ return a[Math.floor(Math.random()*a.length)]; }
  function m(n){ try { return money(n); } catch(e){ return '€'+Math.round(n||0); } }
  function getPlaceId(){
    if(!state) return 'enkhuizen';
    if(state.vacation==='japan') return 'japan';
    if(state.vacation==='america') return 'america';
    if(state.world==='nightcity') return 'nightcity';
    return state.placeId || state.homePlaceId || 'enkhuizen';
  }
  function getPlace(id){ return (window.BITZ_PLACES || {})[id || getPlaceId()] || (window.BITZ_PLACES || {}).enkhuizen || {id:'unknown', name:'Onbekend', icon:'🌍', events:[]}; }
  function ensureWorld(){
    if(!state) return;
    state.placeId = state.placeId || (state.world==='nightcity' ? 'nightcity' : 'enkhuizen');
    state.homePlaceId = state.homePlaceId || state.placeId;
    state.worldSystems = state.worldSystems || { visited:{}, migrations:0 };
    state.worldSystems.visited[state.placeId] = true;
  }
  function placeLine(place){
    return `${place.country || ''} · huur x${place.rentMultiplier || 1} · jobs x${place.jobMultiplier || 1} · klanten x${place.customerMultiplier || 1} · risico ${place.crimeRisk || 0}%`;
  }
  window.currentPlaceCard169 = function(){
    ensureWorld();
    const pl = getPlace();
    return `<div class="card"><b>${pl.icon||'🌍'} Huidige plek:</b> ${pl.name}<br>${placeLine(pl)}<br><span class="mini">${pl.notes || 'Elke plek beïnvloedt jobs, business, sportkansen, events en kosten.'}</span></div>`;
  };
  window.worldMapScreen169 = function(){
    ensureWorld();
    const places = Object.values(window.BITZ_PLACES || {}).sort((a,b)=>(a.name||'').localeCompare(b.name||''));
    const rows = places.map(pl => {
      const active = getPlaceId() === pl.id;
      const cost = pl.id === getPlaceId() ? 0 : (pl.permanentMoveCost || pl.travelCost || 1200);
      return `<button class="btn ${active?'green':''}" onclick="placeDetailScreen169('${pl.id}')">${pl.icon||'🌍'} ${pl.name}${active?' · HIER':''}<br><span class="mini">${placeLine(pl)}${!active?' · verhuizen ± '+m(cost):''}</span></button>`;
    }).join('');
    showModal(`<div class="modalTop"><div class="avatar">🌍</div><div class="modalTitle">Wereldkaart</div></div><div class="modalBody">${currentPlaceCard169()}<div class="section">Plaatsen</div>${rows}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.placeDetailScreen169 = function(id){
    const pl = getPlace(id);
    const active = getPlaceId() === id;
    const sport = pl.sports ? Object.keys(pl.sports).map(k=>k.toUpperCase()).join(', ') : '-';
    const bestBiz = pl.business?.bestTypes?.join(', ') || '-';
    const events = (pl.events || []).slice(0,8).map(x=>'• '+x).join('<br>') || '-';
    const cost = pl.permanentMoveCost || pl.travelCost || 1200;
    showModal(`<div class="modalTop"><div class="avatar">${pl.icon||'🌍'}</div><div class="modalTitle">${pl.name}</div></div><div class="modalBody"><div class="card"><b>Land:</b> ${pl.country||'-'}<br><b>Type:</b> ${pl.type||'-'}<br><b>Sport:</b> ${sport}<br><b>Business:</b> ${bestBiz}<br><b>Regels:</b> ${placeLine(pl)}<br><br>${pl.notes||''}</div><div class="card"><b>Events:</b><br>${events}</div>${active?'<button class="btn green">Je bent hier</button>':`<button class="btn" onclick="moveToPlace169('${id}')">Verhuis hierheen · ${m(cost)}</button>`}<button class="btn alt" onclick="worldMapScreen169()">Terug naar wereldkaart</button></div>`);
  };
  window.moveToPlace169 = function(id){
    ensureWorld();
    const pl = getPlace(id), current = getPlace();
    if(id === 'nightcity' && typeof moveToNightCity === 'function') return moveToNightCity();
    const cost = pl.permanentMoveCost || pl.travelCost || 1200;
    if((state.money || 0) < cost) return toast('Niet genoeg geld om te verhuizen.');
    state.money -= cost;
    state.placeId = id;
    state.homePlaceId = id;
    state.world = id === 'nightcity' ? 'nightcity' : 'normal';
    state.worldSystems = state.worldSystems || {visited:{}, migrations:0};
    state.worldSystems.visited[id] = true;
    state.worldSystems.migrations = (state.worldSystems.migrations||0) + 1;
    closeModal();
    action('Verhuizen', `Ik verhuisde van ${current.name || 'mijn oude plek'} naar ${pl.name}. Vanaf nu beïnvloedt deze plek mijn jobs, sportkansen, business en events.`, {Happiness:5, Smarts:2, Stamina:-4}, 0, 'good');
  };
  window.systemsHub169 = function(){
    ensureWorld();
    const pl = getPlace();
    const sports = window.BITZ_SPORTS || {};
    showModal(`<div class="modalTop"><div class="avatar">🧩</div><div class="modalTitle">Systemen</div></div><div class="modalBody">${currentPlaceCard169()}<div class="section">Sport carrière</div><button class="btn" onclick="footballCareerScreen()">⚽ Voetbal carrière<br><span class="mini">positie, training, scouts, contracten, transfers</span></button><button class="btn" onclick="wrestlingCareerScreen163 ? wrestlingCareerScreen163() : toast('Wrestling systeem nog niet geladen')">🤼 WWE / Wrestling<br><span class="mini">school → amateur → indie → NXT/WWE</span></button><button class="btn" onclick="gloryUfcCareerScreen ? gloryUfcCareerScreen() : fightCareerScreen()">🥊 GLORY / UFC<br><span class="mini">kickboxing, MMA, rankings, tactical fights</span></button><button class="btn gold" onclick="sportsRankingsHub164 ? sportsRankingsHub164() : toast('Ranking hub niet gevonden')">🏆 Rankings & title fights</button><div class="section">Geld & business</div><button class="btn" onclick="businessScreen()">🏪 Eigen business systeem<br><span class="mini">stad, klanten, risico, groei en verkoop</span></button><button class="btn" onclick="moneyLifestyleHub165 ? moneyLifestyleHub165() : toast('Lifestyle hub niet gevonden')">💶 Money/Lifestyle hub</button><div class="section">Plaats-bonussen</div><div class="card"><b>${pl.name}</b><br>Fame bonus: ${pl.fameBonus||0}%<br>Crime risk: ${pl.crimeRisk||0}%<br>Business klanten x${pl.customerMultiplier||1}<br>Sportfocus: ${pl.sports?Object.keys(pl.sports).join(', '):'-'}</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  // Advanced city-aware business hub, while still using state.businesses so the existing yearly engine pays/risks it.
  window.businessScreen = function(){
    ensureWorld();
    state.businesses = state.businesses || [];
    const pl = getPlace();
    const types = window.BITZ_BUSINESSES?.types || {};
    const buttons = Object.entries(types).map(([id,b]) => {
      const cityBest = (pl.business?.bestTypes || []).includes(id);
      const cost = Math.round((b.cost || 0) * (pl.business?.rentPressure || pl.costMultiplier || 1));
      return `<button class="btn ${state.money<cost?'locked':''}" onclick="${state.money>=cost?`startWorldBusiness169('${id}')`:''}">${b.icon} ${b.name}${cityBest?' ⭐':''}<br><span class="mini">Start: ${m(cost)} · basiswinst ${m(b.baseProfit)} · risico ${b.risk}%</span></button>`;
    }).join('');
    const owned = state.businesses.map((b,i)=>`<button class="btn" onclick="businessManage169(${i})">${b.icon||'🏪'} ${b.name}<br><span class="mini">${b.city||'onbekend'} · level ${b.level||1} · winst ${m(b.profit||0)}/jr · risico ${b.risk||0}% · rep ${b.reputation||40}%</span></button>`).join('') || '<div class="card">Nog geen business.</div>';
    showModal(`<div class="modalTop"><div class="avatar">🏪</div><div class="modalTitle">Eigen business</div></div><div class="modalBody">${currentPlaceCard169()}<div class="section">Mijn businesses</div>${owned}<div class="section">Start nieuwe business</div>${buttons}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.startWorldBusiness169 = function(id){
    ensureWorld();
    const pl = getPlace();
    const meta = window.BITZ_BUSINESSES?.types?.[id];
    if(!meta) return toast('Business type niet gevonden.');
    const cost = Math.round((meta.cost || 0) * (pl.business?.rentPressure || pl.costMultiplier || 1));
    if((state.money||0) < cost) return toast('Niet genoeg geld.');
    const best = (pl.business?.bestTypes || []).includes(id);
    const profit = Math.round((meta.baseProfit || 100) * (pl.business?.customerBonus || pl.customerMultiplier || 1) * (best ? 1.22 : 1));
    const risk = Math.max(5, Math.round((meta.risk || 20) + (pl.business?.risk || 0) - (best ? 4 : 0)));
    state.money -= cost;
    state.businesses = state.businesses || [];
    state.businesses.push({
      id, name: meta.name, icon: meta.icon, city: pl.name, placeId: pl.id, level: 1,
      cost, profit, risk, reputation: best ? 48 : 38, quality: 35, marketing: 20,
      advanced: true, startedAge: state.age
    });
    closeModal();
    action('Business gestart', `${meta.icon} Ik startte ${meta.name} in ${pl.name}. ${best?'Deze plek past goed bij dit business-type.':'Niet de perfecte stad, maar het kan werken.'}`, {Happiness:5, Smarts:3, Stamina:-2}, 0, 'good');
  };
  window.businessManage169 = function(i){
    const b = (state.businesses||[])[i];
    if(!b) return toast('Business niet gevonden.');
    showModal(`<div class="modalTop"><div class="avatar">${b.icon||'🏪'}</div><div class="modalTitle">${b.name}</div></div><div class="modalBody"><div class="card"><b>Stad:</b> ${b.city||'-'}<br><b>Level:</b> ${b.level||1}<br><b>Reputatie:</b> ${b.reputation||40}%<br><b>Kwaliteit:</b> ${b.quality||35}%<br><b>Marketing:</b> ${b.marketing||20}%<br><b>Verwachte winst:</b> ${m(b.profit||0)}/jaar<br><b>Risico:</b> ${b.risk||0}%</div><button class="btn" onclick="businessInvest169(${i},'quality')">🔧 Kwaliteit verbeteren</button><button class="btn" onclick="businessInvest169(${i},'marketing')">📣 Marketing campagne</button><button class="btn" onclick="businessInvest169(${i},'staff')">👥 Personeel aannemen</button><button class="btn red" onclick="businessSell169(${i})">Business verkopen</button><button class="btn alt" onclick="businessScreen()">Terug</button></div>`);
  };
  window.businessInvest169 = function(i, kind){
    const b = state.businesses[i]; if(!b) return;
    const cost = Math.round(650 * (b.level||1) * (kind==='staff'?1.8:1));
    if((state.money||0) < cost) return toast('Niet genoeg geld.');
    state.money -= cost;
    if(kind==='quality'){ b.quality = c((b.quality||35)+10); b.profit = Math.round((b.profit||0)*1.18); b.risk = Math.max(3,(b.risk||20)-2); }
    if(kind==='marketing'){ b.marketing = c((b.marketing||20)+14); b.reputation = c((b.reputation||40)+7); b.profit = Math.round((b.profit||0)*1.22); }
    if(kind==='staff'){ b.staff=(b.staff||0)+1; b.level=(b.level||1)+1; b.profit = Math.round((b.profit||0)*1.35); b.risk = Math.max(4,(b.risk||20)-1); }
    closeModal();
    action('Business investering', `Ik investeerde ${m(cost)} in ${b.name}. ${kind==='quality'?'De kwaliteit ging omhoog.':kind==='marketing'?'Meer mensen kennen de business.':'De business kan nu meer werk aan.'}`, {Smarts:2, Happiness:2}, 0, 'good');
  };
  window.businessSell169 = function(i){
    const b = state.businesses[i]; if(!b) return;
    const value = Math.max(50, Math.round((b.cost||0)*0.45 + (b.profit||0)*2.4 + (b.reputation||40)*55 + (b.level||1)*500));
    state.businesses.splice(i,1);
    state.money += value;
    closeModal();
    action('Business verkocht', `Ik verkocht ${b.name} voor ${m(value)}.`, {Happiness:4}, 0, 'good');
  };

  // USA / America vacation DLC
  window.startAmericaVacation169 = function(){
    const cost = 3600;
    if((state.money||0) < cost) return toast('Niet genoeg geld voor Amerika.');
    state.money -= cost;
    state.previousWorld = state.world || 'normal';
    state.previousPlaceId = state.placeId || 'enkhuizen';
    state.vacation = 'america';
    state.america = {days:1, hype:55, spent:cost, contacts:0, state:p(['New York','Los Angeles','Miami','Las Vegas','Texas','Chicago'])};
    applyStats({Happiness:16, Smarts:3, Stamina:-5});
    addLog(`<b>Amerika / USA</b><br>Ik betaalde ${m(cost)} en vloog naar ${state.america.state}. Alles voelde groter: kansen, prijzen, ego’s en risico’s.`, 'good', false);
    safeSave(); render(); closeModal(); openScreen('activities');
  };
  window.americaAction169 = function(kind){
    if(state.vacation !== 'america') return toast('Je bent niet in Amerika.');
    state.america = state.america || {days:1,hype:50,spent:0,contacts:0,state:'USA'};
    const city = state.america.state || 'USA';
    if(kind==='walk') return action('USA city walk', p([
      `Ik liep door ${city}. Alles voelde als een filmset met te dure koffie.`,
      `Ik zag billboards, sportbars en mensen die praatten alsof ze hun eigen trailer hadden.`,
      `Een random straatartiest deed alsof hij mij herkende. Ik liet het gebeuren.`
    ]), {Happiness:5, Smarts:1, Stamina:-4}, 0, 'good');
    if(kind==='road') { state.america.days++; state.america.spent+=180; return action('Road trip', `Ik maakte een road trip. Tankstations, diners en enorme wegen. Amerika voelde ineens echt groot.`, {Happiness:10, Smarts:2, Stamina:-8}, -180, 'good'); }
    if(kind==='gym') { state.america.spent+=90; return action('US fight gym', `Ik trainde in een Amerikaanse gym. De coach praatte hard, maar de intensiteit was nuttig.`, {Fitness:5, Stamina:-10, Health:-1}, -90, 'good'); }
    if(kind==='wwe') { state.america.spent+=140; return action('WWE try-out vibe', `Ik bezocht een wrestling/performance center event. Promo’s, bumps en showmanship voelden hier groter.`, {Fitness:2, Looks:1, Happiness:8, Stamina:-7}, -140, 'good'); }
    if(kind==='ufc') { state.america.spent+=120; return action('UFC gym vibe', `Ik keek bij een MMA gym in Las Vegas-achtige sfeer. Iedereen leek te trainen alsof morgen title fight was.`, {Fitness:3, Smarts:2, Stamina:-6}, -120, 'good'); }
    if(kind==='business') { state.america.contacts++; state.america.spent+=220; return action('Business pitch', `Ik ging naar een business/network event. Veel praatjes, maar ook echte kansen.`, {Smarts:5, Happiness:3, Stamina:-4}, -220, 'good'); }
    if(kind==='hollywood') { const good=Math.random()<((state.stats.Looks||50)+(state.stats.Happiness||50))/180; state.america.hype=c((state.america.hype||50)+(good?8:-3)); return action('Hollywood / fame', good?'Ik kreeg aandacht bij een content/casting event. Mijn hype ging omhoog.':'Ik probeerde op te vallen, maar verdween tussen duizend andere dromers.', {Looks:good?2:-1, Happiness:good?8:-3, Stamina:-5}, -160, good?'good':'warn'); }
    if(kind==='shop') { state.america.spent+=250; return action('USA shopping', `Ik kocht sport/fame/business gear. Duur, maar het voelde alsof ik in level-up modus zat.`, {Looks:3, Happiness:5}, -250, 'good'); }
    if(kind==='doctor') { const cost=850; if((state.money||0)<cost) return toast('Niet genoeg geld voor de clinic.'); state.america.spent+=cost; return action('USA clinic', `Een medische check in Amerika was goed, maar pijnlijk duur.`, {Health:12, Stamina:5}, -cost, 'good'); }
    if(kind==='stay') { const cost=420; if((state.money||0)<cost) return toast('Niet genoeg geld om langer te blijven.'); state.america.days++; state.america.spent+=cost; return action('Langer in Amerika', `Ik bleef een dag langer in ${city}. Kansen genoeg, maar elke dag kost geld.`, {Happiness:4, Stamina:-2}, -cost, 'good'); }
    if(kind==='back') { const days=state.america.days||1; state.vacation=null; state.world=state.previousWorld || 'normal'; state.placeId=state.previousPlaceId || state.placeId || 'enkhuizen'; addLog(`<b>Terug uit Amerika</b><br>Na ${days} dagen vloog ik terug. Ik nam grote ideeën, contacten en een lege portemonnee mee.`, 'good', false); safeSave(); render(); closeModal(); return openScreen('life'); }
  };
  window.americaActivitiesHTML169 = function(){
    const a = state.america || {days:1,hype:50,spent:0,contacts:0,state:'USA'};
    return `<div class="section">🇺🇸 Amerika / USA</div><div class="card"><b>USA status</b><br>Plek: ${a.state||'USA'}<br>Dagen: ${a.days||1}<br>Hype: ${a.hype||50}%<br>Contacten: ${a.contacts||0}<br>Uitgegeven: ${m(a.spent||0)}</div>${row('🚶','City walk','Random USA city-events','americaAction169("walk")')}${row('🚗','Road trip','Diners, snelwegen en grote afstanden','americaAction169("road")')}${row('🥊','UFC/MMA gym','Training en fight vibe','americaAction169("ufc")')}${row('🤼','WWE/performance center','Wrestling showmanship en try-out sfeer','americaAction169("wwe")')}${row('🏋️','Hard trainen','Amerikaanse gym-intensiteit','americaAction169("gym")')}${row('💼','Business pitch','Investeerders, netwerk en startup-vibe','americaAction169("business")')}${row('🎬','Hollywood / fame','Content, casting en social hype','americaAction169("hollywood")')}${row('🛍️','Shopping','Gear en status items','americaAction169("shop")')}${row('🏥','USA clinic','Duur maar sterk herstel','americaAction169("doctor")')}${row('🏨','Langer blijven','Extra dag voor €420','americaAction169("stay")')}${row('✈️','Terug naar huis','Vakantie beëindigen','americaAction169("back")')}`;
  };

  // Patch vacation and activity routing
  try{
    if(typeof VACATION_OPTIONS !== 'undefined' && Array.isArray(VACATION_OPTIONS) && !VACATION_OPTIONS.some(v=>/Amerika|America|USA/i.test(v.name||''))){
      VACATION_OPTIONS.push({name:'Amerika / USA DLC',cost:3600,america:true,txt:'Ik vloog naar Amerika.',stats:{Happiness:16,Smarts:3,Stamina:-5}});
    }
  }catch(e){}
  const oldTakeVacation169 = (typeof takeVacation === 'function') ? takeVacation : window.takeVacation;
  window.takeVacation = function(i){
    try{ const v = VACATION_OPTIONS[i]; if(v && (v.america || /Amerika|America|USA/i.test(v.name||''))) return startAmericaVacation169(); }catch(e){}
    return oldTakeVacation169 ? oldTakeVacation169(i) : null;
  };
  try{ takeVacation = window.takeVacation; }catch(e){}

  const oldActivities169 = (typeof activitiesHTML === 'function') ? activitiesHTML : window.activitiesHTML;
  window.activitiesHTML = function(){
    ensureWorld();
    if(state.vacation === 'america') return americaActivitiesHTML169();
    const h = oldActivities169 ? oldActivities169() : '';
    const block = `<div class="section">Wereld & systemen</div>${row('🌍','Wereldkaart / plaatsen','Nederland, Japan, Amerika, Night City en stad-modifiers','worldMapScreen169()')}${row('🧩','Systemen hub','Voetbal, WWE, UFC/Glory, rankings, business en geldregels','systemsHub169()')}${row('🇺🇸','Amerika / USA trip','WWE, UFC, business, fame en road trip','startAmericaVacation169()',state.money<3600)}`;
    if(h.includes('Wereldkaart / plaatsen')) return h;
    return block + h;
  };
  try{ activitiesHTML = window.activitiesHTML; }catch(e){}

  const oldLife169 = (typeof lifeHTML === 'function') ? lifeHTML : window.lifeHTML;
  window.lifeHTML = function(){
    ensureWorld();
    const h = oldLife169 ? oldLife169() : '';
    if(h.includes('Huidige plek:')) return h;
    return `<div class="section">Wereld</div>${currentPlaceCard169()}${row('🌍','Wereldkaart','Verhuizen/reizen en stadregels bekijken','worldMapScreen169()')}` + h;
  };
  try{ lifeHTML = window.lifeHTML; }catch(e){}

  const oldRender169 = (typeof render === 'function') ? render : window.render;
  window.render = function(){
    ensureWorld();
    try{
      document.body.classList.toggle('america-theme', state && state.vacation==='america');
    }catch(e){}
    return oldRender169 ? oldRender169() : null;
  };
  try{ render = window.render; }catch(e){}

  const style = document.createElement('style');
  style.textContent = `body.america-theme{--bg:#101623;--panel:#182645;--cyan:#70b7ff;--yellow:#ffd45a;--green:#39c96b}body.america-theme .top{background:linear-gradient(90deg,#06142b,#233e7a,#6c1020)}body.america-theme .banner{background:#132a53}`;
  document.head.appendChild(style);
})();

/* v17.0 Logical DLC routes: vacation vs wonen + age-gated substance access */
(function(){
  function c170(n,min=0,max=100){ return Math.max(min, Math.min(max, Math.round(n || 0))); }
  function p170(a){ return a[Math.floor(Math.random()*a.length)]; }
  function m170(n){ try { return money(n); } catch(e){ return '€' + Math.round(n || 0); } }
  function places170(){ return window.BITZ_PLACES || {}; }
  function place170(id){ return places170()[id] || places170().enkhuizen || {id:'enkhuizen', name:'Enkhuizen', icon:'🏘️', country:'Nederland'}; }
  function currentHome170(){ return state?.homePlaceId || state?.placeId || 'enkhuizen'; }
  function currentLocation170(){ return state?.vacation || state?.placeId || state?.homePlaceId || 'enkhuizen'; }
  function isDlc170(id){ return ['japan','america','nightcity','amsterdam'].includes(id); }
  function initTravelState170(){
    if(!state) return;
    state.placeId = state.placeId || (state.world === 'nightcity' ? 'nightcity' : 'enkhuizen');
    state.homePlaceId = state.homePlaceId || state.placeId;
    state.worldSystems = state.worldSystems || {visited:{}, migrations:0, vacations:0, residences:{}};
    state.worldSystems.visited = state.worldSystems.visited || {};
    state.worldSystems.residences = state.worldSystems.residences || {};
    state.worldSystems.visited[currentLocation170()] = true;
    state.travelMode = state.vacation ? 'vacation' : 'resident';
  }
  function routeCard170(id){
    const pl = place170(id);
    const home = place170(currentHome170());
    const here = currentLocation170() === id;
    const onVacation = !!state.vacation;
    const travelCost = pl.travelCost || (id === 'america' ? 3600 : id === 'japan' ? 4200 : 900);
    const moveCost = pl.permanentMoveCost || Math.round(travelCost * 1.8);
    const routeText = isDlc170(id)
      ? 'Vakantie = tijdelijk: souvenirs, events, contacten, clinics en training. Wonen = vaste plek: huur, jobs, sportcarrière, business, jaarlijkse events en lokale risico’s.'
      : 'Lokale plek: goedkoop verhuizen/reizen binnen Nederland, met normale jobs en vaste woonlogica.';
    return `<div class="card"><b>Route-logica</b><br>${routeText}<br><br><b>Thuisbasis:</b> ${home.icon||'🏠'} ${home.name}<br><b>Nu:</b> ${state.vacation ? 'op vakantie in ' : 'woonachtig in '}${place170(currentLocation170()).name}<br><b>Vakantie:</b> ${m170(travelCost)} · <b>Wonen:</b> ${m170(moveCost)}${here?'<br><span class="mini">Je bent hier al.</span>':''}${onVacation?'<br><span class="mini">Je bent nu op vakantie. Eerst terug naar huis voordat je permanent verhuist.</span>':''}</div>`;
  }

  // Override the detail screen: a place now has two separate logical routes.
  const oldPlaceDetail169 = window.placeDetailScreen169;
  window.placeDetailScreen169 = function(id){
    initTravelState170();
    const pl = place170(id);
    const here = currentLocation170() === id;
    const sport = pl.sports ? Object.keys(pl.sports).map(k=>k.toUpperCase()).join(', ') : '-';
    const bestBiz = pl.business?.bestTypes?.join(', ') || '-';
    const events = (pl.events || []).slice(0,8).map(x=>'• '+x).join('<br>') || '-';
    const travelCost = pl.travelCost || (id === 'america' ? 3600 : id === 'japan' ? 4200 : 900);
    const moveCost = pl.permanentMoveCost || Math.round(travelCost * 1.8);
    const onVacation = !!state.vacation;
    const travelDisabled = here || state.money < travelCost;
    const moveDisabled = here || onVacation || state.age < 18 || state.money < moveCost;
    showModal(`<div class="modalTop"><div class="avatar">${pl.icon||'🌍'}</div><div class="modalTitle">${pl.name}</div></div><div class="modalBody">
      ${routeCard170(id)}
      <div class="card"><b>Land:</b> ${pl.country||'-'}<br><b>Type:</b> ${pl.type||'-'}<br><b>Sport:</b> ${sport}<br><b>Business:</b> ${bestBiz}<br><b>Kosten:</b> huur x${pl.rentMultiplier||1} · jobs x${pl.jobMultiplier||1} · klanten x${pl.customerMultiplier||1}<br><b>Risico:</b> ${pl.crimeRisk||0}%<br><br>${pl.notes||''}</div>
      <div class="card"><b>Events:</b><br>${events}</div>
      <button class="btn ${travelDisabled?'locked':''}" onclick="${travelDisabled?'':`startPlaceVacation170('${id}')`}">✈️ Op vakantie / city trip · ${m170(travelCost)}<br><span class="mini">Tijdelijk: geen lokale baan, geen vaste woning, geen business starten</span></button>
      <button class="btn ${moveDisabled?'locked':''}" onclick="${moveDisabled?'':`moveToPlace170('${id}')`}">🏠 Verhuizen en wonen · ${m170(moveCost)}<br><span class="mini">18+ · vaste plek: huur, jobs, business, sportroute en yearly events</span></button>
      ${state.vacation?`<button class="btn gold" onclick="returnHome170()">✈️ Eerst terug naar huis</button>`:''}
      <button class="btn alt" onclick="worldMapScreen169 ? worldMapScreen169() : closeModal()">Terug naar wereldkaart</button>
    </div>`);
  };

  window.startPlaceVacation170 = function(id){
    initTravelState170();
    const pl = place170(id);
    const travelCost = pl.travelCost || (id === 'america' ? 3600 : id === 'japan' ? 4200 : 900);
    if(state.vacation) return toast('Je bent al op vakantie. Ga eerst terug naar huis.');
    if(currentLocation170() === id) return toast('Je bent hier al.');
    if((state.money||0) < travelCost) return toast('Niet genoeg geld voor deze reis.');
    state.money -= travelCost;
    state.previousWorld = state.world || 'normal';
    state.previousPlaceId = state.placeId || state.homePlaceId || 'enkhuizen';
    state.homeWorldBeforeVacation = state.world || 'normal';
    state.homePlaceId = state.homePlaceId || state.placeId || 'enkhuizen';
    state.vacation = id;
    state.travelMode = 'vacation';
    state.worldSystems.vacations = (state.worldSystems.vacations||0) + 1;
    state.worldSystems.visited[id] = true;
    if(id === 'japan') state.japan = {days:1,vibe:55,spent:travelCost,friends:0,memories:['Aangekomen in Tokyo als toerist.']};
    if(id === 'america') state.america = {days:1,hype:50,spent:travelCost,contacts:0,state:'USA',mode:'vacation'};
    if(id === 'amsterdam') state.amsterdam = state.amsterdam || {days:1,cityVibe:55,touristStress:15,spent:travelCost,mode:'vacation'};
    closeModal();
    action('Vakantie gestart', `Ik ging tijdelijk naar ${pl.name}. Dit is een reis, geen verhuizing: ik kan events doen, mensen ontmoeten en trainen, maar geen lokale baan of vaste business starten.`, {Happiness:8, Smarts:2, Stamina:-4}, 0, 'good');
    safeSave(); render(); openScreen('activities');
  };

  window.moveToPlace170 = function(id){
    initTravelState170();
    const pl = place170(id), old = place170(currentHome170());
    const moveCost = pl.permanentMoveCost || Math.round((pl.travelCost || 900) * 1.8);
    if(state.vacation) return toast('Eerst terugkomen van vakantie voordat je permanent verhuist.');
    if(state.age < 18) return toast('Onder 18 kun je niet zelfstandig naar een DLC/andere stad verhuizen.');
    if(currentLocation170() === id) return toast('Je woont hier al.');
    if((state.money||0) < moveCost) return toast('Niet genoeg geld om te verhuizen.');
    state.money -= moveCost;
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
    closeModal();
    action('Verhuisd', `Ik verhuisde van ${old.name} naar ${pl.name}. Nu telt dit als wonen: lokale banen, huurdruk, business, sportkansen en jaarlijkse events gaan vanaf hier logisch meewegen.`, {Happiness:6, Smarts:3, Stamina:-6}, 0, 'good');
    safeSave(); render(); openScreen('life');
  };

  window.returnHome170 = function(){
    if(!state || !state.vacation) return toast('Je bent niet op vakantie.');
    const from = place170(state.vacation);
    const home = state.previousPlaceId || state.homePlaceId || state.placeId || 'enkhuizen';
    state.vacation = null;
    state.placeId = home;
    state.homePlaceId = state.homePlaceId || home;
    state.world = state.homeWorldBeforeVacation || state.previousWorld || (home === 'nightcity' ? 'nightcity' : 'normal');
    state.travelMode = 'resident';
    addLog(`<b>Terug naar huis</b><br>Ik kwam terug van ${from.name}. Vakantie voorbij; mijn vaste woonplaats is weer ${place170(state.homePlaceId).name}.`, 'good', false);
    safeSave(); render(); closeModal(); openScreen('life');
  };

  function residentHub170(id){
    const pl = place170(id);
    const res = id === 'japan' ? (state.japanResidence = state.japanResidence || {years:0,localNetwork:10,language:5,workPermit:true})
              : id === 'america' ? (state.americaResidence = state.americaResidence || {years:0,localNetwork:10,visaStress:12,workPermit:true})
              : null;
    const extra = id === 'japan'
      ? `<br>Taal/aanpassing: ${res.language||5}% · netwerk: ${res.localNetwork||10}%`
      : id === 'america'
      ? `<br>Visa/druk: ${res.visaStress||12}% · netwerk: ${res.localNetwork||10}%`
      : '';
    return `<div class="section">${pl.icon||'🌍'} Wonen in ${pl.name}</div>
      <div class="card"><b>Woonmodus</b><br>Je woont hier vast. Daarom tellen lokale jobs, sport, business en kosten nu mee.${extra}<br><span class="mini">Vakantie-acties zijn kort en tijdelijk; wonen geeft carrière- en businessroutes.</span></div>
      ${row('🚶','Lokale dag','Normaal leven, kleine events en netwerk','residentAction170("local")')}
      ${row('💼','Lokale carrière zoeken','Jobs en kansen op basis van deze plaats','openScreen("life")')}
      ${row('🏪','Business starten','Alleen als bewoner logisch beschikbaar','businessScreen()')}
      ${row('⚽','Sport/netwerk route','Voetbal, WWE, UFC/Glory via lokale plaatsbonussen','systemsHub169 ? systemsHub169() : openScreen("activities")')}
      ${row('🌍','Wereldkaart','Reizen of opnieuw verhuizen','worldMapScreen169()')}`;
  }

  window.residentAction170 = function(kind){
    initTravelState170();
    const id = currentLocation170();
    const pl = place170(id);
    if(kind === 'local'){
      let txt = `Ik leefde een normale dag in ${pl.name}. Niet als toerist, maar als bewoner: boodschappen, werkdruk, buurtgevoel en kleine kansen.`;
      let stats = {Happiness:3, Smarts:1, Stamina:-2};
      if(id === 'japan'){
        state.japanResidence = state.japanResidence || {years:0,localNetwork:10,language:5};
        state.japanResidence.localNetwork = c170((state.japanResidence.localNetwork||10)+r(1,4));
        state.japanResidence.language = c170((state.japanResidence.language||5)+r(1,3));
        txt = p170(['Ik pakte de metro alsof ik eindelijk wist waar ik heen moest. Mijn Japan-netwerk groeide een beetje.','Ik oefende Japans bij een konbini. Niet perfect, wel beter dan gisteren.','Ik ging naar een lokale sporthal en voelde dat Tokyo meer werd dan vakantie.']);
        stats = {Happiness:4, Smarts:2, Stamina:-3};
      }
      if(id === 'america'){
        state.americaResidence = state.americaResidence || {years:0,localNetwork:10,visaStress:12};
        state.americaResidence.localNetwork = c170((state.americaResidence.localNetwork||10)+r(1,5));
        state.americaResidence.visaStress = c170((state.americaResidence.visaStress||12)+r(-2,3));
        txt = p170(['Ik reed door brede straten en merkte hoe groot Amerika eigenlijk speelt. Mijn lokale netwerk groeide.','Ik ging naar een gym waar iedereen deed alsof een warming-up al een oorlog was.','Ik sprak iemand over werk, sponsors en kansen. Amerika voelde duur, maar vol deuren.']);
        stats = {Happiness:5, Smarts:1, Stamina:-4};
      }
      return action('Lokale dag', txt, stats, 0, 'good');
    }
  };

  // Business may be managed on vacation, but starting a local company requires residence.
  const oldStartBusiness170 = window.startWorldBusiness169;
  window.startWorldBusiness169 = function(id){
    if(state && state.vacation) return toast('Je bent op vakantie. Je kunt hier nog geen vaste business starten; verhuis eerst naar deze plek.');
    return oldStartBusiness170 ? oldStartBusiness170(id) : toast('Business systeem niet gevonden.');
  };

  const oldActivities170 = (typeof activitiesHTML === 'function') ? activitiesHTML : window.activitiesHTML;
  window.activitiesHTML = function(){
    initTravelState170();
    if(!state.vacation && ['japan','america'].includes(state.placeId)){
      const h = oldActivities170 ? oldActivities170() : '';
      if(h.includes('Woonmodus')) return h;
      return residentHub170(state.placeId) + h;
    }
    return oldActivities170 ? oldActivities170() : '';
  };
  try{ activitiesHTML = window.activitiesHTML; }catch(e){}

  const oldLife170 = (typeof lifeHTML === 'function') ? lifeHTML : window.lifeHTML;
  window.lifeHTML = function(){
    initTravelState170();
    const h = oldLife170 ? oldLife170() : '';
    const mode = state.vacation ? `✈️ Op vakantie in ${place170(state.vacation).name}` : `🏠 Woont in ${place170(state.homePlaceId || state.placeId).name}`;
    if(h.includes('Reismodus:')) return h;
    return `<div class="section">Route</div><div class="card"><b>Reismodus:</b> ${mode}<br><span class="mini">Vakantie en wonen zijn gescheiden. Vakantie is tijdelijk; wonen unlockt lokale banen/business/sport.</span></div>` + h;
  };
  try{ lifeHTML = window.lifeHTML; }catch(e){}

  // ---- Substance access rules ----
  function substanceStatus170(){
    if(state.age < 16) return {tier:'blocked', text:'Onder 16: geen drugs/weed kopen of gebruiken.'};
    if(state.age < 18) return {tier:'dealer', text:'16-17: geen shop. Alleen straatdealer met risico op rip-off, boete, politie, slechte kwaliteit en stress.'};
    return {tier:'shop', text:'18+: shop/coffeeshop beschikbaar waar dit in de gamewereld logisch is. Straatdealer blijft riskanter.'};
  }
  window.substanceRules170 = substanceStatus170;

  function dealerScreen170(){
    const s = substanceStatus170();
    if(s.tier === 'blocked') return showModal(`<div class="modalTop"><div class="avatar">🚫</div><div class="modalTitle">Geen toegang</div></div><div class="modalBody"><div class="card">${s.text}</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
    showModal(`<div class="modalTop"><div class="avatar">⚠️</div><div class="modalTitle">Straatdealer</div></div><div class="modalBody"><div class="card"><b>Risico-route</b><br>${s.text}<br><br>Dit is duurder en onveiliger dan een shop. Kans op rip-off, politiecontrole of slechte kwaliteit.</div>
      <button class="btn red" onclick="streetDealerWeed170('joint')">🚬 Risky joint · ${m170(24)}</button>
      <button class="btn red" onclick="streetDealerWeed170('spacecake')">🍰 Risky edible · ${m170(42)}</button>
      <button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  }
  window.streetDealerScreen170 = dealerScreen170;

  const originalUseWeed170 = window.useWeedItem146;
  const originalWeedShop170 = window.weedShop146;
  const originalBuyWeed170 = window.buyWeedItem146;
  window.weedShop146 = function(){
    const s = substanceStatus170();
    if(s.tier === 'blocked') return dealerScreen170();
    if(s.tier === 'dealer') return dealerScreen170();
    return originalWeedShop170 ? originalWeedShop170() : toast('Wietshop niet gevonden.');
  };
  window.buyWeedItem146 = function(id){
    const s = substanceStatus170();
    if(s.tier !== 'shop') return dealerScreen170();
    return originalBuyWeed170 ? originalBuyWeed170(id) : toast('Wietshop niet gevonden.');
  };
  window.useWeedItem146 = function(id){
    const s = substanceStatus170();
    if(s.tier === 'blocked') return dealerScreen170();
    if(s.tier === 'dealer' && !state.flags?.streetDealerUseAllowed) return dealerScreen170();
    return originalUseWeed170 ? originalUseWeed170(id) : toast('Weed trip mode niet gevonden.');
  };
  try{ weedShop146 = window.weedShop146; buyWeedItem146 = window.buyWeedItem146; useWeedItem146 = window.useWeedItem146; }catch(e){}

  window.streetDealerWeed170 = function(kind){
    const s = substanceStatus170();
    if(s.tier === 'blocked') return dealerScreen170();
    const cost = kind === 'spacecake' ? 42 : 24;
    if((state.money||0) < cost) return toast('Niet genoeg geld.');
    state.money -= cost;
    state.flags = state.flags || {};
    const roll = Math.random();
    let txt = '', stats = {}, type = 'warn';
    if(roll < 0.18){
      txt = 'De straatdealer kwam niet opdagen. Ik verloor geld en voelde me dom.';
      stats = {Happiness:-7, Smarts:-1, Stamina:-2};
      closeModal(); return action('Straatdealer risico', txt, stats, 0, 'bad');
    }
    if(roll < 0.34){
      const fine = state.age < 18 ? r(60,160) : r(40,120);
      state.money = Math.max(0, (state.money||0) - fine);
      txt = `Ik kreeg stress door een controle in de buurt. Geen slimme route. Extra kosten/boete: ${m170(fine)}.`;
      stats = {Happiness:-10, Smarts:1, Stamina:-4};
      closeModal(); return action('Straatdealer risico', txt, stats, 0, 'bad');
    }
    txt = state.age < 18
      ? 'Ik kocht via een straatdealer. Het werkte, maar het voelde duidelijk riskant en onverstandig.'
      : 'Ik koos toch voor een straatdealer in plaats van een shop. Dommer, duurder en riskanter, maar het werkte.';
    addLog(`<b>Straatdealer</b><br>${txt}`, 'warn', false);
    state.flags.streetDealerUseAllowed = true;
    closeModal();
    if(originalUseWeed170){ originalUseWeed170(kind === 'spacecake' ? 'spacecake' : 'joint'); }
    state.flags.streetDealerUseAllowed = false;
    safeSave(); render();
  };

  const oldAmsCoffee170 = window.amsCoffeeAction152;
  window.amsCoffeeAction152 = function(k){
    if(k === 'joint' || k === 'cake'){
      const s = substanceStatus170();
      if(s.tier === 'blocked') return dealerScreen170();
      if(s.tier === 'dealer') return dealerScreen170();
    }
    return oldAmsCoffee170 ? oldAmsCoffee170(k) : null;
  };
  try{ amsCoffeeAction152 = window.amsCoffeeAction152; }catch(e){}

  const oldAmsVondel170 = window.amsVondelAction152;
  window.amsVondelAction152 = function(k){
    if(k === 'joint'){
      const s = substanceStatus170();
      if(s.tier !== 'shop') return dealerScreen170();
    }
    return oldAmsVondel170 ? oldAmsVondel170(k) : null;
  };
  try{ amsVondelAction152 = window.amsVondelAction152; }catch(e){}

  const oldNcDrugMenu170 = window.ncDrugMenu151;
  window.ncDrugMenu151 = function(){
    const s = substanceStatus170();
    if(s.tier === 'blocked') return dealerScreen170();
    if(s.tier === 'dealer') return dealerScreen170();
    return oldNcDrugMenu170 ? oldNcDrugMenu170() : toast('Night City drugmenu niet gevonden.');
  };
  try{ ncDrugMenu151 = window.ncDrugMenu151; }catch(e){}

  const oldRender170 = (typeof render === 'function') ? render : window.render;
  window.render = function(){
    initTravelState170();
    return oldRender170 ? oldRender170() : null;
  };
  try{ render = window.render; }catch(e){}

  setTimeout(()=>{ try{ if(state){ initTravelState170(); safeSave(); render(); } }catch(e){} },350);
})();

/* v17.0b Extra legacy route guards: older buttons cannot bypass the new rules */
(function(){
  function tier170b(){
    if(!state || state.age < 16) return 'blocked';
    if(state.age < 18) return 'dealer';
    return 'shop';
  }
  function dealer170b(){
    if(typeof streetDealerScreen170 === 'function') return streetDealerScreen170();
    return toast(state.age < 16 ? 'Onder 16: geen drugs/weed.' : '16-17: alleen straatdealer-route met risico.');
  }

  const oldCoffeeJoint170b = window.buyCoffeeShopJoint || (typeof buyCoffeeShopJoint === 'function' ? buyCoffeeShopJoint : null);
  window.buyCoffeeShopJoint = function(){
    const t = tier170b();
    if(t !== 'shop') return dealer170b();
    return oldCoffeeJoint170b ? oldCoffeeJoint170b() : toast('Coffeeshop joint niet gevonden.');
  };
  try{ buyCoffeeShopJoint = window.buyCoffeeShopJoint; }catch(e){}

  const oldChill170b = window.chillWithFriends || (typeof chillWithFriends === 'function' ? chillWithFriends : null);
  window.chillWithFriends = function(kind){
    if(kind === 'drugs'){
      const t = tier170b();
      if(t === 'blocked') return dealer170b();
      if(t === 'dealer') return dealer170b();
    }
    return oldChill170b ? oldChill170b(kind) : toast('Chillen niet gevonden.');
  };
  try{ chillWithFriends = window.chillWithFriends; }catch(e){}

  const oldJamaicaSmoke170b = window.jamaicaSmoke || (typeof jamaicaSmoke === 'function' ? jamaicaSmoke : null);
  window.jamaicaSmoke = function(kind){
    if(kind !== 'skip'){
      const t = tier170b();
      if(t !== 'shop') return dealer170b();
    }
    return oldJamaicaSmoke170b ? oldJamaicaSmoke170b(kind) : toast('Jamaica smoke route niet gevonden.');
  };
  try{ jamaicaSmoke = window.jamaicaSmoke; }catch(e){}

  const oldCommitCrime170b = window.commitCrime137 || (typeof commitCrime137 === 'function' ? commitCrime137 : null);
  window.commitCrime137 = function(id){
    if(id === 'drug_deal' && state && state.age < 18){
      return toast('Drugs dealen is in deze logische versie pas 18+. Onder 18 geen directe drugs/crime-route.');
    }
    return oldCommitCrime170b ? oldCommitCrime170b(id) : toast('Crime systeem niet gevonden.');
  };
  try{ commitCrime137 = window.commitCrime137; }catch(e){}

  const oldActivities170b = (typeof activitiesHTML === 'function') ? activitiesHTML : window.activitiesHTML;
  window.activitiesHTML = function(){
    let h = oldActivities170b ? oldActivities170b() : '';
    if(state && state.age >= 16 && state.age < 18 && !h.includes('Straatdealer')){
      const block = `<div class="section">Risico-route 16+</div>${row('⚠️','Straatdealer','16-17: geen shop; alleen riskante dealer-route met kans op rip-off/politie/stress','streetDealerScreen170()')}`;
      h = block + h;
    }
    return h;
  };
  try{ activitiesHTML = window.activitiesHTML; }catch(e){}
})();
