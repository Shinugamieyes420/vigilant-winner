
/* v20.5 Unified Business Manager + Realistic Revenue System
   One business mode. Migrates classic state.businesses and old lifestyle businesses into state.businessManager205.businesses.
   Revenue - costs = profit. Adds marketing, quality, staff, expansion, cost cuts, cash reserve, sale value and bankruptcy risk.
*/
(function(){
  const TYPES205={
    webshop:{icon:'📦',name:'Webshop',startCost:750,baseRevenue:9000,fixedCosts:1800,variableRate:.38,staffCost:14500,risk:24,margin:'schaalbaar, marketing gevoelig',tags:['online','lowcost'],events:['viral product','veel retouren','leverancier vertraagd','goede reviews']},
    content:{icon:'📱',name:'Content kanaal',startCost:150,baseRevenue:2800,fixedCosts:500,variableRate:.18,staffCost:9000,risk:42,margin:'kan viral gaan, onzeker inkomen',tags:['fame','social'],events:['video gaat viral','algoritme zakt weg','sponsor mailt','comments ontploffen']},
    snackbar:{icon:'🍟',name:'Snackbar',startCost:8500,baseRevenue:38000,fixedCosts:14500,variableRate:.46,staffCost:22000,risk:28,margin:'stabiele omzet, hoge vaste kosten',tags:['food','local'],events:['slechte hygiëne-review','drukke zomeravond','energieprijs stijgt','vaste klanten komen terug']},
    gym:{icon:'🏋️',name:'Sportschool',startCost:22000,baseRevenue:52000,fixedCosts:26000,variableRate:.26,staffCost:26000,risk:31,margin:'sterke sport/combat link',tags:['fitness','combat'],events:['nieuwjaarsdrukte','apparaat gaat stuk','fighters trainen mee','leden zeggen op']},
    gamestudio:{icon:'🎮',name:'Game studio',startCost:18000,baseRevenue:24000,fixedCosts:12000,variableRate:.34,staffCost:30000,risk:48,margin:'hoog risico, hoge pieken',tags:['creative','tech'],events:['game gaat viral','release flopt','serverkosten stijgen','streamer speelt je game']},
    wrestlingschool:{icon:'🤼',name:'Wrestling school',startCost:30000,baseRevenue:42000,fixedCosts:21000,variableRate:.32,staffCost:24000,risk:36,margin:'sport entertainment route',tags:['wwe','combat'],events:['talent breekt door','blessure tijdens training','show verkoopt uit','matten moeten vervangen']},
    garage:{icon:'🔧',name:'Garage',startCost:26000,baseRevenue:56000,fixedCosts:24000,variableRate:.41,staffCost:28000,risk:29,margin:'stabiel maar kostenintensief',tags:['local','service'],events:['grote reparatieklus','onderdeeltekort','vaste klant komt terug','gereedschap stuk']},
    nchustle:{icon:'🌃',name:'Night City hustle',startCost:1600,baseRevenue:14000,fixedCosts:2600,variableRate:.30,staffCost:18000,risk:62,margin:'snelle winst, gevaarlijk',tags:['risk','nightcity'],events:['fixer deal loopt goed','security probleem','politie kijkt mee','neon hype trekt klanten']}
  };
  function r205(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function clamp205(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money205(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function row205(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`}
  }
  function section205(t){return `<div class="section">${t}</div>`}
  function card205(h){return `<div class="card">${h}</div>`}
  function bar205(v){try{return skillBar(clamp205(v))}catch(e){return `<div class="miniBar"><div class="miniFill ${v<35?'low':''}" style="width:${clamp205(v)}%"></div></div>`}}
  function modal205(icon,title,body){showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="businessMasterHub205()">Terug</button></div>`)}
  function toast205(t){try{toast(t)}catch(e){console.log(t)}}
  function save205(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function apply205(stats){try{applyStats(stats)}catch(e){}}
  function ageLock205(){if((state.age||0)<18){showModal(`<div class="modalTop"><div class="avatar">🔒</div><div class="modalTitle">Eigen Business</div></div><div class="modalBody"><div class="card">Eigen business en investeren kunnen vanaf 18 jaar.<br>Onder 18 kun je nog leren, sparen of bijbaan doen.</div><button class="btn alt" onclick="closeModal()">Terug</button></div>`);return true}return false}
  function ensure205(){
    state.businessManager205=state.businessManager205||{businesses:[],year:0,history:[],migrated:false};
    state.businessManager205.businesses=state.businessManager205.businesses||[];
    state.businessManager205.history=state.businessManager205.history||[];
    migrate205();
  }
  function normalizeType205(type,name){
    type=(type||'').toLowerCase();
    name=(name||'').toLowerCase();
    if(type==='kanaal'||type==='content kanaal'||name.includes('content')||name.includes('youtube')||name.includes('tiktok'))return 'content';
    if(type==='snackbar'||name.includes('snackbar'))return 'snackbar';
    if(type==='gym'||name.includes('sportschool')||name.includes('gym'))return 'gym';
    if(type==='gamestudio'||type==='game studio'||name.includes('game studio'))return 'gamestudio';
    if(type==='wrestlingschool'||name.includes('wrestling'))return 'wrestlingschool';
    if(type==='garage'||name.includes('garage'))return 'garage';
    if(type==='nc_hustle'||type==='nchustle'||name.includes('night city'))return 'nchustle';
    return 'webshop';
  }
  function createBiz205(type, old={}){
    type=normalizeType205(type,old.name);
    const t=TYPES205[type]||TYPES205.webshop;
    const level=Math.max(1,old.level||1);
    const rep=clamp205(old.reputation || old.rep || (old.risk?70-old.risk:r205(28,55)));
    const quality=clamp205(old.quality || r205(38,62));
    const marketing=clamp205(old.marketing || r205(12,36));
    const staff=Math.max(0,old.staff||0);
    const value=Math.max(Math.round(t.startCost*.55), old.value||old.profit*2||Math.round(t.startCost*.7));
    return {
      id:'biz205_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
      type,name:old.name||t.name,icon:old.icon||t.icon,
      level,reputation:rep,quality,marketing,staff,
      stress:clamp205(old.stress||r205(12,28)),
      risk:clamp205(old.risk||t.risk),
      costDiscipline:clamp205(old.costDiscipline||50),
      cashReserve:Math.max(0,old.cashReserve||Math.round(t.startCost*.20)),
      value,
      startedAge:old.startedAge||state.age||18,
      years:old.years||0,
      lossStreak:old.lossStreak||0,
      lastYear:old.lastYear||null,
      bankrupt:false,
      notes:[]
    };
  }
  function migrate205(){
    if(!state.businessManager205 || state.businessManager205.migrated)return;
    const imported=[];
    (state.lifestyle&&state.lifestyle.businesses||[]).forEach(b=>imported.push(createBiz205(b.type,b)));
    (state.businesses||[]).forEach(b=>imported.push(createBiz205(b.type,b)));
    if(imported.length){
      state.businessManager205.businesses.push(...imported);
      try{addLog(`<b>Business migratie</b><br>${imported.length} oude business(es) samengevoegd in de nieuwe Eigen Business Manager.`,'good',false)}catch(e){}
    }
    // Empty old containers so old yearly business closure cannot double-pay.
    if(state.lifestyle)state.lifestyle.businesses=[];
    state.businesses=[];
    state.businessManager205.migrated=true;
  }
  function typeMeta205(b){return TYPES205[b.type]||TYPES205.webshop}
  function calcYear205(b, preview=false){
    const t=typeMeta205(b);
    const economy=(preview?1:(r205(82,118)/100));
    const levelMult=1+(b.level-1)*0.55;
    const repMult=0.72+(b.reputation/100)*0.72;
    const marketingMult=0.86+(b.marketing/100)*0.42;
    const qualityMult=0.82+(b.quality/100)*0.38;
    const staffCapacity=1+(b.staff*0.22);
    let revenue=Math.round(t.baseRevenue*levelMult*repMult*marketingMult*qualityMult*staffCapacity*economy);
    let eventText='',eventImpact=0,repDelta=0,qualityDelta=0,riskDelta=0,stressDelta=0;
    const crisisChance=(b.risk/260)+(b.stress/350)+(b.lossStreak*0.04);
    const goodChance=(b.reputation+b.quality+b.marketing)/420;
    if(!preview){
      if(Math.random()<crisisChance){
        eventImpact= -r205(8,32);
        repDelta=-r205(3,11); riskDelta=r205(3,9); stressDelta=r205(4,12);
        eventText=(t.events&&t.events[1])||'probleem in het bedrijf';
      }else if(Math.random()<goodChance){
        eventImpact= r205(8,30);
        repDelta=r205(2,8); riskDelta=-r205(1,5); stressDelta=r205(1,5);
        eventText=(t.events&&t.events[0])||'goed jaar';
      }else if(Math.random()<0.20){
        eventImpact= r205(-9,12);
        eventText=(t.events&&t.events[r205(0,t.events.length-1)])||'normaal jaar';
        repDelta=eventImpact>0?r205(1,3):-r205(1,4);
      }
      revenue=Math.max(0,Math.round(revenue*(1+eventImpact/100)));
    }
    const fixed=Math.round(t.fixedCosts*(1+(b.level-1)*0.28));
    const staffCost=Math.round((b.staff||0)*t.staffCost);
    const variable=Math.round(revenue*t.variableRate*(1-(b.costDiscipline-50)/250));
    const marketingCost=Math.round((b.marketing||0)*35*b.level);
    const adminTax=Math.max(0,Math.round(revenue*0.055));
    const costs=Math.max(0,fixed+staffCost+variable+marketingCost+adminTax);
    const profit=revenue-costs;
    const estimatedValue=Math.max(0,Math.round((Math.max(0,profit)*2.2)+(b.cashReserve||0)+(b.reputation*95)+(b.level*850)-(b.risk*120)+(b.quality*70)));
    return {revenue,fixed,staffCost,variable,marketingCost,adminTax,costs,profit,estimatedValue,eventText,eventImpact,repDelta,qualityDelta,riskDelta,stressDelta,economy};
  }
  function summary205(b){
    const y=b.lastYear||calcYear205(b,true);
    return `${typeMeta205(b).icon} ${b.name}<br><span class="mini">Level ${b.level} · waarde ${money205(b.value||y.estimatedValue)} · reserve ${money205(b.cashReserve||0)} · winst vorig jaar ${money205(y.profit||0)}</span>`;
  }
  function businessCard205(b){
    const y=b.lastYear||calcYear205(b,true);
    return card205(`<b>${typeMeta205(b).icon} ${b.name}</b><br>
      Type: ${typeMeta205(b).name}<br>
      Level: ${b.level} · jaren actief: ${b.years||0}<br>
      Omzet vorig jaar: ${money205(y.revenue||0)}<br>
      Uitgaven vorig jaar: ${money205(y.costs||0)}<br>
      Winst/verlies: <b>${money205(y.profit||0)}</b><br>
      Waarde: ${money205(b.value||y.estimatedValue)}<br>
      Cash reserve: ${money205(b.cashReserve||0)}<br>
      Reputatie ${b.reputation}% ${bar205(b.reputation)}
      Kwaliteit ${b.quality}% ${bar205(b.quality)}
      Marketing ${b.marketing}% ${bar205(b.marketing)}
      Kostencontrole ${b.costDiscipline}% ${bar205(b.costDiscipline)}
      Risico ${b.risk}% ${bar205(100-b.risk)}
      Stress ${b.stress}% ${bar205(100-b.stress)}
      Personeel: ${b.staff}`);
  }
  window.businessMasterHub205=function(){
    if(ageLock205())return;
    ensure205();
    const list=state.businessManager205.businesses.filter(b=>!b.bankrupt);
    let totalValue=list.reduce((s,b)=>s+(b.value||0),0);
    let h=card205(`<b>Eigen Business Manager</b><br>Bedrijven: ${list.length}<br>Totale businesswaarde: ${money205(totalValue)}<br><span class="mini">Omzet - vaste kosten - variabele kosten - personeel - marketing - administratie = winst/verlies.</span>`);
    h+=section205('Mijn bedrijven');
    h+=list.length?list.map((b,i)=>row205(typeMeta205(b).icon,b.name,`Level ${b.level} · waarde ${money205(b.value||0)} · reserve ${money205(b.cashReserve||0)} · risico ${b.risk}%`,`businessDashboard205('${b.id}')`)).join(''):card205('Nog geen eigen business.');
    h+=section205('Acties');
    h+=row205('🚀','Nieuw bedrijf starten','Webshop, content kanaal, snackbar, gym, game studio, wrestling school, garage, Night City hustle','businessStartHub205()');
    h+=row205('📈','Jaarresultaten draaien','Simuleer jaaromzet, uitgaven, winst/verlies en events','runBusinessYear205()');
    h+=row205('📜','Business geschiedenis','Bekijk recente jaarresultaten','businessHistory205()');
    showModal(`<div class="modalTop"><div class="avatar">🏪</div><div class="modalTitle">Eigen Business</div></div><div class="modalBody">${h}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.businessStartHub205=function(){
    if(ageLock205())return;
    ensure205();
    let h=card205('<b>Nieuw bedrijf starten</b><br>Kies een type. Goedkoop starten is veiliger, maar groeit trager. Dure bedrijven kunnen meer omzet maken, maar hebben hogere vaste kosten.');
    h+=section205('Business types');
    Object.entries(TYPES205).forEach(([k,t])=>{
      h+=row205(t.icon,t.name,`${money205(t.startCost)} start · ${t.margin}`,`startBusiness205('${k}')`,(state.money||0)<t.startCost);
    });
    modal205('🚀','Nieuw bedrijf starten',h);
  };
  window.startBusiness205=function(type){
    if(ageLock205())return;
    ensure205();
    const t=TYPES205[type]||TYPES205.webshop;
    if((state.money||0)<t.startCost)return toast205('Niet genoeg geld: '+money205(t.startCost));
    state.money-=t.startCost;
    const b=createBiz205(type,{name:t.name,value:Math.round(t.startCost*.65),cashReserve:Math.round(t.startCost*.20)});
    state.businessManager205.businesses.push(b);
    try{addLog(`<b>Business gestart</b><br>${t.icon} ${t.name} gestart voor ${money205(t.startCost)}.<br>Reserve: ${money205(b.cashReserve)}.`, 'good', false)}catch(e){}
    apply205({Happiness:4,Smarts:3});
    save205();
    businessDashboard205(b.id);
  };
  function findBiz205(id){ensure205();return state.businessManager205.businesses.find(b=>b.id===id)}
  window.businessDashboard205=function(id){
    if(ageLock205())return;
    const b=findBiz205(id); if(!b)return businessMasterHub205();
    let h=businessCard205(b);
    h+=section205('Management');
    h+=row205('📈','Uitbreiden',`Level omhoog, omzetplafond hoger, vaste kosten ook hoger · ${money205(2500*b.level)}`,`businessAction205('${id}','expand')`,(state.money||0)<2500*b.level);
    h+=row205('👥','Personeel aannemen',`Meer capaciteit, lagere stress, maar jaarlijkse kosten erbij · ${money205(1200)}`,`businessAction205('${id}','hire')`,(state.money||0)<1200);
    h+=row205('📢','Marketingcampagne',`Meer bereik en omzetkans · ${money205(600*b.level)}`,`businessAction205('${id}','marketing')`,(state.money||0)<600*b.level);
    h+=row205('⭐','Kwaliteit verbeteren',`Betere reviews, reputatie op lange termijn · ${money205(900*b.level)}`,`businessAction205('${id}','quality')`,(state.money||0)<900*b.level);
    h+=row205('🧾','Kosten besparen','Minder kosten, maar kans op kwaliteits/reputatieschade',`businessAction205('${id}','cutcost')`);
    h+=row205('🛠️','Problemen oplossen',`Risico en stress omlaag · ${money205(700*b.level)}`,`businessAction205('${id}','fixrisk')`,(state.money||0)<700*b.level);
    h+=section205('Geld');
    h+=row205('💰','Reserve uitbetalen','Haal geld uit business cash reserve naar privé',`businessWithdraw205('${id}')`,(b.cashReserve||0)<100);
    h+=row205('🏦','Privé bijleggen','Stop privé geld in cash reserve',`businessDeposit205('${id}')`,(state.money||0)<100);
    h+=row205('🏷️','Verkopen',`Verkoopwaarde ongeveer ${money205(b.value||0)}`,`businessSellConfirm205('${id}')`,'','red');
    modal205(typeMeta205(b).icon,b.name,h);
  };
  window.businessAction205=function(id,kind){
    const b=findBiz205(id); if(!b)return;
    let cost=0,txt='',stats={Smarts:1};
    if(kind==='expand'){cost=2500*b.level;if(state.money<cost)return toast205('Niet genoeg geld.');state.money-=cost;b.level++;b.value+=Math.round(cost*.72);b.risk=clamp205(b.risk+2);b.stress=clamp205(b.stress+4);txt='Ik breidde het bedrijf uit. Meer omzetpotentie, maar ook meer vaste druk.';stats={Smarts:2,Happiness:2};}
    if(kind==='hire'){cost=1200;if(state.money<cost)return toast205('Niet genoeg geld.');state.money-=cost;b.staff++;b.stress=clamp205(b.stress-6);b.risk=clamp205(b.risk-2);b.value+=650;txt='Ik nam personeel aan. Meer capaciteit, maar de jaarlijkse personeelskosten stijgen.';stats={Smarts:1,Happiness:1};}
    if(kind==='marketing'){cost=600*b.level;if(state.money<cost)return toast205('Niet genoeg geld.');state.money-=cost;b.marketing=clamp205(b.marketing+r205(6,14));b.stress=clamp205(b.stress+2);b.risk=clamp205(b.risk+(b.quality<40?3:0));txt='Ik deed een marketingcampagne. Meer bereik, maar lage kwaliteit kan sneller slechte reviews opleveren.';stats={Smarts:1,Happiness:1};}
    if(kind==='quality'){cost=900*b.level;if(state.money<cost)return toast205('Niet genoeg geld.');state.money-=cost;b.quality=clamp205(b.quality+r205(6,13));b.reputation=clamp205(b.reputation+r205(1,5));b.risk=clamp205(b.risk-r205(1,4));b.value+=Math.round(cost*.45);txt='Ik verbeterde kwaliteit. Dit helpt reviews, reputatie en lange termijn winst.';stats={Smarts:2};}
    if(kind==='cutcost'){b.costDiscipline=clamp205(b.costDiscipline+r205(8,16));b.quality=clamp205(b.quality-r205(3,9));b.reputation=clamp205(b.reputation-r205(1,6));b.risk=clamp205(b.risk+r205(2,8));txt='Ik sneed in kosten. De marges worden beter, maar kwaliteit en reputatie kunnen schade krijgen.';stats={Smarts:1,Happiness:-1};}
    if(kind==='fixrisk'){cost=700*b.level;if(state.money<cost)return toast205('Niet genoeg geld.');state.money-=cost;b.risk=clamp205(b.risk-r205(7,15));b.stress=clamp205(b.stress-r205(5,12));b.value+=Math.round(cost*.25);txt='Ik loste problemen op en zette processen strakker neer. Minder risico en stress.';stats={Smarts:2,Happiness:1};}
    try{addLog(`<b>Business management</b><br>${typeMeta205(b).icon} ${b.name}: ${txt}${cost?'<br>Kosten: '+money205(cost):''}`, 'good', false)}catch(e){}
    apply205(stats);
    save205();
    businessDashboard205(id);
  };
  window.businessWithdraw205=function(id){
    const b=findBiz205(id); if(!b)return;
    const opts=[100,250,500,1000,2500,5000,10000].filter(v=>v<=b.cashReserve);
    let h=card205(`Cash reserve: ${money205(b.cashReserve||0)}<br>Kies bedrag om privé uit te betalen.`);
    h+=opts.map(v=>`<button class="btn" onclick="doBusinessWithdraw205('${id}',${v})">${money205(v)} uitbetalen</button>`).join('')||card205('Niet genoeg reserve.');
    modal205('💰','Reserve uitbetalen',h);
  };
  window.doBusinessWithdraw205=function(id,amount){
    const b=findBiz205(id); if(!b||b.cashReserve<amount)return;
    b.cashReserve-=amount; state.money=(state.money||0)+amount; b.risk=clamp205(b.risk+1);
    try{addLog(`<b>Business uitbetaling</b><br>Ik haalde ${money205(amount)} uit ${b.name}.`, 'good', false)}catch(e){}
    save205();businessDashboard205(id);
  };
  window.businessDeposit205=function(id){
    const b=findBiz205(id); if(!b)return;
    const opts=[100,250,500,1000,2500,5000,10000].filter(v=>v<=state.money);
    let h=card205(`Privégeld: ${money205(state.money||0)}<br>Business reserve: ${money205(b.cashReserve||0)}<br>Kies bedrag om bij te leggen.`);
    h+=opts.map(v=>`<button class="btn" onclick="doBusinessDeposit205('${id}',${v})">${money205(v)} bijleggen</button>`).join('')||card205('Niet genoeg privégeld.');
    modal205('🏦','Privé bijleggen',h);
  };
  window.doBusinessDeposit205=function(id,amount){
    const b=findBiz205(id); if(!b||state.money<amount)return;
    state.money-=amount; b.cashReserve=(b.cashReserve||0)+amount; b.risk=clamp205(b.risk-2);
    try{addLog(`<b>Business reserve</b><br>Ik legde ${money205(amount)} privé bij in ${b.name}.`, 'good', false)}catch(e){}
    save205();businessDashboard205(id);
  };
  window.businessSellConfirm205=function(id){
    const b=findBiz205(id); if(!b)return;
    let h=businessCard205(b);
    h+=`<button class="btn red" onclick="businessSell205('${id}')">Ja, verkoop voor ongeveer ${money205(b.value||0)}</button>`;
    modal205('🏷️','Business verkopen',h);
  };
  window.businessSell205=function(id){
    const b=findBiz205(id); if(!b)return;
    const val=Math.max(0,b.value||0);
    state.money=(state.money||0)+val;
    state.businessManager205.businesses=state.businessManager205.businesses.filter(x=>x.id!==id);
    try{addLog(`<b>Business verkocht</b><br>Ik verkocht ${b.name} voor ${money205(val)}.`, 'good', false)}catch(e){}
    apply205({Happiness:3});
    save205();businessMasterHub205();
  };
  window.runBusinessYear205=function(){
    if(ageLock205())return;
    ensure205();
    const list=state.businessManager205.businesses.filter(b=>!b.bankrupt);
    if(!list.length)return toast205('Je hebt nog geen business.');
    let lines=[];
    list.forEach(b=>{
      const y=calcYear205(b,false);
      b.years=(b.years||0)+1;
      b.lastYear=y;
      b.reputation=clamp205(b.reputation+y.repDelta);
      b.quality=clamp205(b.quality+y.qualityDelta);
      b.risk=clamp205(b.risk+y.riskDelta);
      b.stress=clamp205(b.stress+y.stressDelta+(y.profit<0?4:-2));
      b.cashReserve=(b.cashReserve||0)+y.profit;
      b.value=y.estimatedValue;
      if(y.profit<0)b.lossStreak=(b.lossStreak||0)+1; else b.lossStreak=0;
      let crisis='';
      if(b.cashReserve<0){
        const need=Math.abs(b.cashReserve);
        if((state.money||0)>=need){
          state.money-=need; b.cashReserve=0; b.risk=clamp205(b.risk+4);
          crisis=`<br><span class="mini">Privé bijgelegd: ${money205(need)} om reserve aan te vullen.</span>`;
        }else{
          const debt=need-(state.money||0);
          state.money=0; b.cashReserve=0; b.risk=clamp205(b.risk+8); b.stress=clamp205(b.stress+10);
          state.debts=(state.debts||0)+debt;
          crisis=`<br><span class="mini">Niet genoeg geld: schuld erbij ${money205(debt)}.</span>`;
        }
      }
      if(b.lossStreak>=3 || (b.risk>=92 && Math.random()<0.35)){
        b.bankrupt=true; b.value=0; b.cashReserve=0;
        crisis+=`<br><b>Failliet:</b> 3 slechte jaren/te hoog risico. Bedrijf gesloten.`;
        apply205({Happiness:-15,Smarts:2});
      }
      const ev=y.eventText?`<br><span class="mini">Event: ${y.eventText} (${y.eventImpact>0?'+':''}${y.eventImpact}%)</span>`:'';
      lines.push(`${typeMeta205(b).icon} <b>${b.name}</b><br>Omzet: ${money205(y.revenue)} · kosten: ${money205(y.costs)} · winst: <b>${money205(y.profit)}</b><br>Reserve: ${money205(b.cashReserve)} · waarde: ${money205(b.value)}${ev}${crisis}`);
    });
    state.businessManager205.history.unshift({age:state.age,html:lines.join('<hr>')});
    state.businessManager205.history=state.businessManager205.history.slice(0,12);
    try{addLog(`<b>Business jaarresultaat</b><br>${lines.join('<br><br>')}`,'warn',false)}catch(e){}
    save205();
    showModal(`<div class="modalTop"><div class="avatar">📈</div><div class="modalTitle">Business jaarresultaat</div></div><div class="modalBody">${card205(lines.join('<hr>'))}<button class="btn alt" onclick="businessMasterHub205()">Terug</button></div>`);
  };
  window.businessHistory205=function(){
    ensure205();
    const hist=state.businessManager205.history||[];
    let h=hist.length?hist.map(x=>card205(`<b>Leeftijd ${x.age}</b><br>${x.html}`)).join(''):card205('Nog geen jaarresultaten.');
    modal205('📜','Business geschiedenis',h);
  };

  // Override old business entry points to single manager.
  window.businessHub165=window.businessMasterHub205;
  window.businessScreen=window.businessMasterHub205;
  window.startBusiness165=function(type){return startBusiness205(normalizeType205(type,''))};
  window.startBusiness=function(type){return startBusiness205(normalizeType205(type,''))};
  window.businessDetail165=function(i){ensure205();let b=state.businessManager205.businesses[i];return b?businessDashboard205(b.id):businessMasterHub205()};
  window.businessManage=function(i){ensure205();let b=state.businessManager205.businesses[i];return b?businessDashboard205(b.id):businessMasterHub205()};
  window.businessInvest165=function(i){ensure205();let b=state.businessManager205.businesses[i];return b?businessAction205(b.id,'expand'):businessMasterHub205()};
  window.investBusiness=function(i){ensure205();let b=state.businessManager205.businesses[i];return b?businessAction205(b.id,'expand'):businessMasterHub205()};
  window.businessHire165=function(i){ensure205();let b=state.businessManager205.businesses[i];return b?businessAction205(b.id,'hire'):businessMasterHub205()};
  window.businessSell165=function(i){ensure205();let b=state.businessManager205.businesses[i];return b?businessSellConfirm205(b.id):businessMasterHub205()};
  window.sellBusiness=function(i){ensure205();let b=state.businessManager205.businesses[i];return b?businessSellConfirm205(b.id):businessMasterHub205()};
  try{businessHub165=window.businessHub165;businessScreen=window.businessScreen;startBusiness=window.startBusiness;startBusiness165=window.startBusiness165}catch(e){}

  // Patch v20.4 money hub: remove Business classic row and route "Eigen business" to new manager.
  window.moneyLifestyleMasterHub204=function(){
    if((state.age||0)<18){
      let h=card205(`<b>Geld & Lifestyle</b><br>Cash: ${money205((state&&state.money)||0)}<br>Business en investeren zijn vanaf 18 jaar.`);
      h+=section205('Lifestyle');
      h+=row205('💰','Money & Lifestyle hub','Shopping, huis-upgrades en leningen','moneyLifestyleHub165()',typeof moneyLifestyleHub165!=='function');
      if(typeof shoppingHub165==='function')h+=row205('🛍️','Shopping','Kleding, items en lifestyle aankopen','shoppingHub165()');
      h+=section205('18+ geldsystemen');
      h+=row205('📈','Investeren','Locked tot 18 jaar','investmentHub165()',true);
      h+=row205('🏪','Eigen Business','Locked tot 18 jaar','businessMasterHub205()',true);
      showModal(`<div class="modalTop"><div class="avatar">💰</div><div class="modalTitle">Geld & Lifestyle</div></div><div class="modalBody">${h}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
      return;
    }
    ensure205();
    let h=card205(`<b>Geld & Lifestyle</b><br>Cash: ${money205((state&&state.money)||0)}<br>Alles rond geld staat hier. Eigen Business is nu één unified manager.`);
    h+=section205('Lifestyle');
    h+=row205('💰','Money & Lifestyle hub','Shopping, huis-upgrades, leningen en lifestyle','moneyLifestyleHub165()',typeof moneyLifestyleHub165!=='function');
    if(typeof houseUpgradeHub165==='function')h+=row205('🏠','Huis & kamer-upgrades','Kamerupgrades, meubels en woningwaarde','houseUpgradeHub165()');
    if(typeof shoppingHub165==='function')h+=row205('🛍️','Shopping','Kleding, items en lifestyle aankopen','shoppingHub165()');
    h+=section205('18+ geldsystemen');
    h+=row205('📈','Investeren','Indexfonds, crypto, vastgoedfonds en risico-investeringen','investmentHub165()',typeof investmentHub165!=='function');
    h+=row205('🏪','Eigen Business','Start, manage, omzet, kosten, reserve, personeel, marketing en verkoop','businessMasterHub205()');
    if(typeof loansHub165==='function')h+=row205('💳','Leningen & schulden','Lenen, aflossen en schuldbeheer','loansHub165()');
    showModal(`<div class="modalTop"><div class="avatar">💰</div><div class="modalTitle">Geld & Lifestyle</div></div><div class="modalBody">${h}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  // yearly integration: run once per age-up, separate from old lifestyle businesses.
  const oldAgeUp205=window.ageUp || (typeof ageUp==='function'?ageUp:null);
  if(oldAgeUp205 && !oldAgeUp205.__business205){
    window.ageUp=function(){
      const prevAge=state.age;
      const res=oldAgeUp205.apply(this,arguments);
      try{
        ensure205();
        if((state.age||0)!==prevAge && state.businessManager205.businesses.some(b=>!b.bankrupt)){
          runBusinessYear205();
        }
      }catch(e){console.warn('[v20.5 yearly]',e)}
      return res;
    };
    window.ageUp.__business205=true;
    try{ageUp=window.ageUp}catch(e){}
  }

  const oldMigrate205=window.migrate || (typeof migrate==='function'?migrate:null);
  if(oldMigrate205){
    window.migrate=function(s){const res=oldMigrate205.apply(this,arguments);try{state=res;ensure205()}catch(e){}return res};
    try{migrate=window.migrate}catch(e){}
  }
  setTimeout(()=>{try{ensure205();save205()}catch(e){}},500);
})();
