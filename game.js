const dimension = 25;
let score = 0;
let board = document.getElementById("board");
for (var j = 0; j < dimension; j++) {
    let row = document.createElement("div");
    row.style.display = "flex";
    board.appendChild(row);
    for (var i = 0; i < dimension; i++) {
        let brick = document.createElement("div");
        brick.style.background = "white";
        brick.style.width = "10";
        brick.style.height = "10";
        brick.id = `${i}-${j}`
        brick.style.border = "1px solid black";
        row.appendChild(brick);
    }
}

// class SnakeBody {
//     constructor(x, y){
//         this.x = x;
//         this.y = y;
//     }
//     updatePosition(newX, newY){
//         this.x = x;
//         this.y = y;
//     }
// }

class Snake {
    constructor() {
        this.direction = "E";
        this.body = [[0, 12], [0, 12], [0, 12]];
    }
    updateDirection(newDirection) {
        this.direction = newDirection;
    }
    move() {
        switch (this.direction) {
            case "N":
                this.body.shift();
                this.body.push([this.body[this.body.length - 1][0], this.body[this.body.length - 1][1] - 1]);
                break;
            case "S":
                this.body.shift();
                this.body.push([this.body[this.body.length - 1][0], this.body[this.body.length - 1][1] + 1]);
                break;
            case "W":
                this.body.shift();
                this.body.push([this.body[this.body.length - 1][0] - 1, this.body[this.body.length - 1][1]]);
                break;
            case "E":
                this.body.shift();
                this.body.push([this.body[this.body.length - 1][0] + 1, this.body[this.body.length - 1][1]]);
                break;
            default:
                break;
        }
    }
    grow(x, y) {
        this.body.push([x, y]);
    }
}
class Food {
    constructor() {
        this.x = Math.round(Math.random() * (dimension - 1));
        this.y = Math.round(Math.random() * (dimension - 1));
        this.status = "active";
    }
    createFood() {
        this.x = Math.round(Math.random() * (dimension - 1));
        this.y = Math.round(Math.random() * (dimension - 1));
        this.status = "active";
    }
    deleteFood() {
        this.status = "deactive";
    }
}
let previousSnake = [];
const snake = new Snake();
const food = new Food();
function drawSnake() {
    previousSnake.forEach(item => {
        document.getElementById(`${item[0]}-${item[1]}`).style.background = "white";
    })
    snake.body.forEach(item => {
        document.getElementById(`${item[0]}-${item[1]}`).style.background = "green";
    })
    const head = snake.body[snake.body.length - 1];
    if ((head[0] === dimension - 1 && snake.direction === "E")
        || (head[1] === dimension - 1 && snake.direction === "S")
        || (head[0] === 0 && snake.direction === "W")
        || (head[1] === 0 && snake.direction === "N")
    ) { document.getElementById(`${head[0]}-${head[1]}`).style.background = "yellow"; }
    snake.body.forEach((item, i) => {
        previousSnake[i] = [...item];
    }
    )
}
let scoreText = document.getElementById("score");
function drawFood() {
    if (food.status === "deactive") { food.createFood(); }
    document.getElementById(`${food.x}-${food.y}`).style.background = "black";
    const head = snake.body[snake.body.length - 1];
    if (head[0] === food.x && head[1] === food.y) {
        score += 100;
        scoreText.innerText = score.toString();
        snake.grow(food.x, food.y);
        food.deleteFood();
    }
}
var fps = 5;
function draw() {
    snake.move();
    drawFood();
    drawSnake();
    setTimeout(() => {
        if (!((snake.body[snake.body.length - 1][0] === dimension - 1 && snake.direction === "E")
            || (snake.body[snake.body.length - 1][1] === dimension - 1 && snake.direction === "S")
            || (snake.body[snake.body.length - 1][0] === -1 && snake.direction === "W")
            || (snake.body[snake.body.length - 1][1] === -1 && snake.direction === "N"))
        )
            requestAnimationFrame(draw);
    }, 1000 / fps)
}
draw();

window.addEventListener("keydown", (event) => {
    if (event.keyCode == 37) {
        if (snake.direction !== "E")
            snake.updateDirection("W");

    }
    else if (event.keyCode == 38) {
        if (snake.direction !== "S")
            snake.updateDirection("N");

    }
    else if (event.keyCode == 39) {
        if (snake.direction !== "W")
            snake.updateDirection("E");

    }
    else if (event.keyCode == 40) {
        if (snake.direction !== "N") {
            snake.updateDirection("S");
        }

    }
})
let lastDirection = "";
function blurMenu() {
    let menu = document.getElementById("menu");
    menu.style.opacity = 0;
    menu.style.display = "none";
    menu.style.transitionDuration = "0.8s";

}
function pauseGame() {
    let pauseBtn = document.getElementById("pauseBtn");
    if (pauseBtn.innerText === "Pause") {
        lastDirection = snake.direction;
        snake.updateDirection("pause");
        pauseBtn.innerText = "Resume";
    }
    else {
        snake.updateDirection(lastDirection || "E");
        pauseBtn.innerText = "Pause";
    }

}