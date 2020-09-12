const cardsContainer = document.querySelector(".cards");
let selecting = "p1";
let p1;
let p2;
getCaracters();

async function getCaracters() {
  try {
    cardsContainer.innerHTML = `<div class="loader"></div>`;
    const response = await fetch("/script/characters.json").then((r) =>
      r.json()
    );
    const characters = response.data;
    cardsContainer.innerHTML = "";
    makeAndDisplayCards(characters);
  } catch (error) {}
}

function makeAndDisplayCards(characters) {
  characters.forEach(function (character) {
    let card = createCard(character);
    cardsContainer.appendChild(card);
    card.addEventListener("click", () => displayInfo(character, characters));
  });
}

function createCard(character) {
  const el = document.createElement("button");
  el.classList.add("card");
  el.id = character.name;
  el.innerHTML = `
        <div class="img">
            <img src="${character.img}" alt="${character.name}">
        </div>
        <div class="name">
        <h4>${character.name}</h4>
        </div>
`;
  return el;
}

function displayInfo(card, characters) {
  let modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
        <div class="modal-character-content">
        <button class="close">&times;</button>
        <div class="col">
        <div class="col-1">
        <img src="${card.img}" alt="${card.name}">
        </div>
        <div class="col-2">
        <h4>${card.name}</h4>
        <div class="born">
        <h5>Born :</h5>
        <p>${card.born}</p>
    </div>
    <div class="culture">
        <h5>Culture :</h5>
        <p>${card.culture}</p>
    </div>
    <div class="titles">
        <h5>Titles:</h5>
        <p>${card.titles}</p>
    </div>
    </div>
    </div>
    <div class="select">
    <button class="btn-select" data-card-id="${card.name}">Select Character</button>
    </div>
    </div>
        `;
  document.querySelector("body").appendChild(modal);
  document.querySelectorAll(".btn-select").forEach(function (el) {
    el.focus();
  });
  document
    .querySelector(".close")
    .addEventListener("click", () => closeModal(modal));
  document
    .querySelector(".btn-select")
    .addEventListener("click", (e) => selectCharacter(e, modal, characters));
}

function closeModal(modal) {
  modal.remove();
}

function clearCharacters(p1Character, p2Character) {
  document.getElementById(`${p1Character}`).disabled = false;
  document.getElementById(`${p2Character}`).disabled = false;
  p1Character = undefined;
  p2Character = undefined;
  p2 = undefined;
  p1 = undefined;
  localStorage.clear();
  console.log(p1Character);
  console.log(p2Character);
  document.querySelector(".playerTurn").innerHTML =
    "Player 1 select your character";
  document.querySelector(".summary").innerHTML = "";
  document.querySelector(".summary").classList.remove("padding");
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => (card.disabled = false));
}

function selectCharacter(e, modal, characters) {
  let firstCardSelected = e.target.dataset.cardId;
  if (!p1) {
    document.querySelector(".playerTurn").innerHTML =
      "Player 2 select your character";
    document.querySelector(
      ".summary"
    ).innerHTML = `<p>Player 1 has selected ${firstCardSelected}</p>`;
    document.querySelector(".summary").classList.add("padding");
    document.getElementById(`${firstCardSelected}`).disabled = true;
    p1 = firstCardSelected;
  } else if (!p2) {
    let secondCardSelected = e.target.dataset.cardId;
    document.querySelector(".playerTurn").innerHTML = "";
    document.querySelector(".summary").innerHTML = `
            <p>Player 1 has selected ${p1} and Player 2 has selected ${secondCardSelected}</p>
            <div class="btn-row">
            <button class="btn-blue">Clear selection</button> 
            <a href="board.html" class="btn-light">Start playing</a>
            </div>`;
    document.getElementById(`${secondCardSelected}`).disabled = true;
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => (card.disabled = true));
    document.querySelector(".btn-light").focus();
    sendCharactersToBoard(p1, secondCardSelected, characters);
    document
      .querySelector(".btn-blue")
      .addEventListener("click", () => clearCharacters(p1, secondCardSelected));
  }

  closeModal(modal);
}

function sendCharactersToBoard(p1Character, p2Character, characters) {
  const p1 = characters.find((character) => p1Character === character.name);
  const p2 = characters.find((character) => p2Character === character.name);

  const p1json = JSON.stringify(p1);
  const p2json = JSON.stringify(p2);
  localStorage.player1 = p1json;
  localStorage.player2 = p2json;
}
