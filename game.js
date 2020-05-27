// Code JavaScript
		var canvas = document.getElementById("myCanvas");	// Enregistrement de la référence de l'élément canvas
		var ctx = canvas.getContext("2d");
		
		const brickImg = new Image();
		brickImg.src = "img/brick.jpg";

		var level = 1;

		var x = canvas.width/2;
		var dx = 2.5;
		var y = canvas.height-30;
		var dy = -2.5;

		var ballRadius = 10;

		var paddleHeight = 10;
		var paddleWidth = 60;
		var paddleX = (canvas.width-paddleWidth) / 2;

		var rightPressed = false;
		var leftPressed = false;

		var brickRowCount = 3;
		var brickColumnCount = 5;
		var brickWidth = 75;
		var brickHeight = 20;
		var brickPadding = 10;
		var brickOffsetTop = 30;
		var brickOffsetLeft = 30;
		var bricks = [];
		for (var c = 0; c < brickColumnCount; c++) {
			bricks[c] = [];
			for (var r = 0; r < brickRowCount; r++) {
				bricks[c][r] = {x:0, y:0, status:1};	// Brique visible si status = 1
			};
		};

		var scoreTotal = 0;
		var scoreLevel = 0;

		var lives = 3;

		function drawScore() {
			ctx.font = "16px Arial bold";
			ctx.fillStyle = "gold";
			ctx.fillText("Score : "+scoreTotal, 8, 20);
		}

		function drawLevel() {
			ctx.font = "16px Arial bold";
			ctx.fillStyle = "gold";
			ctx.fillText("Level : "+level, canvas.width/2-25, 20);
		}

		function drawLives() {
			ctx.font = "16px Arial bold";
			ctx.fillStyle = "gold";
			ctx.fillText("Lives : "+lives, canvas.width-65, 20);
		}

		function drawBall() {
			ctx.beginPath();
			ctx.arc(x, y, ballRadius, 0, Math.PI*2);
			ctx.fillStyle = "gold";
			ctx.fill();
			ctx.closePath();
		}

		function drawPaddle() {
			ctx.beginPath();
			ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);	// Coordonnées G et H, largeur, hauteur
			ctx.fillStyle = "grey";
			ctx.fill();
			ctx.closePath();
		}

		function drawBricks() {
			for(var c=0; c < brickColumnCount; c++) {
				for(var r=0; r < brickRowCount; r++) {
					if (bricks[c][r].status == 1) {
						var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
						bricks[c][r].x = brickX;
						var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
						bricks[c][r].y = brickY;
						ctx.beginPath();
						ctx.rect(brickX, brickY, brickWidth, brickHeight);
						ctx.fillStyle = "firebrick";
						ctx.fill();
						/*var brickPattern = ctx.createPattern(brickImg, "repeat");
					    ctx.fillStyle = brickPattern;
					    ctx.fill();**/
						ctx.closePath();
					}
				}
			}
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawScore();
			drawLevel();
			drawLives();
			drawBall();
			drawPaddle();
			drawBricks();
			collisionDetection();

			//Limites de la balle
			if (x+dx > canvas.width-ballRadius || x+dx < ballRadius) {
				dx = -dx;
			}
			if (y+dy < ballRadius) {
				dy = -dy;
			} else if (y+dy > canvas.height-ballRadius) {
				if (x > paddleX && x < paddleX+paddleWidth) {
					dy = -dy;
				}
				else {
					lives--;
					if (!lives) {
						alert("GAME OVER");
						document.location.reload();
					}
					else {
						x = canvas.width/2;
						y = canvas.height-30;
						dx = -dx;
						dy = -dy;
						paddleX = (canvas.width-paddleWidth)/2;
					}
				}
			}

			// Limites et déplacements de la planche
			if (rightPressed) {
				paddleX += 5;
				if (paddleX+paddleWidth > canvas.width) {
					paddleX = canvas.width-paddleWidth;
				}
			}
			if (leftPressed) {
				paddleX -= 5;
				if (paddleX < 0) {
					paddleX = 0;
				}
			}

			x += dx;
			y += dy;

			requestAnimationFrame(draw);
		}

		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		document.addEventListener("mousemove", mouseMoveHandler, false);

		// ArrowRight et ArrowLeft fonctionnent pour la plupart des moteurs de recherche, sauf pour IE/Edge, d'où l'importance de Right et Left
		function keyDownHandler(event) {
			if (event.key == "Right" || event.key == "ArrowRight") {
				rightPressed = true;	// Flèche droite enfoncée
			}
			else if (event.key == "Left" || event.key == "ArrowLeft") {
				leftPressed = true;
			}
		}

		function keyUpHandler(e) {
		    if(e.key == "Right" || e.key == "ArrowRight") {
		        rightPressed = false;
		    }
		    else if(e.key == "Left" || e.key == "ArrowLeft") {
		        leftPressed = false;
		    }
		}

		function collisionDetection() {
			for (var c=0; c < brickColumnCount; c++) {
				for (var r=0; r<brickRowCount; r++) {
					var b = bricks[c][r];
					if (b.status == 1) {
						if (x > b.x   &&   x < b.x + brickWidth   && y > b.y   &&   y < b.y + brickHeight) {
							dy = -dy;
							b.status = 0;
							scoreTotal++;
							scoreLevel++;
							if (scoreLevel == brickRowCount*brickColumnCount) {
								scoreLevel = 0;
								level += 1;
								dx = 2,5 + level/2;
								dy = -2.5 - level/2;
								x = canvas.width/2;
								y = canvas.height-30;
								paddleX = (canvas.width-paddleWidth)/2;
								for (var c = 0; c < brickColumnCount; c++) {
									for (var r = 0; r < brickRowCount; r++) {
										bricks[c][r].status = 1;
									};
								};
							}
						}
					}
				}
			}
		}

		function mouseMoveHandler(event) {
		 	var relativeX = event.clientX - canvas.offsetLeft;
		 	if(relativeX > paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
				paddleX = relativeX - paddleWidth/2;
			}
		}

		draw();