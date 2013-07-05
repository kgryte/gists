/**
*
*
*
*	NOTES: 
*		[1] Stacked bar and others are not strictly general as they assume ordinal scales.
*		[2] For donut and pie multiples, should auto-calculate the canvas height
*
*
*	@author Kristofer Gryte. http://www.kgryte.com
*
*
*/




var Chart = {};

Chart.line = function() {

	var margin = {'top': 20, 'right': 20, 'bottom': 50, 'left': 80},
		height = 300,
		width = 760,
		xLabel = 'x',
		yLabel = 'y',
		xTicks, yTicks,
		legend = [''],
		xValue = function(d) { return d.x; },
		yValue = function(d) { return d.y; },
		label = function(d) { return d.label; },
		xScale = d3.scale.linear(),
		yScale = d3.scale.linear(),
		xAxis = d3.svg.axis().scale( xScale ).orient( 'bottom' ),
		yAxis = d3.svg.axis().scale( yScale ).orient( 'left' ),
		xDomain, yDomain,
		interpolation = 'basis',
		line = d3.svg.line().x( X ).y( Y ).interpolate( interpolation ),
		canvas, graph, dataset, lines;

	// Stack generator:
	var stack = d3.layout.stack();

	function chart( selection ) {

		selection.each( function( data ) {

			// Standardize the data:
			data = formatData( data );

			// Update the chart parameters:
			updateParams( data );

			// Create the chart base:
			createBase( this );

			// Create the lines:
			createLines( data );

			// Create the axes:
			createAxes();

		});

	}; // end FUNCTION chart()

	function formatData( data ) {

		// Convert data to standard representation; needed for non-deterministic accessors:
		data = d3.range(data.length).map( function(id) {
			return data[id].map( function(d, i) {
				return {
					'x': xValue.call(data[id], d, i),
					'y': yValue.call(data[id], d, i),
					'label': label.call(data[id], d, i)
				};
			});
		});

		// Stackify our data: (NOTE: this is not necessary. We do so here to be consistent with other graphs.)
		data = stack( data );

		return data;

	}; // end FUNCTION formatData()

	function updateParams( data ) {

		if (!xDomain) {
			var xMin = d3.min(data, function(dataset) {
				return d3.min( dataset, function(d) {
					return d.x;
				});
			});
			var xMax = d3.max(data, function(dataset) { 
				return d3.max( dataset, function(d) { 
					return d.x; 
				});
			});
			xDomain = [xMin, xMax];
		};
		if (!yDomain) {
			var yMin = 0,
				yMax = d3.max(data, function(dataset) { 
				return d3.max( dataset, function(d) { 
					return d.y + d.y0; 
				});
			});
			yDomain = [yMin, yMax];
		};
		if (yTicks) {
			yAxis.ticks( yTicks );
		};

		// Update the x-scale:
		xScale
			.domain( xDomain ) 
			.range( [0, width - margin.left - margin.right] );

		// Update the y-scale:
		yScale
			.domain( yDomain )
			.range( [height - margin.top - margin.bottom, 0]);

	}; // end FUNCTION updateParams()

	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection ).append('svg:svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'canvas');

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	}; // end FUNCTION createBase()

	function createLines( data ) {

		// Create the dataset group:
		dataset = graph.append('svg:g')
			.attr('class', 'dataset');
			
		// Add a rectangle for each date:
		lines = dataset.selectAll('.line')
			.data( data )
		  .enter().append('svg:path')
		  	.attr('class', function(d,i) { return 'line ' + d[0].label; })
		  	.attr('d', line);

		// Add tooltips:
		lines.append('svg:title')
			.text( function(d) { return d[0].label; } );

	}; // end FUNCTION createLines()

	function createAxes() {

		graph.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (yScale.range()[0]) + ')')
			.call( xAxis );

		graph.select('.x.axis')
			.append('svg:text')
				.attr('y', 40)
				.attr('x', (width - margin.left - margin.right)/ 2)
				.attr('text-anchor', 'middle')
				.attr('class', 'label')
				.text( xLabel );

		graph.append('svg:g')
			.attr('class', 'y axis')
			.call( yAxis )
				.append('svg:text')
				.attr('transform', 'rotate(-90)')
				.attr('y', -64)
				.attr('x', -yScale.range()[0] / 2)
				.attr('text-anchor', 'middle')
				.attr('class', 'label')
				.text( yLabel );

	}; // end FUNCTION createAxes()

	// x-accessor:
	function X(d) {
		return xScale( d.x );
	};

	// y-accessor:
	function Y(d) {
		return yScale( d.y );
	};

	// Set/Get: margin
	chart.margin = function( _ ) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	// Set/Get: width
	chart.width = function( _ ) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	// Set/Get: height
	chart.height = function( _ ) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	// Set/Get: x
	chart.x = function( _ ) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	// Set/Get: y
	chart.y = function( _ ) {
		if (!arguments.length) return yValue;
		yValue = _;
		return chart;
	};

	// Set/Get: xLabel
	chart.xLabel = function( _ ) {
		if (!arguments.length) return xLabel;
		xLabel = _;
		return chart;
	};

	// Set/Get: yLabel
	chart.yLabel = function( _ ) {
		if (!arguments.length) return yLabel;
		yLabel = _;
		return chart;
	};

	// Set/Get: legend
	chart.legend = function( _ ) {
		if (!arguments.length) return legend;
		legend = _;
		return chart;
	};

	// Set/Get: interpolation
	chart.interpolation = function( _ ) {
		if (!arguments.length) return interpolation;
		interpolation = _;
		line.interpolate( interpolation );
		return chart;
	};

	// Set/Get: xScale
	chart.xScale = function( _ ) {
		if (!arguments.length) return xScale;
		xScale = _;
		xAxis.scale( xScale );
		return chart;
	};

	// Set/Get: xDomain
	chart.xDomain = function( _ ) {
		if (!arguments.length) return xDomain;
		xDomain = _;
		return chart;
	};

	// Set/Get: yDomain
	chart.yDomain = function( _ ) {
		if (!arguments.length) return yDomain;
		yDomain = _;
		return chart;
	};

	// Set/Get: xTicks
	chart.xTicks = function( _ ) {
		if (!arguments.length) return xTicks;
		xTicks = _;
		return chart;
	};

	// Set/Get: yTicks
	chart.yTicks = function( _ ) {
		if (!arguments.length) return yTicks;
		yTicks = _;
		return chart;
	};

	return chart;

}; // end FUNCTION line()



