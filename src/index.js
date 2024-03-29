//CAPNGANJ Magic Mushrooms fxhash generative token
//June, 2022

//imports
import { Features } from './Features';
import { Stereogram } from './Stereogram';
import { MushroomCap } from './MushroomCap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import p5 from 'p5';


//1) - generate fxhash features - global driving parameters
let feet = new Features();
window.$fxhashData = feet;

// FX Features
window.$fxhashFeatures = {
  "Palette" : feet.color.inverted ? feet.color.name + " Invert" : feet.color.name,
  "Size": feet.size.tag,
  "Density": feet.density.tag
};
//console.log(window.$fxhashFeatures);
//console.log(feet);

//vars related to fxhash preview call
//loaded tracks whether everything has loaded;
//previewed tracks whether preview has been called
let loaded = false;
let previewed = false;


//2) Initialize three.js scene and start the render loop (here we only call render once!)

//global vars three and stereogram use to generate a magical canvas
let controls, renderer, scene, camera, threeCanvas, magicCanvas, imageElement;

//dimensions for stereogram image
let magicWidth = 1200;
let magicHeight = 742;

//global processing sketch object
let globalSK;

//final image element that gets assigned to and redrawn by p5js
let magicImage;

//big hairy magic fungus image generation!  This runs once, and ultimately generates an image that p5js renders to a canvas and resizes
function bootstrapMagicMushroomStereogram() {
  //scene & camera
  scene = new THREE.Scene();

  //threejs renderer
  renderer = new THREE.WebGLRenderer( { 
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( magicWidth, magicHeight );
  renderer.domElement.id = "hashish";
  document.body.appendChild( renderer.domElement );
  threeCanvas = renderer.domElement;

  //create a canvas for the magicmagic
  magicCanvas = document.createElement('canvas');
  magicCanvas.id = "magicHashish";
  magicCanvas.width = magicWidth;
  magicCanvas.height = magicHeight;
  document.body.appendChild(magicCanvas);

  //image for the depthmapper to chew on - three generates this, and the image depthmapper seems to work better than the webgl2 canvas mapper
  imageElement = document.createElement('img');
  imageElement.id = "depthImage";
  imageElement.width = magicWidth;
  imageElement.height = magicHeight;
  document.body.appendChild(imageElement);
  

  //threejs camera and orbitcontrols
  camera = new THREE.PerspectiveCamera( 60, magicWidth / magicHeight, 1.3, 10 );
  camera.position.set( 0, 0.5, 3.1 );
  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set(0,0.5,0)
  camera.updateProjectionMatrix();

  //material
  const m = new THREE.MeshDepthMaterial();


  //geometry

  //ellipse gives evenly spaced points for...
  const elle = new THREE.EllipseCurve(0,0, 2.2, 1.1, 0, Math.PI*2, false, 0);
  const numShrooms = feet.density.value;
  const basePointsOnXY = elle.getPoints(numShrooms)
  //MUSHROOMS!
  for (let i = 0; i < numShrooms; i++) {
    
    //cap
    const capWidth = feet.map(fxrand(), 0, 1, 0.3, 0.75);
    const f = new MushroomCap(capWidth, feet.map(fxrand(), 0, 1, feet.size.smallValue, feet.size.bigValue)).fungualBufferGeometry;
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

  //diarama -- needed to not draw clear background
  const boxer = new THREE.BoxBufferGeometry(9,4,5.2);
  //flip normals
  boxer.applyMatrix4(new THREE.Matrix4().makeScale(-1,1,1));
  const boxMesh = new THREE.Mesh(boxer, m);
  boxMesh.position.set(0,1,0)
  scene.add(boxMesh);

  //render the first frame
  render();

  //populate the image source with the data url 
  imageElement.src = document.getElementById('hashish').toDataURL();
  //once the image loads, generate the ssssterogram
  imageElement.onload = () => {
    //console.log("image load event");

    //start p5
    let myp5 = new p5(s);

    //generate the stereogram - populates the magicHashish 
    magicDust();
    //download();
    document.body.removeChild(imageElement);

    //set the p5 magicImage source from the magicHashish canvas
    magicImage = globalSK.loadImage(document.getElementById('magicHashish').toDataURL(), () => {
      //p5 should now be drawing the stereogram image -- call preview
      fxpreview();
      //download();
    });
    magicImage.loadPixels();

    //hide the magicHashish canvas
    document.body.removeChild(magicCanvas);
  }
  //hide the threejs canvas
  document.body.removeChild( renderer.domElement );
}

//3) snag the image from the stereogram canvas, and let p5js handle screen resize events.  This gets called from inside the bootstrap function
const s = ( sk ) => {

  //expand scope
  globalSK = sk;

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight);
    sk.imageMode(sk.CENTER);
    sk.drawingContext.shadowColor = 'rgba(33,33,33, 0.33)';
    sk.drawingContext.shadowBlur = 20;
  }

  sk.draw = () => {
    sk.background(235, 213, 179);
    //if the height is less than the width * (magicHeight/magicWidth), then height should drive.  otherwise width drives
    if (window.innerHeight < window.innerWidth * (magicHeight/magicWidth)) {
      sk.image(magicImage, window.innerWidth/2, window.innerHeight*0.48, (window.innerHeight * 0.85) * (magicWidth/magicHeight), (window.innerHeight * 0.85))
    } else {
      sk.image(magicImage, window.innerWidth/2, window.innerHeight*0.48, (window.innerWidth * 0.85), (window.innerWidth * 0.85) * (magicHeight/magicWidth))
    }
    //sk.noLoop()
  }

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    //sk.loop()
  }
};


//4) start p5, then run the bootstrapper.  Once the image is ready, p5 will draw it 
//let myp5 = new p5(s);
bootstrapMagicMushroomStereogram();



//threejs animate loop function - remains here along with orbitcontrols for dev and debugging
function animate() {
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  requestAnimationFrame( animate );
  render();

}

//threejs render function - only called once to generate depthmap image
function render() {

  controls.update();
  renderer.render( scene, camera );

  //wait and see with this one...
  // if(loaded == false){
  //   loaded = true;
  // }

}

//download an image for review / debugging / feedback
function download() {
  var link = document.createElement('a');
  link.download = 'MagicMushroomsDepthMap.png';
  link.href = document.getElementById('depthImage').src
  link.click();
  var link2 = document.createElement('a');
  link2.download = 'MagicMushroomsRender.png';
  link2.href = document.getElementById('magicHashish').toDataURL()
  link2.click();
}

//generate stereogram image
function magicDust() {

  const imgMapper = new Stereogram.ImgDepthMapper(imageElement);
  const dm = imgMapper.generate(window.innerWidth, window.innerHeight);
  const colors = [feet.interpolateFn(0.05), feet.interpolateFn(0.25), feet.interpolateFn(0.5), feet.interpolateFn(0.75), feet.interpolateFn(0.95)];

  Stereogram.render({
    el: 'magicHashish', 
    colors: feet.color.inverted ? colors : colors.reverse(),
    depthMap: dm
  });
}
