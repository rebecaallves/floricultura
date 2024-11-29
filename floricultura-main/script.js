document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButton = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const newTheme = document.body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    localStorage.setItem("theme", newTheme);
  });
});
// Variáveis globais para o carrinho
let cart = [];
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");

// Função para adicionar itens ao carrinho
function addToCart(nome, preco) {
  const itemIndex = cart.findIndex((item) => item.nome === nome);
  const currentLanguage = localStorage.getItem("language") || "pt"; // Obtém o idioma atual

  // Encontrar o nome do produto e a imagem no idioma selecionado
  const produtoElement = document.querySelector(`.produto img[alt="${nome}"]`);
  const nomeProduto = produtoElement ? produtoElement.closest(".produto").querySelector(`h3[data-lang-${currentLanguage}]`).getAttribute(`data-lang-${currentLanguage}`) : nome;
  const imagemProduto = produtoElement ? produtoElement.src : ""; // Pega o caminho da imagem

  if (itemIndex !== -1) {
    cart[itemIndex].quantidade += 1;
  } else {
    cart.push({ nome: nomeProduto, preco, quantidade: 1, imagem: imagemProduto });
  }
  updateCart();
}

// Função para atualizar o carrinho
function updateCart() {
  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantidade,
    0
  );
  cartItems.innerHTML = ""; // Limpar o carrinho antes de atualizá-lo

  if (cart.length > 0) {
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img">
        <h4>${item.nome}</h4>
        <p>R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
        <button class="btn-remove" onclick="removeFromCart(${index})">X</button>
      `;
      cartItems.appendChild(cartItem);
    });

    // Calcula o valor total
    const totalValue = cart.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );

    // Adiciona o total ao final do carrinho
    const totalElement = document.createElement("div");
    totalElement.className = "cart-total";
    totalElement.innerHTML = `
      <h3>Total: R$ ${totalValue.toFixed(2)}</h3>
    `;
    cartItems.appendChild(totalElement);
  } else {
    cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
  }
}

// Função para remover itens do carrinho
function removeFromCart(index) {
  cart.splice(index, 1); // Remove o item pelo índice
  updateCart(); // Atualiza o carrinho após a remoção
}

// Função para abrir/fechar o modal do carrinho
function toggleCart() {
  const cartModal = document.getElementById("cartModal");
  cartModal.style.display =
    cartModal.style.display === "block" ? "none" : "block";
}

// Função para pesquisar produtos
async function search() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();

  if (!searchInput) {
    const produtos = document.querySelectorAll(".produto");
    produtos.forEach((produto) => (produto.style.display = "block"));
    return;
  }

  try {
    const response = await fetch(
      `https://api.exemplo.com/produtos?search=${encodeURIComponent(
        searchInput
      )}`
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    const data = await response.json();
    displayProducts(data);
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível buscar produtos. Tente novamente mais tarde.");
  }
}

// Função para exibir produtos na página
function displayProducts(produtos) {
  const gridProdutos = document.querySelector(".grid-produtos");
  gridProdutos.innerHTML = ""; // Limpa a lista atual de produtos

  if (produtos.length === 0) {
    gridProdutos.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  produtos.forEach((produto) => {
    const produtoElement = document.createElement("div");
    produtoElement.className = "produto";
    produtoElement.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <a href="#" class="btn-comprar" onclick="addToCart('${
              produto.nome
            }', ${produto.preco})">Comprar</a>
        `;
    gridProdutos.appendChild(produtoElement);
  });
}

// Fechar o modal ao clicar fora
window.onclick = function (event) {
  const cartModal = document.getElementById("cartModal");
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
};

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Códigos de inicialização podem ser colocados aqui
});

// Alternar idioma
document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("language") || "pt"; // Verifica se já há idioma salvo, se não, define "pt" como padrão
  switchLanguage(savedLanguage); // Aplica o idioma salvo ao carregar a página

  // Botões para troca de idioma
  document
    .getElementById("btn-pt")
    .addEventListener("click", () => switchLanguage("pt"));
  document
    .getElementById("btn-en")
    .addEventListener("click", () => switchLanguage("en"));
});

function switchLanguage(lang) {
  // Salva o idioma no localStorage
  localStorage.setItem("language", lang);
    // Seleciona todos os elementos com atributos de idioma e atualiza o texto
  document.querySelectorAll("[data-lang-pt]").forEach((element) => {
    element.textContent = element.getAttribute(`data-lang-${lang}`);
  });
  
    // Atualiza o atributo alt das imagens
  document.querySelectorAll("img[data-lang-en]").forEach((img) => {
    const newAlt = img.getAttribute(`data-lang-${lang}`);
    if (newAlt) img.alt = newAlt; // Atualiza o alt
  });

  // Atualiza o texto de todos os elementos com o atributo data-lang
  document.querySelectorAll("[data-lang-pt]").forEach((element) => {
    element.textContent = element.getAttribute(`data-lang-${lang}`);
  });

  // Para elementos <input>, altere o atributo placeholder
  document.querySelectorAll("input[placeholder]").forEach((input) => {
    const newPlaceholder = input.getAttribute(`data-lang-${lang}`);
    if (newPlaceholder) input.placeholder = newPlaceholder;
  });
}

