$(document).ready(function(){
	//Setting up the canvas
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	//Setting up the grid
	var gridNum = 20; //20 cells along one axis
	var gridSize = canvas.width/gridNum;

	var candy = {
		x: 0,
		y: 0,
		alive: false
	};

	var player = {
		alive: true,
		x: 7,
		y: 7,
		tail: 1,
		// Direction by convention
		// Right is 0
		// Left is 1
		// Up is 2
		// Down is 3
		// Stop is 5
		direction: 5
	};

	var snakeBody = [[7,7]]; // 2D array, array of arrays
	var keyPressed = null;
	var leftKey = 37, upKey = 38, rightKey = 39, downKey = 40;

	Array.prototype.insert = function(index, item){
		this.splice(index,0,item); // index is the number of part of snake that new cell is added (0=head), 0 is # of elements to be removed, item is the thing that's being inserted (x,y pos)

	}

	function update() {
		if (keyPressed) {
			// Move Right
			if(keyPressed == rightKey && player.direction != 1) player.direction = 0;
			// Move Left
			if(keyPressed == leftKey && player.direction != 0) player.direction = 1;
			// Move Up
			if(keyPressed == upKey && player.direction != 3) player.direction = 2;
			// Move Down
			if(keyPressed == downKey && player.direction != 2) player.direction = 3;
		}

		// Spawn the candy
		if(!candy.alive){
			candy.x = Math.floor(Math.random()*gridNum);
			candy.y = Math.floor(Math.random()*gridNum);
			// Check if the candy is colliding with the player
			do{
				collided = false;
				for (var i = 0; i < player.tail; i ++) {
					// Check if candy is colliding with snakeBody
					if(candy.x == snakeBody[i][0].x && candy.y == snakeBody[i][1].y){
						collided = true;
						// Find new spawn location for the candy
						candy.x = Math.floor(Math.random()*gridNum);
						candy.y = Math.floor(Math.random()*gridNum);
						break;
					}
					// If it's colliding
					// Change collided to be true
					// Spawn in a new location
				}
			} while(collided)
			// Candy is bac alive because location/ spawn location is ok
			candy.alive = true;
		}

		// Collision checking
		// A. If candy collides with player
		if(candy.x == player.x && player.y == candy.y){
			// Kills the candy
			candy.alive = false;
			// Add body length to the player
			player.tail ++;
		}
		}
		// B. If player collides with boundary
		if(player.x >= gridNum || player.y >= gridNum || player.y < 0 || player.x < 0){
			// Kills the player
			player.alive = false;
			// Game ends
			// Stop the game (stop it from updating)
			clearInterval(updates);
		}
		// C. If player collides with itself
		if(player.tail > 3){
			// Check if the player collides with itself
			for (var i = 0; i < player.tail; i ++) {
					// Check if candy is colliding with snakeBody
					if(player.x == snakeBody[i][0] && player.y == snakeBody[i][1]){
						collided = true;
						break;
						// If they collide kill player
						player.alive = false;
						// End game
						clearInterval(updates);
					}
		}

		// Update the player location (snakeBody)
		snakeBody.insert(0,[player.x, player.y]);
		while(snakeBody.length > player.tail + 1){
			snakeBody.pop();
		}

		// Move the player
		switch(player.direction){
			// Move right
			case 0:
				player.x +=1; break;
			// Move left
			case 1:
				player.x -=1; break;
			// Move up
			case 2:
				player.y -=1; break;
			// Move down
			case 3:
				player.y +=1; break;
		}

		if(player.x > 500 or player.y > 500){
			player.kill()
		}

		// Draw the player
		if(player.alive){
			draw();
		}
	}

	function draw(){
		// Clear the screen
		context.clearRect(0,0,canvas.width,canvas.height);
		// Draw the candy/ food
		context.fillStyle = "red";
		context.fillRect(gridSize*candy.x, gridSize*candy.y, gridSize, gridSize);
		// Draw the player
		context.fillStyle = "black";
		for (var i = 0; i < player.tail; i++) {
			context.fillRect(snakeBody[i][0]*gridSize, snakeBody[i][1]*gridSize, gridSize, gridSize);
		}
	}
	draw();
	update();
	var updates = setInterval(update, 100);

	$(window).on("keydown", function(event) {
		keyPressed = event.which;
	});
});