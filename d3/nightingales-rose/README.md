Nightingale's Rose
==================

<a href="http://www.d3js.org" target="_blank">D3.js</a> visualization of the famous polar area diagram from Florence Nightingale's <a href="http://ocp.hul.harvard.edu/dl/contagion/010164675" target="_blank">"A contribution to the sanitary history of the British army during the late war with Russia"</a>. 

Two works served as the inspiration for this implementation:
* Mike Bostock's protovis <a href="http://mbostock.github.io/protovis/ex/crimea-rose.html" target="_blank">implementation</a>
* Understanding Uncertainty's flash <a href="http://understandinguncertainty.org/node/213" target="_blank">implementation</a>

A few comments. Bostock's implmentation, while visually similar to Nightingale's visualization, is wrong. First, the data is not correct. You can verify this in Nightingale's original work. Second, Bostock directly maps the wedge radius to deaths. This mistake is common. Instead, Nightingale represents deaths in terms of area, thus requiring the radius for each wedge to be calculated (for more information, see Understanding Uncertainty's <a href="http://understandinguncertainty.org/node/214" target="_blank">The Mathematics of Coxcombs</a>). This discrepancy would be apparent if one displayed polar axes and allowed reading of radial values.