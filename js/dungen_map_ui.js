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

$("select#map_url_select").on('change', function (e) {
  var optionVal = $("select#map_url_select option:selected").val();
  if (optionVal != "") {
    $("input#map_url").val(optionVal);
    DG.digDungeon("dungeon");
  }
});

function populateUI() {
  DG.ui.populateSavedSelect();
  DG.ui.populateMapUrlsSelect();
  var randomMap = DG.drawOne(DG.ui.mapImages().slice(1));
  $("#map_url").val(randomMap[1]);
}

DG.ui = {
  mapImages: function() {

  var imageArray= [
    ["Select a map",""],
    ["EA: Megadungeon Level 1","http://4.bp.blogspot.com/-0pr_RVQvg-8/VDYZ2G7RZvI/AAAAAAAAB7g/nh3T30dPSEs/s1600/Level1.png"],
    ["EA: Great Hall","http://1.bp.blogspot.com/-eYinXW0HVSw/VDDyu4oliXI/AAAAAAAAB6M/VED9x6DcxdQ/s1600/great%2Bhall-partially%2Bedited.png"],
    ["EA: Shadowkarst", "http://3.bp.blogspot.com/-2fhW-crpV44/U-fupnMFSGI/AAAAAAAABhA/HtcHzc7QfmE/s640/Shadownkarst.png"],
    ["EA: Fool's Rest", "http://1.bp.blogspot.com/-ApTeB99Mm3w/UzsnXvsbloI/AAAAAAAABPM/zuFgEED7ezQ/s1600/dungeon0401.jpg"],
    ["EA: Rough Stone Tomb", "http://4.bp.blogspot.com/-uw6z3dJxS2E/VA53qig107I/AAAAAAAABn4/EwTFgIWLt6o/s1600/big_rock_walls_1.png"],
    ["EA: Rough Tombs","http://3.bp.blogspot.com/-xBFa8wO5LdY/VA5smHdNqpI/AAAAAAAABno/WugXGscb3Ls/s1600/big_rock_walls_2.png"],
    ["EA: Temple of the Weeping Moon", "http://2.bp.blogspot.com/-7T6nhIddjN4/U348B7PsctI/AAAAAAAABco/92QsKAVa9Gk/s1600/temple+of+the+weeping+moon-shrunk-edited.png"],
    ["EA: Small Stone Chain Walls","http://2.bp.blogspot.com/-JpzHDN3kKF0/VA5sgJIqJnI/AAAAAAAABnY/U-Xx1BtK35A/s1600/stone_walls_curve.png"],
    ["EA: Rough Hewn Tunnels","http://2.bp.blogspot.com/-QA8aIrlCC-g/Uw-dU17N7YI/AAAAAAAABE8/DSYLmNCCXv4/s1600/tunnel_level.png"],
    ["EA: A big dungeon", "https://lh3.googleusercontent.com/gbDgCqzTouGNYH-dzI-EhkYZyb1soYiGJTCpG-nPrL8=s630-fcrop64=1,0000469effffffff"],
    ["EA: Cave-in Coming","http://1.bp.blogspot.com/-SZLU3p7h7gA/UxE4PSxcxXI/AAAAAAAABFM/tNZn_o2u7Lk/s1600/crack+tunnels.png"],
    ["EA: Mesa Cavern","http://3.bp.blogspot.com/-_PMt8rAX51k/Uwa2wLcd_JI/AAAAAAAABCo/uPbpardiSbU/s1600/mesacavern.png"],
    ["EA: Temple of the Dead God","http://1.bp.blogspot.com/-sdcyf4396y0/UvVtz6P8DmI/AAAAAAAAA4g/4PCp5W947Y8/s1600/cross_room_complete_low_rez.png"],
    ["EA: Heart of the Spider","http://3.bp.blogspot.com/-EdnCE-dbgdA/Uu1Bm6ubRqI/AAAAAAAAAqM/jApU2XwJd5A/s1600/HeartOfTheSpider.jpeg"],
    ["EA: Brant's Bolthole","http://4.bp.blogspot.com/-RBrUJSPRreo/Uuqcw1e9VMI/AAAAAAAAAno/fXs5rTG6l3Y/s1600/Screen+shot+2014-01-30+at+10.40.33+AM.png"],
    ["EA: Magister Mixtos","http://3.bp.blogspot.com/-o4wEGT9jJW0/UuiudVx8YhI/AAAAAAAAAnQ/GJ18iMu1uyE/s1600/Scan2copy_rotated.png"],
    ["EA: Skrad","http://1.bp.blogspot.com/-TpQ0CMt3dVs/Utg7BFF6N0I/AAAAAAAAAkA/S9RK_1nC8Jc/s1600/skrad.png"],
    ["EA: Domes and Caverns","http://1.bp.blogspot.com/-wieANdIIK2g/UxoJcCTWQXI/AAAAAAAABH4/PAjr-Z5QsY8/s1600/domes+and+caverns.png"],
    ["EA: The Nameless Dungeon","http://1.bp.blogspot.com/-miHpMzOUvAw/Us0DbidxgrI/AAAAAAAAAh0/JU_S6q4yV0E/s1600/cavern_dungeon_2.png"],
    ["EA: Caverns of the Western Reaches","http://1.bp.blogspot.com/-Nt_FdApKNgQ/Ut2T04OK9YI/AAAAAAAAAks/PCpRXH7SuK4/s1600/caves_again.png"],
    ["EA: CrystalMek","http://3.bp.blogspot.com/-sRAcYkKWYA8/Ut28goEiVeI/AAAAAAAAAk8/NXfqRphcYuI/s1600/crystalline.png"],
    ["EA: The Ouroburrows","http://1.bp.blogspot.com/-scLmOA11ZUM/Ul2XOHkw1yI/AAAAAAAAAXI/iUxUxGMT8s0/s1600/Ouroburrows.png"],
    ["EA: A City in Ruin","http://1.bp.blogspot.com/-2PbIGcAFP_M/UlsQoRDojgI/AAAAAAAAAWs/d8wm8zlatXw/s1600/City+map.png"],
    ["EA: Chasm Geomorph","http://2.bp.blogspot.com/-gyk_sXR5Ym0/Uz4VoMbOsPI/AAAAAAAABQM/iqp7x80DWlA/s1600/geomorph_chasm_clean.jpg"],
    ["EA: Not Quite a Geomorph","http://2.bp.blogspot.com/-igIFdYynfUk/Uv0hgrLv_bI/AAAAAAAAA94/Mw55QqllNCw/s1600/ungeomorph1-2.png"],
    ["EA: Krita Caves","http://3.bp.blogspot.com/-hW1Y8-hiz4g/UsN-8EM2t1I/AAAAAAAAAg8/qm1Jhrpvxs4/s1600/caverns.jpg"],
    ["EA: Krita Dungeon","http://1.bp.blogspot.com/-YMrv9zlsnv0/UsNsnO2Pc_I/AAAAAAAAAgs/dybuBokzZzA/s1600/dyson-like.jpg"],
    ["EA: More Caves","http://4.bp.blogspot.com/-5g1AWQGAsHA/Ut2-oQwMThI/AAAAAAAAAlI/3Bq597ifAO4/s1600/more_caves.png"],
    ["EA: Tile 2", "http://2.bp.blogspot.com/-kvWak71_es4/Uv683XYjGoI/AAAAAAAAA_Y/hBjo-7T1N_o/s1600/tile+2.png"],
    ["EA: Diced Dungeon", "http://4.bp.blogspot.com/-wpRGkFDpfL8/U2J1Xeex_jI/AAAAAAAABTY/GiToJaz-Y1U/s1600/rando_mize_dungeon.png"],
    ["EA: A Tunnels Level","http://3.bp.blogspot.com/-tHxEnOu6xlc/Uwa-HyY-WgI/AAAAAAAABDA/eCDilDdIdnY/s1600/tunnels.png"],
    ["EA: Tile of Doom","http://2.bp.blogspot.com/-7Ft0eaIaUXw/UxIyq6nVBgI/AAAAAAAABFo/ZnbsE9Bf7Qo/s1600/tile3-hc.png"],
    ["EA: Dunport","http://1.bp.blogspot.com/-RQalYHN3rGc/UsyVGqG6EHI/AAAAAAAAAhg/G5F5PLI1618/s1600/port+map.png"],
    ["BL: Herstmonceux upstairs","http://3.bp.blogspot.com/-ntum4mhsiMQ/Uv8rAya18bI/AAAAAAAAA_o/URlGCguamss/s1600/Herstmonceux_BL.png"],
    ["BL: Herstmonceux ground","http://2.bp.blogspot.com/--sJX2iznte8/Uv8rGi4wDII/AAAAAAAABAA/9iN89fYfMmU/s1600/herstmonceux_ground_floor_plan_BL.png"]
  ];
    return imageArray;
  },
  populateMapUrlsSelect: function() {
    var optionsList = this.mapImages();
    var select = document.getElementById("map_url_select");
    this.addOptionPairsToSelect(select, optionsList );
  },
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
  addOptionPairsToSelect: function (select, optionsList) {

    for (var i = 0; i < optionsList.length; i += 1) {
      var opt = document.createElement('option');
      opt.value = optionsList[i][1];
      opt.innerHTML = optionsList[i][0];
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