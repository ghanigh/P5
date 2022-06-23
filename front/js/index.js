// Permet de communiqué avec le serveur
fetch("http://localhost:3000/api/products")
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (listeCanapes) {
        //console.log(listeCanapes[0].name);
        let section = document.getElementById("items");
        listeCanapes.forEach((canape, index) => {
            let a = document.createElement("a");
            a.innerHTML = " \
            <article>\
            <img src=\" "+ canape.imageUrl + " \" alt=\" " + canape.altTxt + " \">\
            <h3 class=\"productName\">"+ canape.name + "</h3>\
            <p class=\"productDescription\">"+ canape.description + "</p>\
          </article>\
            ";
            a.href = "./product.html?id="+canape._id;
            section.appendChild(a);
        });
    })
    .catch(function (error) {
        console.log("Erreur : " + error);
    })