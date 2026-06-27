
/* v22.3 Housing Upgrade + Kids Sports Fix
   - fixes house buying/renting with robust eligibility and clear messages
   - adds house upgrade/renovation system in original BitzLife row/modal style
   - adds kids sports from age 6: football, karate, tennis, baseball/honkbal
*/
(function(){
  function exists223(name){try{return typeof window[name]==='function'||typeof eval(name)==='function'}catch(e){return false}}
  function clamp223(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r223(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick223(a){return a[Math.floor(Math.random()*a.length)]}
  function money223(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast223(t){try{toast(t)}catch(e){console.log(t)}}
  function stat223(stats){try{applyStats(stats||{})}catch(e){}}
  function saveRender223(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function action223(title,txt,stats={},cash=0,type='good'){
    try{return action(title,txt,stats,cash,type)}catch(e){
      if(cash)state.money=(state.money||0)+cash;
      stat223(stats);
      try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(_){}
      saveRender223();
    }
  }
  function rr223(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function section223(t){return `<div class="section">${t}</div>`}
  function card223(h){return `<div class="card">${h}</div>`}
  function modal223(icon,title,body){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  }
  function age223(){return (state&&state.age)||0}
  function inJail223(){try{return isInJail()}catch(e){return !!(state&&state.jail&&state.jail.yearsLeft>0)}}
  function clearPrimary223(){state.houses=state.houses||[];state.houses.forEach(h=>h.primary=false)}

  const DEFAULT_HOUSING223={
    rentals:[
      {id:'social_flat',name:'Sociale huurwoning appartement',monthly:800,upkeep:0,desc:'Goedkoopste optie: klein maar betaalbaar.',comfort:35,quality:42,rooms:2},
      {id:'mid_flat',name:'Middenhuur 2-kamer appartement',monthly:1150,upkeep:0,desc:'Netter appartement met meer ruimte.',comfort:50,quality:55,rooms:3},
      {id:'free_house',name:'Vrije sector woning',monthly:1650,upkeep:0,desc:'Duurder, maar comfortabeler wonen.',comfort:62,quality:62,rooms:4}
    ],
    buy:[
      {id:'buy_flat',name:'Koopappartement',price:185000,down:12000,monthlyMortgage:980,upkeep:1400,rent:1050,desc:'Instapkoopwoning met hypotheek.',comfort:52,quality:55,rooms:3},
      {id:'family_house',name:'Eengezinswoning',price:315000,down:22000,monthlyMortgage:1520,upkeep:2400,rent:1500,desc:'Groter huis, hogere maandlasten.',comfort:65,quality:64,rooms:5},
      {id:'old_house',name:'Oud klus-huis',price:155000,down:9000,monthlyMortgage:850,upkeep:3800,rent:900,desc:'Goedkoper kopen, maar veel onderhoud.',comfort:38,quality:36,rooms:4},
      {id:'new_house',name:'Nieuwbouwwoning',price:430000,down:34000,monthlyMortgage:2050,upkeep:1600,rent:1900,desc:'Duur, netjes, energiezuinig.',comfort:78,quality:80,rooms:5}
    ]
  };
  function housingOptions223(){
    try{if(typeof HOUSING_OPTIONS!=='undefined'&&HOUSING_OPTIONS)return HOUSING_OPTIONS}catch(e){}
    return DEFAULT_HOUSING223;
  }
  function ncHousingOptions223(){
    try{if(typeof NC_HOUSING_OPTIONS!=='undefined'&&NC_HOUSING_OPTIONS)return NC_HOUSING_OPTIONS}catch(e){}
    return {rentals:[],buy:[]};
  }
  function hasStableIncome223(){
    if(!state||age223()<18)return false;
    const j=state.job;
    if(j && j.id && j.id!=='paperboy')return true;
    if(j && (j.salary||j.monthly||j.pay||j.wage))return true;
    if(state.careerLevel&&state.careerLevel>0)return true;
    if(state.businessManager205 && Array.isArray(state.businessManager205.businesses) && state.businessManager205.businesses.some(b=>(b.cashReserve||0)>3000||(b.profit||0)>0))return true;
    return false;
  }
  function canMortgage223(h){
    if(age223()<18)return [false,'Kan pas vanaf 18 jaar.'];
    if(!hasStableIncome223())return [false,'Voor hypotheek heb je stabiel inkomen nodig. Huren of volledig kopen kan wel.'];
    if((state.money||0)<h.down)return [false,'Niet genoeg eigen geld. Nodig: '+money223(h.down)];
    return [true,'Hypotheek mogelijk'];
  }
  function normalizeHouse223(h, tmpl={}){
    if(!h)return h;
    h.icon=h.icon||(h.owned?'🏠':'🏢');
    h.condition=clamp223(h.condition ?? tmpl.condition ?? (h.owned?65:55));
    h.quality=clamp223(h.quality ?? tmpl.quality ?? 55);
    h.comfort=clamp223(h.comfort ?? tmpl.comfort ?? 50);
    h.security=clamp223(h.security ?? tmpl.security ?? 35);
    h.energy=clamp223(h.energy ?? tmpl.energy ?? 35);
    h.rooms=h.rooms ?? tmpl.rooms ?? (h.owned?3:2);
    h.upgradeLevel=h.upgradeLevel||0;
    h.renovationHistory=h.renovationHistory||[];
    h.upkeep=Math.max(0,Math.round(h.upkeep||tmpl.upkeep||0));
    h.value=Math.round(h.value||tmpl.price||0);
    if(h.owned){
      h.rent=Math.round(h.rent||Math.max(650,(h.value||150000)*0.0055));
      h.price=h.price||h.value;
    }
    return h;
  }
  function normalizeAllHouses223(){
    state.houses=state.houses||[];
    state.houses.forEach(normalizeHouse223);
    if(state.houses.length&&!state.houses.some(h=>h.primary))state.houses[0].primary=true;
  }
  window.normalizeAllHouses223=normalizeAllHouses223;

  window.buyHouseScreen=function(){
    if(inJail223())return toast223('Je zit vast en kunt nu geen huis huren of kopen.');
    if(age223()<18)return toast223('Wonen/huis kopen kan vanaf 18 jaar.');
    normalizeAllHouses223();
    if(state.world==='nightcity')return buyNightCityHouseScreen223();
    const opts=housingOptions223();
    let h=card223(`<b>Wonen</b><br>Huren werkt zonder vaste baan. Kopen kan met hypotheek bij stabiel inkomen, of volledig cash als je genoeg geld hebt.<br>Bank balance: ${money223(state.money||0)}`);
    h+=section223('Huur opties');
    h+=(opts.rentals||[]).map((x,i)=>rr223('🏢',x.name,`${money223(x.monthly)}/mnd · ${x.desc}`,`rentHouse223(${i})`)).join('');
    h+=section223('Koop opties');
    h+=(opts.buy||[]).map((x,i)=>{
      const mt=canMortgage223(x);
      const cash=(state.money||0)>=x.price;
      const sub=`${money223(x.price)} · hypotheek ${money223(x.monthlyMortgage)}/mnd · eigen geld ${money223(x.down)} · ${cash?'cash mogelijk':mt[1]}`;
      return rr223(cash?'🏡':'🏠',x.name,sub,`houseBuyChoice223(${i})`,false);
    }).join('');
    h+=section223('Mijn woning');
    h+=state.houses.length?state.houses.map((x,i)=>rr223(x.icon||(x.owned?'🏠':'🏢'),x.name,houseSub223(x),`assetHouse(${i})`)).join(''):card223('Je hebt nog geen eigen woning. Tot 18 woon je thuis.');
    modal223('🏘️','Wonen / huis kopen',h);
  };
  try{buyHouseScreen=window.buyHouseScreen}catch(e){}

  function buyNightCityHouseScreen223(){
    const opts=ncHousingOptions223();
    let h=card223(`<b>Night City wonen</b><br>Huur of koop een woning in Night City. Cash kopen kan zonder hypotheekcheck.`);
    h+=section223('Night City huur');
    h+=(opts.rentals||[]).map((x,i)=>rr223(x.icon||'🌃',x.name,`${money223(x.monthly)}/mnd · ${x.desc}`,`rentNightCityHouse223(${i})`)).join('');
    h+=section223('Night City koop');
    h+=(opts.buy||[]).map((x,i)=>{
      const mt=canMortgage223(x), cash=(state.money||0)>=x.price;
      return rr223(x.icon||'🌃',x.name,`${money223(x.price)} · eigen geld ${money223(x.down)} · ${cash?'cash mogelijk':mt[1]}`,`nightCityHouseBuyChoice223(${i})`);
    }).join('');
    modal223('🌃','Night City wonen',h);
  }
  window.buyNightCityHouseScreen=buyNightCityHouseScreen223;

  window.houseBuyChoice223=function(i){
    const h=(housingOptions223().buy||[])[i];
    if(!h)return toast223('Woning niet gevonden.');
    let body=card223(`<b>${h.name}</b><br>${h.desc}<br>Prijs: ${money223(h.price)}<br>Hypotheek: ${money223(h.monthlyMortgage)}/mnd<br>Eigen geld: ${money223(h.down)}<br>Onderhoud: ${money223(h.upkeep)}/jr`);
    const canCash=(state.money||0)>=h.price;
    const mt=canMortgage223(h);
    body+=`<button class="btn ${mt[0]?'':'locked'}" onclick="${mt[0]?`buyHouseMortgage223(${i})`:''}">🏦 Kopen met hypotheek<br><span class="mini">${mt[1]}</span></button>`;
    body+=`<button class="btn ${canCash?'':'locked'}" onclick="${canCash?`buyHouseCash223(${i})`:''}">💰 Volledig cash kopen<br><span class="mini">${canCash?'Geen hypotheek':'Niet genoeg geld'}</span></button>`;
    modal223('🏠','Huis kopen',body);
  };
  window.nightCityHouseBuyChoice223=function(i){
    const h=(ncHousingOptions223().buy||[])[i];
    if(!h)return toast223('Woning niet gevonden.');
    const canCash=(state.money||0)>=h.price;
    const mt=canMortgage223(h);
    let body=card223(`<b>${h.name}</b><br>${h.desc}<br>Prijs: ${money223(h.price)}<br>Hypotheek: ${money223(h.monthlyMortgage)}/mnd<br>Eigen geld: ${money223(h.down)}`);
    body+=`<button class="btn ${mt[0]?'':'locked'}" onclick="${mt[0]?`buyNightCityHouseMortgage223(${i})`:''}">🏦 Kopen met hypotheek<br><span class="mini">${mt[1]}</span></button>`;
    body+=`<button class="btn ${canCash?'':'locked'}" onclick="${canCash?`buyNightCityHouseCash223(${i})`:''}">💰 Volledig cash kopen<br><span class="mini">${canCash?'Geen hypotheek':'Niet genoeg geld'}</span></button>`;
    modal223(h.icon||'🌃','Night City woning kopen',body);
  };

  function addBoughtHouse223(tmpl, mode='mortgage', world=null){
    state.houses=state.houses||[];
    clearPrimary223();
    state.houses=state.houses.filter(x=>x.owned); // remove rented primary when buying
    const house=normalizeHouse223({
      id:tmpl.id,name:tmpl.name,owned:true,primary:true,mortgage:mode==='mortgage',
      value:tmpl.price,price:tmpl.price,monthlyMortgage:mode==='mortgage'?tmpl.monthlyMortgage:0,
      upkeep:tmpl.upkeep,rent:tmpl.rent,rented:false,world:world||state.world||'normal',
      icon:tmpl.icon||'🏠',condition:tmpl.condition||70,quality:tmpl.quality||55,comfort:tmpl.comfort||55,security:tmpl.security||35,energy:tmpl.energy||35,rooms:tmpl.rooms||3
    },tmpl);
    state.houses.push(house);
    try{resolveHomelessAfterHousing(mode==='cash'?'koopwoning':'koopwoning met hypotheek')}catch(e){}
    return house;
  }
  window.rentHouse223=function(i){
    const h=(housingOptions223().rentals||[])[i];
    if(!h||age223()<18)return;
    state.houses=state.houses||[];
    clearPrimary223();
    // keep owned houses as investments, replace current rental
    state.houses=state.houses.filter(x=>x.owned);
    state.houses.push(normalizeHouse223({id:h.id,name:h.name,owned:false,primary:true,monthlyRent:h.monthly,upkeep:0,value:0,icon:'🏢',condition:70,quality:h.quality||55,comfort:h.comfort||50,security:35,energy:35,rooms:h.rooms||2},h));
    try{resolveHomelessAfterHousing('huurwoning')}catch(e){}
    closeModal(); action223('Wonen',`Ik huurde een ${h.name}. De maandlast is ${money223(h.monthly)} per maand.`,{Happiness:4},0,'good');
  };
  window.rentHouse=window.rentHouse223;
  try{rentHouse=window.rentHouse223}catch(e){}

  window.buyHouseMortgage223=function(i){
    const h=(housingOptions223().buy||[])[i];
    if(!h)return;
    const mt=canMortgage223(h);
    if(!mt[0])return toast223(mt[1]);
    state.money-=h.down;
    addBoughtHouse223(h,'mortgage',state.world||'normal');
    closeModal(); action223('Wonen',`Ik kocht een ${h.name} met hypotheek. Eigen geld: ${money223(h.down)}. Maandlast: ${money223(h.monthlyMortgage)}.`,{Happiness:8,Smarts:2},0,'good');
  };
  window.buyHouseMortgage=window.buyHouseMortgage223;
  try{buyHouseMortgage=window.buyHouseMortgage223}catch(e){}

  window.buyHouseCash223=function(i){
    const h=(housingOptions223().buy||[])[i];
    if(!h)return;
    if((state.money||0)<h.price)return toast223('Niet genoeg geld om cash te kopen.');
    state.money-=h.price;
    addBoughtHouse223(h,'cash',state.world||'normal');
    closeModal(); action223('Wonen',`Ik kocht een ${h.name} volledig cash. Geen hypotheek, maar wel onderhoud.`,{Happiness:10,Smarts:3},0,'good');
  };

  window.rentNightCityHouse223=function(i){
    const h=(ncHousingOptions223().rentals||[])[i];
    if(!h||state.world!=='nightcity'||age223()<18)return;
    clearPrimary223();
    state.houses=state.houses.filter(x=>x.owned);
    state.houses.push(normalizeHouse223({id:h.id,name:h.name,owned:false,primary:true,monthlyRent:h.monthly,upkeep:0,value:0,world:'nightcity',icon:h.icon||'🌃'},h));
    try{resolveHomelessAfterHousing('Night City huurwoning')}catch(e){}
    closeModal(); action223('Night City wonen',`Ik huurde een ${h.name}. Maandlast: ${money223(h.monthly)}.`,{Happiness:4},0,'good');
  };
  window.rentNightCityHouse=window.rentNightCityHouse223;
  try{rentNightCityHouse=window.rentNightCityHouse223}catch(e){}

  window.buyNightCityHouseMortgage223=function(i){
    const h=(ncHousingOptions223().buy||[])[i];
    if(!h)return;
    if(state.world!=='nightcity')return toast223('Deze woning is alleen in Night City.');
    const mt=canMortgage223(h);
    if(!mt[0])return toast223(mt[1]);
    state.money-=h.down;
    addBoughtHouse223(h,'mortgage','nightcity');
    closeModal(); action223('Night City wonen',`Ik kocht een ${h.name} met hypotheek.`,{Happiness:8,Smarts:2},0,'good');
  };
  window.buyNightCityHouseMortgage=window.buyNightCityHouseMortgage223;
  try{buyNightCityHouseMortgage=window.buyNightCityHouseMortgage223}catch(e){}

  window.buyNightCityHouseCash223=function(i){
    const h=(ncHousingOptions223().buy||[])[i];
    if(!h)return;
    if(state.world!=='nightcity')return toast223('Deze woning is alleen in Night City.');
    if((state.money||0)<h.price)return toast223('Niet genoeg geld om cash te kopen.');
    state.money-=h.price;
    addBoughtHouse223(h,'cash','nightcity');
    closeModal(); action223('Night City wonen',`Ik kocht een ${h.name} volledig cash.`,{Happiness:10,Smarts:3},0,'good');
  };

  function houseSub223(h){
    normalizeHouse223(h);
    if(h.owned)return `${money223(h.value)} · ${h.mortgage?'hypotheek '+money223(h.monthlyMortgage)+'/mnd':'afbetaald'} · comfort ${h.comfort}% · staat ${h.condition}%`;
    return `huur ${money223(h.monthlyRent)}/mnd · comfort ${h.comfort}% · kwaliteit ${h.quality}%`;
  }
  window.houseSub223=houseSub223;

  window.assetHouse=function(i){
    normalizeAllHouses223();
    const h=state.houses[i];
    if(!h)return toast223('Deze woning bestaat niet meer.');
    normalizeHouse223(h);
    let body=card223(`<b>${h.name}</b><br>${h.owned?'Eigen woning':'Huurwoning'}${h.primary?' · hoofdwoning':''}<br>
      ${h.owned?`Waarde: ${money223(h.value)}<br>Hypotheek: ${h.mortgage?money223(h.monthlyMortgage)+'/mnd':'geen'}<br>Verhuurwaarde: ${money223(h.rent||0)}/mnd<br>`:`Huur: ${money223(h.monthlyRent)}/mnd<br>`}
      Kamers: ${h.rooms}<br>Comfort: ${h.comfort}%<br>Kwaliteit: ${h.quality}%<br>Staat: ${h.condition}%<br>Beveiliging: ${h.security}%<br>Energiezuinig: ${h.energy}%<br>Onderhoud: ${money223(h.upkeep||0)}/jr`);
    body+=section223('Woning beheren');
    body+=rr223('🛠️','Upgraden / renoveren','Verbeter comfort, waarde, beveiliging en energie','houseUpgradeHub223('+i+')');
    if(!h.primary)body+=rr223('📍','Maak hoofdwoning','Ga hier zelf wonen','setPrimaryHouse223('+i+')');
    if(h.owned){
      body+=rr223('🏘️',h.rented?'Stop verhuur':'Verhuur woning',h.rented?'Zelf weer gebruiken':'Passief inkomen, minder eigen comfort',`toggleHouseRent(${i})`);
      body+=rr223('💰','Verkopen','Verkoop woning en los hypotheek/waarde af',`sellHouse(${i})`);
    }else{
      body+=rr223('🚪','Huur opzeggen','Verlaat deze huurwoning',`cancelRent(${i})`);
    }
    modal223(h.icon||(h.owned?'🏠':'🏢'),h.name,body);
  };
  try{assetHouse=window.assetHouse}catch(e){}

  window.setPrimaryHouse223=function(i){
    normalizeAllHouses223();
    const h=state.houses[i]; if(!h)return;
    clearPrimary223(); h.primary=true; if(h.owned)h.rented=false;
    closeModal(); action223('Wonen',`Ik ging wonen in mijn ${h.name}.`,{Happiness:2},0,'good');
  };

  const UPG223={
    repair:{icon:'🧰',title:'Onderhoud / reparatie',cost:900,ownedCost:1800,desc:'Herstelt staat en verlaagt risico op hoge onderhoudskosten.',apply(h){h.condition=clamp223(h.condition+18);h.quality=clamp223(h.quality+4);h.value+=h.owned?2500:0;}},
    furniture:{icon:'🛋️',title:'Meubels & inrichting',cost:1200,ownedCost:2200,desc:'Meer comfort en happiness.',apply(h){h.comfort=clamp223(h.comfort+14);h.quality=clamp223(h.quality+3);h.value+=h.owned?3000:0;}},
    kitchen:{icon:'🍳',title:'Keuken/badkamer upgrade',cost:0,ownedCost:8500,desc:'Dure renovatie met veel waarde en comfort.',apply(h){h.comfort=clamp223(h.comfort+12);h.quality=clamp223(h.quality+14);h.condition=clamp223(h.condition+8);h.value+=18000;h.rent=Math.round((h.rent||900)+120);}},
    garden:{icon:'🌳',title:'Tuin / balkon aanpakken',cost:600,ownedCost:3500,desc:'Meer happiness, looks-vibe en verkoopwaarde.',apply(h){h.comfort=clamp223(h.comfort+8);h.quality=clamp223(h.quality+5);h.value+=h.owned?6500:0;}},
    security:{icon:'🛡️',title:'Beveiliging',cost:800,ownedCost:2400,desc:'Minder risico op inbraak/ellende.',apply(h){h.security=clamp223(h.security+22);h.quality=clamp223(h.quality+2);h.value+=h.owned?2500:0;}},
    energy:{icon:'🔋',title:'Energiezuinig maken',cost:0,ownedCost:9000,desc:'Verhoogt waarde en verlaagt jaarlijkse lasten.',apply(h){h.energy=clamp223(h.energy+28);h.quality=clamp223(h.quality+8);h.value+=15000;h.upkeep=Math.max(300,Math.round((h.upkeep||0)*0.82));}},
    extension:{icon:'🏗️',title:'Uitbouw / extra kamer',cost:0,ownedCost:18000,desc:'Extra kamer, veel waarde, duur.',apply(h){h.rooms=(h.rooms||3)+1;h.comfort=clamp223(h.comfort+8);h.quality=clamp223(h.quality+7);h.value+=32000;h.rent=Math.round((h.rent||900)+180);}}
  };
  window.houseUpgradeHub223=function(i){
    normalizeAllHouses223();
    const h=state.houses[i]; if(!h)return;
    normalizeHouse223(h);
    let body=card223(`<b>${h.name}</b><br>Comfort ${h.comfort}% · Kwaliteit ${h.quality}% · Staat ${h.condition}%<br>Beveiliging ${h.security}% · Energie ${h.energy}% · Kamers ${h.rooms}<br><span class="mini">${h.owned?'Eigen woning: alle upgrades mogelijk.':'Huurwoning: alleen lichte upgrades/verzorging mogelijk.'}</span>`);
    body+=section223('Upgrades');
    Object.keys(UPG223).forEach(k=>{
      const u=UPG223[k];
      const cost=h.owned?u.ownedCost:u.cost;
      const locked=!h.owned && cost<=0;
      body+=rr223(u.icon,u.title,`${u.desc} · ${locked?'alleen eigen woning':money223(cost)}`,`houseDoUpgrade223(${i},'${k}')`,locked);
    });
    modal223('🛠️','Woning upgraden',body);
  };
  window.houseDoUpgrade223=function(i,k){
    normalizeAllHouses223();
    const h=state.houses[i], u=UPG223[k]; if(!h||!u)return;
    normalizeHouse223(h);
    const cost=h.owned?u.ownedCost:u.cost;
    if(!h.owned&&cost<=0)return toast223('Deze upgrade kan alleen bij een eigen woning.');
    if((state.money||0)<cost)return toast223('Niet genoeg geld. Nodig: '+money223(cost));
    state.money-=cost;
    const oldValue=h.value||0;
    u.apply(h);
    h.upgradeLevel=(h.upgradeLevel||0)+1;
    h.renovationHistory=h.renovationHistory||[];
    h.renovationHistory.push({age:state.age,upgrade:k,cost});
    closeModal();
    const gain=(h.value||0)-oldValue;
    action223('Woning upgrade',`Ik deed: ${u.title}. ${h.owned&&gain>0?'De woningwaarde steeg met ongeveer '+money223(gain)+'.':''}`,{Happiness:3,Smarts:1},0,'good');
  };

  const oldAssetsHTML223=window.assetsHTML||(typeof assetsHTML==='function'?assetsHTML:null);
  if(oldAssetsHTML223&&!oldAssetsHTML223.__housing223){
    window.assetsHTML=function(){
      normalizeAllHouses223();
      const h=state.houses.map((x,i)=>rr223(x.icon||(x.owned?'🏠':'🏢'),x.name,houseSub223(x),`assetHouse(${i})`,state.age<18)).join('');
      let raw=oldAssetsHTML223.apply(this,arguments);
      raw=String(raw).replace(/<div class="section">Mijn woning\(en\)<\/div>[\s\S]*?(?=<div class="section">Mijn auto’s<\/div>)/,`<div class="section">Mijn woning(en)</div>${h||'<div class="card">Nog geen woning. Tot 18 woon je thuis.</div>'}`);
      return raw;
    };
    window.assetsHTML.__housing223=true;
    try{assetsHTML=window.assetsHTML}catch(e){}
  }

  // Kids sports from age 6
  const SPORTS223={
    football:{icon:'⚽',name:'Voetbal',skill:'passing, schieten en teamwork',stats:{Happiness:5,Fitness:5,Health:2,Stamina:-8}},
    karate:{icon:'🥋',name:'Karate',skill:'discipline, balans en zelfvertrouwen',stats:{Happiness:3,Fitness:5,Health:2,Smarts:2,Stamina:-7}},
    tennis:{icon:'🎾',name:'Tennis',skill:'reactie, techniek en conditie',stats:{Happiness:4,Fitness:4,Health:2,Looks:1,Stamina:-7}},
    baseball:{icon:'⚾',name:'Honkbal',skill:'slaan, gooien en focus',stats:{Happiness:4,Fitness:4,Health:2,Smarts:1,Stamina:-7}}
  };
  function sportState223(k){state.kidSports223=state.kidSports223||{};state.kidSports223[k]=state.kidSports223[k]||{level:0,xp:0,medals:0,joined:false};return state.kidSports223[k]}
  function sportCost223(){return age223()<16?0:25}
  window.kidsSportsHub223=function(){
    let body=card223(`<b>Kinder sport</b><br>Vanaf 6 jaar kun je op kinder sport. Ouders betalen meestal tot je 16 bent.<br>Sport geeft fitness, health, stamina-verbruik en later talent.`);
    if(age223()<6)body+=card223('Je bent nog te jong. Kinder sport kan vanaf 6 jaar.');
    body+=section223('Sporten');
    Object.keys(SPORTS223).forEach(k=>{
      const s=SPORTS223[k], st=sportState223(k);
      body+=rr223(s.icon,s.name,age223()>=6?`Level ${st.level} · XP ${st.xp} · ${s.skill}`:'Vanaf 6 jaar',`kidSportScreen223('${k}')`,age223()<6);
    });
    modal223('🏃','Kinder sport',body);
  };
  window.kidSportScreen223=function(k){
    const s=SPORTS223[k], st=sportState223(k); if(!s)return;
    let body=card223(`${s.icon} <b>${s.name}</b><br>${s.skill}<br>Level ${st.level} · XP ${st.xp} · Medailles ${st.medals}<br><span class="mini">Leeftijd ${age223()} jaar. ${age223()<16?'Ouders betalen meestal.':'Je betaalt zelf ongeveer '+money223(sportCost223())+'.'}</span>`);
    body+=rr223('📝','Aanmelden / proefles',st.joined?'Je zit al op deze sport':'Start deze sportclub',`kidSportDo223('${k}','join')`,age223()<6||st.joined);
    body+=rr223('🏃','Training','Train techniek en conditie',`kidSportDo223('${k}','train')`,age223()<6);
    body+=rr223('🏆','Wedstrijd / toernooi','Kans op medaille bij genoeg level',`kidSportDo223('${k}','match')`,age223()<7);
    body+=rr223('🚪','Stoppen met sport','Stop met deze sportclub',`kidSportDo223('${k}','quit')`,!st.joined);
    modal223(s.icon,s.name,body);
  };
  window.kidSportDo223=function(k,kind){
    const s=SPORTS223[k], st=sportState223(k); if(!s)return;
    if(age223()<6)return toast223('Kinder sport kan vanaf 6 jaar.');
    let cost=sportCost223();
    if(kind==='join'){st.joined=true;st.xp+=5;closeModal();action223('Kinder sport',`Ik ging op ${s.name}. Ik leerde de basis van ${s.skill}.`,{Happiness:6,Fitness:3,Health:2},age223()<16?0:-cost,'good');return;}
    if(kind==='quit'){st.joined=false;closeModal();action223('Kinder sport',`Ik stopte met ${s.name}.`,{Happiness:-2},0,'warn');return;}
    if(kind==='train'){
      if(!st.joined)st.joined=true;
      st.xp+=r223(6,14);
      if(st.xp>=30+st.level*20){st.xp=0;st.level++;s.stats.Happiness=(s.stats.Happiness||0)+1;}
      closeModal();action223(s.name,`Ik trainde ${s.name}. Ik werkte aan ${s.skill}.`,s.stats,age223()<16?0:-cost,'good');return;
    }
    if(kind==='match'){
      if(!st.joined)st.joined=true;
      const chance=0.25+(st.level*0.08)+((state.talents&&state.talents.sport||0)*0.006);
      const win=Math.random()<chance;
      st.xp+=win?16:8;
      if(win)st.medals++;
      state.talents=state.talents||{};state.talents.sport=(state.talents.sport||0)+(win?3:1);
      closeModal();action223(s.name,win?`Ik deed mee aan een wedstrijd/toernooi en won met ${s.name}!`:`Ik deed mee aan een wedstrijd/toernooi. Ik won niet, maar werd wel beter.`,win?{Happiness:10,Fitness:5,Health:2,Stamina:-10}:{Happiness:3,Fitness:4,Health:1,Stamina:-9},age223()<16?0:-cost,win?'good':'warn');return;
    }
  };

  // Integrate kids sport into existing hubs.
  const oldGym223=window.gymScreen||(typeof gymScreen==='function'?gymScreen:null);
  if(oldGym223&&!oldGym223.__kidsSport223){
    window.gymScreen=function(){
      if(age223()>=6 && age223()<18){
        let body=card223(`<b>Sport</b><br>Fitheid: ${clamp223(state.fitness||50)}%<br>Stamina: ${clamp223(state.stamina||50)}%`);
        body+=rr223('🏃','Kinder sport clubs','Voetbal, karate, tennis en honkbal','kidsSportsHub223()');
        body+=rr223('⚽','Buiten spelen / sportclub classic','Originele sportclub acties','gymAction("club")',!exists223('gymAction'));
        body+=rr223('🚶','Walk / wandelen','Buiten bewegen','walkScreen()',age223()<8||!exists223('walkScreen'));
        modal223('🏃','Sport',body);
        return;
      }
      return oldGym223.apply(this,arguments);
    };
    window.gymScreen.__kidsSport223=true;
    try{gymScreen=window.gymScreen}catch(e){}
  }

  const oldHealth223=window.healthLooksHub204||null;
  if(oldHealth223&&!oldHealth223.__kidsSport223){
    window.healthLooksHub204=function(){
      oldHealth223.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body && age223()>=6 && age223()<18 && !body.innerHTML.includes('kidsSportsHub223')){
            const sec=document.createElement('div');sec.className='section';sec.textContent='Kinder sport';
            const wrap=document.createElement('div');wrap.innerHTML=rr223('🏃','Kinder sport clubs','Voetbal, karate, tennis en honkbal','kidsSportsHub223()');
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(sec,alt||null);body.insertBefore(wrap.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.healthLooksHub204.__kidsSport223=true;
  }

  const oldMaster223=window.masterActivities204||null;
  if(oldMaster223&&!oldMaster223.__housingSport223){
    window.masterActivities204=function(){
      let html=oldMaster223.apply(this,arguments);
      if(age223()>=6 && age223()<18 && !String(html).includes('kidsSportsHub223')){
        html=String(html).replace('<div class="section">Activiteiten</div>','<div class="section">Activiteiten</div>'+rr223('🏃','Kinder sport clubs','Voetbal, karate, tennis en honkbal','kidsSportsHub223()'));
      }
      return html;
    };
    window.masterActivities204.__housingSport223=true;
    window.activitiesHTML=function(){return window.masterActivities204()};
    try{activitiesHTML=window.activitiesHTML}catch(e){}
  }

  window.housingSportsDebug223=function(){
    normalizeAllHouses223();
    let body=card223(`<b>Housing</b><br>Huizen: ${state.houses.length}<br>Stable income: ${hasStableIncome223()?'ja':'nee'}<br>Money: ${money223(state.money||0)}`);
    body+=state.houses.map((h,i)=>card223(`${h.icon} <b>${h.name}</b><br>${houseSub223(h)}<br>Comfort ${h.comfort}% · Kwaliteit ${h.quality}% · Staat ${h.condition}%`)).join('');
    body+=card223(`<b>Kinder sport</b><br>${age223()>=6?'Beschikbaar':'Nog niet beschikbaar'} vanaf 6 jaar.`);
    modal223('🛠️','Housing/Sport Debug',body);
  };

  setTimeout(()=>{try{normalizeAllHouses223(); if(typeof safeSave==='function')safeSave(); if(typeof render==='function')render();}catch(e){}},250);
})();
