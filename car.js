import {Point, Vector} from "./utils.js";

const canvas = document.getElementById("canv");
const c = canvas.getContext("2d");

class Car{
    constructor(x, y){
        this.length = 60;
        this.width = 30;
        this.position = new Point(x, y);
        this.speed = new Vector(0, 0);
        this.image = new Image();

        this.ready = false;
    }
    update(speed_adjustment){
        this.speed.add(speed_adjustment);
        this.position.x += this.speed.components.x;
        this.position.y += this.speed.components.y;
    }
    show(){
        c.save();
        // c.translate(canvas.width/2, canvas.height/2);
        c.rotate(70*Math.PI/180);
        c.drawImage(this.image, this.position.x, this.position.y, 60, 60);
        c.restore();
    }
}

export {Car};

// context.clearRect(0,0,canvas.width,canvas.height);
//     context.save();
//     context.translate(canvas.width/2,canvas.height/2);
//     context.rotate(degrees*Math.PI/180);
//     context.drawImage(image,-image.width/2,-image.width/2);
//     context.restore();