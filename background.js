function Background(canvas) {
  const horizon = 3.0 / 4.0
  const ctx = canvas.getContext('2d');

  this.draw = function() {
    ctx.save();
    ctx.fillStyle = "LightSkyBlue";
    ctx.fillRect(0, 0, canvas.width, horizon * canvas.height)
    ctx.fillStyle = 'Lavender'
    ctx.fillRect(0, horizon * canvas.height - 1, canvas.width, canvas.height)
    ctx.restore();
  }

  this.init = function() {}
  this.resize = function() {}
}

function EmtpyBackground(canvas)  {
  const ctx = canvas.getContext('2d');

  this.draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  this.init = function() {}
  this.resize = function() {}
}
