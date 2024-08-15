const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Variável para o saldo do jogador
let playerMoney = 200; // Saldo inicial
let currentBet = 0; // Aposta atual
let deck; // Baralho global

// Função para atualizar o saldo no HTML
function updateMoneyDisplay() {
    document.getElementById('player-money').textContent = `Saldo: R$${playerMoney}`;
}

// Função para apostar
function placeBet(amount) {
    if (amount > playerMoney) {
        alert('Saldo insuficiente!');
        return false;
    }
    playerMoney -= amount;
    currentBet = amount;
    updateMoneyDisplay();
    return true;
}

// Função para ganhar uma aposta
function winBet(amount) {
    playerMoney += amount;
    updateMoneyDisplay();
}

// Função para criar o baralho
function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push(`${value}${suit}`);
        }
    }
    return deck;
}

// Função para embaralhar o baralho
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Função para criar um elemento de carta
function createCardElement(content) {
    const card = document.createElement('div');
    card.classList.add('card');

    const value = content.slice(0, -1);
    const suit = content.slice(-1);
    
    const topLeft = document.createElement('div');
    topLeft.classList.add('top-left');
    topLeft.textContent = value + suit;

    const bottomRight = document.createElement('div');
    bottomRight.classList.add('bottom-right');
    bottomRight.textContent = value + suit;

    const center = document.createElement('div');
    center.classList.add('center');
    center.textContent = suit;

    switch (suit) {
        case '♠':
            card.classList.add('suit-spade');
            break;
        case '♥':
            card.classList.add('suit-heart');
            break;
        case '♦':
            card.classList.add('suit-diamond');
            break;
        case '♣':
            card.classList.add('suit-club');
            break;
    }

    card.appendChild(topLeft);
    card.appendChild(bottomRight);
    card.appendChild(center);

    return card;
}


function dealCards(deck, playerHand, dealerHand) {
    const cards = [
        { hand: playerHand },
        { hand: dealerHand },
        { hand: playerHand },
        { hand: dealerHand }
    ];

    cards.forEach((cardData, index) => {
        const cardContent = deck.pop();
        const cardElement = createCardElement(cardContent);

        // Se for a primeira carta do dealer, aplicar a classe para esconder
        if (cardData.hand === dealerHand && index === 1) {
            const hideCard = document.createElement('div');
            hideCard.classList.add('escondepika');
            cardElement.appendChild(hideCard);
        }

        document.getElementById('deck').appendChild(cardElement);

        setTimeout(() => {
            cardElement.style.transform = `translate(${cardData.hand.offsetLeft - cardElement.offsetLeft}px, ${cardData.hand.offsetTop - cardElement.offsetTop}px)`;
        }, index * 500);

        setTimeout(() => {
            cardData.hand.appendChild(cardElement);
            cardElement.style.position = 'static';
            cardElement.style.transform = 'none';
            cardElement.style.transition = 'none';
        }, index * 500 + 1000);
    });
}



// Função para habilitar as opções do jogador
function enablePlayerOptions() {
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('double-button').disabled = false;
}

// Função para desativar as opções do jogador
function disablePlayerOptions() {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('double-button').disabled = true;
}

// Função para calcular o valor da mão
function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;

    Array.from(hand.children).forEach(card => {
        const value = card.querySelector('.top-left').textContent.slice(0, -1);

        if (value === 'A') {
            aces += 1;
            total += 11;
        } else if (['K', 'Q', 'J'].includes(value)) {
            total += 10;
        } else {
            total += parseInt(value, 10);
        }
    });

    // Ajustar para o valor do Ás
    while (total > 21 && aces > 0) {
        total -= 10;
        aces -= 1;
    }

    return total;
}

// Função para a jogada do dealer
function dealerPlay() {
    const dealerHand = document.getElementById('dealer-hand');
    let dealerTotal = calculateHandValue(dealerHand);

    while (dealerTotal < 1) {
        const cardContent = deck.pop();
        const cardElement = createCardElement(cardContent);
        dealerHand.appendChild(cardElement);

        dealerTotal = calculateHandValue(dealerHand);
    }

    determineWinner();
}

// Função para exibir as cartas do dealer uma a uma
function showDealerCards() {
    const dealerHand = document.getElementById('dealer-hand');
    const dealerCards = Array.from(dealerHand.children);
    let delay = 0;

    dealerCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = 1; // Mostrar a carta
            
            // Revelar a carta escondida removendo a div `escondepika`
            const hideCard = card.querySelector('.escondepika');
            if (hideCard) {
                hideCard.remove();
            }
            
        }, delay);
        delay += 500; // Atraso de 500ms entre as cartas
    });

    setTimeout(() => {
        determineWinner(); // Determinar o vencedor após mostrar todas as cartas
    }, delay); // Atraso final para garantir que todas as cartas sejam mostradas
}



