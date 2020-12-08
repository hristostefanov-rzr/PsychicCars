var canvas = document.getElementById("canv");
var c = canvas.getContext("2d");

window.onload = function() {
    start();
    setInterval(update, 10);
}


class Tile{
    constructor(starting_line){
        this.width = starting_line.width
        this.is_straight = Math.random() > 0.6;
        //this.is_straight = false;
        if(this.is_straight){
            this.length = Math.random() * 20 + 30;
            this.turn_points = Generate_Straight(this.length, starting_line, starting_line.orientation, 100);
            this.next_orientation = starting_line.orientation;
            this.end_line = new Connection(this.turn_points[0][this.turn_points[0].length-1], this.turn_points[1][this.turn_points[1].length-1], this.next_orientation);
        }else{
            this.is_left_turn = Math.random() > 0.5;
            this.degrees = Math.random() * 60+ 10;
            //this.degress = 10;
            this.staring_line = starting_line;
            this.radius = Math.random() * 120
            //this.radius = 200
            this.turn_points = Generate_turn(this.is_left_turn, this.radius, 1000, starting_line, this.degrees, starting_line.orientation)
            this.next_orientation = update_orientation(this.is_left_turn, starting_line.orientation, this.degrees);
            this.end_line = new Connection(this.turn_points[0][this.turn_points[0].length-1], this.turn_points[1][this.turn_points[1].length-1], this.next_orientation);
        }
        
    }
    show(color = 'black'){

        for(var i = 0;i < this.turn_points[0].length;i++){
            this.turn_points[0][i].show(color)
        }
        for(var i = 0;i < this.turn_points[1].length;i++){
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
function Generate_Straight(length, starting_line, orientation, steps){
    var starting_point = starting_line.point1;
    var radian_orientation = Math.PI * (orientation/180)
    if(orientation >=0 && orientation< 90){   
        var ending_x = starting_point.x - Math.sin(radian_orientation) * length;
        var ending_y = starting_point.y + Math.cos(radian_orientation) * length;
        var ending_point = new Point(ending_x, ending_y);
        var points = draw_points_on_line(steps, starting_point, ending_point);
        var migrated_points = migrate_points(starting_line.point1, starting_line.point2, points);
    }else if(orientation >= 90 && orientation < 180){
        var ending_x = starting_point.x - Math.sin(Math.PI - radian_orientation) * length;
        var ending_y = starting_point.y - Math.cos(Math.PI - radian_orientation) * length;
        var ending_point = new Point(ending_x, ending_y);
        var points = draw_points_on_line(steps, starting_point, ending_point);
        var migrated_points = migrate_points(starting_line.point1, starting_line.point2, points); 
    }else if(orientation >= 180 && orientation < 270){
        var ending_x = starting_point.x + Math.cos(3 * Math.PI/2 - radian_orientation) * length;
        var ending_y = starting_point.y - Math.sin(3 * Math.PI/2 - radian_orientation) * length;
        var ending_point = new Point(ending_x, ending_y);
        var points = draw_points_on_line(steps, starting_point, ending_point);
        var migrated_points = migrate_points(starting_line.point1, starting_line.point2, points);
    }else if(orientation >= 270 && orientation < 360){
        var ending_x = starting_point.x + Math.sin(2 * Math.PI - radian_orientation) * length;
        var ending_y = starting_point.y + Math.cos(2 * Math.PI - radian_orientation) * length;
        var ending_point = new Point(ending_x, ending_y);
        var points = draw_points_on_line(steps, starting_point, ending_point);
        var migrated_points = migrate_points(starting_line.point1, starting_line.point2, points);
    }
    return [points, migrated_points]
}
function draw_points_on_line(steps, starting_point, ending_point){
    var delta_x = ending_point.x - starting_point.x;
    var delta_y = ending_point.y - starting_point.y;
    var points = [];
    for(var i=0; i < steps ;i++){
        var partial_x = starting_point.x + delta_x * i/steps;
        var partial_y = starting_point.y + delta_y * i/steps;
        points.push(new Point(partial_x, partial_y));
    }
    return points
}
function migrate_points(point1, point2, points){
//change points that start from point1 to start from point2
    var delta_x = point2.x - point1.x;
    var delta_y = point2.y - point1.y;
    var migrated_points = [];
    for(var i =0;i<points.length;i++){
        var migrated_point = new Point(points[i].x + delta_x, points[i].y + delta_y);
        migrated_points.push(migrated_point);
    }
    return migrated_points
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
for(var i = 0;i < 50;i++){
    var new_tile = new Tile(current_line);
    tiles.push(new_tile);
    console.log(new_tile);
    console.log(i);
    current_line = new_tile.end_line; 
}
function start(){
    
}
function update() {

    c.fillStyle = "#7ec850";
    c.fillRect(0, 0, 5000, 5000);

    for(var i = 0;i < tiles.length;i++){
        tiles[i].show();
    }
}
