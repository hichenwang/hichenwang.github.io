(function() {
  var margin = { top: 0, left: 50, right: 50, bottom: 100},
      height = 800 - margin.top - margin.bottom,
      width = 800 - margin.left - margin.right;
  
  var svg = d3.select("#chart3")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var colorScale = d3.scaleLinear()
    .domain([0,52])
    .range(['white', '#BA55D3'])

  var categoryScale = d3.scalePoint()
    .range([-100, width])

   var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + d.name + "</strong>" 
        + "<br>" +  "<span style='color:black'>" + d.industry + "<br>"
        + "<br>" + "<span style='color:black'>" + "paid maternity leave: " + d.maternity_paid + " weeks"
      })

  svg.call(tip)

  /*
    Needs a d3 forceSimulation!
    used to figure out where everything goes

    The simulation needs to know about...
    1) pushing apart
    2) acknowledging links,
    3) not overlapping/colliding
    4) default positions on the x and y

    Node-link charts (can) require: 
      forceManyBody, forceCenter, forceCollide, 
      forceLink, forceX and forceY

    Create your simulation here
  */

  var simulation = d3.forceSimulation()
      .force("x", d3.forceX(function(d){
        if (d.maternity_group === "30-52 weeks") {
          return 300
        }
        else if (d.maternity_group === "20-30 weeks") {
          return 360
        }
        else if (d.maternity_group === "10-20 weeks") {
          return 280
        }
        else {
          return 420
        } 
      }))
      .force("y", d3.forceY(function(d){
        if (d.maternity_group === "30-52 weeks") {
          return 250
        }
        else if (d.maternity_group === "20-30 weeks") {
          return 250
        }
        else if (d.maternity_group === "10-20 weeks") {
          return 350
        }
        else {
          return 350
        } 
      }))
      .force("manybody", d3.forceManyBody().strength(-1.8))
      .force("collide", d3.forceCollide(4)) //A froce from the middle to avoid overlap
  
  d3.queue()
    .defer(d3.csv, "maternity_group_bubbles_notnull.csv")
    .await(ready)

  function ready (error, datapoints) {

    var categories = datapoints.map(function(d) { 
        return d.maternity_group
    })

    categoryScale.domain(categories)   

    // Add a circle for every datapoint
    // move them all to... I don't know, the middle
    var circles = svg.selectAll("circles")
      .data(datapoints)
      .enter().append("circle")
      .attr('r', 3)
      .attr('fill', function(d){
        return colorScale(d.maternity_paid)
      })
      .attr('stroke', 'lightgray')
      .attr('stroke-width', 0.5)
      .attr('cx', width/2)
      .attr('cy', height/2)
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

      datapoints.forEach(function(d) {
        d.x = width/2
        d.y = height/2
      })

    datapoints.forEach(function(d) {
      d.x = d.x + (Math.random() * 30) 
      d.y = d.y + (Math.random() * 30) 
    })

    simulation.nodes(datapoints)
      .on('tick', ticked)
    // setTimeout(function() {

    //   for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    //     simulation.tick();
    //   }

    //   ticked()
    // }, 1)

      function ticked() {
        circles
          .attr("cx", function(d){
            return d.x
          })
          .attr("cy", function(d){
            return d.y
          })
      }

    svg.append("text")
        .text('40 Out of 1534 Companies Beat OECD Country Average Paid Maternity Leave')
        .attr("x", 50)
        .attr("y", 30)
        .attr("text-anchor", "left")
        .attr("font-size", "15px")
        .attr('fill', 'black')

    svg.append("text")
        .text("Every point represents a company. Hover to see who are they.")
        .attr("x",50)
        .attr("y", 50)
        .attr("text-anchor", "left")
        .attr("font-size", "12px")
        .attr('fill', 'grey')

    svg.append("text")
        .text('30-52 weeks')
        .attr("x", 150)
        .attr("y", 170)
        .attr("text-anchor", "left")
        .attr("font-size", "10px")
        .attr('fill', 'black')
        .style("font-weight", 'bold')

    svg.append("text")
        .text('20-30 weeks')
        .attr("x", 410)
        .attr("y", 150)
        .attr("text-anchor", "left")
        .attr("font-size", "10px")
        .attr('fill', 'black')
        .style("font-weight", 'bold')

    svg.append("text")
        .text('10-20 weeks')
        .attr("x", 100)
        .attr("y",350)
        .attr("text-anchor", "left")
        .attr("font-size", "10px")
        .attr('fill', 'black')
        .style("font-weight", 'bold')

    svg.append("text")
        .text('0-10 weeks')
        .attr("x", 500)
        .attr("y", 350)
        .attr("text-anchor", "left")
        .attr("font-size", "10px")
        .attr('fill', 'black')
        .style("font-weight", 'bold')


  }

})();