(function() {

    var app = new Vue({
      el: '#app',
      // the default for data
      data: {
        search: "",
        snitching: false,
        divisions: [],
        currentDivision: "Toronto",
        currentYear1: "0.46",
        currentYear2: "0.69",
        currentYear3: "0.33",
        currentYear4: "0.51"
      },
      computed: {
        filteredDivisions:function(divisions){
          var that=this;
          // if(this.search === "") {
          //   return []
          // }
            return this.divisions.filter(function(division){
              // console.log(division.Division.toLowerCase().indexOf(self.search.toLowerCase()) >= 0)
              return division.Division.toLowerCase().indexOf(that.search.toLowerCase()) !== -1 
            }).slice(0, 1)
        }
      },
      methods: {
        showDivision: function (division) {
          console.log(division)
          app.currentDivision = division["Division"] 
          app.currentYear1 = parseFloat(Math.round(division["0-2 Years"] * 100)).toFixed(0) + "%"
          app.currentYear2 = parseFloat(Math.round(division["3-5 Years"] * 100)).toFixed(0) + "%"
          app.currentYear3 = parseFloat(Math.round(division["6-7 Years"] * 100)).toFixed(0) + "%"
          app.currentYear4 = parseFloat(Math.round(division["8-14 Years"] * 100)).toFixed(0) + "%"
        }
      },
      created: function () {
        // papa.parse is a library to parse csv
          Papa.parse("data/daycare_and_population_facts_clean.csv", {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: function (parsed) {
          app.divisions = parsed.data
          }
        });
      }
    })


})()