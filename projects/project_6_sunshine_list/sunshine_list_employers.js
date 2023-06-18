(function () {

  var margin = { top: 30, left: 200, right: 30, bottom: 30},
      height = 400 - margin.top - margin.bottom,
      width = 1000 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
  	.padding(0.25)

  var radiusScale = d3.scaleSqrt()
    .domain([0, 2000000000])
    .range([0, 45])
     
  d3.queue()
    .defer(d3.csv, 'employers_with_sectors.csv')
    .await(ready)

  function ready(error, datapoints) { 


  var salaryMax = d3.max(datapoints, function(d) { 
      return +d.change
    })

  var salaryMin = d3.min(datapoints, function(d) { 
      return +d.change
    })

  xPositionScale.domain([salaryMin, salaryMax])
  
  svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("cx", function(d) {
        return xPositionScale(d.change)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.Sector)
      })
      .attr("r", function(d) {
        return radiusScale(d.salary_total_x)
      })
      .attr("fill", '#9E4B6C')
      .attr('opacity', 0.3)
      .attr('stroke', '#9E4B6C')

    // Always cut and paste the code for the axes, too!

  var yAxis = d3.axisLeft(yPositionScale);
  svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis)


  var xAxis = d3.axisBottom(xPositionScale)
  svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)


  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height-6)
    .text("Salary")
    .attr("font-size", "12px");


	svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Sectors")
      .attr("font-size", "12px")

  }

})()