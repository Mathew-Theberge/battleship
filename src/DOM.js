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
                tile.classList.add(
                    `${letterColumn[i - 1]}${j + 1}-${player}`,
                    "tile",
                    `${player}`,
                );
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
                // this is so old ship classes get removed when
                // ships are randomized or have to be changed in any way
            } else if (i > 0) {
                const char = rowCopy[0];
                const tile = document.querySelector(
                    `.${char.toUpperCase()}${i}-${player}`,
                );
                tile.classList.remove("ship");
            }
        }
    }
}

export function renderSunkShips(board, player, ship) {
    for (const row of board) {
        const rowCopy = row;
        for (let i = 0; i < rowCopy[1].length; i++) {
            if (rowCopy[1][i][1] === ship) {
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
            if (rowCopy[1][i][0] === "miss") {
                const char = rowCopy[0];
                const tile = document.querySelector(
                    `.${char.toUpperCase()}${i}-${player}`,
                );
                tile.classList.add("miss");
            } else if (rowCopy[1][i][0] === "hit") {
                const char = rowCopy[0];
                const tile = document.querySelector(
                    `.${char.toUpperCase()}${i}-${player}`,
                );
                tile.classList.add("hit");
            }
        }
    }
}

export function renderAttackLog(enemysBoard) {
    const log = document.querySelector("footer");
    log.replaceChildren();
    enemysBoard.attackLog.forEach((arr) => {
        const cords = document.createElement("span");
        if (arr[1] === "hit") cords.classList.add("hitLogMsg");
        cords.textContent = `${arr[0]}, `;
        log.append(cords);
    });
}

export function updateMsgHeader(str) {
    const msgHeader = document.querySelector("#msgHeader");
    msgHeader.textContent = str;
}

export function renderPlayComputerUI() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => input.remove());
    const controls = document.querySelectorAll(".controls");
    controls.forEach((control) => control.remove());
    const buttonFooter = document.querySelector("#buttonFooter");
    buttonFooter.remove();
}
