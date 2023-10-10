/********************************************************************************
L-SYSTEMET
*********************************************************************************/
//Supportar [A - G]
//RING-TRÄD
//var axiom = "A[A[B[B[C[C[D[D[E[E]]]]]]]]]BB"; //Vanlig ]";//
//var axiom = "A[B[C[D[E[F[G[A[B[A]B[A[B]A]]]]]]]C[D]C]]A[B]A"; //Vanlig ]";//
var axiom = "A[B]C"; //Vanilla
// för att få det till mainScript
window.sen = axiom.split('');

//var axiom = "A+[A+[B+[B+[C+[C+[D+[D+[E+[E]]]]]]]]]"; // + (Jättetrasig)
//var axiom = "A-[B-[C-[D-[E-[A-[B-[C-[D-[E]]]]]]]]]"; // - (Jättetrasig)
//BLAND-TRÄD
//var axiom = "A[A[A[A]]BC]BC[ABC]DEFG"; //Vanlig
//export const sentence = axiom.split('');

//window.moduleVar = "Hello from module.js";



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
  var res = "";

  //console.log("symbol : " + symbol)

  switch (symbol) {
    case "A":
      res = "B[A]A";
      break;

    case "B":
      res = "A";
      break;

    case "C":
      res = "C[BCA]";
      break;

    case "D":
      res = "CBBA";
      break;

    case "[": break;
    case "]": break;
  }

  //console.log(res)

  return res;

}


function Lsystem(axiom, n, i) {

  //console.log("call Lsystem()...")

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