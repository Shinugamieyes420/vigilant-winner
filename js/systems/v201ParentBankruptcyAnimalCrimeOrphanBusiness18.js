
/* v20.1 Parent Bankruptcy + Animal Crime Orphan Mode + Business 18+
   - Parent gifts/support can bankrupt parents after too much pressure.
   - 10 bikes/gifts from parents -> parents bankrupt and forced to move.
   - Selling animals 5 times lifetime -> under 18 parents arrested + orphan mode, 18+ player jailed 4 years.
   - 4th animal sale has a violent angry-owner random event: health drops.
   - Investing/eigen business explicitly unlocked from 18, blocked under 18.
*/
(function(){
  function r201(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function clamp201(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money201(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast201(t){try{toast(t)}catch(e){console.log(t)}}
  function save201(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function addRel201(p,d){try{addRel(p,d)}catch(e){if(p)p.rel=clamp201((p.rel||50)+d)}}
  function apply201(stats){
    stats=stats||{};
    try{applyStats(stats)}catch(e){}
    state.stats=state.stats||{};
    Object.keys(stats).forEach(k=>{
      const d=stats[k]; if(!d)return;
      if(['Happiness','Health','Smarts','Looks'].includes(k))state.stats[k]=clamp201((state.stats[k]??50)+d);
      if(k==='Happiness'&&typeof state.happiness==='number')state.happiness=clamp201(state.happiness+d);
      if(k==='Health'&&typeof state.health==='number')state.health=clamp201(state.health+d);
      if(k==='Smarts'&&typeof state.smarts==='number')state.smarts=clamp201(state.smarts+d);
      if(k==='Looks'&&typeof state.looks==='number')state.looks=clamp201(state.looks+d);
      if(k==='Stamina')state.stamina=clamp201((state.stamina??50)+d);
      if(k==='Social')state.social=clamp201((state.social??0)+d,0,999999);
    });
  }
  function fx201(stats){
    return Object.keys(stats||{}).filter(k=>stats[k]).map(k=>k+' '+(stats[k]>0?'+':'')+stats[k]).join(' · ');
  }
  function modalResult201(icon,title,text,stats,type='bad'){
    apply201(stats||{});
    const fx=fx201(stats||{});
    try{addLog('<b>'+title+'</b><br>'+text+(fx?'<br><span class="mini">Effect: '+fx+'</span>':''),type,false)}catch(e){}
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${fx?`<div class="vac187-effect">Effect: ${fx}</div>`:''}<button class="btn" onclick="closeModal()">Verder</button></div>`);
    save201();
  }
  function ensure201(){
    state.flags=state.flags||{};
    state.familyEconomy201=state.familyEconomy201||{
      parentMoney:r201(9000,28000),
      supportCount:0,
      bikeGiftCount:0,
      petSupportCount:0,
      bankrupt:false,
      moved:false,
      housing:'normaal gezinshuis'
    };
    state.animalCrime201=state.animalCrime201||{
      lifetimeSold:0,
      punished:false,
      orphanTriggered:false,
      adultJailTriggered:false,
      fourthSaleAttack:false
    };
  }
  function familyStatus201(){
    ensure201();
    const f=state.familyEconomy201;
    return `<div class="card"><b>Familie-financiën</b><br>Oudergeld: ${f.bankrupt?'failliet':money201(Math.max(0,f.parentMoney))}<br>Ouder-cadeaus/steun: ${f.supportCount}/10<br>Fietsen gekregen: ${f.bikeGiftCount}/10<br>Dieren door ouders betaald: ${f.petSupportCount}<br>Woning: ${f.housing}${state.orphanMode201?'<br><b>Wees mode actief:</b> je woont via jeugdzorg/pleegzorg.':''}</div>`;
  }
  function parentBankruptcy201(reason){
    ensure201();
    const f=state.familyEconomy201;
    if(f.bankrupt)return true;
    f.bankrupt=true;
    f.moved=true;
    f.parentMoney=0;
    f.housing='goedkope noodwoning / kleine huurwoning';
    state.money=0;
    state.flags.parentsBankrupt201=true;
    if(state.mother){addRel201(state.mother,-22);state.mother.bankrupt=true;}
    if(state.father){addRel201(state.father,-22);state.father.bankrupt=true;}
    modalResult201('🏚️','Ouders failliet',`${reason}<br><br>Mijn ouders konden het financieel niet meer aan. We moesten verhuizen naar een veel kleinere woning. Mijn geld ging terug naar ${money201(0)} en mijn happiness kelderde.`,{Happiness:-45,Health:-8,Smarts:-5,Looks:-4,Stamina:-10,Social:-6},'bad');
    return true;
  }
  window.recordParentSupport201=function(kind,value,label){
    ensure201();
    const f=state.familyEconomy201;
    if(f.bankrupt)return false;
    f.supportCount++;
    if(kind==='bike')f.bikeGiftCount++;
    if(kind==='pet')f.petSupportCount++;
    f.parentMoney -= Math.max(0,Math.round(value||0));
    try{addLog(`<b>Oudersteun</b><br>${label||'Mijn ouders hielpen financieel.'}<br>Ouder-cadeaus/steun: ${f.supportCount}/10 · fietsen: ${f.bikeGiftCount}/10 · oudergeld over: ${money201(Math.max(0,f.parentMoney))}`, f.supportCount>=8?'warn':'good', false)}catch(e){}
    if(f.bikeGiftCount>=10){
      parentBankruptcy201('Mijn ouders hadden mij veel te vaak een fiets gegeven. Na de 10e fiets konden ze de kosten niet meer dragen.');
      return true;
    }
    if(f.supportCount>=10 || f.parentMoney<=0){
      parentBankruptcy201('Mijn ouders hadden mij te vaak financieel geholpen. De rekeningen stapelden op en ze gingen failliet.');
      return true;
    }
    save201();
    return false;
  };
  window.parentAskBike201=function(type){
    ensure201();
    if(state.orphanMode201)return toast201('Je woont niet meer bij je ouders.');
    if(state.familyEconomy201.bankrupt)return toast201('Je ouders zijn failliet en kunnen geen fiets kopen.');
    const isE=type==='ebike';
    const price=isE?1800:120;
    const pRel=Math.round(((state.mother?.rel||50)+(state.father?.rel||50))/2);
    const chance=isE?Math.min(.55,pRel/180):Math.min(.86,pRel/125);
    closeModal();
    if(Math.random()>chance){
      addRel201(state.mother,-2); addRel201(state.father,-2);
      try{action('Fiets gevraagd',`Ik vroeg mijn ouders om een ${isE?'e-bike':'fiets'}, maar ze zeiden nee. Ze vonden dat ik niet steeds dure dingen kan vragen.`,{Happiness:-4,Smarts:1},0,'warn')}catch(e){modalResult201('🚲','Fiets geweigerd','Mijn ouders zeiden nee.',{Happiness:-4,Smarts:1},'warn')}
      return;
    }
    state.items=state.items||[];
    state.items.push({id:isE?'parent_ebike_201':'parent_bike_201',name:isE?'E-bike van ouders':'Fiets van ouders',icon:isE?'🚴':'🚲',price,source:'ouders',boughtAge:state.age});
    apply201({Happiness:isE?8:5,Stamina:isE?4:2});
    try{addLog(`<b>Fiets gekregen</b><br>Mijn ouders kochten een ${isE?'e-bike':'fiets'} voor mij. Leuk, maar dit telt wel mee als ouderlijke financiële druk.`, 'good', false)}catch(e){}
    const bankrupted=recordParentSupport201('bike',price,`Mijn ouders gaven mij een ${isE?'e-bike':'fiets'} van ${money201(price)}.`);
    if(!bankrupted)showModal(`<div class="modalTop"><div class="avatar">${isE?'🚴':'🚲'}</div><div class="modalTitle">Fiets gekregen</div></div><div class="modalBody"><p>Mijn ouders kochten een ${isE?'e-bike':'fiets'} voor mij.</p><div class="vac187-effect">Effect: Happiness +${isE?8:5} · Stamina +${isE?4:2}</div><button class="btn" onclick="closeModal()">Verder</button></div>`);
    save201();
  };

  function orphanMode201(reason){
    ensure201();
    if(state.orphanMode201)return true;
    state.orphanMode201=true;
    state.flags.orphanMode201=true;
    state.orphanReason201=reason||'Ouders opgepakt.';
    state.money=0;
    state.familyEconomy201.bankrupt=true;
    state.familyEconomy201.housing='jeugdzorg / pleeggezin';
    if(state.mother){state.mother.arrested=true;state.mother.rel=clamp201((state.mother.rel||50)-40);}
    if(state.father){state.father.arrested=true;state.father.rel=clamp201((state.father.rel||50)-40);}
    modalResult201('🧒','Wees mode',`${state.orphanReason201}<br><br>Ik werd uit huis geplaatst en kwam in jeugdzorg/pleegzorg terecht. Mijn geld ging naar ${money201(0)} en mijn happiness zakte extreem.`,{Happiness:-60,Health:-12,Smarts:-8,Looks:-5,Stamina:-15,Social:-12},'bad');
    return true;
  }
  window.triggerOrphanMode201=orphanMode201;

  function fourthSaleAttack201(p){
    ensure201();
    if(state.animalCrime201.fourthSaleAttack)return false;
    state.animalCrime201.fourthSaleAttack=true;
    const petName=(p&&p.name)||'het dier';
    modalResult201('🤕','Boze nieuwe eigenaar',`Na de vierde keer dat ik een dier verkocht, ging het mis. ${petName} ging kort na de verkoop dood bij de nieuwe eigenaar. De eigenaar gaf mij de schuld, werd woest en sloeg mij in elkaar.<br><br>Mijn health ging hard omlaag en ik kreeg een flinke waarschuwing dat dieren verkopen geen onschuldige geldtruc is.`,{Health:-28,Happiness:-18,Looks:-4,Stamina:-12,Social:-5},'bad');
    return true;
  }
  function animalTradePunishment201(){
    ensure201();
    const a=state.animalCrime201;
    if(a.punished || a.lifetimeSold<5)return false;
    a.punished=true;
    if((state.age||0)<18){
      a.orphanTriggered=true;
      orphanMode201('Na vijf dieren verkopen werd dit gezien als illegale dierenhandel. Omdat ik minderjarig was, werden mijn ouders verantwoordelijk gehouden en opgepakt.');
      return true;
    }else{
      a.adultJailTriggered=true;
      try{addLog(`<b>Illegale dierenhandel</b><br>Na vijf dieren verkopen werd ik opgepakt.`, 'bad', false)}catch(e){}
      try{convict('illegale dierenhandel',4)}catch(e){
        state.jail={yearsLeft:4,total:4,reason:'illegale dierenhandel',facility:'Gevangenis'};
        modalResult201('⚖️','Gevangenis','Je kreeg 4 jaar gevangenis voor illegale dierenhandel.',{Happiness:-25,Looks:-5},'bad');
      }
      save201();
      return true;
    }
  }
  window.recordPetSaleCrime201=function(p){
    ensure201();
    const a=state.animalCrime201;
    a.lifetimeSold++;
    try{addLog(`<b>Dierenverkoop</b><br>Je verkocht ${p?.name||'een dier'}. Lifetime dieren verkocht: ${a.lifetimeSold}/5.<br><span class="mini">4e keer = gevaarlijk incident. 5e keer = illegale dierenhandel.</span>`, a.lifetimeSold>=4?'bad':'warn', false)}catch(e){}
    if(a.lifetimeSold===4){
      fourthSaleAttack201(p);
      return true;
    }
    if(a.lifetimeSold>=5){
      return animalTradePunishment201();
    }
    save201();
    return false;
  };

  window.orphanModeScreen201=function(){
    ensure201();
    const active=!!state.orphanMode201;
    let out=`<div class="card"><b>${active?'Wees mode actief':'Wees mode niet actief'}</b><br>${active?(state.orphanReason201||'Je woont via jeugdzorg.'):'Je woont nog niet in wees mode.'}<br><br>Dieren verkocht lifetime: ${state.animalCrime201.lifetimeSold}/5</div>`;
    if(active){
      out += `<div class="section">Jeugdzorg / pleeggezin</div>`;
      out += `<button class="btn" onclick="orphanAction201('talk')">💬 Met begeleider praten</button>`;
      out += `<button class="btn" onclick="orphanAction201('school')">📚 School vasthouden</button>`;
      out += `<button class="btn" onclick="orphanAction201('cry')">😢 Alles eruit laten</button>`;
      out += `<button class="btn" onclick="orphanAction201('support')">🤝 Steun zoeken</button>`;
    }
    out += `<button class="btn alt" onclick="closeModal()">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">🧒</div><div class="modalTitle">Wees mode</div></div><div class="modalBody">${out}</div>`);
  };
  window.orphanAction201=function(kind){
    let txt='',stats={},type='good';
    if(kind==='talk'){txt='Ik praatte met een begeleider. Het loste niet alles op, maar ik voelde mij iets minder alleen.';stats={Happiness:3,Smarts:1,Social:2};}
    if(kind==='school'){txt='Ik probeerde school vast te houden ondanks alles thuis. Het kostte energie, maar gaf structuur.';stats={Smarts:4,Happiness:-1,Stamina:-3};}
    if(kind==='cry'){txt='Ik liet alles eruit. Niet stoer, wel menselijk.';stats={Happiness:-2,Health:2};type='warn';}
    if(kind==='support'){txt='Ik zocht steun bij iemand die ik vertrouwde. Dat maakte de dag iets minder zwaar.';stats={Happiness:5,Social:3,Health:1};}
    closeModal();
    try{action('Wees mode',txt,stats,0,type)}catch(e){modalResult201('🧒','Wees mode',txt,stats,type)}
    save201();
  };

  function adultOnly201(feature){
    if((state.age||0)>=18)return false;
    showModal(`<div class="modalTop"><div class="avatar">🔒</div><div class="modalTitle">${feature}</div></div><div class="modalBody"><div class="card">${feature} kan vanaf 18 jaar.<br>Onder 18 kun je geen eigen business starten of investeren.</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
    return true;
  }

  // Parent money asking now affects parent finances.
  window.askMoney=function(who){
    ensure201();
    if(state.orphanMode201)return toast201('Je ouders kunnen je niet helpen in wees mode.');
    if(state.familyEconomy201.bankrupt)return toast201('Je ouders zijn failliet.');
    const p=state[who]; if(!p)return;
    const ok=Math.random() < ((p.rel||50)/135);
    closeModal();
    if(ok){
      const cash=r201(25,650);
      addRel201(p,-2);
      state.money=(state.money||0)+cash;
      apply201({Happiness:2});
      try{addLog(`<b>Familie</b><br>${p.name} gaf mij ${money201(cash)}. Het hielp, maar het telt mee als ouderlijke steun.`, 'good', false)}catch(e){}
      const bankrupted=recordParentSupport201('money',cash,`${p.name} gaf mij ${money201(cash)}.`);
      if(!bankrupted)showModal(`<div class="modalTop"><div class="avatar">💰</div><div class="modalTitle">Geld gekregen</div></div><div class="modalBody"><p>${p.name} gaf mij ${money201(cash)}.</p><div class="vac187-effect">Effect: Happiness +2</div><button class="btn" onclick="closeModal()">Verder</button></div>`);
      save201();
    }else{
      addRel201(p,-8);
      try{action('Familie',`${p.name} wilde geen geld geven en zei dat ik zelf moet leren omgaan met geld.`,{Happiness:-3,Smarts:1},0,'bad')}catch(e){modalResult201('Familie','Geld geweigerd',`${p.name} wilde geen geld geven.`,{Happiness:-3,Smarts:1},'bad')}
    }
  };
  try{askMoney=window.askMoney}catch(e){}

  const oldParentScreen201=window.parentScreen || (typeof parentScreen==='function'?parentScreen:null);
  window.parentScreen=function(who){
    ensure201();
    if(state.orphanMode201){
      const p=state[who]||{};
      showModal(`<div class="modalTop"><div class="avatar">🚓</div><div class="modalTitle">${p.name||'Ouder'}</div></div><div class="modalBody"><div class="card"><b>Geen normale ouderrelatie</b><br>${p.name||'Deze ouder'} is niet beschikbaar door de situatie rond wees mode.<br>Reden: ${state.orphanReason201||'onbekend'}</div><button class="btn" onclick="orphanModeScreen201()">🧒 Wees mode bekijken</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
      return;
    }
    if(oldParentScreen201)oldParentScreen201(who);
    setTimeout(()=>{
      try{
        const body=document.querySelector('#modal .modalBody');
        if(!body || body.innerHTML.includes('parentAskBike201'))return;
        const wrap=document.createElement('div');
        wrap.innerHTML=`${familyStatus201()}<div class="section">Oudersteun met gevolgen</div><button class="btn" onclick="parentAskBike201('bike')">🚲 Vraag fiets aan ouders<br><span class="mini">Telt mee. 10 fietsen = ouders failliet.</span></button><button class="btn" onclick="parentAskBike201('ebike')">🚴 Vraag e-bike aan ouders<br><span class="mini">Duurder. Telt zwaar mee voor oudergeld.</span></button>`;
        body.insertBefore(wrap, body.querySelector('button.btn.alt')||null);
      }catch(e){}
    },0);
  };
  try{parentScreen=window.parentScreen}catch(e){}

  // Minor pet purchases by parents now count as parent support.
  const oldBuyTempPet201=window.buyTempPet || (typeof buyTempPet==='function'?buyTempPet:null);
  if(oldBuyTempPet201){
    window.buyTempPet=function(source,i){
      ensure201();
      const before=(state.pets||[]).length;
      const list=window._petChoices&&window._petChoices.list?window._petChoices.list:[];
      const p=list[i];
      const res=oldBuyTempPet201.apply(this,arguments);
      try{
        if((state.age||0)<18 && (state.pets||[]).length>before && p){
          recordParentSupport201('pet',p.price||100,`Mijn ouders betaalden voor huisdier ${p.name||p.breed||p.type} (${money201(p.price||100)}).`);
        }
      }catch(e){}
      return res;
    };
    try{buyTempPet=window.buyTempPet}catch(e){}
  }

  // Sell pet override so 4th/5th lifetime animal-sale consequences cannot be bypassed.
  const oldPetAction201=window.petAction || (typeof petAction==='function'?petAction:null);
  window.petAction=function(i,kind){
    ensure201();
    if(kind==='sell'){
      const p=state.pets&&state.pets[i];
      if(!p)return;
      const price=Math.max(15,Math.round((p.price||100)*r201(25,65)/100));
      state.pets.splice(i,1);
      state.money=(state.money||0)+price;
      closeModal();
      try{addLog(`<b>Huisdier verkocht</b><br>Ik verkocht ${p.name}. Het leverde ${money201(price)} op, maar het voelde kil.`, 'warn', false)}catch(e){}
      const special=recordPetSaleCrime201(p);
      if(!special){
        modalResult201('🐾','Huisdier verkocht',`Ik verkocht ${p.name}. Het leverde ${money201(price)} op, maar het voelde behoorlijk kil.`,{Happiness:-8},'warn');
      }
      save201();
      return;
    }
    if(oldPetAction201)return oldPetAction201.apply(this,arguments);
  };
  try{petAction=window.petAction}catch(e){}

  // Business/investing 18+ wrappers.
  const oldInvestmentHub201=window.investmentHub165 || null;
  if(oldInvestmentHub201){
    window.investmentHub165=function(){if(adultOnly201('Investeren'))return;return oldInvestmentHub201.apply(this,arguments)};
  }
  const oldInvestAmount201=window.investAmount165 || null;
  if(oldInvestAmount201){
    window.investAmount165=function(){if(adultOnly201('Investeren'))return;return oldInvestAmount201.apply(this,arguments)};
  }
  const oldBuyInvestment201=window.buyInvestment165 || null;
  if(oldBuyInvestment201){
    window.buyInvestment165=function(){if(adultOnly201('Investeren'))return;return oldBuyInvestment201.apply(this,arguments)};
  }
  const oldBusinessHub201=window.businessHub165 || null;
  if(oldBusinessHub201){
    window.businessHub165=function(){if(adultOnly201('Eigen business'))return;return oldBusinessHub201.apply(this,arguments)};
  }
  const oldStartBusiness165201=window.startBusiness165 || null;
  if(oldStartBusiness165201){
    window.startBusiness165=function(){if(adultOnly201('Eigen business'))return;return oldStartBusiness165201.apply(this,arguments)};
  }
  const oldBusinessScreen201=window.businessScreen || (typeof businessScreen==='function'?businessScreen:null);
  if(oldBusinessScreen201){
    window.businessScreen=function(){if(adultOnly201('Business'))return;return oldBusinessScreen201.apply(this,arguments)};
    try{businessScreen=window.businessScreen}catch(e){}
  }
  const oldStartBusiness201=window.startBusiness || (typeof startBusiness==='function'?startBusiness:null);
  if(oldStartBusiness201){
    window.startBusiness=function(){if(adultOnly201('Business'))return;return oldStartBusiness201.apply(this,arguments)};
    try{startBusiness=window.startBusiness}catch(e){}
  }
  const oldInvestBusiness201=window.investBusiness || (typeof investBusiness==='function'?investBusiness:null);
  if(oldInvestBusiness201){
    window.investBusiness=function(){if(adultOnly201('Business investeren'))return;return oldInvestBusiness201.apply(this,arguments)};
    try{investBusiness=window.investBusiness}catch(e){}
  }

  // Orphan mode yearly flavor, parent bankruptcy carry-over.
  const oldAgeUp201=window.ageUp || (typeof ageUp==='function'?ageUp:null);
  if(oldAgeUp201 && !oldAgeUp201.__v201){
    window.ageUp=function(){
      const res=oldAgeUp201.apply(this,arguments);
      try{
        ensure201();
        if(state.orphanMode201 && (state.age||0)<18){
          const lines=[
            'Jeugdzorg checkte mijn situatie. Ik probeerde normaal te doen, maar thuis voelde niets meer normaal.',
            'In het pleeggezin/jeugdzorg voelde ik mij tijdelijk veilig, maar ook los van alles wat ik kende.',
            'School bleef draaien terwijl mijn hoofd ergens anders zat.',
            'Ik kreeg begeleiding, maar het gemis aan een normaal thuis bleef zwaar.'
          ];
          const txt=lines[Math.floor(Math.random()*lines.length)];
          apply201({Happiness:-3,Smarts:1,Stamina:-2});
          try{addLog('<b>Wees mode</b><br>'+txt+'<br><span class="mini">Effect: Happiness -3 · Smarts +1 · Stamina -2</span>','warn',false)}catch(e){}
        }
        if(state.orphanMode201 && (state.age||0)>=18 && !state.flags.orphanAgedOut201){
          state.flags.orphanAgedOut201=true;
          try{addLog('<b>Wees mode</b><br>Ik werd volwassen en viel uit jeugdzorg. Nu moet ik mijn eigen leven opbouwen.','warn',false)}catch(e){}
        }
        save201();
      }catch(e){}
      return res;
    };
    window.ageUp.__v201=true;
    try{ageUp=window.ageUp}catch(e){}
  }

  const oldRelationships201=window.relationshipsHTML || (typeof relationshipsHTML==='function'?relationshipsHTML:null);
  if(oldRelationships201){
    window.relationshipsHTML=function(){
      ensure201();
      let h=oldRelationships201.apply(this,arguments);
      if(state.orphanMode201 && !String(h).includes('orphanModeScreen201')){
        h = `<div class="section">Wees mode</div>${typeof row==='function'?row('🧒','Wees mode','Jeugdzorg, pleeggezin en gevolgen van ouder-arrestatie','orphanModeScreen201()'):`<button class="btn" onclick="orphanModeScreen201()">🧒 Wees mode</button>`}` + h;
      }
      return h;
    };
    try{relationshipsHTML=window.relationshipsHTML}catch(e){}
  }
  const oldActivities201=window.activitiesHTML || (typeof activitiesHTML==='function'?activitiesHTML:null);
  if(oldActivities201){
    window.activitiesHTML=function(){
      ensure201();
      let h=oldActivities201.apply(this,arguments);
      if(!String(h).includes('parentBankruptcyInfo201')){
        h += `<div class="section">Risico systemen</div>${typeof row==='function'?row('🏚️','Familie-financiën & risico','Oudersteun, fietsen, dierenverkoop, wees mode','parentBankruptcyInfo201()'):`<button class="btn" onclick="parentBankruptcyInfo201()">🏚️ Familie-financiën & risico</button>`}`;
      }
      return h;
    };
    try{activitiesHTML=window.activitiesHTML}catch(e){}
  }
  window.parentBankruptcyInfo201=function(){
    ensure201();
    showModal(`<div class="modalTop"><div class="avatar">🏚️</div><div class="modalTitle">Risico systemen</div></div><div class="modalBody">${familyStatus201()}<div class="card"><b>Dierenverkoop</b><br>Lifetime verkocht: ${state.animalCrime201.lifetimeSold}/5<br>4e verkoop: kans/event dat nieuwe eigenaar boos wordt en je in elkaar slaat.<br>5e verkoop: illegale dierenhandel.<br>Onder 18: ouders opgepakt → wees mode.<br>18+: jij krijgt 4 jaar gevangenis.</div><div class="card"><b>Business & investeren</b><br>Eigen business en investeren zijn vanaf 18 jaar beschikbaar.</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  const oldMigrate201=window.migrate || (typeof migrate==='function'?migrate:null);
  if(oldMigrate201){
    window.migrate=function(s){const res=oldMigrate201.apply(this,arguments);try{state=res;ensure201()}catch(e){}return res};
    try{migrate=window.migrate}catch(e){}
  }
  setTimeout(()=>{try{ensure201();save201()}catch(e){}},500);
})();
