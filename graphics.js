var sentence = [];
//SPECS FÖR CYLINDERN 
{
    var sum = 0;
    var radiusBottom = 0.1;
    var radiusTop = 0.1;

    var max_radiusBottom = 0.5;
    var min_radiusTop = 0.1;

    var currentGirth = max_radiusBottom;
    var girthStarts = [];
    var girthShrinkRates = [];


    var segmentLength = 2;
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
function pointDist(a, b) {
    let diff = subVec3(a, b);
    return absVec3(diff);
}
function coord2Index(coord) {
    if (coord.x > x_side - 1) {
        console.log("X COORDINATE OUT OF BOUNDS")
    }
    else if (coord.y > y_side - 1) {
        console.log("Y COORDINATE OUT OF BOUNDS")
    }
    else if (coord.z > z_side - 1) {
        console.log("Z COORDINATE OUT OF BOUNDS")
    }
    else return new THREE.Vector3(floor(coord.x), floor(coord.y), floor(coord.z));
}
/*****************************************
*    MATRISEN OCH INITIALA VOXLAR
        + Sfärerna
******************************************/

var matrixSize = 20;
var possibleStartPositions = [];
var sphereMid = new THREE.Vector3(matrixSize / 2, 1, matrixSize / 2);
var radIn = 7;
var radOut = 10;
//'False' = tom voxel
//OBS: Index 0 - 19!!
var voxelMid = new THREE.Vector3(0, 0, 0);

function drawVoxel(pos) {

    var g = new THREE.CubeGeometry(1, 1, 1);
    var edges = new THREE.EdgesGeometry(g);

    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    var m = new THREE.MeshLambertMaterial({ color: 0xfc0324 });
    m.transparent = true;
    m.opacity = 0.1;
    var seg = new THREE.Mesh(g, m);

    seg.position.set(pos.x, pos.y, pos.z);

    line.position.set(pos.x, pos.y, pos.z);

    scene.add(line);
    scene.add(seg);
}

function makeVoxelMatrix(size) {
    let i = 0;
    let j = 0;
    let k = 0;

    let mat_x = [Boolean];
    while (i < size) {
        mat_x.push(false);
        ++i;
    }
    var temp = mat_x;
    var mat_xy = [temp];
    while (j < size) {
        var temp2 = mat_x;
        mat_xy.push(temp2);
        ++j;
    }
    var temp3 = mat_xy;
    var mat_xyz = [temp3];
    while (k < size) {
        var temp4 = mat_xy;
        mat_xyz.push(temp4);
        ++k;
    }

    i = 0;
    j = 0;
    k = 0;
    //Define initial empty voxels
    while (i < size) {
        j = 0;

        while (j < size) {
            k = 0;

            while (k < size) {
                //Find center of voxel
                voxelMid = new THREE.Vector3(i + 0.5, j + 0.5, k + 0.5);
                //Ritar hela voxel-fältet
                //drawVoxel(voxelMid);

                var dist = pointDist(voxelMid, sphereMid);
                //Is the voxel on floor and outside sphere?
                if (j == 0 && dist > radIn) {
                    mat_xyz[i][j][k] = true;
                    //Ritar marken
                    //drawVoxel(voxelMid);
                }
                //Is the voxel close to the sphere? (Inre radie < V < yttre radie)
                else if (dist > radIn && dist < radOut) {
                    mat_xyz[i][j][k] = true;

                    //Ritar lager runt sfär
                    drawVoxel(voxelMid);

                    //Lägger till möjliga startpunkter i listan
                    //Tror inte den funkar för j=0 i.o.m. mid-kompensation
                    if (j == 1) {
                        possibleStartPositions.push(new THREE.Vector3(i + 0.5, j, k + 0.5));
                        //Ritar startvoxlar
                        drawVoxel(voxelMid);
                    }
                }
                k++;
            }
            j++;
        }
        i++;
    }

    return mat_xyz;
}

//Välj startposition från lista
//Behöver parametervärde och längd på parametern
//EJ KONTROLLERAD
function initialStartPosition(paramValue, paramLenght) {
    scale = paramLenght / possibleStartPositions.lenght;  //Hur många param-värden per faktiskt startindex
    normIndex = paramValue / scale;            //Hur många faktiska index skickar vi in från parameter
    index = floor(normIndex);
    return possibleStartPositions[index];
}
//EJ KONTROLLERAD
function isEmpty(index) {
    if (matrix[index.i][index.j][index.k] = false)
        return false;
    else return true;
}

//EJ KONTROLLERAD!
//True om ingen krock, uppdaterar matrisen 
/*function noCollision(coord, rot){
    var midCoord;
	
    var tempSegment = new THREE.CylinderGeometry(radiusTop, radiusBottom, lenght, 12);
    //Oklart om detta behövs, men har inte testat än
    //var g = new THREE.CylinderGeometry(radiusTop, //radiusBottom, lenght, 12);
    //var edges = new THREE.EdgesGeometry(g);
    //var m = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });
    //var tempSegment = new THREE.Mesh(g, m);
	
    seg.position.set(coord.x, coord.y, coord.z);
    seg.rotation.set(rot.x, rot.y, rot.z);
    
    tempSegment.TranslateY(segLen/2);
    tempSegment.getWorldCoord(tempCoordinate);
	
    if(isEmpty(midCoord)){
        var endCoord;
        tempSegment.TranslateY(segLen/2);
        tempSegment.getWorldCoord(endCoord);

        if(isEmpty(endCoord)){
            midCoord = coord2Index(midCoord);
            endCoord = coord2Index(temoCoord2);
            
            matrix[midCoord.x][midCoord.y][midCoord.z] = false;
            matrix[endCoord.x][endCoord.y][endCoord.z] = false;
            return true
        }
        else return false
    } 
    //OBS: Kan inte leta efter ny väg i noCollision eftersom väg-funktionen använder noCollision!
    else return false
}*/


/*****************************************
*               INITIALISERING
******************************************/

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
    // camera.position.z = 1;
    //camera.position.x = 0;
    //camera.position.y = 5;
    //camera.rotation.x = - Math.PI / 6;
    //camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
    // camera.updateProjectionMatrix();

    // camera.position.x = 9;
    camera.position.y = 15;
    // camera.rotation.y = 0 * Math.PI / 2;
    //camera.position.y = 0.0;

    //camera.position.z = 10;
    //camera.lookAt(0,0,0)

    //Skapar / ritar matrisen
    var myMatrix = makeVoxelMatrix(matrixSize);

    //To see the color of the object we need a light for it
    var light = new THREE.PointLight(0xFFFFFF, 1, 500);

    light.position.set(10, 0, 5); //(x,y,z)
    //(color, intensity, distance)

    //For everything we create, we need to add (and render the whole scene)
    scene.add(light);

}

