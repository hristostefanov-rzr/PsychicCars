class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Vector{
    constructor(angle_or_components, size){
        if (angle_or_components instanceof Point){
            var components = angle_or_components;
            this.construct_from_components(components)
            this.created_from = 'components';
        }
        else if(typeof(angle_or_components) == 'number'){
            var angle = angle_or_components
            this.construct_from_angle_size(angle, size)
            this.created_from = 'angle';
        }
    }

    construct_from_components(components){
        this.components = components;
        this.size = (this.components.x ** 2 + this.components.y ** 2) ** 0.5

        if(this.components.x === 0){
            this.angle = Math.PI;
        }
        else{
            this.angle = Math.atan(this.components.y/this.components.x);
            if(this.components.x < 0 && this.components.y > 0){
                this.angle = Math.PI+this.angle;
            }
            if(this.components.x < 0 && this.components.y < 0){
                this.angle = Math.PI+this.angle;
            }
            if(this.components.x > 0 && this.components.y < 0){
                this.angle = 2 * Math.PI + this.angle;
            }
        }

        if(this.size < 1e-7){
            this.direction = new Point(0, 0); // Too close to the origin to care
        }
        else{
            this.direction = new Point(this.components.x/this.size, this.components.y/this.size);
        } 
    }

    construct_from_angle_size(angle, size){
        if(size<0){
            this.size = -size;
            this.angle = degrees_to_radians((180 + angle)%360);
        }
        else{
            this.size = size;
            this.angle = degrees_to_radians(angle); // The angle should be in range 0, 360
        }
        if(this.size < 1e-7){
            this.direction = new Point(0, 0);
        }
        else{
            this.direction = new Point(Math.cos(this.angle), Math.sin(this.angle)); // The direction should always be a point from the unit circle (cos(alpha), sin(alpha))
        }
        this.components = new Point(this.direction.x * this.size, this.direction.y * this.size);
    }

    add(new_vector){
        var components = new Point(this.components.x + new_vector.components.x, this.components.y + new_vector.components.y)
        var output = new Vector(components)
        return output;
    }
}

function degrees_to_radians(degrees)
{
  return degrees * (Math.PI/180);
}

export{Point, Vector};