Chart.stackedArea = function() {

	var margin = {'top': 20, 'right': 20, 'bottom': 50, 'left': 80},
		height = 300,
		width = 760,
		xLabel = 'x',
		yLabel = 'y',
		xTicks, yTicks,
		legend = [''],
		xValue = function(d) { return d.x; },
		yValue = function(d) { return d.y; },
		label = function(d) { return d.label; },
		xScale = d3.scale.linear(),
		yScale = d3.scale.linear(),
		xAxis = d3.svg.axis().scale( xScale ).orient( 'bottom' ),
		yAxis = d3.svg.axis().scale( yScale ).orient( 'left' ),
		xDomain, yDomain,
		interpolation = 'basis',
		canvas, graph, dataset, lines;
		
	// Area generator:
	var area = d3.svg.area()
		.x( X )
		.y0( function(d) { return yScale(d.y0); } )
		.y1( function(d) { return yScale(d.y0 + d.y); } )
		.interpolate( interpolation );

	// Stack generator:
	var stack = d3.layout.stack();

	function chart( selection ) {

		selection.each( function( data ) {

			// Standardize the data:
			data = formatData( data );

			// Update the chart parameters:
			updateParams( data );

			// Create the chart base:
			createBase( this );

			// Create the paths:
			createPaths( data );

			// Create the axes:
			createAxes();

		});

	}; // end FUNCTION chart()

	function formatData( data ) {

		// Convert data to standard representation; needed for non-deterministic accessors:
		data = d3.range(data.length).map( function(id) {
			return data[id].map( function(d, i) {
				return {
					'x': xValue.call(data[id], d, i),
					'y': yValue.call(data[id], d, i),
					'label': label.call(data[id], d, i)
				};
			});
		});

		// Stackify the data:
		data = stack( data );

		return data;

	}; // end FUNCTION formatData()

	function updateParams( data ) {

		if (!xDomain) {
			var xMin = d3.min(data, function(dataset) {
				return d3.min( dataset, function(d) {
					return d.x;
				});
			});
			var xMax = d3.max(data, function(dataset) { 
				return d3.max( dataset, function(d) { 
					return d.x; 
				});
			});
			xDomain = [xMin, xMax];
		};
		if (!yDomain) {
			var yMin = 0,
				yMax = d3.max(data, function(dataset) { 
				return d3.max( dataset, function(d) { 
					return d.y + d.y0; 
				});
			});
			yDomain = [yMin, yMax];
		};
		if (yTicks) {
			yAxis.ticks( yTicks );
		};

		// Update the x-scale:
		xScale
			.domain( xDomain ) 
			.range( [0, width - margin.left - margin.right] );

		// Update the y-scale:
		yScale
			.domain( yDomain )
			.range( [height - margin.top - margin.bottom, 0]);

	}; // end FUNCTION updateParams()

	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection ).append('svg:svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'canvas');

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	}; // end FUNCTION createBase()

	function createPaths( data ) {

		// Create the dataset group:
		dataset = graph.append('svg:g')
			.attr('class', 'dataset');
			
		// Add a rectangle for each date:
		lines = dataset.selectAll('.area')
			.data( data )
		  .enter().append('svg:path')
		  	.attr('class', function(d,i) { return 'area ' + d[0].label; })
		  	.attr('d', area);

		// Add tooltips:
		lines.append('svg:title')
			.text( function(d) { return d[0].label; } );

	}; // end FUNCTION createPaths()

	function createAxes() {

		graph.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (yScale.range()[0]) + ')')
			.call( xAxis );

		graph.select('.x.axis')
			.append('svg:text')
				.attr('y', 40)
				.attr('x', (width - margin.left - margin.right)/ 2)
				.attr('text-anchor', 'middle')
				.attr('class', 'label')
				.text( xLabel );

		graph.append('svg:g')
			.attr('class', 'y axis')
			.call( yAxis )
				.append('svg:text')
				.attr('transform', 'rotate(-90)')
				.attr('y', -64)
				.attr('x', -yScale.range()[0] / 2)
				.attr('text-anchor', 'middle')
				.attr('class', 'label')
				.text( yLabel );

	}; // end FUNCTION createAxes()

	// x-accessor:
	function X(d) {
		return xScale( d.x );
	};

	// y-accessor:
	function Y(d) {
		return yScale( d.y );
	};

	// Set/Get: margin
	chart.margin = function( _ ) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	// Set/Get: width
	chart.width = function( _ ) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	// Set/Get: height
	chart.height = function( _ ) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	// Set/Get: x
	chart.x = function( _ ) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	// Set/Get: y
	chart.y = function( _ ) {
		if (!arguments.length) return yValue;
		yValue = _;
		return chart;
	};

	// Set/Get: xLabel
	chart.xLabel = function( _ ) {
		if (!arguments.length) return xLabel;
		xLabel = _;
		return chart;
	};

	// Set/Get: yLabel
	chart.yLabel = function( _ ) {
		if (!arguments.length) return yLabel;
		yLabel = _;
		return chart;
	};

	// Set/Get: legend
	chart.legend = function( _ ) {
		if (!arguments.length) return legend;
		legend = _;
		return chart;
	};

	// Set/Get: interpolation
	chart.interpolation = function( _ ) {
		if (!arguments.length) return interpolation;
		interpolation = _;
		line.interpolate( interpolation );
		return chart;
	};

	// Set/Get: xScale
	chart.xScale = function( _ ) {
		if (!arguments.length) return xScale;
		xScale = _;
		xAxis.scale( xScale );
		return chart;
	};

	// Set/Get: xDomain
	chart.xDomain = function( _ ) {
		if (!arguments.length) return xDomain;
		xDomain = _;
		return chart;
	};

	// Set/Get: yDomain
	chart.yDomain = function( _ ) {
		if (!arguments.length) return yDomain;
		yDomain = _;
		return chart;
	};

	// Set/Get: xTicks
	chart.xTicks = function( _ ) {
		if (!arguments.length) return xTicks;
		xTicks = _;
		return chart;
	};

	// Set/Get: yTicks
	chart.yTicks = function( _ ) {
		if (!arguments.length) return yTicks;
		yTicks = _;
		return chart;
	};

	return chart;


}; // end FUNCTION stackedArea()




