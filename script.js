// Grid and Tetromino Setup
const grid = document.getElementById("grid");
const cells = [];
const gridWidth = 10;
const gridHeight = 20;

// Variables for gameplay
let gameInterval;
let currentTetromino = [];
let currentPosition = 4;
let currentRotation = 0;
let score = 0;

const tetrominoesWithRotations = {
    "L": [
        [1, gridWidth + 1, gridWidth * 2 + 1, 2],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 2],
        [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 2],
        [gridWidth, gridWidth * 2, gridWidth * 2 + 1, gridWidth * 2 + 2]
    ],
    "I": [
        [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth * 3 + 1],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3]
    ],
    "O": [
        [0, 1, gridWidth, gridWidth + 1]
    ],
    "T": [
        [1, gridWidth, gridWidth + 1, gridWidth + 2],
        [1, gridWidth + 1, gridWidth * 2 + 1, gridWidth + 2],
        [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth * 2 + 1],
        [1, gridWidth, gridWidth + 1, gridWidth * 2 + 1]
    ]
    // Add "Z" and "S" shapes similarly
};


// Create Grid Function
function createGrid() {
    for (let i = 0; i < gridWidth * gridHeight; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);
        cells.push(cell);
    }
}
createGrid();

// Draw Tetromino on Grid
function drawTetromino() {
    currentTetromino.forEach(index => {
        cells[currentPosition + index].classList.add("active");
    });
}

// Clear Tetromino from Grid
function clearTetromino() {
    currentTetromino.forEach(index => {
        cells[currentPosition + index].classList.remove("active");
    });
}

// Move Tetromino Down
function moveDown() {
    clearTetromino();
    currentPosition += gridWidth;
    if (checkCollision()) {
        currentPosition -= gridWidth;
        lockTetromino();
        return;
    }
    drawTetromino();
}

// Check for Collision
function checkCollision() {
    return currentTetromino.some(index => {
        const newPosition = currentPosition + index + gridWidth;
        return (
            newPosition >= gridWidth * gridHeight || // Out of bounds
            cells[newPosition].classList.contains("taken") // Hits another block
        );
    });
}


// Lock Tetromino in Place
function lockTetromino() {
    currentTetromino.forEach(index => {
        cells[currentPosition + index].classList.add("taken");
    });
    clearFullRows();
    spawnNewTetromino();
}

// Clear Full Rows
function clearFullRows() {
    for (let row = 0; row < gridHeight; row++) {
        const rowStart = row * gridWidth;
        const isFullRow = [...Array(gridWidth).keys()].every(
            col => cells[rowStart + col].classList.contains("taken")
        );
        if (isFullRow) {
            score += 100;
            document.getElementById("score").textContent = score;

            // Clear the full row
            for (let col = 0; col < gridWidth; col++) {
                cells[rowStart + col].classList.remove("taken", "active");
            }

            // Shift rows down
            for (let i = rowStart - 1; i >= 0; i--) {
                if (cells[i].classList.contains("taken")) {
                    cells[i].classList.remove("taken");
                    cells[i + gridWidth].classList.add("taken");
                }
            }
        }
    }
}


// Spawn New Tetromino
function spawnNewTetromino() {
    const tetrominoKeys = Object.keys(tetrominoesWithRotations);
    const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
    currentTetromino = tetrominoesWithRotations[randomKey][0];
    currentPosition = 4;
    currentRotation = 0;
    if (checkCollision()) {
        endGame();
    } else {
        drawTetromino();
    }
}



// Movement Functions
function moveLeft() {
    clearTetromino();
    const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % gridWidth === 0);
    const isBlockedLeft = currentTetromino.some(index => cells[currentPosition + index - 1].classList.contains("taken"));
    if (!isAtLeftEdge && !isBlockedLeft) currentPosition--;
    drawTetromino();
}

function moveRight() {
    clearTetromino();
    const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % gridWidth === gridWidth - 1);
    const isBlockedRight = currentTetromino.some(index => cells[currentPosition + index + 1].classList.contains("taken"));
    if (!isAtRightEdge && !isBlockedRight) currentPosition++;
    drawTetromino();
}

function rotateTetromino() {
    clearTetromino();
    const nextRotation = (currentRotation + 1) % tetrominoesWithRotations["L"].length;
    const nextTetromino = tetrominoesWithRotations["L"][nextRotation];
    const isOutOfBounds = nextTetromino.some(index =>
        (currentPosition + index) % gridWidth === 0 || 
        (currentPosition + index) % gridWidth === gridWidth - 1
    );
    const isBlocked = nextTetromino.some(index => cells[currentPosition + index].classList.contains("taken"));
    if (!isOutOfBounds && !isBlocked) {
        currentRotation = nextRotation;
        currentTetromino = nextTetromino;
    }
    drawTetromino();
}

// Keyboard Controls
document.addEventListener("keydown", event => {
    if (!gameInterval) return; // Ignore input if the game is not running
    switch (event.key) {
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowUp":
            rotateTetromino();
            break;
        case "ArrowDown":
            moveDown(); // Fast fall
            break;
        default:
            break;
    }
});

// Start Button Logic
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {
    if (!gameInterval) {
        startButton.textContent = "Playing...";
        spawnNewTetromino();
        gameInterval = setInterval(moveDown, 1000);
    }
});

// End Game
function endGame() {
    clearInterval(gameInterval);
    gameInterval = null;
    alert("Game Over! Your score: " + score);
    startButton.textContent = "Start Game";
}

