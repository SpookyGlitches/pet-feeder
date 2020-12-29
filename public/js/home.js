
document.getElementById('quantity').addEventListener('change', (event) => {
  if (quantity.value > 10 || quantity.value < 0) {
    quantity.value = 1;
  }
  let schedules = document.getElementById('schedules')
  let str = "";
  for (let x = 0; x < quantity.value; x++) {
    str += `<div class='form-group'><input type='time' class='form-control' name='schedules' id='' aria-describedby='helpId' placeholder=''><small id='helpId' class='form-text text-muted'>Schedule #${x + 1}</small></div>`
  }
  schedules.innerHTML = str
});

document.querySelectorAll('.bi-trash').forEach(item => {
  item.addEventListener('click', event => {
    document.getElementById('modal-body-delete').innerHTML
  })
})
$(document).ready(function () {

  //ADD CARD
  if ($(".card-deck").length == 0) {
    //create card-deck for the add card
    $("#crd").append();
  }
  //DELETE 
  $(".bi-trash").click(function (e) {
    const id = $(this).parent().parent().parent().attr('id');
    $("#delete").modal('show');
    $("#modal-body-delete").html(`<input type='hidden' value='${id}' name='id'>`);
  });

  //EDIT
  $(".bi-pencil-square").click(function (e) {

    let id = $(this).parent().parent().parent().attr('id');
    $.ajax({
      type: "GET",
      url: `/home/edit/${id}`,
      success: function (response) {
        if (response) {
          $("#edit-id").val(id);
          $("#edit-name").val(response.name)
          $("#edit-details").val(response.details)
        }
        $("#edit").modal('show')
      }
    });
  })
  $(".bi-info-circle").click(function (e) {
    $("#info-body").html("");
    $("#logs-body").html("");
    const id = $(this).parent().parent().parent().attr('id');
    $.ajax({
      type: "GET",
      url: `/home/${id}/info`,
      success: function (response) {
        if (response) {
          let toAppend = "";
          toAppend += `<small>Duration: ${response.schedules[0].duration}</small><br>`
          toAppend += `<small>Arduino id:  ${response.pet.arduino_uuid}</small><br>`
          toAppend += `<small><a href='/home/code/${response.pet.arduino_uuid}'>Get code here</a></small><br>`
          toAppend += "<small>Schedules<ul>";
          response.schedules.forEach(item => {
            toAppend += `<li>${item.time}</li>`
          })
          toAppend += "</ul></small>"
          $("#info-body").html(
            toAppend
          )
        }
      }
    });
    $.ajax({
      type: "GET",
      url: `/home/${id}/logs`,
      success: function (response) {
        let toAppend = "";
        let status = "";
        response.forEach((item) => {
          toAppend = "";
          status = item.status == "SUCCESS" ? "alert-success" : "alert-danger";
          toAppend += `<div class='mb-2 alert ${status} d-flex flex-row justify-content-between'>`
          toAppend += `<p class='p-0 m-0'>Duration: ${item.duration}</p>`;
          toAppend += `<p class='p-0 m-0'>${item.date_time}</p>`;
          toAppend += "</div>"
          $("#logs-body").append(toAppend);
        })
        $("#logs").modal('show');
      }
    });
  });
  $(".btn-feed-now").click(function (e) {
    let parent = $(this).parent(); 
    // const details = {
    //   type:'req',
    //   id: $(parent).children().first().val(),
    //   uuid:$(parent).children().eq(1).val(),
    //   duration:$(parent).children().eq(2).val(),
    //   meta:"join"
    // }
    // // let serverUrl = "ws" + "://" + document.location.hostname + ":8080" ;
    // // let connection = new WebSocket(serverUrl,"json");
    // // connection.onopen = function(){
    // //   connection.send(JSON.stringify(details));
    // //   details.meta = "";
    // //   connection.send(JSON.stringify(details))
    // //   details.meta = "leave";
    // //   connection.send(JSON.stringify(details))
    // //   location.reload();
    // // }

  });
});