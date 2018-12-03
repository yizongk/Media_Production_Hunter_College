/* Notes 
 * const in Javascript doesn't mean c++ const, it just mean a one time assignment. But the element in the variablec an be modified.
 * all objects(arguments and return values) are by passed by reference except for boolean and int.
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
	}

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
}

// Display is trasverse y (y isthe first dimension of the array) first then x (x is the 2nd dimension of the array), because x are dipslayed vertically in js for some reason.
class maze_map {
	/* 
	 *  0 - empty space
	 *  1 - wall
	 */
	constructor() {
		this.width = MAP_DIMENSION;
		this.height = MAP_DIMENSION;
		this.mapScale =   MAP_SCALE;
		this.map = new Array(this.height);
		this.wallVal = 1;
		this.emptySpaceVal = 0;
		var i;
		for( i = 0; i < MAP_DIMENSION; ++i ) {
			this.map[i] = new Array(this.width);
		}
		this.populateMap();
	}

	// Pattern generated will be even rows are clear rows, odd rows are all wall except at one random locations.
	setPresetMap() {
		var x;
		for( x = 0; x < this.width; ++x ) {
			var y;
			var gate = getRandomInt(MAP_DIMENSION); 
			for( y = 0; y < this.height; ++y ) {
				if( x%2 == 0 ) {		// If even rows
					this.map[x][y] = 0;
				} else {
					if( y != gate ) {
						this.map[x][y] = 1;
					} else {
						this.map[x][y] = 0;
					}
				}
			}
		}
	}

	populateMap() {
		var i;
		for( i = 0; i < this.width; ++i ) {
			var j = 0;
			for( j = 0; j < this.height; ++j ) {
				this.map[i][j] = 1;
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
		this.map[x][y] = element;
	}

	getWallVal() {
		return this.wallVal;
	}

	getEmptySpaceVal() {
		return this.emptySpaceVal;
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

	getMapArr() {
		return this.maze.getMapArr();
	}

	getWidth() {
		return this.maze.height;
	}

	getHeight() {
		return this.maze.width;
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

		for( var y = 0; y < this.getHeight(); ++y ) {
			for( var x = 0; x < this.getWidth(); ++x ) {

				var wall = mapArr[y][x];

				if( wall > 0 ) {

					ctx.fillStyle = "rgb(200,200,200)";
					ctx.fillRect(
						x * this.maze.getMapScale(),
						y * this.maze.getMapScale(),
						this.maze.getMapScale(),this.maze.getMapScale()
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
			console.log("UPDATE RAN");
			objCtx.fillStyle = "black";
			objCtx.fillRect(	// draw a dot at the current player position
				this.playerArr[i].x * this.getMapScale() - 2,
				this.playerArr[i].y * this.getMapScale() - 2,
				4, 4
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


		if( new_y < 0 || new_y > this.maze.height || new_x < 0 || new_x > this.maze.width ) {
			return false;
		}
		
		if( this.maze.map[new_y][new_x] != blank ) {
			return false;
		}

		return true;
	}

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

	keyPressEventHandler(event) {
		var input;
		var player = this.whichPlayer();		// This is returned by reference by default of Javascript.
		if( event == 37 || event == 38 || event == 39 || event == 40 ) {		// player movement event
			console.log("keydown()")
	
			if( this.validMove( event, player.x, player.y ) ) {
				this.movePlayer(event, player);
			} else {
				console.log("Invalid Move");
			}
		} else if( this.chatBox.validText(event) ) {		// Text box event handling
			this.collectChat(event, player);
		} else {
			console.log("Non text event");
		}

		return;
	}

	showChatHistory() {
		console.log("showHistoryLog()");
		this.chatBox.displayHistory();
	}

	gameCycle() {		// Also the main frame to handle keypress event handling, such as chat box and movement of game
		//wait for input
		$("html").keydown( function(event) {
			console.log("keydown detected");
			GAME.keyPressEventHandler(event.which);
			GAME.updateGameMap(); 
		} );

		document.getElementById("chatHistoryButton").addEventListener("click", function() {
			GAME.showChatHistory();
		});
	}
	
}

/* Global variables */
var 	PLAYER_ID = 0;
const 	MAX_PLAYER = 10;
const 	MAP_DIMENSION = 35;
const	MAP_SCALE = 8;
const 	CHAT_LOG_LEN = 100;
const 	GAME = new game();
var 	GG = false;

/* Defining some global variables */
GAME.setPresetMap();

/* MAIN() */
$(document).ready(function() {
	console.log(GAME);
	var p = new player("shuze",0,0);
	p.login();
	GAME.addPlayer(p);
	GAME.displayPlayer();
	GAME.drawGameMap(); 
	GAME.gameCycle();		// In a sense loops while waiting for user input
});