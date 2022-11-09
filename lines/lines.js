const MAX_LINES = 5;
const MAX_SPEED = 8;
const MAX_HISTORY = 25;

const PALETTES = ['#ed5565', '#fc6e51', '#ffce54', '#a0d468', '#48cfad', '#4fc1e9', '#5d9cec', '#ac92ec', '#ec87c0', '#f5f7fa', '#ccd1d9', '#656d78'];

let ctx;
let width;
let height;
let lines = [];

function shadeColor(col, amt) {
  col = col.replace(/^#/, '')
  if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2]

  let [r, g, b] = col.match(/.{2}/g);
  ([r, g, b] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt])

  r = Math.max(Math.min(255, r), 0).toString(16)
  g = Math.max(Math.min(255, g), 0).toString(16)
  b = Math.max(Math.min(255, b), 0).toString(16)

  const rr = (r.length < 2 ? '0' : '') + r
  const gg = (g.length < 2 ? '0' : '') + g
  const bb = (b.length < 2 ? '0' : '') + b

  return `#${rr}${gg}${bb}`
}

function copy(obj) {
  let objectCopy = {};
  let key;
  for (key in obj) {
    objectCopy[key] = obj[key];
  }
  return objectCopy;
}

function rnd_color() {
  let size = PALETTES.length;
  return PALETTES[(Math.floor(Math.random()*size))];
}

function rnd_speed() {
  let speed = 1 + Math.floor(Math.random() * MAX_SPEED);
  if (Math.random() > 0.5) {
    speed *= -1;
  }
  return speed;
}

class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.color = rnd_color();
    this.historyP1 = [];
    this.historyP2 = [];
    this.historyColor = [];
    console.log(this.color);
    let fraction = Math.floor(255 / (MAX_HISTORY));
    for (let i = 0; i < MAX_HISTORY; i++) {
      let c = shadeColor(this.color, 255 - (i * fraction)); 
      this.historyColor.push(c);      
    }
  }

  move() {
    this.historyP1.push(copy(this.p1));
    this.historyP2.push(copy(this.p2));
    this.p1.move();
    this.p2.move();

    if (this.historyP1.length == MAX_HISTORY) {
      this.historyP1.shift();
      this.historyP2.shift();
    }
  }

  draw() {

    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    
    for (let i = 0; i < this.historyP1.length; i++) {
      let hp1 = this.historyP1[i];
      let hp2 = this.historyP2[i];

      ctx.strokeStyle = this.historyColor[i];
      ctx.fillStyle = this.historyColor[i];
      ctx.beginPath();
      ctx.moveTo(hp1.x, hp1.y);
      ctx.lineTo(hp2.x, hp2.y);
      ctx.stroke();
    }
  }
}

class Point {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x <= 0 || this.x >= width) {
      this.dx *= -1;
    }

    if (this.y <= 0 || this.y >= height) {
      this.dy *= -1;
    }
  }

  static random(width, height) {
    return new Point(Math.floor(Math.random() * width), Math.floor(Math.random() * height), rnd_speed(), rnd_speed());
  }  
}

function init() {
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  canvas.setAttribute("width", (document.body.clientWidth));
  canvas.setAttribute("height", (document.body.clientHeight));
  document.body.appendChild(canvas);
  ctx = document.getElementById('canvas').getContext('2d');
  width = ctx.canvas.width;
  height = ctx.canvas.height;

  for (let i = 0; i < MAX_LINES; i++) {
    lines.push(new Line(Point.random(width, height), Point.random(width, height)));
  }

  window.requestAnimationFrame(drawPoints);  
}

function drawPoints() {
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillRect(0, 0, width, height);

  lines.forEach(l => {
    l.draw();
    l.move();  
  });

  window.requestAnimationFrame(drawPoints);
}
