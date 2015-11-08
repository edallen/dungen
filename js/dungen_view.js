DG.view = {
  solidColorList: ["gray", "black", "red", "green", "blue", "maroon", "brown", 'darkblue', 'gunmetal'],
  bgColorList: ["white", "wheat", "salmon", "lightblue", "lightgreen", "lightgray", "gray", "black", "red", "green", "blue", "maroon", "brown", 'darkblue', 'gunmetal'],
  shapeList: ["box", "ellipse", "circle", "database", "text", "diamond", "dot", "star", "triangle", "triangleDown", "square"],
  widthList: ["0", "1", "2", "3", "4", "5", "6", "8", "10"],
  radiusList: ["0", "1", "2", "3", "4", "5", "6", "8", "10"],
  sizeList: ["3", "5", "8", "10", "15", "20", "25", "30"],
  textSizeList: ["10", "12", "14", "16", "18", "20", "22", "24", "28", "32", "36", "40"],
  buildOptions: function (options, selected) {
    var optionsList = "";
    options.map(function (option) {
      optionsList += "<option";
      if (selected == option) {
        optionsList += " selected='selected'";
      }
      optionsList += ">";
      optionsList += option;
      optionsList += "</option>";
      return optionsList;
    });
    return optionsList;
  },
  selectControl: function (selectId, options) {
    var selectHtml = '<select class="form-control" id="' + selectId + '">' + options + '</select>';
    return selectHtml;
  },
  textInputControl: function (inputId, initialValue) {
    var inputHtml = "<input id='" + inputId + "' type='text' value='" + initialValue + "'>" + "</input>";
    return inputHtml;
  },
  inputTag: function (idName, placeHolder, value) {
    return '<input id="' + idName + '" name="' + idName + '" type="text" placeholder="' + placeHolder + '" value="' + value + '" class="form-control input-md"/> '
  },
  controlDiv: function (label, control, colNum) {
    var divHtml = '<div class="row">  ' +
      DG.view.colDiv(label + control, colNum) +
      '</div>';
    return divHtml;
  },
  colDiv: function (contents, colNum) {
    var divHtml = '<div class="col-md-' + colNum + ' form-group"> ' +
      contents +
      '</div>';
    return divHtml;
  },
  rowDiv: function (contents) {
    var divHtml = '<div class="row">  ' +
      contents +
      '</div>';
    return divHtml;
  },
  label4: function (labelFor, labelText) {
    return '<label class="col-md-4 control-label" for="' + labelFor + '">' + labelText + '</label>';
  },
  formGroupDiv: function (contents) {
    var divHtml = '<div class="form-group"> ' + contents + '</div>';
    return divHtml;
  },
  blankForm: function (formControls) {
    var formHtml = '<form class="form"> ' + formControls + '</form>' + '<br> ';
    return formHtml;
  },
  checkBoxSet: function (allTags, tagData, className) {
    var allTagsLength = allTags.length;
    var checkBoxes = '';
    for (var i = 0; i < allTagsLength; i++) {
      if (tagData.indexOf(allTags[i]) !== -1) {
        checkedAttribute = "checked ";
      }
      else {
        checkedAttribute = "";
      }
      checkBoxes += '<input class="' + className + '" id = "' + allTags[i] + '" ' +
        'name = "' + allTags[i] + '" ' +
        'type = "checkbox" value ="' + allTags[i] + '" ' +
        checkedAttribute +
        '>' + allTags[i] + '</input><br>';
    }
    return checkBoxes;
  }
};

