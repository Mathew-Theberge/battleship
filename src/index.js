import "./style.css";
import { Gameboard, Player, Ship } from "./app.js";
import {
    createGameboard,
    renderAttacks,
    renderGameboard,
    renderShips,
} from "./DOM.js";
import { gameController } from "./gameController.js";

const playComputerBtn = document.querySelector("#playComputer");

playComputerBtn.addEventListener(
    "click",
    () => {
        const P1 = createGameboard("P1");
        const P2 = createGameboard("P2");

        renderGameboard(P1, "P1");
        renderGameboard(P2, "P2");

        const player = new Player("player");
        const computer = new Player("computer");

        player.gameboard.placeShip("a", 1, "hor", 5);
        player.gameboard.placeShip("b", 7, "ver", 4);
        player.gameboard.placeShip("j", 5, "hor", 3);
        player.gameboard.placeShip("c", 10, "ver", 3);
        player.gameboard.placeShip("a", 7, "hor", 2);

        computer.gameboard.placeShip("a", 5, "hor", 5);
        computer.gameboard.placeShip("f", 7, "ver", 4);
        computer.gameboard.placeShip("j", 2, "hor", 3);
        computer.gameboard.placeShip("c", 4, "ver", 3);
        computer.gameboard.placeShip("b", 2, "hor", 2);

        renderShips(player.gameboard.board, "P1");
        console.log(player.gameboard.allAttacks);

        const enemyTiles = document.querySelectorAll(".P2");

        enemyTiles.forEach((tile) => {
            let char = tile.getAttribute("class")[0].toLowerCase();
            let num = tile.getAttribute("class").slice(1, 3);
            if (num.includes("-")) {
                num = num.slice(0, 1);
            }
            tile.addEventListener("click", () => {
                if (gameController.player1sTurn) {
                    const attack = computer.gameboard.receiveAttack(char, +num);
                    renderAttacks(computer.gameboard.board, "P2");
                    if (attack === "already been attacked") {
                        alert("already been attacked");
                    } else {
                        gameController.changePlayerTurn();
                        gameController.playComputersTurn(
                            computer.gameboard,
                            player.gameboard,
                        );
                    }
                }
            });
        });
    },
    { once: true },
);
