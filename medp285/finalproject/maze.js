/* Notes 
 * const in Javascript doesn't mean c++ const, it just mean a one time assignment. But the element in the variablec an be modified.
 * all objects(arguments and return values) are by passed by reference except for boolean and int.
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
		this.chatLogHistory = new Array(this.logMaxLen);
		this.LogHistoryNextInputIndex = 0;		//"end index", next spot to be inputted.
		this.startIndex = 0;
	}

	addToLog(text) {
		this.chatLogHistory[this.LogHistoryNextInputIndex] = text;
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
}

// Display is trasverse y first then x, because x are dipslayed vertically in js for some reason.
class maze_map {
	constructor() {
		this.dimensionX = MAP_DIMENSION;
		this.dimensionY = MAP_DIMENSION;
		this.map = new Array(this.dimensionX);
		var i;
		for( i = 0; i < MAP_DIMENSION; ++i ) {
			this.map[i] = new Array(this.dimensionY);
		}
		this.populate();
	}

	// Pattern generated will be even rows are clear rows, odd rows are all wall except at one random locations.
	setPresetMap() {
		var x;
		for( x = 0; x < this.dimensionY; ++x ) {
			var y;
			var gate = getRandomInt(MAP_DIMENSION); 
			for( y = 0; y < this.dimensionX; ++y ) {
				if( x%2 == 0 ) {		// If even rows
					this.map[x][y] = "-";
				} else {
					if( y != gate ) {
						this.map[x][y] = "*";
					} else {
						this.map[x][y] = "-";
					}
				}
			}
		}
	}

	populate() {
		var i;
		for( i = 0; i < this.dimensionY; ++i ) {
			var j = 0;
			for( j = 0; j < this.dimensionX; ++j ) {
				this.map[i][j] = "*";
			}	
		}
	}

	elementMap() {
		var currentContent = "";

		var i;
		for( i = 0; i < this.dimensionY; ++i ) {
			var j;
			for( j = 0; j < this.dimensionX; ++j ) {
				//document.write( this.map[i][j] );
				currentContent += this.map[i][j];
			}
			//document.write("<br>");
			currentContent += "<br>";
		}

		return currentContent;
	}

	elementMapWithPlayer(playerArr, playerCount) {	// @arg: both are mean to be cpp const and not be changed.
		// wipe html body content.
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
					//document.write( this.map[i][j] );
					currentContent += this.map[i][j];
				} else {
					//document.write("x");
					currentContent += "x";
				}
				
			}
			//document.write("<br>");
			currentContent += "<br>"
		}
		console.log("display done.");
		return currentContent;
	}

	setMapElement(x, y, element) {	// @arg: int, int, string
		this.map[x][y] = element;
	}
}

class game {
	constructor() {
		this.maze = new maze_map();
		this.playerCount = 0;
		this.playerArr = new Array(MAX_PLAYER);
		this.chatBox = new chatBox();
		this.textBuffer = "";
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

	addPlayer(name) {
		if( this.playerCount < this.playerArr.length ) {
			this.playerArr[this.playerCount] = new player(name,0,0);
			/* this.maze.setMapElement(this.playerArr[this.playerCount].posX, this.playerArr[this.playerCount].posY, "x" ); */
			++this.playerCount;
		} else {
			console.log("Max amount of players has been reached.");
		}
	}

	displayPlayer() {
		var currentContent = "";

		var i;
		//document.write("Players:");
		//document.write("<br>");
		currentContent += "Players:";
		currentContent += "<br>";

		for( i = 0; i < this.playerCount; ++i ) {
			//document.write( i + ". " + this.playerArr[i].name + " with id: " + this.playerArr[i].id );
			//document.write("<br>");
			currentContent += (i + ". " + this.playerArr[i].name + " with id: " + this.playerArr[i].id);
			currentContent += "<br>";
		}
		
		document.getElementById('playerList').innerHTML += currentContent;
	}

	validMove(direction, x, y) {	// @arg: string, int, int
		var wall = "*";
		var blank = "-";
		if(direction == "up") {
			//top lane
			if( x <= 0 ) {
				return false;
			}
			if( this.maze.map[x-1][y] != blank ) {
				return false;
			}
		}
		if(direction == "down") {
			//bot lane
			if( x >= (this.maze.dimensionX - 1) ) {
				return false;
			}
			if( this.maze.map[x+1][y] != blank ) {
				return false;
			}
		}
		if(direction == "left") {
			//left lane
			if( y <= 0 ) {
				return false;
			}
			if( this.maze.map[x][y-1] != blank ) {
				return false;
			}
		}
		if(direction == "right") {
			//right lane	
			if( y >= (this.maze.dimensionY - 1) ) {
				return false;
			}
			if( this.maze.map[x][y+1] != blank ) {
				return false;
			}
		}

		if( direction == "up" || direction == "down" || direction == "left" || direction == "right" ) {
			return true;
		}

		return false;
	}

	whichPlayer() {		// for now returns the last player in the playerArr.
		if( this.playerCount == 0 ) {
			console.log("whichPlayer() player count is zero");
		}
		return this.playerArr[this.playerCount - 1];
	}

	keyPressEventHandler(event) {
		var input;
		if( event == 37 || event == 38 || event == 39 || event == 40 ) {		// player movement event
			if(event == 38) {
				input = "up";
			}
			if(event == 40) {
				input = "down";
			}
			if(event == 37) {
				input = "left";
			}
			if(event == 39) {
				input = "right";
			}
			console.log("keydown()")
	
			var player = this.whichPlayer();		// This is returned by reference by default of Javascript.
			if( this.validMove( input, player.posX, player.posY ) ) {
				//update player coor, no need to update map coor, since they are parsed separately
				if( input == "up" ) {
					player.moveUp();
				}
				if( input == "down" ) {
					player.moveDown();
				}
				if( input == "left" ) {
					player.moveLeft();
				}
				if( input == "right" ) {
					player.moveRight();
				}
				console.log("player move event");
			} else {
				console.log("Invalid Move");
			}
		} else if( this.chatBox.validText(event) ) {		// Text box event handling
			console.log("text event");
			if(event == 13) {		// if event is 'enter', which is value 13, will not take in the 'enter value'
				this.chatBox.addToLog(this.textBuffer);
				this.textBuffer = "";
				return;
			}
			if(event == 8) {			// if event is 'backspace', which is value 8, will not take into textBuffer, will delete last char in textBuffer
				this.textBuffer = this.textBuffer.substr(0, str.length-1);
				return;
			}
			this.textBuffer += String.fromCharCode(event);
		} else {
			console.log("Non text event");
		}

		return;
	}

	showChatHistory() {
		this.chatBox.displayHistory();
	}

	interface() {		// Also the main frame to handle keypress event handling, such as chat box and movement of game
		//wait for input
		$("html").keydown( function(event) {
			console.log("keydown detected");
			GAME.keyPressEventHandler(event.which);
			GAME.displayGame(); 
		} );

		document.getElementById("chatHistoryButton").onclick = function() {		// So far this will keep updated after being clicked once. NEED TO FIX THIS SO ONLY HAPPEN WHEN IT CLICKS< FOR PERFORFMANCE 
			GAME.showChatHistory(); 
		}
	}
	
}

/* Global variables */
var PLAYER_ID = 0;
const MAX_PLAYER = 10;
const MAP_DIMENSION = 10;
const CHAT_LOG_LEN = 100;
const GAME = new game();
var GG = false;

/* Defining some global variables */
GAME.setPresetMap();

/* MAIN() */
/* while(!GG) { */    //Why is this not working?
$(document).ready(function() {
	console.log(GAME);
	GAME.addPlayer("shuze");
	GAME.displayPlayer();
	GAME.displayGame(); 
	GAME.interface();		// In a sense loops while waiting for user input
});
/* } */