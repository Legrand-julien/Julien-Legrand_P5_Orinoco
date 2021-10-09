// Requête pour extraire le ID d'un seul produit dans l'URL
let params = (new URL(document.location)).searchParams;
let id = params.get("id");


// Création des variables et selection de l'emplacement des fiches produits img, prix, nom etc..
let cardProductImg = document.querySelector('.img');
let cardProductName = document.querySelector('.infos-title');
let cardProductDescription = document.querySelector('.infos-description');
let cardProductPrice = document.querySelector('.infos-price');
let cardTeddyNumber = document.querySelector('#teddies-number');
let cardColorSelect = document.querySelector('#color-select');

main();

function main() {
 
    if404(); // Fonction qui n'affichera rien si il y a une erreur dans l' URL de la page
    getArticles(); // Fonction de récupération du produit avec la requete searchParams 
    addToCart(); // Fonction qui permettra d'ajouter le/les produits desirers   
}

function if404() {
    window.addEventListener('error', (e) => {
        let container = document.querySelector('.container');
        container.innerHTML = `<p>Erreur lors du chargement, cette page n'existe pas.<br>
            <a class="back-to-home" href="index.html">Retour à la boutique</a>
        </p>`;
        container.style.color = 'white';
        container.style.fontSize = '32px';

        let linkBackToHome = document.querySelector('.back-to-home'); // Lien qui permet un retour à la page d'accueil
        linkBackToHome.style.color = 'white';
        linkBackToHome.style.display = 'flex';
        linkBackToHome.style.justifyContent = 'center';
        linkBackToHome.style.textDecoration = 'underline';
    },
    true); 
}

// Fonction qui affichera un message d'erreur si il y a un problême dans l'URL du produits
function displayErrorMessageFromApi() {

    let product = document.querySelector('.container');
                product.innerHTML = `Désolé nous n'avons pas réussi à afficher nos produit.`;
                product.style.textAlign = 'center';
                product.style.fontWeight = 'bold';
                product.style.backgroundColor = 'burlywood';
};




// on récupère un produit de la page d'acceuil pour que celui-ci s'affiche dans la page produit via la requête
function getArticles() {
    
    fetch(`http://localhost:3000/api/teddies/${id}`) // URL des produits en récupçrant leurs ID respectifs
        .then(function (response) {
            return response.json();
        })
        
        // On place les données reçu de l'API au bon endroits dans le HTML
        .then(function (resultsApi) {

            Articles = resultsApi;
            console.log(Articles); // Quand on choisi (clique) un produit depuis la page d'acceuil on change de page et on peut voir que l'on a bien le produit sélectionné 
        
            // Permet de voir le descriptif des produits placés dans le HTML avec queryselector au début du code
            cardProductName.innerHTML = Articles.name;
            cardProductDescription.innerHTML = Articles.description;
            cardProductImg.src = Articles.imageUrl;

            // On reformate le prix avec la même methode que sur index.js
            Articles.price = Articles.price / 100;
            cardProductPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
            }).format(Articles.price);  
            
            // On insère le choix de la couleur par l' utilisateur ici cela ne sera que visuelle aucune action n'est prévu
            let cardColorSelect = document.getElementById("color-select"); // On place l'option dans le input prévu a cette effet dans le html
                for(let i = 0; i < Articles.colors.length; i++) {
                    
                    let option = document.createElement("option");
                    cardColorSelect.appendChild(option);
                    option.innerHTML = Articles.colors[i];
                } 
        })
        .catch(() => { 

            displayErrorMessageFromApi();
                
        });
};

//****************** Le local Storage ****************/

//----------------- Stocker les valeurs du ou des produits selectionnés dans le LS -------------

function addToCart() {

    const buttonAddToCart = document.querySelector(".added-to-cart"); // Sélection du bouton "Ajouter au panier"
    const textToConfirmation = document.querySelector(".text-confirm");  // Variable qui permettra de voir si on à bien ajouter un produit au panier

    // Au clique sur le bouton avec la méthode addEventListener nous permettra de voir les produits qui seront ajoutés au panier 
    buttonAddToCart.addEventListener("click", () => {

    // Création de la variable "addedProducts" qui contiendra la fiche produit qui sera ajouté au panier
    let addedProducts = {

        imageUrl: cardProductImg.src,
        name: cardProductName.innerHTML,
        price: parseFloat(cardProductPrice.innerHTML), // La méthode parseFloat() permet de transformer une chaîne de caractère en nombre flottant aprés l'avoir analysé  
        quantity: parseFloat(document.querySelector("#teddies-number").value),
        _id: id,
    };

    // Déclaration de la variable "addedProduct" dans laquelle on met les clés et les valeurs dans le LS
    let addedProduct = JSON.parse(localStorage.getItem("products")); // JSON.parse sert pour convertir des donnéés au format JSON qui sont dans le LS en objet JS
    
    // Si il y a déjà des produits stocker dans le LS
    if(addedProduct) {

        addedProduct.push(addedProducts);
        localStorage.setItem("products", JSON.stringify(addedProduct)); // La méthode setItem() de l'interface Storage, lorsque lui sont passées le duo clé-valeur, les ajoute à l'emplacement de stockage, sinon elle met à jour la valeur si la clé existe déjà.
    }
    // Si il n'y a pas de produits de stocker dans le LS
    else{

        addedProduct = [];
        addedProduct.push(addedProducts);
        localStorage.setItem("products", JSON.stringify(addedProduct));
    };

    // Effet visuel pour l'utilisateur lorsqu'il a bien ajouté un produit au panier avec sa quantity et le nom du produit
    
    if(cardTeddyNumber.value > 1) { // Rajoute un "S" à peluche si le nombre de peluche est supérieur à 1 

        textToConfirmation.innerHTML = `Vous avez ajouté ${addedProducts.quantity} peluches ${addedProducts.name} à votre panier !`;
    
    }else{ // Si la valeur est = 1 alors peluche restera sans "S"

        textToConfirmation.innerHTML = `Vous avez ajouté ${addedProducts.quantity} peluche ${addedProducts.name} à votre panier !`;
    }

    });
}

