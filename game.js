var canvas = document.getElementById("canv");
var c = canvas.getContext("2d");

window.onload = function() {
    start();
    setInterval(update, 10);
}


class Tile{
    constructor(starting_line){
        this.width = starting_line.width
        this.is_left_turn = Math.random() > 0.5;
        //this.is_left_turn =true;
        this.degrees = Math.random() * 90;
        //this.degrees = 30;
        this.staring_line = starting_line;
        //radius of the circle it basically determines how long the tile is
        //this.radius = 50;
        this.radius = Math.random() * 90
        //this.outer_radius = this.radius + this.width;
        this.turn_points = Generate_turn(this.is_left_turn, this.radius, 1000, starting_line, this.degrees, starting_line.orientation)
        this.next_orientation = update_orientation(this.is_left_turn, starting_line.orientation, this.degrees);
        this.end_line = new Connection(this.turn_points[0][this.turn_points[0].length-1], this.turn_points[1][this.turn_points[1].length-1], this.next_orientation);
    }
    show(color = 'black'){

        for(var i = 0;i<this.turn_points[0].length;i++){
            this.turn_points[0][i].show(color)
        }
        for(var i = 0;i<this.turn_points[1].length;i++){
            this.turn_points[1][i].show(color)
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
        this.width = ((point1.x - point2.x) ** 2 + (point1.y - point2.y)**2)**(1/2);
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
function get_deltas(outer_point, inner_point, radius, width){
    // delta x and y are the difference between the points of the turn
    // delta m and n are the difference betweem the inner point and the center
    var delta_x = Math.abs(outer_point.x - inner_point.x)
    var delta_y = Math.abs(outer_point.y - inner_point.y)
    var delta_nx = (delta_x * radius)/width
    var delta_my = (delta_y * radius)/width
    return [delta_nx, delta_my]
}
function get_left_center(outer_point, inner_point, radius, width, orientation){
    var deltas = get_deltas(outer_point, inner_point, radius, width);
    var delta_nx = deltas[0]
    var delta_my = deltas[1]
    
    if(orientation >=0 && orientation < 90){
        var center = new Point(inner_point.x + delta_nx, inner_point.y + delta_my);
    }else if(orientation >= 90 && orientation < 180){
        var center = new Point(inner_point.x - delta_nx, inner_point.y + delta_my);
    }else if(orientation >= 180 && orientation < 270){
        var center = new Point(inner_point.x - delta_nx, inner_point.y - delta_my);
    }else if(orientation >= 270 && orientation < 360){
        var center = new Point(inner_point.x + delta_nx, inner_point.y - delta_my);
    }
    return center
}
function get_right_center(outer_point, inner_point, radius, width, orientation){
    var deltas = get_deltas(outer_point, inner_point, radius, width);
    var delta_nx = deltas[0]
    var delta_my = deltas[1]
    var orientation = orientation
    if(orientation >=0 && orientation< 90){
        var center = new Point(inner_point.x - delta_nx, inner_point.y - delta_my);
    }else if(orientation >= 90 && orientation < 180){
        var center = new Point(inner_point.x + delta_nx, inner_point.y - delta_my);
    }else if(orientation >= 180 && orientation < 270){
        var center = new Point(inner_point.x + delta_nx, inner_point.y + delta_my);
    }else if(orientation >= 270 && orientation < 360){
        var center = new Point(inner_point.x - delta_nx, inner_point.y + delta_my);
    }
    return center
}
function Turn_to_coordinates(is_left, radius, steps, degree_turn, orientation, starting_line){
    var inner_points = [];
    var outer_points = [];
    if(is_left){
        var points = Generate_left_turn(radius, steps, starting_line, degree_turn, orientation);
        var outer_points = points[0];
        var inner_points = points[1];
    }else{
        var points = Generate_right_turn(radius, steps, starting_line, degree_turn, orientation);
        var outer_points = points[0];
        var inner_points = points[1];
    }
    return inner_points, outer_points
}
function Generate_left_turn(radius, steps, starting_line, degree_turn, orientation){
    var start_of_range = steps *(360 - orientation)/360;
    console.log(start_of_range);
    var end_of_range = steps * ((360 - orientation) + degree_turn)/360;
    var width = starting_line.width;
    var point_duos = get_left_duos(starting_line, orientation);
    var inner_point = point_duos[1] 
    var outer_point = point_duos[0] 
    var center = get_left_center(outer_point, inner_point, radius, width, orientation);
    var outer_points = counter_clockwise_circle_to_cooridnate(radius + width, center, start_of_range, end_of_range, steps);
    var inner_points = counter_clockwise_circle_to_cooridnate(radius, center, start_of_range, end_of_range, steps);
    return [outer_points, inner_points]
}
function Generate_right_turn(radius, steps, starting_line, degree_turn, orientation){
    var start_of_range = steps * orientation/360;

    var end_of_range = steps * (orientation + degree_turn)/360;
    var width = starting_line.width;
    var point_duos = get_right_duos(starting_line, orientation);
    var inner_point = point_duos[1] 
    var outer_point = point_duos[0] 
    var center = get_right_center(outer_point, inner_point, radius, width, orientation);
    var outer_points = clockwise_circle_to_cooridnate(radius + width, center, start_of_range, end_of_range, steps);
    var inner_points = clockwise_circle_to_cooridnate(radius, center, start_of_range, end_of_range, steps);
    return [outer_points, inner_points]
}
function Generate_turn(is_left, radius, steps, starting_line, degree_turn, orientation){  
    if(is_left){
        var turn_points = Generate_left_turn(radius, steps, starting_line, degree_turn, orientation);
    }else{
        var turn_points = Generate_right_turn(radius, steps, starting_line, degree_turn, orientation);
    }
    return turn_points
}
function counter_clockwise_circle_to_cooridnate(radius, center, start_of_range, end_of_range, steps){
    var centerX = center.x;
    var centerY = center.y;
    var points = []
    for (var i = start_of_range; i < end_of_range; i++) {
        var x = (centerX + radius * Math.cos(Math.PI-2 * Math.PI * i / steps));
        var y = (centerY + radius * Math.sin(Math.PI-2 * Math.PI * i / steps));
        var point = new Point(x,y);
        points.push(point);
    }
    return points
}
function clockwise_circle_to_cooridnate(radius, center, start_of_range, end_of_range, steps){
    var centerX = center.x;
    var centerY = center.y;
    var points = []
    for (var i = start_of_range; i < end_of_range; i++) {
        var x= (centerX + radius * Math.cos(2 * Math.PI * i / steps));
        var y = (centerY + radius * Math.sin(2 * Math.PI * i / steps));
        var point = new Point(x, y);
        points.push(point);
    }
    return points
}
//is_left, degree_turn, steps, starting point, orientation, radius


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
function get_left_duos(starting_line, orientation){
    var points = find_left_and_right_point(starting_line);
    var left_point = points[0];
    var right_point = points[1];
    if(orientation >= 0 && orientation < 90){
        var inner_point = right_point;
        var outer_point = left_point;
    }else if(orientation >=90 && orientation <180){
        var inner_point = left_point;
        var outer_point = right_point;
    }else if(orientation >= 180 && orientation < 270){
        var inner_point = left_point;
        var outer_point = right_point;
    }else{
        var inner_point = right_point;
        var outer_point = left_point
    }
    return [outer_point, inner_point]

}
function get_right_duos(starting_line, orientation){
    var points = find_left_and_right_point(starting_line);
    var left_point = points[0];
    var right_point = points[1];
    var orientation = orientation;
    if(orientation >= 0 && orientation <= 90){
        var inner_point = left_point;
        var outer_point = right_point;
    
    }else if(orientation >90 && orientation <180){
        console.log(orientation);
        var inner_point = right_point;
        var outer_point = left_point;
    }else if(orientation >= 180 && orientation < 270){
        var inner_point = right_point;
        var outer_point = left_point;
    }else{
        var inner_point = left_point;
        var outer_point = right_point
    }
    return [outer_point, inner_point]
}
var orientation = 0;
var starting_line = new Connection(new Point(475, 500), new Point(525,500), 0);
var tiles = []
var current_line = starting_line;
for(i = 0;i<20;i++){
    var new_tile = new Tile(current_line)
    tiles.push(new_tile);
    current_line = new_tile.end_line; 
}
function start(){
    
}
function update() {
    //background
    c.fillStyle = 'lightblue';
    c.fillRect(0, 0, 1000, 1000);
    //turn
    for(i = 0;i < tiles.length;i++){
        tiles[i].show();
    }
}
