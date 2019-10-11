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

var CURR_POS;

// are the following needed ?
var GUIDE_POINT_RADIUS = 10;
var POINT_RADIUS = GUIDE_POINT_RADIUS + 2;
var POINT_COLOR = 'rgb(0, 255, 0)';
var GUIDE_POINT_COLOR = 'magenta';

var points = []; // these are the permanent points
// var horizontal_guides = []; // contains y coordinates
// var vertical_guides = []; // contains x coordinates
// var point_guides = [];

var adj = {};
var selected;

function setup() {
    var cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    cnv.mouseClicked(mouseClickedEvent); // To ignore mouse clicks outside canvas area
    img = loadImage(IMG_URL);
    CURR_POS = createVector(0, 0);
}

function mouseClickedEvent() {
    mouseX = Math.round(mouseX);
    mouseY = Math.round(mouseY);
    // if (mode == 'point') {
    //     point_guides.push(createVector(mouseX, mouseY));
    // } else if (mode == 'horizontal') {
    //     horizontal_guides.push(mouseY);
    //     addIntersectionPoints(mouseY);
    // } else if (mode == 'vertical') {
    //     vertical_guides.push(mouseX);
    //     addIntersectionPoints(mouseX);
    // }
}

function mouseOverEllipse() {
    POINT_COLOR = 'rgb(255, 0, 0)';
}

function draw() {
    frameRate(30); // set framerate to 30fps

    image(img, 0, 0, IMG_WIDTH, IMG_HEIGHT);

    // Draw grid
    stroke(128);
    strokeWeight(1);
    for (var i = 0; i < IMG_WIDTH; i += SCALE) {
        line(0, i, IMG_WIDTH, i);
        line(i, 0, i, IMG_HEIGHT);
    }

    // Draw adjacency matrix points
    stroke(255, 0, 0);
    strokeWeight(4);
    for (var i in adj) {
        for (var j in adj[i]) {
            var arr = i.split('_').concat(j.split('_'));
            var b = SCALE / 2;
            var p = arr.map(function(item) {
                return parseInt(item) + b;
            });
            line(p[0], p[1], p[2], p[3]);
        }
    }

    noStroke();
    var fill_color = 'yellow';
    if (mode == 'select') {
        // fill_color = 'red';
        fill(color('red'));
        rect(selected.x, selected.y, SCALE, SCALE);
    }
    // else if (mode == 'link') fill_color = 'green';
    // else if (mode == 'free') fill_color = 'yellow';
    fill(color(fill_color));
    rect(CURR_POS.x, CURR_POS.y, SCALE, SCALE);

    // Draw all points
    // stroke(0);
    // fill(color(POINT_COLOR));
    // for (var i = 0; i < points.length; i++) {
    //     var el = ellipse(points[i].x, points[i].y, POINT_RADIUS, POINT_RADIUS);
    //     el.mouseOver(mouseOverEllipse);
    // }

    // Draw cross reference lines
    // stroke(50);
    // line(mouseX, 0, mouseX, IMG_HEIGHT);
    // line(0, mouseY, IMG_WIDTH, mouseY);

    // Draw all guides
    // 1. Point Guides
    /*
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
        line(vertical_guides[i], 0, vertical_guides[i], IMG_HEIGHT);*/
}

function keyPressed() {
    if (key == 'D') CURR_POS.x += SCALE;
    else if (key == 'A') CURR_POS.x -= SCALE;
    else if (key == 'S') CURR_POS.y += SCALE;
    else if (key == 'W') CURR_POS.y -= SCALE;

    if (CURR_POS.x < 0) CURR_POS.x = 0;
    if (CURR_POS.x >= IMG_WIDTH - 1) CURR_POS.x = IMG_WIDTH - 1;
    if (CURR_POS.y < 0) CURR_POS.y = 0;
    if (CURR_POS.y >= IMG_HEIGHT - 1) CURR_POS.y = IMG_HEIGHT - 1;

    if (key == 'Q') {
        mode = 'select';
        selected = CURR_POS.copy();
        if (!(`${selected.x}_${selected.y}` in adj))
            adj[`${selected.x}_${selected.y}`] = {};
    }
    if (key == 'E') {
        mode = 'link';

        var weight = selected.dist(CURR_POS);
        adj[`${selected.x}_${selected.y}`][
            `${CURR_POS.x}_${CURR_POS.y}`
        ] = weight;
        // biderectional link
        if (!(`${CURR_POS.x}_${CURR_POS.y}` in adj))
            adj[`${CURR_POS.x}_${CURR_POS.y}`] = {};
        adj[`${CURR_POS.x}_${CURR_POS.y}`][
            `${selected.x}_${selected.y}`
        ] = weight;
    }
    if (key == 'R') mode = 'free';
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
