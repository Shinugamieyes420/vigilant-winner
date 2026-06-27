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

## v18.0 Vacation Router + Item System Update
- USA, Japan, Amsterdam, Jamaica, Night City en Spanje vakanties lopen via één werkende Vacation Hub.
- Alkmaar is vervangen door Spanje. Oude Alkmaar-saves en knoppen worden automatisch naar Spanje geleid.
- Alle vakantieknoppen hebben nu een echte actie met kosten, leeftijdscheck, vacation/resident-check en effect.
- Terugreizen blijft geblokkeerd als je onder invloed bent, maar lokale vakantie-acties blijven werken waar logisch.
- Oude USA/Japan/Amsterdam/Jamaica/Night City/Alkmaar schermnamen worden naar de nieuwe hub geleid, zodat knoppen niet dood zijn.
- Nieuwe Item Shop v18 met categorieën, locatie-locks, leeftijdslocks, gebruik, repareren en verkopen.
- Nieuwe items: fietsen, laptops, gaming, camera, fitness, voetbal, fight gear, collectibles, Spanje-items en lokale DLC-items.


## v18.1 Jail Travel / Moving Lock
- Gevangenis/jeugddetentie blokkeert nu vakantie, terugreizen, resident-switches, emigreren en verhuizen.
- Oude én nieuwe travel-knoppen worden via dezelfde jail guard geblokkeerd.
- Als je tijdens vakantie veroordeeld wordt, wordt de vakantie direct afgebroken en keer je terug naar je woonplaats voordat de straf ingaat.
- Vacation Hub v18 is niet toegankelijk zolang jail.yearsLeft > 0.

## v18.2 Spain DLC Final
- Spanje is nu een volwaardige DLC-locatie, niet alleen een lege fallback.
- De final router wordt als laatste geladen, na worldTravelGuard174, zodat Spanje niet meer wordt overschreven door de oude vakantie-fallback.
- Op vakantie in Spanje zie je direct Spaanse activiteiten in Activities:
  tapas, stranddag, La Liga, voetbal clinic, Spaanse taalles, flamenco, Barcelona sightseeing, mercado, siësta, nightlife, fight gym en terug naar huis.
- Spanje resident mode heeft resident-only routes zoals tourism network en beach bar business.
- Alkmaar is definitief vervangen door Spanje, met backward compatibility voor oude saves/knoppen.


## v18.3 Fight Recovery + Injury Prevention
- Glory/UFC career heeft nu een aparte knop: Herstel & blessurepreventie.
- Herstelmenu toegevoegd: rustdag/herstelweek, mobiliteit + lichte techniek, fysio/ijsbad, medische check en fight camp pauzeren.
- Hard trainen verhoogt overtraining en blessurerisico; herstel verlaagt dit.
- Sparren wordt geblokkeerd bij te hoog blessurerisico.
- Vechten wordt geblokkeerd bij extreem blessurerisico.
- Contract-objecten tonen nu leesbare tekst in plaats van [object Object].

## v18.4 School Tracks + Combat Merge + Relationship Group Talk
- Nieuw Education v18.4 menu met basisschool, VMBO/HAVO/VWO, MBO/HBO/Universiteit en stage/leerwerk.
- VMBO stroomt logisch door naar MBO, HAVO naar HBO, VWO naar universiteit; MBO kan ook later naar HBO.
- School heeft cijfers, aanwezigheid, gedrag, stress, huiswerk, mentorrelatie en schoolvrienden.
- Schooljaar verwerkt diploma's, blijven zitten/inhaaltraject en botsing met bijbaan/sport/combat.
- Nieuwe Groepsgesprekken-knop bij Relaties: ouders, gezin, vrienden, iedereen of ruzies gladstrijken in één keer.
- Combat Sports v18.4 centraliseert oude GLORY/UFC en Combat Career naar één hub met lokale gym, toelating, training, sparring, wedstrijden, hoger niveau en herstel.
- Laag niveau trainen is makkelijk; sparren, vechten en hogerop komen hebben toelatingseisen.

## v18.5 Vacation DLC Big Update
- Spanje staat nog maar één keer in de wereldlijst; Alkmaar is verborgen en oude Alkmaar-saves worden naar Spanje geleid.
- Vakanties zijn weer interactiever: keuzes, uitgaan, locals, specials, souvenirs, risico’s en mini-events.
- Spanje heeft nu een rijkere DLC: tapas-keuzes, strandkeuzes, La Liga, pickup voetbal, Madrid nightlife, flamenco, mercado, Barcelona, Spaanse taal, fight gym, tourism network en beach bar business.
- USA, Japan, Amsterdam, Jamaica en Night City hebben ook interactieve vakantiekeuzes en specials.
- Resident/wonen-hubs blijven bestaan, maar zijn zakelijker: business, netwerk, taal/werkcultuur en lokale routes.
- De v18.5 vacation router wordt als allerlaatste geladen, zodat school/combat patches de rijke vakantie-acties niet meer platdrukken.

