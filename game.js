<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Platform Platform Game</title>
    <style>
        body {
            background-color: #f0f0f0; /* Background color for the page */
        }

        canvas {
            border: 1px solid black;
            display: block;
            margin: 0 auto;
        }
        .menu{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 800px;
            margin:auto;
            margin-top:1rem;
            font-size: large;
        }
    </style>
</head>
<body>
    <div class="menu">
        <button id="restartbtn">Restart</button>
        <button id="pausebtn">Pause</button> <!-- Pause button added -->
        <div class="highscore"><span id="lowestJumpCount"></span></div>
    </div>
    
    <canvas id="gameCanvas" width="800" height="650"></canvas>

    <div class="menu">    
        <div class="currentjump"><span>Jumps: </span><span id="currentJumpCount"></span></div>
    </div>
    
    <script>
        let canvasElement = document.getElementById("gameCanvas");
        let ctx = canvasElement.getContext("2d");

        const constants = {
          PLAYER_WIDTH: 50,
          PLAYER_HEIGHT: 50,
          PLATFORM_WIDTH: 100,
          PLATFORM_HEIGHT: 20,
          GRAVITY: 1,
          JUMP_FORCE: 15,
          PLAYER_SPEED: 5,
        }

        const gamestate = {
          Player: {
            x: canvasElement.width / 2 - constants.PLAYER_WIDTH / 2,
            y: canvasElement.height - constants.PLAYER_HEIGHT,
            xSpeed: 0,
            ySpeed: 0,
            isJumping: false,
            isWinning: false
          },
          Platforms: [],
          ScoreKeeping: {
            lowestJumpCount: 1000,
            currentJumpCount: 0,
          }
        }

        function AddPlatform(xmod, ymod) {
          let platform = {
            x: 0 + xmod,
            y: canvasElement.height - constants.PLATFORM_HEIGHT + ymod,
            width: constants.PLATFORM_WIDTH,
            height: constants.PLATFORM_HEIGHT,
          }
          return platform;
        }

        gamestate.Platforms.push(AddPlatform(200, 0));
        gamestate.Platforms.push(AddPlatform(50, -50));
        gamestate.Platforms.push(AddPlatform(200, -200));
        gamestate.Platforms.push(AddPlatform(300, -350));
        gamestate.Platforms.push(AddPlatform(550, -200));
        gamestate.Platforms.push(AddPlatform(700, -300));
        gamestate.Platforms.push(AddPlatform(600, -460));
        gamestate.Platforms.push(AddPlatform(350, -550));
        gamestate.Platforms.push(AddPlatform(50, -500));

        let button = document.getElementById("restartbtn");

        button.addEventListener("click", resetGame);

        let pauseButton = document.getElementById("pausebtn");
        let isPaused = false;

        pauseButton.addEventListener("click", () => {
          if (isPaused) {
            isPaused = false;
            pauseButton.innerText = "Pause";
            requestAnimationFrame(update);
          } else {
            isPaused = true;
            pauseButton.innerText = "Resume";
          }
        });

        let lowestJumpCountElement = document.getElementById("lowestJumpCount");
        let currentJumpCountElement = document.getElementById("currentJumpCount");

        function resetGame() {
          button.blur();

          if (gamestate.Player.isWinning && gamestate.ScoreKeeping.currentJumpCount > 0 && gamestate.ScoreKeeping.currentJumpCount < gamestate.ScoreKeeping.lowestJumpCount) {
            gamestate.ScoreKeeping.lowestJumpCount = gamestate.ScoreKeeping.currentJumpCount;
          }
          gamestate.ScoreKeeping.currentJumpCount = 0;
          lowestJumpCountElement.innerText = "Highscore (fewest jumps to reach golden platform): " + gamestate.ScoreKeeping.lowestJumpCount;

          gamestate.Player.x = canvasElement.width / 2 - constants.PLAYER_WIDTH / 2;
          gamestate.Player.y = canvasElement.height - constants.PLAYER_HEIGHT;
          gamestate.Player.xSpeed = 0;
          gamestate.Player.ySpeed = 0;
          gamestate.Player.isJumping = false;
          gamestate.Player.isWinning = false;
        }

        function update() {
          if (isPaused) {
            return;
          }

          gamestate.Player.ySpeed += constants.GRAVITY;
          gamestate.Player.x += gamestate.Player.xSpeed;
          gamestate.Player.y += gamestate.Player.ySpeed;

          if (gamestate.Player.x < 0) {
            gamestate.Player.x = 0;
          }
          if (gamestate.Player.x + constants.PLAYER_WIDTH > canvasElement.width) {
            gamestate.Player.x = canvasElement.width - constants.PLAYER_WIDTH;
          }
          if (gamestate.Player.y + constants.PLAYER_HEIGHT > canvasElement.height) {
            gamestate.Player.y = canvasElement.height - constants.PLAYER_HEIGHT;
            gamestate.Player.isJumping = false;
            gamestate.Player.ySpeed = 0;
          }

          gamestate.Platforms.forEach((platform, index) => {
            if (
              gamestate.Player.x < platform.x + platform.width &&
              gamestate.Player.x + constants.PLAYER_WIDTH > platform.x &&
              gamestate.Player.y + constants.PLAYER_HEIGHT > platform.y &&
              gamestate.Player.y < platform.y + platform.height
            ) {
              gamestate.Player.isJumping = false;
              gamestate.Player.ySpeed = 1;

              if (index === gamestate.Platforms.length - 10) {
                gamestate.Player.isWinning = true;
                gamestate.Player.y = platform.y - constants.PLAYER_HEIGHT;
                setTimeout(() => {
                  resetGame();
                }, 1000);
              }
            }
          });

          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          ctx.fillStyle = "blue";
          ctx.fillRect(gamestate.Player.x, gamestate.Player.y, constants.PLAYER_WIDTH, constants.PLAYER_HEIGHT);

          ctx.fillStyle = "green";
          gamestate.Platforms.forEach((platform, index) => {
            if (index === gamestate.Platforms.length - 1) {
              ctx.fillStyle = "gold";
            }
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
          });

          currentJumpCountElement.innerText = gamestate.ScoreKeeping.currentJumpCount;
          requestAnimationFrame(update);
        }

        resetGame();
        update();
    </script>
</body>
</html>
