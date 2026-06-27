
/* v23.8 Options Password Money Mode
   Adds "Password mode" to the hamburger/options menu.
   Code: Admin100! => +€100,000,000.
*/
(function(){
  const PASSWORD238 = 'Admin100!';
  const REWARD238 = 100000000;

  function money238(v){
    try{return money(v)}catch(e){return '€ '+Math.round(Number(v)||0).toLocaleString('nl-NL')}
  }
  function toast238(t){try{toast(t)}catch(e){console.log(t)}}
  function saveRender238(){try{safeSave()}catch(e){}try{render()}catch(e){}}

  function injectPasswordButton238(){
    try{
      const menu=document.getElementById('menu');
      if(!menu || menu.querySelector('#passwordModeBtn238')) return;
      const closeBtn=[...menu.querySelectorAll('button')].find(b=>/close/i.test(b.textContent||''));
      const btn=document.createElement('button');
      btn.className='btn';
      btn.id='passwordModeBtn238';
      btn.innerHTML='🔑 Password mode';
      btn.onclick=function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        window.passwordMode238();
      };
      menu.insertBefore(btn, closeBtn || menu.querySelector('p') || null);
    }catch(e){console.warn('[v23.8 password inject]',e)}
  }

  window.passwordMode238=function(){
    try{toggleMenu(false)}catch(e){}
    showModal(`<div class="modalTop"><div class="avatar">🔑</div><div class="modalTitle">Password mode</div></div>
      <div class="modalBody v238Body">
        <div class="card"><b>Admin password</b><br>Vul het wachtwoord in om admin geld te ontvangen.</div>
        <input id="passwordInput238" class="input" type="password" placeholder="Password" autocomplete="off">
        <button class="btn green" onclick="submitPassword238()">Invoeren</button>
        <button class="btn alt" onclick="closeModal()">Terug</button>
      </div>`);
    setTimeout(()=>{try{document.getElementById('passwordInput238')?.focus()}catch(e){}},80);
  };

  window.submitPassword238=function(){
    const el=document.getElementById('passwordInput238');
    const val=(el&&el.value||'').trim();
    if(val!==PASSWORD238){
      toast238('Verkeerd password.');
      try{addLog('<b>Password mode</b><br>Verkeerd admin password ingevoerd.','warn',false)}catch(e){}
      return;
    }
    state.money=(Number(state.money)||0)+REWARD238;
    try{addLog(`<b>Password mode</b><br>Admin100! ingevoerd. Je kreeg ${money238(REWARD238)}.`, 'good', false)}catch(e){}
    saveRender238();
    showModal(`<div class="modalTop"><div class="avatar">💰</div><div class="modalTitle">Admin reward</div></div>
      <div class="modalBody v238Body">
        <div class="card"><b>Gelukt.</b><br>Je kreeg ${money238(REWARD238)} erbij.<br>Bank balance: ${money238(state.money)}</div>
        <button class="btn green" onclick="closeModal()">Nice</button>
      </div>`);
  };

  // Also allow Enter in password input.
  document.addEventListener('keydown', function(ev){
    try{
      if(ev.key==='Enter' && document.getElementById('passwordInput238')){
        ev.preventDefault();
        window.submitPassword238();
      }
    }catch(e){}
  }, true);

  const oldToggle238 = window.toggleMenu || (typeof toggleMenu==='function'?toggleMenu:null);
  if(oldToggle238 && !oldToggle238.__password238){
    window.toggleMenu=function(force){
      const ret=oldToggle238.apply(this,arguments);
      setTimeout(injectPasswordButton238,0);
      return ret;
    };
    window.toggleMenu.__password238=true;
    try{toggleMenu=window.toggleMenu}catch(e){}
  }

  const oldRender238 = window.render || (typeof render==='function'?render:null);
  if(oldRender238 && !oldRender238.__password238){
    window.render=function(){
      const ret=oldRender238.apply(this,arguments);
      setTimeout(injectPasswordButton238,0);
      return ret;
    };
    window.render.__password238=true;
    try{render=window.render}catch(e){}
  }

  window.debugPasswordMode238=function(){
    injectPasswordButton238();
    window.passwordMode238();
  };

  setTimeout(injectPasswordButton238,300);
})();
