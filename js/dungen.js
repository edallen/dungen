// Ed Allen, started November 08, 2014
// 
// utility added to Array, bad to change primitive prototypes but Array is
// hard to subclass
Array.prototype.remove= function(){
  var what, L= arguments.length, ax;
  while(L && this.length){
    what= arguments[--L];
    while((ax= this.indexOf(what))!= -1){
      this.splice(ax, 1);
    }
  }
  return this;
}
//to remove all of the elements of one array from another, apply the method:
//var a1=[1,2,3,4,5,6], a2=[5,6,7,8,9];
//a1.remove.apply(a1,a2);
// cargo culted from mrhoo answer on Sitepoint:
// http://community.sitepoint.com/t/remove-the-element-from-array-a-if-it-exists-in-array-b/5958

var DG = {
  clearNotes: function(){ $("#notes").trigger("clearText"); },
  scrollToKey: function(){
    var tablePosition = $("#dungeon_key").position();
    var scrollTop = tablePosition.top - 50;
    $("html, body").animate({ scrollTop: scrollTop });
  },
  scrollToTop: function(){
    $("html, body").animate({ scrollTop:"20px" });
  },
  container:  document.getElementById('dungeon'),
  // Text utility functions
  brToLf: function(text) { return text.replace(new RegExp('<br\/>','g'),'\n').replace(new RegExp('<br>','g'),'\n').replace(new RegExp('<br \/>','g'),'\n');},
  lfToBr: function(text) { return text.replace(new RegExp('\r?\n','g'), '<br>');},

  view: {
    buildOptions: function(options,selected){
      var optionsList = ""
      options.map(function(option){
          optionsList += "<option";
          console.log("option: " + option);
          console.log("selected: " + selected);
          if (selected == option){ optionsList += " selected='selected'"; }
          optionsList += ">"; 
          optionsList += option; 
          optionsList += "</option>"; 
          return optionsList;
      })
      console.log(optionsList);
      return optionsList;
    },
    selectControl: function(selectId,options){
      var selectHtml = '<select class="form-control" id="' + selectId + '">' + options + '</select>';
      return selectHtml;
    },
    textInputControl: function(inputId,initialValue){
      var inputHtml = "<input id='" + inputId + "' type='text' value='"+ initialValue + "'>" + "</input>";
      return inputHtml;
    },
    controlDiv: function(label, control ) {
      var divHtml = '<div class="row">  ' +
                    '<div class="col-md-6 form-group"> ' +
                    label + control +
                    '</div></div>';
      return divHtml;
    },
    blankForm: function(formControls) {
      var formHtml = '<form class="form"> ' + formControls + '</form>';    
      return formHtml;
    }
  },
  // Theming dialog
  themeBox: function(){
    var monsterCheckboxes = "";
    var nodeCheckboxes = "";
    var edgeCheckboxes = "";
    var monsterTags = DG.stock.monsterTags;
    var nodeTags = DG.stock.nodeTags;
    var edgeTags = DG.stock.edgeTags;
    var monsterTagsLength = monsterTags.length;
    var nodeTagsLength = nodeTags.length;
    var edgeTagsLength = edgeTags.length;

    var checkedAttribute = "";
    for(var i = 0; i < monsterTagsLength ; i++){
      if (DG.data.monsterTags.indexOf(monsterTags[i]) !== -1 ){ checkedAttribute = "checked "; }
      else { checkedAttribute = ""; }
      monsterCheckboxes += '<input class="monsterTag" id = "' + monsterTags[i] + '" ' +
      'name = "' + monsterTags[i] + '" ' +
      'type = "checkbox" value ="' + monsterTags[i] + '" ' +
      checkedAttribute +
      '>' + monsterTags[i] + '</input><br>';
    }   
    for(var i = 0; i < nodeTagsLength ; i++){
      if (DG.data.nodeTags.indexOf(nodeTags[i]) !== -1 ){ checkedAttribute = "checked "; }
      else { checkedAttribute = ""; }
      nodeCheckboxes += '<input class="nodeTag" id = "' + nodeTags[i] + '" ' +
      'name = "' + nodeTags[i] + '" ' +
      'type = "checkbox" value ="' + nodeTags[i] + '" ' +
      checkedAttribute +
      '>' + nodeTags[i] + '</input><br>';
    } 
    for(var i = 0; i < edgeTagsLength ; i++){
      if (DG.data.edgeTags.indexOf(edgeTags[i]) !== -1 ){ checkedAttribute = "checked "; }
      else { checkedAttribute = ""; }
      edgeCheckboxes += '<input class="edgeTag" id = "' + edgeTags[i] + '" ' +
      'name = "' + edgeTags[i] + '" ' +
      'type = "checkbox" value ="' + edgeTags[i] + '" ' +
      checkedAttribute +
      '>' + edgeTags[i] + '</input><br>';
    }     
    bootbox.dialog({
        title:"Select Theme",
        message:"Monster keywords:" +
        '<form class="form"> ' +        
        '<div class="row">  ' +
        
        '<div class="col-md-6 form-group"> ' + monsterCheckboxes + 
        
        '</div>'+
        '<div class="col-md-6 form-group"> Nodes (not for Wilds yet)<br>' + nodeCheckboxes + '<br><br>Edges (not for Wilds yet)<br>' + edgeCheckboxes +
        
        '</div>'+
        ' </div> </form><br> ',
        buttons:{
          save:{ 
                 label: "Use selected",
                 className: "btn-success",
                 callback: function() {
                   var monsterTags = $('input.monsterTag:checkbox:checked').map(function() {
                     return this.value;
                   }).get();
                   var nodeTags = $('input.nodeTag:checkbox:checked').map(function() {
                     return this.value;
                   }).get();
                   var edgeTags = $('input.edgeTag:checkbox:checked').map(function() {
                     return this.value;
                   }).get();
                   DG.data.monsterTags = monsterTags;
                   DG.data.nodeTags = nodeTags;
                   DG.data.nodeTable = DG.filterListByTags(DG.stock.nodeLabels,nodeTags);
                   DG.data.edgeTags = edgeTags;
                   DG.data.edgeTable = DG.filterListByTags(DG.stock.edgeLabels,edgeTags);
                 }
                },
          all:{ 
             label: "Any",
             className: "btn-success",
             callback: function() {
               DG.data.monsterTags = [];
               DG.data.nodeTags = [];
               DG.data.nodeTable = [];
               DG.data.edgeTags = [];
               DG.data.edgeTable = [];}
             }
      }
    });
  },
  
    //style dialog
  styleBox: function(){
      var bgColorList = ["white", "wheat", "salmon", "lightblue", "lightgreen", "lightgray"];
      var solidColorList = ["gray", "black", "red", "green", "blue", "maroon", "brown", 'darkblue', 'gunmetal'];
      var shapeList = ["box","ellipse","circle","database","text","diamond","dot", "star", "triangle","triangleDown","square"];
      var widthList = ["0","1","2","3","4","5","6","8","10"];
      var radiusList = ["0","1","2","3","4","5","6","8","10"];        
      var sizeList = ["5", "10","15","20","25","30"];
      
      var currentBgColor = DG.data.style.bgColor;
      var currentBorderColor = DG.data.style.border;
      var currentEdgeWidth = DG.data.style.edges.width;
      var currentBorderWidth = DG.data.style.borderWidth;
      var currentShape = DG.data.style.shape;
      var currentSize = DG.data.style.size;
      var currentBoxBorderRadius = DG.data.style.borderRadius;
      var currentFontFace = DG.data.style.fontFace;
      
      var bgColorOptions = DG.view.buildOptions(bgColorList,currentBgColor);
      var borderColorOptions = DG.view.buildOptions(solidColorList,currentBorderColor);   
      var edgeWidthOptions = DG.view.buildOptions(widthList,currentEdgeWidth);
      var borderWidthOptions = DG.view.buildOptions(widthList,currentBorderWidth);
      var shapeOptions = DG.view.buildOptions(shapeList, currentShape);
      var sizeOptions = DG.view.buildOptions(sizeList, currentSize);
      var boxBorderRadiusOptions = DG.view.buildOptions(radiusList,currentBoxBorderRadius);
      
      var style = DG.data.style;
      var dialogOptions = {
          title: "Map style",
          message: 'Choose style options' +
               DG.view.blankForm (
                 DG.view.controlDiv('Font ', DG.view.textInputControl('fontFace', currentFontFace ) )+
                 DG.view.controlDiv('Background Color ', DG.view.selectControl("bgColor",bgColorOptions) )+ 
                 DG.view.controlDiv('Border Color ', DG.view.selectControl("borderColor",borderColorOptions) )+                                
                 DG.view.controlDiv('Edge Width ', DG.view.selectControl("edgeWidth",edgeWidthOptions) ) +
                 DG.view.controlDiv('Node Shape ', DG.view.selectControl("shape",shapeOptions) ) +
                 DG.view.controlDiv('Node Size (if label outside) ', DG.view.selectControl("nodeSize",sizeOptions) ) + 
                 DG.view.controlDiv('Border radius (if box shape) ', DG.view.selectControl("boxBorderRadius",boxBorderRadiusOptions) ) +                    
                 DG.view.controlDiv('Border Width ', DG.view.selectControl("borderWidth",borderWidthOptions) ) 
               ),
          buttons: {
             
              save: {
                  label: "Use selected",
                  className: "btn-success",
                  callback: function () {
                      console.dir ($("input#fontFace"))
                      DG.data.style.fontFace = $("input#fontFace").val();
                      DG.data.style.bgColor = $("select#bgColor option:selected").text();
                      DG.data.style.highlightBgColor = $("select#bgColor option:selected").text();
                      DG.data.style.border = $("select#borderColor option:selected").text();
                      DG.data.style.edges.width = $("select#edgeWidth option:selected").text();
                      DG.data.style.borderWidth = $("select#borderWidth option:selected").text();
                      DG.data.style.shape = $("select#shape option:selected").text();
                      DG.data.style.size = parseInt($("select#nodeSize option:selected").text());
                      DG.data.style.borderRadius = parseInt($("select#boxBorderRadius option:selected").text());
                  }
              },
              base: {
                  label: "Use default",
                  className: "btn-success",
                  callback: function () {
                      DG.data.style = DG.defaultStyle;
                  }
              }

          }
      };
      console.dir(dialogOptions);
    bootbox.dialog(dialogOptions);
  },
  
  // Arguments to the Vis.Network creation call ----------------------------------------------
  nodeDialog: function(newData,callback){
    bootbox.dialog({
      title:"Edit Location",
      message: '<div class="row">  ' +
        '<div class="col-md-12"> ' +
        '<form class="form"> ' +
        '<div class="form-group"> ' +
        '<label class="col-md-4 control-label" for="name">Name</label> ' +
        '<input id="location_name" name="location_name" type="text" placeholder="Location name" value="' + DG.nodesDataSet.get(newData.id).label +
          '" class="form-control input-md"/> ' +
        '</div>'+

        '<div class="form-group"> ' +
          '<label class="col-md-4 control-label" for="description">Description</label> ' +
          '<textarea id="location_description" name="location_description" type="text"  placeholder="Location description" value="' + DG.brToLf(DG.nodesDataSet.get(newData.id).title) + '" '+
          'class="form-control" rows="8" columns = "30">' + DG.brToLf(DG.nodesDataSet.get(newData.id).title) + '</textarea>'+
        '</div> ' +
        '</form><button id="reroll_node_title">Reroll</button> </div>  </div>',
      buttons: {
          save: {
            label: "Save",
            className: "btn-success",
            callback: function() {
            newData.label =  $('#location_name').val();
            newData.title =  DG.lfToBr($('#location_description').val());
            DG.addMonstersToList();
            DG.nodesDataSet.update(newData);
            DG.fillKey();
            callback(newData);

            }
         }                
      }       
    });		 	
  
  },
  formatOption: function(node,selectedId){
    var option =  '<option value="' + node.id + '"';
  if (selectedId === node.id){
    option += " selected ";
  }
  option += '>' + node.label + '</option>';

  return option;
  },
  formatFromOption: function(node){
    return DG.formatOption(node,DG.fromOption);
  },
  formatToOption: function(node){
    return DG.formatOption(node,DG.toOption);
  },
  
  fromOptions: function(selectedId){
    DG.fromOption = selectedId;
    var optionsList = DG.nodesDataSet.map(DG.formatFromOption,{fields:["id","label"],
                                    returnType: "Object"});
  DG.fromOption = null;
  return optionsList.join('\n');

  },
  toOptions: function(selectedId){
    DG.toOption = selectedId;
    var optionsList = DG.nodesDataSet.map(DG.formatToOption,{fields:["id","label"],
                                    returnType: "Object"});
  DG.toOption = null;
  return optionsList.join('\n');

  },
  edgeDialog: function(thisEdge, callback){
     var fromNodeId = thisEdge.from;
   var toNodeId = thisEdge.to;
     bootbox.dialog({
      title:"Edit Path between Locations",
      message: '<div class="row">  ' +
        '<div class="col-md-12"> ' +
        '<form class="form"> ' +
        '<div class="form-group"> ' +
        '<label class="col-md-4 control-label" for="name">Name</label> ' +
        '<input id="edge_name" name="edge_name" type="text" placeholder="Path name" value="' + thisEdge.label +
          '" class="form-control input-md"/> ' +
        '</div>'+
        '<div class="form-group"> ' +
          '<label class="col-md-4 control-label" for="fromNode">From</label> ' +
          '<select id="fromNode">' + DG.fromOptions(fromNodeId) + '</select>' +
        '</div>'+
        '<div class="form-group"> ' +
          '<label class="col-md-4 control-label" for="toNode">To</label> ' +
          '<select id="toNode">' + DG.toOptions(toNodeId) + '</select>' +
        '</div>'+
        '</form> </div>  </div>',
      buttons: {
          save: {
            label: "Save",
            className: "btn-success",
            callback: function() {
            thisEdge.label =  $('#edge_name').val();
                    thisEdge.from =  $('#fromNode').val();
            thisEdge.to =  $('#toNode').val();
            DG.edgesDataSet.update(thisEdge);
            callback(thisEdge);

            }
          }

      }
        

     })		 
  },
  drawOptions: { 
    physics:{
      enabled: true,
      forceAtlas2Based:{}
    },
    configure: {enabled: false},
    manipulation: {
      enabled: true,
      initiallyActive: false,		
      addNode: function(data,callback) {
            /** data = {id: random unique id,
            *           label: new,
            *           x: x position of click (canvas space),
            *           y: y position of click (canvas space),
            *           allowedToMoveX: true,
            *           allowedToMoveY: true
            *          };
            */
        var i = DG.data.nodes[DG.data.nodes.length - 1].id + 1;

            var newData = DG.makeNode(i, DG.nameNode(i+1) ); 
                            // alter the data as you want.
                                // all fields normally accepted by a node can be used.
        DG.nodesDataSet.add(newData);

            callback(newData);  // call the callback to add a node.
        },
      editNode: function(data,callback) {
            /** data = {id:...,
            *           label: ...,
            *           group: ...,
            *           shape: ...,
            *           color: {
            *             background:...,
            *             border:...,
            *             highlight: {
            *               background:...,
            *               border:...
            *             }
            *           }
            *          };
            */

            var newData = data; // alter the data as you want.
                                // all fields normally accepted by a node can be used.
          DG.nodeDialog(newData,callback);
        },
        editEdge: function(data,callback) {
            /** data = {id: edgeID,
            *           from: nodeId1,
            *           to: nodeId2,
            *          };
            */
            var newData = data; // alter the data as you want, except for the ID.
                                // all fields normally accepted by an edge can be used.a
            bootbox.dialog({
              title:"Edit Path between Locations",
              message: '<div class="row">  ' +
                '<div class="col-md-12"> ' +
                '<form class="form"> ' +
                '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="name">Name</label> ' +
                '<input id="edge_name" name="edge_name" type="text" placeholder="Path name" value="' + DG.edgesDataSet.get(newData.id).label +
                  '" class="form-control input-md"/> ' +
                '</div>'+
                '</form> </div>  </div>',
              buttons: {
                  save: {
                    label: "Save",
                    className: "btn-success",
                    callback: function() {
                    newData.label =  $('#edge_name').val();

                    DG.edgesDataSet.update(newData);
                    callback(newData);

                    }
                  }

              }
                

            })
          
        },
        addEdge: function(data,callback) {
            // data = {from: nodeId1, to: nodeId2};
         var newData = {};
             for (var attrname in data) { newData[attrname] = data[attrname]; }
         newData.label = DG.randomEdgeLabel();

         DG.edgesDataSet.add(newData);
         // check or alter data as you see fit.
             callback(newData);       // call the callback to connect the nodes.
        },
        deleteNode: function(data,callback) {
         //   data = {nodes: [selectedNodeIds], edges: [selectedEdgeIds]};
          var newData = data; // alter the data as you want.
                               //  the same data structure is required.
                  // WILL NEED TO REMOVE THEM FROM THE LISTS IN DG.data
          DG.edgesDataSet.remove(newData.edges);
          DG.nodesDataSet.remove(newData.nodes);
          DG.fillKey();
          callback(newData);  // call the callback to delete the objects.
        },
        deleteEdge: function(data,callback) {
        // duping deleteNode in translation from 3.6 to 4.4 for now, probably needs revision
         //   data = {nodes: [selectedNodeIds], edges: [selectedEdgeIds]};
          var newData = data; // alter the data as you want.
                               //  the same data structure is required.
                  // WILL NEED TO REMOVE THEM FROM THE LISTS IN DG.data
          DG.edgesDataSet.remove(newData.edges);
          DG.fillKey();
          callback(newData);  // call the callback to delete the objects.
        }
    }
  },
  data: { nodes:[],
          edges:[],
          notes: '',
          monsterTags:[],
          monsters: {},
          nodeTags:[],
          edgeTags:[],
          nodeTable: [],
          edgeTable: [],
          style: {
            border: 'gray',
            borderWidth: 1,
            borderRadius: 6,
            highlightBorder: 'black',
            fontSize: 14,
            fontFace: "arial", 
            shape: "box",
            size: 20,
            bgColor: "lightgray",
            highlightBgColor: "lightgray",
            edges: { width: 1 }
          },
      
        },
  defaultStyle: {
            border: 'gray',
            borderWidth: 1,
            borderRadius: 6,
            highlightBorder: 'black',
            fontSize: 14,
            fontFace: "arial",
            shape: "box",
            size: 20,
            bgColor: "lightgray",
            highlightBgColor: "lightgray",
            edges: { width: 1 }
          },           
  nodesDataSet:"uninitialized",
  edgesDataSet:"uninitialized",
  // Shared variables
  roomCount: 0,
  edgeCount: 0,
  minRooms: 5,
  maxRooms: 10,
  dungeonLevel: 0,
  monsterTreasureMultiplier: 1,
  initNetwork: function(){
    var data;
    DG.nodesDataSet = new vis.DataSet(DG.data.nodes);
    DG.nodesDataSet.on('*', function (event, properties, senderId) {
        DG.data.nodes = DG.nodesDataSet.get();
        DG.data.edges = DG.edgesDataSet.get();
        DG.fillKey();		
      });
    DG.edgesDataSet = new vis.DataSet(DG.data.edges);
      DG.edgesDataSet.on('*', function (event, properties, senderId) {
         DG.data.edges = DG.edgesDataSet.get();
         DG.fillKey();
      });
    data = {nodes: DG.nodesDataSet, edges: DG.edgesDataSet};
    DG.network = new vis.Network(DG.container, data, DG.drawOptions);
  ;
    DG.fillKey();
  },
  replaceText: function(textFrom, textTo){ 
    var len = DG.data.nodes.length;
    function replaceAll(findVal, replaceVal, str) {
        return str.replace(new RegExp(findVal, 'g'), replaceVal);
    }
    for (i = 0; i < len; i++){
       DG.data.nodes[i].title = replaceAll(textFrom, textTo, DG.data.nodes[i].title)
    }
    DG.data.notes = replaceAll(textFrom, textTo, DG.data.notes)
    $("#notes").val(DG.data.notes);
    DG.fillKey();
  },
  // Randomization Utilities -----------------------------------------------------------------
  rollDie: function(start,size){ 
    var roll = Math.floor(Math.random() * (size)) + start ;
    return roll; }, 
  rollOne: function(){ return Math.random() < 0.16667; },
  rollTwo: function(){ return Math.random() < 0.3334; },
  rollThree: function(){ return Math.random() <= 0.5; },
  rollFour: function() {return Math.random() < 0.66667;},
  rollFive: function() {return Math.random() < 0.83334;},
  rollOther: function(start,size,excludedRoll){
    var roll = excludedRoll;
    while (roll == excludedRoll){ roll = DG.rollDie(start,size);}
    return roll;
  },
  drawOne: function(list){ return list[DG.rollDie(0, list.length )];},
  shufflePopOne: function(list){ var item = "";
                          list = DG.shuffle(list);
                          item = list.pop();
                          return [item,list];
  },
  arrayToSet: function(a) {
    var hash = {};
    for (var i = 0; i < a.length; i++)
        hash[a[i]] = true;
    var r = [];
    for (var k in hash)
        r.push(k);
    return r;
  },
  shuffle: function(array) {
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
  //   UI handlers - move to ui file?  ------------------------------------------------------- 
  populateSavedSelect: function(){
    // populate the saved dungeons select
    var dungeonSelect = document.getElementById("saved");
    dungeonSelect.innerHTML = ""
    var keys = [];
    var key = "";
    for (i = 0; i < localStorage.length; i +=1){
      key = localStorage.key(i);
      keys.push(key);
    };
    if (keys.length > 0) {  DG.addOptionsToSelect(dungeonSelect,keys); };
  },
  addOptionsToSelect: function(select,optionsList){
  
    for(var i = 0; i < optionsList.length; i += 1) {
      var opt = document.createElement('option');
      opt.value = optionsList[i];
      opt.innerHTML = optionsList[i];
      select.appendChild(opt);
    }
  },
  saveDungeon: function(){var key = document.getElementById("dungeon_name").value;
                          var dungeonString = JSON.stringify(DG.data);
              localStorage[key] = dungeonString;
              var dungeonSelect = document.getElementById("saved");
              DG.populateSavedSelect();
  },
  loadDungeon: function(){ 
    var dungeonSelect = document.getElementById("saved");
    var selectedKey = "";
    var dungeonData = "unloaded";
    if (dungeonSelect.selectedIndex == -1) {
      alert("No dungeon selected to load");
      return null;
    };
    selectedKey = dungeonSelect.options[dungeonSelect.selectedIndex].text;
    dungeonData = localStorage[selectedKey];
    if (dungeonData !== "unloaded"){
        DG.data = JSON.parse(dungeonData);
        DG.initNetwork();
        document.getElementById("dungeon_name").text = selectedKey;
        document.getElementById("dungeon_name").value = selectedKey;
        $("#notes").val(DG.data.notes);
  }  
  },  

  deleteDungeon: function(){
    var dungeonSelect = document.getElementById("saved");
    var selectedKey = dungeonSelect.options[dungeonSelect.selectedIndex].text;
    var message = "Permanently delete dungeon " + selectedKey + " from storage?";
    if (confirm(message)){
    localStorage.removeItem(selectedKey);
    DG.populateSavedSelect();
    }
  },
  exportDungeon: function(){var dungeonString = JSON.stringify(DG.data);
    $("#export-import").val(dungeonString);
  },  // export a file with the data structure
  importDungeon: function(){
    var dungeonData = $("#export-import").val();
    DG.data = JSON.parse(dungeonData);
    DG.initNetwork();
    $("#notes").val(DG.data.notes);
  }, //import a file previously exported

  // Nodes and Linkage ------------------------------------------------------------------------
  linkStrats: {},  // complex enough for a separate breakout below
  allNodeIds: function(){ 
     var nodeIds = [];
     DG.data.nodes.forEach(function(node){
       nodeIds.push(node.id);
     });
     return nodeIds;
  },
  addMonstersToList: function(){
    if ( DG.monsterHold !== undefined ){
      if (DG.data.monsters[DG.monsterHold["name"]]  !== undefined){
        DG.data.monsters[DG.monsterHold["name"]]["count"] = DG.monsterHold.count
      } else { DG.data.monsters[DG.monsterHold["name"]] = DG.monsterHold; }
      DG.monsterHold = undefined;
    }
    
  },

  makeNode: function(id,label) { 
  var border = DG.data.style.border,
    borderWidth = DG.data.style.borderWidth,
    borderRadius =  DG.data.style.borderRadius,   
    borderWidthSelected = borderWidth * 1.2,
    bgColor = DG.data.style.bgColor, 
    shape = DG.data.style.shape,
    size = DG.data.style.size,     
    fontSize = DG.data.style.fontSize,
    fontFace = DG.data.style.fontFace,    
    highlightBgColor = DG.data.style.highlightBgColor, 
    highLightBorder = DG.data.style.highlightBorder;
  
  var contents = DG.makeContents(DG.data.dungeonLevel);
  DG.addMonstersToList();
  return {  id: id, 
            shape: shape,
            size: size,
            font: { size: fontSize, face: fontFace },
            borderWidth: borderWidth,
            borderWidthSelected: borderWidthSelected,
            shapeProperties: { borderRadius: borderRadius},
            color: {
              background: bgColor,
              border: border,             
              highlight: {
                background: highlightBgColor,
                border: highLightBorder
              }
            },                                          
            label: label, 
            title: contents, 
            group: ""};
  },
  makeEdge: function(startNode,endNode) { 
    if (startNode === undefined) {return "error"};
    if (endNode === undefined) {return "error"};
    return {from: startNode, to: endNode, label: this.randomEdgeLabel(), width: DG.data.style.edges.width, font: {face: DG.data.style.fontFace, size: DG.data.style.fontSize }};
  },
  linksOnNode: function(nodeId) { return edges = DG.data.edges.filter(function( edge ) {
    return (edge.from === nodeId || edge.to === nodeId); });
  },
  linkNodes: function(startEdge,endEdge){
    var edge = DG.makeEdge(startEdge,endEdge);
    if (edge === "error"){ console.log( "attempting to link undefined node"); return}
    DG.data.edges.push(DG.makeEdge(startEdge,endEdge));
  },
  setRandomRoomCount: function(){
    DG.roomCount = DG.rollDie(DG.minRooms, (DG.maxRooms - DG.minRooms) );
  return DG.roomCount;
  },
  setBaseMonsters: function() {
      var monsterSourceList;
      if (DG.data.dungeonLevel === "wilds"){
        // Not going to deal with multiple levels of base monsters
        DG.data.baseMonsters = [];
        return;
      }
      if (DG.data.locationType === "wilds"){
        monsterSourceList = DG.wild.monsters;

        
      } else { monsterSourceList = DG.stock.monsters; }
      DG.data.baseMonsters = [];
      if ((DG.data.monsterTags  !== undefined) &&  (DG.data.monsterTags !== []) ){ 
        var fullMonsterList = monsterSourceList[DG.data.dungeonLevel];       
        for (var i = 0; i < fullMonsterList.length; i++){ 
           if (DG.tagMatch(fullMonsterList[i].tags, DG.data.monsterTags)){
              DG.data.baseMonsters.push(fullMonsterList[i]);
           }
        }   
        if (DG.data.baseMonsters.length > 0) {return } // fall through to random if we found nothing matching the theme tags
      } 
    
      DG.data.baseMonsters = [DG.drawOne(monsterSourceList[DG.data.dungeonLevel])];
      if (DG.rollFour()){DG.data.baseMonsters.push(DG.drawOne(monsterSourceList[DG.data.dungeonLevel]))};
      if (DG.rollFour()){DG.data.baseMonsters.push(DG.drawOne(monsterSourceList[DG.data.dungeonLevel]))};

  },
  
  filterListByTags: function(fullList,filterTags){
    var filteredList = [];
    for (var i = 0; i < fullList.length; i++){ 
           if (DG.tagMatch(fullList[i].tags, filterTags)){
              filteredList.push(fullList[i]);
           }
        }
    return filteredList;        
  },
  
  makeRooms: function(){
    DG.setBaseMonsters();
    for(var i = 0; i < DG.roomCount; i+=1){
      DG.data.nodes[i] = DG.makeNode(i, DG.nameNode(i+1) );
    }
  },

  nameNode: function(nodeNum){ 
    return "" + (nodeNum) + ": " + DG.randomNodeLabel()}, 
    
  randomNodeLabel: function(){
    var nodeLabel;
    if (DG.data.locationType == "wilds"){return this.drawOne(this.wild.nodeLabels);}
    else  { 
        if (DG.data.nodeTable  === undefined) { return DG.drawOne(DG.stock.nodeLabels).label;}
        if (DG.data.nodeTable.length > 0) {  return DG.drawOne(DG.data.nodeTable).label; }
        return DG.drawOne(DG.stock.nodeLabels).label;        
    }
   },
          
  randomEdgeLabel: function(){
    if (DG.data.locationType == "wilds"){return this.drawOne(this.wild.edgeLabels)}
    else  { 
      if (DG.data.edgeTable  === undefined) { return DG.drawOne(DG.stock.edgeLabels).label;}
      if (DG.data.edgeTable.length > 0) {  return DG.drawOne(DG.data.edgeTable).label; }
      return DG.drawOne(DG.stock.edgeLabels).label;
    } 
  },
    
  // Node Content Randomization section ---------------------------------------------
  makeContents: function(dungeonLevel){ 
    var contents= "";
    var treasureRoll = 1;
    DG.monsterTreasureMultiplier = 1;
    DG.treasureLevel = 1;

    if (DG.rollOne()){ contents += DG.randomOddity(dungeonLevel);}
    if (DG.rollOne()){ contents += DG.randomTrap(dungeonLevel);
                      treasureRoll += 1;
                       }
    if (DG.rollTwo()){ contents += DG.randomMonsters(dungeonLevel,true);
                     treasureRoll += 2;
                     }
    // More monsters, chance of bigger mixed set, with high treasure odds
    if (DG.rollTwo()){ contents += DG.randomMonsters(dungeonLevel,true);
                     treasureRoll += 2;
                     }
    if (DG.data.dungeonLevel === "wilds"){
        if (DG.rollDie(1,6) <= treasureRoll){contents += DG.randomTreasure(DG.treasureLevel)}; 
    } else {   
       if (DG.rollDie(1,6) <= treasureRoll){contents += DG.randomTreasure(dungeonLevel)}; 
    }
    if (DG.rollOne()){ contents += DG.randomHook();}
    // let's have fewer truly empty rooms
    if (contents == "" && DG.rollThree()){ contents += DG.randomOddity(dungeonLevel);}
    if (contents == "" && DG.rollTwo()){ contents += DG.randomHook(dungeonLevel);}
    if (contents == "") {contents= "Empty"}
    return contents; 
  },
  randomOddity: function(dungeonLevel){ 
    // ignoring dungeonLevel for now
    return DG.drawOne(DG.stock.oddities) + "<br>"; 
  },
  randomHook: function(){ 
    var hook = "Hook: " + DG.drawOne(DG.stock.hookItems)  + "<br>";
    return hook;
  },
  randomNpcClass: function() {
    return DG.drawOne(DG.stock.characterClasses);
  },
  randomRelationship: function(intel, targetInt, plurality){
  // simple at first
  // Then introduce int 
    var possibleRelationships = DG.stock.relationships.filter(function( rel ) { return  rel.min_subject_int <= intel }  );
    console.log(possibleRelationships);
    possibleRelationships = possibleRelationships.filter(function( rel ) { return rel.min_target_int <= targetInt }  ); 
    var relationship = DG.drawOne(possibleRelationships);
    return relationship[plurality];
  },
  randomMonsters: function(dungeonLevel,wrap){
    var undeadPrefix;  
    var monsterLevel;
    var singletonAttitude = "";
    var monsterCount = 1;
    var monsterType = {name:"", int:0, tags:[]};
    var monsterName = ""; 
    var pluralMonsterName = "";
    var attitude ="";
    var monsters = "";
    if (dungeonLevel === "wilds") {
        monsterLevel = Math.min(DG.rollDie(0,5), DG.rollDie(0,5));
        DG.treasureLevel = Math.max( DG.treasureLevel, monsterLevel);
        switch (monsterLevel) {
          case 0:
            if (DG.rollThree()){ monsterCount = Math.min( DG.rollDie(1,300),DG.rollDie(1,300) ); }
            else{ monsterCount = DG.rollDie(1,20); } 
            break;
          case 1:
            if (DG.rollTwo()){ monsterCount = Math.min( DG.rollDie(1,250),DG.rollDie(1,250) ); }
            else { monsterCount = DG.rollDie(1,20); }
            break;        
          case 2:
            monsterCount = Math.min(DG.rollDie(1,40),DG.rollDie(1,40),DG.rollDie(1,40));
            break;
          case 3:
             monsterCount = Math.min(DG.rollDie(1,30),DG.rollDie(1,30),DG.rollDie(1,30));
            break;
          case 4:
            monsterCount = Math.min(DG.rollDie(1,16),DG.rollDie(1,16),DG.rollDie(1,16));
            break;
          case 5:
            monsterCount = Math.min(DG.rollDie(1,6),DG.rollDie(1,6));
            break;
          default:
            monsterCount = DG.rollDie(1,6);
          
        } 
        
    }  
    else {
        monsterLevel = dungeonLevel;
        // how many and what level?
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
    }
    monsterType = DG.selectMonster(monsterLevel); 
     
 
    // Fill in the string -----------------
    
    if ( DG.tagMatch(["undead"],DG.data.monsterTags) && !DG.tagMatch(monsterType.tags,["undead"]) ){ undeadPrefix = "undead " } else {undeadPrefix = ""}
    if ( DG.tagMatch(["demon"],DG.data.monsterTags) && !DG.tagMatch(monsterType.tags,["demon,devil,dragon"]) ){ demonicPrefix = "demonic " } else {demonicPrefix = ""}
    if ( DG.tagMatch(["devil"],DG.data.monsterTags) && !DG.tagMatch(monsterType.tags,["demon,devil,dragon"]) ){ demonicPrefix = "infernal " } else {demonicPrefix = ""}
    // Plural?
     if (monsterType.hasOwnProperty("plural")){ pluralMonsterName = monsterType.plural; }	      
      else { pluralMonsterName = monsterType.name + "s"; }
    if (monsterCount > 1){
      monsterName = pluralMonsterName;
    } else { monsterName = monsterType.name; }
    if (DG.rollTwo()){ monsterName = undeadPrefix + monsterName; }
    if (DG.rollOne()){ monsterName = demonicPrefix + monsterName; }
    if (wrap){ monsters = "M: " } else {monsters = ""}
    monsters += monsterCount 
    // Add descriptive attitudes but only sometimes, to avoid being cloying.
    // Choose from complex or simple motivations table based on the INT of the monster type.
    DG.monsterHold = { name: pluralMonsterName, single_name: monsterType.name, count: monsterCount, int: monsterType.int, tags: monsterType.tags };
    if (DG.shouldDetailNpcs(monsterType) ){
       monsters += " " + monsterName;
       if (wrap) {monsters += ":<br>"; } else { monsters += ":\n" }
       monsters += DG.detailNpcs( monsterLevel, monsterCount, monsterType, wrap ); 
    } else {
     if (DG.rollTwo()){ 
       attitude = DG.randomAttitude(monsterType);
       monsters += " " + attitude;
     }else if (DG.rollThree() && monsterCount > 1 ){
       singletonAttitude = ", one is " + DG.randomAttitude(monsterType);
     };
    monsters += " " + monsterName + singletonAttitude;
    if (wrap) { monsters += "<br>"; }
    }
   
    
    // side effect - adjust monster multiplier for treasure    
    DG.updateMonsterTreasureMultiplier(monsterLevel,monsterCount, monsterType); 
    return monsters;
  },
  randomAttitude: function(monsterType) { 
    if (monsterType.int < 7){ return DG.drawOne(DG.stock.basicAttitudes); }
    return DG.drawOne(DG.stock.allAttitudes);
  },
  
  shouldDetailNpcs: function(monsterType){ return DG.tagMatch(monsterType.tags, ["adventurer", "overlord", "npc"]); },
  
  getNpcLevel: function(monsterLevel){
    if (monsterLevel === 0) {
            if (DG.rollTwo()) { return "2" } 
            return "1" ; }
    else if (monsterLevel === 1) {
            if (DG.rollOne()) { return "1" };
            if (DG.rollOne()) { return "4" };
            if (DG.rollThree()) { return "2" };
            return "3"; }
     else if (monsterLevel === 2) {
            if (DG.rollOne()) { return "6" };
            if (DG.rollOne()) { return "3" };
            if (DG.rollThree()) { return "5" };
            return "4"; }

     else if (monsterLevel === 3) {
          //mostly 6-7
            if (DG.rollOne()) { return "8" };
            if (DG.rollOne()) { return "5" };
            if (DG.rollThree()) { return "7" };
            return "6";  }         

     else if (monsterLevel === 4) {
            if (DG.rollOne()) { return "10" };
            if (DG.rollOne()) { return "7" };
            if (DG.rollThree()) { return "9" };
            return "8"; }          
    else {
          // mostly 10 - 12
            if (DG.rollOne()) { return "13" };
            if (DG.rollOne()) { return "14" };
            if (DG.rollOne()) { return "9" };
            if (DG.rollTwo()) { return "12" };
            if (DG.rollThree()) { return "11" };
            return "10";  
      }    
  },
  
  detailNpcs: function(monsterLevel, monsterCount, monsterType,wrap ){
    var npcBlock = "";
    for (var i = 0; i < monsterCount; i++){
      if (DG.rollTwo()) { npcBlock += DG.randomAttitude(monsterType) + " ";};
      npcBlock += DG.randomNpcClass() + " ";
      npcBlock += DG.getNpcLevel(monsterLevel) + " ";  
      if (wrap){ npcBlock += "<br>"; } else {  npcBlock += "\n"; }     
    }
    return npcBlock;
  },
  tagMatch: function(itemTags,themeTags){
    for (var i = 0; i < itemTags.length; i++){
      if (themeTags.indexOf(itemTags[i]) !== -1) { return true; }
    }
    return false;
  },
  selectMonster: function(monsterLevel){
    var monsterSourceList;
    if (DG.data.locationType == "wilds"){monsterSourceList = DG.wild.monsters;} else { monsterSourceList = DG.stock.monsters; }
    if ((DG.data.monsterTags  !== undefined) &&  (DG.data.monsterTags !== []) ){
       // Select Monster type from long or short list
        if (DG.rollThree() || DG.data.dungeonLevel === "wilds"){ // Try several times for theme, then go random to fill in.
          for(var i = 0; i < 8; i++){
            monsterType = DG.drawOne(monsterSourceList[monsterLevel]);
            if ( DG.tagMatch(monsterType.tags,DG.data.monsterTags)) { return monsterType; }
          } 
          monsterType = DG.drawOne(monsterSourceList[monsterLevel]);
        } else { // About half come out of the base monster type for the level, for some coherence.
          // will let monster count & treasure multiplier stand, which will generate some group size/treasure outliers
          monsterType = DG.drawOne(DG.data.baseMonsters);      
        } 
    }
    else{
        // Select Monster type from long or short list
        if (DG.rollThree()  || DG.data.dungeonLevel === "wilds" ){
          monsterType = DG.drawOne(monsterSourceList[monsterLevel]);
        } else { // About half come out of the base monster type for the level, for some coherence.
          // will let monster count & treasure multiplier stand, which will generate some group size/treasure outliers
          monsterType = DG.drawOne(DG.data.baseMonsters);      
        }
    }
    return monsterType;
  },
  updateMonsterTreasureMultiplier: function(monsterLevel, monsterCount, monsterType){
    var newMonsterTreasureMultiplier;
    if (monsterType.int < 6) {
    // not smart enough to amass treasure
      newMonsterTreasureMultiplier = monsterLevel + 1;
    } else {
     // More monsters of the same type gives more treasure but don't scale linearly.
    newMonsterTreasureMultiplier = (monsterLevel + 1 ) * Math.pow(monsterCount, 0.65);
    }
    // Use the biggest multiplier of any single group of monsters in the room.
    DG.monsterTreasureMultiplier = Math.max(DG.monsterTreasureMultiplier,newMonsterTreasureMultiplier);
  },
  
  
  valueFraction: function(treasureValue){ 
    return DG.rollDie(1,9) * 0.1 * treasureValue 
  },
  oneTreasure: function(treasureValue){
    var treasureCount = 1;
    var treasureType = DG.drawOne(DG.stock.treasure);
    
  if (treasureType["value"] === "X") {
    var jewelValue = Math.floor(treasureValue * DG.rollDie(1,8));
    return treasureType["label"] + " worth " + jewelValue  + " GP";
    }
    else if (treasureType["value"] < treasureValue){
      treasureCount = Math.floor(treasureValue/treasureType["value"]);
    }
    return treasureCount + " " + treasureType["label"];
  },
  randomTreasure: function(treasureLevel){
    var hoard = "Ts: ";
    var treasureType = {};
    var treasureCount = 1;
    var treasureValue = Math.pow(1+treasureLevel, 1.5) * 10 * DG.data.treasureMultiplier;
    if (DG.rollTwo()){ treasureValue *= DG.rollDie(2,6) }
    if (DG.rollThree()){ treasureValue *= DG.rollDie(2,6) }
    if (DG.monsterTreasureMultiplier > 0 ){
      treasureValue *= DG.monsterTreasureMultiplier;
    }
    hoard += DG.oneTreasure(treasureValue);
  // second treasure
  if (DG.rollThree()){
    hoard += ", ";
    hoard += DG.oneTreasure(DG.valueFraction(treasureValue));
      if (DG.rollThree()){
      hoard += ", ";
      hoard += DG.oneTreasure(DG.valueFraction(treasureValue));
    }
  }
    hoard += "<br>";
  if (DG.rollOne()){
      hoard += "Mg: " + DG.randomMinorMagicItem(treasureLevel) + "<br>";
    }
    if (DG.rollDie(1,1000) < treasureValue){ 
      hoard += "Mg: " + DG.randomMagicItem(treasureLevel) + "<br>";
    }
  if (DG.rollDie(0,9) <= treasureLevel){
      hoard += "Mg: " + DG.randomMagicItem(treasureLevel) + "<br>";
    }
  if (DG.rollDie(1,8000) < treasureValue){
      hoard += "Mg: " + DG.randomMagicItem(treasureLevel) + "<br>";
    }
  if (DG.rollDie(1,20000) < treasureValue){
      hoard += "Mg: " + DG.randomMagicItem(treasureLevel) + "<br>";
    }

    return hoard; 
  },
  randomMagicItem: function(treasureLevel){ // will need much more detail later and more items in big hoards
    var item = DG.drawOne(DG.stock.magicItems);
  if (item === "potion") { item = "Potion of " + DG.drawOne(DG.stock.potions)};
  if (item === "sword") { item = DG.genSword(treasureLevel)};
  if (item === "weapon") { item = DG.genWeapon(treasureLevel)};

  if (item === "armor") { item = DG.genArmor(treasureLevel)};

  if (item === "wand") { item = DG.genWand(treasureLevel)};
  if (item === "ring") { item = DG.genRing(treasureLevel)};
  if (item === "staff") { item = DG.genStaff(treasureLevel)};
  if (item === "book") { item = DG.genBook(treasureLevel)};
  if (item === "scroll") { item = DG.genScroll(treasureLevel)};
    if (item === "trinket") { item = DG.genTrinket(treasureLevel)};
  if (item === "miscellaneous") { item = DG.genMisc(treasureLevel)};

  return item;},
  randomMinorMagicItem: function(treasureLevel){ // will need much more detail later and more items in big hoards
    var item = DG.drawOne(DG.stock.minorMagicItems);
    if (item === "potion") { item = "Potion of " + DG.drawOne(DG.stock.potions)};
    if (item === "scroll") { item = DG.genScroll(treasureLevel)};
    if (item === "trinket") { item = DG.genTrinket(treasureLevel)};
  return item;},
  genSword: function(treasureLevel){
    var sword = DG.drawOne(DG.stock.swords);
    var bonus = 1;
    var powerList = [];
    for (i = 0; i < treasureLevel +2; i +=1){
      if (DG.rollTwo()){bonus +=1};
      if (DG.rollTwo()) {powerList.push(DG.drawOne(DG.stock.swordPowers))};
    }
    if (powerList.indexOf("Cursed") === -1 ){
      sword += " +" + bonus;
    } else {
      sword += " -" + bonus + " Cursed";
      powerList.remove(["Cursed"]);
    }
    powerList = DG.arrayToSet(powerList);
    if (powerList !== []){
      sword += ", " + powerList.join(', ');
    }	  

    return sword;
  },
  genWeapon: function(treasureLevel){
    var weapon = DG.drawOne(DG.stock.weapons);
    var bonus = 1;
    var powerList = [];
    for (i = 0; i < treasureLevel +1; i +=1){
      if (DG.rollTwo()){bonus +=1};
      if (DG.rollOne()) {powerList.push(DG.drawOne(DG.stock.weaponPowers))};
    }
    if (powerList.indexOf("Cursed") === -1 ){
      weapon += " +" + bonus;
    } else {
      weapon += " -" + bonus + " Cursed";
      powerList.remove(["Cursed"]);

    }
    powerList = DG.arrayToSet(powerList);
    if (powerList !== []){
      weapon += ", " + powerList.join(', ');
    }	  


    return weapon;
  },
  genArmor: function(treasureLevel){
      var armor = DG.drawOne(DG.stock.armor);

      var bonus = 1;
      var powerList = [];
      for (i = 0; i < treasureLevel +1; i +=1){
        if (DG.rollTwo()){bonus +=1};
        if (DG.rollOne()) {powerList.push(DG.drawOne(DG.stock.armorPowers))};
      }
      if (powerList.indexOf("Cursed") === -1 ){
        armor += " +" + bonus;
      } else {
        armor += " -" + bonus + " Cursed";
        powerList.remove(["Cursed"]);

      }
      powerList = DG.arrayToSet(powerList);
      if (powerList !== []){
        armor += ", " + powerList.join(', ');
        }	  

      return armor;
  },
  genWand: function(treasureLevel){
    var wand = "Wand of " + DG.drawOne(DG.stock.wands);
  return wand;
  },
  genRing: function(treasureLevel){
    var ring = "Ring of " + DG.drawOne(DG.stock.rings);
  return ring;
  },
  genMisc: function(treasureLevel){
    var misc = DG.drawOne(DG.stock.miscellaneous);
  return misc;
  },
  genStaff: function(treasureLevel){
    var staff = "Staff of " + DG.drawOne(DG.stock.staves);
  return staff;
  },
  genBook: function(treasureLevel){
    var book = DG.drawOne(DG.stock.books);
  return book;
  },
  genScroll: function(treasureLevel){
    var scroll = DG.drawOne(DG.stock.scrolls);
  return scroll;
  },
  genTrinket: function(treasureLevel){
    var trinket = DG.drawOne(DG.stock.trinkets);
  return trinket;
  },
  randomTrap: function(dungeonLevel){
  // will tie to dungeonLevel later
    var trap = DG.drawOne(DG.stock.traps);
  if (DG.rollTwo()){trap += " disarmed by " + DG.drawOne(DG.stock.disarms)}
  if (DG.rollThree()){trap += ", triggered by " + DG.drawOne(DG.stock.triggers)}

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
  var fileName = prompt("Name for image file?","dungeon.png");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");;
  link.click();

  },
  populateNotes: function(){ return DG.wanderingMonstersNote() + "\n" + DG.relationsNote();},
  
  wanderingMonstersNote: function() { 
    var monsterList = "Wandering Monsters\n";
    var monsterCount = Math.round(DG.data.nodes.length/6) + 1;
    if (DG.rollThree()){monsterCount+=1}
    if (DG.rollThree()){monsterCount+=1}
    for (var i = 1; i <= monsterCount; i+=1){
      monsterList += ("" + i + ": " + DG.randomMonsters(DG.data.dungeonLevel, false) + "\n");
      DG.addMonstersToList();
    }
    return monsterList;
  },
  relationsNote: function() {
    var relationsList = "";
    var relationship = ""
    var monster = {};
    var target = {};
    var intel;
    var targetInt;
    var plurality;
    var name;
    // before this method need to have a hash of rolled monsters to their number
    // store in a temp value when rolled
    // commit to the hash when a node's title is set or a wandering monster is set
    // will disregard decrementing on edits
    // reskinning should also adjust the key
    for (var prop in DG.data.monsters)
      if (DG.data.monsters.hasOwnProperty(prop)){
        if( DG.rollFour() ){
          monster = DG.data.monsters[prop];
          target = DG.data.monsters[DG.drawOne( Object.keys(DG.data.monsters) )];
          if (target === monster) {
            target = DG.data.monsters[DG.drawOne( Object.keys(DG.data.monsters) )];
            if (target === monster) {
              target = DG.data.monsters[DG.drawOne( Object.keys(DG.data.monsters) )];
            }
          }
          if (target.count > 1) {targetName = target.name} else {targetName = target.single_name}; 
          intel = monster["int"];
          if ( monster.count > 1 ) { 
            plurality = "plural_text";
            name = monster.name;

          } else { 

            plurality = "single_text";
            name = monster.single_name;

          }
          targetInt = target["int"];
          
          relationship = "The " + name + " " + DG.randomRelationship(intel, targetInt, plurality) + " the " + targetName + ".";
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
  
  // Dungeon Key table -------------------------------------------------
  fillKey: function() { 
   //This function will render out the labels and descriptions from 
   //DG.data.nodes into table#dungeon_key
  var dungeonKey = "<thead>\n<tr><th>Location</th><th>Description (click in a cell to edit)</th></tr>\n</thead><tbody>"
  var tln = "<tr class='node_row' id ='" 
  var tle = "<tr  class='edge_row'id ='" 
  var tlm = "'><td class='dungen'>";
  var tm = "</td><td class='dungen dg_description'>";
  var tr = "</td></tr>";
  var node = {};
  var nodesLength = DG.data.nodes.length;
  var edge = {};
  var edgesLength = DG.data.edges.length;
  var fromNodeLabel, toNodeLabel;
  for (i = 0; i < nodesLength; i +=1){
      node = DG.data.nodes[i];
      dungeonKey = dungeonKey + ( tln + node["id"] + tlm + node["label"] + tm + node["title"] + tr );
   }
   dungeonKey += "\n</tbody>";
   dungeonKey += "\n<tbody>";
   for (i = 0; i < edgesLength; i +=1){
      edge = DG.data.edges[i];
      fromNodeLabel = DG.findInArrayById(edge["from"], DG.data.nodes)["label"];
      toNodeLabel = DG.findInArrayById(edge["to"], DG.data.nodes)["label"];
      dungeonKey = dungeonKey + ( tle + edge["id"] + tlm + edge["label"] + tm + fromNodeLabel + " to " + toNodeLabel + tr );
   }
   dungeonKey += "\n</tbody>";
   document.getElementById("dungeon_key").innerHTML = dungeonKey;
  },
  findInArrayById: function(id,arrayToSearch){ return $.grep(arrayToSearch, function(e){ return e.id == id; })[0];  },
  // Dig a dungeon ---------------------------------------------------------
  digDungeon: function(locationType){
    var data = { nodes: null, edges: null };
    var levelSelect = document.getElementById("level");
    var sizeSelect = document.getElementById("size");
    var patternSelect = document.getElementById("pattern");
    var selectedSize = "5,5";
    var dungeonLevelSelected = levelSelect.options[levelSelect.selectedIndex].value;
    var selectedPattern = patternSelect.options[patternSelect.selectedIndex].value;
    DG.data.nodes = [];
    DG.data.edges = [];
    DG.data.monsters = {};
    DG.monsterHold = undefined;
    DG.data.locationType = locationType;
    DG.data.treasureMultiplier = parseFloat($("#treasureMultiplier").val()) || 1;
    DG.roomCount = 0;
    DG.edgeCount = 0;
    if (dungeonLevelSelected === "wilds") {DG.data.dungeonLevel = dungeonLevelSelected } else { DG.data.dungeonLevel = parseInt(dungeonLevelSelected); }
    selectedSize = sizeSelect.options[sizeSelect.selectedIndex].value;
    DG.minRooms = parseInt(selectedSize.split(",")[0]);
    DG.maxRooms = parseInt(selectedSize.split(",")[1]);
    DG.setRandomRoomCount();
 
    DG.makeRooms();
    DG.data.notes = DG.populateNotes();
    

  switch (selectedPattern) {
  case "branch":
    DG.linkStrats.branchLink(DG.allNodeIds());
    break;
  case "branch_loops":
    DG.linkStrats.branchLink(DG.allNodeIds());
    DG.linkStrats.randomLink(Math.floor(DG.roomCount/5) + 1);
    break;
  case "triangles":
    DG.linkStrats.trianglesLink(DG.allNodeIds());
    DG.linkStrats.randomLink(Math.floor(DG.roomCount/6) + 1);
    break;
  case "grid":
    DG.linkStrats.gridLink();
    break;
  case "random":
    DG.linkStrats.randomAllLink(Math.floor(DG.roomCount) + 2);
    break;
  case "mixed":

  break;
  default:
  }
    DG.initNetwork();
    $("#notes").val(DG.data.notes);
  }
  
};

// link strategies  --------------------------------------------------------------------
DG.linkStrats = {
  branchLink: function(roomIds) { 
    var nodes = roomIds.length;
    var linkedNodes = [];
    var unlinkedNodes =roomIds.slice();

    unlinkedNodes = DG.shuffle(unlinkedNodes);
    var currentNodeID = unlinkedNodes.pop();
    linkedNodes.push(currentNodeID);
    var toLink = currentNodeID;
    var newEdge = {};
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
  randomAllLink: function(linksToMake){ 
    DG.linkStrats.randomLink(linksToMake);
    var nodes = DG.allNodeIds().slice();

  var linkedNodes = [];
  DG.data.edges.forEach(function(edge){linkedNodes.push(edge["from"])});
  DG.data.edges.forEach(function(edge){linkedNodes.push(edge["to"])});
   
  var unlinkedNodes = nodes.remove.apply(nodes,linkedNodes);
 
  unlinkedNodes.map(function(node){DG.linkNodes(node,(linkedNodes.pop() || 1));});
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
  gridLink: function(){ 
    var rowLength = Math.floor(Math.sqrt(DG.roomCount)) + DG.rollDie(0,3);

  var gridArray = [[]];
  var gridRow = 0;
  var nodes = DG.data.nodes.length;
  var gridCol = 0;
  // lay out room objects into a 2D grid array
  for (var i = 0; i < nodes; i+=1){
    
      gridArray[gridRow][gridCol] = DG.data.nodes[i].id;
    if (gridCol == (rowLength -1)){
     gridCol = 0;
     gridRow += 1;
     gridArray[gridRow] = [];
    } else {
     gridCol += 1;
    }
  }  /* Should have a grid of references to node IDs at end of loop, accounting for all nodes. The last row may be short. */

  for(var r = 0; r < gridArray.length -1; r +=1){
    for (var c = 0; c < gridArray[r+1].length; c += 1){
     if (gridArray[r+1][c] !== undefined && gridArray[r][c] !== undefined){
           DG.linkNodes(gridArray[r][c],gridArray[r+1][c]);
     }
      }
    for (var c = 0; c < gridArray[r].length; c += 1){
     if (gridArray[r][c+1] !== undefined && gridArray[r][c] !== undefined){
           DG.linkNodes(gridArray[r][c],gridArray[r][c+1]);
     }
      }	  
  }
  }
};


