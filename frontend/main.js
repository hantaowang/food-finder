$( document ).ready(function() {

console.log("OK");

  $(".card-1").click(getAjax("card-1"));
  $(".card-2").click(getAjax("card-2"));

  function getAJAX(cls) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "0.0.0.0:4567/" +  cls);
    xhttp.onload = function() {
      var text = JSON.parse(xhttp.responseText)["text"];
      var img = JSON.parse(xhttp.responseText)["img"];
      renderHTML(cls, data, img);
    };
    xhttp.send();
  }

  function renderHTML(cls, data, img) {
    $("#animals").html(data);
  }

});
