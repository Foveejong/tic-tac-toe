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
    function updateBoard(token, row, col) {
        // check if square is empty
        for (let k = 0; k < rows; k++) {
            for (let h = 0; h < columns; h++) {
                // if empty, update with token
                if (!gameBoard[row][col].getContent()) {
                    gameBoard[row][col].updateContent(token);
                    return true
                } else {
                    // if found slot and is filled, return false
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
    const XTokenArr = [];
    const OTokenArr = [];
    let rounds = 0;

    // create players
    const p1 = {name: playerOneName, token: "X"};
    const p2 = {name: playerTwoName, token: "O"};

    // initialise first player to go
    let currentPlayer = p1;

    // alternate between turns
    function switchPlayer() {
        currentPlayer = (currentPlayer === p1) ? p2 : p1;
    }

    // check if a user won
    function checkWins(token, row, col) {
    // append token positions to respective positions
        if (token === "X") {
            XTokenArr.push(board[row][col].getIndex());
            return compareCombinations(XTokenArr)
        } else {
            OTokenArr.push(board[row][col].getIndex());
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
    }

    // play a round
    function playRound(row, col) {
        // if returned false, which means illegal move, do not switchPlayer
        // otherwise change turns
        if (gameBoard.updateBoard(currentPlayer.token, row, col)) {
            // increment number of rounds played
            rounds++;
            // check for draw
            if (checkDraw(rounds)) {
                alert("Draw!")
                resetBoard();
            }

            // after every move, check if someone won
            //if won, alert "won!"
            if (checkWins(currentPlayer.token, row, col)) {
                alert(`${currentPlayer.name} won!`)
                resetBoard();
            }

            // if no outcome, continue game
            switchPlayer()
        }
        // print the board after each playRound called
        printBoard()
    }

    return {playRound, printBoard}
}

function screenController() {
    const game = gameController();
}