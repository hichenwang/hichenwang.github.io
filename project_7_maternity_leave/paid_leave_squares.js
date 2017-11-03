(function() {
    var margin = { top: 80, left: 100, right:100, bottom: 50},
    height = 500 - margin.top - margin.bottom,
    width = 1000 - margin.left - margin.right;


  var container = d3.select("#chart2")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var widthScale = d3.scaleLinear()
      .domain([0, 200])
      .range([0,width])

  var colorScale = d3.scaleOrdinal()
      .range(['#65BB57', '#C9E1C0'])
      
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
    .defer(d3.csv, '180_paid_leave.csv')
    .await(ready)

  function ready(error, datapoints) { 

    var companies = datapoints.map(function(d) { 
                        return d.company
                      })
    
    var xLayoutScale = d3.scaleBand()
        .domain(companies)
        .range([0,width])
        .paddingInner(0.25)

    var squaresAcross = 5

    var squareXPositionScale = d3.scaleBand()
        .domain([0, 1, 2, 3, 4])
        .range([0, xLayoutScale.bandwidth()])
        .padding(.1)

    // This is how big each square is
    var squareSize = squareXPositionScale.bandwidth()

    container.selectAll("g")
        .data(datapoints)
        .enter().append("g")
        .attr('id', 'square_bars')
        .attr("transform", function(d) {
          return "translate(" +xLayoutScale(d.company) + ",0)"
         })
        .each(function(d) {
          var block = d3.select(this)
          var datapoints = d3.range(0, d.paid_leave_weeks, 1)

        block.selectAll('rect')
            .data(datapoints)
            .enter().append('rect')
            .attr("class", 'square')
            .attr("width", squareSize) // need a little padding
            .attr("height", squareSize) // need a little padding
            .attr("x", function(d) {
              // (i % squaresAcross) counts up as
              // 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2....
              return squareXPositionScale(d % squaresAcross)
            })
            .attr("y", function(d) {
              // Math.floor(i / squaresAcross) counts up as
              // 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2...
              // and then we multiple by squareSize to go up X rows
              var row = 9-d
              var squareAndPadding = (squareSize * (1 + squareXPositionScale.padding()))
              return Math.floor(row / squaresAcross) * squareAndPadding
            })
            .attr('fill', 'red')
        })

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

    
  container.append("text")
      .data(datapoints.columns.slice(1)) 
      .enter().append('text')
      .text(function(d) {
          return +d.maternity_lengths_in_weeks
      })
      .attr("x", function(d) { 
        return widthScale(+d.maternity_lengths_in_weeks + +d.paternity_lengths_in_weeks) +13
      })
      .attr("y", function(d) { 
        console.log(d, d.country)
        return heightScale(d.country)
      })
      .attr("font-size", "10px")
      .attr('fill', 'black')
      .attr('font-weight', 'bold')


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

     

     container.append("text")
        .text('Companies that Offer Paid Paternity Leave')
        .attr("x",0)
        .attr("y", -60)
        .attr("text-anchor", "left")
        .attr("font-size", "15px")
        .attr('fill', 'black')
        // .attr('font-weight', 'bold')

    }


     // container.select("#Ontario-Power-Generation_svg")
     //   .append("text")
     //   .attr('class', 'annotation')
     //   .attr("x", 100)
     //   .attr("y", 100)
     //   .text("Highest Pay: C$1,165,701.85")


})();