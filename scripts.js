(() => {
  const TIMER = document.querySelector('.timer');
  const WRAPPERELEM = document.querySelector('.wrapper');
  const GAMEOVERBTN = document.querySelector('.game-over__btn');
  const FORM = document.getElementById('form');
  let [firstCard, secondCard, counter] = [null, null, 0];
  let [lockBoard, anyFlippedCard] = [false, false];
  let intervalFunc;

  FORM.addEventListener('submit', elem => {
    elem.preventDefault();
    const vertical = document.querySelector('[name="vertical"]');
    const horizontal = document.querySelector('[name="horizontal"]');
    if (!vertical.value || !horizontal.value) {
      return;
    };
    elem.target.classList.remove('visible');
    initializeGame([vertical.value, horizontal.value]);
  });

  WRAPPERELEM.addEventListener('click', clickedLocation => {
    if (!clickedLocation.target.closest('.card')) {
      unhandleCards();
    }
  });

  GAMEOVERBTN.addEventListener('click', elem => {
    deleteHtmlCards();
    elem.target.classList.remove('visible');
    FORM.classList.add('visible');
  })

  function initializeGame(sizes) {
    const countCards = sizes[0] * sizes[1];
    createPlayground(countCards);
    putCardSizes(sizes);
    let setCards = createValues(countCards / 2);
    let cardDeck = shuffle(setCards);
    counter = cardDeck.length / 2;
    cardDistribution(cardDeck);
    handleCards();
  };

  function createPlayground(num) {
    for (num; num > 0; num--) {
      createCard();
    };
  };

  function createCard() {
    WRAPPERELEM.insertAdjacentHTML('afterbegin',
    '<div class="card">\
      <p class="card__face-content"></p>\
      <img src="img/js-badge.svg" alt="back-side-card-img" class="card__back-img">\
    </div>'
    );
  };

  function putCardSizes(sizes) {
    const CARDS = document.querySelectorAll('.card');
    CARDS.forEach(card => {
      card.style.setProperty('height', `calc(100% / ${sizes[0]} - 2 * 5px)`);
      card.style.setProperty('width', `calc(100% / ${sizes[1]} - 2 * 5px)`);
    })
  };

  function createValues(num) {
    let array = [];
    for (num; num > 0; num--) {
      array.push(num);
      array.push(num);
    };
    return array;
  };

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
  };

  function cardDistribution(array) {
    let lastInd = array.length - 1;
    for (let cardElem of WRAPPERELEM.children) {
      cardElem.children[0].textContent = String(array[lastInd]);
      lastInd--;
    }
  };

  function handleCards() {
    const CARDS = document.querySelectorAll('.card');
    setTimer(CARDS);
    CARDS.forEach(card => card.classList.remove('flip'));
    CARDS.forEach(card => card.addEventListener('click', flipCard));
  };

  function unhandleCards() {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }

  function setTimer(CARDS) {
    if (intervalFunc) {
      clearInterval(intervalFunc);
    };
    TIMER.innerHTML = 60;
    intervalFunc = setInterval(decreaseTimer, 1000, CARDS);
  };

  function decreaseTimer(CARDS) {
    if (TIMER.textContent <= 0 || GAMEOVERBTN.classList.contains('visible')) {
      CARDS.forEach(card => card.removeEventListener('click', flipCard))
      TIMER.textContent = 0;
      GAMEOVERBTN.classList.add('visible');
      clearInterval(intervalFunc);
    } else --TIMER.textContent
  };

  function flipCard() {

    if (lockBoard) {
      unhandleCards();
      return;
    };
    if (this.classList.contains('flip')) {
      return;
    };
    this.classList.add('flip');
    if (!anyFlippedCard) {
      firstCard = this;
      anyFlippedCard = true;
      return;
    };
    secondCard = this;
    lockBoard = true;
    matchCards();
    if (counter === 0) {
      GAMEOVERBTN.classList.add('visible');
    }
  };

  function matchCards() {
    firstCard.children[0].textContent === secondCard.children[0].textContent ? removeCards() : unflipCards();
  }

  function removeCards() {
    counter--
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
  };

  function unflipCards() {
    setTimeout(function() {
      if (firstCard && secondCard) {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
      }
    }, 1500);
  };

  function resetBoard() {
    [lockBoard, anyFlippedCard] = [false, false];
    [firstCard, secondCard] = [null, null];
  };

  function deleteHtmlCards() {
    while (WRAPPERELEM.firstChild) {
      WRAPPERELEM.firstChild.remove();
    };
  };
})()
