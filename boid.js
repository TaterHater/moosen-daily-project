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

class Boid {
  constructor({ x, y, maxSpeed, color, size, perception }, { width, height }) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = maxSpeed || 1;
    this.maxForce = 0.2;
    this.perception = perception || 150;
    this.r = size || 6;
    this.vel = p5.Vector.random2D();
    this.color = color || color(255, 255, 255);

    this.wanderTheta = PI / 2;
  }
  updateColor(c) {
    this.color = c;
  }
  updateSize(r) {
    this.r = r;
  }
  updatePerception(p) {
    this.perception = p;
  }
  getDistToTarget(target) {
    const vector = this.getClosestVector(target);
    return vector.distToTarget;
  }

  getClosestVector(target) {
    const vectors = Array.from({ length: 9 }, (_, i) => {
      const xdif = -width + (i % 3) * width;
      const ydif = -height + Math.floor(i / 3) * height;
      return createVector(target.pos?.x + xdif, target.pos?.y + ydif);
    });
    const withDist = vectors.map((v) => ({
      ...v,
      distToTarget: p5.Vector.dist(this.pos, v),
    }));
    withDist.sort((a, b) => a.distToTarget - b.distToTarget);
    return withDist[0];
  }

  flee(target) {
    const diff = PI + random(-10, 10) * 0.1;
    return this.seek(target).rotate(diff);
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(120);
    wanderPoint.add(this.pos);
    let wanderRadius = 75;

    let theta = this.wanderTheta + this.vel.heading();

    let x = wanderRadius * cos(theta);
    let y = wanderRadius * sin(theta);

    wanderPoint.add(x, y);

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
    const closest = this.getClosestVector(target);
    const newTarget = createVector(closest.x, closest.y);
    let force = p5.Vector.sub(newTarget, this.pos);

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
  pursue(target) {
    fill(255, 0, 0);
    circle(target.x, target.y, 16);

    return this.seek(target);
  }
  evade(target) {
    let pursuit = this.pursue(target);
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
    push();
    noStroke();
    fill(this.color);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  // Loops the boid to the other side
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = 0;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = 0;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height;
    }
  }
}
