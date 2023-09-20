console.log("read mainScrit.js")

//import { theSeed } from './main.html';
//import { generateTruncatedRandom } from './randomNumberGenerator.js';

//console.log(theSeed)

async function main(params) {
    console.log("Call main()")
    console.log("main got input : " + params)


    var randomNumber = generateTruncatedRandom(params)

    console.log("INNE I MAIN!!!!!!")
    console.log(randomNumber)
    
}

//main(theSeed)