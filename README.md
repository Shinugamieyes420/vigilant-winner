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

## v20.5 Unified Business Manager + Realistic Revenue System
- `Eigen business` en `Business classic` zijn samengevoegd tot één business mode: `businessMasterHub205()`.
- Oude `state.businesses` en `state.lifestyle.businesses` worden automatisch gemigreerd naar `state.businessManager205.businesses`.
- Oude business arrays worden leeggemaakt zodat oude yearly business logica niet dubbel winst uitkeert.
- Business vanaf 18 jaar blijft verplicht.
- Business heeft nu realistische jaarformule:
  - omzet
  - vaste kosten
  - variabele kosten
  - personeelskosten
  - marketingkosten
  - administratie/belasting
  - winst/verlies
- Nieuwe business stats:
  - level, reputatie, kwaliteit, marketing, personeel, stress, risico, kostencontrole, cash reserve, waarde.
- Managementacties:
  - uitbreiden
  - personeel aannemen
  - marketingcampagne
  - kwaliteit verbeteren
  - kosten besparen
  - problemen oplossen
  - cash reserve uitbetalen
  - privé bijleggen
  - verkopen
- Jaarlijkse business events met goede/slechte impact.
- Faillissement als cash reserve/risico/verliesreeks te slecht wordt.
- v20.4 Geld & Lifestyle hub aangepast: nog maar één `Eigen Business` knop, geen `Business classic` meer.


## v20.6 Avatar Head Sprite Integration
- De 12 gegenereerde simpele hoofdjes zijn automatisch uitgeknipt en als losse transparante sprites toegevoegd in `assets/avatar_sprites/`.
- Varianten:
  - male_light_blond / brown / black
  - female_light_blond / brown / black
  - male_dark_blond / brown / black
  - female_dark_blond / brown / black
- Compacte avatar-iconen in de game gebruiken nu deze sprite-heads in plaats van losse emoji waar mogelijk.
- `renderPersonEmoji199()` en `humanIcon()` zijn gepatcht om sprite-HTML te geven.
- `refreshSprites206()` houdt icons synchroon na genetics / barber / relaties / classmates.
- Structuur is voorbereid om later extra sprite-sets toe te voegen zoals Asian, kids, ouderen of meer hairstyles.


## v20.7 Alternate Hairstyle Sprite Pack
- De avatar sprites zijn vervangen door een nieuwe set met 1 andere hairstyle voor iedereen.
- Nog steeds 12 basisvarianten:
  - male / female
  - light / dark
  - blond / brown / black
- De nieuwe sprite sheet is technisch correct uitgeknipt naar losse transparante PNG's.
- Bestanden zijn opnieuw geplaatst in `assets/avatar_sprites/`, dus de bestaande avatar integratie blijft direct werken.
- Preview toegevoegd: `assets/avatar_sprites/avatar_sprite_sheet_preview_v207.png`


## v20.8 Age Stage Avatar Sprites
- Avatar sprites ondersteunen nu ook leeftijdsfases:
  - baby (0-3)
  - child/kind (4-12)
  - teen/tiener (13-17)
  - adult/volwassene (18+)
- Voor alle 12 basiscombinaties zijn baby-, child- en teen-varianten toegevoegd.
- Bestandsstructuur:
  - `baby_male_light_blond.png`
  - `child_male_light_blond.png`
  - `teen_male_light_blond.png`
  - enzovoort voor alle man/vrouw × light/dark × blond/brown/black combinaties.
- `humanIcon()` en sprite rendering kiezen nu automatisch een sprite op basis van leeftijd.
- Hierdoor kunnen baby’s, kinderen, tieners, spelers, siblings, classmates en familieleden logisch verschillende hoofdjes hebben.
- Preview toegevoegd: `assets/avatar_sprites/avatar_age_stage_preview_v208.png`


