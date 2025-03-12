import {
    createGameboard,
    renderAttacks,
    renderGameboard,
    renderPlayComputerUI,
    renderShips,
    renderAttackLog,
    updateMsgHeader,
    renderSunkShips,
    updatePlayer1Log,
    updatePlayer2Log,
} from "./DOM.js";

import { Player, receiveAttack, Ship } from "./app.js";

export const gameController = {
    player1sTurn: true,
    player2sTurn: false,
    player1: new Player("Player 1"),
    player2: new Player("Player 2"),

    startComputerGame: () => {
        gameController.setPlayerNames(true);

        renderPlayComputerUI();

        gameController.player2 = new Player("computer");

        gameController.placeRandomShips(gameController.player2.gameboard);

        renderShips(gameController.player1.gameboard.board, "P1");
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
        updatePlayer2Log("Computer is attacking");
        setTimeout(
            () => {
                if (ValueOfAttack instanceof Ship) {
                    updatePlayer2Log(
                        `Computer Sunk Your Ship on ${char + num}!`,
                    );
                    gameController.shipSunk(
                        gameController.player1.gameboard,
                        "P1",
                        ValueOfAttack,
                        "Computer",
                        `Computer Sunk Your Ship on ${char + num}!`,
                    );
                }
                if (ValueOfAttack === "miss") {
                    updatePlayer2Log(`Computer Missed at ${char + num}`);
                }
                if (ValueOfAttack === "hit") {
                    updatePlayer2Log(`Computer Hit at ${char + num}`);
                }
                renderAttacks(gameController.player1.gameboard.board, "P1");
                gameController.changePlayerTurn();
            },
            Math.random() * 1000 + 500,
        );
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
                updatePlayer1Log(`Player Sunk Enemy Ship on ${char + num}!`);
                gameController.shipSunk(
                    gameController.player2.gameboard,
                    attack,
                    "P2",
                    "Player",
                    `Player Sunk Enemy Ship on ${char + num}!`,
                );
            }
            if (attack === "hit") {
                updatePlayer1Log(`Player Hit! on ${char + num}`);
            }
            if (attack === "miss") {
                updatePlayer1Log(`Player Missed on ${char + num}`);
            }
            if (attack === "already been attacked") {
                alert("already been attacked");
            } else {
                gameController.changePlayerTurn();
                gameController.playComputersTurn();
            }
        }
    },

    shipSunk: (gameboard, ship, playerTag, playerName, finalMsg) => {
        if (gameboard.areAllShipsSunk()) {
            renderSunkShips(gameboard.board, playerTag, ship);
            gameController.gameOver(playerName, finalMsg);
        } else {
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

    setRandomShipBoard(gameboard, player) {
        gameboard.clearBoard();
        gameController.placeRandomShips(gameboard);
        renderShips(gameboard.board, player);
    },

    gameOver: (playerName, finalMsg) => {
        gameController.player1sTurn = false;
        gameController.player2sTurn = false;

        updatePlayer1Log(`${playerName} Has won`);
        updatePlayer2Log(finalMsg);
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
