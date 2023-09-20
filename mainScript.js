console.log("read mainScript.js")


async function main(params) {
    console.log("Call main()")

    // Get random number from seed
    var randomNumber = generateTruncatedRandom(params)

    console.log("seed : " + params + ", gives randNumber : " + randomNumber)


    // Draw secene with randomnumber
    drawScene();


    
}

