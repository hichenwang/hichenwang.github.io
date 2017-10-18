(function() {
    var margin = { top: 50, left: 100, right: 100, bottom: 50},
    height = 4500 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;


  var container = d3.select("#chart1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var widthScale = d3.scaleLinear()
      .range([0,width])

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var formatPercent = d3.format(".2");
        return "C$" + +d.rounded_salary_2016 + "<br>" + formatPercent(d.percentage) + '%'
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
        .paddingInner(0.3)

      var heightScale = d3.scaleLinear()
        .range([yLayoutScale.bandwidth(), 0])

      // var maxPercent = d3.max(datapoints, function(d) { 
      //                   return +d.percentage; 
      //                 })

      heightScale.domain([0, 30])

      // var maxSalary = d3.max(datapoints, function(d) { 
      //                   return +d.rounded_salary_2016; 
      //                 })

      widthScale.domain([100000, 1200000])

      var percentages = datapoints.map(function(d) { 
                        return d.percentage
                      })

      container.selectAll("g")
          .data(nested)
          .enter().append("g")
          .attr("transform", function(d) {
                  return "translate(0," + yLayoutScale(d.key) + ")"
           })
          .each(function(d) {
            var svg = d3.select(this)
            var datapoints = d.values

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
                // .attr('width', widthScale.bandwidth())
                .attr('fill', '#9E4B6C')
                .on('mouseover', function(d) {
                   d3.select(this)
                   console.log(this)
                      tip.show(d)     
                 })
                 .on('mouseout', function(d) {
                   d3.select(this)
                     tip.hide(d)
                 })
                // .attr('opacity', 0.25)

            var yAxis = d3.axisLeft(heightScale).tickFormat(function(d) { return d + "%"; }).ticks(7)
            svg.append("g")
               .attr("class", "axis y-axis")
               .call(yAxis)
               

            var xAxis = d3.axisBottom(widthScale).tickValues([100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000, 1200000])
            svg.append("g")
              .attr("class", "axis x-axis")
              .attr("transform", "translate(0," + yLayoutScale.bandwidth() + ")")
              .call(xAxis)

            // svg.selectAll(".tick line")
            //      .attr("stroke-dasharray", 2)
            //      .attr('stroke', 'lightgrey')
            //      .tickSize(-width)

            svg.append("text")
              .text(d.key)
              .attr("x", width / 2)
              .attr("y", -20)
              .attr("text-anchor", "middle")
              .attr("font-size", "15px")
              .attr('fill', 'black')
              .attr('font-weight', 'bold')

     

    }
  )}


})();