import { isBrowser } from "browser-or-node";

export class Ship {
    constructor(length) {
        this.length = length;
    }
    #hits = 0;
    #sunk = false;

    hit() {
        this.#hits++;
    }

    isSunk() {
        if (this.#hits >= this.length) {
            this.#sunk = true;
            return true;
        } else return false;
    }
}

export class Gameboard {
    constructor() {
        this.board = this.#createBoard();
    }

    #allShips = [];
    #letterColumn = "abcdefghij".split("");

    #createBoard() {
        let board = new Map();
        for (const char of this.#letterColumn) {
            // setting 11 indices instead of 10 so the index matches with
            // the input numbers 1-10 index 0 will just be ignored
            board.set(char, new Array(11).fill(0));
        }
        return board;
    }

    #isTileEmpty(char, num) {
        if (this.board.get(char)[num] !== 0) {
            if (isBrowser) {
                alert("cannot place ships ontop of each other");
            }
            return false;
        } else {
            return true;
        }
    }

    #isInBounds(char, num) {
        if (!this.#letterColumn.includes(char) || num > 10 || num < 0) {
            if (isBrowser) {
                alert("must pick letter a-j and number 1-10");
            }
            return false;
        } else {
            return true;
        }
    }

    #getEndCharAndIndex(char, shipLen) {
        const endCharIndex =
            this.#letterColumn.findIndex((value) => {
                return value === char;
            }) +
            (shipLen - 1);

        return [this.#letterColumn[endCharIndex], endCharIndex];
    }

    placeShip(char, num, dir, shipLen) {
        if (!this.#isInBounds(char, num)) return null;

        const endChar = this.#getEndCharAndIndex(char, shipLen)[0];
        const endCharIndex = this.#getEndCharAndIndex(char, shipLen)[1];
        const endNum = num + shipLen - 1;

        if (dir === "ver" && this.#isInBounds(endChar, num)) {
            const ship = new Ship(shipLen);
            for (let i = 0; i < shipLen; i++) {
                this.board.get(`${this.#letterColumn[endCharIndex - i]}`)[num] =
                    ship;
            }
        }

        if (dir === "hor" && this.#isInBounds(char, endNum)) {
            const ship = new Ship(shipLen);
            for (let i = 0; i < shipLen; i++) {
                this.board.get(char)[num + i] = ship;
            }
            console.log(this.board);
        }
        return null;
    }
}
