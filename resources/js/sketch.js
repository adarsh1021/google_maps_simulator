var points = [];
var lineX = []; // contains y coordinates
var lineY = []; // contains x coordinates

var state = 'drawX';

function setup() {
    createCanvas(800, 800);
    img = loadImage('manhattan.jpg');
}

function mousePressed() {
    points.push(createVector(mouseX, mouseY));

    if (state == 'drawX') {
        lineX.push(mouseY);
    }
}

function draw() {
    frameRate(30);

    image(img, 0, 0, 800, 800);

    if (state == 'drawX') drawX();

    stroke(0);
    line(mouseX, 0, mouseX, 800);
    line(0, mouseY, 800, mouseY);
    fill(color('magenta'));
    noStroke();
    for (var i = 0; i < points.length; i++)
        ellipse(points[i].x, points[i].y, 10, 10);
}

function drawX() {
    for (var i = 0; i < lineX.length; i++) {
        stroke(color('magenta'));
        line(0, lineX[i], 800, lineX[i]);
    }
}

/*
1. Enable to switch between horizontal, vertical and point mode
    - Horizontal mode draws horizontal guide lines
    - Vertical mode draws vertical guide lines
    - Point mode adds a point
2. Function to Save newly added points:
    - Takes the newly added intersections of horizontal lines, vertical lines and independent points and adds it to list of existing points.
3. Export
    - Gives all the saved points as an adjacency list / adjacency matrix so I can use it in my algorithms
*/
