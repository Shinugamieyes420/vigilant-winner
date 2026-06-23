'use strict';

const DB_NAME = 'retro-emulator-hub-saves';
const DB_VERSION = 1;
const STORE_NAME = 'saves';
const EMULATOR_DATA_PATH = 'https://cdn.emulatorjs.org/stable/data/';
const JSZIP_CDN = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
const VIRTUAL_PS1_CACHE = 'retro-emulator-hub-ps1-files-v2';
const PS1_SW_TIMEOUT_MS = 120000; // Grote PS1 multi-track games (zoals Tekken 600MB+) hebben langer nodig om naar de service worker te registreren.
const VIRTUAL_SW_TIMEOUT_MS = 120000; // V16: explicit EmulatorJS controls + N64 analog-stick fallback for PS4/PS5/Xbox controllers.

const systems = {
  gameboy: {
    id: 'gameboy',
    title: 'Game Boy / Color',
    family: 'Classic handheld',
    tagline: 'Classic Play. Timeless Fun.',
    description: 'Klassieke handheld nostalgie met groenige tinten, simpele controls en directe pick-up-and-play energie.',
    image: 'assets/gameboy.png',
    theme: '#99f06a',
    core: 'gb',
    extensions: ['.gb', '.gbc'],
    controls: {
      'Player 1': {
        'Pijltjes': 'Bewegen',
        'Z': 'A / confirm',
        'X': 'B / back',
        'Enter': 'Start',
        'Shift': 'Select'
      }
    }
  },
  gba: {
    id: 'gba',
    title: 'Game Boy Advance',
    family: 'Advance handheld',
    tagline: 'Advance Play. Pixel Power.',
    description: 'Kleurrijke handheld pixelwerelden met extra L/R controls. Extra zorgvuldig opgezet voor confirm/start/select input.',
    image: 'assets/gba.png',
    theme: '#8b63ff',
    core: 'gba',
    extensions: ['.gba'],
    controls: {
      'Player 1': {
        'Pijltjes': 'Bewegen',
        'Z': 'A / confirm',
        'X': 'B / back',
        'Q': 'L',
        'E': 'R',
        'Enter': 'Start',
        'Shift': 'Select'
      }
    }
  },
  snes: {
    id: 'snes',
    title: 'Super Nintendo',
    family: '16-bit console',
    tagline: 'Super Play. 16-Bit Magic.',
    description: '16-bit magie, cartridge-era sfeer en couch co-op controls voor twee spelers.',
    image: 'assets/snes.png',
    theme: '#b58cff',
    core: 'snes',
    extensions: ['.sfc', '.smc', '.zip'],
    controls: {
      'Player 1': {
        'Pijltjes': 'Bewegen',
        'Z / X': 'A / B',
        'A / S': 'X / Y',
        'Q / E': 'L / R',
        'Enter': 'Start',
        'Shift': 'Select'
      },
      'Player 2': {
        'WASD': 'Bewegen',
        'F / G': 'A / B',
        'R / T': 'L / R',
        'V': 'Start',
        'C': 'Select'
      }
    }
  },
  ps1: {
    id: 'ps1',
    title: 'PlayStation 1',
    family: '32-bit console',
    tagline: 'Play Station. 32-Bit Legend.',
    description: 'Late-night disc-era nostalgie met koele neon tinten. CHD en PBP zijn de voorkeur voor stabiliteit.',
    image: 'assets/ps1.png',
    theme: '#6bdcff',
    core: 'psx',
    extensions: ['.chd', '.pbp', '.cue', '.bin', '.zip'],
    preferredExtensions: ['.chd', '.pbp'],
    controls: {
      'Player 1': {
        'Pijltjes / Linker stick': 'Bewegen',
        'Z / X': 'Cross / Circle',
        'A / S': 'Square / Triangle',
        'Q / E': 'L1 / R1',
        'Enter': 'Start',
        'Shift': 'Select'
      },
      'Player 2': {
        'WASD': 'Bewegen',
        'F / G': 'Cross / Circle',
        'R / T': 'L1 / R1',
        'V': 'Start',
        'C': 'Select'
      }
    }
  },
  n64: {
    id: 'n64',
    title: 'Nintendo 64',
    family: '64-bit console',
    tagline: 'N64 Play. 64-Bit Nostalgia.',
    description: '64-bit cartridge nostalgie met native 4-controller input plus een veilige controller-fallback voor games zoals Ocarina of Time. Zip met één ROM wordt automatisch uitgepakt.',
    image: 'assets/n64.png',
    theme: '#7cff8a',
    core: 'n64',
    extensions: ['.z64', '.n64', '.v64', '.zip'],
    zipRomRegex: /\.(z64|n64|v64)$/i,
    controls: {
      'Player 1': {
        'Linker stick / D-pad': 'Bewegen',
        'Xbox A / PS Cross': 'A / confirm',
        'Xbox B / PS Circle': 'B / back',
        'Xbox X / PS Square': 'Z-trigger fallback',
        'Xbox Y / PS Triangle': 'C-Up fallback',
        'Rechter stick / C-buttons': 'Camera / C-knoppen',
        'L1 / R1': 'L / R',
        'L2 / R2': 'Z / trigger',
        'Start / Options': 'Start'
      },
      'Player 2': {
        'Controller 2': 'Tweede browser-gamepad wordt Player 2',
        'WASD + F/G/R/T/V/C': 'Keyboard fallback'
      }
    }
  },
  gamecube: {
    id: 'gamecube',
    title: 'GameCube',
    family: '128-bit console',
    tagline: 'GameCube Play. 128-Bit Fun.',
    description: 'GameCube disc-era vibe met 4 controllerpoorten. Let op: de standaard EmulatorJS CDN bevat momenteel geen Dolphin/GameCube WASM-core, dus deze launcher valideert en bereidt bestanden voor maar blokkeert starten totdat een Dolphin-webcore wordt toegevoegd.',
    image: 'assets/gamecube.png',
    theme: '#9b6dff',
    core: null,
    extensions: ['.iso', '.gcm', '.rvz', '.gcz', '.ciso', '.wbfs', '.zip'],
    zipRomRegex: /\.(iso|gcm|rvz|gcz|ciso|wbfs)$/i,
    unsupportedReason: 'GameCube/Dolphin zit niet in de standaard EmulatorJS cores op de CDN. De UI, uploadvalidatie en 4-controller voorbereiding zitten klaar; voor echte GameCube-play is een aparte Dolphin WASM/webcore nodig.',
    controls: {
      'Player 1': {
        'Linker stick / D-pad': 'Bewegen',
        'Xbox A / PS Cross': 'A',
        'Xbox B / PS Circle': 'B',
        'Xbox X / PS Square': 'X',
        'Xbox Y / PS Triangle': 'Y',
        'L1 / R1': 'L / R',
        'R2': 'Analoge R-trigger',
        'Start / Options': 'Start'
      },
      'Player 2': {
        'Controller 2': 'Tweede browser-gamepad wordt poort 2'
      },
      'Player 3': {
        'Controller 3': 'Derde browser-gamepad wordt poort 3'
      },
      'Player 4': {
        'Controller 4': 'Vierde browser-gamepad wordt poort 4'
      }
    }
  },
  psp: {
    id: 'psp',
    title: 'PSP',
    family: 'Portable console',
    tagline: 'Portable Play. PSP Power.',
    description: 'Portable disc-era vibe. ISO en CSO zijn de beste keuze. PSP start standaard via directe blob-url; bij problemen kun je wisselen naar browser-stream fallback.',
    image: 'assets/psp.png',
    theme: '#5dd6ff',
    core: 'psp',
    extensions: ['.iso', '.cso', '.pbp', '.elf', '.zip'],
    preferredExtensions: ['.iso', '.cso'],
    zipRomRegex: /\.(iso|cso|pbp|elf)$/i,
    controls: {
      'Player 1': {
        'Linker stick / D-pad': 'Bewegen',
        'Xbox A / PS Cross': 'Cross / confirm',
        'Xbox B / PS Circle': 'Circle / back',
        'Xbox X / PS Square': 'Square',
        'Xbox Y / PS Triangle': 'Triangle',
        'L1 / R1': 'L / R',
        'Start / Options': 'Start',
        'Select / Share': 'Select'
      }
    }
  }
};

const els = {
  consoleGrid: document.getElementById('consoleGrid'),
  launcher: document.getElementById('launcher'),
  backButton: document.getElementById('backButton'),
  globalStatus: document.getElementById('globalStatus'),
  selectedFamily: document.getElementById('selectedFamily'),
  selectedTitle: document.getElementById('selectedTitle'),
  selectedDescription: document.getElementById('selectedDescription'),
  formatPills: document.getElementById('formatPills'),
  dropzone: document.getElementById('dropzone'),
  romInput: document.getElementById('romInput'),
  folderInput: document.getElementById('folderInput'),
  ps1ExtraActions: document.getElementById('ps1ExtraActions'),
  ps1FilePick: document.getElementById('ps1FilePick'),
  ps1FolderPick: document.getElementById('ps1FolderPick'),
  dropHint: document.getElementById('dropHint'),
  dropExtra: document.getElementById('dropExtra'),
  romMeta: document.getElementById('romMeta'),
  startButton: document.getElementById('startButton'),
  controllerStatus: document.getElementById('controllerStatus'),
  scanControllers: document.getElementById('scanControllers'),
  speedRange: document.getElementById('speedRange'),
  speedValue: document.getElementById('speedValue'),
  applySpeed: document.getElementById('applySpeed'),
  resetSpeed: document.getElementById('resetSpeed'),
  saveNow: document.getElementById('saveNow'),
  loadSave: document.getElementById('loadSave'),
  exportSave: document.getElementById('exportSave'),
  saveImport: document.getElementById('saveImport'),
  saveNote: document.getElementById('saveNote'),
  viewportTitle: document.getElementById('viewportTitle'),
  emulatorFrame: document.getElementById('emulatorFrame'),
  gameArea: document.querySelector('.game-area'),
  emptyState: document.getElementById('emptyState'),
  game: document.getElementById('game'),
  resetGame: document.getElementById('resetGame'),
  restartGame: document.getElementById('restartGame'),
  fullscreenGame: document.getElementById('fullscreenGame'),
  controlsGrid: document.getElementById('controlsGrid'),
  toastWrap: document.getElementById('toastWrap')
};

