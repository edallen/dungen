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

     $('table.dungen').on('click', 'tr.edge_row', function () {
       DG.edgeDialog(DG.edgesDataSet.get(this.id), function () {
         console.log("called from table");
       })
     });

   }
  populateUI();
  DG.digDungeon();
  observeTable();

   if (ua.indexOf("Chrome") > 0) {  $("button#chrome-dl").show(); }

}
