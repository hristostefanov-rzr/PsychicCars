var canvas = document.getElementById("canv");
var c = canvas.getContext("2d");

class Tile{
    constructor(starting_line){
        this.width = 50;
        this.is_left_turn = Math.random() > 0.5;
        this.degrees = Math.random() * 90;
        this.staring_line = None;
        this.end_line = None;
    }
    constructor(previous_tile){
        this.width = 50;
        this.is_left_turn = Math.random() > 0.5;
        this.degrees = Math.random() * 90;
        this.starting_line = previous_tile.end_line;
        this.end_line = None;
    }
}
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

function Circle_to_cooridnate(radius, steps, degree_turn, centerX, centerY){
    var points = []
    var part_of_circle = degree_turn/360;
    for (var i = 1; i < steps * part_of_circle; i++) {
        var x = (centerX + radius * Math.cos(2 * Math.PI * i / steps));
        var y = (centerY + radius * Math.sin(2 * Math.PI * i / steps));
        points.push(new Point(x, y));
   }
   return points
}
