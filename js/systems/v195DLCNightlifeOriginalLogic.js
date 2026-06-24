
/* v19.5 DLC Nightlife Original Logic Rework
   Rebuilds vacation nightlife around original BitzLife club logic:
   venue -> drink / meet / flirt / fun / number / date / one-night stand.
   Includes 360 place-specific text variations.
*/
(function(){
  const VAC_TEXT195 = {
  "spain": {
    "drink": [
      "Ik bestelde een drankje in Tapasbar La Luna. De rode lampen, tapasgeur en laat Spaans lawaai maakte de avond meteen losser.",
      "Ik nam een rondje aan de bar. Lucía lachte om mijn keuze en het gesprek begon vanzelf.",
      "De bartender schonk iets sterks in. Even voelde alles makkelijk, maar mijn stamina betaalde de rekening.",
      "Ik deed rustig aan met drank en keek hoe de avond om mij heen steeds chaotischer werd.",
      "Ik kreeg een drankje aangeboden door Carmen. Het voelde gezellig, maar ik bleef scherp.",
      "Ik proostte met een groep locals. De sfeer was warm en mijn social batterij ging omhoog.",
      "Ik nam net één drankje te veel. Leuk op het moment, minder leuk voor mijn health.",
      "De muziek werd beter na het eerste drankje, of mijn oordeel werd slechter. Allebei kan.",
      "Ik raakte aan de praat bij de bar en vergat bijna waarom ik alleen binnenkwam.",
      "Ik koos een veilige drinkavond: genoeg sfeer, geen totale zelfvernietiging."
    ],
    "fun": [
      "Ik ging dansen alsof niemand mij kende. Helaas kenden sommige mensen mij daarna juist wel.",
      "Ik bleef hangen bij de muziek en had onverwacht veel lol met een groep vreemden.",
      "De avond werd dom, luid en precies daardoor leuk.",
      "Ik deed mee aan een gesprek dat nergens over ging en toch de hele avond droeg.",
      "Ik lachte zo hard om een slechte grap dat de mensen naast mij ook begonnen te lachen.",
      "Ik belandde midden in de drukte en vergat even alle normale levensstress.",
      "Ik maakte een foto die waarschijnlijk morgen gênant is, maar nu voelde het iconisch.",
      "Ik koos voor plezier zonder drama. Soms is dat de beste avond.",
      "Ik deed mee met de vibe van Flamenco Basement en kwam met meer energie terug dan verwacht.",
      "Ik had zo'n avond waarop niets groots gebeurt, maar je later toch glimlacht."
    ],
    "meet": [
      "Ik ontmoette Sofia. Haar vibe was flamenco-energie en het gesprek voelde meteen niet standaard.",
      "Lucía vroeg waar ik vandaan kwam. Voor ik het wist stonden we tien minuten te praten.",
      "Ik raakte aan de praat met Elena bij Flamenco Basement. Er was een kleine klik.",
      "Valeria maakte een opmerking over de muziek en ik kon het niet laten om te reageren.",
      "Ik botste bijna tegen Carmen aan. Het werd geen ruzie, maar een gesprek.",
      "Een groep locals trok mij het gesprek in en Marta bleef het langst hangen.",
      "Ik ontmoette Rosa; niet meteen liefde, maar wel genoeg chemie om nieuwsgierig te worden.",
      "Isabella lachte om iets wat ik zei. Misschien beleefd, misschien echt. Ik nam de winst.",
      "Ik sprak Nuria kort, maar het voelde alsof er meer in zat.",
      "Tussen alle drukte viel Paula ineens op. Soms kiest de avond zelf iemand uit."
    ],
    "flirt": [
      "Ik flirtte met Sofia. Ze glimlachte, keek weg en kwam daarna toch weer terug.",
      "Ik gaf Lucía een compliment. Niet te glad, net genoeg om spanning te maken.",
      "Ik vroeg Elena om haar nummer. Ze twijfelde even en gaf het toen toch.",
      "Ik probeerde charmant te zijn bij Valeria. Het werkte beter dan mijn normale niveau.",
      "Het gesprek met Carmen werd speelser. De klikscore ging duidelijk omhoog.",
      "Ik maakte een grapje tegen Marta en ze lachte harder dan nodig was. Dat voelde als winst.",
      "Ik vroeg of Rosa later nog wilde appen. Ze zei ja, maar wel met zo'n blik die mij testte.",
      "Ik stond met Isabella te praten terwijl de rest van de club wazig werd.",
      "Ik flirtte te direct. Nuria vond het blijkbaar juist grappig.",
      "Ik hield het relaxed met Paula. Geen druk, wel spanning."
    ],
    "intimate": [
      "De chemie met Sofia was duidelijk. De avond werd intiem, volwassen en wederzijds.",
      "Lucía en ik verdwenen uit de drukte. Het bleef respectvol, maar de spanning was echt.",
      "Het werd een one-night stand met Elena. Geen belofte, wel een sterke herinnering.",
      "Ik en Valeria kozen bewust voor een intieme avond. Alles voelde veilig en wederzijds.",
      "De flirt met Carmen ging verder dan alleen praten. De avond eindigde volwassen en spannend.",
      "Marta wilde geen relatiegedoe, maar de klik was te sterk om te negeren.",
      "We spraken duidelijk af wat we wilden. Daarna werd de avond intiem zonder drama.",
      "De vibe met Isabella was er. Geen grafische details, wel een duidelijke volwassen nacht.",
      "Nuria bleef nog even hangen na het uitgaan. De spanning had geen uitleg meer nodig.",
      "Het bleef bij die ene nacht met Paula, maar het was wel een verhaal dat blijft hangen."
    ],
    "awkward": [
      "Ik maakte een opmerking die in mijn hoofd beter klonk. De stilte daarna deed pijn.",
      "Lucía glimlachte beleefd, maar de klik was weg voordat hij echt begon.",
      "Ik vroeg om een nummer en kreeg een vriendelijke nee. Pijnlijk, maar duidelijk.",
      "De vibe met Valeria was er niet. Ik trok mij terug zonder drama.",
      "Ik probeerde te flirten, maar kwam over alsof ik een klantenservice-script las.",
      "Marta keek even naar haar vrienden en ik wist genoeg.",
      "Het gesprek viel dood door een grap die niemand had moeten maken.",
      "Ik dacht dat het spannend was, maar Isabella dacht vooral aan naar huis gaan.",
      "Mijn timing was slecht. De avond ging door, maar niet met mij als hoofdpersonage.",
      "Ik nam de afwijzing sportief. Niet elke poging hoeft een film te worden."
    ]
  },
  "america": {
    "drink": [
      "Ik bestelde een drankje in Sports Bar Overtime. De neonborden, sportshirts en veel te grote drankjes maakte de avond meteen losser.",
      "Ik nam een rondje aan de bar. Maddie lachte om mijn keuze en het gesprek begon vanzelf.",
      "De bartender schonk iets sterks in. Even voelde alles makkelijk, maar mijn stamina betaalde de rekening.",
      "Ik deed rustig aan met drank en keek hoe de avond om mij heen steeds chaotischer werd.",
      "Ik kreeg een drankje aangeboden door Taylor. Het voelde gezellig, maar ik bleef scherp.",
      "Ik proostte met een groep locals. De sfeer was warm en mijn social batterij ging omhoog.",
      "Ik nam net één drankje te veel. Leuk op het moment, minder leuk voor mijn health.",
      "De muziek werd beter na het eerste drankje, of mijn oordeel werd slechter. Allebei kan.",
      "Ik raakte aan de praat bij de bar en vergat bijna waarom ik alleen binnenkwam.",
      "Ik koos een veilige drinkavond: genoeg sfeer, geen totale zelfvernietiging."
    ],
    "fun": [
      "Ik ging dansen alsof niemand mij kende. Helaas kenden sommige mensen mij daarna juist wel.",
      "Ik bleef hangen bij de muziek en had onverwacht veel lol met een groep vreemden.",
      "De avond werd dom, luid en precies daardoor leuk.",
      "Ik deed mee aan een gesprek dat nergens over ging en toch de hele avond droeg.",
      "Ik lachte zo hard om een slechte grap dat de mensen naast mij ook begonnen te lachen.",
      "Ik belandde midden in de drukte en vergat even alle normale levensstress.",
      "Ik maakte een foto die waarschijnlijk morgen gênant is, maar nu voelde het iconisch.",
      "Ik koos voor plezier zonder drama. Soms is dat de beste avond.",
      "Ik deed mee met de vibe van Roadhouse Saloon en kwam met meer energie terug dan verwacht.",
      "Ik had zo'n avond waarop niets groots gebeurt, maar je later toch glimlacht."
    ],
    "meet": [
      "Ik ontmoette Jess. Haar vibe was Hollywood zelfvertrouwen en het gesprek voelde meteen niet standaard.",
      "Maddie vroeg waar ik vandaan kwam. Voor ik het wist stonden we tien minuten te praten.",
      "Ik raakte aan de praat met Ashley bij Roadhouse Saloon. Er was een kleine klik.",
      "Brianna maakte een opmerking over de muziek en ik kon het niet laten om te reageren.",
      "Ik botste bijna tegen Taylor aan. Het werd geen ruzie, maar een gesprek.",
      "Een groep locals trok mij het gesprek in en Skylar bleef het langst hangen.",
      "Ik ontmoette Megan; niet meteen liefde, maar wel genoeg chemie om nieuwsgierig te worden.",
      "Hailey lachte om iets wat ik zei. Misschien beleefd, misschien echt. Ik nam de winst.",
      "Ik sprak Riley kort, maar het voelde alsof er meer in zat.",
      "Tussen alle drukte viel Brooke ineens op. Soms kiest de avond zelf iemand uit."
    ],
    "flirt": [
      "Ik flirtte met Jess. Ze glimlachte, keek weg en kwam daarna toch weer terug.",
      "Ik gaf Maddie een compliment. Niet te glad, net genoeg om spanning te maken.",
      "Ik vroeg Ashley om haar nummer. Ze twijfelde even en gaf het toen toch.",
      "Ik probeerde charmant te zijn bij Brianna. Het werkte beter dan mijn normale niveau.",
      "Het gesprek met Taylor werd speelser. De klikscore ging duidelijk omhoog.",
      "Ik maakte een grapje tegen Skylar en ze lachte harder dan nodig was. Dat voelde als winst.",
      "Ik vroeg of Megan later nog wilde appen. Ze zei ja, maar wel met zo'n blik die mij testte.",
      "Ik stond met Hailey te praten terwijl de rest van de club wazig werd.",
      "Ik flirtte te direct. Riley vond het blijkbaar juist grappig.",
      "Ik hield het relaxed met Brooke. Geen druk, wel spanning."
    ],
    "intimate": [
      "De chemie met Jess was duidelijk. De avond werd intiem, volwassen en wederzijds.",
      "Maddie en ik verdwenen uit de drukte. Het bleef respectvol, maar de spanning was echt.",
      "Het werd een one-night stand met Ashley. Geen belofte, wel een sterke herinnering.",
      "Ik en Brianna kozen bewust voor een intieme avond. Alles voelde veilig en wederzijds.",
      "De flirt met Taylor ging verder dan alleen praten. De avond eindigde volwassen en spannend.",
      "Skylar wilde geen relatiegedoe, maar de klik was te sterk om te negeren.",
      "We spraken duidelijk af wat we wilden. Daarna werd de avond intiem zonder drama.",
      "De vibe met Hailey was er. Geen grafische details, wel een duidelijke volwassen nacht.",
      "Riley bleef nog even hangen na het uitgaan. De spanning had geen uitleg meer nodig.",
      "Het bleef bij die ene nacht met Brooke, maar het was wel een verhaal dat blijft hangen."
    ],
    "awkward": [
      "Ik maakte een opmerking die in mijn hoofd beter klonk. De stilte daarna deed pijn.",
      "Maddie glimlachte beleefd, maar de klik was weg voordat hij echt begon.",
      "Ik vroeg om een nummer en kreeg een vriendelijke nee. Pijnlijk, maar duidelijk.",
      "De vibe met Brianna was er niet. Ik trok mij terug zonder drama.",
      "Ik probeerde te flirten, maar kwam over alsof ik een klantenservice-script las.",
      "Skylar keek even naar haar vrienden en ik wist genoeg.",
      "Het gesprek viel dood door een grap die niemand had moeten maken.",
      "Ik dacht dat het spannend was, maar Hailey dacht vooral aan naar huis gaan.",
      "Mijn timing was slecht. De avond ging door, maar niet met mij als hoofdpersonage.",
      "Ik nam de afwijzing sportief. Niet elke poging hoeft een film te worden."
    ]
  },
  "japan": {
    "drink": [
      "Ik bestelde een drankje in Izakaya Lantern. De neon, treingeluiden en karaoke uit een kamer verderop maakte de avond meteen losser.",
      "Ik nam een rondje aan de bar. Yumi lachte om mijn keuze en het gesprek begon vanzelf.",
      "De bartender schonk iets sterks in. Even voelde alles makkelijk, maar mijn stamina betaalde de rekening.",
      "Ik deed rustig aan met drank en keek hoe de avond om mij heen steeds chaotischer werd.",
      "Ik kreeg een drankje aangeboden door Emi. Het voelde gezellig, maar ik bleef scherp.",
      "Ik proostte met een groep locals. De sfeer was warm en mijn social batterij ging omhoog.",
      "Ik nam net één drankje te veel. Leuk op het moment, minder leuk voor mijn health.",
      "De muziek werd beter na het eerste drankje, of mijn oordeel werd slechter. Allebei kan.",
      "Ik raakte aan de praat bij de bar en vergat bijna waarom ik alleen binnenkwam.",
      "Ik koos een veilige drinkavond: genoeg sfeer, geen totale zelfvernietiging."
    ],
    "fun": [
      "Ik ging dansen alsof niemand mij kende. Helaas kenden sommige mensen mij daarna juist wel.",
      "Ik bleef hangen bij de muziek en had onverwacht veel lol met een groep vreemden.",
      "De avond werd dom, luid en precies daardoor leuk.",
      "Ik deed mee aan een gesprek dat nergens over ging en toch de hele avond droeg.",
      "Ik lachte zo hard om een slechte grap dat de mensen naast mij ook begonnen te lachen.",
      "Ik belandde midden in de drukte en vergat even alle normale levensstress.",
      "Ik maakte een foto die waarschijnlijk morgen gênant is, maar nu voelde het iconisch.",
      "Ik koos voor plezier zonder drama. Soms is dat de beste avond.",
      "Ik deed mee met de vibe van Akihabara Arcade Bar en kwam met meer energie terug dan verwacht.",
      "Ik had zo'n avond waarop niets groots gebeurt, maar je later toch glimlacht."
    ],
    "meet": [
      "Ik ontmoette Aiko. Haar vibe was rustige glimlach en het gesprek voelde meteen niet standaard.",
      "Yumi vroeg waar ik vandaan kwam. Voor ik het wist stonden we tien minuten te praten.",
      "Ik raakte aan de praat met Hana bij Akihabara Arcade Bar. Er was een kleine klik.",
      "Sakura maakte een opmerking over de muziek en ik kon het niet laten om te reageren.",
      "Ik botste bijna tegen Emi aan. Het werd geen ruzie, maar een gesprek.",
      "Een groep locals trok mij het gesprek in en Rina bleef het langst hangen.",
      "Ik ontmoette Nana; niet meteen liefde, maar wel genoeg chemie om nieuwsgierig te worden.",
      "Mika lachte om iets wat ik zei. Misschien beleefd, misschien echt. Ik nam de winst.",
      "Ik sprak Yuna kort, maar het voelde alsof er meer in zat.",
      "Tussen alle drukte viel Haruka ineens op. Soms kiest de avond zelf iemand uit."
    ],
    "flirt": [
      "Ik flirtte met Aiko. Ze glimlachte, keek weg en kwam daarna toch weer terug.",
      "Ik gaf Yumi een compliment. Niet te glad, net genoeg om spanning te maken.",
      "Ik vroeg Hana om haar nummer. Ze twijfelde even en gaf het toen toch.",
      "Ik probeerde charmant te zijn bij Sakura. Het werkte beter dan mijn normale niveau.",
      "Het gesprek met Emi werd speelser. De klikscore ging duidelijk omhoog.",
      "Ik maakte een grapje tegen Rina en ze lachte harder dan nodig was. Dat voelde als winst.",
      "Ik vroeg of Nana later nog wilde appen. Ze zei ja, maar wel met zo'n blik die mij testte.",
      "Ik stond met Mika te praten terwijl de rest van de club wazig werd.",
      "Ik flirtte te direct. Yuna vond het blijkbaar juist grappig.",
      "Ik hield het relaxed met Haruka. Geen druk, wel spanning."
    ],
    "intimate": [
      "De chemie met Aiko was duidelijk. De avond werd intiem, volwassen en wederzijds.",
      "Yumi en ik verdwenen uit de drukte. Het bleef respectvol, maar de spanning was echt.",
      "Het werd een one-night stand met Hana. Geen belofte, wel een sterke herinnering.",
      "Ik en Sakura kozen bewust voor een intieme avond. Alles voelde veilig en wederzijds.",
      "De flirt met Emi ging verder dan alleen praten. De avond eindigde volwassen en spannend.",
      "Rina wilde geen relatiegedoe, maar de klik was te sterk om te negeren.",
      "We spraken duidelijk af wat we wilden. Daarna werd de avond intiem zonder drama.",
      "De vibe met Mika was er. Geen grafische details, wel een duidelijke volwassen nacht.",
      "Yuna bleef nog even hangen na het uitgaan. De spanning had geen uitleg meer nodig.",
      "Het bleef bij die ene nacht met Haruka, maar het was wel een verhaal dat blijft hangen."
    ],
    "awkward": [
      "Ik maakte een opmerking die in mijn hoofd beter klonk. De stilte daarna deed pijn.",
      "Yumi glimlachte beleefd, maar de klik was weg voordat hij echt begon.",
      "Ik vroeg om een nummer en kreeg een vriendelijke nee. Pijnlijk, maar duidelijk.",
      "De vibe met Sakura was er niet. Ik trok mij terug zonder drama.",
      "Ik probeerde te flirten, maar kwam over alsof ik een klantenservice-script las.",
      "Rina keek even naar haar vrienden en ik wist genoeg.",
      "Het gesprek viel dood door een grap die niemand had moeten maken.",
      "Ik dacht dat het spannend was, maar Mika dacht vooral aan naar huis gaan.",
      "Mijn timing was slecht. De avond ging door, maar niet met mij als hoofdpersonage.",
      "Ik nam de afwijzing sportief. Niet elke poging hoeft een film te worden."
    ]
  },
  "amsterdam": {
    "drink": [
      "Ik bestelde een drankje in Canal Bar. De grachten, regen op straat en veel fietsen buiten de bar maakte de avond meteen losser.",
      "Ik nam een rondje aan de bar. Noa lachte om mijn keuze en het gesprek begon vanzelf.",
      "De bartender schonk iets sterks in. Even voelde alles makkelijk, maar mijn stamina betaalde de rekening.",
      "Ik deed rustig aan met drank en keek hoe de avond om mij heen steeds chaotischer werd.",
      "Ik kreeg een drankje aangeboden door Fleur. Het voelde gezellig, maar ik bleef scherp.",
      "Ik proostte met een groep locals. De sfeer was warm en mijn social batterij ging omhoog.",
      "Ik nam net één drankje te veel. Leuk op het moment, minder leuk voor mijn health.",
      "De muziek werd beter na het eerste drankje, of mijn oordeel werd slechter. Allebei kan.",
      "Ik raakte aan de praat bij de bar en vergat bijna waarom ik alleen binnenkwam.",
      "Ik koos een veilige drinkavond: genoeg sfeer, geen totale zelfvernietiging."
    ],
    "fun": [
      "Ik ging dansen alsof niemand mij kende. Helaas kenden sommige mensen mij daarna juist wel.",
      "Ik bleef hangen bij de muziek en had onverwacht veel lol met een groep vreemden.",
      "De avond werd dom, luid en precies daardoor leuk.",
      "Ik deed mee aan een gesprek dat nergens over ging en toch de hele avond droeg.",
      "Ik lachte zo hard om een slechte grap dat de mensen naast mij ook begonnen te lachen.",
      "Ik belandde midden in de drukte en vergat even alle normale levensstress.",
      "Ik maakte een foto die waarschijnlijk morgen gênant is, maar nu voelde het iconisch.",
      "Ik koos voor plezier zonder drama. Soms is dat de beste avond.",
      "Ik deed mee met de vibe van Comedy Lounge en kwam met meer energie terug dan verwacht.",
      "Ik had zo'n avond waarop niets groots gebeurt, maar je later toch glimlacht."
    ],
    "meet": [
      "Ik ontmoette Lisa. Haar vibe was droge Amsterdamse humor en het gesprek voelde meteen niet standaard.",
      "Noa vroeg waar ik vandaan kwam. Voor ik het wist stonden we tien minuten te praten.",
      "Ik raakte aan de praat met Eva bij Comedy Lounge. Er was een kleine klik.",
      "Sanne maakte een opmerking over de muziek en ik kon het niet laten om te reageren.",
      "Ik botste bijna tegen Fleur aan. Het werd geen ruzie, maar een gesprek.",
      "Een groep locals trok mij het gesprek in en Lotte bleef het langst hangen.",
      "Ik ontmoette Nina; niet meteen liefde, maar wel genoeg chemie om nieuwsgierig te worden.",
      "Roos lachte om iets wat ik zei. Misschien beleefd, misschien echt. Ik nam de winst.",
      "Ik sprak Maud kort, maar het voelde alsof er meer in zat.",
      "Tussen alle drukte viel Tess ineens op. Soms kiest de avond zelf iemand uit."
    ],
    "flirt": [
      "Ik flirtte met Lisa. Ze glimlachte, keek weg en kwam daarna toch weer terug.",
      "Ik gaf Noa een compliment. Niet te glad, net genoeg om spanning te maken.",
      "Ik vroeg Eva om haar nummer. Ze twijfelde even en gaf het toen toch.",
      "Ik probeerde charmant te zijn bij Sanne. Het werkte beter dan mijn normale niveau.",
      "Het gesprek met Fleur werd speelser. De klikscore ging duidelijk omhoog.",
      "Ik maakte een grapje tegen Lotte en ze lachte harder dan nodig was. Dat voelde als winst.",
      "Ik vroeg of Nina later nog wilde appen. Ze zei ja, maar wel met zo'n blik die mij testte.",
      "Ik stond met Roos te praten terwijl de rest van de club wazig werd.",
      "Ik flirtte te direct. Maud vond het blijkbaar juist grappig.",
      "Ik hield het relaxed met Tess. Geen druk, wel spanning."
    ],
    "intimate": [
      "De chemie met Lisa was duidelijk. De avond werd intiem, volwassen en wederzijds.",
      "Noa en ik verdwenen uit de drukte. Het bleef respectvol, maar de spanning was echt.",
      "Het werd een one-night stand met Eva. Geen belofte, wel een sterke herinnering.",
      "Ik en Sanne kozen bewust voor een intieme avond. Alles voelde veilig en wederzijds.",
      "De flirt met Fleur ging verder dan alleen praten. De avond eindigde volwassen en spannend.",
      "Lotte wilde geen relatiegedoe, maar de klik was te sterk om te negeren.",
      "We spraken duidelijk af wat we wilden. Daarna werd de avond intiem zonder drama.",
      "De vibe met Roos was er. Geen grafische details, wel een duidelijke volwassen nacht.",
      "Maud bleef nog even hangen na het uitgaan. De spanning had geen uitleg meer nodig.",
      "Het bleef bij die ene nacht met Tess, maar het was wel een verhaal dat blijft hangen."
    ],
    "awkward": [
      "Ik maakte een opmerking die in mijn hoofd beter klonk. De stilte daarna deed pijn.",
      "Noa glimlachte beleefd, maar de klik was weg voordat hij echt begon.",
      "Ik vroeg om een nummer en kreeg een vriendelijke nee. Pijnlijk, maar duidelijk.",
      "De vibe met Sanne was er niet. Ik trok mij terug zonder drama.",
      "Ik probeerde te flirten, maar kwam over alsof ik een klantenservice-script las.",
      "Lotte keek even naar haar vrienden en ik wist genoeg.",
      "Het gesprek viel dood door een grap die niemand had moeten maken.",
      "Ik dacht dat het spannend was, maar Roos dacht vooral aan naar huis gaan.",
      "Mijn timing was slecht. De avond ging door, maar niet met mij als hoofdpersonage.",
      "Ik nam de afwijzing sportief. Niet elke poging hoeft een film te worden."
    ]
  },
  "jamaica": {
    "drink": [
      "Ik bestelde een drankje in Beach Bar Sunset. De zand aan je schoenen, reggae in de lucht en warm licht maakte de avond meteen losser.",
      "Ik nam een rondje aan de bar. Kayla lachte om mijn keuze en het gesprek begon vanzelf.",
      "De bartender schonk iets sterks in. Even voelde alles makkelijk, maar mijn stamina betaalde de rekening.",
      "Ik deed rustig aan met drank en keek hoe de avond om mij heen steeds chaotischer werd.",
      "Ik kreeg een drankje aangeboden door Maya. Het voelde gezellig, maar ik bleef scherp.",
      "Ik proostte met een groep locals. De sfeer was warm en mijn social batterij ging omhoog.",
      "Ik nam net één drankje te veel. Leuk op het moment, minder leuk voor mijn health.",
      "De muziek werd beter na het eerste drankje, of mijn oordeel werd slechter. Allebei kan.",
      "Ik raakte aan de praat bij de bar en vergat bijna waarom ik alleen binnenkwam.",
      "Ik koos een veilige drinkavond: genoeg sfeer, geen totale zelfvernietiging."
    ],
    "fun": [
      "Ik ging dansen alsof niemand mij kende. Helaas kenden sommige mensen mij daarna juist wel.",
      "Ik bleef hangen bij de muziek en had onverwacht veel lol met een groep vreemden.",
      "De avond werd dom, luid en precies daardoor leuk.",
      "Ik deed mee aan een gesprek dat nergens over ging en toch de hele avond droeg.",
      "Ik lachte zo hard om een slechte grap dat de mensen naast mij ook begonnen te lachen.",
      "Ik belandde midden in de drukte en vergat even alle normale levensstress.",
      "Ik maakte een foto die waarschijnlijk morgen gênant is, maar nu voelde het iconisch.",
      "Ik koos voor plezier zonder drama. Soms is dat de beste avond.",
      "Ik deed mee met de vibe van Reggae Lounge en kwam met meer energie terug dan verwacht.",
      "Ik had zo'n avond waarop niets groots gebeurt, maar je later toch glimlacht."
    ],
    "meet": [
      "Ik ontmoette Aaliyah. Haar vibe was zonnige lach en het gesprek voelde meteen niet standaard.",
      "Kayla vroeg waar ik vandaan kwam. Voor ik het wist stonden we tien minuten te praten.",
      "Ik raakte aan de praat met Shanice bij Reggae Lounge. Er was een kleine klik.",
      "Tiana maakte een opmerking over de muziek en ik kon het niet laten om te reageren.",
      "Ik botste bijna tegen Maya aan. Het werd geen ruzie, maar een gesprek.",
      "Een groep locals trok mij het gesprek in en Jada bleef het langst hangen.",
      "Ik ontmoette Naomi; niet meteen liefde, maar wel genoeg chemie om nieuwsgierig te worden.",
      "Leah lachte om iets wat ik zei. Misschien beleefd, misschien echt. Ik nam de winst.",
      "Ik sprak Imani kort, maar het voelde alsof er meer in zat.",
      "Tussen alle drukte viel Zara ineens op. Soms kiest de avond zelf iemand uit."
    ],
    "flirt": [
      "Ik flirtte met Aaliyah. Ze glimlachte, keek weg en kwam daarna toch weer terug.",
      "Ik gaf Kayla een compliment. Niet te glad, net genoeg om spanning te maken.",
      "Ik vroeg Shanice om haar nummer. Ze twijfelde even en gaf het toen toch.",
      "Ik probeerde charmant te zijn bij Tiana. Het werkte beter dan mijn normale niveau.",
      "Het gesprek met Maya werd speelser. De klikscore ging duidelijk omhoog.",
      "Ik maakte een grapje tegen Jada en ze lachte harder dan nodig was. Dat voelde als winst.",
      "Ik vroeg of Naomi later nog wilde appen. Ze zei ja, maar wel met zo'n blik die mij testte.",
      "Ik stond met Leah te praten terwijl de rest van de club wazig werd.",
      "Ik flirtte te direct. Imani vond het blijkbaar juist grappig.",
      "Ik hield het relaxed met Zara. Geen druk, wel spanning."
    ],
    "intimate": [
      "De chemie met Aaliyah was duidelijk. De avond werd intiem, volwassen en wederzijds.",
      "Kayla en ik verdwenen uit de drukte. Het bleef respectvol, maar de spanning was echt.",
      "Het werd een one-night stand met Shanice. Geen belofte, wel een sterke herinnering.",
      "Ik en Tiana kozen bewust voor een intieme avond. Alles voelde veilig en wederzijds.",
      "De flirt met Maya ging verder dan alleen praten. De avond eindigde volwassen en spannend.",
      "Jada wilde geen relatiegedoe, maar de klik was te sterk om te negeren.",
      "We spraken duidelijk af wat we wilden. Daarna werd de avond intiem zonder drama.",
      "De vibe met Leah was er. Geen grafische details, wel een duidelijke volwassen nacht.",
      "Imani bleef nog even hangen na het uitgaan. De spanning had geen uitleg meer nodig.",
      "Het bleef bij die ene nacht met Zara, maar het was wel een verhaal dat blijft hangen."
    ],
    "awkward": [
      "Ik maakte een opmerking die in mijn hoofd beter klonk. De stilte daarna deed pijn.",
      "Kayla glimlachte beleefd, maar de klik was weg voordat hij echt begon.",
      "Ik vroeg om een nummer en kreeg een vriendelijke nee. Pijnlijk, maar duidelijk.",
      "De vibe met Tiana was er niet. Ik trok mij terug zonder drama.",
      "Ik probeerde te flirten, maar kwam over alsof ik een klantenservice-script las.",
      "Jada keek even naar haar vrienden en ik wist genoeg.",
      "Het gesprek viel dood door een grap die niemand had moeten maken.",
      "Ik dacht dat het spannend was, maar Leah dacht vooral aan naar huis gaan.",
      "Mijn timing was slecht. De avond ging door, maar niet met mij als hoofdpersonage.",
      "Ik nam de afwijzing sportief. Niet elke poging hoeft een film te worden."
    ]
  },
  "nightcity": {
    "drink": [
      "Ik bestelde een drankje in Neon Pit. De rookmachines, neon en mensen die te veel geheimen hebben maakte de avond meteen losser.",
      "Ik nam een rondje aan de bar. Nova lachte om mijn keuze en het gesprek begon vanzelf.",
      "De bartender schonk iets sterks in. Even voelde alles makkelijk, maar mijn stamina betaalde de rekening.",
      "Ik deed rustig aan met drank en keek hoe de avond om mij heen steeds chaotischer werd.",
      "Ik kreeg een drankje aangeboden door Jinx. Het voelde gezellig, maar ik bleef scherp.",
      "Ik proostte met een groep locals. De sfeer was warm en mijn social batterij ging omhoog.",
      "Ik nam net één drankje te veel. Leuk op het moment, minder leuk voor mijn health.",
      "De muziek werd beter na het eerste drankje, of mijn oordeel werd slechter. Allebei kan.",
      "Ik raakte aan de praat bij de bar en vergat bijna waarom ik alleen binnenkwam.",
      "Ik koos een veilige drinkavond: genoeg sfeer, geen totale zelfvernietiging."
    ],
    "fun": [
      "Ik ging dansen alsof niemand mij kende. Helaas kenden sommige mensen mij daarna juist wel.",
      "Ik bleef hangen bij de muziek en had onverwacht veel lol met een groep vreemden.",
      "De avond werd dom, luid en precies daardoor leuk.",
      "Ik deed mee aan een gesprek dat nergens over ging en toch de hele avond droeg.",
      "Ik lachte zo hard om een slechte grap dat de mensen naast mij ook begonnen te lachen.",
      "Ik belandde midden in de drukte en vergat even alle normale levensstress.",
      "Ik maakte een foto die waarschijnlijk morgen gênant is, maar nu voelde het iconisch.",
      "Ik koos voor plezier zonder drama. Soms is dat de beste avond.",
      "Ik deed mee met de vibe van Afterlife Basement en kwam met meer energie terug dan verwacht.",
      "Ik had zo'n avond waarop niets groots gebeurt, maar je later toch glimlacht."
    ],
    "meet": [
      "Ik ontmoette Vex. Haar vibe was neon-mysterie en het gesprek voelde meteen niet standaard.",
      "Nova vroeg waar ik vandaan kwam. Voor ik het wist stonden we tien minuten te praten.",
      "Ik raakte aan de praat met Misty bij Afterlife Basement. Er was een kleine klik.",
      "Raven maakte een opmerking over de muziek en ik kon het niet laten om te reageren.",
      "Ik botste bijna tegen Jinx aan. Het werd geen ruzie, maar een gesprek.",
      "Een groep locals trok mij het gesprek in en Kira bleef het langst hangen.",
      "Ik ontmoette Lux; niet meteen liefde, maar wel genoeg chemie om nieuwsgierig te worden.",
      "Nyx lachte om iets wat ik zei. Misschien beleefd, misschien echt. Ik nam de winst.",
      "Ik sprak Echo kort, maar het voelde alsof er meer in zat.",
      "Tussen alle drukte viel Zara ineens op. Soms kiest de avond zelf iemand uit."
    ],
    "flirt": [
      "Ik flirtte met Vex. Ze glimlachte, keek weg en kwam daarna toch weer terug.",
      "Ik gaf Nova een compliment. Niet te glad, net genoeg om spanning te maken.",
      "Ik vroeg Misty om haar nummer. Ze twijfelde even en gaf het toen toch.",
      "Ik probeerde charmant te zijn bij Raven. Het werkte beter dan mijn normale niveau.",
      "Het gesprek met Jinx werd speelser. De klikscore ging duidelijk omhoog.",
      "Ik maakte een grapje tegen Kira en ze lachte harder dan nodig was. Dat voelde als winst.",
      "Ik vroeg of Lux later nog wilde appen. Ze zei ja, maar wel met zo'n blik die mij testte.",
      "Ik stond met Nyx te praten terwijl de rest van de club wazig werd.",
      "Ik flirtte te direct. Echo vond het blijkbaar juist grappig.",
      "Ik hield het relaxed met Zara. Geen druk, wel spanning."
    ],
    "intimate": [
      "De chemie met Vex was duidelijk. De avond werd intiem, volwassen en wederzijds.",
      "Nova en ik verdwenen uit de drukte. Het bleef respectvol, maar de spanning was echt.",
      "Het werd een one-night stand met Misty. Geen belofte, wel een sterke herinnering.",
      "Ik en Raven kozen bewust voor een intieme avond. Alles voelde veilig en wederzijds.",
      "De flirt met Jinx ging verder dan alleen praten. De avond eindigde volwassen en spannend.",
      "Kira wilde geen relatiegedoe, maar de klik was te sterk om te negeren.",
      "We spraken duidelijk af wat we wilden. Daarna werd de avond intiem zonder drama.",
      "De vibe met Nyx was er. Geen grafische details, wel een duidelijke volwassen nacht.",
      "Echo bleef nog even hangen na het uitgaan. De spanning had geen uitleg meer nodig.",
      "Het bleef bij die ene nacht met Zara, maar het was wel een verhaal dat blijft hangen."
    ],
    "awkward": [
      "Ik maakte een opmerking die in mijn hoofd beter klonk. De stilte daarna deed pijn.",
      "Nova glimlachte beleefd, maar de klik was weg voordat hij echt begon.",
      "Ik vroeg om een nummer en kreeg een vriendelijke nee. Pijnlijk, maar duidelijk.",
      "De vibe met Raven was er niet. Ik trok mij terug zonder drama.",
      "Ik probeerde te flirten, maar kwam over alsof ik een klantenservice-script las.",
      "Kira keek even naar haar vrienden en ik wist genoeg.",
      "Het gesprek viel dood door een grap die niemand had moeten maken.",
      "Ik dacht dat het spannend was, maar Nyx dacht vooral aan naar huis gaan.",
      "Mijn timing was slecht. De avond ging door, maar niet met mij als hoofdpersonage.",
      "Ik nam de afwijzing sportief. Niet elke poging hoeft een film te worden."
    ]
  }
};
  const VAC_PLACE195 = {
  "spain": {
    "label": "Spanje",
    "icon": "🇪🇸",
    "venues": [
      [
        "🥘",
        "Tapasbar La Luna",
        "klein, warm, veel locals en Spaanse muziek"
      ],
      [
        "🌃",
        "Madrid Rooftop",
        "duur, mooi uitzicht en grotere kans op flirten"
      ],
      [
        "💃",
        "Flamenco Basement",
        "dans, ritme, lawaai en intense sfeer"
      ]
    ],
    "names": [
      "Sofia",
      "Lucía",
      "Elena",
      "Valeria",
      "Carmen",
      "Marta",
      "Rosa",
      "Isabella",
      "Nuria",
      "Paula"
    ],
    "vibes": [
      "flamenco-energie",
      "zomerse charme",
      "directe humor",
      "La Liga-passie",
      "mysterieuze blik"
    ],
    "scene": "rode lampen, tapasgeur en laat Spaans lawaai"
  },
  "america": {
    "label": "Amerika / USA",
    "icon": "🇺🇸",
    "venues": [
      [
        "🍺",
        "Sports Bar Overtime",
        "grote schermen, lawaai en veel sportfans"
      ],
      [
        "🎬",
        "Hollywood Rooftop",
        "glamour, contentmakers en dure drankjes"
      ],
      [
        "🤠",
        "Roadhouse Saloon",
        "country, burgers, pooltafel en chaotische locals"
      ]
    ],
    "names": [
      "Jess",
      "Maddie",
      "Ashley",
      "Brianna",
      "Taylor",
      "Skylar",
      "Megan",
      "Hailey",
      "Riley",
      "Brooke"
    ],
    "vibes": [
      "Hollywood zelfvertrouwen",
      "sportbar-bravoure",
      "roadtrip-chaos",
      "open glimlach",
      "directe flirt"
    ],
    "scene": "neonborden, sportshirts en veel te grote drankjes"
  },
  "japan": {
    "label": "Japan / Tokyo",
    "icon": "🇯🇵",
    "venues": [
      [
        "🍶",
        "Izakaya Lantern",
        "klein, druk, warm en vol gesprekken"
      ],
      [
        "🎤",
        "Shibuya Karaoke Box",
        "privé-kamer, karaoke en veel schaamteverlies"
      ],
      [
        "🕹️",
        "Akihabara Arcade Bar",
        "games, gacha, neon en rare drankjes"
      ]
    ],
    "names": [
      "Aiko",
      "Yumi",
      "Hana",
      "Sakura",
      "Emi",
      "Rina",
      "Nana",
      "Mika",
      "Yuna",
      "Haruka"
    ],
    "vibes": [
      "rustige glimlach",
      "arcade-energie",
      "shibuya-style",
      "droge humor",
      "verlegen maar nieuwsgierig"
    ],
    "scene": "neon, treingeluiden en karaoke uit een kamer verderop"
  },
  "amsterdam": {
    "label": "Amsterdam",
    "icon": "🌉",
    "venues": [
      [
        "🍻",
        "Canal Bar",
        "klein, druk en vlak bij het water"
      ],
      [
        "🎧",
        "Club Noord",
        "donkere dansvloer, harde bas en jonge crowd"
      ],
      [
        "😂",
        "Comedy Lounge",
        "minder dansen, meer praten en lachen"
      ]
    ],
    "names": [
      "Lisa",
      "Noa",
      "Eva",
      "Sanne",
      "Fleur",
      "Lotte",
      "Nina",
      "Roos",
      "Maud",
      "Tess"
    ],
    "vibes": [
      "droge Amsterdamse humor",
      "festivalenergie",
      "nuchtere blik",
      "creatieve vibe",
      "brutale glimlach"
    ],
    "scene": "grachten, regen op straat en veel fietsen buiten de bar"
  },
  "jamaica": {
    "label": "Jamaica",
    "icon": "🇯🇲",
    "venues": [
      [
        "🍹",
        "Beach Bar Sunset",
        "strand, cocktails en warme avondlucht"
      ],
      [
        "💃",
        "Dancehall Yard",
        "dans, bass en veel energie"
      ],
      [
        "🎸",
        "Reggae Lounge",
        "live muziek, rustige vibe en locals"
      ]
    ],
    "names": [
      "Aaliyah",
      "Kayla",
      "Shanice",
      "Tiana",
      "Maya",
      "Jada",
      "Naomi",
      "Leah",
      "Imani",
      "Zara"
    ],
    "vibes": [
      "zonnige lach",
      "dancehall-energy",
      "relaxed vertrouwen",
      "muzikale klik",
      "strandflirt"
    ],
    "scene": "zand aan je schoenen, reggae in de lucht en warm licht"
  },
  "nightcity": {
    "label": "Night City",
    "icon": "🌃",
    "venues": [
      [
        "🍸",
        "Neon Pit",
        "donker, luid, gevaarlijk en vol neon"
      ],
      [
        "🕶️",
        "Chrome Lounge",
        "duur, koel en vol shady contacten"
      ],
      [
        "🎛️",
        "Afterlife Basement",
        "underground bass, rook en riskante vibes"
      ]
    ],
    "names": [
      "Vex",
      "Nova",
      "Misty",
      "Raven",
      "Jinx",
      "Kira",
      "Lux",
      "Nyx",
      "Echo",
      "Zara"
    ],
    "vibes": [
      "neon-mysterie",
      "gevaarlijke glimlach",
      "cyberpunk-stijl",
      "koude zelfverzekerdheid",
      "onvoorspelbare energie"
    ],
    "scene": "rookmachines, neon en mensen die te veel geheimen hebben"
  }
};

  function r195(a,b){return Math.floor(Math.random()*(b-a+1))+a}
  function pick195(a){return a[Math.floor(Math.random()*a.length)]}
  function clamp195(v,min=0,max=100){return Math.max(min,Math.min(max,Math.round(v||0)))}
  function money195(v){try{return money(v)}catch(e){return '€ '+Math.round(v||0).toLocaleString('nl-NL')}}
  function toast195(t){try{toast(t)}catch(e){console.log(t)}}
  function save195(){try{safeSave()}catch(e){}try{render()}catch(e){}}
  function norm195(x){
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
  function label195(p){p=norm195(p);return {enkhuizen:'Enkhuizen',amsterdam:'Amsterdam',spain:'Spanje',america:'Amerika / USA',japan:'Japan / Tokyo',jamaica:'Jamaica',nightcity:'Night City'}[p]||p}
  function rr195(icon,title,sub,fn,locked=false,cls=''){
    try{return row(icon,title,sub,fn,locked,cls)}catch(e){
      return `<div class="row ${locked?'locked':''} ${cls||''}" onclick="${locked?'':fn}"><div class="rIco">${icon}</div><div><div class="rTitle">${title}</div><div class="sub">${sub||''}</div></div><div class="chev">›</div></div>`;
    }
  }
  function relBar195(v){try{return relationBar(v)}catch(e){return `<div class="effectBar190Track"><div class="effectBar190Fill good" style="width:${clamp195(v)}%"></div></div>`}}
  function dlc195(place){
    place=norm195(place);
    state.dlcTravel=state.dlcTravel||{};
    state.dlcTravel[place]=state.dlcTravel[place]||{days:0,vibe:50,contacts:0,souvenirs:0,spent:0,memories:0,party:0,localRep:0,romance:0};
    return state.dlcTravel[place];
  }
  function apply195(stats){
    stats=stats||{};
    try{applyStats(stats)}catch(e){}
    state.stats=state.stats||{};
    Object.keys(stats).forEach(k=>{
      const d=stats[k]; if(!d)return;
      if(['Happiness','Health','Smarts','Looks'].includes(k))state.stats[k]=clamp195((state.stats[k]??50)+d);
      if(k==='Happiness'&&typeof state.happiness==='number')state.happiness=clamp195(state.happiness+d);
      if(k==='Health'&&typeof state.health==='number')state.health=clamp195(state.health+d);
      if(k==='Smarts'&&typeof state.smarts==='number')state.smarts=clamp195(state.smarts+d);
      if(k==='Looks'&&typeof state.looks==='number')state.looks=clamp195(state.looks+d);
      if(k==='Fitness')state.fitness=clamp195((state.fitness??50)+d);
      if(k==='Stamina')state.stamina=clamp195((state.stamina??50)+d);
      if(k==='Social')state.social=clamp195((state.social??0)+d,0,999999);
      if(k==='Fame')state.fame=clamp195((state.fame??0)+d,0,999999);
    });
  }
  function fx195(stats){
    stats=stats||{};
    return Object.keys(stats).filter(k=>stats[k]).map(k=>k+' '+(stats[k]>0?'+':'')+stats[k]).join(' · ');
  }
  function result195(icon,title,text,stats,cash=0,type='good'){
    stats=stats||{};
    if(cash)state.money=(state.money||0)+cash;
    apply195(stats);
    const fx=fx195(stats);
    try{addLog('<b>'+title+'</b><br>'+text+(fx?'<br><span class="mini">Effect: '+fx+'</span>':''),type,false)}catch(e){}
    try{
      showModal(`<div class="modalTop"><div class="avatar">${icon}</div><div class="modalTitle">${title}</div></div><div class="modalBody"><p>${text}</p>${fx?`<div class="vac187-effect">Effect: ${fx}</div>`:''}<button class="btn" onclick="closeModal()">Verder</button></div>`);
    }catch(e){toast195(title)}
    save195();
  }
  function spend195(place,cost){
    cost=cost||0;
    if((state.money||0)<cost){toast195('Niet genoeg geld: '+money195(cost));return false}
    state.money-=cost;
    const d=dlc195(place); d.spent=(d.spent||0)+cost;
    return true;
  }
  function contacts195(place){
    state.vacationContacts=state.vacationContacts||[];
    place=norm195(place);
    return state.vacationContacts.filter(c=>norm195(c.place)===place);
  }
  function newContact195(place,source='uitgaan'){
    place=norm195(place);
    const cfg=VAC_PLACE195[place]||VAC_PLACE195.amsterdam;
    const age=Math.max(18,(state.age||18)+r195(-2,5));
    const name=pick195(cfg.names);
    const c={id:'vc195_'+Date.now()+'_'+r195(100,999),name,place,age,gender:'female',rel:r195(30,65),attraction:r195(35,88),phone:false,romance:0,intimate:false,source,metAge:state.age,icon:'👩'};
    state.vacationContacts=state.vacationContacts||[];
    state.vacationContacts.push(c);
    return c;
  }
  function addFling195(c,source){
    try{
      const contact={name:c.name,age:c.age,rel:c.rel||45,chem:c.attraction||50,from:source||'vakantie uitgaan',source:'Vakantie DLC',gender:'female',icon:c.icon||'👩',status:'fling',vacationContactId:c.id};
      if(window.addFling133) addFling133(contact,'vakantie');
      else {
        state.flings=state.flings||[];
        if(!state.flings.some(f=>f.vacationContactId===c.id))state.flings.push(contact);
      }
    }catch(e){}
  }
  function placeText195(place,cat){
    place=norm195(place);
    const arr=(VAC_TEXT195[place]&&VAC_TEXT195[place][cat]) || (VAC_TEXT195.amsterdam&&VAC_TEXT195.amsterdam[cat]) || ['De avond kreeg eindelijk wat leven.'];
    return pick195(arr);
  }
  function venue195(place,i){
    const cfg=VAC_PLACE195[norm195(place)]||VAC_PLACE195.amsterdam;
    return cfg.venues[i]||cfg.venues[0];
  }

  window.vacationNightlife195=function(place){
    place=norm195(place||state.vacation||state.world||'spain');
    if((state.age||0)<16)return toast195('Uitgaan kan vanaf 16 jaar. Drank/flirten/intiem is pas 18+.');
    const cfg=VAC_PLACE195[place]||VAC_PLACE195.amsterdam;
    let out=`<div class="card"><b>${cfg.icon} ${label195(place)} uitgaan</b><br>Kies eerst waar je naartoe gaat. Daarna krijg je normale BitzLife-achtige opties: drinken, chick versieren, lol hebben, mensen ontmoeten, nummer vragen en eventueel een one-night stand.</div>`;
    out += `<div class="section">Locaties</div>`;
    cfg.venues.forEach((v,i)=>{
      out += rr195(v[0],v[1],v[2]+` · entry ${money195(25+i*25)}`,`vacationVenue195('${place}',${i})`);
    });
    out += `<button class="btn alt" onclick="vacationHub180('${place}')">Terug</button>`;
    showModal(`<div class="modalTop"><div class="avatar">🌃</div><div class="modalTitle">${label195(place)} nightlife</div></div><div class="modalBody" style="text-align:left">${out}</div>`);
  };
  window.vacationVenue195=function(place,i){
    place=norm195(place); const v=venue195(place,i); const entry=25+i*25;
    if(!spend195(place,entry))return;
    window._vac195Venue={place,index:i,name:v[1],icon:v[0],entry};
    const cfg=VAC_PLACE195[place]||VAC_PLACE195.amsterdam;
    let out=`<div class="card"><b>${v[0]} ${v[1]}</b><br>${v[2]}<br><span class="mini">${cfg.scene}</span></div>`;
    out += rr195('🍺','Drinken','Drankjes nemen zoals in de originele uitgaan-flow',`vacationClubDo195('${place}',${i},'drink')`,(state.age||0)<18);
    out += rr195('💃','Chick versieren','Profiel, klikscore, nummer of one-night stand proberen',`vacationClubDo195('${place}',${i},'chick')`,(state.age||0)<18);
    out += rr195('😂','Lol hebben','Dansen, lachen, domme avond, kans op nieuwe vriend/contact',`vacationClubDo195('${place}',${i},'fun')`);
    out += rr195('👥','Mensen ontmoeten','Locals/toeristen leren kennen en contacten opbouwen',`vacationClubDo195('${place}',${i},'meet')`);
    out += rr195('🧃','Rustig socializen','Veilige optie: minder risico, kleine social boost',`vacationClubDo195('${place}',${i},'safe')`);
    out += `<button class="btn alt" onclick="vacationNightlife195('${place}')">Andere locatie</button>`;
    showModal(`<div class="modalTop"><div class="avatar">${v[0]}</div><div class="modalTitle">${v[1]}</div></div><div class="modalBody" style="text-align:left">${out}</div>`);
  };
  window.vacationClubDo195=function(place,i,kind){
    place=norm195(place); const v=venue195(place,i); const cost=r195(20+i*10,70+i*25);
    if(kind==='drink'){
      if((state.age||0)<18)return toast195('Drinken is 18+.');
      if(!spend195(place,cost))return;
      const over=Math.random()<0.22;
      try{if(window.recordSubstance)recordSubstance('alcohol',over?2:1)}catch(e){}
      state.addiction=state.addiction||{}; state.addiction.alcoholBuzz=true; state.addiction.underInfluence=true;
      const txt=placeText195(place,'drink');
      const stats=over?{Happiness:3,Health:-7,Stamina:-12,Smarts:-2,Social:5}:{Happiness:7,Health:-2,Stamina:-5,Social:7};
      const d=dlc195(place); d.party=(d.party||0)+1; d.memories=(d.memories||0)+1; d.vibe=clamp195((d.vibe||50)+r195(2,6));
      return result195('🍺','Drinken in '+v[1],txt,stats,0,over?'warn':'good');
    }
    if(kind==='fun'){
      if(!spend195(place,Math.round(cost*.75)))return;
      const d=dlc195(place); d.party=(d.party||0)+1; d.memories=(d.memories||0)+1; d.vibe=clamp195((d.vibe||50)+r195(3,8));
      if(Math.random()<0.35){const c=newContact195(place,'lol hebben'); c.phone=Math.random()<0.35; d.contacts=(d.contacts||0)+1;}
      return result195('😂','Lol hebben in '+v[1],placeText195(place,'fun'),{Happiness:r195(8,14),Health:-1,Stamina:-6,Looks:1,Social:5},0,'good');
    }
    if(kind==='meet'){
      if(!spend195(place,Math.round(cost*.5)))return;
      const c=newContact195(place,'mensen ontmoeten');
      const d=dlc195(place); d.contacts=(d.contacts||0)+1; d.memories=(d.memories||0)+1; d.vibe=clamp195((d.vibe||50)+r195(2,6));
      const txt=placeText195(place,'meet').replace(/Sofia|Lucía|Elena|Valeria|Carmen|Marta|Rosa|Isabella|Nuria|Paula|Jess|Maddie|Ashley|Brianna|Taylor|Skylar|Megan|Hailey|Riley|Brooke|Aiko|Yumi|Hana|Sakura|Emi|Rina|Nana|Mika|Yuna|Haruka|Lisa|Noa|Eva|Sanne|Fleur|Lotte|Nina|Roos|Maud|Tess|Aaliyah|Kayla|Shanice|Tiana|Maya|Jada|Naomi|Leah|Imani|Zara|Vex|Nova|Misty|Raven|Jinx|Kira|Lux|Nyx|Echo/g,c.name);
      return result195('👥','Mensen ontmoet',txt,{Happiness:4,Social:8,Stamina:-2},0,'good');
    }
    if(kind==='safe'){
      if(!spend195(place,10))return;
      return result195('🧃','Rustig socializen',`Ik hield het rustig in ${v[1]}. Geen drama, wel een paar gesprekken en genoeg sfeer om de avond nuttig te maken.`,{Happiness:4,Social:4,Health:1,Stamina:2},0,'good');
    }
    if(kind==='chick')return vacationChickProfile195(place,i);
  };
  window.vacationChickProfile195=function(place,i){
    place=norm195(place); const v=venue195(place,i); const cfg=VAC_PLACE195[place]||VAC_PLACE195.amsterdam;
    if((state.age||0)<18)return toast195('Chick versieren / romance is 18+.');
    const age=Math.max(18,(state.age||18)+r195(-2,5));
    const girl={id:'vc195_temp_'+Date.now(),name:pick195(cfg.names),place,age,gender:'female',icon:'👩',looks:r195(35,98),smarts:r195(20,92),vibe:pick195(cfg.vibes),click:r195(25,95),venue:v[1],venueIndex:i,rel:r195(30,60),attraction:r195(40,90),phone:false,romance:0};
    window._vac195Person=girl;
    const base=Math.round((girl.click+girl.looks+(state.stats?.Looks||50)+(state.stats?.Happiness||50))/4);
    let out=`<div class="card"><b>${girl.name}</b><br>Vrouw · ${girl.age} jaar<br>Locatie: ${v[1]}<br>Looks: ${girl.looks}% ${relBar195(girl.looks)}<br>Vibe: ${girl.vibe}<br>Klikscore: ${girl.click}% ${relBar195(girl.click)}<br>Kans: ${clamp195(base,10,95)}%</div>`;
    out += rr195('📱','Nummer vragen / flirten','Veilige route: kans op vacation contact of fling',`vacationAskNumber195()`);
    out += rr195('💞','Date voorstellen','Samen iets drinken/eten of wandelen',`vacationAskDate195()`);
    out += rr195('🔥','One-night stand proberen','Alleen als chemie hoog genoeg is; volwassen en consensueel',`vacationTryONS195()`);
    out += rr195('👋','Laat haar gaan','Geen drama, terug naar de locatie',`vacationVenue195('${place}',${i})`);
    showModal(`<div class="modalTop"><div class="avatar">${girl.icon}</div><div class="modalTitle">${girl.name}</div></div><div class="modalBody" style="text-align:left">${out}</div>`);
  };
  function persistPerson195(girl,source){
    state.vacationContacts=state.vacationContacts||[];
    let existing=state.vacationContacts.find(c=>c.id===girl.id || (c.name===girl.name && norm195(c.place)===norm195(girl.place)));
    if(!existing){
      existing={id:'vc195_'+Date.now()+'_'+r195(100,999),name:girl.name,place:girl.place,age:girl.age,gender:'female',rel:girl.rel||45,attraction:girl.attraction||girl.click||50,phone:!!girl.phone,romance:girl.romance||0,intimate:!!girl.intimate,source,metAge:state.age,icon:girl.icon||'👩'};
      state.vacationContacts.push(existing);
    } else {
      existing.rel=clamp195((existing.rel||45)+(girl.relBoost||0));
      existing.attraction=clamp195(Math.max(existing.attraction||0,girl.attraction||0));
      existing.phone=existing.phone||!!girl.phone;
      existing.romance=clamp195((existing.romance||0)+(girl.romanceBoost||0));
    }
    return existing;
  }
  window.vacationAskNumber195=function(){
    const girl=window._vac195Person;if(!girl)return toast195('Geen profiel gevonden.');
    const place=norm195(girl.place); const cost=r195(15,60);
    if(!spend195(place,cost))return;
    const base=(girl.click+girl.looks+(state.stats?.Looks||50)+(state.stats?.Happiness||50))/4 + (state.social?Math.min(20,state.social/30):0);
    const ok=Math.random()*100<clamp195(base+10,10,92);
    const d=dlc195(place);
    if(ok){
      girl.phone=true; girl.relBoost=r195(6,14); girl.romanceBoost=r195(3,8);
      const c=persistPerson195(girl,'nummer gevraagd');
      addFling195(c,'vakantie nummer');
      d.contacts=(d.contacts||0)+1; d.romance=(d.romance||0)+1; d.memories=(d.memories||0)+1;
      return result195('📱','Nummer gekregen',placeText195(place,'flirt')+` Ze gaf haar nummer. Ze staat nu als vakantiecontact/fling opgeslagen.`,{Happiness:8,Looks:1,Social:8,Stamina:-3},0,'good');
    } else {
      return result195('📱','Geen nummer gekregen',placeText195(place,'awkward'),{Happiness:-4,Looks:-1,Social:1,Stamina:-2},0,'bad');
    }
  };
  window.vacationAskDate195=function(){
    const girl=window._vac195Person;if(!girl)return toast195('Geen profiel gevonden.');
    const place=norm195(girl.place); const cost=r195(40,120);
    if(!spend195(place,cost))return;
    const base=(girl.click+girl.looks+(state.stats?.Looks||50)+(state.stats?.Happiness||50))/4;
    const ok=Math.random()*100<clamp195(base,10,88);
    const d=dlc195(place);
    if(ok){
      girl.phone=true; girl.relBoost=r195(10,18); girl.romanceBoost=r195(10,20);
      const c=persistPerson195(girl,'date voorgesteld');
      d.contacts=(d.contacts||0)+1; d.romance=(d.romance||0)+1; d.memories=(d.memories||0)+1;
      return result195('💞','Date geregeld',`Ik stelde een date voor aan ${girl.name}. Ze vond het leuk en we spraken af om later nog iets te drinken of te wandelen.`,{Happiness:9,Social:10,Looks:1,Stamina:-4},0,'good');
    } else {
      return result195('💞','Date afgewezen',`${girl.name} vond het gesprek prima, maar wilde geen date plannen.`,{Happiness:-3,Social:2,Stamina:-2},0,'warn');
    }
  };
  window.vacationTryONS195=function(){
    const girl=window._vac195Person;if(!girl)return toast195('Geen profiel gevonden.');
    if((state.age||0)<18)return toast195('One-night stand is 18+.');
    const place=norm195(girl.place); const cost=r195(50,170);
    if(!spend195(place,cost))return;
    const base=(girl.click+girl.looks+(state.stats?.Looks||50)+(state.stats?.Happiness||50))/4;
    const ok=Math.random()*100<clamp195(base-8,8,82);
    const d=dlc195(place);
    if(ok){
      girl.phone=Math.random()<0.45; girl.intimate=true; girl.relBoost=r195(4,12); girl.romanceBoost=r195(14,28);
      const c=persistPerson195(girl,'one-night stand');
      c.intimate=true;
      addFling195(c,'vakantie one-night stand');
      d.romance=(d.romance||0)+2; d.memories=(d.memories||0)+1;
      const txt=placeText195(place,'intimate') + (girl.phone?' We wisselden daarna nog nummers uit.':' Daarna bleef het bij die ene nacht.');
      return result195('🔥','One-night stand',txt,{Happiness:14,Looks:2,Health:Math.random()<0.25?-2:0,Stamina:-14,Social:5},0,'good');
    } else {
      return result195('🔥','Vibe was er niet',placeText195(place,'awkward'),{Happiness:-7,Looks:-1,Stamina:-5},0,'bad');
    }
  };

  window.dlc187Nightlife=function(place){return vacationNightlife195(place)};
  window.vacationPeople195=function(place){return vacationNightlife195(place)};

  const oldVacationHub195=window.vacationHub180 || null;
  window.vacationHub180=function(place){
    place=norm195(place||state.vacation||state.world||'spain');
    if(oldVacationHub195)oldVacationHub195(place);
    setTimeout(()=>{
      try{
        const body=document.querySelector('#modal .modalBody');
        if(!body||body.innerHTML.includes('Origineel uitgaan'))return;
        const sec=document.createElement('div');
        sec.innerHTML=`<div class="section">Origineel uitgaan</div>${rr195('🌃','Uitgaan zoals origineel','Discotheek kiezen → drinken, chick versieren, lol hebben, mensen ontmoeten',`vacationNightlife195('${place}')`)}`;
        const firstTravel=[...body.querySelectorAll('.section')].find(x=>/Reizen/i.test(x.textContent||''));
        if(firstTravel)body.insertBefore(sec,firstTravel); else body.insertBefore(sec,body.querySelector('button.btn.alt')||null);
      }catch(e){}
    },0);
  };
  window.spainHub180=function(){vacationHub180('spain')};
  window.alkmaarHub180=window.spainHub180;
  window.usaHub180=function(){vacationHub180('america')};
  window.japanHub180=function(){vacationHub180('japan')};
  window.amsterdamHub180=function(){vacationHub180('amsterdam')};
  window.jamaicaHub180=function(){vacationHub180('jamaica')};
  window.nightCityVacationHub180=function(){vacationHub180('nightcity')};

  const oldActivities195=window.activitiesHTML || (typeof activitiesHTML==='function'?activitiesHTML:null);
  window.activitiesHTML=function(){
    let h=oldActivities195?oldActivities195():'';
    if(state.vacation){
      const place=norm195(state.vacation);
      if(!h.includes('Origineel uitgaan')){
        const rowHtml=`<div class="section">Origineel uitgaan</div>${rr195('🌃','Uitgaan zoals origineel','Discotheek kiezen → drinken, chick versieren, lol hebben, mensen ontmoeten',`vacationNightlife195('${place}')`)}`;
        if(h.includes('<div class="section">Reizen</div>'))h=h.replace('<div class="section">Reizen</div>',rowHtml+'<div class="section">Reizen</div>');
        else h+=rowHtml;
      }
    }
    return h;
  };
  try{activitiesHTML=window.activitiesHTML}catch(e){}

  window.VACATION_TEXTS_COUNT195 = 360;
})();
