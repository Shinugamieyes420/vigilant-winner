/* v17.6 Job Separation + Time System
   Scheidt bijbaan, stage/leerwerk, gewone baan en carrièrebaan.
   Minderjarigen houden school als hoofdactiviteit; bijbaan staat los van volwassen werk. */
(function(){
  'use strict';
  const VERSION='17.6';
  const SIDE_IDS=new Set(['paperboy','babysitter','dishwasher','stock_clerk','cashier_helper','delivery_bike','fastfood','barista']);
  const SIDE_STANDARD={paperboy:4,babysitter:6,dishwasher:8,stock_clerk:8,cashier_helper:10,delivery_bike:10,fastfood:12,barista:12};
  const INTERNSHIP_IDS=new Set(['orientation_retail','mbo_social_intern','ict_leerwerk','production_leerwerk','traineeship_government']);

  function hasState(){ return typeof state!=='undefined' && !!state; }
  function fmt(n){ try{return (typeof money==='function')?money(Math.round(n||0)):'€'+Math.round(n||0);}catch(e){return '€'+Math.round(n||0);} }
  function rnd(a,b){ try{return (typeof r==='function')?r(a,b):Math.floor(Math.random()*(b-a+1))+a;}catch(e){return Math.floor(Math.random()*(b-a+1))+a;} }
  function clamp100(v){ try{return (typeof clamp==='function')?clamp(v):Math.max(0,Math.min(100,Math.round(v||0)));}catch(e){return Math.max(0,Math.min(100,Math.round(v||0)));} }
  function esc(s){ return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function saveRender(){ try{ if(typeof safeSave==='function') safeSave(); }catch(e){} try{ if(typeof render==='function') render(); }catch(e){} }
  function log(html,type='good'){ try{ if(typeof addLog==='function') addLog(html,type,false); }catch(e){} }
  function act(title,txt,stats={},cash=0,type='good'){ try{ if(typeof action==='function') return action(title,txt,stats,cash,type); }catch(e){} if(hasState()){ state.money=(state.money||0)+(cash||0); log(`<b>${esc(title)}</b><br>${txt}`,type); saveRender(); } }
  function eduRank176(){ try{return (typeof eduRank==='function')?eduRank():'none';}catch(e){return 'none';} }
  function eduScore176(v){ try{return (typeof eduScore==='function')?eduScore(v):({none:0,primary:1,highschool:2,mbo:3,hbo:4,uni:5}[v]||0);}catch(e){return ({none:0,primary:1,highschool:2,mbo:3,hbo:4,uni:5}[v]||0);} }
  function clone176(o){ try{return (typeof clone==='function')?clone(o):JSON.parse(JSON.stringify(o));}catch(e){return Object.assign({},o);} }

  function addInternships176(){
    if(typeof DATA==='undefined' || !DATA || !Array.isArray(DATA.jobs)) return;
    const existing=new Set(DATA.jobs.map(j=>j.id));
    const extras=[
      {id:'orientation_retail',title:'snuffelstage winkel',field:'Stage / oriëntatie',salary:0,minAge:15,edu:'none',smart:0,jobType:'internship',weeklyHours:6,standardHours:6,route:'retail'},
      {id:'mbo_social_intern',title:'MBO stage sociaal werk',field:'Stage / sociaal werk',salary:1400,minAge:16,edu:'highschool',smart:25,jobType:'internship',weeklyHours:16,standardHours:16,route:'social'},
      {id:'ict_leerwerk',title:'ICT leerwerkplek',field:'Leerwerk / ICT',salary:4200,minAge:17,edu:'highschool',smart:35,jobType:'internship',weeklyHours:20,standardHours:20,route:'ict'},
      {id:'production_leerwerk',title:'productie leerwerkplek',field:'Leerwerk / productie',salary:5200,minAge:17,edu:'highschool',smart:10,jobType:'internship',weeklyHours:20,standardHours:20,route:'logistics'},
      {id:'traineeship_government',title:'traineeship overheid',field:'Traineeship / overheid',salary:24000,minAge:21,edu:'hbo',smart:55,jobType:'internship',weeklyHours:32,standardHours:32,route:'government'}
    ];
    extras.forEach(j=>{ if(!existing.has(j.id)) DATA.jobs.push(j); });
  }

  function inferRoute176(job){
    const txt=`${job?.id||''} ${job?.title||''} ${job?.field||''}`.toLowerCase();
    if(/ict|software|data|developer|cloud|security/.test(txt)) return 'ict';
    if(/sociaal|jongeren|re-integratie|participatie|jobcoach|welzijn|begeleider/.test(txt)) return 'social';
    if(/zorg|verpleeg|arts|psycholoog|medisch|chirurg/.test(txt)) return 'care';
    if(/overheid|gemeente|administratie|belasting|beleid|uitkering/.test(txt)) return 'government';
    if(/retail|verkoop|telecom|winkel|supermarkt|kassa|vakken/.test(txt)) return 'retail';
    if(/horeca|barista|kok|fastfood|afwasser/.test(txt)) return 'hospitality';
    if(/logistiek|magazijn|bezorg|koerier|productie|warehouse/.test(txt)) return 'logistics';
    if(/techniek|monteur|elektro|engineer/.test(txt)) return 'technical';
    if(/politie|veiligheid|beveilig/.test(txt)) return 'security';
    if(/onderwijs|docent|teacher/.test(txt)) return 'education';
    if(/management|teamleider|projectmanager|leiding/.test(txt)) return 'management';
    if(/finance|financ|boekhouder|controller|vastgoed|makelaar/.test(txt)) return 'finance';
    if(/jurid|law|advocaat/.test(txt)) return 'legal';
    if(/marketing|media|content|fame/.test(txt)) return 'creative';
    return 'survival';
  }
  function classifyJob176(job){
    if(!job) return 'none';
    const txt=`${job.id||''} ${job.title||''} ${job.field||''} ${job.contractType||''} ${job.jobType||''}`.toLowerCase();
    if(job.jobType && ['side_job','internship','normal_job','career_job'].includes(job.jobType)) return job.jobType;
    if(SIDE_IDS.has(job.id) || /bijbaan|kranten|oppas|vakkenvuller|fietskoerier|afwasser|kassamedewerker bijbaan/.test(txt)) return 'side_job';
    if(INTERNSHIP_IDS.has(job.id) || /stage|stagiair|leerwerk|trainee|traineeship/.test(txt)) return 'internship';
    const edu=job.edu||job.education||'none';
    const salary=Number(job.fteGrossAnnual||job.salary||job.grossAnnual||0);
    if((job.workSystem==='career2') || ['mbo','hbo','uni'].includes(edu) || salary>=36000 || (job.minAge||0)>=21) return 'career_job';
    return 'normal_job';
  }
  function label176(type){ return ({side_job:'Bijbaan',internship:'Stage / leerwerk',normal_job:'Gewone baan',career_job:'Carrièrebaan'}[type]||type); }
  function icon176(type){ return ({side_job:'🧃',internship:'🎓',normal_job:'🧰',career_job:'📈'}[type]||'💼'); }
  function maxSideHours176(age){ age=Number(age||0); if(age<13) return 0; if(age<=14) return 4; if(age===15) return 8; if(age<=17) return 12; return 16; }
  function maxPrimaryHours176(type,age){
    age=Number(age||0);
    if(type==='side_job') return maxSideHours176(age);
    if(type==='internship') return age<15?0:(age<18?20:32);
    if(age<18) return 0;
    if(type==='career_job') return 40;
    return 40;
  }
  function defaultHours176(job,type){
    const age=hasState()?state.age:18;
    if(type==='side_job') return Math.min(maxSideHours176(age), SIDE_STANDARD[job?.id] || (age<18?8:12));
    if(type==='internship') return Math.min(maxPrimaryHours176(type,age), job?.weeklyHours || job?.hours || (age<18?16:28));
    if(type==='career_job') return Math.min(maxPrimaryHours176(type,age), job?.weeklyHours || job?.hours || 36);
    return Math.min(maxPrimaryHours176(type,age), job?.weeklyHours || job?.hours || 32);
  }
  function normalizeJob176(job){
    if(!job) return job;
    const type=classifyJob176(job);
    job.jobType=type;
    job.contractType = label176(type).toLowerCase();
    job.route=job.route || inferRoute176(job);
    const standard = type==='side_job' ? (SIDE_STANDARD[job.id] || defaultHours176(job,type) || 8) : (job.standardHours || (type==='internship'?Math.max(16, job.weeklyHours||20):36));
    job.standardHours=standard;
    job.weeklyHours = Math.max(0, Math.min(maxPrimaryHours176(type,hasState()?state.age:18), Number(job.weeklyHours || job.hours || defaultHours176(job,type) || 0)));
    job.hours = job.weeklyHours;
    const salary=Number(job.fteGrossAnnual||job.salary||job.grossAnnual||0);
    job.fteGrossAnnual = job.fteGrossAnnual || (type==='side_job' ? salary : Math.max(salary, Math.round(salary * (standard||36) / Math.max(1, job.weeklyHours || standard || 36))));
    if(type==='side_job' || type==='internship'){
      job.grossAnnual = Math.round(Number(job.fteGrossAnnual||salary||0) * Math.max(0.05, (job.weeklyHours||0) / Math.max(1, job.standardHours||job.weeklyHours||1)));
    }else{
      job.grossAnnual = Math.round(Number(job.fteGrossAnnual||salary||0) * Math.max(0.15, (job.weeklyHours||32) / Math.max(1, job.standardHours||36)));
    }
    job.salary=job.grossAnnual;
    job.performance=clamp100(job.performance??50);
    job.stress=clamp100(job.stress??(type==='side_job'?8:type==='internship'?14:20));
    return job;
  }
  function normalizeJobs176(){
    addInternships176();
    if(typeof DATA==='undefined' || !DATA || !Array.isArray(DATA.jobs)) return;
    DATA.jobs.forEach(normalizeJob176);
  }
  function ensureWork176(){
    if(!hasState()) return;
    state.workLife=state.workLife || {version:VERSION};
    state.timeBudget=state.timeBudget || {};
    if(state.job) normalizeJob176(state.job);
    if(state.sideJob) normalizeJob176(state.sideJob);
    // Old saves sometimes put a bijbaan in the adult job slot. Move it out.
    if(state.job && classifyJob176(state.job)==='side_job'){
      state.sideJob=state.sideJob || state.job;
      state.job=null;
      state.jobYears=0;
      state.careerLevel=0;
      log('<b>Werk opgeschoond</b><br>Mijn bijbaan staat nu los van gewone banen. School/jeugd en volwassen werk lopen niet meer door elkaar.','good');
    }
    if(state.age<18 && state.job && !['side_job','internship'].includes(classifyJob176(state.job))){
      const old=state.job.title||'baan';
      state.job=null; state.jobYears=0; state.careerLevel=0;
      log(`<b>Werkregeling</b><br>${esc(old)} werd gestopt als volwassen baan, want onder 18 kan ik geen gewone fulltime baan/carrièrebaan hebben.`, 'warn');
    }
    if(state.sideJob){
      const max=maxSideHours176(state.age);
      state.sideJob.weeklyHours=Math.min(Number(state.sideJob.weeklyHours||state.sideJob.hours||defaultHours176(state.sideJob,'side_job')),max);
      state.sideJob.hours=state.sideJob.weeklyHours;
      normalizeJob176(state.sideJob);
    }
    if(state.job){
      const type=classifyJob176(state.job), max=maxPrimaryHours176(type,state.age);
      state.job.weeklyHours=Math.min(Number(state.job.weeklyHours||state.job.hours||defaultHours176(state.job,type)),max);
      state.job.hours=state.job.weeklyHours;
      normalizeJob176(state.job);
    }
  }
  window.ensureWork176=ensureWork176;
  window.classifyJob176=classifyJob176;

  function eligible176(job,targetType){
    ensureWork176(); normalizeJob176(job);
    const type=targetType || classifyJob176(job);
    const req=[];
    if((state.age||0)<(job.minAge||0)) req.push(`${job.minAge}+ jaar`);
    if(type==='normal_job' || type==='career_job'){
      if(state.age<18) req.push('18+ voor gewone baan/carrièrebaan');
    }
    if(type==='side_job' && maxSideHours176(state.age)<=0) req.push('13+ voor bijbaan');
    if(type==='internship' && state.age<15) req.push('15+ voor stage/leerwerk');
    if(eduScore176(eduRank176()) < eduScore176(job.edu||job.education||'none')) req.push(`diploma: ${job.edu||job.education}`);
    if((state.stats?.Smarts||50) < (job.smart||0)) req.push(`Smarts ${job.smart}+`);
    if(type==='side_job' && state.sideJob && state.sideJob.id!==job.id) req.push('eerst huidige bijbaan stoppen');
    if(type!=='side_job' && type!=='internship' && state.job && state.job.id!==job.id) req.push('eerst huidige baan stoppen');
    return {ok:req.length===0, req};
  }
  function payLine176(job){
    normalizeJob176(job);
    const type=classifyJob176(job), gross=Number(job.grossAnnual||job.salary||0), net=netAnnual176(gross,type);
    return `${label176(type)} · ${job.weeklyHours||0}u/wk · bruto ${fmt(gross)}/jaar · netto ± ${fmt(net)}/jaar`;
  }
  function netAnnual176(gross,type){
    gross=Math.max(0,Math.round(gross||0));
    if(!gross) return 0;
    let rate= type==='side_job'?0.96:type==='internship'?0.94:gross<=12000?0.93:gross<=22000?0.88:gross<=36000?0.82:gross<=60000?0.76:gross<=100000?0.70:0.62;
    return Math.min(gross, Math.round(gross*rate));
  }
  function typeExplain176(type){
    return {
      side_job:'Voor naast school/studie. Lage uren, laag risico, eigen bijbaan-update en geen volwassen carrière-review.',
      internship:'Stage/leerwerk geeft weinig geld maar veel route-ervaring. Past naast opleiding.',
      normal_job:'Gewone baan voor volwassenen. Parttime/fulltime, salaris, normale werkreview en vaste inkomsten.',
      career_job:'Carrièrebaan met route, reputatie, promoties, stress en logische volgende stappen.'
    }[type] || '';
  }
  function jobButton176(job,targetType){
    normalizeJob176(job);
    const type=targetType||classifyJob176(job);
    const el=eligible176(job,type);
    return `<button class="btn ${el.ok?'':'locked'}" onclick="${el.ok?`careerApplyJob176('${job.id}','${type}')`:''}">${icon176(type)} ${esc(job.title)}<br><span class="mini">${payLine176(job)}${el.ok?'':`<br>Locked: ${esc(el.req.join(' · '))}`}</span></button>`;
  }
  function currentSummary176(){
    ensureWork176();
    const rows=[];
    if(state.sideJob) rows.push(`<b>Bijbaan:</b> ${esc(state.sideJob.title)} · ${state.sideJob.weeklyHours||0}u/wk · stress ${state.sideJob.stress??8}%`);
    else rows.push('<b>Bijbaan:</b> geen');
    if(state.job){ const t=classifyJob176(state.job); rows.push(`<b>${label176(t)}:</b> ${esc(state.job.title)} · ${state.job.weeklyHours||0}u/wk · performance ${state.job.performance??50}% · stress ${state.job.stress??20}%`); }
    else rows.push('<b>Gewone/carrièrebaan:</b> geen');
    const b=buildSchedule176();
    rows.push(`<b>Tijdindeling:</b> verplichtingen ${b.obligations}u/wk · vrije/rustruimte ${b.freeScore}/100 · druk: ${esc(b.pressureLabel)}`);
    return `<div class="card">${rows.join('<br>')}</div>`;
  }

  window.careerHub176=function(){
    if(!hasState()) return;
    ensureWork176();
    showModal(`<div class="modalTop"><div class="avatar">💼</div><div class="modalTitle">Career Hub 17.6</div></div><div class="modalBody">
      <div class="card"><b>Werk is gescheiden.</b><br>Bijbaan staat los van gewone baan. School/studie, werkuren, sport, business en rust krijgen nu een logische tijdindeling.</div>
      ${currentSummary176()}
      <div class="section">Werk zoeken</div>
      <button class="btn" onclick="careerFindJobs176('side_job')">🧃 Bijbaan naast school/studie</button>
      <button class="btn" onclick="careerFindJobs176('internship')">🎓 Stage / leerwerk / traineeship</button>
      <button class="btn" onclick="careerFindJobs176('normal_job')">🧰 Gewone baan</button>
      <button class="btn gold" onclick="careerFindJobs176('career_job')">📈 Carrièrebaan / Werk 2.0</button>
      <div class="section">Mijn planning</div>
      <button class="btn" onclick="timeBudget176()">🕒 Tijdindeling & uren aanpassen</button>
      <button class="btn" onclick="careerActions176()">🧠 Werkacties</button>
      <button class="btn" onclick="careerPaths172 ? careerPaths172() : toast('Carrièrepaden niet gevonden')">🗺️ Carrièrepaden bekijken</button>
      <button class="btn red" onclick="quitWork176()">🚪 Werk stoppen</button>
      <button class="btn alt" onclick="closeModal()">Terug</button>
    </div>`);
  };
  window.workScreen=function(){ return careerHub176(); };
  window.careerHub172=window.careerHub176;
  try{ workScreen=window.workScreen; }catch(e){}

  window.careerFindJobs176=function(type){
    normalizeJobs176(); ensureWork176();
    let jobs=(DATA.jobs||[]).filter(j=>classifyJob176(j)===type);
    if(type==='side_job') jobs=jobs.filter(j=>(j.minAge||0)<18 || SIDE_IDS.has(j.id));
    if(type==='normal_job') jobs=jobs.filter(j=>(j.minAge||0)>=18);
    if(type==='career_job') jobs=jobs.filter(j=>(j.minAge||0)>=18);
    jobs=jobs.slice(0,90);
    showModal(`<div class="modalTop"><div class="avatar">${icon176(type)}</div><div class="modalTitle">${label176(type)} zoeken</div></div><div class="modalBody">
      <div class="card">${typeExplain176(type)}</div>
      ${jobs.map(j=>jobButton176(j,type)).join('') || '<div class="card">Geen opties gevonden.</div>'}
      <button class="btn alt" onclick="careerHub176()">Terug</button>
    </div>`);
  };
  window.careerFindJobs172=function(filter){
    const map={werk1:'side_job',career2:'career_job',local:'normal_job'};
    return careerFindJobs176(map[filter]||filter||'normal_job');
  };

  window.careerApplyJob176=function(id,type){
    normalizeJobs176(); ensureWork176();
    const source=(DATA.jobs||[]).find(j=>j.id===id); if(!source) return toast('Baan niet gevonden.');
    const job=normalizeJob176(clone176(source)); type=type||classifyJob176(job);
    const el=eligible176(job,type); if(!el.ok) return toast(el.req.join(' · '));
    if(type==='side_job'){
      state.sideJob=job; state.sideJob.startedAge=state.age; state.sideJob.performance=52; state.sideJob.stress=8; state.sideJob.jobType='side_job';
      closeModal(); act('Bijbaan',`Ik begon als ${esc(job.title)} voor ${job.weeklyHours} uur per week. Dit telt als bijbaan naast school/studie, niet als volwassen fulltime carrière.`,{Smarts:1,Happiness:2,Stamina:-2},0,'good');
      ensureWork176(); saveRender(); return;
    }
    if(type==='internship'){
      state.internship=job; state.job=job; state.jobYears=0; state.careerLevel=0; state.career=state.career||{}; state.career.route=job.route; state.career.experience=(state.career.experience||0)+3;
      closeModal(); act('Stage / leerwerk',`Ik startte als ${esc(job.title)} voor ${job.weeklyHours} uur per week. Het levert vooral ervaring op en past rond opleiding/route.`,{Smarts:3,Happiness:1,Stamina:-3},0,'good');
      ensureWork176(); saveRender(); return;
    }
    // Keep interviews for adult jobs, but apply v17.6 normalization after answer.
    if(typeof startJobInterview==='function') return startJobInterview(id);
    state.job=job; state.jobYears=0; state.careerLevel=0; closeModal(); act('Werk',`Ik kreeg werk als ${esc(job.title)}.`,{Happiness:4,Smarts:1},0,'good');
    ensureWork176(); saveRender();
  };
  window.careerStartInterview172=function(id){ return careerApplyJob176(id); };

  const oldAnswer176=window.answerJobInterview || (typeof answerJobInterview==='function'?answerJobInterview:null);
  if(oldAnswer176){
    window.answerJobInterview=function(i){
      const beforeJobId=window.__jobInterview && window.__jobInterview.jobId;
      const source=(DATA.jobs||[]).find(j=>j.id===beforeJobId);
      const type=source?classifyJob176(source):null;
      if(source && type==='side_job') return careerApplyJob176(beforeJobId,'side_job');
      if(source && state.age<18 && (type==='normal_job'||type==='career_job')){ closeModal(); return toast('Onder 18 kun je geen gewone volwassen baan of carrièrebaan aannemen. Kies bijbaan of stage.'); }
      const out=oldAnswer176.apply(this, arguments);
      setTimeout(()=>{ try{ ensureWork176(); if(state.job){ state.job.jobType=classifyJob176(state.job); normalizeJob176(state.job); } saveRender(); }catch(e){ console.warn('[v17.6 answer normalize]', e); } }, 60);
      return out;
    };
    try{ answerJobInterview=window.answerJobInterview; }catch(e){}
  }

  window.acceptPartTimeJob=function(){
    normalizeJobs176();
    const j=clone176((DATA.jobs||[]).find(x=>x.id==='paperboy') || {id:'paperboy',title:'krantenbezorger',field:'Bijbaan',salary:2800,minAge:13,edu:'none'});
    normalizeJob176(j); state.sideJob=j; state.sideJob.performance=50; state.sideJob.stress=6;
    try{ if(typeof addRel==='function'){ addRel(state.mother,5); addRel(state.father,5); } }catch(e){}
    closeModal(); act('Bijbaan',`Ik nam een bijbaan als ${esc(j.title)}. Mijn ouders vonden dat volwassen, maar het blijft gewoon naast school.`,{Smarts:2,Happiness:-1},0,'good');
    ensureWork176(); saveRender();
  };
  try{ acceptPartTimeJob=window.acceptPartTimeJob; }catch(e){}

  function fteSalary176(job){
    normalizeJob176(job);
    return Number(job.fteGrossAnnual || job.salary || job.grossAnnual || 0);
  }
  function grossAnnual176(job){
    if(!job) return 0; normalizeJob176(job);
    const type=classifyJob176(job);
    const base=fteSalary176(job), hours=Number(job.weeklyHours||job.hours||0), standard=Number(job.standardHours||((type==='side_job')?(SIDE_STANDARD[job.id]||8):36));
    let gross=Math.round(base * Math.max(0, hours) / Math.max(1, standard));
    if(type==='side_job') gross=Math.min(gross, Math.round(base*1.6));
    return Math.max(0,gross);
  }
  function debtYear176(){
    if(!hasState() || (state.debts||0)<=0) return;
    const interest=Math.ceil((state.debts||0)*0.035); state.debts+=interest;
    const pay=Math.min(state.money||0, Math.max(0,Math.ceil((state.debts||0)*0.045)));
    state.money-=pay;
    log(`<b>Schulden</b><br>Rente en aflossing kostten ${fmt(pay)}. De schuld staat nu op ${fmt(state.debts)}.`, 'warn');
  }
  const prevYearlyIncome176=window.yearlyIncome || (typeof yearlyIncome==='function'?yearlyIncome:null);
  window.yearlyIncome=function(){
    if(!hasState()) return prevYearlyIncome176?prevYearlyIncome176.apply(this,arguments):null;
    ensureWork176();
    const bm=state.money||0, bd=state.debts||0, bli=state.lastAgeIncome||0, blg=state.lastAgeGrossIncome||0, blog=Array.isArray(state.log)?state.log.length:0;
    // Run older chain for career side-effects/reviews, then undo its salary/debt money because v17.5 did not know parttime + sideJob yet.
    let tempInternshipJob=null;
    if(state.job && classifyJob176(state.job)==='internship'){
      // Stage/leerwerk krijgt eigen update, geen volwassen Work Life review uit oude chain.
      tempInternshipJob=state.job;
      state.job=null;
    }
    try{ if(prevYearlyIncome176) prevYearlyIncome176.apply(this,arguments); }catch(e){ console.warn('[v17.6 prev yearlyIncome]', e); }
    if(tempInternshipJob) state.job=tempInternshipJob;
    if(Array.isArray(state.log) && state.log.length>blog){
      const keep=state.log.slice(0,blog);
      const add=state.log.slice(blog).filter(x=>{
        const h=String(x&&x.html||'');
        return !(h.includes('<b>Salaris</b>') || h.includes('<b>Schulden</b>'));
      });
      state.log=keep.concat(add).slice(-100);
    }
    state.money=bm; state.debts=bd; state.lastAgeIncome=bli; state.lastAgeGrossIncome=blg;
    if(state.job){
      const type=classifyJob176(state.job), gross=grossAnnual176(state.job), net=netAnnual176(gross,type);
      state.money+=net; state.lastAgeIncome=(state.lastAgeIncome||0)+net; state.lastAgeGrossIncome=(state.lastAgeGrossIncome||0)+gross;
      state.job.grossAnnual=gross; state.job.salary=gross;
      log(`<b>Salaris</b><br>${label176(type)}: ${esc(state.job.title)}<br>Uren: ${state.job.weeklyHours} uur per week.<br>Bruto jaarsalaris: ${fmt(gross)}<br>Netto ontvangen: ± ${fmt(net)} per jaar / ${fmt(Math.round(net/12))} per maand.`, 'good');
      if(type==='internship'){
        state.career=state.career||{};
        state.career.experience=(state.career.experience||0)+rnd(5,10);
        state.job.performance=clamp100((state.job.performance??50)+rnd(-2,6));
        state.job.stress=clamp100((state.job.stress??12)+rnd(-1,3));
        log(`<b>Stage / leerwerk update</b><br>Mijn ${esc(state.job.title)} leverde vooral ervaring op. Route XP groeide zonder dat het als volwassen carrièrebaan voelde.<br>Performance ${state.job.performance}% · stress ${state.job.stress}%`, 'good');
      }
    }
    if(state.sideJob){
      const gross=grossAnnual176(state.sideJob), net=netAnnual176(gross,'side_job');
      state.money+=net; state.lastAgeIncome=(state.lastAgeIncome||0)+net; state.lastAgeGrossIncome=(state.lastAgeGrossIncome||0)+gross;
      state.sideJob.performance=clamp100((state.sideJob.performance??50)+rnd(-3,5));
      state.sideJob.stress=clamp100((state.sideJob.stress??8)+rnd(-2,3));
      const schoolLine=state.age<18?' School bleef hoofdzaak; dit was extra zakgeld/ervaring.':' Dit was extra inkomen naast mijn gewone leven.';
      log(`<b>Bijbaan update</b><br>Ik werkte als ${esc(state.sideJob.title)} voor ${state.sideJob.weeklyHours} uur per week.<br>Netto bijbaaninkomen: ± ${fmt(net)} dit jaar.${schoolLine}<br>Performance ${state.sideJob.performance}% · stress ${state.sideJob.stress}%`, 'good');
    }
    applyTimePressure176(true);
    debtYear176();
  };
  try{ yearlyIncome=window.yearlyIncome; }catch(e){}

  function buildSchedule176(){
    ensureWork176();
    const age=state.age||0;
    const school = age<18 ? 32 : (state.education && state.education.studying ? 24 : 0);
    const side = state.sideJob ? Number(state.sideJob.weeklyHours||0) : 0;
    const work = state.job ? Number(state.job.weeklyHours||0) : 0;
    const sport = (state.football && (state.football.club || state.football.contract || state.football.level!=='recreatief')) ? 8 : ((state.talents&&state.talents.sport>10)?4:0);
    const business = (Array.isArray(state.businesses) && state.businesses.length) ? Math.min(16, 4 + state.businesses.length*3) : 0;
    const obligations=school+side+work+sport+business;
    let freeScore=100;
    if(obligations>42) freeScore-=Math.round((obligations-42)*2.2);
    if(obligations>58) freeScore-=Math.round((obligations-58)*2.4);
    freeScore=clamp100(freeScore);
    const rest = freeScore>=70?'genoeg rust':freeScore>=45?'druk maar te doen':freeScore>=25?'te vol':'overbelast';
    return {school,side,work,sport,business,obligations,freeScore,pressureLabel:rest};
  }
  function applyTimePressure176(fromYear=false){
    if(!hasState()) return; ensureWork176();
    const b=buildSchedule176(); state.timeBudget=b;
    let stats={}; let msg=''; let type='';
    if(b.freeScore<25){ stats={Happiness:-7,Health:-3,Smarts:state.age<18?-3:0,Stamina:-8}; msg='Mijn planning was overbelast. School/werk/sport/business tegelijk trok mijn energie leeg.'; type='bad'; }
    else if(b.freeScore<45){ stats={Happiness:-4,Health:-1,Smarts:state.age<18?-1:0,Stamina:-4}; msg='Mijn week zat te vol. Het ging nog, maar mijn stress liep op.'; type='warn'; }
    else if(b.freeScore>75){ stats={Happiness:2,Health:1,Stamina:2}; msg='Mijn tijdindeling bleef gezond. Genoeg ruimte voor school/werk én rust.'; type='good'; }
    if(msg && fromYear){
      try{ if(typeof applyStats==='function') applyStats(stats); }catch(e){}
      log(`<b>Tijdindeling</b><br>${msg}<br><br>School/studie ${b.school}u · bijbaan ${b.side}u · werk ${b.work}u · sport ${b.sport}u · business ${b.business}u.<br>Vrije/rustruimte: ${b.freeScore}/100.`, type);
    }
  }
  window.buildSchedule176=buildSchedule176;
  window.applyTimePressure176=applyTimePressure176;

  window.timeBudget176=function(){
    ensureWork176(); const b=buildSchedule176();
    const sideButtons=state.sideJob?[4,6,8,10,12,16].filter(h=>h<=maxSideHours176(state.age)).map(h=>`<button class="btn ${Number(state.sideJob.weeklyHours)===h?'green':''}" onclick="setSideJobHours176(${h})">${h}u/wk bijbaan</button>`).join(''):'<div class="card">Geen bijbaan actief.</div>';
    const jobType=state.job?classifyJob176(state.job):null;
    const workOptions=state.job?([16,24,28,32,36,40].filter(h=>h<=maxPrimaryHours176(jobType,state.age)).map(h=>`<button class="btn ${Number(state.job.weeklyHours)===h?'green':''}" onclick="setPrimaryJobHours176(${h})">${h}u/wk werk</button>`).join('')):'<div class="card">Geen gewone/carrièrebaan actief.</div>';
    showModal(`<div class="modalTop"><div class="avatar">🕒</div><div class="modalTitle">Tijdindeling 17.6</div></div><div class="modalBody">
      <div class="card"><b>Weekdruk:</b> ${b.obligations}u verplichtingen<br><b>Vrije/rustruimte:</b> ${b.freeScore}/100<br><b>Beoordeling:</b> ${esc(b.pressureLabel)}<br><br>School/studie ${b.school}u · bijbaan ${b.side}u · gewone/carrièrebaan ${b.work}u · sport ${b.sport}u · business ${b.business}u.</div>
      <div class="section">Bijbaanuren</div>${sideButtons}
      <div class="section">Gewone/carrièrebaan uren</div>${workOptions}
      <div class="card mini">Regel: onder 18 blijft school hoofdactiviteit. Te veel uren geeft stress, minder Smarts/schoolfocus en minder stamina.</div>
      <button class="btn alt" onclick="careerHub176()">Terug</button>
    </div>`);
  };
  window.setSideJobHours176=function(h){ ensureWork176(); if(!state.sideJob) return toast('Geen bijbaan.'); const max=maxSideHours176(state.age); if(h>max) return toast('Te veel uren voor je leeftijd. Max: '+max+'u/wk.'); state.sideJob.weeklyHours=h; state.sideJob.hours=h; normalizeJob176(state.sideJob); saveRender(); timeBudget176(); };
  window.setPrimaryJobHours176=function(h){ ensureWork176(); if(!state.job) return toast('Geen gewone/carrièrebaan.'); const type=classifyJob176(state.job), max=maxPrimaryHours176(type,state.age); if(h>max) return toast('Te veel uren. Max: '+max+'u/wk.'); state.job.weeklyHours=h; state.job.hours=h; normalizeJob176(state.job); saveRender(); timeBudget176(); };

  window.careerActions176=function(){
    ensureWork176();
    const side=state.sideJob?`<button class="btn" onclick="sideJobAction176('reliable')">🧃 Betrouwbaar zijn bij bijbaan</button><button class="btn" onclick="sideJobAction176('less')">🧘 Bijbaan rustig houden</button>`:'';
    const primary=state.job?`<button class="btn" onclick="careerDoAction172 ? careerDoAction172('hard') : toast('Werkactie niet gevonden')">💪 Hard werken</button><button class="btn" onclick="careerDoAction172 ? careerDoAction172('network') : toast('Werkactie niet gevonden')">🤝 Netwerken</button><button class="btn" onclick="careerDoAction172 ? careerDoAction172('balance') : toast('Werkactie niet gevonden')">🧘 Rustiger werken</button>`:'';
    showModal(`<div class="modalTop"><div class="avatar">🧠</div><div class="modalTitle">Werkacties 17.6</div></div><div class="modalBody">${currentSummary176()}${side||''}${primary||''}<button class="btn" onclick="timeBudget176()">🕒 Uren aanpassen</button><button class="btn alt" onclick="careerHub176()">Terug</button></div>`);
  };
  window.careerActions172=window.careerActions176;
  window.sideJobAction176=function(kind){
    ensureWork176(); if(!state.sideJob) return toast('Geen bijbaan.');
    if(kind==='reliable'){ state.sideJob.performance=clamp100((state.sideJob.performance||50)+rnd(4,9)); state.sideJob.stress=clamp100((state.sideJob.stress||8)+rnd(1,4)); closeModal(); act('Bijbaan', 'Ik was betrouwbaar bij mijn bijbaan. Kleine verantwoordelijkheid, geen volwassen carrière-drama.', {Smarts:1,Happiness:1,Stamina:-2}, rnd(10,60),'good'); }
    else { state.sideJob.stress=clamp100((state.sideJob.stress||8)-rnd(3,7)); closeModal(); act('Bijbaan','Ik hield mijn bijbaan bewust klein zodat school/rust niet kapotging.',{Happiness:3,Stamina:3},0,'good'); }
    saveRender();
  };
  window.quitWork176=function(){
    ensureWork176();
    const buttons=[];
    if(state.sideJob) buttons.push(`<button class="btn red" onclick="stopSideJob176()">Stop bijbaan: ${esc(state.sideJob.title)}</button>`);
    if(state.job) buttons.push(`<button class="btn red" onclick="stopPrimaryJob176()">Stop baan: ${esc(state.job.title)}</button>`);
    showModal(`<div class="modalTop"><div class="avatar">🚪</div><div class="modalTitle">Werk stoppen</div></div><div class="modalBody">${buttons.join('')||'<div class="card">Je hebt geen werk om te stoppen.</div>'}<button class="btn alt" onclick="careerHub176()">Terug</button></div>`);
  };
  window.stopSideJob176=function(){ const old=state.sideJob?.title||'bijbaan'; state.sideJob=null; closeModal(); act('Bijbaan',`Ik stopte met mijn bijbaan als ${esc(old)}.`,{Happiness:rnd(-1,3),Stamina:3},0,'warn'); saveRender(); };
  window.stopPrimaryJob176=function(){ const old=state.job?.title||'baan'; state.job=null; state.jobYears=0; state.careerLevel=0; closeModal(); act('Werk',`Ik nam ontslag als ${esc(old)}.`,{Happiness:rnd(-3,4)},0,'warn'); saveRender(); };

  // Make old life screen buttons point to the new hub as much as possible.
  const oldLife176=window.lifeHTML || (typeof lifeHTML==='function'?lifeHTML:null);
  if(oldLife176){
    window.lifeHTML=function(){
      let h=oldLife176.apply(this,arguments);
      try{ h=h.replace(/onclick="careerHub172\(\)"/g,'onclick="careerHub176()"').replace(/onclick="workScreen\(\)"/g,'onclick="careerHub176()"'); }
      catch(e){}
      return h;
    };
    try{ lifeHTML=window.lifeHTML; }catch(e){}
  }

  const oldRender176=window.render || (typeof render==='function'?render:null);
  window.render=function(){ try{ normalizeJobs176(); if(hasState()) ensureWork176(); }catch(e){} return oldRender176?oldRender176.apply(this,arguments):null; };
  try{ render=window.render; }catch(e){}

  normalizeJobs176();
  setTimeout(()=>{ try{ if(hasState()){ ensureWork176(); saveRender(); } }catch(e){ console.warn('[v17.6 init]', e); } }, 650);
  window.BITZ_SYSTEMS=window.BITZ_SYSTEMS||{};
  window.BITZ_SYSTEMS.jobSeparationTime={version:VERSION, principle:'Bijbaan staat los van gewone baan/carrièrebaan; tijdindeling bepaalt stress, schoolfocus en realistische uren.'};
  console.info('[BitzLife] Job Separation + Time System '+VERSION+' loaded');
})();
