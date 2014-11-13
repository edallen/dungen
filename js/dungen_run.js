//breaking out usage at page initialization to this file

// Everything but IE
if (typeof window.addEventListener === "function") { 
    window.addEventListener("load", function() {
       postLoadInitialize();
	 
  }, false); 
}
else { document.getElementById("dungeon").innerHTML("Sorry, I'm not supporting older Internet Explorer versions that use different JavaScript syntax for events.");
}

function postLoadInitialize(){
   DG.digDungeon();
   bindButtons();
}