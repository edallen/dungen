// Ed Allen, started November 08, 2014
// 

var DG = {
  // Arguments the Vis.Network creation call ----------------------------------------------
  container:  document.getElementById('dungeon'),
  drawOptions: { dataManipulation: true,
                 height: '90%'
  },
  data: { nodes:[],
          edges:[],},
  
  // Shared variables
  roomCount: 0,
  edgeCount: 0,
  minRooms: 5,
  maxRooms: 10,
  dungeonLevel: 0,
  monsterTreasureMultiplier: 1,

  
  // Randomization Utilities -----------------------------------------------------------------
  rollDie: function(min,size){ 
    var roll = Math.floor(Math.random() * (size)) + min ;
    return roll; }, 
  rollOne: function(){ return Math.random() < 0.16667; },
  rollTwo: function(){ return Math.random() < 0.3334; },
  rollThree: function(){ return Math.random() <= 0.5; },
  rollFour: function() {return Math.random() < 0.66667;},
  rollFive: function() {return Math.random() < 0.83334;},
  rollOther: function(min,max,excludedRoll){
    var roll = excludedRoll;
    while (roll == excludedRoll){ roll = DG.rollDie(min,max);}
    return roll;
  },
  drawOne: function(list){ return list[DG.rollDie(0, (list.length -1))];},
  
  shuffle: function(array) {
    // Mike Bostock's Fisher Yates shuffle implementation
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  },
   
  // Nodes and Linkage ------------------------------------------------------------------------
  linkStrats: {},  // complex enough for a separate breakout below
  allNodeIds: function(){ 
     var nodeIds = [];
     DG.data.nodes.forEach(function(node){
       nodeIds.push(node.id);
     });
     return nodeIds;
  },
  makeNode: function(id,label) { return { id: id, 
                                            shape: "box",
                                            fontSize: 14,
                                            color: {
                                              background: 'lightgray',
                                              border: 'gray',
                                              highlight: {
                                                background: 'lightgray',
                                                border: 'black'
                                              }
                                            },                                          
                                            label: label, 
                                            title: DG.makeTitle(DG.dungeonLevel), 
                                            group: ""};


  },
  makeEdge: function(startNode,endNode) { 
    return {from: startNode, to: endNode, label: this.randomEdgeLabel()};
  },
  linksOnNode: function(nodeId) { return edges = DG.data.edges.filter(function( edge ) {
   return (edge.from == nodeId || edge.to == nodeId); });
  },
  linkNodes: function(a,b){DG.data.edges.push(DG.makeEdge(a,b));},
  setRandomRoomCount: function(){
    DG.roomCount = DG.rollDie(DG.minRooms, (DG.maxRooms - DG.minRooms) );
	return DG.roomCount;
  },
  makeRooms: function(){ 
    for(var i = 0; i < DG.roomCount; i+=1){
      DG.data.nodes[i] = DG.makeNode(i, DG.nameNode(i+1) );
    }
  },

  nameNode: function(nodeNum){ 
    return "" + (nodeNum) + ": " + DG.randomNodeLabel()},  
  randomNodeLabel: function(){
    return this.drawOne(this.stock.nodeLabels)},
  randomEdgeLabel: function(){
    return this.drawOne(this.stock.edgeLabels)},
    
  // Node Content Randomization section ---------------------------------------------
  makeTitle: function(dungeonLevel){ 
    var title = "";
    var treasureRoll = 1;
    DG.monsterTreasureMultiplier = 1;
    if (DG.rollOne()){ title += DG.randomOddities(dungeonLevel);}
    if (DG.rollOne()){ title += DG.randomTrap(dungeonLevel);
                      treasureRoll += 1;
                       }
    if (DG.rollTwo()){ title += DG.randomMonsters(dungeonLevel);
                     treasureRoll += 2;
                     }
    // More monsters, chance of bigger mixed set, with high treasure odds
    if (DG.rollTwo()){ title += DG.randomMonsters(dungeonLevel);
                     treasureRoll += 2;
                     }
    if (DG.rollDie(1,6) <= treasureRoll){title += DG.randomTreasure(dungeonLevel)};
    if (title == "") {title = "Empty"}
    return title; 
  },
  randomOddities: function(dungeonLevel){ return ""; },
  randomMonsters: function(dungeonLevel){ 
    var monsterLevel = dungeonLevel;
    var monsterCount = 1;
    var monsterType = "";
    var newMonsterTreasureMultiplier;
    for (var i = 0; i < 3; i +=1){
      if (DG.rollOne()){ monsterLevel += 1;}
    }
    if (monsterLevel > 5) {
       monsterLevel = 5; }
    if (monsterLevel == dungeonLevel) { monsterCount += DG.rollDie(0,8); }  
    if (monsterLevel == dungeonLevel + 1){ monsterCount += DG.rollDie(0,3); }
    if (monsterLevel == dungeonLevel + 2){ monsterCount += DG.rollDie(0,1); }
    // have a chance of a large horde of lower monsters
    if ( monsterLevel == dungeonLevel && DG.rollTwo() && monsterLevel > 0 ){ 
      monsterLevel = monsterLevel - 1; 
      monsterCount *= 2;
      // can go two steps down
      if (DG.rollThree() && (monsterLevel > 0 )){ 
        monsterLevel = monsterLevel - 1; 
        monsterCount *= 2; 
      }
    }
    monsterType = DG.drawOne(DG.stock.monsters[monsterLevel]);
    // adjusting plurals - extract to a function soon
    if (monsterCount > 1){ 
      if ( monsterType.match(/man$/) ){
        monsterType = monsterType.replace(/man$/, "men");}
      else if ( monsterType.match(/y$/) ){
         monsterType = monsterType.replace(/y$/, "ies");}      
      else {
        monsterType += "s";
      }
    }
    
    // extract this
    newMonsterTreasureMultiplier = (monsterLevel * (monsterCount^0.75));
    DG.monsterTreasureMultiplier = Math.max(DG.monsterTreasureMultiplier,newMonsterTreasureMultiplier);
    var monsters = "M: " +  monsterCount + " " + monsterType + "<br/>";
  
  return monsters;
  },
  randomTreasure: function(dungeonLevel){
    var hoard = "Ts: ";
    var treasureType = {};
    var treasureCount = 1;
    var treasureValue = ((1+dungeonLevel)^2.5) * 10;
    if (DG.rollTwo()){ treasureValue *= 5 }
    if (DG.rollThree()){ treasureValue *= 5 }
    treasureValue *= DG.monsterTreasureMultiplier;
    // going simple with one type initially
    treasureType = DG.drawOne(DG.stock.treasure);
    if (treasureType["value"] < treasureValue){
      treasureCount = Math.floor(treasureValue/treasureType["value"]);
    }
    hoard += treasureCount + " " + treasureType["label"] + "<br/>";
    if (DG.rollDie(1,1000) < treasureValue){ 
      hoard += "Magic: " + DG.randomMagicItem(dungeonLevel) + "<br/>";
    }
    return hoard; 
  },
  randomMagicItem: function(dungeonLevel){ // will need much more detail later and more items in big hoards
    return DG.drawOne(DG.stock.magicItems)},
  randomTrap: function(dungeonLevel){
  // will tie to dungeonLevel later
    return "Tp: " + DG.drawOne(DG.stock.traps) + "<br/>";
  },
  
  // Dungeon Key table -------------------------------------------------
  fillKey: function() { 
  var dungeonKey = "<thead>\n<tr><th>Location</th><th>Description</th></tr>\n</thead><tbody>"
  var tl = "<tr><td class='dungen'>";
  var tm = "</td><td class='dungen'>";
  var tr = "</td></tr>";
  var node = {};
  var nodesLength = DG.data.nodes.length
  for (i = 0; i < nodesLength; i +=1){
      node = DG.data.nodes[i];
      dungeonKey = dungeonKey + ( tl + node["label"] + tm + node["title"] + tr )
   }
   dungeonKey += "\n</tbody>"
   //This function will render out the labels and descriptions from 
   //DG.data.nodes into table#dungeon_key
   document.getElementById("dungeon_key").innerHTML = dungeonKey
   document.getElementById("dungeon_key_for_printing").innerHTML = dungeonKey
  },
  // Dig a dungeon
  digDungeon: function(){
    var levelSelect = document.getElementById("level");
	var sizeSelect = document.getElementById("size");
	var selectedSize = "5,5";
	
	DG.data.nodes = [];
	DG.data.edges = [];
	DG.roomCount = 0,
    DG.edgeCount = 0,
    DG.dungeonLevel = parseInt(levelSelect.options[levelSelect.selectedIndex].value);
    selectedSize = sizeSelect.options[sizeSelect.selectedIndex].value;
    DG.minRooms = parseInt(selectedSize.split(",")[0]);
    DG.maxRooms = parseInt(selectedSize.split(",")[1]);
    DG.setRandomRoomCount();

    DG.makeRooms();

    DG.linkStrats.trianglesLink(DG.allNodeIds());
    DG.linkStrats.randomLink(Math.floor(DG.roomCount/6) + 1);
    DG.network = new vis.Network(DG.container, DG.data, DG.drawOptions);
    DG.fillKey();
  }
  
};

