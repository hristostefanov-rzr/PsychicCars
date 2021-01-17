import {Point, Vector} from "./utils.js";

const canvas = document.getElementById("canv");
const c = canvas.getContext("2d");

class Car{
    constructor(x, y){
        this.length = 80;
        this.width = 80;
        this.position = new Point(x-30, y-15);
        this.speed = new Vector(0, 0);
        this.image = new Image();
        this.friction = 0.99
        this.max_speed = 2
        this.ready = false;
    }
    update(speed_adjustment){
        this.speed = this.speed.add(speed_adjustment).multiply(this.friction);
        if(this.speed.size>this.max_speed){
            this.speed = this.speed.multiply(this.max_speed/this.speed.size)
        }
        this.position.x += this.speed.components.x;
        this.position.y += this.speed.components.y;
        console.log(this.speed.angle*180/Math.PI)
    }
    show(){
        c.save();
        c.translate(this.position.x + this.length/2, this.position.y + this.width/2);
        c.drawImage(this.image, this.position.x, this.position.y, 80, 80);
        c.rotate(this.speed.angle*180/Math.PI);
        c.translate(-(this.position.x + this.length/2), -(this.position.y+this.width/2))

        c.restore();
    }
}

export {Car};