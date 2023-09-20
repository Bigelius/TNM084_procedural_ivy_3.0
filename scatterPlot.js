console.log("read scatterPlot.js")
//export function drawScatterPlot = drawScatterPlot(myData);


//import {coordinatesForScatter} from "./randomNumberGenerator.js";

//console.log("coordinatesForScatter")
//console.log(coordinatesForScatter)

function drawScatterPlot(myData) {

    console.log("call scatterPlot")

    var data = myData

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    
    //console.log("data")
   // console.log(data)

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 2*Math.PI])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

    
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.x); })
            .attr("cy", function (d) { 
                //console.log("d.y")
                //console.log(d.y)

                return y(d.y); 
            })
            .attr("r", 3)
            .style("fill", "#69b3a2")
}

//drawScatterPlot(coordinatesForScatter)

