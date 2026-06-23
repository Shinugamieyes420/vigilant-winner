window.BITZ_SPORTS = window.BITZ_SPORTS || {};
window.BITZ_SPORTS.football = {
  positions: {
    GK: { name: "Keeper", keyStats: ["reflexen", "discipline", "passing"], score: ["discipline", "stamina", "smarts"] },
    CB: { name: "Verdediger", keyStats: ["defending", "physical", "discipline"], score: ["fitness", "stamina", "discipline"] },
    CM: { name: "Middenvelder", keyStats: ["passing", "vision", "stamina"], score: ["smarts", "stamina", "discipline"] },
    WING: { name: "Vleugelspeler", keyStats: ["pace", "dribbling", "stamina"], score: ["fitness", "looks", "stamina"] },
    ST: { name: "Spits", keyStats: ["shooting", "positioning", "composure"], score: ["fitness", "looks", "sport"] }
  },
  levels: [
    "straatvoetbal", "schoolteam", "amateur jeugd", "top amateur jeugd", "jeugdopleiding",
    "beloften", "semi-pro", "profcontract", "basisplaats", "topclub", "international", "legende"
  ],
  careerFlow: [
    "6-11: straatvoetbal en schoolvoetbal",
    "12-15: amateurclub en scouts",
    "16-18: jeugdopleiding / contractkans",
    "18-23: doorbraak, huurperiode, profcontract",
    "24-29: prime, transfers, nationale selectie",
    "30-35: captain, ervaring, fysieke daling",
    "36+: afbouwen, trainer, scout of eigen voetbalschool"
  ],
  matchChoices: {
    ST: ["Eigen schot", "Breed leggen", "Druk zetten", "Counter afwachten"],
    CM: ["Risicopass", "Tempo controleren", "Mee naar voren", "Hard duel"],
    CB: ["Agressief tackelen", "Veilig verdedigen", "Mee bij corner", "Provoceren"],
    GK: ["Lijn houden", "Uitkomen", "Lange bal", "Rustig opbouwen"],
    WING: ["Man passeren", "Voorzet", "Naar binnen schieten", "Terugverdedigen"]
  },
  transferLogic: ["marktwaarde", "leeftijd", "vorm", "clubniveau", "fame", "potentie", "salaris", "speeltijd"]
};
