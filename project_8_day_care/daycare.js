(function() {
  var height = 700,
      width = 700;

  // We always just pretend the g is the svg
  var canvas = d3.select("#graphic-1")
        .append("canvas")
        // .append("svg")
        .attr("height", height)
        .attr("width", width)
        // .append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = canvas.node().getContext('2d')

  var colorScale = d3.scaleLinear()
    .domain([0, 30000, 60000, 90000, 120000, 444472])
    .range(['#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c'])

  /* 
    Create a new projection using Mercator (geoMercator)
    and center it (translate)
    and zoom in a certain amount (scale)
  */
  var projection = d3.geoConicConformal()
    .parallels([44.5, 53.5])
    .rotate([85,0])

 /*
    create a path (geoPath)
    using the projection
  */
  var path = d3.geoPath()
               .projection(projection)
               .context(context)


  d3.queue()
    // .defer(d3.csv, "data/capitals.csv")
    .defer(d3.json, "mygeodata/out3.json")
    .defer(d3.json, "mygeodata/simplified_shape (1).json")
    .defer(d3.json, "mygeodata/population_centres_84.json")
    .await(ready)


  function ready(error, ontario, divisions, centres) {
    var ontarioData = topojson.feature(ontario, ontario.objects.out3).features
    var divisionsData = topojson.mesh(divisions, divisions.objects.Untitled)
    var centresData = topojson.feature(centres, centres.objects.population_centres_84).features

    function draw_ontario() {
        context.clearRect(0, 0, width, height)

        console.log("draw ontario")

        projection
          .translate([width/2 - 70, height/2 + 2015]) 
          .scale(2160)

        ontarioData.forEach(function(d) {
          context.beginPath()
          path(d)
          context.fillStyle = colorScale(d.properties.MEAN)
          context.fill()
          context.closePath()
        })

        console.log("done")

        console.log("draw divisions")

        context.beginPath()
        context.strokeStyle = "black"
        context.lineWidth = 0.3
        path(divisionsData)
        context.stroke()
        context.closePath()

        console.log("done")
    }

    function draw_centres() {
        // clear the canvas
        context.clearRect(0, 0, width, height)
        // draw Ontario
        draw_ontario()

        console.log("draw centres")

        // draw the population centres
        centresData.forEach(function(d) {
          context.beginPath()
          path(d)
          context.stroke()
          context.strokeStyle = "#BF0603"
          context.lineWidth = 0.1
          context.fillStyle = "#BF0603"
          context.fill()
          context.closePath()
        })

        console.log("done")
    }

    var duration = 400
    var ease = d3.easeCubic

    trans_width_start = width/2 - 70
    trans_width_target = width/2 + 50
    trans_height_start = height/2 + 2015
    trans_height_target = height/2 + 3400
    scale_start = 2160
    scale_target = 3400

    function zoom_in() {

        console.log("zoom in")

        var timer = d3.timer(function(elapsed) {

          var t = ease(elapsed / duration)

          var width_zoom = trans_width_start * (1 - t) + trans_width_target * t
          var height_zoom = trans_height_start * (1 - t) + trans_height_target * t
          var scale_zoom = scale_start * (1 - t) + scale_target * t

          if (width_zoom > trans_width_target) {
                width_zoom = trans_width_target
            } 

          if (height_zoom > trans_height_target) {
                height_zoom = trans_height_target
            } 

          if (scale_zoom > scale_target) {
                scale_zoom = scale_target
            } 

          projection
              .translate([width_zoom, height_zoom]) 
              .scale(scale_zoom)

          if(elapsed > duration) {
              timer.stop()
          }

          console.log("draw ontario")

          context.clearRect(0, 0, width, height)

          ontarioData.forEach(function(d) {
            context.beginPath()
            path(d)
            context.fillStyle = colorScale(d.properties.MEAN)
            context.fill()
            context.closePath()
          })

          console.log("done")

          console.log("draw divisions")

          context.beginPath()
          context.strokeStyle = "black"
          context.lineWidth = 0.3
          path(divisionsData)
          context.stroke()
          context.closePath()

          console.log("done")

          console.log("draw centres")

          // draw the population centres
          centresData.forEach(function(d) {
            context.beginPath()
            path(d)
            context.stroke()
            context.strokeStyle = "#BF0603"
            context.lineWidth = 0.1
            context.fillStyle = "#BF0603"
            context.fill()
            context.closePath()
          })

          console.log("done")

          console.log("done zoom in")
      })
    }

    // function zoom_out() {

    //     console.log("zoom out")

    //     context.clearRect(0, 0, width, height)
    //     var timer = d3.timer(function(elapsed) {
    //     var t = ease(elapsed / duration)
    //     projection
    //         .translate(
    //             [trans_width_target * (1 - t) + trans_width_start * t,
    //             trans_height_target * (1 - t) + trans_height_start * t]) 
    //         .scale(scale_target * (1 - t) + scale_start * t)

    //     if(elapsed > duration) {
    //       timer.stop()
    //     }

    //     draw_centres()

    //     console.log("done zoom out")
    //   })
    // }

    d3.select("#general").on('stepin', draw_ontario)
    
    d3.select("#general").on('stepout', draw_ontario)

    d3.select("#centres").on('stepin', draw_centres)

    // d3.select("#centres").on('stepout', draw_centres)

    d3.select("#underserved").on('stepin', zoom_in)

    // d3.select("#underserved").on('stepout', zoom_out)

  }

})();









