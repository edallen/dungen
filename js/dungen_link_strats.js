

// link strategies  --------------------------------------------------------------------
DG.linkStrats = {
  branchLink: function (roomIds) {
    var nodes = roomIds.length;
    var linkedNodes = [];
    var unlinkedNodes = roomIds.slice();

    unlinkedNodes = DG.shuffle(unlinkedNodes);
    var currentNodeID = unlinkedNodes.pop();
    linkedNodes.push(currentNodeID);
    var toLink = currentNodeID;
    var newEdge = {};
    while (unlinkedNodes.length > 0) {
      currentNodeID = unlinkedNodes.pop();
      DG.linkNodes(currentNodeID, toLink);
      linkedNodes.push(currentNodeID);
      toLink = linkedNodes[DG.rollDie(0, linkedNodes.length - 1)];
    }
  },
  linearLink: function (roomIds) {
    for (var i = 0; i < roomIds.length - 1; i += 1) {
      var startEdge = i;
      var endEdge = startEdge + 1;
      DG.linkNodes(startEdge, endEdge);
    }
  },
  randomLink: function (linksToMake) {
    for (var i = 0; i < linksToMake; i += 1) {
      var startEdge = DG.rollDie(0, DG.roomCount - 1);
      var endEdge = DG.rollOther(0, DG.roomCount - 1, startEdge);
      DG.linkNodes(startEdge, endEdge);
    }
  },
  randomAllLink: function (linksToMake) {
    DG.linkStrats.randomLink(linksToMake);
    var nodes = DG.allNodeIds().slice();

    var linkedNodes = [];
    DG.data.edges.forEach(function (edge) {
      linkedNodes.push(edge["from"])
    });
    DG.data.edges.forEach(function (edge) {
      linkedNodes.push(edge["to"])
    });

    var unlinkedNodes = nodes.remove.apply(nodes, linkedNodes);

    unlinkedNodes.map(function (node) {
      DG.linkNodes(node, (linkedNodes.pop() || 1));
    });
  },
  trianglesLink: function (roomIds) {
    var nodesCount = roomIds.length;
    var unlinkedNodes = roomIds.slice();
    var linkedNodes = [];
    var triangle = [];
    var triangles = [];
    while (unlinkedNodes.length > 2) {
      triangle = unlinkedNodes.splice(0, 3);
      linkedNodes += triangle;
      DG.linkNodes(triangle[0], triangle[1]);
      DG.linkNodes(triangle[0], triangle[2]);
      DG.linkNodes(triangle[1], triangle[2]);
      triangles.push(triangle);
    }
    for (var i = triangles.length - 1; i > 0; i -= 1) {
      DG.linkNodes(triangles[i][0], triangles[i - 1][1]);
      //DG.linkNodes(triangles[i][0],triangles[i-1][2]);
      //DG.linkNodes(triangles[i][1],triangles[i-1][2]);
    }
    unlinkedNodes.map(function (node) {
      DG.linkNodes(node, node - 1)
    });
  },
  gridLink: function () {
    var rowLength = Math.floor(Math.sqrt(DG.roomCount)) + DG.rollDie(0, 3);

    var gridArray = [[]];
    var gridRow = 0;
    var nodes = DG.data.nodes.length;
    var gridCol = 0;
    // lay out room objects into a 2D grid array
    for (var i = 0; i < nodes; i += 1) {

      gridArray[gridRow][gridCol] = DG.data.nodes[i].id;
      if (gridCol == (rowLength - 1)) {
        gridCol = 0;
        gridRow += 1;
        gridArray[gridRow] = [];
      } else {
        gridCol += 1;
      }
    }
    /* Should have a grid of references to node IDs at end of loop, accounting for all nodes. The last row may be short. */

    for (var r = 0; r < gridArray.length - 1; r += 1) {
      for (var c = 0; c < gridArray[r + 1].length; c += 1) {
        if (gridArray[r + 1][c] !== undefined && gridArray[r][c] !== undefined) {
          DG.linkNodes(gridArray[r][c], gridArray[r + 1][c]);
        }
      }
      for (var c = 0; c < gridArray[r].length; c += 1) {
        if (gridArray[r][c + 1] !== undefined && gridArray[r][c] !== undefined) {
          DG.linkNodes(gridArray[r][c], gridArray[r][c + 1]);
        }
      }
    }
  }
};
