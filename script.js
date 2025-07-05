// --- DOM Elementen ---
const avatarSelectionScreen = document.getElementById('avatar-selection');
const avatarChoicesContainer = document.getElementById('avatar-choices');
const mainGameScreen = document.getElementById('main-game-screen');
const annualReportScreen = document.getElementById('annual-report');
const reportYearSpan = document.getElementById('report-year');
const reportTextDiv = document.getElementById('report-text');
const reportStatsChangesList = document.getElementById('report-stats-changes');
const continueGameButton = document.getElementById('continue-game-button');

const taxationPanel = document.getElementById('taxation-panel');
const taxPercentageSlider = document.getElementById('tax-percentage');
const taxValueSpan = document.getElementById('tax-value');
const taxImpactPreview = document.getElementById('tax-impact-preview');
const confirmTaxButton = document.getElementById('confirm-tax-button');
const cancelTaxButton = document.getElementById('cancel-tax-button');

const requestsPanel = document.getElementById('requests-panel'); // Nieuw
const requestsIntroText = document.getElementById('requests-intro-text'); // Nieuw
const requestListDiv = document.getElementById('request-list'); // Nieuw
const noRequestsMessage = document.getElementById('no-requests-message'); // Nieuw
const requestsBackButton = document.getElementById('requests-back-button'); // Nieuw

const mayorAvatarImg = document.getElementById('mayor-avatar');
const currentYearSpan = document.getElementById('current-year');
const moneySpan = document.getElementById('money');
const reputationSpan = document.getElementById('reputation');
const faithSpan = document.getElementById('faith');
const populationSpan = document.getElementById('population');
const tradeFleetSpan = document.getElementById('trade-fleet');

const mainTextDisplay = document.getElementById('main-text-display');
const choicesContainer = document.getElementById('choices-container');
const goToMapButton = document.getElementById('go-to-map-button');
const mapMenu = document.getElementById('map-menu');
const gameContainer = document.getElementById('game-container');


// --- Game State Variabelen ---
let gameState = {
    year: 1550,
    money: 500,
    reputation: 60,
    faith: 50,
    population: 10000,
    tradeFleet: 0, // Aantal handelsschepen
    militaryStrength: 10, // Nieuw: Militair kracht (voor verdediging/sabotage)

    currentLocation: null,
    npcsMet: [],
    currentEvent: null,
    mayorAvatar: null,
    previousYearStats: {}, // Voor het jaarverslag
    pendingRequests: [], // Array om openstaande verzoeken in op te slaan
    currentJudgmentCase: null // Houdt de actieve rechtszaak bij
};

const STAT_MIN = 0;
const STAT_MAX = 100;
const INITIAL_POPULATION = 10000;


// --- Game Data (Locaties, NPC's, Plannen, Verzoeken, etc.) ---

