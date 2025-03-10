export class Ship {
    constructor(length) {
        this.length = length
    }
    #hits = 0
    #sunk = false

    hit() {
        this.#hits++
    }

    isSunk() {
        if(this.#hits >= this.length) {
            this.#sunk = true
            return true
        } else return false
    }
}