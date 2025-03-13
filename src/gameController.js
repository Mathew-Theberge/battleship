import {
    createGameboard,
    renderAttacks,
    renderGameboard,
    renderPlayComputerUI,
    renderShips,
    renderAttackLog,
    updateMsgHeader,
    renderSunkShips,
    updatePlayer1Log,
    updatePlayer2Log,
    renderStartGameUI,
    hideShips,
    showAllShips,
    toggleTurnColor,
} from "./DOM.js";

import { Player, receiveAttack, Ship } from "./app.js";

export const gameController = {
    player1sTurn: true,
    player2sTurn: false,
    player1: new Player("Player 1"),
    player2: new Player("Player 2"),
    player1Name: null,
    player2Name: null,
    nextComputerAttack: null,

    startGame: () => {
        toggleTurnColor();
        const names = gameController.setPlayerNames();
        gameController.player1Name = names[0];
        gameController.player2Name = names[1];
        updatePlayer1Log(`its ${gameController.player1Name}(s) Turn`);
        updatePlayer2Log("");

        renderStartGameUI();
        hideShips(gameController.player1.gameboard.board, "P1");
        hideShips(gameController.player2.gameboard.board, "P2");
    },

    startComputerGame: () => {
        toggleTurnColor();
        updatePlayer1Log("Its Players Turn");
        updatePlayer2Log("Computer is waiting");
        gameController.setPlayerNames(true);

        renderPlayComputerUI();

        gameController.player2 = new Player("computer");

        // renders blank board incase player added ships to second board
        // then played agaist the computer
        renderShips(gameController.player2.gameboard.board, "P2");
        gameController.placeRandomShips(gameController.player2.gameboard);

        renderShips(gameController.player1.gameboard.board, "P1");
    },

    changePlayerTurn: () => {
        if (gameController.player1sTurn) {
            gameController.player1sTurn = false;
            gameController.player2sTurn = true;
        } else if (gameController.player2sTurn) {
            gameController.player2sTurn = false;
            gameController.player1sTurn = true;
        }
        toggleTurnColor(gameController.player1sTurn);
    },

    playComputersTurn: () => {
        if (!gameController.player2sTurn) return;
        let char;
        let num;
        let allAttacks = getRandomCordsArr();
        for (const attack of gameController.player1.gameboard.allAttacks) {
            delete allAttacks[attack];
        }
        if (gameController.nextComputerAttack !== null) {
            char = gameController.nextComputerAttack[0];
            num = gameController.nextComputerAttack[1];
        } else if (Object.keys(allAttacks).length === 90) {
            console.log("90");
            let attack = gameController.guaranteedHit(
                gameController.player1.gameboard.board,
            );
            char = attack[0];
            num = attack[1];
        } else if (Object.keys(allAttacks).length === 70) {
            console.log("70");
            let attack = gameController.guaranteedHit(
                gameController.player1.gameboard.board,
            );
            char = attack[0];
            num = attack[1];
        } else if (Object.keys(allAttacks).length === 50) {
            console.log("50");
            let attack = gameController.guaranteedHit(
                gameController.player1.gameboard.board,
            );
            char = attack[0];
            num = attack[1];
        } else {
            console.log();
            let attack =
                allAttacks[
                    Object.keys(allAttacks)[
                        Math.floor(
                            Math.random() * Object.keys(allAttacks).length,
                        )
                    ]
                ];
            char = attack[0];
            num = attack.slice(1);
        }
        // picks random attack cords from the remaining ones
        let ValueOfAttack = gameController.player1.gameboard.receiveAttack(
            char,
            num,
        );
        updatePlayer2Log("Computer is attacking");
        setTimeout(
            () => {
                if (
                    ValueOfAttack instanceof Ship &&
                    !Array.isArray(ValueOfAttack)
                ) {
                    updatePlayer2Log(
                        `Computer Sunk Your Ship at ${char + num}!`,
                    );
                    gameController.shipSunk(
                        gameController.player1.gameboard,
                        ValueOfAttack,
                        "P1",
                        "Computer",
                        `Computer Sunk Your Ship at ${char + num}!`,
                    );
                }
                if (ValueOfAttack === "miss") {
                    updatePlayer2Log(`Computer Missed at ${char + num}`);
                }
                if (ValueOfAttack === "hit") {
                    console.log(gameController.nextComputerAttack);
                    updatePlayer2Log(`Computer Hit at ${char + num}`);
                    gameController.setNextComputerAttack(
                        char,
                        num,
                        gameController.player1.gameboard.board,
                    );
                }
                renderAttacks(gameController.player1.gameboard.board, "P1");
                gameController.changePlayerTurn();
            },
            // Math.random() * 2000 + 500,
        );
    },

    guaranteedHit: (board) => {
        for (const row of board) {
            const rowCopy = row;
            for (let i = 0; i < rowCopy[1].length; i++) {
                if (rowCopy[1][i] instanceof Ship) {
                    return [rowCopy[0], i];
                }
            }
        }
    },

    setNextComputerAttack: (char, num, board) => {
        const letterArr = "abcdefghij".split("");
        const currCharIndex = letterArr.findIndex((value) => {
            return value === char;
        });
        let prevChar = letterArr[currCharIndex - 1];
        let nextChar = letterArr[currCharIndex + 1];
        let prevNum = +num - 1;
        let nextNum = +num + 1;
        if (prevChar !== undefined) {
            if (board.get(prevChar)[num] instanceof Ship) {
                gameController.nextComputerAttack = [prevChar, num];
                return;
            }
        }
        if (nextChar !== undefined) {
            if (board.get(nextChar)[num] instanceof Ship) {
                gameController.nextComputerAttack = [nextChar, num];
                return;
            }
        }
        if (nextNum < 11) {
            if (board.get(char)[nextNum] instanceof Ship) {
                gameController.nextComputerAttack = [char, nextNum];
                return;
            }
        }
        if ([prevNum > 0]) {
            if (board.get(char)[prevNum] instanceof Ship) {
                gameController.nextComputerAttack = [char, prevNum];
                return;
            }
        }
        gameController.nextComputerAttack = null;
    },

    playPlayersTurn: (char, num) => {
        if (gameController.player1sTurn) {
            const attack = gameController.player2.gameboard.receiveAttack(
                char,
                +num,
            );
            renderAttacks(gameController.player2.gameboard.board, "P2");
            renderAttackLog(gameController.player2.gameboard);
            if (attack instanceof Ship) {
                updatePlayer1Log(`Player Sunk Enemy Ship at ${char + num}!`);
                gameController.shipSunk(
                    gameController.player2.gameboard,
                    attack,
                    "P2",
                    "Player",
                    `Player Sunk Enemy Ship at ${char + num}!`,
                );
            }
            if (attack === "hit") {
                updatePlayer1Log(`Player Hit! at ${char + num}`);
            }
            if (attack === "miss") {
                updatePlayer1Log(`Player Missed at ${char + num}`);
            }
            if (attack === "already been attacked") {
                alert("already been attacked");
            } else {
                gameController.changePlayerTurn();
                gameController.playComputersTurn();
            }
        }
    },

    playPlayerOnesTurn: (char, num) => {
        if (gameController.player1sTurn) {
            const attack = gameController.player2.gameboard.receiveAttack(
                char,
                +num,
            );
            renderAttacks(gameController.player2.gameboard.board, "P2");
            // renderAttackLog(gameController.player2.gameboard);
            if (attack instanceof Ship) {
                updatePlayer1Log(
                    `${gameController.player1Name} Sunk Enemy Ship at ${char + num}!`,
                );
                gameController.shipSunk(
                    gameController.player2.gameboard,
                    attack,
                    "P2",
                    `${gameController.player1Name}`,
                    `${gameController.player1Name} Sunk Enemy Ship at ${char + num}!`,
                );
            }
            if (attack === "hit") {
                updatePlayer1Log(
                    `${gameController.player1Name} Hit! at ${char + num}`,
                );
            }
            if (attack === "miss") {
                updatePlayer1Log(
                    `${gameController.player1Name} Missed at ${char + num}`,
                );
            }
            if (attack === "already been attacked") {
                alert("already been attacked");
            } else {
                gameController.changePlayerTurn();
            }
        }
    },

    playPlayerTwosTurn: (char, num) => {
        if (gameController.player2sTurn) {
            const attack = gameController.player1.gameboard.receiveAttack(
                char,
                +num,
            );
            renderAttacks(gameController.player1.gameboard.board, "P1");
            // renderAttackLog(gameController.player2.gameboard);
            if (attack instanceof Ship) {
                updatePlayer1Log(
                    `${gameController.player2Name} Sunk Enemy Ship at ${char + num}!`,
                );
                gameController.shipSunk(
                    gameController.player1.gameboard,
                    attack,
                    "P1",
                    `${gameController.player2Name}`,
                    `${gameController.player2Name} Sunk Enemy Ship at ${char + num}!`,
                );
            }
            if (attack === "hit") {
                updatePlayer1Log(
                    `${gameController.player2Name} Hit! at ${char + num}`,
                );
            }
            if (attack === "miss") {
                updatePlayer1Log(
                    `${gameController.player2Name} Missed at ${char + num}`,
                );
            }
            if (attack === "already been attacked") {
                alert("already been attacked");
            } else {
                gameController.changePlayerTurn();
            }
        }
    },

    shipSunk: (gameboard, ship, playerTag, playerName, finalMsg) => {
        gameController.nextComputerAttack = null;
        if (gameboard.areAllShipsSunk()) {
            renderSunkShips(gameboard.board, playerTag, ship);
            gameController.gameOver(playerName, finalMsg);
        } else {
            renderSunkShips(gameboard.board, playerTag, ship);
        }
    },

    setPlayerNames: (playingComputer = false) => {
        const player1Input = document.querySelector("#player1Input");
        const player2Input = document.querySelector("#player2Input");
        const board1 = document.querySelector("#board1");
        const board2 = document.querySelector("#board2");
        const player1Name = document.createElement("div");
        const player2Name = document.createElement("div");
        player1Name.classList.add("name");
        player2Name.classList.add("name");
        if (playingComputer) {
            player1Name.textContent = "Player";
            player2Name.textContent = "Computer";
            board1.insertBefore(player1Name, board1.firstChild);
            board2.insertBefore(player2Name, board2.firstChild);
        } else {
            if (player1Input.value === "") {
                player1Input.value = "Player one";
            }
            if (player2Input.value === "") {
                player2Input.value = "Player two";
            }
            player1Name.textContent = player1Input.value;
            player2Name.textContent = player2Input.value;
            board1.insertBefore(player1Name, board1.firstChild);
            board2.insertBefore(player2Name, board2.firstChild);
            return [player1Input.value, player2Input.value];
        }
    },

    placeRandomShips: (gameboard) => {
        let shipArr = [
            [null, 5],
            [null, 4],
            [null, 3],
            [null, 3],
            [null, 2],
        ];

        shipArr.forEach((arr) => {
            while (arr[0] === null) {
                let randomUnits = getRandomUnits();
                arr[0] = gameboard.placeShip(
                    randomUnits[0],
                    randomUnits[1],
                    randomUnits[2],
                    arr[1],
                );
            }
        });
    },

    setRandomShipBoard(gameboard, player) {
        gameboard.clearBoard();
        gameController.placeRandomShips(gameboard);
        renderShips(gameboard.board, player);
    },

    gameOver: (playerName, finalMsg) => {
        gameController.player1sTurn = false;
        gameController.player2sTurn = false;
        showAllShips(gameController.player1.gameboard.board, "P1");
        showAllShips(gameController.player2.gameboard.board, "P2");
        updatePlayer1Log(`${playerName} Has won`);
        updatePlayer2Log(finalMsg);
    },
};

function getRandomCordsArr() {
    let allCords = {};
    let letterColumn = "abcdefghij".split("");
    let numberRow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const letter of letterColumn) {
        const letterCopy = letter;

        for (const num of numberRow) {
            allCords[letterCopy + num] = letterCopy + num;
        }
    }
    return allCords;
}

function getRandomUnits() {
    let randomCordsArr = getRandomCordsArr();
    let randomCords =
        randomCordsArr[
            Object.keys(randomCordsArr)[
                Math.floor(Math.random() * Object.keys(randomCordsArr).length)
            ]
        ];
    let dirArr = ["ver", "hor"];

    let randomDir = dirArr[Math.floor(Math.random() * dirArr.length)];
    let char = randomCords[0];
    let num = +randomCords.slice(1);

    return [char, num, randomDir];
}