const locations = {
    'Stadhuis': {
        name: 'Het Stadhuis',
        image: 'image/stadhuis.png',
        description: "Vanuit het Stadhuis regeert u over Enkhuizen. Hier worden de belangrijke jaarplannen besproken en goedgekeurd.",
        npcs: ['Gerrit de Secretaris', 'De Rechter'], // Nieuw: De Rechter
        actions: [
            { id: 'view_annual_plans', text: 'Bekijk de jaarplannen', type: 'annual_event' },
            { id: 'review_requests', text: 'Behandel openstaande verzoeken', type: 'show_requests_action' }, // Type aangepast
            { id: 'judge_citizen', text: 'Iemand berechten', type: 'judgement_event_trigger' }
        ]
    },
    'Dromedaris': {
        name: 'De Dromedaris',
        image: 'image/dromedaris.png',
        description: "De Dromedaris, een indrukwekkende verdedigingstoren en het hart van de haven. De geur van zout en vis hangt in de lucht. Havenmeester Jan is hier vaak te vinden.",
        npcs: ['Jan de Havenmeester'],
        actions: [
            { id: 'inspect_tower', text: 'Inspecteer de verdedigingstoren', consequence: { reputation: 5, militaryStrength: 2 }, flavorText: "De Dromedaris staat er solide bij. Uw aanwezigheid stelt de bewakers gerust. De stad voelt zich veiliger.", condition: 'money >= 10' },
            { id: 'sabotage_cannons', text: 'Saboteer de kanonnen (zeer risicovol!)', consequence: { money: 100, reputation: -20, faith: -10, militaryStrength: -10 }, flavorText: "U weet een paar kanonnen onklaar te maken, waarna u het kruit verhandelt. Hopelijk merkt niemand het." }
        ]
    },
    'Kerk': {
        name: 'De Westerkerk',
        image: 'image/kerk.png',
        description: "De imposante Westerkerk, het centrum van het religieuze leven in Enkhuizen. Pastoor Henk predikt hier regelmatig.",
        npcs: ['Pastoor Henk'],
        actions: [
            { id: 'attend_sermon', text: 'Woon de preek bij', consequence: { faith: 10, reputation: 5 }, flavorText: "De preek van Pastoor Henk was inspirerend. Uw vrome aanwezigheid wordt gewaardeerd." },
            { id: 'donate_to_church', text: 'Doneer aan de kerk (-25 Geld, +15 Geloof)', consequence: { money: -25, faith: 15 }, flavorText: "U heeft een gulle donatie gedaan aan de kerk. De Pastoor is zeer tevreden en het geloof in de stad wordt versterkt.", condition: 'money >= 25' }
        ]
    },
    'Visafslag': {
        name: 'De Visafslag',
        image: 'image/visafslag.png',
        description: "De drukke visafslag, waar de vangst van de dag wordt verhandeld. Hier hoort u de laatste roddels en de mening van het gewone volk.",
        npcs: ['Klaas de Visser'],
        actions: [
            { id: 'talk_to_fishermen', text: 'Praat met de vissers over hun zorgen', consequence: { money: -5, reputation: 5 }, flavorText: "U heeft geluisterd naar de vissers. Ze voelen zich gehoord, hoewel u geen directe oplossing bood." },
            { id: 'impose_tax_fish', text: 'Hef een speciale visserijbelasting (-10 Reputatie, +30 Geld)', consequence: { money: 30, reputation: -10 }, flavorText: "De nieuwe belasting op visvangst brengt geld in het laatje, maar de vissers morren luidruchtig." }
        ]
    },
    'Havenkade': {
        name: 'De Havenkade',
        image: 'image/havenkade.png',
        description: "Langs de bruisende havenkade meren schepen aan vanuit alle windstreken. Hier ziet u de welvaart van Enkhuizen, maar ook de ruwe randjes van het zeemansleven.",
        npcs: [],
        actions: [
            { id: 'inspect_trade', text: 'Inspecteer de handel en toelevering', consequence: { money: 10, reputation: 5 }, flavorText: "U heeft de handelsactiviteit geïnspecteerd. Er is winst te behalen, maar ook onregelmatigheden." },
            { id: 'buy_trade_ship', text: 'Koop een handelsschip (-200 Geld, +1 Handelsvloot)', consequence: { money: -200, tradeFleet: 1 }, flavorText: "U heeft een nieuw handelsschip aangeschaft! De vloot van Enkhuizen groeit.", condition: 'money >= 200' },
            { id: 'deal_with_smugglers', text: 'Spreek met smokkelaars over illegale handel', consequence: { money: 150, faith: -20, reputation: -10 }, flavorText: "U heeft een schimmige deal gesloten met smokkelaars. De schatkist is gevuld, maar de moraal van de stad heeft een deuk opgelopen." }
        ]
    },
    'Marktplein': {
        name: 'Het Marktplein',
        image: 'image/marktplein.png',
        description: "Het kloppende hart van de stad. Hier komen kooplieden samen en vindt u het gewone volk. Er gaan veel geruchten rond hier.",
        npcs: ['Hendrik de Koopman'],
        actions: [
            { id: 'walk_around', text: 'Loop een ronde en luister', consequence: { reputation: 3, money: -2 }, flavorText: "U heeft een oor te luisteren gelegd bij het volk. Enige kritiek, maar ook veel waardering voor uw aanwezigheid." },
            { id: 'organize_festival', text: 'Organiseer een klein festival (-75 Geld, +15 Reputatie, +10 Geloof)', consequence: { money: -75, reputation: 15, faith: 10 }, flavorText: "Een spontaan georganiseerd festival brengt vreugde en verbondenheid, maar kost flink wat gulden. De sfeer in de stad is echter aanzienlijk verbeterd!", condition: 'money >= 75' }
        ]
    },
    'Urk': {
        name: 'Urk',
        image: 'image/urk.png',
        description: "U bent aangekomen op het eiland Urk. Een gemeenschap van ruwe vissers en vrome gelovigen, geïsoleerd van het vasteland.",
        npcs: ['Ouderling Harmen'],
        actions: [
            { id: 'talk_to_elder', text: 'Spreek met Ouderling Harmen', type: 'npc_dialogue', npcName: 'Ouderling Harmen', dialogueNode: 'intro' },
            { id: 'offer_alliance', text: 'Bied een handelsalliantie aan (-50 Geld, +5 Handelsvloot potentieel)', consequence: { money: -50 }, flavorText: "U heeft een handelsalliantie voorgesteld aan Urk. Ze zullen het overwegen, wat op termijn de handel kan bevorderen.", condition: 'money >= 50' },
            { id: 'return_to_enkhuizen', text: 'Keer terug naar Enkhuizen', type: 'location_change', targetLocation: 'Stadhuis', flavorText: "U keert terug naar Enkhuizen na uw bezoek aan Urk." }
        ],
        travelCondition: 'tradeFleet >= 1',
        arrivalMessage: "U bent na een voorspoedige reis aangekomen op het eiland Urk."
    }
};

const npcs = {
    'Gerrit de Secretaris': {
        dialogue: {
            'intro': {
                text: "Gerrit: Goedendag, burgemeester. Welkom in het Stadhuis. Waarmee kan ik u van dienst zijn?",
                options: [
                    { text: "Hoe staat de stad ervoor?", next: 'ask_status' },
                    { text: "Laten we de jaarplannen bekijken.", action: 'view_annual_plans_action' },
                    { text: "Ik wil belasting innen.", action: 'show_taxation_panel_action' },
                    { text: "Ik wil openstaande verzoeken behandelen.", action: 'show_requests_action' } // Nieuwe actie
                ]
            },
            'ask_status': {
                text: `Gerrit: De stad telt ongeveer ${gameState.population} zielen. Uw reputatie staat op ${gameState.reputation}%, het geloof op ${gameState.faith}% en de schatkist bevat ${gameState.money} gulden. Onze handelsvloot bestaat uit ${gameState.tradeFleet} schepen en de militaire kracht is ${gameState.militaryStrength}. We hebben uw leiding nodig.`,
                options: [{ text: "Dank u, Gerrit.", next: 'intro' }]
            }
        }
    },
    'De Rechter': { // Nieuwe NPC
        dialogue: {
            'intro': {
                text: "De Rechter: Burgemeester, ik wacht op uw oordeel. Er zijn zaken die de aandacht van het hof behoeven. Wilt u een zaak behandelen?",
                options: [
                    { text: "Ja, presenteer de volgende zaak.", action: 'judgement_event_trigger_action' },
                    { text: "Nee, niet nu.", next: 'no_cases' }
                ]
            },
            'no_cases': {
                text: "De Rechter: Dan zal ik wachten op uw terugkomst, burgemeester.",
                options: [] // Geen verdere opties, eindigt gesprek
            }
        }
    },
    'Jan de Havenmeester': { /* ... bestaande dialoog ... */ },
    'Pastoor Henk': { /* ... bestaande dialoog ... */ },
    'Klaas de Visser': { /* ... bestaande dialoog ... */ },
    'Hendrik de Koopman': { /* ... bestaande dialoog ... */ },
    'Ouderling Harmen': { /* ... bestaande dialoog ... */ }
};