## v20.9 Real Baby / Child / Teen Sprite Sheet
- De echte 36-delige sprite sheet voor baby, kind en tiener is verwerkt.
- Niet meer geschaalde volwassen hoofdjes: alle baby/child/teen sprites zijn apart uitgeknipt uit de nieuwe sheet.
- Structuur:
  - baby_light male/female blond/brown/black
  - baby_dark male/female blond/brown/black
  - child_light male/female blond/brown/black
  - child_dark male/female blond/brown/black
  - teen_light male/female blond/brown/black
  - teen_dark male/female blond/brown/black
- Bestandsnamen volgen exact de renderer:
  - `baby_male_light_blond.png`
  - `child_female_dark_brown.png`
  - `teen_male_dark_black.png`
  - enzovoort.
- v20.8 age-stage renderer blijft actief en kiest automatisch:
  - 0-3 baby
  - 4-12 child
  - 13-17 teen
  - 18+ adult
- Preview toegevoegd:
  - `assets/avatar_sprites/avatar_baby_child_teen_preview_v209.png`
- Bron sheet bewaard:
  - `assets/avatar_sprites/source_baby_child_teen_sheet_v209.png`


## v21.0 Real Sprite Profiles Fix
- Fix voor profielschermen waar nog de oude `ava199` CSS-avatar zichtbaar was.
- Oude CSS-avatar wordt nu automatisch vervangen door echte PNG sprite uit `assets/avatar_sprites`.
- Werkt ook als oudere patches nog `ava199` in modals injecteren.
- `renderPersonAvatar199`, `renderPersonEmoji199` en `humanIcon` sturen nu allemaal naar de sprite renderer.
- Modals voor ouders/kinderen/siblings/classmates/friends/relaties worden na openen opgeschoond.
- Debug helper toegevoegd: `avatarSpriteDebug210()`.


## v21.1 Force PNG Sprites Everywhere
- Hard fix voor oude opgeslagen emoji-icons zoals 👶 die nog in topbar/tabs verschenen.
- `avatar()`, `humanIcon()`, `classmateAvatar()`, `renderPersonEmoji199()`, `renderPersonAvatar199()` en spriteHTML-functies sturen nu allemaal direct naar PNG sprites.
- `state.icon` en oude person icons worden bij render/save overschreven met echte `<img>` sprites.
- Topbar, bottom tabs, rows en oude CSS-avatar blokken worden na render opgeschoond.
- Testfunctie toegevoegd: `spriteTest211()`.


## v21.2 Adult Role Sprite Stage Fix
- Fix voor ouders die als baby-sprite getoond werden.
- Oorzaak: v21.1 verving oude human emoji's in rows soms blind met de player-sprite.
- Ouders, teachers, bosses, coaches en managers forceren nu adult sprites.
- Player gebruikt eigen leeftijd.
- Kinderen, siblings en classmates gebruiken hun eigen leeftijd.
- Relationships rows worden na render correct opnieuw gezet.
- Debug helper: `spriteRoleDebug212()`.


## v21.3 Modal Sprite Context Sync
- Fix voor profiel-popups waar de relationship row wel de juiste sprite had, maar de grote Uiterlijk-sprite een andere/fallback sprite pakte.
- Parent/child/sibling/friend/classmate screens zetten nu expliciet de actuele persoon als modal-context.
- De modalTop avatar, modalTitle sprite en grote Uiterlijk-card sprite worden gelijkgetrokken naar dezelfde persoon.
- Oude verkeerde `<img>` sprites worden nu ook vervangen, niet alleen oude `ava199` CSS avatars.
- Relationship rows blijven na render gecorrigeerd.
- Debug helper: `spriteModalDebug213()`.


## v21.4 Pre-Render Relationship Sprite Sync
- Fix voor sprite-flicker in Relationships: ouders werden eerst met oude/verkeerde sprites getoond en daarna pas gecorrigeerd.
- Moeder/vader/kinderen/siblings icons worden nu vóór `relationshipsHTML()` al gesynchroniseerd.
- De HTML-string van Relationships wordt direct aangepast voordat hij in de DOM komt.
- Familiehub voert ook pre-render sync uit.
- Geen delayed cleanup nodig voor parent rows.
- Debug helper: `spriteNoFlickerDebug214()`.

