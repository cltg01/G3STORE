// Define a quantidade inicial de pizzas no modal como 1
let modalqt = 1;
let cart = []
let modalkey = 0;
// Função para selecionar um único elemento do DOM
const c = (el) => document.querySelector(el);

// Função para selecionar múltiplos elementos do DOM
const cs = (el) => document.querySelectorAll(el);

// Percorre os itens do array pizzaJson e mapeia suas informações
pizzaJson.map((item, index) => {
    // Clona o modelo de um item de pizza no HTML
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // Adiciona um atributo ao elemento para identificar qual pizza está sendo exibida
    pizzaItem.setAttribute('data-key', index);

    // Preenche as informações do item de pizza com nome, descrição, preço e imagem
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    // Adiciona um evento ao botão "Ver Mais" para abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault(); // Evita o comportamento padrão do link

        // Obtém o índice da pizza clicada
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalqt = 1; // Reseta a quantidade de pizzas no modal para 1
        modalkey = key;
        // Preenche as informações do modal com base na pizza clicada
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        // Remove a classe "selected" dos tamanhos e seleciona o padrão
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected'); // Define o tamanho grande como padrão
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]; // Preenche os tamanhos
        });

        // Atualiza a quantidade no modal
        c('.pizzaInfo--qt').innerHTML = modalqt;

        // Exibe o modal com animação de opacidade
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    // Adiciona o item de pizza preenchido à área principal
    c('.pizza-area').append(pizzaItem);
});

// Função para fechar o modal
function closemodal() {
    // Anima a opacidade para esconder o modal
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none'; // Remove o modal da tela
    }, 500);
}

// Adiciona eventos para os botões de cancelamento do modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closemodal); // Fecha o modal ao clicar
});

// Evento para diminuir a quantidade de pizzas no modal
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalqt > 1) { // Garante que a quantidade não fique menor que 1
        modalqt--;
        c('.pizzaInfo--qt').innerHTML = modalqt; // Atualiza o valor no modal
    }
});

// Evento para aumentar a quantidade de pizzas no modal
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalqt++;
    c('.pizzaInfo--qt').innerHTML = modalqt; // Atualiza o valor no modal
});

// Adiciona eventos de clique para selecionar os tamanhos das pizzas no modal
cs('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected'); // Remove a seleção anterior
        size.classList.add('selected'); // Marca o tamanho clicado como selecionado
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute("data-key"))
    
    let identifier = pizzaJson[modalkey].id+'@'+size;

    let key = cart.findIndex((item)=>
         item.identifier == identifier
    );
    if(key > -1) {
        cart[key].qt += modalqt;
    }else{
    cart.push({
        identifier,
        id:pizzaJson[modalkey].id,
        size,
        qt:modalqt
        
    })
}
   
    closemodal()
    updatecart()
})

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
    c('aside').style.left ='0'
    }
    
})

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw'
})
function updatecart() {
    c('.menu-openner span').innerHTML = cart.length
   if(cart.length > 0){
    c('aside').classList.add('show')
    c('.cart').innerHTML = ''

    let subtotal = 0;
    let desconto = 0;
    let total = 0;


    for(let i in cart){
        let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id)
        subtotal += pizzaItem.price * cart[i].qt;
        
        
        
        let cartItem = c('.models .cart--item').cloneNode(true)

        let pizzaSizeName =cart[i].size;
        switch(cart[i].size){
            case 0:
                pizzaSizeName = 'P'
            break;
            case 1:
                pizzaSizeName = 'D'
                break;
            case 2:
                pizzaSizeName = 'C'
                break;

        }
        let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
    cartItem.querySelector('img').src = pizzaItem.img;
    cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
    cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
    cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
        if(cart[i].qt > 1){
            cart[i].qt--
        } else{
            cart.splice(i,1)
        }
        
        updatecart()
    } )
    cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
        cart[i].qt++;
        updatecart();
        
    } )
    
    
    
    c('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

   }else{
    c('aside').classList.remove('show')
    c('aside').style.left = '100vw'
   } 
}
function enviarPedidoWhatsApp() {
    // Número de telefone para receber o pedido
    const telefone = "5585991900162"; 

    // Detalhes do pedido
    let mensagem = "Olá, gostaria de finalizar meu pedido:\n\n";

    // Variáveis para calcular o total geral
    let subtotal = 0;

    // Iterar pelos itens do carrinho
    cart.forEach((cartItem) => {
        const pizzaItem = pizzaJson.find((item) => item.id === cartItem.id);

        // Obter os detalhes da pizza
        const pizzaSizeName = cartItem.size === 0 ? 'P' : cartItem.size === 1 ? 'D' : 'C';
        const pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
        const quantidade = cartItem.qt;
        const totalProduto = (pizzaItem.price * quantidade).toFixed(2);

        // Adicionar os itens à mensagem
        mensagem += `- ${pizzaName}\n  Quantidade: ${quantidade}\n  Total: R$${totalProduto}\n\n`;

        // Calcular o subtotal
        subtotal += pizzaItem.price * quantidade;
    });

    // Adicionar o total geral
    const desconto = subtotal * 0.1;
    const total = subtotal - desconto;
    mensagem += `Subtotal: R$${subtotal.toFixed(2)}\n`;
    mensagem += `Desconto: R$${desconto.toFixed(2)}\n`;
    mensagem += `Total do Pedido: R$${total.toFixed(2)}\n`;

    // Detectar se o dispositivo é móvel
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Definir a URL correta com base no dispositivo
    const url = isMobile 
        ? `whatsapp://send?phone=${telefone}&text=${encodeURIComponent(mensagem)}` // App em mobile
        : `https://web.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`; // Web em desktop

    // Abrir o link no WhatsApp
    window.open(url, "_blank");
}

// Adicionar o evento ao botão de "Encerrar Pedido"
c('.encerrar-pedido-button').addEventListener('click', enviarPedidoWhatsApp);
