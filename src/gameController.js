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
        renderPlayComputerUI();
        const P1 = createGameboard("P1");
        const P2 = createGameboard("P2");

        renderGameboard(P1, "P1");
        renderGameboard(P2, "P2");

        gameController.player1 = new Player("player");
        gameController.player2 = new Player("computer");

        gameController.setPlayerNames(
            gameController.player1.name,
            gameController.player2.name,
        );

        gameController.player1.gameboard.placeShip("a", 1, "hor", 5);
        gameController.player1.gameboard.placeShip("b", 7, "ver", 4);
        gameController.player1.gameboard.placeShip("j", 5, "hor", 3);
        gameController.player1.gameboard.placeShip("c", 10, "ver", 3);
        gameController.player1.gameboard.placeShip("a", 7, "hor", 2);

        gameController.player2.gameboard.placeShip("a", 5, "hor", 5);
        gameController.player2.gameboard.placeShip("f", 7, "ver", 4);
        gameController.player2.gameboard.placeShip("j", 2, "hor", 3);
        gameController.player2.gameboard.placeShip("c", 4, "ver", 3);
        gameController.player2.gameboard.placeShip("b", 2, "hor", 2);

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
        let allAttacks = getAllAttacksArray();
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
        gameController.player1.gameboard.receiveAttack(char, num);
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

    shipSunk: (gameboard, ship) => {
        if (gameboard.areAllShipsSunk()) {
            gameController.gameOver();
        } else {
            updateMsgHeader("Enemy Ship Sunk");
            renderSunkShips(gameboard.board, "P2", ship);
        }
    },

    setPlayerNames: (name1, name2) => {
        const player1 = document.querySelector("#player1");
        const player2 = document.querySelector("#player2");
        player1.textContent = name1;
        player2.textContent = name2;
    },
};

function getAllAttacksArray() {
    let allAttacks = {};
    let letterColumn = "abcdefghij".split("");
    let numberRow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const letter of letterColumn) {
        const letterCopy = letter;

        for (const num of numberRow) {
            allAttacks[letterCopy + num] = letterCopy + num;
        }
    }
    return allAttacks;
}