const annualPlans = [
    {
        year: 1550,
        eventText: "Het eerste jaar als burgemeester. De stadsraad stelt voor om te investeren in de bouw van nieuwe vestingmuren rondom de stad. Dit zal de verdediging verbeteren, maar is zeer kostbaar en kan onrust veroorzaken onder het volk. Hoe besluit u?",
        choices: [
            { id: 'approve_walls', text: "Keur het plan goed (-150 Geld, +15 Reputatie, -5 Geloof, +50 Inwoners, +10 Militaire Kracht)", consequences: { money: -150, reputation: 15, faith: -5, population: 50, militaryStrength: 10 }, flavorText: "De bouw van de muren is gestart. De veiligheid van Enkhuizen is gewaarborgd, maar de schatkist is geplunderd." },
            { id: 'reject_walls', text: "Wijs het plan af (+50 Geld, -10 Reputatie, risico op invallen, -20 Inwoners, -5 Militaire Kracht)", consequences: { money: 50, reputation: -10, population: -20, militaryStrength: -5 }, flavorText: "U heeft de plannen voor nieuwe muren afgewezen. Het geld blijft in kas, maar de bevolking voelt zich onveilig." },
            { id: 'sabotage_walls', text: "Saboteer de muurbouw en neem een deel van de fondsen (+200 Geld, -30 Reputatie, -15 Geloof, -50 Inwoners, -20 Militaire Kracht)", consequences: { money: 200, reputation: -30, faith: -15, population: -50, militaryStrength: -20 }, flavorText: "U weet een deel van de fondsen voor de muurbouw naar uw eigen zakken te sluizen. De muren zijn zwakker, maar uw portemonnee dikker." }
        ]
    },
    {
        year: 1551,
        eventText: "Er is een tekort aan graan in de stad. De handelaren stellen voor graan te importeren, maar dit zal de prijzen doen stijgen. De armen zullen lijden. Wat is uw beslissing?",
        choices: [
            { id: 'approve_import', text: "Keur import goed (-80 Geld, +5 Reputatie, -10 Geloof, +30 Inwoners)", consequences: { money: -80, reputation: 5, faith: -10, population: 30 }, flavorText: "Graan is geïmporteerd. De honger is gestild, maar de prijzen zijn hoog en de bevolking morrt over de kosten." },
            { id: 'reject_import', text: "Wijs import af (+0 Geld, -15 Reputatie, +5 Geloof, -100 Inwoners)", consequences: { reputation: -15, faith: 5, population: -100 }, flavorText: "U heeft de import van graan geweigerd. De schatkist blijft intact, maar hongersnood dreigt en de bevolking is ontevreden. De kerk prijst uw spaarzaamheid." },
            { id: 'corrupt_import', text: "Koop zelf graan in en verkoop met woekerwinst (+300 Geld, -40 Reputatie, -20 Geloof, -150 Inwoners)", consequences: { money: 300, reputation: -40, faith: -20, population: -150 }, flavorText: "U profiteert schaamteloos van de nood van het volk. Een fortuin is verdiend, maar de bevolking haat u en het geloof in u is verdwenen." }
        ]
    },
    {
        year: 1552,
        eventText: "Een nieuwe geloofsrichting wint aan populariteit in Enkhuizen, de 'Watergeuzen'. Ze zijn kritisch op de gevestigde kerk. De Pastoor vraagt u om in te grijpen. Wat doet u?",
        choices: [
            { id: 'support_church', text: "Ondersteun de gevestigde kerk, onderdruk de Watergeuzen (-50 Geld, +15 Geloof, -10 Reputatie, -20 Inwoners)", consequences: { money: -50, faith: 15, reputation: -10, population: -20 }, flavorText: "U heeft de Watergeuzen hardhandig aangepakt. De gevestigde kerk is tevreden, maar uw reputatie bij de bevolking daalt." },
            { id: 'allow_freedom', text: "Sta de Watergeuzen toe, pleit voor tolerantie (+0 Geld, -10 Geloof, +15 Reputatie, +30 Inwoners)", consequences: { faith: -10, reputation: 15, population: 30 }, flavorText: "U heeft tolerantie gepredikt. De Watergeuzen zijn u dankbaar, maar de Pastoor en zijn volgelingen zijn ontevreden." },
            { id: 'exploit_division', text: "Stook het vuur op en profiteer van de tweedracht (+100 Geld, -25 Reputatie, -25 Geloof, -50 Inwoners)", consequences: { money: 100, reputation: -25, faith: -25, population: -50 }, flavorText: "U heeft de tweedracht tussen de geloofsrichtingen uitgebuit. Geld is verdiend, maar de stad is verdeeld en onrustig." }
        ]
    }
    // Voeg hier meer jaarplannen toe voor volgende jaren
];

const judgmentCases = [
    {
        id: 'theft_case_1',
        title: "Diefstal van een brood",
        text: "Een burger, Willem, is betrapt op diefstal van een brood. Hij beweert dat zijn familie honger lijdt. De bakker eist gerechtigheid. Wat is uw oordeel?",
        choices: [
            { id: 'guilty_punish', text: "Schuldig, zware straf (bv. galg) (+10 Geloof, -10 Reputatie, +20 Geld)", consequences: { faith: 10, reputation: -10, money: 20 }, flavorText: "Willem is zwaar gestraft. De orde is hersteld, maar de bevolking is geschokt door uw hardheid." },
            { id: 'guilty_light', text: "Schuldig, lichte straf (bv. geldboete) (+5 Geld, +5 Reputatie)", consequences: { money: 5, reputation: 5 }, flavorText: "Willem is beboet. De bakker is niet helemaal tevreden, maar de bevolking waardeert uw mildheid." },
            { id: 'not_guilty', text: "Onschuldig, spreek vrij (-10 Geloof, +15 Reputatie)", consequences: { faith: -10, reputation: 15 }, flavorText: "U heeft Willem vrijgesproken. De bakker is woedend, maar het volk juicht uw mededogen toe." }
        ]
    },
    {
        id: 'dispute_case_1',
        title: "Geschil over scheepslading",
        text: "Twee kooplieden, Piet en Dirk, hebben een bitter geschil over een scheepslading vis. Beiden eisen compensatie. Hoe lost u dit op?",
        choices: [
            { id: 'favor_piet', text: "Geef Piet gelijk (-5 Reputatie voor Dirk, +5 Geld voor Piet)", consequences: { money: 5, reputation: -5 }, flavorText: "U heeft Piet in het gelijk gesteld. Dirk is ziedend en dreigt de stad te verlaten." },
            { id: 'favor_dirk', text: "Geef Dirk gelijk (-5 Reputatie voor Piet, +5 Geld voor Dirk)", consequences: { money: 5, reputation: -5 }, flavorText: "U heeft Dirk in het gelijk gesteld. Piet is verbitterd en belooft wraak." },
            { id: 'compromise', text: "Zoek een compromis (-10 Geld, +10 Reputatie)", consequences: { money: -10, reputation: 10 }, flavorText: "U heeft een compromis afgedwongen. Beide kooplieden zijn niet geheel tevreden, maar de vrede is bewaard." }
        ]
    }
    // Voeg hier meer rechtszaken toe
];

