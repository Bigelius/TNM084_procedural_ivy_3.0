/********************************************************************************
L-SYSTEMET
*********************************************************************************/
//Supportar [A - G]
//RING-string
var axiom = "A[B[C[D[E[A[B[C[D[E]]CC]]]]]]]A";
//var axiom = "A[A[A[A]]BC]BC[ABC]DEFG";
//export const sentence = axiom.split('');

//INTE KLAR ÄN
// Alphabet (V) : A, B, [, ], +, - 
// Axiom (omga) aka initial state : AB
// Rules (P) : defines how you replace the symbels   

function getRuleOf(symbol) {
  /*
    The rules : 
        A -> BA
        B -> AA
  */     
  var res;

  switch(symbol) {
    case "A":
      res = "BA";
      break;

    case "B":
      res = "AA";
      break;
          
    //case "[" : break;
    //case "]" : break;
  }

  return res;

}

function Lsystem(axiom, n, i) {

  //console.log("call Lsystem()...")

    var S = "";
    var axiom_array = axiom.split('');

    for(var j = 0; j < axiom.length; j++){
        
        if(i<n){ 
            var nextAxiom = getRuleOf(axiom_array[j]);
            S = S + Lsystem(nextAxiom, n, i+1); 
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