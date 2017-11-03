(function() {
    var margin = { top: 100, left: 100, right:100, bottom: 50},
    height = 650 - margin.top - margin.bottom,
    width = 700 - margin.left - margin.right;


  var container = d3.select("#chart1")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var widthScale = d3.scaleLinear()
      .domain([0, 45])
      .range([0,width])

  var colorScale = d3.scaleOrdinal()
      .range(['#DDA0DD', '#ADD8E6'])
      
  // var tip = d3.tip()
  //     .attr('class', 'd3-tip')
  //     .offset([-10, 0])
  //     .html(function(d) {
  //       var formatThousand = d3.format(",");
  //       return "<strong>" + "C$" + formatThousand(+d.rounded_salary_2016) + "</strong>"
  //       + "<br>" +  "<span style='color:black'>" + +d.count_percent + " people"
  //        // + formatPercent(d.percentage) + '%'
  //     })

  // container.call(tip)

  d3.queue()
    .defer(d3.csv, 'paid_leave.csv')
    .await(ready)

  function ready(error, datapoints) { 

    var countries = datapoints.map(function(d) { 
                        return d.country
                      })

    var heightScale = d3.scaleBand()
      .domain(countries.reverse())
      .range([height,0])
      .padding(0.3)

    var yAxis = d3.axisLeft(heightScale)
    
    container.append("g")
       .attr("class", "axis y-axis")
       .call(yAxis)
       .select(".domain").remove()

    var xAxis = d3.axisTop(widthScale)
       .ticks(9)
       .tickSize(-height)
    container.append("g")
       .attr("class", "axis x-axis")
       .attr("transform", "translate(0, -5)")
       .call(xAxis)
       .select(".domain").remove()

    container.selectAll(".tick line")
       .attr('stroke', 'lightgrey')
       .attr('opacity', 0.5)


    container.selectAll(".y-axis text")
      .attr("class", function(d){
        return d.replace(/[^A-Za-z]+/, '-').toLowerCase()
      })

    // var stack = d3.stack()
    //   .keys(["maternity_lengths_in_weeks", "paternity_lengths_in_weeks"])
    //   .order(d3.stackOrderNone)
    //   .offset(d3.stackOffsetNone)

    var stack = d3.stack()

    console.log(stack.keys(datapoints.columns.slice(1))(datapoints))

    // container.selectAll('rect')
    //   .data(datapoints)
    //   .enter().append('rect')
    //   .attr('x', 0)
    //   .attr('y', function(d){
    //     return heightScale(d.country)
    //   })
    //   .attr('width', function(d){
    //     return widthScale(d.maternity_lengths_in_weeks)
    //   })
    //   .attr('height', heightScale.bandwidth())
    //   .attr('fill', '#F8A235')

    console.log(stack.keys(datapoints.columns.slice(1))(datapoints)[0][0].data)
    console.log(stack.keys(datapoints.columns.slice(1))(datapoints))

    container.selectAll(".serie")
      .data(stack.keys(datapoints.columns.slice(1))(datapoints))
      .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) {
        return colorScale(d.key) 
      })
      .attr('stroke-width', 1.5)
      .attr('stroke', 'white')
      .selectAll("rect")
      .data(function(d) { 
        return d
      })
      .enter().append("rect")
      .attr("x", function(d) { 
        return widthScale(d[0])
      })
      .attr("y", function(d) { 
        return heightScale(d.data.country)
      })
      .attr('height', heightScale.bandwidth())
      .attr("width", function(d) { 
        return widthScale(d[1]) -widthScale(d[0])
      })
      // .text(function(d) {
      //     return d[1]
      // })
      // .attr("x", function(d) { 
      //   return widthScale(d[1])
      // })
      // .attr("y", function(d) { 
      //   return heightScale(d.data.country)
      // })
      // .attr("font-size", "10px")
      // .attr('fill', 'black')
      // .attr('font-weight', 'bold')

    // var legend = container.selectAll(".legend")
    //     .data(datapoints.columns.slice(1))
    //     .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", function(d, i) { 
    //       return "translate(" + i * 170 + ", -18)"
    //     })

    // legend.append("rect")
    //     .attr("y", -30)
    //     .attr("width", 10)
    //     .attr("height", 15)
    //     .attr("fill", function(d) {
    //     return colorScale() 
    //   })

    // legend.append("text")
    //     .attr("x", 13)
    //     .attr("y", -20)
    //     .attr("dx", ".4em")
    //     .attr("text-anchor", "start")
    //     .text(function(d) { 
    //       return d.replace(/[_]+/g, ' ')
    //     })
    //     .style('font-weight', 'bold')
      // .on('mouseover', function(d) {
      //    d3.select(this)
      //      .transition()
      //      .duration(300)
      //      tip.show(d)    
      //  })
      //  .on('mouseout', function(d) {
      //    d3.select(this)
      //      .transition()
      //      .duration(300)
      //      tip.hide(d)
      //    })
    

    container.append("rect")
      .attr("y", -50)
      .attr("x", 0)
      .attr("width", 10)
      .attr("height", 15)
      .attr("fill", "#DDA0DD")

    container.append("rect")
        .attr("y", -50)
        .attr("x", 160)
        .attr("width", 10)
        .attr("height", 15)
        .attr("fill", "#ADD8E6")

     container.append("text")
        .attr("x", 13)
        .attr("y", -40)
        .attr("dx", ".4em")
        .attr("text-anchor", "start")
        .text("maternity lengths in weeks")
        .style('font-weight', 'bold')

     container.append("text")
        .attr("x", 175)
        .attr("y", -40)
        .attr("dx", ".4em")
        .attr("text-anchor", "start")
        .text("paternity lengths in weeks")
        .style('font-weight', 'bold')

     container.append("text")
        .text('U.S. is the Only OECD Countries that Has No Paid Parental Leave')
        .attr("x",0)
        .attr("y", -65)
        .attr("text-anchor", "left")
        .attr("font-size", "15px")
        .attr('fill', 'black')

      container.append("line")
        .attr("x1",0)
        .attr("y1", 0)
        .attr("x2",0)
        .attr("y2", 100)
        .attr('storke', 'black')
        // .attr('font-weight', 'bold')

    }



})();