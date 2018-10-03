// need a better, more generalized approach to class weapon lists

DG.setupHyperborea = function(){
  DG.source.characterClasses = DG.stock.hyperborea.characterClasses;
  DG.source.races = DG.stock.hyperborea.races;
  DG.source.fighterClasses = DG.stock.hyperborea.fighterClasses;
  DG.source.mageClasses = DG.stock.hyperborea.mageClasses;
  DG.source.druidClasses = ["druid"];
  DG.source.monkClasses = ["monk"];
  DG.source.unarmoredClasses = DG.stock.hyperborea.unarmoredClasses;
  DG.source.lightArmoredClasses = DG.stock.hyperborea.lightArmoredClasses;
  DG.source.mediumArmoredClasses = DG.stock.hyperborea.mediumArmoredClasses;
  DG.source.heavyArmoredClasses = DG.stock.hyperborea.heavyArmoredClasses;
  DG.source.monkWeapons = [ "Fists", "Spear", "Daggers", "Sword", "Staff", "Jittes", "Tonfa", "Dagger"];
  DG.source.servantWeapons = ["Knife", "Dagger", "Fists", "Fists", "Handaxe", "Staff", "Cudgel", "Club"];
  DG.source.mageWeapons = [ "Daggers", "Staff", "Staff & Dagger"];
  DG.source.druidWeapons = ["Knife", "Dagger", "Spear", "Sickle", "Shortsword","Handaxe", "Staff", "Cudgel", "Club", "Bow"];
}
DG.setupClassic = function(){
  DG.source.characterClasses = DG.stock.characterClasses;
  DG.source.races = DG.stock.humanWeightedPcRaces;
  DG.source.fighterClasses = ["barbarian", "fighter", "ranger", "paladin"];
  DG.source.mageClasses = ["wizard", "sorceror", "warlock", "illusionist"];
  DG.source.druidClasses = ["druid"];
  DG.source.monkClasses = ["monk"];
  DG.source.unarmoredClasses = DG.stock.unarmoredClasses;
  DG.source.lightArmoredClasses = DG.stock.lightArmoredClasses;
  DG.source.mediumArmoredClasses = DG.stock.mediumArmoredClasses;
  DG.source.heavyArmoredClasses = DG.stock.heavyArmoredClasses;
  DG.source.monkWeapons = [ "Fists", "Spear", "Daggers", "Sword", "Staff", "Jittes", "Tonfa", "Dagger"];
  DG.source.servantWeapons = ["Knife", "Dagger", "Fists", "Fists", "Handaxe", "Staff", "Cudgel", "Club"];
  DG.source.mageWeapons = [ "Daggers", "Staff", "Staff & Dagger"];
  DG.source.druidWeapons = ["Knife", "Dagger", "Spear", "Sickle", "Shortsword","Handaxe", "Staff", "Cudgel", "Club", "Bow"];
}
DG.data.settlements = [];
DG.data.organizations = [];
DG.source = {};

DG.setSource = function(checked){
  DG.hyperborea = checked;
  if (DG.hyperborea){
    DG.setupHyperborea();
  }
  else {
    DG.setupClassic();
  }
};
DG.setSource($('#hyperborea').is(':checked'));

DG.source.mercenaryArmors = DG.stock.mercenaryArmors;
DG.source.allArmors = DG.stock.allArmors;
DG.source.lightArmors = DG.stock.lightArmors;
DG.source.servantArmors = DG.stock.servantArmors;
DG.source.weaponSet = DG.stock.weaponSet;
DG.source.servantSkills = [
    "Porter",
    "Torchbearer",
    "Porter",
    "Torchbearer",
    "Porter",
    "Torchbearer",
    "Charcoal burner",
    "Farmer",
    "Farmhand",
    "Sailor",
    "Ne'er do well",
    "Lout",
    "Lackey",
    "Cook",
    "Trapper",
    "Scholar",
    "Muleteer",
    "Crafter",
    "Barber Surgeon",
    "Dogsbody",
    "Domestic"
  ];

  DG.source.mercenarySkills = [
    "Mercenary",
    "Soldier",
    "Guard",
    "Mercenary",
    "Soldier",
    "Guard",
    "Bandit",
    "Brigand",
    "Thug",
    "Huntsman",
    "Hunter",
    "Warrior",
    "Graverobber",
    "Berserk",
    "Armsman",
    "Guide",
    "Pirate"
  ];

