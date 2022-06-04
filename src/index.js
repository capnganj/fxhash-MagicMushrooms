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
var controls, renderer, scene, camera, threeCanvas, magicCanvas;
init();

function init() {
  //scene & camera
  scene = new THREE.Scene();
  //let bc = feet.desaturateColor(feet.color.background, 1.5);
  //scene.background = new THREE.Color(bc.r/255, bc.g/255, bc.b/255);

  renderer = new THREE.WebGLRenderer( { 
    antialias: true,
    alpha: true
  } );
  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.id = "hashish";
  //document.body.appendChild( renderer.domElement );
  threeCanvas = renderer.domElement;

  //create a canvas for the magicmagic
  magicCanvas = document.createElement("CANVAS");
  magicCanvas.id = "magicHashish";
  magicCanvas.width = window.innerWidth;
  magicCanvas.height = window.innerHeight;
  document.body.appendChild(magicCanvas);

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1.5, 4.5 );
  camera.position.set( 0, 0.5 , 4 );
  //controls = new OrbitControls( camera, renderer.domElement );



  //geometry
  const b = new THREE.IcosahedronGeometry(1.5);

  const t = new THREE.TorusBufferGeometry(1, 0.5, 20, 50)
  t.rotateX(feet.map(fxrand(), 0, 1, 0, Math.PI * 2))
  t.rotateY(feet.map(fxrand(), 0, 1, 0, Math.PI * 2))
  t.rotateZ(feet.map(fxrand(), 0, 1, 0, Math.PI * 2))

  let f = new MushroomCap(1.5, 1).fungualBufferGeometry;
  




  //material
  const m = new THREE.MeshDepthMaterial( );
  const n = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(f, m);
  mesh.position.set(1, 1, 0)
  scene.add(mesh);

  const axis = new THREE.AxesHelper(1);
  //scene.add(axis);

  //set the background color 
  let bod = document.body;
  //bod.style.backgroundColor = 'white'
  //bod.style.backgroundColor = feet.desaturateColor(feet.color.background, 1.5);

  //set up resize listener and let it rip!
  window.addEventListener( 'resize', onWindowResize );
  //animate();
  render();
  magicDust();
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
  link.download = 'AcidDrops.png';
  link.href = document.getElementById('hashish').toDataURL()
  link.click();
}

function magicDust() {
  Stereogram.render({
    el: 'magicHashish',
    colors: [feet.interpolateFn(0.05), feet.interpolateFn(0.5), feet.interpolateFn(0.95)],
    depthMapper: new Stereogram.CanvasDepthMapper(threeCanvas)
  });
}
