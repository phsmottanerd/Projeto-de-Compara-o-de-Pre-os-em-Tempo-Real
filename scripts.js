/*
[] Pegar os dados do input, quando o botão for clicado
[] Ir até o servidor e trazer os produtos
[] Colocar os produtos na tela
[] Criar os gráficos de preços
*/

const searchForm = document.querySelector('.search-form');
const productList = document.querySelector('.product-list');
const priceChart = document.querySelector('.price-chart');

let myChart = '';

searchForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const inputValue = event.target[0].value;
    console.log(event);
    const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`);
    const products = (await data.json()).results.slice(0, 10);
    displayItems(products);
    updatePriceChart(products);
});

function displayItems(products) {
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.thumbnail.replace('I.jpg', 'O.jpg')}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="product-price">${product.price.toLocaleString('pt-br', { style: "currency", currency: 'BRL' })}</p>
            <p class="product-store">${product.seller.nickname}</p>
        </div>
    `).join('');
}

function updatePriceChart(products) {
    const ctx = priceChart.getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(product => product.title.substring(0, 20) + '...'),
            datasets: [{
                label: 'preço(R$)',
                data: products.map(product => product.price),
                backgroundColor: 'rgba(52,152,219, 0.6)',  // Cor de fundo azul suave
                borderColor: 'rgba(52,152,219, 1)',        // Cor da borda azul mais forte
                borderWidth: 4,
                borderRadius: 2,  // Corrigido para 'borderRadius'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$' + value.toLocaleString('pt-br', {
                                style: "currency", currency: 'BRL'
                            });
                        }
                    },
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Compara Preços',
                    font: {
                        size: 18
                    }
                }
            }
        }
    });
}
