main();

function main() {

    displayPriceAndId();
}

function displayPriceAndId () {

    const totalPrice = document.querySelector('.total span');
    const orderId = document.querySelector('.order-id span');

    totalPrice.innerHTML = localStorage.getItem("total");
    orderId.innerText = localStorage.getItem("orderId");
} 

// On vide le local Storage une fois que nous avons la confirmation avec succés pour pouvoir repasser une commande 
localStorage.clear();