let activeSystem = null;
let activeRom = null;
let activeRomFiles = [];
let activeRomUrl = null;
let ps1BundleUrl = null;
let ps1BundleMeta = null;
let activeVirtualSession = null;
let activePspSourceFile = null;
let activePspMode = 'blob';
let ps1SelectedLaunchFileName = null;
let serviceWorkerReadyPromise = null;
let dbPromise = null;
let emulatorScriptLoaded = false;
let jsZipPromise = null;
let lastSaveBlob = null;
let gamepadBridgeStarted = false;
let mobileEmulatorUiObserver = null;
let mobileMenuHideNoticeShown = false;
const gamepadPressedKeys = new Map();
const CONTROLLER_KEYBOARD_BRIDGE_ENABLED = true; // Conditional bridge: GB/GBA/SNES keyboard bridge; N64 analog fallback; PS1/PSP/GameCube stay native.

function isMobileViewport() {
  return Boolean(window.matchMedia && window.matchMedia('(max-width: 820px)').matches);
}

function setEmulatorActive(isActive) {
  document.body.classList.toggle('emulator-running', Boolean(isActive));
  els.launcher?.classList.toggle('emulator-running', Boolean(isActive));
  els.gameArea?.classList.toggle('is-running', Boolean(isActive));
  els.gameArea?.classList.toggle('is-empty', !isActive);
}

