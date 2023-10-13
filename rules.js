function getColor(char) {
  var material;
  switch (char) {
    case "A":
      material = new THREE.MeshLambertMaterial({ color: 0xff9999 });
      break;

    case "B":
      material = new THREE.MeshLambertMaterial({ color: 0x99ff99 });
      break;

    case "C":
      material = new THREE.MeshLambertMaterial({ color: 0x99ffff });
      break;

    case "D":
      material = new THREE.MeshLambertMaterial({ color: 0xcc99ff });
      break;

    case "E":
      material = new THREE.MeshLambertMaterial({ color: 0xff99e6 });
      break;

    case "F":
      material = new THREE.MeshLambertMaterial({ color: 0xff9999 });
      break;

    case "G":
      material = new THREE.MeshLambertMaterial({ color: 0xffff99 });
      break;
  }
  return material;
}

function getDir(branch) {
  var dir = 0;
  switch (branch.instruction) {
    case "A":
      dir = branch.rand * -1;
      break;

    case "B":
      dir = branch.rand * 1;
      break;

    case "C":
      dir = branch.rand * -1;
      break;

    case "D":
      dir = branch.rand * 1;
      break;

    case "E":
      dir = branch.rand * 1;
      break;

    case "F":
      dir = branch.rand * 1;
      break;

    case "G":
      dir = branch.rand * 1;
      break;
  }
  return dir;
}