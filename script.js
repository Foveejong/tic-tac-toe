// create a factory function to implement ONE instance of gameboard (not accessible to user)
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const gameBoard = [];

    let index = 0;
    // create 2D array to simulate ttt box
    for (let i = 0; i < rows; i++) {
        // create a row
        gameBoard[i] = [];
        for (let j = 0; j < columns; j++) {
            // create a column in each row
            gameBoard[i].push(Cell(index));
            index++;
        }
    }

    // update the board with chosen cell
    function updateBoard(token, index) {
        // check if square is empty
        for (let k = 0; k < rows; k++) {
            for (let h = 0; h < columns; h++) {
                // if empty, update with token
                if (!gameBoard[k][h].getContent() && gameBoard[k][h].getIndex() === index) {
                    gameBoard[k][h].updateContent(token);
                    return true
                } else if (gameBoard[k][h].getContent() && gameBoard[k][h].getIndex() === index){
                    // if found slot but is filled, return false
                    return false
                }
            }
        }
    }

    // return a getboard function to privatise gameBoard var
    const getBoard = () => gameBoard;
    
    return { getBoard, updateBoard }
}

function Cell(index) {
    let indexNo = index;
    let content = "";
    
    const getIndex = () => indexNo;
    const updateContent = (token) => content = token;
    const getContent = () => content;

    return {getIndex, updateContent, getContent}
}

function gameController(playerOneName = "You", playerTwoName = "Computer") {
    // create and get board
    const gameBoard = Gameboard();
    const board = gameBoard.getBoard();
    const combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    let XTokenArr = [];
    let OTokenArr = [];
    let rounds = 0;

    // create players
    const players = [
        {name: playerOneName, token: "X"},
        {name: playerTwoName, token: "O"}
    ]

    // initialise first player to go
    let currentPlayer = players[0];

    // alternate between turns
    function switchPlayer() {
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
    }

    const checkPlayer = () => currentPlayer;

    // check if a user won
    function checkWins(token, index) {
    // append token positions to respective positions
        if (token === "X") {
            // XTokenArr.push(board[row][col].getIndex());
            XTokenArr.push(index);
            return compareCombinations(XTokenArr)
        } else {
            // OTokenArr.push(board[row][col].getIndex());
            OTokenArr.push(index);
            return compareCombinations(OTokenArr)
        }
    }

    function compareCombinations(arr) {
        // check if arr is length of 3, if not exit immediately
        if (arr.length < 3) return false

        // use every() and includes() methods instead of joining strings
        // to take care of cases where users take >3 moves per user.
        // use idea of comparing a subarray (comb) to an array (arr)
        const outcomeArr = combinations.filter((comb) => comb.every(element => arr.includes(element)))

        // if found a winning combination, return true for win
        return (outcomeArr.length === 1) ? true : false
    }

    function printBoard() {
        // go to each row, then each cell and get the cell's content
        const allTokenPositionsArr = board.map(row => row.map(cell => cell.getContent()));
        console.log(allTokenPositionsArr);
    }

    // check for draws by comparing to rounds variable
    function checkDraw(rounds) {
        if (rounds == 9) return true
    }

    // reset board
    function resetBoard() {
        board.map(row => row.map(cell => cell.updateContent('')))
        XTokenArr = [];
        OTokenArr = [];
        rounds = 0;
        currentPlayer = players[0];
    }

    // play a round
    function playRound(index) {
        // if returned false, which means illegal move, do not switchPlayer otherwise change turns
        if (gameBoard.updateBoard(currentPlayer.token, index)) {
            // increment number of rounds played
            rounds++;

            // after every move, check if someone won
            // prioritise wins
            if (checkWins(currentPlayer.token, index)) {
                alert(`${currentPlayer.name} won!`)
                return true
            } else if (checkDraw(rounds)) {
                alert("Draw!")
                return false
            } 
            // continue game if no outcomes
            switchPlayer()
        }
        // print the board after each playRound called
        printBoard()
    }
    return {playRound, resetBoard, printBoard, checkPlayer, getBoard: gameBoard.getBoard}
}

function screenController() {
    const dialog = document.querySelector(".dialog");
    const form = document.querySelector("form");
    const grid = document.querySelector(".grid");
    const restart = document.querySelector(".restart");
    let game = gameController();
    let board = game.getBoard();

    // show Modal to get names
    document.addEventListener("DOMContentLoaded", dialog.showModal())

    // load page again when user finishes filling modal or esc 
    dialog.addEventListener("submit", e => {
        const playerOne = form.playerOneName.value;
        const playerTwo = form.playerTwoName.value;

        if (playerOne && playerTwo) {
            game = gameController(playerOne, playerTwo);
        } else if (!playerOne && playerTwo) {
            game = gameController("You", playerTwo);
        } else if (playerOne && !playerTwo) {
            game = gameController(playerOne, "Computer");
        }
        board = game.getBoard();
    })  

    // reset the board on clicking restart button 
    restart.addEventListener("click", e => {
        game.resetBoard();
        updateScreen();
    })

    // add svg functions
    function addCross(index) {
        let img = document.createElement("img");
        img.src = "./svg/cross-svgrepo-com.svg";
        img.alt = "cross";
        img.classList.toggle("cross");
        document.querySelector(`.cell-${index}`).appendChild(img);
    }

    function addCircle(index) {
        let img = document.createElement("img");
        img.src = "./svg/circle-double.svg";
        img.alt = "double circle";
        img.classList.toggle("circle");
        document.querySelector(`.cell-${index}`).appendChild(img);
    }

    function disableGrid() {
        let index = 0;
        board.forEach(row => {
            row.forEach(() => {
                const selectedCell = document.querySelector(`.cell-${index}`)

                // disable each cell
                selectedCell.setAttribute("disabled", "");
                index++;
            })
        })
    }

    function updateScreen() {
        // reset the grid if not multiple buttons per gridcell
        grid.textContent = "";

        // count cells
        let index = 0;  

        // for each cell, create a button and input svg
        board.forEach(row => {
            row.forEach((cell) => {
                const cellButton = document.createElement("button");
                const cellContent = cell.getContent();

                // add classes and data attribute
                cellButton.classList.add("cell", `cell-${index}`);
                cellButton.setAttribute("data", index);
                grid.appendChild(cellButton);

                // update cell content
                if (cellContent === "X") {
                    addCross(index);
                } else if (cellContent === "O"){
                    addCircle(index);
                }
                index++;
            })
        })
    }

    // add event listener to board to get index to playRound
    function clickHandlerBoard(e) {
        let end = false;
        // get index of clicked grid
        const selectedIndex = e.target.getAttribute("data");
        // make sure never click gaps in column
        if (!selectedIndex) return

        // playRound with index as input
        // end is a bool, if true means win, false means draw
        end = game.playRound(+selectedIndex)

        // update after every round
        updateScreen();

        // check for outcome
        if (end) {
            // if ended don't accept more inputs
            disableGrid();
        }
    }

    grid.addEventListener("click", clickHandlerBoard)

    // initial render
    updateScreen()
}

screenController();