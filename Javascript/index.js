


main();

function main() {
    getArticles();
};

// Récuperation des produits depuis l'API localhost:3000
function getArticles() {
    fetch('http://localhost:3000/api/teddies')
    .then(function (response) {
        return response.json();
    })
    
    .then(function (resultsAPI) {
        const ARTICLES = resultsAPI;
        console.log(ARTICLES);

        for(article in ARTICLES) {

        let cardProduct = document.createElement('div');
        document.querySelector('#products-container').appendChild(cardProduct);
        cardProduct.classList.add('card-product');

        let linkProduct = document.createElement('a');
        cardProduct.appendChild(linkProduct);
        linkProduct.href = `product.html?id=${resultsAPI[article]._id}`;
        linkProduct.classList.add('link');

        let divImgProduct = document.createElement('div');
        linkProduct.appendChild(divImgProduct);
        divImgProduct.classList.add('img-product');
        
        let imgProduct = document.createElement('img');
        divImgProduct.appendChild(imgProduct);
        imgProduct.src = resultsAPI[article].imageUrl;

        let productInfos = document.createElement('div');
        divImgProduct.appendChild(productInfos);
        productInfos.classList.add('product-infos');


        let productTitle = document.createElement('div');
        productInfos.appendChild(productTitle);
        productTitle.classList.add('product-title');
        productTitle.innerHTML = resultsAPI[article].name;
        
        let priceProduct =document.createElement('div');
        productInfos.appendChild(priceProduct);
        priceProduct.classList.add('price-product');
        priceProduct.innerHTML = resultsAPI[article].price;

        
        //Changement du format du prix doc MDN https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
        resultsAPI[article].price = resultsAPI[article].price / 100;
        priceProduct.innerHTML = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(resultsAPI[article].price);
    
        }
    })

    .catch (() => {
        let products = document.querySelector('.container-title');
        products.innerHTML = `Désolé nous n'avons pas réussi à afficher nos produits.`;
        products.style.fontSize = '25px';
        products.style.fontWeight = 'bold';
        console.log(products);
    });

}