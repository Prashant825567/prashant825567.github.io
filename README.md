!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="google-adsense-account" content="ca-pub-4683763693438850" />
  <title>Snake Game</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      text-align: center;
    }

    .game-canvas {
      width: 100%;
      height: 100vw;
      max-width: 500px;
      max-height: 500px;
      margin: 0 auto;
      display: block;
      background: #333;
    }

    .keys {
      padding: 10px;
    }

    .arr {
      cursor: pointer;
      width: 70px;
      height: 70px;
      text-align: center;
      line-height: 70px;
      background: gray;
      color: white;
      font-size: 30px;
      display: inline-block;
      margin: 5px;
      user-select: none;
      border-radius: 10px;
    }

    .arr:active {
      background: #555;
    }
  </style>
</head>
<body>

  <h2>Snake Game</h2>
  <canvas id="gc" class="game-canvas" width="400" height="400"></canvas>

  <div class="keys">
    <div>
      <div class="arr" onclick="Snake.action('up')">↑</div>
    </div>
    <div>
      <div class="arr" onclick="Snake.action('left')">←</div>
      <div class="arr" onclick="Snake.action('down')">↓</div>
      <div class="arr" onclick="Snake.action('right')">→</div>
    </div>
  </div>

  <script>
    const Snake = (function () {
      const tileCount = 20;
      const gridSize = 400 / tileCount;
      const canvas = document.getElementById("gc");
      const ctx = canvas.getContext("2d");

      let player = { x: 10, y: 10 };
      let velocity = { x: 0, y: 0 };
      let trail = [];
      let tail = 5;
      let fruit = { x: 5, y: 5 };
      let score = 0;

      function gameLoop() {
        player.x += velocity.x;
        player.y += velocity.y;

        if (player.x < 0) player.x = tileCount - 1;
        if (player.x >= tileCount) player.x = 0;
        if (player.y < 0) player.y = tileCount - 1;
        if (player.y >= tileCount) player.y = 0;

        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "lime";
        for (let i = 0; i < trail.length; i++) {
          ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
          if (trail[i].x === player.x && trail[i].y === player.y) {
            tail = 5;
            score = 0;
          }
        }

        trail.push({ x: player.x, y: player.y });
        while (trail.length > tail) {
          trail.shift();
        }

        if (player.x === fruit.x && player.y === fruit.y) {
          tail++;
          score++;
          fruit.x = Math.floor(Math.random() * tileCount);
          fruit.y = Math.floor(Math.random() * tileCount);
        }

        ctx.fillStyle = "red";
        ctx.fillRect(fruit.x * gridSize, fruit.y * gridSize, gridSize - 2, gridSize - 2);

        ctx.fillStyle = "white";
        ctx.font = "16px sans-serif";
        ctx.fillText("Score: " + score, 10, 20);
      }

      function keyPush(evt) {
        switch (evt.keyCode) {
          case 37:
            if (velocity.x !== 1) { velocity.x = -1; velocity.y = 0; }
            break;
          case 38:
            if (velocity.y !== 1) { velocity.x = 0; velocity.y = -1; }
            break;
          case 39:
            if (velocity.x !== -1) { velocity.x = 1; velocity.y = 0; }
            break;
          case 40:
            if (velocity.y !== -1) { velocity.x = 0; velocity.y = 1; }
            break;
        }
      }

      document.addEventListener("keydown", keyPush);
      setInterval(gameLoop, 1000 / 10);

      return {
        action: function (dir) {
          if (dir === "up" && velocity.y !== 1) {
            velocity.x = 0; velocity.y = -1;
          } else if (dir === "down" && velocity.y !== -1) {
            velocity.x = 0; velocity.y = 1;
          } else if (dir === "left" && velocity.x !== 1) {
            velocity.x = -1; velocity.y = 0;
          } else if (dir === "right" && velocity.x !== -1) {
            velocity.x = 1; velocity.y = 0;
          }
        }
      };
    })();
  </script>
</body>
</html>

