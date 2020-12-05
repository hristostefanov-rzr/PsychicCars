import {Car} from "./car.js"
import {Vector, Point} from "./utils.js"

// Canvas
const canvas = document.getElementById("canv");
const c = canvas.getContext("2d");

var car = new Car(0, 0);
car.image.onload = () => car.ready = true
car.image.src = "./images/face.png";

// function addEventListeners() {

// 	//Listening event to the pressed key
// 	addEventListener("keydown", (e) => {
// 		if (!keyCodes.find(key => e.keyCode === key)) return
// 		if (firstMove) {
// 			firstMove = false
// 			setTimer()
// 		}

//         keyActions[e.keyCode] = true
//         keyTimers[e.]
// 	}, true)

// 	//Listening event when the key is released
// 	addEventListener("keyup", (e) => {
// 		delete keyActions[e.keyCode]
// 	}, true)
// }

function main(){
    if (!car.ready) return
    update()
}


var circleAngle = 0;
function update(){
    c.fillStyle = 'lightblue';
    c.fillRect(0, 0, 600, 800);
    car.show();
    if(circleAngle === 2)return
    car.update(new Vector(0, 0));
    circleAngle += 1;
}

window.onload = function() {
    setInterval(main, 10);
}