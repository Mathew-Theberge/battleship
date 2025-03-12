import {
    createGameboard,
    renderAttacks,
    renderGameboard,
    renderPlayComputerUI,
    renderShips,
    renderAttackLog,
    updateMsgHeader,
    renderSunkShips,
} from "./DOM.js";

import { Player, receiveAttack, Ship } from "./app.js";

export const gameController = {
    player1sTurn: true,
    player2sTurn: false,
    player1: null,
    player2: null,

    startComputerGame: () => {
        gameController.setPlayerNames(true);

        renderPlayComputerUI();

        gameController.player1 = new Player("player");
        gameController.player2 = new Player("computer");

        gameController.placeRandomShips(gameController.player1.gameboard);

        gameController.placeRandomShips(gameController.player2.gameboard);

        renderShips(gameController.player1.gameboard.board, "P1");
        // renderShips(gameController.player2.gameboard.board, "P2");
    },

    changePlayerTurn: () => {
        if (gameController.player1sTurn) {
            gameController.player1sTurn = false;
            gameController.player2sTurn = true;
        } else if (gameController.player2sTurn) {
            gameController.player2sTurn = false;
            gameController.player1sTurn = true;
        }
    },

    playComputersTurn: () => {
        if (!gameController.player2sTurn) return;
        let allAttacks = getRandomCordsArr();
        for (const attack of gameController.player1.gameboard.allAttacks) {
            delete allAttacks[attack];
        }
        // picks random attack cords from the remaining ones
        let attack =
            allAttacks[
                Object.keys(allAttacks)[
                    Math.floor(Math.random() * Object.keys(allAttacks).length)
                ]
            ];
        let char = attack[0];
        let num = attack.slice(1);
        let ValueOfAttack = gameController.player1.gameboard.receiveAttack(
            char,
            num,
        );
        if (ValueOfAttack instanceof Ship) {
            gameController.shipSunk(
                gameController.player1.gameboard,
                "P1",
                ValueOfAttack,
                "Computer has sunk your ship",
                gameController.player2.name,
            );
        }
        renderAttacks(gameController.player1.gameboard.board, "P1");
        gameController.changePlayerTurn();
    },

    playPlayersTurn: (char, num) => {
        if (gameController.player1sTurn) {
            const attack = gameController.player2.gameboard.receiveAttack(
                char,
                +num,
            );
            renderAttacks(gameController.player2.gameboard.board, "P2");
            renderAttackLog(gameController.player2.gameboard);
            if (attack instanceof Ship) {
                gameController.shipSunk(
                    gameController.player2.gameboard,
                    attack,
                    "P2",
                    "Enemy Ship Sunk",
                    gameController.player1.name,
                );
            }
            if (attack === "already been attacked") {
                alert("already been attacked");
            } else {
                gameController.changePlayerTurn();
                gameController.playComputersTurn();
            }
        }
    },

    shipSunk: (gameboard, ship, playerTag, msg, playerName) => {
        if (gameboard.areAllShipsSunk()) {
            renderSunkShips(gameboard.board, playerTag, ship);
            gameController.gameOver(playerName);
        } else {
            updateMsgHeader(msg);
            renderSunkShips(gameboard.board, playerTag, ship);
        }
    },

    setPlayerNames: (playingComputer = false) => {
        const player1Input = document.querySelector("#player1Input");
        const player2Input = document.querySelector("#player2Input");
        const player1 = document.querySelector("#player1");
        const player2 = document.querySelector("#player2");
        const player1Name = document.createElement("div");
        const player2Name = document.createElement("div");
        player1Name.classList.add("name");
        player2Name.classList.add("name");
        if (playingComputer) {
            player1Name.textContent = "Player";
            player2Name.textContent = "Computer";
            player1.insertBefore(player1Name, player1.firstChild);
            player2.insertBefore(player2Name, player2.firstChild);
        } else {
            player1Name.textContent = player1Input.value;
            player2Name.textContent = player2Input.value;
            player1.insertBefore(player1Name, player1.firstChild);
            player2.insertBefore(player2Name, player2.firstChild);
        }
    },

    placeRandomShips: (gameboard) => {
        let shipArr = [
            [null, 5],
            [null, 4],
            [null, 3],
            [null, 3],
            [null, 2],
        ];

        shipArr.forEach((arr) => {
            while (arr[0] === null) {
                let randomUnits = getRandomUnits();
                arr[0] = gameboard.placeShip(
                    randomUnits[0],
                    randomUnits[1],
                    randomUnits[2],
                    arr[1],
                );
            }
        });
    },

    gameOver: (playerName) => {
        gameController.player1sTurn = false;
        gameController.player2sTurn = false;

        updateMsgHeader(`${playerName} Has won`);
    },
};

function getRandomCordsArr() {
    let allCords = {};
    let letterColumn = "abcdefghij".split("");
    let numberRow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const letter of letterColumn) {
        const letterCopy = letter;

        for (const num of numberRow) {
            allCords[letterCopy + num] = letterCopy + num;
        }
    }
    return allCords;
}

function getRandomUnits() {
    let randomCordsArr = getRandomCordsArr();
    let randomCords =
        randomCordsArr[
            Object.keys(randomCordsArr)[
                Math.floor(Math.random() * Object.keys(randomCordsArr).length)
            ]
        ];
    let dirArr = ["ver", "hor"];

    let randomDir = dirArr[Math.floor(Math.random() * dirArr.length)];
    let char = randomCords[0];
    let num = +randomCords.slice(1);

    return [char, num, randomDir];
}