HR = {
  rollStats: function(){
    var staLine;
    HR.stats.str = DG.roll3d6();
    HR.stats.int = DG.roll3d6();
    HR.stats.wis = DG.roll3d6();
    HR.stats.con = DG.roll3d6();
    HR.stats.dex = DG.roll3d6();
    HR.stats.cha = DG.roll3d6();
    HR.stats.class = "";
    HR.stats.level = 1;
    HR.stats.hp = 0;
    statLine = "STR " + HR.stats.str + "  INT " + HR.stats.int + "  WIS " + HR.stats.wis +
    "  CON " + HR.stats.con + "  DEX " + HR.stats.dex + "  CHA " + HR.stats.cha
    return statLine;
  },
  stats:{
    str: 0,
    int: 0,
    wis: 0,
    con: 0,
    dex: 0,
    cha: 0,
    hp: 0,
    ac: 0
  },
  addToList: function(guy){
    var oldVal;
    oldVal = $("#list").val();
    $("#list").val(oldVal + guy);
  },
  add10guys: function(){
    var list;
    var guy;
    for (gc = 1; gc <= 10; gc++){
      guy = HR.oneGuy();
      HR.addToList(guy);
    }
  },
  generate1d6guys: function(){
    var list;
    list = "";
    var maxcnt = DG.roll1d6();
     for (gc = 1; gc <= maxcnt; gc++){
      guy = HR.oneGuy();
      HR.addToList(guy);
    }
  },
  del: function del(){ return "\n"},
  skills: function skills (type){
    if (type === "servant"){
      return DG.drawOne(DG.source.servantSkills);
    } else if (type === "mercenary"){ return DG.drawOne(DG.source.mercenarySkills); }
    else { // levelled
      HR.stats.level = DG.roll3d4low();
      HR.stats.class =  DG.drawOne( DG.source.characterClasses );
      return  DG.capFirstChar(HR.stats.class) + " " + HR.stats.level;
    }
  },
  personality: function(){
    if (DG.rollThree() ){ return DG.drawOne(DG.stock.allAttitudes) + " " ; }
    else {return ""};
  },
  reason: function(){ if (DG.rollFour()){return ""}
   return "" + HR.del() + "Reason to hire on: " + DG.drawOne([
     "Needs the money to eat",
     "Nearly broke",
     "Bloodthirsty",
     "Tired of living",
     "Thrill seeker",
     "Runaway",
     "Pursued",
     "Accursed",
     "Drunken courage",
     "On a dare",
     "Lonely",
     "Needs to get out of town",
     "In debt",
     "Curiosity",
     "Family issues",
     "Heartbroken",
     "Romantic complications",
     "Looking for a lucky break",
     "Heard the PC band has a racket going",
     "Wants to learn the path to the dungeon",
     "Agent on a mission",
     "Flat broke",
     "Drinking buddy of PC",
     "Friend of PC",
     "Attracted to a PC",
     "Finds something admirable about a PC",
     "Wants revenge on a PC",
     "Enjoys violence",
     "Doppelganger",
     "To spy on the party for someone powerful",
     "Cultist with a mission",
     "Proselytizer",
     "Wants vengeance on something in the dungeon",
     "Wants to take something particular from the dungeon",
     "Dreams of glory",
     "A god demands it",
     "The voices whisper about it",
     "Wants to steal something particular from a PC",
     "Wants to rob the party",
     "Needs a meaning in life",
     "Wants to become an adventurer",
     "Vampire bitten, starting to hunger and wants to find a place in the dungeon out of the light",
     "Lycanthrope bitten and feels the change coming on",
     "A personal quest"
  ]);
  },
  race: function(){ return DG.capFirstChar(DG.drawOne(DG.source.races) ); },
  armor: function(type){
    var armorType = "";
     if (type === "servant"){ armorType = DG.drawOne(DG.source.servantArmors); }
     else if (type === "mercenary"){ armorType = DG.drawOne(DG.source.mercenaryArmors); }
     else if (DG.includes( DG.source.unarmoredClasses, HR.stats.class)) { armorType = DG.drawOne( DG.source.servantArmors ); }
     else if (DG.includes( DG.source.lightArmoredClasses, HR.stats.class)) { armorType = DG.drawOne( DG.source.lightArmors ); }
     else if (DG.includes( DG.source.mediumArmoredClasses, HR.stats.class)) { armorType = DG.drawOne( DG.source.mediumArmors ); }
     else if (DG.includes( DG.source.heavyArmoredClasses, HR.stats.class)) { armorType = DG.drawOne( DG.source.allArmors ); }
     else { armorType = DG.drawOne(DG.source.mercenaryArmors); } // missed a class?
     return DG.capFirstChar(armorType);
  },
  conBonus: function(){
    var con = HR.stats.con;
    var b
    switch (con){
      case 3:
      case 4:
      case 5:
        b = -2;
        break;
      case 6:
      case 7:
      case 8:
        b = -1;
        break;
      case 9:
      case 10:
      case 11:
      case 12:
        b = 0;
        break;
      case 13:
      case 14:
      case 15:
        b = +1;
        break;
      case 16:
      case 17:
        b = +2;
        break;
      case 18:
        b = +3;
        break;
      default: console.log("Found no bonus for constitution of " + b);
    }

    return b
  },
  rollHp: function(type){

    if (type === "servant") {HR.stats.hp = DG.roll1d6();}
    else if (type === "mercenary") {HR.stats.hp = DG.roll1d6() + 1;}
    else{
      for (var die = 1; die <= HR.stats.level; die++){
        if (DG.includes(DG.source.fighterClasses,HR.stats.class))
        { HR.stats.hp +=  DG.rollDie(1,8);}
        else { HR.stats.hp +=  DG.roll1d6(); }
      }
    }
    HR.stats.hp += HR.stats.level * HR.conBonus();
    if (HR.stats.hp < 1){HR.stats.hp = 1;}
    return HR.stats.hp;
  },
  weapons: function(type){
    if (type === "servant") {
      return DG.drawOne(DG.source.servantWeapons);
    } else if (DG.includes(DG.source.mageClasses,HR.stats.class)){
      return DG.drawOne(DG.source.mageWeapons);
    } else if (DG.includes(DG.source.druidClasses,HR.stats.class)){
      return DG.drawOne(DG.source.druidWeapons);
    } else if (DG.includes(DG.source.monkClasses,HR.stats.class)){
      return DG.drawOne(DG.source.monkWeapons);
    } else {
      return DG.source.weaponSet(); }
  },

  oneGuy: function(){
    var guy = "";
    var stats = HR.rollStats()  + HR.del();

    var name = DG.wiki(DG.characterName()) + ", " ;
    var type = DG.drawOne(["servant","servant","servant","mercenary","mercenary","mercenary","mercenary","leveled"]);
    var reason = HR.reason();
    var personality = HR.personality();
    var skills = HR.skills(type)  + HR.del();
    var race = HR.race() + " " ;
    var weapons = HR.weapons(type) + ", ";
    var hp = HR.rollHp();
    var derived = "HP: " + hp + HR.del();
    var armor = HR.armor(type);

    guy = name + personality + race + skills + stats + derived + weapons + armor + reason  + HR.del()  + HR.del();
    return guy;
  }
}

$( document ).ready(function() {

  $("#generate1d6").on("click", function(){HR.generate1d6guys();});
  $("#add10").on("click", function(){HR.add10guys();});
  $("#hyperborea").on("click", function(){DG.setSource($("#hyperborea").is(':checked'))})

});
