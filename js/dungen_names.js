DG.names = {
  begin: [
    "An",
    "Tor",
    "Van",
    "Kan",
    "Ben",
    "Wes",
    "Cas",
    "Dor",
    "Ed",
    "Ena",
    "Den",
    "Wil",
    "Bic",
    "Bri",
    "Red",
    "Blac",
    "Whit",
    "Grun",
    "Gel",
    "What",
    "Gha",
    "Hen",
    "Dav",
    "Le",
    "Stu",
    "Av",
    "Aa",
    "Jo",
    "Ja",
    "Jar",
    "Jor",
    "Lan",
    "Ji",
    "Cha",
    "Cho",
    "Ano",
    "Atri",
    "Cen",
    "Ce",
    "Co",
    "Aesc",
    "Zor",
    "Wulf",
    "Bo",
    "Bil",
    "Bi",
    "Ba",
    "Ha",
    "Hen",
    "He",
    "Hi",
    "Ro",
    "Ri",
    "Sin",
    "Sten",
    "Va",
    "Vil",
    "As",
    "Es",
    "Ban",
    "Nic",
    "No",
    "Omer",
    "Otho",
    "Gan",
    "Fro",
    "Sa",
    "Sta",
    "Sto",
    "Stro",
    "Sti",
    "Stri",
    "Nin",
    "Ne",
    "Ga",
    "Pele",
    "Cos",
    "Fid",
    "Mer",
    "Ald",
    "Gai",
    "Win",
    "Thor",
    "Gho",
    "Gor",
    "Nor",
    "Que",
    "Qui",
    "Quo",
    "Re",
    "Ri",
    "Zis"
  ],
  end: [
    "ril",
    "rond",
    "ala",
    "dred",
    "mar",
    "son",
    "thor",
    "dor",
    "vil",
    "skand",
    "and",
    "don",
    "vis",
    "kal",
    "lak",
    "van",
    "ma",
    "nis",
    "wain",
    "nor",
    "sud",
    "ben",
    "lor",
    "tin",
    "wil",
    "vela",
    "mersh",
    "okar",
    "try",
    "by",
    "gast",
    "ond",
    "trigg",
    "essa",
    "aisa",
    "tros",
    "eddin",
    "karth",
    "vend",
    "tros",
    "nos",
    "a",
    "ae",
    "e",
    "ty",
    "el",
    "buck",
    "voss",
    "sind",
    "ban",
    "amin",
    "win",
    "stin",
    "vita",
    "mund",
    "zor",
    "azor",
    "vinc",
    "us",
    "zul",
    "ana",
    "omor",
    "omir",
    "ato",
    "ano",
    "dost",
    "ick",
    "wick",
    "anic",
    "wulf",
    "osi"
  ],
  dungeonPlaces: ["dungeon","temple","fortress","caverns","ruins","castle","shrine","entombed city","necropolis","forgotten city","tomb","tombs","palace","mines","crypts"],  // might source from the list of theme tags instead
  iconicNouns: ["sun","moon","sky","mountain","blades","sword","wolf","snake","lost","night"],
  thematicNouns: ["blood","bone","sorcery","flames","fire","ice","shadow"],
  darkEmotions: ["fear",
    "madness",
    "darkness",
    "remorse",
    "terror",
    "pain"],

  dungeonNames:[
    "The {{dungeonPlace,c}} of the {{iconicNoun,c}}",
    "The {{dungeonPlace,c}} of {{thematicNoun,c}}",
    "The {{dungeonPlace,c}} of {{scaryAdjective,c}} {{thematicNoun,c}}",
    "The {{dungeonPlace,c}} of {{darkEmotion,c}}",
    "The {{dungeonPlace,c}} of {{placeName,c}}",
    "{{oldCharName,c}}'s Lair",
    "Lair of the of the {{scaryAdjective,c}} {{bossType,c}}",
    "The {{dungeonPlace,c}} of {{scaryAdjective,c}} {{oldCharName,c}}",
    "The  {{scaryAdjective,c}} {{dungeonPlace,c}} of {{placeName,c}}",
    "{{dungeonPlace,c}} of the {{scaryAdjective,c}} {{bossType,c}}",
    "{{placeName,c}}, {{dungeonPlace,c}} of {{darkEmotion,c}}",
    "{{placeName,c}} {{dungeonPlace,c}}"
  ],
  bossTypes: [
    "lich",
    "wizard",
    "vampire",
    "demon",
    "serpent",
    "devil",
    "dragon",
    "overlord",
    "goddess",
    "king",
    "god",
    "cult"
  ], // might want to source from a boss monster, or include the value generated in the monsters list
  scaryAdjectives: [
      "dark",
      "",
      "ice",
      "elemental",
      "imprisoned",
      "undying",
      "lost",
      "sinister",
      "{{darkColor,c}}",
      "forbidding",
      "eternal",
      "{{bossType}}",
      "corrupted",
      "fallen",
      'iron',
      "shadow",
      "nightmare",
      "deadly",
      "bloody",
      "mad"
  ],
  darkColors: [
    "red",
    "black",
    "purple",
    "midnight",
    "sable",
    "ebon",
    "scarlet",
    "crimson",
    "golden",
    "blood red"
  ]
};
DG.characterNames = [
  "{{firstName}}",
  "{[firstName}} {{lastName}}",
  "{{firstName}} of {{placeName}}",
  "{{firstName}} {{nickname}}",
];

