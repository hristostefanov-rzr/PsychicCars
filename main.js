import {Car} from "./car.js"
import {Vector, Point} from "./utils.js"

// Canvas
const canvas = document.getElementById("canv");
const c = canvas.getContext("2d");

var car = new Car(300, 400);
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
    // c.fillStyle = 'lightblue';
    // c.fillRect(0, 0, 600, 800);
    // car.show();
    // circleAngle += 30;
    // car.update(new Vector(-40, 0.2));
    // console.log(car.position.x + " " + car.position.y)
    if(circleAngle ===  360) return
    var wanted_vector = new Vector(90 + circleAngle, 3);
    var initial_vector = new Vector(circleAngle, 4);
    var adjustment = wanted_vector.add(new Vector(initial_vector.angle*180/Math.PI, -initial_vector.size))
    initial_vector = initial_vector.add(adjustment)
    circleAngle += 15
}

window.onload = function() {
    setInterval(main, 10);
}