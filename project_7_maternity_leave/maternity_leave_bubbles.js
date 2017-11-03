(function() {
  var margin = { top: 50, left: 200, right: 200, bottom: 0},
      height = 500 - margin.top - margin.bottom,
      width = 1000 - margin.left - margin.right;
  
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
        return categoryScale(d.maternity_group)
      }))
      .force("y", d3.forceY(height/2))
      .force("collide", d3.forceCollide(5)) //A froce from the middle the avoid overlap
  
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
      .on("mouseover", function(d){
      })

      datapoints.forEach(function(d) {
        d.x = categoryScale(d.maternity_group)
        d.y = height/2
      })

      simulation.nodes(datapoints)
        .on('tick', ticked)

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
        .text('40 Out of 1534 Companies Beat OECD Country Average')
        .attr("x", -65)
        .attr("y", 0)
        .attr("text-anchor", "left")
        .attr("font-size", "15px")
        .attr('fill', 'black')

    svg.append("text")
        .text('Every point represents a company')
        .attr("x",-65)
        .attr("y", 20)
        .attr("text-anchor", "left")
        .attr("font-size", "12px")
        .attr('fill', 'grey')


  }

})();