

// Déclaration de la variable "addedProduct" dans laquelle on met les clés et les valeurs dans le LS
const addedProduct = JSON.parse(localStorage.getItem("products"));
let cartRecap = document.querySelector(".card-recap"); // On selectionne l'endroit dans le html ou vont se retrouver les infos du panier


//********** Affichage des produits du panier *************/

main();

function main() {

    cartDisplay(); // Fonction qui va permettre de dispatcher les informations produit dans le html
    countTotalInCart(); // Fonction qui affichera le prix total du panier et qui calcula automatiquement si il y a plusieurs produits
    toEmptyCart(); // Fonction qui lorsque l'on clique sur le bouton "vider le panier" celui-ci se vide entierement et affiche un message
    checkForm(); // Fonction qui va permettre de vérifier si toutes les informations du formulaire soit remplit avec les bonnes valeurs
}

function cartDisplay () {

    let cartInformations = document.querySelector(".info-cart");
    let emptyCart = document.querySelector(".if-empty-cart"); // Variable qui affichera un message que le panier ne contient aucun article

    // Si le tableau du LS contient au moins un produit on affichera le le panier et on supprimera le message
    if(localStorage.getItem("products")) {

        emptyCart.style.display = "none"; // Le message emptyCart se trouve dans une balise h2 dans le html 
    
    // Pour chaque objet du LS copié on crée les divs de l'affichage du panier et on les remplit avec les données du LS
    for(let product in addedProduct) { // addedProduct est la variable dans laquelle se trouve valeurs et clés des produits

        let productList = document.createElement("div");
        cartRecap.insertBefore(productList, cartInformations); // insertbefore me permet d'inserer la liste des produits avant un noeud parent
        productList.classList.add("card-recap-row", "product-list");

        let divProductImage = document.createElement("div");
        productList.appendChild(divProductImage);
        divProductImage.classList.add("info-product");

        let productImage = document.createElement("img");
        divProductImage.appendChild(productImage);
        productImage.src = addedProduct[product].imageUrl;

        let nameProduct = document.createElement("div");
        productList.appendChild(nameProduct);
        nameProduct.classList.add("info-product");
        nameProduct.innerHTML = addedProduct[product].name;

        let productQuantity = document.createElement("div");
        productList.appendChild(productQuantity);
        productQuantity.classList.add('info-product');
        productQuantity.innerHTML = addedProduct[product].quantity;

        let productPrice = document.createElement("div");
        productList.appendChild(productPrice);
        productPrice.classList.add('info-product');

        // Formatage du prix et calcule de celui-ci si le panier contient plusieur articles
        productPrice.innerHTML = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(addedProduct[product].price * addedProduct[product].quantity);
    };
    
    }
    // Si le panier ne contient aucun article on affichera "votre panier ne contient aucun article" 
    else{

        emptyCart.style.width = "50%";
        emptyCart.style.textAlign = "center";
    }
};



//********** Le montant total du panier *************/

function countTotalInCart () {

    // Déclaration de la variable pour pouvoir y mettre le prix total du panier dans un tableau
    let arrayOfPrice = [];
    let totalPrice = document.querySelector(".total"); // Sélection de la div qui contiendra le prix total si le panier contient au moins 1 article

    // On va chercher les prix dans le panier
    if(addedProduct !== null) {

        for(let product = 0; product < addedProduct.length; product++) {
            
            let priceProductInCart = addedProduct[product].price * addedProduct[product].quantity;
        
        // Insertion des prix du panier dans la variable "totalPrice"
        arrayOfPrice.push(priceProductInCart)
        
        }
    } 
        // Si il n'y a pas de produit donc pas de prix d'afficher on met en 'display none' la div "h2 class= total" 
    else {
        totalPrice.style.display = "none";
    }

    // Additionner les prix du tabeau de la variable "totalPrice" avec la méthode 'Reducer'
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    const totalPriceInCart = arrayOfPrice.reduce(reducer, 0);

    // On affiche le prix du ou des produits dans la div "h2 class=total" du html
    totalPrice.innerHTML = `Montant total de votre panier : ${totalPriceInCart} €`;      
};

