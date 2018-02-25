(function() {

    d3.queue()
    .defer(d3.csv, 'data/daycare_and_population_facts_clean.csv')
    .await(ready)

    function ready(error, datapoints) { 

      // create table
      var table = d3.select('#table').append('table')

      // create the titles of the table
      var titles = ["Division", "0-2 Years", "3-5 Years", "6-7 Years", "8-14 Years"]

      var headers = table.append('thead').append('tr')
                       .selectAll('th')
                       .data(titles).enter()
                       .append('th')
                       .text(function (d) {
                          return d
                        })
                       .on('click', function (d) {
                           headers.attr('class', 'header')

                           rows.sort(function(x, y){
                             return d3.ascending(x[d], y[d])
                           })

                           d3.selectAll('.' + d.replace(" ", "-")).style("background", "#BD869D")

                           console.log(datapoints)
                           console.log(d)
                       })

      
      var rows = table.append('tbody').selectAll('tr')
                      .data(datapoints).enter()
                      .append('tr')

      rows.selectAll('td')
          .data(function (d) {
              return titles.map(function (k) {
                return { 'value': d[k], 'name': k}
              })
          }).enter()
          .append('td')
          .attr('class', function (d) {
            return d.name.replace(" ", "-")
          })
          .text(function (d) {
            return d.value
          })


    }

})();