## v21.5 Childhood Activities Restore
- Herstelt functies die door de Activities Master Router te ver verborgen waren, zonder oude dubbele combat/DLC/business rows terug te zetten.
- Nieuwe hub: `Kindertijd & Spelen`.
- Teruggezet/beter zichtbaar:
  - Buiten spelen
  - Dokter / Health
  - Verstoppertje
  - Tikkertje
  - Voetbal buiten
  - Speeltuin
  - Schoolplein spelen
  - Met vriendjes spelen
  - Speelgoed spelen
  - Kinder-tv kijken
- Bestaande functies zoals `playHideSeek()`, `playTag()`, `playFootball()`, `gymScreen()` en `doctorVisit()` worden hergebruikt waar ze bestaan.
- Nieuwe fallback-acties toegevoegd voor speeltuin/schoolplein/vriendjes/speelgoed/kinder-tv.
- Hoofdactivities toont `Kindertijd & Spelen` alleen als je jonger dan 14 bent.
- Report/debug functie: `lostActivitiesReport215()`.


## v21.6 Flag Asset Icons for Travel World
- Fix voor vlaggen die als landcode letters werden getoond, zoals ES, US, JP en JM.
- Reizen & Wereld gebruikt nu echte SVG assets in `assets/flags/`.
- Toegevoegd:
  - spain.svg
  - usa.svg
  - japan.svg
  - netherlands.svg
  - amsterdam.svg
  - jamaica.svg
  - nightcity.svg
  - world.svg
- `travelWorldMasterHub204()` en `dlcPlaceMaster204()` zijn gepatcht om `flagIcon216()` te gebruiken.
- Fallback cleanup vervangt oude letter/emoji vlaggen in travel rows.
- Debug helper: `flagIconDebug216()`.


## v21.7 Family Genetics + Sprite Barber Fix
- Corrigeert rare familie-huidskleur mismatch: speler/siblings worden nu genetisch logischer afgeleid van moeder en vader.
- Twee lichte ouders leveren niet meer ineens een veel donkerder kind op door puur regionale random generation.
- `appearanceText199()` is vereenvoudigd zodat de tekst geen kapsels noemt die niet echt in de sprite-sheet bestaan.
- Nieuwe sprite-aware kapper:
  - knipbeurt
  - haarbehandeling
  - verven in sprite-ondersteunde kleuren: blond, bruin, zwart
  - terug naar natuurlijke haarkleur
- Huidtint/afkomst blijven genetisch; de kapper verandert alleen haar/verzorging.
- Debug helper: `familyGeneticsDebug217()`.

## v21.8 Stability Debug Runtime Fix
- Kritieke runtime freeze opgelost.
- Oorzaak gevonden: v21.7 liet `syncFamilyGenetics217()` `refreshSprites212()` aanroepen, terwijl `refreshSprites212()` weer `applyAppearanceToPeople199()` aanriep. Omdat `applyAppearanceToPeople199()` naar `syncFamilyGenetics217()` verwees, ontstond een oneindige lus.
- v21.7 direct gepatcht:
  - `refreshSprites212()` call uit genetics sync verwijderd.
  - agressieve render/safeSave/migrate wrappers uit v21.7 uitgeschakeld.
  - startup save/render van v21.7 uitgeschakeld.
- v21.8 toegevoegd met guarded render/save wrappers.
- Barber en familie-genetica blijven actief, maar zonder recursive loop.
- Modal overlay leeg-blokkade wordt automatisch opgeschoond.
- Debug helper: `stabilityDebug218()`.

## v21.9 School Sprite Variety + Teacher Adult Fix
- Klasgenoten krijgen nu meer visuele variatie via sprite-appearance:
  - lichte/donkere huid
  - blond/bruin/zwart haar
  - regionale gewichten per land/home basis
