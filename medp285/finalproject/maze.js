/* Notes 
 * const in Javascript doesn't mean c++ const, it just mean a one time assignment. But the element in the variablec an be modified.
 * all objects(arguments and return values) are by passed by reference except for boolean and int.
 * 
 * Some part of my codes are from following this tutorial
 * https://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-1/
 * 
 * Author: Yi Zong Kuang
 */

/* Trivial functions */
// Returns a random number from 0 to max.
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

/* Class */
class chatBox {
	// Will be a circular array, tracking next indexing(also the start and end indexing). Will sacrafice one index to be noted as end of array.
	constructor() {
		this.logMaxLen = CHAT_LOG_LEN;
		this.chatLogHistory = new Array(this.logMaxLen);		//Stores string
		this.chatLogUser = new Array(this.logMaxlen);		// indices corresponds user to their chat log, ex. user[0] said chatlog[0] and so on. Store interger
		this.LogHistoryNextInputIndex = 0;		//"end index", next spot to be inputted.
		this.startIndex = 0;
	}

	addToLog(text, user_id) {	// @arg: string int
		this.chatLogHistory[this.LogHistoryNextInputIndex] = text;
		this.chatLogUser[this.LogHistoryNextInputIndex] = user_id;
		this.LogHistoryNextInputIndex = (this.LogHistoryNextInputIndex+1)%this.logMaxLen;
		if( (this.LogHistoryNextInputIndex)%(this.logMaxLen) == this.startIndex ) {
			this.startIndex = (this.startIndex+1)%this.logMaxLen;
		}

		var doc = document.getElementById('chatLog');
		doc.innerHTML += (text + "<br>");
		doc.scrollTop = doc.scrollHeight;
	}

	elementHistory() {
		var i;
		var log_hist = "";
		for( i = this.startIndex; i < this.LogHistoryNextInputIndex; ++i ) {	
			log_hist += "user id: ";
			log_hist += this.chatLogUser[ i%this.logMaxLen ];
			log_hist += " ->";
			log_hist += this.chatLogHistory[ i%this.logMaxLen ];
			log_hist += "<br>";
			console.log("index:"+(i%this.logMaxLen));
		}	

		return log_hist;
	}

	displayHistory() {
		var chatData = this.elementHistory();
		console.log(chatData);
		var doc = document.getElementById('chatHistory');
		doc.innerHTML = chatData;
		doc.scrollTop = doc.scrollHeight;

	}

	validText( event ) {	// Check if input is letter or 'backspace' (8) or 'enter' (13) or 'space' (32) and grammar points.
		if( (event >= 48 && event <= 90) || 
		event == 8 || 
		event == 13 || 
		event == 32 ||
		(event >= 186 && event <= 192) ||
		(event >= 219 && event <= 222) ) {
			return true;
		}

		return false;
	}
}

// Display is y is row and x is column, because x are dipslayed vertically in js for some reason.
class player {
	constructor(name, pos_x, pos_y) {	// @arg: string, int, int  
		this.id = PLAYER_ID;
		PLAYER_ID++;
		this.name = name;
		this.x = pos_x;
		this.y = pos_y;
		this.online = false;

		/* The following are used for 3d rendition */
		// The direction that the player is turning,
		// either -1 for left or 1 for right
		this.dir = 0;
		// The current angle of rotation
		this.rot = 0;
		// Is the player moving forward (speed = 1)
		// or backwards (speed = -1)
		this.speed = 0;
		// How far (in map units) does the player move each step/update
		this.moveSpeed = 0.18;
		// How mcuh does the player rotate each step/update (in radians)
		this.rotSpeed = 6 * Math.PI/180;
		/* End of */
	}

	/* The following are used for 3d rendition */
	// Move player with Rotation considered, and in a single direction.
	moveRot(inx, iny) {
		this.x = inx;
		this.y = iny;
	}
	/* End of */

	moveUp() {				// minus minus cuz 0,0 is at top left corner of the map. the Y increases going downward, while X increase going rightward.
		--this.y;
	}
	moveDown() {
		++this.y;
	}
	moveLeft() {
		--this.x;
	}
	moveRight() {
		++this.x;
	}
	login() {
		this.online = true;
	}
	logout() {
		this.online = false;
	}
	isOnline() {
		return this.online;
	}
	resetPos( posx, posy ) {	// @arg: int int
		this.x = posx;
		this.y = posy;
	}
}