const requestsData = [ // Nieuwe dataset voor verzoeken
    {
        id: 'request_bridge_repair',
        title: "Verzoek: Reparatie Oude Brug",
        description: "De gildemeester van de bouwers vraagt om fondsen voor de reparatie van de oude brug over de gracht. Deze is in slechte staat en vormt een gevaar.",
        consequences_approve: { money: -70, population: 20, reputation: 10 },
        flavorText_approve: "De reparatie van de oude brug is goedgekeurd. De bouwers zijn druk bezig en de burgers zijn dankbaar voor de veiligheid.",
        consequences_reject: { reputation: -10, population: -5 },
        flavorText_reject: "U heeft het verzoek voor de brugreparatie afgewezen. De brug blijft gevaarlijk en de bevolking is ontevreden."
    },
    {
        id: 'request_school_founding',
        title: "Verzoek: Stichting Nieuwe School",
        description: "De plaatselijke onderwijzeres vraagt om steun voor de stichting van een nieuwe school. Meer kinderen kunnen dan onderwijs genieten, wat de toekomst van de stad ten goede komt.",
        consequences_approve: { money: -50, population: 10, faith: 5 },
        flavorText_approve: "De stichting van een nieuwe school is goedgekeurd. De kinderen zullen nu beter onderwijs krijgen, en de toekomst van Enkhuizen ziet er rooskleurig uit.",
        consequences_reject: { faith: -5, reputation: -5 },
        flavorText_reject: "U heeft het verzoek voor een nieuwe school afgewezen. Dit stuit op onbegrip bij ouders en de kerk."
    },
    {
        id: 'request_city_guard_increase',
        title: "Verzoek: Versterking Stadswacht",
        description: "De commandant van de stadswacht verzoekt om extra manschappen en middelen om de criminaliteit te bestrijden. Dit zal de veiligheid verhogen.",
        consequences_approve: { money: -80, reputation: 15, militaryStrength: 5 },
        flavorText_approve: "De stadswacht is versterkt. De criminaliteit zal dalen en de burgers voelen zich veiliger.",
        consequences_reject: { reputation: -10, militaryStrength: -2 },
        flavorText_reject: "U heeft het verzoek om de stadswacht te versterken afgewezen. De commandant is teleurgesteld en de criminaliteit blijft een zorg."
    }
    // Voeg hier meer soorten verzoeken toe
];


// --- Functies voor UI Updates ---

function updateUI() {
    currentYearSpan.textContent = gameState.year;
    moneySpan.textContent = gameState.money;
    reputationSpan.textContent = gameState.reputation;
    faithSpan.textContent = gameState.faith;
    populationSpan.textContent = gameState.population;
    tradeFleetSpan.textContent = gameState.tradeFleet;
    // militaryStrengthSpan.textContent = gameState.militaryStrength; // Als je deze wilt tonen

    // Zorg dat stats binnen de grenzen blijven (behalve geld)
    gameState.reputation = Math.max(STAT_MIN, Math.min(STAT_MAX, gameState.reputation));
    gameState.faith = Math.max(STAT_MIN, Math.min(STAT_MAX, gameState.faith));
    gameState.militaryStrength = Math.max(0, gameState.militaryStrength); // Militaire kracht kan niet onder 0
    gameState.population = Math.max(1000, gameState.population); // Minimum populatie

    // Game Over Condities
    if (gameState.money < -300) {
        endGame("U bent failliet! De Staten van Holland hebben u afgezet als burgemeester en uw bezittingen geconfisqueerd.");
        return;
    }
    if (gameState.reputation < 5) {
        endGame("Het volk heeft zich tegen u gekeerd! Een woedende menigte heeft u uit de stad verdreven.");
        return;
    }
    if (gameState.faith < 0) {
        endGame("De kerk heeft u geëxcommuniceerd en uw invloed is tot nul gedaald. Enkhuizen heeft een nieuwe leider nodig.");
        return;
    }
    if (gameState.population < INITIAL_POPULATION / 2) {
        endGame("De bevolking is gehalveerd door uw wanbeleid! Enkhuizen is niet langer leefbaar.");
        return;
    }
    // Voeg hier eventueel een game over conditie toe voor lage militaire kracht, bijv. inval.
}

function displayMessage(text) {
    mainTextDisplay.textContent = text;
}

function displayChoices(choices) {
    choicesContainer.innerHTML = '';

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.classList.add('choice-button');
        button.textContent = choice.text;

        if (choice.id !== undefined) button.dataset.id = choice.id;
        if (choice.type !== undefined) button.dataset.type = choice.type;
        if (choice.npcName !== undefined) button.dataset.npcName = choice.npcName;
        if (choice.dialogueNode !== undefined) button.dataset.dialogueNode = choice.dialogueNode;
        if (choice.targetLocation !== undefined) button.dataset.targetLocation = choice.targetLocation;
        if (choice.caseId !== undefined) button.dataset.caseId = choice.caseId;
        if (choice.action !== undefined) button.dataset.action = choice.action;

        if (choice.consequences) {
            button.dataset.consequences = JSON.stringify(choice.consequences);
        }
        if (choice.flavorText !== undefined && choice.flavorText !== null) {
            button.dataset.flavorText = choice.flavorText;
        }
        if (choice.condition !== undefined && choice.condition !== null) {
            button.dataset.condition = choice.condition;
        }

        // Condities voor knoppen: disable en/of voeg info toe
        const isTravelButton = (choice.type === 'location_change' && choice.targetLocation);
        const conditionToCheck = isTravelButton ? (locations[choice.targetLocation] && locations[choice.targetLocation].travelCondition) : choice.condition;

        if (conditionToCheck && !evalCondition(conditionToCheck)) {
            let conditionText = getConditionText(conditionToCheck);
            if (isTravelButton) {
                 button.textContent += ` (Vereist: ${conditionText})`;
            } else {
                 button.textContent += ` (Niet voldaan: ${conditionText})`;
            }
            button.disabled = true;
            button.style.opacity = '0.7';
            button.style.cursor = 'not-allowed'; // Duidelijkere cursor
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }

        choicesContainer.appendChild(button);
    });
}

