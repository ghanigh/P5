      // Voir le panier à partir du stockage local de la machine 
let panier = localStorage.getItem("panier");
let emplacementPanier = document.getElementById('cart__items');
if(panier != null){
panier = JSON.parse(panier);
let total = 0;
let nbArticles = 0;
prixCanape = [];
panier.forEach((choix, index) => {
    //Avec choix._id faire un fetch pour récupérer un canapé (comme dans product
    //puis modifier les données qui sont entre les lignes 55 à 70)
    fetch("http://localhost:3000/api/products/" + choix._id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (canape) {
        prixCanape[canape._id] = canape.price;
        total = total + (canape.price * choix.quantite);
        nbArticles = nbArticles + parseInt(choix.quantite);
        let elementPanier = "<article class=\"cart__item\" data-id=\"" + canape._id + "\" data-color=\"" + choix.couleur + "\"> \
        <div class=\"cart__item__img\"> \
          <img src=\"" + canape.imageUrl + "\" alt=\"" + canape.altTxt + "\"> \
        </div> \
        <div class=\"cart__item__content\"> \
          <div class=\"cart__item__content__description\"> \
            <h2>" + canape.name + "</h2> \
            <p>" + choix.couleur + "</p> \
            <p>" + (canape.price * choix.quantite) + " €</p> \
          </div> \
          <div class=\"cart__item__content__settings\"> \
            <div class=\"cart__item__content__settings__quantity\"> \
              <p>Qté : </p> \
              <input type=\"number\" class=\"itemQuantity\" name=\"itemQuantity\" min=\"1\" max=\"100\" value=\"" + choix.quantite + "\" onChange=\"recalculTotal()\"> \
            </div> \
            <div class=\"cart__item__content__settings__delete\"> \
              <p class=\"deleteItem\">Supprimer</p> \
            </div> \
          </div> \
        </div> \
      </article> ";
      emplacementPanier.insertAdjacentHTML("beforeend", elementPanier);
      let emplacementTotal = document.getElementById('totalPrice');
      emplacementTotal.innerText = total;
      let emplacementQuantite = document.getElementById('totalQuantity');
      emplacementQuantite.innerText = nbArticles;
      let listeBoutonSupprimer = document.getElementsByClassName('deleteItem');
      for(let i = 0; i < listeBoutonSupprimer.length; i++){
        listeBoutonSupprimer[i].addEventListener('click', function(event){
          let article = this.parentNode.parentNode.parentNode.parentNode;
          let conteneurArticles = article.parentNode;
          conteneurArticles.removeChild(article);
         recalculTotal();
        });
      }
    })
    .catch(function (error) {
        console.log("Erreur : " + error);
    })



})

}
else{
    
    emplacementPanier.innerHTML = "<h2>Votre panier est vide</h2>";
}
// fonction qui permet de recalculé tous les articles du panier pour avoir le vrai prix total
function recalculTotal(){
  let listeCanape = document.getElementsByClassName("cart__item");
  let total = 0;
 
  for(let i = 0; i< listeCanape.length; i++){
    let quantite = listeCanape[i].children[1].children[1].children[0].children[1].value;
    let canapeId = listeCanape[i].attributes[1].value;
    total = total + (quantite * prixCanape[canapeId]);

    let emplacementTotal = document.getElementById('totalPrice');
    emplacementTotal.innerText = total;
  }

}

let boutonCommander = document.getElementById('order');
boutonCommander.addEventListener('click', function(event){
//Se déclenche lorsqu'on clique sur le bouton commander
//Récupérer chacune des valeurs du formulaire
//Vérifier pour chaque valeur qu'il y a une information, sinon afficher un message d'erreur
event.preventDefault();
let erreur = false;
const regexname = /(^[a-zA-Z -]{3,})/;
//Gestion du prénom
let prenom = document.getElementById('firstName').value;
let errorMsgFisrtName = document.getElementById("firstNameErrorMsg");
errorMsgFisrtName.innerText = "";
let errorMsgLastName = document.getElementById("lastNameErrorMsg");
errorMsgLastName.innerText = "";
let errorMsgAddress = document.getElementById("addressErrorMsg");
errorMsgAddress.innerText = "";
let errorMsgCity = document.getElementById("cityErrorMsg");
errorMsgCity.innerText = "";
let errorMsgEmail = document.getElementById("emailErrorMsg");
errorMsgEmail.innerText = "";
if(!regexname.test(prenom)){
    erreur = true;
    errorMsgFisrtName.innerText = "Merci d'indiquer un prénom de plus de 3 caractères";
    //alert("Vous devez entrer au minimum 3 lettres pour votre prénom.");
}
//Gestion du nom
let nom = document.getElementById('lastName').value;
if(!regexname.test(nom)){
    erreur = true;
    errorMsgLastName.innerText = "Merci d'indiquer un nom de plus de 3 caractères";
    //alert("Vous devez entrer au minimum 3 lettres pour votre nom.");
}
//Gestion de l'adresse
let adresse = document.getElementById('address').value;
if(adresse.length < 3){
    erreur = true;
    errorMsgAddress.innerText = "Merci d'indiquer une adresse de plus de 3 caractères";
    //alert("Vous devez entrer au minimum 3 lettres pour votre adresse.");
}
//Gestion de la ville
let ville = document.getElementById('city').value;
if(!regexname.test(ville)){
    erreur = true;  
    errorMsgCity.innerText = "Merci d'indiquer un nom de ville de plus de 3 caractères";
    //alert("Vous devez entrer au minimum 3 lettres pour votre ville.");
}
const regexemail = /(^[\w-_\.]+@[\w-_\.]+\.[\w]{2,4})/;
//Gestion de l'email
let email = document.getElementById('email').value;
if(!regexemail.test(email)){
    erreur = true;
    errorMsgEmail.innerText = "Merci d'indiquer une adresse email valide : des caractères suivis par un arobase puis un nom de domaine complètement qualifié";
    //alert("Vous devez entrer au minimum 3 lettres pour votre email.");
}
/*if(erreur==true) {
  alert("Il y a une erreur dans vôtre formulaire, tous les champs doivent être rempli avec au minimum 3 carractères.");
  
}*/
if(!erreur){
    let listeIdCanape = [];
    panier.forEach((choix, index) => {
        listeIdCanape.push(choix._id);
    });

    let message = {
        contact: {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          address: document.getElementById('address').value,
          city: document.getElementById('city').value,
          email: document.getElementById('email').value
        },
        products: listeIdCanape
    };
    console.log("Contenu de la variable message : "+ JSON.stringify(message));
    localStorage.removeItem("confirmationCommande");
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
    .then(function (res) {
      if (res.ok) {
          return res.json();
      }
    })
    .then(function (confirmationCommande) {
      console.log("Confirmation de commande : " + JSON.stringify(confirmationCommande));
      localStorage.setItem("confirmationCommande", JSON.stringify(confirmationCommande));
      window.location.href="confirmation.html";
    })
    .catch(function (error) {
      console.log("Erreur : " + error);
    });
  }

});




