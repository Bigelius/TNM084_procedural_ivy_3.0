//'False' = tom voxel
export function makeVoxelMatrix(max_val){
    var i = 0; //Index in x
    var j = 0; //Index in y
    var k = 0; //Index in z
    
    //Make empty array with false bools ("empty")
    var mat_x = [];
    while(i < max_val){
        mat_x.push(false);
        ++i;
    }
    /*Oklart hur referenser funkar, så gör
    nya temp-arrayer för varje nytt index*/
    var temp = mat_x;
    var mat_xy = [temp];
    while(j < max_val){
        var temp2 = mat_x;
        mat_xy.push(temp2);
        ++j;
    }
    var temp3 = mat_xy;
    var mat_xyz = [temp3];
    while(k < max_val){
        var temp4 = mat_xy;
        mat_xyz.push(temp4);
        ++k;
    }
    //Returnerar en n*n*n-matris med bara massa 'false' i sig
    return mat_xyz;
}
