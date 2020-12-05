import {Point, Vector} from "./utils.js";

// const keyCodes = [LEFT, UP, RIGHT, DOWN] = [37, 38, 39, 40]

// Canvas
const canvas = document.getElementById("canv");
const c = canvas.getContext("2d");

class Car{
    constructor(x, y){
        this.length = 60;
        this.width = 30;
        this.position = new Point(x, y);
        this.speed = new Vector(0, 0);
        this.image = new Image();
        this.image.src = "./images/face.png";
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

var car = new Car(0, 0);
car.image.onload = () => car.ready = true

var counter = 0;
function update(){
    c.fillStyle = 'lightblue';
    c.fillRect(0, 0, 600, 800);
    car.show();
    var adj = new Vector(2*counter**1.4, 0.3)
    counter += 1;
    car.update(adj);
    console.log(car.position.x + " " + car.position.y)
}

function main(){
    if (!car.ready) return
    update()
}

window.onload = function() {
    setInterval(main, 10);
}