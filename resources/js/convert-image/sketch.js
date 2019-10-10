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
var IMG_URL = 'resources/images/manhattan.jpg';
var IMG_HEIGHT = 600; // 800
var IMG_WIDTH = 600;
var CANVAS_HEIGHT = IMG_HEIGHT;
var CANVAS_WIDTH = IMG_WIDTH;

var SCALE = 10;

var GUIDE_POINT_RADIUS = 10;
var POINT_RADIUS = GUIDE_POINT_RADIUS + 2;
var POINT_COLOR = 'rgb(0, 255, 0)';
var GUIDE_POINT_COLOR = 'magenta';

var points = []; // these are the permanent points
var horizontal_guides = []; // contains y coordinates
var vertical_guides = []; // contains x coordinates
var point_guides = [];

function setup() {
    var cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    cnv.mouseClicked(mouseClickedEvent); // To ignore mouse clicks outside canvas area
    img = loadImage(IMG_URL);
}

function mouseClickedEvent() {
    mouseX = Math.round(mouseX);
    mouseY = Math.round(mouseY);
    if (mode == 'point') {
        point_guides.push(createVector(mouseX, mouseY));
    } else if (mode == 'horizontal') {
        horizontal_guides.push(mouseY);
        addIntersectionPoints(mouseY);
    } else if (mode == 'vertical') {
        vertical_guides.push(mouseX);
        addIntersectionPoints(mouseX);
    }
}

function mouseOverEllipse() {
    POINT_COLOR = 'rgb(255, 0, 0)';
}

function draw() {
    frameRate(30); // set framerate to 30fps

    image(img, 0, 0, IMG_WIDTH, IMG_HEIGHT);

    // Draw grid
    stroke(128);
    for (var i = 0; i < IMG_WIDTH; i += SCALE) {
        line(0, i, IMG_WIDTH, i);
        line(i, 0, i, IMG_HEIGHT);
    }

    // Draw all points
    stroke(0);
    fill(color(POINT_COLOR));
    for (var i = 0; i < points.length; i++) {
        var el = ellipse(points[i].x, points[i].y, POINT_RADIUS, POINT_RADIUS);
        el.mouseOver(mouseOverEllipse);
    }

    // Draw cross reference lines
    // stroke(50);
    // line(mouseX, 0, mouseX, IMG_HEIGHT);
    // line(0, mouseY, IMG_WIDTH, mouseY);

    // Draw all guides
    // 1. Point Guides
    noStroke();
    fill(color(GUIDE_POINT_COLOR));
    for (var i = 0; i < point_guides.length; i++)
        ellipse(
            point_guides[i].x,
            point_guides[i].y,
            GUIDE_POINT_RADIUS,
            GUIDE_POINT_RADIUS
        );
    // 2. Horizontal Guides
    stroke(color('magenta'));
    for (var i = 0; i < horizontal_guides.length; i++)
        line(0, horizontal_guides[i], IMG_WIDTH, horizontal_guides[i]);
    // 3. Vertical Guides
    for (var i = 0; i < vertical_guides.length; i++)
        line(vertical_guides[i], 0, vertical_guides[i], IMG_HEIGHT);
}

// Helper Functions
function addIntersectionPoints(coordinate) {
    if (mode == 'horizontal')
        for (var i = 0; i < vertical_guides.length; i++)
            point_guides.push(createVector(vertical_guides[i], coordinate));
    else
        for (var i = 0; i < horizontal_guides.length; i++)
            point_guides.push(createVector(coordinate, horizontal_guides[i]));
}