function evalCondition(conditionString) {
    let evaluatedCondition = conditionString
        .replace(/money/g, `gameState.money`)
        .replace(/reputation/g, `gameState.reputation`)
        .replace(/faith/g, `gameState.faith`)
        .replace(/population/g, `gameState.population`)
        .replace(/tradeFleet/g, `gameState.tradeFleet`)
        .replace(/militaryStrength/g, `gameState.militaryStrength`);
    try {
        return eval(evaluatedCondition);
    } catch (e) {
        console.error("Fout bij evalueren conditie:", e, "Conditie:", conditionString);
        return false;
    }
}

function getConditionText(conditionString) {
    let readableCondition = conditionString
        .replace(/money >= (\d+)/g, "$1 Gulden")
        .replace(/reputation >= (\d+)/g, "$1% Reputatie")
        .replace(/faith >= (\d+)/g, "$1% Geloof")
        .replace(/population >= (\d+)/g, "$1 Inwoners")
        .replace(/tradeFleet >= (\d+)/g, "$1 Schepen")
        .replace(/militaryStrength >= (\d+)/g, "$1 Militaire Kracht");
    return readableCondition;
}

function changeBackground(imageUrl) {
    document.body.style.backgroundImage = `url('${imageUrl}')`;
}

function showScreen(screenId) {
    avatarSelectionScreen.classList.add('hidden');
    mainGameScreen.classList.add('hidden');
    annualReportScreen.classList.add('hidden');
    mapMenu.classList.add('hidden');
    taxationPanel.classList.add('hidden');
    requestsPanel.classList.add('hidden'); // Nieuw

    document.getElementById(screenId).classList.remove('hidden');

    if (screenId === 'main-game-screen') {
        goToMapButton.classList.remove('hidden');
    } else {
        goToMapButton.classList.add('hidden');
    }
}

function showMapMenu() {
    showScreen('map-menu');
    displayMessage("Kies een locatie om te bezoeken in Enkhuizen.");
    choicesContainer.innerHTML = '';
}

function showTaxationPanel() {
    showScreen('taxation-panel');
    taxPercentageSlider.value = 10;
    updateTaxImpactPreview();

    taxPercentageSlider.oninput = updateTaxImpactPreview;
}

function updateTaxImpactPreview() {
    const percentage = parseInt(taxPercentageSlider.value);
    taxValueSpan.textContent = `${percentage}%`;

    const moneyGained = Math.round(gameState.population * (percentage / 100) * 0.5);
    const reputationLost = Math.round(percentage * 0.8);
    const faithLost = Math.round(percentage * 0.4);

    taxImpactPreview.textContent = `Verwachte impact: +${moneyGained} Gulden, -${reputationLost} Reputatie, -${faithLost} Geloof.`;
}

function processTaxCollection() {
    const percentage = parseInt(taxPercentageSlider.value);
    const moneyGained = Math.round(gameState.population * (percentage / 100) * 0.5);
    const reputationLost = Math.round(percentage * 0.8);
    const faithLost = Math.round(percentage * 0.4);

    gameState.money += moneyGained;
    gameState.reputation -= reputationLost;
    gameState.faith -= faithLost;

    updateUI();
    displayMessage(`U heeft ${percentage}% belasting geheven. Er is ${moneyGained} Gulden geïnd. Uw reputatie is gedaald met ${reputationLost} en geloof met ${faithLost}.`);

    setTimeout(() => {
        handleYearlyEvents(); // Ga verder met jaarlijkse gebeurtenissen (jaarplannen)
    }, 1500);
}

// --- Verzoeken Behandelen Functies (Nieuw) ---

function showRequestsPanel() {
    showScreen('requests-panel');
    requestsIntroText.textContent = "Hier ziet u de verzoeken van de burgers en gilden van Enkhuizen. Behandel ze wijs.";
    displayRequests();
}

function displayRequests() {
    requestListDiv.innerHTML = ''; // Maak lijst leeg

    if (gameState.pendingRequests.length === 0) {
        noRequestsMessage.classList.remove('hidden');
        requestListDiv.appendChild(noRequestsMessage);
    } else {
        noRequestsMessage.classList.add('hidden');
        gameState.pendingRequests.forEach(request => {
            const requestItem = document.createElement('div');
            requestItem.classList.add('request-item');
            requestItem.dataset.requestId = request.id; // Belangrijk voor afhandeling

            requestItem.innerHTML = `
                <h4>${request.title}</h4>
                <p>${request.description}</p>
                <div class="request-actions">
                    <button class="request-action-button approve" data-action="approve">Goedkeuren</button>
                    <button class="request-action-button reject" data-action="reject">Afkeuren</button>
                </div>
            `;
            requestListDiv.appendChild(requestItem);
        });
    }
}

function addRandomRequest() {
    // Voeg alleen een verzoek toe als er ruimte is of niet te veel zijn
    if (gameState.pendingRequests.length < 3) { // Max 3 verzoeken tegelijk
        const availableRequests = requestsData.filter(req =>
            !gameState.pendingRequests.some(pr => pr.id === req.id) // Voorkom dubbele verzoeken
        );
        if (availableRequests.length > 0) {
            const newRequest = availableRequests[Math.floor(Math.random() * availableRequests.length)];
            gameState.pendingRequests.push({ ...newRequest }); // Voeg een kopie toe
            console.log("Nieuw verzoek toegevoegd:", newRequest.title);
        }
    }
}

