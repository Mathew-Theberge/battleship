import { isBrowser } from "browser-or-node";
import { renderSunkShips } from "./DOM";

export class Ship {
    constructor(length) {
        this.length = length;
    }
    #hits = 0;

    hit() {
        this.#hits++;
    }

    isSunk() {
        if (this.#hits >= this.length) return true;
        else return false;
    }
}

export class Gameboard {
    constructor() {
        this.board = this.#createBoard();
        this.attackLog = [];
        this.allAttacks = [];
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
            return false;
        } else {
            return true;
        }
    }

    #isInBounds(char, num) {
        if (!this.#letterColumn.includes(char) || num > 10 || num < 0) {
            return false;
        } else {
            return true;
        }
    }

    #isPlacementValid(char, num, dir, shipLen) {
        const currCharIndex = this.#letterColumn.findIndex((value) => {
            return value === char;
        });
        const endCharIndex = currCharIndex + shipLen - 1;
        const charColumn = this.#letterColumn.slice(
            currCharIndex,
            endCharIndex + 1,
        );
        if (dir === "ver") {
            for (const char of charColumn) {
                if (
                    !this.#isInBounds(char, num) ||
                    !this.#isTileEmpty(char, num)
                ) {
                    return [false];
                }
            }
            return [true, charColumn];
        }

        if (dir === "hor") {
            for (let i = 0; i < shipLen; i++) {
                if (
                    !this.#isInBounds(char, num + i) ||
                    !this.#isTileEmpty(char, num + i)
                ) {
                    return [false];
                }
            }
            return [true];
        }
    }

    placeShip(char, num, dir, shipLen) {
        if (dir === "ver") {
            const results = this.#isPlacementValid(char, num, dir, shipLen);
            if (results[0]) {
                const ship = new Ship(shipLen);
                this.#allShips.push(ship);
                for (const char of results[1]) {
                    this.board.get(char)[num] = ship;
                }
            }
        }

        if (dir === "hor") {
            if (this.#isPlacementValid(char, num, dir, shipLen)[0]) {
                const ship = new Ship(shipLen);
                this.#allShips.push(ship);
                for (let i = 0; i < shipLen; i++) {
                    this.board.get(char)[num + i] = ship;
                }
            }
        }
        return null;
    }

    receiveAttack(char, num) {
        if (this.allAttacks.includes(char + num)) {
            return "already been attacked";
        }
        const ship = this.board.get(char)[num];
        if (this.board.get(char)[num] === 0) {
            this.allAttacks.push(char + num);
            this.attackLog.push([char + num, "miss"]);
            this.board.get(char)[num] = ["miss", ship];
            return "miss";
        }
        if (this.board.get(char)[num] instanceof Ship) {
            this.allAttacks.push(char + num);
            this.attackLog.push([char + num, "hit"]);
            this.board.get(char)[num].hit();
            if (ship.isSunk()) {
                this.board.get(char)[num] = ["hit", ship];
                return ship;
            } else {
                this.board.get(char)[num] = ["hit", ship];
                return "hit";
            }
        }
    }

    isShipSunk() {}

    areAllShipsSunk() {
        for (const ship of this.#allShips) {
            if (!ship.isSunk()) return false;
        }
        return true;
    }
}

export class Player {
    constructor(name) {
        this.name = name;
        this.gameboard = new Gameboard();
    }
}
