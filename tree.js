Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };

function Tree(canvas, numberOfLights, cycleMs = 7500) {
  const horizon = 3.0 / 4.0;
  var cycle = cycleMs;
  const ctx = canvas.getContext('2d');
  const imageWidth = 272;
  const imageHeight = 606;
  const numLights = numberOfLights;
  const lightSize = 5;

  var scale = 1.0

  const treeImage = document.getElementById('tree');
  const px = []
  const py = []
  const state = []

  this.setCycle = function(newCycle) {
    cycle = newCycle;
  }

  const initLights = function() {
    var c = document.createElement('canvas');
    var context = c.getContext('2d');
    c.width = treeImage.width;
    c.height = treeImage.height;
    context.drawImage(treeImage, 0, 0);
    var imgData = context.getImageData(0, 0, treeImage.width, treeImage.height);

    const isGreen = function(x, y) {
      const indx = x + y * treeImage.width
      if (indx < imgData.data.length / 4) {
        return (imgData.data[indx * 4 + 1] > 100) && (imgData.data[indx * 4 + 3] > 0)
      } else {
        return false;
      }
    }

    var i = 0;
    var j = 0
    while(i < numLights && j < numLights * 10) {
      const nx = j / 7.0 + normal() * 0.02;
      const ny = j / numLights + normal() * 0.02
      const x = Math.round(nx * (treeImage.width - 1)) % treeImage.width;
      const y = Math.round(ny * (treeImage.height - 1)) % treeImage.height;

      if (isGreen(x, y)) {
        px.push(x * 1.0 / treeImage.width);
        py.push(y * 1.0 / treeImage.height);
        state.push(Math.round(Math.random() * cycle))
        i += 1;
      }
      j += 1;
    }
  }

  this.init = function() {
    this.resize()
    if (treeImage.complete || (treeImage.naturalWidth > 0)) {
      initLights();
    } else {
      treeImage.onload = function() {
        initLights();
      }
    }
  }

  this.resize = function() {
    worldHeight = canvas.height;
    worldWidth = canvas.width;
    scale = canvas.height / 1080.0;
  }

  this.draw = function() {
    ctx.save()

    const now = new Date().getTime()

    const treeX = worldWidth / 2 - imageWidth * scale / 2
    const treeY = worldHeight * horizon - imageHeight * scale * 5.0 / 6.0
    const treeW = imageWidth * scale
    const treeH = imageHeight * scale

    ctx.drawImage(treeImage, treeX, treeY, treeW, treeH);

    for (i = 0; i < numLights; ++i) {
      ctx.beginPath()
      const indx = Math.round(i * 3 / numLights * cycle  + now) % cycle;
      const t = (indx % cycle) / cycle;

      ctx.fillStyle = 'hsl(' + Math.floor(t * 360) + ', 75%, 50%)'
      ctx.arc(
        treeX + px[i] * treeW,
        treeY + py[i] * treeH,
        lightSize,
        0, 2 * Math.PI
      )
      ctx.fill()
    }

    ctx.restore()
  }
}
