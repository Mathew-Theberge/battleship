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
