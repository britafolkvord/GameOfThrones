getCaracters();
const cardsContainer = document.querySelector(".cards")
let selecting = "p1"
let p1;
let p2;

async function getCaracters() {
    try {
        const response = await fetch('/script/characters.json').then(r => r.json());
        const characters = response.data;
        makeAndDisplayCards(characters);
    } catch (error) {

    }

};



function makeAndDisplayCards(characters) {
    characters.forEach(function (character) {
        let card = createCard(character);
        document.querySelector('.cards').appendChild(card);
        card.addEventListener('click', () => displayInfo(character));

    }
    )
};


function createCard(card) {
    const el = document.createElement('button');
    el.classList.add('card');
    el.id = `${card.name}`;
    el.innerHTML = `
        <div class="img">
            <img src="${card.img}" alt="${card.name}">
        </div>
        <div class="name">
        <h4>${card.name}</h4>
        </div>
`;
    return el;
};

function displayInfo(card) {
    let modal = document.createElement("div");
    modal.classList.add('modal');
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
        <h5 class="bold">Born :</h5>
        <p>${card.born}</p>
    </div>
    <div class="culture">
        <h5 class="bold">Culture :</h5>
        <p>${card.culture}</p>
    </div>
    <div class="titles">
        <h5 class="bold">Titles:</h5>
        <p>${card.titles}</p>
    </div>
    </div>
    </div>
    <button class="select" data-card-id="${card.name}">Select Character</button>
    </div>
        `;
    document.querySelector("body").appendChild(modal);
    document.querySelectorAll('.close').forEach(function (el) {
        el.focus();
    });
    document.querySelector('.close').addEventListener('click', () => closeModal(modal));
    document.querySelector('.select').addEventListener('click', (e) => selectCharacter(e, modal));
}


function closeModal(modal) {

    modal.remove();

};

function clearCharacters(p1Character, p2Character) {
    document.getElementById(`${p1Character}`).classList.remove('hidden');
    document.getElementById(`${p2Character}`).classList.remove('hidden');
    p1Character = undefined;
    p2Character = undefined;
    p2 = undefined;
    p1 = undefined;
    localStorage.clear();
    console.log(p1Character);
    console.log(p2Character);
    document.querySelector(".playerTurn").innerHTML = "Player 1 select your character";
    document.querySelector(".summary").innerHTML = "";
    document.querySelector('.summary').classList.remove('padding');
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.disabled = false)


};

function selectCharacter(e, modal) {
    let firstCardSelected = e.target.dataset.cardId;
    if (!p1) {
        document.querySelector(".playerTurn").innerHTML = "Player 2 select your character";
        document.querySelector(".summary").innerHTML = `<p>Player 1 has selected ${firstCardSelected}</p>`;
        document.querySelector(".summary").classList.add('padding');
        localStorage.player1 = firstCardSelected;
        document.getElementById(`${firstCardSelected}`).classList.add('hidden');
        p1 = firstCardSelected
    } else if (!p2) {
        let secondCardSelected = e.target.dataset.cardId;
        document.querySelector(".playerTurn").innerHTML = "";
        localStorage.player2 = secondCardSelected;
        document.querySelector(".summary").innerHTML = `
            <p>Player 1 has selected ${p1} and Player 2 has selected ${secondCardSelected}</p>
            <div class="btn-row">
            <button class="btn-blue">Clear selection</button> 
            <a href="board.html" class="btn-light">Start playing</a>
            </div>`;
        document.getElementById(`${secondCardSelected}`).classList.add('hidden');
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.disabled = true);
        document.querySelector('.btn-light').focus();
        document.querySelector('.btn-blue').addEventListener('click', () => clearCharacters(p1, secondCardSelected));
    }

    closeModal(modal);
}