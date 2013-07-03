/**
*
*
*
*
*
*	@author Kristofer Gryte. http://www.kgryte.com
*
*
*/


var Chart = {};

Chart.scatter = function() {

	var margin = {'top': 20, 'right': 20, 'bottom': 40, 'left': 80},
		height = 300,
		width = 760,
		radius = 5,
		xLabel = 'x',
		yLabel = 'y',
		xTicks, yTicks,
		xValue = function(d) { return d.x; },
		yValue = function(d) { return d.y; },
		xScale = d3.scale.linear(),
		yScale = d3.scale.linear(),
		xAxis = d3.svg.axis().scale( xScale ).orient( 'bottom' ),
		yAxis = d3.svg.axis().scale( yScale ).orient( 'left' ),
		xDomain, yDomain,
		line = d3.svg.line().x( X ).y( Y ),
		linearFit,
		canvas, graph, dataset, circles;


	function chart( selection ) {

		selection.each( function( data ) {

			// Convert data to standard representation; needed for non-deterministic accessors:
			data = data.map( function(d, i) {
				return {
					'x': xValue.call(data, d, i),
					'y': yValue.call(data, d, i)
				};
			});

			if (!xDomain) {
				xDomain = d3.extent( data, function(d) { return d.x; });
			};
			if (!yDomain) {
				yDomain = d3.extent( data, function(d) { return d.y; });
			};
			if (xTicks) {
				xAxis.ticks( xTicks );
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

			// Create the SVG element:
			canvas = d3.select( this ).append('svg:svg')
				.attr('width', width)
				.attr('height', height)
				.attr('class', 'canvas');

			// Create the graph element:
			graph = canvas.append('svg:g')
				.attr('class', 'graph')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			// Create the dataset group:
			dataset = graph.append('svg:g')
				.attr('class', 'dataset');

			// Create the circle marks:
			circles = dataset.selectAll('.point')
				.data( data )
			  .enter().append('svg:circle')
			  	.attr('class', 'point')			  	
				.attr('cx', function(d) { return X(d);} )
				.attr('cy', function(d) { return Y(d);} )
				.attr('r', radius );

			// Create the axes:
			graph.append('svg:g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + yScale.range()[0] + ')')
				.call( xAxis )
				.append('svg:text')
					.attr('y', 40)
					.attr('x', xScale.range()[1] / 2)
					.attr('text-anchor', 'middle')
					.attr('class', 'label')
					.text( xLabel );

			graph.append('svg:g')
				.attr('class', 'y axis')
				.call( yAxis )
					.append('svg:text')
					.attr('transform', 'rotate(-90)')
					.attr('y', -74)
					.attr('dy', '.71em')
					.attr('x', -yScale.range()[0] / 2)
					.attr('text-anchor', 'middle')
					.attr('class', 'label')
					.text( yLabel );

		});

	}; // end FUNCTION chart()

	// x-accessor:
	function X(d) {
		return xScale( d.x );
	};

	// y-accessor:
	function Y(d) {
		return yScale( d.y );
	};

	// http://en.wikipedia.org/wiki/Simple_linear_regression
	function linearRegression( data ){
		var lr = {},
			n = data.length,
			sum_x = 0,
			sum_y = 0,
			sum_xy = 0,
			sum_xx = 0,
			sum_yy = 0;

		for (var i = 0; i < data.length; i++) {

			sum_x += data[i].x;
			sum_y += data[i].y;
			sum_xy += (data[i].x*data[i].y);
			sum_xx += (data[i].x*data[i].x);
			sum_yy += (data[i].y*data[i].y);

		};

		var XX = sum_x*sum_x,
			XY = sum_x*sum_y,
			YY = sum_y*sum_y,
			nxy = n*sum_xy,
			nxx = n*sum_xx,
			nyy = n*sum_yy;

		lr['slope'] = (nxy - XY) / (nxx - XX);
		lr['intercept'] = (sum_y - lr.slope*sum_x) / n;

		lr['r2'] = Math.pow( (nxy - XY) / Math.sqrt((nxx-XX)*(nyy-YY)), 2);

		lr['fn'] = function(x) { return this.slope*x + this.intercept; };

		return lr;
	};

	// Linear Regression: (best fit line)
	chart.linearFit = function() {
		// Initialize variables:
		var data, _data, fit, domain, x, slope, intercept;

		// Get the bound data:
		data = circles.data();

		// Perform the linear fit:
		fit = linearRegression( data );

		// Extract the fit statistics:
		slope = Math.round( fit['slope'] * 10000) / 10000;
		intercept = Math.round( fit['intercept'] * 10000 ) / 10000;
		r2 = Math.round( fit['r2'] * 10000 ) / 10000;

		// Generate the linear prediction based on a set of input values: 'x'
		domain = xScale.domain();
		x = d3.range( domain[0], domain[1]+0.5, 0.5)
		_data = x.map( function(d, i) {
			return {
				'x': d,
				'y': fit['fn']( d ) // evaluate the fit at a given 'x' value
			};
		});

		// Generate the path:
		graph.append('svg:path')
			.data( [ _data ] )
			.attr('class', 'line bestfit')
			.attr('d', line)
			.append('svg:title')
				.text( 'Fit: y = ' + slope + 'x + ' + intercept + ' ; r2 = ' + r2 );

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

	// Set/Get: radius
	chart.radius = function( _ ) {
		if (!arguments.length) return radius;
		radius = _;
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

}; // end FUNCTION scatterChart()











