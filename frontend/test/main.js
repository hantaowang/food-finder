$(document).ready(function(){

  var sessionID = null;
  $.post("http://0.0.0.0:8000/api/login/", { TYPE: "session"},
  function(data) {
    sessionID = data;
  });

  $("#login").click(function(){
    var email = $("#email").val();
    var password = $("#password").val();

    $.post("http://0.0.0.0:8000/api/login/", { TYPE: "validate", NAME: email, PASS: password, SESSION: sessionID},
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

    $.post("http://0.0.0.0:8000/api/login/", { TYPE: "createuser", NAME: email, PASS: password, SESSION: sessionID},
    function(data) {
      console.log(data)
      if (data == 'Duplicate') {
        alert("Username already exists");
      }
    });

  });
});
