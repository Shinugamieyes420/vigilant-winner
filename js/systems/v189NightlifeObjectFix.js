
/* v18.9 Nightlife Object Fix
   Fixes [object Object] in vacation nightlife by reading NIGHT data in the correct order:
   [icon, title, sub, cost, statsObject, text, type].
*/
(function(){
  function r189(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function c189(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money189(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast189(t){try{toast(t)}catch(e){console.log(t)}}
  function save189(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function norm189(x){
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
  function label189(p){p=norm189(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function dlc189(place){
    place=norm189(place);
    state.dlcTravel=state.dlcTravel||{};
    state.dlcTravel[place]=state.dlcTravel[place]||{days:0,vibe:50,contacts:0,souvenirs:0,spent:0,memories:0,party:0,localRep:0,romance:0};
    return state.dlcTravel[place];
  }
  function spend189(place,cost){
    cost=cost||0;
    if((state.money||0)<cost){toast189('Niet genoeg geld: '+money189(cost));return false}
    state.money-=cost;
    const d=dlc189(place);
    d.spent=(d.spent||0)+cost;
    return true;
  }
  function bump189(key,delta){
    if(!delta)return;
    state.stats=state.stats||{};
    if(['Happiness','Health','Smarts','Looks'].includes(key)) state.stats[key]=c189((state.stats[key]??50)+delta);
    if(key==='Happiness' && typeof state.happiness==='number')state.happiness=c189(state.happiness+delta);
    if(key==='Health' && typeof state.health==='number')state.health=c189(state.health+delta);
    if(key==='Smarts' && typeof state.smarts==='number')state.smarts=c189(state.smarts+delta);
    if(key==='Looks' && typeof state.looks==='number')state.looks=c189(state.looks+delta);
    if(key==='Fitness')state.fitness=c189((state.fitness??50)+delta);
    if(key==='Stamina')state.stamina=c189((state.stamina??50)+delta);
    if(key==='Social')state.social=c189((state.social??0)+delta,0,999999);
    if(key==='Fame')state.fame=c189((state.fame??0)+delta,0,999999);
  }
  function apply189(stats){
    stats=stats||{};
    try{applyStats(stats)}catch(e){}
    Object.keys(stats).forEach(k=>bump189(k,stats[k]));
  }
  function effect189(stats,cash){
    const out=[];
    stats=stats||{};
    Object.keys(stats).forEach(k=>{if(stats[k])out.push(k+' '+(stats[k]>0?'+':'')+stats[k])});
    if(cash)out.push('Money '+(cash>0?'+':'')+money189(cash));
    return out.join(' · ');
  }
  function show189(icon,title,text,stats,cash,type){
    stats=stats||{};
    if(cash)state.money=(state.money||0)+cash;
    apply189(stats);
    const fx=effect189(stats,cash);
    try{addLog('<b>'+title+'</b><br>'+text+(fx?'<br><span class="mini">Effect: '+fx+'</span>':''),type||'good',false)}catch(e){}
    try{
      showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${fx?`<div class="vac187-effect">Effect: ${fx}</div>`:''}<button class="btn" onclick="closeModal()">Verder</button></div>`);
    }catch(e){toast189(title)}
    save189();
  }

  const NIGHT189={
    spain:[
      ['🍷','Drankjes in tapasbar','€55 · Happiness/Social +, Health/Stamina -',55,{Happiness:7,Social:8,Health:-1,Stamina:-4},'Je deed drankjes in een tapasbar. Sfeer top, energie iets minder.','drink'],
      ['💬','Flirten / date zoeken','€40 · Looks/Social/Happiness +',40,{Happiness:6,Looks:2,Social:10,Stamina:-2},'Je flirtte met iemand in Madrid. Geen garantie op liefde, wel een leuke avond.','romance'],
      ['💃','Flamenco & dansen','€85 · Happiness/Fitness +',85,{Happiness:8,Fitness:2,Stamina:-6},'Je danste en keek flamenco. Spanje voelde eindelijk levend.','party'],
      ['🌙','Rustige avondwandeling','gratis · Stamina/Health +',0,{Happiness:3,Health:1,Stamina:4},'Je koos een rustige avond. Soms is slim ook leuk.','safe']
    ],
    america:[
      ['🍺','Drinks in sports bar','€70 · Happiness/Social +',70,{Happiness:7,Social:8,Health:-1,Stamina:-4},'Je deed drankjes in een sports bar. Schermen overal, gesprekken overal.','drink'],
      ['💬','Flirten / date zoeken','€60 · Looks/Social +',60,{Happiness:6,Looks:2,Social:12,Stamina:-3},'Je flirtte tijdens een avond uit. Amerikaans direct, soms cringe, soms raak.','romance'],
      ['🎧','LA club night','€180 · Fame/Looks/Happiness +, risico',180,{Happiness:10,Looks:2,Fame:2,Health:-1,Stamina:-10},'De club was duur, luid en filmisch. Je kreeg aandacht, maar je lichaam betaalde.','party'],
      ['🍔','Late night diner','€35 · veilige social',35,{Happiness:5,Health:-1,Stamina:1},'Je eindigde veilig in een diner. Minder chaos, wel goed verhaal.','safe']
    ],
    japan:[
      ['🍶','Izakaya drinks','€65 · Happiness/Social +',65,{Happiness:7,Social:7,Health:-1,Stamina:-4},'Je dronk in een izakaya. Klein, warm, druk en sociaal.','drink'],
      ['🎤','Karaoke box','€90 · Happiness/Social +',90,{Happiness:9,Social:10,Stamina:-6},'Je zong alsof niemand je kende. Dat hielp enorm.','party'],
      ['💬','Flirten / locals ontmoeten','€55 · Social/Smarts +',55,{Happiness:5,Social:10,Smarts:1,Stamina:-2},'Je raakte aan de praat met locals. Niet makkelijk, wel waardevol.','romance'],
      ['🚶','Shibuya night walk','€30 · veilig city vibe',30,{Happiness:5,Looks:1,Stamina:-2},'Je liep door Shibuya zonder jezelf kapot te maken. Slimme vakantie.','safe']
    ],
    amsterdam:[
      ['🍻','Drinken in bar','€50 · Happiness/Social +',50,{Happiness:7,Social:8,Health:-1,Stamina:-4},'Je deed drankjes in Amsterdam. Gezellig, duurder dan gehoopt.','drink'],
      ['💬','Flirten / date zoeken','€35 · Looks/Social +',35,{Happiness:6,Looks:2,Social:10,Stamina:-2},'Je flirtte tijdens het uitgaan. Niet iedereen hapte, maar de avond leefde.','romance'],
      ['🎧','Club night','€90 · Happiness/Looks +',90,{Happiness:9,Looks:2,Health:-1,Stamina:-9},'De club was druk en hard. Precies waarvoor je kwam.','party'],
      ['🍟','Late snack run','€18 · kleine happiness',18,{Happiness:4,Health:-1},'Een late snack loste meer op dan je wilde toegeven.','safe']
    ],
    jamaica:[
      ['🍹','Drinks bij strandbar','€55 · Happiness/Social +',55,{Happiness:8,Social:7,Health:-1,Stamina:-3},'Je dronk bij een strandbar. Rustig begin, sterke sfeer.','drink'],
      ['💃','Dancehall night','€100 · party/social',100,{Happiness:10,Looks:1,Social:12,Health:-1,Stamina:-8},'Dancehall was energie, zweet en chaos.','party'],
      ['💬','Flirten / beach social','€40 · Social/Looks +',40,{Happiness:6,Looks:2,Social:9,Stamina:-2},'Je maakte contact op het strand. Relaxed, direct en vrolijk.','romance'],
      ['🎸','Live reggae band','€75 · happiness',75,{Happiness:9,Stamina:-4},'De band speelde alsof de avond geen eindtijd had.','safe']
    ],
    nightcity:[
      ['🍸','Neon drinks','€80 · Happiness/Social +, risk',80,{Happiness:8,Social:8,Health:-2,Stamina:-5},'De drankjes gloeiden bijna. Night City blijft slecht voor je gezondheid.','drink'],
      ['💬','Flirten in neon club','€90 · Looks/Social +, heat risk',90,{Happiness:6,Looks:2,Social:12,Stamina:-4},'Je flirtte in neonlicht. Mooi, gevaarlijk, niet helemaal betrouwbaar.','romance'],
      ['🎛️','Main floor club','€120 · party/heat',120,{Happiness:10,Looks:1,Health:-2,Stamina:-10},'Bass, rook en neon. Geweldig en twijfelachtig tegelijk.','party'],
      ['🚪','Veilig terugtrekken','gratis · Health/Stamina +',0,{Health:2,Stamina:5,Happiness:1},'Je koos veiligheid. In Night City is dat soms de slimste move.','safe']
    ]
  };

  // Override the broken v18.7 function.
  window.dlc187NightPick=function(place,i){
    place=norm189(place);
    const n=(NIGHT189[place]||NIGHT189.spain)[i];
    if(!n)return toast189('Nightlife keuze niet gevonden.');
    const icon=n[0], title=n[1], cost=n[3], stats=n[4], text=n[5], type=n[6];

    if(!spend189(place,cost))return;

    const d=dlc189(place);
    d.party=(d.party||0)+1;
    d.memories=(d.memories||0)+1;
    d.vibe=c189((d.vibe||50)+r189(3,8));

    if(type==='drink'){
      state.addiction=state.addiction||{};
      state.addiction.alcoholBuzz=true;
      state.addiction.underInfluence=true;
    }

    if(type==='romance'){
      d.romance=(d.romance||0)+1;
      d.contacts=(d.contacts||0)+1;
      if(Math.random()<0.35){
        state.friends=state.friends||[];
        state.friends.push({
          name:['Sofia','Maya','Lina','Jess','Aiko','Rosa','Naomi','Elena'][r189(0,7)],
          rel:45,
          metAt:label189(place),
          type:'vacation_contact'
        });
      }
    }

    show189(icon,title,text,stats,0,type==='drink'?'warn':'good');
  };

  // Also make sure the choice menu still points to the corrected function.
  window.dlc187Nightlife=function(place){
    place=norm189(place);
    if((state.age||0)<18)return toast189('Uitgaan met drank/flirten is 18+.');
    const list=NIGHT189[place]||NIGHT189.spain;
    let out='';
    try{
      out += `<div class="vac188Info"><b>${label189(place)} nightlife</b><br>Kies wat je doet. Drank maakt je tijdelijk onder invloed; flirten kan contacten toevoegen.</div>`;
    }catch(e){}
    list.forEach((n,i)=>{
      const locked=(state.money||0)<n[3];
      try{
        out += row(n[0],n[1],n[2],`dlc187NightPick('${place}',${i})`,locked);
      }catch(e){
        out += `<div class="row ${locked?'locked':''}" onclick="${locked?'':`dlc187NightPick('${place}',${i})`}"><div class="rIco">${n[0]}</div><div><div class="rTitle">${n[1]}</div><div class="sub">${n[2]}</div></div><div class="chev">›</div></div>`;
      }
    });
    showModal(`<div class="modalTop"><div class="avatar">🌃</div><div class="modalTitle">${label189(place)} nightlife</div></div><div class="modalBody" style="text-align:left">${out}<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button></div>`);
  };
})();
