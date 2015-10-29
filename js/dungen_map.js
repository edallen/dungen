DG.map = {
  fillKey: function () {
    //This function will render out the labels and descriptions from
    //DG.data.nodes into table#dungeon_key
    var dungeonKey = "<thead>\n<tr><th>Location</th><th>Description (click in a cell to edit)</th></tr>\n</thead><tbody>"
    var tln = "<tr class='node_row' id ='";
    var tlm = "'><td class='dungen'>";
    var tm = "</td><td class='dungen dg_description'>";
    var tr = "</td></tr>";
    var node = {};
    var nodesLength = DG.data.nodes.length;
    var fromNodeLabel, toNodeLabel;
    for (i = 0; i < nodesLength; i += 1) {
      node = DG.data.nodes[i];
      dungeonKey = dungeonKey + ( tln + node["id"] + tlm + node["label"] + tm + node["title"] + tr );
    }
    dungeonKey += "\n</tbody>";
    document.getElementById("dungeon_key").innerHTML = dungeonKey;
  },

  findInArrayById: function (id, arrayToSearch) {
    return $.grep(arrayToSearch, function (e) {
      return e.id == id;
    })[0];
  },

  initMap: function (locationType) {
    var data = {nodes: null, url: null};
    var levelSelect = document.getElementById("level");
    var sizeSelect = document.getElementById("size");
    var selectedSize = "5,5";
    selectedSize = sizeSelect.options[sizeSelect.selectedIndex].value;
    var dungeonLevelSelected = levelSelect.options[levelSelect.selectedIndex].value;
    DG.data.nodes = [];
    DG.data.edges = [];
    DG.data.monsters = {};
    DG.monsterHold = undefined;
    DG.data.locationType = locationType;
    DG.data.treasureMultiplier = parseFloat($("#treasureMultiplier").val()) || 1;
    DG.roomCount = 0;
    if (dungeonLevelSelected === "wilds") {
      DG.data.dungeonLevel = dungeonLevelSelected
    } else {
      DG.data.dungeonLevel = parseInt(dungeonLevelSelected);
    }
    DG.minRooms = parseInt(selectedSize.split(",")[0]);
    DG.maxRooms = parseInt(selectedSize.split(",")[1]);
    DG.setRandomRoomCount();
    DG.map.makeRooms();
    DG.data.notes = DG.populateNotes();
  },
  initNetwork: function () {
    var data;
    DG.nodesDataSet = new vis.DataSet(DG.data.nodes);
    DG.nodesDataSet.on('*', function (event, properties, senderId) {
      DG.data.nodes = DG.nodesDataSet.get();

      DG.map.fillKey();
    });
    data = {nodes: DG.nodesDataSet, edges: []};
    DG.network = new vis.Network(DG.container, data, DG.drawOptions);

    DG.map.fillKey();
  },
  makeRooms: function () {
    DG.setBaseMonsters();
    for (var i = 0; i < DG.roomCount; i += 1) {
      DG.data.nodes[i] = DG.makeNode(i, DG.nameNode(i + 1));
    }
  },

  allNodeIds: function () {
    var nodeIds = [];
    DG.data.nodes.forEach(function (node) {
      nodeIds.push(node.id);
    });
    return nodeIds;
  },

  makeNode: function (id, label) {
    var border = DG.data.style.border,
      borderWidth = DG.data.style.borderWidth,
      borderRadius = DG.data.style.borderRadius,
      borderWidthSelected = borderWidth * 1.2,
      bgColor = DG.data.style.bgColor,
      shape = DG.data.style.shape,
      size = DG.data.style.size,
      fontSize = DG.data.style.fontSize,
      fontFace = DG.data.style.fontFace,
      highlightBgColor = DG.data.style.highlightBgColor,
      highLightBorder = DG.data.style.highlightBorder;

    var contents = DG.makeContents(DG.data.dungeonLevel);
    addMonstersToList();
    return {
      id: id,
      shape: shape,
      size: size,
      font: {size: fontSize, face: fontFace},
      borderWidth: borderWidth,
      borderWidthSelected: borderWidthSelected,
      shapeProperties: {borderRadius: borderRadius},
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
      group: ""
    }

  },
  replaceText: function (textFrom, textTo) {
    var len = DG.data.nodes.length;

    function replaceAll(findVal, replaceVal, str) {
      return str.replace(new RegExp(findVal, 'g'), replaceVal);
    }

    for (i = 0; i < len; i++) {
      DG.data.nodes[i].title = replaceAll(textFrom, textTo, DG.data.nodes[i].title)
    }
    DG.data.notes = replaceAll(textFrom, textTo, DG.data.notes);
    $("#notes").val(DG.data.notes);
    DG.map.fillKey();
  },
  drawOptions: {
    physics: {
      enabled: false,
      forceAtlas2Based: {}
    },
    configure: {enabled: false},
    manipulation: {
      enabled: true,
      initiallyActive: false,
      addNode: function (data, callback) {
        /** data = {id: random unique id,
            *           label: new,
            *           x: x position of click (canvas space),
            *           y: y position of click (canvas space),
            *           allowedToMoveX: true,
            *           allowedToMoveY: true
            *          };
         */
        var i = DG.data.nodes[DG.data.nodes.length - 1].id + 1;

        var newData = DG.makeNode(i, DG.nameNode(i + 1));
        // alter the data as you want.
        // all fields normally accepted by a node can be used.
        DG.nodesDataSet.add(newData);

        callback(newData);  // call the callback to add a node.
      },
      editNode: function (data, callback) {
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

         // alter the data as you want.
         // all fields normally accepted by a node can be used.
        DG.nodeDialog(data, callback);
      },

      deleteNode: function (data, callback) {
        //   data = {nodes: [selectedNodeIds], edges: [selectedEdgeIds]};
        //  the same data structure is required.
        // WILL NEED TO REMOVE THEM FROM THE LISTS IN DG.data
        DG.nodesDataSet.remove(data.nodes);
        DG.map.fillKey();
        callback(data);  // call the callback to delete the objects.
      }

    }
  }
};