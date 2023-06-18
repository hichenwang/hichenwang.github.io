(function() {
var margin = { top: 60, left: 50, right: 130, bottom: 30},
	height = 700 - margin.top - margin.bottom,
	width = 500 - margin.left - margin.right;

var svg = d3.select("#chart-1")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%B-%y")

	// Create your scales
var xPositionScale = d3.scaleLinear()
	.range([0, width])

var yPositionScale = d3.scaleLinear()
	.range([height, 0])

var colorScale = d3.scaleOrdinal()
	.range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'])

	// Create a d3.line function
var line = d3.line()
	.x(function(d) {
 	return xPositionScale(d.monthtime)
	})
	.y(function(d) {
	return yPositionScale(d.price)
	})

	// Import your data file using d3.queue()
	d3.queue()
    .defer(d3.csv, "housing-prices.csv", function(d) {
      d.monthtime = parseTime(d.month);
      return d;
    })
    .await(ready);


    function ready(error, datapoints) {

  	datapoints.sort(function(a, b) {
      return a.monthtime - b.monthtime
    })

    var dateMax = d3.max(datapoints, function(d) { 
      return d.monthtime
    })

    var dateMin = d3.min(datapoints, function(d) { 
      return d.monthtime 
    })

     
    xPositionScale.domain([dateMin, dateMax])


    var valueMax = d3.max(datapoints, function(d) { 
      return +d.price
    })

    var valueMin = d3.min(datapoints, function(d) { 
      return +d.price
    })

    yPositionScale.domain([valueMin, valueMax])

	// Draw your lines
	var nested = d3.nest()
      .key(function(d) {
        return d.region
      })
      .entries(datapoints)
    

    svg.selectAll("path")
	  .data(nested)
	  .enter().append("path")
	  .attr("fill", "none")
	  .attr("d", function(d) {
	    return line(d.values)
	  })
	  .attr('stroke', function(d){
	      return colorScale(d.key)
	  }) 
	  .attr('stroke-width',2)
	  .style("stroke-opacity", 0.6);


    svg.selectAll("circle")
		.data(nested)
		.enter().append("circle")
		.attr("fill", function(d) {
	  		return colorScale(d.key)
	  	})
		.attr("r", 3)
		.attr("cx", function(d) {
			return xPositionScale(d.values[d.values.length-1].monthtime)
		})
		.attr("cy", function(d) {
			return yPositionScale(d.values[d.values.length-1].price)
		})


    svg.selectAll("text")
    	.data(nested)
    	.enter().append("text")
    	.attr("font-size", "12px")
    	.text(function(d) {
    		return d.key
    	})
    	.attr("fill", 'grey')
    	.attr("x", function(d) {
    		return xPositionScale(d.values[d.values.length-1].monthtime)
    	})
    	.attr("y", function(d) {
    		return yPositionScale(d.values[d.values.length-1].price)
    	})
    	.attr("dx", 5)
    	.attr("dy", 5)


    svg.append("text")
    	.attr("class", "axis y-axis")
        .attr("x", (width / 2 + (margin.right - margin.left) / 2))     
        .attr("y", 0 - (margin.top / 4))
        .attr('dy', -5)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("U.S. housing prices fall in winter");


    svg.selectAll('.winter')
  		.data(nested)
  		.enter().append('rect').lower()
  		.attr("class", "winter")
  		.attr('width', (width/18)*3)
  		.attr('height', height)
  		.attr('fill', 'eaeaea')
  		.attr("x", function(d) {
    		return xPositionScale(d.values[d.values.length-8].monthtime)
    	})
  		.attr('y', 0)
  		.attr('fill', '#cccccc')


	// Add your axes
	var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat("%b-%y"));
    	svg.append("g")
      	.attr("class", "axis x-axis")
     	.attr("transform", "translate(0," + height + ")")
     	.call(xAxis);
      

    var yAxis = d3.axisLeft(yPositionScale);
   		 svg.append("g")
   	     .attr("class", "axis y-axis")
         .call(yAxis);

  }
  
})();