- Leraar is nu altijd een volwassene:
  - age 24–51 ongeveer
  - role teacher
  - adult sprite
- `classScreen()`, `teacherScreen()` en `classmateScreen()` zijn overschreven zodat ze altijd de goede sprites tonen.
- `classmateAction()` synct nu icons/appearance ook door naar partner/vrienden wanneer relevant.
- Debug helper: `schoolSpriteDebug219()` en `schoolSpriteDebug219(true)` voor nieuwe variatie.

## v22.0 Original Activities Restore + Age Hubs
- Controle gedaan op originele `app.js` functies die door de Activities Master Router verborgen waren.
- Teruggezet onder nieuwe logische hubs:
  - Vrije tijd & Uitgaan
  - Straat & Risico
  - Middelen & Herstel
  - Auto & Mobiliteit
  - Extra geld & assets
- Herstelde/zichtbaar gemaakte functies:
  - goOutWithFriends()
  - gekkeSteegScreen()
  - coffeeshopScreen()
  - recoveryClinicScreen()
  - drivingTest()
  - buyCarScreen()
  - carLifeScreen()
  - walkScreen()
  - sideHustle()
  - socialMedia()
  - casinoScreen()
  - hospitalScreen()
  - homeLifeScreen()
  - vacation()
- Niet teruggezet als losse dubbele rommel:
  - oude combat duplicate rows
  - oude DLC duplicate rows
  - oude business classic duplicate rows
- Debug report: `originalActivitiesReport220()`.

## v22.1 Travel Activities In Main List + Return Home + Gender Sprite Fix
- Als je in Amsterdam/Spanje/Amerika/Japan/Jamaica/Night City bent, verschijnen de lokale DLC-activiteiten direct in de normale Activities-lijst.
- Nieuwe hub: `currentPlaceActivities221()`.
- Vakantie krijgt duidelijke knop:
  - `travelReturnHome221()`
- Terug naar huis wordt geblokkeerd als je onder invloed bent; dan eerst ontnuchteren.
- Amsterdam en andere DLC plekken tonen ook shops, nightlife en contacten in de directe lijst.
- Gender sprite mismatch gefixt:
  - bekende vrouwennamen worden female
  - bekende mannennamen worden male
  - teacher gender wordt uit Juf/Mevrouw/Mr/Meneer/Meester afgeleid
- Debug helpers:
  - `travelGenderDebug221()`
  - `fixGenderSprites221()`

## v22.2 Assets Emoji Item Icon Guard
- Fix voor Assets scherm waar items als baby/person sprites werden getoond.
- Oorzaak: eerdere brede sprite patches behandelden objecten met `name` soms als persoon, waardoor state.items ook PNG hoofdjes kregen.
- Items/assets gebruiken nu weer gewone emoji's:
  - Fiets → 🚲
  - gaming pc → 🖥️
  - fitness set → 🏋️
  - Beach outfit → 👕
  - Signed UFC glove → 🥊
  - Joint/jonko → 🚬
- Personen blijven PNG sprites gebruiken.
- `itemIcon()` is overschreven naar emoji-only.
- `state.items` wordt bij render/save gerepareerd.
- Assets DOM wordt na render opgeschoond.
- Debug helper: `assetsEmojiDebug222()`.

## v22.3 Housing Upgrade + Kids Sports Fix
- Huis kopen/huren robuust opnieuw gepatcht:
  - huren werkt vanaf 18
  - kopen met hypotheek werkt met stabiel inkomen
  - cash kopen werkt als je genoeg geld hebt, zonder hypotheekcheck
  - duidelijke keuze-popup per koopwoning
- Asset house screen uitgebreid:
  - comfort
  - kwaliteit
  - staat/condition
  - beveiliging
  - energiezuinigheid
  - kamers
  - hoofdwoning instellen
  - verhuren/stop verhuur
  - verkopen
