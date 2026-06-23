window.BITZ_PLACES = window.BITZ_PLACES || {};
window.BITZ_PLACES["america"] = {
  id: "america",
  name: "Amerika / USA",
  country: "Verenigde Staten",
  type: "high opportunity / high risk",
  icon: "🇺🇸",
  tags: ["usa", "fame", "business", "wwe", "ufc", "boxing", "hollywood", "college sports", "money"],
  costMultiplier: 1.45,
  rentMultiplier: 1.75,
  jobMultiplier: 1.25,
  customerMultiplier: 1.35,
  crimeRisk: 12,
  fameBonus: 25,
  stressModifier: 12,
  travelCost: 3600,
  permanentMoveCost: 7500,
  healthcareRisk: 18,
  sports: {
    football: { scoutBonus: 6, athleticBonus: 12, pressure: 14, route: "college / MLS / Europe transfer" },
    wrestling: { wweBonus: 25, promoBonus: 18, entertainmentBonus: 20 },
    mma: { ufcBonus: 25, wrestlingBaseBonus: 12, mediaBonus: 12 },
    glory: { kickboxingBonus: 4, boxingBonus: 10 }
  },
  business: {
    bestTypes: ["fight_gym", "content_channel", "tech_startup", "merch_brand", "nightclub", "real_estate"],
    rentPressure: 1.55,
    customerBonus: 1.35,
    onlineBonus: 1.30,
    risk: 22
  },
  jobs: ["retail", "marketing", "developer_junior", "data_analyst", "project_manager", "realestate"],
  districts: ["New York", "Los Angeles", "Miami", "Las Vegas", "Texas", "Chicago"],
  events: [
    "try-out bij een WWE performance center",
    "UFC gym sparring in Las Vegas",
    "college sports scout op tribune",
    "Hollywood casting of influencer collab",
    "grote business pitch met investeerders",
    "dure medische rekening na blessure",
    "road trip langs meerdere staten"
  ],
  notes: "Amerika is duur en hard, maar logisch voor WWE, UFC, fame, business, content, sponsors en grote carrièrekansen."
};
