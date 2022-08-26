var count = 100;
var stars = [];
var pid;

function init() {
	var ctx = document.getElementById('canvas').getContext('2d');
	var centerX = ctx.canvas.width/2;
	var centerY = ctx.canvas.height/2;
	width = ctx.canvas.widht;
	height = ctx.canvas.height;
	
	for (var i = 0; i < count; i++) {
		stars.push(new Star(centerX, centerY));
	}
	
	pid = setInterval(drawStars, 50);
}

function Star(centerX, centerY) {

	while(this.invalidSpeed()) {
		this.initSpeed();
	}
	
	this.x = centerX;
	this.y = centerY;
	this.size = 1 + parseInt(Math.random() * 2);
	var r = 100 + parseInt((Math.random() * 155));
	var g = 100 + parseInt((Math.random() * 155));
	var b = 100 + parseInt((Math.random() * 155));
	this.color = 'rgba(' + r + ',' + g + ',' + b + ',1)';
}

Star.prototype = {
	x: 0,
	y: 0,
	speedX: 0,
	speedY: 0,
	size: 0,
	color: 'rgba(255,255,255,0.1)'
};

Star.prototype.invalidSpeed = function() {
	if (!this.speedX || !this.speedY) {
		return true;
	}
	if (this.speedX == 0 && this.speedY == 0) {
		return true;
	}
	
	return false;
}

Star.prototype.initSpeed = function() {
	this.speedX = (Math.random() * 5);
	this.speedY = (Math.random() * 5);
	
	if (Math.random() >= .5) {
		this.speedX = -this.speedX;
	}
	if (Math.random() >= .5) {
		this.speedY = -this.speedY;
	}
}

Star.prototype.move = function() {
	this.x = this.x + this.speedX;
	this.y = this.y + this.speedY;	
}

Star.prototype.isDone = function(ctx) {
	
	if (this.x <= 0 || this.x >= ctx.canvas.width) {
		return true;
	}
	else if (this.y <= 0 || this.y >= ctx.canvas.height) {
		return true;
	}
	
	return false;
}

Star.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.beginPath();
    ctx.fillStyle=this.color;
    ctx.arc(0, 0, this.size,0,Math.PI*2,true);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawStars() {
	var ctx = document.getElementById('canvas').getContext('2d');
	var centerX = ctx.canvas.width/2;
	var centerY = ctx.canvas.height/2;

	for (var i = 0; i < count; i++) {
		stars[i].draw(ctx);
		stars[i].move();
		
		if (stars[i].isDone(ctx)) {
			stars[i] = new Star(centerX,centerY);
		}
	}
    
   ctx.fillStyle = 'rgba(255,255,255,0.05)';
   ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function stop() {
	clearInterval(pid);
}
