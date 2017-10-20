(function () {

  var margin = { top: 30, left: 200, right: 30, bottom: 30},
      height = 600 - margin.top - margin.bottom,
      width = 1000 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart3")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      console.log(svg)

  var xPositionScale = d3.scaleLinear()
    .range([0, width])

  var yPositionScale = d3.scalePoint()
  	.domain([ 
      'Other Public Sector Employers',
      'Hospitals and Boards of Public Health',
      'Crown Agencies',
      'School Boards', 
      'Colleges',
      'Universities',
      'Municipalities and Services', 
      'Ontario Power Generation', 
      'Government of Ontario - Legislative Assembly and Offices',
      'Government of Ontario - Ministries',
      'Government of Ontario - Judiciary',
      ])
  	.range([height,0])
  	.padding(0.5)

  var colorScale = d3.scaleLinear()
    .range(['white', '#9E4B6C'])

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var formatPercent = d3.format(",");
        return "<strong>" + d.Employer + "</strong>"
        + "<br>" +  "<span style='color:black'>" + "C$" + formatPercent(+d.salary_total_x)
      })

  svg.call(tip)

  d3.queue()
    .defer(d3.csv, 'employers_with_sectors.csv')
    .await(ready)

  function ready(error, datapoints) { 


  var salarychangeMax = d3.max(datapoints, function(d) { 
      return +d.change
    })

  var salarychangeMin = d3.min(datapoints, function(d) { 
      return +d.change
    })

  xPositionScale.domain([salarychangeMin, salarychangeMax])

  var salaryMax = d3.max(datapoints, function(d) { 
      return +d.salary_total_x
    })

  var salaryMin = d3.min(datapoints, function(d) { 
      return +d.salary_total_x
    })

  colorScale.domain([salaryMin, salaryMax])

  var yAxis = d3.axisLeft(yPositionScale)
  svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis)
    .select(".domain").remove()


  var xAxis = d3.axisBottom(xPositionScale).tickSize(-height)
    .tickValues([-100, -50, 0, 50, 100, 150, 200, 250, 300, 350, 400])
    .tickFormat(function(d) { return d + "%"; })
  svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .select(".domain").remove()

  svg.selectAll(".tick line")
             .attr("stroke-dasharray", 1.5)
             .attr('stroke', 'lightgrey')
  
  svg.selectAll("rect")
      .data(datapoints)
      .enter().append("rect")
      .attr("x", function(d) {
        return xPositionScale(d.change)
      })
      .attr("y", function(d) {
        return yPositionScale(d.Sector) - 13
      })
      .attr("height", 30)
      .attr('width', 1.5)
      // .attr("fill", '#9E4B6C')
      .attr('fill', function(d) {
        return colorScale(d.salary_total_x)
      })
      .on('mouseover', function(d) {
                 d3.select(this)
                   .transition()
                   .duration(300)
                   tip.show(d)     
               })
               .on('mouseout', function(d) {
                 d3.select(this)
                   .transition()
                   .duration(300)
                   tip.hide(d)
                 })

  }

})()