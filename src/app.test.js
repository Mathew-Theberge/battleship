import { Ship } from "./app.js";

test("isSunk method on Ship class", () => {
    const ship = new Ship(4)
    ship.hit()
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBe(false)
    ship.hit()
    expect(ship.isSunk()).toBe(true)
})

describe("gameBoard Class", () => {
    const gameboard = new Gameboard()

    describe("placeShip func", () => {

        test("while cords are in bounds", () => {
            gameboard.placeShip("b", 7)
            expect(gameboard.board.get("b")[6]).toBe(1)

        })

        test("while cords are out of bounds", () => {
            expect(gameboard.placeShip("v", 13)).toBeNull()
        })
        
    })
})
