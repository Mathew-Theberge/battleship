import { renderAttacks } from "./DOM";

export const gameController = {
    player1sTurn: true,
    player2sTurn: false,

    changePlayerTurn: () => {
        if (gameController.player1sTurn) {
            gameController.player1sTurn = false;
            gameController.player2sTurn = true;
        } else if (gameController.player2sTurn) {
            gameController.player2sTurn = false;
            gameController.player1sTurn = true;
        }
    },

    playComputersTurn: (playerBoard) => {
        let allAttacks = getAllAttacksArray();
        for (const attack of playerBoard.allAttacks) {
            delete allAttacks[attack];
        }
        let attack =
            allAttacks[
                Object.keys(allAttacks)[
                    Math.floor(Math.random() * Object.keys(allAttacks).length)
                ]
            ];
        let char = attack[0];
        let num = attack.slice(1);
        playerBoard.receiveAttack(char, num);
        renderAttacks(playerBoard.board, "P1");
        gameController.changePlayerTurn();
    },
};

function getAllAttacksArray() {
    let allAttacks = {};
    let letterColumn = "abcdefghij".split("");
    let numberRow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (const letter of letterColumn) {
        const letterCopy = letter;

        for (const num of numberRow) {
            allAttacks[letterCopy + num] = letterCopy + num;
        }
    }
    return allAttacks;
}

console.log(getAllAttacksArray());
