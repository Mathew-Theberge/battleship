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

export function renderStartScreenUI() {
    const button = document.createElement("button");
    button.id = "playComputer";
    button.textContent = "Play Computer";
    document.body.append(button);
}

export function renderPlayComputerUI() {
    document.body.replaceChildren();
    const header = document.createElement("header");
    const section = document.createElement("section");
    const shipContainer = document.createElement("div");
    const boardContainer = document.createElement("div");
    const board1 = document.createElement("div");
    const player1 = document.createElement("div");
    const board2 = document.createElement("div");
    const player2 = document.createElement("div");
    const footer = document.createElement("footer");

    section.id = "mainGame";
    shipContainer.id = "shipContainer";
    boardContainer.classList.add("boardContainer");
    board1.id = "board1";
    player1.id = "player1";
    board2.id = "board2";
    player2.id = "player2";
    header.textContent = "BattleShip";
    document.body.append(header, section, footer);
    section.append(shipContainer, boardContainer);
    boardContainer.append(board1, board2);
    board1.append(player1);
    board2.append(player2);
}
