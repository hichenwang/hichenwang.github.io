
(function() {
  var margin = { top: 30, left: 50, right: 30, bottom: 30},
    height = 300 - margin.top - margin.bottom,
    width = 200 - margin.left - margin.right;

  var container = d3.select("#chart-3")

  // Create our scales
  var xPositionScale = d3.scaleLinear()
  	.range([0, width]);

  var yPositionScale = d3.scaleLinear()
  	.domain([0,20000])
  	.range([height, 0]);


  var line_usa = d3.line()
    .x(function(d) {
      return xPositionScale(d.year)
    })
    .y(function(d) {
      return yPositionScale(d.income)
    })


  var line_other = d3.line()
    .x(function(d) {
      return xPositionScale(d.year)
    })
    .y(function(d) {
      return yPositionScale(d.income)
    })


  // lines for countries other than the us

  d3.queue()
    .defer(d3.csv, "middle-class-income.csv")
    .defer(d3.csv, "middle-class-income-usa.csv")
    .await(ready);


  function ready(error1, datapoints, usaDatapoints) {

    var yearMax = d3.max(datapoints, function(d) { 
      return +d.year
    })
    var yearMin = d3.min(datapoints, function(d) { 
      return +d.year
    })
    xPositionScale.domain([yearMin, yearMax])


    var nested = d3.nest()
      .key(function(d) {
        return d.country
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

    var xAxis = d3.axisBottom(xPositionScale)
        .ticks(4)
        .tickSize(-height)
        .tickFormat(d3.format("d"))
        svg.append("g")
          .attr("class", "axis x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);


    var yAxis = d3.axisLeft(yPositionScale)
        .tickValues([5000, 10000, 15000, 20000])
        .tickSize(-width)
        .tickFormat(d3.format("$,d"))
        svg.append("g")
          .attr("class", "axis y-axis")
          .call(yAxis);


       svg.append("path")
	      .datum(datapoints)
	      .attr('class', "line_other")
	      .attr("stroke", '#9E4B6C')
	      .attr('fill', 'none')
	      .attr("stroke-width", 2)
	      .attr("d", line_other)


      svg.append("text")
          .text(d.key)
          .attr("x", width / 2)
          .attr("y", -10)
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr('fill', '#9E4B6C')
          .attr('font-weight', 'bold')


       svg.append("path")
	      .datum(usaDatapoints)
	      .attr('class', "line_usa")
	      .attr('fill', 'none')
	      .attr('stroke', 'grey')
	      .attr("stroke-width", 2)
	      .attr("d", line_usa)


	   svg.append("text")
          .text('USA')
          .attr("x", 20)
          .attr("y", 30)
          .attr("font-size", "12px")
          .attr('fill', 'grey')


       svg.selectAll(".tick line")
		  .attr("stroke-dasharray", 2)
		  .attr('stroke', 'lightgrey')


		svg.selectAll(".domain").remove()


      })

  }

})();