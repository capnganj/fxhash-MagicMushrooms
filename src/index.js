//CAPNGANJ Magic Mushrooms fxhash generative token
//June, 2022

//imports
import { Features } from './Features';
import * as THREE from 'three';


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
//console.log(window.$fxhashFeatures);
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
var controls, renderer, scene, camera;
init();

function init() {
  //scene & camera
  scene = new THREE.Scene();
  let bc = feet.desaturateColor(feet.color.background, 1.5);
  //scene.background = new THREE.Color(bc.r/255, bc.g/255, bc.b/255);

  renderer = new THREE.WebGLRenderer( { 
    antialias: true,
    alpha: true
  } );
  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.id = "hashish";
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 3, 6 );
  camera.position.set( 0, 0, 4 );




  //bubble geometry
  const b = new THREE.IcosahedronGeometry(1.5, 1);

  //phong
  const m = new THREE.MeshDepthMaterial( { side: THREE.BackSide });

  const mesh = new THREE.Mesh(b, m);
  scene.add(mesh);



  //set the background color 
  let bod = document.body;
  bod.style.backgroundColor = 'white'
  //bod.style.backgroundColor = feet.desaturateColor(feet.color.background, 1.5);

  //set up resize listener and let it rip!
  window.addEventListener( 'resize', onWindowResize );
  //animate();
  render();
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
