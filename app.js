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

var putanaCounter = 0;

function callPutanas() {
  var parent = document.getElementById("main-canvas");
  var img = document.createElement("img");

  const putanaId = "putana" + putanaCounter;
  putanaCounter += 1;
  img.setAttribute("id", putanaId);

  img.setAttribute("class", "putana");
  img.onclick = function() {
      console.log(putanaId + 'should jump')
      $("#" + putanaId).animate({
        top: "-=100px"
      }, 200);

      $("#" + putanaId).animate({
        top: "+=100px"
      }, 300);
  };
  img.src = "putanas/putanapink_up.png";
  parent.appendChild(img);
}

// function go() {
//  var fileinput = document.getElementById("finput");
//  var filename = fileinput.value;
//  var answer = "Знаешь, где у тебя " + filename + "?"
//
//  var parent = document.getElementById("fieldset");
//  console.log(parent);
//
//  var currentChild = document.getElementById("message");
//  console.log(currentChild);
//
//  if (currentChild != null) {
//   parent.removeChild(currentChild);
//  }
//
//
//  var paragraph = document.createElement("p");
//  paragraph.setAttribute("id", "message");
//  console.log(paragraph);
//  var node = document.createTextNode(answer);
//  paragraph.appendChild(node);
//  console.log(paragraph);
//
//
//  var child = document.getElementById("message");
//  parent.appendChild(paragraph);
//
// }



// var moveMenu = function() {
//     $('.icon-menu').click( function() {
//         $('.menu').animate({
//             left: '0px'
//             }, 200);
//
//         $('body').animate({
//             left: '285px'
//             }, 200);
//         });
//
//     $('.icon-close').click( function() {
//         $('.menu').animate({
//             left: '-285px'
//             }, 200);
//
//         $('body').animate({
//             left: '0px'
//             }, 200);
//         })
// };

// $(document).ready(putanaJump);
