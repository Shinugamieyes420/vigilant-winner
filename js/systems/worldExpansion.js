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
