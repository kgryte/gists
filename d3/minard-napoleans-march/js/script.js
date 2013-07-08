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

Chart.temp = function() {

	var margin = {'top': 10, 'right': 80, 'bottom': 50, 'left': 20},
		width = 960,
		height = 480,
		xLabel = '',
		yLabel = '',
		yTicks,
		xValue = function(d) { return d.x; },
		yValue = function(d) { return d.y; },
		label = function(d) { return d.label; },
		yScale = d3.scale.linear(),
		yAxis = d3.svg.axis().scale( yScale ).orient( 'right' ),
		yDomain,
		interpolation = 'linear',
		line = d3.svg.line().x( X ).y( Y ).interpolate( interpolation ),
		canvas, graph, dataset, lines, circles, labels,
		data;

	var geoScale = 6000,
		geoCenter = [27.6, 54.5],
		geoPrecision = .1,
		geoProjection = d3.geo.equirectangular()
			.center( geoCenter )
			.scale( geoScale )
			.translate( [width/2, height/2])
			.precision( geoPrecision ),
		xScale = function(lon) { return geoProjection( [lon, 55] )[0]; }; // assume constant latitude; 55 is near the avg.
		

	function chart( selection ) {

		selection.each( function( _data ) {

			// Format the data:
			formatData( _data );

			// Update the chart parameters:
			updateParams();

			// Create the chart base:
			createBase( this );

			// Create the axes:
			createAxes();

			// Show the data:
			draw();

			

		});

	};

	function formatData( _data ) {

		// Convert data to standard representation; needed for non-deterministic accessors:
		data = _data.map( function(d, i) {
			return {
				'x': xValue.call(data, d, i),
				'y': yValue.call(data, d, i),
				'label': label.call(data, d, i)
			};
		});

		data = [ data ];

	}; // end FUNCTION formatData()

	function updateParams( ) {

		if (!yDomain) {
			var yMin = d3.min(data, function(dataset) { 
					return d3.min( dataset, function(d) { 
						return d.y; 
					});
				}),
				yMax = d3.max(data, function(dataset) { 
					return d3.max( dataset, function(d) { 
						return d.y; 
					});
				});
			yDomain = [yMin, yMax];
		};
		if (yTicks) {
			yAxis.ticks( yTicks );
		};

		// Update the y-scale:
		yScale
			.domain( yDomain )
			.range( [height - margin.top - margin.bottom, 0]);

		yAxis.tickSize( ( width - margin.left - margin.right),0,0 );

	}; // end FUNCTION updateParams()

	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection )
			.append('svg:svg')
				.attr('class', 'canvas')
				.attr('width', width)
				.attr('height', height);

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	}; // end FUNCTION createBase()

	function draw( ) {

		// Create the dataset group:
		dataset = graph.append('svg:g')
			.attr('class', 'dataset');
			
		// Add paths:
		lines = dataset.selectAll('.line')
			.data( data )
		  .enter().append('svg:path')
		  	.attr('class', 'line')
		  	.attr('d', line);

		// Add circles at each datum:
		circles = dataset.selectAll('.point')
			.data( data[0] )
		  .enter().append('svg:circle')
		  	.attr('class', 'point')
		  	.attr('cx', function(d) { return xScale(d.x); })
		  	.attr('cy', function(d) { return yScale(d.y); })
		  	.attr('r', 5);

		// Affix titles to the circles:
		circles.append('svg:title')
			.text( function(d) { return d.y + ' Celsius'} );

		// Append labels:
		labels = dataset.selectAll('.lineLabel')
			.data( data[0] )
		  .enter().append('svg:text')
		  	.attr('class', 'lineLabel')
		  	.attr('text-anchor', 'start')
		  	.attr('dx', '-.5em')
		  	.attr('dy', '1.2em')
		  	.attr('transform', function(d) {
		  		return 'translate(' + xScale(d.x) + ',' + yScale(d.y) + ')';
		  	})
		  	.text( function(d) { return d.label; });

	}; // end FUNCTION createLines()

	function createAxes() {

		graph.append('svg:g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (yScale.range()[0]) + ')');

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
				.attr('transform', 'translate(' + (width-margin.right) + ',0) rotate(90)')
				.attr('y', -24)
				.attr('x', yScale.range()[0] / 2)
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

	// Set/Get: label
	chart.label = function( _ ) {
		if (!arguments.length) return label;
		label = _;
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

	// Set/Get: geoScale
	chart.geoScale = function( _ ) {
		if (!arguments.length) return geoScale;
		geoScale = _;
		geoProjection.geoScale( geoScale );
		return chart;
	};

	// Set/Get: geoCenter
	chart.geoCenter = function( _ ) {
		if (!arguments.length) return geoCenter;
		geoCenter = _;
		geoProjection.geoCenter( geoCenter );
		return chart;
	};

	// Set/Get: geoPrecision
	chart.geoPrecision = function( _ ) {
		if (!arguments.length) return geoPrecision;
		geoPrecision = _;
		geoProjection.geoPrecision( geoPrecision );
		return chart;
	};

	return chart;
};

Chart.geo = function() {

	var margin = {'top': 20, 'right': 80, 'bottom': 50, 'left': 20},
		width = 960,
		height = 480,
		radius = 5,
		scale = 6000,
		center = [27.6, 54.5],
		precision = .1,
		canvas, graph, 
		world, country, 
		rivers, river, 
		cities, city, 
		army, movement, contingent, route, 
		labels, 
		controls, control;

	// Geo projection:
	var projection = d3.geo.equirectangular()
		.center( center )
		.scale( scale )
		.translate( [width/2, height/2])
		.precision( precision );

	// Path generator:
	var path = d3.geo.path()
		.projection( projection )
    	.pointRadius( function(d,i) {
    		return radius;
    	});

	function chart( selection ) {

		selection.each( function( data ) {

			// Create the chart base:
			createBase( this );

			// Create the world map, plot the cities, show the march, show labels, and initialize interactions:
			chart.world()
				.rivers()
				.cities()
				.march()
				.labels()
				.controls();			

		});

	};

	function createBase( selection ) {

		// Create the SVG element:
		canvas = d3.select( selection )
			.append('svg:svg')
				.attr('class', 'canvas')
				.attr('width', width)
				.attr('height', height);

		// Create the graph element:
		graph = canvas.append('svg:g')
			.attr('class', 'graph')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// Create the world element:
		world = graph.append('svg:g')
			.attr('class', 'world');

		// Create the rivers element:
		rivers = graph.append('svg:g')
			.attr('class', 'rivers');

		// Create the army element:
		army = graph.append('svg:g')
			.attr('class', 'army');

		// Create the cities element:
		cities = graph.append('svg:g')
			.attr('class', 'cities');

		// Create the labels element:
		labels = graph.append('svg:g')
			.attr('class', 'labels');

		// Create the controls element:
		controls = graph.append('svg:g')
			.attr('class', 'controls');

	}; // FUNCTION createBase()

	chart.world = function() {

		// Load the country data:
		d3.json('data/world-countries.geo.json', function( collection ) {

			country = world.selectAll('.geo-path')
				.data( collection.features )
			  .enter().append('svg:path')
			  	.attr('class', 'geo-path')
			  	.attr('d', path);

			country.append('svg:title')
				.text( function(d) { return d.properties.name; } );

		});

		return chart;
	};

	chart.rivers = function() {

		// Load the river data:
		d3.json('data/rivers.geo.json', function( collection ) {

			river = rivers.selectAll('.river')
				.data( collection.features )
			  .enter().append('svg:path')
			  	.attr('class', 'river')
			  	.attr('d', path);

			river.append('svg:title')
				.text( function(d) { return d.properties.name; });

			rivers.on('mouseover', mouseover )
				.on('mouseout', mouseout );

			function mouseover() {
				movement.call( filter, fadeOut );
				cities.call( filter, fadeOut );
				labels.call( filter, fadeOut );
			};

			function mouseout() {
				movement.call( filter, fadeIn );
				cities.call( filter, fadeIn );
				labels.call( filter, fadeIn );
			};

		});

		return chart;
	};

	chart.cities = function() {

		// Load the city data:
		d3.json('data/cities.geo.json', function( collection ) {

			city = cities.selectAll('.geo-node')
				.data( collection.features )
			  .enter().append('svg:g')
			  	.attr('class', 'geo-node');

			city.append('svg:path')
			  	.attr('d', path);

			city.append('svg:text')
				.attr('text-anchor', 'start')
				.attr('dx', '.35em')
				.attr('dy', '-.71em')
				.attr('transform', function(d) {
					return 'translate(' + projection(d.geometry.coordinates) + ')';
				})
				.text( function(d) { return d.properties.city; });

			cities.on('mouseover', mouseover )
				.on('mouseout', mouseout );

			function mouseover() {
				movement.call( filter, fadeOut );
				labels.call( filter, fadeOut );
				rivers.call( filter, fadeOut );
			};

			function mouseout() {
				movement.call( filter, fadeIn );
				labels.call( filter, fadeIn );
				rivers.call( filter, fadeIn );
			};

		});

		return chart;
	};

	chart.march = function() {

		// Load the march data:
		d3.json('data/army_edited.geo.json', function( data ) {

			// Get the max and min army size:
			var extent = d3.extent( data.features, function(d) {
				return d.properties.size;
			});

			// Create a scalar based on the extent:
			var scalar = (extent[1] - extent[0]) / 1.5e9;

			// Split the data by direction and then by contingent:
			var data = d3.nest()
				.key( function(d) { return d.properties.dir; } )
				.sortKeys( d3.ascending )
				.key( function(d) { return d.properties.group; })
				.entries( data.features );

			// For each group, extract the coordinates and create segments:
			var routes = [],
				direction, group;
			for (var i = 0; i < data.length; i++) {

				routes[i] = [];
				direction = data[i].values;

				for (var j = 0; j < direction.length; j++) {

					routes[i][j] = [];
					group = direction[j].values;

					for (var k = 0; k < group.length-1; k++) {

						routes[i][j].push( {
							'type': 'LineString',
							'coordinates': [
								[ group[k].geometry.coordinates[0], group[k].geometry.coordinates[1] ],
								[ group[k+1].geometry.coordinates[0], group[k+1].geometry.coordinates[1] ]
							],
							'properties': {
								'size': group[k].properties.size,
								'dir': group[k].properties.dir,
								'group': group[k].properties.group
							}
						});

					}; // end FOR k

				}; // end FOR j

			}; // end FOR i

			// Create group elements for each movement: (advance and repeat)
			movement = army.selectAll('.movement')
				.data( routes )
			  .enter().append('svg:g')
			  	.attr('class', 'movement');

			// Create group elements for each contingent:
			contingent = movement.selectAll('.contingent')
				.data( function(d) { return d; } )
			  .enter().append('svg:g')
			  	.attr('class', 'contingent');

			// For each contingent, create route paths:
			route = contingent.selectAll('.route')
				.data( function(d) { return d; } )
			  .enter().append('svg:g')
			  	.attr('class', 'route');

			route.append('svg:path')
				.attr('class', function(d) {
					return 'path ' + ( (d.properties.dir == -1) ? 'retreat' : 'advance' ); 
				})
				.attr('id', function(d,i) {
					return 'label-path' + d.properties.group + ( (d.properties.dir == -1) ? 1 : 2 ) + i;
				})
				.attr('d', path)
			  	.attr('stroke-width', function(d) { return Math.max(1, scalar *d.properties.size); })
			  	.attr('stroke-linecap', function(d,i) {
			  		return ( i == 0 ? 'butt' : 'round');
			  	})
			  	.attr('fill', 'none');

			route.append('svg:title')
				.text( function(d) {
					return d.properties.size;
				});

			/*
			route.append('svg:text')
				.attr('class', 'label')
				.attr('text-anchor', 'start')
				.attr('x', 5)
				.attr('dy', '-.71em')
				.append('textPath')
					.attr('xlink:href', function(d,i) {
						return '#label-path' + d.properties.group + ( (d.properties.dir == -1) ? 1 : 2 ) + i;
					})
					.text( function(d) { return d.properties.size; });
			*/
			/*
			route.append('svg:text')
				.attr('class', 'label')
				.attr('text-anchor', 'start')
				.attr('x', 0)
				.attr('dy', '-.71em')
				.attr('transform', function(d) {
					return 'translate(' + projection( d.coordinates[0] ) + ') rotate(-90)'; 
				})
				.text( function(d) { return d.properties.size;});
			*/

			movement.on('mouseover', mouseover )
				.on('mouseout', mouseout );

			function mouseover() {

				var self = this;

				movement.filter( function(d) {
					return self != this;
				})
				.call( filter, fadeOut );

				cities.call( filter, fadeOut );
				labels.call( filter, fadeOut );
				
			}; 

			function mouseout() {

				movement.call( filter, fadeIn );
				cities.call( filter, fadeIn );
				labels.call( filter, fadeIn );				

			};

		});

		return chart;

	};

	chart.labels = function() {

		// Load the label data:
		d3.json('data/labels.json', function( data ) {

			labels.selectAll('.label')
				.data( data )
			  .enter().append('svg:text')
			  	.attr('text-anchor', function(d) {
			  		return (d.dir == 1) ? 'start' : 'end';
			  	})
			  	.attr('dx', function(d) {
			  		return (d.dir == 1) ? '1.5em' : '-1.5em';
			  	})
			  	.attr('dy', 0)
			  	.attr('transform', function(d) {
			  		return 'translate(' + projection( [d.lon, d.lat] ) + ') rotate(-90)';
			  	})
			  	.text( function(d) { return d.size; });

			labels.on('mouseover', mouseover )
				.on('mouseout', mouseout );

			function mouseover() {
				movement.call( filter, fadeOut );
				cities.call( filter, fadeOut );
				rivers.call( filter, fadeOut );
			};

			function mouseout() {
				movement.call( filter, fadeIn );
				cities.call( filter, fadeIn );
				rivers.call( filter, fadeIn );
			};

		});

		return chart;
	};

	chart.controls = function() {

		var layers = [
			{
				legend: 'countries',
				el: function() { return world; }
			},
			{
				legend: 'advance',
				el: function() { return d3.selectAll('.advance'); }
			},
			{
				legend: 'retreat',
				el: function() { return d3.selectAll('.retreat'); }
			},
			{
				legend: 'cities',
				el: function() { return cities; }
			},
			{
				legend: 'survivors',
				el: function() { return labels; } 
			},
			{
				legend: 'rivers',
				el: function() { return rivers; }
			}
		];

		controls.attr('transform', 'translate(' + (width-margin.right-480) + ',0)');

		control = controls.selectAll('.control')
			.data( layers )
		  .enter().append('svg:g')
		  	.attr('class', 'control');

		control.append('svg:circle')
			.attr('class', 'control-symbol')
			.attr('r', 5)
			.attr('cx', function(d,i) {
				return i * 80;
			})
			.attr('cy', 0);

		control.append('svg:text')
			.attr('class', 'control-text')
			.attr('dy', '.35em')
			.attr('transform', function(d,i) {
				return 'translate(' + (i*80 + 10) + ',0)';
			})
			.text( function(d) {
				return d.legend;
			});

		control.on('click', onClick);

		function onClick() {

			var selection = d3.select( this );
			
			// Toggle the class:
			selection.classed('hidden', function(d) {
					return ( d3.select( this ).classed('hidden') ) ? 0 : 1;
				});

			if ( selection.classed('hidden') ) {
				selection.select( function(d) {
					var el = d.el();

					el.classed('hidden', 1)
						.transition()
						.duration( 500 )
						.attr('opacity', 0);					

				});
			} else {
				selection.select( function(d) {
					var el = d.el();

					el.classed('hidden', 0)
						.call( fadeIn );
				});
			}


		};

		return chart;
	}

	function fadeOut() {
		this.transition()
			.duration( 500 )
			.attr('opacity', 0.1);
	};

	function fadeIn() {
		this.transition()
			.duration( 500 )
			.attr('opacity', 1);
	};

	function filter( selection, clbk ) {
		selection = selection.filter( function(d) {
			return !d3.select( this ).classed('hidden');
		})
		.call( clbk );		
	};

	// Set/Get: height
	chart.height = function( _ ) {
		if (!arguments.length) return height;
		height = _;
		return chart;
	};

	// Set/Get: width
	chart.width = function( _ ) {
		if (!arguments.length) return width;
		width = _;
		return chart;
	};

	// Set/Get: scale
	chart.scale = function( _ ) {
		if (!arguments.length) return scale;
		scale = _;
		projection.scale( scale );
		return chart;
	};

	// Set/Get: center
	chart.center = function( _ ) {
		if (!arguments.length) return center;
		center = _;
		projection.center( center );
		return chart;
	};

	// Set/Get: precision
	chart.precision = function( _ ) {
		if (!arguments.length) return precision;
		precision = _;
		projection.precision( precision );
		return chart;
	};

	return chart;

}; // end FUNCTION geo()
