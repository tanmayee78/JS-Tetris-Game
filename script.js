const grid = document.querySelector("#grid");
const cells = [];
const width = 10;
let currentPosition = 4;
const tetromino = [0, 1, 2, 3];

// Create grid
for (let i = 0; i < 200; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  grid.appendChild(cell);
  cells.push(cell);
}
for (let i = 0; i < 10; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell", "taken");
  grid.appendChild(cell);
  cells.push(cell);
}

// Draw and undraw Tetromino
function draw() {
  tetromino.forEach(index => cells[currentPosition + index].classList.add("active"));
}
function undraw() {
  tetromino.forEach(index => cells[currentPosition + index].classList.remove("active"));
}

// Move Tetromino
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Freeze Tetromino
function freeze() {
  if (tetromino.some(index => cells[currentPosition + index + width].classList.contains("taken"))) {
    tetromino.forEach(index => cells[currentPosition + index].classList.add("taken"));
    currentPosition = 4;
    draw();
  }
}

// Player controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === "ArrowDown") moveDown();
});
function moveLeft() {
  undraw();
  if (!tetromino.some(index => (currentPosition + index) % width === 0)) currentPosition -= 1;
  draw();
}
function moveRight() {
  undraw();
  if (!tetromino.some(index => (currentPosition + index) % width === width - 1)) currentPosition += 1;
  draw();
}

// Start game
setInterval(moveDown, 1000);