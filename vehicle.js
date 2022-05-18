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

class Vehicle {
  constructor(x, y, spd = 2, c = color(255, 255, 255)) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = spd;
    this.maxForce = 0.2;
    this.perception = random(100,150);
    this.r = 4;
    this.vel = p5.Vector.random2D();
    this.color = c;

    this.wanderTheta = PI / 2;
  }
  updateColor(c) {
    this.color = c;
  }
  updatePerception(p){
    this.perception = p;
  }
  getDistToTarget(target){
    let d = p5.Vector.dist(this.pos, target.pos);
    return d;
  }

  flee(target) {
    return this.seek(target).mult(-1);
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(120);
    wanderPoint.add(this.pos);
    fill(255, 0, 0);
    // circle(wanderPoint.x,wanderPoint.y,16);
    let wanderRadius = 75;
    // noFill();
    // stroke(255);
    // circle(wanderPoint.x,wanderPoint.y,wanderRadius*2);
    // line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

    let theta = this.wanderTheta + this.vel.heading();

    let x = wanderRadius * cos(theta);
    let y = wanderRadius * sin(theta);
    // fill(0,255,0);
    noStroke();
    wanderPoint.add(x, y);
    // circle(wanderPoint.x,wanderPoint.y,8);
    // stroke(255);
    //line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);

    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);

    let displaceRange = 0.3;
    this.wanderTheta += random(-displaceRange, displaceRange);
  }

  arrive(target) {
    return this.seek(target, true);
  }

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target.pos, this.pos);

    let desiredSpeed = this.maxSpeed;
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }
  pursue(vehicle) {
    // let target = vehicle.pos.copy();
    //  target.add(vehicle.vel.copy().mult(10));

    fill(255, 0, 0);
    circle(target.x, target.y, 16);

    return this.seek(target);
  }
  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    return pursuit.mult(-1);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    //stroke(1);
   // strokeWeight(2);
    let c = color(255, 204, 0);

    push();
    fill(this.color);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.maxSpeed = 5;
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }
  show() {
    stroke(255);
    strokeWeight(2);
    push();
    fill(color(255, 200, 0));

    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    circle(0, 0, this.r * 2);
    pop();
  }
}
