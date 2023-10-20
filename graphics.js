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


    var segmentLength = 2.5; //1,5 bättre för att inte gå över så många voxlar?
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
    if (coord.x > 20 - 1) {
        console.log("X COORDINATE OUT OF BOUNDS")
        return null;
    }
    else if (coord.y > 20 - 1) {
        console.log("Y COORDINATE OUT OF BOUNDS")
        return null;
    }
    else if (coord.z > 20 - 1) {
        console.log("Z COORDINATE OUT OF BOUNDS")
        return null;
    }
    else return new THREE.Vector3(Math.floor(coord.x), Math.floor(coord.y), Math.floor(coord.z));
}
/*****************************************
*    MATRISEN OCH INITIALA VOXLAR
        + Sfärerna
******************************************/

var possibleStartPositions = [];

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
    
    //Adds to scene and draws when 'generate'
    scene.add(line);
    scene.add(seg);
    
    //Adds to object list so they can be deleted
    objects.push(line);
    objects.push(seg);
}

function makeVoxelMatrix(size) {
    let i = 0;
    let j = 0;
    let k = 0;

    var sphereMid = new THREE.Vector3(size / 2, 1, size / 2);
    var radIn = 7;
    var radOut = 10;
    
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
                    //drawVoxel(voxelMid);

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

//Return start position (vec3) from list
function initialStartPosition(paramValue, paramLenght) {
    let len = possibleStartPositions.length;
    
    //console.log("list len");
    //console.log(len);
    let scale = paramLenght / len;  //Hur många param-värden per faktiskt startindex
    let normIndex = paramValue / scale;            //Hur många faktiska index skickar vi in från parameter
    let index = Math.floor(normIndex);
    return possibleStartPositions[index]; //This is a vec3
    
    }

//EJ KONTROLLERAD
function isEmpty(index) {
    console.log(index);
    if(index == null) return false;
    
    if (myMatrix[index.x][index.y][index.z] = false)
        return false;
    else return true;
}

//EJ KONTROLLERAD!
//True om ingen krock, uppdaterar matrisen 
function noCollision(pos, rot){
    
    let tempCoordinate = new THREE.Vector3(0,0,0); //Stores the first mid coordinate
	
    //var g = new THREE.CylinderGeometry(radiusTop, radiusBottom, lenght, 12);
    var g = new THREE.CylinderGeometry(radiusTop, radiusBottom, segmentLength, 12);
    var edges = new THREE.EdgesGeometry(g);
    let line_temp = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    
    line_temp.position.set(pos.x, pos.y, pos.z);
    line_temp.rotation.set(rot.x , rot.y, rot.z);
    
    
    line_temp.translateY(segmentLength / 2);
    
    console.log("line_temp pos")
    console.log(line_temp.position)
    
    line_temp.getWorldPosition(tempCoordinate);
	
    console.log("tempCoord");
    console.log(tempCoordinate);
    
    if(isEmpty(coord2Index(tempCoordinate))){
        /*let endCoord;
        tempSegment.TranslateY(segmentLength/2);
        tempSegment.getWorldCoord(endCoord);

        if(isEmpty(endCoord)){
            midCoord = coord2Index(midCoord);
            endCoord = coord2Index(temoCoord2);
            
            matrix[midCoord.x][midCoord.y][midCoord.z] = false;
            matrix[endCoord.x][endCoord.y][endCoord.z] = false;
            return true
        }
        else return false*/
        return true;
    } 
    //OBS: Kan inte leta efter ny väg i noCollision eftersom väg-funktionen använder noCollision!
    else return false
}


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
    camera.position.x = 10;
    camera.position.y = 5;
    camera.position.z = 30;

    //camera.rotation.x = - Math.PI / 6;
    
    //Skapar / ritar matrisen
    possibleStartPositions = []; //Nollställer startpos innan man lägger till nya
    myMatrix = makeVoxelMatrix(20); //Skriver över den gamla, behöver inte nollställas
    
    //To see the color of the object we need a light for it
    var light1 = new THREE.PointLight(0xFFFFFF, 1, 500);
    var light2 = new THREE.PointLight(0xFFFFFF, 1, 500);
    var light3 = new THREE.PointLight(0xFFFFFF, 1, 500);
    var light4 = new THREE.PointLight(0xFFFFFF, 1, 500);
    
    light1.position.set(0,  10, 0); //(x,y,z)
    light2.position.set(20, 10, 0); //(x,y,z)
    light3.position.set(20, 10, 20); //(x,y,z)
    light4.position.set(0,  10, 20); //(x,y,z)
    //(color, intensity, distance)

    //For everything we create, we need to add (and render the whole scene)
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
    scene.add(light4);

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

    var topGirth = setNewGirth(currentGirth, girthShrinkRates[girthShrinkRates.length - 1]);
    currentGirth = topGirth;

    //var g = new THREE.CylinderGeometry(radiusTop, radiusBottom, lenght, 12);
    var g = new THREE.CylinderGeometry(currentGirth, bottomGirth, lenght, 12);
    var edges = new THREE.EdgesGeometry(g);

    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    var m = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });

    m = getColor(char.instruction);
    var seg = new THREE.Mesh(g, m);

    //    var rand_rot = getDir(char);
    //var rand_rot = Math.PI * char.rand;

    if (current_index = 0) { rand_rot = 0 }
    //console.log(rand_rot)

    seg.position.set(pos.x, pos.y, pos.z);
    seg.rotation.set(rot.x, rot.y, rot.z);
    line.position.set(pos.x, pos.y, pos.z);
    line.rotation.set(rot.x , rot.y, rot.z);

    //Ändra tillbaka det här och sätt rand i createTree
    /*seg.position.set(pos.x, pos.y, pos.z);
    seg.rotation.set(rot.x + rand_rot, rot.y + rand_rot, rot.z + 0);
    line.position.set(pos.x, pos.y, pos.z);
    line.rotation.set(rot.x + rand_rot, rot.y + rand_rot, rot.z + 0);*/

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
            //Currently don't have standard initial rotation
            let branchRot = Math.PI * sentence[current_index].rand;
            var b_rot = new THREE.Vector3(c_rot.x + branchRot, c_rot.y + branchRot, c_rot.z); //New initial rotation for branch    

            createTree(current_index + 1, lbi, rootCoord, b_rot, segLen, currentGirth); //Make new branch with the new initial specs

            //Updates the index 
            current_index = lbi; //Go to next index after recursive branch

        }


        else if (sentence[current_index].instruction != "]" && sentence[current_index].instruction != "-" && sentence[current_index].instruction != "+") {
            
            let segRandRot = Math.PI * sentence[current_index].rand;
            let segRot = new THREE.Vector3(c_rot.x + segRandRot, c_rot.y + segRandRot, c_rot.z);
            
            if(noCollision(rootCoord, segRot)){
                createTreeSegment(rootCoord, segRot, sentence[current_index], segmentLength, currentGirth);
               }
            else current_index = end_INDEX;
            
            
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

    // Get random number from seed
    for (var i = 0; i < split_sentence.length; i++) {
        var randomNumber = generateTruncatedRandom(M, i)
        var item = { "instruction": split_sentence[i], "rand": randomNumber };
        
        sentence.push(item)
    }

    var subtreeDepth = getDepthOfSubtree(0)
    girthShrinkRates.push((max_radiusBottom - min_radiusTop) / subtreeDepth)
    girthStarts.push(max_radiusBottom)

    //Vad är det här?
    sentence.shift();
    sentence.pop();
    
    rootCoord = initialStartPosition(startPosition, startPosition_lenght);
    
    console.log("rootCoord");
    console.log(rootCoord);
    drawVoxel(rootCoord); //Lägg till 
    createTree(0, sentence.length - 1, rootCoord, new THREE.Vector3(0, 0, 0), segmentLength, currentGirth);

    //drawVoxel(new THREE.Vector3(0, 0, 0))
    

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

//animate();

