window.BITZ_SYSTEMS = window.BITZ_SYSTEMS || {};
window.BITZ_SYSTEMS.money = {
  rule: "Alle geldstromen lopen via één systeem: salaris + business + assets - huur - hypotheek - auto - schulden - events.",
  yearlyOrder: ["income", "housing", "transport", "debt", "business", "sportsContracts", "randomEvents"],
  assetRules: {
    carSellValue: "purchasePrice * condition * marketMultiplier",
    rentOutVehicle: "monthlyRent - maintenance - damageRisk",
    propertyRent: "rentIncome - mortgage - upkeep - vacancyRisk"
  }
};
