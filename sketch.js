// More Steering Behaviors! (Flee)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/Q4MU7pkDYmQ
// https://thecodingtrain.com/learning/nature-of-code/5.3-flee-pursue-evade.html

// Flee: https://editor.p5js.org/codingtrain/sketches/v-VoQtETO
// Pursue: https://editor.p5js.org/codingtrain/sketches/Lx3PJMq4m
// Evade: https://editor.p5js.org/codingtrain/sketches/X3ph02Byx
// Pursue Bouncing Ball: https://editor.p5js.org/codingtrain/sketches/itlyDq3ZB
// Pursue Wander: https://editor.p5js.org/codingtrain/sketches/EEnmY04lt
// Pursue Slider Prediction: https://editor.p5js.org/codingtrain/sketches/l7MgPpTUB

let pursuer;
let target;
let currentTarget;

function setup() {
  createCanvas(800, 1000);
  pursuer = new Vehicle(100, 100, 3, color(255, 0, 0));
  pursuer.updatePerception(400);
  vehicles = [];

  for (var i = 0; i < 150; i++) {
    vehicles.push(new Vehicle(random(0, width), random(0, height)));
  }
  currentTarget = vehicles.length - 1;
}

function draw() {
  background(20,70,100);
  //fill(255, 0, 0);
  noStroke();
  target = vehicles[currentTarget];
  circle(target.x, target.y, 32);

  //pursue
  let d = pursuer.getDistToTarget(target);
  if (d < pursuer.r + vehicles[currentTarget].r) {
    vehicles.pop();
    console.log(vehicles.length);
    currentTarget--;
  }

  for (var i = 0; i < vehicles.length; i++) {
    if (i === currentTarget) {
      vehicles[i].updateColor(color(0, 255, 0));
    }
    if (vehicles[i].getDistToTarget(pursuer) <= vehicles[i].perception) {
      let arrSteer = vehicles[i].flee(pursuer);
      vehicles[i].applyForce(arrSteer);
    } else {
      vehicles[i].wander();
    }
    vehicles[i].edges();
    vehicles[i].update();
    vehicles[i].show();
  }
  //just one vehicle
  
  if(pursuer.getDistToTarget(vehicles[currentTarget]) < pursuer.perception){
      let steering = pursuer.pursue(vehicles[currentTarget]);
  pursuer.applyForce(steering);
  }
  else{
    pursuer.wander();
  }

  // //
  pursuer.edges(); // not in video added after the fact
  pursuer.update();
  pursuer.show();
}
