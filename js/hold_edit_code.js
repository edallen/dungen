onAdd: function(data,callback) {
        /** data = {id: random unique id,
        *           label: new,
        *           x: x position of click (canvas space),
        *           y: y position of click (canvas space),
        *           allowedToMoveX: true,
        *           allowedToMoveY: true
        *          };
        */
		var i = DG.data.nodes[DG.data.nodes.length - 1].id + 1;
		
        var newData = DG.makeNode(i, DG.nameNode(i+1) ); // alter the data as you want.
                            // all fields normally accepted by a node can be used.
		console.log(newData);
		DG.data.nodes.push(newData);
		DG.fillKey();
        callback(newData);  // call the callback to add a node.
    },
    onEdit: function(data,callback) {
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
        callback(newData);  // call the callback with the new data to edit the node.
    },
    onEditEdge: function(data,callback) {
        /** data = {id: edgeID,
        *           from: nodeId1,
        *           to: nodeId2,
        *          };
        */
        var newData = data; // alter the data as you want, except for the ID.
                            // all fields normally accepted by an edge can be used.
        callback(newData);  // call the callback with the new data to edit the edge.
    },
    onConnect: function(data,callback) {
        // data = {from: nodeId1, to: nodeId2};
		 var newData = {};
         for (var attrname in data) { newData[attrname] = data[attrname]; }
		 newData.label = DG.randomEdgeLabel();
		 // check or alter data as you see fit.
         callback(newData);       // call the callback to connect the nodes.
    },
    onDelete: function(data,callback) {
     //   data = {nodes: [selectedNodeIds], edges: [selectedEdgeIds]};
        var newData = data; // alter the data as you want.
                           //  the same data structure is required.
							// WILL NEED TO REMOVE THEM FROM THE LISTS IN DG.data
        callback(newData);  // call the callback to delete the objects.
    },