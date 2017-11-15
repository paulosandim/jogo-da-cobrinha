var canvas, ctx, WIDTH, HEIGHT, FPS, tileSize;
var snake;

window.addEventListener("resize", resizeWindow);

function resizeWindow() {

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	tileSize = Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60));

}

function init() {

	canvas = document.createElement("canvas");
	resizeWindow();
		
	document.body.appendChild(canvas);
	ctx = canvas.getContext("2d");

	FPS = 15;

	newGame();
	run(); 
	
}

function newGame() {

	snake = new Snake();
	
}

function Snake() {

	this.body = [[10, 10], [10, 11], [10, 12]];
	this.color = "#000";
	this.direction = [0, -1];

	this.update = function() {

		var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

		this.body.pop();
		this.body.splice(0, 0, nextPos);

	}

	this.draw = function() {
		ctx.fillStyle = this.color;

		for (var i = 0; i < this.body.length; i++) {
			ctx.fillRect(this.body[i][0] * tileSize, this.body[i][1] * tileSize, tileSize, tileSize);
			
		}
	}
}

function update() {

	snake.update();

}

function run() {

	update();
	draw();

	setTimeout(run, 1000 / FPS);

}

function draw() {

	ctx.clearRect(0, 0, WIDTH, HEIGHT);

		snake.draw();
	
}

init();

