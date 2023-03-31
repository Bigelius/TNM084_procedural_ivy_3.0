var scene = new THREE.Scene();
//Create a perspective camera, most similar to the eye

//(FOV, aspect ratio based on browser size, near and far plane)
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
window.addEventListener('resize', (e) =>{
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

/******************* MIXED FUNCTIONS ***************************/   
function subVec3(a, b) { // vette fan va ja inte httar för inbyggda grejer...
    return new THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function absVec3(a) {
    var sum = (a.x*a.x) + (a.y*a.y) + (a.z*a.z);
    var res = Math.sqrt(sum);
    return res;
}

