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
