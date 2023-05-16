const setup = () => {
  let firstCard = undefined;
  let secondCard = undefined;
  let totalCards = 3;
  let matchedCards = 0;
  let clicks = 0;
  let time = 100;
  let gameStarted = false;
  let selectedDifficulty = "easy";
  let difficultyMultiplier = 1;

  const clicksCounter = $("#clicks");
  const pairsCounter = $("#pairs");
  const timerCounter = $("#timer");
  const startButton = $("#startButton");
  const resetButton = $("#resetButton");
  const difficultySelect = $("#difficultySelect");

  let timerInterval;

  const startTimer = () => {
    timerInterval = setInterval(() => {
      time--;
      timerCounter.text(`Timer: ${time}`);

      if (time === 0) {
        clearInterval(timerInterval);
        setTimeout(() => {
          alert("Time's up! Game over.");
          resetGame();
        }, 500);
      }
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
  };

  const resetTimer = () => {
    time = timeDifficulty(selectedDifficulty);
    timerCounter.text(`Timer: ${time}`);
  };

  const timeDifficulty = (difficulty) => {
    if (difficulty === "medium") {
      return 200;
    } else if (difficulty === "hard") {
      return 300;
    } else {
      return 100;
    }
  };

  const startGame = () => {
    gameStarted = true;
    $(".card").on("click", flipCard);
    alert("Game started!");
    startTimer();
  };

  const resetGame = () => {
    stopTimer();
    resetTimer();
    gameStarted = false;

    firstCard = undefined;
    secondCard = undefined;
    matchedCards = 0;
    clicks = 0;
    totalCards = 0;
    createCards();
    $(".card").remove();

    $(".card").removeClass("flip").off("click");
    createCards();
    updateStats();
  };

  function generateRandomNumbersArray(length) {
    const numbers = [];

    for (let i = 1; i <= length; i++) {
      const randomNumber = Math.floor(Math.random() * 810) + 1;
      numbers.push(randomNumber, randomNumber);
    }

    shuffleArray(numbers);

    return numbers;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const createCards = () => {
    const container = $("#game_grid");
    const cardsCount = 6 * difficultyMultiplier;

    const randomNumbersArray = generateRandomNumbersArray(cardsCount / 2);
    console.log(randomNumbersArray);

    for (let i = 0; i < cardsCount; i++) {
      const cardElement = $("<div>").addClass("card");
      if(cardsCount == 24){
        cardElement.addClass("hard")
      }
      if(cardsCount == 12){
        container.addClass("med")
        cardElement.addClass("med")
      }
      const frontFace = $("<img>")
        .addClass("front_face")
        .attr(
          "src",
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomNumbersArray[i]}.png`
        )
        .attr("id", `front_${i}`);
      const backFace = $("<img>")
        .addClass("back_face")
        .attr("src", `back.webp`)
        .attr("id", `back_${i}`);

      cardElement.append(frontFace);
      cardElement.append(backFace);

      container.append(cardElement);
      totalCards += 1 / 2;
    }
  };

  const flipCard = function () {
    if ($(this).hasClass("flip")) return;

    $(this).toggleClass("flip");
    clicks++;

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0];
    } else {
      secondCard = $(this).find(".front_face")[0];

      if (firstCard.src === secondCard.src) {
        $(`#${firstCard.id}`).parent().off("click");
        $(`#${secondCard.id}`).parent().off("click");
        firstCard = undefined;
        secondCard = undefined;
        matchedCards += 2;

        if (matchedCards === totalCards) {
          stopTimer();
          setTimeout(() => {
            alert("Congratulations! You've won the game!");
            resetGame();
          }, 500);
        }
      } else {
        $(".card").addClass("locked");
        setTimeout(() => {
          $(this).toggleClass("flip");
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          firstCard = undefined;
          secondCard = undefined;
          $(".card").removeClass("locked");
        }, 1000);
      }
    }
    updateStats();
  };

  const updateStats = () => {
    clicksCounter.text(`Clicks: ${clicks}`);
    pairsCounter.text(`Pairs Matched: ${matchedCards / 2} / ${totalCards / 2}`);
  };

  const updateDifficulty = () => {
    selectedDifficulty = difficultySelect.val();
    time = timeDifficulty(selectedDifficulty);
    if (selectedDifficulty === "medium") {
      difficultyMultiplier = 2;
    } else if (selectedDifficulty === "hard") {
      difficultyMultiplier = 4;
    } else {
      difficultyMultiplier = 1;
    }
    totalCards = $(".card").length * difficultyMultiplier;
    pairsCounter.text(`Pairs Matched: ${matchedCards / 2} / ${totalCards / 2}`);
    resetGame();
  };

  startButton.on("click", startGame);
  resetButton.on("click", resetGame);
  difficultySelect.on("change", updateDifficulty);

  createCards();
  updateStats();
};

$(document).ready(setup);