// Display is trasverse y (y isthe first dimension of the array) first then x (x is the 2nd dimension of the array), because x are dipslayed vertically in js for some reason.
class maze_map {
	/* 
	 *  0 - empty space
	 *  1 - wall
	 *	2 - exit
	 */
	constructor() {
		this.width = MAP_DIMENSION_WIDTH;
		this.height = MAP_DIMENSION_HEIGHT;
		this.mapScale =   MAP_SCALE;
		this.map = new Array(this.height);
		this.wallVal = 1;
		this.emptySpaceVal = 0;
		this.exitVal = 2;
		this.exitx = this.width - 1;
		this.exity = this.height - 1;
		var i;
		for( i = 0; i < MAP_DIMENSION_HEIGHT; ++i ) {
			this.map[i] = new Array(this.width);
		}
		this.setPresetMap();
	}

	getExitX() {
		return this.exitx;
	}

	getExitY() {
		return this.exity;
	}

	// Pattern generated will be even rows are clear rows, odd rows are all wall except at one random locations.
	setPresetMap() {
		for( var x = 0; x < this.width; ++x ) {
			var gate = getRandomInt(MAP_DIMENSION_WIDTH); 
			for( var y = 0; y < this.height; ++y ) {

				if(x == this.exitx && y == this.exity) {
					this.map[y][x] = 2;
				} else if( x%2 == 0 ) {		// If even columns
					this.map[y][x] = 0;
				} else {
					if( y == gate ) {
						this.map[y][x] = 0;
					} else {
						this.map[y][x] = 1;
					}
				}

			}
		}
	}

	populateBlankMap() {
		for( var x = 0; x < this.width; ++x ) {
			for( var y = 0; y < this.height; ++y ) {
				if(x == this.exitx && y == this.exity) {
					this.map[y][x] = 2;
				} else {
				this.map[y][x] = 0;
				}
			}	
		}
	}

	elementMap() {
		var currentContent = "";

		var i;
		for( i = 0; i < this.width; ++i ) {
			var j;
			for( j = 0; j < this.height; ++j ) {
				if( this.map[i][j] == 0 ) {
					currentContent += "-";
				} else if( this.map[i][j] == 1 ) {
					currentContent += "*";
				} else {
					currentContent += "?";
				} 
			}
			currentContent += "<br>";
		}

		return currentContent;
	}

	elementMapWithPlayer(playerArr, playerCount) {	// @arg: both are mean to be cpp const and not be changed.
		var currentContent = "";

		var i;
		for( i = 0; i < this.width; ++i ) {
			var j;
			for( j = 0; j < this.height; ++j ) {
				var playerMark = false;
				var subi;
				for( subi = 0; subi < playerCount; ++subi ) {
					if( i == playerArr[subi].x && j == playerArr[subi].y ) {
						playerMark = true;
					}
				}

				if( playerMark == false ) {									// Checks all players list to see where on the map to mark "x"
					if( this.map[i][j] == 0 ) {
						currentContent += "-";
					} else if( this.map[i][j] == 1 ) {
						currentContent += "*";
					} else {
						currentContent += "?";
					} 
				} else {
					currentContent += "x";
				}
				
			}
			currentContent += "<br>"
		}
		console.log("display done.");
		return currentContent;
	}

	setMapElement(x, y, element) {	// @arg: int, int, int
		this.map[y][x] = element;
	}

	getWallVal() {
		return this.wallVal;
	}

	getEmptySpaceVal() {
		return this.emptySpaceVal;
	}

	getExitVal() {
		return this.exitVal;
	}

	getMapArr() {
		return this.map;
	}

	getMapScale() {
		return this.mapScale;
	}

	getWidth() {
		return this.height;
	}

	getHeight() {
		return this.width;
	}
}

class game {
	constructor() {
		this.maze = new maze_map();
		this.playerCount = 0;
		this.playerArr = new Array(MAX_PLAYER);
		this.chatBox = new chatBox();
		this.chatBuffer = "";
	}

	setPresetMap() {
		this.maze.setPresetMap();
	}

	setBlankMap() {
		this.maze.populateBlankMap();
	}

	getMapArr() {
		return this.maze.getMapArr();
	}

	getWidth() {
		return this.maze.width;
	}

	getHeight() {
		return this.maze.height;
	}

