// UI elements

// rivets.configure({

  // // Attribute prefix in templates
  // prefix: 'rv',

  // // Preload templates with initial data on bind
  // preloadData: true,

  // // Root sightglass interface for keypaths
  // rootInterface: '.',

  // // Template delimiters for text bindings
  // templateDelimiters: ['{', '}'],

  // // Augment the event handler of the on-* binder
  // handler: function(target, event, binding) {
    // this.call(target, event, binding.view.models)
  // }

// }) 


function bindButtons() {
  var redrawButton = document.getElementById("redraw");
  redrawButton.addEventListener("click", function() { DG.network.redraw(); } );
  
  var regenerateButton = document.getElementById("regenerate");
  regenerateButton.addEventListener("click", function() { DG.digDungeon(); } );
  
  var moveTableButton = document.getElementById("move_table");
   moveTableButton.addEventListener("click", function() { 
     var keyStyle = document.getElementById("dungeon_key").style.display
	 if (keyStyle == "none"){ 
	   document.getElementById("dungeon_key").style.display = "block";
       document.getElementById("dungeon_key_for_printing").style.display = "none";
       document.getElementById("move_table").innerHTML ="Move Table for Printing"; 
	 }
	 else { 
	   document.getElementById("dungeon_key").style.display = "none";
       document.getElementById("dungeon_key_for_printing").style.display = "block"; 
	   document.getElementById("move_table").innerHTML = "Move Table Back"; 
	 };

	 false;
	});
  
  var saveButton = document.getElementById("save");
  saveButton.addEventListener("click", function() { DG.saveDungeon(); } );
  
  var loadButton = document.getElementById("load");
  loadButton.addEventListener("click", function() { DG.loadDungeon(); } );
  
  var deleteButton = document.getElementById("delete");
  deleteButton.addEventListener("click", function() { DG.deleteDungeon(); } );
  
  var exportButton = document.getElementById("export");
  exportButton.addEventListener("click", function() { DG.exportDungeon(); } );
  
  var importButton = document.getElementById("import");
  importButton.addEventListener("click", function() { DG.importDungeon(); } );
  
};

function populateUI(){
   // populate the saved dungeons select
   
   var dungeonSelect = document.getElementById("saved");
   var keys = [];
   var key = "";
   for (i = 0; i < localStorage.length; i +=1){
     key = localStorage[i];
	 keys.push(key);
    };
   DG.addOptionsToSelect(dungeonSelect,localStorage.keys);
}
