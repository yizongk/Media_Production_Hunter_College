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
		document.getElementById('chatLog').innerHTML += (text + "<br>");
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
		document.getElementById('chatHistory').innerHTML = chatData;
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
	constructor(name, x, y) {	// @arg: string, int, int  
		this.id = PLAYER_ID;
		PLAYER_ID++;
		this.name = name;
		this.posX = x;
		this.posY = y;
		this.online = false;
	}

	moveUp() {				// minus minus cuz 0,0 is at top left corner of the map. the Y increases going downward, while X increase going rightward.
		--this.posX;
	}
	moveDown() {
		++this.posX;
	}
	moveLeft() {
		--this.posY;
	}
	moveRight() {
		++this.posY;
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

// Display is trasverse y first then x, because x are dipslayed vertically in js for some reason.
class maze_map {
	/* 
	 *  0 - empty space
	 *  1 - wall
	 */
	constructor() {
		this.dimensionX = MAP_DIMENSION;
		this.dimensionY = MAP_DIMENSION;
		this.map = new Array(this.dimensionX);
		this.wallVal = 1;
		this.emptySpaceVal = 0;
		var i;
		for( i = 0; i < MAP_DIMENSION; ++i ) {
			this.map[i] = new Array(this.dimensionY);
		}
		this.populateMap();
	}

	// Pattern generated will be even rows are clear rows, odd rows are all wall except at one random locations.
	setPresetMap() {
		var x;
		for( x = 0; x < this.dimensionY; ++x ) {
			var y;
			var gate = getRandomInt(MAP_DIMENSION); 
			for( y = 0; y < this.dimensionX; ++y ) {
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
		for( i = 0; i < this.dimensionY; ++i ) {
			var j = 0;
			for( j = 0; j < this.dimensionX; ++j ) {
				this.map[i][j] = 1;
			}	
		}
	}

	elementMap() {
		var currentContent = "";

		var i;
		for( i = 0; i < this.dimensionY; ++i ) {
			var j;
			for( j = 0; j < this.dimensionX; ++j ) {
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
		for( i = 0; i < this.dimensionY; ++i ) {
			var j;
			for( j = 0; j < this.dimensionX; ++j ) {
				var playerMark = false;
				var subi;
				for( subi = 0; subi < playerCount; ++subi ) {
					if( i == playerArr[subi].posX && j == playerArr[subi].posY ) {
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

	displayMap() {
		this.maze.displayMap();
	}

	displayGame() {
		var visualData;
		console.log("Display game with player");
		visualData = this.maze.elementMapWithPlayer( this.playerArr, this.playerCount );
		document.getElementById('gameViewPort').innerHTML = visualData;
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
		var wall = this.maze.getWallVal();
		var blank = this.maze.getEmptySpaceVal();

		if(event == 38) {	// up
			//top lane
			if( x <= 0 ) {
				return false;
			}
			if( this.maze.map[x-1][y] != blank ) {
				return false;
			}
		}
		if(event == 40) {	// down
			//bot lane
			if( x >= (this.maze.dimensionX - 1) ) {
				return false;
			}
			if( this.maze.map[x+1][y] != blank ) {
				return false;
			}
		}
		if(event == 37) {	// left
			//left lane
			if( y <= 0 ) {
				return false;
			}
			if( this.maze.map[x][y-1] != blank ) {
				return false;
			}
		}
		if(event == 39) { 	// right
			//right lane	
			if( y >= (this.maze.dimensionY - 1) ) {
				return false;
			}
			if( this.maze.map[x][y+1] != blank ) {
				return false;
			}
		}

		if( event == 38 || event == 40 || event == 37 || event == 39 ) {
			return true;
		}

		return false;
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
	
			if( this.validMove( event, player.posX, player.posY ) ) {
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

	interface() {		// Also the main frame to handle keypress event handling, such as chat box and movement of game
		//wait for input
		$("html").keydown( function(event) {
			console.log("keydown detected");
			GAME.keyPressEventHandler(event.which);
			GAME.displayGame(); 
		} );

		document.getElementById("chatHistoryButton").addEventListener("click", function() {
			GAME.showChatHistory();
		});
	}
	
}

/* Global variables */
var 	PLAYER_ID = 0;
const 	MAX_PLAYER = 10;
const 	MAP_DIMENSION = 10;
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
	GAME.displayGame(); 
	GAME.interface();		// In a sense loops while waiting for user input
});