/*****************************************
*               TRÄD
******************************************/



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

function setNewGirth(oldGirth, shrinkStep) {

    var newGirth = oldGirth - (shrinkStep);

    if (newGirth > min_radiusTop) {
        return newGirth;
    }
    else {
        return min_radiusTop;
    }

}

function createTreeSegment(pos, rot, char, lenght, bottomGirth) {
    //console.log("bottomGirth : " + bottomGirth)

    var topGirth = setNewGirth(currentGirth, girthShrinkRates[girthShrinkRates.length - 1])
    //var topGirth = currentGirth - girthShrinkRates[girthShrinkRates.length-1]
    //console.log("topGirth : " + topGirth)

    //console.log("calculating!!!!!!!!!!!!")
    //console.log(bottomGirth + " - " + girthShrinkRates[girthShrinkRates.length-1] + " = " + topGirth)

    currentGirth = topGirth;



    //var g = new THREE.CylinderGeometry(radiusTop, radiusBottom, lenght, 12);
    var g = new THREE.CylinderGeometry(currentGirth, bottomGirth, lenght, 12);
    var edges = new THREE.EdgesGeometry(g);

    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    var m = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });

    m = getColor(char.instruction);
    var seg = new THREE.Mesh(g, m);

    //    var rand_rot = getDir(char);
    var rand_rot = Math.PI * char.rand;

    if (current_index = 0) { rand_rot = 0 }
    //console.log(rand_rot)

    //seg.position.set(pos.x, pos.y, pos.z);
    //seg.rotation.set(rot.x, rot.y, rot.z);
    //line.position.set(pos.x, pos.y, pos.z);
    //line.rotation.set(rot.x , rot.y, rot.z);

    seg.position.set(pos.x, pos.y, pos.z);
    seg.rotation.set(rot.x + rand_rot, rot.y + rand_rot, rot.z + 0);
    line.position.set(pos.x, pos.y, pos.z);
    line.rotation.set(rot.x + rand_rot, rot.y + rand_rot, rot.z + 0);

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