function processRequest(requestId, action) {
    const requestIndex = gameState.pendingRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;

    const request = gameState.pendingRequests[requestIndex];
    let consequences = {};
    let flavorText = "";

    if (action === 'approve') {
        consequences = request.consequences_approve;
        flavorText = request.flavorText_approve;
    } else { // action === 'reject'
        consequences = request.consequences_reject;
        flavorText = request.flavorText_reject;
    }

    // Pas consequenties toe
    for (const stat in consequences) {
        if (gameState.hasOwnProperty(stat)) {
            gameState[stat] += consequences[stat];
        }
    }

    updateUI();
    displayMessage(flavorText); // Toon de specifieke flavor text

    // Verwijder het afgehandelde verzoek
    gameState.pendingRequests.splice(requestIndex, 1);

    // Na verwerking, toon verzoeken opnieuw na een korte pauze of ga terug naar Stadhuis
    setTimeout(() => {
        if (gameState.pendingRequests.length > 0) {
            displayRequests(); // Toon de overgebleven verzoeken
        } else {
            goToLocation('Stadhuis'); // Als er geen verzoeken meer zijn, terug naar Stadhuis
        }
    }, 1500);
}


// --- Game Flow Functies ---

function goToLocation(locationId) {
    // Conditie check voor reizen (wordt al gedaan in displayChoices, maar voor directe acties)
    const targetLoc = locations[locationId];
    if (targetLoc && targetLoc.travelCondition && !evalCondition(targetLoc.travelCondition)) {
        displayMessage(`U kunt deze actie nu niet uitvoeren. Niet aan de voorwaarden voldaan.`);
        setTimeout(() => goToLocation(gameState.currentLocation), 1000); // Blijf op huidige locatie
        return;
    }

    showScreen('main-game-screen');
    gameState.currentLocation = locationId;
    const location = locations[locationId];

    if (!location) {
        console.error("Locatie niet gevonden:", locationId);
        return;
    }

    changeBackground(location.image);
    displayMessage(location.arrivalMessage || location.description);

    const currentChoices = [];

    // NPC dialoog opties
    location.npcs.forEach(npcName => {
        const npc = npcs[npcName];
        if (npc && npc.dialogue && npc.dialogue.intro) {
            currentChoices.push({
                id: `talk_to_npc_${npcName.replace(/\s/g, '_')}`,
                text: `Praat met ${npcName}`,
                type: 'npc_dialogue',
                npcName: npcName,
                dialogueNode: 'intro'
            });
        }
    });

    // Locatie specifieke acties
    location.actions.forEach(action => {
        currentChoices.push({
            id: action.id,
            text: action.text,
            type: action.type || 'location_action',
            consequences: action.consequences,
            flavorText: action.flavorText,
            condition: action.condition
        });
    });

    displayChoices(currentChoices);
}


function startNewYear() {
    gameState.year++;
    let annualReportAddendum = "";

    // Jaarlijkse passieve effecten:
    // Handel:
    if (gameState.tradeFleet > 0) {
        const tradeIncome = gameState.tradeFleet * (Math.floor(Math.random() * 20) + 10); // 10-30 gulden per schip
        gameState.money += tradeIncome;
        annualReportAddendum += `\n\nDoor uw handelsvloot is er dit jaar ${tradeIncome} Gulden extra aan handelsinkomsten!`;
    }
    // Bevolkingsgroei:
    const baseGrowth = Math.round(gameState.reputation / 10 + gameState.faith / 20 - 5);
    const tradeFleetBonus = gameState.tradeFleet * 5; // Schepen trekken mensen aan
    const totalPopulationChange = baseGrowth + tradeFleetBonus;
    gameState.population += totalPopulationChange;
    annualReportAddendum += `\n\nDe bevolking is dit jaar met ${totalPopulationChange} gegroeid/gedaald naar ${gameState.population} inwoners.`;

    // Militaire sterkte onderhoud:
    gameState.militaryStrength -= 1; // Kleine jaarlijkse afname
    annualReportAddendum += `\n\nDe militaire kracht heeft een kleine afname gekend door onderhoud: ${gameState.militaryStrength}.`;


    // Random evenementen die verzoeken kunnen genereren
    if (Math.random() < 0.3) { // 30% kans op een nieuw verzoek
        addRandomRequest();
        if (gameState.pendingRequests.length > 0) {
            annualReportAddendum += `\n\nEr is een nieuw verzoek ingediend door de burgers of gilden! Behandel deze snel.`;
        }
    }


    gameState.annualReportAddendum = annualReportAddendum;
    updateUI(); // Update alle stats na passieve effecten
    gameState.previousYearStats = { ...gameState };

    showAnnualReport();
}


function handleYearlyEvents() {
    // Dit is de plek waar je de jaarplannen presenteert, NADAT de belasting is afgehandeld.
    const planForThisYear = annualPlans.find(plan => plan.year === gameState.year);

    if (planForThisYear) {
        gameState.currentEvent = planForThisYear;
        changeBackground(locations['Stadhuis'].image);
        displayMessage(planForThisYear.eventText);
        displayChoices(planForThisYear.choices.map(choice => ({
            id: choice.id,
            text: choice.text,
            type: 'annual_plan',
            consequences: choice.consequences,
            flavorText: choice.flavorText
        })));
        goToMapButton.classList.add('hidden'); // Verberg "Ga naar Kaart" tijdens jaarplan
    } else {
        // Geen specifiek plan voor dit jaar, speler kan locaties bezoeken
        displayMessage(`Het jaar ${gameState.year} is aangebroken. Er zijn geen urgente jaarplannen voor dit jaar. Wat wilt u doen?`);
        goToLocation('Stadhuis'); // Stuur speler terug naar een default locatie
    }
}


