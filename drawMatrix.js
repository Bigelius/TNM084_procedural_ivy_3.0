/*var max_val = 10;   //Hur många voxlar i xyz

//'False' = tom voxel
function makeVoxelMatrix(){
    var a = 0;
    var b = 0;
    var c = 0;
    
    var mat_x = [];
    while(a < max_val){
        mat_x.push(false);
        ++a;
    }
    var temp = mat_x;
    var mat_xy = [temp];
    while(b < max_val){
        var temp2 = mat_x;
        mat_xy.push(temp2);
        ++b;
    }
    var temp3 = mat_xy;
    var mat_xyz = [temp3];
    while(c < max_val){
        var temp4 = mat_xy;
        mat_xyz.push(temp4);
        ++c;
    }
    //Returnerar en n*n*n-matris med bara massa 'false' i sig
    return mat_xyz;
}

//Ritar en voxel
function drawVoxel(pos){

    var g = new THREE.CubeGeometry(0.25, 0.25, 0.25 );
    var edges = new THREE.EdgesGeometry( g );

    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    var m = new THREE.MeshLambertMaterial({color: 0xfc0324});
    m.transparent = true;
    m.opacity = 0.1;
    var seg = new THREE.Mesh(g, m);

    seg.position.set(pos.x /4, pos.y /4, pos.z/4);
    
    line.position.set(pos.x /4, pos.y /4, pos.z /4);
    
    scene.add(line);
    scene.add(seg);
}

//Ritar alla voxlar
function drawVoxelGrid(){
    var i = 0;
    while(i < max_val){
        var j = 0;                      //Inne i loop så den återställs varje iteration
        while(j < max_val){
            var k = 0;                  //Inne i loop så den återställs varje iteration
            while(k < max_val){
                var coord = new THREE.Vector3(i,j,k);
                drawVoxel(coord);
                ++k;
            }
            ++j;
        }
        ++i;
    }
}
//var position = new THREE.Vector3(0,0,0);

drawVoxelGrid();
renderer.render(scene, camera); //renders the scene and the camera
*/

