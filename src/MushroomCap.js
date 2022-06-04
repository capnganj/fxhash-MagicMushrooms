import * as THREE from 'three';

class MushroomCap {
    constructor (width, height) {

        //driving dimensions - should be passed in
        this.capWidth = width;
        this.capHeight = height;

        //computed dimensions - we need these to draw curves
        this.gillsHeight = this.capHeight * 0.15;
        this.lipWidth = this.capWidth * 0.3;

        //curve objects
        this.capCurve = {};
        this.gillsCurve = {};

        //lathe geometry!
        this.fungualBufferGeometry = {};

        //call curve draw functions then build up the buffer
        this.drawCrvs();
        this.draw3dFungus();
    }

    drawCrvs() {
        //start from tippy top, move down to lip -- cap
        this.capCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(this.capWidth  - this.lipWidth, 0, 0),
            new THREE.Vector3(this.capWidth, 0, 0),
            new THREE.Vector3(this.capWidth, this.capHeight, 0),
            new THREE.Vector3(0.001, this.capHeight, 0),
        )

        //lip to step -- gils
        this.gillsCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0.001, -this.gillsHeight/2, 0),
            new THREE.Vector3(this.capWidth - this.lipWidth, -this.gillsHeight, 0),
            new THREE.Vector3(this.capWidth - this.lipWidth, 0, 0),
        )
    }

    draw3dFungus() {
        //lathe geometry needs an array of points - we get these from the curves
        const capPts = this.capCurve.getPoints(50);
        const gillsPts = this.gillsCurve.getPoints(50);
        const allPts = capPts.concat(gillsPts);

        //lather
        this.fungualBufferGeometry = new THREE.LatheBufferGeometry(allPts, 100);
    }
}

export { MushroomCap };