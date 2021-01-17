import {Car} from "./car.js"
import {Point, Vector} from "./utils.js"

// Canvas
const canvas = document.getElementById("canv");
const c = canvas.getContext("2d");

var car = new Car(300, 300);
car.image.onload = () => car.ready = true
car.image.src = "./images/car.png";

var down_now = {
    down:0,
    up:0,
    right:0,
    left:0
}

// Setup event listeners
function setupEvents() {

    document.addEventListener('keyup', function(event){
        var keyName = event.key;

        switch(keyName) {
        case "ArrowRight":
            down_now.right = 0;
            break;
        case "ArrowLeft":
            down_now.left = 0;
            break;
        case "ArrowUp":
            down_now.up = 0;
            break;
        case "ArrowDown":
            down_now.down = 0;
            break;
        default:
            break;
        }
    });

    document.addEventListener('keydown', function(event){
        var keyName = event.key;

        switch(keyName) {
        case "ArrowRight":
            down_now.right = 1;
            break;
        case "ArrowLeft":
            down_now.left = 1;
            break;
        case "ArrowUp":
            down_now.up = 1;
            break;
        case "ArrowDown":
            down_now.down = 1;
            break;
        default:
            break;
        }
    });
}

function main(){
    if (!car.ready) return
    setupEvents()
    update()
}
function update(){
    var speed_adjustment = new Vector(new Point(down_now.right/10-down_now.left/10, down_now.down/10-down_now.up/10))
    c.fillStyle = 'lightblue';
    c.fillRect(0, 0, 600, 600);
    car.show();
    car.update(speed_adjustment);
}
window.onload = function() {
    setInterval(main, 10);
}