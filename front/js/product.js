const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
//console.log("ID : " + id);

// Permet de communiqué avec le serveur et de trouvé son id
fetch("http://localhost:3000/api/products/" + id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (canape) {
        //console.log("Canape : " + canape.name);
        //console.log("id canape " + canape._id);
        //console.log("Prix : " + canape.price);
        //console.log("URL image : " + canape.imageUrl);
        //console.log("Alt text : " + canape.altTxt);
        //console.log("Description : " + canape.description);
        let titre = document.getElementById("title");
        titre.innerText = canape.name;
        let prix = document.getElementById("price");
        prix.innerText = canape.price;
        let desc = document.getElementById("description");
        desc.innerText = canape.description;
        let image = document.getElementById("image");
        image.src = canape.imageUrl;
        image.alt = canape.altTxt;
        let select = document.getElementById("colors");
        canape.colors.forEach((couleur, index) => {
            let option = document.createElement("option");
            option.value=couleur;
            option.innerText=couleur;
            select.appendChild(option);
        });

        //Gestion de la commande
        let bouton = document.getElementById("addToCart");
        bouton.addEventListener('click', function(event){
        event.preventDefault();
        //console.log("Bouton cliqué");
        let select = document.getElementById('colors');
        let couleurChoisie = select.options[select.selectedIndex].value;
        let quantite = document.getElementById("quantity").value;
        if (couleurChoisie == ""){
            alert("Merci de choisir une couleur");
            return;
        }
        if(quantite == 0 || quantite > 100){
            alert("Merci de choisir une quantité comprise entre 0 et 100 articles");
            return;
        }
        console.log("Couleur : "+ couleurChoisie);
        console.log("Quantité : " + quantite);
        let choix = {
            "_id": canape._id,
            "couleur": couleurChoisie,
            "quantite": quantite
        };
        //On récupère le panier existant
        let panier = localStorage.getItem("panier");
        //Si le panier est vide
        if(panier == null){
            //On crée un panier qui est une liste d'éléments
            panier = [];
        }
        //Si le panier n'est pas vide
        else{
            //On transforme le panier en JSON pour pouvoir le manipuler
            panier = JSON.parse(panier);
        }
        //Si le panier est vide on ajouter le choix directement
        if(panier.length == 0){
            panier.push(choix);
        }
        //Si le panier contient déjà des articles on vérifie si on cherche à ajouter
        //le même article avec la même couleur
        else{
            //On initialise une variable pour savoir si on a modifié le panier (ce qui veut dire qu'on a mis à jour un article existant du panier)
            panierMiseAJour = false;
            //On fait les vérifications pour chaque article du panier
            panier.forEach(function(item, index) {
                //Si l'article que l'on souhaite ajouter au panier possède le même id et la même couleur 
                if(item._id == choix._id && item.couleur == choix.couleur){
                    //On met juste à jour la quantité
                    panier[index].quantite = parseInt(panier[index].quantite) + parseInt(choix.quantite);
                    //On indique que le panier a été modifié
                    panierMiseAJour = true;
                }
                
            })
            //Si le panier n'a pas été modifié dans la boucle au-dessus
            if(! panierMiseAJour){
                //On ajouter un choix à la liste d'éléments du panier
                panier.push(choix);
            }
        }
       
        //On stocke le panier mis à jour
        localStorage.setItem("panier", JSON.stringify(panier) );
    });


    })

    .catch(function (error) {
        console.log("Erreur : " + error);
    })

    


