(function() {
    var margin = { top: 50, left: 50, right: 25, bottom: 50},
    height = 4300 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;


  var container = d3.select("#chart2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var widthScale = d3.scaleLinear()
      .range([0,width])
      .domain([100000, 1200000])

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var formatPercent = d3.format(",");
        return "<strong>" + "C$" + formatPercent(+d.rounded_salary_2016) + "</strong>"
        + "<br>" +  "<span style='color:black'>" + +d.count + " people"
         // + formatPercent(d.percentage) + '%'
      })

  container.call(tip)

  d3.queue()
    .defer(d3.csv, 'group_by_salary_barcharts.csv')
    .await(ready)

  function ready(error, datapoints) { 

      var nested = d3.nest()
          .key(function(d) {
            return d.sector
          })
          .entries(datapoints)

      // var sectors = nested.map(function(d) { 
      //   return d.key
      //   })
      var sectors = [
      'Government of Ontario - Judiciary',
      'Government of Ontario - Ministries',
      'Government of Ontario - Legislative Assembly and Offices',
      'Ontario Power Generation', 
      'Municipalities and Services', 
      'Universities',
      'Colleges',
      'School Boards', 
      'Crown Agencies',
      'Hospitals and Boards of Public Health',
      'Other Public Sector Employers',
      ]

      var yLayoutScale = d3.scaleBand()
        .domain(sectors)
        .range([0,height])
        .paddingInner(0.4)

      var heightScale = d3.scaleLinear()
        .range([yLayoutScale.bandwidth(), 0])
        .domain([0, 30])

      var percentages = datapoints.map(function(d) { 
                        return d.percentage
                      })


      container.selectAll("g")
          .data(nested)
          .enter().append("g")
          .attr('id', function(d) {
            return d.key.replace(/[^\w]+/g, "-")
          })
          .attr("transform", function(d) {
                  return "translate(0," + yLayoutScale(d.key) + ")"
           })
          .each(function(d) {
            var svg = d3.select(this)
            var datapoints = d.values

            var yAxis = d3.axisLeft(heightScale)
              .tickFormat(function(d) { return d + "%"; })
              .ticks(7)
              .tickSize(-height)
            svg.append("g")
               .attr("class", "axis y-axis")
               .call(yAxis)
               .select(".domain").remove()

            var xAxis = d3.axisBottom(widthScale)
              .tickValues([100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000, 1200000])
            svg.append("g")
               .attr("class", "axis x-axis")
               .attr("transform", "translate(0," + yLayoutScale.bandwidth() + ")")
               .call(xAxis)

            svg.selectAll(".tick line")
               .attr("stroke-dasharray", 1.5)
               .attr('stroke', 'lightgrey')

            svg.selectAll('rect')
               .data(datapoints)
              .enter().append('rect')
              .attr('x', function(d){
                return widthScale(d.rounded_salary_2016)
              })
              .attr('y', function(d){
                return heightScale(d.percentage)
              })
              .attr('height', function(d){
                return yLayoutScale.bandwidth() - heightScale(d.percentage)
              })
              .attr('width', 3.5)
              .attr('fill', '#9E4B6C')
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
                // .attr('opacity', 0.25)

            svg.append("text")
              .text(d.key)
              .attr("x", width / 2)
              .attr("y", -30)
              .attr("text-anchor", "middle")
              .attr("font-size", "15px")
              .attr('fill', 'black')
              .attr('font-weight', 'bold')

    }

  )}

    // var line = d3.line()
    //     .x(function(d) {
    //       return xPositionScale(d.datetime)
    //     })
    //     .y(function(d) {
    //       return yPositionScale(d.Close)
    //     })
    //     .curve(d3.curveMonotoneX)

    // svg.append("path")
    //   .datum(datapoints)
    //   .attr("d", line)
    //   .attr("stroke", "#4cc1fc")
    //   .attr("stroke-width", 2)
    //   .attr("fill", "none")

     container.append("text")
       .attr('class', 'annotation')
       .attr("x", widthScale(1155000)-70)
       .attr("y", 1280)
       .text("Highest Pay: C$1,155,000")

       console.log(widthScale(1155000))

     container.append("circle")
       .attr('class', 'annotation_circle')
       .attr("cx", widthScale(1155000)+2)
       .attr("cy", 1430)
       .attr('r', 12)

     container.append("line")
       .attr('class', 'annotation_line')
       .attr('x1', widthScale(1155000) +2)
       .attr('x2', widthScale(1155000) +2)
       .attr('y1', 1290)
       .attr('y2', 1410)
       .attr('marker-end', "url(#triangle)")

     defs = container.append("defs")

     defs.append("marker")
         .attr('id', 'triangle')
         .attr("viewBox", "0 0 10 10")
         .attr('refX', 0)
         .attr('refY', 5)
         .attr('markerWidth', 4)
         .attr('markerHeight', 4)
         .attr('orient', 'auto')
         .append("path")
         .attr("d", "M 0 0 L 10 5 L 0 10 z")
         .attr("class","arrowHead")


})();