// link strategies
DG.linkStrats = {
  branchLink: function(roomIds) {
    var nodes = roomIds.length;
    var linkedNodes = [];
    var unlinkNodes =roomIds.slice();
    for (var i = 0; i < nodes; i +=1) {
      unlinkedNodes.push(i);
    }
    unlinkedNodes = DG.shuffle(unlinkedNodes);
    var currentNodeID = unlinkedNodes.pop();
    linkedNodes.push(currentNodeID);
    var toLink = currentNodeID;
    var newEdge = {}
    while (unlinkedNodes.length > 0 ){
       currentNodeID = unlinkedNodes.pop();
       DG.linkNodes(currentNodeID, toLink);
       linkedNodes.push(currentNodeID);
       toLink = linkedNodes[DG.rollDie(0,linkedNodes.length-1)];        
    }
  },
  linearLink: function(roomIds){
    for (var i = 0; i < roomIds.length -1; i+=1){
      var startEdge = i;
      var endEdge = startEdge + 1;
      DG.linkNodes(startEdge,endEdge);
    }
  },
  randomLink: function(linksToMake){
    for(var i = 0; i < linksToMake; i+=1){
     var startEdge = DG.rollDie(0,DG.roomCount-1);
     var endEdge = DG.rollOther(0,DG.roomCount-1,startEdge);
     DG.linkNodes(startEdge,endEdge);}
  },
  trianglesLink: function(roomIds){
   var nodesCount = roomIds.length;
   var unlinkedNodes = roomIds.slice();
   var linkedNodes = [];
   var triangle = [];
   var triangles = [];
   while(unlinkedNodes.length > 2){
      triangle = unlinkedNodes.splice(0,3);
      linkedNodes += triangle;
      DG.linkNodes(triangle[0],triangle[1]);
      DG.linkNodes(triangle[0],triangle[2]);
      DG.linkNodes(triangle[1],triangle[2]);
      triangles.push(triangle);
   }
   for(var i = triangles.length -1; i > 0; i-= 1){
     DG.linkNodes(triangles[i][0],triangles[i-1][1]);
     //DG.linkNodes(triangles[i][0],triangles[i-1][2]);
     //DG.linkNodes(triangles[i][1],triangles[i-1][2]);
   }
   
   unlinkedNodes.map(function(node){DG.linkNodes(node,node - 1)});
   
  },
  gridLink: function(){ // INCOMPLETE
    var rowLength = Math.floor(Math.sqrt(DG.roomCount)) + DG.rollDie(0,3);
	var gridArray = [[]];
	var gridRow = 0;
	var nodes = DG.data.nodes.length;
	var gridCol = 0;
	// lay out room objects into a 2D grid array
	for (i = 0; i < nodes; i+=1){
    
      gridArray[gridRow][gridCol] = DG.data.nodes[i].id;
	  if (i < nodes) {
		  if (gridCol == (rowLength -1)){
			 gridCol = 0;
			 gridRow += 1;
             gridArray[gridRow] = [];
		  } else {
			 gridCol += 1;
		  }
      }	  
	}  /* Should have a grid of references to node IDs at end of loop, accounting for all nodes. The last row may be short. */
	DG.gridArray = gridArray;
	// Pick a seed node
	//var seedRow = DG.rollDie(0,gridRow -1); // not the last row that might be short
	//var seedCol = DG.rollDie(0,rowLength -1);
	function adjacentIDs(row,col){
      var from = gridArray[row][col];
      
    }
	// Iterate over nodes, looping outwards, each node gets a link or two inwards
	// so that all end up linked to the seed node, and possibly a link to the next one to test
	
  }
};