## v18.6 Vacation UI Click Fix
- Vakantiekaarten zijn weer donker en in normale BitzLife-stijl in plaats van witte kaarten.
- Landenthema blijft subtiel bestaan: Spanje rood/geel, Japan roze/wit, USA blauw/rood, enz.
- Klikbug gefixt: alle vakantie-keuzes gebruiken nu veilige onclick-handlers met single quotes.
- Spanje, USA, Japan, Amsterdam, Jamaica en Night City hebben klikbare activiteiten, keuzes, uitgaan, specials en resident-routes.
- Wereldkaart blijft gededuped: Spanje één keer, Alkmaar verborgen/omgezet naar Spanje.

## v18.7 Vacation Effects + Nightlife + DLC Shops
- Vakantie-acties geven nu zichtbaar effect op Happiness, Health, Smarts, Looks, Fitness, Stamina, Social en Fame.
- Effecten worden direct handmatig toegepast én via applyStats, zodat de statusbalken echt veranderen.
- Elke actie toont nu een effectregel in de log/modal.
- Alle DLC's hebben betere nightlife:
  drinken, flirten/daten, dansen/club, rustige veilige optie.
- Drinken is 18+ en zet een tijdelijke onder-invloed status, waardoor je eerst moet ontnuchteren voordat je reist.
- Flirten/daten kan vacation contacts toevoegen en verhoogt social/looks/happiness.
- Elke DLC heeft een shop/items-sectie met lokale souvenirs en bruikbare items.
- Spanje, USA, Japan, Amsterdam, Jamaica en Night City zijn allemaal bijgewerkt.

## v18.8 Vacation Original Look
- DLC-functionaliteit van v18.7 blijft bestaan, maar de vakantie-DLC UI gebruikt weer de originele BitzLife-achtige layout.
- Activities, nightlife, shops, world map en place detail screens gebruiken weer standaard sections, rows en modals.
- Minder afwijkende witte/losse DLC kaarten; meer één geheel met de rest van de game.
- Landenthema blijft subtiel via een dunne theme-accent op de info-card.

## v18.9 Nightlife Object Fix
- Fix voor uitgaan op vakantie: [object Object] verdwijnt.
- Flirten/daten en drinken lezen de nightlife data nu in de juiste volgorde.
- Tekst en stat-effecten worden weer normaal getoond.
- Effectregels tonen weer Happiness/Social/Looks/Stamina enzovoort, niet losse letters.
- Drinking zet nog steeds tijdelijk onder invloed; flirten kan vacation contacts toevoegen.

## v19.0 Visual Effect Bars
- Effectregels in vakantie/nightlife/shop modals worden nu visuele balken.
- Positieve effecten tonen groene balken.
- Negatieve effecten tonen rode balken.
- Neutrale/waarschuwende effecten kunnen oranje tonen.
- De oude tekst zoals "Happiness +1" wordt in modals vervangen door statbalken met waarde rechts.

## v19.1 World Map Dedupe + Vacation People/Romance
- Wereldkaart wordt gefilterd zodat er nog maar één Wereldkaart / plaatsen row overblijft.
- Vakanties krijgen een nieuwe Mensen & romance sectie.
- Je kunt mensen ontmoeten, telefoonnummers wisselen, appen, daten en 18+ intiem worden.
- Intimiteit is alleen 18+, consensueel en niet grafisch; als er geen chemie is blijft het bij flirten.
- Flirten/daten tijdens nightlife kan nu ook vacation contacts, nummers en romance-score opbouwen.
- Vakantiecontacten-scherm toont naam, band, chemie, telefoonnummer en romance-status.

## v19.2 Group Talk Original UI Fix
- Groepsgesprekken-menu gebruikt nu weer de originele BitzLife-stijl: sections, rows, card en standaard modal.
- Geen witte custom kaarten meer.
- Knoppen werken opnieuw: gezinsgesprek, ouders, vriendengroep, iedereen check-in en ruzies gladstrijken.
- Relatieboost wordt echt toegepast op ouders, partner, kinderen, siblings, vrienden en vakantiecontacten.
- Groepsgesprekken-row wordt opnieuw schoon toegevoegd aan Relationships.

