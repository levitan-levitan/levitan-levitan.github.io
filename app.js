// var putanaJump = function() {
//
//   var putanas = document.getElementsByClassName("putana");
//
//   for (i = 0; i < putanas.length; i++) {
//
//     const currentPutana = putanas[i].id;
//     console.log(currentPutana);
//
//     $("#" + currentPutana).click(function() {
//         $("#" + currentPutana).animate({
//           top: "-=100px"
//         }, 200);
//
//         $("#" + currentPutana).animate({
//           top: "+=100px"
//         }, 300);
//     });
//   }
// };

var putanaHeight = 200;

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
  $('#letsgo').hide().delay(300).fadeIn(3000);
});
