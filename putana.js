function normal() {
    var u = 0, v = 0;
    while(u < 1.0e-3) u = Math.random(); //Converting [0,1) to (0,1)
    v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function mean(xs) {
  var s = 0.0;
  for (i = 0; i < xs.length; ++i) {
    s += xs[i];
  }

  return s / xs.length;
}

snow = new Image()

var px = [];
var py = [];
var pz = [];
var zFactor = [];

const depth = 10;

var vx = [];
var vy = [];
var floor = [];

const beginning = new Date().getTime();
var lastUpdate = new Date().getTime();

const nSnowflakes = 2500;

const snowVerticalAcc = 10;
const snowGravity = 10;
const snowHorizontalAcc = 10;
const friction = 0.1;

var worldHeight = 600;
var worldWidth = 800;

const spawnOffsetX = 100;
const spawnOffsetY = 100;

const initialVelocityY = snowGravity / friction;

var windAx = 0.0
var windVx = 0.0;

const windChange = 10.0;
const windDrag = 0.5;
const maxWindAcc = 1.0;
const windReduction = 0.25;

const horizon = 3.0 / 4.0

drawSnow = function() {
  var canvas = document.getElementById('world');
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "LightSkyBlue";
  ctx.fillRect(0, 0, canvas.width, horizon * canvas.height)
  ctx.fillStyle = 'Lavender'
  ctx.fillRect(0, horizon * canvas.height - 1, canvas.width, canvas.height)
  ctx.fullStyle = 'white'

  now = new Date().getTime()
  var dt = (now - lastUpdate) / 1000.0
  dt = Math.min(dt, 0.1)

  updateSnow(dt);

  for (i = 0; i < nSnowflakes; ++i) {
    updateSnowflake(i, dt);
    if (pz[i] < 7) {
      ctx.save();
      ctx.translate(px[i] * zFactor[i] + worldWidth / 2, py[i] * zFactor[i] + horizon * worldHeight);
      ctx.drawImage(snow, 0, 0, 16 * zFactor[i], 16 * zFactor[i]);
      ctx.restore()
    } else {
      ctx.save();
      ctx.translate(px[i] * zFactor[i] + worldWidth / 2, py[i] * zFactor[i] + horizon * worldHeight);
      ctx.beginPath();
      ctx.rect(0, 0, 16 * zFactor[i], 16 * zFactor[i]);
      ctx.fill();
      ctx.restore()
    }
    // ctx.strokeStyle = 'black'
    // ctx.beginPath()
    // ctx.moveTo(px[i] * zFactor[i] + worldWidth / 2, py[i] * zFactor[i] + horizon * worldHeight)
    // ctx.lineTo(px[i] * zFactor[i] + worldWidth / 2, floor[i] + worldHeight * horizon)
    // ctx.stroke()
  }

  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(100 + windVx, 100);
  ctx.stroke();

  lastUpdate = new Date().getTime();
  window.requestAnimationFrame(drawSnow);
}

addSnowflake = function() {
  z = Math.random() * depth;
  zf = 1.0 / (1.0 + z);
  f = worldHeight / 4 * zf + worldHeight / 4

  pz.push(z);
  zFactor.push(zf);
  floor.push(f)

  px.push(
   (Math.random() - 0.5) * (worldWidth / zf + 2 * spawnOffsetX)
  );
  py.push(
    (Math.random() * (f + worldHeight * horizon) - worldHeight * horizon) / zf
  );

  vx.push(0.0);
  vy.push(initialVelocityY);
}

spawnSnowflakeTop = function(i) {
  pz[i] = Math.random() * depth;
  zFactor[i] = 1 / (1 + pz[i]);
  floor[i] = (1 - horizon) * worldHeight * zFactor[i]

  px[i] = (Math.random() - 0.5) * (worldWidth / zFactor[i] + 2 * spawnOffsetX);

  py[i] = -(worldHeight * horizon / zFactor[i]) - spawnOffsetY;

  vx[i] = windVx;
  vy[i] = initialVelocityY;
};

updateSnow = function(dt) {
   windAx += windChange * normal() * dt
   windAx = Math.min(maxWindAcc, windAx);
   windVx += windAx * dt;
   windVx -= windReduction * windVx * dt;
}

updateSnowflake = function(i, dt) {
  // check if snowflake is out of borders;
   if (py[i] > floor[i] / zFactor[i]) {
     spawnSnowflakeTop(i)
   }

  if (z < 5) {
    vx[i] += normal() * dt * snowHorizontalAcc;
    vy[i] += normal() * dt * snowVerticalAcc;
  }

  vx[i] += windDrag * (windVx - vx[i]) * dt;
  vx[i] -= friction * vx[i] * dt;

  vy[i] += snowGravity * dt;
  vy[i] -= friction * vy[i] * dt;

  px[i] += vx[i] * dt;
  py[i] += vy[i] * dt;
}

initSnow = function() {
  snow.src = 'imgs/snow.png'
  const canvas = document.getElementById('world');
  window.onresize = function() {
    worldWidth = window.innerWidth;
    worldHeight = window.innerHeight;
    canvas.width = worldWidth - 100;
    canvas.height = worldHeight - 100;
  }

  worldWidth = window.innerWidth;
  worldHeight = window.innerHeight;
  canvas.width = worldWidth - 50;
  canvas.height = worldHeight - 50;

  for (i = 0; i < nSnowflakes; ++i) {
    addSnowflake();
  }

  window.requestAnimationFrame(drawSnow);
}

// var Canvas = document.getElementById("world");
// $('body').css({'background-image':"url(" + Canvas.toDataURL("image/png")+ ")" });
