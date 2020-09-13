const cardsContainer = document.querySelector(".cards");
let p1;
let p2;
getCaracters();

async function getCaracters() {
  try {
    const response = await fetch("./script/characters.json").then((r) =>
      r.json()
    );
    const characters = response.data;
    makeAndDisplayCards(characters);
    document.querySelector(".loader").remove();
  } catch (error) {
    console.log(error);
  }
}

function makeAndDisplayCards(characters) {
  characters.forEach((character) => {
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
  <img src="${character.img}" alt="${character.name}" />
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
      <img src="${card.img}" alt="${card.name}" />
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
    <button class="btn-select" data-card-id="${card.name}">
      Select Character
    </button>
  </div>
</div>
        `;
  document.querySelector("body").appendChild(modal);
  document.querySelector(".btn-select").focus();
  document
    .querySelector(".close")
    .addEventListener("click", () => closeModal(modal));
  document.querySelector(".btn-select").addEventListener("click", (e) => {
    selectCharacter(e, characters);
    closeModal(modal);
  });
}

function closeModal(modal) {
  modal.remove();
}

function clearSelectedCharacters() {
  p2 = undefined;
  p1 = undefined;
  document.querySelector(".playerTurn").innerHTML =
    "Player 1 select your character";
  document.querySelector(".summary").innerHTML = "";
  document.querySelector(".summary").classList.remove("padding");
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => (card.disabled = false));
}

function selectCharacter(e, characters) {
  let selected = e.target.dataset.cardId;
  if (!p1) {
    document.querySelector(".playerTurn").innerHTML =
      "Player 2 select your character";
    document.querySelector(
      ".summary"
    ).innerHTML = `<p>Player 1 has selected ${selected}</p>`;
    document.querySelector(".summary").classList.add("padding");
    document.getElementById(`${selected}`).disabled = true;
    p1 = selected;
  } else if (!p2) {
    let selected = e.target.dataset.cardId;
    p2 = selected;
    document.querySelector(".playerTurn").innerHTML = "";
    document.querySelector(".summary").innerHTML = `
    <p>
    Player 1 has selected ${p1} and Player 2 has selected ${p2}
  </p>
  <div class="btn-row">
    <button class="btn-blue">Clear selection</button>
    <a href="board.html" class="btn-light">Start playing</a>
  </div>`;
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => (card.disabled = true));
    document.querySelector(".btn-light").focus();
    saveSelectedCharacters(characters);
    document
      .querySelector(".btn-blue")
      .addEventListener("click", () => clearSelectedCharacters());
  }
}

function saveSelectedCharacters(allCharacters) {
  const character1 = allCharacters.find((character) => p1 === character.name);
  const character2 = allCharacters.find((character) => p2 === character.name);

  const p1json = JSON.stringify(character1);
  const p2json = JSON.stringify(character2);
  localStorage.player1 = p1json;
  localStorage.player2 = p2json;
}
