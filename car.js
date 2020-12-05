import {Point, Vector} from "./utils.js";

class Car{
    constructor(x, y){
        this.length = 60;
        this.width = 30;
        this.position = new Point(x, y);
        this.speed = new Vector(30, 2);
        this.image = new Image();

        this.ready = false;
    }
    update(speed_adjustment){
        this.speed.add(speed_adjustment);
        this.position.x += this.speed.components.x;
        this.position.y += this.speed.components.y;
    }
    show(){
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.length);
    }
}

export {Car};