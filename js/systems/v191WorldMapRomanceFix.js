
/* v19.1 World Map Dedupe + Vacation People/Romance
   - Keeps only one world map row.
   - Adds vacation contacts, phone numbers, dating and adult consensual intimacy.
*/
(function(){
  function r191(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function p191(a){return a[Math.floor(Math.random()*a.length)]}
  function c191(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money191(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast191(t){try{toast(t)}catch(e){console.log(t)}}
  function save191(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function norm191(x){
    x=(x||'').toString().toLowerCase();
    if(['usa','us','america','united_states','united states','amerika'].includes(x))return 'america';
    if(['japan','tokyo'].includes(x))return 'japan';
    if(['spain','spanje','alkmaar','barcelona','madrid','malaga','valencia','sevilla'].includes(x))return 'spain';
    if(['amsterdam'].includes(x))return 'amsterdam';
    if(['jamaica','kingston'].includes(x))return 'jamaica';
    if(['nightcity','night_city','night city','nc'].includes(x))return 'nightcity';
    if(['enkhuizen','nl','nederland','netherlands','home','normal'].includes(x))return 'enkhuizen';
    return x||'enkhuizen';
  }
  function label191(p){p=norm191(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function icon191(p){p=norm191(p);return {enkhuizen:'🏠',amsterdam:'🌉',spain:'🇪🇸',america:'🇺🇸',japan:'🇯🇵',jamaica:'🇯🇲',nightcity:'🌃'}[p]||'🌍'}
  function normalize191(){
    if(!state)return;
    ['vacation','world','city','placeId','homePlaceId','homeWorldBeforeVacation'].forEach(k=>{if(state[k])state[k]=norm191(state[k])});
  }
  function current191(){normalize191();return state.vacation?norm191(state.vacation):norm191(state.world||state.city||state.placeId||'enkhuizen')}
  function inJail191(){try{if(typeof isInJail==='function')return !!isInJail()}catch(e){}return !!(state&&state.jail&&state.jail.yearsLeft>0)}
  function rr191(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function dlc191(place){
    place=norm191(place);
    state.dlcTravel=state.dlcTravel||{};
    state.dlcTravel[place]=state.dlcTravel[place]||{days:0,vibe:50,contacts:0,souvenirs:0,spent:0,memories:0,party:0,localRep:0,romance:0};
    return state.dlcTravel[place];
  }
  function apply191(stats){
    stats=stats||{};
    try{applyStats(stats)}catch(e){}
    state.stats=state.stats||{};
    Object.keys(stats).forEach(k=>{
      const d=stats[k]; if(!d)return;
      if(['Happiness','Health','Smarts','Looks'].includes(k))state.stats[k]=c191((state.stats[k]??50)+d);
      if(k==='Happiness'&&typeof state.happiness==='number')state.happiness=c191(state.happiness+d);
      if(k==='Health'&&typeof state.health==='number')state.health=c191(state.health+d);
      if(k==='Smarts'&&typeof state.smarts==='number')state.smarts=c191(state.smarts+d);
      if(k==='Looks'&&typeof state.looks==='number')state.looks=c191(state.looks+d);
      if(k==='Fitness')state.fitness=c191((state.fitness??50)+d);
      if(k==='Stamina')state.stamina=c191((state.stamina??50)+d);
      if(k==='Social')state.social=c191((state.social??0)+d,0,999999);
      if(k==='Fame')state.fame=c191((state.fame??0)+d,0,999999);
    });
  }
  function effect191(stats){
    stats=stats||{};
    return Object.keys(stats).filter(k=>stats[k]).map(k=>k+' '+(stats[k]>0?'+':'')+stats[k]).join(' · ');
  }
  function msg191(icon,title,text,stats,type){
    stats=stats||{};
    apply191(stats);
    const fx=effect191(stats);
    try{addLog('<b>'+title+'</b><br>'+text+(fx?'<br><span class="mini">Effect: '+fx+'</span>':''),type||'good',false)}catch(e){}
    try{
      showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${fx?`<div class="vac187-effect">Effect: ${fx}</div>`:''}<button class="btn" onclick="closeModal()">Verder</button></div>`);
    }catch(e){toast191(title)}
    save191();
  }
  const NAMES191={
    spain:['Sofia','Lucía','Elena','Valeria','Carmen','Marta','Rosa','Isabella'],
    america:['Jess','Maddie','Ashley','Brianna','Taylor','Skylar','Megan','Hailey'],
    japan:['Aiko','Yumi','Hana','Sakura','Emi','Rina','Nana','Mika'],
    amsterdam:['Lisa','Noa','Eva','Sanne','Fleur','Lotte','Nina','Roos'],
    jamaica:['Aaliyah','Kayla','Shanice','Tiana','Maya','Jada','Naomi','Leah'],
    nightcity:['Vex','Nova','Misty','Raven','Jinx','Kira','Lux','Nyx']
  };
  function contacts191(place){
    state.vacationContacts=state.vacationContacts||[];
    place=norm191(place);
    return state.vacationContacts.filter(c=>norm191(c.place)===place);
  }
  function bestContact191(place){
    const arr=contacts191(place);
    if(!arr.length)return null;
    return arr.slice().sort((a,b)=>((b.rel||0)+(b.attraction||0)+(b.phone?20:0))-((a.rel||0)+(a.attraction||0)+(a.phone?20:0)))[0];
  }
  function newContact191(place){
    place=norm191(place);
    state.vacationContacts=state.vacationContacts||[];
    const name=p191(NAMES191[place]||NAMES191.amsterdam);
    const c={id:'vc_'+Date.now()+'_'+r191(100,999),name,place,rel:r191(32,58),attraction:r191(35,70),phone:false,metAge:state.age,romance:0,intimate:false,notes:[]};
    state.vacationContacts.push(c);
    return c;
  }
  window.vacationMeetPeople191=function(place){
    place=norm191(place||current191());
    if(inJail191())return toast191('Je zit vast.');
    const c=newContact191(place);
    const d=dlc191(place); d.contacts=(d.contacts||0)+1; d.vibe=c191((d.vibe||50)+r191(2,6)); d.memories=(d.memories||0)+1;
    msg191('👥','Mensen ontmoeten',`Je ontmoette ${c.name} in ${label191(place)}. Jullie praatten even en er was ${c.attraction>55?'duidelijke chemie':'een normale klik'}.`,{Happiness:4,Social:8,Stamina:-2},'good');
  };
  window.vacationExchangeNumber191=function(place){
    place=norm191(place||current191());
    if((state.age||0)<16)return toast191('Nummers wisselen kan vanaf 16+ in deze game.');
    let c=bestContact191(place)||newContact191(place);
    const chance=(state.stats?.Looks||50)+(state.social?Math.min(30,state.social/20):0)+(c.rel||40)+(c.attraction||40)+r191(-30,30);
    if(chance>135){
      c.phone=true; c.rel=c191((c.rel||40)+r191(8,16)); c.romance=c191((c.romance||0)+r191(5,12));
      state.friends=state.friends||[];
      if(!state.friends.some(f=>f.vacationContactId===c.id)){
        state.friends.push({name:c.name,rel:45,metAt:label191(place),type:'vacation_contact',vacationContactId:c.id});
      }
      const d=dlc191(place); d.contacts=(d.contacts||0)+1;
      msg191('📱','Telefoonnummer gewisseld',`${c.name} gaf je haar nummer. Je kunt haar nu later appen of afspreken.`,{Happiness:5,Social:8,Looks:1},'good');
    }else{
      msg191('📱','Geen nummer gekregen',`${c.name} vond het gesprek prima, maar wilde geen nummer uitwisselen. Niet iedereen hapt, en dat hoort erbij.`,{Happiness:-1,Social:2},'warn');
    }
  };
  window.vacationTextContact191=function(place){
    place=norm191(place||current191());
    const c=contacts191(place).filter(x=>x.phone).sort((a,b)=>(b.rel||0)-(a.rel||0))[0];
    if(!c)return toast191('Je hebt hier nog geen telefoonnummer. Ontmoet eerst iemand en wissel nummers.');
    c.rel=c191((c.rel||40)+r191(3,8)); c.romance=c191((c.romance||0)+r191(1,5));
    msg191('💬','Appen met vakantiecontact',`Je appte met ${c.name}. Het gesprek bleef lopen en de band werd iets sterker.`,{Happiness:3,Social:4},'good');
  };
  window.vacationDate191=function(place){
    place=norm191(place||current191());
    if((state.age||0)<18)return toast191('Dates/romance zijn 18+ in deze game.');
    const c=contacts191(place).filter(x=>x.phone).sort((a,b)=>(b.rel+b.attraction)-(a.rel+a.attraction))[0];
    if(!c)return toast191('Je hebt nog geen nummer. Wissel eerst nummers met iemand.');
    const cost=place==='america'?80:place==='japan'?65:place==='spain'?55:place==='amsterdam'?45:place==='jamaica'?40:90;
    if((state.money||0)<cost)return toast191('Niet genoeg geld: '+money191(cost));
    state.money-=cost;
    c.rel=c191((c.rel||40)+r191(8,15)); c.attraction=c191((c.attraction||50)+r191(4,10)); c.romance=c191((c.romance||0)+r191(8,16));
    const d=dlc191(place); d.romance=(d.romance||0)+1; d.spent=(d.spent||0)+cost; d.memories=(d.memories||0)+1;
    msg191('💞','Date / afspreken',`Je sprak af met ${c.name}. De date was gezellig en de chemie werd duidelijker.`,{Happiness:7,Social:8,Looks:1,Stamina:-3},'good');
  };
  window.vacationIntimacy191=function(place){
    place=norm191(place||current191());
    if((state.age||0)<18)return toast191('Intimiteit is 18+ in deze game.');
    const c=contacts191(place).filter(x=>x.phone).sort((a,b)=>((b.rel||0)+(b.attraction||0)+(b.romance||0))-((a.rel||0)+(a.attraction||0)+(a.romance||0)))[0];
    if(!c)return toast191('Je hebt nog geen contact met nummer. Eerst iemand ontmoeten en nummers wisselen.');
    const chemistry=(c.rel||40)+(c.attraction||40)+(c.romance||0)+r191(-25,35);
    if(chemistry<125){
      c.rel=c191((c.rel||40)+2);
      msg191('💞','Het bleef bij flirten',`${c.name} wilde het rustig houden. Jullie hadden een prima avond, maar gingen niet verder.`,{Happiness:1,Social:3,Stamina:-1},'warn');
      return;
    }
    c.intimate=true; c.rel=c191((c.rel||40)+r191(3,9)); c.romance=c191((c.romance||0)+r191(8,18));
    const d=dlc191(place); d.romance=(d.romance||0)+2; d.memories=(d.memories||0)+1;
    msg191('💋','Intieme avond',`Jij en ${c.name} hadden een volwassen, wederzijds gewenste intieme avond. Alles bleef veilig en respectvol.`,{Happiness:8,Social:4,Looks:1,Health:-1,Stamina:-6},'good');
  };
  window.vacationContactsScreen191=function(place){
    place=norm191(place||current191());
    const arr=contacts191(place);
    let out=`<div class="vac188Info"><b>Vakantiecontacten in ${label191(place)}</b><br>${arr.length?arr.length+' contacten gevonden.':'Nog niemand ontmoet.'}</div>`;
    if(arr.length){
      arr.forEach(c=>{
        out += `<div class="card"><b>${c.name}</b><br>Band: ${c.rel||0}% · Chemie: ${c.attraction||0}% · Romance: ${c.romance||0}%<br>${c.phone?'📱 Nummer opgeslagen':'Geen nummer'}${c.intimate?' · 💋 intiem geweest':''}</div>`;
      });
    }
    out += `<button class="btn" onclick="vacationMeetPeople191('${place}')">👥 Iemand ontmoeten</button>`;
    out += `<button class="btn" onclick="vacationExchangeNumber191('${place}')">📱 Nummer wisselen</button>`;
    out += `<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">👥</div><div class="modalTitle">Vakantiecontacten</div></div><div class="modalBody" style="text-align:left">${out}</div>`);
  };
  function peopleRows191(place){
    place=norm191(place);
    return `<div class="section">Mensen & romance</div>`
      + rr191('👥','Mensen ontmoeten','Nieuwe locals/toeristen leren kennen',`vacationMeetPeople191('${place}')`)
      + rr191('📱','Telefoonnummer wisselen','Als de klik goed is, nummer opslaan',`vacationExchangeNumber191('${place}')`,(state.age||0)<16)
      + rr191('💬','Appen met vakantiecontact','Contact onderhouden na nummer wisselen',`vacationTextContact191('${place}')`)
      + rr191('💞','Date / afspreken','18+ · samen wat drinken/eten of wandelen',`vacationDate191('${place}')`,(state.age||0)<18)
      + rr191('💋','Intiem worden','18+ · alleen als er chemie en wederzijdse interesse is',`vacationIntimacy191('${place}')`,(state.age||0)<18)
      + rr191('📖','Vakantiecontacten bekijken','Nummers, band, chemie en romance bekijken',`vacationContactsScreen191('${place}')`);
  }
  function dedupeWorldMap191(html){
    try{
      if(typeof document==='undefined')return html;
      const tmp=document.createElement('div');
      tmp.innerHTML=String(html||'');
      tmp.querySelectorAll('.row').forEach(el=>{
        const oc=String(el.getAttribute('onclick')||'');
        const title=(el.querySelector('.rTitle')?.textContent||'').toLowerCase();
        if(oc.includes('worldMapScreen')||title.includes('wereldkaart')) el.remove();
      });
      let cleaned=tmp.innerHTML;
      if(!state.vacation){
        cleaned = `<div class="section">Wereld & systemen</div>` + rr191('🌍','Wereldkaart / plaatsen','Vakanties, wonen, DLC’s en stadsmodifiers','worldMapScreen174()') + cleaned;
      }
      return cleaned;
    }catch(e){return html}
  }
  const oldVacationHub191=window.vacationHub180 || null;
  window.vacationHub180=function(place){
    place=norm191(place||current191());
    if(oldVacationHub191) oldVacationHub191(place);
    setTimeout(()=>{
      try{
        const body=document.querySelector('#modal .modalBody');
        if(!body||body.innerHTML.includes('Mensen & romance'))return;
        const marker=[...body.querySelectorAll('.section')].find(x=>/Reizen/i.test(x.textContent||''));
        const wrap=document.createElement('div'); wrap.innerHTML=peopleRows191(place);
        if(marker) body.insertBefore(wrap, marker);
        else body.insertBefore(wrap, body.querySelector('button.btn.alt')||null);
      }catch(e){}
    },0);
  };
  window.spainHub180=function(){vacationHub180('spain')};
  window.alkmaarHub180=window.spainHub180;
  window.usaHub180=function(){vacationHub180('america')};
  window.japanHub180=function(){vacationHub180('japan')};
  window.amsterdamHub180=function(){vacationHub180('amsterdam')};
  window.jamaicaHub180=function(){vacationHub180('jamaica')};
  window.nightCityVacationHub180=function(){vacationHub180('nightcity')};

  const oldActivities191=window.activitiesHTML || (typeof activitiesHTML==='function'?activitiesHTML:null);
  window.activitiesHTML=function(){
    let h=oldActivities191?oldActivities191():'';
    h=dedupeWorldMap191(h);
    if(state.vacation){
      const place=norm191(state.vacation);
      if(!h.includes('Mensen & romance')){
        if(h.includes('<div class="section">Reizen</div>')) h=h.replace('<div class="section">Reizen</div>', peopleRows191(place)+'<div class="section">Reizen</div>');
        else h+=peopleRows191(place);
      }
    }
    return h;
  };
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  // Make nightlife romance automatically create/advance vacation contacts too.
  const oldNightPick191=window.dlc187NightPick || null;
  window.dlc187NightPick=function(place,i){
    place=norm191(place);
    const beforeCount=contacts191(place).length;
    if(oldNightPick191) oldNightPick191(place,i);
    // Common romance choices are index 1 for most places, index 2 for Japan/Jamaica.
    const romanceIndex=(place==='japan'||place==='jamaica')?2:1;
    if(i===romanceIndex){
      setTimeout(()=>{
        try{
          let c=bestContact191(place)||newContact191(place);
          c.rel=c191((c.rel||40)+r191(5,12));
          c.attraction=c191((c.attraction||40)+r191(5,12));
          c.romance=c191((c.romance||0)+r191(5,12));
          if(Math.random()<0.65)c.phone=true;
          dlc191(place).romance=(dlc191(place).romance||0)+1;
          save191();
        }catch(e){}
      },0);
    }
  };

  // Aliases after final override
  [['spainVacationScreen','spainHub180'],['spainHub','spainHub180'],['showSpain','spainHub180'],['alkmaarVacationScreen','spainHub180'],['alkmaarHub','spainHub180'],['showAlkmaar','spainHub180'],['americaVacationScreen','usaHub180'],['usaVacationScreen','usaHub180'],['americaHub','usaHub180'],['usaHub','usaHub180'],['showAmerica','usaHub180'],['showUSA','usaHub180'],['japanVacationScreen','japanHub180'],['tokyoVacationScreen','japanHub180'],['japanHub','japanHub180'],['tokyoHub','japanHub180'],['showJapan','japanHub180'],['amsterdamVacationScreen','amsterdamHub180'],['amsterdamHub','amsterdamHub180'],['showAmsterdam','amsterdamHub180'],['jamaicaVacationScreen','jamaicaHub180'],['jamaicaHub','jamaicaHub180'],['showJamaica','jamaicaHub180'],['nightCityVacationScreen','nightCityVacationHub180'],['nightCityHub','nightCityVacationHub180'],['showNightCity','nightCityVacationHub180']].forEach(pair=>{try{window[pair[0]]=window[pair[1]]}catch(e){}});
})();