- Woning upgrades:
  - onderhoud/reparatie
  - meubels/inrichting
  - keuken/badkamer
  - tuin/balkon
  - beveiliging
  - energiezuinig maken
  - uitbouw/extra kamer
- Kinder sport vanaf 6 jaar:
  - voetbal
  - karate
  - tennis
  - honkbal
- Kinder sport is geïntegreerd in Sport/Gezondheid en Activities, in originele BitzLife stijl.
- Debug helper: `housingSportsDebug223()`.

## v22.4 Football Club + Salary Sync
- Voetbal salaris is nu jaarsalaris/jaarvergoeding, niet per wedstrijd.
- `footballMatch()` geeft geen basissalaris meer uit.
- Semi-pro/pro/topcontracten syncen met `state.job` als bruto jaarsalaris.
- Amateur/street vergoedingen worden jaarlijks verwerkt als vergoeding, niet per match.
- Transfers en progressie kiezen alleen uit de in-game club lijsten.
- Ongeldige fallback clubs zoals `Pro Football Club` worden gerepareerd naar echte game clubs.
- Contract scherm toont duidelijk:
  - club
  - niveau
  - contracttype
  - jaarsalaris
  - per wedstrijd: €0 basissalaris
  - economy/job sync
- Debug helper: `footballClubSalaryDebug224()`.

## v22.5 Football Club Region Fix
- Arsenal verwijderd: Engeland zit niet als route/land in deze game.
- Borussia Dortmund verwijderd: Duitsland zit niet als route/land in deze game.
- Transfers laden nu alleen clubs uit landen/routes die in de game zitten:
  - Nederland/Amsterdam basis
  - Spanje
  - USA
  - Japan
  - Jamaica
  - Night City
- Topclub lijst is teruggebracht naar geldige game-clubs, vooral Nederlandse topclubs + eventueel game-route clubs.
- Bestaande saves met Arsenal/Dortmund/Pro Football Club worden automatisch gerepareerd.
- Debug helper: `footballRegionDebug225()`.

## v22.6 Combat Original Style + Tryout + Fight Mode Fix
- Fight mode UI teruggezet naar originele BitzLife row/modal stijl.
- Kapotte custom combat rows vervangen door standaard `row()` en `.btn` onclicks.
- Twee complete routes:
  - MMA / UFC
  - GLORY Kickboxing
- Try-out systeem:
  - discipline 50% + combat 60% = gegarandeerd aangenomen
  - onder die grens werkt kansberekening met combat, discipline, fitness, stamina, health, form en coach trust
- Nieuwe complete Fight Mode:
  - 3 rondes
  - per ronde klikbare tactische keuze
  - HP, punten, KO/TKO/submission/decision
  - blessurerisico en herstel werken mee
- Combat systems gesynchroniseerd:
  - `state.combat226`
  - `state.combatSports`
  - `state.fightCareer`
- Oude combat/fight functies redirecten naar het nieuwe systeem:
  - `combatSportsHub184()`
  - `fightCareerScreen()`
  - `gloryUfcCareerScreen()`
  - `combatCareerHub177()`
  - `fightMatch118()`
  - `fightRecoveryScreen183()`
- Debug helper: `combatDebug226()`.

## v22.7 Combat Hard Override + Mobile Click Fix
- Oude combat route schermen volledig hard-overriden:
  - `combatRoute184()`
  - `setCombatRoute184()`
  - `combatAction184()`
  - `combatStartScreen177()`
  - oude `fightTryout118/fightTrain118/fightMatch118`
- Route kiezen gebruikt nu alleen originele donkere BitzLife rows.
- Oude witte combat184 route-cards worden niet meer gebruikt.
- Mobiele click guard toegevoegd:
  - modal, rows en buttons krijgen `pointer-events:auto`
  - `touch-action: manipulation`
  - hogere z-index
  - modal body scrollt veilig met bottom padding
- Training/tryout/route/fight menu’s zijn allemaal bereikbaar vanuit één `combatHub227()`.
- Debug helper: `combatDebug227()`.