function scrollGameIntoViewOnMobile() {
  if (!isMobileViewport()) return;
  window.setTimeout(() => {
    els.gameArea?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 180);
}

function resetMobileEmulatorUiFix() {
  if (mobileEmulatorUiObserver) {
    mobileEmulatorUiObserver.disconnect();
    mobileEmulatorUiObserver = null;
  }
  mobileMenuHideNoticeShown = false;
  document.querySelectorAll('.mobile-emulator-quickbar-hidden').forEach((node) => {
    node.classList.remove('mobile-emulator-quickbar-hidden');
    node.removeAttribute('aria-hidden');
  });
}

function getQuickbarCandidateScore(element) {
  const rect = element.getBoundingClientRect();
  const clickable = element.querySelectorAll('button, [role="button"], svg').length;
  const children = element.children?.length || 0;
  let score = 0;
  if (rect.width > window.innerWidth * 0.6) score += 5;
  if (rect.width > window.innerWidth * 0.75) score += 3;
  if (rect.top > window.innerHeight * 0.18 && rect.top < window.innerHeight * 0.62) score += 4;
  if (rect.height > 40 && rect.height < 180) score += 2;
  score += Math.min(clickable, 12);
  score += Math.min(children, 12);
  return score;
}

function hideMobileEmulatorQuickbar() {
  if (!isMobileViewport() || !els.emulatorFrame) return;

  const root = els.emulatorFrame;
  const candidates = [...root.querySelectorAll('div, section, aside')].filter((element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (element.classList.contains('mobile-emulator-quickbar-hidden')) return false;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    if (rect.width < Math.max(220, window.innerWidth * 0.55)) return false;
    if (rect.height < 38 || rect.height > Math.max(180, window.innerHeight * 0.32)) return false;
    if (rect.top < 0 || rect.top > window.innerHeight * 0.72) return false;

    const style = window.getComputedStyle(element);
    if (!['absolute', 'fixed'].includes(style.position)) return false;

    const hasEnoughButtons = element.querySelectorAll('button, [role="button"], svg').length >= 8 || (element.children?.length || 0) >= 8;
    if (!hasEnoughButtons) return false;

    const background = style.backgroundColor || '';
    const hasVisibleBg = background.includes('rgb') && !background.endsWith(', 0)') && background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent';
    const hasBlur = (style.backdropFilter && style.backdropFilter !== 'none') || (style.webkitBackdropFilter && style.webkitBackdropFilter !== 'none');

    return hasVisibleBg || hasBlur;
  });

  if (!candidates.length) return;

  const best = candidates.sort((a, b) => getQuickbarCandidateScore(b) - getQuickbarCandidateScore(a))[0];
  if (!best) return;

  best.classList.add('mobile-emulator-quickbar-hidden');
  best.setAttribute('aria-hidden', 'true');

  if (!mobileMenuHideNoticeShown) {
    mobileMenuHideNoticeShown = true;
    showToast('Storende mobiele emulator-menubalk verborgen.', 'ok');
  }
}

function installMobileEmulatorUiFix() {
  resetMobileEmulatorUiFix();
  if (!isMobileViewport() || !els.emulatorFrame) return;

  const schedulePass = (delay) => {
    window.setTimeout(() => {
      window.requestAnimationFrame(() => hideMobileEmulatorQuickbar());
    }, delay);
  };

  mobileEmulatorUiObserver = new MutationObserver(() => {
    window.requestAnimationFrame(() => hideMobileEmulatorQuickbar());
  });
  mobileEmulatorUiObserver.observe(els.emulatorFrame, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  schedulePass(250);
  schedulePass(700);
  schedulePass(1400);
  schedulePass(2200);
}
function renderConsoleCards() {
  els.consoleGrid.innerHTML = Object.values(systems).map((system) => `
    <article class="console-card" style="--theme:${system.theme}" tabindex="0" role="button" data-system="${system.id}" aria-label="Selecteer ${system.title}">
      <img src="${system.image}" alt="${system.title} retro artwork" loading="lazy" />
      <div class="card-content">
        <p class="eyebrow">${system.family}</p>
        <h2>${system.title}</h2>
        <p>${system.tagline}</p>
        <div class="pill-row">${system.extensions.map((ext) => `<span class="pill">${ext}</span>`).join('')}</div>
        <div class="card-cta">Selecteer console →</div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.console-card').forEach((card) => {
    card.addEventListener('click', () => selectSystem(card.dataset.system));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectSystem(card.dataset.system);
      }
    });
  });
}

function selectSystem(systemId) {
  activeSystem = systems[systemId];
  activeRom = null;
  activeRomFiles = [];
  ps1BundleMeta = null;
  ps1SelectedLaunchFileName = null;
  clearRomUrl();
  teardownEmulator();
  document.documentElement.style.setProperty('--theme', activeSystem.theme);
  els.consoleGrid.classList.add('hidden');
  els.launcher.classList.remove('hidden');
  els.selectedFamily.textContent = activeSystem.family;
  els.selectedTitle.textContent = activeSystem.title;
  els.selectedDescription.textContent = activeSystem.description;
  els.formatPills.innerHTML = activeSystem.extensions.map((ext) => `<span class="pill">${ext}</span>`).join('');
  els.dropHint.textContent = `Toegestaan: ${activeSystem.extensions.join(', ')}`;
  els.dropExtra.textContent = activeSystem.id === 'ps1'
    ? 'PS1 multi-track: selecteer de .cue én alle bijbehorende .bin tracks tegelijk, kies de hele map, of gebruik een .zip met .cue + tracks.'
    : activeSystem.id === 'n64'
      ? 'N64: gebruik bij voorkeur .z64. Zip mag met één ROM. Native 4-pad input staat aan; extra controller-fallback helpt bij games zoals Ocarina of Time als native input niet pakt.'
      : activeSystem.id === 'gamecube'
        ? 'GameCube: uploadvalidatie en 4-controller UI zitten klaar, maar starten is geblokkeerd omdat de standaard EmulatorJS CDN geen Dolphin/GameCube core bevat.'
        : activeSystem.id === 'psp'
          ? 'PSP: gebruik bij voorkeur een losse .iso of .cso. V13 start PSP standaard direct via blob-url; werkt dat niet, gebruik de browser-stream fallback knop.'
          : '';
  els.ps1ExtraActions.classList.toggle('hidden', activeSystem.id !== 'ps1');
  els.romInput.accept = activeSystem.extensions.join(',');
  els.romInput.multiple = activeSystem.id === 'ps1';
  if (els.folderInput) {
    els.folderInput.value = '';
    els.folderInput.accept = activeSystem.id === 'ps1' ? activeSystem.extensions.join(',') : '';
  }
  els.romMeta.textContent = 'Nog geen ROM geselecteerd.';
  els.startButton.disabled = true;
  els.viewportTitle.textContent = `${activeSystem.title} launcher`;
  renderControls();
  updateStatus(`${activeSystem.title} geselecteerd.`);
  showToast(`${activeSystem.title} geselecteerd.`, 'ok');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToSelector() {
  els.launcher.classList.add('hidden');
  els.consoleGrid.classList.remove('hidden');
  activeSystem = null;
  activeRom = null;
  activeRomFiles = [];
  ps1BundleMeta = null;
  ps1SelectedLaunchFileName = null;
  clearRomUrl();
  teardownEmulator();
  updateStatus('Klaar om een console te kiezen.');
}

function renderControls() {
  if (!activeSystem) return;
  els.controlsGrid.innerHTML = Object.entries(activeSystem.controls).map(([player, mapping]) => `
    <div class="control-card">
      <h4>${player}</h4>
      <dl>
        ${Object.entries(mapping).map(([key, action]) => `<dt>${key}</dt><dd>${action}</dd>`).join('')}
      </dl>
    </div>
  `).join('');
}

async function handleRomFiles(fileList) {
  if (!activeSystem) {
    showToast('Selecteer eerst een console.', 'error');
    return;
  }
  const files = Array.from(fileList || []).filter(Boolean);
  if (!files.length) return;

  if (activeSystem.id === 'ps1') {
    await handlePs1Files(files);
    return;
  }

  const file = files[0];
  const fileName = file.name.toLowerCase();
  const valid = activeSystem.extensions.some((ext) => fileName.endsWith(ext));
  if (!valid) {
    showToast(`Dit bestandstype wordt niet ondersteund voor ${activeSystem.title}.`, 'error');
    els.romMeta.textContent = `Ongeldig bestand. Toegestaan: ${activeSystem.extensions.join(', ')}`;
    els.startButton.disabled = true;
    return;
  }

  if (activeSystem.unsupportedReason) {
    await handleUnsupportedSystemFile(file);
    return;
  }

  if (activeSystem.id === 'psp') {
    await handlePspFileVirtual(file);
    return;
  }

  if (fileName.endsWith('.zip') && activeSystem.zipRomRegex) {
    await handleGenericZip(file, activeSystem);
    return;
  }

  if (activeSystem.id === 'snes' && fileName.endsWith('.zip')) {
    await handleSnesZip(file);
    return;
  }

  clearRomUrl();
  activeRom = file;
  activeRomFiles = [file];
  ps1BundleMeta = null;
  activeRomUrl = URL.createObjectURL(file);
  els.romMeta.textContent = `${file.name} — ${formatBytes(file.size)}`;
  els.startButton.disabled = false;
  updateStatus(`${file.name} geladen voor ${activeSystem.title}.`);
  showToast('ROM geladen. Je kunt de game starten.', 'ok');
}

async function handleUnsupportedSystemFile(file) {
  clearRomUrl();
  activeRom = file;
  activeRomFiles = [file];
  ps1BundleMeta = null;
  activeRomUrl = null;
  els.romMeta.innerHTML = `<strong>${escapeHtml(activeSystem.title)} bestand herkend:</strong><br>${escapeHtml(file.name)} — ${formatBytes(file.size)}<br><br><span class="muted">${escapeHtml(activeSystem.unsupportedReason)}</span><br><br><strong>Waarom?</strong><br><span class="muted">Deze hub gebruikt EmulatorJS via CDN. Daarin zitten wel cores voor o.a. SNES, GBA, PS1, N64 en PSP, maar geen Dolphin/GameCube core. GameCube vereist Dolphin-achtige emulatie en is zwaarder/anders dan de bestaande cores.</span>`;
  els.startButton.disabled = true;
  updateStatus(`${activeSystem.title} bestand herkend, maar starten is niet beschikbaar in deze browserbuild.`);
  showToast(`${activeSystem.title}: upload herkend, maar echte emulatie vereist een aparte Dolphin-webcore.`, 'info');
}

async function handlePspFileVirtual(file, mode = 'blob') {
  try {
    clearRomUrl();
    activePspSourceFile = file;
    activePspMode = mode;
    activeRom = file;
    activeRomFiles = [file];
    ps1BundleMeta = null;
    ps1SelectedLaunchFileName = null;

    const lower = file.name.toLowerCase();
    const isZip = lower.endsWith('.zip');
    const isDisc = /\.(iso|cso|pbp|elf)$/i.test(file.name);

    if (mode === 'stream') {
      updateStatus('PSP bestand voorbereiden via browser-stream fallback...');
      showToast('PSP browser-stream voorbereiden... grote ISO/CSO kan even duren.', 'info');
      const virtual = await createVirtualFileSession('psp', file);
      activeVirtualSession = virtual.sessionId;
      activeRomUrl = virtual.url;
    } else {
      updateStatus('PSP bestand direct voorbereiden...');
      activeVirtualSession = null;
      activeRomUrl = URL.createObjectURL(file);
    }

    const modeLabel = mode === 'stream' ? 'Browser-stream fallback' : 'Directe ISO/CSO blob';
    const zipNote = isZip
      ? '<br><span class="muted">Let op: PSP .zip werkt niet altijd in browser-emulators. Pak bij zwart scherm de zip uit en kies de losse .iso of .cso.</span>'
      : '';
    const isoNote = isDisc
      ? '<br><span class="muted">PSP-tip: sommige games starten beter via directe blob, andere via browser-stream. Wissel hieronder als je zwart scherm krijgt.</span>'
      : '';

    els.romMeta.innerHTML = `<strong>PSP bestand klaar:</strong><br>${escapeHtml(file.name)} — ${formatBytes(file.size)}<br><span class="muted">Modus: ${modeLabel}. Native gamepad blijft aan voor PS4/PS5/Xbox.</span>${zipNote}${isoNote}<div class="inline-actions" style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;"><button class="mini-btn" data-psp-mode="blob" ${mode === 'blob' ? 'disabled' : ''}>PSP direct starten</button><button class="mini-btn" data-psp-mode="stream" ${mode === 'stream' ? 'disabled' : ''}>PSP browser-stream</button></div>`;
    els.startButton.disabled = false;
    updateStatus(`${file.name} klaargezet voor PSP (${modeLabel}).`);
    showToast('PSP bestand klaargezet. Start de game.', 'ok');
  } catch (error) {
    console.error(error);
    showToast('PSP voorbereiden mislukt.', 'error');
    els.romMeta.innerHTML = `<strong>PSP voorbereiden mislukt.</strong><br>${escapeHtml(error.message || String(error))}<br><br>Gebruik http://localhost:8080, niet file://. Doe daarna Ctrl+F5 en kies de losse ISO/CSO opnieuw. De directe PSP-modus gebruikt geen service worker.`;
    els.startButton.disabled = true;
  }
}

async function switchPspMode(mode) {
  if (!activeSystem || activeSystem.id !== 'psp' || !activePspSourceFile) return;
  await handlePspFileVirtual(activePspSourceFile, mode);
}

async function handleGenericZip(zipFile, system) {
  try {
    clearRomUrl();
    const JSZip = await loadJsZip();
    const zip = await JSZip.loadAsync(zipFile);
    const romEntry = Object.values(zip.files).find((entry) => !entry.dir && system.zipRomRegex.test(entry.name));

    if (!romEntry) {
      showToast(`Deze ${system.title} zip bevat geen geldig ROM-bestand.`, 'error');
      els.romMeta.textContent = `Geen geldige ${system.title} ROM gevonden in de zip. Toegestaan: ${system.extensions.filter((ext) => ext !== '.zip').join(', ')}`;
      els.startButton.disabled = true;
      return;
    }

    const blob = await romEntry.async('blob');
    const romName = romEntry.name.replace(/^.*[\/]/, '');
    activeRom = new File([blob], romName, { type: 'application/octet-stream' });
    activeRomFiles = [zipFile, activeRom];
    ps1BundleMeta = null;
    ps1SelectedLaunchFileName = null;
    activeRomUrl = URL.createObjectURL(activeRom);
    els.romMeta.innerHTML = `<strong>${escapeHtml(system.title)} zip uitgepakt:</strong><br>${escapeHtml(zipFile.name)} → ${escapeHtml(romName)} — ${formatBytes(activeRom.size)}`;
    els.startButton.disabled = false;
    updateStatus(`${romName} uit ${zipFile.name} geladen voor ${system.title}.`);
    showToast(`${system.title} zip geopend. Je kunt de game starten.`, 'ok');
  } catch (error) {
    console.error(error);
    showToast(`${system.title} zip openen mislukt.`, 'error');
    els.romMeta.textContent = `Kon de zip niet lezen. Probeer een andere zip of losse ${system.extensions.filter((ext) => ext !== '.zip').join('/')} ROM.`;
    els.startButton.disabled = true;
  }
}

async function handleSnesZip(zipFile) {
  try {
    clearRomUrl();
    const JSZip = await loadJsZip();
    const zip = await JSZip.loadAsync(zipFile);
    const romEntry = Object.values(zip.files).find((entry) => !entry.dir && /\.(sfc|smc)$/i.test(entry.name));

    if (!romEntry) {
      showToast('Deze SNES zip bevat geen .sfc of .smc bestand.', 'error');
      els.romMeta.textContent = 'Geen geldige SNES ROM gevonden in de zip.';
      els.startButton.disabled = true;
      return;
    }

    const blob = await romEntry.async('blob');
    const romName = romEntry.name.replace(/^.*[\/]/, '');
    activeRom = new File([blob], romName, { type: 'application/octet-stream' });
    activeRomFiles = [zipFile, activeRom];
    ps1BundleMeta = null;
    ps1SelectedLaunchFileName = null;
    activeRomUrl = URL.createObjectURL(activeRom);
    els.romMeta.innerHTML = `<strong>SNES zip uitgepakt:</strong><br>${escapeHtml(zipFile.name)} → ${escapeHtml(romName)} — ${formatBytes(activeRom.size)}`;
    els.startButton.disabled = false;
    updateStatus(`${romName} uit ${zipFile.name} geladen voor SNES.`);
    showToast('SNES zip geopend. Je kunt de game starten.', 'ok');
  } catch (error) {
    console.error(error);
    showToast('SNES zip openen mislukt.', 'error');
    els.romMeta.textContent = 'Kon de zip niet lezen. Probeer een andere zip of losse .sfc/.smc.';
    els.startButton.disabled = true;
  }
}

async function handlePs1Files(files) {
  const invalid = files.filter((file) => !systems.ps1.extensions.some((ext) => file.name.toLowerCase().endsWith(ext)));
  if (invalid.length) {
    showToast(`PS1 ondersteunt hier alleen: ${systems.ps1.extensions.join(', ')}`, 'error');
    els.romMeta.textContent = `Ongeldig PS1-bestand: ${invalid[0].name}`;
    els.startButton.disabled = true;
    return;
  }

  clearRomUrl();
  activeRomFiles = files;
  ps1BundleMeta = null;
  ps1SelectedLaunchFileName = null;

  if (files.length === 1 && /\.zip$/i.test(files[0].name)) {
    await handlePs1Zip(files[0]);
    return;
  }

  const primarySingle = files.length === 1 && /\.(chd|pbp|bin)$/i.test(files[0].name);
  if (primarySingle) {
    activeRom = files[0];
    activeRomUrl = URL.createObjectURL(files[0]);
    els.romMeta.innerHTML = `${escapeHtml(files[0].name)} — ${formatBytes(files[0].size)}${/\.bin$/i.test(files[0].name) ? '<div class="bundle-list"><strong>Let op:</strong> alleen een losse .bin/Track 1 kan starten, maar mist mogelijk audio/cutscene/data tracks. Beter: laad de .cue plus alle .bin tracks tegelijk, of gebruik .chd/.pbp.</div>' : ''}`;
    els.startButton.disabled = false;
    updateStatus(`${files[0].name} geladen voor PS1.`);
    showToast(/\.bin$/i.test(files[0].name) ? 'Losse .bin geladen. Voor multi-track liever .cue + alle .bin tracks.' : 'PS1 ROM geladen.', /\.bin$/i.test(files[0].name) ? 'info' : 'ok');
    return;
  }

  const cue = files.find((file) => file.name.toLowerCase().endsWith('.cue'));
  if (!cue) {
    showToast('Voor meerdere PS1 tracks heb je de .cue plus alle .bin tracks nodig.', 'error');
    els.romMeta.textContent = 'Selecteer de .cue én alle bijbehorende .bin tracks tegelijk.';
    els.startButton.disabled = true;
    return;
  }

  const cueText = await cue.text();
  const referenced = extractCueFileNames(cueText);
  const lowerNames = new Map(files.map((file) => [normalizeCueName(file.name), file]));
  const missing = referenced.filter((name) => !lowerNames.has(normalizeCueName(name)));
  if (missing.length) {
    showToast(`Cue mist trackbestand: ${missing[0]}`, 'error');
    els.romMeta.innerHTML = `<div class="bundle-list"><strong>CUE gevonden, maar mist bestand:</strong><br>${missing.map(escapeHtml).join('<br>')}</div>`;
    els.startButton.disabled = true;
    return;
  }

  try {
    updateStatus('PS1 multi-track voorbereiden... Dit kan bij grote games zoals Tekken even duren.');
    showToast('PS1 tracks voorbereiden... even wachten bij grote bestanden.', 'info');
    const virtual = await createPs1VirtualCueSession(cue, files, referenced);
    activeRomUrl = virtual.cueUrl;
    activeRom = new File([virtual.cueText], cue.name, { type: 'application/x-cue' });
    activeVirtualSession = virtual.sessionId;
    ps1BundleMeta = {
      cueName: cue.name,
      files: files.map((file) => file.name),
      referenced,
      mode: 'virtual-cue',
      launchFileName: inferPs1TrackOneName(referenced, files)
    };
    ps1SelectedLaunchFileName = ps1BundleMeta.launchFileName;
    renderPs1TrackSelector(files, cue.name, referenced, 'directe .cue met virtuele .bin tracks');
    els.startButton.disabled = false;
    updateStatus(`PS1 multi-track set klaargezet vanuit ${cue.name}.`);
    showToast('PS1 .cue + tracks klaargezet. Vink Track 1 aan als boot-track; de andere tracks blijven beschikbaar via de virtuele .cue.', 'ok');
  } catch (error) {
    console.error(error);
    showToast('PS1 multi-track voorbereiden mislukt.', 'error');
    const safeError = escapeHtml(error?.message || String(error));
    els.romMeta.innerHTML = `<div class="bundle-list"><strong>PS1 multi-track voorbereiden mislukt.</strong><br>${safeError}<br><br>Gebruik http://localhost:8080, niet file://. Doe daarna Ctrl+F5 en kies opnieuw de .cue + alle .bin tracks. V9 geeft grote PS1 games zoals Tekken veel meer voorbereidingstijd.</div>`;
    els.startButton.disabled = true;
  }
}

async function handlePs1Zip(zipFile) {
  try {
    clearRomUrl();
    const JSZip = await loadJsZip();
    const zip = await JSZip.loadAsync(zipFile);
    const entries = Object.values(zip.files).filter((entry) => !entry.dir);
    const cueEntry = entries.find((entry) => /\.cue$/i.test(entry.name));
    const chdOrPbp = entries.find((entry) => /\.(chd|pbp)$/i.test(entry.name));

    if (!cueEntry && !chdOrPbp) {
      showToast('Deze PS1 zip bevat geen .cue, .chd of .pbp.', 'error');
      els.romMeta.textContent = 'Geen geldige PS1 inhoud gevonden in de zip.';
      els.startButton.disabled = true;
      return;
    }

    if (cueEntry) {
      const cueText = await cueEntry.async('text');
      const referenced = extractCueFileNames(cueText);
      const fileObjects = [];
      const lowerToEntry = new Map(entries.map((entry) => [normalizeCueName(entry.name), entry]));
      const missing = referenced.filter((name) => !lowerToEntry.has(normalizeCueName(name)));
      if (missing.length) {
        showToast(`PS1 zip mist trackbestand: ${missing[0]}`, 'error');
        els.romMeta.innerHTML = `<div class="bundle-list"><strong>Zip bevat .cue, maar mist:</strong><br>${missing.map(escapeHtml).join('<br>')}</div>`;
        els.startButton.disabled = true;
        return;
      }

      const cueFile = new File([cueText], cueEntry.name.replace(/^.*[\\/]/, ''), { type: 'application/x-cue' });
      fileObjects.push(cueFile);
      for (const name of referenced) {
        const entry = lowerToEntry.get(normalizeCueName(name));
        const blob = await entry.async('blob');
        fileObjects.push(new File([blob], entry.name.replace(/^.*[\\/]/, ''), { type: 'application/octet-stream' }));
      }

      updateStatus('PS1 zip multi-track voorbereiden... Dit kan bij grote games even duren.');
      showToast('PS1 zip tracks voorbereiden... even wachten bij grote bestanden.', 'info');
      const virtual = await createPs1VirtualCueSession(cueFile, fileObjects, referenced);
      activeRomUrl = virtual.cueUrl;
      activeRom = new File([virtual.cueText], cueFile.name, { type: 'application/x-cue' });
      activeRomFiles = [zipFile, ...fileObjects];
      activeVirtualSession = virtual.sessionId;
      ps1BundleMeta = {
        cueName: cueFile.name,
        files: fileObjects.map((file) => file.name),
        referenced,
        mode: 'zip-virtual-cue',
        launchFileName: inferPs1TrackOneName(referenced, fileObjects)
      };
      ps1SelectedLaunchFileName = ps1BundleMeta.launchFileName;
      renderPs1TrackSelector(fileObjects, cueFile.name, referenced, 'zip → virtuele .cue met tracks');
      els.startButton.disabled = false;
      updateStatus(`PS1 zip klaargezet via .cue: ${cueFile.name}.`);
      showToast('PS1 zip met .cue/tracks klaargezet. Vink Track 1 aan als boot-track.', 'ok');
      return;
    }

    // Zip with one-piece .chd/.pbp: extract and launch that actual file, not the zip container.
    const blob = await chdOrPbp.async('blob');
    const romName = chdOrPbp.name.replace(/^.*[\\/]/, '');
    activeRom = new File([blob], romName, { type: 'application/octet-stream' });
    activeRomFiles = [zipFile, activeRom];
    activeRomUrl = URL.createObjectURL(activeRom);
    ps1BundleMeta = null;
    els.romMeta.innerHTML = `<div class="bundle-list"><strong>PS1 zip uitgepakt:</strong><br>${escapeHtml(zipFile.name)} → ${escapeHtml(romName)} — ${formatBytes(activeRom.size)}</div>`;
    els.startButton.disabled = false;
    updateStatus(`PS1 ${romName} uit zip geladen.`);
    showToast('PS1 zip geopend. Je kunt starten.', 'ok');
  } catch (error) {
    console.error(error);
    showToast('PS1 zip openen mislukt.', 'error');
    els.romMeta.textContent = 'Kon de PS1 zip niet lezen.';
    els.startButton.disabled = true;
  }
}

function inferPs1TrackOneName(referenced, files) {
  const allNames = referenced && referenced.length ? referenced : files.map((file) => file.name);
  const trackOne = allNames.find((name) => /(?:track\s*0?1|\(track\s*0?1\)|\b01\b)/i.test(name));
  return normalizeCueName(trackOne || allNames[0] || '');
}

function renderPs1TrackSelector(files, cueName, referenced, methodLabel) {
  const selected = ps1SelectedLaunchFileName || inferPs1TrackOneName(referenced, files);
  ps1SelectedLaunchFileName = selected;
  const fileByNorm = new Map(files.map((file) => [normalizeCueName(file.name), file]));
  const orderedRefs = referenced && referenced.length ? referenced : files.filter((file) => /\.bin$/i.test(file.name)).map((file) => file.name);
  const refRows = orderedRefs.map((refName, index) => {
    const normalized = normalizeCueName(refName);
    const file = fileByNorm.get(normalized);
    const checked = normalized === selected ? 'checked' : '';
    const label = index === 0 ? 'Waarschijnlijk Track 1 / boot' : `Track ${index + 1}`;
    return `<label class="track-choice ${checked ? 'selected' : ''}">
      <input type="radio" name="ps1TrackOne" value="${escapeHtml(normalized)}" ${checked} />
      <span class="track-dot"></span>
      <span class="track-main"><strong>${escapeHtml(label)}</strong><em>${escapeHtml(file?.name || refName)}${file ? ` — ${formatBytes(file.size)}` : ''}</em></span>
    </label>`;
  }).join('');

  const otherFiles = files.filter((file) => !orderedRefs.map(normalizeCueName).includes(normalizeCueName(file.name)) && !/\.cue$/i.test(file.name));
  const extraRows = otherFiles.length ? `<div class="bundle-muted"><strong>Extra bestanden blijven mee beschikbaar:</strong><br>${otherFiles.map((file) => `• ${escapeHtml(file.name)} — ${formatBytes(file.size)}`).join('<br>')}</div>` : '';

  els.romMeta.innerHTML = `<div class="bundle-list ps1-track-panel">
    <strong>PS1 multi-track klaar:</strong><br>
    <span>Startcontainer: ${escapeHtml(cueName)}</span><br>
    <span>Laadmethode: ${escapeHtml(methodLabel)}</span>
    <div class="track-select-title">Vink aan welke .bin jouw Track 1 / boot-track is:</div>
    <div class="track-choice-list">${refRows}</div>
    ${extraRows}
    <div class="bundle-note">De app start technisch via een virtuele .cue, omdat alleen zo Track 2/3/audio/cutscenes beschikbaar blijven. De aangevinkte Track 1 wordt gebruikt als gekozen boot-track/label en save-identiteit.</div>
  </div>`;

  bindPs1TrackChoiceEvents(files);
}

function bindPs1TrackChoiceEvents(files) {
  els.romMeta.querySelectorAll('input[name="ps1TrackOne"]').forEach((input) => {
    input.addEventListener('change', () => {
      ps1SelectedLaunchFileName = input.value;
      if (ps1BundleMeta) ps1BundleMeta.launchFileName = input.value;
      const chosen = files.find((file) => normalizeCueName(file.name) === input.value);
      els.romMeta.querySelectorAll('.track-choice').forEach((label) => label.classList.remove('selected'));
      input.closest('.track-choice')?.classList.add('selected');
      showToast(`Track 1 ingesteld op: ${chosen?.name || input.value}`, 'ok');
      updateStatus(`PS1 boot-track gekozen: ${chosen?.name || input.value}.`);
    });
  });
}

async function ensurePs1ServiceWorkerReady() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    throw new Error('Service worker vereist voor PS1 multi-track. Gebruik http://localhost of https. Open niet via file://.');
  }
  if (serviceWorkerReadyPromise) return serviceWorkerReadyPromise;
  serviceWorkerReadyPromise = (async () => {
    const registration = await navigator.serviceWorker.register('./service-worker.js', { scope: './' });
    await navigator.serviceWorker.ready;

    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => {
        let resolved = false;
        const finish = () => {
          if (resolved) return;
          resolved = true;
          resolve();
        };
        const timer = window.setTimeout(finish, PS1_SW_TIMEOUT_MS);
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.clearTimeout(timer);
          finish();
        }, { once: true });
      });
    }

    if (!navigator.serviceWorker.controller) {
      throw new Error('Service worker is nog niet actief op deze pagina. Doe Ctrl+F5/herlaad en probeer opnieuw.');
    }
    return registration;
  })();
  return serviceWorkerReadyPromise;
}

