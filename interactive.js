// set the dimensions and margins of the graph
var margin = {top: 50, right: 0, bottom: 50, left: 160},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

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
    .attr("x", width - 200)
    .attr("y", 200)
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("font-family", "sans-serif")
    .text("Numbers: 0");
    
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 12000])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .style("text-anchor", "middle");
    
  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.industry; }))
    .padding(0.2);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(20)")
      .style("text-anchor", "end");


  // Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", x(0))
      .attr("y", function(d) { return y(d.industry); })
      .attr("width", function(d) { return x(d.count); })
      .attr("height", y.bandwidth())
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







