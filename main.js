const MAX_DEPTH = 255;
const maxCanvasW = 800;
const maxCanvasH = 800;

// Config variables default values
let noiseInc = 0.05;
let deltaAngle = 0.1;

let noiseRectW = maxCanvasW * 3 / 8;
let perlW = noiseRectW / 2;
let randW = noiseRectW / 4;

let randXStart = noiseRectW / 2 - randW / 2;
let randXEnd = noiseRectW / 2 + randW / 2;
let perlXStart = noiseRectW / 2 - perlW / 2;
let perlXEnd = noiseRectW / 2 + perlW / 2;

let yOff = 0;
let off = 0;
let a = 0;
let noiseRect;

let canvas;
let displayString;

function randRange(minVal, maxVal) {
    return fxrand() * (maxVal - minVal) + minVal;
}

function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function windowResized() {
    let currentW = Math.min(maxCanvasW, windowWidth);
    let currentH = Math.min(maxCanvasH, windowHeight);
    resizeCanvas(currentW, currentH);

    centerCanvas();
}

function setup() {
    // Init the canvas, center and resize it
    canvas = createCanvas(maxCanvasW, maxCanvasH);
    canvas.style('display', 'block');
    centerCanvas();  

    pixelDensity(1);
    noiseDetail(8);

    noiseRect = new createImage(noiseRectW, noiseRectW);

    noiseInc = randRange(0.01, 0.1);
    deltaAngle = randRange(0.01, 0.03);
    displayString = "N " + noiseInc.toFixed(2) + "   A " + deltaAngle.toFixed(2);
}

function draw() {
    drawingContext.shadowOffsetX = 20;
    drawingContext.shadowOffsetY = 20;
    drawingContext.shadowBlur = 35;
    drawingContext.shadowColor = 'grey';
    background(245, 245, 235);

    a = (a + deltaAngle) % TWO_PI;
    let factor = map(cos(a), -1, 1, 0, 0.5);

    rxs = randXStart - round(randW  * factor);
    rxe = randXEnd + round(randW * factor);

    pxs = perlXStart - round(perlW  * factor/2);
    pxe = perlXEnd + round(perlW * factor/2);

    noiseRect.loadPixels();
    for (let y = 0; y < noiseRectW; y++) {
        let xOff = 0;
        for (let x = 0; x < noiseRectW; x++) {
            let index = (y * noiseRectW + x) * 4;
            let colVal = 0;

            if ((x > rxs) && (x < rxe) &&
            (y > rxs) && (y < rxe)) {
                colVal = random () * MAX_DEPTH;
            } else if ((x > pxs) && (x < pxe) &&
            (y > pxs) && (y < pxe)) {
                colVal = noise(off) * MAX_DEPTH;        
            } else {
                colVal = noise(xOff, yOff) * MAX_DEPTH;       
            }

            noiseRect.pixels[index + 0] = colVal;
            noiseRect.pixels[index + 1] = colVal;
            noiseRect.pixels[index + 2] = colVal;
            noiseRect.pixels[index + 3] = MAX_DEPTH;

            xOff += noiseInc;
            off += noiseInc;
        }
        yOff += noiseInc;
    }

    // Update Boarders
    noiseRect.updatePixels();

    image(noiseRect, width/2 - noiseRect.width/2, height/2 - noiseRect.height/2, noiseRect.width, noiseRect.height, 0, 0);

    // Print the generative parameters at bottom rigth of the canvas
    textAlign(RIGHT);
    textStyle(ITALIC);
    textFont("monospace");
    fill(0, 0, 0, 120);
    text(displayString, width - 10, height - 10);
}