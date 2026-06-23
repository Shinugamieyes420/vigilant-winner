window.BITZ_PLACES = window.BITZ_PLACES || {};
window.BITZ_PLACES["japan"] = {
  id: "japan",
  name: "Japan / Tokyo",
  country: "Japan",
  type: "grote wereldstad",
  icon: "🗾",
  tags: ["tokyo", "tech", "anime", "arcade", "discipline", "voetbal", "pro-wrestling", "mma"],
  costMultiplier: 1.25,
  rentMultiplier: 1.35,
  jobMultiplier: 1.15,
  customerMultiplier: 1.2,
  crimeRisk: 4,
  fameBonus: 10,
  stressModifier: 7,
  travelCost: 4200,
  permanentMoveCost: 6800,
  sports: {
    football: { scoutBonus: 8, techniqueBonus: 10, pressure: 8 },
    wrestling: { schoolBonus: 12, promoBonus: 5, style: "strong style / puroresu" },
    mma: { disciplineBonus: 8, karateJudoBonus: 10 },
    glory: { kickboxingBonus: 6 }
  },
  business: {
    bestTypes: ["content_channel", "gaming_shop", "tech_startup", "fight_gym", "street_food"],
    rentPressure: 1.25,
    customerBonus: 1.20,
    onlineBonus: 1.25,
    risk: 10
  },
  jobs: ["barista", "retail", "ict_helpdesk", "developer_junior", "data_analyst", "marketing"],
  districts: ["Shibuya", "Shinjuku", "Akihabara", "Ueno", "Roppongi", "Osaka trip"],
  events: [
    "drukke metro in Tokyo",
    "ramenbar na middernacht",
    "arcade rival in Akihabara",
    "tempelbezoek voor rust",
    "karaoke night met lokale vrienden",
    "puroresu show in een kleine zaal",
    "J-League scout kijkt langs de lijn"
  ],
  notes: "Japan is duurder en drukker dan Enkhuizen/Alkmaar, maar sterk voor discipline, tech, voetbaltechniek, anime/content en pro-wrestling stijl."
};