// Botões para troca de idioma
document
  .getElementById("btn-pt")
  .addEventListener("click", () => switchLanguage("pt"));
document
  .getElementById("btn-en")
  .addEventListener("click", () => switchLanguage("en"));

// Chatbot

const chatDisplay = document.getElementById('chat-display');
const userInput = document.getElementById('user-input');
const chatbotContainer = document.getElementById('chatbot-container');
let firstTimeOpen = true;

// Definir idioma padrão (pt ou en)
let currentLanguage = localStorage.getItem('language') || 'pt'; // Verifica se o idioma já foi salvo no LocalStorage

// Atualiza o idioma do chatbot
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang); // Salva a preferência no LocalStorage
}

// Função para adicionar mensagens
function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatDisplay.appendChild(messageElement);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Função para enviar a mensagem
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    appendMessage(message, 'user');
    userInput.value = '';

    setTimeout(() => {
        const botResponse = getBotResponse(message);
        appendMessage(botResponse, 'bot');
    }, 500);
}

// Respostas personalizadas em português e inglês
const responses = {
    'oi': {
        pt: 'Olá! Espero que esteja tudo bem com você. Por favor, informe o motivo do seu contato. Digite: 1 - Para problemas relacionados à navegação no site. 2 - Para problemas com entregas. 3 - Para problemas com pagamento.',
        en: 'Hello! I hope you are doing well. Please let us know the reason for your contact. Type: 1 - For issues related to site navigation. 2 - For delivery issues. 3 - For payment issues.'
    },
  'hello': {
        pt: 'Olá! Espero que esteja tudo bem com você. Por favor, informe o motivo do seu contato. Digite: 1 - Para problemas relacionados à navegação no site. 2 - Para problemas com entregas. 3 - Para problemas com pagamento.',
        en: 'Hello! I hope you are doing well. Please let us know the reason for your contact. Type: 1 - For issues related to site navigation. 2 - For delivery issues. 3 - For payment issues.'
    },
    '1': {
        pt: 'Lamentamos pelo transtorno. Como podemos ajudá-lo? Digite: 01 - Caso o problema seja relacionado à montagem de arranjos ou buquês. 02 - Caso deseje fazer uma sugestão ou solicitar alguma flor tropical não disponível. 03 - Outro problema não mencionado.',
        en: 'We apologize for the inconvenience. How can we assist you? Type: 01 - If the issue is related to bouquet or arrangement customization. 02 - If you wish to make a suggestion or request a tropical flower not available. 03 - Any other issue not mentioned.'
    },
    '01': {
        pt: 'Na aba da planta tropical desejada, não se esqueça de selecionar a opção "arranjo" ou "buquê". Caso deseje ambos, adicione os dois ao carrinho.',
        en: 'In the section of the desired tropical plant, be sure to select the "arrangement" or "bouquet" option. If you want both, add them both to the cart.'
    },
    '02': {
        pt: 'Por favor, entre em contato conosco pelo email: contato@belzatropical.com, ou utilize outra forma de contato disponível na aba "Contato".',
        en: 'Please contact us via email: contato@belzatropical.com, or use another contact method available in the "Contact" section.'
    },
    '03': {
        pt: 'Por favor, entre em contato conosco pelo email: contato@belzatropical.com, ou utilize outra forma de contato disponível na aba "Contato".',
        en: 'Please contact us via email: contato@belzatropical.com, or use another contact method available in the "Contact" section.'
    },
    '2': {
        pt: 'Para problemas com entregas, entre em contato pelo email: contato@belzatropical.com, ou utilize outra forma de contato disponível na aba "Contato".',
        en: 'For delivery issues, please contact us via email: contato@belzatropical.com, or use another contact method available in the "Contact" section.'
    },
    '3': {
        pt: 'Para problemas com pagamento, entre em contato pelo email: contato@belzatropical.com, ou utilize outra forma de contato disponível na aba "Contato".',
        en: 'For payment issues, please contact us via email: contato@belzatropical.com, or use another contact method available in the "Contact" section.'
    },
};

// Função para obter a resposta do bot conforme o idioma
function getBotResponse(message) {
    const response = responses[message.toLowerCase()];
    return response ? response[currentLanguage] : (currentLanguage === 'pt' ? 'Desculpe, não entendi. Pode reformular?' : 'Sorry, I didn\'t understand. Could you rephrase?');
}

// Função para alternar o chatbot
function toggleChatbot() {
    if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
        chatbotContainer.style.display = 'flex';
        if (firstTimeOpen) {
            appendMessage(currentLanguage === 'pt' ? 'Comece nossa conversa com um oi!' : 'Start our conversation with a hello!', 'bot');
            firstTimeOpen = false;
        }
    } else {
        chatbotContainer.style.display = 'none';
    }
}

// Botões para troca de idioma (adicionar listeners para os botões de troca de idioma)
document.getElementById('btn-pt').addEventListener('click', () => setLanguage('pt'));
document.getElementById('btn-en').addEventListener('click', () => setLanguage('en'));

// Inicializa o idioma ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    if (currentLanguage === 'en') {
        appendMessage('Start our conversation with a hello!', 'bot');
    } else {
        appendMessage('Comece nossa conversa com um oi!', 'bot');
    }
});
