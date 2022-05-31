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
let currentTarget;
let targets = [];
let pellets = [];

function setup() {
	const numTargets = 800;
	const numPellets = 2;
	const width = 800;
	const height = 800;

	createCanvas(width, height);

	// Add Pursuer
	pursuer = new Boid(
		{
			x: 100,
			y: 100,
			maxSpeed: 1.1,
			color: color(255, 0, 0),
			size: 9,
			perception: 300,
		},
		{ width, height },
	);

	// Add targets
	for (var i = 0; i < numTargets; i++) {
		targets.push(
			new Boid(
				{
					x: random(0, width),
					y: random(0, height),
					color: color(random(192, 255), random(192, 255), random(192, 255)),
					size: random(4, 6),
				},
				{ width, height },
			),
		);
	}
	currentTarget = targets.length - 1;

	// Add Pellets
	for (var i = 0; i < numPellets; i++) {
		addPellet();
	}
}

function draw() {
	background(20, 70, 100);

	// Targets
	for (var i = 0; i < targets.length; i++) {
		// Find closeset pellet
		let closestPellet = pellets[0];
		let closestPelletDist = targets[i].getDistToTarget(closestPellet);
		for (var j = 0; j < pellets.length; j++) {
			let distance = targets[i].getDistToTarget(pellets[j]);
			if (distance < closestPelletDist) {
				closestPellet = pellets[j];
				closestPelletDist = distance;
			}
		}

		// Eat pellet
		if (closestPelletDist < closestPellet.r + targets[i].r) {
			pellets.splice(pellets.indexOf(closestPellet), 1);
			addPellet();
		}

		// Set current target color
		if (i === currentTarget) {
			targets[i].updateColor(color(0, 255, 0));
		}

		// Move
		if (targets[i].getDistToTarget(pursuer) <= targets[i].perception) {
			let arrSteer = targets[i].flee(pursuer);
			targets[i].applyForce(arrSteer);
		} else if (
			targets[i].getDistToTarget(closestPellet) <= targets[i].perception
		) {
			let arrSteer = targets[i].pursue(closestPellet);
			targets[i].applyForce(arrSteer);
		} else {
			targets[i].wander();
		}
		targets[i].edges();
		targets[i].update();
		targets[i].show();
	}

	// Pursuer
	let dist = pursuer.getDistToTarget(targets[currentTarget]);

	if (dist < pursuer.perception) {
		let steering = pursuer.pursue(targets[currentTarget]);
		pursuer.applyForce(steering);
	} else {
		pursuer.wander();
	}

	if (dist < pursuer.r + targets[currentTarget].r) {
		targets.pop();
		console.log(targets.length);
		currentTarget--;
	}

	pursuer.edges(); // not in video added after the fact
	pursuer.update();
	pursuer.show();

	// Pellets
	for (var i = 0; i < pellets.length; i++) {
		pellets[i].show();
	}
}

function addPellet() {
	pellets.push(
		new Pellet({
			x: random(0, width),
			y: random(0, height),
			color: color(255, 255, 0),
			size: 6,
		}),
	);
}
