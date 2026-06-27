
/* v21.6 Flag Asset Icons for Travel World
   Fix: country flag emojis can render as letters like ES/US/JP/JM.
   This patch uses SVG assets instead of emoji flags.
*/
(function(){
  const FLAG216={
    spain:'assets/flags/spain.svg',
    america:'assets/flags/usa.svg',
    usa:'assets/flags/usa.svg',
    japan:'assets/flags/japan.svg',
    amsterdam:'assets/flags/amsterdam.svg',
    netherlands:'assets/flags/netherlands.svg',
    enkhuizen:'assets/flags/netherlands.svg',
    jamaica:'assets/flags/jamaica.svg',
    nightcity:'assets/flags/nightcity.svg',
    world:'assets/flags/world.svg'
  };
  function flag216(key,size='md'){
    const src=FLAG216[key]||FLAG216.world;
    return `<img class="flagIcon216 ${size}" src="${src}" alt="${key}">`;
  }
  window.flagIcon216=flag216;

  function exists216(name){
    try{return typeof window[name]==='function' || typeof eval(name)==='function'}catch(e){return false}
  }
  function rr216(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function section216(t){return `<div class="section">${t}</div>`}
  function card216(h){return `<div class="card">${h}</div>`}
  function modal216(icon,title,body){
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody">${body}<button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  }
  function norm216(p){
    p=String(p||'').toLowerCase();
    if(p.includes('spain')||p.includes('spanje'))return 'spain';
    if(p.includes('usa')||p.includes('america')||p.includes('amerika'))return 'america';
    if(p.includes('japan')||p.includes('tokyo'))return 'japan';
    if(p.includes('amsterdam'))return 'amsterdam';
    if(p.includes('jamaica'))return 'jamaica';
    if(p.includes('night'))return 'nightcity';
    if(p.includes('enkhuizen')||p.includes('nederland')||p.includes('nether'))return 'enkhuizen';
    return p||'world';
  }
  function place216(){
    return norm216((state&&(state.vacation||state.placeId||state.world||state.currentPlace))||'enkhuizen');
  }
  function label216(p){
    p=norm216(p);
    return {enkhuizen:'Enkhuizen',netherlands:'Nederland',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',usa:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City',world:'Wereld'}[p]||p;
  }

  const DLC216=[
    ['spain','Spanje','Tapas, strand, La Liga, business en nightlife'],
    ['america','Amerika / USA','Roadtrip, diner, Hollywood, UFC/WWE en business'],
    ['japan','Japan / Tokyo','Ramen, arcade, tempel, dojo en werkcultuur'],
    ['amsterdam','Amsterdam','Grachten, festival, museum, creatief en media'],
    ['jamaica','Jamaica','Beach, boat trip, reggae, markt en tourism'],
    ['nightcity','Night City','Neon, fixer, fight pit, cyber clinic en risico']
  ];

  // Override Reizen & Wereld with asset flags.
  window.travelWorldMasterHub204=function(){
    const current=place216();
    let h=card216(`<b>Reizen & Wereld</b><br>Huidige locatie: ${label216(current)}<br>DLC's zijn hier per land en type netjes geordend.<br><span class="mini">Vlaggen zijn nu echte assets, geen emoji-landcodes.</span>`);
    h+=section216('Wereld');
    h+=rr216(flag216('world'),'Wereldkaart','Landen, verhuizen, vakantie en wereldkaart','worldMapScreen174()',!exists216('worldMapScreen174'));
    if(exists216('worldMapScreen'))h+=rr216(flag216('world'),'Wereldkaart classic','Oude wereldkaart fallback','worldMapScreen()');
    h+=section216('Vakantie / huidige locatie');
    h+=rr216(flag216(current),'Huidige vakantie hub',`Open hub voor ${label216(current)}`,`vacationHub180('${current}')`,!exists216('vacationHub180'));
    h+=rr216('🧳','Vakantie contacten','Mensen die je op vakantie hebt ontmoet',`vacationContactsScreen191('${current}')`,!exists216('vacationContactsScreen191'));
    h+=section216('DLC landen');
    h+=DLC216.map(p=>rr216(flag216(p[0]),p[1],p[2],`dlcPlaceMaster204('${p[0]}')`)).join('');
    modal216(flag216('world'),'Reizen & Wereld',h);
  };

  window.dlcPlaceMaster204=function(place){
    place=norm216(place);
    const rec=DLC216.find(x=>x[0]===place)||[place,label216(place),''];
    let h=card216(`<b>${rec[1]}</b><br>${rec[2]}<br><br>Alles van deze DLC staat hier: basis hub, originele activiteit-logica, nightlife, shops en contacten.`);
    h+=section216('DLC hub');
    h+=rr216(flag216(place),`${rec[1]} hub`,'Alle land-specifieke opties openen',`vacationHub180('${place}')`,!exists216('vacationHub180'));
    if(exists216('placeDetailScreen174'))h+=rr216('📍','Plaats detail','Info, reizen/verhuizen en lokale systemen',`placeDetailScreen174('${place}')`);
    h+=section216('Activiteiten');
    h+=rr216('🎲','Originele activiteit-logica','Keuze-menu’s met kans, kosten, contact, item of fail',`dlcActivityList204('${place}')`,!exists216('vacationActivity196'));
    h+=rr216('🍹','Nightlife / uitgaan','Drinken, lol, mensen ontmoeten, flirten en contacts',`dlc187Nightlife('${place}')`,!exists216('dlc187Nightlife'));
    h+=rr216('🛍️','Shops / souvenirs','Landitems, kleding, camera, collectibles',`dlc187Shop('${place}')`,!exists216('dlc187Shop'));
    h+=rr216('📇','Contacten / romance','Appen, dates en vakantiecontacten',`vacationContactsScreen191('${place}')`,!exists216('vacationContactsScreen191'));
    modal216(flag216(place),rec[1],h);
  };

  // Post-process fallback in case older modals already contain emoji flags rendered as text.
  function fixTravelFlagLetters216(root=document){
    try{
      const map=[
        ['Spanje','spain'],['Amerika / USA','america'],['Japan / Tokyo','japan'],['Amsterdam','amsterdam'],['Jamaica','jamaica'],['Night City','nightcity']
      ];
      [...root.querySelectorAll('.row')].forEach(row=>{
        const title=row.querySelector('.rTitle')?.textContent||'';
        const m=map.find(x=>title.includes(x[0]));
        if(m){
          const ico=row.querySelector('.rIco');
          if(ico)ico.innerHTML=flag216(m[1]);
        }
      });
    }catch(e){}
  }
  window.fixTravelFlagLetters216=fixTravelFlagLetters216;

  const oldShow216=window.showModal || (typeof showModal==='function'?showModal:null);
  if(oldShow216 && !oldShow216.__flag216){
    window.showModal=function(html){
      const r=oldShow216.call(this,html);
      setTimeout(()=>fixTravelFlagLetters216(document),0);
      return r;
    };
    window.showModal.__flag216=true;
    try{showModal=window.showModal}catch(e){}
  }

  window.flagIconDebug216=function(){
    let h=card216('<b>Flag assets actief</b><br>Deze iconen zijn SVG-bestanden, dus geen ES/US/JP/JM letter-emojis meer.');
    DLC216.forEach(p=>h+=rr216(flag216(p[0]),p[1],p[2],`dlcPlaceMaster204('${p[0]}')`));
    modal216(flag216('world'),'Flag debug',h);
  };
})();
