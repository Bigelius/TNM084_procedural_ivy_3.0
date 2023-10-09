console.log("read graphics_me.js")

/************************************
    BLANDADE STANDARD-GREJER
*************************************/
//Importera L-sträng
//import {sentence} from "./lsystem.js";
//import {getColor} from "./rules.js";

///////////////////////////////////////////////////////////////////////////////
//SPECS FÖR CYLINDERN 



//Globala variabler
//var theMatrix = makeVoxelMatrix(max_val); //Skapar voxel-matris med bools // fuckar view????
//var scene = new THREE.Scene();


var sum = 0;
var radiusBottom = 0.1;
var radiusTop = 0.1;
var segmentLength = 1;
var prevBranchPos = new THREE.Vector3(0, 0, 0);

//SPECS FÖR SEGMENT 
{
    var sum = 0;
    var radiusBottom = 0.1;
    var radiusTop = 0.1;
    var segmentLength = 1;
    var coordIterator = new THREE.Vector3(0, 0, 0); //Global startposition. Updates with every segment to backtrack branches
}

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


    // AMANDAS VINKLAR
    //var camera = new THREE.OrthographicCamera(-5, 5, 5, -5, - 20, 1000);
    //camera.position.z = 10;
    //camera.position.x = 5;
    //camera.position.y = 8;
    //camera.rotation.x = - Math.PI / 6;

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



function createTreeSegment_A(pos, rot, char, lenght) {
    //console.log("Call createTreeSegment_A()")

    var g = new THREE.CylinderGeometry(radiusTop, radiusBottom, lenght, 12);
    var edges = new THREE.EdgesGeometry(g);

    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    var m = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });
    m = getColor(char.instruction);
    var seg = new THREE.Mesh(g, m);

    //seg.position.set(pos.x, pos.y, pos.z);
    //seg.rotation.set(rot.x, rot.y, rot.z);
    //line.position.set(pos.x, pos.y, pos.z);
    //line.rotation.set(rot.x, rot.y, rot.z);

    
    seg.position.set(pos.x, pos.y, pos.z);
    seg.rotation.set(rot.x + char.rand, rot.y + char.rand, rot.z + char.rand);
    line.position.set(pos.x, pos.y, pos.z);
    line.rotation.set(rot.x + char.rand, rot.y + char.rand, rot.z + char.rand);


    //Translate in new segment direction
    seg.translateY(lenght / 2);
    line.translateY(lenght / 2);

    //scene.add(line);
    //scene.add(seg);



    //Returnerar nästa startposition (toppen på det här segmentet)
    var temp = new THREE.LineSegments().copy(line);
    temp.translateY(lenght / 2);
    temp.getWorldPosition(coordIterator); //Sparar ny coordinat i rootCoord

    return { "branchMesh": seg, "branchLine": line };
}


