(function () {

  var margin = { top: 60, left: 200, right: 30, bottom: 50}
      height = 500 - margin.top - margin.bottom
      width = 1000 - margin.left - margin.right
  
  // Grab the SVG from the page, set the height and width
  var svg = d3.select("#chart1")
      .append("svg")
      .attr("height", height + margin.bottom + margin.top)
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

  var colorScale = d3.scaleLog()
    .range(['white', '#9E4B6C'])

  //Append a defs (for definition) element to your SVG
  var defs = svg.append("defs");

  //Append a linearGradient element to the defs and give it a unique id
  var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient")

  linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")

  //Set the color for the start (0%)
  linearGradient.append("stop") 
      .attr("offset", "0%")   
      .attr("stop-color", "white")

  //Set the color for the end (100%)
  linearGradient.append("stop") 
      .attr("offset", "100%")   
      .attr("stop-color", "#9E4B6C")

  svg.append("rect")
     .attr('class', 'radient_bar')
     .attr('x', width/2 - 175)
     .attr('y', -60)
     .attr("width", 170)
     .attr("height", 15)
     .style("fill", "url(#linear-gradient)")

   svg.append("text")
            .attr("x", width/2 -260)
            .attr("y", -50)
            .text("Small Salary Pool")
            .attr("font-size", "8px")

  svg.append("text")
            .attr("x", width/2 +10)
            .attr("y", -50)
            .text("Large Salary Pool")
            .attr("font-size", "8px")


  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var formatPercent = d3.format(",.2r")
        salary = +d.salary_total_x/1000000
        return "<strong>" + d.Employer + "</strong>"
        + "<br>" +  "<span style='color:black'>" + "C$" + formatPercent(salary) + " million"
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
      // colorredScale.domain([100000000, salaryMax])

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
        .attr("height", 28)
        .attr('width', 3)
        .attr('stroke', '#9E4B6C')
        .attr('stroke-width', 0.2)
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

        var smallcolorScale = d3.scaleLinear()
           .range(['white', '#9E4B6C']) 

        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", width/2 + 50)
            .attr("y", height+30)
            .text("Change of Salary Pool from 2015 to 2016 (%, per agency)")
            .attr("font-size", "10px")

         d3.select("#one-million")
           .on('click', function() {
              svg.selectAll("rect")
                  .transition()
                  .duration(500)
                  .attr("fill", function(d) {
                      if(+d.salary_total_x >= salaryMin && +d.salary_total_x <= 1000000) {
                        smallcolorScale.domain([salaryMin,1000000])
                        return smallcolorScale(d.salary_total_x)
                      } else {
                        return '#F6F6F6'
                      }
                  })
                  .attr("stroke", function(d) {
                  if(+d.salary_total_x >= 50000000 && +d.salary_total_x <= 100000000) {
                    return '#9E4B6C'
                  } else {
                    return '#F6F6F6'
                  }
                })
                svg.selectAll("rect")
                  .filter(function(d) {
                    return +d.salary_total_x >= salaryMin && +d.salary_total_x <= 1000000
                  })
                  .raise()
           })

          d3.select("#ten-million")
          .on('click', function() {
            svg.selectAll("rect")
                .filter(function(d) {
                  return +d.salary_total_x >= 1000000 && +d.salary_total_x <= 10000000
                })
                .raise()
            svg.selectAll("rect")
              .raise()
              .transition()
              .duration(500)
              .attr("fill", function(d) {
                if(+d.salary_total_x >= 1000000 && +d.salary_total_x <= 10000000) {
                  smallcolorScale.domain([1000000,10000000])
                  return smallcolorScale(d.salary_total_x)
                } else {
                  return '#F6F6F6'
                }
              })
              .attr("stroke", function(d) {
                if(+d.salary_total_x >= 50000000 && +d.salary_total_x <= 100000000) {
                  return '#9E4B6C'
                } else {
                  return '#F6F6F6'
                }
              })
            })

          d3.select("#fifty-million")
          .on('click', function() {
            svg.selectAll("rect")
                .filter(function(d) {
                  return +d.salary_total_x >= 10000000 && +d.salary_total_x <= 50000000
                })
                .raise()
            svg.selectAll("rect")
                .filter(function(d) {
                  return +d.salary_total_x >= 10000000 && +d.salary_total_x <= 50000000
                })
                .raise()
            svg.selectAll("rect")
              .transition()
              .duration(500)
              .attr("fill", function(d) {
                if(+d.salary_total_x >= 10000000 && +d.salary_total_x <= 50000000) {
                  smallcolorScale.domain([10000000,50000000])
                  return smallcolorScale(d.salary_total_x)
                } else {
                  return '#F6F6F6'
                }
              })
              .attr("stroke", function(d) {
                if(+d.salary_total_x >= 50000000 && +d.salary_total_x <= 100000000) {
                  return '#9E4B6C'
                } else {
                  return '#F6F6F6'
                }
              })
            })

          d3.select("#one-hundred-million")
            .on('click', function() {
              svg.selectAll("rect")
                .filter(function(d) {
                  return +d.salary_total_x >= 50000000 && +d.salary_total_x <= 100000000
                })
                .raise()
              svg.selectAll("rect")
                .raise()
                .transition()
                .duration(500)
                .attr("fill", function(d) {
                  if(+d.salary_total_x >= 50000000 && +d.salary_total_x <= 100000000) {
                    smallcolorScale.domain([50000000,100000000])
                    return smallcolorScale(d.salary_total_x)
                  } else {
                    return '#F6F6F6'
                  }
                })
                .attr("stroke", function(d) {
                  if(+d.salary_total_x >= 50000000 && +d.salary_total_x <= 100000000) {
                    return '#9E4B6C'
                  } else {
                    return '#F6F6F6'
                  }
                })
              })

          d3.select("#one-billion")
            .on('click', function() {
              svg.selectAll("rect")
                .filter(function(d) {
                  return +d.salary_total_x >= 100000000
                })
                .raise()
              svg.selectAll("rect")
              .transition()
              .duration(500)
              .attr("fill", function(d) {
                if(+d.salary_total_x >= 100000000) {
                  smallcolorScale.domain([100000000,salaryMax])
                  return smallcolorScale(d.salary_total_x)
                } else {
                  return '#F6F6F6'
                }
              })
              .attr("stroke", function(d) {
                if(+d.salary_total_x >= 100000000) {
                  return '#9E4B6C'
                } else {
                  return '#F6F6F6'
                }
              })             
            })

            d3.select("#all")
            .on('click', function() {
            svg.selectAll("rect")
              .transition()
              .duration(500)
              .attr('fill', function(d) {
                  smallcolorScale.domain([salaryMin, salaryMax])
                  return colorScale(d.salary_total_x)
              })
            })

  }

})()