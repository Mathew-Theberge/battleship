import "./style.css";
import { Gameboard, Player, Ship } from "./app.js";
import {
    createGameboard,
    renderGameboard,
    renderShips,
    updateMsgHeader,
    updatePlayer1Log,
    updatePlayer2Log,
} from "./DOM.js";
import { gameController } from "./gameController.js";

const P1 = createGameboard("P1");
const P2 = createGameboard("P2");

renderGameboard(P1, "P1");
renderGameboard(P2, "P2");

updatePlayer1Log("This is the attack log");
updatePlayer2Log("Recent attcks and there effects are shown here");

const playComputerBtn = document.querySelector("#computerBtn");

playComputerBtn.addEventListener("click", () => {
    if (gameController.player1.gameboard.isBoardEmpty()) {
        updatePlayer1Log("Place ships on first board before starting");
        updatePlayer2Log("");
    } else {
        gameController.startComputerGame();

        const enemyTiles = document.querySelectorAll(".P2");

        enemyTiles.forEach((tile) => {
            // grabbing cords from each tile to use in receiveAttack func
            let char = tile.getAttribute("class")[0].toLowerCase();
            let num = tile.getAttribute("class").slice(1, 3);
            if (num.includes("-")) {
                num = num.slice(0, 1);
            }

            tile.addEventListener("click", () => {
                gameController.playPlayersTurn(char, num);
            });
        });
    }
});

const randomizePlayer1ShipsBtn = document.querySelector("#player1RandomBtn");
const randomizePlayer2ShipsBtn = document.querySelector("#player2RandomBtn");

randomizePlayer1ShipsBtn.addEventListener("click", () => {
    gameController.setRandomShipBoard(gameController.player1.gameboard, "P1");
});

randomizePlayer2ShipsBtn.addEventListener("click", () => {
    gameController.setRandomShipBoard(gameController.player2.gameboard, "P2");
});

const startBtn = document.querySelector("#startBtn");

startBtn.addEventListener("click", () => {
    if (
        gameController.player1.gameboard.isBoardEmpty() ||
        gameController.player2.gameboard.isBoardEmpty()
    ) {
        updatePlayer1Log("Place ships on both boards before starting");
        updatePlayer2Log("");
    } else {
        gameController.startGame();

        const player1Tiles = document.querySelectorAll(".P1");
        const player2Tiles = document.querySelectorAll(".P2");

        player2Tiles.forEach((tile) => {
            // grabbing cords from each tile to use in receiveAttack func
            let char = tile.getAttribute("class")[0].toLowerCase();
            let num = tile.getAttribute("class").slice(1, 3);
            if (num.includes("-")) {
                num = num.slice(0, 1);
            }

            tile.addEventListener("click", () => {
                gameController.playPlayerOnesTurn(char, num);
            });
        });

        player1Tiles.forEach((tile) => {
            // grabbing cords from each tile to use in receiveAttack func
            let char = tile.getAttribute("class")[0].toLowerCase();
            let num = tile.getAttribute("class").slice(1, 3);
            if (num.includes("-")) {
                num = num.slice(0, 1);
            }

            tile.addEventListener("click", () => {
                gameController.playPlayerTwosTurn(char, num);
            });
        });
    }
});
