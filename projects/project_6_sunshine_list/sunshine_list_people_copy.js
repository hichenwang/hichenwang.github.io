(function() {
    var margin = { top: 50, left: 50, right: 25, bottom: 50},
    height = 400 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;


  var container = d3.select("#chart2")
  //     .append("svg")
  //     .attr("height", height + margin.top + margin.bottom)
  //     .attr("width", width + margin.left + margin.right)
  //     .append("g")
  //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var widthScale = d3.scaleLinear()
      .range([0,width])
      .domain([100000, 1200000])

  var heightScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 30])
      // .paddingOuter(0.4)

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var formatThousand = d3.format(",");
        return "<strong>" + "C$" + formatThousand(+d.rounded_salary_2016) + "</strong>"
        + "<br>" +  "<span style='color:black'>" + formatThousand(+d.count) + " people"
         // + formatPercent(d.percentage) + '%'
      })


  d3.queue()
    .defer(d3.csv, 'group_by_salary_barcharts_count_percent.csv')
    .await(ready)

  function ready(error, datapoints) { 

      var nested = d3.nest()
          .key(function(d) {
            return d.sector
          })
          .entries(datapoints)


      nested.forEach(function(d) {
          // key of 'cat' becomes '#cat' to get <div id="cat"></div>
          // next loop it will get <div id="dog"></div>
          var svg = d3.select('#' + d.key.replace(/[^\w]+/g, "-"))
             .append("svg")
             .attr('id', d.key.replace(/[^\w]+/g, "-") + '_svg')
             .attr("height", height + margin.top + margin.bottom)
             .attr("width", width + margin.left + margin.right)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          
          svg.call(tip)

      var datapoints = d.values

      var percentages = datapoints.map(function(d) { 
                        return d.count_percent
                      })

      var yAxis = d3.axisLeft(heightScale)
         .tickFormat(function(d) { return d + "%"; })
         .ticks(7)
         .tickSize(-width)
      svg.append("g")
         .attr("class", "axis y-axis")
         .call(yAxis)
         .select(".domain").remove()

      var xAxis = d3.axisBottom(widthScale)
        .tickValues([100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000, 1200000])
      svg.append("g")
         .attr("class", "axis x-axis")
         .attr("transform", "translate(0," + height + ")")
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
          return heightScale(d.count_percent)
        })
        .attr('height', function(d){
          return height - heightScale(d.count_percent)
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

     container.select("#Ontario-Power-Generation_svg")
       .append("text")
       .attr('class', 'annotation')
       .attr("x", 100)
       .attr("y", 100)
       .text("Highest Pay: C$1,165,701.85")


     container.select("#Ontario-Power-Generation_svg")
       .append("circle")
       .attr('class', 'annotation_circle')
       .attr("cx", widthScale(1165000)+2)
       .attr("cy", 100)
       .attr('r', 12)

     container.append("line")
       .attr('class', 'annotation_line')
       .attr('x1', widthScale(1165000) +2)
       .attr('x2', widthScale(1165000) +2)
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