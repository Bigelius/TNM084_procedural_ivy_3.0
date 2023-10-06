console.log("read graphics.js")

/************************************
    BLANDADE STANDARD-GREJER
*************************************/
//Importera L-sträng
//import {sentence} from "./lsystem.js";
//import {getColor} from "./rules.js";

///////////////////////////////////////////////////////////////////////////////
//SPECS FÖR CYLINDERN 

var sum = 0;
var radiusBottom = 0.1;
var radiusTop = 0.1;
var segmentLength = 1;
var prevBranchPos = new THREE.Vector3(0, 0, 0);

var sentence = "";


// Assuming you have a reference to your scene, camera, and renderer
var scene, camera, renderer;

// Function to clear the canvas and create a new one
function clearCanvasDIV() {
    // Remove all objects from the scene
    // Get the canvasContainer div
    var div = document.getElementById('canvasContainer');

    // Remove all child nodes (including any existing canvas elements)
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}


function create3DScene() {
    console.log("call create3DScene...")

    // Call this function to clear the canvas

    scene = new THREE.Scene();
    //Create a perspective camera, most similar to the eye (FOV, aspect ratio based on browser size, near and far plane)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //Set the camera position on the z-axis, might be the reason you sometimes not see an object 
    camera.position.z = 5;
    camera.position.x = 0;
    //How close the camera is to the object  
    camera.position.y = 2;
    //Set up the renderer, uses pespective renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#e5e5e5"); //the color of the background

    //Set the size of the renderer, based on window
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Create our canvas element with these render settings
    document.body.appendChild(renderer.domElement);

    //Make the size responsive
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);

        //readjust the aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;

        //Update the camera everytime a change has been made
        camera.updateProjectionMatrix();
    })

    //To see the color of the object we need a light for it
    var light = new THREE.PointLight(0xFFFFFF, 1, 500);
    light.position.set(10, 0, 25); //(x,y,z)
    //(color, intensity, distance)

    //For everything we create, we need to add (and render the whole scene)
    scene.add(light);


    //return scene;

    //Must the call the render function evert time an object is added
    //This function is so that the mesh (the object) wont scale with us when we change the size 
    //of the window. It wont stretch. Creates a loop that draw the scene everytime the
    //the screen is refreshed.
}

// Call the function to create the 3D scene
//create3DScene();

// temp för att kolla färg
function getRandomColor() {
    // Generate random values for R, G, and B between 0 and 255
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Create a CSS color string in the format "rgb(r, g, b)"
    const color = `rgb(${r}, ${g}, ${b})`;

    return color;
}



function createTreeSegment(pos, rot, char, lenght) {

    console.log("draing branch")
    console.log(char)


    var g = new THREE.CylinderGeometry(radiusTop, radiusBottom, lenght, 12);
    var edges = new THREE.EdgesGeometry(g);

    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    var m = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });
    m = getColor(char.instruction);
    var seg = new THREE.Mesh(g, m);

    seg.position.set(pos.x, pos.y, pos.z);
    seg.rotation.set(rot.x + char.rand, rot.y + char.rand, rot.z + char.rand);

    line.position.set(pos.x, pos.y, pos.z);
    line.rotation.set(rot.x + char.rand, rot.y + char.rand, rot.z + char.rand);

    var temp = [];
    temp.push(seg)
    temp.push(line)

    return temp;
    //scene.add(line);
    //scene.add(seg);
}

//Starts on the first bracket, ends on the last one. 
function getEndIndexOfBranch(start_INDEX) {
    var counter = 0;
    var i = start_INDEX;

    while (i < sentence.length) {
        if (sentence[i] == "[") {
            counter = counter + 1;
        }
        if (sentence[i] == "]") {
            counter = counter - 1;
        }
        if (counter == 0) {
            break;
        }
        ++i;
    }
    return i;
}



var t = 0

