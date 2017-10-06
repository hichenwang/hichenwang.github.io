
(function() {
  var margin = { top: 30, left: 30, right: 10, bottom: 20},
    height = 120 - margin.top - margin.bottom,
    width = 80 - margin.left - margin.right;

  var container = d3.select("#chart-2")

  // Create our scales
  var xPositionScale = d3.scaleLinear()
	.range([0, width])

  var yPositionScale = d3.scaleLinear()
	.range([height, 0])


  var area_jp = d3.area()
    .x0(function(d) {
      return xPositionScale(d.Age)
    })
    .y0(function(d) {
      return yPositionScale(d.ASFR_jp)
    })
    .x1(function(d) {
      return xPositionScale(d.Age)
    })
    .y1(function(d) {
      return height
    })


  var area_us = d3.area()
    .x0(function(d) {
      return xPositionScale(d.Age)
    })
    .y0(function(d) {
      return yPositionScale(d.ASFR_us)
    })
    .x1(function(d) {
      return xPositionScale(d.Age)
    })
    .y1(function(d) {
      return height
    })


  d3.queue()
    .defer(d3.csv, "fertility.csv")
    .await(ready);

  function ready(error, datapoints) {
	var ageMax = d3.max(datapoints, function(d) { 
      return +d.Age
    })
    var ageMin = d3.min(datapoints, function(d) { 
      return +d.Age 
    })
    xPositionScale.domain([ageMin, ageMax])


    var valueMax_jp = d3.max(datapoints, function(d) { 
      return +d.ASFR_jp
    })
    var valueMin_jp = d3.min(datapoints, function(d) { 
      return +d.ASFR_jp
    })
    var valueMax_us = d3.max(datapoints, function(d) { 
      return +d.ASFR_us
    })
    var valueMin_us = d3.min(datapoints, function(d) { 
      return +d.ASFR_us
    })

    var ageMaximum = d3.max([valueMax_jp, valueMax_us])
    var ageMinimum = d3.min([valueMin_jp, valueMin_us])
    yPositionScale.domain([ageMinimum, ageMaximum])


    var nested = d3.nest()
      .key(function(d) {
        return d.Year
      })
      .entries(datapoints)


    container.selectAll("svg")
      .data(nested)
      .enter().append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .each(function(d) {
        var svg = d3.select(this)
        var datapoints = d.values

    svg.append("path")
      .datum(datapoints)
      .attr("stroke", 'none')
      .attr("fill", "lightblue")
      .attr("d", area_us)

    svg.append("path")
      .datum(datapoints)
      .attr("stroke", 'none')
      .attr("fill", "red")
      .attr("d", area_jp)
      .attr('opacity', 0.5)

    svg.append("text")
      .text(d.key)
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")


    svg.append("text")
        .datum(datapoints)
    	.attr('class', 'jp_fertility')
    	.text(function(d) {
    		var numbers = datapoints.map(function(d) { return d.ASFR_jp })
    		var numberSum = d3.sum(numbers)
    		return numberSum.toFixed(2)
    	})
		.attr("fill", 'grey')
		.attr("font-size", "10px")
    	.attr("x", width/2)
    	.attr("y", height/2)
    	.attr("fill", "red")
        .attr('opacity', 0.5)
    	.attr("dx", 5)
    	.attr("dy", 5)


    svg.append("text")
        .datum(datapoints)
    	.attr('class', 'us_fertility')
    	.text(function(d) {
    		var numbers = datapoints.map(function(d) { return d.ASFR_us })
    		var numberSum = d3.sum(numbers)
    		return numberSum.toFixed(2)
    	})
		.attr("fill", 'grey')
		.attr("font-size", "10px")
    	.attr("x", width/2)
    	.attr("y", height/2-10)
    	.attr("fill", "lightblue")
    	.attr("dx", 5)
    	.attr("dy", 5)
    	

    var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("font-size", "10px")
      .call(xAxis)

    var yAxis = d3.axisLeft(yPositionScale).tickValues([0.0, 0.1, 0.2])
    svg.append("g")
      .attr("class", "axis y-axis")
      .attr("font-size", "10px")
      .call(yAxis)


  	})

	

  }

  

})();