Chart.groupedBar = function() {

	var margin = {'top': 20, 'right': 20, 'bottom': 100, 'left': 80},
		height = 400,
		width = 760,
		xLabel = 'x',
		yLabel = 'y',
		legend = [''],
		xValue = function(d) { return d.x; },
		yValue = function(d) { return d.y; },
		label = function(d) { return d.label; },
		xScale = d3.scale.linear(),
		yScale = d3.scale.linear(),
		yTicks,
		xTickLabels,
		xAxis = d3.svg.axis().scale( xScale ).orient( 'bottom' ),
		yAxis = d3.svg.axis().scale( yScale ).orient( 'left' ),
		xDomain, yDomain,
		canvas, graph, dataset, rect;

	// Stack layout generator:
	var stack = d3.layout.stack();

	function chart( selection ) {

		selection.each( function( data ) {

			// Standardize the data:
			data = formatData( data );

			// Update the chart parameters:
			updateParams( data );

			// Create the chart base:
			createBase( this );

			// Create the Columns:
			createColumns( data );

			// Create the axes:
			createAxes();

		});

	}; // end FUNCTION chart()

	function formatData( data ) {

		// Convert data to standard representation; needed for non-deterministic accessors:
		data = d3.range(data.length).map( function(id) {
			return data[id].map( function(d, i) {
				return {
					'x': xValue.call(data[id], d, i),
					'y': yValue.call(data[id], d, i),
					'label': label.call(data[id], d, i)
				};
			});
		});

		// Stackify the data:
		data = stack( data ); 

		return data;

	}; // end FUNCTION formatData()

	function updateParams( data ) {

		if (!xDomain) {
			var xMin = d3.min(data, function(dataset) {
				return d3.min( dataset, function(d) {
					return d.x;
				});
			});
			var xMax = d3.max(data, function(dataset) { 
				return d3.max( dataset, function(d) { 
					return d.x; 
				});
			});
			xDomain = [xMin, xMax];
		};
		if (!yDomain) {
			var yMin = 0,
				yMax = d3.max(data, function(dataset) { 
				return d3.max( dataset, function(d) { 
					return d.y + d.y0; 
				});
			});
			yDomain = [yMin, yMax];
		};
		if (yTicks) {
			yAxis.ticks( yTicks );
		};

		// Update the x-scale:
		xScale
			.domain( xDomain ) 
			.rangeRoundBands( [0, width - margin.left - margin.right] );

		// Update the y-scale:
		yScale
			.domain( yDomain )
			.range( [height - margin.top - margin.bottom, 0]);

	}; // end FUNCTION updateParams()

	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection ).append('svg:svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'canvas');

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	}; // end FUNCTION createBase()

	function createColumns( data ) {

		// Add a group for each dataset:
		dataset = graph.selectAll('.dataset')
			.data( data )
		  .enter().append('svg:g')
		  	.attr('class', 'dataset');

		// Add a rectangle for each date:
		rect = dataset.selectAll('.rect')
			.data( function(d) { return d;} )
		  .enter().append('svg:rect')
		  	.attr('class', function(d,i) { return 'rect ' + d.label; })
		  	.attr('x', function(d,i,j) { return X(d) + xScale.rangeBand() / data.length * j; })
		  	.attr('y', function(d) { return Y(d); })
		  	.attr('height', function(d) { return height - margin.bottom - margin.top - Y(d); })
		  	.attr('width', xScale.rangeBand() / data.length );

		// Add tooltips:
		rect.append('svg:title')
			.text( function(d) { return Math.round(d.y); } );

	}; // end FUNCTION createColumns()

	function createAxes() {

		xTickLabels = graph.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (height - margin.bottom) + ')')		  	
			.selectAll('.label')
			.data( xScale.domain() )
		  .enter().append('svg:text')
		  	.attr('class', 'label')
		  	.attr('x', function(d) { return xScale(d) + xScale.rangeBand()/2; })
		  	.attr('y', -5)
		  	.attr('text-anchor', 'middle')
		  	.attr('dy', '.71em')
		  	.text( d3.time.format("%b") );

		graph.select('.x.axis')
			.append('svg:text')
				.attr('y', 40)
				.attr('x', (width - margin.left - margin.right)/ 2)
				.attr('text-anchor', 'middle')
				.attr('class', 'label')
				.text( xLabel );


		graph.append('svg:g')
			.attr('class', 'y axis')
			.call( yAxis )
				.append('svg:text')
				.attr('transform', 'rotate(-90)')
				.attr('y', -64)
				.attr('x', -yScale.range()[0] / 2)
				.attr('text-anchor', 'middle')
				.attr('class', 'label')
				.text( yLabel );

	}; // end FUNCTION createAxes()

	function X(d) {
		return xScale( d.x );
	};

	function Y(d) {
		return yScale( d.y );
	};

	// Set/Get: margin
	chart.margin = function( _ ) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	// Set/Get: width
	chart.width = function( _ ) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	// Set/Get: height
	chart.height = function( _ ) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	// Set/Get: x
	chart.x = function( _ ) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	// Set/Get: y
	chart.y = function( _ ) {
		if (!arguments.length) return yValue;
		yValue = _;
		return chart;
	};

	// Set/Get: label
	chart.label = function( _ ) {
		if (!arguments.length) return label;
		label = _;
		return chart;
	};

	// Set/Get: legend
	chart.legend = function( _ ) {
		if (!arguments.length) return legend;
		legend = _;
		return chart;
	};

	// Set/Get: xLabel
	chart.xLabel = function( _ ) {
		if (!arguments.length) return xLabel;
		xLabel = _;
		return chart;
	};

	// Set/Get: yLabel
	chart.yLabel = function( _ ) {
		if (!arguments.length) return yLabel;
		yLabel = _;
		return chart;
	};

	// Set/Get: xScale
	chart.xScale = function( _ ) {
		if (!arguments.length) return xScale;
		xScale = _;
		xAxis.scale( xScale );
		return chart;
	};

	// Set/Get: xDomain
	chart.xDomain = function( _ ) {
		if (!arguments.length) return xDomain;
		xDomain = _;
		return chart;
	};

	// Set/Get: yDomain
	chart.yDomain = function( _ ) {
		if (!arguments.length) return yDomain;
		yDomain = _;
		return chart;
	};

	// Set/Get: yTicks
	chart.yTicks = function( _ ) {
		if (!arguments.length) return yTicks;
		yTicks = _;
		return chart;
	};


	return chart;

}; // end FUNCTION groupedBar()





