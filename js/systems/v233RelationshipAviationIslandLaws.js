
/* v23.3 Relationship Events + Aviation Travel + Island Laws
   - Integrated relationship events: unhappy partner, divorce threat, cheating, open relationship, triad request.
   - Aircraft icons fixed to airplane emojis, never person/baby sprites.
   - Own aircraft makes vacations cheaper and private-island travel cheaper/free.
   - Private island laws become a playable yearly system with consequences.
*/
(function(){
  function clamp233(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function r233(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick233(a){return a[Math.floor(Math.random()*a.length)]}
  function money233(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast233(t){try{toast(t)}catch(e){console.log(t)}}
  function apply233(s){try{applyStats(s||{})}catch(e){}}
  function saveRender233(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function rr233(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function sec233(t){return `<div class="section">${t}</div>`}
  function card233(h){return `<div class="card">${h}</div>`}
  function modal233(icon,title,body,back='closeModal()'){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody v233Body">${body}<button class="btn alt" onclick="${back}">Terug</button></div>`);
    setTimeout(fixClick233,0);
  }
  function result233(icon,title,txt,stats={},cash=0,type='good',back='closeModal()'){
    if(cash)state.money=(state.money||0)+cash;
    apply233(stats);
    try{addLog(`<b>${title}</b><br>${txt}`,type,false)}catch(e){}
    saveRender233();
    modal233(icon,title,card233(txt),back);
  }
  function fixClick233(){
    try{
      document.querySelectorAll('#modal .row,#modal .btn').forEach(el=>{
        el.style.pointerEvents='auto';
        el.style.touchAction='manipulation';
        el.style.position='relative';
        el.style.zIndex='9';
      });
    }catch(e){}
  }

  /* ======================= RELATIONSHIP EVENTS ======================= */
  function partner233(){return state&&state.partner?state.partner:null}
  function adult233(p){return !!(state && state.age>=18 && (!p || Number(p.age||18)>=18))}
  function rel233(p){return clamp233(p&&p.rel!=null?p.rel:50)}
  function addRel233(p,n){if(p)p.rel=clamp233((p.rel||50)+n)}
  function genderWord233(p){try{return genderLabel(p)}catch(e){return String(p?.gender||'').toLowerCase()==='female'?'Vrouw':'Man'}}
  function pron233(p){return genderWord233(p)==='Vrouw'?'Ze':'Hij'}
  function genAdult233(){
    const g=Math.random()<.5?'male':'female';
    let first='Alex', last='Smit';
    try{first=pick233(DATE_NAMES[g]||['Alex']); last=pick233(DATA.lastNames||['Smit'])}catch(e){}
    const p={name:first+' '+last,age:Math.max(18,state.age+r233(-4,7)),gender:g,rel:r233(35,75),source:'relationship_event'};
    try{p.icon=humanIcon(g,p.age)}catch(e){p.icon=g==='female'?'👩':'👨'}
    return p;
  }
  function ensureRel233(){
    state.relationship233=state.relationship233||{};
    const d=state.relationship233;
    d.type=d.type||'monogamy'; // monogamy/open/triad
    d.trust=clamp233(d.trust ?? rel233(state.partner));
    d.satisfaction=clamp233(d.satisfaction ?? rel233(state.partner));
    d.jealousy=clamp233(d.jealousy ?? r233(35,65));
    d.playerCheated=!!d.playerCheated;
    d.partnerCheated=!!d.partnerCheated;
    d.events=d.events||[];
    d.pending=d.pending||null;
    d.polyPartners=d.polyPartners||[];
    d.lastProcessAge=d.lastProcessAge??-99;
    return d;
  }
  window.ensureRelationship233=ensureRel233;

  function relationStatus233(){
    const p=partner233(); if(!p)return card233('Je hebt geen partner.');
    const d=ensureRel233();
    const type=d.type==='open'?'open relatie':d.type==='triad'?'driehoeksrelatie':'monogaam';
    return card233(`<b>${p.married?'Huwelijk':'Relatie'} met ${p.name}</b><br>
      Relatie: ${rel233(p)}%<br>
      Tevredenheid: ${d.satisfaction}%<br>
      Vertrouwen: ${d.trust}%<br>
      Jaloezie: ${d.jealousy}%<br>
      Relatievorm: ${type}<br>
      ${d.polyPartners.length?`Extra partner: ${d.polyPartners.map(x=>x.name).join(', ')}<br>`:''}
      ${d.pending?`<span style="color:#ffd166"><b>Open melding:</b> ${d.pending.title}</span><br>`:''}
      <span class="mini">Events komen vanzelf bij ouder worden als tevredenheid/vertrouwen laag is.</span>`);
  }
  function pushRelEvent233(type,title,text,severity='warn'){
    const d=ensureRel233();
    const ev={id:'ev'+Date.now()+Math.floor(Math.random()*999),age:state.age,type,title,text,severity};
    d.events.unshift(ev); d.events=d.events.slice(0,20); d.pending=ev;
    try{addLog(`<b>${title}</b><br>${text}`,severity,false)}catch(e){}
    return ev;
  }
  window.relationshipEventPopup233=function(id=null){
    const p=partner233(); if(!p)return toast233('Geen partner.');
    const d=ensureRel233();
    const ev=id?d.events.find(e=>e.id===id):d.pending;
    if(!ev)return partnerRelationshipTalk233();
    let h=relationStatus233()+card233(`<b>${ev.title}</b><br>${ev.text}`)+sec233('Keuzes');
    if(ev.type==='unhappy'){
      h+=rr233('💬','Serieus praten','Luister en los spanning op','resolveRelationshipEvent233("talk")');
      h+=rr233('🌹','Quality time',`${money233(150)} · relatie verbeteren`,'resolveRelationshipEvent233("date")',(state.money||0)<150);
      h+=rr233('🧠','Relatietherapie',`${money233(900)} · duur maar effectief`,'resolveRelationshipEvent233("therapy")',(state.money||0)<900);
    }
    if(ev.type==='divorce'){
      h+=rr233('🙏','Vecht voor relatie','Probeer scheiding te voorkomen','resolveRelationshipEvent233("fight")');
      h+=rr233('🧠','Therapie voorstellen',`${money233(1200)} · kans om relatie te redden`,'resolveRelationshipEvent233("therapy")',(state.money||0)<1200);
      h+=rr233('💔','Scheiding accepteren','Relatie beëindigen','resolveRelationshipEvent233("end")');
    }
    if(ev.type==='partner_affair'){
      h+=rr233('😡','Confronteren','Eis eerlijkheid','resolveRelationshipEvent233("confront")');
      h+=rr233('🤝','Vergeven met grenzen','Vertrouwen lager, relatie blijft','resolveRelationshipEvent233("forgive")');
      h+=rr233('🖤','Open relatie bespreken','Misschien minder geheimen, meer risico','resolveRelationshipEvent233("open")');
      h+=rr233('💔','Scheiden / uit elkaar','Stoppen na vreemdgaan','resolveRelationshipEvent233("end")');
    }
    if(ev.type==='player_caught'){
      h+=rr233('🙏','Excuses maken','Probeer vertrouwen terug te winnen','resolveRelationshipEvent233("apologize")');
      h+=rr233('🧠','Therapie voorstellen',`${money233(1200)} · red de relatie`,'resolveRelationshipEvent233("therapy")',(state.money||0)<1200);
      h+=rr233('🖤','Open relatie voorstellen','Alleen als partner ervoor openstaat','resolveRelationshipEvent233("open")');
      h+=rr233('💔','Breuk accepteren','Stoppen met relatie','resolveRelationshipEvent233("end")');
    }
    if(ev.type==='triad_request'){
      h+=rr233('🔺','Driehoeksrelatie proberen','Voeg een derde volwassen partner toe','resolveRelationshipEvent233("triad")');
      h+=rr233('🚫','Nee, monogaam blijven','Partner kan teleurgesteld raken','resolveRelationshipEvent233("reject_triad")');
      h+=rr233('💬','Eerst grenzen bespreken','Veiligere middenweg','resolveRelationshipEvent233("talk")');
    }
    h+=rr233('⏳','Later beslissen','Melding blijft in relatiegeschiedenis','closeModal()');
    modal233('💔','Relatie-event',h,'partnerScreen()');
  };
  window.resolveRelationshipEvent233=function(choice){
    const p=partner233(); if(!p)return;
    const d=ensureRel233();
    let txt='', type='good', stats={}, cash=0;
    function clear(){d.pending=null;d.lastResolvedAge=state.age;}
    if(choice==='talk'){const g=r233(5,14);addRel233(p,g);d.satisfaction=clamp233(d.satisfaction+g);d.trust=clamp233(d.trust+r233(2,8));txt=`Ik sprak eerlijk met ${p.name}. De spanning zakte iets.`;stats={Happiness:4,Smarts:1};clear();}
    if(choice==='date'){cash=-150;const g=r233(8,18);addRel233(p,g);d.satisfaction=clamp233(d.satisfaction+g);d.trust=clamp233(d.trust+r233(1,5));txt=`Ik maakte extra tijd voor ${p.name}. Dat hielp de relatie.`;stats={Happiness:7};clear();}
    if(choice==='therapy'){cash=-1200;if((state.money||0)<1200)return toast233('Niet genoeg geld.');const ok=Math.random()<.72;addRel233(p,ok?r233(12,26):r233(3,9));d.satisfaction=clamp233(d.satisfaction+(ok?r233(14,28):r233(4,10)));d.trust=clamp233(d.trust+(ok?r233(10,22):r233(3,8)));txt=ok?'Therapie hielp echt. We wilden het opnieuw proberen.':'Therapie hielp een beetje, maar het blijft broos.';stats={Happiness:ok?8:2,Smarts:2};type=ok?'good':'warn';clear();}
    if(choice==='fight'){const ok=Math.random()<(rel233(p)+d.trust+d.satisfaction)/270;if(ok){addRel233(p,r233(8,18));d.satisfaction=clamp233(d.satisfaction+r233(8,18));txt=`Ik vocht voor de relatie. ${p.name} wil nog niet scheiden.`;stats={Happiness:8};clear();}else{return endRel233(p.married?'scheiding':'breuk',`${p.name} wilde toch stoppen.`);}}
    if(choice==='end')return endRel233(p.married?'scheiding':'breuk',`Ik accepteerde dat het klaar was tussen mij en ${p.name}.`);
    if(choice==='confront'){d.partnerCheated=true;d.trust=clamp233(d.trust-r233(8,20));addRel233(p,-r233(5,14));txt=`Ik confronteerde ${p.name}. Er kwam eerlijkheid, maar het vertrouwen kreeg een klap.`;stats={Happiness:-8};type='warn';clear();}
    if(choice==='forgive'){d.partnerCheated=false;d.trust=clamp233(d.trust-r233(6,14));d.satisfaction=clamp233(d.satisfaction+r233(2,8));txt=`Ik vergaf ${p.name}, maar het vertrouwen is niet meteen terug.`;stats={Happiness:-2,Smarts:2};type='warn';clear();}
    if(choice==='apologize'){const ok=Math.random()<(d.trust+rel233(p))/190;if(ok){d.playerCheated=false;d.trust=clamp233(d.trust+r233(4,12));addRel233(p,r233(3,9));txt=`Ik bood excuses aan. ${p.name} was boos, maar wilde luisteren.`;stats={Happiness:1};type='warn';clear();}else{if(Math.random()<.40)return endRel233('breuk',`${p.name} kon mijn vreemdgaan niet accepteren.`);d.trust=clamp233(d.trust-r233(8,18));txt=`Mijn excuses kwamen slecht binnen. ${p.name} bleef woedend.`;stats={Happiness:-10};type='bad';clear();}}
    if(choice==='open'){const ok=Math.random()<((rel233(p)+d.trust-d.jealousy+35)/145);if(ok){d.type='open';d.trust=clamp233(d.trust+r233(4,10));d.satisfaction=clamp233(d.satisfaction+r233(3,10));txt=`We spraken duidelijke grenzen af voor een open relatie.`;stats={Happiness:5,Smarts:2};clear();}else{d.trust=clamp233(d.trust-r233(5,14));addRel233(p,-r233(4,12));txt=`${p.name} vond het voorstel kwetsend.`;stats={Happiness:-6};type='warn';clear();}}
    if(choice==='triad'){d.type='triad';if(!d.polyPartners.length)d.polyPartners.push(d.triadCandidate||genAdult233());d.satisfaction=clamp233(d.satisfaction+r233(4,12));d.trust=clamp233(d.trust+r233(2,8));d.jealousy=clamp233(d.jealousy-r233(3,10));txt=`We probeerden een driehoeksrelatie met ${d.polyPartners[0].name}. Dat vraagt veel communicatie.`;stats={Happiness:8,Smarts:2};clear();}
    if(choice==='reject_triad'){d.type='monogamy';d.satisfaction=clamp233(d.satisfaction-r233(5,14));addRel233(p,-r233(2,8));txt=`Ik wilde geen driehoeksrelatie. ${p.name} was teleurgesteld.`;stats={Happiness:-3};type='warn';clear();}
    result233('💔','Relatie',txt,stats,cash,type,'partnerScreen()');
  };
  function endRel233(kind,txt){
    const p=partner233(); if(!p)return;
    const d=ensureRel233();
    state.exes=state.exes||[];
    state.exes.push({name:p.name,age:p.age,gender:p.gender,rel:p.rel,married:!!p.married,reason:kind,endedAge:state.age,icon:p.icon});
    state.partner=null; d.pending=null; d.type='monogamy'; d.polyPartners=[]; d.playerCheated=false; d.partnerCheated=false;
    result233('💔',kind==='scheiding'?'Scheiding':'Relatie voorbij',txt,{Happiness:-18},0,'bad','closeModal()');
  }
  window.partnerRelationshipTalk233=function(){
    const p=partner233(); if(!p)return toast233('Geen partner.');
    const d=ensureRel233();
    let h=relationStatus233()+sec233('Relatiegesprek');
    h+=rr233('💬','Vraag hoe het gaat','Check tevredenheid en vertrouwen','relationshipTalkAction233("check")');
    h+=rr233('🌹','Quality time plannen',`${money233(120)} · relatie verbeteren`,'relationshipTalkAction233("quality")',(state.money||0)<120);
    h+=rr233('🧠','Relatietherapie',`${money233(900)} · helpt bij lage tevredenheid`,'relationshipTalkAction233("therapy")',(state.money||0)<900);
    h+=sec233('Relatievorm');
    h+=rr233('💍','Monogaam afspreken','Exclusieve relatie','relationshipTalkAction233("monogamy")');
    h+=rr233('🖤','Open relatie bespreken','Alleen als vertrouwen genoeg is','relationshipTalkAction233("open")');
    h+=rr233('🔺','Driehoeksrelatie bespreken','Mogelijk derde volwassen partner','relationshipTalkAction233("triad")');
    h+=sec233('Meldingen');
    h+=d.events.length?d.events.slice(0,6).map(ev=>rr233('🔔',ev.title,`Leeftijd ${ev.age} · ${ev.text.slice(0,70)}...`,`relationshipEventPopup233("${ev.id}")`)).join(''):card233('Nog geen grote relatie-events.');
    modal233('💬','Relatiegesprek',h,'partnerScreen()');
  };
  window.relationshipTalkAction233=function(kind){
    const p=partner233(), d=ensureRel233(); if(!p)return;
    let txt='', stats={}, cash=0, type='good';
    if(kind==='check'){txt=d.satisfaction<45?`${p.name} gaf toe niet gelukkig te zijn.`:d.trust<45?`${p.name} zei dat vertrouwen het probleem is.`:`${p.name} vindt dat het best goed gaat.`;stats={Smarts:1,Happiness:d.satisfaction>=50?3:-2};}
    if(kind==='quality'){cash=-120;addRel233(p,r233(5,12));d.satisfaction=clamp233(d.satisfaction+r233(6,15));d.trust=clamp233(d.trust+r233(1,5));txt=`Quality time met ${p.name} hielp.`;stats={Happiness:6};}
    if(kind==='therapy'){cash=-900;if((state.money||0)<900)return toast233('Niet genoeg geld.');addRel233(p,r233(8,18));d.satisfaction=clamp233(d.satisfaction+r233(10,22));d.trust=clamp233(d.trust+r233(8,18));txt=`Therapie gaf betere communicatie.`;stats={Happiness:5,Smarts:2};}
    if(kind==='monogamy'){d.type='monogamy';d.trust=clamp233(d.trust+r233(4,12));txt=`We spraken af monogaam te blijven.`;stats={Happiness:3,Smarts:1};}
    if(kind==='open'){const ok=Math.random()<((rel233(p)+d.trust-d.jealousy+30)/140);if(ok){d.type='open';txt=`We maakten afspraken voor een open relatie.`;d.trust=clamp233(d.trust+r233(3,8));stats={Happiness:5,Smarts:2};}else{txt=`${p.name} vond een open relatie geen goed idee.`;d.trust=clamp233(d.trust-r233(4,12));addRel233(p,-r233(2,8));stats={Happiness:-4};type='warn';}}
    if(kind==='triad'){const ok=Math.random()<((rel233(p)+d.satisfaction-d.jealousy+20)/150);if(ok){d.type='triad';if(!d.polyPartners.length)d.polyPartners.push(genAdult233());txt=`We besloten voorzichtig een driehoeksrelatie te proberen met ${d.polyPartners[0].name}.`;stats={Happiness:7,Smarts:2};}else{txt=`${p.name} wilde geen driehoeksrelatie.`;addRel233(p,-r233(3,9));d.satisfaction=clamp233(d.satisfaction-r233(2,8));stats={Happiness:-5};type='warn';}}
    result233('💬','Relatiegesprek',txt,stats,cash,type,'partnerRelationshipTalk233()');
  };
  window.playerCheat233=function(source='date',person=null){
    const p=partner233(); if(!p||!adult233(p))return false;
    const d=ensureRel233();
    if(d.type==='open'||d.type==='triad')return false;
    d.playerCheated=true; d.trust=clamp233(d.trust-r233(6,18)); d.satisfaction=clamp233(d.satisfaction-r233(3,12));
    const chance=(d.jealousy+60-d.trust)/170;
    if(Math.random()<chance){
      pushRelEvent233('player_caught','Betrapt op vreemdgaan',`${p.name} kwam achter mijn gedoe met ${person&&person.name?person.name:'iemand anders'}. ${pron233(p)} is boos en twijfelt aan de relatie.`,'bad');
      setTimeout(()=>relationshipEventPopup233(),100);
      return true;
    }
    try{addLog(`<b>Geheim</b><br>Ik ging over de grens buiten mijn relatie. ${p.name} weet het nog niet, maar vertrouwen voelt lager.`, 'warn', false)}catch(e){}
    return false;
  };
  window.processRelationshipYear233=function(force=false){
    const p=partner233(); if(!p||!adult233(p))return;
    const d=ensureRel233();
    if(!force && d.lastProcessAge===state.age)return;
    d.lastProcessAge=state.age;
    d.satisfaction=clamp233(d.satisfaction+(rel233(p)>70?r233(0,4):rel233(p)<35?-r233(4,10):r233(-4,3)));
    d.trust=clamp233(d.trust+(d.playerCheated?-r233(2,8):r233(-3,3)));
    if(d.pending)return;
    if(d.satisfaction<42 && Math.random()<.35){pushRelEvent233('unhappy','Partner ongelukkig',`${p.name} lijkt niet gelukkig en voelt zich te weinig gezien.`,'warn');return setTimeout(()=>relationshipEventPopup233(),120);}
    if(p.married && (d.satisfaction<28||rel233(p)<25||d.trust<25) && Math.random()<.42){pushRelEvent233('divorce','Scheiding dreigt',`${p.name} denkt aan scheiden omdat de relatie te slecht voelt.`,'bad');return setTimeout(()=>relationshipEventPopup233(),120);}
    if(d.type==='monogamy' && d.satisfaction<55 && d.trust<60 && Math.random()<Math.min(.30,(65-d.satisfaction)/140)){
      d.partnerCheated=true; d.trust=clamp233(d.trust-r233(10,24)); addRel233(p,-r233(5,14));
      const other=genAdult233();
      pushRelEvent233('partner_affair','Partner vreemdgegaan',`${p.name} heeft mogelijk iets met ${other.name}. ${pron233(p)} zegt dat het ingewikkeld ligt.`,'bad');
      return setTimeout(()=>relationshipEventPopup233(),120);
    }
    if(d.type==='monogamy' && rel233(p)>55 && d.satisfaction>45 && d.jealousy<58 && Math.random()<.08){
      d.triadCandidate=genAdult233();
      pushRelEvent233('triad_request','Voorstel driehoeksrelatie',`${p.name} staat open voor een driehoeksrelatie met ${d.triadCandidate.name}, maar alleen als jij dat ook wilt.`,'warn');
      return setTimeout(()=>relationshipEventPopup233(),120);
    }
  };
  const oldPartner233=window.partnerScreen||null;
  if(oldPartner233&&!oldPartner233.__rel233){
    window.partnerScreen=function(){
      oldPartner233.apply(this,arguments);
      setTimeout(()=>{
        try{
          const p=partner233(); if(!p)return;
          ensureRel233();
          const body=document.querySelector('#modal .modalBody');
          if(body&&!body.innerHTML.includes('partnerRelationshipTalk233')){
            const alt=body.querySelector('.btn.alt');
            const s=document.createElement('div');s.className='section';s.textContent='Relatie dynamiek';
            const wrap=document.createElement('div');
            wrap.innerHTML=rr233('💬','Relatiegesprek','Tevredenheid, vertrouwen, vreemdgaan/open relatie/events','partnerRelationshipTalk233()')+
              rr233('🔔','Open relatie-melding',ensureRel233().pending?'Er staat een event open':'Geen open melding','relationshipEventPopup233()',!ensureRel233().pending);
            body.insertBefore(s,alt||null);
            while(wrap.firstElementChild)body.insertBefore(wrap.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.partnerScreen.__rel233=true; try{partnerScreen=window.partnerScreen}catch(e){}
  }
  const oldAdultIntimacy233=window.adultIntimacy229||null;
  if(oldAdultIntimacy233&&!oldAdultIntimacy233.__rel233){
    window.adultIntimacy229=function(kind,idx,mode){
      let other=null; try{if(kind==='friend')other=state.friends&&state.friends[idx];if(kind==='classmate')other=state.school&&state.school.classmates&&state.school.classmates[idx];if(kind==='loveInterest')other=window._loveInterest;}catch(e){}
      const outside=partner233() && kind!=='partner' && adult233(other);
      const ret=oldAdultIntimacy233.apply(this,arguments);
      if(outside)setTimeout(()=>playerCheat233(kind,other),90);
      return ret;
    };
    window.adultIntimacy229.__rel233=true;
  }
  const oldResolveLove233=window.resolveLoveInterest||null;
  if(oldResolveLove233&&!oldResolveLove233.__rel233){
    window.resolveLoveInterest=function(mode){
      const p=window._loveInterest;
      const outside=partner233() && mode==='hook' && adult233(p);
      const ret=oldResolveLove233.apply(this,arguments);
      if(outside)setTimeout(()=>playerCheat233('hookup',p),90);
      return ret;
    };
    window.resolveLoveInterest.__rel233=true; try{resolveLoveInterest=window.resolveLoveInterest}catch(e){}
  }

  /* ======================= AVIATION ICONS + TRAVEL ======================= */
  const AIR_META233={
    cessna172:'🛩️', piperpa28:'🛩️', cirrussr22:'✈️', beechcraft:'✈️', pilatuspc12:'✈️', citationm2:'🛫', phenom300:'🛫', gulfstream:'🛬'
  };
  function ensureAviation233(){
    try{if(typeof ensureAviationIsland230==='function')ensureAviationIsland230()}catch(e){}
    state.aviation230=state.aviation230||{theory:0,flightHours:0,license:false,aircraft:[]};
    state.aviation230.aircraft=state.aviation230.aircraft||[];
    state.aviation230.aircraft.forEach(a=>{
      a.icon=AIR_META233[a.id] || (/gulfstream|jet/i.test(a.name||'')?'🛬':/citation|phenom/i.test(a.name||'')?'🛫':'✈️');
      delete a.appearance; delete a.avatarSpriteKey211; delete a.avatarSpriteKey212; delete a.avatarSpriteKey213; delete a.avatarSpriteKey218;
      a.condition=clamp233(a.condition??85,1,100); a.hours=Number(a.hours||0); a.value=Math.max(0,Math.round(a.value||a.price||0));
    });
    return state.aviation230;
  }
  window.ensureAviation233=ensureAviation233;
  function bestAircraft233(){
    const a=ensureAviation233().aircraft.filter(x=>x.condition>=35);
    if(!a.length)return null;
    return a.slice().sort((x,y)=>(y.value||0)-(x.value||0))[0];
  }
  function useAircraft233(baseCost=1000, purpose='vakantie'){
    const a=bestAircraft233();
    if(!a)return {aircraft:null,cost:baseCost,discount:0,txt:''};
    const factor=a.crew?.value?0.08:(/Gulfstream|Citation|Phenom|King Air|Pilatus/i.test(a.name||'')?0.10:0.18);
    const cost=Math.max(0,Math.round(baseCost*factor));
    a.condition=clamp233(a.condition-r233(1,5),1,100);
    const hrs=Math.round((1+r233(1,5))*10)/10;
    a.hours+=hrs; state.aviation230.flightHours=(state.aviation230.flightHours||0)+hrs;
    return {aircraft:a,cost,discount:baseCost-cost,txt:`<br>Eigen vliegtuig gebruikt: ${a.name}. Kosten werden ${money233(cost)} i.p.v. ${money233(baseCost)}. +${hrs} vlieguren.`};
  }
  window.useAircraftForTravel233=useAircraft233;

  const oldVacation233=window.vacation||(typeof vacation==='function'?vacation:null);
  if(oldVacation233&&!oldVacation233.__aviation233){
    window.vacation=function(){
      ensureAviation233();
      if(typeof VACATION_OPTIONS==='undefined')return oldVacation233.apply(this,arguments);
      const plane=bestAircraft233();
      let h=card233(`Kies waar je heen gaat. ${plane?`Je hebt een eigen vliegtuig (${plane.name}), dus reizen is goedkoper.`:'Zonder eigen vliegtuig betaal je normale reiskosten.'}`);
      h+=VACATION_OPTIONS.map((v,i)=>{
        const t=plane?useAircraftPreview233(v.cost):{cost:v.cost,label:`Kosten: ${money233(v.cost)}`};
        return `<button class="btn ${(state.money||0)<t.cost?'locked':''}" onclick="${(state.money||0)>=t.cost?`takeVacation(${i})`:''}">${v.name}<br><span class="mini">${t.label}</span></button>`;
      }).join('');
      showModal(`<div class="modalTop"><div class="avatar">✈️</div><div class="modalTitle">Vakantie</div></div><div class="modalBody">${h}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
    };
    window.vacation.__aviation233=true; try{vacation=window.vacation}catch(e){}
  }
  function useAircraftPreview233(cost){
    const plane=bestAircraft233();
    if(!plane)return {cost,label:`Kosten: ${money233(cost)}`};
    const factor=/Gulfstream|Citation|Phenom|King Air|Pilatus/i.test(plane.name||'')?0.10:0.18;
    const newCost=Math.max(0,Math.round(cost*factor));
    return {cost:newCost,label:`Eigen vliegtuig: ${money233(newCost)} i.p.v. ${money233(cost)}`};
  }
  const oldTakeVacation233=window.takeVacation||(typeof takeVacation==='function'?takeVacation:null);
  if(oldTakeVacation233&&!oldTakeVacation233.__aviation233){
    window.takeVacation=function(i){
      if(typeof VACATION_OPTIONS==='undefined')return oldTakeVacation233?oldTakeVacation233.apply(this,arguments):null;
      const v=VACATION_OPTIONS[i]; if(!v)return;
      const travel=useAircraft233(v.cost,'vakantie');
      if((state.money||0)<travel.cost)return toast233('Niet genoeg geld voor deze reis.');
      if(v.jamaica && typeof startJamaicaVacation==='function'){
        const clone=Object.assign({},v,{cost:travel.cost,txt:(v.txt||'Vakantie')+travel.txt});
        return startJamaicaVacation(clone);
      }
      closeModal();
      result233('✈️','Vakantie',(v.txt||'Ik ging op vakantie.')+travel.txt,(v.stats||{Happiness:8}),-travel.cost,'good','closeModal()');
    };
    window.takeVacation.__aviation233=true; try{takeVacation=window.takeVacation}catch(e){}
  }
  // Aircraft row DOM/icon cleanup
  function cleanupAircraftDom233(root=document){
    try{
      ensureAviation233().aircraft.forEach(a=>{
        root.querySelectorAll('.row').forEach(row=>{
          if((row.textContent||'').includes(a.name)){
            const ico=row.querySelector('.rIco'); if(ico)ico.innerHTML=a.icon||'✈️';
            row.querySelectorAll('img.headSprite206,.headSprite206,img').forEach(img=>{ if((row.textContent||'').includes(a.name)) img.replaceWith(document.createTextNode(a.icon||'✈️')); });
          }
        });
      });
    }catch(e){}
  }
  const oldItemIcon233=window.itemIcon||null;
  window.itemIcon=function(name){
    const s=String(name||'');
    if(/cessna|piper|cirrus|beechcraft|pilatus|citation|phenom|gulfstream|vliegtuig|aircraft|jet/i.test(s))return /gulfstream/i.test(s)?'🛬':/citation|phenom|jet/i.test(s)?'🛫':'✈️';
    return oldItemIcon233?oldItemIcon233.apply(this,arguments):'🎁';
  };
  try{itemIcon=window.itemIcon}catch(e){}
  const oldRender233=window.render||(typeof render==='function'?render:null);
  if(oldRender233&&!oldRender233.__aviationRel233){
    window.render=function(){try{ensureAviation233()}catch(e){}const ret=oldRender233.apply(this,arguments);setTimeout(()=>cleanupAircraftDom233(document),0);return ret};
    window.render.__aviationRel233=true; try{render=window.render}catch(e){}
  }

  /* ======================= PRIVATE ISLAND LAWS ======================= */
  const LAW_OPTIONS233={
    tax:[['low','Lage belasting','Meer rijke bewoners/toerisme, minder directe inkomsten'],['normal','Normale belasting','Balans tussen inkomsten en stabiliteit'],['high','Hoge belasting','Meer inkomsten, minder groei/stabiliteit'],['tax_haven','Tax haven','Veel rijke bewoners/bedrijven, kans op schandaal']],
    immigration:[['closed','Gesloten','Weinig groei, hoge controle'],['strict','Streng','Alleen rijke/betrouwbare bewoners'],['skilled','Skilled workers','Groei via werknemers en specialisten'],['open','Open immigratie','Snelle groei, meer risico/drukte']],
    business:[['permit','Vergunningplicht','Rustig en gecontroleerd'],['free_market','Vrije markt','Meer winkels/inkomsten, minder stabiliteit'],['luxury_only','Alleen luxe bedrijven','Rijke toeristen, hoge prijzen'],['state_owned','Eilandbedrijven staatsbezit','Meer controle, minder ondernemers']],
    nightlife:[['quiet','Rustig eiland','Stabiliteit omhoog, toerisme lager'],['normal','Normaal nachtleven','Balans'],['party','Party eiland','Veel toerisme, meer incidenten'],['elite','Elite members clubs','Hoge inkomsten, minder massatoerisme']],
    gambling:[['banned','Gokken verboden','Rust en stabiliteit'],['licensed','Casino met vergunning','Inkomsten en risico'],['free','Vrij gokken','Veel geld, veel chaos']],
    environment:[['protected','Natuur beschermd','Waarde/stabiliteit omhoog, groei langzamer'],['balanced','Gebalanceerd','Normale ontwikkeling'],['business','Business first','Meer bouw/inkomsten, milieu/stabiliteit omlaag']],
    security:[['normal','Normale security','Goedkoop, gemiddeld risico'],['strict','Strenge security','Duurder, stabieler'],['private_guard','Private guard force','Heel stabiel, zeer duur, minder vrijheid']],
    citizenship:[['none','Geen burgerschap','Alleen gasten/werknemers'],['residency','Verblijfsvergunningen','Populatie kan groeien'],['paid','Betaald burgerschap','Veel inkomsten, reputatierisico']]
  };
  function ensureIslandLaws233(){
    try{if(typeof ensureAviationIsland230==='function')ensureAviationIsland230()}catch(e){}
    const i=state.privateIsland230; if(!i)return null;
    i.laws=i.laws||{};
    i.laws.tax=i.laws.tax||'normal';
    i.laws.immigration=i.immigration||i.laws.immigration||'strict';
    i.laws.business=i.laws.business||'permit';
    i.laws.nightlife=i.laws.nightlife||'normal';
    i.laws.gambling=i.laws.gambling||'banned';
    i.laws.environment=i.laws.environment||i.laws.environment||'protected';
    i.laws.security=i.laws.security||i.laws.security||'normal';
    i.laws.citizenship=i.laws.citizenship||'none';
    i.immigration=i.laws.immigration;
    i.lawHistory=i.lawHistory||[];
    i.lastLawEvent=i.lastLawEvent||'';
    return i;
  }
  function islandLawScore233(){
    const i=ensureIslandLaws233(); if(!i)return {income:0,cost:0,tourism:0,stability:0,growth:0,risk:0};
    const l=i.laws; let s={income:0,cost:0,tourism:0,stability:0,growth:0,risk:0,value:0};
    if(l.tax==='low'){s.income-=10;s.tourism+=6;s.growth+=2}
    if(l.tax==='high'){s.income+=22;s.stability-=5;s.growth-=2}
    if(l.tax==='tax_haven'){s.income+=35;s.tourism+=10;s.risk+=16;s.stability-=4;s.growth+=4}
    if(l.immigration==='closed'){s.stability+=10;s.growth-=5}
    if(l.immigration==='skilled'){s.growth+=8;s.income+=8;s.cost+=4}
    if(l.immigration==='open'){s.growth+=20;s.income+=12;s.risk+=12;s.stability-=10;s.cost+=8}
    if(l.business==='free_market'){s.income+=18;s.tourism+=8;s.risk+=8;s.stability-=5}
    if(l.business==='luxury_only'){s.income+=22;s.tourism+=12;s.growth-=2;s.stability+=2}
    if(l.business==='state_owned'){s.income+=10;s.stability+=8;s.growth-=4;s.cost+=8}
    if(l.nightlife==='quiet'){s.stability+=10;s.tourism-=8}
    if(l.nightlife==='party'){s.tourism+=22;s.income+=18;s.risk+=15;s.stability-=12}
    if(l.nightlife==='elite'){s.tourism+=8;s.income+=25;s.risk+=5}
    if(l.gambling==='licensed'){s.income+=18;s.risk+=8;s.tourism+=8}
    if(l.gambling==='free'){s.income+=35;s.risk+=22;s.stability-=12;s.tourism+=14}
    if(l.environment==='protected'){s.value+=3;s.stability+=8;s.growth-=4;s.tourism+=3}
    if(l.environment==='business'){s.income+=16;s.growth+=4;s.stability-=12;s.risk+=6}
    if(l.security==='strict'){s.cost+=14;s.stability+=14;s.risk-=8}
    if(l.security==='private_guard'){s.cost+=28;s.stability+=24;s.risk-=12;s.tourism-=3}
    if(l.citizenship==='residency'){s.growth+=8;s.cost+=4}
    if(l.citizenship==='paid'){s.income+=24;s.growth+=5;s.risk+=14;s.stability-=5}
    return s;
  }
  function islandLawCard233(){
    const i=ensureIslandLaws233(); if(!i)return card233('Je hebt nog geen privé-eiland.');
    const s=islandLawScore233();
    return card233(`<b>Wetboek privé-eiland</b><br>
      Belasting: ${i.laws.tax}<br>
      Immigratie: ${i.laws.immigration}<br>
      Business: ${i.laws.business}<br>
      Nachtleven: ${i.laws.nightlife}<br>
      Gokken: ${i.laws.gambling}<br>
      Milieu: ${i.laws.environment}<br>
      Security: ${i.laws.security}<br>
      Burgerschap: ${i.laws.citizenship}<br><br>
      Effecten: inkomsten ${s.income>=0?'+':''}${s.income}% · toerisme ${s.tourism>=0?'+':''}${s.tourism} · stabiliteit ${s.stability>=0?'+':''}${s.stability} · groei ${s.growth>=0?'+':''}${s.growth} · risico ${s.risk>=0?'+':''}${s.risk}`);
  }
  window.islandLaws230=function(){return islandLaws233()};
  window.islandLaws233=function(){
    const i=ensureIslandLaws233(); if(!i)return toast233('Koop eerst een privé-eiland.');
    let h=islandLawCard233()+sec233('Wet-categorieën');
    Object.keys(LAW_OPTIONS233).forEach(k=>{
      const current=i.laws[k];
      h+=rr233('⚖️',lawTitle233(k),`Huidig: ${current} · klik om opties te kiezen`,`islandLawCategory233("${k}")`);
    });
    h+=sec233('Spelen met wetten');
    h+=rr233('📊','Simuleer jaar met huidige wetten','Inkomsten, kosten, groei, stabiliteit en events','processIslandYear230(true)');
    h+=rr233('🧪','Wet-effect test','Bekijk effecten zonder jaar te skippen','islandLawTest233()');
    h+=i.lawHistory&&i.lawHistory.length?sec233('Recente wet-events')+card233(i.lawHistory.slice(-5).join('<br>')):'';
    modal233('⚖️','Eilandwetten',h,'privateIslandHub230()');
  };
  function lawTitle233(k){return {tax:'Belasting',immigration:'Immigratie',business:'Businessregels',nightlife:'Nachtleven',gambling:'Gokken/casino',environment:'Milieu/bouw',security:'Security/politie',citizenship:'Burgerschap'}[k]||k}
  window.islandLawCategory233=function(k){
    const i=ensureIslandLaws233(); if(!i)return;
    let h=islandLawCard233()+sec233(lawTitle233(k));
    (LAW_OPTIONS233[k]||[]).forEach(o=>h+=rr233('⚖️',o[1],o[2],`setIslandLaw233("${k}","${o[0]}")`));
    modal233('⚖️',lawTitle233(k),h,'islandLaws233()');
  };
  window.setIslandLaw233=function(k,v){
    const i=ensureIslandLaws233(); if(!i)return;
    i.laws[k]=v; if(k==='immigration')i.immigration=v;
    i.lawHistory=i.lawHistory||[]; i.lawHistory.push(`Leeftijd ${state.age}: ${lawTitle233(k)} → ${v}`); i.lawHistory=i.lawHistory.slice(-12);
    result233('⚖️','Wet aangepast',`${lawTitle233(k)} staat nu op: <b>${v}</b>. De gevolgen worden jaarlijks verwerkt.`,{Smarts:2},0,'good','islandLaws233()');
  };
  window.setIslandLaw230=function(k,v){return setIslandLaw233(k,v)};
  window.islandLawTest233=function(){
    const s=islandLawScore233();
    modal233('🧪','Wet-effect test',card233(`Met je huidige wetten verwacht je ongeveer:<br>
      Inkomstenmodifier: ${s.income>=0?'+':''}${s.income}%<br>
      Extra kosten: ${s.cost}%<br>
      Toerisme: ${s.tourism>=0?'+':''}${s.tourism}<br>
      Stabiliteit: ${s.stability>=0?'+':''}${s.stability}<br>
      Populatiegroei: ${s.growth>=0?'+':''}${s.growth}<br>
      Schandaal/incident-risico: ${s.risk>=0?'+':''}${s.risk}`),'islandLaws233()');
  };
  window.travelPrivateIsland233=function(){
    const i=state.privateIsland230; if(!i)return toast233('Je hebt nog geen privé-eiland.');
    const plane=bestAircraft233();
    const hasAirstrip=!!(i.buildings&&i.buildings.airstrip);
    let cost=20000, txt='Ik reisde met charter/boot naar mijn privé-eiland.';
    if(plane && hasAirstrip){cost=0; plane.condition=clamp233(plane.condition-r233(1,4)); plane.hours+=r233(2,6); txt=`Ik vloog gratis met mijn eigen ${plane.name} naar de landingsbaan op mijn privé-eiland.`;}
    else if(plane && !hasAirstrip){cost=2500; plane.condition=clamp233(plane.condition-r233(1,3)); txt=`Ik vloog met mijn eigen ${plane.name} naar de dichtstbijzijnde luchthaven en nam transfer/boot naar mijn eiland.`;}
    if((state.money||0)<cost)return toast233('Niet genoeg geld voor reis naar eiland.');
    state.money-=cost;
    state.vacation='privateIsland';
    result233('🏝️','Naar privé-eiland',`${txt}<br>Kosten: ${money233(cost)}.`,{Happiness:12,Stamina:-4},0,'good','privateIslandHub230()');
  };
  const oldIslandHub233=window.privateIslandHub230||null;
  if(oldIslandHub233&&!oldIslandHub233.__laws233){
    window.privateIslandHub230=function(){
      oldIslandHub233.apply(this,arguments);
      setTimeout(()=>{
        try{
          const i=state.privateIsland230, body=document.querySelector('#modal .modalBody');
          if(!body)return;
          const alt=body.querySelector('.btn.alt');
          if(i && !body.innerHTML.includes('travelPrivateIsland233')){
            const sec=document.createElement('div');sec.className='section';sec.textContent='Reizen & wetten';
            const wrap=document.createElement('div');
            const plane=bestAircraft233(), hasAirstrip=!!(i.buildings&&i.buildings.airstrip);
            wrap.innerHTML=rr233('🛫','Naar privé-eiland reizen',plane?(hasAirstrip?'Gratis met eigen vliegtuig':'Goedkoop met eigen vliegtuig + transfer'):'Duur met charter/boot','travelPrivateIsland233()')+
              rr233('⚖️','Wetboek / lokale wetten','Belasting, immigratie, business, gokken, security en events','islandLaws233()');
            body.insertBefore(sec,alt||null);
            while(wrap.firstElementChild)body.insertBefore(wrap.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.privateIslandHub230.__laws233=true;
  }
  const oldAviationHub233=window.aviationHub230||null;
  if(oldAviationHub233&&!oldAviationHub233.__travel233){
    window.aviationHub230=function(){
      oldAviationHub233.apply(this,arguments);
      setTimeout(()=>{
        try{
          const body=document.querySelector('#modal .modalBody');
          if(body&&!body.innerHTML.includes('travelPrivateIsland233')){
            const alt=body.querySelector('.btn.alt');
            const s=document.createElement('div');s.className='section';s.textContent='Reizen';
            const wrap=document.createElement('div');
            wrap.innerHTML=rr233('✈️','Vakantie met eigen vliegtuig','Vakanties worden goedkoper als je een bruikbaar vliegtuig hebt','vacation()',!bestAircraft233())+
              rr233('🏝️','Naar privé-eiland','Gratis/goedkoper met eigen vliegtuig','travelPrivateIsland233()',!state.privateIsland230);
            body.insertBefore(s,alt||null); while(wrap.firstElementChild)body.insertBefore(wrap.firstElementChild,alt||null);
          }
        }catch(e){}
      },0);
    };
    window.aviationHub230.__travel233=true;
  }
  window.processIslandYear230=function(manual=false){
    const i=ensureIslandLaws233(); if(!i)return;
    const s=islandLawScore233();
    let baseIncome=(i.yearlyIncome||0)+Math.round((i.tourism||0)*12000)+Math.round((i.population||0)*2500);
    let baseCosts=(i.yearlyCosts||750000)+Math.round((i.population||0)*1400);
    let income=Math.max(0,Math.round(baseIncome*(1+s.income/100)));
    let costs=Math.max(0,Math.round(baseCosts*(1+s.cost/100)));
    let growth=Math.max(0,r233(0,3)+Math.round(s.growth/3));
    i.population=Math.max(0,(i.population||0)+growth);
    i.tourism=clamp233((i.tourism||0)+Math.round(s.tourism/4)+r233(-2,3));
    i.stability=clamp233((i.stability||50)+Math.round(s.stability/4)+r233(-2,2));
    const risk=Math.max(0,s.risk + (50-i.stability)/2);
    let event='';
    if(Math.random()*100<risk){
      const bad=pick233(['Een influencer lekte kritiek op je eilandwetten.','Er was een security-incident rond toeristen.','Een milieugroep dreigde met rechtszaak.','Een rijke bewoner vertrok na politieke ruzie.']);
      costs+=r233(100000,2500000);
      i.stability=clamp233(i.stability-r233(3,12));
      event=`<br><b>Event:</b> ${bad}`;
    }else if(Math.random()<.18){
      const good=pick233(['Een luxe magazine noemde je eiland exclusief.','Nieuwe ondernemers wilden winkels openen.','Rijke bezoekers boekten langer verblijf.','Bewoners waren tevreden over de nieuwe regels.']);
      income+=r233(100000,1800000);
      i.stability=clamp233(i.stability+r233(1,6));
      event=`<br><b>Event:</b> ${good}`;
    }
    const net=income-costs;
    state.money=(state.money||0)+net;
    i.value=Math.max(0,Math.round((i.value||100000000)+(net>0?net*.35:net*.12)+(s.value||0)*(i.value||100000000)/1000+i.infrastructure*20000+i.tourism*25000+i.stability*15000));
    const line=`Leeftijd ${state.age}: inkomen ${money233(income)}, kosten ${money233(costs)}, netto ${money233(net)}, groei +${growth}, stabiliteit ${i.stability}%.`;
    i.lawHistory=i.lawHistory||[]; i.lawHistory.push(line+(event?` ${event.replace(/<[^>]+>/g,'')}`:'')); i.lawHistory=i.lawHistory.slice(-12);
    try{addLog(`<b>Privé-eiland jaarupdate</b><br>${line}${event}`,'warn',false)}catch(e){}
    if(manual){saveRender233();privateIslandHub230();}
  };

  /* ======================= YEARLY + SAVE HOOKS ======================= */
  const oldAge233=window.ageUp||(typeof ageUp==='function'?ageUp:null);
  if(oldAge233&&!oldAge233.__relAviLaw233){
    window.ageUp=function(){
      const before=state&&state.age;
      const ret=oldAge233.apply(this,arguments);
      try{
        if(state&&state.age!==before){processRelationshipYear233(false);}
        ensureAviation233();
        saveRender233();
      }catch(e){console.warn('[v23.3 age]',e)}
      return ret;
    };
    window.ageUp.__relAviLaw233=true; try{ageUp=window.ageUp}catch(e){}
  }
  const oldYearly233=window.yearlyAssets||(typeof yearlyAssets==='function'?yearlyAssets:null);
  if(oldYearly233&&!oldYearly233.__relAviLaw233){
    window.yearlyAssets=function(){
      if(oldYearly233)oldYearly233.apply(this,arguments);
      try{processRelationshipYear233(false)}catch(e){}
    };
    window.yearlyAssets.__relAviLaw233=true; try{yearlyAssets=window.yearlyAssets}catch(e){}
  }
  const oldSave233=window.safeSave||(typeof safeSave==='function'?safeSave:null);
  if(oldSave233&&!oldSave233.__relAviLaw233){
    window.safeSave=function(){try{ensureRel233();ensureAviation233();ensureIslandLaws233()}catch(e){}return oldSave233.apply(this,arguments)};
    window.safeSave.__relAviLaw233=true; try{safeSave=window.safeSave}catch(e){}
  }
  const oldShow233=window.showModal||(typeof showModal==='function'?showModal:null);
  if(oldShow233&&!oldShow233.__click233){
    window.showModal=function(html){const ret=oldShow233.call(this,html);setTimeout(()=>{fixClick233();cleanupAircraftDom233(document)},0);return ret};
    window.showModal.__click233=true; try{showModal=window.showModal}catch(e){}
  }
  window.debugRelAviationLaws233=function(){
    ensureRel233();ensureAviation233();
    let h=card233('<b>v23.3 debug</b><br>Relatie-events, vliegtuigsprites/reiskorting en eilandwetten actief.');
    h+=rr233('💔','Force relatiejaar event check','Test partner-events','processRelationshipYear233(true)');
    h+=rr233('✈️','Open vakantie','Test korting eigen vliegtuig','vacation()');
    h+=rr233('🛫','Open luchtvaart','Check vliegtuig-icons','aviationHub230()',typeof aviationHub230!=='function');
    h+=rr233('⚖️','Open eilandwetten','Speel met wetboek','islandLaws233()',!state.privateIsland230);
    modal233('🛠️','v23.3 debug',h,'closeModal()');
  };
  setTimeout(()=>{try{ensureRel233();ensureAviation233();ensureIslandLaws233();cleanupAircraftDom233(document);safeSave();render()}catch(e){}},400);
})();