function postMessageToServiceWorker(message, transfer = []) {
  return new Promise((resolve, reject) => {
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
      reject(new Error('Geen actieve service worker controller. Herlaad de pagina.'));
      return;
    }

    const channel = new MessageChannel();
    const timeoutMs = message.type === 'REGISTER_VIRTUAL_FILES' ? VIRTUAL_SW_TIMEOUT_MS : PS1_SW_TIMEOUT_MS;
    const timeout = window.setTimeout(() => {
      channel.port1.onmessage = null;
      reject(new Error('Service worker reageerde niet op tijd.'));
    }, timeoutMs);

    channel.port1.onmessage = (event) => {
      window.clearTimeout(timeout);
      const data = event.data || {};
      if (data.ok) resolve(data);
      else reject(new Error(data.error || 'Service worker kon bestanden niet registreren.'));
    };

    controller.postMessage(message, [channel.port2, ...transfer]);
  });
}

async function createVirtualFileSession(kind, file) {
  await ensurePs1ServiceWorkerReady();
  const sessionId = `${kind}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const prefix = `/__retro_virtual__/${kind}/`;
  const baseUrl = new URL(`__retro_virtual__/${kind}/${sessionId}/`, window.location.href);
  const cleanName = file.name.replace(/^.*[\/]/, '');
  const virtualPath = new URL(encodeURIComponent(cleanName), baseUrl).pathname;

  await postMessageToServiceWorker({
    type: 'REGISTER_VIRTUAL_FILES',
    sessionId,
    prefix,
    files: [{
      name: cleanName,
      path: virtualPath,
      blob: file
    }]
  });

  return {
    sessionId,
    url: new URL(encodeURIComponent(cleanName), baseUrl).href
  };
}

async function createPs1VirtualCueSession(cue, files, referenced) {
  await ensurePs1ServiceWorkerReady();

  const sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const baseUrl = new URL(`__retro_ps1__/${sessionId}/`, window.location.href);
  const fileByName = new Map(files.map((file) => [normalizeCueName(file.name), file]));
  const cueTextOriginal = await cue.text();
  const cueText = rewriteCueToBasenames(cueTextOriginal);
  const cueBaseName = cue.name.replace(/^.*[\\/]/, '');

  const swFiles = [];
  swFiles.push({
    name: cueBaseName,
    path: new URL(encodeURIComponent(cueBaseName), baseUrl).pathname,
    blob: new Blob([cueText], { type: 'application/x-cue' })
  });

  for (const refName of referenced) {
    const file = fileByName.get(normalizeCueName(refName));
    if (!file) throw new Error(`Missing referenced file: ${refName}`);
    const cleanName = refName.replace(/^.*[\\/]/, '');
    swFiles.push({
      name: cleanName,
      path: new URL(encodeURIComponent(cleanName), baseUrl).pathname,
      blob: file
    });
  }

  // V9: stuur de geselecteerde File/Blob-objecten rechtstreeks naar de service worker.
  // Dit voorkomt Cache API quota-problemen bij grote PS1 games zoals Tekken 3 (600MB+).
  await postMessageToServiceWorker({
    type: 'REGISTER_PS1_FILES',
    sessionId,
    files: swFiles
  });

  return {
    sessionId,
    cueUrl: new URL(encodeURIComponent(cueBaseName), baseUrl).href,
    cueText
  };
}

function rewriteCueToBasenames(cueText) {
  return cueText.replace(/^(\s*FILE\s+")([^"]+)("\s+BINARY\s*)$/gim, (_, start, fileName, end) => {
    return `${start}${fileName.replace(/^.*[\\/]/, '')}${end}`;
  });
}

function extractCueFileNames(cueText) {
  const matches = [];
  const regex = /^\s*FILE\s+"([^"]+)"\s+BINARY\s*$/gim;
  let match;
  while ((match = regex.exec(cueText))) matches.push(match[1]);
  return matches;
}

function normalizeCueName(name) {
  return String(name).replace(/^.*[\\/]/, '').toLowerCase();
}

async function createPs1CueZip(cue, files, referenced) {
  const JSZip = await loadJsZip();
  const zip = new JSZip();
  const needed = new Set([cue.name.toLowerCase(), ...referenced.map((name) => normalizeCueName(name))]);
  for (const file of files) {
    if (file === cue || needed.has(file.name.toLowerCase())) {
      zip.file(normalizeCueName(file.name), file);
    }
  }
  // Keep the original .cue names intact. The .bin files are in the same virtual folder inside the zip.
  return zip.generateAsync({ type: 'blob', compression: 'STORE' });
}

function loadJsZip() {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  if (jsZipPromise) return jsZipPromise;
  jsZipPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = JSZIP_CDN;
    script.async = true;
    script.onload = () => resolve(window.JSZip);
    script.onerror = () => reject(new Error('JSZip failed to load'));
    document.body.appendChild(script);
  });
  return jsZipPromise;
}

function clearRomUrl() {
  if (activeRomUrl) URL.revokeObjectURL(activeRomUrl);
  if (ps1BundleUrl && ps1BundleUrl !== activeRomUrl) URL.revokeObjectURL(ps1BundleUrl);
  activeRomUrl = null;
  ps1BundleUrl = null;
  activeVirtualSession = null;
  activePspMode = 'blob';
}


async function startGame() {
  if (activeSystem?.unsupportedReason) {
    showToast(`${activeSystem.title} kan in deze build nog niet starten: ${activeSystem.unsupportedReason}`, 'error');
    return;
  }
  if (!activeSystem || !activeRom || !activeRomUrl) {
    showToast('Selecteer eerst een ROM voordat je de game start.', 'error');
    return;
  }

  teardownEmulator();
  els.emptyState.classList.add('hidden');
  setEmulatorActive(true);
  els.viewportTitle.textContent = `${activeSystem.title} — ${activeRom.name}`;
  updateStatus('Emulator wordt geladen...');

  window.EJS_player = '#game';
  window.EJS_core = activeSystem.core;
  window.EJS_gameName = getActiveGameDisplayName();
  window.EJS_gameUrl = activeRomUrl;
  window.EJS_gameID = getSaveKey();
  window.EJS_pathtodata = EMULATOR_DATA_PATH;
  window.EJS_startOnLoaded = true;
  window.EJS_AdUrl = '';
  window.EJS_color = activeSystem.theme;
  window.EJS_alignStartButton = 'center';
  window.EJS_backgroundImage = activeSystem.image;
  window.EJS_backgroundBlur = true;

  // EmulatorJS handles its own final input layer. Keep heavy 3D/PSP/N64/PS1 cores as clean as possible.
  window.EJS_defaultOptions = {
    'save-state-location': 'browser'
  };
  if (['n64', 'gamecube'].includes(activeSystem.id)) {
    // N64/GameCube-style systems support four controller ports; native gamepad input maps browser pads to ports.
    window.EJS_defaultOptions['input_max_users'] = '4';
    window.EJS_defaultOptions['input_libretro_device_p1'] = '1';
    window.EJS_defaultOptions['input_libretro_device_p2'] = '1';
    window.EJS_defaultOptions['input_libretro_device_p3'] = '1';
    window.EJS_defaultOptions['input_libretro_device_p4'] = '1';
  }
  if (!['ps1', 'n64', 'psp', 'gamecube'].includes(activeSystem.id)) {
    window.EJS_defaultOptions.shader = 'crt-mattias';
  }
  if (activeSystem.id === 'psp') {
    window.EJS_defaultOptions['video-filter'] = 'nearest';
    window.EJS_defaultOptions['input_max_users'] = '1';
  }

  // Explicit controls keep PS4/PS5/Xbox controllers predictable across cores.
  // For N64 this is essential: Ocarina of Time uses the N64 analog stick, not the D-pad.
  window.EJS_defaultControls = buildDefaultControls(activeSystem.id);
  window.EJS_gamepad = true;
  window.EJS_multitap = ['n64', 'gamecube'].includes(activeSystem.id) ? 4 : (activeSystem.id === 'ps1' ? true : false);
  window.EJS_biosUrl = '';
  window.EJS_disableDatabases = ['ps1', 'n64', 'psp', 'gamecube'].includes(activeSystem.id) ? true : false;

  try {
    await loadEmulatorScript();
    installMobileEmulatorUiFix();
    focusEmulatorSoon();
    scrollGameIntoViewOnMobile();
    showToast(['ps1', 'n64', 'psp', 'gamecube'].includes(activeSystem.id)
      ? `${activeSystem.title} gestart. Klik één keer in het scherm en druk een controllerknop. ${activeSystem.id === 'n64' ? 'Native 4-pad input + controller-fallback staan aan.' : `Native gamepad-input staat aan${['gamecube'].includes(activeSystem.id) ? ' met maximaal 4 controllerpoorten' : ''}.`}`
      : 'Game gestart. Klik één keer in het scherm.', 'ok');
    updateStatus('Game actief.');
  } catch (error) {
    console.error(error);
    showToast('Emulator kon niet laden. Controleer internet/CDN of probeer opnieuw.', 'error');
    updateStatus('Emulator laden mislukt.');
  }
}

function loadEmulatorScript() {
  return new Promise((resolve, reject) => {
    const old = document.querySelector('script[data-emulatorjs]');
    if (old) old.remove();

    const script = document.createElement('script');
    script.src = `${EMULATOR_DATA_PATH}loader.js`;
    script.dataset.emulatorjs = 'true';
    script.async = true;
    script.onload = () => {
      emulatorScriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('EmulatorJS loader failed'));
    document.body.appendChild(script);
  });
}

function teardownEmulator() {
  resetMobileEmulatorUiFix();
  setEmulatorActive(false);
  els.game.innerHTML = '';
  els.emptyState.classList.remove('hidden');
  const old = document.querySelector('script[data-emulatorjs]');
  if (old) old.remove();
  emulatorScriptLoaded = false;
}

function focusEmulatorSoon() {
  window.setTimeout(() => {
    const focusTarget = els.game.querySelector('canvas, iframe, div') || els.emulatorFrame;
    focusTarget.setAttribute?.('tabindex', '0');
    focusTarget.focus?.();
  }, 900);
}

function scanControllers() {
  const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
  renderControllerStatus(pads);
  if (pads.length) showToast(`${pads.length} controller(s) gevonden.`, 'ok');
  else showToast('Geen controller gevonden. Druk op een knop en scan opnieuw.', 'info');
}

function renderControllerStatus(pads = []) {
  const rows = [];
  const maxPlayers = activeSystem && ['n64', 'gamecube'].includes(activeSystem.id) ? 4 : 2;
  for (let i = 0; i < maxPlayers; i += 1) {
    const pad = pads[i];
    rows.push(`<div class="status-item"><strong>Player ${i + 1}</strong><span>${pad ? escapeHtml(pad.id) : 'Geen controller gevonden'}</span></div>`);
  }
  els.controllerStatus.innerHTML = rows.join('');
}

function setSpeed(value) {
  const speed = Math.max(1, Math.min(15, Number(value) || 1));
  els.speedRange.value = String(speed);
  els.speedValue.textContent = `${speed}x`;
  window.EJS_emulator?.setSpeed?.(speed);
  window.EJS_emulator?.gameManager?.setSpeed?.(speed);
}

async function saveBrowserNow() {
  if (!activeSystem || !activeRom) {
    showToast('Geen ROM actief om save aan te koppelen.', 'error');
    return;
  }
  const key = getSaveKey();
  const payload = {
    system: activeSystem.id,
    romName: activeRom.name,
    createdAt: new Date().toISOString(),
    note: 'Manual browser save marker. EmulatorJS beheert interne saves ook via browser storage waar ondersteund.',
    importedSave: lastSaveBlob ? await blobToBase64(lastSaveBlob) : null
  };
  await putSave(key, payload);
  showToast('Browser save-marker opgeslagen in IndexedDB.', 'ok');
  els.saveNote.textContent = `Save gekoppeld aan ${activeSystem.id}/${activeRom.name}.`;
}

async function loadBrowserSave() {
  if (!activeSystem || !activeRom) {
    showToast('Geen ROM actief om save te laden.', 'error');
    return;
  }
  const save = await getSave(getSaveKey());
  if (!save) {
    showToast('Geen browser save gevonden voor deze ROM.', 'error');
    return;
  }
  showToast('Browser save gevonden. Interne emulator-save wordt automatisch door EmulatorJS beheerd waar ondersteund.', 'ok');
  els.saveNote.textContent = `Laatste save-marker: ${new Date(save.createdAt).toLocaleString('nl-NL')}`;
}

async function exportSaveFile() {
  if (!activeSystem || !activeRom) {
    showToast('Geen ROM actief om save te exporteren.', 'error');
    return;
  }
  const save = await getSave(getSaveKey());
  if (!save) {
    showToast('Geen save gevonden om te exporteren.', 'error');
    return;
  }
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${activeSystem.id}-${safeFileName(activeRom.name)}.sav.json`);
  showToast('Save-export gemaakt.', 'ok');
}

