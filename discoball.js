Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };

const DISCO_ON = 1
const DISCO_OFF = 0

function Discoball(canvas, segments=100, cx=0.8, cy=0.1, cycleMs=500) {
  var cycle = cycleMs;
  const ctx = canvas.getContext('2d');

  const centerX = cx
  const centerY = cy
  const deltaAngle = 2 * Math.PI / segments
  var status = DISCO_OFF

  this.init = function() {
    this.resize()
  }

  this.resize = function() {}

  this.turnOn = function() { status = DISCO_ON }
  this.turnOff = function() { status = DISCO_OFF }


  this.draw = function() {
    if (status === DISCO_OFF) { return; }

    ctx.save()

    const now = new Date().getTime()
    const offset = Math.floor(now % (2 * cycle) / cycle)

    const r = Math.max(canvas.height, canvas.width)
    const px = centerX * canvas.width
    const py = centerY * canvas.height

    ctx.strokeStyle = 'black';
    ctx.beginPath()
    ctx.moveTo(px, 0)
    ctx.lineTo(px, py);
    ctx.stroke()

    for (i = 0; i < segments; i++) {
      if ((offset + i) % 2 == 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      }
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.arc(px, py, r, i * deltaAngle, (i + 1) * deltaAngle)
      ctx.lineTo(px, py)
      ctx.fill()
    }
    ctx.fillStyle = 'white';
    ctx.beginPath()
    ctx.arc(px, py, 25, 0, 2 * Math.PI)
    ctx.fill()

    ctx.restore()
  }
}
