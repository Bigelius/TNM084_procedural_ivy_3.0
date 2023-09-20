console.log("read mainScript.js")


async function main(params) {
    console.log("Call main()")

    // Get random number from seed
    var randomNumber = generateTruncatedRandom(params)

    console.log("seed : " + params + ", gives randNumber : " + randomNumber)

    // Get sentance
    console.log("--------- START! ---------")
    var axiom = "AB"
    console.log("axiom : " + axiom);
    var iteration = 3;
    var raw_sentence = Lsystem("AB", iteration, 0);
    console.log("--------- RESULT! ---------");
    console.log("Sentance : " + sentence);
    console.log("Number of itrations : " + iteration);

    // Draw secene with randomnumber
    //drawScene();



}

