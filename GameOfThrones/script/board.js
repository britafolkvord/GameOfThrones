const player1Character = localStorage.getItem('player1');
const player2Character = localStorage.getItem('player2');
let modal = document.querySelector('.modal');
document.querySelector('.close').focus();
document.querySelectorAll('.close, .btn-play').forEach(function (el) {
    el.addEventListener('click', () => closeModal(modal));
});
createGame();
let p1CurrentPosition = 1;
let p2CurrentPosition = 1;
let playerTurn = 1;
let p1token;
let p2token;



async function createGame() {
    try {
        const response = await fetch('/script/characters.json').then(r => r.json());
        const characters = response.data;
        createBoard();
        displayCharacters(characters);
    } catch (error) {

    }

};

function createBoard() {
    const boardElement = document.querySelector(".board");

    for (let row = 0; row < 5; row++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add("row");

        for (let tile = 1; tile <= 6; tile++) {
            rowElement.appendChild(createTile((row * 6) + tile));
        }

        if (row === 1 || row === 3) {
            rowElement.classList.add('reverse');
        }

        boardElement.appendChild(rowElement);
    }
}

function createTile(number) {
    const tile = document.createElement("div");
    tile.setAttribute('data-number', number);
    tile.innerHTML = `<span>${number}</span>`;
    tile.classList.add("tile");

    return tile;
};



function displayCharacters(charactersArr) {

    const p1Reg = new RegExp(player1Character, "i");
    const p2Reg = new RegExp(player2Character, "i");

    const p1Selected = charactersArr.filter(function (character) {
        return p1Reg.test(character.name)
    });

    const p2Selected = charactersArr.filter(function (character) {
        return p2Reg.test(character.name)
    });

    document.querySelector('.p1-character').innerHTML = `
    <h2>${p1Selected[0].name}</h2>
    <img src="${p1Selected[0].sigil}" alt="${p1Selected[0].name}">
    `;

    document.querySelector('.p2-character').innerHTML = `
    <h2>${p2Selected[0].name}</h2>
    <img src="${p2Selected[0].sigil}" alt="${p2Selected[0].name}">
    `;

    document.querySelector('.tile[data-number="1"]').innerHTML = `
    <div class="startTile">
    <h3>Start</h3>
    <img src="${p1Selected[0].sigil}" alt="${p1Selected[0].name}" class="p1token">
    <img src="${p2Selected[0].sigil}" alt="${p2Selected[0].name}" class="p2token">
    </div>
    `;

    document.querySelector('.tile[data-number="30"]').innerHTML = `
    <div class="startTile">
    <h3>Finish</h3>
    </div>
    `;


};





const p1Dice = document.querySelector("#p1-dice");
const p2Dice = document.querySelector("#p2-dice");

const p1button = document.querySelector("#p1-roll");
p1button.disabled = false;

const p2button = document.querySelector("#p2-roll");
p2button.disabled = true;

document.querySelector("#p1-roll").addEventListener('click', () => rollDice(p1Dice));
document.querySelector("#p2-roll").addEventListener('click', () => rollDice(p2Dice));





function rollDice(playerDice) {
    let randomNumber = Math.round(Math.random() * 5) + 1;
    playerDice.src = "img/d" + randomNumber + ".png";
    const altArr = ['roll: 1', 'roll: 2', 'roll: 3', 'roll: 4', 'roll: 5', 'roll: 6'];
    playerDice.alt = altArr[randomNumber - 1];
    p1token = document.querySelector(".p1token");
    p2token = document.querySelector(".p2token");

    if (playerTurn === 1) {
        p1CurrentPosition = p1CurrentPosition + randomNumber;
        if (p1CurrentPosition >= 30) {
            announceWinner(player1Character);
        } else {

            document.querySelector(`.tile[data-number="${p1CurrentPosition}"]`).appendChild(p1token);

            if (p1CurrentPosition === 5 || p1CurrentPosition === 10 || p1CurrentPosition === 15 || p1CurrentPosition === 20 || p1CurrentPosition === 25) {
                makeTraps(p1CurrentPosition, p1token);
            } else if (p1CurrentPosition === 3 || p1CurrentPosition === 13) {
                makeAdvantage(p1CurrentPosition, p1token);
            };
        }
        if (randomNumber != 6) {
            playerTurn = 2;
            p2button.disabled = false;
            p1button.disabled = true;
        }


    } else {
        p2CurrentPosition = p2CurrentPosition + randomNumber;
        if (p2CurrentPosition >= 30) {
            announceWinner(player2Character);
        } else {

            document.querySelector(`.tile[data-number="${p2CurrentPosition}"]`).appendChild(p2token);

            if (p2CurrentPosition === 5 || p2CurrentPosition === 10 || p2CurrentPosition === 15 || p2CurrentPosition === 20 || p2CurrentPosition === 25) {
                makeTraps(p2CurrentPosition, p2token);
            } else if (p2CurrentPosition === 3 || p2CurrentPosition === 13) {
                makeAdvantage(p2CurrentPosition, p2token);
            };


            if (randomNumber != 6) {
                playerTurn = 1;
                p1button.disabled = false;
                p2button.disabled = true;
            }

        }
    }
};


function makeTraps(playerPosition, token) {
    let trapNumber = Math.round(Math.random() * 4) + 1;
    let modal = document.createElement("div");
    modal.classList.add('modal');
    if (trapNumber === 1) {
        modal.innerHTML = `
        <div class="modal-trap-content">
        <button class="close">&times;</button>
        <h4>A wild boar blocks your path!</h4>
        <p>Take two steps back to get to safety, and wait for the boar to disappear</p>
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
    document.querySelector('.close').focus();
    document.querySelector(`.tile[data-number="${playerPosition}"]`).append(token);
    document.querySelectorAll('.close, .btn-blue').forEach(function (el) {
        el.addEventListener('click', () => closeModal(modal));
    })

};

function makeAdvantage(playerPosition, token) {
    let advantageNumber = Math.round(Math.random() * 1) + 1;
    let modal = document.createElement("div");
    modal.classList.add('modal');
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
    document.querySelector('.close').focus();
    document.querySelector(`.tile[data-number="${playerPosition}"]`).append(token);
    document.querySelectorAll('.close, .btn-blue').forEach(function (el) {
        el.addEventListener('click', () => closeModal(modal));
    })
}

function announceWinner(winner) {
    localStorage.setItem('winner', winner);
    location.replace("winner.html");
};


function closeModal(modal) {

    modal.remove();

};

