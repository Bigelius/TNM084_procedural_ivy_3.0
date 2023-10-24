/********************************************************************************
L-SYSTEMET
*********************************************************************************/
//INTE KLAR ÄN
// Alphabet (V) : A, B, [, ], +, - 
// Axiom (omga) aka initial state : AB
// Rules (P) : defines how you replace the symbels   

function getRuleOf(symbol) {
  var res = "";

  switch (symbol) {
    case "A":
      res = "A[BB]";
      break;

    case "B":
      res = "C[A]";
      break;
    
      case "C":
      res = "B[A]";
      break;

    case "[": 
      res = "[";
    break;
    case "]": 
      res = "]";
    break;
  }

  return res;

}

function Lsystem(axiom, n, i) {
  var S = "";
  var axiom_array = axiom.split('');

  for (var j = 0; j < axiom.length; j++) {

    if (i < n) {
      var nextAxiom = getRuleOf(axiom_array[j]);
      S = S + Lsystem(nextAxiom, n, i + 1);
    }
    else {
      S = axiom;
    }
  }
  return S;
}

/*
console.log("--------- START! ---------")
var axiom = "AB"
console.log("axiom : " + axiom);
var iteration = 3;
var raw_sentence = Lsystem("AB", iteration, 0);
console.log("--------- RESULT! ---------");            
console.log("Sentance : " + sentence);
console.log("Number of itrations : " + iteration);
*/