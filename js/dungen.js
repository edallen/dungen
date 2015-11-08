// Ed Allen, started November 08, 2014
// 
// utility added to Array, bad to change primitive prototypes but Array is
// hard to subclass
Array.prototype.remove = function () {
  var what, L = arguments.length, ax;
  while (L && this.length) {
    what = arguments[--L];
    while ((ax = this.indexOf(what)) != -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};
//to remove all of the elements of one array from another, apply the method:
//var a1=[1,2,3,4,5,6], a2=[5,6,7,8,9];
//a1.remove.apply(a1,a2);
// cargo culted from mrhoo answer on Sitepoint:
// http://community.sitepoint.com/t/remove-the-element-from-array-a-if-it-exists-in-array-b/5958

var DG = {
  nodesDataSet: "uninitialized",
  edgesDataSet: "uninitialized",
  // Shared variables
  roomCount: 0,
  edgeCount: 0,
  minRooms: 5,
  maxRooms: 10,
  dungeonLevel: 0,
  monsterTreasureMultiplier: 1,

  clearNotes: function () {
    $("#notes").trigger("clearText");
  },
  scrollToKey: function () {
    var tablePosition = $("#dungeon_key").position();
    var scrollTop = tablePosition.top - 50;
    $("html, body").animate({scrollTop: scrollTop});
  },
  scrollToTop: function () {
    $("html, body").animate({scrollTop: "20px"});
  },
  container: document.getElementById('dungeon'),
  // Text utility functions
  brToLf: function (text) {
    return text.replace(new RegExp('<br\/>', 'g'), '\n').replace(new RegExp('<br>', 'g'), '\n').replace(new RegExp('<br \/>', 'g'), '\n');
  },
  lfToBr: function (text) {
    return text.replace(new RegExp('\r?\n', 'g'), '<br>');
  },

  // Randomization Utilities -----------------------------------------------------------------
  rollDie: function (start, size) {
    return Math.floor(Math.random() * (size)) + start;
  },
  rollOne: function () {
    return Math.random() < 0.16667;
  },
  rollTwo: function () {
    return Math.random() < 0.3334;
  },
  rollThree: function () {
    return Math.random() <= 0.5;
  },
  rollFour: function () {
    return Math.random() < 0.66667;
  },
  rollFive: function () {
    return Math.random() < 0.83334;
  },
  rollOther: function (start, size, excludedRoll) {
    var roll = excludedRoll;
    while (roll == excludedRoll) {
      roll = DG.rollDie(start, size);
    }
    return roll;
  },
  drawOne: function (list) {
    return list[DG.rollDie(0, list.length)];
  },
  shufflePopOne: function (list) {
    var item = "";
    list = DG.shuffle(list);
    item = list.pop();
    return [item, list];
  },
  arrayToSet: function (a) {
    var hash = {};
    for (var i = 0; i < a.length; i++)
      hash[a[i]] = true;
    var r = [];
    for (var k in hash)
      r.push(k);
    return r;
  },
  shuffle: function (array) {
    // Mike Bostock's Fisher Yates shuffle implementation
    var m = array.length, t, i;
    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  },

  addMonstersToList: function () {
    if (DG.monsterHold !== undefined) {
      if (DG.data.monsters[DG.monsterHold["name"]] !== undefined) {
        DG.data.monsters[DG.monsterHold["name"]]["count"] = DG.monsterHold.count
      } else {
        DG.data.monsters[DG.monsterHold["name"]] = DG.monsterHold;
      }
      DG.monsterHold = undefined;
    }

  },
  addMonsterRelationship: function () {
    // used by map to add relationships as node are added.
    if (DG.monsterHold !== undefined) {
       if(DG.rollFour()){
         DG.data.notes += DG.newRelationship(DG.monsterHold)  + "\n";
         $("#notes").val(DG.data.notes);
       }
    }
  },

  setRandomRoomCount: function () {
    DG.roomCount = DG.rollDie(DG.minRooms, (DG.maxRooms - DG.minRooms));
    return DG.roomCount;
  },
  setBaseMonsters: function () {
    var monsterSourceList;
    if (DG.data.dungeonLevel === "wilds") {
      // Not going to deal with multiple levels of base monsters
      DG.data.baseMonsters = [];
      return;
    }
    if (DG.data.locationType === "wilds") {
      monsterSourceList = DG.wild.monsters;


    } else {
      monsterSourceList = DG.stock.monsters;
    }
    DG.data.baseMonsters = [];
    if ((DG.data.monsterTags !== undefined) && (DG.data.monsterTags !== [])) {
      var fullMonsterList = monsterSourceList[DG.data.dungeonLevel];
      for (var i = 0; i < fullMonsterList.length; i++) {
        if (DG.tagMatch(fullMonsterList[i].tags, DG.data.monsterTags)) {
          DG.data.baseMonsters.push(fullMonsterList[i]);
        }
      }
      if (DG.data.baseMonsters.length > 0) {
        return
      } // fall through to random if we found nothing matching the theme tags
    }

    DG.data.baseMonsters = [DG.drawOne(monsterSourceList[DG.data.dungeonLevel])];

    if (DG.rollFour()) {
      DG.data.baseMonsters.push(DG.drawOne(monsterSourceList[DG.data.dungeonLevel]))
    }

    if (DG.rollFour()) {
      DG.data.baseMonsters.push(DG.drawOne(monsterSourceList[DG.data.dungeonLevel]))
    }


  },

  filterListByTags: function (fullList, filterTags) {
    var filteredList = [];
    for (var i = 0; i < fullList.length; i++) {
      if (DG.tagMatch(fullList[i].tags, filterTags)) {
        filteredList.push(fullList[i]);
      }
    }
    return filteredList;
  },

  // Node Content Randomization section ---------------------------------------------
  makeContents: function (dungeonLevel) {
    var contents = "";
    var treasureRoll = 1;
    DG.monsterTreasureMultiplier = 1;
    DG.treasureLevel = 1;

    if (DG.rollOne()) {
      contents += DG.randomOddity(dungeonLevel);
    }
    if (DG.rollOne()) {
      contents += DG.randomTrap(dungeonLevel);
      treasureRoll += 1;
    }
    if (DG.rollTwo()) {
      contents += DG.randomMonsters(dungeonLevel, true);
      treasureRoll += 2;
    }
    // More monsters, chance of bigger mixed set, with high treasure odds
    if (DG.rollTwo()) {
      contents += DG.randomMonsters(dungeonLevel, true);
      treasureRoll += 2;
    }
    if (DG.data.dungeonLevel === "wilds") {
      if (DG.rollDie(1, 6) <= treasureRoll) {
        contents += DG.randomTreasure(DG.treasureLevel)
      }

    } else {
      if (DG.rollDie(1, 6) <= treasureRoll) {
        contents += DG.randomTreasure(dungeonLevel)
      }

    }
    if (DG.rollOne()) {
      contents += DG.randomHook();
    }
    // let's have fewer truly empty rooms
    if (contents == "" && DG.rollThree()) {
      contents += DG.randomOddity(dungeonLevel);
    }
    if (contents == "" && DG.rollTwo()) {
      contents += DG.randomHook(dungeonLevel);
    }
    if (contents == "") {
      contents = "Empty"
    }
    return contents;
  },
  randomOddity: function (dungeonLevel) {
    // ignoring dungeonLevel for now
    return DG.drawOne(DG.stock.oddities) + "<br>";
  },
  randomHook: function () {
    var hook = "Hook: " + DG.drawOne(DG.stock.hookItems) + "<br>";
    return hook;
  },
  randomNpcClass: function () {
    return DG.drawOne(DG.stock.characterClasses);
  },
  randomRelationship: function (intel, targetInt, plurality) {
    // simple at first
    // Then introduce int
    var possibleRelationships = DG.stock.relationships.filter(function (rel) {
      return rel.min_subject_int <= intel
    });

    possibleRelationships = possibleRelationships.filter(function (rel) {
      return rel.min_target_int <= targetInt
    });
    var relationship = DG.drawOne(possibleRelationships);
    return relationship[plurality];
  },
  randomMonsters: function (dungeonLevel, wrap) {
    var undeadPrefix;
    var monsterLevel;
    var singletonAttitude = "";
    var monsterCount = 1;
    var monsterType = {name: "", int: 0, tags: []};
    var monsterName = "";
    var pluralMonsterName = "";
    var attitude = "";
    var monsters = "";
    if (dungeonLevel === "wilds") {
      monsterLevel = Math.min(DG.rollDie(0, 5), DG.rollDie(0, 5));
      DG.treasureLevel = Math.max(DG.treasureLevel, monsterLevel);
      switch (monsterLevel) {
        case 0:
          if (DG.rollThree()) {
            monsterCount = Math.min(DG.rollDie(1, 300), DG.rollDie(1, 300));
          }
          else {
            monsterCount = DG.rollDie(1, 20);
          }
          break;
        case 1:
          if (DG.rollTwo()) {
            monsterCount = Math.min(DG.rollDie(1, 250), DG.rollDie(1, 250));
          }
          else {
            monsterCount = DG.rollDie(1, 20);
          }
          break;
        case 2:
          monsterCount = Math.min(DG.rollDie(1, 40), DG.rollDie(1, 40), DG.rollDie(1, 40));
          break;
        case 3:
          monsterCount = Math.min(DG.rollDie(1, 30), DG.rollDie(1, 30), DG.rollDie(1, 30));
          break;
        case 4:
          monsterCount = Math.min(DG.rollDie(1, 16), DG.rollDie(1, 16), DG.rollDie(1, 16));
          break;
        case 5:
          monsterCount = Math.min(DG.rollDie(1, 6), DG.rollDie(1, 6));
          break;
        default:
          monsterCount = DG.rollDie(1, 6);

      }

    }
    else {
      monsterLevel = dungeonLevel;
      // how many and what level?
      for (var i = 0; i < 3; i += 1) {
        if (DG.rollOne()) {
          monsterLevel += 1;
        }
      }
      if (monsterLevel > 5) {
        monsterLevel = 5;
      }
      if (monsterLevel == dungeonLevel) {
        monsterCount += DG.rollDie(0, 8);
      }
      if (monsterLevel == dungeonLevel + 1) {
        monsterCount += DG.rollDie(0, 3);
      }
      if (monsterLevel == dungeonLevel + 2) {
        monsterCount += DG.rollDie(0, 1);
      }
      // have a chance of a large horde of lower monsters
      if (monsterLevel == dungeonLevel && DG.rollTwo() && monsterLevel > 0) {
        monsterLevel = monsterLevel - 1;
        monsterCount *= 2;
        // can go two steps down
        if (DG.rollThree() && (monsterLevel > 0 )) {
          monsterLevel = monsterLevel - 1;
          monsterCount *= 2;
        }
      }
    }
    monsterType = DG.selectMonster(monsterLevel);


    // Fill in the string -----------------

    if (DG.tagMatch(["undead"], DG.data.monsterTags) && !DG.tagMatch(monsterType.tags, ["undead"])) {
      undeadPrefix = "undead "
    } else {
      undeadPrefix = ""
    }
    if (DG.tagMatch(["demon"], DG.data.monsterTags) && !DG.tagMatch(monsterType.tags, ["demon,devil,dragon"])) {
      demonicPrefix = "demonic "
    } else {
      demonicPrefix = ""
    }
    if (DG.tagMatch(["devil"], DG.data.monsterTags) && !DG.tagMatch(monsterType.tags, ["demon,devil,dragon"])) {
      demonicPrefix = "infernal "
    } else {
      demonicPrefix = ""
    }
    // Plural?
    if (monsterType.hasOwnProperty("plural")) {
      pluralMonsterName = monsterType.plural;
    }
    else {
      pluralMonsterName = monsterType.name + "s";
    }
    if (monsterCount > 1) {
      monsterName = pluralMonsterName;
    } else {
      monsterName = monsterType.name;
    }
    if (DG.rollTwo()) {
      monsterName = undeadPrefix + monsterName;
    }
    if (DG.rollOne()) {
      monsterName = demonicPrefix + monsterName;
    }
    if (wrap) {
      monsters = "M: "
    } else {
      monsters = ""
    }
    monsters += monsterCount;
    // Add descriptive attitudes but only sometimes, to avoid being cloying.
    // Choose from complex or simple motivations table based on the INT of the monster type.
    DG.monsterHold = {
      name: pluralMonsterName,
      single_name: monsterType.name,
      count: monsterCount,
      int: monsterType.int,
      tags: monsterType.tags
    };
    if (DG.shouldDetailNpcs(monsterType)) {
      monsters += " " + monsterName;
      if (wrap) {
        monsters += ":<br>";
      } else {
        monsters += ":\n"
      }
      monsters += DG.detailNpcs(monsterLevel, monsterCount, monsterType, wrap);
    } else {
      if (DG.rollTwo()) {
        attitude = DG.randomAttitude(monsterType);
        monsters += " " + attitude;
      } else if (DG.rollThree() && monsterCount > 1) {
        singletonAttitude = ", one is " + DG.randomAttitude(monsterType);
      }
      monsters += " " + monsterName + singletonAttitude;
      if (wrap) {
        monsters += "<br>";
      }
    }


    // side effect - adjust monster multiplier for treasure    
    DG.updateMonsterTreasureMultiplier(monsterLevel, monsterCount, monsterType);
    return monsters;
  },
  randomAttitude: function (monsterType) {
    if (monsterType.int < 7) {
      return DG.drawOne(DG.stock.basicAttitudes);
    }
    return DG.drawOne(DG.stock.allAttitudes);
  },

  shouldDetailNpcs: function (monsterType) {
    return DG.tagMatch(monsterType.tags, ["adventurer", "overlord", "npc"]);
  },

  getNpcLevel: function (monsterLevel) {
    if (monsterLevel === 0) {
      if (DG.rollTwo()) {
        return "2"
      }
      return "1";
    }
    else if (monsterLevel === 1) {
      if (DG.rollOne()) {
        return "1"
      }
      if (DG.rollOne()) {
        return "4"
      }
      if (DG.rollThree()) {
        return "2"
      }
      return "3";
    }
    else if (monsterLevel === 2) {
      if (DG.rollOne()) {
        return "6"
      }
      if (DG.rollOne()) {
        return "3"
      }
      if (DG.rollThree()) {
        return "5"
      }
      return "4";
    }

    else if (monsterLevel === 3) {
      //mostly 6-7
      if (DG.rollOne()) {
        return "8"
      }
      if (DG.rollOne()) {
        return "5"
      }
      if (DG.rollThree()) {
        return "7"
      }
      return "6";
    }

    else if (monsterLevel === 4) {
      if (DG.rollOne()) {
        return "10"
      }
      if (DG.rollOne()) {
        return "7"
      }
      if (DG.rollThree()) {
        return "9"
      }
      return "8";
    }
    else {
      // mostly 10 - 12
      if (DG.rollOne()) {
        return "13"
      }
      if (DG.rollOne()) {
        return "14"
      }
      if (DG.rollOne()) {
        return "9"
      }
      if (DG.rollTwo()) {
        return "12"
      }
      if (DG.rollThree()) {
        return "11"
      }
      return "10";
    }
  },

  detailNpcs: function (monsterLevel, monsterCount, monsterType, wrap) {
    console.log("monsterCount expected: " + monsterCount);
    var npcBlock = "";
    for (var n = 0; n < monsterCount; n++) {
      console.log("npc " + n);
      npcBlock += DG.drawOne(DG.names.begin) + DG.drawOne(DG.names.end) + ': ';
      var statList = DG.stock.npcStats.slice(0);
      var statsToDraw = DG.rollDie(-1, 4);
      var stat, popResult;

      if (statsToDraw > 0) {
        for (sd = 0; sd < statsToDraw; sd += 1) {
          popResult = DG.shufflePopOne(statList);
          stat = popResult[0][DG.rollDie(0, 2)];
          statList = popResult[1];
          npcBlock += stat;
          if (sd < statsToDraw - 1) {
            npcBlock += ", ";
          }
        }
      }

      if (DG.rollTwo()) {
        if (statsToDraw > 0) {
          npcBlock += ", ";
        }
        npcBlock += DG.randomAttitude(monsterType) + " ";
      } else {
        npcBlock += " "
      }
      npcBlock += DG.randomNpcClass() + " ";
      var npcLevel = DG.getNpcLevel(monsterLevel);
      npcBlock += npcLevel;
      if (npcLevel > DG.rollDie(0, 10)) {
        npcBlock += ", has " + DG.randomMagicItem(Math.round((npcLevel - 2) / 2));
      }


      if (wrap) {
        npcBlock += "<br>";
      } else {
        npcBlock += "\n";
      }
    }

    return npcBlock;
  },
  tagMatch: function (itemTags, themeTags) {
    for (var i = 0; i < itemTags.length; i++) {
      if (themeTags.indexOf(itemTags[i]) !== -1) {
        return true;
      }
    }
    return false;
  },
  selectMonster: function (monsterLevel) {
    var monsterSourceList;
    if (DG.data.locationType == "wilds") {
      monsterSourceList = DG.wild.monsters;
    } else {
      monsterSourceList = DG.stock.monsters;
    }
    if ((DG.data.monsterTags !== undefined) && (DG.data.monsterTags !== [])) {
      // Select Monster type from long or short list
      if (DG.rollThree() || DG.data.dungeonLevel === "wilds") { // Try several times for theme, then go random to fill in.
        for (var i = 0; i < 8; i++) {
          monsterType = DG.drawOne(monsterSourceList[monsterLevel]);
          if (DG.tagMatch(monsterType.tags, DG.data.monsterTags)) {
            return monsterType;
          }
        }
        monsterType = DG.drawOne(monsterSourceList[monsterLevel]);
      } else { // About half come out of the base monster type for the level, for some coherence.
        // will let monster count & treasure multiplier stand, which will generate some group size/treasure outliers
        monsterType = DG.drawOne(DG.data.baseMonsters);
      }
    }
    else {
      // Select Monster type from long or short list
      if (DG.rollThree() || DG.data.dungeonLevel === "wilds") {
        monsterType = DG.drawOne(monsterSourceList[monsterLevel]);
      } else { // About half come out of the base monster type for the level, for some coherence.
        // will let monster count & treasure multiplier stand, which will generate some group size/treasure outliers
        monsterType = DG.drawOne(DG.data.baseMonsters);
      }
    }
    return monsterType;
  },
  updateMonsterTreasureMultiplier: function (monsterLevel, monsterCount, monsterType) {
    var newMonsterTreasureMultiplier;
    if (monsterType.int < 6) {
      // not smart enough to amass treasure
      newMonsterTreasureMultiplier = monsterLevel + 1;
    } else {
      // More monsters of the same type gives more treasure but don't scale linearly.
      newMonsterTreasureMultiplier = (monsterLevel + 1 ) * Math.pow(monsterCount, 0.65);
    }
    // Use the biggest multiplier of any single group of monsters in the room.
    DG.monsterTreasureMultiplier = Math.max(DG.monsterTreasureMultiplier, newMonsterTreasureMultiplier);
  },

  valueFraction: function (treasureValue) {
    return DG.rollDie(1, 9) * 0.1 * treasureValue
  },
  oneTreasure: function (treasureValue) {
    var treasureCount = 1;
    var treasureType = DG.drawOne(DG.stock.treasure);

    if (treasureType["value"] === "X") {
      var jewelValue = Math.floor(treasureValue * DG.rollDie(1, 8));
      return treasureType["label"] + " worth " + jewelValue + " GP";
    }
    else if (treasureType["value"] < treasureValue) {
      treasureCount = Math.floor(treasureValue / treasureType["value"]);
    }
    return treasureCount + " " + treasureType["label"];
  },
  randomTreasure: function (treasureLevel) {
    var hoard = "Ts: ";
    var treasureType = {};
    var treasureCount = 1;
    var treasureValue = Math.pow(1 + treasureLevel, 1.5) * 10 * DG.data.treasureMultiplier;
    if (DG.rollTwo()) {
      treasureValue *= DG.rollDie(2, 6)
    }
    if (DG.rollThree()) {
      treasureValue *= DG.rollDie(2, 6)
    }
    if (DG.monsterTreasureMultiplier > 0) {
      treasureValue *= DG.monsterTreasureMultiplier;
    }
    hoard += DG.oneTreasure(treasureValue);
    // second treasure
    if (DG.rollThree()) {
      hoard += ", ";
      hoard += DG.oneTreasure(DG.valueFraction(treasureValue));
      if (DG.rollThree()) {
        hoard += ", ";
        hoard += DG.oneTreasure(DG.valueFraction(treasureValue));
      }
    }
    hoard += "<br>";
    if (DG.rollOne()) {
      hoard += "Mg: " + DG.randomMinorMagicItem(treasureLevel) + "<br>";
    }
    if (DG.rollDie(1, 1000) < treasureValue) {
      hoard += "Mg: " + DG.randomMagicItem(treasureLevel) + "<br>";
    }
    if (DG.rollDie(0, 9) <= treasureLevel) {
      hoard += "Mg: " + DG.randomMagicItem(treasureLevel) + "<br>";
    }
    if (DG.rollDie(1, 8000) < treasureValue) {
      hoard += "Mg: " + DG.randomMagicItem(treasureLevel) + "<br>";
    }
    if (DG.rollDie(1, 20000) < treasureValue) {
      hoard += "Mg: " + DG.randomMagicItem(treasureLevel) + "<br>";
    }

    return hoard;
  },
  randomMagicItem: function (treasureLevel) { // will need much more detail later and more items in big hoards
    var item = DG.drawOne(DG.stock.magicItems);
    if (item === "potion") {
      item = "Potion of " + DG.drawOne(DG.stock.potions)
    }
    if (item === "sword") {
      item = DG.genSword(treasureLevel)
    }
    if (item === "weapon") {
      item = DG.genWeapon(treasureLevel)
    }

    if (item === "armor") {
      item = DG.genArmor(treasureLevel)
    }

    if (item === "wand") {
      item = DG.genWand(treasureLevel)
    }
    if (item === "ring") {
      item = DG.genRing(treasureLevel)
    }
    if (item === "staff") {
      item = DG.genStaff(treasureLevel)
    }
    if (item === "book") {
      item = DG.genBook(treasureLevel)
    }
    if (item === "scroll") {
      item = DG.genScroll(treasureLevel)
    }
    if (item === "trinket") {
      item = DG.genTrinket(treasureLevel)
    }
    if (item === "miscellaneous") {
      item = DG.genMisc(treasureLevel)
    }

    return item;
  },
  randomMinorMagicItem: function (treasureLevel) { // will need much more detail later and more items in big hoards
    var item = DG.drawOne(DG.stock.minorMagicItems);
    if (item === "potion") {
      item = "Potion of " + DG.drawOne(DG.stock.potions)
    }
    if (item === "scroll") {
      item = DG.genScroll(treasureLevel)
    }
    if (item === "trinket") {
      item = DG.genTrinket(treasureLevel)
    }
    return item;
  },
  genSword: function (treasureLevel) {
    var sword = DG.drawOne(DG.stock.swords);
    var bonus = 1;
    var powerList = [];
    for (i = 0; i < treasureLevel + 2; i += 1) {
      if (DG.rollTwo()) {
        bonus += 1
      }
      if (DG.rollTwo()) {
        powerList.push(DG.drawOne(DG.stock.swordPowers))
      }
    }
    if (powerList.indexOf("Cursed") === -1) {
      sword += " +" + bonus;
    } else {
      sword += " -" + bonus + " Cursed";
      powerList.remove(["Cursed"]);
    }
    powerList = DG.arrayToSet(powerList);
    if (powerList !== []) {
      sword += ", " + powerList.join(', ');
    }

    return sword;
  },
  genWeapon: function (treasureLevel) {
    var weapon = DG.drawOne(DG.stock.weapons);
    var bonus = 1;
    var powerList = [];
    for (i = 0; i < treasureLevel + 1; i += 1) {
      if (DG.rollTwo()) {
        bonus += 1
      }
      if (DG.rollOne()) {
        powerList.push(DG.drawOne(DG.stock.weaponPowers))
      }
    }
    if (powerList.indexOf("Cursed") === -1) {
      weapon += " +" + bonus;
    } else {
      weapon += " -" + bonus + " Cursed";
      powerList.remove(["Cursed"]);

    }
    powerList = DG.arrayToSet(powerList);
    if (powerList !== []) {
      weapon += ", " + powerList.join(', ');
    }


    return weapon;
  },
  genArmor: function (treasureLevel) {
    var armor = DG.drawOne(DG.stock.armor);

    var bonus = 1;
    var powerList = [];
    for (i = 0; i < treasureLevel + 1; i += 1) {
      if (DG.rollTwo()) {
        bonus += 1
      }
      if (DG.rollOne()) {
        powerList.push(DG.drawOne(DG.stock.armorPowers))
      }
    }
    if (powerList.indexOf("Cursed") === -1) {
      armor += " +" + bonus;
    } else {
      armor += " -" + bonus + " Cursed";
      powerList.remove(["Cursed"]);

    }
    powerList = DG.arrayToSet(powerList);
    if (powerList !== []) {
      armor += ", " + powerList.join(', ');
    }

    return armor;
  },
  genWand: function (treasureLevel) {
    var wand = "Wand of " + DG.drawOne(DG.stock.wands);
    return wand;
  },
  genRing: function (treasureLevel) {
    var ring = "Ring of " + DG.drawOne(DG.stock.rings);
    return ring;
  },
  genMisc: function (treasureLevel) {
    var misc = DG.drawOne(DG.stock.miscellaneous);
    return misc;
  },
  genStaff: function (treasureLevel) {
    var staff = "Staff of " + DG.drawOne(DG.stock.staves);
    return staff;
  },
  genBook: function (treasureLevel) {
    var book = DG.drawOne(DG.stock.books);
    return book;
  },
  genScroll: function (treasureLevel) {
    var scroll = DG.drawOne(DG.stock.scrolls);
    return scroll;
  },
  genTrinket: function (treasureLevel) {
    var trinket = DG.drawOne(DG.stock.trinkets);
    return trinket;
  },
  randomTrap: function (dungeonLevel) {
    // will tie to dungeonLevel later
    var trap = DG.drawOne(DG.stock.traps);
    if (DG.rollTwo()) {
      trap += " disarmed by " + DG.drawOne(DG.stock.disarms)
    }
    if (DG.rollThree()) {
      trap += ", triggered by " + DG.drawOne(DG.stock.triggers)
    }

    return "Tp: " + trap + "<br>";
  },

  // save button works in Chrome
  chromeSaveImage: function () {
    var ua = window.navigator.userAgent;

    // save image without file type
    var canvas = $("canvas")[0];
    document.location.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    // save image as png
    var link = document.createElement('a');
    var fileName = prompt("Name for image file?", "dungeon.png");
    link.download = fileName;
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    link.click();

  },
  populateNotes: function () {
    return DG.wanderingMonstersNote() + "\n" + DG.relationsNote();
  },

  wanderingMonstersNote: function () {
    var monsterList = "Wandering Monsters\n";
    var monsterCount = 0;
    if(DG.isMap) { monsterCount = 4 + DG.rollDie(1, 8) } else {
      monsterCount = Math.round(DG.data.nodes.length / 6) + 1;
      if (DG.rollThree()) {
        monsterCount += 1
      }
      if (DG.rollThree()) {
        monsterCount += 1
      }
    }

    for (var i = 1; i <= monsterCount; i += 1) {
      monsterList += ("" + i + ": " + DG.randomMonsters(DG.data.dungeonLevel, false) + "\n");
      DG.addMonstersToList();
    }
    return monsterList;
  },
  relationsNote: function () {
    var relationsList = "";
    var relationship = "";
    var monster = {};
    // before this method need to have a hash of rolled monsters to their number
    // store in a temp value when rolled
    // commit to the hash when a node's title is set or a wandering monster is set
    // will disregard decrementing on edits
    // reskinning should also adjust the key
    for (var prop in DG.data.monsters)
      if (DG.data.monsters.hasOwnProperty(prop)) {
        if (DG.rollFour()) {
          monster = DG.data.monsters[prop];
          relationship = DG.newRelationship(monster);
          relationsList += relationship + "\n";
        }
      }
    // For each monster type in the list
    // with a two thirds chance of it being the subject
    // get a relation compatible with it as the subject
    // Get a target compatible with the relationship from this level or "another level"
    // concatenate the phrase and add it to the list

    return relationsList;
  },
  newRelationship: function(monster){
    var target = {};
    var relationship = "";
    var target = {};
    var intel;
    var targetInt;
    var plurality;
    var name;

    target = DG.data.monsters[DG.drawOne(Object.keys(DG.data.monsters))];
    if (target === monster) {
      target = DG.data.monsters[DG.drawOne(Object.keys(DG.data.monsters))];
      if (target === monster) {
        target = DG.data.monsters[DG.drawOne(Object.keys(DG.data.monsters))];
      }
    }
    if (target.count > 1) {
      targetName = target.name
    } else {
      targetName = target.single_name
    }

    intel = monster["int"];
    if (monster.count > 1) {
      plurality = "plural_text";
      name = monster.name;

    } else {

      plurality = "single_text";
      name = monster.single_name;

    }
    targetInt = target["int"];

    relationship = "The " + name + " " + DG.randomRelationship(intel, targetInt, plurality) + " the " + targetName + ".";
    return relationship;

  }

};