	getMapScale() {
		return this.maze.mapScale;
	}

	drawGameMap() {
		/* var visualData;
		console.log("Display game with player");
		visualData = this.maze.elementMapWithPlayer( this.playerArr, this.playerCount );
		document.getElementById('gameViewPort').innerHTML = visualData; */

		var $ = function(id) { return document.getElementById(id); };

		var map = $("map");
		var mapContainer = $("gameViewPort");
		var mapObjs = $("mapObjects");

		map.width = this.getWidth() * this.getMapScale();					// resize the internal canvas dimensions 
		map.height = this.getHeight() * this.getMapScale();
		mapObjs.width = map.width;
		mapObjs.height = map.height;

		var w = (this.getWidth() * this.getMapScale()) + "px";		// minimap CSS dimensions
		var h = (this.getHeight() * this.getMapScale()) + "px";
	
		map.style.width = mapObjs.style.width = mapContainer.style.width = w;
		map.style.height = mapObjs.style.height = mapContainer.style.height = h;
	
		var ctx = map.getContext("2d");

		ctx.fillStyle = "white";
		ctx.fillRect(0,0,map.width,map.height);

		var mapArr = this.getMapArr();

		for( var x = 0; x < this.getWidth(); ++x ) {
			for( var y = 0; y < this.getHeight(); ++y ) {

				var object_val = mapArr[y][x];

				if(object_val==2) {
					console.log(object_val);
				}
				
				if( object_val == 1 ) {

					ctx.fillStyle = "rgb(200,200,200)";
					ctx.fillRect(
						x * this.maze.getMapScale(),
						y * this.maze.getMapScale(),
						this.maze.getMapScale(),this.maze.getMapScale()
					);

				}

				if( object_val == 2 ) {

					ctx.fillStyle = "rgb(0,255,0)";
					ctx.fillRect(
						x * this.maze.getMapScale(),
						y * this.maze.getMapScale(),
						this.maze.getMapScale(), this.maze.getMapScale()
					);

				}
			}
		}

		this.updateGameMap();
		return;
	}

	updateGameMap() {

		var $ = function(id) { return document.getElementById(id); };

		var map = $("map");
		var mapObjs = $("mapObjects");

		var objCtx = mapObjs.getContext("2d");
		mapObjs.width = mapObjs.width;

		for( var i = 0; i < this.playerCount; ++i ) {
			console.log("UPDATE RAN drawn player");
			objCtx.fillStyle = "red";
			objCtx.fillRect(	// draw a dot at the current player position
				this.playerArr[i].x * this.getMapScale() + 4,
				this.playerArr[i].y * this.getMapScale() + 4,
				8, 8
			);
		}
		
		return;
	}

	addPlayer(player) {
		if( this.playerCount < this.playerArr.length ) {
			this.playerArr[this.playerCount] = player;
			++this.playerCount;
		} else {
			console.log("Max amount of players has been reached.");
		}
	}

	displayPlayer() {
		var currentContent = "";
		var i;

		for( i = 0; i < this.playerCount; ++i ) {
			if( this.playerArr[i].isOnline() ) {
				currentContent += ("(Online)" + i + ". " + this.playerArr[i].name + " with id: " + this.playerArr[i].id);
			} else {
				currentContent += ("(Offline)" + i + ". " + this.playerArr[i].name + " with id: " + this.playerArr[i].id);
			}
			currentContent += "<br>";
		}
		
		document.getElementById('playerList').innerHTML += currentContent;
	}

	validMove(event, x, y) {	// @arg: string, int, int
		var blank = this.maze.getEmptySpaceVal();
		var exit = this.maze.getExitVal();
		var new_x = x;
		var new_y = y;

		if( event == 38 ) {		// up
			--new_y;
		}
		if( event == 40 ) {		// down
			++new_y;
		}
		if( event == 37 ) {		// left
			--new_x;
		}
		if( event == 39 ) {		// right
			++new_x;
		}


		if( new_y < 0 || new_y > this.maze.height-1 || new_x < 0 || new_x > this.maze.width-1 ) {
			return false;
		}
		
		if( this.maze.map[new_y][new_x] == blank || this.maze.map[new_y][new_x] == exit ) {
			return true;
		}

		return false;
	}