//style dialog
DG.styleBox = function () {

  var currentBgColor = DG.data.style.bgColor;
  var currentBorderColor = DG.data.style.border;
  var currentEdgeWidth = DG.data.style.edges.width;
  var currentEdgeColor = DG.data.style.edges.color.color;
  var currentBorderWidth = DG.data.style.borderWidth;
  var currentShape = DG.data.style.shape;
  var currentSize = DG.data.style.size;
  var currentNodeTextSize = DG.data.style.fontSize;
  var currentFontColor = DG.data.style.fontColor;
  var currentBoxBorderRadius = DG.data.style.borderRadius;
  var currentFontFace = DG.data.style.fontFace;

  var bgColorOptions = DG.view.buildOptions(DG.view.bgColorList, currentBgColor);
  var fontColorOptions = DG.view.buildOptions(DG.view.bgColorList, currentFontColor);
  var nodeTextSizeOptions = DG.view.buildOptions(DG.view.textSizeList, currentNodeTextSize);
  var borderColorOptions = DG.view.buildOptions(DG.view.solidColorList, currentBorderColor);
  var edgeColorOptions = DG.view.buildOptions(DG.view.solidColorList, currentEdgeColor);
  var edgeWidthOptions = DG.view.buildOptions(DG.view.widthList, currentEdgeWidth);
  var borderWidthOptions = DG.view.buildOptions(DG.view.widthList, currentBorderWidth);
  var shapeOptions = DG.view.buildOptions(DG.view.shapeList, currentShape);
  var sizeOptions = DG.view.buildOptions(DG.view.sizeList, currentSize);
  var boxBorderRadiusOptions = DG.view.buildOptions(DG.view.radiusList, currentBoxBorderRadius);

  var style = DG.data.style;
  var dialogOptions = {
    title: "Map style",
    message: 'Choose style options' +
    DG.view.blankForm(
      DG.view.controlDiv('Font ', DG.view.textInputControl('fontFace', currentFontFace), "6") +
      DG.view.controlDiv('Font Size', DG.view.selectControl("nodeTextSize", nodeTextSizeOptions), "6") +
      DG.view.controlDiv('Font Color', DG.view.selectControl("fontColor", fontColorOptions), "6") +
      DG.view.controlDiv('Background Color ', DG.view.selectControl("bgColor", bgColorOptions), "6") +
      DG.view.controlDiv('Border Color ', DG.view.selectControl("borderColor", borderColorOptions), "6") +
      DG.view.controlDiv('Node Shape ', DG.view.selectControl("shape", shapeOptions), "6") +
      DG.view.controlDiv('Node Size (if label outside) ', DG.view.selectControl("nodeSize", sizeOptions), "6") +
      DG.view.controlDiv('Border radius (if box shape) ', DG.view.selectControl("boxBorderRadius", boxBorderRadiusOptions), "6") +
      DG.view.controlDiv('Border Width ', DG.view.selectControl("borderWidth", borderWidthOptions), "6") +
      DG.view.controlDiv('Edge Width ', DG.view.selectControl("edgeWidth", edgeWidthOptions), "6") +
      DG.view.controlDiv('Edge Color ', DG.view.selectControl("edgeColor", edgeColorOptions), "6")
    ),
    buttons: {

      save: {
        label: "Use at next generation",
        className: "btn-success",
        callback: function () {
          DG.data.style.fontFace = $("input#fontFace").val();
          DG.data.style.fontSize = parseInt($("select#nodeTextSize option:selected").text());
          DG.data.style.fontColor = parseInt($("select#fontColor option:selected").text());
          DG.data.style.bgColor = $("select#bgColor option:selected").text();
          DG.data.style.highlightBgColor = DG.data.style.bgColor;
          DG.data.style.border = $("select#borderColor option:selected").text();
          DG.data.style.edges.width = $("select#edgeWidth option:selected").text();
          DG.data.style.edges.color.color = $("select#edgeColor option:selected").text();
          DG.data.style.borderWidth = $("select#borderWidth option:selected").text();
          DG.data.style.shape = $("select#shape option:selected").text();
          DG.data.style.size = parseInt($("select#nodeSize option:selected").text());
          DG.data.style.borderRadius = parseInt($("select#boxBorderRadius option:selected").text());
        }
      },
      apply: {
        label: "Apply to current dungeon",
        className: "btn-success",
        callback: function () {
          var fontFace = $("input#fontFace").val();
          var fontSize = parseInt($("select#nodeTextSize option:selected").text());
          var fontColor = $("select#fontColor option:selected").text();
          var bgColor = $("select#bgColor option:selected").text();
          var highlightBgColor = bgColor;
          var border = $("select#borderColor option:selected").text();
          var edgesWidth = $("select#edgeWidth option:selected").text();
          var edgeColor = $("select#edgeColor option:selected").text();
          var borderWidth = $("select#borderWidth option:selected").text();
          var shape = $("select#shape option:selected").text();
          var size = parseInt($("select#nodeSize option:selected").text());
          var borderRadius = parseInt($("select#boxBorderRadius option:selected").text());

          DG.data.style.fontFace = fontFace;
          DG.data.style.fontSize = fontSize;
          DG.data.style.fontColor = fontColor;
          DG.data.style.bgColor = bgColor;
          DG.data.style.highlightBgColor = highlightBgColor;
          DG.data.style.border = border;
          DG.data.style.edges.width = edgesWidth;
          DG.data.style.edges.color = {color: edgeColor};
          DG.data.style.borderWidth = borderWidth;
          DG.data.style.shape = shape;
          DG.data.style.size = size;
          DG.data.style.borderRadius = borderRadius;

          $.each(DG.data.nodes, function (index, node) {
            node.font.face = fontFace;
            node.font.size = fontSize;
            node.font.color = fontColor;
            node.borderWidth = borderWidth;
            node.color.background = bgColor;
            node.color.highlight.background = highlightBgColor;
            node.color.border = border;
            node.shape = shape;
            node.size = size;
            node.shapeProperties.borderRadius = borderRadius;
          });

          $.each(DG.data.edges, function (index, edge) {
            edge.width = edgesWidth;
            edge.color = {color: edgeColor};
          });
          DG.initNetwork();
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
  bootbox.dialog(dialogOptions);
};

// Arguments to the Vis.Network creation call ----------------------------------------------
DG.nodeDialog = function (newData, callback) {

  var node = DG.nodesDataSet.get(newData.id);
  var currentBgColor = node.color.background;
  var currentBorderColor = node.color.border;
  var currentBorderWidth = node.borderWidth;
  var currentShape = node.shape;
  var currentSize = node.size;
  var currentBoxBorderRadius = node.shapeProperties.borderRadius;
  var currentFontFace = node.font.face;
  var currentFontSize = node.font.size;
  var currentFontColor = node.font.color;

  var bgColorOptions = DG.view.buildOptions(DG.view.bgColorList, currentBgColor);
  var borderColorOptions = DG.view.buildOptions(DG.view.solidColorList, currentBorderColor);
  var borderWidthOptions = DG.view.buildOptions(DG.view.widthList, currentBorderWidth);
  var shapeOptions = DG.view.buildOptions(DG.view.shapeList, currentShape);
  var sizeOptions = DG.view.buildOptions(DG.view.sizeList, currentSize);
  var fontSizeOptions = DG.view.buildOptions(DG.view.textSizeList, currentFontSize);
  var fontColorOptions = DG.view.buildOptions(DG.view.bgColorList, currentFontColor);
  var boxBorderRadiusOptions = DG.view.buildOptions(DG.view.radiusList, currentBoxBorderRadius);


  var textAreaTag = function (idName, placeHolder, value, rows, cols) {
    var html = '<textarea id="' + idName + '" name="' + idName + '" type="text" placeholder="' + placeHolder +
      '" value="' + value + '" class="form-control" rows="' + rows + '" columns = "' + cols + '">' + value + '</textarea>';
    return html;
  };
  var buttonTag = function (id, label) {
    return '<button id="' + id + '">' + label + '</button>'
  };
  bootbox.dialog({
    title: "Edit Location",
    message: DG.view.rowDiv(
      DG.view.colDiv(
        DG.view.blankForm(
          DG.view.formGroupDiv(
            DG.view.label4('name', 'Name') +
            DG.view.inputTag('location_name', 'Location name', node.label)
          ) +
          DG.view.formGroupDiv(
            DG.view.label4('description', 'Description') +
            textAreaTag("location_description", "Location description", DG.brToLf(node.title), 8, 30)
          ) +
          DG.view.controlDiv('Font ', DG.view.textInputControl('fontFace', currentFontFace), "6") +
          DG.view.controlDiv('Font Size ', DG.view.selectControl("fontSize", fontSizeOptions), "6") +
          DG.view.controlDiv('Font Color ', DG.view.selectControl("fontColor", fontColorOptions), "6") +
          DG.view.controlDiv('Background Color ', DG.view.selectControl("bgColor", bgColorOptions), "6") +
          DG.view.controlDiv('Border Color ', DG.view.selectControl("borderColor", borderColorOptions), "6") +
          DG.view.controlDiv('Node Shape ', DG.view.selectControl("shape", shapeOptions), "6") +
          DG.view.controlDiv('Node Size (if label outside) ', DG.view.selectControl("nodeSize", sizeOptions), "6") +
          DG.view.controlDiv('Border radius (if box shape) ', DG.view.selectControl("boxBorderRadius", boxBorderRadiusOptions), "6") +
          DG.view.controlDiv('Border Width ', DG.view.selectControl("borderWidth", borderWidthOptions), "6")
        ) +
        buttonTag("reroll_node_title", 'Reroll'), 12)
    ),
    buttons: {
      save: {
        label: "Save",
        className: "btn-success",
        callback: function () {
          newData.label = $('#location_name').val();
          newData.title = DG.lfToBr($('#location_description').val());
          newData.font.face = $("input#fontFace").val();
          newData.font.size = parseInt($("select#fontSize option:selected").text());
          newData.font.color = $("select#fontColor option:selected").text();
          newData.color.background = $("select#bgColor option:selected").text();
          newData.color.highlight.background = newData.color.background;
          newData.color.border = $("select#borderColor option:selected").text();
          newData.borderWidth = $("select#borderWidth option:selected").text();
          newData.shape = $("select#shape option:selected").text();
          newData.size = parseInt($("select#nodeSize option:selected").text());
          newData.shapeProperties.borderRadius = parseInt($("select#boxBorderRadius option:selected").text());
          DG.addMonstersToList();
          DG.nodesDataSet.update(newData);
          DG.fillKey();
          callback(newData);

        }
      }
    }
  });

};


// Theming dialog
DG.themeBox = function () {
  var monsterCheckboxes = "";
  var nodeCheckboxes = "";
  var edgeCheckboxes = "";
  var monsterTags = DG.stock.monsterTags;
  var nodeTags = DG.stock.nodeTags;
  var edgeTags = DG.stock.edgeTags;

  var checkedAttribute = "";

  monsterCheckboxes = DG.view.checkBoxSet(monsterTags, DG.data.monsterTags, "monsterTag");
  nodeCheckboxes = DG.view.checkBoxSet(nodeTags, DG.data.nodeTags, "nodeTag");
  edgeCheckboxes = DG.view.checkBoxSet(edgeTags, DG.data.edgeTags, "edgeTag");

  bootbox.dialog({
    title: "Select Theme",
    message: "Choose tags to build a theme" +
    DG.view.blankForm(
      DG.view.rowDiv(
        DG.view.colDiv("Favored Monsters<br>" + monsterCheckboxes, 6) +
        DG.view.colDiv('Nodes (not for Wilds yet)<br>' + nodeCheckboxes, 6) +
        DG.view.colDiv('<br><br>Edges (not for Wilds yet)<br>' + edgeCheckboxes, 6)
      )
    ),
    buttons: {
      save: {
        label: "Use selected",
        className: "btn-success",
        callback: function () {
          var monsterTags = $('input.monsterTag:checkbox:checked').map(function () {
            return this.value;
          }).get();
          var nodeTags = $('input.nodeTag:checkbox:checked').map(function () {
            return this.value;
          }).get();
          var edgeTags = $('input.edgeTag:checkbox:checked').map(function () {
            return this.value;
          }).get();
          DG.data.monsterTags = monsterTags;
          DG.data.nodeTags = nodeTags;
          DG.data.nodeTable = DG.filterListByTags(DG.stock.nodeLabels, nodeTags);
          DG.data.edgeTags = edgeTags;
          DG.data.edgeTable = DG.filterListByTags(DG.stock.edgeLabels, edgeTags);
        }
      },
      all: {
        label: "Any",
        className: "btn-success",
        callback: function () {
          DG.data.monsterTags = [];
          DG.data.nodeTags = [];
          DG.data.nodeTable = [];
          DG.data.edgeTags = [];
          DG.data.edgeTable = [];
        }
      }
    }
  });
};


DG.formatOption = function (node, selectedId) {
  var option = '<option value="' + node.id + '"';
  if (selectedId === node.id) {
    option += " selected ";
  }
  option += '>' + node.label + '</option>';

  return option;
};

DG.formatFromOption = function (node) {
  return DG.formatOption(node, DG.fromOption);
};

DG.formatToOption = function (node) {
  return DG.formatOption(node, DG.toOption);
};

DG.fromOptions = function (selectedId) {
  DG.fromOption = selectedId;
  var optionsList = DG.nodesDataSet.map(DG.formatFromOption, {
    fields: ["id", "label"],
    returnType: "Object"
  });
  DG.fromOption = null;
  return optionsList.join('\n');

};

DG.toOptions = function (selectedId) {
  DG.toOption = selectedId;
  var optionsList = DG.nodesDataSet.map(DG.formatToOption, {
    fields: ["id", "label"],
    returnType: "Object"
  });
  DG.toOption = null;
  return optionsList.join('\n');

};

DG.edgeDialog = function (thisEdge, callback) {
  var fromNodeId = thisEdge.from;
  var toNodeId = thisEdge.to;
  bootbox.dialog({
    title: "Edit Path between Locations",
    message: DG.view.rowDiv(
      DG.view.colDiv(
        DG.view.blankForm(
          DG.view.formGroupDiv(
            DG.view.label4('edgeName', 'Name') +
            DG.view.inputTag("edge_name", "Path name", thisEdge.label)
          ) +
          DG.view.formGroupDiv(
            DG.view.label4('fromNode', 'From') +
            DG.view.selectControl("fromNode", DG.fromOptions(fromNodeId))
          ) +
          DG.view.formGroupDiv(
            DG.view.label4('toNode', 'To') +
            DG.view.selectControl("toNode", DG.fromOptions(toNodeId))
          )
        ), 12)),
    buttons: {
      save: {
        label: "Save",
        className: "btn-success",
        callback: function () {
          thisEdge.label = $('#edge_name').val();
          thisEdge.from = $('#fromNode').val();
          thisEdge.to = $('#toNode').val();
          DG.edgesDataSet.update(thisEdge);
          callback(thisEdge);

        }
      }

    }


  })
};