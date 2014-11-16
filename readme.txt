Dungen design notes

Rooms should be objects instead of strings.
They'll have generate methods to set properties and a draw method to 
render the label and contents. One of the attributes will be size. Another will be tags and a room can have several tags for use in theming.

Monsters will be objects with a treasure type property. Their size property or maybe a "space needed" property will be used with the room's size property to set a maximum number to randomly put in the room, so there can be no garderobe with multiple giants in it, etc. Monsters will also get theming tags.

The interface will offer the selection of tags and only rooms that have those tags or are untagged will be used (possibly do an exclusion to only rooms tagged with the right tag).

Need more network arrangements, selectable in the UI. Concentric rings, town, warren, castle, branched, railroad, grid, gappy grid, linear, linked clusters, linked trinagles, polygon mesh.

Need to expand for multiple levels.

Rework treasure, probably more along classic D&D treasure types by monster types, but with some variations.

Monster types that are not more than +1 to DL, should be pooled for reuse to add some coherency.

Edges should get some additional treatment, with more than a label, at least recording them in a list on the side, so the hard to see ones can have their name accessed. 

Will want to look into toggling a "sticky" mode that will allow nodes to be dragged and placed without springs pulling them back.

Look into patching VisJS to handle landscape mode on tablets.

Need to set up two way bindings between labels, titles, and the table and add inline editing to the table.

Need to put in the UI elements to regen and set DL and tags.

Need save and restore.

Repopulate and Relabel should also be options alongside Regenerate, so you can tweak the layout and just change the contents.

