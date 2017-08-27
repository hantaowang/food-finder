$(document).ready(function(){

  var sessionID = null;
  $.post("http://0.0.0.0:8000/api/login/session",
  function(data) {
    sessionID = data;
  });

  var next = "start"

  $("#login").click(function(){
    var email = $("#email").val();
    var password = $("#password").val();

    $.post("http://0.0.0.0:8000/api/login/validate", { NAME: email, PASS: password, SESSION: sessionID},
    function(data) {
      console.log(data)
      if (data == 'False') {
        alert("Incorrect Username and Password");
      } else {
        $("#title").html('Name: ' + data);
      }
    });

  });

  $("#create").click(function(){
    var email = $("#email").val();
    var password = $("#password").val();

    $.post("http://0.0.0.0:8000/api/login/createuser", { NAME: email, PASS: password, SESSION: sessionID},
    function(data) {
      console.log(data);
      if (data == 'Duplicate') {
        alert("Username already exists");
      }
    });

  });

  $("#left").click(function(){
    var loc = $("#location").val();
    if (loc == "") {
      alert("You must enter a location");
      return;
    }

    $.post("http://0.0.0.0:8000/api/get_restaurants/" + next, { SESSION: sessionID, LOCATION: loc, RESULT: "false"},
    function(data) {
      console.log(data);
      data = JSON.parse(data);
      $("#categories").html(data["categories"].join(", "));
      $("#name").html(data["name"]);
      $("#card_img").attr("src", data["img"]);
      next = data["next"]
    });

  });

  $("#right").click(function(){
    var loc = $("#location").val();
    if (loc == "") {
      alert("You must enter a location");
      return;
    }

    $.post("http://0.0.0.0:8000/api/get_restaurants/" + next, { SESSION: sessionID, LOCATION: loc, RESULT: "true"},
    function(data) {
      console.log(data);
      data = JSON.parse(data);
      $("#categories").html(data["categories"].join(", "));
      $("#name").html(data["name"]);
      $("#card_img").attr("src", data["img"]);
      next = data["next"]
    });

  });
});
