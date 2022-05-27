class Pellet {
	constructor({ x, y, color, size }) {
		this.pos = createVector(x, y);
		this.r = size || 6;
		this.color = color || color(255, 255, 255);
	}

	show() {
		push();
		fill(this.color);
		circle(this.pos.x, this.pos.y, this.r);
		pop();
	}
}
