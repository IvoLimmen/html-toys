// settings
var gridSize = 10;
var moveDivider = 5;
var scrolltext = 'this is my great and beautiful side scroller in html     ';

// system variables
var points = [];
var refreshCounter = 0;
var pid;
var textIndex = 0;
var letterIndex = 0;

function init() {
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  canvas.setAttribute("width", (document.body.clientWidth));
  canvas.setAttribute("height", (document.body.clientHeight));
  document.body.appendChild(canvas);

  var ctx = document.getElementById('canvas').getContext('2d');
  var centerX = ctx.canvas.width / 2;
  var centerY = ctx.canvas.height / 2;
  var width = ctx.canvas.widht;
  var height = ctx.canvas.height;

  pid = setInterval(drawPoints, 10);
}

function Point(x, y, color) {
  this.x = x;
  this.y = y;

  if (color != null) {
    this.color = color;
  }
}

Point.prototype = {
  x: 0,
  y: 0,
  color: 'rgb(100,0,0)',
  size: gridSize
};

Point.prototype.move = function () {
  this.x = this.x - gridSize;
}

Point.prototype.isDone = function () {
  return (this.x <= 0);
}

Point.prototype.draw = function (ctx) {
  ctx.save();
  var newY = this.y + (75 * Math.sin(this.x / 100));
  ctx.translate(this.x, newY);
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.size * 2, this.size * 2);
  ctx.fill();
  ctx.restore();

  /*
    this.size--;
    
    if (this.size == 0) {
      this.size = gridSize;
    }
  */
}

function drawPoints() {
  var ctx = document.getElementById('canvas').getContext('2d');
  var centerX = ctx.canvas.width / 2;
  var centerY = ctx.canvas.height / 2;

  // clear
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (refreshCounter == 0) {
    var char = scrolltext.charAt(textIndex);
    var fontData = getFontLetter(char);

    for (var i = 0; i < 7; i++) {
      var color = 'rgb(220,220,220)';

      if (letterIndex < 7) {
        var block = fontData.data[letterIndex + (i * 7)];
        if (block == 1) {
          var r = 100 + parseInt((Math.random() * 155));
          var g = 100 + parseInt((Math.random() * 155));
          var b = 100 + parseInt((Math.random() * 155));

          color = 'rgb(' + r + ',' + g + ',' + b + ')';

          points.push(new Point(ctx.canvas.width - gridSize, 50 + (i * gridSize), color));
        }
      }
    }

    letterIndex++;

    if (letterIndex == 8) {
      letterIndex = 0;
      textIndex++;

      if (textIndex >= scrolltext.length) {
        textIndex = 0;
      }
    }
  }

  // draw
  for (var i = 0; i < points.length; i++) {
    points[i].draw(ctx);

    if (refreshCounter == 0) {

      points[i].move();

      if (points[i].isDone(ctx)) {
        // remove point
        points.splice(i, 1);
      }
    }
  }

  refreshCounter++;
  if (refreshCounter >= 5) {
    refreshCounter = 0;
  }
}

function stop() {
  clearInterval(pid);
}
