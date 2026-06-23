/* v17.3 Life Text System: 500 extra context-aware yearly moments */
(function(){
  'use strict';
  const VERSION = '17.3';
  function hasState173(){ return typeof state !== 'undefined' && !!state; }
  function clamp173(n){ return (typeof clamp === 'function') ? clamp(n) : Math.max(0, Math.min(100, Math.round(n||0))); }
  function pick173(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function applyStats173(stats){
    if(!hasState173() || !stats) return;
    if(typeof applyStats === 'function') { applyStats(stats); return; }
    state.stats = state.stats || {};
    Object.keys(stats).forEach(k=>{
      if(k === 'Fitness') state.fitness = clamp173((state.fitness||50)+stats[k]);
      else if(k === 'Stamina') state.stamina = clamp173((state.stamina||50)+stats[k]);
      else state.stats[k] = clamp173((state.stats[k]||50)+stats[k]);
    });
  }
  function currentWorld173(){
    if(!hasState173()) return 'normal';
    return String(state.vacation || state.world || state.place || state.city || 'normal').toLowerCase();
  }
  function isAllowed173(t){
    if(!hasState173() || !t) return false;
    const age = state.age || 0;
    if(age < (t.minAge ?? 0) || age > (t.maxAge ?? 120)) return false;
    const tags = t.tags || [];
    if(age < 18 && (tags.includes('adult') || tags.includes('minor-risk') || tags.includes('debt') || tags.includes('drugs'))) return false;
    const worlds = (t.worlds || []).map(x=>String(x).toLowerCase());
    if(worlds.length && !worlds.includes(currentWorld173())) return false;
    return true;
  }
  function seenList173(){
    state.flags = state.flags || {};
    state.flags.lifeText173Seen = state.flags.lifeText173Seen || [];
    return state.flags.lifeText173Seen;
  }
  function addLifeText173(force){
    if(!hasState173() || state.dead) return false;
    const all = window.BITZ_LIFE_TEXTS_173 || [];
    if(!all.length) return false;
    const seen = seenList173();
    let pool = all.filter(isAllowed173).filter(t=>!seen.includes(t.id));
    if(pool.length < 8) pool = all.filter(isAllowed173);
    if(!pool.length) return false;
    const t = pick173(pool);
    seen.push(t.id);
    while(seen.length > 90) seen.shift();
    applyStats173(t.stats || {});
    if(typeof addLog === 'function') addLog(`<b>${t.title || 'Life'}</b><br>${t.text}`, t.type || '', false);
    if(force && typeof safeSave === 'function') safeSave();
    return true;
  }
  window.addLifeText173 = addLifeText173;

  const oldRandomYear173 = window.randomYear || (typeof randomYear === 'function' ? randomYear : null);
  window.randomYear = function(){
    const ret = oldRandomYear173 ? oldRandomYear173() : null;
    try{
      const chance = (state && state.age < 6) ? 0.45 : 0.72;
      if(Math.random() < chance) addLifeText173(false);
    }catch(e){ console.warn('[life texts v17.3 yearly]', e); }
    return ret;
  };
  try{ randomYear = window.randomYear; }catch(e){}

  const oldActivitiesHTML173 = window.activitiesHTML || (typeof activitiesHTML === 'function' ? activitiesHTML : null);
  if(oldActivitiesHTML173){
    window.activitiesHTML = function(){
      let h = oldActivitiesHTML173();
      try{
        if(!h.includes('Life Moment 500')){
          h += `<div class="section">Extra life text</div><div class="row" onclick="addLifeText173(true);safeSave();render();toast('Life moment toegevoegd')"><div class="rIco">📖</div><div><div class="rTitle">Life Moment 500</div><div class="sub">Extra context-event uit 500 nieuwe teksten</div></div><div class="chev">›</div></div>`;
        }
      }catch(e){}
      return h;
    };
    try{ activitiesHTML = window.activitiesHTML; }catch(e){}
  }

  window.BITZ_SYSTEMS = window.BITZ_SYSTEMS || {};
  window.BITZ_SYSTEMS.lifeTextSystem = { version: VERSION, sourceCount: (window.BITZ_LIFE_TEXTS_173||[]).length, yearlyChance: '45%-72%', minorSafe: true };
})();
