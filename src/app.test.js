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

        test("ship placement on occupied tiles", () => {
            expect(gameboard.placeShip("b", 1, "hor", 5)).toBeNull();
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

    describe("receiveAttck func", () => {
        test("on blank tile", () => {
            expect(gameboard.receiveAttack("c", 4)).toBe("miss");
        });

        test("on ocupied tile", () => {
            expect(gameboard.receiveAttack("b", 4)).toBe("hit");
        });

        test("sinking ship", () => {
            gameboard.receiveAttack("b", 2);
            gameboard.receiveAttack("b", 3);
            gameboard.receiveAttack("b", 5);
            expect(gameboard.board.get("b")[6].isSunk()).toBe(false);
            gameboard.receiveAttack("b", 6);
            expect(gameboard.board.get("b")[6].isSunk()).toBe(true);
        });

        test("attack same spot", () => {
            expect(gameboard.receiveAttack("b", 4)).toBe(
                "already been attacked",
            );
        });
    });

    describe("areAllShipsSunk func", () => {
        test("when all ships are not sunk", () => {
            expect(gameboard.areAllShipsSunk()).toBe(false);
        });

        test("when all ships are sunk", () => {
            gameboard.receiveAttack("b", 7);
            gameboard.receiveAttack("c", 7);
            gameboard.receiveAttack("d", 7);
            gameboard.receiveAttack("e", 7);
            expect(gameboard.areAllShipsSunk()).toBe(false);
            gameboard.receiveAttack("f", 7);
            expect(gameboard.areAllShipsSunk()).toBe(true);
        });
    });
});