Chart.stackedBar = function() {

	var margin = {'top': 20, 'right': 20, 'bottom': 100, 'left': 80},
		height = 400,
		width = 760,
		xLabel = 'x',
		yLabel = 'y',
		legend = [''],
		xValue = function(d) { return d.x; },
		yValue = function(d) { return d.y; },
		label = function(d) { return d.label; },
		xScale = d3.scale.linear(),
		yScale = d3.scale.linear(),
		yTicks,
		xTickLabels,
		xAxis = d3.svg.axis().scale( xScale ).orient( 'bottom' ),
		yAxis = d3.svg.axis().scale( yScale ).orient( 'left' ),
		xDomain, yDomain,
		canvas, graph, dataset, rect;

	// Stack layout generator:
	var stack = d3.layout.stack();

	function chart( selection ) {

		selection.each( function( data ) {

			// Standardize the data:
			data = formatData( data );

			// Update the chart parameters:
			updateParams( data );

			// Create the chart base:
			createBase( this );

			// Create the Columns:
			createColumns( data );

			// Create the axes:
			createAxes();

		});

	}; // end FUNCTION chart()

	function formatData( data ) {

		// Convert data to standard representation; needed for non-deterministic accessors:
		data = d3.range(data.length).map( function(id) {
			return data[id].map( function(d, i) {
				return {
					'x': xValue.call(data[id], d, i),
					'y': yValue.call(data[id], d, i),
					'label': label.call(data[id], d, i)
				};
			});
		});

		// Stackify the data:
		data = stack( data ); 

		return data;

	}; // end FUNCTION formatData()

	function updateParams( data ) {

		if (!xDomain) {
			var xMin = d3.min(data, function(dataset) {
				return d3.min( dataset, function(d) {
					return d.x;
				});
			});
			var xMax = d3.max(data, function(dataset) { 
				return d3.max( dataset, function(d) { 
					return d.x; 
				});
			});
			xDomain = [xMin, xMax];
		};
		if (!yDomain) {
			var yMin = 0,
				yMax = d3.max(data, function(dataset) { 
				return d3.max( dataset, function(d) { 
					return d.y + d.y0; 
				});
			});
			yDomain = [yMin, yMax];
		};
		if (yTicks) {
			yAxis.ticks( yTicks );
		};

		// Update the x-scale:
		xScale
			.domain( xDomain ) 
			.rangeRoundBands( [0, width - margin.left - margin.right] );

		// Update the y-scale:
		yScale
			.domain( yDomain )
			.range( [height - margin.top - margin.bottom, 0]);

	}; // end FUNCTION updateParams()

	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection ).append('svg:svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'canvas');

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	}; // end FUNCTION createBase()

	function createColumns( data ) {

		// Add a group for each dataset:
		dataset = graph.selectAll('.dataset')
			.data( data )
		  .enter().append('svg:g')
		  	.attr('class', 'dataset');

		// Add a rectangle for each date:
		rect = dataset.selectAll('.rect')
			.data( function(d) { return d;} )
		  .enter().append('svg:rect')
		  	.attr('class', function(d,i) { return 'rect ' + d.label; })
		  	.attr('x', function(d) { return X(d); })
		  	.attr('y', function(d) { return Y(d); })
		  	.attr('height', function(d) { return yScale(d.y0) - Y(d); })
		  	.attr('width', xScale.rangeBand() );

		// Add tooltips:
		rect.append('svg:title')
			.text( function(d) { return Math.round(d.y); } );

	}; // end FUNCTION createColumns()

	function createAxes() {

		xTickLabels = graph.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (height - margin.bottom) + ')')		  	
			.selectAll('.label')
			.data( xScale.domain() )
		  .enter().append('svg:text')
		  	.attr('class', 'label')
		  	.attr('x', function(d) { return xScale(d) + xScale.rangeBand()/2; })
		  	.attr('y', -5)
		  	.attr('text-anchor', 'middle')
		  	.attr('dy', '.71em')
		  	.text( d3.time.format("%b") );

		graph.select('.x.axis')
			.append('svg:text')
				.attr('y', 40)
				.attr('x', (width - margin.left - margin.right)/ 2)
				.attr('text-anchor', 'middle')
				.attr('class', 'label')
				.text( xLabel );


		graph.append('svg:g')
			.attr('class', 'y axis')
			.call( yAxis )
				.append('svg:text')
				.attr('transform', 'rotate(-90)')
				.attr('y', -64)
				.attr('x', -yScale.range()[0] / 2)
				.attr('text-anchor', 'middle')
				.attr('class', 'label')
				.text( yLabel );

	}; // end FUNCTION createAxes()

	function X(d) {
		return xScale( d.x );
	};

	function Y(d) {
		return yScale( d.y + d.y0 );
	};

	// Set/Get: margin
	chart.margin = function( _ ) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	// Set/Get: width
	chart.width = function( _ ) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	// Set/Get: height
	chart.height = function( _ ) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	// Set/Get: x
	chart.x = function( _ ) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	// Set/Get: y
	chart.y = function( _ ) {
		if (!arguments.length) return yValue;
		yValue = _;
		return chart;
	};

	// Set/Get: label
	chart.label = function( _ ) {
		if (!arguments.length) return label;
		label = _;
		return chart;
	};

	// Set/Get: legend
	chart.legend = function( _ ) {
		if (!arguments.length) return legend;
		legend = _;
		return chart;
	};

	// Set/Get: xLabel
	chart.xLabel = function( _ ) {
		if (!arguments.length) return xLabel;
		xLabel = _;
		return chart;
	};

	// Set/Get: yLabel
	chart.yLabel = function( _ ) {
		if (!arguments.length) return yLabel;
		yLabel = _;
		return chart;
	};

	// Set/Get: xScale
	chart.xScale = function( _ ) {
		if (!arguments.length) return xScale;
		xScale = _;
		xAxis.scale( xScale );
		return chart;
	};

	// Set/Get: xDomain
	chart.xDomain = function( _ ) {
		if (!arguments.length) return xDomain;
		xDomain = _;
		return chart;
	};

	// Set/Get: yDomain
	chart.yDomain = function( _ ) {
		if (!arguments.length) return yDomain;
		yDomain = _;
		return chart;
	};

	// Set/Get: yTicks
	chart.yTicks = function( _ ) {
		if (!arguments.length) return yTicks;
		yTicks = _;
		return chart;
	};

	return chart;

}; // end FUNCTION stackedBar()




