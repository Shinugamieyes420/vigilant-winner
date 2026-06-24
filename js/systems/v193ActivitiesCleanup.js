
/* v19.3 Activities Cleanup
   Final output filter for Activities:
   - one Reisstatus card
   - one Wereldkaart row
   - removes stacked travel/world sections caused by patch wrappers
*/
(function(){
  function norm193(x){
    x=(x||'').toString().toLowerCase();
    if(['usa','us','america','amerika','united_states','united states'].includes(x))return 'america';
    if(['japan','tokyo'].includes(x))return 'japan';
    if(['spain','spanje','alkmaar','barcelona','madrid','malaga','valencia','sevilla'].includes(x))return 'spain';
    if(['amsterdam'].includes(x))return 'amsterdam';
    if(['jamaica','kingston'].includes(x))return 'jamaica';
    if(['nightcity','night_city','night city','nc'].includes(x))return 'nightcity';
    if(['enkhuizen','nl','nederland','netherlands','home','normal'].includes(x))return 'enkhuizen';
    return x||'enkhuizen';
  }
  function label193(p){p=norm193(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function icon193(p){p=norm193(p);return {enkhuizen:'🏠',amsterdam:'🌉',spain:'🇪🇸',america:'🇺🇸',japan:'🇯🇵',jamaica:'🇯🇲',nightcity:'🌃'}[p]||'🌍'}
  function current193(){
    if(state.vacation)return norm193(state.vacation);
    return norm193(state.world||state.city||state.placeId||'enkhuizen');
  }
  function rr193(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function status193(){
    try{
      const raw = travelStatusCard174();
      // Fix known alias display: if home is old Alkmaar, show Spain.
      return raw.replace(/Thuisbasis:\s*[^<]*Alkmaar/g,'Thuisbasis: 🇪🇸 Spanje').replace(/Thuisbasis:\s*[^<]*Es Spanje/g,'Thuisbasis: 🇪🇸 Spanje');
    }catch(e){
      const here=current193();
      return `<div class="card"><b>🌍 Reisstatus</b><br>${state.vacation?'✈️ Vakantie':'🏠 Wonen'} · nu: ${icon193(here)} ${label193(here)}<br><span class="mini">Vakantie = tijdelijk. Wonen = vaste routes.</span></div>`;
    }
  }
  function cleanDOM193(html){
    html=String(html||'');
    // Fast regex fallback before DOM parsing.
    html=html.replace(/<div class="card"><b>🌍 Reisstatus<\/b>[\s\S]*?<\/div>/g,'');
    if(typeof document==='undefined')return html;
    const tmp=document.createElement('div');
    tmp.innerHTML=html;

    // Remove all travel status cards that survived.
    tmp.querySelectorAll('.card').forEach(el=>{
      const txt=(el.textContent||'').toLowerCase();
      if(txt.includes('reisstatus'))el.remove();
    });

    // Remove all old world-map rows, regardless of which previous patch made them.
    tmp.querySelectorAll('.row').forEach(el=>{
      const oc=String(el.getAttribute('onclick')||'').toLowerCase();
      const txt=(el.textContent||'').toLowerCase();
      if(oc.includes('worldmapscreen') || txt.includes('wereldkaart')) el.remove();
      if(txt.includes('amerika / usa trip')) el.remove(); // old disabled trip row, now replaced by world map
    });

    // Remove world headings; we rebuild one clean section.
    tmp.querySelectorAll('.section').forEach(el=>{
      const txt=(el.textContent||'').trim().toLowerCase();
      if(txt==='wereld & systemen' || txt==='wereld & vakantie-dlc' || txt==='wereld & dlc')el.remove();
    });

    // Remove duplicate consecutive or repeated sections with exactly same label after cleanup.
    const seenSections=new Set();
    tmp.querySelectorAll('.section').forEach(el=>{
      const txt=(el.textContent||'').trim().toLowerCase();
      if(!txt)return;
      // Keep common repeated category if needed? For Activities this should not repeat.
      if(seenSections.has(txt)) el.remove();
      else seenSections.add(txt);
    });

    return tmp.innerHTML;
  }
  function cleanActivities193(html){
    let cleaned=cleanDOM193(html);

    let top='';
    top += status193();

    // Always one world section.
    top += `<div class="section">Wereld & systemen</div>`;
    top += rr193('🌍','Wereldkaart / plaatsen','Vakanties, wonen, DLC’s en stadsmodifiers','worldMapScreen174()');

    // If on vacation, one direct vacation hub row.
    if(state.vacation){
      const p=norm193(state.vacation);
      top += rr193(icon193(p),`${label193(p)} vakantie-DLC`,'Activiteiten, mensen, uitgaan, shops en terugreizen',`vacationHub180('${p}')`);
    }

    // Compact leftover. Avoid 4 repeated blank sections.
    cleaned=cleaned.replace(/(?:\s*<div class="section">\s*<\/div>\s*)+/g,'');
    return top + cleaned;
  }

  const oldActivities193 = window.activitiesHTML || (typeof activitiesHTML==='function' ? activitiesHTML : null);
  window.activitiesHTML=function(){
    let raw='';
    try{raw=oldActivities193?oldActivities193():''}catch(e){raw=''}
    return cleanActivities193(raw);
  };
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  // Also cleanup after rendering just in case some HTML is inserted by a modal/late wrapper.
  window.cleanupActivities193=function(){
    try{
      const screen=document.querySelector('#screen') || document.querySelector('#app') || document.body;
      if(!screen)return;
      const rows=[...screen.querySelectorAll('.row')];
      let worldSeen=false;
      rows.forEach(el=>{
        const oc=String(el.getAttribute('onclick')||'').toLowerCase();
        const txt=(el.textContent||'').toLowerCase();
        if(oc.includes('worldmapscreen')||txt.includes('wereldkaart')){
          if(worldSeen)el.remove();
          worldSeen=true;
        }
      });
      const cards=[...screen.querySelectorAll('.card')].filter(el=>(el.textContent||'').toLowerCase().includes('reisstatus'));
      cards.forEach((el,i)=>{if(i>0)el.remove()});
    }catch(e){}
  };
})();