async function importSaveFile(file) {
  if (!activeSystem || !activeRom) {
    showToast('Start of selecteer eerst een ROM om deze save aan te koppelen.', 'error');
    return;
  }
  if (!file) return;
  lastSaveBlob = file;
  const payload = {
    system: activeSystem.id,
    romName: activeRom.name,
    createdAt: new Date().toISOString(),
    importedFileName: file.name,
    importedSave: await blobToBase64(file)
  };
  await putSave(getSaveKey(), payload);
  showToast('Save geïmporteerd en gekoppeld aan deze ROM.', 'ok');
}

function getActiveGameDisplayName() {
  if (activeSystem?.id === 'ps1' && ps1BundleMeta) {
    const launchName = ps1BundleMeta.launchFileName || ps1SelectedLaunchFileName;
    if (launchName) return launchName.replace(/\.[^.]+$/, '');
    return ps1BundleMeta.cueName.replace(/\.[^.]+$/, '');
  }
  return activeRom.name.replace(/\.[^.]+$/, '');
}

function getSaveKey() {
  if (activeSystem?.id === 'ps1' && ps1BundleMeta) {
    const launchName = ps1BundleMeta.launchFileName || ps1SelectedLaunchFileName || ps1BundleMeta.cueName;
    return `${activeSystem.id}::${String(launchName).toLowerCase()}::${ps1BundleMeta.cueName.toLowerCase()}::${activeRomFiles.reduce((total, file) => total + (file.size || 0), 0)}`;
  }
  return `${activeSystem.id}::${activeRom.name.toLowerCase()}::${activeRom.size}`;
}

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

