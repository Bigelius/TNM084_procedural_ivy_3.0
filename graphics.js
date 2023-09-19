/************************************
    BLANDADE STANDARD-GREJER
*************************************/
//Importera L-sträng
import {sentence} from "./lsystem.js";
import {getColor} from "./rules.js";
console.log(sentence);


var scene = new THREE.Scene();
//Create a perspective camera, most similar to the eye (FOV, aspect ratio based on browser size, near and far plane)
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

//Set the camera position on the z-axis, might be the reason you sometimes not see an object 
camera.position.z = 5; 
camera.position.x = 0;
//How close the camera is to the object  
camera.position.y = 2;

//Set up the renderer, uses pespective renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#e5e5e5"); //the color of the background

//Set the size of the renderer, based on window
renderer.setSize(window.innerWidth, window.innerHeight);

//Create our canvas element with these render settings
document.body.appendChild(renderer.domElement);

//Make the size responsive
window.addEventListener('resize', () =>{
renderer.setSize(window.innerWidth, window.innerHeight);

//readjust the aspect ratio
camera.aspect = window.innerWidth/window.innerHeight;

//Update the camera everytime a change has been made
camera.updateProjectionMatrix();
})
//To see the color of the object we need a light for it
var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10,0,25); //(x,y,z)
//(color, intensity, distance)

//For everything we create, we need to add (and render the whole scene)
scene.add(light);

//Must the call the render function evert time an object is added
//This function is so that the mesh (the object) wont scale with us when we change the size 
//of the window. It wont stretch. Creates a loop that draw the scene everytime the
//the screen is refreshed.


/***    Några gamla vektoroperatorer (abs, '-') ***/   
function subVec3(a, b) {
 return new THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function absVec3(a) {
  var sum = (a.x*a.x) + (a.y*a.y) + (a.z*a.z);
  var res = Math.sqrt(sum);
  return res;
}
/************************************************
*       Börjar skapa saker
************************************************/

//RITAR LÅDA
{
var gHouse = new THREE.BoxGeometry(2,2,2);
var mHouse = new THREE.MeshLambertMaterial({color: 0xff0066, transparent: true, opacity: 1, visible: true});
var houseMesh = new THREE.Mesh(gHouse, mHouse);
houseMesh.position.set(-5, 0, 0);
scene.add(houseMesh);
}

//SPECS FÖR CYLINDERN 
{
var sum = 0;
var radiusBottom = 0.1;
var radiusTop = 0.1;
var segmentLength = 1;
var prevBranchPos = new THREE.Vector3( 0, 0, 0 );
}


function createTreeSegment(pos, rot, char, lenght){

   var g = new THREE.CylinderGeometry( radiusTop, radiusBottom, lenght, 12 );
   var edges = new THREE.EdgesGeometry( g );

   var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
   var m = new THREE.MeshLambertMaterial({color: 0xFFCC00});  
   m = getColor(char);
   var seg = new THREE.Mesh(g, m);

   seg.position.set(pos.x, pos.y, pos.z);
   seg.rotation.set(rot.x, rot.y, rot.z);

   line.position.set(pos.x, pos.y, pos.z);
   line.rotation.set(rot.x, rot.y, rot.z);

   scene.add(line);
   scene.add(seg);
}
     
//Starts on the first bracket, ends on the last one. 
function getEndIndexOfBranch(start_INDEX){
    var counter = 0;
    var i = start_INDEX;

    while(i < sentence.length){
        if(sentence[i] == "["){
            counter = counter + 1;
        }
        if(sentence[i] == "]"){
            counter = counter - 1;
        } 
        if(counter == 0){
            break;
        }
        ++i;
    }
    return i;
}

//Drawing the tree
function createTree(start_INDEX, end_INDEX, currentPosition, currentRotation, segmentLenght){
    // Iterator som ändras. 
    var current_index = start_INDEX;
    var temp_pos = currentPosition;

    //Loop over main branches
    while(current_index < end_INDEX){

        if(sentence[current_index] == "[") {
            //Last branch index
            var lbi = getEndIndexOfBranch(current_index); //Last bracket of branch!
            
            //Set initial rotation of new branch
            var b_rot = new THREE.Vector3(currentRotation.x, currentRotation.y, currentRotation.z + Math.PI /5);
        
            //Make new branch with new initial specs
            createTree(current_index + 1, lbi, currentPosition, b_rot, segmentLenght);

            var branchLenght = lbi - current_index;
            //console.log("Lenght of branch : ");
            //console.log(branchLenght - 1); //Skip surrounding brackets
            current_index = lbi + 1; //Go to next index after recursive branch
        }

        if(current_index < end_INDEX){
            if(sentence[current_index] != "]"){
                
                
                currentPosition = new THREE.Vector3(    
                    currentPosition.x - (segmentLenght * Math.sin(currentRotation.z))/2, 
                    currentPosition.y - segmentLenght*(1 - Math.cos(currentRotation.z))/2, 
                    currentPosition.z);
                
                createTreeSegment(currentPosition, currentRotation, sentence[current_index], segmentLength);
                
                currentPosition = new THREE.Vector3(    
                    currentPosition.x - (segmentLenght * Math.sin(currentRotation.z))/2, 
                    currentPosition.y + segmentLenght - segmentLenght*(1 - Math.cos(currentRotation.z))/2, 
                    currentPosition.z);
                
                
            }
        }
        ++current_index;
    }
}
// Här måste man slänga in startposition m.a.p. objektet man lägger in, 
// eller i mitten av bounding boxen (50, 0, 50);

//(start index, last index, initial position, initial rotation, segment lenght)
createTree(0, sentence.length, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), segmentLength);

renderer.render(scene, camera); //renders the scene and the camera