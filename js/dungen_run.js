//breaking out usage at page initialization to this file

// Everything but IE
window.addEventListener("load", function() {
    digStarterDungeon();
}, false); 

//IE
window.attachEvent("onload", function() {
    digStarterDungeon();
});

function digStarterDungeon(){
    //create a network
    var dungeonLevel = Math.floor(parseFloat(window.prompt("Enter a dungeon level from 1(kobolds and rats) to 6(silly numbers of things like beholders and dragons)","1")))
    if (dungeonLevel > 0 && dungeonLevel < 7){ DG.dungeonLevel = dungeonLevel - 1 }

    DG.minRooms = 15;
    DG.maxRooms = 20;
    DG.setRandomRoomCount();

    DG.makeRooms();

    DG.linkStrats.trianglesLink(DG.allRoomIds());
    DG.linkStrats.randomLink(Math.floor(DG.roomCount/6) + 1);
    DG.network = new vis.Network(DG.container, DG.data, DG.drawOptions);
    DG.fillKey();
};