function showAnnualReport() {
    showScreen('annual-report');
    reportYearSpan.textContent = gameState.year - 1;

    let reportMessage = "Het afgelopen jaar is voorbij gevlogen. Hier is een overzicht van uw prestaties:";
    let goodThings = [];
    let badThings = [];
    const statsChanges = [];

    const statsToCompare = ['money', 'reputation', 'faith', 'population', 'tradeFleet', 'militaryStrength'];
    statsToCompare.forEach(stat => {
        if (gameState.previousYearStats.hasOwnProperty(stat)) {
            const oldValue = gameState.previousYearStats[stat];
            const newValue = gameState[stat];
            const change = newValue - oldValue;
            let changeText = '';
            let className = 'stat-neutral';

            if (change > 0) {
                changeText = `(+${change})`;
                className = 'stat-positive';
            } else if (change < 0) {
                changeText = `(${change})`;
                className = 'stat-negative';
            }

            statsChanges.push(`<li class="${className}">${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${oldValue} -> ${newValue} ${changeText}</li>`);
        }
    });
    reportStatsChangesList.innerHTML = statsChanges.join('');


    if (gameState.money > 600) goodThings.push("De schatkist is goed gevuld.");
    else if (gameState.money < 300) badThings.push("De schatkist is zorgwekkend leeg.");

    if (gameState.reputation > 75) goodThings.push("Uw reputatie onder het volk is uitstekend.");
    else if (gameState.reputation < 40) badThings.push("Uw reputatie heeft een flinke deuk opgelopen.");

    if (gameState.faith > 65) goodThings.push("Het geloof in de stad is sterk.");
    else if (gameState.faith < 35) badThings.push("Het geloof in de stad is tanende.");

    if (gameState.population > INITIAL_POPULATION + 200) goodThings.push("De bevolking groeit gestaag!");
    else if (gameState.population < INITIAL_POPULATION - 200) badThings.push("De bevolking krimpt zorgwekkend.");

    if (gameState.tradeFleet > 2) goodThings.push("Uw handelsvloot is indrukwekkend!");
    if (gameState.militaryStrength > 15) goodThings.push("Uw militaire kracht is robuust!");
    else if (gameState.militaryStrength < 5) badThings.push("Uw militaire kracht is zorgwekkend laag.");


    if (goodThings.length > 0) {
        reportMessage += "\n\nPositieve ontwikkelingen:\n- " + goodThings.join("\n- ");
    }
    if (badThings.length > 0) {
        reportMessage += "\n\nZorgwekkende ontwikkelingen:\n- " + badThings.join("\n- ");
    }

    if (goodThings.length === 0 && badThings.length === 0) {
        reportMessage += "\n\nHet was een rustig jaar zonder grote schommelingen. U heeft de status quo behouden.";
    }

    if (gameState.annualReportAddendum) {
        reportMessage += gameState.annualReportAddendum;
        gameState.annualReportAddendum = "";
    }

    reportTextDiv.textContent = reportMessage;
}


function endGame(message) {
    showScreen('main-game-screen');
    mainTextDisplay.textContent = `GAME OVER! ${message}`;
    choicesContainer.innerHTML = '';
    goToMapButton.classList.add('hidden');
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#800000';
    const restartButton = document.createElement('button');
    restartButton.classList.add('choice-button');
    restartButton.textContent = "Opnieuw beginnen";
    restartButton.addEventListener('click', () => location.reload());
    choicesContainer.appendChild(restartButton);
    choicesContainer.classList.remove('hidden');
}


// --- Initialisatie Functie (na avatar keuze) ---
function initializeGame() {
    updateUI();
    goToLocation('Stadhuis');

    gameState.previousYearStats = { ...gameState };

    // Optioneel: Speel achtergrondmuziek
    // const backgroundMusic = new Audio('music/enkhuizen_tune.mp3');
    // backgroundMusic.loop = true;
    // backgroundMusic.volume = 0.4;
    // document.body.addEventListener('click', () => {
    //     backgroundMusic.play().catch(e => console.error("Muziek kon niet starten:", e));
    // }, { once: true });
}

// --- Event Handling ---

avatarChoicesContainer.addEventListener('click', (event) => {
    const chosenAvatarDiv = event.target.closest('.avatar-option');
    if (chosenAvatarDiv) {
        gameState.mayorAvatar = `image/${chosenAvatarDiv.dataset.avatar}`;
        mayorAvatarImg.src = gameState.mayorAvatar;
        mayorAvatarImg.classList.remove('hidden');
        showScreen('main-game-screen');
        initializeGame();
    }
});

continueGameButton.addEventListener('click', () => {
    showTaxationPanel(); // Na jaarverslag -> belasting innen
});

confirmTaxButton.addEventListener('click', processTaxCollection);
cancelTaxButton.addEventListener('click', () => {
    displayMessage("U heeft besloten geen belasting te innen dit jaar. De stad zal het merken.");
    setTimeout(() => {
        handleYearlyEvents(); // Ga verder met jaarlijkse gebeurtenissen, ook als belasting geannuleerd is
    }, 1000);
});

// Event listener voor het verzoekscherm (gebruikt event delegation)
requestListDiv.addEventListener('click', (event) => {
    const actionButton = event.target.closest('.request-action-button');
    if (!actionButton) return;

    const requestItem = actionButton.closest('.request-item');
    const requestId = requestItem.dataset.requestId;
    const action = actionButton.dataset.action; // 'approve' of 'reject'

    processRequest(requestId, action);
});

requestsBackButton.addEventListener('click', () => {
    goToLocation('Stadhuis'); // Terug naar het Stadhuis vanuit verzoekenscherm
});


