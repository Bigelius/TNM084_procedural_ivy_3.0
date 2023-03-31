/*
    Segment values. Should be pickable with sliders
*/ 
var radiusBottom = 0.1;
var radiusTop = 0.1;
var segmentLength = 1;

/*
    Debugging color coding. Not related to grammar rules, although the 
    structure is similar
*/
function getColor(char){
    var material;
    switch(char) {
      case "A":
            material = new THREE.MeshLambertMaterial({color: 0xff9999});  
        break;
            
      case "B":
            material = new THREE.MeshLambertMaterial({color: 0x99ff99});  
        break;
        
      case "C":
            material = new THREE.MeshLambertMaterial({color: 0x99ffff});  
        break;
       
      case "D":
            material = new THREE.MeshLambertMaterial({color: 0xcc99ff});  
        break;
      
      case "E":
            material = new THREE.MeshLambertMaterial({color: 0xff99e6});  
        break;
       
      case "F":
            material = new THREE.MeshLambertMaterial({color: 0xff9999});  
        break;
          
      case "G":
            material = new THREE.MeshLambertMaterial({color: 0xffff99});  
        break;
    }
    return material;
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

