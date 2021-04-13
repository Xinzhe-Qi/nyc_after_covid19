var width = 700;
var height = 580;

// Create SVG
var svg_choropleth = d3.select( "#choropleth" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

var g = svg_choropleth.append( "g" );

const requestDat = async() => {
    const NYCDat = await d3.json("https://raw.githubusercontent.com/kennylee15/nyc_after_covid19/main/resources/NYC_topostring.json");
    var dataObjects = topojson.feature(NYCDat, NYCDat.objects.foo);

    var projection = d3.geoAlbers().fitSize([550,550],dataObjects);
    var pathGen = d3.geoPath().projection(projection);

    const min = d3.min(dataObjects.features, d => d.properties.diff);
    const max = d3.max(dataObjects.features, d => d.properties.diff);


    const newColorScale = d3.scaleSequential([min,max],d3.interpolateViridis);

    g.selectAll("path").data(dataObjects.features)
       .enter()
       .append("path")
       .style("fill", d => newColorScale(d.properties.diff))
       .style("stroke","none")
       .on("mouseover",function(d){
            d3.select(this).style("stroke","black");
            d3.select("#recovery")
                .append("text")
                .attr("id", "gc"+d.properties.PUMA)
                .text(Math.round(d.properties.diff*10)/10);
            d3.select("#area")
                .append("text")
                .attr("id", "area"+d.properties.PUMA)
                .text(d.properties.NAME);
            d3.select("#pvty")
                .append("text")
                .attr("id", "pvty"+d.properties.PUMA)
                .text(d.properties.Poverty);
            d3.select("#educ")
                .append("text")
                .attr("id", "educ"+d.properties.PUMA)
                .text(d.properties.Education);
            d3.select("#hisp")
                .append("text")
                .attr("id", "hisp"+d.properties.PUMA)
                .text(d.properties.Broadband);
       })
       .on("mouseout", function(d){
            d3.select(this).style("stroke","none");
            d3.select("#gc"+d.properties.PUMA).remove();
            d3.select("#area"+d.properties.PUMA).remove();
            d3.select("#pvty"+d.properties.PUMA).remove();
            d3.select("#educ"+d.properties.PUMA).remove();
            d3.select("#hisp"+d.properties.PUMA).remove();

       })
       .attr("d",pathGen);
};

requestDat();


const container = svg_choropleth
    .append( "g" )
    .attr("id", "chart");
const colourScale = d3
  .scaleSequential(d3.interpolateViridis)
  .domain([-10, 60]);
const domain = colourScale.domain();

const scale_width = 100;
const scale_height = 150;

const paddedDomain = fc.extentLinear()
  .pad([0.1, 0.1])
  .padUnit("percent")(domain);
const [min, max] = paddedDomain;
const expandedDomain = d3.range(min, max, (max - min) / scale_height);

const xScale = d3
  .scaleBand()
  .domain([0, 1])
  .range([0, scale_width]);

const yScale = d3
  .scaleLinear()
  .domain(paddedDomain)
  .range([scale_height, 0]);

const svgBar = fc
  .autoBandwidth(fc.seriesSvgBar())
  .xScale(xScale)
  .yScale(yScale)
  .crossValue(0)
  .baseValue((_, i) => (i > 0 ? expandedDomain[i - 1] : 0))
  .mainValue(d => d)
  .decorate(selection => {
    selection.selectAll("path").style("fill", d => colourScale(d));
  });

const axisLabel = fc
  .axisRight(yScale)
  .tickValues([...domain, (domain[1] + domain[0]) / 2])
  .tickSizeOuter(0);

const legendSvg = container.append("svg")
  .attr("height", scale_height)
  .attr("width", scale_width);

const legendBar = legendSvg
  .append("g")
  .datum(expandedDomain)
  .call(svgBar);

const barWidth = Math.abs(legendBar.node().getBoundingClientRect().x);
legendSvg.append("g")
  .attr("transform", `translate(23)`)
  .datum(expandedDomain)
  .call(axisLabel)
  .select(".domain")
  .attr("visibility", "hidden");
    
container.style("margin", "1em");
