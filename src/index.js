import "./style.css";
import { Gameboard, Player, Ship } from "./app.js";
import {
    createGameboard,
    renderAttacks,
    renderGameboard,
    renderShips,
} from "./DOM.js";

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
renderShips(computer.gameboard.board, "P2");

player.gameboard.receiveAttack("b", 4);
player.gameboard.receiveAttack("b", 3);
player.gameboard.receiveAttack("b", 7);
renderAttacks(player.gameboard.board, "P1");

computer.gameboard.receiveAttack("b", 4);
computer.gameboard.receiveAttack("b", 3);
computer.gameboard.receiveAttack("b", 7);
renderAttacks(computer.gameboard.board, "P2");
