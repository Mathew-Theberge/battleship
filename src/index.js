import "./style.css";
import { Gameboard, Player, Ship } from "./app.js";

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

console.log(player.gameboard.board);
console.log(computer.gameboard.board);
