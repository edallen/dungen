//breaking out usage at page initialization to this file

$( document ).ready(function() {
   
   postLoadInitialize();
});
	 

function postLoadInitialize(){
   var ua = window.navigator.userAgent;
   function observeTable(page) {
     $('table.dungen').on('click', 'tr.node_row', function () {
       DG.nodeDialog(DG.nodesDataSet.get(this.id), function () {
         console.log("called from table");
       })
     });
     if (page === "graph"){
       $('table.dungen').on('click', 'tr.edge_row', function () {
         DG.edgeDialog(DG.edgesDataSet.get(this.id), function () {
           console.log("called from table");
         })
       });
     }
   }
  DG.digDungeon();
   if (typeof(DG.digDungeon) == "function") {
      observeTable("graph");
   }
   else {// on map page
     observeTable("map");
   }
  populateUI();
   if (ua.indexOf("Chrome") > 0) {  $("button#chrome-dl").show(); }

}
