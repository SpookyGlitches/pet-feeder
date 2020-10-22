
const quantity = document.getElementById('quantity')
quantity.addEventListener('change', (event) => {
  if(quantity.value > 10 || quantity.value < 0){
    quantity.value = 1;
  }
  let schedules = document.getElementById('schedules')
  var btn = document.createElement('BUTTON');
  let str = "";
  for(let x=0; x<quantity.value; x++){
    str += `<div class='form-group'><input type='time' class='form-control' name='schedules[${x}]' id='' aria-describedby='helpId' placeholder=''><small id='helpId' class='form-text text-muted'>Schedule #${x+1}</small></div>`
  }
  schedules.innerHTML = str
});
let cards = document.getElementsByClassName("card-deck");
let card = document.createElement("div");
card.classList.add("card")
card.classList.add("border-0")
card.classList.add("bg-light")
card.innerHTML = "<div class='card-body text-center p-3 d-flex justify-content-center' style='align-items:center'> <svg width='2.5em' height='2.5em' viewBox='0 0 16 16' class='bi bi-plus-circle-fill text-secondary' fill='currentColor' xmlns='http://www.w3.org/2000/svg' data-toggle='modal' data-target='#modelId'> <path fill-rule='evenodd' d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z'/> </svg> </div> ";
if((cards[cards.length-1].childElementCount % 3) == 0){
    let carddeck = document.createElement("div");
    carddeck.classList.add("card-deck")
    carddeck.append(card)
    document.getElementById("crd").append(carddeck);
}else{
  cards[cards.length-1].append(card);
}