//Drawing the tree
function createTree(sentence, start_INDEX, end_INDEX, currentPosition, currentRotation, segmentLenght) {

    console.log("call createTree...")
    console.log(sentence)
    var allBranches = [];
    // Iterator som ändras. 
    var current_index = start_INDEX;
    var temp_pos = currentPosition;

    //Loop over main branches
    while (current_index < end_INDEX) {

        if (sentence[current_index] == "[") {
            //Last branch index
            var lbi = getEndIndexOfBranch(current_index); //Last bracket of branch!

            //Set initial rotation of new branch
            var b_rot = new THREE.Vector3(currentRotation.x, currentRotation.y, currentRotation.z + Math.PI / 5);

            //Make new branch with new initial specs
            createTree(current_index + 1, lbi, currentPosition, b_rot, segmentLenght);

            var branchLenght = lbi - current_index;
            //console.log("Lenght of branch : ");
            //console.log(branchLenght - 1); //Skip surrounding brackets
            current_index = lbi + 1; //Go to next index after recursive branch
        }

        if (current_index < end_INDEX) {
            if (sentence[current_index] != "]") {

                currentPosition = new THREE.Vector3(
                    currentPosition.x - (segmentLenght * Math.sin(currentRotation.z)) / 2,
                    currentPosition.y - segmentLenght * (1 - Math.cos(currentRotation.z)) / 2,
                    currentPosition.z);

                var aBranch = createTreeSegment(currentPosition, currentRotation, sentence[current_index], segmentLength);
                //console.log("aBranch")
                //console.log(aBranch)

                aBranch.forEach(branchPart => {
                    allBranches.push(branchPart)
                });

                currentPosition = new THREE.Vector3(
                    currentPosition.x - (segmentLenght * Math.sin(currentRotation.z)) / 2,
                    currentPosition.y + segmentLenght - segmentLenght * (1 - Math.cos(currentRotation.z)) / 2,
                    currentPosition.z);


            }
        }

        ++current_index;

        t = t - 1;

        //RITAR LÅDA
        var gHouse = new THREE.BoxGeometry(2, 2, 2);
        var mHouse = new THREE.MeshLambertMaterial({ color: getRandomColor(), transparent: true, opacity: 1, visible: true });
        var houseMesh = new THREE.Mesh(gHouse, mHouse);
        houseMesh.position.set(-4, 0, t);
        // scene.add(houseMesh);
        allBranches.push(houseMesh)
        // scene.add(houseMesh)
    }




    return allBranches;

}

function addToScene() { // lite smått och gott som kanske inte ska vara kvar....


    //RITAR LÅDA
    var gHouse = new THREE.BoxGeometry(2, 2, 2);
    var mHouse = new THREE.MeshLambertMaterial({ color: 0xff0066, transparent: true, opacity: 1, visible: true });
    var houseMesh = new THREE.Mesh(gHouse, mHouse);
    houseMesh.position.set(5, 0, 0);
    // scene.add(houseMesh);

    return houseMesh;


}

function create3DSceneTWEEK(sentence) {
    console.log("call create3DSceneTWEEK...")
    console.log(sentence)


    clearCanvasDIV();

    // Get a reference to the canvasContainer div
    var canvasContainer = document.getElementById('canvasContainer');

    // Create a scene
    var scene = new THREE.Scene();

    // Create a perspective camera
    var camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.x = 0;
    camera.position.y = 2;

    // Create a renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    //renderer.setClearColor("#e5e5e5");

    renderer.setClearColor(getRandomColor());
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

    // Append the renderer's DOM element (the canvas) to the canvasContainer div
    canvasContainer.appendChild(renderer.domElement);

    // Make the size responsive
    window.addEventListener('resize', () => {
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
    });

    // Create a point light
    var light = new THREE.PointLight(0xFFFFFF, 1, 500);
    light.position.set(10, 0, 25);

    // Add the light to the scene
    scene.add(light);

    var thing = addToScene();
    var tree = createTree(sentence, 0, sentence.length, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), segmentLength);

    tree.forEach(branch => {
        scene.add(branch)
    });

    scene.add(thing)

    // Render the scene
    renderer.render(scene, camera);
}



function drawScene(s) {
    console.log("call drawScene...")
    console.log("draw s : ")
    console.log(s)

    //sentence = s; // global sak
    //rita scenen
    create3DSceneTWEEK(s)

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //console.log(scene)

    // addToScene()
}

/* ///////////////////////////////////////////////////////////////////////////////
console.log(sentence);



/************************************************
*       Börjar skapa saker
************************************************/





// Här måste man slänga in startposition m.a.p. objektet man lägger in, 
// eller i mitten av bounding boxen (50, 0, 50);

//(start index, last index, initial position, initial rotation, segment lenght)

//renderer.render(scene, camera); //renders the scene and the camera




////////////////////////////////////////////////////////
// GAMMLA FUNKTIONER, KANSKE TA BORT????

/***    Några gamla vektoroperatorer (abs, '-') ***/

function subVec3(a, b) {
    return new THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function absVec3(a) {
    var sum = (a.x * a.x) + (a.y * a.y) + (a.z * a.z);
    var res = Math.sqrt(sum);
    return res;
}



// Gammal scene

/***
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */