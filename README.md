# Retro Emulator Hub v16

HTML/CSS/JS retro emulator launcher zonder Lovable.

## Nieuw in v16

- GameCube console-card toegevoegd met jouw GameCube artwork.
- GameCube uploadvalidatie toegevoegd voor `.iso`, `.gcm`, `.rvz`, `.gcz`, `.ciso`, `.wbfs` en `.zip`.
- GameCube controllerpaneel toont Player 1 t/m Player 4.
- N64 4-controller ondersteuning uit v13 blijft behouden.
- PSP directe start + browser-stream fallback uit v13 blijft behouden.
- PS1 multi-track, SNES zip support en de bestaande controllerlogica blijven behouden.

## Belangrijke GameCube-opmerking

Deze webapp gebruikt EmulatorJS via CDN. In de huidige standaard core-lijst van die CDN zit geen Dolphin/GameCube core. Daarom is GameCube in v16 netjes voorbereid in de UI met uploadvalidatie en 4-controller layout, maar het starten van GameCube-games is bewust geblokkeerd om niet nep te doen alsof het stabiel werkt. Voor echte GameCube-emulatie is een aparte Dolphin/WebAssembly core nodig.

## Starten

Pak de zip uit en start lokaal:

```bash
python -m http.server 8080
```

Open daarna:

```text
http://localhost:8080
```

Doe na een update altijd één keer Ctrl+F5, zodat oude service workers/scripts niet blijven hangen.

## PSP opmerking

PSP in browser blijft zwaarder en gevoeliger dan GB/GBA/SNES/N64/PS1. Gebruik bij voorkeur losse `.iso` of `.cso` bestanden. Werkt directe modus niet, probeer de browser-stream knop.


## v16 update
- N64 controller-fix voor games zoals Ocarina of Time.
- N64 behoudt native 4-controller input, maar heeft nu ook een veilige controller-to-keyboard fallback als de core/browser de pad niet automatisch bindt.
- PS1/PSP/GameCube blijven native om hotkey-conflicten te voorkomen.


## v17 mobile fix

- Op mobiel is het lege emulator-preview scherm verborgen totdat je echt op **Start game** drukt.
- Na **Start game** schakelt de app naar mobiele speelmodus: uploadpanelen, controllerpanelen en controls-panel verdwijnen tijdelijk uit beeld.
- De emulator krijgt bijna het hele telefoonscherm en de app scrollt automatisch naar het speelveld.
- Fullscreen heeft extra CSS/JS fallback gekregen voor mobiele browsers.
- Consolekaarten zijn compacter gemaakt op mobiel, zodat de grote artwork/schermpjes niet de UI blijven vullen.
