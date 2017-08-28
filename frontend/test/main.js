$(document).ready(function(){

  var sessionID = null;
  var resaurant_map = null;
  var details = null;

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

      if (next == 'results') {
          restaurant_map = buildtable(data);
          details = data;
          $("#swipe").hide();
          $("#list").show();
          return;
      }

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

      if (next == 'results') {
          restaurant_map = buildtable(data);
          details = data;
          $("#swipe").hide();
          $("#list").show();
          return;
      }

      $("#categories").html(data["categories"].join(", "));
      $("#name").html(data["name"]);
      $("#card_img").attr("src", data["img"]);
      next = data["next"]
    });

  });

  $(document).on("click", ".clickable_row", function() {
      id = $(this).attr('id');
      restaurant = restaurant_map[id];
      card_template = '<img class="card-img-top" src="' + details[restaurant]['image_url']
                 + '" alt="Card image cap"> <div class="card-block"> <h4 class="card=title">'
                 + restaurant + '</h4> <p class="card-text"> Location: ' + details[restaurant]['address']
                 + '<br /> Rating: ' + details[restaurant]['rating'] + ' Price: '
                 + details[restaurant]['price'] + '<br /> Is Closed: ' + details[restaurant]['is_closed']
                 + '<br /> Phone: ' + details[restaurant]['phone'] + '<br /> Website: '
                 + details[restaurant]['url'] + '</p> </div>';
      $("#result_card").html(card_template);
  });

  function buildtable(details){
      template = '<tbody>';
      n = 0;
      restaurants = {};
      console.log(Object.keys(details).join(','));
      for (var r in details) {
          template += '<tr class="clickable_row" id="table_details_' + n.toString() + '"> <td>' + r + '</td> <td>' + details[r]['categories'].join(', ') + '</td> </tr>';
          restaurants['table_details_' + n.toString()] = r;
          n += 1;
      }
      template += '</tbody>';

      $("#resttable").html($("#resttable").html() + template);

      return restaurants;
  }
});
