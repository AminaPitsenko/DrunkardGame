document.addEventListener('DOMContentLoaded', () => {
	// elements from html file
	let rulesButtonOpen = document.querySelector('.showRules');
	let rulesButtonClose = document.querySelector('.closeRules');
	let overlay = document.querySelector('.overlay');
	let rules = document.querySelector('.rules');

	let timerBox = document.querySelector('.timerBox');
	let timer = document.querySelector('.timer');
	let showTime = document.querySelector('.showTime');

	let drawCard = document.querySelector('.drawCard');
	let retrieveCardBtn = document.querySelector('.retrieveCardBtn');
	let cardStatus = document.querySelector('.cardStatus');
	let roundResultsHeader = document.querySelector('.roundResultsHeader');

	let computerCardContainer = document.querySelector('.CCC .card');
	let computerCardBack = document.querySelector('.CCC .back ');
	let playerCardContainer = document.querySelector('.playerCC .card');
	let playerCardBack = document.querySelector('.playerCC .back ');

	let cardsCounterC = document.querySelector('.cardsCounterC');
	let cardsCounterP = document.querySelector('.cardsCounterP');

	let gameOver = document.querySelector('.winnerIs');
	let winnerName = document.querySelector('.winnerName h1');
	let playAgain = document.querySelector('.playAgain');

	// ui
	rulesButtonOpen.addEventListener('click', function () {
		rules.classList.remove('hidden');
		overlay.classList.remove('hidden');
	});

	rulesButtonClose.addEventListener('click', function () {
		rules.classList.add('hidden');
		overlay.classList.add('hidden');
	});

	//game logic

	class Player {
		constructor(deck) {
			this.deck = shuffleDeck(deck);
			this.deckSize = this.deck.length;
		}

		draw() {
			if (this.deck.length === 0) {
				return null;
			}
			this.currentCard = this.deck.shift();
			return this.currentCard;
		}

		retrieve(cards) {
			cards = shuffleDeck(cards);
			this.deck = this.deck.concat(cards);
			this.deckSize += cards.length;
		}
	}

	function createDeck() {
		const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
		const values = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		let deck = [];

		for (let suit of suits) {
			for (let value of values) {
				deck.push({ value, suit });
			}
		}
		return deck;
	}

	function getRed(deck) {
		return deck.filter(
			(card) => card.suit === 'hearts' || card.suit === 'diamonds'
		);
	}

	function getBlack(deck) {
		return deck.filter(
			(card) => card.suit === 'spades' || card.suit === 'clubs'
		);
	}

	function shuffleDeck(deck) {
		for (let i = deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
		return deck;
	}

	function getCardImageUrl(value, suit) {
		const suitAbbreviation = suit.charAt(0).toUpperCase();
		return `assets/${value}-${suitAbbreviation}.svg`;
	}

	function gamePlay(card1, card2) {
		if (card1.value === '6' && card2.value !== 'A' && card2.value !== '6')
			return -1;
		if (card1.value === '6' && card2.value === 'A') return 1;
		if (card1.value === 'A' && card2.value !== '6' && card2.value !== 'A')
			return 1;
		if (card1.value === 'A' && card2.value === '6') return -1;
		if (card1.value !== '6' && card1.value !== 'A' && card2.value === 'A')
			return -1;
		if (card1.value !== 'A' && card1.value !== '6' && card2.value === '6')
			return 1;

		if (card1.value === card2.value) return 0;

		const cardHierarchy = {
			7: 1,
			8: 2,
			9: 3,
			10: 4,
			J: 5,
			Q: 6,
			K: 7,
		};

		return cardHierarchy[card1.value] - cardHierarchy[card2.value];
	}

	//global variables
	const deck = createDeck();
	const redDeck = getRed(deck);
	const blackDeck = getBlack(deck);
	let whatDeck = Math.round(Math.random() * (2 - 1) + 1);
	let computer;
	let player;
	let winCards;
	let computerCurrent;
	let playerCurrent;
	let startGame;
	let timeToShow;

	function game() {
		startGame = true;
		overlay.classList.add('hidden');
		gameOver.classList.add('hidden');

		if (whatDeck == 1) {
			computer = new Player(blackDeck);
			player = new Player(redDeck);
		} else {
			player = new Player(blackDeck);
			computer = new Player(redDeck);
		}

		round();
	}
	game();

	function round() {
		if (computer.deck.length === 0) {
			clearInterval(timerBox);

			winnerName.innerHTML = 'You won!';
			showTime.innerHTML = timeToShow;

			startNewGame();
		}
		if (player.deck.length === 0) {
			clearInterval(timerBox);
			winnerName.innerHTML = 'Computer won!';
			showTime.innerHTML = timeToShow;

			startNewGame();
		}

		winCards = 0;

		drawCard.disabled = false;
		retrieveCardBtn.disabled = true;
	
		drawCard.replaceWith(drawCard.cloneNode(true));
		retrieveCardBtn.replaceWith(retrieveCardBtn.cloneNode(true));

		drawCard = document.querySelector('.drawCard');
		retrieveCardBtn = document.querySelector('.retrieveCardBtn');

		drawCard.addEventListener('click', function () {
			drawCard.disabled = true;
			retrieveCardBtn.disabled = false;

			if (startGame === true) {
				let sec = 0;
				let min = 0;
				let secDisp;
				let minDisp;
				timerBox = setInterval(() => {
					if (sec % 60 == 0 && sec != 0) {
						sec = 0;
						min++;
					}

					secDisp = sec < 10 ? (secDisp = ':0' + sec) : (secDisp = ':' + sec);
					minDisp = min < 10 ? (minDisp = '0' + min) : (minDisp = min);

					timer.innerHTML = minDisp + secDisp;
					timeToShow = timer.innerHTML;

					sec++;
				}, 1000);
				startGame = false;
			}

			roundResultsHeader.innerHTML = 'Card status:';
			cardStatus.innerHTML = '';

			computerCurrent = computer.draw();
			playerCurrent = player.draw();

			computerCardContainer.classList.add('flip');
			playerCardContainer.classList.add('flip');

			setTimeout(() => {
				computerCardBack.src = getCardImageUrl(
					computerCurrent.value,
					computerCurrent.suit
				);
				playerCardBack.src = getCardImageUrl(
					playerCurrent.value,
					playerCurrent.suit
				);
			}, 200);

			winCards = [computerCurrent, playerCurrent];

			if (gamePlay(computerCurrent, playerCurrent) > 0) {
				computerWins();
			} else if (gamePlay(computerCurrent, playerCurrent) < 0) {
				playerWins();
			} else if (gamePlay(computerCurrent, playerCurrent) == 0) {
				tie();
			}
		});
	}

	function startNewGame() {
		gameOver.classList.remove('hidden');
		overlay.classList.remove('hidden');

		playAgain.addEventListener('click', function () {
			location.reload();
		});
	}

	function computerWins() {
		shuffleDeck(winCards);
		computer.retrieve(winCards);

		setTimeout(()=>{
			roundResultsHeader.innerHTML = 'Lost cards:';

			for (let card of winCards) {
				cardStatus.innerHTML +=
					'<li><div class=\'centerIcon\'><i class="fa-solid fa-right-long"></i></div>' +
					card.value +
					' of ' +
					card.suit +
					'</li>';
			}

			document.getElementById('retrieve').innerHTML = 'Continue';
		},300)

		retrieveCardBtn.addEventListener('click', function continueRound() {
			retrieveCardBtn.removeEventListener('click', continueRound);

			drawCard.disabled = 'false';

			computerCardContainer.classList.remove('flip');
			playerCardContainer.classList.remove('flip');

			setTimeout(() => {
				computerCardBack.src = 'assets/back.svg';
				playerCardBack.src = 'assets/back.svg';
			}, 200);

			cardStatus.innerHTML = '';
			roundResultsHeader.innerHTML = 'Card status:';

			cardsCounterC.innerHTML = computer.deck.length;
			cardsCounterP.innerHTML = player.deck.length;

			round();
		});
	}

	function playerWins() {
		setTimeout(()=>{
			document.getElementById('retrieve').innerHTML = 'Retrieve';

			roundResultsHeader.innerHTML = 'Won cards:';

			for (let card of winCards) {
				cardStatus.innerHTML +=
					'<li><div class=\'centerIcon\'><i class="fa-solid fa-right-long"></i></div>' +
					card.value +
					' of ' +
					card.suit +
					'</li>';
			}
		},300)

		retrieveCardBtn.addEventListener('click', function continueRound() {
			retrieveCardBtn.removeEventListener('click', continueRound);

			shuffleDeck(winCards);
			player.retrieve(winCards);

			cardsCounterC.innerHTML = computer.deck.length;
			cardsCounterP.innerHTML = player.deck.length;

			computerCardContainer.classList.remove('flip');
			playerCardContainer.classList.remove('flip');

			setTimeout(() => {
				computerCardBack.src = 'assets/back.svg';
				playerCardBack.src = 'assets/back.svg';
			}, 200);

			round();
		});
	}

	function tie() {
		let battleCardsComputer;
		let battleCardsPlayer;

		let numC = computer.deck.length;
		let numP = player.deck.length;

		if (numC >= 3) {
			battleCardsComputer = [computer.draw(), computer.draw(), computer.draw()];
		} else if (numC === 2) {
			battleCardsComputer = [computer.draw(), computer.draw(), player.draw()];
		} else if (numC === 1) {
			battleCardsComputer = [computer.draw(), player.draw(), player.draw()];
		} else {
			battleCardsComputer = [player.draw(), player.draw(), player.draw()];
		}

		if (numP >= 3) {
			battleCardsPlayer = [player.draw(), player.draw(), player.draw()];
		} else if (numP === 2) {
			battleCardsPlayer = [player.draw(), player.draw(), computer.draw()];
		} else if (numP === 1) {
			battleCardsPlayer = [player.draw(), computer.draw(), computer.draw()];
		} else {
			battleCardsPlayer = [computer.draw(), computer.draw(), computer.draw()];
		}

		cardArray = [];
		cardArray.concat(battleCardsComputer).concat(battleCardsPlayer);
		shuffleDeck(cardArray);

		winCards = winCards.concat(battleCardsComputer).concat(battleCardsPlayer);
		shuffleDeck(winCards);

		setTimeout(() =>{
			document.getElementById('retrieve').innerHTML = 'Battle';
		}, 300)
		
		retrieveCardBtn.addEventListener('click', function continueRound() {
			retrieveCardBtn.removeEventListener('click', continueRound);

			cardStatus.innerHTML = '';

			computerCardContainer.classList.remove('flip');
			playerCardContainer.classList.remove('flip');

			setTimeout(() => {
				computerCardBack.src = 'assets/back.svg';
				playerCardBack.src = 'assets/back.svg';
			}, 200);

			setTimeout(() => {
				computerCardContainer.classList.add('flip');
				playerCardContainer.classList.add('flip');

				setTimeout(() => {
					computerCardBack.src = getCardImageUrl(
						battleCardsComputer[2].value,
						battleCardsComputer[2].suit
					);
					playerCardBack.src = getCardImageUrl(
						battleCardsPlayer[2].value,
						battleCardsPlayer[2].suit
					);
				}, 200);
			}, 700);

			if (gamePlay(battleCardsComputer[2], battleCardsPlayer[2]) > 0) {
				computerWins();
			} else if (gamePlay(battleCardsComputer[2], battleCardsPlayer[2]) < 0) {
				playerWins();
			} else {
				tie();
			}
		});
	}
});
