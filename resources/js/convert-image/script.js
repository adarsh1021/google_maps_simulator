var mode = 'point'; // horizontal, vertical or point
var graph;
$(document).ready(function() {
    // To track mode change to update mode variable
    $('#id-mode-select').on('change', function(e) {
        mode = this.value;
    });

    $('#id-add-points').click(function() {
        points = points.concat(point_guides);
        // reset guides
        point_guides = [];
        horizontal_guides = [];
        vertical_guides = [];
    });

    $('#id-save-points').click(function() {
        graph = {};
        var points_map = {};

        for (var i = 0; i < points.length; i++) {
            graph[[points[i].x, points[i].y]] = {};

            points_map[points[i].x] = points[i].y;
        }

        // build adjacency list
        for (key in graph) {
            for (
                var xp = key[0] - 4, yp = key[1] - 4;
                xp <= key[0] + 4;
                xp++, yp++
            ) {
                console.log(xp + ' ' + yp);
                if (xp in points_map) graph[key][[xp, points_map[xp]]] = 1;
                y_key = getKeyByValue(graph, yp);
                if (y_key) graph[key][[y_key, yp]] = 1;
            }
        }
    });

    $('#id-set-scale').click(function() {
        SCALE = parseInt($('#id-scale-value').val());
    });
});

// https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
