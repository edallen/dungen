DG.data.settlements = [];
DG.data.organizations = [];
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
  servantSkills: [
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
    "Stablehand", 
    "Crafter", 
    "Barber Surgeon", 
    "Dogsbody", 
    "Domestic" 
   ],
   mercenarySkills: [
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
   ],
  skills: function skills (type){
    if (type === "servant"){
      return DG.drawOne(HR.servantSkills);
    } else if (type === "mercenary"){ return DG.drawOne(HR.mercenarySkills); }
    else { // levelled
      HR.stats.level = DG.roll3d4low();
      HR.stats.class =  DG.capFirstChar(DG.drawOne( DG.stock.characterClasses ));
      return  HR.stats.class + " " + HR.stats.level;
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
     "Lonely",
     "Needs to get out of town",
     "In debt",
     "Curiosity",
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
     "Doppelganger",   
     "To spy on the party for someone powerful",
     "Cultist with a mission",
     "Proselytizer",
     "Wants vengeance on something in the dungeon",
     "Wants to take something particular from the dungeon",
     "Dreams of glory",
     "Wants to steal something particular from a PC",
     "Wants to rob the party",
     "Needs a meaning in life",
     "Wants to become an adventurer",
     "Vampire bitten, starting to hunger and wants to find a place in the dungeon out of the light",
     "Lycanthrope bitten and feels the change coming on",
     "A personal quest"
  ]); 
  },
  race: function(){ return DG.capFirstChar(DG.drawOne([
  "human", 
  "human", 
  "human", 
  "human", 
  "human", 
  "human", 
  "dwarf", 'elf',
  "dwarf", 'elf',
  'halfling','half-elf','gnome','half-orc']) ); },
  armor: function(type){
    var armorType = "";
     if (type === "servant"){ armorType = DG.drawOne(DG.stock.servantArmors); }
     else if (type === "mercenary"){ armorType = DG.drawOne(DG.stock.mercenaryArmors); }
     else if (DG.includes( DG.stock.unarmoredClasses, HR.stats.class)) { armorType = DG.drawOne( DG.stock.servantArmors ); } 
     else if (DG.includes( DG.stock.lightArmoredClasses, HR.stats.class)) { armorType = DG.drawOne( DG.stock.lightArmors ); } 
     else if (DG.includes( DG.stock.heavyArmoredClasses, HR.stats.class)) { armorType = DG.drawOne( DG.stock.allArmors ); }
     else { armorType = DG.drawOne(DG.stock.mercenaryArmors); } // missed a class?
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
        if (DG.includes(["Barbarian", "Fighter", "Ranger", "Paladin"],HR.stats.class))
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
      return DG.drawOne(["Knife", "Dagger", "Fists", "Fists", "Handaxe", "Staff", "Cudgel", "Club"]);
    } else if (DG.includes(["Wizard", "Sorceror", "Warlock", "Illusionist"],HR.stats.class)){
      return DG.drawOne([ "Daggers", "Staff", "Staff, Dagger"]);
    } else {
      // will need to split out druids and monks, but for now...
      return DG.stock.weaponSet(); } 
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

});
