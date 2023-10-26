const items = document.getElementById('items');
const templateCard = document.getElementById('template-card').content;
const templateProduct = document.getElementById('template-product').content;
const fragment = document.createDocumentFragment();

// Contadores por ID de producto
const contadorPorId = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('/Json/productos.json');
        const data = await response.json();
        pintarCards(data.productos);
    } catch (error) {
        console.log(error);
    }
}

function pintarCards(productos) {
    productos.forEach((producto) => {
        const cardClone = templateCard.cloneNode(true);
        const productClone = templateProduct.cloneNode(true);

        const card = cardClone.querySelector('.card');
        const img = card.querySelector('.card-img-top');
        const title = card.querySelector('.card-title');
        const type = card.querySelector('.card-text:nth-child(2)');
        const price = card.querySelector('.card-text:nth-child(3)');
        const buyButton = card.querySelector('.btn');

        img.src = producto.img;
        title.textContent = producto.titulo;
        type.textContent = `Tipo: ${producto.tipo}`;
        price.textContent = `Precio: $${producto.precio.toFixed(2)}`;
        buyButton.dataset.id = producto.id;
        buyButton.addEventListener('click', incrementar);

        fragment.appendChild(cardClone);

        // Agrega un nuevo producto con contador
        const productCard = productClone.querySelector('.card');
        const productTitle = productCard.querySelector('.card-title');
        const productCounter = productCard.querySelector('.card-text span');
        productTitle.textContent = producto.titulo;
        
        // Verifica si hay un contador en el almacenamiento local
        const storedCounter = JSON.parse(localStorage.getItem(`contador-${producto.id}`));
        if (storedCounter) {
            contadorPorId[producto.id] = storedCounter;
        } else {
            contadorPorId[producto.id] = 0;
        }

        productCounter.textContent = contadorPorId[producto.id];
        fragment.appendChild(productClone);
    });

    items.innerHTML = '';
    items.appendChild(fragment);
}

// Contadores
function incrementar(event) {
    const id = event.currentTarget.dataset.id;

    if (!contadorPorId[id]) {
        contadorPorId[id] = 0;
    }

    contadorPorId[id]++;

    // Actualiza el contador en el nuevo template-product
    const contadorSpan = document.querySelector(`[data-id="${id}"] .card-text span`);

    if (contadorSpan) {
        contadorSpan.textContent = contadorPorId[id];
        // Guarda el contador en el almacenamiento local
        localStorage.setItem(`contador-${id}`, JSON.stringify(contadorPorId[id]));
    }
}
