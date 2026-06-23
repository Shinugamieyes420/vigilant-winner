/* v17.5 Realistic Economy + Event Queue
   Fixes: adult costs only when housing status supports it, no impossible net>gross salary,
   no random repairs for homes/items the player does not control, and birthday/yearly modals queue one by one. */
(function(){
  'use strict';
  const VERSION='17.5';
  function hasState(){ return typeof state !== 'undefined' && !!state; }
  function n(v){ v=Number(v||0); return Number.isFinite(v)?v:0; }
  function round(v){ return Math.round(n(v)); }
  function clamp175(v,min=0,max=100){ return Math.max(min,Math.min(max,Math.round(n(v)))); }
  function fmt(v){ try{return money(round(v));}catch(e){return '€ '+round(v).toLocaleString('nl-NL');} }
  function rand(a,b){ try{return r(a,b);}catch(e){return Math.floor(Math.random()*(b-a+1))+a;} }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function safeStats(obj){ try{ if(typeof applyStats==='function') applyStats(obj); }catch(e){} }
  function jobTitle(){ return state && state.job ? (state.job.title || state.job.name || 'baan') : 'baan'; }
  function worldKey(){ if(!hasState()) return 'normal'; return String(state.world || state.place || state.city || 'normal').toLowerCase(); }
  function isVacation(){ return hasState() && !!state.vacation; }
  function hasOwnedOrRentedHouse(){ return hasState() && Array.isArray(state.houses) && state.houses.length>0; }
  function hasIndependentHousehold(){
    if(!hasState()) return false;
    const hs = String(state.housingStatus||'').toLowerCase();
    return hasOwnedOrRentedHouse() || ['student_room','rental','owned','couchsurfing','homeless','resident_temp'].includes(hs);
  }
  function isHomeLikeStatus(){
    if(!hasState()) return true;
    const hs = String(state.housingStatus||'parents').toLowerCase();
    return hs==='parents' || hs==='family_home' || hs==='thuis';
  }

  function ensureHousingStatus175(){
    if(!hasState()) return 'parents';
    state.flags = state.flags || {};
    if(state.age < 18){ state.housingStatus='parents'; return 'parents'; }
    if(hasOwnedOrRentedHouse()){
      const anyOwned = (state.houses||[]).some(h=>h.owned);
      state.housingStatus = anyOwned ? 'owned' : 'rental';
      return state.housingStatus;
    }
    if(!state.housingStatus || state.housingStatus==='temporary' || state.housingStatus==='none'){
      // Old saves had no explicit housing choice. Default to thuiswonend instead of magically charging 12k.
      state.housingStatus = worldKey()==='nightcity' ? 'couchsurfing' : 'parents';
      if(!state.flags.v175HousingMigrated){
        state.flags.v175HousingMigrated=true;
        try{ addLog('<b>Wonen realistischer gemaakt</b><br>Geen woning gekozen betekent niet automatisch dure tijdelijke woonkosten. Je woonstatus is nu gezet op thuis/tijdelijk onderdak totdat je bewust huurt, koopt of verhuist.', 'good', false); }catch(e){}
      }
    }
    return state.housingStatus;
  }
  window.ensureHousingStatus175 = ensureHousingStatus175;

  const JOB_PAY175 = {
    paperboy:[1800,3600,8], babysitter:[2200,5200,8], dishwasher:[5800,11000,12], stock_clerk:[6500,12500,12],
    cashier_helper:[7200,14500,14], delivery_bike:[7500,15500,14], fastfood:[9000,17000,16], barista:[11000,19000,18],
    warehouse:[27000,33500,36], supermarket_seller:[25500,32500,32], callcenter:[27000,34500,32], retail:[30000,40500,32],
    receptionist:[29500,38000,32], admin_assistant:[31500,40500,32], care_assistant:[30000,38500,32], youth_worker:[33500,45500,32],
    care:[34000,46500,32], mechanic:[34000,48000,36], ict_helpdesk:[34000,46000,36], ict:[38000,52000,36],
    tax:[35500,50000,32], police:[39000,55500,36], teacher_assistant:[31500,42000,32], marketing:[38500,54000,36],
    hr:[39000,55000,36], social:[40500,57000,32], bookkeeper:[41500,57000,36], realestate:[42000,75000,36],
    nurse:[44500,62000,32], developer_junior:[46000,65000,36], dev:[48000,68000,36], data_analyst:[52000,72000,36],
    manager:[45500,65000,32], project_manager:[56000,82000,36], civil_servant:[52000,72000,36], psychologist:[61000,85000,36],
    lawyer:[72000,125000,40], engineer:[68000,95000,40], doctor:[82000,125000,40], surgeon:[110000,210000,45]
  };
  function grossAnnual175(job){
    job = job || (hasState()?state.job:null) || {};
    let gross = n(job.grossAnnual || job.salary || job.pay || 0);
    if(job.id && JOB_PAY175[job.id]){
      const p=JOB_PAY175[job.id];
      if(!gross || gross < p[0]*0.55 || gross > p[1]*1.7) gross = Math.round((p[0]*0.68+p[1]*0.32)/100)*100;
      job.hours = job.hours || p[2];
    }
    if(gross>0 && gross<1000) gross*=12;
    const level = n(state && (state.careerLevel || job.careerLevel || 0));
    gross = round(gross * (1 + level*0.08));
    return Math.max(0,gross);
  }
  function netAnnual175(gross){
    gross = Math.max(0, round(gross));
    if(!gross) return 0;
    let rate;
    if(gross <= 6000) rate = 0.97;
    else if(gross <= 12000) rate = 0.94;
    else if(gross <= 22000) rate = 0.90;
    else if(gross <= 36000) rate = 0.82;
    else if(gross <= 60000) rate = 0.76;
    else if(gross <= 100000) rate = 0.70;
    else rate = 0.62;
    return Math.min(gross, Math.max(0, round(gross*rate)));
  }
  window.grossAnnual175=grossAnnual175; window.netAnnual175=netAnnual175;

  function debtYear175(){
    if(!hasState() || state.debts<=0) return;
    const interest = Math.ceil(n(state.debts)*0.035);
    state.debts += interest;
    const pay = Math.min(n(state.money), Math.max(0, Math.ceil(n(state.debts)*0.045)));
    state.money -= pay;
    safeStats({Happiness:-Math.min(5,Math.ceil(n(state.debts)/140000))});
    try{ addLog(`<b>Schulden</b><br>Rente en aflossing kostten ${fmt(pay)}. De schuld staat nu op ${fmt(state.debts)}.`, 'warn', false); }catch(e){}
  }

  const prevYearlyIncome175 = window.yearlyIncome || (typeof yearlyIncome==='function' ? yearlyIncome : null);
  function yearlyIncome175(){
    if(!hasState()) return;
    const beforeMoney = n(state.money), beforeDebt=n(state.debts), beforeLast=n(state.lastAgeIncome);
    const beforeLogLen = Array.isArray(state.log) ? state.log.length : 0;
    // Run old chain for career side effects, then undo its money/debt/log salary side effects.
    try{ if(prevYearlyIncome175) prevYearlyIncome175.apply(this, arguments); }catch(e){ console.warn('[v17.5 old yearlyIncome side effects]', e); }
    if(Array.isArray(state.log) && state.log.length>beforeLogLen){
      const keep = state.log.slice(0,beforeLogLen);
      const added = state.log.slice(beforeLogLen).filter(x=>{
        const html = String(x && x.html || '');
        return !(html.includes('<b>Salaris</b>') || html.includes('<b>Schulden</b>'));
      });
      state.log = keep.concat(added).slice(-100);
    }
    state.money = beforeMoney; state.debts = beforeDebt; state.lastAgeIncome = beforeLast;
    if(state.job){
      const gross = grossAnnual175(state.job);
      const net = netAnnual175(gross);
      state.job.grossAnnual = gross; state.job.salary = gross; state.job.payType='grossAnnual';
      state.money += net;
      state.lastAgeIncome = n(state.lastAgeIncome) + net;
      state.lastAgeGrossIncome = gross;
      try{ addLog(`<b>Salaris</b><br>Ik werkte als ${jobTitle()}.<br>Bruto jaarsalaris: ${fmt(gross)}<br>Netto ontvangen: ± ${fmt(net)} per jaar / ${fmt(Math.round(net/12))} per maand.`, 'good', false); }catch(e){}
      safeStats({Happiness:rand(-2,3),Smarts:1});
    }
    debtYear175();
  }
  window.yearlyIncome = yearlyIncome175; try{ yearlyIncome = window.yearlyIncome; }catch(e){}

  function costProfile175(){
    const w=worldKey();
    if(w==='america' || w==='usa') return {food:1.08, phone:1.10, health:1.35, rent:1.18, label:'Amerika'};
    if(w==='japan' || w==='tokyo') return {food:1.05, phone:1.00, health:1.00, rent:1.15, label:'Japan'};
    if(w==='amsterdam') return {food:1.04, phone:1.00, health:1.00, rent:1.25, label:'Amsterdam'};
    if(w==='nightcity') return {food:1.25, phone:1.25, health:1.45, rent:1.60, label:'Night City'};
    if(w==='alkmaar') return {food:1.00, phone:1.00, health:1.00, rent:1.00, label:'Alkmaar'};
    return {food:.96, phone:1.00, health:1.00, rent:.92, label:'Enkhuizen/Nederland'};
  }
  function incomeBand175(){
    const net = n(state.lastAgeIncome);
    if(net<6000) return 'sidejob';
    if(net<18000) return 'low';
    if(net<32000) return 'normal';
    if(net<60000) return 'good';
    return 'high';
  }
  function lifestyleCost175(independent){
    const band=incomeBand175(), prof=costProfile175();
    const out=[]; let cost=0;
    function add(label,amount){ amount=Math.max(0,round(amount)); if(amount){cost+=amount; out.push(`${label}: ${fmt(amount)}`);} }
    if(!independent){
      const contribution = band==='sidejob'?0:band==='low'?600:band==='normal'?1500:band==='good'?2400:4200;
      add('Bijdrage thuis / boodschappen', contribution);
      add('Telefoon/persoonlijk', band==='sidejob'?360:540);
      // NL-like zorgtoeslag: health insurance exists from 18, but low income does not get crushed.
      const healthBase = 1900*prof.health;
      const allowance = band==='sidejob'?1500:band==='low'?1200:band==='normal'?650:0;
      add('Zorgverzekering na toeslag', Math.max(0, healthBase-allowance));
      add('Kleding/leefgeld sober', band==='sidejob'?250:band==='low'?650:950);
      return {cost, lines:out, status:'thuiswonend'};
    }
    add('Boodschappen/basis', (band==='sidejob'?3000:band==='low'?3900:band==='normal'?4800:6200)*prof.food);
    const healthBase = 2000*prof.health;
    const allowance = band==='sidejob'?1300:band==='low'?900:band==='normal'?350:0;
    add('Zorgverzekering/eigen zorg na toeslag', Math.max(0,healthBase-allowance));
    add('Telefoon/internet', (band==='sidejob'?520:band==='low'?760:1050)*prof.phone);
    add('Gemeente/verzekeringen', band==='sidejob'?360:band==='low'?650:900);
    add('Kleding/persoonlijk/leefgeld', band==='sidejob'?650:band==='low'?1150:band==='normal'?1900:3200);
    return {cost, lines:out, status:'zelfstandig'};
  }
  function yearlyAssets175(){
    if(!hasState()) return;
    ensureHousingStatus175();
    const adult = state.age>=18;
    let income=0, cost=0, lines=[];
    if(!adult){
      lines.push('Woont thuis bij ouders: geen standaard huur/vaste lasten.');
    }else if(hasOwnedOrRentedHouse()){
      (state.houses||[]).forEach(h=>{
        if(h.owned){
          h.value = Math.max(10000, Math.round(n(h.value||h.price||0)*(1+(rand(-3,5)/100))));
          const upkeep = h.upkeep || Math.round(n(h.value||180000)*0.0045);
          cost += upkeep; lines.push(`${h.name||'woning'}: onderhoud ${fmt(upkeep)}`);
          if(h.mortgage){ const mort=n(h.monthlyMortgage)*12; cost += mort; lines.push(`${h.name||'woning'}: hypotheek ${fmt(mort)}`); }
          if(h.rented){ income += n(h.rent); lines.push(`${h.name||'woning'} verhuur: ${fmt(h.rent)}`); }
        }else{
          const rentYear = n(h.monthlyRent)*12;
          cost += rentYear; lines.push(`${h.name||'woning'}: huur ${fmt(rentYear)}`);
        }
      });
      const life=lifestyleCost175(true); cost+=life.cost; lines=lines.concat(life.lines);
    }else{
      const hs = String(state.housingStatus||'parents').toLowerCase();
      if(hs==='student_room'){
        const rent=round(520*12*costProfile175().rent); cost+=rent; lines.push(`Studentenkamer/kamerhuur: ${fmt(rent)}`);
        const life=lifestyleCost175(true); cost+=Math.round(life.cost*.78); lines=lines.concat(life.lines.map(x=>x.replace(': ', ' laag: ')));
      }else if(hs==='couchsurfing' || hs==='resident_temp'){
        const temp=worldKey()==='nightcity'?3600:1800; cost+=temp; lines.push(`Tijdelijk onderdak/couchsurfing: ${fmt(temp)}`);
        const life=lifestyleCost175(false); cost+=life.cost; lines=lines.concat(life.lines);
        safeStats({Happiness:-2,Stamina:-1});
      }else if(hs==='homeless'){
        lines.push('Geen vaste woonplek: geen huur, maar zware stress en gezondheidsrisico.');
        safeStats({Happiness:-8,Health:-5,Stamina:-5});
      }else{
        const life=lifestyleCost175(false); cost+=life.cost; lines.push('Woont thuis / familie-onderdak: geen huurcontract of tijdelijke hotelkosten.'); lines=lines.concat(life.lines);
      }
    }

    (state.cars||[]).forEach(c=>{
      c.value = Math.max(250, Math.round(n(c.value||1000)*.88));
      if(adult){ const carCost = c.upkeep || rand(700,1900); cost += carCost; lines.push(`${c.name||'Auto'}: verzekering/onderhoud ${fmt(carCost)}`); }
      if(c.rented && adult){ income += n(c.rent); lines.push(`${c.name||'Auto'} verhuur: ${fmt(c.rent)}`); }
    });

    let petCost=0;
    (state.pets||[]).forEach(p=>{
      p.rel = clamp175(n(p.rel||65)+rand(-2,3)); p.health=clamp175(n(p.health||80)+rand(-4,2));
      petCost += p.upkeep || (typeof petUpkeep==='function'?petUpkeep(p.type||p.breed||'Pet'):300);
    });
    if((state.pets||[]).length){
      if(adult){ cost += petCost; lines.push(`Huisdieren: ${fmt(petCost)}`); }
      else lines.push('Huisdieren: ouders/verzorgers betalen de vaste verzorging.');
    }

    state.money += income - cost;
    state.lastAgeExpenses=cost; state.lastAgePassiveIncome=income;
    try{ addLog(`<b>Jaarlijkse economie</b><br>Passieve inkomsten: ${fmt(income)}<br>Levenskosten/vaste lasten: ${fmt(cost)}<br><br>${lines.slice(0,14).join('<br>')}`, income>=cost?'good':'warn', false); }catch(e){}

    // Child costs are real adult costs, but never for minors.
    if(adult && typeof applyChildYearlyCosts156 === 'function'){
      try{ applyChildYearlyCosts156(); }catch(e){ console.warn('[v17.5 child costs]', e); }
    }
    if(state.age<18 && typeof cleanMinorFinance171==='function'){
      try{ cleanMinorFinance171('v17.5 jaarlijkse economie onder 18', {log:false}); }catch(e){}
    }
    if(state.money<0){
      const debt = Math.abs(round(state.money));
      state.debts = n(state.debts) + debt;
      state.money = 0;
      try{ addLog(`<b>Roodstand / tekort</b><br>Door echte vaste lasten moest ik ${fmt(debt)} als schuld bijschrijven.`, 'bad', false); }catch(e){}
    }
  }
  window.yearlyAssets=yearlyAssets175; try{ yearlyAssets=window.yearlyAssets; }catch(e){}

  // Random life drama cannot charge for a household you do not control.
  const prevLifeDrama175 = window.lifeDramaNow160;
  if(prevLifeDrama175){
    window.lifeDramaNow160=function(){
      const beforeMoney=n(state.money), beforeDebt=n(state.debts), beforeLog=Array.isArray(state.log)?state.log.length:0;
      const out=prevLifeDrama175.apply(this, arguments);
      const independent=hasIndependentHousehold();
      if(!independent && state.money<beforeMoney){
        const diff=beforeMoney-state.money; state.money=beforeMoney; state.debts=beforeDebt;
        if(Array.isArray(state.log) && state.log.length>beforeLog){
          state.log = state.log.filter((x,idx)=> idx<beforeLog || !String(x.html||'').match(/Onverwachte rekening|Kapotte wasmachine|Roodstand/));
        }
        try{ addLog(`<b>Thuisregeling</b><br>Er was gedoe met spullen/rekeningen, maar ik had geen eigen huishouden. Geen onverwachte schuld of grote rekening voor mij.`, 'good', false); }catch(e){}
      }
      return out;
    };
    try{ lifeDramaNow160=window.lifeDramaNow160; }catch(e){}
  }

  const oldTriggerLifeEvent175 = window.triggerLifeEvent167;
  if(oldTriggerLifeEvent175){
    window.triggerLifeEvent167=function(){
      const beforeMoney=n(state.money), beforeDebt=n(state.debts), beforeLog=Array.isArray(state.log)?state.log.length:0;
      const out=oldTriggerLifeEvent175.apply(this, arguments);
      if(!hasIndependentHousehold() && state.money<beforeMoney){
        state.money=beforeMoney; state.debts=beforeDebt;
        if(Array.isArray(state.log) && state.log.length>beforeLog){
          state.log = state.log.filter((x,idx)=> idx<beforeLog || !String(x.html||'').match(/Kapotte spullen|Onverwachte rekening|Kapotte wasmachine|Roodstand/));
        }
        try{ addLog('<b>Geen eigen huishouden</b><br>Kapotte huisraad of onverwachte woonrekening werd niet op mij verhaald. Geen schuld erbij.', 'good', false); }catch(e){}
        try{ safeSave(); render(); }catch(e){}
      }
      return out;
    };
    try{ triggerLifeEvent167=window.triggerLifeEvent167; }catch(e){}
  }

  // Birthday/log dedupe + modal queue for birthday/yearly event collisions.
  const prevAddLog175 = window.addLog || (typeof addLog==='function'?addLog:null);
  if(prevAddLog175){
    window.addLog=function(html,type,save){
      try{
        if(hasState() && String(html||'').includes('<b>Verjaardag</b>')){
          state.flags=state.flags||{};
          if(state.flags.v175BirthdayLogAge===state.age) return;
          state.flags.v175BirthdayLogAge=state.age;
        }
      }catch(e){}
      return prevAddLog175.apply(this, arguments);
    };
    try{ addLog=window.addLog; }catch(e){}
  }

  const queue=[];
  window.BITZ_EVENT_QUEUE_175 = queue;
  const oldShowModal175 = window.showModal || (typeof showModal==='function'?showModal:null);
  const oldCloseModal175 = window.closeModal || (typeof closeModal==='function'?closeModal:null);
  function modalVisible(){ try{return !!document.getElementById('modalShade')?.classList.contains('show');}catch(e){return false;} }
  function showNextQueued(){
    if(!oldShowModal175 || !queue.length || modalVisible()) return;
    const next=queue.shift(); oldShowModal175(next.html);
    try{ const m=document.getElementById('modal'); if(m && queue.length){ const btn=document.createElement('button'); btn.className='btn green'; btn.textContent='Volgende gebeurtenis ('+queue.length+')'; btn.onclick=function(){ window.closeModal(); }; const body=m.querySelector('.modalBody')||m; body.appendChild(btn); } }catch(e){}
  }
  if(oldShowModal175){
    window.showModal=function(html){
      if(window.__bitzQueueModals175 && modalVisible()){
        queue.push({html:String(html||'')});
        try{ toast('Nog een gebeurtenis klaargezet.'); }catch(e){}
        return;
      }
      return oldShowModal175.apply(this, arguments);
    };
    try{ showModal=window.showModal; }catch(e){}
  }
  if(oldCloseModal175){
    window.closeModal=function(){
      const out=oldCloseModal175.apply(this, arguments);
      setTimeout(showNextQueued,90);
      return out;
    };
    try{ closeModal=window.closeModal; }catch(e){}
  }

  const prevAgeUp175 = window.ageUp || (typeof ageUp==='function'?ageUp:null);
  window.ageUp=function(){
    if(!hasState()) return prevAgeUp175?prevAgeUp175.apply(this, arguments):null;
    ensureHousingStatus175();
    window.__bitzQueueModals175 = true;
    state.flags = state.flags || {};
    // reset birthday dedupe for the new age after old ageUp increments it; we store by actual age in addLog.
    const out = prevAgeUp175 ? prevAgeUp175.apply(this, arguments) : null;
    setTimeout(()=>{ window.__bitzQueueModals175=false; showNextQueued(); }, 1400);
    if(state.age<18 && typeof cleanMinorFinance171==='function'){
      try{ cleanMinorFinance171('v17.5 age-up vangnet', {log:false}); }catch(e){}
    }
    try{ safeSave(); render(); }catch(e){}
    return out;
  };
  try{ ageUp=window.ageUp; }catch(e){}

  // Small screen so player can see/change housing logic without hidden rules.
  window.housingStatus175=function(){
    ensureHousingStatus175();
    const hs=String(state.housingStatus||'parents');
    const rows=[
      ['parents','🏠 Thuis/familie','Lage kosten. Geen huurcontract. Geen kapotte-wasmachine-schulden.'],
      ['student_room','🎓 Studentenkamer','Goedkope kamer met lage zelfstandige vaste lasten. 18+.'],
      ['couchsurfing','🛋️ Tijdelijk onderdak','Goedkoper dan hotel, maar stress/happiness omlaag.'],
      ['homeless','🌧️ Geen vaste plek','Geen huur, maar zware stress/health penalty.'],
    ].map(x=>`<button class="btn ${hs===x[0]?'green':''}" onclick="setHousingStatus175('${x[0]}')">${x[1]}<br><span class="mini">${x[2]}</span></button>`).join('');
    showModal(`<div class="modalTop"><div class="avatar">🏠</div><div class="modalTitle">Woonstatus v17.5</div></div><div class="modalBody"><div class="card"><b>Huidig:</b> ${hs}<br>Geen woning gekozen betekent nu niet meer automatisch ${fmt(12000)} tijdelijke woonkosten.</div>${rows}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };
  window.setHousingStatus175=function(v){
    if(!hasState()) return;
    if(state.age<18) return toast('Onder 18 woon je standaard thuis/verzorgers.');
    if(hasOwnedOrRentedHouse() && (v==='parents'||v==='student_room'||v==='couchsurfing'||v==='homeless')){
      // Allow switching only if no explicit house, to avoid cheating rent.
      return toast('Je hebt al een huur/koopwoning. Verkoop of beëindig die eerst.');
    }
    state.housingStatus=v; safeSave(); render(); toast('Woonstatus aangepast.'); housingStatus175();
  };

  const oldAssetsHTML175 = window.assetsHTML || (typeof assetsHTML==='function'?assetsHTML:null);
  if(oldAssetsHTML175){
    window.assetsHTML=function(){
      let h=oldAssetsHTML175();
      if(!String(h).includes('Woonstatus v17.5')) h += `<div class="section">Realistische economie</div>${typeof row==='function'?row('🏠','Woonstatus v17.5','Thuis, kamer, tijdelijk onderdak, huur/koop en vaste lasten logisch maken','housingStatus175()'):`<button class="btn" onclick="housingStatus175()">🏠 Woonstatus v17.5</button>`}`;
      return h;
    };
    try{ assetsHTML=window.assetsHTML; }catch(e){}
  }

  setTimeout(()=>{ try{ if(hasState()){ ensureHousingStatus175(); safeSave(); render(); } }catch(e){} }, 500);
  window.BITZ_SYSTEMS = window.BITZ_SYSTEMS || {};
  window.BITZ_SYSTEMS.realisticEconomyEventQueue = {version:VERSION, housingStatus:true, eventQueue:true, maxBirthdayPerAge:true, netNeverAboveGross:true};
  console.info('[BitzLife] Realistic Economy + Event Queue '+VERSION+' loaded');
})();
