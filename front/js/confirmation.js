// Confirmation de la commande a partir du stockage local
let confirmationCommande = localStorage.getItem("confirmationCommande");
confirmationCommande = JSON.parse(confirmationCommande);
console.log("OrderId : " +confirmationCommande.orderId);
let OrderId = document.getElementById("orderId");
OrderId.innerText = confirmationCommande.orderId;
localStorage.removeItem("panier");