## v22.8 Home Activities + Cleaner Fix
- Thuis activiteiten volledig teruggezet in originele BitzLife stijl:
  - chillen met vrienden
  - gamen
  - relaxen
  - hangen thuis
  - house party / vrienden over de vloer
  - zelf schoonmaken
  - social media thuis
  - classic chill menu als extra route
- Werkt voor:
  - familiehuis / kamer
  - huurwoning
  - koopwoning
- Nieuwe woningstats:
  - cleanliness / schoon
  - houseMood / vibe
- Schoonmaker systeem:
  - budget schoonmaker
  - vaste schoonmaker
  - premium schoonmaakservice
  - huishoudmanager
- Schoonmaker kan worden ingevuld/hernoemd met `setCleanerName228()`.
- Schoonmaker kan direct langskomen met `cleanerVisit228()`.
- Jaarlijkse verwerking met maandkosten x12 via `processCleanerYear228()`.
- Huisdetail krijgt ook directe rows naar thuis activiteiten en schoonmaker.
- Debug helper: `homeCleanerDebug228()`.

## v22.9 Combat Execution + Investment Shares + Adult Intimacy
- Combat hard gefixt:
  - Sport & Combat hub lekt geen oude kapotte amateur/semi/pro route rows meer.
  - Training/tryout/fight acties tonen direct resultaat.
  - Als je amateur/semi/pro bent, wordt Fight Mode correct unlocked.
  - Oude combat functies redirecten naar `combatHub229()`.
- Investeringen verbeterd:
  - Je kunt nu aandelen typen.
  - Je kunt ook een eurobedrag typen.
  - Zelfde investeringstype telt bij elkaar op, dus meerdere vastgoed/crypto aankopen worden één positie.
  - Vastgoed, crypto, indexfonds enz. bewegen jaarlijks duidelijk omhoog/omlaag met marktlog.
  - Debug/helper: `debugV229()`.
- Adult intimacy systeem:
  - 18+ only.
  - geïntegreerd via partner, vrienden, volwassen klasgenoten en dates.
  - geen losse tab.
  - consenting/FWB/samen nacht non-graphic.
  - mogelijke relatie-effecten, zwangerschap en kleine health-check events.

## v23.0 Aviation + Private Island Assets
- Assets scherm krijgt zichtbare sectie: Luchtvaart & Privé-eiland.
- Vliegbrevet: theorie, vlieglessen/uren, praktijkexamen.
- Vliegtuigen kopen/beheren: Cessna 172, Piper PA-28, Cirrus SR22, King Air 350, Pilatus PC-12, Citation M2, Phenom 300, Gulfstream G650.
- Vliegtuigbeheer: privévlucht, onderhoud, charter/verhuur, verkopen, jaarlijkse kosten/inkomsten.
- Privé-eiland kopen voor €100.000.000.
- Eilandbeheer: villa/mansion, haven, landingsbaan, powergrid, waterzuivering, winkels, resort, kliniek, security, school/community center.
- Eilandbeleid: immigratie, belasting, alcoholregels, milieubeleid, securitybeleid.
- Jaarlijkse eilandupdate met inkomsten, kosten, bevolking, stabiliteit en waarde.
- Debug helper: `debugAviationIsland230()`.

## v23.1 Business Growth Uncap Fix
- Business jaarwinst heeft geen hard plafond meer rond ±€2,8 miljoen.
- Jaaromzet schaalt nu met:
  - businesswaarde/capitaal
  - level
  - personeel
  - reputatie
  - marketing
  - kwaliteit
  - economische marktfactor
- Grotere bedrijven kunnen veel meer verdienen, maar krijgen ook grotere kosten, belasting/admin, personeel, risico en stress.
- Tech startup type wordt herkend uit `tech_startup`, `startup` of naam met “Tech startup”.
- Nieuwe business acties in dashboard:
  - Schaal investeren
  - Grote uitbreiding
- Debug helper: `businessGrowthDebug231()`.
