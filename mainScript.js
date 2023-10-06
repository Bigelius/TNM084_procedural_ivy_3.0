console.log("read mainScript.js")

console.log("goods from lsystem");
console.log(window.moduleVar);

async function main(M, parameter_1, parameter_2) {
    console.log("Call main()")

    console.log("--------- START! ---------")
    
    // Get sentance from global scope
    //console.log("sentance from lsystem");
    //var sentance = window.sen
    //console.log(sentance);

    // Get sentance
    
    var axiom = "AB"
    console.log("axiom : " + axiom);
    var iteration = 2;
    var raw_sentence = Lsystem("AB", iteration, 0);
    console.log("raw_ : " + raw_sentence)
    var sentance = raw_sentence.split('');



    var rand_sentence = [];
    // Get random number from seed
    for (var i = 0; i < sentance.length; i++) {
        var randomNumber = generateTruncatedRandom(M, i)
        var item = { "instruction": sentance[i], "rand": randomNumber };
        rand_sentence.push(item)
    }

 

    console.log("rand_sentence")
    console.log(rand_sentence)

   

    // Draw secene with randomnumber
    drawScene(rand_sentence);


    console.log("--------- RESULT! ---------");


}

