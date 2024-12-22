// Definir variáveis universais
var valorTotal = [0, 0, 0, 0];
var valorProduto = [0, 69.99, 79.99, 59.99];
var qtd = [0, 0, 0, 0];

// Trocar o nome pelo inserido no login
function trocarNome() {
	var nome = document.getElementById('nome');
	var usuario = document.getElementById('usuario').value;
	nome.innerHTML = usuario;
}

// Aumentar a quantidade de itens de um produto
function adicionarItem(item) {
	var quantidade = document.getElementById('quantidade' + item);
	var total = document.getElementById('total' + item);
	qtd[item] += 1;
	valorTotal[item] = valorProduto[item] * qtd[item];
	quantidade.innerHTML = qtd[item];
	total.innerHTML = valorTotal[item];
	console.log(quantidade);
	valorCompra();
}

// Diminuir a quantidade de itens de um produto
function removerItem(item) {
	if (qtd[item] > 0) {
		qtd[item] -= 1;
		var quantidade = document.getElementById('quantidade' + item);
		var total = document.getElementById('total' + item);
		quantidade.innerHTML = qtd[item];
		valorTotal[item] = valorProduto[item] * qtd[item];
		total.innerHTML = valorTotal[item];
		valorCompra();
	}
}

// Remover o produto
function removerProduto(produto) {
	var pai = document.getElementById('carrinho');
	var filho = document.getElementById('produto' + produto);
	if (confirm('Confirmar exclusão?')) {
		valorTotal[produto] -= (valorProduto[produto] * qtd[produto]);
		qtd[produto] = 0;
		pai.removeChild(filho);
		valorCompra();
	}
}

// Calcular o valor total da compra
function valorCompra() {
	var valorTotalCompra = document.getElementById('valorTotalCompra');
	var valor = 0;;
	for (var i = 0; i < valorTotal.length; i++) {
		valor += valorTotal[i];
	}
	valorTotalCompra.innerHTML = valor;
	console.log(valorTotal.length);
}

// Finalizar a compra e zerar os valores
function enviarPedidoWhatsApp() {
	// Número de telefone para receber o pedido
	const telefone = "5585991900162"; 

	// Detalhes do pedido
	let mensagem = "Olá, gostaria de finalizar meu pedido:\n\n";

	// Simulação de itens (adicione sua lógica aqui)
	const itensCarrinho = document.querySelectorAll("#carrinho tr");
    itensCarrinho.forEach((item) => {
        const nomeProduto = item.querySelector("td:nth-child(2)").innerText; // Nome do produto
        const quantidade = item.querySelector("td:nth-child(4) p").innerText; // Quantidade
        const totalProduto = item.querySelector("td:nth-child(6) span").innerText; // Total do produto

        if (parseInt(quantidade) > 0) {
            mensagem += `- ${nomeProduto}\n  Quantidade: ${quantidade}\n  Total: R$${totalProduto}\n\n`;
        }
    });

    // Adicionar o total geral
    const totalGeral = document.getElementById("valorTotalCompra").innerText;
    mensagem += `Total do Pedido: R$${totalGeral}\n`;


	// Detectar se o dispositivo é móvel
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

	// Definir a URL correta com base no dispositivo
	const url = isMobile 
		? `whatsapp://send?phone=${telefone}&text=${encodeURIComponent(mensagem)}` // App em mobile
		: `https://web.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`; // Web em desktop

	// Abrir o link no WhatsApp
	window.open(url, "_blank");}


