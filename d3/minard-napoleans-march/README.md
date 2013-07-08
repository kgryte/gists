Napolean's March
================

A <a href="http://www.d3js.org" target="_blank">D3.js</a> recreation of Charles Minard's <a href="http://www.datavis.ca/gallery/re-minard.php" target="_blank">Napolean's 1812 March</a>.

Data from Wilkinson's <a href="http://www.cs.uic.edu/~wilkinson/TheGrammarOfGraphics/minard.txt" target="_blank">The Grammar of Graphics</a>.

Several works provided inspiration; see Michael Friendly's <a href="http://www.datavis.ca/gallery/re-minard.php" target="_blank">Re-visions of Minard</a>.

Note that this implementation uses several different data files. Included are both original JSON files and associated GeoJSON files. For the army size labels, the data has been massaged some to agree with the (edited) army movements (data from Mike Bostock's <a href="http://mbostock.github.io/protovis/ex/napoleon.html" target="_blank">Protovis implementation</a>). River data is from <a href="https://github.com/nvkelso/natural-earth-vector" target="_blank">Natural Earth</a>; admittedly, the river data is incomplete with portions of rivers missing. Currently, the country data is the entire world. This is unnecessary, as the scale factor is so high. Additionally, the resolution is low. An improvement would be a more limited and better set of country data.

The implementation only makes time explicit for Napolean's retreat, as in the original.

Concerning interaction, all layers support hover interaction to provide focus. Controls toggle whether a layer is displayed. By default, all layers are displayed.