Chart.multiplePie = function() {

	var margin = {'top': 20, 'right': 20, 'bottom': 100, 'left': 80},
		height = 400,
		width = 760,
		legend = [''],
		xLabel = 'x',
		radius = function(d) { return d.r; },
		rScale = d3.scale.linear(),
		rDomain,
		values = function(d) { return d.values; },
		labels = function(d) { return d.labels; },
		xValue = function(d) { return d.x; },
		canvas, graph, pie = {}, paths;

	// Pie layout generator:
	pie.layout = d3.layout.pie().sort( null );
	pie.numPerRow = 6;
	pie.margin = 2;

	// Arc generator:
	pie.arc = d3.svg.arc().innerRadius( 0 ).outerRadius( R );

	function chart( selection ) {

		selection.each( function( data ) {

			// Standardize the data:
			data = formatData( data );

			// Update the chart parameters:
			updateParams( data );

			// Create the chart base:
			createBase( this );

			// Create the Columns:
			createPies( data );

		});

	}; // end FUNCTION chart()

	function formatData( data ) {

		// Convert data to standard representation; needed for non-deterministic accessors:
		data = data.map( function(d, i) {
			return {
				'r': radius.call(data, d, i),
				'x': xValue.call(data, d, i),
				'values': values.call(data, d, i),
				'labels': labels.call(data, d, i)
			};
		});

		return data;

	}; // end FUNCTION formatData()

	function updateParams( data ) {

		var numPies = data.length;

		// Calculate the maximum width for a pie chart:
		pie.maxWidth = Math.floor( (width-margin.left-margin.right) / pie.numPerRow ) - pie.margin*2;

		if (!rDomain) {
			rDomain = [0, d3.max( data, function(d) { return d.r; }) ];
		};

		// Update radius scale:
		rScale.domain( rDomain )
			.range( [0, pie.maxWidth/2] );

	}; // end FUNCTION updateParams()

	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection ).append('svg:svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'canvas');

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	}; // end FUNCTION createBase()

	function createPies( data ) {

		// Add a group for each data unit:
		pie.groups = graph.selectAll('.pie')
			.data( data )
		  .enter().append('svg:g')
		  	.attr('class', 'pie')
		  	.attr('transform', function(d,i) { 
		  		// Tricky bit to ensure we have the correct alignment per row and column:
		  		return 'translate(' + 
		  			( (i % pie.numPerRow)*pie.maxWidth + pie.maxWidth/2 + (2*(i%pie.numPerRow)+1)*pie.margin ) 
		  			+ ',' + 
		  			( Math.floor(i/pie.numPerRow) * pie.maxWidth + pie.maxWidth/2 + (2*Math.floor(i/pie.numPerRow)+1)*pie.margin + ( (i/pie.numPerRow >= 1) ? 40 : 0 ) ) + ')';
		  	});

		// Generate the paths:
		pie.paths = pie.groups.selectAll('.piePath')
			.data( function(d) { 
				d = pie.layout( d.values ).map( function(wedge, i) {
					wedge.r = d.r;
					wedge.label = d.labels[i];
					return wedge;
				});
				return d; 
			})
		  .enter().append('svg:path')
		  	.attr('d', pie.arc)
		  	.attr('class', function(d,i) { return 'piePath ' + d.label; } );

		// Add tooltips:
		pie.paths.append('svg:title')
			.text( function(d,i) { return d.label + ': ' + Math.round(d.value); } );

		// Add pie labels:
		pie.groups.append('svg:text')
			.attr('transform', 'translate(0, ' + (pie.maxWidth/2) + ')' )
			.attr('text-anchor', 'middle')
			.attr('y', 14)
			.text( function(d) { return d.x; });

		// Append an x label:
		graph.append('svg:text')
			.attr('class', 'label')
			.attr('transform', 'translate(' + ( (width-margin.left-margin.right)/2 ) + ',' + 0 + ')' ) //( Math.floor( data.length / pie.numPerRow) * width / pie.numPerRow + 20)
			.attr('text-anchor', 'middle')
			.text( xLabel );

	}; // end FUNCTION createPies()

	function R(d) {
		return rScale( d.r );
	};

	// Set/Get: margin
	chart.margin = function( _ ) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	// Set/Get: width
	chart.width = function( _ ) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	// Set/Get: height
	chart.height = function( _ ) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	// Set/Get: radius
	chart.radius = function( _ ) {
		if (!arguments.length) return radius;
		radius = _;
		return chart;
	};

	// Set/Get: rDomain
	chart.rDomain = function( _ ) {
		if (!arguments.length) return rDomain;
		rDomain = _;
		return chart;
	};

	// Set/Get: x
	chart.x = function( _ ) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	// Set/Get: values
	chart.values = function( _ ) {
		if (!arguments.length) return values;
		values = _;
		return chart;
	};

	// Set/Get: labels
	chart.labels = function( _ ) {
		if (!arguments.length) return labels;
		labels = _;
		return chart;
	};

	// Set/Get: xLabel
	chart.xLabel = function( _ ) {
		if (!arguments.length) return xLabel;
		xLabel = _;
		return chart;
	};

	// Set/Get: legend
	chart.legend = function( _ ) {
		if (!arguments.length) return legend;
		legend = _;
		return chart;
	};

	return chart;

}; // end FUNCTION multiplePie()




