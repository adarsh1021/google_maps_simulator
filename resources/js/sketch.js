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

var graph = {};
var plot = [];

// var prev = plot[0];
// var curr;
// var step = Infinity;

var currNodeIdx = Infinity;

var currentSelection = false;
var startNode = false;
var endNode = false;
function setup() {
    var cnv = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    cnv.mouseClicked(mouseClickedEvent); // To ignore mouse clicks outside canvas area
    img = loadImage(IMG_URL);

    jQuery.getJSON('adj_list.json').then(function(data) {
        graph = data;
    });

    // graph = {
    //     S: { A: 5, B: 2 },
    //     A: { C: 4, D: 2 },
    //     B: { A: 8, D: 7 },
    //     C: { D: 6, F: 3 },
    //     D: { F: 1 },
    //     F: {}
    // };
}

function mouseClickedEvent() {
    mouseX = Math.round(mouseX);
    mouseY = Math.round(mouseY);

    var curr = `${mouseX - (mouseX % 10)}_${mouseY - (mouseY % 10)}`;
    if (startNode) {
        if (graph[curr]) endNode = curr;
    } else {
        if (graph[curr]) startNode = curr;
    }

    if (startNode && endNode) {
        plot = dijkstra(startNode, endNode);
        currNodeIdx = 1;
        // prev = plot[0];
        // step = 1;
    }
}

function draw() {
    frameRate(8); // set framerate to 30fps

    image(img, 0, 0, IMG_WIDTH, IMG_HEIGHT);

    // draw adj list
    stroke(255, 0, 0);
    strokeWeight(2);
    for (var i in graph) {
        for (var j in graph[i]) {
            var p = getPointsLine(i, j);
            line(p[0], p[1], p[2], p[3]);
        }
    }

    // draw ans plot
    strokeWeight(4);
    if (currNodeIdx < plot.length) {
        stroke(0, 255, 0);
        for (var currIdx = 1; currIdx <= currNodeIdx; currIdx += 1) {
            for (var adjNode in graph[plot[currIdx - 1]]) {
                stroke(0, 255, 0);
                var q = getPointsLine(plot[currIdx - 1], adjNode);
                line(q[0], q[1], q[2], q[3]);
            }
        }
        stroke(0, 0, 255);
        for (var currIdx = 1; currIdx <= currNodeIdx; currIdx += 1) {
            var p = getPointsLine(plot[currIdx - 1], plot[currIdx]);
            line(p[0], p[1], p[2], p[3]);
        }

        // for (var j = 1; j < plot.length; j++) {
        // var curr = plot[step];
        // var p = getPointsLine(prev, curr);
        // line(p[0], p[1], p[2], p[3]);
        // for (let n in graph[curr]) {
        //     var q = getPointsLine(curr, n);
        //     stroke(0, 255, 0);
        //     line(q[0], q[1], q[2], q[3]);
        // }
        // prev = curr;
        // step += 1;
        // }
        if (currNodeIdx != plot.length - 1) currNodeIdx += 1;
    }

    // display graph nodes
    // fill(color('red'));
    // noStroke();
    // for (let node in graph) {
    //     var point = node.split('_').map(function(item) {
    //         return parseInt(item);
    //     });
    //     rect(point[0], point[1], SCALE, SCALE);
    // }

    currentSelection = `${mouseX - (mouseX % 10)}_${mouseY - (mouseY % 10)}`;
    if (graph[currentSelection]) {
        fill(color('blue'));
        var point = currentSelection.split('_').map(function(item) {
            return parseInt(item);
        });
        rect(point[0], point[1], SCALE + 2, SCALE + 2);
    }

    if (startNode) {
        fill(color('blue'));
        var point = startNode.split('_').map(function(item) {
            return parseInt(item);
        });
        rect(point[0], point[1], SCALE + 2, SCALE + 2);
    }
    if (endNode) {
        fill(color('rgb(0, 255, 0)'));
        var point = endNode.split('_').map(function(item) {
            return parseInt(item);
        });
        rect(point[0], point[1], SCALE + 2, SCALE + 2);
    }
}

// start = 12_23
function dijkstra(start, target) {
    var cost = {};
    var parents = {};
    var visited = [];

    // assign cost
    Object.keys(graph).forEach(function(node) {
        cost[node] = Infinity;
        visited[node] = false;
        // count += 1;
    });
    cost[start] = 0;
    visited[start] = true;

    var curr_node = start;

    var min_cost;
    var min_cost_node;
    var count = Object.keys(graph).length;

    // var traversing_states = [];

    while (count > 0) {
        //console.log(JSON.stringify(cost));
        for (let child in graph[curr_node]) {
            if (
                !visited[child] ||
                cost[child] > cost[curr_node] + graph[curr_node][child]
            ) {
                cost[child] = cost[curr_node] + graph[curr_node][child];
                parents[child] = curr_node;
            }
        }
        visited[curr_node] = true;
        // find lowest cost node
        min_cost = Infinity;
        for (let node in cost) {
            if (cost[node] < min_cost && !visited[node]) {
                min_cost = cost[node];
                min_cost_node = node;
            }
        }
        curr_node = min_cost_node;

        count -= 1;
    }
    // console.log(cost);
    // console.log(parents);

    var optimalPath = [target];
    var parent = parents[target];

    while (parent) {
        optimalPath.push(parent);
        parent = parents[parent];
    }
    optimalPath.reverse();
    return optimalPath;
}
