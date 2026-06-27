
/* v21.5 Childhood Activities Restore
   Restores child-only activities that became hidden after the Activities Master Router sorting.
   Keeps the clean master categories, but adds Kindertijd & Spelen hub and visible doctor/play rows.
*/
(function(){
  function exists215(name){
    try{return typeof window[name]==='function' || typeof eval(name)==='function'}catch(e){return false}
  }
  function rr215(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function section215(t){return `<div class="section">${t}</div>`}
  function card215(h){return `<div class="card">${h}</div>`}
  function modal215(icon,title,body){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  }
  function age215(){return (state&&state.age)||0}
  function isChild215(){return age215()<14}
  function isSchoolKid215(){return age215()>=4 && age215()<18}
  function pick215(arr){try{return pick(arr)}catch(e){return arr[Math.floor(Math.random()*arr.length)]}}
  function action215(title,text,stats,cash=0,type='good'){
    try{closeModal()}catch(e){}
    try{return action(title,text,stats,cash,type)}catch(e){
      try{applyStats(stats||{})}catch(_){}
      if(cash)state.money=(state.money||0)+cash;
      try{addLog(`<b>${title}</b><br>${text}`+(stats?`<br><span class="mini">Effect: ${Object.keys(stats).map(k=>k+' '+(stats[k]>0?'+':'')+stats[k]).join(' · ')}</span>`:''),type,false);safeSave();render()}catch(_){}
    }
  }

  window.childhoodPlayHub215=function(){
    let h=card215(`<b>Kindertijd & Spelen</b><br>Leeftijd: ${age215()} jaar<br>Hier staan de kinderactiviteiten die door het sorteren te ver waren weggevallen.`);
    h+=section215('Buiten spelen');
    h+=rr215('🌳','Buiten spelen','Rennen, klimmen, frisse lucht en happiness','childOutdoorPlay215()',age215()>=14);
    h+=rr215('🙈','Verstoppertje','Tot 14 jaar: spelen, bewegen en kleine events','playHideSeek()',age215()>=14 || !exists215('playHideSeek'));
    h+=rr215('🏃','Tikkertje','Tot 14 jaar: rennen met kinderen','playTag()',age215()>=14 || !exists215('playTag'));
    h+=rr215('⚽','Voetbal buiten','Kinderen én volwassenen: fitheid/sporttalent omhoog','playFootball()',!exists215('playFootball'));
    h+=rr215('🛝','Speeltuin','Kindvriendelijke buitenactiviteit','playground215()',age215()>=13);
    h+=section215('Schoolplein & vriendjes');
    h+=rr215('🏫','Schoolplein spelen','Alleen schoolleeftijd: social en happiness','schoolyardPlay215()',!isSchoolKid215());
    h+=rr215('🧒','Met vriendjes spelen','Speel met buurtkinderen/classmates','playWithKids215()',age215()>=14);
    h+=section215('Rustig / thuis');
    h+=rr215('🧸','Speelgoed spelen','Voor baby/peuter/kind, rustig geluk','toyPlay215()',age215()>=10);
    h+=rr215('📺','Kinder-tv kijken','Rustige activiteit, happiness en stamina','kidsTv215()',age215()>=13);
    modal215('🧒','Kindertijd & Spelen',h);
  };

  window.childOutdoorPlay215=function(){
    if(age215()>=14)return toast('Buiten spelen op deze manier is vooral voor kinderen.');
    const lines=[
      'Ik speelde buiten tot mijn wangen warm waren van het rennen.',
      'Ik rende rond buiten en vergat even alles.',
      'Ik klom, rende en speelde buiten met kinderen uit de buurt.',
      'Ik speelde buiten en kwam vies maar blij thuis.'
    ];
    action215('Buiten spelen',pick215(lines),{Happiness:6,Health:3,Fitness:3,Stamina:-6},0,'good');
  };
  window.playground215=function(){
    if(age215()>=13)return toast('De speeltuin is vooral leuk als kind.');
    const lines=[
      'Ik ging naar de speeltuin en voelde me even koning van de glijbaan.',
      'Ik speelde in de speeltuin en maakte bijna ruzie om de schommel.',
      'Ik klom in het klimrek en voelde me dapper.',
      'Ik rende door de speeltuin en werd vrolijk moe.'
    ];
    action215('Speeltuin',pick215(lines),{Happiness:7,Health:2,Fitness:2,Stamina:-5},0,'good');
  };
  window.schoolyardPlay215=function(){
    if(!isSchoolKid215())return toast('Schoolplein spelen kan alleen in schoolleeftijd.');
    const lines=[
      'Ik speelde op het schoolplein en voelde me meer onderdeel van de klas.',
      'Op het schoolplein speelde ik met andere kinderen. Het ging niet perfect, maar wel gezellig.',
      'Ik rende op het schoolplein en vergat bijna dat de les weer begon.',
      'Ik speelde op het schoolplein en leerde wie aardig was en wie vooral stoer deed.'
    ];
    action215('Schoolplein',pick215(lines),{Happiness:5,Social:2,Stamina:-4,Smarts:1},0,'good');
  };
  window.playWithKids215=function(){
    if(age215()>=14)return toast('Met vriendjes spelen is vooral voor kinderen.');
    let names=[];
    try{names=(state.school?.classmates||[]).map(x=>x.name).filter(Boolean)}catch(e){}
    const n=names.length?pick215(names):pick215(['een buurkind','een klasgenoot','een vriendje uit de buurt','een kind van school']);
    const lines=[
      `Ik speelde met ${n}. We maakten domme regels en namen ze veel te serieus.`,
      `Ik speelde met ${n} en we hadden meer lol dan verwacht.`,
      `Ik speelde buiten met ${n}. Daarna was ik kapot maar blij.`,
      `${n} kwam spelen. We deden alsof we een heel avontuur hadden.`
    ];
    action215('Met vriendjes spelen',pick215(lines),{Happiness:6,Social:3,Stamina:-5},0,'good');
  };
  window.toyPlay215=function(){
    if(age215()>=10)return toast('Speelgoed spelen is vooral voor jonge kinderen.');
    const lines=[
      'Ik speelde met speelgoed en was volledig in mijn eigen wereld.',
      'Ik speelde rustig met speelgoed. Niet spectaculair, wel fijn.',
      'Ik bouwde iets met speelgoed en was trots alsof het een meesterwerk was.',
      'Ik speelde thuis en voelde me veilig.'
    ];
    action215('Speelgoed',pick215(lines),{Happiness:5,Smarts:1,Stamina:-2},0,'good');
  };
  window.kidsTv215=function(){
    if(age215()>=13)return toast('Kinder-tv is vooral voor kinderen.');
    const lines=[
      'Ik keek kinder-tv en zong het liedje de rest van de dag.',
      'Ik keek een tekenfilm en voelde me rustig.',
      'Ik keek kinder-tv. Mijn hoofd werd leeg en blij.',
      'Ik keek een aflevering die ik eigenlijk al kende.'
    ];
    action215('Kinder-tv',pick215(lines),{Happiness:4,Stamina:3,Smarts:-1},0,'good');
  };

  // A clearer doctor hub row and fallback. Existing doctorVisit is kept; if absent use simple treatment.
  window.doctorHub215=function(){
    let h=card215(`<b>Dokter</b><br>Gezondheid verbeteren, ziekte checken en herstel. Minderjarigen: ouders regelen/betalen meestal.`);
    h+=rr215('🏥','Naar de dokter','Open bestaande dokter/gezondheid systeem','doctorVisit()',!exists215('doctorVisit'));
    h+=rr215('🩹','Simpele check-up','Fallback kleine behandeling','simpleDoctorCheck215()');
    if(exists215('mentalHealthScreen'))h+=rr215('🧠','Mental Health','Stress, trauma en herstel','mentalHealthScreen()');
    modal215('🏥','Dokter / Health',h);
  };
  window.simpleDoctorCheck215=function(){
    const minor=age215()<18;
    const cost=minor?0:-80;
    action215('Dokter',minor?'Mijn ouders regelden een simpele dokterscheck. Ik voelde me iets beter.':'Ik ging naar een simpele dokterscheck. Niet spannend, wel nuttig.',{Health:6,Stamina:3,Happiness:minor?1:0},cost,'good');
  };

  // Patch health hub: add Kindertijd + clear Doctor even if doctorScreen was missing.
  const oldHealth215 = window.healthLooksHub204 || null;
  if(oldHealth215 && !oldHealth215.__childRestore215){
    window.healthLooksHub204=function(){
      let h=card215('<b>Gezondheid & Uiterlijk</b><br>Health, stamina, looks, mental health, kapper en kinderactiviteiten staan hier.');
      if(age215()<14){
        h+=section215('Kindertijd');
        h+=rr215('🧒','Kindertijd & Spelen','Buiten spelen, verstoppertje, tikkertje, speeltuin en schoolplein','childhoodPlayHub215()');
      }
      h+=section215('Gezondheid');
      h+=rr215('🏥','Dokter','Gezondheid verbeteren en check-up','doctorHub215()');
      h+=rr215('💪',age215()<12?'Sport / buiten bewegen':'Gym / Sport basis','Fitness, stamina en health trainen','gymScreen()',!exists215('gymScreen'));
      if(exists215('mentalHealthScreen'))h+=rr215('🧠','Mental Health','Stress, trauma, burn-out en herstel','mentalHealthScreen()');
      h+=section215('Uiterlijk');
      h+=rr215('💈','Kapper','Kapsel/haarkleur wijzigen; huid/genetica blijft gelijk','barberShop199()',!exists215('barberShop199'));
      if(exists215('appearanceProfile199'))h+=rr215('🧬','Appearance profiel','Genetisch uiterlijk en avatar bekijken','appearanceProfile199()');
      modal215('💪','Gezondheid & Uiterlijk',h);
    };
    window.healthLooksHub204.__childRestore215=true;
  }

  // Patch work/school hub so schoolyard/child play is also reachable through School.
  const oldWorkSchool215 = window.workSchoolHub204 || null;
  if(oldWorkSchool215 && !oldWorkSchool215.__childRestore215){
    window.workSchoolHub204=function(){
      let h=card215('<b>Werk & School</b><br>Alles rond opleiding, school, baan, carrière en kind-school activiteiten.');
      h+=section215('School & opleiding');
      h+=rr215('🎓','Education','School, MBO/HBO/uni, studie en schoolacties','educationScreen()',!exists215('educationScreen'));
      if(exists215('schoolScreen'))h+=rr215('🏫','School / klas','Klasgenoten, leraar en schoolacties','schoolScreen()');
      if(isSchoolKid215())h+=rr215('🏫','Schoolplein spelen','Spelen met andere kinderen op school','schoolyardPlay215()');
      if(age215()<14)h+=rr215('🧒','Kindertijd & Spelen','Buiten spelen, verstoppertje, tikkertje en vriendjes','childhoodPlayHub215()');
      h+=section215('Werk');
      h+=rr215('💼','Work','Baan zoeken, werken, ontslag en carrière','workScreen()',!exists215('workScreen'));
      if(exists215('careerHub173'))h+=rr215('📈','Carrière progressie','Performance, promotie, stress en reputatie','careerHub173()');
      if(exists215('timeSystemHub176'))h+=rr215('🕒','Tijdschema / uren','Uren, stress en weekindeling','timeSystemHub176()');
      modal215('🎓','Werk & School',h);
    };
    window.workSchoolHub204.__childRestore215=true;
  }

  // Patch main activities list to show child hub directly when age <14.
  const oldMaster215 = window.masterActivities204 || null;
  if(oldMaster215 && !oldMaster215.__childRestore215){
    window.masterActivities204=function(){
      let h=oldMaster215.apply(this,arguments);
      if(age215()<14 && !String(h).includes('childhoodPlayHub215')){
        const insert = section215('Kindertijd') + rr215('🧒','Kindertijd & Spelen','Buiten spelen, verstoppertje, tikkertje, speeltuin en schoolplein','childhoodPlayHub215()');
        h = String(h).replace(section215('Activiteiten'), section215('Activiteiten') + insert);
      }
      return h;
    };
    window.masterActivities204.__childRestore215=true;
    // screenHTML from v204 calls masterActivities204, so no need to replace activitiesHTML separately, but do it anyway.
    window.activitiesHTML=function(){return window.masterActivities204()};
    try{activitiesHTML=window.activitiesHTML}catch(e){}
  }

  // Also add a report explaining what was recovered.
  window.lostActivitiesReport215=function(){
    const recovered=[
      ['🏥','Dokter','Bestond nog als doctorVisit(), maar was minder zichtbaar omdat health hub alleen doctorScreen checkte. Hersteld via doctorHub215().'],
      ['⚽','Buiten spelen','Bestond in gymScreen() als gymAction("play") voor onder 12, maar stond te diep. Hersteld in Kindertijd hub.'],
      ['🙈','Verstoppertje','Bestond als playHideSeek(), maar verdween uit hoofdactiviteiten door router. Hersteld.'],
      ['🏃','Tikkertje','Bestond als playTag(), maar verdween uit hoofdactiviteiten door router. Hersteld.'],
      ['⚽','Voetbal buiten','Bestond als playFootball(), hersteld in Kindertijd hub.'],
      ['🚶','Wandelen','Bestond als walkScreen() vanaf 8 jaar, blijft bereikbaar via bestaande systemen en kan later apart onder buiten toegevoegd worden.'],
      ['🛝','Speeltuin','Was vooral life text/event, nu als echte actie playground215 toegevoegd.'],
      ['🏫','Schoolplein','Was vooral life text/event, nu als echte actie schoolyardPlay215 toegevoegd.']
    ];
    let h=card215('<b>Herstelde functies na sorteren</b><br>Dit zijn geen dubbele oude combat/DLC/business rows, maar kinder/health functies die terecht terug moesten komen.');
    h+=recovered.map(x=>card215(`<b>${x[0]} ${x[1]}</b><br>${x[2]}`)).join('');
    modal215('🛠️','Herstelde activiteiten',h);
  };

  // Add report to Legacy/Status debug hub if v204 exists.
  const oldLegacy215 = window.legacyStatusMasterHub204 || null;
  if(oldLegacy215 && !oldLegacy215.__childRestore215){
    window.legacyStatusMasterHub204=function(){
      oldLegacy215.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body && !body.innerHTML.includes('lostActivitiesReport215')){
            const btn=document.createElement('button');
            btn.className='btn';
            btn.setAttribute('onclick','lostActivitiesReport215()');
            btn.innerHTML='🧒 Herstelde kind-activiteiten<br><span class="mini">Bekijk wat door het sorteren verborgen was</span>';
            const alt=body.querySelector('.btn.alt');
            body.insertBefore(btn,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.legacyStatusMasterHub204.__childRestore215=true;
  }

  setTimeout(()=>{try{if(typeof safeSave==='function')safeSave(); if(typeof render==='function')render();}catch(e){}},250);
})();