Chart.multipleDonut = function() {

	var margin = {'top': 20, 'right': 20, 'bottom': 100, 'left': 80},
		height = 400,
		width = 760,
		legend = [''],
		xLabel = 'x',
		radius = function(d) { return d.r; },
		rScale = d3.scale.linear(),
		rDomain,
		minRadius = 15,
		values = function(d) { return d.values; },
		labels = function(d) { return d.labels; },
		xValue = function(d) { return d.x; },
		canvas, graph, pie = {}, paths;

	// Pie layout generator:
	pie.layout = d3.layout.pie().sort( null );
	pie.numPerRow = 6;
	pie.margin = 2;

	// Arc generator:
	pie.arc = d3.svg.arc().innerRadius( minRadius ).outerRadius( R );

	function chart( selection ) {

		selection.each( function( data ) {

			// Standardize the data:
			data = formatData( data );

			// Update the chart parameters:
			updateParams( data );

			// Create the chart base:
			createBase( this );

			// Create the Columns:
			createPies( data );

		});

	}; // end FUNCTION chart()

	function formatData( data ) {

		// Convert data to standard representation; needed for non-deterministic accessors:
		data = data.map( function(d, i) {
			return {
				'r': radius.call(data, d, i),
				'x': xValue.call(data, d, i),
				'values': values.call(data, d, i),
				'labels': labels.call(data, d, i)
			};
		});

		return data;

	}; // end FUNCTION formatData()

	function updateParams( data ) {

		var numPies = data.length;

		// Calculate the maximum width for a pie chart:
		pie.maxWidth = Math.floor( (width-margin.left-margin.right) / pie.numPerRow ) - pie.margin*2;

		if (!rDomain) {
			rDomain = [0, d3.max( data, function(d) { return d.r; }) ];
		};

		// Update radius scale:
		rScale.domain( rDomain )
			.range( [minRadius, pie.maxWidth/2] );

	}; // end FUNCTION updateParams()

	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection ).append('svg:svg')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'canvas');

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	}; // end FUNCTION createBase()

	function createPies( data ) {

		// Add a group for each data unit:
		pie.groups = graph.selectAll('.pie')
			.data( data )
		  .enter().append('svg:g')
		  	.attr('class', 'pie')
		  	.attr('transform', function(d,i) { 
		  		// Tricky bit to ensure we have the correct alignment per row and column:
		  		return 'translate(' + 
		  			( (i % pie.numPerRow)*pie.maxWidth + pie.maxWidth/2 + (2*(i%pie.numPerRow)+1)*pie.margin ) 
		  			+ ',' + 
		  			( Math.floor(i/pie.numPerRow) * pie.maxWidth + pie.maxWidth/2 + (2*Math.floor(i/pie.numPerRow)+1)*pie.margin + ( (i/pie.numPerRow >= 1) ? 40 : 0 ) ) + ')';
		  	});

		// Generate the paths:
		pie.paths = pie.groups.selectAll('.piePath')
			.data( function(d) { 
				d = pie.layout( d.values ).map( function(wedge, i) {
					wedge.r = d.r;
					wedge.label = d.labels[i];
					return wedge;
				});
				return d; 
			})
		  .enter().append('svg:path')
		  	.attr('d', pie.arc)
		  	.attr('class', function(d,i) { return 'piePath ' + d.label; } );

		// Add tooltips:
		pie.paths.append('svg:title')
			.text( function(d,i) { return d.label + ': ' + Math.round(d.value); } );

		// Add x labels:
		pie.groups.append('svg:text')
			.attr('transform', 'translate(0, ' + (pie.maxWidth/2) + ')' )
			.attr('text-anchor', 'middle')
			.attr('y', 14)
			.text( function(d) { return d.x; });

		// Append an x label:
		graph.append('svg:text')
			.attr('class', 'label')
			.attr('transform', 'translate(' + ( (width-margin.left-margin.right)/2 ) + ',' + 0 + ')' ) // Math.floor( data.length / pie.numPerRow) * width / pie.numPerRow + 20
			.attr('text-anchor', 'middle')
			.text( xLabel );

	}; // end FUNCTION createPies()

	function R(d) {
		return rScale( d.r );
	};

	// Set/Get: margin
	chart.margin = function( _ ) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	// Set/Get: width
	chart.width = function( _ ) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	// Set/Get: height
	chart.height = function( _ ) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	// Set/Get: radius
	chart.radius = function( _ ) {
		if (!arguments.length) return radius;
		radius = _;
		return chart;
	};

	// Set/Get: rDomain
	chart.rDomain = function( _ ) {
		if (!arguments.length) return rDomain;
		rDomain = _;
		return chart;
	};

	// Set/Get: x
	chart.x = function( _ ) {
		if (!arguments.length) return xValue;
		xValue = _;
		return chart;
	};

	// Set/Get: values
	chart.values = function( _ ) {
		if (!arguments.length) return values;
		values = _;
		return chart;
	};

	// Set/Get: labels
	chart.labels = function( _ ) {
		if (!arguments.length) return labels;
		labels = _;
		return chart;
	};

	// Set/Get: xLabel
	chart.xLabel = function( _ ) {
		if (!arguments.length) return xLabel;
		xLabel = _;
		return chart;
	};

	// Set/Get: legend
	chart.legend = function( _ ) {
		if (!arguments.length) return legend;
		legend = _;
		return chart;
	};

	return chart;

}; // end FUNCTION multipleDonut()




