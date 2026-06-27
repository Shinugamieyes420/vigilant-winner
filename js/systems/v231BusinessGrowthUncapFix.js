/* v23.1 Business Growth Uncap Fix
   Fixes max-profit feeling around tech/startups and other businesses.
   Business yearly revenue now scales with value/capital, level, reputation, staff, quality and marketing.
   No hard profit cap: bigger company = bigger possible profit, with bigger costs/risks too.
*/
(function(){
  function r231(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function clamp231(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money231(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function row231(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`}
  }
  function sec231(t){return `<div class="section">${t}</div>`}
  function card231(h){return `<div class="card">${h}</div>`}
  function modal231(icon,title,body,back='businessMasterHub205()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody v231Body">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`)
  }
  function toast231(t){try{toast(t)}catch(e){console.log(t)}}
  function save231(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function apply231(s){try{applyStats(s||{})}catch(e){}}

  const TYPES231={
    webshop:{icon:'📦',name:'Webshop',startCost:750,baseRevenue:9000,fixedCosts:1800,variableRate:.36,staffCost:14500,risk:24,multiple:3.2,margin:'schaalbaar, marketing gevoelig'},
    content:{icon:'📱',name:'Content kanaal',startCost:150,baseRevenue:2800,fixedCosts:500,variableRate:.16,staffCost:9000,risk:42,multiple:4.0,margin:'viral schaalbaar, onzeker'},
    snackbar:{icon:'🍟',name:'Snackbar',startCost:8500,baseRevenue:38000,fixedCosts:14500,variableRate:.46,staffCost:22000,risk:28,multiple:2.2,margin:'stabiel, lokaal, kostenintensief'},
    gym:{icon:'🏋️',name:'Sportschool',startCost:22000,baseRevenue:52000,fixedCosts:26000,variableRate:.27,staffCost:26000,risk:31,multiple:2.5,margin:'ledenmodel, staff en apparaten'},
    gamestudio:{icon:'🎮',name:'Game studio',startCost:18000,baseRevenue:24000,fixedCosts:12000,variableRate:.32,staffCost:30000,risk:48,multiple:5.2,margin:'hoog risico, hoge pieken'},
    techstartup:{icon:'💻',name:'Tech startup',startCost:25000,baseRevenue:30000,fixedCosts:16000,variableRate:.24,staffCost:42000,risk:52,multiple:7.0,margin:'schaalbaar techbedrijf, veel upside'},
    wrestlingschool:{icon:'🤼',name:'Wrestling school',startCost:30000,baseRevenue:42000,fixedCosts:21000,variableRate:.32,staffCost:24000,risk:36,multiple:2.6,margin:'sport entertainment route'},
    garage:{icon:'🔧',name:'Garage',startCost:26000,baseRevenue:56000,fixedCosts:24000,variableRate:.41,staffCost:28000,risk:29,multiple:2.3,margin:'stabiel maar kostenintensief'},
    nchustle:{icon:'🌃',name:'Night City hustle',startCost:1600,baseRevenue:14000,fixedCosts:2600,variableRate:.30,staffCost:18000,risk:62,multiple:3.4,margin:'snelle winst, gevaarlijk'}
  };
  function normalizeType231(type,name){
    type=String(type||'').toLowerCase(); name=String(name||'').toLowerCase();
    if(type==='tech_startup'||type==='techstartup'||type==='startup'||name.includes('tech startup')||name.includes('startup'))return 'techstartup';
    if(type==='content_channel'||type==='kanaal'||type==='content'||name.includes('content')||name.includes('youtube')||name.includes('tiktok'))return 'content';
    if(type==='gamestudio'||type==='game studio'||name.includes('game studio')||name.includes('game studio'))return 'gamestudio';
    if(type==='snackbar'||name.includes('snackbar'))return 'snackbar';
    if(type==='gym'||name.includes('sportschool')||name.includes('gym'))return 'gym';
    if(type==='wrestlingschool'||name.includes('wrestling'))return 'wrestlingschool';
    if(type==='garage'||name.includes('garage'))return 'garage';
    if(type==='nc_hustle'||type==='nchustle'||name.includes('night city'))return 'nchustle';
    if(TYPES231[type])return type;
    return 'webshop';
  }
  function meta231(b){return TYPES231[normalizeType231(b&&b.type,b&&b.name)]||TYPES231.webshop}
  function ensureBiz231(){
    state.businessManager205=state.businessManager205||{businesses:[],history:[],migrated:true};
    state.businessManager205.businesses=state.businessManager205.businesses||[];
    state.businessManager205.history=state.businessManager205.history||[];
    state.businessManager205.businesses.forEach(b=>{
      const oldType=b.type;
      b.type=normalizeType231(b.type,b.name);
      const t=meta231(b);
      b.icon=b.icon||t.icon;
      b.name=b.name||t.name;
      b.level=Math.max(1,Number(b.level||1));
      b.value=Math.max(Math.round(t.startCost*.55),Math.round(Number(b.value||t.startCost*.7)));
      b.reputation=clamp231(b.reputation??b.rep??45);
      b.quality=clamp231(b.quality??50);
      b.marketing=clamp231(b.marketing??30);
      b.staff=Math.max(0,Math.round(Number(b.staff||0)));
      b.risk=clamp231(b.risk??t.risk);
      b.stress=clamp231(b.stress??25);
      b.costDiscipline=clamp231(b.costDiscipline??50);
      b.cashReserve=Math.round(Number(b.cashReserve||0));
      b.growthHistory231=b.growthHistory231||[];
      if(oldType!==b.type && oldType) b.growthHistory231.push(`Type herkend als ${t.name}`);
    });
  }
  window.ensureBusinessGrowth231=ensureBiz231;

  function marketEvent231(b,y){
    const t=meta231(b);
    const events={
      techstartup:['grote klant tekent contract','serverkosten ontploffen','investeerders tonen interesse','product-market fit verbetert','concurrent kopieert feature'],
      gamestudio:['game gaat viral','release flopt','DLC verkoopt goed','serverkosten stijgen','streamer speelt je game'],
      webshop:['product gaat viral','veel retouren','leverancier vertraagt','goede reviews verhogen conversie'],
      content:['video gaat viral','algoritme zakt weg','sponsor mailt','community groeit hard'],
      gym:['nieuwjaarsdrukte','apparaat gaat stuk','fighters trainen mee','leden zeggen op'],
      snackbar:['drukke zomeravond','energieprijs stijgt','slechte review','vaste klanten komen terug'],
      garage:['grote reparatieklus','onderdeeltekort','vaste klant komt terug','gereedschap stuk']
    };
    const list=events[b.type]||['goed jaar','lastig jaar','nieuwe kans','onverwachte kosten'];
    let impact=0,text='';
    const goodChance=(b.reputation+b.quality+b.marketing)/430;
    const badChance=(b.risk+b.stress)/360 + Math.max(0,(b.lossStreak||0))*0.035;
    if(Math.random()<badChance){impact=-r231(8,32); text=list.find(x=>/flopt|kosten|retour|zakt|stuk|tekort|slechte|concurrent|zeggen/.test(x))||'tegenvaller';}
    else if(Math.random()<goodChance){impact=r231(8,38); text=list.find(x=>/viral|contract|interesse|groeit|goed|drukke|grote/.test(x))||'groeikans';}
    else if(Math.random()<0.22){impact=r231(-10,14); text=list[r231(0,list.length-1)];}
    y.eventImpact=impact; y.eventText=text;
    return impact;
  }

  function calcUncappedYear231(b,preview=false){
    const t=meta231(b);
    const oldValue=Math.max(t.startCost*.55,Number(b.value||t.startCost));
    const capitalRatio=Math.max(1, oldValue / Math.max(1,t.startCost*.65));
    // Important: sublinear but uncapped. A huge business keeps scaling; it just gets harder and more expensive.
    const scalePower=Math.pow(capitalRatio, b.type==='techstartup'?0.82:b.type==='gamestudio'?0.78:0.72);
    const levelMult=1 + (Number(b.level||1)-1)*0.34;
    const repMult=0.58 + (b.reputation/100)*0.95;
    const qualityMult=0.70 + (b.quality/100)*0.62;
    const marketingMult=0.74 + (b.marketing/100)*0.70;
    const staffMult=1 + (b.staff||0)*0.16 + Math.sqrt(Math.max(0,b.staff||0))*0.22;
    const economy=preview?1:(r231(72,132)/100);
    let revenue=Math.round(t.baseRevenue * scalePower * levelMult * repMult * qualityMult * marketingMult * staffMult * economy);
    let y={eventText:'',eventImpact:0};
    if(!preview){
      const impact=marketEvent231(b,y);
      revenue=Math.max(0,Math.round(revenue*(1+impact/100)));
    }
    const fixedScale=Math.pow(capitalRatio,0.55);
    const fixed=Math.round(t.fixedCosts * fixedScale * (1+(b.level-1)*0.16));
    const staffCost=Math.round((b.staff||0) * t.staffCost * (1+Math.log10(Math.max(1,capitalRatio))*0.10));
    const variableRate=Math.max(0.10, t.variableRate * (1-(b.costDiscipline-50)/260));
    const variable=Math.round(revenue*variableRate);
    const marketingCost=Math.round((b.marketing||0) * (160 + 24*b.level) * Math.pow(capitalRatio,0.42));
    const adminTax=Math.round(Math.max(0,revenue)*0.105);
    const riskBuffer=Math.round(Math.max(0,b.risk-50) * Math.pow(capitalRatio,0.35) * 120);
    const costs=Math.max(0,fixed+staffCost+variable+marketingCost+adminTax+riskBuffer);
    const profit=revenue-costs;
    const margin=revenue>0?profit/revenue:0;
    const growthMultiplier=margin>0.22?0.72:margin>0.08?0.52:margin>0?0.32:0.22;
    const profitMultiple=Math.max(1.1, t.multiple + (b.reputation-50)/35 + (b.quality-50)/45 - (b.risk-45)/55);
    let marketValue=Math.max(0, Math.round((Math.max(0,profit)*profitMultiple) + (revenue*0.18) + ((b.cashReserve||0)*0.65) + (oldValue*(profit>=0?0.72:0.58))));
    let organicValue=Math.max(0, Math.round(oldValue + profit*growthMultiplier + revenue*0.035 - Math.max(0,-profit)*0.18));
    const estimatedValue=Math.max(0, Math.round((marketValue*0.55)+(organicValue*0.45)));
    const repDelta=preview?0:(profit>0?r231(1,6):-r231(2,9));
    const qualityDelta=preview?0:(profit>0&&Math.random()<0.35?r231(0,3):-r231(0,2));
    const riskDelta=preview?0:(profit>0?-r231(0,4):r231(3,10));
    const stressDelta=preview?0:(profit>0?-r231(0,4):r231(4,12));
    return {revenue,fixed,staffCost,variable,marketingCost,adminTax,riskBuffer,costs,profit,estimatedValue,margin,eventText:y.eventText,eventImpact:y.eventImpact,repDelta,qualityDelta,riskDelta,stressDelta,economy,scalePower,capitalRatio,oldValue};
  }

  function line231(b,y,crisis=''){
    const t=meta231(b);
    const marginPct=y.revenue?Math.round(y.profit/y.revenue*100):0;
    const ev=y.eventText?`<br><span class="mini">Event: ${y.eventText} (${y.eventImpact>0?'+':''}${y.eventImpact}%)</span>`:'';
    return `${t.icon} <b>${b.name}</b><br>Omzet: ${money231(y.revenue)} · kosten: ${money231(y.costs)} · winst: <b>${money231(y.profit)}</b> · marge ${marginPct}%<br>Waarde: ${money231(y.oldValue)} → <b>${money231(b.value)}</b> · schaal x${y.scalePower.toFixed(2)}<br>Reserve: ${money231(b.cashReserve||0)}${ev}${crisis}`;
  }

  window.runBusinessYear205=function(){
    if((state.age||0)<18)return toast231('Business kan vanaf 18 jaar.');
    ensureBiz231();
    const list=state.businessManager205.businesses.filter(b=>!b.bankrupt);
    if(!list.length)return toast231('Je hebt nog geen business.');
    let lines=[];
    list.forEach(b=>{
      const y=calcUncappedYear231(b,false);
      b.years=(b.years||0)+1;
      b.lastYear=y;
      b.reputation=clamp231(b.reputation+y.repDelta);
      b.quality=clamp231(b.quality+y.qualityDelta);
      b.risk=clamp231(b.risk+y.riskDelta);
      b.stress=clamp231(b.stress+y.stressDelta+(y.profit<0?4:-2));
      b.cashReserve=Math.round((b.cashReserve||0)+y.profit);
      b.value=Math.max(0,Math.round(y.estimatedValue));
      b.uncappedGrowth231=true;
      b.lastScale231=y.scalePower;
      b.lastMargin231=y.margin;
      if(y.profit<0)b.lossStreak=(b.lossStreak||0)+1; else b.lossStreak=0;
      let crisis='';
      if(b.cashReserve<0){
        const need=Math.abs(b.cashReserve);
        if((state.money||0)>=need){state.money-=need;b.cashReserve=0;b.risk=clamp231(b.risk+4);crisis=`<br><span class="mini">Privé bijgelegd: ${money231(need)}.</span>`;}
        else{const debt=need-(state.money||0);state.money=0;b.cashReserve=0;b.risk=clamp231(b.risk+8);b.stress=clamp231(b.stress+10);state.debts=(state.debts||0)+debt;crisis=`<br><span class="mini">Niet genoeg geld: schuld erbij ${money231(debt)}.</span>`;}
      }
      if(b.lossStreak>=4 || (b.risk>=96 && Math.random()<0.30)){
        b.bankrupt=true;b.value=0;b.cashReserve=0;crisis+=`<br><b>Failliet:</b> te lang verlies/te hoog risico.`;apply231({Happiness:-15,Smarts:2});
      }
      const html=line231(b,y,crisis);
      lines.push(html);
      b.growthHistory231=b.growthHistory231||[];
      b.growthHistory231.unshift(`Leeftijd ${state.age}: omzet ${money231(y.revenue)}, winst ${money231(y.profit)}, waarde ${money231(b.value)}, schaal x${y.scalePower.toFixed(2)}`);
      b.growthHistory231=b.growthHistory231.slice(0,10);
    });
    state.businessManager205.history.unshift({age:state.age,html:lines.join('<hr>'),uncapped231:true});
    state.businessManager205.history=state.businessManager205.history.slice(0,18);
    try{addLog(`<b>Business jaarresultaat v23.1</b><br>${lines.join('<br><br>')}`,'warn',false)}catch(e){}
    save231();
    showModal(`<div class="modalTop"><div class="avatar">📈</div><div class="modalTitle">Business jaarresultaat</div></div><div class="modalBody v231Body">${card231(lines.join('<hr>'))}<button class="btn alt" onclick="businessMasterHub205()">Terug</button></div>`);
  };

  const oldAction231=window.businessAction205;
  window.businessAction205=function(id,kind){
    ensureBiz231();
    const b=state.businessManager205.businesses.find(x=>x.id===id);
    if(!b)return;
    const oldValue=b.value||0;
    if(kind==='scale' || kind==='bigscale'){
      const pct=kind==='bigscale'?0.18:0.075;
      const cost=Math.max(5000,Math.round((b.value||meta231(b).startCost)*pct));
      if((state.money||0)<cost)return toast231('Niet genoeg geld: '+money231(cost));
      state.money-=cost;
      b.level+=kind==='bigscale'?2:1;
      b.value+=Math.round(cost*.88);
      b.staff+=kind==='bigscale'?r231(2,6):r231(0,2);
      b.marketing=clamp231(b.marketing+(kind==='bigscale'?r231(5,12):r231(2,7)));
      b.risk=clamp231(b.risk+(kind==='bigscale'?r231(4,9):r231(2,5)));
      b.stress=clamp231(b.stress+(kind==='bigscale'?r231(5,12):r231(2,6)));
      try{addLog(`<b>Business schaalinvestering</b><br>${meta231(b).icon} ${b.name}: ${money231(cost)} geïnvesteerd. Waarde ${money231(oldValue)} → ${money231(b.value)}. Grotere schaal = hogere omzetpotentie, maar ook hogere risico's/kosten.`, 'good', false)}catch(e){}
      apply231({Smarts:2,Happiness:2});
      save231();
      if(typeof businessDashboard205==='function')return businessDashboard205(id);
      return;
    }
    if(oldAction231)return oldAction231.apply(this,arguments);
  };

  const oldDashboard231=window.businessDashboard205;
  if(oldDashboard231&&!oldDashboard231.__uncap231){
    window.businessDashboard205=function(id){
      ensureBiz231();
      const b=state.businessManager205.businesses.find(x=>x.id===id);
      if(!b)return oldDashboard231.apply(this,arguments);
      oldDashboard231.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(!body||body.innerHTML.includes('businessGrowthInfo231'))return;
          const y=calcUncappedYear231(b,true);
          const sec=document.createElement('div');sec.className='section';sec.textContent='Groei zonder winstcap';
          const card=document.createElement('div');card.id='businessGrowthInfo231';card.className='card';
          card.innerHTML=`<b>v23.1 schaalmodel</b><br>Preview omzet: ${money231(y.revenue)}<br>Preview winst: ${money231(y.profit)}<br>Schaalfactor: x${y.scalePower.toFixed(2)}<br><span class="mini">Waarde/capitaal telt mee. Groter bedrijf kan dus meer verdienen; er is geen vaste winstcap.</span>`;
          const wrap1=document.createElement('div');wrap1.innerHTML=row231('🚀','Schaal investeren',`Investeer ±7.5% van waarde om omzetpotentie te vergroten`,`businessAction205('${id}','scale')`,(state.money||0)<Math.max(5000,Math.round((b.value||meta231(b).startCost)*0.075)));
          const wrap2=document.createElement('div');wrap2.innerHTML=row231('🏗️','Grote uitbreiding',`Investeer ±18% van waarde; veel groei maar meer risico`,`businessAction205('${id}','bigscale')`,(state.money||0)<Math.max(5000,Math.round((b.value||meta231(b).startCost)*0.18)));
          const alt=body.querySelector('.btn.alt');
          body.insertBefore(sec,alt);body.insertBefore(card,alt);body.insertBefore(wrap1.firstElementChild,alt);body.insertBefore(wrap2.firstElementChild,alt);
        }catch(e){}
      },0);
    };
    window.businessDashboard205.__uncap231=true;
  }

  window.businessGrowthDebug231=function(){
    ensureBiz231();
    const list=state.businessManager205.businesses.filter(b=>!b.bankrupt);
    let h=card231('<b>Business Growth v23.1</b><br>Geen winstcap. Jaaromzet schaalt nu met waarde/capitaal, level, personeel, reputatie, marketing en kwaliteit. Groter = meer omzetpotentie én grotere kosten/risico.');
    h+=list.map(b=>{const y=calcUncappedYear231(b,true);return card231(`${meta231(b).icon} <b>${b.name}</b><br>Waarde: ${money231(b.value)}<br>Preview omzet: ${money231(y.revenue)}<br>Preview winst: ${money231(y.profit)}<br>Schaalfactor: x${y.scalePower.toFixed(2)}<br>Level ${b.level} · staff ${b.staff} · rep ${b.reputation}% · marketing ${b.marketing}%`)}).join('')||card231('Geen business.');
    h+=row231('📈','Jaarresultaten draaien','Run uncapped business year','runBusinessYear205()',!list.length);
    modal231('🚀','Business Growth Debug',h,'closeModal()');
  };

  const oldMaster231=window.businessMasterHub205;
  if(oldMaster231&&!oldMaster231.__uncap231){
    window.businessMasterHub205=function(){
      ensureBiz231();
      oldMaster231.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(!body||body.innerHTML.includes('businessGrowthDebug231'))return;
          const wrap=document.createElement('div');wrap.innerHTML=row231('🚀','Business growth debug','Controleer uncapped omzet/winst per bedrijf','businessGrowthDebug231()');
          const alt=body.querySelector('.btn.alt'); body.insertBefore(wrap.firstElementChild,alt);
        }catch(e){}
      },0);
    };
    window.businessMasterHub205.__uncap231=true;
  }

  const oldSave231=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave231&&!oldSave231.__business231){
    window.safeSave=function(){try{ensureBiz231()}catch(e){}return oldSave231.apply(this,arguments)};
    window.safeSave.__business231=true;try{safeSave=window.safeSave}catch(e){}
  }
  setTimeout(()=>{try{ensureBiz231();safeSave();render()}catch(e){}},350);
})();
