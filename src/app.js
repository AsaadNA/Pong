const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isRightPressed = false;
let isLeftPressed = false;

let gameOver = false;

let playerScore = document.getElementById('playerScore');
let playerScoreCounter = 0;

let enemyScore  = document.getElementById('enemyScore');
let enemyScoreCounter = 0;

KeyDownHandler = (e) => {
    gameOver = false;
    if(e.key == "ArrowRight") {
        isRightPressed = true;
    } 

    else if(e.key == "ArrowLeft") {   
        isLeftPressed = true;
    }
}

KeyUpHandler = (e) => {
    if(e.key == "ArrowRight") {
        isRightPressed = false;
    } 

    else if(e.key == "ArrowLeft") {   
        isLeftPressed = false;
    }
}

document.addEventListener("keydown",KeyDownHandler,false);
document.addEventListener("keyup",KeyUpHandler,false);

class GameEntity
{
    constructor(x,y,w,h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    getX() { return this.x; }
    getY() { return this.y; }
    getW() { return this.w; }
    getH() { return this.h; }

    moveX(x) { this.x += x; }
    moveY(y) { this.y += y; }

    setX(x) { this.x = x; }
    setY(y) { this.y = y; }
}

//////  PADDLES ///////////

RenderPaddle = (paddle) =>
{
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(paddle.getX(),paddle.getY(),15,120);
    ctx.fill();
}

let paddleSpeed = 8.0;
UpdatePaddle = (paddle) =>
{
    if(isRightPressed) paddle.moveY(paddleSpeed);
    if(isLeftPressed)  paddle.moveY(-paddleSpeed);
}

let calculatedPosition = 0;
UpdateEnemyPaddle = (ball,paddle) => 
{
    //@NOTE: AI is unbeatable 
    calculatedPosition += (ball.getY() - paddle.getY()) * Math.pow(ball.getX() / (canvas.width * 2.1),2.5);
    paddle.setY(calculatedPosition);
}

//////  BALL ///////////

RenderBall = (ball) =>
{
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

let bspeed = 14;
let bdx = bspeed;
let bdy = 0;
UpdateBall = (ball,paddle) => 
{
    if(ball.getX() < paddle.getX())
    {
        enemyScoreCounter += 1;
        gameOver = true;
        enemyScore.innerHTML = "Enemy Score: " + enemyScoreCounter;        
    }

    if(ball.getX() > 765)
    {
        playerScoreCounter += 1;
        gameOver = true;
        playerScore.innerHTML = "Player Score: " + playerScoreCounter;
    }
    
    //Collision with wall
    if(ball.getX() + bdx > canvas.width-10 || ball.getX() + bdx < 10) bdx *= -1;
    if(ball.getY() + bdy > canvas.height + 10 || ball.getY() + bdy < 10) bdy *= -1;

    if(ball.getX() > paddle.getX() && ball.getX() < paddle.getX() + paddle.getW())
    {
        //@TODO: Ball collision could be better . . . . . . . 
        if(ball.getY() > paddle.getY() && ball.getY() < paddle.getY() + paddle.getH())
        {
            let pCenter = paddle.getY() + (paddle.getH() / 2);
            let d = pCenter - ball.getY();
            bdy *= -1;
            bdx *= -1;
        }
    }

    if(ball.getX() > 745)
    {
        if(ball.getY() > paddle.getY() && ball.getY() < paddle.getY() + paddle.getH())
        {
            let pCenter = paddle.getY() + (paddle.getH() / 2);
            let d = pCenter - ball.getY();
            bdy += d * -0.1;
            bdx *= -1;   
        } else bdx *= -1;
    }

    ball.moveX(bdx);
    ball.moveY(bdy);

 }

///// MAIN //////////////////

const playerPaddle = new GameEntity(50,50,30,120);
const enemyPaddle =  new GameEntity(800-50,50,30,120);

const ball = new GameEntity(canvas.width/2,canvas.height/2,0,0);

Reset = () => {
    ball.setX(canvas.width/2);
    ball.setY(canvas.height/2);
    bdx = bspeed;
    bdy = 0;
}

Update = () => {
    UpdateBall(ball,playerPaddle);
    UpdatePaddle(playerPaddle);
    UpdateEnemyPaddle(ball,enemyPaddle);
}

Render = () => {
 
    ctx.clearRect(0,0,800,600);
 
    RenderPaddle(playerPaddle);
    RenderPaddle(enemyPaddle);
    RenderBall(ball);
}

Run = () => {
    setInterval(() => {
        if(gameOver) Reset();
        Update();
        Render();
    } , 1000/60);
}

Run();