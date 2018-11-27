/* Notes 
 * const in Javascript doesn't mean c++ const, it just mean a one time assignment. But the element in the variablec an be modified.
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
		this.map = new Array(MAP_DIMENSION);
		var i;
		for( i = 0; i < MAP_DIMENSION; ++i ) {
			this.map[i] = new Array(MAP_DIMENSION);
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

	addPlayer(name) {
		if( this.playerCount < this.playerArr.length ) {
			this.playerArr[this.playerCount] = new player(name,0,0);
			this.map.setMapElement(this.playerArr[this.playerCount].posX, this.playerArr[this.playerCount].posY, "x" );
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
	GAME.displayMap();
	
/* } */