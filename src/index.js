import "./style.css";
import { Gameboard, Player, Ship } from "./app.js";
import { createGameboard, renderGameboard } from "./DOM.js";
import { gameController } from "./gameController.js";

const P1 = createGameboard("P1");
const P2 = createGameboard("P2");

renderGameboard(P1, "P1");
renderGameboard(P2, "P2");

const playComputerBtn = document.querySelector("#computerBtn");

playComputerBtn.addEventListener(
    "click",
    () => {
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
    },
    { once: true },
);
