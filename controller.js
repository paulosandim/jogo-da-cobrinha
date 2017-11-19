var canvas, ctx, WIDTH, HEIGHT, FPS = 15, tileSize, running, playing;
var snake, food, playLabel;
var globalTouch = [], offset = [];



var keys = {

	left: 37,
	up: 38,
	right: 39,
	down: 40

};

window.addEventListener("touchstart", touchStart);

window.addEventListener("touchmove", touchMove);

window.addEventListener("touchend", touchEnd);

window.addEventListener("keydown", keyDown);

window.addEventListener("orientationchange", changeOrientation);

window.addEventListener("resize", resizeWindow);

function isLandscape() {

	if (screen.orientation)

		return(screen.orientation.type == "landscape-primary" || screen.orientation.type == "landscape-secondary");

	return(WIDTH > HEIGHT);
}

function touchEnd(e) {

	if (Math.abs(offset[0]) > Math.abs(offset[1]))
		snake.direction = [offset[0] / Math.abs(offset[0]), 0];

	else
		snake.direction = [0, offset[1] / Math.abs(offset[1])];

}

function touchMove(e) {

	var touch = e.touches[0];

	offset = [touch.pageX - globalTouch[0], touch.pageY - globalTouch[1]];

}

function touchStart(e) {

	e.preventDefault();

	var touch = e.touches[0];
	globalTouch = [touch.pageX, touch.pageY];

}

function keyDown(e) {

	if (!playing && (e.keyCode == keys.up || e.keyCode == keys.left || e.keyCode == keys.right || e.keyCode == keys.down))
		
		playing = true;

	switch (e.keyCode) {
		case keys.left:
			snake.direction = [-1, 0];
			break;

		case keys.up:
			snake.direction = [0, -1];
			break;

		case keys.right:
			snake.direction = [1, 0];
			break;

		case keys.down:
			snake.direction = [0, 1];
			break; 
	} 
}

function resizeWindow() {

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	tileSize = Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60));

}

function init() {
	
	canvas = document.createElement("canvas");
	document.body.appendChild(canvas);	
	ctx = canvas.getContext("2d");

	running = true;
	resize();

	newGame();

	requestAnimationFrame(run);
}

function newGame() {

	snake = new Snake();

	food = new Food();

	playLabel = new PlayLabel();

	playing = false;
	
}

function PlayLabel() {
	
	this.factor = 1.5;
	this.text;
	this.color = "#5d8357";
	this.font = tileSize * this.factor + "pt Arial";

	this.messages = {

		portrait: "Rotacione o dispositivo para jogar", 
		landscape: "Arraste a tela para jogar",
		pc: "Pressione as setas para jogar"

	};

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
				
	if (!isLandscape())		
		this.text = this.messages["portrait"];

	else		
		this.text = this.messages["landscape"];

}
				
else
	this.text = this.messages["pc"];
			

	this.setText = function(key) {
		this.text = this.messages[key];
		
	}

	this.update = function() {	
		this.font = tileSize * this.factor + "pt Arial";
	
	}

	this.draw = function() {

		ctx.fillStyle = this.color;
		ctx.font = this.font;
		ctx.fillText(this.text, WIDTH / 2 - (ctx.measureText(this.text).width / 2), HEIGHT / 2);
	
	}

}

function changeOrientation(e) {

	resizeWindow();

	if (isLandscape())
		playLabel.setText("landscape");

	else if (!playing) {
		playLabel.setText("portrait");
	}

	else {

		playing = false;
		playLabel.setText("portrait");
	}
}

function Food() {
	
	this.color = "#ff0000",
	this.position = [Math.floor(Math.random() * (WIDTH / tileSize)), Math.floor(Math.random() * (HEIGHT / tileSize))];

	for (var i = 0; i < snake.body.length; i++) {
		while (this.position[0] == snake.body[i][0] && this.position[1] == snake.body[i][1])
			this.position = [Math.floor(Math.random() * (WIDTH / tileSize)), Math.floor(Math.random() * (HEIGHT / tileSize))];
	}
}

function Snake() {

	this.body = [[10, 10], [10, 11], [10, 12]];
	this.color = "#000";
	this.direction = [0, -1];

	this.update = function() {

		var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

		if (!playing) {
			if (this.direction[1] == -1 && nextPos[1] <= (HEIGHT * 0.1 / tileSize))
				this.direction = [1, 0];

			else if (this.direction[0] == 1 && nextPos[0] >= (WIDTH * 0.9 / tileSize))
				this.direction = [0, 1];

			else if (this.direction[1] == 1 && nextPos[1] >= (HEIGHT * 0.9 / tileSize))
				this.direction = [-1, 0];

			else if (this.direction[0] == -1 && nextPos[0] <= (WIDTH * 0.1 / tileSize))
				this.direction = [0, -1];
		
		}

		if (nextPos[0] == this.body[1][0] && nextPos[1] == this.body[1][1]) {

			this.body.reverse();
			nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

		}

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

	playLabel.update();

	// se a cobrinha bater nela mesmo
	for (var i = 1; i < snake.body.length; i++) {
		if (snake.body[0][0] == snake.body[i][0] && snake.body[0][1] == snake.body[i][1])
			newGame();
	}

	// se a cobrinha bater nos cantos
	if (snake.body[0][0] < 0 || snake.body[0][0] * tileSize > WIDTH || snake.body[0][1] < 0 || snake.body[0][1] * tileSize > HEIGHT) 
				newGame();
			
	// se a cobrinha comer a comida
	if (snake.body[0][0] == food.position[0] && snake.body[0][1] == food.position[1]) {
		snake.body.splice(snake.body.length - 1, 0, [snake.body[snake.body.length - 1]]);
		food = new Food();
	
	}

}

function run(time) {
	
	dt = time - lastTime;
	lastTime = time;

	if (running) {
		
		lag += dt;

	while (lag >= 1000 / FPS) { 
		update();
		lag -= 1000 / FPS;
		
		}
	
	}

	draw();	
	requestAnimationFrame(run);

}

function draw() {

	ctx.clearRect(0, 0, WIDTH, HEIGHT);

	snake.draw();
	food.draw();

	if (!playing)
		playLabel.draw();
	
}

init();

