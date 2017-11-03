(function() {
  var margin = { top: 0, left: 0, right: 0, bottom: 0},
      height = 700 - margin.top - margin.bottom,
      width = 700 - margin.left - margin.right;
  
  var svg = d3.select("#chart4")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

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
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(3.5))

  var colorScale = d3.scaleLinear()
    .domain([0,52])
    .range(['white', 'red'])

  d3.queue()
    .defer(d3.csv, "maternity_group_bubbles.csv")
    .await(ready)

  function ready (error, datapoints) {

    // Add a circle for every datapoint
    // move them all to... I don't know, the middle
    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr('fill', function(d) {
        return colorScale(d.maternity_paid)
      })
      .attr('stroke', 'lightgrey')
      .attr('r', 3)
      .attr('cx', 0)
      .attr('cy', 0)
      
    // We'll use this later
    // Hey simulation, here are our datapoints!

    simulation.nodes(datapoints)
      .on('tick', ticked)

    // d3.select("#decades").on('click', function() {
    //   var splitForce = d3.forceX(function(d) {
    //     if(d.decade === "pre-2000") {
    //       return width * 0.3
    //     } else {
    //       return width * 0.7
    //     }
    //   }).strength(1)
    //   // some of you go left, some of you go right
    //   simulation.force("x", splitForce)
    //   // Now restart the simulation
    //   simulation.alphaTarget(0.3).restart()
    // })

    // d3.select("#no-decades").on('click', function() {
    //   // Go back to the middle EVERYONE
    //   simulation.force("x", d3.forceX(width / 2))
    //   // Now restart the simulation
    //   simulation.alphaTarget(0.3).restart()
    // })
  
    // We'll use this later
    function ticked() {
      svg.selectAll("circle")
          .attr("cx", function(d) { 
            return d.x;
          })
          .attr("cy", function(d) { return d.y; });
    }

  }

})();