
/* v19.0 Visual Effect Bars
   Converts vacation/stat effect text like "Effect: Happiness +8 · Health -1"
   into original-style colored bars in modals.
*/
(function(){
  function esc190(s){
    return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});
  }
  function shortLabel190(label){
    const map={
      Happiness:'Happiness',
      Health:'Health',
      Smarts:'Smarts',
      Looks:'Looks',
      Fitness:'Fitness',
      Stamina:'Stamina',
      Social:'Social',
      Fame:'Fame',
      Money:'Money'
    };
    return map[label]||label;
  }
  function parseEffects190(raw){
    raw=String(raw||'').replace(/^Effect:\s*/i,'').trim();
    raw=raw.replace(/<[^>]*>/g,' ');
    const parts=raw.split('·').map(x=>x.trim()).filter(Boolean);
    const out=[];
    parts.forEach(part=>{
      let m=part.match(/^([A-Za-zÀ-ÿ ]+)\s*([+-])\s*€?\s*([\d.,]+)/);
      if(!m) m=part.match(/^([A-Za-zÀ-ÿ ]+)\s*([+-])\s*([\d.,]+)/);
      if(!m) return;
      const label=m[1].trim();
      const sign=m[2]==='-'?-1:1;
      const val=Number(String(m[3]).replace(/\./g,'').replace(',','.'))*sign;
      if(!Number.isFinite(val))return;
      out.push({label, value:val});
    });
    return out;
  }
  function bars190(effects){
    if(!effects||!effects.length)return '';
    const rows=effects.map(e=>{
      const abs=Math.abs(e.value);
      const pct=Math.max(12, Math.min(100, abs*10));
      const cls=e.value>0?'good':e.value<0?'bad':'warn';
      const sign=e.value>0?'+':e.value<0?'−':'';
      const valueTxt=sign+Math.abs(e.value);
      return `<div class="effectBar190">
        <div class="effectBar190Label">${esc190(shortLabel190(e.label))}</div>
        <div class="effectBar190Track"><div class="effectBar190Fill ${cls}" style="width:${pct}%"></div></div>
        <div class="effectBar190Value ${cls}">${esc190(valueTxt)}</div>
      </div>`;
    }).join('');
    return `<div class="effectBars190"><div class="effectBars190Title">Effect</div>${rows}</div>`;
  }
  function convertHTML190(html){
    html=String(html||'');
    // Replace dedicated v18.7 effect boxes.
    html=html.replace(/<div class="vac187-effect">\s*Effect:\s*([\s\S]*?)<\/div>/gi,function(_,raw){
      const eff=parseEffects190(raw);
      return eff.length?bars190(eff):`<div class="vac187-effect">Effect: ${raw}</div>`;
    });
    // Replace plain mini effect spans inside logs/modals if they appear.
    html=html.replace(/<span class="mini">\s*Effect:\s*([\s\S]*?)<\/span>/gi,function(_,raw){
      const eff=parseEffects190(raw);
      return eff.length?bars190(eff):`<span class="mini">Effect: ${raw}</span>`;
    });
    return html;
  }
  const oldShowModal190 = window.showModal || (typeof showModal==='function' ? showModal : null);
  if(oldShowModal190 && !oldShowModal190.__effectBars190){
    window.showModal=function(html){
      return oldShowModal190.call(this, convertHTML190(html));
    };
    window.showModal.__effectBars190=true;
    try{showModal=window.showModal}catch(e){}
  }

  // Also expose helper for future code.
  window.effectBars190FromText=function(text){
    return bars190(parseEffects190(text));
  };
})();
