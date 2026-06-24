# BitzLife v16.9 Folder Project

Deze build is opgesplitst in mappen zodat systemen niet meer door één enorme HTML lopen.

## Starten
Open `index.html` in je browser.

## Nieuwe structuur

- `css/styles.css` — styling en mobiel scherm
- `js/app.js` — bestaande BitzLife core uit v16.8
- `js/data/places/` — plaatsen en wereldregels
  - `enkhuizen.js`
  - `alkmaar.js`
  - `amsterdam.js`
  - `nightcity.js`
  - `japan.js`
  - `america.js`
- `js/data/sports/` — voetbal, WWE/UFC/Glory data
- `js/data/businesses/` — business types en business events
- `js/systems/` — gedeelde regels voor money, rankings, fights, careers, progression
- `js/systems/worldExpansion.js` — centrale wereldkaart, USA trip en city-aware business hub

## Toegevoegd in v16.9

- Japan/Tokyo staat nu ook als echte place-data naast de bestaande Japan-vakantie.
- Amerika/USA toegevoegd met WWE, UFC, business, fame, road trip en dure clinic-events.
- Wereldkaart toegevoegd onder Activities en Life.
- Plaatsen hebben nu duidelijke modifiers: huur, job multiplier, business klanten, crime-risk, fame bonus en sportfocus.
- Eigen business hub gebruikt nu stad-modifiers: Amsterdam/Japan/Amerika/Night City geven andere kansen en risico’s.
- Data klaar voor voetbal, WWE, UFC, GLORY, rankings en progression.

## Volgende logische stap

De bestaande core is intact gehouden. De nieuwe data en hub zijn aangesloten zonder de oude save te slopen. De volgende stap is om Age Up nog centraler te maken: salaris → vaste lasten → sportprogressie → business → random city-event.

## v17.0 Logic update

- DLC places now separate **vacation/city trip** from **living/residence**.
- Vacation is temporary: events, souvenirs, contacts, clinics and training only.
- Living/residence is permanent: local jobs, business, sports routes, rent pressure and yearly events become active.
- Permanent moving is 18+ and blocked while already on vacation.
- Japan and America now have resident-mode activity hubs if you move there.
- Starting a local business while on vacation is blocked; you must live there first.
- Substance rules are age-gated:
  - Under 16: no drugs/weed buying or usage.
  - Age 16-17: no shop/coffeeshop purchase; only risky street dealer route.
  - Age 18+: shop/coffeeshop route is available where the gameworld supports it.


## v17.1 Minor Finance Guard

- Onder 18 kunnen random events, lifestyle-kosten, huisdieren, assets of oude save-data geen schulden meer maken.
- Cash wordt onder 18 nooit negatief.
- Leningen, studieschuld en lifestyle-leningen zijn pas vanaf 18.
- Vrijwillige aankopen blijven logisch: te weinig geld betekent gewoon dat de aankoop niet doorgaat.
- 16-17 straatdealer-route blijft riskant, maar boetes/kosten worden begrensd zodat er geen schuld ontstaat.

## v17.2 Career Unified

Werk 1.0 en Werk 2.0 zijn samengevoegd onder één Career Hub.

- Werk 1.0 = bijbanen, instapwerk en normale banen voor geld.
- Werk 2.0 = carrièrepaden met route, ervaring, reputatie, performance, stress, promoties en volgende stappen.
- Banen krijgen automatisch een route: ICT, sociaal werk, overheid, retail, horeca, logistiek, zorg, techniek, veiligheid, management, finance, juridisch, medisch, creative/media of pro sports.
- Lokale banen gebruiken de woonplaats/DLC-data, dus Amsterdam/Japan/Amerika/Alkmaar/Enkhuizen/Night City voelen logischer.
- Pro-sportcontracten blokkeren normale banen zolang ze actief zijn.
- Age Up geeft nu ook carrière-events: route-XP, stress, waarschuwingen en promotiekansen.


## v17.3 Career + 500 Life Texts

- Werk 1.0 en Werk 2.0 blijven samengevoegd in één Career Hub.
- Toegevoegd: `js/data/life/lifeTexts500.js` met exact 500 extra life-events.
- Toegevoegd: `js/systems/lifeTextSystem.js`, dat jaarlijks context-aware extra gebeurtenissen toevoegt.
- Life texts zijn verdeeld over jeugd, school, familie, sociaal leven, werk, business, voetbal, vechtsport, reizen, Amsterdam, Japan, Amerika, Night City, thuis en relaties.
- Minderjarigen-filter: teksten met adult/minor-risk/debt/drugs tags worden onder 18 niet gekozen.
- Plaats-filter: Japan/Amerika/Amsterdam/Night City events verschijnen vooral als je daar bent of woont.


## v17.4 Travel Guard + Country Logic

- Stoned/high/under influence blocks travel to another country/city.
- A sober/rest action is available so the player cannot get stuck on vacation.
- Vacation and living are separated:
  - Vacation: temporary events, training, contacts, souvenirs.
  - Living: local jobs, business, sport careers, costs and yearly events.
- America and Japan actions now also work when the player lives there, not only during vacation.
- Business start remains blocked on vacation but works in resident mode.
- World map now routes through a central guarded travel layer so older buttons cannot bypass the rule.


## v17.5 Realistic Economy + Event Queue
- Geen automatische €12.000 tijdelijke woonkosten meer als iemand 18+ is zonder eigen woning.
- Nieuwe woonstatus: thuis/familie, studentenkamer, couchsurfing, dakloos, huur/koop.
- Netto salaris kan niet hoger zijn dan bruto; toeslagen worden niet meer als salaris gemengd.
- Kapotte wasmachine/huisreparaties alleen als speler een eigen huishouden heeft.
- Event queue: verjaardags-/jaarverslagmodals overschrijven elkaar niet meer; ze komen omstebeurt.
- Maximaal één Verjaardag-log per leeftijd.


## v17.6 Job Separation + Time System

Deze versie scheidt werk logisch:

- `state.sideJob` = bijbaan naast school/studie.
- `state.job` = gewone baan, stage/leerwerk of carrièrebaan.
- Onder 18 blijft school hoofdactiviteit.
- Bijbanen hebben eigen bijbaan-update en veroorzaken geen volwassen career-review.
- Gewone banen en carrièrebanen zijn 18+ en gebruiken echte werkuren.
- Tijdindeling rekent school/studie, bijbaan, werk, sport en business mee.
- Te veel verplichtingen geven stress/stamina/health/schoolfocus penalties.
- Career Hub heeft nu aparte knoppen voor Bijbaan, Stage/leerwerk, Gewone baan en Carrièrebaan.


## v17.9 Side Job Display Fix
- Life tab Career toont nu ook bijbanen zoals krantenbezorger.
- Bijbaan en gewone baan worden gecombineerd weergegeven als beide actief zijn.
- Oude sideJob saves worden genormaliseerd met title, weeklyHours en type.
- Career-menu krijgt een extra werkstatus-card wanneer er een bijbaan actief is.
