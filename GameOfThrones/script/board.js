const player1Character = localStorage.getItem("player1");
const player2Character = localStorage.getItem("player2");
const p1Obj = JSON.parse(player1Character);
const p2Obj = JSON.parse(player2Character);
let modal = document.querySelector(".modal");
let p1CurrentPosition = 1;
let p2CurrentPosition = 1;
let playerTurn = 1;

document.querySelector(".btn-play").focus();
document.querySelectorAll(".close, .btn-play").forEach(function (el) {
  el.addEventListener("click", () => closeModal(modal));
});

checkForCharacters();
createBoard();
displayCharacters();

function checkForCharacters() {
  if (player1Character === null || player2Character === null) {
    document.querySelector(".modal-content").innerHTML = `
    <button class="close">&times;</button>
    <h2>How to play</h2>
    <p>
      You need to select characters to be able to play. Please return back to the
      home page and make your selections.
    </p>
    <a href="home.html" class="btn-back">Go back</a>
    
        `;
    document.querySelector(".btn-back").focus();
  }
}

function createBoard() {
  const boardElement = document.querySelector(".board");
  for (let row = 0; row < 5; row++) {
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    for (let tile = 1; tile <= 6; tile++) {
      rowElement.appendChild(createTile(row * 6 + tile));
    }

    if (row === 1 || row === 3) {
      rowElement.classList.add("reverse");
    }

    boardElement.appendChild(rowElement);
  }
}

function createTile(number) {
  const tile = document.createElement("div");
  tile.setAttribute("data-number", number);
  tile.innerHTML = `<span>${number}</span>`;
  tile.classList.add("tile");

  return tile;
}

function displayCharacters() {
  document.querySelector(".p1-character").innerHTML = `
    <h2>${p1Obj.name}</h2>
    <img src="${p1Obj.sigil}" alt="${p1Obj.name}">
    `;

  document.querySelector(".p2-character").innerHTML = `
    <h2>${p2Obj.name}</h2>
    <img src="${p2Obj.sigil}" alt="${p2Obj.name}">
    `;

  document.querySelector('.tile[data-number="1"]').innerHTML = `
  <div>
  <h3>Start</h3>
  <img src="${p1Obj.sigil}" alt="${p1Obj.name}" class="p1token" />
  <img src="${p2Obj.sigil}" alt="${p2Obj.name}" class="p2token" />
</div>

    `;

  document.querySelector('.tile[data-number="30"]').innerHTML = `
    <div>
    <h3>Finish</h3>
    </div>
    `;
}

const p1Dice = document.querySelector("#p1-dice");
const p2Dice = document.querySelector("#p2-dice");

const p1button = document.querySelector("#p1-roll");
p1button.disabled = false;

const p2button = document.querySelector("#p2-roll");
p2button.disabled = true;

p1button.addEventListener("click", () => rollDice(p1Dice));
p2button.addEventListener("click", () => rollDice(p2Dice));

function rollDice(playerDice) {
  const randomNumber = Math.round(Math.random() * 5) + 1;
  const altArr = [
    "roll: 1",
    "roll: 2",
    "roll: 3",
    "roll: 4",
    "roll: 5",
    "roll: 6",
  ];
  let modalIsOpen = false;
  playerDice.src = "img/d" + randomNumber + ".png";
  playerDice.alt = altArr[randomNumber - 1];
  p1token = document.querySelector(".p1token");
  p2token = document.querySelector(".p2token");

  if (playerTurn === 1) {
    p1CurrentPosition = p1CurrentPosition + randomNumber;
    if (p1CurrentPosition >= 30) {
      announceWinner(p1Obj.name);
    } else {
      document
        .querySelector(`.tile[data-number="${p1CurrentPosition}"]`)
        .appendChild(p1token);

      if (
        p1CurrentPosition === 5 ||
        p1CurrentPosition === 10 ||
        p1CurrentPosition === 15 ||
        p1CurrentPosition === 20 ||
        p1CurrentPosition === 25
      ) {
        makeTraps(p1CurrentPosition, p1token);
        modalIsOpen = true;
      } else if (p1CurrentPosition === 3 || p1CurrentPosition === 13) {
        makeAdvantage(p1CurrentPosition, p1token);
        modalIsOpen = true;
      }
    }

    if (randomNumber != 6) {
      playerTurn = 2;
      p2button.disabled = false;
      p1button.disabled = true;
      if (modalIsOpen) {
        document.querySelector(".btn-blue").focus();
      } else {
        p2button.focus();
      }
    }
  } else {
    p2CurrentPosition = p2CurrentPosition + randomNumber;
    if (p2CurrentPosition >= 30) {
      announceWinner(p2Obj.name);
    } else {
      document
        .querySelector(`.tile[data-number="${p2CurrentPosition}"]`)
        .appendChild(p2token);

      if (
        p2CurrentPosition === 5 ||
        p2CurrentPosition === 10 ||
        p2CurrentPosition === 15 ||
        p2CurrentPosition === 20 ||
        p2CurrentPosition === 25
      ) {
        makeTraps(p2CurrentPosition, p2token);
        modalIsOpen = true;
      } else if (p2CurrentPosition === 3 || p2CurrentPosition === 13) {
        makeAdvantage(p2CurrentPosition, p2token);
        modalIsOpen = true;
      }

      if (randomNumber != 6) {
        playerTurn = 1;
        p1button.disabled = false;
        p2button.disabled = true;
        if (modalIsOpen) {
          document.querySelector(".btn-blue").focus();
        } else {
          p1button.focus();
        }
      }
    }
  }
}