// Hoofd event listener voor alle keuze-knoppen
choicesContainer.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('.choice-button');
    if (!clickedButton || clickedButton.disabled) return;

    const choiceType = clickedButton.dataset.type;
    const choiceId = clickedButton.dataset.id;
    const consequencesString = clickedButton.dataset.consequences;
    const flavorText = clickedButton.dataset.flavorText;
    const actionData = clickedButton.dataset.action;

    let chosenOption = null;
    let applyConsequences = false;

    // Speciale acties die direct een functie aanroepen
    if (actionData === 'start_game') {
        startNewYear();
        return;
    } else if (actionData === 'show_taxation_panel_action') {
        showTaxationPanel();
        return;
    } else if (actionData === 'show_requests_action') { // Afhandeling van "Behandel verzoeken"
        showRequestsPanel();
        return;
    } else if (actionData === 'judgement_event_trigger_action') { // Afhandeling van "Iemand berechten"
        const randomCase = judgmentCases[Math.floor(Math.random() * judgmentCases.length)];
        if (randomCase) {
            gameState.currentJudgmentCase = randomCase; // Sla de huidige zaak op
            displayMessage(randomCase.text);
            displayChoices(randomCase.choices.map(choice => ({
                ...choice,
                type: 'judgement_event',
                caseId: randomCase.id
            })));
        } else {
            displayMessage("Er zijn momenteel geen zaken om te berechten.");
            setTimeout(() => goToLocation('Stadhuis'), 1000);
        }
        return;
    }

    // Algemene afhandeling van keuzes op basis van type
    if (choiceType === 'annual_plan' && gameState.currentEvent) {
        chosenOption = gameState.currentEvent.choices.find(c => c.id === choiceId);
        applyConsequences = true;
    } else if (choiceType === 'location_action') {
        chosenOption = locations[gameState.currentLocation].actions.find(a => a.id === choiceId);
        applyConsequences = true;
    } else if (choiceType === 'judgement_event') {
        // Een keuze binnen een actieve rechtszaak
        if (gameState.currentJudgmentCase) {
             chosenOption = gameState.currentJudgmentCase.choices.find(c => c.id === choiceId);
             applyConsequences = true;
             gameState.currentJudgmentCase = null; // Rechtszaak is afgehandeld
        } else {
            console.error("Geen actieve rechtszaak gevonden voor judgement_event:", choiceId);
            displayMessage("Er is een fout opgetreden bij het afhandelen van de rechtszaak.");
            setTimeout(() => goToLocation(gameState.currentLocation), 1500);
            return;
        }
    }
    // NPC Dialoog afhandeling
    else if (choiceType === 'npc_dialogue') {
        const npcName = clickedButton.dataset.npcName;
        const dialogueNodeId = clickedButton.dataset.dialogueNode;
        const npc = npcs[npcName];
        const currentDialogue = npc.dialogue[dialogueNodeId];

        const selectedDialogueOption = currentDialogue.options ?
            currentDialogue.options.find(opt => opt.text === clickedButton.textContent) : null;

        if (selectedDialogueOption) {
            // Pas directe consequenties van dialoogoptie toe
            if (selectedDialogueOption.consequence) {
                for (const stat in selectedDialogueOption.consequence) {
                    if (gameState.hasOwnProperty(stat)) {
                        gameState[stat] += selectedDialogueOption.consequence[stat];
                    }
                }
                updateUI();
            }

            // Ga naar de volgende dialoognode, of trigger een actie
            if (selectedDialogueOption.next) {
                const nextDialogueNode = npc.dialogue[selectedDialogueOption.next];
                if (nextDialogueNode) {
                    displayMessage(nextDialogueNode.text);
                    const newChoices = [];
                    if (nextDialogueNode.options) {
                        nextDialogueNode.options.forEach(opt => {
                            newChoices.push({
                                id: `dialogue_option_${opt.next || 'end'}`,
                                text: opt.text,
                                type: 'npc_dialogue',
                                npcName: npcName,
                                dialogueNode: selectedDialogueOption.next
                            });
                        });
                    }
                    newChoices.push({ id: `exit_dialogue_${npcName.replace(/\s/g, '_')}`, text: `Bedank ${npcName} en vertrek`, type: 'exit_npc_dialogue' });
                    displayChoices(newChoices);
                    return;
                }
            } else if (selectedDialogueOption.action) {
                // Als een dialoogoptie een specifieke actie triggert
                if (selectedDialogueOption.action === 'view_annual_plans_action') {
                    handleYearlyEvents(); // Roep de functie aan die jaarplannen presenteert
                    return;
                } else if (selectedDialogueOption.action === 'show_taxation_panel_action') {
                    showTaxationPanel();
                    return;
                } else if (selectedDialogueOption.action === 'show_requests_action') {
                    showRequestsPanel();
                    return;
                } else if (selectedDialogueOption.action === 'judgement_event_trigger_action') {
                    // Start een rechtszaak vanuit dialoog
                    const randomCase = judgmentCases[Math.floor(Math.random() * judgmentCases.length)];
                    if (randomCase) {
                        gameState.currentJudgmentCase = randomCase;
                        displayMessage(randomCase.text);
                        displayChoices(randomCase.choices.map(choice => ({
                            ...choice,
                            type: 'judgement_event',
                            caseId: randomCase.id
                        })));
                    } else {
                        displayMessage("Er zijn momenteel geen zaken om te berechten.");
                        setTimeout(() => goToLocation('Stadhuis'), 1000);
                    }
                    return;
                }
            }
        }
        // Als dialoog is afgelopen of 'exit_dialogue' is gekozen
        goToLocation(gameState.currentLocation);
        return;
    } else if (choiceType === 'exit_npc_dialogue') {
        goToLocation(gameState.currentLocation);
        return;
    } else if (choiceType === 'location_change') {
        goToLocation(clickedButton.dataset.targetLocation);
        return;
    }


    // Algemene afhandeling van keuzes (consequenties toepassen)
    if (applyConsequences && chosenOption) {
        try {
            const consString = clickedButton.dataset.consequences;
            if (!consString) {
                console.error("Geen 'data-consequences' gevonden voor deze knop:", clickedButton);
                displayMessage("Er is een interne fout opgetreden bij het verwerken van uw keuze (geen consequenties gevonden).");
                setTimeout(() => goToLocation(gameState.currentLocation), 1500);
                return;
            }

            const consequences = JSON.parse(consString);
            for (const stat in consequences) {
                if (gameState.hasOwnProperty(stat)) {
                    gameState[stat] += consequences[stat];
                }
            }

            displayMessage(flavorText || "U heeft een beslissing genomen.");
            updateUI();

            if (choiceType === 'annual_plan') {
                setTimeout(() => {
                    startNewYear(); // Begin een nieuw jaar na een jaarplan
                }, 1500);
            } else if (choiceType === 'judgement_event') {
                setTimeout(() => {
                    goToLocation('Stadhuis'); // Terug naar Stadhuis na rechtszaak
                }, 1500);
            } else {
                setTimeout(() => {
                    goToLocation(gameState.currentLocation); // Blijf op locatie na actie
                }, 500);
            }
        } catch (e) {
            console.error("Fout bij parsen of toepassen van consequenties JSON:", e, "String:", consequencesString);
            displayMessage("Er is een interne fout opgetreden bij het verwerken van uw keuze.");
            setTimeout(() => goToLocation(gameState.currentLocation), 1500);
        }
    }
});


// Event listener voor de "Ga naar de Kaart" knop
goToMapButton.addEventListener('click', showMapMenu);

// Event listener voor de knoppen in het kaartmenu (gebruikt event delegation)
mapMenu.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('.map-button');
    if (clickedButton && !clickedButton.disabled) {
        const locationId = clickedButton.dataset.location;
        goToLocation(locationId);
    }
});


// --- Initialisatie van het spel bij laden van de pagina ---
document.addEventListener('DOMContentLoaded', () => {
    showScreen('avatar-selection');
});