
/* v22.2 Assets Emoji Item Icon Guard
   Fix: broad sprite patches treated items/assets as people because they have "name".
   Items now always use emoji icons, while people keep PNG sprites.
*/
(function(){
  const ITEM_EMOJI222 = [
    [/fiets|bike|bicycle|e-bike|ebike/i, '🚲'],
    [/gaming pc|computer|pc|laptop|desktop|setup/i, '🖥️'],
    [/fitness set|fitness|dumbbell|halters|gym set|training set/i, '🏋️'],
    [/beach outfit|strand|swim|zwem|bikini|short|outfit|kleding|clothes/i, '👕'],
    [/ufc glove|boxing glove|glove|bokshandschoen|mma/i, '🥊'],
    [/joint|jonko|weed|wiet|hash|cannabis/i, '🚬'],
    [/camera|foto|photo|cam/i, '📷'],
    [/souvenir|gift|cadeau/i, '🎁'],
    [/book|boek|studieboeken/i, '📚'],
    [/ring|trouwring/i, '💍'],
    [/ticket|kaartje|pass/i, '🎟️'],
    [/sunglasses|zonnebril/i, '🕶️'],
    [/guitar|gitaar/i, '🎸'],
    [/record|vinyl|plaat/i, '💿'],
    [/mask|masker/i, '🎭'],
    [/jacket|jas|hoodie/i, '🧥'],
    [/cyberdeck|deck|datachip/i, '💻'],
    [/medkit|medkit|medic|ehbo/i, '🩹'],
    [/auto|car/i, '🚗'],
    [/house|huis|apartment|appartement/i, '🏠']
  ];

  function itemEmoji222(name,type){
    const text=String(name||type||'').toLowerCase();
    for(const [re,icon] of ITEM_EMOJI222){ if(re.test(text)) return icon; }
    return '🎁';
  }
  window.itemEmoji222 = itemEmoji222;

  // Override itemIcon to be emoji-only. This prevents old sprite HTML from being used for assets.
  window.itemIcon = function(name){
    return itemEmoji222(name);
  };
  try{ itemIcon = window.itemIcon; }catch(e){}

  function isSpriteHTML222(x){
    return typeof x === 'string' && x.includes('headSprite');
  }
  function isItemLike222(obj){
    if(!obj || typeof obj !== 'object') return false;
    // Items generally have purchase/value/price/bought fields and no human relationship fields.
    if(obj.type && /pet|dog|cat|horse|rabbit|bird/i.test(String(obj.type))) return false;
    if(obj.breed || obj.health && obj.rel && obj.upkeep) return false; // pet-ish
    const itemSignals = ['value','price','purchaseValue','boughtFor','worth','aankoopwaarde','category','source','itemType'];
    const hasSignal = itemSignals.some(k => Object.prototype.hasOwnProperty.call(obj,k));
    const hasHumanSignal = obj.gender || obj.appearance || obj.role || obj.rel || obj.age;
    if(hasSignal && !hasHumanSignal) return true;
    // state.items entries can be very small: {name,value,icon}
    return !!(obj.name && !hasHumanSignal && !obj.job && !obj.children && !obj.partner);
  }
  function fixOneItem222(it){
    if(!it || typeof it !== 'object') return;
    const icon = itemEmoji222(it.name || it.title || it.type, it.type);
    it.icon = icon;
    it.assetIcon222 = icon;
    // Keep any accidental person/sprite fields away from items.
    delete it.appearance;
    delete it.avatarSpriteKey211;
    delete it.avatarSpriteKey212;
    delete it.avatarSpriteKey213;
    delete it.avatarSpriteKey214;
    delete it.avatarSpriteKey218;
  }
  function fixAllItems222(){
    if(!state) return;
    if(Array.isArray(state.items)) state.items.forEach(fixOneItem222);
    if(Array.isArray(state.inventory)) state.inventory.forEach(fixOneItem222);
    if(Array.isArray(state.assets)) state.assets.forEach(fixOneItem222);
  }
  window.fixAllItemIcons222 = function(){
    fixAllItems222();
    try{safeSave()}catch(e){}
    try{render()}catch(e){}
  };

  // Patch item/asset rows in DOM after old sprite patches touched them.
  function fixAssetDom222(root=document){
    try{
      // Find rows in Assets/Items screens by title and replace rIco if it is a person sprite.
      root.querySelectorAll('.row').forEach(row=>{
        const title = row.querySelector('.rTitle')?.textContent || '';
        if(!title) return;
        const sub = row.querySelector('.sub')?.textContent || '';
        const looksLikeAsset = /aankoopwaarde|waarde|purchase|asset|item/i.test(sub) || (state?.items||[]).some(it=>String(it.name||'').toLowerCase()===title.toLowerCase());
        if(!looksLikeAsset) return;
        const ico=row.querySelector('.rIco');
        if(ico) ico.innerHTML = itemEmoji222(title);
      });
      // Buttons in modal body can also have sprite icons before item names.
      const body = root.querySelector('#screenContent') || root.querySelector('#modal') || root;
      if(body && /Mijn items|Assets|ASSETS/i.test(body.textContent||'')){
        (state?.items||[]).forEach(it=>{
          const icon=itemEmoji222(it.name);
          body.querySelectorAll('img.headSprite206').forEach(img=>{
            const row=img.closest('.row,button,.card,div');
            if(row && row.textContent && row.textContent.includes(it.name)){
              const ico=row.querySelector('.rIco');
              if(ico) ico.innerHTML=icon;
              else img.replaceWith(document.createTextNode(icon));
            }
          });
        });
      }
    }catch(e){}
  }
  window.fixAssetDom222 = fixAssetDom222;

  // Rebuild assets HTML if the project exposes assetsHTML. Otherwise DOM cleanup handles it.
  const oldAssetsHTML222 = window.assetsHTML || (typeof assetsHTML==='function' ? assetsHTML : null);
  if(oldAssetsHTML222 && !oldAssetsHTML222.__itemEmoji222){
    window.assetsHTML = function(){
      fixAllItems222();
      let html = oldAssetsHTML222.apply(this, arguments);
      try{
        const tmp=document.createElement('div');
        tmp.innerHTML=String(html);
        fixAssetDom222(tmp);
        html=tmp.innerHTML;
      }catch(e){}
      return html;
    };
    window.assetsHTML.__itemEmoji222=true;
    try{assetsHTML=window.assetsHTML}catch(e){}
  }

  // Patch item screen if available so item details are not shown with baby/person sprite.
  const oldItemScreen222 = window.itemScreen || (typeof itemScreen==='function' ? itemScreen : null);
  if(oldItemScreen222 && !oldItemScreen222.__itemEmoji222){
    window.itemScreen = function(i){
      fixAllItems222();
      const res = oldItemScreen222.apply(this, arguments);
      setTimeout(()=>fixAssetDom222(document),0);
      return res;
    };
    window.itemScreen.__itemEmoji222=true;
    try{itemScreen=window.itemScreen}catch(e){}
  }

  // Guard broad people walkers by repairing item icons before and after render/save/modal.
  const oldRender222 = window.render || (typeof render==='function'?render:null);
  if(oldRender222 && !oldRender222.__itemEmoji222){
    window.render=function(){
      try{fixAllItems222()}catch(e){}
      const r=oldRender222.apply(this,arguments);
      setTimeout(()=>fixAssetDom222(document),0);
      return r;
    };
    window.render.__itemEmoji222=true;
    try{render=window.render}catch(e){}
  }

  const oldSafeSave222 = window.safeSave || (typeof safeSave==='function'?safeSave:null);
  if(oldSafeSave222 && !oldSafeSave222.__itemEmoji222){
    window.safeSave=function(){
      try{fixAllItems222()}catch(e){}
      return oldSafeSave222.apply(this,arguments);
    };
    window.safeSave.__itemEmoji222=true;
    try{safeSave=window.safeSave}catch(e){}
  }

  const oldShowModal222 = window.showModal || (typeof showModal==='function'?showModal:null);
  if(oldShowModal222 && !oldShowModal222.__itemEmoji222){
    window.showModal=function(html){
      try{fixAllItems222()}catch(e){}
      const r=oldShowModal222.call(this,html);
      setTimeout(()=>fixAssetDom222(document),0);
      return r;
    };
    window.showModal.__itemEmoji222=true;
    try{showModal=window.showModal}catch(e){}
  }

  window.assetsEmojiDebug222=function(){
    fixAllItems222();
    const list=(state?.items||[]).map(it=>`${itemEmoji222(it.name)} ${it.name || 'item'} — icon: ${String(it.icon||'')}`).join('<br>') || 'Geen items.';
    showModal(`<div class="modalTop"><div class="avatar">🎁</div><div class="modalTitle">Assets emoji debug</div></div><div class="modalBody"><div class="card"><b>Items gebruiken emoji</b><br>${list}</div><button class="btn" onclick="fixAllItemIcons222()">Repair item icons</button><button class="btn alt" onclick="closeModal()">Terug</button></div>`);
  };

  setTimeout(()=>{try{fixAllItems222(); fixAssetDom222(document); if(typeof safeSave==='function')safeSave(); if(typeof render==='function')render();}catch(e){}},250);
})();
