$(document).ready(function() {});

function getPointsLine(start, end) {
    // start = 45_22, end = 12_ 66
    var arr = start.split('_').concat(end.split('_'));
    var bias = SCALE / 2;
    var points = arr.map(function(item) {
        return parseInt(item) + bias;
    });
    return points;
}