## v19.3 Activities Cleanup
- Activities scherm wordt nu als laatste opgeschoond.
- Reisstatus wordt nog maar één keer getoond.
- Wereldkaart / plaatsen wordt nog maar één keer getoond.
- Dubbele Wereld & systemen / Wereld & vakantie-DLC sections worden verwijderd.
- Oude disabled America trip row wordt verwijderd omdat wereldkaart de correcte route is.
- Als je op vakantie bent, komt er één duidelijke vakantie-DLC row bij.

## v19.4 Group Talk Expanded Fix
- Groepsgesprekken-knoppen werken nu met veilige onclick handlers.
- Groepsgesprekken is uitgebreid: eerst kies je groep, daarna gesprekstype.
- Gesprekstypes: warm bijpraten, serieus gesprek, samen iets leuks doen, hulp aanbieden, advies vragen, sorry/ruzie oplossen, groepsapp, uitgaan plannen, etc.
- Relatieboost wordt per persoon toegepast en geeft een resultaat met effectbalken.
- Relationships-scherm toont nog maar één Groepsgesprekken-row.

## v19.5 DLC Nightlife Original Logic Rework
- Vakantie-uitgaan is opnieuw gebouwd op de originele BitzLife-logica: locatie kiezen → drinken / chick versieren / lol hebben / mensen ontmoeten / rustig socializen.
- Chick versieren opent nu een profiel met leeftijd, looks, vibe, klikscore en kansen.
- Je kunt nummer vragen, date voorstellen of een one-night stand proberen.
- One-night stand is alleen 18+, consensueel, niet grafisch en kans-gebaseerd.
- Nummer krijgen maakt een vacation contact/fling aan.
- Mensen ontmoeten kan nieuwe vakantiecontacten toevoegen.
- Drinken gebruikt alcohol/onder-invloed logica en blokkeert reizen tot je ontnuchtert.
- Toegevoegd: 360 vakantie/uitgaan/ontmoetingstekst-variaties voor Spanje, USA, Japan, Amsterdam, Jamaica en Night City.

## v19.6 Full Vacation Original Logic
- Niet alleen nightlife, maar vrijwel alle vakantie-activiteiten werken nu als mini-flow.
- Activiteiten zoals tapas, strand, La Liga, roadtrip, Hollywood, ramen, arcade, tempel, dojo, museum, festival, boottocht, markt, cyber clinic en business checks openen nu een keuze-menu.
- Elke keuze heeft kosten, succes/faal-kans, risico, stat-effecten, en mogelijke extra beloning.
- Mogelijke uitkomsten: nieuw vakantiecontact, item/souvenir, skill progressie, business lead, football form, cyberware, herstel of risico/fail.
- Toegevoegd: 720 tekstvariaties voor non-nightlife vakantie-activiteiten bovenop de v19.5 nightlife teksten.

## v19.7 Family Age + Role Sync
- Fix voor broers/zussen die sneller ouder werden dan de speler door meerdere ageUp-patches.
- Familieleden krijgen een locked leeftijdsverschil t.o.v. de speler.
- Jongere siblings blijven 'zusje/broertje' heten, ook als ze volwassen worden.
- Oudere siblings tonen als 'oudere zus/oude broer'; tweeling als tweeling.
- Sibling detailpagina heeft correctieknoppen: jonger / ouder / tweeling.
- Ouders tonen nu ook hun leeftijd in de Relationships-lijst.
- Parent/sibling ages worden na elke verjaardag opnieuw gesynchroniseerd.

## v19.8 Child Naming + Fertility Rules
- Bij een succesvol biologisch kind krijg je nu een naam-popup met voornaam en achternaam.
- Je kunt bestaande kinderen hernoemen via de child detailpagina.
- Vrouwen kunnen vanaf 48 jaar geen natuurlijke kinderen meer krijgen.
- Vruchtbaarheid is logischer: normale kans t/m 34, lager na 35, laag na 40, heel laag 45-47, nul vanaf 48.
- Partnerpagina toont vruchtbaarheidsstatus en geschatte kans.
- Adoptie toegevoegd als logische optie wanneer natuurlijke zwangerschap niet kan of niet gewenst is.

## v19.9 Appearance Genetics + Regional Avatar System
- Personen krijgen nu een appearance object: skinTone, hairColor, hairStyle, hairTexture, eyeColor, regionOrigin en originMix.
- Random NPCs/vakantiecontacten krijgen appearance op basis van regio: Nederland vaker licht, Jamaica vaker donker, Japan/Spanje/USA eigen pools.
- Kinderen erven uiterlijk genetisch van ouders: huidtint gemiddeld met variatie, haar/ogen via ouderlijke traits.
- Emoji's krijgen passende huidtint-modifiers waar mogelijk.
- Detailprofielen krijgen een kleine custom CSS-avatar met huid- en haarlaag.
- Nieuwe Kapper-functie: kapsel/haarkleur wijzigen zonder huidtint, ogen of afkomst te veranderen.
- Huidkleur beïnvloedt geen stats, gedrag, school, werk, criminaliteit of kansen.

