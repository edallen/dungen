// UI elements
// ADJUST for Map Page

var regenerateButton = document.getElementById("load_stock");
regenerateButton.addEventListener("click", function () {
  DG.digDungeon("dungeon");
});
//
//var wildsButton = document.getElementById("wilds");
//wildsButton.addEventListener("click", function () {
//  DG.map.initMap("wilds");
//});

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
  DG.data.notes = $(this).val()
});
$("#notes").on("clearText", function () {
  $(this).val('');
});
$("body").on("click", "#reroll_node_title", function () {
  var contents = DG.brToLf(DG.makeContents(DG.data.dungeonLevel));
  console.log(contents);
  $('textarea#location_description').html(contents);
});


function populateUI() {
  DG.ui.populateSavedSelect();
}

DG.ui = {
  populateSavedSelect: function () {
    // populate the saved dungeons select
    var dungeonSelect = document.getElementById("saved");
    dungeonSelect.innerHTML = "";
    var keys = [];
    var key = "";
    for (i = 0; i < localStorage.length; i += 1) {
      key = localStorage.key(i);
      if (key.substring(0,3) === "DM:") {
        keys.push(key.substring(3));
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
    var key = "DM:" + document.getElementById("dungeon_name").value;
    var dungeonString = JSON.stringify(DG.data);
    localStorage[key] = dungeonString;
    var dungeonSelect = document.getElementById("saved");
    DG.ui.populateSavedSelect();
  },
  loadDungeon: function () {
    var dungeonSelect = document.getElementById("saved");
    var selectedKey = "";
    var namespacedKey = "";
    var dungeonData = "unloaded";
    if (dungeonSelect.selectedIndex == -1) {
      alert("No dungeon selected to load");
      return null;
    }
    selectedKey = dungeonSelect.options[dungeonSelect.selectedIndex].text;
    namespacedKey = "DM:" + selectedKey;
    dungeonData = localStorage[namespacedKey];
    if (dungeonData !== "unloaded") {
      var savedData = JSON.parse(dungeonData);
      DG.data = $.extend(DG.data, savedData);
      $("#map_url").val(DG.data.imageSource);
      DG.loadMapImage();
      DG.initNetwork();
      document.getElementById("dungeon_name").text = selectedKey;
      document.getElementById("dungeon_name").value = selectedKey;
      $("#notes").val(DG.data.notes);
      // update styles loaded from saved dungeons, without losing styles that are actually set
      DG.data.style = $.extend(DG.data.style, DG.data.defaultStyle);
      DG.data.style = $.extend(DG.data.style, savedData.style);
      // might have to go deeper...
    }
  },

  deleteDungeon: function () {
    var dungeonSelect = document.getElementById("saved");
    var selectedKey = dungeonSelect.options[dungeonSelect.selectedIndex].text;
    var namespacedKey = "DM:" + selectedKey;
    var message = "Permanently delete dungeon " + selectedKey + " from storage?";
    if (confirm(message)) {
      localStorage.removeItem(namespacedKey);
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
    DG.initNetwork();
    $("#notes").val(DG.data.notes);
  } //import a file previously exported
}