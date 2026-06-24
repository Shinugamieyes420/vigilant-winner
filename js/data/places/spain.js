window.BITZ_PLACES = window.BITZ_PLACES || {};
const BITZ_SPAIN_PLACE = {
  id:"spain",
  name:"Spanje",
  country:"Spanje",
  type:"volwaardige DLC-locatie",
  icon:"🇪🇸",
  tags:["zon","voetbal","tapas","strand","taal","flamenco","toerisme","La Liga"],
  costMultiplier:1.12,
  rentMultiplier:1.18,
  jobMultiplier:.98,
  crimeRisk:8,
  travelCost:1300,
  permanentMoveCost:2600,
  business:{bestTypes:["horeca","toerisme","beach bar","content/media","sportclinic"],customerMultiplier:1.12},
  sports:{football:1.18,combat:1.05,media:1.08},
  events:["tapasavond","stranddag","La Liga sfeer","Spaanse taalles","siësta-moment","drukke boulevard","flamenco nacht","Barcelona contentdag"],
  jobs:["hospitality","retail","tourism","sports","media"],
  districts:["Barcelona","Madrid","Valencia","Sevilla","Malaga"]
};
window.BITZ_PLACES.spain = BITZ_SPAIN_PLACE;
// Backward compatibility: old Alkmaar saves/routes now become Spain.
window.BITZ_PLACES.alkmaar = Object.assign({}, BITZ_SPAIN_PLACE, {id:"alkmaar", aliasOf:"spain", name:"Spanje"});
