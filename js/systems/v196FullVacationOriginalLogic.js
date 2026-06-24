
/* v19.6 Full Vacation Original Logic
   Makes non-nightlife vacation activities work like original BitLife-style mini flows:
   choose approach -> success/fail/risk/contact/item/lead -> effects.
*/
(function(){
  const ACT196 = {
  "spain": {
    "tapas": {
      "title": "Tapas avond",
      "icon": "🥘",
      "type": "food",
      "choices": [
        [
          "🥖",
          "Goedkoop lokaal eten",
          "Echte local vibe, weinig kosten",
          35,
          {
            "Happiness": 6,
            "Health": 1,
            "Social": 2
          },
          "food",
          60,
          "contact"
        ],
        [
          "🍽️",
          "Luxe tapas bestellen",
          "Duurder, meer looks/social",
          140,
          {
            "Happiness": 9,
            "Looks": 2,
            "Social": 4,
            "Stamina": -2
          },
          "food",
          35,
          "fame"
        ],
        [
          "👥",
          "Locals aanspreken",
          "Kans op contact of tips",
          60,
          {
            "Happiness": 5,
            "Smarts": 1,
            "Social": 7
          },
          "contact",
          75,
          "contact"
        ],
        [
          "🎁",
          "Iemand trakteren",
          "Kost geld, kans op sterke klik",
          95,
          {
            "Happiness": 7,
            "Social": 9,
            "Looks": 1
          },
          "contact",
          80,
          "contact"
        ]
      ]
    },
    "beach": {
      "title": "Costa del Sol stranddag",
      "icon": "🏖️",
      "type": "beach",
      "choices": [
        [
          "😴",
          "Relaxen en herstellen",
          "Veilige health/stamina boost",
          20,
          {
            "Happiness": 6,
            "Health": 3,
            "Stamina": 9
          },
          "beach",
          95,
          "relax"
        ],
        [
          "🏊",
          "Zwemmen",
          "Health/fun, klein risico",
          35,
          {
            "Happiness": 7,
            "Health": 2,
            "Stamina": -3
          },
          "beach",
          80,
          "risk"
        ],
        [
          "⚽",
          "Beach football",
          "Fitness en voetbalform",
          0,
          {
            "Fitness": 4,
            "Happiness": 6,
            "Stamina": -6
          },
          "sport",
          75,
          "football"
        ],
        [
          "💬",
          "Beach flirt/social",
          "Mensen ontmoeten aan het strand",
          45,
          {
            "Happiness": 6,
            "Looks": 1,
            "Social": 8,
            "Stamina": -2
          },
          "contact",
          70,
          "contact"
        ]
      ]
    },
    "football": {
      "title": "La Liga voetbalbeleving",
      "icon": "⚽",
      "type": "sport",
      "choices": [
        [
          "🎟️",
          "Wedstrijd kijken",
          "Stadionvibe en happiness",
          110,
          {
            "Happiness": 9,
            "Smarts": 1,
            "Social": 3,
            "Stamina": -3
          },
          "sport",
          90,
          "football"
        ],
        [
          "🥅",
          "Pickup match spelen",
          "Form/fitness omhoog",
          25,
          {
            "Fitness": 4,
            "Happiness": 6,
            "Stamina": -7
          },
          "sport",
          75,
          "football"
        ],
        [
          "🕵️",
          "Coach/scout aanspreken",
          "Kans op voetbalcontact",
          50,
          {
            "Smarts": 2,
            "Social": 5,
            "Happiness": 3
          },
          "contact",
          55,
          "football"
        ],
        [
          "👕",
          "Fan shirt kopen",
          "Item/souvenir kans",
          95,
          {
            "Happiness": 4,
            "Looks": 1
          },
          "shop",
          95,
          "item:spain_jersey"
        ]
      ]
    },
    "culture": {
      "title": "Barcelona sightseeing",
      "icon": "⛪",
      "type": "culture",
      "choices": [
        [
          "🚶",
          "Zelf rondlopen",
          "Goedkoop, cultuur en smarts",
          40,
          {
            "Smarts": 3,
            "Happiness": 4,
            "Stamina": -3
          },
          "culture",
          90,
          "memory"
        ],
        [
          "📸",
          "Content maken",
          "Looks/social/fame kans",
          80,
          {
            "Happiness": 5,
            "Looks": 2,
            "Fame": 1,
            "Stamina": -4
          },
          "fame",
          65,
          "fame"
        ],
        [
          "🧑‍🏫",
          "Local guide nemen",
          "Meer kennis en contact",
          120,
          {
            "Smarts": 5,
            "Social": 4,
            "Happiness": 5,
            "Stamina": -2
          },
          "culture",
          85,
          "contact"
        ],
        [
          "🎨",
          "Straatartiest steunen",
          "Klein item/contact kans",
          55,
          {
            "Happiness": 4,
            "Social": 2
          },
          "shop",
          70,
          "item:art_print"
        ]
      ]
    },
    "language": {
      "title": "Spaanse taalles",
      "icon": "📚",
      "type": "training",
      "choices": [
        [
          "📱",
          "Taal-app oefenen",
          "Goedkoop, kleine smarts boost",
          15,
          {
            "Smarts": 2,
            "Stamina": -1
          },
          "training",
          95,
          "skill:spanish"
        ],
        [
          "🏫",
          "Groepsles volgen",
          "Skill + social",
          90,
          {
            "Smarts": 4,
            "Social": 4,
            "Stamina": -2
          },
          "training",
          85,
          "skill:spanish"
        ],
        [
          "☕",
          "Oefenen met locals",
          "Kans op contact",
          45,
          {
            "Smarts": 3,
            "Social": 6,
            "Happiness": 3
          },
          "contact",
          70,
          "contact"
        ],
        [
          "📝",
          "Intensieve les",
          "Sterke skill, meer stamina-kost",
          180,
          {
            "Smarts": 7,
            "Stamina": -6
          },
          "training",
          80,
          "skill:spanish"
        ]
      ]
    },
    "gym": {
      "title": "Spaanse boxing/fight gym",
      "icon": "🥊",
      "type": "training",
      "choices": [
        [
          "🥊",
          "Techniektraining",
          "Veilig, combat skill",
          90,
          {
            "Fitness": 3,
            "Stamina": -4
          },
          "training",
          90,
          "skill:combat"
        ],
        [
          "🔥",
          "Hard sparren",
          "Veel progress, blessurerisico",
          140,
          {
            "Fitness": 5,
            "Health": -2,
            "Stamina": -10
          },
          "risk",
          60,
          "skill:combat"
        ],
        [
          "🧊",
          "Hersteltraining",
          "Blessurerisico omlaag",
          70,
          {
            "Health": 3,
            "Stamina": 5,
            "Happiness": 2
          },
          "training",
          95,
          "recovery"
        ],
        [
          "👨‍🏫",
          "Privéles coach",
          "Duur, sterke combat boost",
          260,
          {
            "Fitness": 4,
            "Smarts": 2,
            "Stamina": -5
          },
          "training",
          85,
          "skill:combat"
        ]
      ]
    },
    "tourism": {
      "title": "Tourism network",
      "icon": "🏨",
      "type": "business",
      "choices": [
        [
          "🤝",
          "Hotelmanager spreken",
          "Kans op job/business lead",
          120,
          {
            "Smarts": 2,
            "Social": 6
          },
          "business",
          65,
          "lead:tourism"
        ],
        [
          "📋",
          "CV/netwerk rondbrengen",
          "Werkroute omhoog",
          80,
          {
            "Smarts": 2,
            "Social": 4,
            "Stamina": -3
          },
          "business",
          75,
          "lead:job"
        ],
        [
          "🍽️",
          "Horeca contacten leggen",
          "Contact en business kans",
          100,
          {
            "Happiness": 2,
            "Social": 6
          },
          "business",
          70,
          "contact"
        ],
        [
          "🧭",
          "Tour guide meelopen",
          "Skill en local rep",
          60,
          {
            "Smarts": 3,
            "Social": 3,
            "Stamina": -4
          },
          "business",
          80,
          "skill:tourism"
        ]
      ]
    },
    "business": {
      "title": "Beach bar business check",
      "icon": "🍹",
      "type": "business",
      "choices": [
        [
          "🔍",
          "Cijfers controleren",
          "Minder risico, smarts",
          80,
          {
            "Smarts": 4,
            "Stamina": -2
          },
          "business",
          90,
          "lead:business"
        ],
        [
          "🤝",
          "Onderhandelen",
          "Kans op deal, ook risico",
          180,
          {
            "Smarts": 3,
            "Social": 5,
            "Stamina": -4
          },
          "business",
          55,
          "business:beachbar"
        ],
        [
          "🎉",
          "Soft launch proberen",
          "Duur, fame/reputatie kans",
          450,
          {
            "Happiness": 6,
            "Fame": 2,
            "Social": 6,
            "Stamina": -8
          },
          "business",
          50,
          "business:beachbar"
        ],
        [
          "🚪",
          "Shady deal vermijden",
          "Veilig, kleine smarts boost",
          0,
          {
            "Smarts": 2,
            "Happiness": 1
          },
          "business",
          100,
          "avoid"
        ]
      ]
    }
  },
  "america": {
    "diner": {
      "title": "American Diner",
      "icon": "🍔",
      "type": "food",
      "choices": [
        [
          "🍔",
          "Classic burger",
          "Veel happiness, health omlaag",
          35,
          {
            "Happiness": 6,
            "Health": -1
          },
          "food",
          95,
          "memory"
        ],
        [
          "🔥",
          "Eating challenge",
          "Fame-kans, health risico",
          55,
          {
            "Happiness": 7,
            "Health": -4,
            "Fame": 1
          },
          "risk",
          55,
          "fame"
        ],
        [
          "👥",
          "Met locals praten",
          "Contact/social kans",
          25,
          {
            "Happiness": 4,
            "Social": 6
          },
          "contact",
          70,
          "contact"
        ],
        [
          "☕",
          "Rustig koffie/diner",
          "Veilige social optie",
          20,
          {
            "Happiness": 3,
            "Stamina": 2
          },
          "food",
          100,
          "safe"
        ]
      ]
    },
    "road": {
      "title": "Roadtrip",
      "icon": "🛣️",
      "type": "travel",
      "choices": [
        [
          "🛣️",
          "Texas highway",
          "Classic roadtrip",
          320,
          {
            "Happiness": 9,
            "Stamina": -9
          },
          "travel",
          85,
          "memory"
        ],
        [
          "🏞️",
          "National park",
          "Health/memories",
          260,
          {
            "Happiness": 8,
            "Health": 3,
            "Stamina": -6
          },
          "travel",
          90,
          "memory"
        ],
        [
          "🏚️",
          "Goedkoop motel",
          "Goedkoop maar risico",
          120,
          {
            "Happiness": 3,
            "Smarts": 1,
            "Stamina": -4
          },
          "risk",
          55,
          "risk"
        ],
        [
          "🍔",
          "Diner stop",
          "Kans op contact",
          45,
          {
            "Happiness": 5,
            "Social": 3
          },
          "food",
          70,
          "contact"
        ]
      ]
    },
    "hollywood": {
      "title": "Hollywood / fame",
      "icon": "🎬",
      "type": "fame",
      "choices": [
        [
          "📸",
          "Content maken",
          "Social/fame kans",
          80,
          {
            "Happiness": 6,
            "Looks": 2,
            "Fame": 2
          },
          "fame",
          75,
          "fame"
        ],
        [
          "🎭",
          "Casting proberen",
          "Hoge kans op fail, grote reward",
          140,
          {
            "Smarts": 1,
            "Happiness": 4,
            "Fame": 3
          },
          "fame",
          45,
          "fame"
        ],
        [
          "🕶️",
          "Netwerken op rooftop",
          "Contact/fame kans",
          190,
          {
            "Looks": 2,
            "Social": 8,
            "Stamina": -4
          },
          "contact",
          65,
          "contact"
        ],
        [
          "🚶",
          "Touristisch rondlopen",
          "Veilig, kleine happiness",
          55,
          {
            "Happiness": 5,
            "Stamina": -2
          },
          "culture",
          95,
          "memory"
        ]
      ]
    },
    "sports": {
      "title": "Live sports night",
      "icon": "🏟️",
      "type": "sport",
      "choices": [
        [
          "🎟️",
          "Wedstrijd kijken",
          "Crowd vibe",
          140,
          {
            "Happiness": 8,
            "Social": 3,
            "Stamina": -3
          },
          "sport",
          90,
          "memory"
        ],
        [
          "📣",
          "Fanvak in",
          "Meer vibe, kans op ruzie",
          180,
          {
            "Happiness": 10,
            "Health": -1,
            "Social": 5,
            "Stamina": -5
          },
          "risk",
          70,
          "risk"
        ],
        [
          "👋",
          "Spelers/coach spotten",
          "Fame/contact kans",
          250,
          {
            "Happiness": 6,
            "Fame": 1,
            "Social": 4
          },
          "contact",
          45,
          "contact"
        ],
        [
          "🧢",
          "Merch kopen",
          "Item/souvenir",
          75,
          {
            "Happiness": 3,
            "Looks": 1
          },
          "shop",
          95,
          "item:usa_cap"
        ]
      ]
    },
    "ufc": {
      "title": "UFC Gym visit",
      "icon": "🥊",
      "type": "training",
      "choices": [
        [
          "🥊",
          "MMA techniek",
          "Combat progressie",
          160,
          {
            "Fitness": 3,
            "Stamina": -6,
            "Health": -1
          },
          "training",
          90,
          "skill:combat"
        ],
        [
          "🤼",
          "Worstelen/grappling",
          "MMA skill",
          180,
          {
            "Fitness": 4,
            "Stamina": -7
          },
          "training",
          85,
          "skill:combat"
        ],
        [
          "🔥",
          "Hard sparren",
          "Veel progress, risico",
          240,
          {
            "Fitness": 5,
            "Health": -3,
            "Stamina": -11
          },
          "risk",
          55,
          "skill:combat"
        ],
        [
          "👨‍🏫",
          "Coach spreken",
          "Gym contact",
          100,
          {
            "Smarts": 2,
            "Social": 5
          },
          "contact",
          75,
          "contact"
        ]
      ]
    },
    "wwe": {
      "title": "WWE Performance Center",
      "icon": "🤼",
      "type": "training",
      "choices": [
        [
          "🎤",
          "Promo oefenen",
          "Fame/social",
          120,
          {
            "Fame": 2,
            "Social": 5,
            "Happiness": 3
          },
          "fame",
          80,
          "skill:wrestling"
        ],
        [
          "🤼",
          "Ring drills",
          "Wrestling skill",
          220,
          {
            "Fitness": 3,
            "Stamina": -6
          },
          "training",
          85,
          "skill:wrestling"
        ],
        [
          "🧑‍🏫",
          "Trainer feedback",
          "Smarts/fame",
          160,
          {
            "Smarts": 2,
            "Fame": 1
          },
          "training",
          75,
          "skill:wrestling"
        ],
        [
          "📹",
          "Try-out clip maken",
          "Fame kans",
          300,
          {
            "Looks": 1,
            "Fame": 3,
            "Stamina": -4
          },
          "fame",
          55,
          "fame"
        ]
      ]
    },
    "pitch": {
      "title": "Startup pitch",
      "icon": "💼",
      "type": "business",
      "choices": [
        [
          "🧠",
          "Pitch aanscherpen",
          "Smarts/business",
          150,
          {
            "Smarts": 4,
            "Stamina": -2
          },
          "business",
          90,
          "lead:business"
        ],
        [
          "💸",
          "Investor pitch",
          "Kans op geld/lead",
          900,
          {
            "Smarts": 3,
            "Social": 6,
            "Stamina": -6
          },
          "business",
          45,
          "lead:investor"
        ],
        [
          "🤝",
          "Netwerkborrel",
          "Contact/social",
          250,
          {
            "Social": 8,
            "Happiness": 2
          },
          "contact",
          70,
          "contact"
        ],
        [
          "🚪",
          "Slechte deal weigeren",
          "Veilig, smarts",
          0,
          {
            "Smarts": 2
          },
          "business",
          100,
          "avoid"
        ]
      ]
    }
  },
  "japan": {
    "ramen": {
      "title": "Ramen route",
      "icon": "🍜",
      "type": "food",
      "choices": [
        [
          "🍜",
          "Classic bowl",
          "Warm herstel",
          28,
          {
            "Happiness": 6,
            "Health": 1
          },
          "food",
          95,
          "memory"
        ],
        [
          "🌶️",
          "Spicy challenge",
          "Risico/fame",
          40,
          {
            "Happiness": 7,
            "Health": -2,
            "Fame": 1
          },
          "risk",
          60,
          "fame"
        ],
        [
          "🗺️",
          "Hidden local spot",
          "Culture/contact",
          60,
          {
            "Happiness": 7,
            "Smarts": 2,
            "Social": 3
          },
          "contact",
          75,
          "contact"
        ],
        [
          "👨‍🍳",
          "Chef complimenteren",
          "Kans op local tip",
          30,
          {
            "Happiness": 4,
            "Social": 4
          },
          "contact",
          70,
          "contact"
        ]
      ]
    },
    "arcade": {
      "title": "Akihabara arcade",
      "icon": "🕹️",
      "type": "fame",
      "choices": [
        [
          "🕹️",
          "Retro cabinets",
          "Gaming vibe",
          45,
          {
            "Happiness": 6,
            "Smarts": 1
          },
          "fame",
          95,
          "memory"
        ],
        [
          "🏆",
          "Arcade tournament",
          "Skill/fame kans",
          80,
          {
            "Happiness": 8,
            "Smarts": 2,
            "Stamina": -4,
            "Fame": 1
          },
          "fame",
          60,
          "fame"
        ],
        [
          "🎁",
          "Gacha hunt",
          "Souvenir kans",
          55,
          {
            "Happiness": 5
          },
          "shop",
          80,
          "item:anime_figure"
        ],
        [
          "👥",
          "Rival aanspreken",
          "Contact/rival",
          40,
          {
            "Social": 5,
            "Happiness": 3
          },
          "contact",
          70,
          "contact"
        ]
      ]
    },
    "temple": {
      "title": "Tempel / shrine",
      "icon": "⛩️",
      "type": "culture",
      "choices": [
        [
          "🙏",
          "Rustig bidden",
          "Health/stamina",
          25,
          {
            "Happiness": 4,
            "Health": 2,
            "Stamina": 3
          },
          "culture",
          100,
          "memory"
        ],
        [
          "🎎",
          "Festival volgen",
          "Culture/social",
          70,
          {
            "Happiness": 8,
            "Smarts": 2,
            "Social": 4,
            "Stamina": -4
          },
          "culture",
          85,
          "contact"
        ],
        [
          "📸",
          "Respectvol content maken",
          "Smarts/fame kans",
          40,
          {
            "Smarts": 2,
            "Fame": 1
          },
          "fame",
          75,
          "fame"
        ],
        [
          "🧘",
          "Meditatie",
          "Stress omlaag",
          20,
          {
            "Health": 3,
            "Stamina": 5,
            "Happiness": 3
          },
          "training",
          100,
          "recovery"
        ]
      ]
    },
    "dojo": {
      "title": "Dojo training",
      "icon": "🥋",
      "type": "training",
      "choices": [
        [
          "🥋",
          "Basisvormen",
          "Discipline/combat",
          100,
          {
            "Fitness": 3,
            "Smarts": 2,
            "Stamina": -4
          },
          "training",
          90,
          "skill:combat"
        ],
        [
          "🔥",
          "Randori/sparring",
          "Risico + progress",
          180,
          {
            "Fitness": 5,
            "Health": -2,
            "Stamina": -9
          },
          "risk",
          60,
          "skill:combat"
        ],
        [
          "🧘",
          "Discipline les",
          "Smarts/stamina",
          80,
          {
            "Smarts": 3,
            "Stamina": 2
          },
          "training",
          95,
          "skill:combat"
        ],
        [
          "👨‍🏫",
          "Sensei feedback",
          "Sterke skill",
          220,
          {
            "Smarts": 3,
            "Fitness": 2,
            "Stamina": -3
          },
          "training",
          80,
          "skill:combat"
        ]
      ]
    },
    "language": {
      "title": "Japanse taalles",
      "icon": "📚",
      "type": "training",
      "choices": [
        [
          "📱",
          "Taal-app",
          "Goedkoop",
          20,
          {
            "Smarts": 2
          },
          "training",
          95,
          "skill:japanese"
        ],
        [
          "🏫",
          "Groepsles",
          "Skill/social",
          120,
          {
            "Smarts": 4,
            "Social": 3,
            "Stamina": -2
          },
          "training",
          85,
          "skill:japanese"
        ],
        [
          "☕",
          "Oefenen met locals",
          "Contact kans",
          65,
          {
            "Smarts": 3,
            "Social": 5
          },
          "contact",
          70,
          "contact"
        ],
        [
          "📝",
          "Intensieve les",
          "Sterke boost",
          220,
          {
            "Smarts": 7,
            "Stamina": -5
          },
          "training",
          80,
          "skill:japanese"
        ]
      ]
    },
    "work": {
      "title": "Werkcultuur netwerk",
      "icon": "🏢",
      "type": "business",
      "choices": [
        [
          "🤝",
          "Salaryman spreken",
          "Werkcultuur",
          120,
          {
            "Smarts": 3,
            "Social": 3
          },
          "business",
          80,
          "contact"
        ],
        [
          "📋",
          "CV vertalen",
          "Job lead",
          220,
          {
            "Smarts": 4,
            "Stamina": -2
          },
          "business",
          75,
          "lead:job"
        ],
        [
          "🍱",
          "After-work dinner",
          "Contact/social",
          180,
          {
            "Happiness": 4,
            "Social": 7,
            "Stamina": -4
          },
          "contact",
          70,
          "contact"
        ],
        [
          "🚪",
          "Overwerk vermijden",
          "Health keuze",
          0,
          {
            "Health": 2,
            "Stamina": 3
          },
          "business",
          100,
          "safe"
        ]
      ]
    }
  },
  "amsterdam": {
    "canal": {
      "title": "Grachten dag",
      "icon": "🌉",
      "type": "culture",
      "choices": [
        [
          "🚶",
          "Wandelen",
          "Rust",
          0,
          {
            "Happiness": 4,
            "Stamina": -1
          },
          "culture",
          100,
          "memory"
        ],
        [
          "⛵",
          "Rondvaart",
          "Culture",
          35,
          {
            "Happiness": 6,
            "Smarts": 1
          },
          "culture",
          95,
          "memory"
        ],
        [
          "💬",
          "Canal social",
          "Contact",
          45,
          {
            "Happiness": 6,
            "Social": 6
          },
          "contact",
          75,
          "contact"
        ],
        [
          "📸",
          "Content maken",
          "Looks/fame",
          30,
          {
            "Looks": 2,
            "Fame": 1,
            "Happiness": 3
          },
          "fame",
          75,
          "fame"
        ]
      ]
    },
    "festival": {
      "title": "Festival / event",
      "icon": "🎪",
      "type": "fame",
      "choices": [
        [
          "🎧",
          "Muziek volgen",
          "Happiness",
          120,
          {
            "Happiness": 8,
            "Stamina": -8
          },
          "fame",
          90,
          "memory"
        ],
        [
          "👥",
          "Creator meet",
          "Contact/social",
          140,
          {
            "Social": 8,
            "Fame": 1,
            "Stamina": -4
          },
          "contact",
          70,
          "contact"
        ],
        [
          "🍟",
          "Foodtruck route",
          "Food",
          55,
          {
            "Happiness": 5,
            "Health": -1
          },
          "food",
          95,
          "memory"
        ],
        [
          "🔥",
          "Te hard gaan",
          "Veel fun, risico",
          180,
          {
            "Happiness": 12,
            "Health": -3,
            "Stamina": -12
          },
          "risk",
          60,
          "risk"
        ]
      ]
    },
    "museum": {
      "title": "Museum / cultuur",
      "icon": "🖼️",
      "type": "culture",
      "choices": [
        [
          "🖼️",
          "Rustig kijken",
          "Smarts",
          65,
          {
            "Smarts": 4,
            "Happiness": 3
          },
          "culture",
          95,
          "memory"
        ],
        [
          "🎧",
          "Audio tour",
          "Meer kennis",
          85,
          {
            "Smarts": 6,
            "Stamina": -2
          },
          "culture",
          90,
          "memory"
        ],
        [
          "📸",
          "Content maken",
          "Fame/looks",
          45,
          {
            "Looks": 2,
            "Fame": 1
          },
          "fame",
          75,
          "fame"
        ],
        [
          "👥",
          "Iemand aanspreken",
          "Contact",
          40,
          {
            "Social": 5,
            "Smarts": 1
          },
          "contact",
          65,
          "contact"
        ]
      ]
    },
    "creative": {
      "title": "Creative content day",
      "icon": "📸",
      "type": "fame",
      "choices": [
        [
          "📸",
          "Fotoshoot",
          "Looks/fame",
          70,
          {
            "Looks": 3,
            "Fame": 1,
            "Happiness": 4
          },
          "fame",
          80,
          "fame"
        ],
        [
          "🎬",
          "Reel maken",
          "Social/fame",
          80,
          {
            "Social": 6,
            "Fame": 2,
            "Stamina": -3
          },
          "fame",
          65,
          "fame"
        ],
        [
          "☕",
          "Creatieve meet-up",
          "Contact",
          55,
          {
            "Social": 7,
            "Smarts": 2
          },
          "contact",
          75,
          "contact"
        ],
        [
          "💼",
          "Freelance lead zoeken",
          "Business",
          90,
          {
            "Smarts": 3,
            "Social": 4
          },
          "business",
          60,
          "lead:creative"
        ]
      ]
    },
    "media": {
      "title": "Media netwerkborrel",
      "icon": "💼",
      "type": "business",
      "choices": [
        [
          "🤝",
          "Netwerken",
          "Contact",
          90,
          {
            "Social": 7,
            "Smarts": 2
          },
          "contact",
          75,
          "contact"
        ],
        [
          "📇",
          "Business cards delen",
          "Lead",
          60,
          {
            "Social": 4,
            "Smarts": 2
          },
          "business",
          65,
          "lead:business"
        ],
        [
          "🎤",
          "Pitchen",
          "Fame/business",
          120,
          {
            "Fame": 1,
            "Social": 6,
            "Stamina": -3
          },
          "business",
          55,
          "lead:media"
        ],
        [
          "🚪",
          "Rustig observeren",
          "Smarts",
          0,
          {
            "Smarts": 2,
            "Stamina": 1
          },
          "business",
          100,
          "safe"
        ]
      ]
    }
  },
  "jamaica": {
    "beach": {
      "title": "Beach day",
      "icon": "🏖️",
      "type": "beach",
      "choices": [
        [
          "😴",
          "Relax day",
          "Herstel",
          25,
          {
            "Happiness": 7,
            "Health": 2,
            "Stamina": 8
          },
          "beach",
          100,
          "relax"
        ],
        [
          "🏊",
          "Snorkelen",
          "Health/memories",
          70,
          {
            "Happiness": 8,
            "Health": 2,
            "Stamina": -4
          },
          "beach",
          85,
          "memory"
        ],
        [
          "⚽",
          "Beach football",
          "Fitness",
          0,
          {
            "Fitness": 3,
            "Happiness": 5,
            "Stamina": -4
          },
          "sport",
          85,
          "football"
        ],
        [
          "💬",
          "Beach social",
          "Contact",
          40,
          {
            "Social": 6,
            "Happiness": 5
          },
          "contact",
          70,
          "contact"
        ]
      ]
    },
    "boat": {
      "title": "Boat trip",
      "icon": "⛵",
      "type": "travel",
      "choices": [
        [
          "⛵",
          "Rustige boottocht",
          "Memories",
          120,
          {
            "Happiness": 8,
            "Health": 1,
            "Stamina": -5
          },
          "travel",
          90,
          "memory"
        ],
        [
          "🐠",
          "Snorkel stop",
          "Health/happiness",
          160,
          {
            "Happiness": 9,
            "Health": 2,
            "Stamina": -6
          },
          "beach",
          85,
          "memory"
        ],
        [
          "🎣",
          "Vissen met locals",
          "Contact/food",
          90,
          {
            "Happiness": 5,
            "Social": 5,
            "Stamina": -3
          },
          "contact",
          75,
          "contact"
        ],
        [
          "🌧️",
          "Goedkope boot",
          "Risico",
          60,
          {
            "Happiness": 3,
            "Health": -1,
            "Stamina": -5
          },
          "risk",
          55,
          "risk"
        ]
      ]
    },
    "football": {
      "title": "Voetbal op strand",
      "icon": "⚽",
      "type": "sport",
      "choices": [
        [
          "⚽",
          "Meedoen",
          "Fitness",
          0,
          {
            "Fitness": 3,
            "Happiness": 5,
            "Stamina": -4
          },
          "sport",
          85,
          "football"
        ],
        [
          "🥅",
          "Fanatiek spelen",
          "Meer progress/risico",
          20,
          {
            "Fitness": 5,
            "Health": -1,
            "Stamina": -8
          },
          "risk",
          65,
          "football"
        ],
        [
          "👥",
          "Team vormen",
          "Contact",
          0,
          {
            "Social": 6,
            "Happiness": 4
          },
          "contact",
          75,
          "contact"
        ],
        [
          "😎",
          "Alleen kijken",
          "Veilig",
          0,
          {
            "Happiness": 2,
            "Stamina": 2
          },
          "sport",
          100,
          "safe"
        ]
      ]
    },
    "market": {
      "title": "Local market",
      "icon": "🛍️",
      "type": "shop",
      "choices": [
        [
          "🛍️",
          "Souvenir kopen",
          "Item",
          55,
          {
            "Happiness": 3
          },
          "shop",
          95,
          "item:jamaica_souvenir"
        ],
        [
          "🍍",
          "Local food",
          "Food",
          35,
          {
            "Happiness": 5,
            "Health": 1
          },
          "food",
          90,
          "memory"
        ],
        [
          "🤝",
          "Onderhandelen",
          "Smarts/contact",
          20,
          {
            "Smarts": 2,
            "Social": 3
          },
          "contact",
          70,
          "contact"
        ],
        [
          "🎸",
          "Muziekitem zoeken",
          "Item kans",
          70,
          {
            "Happiness": 4
          },
          "shop",
          80,
          "item:reggae_record"
        ]
      ]
    },
    "tourism": {
      "title": "Tour guide network",
      "icon": "🏝️",
      "type": "business",
      "choices": [
        [
          "🧭",
          "Tour guide spreken",
          "Lead",
          100,
          {
            "Smarts": 2,
            "Social": 5
          },
          "business",
          75,
          "lead:tourism"
        ],
        [
          "🏨",
          "Hotel contact",
          "Job/business",
          130,
          {
            "Social": 6,
            "Smarts": 2
          },
          "business",
          65,
          "lead:job"
        ],
        [
          "🌅",
          "Sunset tour meelopen",
          "Skill",
          60,
          {
            "Happiness": 5,
            "Social": 3,
            "Stamina": -3
          },
          "business",
          85,
          "skill:tourism"
        ],
        [
          "🚪",
          "Geen scam accepteren",
          "Veilig",
          0,
          {
            "Smarts": 2
          },
          "business",
          100,
          "safe"
        ]
      ]
    }
  },
  "nightcity": {
    "neon": {
      "title": "Neon walk",
      "icon": "🌃",
      "type": "risk",
      "choices": [
        [
          "🌃",
          "Neon walk",
          "Street vibe",
          30,
          {
            "Happiness": 4,
            "Smarts": 1,
            "Stamina": -5
          },
          "risk",
          85,
          "memory"
        ],
        [
          "🕶️",
          "Shady contact aanspreken",
          "Street cred/heat",
          70,
          {
            "Smarts": 2,
            "Social": 3,
            "Health": -1
          },
          "risk",
          55,
          "contact"
        ],
        [
          "📸",
          "Neon content",
          "Fame/look",
          50,
          {
            "Looks": 2,
            "Fame": 1,
            "Stamina": -3
          },
          "fame",
          70,
          "fame"
        ],
        [
          "🚪",
          "Veilige route",
          "Minder risico",
          10,
          {
            "Health": 1,
            "Stamina": 2
          },
          "risk",
          100,
          "safe"
        ]
      ]
    },
    "fixer": {
      "title": "Meet fixer",
      "icon": "🕶️",
      "type": "business",
      "choices": [
        [
          "🕶️",
          "Fixer spreken",
          "Lead/heat",
          120,
          {
            "Smarts": 2,
            "Social": 4,
            "Happiness": 1
          },
          "business",
          65,
          "lead:fixer"
        ],
        [
          "💾",
          "Data klus horen",
          "Business/risk",
          180,
          {
            "Smarts": 4,
            "Health": -1
          },
          "risk",
          55,
          "lead:data"
        ],
        [
          "🚨",
          "Te diepe deal",
          "High risk",
          250,
          {
            "Smarts": 5,
            "Health": -4,
            "Stamina": -8
          },
          "risk",
          35,
          "risk"
        ],
        [
          "🚪",
          "Deal weigeren",
          "Safe",
          0,
          {
            "Smarts": 2,
            "Health": 1
          },
          "business",
          100,
          "safe"
        ]
      ]
    },
    "fight": {
      "title": "Underground fight pit",
      "icon": "🥊",
      "type": "training",
      "choices": [
        [
          "👀",
          "Alleen kijken",
          "Combat insight",
          60,
          {
            "Smarts": 2,
            "Happiness": 3
          },
          "training",
          90,
          "skill:combat"
        ],
        [
          "🥊",
          "Meedoen",
          "Combat/risk",
          180,
          {
            "Fitness": 5,
            "Health": -5,
            "Stamina": -10
          },
          "risk",
          50,
          "skill:combat"
        ],
        [
          "🤝",
          "Trainer spreken",
          "Contact",
          90,
          {
            "Social": 4,
            "Fitness": 1
          },
          "contact",
          70,
          "contact"
        ],
        [
          "🧊",
          "Herstellen na kijken",
          "Safe",
          30,
          {
            "Health": 2,
            "Stamina": 3
          },
          "training",
          100,
          "recovery"
        ]
      ]
    },
    "clinic": {
      "title": "Cyber clinic",
      "icon": "🦾",
      "type": "risk",
      "choices": [
        [
          "🦾",
          "Goedkope upgrade",
          "Cyber/risk",
          800,
          {
            "Smarts": 2,
            "Health": -3
          },
          "risk",
          55,
          "cyber"
        ],
        [
          "🏥",
          "Medische check",
          "Health",
          220,
          {
            "Health": 4,
            "Stamina": 2
          },
          "training",
          95,
          "recovery"
        ],
        [
          "💽",
          "Cyberdeck info",
          "Business/tech",
          350,
          {
            "Smarts": 5
          },
          "business",
          70,
          "item:cyberdeck"
        ],
        [
          "🚪",
          "Niet doen",
          "Safe",
          0,
          {
            "Smarts": 1
          },
          "risk",
          100,
          "safe"
        ]
      ]
    }
  }
};
  const TXT196 = {
  "spain": {
    "food": [
      "Ik koos de lokale optie. Niet chic, maar precies daardoor voelde het echt. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het eten was simpel, warm en beter dan de toeristische versie. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Een local gaf mij een tip en ineens zat ik op een plek die ik anders nooit had gevonden. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik betaalde iets te veel, maar de sfeer maakte het bijna goed. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De eerste hap was meteen vakantie. Mijn happiness ging duidelijk omhoog. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik probeerde iets nieuws en deed alsof ik wist wat ik bestelde. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het eten was top, maar de rekening voelde iets minder feestelijk. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De zaak zat vol locals, dus ik wist dat ik goed zat. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik raakte aan de praat met Sofia naast mij terwijl ik zat te eten. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De avond begon rustig, maar het eten trok mij helemaal de sfeer in. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "beach": [
      "Ik koos voor rust aan het water. Mijn hoofd werd stiller en mijn stamina herstelde. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De zon pakte harder uit dan verwacht, maar de vibe was sterk. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik deed mee aan iets sportiefs op het strand en was sneller kapot dan gepland. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Een groep mensen trok mij de activiteit in en de dag werd socialer dan verwacht. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik nam eindelijk vakantie in plaats van alleen knoppen drukken. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het water was koud genoeg om mij wakker te maken. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik bleef langer hangen dan gepland, maar dat was precies de bedoeling. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De stranddag gaf health en happiness, maar kostte ook energie. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Er ontstond een kleine flirt tijdens het relaxen op het strand. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik ging voor veilig ontspannen en kwam beter terug dan ik vertrok. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "sport": [
      "De sportactie gaf mij adrenaline en een duidelijk beter gevoel. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik werd getest op techniek en merkte dat locals niet zomaar onder de indruk zijn. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het publiek/de groep gaf meer energie dan verwacht. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik probeerde mee te doen en leerde sneller door fouten te maken. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Een coachachtig type gaf nuttige feedback. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik voelde mijn form stijgen, maar mijn stamina ging eraan. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het werd fanatieker dan gepland en dat maakte het leuk. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik kreeg een klein compliment en deed alsof het normaal was. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De actie had echte sportwaarde in plaats van alleen tekst. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik kwam eruit met meer respect voor de lokale sportcultuur. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "culture": [
      "Ik nam de tijd om de plek echt te bekijken in plaats van alleen toerist te spelen. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De cultuuractie gaf smarts en maakte de DLC minder leeg. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik leerde iets kleins dat later groter voelde. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Een gids of local maakte het veel interessanter dan verwacht. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik maakte content, maar kreeg ook echt iets mee van de plek. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De omgeving voelde ineens minder als decor en meer als echte locatie. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik koos de rustige route en dat leverde meer op dan gedacht. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Er zat meer verhaal achter deze plek dan ik eerst zag. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik had even geen haast en precies daardoor werkte het. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik liep weg met meer respect voor de stad. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "training": [
      "De training was nuttig, maar mijn stamina kreeg klappen. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik leerde techniek die ik thuis niet zo snel had opgepakt. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De lokale trainer was direct en niet onder de indruk van excuses. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik hield het verstandig en voorkwam dat ik mezelf sloopte. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De training gaf progressie en een beetje discipline. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik merkte dat reizen en trainen samen zwaar is. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De sessie voelde echt als voorbereiding, niet als random knop. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik kreeg feedback waar ik later wat aan heb. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Mijn fitness ging omhoog, maar ik moest wel herstellen. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De training was simpel, maar effectief. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "travel": [
      "De route zelf werd een verhaal, niet alleen een verplaatsing. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Er gebeurde onderweg iets kleins dat de dag memorabel maakte. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik koos de goedkopere optie en kreeg precies de chaos die daarbij hoort. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het uitzicht was beter dan verwacht en mijn mood ging mee omhoog. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De reis kostte energie, maar leverde herinneringen op. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik raakte onderweg aan de praat met Marta. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De planning liep niet perfect, maar dat maakte het juist interessanter. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik voelde mij even echt op avontuur. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Onderweg betaalde ik te veel voor iets dat toch leuk bleek. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het was niet efficiënt, wel leuk. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "fame": [
      "Ik maakte content en kreeg meer aandacht dan normaal. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik probeerde mijzelf beter neer te zetten en dat werkte redelijk. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Een kleine kans op fame voelde meteen verslavend. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het werd geen doorbraak, maar wel een stapje omhoog. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Iemand vond mijn uitstraling goed genoeg om te blijven praten. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Mijn looks/social kregen een boost door de actie. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik deed iets dat later goed op mijn feed zou staan. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De plek gaf meer status dan de actie zelf. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik pakte een klein fame-moment zonder meteen beroemd te worden. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het voelde alsof de stad mij heel even zag. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "business": [
      "Ik keek naar de cijfers in plaats van alleen de droom. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Een local contact gaf een serieuze lead. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De kans was interessant, maar niet zonder risico. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik rook op tijd dat de deal te mooi klonk. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Er zat misschien een businessroute in, maar ik moest scherp blijven. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het gesprek gaf meer netwerk dan geld. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik leerde hoe de lokale markt werkt. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De lead voelde klein, maar bruikbaar. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik koos verstand boven hype en voorkwam een dure fout. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De businessactie had eindelijk echte bedoeling. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "shop": [
      "Ik kocht iets dat als souvenir én item werkte. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De verkoper probeerde mij toeristenprijs te geven, maar ik bleef redelijk scherp. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het item gaf meer gevoel aan de plek. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik vond iets lokaals dat niet alleen decor was. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik betaalde, kreeg het item en voelde meteen iets meer connectie met de DLC. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De aankoop was niet noodzakelijk, maar wel leuk. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik kreeg er een klein verhaal bij van de verkoper. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het souvenir voelde beter dan random geld uitgeven. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik twijfelde even, kocht het toch, en had daar geen spijt van. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het item ging mijn inventory in en de vakantie voelde tastbaarder. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "risk": [
      "Er zat risico aan deze keuze en dat merkte ik meteen. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De situatie werd iets te chaotisch, maar ik kwam ermee weg. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik had scherper moeten opletten; dit kostte health of stamina. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Een local waarschuwde mij net op tijd. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het ging bijna mis, maar leverde wel een verhaal op. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De keuze was spannend, niet per se verstandig. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik kreeg adrenaline, maar ook stress. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het risico maakte de actie interessanter dan de veilige route. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik deed alsof ik controle had. Dat was niet helemaal waar. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik kwam eruit met minder energie en meer herinneringen. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "contact": [
      "Ik ontmoette Sofia die de plek meteen menselijker maakte. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Een local gaf tips waardoor de DLC minder als menu voelde. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het gesprek begon klein, maar bleef hangen. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik kreeg een naam, een glimlach en misschien een reden om terug te komen. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Niet elke ontmoeting werd groot, maar deze voelde nuttig. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik kreeg een nieuw contact zonder het te forceren. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De klik was niet perfect, maar wel echt. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Iemand trok mij de lokale sfeer in. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het gesprek leverde social en een kleine herinnering op. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik ging weg met het gevoel dat ik de stad iets beter kende. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ],
    "fail": [
      "De actie pakte minder goed uit dan gehoopt. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik had te veel verwacht en kreeg vooral vermoeidheid. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Het plan klonk beter in mijn hoofd. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik maakte een onhandige keuze en voelde dat meteen. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De timing was verkeerd en de sfeer zakte weg. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik probeerde iets, maar het bleef awkward. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Dit was geen ramp, maar ook geen succes. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Ik verloor wat energie en kreeg weinig terug. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "De plek was leuker dan mijn uitvoering. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)",
      "Volgende keer kies ik slimmer. (Spanje: zon, tapas, voetbalshirts en laat avondgeluid)"
    ]
  },
  "america": {
    "food": [
      "Ik koos de lokale optie. Niet chic, maar precies daardoor voelde het echt. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het eten was simpel, warm en beter dan de toeristische versie. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Een local gaf mij een tip en ineens zat ik op een plek die ik anders nooit had gevonden. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik betaalde iets te veel, maar de sfeer maakte het bijna goed. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De eerste hap was meteen vakantie. Mijn happiness ging duidelijk omhoog. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik probeerde iets nieuws en deed alsof ik wist wat ik bestelde. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het eten was top, maar de rekening voelde iets minder feestelijk. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De zaak zat vol locals, dus ik wist dat ik goed zat. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik raakte aan de praat met Jess naast mij terwijl ik zat te eten. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De avond begon rustig, maar het eten trok mij helemaal de sfeer in. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "beach": [
      "Ik koos voor rust aan het water. Mijn hoofd werd stiller en mijn stamina herstelde. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De zon pakte harder uit dan verwacht, maar de vibe was sterk. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik deed mee aan iets sportiefs op het strand en was sneller kapot dan gepland. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Een groep mensen trok mij de activiteit in en de dag werd socialer dan verwacht. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik nam eindelijk vakantie in plaats van alleen knoppen drukken. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het water was koud genoeg om mij wakker te maken. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik bleef langer hangen dan gepland, maar dat was precies de bedoeling. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De stranddag gaf health en happiness, maar kostte ook energie. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Er ontstond een kleine flirt tijdens het relaxen op het strand. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik ging voor veilig ontspannen en kwam beter terug dan ik vertrok. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "sport": [
      "De sportactie gaf mij adrenaline en een duidelijk beter gevoel. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik werd getest op techniek en merkte dat locals niet zomaar onder de indruk zijn. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het publiek/de groep gaf meer energie dan verwacht. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik probeerde mee te doen en leerde sneller door fouten te maken. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Een coachachtig type gaf nuttige feedback. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik voelde mijn form stijgen, maar mijn stamina ging eraan. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het werd fanatieker dan gepland en dat maakte het leuk. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik kreeg een klein compliment en deed alsof het normaal was. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De actie had echte sportwaarde in plaats van alleen tekst. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik kwam eruit met meer respect voor de lokale sportcultuur. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "culture": [
      "Ik nam de tijd om de plek echt te bekijken in plaats van alleen toerist te spelen. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De cultuuractie gaf smarts en maakte de DLC minder leeg. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik leerde iets kleins dat later groter voelde. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Een gids of local maakte het veel interessanter dan verwacht. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik maakte content, maar kreeg ook echt iets mee van de plek. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De omgeving voelde ineens minder als decor en meer als echte locatie. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik koos de rustige route en dat leverde meer op dan gedacht. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Er zat meer verhaal achter deze plek dan ik eerst zag. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik had even geen haast en precies daardoor werkte het. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik liep weg met meer respect voor de stad. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "training": [
      "De training was nuttig, maar mijn stamina kreeg klappen. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik leerde techniek die ik thuis niet zo snel had opgepakt. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De lokale trainer was direct en niet onder de indruk van excuses. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik hield het verstandig en voorkwam dat ik mezelf sloopte. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De training gaf progressie en een beetje discipline. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik merkte dat reizen en trainen samen zwaar is. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De sessie voelde echt als voorbereiding, niet als random knop. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik kreeg feedback waar ik later wat aan heb. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Mijn fitness ging omhoog, maar ik moest wel herstellen. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De training was simpel, maar effectief. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "travel": [
      "De route zelf werd een verhaal, niet alleen een verplaatsing. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Er gebeurde onderweg iets kleins dat de dag memorabel maakte. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik koos de goedkopere optie en kreeg precies de chaos die daarbij hoort. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het uitzicht was beter dan verwacht en mijn mood ging mee omhoog. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De reis kostte energie, maar leverde herinneringen op. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik raakte onderweg aan de praat met Skylar. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De planning liep niet perfect, maar dat maakte het juist interessanter. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik voelde mij even echt op avontuur. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Onderweg betaalde ik te veel voor iets dat toch leuk bleek. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het was niet efficiënt, wel leuk. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "fame": [
      "Ik maakte content en kreeg meer aandacht dan normaal. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik probeerde mijzelf beter neer te zetten en dat werkte redelijk. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Een kleine kans op fame voelde meteen verslavend. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het werd geen doorbraak, maar wel een stapje omhoog. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Iemand vond mijn uitstraling goed genoeg om te blijven praten. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Mijn looks/social kregen een boost door de actie. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik deed iets dat later goed op mijn feed zou staan. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De plek gaf meer status dan de actie zelf. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik pakte een klein fame-moment zonder meteen beroemd te worden. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het voelde alsof de stad mij heel even zag. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "business": [
      "Ik keek naar de cijfers in plaats van alleen de droom. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Een local contact gaf een serieuze lead. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De kans was interessant, maar niet zonder risico. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik rook op tijd dat de deal te mooi klonk. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Er zat misschien een businessroute in, maar ik moest scherp blijven. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het gesprek gaf meer netwerk dan geld. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik leerde hoe de lokale markt werkt. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De lead voelde klein, maar bruikbaar. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik koos verstand boven hype en voorkwam een dure fout. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De businessactie had eindelijk echte bedoeling. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "shop": [
      "Ik kocht iets dat als souvenir én item werkte. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De verkoper probeerde mij toeristenprijs te geven, maar ik bleef redelijk scherp. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het item gaf meer gevoel aan de plek. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik vond iets lokaals dat niet alleen decor was. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik betaalde, kreeg het item en voelde meteen iets meer connectie met de DLC. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De aankoop was niet noodzakelijk, maar wel leuk. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik kreeg er een klein verhaal bij van de verkoper. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het souvenir voelde beter dan random geld uitgeven. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik twijfelde even, kocht het toch, en had daar geen spijt van. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het item ging mijn inventory in en de vakantie voelde tastbaarder. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "risk": [
      "Er zat risico aan deze keuze en dat merkte ik meteen. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De situatie werd iets te chaotisch, maar ik kwam ermee weg. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik had scherper moeten opletten; dit kostte health of stamina. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Een local waarschuwde mij net op tijd. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het ging bijna mis, maar leverde wel een verhaal op. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De keuze was spannend, niet per se verstandig. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik kreeg adrenaline, maar ook stress. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het risico maakte de actie interessanter dan de veilige route. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik deed alsof ik controle had. Dat was niet helemaal waar. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik kwam eruit met minder energie en meer herinneringen. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "contact": [
      "Ik ontmoette Jess die de plek meteen menselijker maakte. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Een local gaf tips waardoor de DLC minder als menu voelde. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het gesprek begon klein, maar bleef hangen. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik kreeg een naam, een glimlach en misschien een reden om terug te komen. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Niet elke ontmoeting werd groot, maar deze voelde nuttig. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik kreeg een nieuw contact zonder het te forceren. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De klik was niet perfect, maar wel echt. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Iemand trok mij de lokale sfeer in. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het gesprek leverde social en een kleine herinnering op. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik ging weg met het gevoel dat ik de stad iets beter kende. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ],
    "fail": [
      "De actie pakte minder goed uit dan gehoopt. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik had te veel verwacht en kreeg vooral vermoeidheid. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Het plan klonk beter in mijn hoofd. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik maakte een onhandige keuze en voelde dat meteen. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De timing was verkeerd en de sfeer zakte weg. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik probeerde iets, maar het bleef awkward. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Dit was geen ramp, maar ook geen succes. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Ik verloor wat energie en kreeg weinig terug. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "De plek was leuker dan mijn uitvoering. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)",
      "Volgende keer kies ik slimmer. (Amerika / USA: neon, sportshirts, grote wegen en overdreven porties)"
    ]
  },
  "japan": {
    "food": [
      "Ik koos de lokale optie. Niet chic, maar precies daardoor voelde het echt. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het eten was simpel, warm en beter dan de toeristische versie. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Een local gaf mij een tip en ineens zat ik op een plek die ik anders nooit had gevonden. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik betaalde iets te veel, maar de sfeer maakte het bijna goed. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De eerste hap was meteen vakantie. Mijn happiness ging duidelijk omhoog. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik probeerde iets nieuws en deed alsof ik wist wat ik bestelde. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het eten was top, maar de rekening voelde iets minder feestelijk. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De zaak zat vol locals, dus ik wist dat ik goed zat. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik raakte aan de praat met Aiko naast mij terwijl ik zat te eten. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De avond begon rustig, maar het eten trok mij helemaal de sfeer in. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "beach": [
      "Ik koos voor rust aan het water. Mijn hoofd werd stiller en mijn stamina herstelde. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De zon pakte harder uit dan verwacht, maar de vibe was sterk. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik deed mee aan iets sportiefs op het strand en was sneller kapot dan gepland. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Een groep mensen trok mij de activiteit in en de dag werd socialer dan verwacht. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik nam eindelijk vakantie in plaats van alleen knoppen drukken. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het water was koud genoeg om mij wakker te maken. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik bleef langer hangen dan gepland, maar dat was precies de bedoeling. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De stranddag gaf health en happiness, maar kostte ook energie. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Er ontstond een kleine flirt tijdens het relaxen op het strand. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik ging voor veilig ontspannen en kwam beter terug dan ik vertrok. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "sport": [
      "De sportactie gaf mij adrenaline en een duidelijk beter gevoel. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik werd getest op techniek en merkte dat locals niet zomaar onder de indruk zijn. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het publiek/de groep gaf meer energie dan verwacht. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik probeerde mee te doen en leerde sneller door fouten te maken. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Een coachachtig type gaf nuttige feedback. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik voelde mijn form stijgen, maar mijn stamina ging eraan. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het werd fanatieker dan gepland en dat maakte het leuk. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik kreeg een klein compliment en deed alsof het normaal was. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De actie had echte sportwaarde in plaats van alleen tekst. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik kwam eruit met meer respect voor de lokale sportcultuur. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "culture": [
      "Ik nam de tijd om de plek echt te bekijken in plaats van alleen toerist te spelen. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De cultuuractie gaf smarts en maakte de DLC minder leeg. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik leerde iets kleins dat later groter voelde. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Een gids of local maakte het veel interessanter dan verwacht. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik maakte content, maar kreeg ook echt iets mee van de plek. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De omgeving voelde ineens minder als decor en meer als echte locatie. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik koos de rustige route en dat leverde meer op dan gedacht. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Er zat meer verhaal achter deze plek dan ik eerst zag. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik had even geen haast en precies daardoor werkte het. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik liep weg met meer respect voor de stad. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "training": [
      "De training was nuttig, maar mijn stamina kreeg klappen. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik leerde techniek die ik thuis niet zo snel had opgepakt. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De lokale trainer was direct en niet onder de indruk van excuses. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik hield het verstandig en voorkwam dat ik mezelf sloopte. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De training gaf progressie en een beetje discipline. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik merkte dat reizen en trainen samen zwaar is. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De sessie voelde echt als voorbereiding, niet als random knop. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik kreeg feedback waar ik later wat aan heb. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Mijn fitness ging omhoog, maar ik moest wel herstellen. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De training was simpel, maar effectief. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "travel": [
      "De route zelf werd een verhaal, niet alleen een verplaatsing. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Er gebeurde onderweg iets kleins dat de dag memorabel maakte. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik koos de goedkopere optie en kreeg precies de chaos die daarbij hoort. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het uitzicht was beter dan verwacht en mijn mood ging mee omhoog. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De reis kostte energie, maar leverde herinneringen op. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik raakte onderweg aan de praat met Rina. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De planning liep niet perfect, maar dat maakte het juist interessanter. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik voelde mij even echt op avontuur. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Onderweg betaalde ik te veel voor iets dat toch leuk bleek. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het was niet efficiënt, wel leuk. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "fame": [
      "Ik maakte content en kreeg meer aandacht dan normaal. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik probeerde mijzelf beter neer te zetten en dat werkte redelijk. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Een kleine kans op fame voelde meteen verslavend. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het werd geen doorbraak, maar wel een stapje omhoog. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Iemand vond mijn uitstraling goed genoeg om te blijven praten. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Mijn looks/social kregen een boost door de actie. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik deed iets dat later goed op mijn feed zou staan. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De plek gaf meer status dan de actie zelf. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik pakte een klein fame-moment zonder meteen beroemd te worden. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het voelde alsof de stad mij heel even zag. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "business": [
      "Ik keek naar de cijfers in plaats van alleen de droom. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Een local contact gaf een serieuze lead. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De kans was interessant, maar niet zonder risico. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik rook op tijd dat de deal te mooi klonk. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Er zat misschien een businessroute in, maar ik moest scherp blijven. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het gesprek gaf meer netwerk dan geld. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik leerde hoe de lokale markt werkt. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De lead voelde klein, maar bruikbaar. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik koos verstand boven hype en voorkwam een dure fout. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De businessactie had eindelijk echte bedoeling. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "shop": [
      "Ik kocht iets dat als souvenir én item werkte. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De verkoper probeerde mij toeristenprijs te geven, maar ik bleef redelijk scherp. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het item gaf meer gevoel aan de plek. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik vond iets lokaals dat niet alleen decor was. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik betaalde, kreeg het item en voelde meteen iets meer connectie met de DLC. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De aankoop was niet noodzakelijk, maar wel leuk. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik kreeg er een klein verhaal bij van de verkoper. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het souvenir voelde beter dan random geld uitgeven. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik twijfelde even, kocht het toch, en had daar geen spijt van. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het item ging mijn inventory in en de vakantie voelde tastbaarder. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "risk": [
      "Er zat risico aan deze keuze en dat merkte ik meteen. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De situatie werd iets te chaotisch, maar ik kwam ermee weg. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik had scherper moeten opletten; dit kostte health of stamina. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Een local waarschuwde mij net op tijd. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het ging bijna mis, maar leverde wel een verhaal op. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De keuze was spannend, niet per se verstandig. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik kreeg adrenaline, maar ook stress. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het risico maakte de actie interessanter dan de veilige route. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik deed alsof ik controle had. Dat was niet helemaal waar. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik kwam eruit met minder energie en meer herinneringen. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "contact": [
      "Ik ontmoette Aiko die de plek meteen menselijker maakte. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Een local gaf tips waardoor de DLC minder als menu voelde. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het gesprek begon klein, maar bleef hangen. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik kreeg een naam, een glimlach en misschien een reden om terug te komen. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Niet elke ontmoeting werd groot, maar deze voelde nuttig. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik kreeg een nieuw contact zonder het te forceren. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De klik was niet perfect, maar wel echt. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Iemand trok mij de lokale sfeer in. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het gesprek leverde social en een kleine herinnering op. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik ging weg met het gevoel dat ik de stad iets beter kende. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ],
    "fail": [
      "De actie pakte minder goed uit dan gehoopt. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik had te veel verwacht en kreeg vooral vermoeidheid. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Het plan klonk beter in mijn hoofd. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik maakte een onhandige keuze en voelde dat meteen. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De timing was verkeerd en de sfeer zakte weg. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik probeerde iets, maar het bleef awkward. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Dit was geen ramp, maar ook geen succes. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Ik verloor wat energie en kreeg weinig terug. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "De plek was leuker dan mijn uitvoering. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)",
      "Volgende keer kies ik slimmer. (Japan / Tokyo: neon, treinen, ramenlucht en georganiseerde chaos)"
    ]
  },
  "amsterdam": {
    "food": [
      "Ik koos de lokale optie. Niet chic, maar precies daardoor voelde het echt. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het eten was simpel, warm en beter dan de toeristische versie. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Een local gaf mij een tip en ineens zat ik op een plek die ik anders nooit had gevonden. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik betaalde iets te veel, maar de sfeer maakte het bijna goed. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De eerste hap was meteen vakantie. Mijn happiness ging duidelijk omhoog. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik probeerde iets nieuws en deed alsof ik wist wat ik bestelde. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het eten was top, maar de rekening voelde iets minder feestelijk. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De zaak zat vol locals, dus ik wist dat ik goed zat. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik raakte aan de praat met Lisa naast mij terwijl ik zat te eten. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De avond begon rustig, maar het eten trok mij helemaal de sfeer in. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "beach": [
      "Ik koos voor rust aan het water. Mijn hoofd werd stiller en mijn stamina herstelde. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De zon pakte harder uit dan verwacht, maar de vibe was sterk. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik deed mee aan iets sportiefs op het strand en was sneller kapot dan gepland. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Een groep mensen trok mij de activiteit in en de dag werd socialer dan verwacht. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik nam eindelijk vakantie in plaats van alleen knoppen drukken. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het water was koud genoeg om mij wakker te maken. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik bleef langer hangen dan gepland, maar dat was precies de bedoeling. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De stranddag gaf health en happiness, maar kostte ook energie. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Er ontstond een kleine flirt tijdens het relaxen op het strand. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik ging voor veilig ontspannen en kwam beter terug dan ik vertrok. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "sport": [
      "De sportactie gaf mij adrenaline en een duidelijk beter gevoel. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik werd getest op techniek en merkte dat locals niet zomaar onder de indruk zijn. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het publiek/de groep gaf meer energie dan verwacht. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik probeerde mee te doen en leerde sneller door fouten te maken. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Een coachachtig type gaf nuttige feedback. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik voelde mijn form stijgen, maar mijn stamina ging eraan. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het werd fanatieker dan gepland en dat maakte het leuk. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik kreeg een klein compliment en deed alsof het normaal was. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De actie had echte sportwaarde in plaats van alleen tekst. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik kwam eruit met meer respect voor de lokale sportcultuur. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "culture": [
      "Ik nam de tijd om de plek echt te bekijken in plaats van alleen toerist te spelen. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De cultuuractie gaf smarts en maakte de DLC minder leeg. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik leerde iets kleins dat later groter voelde. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Een gids of local maakte het veel interessanter dan verwacht. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik maakte content, maar kreeg ook echt iets mee van de plek. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De omgeving voelde ineens minder als decor en meer als echte locatie. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik koos de rustige route en dat leverde meer op dan gedacht. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Er zat meer verhaal achter deze plek dan ik eerst zag. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik had even geen haast en precies daardoor werkte het. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik liep weg met meer respect voor de stad. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "training": [
      "De training was nuttig, maar mijn stamina kreeg klappen. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik leerde techniek die ik thuis niet zo snel had opgepakt. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De lokale trainer was direct en niet onder de indruk van excuses. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik hield het verstandig en voorkwam dat ik mezelf sloopte. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De training gaf progressie en een beetje discipline. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik merkte dat reizen en trainen samen zwaar is. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De sessie voelde echt als voorbereiding, niet als random knop. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik kreeg feedback waar ik later wat aan heb. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Mijn fitness ging omhoog, maar ik moest wel herstellen. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De training was simpel, maar effectief. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "travel": [
      "De route zelf werd een verhaal, niet alleen een verplaatsing. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Er gebeurde onderweg iets kleins dat de dag memorabel maakte. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik koos de goedkopere optie en kreeg precies de chaos die daarbij hoort. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het uitzicht was beter dan verwacht en mijn mood ging mee omhoog. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De reis kostte energie, maar leverde herinneringen op. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik raakte onderweg aan de praat met Lotte. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De planning liep niet perfect, maar dat maakte het juist interessanter. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik voelde mij even echt op avontuur. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Onderweg betaalde ik te veel voor iets dat toch leuk bleek. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het was niet efficiënt, wel leuk. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "fame": [
      "Ik maakte content en kreeg meer aandacht dan normaal. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik probeerde mijzelf beter neer te zetten en dat werkte redelijk. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Een kleine kans op fame voelde meteen verslavend. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het werd geen doorbraak, maar wel een stapje omhoog. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Iemand vond mijn uitstraling goed genoeg om te blijven praten. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Mijn looks/social kregen een boost door de actie. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik deed iets dat later goed op mijn feed zou staan. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De plek gaf meer status dan de actie zelf. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik pakte een klein fame-moment zonder meteen beroemd te worden. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het voelde alsof de stad mij heel even zag. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "business": [
      "Ik keek naar de cijfers in plaats van alleen de droom. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Een local contact gaf een serieuze lead. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De kans was interessant, maar niet zonder risico. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik rook op tijd dat de deal te mooi klonk. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Er zat misschien een businessroute in, maar ik moest scherp blijven. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het gesprek gaf meer netwerk dan geld. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik leerde hoe de lokale markt werkt. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De lead voelde klein, maar bruikbaar. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik koos verstand boven hype en voorkwam een dure fout. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De businessactie had eindelijk echte bedoeling. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "shop": [
      "Ik kocht iets dat als souvenir én item werkte. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De verkoper probeerde mij toeristenprijs te geven, maar ik bleef redelijk scherp. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het item gaf meer gevoel aan de plek. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik vond iets lokaals dat niet alleen decor was. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik betaalde, kreeg het item en voelde meteen iets meer connectie met de DLC. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De aankoop was niet noodzakelijk, maar wel leuk. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik kreeg er een klein verhaal bij van de verkoper. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het souvenir voelde beter dan random geld uitgeven. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik twijfelde even, kocht het toch, en had daar geen spijt van. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het item ging mijn inventory in en de vakantie voelde tastbaarder. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "risk": [
      "Er zat risico aan deze keuze en dat merkte ik meteen. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De situatie werd iets te chaotisch, maar ik kwam ermee weg. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik had scherper moeten opletten; dit kostte health of stamina. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Een local waarschuwde mij net op tijd. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het ging bijna mis, maar leverde wel een verhaal op. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De keuze was spannend, niet per se verstandig. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik kreeg adrenaline, maar ook stress. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het risico maakte de actie interessanter dan de veilige route. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik deed alsof ik controle had. Dat was niet helemaal waar. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik kwam eruit met minder energie en meer herinneringen. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "contact": [
      "Ik ontmoette Lisa die de plek meteen menselijker maakte. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Een local gaf tips waardoor de DLC minder als menu voelde. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het gesprek begon klein, maar bleef hangen. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik kreeg een naam, een glimlach en misschien een reden om terug te komen. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Niet elke ontmoeting werd groot, maar deze voelde nuttig. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik kreeg een nieuw contact zonder het te forceren. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De klik was niet perfect, maar wel echt. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Iemand trok mij de lokale sfeer in. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het gesprek leverde social en een kleine herinnering op. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik ging weg met het gevoel dat ik de stad iets beter kende. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ],
    "fail": [
      "De actie pakte minder goed uit dan gehoopt. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik had te veel verwacht en kreeg vooral vermoeidheid. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Het plan klonk beter in mijn hoofd. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik maakte een onhandige keuze en voelde dat meteen. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De timing was verkeerd en de sfeer zakte weg. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik probeerde iets, maar het bleef awkward. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Dit was geen ramp, maar ook geen succes. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Ik verloor wat energie en kreeg weinig terug. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "De plek was leuker dan mijn uitvoering. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)",
      "Volgende keer kies ik slimmer. (Amsterdam: grachten, fietsen, regenjassen en creatieve drukte)"
    ]
  },
  "jamaica": {
    "food": [
      "Ik koos de lokale optie. Niet chic, maar precies daardoor voelde het echt. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het eten was simpel, warm en beter dan de toeristische versie. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Een local gaf mij een tip en ineens zat ik op een plek die ik anders nooit had gevonden. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik betaalde iets te veel, maar de sfeer maakte het bijna goed. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De eerste hap was meteen vakantie. Mijn happiness ging duidelijk omhoog. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik probeerde iets nieuws en deed alsof ik wist wat ik bestelde. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het eten was top, maar de rekening voelde iets minder feestelijk. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De zaak zat vol locals, dus ik wist dat ik goed zat. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik raakte aan de praat met Aaliyah naast mij terwijl ik zat te eten. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De avond begon rustig, maar het eten trok mij helemaal de sfeer in. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "beach": [
      "Ik koos voor rust aan het water. Mijn hoofd werd stiller en mijn stamina herstelde. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De zon pakte harder uit dan verwacht, maar de vibe was sterk. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik deed mee aan iets sportiefs op het strand en was sneller kapot dan gepland. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Een groep mensen trok mij de activiteit in en de dag werd socialer dan verwacht. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik nam eindelijk vakantie in plaats van alleen knoppen drukken. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het water was koud genoeg om mij wakker te maken. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik bleef langer hangen dan gepland, maar dat was precies de bedoeling. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De stranddag gaf health en happiness, maar kostte ook energie. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Er ontstond een kleine flirt tijdens het relaxen op het strand. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik ging voor veilig ontspannen en kwam beter terug dan ik vertrok. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "sport": [
      "De sportactie gaf mij adrenaline en een duidelijk beter gevoel. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik werd getest op techniek en merkte dat locals niet zomaar onder de indruk zijn. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het publiek/de groep gaf meer energie dan verwacht. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik probeerde mee te doen en leerde sneller door fouten te maken. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Een coachachtig type gaf nuttige feedback. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik voelde mijn form stijgen, maar mijn stamina ging eraan. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het werd fanatieker dan gepland en dat maakte het leuk. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik kreeg een klein compliment en deed alsof het normaal was. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De actie had echte sportwaarde in plaats van alleen tekst. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik kwam eruit met meer respect voor de lokale sportcultuur. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "culture": [
      "Ik nam de tijd om de plek echt te bekijken in plaats van alleen toerist te spelen. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De cultuuractie gaf smarts en maakte de DLC minder leeg. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik leerde iets kleins dat later groter voelde. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Een gids of local maakte het veel interessanter dan verwacht. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik maakte content, maar kreeg ook echt iets mee van de plek. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De omgeving voelde ineens minder als decor en meer als echte locatie. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik koos de rustige route en dat leverde meer op dan gedacht. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Er zat meer verhaal achter deze plek dan ik eerst zag. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik had even geen haast en precies daardoor werkte het. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik liep weg met meer respect voor de stad. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "training": [
      "De training was nuttig, maar mijn stamina kreeg klappen. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik leerde techniek die ik thuis niet zo snel had opgepakt. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De lokale trainer was direct en niet onder de indruk van excuses. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik hield het verstandig en voorkwam dat ik mezelf sloopte. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De training gaf progressie en een beetje discipline. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik merkte dat reizen en trainen samen zwaar is. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De sessie voelde echt als voorbereiding, niet als random knop. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik kreeg feedback waar ik later wat aan heb. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Mijn fitness ging omhoog, maar ik moest wel herstellen. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De training was simpel, maar effectief. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "travel": [
      "De route zelf werd een verhaal, niet alleen een verplaatsing. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Er gebeurde onderweg iets kleins dat de dag memorabel maakte. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik koos de goedkopere optie en kreeg precies de chaos die daarbij hoort. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het uitzicht was beter dan verwacht en mijn mood ging mee omhoog. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De reis kostte energie, maar leverde herinneringen op. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik raakte onderweg aan de praat met Jada. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De planning liep niet perfect, maar dat maakte het juist interessanter. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik voelde mij even echt op avontuur. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Onderweg betaalde ik te veel voor iets dat toch leuk bleek. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het was niet efficiënt, wel leuk. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "fame": [
      "Ik maakte content en kreeg meer aandacht dan normaal. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik probeerde mijzelf beter neer te zetten en dat werkte redelijk. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Een kleine kans op fame voelde meteen verslavend. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het werd geen doorbraak, maar wel een stapje omhoog. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Iemand vond mijn uitstraling goed genoeg om te blijven praten. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Mijn looks/social kregen een boost door de actie. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik deed iets dat later goed op mijn feed zou staan. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De plek gaf meer status dan de actie zelf. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik pakte een klein fame-moment zonder meteen beroemd te worden. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het voelde alsof de stad mij heel even zag. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "business": [
      "Ik keek naar de cijfers in plaats van alleen de droom. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Een local contact gaf een serieuze lead. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De kans was interessant, maar niet zonder risico. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik rook op tijd dat de deal te mooi klonk. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Er zat misschien een businessroute in, maar ik moest scherp blijven. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het gesprek gaf meer netwerk dan geld. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik leerde hoe de lokale markt werkt. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De lead voelde klein, maar bruikbaar. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik koos verstand boven hype en voorkwam een dure fout. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De businessactie had eindelijk echte bedoeling. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "shop": [
      "Ik kocht iets dat als souvenir én item werkte. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De verkoper probeerde mij toeristenprijs te geven, maar ik bleef redelijk scherp. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het item gaf meer gevoel aan de plek. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik vond iets lokaals dat niet alleen decor was. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik betaalde, kreeg het item en voelde meteen iets meer connectie met de DLC. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De aankoop was niet noodzakelijk, maar wel leuk. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik kreeg er een klein verhaal bij van de verkoper. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het souvenir voelde beter dan random geld uitgeven. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik twijfelde even, kocht het toch, en had daar geen spijt van. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het item ging mijn inventory in en de vakantie voelde tastbaarder. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "risk": [
      "Er zat risico aan deze keuze en dat merkte ik meteen. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De situatie werd iets te chaotisch, maar ik kwam ermee weg. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik had scherper moeten opletten; dit kostte health of stamina. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Een local waarschuwde mij net op tijd. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het ging bijna mis, maar leverde wel een verhaal op. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De keuze was spannend, niet per se verstandig. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik kreeg adrenaline, maar ook stress. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het risico maakte de actie interessanter dan de veilige route. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik deed alsof ik controle had. Dat was niet helemaal waar. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik kwam eruit met minder energie en meer herinneringen. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "contact": [
      "Ik ontmoette Aaliyah die de plek meteen menselijker maakte. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Een local gaf tips waardoor de DLC minder als menu voelde. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het gesprek begon klein, maar bleef hangen. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik kreeg een naam, een glimlach en misschien een reden om terug te komen. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Niet elke ontmoeting werd groot, maar deze voelde nuttig. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik kreeg een nieuw contact zonder het te forceren. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De klik was niet perfect, maar wel echt. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Iemand trok mij de lokale sfeer in. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het gesprek leverde social en een kleine herinnering op. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik ging weg met het gevoel dat ik de stad iets beter kende. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ],
    "fail": [
      "De actie pakte minder goed uit dan gehoopt. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik had te veel verwacht en kreeg vooral vermoeidheid. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Het plan klonk beter in mijn hoofd. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik maakte een onhandige keuze en voelde dat meteen. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De timing was verkeerd en de sfeer zakte weg. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik probeerde iets, maar het bleef awkward. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Dit was geen ramp, maar ook geen succes. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Ik verloor wat energie en kreeg weinig terug. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "De plek was leuker dan mijn uitvoering. (Jamaica: strand, reggae, warme lucht en relaxte locals)",
      "Volgende keer kies ik slimmer. (Jamaica: strand, reggae, warme lucht en relaxte locals)"
    ]
  },
  "nightcity": {
    "food": [
      "Ik koos de lokale optie. Niet chic, maar precies daardoor voelde het echt. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het eten was simpel, warm en beter dan de toeristische versie. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Een local gaf mij een tip en ineens zat ik op een plek die ik anders nooit had gevonden. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik betaalde iets te veel, maar de sfeer maakte het bijna goed. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De eerste hap was meteen vakantie. Mijn happiness ging duidelijk omhoog. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik probeerde iets nieuws en deed alsof ik wist wat ik bestelde. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het eten was top, maar de rekening voelde iets minder feestelijk. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De zaak zat vol locals, dus ik wist dat ik goed zat. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik raakte aan de praat met Vex naast mij terwijl ik zat te eten. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De avond begon rustig, maar het eten trok mij helemaal de sfeer in. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "beach": [
      "Ik koos voor rust aan het water. Mijn hoofd werd stiller en mijn stamina herstelde. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De zon pakte harder uit dan verwacht, maar de vibe was sterk. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik deed mee aan iets sportiefs op het strand en was sneller kapot dan gepland. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Een groep mensen trok mij de activiteit in en de dag werd socialer dan verwacht. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik nam eindelijk vakantie in plaats van alleen knoppen drukken. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het water was koud genoeg om mij wakker te maken. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik bleef langer hangen dan gepland, maar dat was precies de bedoeling. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De stranddag gaf health en happiness, maar kostte ook energie. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Er ontstond een kleine flirt tijdens het relaxen op het strand. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik ging voor veilig ontspannen en kwam beter terug dan ik vertrok. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "sport": [
      "De sportactie gaf mij adrenaline en een duidelijk beter gevoel. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik werd getest op techniek en merkte dat locals niet zomaar onder de indruk zijn. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het publiek/de groep gaf meer energie dan verwacht. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik probeerde mee te doen en leerde sneller door fouten te maken. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Een coachachtig type gaf nuttige feedback. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik voelde mijn form stijgen, maar mijn stamina ging eraan. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het werd fanatieker dan gepland en dat maakte het leuk. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik kreeg een klein compliment en deed alsof het normaal was. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De actie had echte sportwaarde in plaats van alleen tekst. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik kwam eruit met meer respect voor de lokale sportcultuur. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "culture": [
      "Ik nam de tijd om de plek echt te bekijken in plaats van alleen toerist te spelen. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De cultuuractie gaf smarts en maakte de DLC minder leeg. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik leerde iets kleins dat later groter voelde. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Een gids of local maakte het veel interessanter dan verwacht. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik maakte content, maar kreeg ook echt iets mee van de plek. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De omgeving voelde ineens minder als decor en meer als echte locatie. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik koos de rustige route en dat leverde meer op dan gedacht. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Er zat meer verhaal achter deze plek dan ik eerst zag. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik had even geen haast en precies daardoor werkte het. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik liep weg met meer respect voor de stad. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "training": [
      "De training was nuttig, maar mijn stamina kreeg klappen. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik leerde techniek die ik thuis niet zo snel had opgepakt. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De lokale trainer was direct en niet onder de indruk van excuses. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik hield het verstandig en voorkwam dat ik mezelf sloopte. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De training gaf progressie en een beetje discipline. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik merkte dat reizen en trainen samen zwaar is. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De sessie voelde echt als voorbereiding, niet als random knop. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik kreeg feedback waar ik later wat aan heb. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Mijn fitness ging omhoog, maar ik moest wel herstellen. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De training was simpel, maar effectief. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "travel": [
      "De route zelf werd een verhaal, niet alleen een verplaatsing. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Er gebeurde onderweg iets kleins dat de dag memorabel maakte. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik koos de goedkopere optie en kreeg precies de chaos die daarbij hoort. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het uitzicht was beter dan verwacht en mijn mood ging mee omhoog. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De reis kostte energie, maar leverde herinneringen op. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik raakte onderweg aan de praat met Kira. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De planning liep niet perfect, maar dat maakte het juist interessanter. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik voelde mij even echt op avontuur. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Onderweg betaalde ik te veel voor iets dat toch leuk bleek. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het was niet efficiënt, wel leuk. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "fame": [
      "Ik maakte content en kreeg meer aandacht dan normaal. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik probeerde mijzelf beter neer te zetten en dat werkte redelijk. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Een kleine kans op fame voelde meteen verslavend. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het werd geen doorbraak, maar wel een stapje omhoog. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Iemand vond mijn uitstraling goed genoeg om te blijven praten. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Mijn looks/social kregen een boost door de actie. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik deed iets dat later goed op mijn feed zou staan. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De plek gaf meer status dan de actie zelf. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik pakte een klein fame-moment zonder meteen beroemd te worden. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het voelde alsof de stad mij heel even zag. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "business": [
      "Ik keek naar de cijfers in plaats van alleen de droom. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Een local contact gaf een serieuze lead. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De kans was interessant, maar niet zonder risico. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik rook op tijd dat de deal te mooi klonk. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Er zat misschien een businessroute in, maar ik moest scherp blijven. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het gesprek gaf meer netwerk dan geld. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik leerde hoe de lokale markt werkt. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De lead voelde klein, maar bruikbaar. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik koos verstand boven hype en voorkwam een dure fout. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De businessactie had eindelijk echte bedoeling. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "shop": [
      "Ik kocht iets dat als souvenir én item werkte. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De verkoper probeerde mij toeristenprijs te geven, maar ik bleef redelijk scherp. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het item gaf meer gevoel aan de plek. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik vond iets lokaals dat niet alleen decor was. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik betaalde, kreeg het item en voelde meteen iets meer connectie met de DLC. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De aankoop was niet noodzakelijk, maar wel leuk. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik kreeg er een klein verhaal bij van de verkoper. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het souvenir voelde beter dan random geld uitgeven. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik twijfelde even, kocht het toch, en had daar geen spijt van. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het item ging mijn inventory in en de vakantie voelde tastbaarder. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "risk": [
      "Er zat risico aan deze keuze en dat merkte ik meteen. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De situatie werd iets te chaotisch, maar ik kwam ermee weg. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik had scherper moeten opletten; dit kostte health of stamina. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Een local waarschuwde mij net op tijd. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het ging bijna mis, maar leverde wel een verhaal op. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De keuze was spannend, niet per se verstandig. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik kreeg adrenaline, maar ook stress. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het risico maakte de actie interessanter dan de veilige route. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik deed alsof ik controle had. Dat was niet helemaal waar. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik kwam eruit met minder energie en meer herinneringen. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "contact": [
      "Ik ontmoette Vex die de plek meteen menselijker maakte. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Een local gaf tips waardoor de DLC minder als menu voelde. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het gesprek begon klein, maar bleef hangen. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik kreeg een naam, een glimlach en misschien een reden om terug te komen. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Niet elke ontmoeting werd groot, maar deze voelde nuttig. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik kreeg een nieuw contact zonder het te forceren. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De klik was niet perfect, maar wel echt. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Iemand trok mij de lokale sfeer in. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het gesprek leverde social en een kleine herinnering op. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik ging weg met het gevoel dat ik de stad iets beter kende. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ],
    "fail": [
      "De actie pakte minder goed uit dan gehoopt. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik had te veel verwacht en kreeg vooral vermoeidheid. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Het plan klonk beter in mijn hoofd. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik maakte een onhandige keuze en voelde dat meteen. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De timing was verkeerd en de sfeer zakte weg. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik probeerde iets, maar het bleef awkward. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Dit was geen ramp, maar ook geen succes. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Ik verloor wat energie en kreeg weinig terug. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "De plek was leuker dan mijn uitvoering. (Night City: neon, rook, schaduwdeals en bas uit de muren)",
      "Volgende keer kies ik slimmer. (Night City: neon, rook, schaduwdeals en bas uit de muren)"
    ]
  }
};

  function r196(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick196(a){return a[Math.floor(Math.random()*a.length)]}
  function clamp196(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money196(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast196(t){try{toast(t)}catch(e){console.log(t)}}
  function save196(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function norm196(x){
    x=(x||'').toString().toLowerCase();
    if(['usa','us','america','united_states','united states','amerika'].includes(x))return 'america';
    if(['japan','tokyo'].includes(x))return 'japan';
    if(['spain','spanje','alkmaar','barcelona','madrid','malaga','valencia','sevilla'].includes(x))return 'spain';
    if(['amsterdam'].includes(x))return 'amsterdam';
    if(['jamaica','kingston'].includes(x))return 'jamaica';
    if(['nightcity','night_city','night city','nc'].includes(x))return 'nightcity';
    if(['enkhuizen','nl','nederland','netherlands','home','normal'].includes(x))return 'enkhuizen';
    return x||'enkhuizen';
  }
  function label196(p){p=norm196(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function icon196(p){p=norm196(p);return {enkhuizen:'🏠',amsterdam:'🌉',spain:'🇪🇸',america:'🇺🇸',japan:'🇯🇵',jamaica:'🇯🇲',nightcity:'🌃'}[p]||'🌍'}
  function rr196(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function dlc196(place){
    place=norm196(place); state.dlcTravel=state.dlcTravel||{};
    state.dlcTravel[place]=state.dlcTravel[place]||{days:0,vibe:50,contacts:0,souvenirs:0,spent:0,memories:0,party:0,localRep:0,romance:0};
    return state.dlcTravel[place];
  }
  function spend196(place,cost){
    if((state.money||0)<(cost||0)){toast196('Niet genoeg geld: '+money196(cost||0));return false}
    state.money-=(cost||0); dlc196(place).spent=(dlc196(place).spent||0)+(cost||0); return true;
  }
  function apply196(stats){
    stats=stats||{}; try{applyStats(stats)}catch(e){}
    state.stats=state.stats||{};
    Object.keys(stats).forEach(k=>{
      const d=stats[k]; if(!d)return;
      if(['Happiness','Health','Smarts','Looks'].includes(k))state.stats[k]=clamp196((state.stats[k]??50)+d);
      if(k==='Happiness'&&typeof state.happiness==='number')state.happiness=clamp196(state.happiness+d);
      if(k==='Health'&&typeof state.health==='number')state.health=clamp196(state.health+d);
      if(k==='Smarts'&&typeof state.smarts==='number')state.smarts=clamp196(state.smarts+d);
      if(k==='Looks'&&typeof state.looks==='number')state.looks=clamp196(state.looks+d);
      if(k==='Fitness')state.fitness=clamp196((state.fitness??50)+d);
      if(k==='Stamina')state.stamina=clamp196((state.stamina??50)+d);
      if(k==='Social')state.social=clamp196((state.social??0)+d,0,999999);
      if(k==='Fame')state.fame=clamp196((state.fame??0)+d,0,999999);
    });
  }
  function fx196(stats){return Object.keys(stats||{}).filter(k=>stats[k]).map(k=>k+' '+(stats[k]>0?'+':'')+stats[k]).join(' · ')}
  function result196(icon,title,text,stats,type='good'){
    apply196(stats||{}); const fx=fx196(stats||{});
    try{addLog('<b>'+title+'</b><br>'+text+(fx?'<br><span class="mini">Effect: '+fx+'</span>':''),type,false)}catch(e){}
    showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${fx?`<div class="vac187-effect">Effect: ${fx}</div>`:''}<button class="btn" onclick="closeModal()">Verder</button></div>`);
    save196();
  }
  function text196(place,theme,success=true){
    const p=TXT196[norm196(place)]||TXT196.amsterdam; 
    const arr=p[success?theme:'fail']||p[theme]||p.fail||['De actie had een onverwachte uitkomst.'];
    return pick196(arr);
  }
  function createContact196(place,source){
    place=norm196(place);
    const names={spain:['Sofia','Lucía','Elena','Valeria','Carmen'],america:['Jess','Maddie','Ashley','Taylor'],japan:['Aiko','Yumi','Hana','Sakura'],amsterdam:['Lisa','Noa','Eva','Sanne'],jamaica:['Aaliyah','Kayla','Tiana','Maya'],nightcity:['Vex','Nova','Misty','Raven']}[place]||['Lisa','Eva'];
    state.vacationContacts=state.vacationContacts||[];
    const c={id:'vc196_'+Date.now()+'_'+r196(100,999),name:pick196(names),place,age:Math.max(18,(state.age||18)+r196(-2,5)),gender:'female',rel:r196(35,62),attraction:r196(25,75),phone:Math.random()<0.35,romance:0,intimate:false,source,metAge:state.age,icon:'👩'};
    state.vacationContacts.push(c);
    dlc196(place).contacts=(dlc196(place).contacts||0)+1;
    return c;
  }
  function addItem196(id,place){
    state.items=state.items||[];
    const icon=id.includes('jersey')?'👕':id.includes('cyber')?'💽':id.includes('record')?'🎸':id.includes('art')?'🎨':id.includes('cap')?'🧢':'🎁';
    const name=id.replace(/_/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
    state.items.push({id,name,icon,cat:'Vakantie '+label196(place),price:r196(50,500),value:r196(40,450),durability:100,source:'v19.6 vacation activity'});
    dlc196(place).souvenirs=(dlc196(place).souvenirs||0)+1;
  }
  function reward196(place,reward,success){
    if(!reward||!success)return '';
    if(reward.startsWith('contact')){const c=createContact196(place,'activity');return '<br>Nieuw contact: '+c.name+(c.phone?' · nummer opgeslagen':'');}
    if(reward.startsWith('item:')){addItem196(reward.split(':')[1],place);return '<br>Item/souvenir toegevoegd.';}
    if(reward.startsWith('skill:')){
      const sk=reward.split(':')[1]; state.skills=state.skills||{}; state.skills[sk]=(state.skills[sk]||0)+r196(3,9); return '<br>Skill verbeterd: '+sk+'.';
    }
    if(reward.startsWith('lead:')){
      state.businessLeads=state.businessLeads||[]; state.businessLeads.push({place,type:reward.split(':')[1],age:state.age,quality:r196(30,80)});
      return '<br>Nieuwe lead opgeslagen: '+reward.split(':')[1]+'.';
    }
    if(reward.startsWith('business:')){
      state.businesses=state.businesses||[]; state.businesses.push({name:label196(place)+' '+reward.split(':')[1],type:'local business',city:place,level:1,reputation:20,customers:15,quality:22,marketing:18,monthlyRevenue:700,monthlyCosts:520,risk:35,debt:0});
      return '<br>Nieuwe lokale business-kans gestart.';
    }
    if(reward==='football'){state.football=state.football||{};state.football.form=clamp196((state.football.form||50)+r196(3,8));return '<br>Voetbalvorm ging omhoog.';}
    if(reward==='cyber'){state.nc=state.nc||{};state.nc.cyberware=clamp196((state.nc.cyberware||0)+r196(2,7));return '<br>Cyberware ging omhoog.';}
    return '';
  }
  window.vacationActivity196=function(place,id){
    place=norm196(place); const act=ACT196[place]&&ACT196[place][id];
    if(!act)return null;
    let out=`<div class="card"><b>${act.icon} ${act.title}</b><br>Kies je aanpak. Niet elke keuze is automatisch succes; er kan een contact, item, lead, risico of fail uitkomen.</div>`;
    out += `<div class="section">Keuzes</div>`;
    act.choices.forEach((ch,i)=>{
      const locked=(state.money||0)<(ch[3]||0);
      out+=rr196(ch[0],ch[1],ch[2]+(ch[3]?` · ${money196(ch[3])}`:''),`vacationActivityDo196('${place}','${id}',${i})`,locked);
    });
    out+=`<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">${act.icon}</div><div class="modalTitle">${act.title}</div></div><div class="modalBody" style="text-align:left">${out}</div>`);
    return true;
  };
  window.vacationActivityDo196=function(place,id,i){
    place=norm196(place); const act=ACT196[place]&&ACT196[place][id]; if(!act)return toast196('Activiteit niet gevonden.');
    const ch=act.choices[i]; if(!ch)return toast196('Keuze niet gevonden.');
    const cost=ch[3]||0; if(!spend196(place,cost))return;
    const base=ch[6]||70;
    const statBoost=((state.stats?.Happiness||50)+(state.stats?.Smarts||50)+(state.stats?.Looks||50))/30;
    const success=Math.random()*100 < clamp196(base+statBoost+r196(-15,15),10,98);
    let stats=Object.assign({}, ch[4]||{});
    let theme=ch[5]||act.type||'culture';
    let type=success?'good':'warn';
    if(!success){
      stats={Happiness:-r196(1,5),Stamina:-r196(1,5)};
      if(theme==='risk')stats.Health=-r196(1,5);
      theme='fail';
      type='bad';
    }
    const d=dlc196(place); d.memories=(d.memories||0)+1; d.vibe=clamp196((d.vibe||50)+(success?r196(2,7):r196(-3,2)));
    let txt=text196(place,theme,success);
    txt += reward196(place,ch[7],success);
    if(theme==='risk'&&success&&Math.random()<0.22){stats.Health=(stats.Health||0)-r196(1,4); txt+='<br>Er zat wel risico aan; je lichaam voelde het.'; type='warn';}
    result196(ch[0],ch[1],txt,stats,type);
  };
  const oldRun196=window.dlc187Run || null;
  window.dlc187Run=function(place,id){
    place=norm196(place);
    if(vacationActivity196(place,id))return;
    if(oldRun196)return oldRun196(place,id);
    return toast196('Deze activiteit is nog niet gekoppeld.');
  };
  window.vacationOpenActivity196=window.vacationActivity196;
  window.VACATION_ACTIVITY_TEXTS_COUNT196=720;
})();
