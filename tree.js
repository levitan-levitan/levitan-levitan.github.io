function Tree(canvas, numberOfLights) {
  const horizon = 3.0 / 4.0;
  const cycle = 1000;
  const colors = [
    '#FFE71E', '#E8780B', '#FF012A', '#6E0BE8', '#0C90FF'
  ]
  const ctx = canvas.getContext('2d');
  const imageWidth = 272;
  const imageHeight = 606;
  const numLights = numberOfLights;
  const lightSize = 5;

  var scale = 1.0

  const treeImage = document.getElementById('tree');
  const px = []
  const py = []

  const initLights = function() {
    var c = document.createElement('canvas');
    var context = c.getContext('2d');
    c.width = treeImage.width;
    c.height = treeImage.height;
    context.drawImage(treeImage, 0, 0);
    var myData = context.getImageData(0, 0, treeImage.width, treeImage.height);

    var i = 0;
    while(i < numLights) {
      const x = Math.round(Math.random() * (treeImage.width - 1));
      const y = Math.round(Math.random() * (treeImage.height - 1));
      const indx = x + y * treeImage.width

      if ((myData.data[indx * 4 + 1] > 100) && ((myData.data[indx * 4 + 3] > 0))) {
        px.push(x * 1.0 / treeImage.width);
        py.push(y * 1.0 / treeImage.height);

        i += 1;
      }
    }
  }

  this.init = function() {
    this.resize()
    initLights();
  }

  this.resize = function() {
    worldHeight = canvas.height;
    worldWidth = canvas.width;
    scale = canvas.height / 1080.0;
  }

  this.draw = function() {
    ctx.save()

    const now = new Date().getTime()

    const offset = Math.round((now % (cycle * colors.length)) / cycle);

    const treeX = worldWidth / 2 - imageWidth * scale / 2
    const treeY = worldHeight * horizon - imageHeight * scale * 5.0 / 6.0
    const treeW = imageWidth * scale
    const treeH = imageHeight * scale

    ctx.drawImage(treeImage, treeX, treeY, treeW, treeH);

    for (i = 0; i < numLights; ++i) {
      ctx.beginPath()
      const indx = (i + offset) % colors.length;
      ctx.fillStyle = colors[indx]
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
