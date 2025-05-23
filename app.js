const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const resetbutton = document.getElementById("resetbutton");
const gameWidth = canvas.width;
const gameHeight = canvas.height
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
let snake = [
    {x:unitSize*4,y:0},
    {x:unitSize*3,y:0},
    {x:unitSize*2,y:0},
    {x:unitSize,y:0},
    {x:0, y:0}
];
window.addEventListener("keydown",changeDirection);
resetbutton.addEventListener("click",resetGame);
gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick()
};
function nextTick(){
    if (running) {
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawsnake();
            checkGameOver();
            nextTick();
        },75)
    }
};
function clearBoard(){};
function createFood(){
    function randomFood(min,max){
        const randNum = Math.round((Math.random()* (max - min) + min) / unitSize)*unitSize;
        return randNum;
    }
    foodX = randomFood(0,gameWidth - unitSize);
    console.log(foodX);
    foodY = randomFood(0,gameWidth - unitSize);
};
function drawFood(){
    ctx.fillstyle = foodColor;
    ctx.fillRect(foodX,foodY,unitSize,unitSize);
};
function moveSnake(){};
function changeDirection(){};
function checkGameOver(){};
function displayGameOver(){};
function resetGame(){};
function drawsnake(){};
