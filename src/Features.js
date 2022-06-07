import { interpolateYlOrRd, interpolateInferno, interpolateMagma, interpolatePuBuGn, interpolatePlasma, interpolateRdPu, interpolateViridis, interpolateCividis, interpolateYlGnBu, interpolateYlGn, interpolateYlOrBr } from 'd3-scale-chromatic'
import { rgb, hsl, color } from 'd3-color';

class Features {
    constructor() {

        //color palette 
        this.color = {
            name: "",
            background: {},
            cero: {},
            uno: {},
            dos: {},
            tres: {},
            quatro: {},
            cinco: {},
            sies:{},
            siete: {}
        };
        this.setColorPalette();
        this.setColors();

        //scale of vertex wigglers
        this.scale = {
            tag: "",
            value: 0.0,
            dispValue: 0.0
        }
        this.setScale();

        //drives how fast the wiggle and wave speeds roll
        this.speed = {
            tag: "",
            vertexValue: 1.0,
            fragmentValue: 1.0
        }
        this.setSpeed();

        //drives bubble density in the textures generation
        this.density = {
            tag: "",
            value: 0
        }
        this.setDensity();
    }

    //map function logic from processing <3
    map(n, start1, stop1, start2, stop2) {
        const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        return newval;
    }

    //color palette interpolation
    interpolateFn(val) {
        let col;
        switch (this.color.name) {
            case "Ylorrd": 
                col = rgb(interpolateYlOrRd(1-val)).formatHex();
                break
            case "Rdpu": 
                col = rgb(interpolateRdPu(1-val)).formatHex();
                break;
            case "Viridis": 
                col = rgb(interpolateViridis(val)).formatHex();
                break;
            case "Magma": 
                col = rgb(interpolateMagma(val)).formatHex();
                break;
            case "Inferno": 
                col = rgb(interpolateInferno(val)).formatHex();
                break;
            case "Plasma": 
                col = rgb(interpolatePlasma(val)).formatHex();
                break;
            case "Cividis": 
                col = rgb(interpolateCividis(val)).formatHex();
                break;
            case "Ylgn":
                col = rgb(interpolateYlGn(1-val)).formatHex();
                break;
            case "Ylgnbu":
                col = rgb(interpolateYlGnBu(1-val)).formatHex();
                break;
            case "Pubugn":
                col = rgb(interpolatePuBuGn(1-val)).formatHex();
                break;
            case "Ylorbr":
                col = rgb(interpolateYlOrBr(1-val)).formatHex();
                break;
            default:
                col = rgb(interpolateMagma(val)).formatHex();
        }

        if (this.color.inverted) {
            col = this.invertColor(col) 
        }

        return col;
    }

    //color inverter
    invertColor(rgb, bw) {
        let hex = color(rgb).formatHex()
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        if (bw) {
            // https://stackoverflow.com/a/3943023/112731
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
        // invert color components
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
        // pad each with zeros and return
        let inverted = color("#" + padZero(r) + padZero(g) + padZero(b)).rgb().formatHex();
        return inverted;

        function padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }
    }

    //desaturate by some %
    desaturateColor(col, percent) {
        //let h = hsl(col);
        //h -= percent;
        return col.darker(percent);
    }

    //set color palette globally
    setColorPalette() {
        let c = fxrand();

        //set palette

        
        if (c < 0.07) { //1
            this.color.name = "Ylorrd"
        }
        else if (c < 0.14) { //2
            this.color.name = "Rdpu"
        }
        else if (c < 0.21) { //3
            this.color.name = "Ylgn"
        }
        else if (c < 0.28) {  //4
            this.color.name = "Pubugn"
        }
        else if (c < 0.35) { //5
            this.color.name = "Ylgnbu"
        }
        else if (c < 0.44) { //6
            this.color.name = "Viridis" 
        }
        else if (c < 0.55) {  //7
            this.color.name = "Inferno" 
        }
        else if (c < 0.66) {  //8
            this.color.name = "Plasma" 
        }
        else if (c < 0.77) {  //9
            this.color.name = "Cividis" 
        }
        else if (c < 0.88) {  //11
            this.color.name = "Ylorbr" 
        }
        //...
        else {  //11
            this.color.name = "Magma"  
        }

        //inverted?
        if( fxrand() > 0.777 ) {
            this.color.inverted = true;
        }
    }

    //set individual colors for background and shader
    setColors() {
        this.color.background = this.interpolateFn(this.map(fxrand(), 0, 1, 0.2, 0.8));
        this.color.cero = this.interpolateFn(this.map(fxrand(), 0, 1, 0, 0.125));
        this.color.uno = this.interpolateFn(this.map(fxrand(), 0, 1, 0, 0.25));
        this.color.dos = this.interpolateFn(this.map(fxrand(), 0, 1, 0.25, 0.375));
        this.color.tres = this.interpolateFn(this.map(fxrand(), 0, 1, 0.25, 0.5));
        this.color.quatro = this.interpolateFn(this.map(fxrand(), 0, 1, 0.5, 0.625));
        this.color.cinco = this.interpolateFn(this.map(fxrand(), 0, 1, 0.5, 0.75));
        this.color.sies = this.interpolateFn(this.map(fxrand(), 0, 1, 0.75, 0.875));
        this.color.siete = this.interpolateFn(this.map(fxrand(), 0, 1, 0.75, 1));

        //invert 33%
        if (fxrand() > 10) {
            this.color.background = this.invertColor(this.color.background);
            this.color.cero = this.invertColor(this.color.cero);
            this.color.uno = this.invertColor(this.color.uno);
            this.color.dos = this.invertColor(this.color.dos);
            this.color.tres = this.invertColor(this.color.tres);
            this.color.quatro = this.invertColor(this.color.quatro);
            this.color.cinco = this.invertColor(this.color.cinco);
            this.color.sies = this.invertColor(this.color.sies);
            this.color.siete = this.invertColor(this.color.siete);
            this.color.name += " Invert";
        }
    }

    //set bump and texture scale
    setScale() {
        let s = fxrand();
        if (s < 0.23) {
            this.scale.tag = "Smooth";
        }
        else if (s < 0.57) {
            this.scale.tag = "Low";
        }
        else {
            this.scale.tag = "High";
        }
        this.scale.value = this.map(s, 0, 1, 1.0, 3.0);
        this.scale.dispValue = this.map(s, 0, 1, 0.125, 0.25);
    }

    //set vertex and fragment speeds
    setSpeed(){
        let s = fxrand();
        if (s < 0.44) {
            this.speed.tag = "Slow";
        }
        else if (s < 0.61) {
            this.speed.tag = "Steady";
        }
        else if (s < 0.88) {
            this.speed.tag = "Fast";
        }
        else{
            this.speed.tag = "Zippy"
        }
        this.speed.vertexValue = this.map(s, 0, 1, 0.25, 0.75);
        this.speed.fragmentValue = this.map(s, 0, 1, 0.25, 1.75);
    }

    //set texture density
    setDensity(){
        let d = fxrand();
        if (d < 0.33) {
            this.density.tag = "Sparse";
        }
        else if (d < 0.55) {
            this.density.tag = "Even";
        }
        else if (d < 0.88) {
            this.density.tag = "Dense";
        }
        else{
            this.density.tag = "Packed"
        }
        this.density.value = parseInt(this.map(d, 0, 1, 10, 100));
    }
}

export { Features }