	isBlocking(x,y) {
		if (y < 0 || y > this.maze.height-1 || x < 0 || x > this.maze.width-1)
			return true;

		if( this.maze.map[Math.floor(y)][Math.floor(x)] == blank || this.maze.map[Math.floor(y)][Math.floor(x)] == exit ) {
			return false;
		}

		return true;
	}

	/* The following are used for 3d rendition */
	// Move player with Rotation considered, and in a single direction.
	// Assumes move has been validize
	movePlayerRot(player) {
		// Player will move this far along the current direction vector
		var moveStep = player.speed * player.moveSpeed;
		// Add rotation if player is rotating (player.dir != 0)
		player.rot += player.dir * player.rotSpeed;
		// Calculate new player position with simple trigonomety
		var newX = player.x + Math.cos(player.rot) * moveStep;
		var newY = player.y + Math.sin(player.rot) * moveStep;
	
		if (this.isBlocking(newX, newY)) {	
			return;
		}

		// Set new pos
		player.moveRot(newX,newY);
	}

	// Game cycle with Rotation considered.
	gameCycleRot() {		// Also the main frame to handle keydown event handling, such as chat box and movement of game
		//wait for input
		$("html").keydown( function(event) {
			// Disable the default arrow scrolling 
			if( event.which==37 || event.which==38 || event.which==39 || event.which==40 ) {
				event.preventDefault();
			}

			/* console.log("keydown detected"); */
			GAME.keyDownEventHandlerRot(event.which);
			GAME.updateGameMap(); 
		} );
		$("html").keyup( function(event) {
			// Disable the default arrow scrolling 
			if( event.which==37 || event.which==38 || event.which==39 || event.which==40 ) {
				event.preventDefault();
			}

			/* console.log("keyup detected"); */
			GAME.keyUpEventHandlerRot(event.which);
			GAME.updateGameMap(); 
		} );

		$("input").keypress( function(e) {
			GAME.keyPressEventHandler(e.which);
			if( e.which == 13 ) {		// if input was 'entered', clear input field
				$(this).val('');
			}
		});

		document.getElementById("chatHistoryButton").addEventListener("click", function() {
			GAME.showChatHistory();
		});
	}

	/* keyDownEventHandler(event) {
		var player = this.whichPlayer();		// This is returned by reference by default of Javascript.

		if( event == 37 || event == 38 || event == 39 || event == 40 ) {		// player movement event
			console.log("keydown()")
	
			if( this.validMove( event, player.x, player.y ) ) {
				this.movePlayer(event, player);
				if( this.gameWon() ) {
					console.log("Game Won");
					this.promptPopup();
				}
			} else {
				console.log("Invalid Move");
			}
		} else {
			console.log("not sure what to say here");
		}

		return;
	} */

	// With Rotation considered.
	keyDownEventHandlerRot(ewhich) {
		var player = this.whichPlayer();

		// Which key was pressed?
		switch(ewhich) {
			// Up, move palyer forward, ie. increase speed
			case 38:
				player.speed = 1; 
				break;
			// Down, move player backward, set neg speed
			case 40:
				player.speed = -1; 
				break;
			// Left, rotate player left
			case 37:
				player.dir = -1; 
				break;
			// Right, rotate player right
			case 39:
				player.dir = 1;
				break;
		}

		this.movePlayerRot(player);
	}

	keyUpEventHandlerRot(ewhich) {
		var player = this.whichPlayer();

		// Which key was pressed?
		switch(ewhich) {
			case 38:
			case 40:
				player.speed = 0; 
				break;
			case 37:
			case 39:
				player.dir = 0; 
				break;
		}
	}
	/* End of */

	movePlayer(event, player) { // @arg string, player&
		//update player coor, no need to update map coor, since they are parsed separately
		if( event == 38 ) {		// up
			player.moveUp();
		}
		if( event == 40 ) {		// down
			player.moveDown();
		}
		if( event == 37 ) {		// left
			player.moveLeft();
		}
		if( event == 39 ) {		// right
			player.moveRight();
		}
		console.log("player move event");
	}

	/* Decider for which player is giving this script the inputs from client side. WILL IMPLEMENT IN FUTURE */
	whichPlayer() {		// for now returns the last player in the playerArr.
		if( this.playerCount == 0 ) {
			console.log("whichPlayer() player count is zero");
		}
		return this.playerArr[this.playerCount - 1];
	}

