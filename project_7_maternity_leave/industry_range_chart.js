(function () {

  var margin = { top: 100, left: 200, right: 150, bottom: 30},
      height = 450 - margin.top - margin.bottom,
      width = 600 - margin.left - margin.right;
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var xPositionScale = d3.scaleLinear()
    .domain([0,45])
    .range([0, width])

  var yPositionScale = d3.scalePoint()
  	.range([height,0])
  	.padding(.4)

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:black'>" + "upper end: " + d.paid_upper + " weeks" + "<br>" +
        "<span style='color:black'>" + "lower end: " + d.paid_lower + " weeks"
      })

  svg.call(tip)

  d3.queue()
    .defer(d3.csv, 'industry_range_chart.csv')
    .await(ready)

  function ready(error, datapoints) { 

  var sectors = datapoints.map(function(d) { 
        return d.sector
    })

  yPositionScale.domain(sectors.reverse())


  var xAxis = d3.axisBottom(xPositionScale)
     .ticks(9)
     .tickSize(height)

  svg.append("g")
     .attr("class", "axis x-axis")
     .attr("transform", "translate(0, 0)")
     .call(xAxis)
     .select(".domain").remove()

  svg.selectAll(".tick line")
     .attr('stroke', 'lightgrey')
     .attr('opacity', 0.5)

  var yAxis = d3.axisLeft(yPositionScale)
  svg.append("g")
     .attr("class", "axis y-axis")
     .call(yAxis)

  svg.selectAll('.range')
     .data(datapoints)
     .enter().append('line')
     .attr("class", "range")
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
     .attr('stroke', '#DDA0DD')
     .attr('stroke-width', 10)
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

  svg.selectAll('.tick_average')
    .data(datapoints)
    .attr('class', 'tick_average')
    .enter().append('rect')
    .attr('height', 10)
    .attr('width', 1)
    .attr('x', function(d){
        return xPositionScale(d.paid_family_leave)
    })
    .attr('y', function(d){
        return yPositionScale(d.sector) - 5
    })
    .attr('fill', 'white')

   // svg.selectAll('.tick_lower')
   //    .data(datapoints)
   //    .attr('class', 'tick_lower')
   //    .enter().append('rect')
   //    .attr('height', 10)
   //    .attr('width', 1.5)
   //    .attr('x', function(d){
   //        return xPositionScale(d.paid_lower)
   //    })
   //    .attr('y', function(d){
   //        return yPositionScale(d.sector) -5
   //    })
   //    .attr('fill', 'black')

  // svg.selectAll('.circle_average')
  //     .data(datapoints)
  //     .attr('class', 'average')
  //     .enter().append('circle')
  //     .attr('r', 3.5)
  //     .attr('cx', function(d){
  //         return xPositionScale(d.paid_family_leave)
  //     })
  //     .attr('cy', function(d){
  //         return yPositionScale(d.sector)
  //     })
  //     .attr('fill', 'black')

  svg.selectAll('.average_text')
      .data(datapoints)
      .attr('class', 'average_text')
      .enter().append('text')
      .text(function(d){
        return d.paid_family_leave
      })
      .attr('x', function(d){
          return xPositionScale(d.paid_family_leave)
      })
      .attr('y', function(d){
          return yPositionScale(d.sector) -8
      })
      .attr("text-anchor", "middle")
      .style("font-size", 8)

  // svg.selectAll('.upper_text')
  //     .data(datapoints)
  //     .attr('class', 'upper_text')
  //     .enter().append('text')
  //     .text(function(d){
  //       return d.paid_upper
  //     })
  //     .attr('x', function(d){
  //         return xPositionScale(d.paid_upper)
  //     })
  //     .attr('y', function(d){
  //         return yPositionScale(d.sector) + 3
  //     })
  //     .attr("text-anchor", "left")
  //     .attr("dx", 5)
  //     .style("font-size", 8)

  //   svg.selectAll('.lower_text')
  //     .data(datapoints)
  //     .attr('class', 'lower_text')
  //     .enter().append('text')
  //     .text(function(d){
  //       return d.paid_lower
  //     })
  //     .attr('x', function(d){
  //         return xPositionScale(d.paid_lower)
  //     })
  //     .attr('y', function(d){
  //         return yPositionScale(d.sector) + 3
  //     })
  //     .attr("text-anchor", "right")
  //     .attr("dx", -17)
  //     .style("font-size", 8)


  svg.append("text")
        .text('Getting Paid Family Leave Depends on the Workplace')
        .attr("x",-150)
        .attr("y", -55)
        .attr("text-anchor", "left")
        .attr("font-size", "15px")
        .attr('fill', 'black')

  svg.append("text")
        .text('% of worker with access to paid family leave, by industry, 2016')
        .attr("x",-150)
        .attr("y", -35)
        .attr("text-anchor", "left")
        .attr("font-size", "12px")
        .attr('fill', 'grey')

  svg.append("g")
       .attr("class", "axis y-axis")
       .call(yAxis)
       .select(".domain").remove()


}

})()