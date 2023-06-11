const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;
let animationTime = 200;

const drawBorder = function () {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);

}



const drawScore = function () {
    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    ctx.textBaseline = "top";
    ctx.textAlign = "left"
    ctx.fillText("Score :" + score, blockSize, blockSize);
}

const gameOver = function () {
    clearInterval(intervalID);
    ctx.font = "60px Courier";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", width / 2, height / 2)
};

const circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.Pi * 2, false)
    if (fillCircle) {
        ctx.fill()
    } else {
        ctx.stroke()
    }
}

const Block = function (col, row) {
    this.col = col;
    this.row = row;
};

Block.prototype.drawSquar = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize)
}

Block.prototype.drawCircle = function (color) {
    const centerX = this.col * blockSize + blockSize / 2;
    const centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true)
}

Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}

const Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ]

    this.direction = "right";
    this.nextDirection = "right";
}

Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i += 2) {
        this.segments[i].drawSquar('blue')
    }
    for (let i = 1; i < this.segments.length; i += 2) {
        this.segments[i].drawSquar('yellow')
    }
    this.segments[0].drawSquar('red')
};

Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row)
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row)
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1)
    } else if (direction = "up") {
        newHead = new Block(head.col, head.row - 1)
    }

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        animationTime -= 5;
        apple.move()
    } else {
        this.segments.pop();
    }


};

Snake.prototype.checkCollision = function (head) {
    const leftCollision = (head.col === 0);
    const topCollision = (head.row === 0);
    const rightCollision = (head.col === widthInBlocks - 1);
    const bottomCollision = (head.row === heightInBlocks - 1);

    const wallCollision = leftCollision || topCollision || bottomCollision || rightCollision;
    let selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return selfCollision || wallCollision;
};



Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === 'up' && newDirection === 'down') {
        return
    } else if (this.direction === "right" && newDirection === "left") {
        return
    } else if (this.direction === "down" && newDirection === "up") {
        return
    } else if (this.direction === "left" && newDirection === "right") {
        return
    }
    this.nextDirection = newDirection;
}

const Apple = function () {
    this.position = new Block(10, 10);
};

Apple.prototype.draw = function () {
    this.position.drawSquar('limeGreen')
}


Apple.prototype.move = function (ocypedSnake) {
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);

    for (let i = 0; i < ocypedSnake.length; i++) {
        if (this.position.equal(ocypedSnake[i])) {
            this.move(ocypedSnake)
            return;
        }
    }
}

const snake = new Snake();
const apple = new Apple();
apple.draw()
snake.draw()

// const intervalID = setInterval(function () {
//     ctx.clearRect(0, 0, width, height);
//     drawScore();
//     snake.move();
//     snake.draw();
//     apple.draw();
//     drawBorder();

// }, 100)

const directions = {
    37: "left",
    38: "top",
    39: "right",
    40: "down"
}

const playing = true;

const gameLoop = function () {
    ctx.clearRect(0, 0, width, height)
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();

    if (playing) {
        setTimeout(gameLoop, animationTime)
    }

}

gameLoop();
$("body").keydown(function (event) {
    const NewDirection = directions[event.keyCode];
    if (NewDirection !== undefined) {
        snake.setDirection(NewDirection)
    }
});