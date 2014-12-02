//breaking out usage at page initialization to this file

$( document ).ready(function() {
   postLoadInitialize();
});
	 

function postLoadInitialize(){
   DG.digDungeon();
   bindButtons();
   populateUI();
   // inline edit
   var replaceWith = $('<input name="temp" type="text" />'),
   connectWith = $('input[name="hiddenField"]');

  //$('span.label').inlineEdit(replaceWith, connectWith);
}
