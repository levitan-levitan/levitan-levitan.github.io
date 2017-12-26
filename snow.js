function normal() {
    var u = 0, v = 0;
    while(u < 1.0e-3) u = Math.random(); //Converting [0,1) to (0,1)
    v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function expon() {
  return -Math.log(Math.random())
}

function mean(xs) {
  var s = 0.0;
  for (i = 0; i < xs.length; ++i) {
    s += xs[i];
  }

  return s / xs.length;
}

const ALIVE = 0;
const MELTING = 1;

function Snow(canvas, nSnowflakes, minimalDepth, maximalDepth) {
  const ctx = canvas.getContext('2d');

  const snowImage = new Image();

  var px = [];
  var py = [];
  var pz = [];
  var zFactor = [];
  const depthMin = minimalDepth
  const depthMax = maximalDepth

  var snowflakeStatus = [];
  var timeMelting = [];

  var depth = 10;

  var vx = [];
  var vy = [];
  var floor = [];

  var beginning = new Date().getTime();
  var lastUpdate = new Date().getTime();

  const snowVerticalAcc = 40;
  const snowHorizontalAcc = 40;
  const snowGravity = 10;
  const friction = 0.1;
  const meltingTime = 2.0;

  this.worldHeight = 600;
  this.worldWidth = 800;

  const spawnOffsetX = 100;
  const spawnOffsetY = 100;

  const initialVelocityY = snowGravity / friction;

  var windAx = 0.0
  var windVx = 0.0;

  const windChange = 10.0;
  const windDrag = 0.5;
  const maxWindAcc = 1.0;
  const windReduction = 0.5;

  const horizon = 3.0 / 4.0

  const addSnowflake = function() {
    z = Math.min(expon() * 3, depthMax - depthMin) + depthMin;
    zf = 1.0 / (1.0 + z);
    f = (1 - horizon) * worldHeight * zf

    pz.push(z);
    zFactor.push(zf);
    floor.push(f)
    snowflakeStatus.push(ALIVE)

    px.push(
     (Math.random() - 0.5) * (worldWidth / zf + 2 * spawnOffsetX)
    );
    py.push(
      (Math.random() * (f + worldHeight * horizon) - worldHeight * horizon) / zf
    );

    vx.push(0.0);
    vy.push(initialVelocityY);
  }

  const spawnSnowflakeTop = function(i) {
    pz[i] = Math.min(expon() * 3, depthMax - depthMin) + depthMin;
    zFactor[i] = 1 / (1 + pz[i]);
    floor[i] = (1 - horizon) * worldHeight * zFactor[i]
    snowflakeStatus[i] = ALIVE;
    timeMelting[i] = 0;

    px[i] = (Math.random() - 0.5) * (worldWidth / zFactor[i] + 2 * spawnOffsetX);

    py[i] = -(worldHeight * horizon / zFactor[i]) - spawnOffsetY;

    vx[i] = windVx;
    vy[i] = initialVelocityY;
  };

  const updateSnow = function(dt) {
     windAx += windChange * normal() * dt
     windAx = Math.max(Math.min(maxWindAcc, windAx), -windAx);
     windVx += windAx * dt;
     windVx -= windReduction * windVx * dt;
  }

  const updateSnowflake = function(i, dt) {
    if (snowflakeStatus[i] == ALIVE) {
      // check if snowflake is out of borders;
       if (py[i] > floor[i] / zFactor[i]) {
         snowflakeStatus[i] = MELTING;
         timeMelting[i] = 0.0;
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
    } else {
      if (timeMelting[i] > meltingTime) {
        spawnSnowflakeTop(i);
      } else {
        timeMelting[i] += dt;
      }
    }
  }

  this.resize = function() {
    worldWidth = canvas.width;
    worldHeight = canvas.height;

    for (i = 0; i < floor.lenght; ++i) {
      floor[i] = (1 - horizon) * worldHeight * zFactor[i]
    }
  }

  this.getWindSpeed = function() { return windVx; }

  this.init = function() {
    snowImage.src = 'imgs/snow.png';
    this.resize();

    for (i = 0; i < nSnowflakes; ++i) {
      addSnowflake();
    }
  }

  this.draw = function() {
    ctx.save()

    now = new Date().getTime()
    var dt = (now - lastUpdate) / 1000.0
    dt = Math.min(dt, 0.1)

    updateSnow(dt);

    ctx.fillStyle = 'white'

    for (i = 0; i < nSnowflakes; ++i) {
      updateSnowflake(i, dt);
      if (pz[i] < 7) {
        if (snowflakeStatus[i] == MELTING) {
          ctx.globalAlpha = 0.75 * Math.max(meltingTime - timeMelting[i], 0.0) / meltingTime;
        } else {
          ctx.globalAlpha = 0.75
        }
        ctx.drawImage(snowImage,
          px[i] * zFactor[i] + worldWidth / 2,
          py[i] * zFactor[i] + horizon * worldHeight,
          16 * zFactor[i], 16 * zFactor[i]
        );
        ctx.globalAlpha = 1.0
      } else {
        ctx.beginPath();
        ctx.rect(px[i] * zFactor[i] + worldWidth / 2, py[i] * zFactor[i] + horizon * worldHeight, 16 * zFactor[i], 16 * zFactor[i]);
        ctx.fill();
      }
    }

    ctx.beginPath();
    ctx.moveTo(200,  horizon * worldHeight + 100);
    ctx.lineTo(200,  horizon * worldHeight - 100);
    ctx.stroke();

    ctx.fillStyle='red';
    ctx.beginPath();
    ctx.moveTo(200,  horizon * worldHeight - 100);
    ctx.lineTo(200 + 2.5 * windVx,  horizon * worldHeight - 75)
    ctx.lineTo(200,  horizon * worldHeight - 50)
    ctx.fill();

    lastUpdate = new Date().getTime();
    ctx.restore()
  }
}