DG.nicknames = [
  " the {{darkColor,c}}",
  " the {{scaryAdjective,c}}"
];

DG.firstName = function(cap){
  var string = DG.drawOne(DG.names.begin) + DG.drawOne(DG.names.end) // needs to build a good string, placeholder
  return DG.toCase(string,cap);
};

DG.lastName = function(cap){
  var string = DG.drawOne(DG.names.begin) + DG.drawOne(DG.names.end) // needs to build a good string, placeholder
  return DG.toCase(string,cap);
};

DG.nickname = function(cap){
  var string = DG.drawOne(DG.nicknames); 
  return DG.toCase(string,cap);
};

DG.dungeonPlace = function(cap){
  var string = DG.drawOne(DG.names.dungeonPlaces);
  return DG.toCase(string,cap);
};

DG.darkColor = function(cap){
  var string = DG.drawOne(DG.names.darkColors);
  return DG.toCase(string,cap);
};

DG.iconicNoun = function(cap){
  var string = DG.drawOne(DG.names.iconicNouns);
  return DG.toCase(string,cap);
};

DG.thematicNoun = function(cap){
  var string = DG.drawOne(DG.names.thematicNouns);
  return DG.toCase(string,cap);
};

DG.darkEmotion = function(cap){
  var string = DG.drawOne(DG.names.darkEmotions);
  return DG.toCase(string,cap);
};

DG.scaryAdjective = function(cap){
  var string = DG.drawOne(DG.names.scaryAdjectives);
  return DG.toCase(string,cap);
};

DG.bossType = function(cap){
  var string = DG.drawOne(DG.names.bossTypes);
  return DG.toCase(string,cap);
};

DG.oldCharName = function(cap){
  var string = DG.drawOne(DG.names.begin) + DG.drawOne(DG.names.end) // needs to build a good string, placeholder
  return DG.toCase(string,cap);
};

DG.placeName = function(cap){
  var string = DG.drawOne(DG.names.begin) + DG.drawOne(DG.names.end) // needs to build a good string, placeholder
  return DG.toCase(string,cap);
};

DG.characterName = function(cap){
  var string = DG.drawOne(DG.characterNames)  // needs to build a good string, placeholder
  return DG.toCase(string,cap);
};


DG.toCase = function(str,cap){
  if (cap === "c"){
     //http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
     return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
  else { return str }
  // can add in downcasing later
};