const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const resetbutton = document.getElementById("resetbutton");
const startbutton = document.getElementById("playbutton");
const video = document.getElementById("video");

const gameWidth = canvas.width;
const gameHeight = canvas.height;
const boardBack = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let direction = "RIGHT";
let lastX = null, lastY = null;

let snake = [
    {x:unitSize*4,y:0},
    {x:unitSize*3,y:0},
    {x:unitSize*2,y:0},
    {x:unitSize,y:0},
    {x:0, y:0}
];

startbutton.addEventListener("click", gameStart);
resetbutton.addEventListener("click", resetGame);


function gameStart() {
    running = true;
    score = 0;
    scoreText.textContent = score;
    createFood();
    nextTick();
}
function drawCheckerboard(rows, cols, size) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = "#e0e0e0";
            } else {
                ctx.fillStyle = "#ffffff";
            }
            ctx.fillRect(col * size, row * size, size, size);
        }
    }
}
function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            changeDirection(); // Based on hand
            moveSnake();
            drawsnake();
            checkGameOver();
            nextTick();
        }, 100);
    }
}

function clearBoard() {
    drawCheckerboard(gameHeight / unitSize, gameWidth / unitSize, unitSize);
}

function createFood(){
    function randomFood(min, max){
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function drawsnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, unitSize, unitSize);
        ctx.strokeRect(part.x, part.y, unitSize, unitSize);
    });
}

function moveSnake(){
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function checkGameOver(){
    const head = snake[0];
    const hitWall = head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight;
    const hitSelf = snake.slice(1).some(part => part.x === head.x && part.y === head.y);

    if (hitWall || hitSelf) {
        running = false;
        displayGameOver();
    }
}

function displayGameOver(){
    ctx.font = "50px Verdana";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", gameWidth / 2, gameHeight / 2);
}

function resetGame(){
    xVelocity = unitSize;
    yVelocity = 0;
    direction = "RIGHT";
    snake = [
        {x:unitSize*4,y:0},
        {x:unitSize*3,y:0},
        {x:unitSize*2,y:0},
        {x:unitSize,y:0},
        {x:0, y:0}
    ];
    clearBoard();     
    drawsnake();        
    drawFood();         
    running = false;    
}


const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const indexFinger = results.multiHandLandmarks[0][8];
        const x = indexFinger.x;
        const y = indexFinger.y;

        if (lastX !== null && lastY !== null) {
            const dx = x - lastX;
            const dy = y - lastY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0.03) direction = "RIGHT";
                else if (dx < -0.03) direction = "LEFT";
            } else {
                if (dy > 0.03) direction = "DOWN";
                else if (dy < -0.03) direction = "UP";
            }
        }

        lastX = x;
        lastY = y;
    }
});

const camera = new Camera(video, {
    onFrame: async () => {
        await hands.send({ image: video });
    },
    width: 640,
    height: 480
});
camera.start();


function changeDirection(){
    switch (direction) {
        case "LEFT":
            if (xVelocity === 0) {
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;
        case "RIGHT":
            if (xVelocity === 0) {
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;
        case "UP":
            if (yVelocity === 0) {
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;
        case "DOWN":
            if (yVelocity === 0) {
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
    }
}
clearBoard();
drawsnake();
createFood();