	/* Client side function, will implement it as such in the future, for now it's not */
	collectChat(event, player) {		// Will collect chat until 'enter' is hit and then will add to chat
		console.log("text event");
		if(event == 13) {		// if event is 'enter', which is value 13, will not take in the 'enter value'
			if( this.chatBuffer == "" ) {
				console.log("chatBuffer empty");
				return;
			}

			var d = new Date();	
			var complete_chat = "[" + d.toDateString() + ", " + d.getHours() + ":" + d.getMinutes() + ":" + d.getFullYear() + "] <strong>" + player.name + "</strong>:" + this.chatBuffer;
			this.chatBox.addToLog(complete_chat, player.id);
			this.chatBuffer = "";
			return;
		}
		if(event == 8) {			// if event is 'backspace', which is value 8, will not take into chatBuffer, will delete last char in textBuffer
			this.chatBuffer = this.chatBuffer.substr(0, str.length-1);
			return;
		}
		this.chatBuffer += String.fromCharCode(event);
	}

	gameWon() {
		var player = this.whichPlayer();

		if( player.x == this.maze.exitx && player.y == this.maze.exity ) {
			return true;
		}

		return false;
	}

	restart() {
		this.setPresetMap();
		for( var i = 0; i < this.playerCount; ++i ) {
			this.playerArr[i].resetPos( PLAYER_INI_X, PLAYER_INI_Y );
		}
		this.drawGameMap();
		return;
	}
	
	promptPopup() {
		var popup = document.getElementById("popup");
		var btnStay = document.getElementById("popupStay");
		var btnRestart = document.getElementById("popupRestart");
		
		// Turn on pop up
		popup.style.display = "block";

		btnStay.onclick = function() {
			popup.style.display = "none";
			return;
		}
		
		btnRestart.onclick = function() {
			GAME.restart();
			popup.style.display = "none";
			return;
		}
		return;
	}

	keyDownEventHandler(event) {
		var player = this.whichPlayer();		// This is returned by reference by default of Javascript.

		if( event == 37 || event == 38 || event == 39 || event == 40 ) {		// player movement event
			console.log("keydown()")
	
			if( this.validMove( event, player.x, player.y ) ) {
				this.movePlayer(event, player);
				if( this.gameWon() ) {
					console.log("Game Won");
					this.promptPopup();
				}
			} else {
				console.log("Invalid Move");
			}
		} else {
			console.log("not sure what to say here");
		}

		return;
	}

	keyPressEventHandler(event) {
		var player = this.whichPlayer();

		this.collectChat(event, player);
	}

	showChatHistory() {
		console.log("showHistoryLog()");
		this.chatBox.displayHistory();
	}

	gameCycle() {		// Also the main frame to handle keydown event handling, such as chat box and movement of game
		//wait for input
		$("html").keydown( function(event) {
			// Disable the default arrow scrolling 
			if( event.which==37 || event.which==38 || event.which==39 || event.which==40 ) {
				event.preventDefault();
			}

			console.log("keydown detected");
			GAME.keyDownEventHandler(event.which);
			GAME.updateGameMap(); 
		} );

		$("input").keypress( function(e) {
			GAME.keyPressEventHandler(e.which);
			if( e.which == 13 ) {		// if input was 'entered', clear input field
				$(this).val('');
			}
		});

		document.getElementById("chatHistoryButton").addEventListener("click", function() {
			GAME.showChatHistory();
		});
	}
	
}

/* Global variables */
var 	PLAYER_ID = 0;
const 	MAX_PLAYER = 10;
const 	PLAYER_INI_X = 0;
const 	PLAYER_INI_Y = 0;
const 	MAP_DIMENSION_WIDTH = 35;
const 	MAP_DIMENSION_HEIGHT = 40;
const	MAP_SCALE = 13;
const 	CHAT_LOG_LEN = 100;
const 	GAME = new game();
var 	GG = false;

/* Defining some global variables */

// For testing 3d.
//GAME.setBlankMap();

/* MAIN() */
$(document).ready(function() {
	console.log(GAME);
	var p = new player("shuze",PLAYER_INI_X,PLAYER_INI_Y);
	p.login();
	GAME.addPlayer(p);
	GAME.displayPlayer();
	GAME.drawGameMap(); 
	GAME.gameCycle();		// In a sense loops while waiting for user input
	//GAME.gameCycleRot();
});