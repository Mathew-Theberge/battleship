import { Ship } from "./app";

export function createGameboard(player) {
    const gameboard = document.createElement("div");
    gameboard.classList.add("board");
    let letterColumn = "ABCDEFGHIJ";

    for (let i = 0; i < 11; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        gameboard.append(row);

        for (let j = 0; j < 10; j++) {
            if (j === 0) {
                const letterTile = document.createElement("div");
                letterTile.textContent = letterColumn[i - 1];
                letterTile.classList.add("letterTile");
                row.append(letterTile);
            }
            if (i === 0) {
                const numTile = document.createElement("div");
                numTile.textContent = j + 1;
                numTile.classList.add("numberTile");
                row.append(numTile);
            } else {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                tile.classList.add(`${letterColumn[i - 1]}${j + 1}-${player}`);
                row.append(tile);
            }
        }
    }
    return gameboard;
}

export function renderGameboard(board, player) {
    if (player === "P1") {
        const board1 = document.querySelector("#board1");
        board1.append(board);
    } else if (player === "P2") {
        const board2 = document.querySelector("#board2");
        board2.append(board);
    }
}

export function renderShips(board, player) {
    for (const row of board) {
        const rowCopy = row;
        for (let i = 0; i < rowCopy[1].length; i++) {
            if (rowCopy[1][i] instanceof Ship) {
                const char = rowCopy[0];
                const tile = document.querySelector(
                    `.${char.toUpperCase()}${i}-${player}`,
                );
                tile.classList.add("ship");
            }
        }
    }
}

export function renderAttacks(board, player) {
    for (const row of board) {
        const rowCopy = row;
        for (let i = 0; i < rowCopy[1].length; i++) {
            if (rowCopy[1][i] === "miss") {
                const char = rowCopy[0];
                const tile = document.querySelector(
                    `.${char.toUpperCase()}${i}-${player}`,
                );
                tile.classList.add("miss");
            } else if (rowCopy[1][i] === "hit") {
                const char = rowCopy[0];
                const tile = document.querySelector(
                    `.${char.toUpperCase()}${i}-${player}`,
                );
                tile.classList.add("hit");
            }
        }
    }
}
