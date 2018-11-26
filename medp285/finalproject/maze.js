/* global variables */
var MAP_DIMENSION = 10;

// create map to contain the maze
var MAP = new Array(MAP_DIMENSION);

/* defining global variables */
// creates a 2-dimentional array of size MAP_DIEMNSION
var i;
for( i = 0; i < MAP_DIMENSION; ++i ) {
	MAP[i] = new Array(MAP_DIMENSION);
}

// populates the MAP
for( i = 0; i < MAP_DIMENSION; ++i ) {
	var j = 0;
	for( j = 0; j < MAP_DIMENSION; ++j ) {
		MAP[i][j] = "x";
	}	
}

/* defining functions */
// MAY HAVE TO DO AS DIV IN HTML
function displayMap() {
	var i;
	for( i = 0; i < MAP_DIMENSION; ++i ) {
		var j;
		for( j = 0; j < MAP_DIMENSION; ++j ) {
			document.write( MAP[i][j] );
		}
		document.write("\n");
	}
}


/* Calling the functions */
console.log(MAP);
displayMap();