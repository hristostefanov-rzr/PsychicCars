var canvas = document.getElementById("canv");
var c = canvas.getContext("2d");

window.onload = function() {
    start();
    setInterval(update, 10);
}


class Tile{
    constructor(starting_line){
        this.width = 50
        
        //this.is_left_turn = Math.random() > 0.5;
        this.is_left_turn = false;
        //this.degrees = Math.random() * 90;
        this.degrees = 45;
        this.staring_line = starting_line;
        //radius of the circle it basically determines how long the tile is
        this.radius = 50;
        this.outer_radius = this.radius + this.width;
        var starting_points = get_starting_points(this.is_left_turn, starting_line);
        var outer_starting_point = starting_points[0];
        var inner_starting_point = starting_points[1];
        this.inner_line_coordinates = Circle_to_cooridnate(this.is_left_turn, this.radius, 1000, this.degrees, starting_line.orientation, inner_starting_point);
        this.outer_line_coordinates = Circle_to_cooridnate(this.is_left_turn, this.outer_radius, 1000, this.degrees, starting_line.orientation, outer_starting_point);
        this.next_orientation = update_orientation(this.is_left_turn, starting_line.orientation, this.degrees);
        this.end_line = new Connection(this.inner_line_coordinates[this.inner_line_coordinates.length-1], this.outer_line_coordinates[this.outer_line_coordinates.length-1], this.next_orientation);
    }
    show(){
        for(var i = 0;i<this.inner_line_coordinates.length;i++){
            this.inner_line_coordinates[i].show()
        }
        for(var i = 0;i<this.outer_line_coordinates.length;i++){
            this.outer_line_coordinates[i].show()
        }
    }
    

}
class Point{
    constructor(x,y, color = 'black'){
        this.x = x;
        this.y = y;
        this.color = color
    }
    show(color = 'black'){
        c.fillStyle = color;
        c.fillRect(this.x, this.y, 1, 1);
    }
}
class Connection{
    constructor(point1, point2, orientation){
        this.point1 = point1;
        this.point2 = point2;
        this.orientation = orientation;
    }
}
function update_orientation(is_left_turn, orientation, degrees){
    var new_orientation = orientation;
    if(is_left_turn){
        new_orientation -= degrees;
    }else{
        new_orientation += degrees;
    }
    if(new_orientation > 360){
        new_orientation -= 360;
    }else if (new_orientation < 0){
        new_orientation += 360;
    }
    return new_orientation
}
function get_left_center(orientation, starting_point, radius){
    
    if(orientation >= 0 && orientation <= 90){
        var y = starting_point.y + Math.sin(orientation) * radius;
        var x = starting_point.x + Math.cos(orientation) * radius;
        var center = new Point(x, y);
    }else if(orientation > 90 && orientation <= 180){
        var y = starting_point.y + Math.sin(180 - orientation) * radius;
        var x = starting_point.x - Math.cos(180 - orientation) * radius;
        var center = new Point(x, y);
    }else if(orientation > 180 && orientation <= 270){
        var y = starting_point.y - Math.cos(270 - orientation) * radius;
        var x = starting_point.x - Math.sin(270 - orientation) * radius;
        var center = new Point(x, y);
    }else if(orientation > 270 && orientation <= 360){
        var y = starting_point.y - Math.cos(360 - orientation) * radius;
        var x = starting_point.x + Math.sin(360 - orientation) * radius;
        var center = new Point(x, y);
    }
    return center
}
function get_right_center(orientation, starting_point, radius){
    if(orientation >= 0 && orientation <= 90){
        var y = starting_point.y - Math.sin(orientation) * radius;
        var x = starting_point.x - Math.cos(orientation) * radius;
        var center = new Point(x, y);
    }else if(orientation > 90 && orientation <= 180){
        var y = starting_point.y - Math.sin(180 - orientation) * radius;
        var x = starting_point.x + Math.cos(180 - orientation) * radius;
        var center = new Point(x, y);
    }else if(orientation > 180 && orientation <= 270){
        var y = starting_point.y + Math.cos(270 - orientation) * radius;
        var x = starting_point.x + Math.sin(270 - orientation) * radius;
        var center = new Point(x, y);
    }else if(orientation > 270 && orientation <= 360){
        var y = starting_point.y + Math.cos(360 - orientation) * radius;
        var x = starting_point.x - Math.sin(360 - orientation) * radius;
        var center = new Point(x, y);
    }
    return center

}
//is_left, degree_turn, steps, starting point, orientation, radius
function Circle_to_cooridnate(is_left, radius, steps, degree_turn, orientation, starting_point){
    console.log(is_left, radius, steps, degree_turn, orientation, starting_point)
    var points = []
    var part_of_circle = degree_turn/360;
    var start_of_turn = orientation/360;
    console.log(start_of_turn, part_of_circle)
    if(is_left){
        //prints counter - clockwise = left turn
        var center = get_left_center(orientation, starting_point, radius);  
        var centerX = center.x;
        var centerY = center.y;
        //Math.floor(steps * start_of_turn);
        for (var i = 0; i < Math.floor(steps * (part_of_circle + start_of_turn)) ; i++) {
            var x = (centerX + radius * Math.cos(Math.PI - 2 * Math.PI * i / steps));
            var y = (centerY + radius * Math.sin(Math.PI - 2 * Math.PI * i / steps));
            points.push(new Point(x, y));
        }
    }else{
        //print counter clockwise = right turn
        var center = get_right_center(orientation, starting_point, radius);
        var centerX = center.x;
        var centerY = center.y;
        for (var i =0; i < Math.floor(steps * (part_of_circle + start_of_turn)) ; i++) {
            var x = (centerX + radius * Math.cos(2 * Math.PI * i / steps));
            var y = (centerY + radius * Math.sin(2 * Math.PI * i / steps));
            points.push(new Point(x, y));
        }
        
    } 
    return points
}
function find_left_and_right_point(starting_line){
    // return the point that is left on the screen in the left position
    // the other one in the right
    
    var point1 = starting_line.point1;
    var point2 = starting_line.point2;
    if(point1.x < point2.x){
        return [point1, point2]
        
    }else{
        return [point2, point1]
        
    }
}
function get_starting_points(is_left_turn, starting_line){
    //return outer point left and inner point right
    
    var points = find_left_and_right_point(starting_line);
    var left_point = points[0];
    var right_point = points[1];
    var score = 0;
    if(starting_line.orientation < 270 && starting_line.orientation > 90){
        score++;  
    }
    if(is_left_turn){
        score++;  
    }
    if(score == 1){
        return [left_point, right_point]
    }else{
        return [right_point, left_point]
    }
}
var orientation = 0;
var starting_line = new Connection(new Point(475,500), new Point(525,500), 0);
var start_tile = new Tile(starting_line);
console.log(start_tile.end_line);
var new_tile = new Tile(start_tile.end_line);


function start(){
    
}
function update() {
    //background
    c.fillStyle = 'lightblue';
    c.fillRect(0, 0, 1000, 1000);
    //platforms
    start_tile.show()
    new_tile.show()
}
