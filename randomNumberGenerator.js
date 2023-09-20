console.log("read randomNumberGenerator...")


// Parameters for the trigonometric function // kanske onödigt...
const amplitude = 1.0;   // Amplitude of the wave
const frequency = 1.0;   // Frequency of the wave
const phase = 0.0;       // Phase offset
var M = 10000000000;

// All outcomes
var allCoordinates = [];
var i = 0;
while (i < (2 * Math.PI)) {
    var a = M * Math.sin(i);
    var frac_a = Math.abs(a) - Math.floor(Math.abs(a));
    var corr = { "y": frac_a, "x": i }
    allCoordinates.push(corr)

    i = i + 0.001;
}

// draw all outcomes
drawScatterPlot(allCoordinates, { "y": 0, "x": 0 })


function generateTruncatedRandom(startValue) {
    console.log("call generateTruncatedRandom.")

    var x = startValue / 100;
    var a = M * Math.sin(x);
    var frac_a = Math.abs(a) - Math.floor(Math.abs(a));

    // Draw scatter 
    //allCoordinates.push({ "y": frac_a, "x": x })
    //drawScatterPlot(allCoordinates, { "y": frac_a, "x": x })

    return frac_a;
};

