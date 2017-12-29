var putanaHeight = 200;
const horizon = 3.0 /  4.0;
var worldWidth = 800;
var worldHeight = 600;

const hardcore = "https://t4.bcbits.com/stream/1d10246136272ec2d03476aad4554408/mp3-128/2621758193?p=0&ts=1514670589&t=5ae673508ae80e01116110063ad4a82e16b27da0&token=1514670589_ed66ca356f243ce87366c7cb1d4088013deff42a"

var putanaJump = function() {

  var putanas = document.getElementsByClassName("putana");

  for (i = 0; i < putanas.length; i++) {

    const currentPutana = putanas[i].id;
    console.log(currentPutana);

    $("#" + currentPutana).click(function() {
        $("#" + currentPutana).animate({
          top: "-=100px"
        }, 200);

        $("#" + currentPutana).animate({
          top: "+=100px"
        }, 300);
    });
  }
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function callPutanas() {

  var button = document.getElementById("putana-call-button");

  // check whether putanas weren't called yet
  if (button.style.cursor != "not-allowed") {

    var parent = document.getElementById("main-canvas");

    // load all putana images in loop
    for (putanaCounter = 1; putanaCounter < 9; putanaCounter ++) {

      const putanaId = "putana" + putanaCounter;
      var img = document.createElement("img");

      img.setAttribute("id", putanaId);
      img.src = "putanas/putana" + putanaCounter + ".png";
      img.setAttribute("class", "putana");


      // putana will always jump when being clicked
      img.onclick = function() {
          console.log(putanaId + 'should jump')
          $("#" + putanaId).animate({
            top: "-=100px"
          }, 200);

          $("#" + putanaId).animate({
            top: "+=100px"
          }, 300);
      };

      img.style.top = horizon * worldHeight - putanaHeight/2.;
      img.style.left = 50 + worldWidth/10. * putanaCounter;
      parent.appendChild(img);

      // putana appears and jumps
      $("#" + putanaId).animate({
        top: "-=100px"
      }, 200);

      $("#" + putanaId).animate({
        top: "+=100px"
      }, 300);

      // after 200ms the next putana is loaded
      await sleep(200);
    }
  }


  button.style.opacity = 0.6;
  button.style.cursor = "not-allowed";

  $('#letsgo').fadeOut(3000);

}


$(document).ready(function() {
  //make "Vyzvat putan" slowly appear on the screen
  $('#letsgo').hide().delay(300).fadeIn(3000);

  // two canvases
  // front-canvas has z-index 0
  const frontCanvas = document.getElementById("front-canvas")
  // front-canvas has z-index -1
  const backCanvas = document.getElementById("back-canvas")
  frontCanvas.width = window.innerWidth
  frontCanvas.height = window.innerHeight
  backCanvas.width = window.innerWidth
  backCanvas.height = window.innerHeight

  // draws sky and earth
  background = new Background(backCanvas)
  // draws nothing
  frontback = new EmtpyBackground(frontCanvas)
  // snow on the back (depth is in [0.5, 10])
  backSnow = new Snow(backCanvas, 1250, 0.5, 10)
  // snow in the front (depth is in [0.5, 10])
  frontSnow = new Snow(frontCanvas, 250, 0, 0.5)

  // christmas tree, includes lights
  tree = new Tree(backCanvas, 100)

  // ... discoball
  discoball = new Discoball(backCanvas, segments=50);

  const button = document.getElementById("party-button");
  const music = document.getElementById("music-start");
  const musicSource = document.getElementById("music-source");

  button.onclick = function() {
    musicSource.src = hardcore;
    music.pause();
    music.load();
    music.play();

    setTimeout(function() {
      for (i = 1; i < 9; ++i) {
        makePutanaDance(i);
      }

      // make it appear
      discoball.turnOn();

      // lights make color cycle within 500 ms
      // the default is 7500 ms.
      tree.setCycle(500);
    }, 3200);
  }

  background.init()
  frontback.init()
  backSnow.init()
  frontSnow.init()
  tree.init()
  discoball.init()

  // what to do if browser is resized
  window.onresize = function() {
    frontCanvas.width = window.innerWidth
    frontCanvas.height = window.innerHeight
    backCanvas.width = window.innerWidth
    backCanvas.height = window.innerHeight

    backSnow.resize()
    frontback.resize()
    frontSnow.resize()
    background.resize()
    tree.resize()
    discoball.resize()
  }

  // draws current scene then request new animation frame.
  function drawLoop() {
    window.requestAnimationFrame(function() {
      background.draw();
      backSnow.draw()
      tree.draw();
      frontback.draw()
      frontSnow.draw()
      discoball.draw()

      drawLoop();
    })
  }

  drawLoop()

  // start playing ordinary "jingle bells" when the page loads
  //$("#music-start").get(0).play();
  music.loop = true;
  music.play()
});

function makePutanaDance(putanaId) {
  const id = 'putana' + putanaId
  const putana = document.getElementById(id);
  const delta = 500; // ms

  const jump = function(dt) {
    // putana appears and jumps
    $("#" + id).animate({
      top: "-=100px"
    }, 200 + dt);

    $("#" + id).animate({
      top: "+=100px"
    }, 300);
  }

  const handeHoch = function() {
    putana.src = 'putanas/putana' + putanaId + '_up.png';
    const dt = Math.random(Math.random() * 250)
    jump(dt);
    setTimeout(handeOben, delta + dt);
  }

  const handeOben = function() {
    putana.src = 'putanas/putana' + putanaId + '.png';
    jump(0);
    setTimeout(handeHoch, delta);
  }

  handeOben();
}