function toEmptyCart() {

    // Lorsque l'on cliquera sur le bouton "vider le panier" celui-ci videra le localStorage et actualisera la page "cart.html"
    const clickButtonToEmptyCart = document.querySelector(".button-to-empty-cart");
    clickButtonToEmptyCart.addEventListener("click", () => {
        localStorage.clear();
    });
};


//********** Le Formulaire de commande *************/

function checkForm() {

    //On récupère les inputs du formulaire depuis le DOM

    const buttonToSubmit = document.querySelector("#submit");
    let inputName = document.querySelector("#name");
    let inputLastName = document.querySelector("#lastname");
    let inputAddress = document.querySelector("#address");
    let inputCity = document.querySelector("#city");
    let inputPostalCode = document.querySelector("#postal-code");
    let inputEmail = document.querySelector("#email");
    let inputPhone = document.querySelector("#phone");
    const errorMessage = document.querySelector(".error-message");

    // Lorsqu'un champs n'est pas renseigné on affiche un message d'erreur et on empêche l'envoie du formulaire
    buttonToSubmit.addEventListener("click", (event) => {
        if(
            !inputName.value ||
            !inputLastName.value ||
            !inputAddress.value ||
            !inputCity.value ||
            !inputPostalCode.value ||
            !inputEmail.value ||
            !inputPhone.value
        ) {
            event.preventDefault();
            errorMessage.innerHTML = "Veuillez remplir tous les champs !"
            // Donner un peu de style CSS à la div "error-message"
            errorMessage.style.background = "red";
            errorMessage.style.border = "1px solid black";
            errorMessage.style.marginTop = "15px";

        }

        // On vérifie également que le numéro de téléphone soit valide (chiffre) sinon on empêche toujours l'envoie du formulaire
        else if (isNaN(inputPhone.value)) {

            event.preventDefault();
            errorMessage.innerHTML = "Votre numéro de téléphone n'est pas valide !";
            errorMessage.style.background = "red";
            errorMessage.style.border = "1px solid black";
            errorMessage.style.marginTop = "15px";
        }
        // Si le formulaire est correct on supprimera le message d'erreur
        else {

            errorMessage.style.display = "none";
        
        // Si Le formulaire est correct on va crée un tableau "productsToBought" qui contiendra l'objet des produits mis dans le panier (uniquement le ID)
        let productsToBought = addedProduct.map((products) => {

            return products._id;
        })

        // On crée également un tableau "toOrder" qui contiendra le tableau "productsToBought" et l'objet des informations de l'acheteur
        let toOrder = {

            contact: {
                firstName: inputName.value,
                lastName: inputLastName.value,
                city: inputCity.value,
                address: inputAddress.value,
                email: inputEmail.value,
            },

            products: productsToBought,
        };

        
        //******* Envoi des informations au back-end avec la méthode POST *******/

            // !!!! A ce stade nous sommes toujours dans l'écoute du bouton "commander" et dans le "else" après avoir validé le formulaire !!!!
        
            // Création de l'en-tête de la requête
            const option = {
                method: "POST",
                body: JSON.stringify(toOrder),
                headers: {"Content-Type": "application/json"},
            }

            //Prépration pour affichage du prix déjà formaté dans la page suivante "confirmation.html"
            let priceToConfirmation = document.querySelector(".total").innerText;
            priceToConfirmation = priceToConfirmation.split(" :");

            // Envoie de la requête au back-end avec l'en-tête de celle-ci avec la méthode "fetch" 
            fetch("http://localhost:3000/api/teddies/order", option)
                
                .then((response) => response.json())

                .then((data) => {
                    localStorage.clear(); // Ici on vide entièrement le LS 
                    localStorage.setItem("orderId", data.orderId); // Ici on ajoute au LS seulement le numéros de commande (orderId) qui nous a été fournis
                    localStorage.setItem("total", priceToConfirmation[1]); // Ici on ajoute au LS le Prix Total des produits pour pouvoir les insérer au bon endroit dans la page de confirmation 
                    console.log("data"); 
                    console.log(data);

                // Chargement de la page confirmation.html dés que l'on clique sur le bouton "Commander" 
                document.location.href = "confirmation.html";
                
            })
        }            
    });
};