// Função para a jogada do dealer
function dealerPlay() {
    const dealerHand = document.getElementById('dealer-hand');
    let dealerTotal = calculateHandValue(dealerHand);

    while (dealerTotal < 17) {
        const cardContent = deck.pop();
        const cardElement = createCardElement(cardContent);
        dealerHand.appendChild(cardElement);

        dealerTotal = calculateHandValue(dealerHand);
    }

    showDealerCards(); // Mostrar as cartas do dealer
}

// Função para determinar o vencedor
// Função para determinar o vencedor
function determineWinner() {
    const playerHand = document.getElementById('player-hand');
    const dealerHand = document.getElementById('dealer-hand');

    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    let resultMessage = '';

    if (playerTotal > 21) {
        resultMessage = 'Você passou de 21! Você perdeu.';
    } else if (dealerTotal > 21) {
        resultMessage = 'O dealer passou de 21! Você ganhou!';
        winBet(currentBet * 2);  // Atualiza o saldo
    } else if (playerTotal > dealerTotal) {
        resultMessage = `Você ganhou! Seu total: ${playerTotal}, Total do dealer: ${dealerTotal}`;
        winBet(currentBet * 2);  // Atualiza o saldo
    } else if (playerTotal < dealerTotal) {
        resultMessage = `Você perdeu! Seu total: ${playerTotal}, Total do dealer: ${dealerTotal}`;
    } else {
        resultMessage = `Empate! Ambos têm ${playerTotal}.`;
        winBet(currentBet);  // Retorna a aposta ao jogador
    }

    // Exibir a mensagem de resultado com atraso
    setTimeout(() => {
        alert(resultMessage);
        setTimeout(startNewRound, 1000); // Inicia uma nova rodada após 1 segundo
    }, 1000); // Atraso de 1 segundo para a mensagem de resultado
}

// Função para iniciar uma nova rodada
function startNewRound() {
    currentBet = 0; // Reseta a aposta após determinar o vencedor
    document.querySelector('.escolha').classList.remove('hidden');
    document.getElementById('game-options').classList.add('hidden');

    document.getElementById('player-hand').innerHTML = '';
    document.getElementById('dealer-hand').innerHTML = '';
    disablePlayerOptions(); // Desativa as opções do jogador na nova rodada
}



// Função para iniciar o jogo
function startGame() {
    deck = createDeck(); // Inicializar o baralho globalmente
    shuffleDeck(deck);

    const playerHand = document.getElementById('player-hand');
    const dealerHand = document.getElementById('dealer-hand');

    // Limpar mãos anteriores
    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';

    // Desativar botões de ação até que as cartas sejam distribuídas
    disablePlayerOptions();

    // Distribuir as cartas
    dealCards(deck, playerHand, dealerHand);

    // Habilitar as opções de jogo após as cartas serem distribuídas
    setTimeout(() => {
        document.getElementById('game-options').classList.remove('hidden');
        enablePlayerOptions();
    }, 2000);
}

// Função para iniciar uma nova rodada
function startNewRound() {
    document.querySelector('.escolha').classList.remove('hidden');
    document.getElementById('game-options').classList.add('hidden');

    document.getElementById('player-hand').innerHTML = '';
    document.getElementById('dealer-hand').innerHTML = '';
    currentBet = 0;

    disablePlayerOptions(); // Desativa as opções do jogador na nova rodada
}

// Funções para os botões "Ficar" e "Dobrar Aposta"
function stand() {
    disablePlayerOptions(); // Desativa os botões de ação do jogador
    dealerPlay(); // Inicia a jogada do dealer
}

function doubleDown() {
    if (playerMoney >= currentBet) {
        playerMoney -= currentBet; // Subtrai a aposta duplicada do saldo do jogador
        currentBet *= 2; // Dobra a aposta atual
        updateMoneyDisplay(); // Atualiza o display do saldo

        hit(); // O jogador recebe mais uma carta

        stand(); // O jogador automaticamente "fica" depois de dobrar
    } else {
        alert('Saldo insuficiente para dobrar a aposta!');
    }
}

// Função para o botão "Pedir Carta"
function hit() {
    const playerHand = document.getElementById('player-hand');
    if (deck.length > 0) {
        const cardContent = deck.pop();
        const cardElement = createCardElement(cardContent);
        playerHand.appendChild(cardElement);

        if (calculateHandValue(playerHand) > 21) {
            stand(); // Se o jogador passar de 21, automaticamente "fica"
        }
    }
}

// Adicionar eventos de clique aos botões de aposta
document.querySelectorAll('.escolha .bola').forEach(button => {
    button.addEventListener('click', function() {
        const betAmount = parseInt(this.getAttribute('data-bet'), 10);

        if (placeBet(betAmount)) {
            document.querySelector('.escolha').classList.add('hidden');
            startGame();
        }
    });
});

// Adicionar eventos aos botões de ação
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('double-button').addEventListener('click', doubleDown);

// Atualiza o display inicial do saldo
updateMoneyDisplay();
