import { Ship, Gameboard } from "./app.js";

test("isSunk method on Ship class", () => {
    const ship = new Ship(4);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

describe("gameBoard Class", () => {
    const gameboard = new Gameboard();

    describe("placeShip func", () => {
        test("ship placement in free tiles verticaly", () => {
            gameboard.placeShip("b", 7, "ver", 5);
            expect(gameboard.board.get("b")[7]).toBeInstanceOf(Ship);
            expect(gameboard.board.get("c")[7]).toBeInstanceOf(Ship);
            expect(gameboard.board.get("d")[7]).toBeInstanceOf(Ship);
            expect(gameboard.board.get("e")[7]).toBeInstanceOf(Ship);
            expect(gameboard.board.get("f")[7]).toBeInstanceOf(Ship);
        });

        test("ship placement in free tiles horizontally", () => {
            gameboard.placeShip("b", 2, "hor", 5);
            expect(gameboard.board.get("b")[2]).toBeInstanceOf(Ship);
            expect(gameboard.board.get("b")[3]).toBeInstanceOf(Ship);
            expect(gameboard.board.get("b")[4]).toBeInstanceOf(Ship);
            expect(gameboard.board.get("b")[5]).toBeInstanceOf(Ship);
            expect(gameboard.board.get("b")[6]).toBeInstanceOf(Ship);
        });

        test("ship placement with in bound start cords but would go out of bounds", () => {
            expect(gameboard.placeShip("c", 9, "hor", 3)).toBeNull();
        });

        test("ship placement with out of bound cords", () => {
            expect(gameboard.placeShip("v", 13, "hor", 3)).toBeNull();
        });

        test("value of blank cords", () => {
            expect(gameboard.board.get("c")[4]).toBe(0);
        });
    });
});
