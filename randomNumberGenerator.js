console.log("read randomNumberGenerator...")


//import {theSeed} from "./mainScriot.js";


var sliderValue = 5;


// Parameters for the trigonometric function
const amplitude = 1.0;   // Amplitude of the wave
const frequency = 1.0;   // Frequency of the wave
const phase = 0.0;       // Phase offset
var M = 10000000000;

// All outcomes?? 
var allCoordinates = [];
//for(var i = 0; i < (2*Math.PI); i++){
var i = 0;
while (i < (2 * Math.PI)) {

    // var truncatedSine = amplitude * Math.sin(M * frequency * i + phase);
    var a = M * Math.sin(i);
    var frac_a = Math.abs(a) - Math.floor(Math.abs(a));

//    console.log("frac_a : " + frac_a)



    //frac(a) = abs a - floor (abs(a))

    var corr = { "y": frac_a, "x": i }
    allCoordinates.push(corr)

    i = i + 0.001;
}

//console.log("allCoordinates")
//console.log(allCoordinates)

export const coordinatesForScatter = allCoordinates;
//export { allCoordinates };


//import { drawScatterPlot } from './scatterPlot';

//drawScatterPlot(allCoordinates)
// 0 till 2pi

function generateTruncatedRandom(startValue) {
    console.log("call generateTruncatedRandom.")

    // Function to generate a random number based on the truncated sine wave
    // const x = Math.random();  // Generate a random number between 0 and 1

    var x = startValue / 100;
    const truncatedSine = amplitude * Math.sin(M * Math.PI * frequency * x + phase);

    // Map the result to the desired range, e.g., [0, 1]
    const minRange = 0;
    const maxRange = 1;
    const result = minRange + (maxRange - minRange) * (truncatedSine + 1) / 2;


//    console.log("startValue : " + startValue + ", result : " + result)

    return result;

    // Example usage
    // for (let i = 0; i < 10; i++) {
    //   console.log(generateTruncatedRandom());
    // }



};

//generateTruncatedRandom(sliderValue)

//generateTruncatedRandom(1)
//generateTruncatedRandom(2)
//generateTruncatedRandom(3)
//generateTruncatedRandom(4)
//generateTruncatedRandom(5)
