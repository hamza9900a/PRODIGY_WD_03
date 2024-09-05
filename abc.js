// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart');
    const opponentSelect = document.getElementById('opponent');
    const player1Text = document.getElementById('player1');
    const player2Text = document.getElementById('player2');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let player1Wins = 0;
    let player2Wins = 0;
    
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = cell.getAttribute('data-index');

        if (gameState[cellIndex] !== '' || !gameActive) {
            return;
        }

        cell.textContent = currentPlayer;
        gameState[cellIndex] = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            setTimeout(() => {
                alert(`Player ${currentPlayer} wins!`);
                updateScores();
                restartGame(); // Automatically restart the game
            }, 10);
        } else if (!gameState.includes('')) {
            gameActive = false;
            setTimeout(() => {
                alert('It\'s a draw!');
                restartGame(); // Automatically restart the game
            }, 10);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O' && opponentSelect.value === 'ai') {
                setTimeout(() => aiMove(), 500); // AI makes a move after a short delay
            }
        }
    }

    function aiMove() {
        const bestMove = minimax(gameState, 'O').index;
        const cell = document.querySelector(`.cell[data-index='${bestMove}']`);
        
        cell.textContent = currentPlayer;
        gameState[bestMove] = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            setTimeout(() => {
                alert(`Player ${currentPlayer} wins!`);
                updateScores();
                restartGame(); // Automatically restart the game
            }, 10);
        } else if (!gameState.includes('')) {
            gameActive = false;
            setTimeout(() => {
                alert('It\'s a draw!');
                restartGame(); // Automatically restart the game
            }, 10);
        } else {
            currentPlayer = 'X';
        }
    }

    function minimax(newGameState, player) {
        const availSpots = newGameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

        if (checkWinState(newGameState, 'X')) {
            return { score: -10 };
        } else if (checkWinState(newGameState, 'O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newGameState[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newGameState, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newGameState, 'O');
                move.score = result.score;
            }

            newGameState[availSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    function checkWinState(board, player) {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return board[index] === player;
            });
        });
    }

    function restartGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => cell.textContent = '');
    }

    function updateScores() {
        if (currentPlayer === 'X') {
            player1Wins++;
            score1.textContent = player1Wins;
        } else {
            player2Wins++;
            score2.textContent = player2Wins;
        }
        // Update player text with wins count
        player1Text.textContent = `Player 1 (X) - Wins: ${player1Wins}`;
        player2Text.textContent = `Player 2 (O) - Wins: ${player2Wins}`;
    }
});
