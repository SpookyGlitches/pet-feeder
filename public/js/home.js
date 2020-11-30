
document.getElementById('quantity').addEventListener('change', (event) => {
  if(quantity.value > 10 || quantity.value < 0){
    quantity.value = 1;
  }
  let schedules = document.getElementById('schedules')
  let str = "";
  for(let x=0; x<quantity.value; x++){
    str += `<div class='form-group'><input type='time' class='form-control' name='schedules' id='' aria-describedby='helpId' placeholder=''><small id='helpId' class='form-text text-muted'>Schedule #${x+1}</small></div>`
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
  if($(".card-deck").length == 0){
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

    // console.log("ID is" + $(this).parent().parent().attr('id'));
    let id = $(this).parent().parent().parent().attr('id');
    $.ajax({
      type: "GET",
      url: `home/edit/${id}`,
      success: function (response) {
        let schedules = [];
        response.forEach((item) => {
          schedules.push(item.time)
        })
        $("#edit-name").val(response[0].name)
        $("#edit-details").val(response[0].details)
        $("#edit-schedules").html(schedules.toString())
        $("#edit").modal('show')
      }
    });
  })
  $(".bi-info-circle").click(function (e) { 
    $("#logs-body").html("");
    let id = $(this).parent().parent().parent().attr('id');
    $.ajax({
      type: "GET",
      url: "/home/"+id+"/logs",
      success: function (response) {
        response.forEach((item) => {
          $("#logs-body").append(`<p>Status: ${item.status} Duration: ${item.duration} Datetime: ${item.date_time}</p>`)
        })
        $("#logs").modal('show');
      }
    });
  });
  
});