function createTreeSegment_J(pos, rot, char, lenght) {

    console.log("drawing branch" + char)

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

function createTree(sentence, start_INDEX, end_INDEX, startPosition, c_rot, segLen) {
    // Iterator som ändras. 
    console.log("Call createTree()")

    var current_index = start_INDEX;
    var oldPosition = startPosition; //Sparar pos-koordinaten som en temp
    var allBranches = [];

    //Loop over local main branch segments
    //While we're not at the end of the local straight branch...
    while (current_index <= end_INDEX) {
        //Räknar...
        if (sentence[current_index] == "[") {

            var lastBranchIndex = getEndIndexOfBranch(current_index); //Last bracket of new branch!
            var prevPosition = new THREE.Vector3(coordIterator.x, coordIterator.y, coordIterator.z);
            var seg_rot = new THREE.Vector3(c_rot.x, c_rot.y + Math.PI / 5, c_rot.z + Math.PI / 5); //New initial rotation for branch

            createTree(current_index + 1, lastBranchIndex, coordIterator, seg_rot, segLen); //Make new branch with the new initial specs
            current_index = lastBranchIndex; //Go to next index after recursive branch
        }
        //Draw segment if not '[' or ']'. CoordIterator is the top of last segment
        else if (sentence[current_index] != "]" && sentence[current_index] != null) {
            //console.log("Vid index " + current_index + " gör segment av char : ")
            //console.log(sentence[current_index])


            var WhatIGet = createTreeSegment_A(coordIterator, c_rot, sentence[current_index], segmentLength);

            //console.log("WhatIGet")
            //console.log(WhatIGet)
            // returna något här???
            allBranches.push(WhatIGet.branchMesh)
            allBranches.push(WhatIGet.branchLine)

        }
        //console.log("branches so far " + allBranches.length)
        ++current_index;
    }
    coordIterator = oldPosition; //Move iterator to the previous branch (where we left it to make new branch)

    return allBranches;
}

//Drawing the tree
/*
function createTree_OLD(sentence, start_INDEX, end_INDEX, currentPosition, currentRotation, segmentLenght) {

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
*/

function addToScene() { // lite smått och gott som kanske inte ska vara kvar....
    //RITAR LÅDA
    var gHouse = new THREE.BoxGeometry(2, 2, 2);
    var mHouse = new THREE.MeshLambertMaterial({ color: 0xff0066, transparent: true, opacity: 1, visible: true });
    var houseMesh = new THREE.Mesh(gHouse, mHouse);
    houseMesh.position.set(5, 0, 0);
    // scene.add(houseMesh);
    return houseMesh;
}


function pointDist(a, b){
    var diff = subVec3(a,b);
    return absVec3(diff);
}

/*Ritar voxlar*/
var sphereCenter = new THREE.Vector3(4,4,4);
var max_val = 30;   //Hur många voxlar i xyz
var cLen = 1/4;
var VARIABLE = 0;
function drawVoxel(pos){

    var g = new THREE.CubeGeometry(cLen, cLen, cLen );
    var edges = new THREE.EdgesGeometry( g );

    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    var m = new THREE.MeshLambertMaterial({color: 0xfc0324});
    m.transparent = true;
    
    var newPos = new THREE.Vector3(pos.x * cLen, pos.y*cLen, pos.z*cLen);
    if(pointDist(newPos, sphereCenter)<VARIABLE){ /// JOHANNNA!!!!! KOM IHÅG!!! GÖR DETTA TILL EN SLIDER VÄRDE ASSÅ 2.5
        m.opacity = 0.9; 
    }
    else m.opacity = 0;
    
    var seg = new THREE.Mesh(g, m);

    
    seg.position.set(newPos.x, newPos.y, newPos.z);
    line.position.set(newPos.x, newPos.y, newPos.z);
    
    
    //scene.add(line);
    //scene.add(seg);
    return seg;
}

//Ritar alla voxlar
function drawVoxelGrid(){
    var i = 0; // pillat
    var allVoxel = [];
    while(i < max_val){
        var j = 0;                      //Inne i loop så den återställs varje iteration
        while(j < max_val){
            var k = 0;                  //Inne i loop så den återställs varje iteration
            while(k < max_val){
                var coord = new THREE.Vector3(i,j,k);
                allVoxel.push(drawVoxel(coord));
                ++k;
            }
            ++j;
        }
        ++i;
    }
    return allVoxel;
}
//var position = new THREE.Vector3(0,0,0);


function create3DSceneTWEEK(sentence) {
    console.log("call create3DSceneTWEEK...")
   // console.log(sentence)


    clearCanvasDIV();

    // Get a reference to the canvasContainer div
    var canvasContainer = document.getElementById('canvasContainer');

    // Create a scene
    var scene = new THREE.Scene();

    // Create a perspective camera
    var camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    //camera.position.z = 5;
    //camera.position.x = 0;
    //camera.position.y = 2;

    camera.position.z = 10; 
    camera.position.x = 0;
    camera.position.y = 8;
    camera.rotation.x = - Math.PI/6;

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

    var voxels = drawVoxelGrid();

    //console.log("voxels")
    //console.log(voxels)

    voxels.forEach(box => {
        console.log("adding voxels...")
        scene.add(box)
    });

    scene.add(thing)
    

    // Render the scene
    renderer.render(scene, camera);
}




function drawScene(s, sphereThing) {
    console.log("call drawScene...")
    console.log("draw s : ")
    console.log(s)

    console.log("sphereThing")
    console.log(sphereThing)
    VARIABLE = sphereThing;
    //sentence = s; // global sak
    //rita scenen
    create3DSceneTWEEK(s)



    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
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