## v20.0 iPhone Safari Safe-Area Bottom Fix
- Fix voor iPhone Safari waarbij de onderste Looks/stat buiten beeld of achter de browser/home-bar viel.
- Viewport krijgt `viewport-fit=cover`.
- CSS gebruikt `env(safe-area-inset-bottom)` en extra bottom padding op app/screen wrappers.
- Bottom nav/stat bars krijgen veilige onderruimte.
- Android blijft praktisch hetzelfde, maar krijgt veilige extra scrollruimte op kleine touchscreens.

## v20.1 Parent Bankruptcy + Animal Crime Orphan Mode + Business 18+
- Ouders hebben nu verborgen oudergeld en oudersteun-teller.
- 10 fietsen/cadeaus/financiële hulp door ouders of oudergeld op = ouders failliet, verhuizing, speler terug naar €0 en zware negatieve stats.
- Parent detailpagina heeft extra opties om fiets/e-bike te vragen; dit telt mee voor faillissementsrisico.
- Huisdieren door ouders betaald tellen ook als oudersteun.
- Dieren verkopen telt nu lifetime mee.
- 4e dierverkoop: random/verhaal-event dat het dier snel sterft bij nieuwe eigenaar; eigenaar wordt boos, slaat je in elkaar, health daalt hard.
- 5e dierverkoop: illegale dierenhandel.
  - Onder 18: ouders worden opgepakt/verantwoordelijk gehouden en speler gaat in Wees mode.
  - Vanaf 18: speler wordt zelf veroordeeld tot 4 jaar gevangenis.
- Wees mode toegevoegd met jeugdzorg/pleeggezin acties en yearly events.
- Investeren en eigen business zijn expliciet vanaf 18; onder 18 geblokkeerd.

## v20.2 Activities Restore + Full Patch Debug
- Kritieke fix voor v20.1: typfout `activitiesHTML=window.activities201` hersteld naar `activitiesHTML=window.activitiesHTML`.
- Extra safety patch toegevoegd zodat Activities nooit meer volledig crasht als een wrapper stuk gaat.
- Oude activiteiten blijven bereikbaar; nieuwe systemen worden alleen toegevoegd als extra rows.
- Fallback Activities-scherm bevat Work, Education, Gym, Pets, Kapper, Money/Lifestyle, Business, Travel, Crime, Familie-risico, Sport-carrières en Patch Status.
- ScreenHTML krijgt een defensive fallback voor het Activities-tabblad.
- Duplicate rows worden licht opgeschoond.

## v20.3 Legacy Continue Heirs
- Death screen uitgebreid: na je dood kun je verder spelen als kind, sibling, kleinkind of neefje/nichtje als die bestaan.
- Oude `continueAsChild` blijft werken, maar gebruikt nu de verbeterde erfgenaam-logica.
- Erfgenamen krijgen eigen naam, leeftijd, gender, appearance, ouders/siblings/relaties en eigen log.
- Overleden speler komt in legacy memorials.
- Volwassen erfgenamen erven cash plus huizen, auto’s, items, pets, businesses en investeringen.
- Minderjarige erfgenamen krijgen deels cash en een trust fund; grote assets staan onder beheer tot 18.
- Trust fund komt automatisch vrij wanneer je 18 wordt.

## v20.4 Activities Master Router + Original BitzLife Style
- Hoofd-Activities volledig vervangen door één centrale master router zonder dubbele rijen.
- Originele donkere BitzLife layout behouden: sections, rows, cards, modalTop/modalBody.
- Nieuwe hoofdindeling:
  - Werk & School
  - Gezondheid & Uiterlijk
  - Relaties & Familie
  - Geld & Lifestyle
  - Reizen & Wereld
  - Sport & Combat
  - Huisdieren
  - Crime & Risico
  - Legacy & Status
- Verspreide functies worden samengevoegd in hubs, zonder oude functies weg te gooien.
- Sport & Combat bundelt football, combat career, amateur, semi-pro, pro, UFC, GLORY, WWE en rankings.
- DLC/reizen opnieuw ingedeeld: wereldkaart, huidige vakantie, per land, activiteit-logica, nightlife, shops, contacten.
- Pets, dierenverkoop-risico, ouderfailliet, wees mode en business/investeren staan op logische plekken.
- Activities wordt niet meer gevuld door losse oude injecties; v20.4 bepaalt de hoofdstructuur.
