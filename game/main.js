var Game = {
  board:[],                                       //empty board array
  player1:"0",
  player2:"X",
  currentPlayer:"",
  numRows:3,                                      //board presets for number of rows and columns
  numColumns:3,
  squaresClicked: 0,                              //counts turns to reset board when all squares flipped

 createBoard : function(){                        //dynamically creates each square and adds to game div
    var board = $('.board');
    var row = [];
    var sqCounter = 0;                              //counter for adding data to css and splitting array
    this.currentPlayer = this.player1;               //setting current player to 1

    console.log("CreateBoard", this.currentPlayer);
    for ( var i = 0; i < this.numRows; i++ ){        //looping through rows
      for ( var j = 0; j < this.numColumns; j++ ) {  //looping for columns
        var squareElement = $("<div></div>");
        squareElement.attr( "data-row" , i );         //adding line position to data-row
        squareElement.addClass( "square square" + sqCounter );
        squareElement.on( "click" , this.takeTurn );   //adding event listener to square element
        board.append( squareElement );
        squareElement.attr( "data-column", j );        //adding column position to data-column
        sqCounter++;
        row.push(sqCounter);                          //pushing all 'squares' to array row after counter so starts from 1
        }                                             // ! Winning is based on matching squares and player1 === 0 .
        this.board.push( row.splice( 0 , this.numRows ) ); //spliting array row into multiple arrays and pushing to board array
      }
  },

  takeTurn: function(){
 console.log("takeTurn", Game.currentPlayer);
     var square = $(this);
     var row = square.attr("data-row");                  //setting row indices
     var column = square.attr("data-column");            //setting column indices
     square.off( "click" , Game.takeTurn );              //removes event listener after clicked
     Game.squaresClicked++;                              //adding to turn counter after each turn
     square.css( { "background":"url("+Game.currentPlayer+".png)", "background-size":"cover" } );
     Game.board[ row ][ column ] = Game.currentPlayer;
     Game.checkWin();
    // Game.switchPlayer();
  },

  switchPlayer: function(){
 console.log("switchPlayer start", this.currentPlayer);

     if ( Game.currentPlayer === Game.player1 ){         //switching players after each turn
        Game.currentPlayer = Game.player2;         //returns winning player for output
     }else{
       Game.currentPlayer = Game.player1;
     }
 console.log("switchPlayer end", this.currentPlayer);

  },

  resetBoard: function(){                                //resets board and game play
  console.log("resetBoard", this.currentPlayer);
    var gameBoard = $('.board')                          //gets all board div
    var heading = $('h1');
    var numSquares = ( this.numRows * this.numColumns );
    var allSquares = $('.square');
    heading.text("Tic Tac Toe");
    gameBoard.css( { "background":"white" } );
    for ( var i = 0; i < numSquares; i++ ){
        allSquares.eq(i).css( { "background":"white" } ); //clearing background
        allSquares.eq(i).on( "click" , this.takeTurn );      //re-enables event listener
    }
    this.squaresClicked = 0;                             //resetting square counter
    this.currentPlayer = this.player1;                   //defaulting back to player1
    this.board = [];                                   //resets board array
    gameBoard.children().remove();                     //removes square divs from board div
    this.createBoard();                                //creates new board div
  },

  checkForReset: function(){
    var picRef = "losers";
     if (Game.squaresClicked >= (Game.numRows * Game.numColumns)){  //checks if all squares flipped and resets board
        Game.displayOutcome( "You're both...", picRef );  //displays to screen
        setTimeout(function(){ Game.resetBoard(); }, 3000);
     }
  },

 threeInRow: function(row) {
  console.log("threeInRow", this.currentPlayer);
  var picRef = this.currentPlayer;
  if ( row.every( (val, i, arr) => val == arr[0] ) ) {  //checks all elements in array are equal
        Game.displayOutcome( "Winner is...", picRef ); //displays to screen
        setTimeout(function(){ Game.resetBoard(); }, 3000);
   }else{
    this.checkForReset();
   }
 },

 displayOutcome: function(message, imgRef){
 console.log("displayOutcome", this.currentPlayer);
    var boardElement = $('.board');                          //gets all board div
    var heading = $('h1');
    boardElement.children().remove();                     //removes square divs from board div
    boardElement.css( { "background":"url("+imgRef+".png)", "background-size":"100%",
    "background-repeat":"no-repeat" } );
    heading.text(message);
 },

  checkRows: function(){                           //checks if rows in array have three matches
    var board = this.board;
    var numRows = board.length;

    for ( var i = 0; i < numRows; i++ ) {
      this.threeInRow( board[i] );                 //check if all items in row array match
    }
  },

  checkColumns: function(){                        //checks if columns match going down through the different row indices,
    var board = this.board;                        // but with the same column indices
    var numberCols = board[0].length;
    var numberRows = board.length;

    for ( var i = 0; i < numberCols; i++ ) {           //looping through columns
      var col = [];
      for ( var j = 0; j < numberRows; j++ ) {         //looping through rows
        col.push( board[j][i] );                    //pushing output to col array
      }
      this.threeInRow(col);                  //checking if all items in col array all match
    }
  },

  checkDiagonals: function(){                       //checks board diagonally for matches
    var board = this.board;
    var numCols = board[0].length;
    var countBack = numCols;                         //count back - counts backwards to get the right indices for diagonal going up
    var line1 = [];                                  //line1, line2 variables - one for diagonal down and one for diagonal up
    var line2 = [];
    for (var i = 0; i < numCols; i++) {
         line1.push( board[i][i] );                   //incrementing diagonal down "\"
         line2.push( board[i][ countBack -= 1 ] );    //incrementing diagonal up "/"
    }
    this.threeInRow(line1);
    this.threeInRow(line2);
  },

  checkWin:function(){
    console.log("checkWin ", this.currentPlayer);
    this.checkRows();
    this.checkColumns();
    this.checkDiagonals();
    this.switchPlayer();
  }

};

Game.createBoard();
