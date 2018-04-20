(function() {

    d3.queue()
    .defer(d3.csv, 'data/daycare_and_population_facts_clean.csv')
    .await(ready)

    function ready(error, datapoints) {

      // create table
      var table = d3.select('#table').append('table')

      // create the titles of the table
      var titles = ["Division", "0-2 Years", "3-5 Years", "6-7 Years", "8-14 Years"]

      var sortAscending = true

      var colorScale = d3.scaleLinear()
                        .domain([0, 0.2, 0.4, 0.60, 0.800, 1.0])
                        .range(['#81107C','#8A55A6','#8B95C6','#B3CEE3','#EDF8FA','white'])

      // to have the first map of coverage onset
      var svg = d3.select('#coverage-map')
                  .append("svg")
                  .attr("width", 350)
                  .attr("height", 450)

      svg.append('svg:image')
         .attr('xlink:href','img/0-2-Years.png')
         .attr("width", 350)
         .attr("height", 450)
      
      var headers = table.append('thead')
                         .selectAll('th')
                         .data(titles).enter()
                         .append('th')
                         .attr("class", function (d) {
                            return "header-" + d.replace(" ", "-")
                          })
                         .append('tr')
                         .text(function (d) {
                            return d
                          })
                         .on('click', function (d) {
                            console.log(d)
                             // set up sortale table
                             // when true, descend it and change sortAscending to "false"
                             if (d != "Division") {
                               if (sortAscending) {
                                  rows.sort(function(x, y){
                                    return d3.descending(x[d], y[d])
                                  })
                                  sortAscending = false
                               } 
                               else {
                                 rows.sort(function(x, y){
                                    return d3.ascending(x[d], y[d])
                                  })
                                 sortAscending = true
                               }

                             d3.selectAll('td')
                               .style("background", "white")
                               .style("color", "black")
                               .style("border-bottom", "1px solid #ccc")
                               .style("text-shadow", "none")

                             d3.selectAll('th')
                               .style("border-top", "3px solid white")

                             d3.selectAll('.header-' + d.replace(" ", "-"))
                               .style("border-top", "3px solid #8759A4")

                             d3.selectAll('.data-' + d.replace(" ", "-"))
                               // .style("background", "#8759A4")
                               .style("background", function(d){
                                return colorScale(d.value)
                               })
                               .style("color", "white")
                               .style("text-shadow", "0px 2px 10px black")
                               .style("border-bottom", "1px solid white")

                             svg.selectAll('image').remove()

                             svg.append('svg:image')
                                .attr("xlink:href", 'img/' + d.replace(" ", "-") + '.png')
                                .attr("width", 350)
                                .attr("height", 450)

                            }

                            // console.log('img/' + d.replace(" ", "-") + '.png')

                         })

      
      var rows = table.append('tbody').selectAll('tr')
                      .data(datapoints).enter()
                      .append('tr')

      format = d3.format(".0%")

      rows.selectAll('td')
          .data(function (d) {
            console.log()
              return titles.map(function (k) {
                return { 'value': d[k], 'name': k}
              })
          }).enter()
          .append('td')
          .attr('class', function (d) {
            return "data-" + d.name.replace(" ", "-")
          })
          .text(function (d) {
             // assign different formats for texts and numbers
             if (d.name === "Division") {
                return d.value
             } 
             else {
                return format(+d.value)
             }
        })

        
      }

})();