async function putSave(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getSave(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function safeFileName(name) {
  return name.replace(/[^a-z0-9._-]/gi, '_');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function updateStatus(message) {
  els.globalStatus.textContent = message;
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  els.toastWrap.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4200);
}


function buildDefaultControls(systemId) {
  const controls = {
    0: buildPlayerControls(0),
    1: buildPlayerControls(1),
    2: {},
    3: {}
  };

  if (systemId === 'n64' || systemId === 'gamecube') {
    controls[0] = buildN64LikePlayerControls(0);
    controls[1] = buildN64LikePlayerControls(1);
    controls[2] = buildN64LikePlayerControls(2);
    controls[3] = buildN64LikePlayerControls(3);
  }

  return controls;
}

function buildPlayerControls(playerIndex) {
  const keyboard = [
    { b: 'x', y: 's', select: 'shift', start: 'enter', up: 'up arrow', down: 'down arrow', left: 'left arrow', right: 'right arrow', a: 'z', x: 'a', l: 'q', r: 'e', l2: 'tab', r2: 'r', lsR: 'h', lsL: 'f', lsD: 'g', lsU: 't', rsR: 'l', rsL: 'j', rsD: 'k', rsU: 'i' },
    { b: 'g', y: 't', select: 'c', start: 'v', up: 'w', down: 's', left: 'a', right: 'd', a: 'f', x: 'r', l: 'r', r: 't', l2: 'y', r2: 'u', lsR: 'd', lsL: 'a', lsD: 's', lsU: 'w', rsR: 'm', rsL: 'n', rsD: ',', rsU: 'b' }
  ][playerIndex] || {};
  return makeControls(keyboard);
}

function buildN64LikePlayerControls(playerIndex) {
  const keyboard = [
    { b: 'x', y: 's', select: 'shift', start: 'enter', up: 'up arrow', down: 'down arrow', left: 'left arrow', right: 'right arrow', a: 'z', x: 'a', l: 'q', r: 'e', l2: 'r', r2: 'r', lsR: 'h', lsL: 'f', lsD: 'g', lsU: 't', rsR: 'l', rsL: 'j', rsD: 'k', rsU: 'i' },
    { b: 'g', y: 't', select: 'c', start: 'v', up: 'w', down: 's', left: 'a', right: 'd', a: 'f', x: 'r', l: 'r', r: 't', l2: 'y', r2: 'y', lsR: 'd', lsL: 'a', lsD: 's', lsU: 'w', rsR: 'm', rsL: 'n', rsD: ',', rsU: 'b' },
    { b: 'o', y: 'p', select: 'h', start: 'n', up: 'i', down: 'k', left: 'j', right: 'l', a: 'u', x: 'y', l: 'y', r: 'p', l2: '6', r2: '6', lsR: 'l', lsL: 'j', lsD: 'k', lsU: 'i', rsR: '3', rsL: '1', rsD: '2', rsU: '5' },
    { b: '2', y: '9', select: '0', start: '3', up: '8', down: '5', left: '4', right: '6', a: '1', x: '7', l: '7', r: '9', l2: '0', r2: '0', lsR: '6', lsL: '4', lsD: '5', lsU: '8', rsR: 'PageDown', rsL: 'Insert', rsD: 'End', rsU: 'Home' }
  ][playerIndex] || {};
  return makeControls(keyboard);
}

function makeControls(k) {
  // Indices follow EmulatorJS/RetroArch retropad mapping.
  // Hotkeys 24-29 intentionally receive no controller value2 so normal controllers do not become fast-forward/slow-motion.
  return {
    0: { value: k.b || 'x', value2: 'BUTTON_1' },
    1: { value: k.y || 's', value2: 'BUTTON_3' },
    2: { value: k.select || 'shift', value2: 'SELECT' },
    3: { value: k.start || 'enter', value2: 'START' },
    4: { value: k.up || 'up arrow', value2: 'DPAD_UP' },
    5: { value: k.down || 'down arrow', value2: 'DPAD_DOWN' },
    6: { value: k.left || 'left arrow', value2: 'DPAD_LEFT' },
    7: { value: k.right || 'right arrow', value2: 'DPAD_RIGHT' },
    8: { value: k.a || 'z', value2: 'BUTTON_0' },
    9: { value: k.x || 'a', value2: 'BUTTON_2' },
    10: { value: k.l || 'q', value2: 'LEFT_TOP_SHOULDER' },
    11: { value: k.r || 'e', value2: 'RIGHT_TOP_SHOULDER' },
    12: { value: k.l2 || 'tab', value2: 'LEFT_BOTTOM_SHOULDER' },
    13: { value: k.r2 || 'r', value2: 'RIGHT_BOTTOM_SHOULDER' },
    14: { value: '', value2: 'LEFT_STICK' },
    15: { value: '', value2: 'RIGHT_STICK' },
    16: { value: k.lsR || 'h', value2: 'LEFT_STICK_X:+1' },
    17: { value: k.lsL || 'f', value2: 'LEFT_STICK_X:-1' },
    18: { value: k.lsD || 'g', value2: 'LEFT_STICK_Y:+1' },
    19: { value: k.lsU || 't', value2: 'LEFT_STICK_Y:-1' },
    20: { value: k.rsR || 'l', value2: 'RIGHT_STICK_X:+1' },
    21: { value: k.rsL || 'j', value2: 'RIGHT_STICK_X:-1' },
    22: { value: k.rsD || 'k', value2: 'RIGHT_STICK_Y:+1' },
    23: { value: k.rsU || 'i', value2: 'RIGHT_STICK_Y:-1' },
    24: { value: '' },
    25: { value: '' },
    26: { value: '' },
    27: { value: '' },
    28: { value: '' },
    29: { value: '' }
  };
}

function startGamepadKeyboardBridge() {
  if (!CONTROLLER_KEYBOARD_BRIDGE_ENABLED) return;
  if (gamepadBridgeStarted) return;
  gamepadBridgeStarted = true;
  const loop = () => {
    try {
      bridgeGamepadsToKeyboard();
    } catch (error) {
      console.warn('Gamepad bridge error', error);
    }
    window.requestAnimationFrame(loop);
  };
  loop();
}

function bridgeGamepadsToKeyboard() {
  if (!activeSystem || !document.querySelector('script[data-emulatorjs]')) return;
  // PS1/PSP/GameCube stay native. PS1 especially can trigger hotkeys like slow-motion/fast-forward if bridged.
  // N64 keeps native 4-pad input, plus an analog-stick fallback that targets EmulatorJS left-stick bindings.
  if (['ps1', 'psp', 'gamecube'].includes(activeSystem.id)) return;
  const maxBridgePads = activeSystem.id === 'n64' ? 4 : 2;
  const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean).slice(0, maxBridgePads) : [];
  pads.forEach((pad, index) => {
    const mapping = getGamepadKeyboardMapForPlayer(pad, index);
    const pressed = gamepadPressedKeys.get(index) || new Set();
    const next = new Set();
    for (const [key, isDown] of Object.entries(mapping)) {
      if (isDown) next.add(key);
      if (isDown && !pressed.has(key)) dispatchSyntheticKey(key, 'keydown');
      if (!isDown && pressed.has(key)) dispatchSyntheticKey(key, 'keyup');
    }
    gamepadPressedKeys.set(index, next);
  });
}

function getGamepadKeyboardMapForPlayer(pad, index) {
  if (activeSystem && activeSystem.id === 'n64') return getN64FallbackMapForPlayer(pad, index);
  if (index === 0) return getP1GamepadKeyMap(pad);
  if (index === 1) return getP2GamepadKeyMap(pad);
  if (index === 2) return getP3GamepadKeyMap(pad);
  return getP4GamepadKeyMap(pad);
}

function getN64FallbackMapForPlayer(pad, index) {
  // These keys are explicitly bound in buildDefaultControls() to LEFT_STICK and RIGHT_STICK directions.
  // That fixes games like Ocarina of Time where the D-pad does not move Link.
  const bindings = [
    { left: 'f', right: 'h', up: 't', down: 'g', cLeft: 'j', cRight: 'l', cUp: 'i', cDown: 'k', a: 'z', b: 'x', z: 'r', l: 'q', r: 'e', start: 'Enter' },
    { left: 'a', right: 'd', up: 'w', down: 's', cLeft: 'n', cRight: 'm', cUp: 'b', cDown: ',', a: 'f', b: 'g', z: 'y', l: 'r', r: 't', start: 'v' },
    { left: 'j', right: 'l', up: 'i', down: 'k', cLeft: '1', cRight: '3', cUp: '5', cDown: '2', a: 'u', b: 'o', z: '6', l: 'y', r: 'p', start: 'n' },
    { left: '4', right: '6', up: '8', down: '5', cLeft: 'Insert', cRight: 'PageDown', cUp: 'Home', cDown: 'End', a: '1', b: '2', z: '0', l: '7', r: '9', start: '3' }
  ];
  const b = bindings[index] || bindings[0];
  const left = axisDown(pad.axes[0], -1) || buttonDown(pad.buttons[14]);
  const right = axisDown(pad.axes[0], 1) || buttonDown(pad.buttons[15]);
  const up = axisDown(pad.axes[1], -1) || buttonDown(pad.buttons[12]);
  const down = axisDown(pad.axes[1], 1) || buttonDown(pad.buttons[13]);
  const cLeft = axisDown(pad.axes[2], -1);
  const cRight = axisDown(pad.axes[2], 1);
  const cUp = axisDown(pad.axes[3], -1) || buttonDown(pad.buttons[3]);
  const cDown = axisDown(pad.axes[3], 1);
  return {
    [b.left]: left,
    [b.right]: right,
    [b.up]: up,
    [b.down]: down,
    [b.cLeft]: cLeft,
    [b.cRight]: cRight,
    [b.cUp]: cUp,
    [b.cDown]: cDown,
    [b.a]: buttonDown(pad.buttons[0]),       // Xbox A / PS Cross -> N64 A
    [b.b]: buttonDown(pad.buttons[1]),       // Xbox B / PS Circle -> N64 B
    [b.z]: buttonDown(pad.buttons[6]) || buttonDown(pad.buttons[2]), // L2 or Square -> N64 Z trigger
    [b.l]: buttonDown(pad.buttons[4]),       // L1
    [b.r]: buttonDown(pad.buttons[5]),       // R1
    Shift: buttonDown(pad.buttons[8]),
    [b.start]: buttonDown(pad.buttons[9])
  };
}

function getP1GamepadKeyMap(pad) {
  const left = axisDown(pad.axes[0], -1) || buttonDown(pad.buttons[14]);
  const right = axisDown(pad.axes[0], 1) || buttonDown(pad.buttons[15]);
  const up = axisDown(pad.axes[1], -1) || buttonDown(pad.buttons[12]);
  const down = axisDown(pad.axes[1], 1) || buttonDown(pad.buttons[13]);
  return {
    ArrowLeft: left,
    ArrowRight: right,
    ArrowUp: up,
    ArrowDown: down,
    z: buttonDown(pad.buttons[0]),       // Xbox A / PS Cross
    x: buttonDown(pad.buttons[1]),       // Xbox B / PS Circle
    a: buttonDown(pad.buttons[2]),       // Xbox X / PS Square
    s: buttonDown(pad.buttons[3]),       // Xbox Y / PS Triangle
    q: buttonDown(pad.buttons[4]),       // L1
    e: buttonDown(pad.buttons[5]),       // R1
    Shift: buttonDown(pad.buttons[8]),   // Select / Share / View
    Enter: buttonDown(pad.buttons[9])    // Start / Options / Menu
  };
}

function getP2GamepadKeyMap(pad) {
  const left = axisDown(pad.axes[0], -1) || buttonDown(pad.buttons[14]);
  const right = axisDown(pad.axes[0], 1) || buttonDown(pad.buttons[15]);
  const up = axisDown(pad.axes[1], -1) || buttonDown(pad.buttons[12]);
  const down = axisDown(pad.axes[1], 1) || buttonDown(pad.buttons[13]);
  return {
    a: left,
    d: right,
    w: up,
    s: down,
    f: buttonDown(pad.buttons[0]),
    g: buttonDown(pad.buttons[1]),
    r: buttonDown(pad.buttons[4]),
    t: buttonDown(pad.buttons[5]),
    c: buttonDown(pad.buttons[8]),
    v: buttonDown(pad.buttons[9])
  };
}

function getP3GamepadKeyMap(pad) {
  const left = axisDown(pad.axes[0], -1) || buttonDown(pad.buttons[14]);
  const right = axisDown(pad.axes[0], 1) || buttonDown(pad.buttons[15]);
  const up = axisDown(pad.axes[1], -1) || buttonDown(pad.buttons[12]);
  const down = axisDown(pad.axes[1], 1) || buttonDown(pad.buttons[13]);
  return {
    j: left,
    l: right,
    i: up,
    k: down,
    u: buttonDown(pad.buttons[0]),
    o: buttonDown(pad.buttons[1]),
    y: buttonDown(pad.buttons[4]),
    p: buttonDown(pad.buttons[5]),
    h: buttonDown(pad.buttons[8]),
    n: buttonDown(pad.buttons[9])
  };
}

function getP4GamepadKeyMap(pad) {
  const left = axisDown(pad.axes[0], -1) || buttonDown(pad.buttons[14]);
  const right = axisDown(pad.axes[0], 1) || buttonDown(pad.buttons[15]);
  const up = axisDown(pad.axes[1], -1) || buttonDown(pad.buttons[12]);
  const down = axisDown(pad.axes[1], 1) || buttonDown(pad.buttons[13]);
  return {
    '4': left,
    '6': right,
    '8': up,
    '5': down,
    '1': buttonDown(pad.buttons[0]),
    '2': buttonDown(pad.buttons[1]),
    '7': buttonDown(pad.buttons[4]),
    '9': buttonDown(pad.buttons[5]),
    '0': buttonDown(pad.buttons[8]),
    '3': buttonDown(pad.buttons[9])
  };
}

function axisDown(value, direction) {
  const threshold = 0.45;
  return direction < 0 ? value < -threshold : value > threshold;
}

function buttonDown(button) {
  return Boolean(button && (button.pressed || button.value > 0.45));
}

function dispatchSyntheticKey(key, type) {
  const code = key.length === 1 ? `Key${key.toUpperCase()}` : key;
  const keyCodeMap = {
    ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40,
    Enter: 13, Shift: 16,
    z: 90, x: 88, a: 65, s: 83, q: 81, e: 69,
    w: 87, d: 68, f: 70, g: 71, r: 82, t: 84, c: 67, v: 86,
    i: 73, j: 74, k: 75, l: 76, u: 85, o: 79, y: 89, p: 80, h: 72, n: 78, m: 77, b: 66,
    ',': 188, Insert: 45, Home: 36, End: 35, PageDown: 34,
    '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
  };
  const keyCode = keyCodeMap[key] || (key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0);
  const eventInit = { key, code, bubbles: true, cancelable: true, composed: true };
  const targets = [window, document, els.game, els.emulatorFrame, els.game.querySelector('canvas, iframe, div'), document.activeElement].filter(Boolean);

  for (const target of targets) {
    const event = new KeyboardEvent(type, eventInit);
    try {
      Object.defineProperty(event, 'keyCode', { get: () => keyCode });
      Object.defineProperty(event, 'which', { get: () => keyCode });
    } catch (_) {}
    target.dispatchEvent?.(event);
  }
}

function bindEvents() {
  els.backButton.addEventListener('click', backToSelector);
  els.dropzone.addEventListener('click', () => els.romInput.click());
  els.dropzone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      els.romInput.click();
    }
  });
  els.romInput.addEventListener('change', (event) => handleRomFiles(event.target.files).catch((error) => {
    console.error(error);
    showToast('ROM laden mislukt.', 'error');
  }).finally(() => {
    event.target.value = '';
  }));

  els.ps1FilePick?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!activeSystem || activeSystem.id !== 'ps1') return;
    els.romInput.multiple = true;
    els.romInput.accept = '.cue,.bin,.chd,.pbp,.zip';
    els.romInput.click();
  });

  els.ps1FolderPick?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!activeSystem || activeSystem.id !== 'ps1') return;
    els.folderInput.click();
  });

  els.folderInput?.addEventListener('change', (event) => {
    const files = Array.from(event.target.files || []).filter((file) => /\.(cue|bin|chd|pbp|zip)$/i.test(file.name));
    handleRomFiles(files).catch((error) => {
      console.error(error);
      showToast('PS1 map laden mislukt.', 'error');
    }).finally(() => {
      event.target.value = '';
    });
  });

  ['dragenter', 'dragover'].forEach((type) => {
    els.dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      els.dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach((type) => {
    els.dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      els.dropzone.classList.remove('dragover');
    });
  });
  els.dropzone.addEventListener('drop', (event) => handleRomFiles(event.dataTransfer.files).catch((error) => {
    console.error(error);
    showToast('ROM laden mislukt.', 'error');
  }));

  els.startButton.addEventListener('click', startGame);
  els.scanControllers.addEventListener('click', scanControllers);
  els.romMeta.addEventListener('click', (event) => {
    const button = event.target.closest('[data-psp-mode]');
    if (!button) return;
    event.preventDefault();
    switchPspMode(button.dataset.pspMode);
  });
  els.speedRange.addEventListener('input', () => setSpeed(els.speedRange.value));
  els.applySpeed.addEventListener('click', () => {
    setSpeed(els.speedRange.value);
    showToast(`Speed toegepast: ${els.speedRange.value}x`, 'ok');
  });
  els.resetSpeed.addEventListener('click', () => {
    setSpeed(1);
    showToast('Speed teruggezet naar 1x.', 'ok');
  });

  els.saveNow.addEventListener('click', () => saveBrowserNow().catch((error) => {
    console.error(error);
    showToast('Save opslaan mislukt.', 'error');
  }));
  els.loadSave.addEventListener('click', () => loadBrowserSave().catch((error) => {
    console.error(error);
    showToast('Save laden mislukt.', 'error');
  }));
  els.exportSave.addEventListener('click', () => exportSaveFile().catch((error) => {
    console.error(error);
    showToast('Save exporteren mislukt.', 'error');
  }));
  els.saveImport.addEventListener('change', (event) => importSaveFile(event.target.files[0]).catch((error) => {
    console.error(error);
    showToast('Save importeren mislukt.', 'error');
  }));

  els.restartGame.addEventListener('click', startGame);
  els.resetGame.addEventListener('click', () => {
    window.EJS_emulator?.restart?.();
    window.EJS_emulator?.gameManager?.restart?.();
    showToast('Reset aangevraagd.', 'info');
  });
  els.fullscreenGame.addEventListener('click', () => {
    const target = els.emulatorFrame;
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    if (fullscreenElement) {
      const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      exitFullscreen?.call(document);
      window.setTimeout(() => hideMobileEmulatorQuickbar(), 200);
      return;
    }
    const requestFullscreen = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
    if (requestFullscreen) requestFullscreen.call(target);
    else {
      showToast('Fullscreen wordt niet ondersteund door deze mobiele browser. Ik zet het scherm wel groot in beeld.', 'info');
      scrollGameIntoViewOnMobile();
    }
    window.setTimeout(() => hideMobileEmulatorQuickbar(), 200);
  });

  window.addEventListener('resize', () => {
    if (document.body.classList.contains('emulator-running')) {
      hideMobileEmulatorQuickbar();
    }
  });
  window.addEventListener('gamepadconnected', scanControllers);
  window.addEventListener('gamepaddisconnected', scanControllers);
}

renderConsoleCards();
bindEvents();
renderControllerStatus();
setEmulatorActive(false);
setSpeed(1);
ensurePs1ServiceWorkerReady().catch(() => { /* Alleen nodig voor PS1 multi-track; melding volgt bij laden. */ });
// Conditional gamepad bridge keeps SNES/GB/GBA controllers working. N64 now uses native 4-pad input plus fallback keyboard events for browsers/cores that do not auto-bind pads. PS1/PSP/GameCube remain native to avoid hotkey conflicts.
startGamepadKeyboardBridge();
