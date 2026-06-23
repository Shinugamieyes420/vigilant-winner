/* v17.1 Minor Finance Guard
   Under 18: no unexpected bills, no negative cash, no debts/loans/study debt from random systems.
   Voluntary purchases still require enough cash and simply fail when you cannot pay. */
(function(){
  const PATCH = '17.1';
  function minor(force=false){ return !!(force || (window.state && Number(state.age) < 18)); }
  function fmt(n){ try{return money(Math.round(n||0));}catch(e){return '€'+Math.round(n||0);} }
  function hasFinance(){ return !!(state && state.finance); }
  function hasLifestyle(){ return !!(state && state.lifestyle); }
  function cleanMinorFinance(context='financieel vangnet', opts={}){
    if(!state || !minor(opts.force)) return false;
    let changed=false;
    const minMoney = Number.isFinite(opts.minMoney) ? Math.round(opts.minMoney) : 0;
    if(!Number.isFinite(+state.money)) { state.money=0; changed=true; }
    if(state.money < minMoney){ state.money = minMoney; changed=true; }
    if(state.money < 0){ state.money = 0; changed=true; }
    if((state.debts||0) > 0){ state.debts = 0; changed=true; }
    if(hasFinance()){
      if((state.finance.studyDebt||0) > 0){ state.finance.studyDebt = 0; changed=true; }
      if(Array.isArray(state.finance.loans) && state.finance.loans.length){ state.finance.loans=[]; changed=true; }
      state.finance.studyFinanceActive = false;
    }
    if(hasLifestyle() && Array.isArray(state.lifestyle.loans) && state.lifestyle.loans.length){ state.lifestyle.loans=[]; changed=true; }
    if(changed && opts.log){
      state.flags = state.flags || {};
      const key = 'minorFinanceGuardLog_'+context+'_'+state.age;
      if(!state.flags[key]){
        state.flags[key]=true;
        try{ addLog(`<b>Minderjarig financieel vangnet</b><br>${context}: onder 18 ontstaan er geen schulden, leningen of onverwachte rekeningen. Cash kan niet onder €0 komen.`, 'good', false); }catch(e){}
      }
    }
    return changed;
  }

  window.cleanMinorFinance171 = cleanMinorFinance;

  // Clean on render/load so old saves with under-18 debt are corrected immediately.
  const oldRender171 = window.render || (typeof render === 'function' ? render : null);
  window.render = function(){
    if(state && state.age < 18) cleanMinorFinance('save cleanup', {log:false});
    return oldRender171 ? oldRender171() : null;
  };
  try{ render = window.render; }catch(e){}

  const oldLoad171 = window.loadGame || (typeof loadGame === 'function' ? loadGame : null);
  window.loadGame = function(show){
    const out = oldLoad171 ? oldLoad171(show) : null;
    if(state && state.age < 18){ cleanMinorFinance('load cleanup', {log:false}); try{safeSave();render();}catch(e){} }
    return out;
  };
  try{ loadGame = window.loadGame; }catch(e){}

  // Age-up guard: if the player was a minor during the simulated year, no debt/negative cash may survive.
  const oldAge171 = window.ageUp || (typeof ageUp === 'function' ? ageUp : null);
  window.ageUp = function(){
    const wasMinor = !!(state && state.age < 18);
    const moneyBefore = state ? Math.max(0, state.money||0) : 0;
    const out = oldAge171 ? oldAge171() : null;
    if(wasMinor){
      cleanMinorFinance('jaar onder 18', {force:true, minMoney:Math.min(moneyBefore, state.money||moneyBefore), log:true});
      try{ safeSave(); render(); }catch(e){}
    }else if(state && state.age < 18){
      cleanMinorFinance('jaar onder 18', {log:true});
    }
    return out;
  };
  try{ ageUp = window.ageUp; }catch(e){}

  // Direct yearly wrappers: protect older chained yearly systems too.
  const oldYearlyIncome171 = window.yearlyIncome || (typeof yearlyIncome === 'function' ? yearlyIncome : null);
  if(oldYearlyIncome171){
    window.yearlyIncome = function(){
      if(state && state.age < 18) cleanMinorFinance('inkomen start', {log:false});
      const out = oldYearlyIncome171.apply(this, arguments);
      if(state && state.age < 18) cleanMinorFinance('inkomen eind', {log:false});
      return out;
    };
    try{ yearlyIncome = window.yearlyIncome; }catch(e){}
  }

  const oldYearlyAssets171 = window.yearlyAssets || (typeof yearlyAssets === 'function' ? yearlyAssets : null);
  if(oldYearlyAssets171){
    window.yearlyAssets = function(){
      const wasMinor = !!(state && state.age < 18);
      const before = state ? Math.max(0, state.money||0) : 0;
      const out = oldYearlyAssets171.apply(this, arguments);
      if(wasMinor){
        if(state.money < before) state.money = before; // no automatic yearly asset/pet/lifestyle bill under 18
        cleanMinorFinance('bezittingen onder 18', {log:false});
      }
      return out;
    };
    try{ yearlyAssets = window.yearlyAssets; }catch(e){}
  }

  // Lifestyle loan screen and direct loan function should be impossible under 18.
  const oldLoansHub165 = window.loansHub165;
  if(oldLoansHub165){
    window.loansHub165 = function(){
      if(state && state.age < 18){
        cleanMinorFinance('leningen onder 18', {log:false});
        return showModal(`<div class="modalTop"><div class="avatar">💳</div><div class="modalTitle">Leningen</div></div><div class="modalBody"><div class="card">Onder 18 kun je geen leningen, studieschuld of onverwachte schulden hebben. Vrijwillige aankopen moeten gewoon betaalbaar zijn; anders gebeurt er niks.</div><button class="btn alt" onclick="moneyLifestyleHub165 ? moneyLifestyleHub165() : closeModal()">Terug</button></div>`);
      }
      return oldLoansHub165.apply(this, arguments);
    };
    try{ loansHub165 = window.loansHub165; }catch(e){}
  }

  const oldTakeLoan165 = window.takeLoan165;
  if(oldTakeLoan165){
    window.takeLoan165 = function(amount){
      if(state && state.age < 18){ cleanMinorFinance('lening geblokkeerd', {log:false}); return toast('Lenen kan pas vanaf 18 jaar.'); }
      return oldTakeLoan165.apply(this, arguments);
    };
    try{ takeLoan165 = window.takeLoan165; }catch(e){}
  }

  const oldTakeLoan128 = window.takeLoan128;
  if(oldTakeLoan128){
    window.takeLoan128 = function(type){
      if(state && state.age < 18){ cleanMinorFinance('lening geblokkeerd', {log:false}); return toast('Lenen kan pas vanaf 18 jaar.'); }
      return oldTakeLoan128.apply(this, arguments);
    };
    try{ takeLoan128 = window.takeLoan128; }catch(e){}
  }

  const oldTakeStudyDebt128 = window.takeStudyDebt128;
  if(oldTakeStudyDebt128){
    window.takeStudyDebt128 = function(){
      if(state && state.age < 18){ cleanMinorFinance('studielening geblokkeerd', {log:false}); return toast('Studielening kan pas vanaf 18 jaar.'); }
      return oldTakeStudyDebt128.apply(this, arguments);
    };
    try{ takeStudyDebt128 = window.takeStudyDebt128; }catch(e){}
  }

  // Manual life event button should also not create surprise bills for minors.
  const oldTriggerLifeEvent167 = window.triggerLifeEvent167;
  if(oldTriggerLifeEvent167){
    window.triggerLifeEvent167 = function(){
      const wasMinor = !!(state && state.age < 18);
      const before = state ? Math.max(0, state.money||0) : 0;
      const out = oldTriggerLifeEvent167.apply(this, arguments);
      if(wasMinor){ if(state.money < before) state.money = before; cleanMinorFinance('life event onder 18', {log:false}); try{safeSave();render();}catch(e){} }
      return out;
    };
    try{ triggerLifeEvent167 = window.triggerLifeEvent167; }catch(e){}
  }

  setTimeout(()=>{ try{ if(state && state.age < 18){ cleanMinorFinance('opstart cleanup', {log:false}); safeSave(); render(); } }catch(e){} }, 450);
  console.info('[BitzLife] Minor Finance Guard '+PATCH+' loaded');
})();
