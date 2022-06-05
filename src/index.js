//CAPNGANJ Magic Mushrooms fxhash generative token
//June, 2022

//imports
import { Features } from './Features';
import { Stereogram } from './Stereogram';
import { MushroomCap } from './MushroomCap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


//1) - generate fxhash features - global driving parameters
//new featuresClass
let feet = new Features();
window.$fxhashData = feet;

// FX Features
window.$fxhashFeatures = {
  "Palette" : feet.color.name,
  "Scale" : feet.scale.tag,
  "Speed": feet.speed.tag,
  "Density": feet.density.tag
};
console.log(window.$fxhashFeatures);
//console.log(feet);

//vars related to fxhash preview call
//loaded tracks whether texture has loaded;
//previewed tracks whether preview has been called
let loaded = false;
let previewed = false;

//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
//console.log("fxhash features", window.$fxhashFeatures);


//2) Initialize three.js scene and start the render loop
//all data driving geometry and materials and whatever else should be generated in step 2




//global vars 
var controls, renderer, scene, camera, threeCanvas, magicCanvas, imageElement;
init();

function init() {
  //scene & camera
  scene = new THREE.Scene();
  //let bc = feet.desaturateColor(feet.color.background, 1.5);
  //scene.background = new THREE.Color(0,0,0);

  renderer = new THREE.WebGLRenderer( { 
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.id = "hashish";
  document.body.appendChild( renderer.domElement );
  threeCanvas = renderer.domElement;

  //image for the depthmapper to chew on - three generates this... but did not work last night
  imageElement = document.createElement('img');
  imageElement.id = "depthImage";
  imageElement.width = window.innerWidth;
  imageElement.height = window.innerHeight;
  document.body.appendChild(imageElement);
  

  //create a canvas for the magicmagic
  magicCanvas = document.createElement('canvas');
  magicCanvas.id = "magicHashish";
  magicCanvas.width = window.innerWidth;
  magicCanvas.height = window.innerHeight;
  document.body.appendChild(magicCanvas);

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1.2, 6 );
  camera.position.set( 0, 0.5, 3.1 );
  camera.updateProjectionMatrix();
  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set(0,0.5,0)


  //material
  const m = new THREE.MeshDepthMaterial();
  const n = new THREE.MeshNormalMaterial();


  //geometry

  //ellipse gives evenly spaced points 
  const elle = new THREE.EllipseCurve(0,0, 2.2, 1.1, 0, Math.PI*2, false, 0);
  const numShrooms = 7;
  const basePointsOnXY = elle.getPoints(numShrooms)

  for (let i = 0; i < numShrooms; i++) {
    
    //cap
    const capWidth = feet.map(fxrand(), 0, 1, 0.3, 0.75);
    const f = new MushroomCap(capWidth, feet.map(fxrand(), 0, 1, 0.2, 0.5)).fungualBufferGeometry;
    const mesh = new THREE.Mesh(f, m);
    
    const centerPoint = new THREE.Vector3(basePointsOnXY[i].x, feet.map(fxrand(), 0, 1, 0.1, 1.5), basePointsOnXY[i].y)
    mesh.position.set(centerPoint.x, centerPoint.y, centerPoint.z)
    scene.add(mesh);

    //stem
    const insetFactor = feet.map(fxrand(), 0, 1, 0.25, 0.85);
    const stemCrv = new THREE.CubicBezierCurve3(
      new THREE.Vector3(centerPoint.x, centerPoint.y, centerPoint.z),
      new THREE.Vector3(centerPoint.x, centerPoint.y * 0.65, centerPoint.z),
      new THREE.Vector3(centerPoint.x * insetFactor, centerPoint.y * 0.15, centerPoint.z * insetFactor),
      new THREE.Vector3(centerPoint.x * insetFactor, -1.0, centerPoint.z * insetFactor)
    );
    const tube = new THREE.TubeBufferGeometry(stemCrv, 100, capWidth * 0.125, 50, false);
    const stemMesh = new THREE.Mesh(tube, m);
    scene.add(stemMesh);
  }

  const boxer = new THREE.BoxBufferGeometry(6,4,3.2);
  //flip normals
  boxer.applyMatrix4(new THREE.Matrix4().makeScale(-1,1,1));
  const boxMesh = new THREE.Mesh(boxer, m);
  boxMesh.position.set(0,1,0)
  scene.add(boxMesh);

  const axis = new THREE.AxesHelper(1);
  //scene.add(axis);

  //set the background color 
  let bod = document.body;
  //bod.style.backgroundColor = 'white'
  //bod.style.backgroundColor = feet.desaturateColor(feet.color.background, 1.5);

  //set up resize listener and let it rip!
  //window.addEventListener( 'resize', onWindowResize );
  //animate();

  //render the first frame
  render();

  //populate the image source with the data url 
  imageElement.src = document.getElementById('hashish').toDataURL();
  imageElement.onload = () => {
    console.log("image load event");
    magicDust();
    document.body.removeChild(imageElement);
  }
  document.body.removeChild( renderer.domElement );
  //document.body.removeChild(imageElement);

  //generate the stereogram
  //magicDust();
  //download();
}


// threejs animation stuff
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  requestAnimationFrame( animate );
  render();

}

function render() {

  renderer.render( scene, camera );

  //wait and see with this one...
  // if(loaded == false){
  //   loaded = true;
  // }

  // if(previewed == false && loaded == true && renderer.info.render.frame > 100){
  //   fxpreview();
  //   previewed = true;
  //   //download();
  // } 

}

function download() {
  var link = document.createElement('a');
  link.download = 'MagicMushrooms.png';
  link.href = document.getElementById('hashish').toDataURL()
  link.click();
}

function magicDust() {
  console.log("call stereogram")

  const imgMapper = new Stereogram.ImgDepthMapper(imageElement);
  const dm = imgMapper.generate(window.innerWidth, window.innerHeight);

  Stereogram.render({
    el: 'magicHashish',
    colors: [feet.interpolateFn(0.05), feet.interpolateFn(0.5), feet.interpolateFn(0.95)],
    depthMap: dm
    //depthMapper: new Stereogram.CanvasDepthMapper(threeCanvas)
    //depthMapper: new Stereogram.ImgDepthMapper(imageElement)
  });
}