function makeTraps(playerPosition, token) {
  let trapNumber = Math.round(Math.random() * 4) + 1;
  let modal = document.createElement("div");
  modal.classList.add("modal");
  if (trapNumber === 1) {
    modal.innerHTML = `
    <div class="modal-trap-content">
    <button class="close">&times;</button>
    <h4>A wild boar blocks your path!</h4>
    <p>
      Take two steps back to get to safety, and wait for the boar to disappear
    </p>
    <button class="btn-blue">Okay</button>
  </div>
  
        `;
    playerPosition = playerPosition - 2;
  } else if (trapNumber === 2) {
    modal.innerHTML = `
    <div class="modal-trap-content">
    <button class="close">&times;</button>
    <h4>One of the Warlocks of Qarth put a spell on you!</h4>
    <p>This spell causes you to take three steps backwards</p>
    <button class="btn-blue">Okay</button>
  </div>
  
        `;
    playerPosition = playerPosition - 3;
  } else if (trapNumber === 3) {
    modal.innerHTML = `
    <div class="modal-trap-content">
    <button class="close">&times;</button>
    <h4>Daenerys' dragon is hunting on the road ahead!</h4>
    <p>Take 4 steps back to seek shelter</p>
    <button class="btn-blue">Okay</button>
  </div>
  
        `;
    playerPosition = playerPosition - 4;
  } else if (trapNumber === 4) {
    modal.innerHTML = `
    <div class="modal-trap-content">
    <button class="close">&times;</button>
    <h4>The Mountain is patrolling the road ahead!</h4>
    <p>Take 2 steps back to avoid capture</p>
    <button class="btn-blue">Okay</button>
  </div>
  
        `;
    playerPosition = playerPosition - 2;
  } else if (trapNumber === 5) {
    modal.innerHTML = `
    <div class="modal-trap-content">
    <button class="close">&times;</button>
    <h4>White Walkers approaching!</h4>
    <p>Take 4 steps back to seek shelter</p>
    <button class="btn-blue">Okay</button>
  </div>
  
        `;
    playerPosition = playerPosition - 4;
  }
  document.querySelector("body").appendChild(modal);
  document
    .querySelector(`.tile[data-number="${playerPosition}"]`)
    .append(token);
  document.querySelectorAll(".close, .btn-blue").forEach(function (el) {
    el.addEventListener("click", () => closeModal(modal));
  });
}

function makeAdvantage(playerPosition, token) {
  let advantageNumber = Math.round(Math.random() * 1) + 1;
  let modal = document.createElement("div");
  modal.classList.add("modal");
  if (advantageNumber === 1) {
    modal.innerHTML = `
    <div class="modal-advantage-content">
    <button class="close">&times;</button>
    <h4>Daenerys comes and gives you a ride on Drogon!</h4>
    <p>Move two tiles forwards</p>
    <button class="btn-blue">Let's go</button>
  </div>
  
        `;
    playerPosition = playerPosition + 2;
  } else {
    modal.innerHTML = `
    <div class="modal-advantage-content">
    <button class="close">&times;</button>
    <h4>The Three Eyed Raven tells you about a secret path!</h4>
    <p>This path is a lot quicker. Move 3 tiles forwards</p>
    <button class="btn-blue">Let's go</button>
  </div>
  
    `;
    playerPosition = playerPosition + 3;
  }

  document.querySelector("body").appendChild(modal);
  document
    .querySelector(`.tile[data-number="${playerPosition}"]`)
    .append(token);
  document.querySelectorAll(".close, .btn-blue").forEach(function (el) {
    el.addEventListener("click", () => closeModal(modal));
  });
}

function announceWinner(winner) {
  localStorage.setItem("winner", winner);
  location.replace("winner.html");
}

function closeModal(modal) {
  modal.remove();

  if (playerTurn === 1) {
    p1button.focus();
  } else {
    p2button.focus();
  }
}
