// UI elements

var regenerateButton = document.getElementById("regenerate");
regenerateButton.addEventListener("click", function () {
  DG.digDungeon("dungeon");
});

var wildsButton = document.getElementById("wilds");
wildsButton.addEventListener("click", function () {
  DG.digDungeon("wilds");
});

var saveButton = document.getElementById("save");
saveButton.addEventListener("click", function () {
  DG.ui.saveDungeon();
});

var loadButton = document.getElementById("load");
loadButton.addEventListener("click", function () {
  DG.ui.loadDungeon();
});

var deleteButton = document.getElementById("delete");
deleteButton.addEventListener("click", function () {
  DG.ui.deleteDungeon();
});

var exportButton = document.getElementById("export");
exportButton.addEventListener("click", function () {
  DG.ui.exportDungeon();
});

var importButton = document.getElementById("import");
importButton.addEventListener("click", function () {
  DG.ui.importDungeon();
});

var themeButton = document.getElementById("theme");
themeButton.addEventListener("click", function () {
  DG.themeBox();
});

var styleButton = document.getElementById("style");
styleButton.addEventListener("click", function () {
  DG.styleBox();
});

var keyButton = document.getElementById("scroll-to-key");
keyButton.addEventListener("click", function () {
  DG.scrollToKey();
  $(this).hide();
  $("#scroll-to-top").show();
});

var topButton = document.getElementById("scroll-to-top");
topButton.addEventListener("click", function () {
  DG.scrollToTop();
  $(this).hide();
  $("#scroll-to-key").show();
});

var replaceButton = document.getElementById("replace");
replaceButton.addEventListener("click", function () {
  var textFrom = $('#text_from').val();
  var textTo = $('#text_to').val();
  DG.replaceText(textFrom, textTo);
  return false;
});

$('#notes').change(function () {
  DG.data.notes = $(this).val();
});

$('#settlements').change(function () {
  DG.data.settlements = DG.splitToArray($(this).val());
});

$('#wandering_monsters').change(function () {
  DG.data.wandering_monsters = $(this).val().split("\n");
});

$('#organizations').change(function () {
  DG.data.organizations = $(this).val().split("\n");
});

$('#monster_relations').change(function () {
  DG.data.monster_relations = $(this).val().split("\n");
});

// $("#notes").on("clearText", function () {
//   $(this).val('');
//   DG.data.notes = $(this).val();
// });

$("body").on("click", "#reroll_node_title", function () {
  var contents = DG.brToLf(DG.makeContents(DG.data.dungeonLevel));
  console.log(contents);
  $('textarea#location_description').html(contents);
});

function populateUI() {
  DG.ui.populateSavedSelect();
}

DG.ui = {
  populateMonsterRelations: function() {
    $("#monster_relations").val(DG.monsterRelationsNote());
    DG.data.monster_relations = $("#monster_relations").val().split("\n");
  },
  populateWanderingMonsters: function() {
    $("#wandering_monsters").val(DG.wanderingMonstersNote());
    DG.data.wandering_monsters = $("#wandering_monsters").val().split("\n");
  },
  populateOrganizations: function() {
    $("#organizations").val(DG.organizationsNote());
    DG.data.organizations = $("#organizations").val().split("\n");
  },
  populateSettlements: function() {
    // should store into DG.data.settlements
    $("#settlements").val(DG.settlementsNote());
    DG.data.settlements = DG.splitToArray($("#settlements").val());
  },
  displaySettlements: function() {
    DG.ui.loadDataNote(DG.data.settlements, $("#settlements"));
  },
  populateNotesFields: function () {
    $("#notes").val(DG.data.notes);
    DG.ui.populateSettlements();
    DG.ui.populateMonsterRelations();
    DG.ui.populateWanderingMonsters();
    DG.ui.populateOrganizations();
  },
  loadNotesFields: function () {
    $("#notes").val(DG.data.notes);
    DG.ui.loadDataNote(DG.data.monster_relations,$("#monster_relations"));
    DG.ui.loadDataNote(DG.data.wandering_monsters, $("#wandering_monsters"));
    DG.ui.loadDataNote(DG.data.organizations,$("#organizations"));
    DG.ui.loadDataNote(DG.data.settlements, $("#settlements"));
  },
  loadDataNote: function (data,jq_note) {
    var len = data.length;
    var noteText = "";
    for (var s = 0; s < len; s ++) {
      var dataLine = data[s];
      noteText += dataLine + '\n' ;
    }
    jq_note.val(noteText);
  },
  populateSavedSelect: function () {
    // populate the saved dungeons select
    var dungeonSelect = document.getElementById("saved");
    dungeonSelect.innerHTML = "";
    var keys = [];
    var key = "";
    for (i = 0; i < localStorage.length; i += 1) {
      key = localStorage.key(i);
      if (key.substring(0,3) != "DM:") {
        keys.push(key);
      }
    }

    if (keys.length > 0) {
      DG.ui.addOptionsToSelect(dungeonSelect, keys);
    }

  },
  addOptionsToSelect: function (select, optionsList) {

    for (var i = 0; i < optionsList.length; i += 1) {
      var opt = document.createElement('option');
      opt.value = optionsList[i];
      opt.innerHTML = optionsList[i];
      select.appendChild(opt);
    }
  },
  saveDungeon: function () {
    var key = document.getElementById("dungeon_name").value;
    var dungeonString = JSON.stringify(DG.data);
    localStorage[key] = dungeonString;
    var dungeonSelect = document.getElementById("saved");
    DG.ui.populateSavedSelect();
  },
  loadDungeon: function () {
    var dungeonSelect = document.getElementById("saved");
    var selectedKey = "";
    var dungeonData = "unloaded";
    if (dungeonSelect.selectedIndex == -1) {
      alert("No dungeon selected to load");
      return null;
    }
    selectedKey = dungeonSelect.options[dungeonSelect.selectedIndex].text;
    dungeonData = localStorage[selectedKey];
    if (dungeonData !== "unloaded") {
      var savedData = JSON.parse(dungeonData);
      DG.data = $.extend(DG.data, savedData);
      DG.updateSettlementsData(DG.data.settlements);
      DG.initNetwork();
      document.getElementById("dungeon_name").text = selectedKey;
      document.getElementById("dungeon_name").value = selectedKey;
      DG.ui.loadNotesFields();


      // update styles loaded from saved dungeons, without losing styles that are actually set
      DG.data.style = $.extend(DG.data.style, DG.data.defaultStyle);
      DG.data.style = $.extend(DG.data.style, savedData.style);
      // might have to go deeper...
    }
  },

  deleteDungeon: function () {
    var dungeonSelect = document.getElementById("saved");
    var selectedKey = dungeonSelect.options[dungeonSelect.selectedIndex].text;
    var message = "Permanently delete dungeon " + selectedKey + " from storage?";
    if (confirm(message)) {
      localStorage.removeItem(selectedKey);
      DG.ui.populateSavedSelect();
    }
  },
  exportDungeon: function () {
    var dungeonString = JSON.stringify(DG.data);
    $("#export-import").val(dungeonString);
  },  // export a file with the data structure

  importDungeon: function () {
    var dungeonData = $("#export-import").val();
    DG.data = JSON.parse(dungeonData);
    DG.updateSettlementsData(DG.data.settlements);
    DG.initNetwork();
    DG.ui.loadNotesFields();
  } //import a file previously exported
}
