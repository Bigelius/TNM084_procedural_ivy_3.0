var sentence = [];
//SPECS FÖR CYLINDERN 
{
    var sum = 0;
    var radiusBottom = 0.1;
    var radiusTop = 0.1;
    var segmentLength = 1;
    var rootCoord = new THREE.Vector3(0, 0, 0);
}

var tempVec = new THREE.Vector3(0, 0, 0)
var starts = [];
var NEXT_COORD;


// Global variables
var scene, camera, renderer;
var objects = [];


function subVec3(a, b) {
    return new THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}
function addVec3(a, b) {
    return new THREE.Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}

function absVec3(a) {
    var sum = (a.x * a.x) + (a.y * a.y) + (a.z * a.z);
    var res = Math.sqrt(sum);
    return res;
}


// Initialize Three.js scene
function init() {
    // Check if the scene is already initialized
    if (scene) {
        // Clear existing objects
        deleteObjects();
    }

    var sceneContainer = document.getElementById('sceneContainer');



    // Create or reuse the existing renderer
    if (!renderer) {
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor("#e5e5e5"); //the color of the background
        renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);

        document.getElementById("sceneContainer").appendChild(renderer.domElement);
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
    //camera = new THREE.OrthographicCamera(-5, 5, 5, -5, - 20, 1000);
    camera.position.z = 1;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.rotation.x = - Math.PI / 6;
    camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
    // camera.updateProjectionMatrix();


    //To see the color of the object we need a light for it
    var light = new THREE.PointLight(0xFFFFFF, 1, 500);

    light.position.set(10, 0, 5); //(x,y,z)
    //(color, intensity, distance)

    //For everything we create, we need to add (and render the whole scene)
    scene.add(light);

    camera.position.z = 5;
}

// Function to delete all objects in the scene
function deleteObjects() {
    for (var i = 0; i < objects.length; i++) {
        scene.remove(objects[i]);
    }
    objects = [];
    renderer.render(scene, camera);
    document.getElementById("deleteButton").disabled = true;

    //////
    sum = 0;
    radiusBottom = 0.1;
    radiusTop = 0.1;
    segmentLength = 1;
    rootCoord = new THREE.Vector3(0, 0, 0);

    tempVec = new THREE.Vector3(0, 0, 0)
    starts = [];
    NEXT_COORD;

    sentence = [];
}


function createTreeSegment(pos, rot, char, lenght) {

    var g = new THREE.CylinderGeometry(radiusTop, radiusBottom, lenght, 12);
    var edges = new THREE.EdgesGeometry(g);

    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    var m = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });
    m = getColor(char.instruction);
    var seg = new THREE.Mesh(g, m);

    seg.position.set(pos.x, pos.y, pos.z);
    seg.rotation.set(rot.x + char.rand, rot.y + 0, rot.z +0);

    line.position.set(pos.x, pos.y, pos.z);
    line.rotation.set(rot.x + char.rand, rot.y + 0, rot.z + 0);

    //Translate in new segment direction
    seg.translateY(lenght / 2);
    line.translateY(lenght / 2);

    scene.add(line);
    scene.add(seg);

    //Returnerar nästa startposition (toppen på det här segmentet)

    var temp = new THREE.LineSegments().copy(line);
    temp.translateY(lenght / 2);
    temp.getWorldPosition(rootCoord); //Sparar ny coordinat i rootCoord

    objects.push(seg)
    objects.push(line)
}


//Starts on the first bracket, ends on the last one. Returns GLOBAL index
function getEndIndexOfBranch(start_INDEX) {
    var counter = 0;
    var i = start_INDEX;

    while (i < sentence.length) {
        if (sentence[i].instruction == "[") {
            counter = counter + 1;
        }
        if (sentence[i].instruction == "]") {
            counter = counter - 1;
        }
        if (counter == 0) {
            break;
        }
        ++i;
    }
    return i; //Returnerar indexet på sista ']'
}

function createTree(start_INDEX, end_INDEX, startPosition, c_rot, segLen) {
    // Iterator som ändras. 

    var current_index = start_INDEX;
    var oldPosition = startPosition; //Sparar pos-koordinaten som en temp
    var dustyOldVec = tempVec;


    //Loop over local main branch segments
    //While we're not at the end of the local straight branch...
    while (current_index <= end_INDEX) {
        //Räknar...
       
        if (sentence[current_index].instruction == "[") {

            var lbi = getEndIndexOfBranch(current_index); //Last bracket of new branch!

            var wtf = new THREE.Vector3(rootCoord.x, rootCoord.y, rootCoord.z);

            starts.push(wtf) //Latest saved initial position as a temp


            var b_rot = new THREE.Vector3(c_rot.x, c_rot.y + Math.PI / 5, c_rot.z + Math.PI / 5); //New initial rotation for branch    

            createTree(current_index + 1, lbi, rootCoord, b_rot, segLen); //Make new branch with the new initial specs

            //Updates the index 
            current_index = lbi; //Go to next index after recursive branch

        }
 

        else if (sentence[current_index].instruction != "]" && sentence[current_index].instruction != "-" && sentence[current_index].instruction != "+") {
            //At start, segments render in a single center point
            createTreeSegment(rootCoord, c_rot, sentence[current_index], segmentLength);
        }

        else {

            var stamCoord = starts[starts.length - 1]
            rootCoord.x = stamCoord.x;
            rootCoord.y = stamCoord.y;
            rootCoord.z = stamCoord.z;
            starts.pop()
        }
        
 
        ++current_index;
    }
    tempVec = dustyOldVec;
    rootCoord = oldPosition;
   

}

// Function to generate the scene and enable the "Delete All Objects" button
function generateScene(M, sphereRadie) {
    console.log("generateScene()");

    init();


    var axiom = "A"
    var iteration = 2;
    var raw_sentence = Lsystem("AB", iteration, 0);

    // tempigt
    raw_sentence = "A[B[A]B]AA"

    var split_sentence = raw_sentence.split('');

    var rand_sentence = [];
    // Get random number from seed
    for (var i = 0; i < split_sentence.length; i++) {
        var randomNumber = generateTruncatedRandom(M, i)
        var item = { "instruction": split_sentence[i], "rand": randomNumber };
        rand_sentence.push(item)

        sentence.push(item)
    }




    createTree(0, sentence.length - 1, rootCoord, new THREE.Vector3(0, 0, 0), segmentLength);
    
    
    
    renderer.render(scene, camera);
    document.getElementById("deleteButton").disabled = false;
}







/*



var scene = new THREE.Scene();

//Kameror
{
    //Create a perspective camera, most similar to the eye (FOV, aspect ratio based on browser size, near and far plane)
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    var camera = new THREE.OrthographicCamera(-5, 5, 5, -5, - 20, 1000);
    camera.position.z = 1; 
    camera.position.x = 0;
    camera.position.y = 1;
    camera.rotation.x = - Math.PI/6;

}
    
//Blandat
{
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

    

    //Must the call the render function evert time an object is added
    //This function is so that the mesh (the object) wont scale with us when we change the size 
    //of the window. It wont stretch. Creates a loop that draw the scene everytime the
    //the screen is refreshed.



}





// Här måste man slänga in startposition m.a.p. objektet man lägger in, 
// eller i mitten av bounding boxen (50, 0, 50);

//(start index, last index, initial position, initial rotation, segment lenght)


renderer.render(scene, camera); //renders the scene and the camera
*/