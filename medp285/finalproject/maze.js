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
class player {
	constructor(name, x, y) {	// @arg: string, int, int  
		this.id = PLAYER_ID;
		PLAYER_ID++;
		this.name = name;
		this.posX = x;
		this.posY = y;
	}

	moveUp() {
		++this.posY;
	}
	moveDown() {
		--this.posY;
	}
	moveLeft() {
		--this.posX;
	}
	moveRight() {
		++this.posX;
	}
}

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
		for( x = 0; x < MAP_DIMENSION; ++x ) {
			var y;
			var gate = getRandomInt(MAP_DIMENSION); 
			for( y = 0; y < MAP_DIMENSION; ++y ) {
				if( x%2 == 0 ) {		// If even rows
					this.map[x][y] = "*";
				} else {
					if( y != gate ) {
						this.map[x][y] = "-";
					} else {
						this.map[x][y] = "*";
					}
				}
			}
		}
	}

	populate() {
		var i;
		for( i = 0; i < MAP_DIMENSION; ++i ) {
			var j = 0;
			for( j = 0; j < MAP_DIMENSION; ++j ) {
				this.map[i][j] = "*";
			}	
		}
	}

	displayMap() {
		var i;
		for( i = 0; i < MAP_DIMENSION; ++i ) {
			var j;
			for( j = 0; j < MAP_DIMENSION; ++j ) {
				document.write( this.map[i][j] );
			}
			document.write("<br>");
		}
	}

	displayMapWithPlayer(playerArr, playerCount) {	// @arg: both are mean to be cpp const and not be changed.
		var i;
		for( i = 0; i < MAP_DIMENSION; ++i ) {
			var j;
			for( j = 0; j < MAP_DIMENSION; ++j ) {
				var playerMark = false;
				var subi;
				for( subi = 0; subi < playerCount; ++subi ) {
					if( i == playerArr[subi].posX && j == playerArr[subi].posY ) {
						playerMark = true;
					}
				}

				if( playerMark == false ) {									// Checks all players list to see where on the map to mark "x"
					document.write( this.map[i][j] );
				} else {
					document.write("x");
				}
				
			}
			document.write("<br>");
		}
	}

	setMapElement(x, y, element) {	// @arg: int, int, string
		this.map[x][y] = element;
	}
}

class game {
	constructor() {
		this.map = new maze_map();
		this.playerCount = 0;
		this.playerArr = new Array(MAX_PLAYER);
	}

	setPresetMap() {
		this.map.setPresetMap();
	}

	displayMap() {
		this.map.displayMap();
	}

	displayGame() {
		this.map.displayMapWithPlayer( this.playerArr, this.playerCount );
	}

	addPlayer(name) {
		if( this.playerCount < this.playerArr.length ) {
			this.playerArr[this.playerCount] = new player(name,0,0);
			/* this.map.setMapElement(this.playerArr[this.playerCount].posX, this.playerArr[this.playerCount].posY, "x" ); */
			++this.playerCount;
		} else {
			console.log("Max amount of players has been reached.");
		}
	}

	displayPlayer() {
		var i;
		document.write("Players:");
		document.write("<br>");
		for( i = 0; i < this.playerCount; ++i ) {
			document.write( i + ". " + this.playerArr[i].name + " with id: " + this.playerArr[i].id );
			document.write("<br>");
		}
	}

	validMove(direction, x, y) {	// @arg: string, int, int
		if(direction == "up") {
			//top lane
			if( x <= 0 ) {
				return false;
			}
			if( this.map[x-1][y] != "*" ) {
				return false;
			}
		}
		if(direction == "down") {
			//bot lane
			if( x >= (this.map.dimensionX - 1) ) {
				return false;
			}
			if( this.map[x+1][y] != "*" ) {
				return false;
			}
		}
		if(direction == "left") {
			//left lane
			if( y <= 0 ) {
				return false;
			}
			if( this.map[x][y-1] != "*" ) {
				return false;
			}
		}
		if(direction == "right") {
			//right lane	
			if( y >= (this.map.dimensionY - 1) ) {
				return false;
			}
			if( this.map[x][y+1] != "*" ) {
				return false;
			}
		}

		if( direction == "up" || direction == "down" || direction == "left" || direction == "right" ) {
			return true;
		}

		return false;
	}

	whichPlayer() {		// for now returns the last player in the playerArr.
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
		} else {		// Text box event handling
			console.log("text event");
		}
	}

	getMove() {		
		//wait for input
		$("html").keydown( function(event) {
			GAME.keyPressEventHandler(event.which);
		} );


	}
}

/* Global variables */
var PLAYER_ID = 0;
const MAX_PLAYER = 10;
const MAP_DIMENSION = 10;
const GAME = new game();
var GG = false;

/* Defining some global variables */
GAME.setPresetMap();

/* MAIN() */
/* while(!GG) { */    //Why is this not working?
	console.log(GAME);
	GAME.addPlayer("shuze");
	GAME.displayPlayer();
	GAME.getMove();
	GAME.displayGame(); 
	
/* } */