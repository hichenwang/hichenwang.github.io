(function () {

  var margin = { top: 100, left: 200, right: 150, bottom: 30},
      height = 450 - margin.top - margin.bottom,
      width = 800 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var xPositionScale = d3.scaleLinear()
    .domain([0,40])
    .range([0, width])

  var yPositionScale = d3.scalePoint()
  	.range([height,0])
  	.padding(.3)

  d3.queue()
    .defer(d3.csv, 'industry_range_chart.csv')
    .await(ready)

  function ready(error, datapoints) { 

  var sectors = datapoints.map(function(d) { 
        return d.sector
    })

  yPositionScale.domain(sectors.reverse())

  svg.selectAll('line')
     .data(datapoints)
     .enter().append('line')
     .attr('r', 5)
     .attr('x1', function(d){
        return xPositionScale(d.paid_upper)
      })
     .attr('y1', function(d){
       return yPositionScale(d.sector)
     })
     .attr('x2', function(d){
         return xPositionScale(d.paid_lower)
     })
     .attr('y2', function(d){
         return yPositionScale(d.sector)
     })
     .attr('stroke', 'black')
     .attr('stroke-width', 0.5)

  svg.selectAll('.tick_upper')
      .data(datapoints)
      .attr('class', 'tick_upper')
      .enter().append('rect')
      .attr('height', 10)
      .attr('width', 1.5)
      .attr('x', function(d){
          return xPositionScale(d.paid_upper)
      })
      .attr('y', function(d){
          return yPositionScale(d.sector) -5
      })
      .attr('fill', '#DDA0DD')

   svg.selectAll('.tick_lower')
      .data(datapoints)
      .attr('class', 'tick_lower')
      .enter().append('rect')
      .attr('height', 10)
      .attr('width', 1.5)
      .attr('x', function(d){
          return xPositionScale(d.paid_lower)
      })
      .attr('y', function(d){
          return yPositionScale(d.sector) -5
      })
      .attr('fill', '#DDA0DD')

  svg.selectAll('.circle_average')
      .data(datapoints)
      .attr('class', 'average')
      .enter().append('circle')
      .attr('r', 3.5)
      .attr('cx', function(d){
          return xPositionScale(d.paid_family_leave)
      })
      .attr('cy', function(d){
          return yPositionScale(d.sector)
      })
      .attr('fill', '#DDA0DD')


  svg.selectAll('.worker_percent')
      .data(datapoints)
      .attr('class', 'worker_percent')
      .enter().append('text')
      .text(function(d){
        return d.paid_family_leave
      })
      .attr('x', function(d){
          return xPositionScale(d.paid_family_leave)
      })
      .attr('y', function(d){
          return yPositionScale(d.sector) -6
      })
      .attr("text-anchor", "middle")


    // Always cut and paste the code for the axes, too!

  var yAxis = d3.axisLeft(yPositionScale)
  svg.append("g")
     .attr("class", "axis y-axis")
     .call(yAxis)

  svg.append("text")
        .text('Getting Paid Family Leave Depends on the Workplace')
        .attr("x",-100)
        .attr("y", -55)
        .attr("text-anchor", "left")
        .attr("font-size", "15px")
        .attr('fill', 'black')

  svg.append("text")
        .text('% of worker with access to paid family leave, by industry, 2016')
        .attr("x",-100)
        .attr("y", -35)
        .attr("text-anchor", "left")
        .attr("font-size", "12px")
        .attr('fill', 'grey')

}

})()