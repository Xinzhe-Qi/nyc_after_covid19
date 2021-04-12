// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 90, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/kennylee15/nyc_after_covid19/main/busiCount.csv", function(data) {
      
  // sort data
  data.sort(function(b, a) {
    return a.count - b.count;
  });
  
  const text = svg
    .append('text')
    .attr("id", 'toptext')
    .attr("x", width - 400)
    .attr("y", 80)
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("font-family", "sans-serif")
    .text("Numbers: 0");
    
  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.industry; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 13000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.industry); })
      .attr("y", function(d) { return y(d.count); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.count); })
      .attr("fill", "#69b3a2")
      .on('mouseover', function(d, i) {
          console.log(i);
          d3.select(this).attr('style', 'fill: orange;');
          d3.select("#toptext").text(`Numbers: ${d.count}`);
        })
      .on('mouseout', function(d, i) {
          d3.select(this).attr('style', 'outline: thin solid clear;');
          d3.select("#toptext").text(`Numbers: ${0}`);
        });
});