function getDepthOfSubtree(start_INDEX) {

    var end_INDEX = getEndIndexOfBranch(start_INDEX)

    var depth = 0;

    for (var i = start_INDEX + 1; i < end_INDEX; i++) {

        if (sentence[i].instruction == "[") {
            var endOfSideBranch = getEndIndexOfBranch(i)
            i = endOfSideBranch;
        }
        else {
            depth = depth + 1;
        }
    }


    return depth;

}

function createTree(start_INDEX, end_INDEX, startPosition, c_rot, segLen, segGirth) {
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


            girthStarts.push(currentGirth)
            var subtreeDepth = getDepthOfSubtree(current_index)
            var shrinkRate = segGirth / (subtreeDepth + 1)
            girthShrinkRates.push(shrinkRate)
            var nextSegGirth = setNewGirth(currentGirth, shrinkRate)
            currentGirth = nextSegGirth

            //var b_rot = new THREE.Vector3(c_rot.x, c_rot.y + Math.PI / 5, c_rot.z + Math.PI / 5); //New initial rotation for branch    
            var b_rot = new THREE.Vector3(c_rot.x, c_rot.y, c_rot.z); //New initial rotation for branch    

            createTree(current_index + 1, lbi, rootCoord, b_rot, segLen, currentGirth); //Make new branch with the new initial specs

            //Updates the index 
            current_index = lbi; //Go to next index after recursive branch

        }


        else if (sentence[current_index].instruction != "]" && sentence[current_index].instruction != "-" && sentence[current_index].instruction != "+") {
            createTreeSegment(rootCoord, c_rot, sentence[current_index], segmentLength, currentGirth);
        }

        else {

            var stamCoord = starts[starts.length - 1]
            rootCoord.x = stamCoord.x;
            rootCoord.y = stamCoord.y;
            rootCoord.z = stamCoord.z;
            starts.pop()

            var stamGirth = girthStarts[girthStarts.length - 1]
            currentGirth = stamGirth;
            girthStarts.pop()
            girthShrinkRates.pop()
        }


        ++current_index;
    }
    tempVec = dustyOldVec;
    rootCoord = oldPosition;


}

// Function to generate the scene and enable the "Delete All Objects" button

/*****************************************
*               SCENEN
******************************************/

function generateScene(M, sphereRadie) {
    console.log("generateScene()");

    init();


    var axiom = "ABC"
    var iteration = 1;
    var raw_sentence = Lsystem(axiom, iteration, 0);

    // tempigt
    //raw_sentence = "[A[B[AA]BB]AAA]"

    raw_sentence = "[" + raw_sentence + "]";

    var split_sentence = raw_sentence.split('');

    var rand_sentence = [];
    // Get random number from seed
    for (var i = 0; i < split_sentence.length; i++) {
        var randomNumber = generateTruncatedRandom(M, i)
        var item = { "instruction": split_sentence[i], "rand": randomNumber };
        rand_sentence.push(item)

        sentence.push(item)
    }


    var subtreeDepth = getDepthOfSubtree(0)
    girthShrinkRates.push((max_radiusBottom - min_radiusTop) / subtreeDepth)
    girthStarts.push(max_radiusBottom)


    sentence.shift();
    sentence.pop();


    console.log("Sending L-string")
    console.log(sentence)


    createTree(0, sentence.length - 1, rootCoord, new THREE.Vector3(0, 0, 0), segmentLength, currentGirth);



    //drawVoxel(new THREE.Vector3(0, 0, 0))
    makeVoxelMatrix(10)


    renderer.render(scene, camera);
    document.getElementById("deleteButton").disabled = false;




}

const animate = () => {
    requestAnimationFrame(animate);

    // Rotate the camera around the scene's origin
    const radius = 5;
    const angle = Date.now() * 0.0005;
    camera.position.x = radius * Math.cos(angle);
    camera.position.z = radius * Math.sin(angle);
    camera.lookAt(0, 10, 0);

    renderer.render(scene, camera);
};

animate();