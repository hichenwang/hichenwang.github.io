(function() {
    var margin = { top: 50, left: 50, right: 25, bottom: 50},
    height = 400 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;


  var container = d3.select("#chart1")
  //     .append("svg")
  //     .attr("height", height + margin.top + margin.bottom)
  //     .attr("width", width + margin.left + margin.right)
  //     .append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var widthScale = d3.scaleLinear()
      .range([0,width])
      .domain([0, 100])

  var countries = datapoints.map(function(d) { 
                        return d.country
                      })

  var heightScale = d3.scalePoint()
      .domain(countries)
      .range([height,0])
      .padding(0.5)

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
    .defer(d3.csv, 'paid_leave_for_mothers.csv')
    .await(ready)

  function ready(error, datapoints) { 

      svg.selectAll('rect')
        .data(datapoints)
        .enter().append('rect')
        .attr('x', function(d){
          return widthScale(d.lengths_in_weeks)
        })
        .attr('y', function(d){
          return heightScale.bandwidth()
        })
        .attr('height', function(d){
          return height - heightScale(d.count_percent)
        })
        .attr('width', 5)
        .attr('fill', '#9E4B6C')
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

      var yAxis = d3.axisLeft(heightScale)
      svg.append("g")
         .attr("class", "axis y-axis")
         .call(yAxis)
         // .select(".domain").remove()

      var xAxis = d3.axisBottom(widthScale)
         .ticks(20)
         .tickSize(-height)
      svg.append("g")
         .attr("class", "axis x-axis")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis)

      svg.selectAll(".tick line")
         .attr("stroke-dasharray", 1.5)
         .attr('stroke', 'lightgrey')

     svg.append("text")
        .text(d.key)
        .attr("x", width / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr('fill', 'black')
        .attr('font-weight', 'bold')

    }


     // container.select("#Ontario-Power-Generation_svg")
     //   .append("text")
     //   .attr('class', 'annotation')
     //   .attr("x", 100)
     //   .attr("y", 100)
     //   .text("Highest Pay: C$1,165,701.85")


})();