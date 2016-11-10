
var Game = {
  board:[],                                       //empty board array
  player1:"0",
  player2:"X",
  currentPlayer:"",
  numRows:3,                                      //board presets for number of rows and columns
  numColumns:3,
  squaresClicked: 0,                              //counts turns to reset board when all squares flipped
  boardSpeed: 0.6,

 createBoard : function(){                        //dynamically creates each square and adds to game div
    var board = $('.board');
    var row = [];
    var sqCounter = 0;                              //counter for adding data to css and splitting array
    var goButton = $('.go');
    var slowButton = $('.slow');
    var fastButton = $('.fast');
    var message = $('.message');
    message.text("Player 1");
    goButton.off('click', this.animateBoard );
    goButton.on('click', this.animateBoard );
    slowButton.on('click', this.slowBoard() );
    fastButton.on('click', this.speedUpBoard() );
    this.currentPlayer = this.player1;               //setting current player to 1

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
     var square = $(this);
     var row = square.attr("data-row");                  //setting row indices
     var column = square.attr("data-column");            //setting column indices
     square.off( "click" , Game.takeTurn );              //removes event listener after clicked
     Game.squaresClicked++;                              //adding to turn counter after each turn
     square.css( { "background":"url("+Game.currentPlayer+".png)", "background-size":"cover" } );
     Game.board[ row ][ column ] = Game.currentPlayer;
     Game.checkWin();
  },

  switchPlayer: function(){
    var display = $('.message');
     if ( Game.currentPlayer === Game.player1 ){         //switching players after each turn
       display.text("Player 2");
       Game.currentPlayer = Game.player2;         //returns winning player for output
     }else{
       display.text("Player 1");
       Game.currentPlayer = Game.player1;
     }
  },

  resetBoard: function(){                                //resets board and game play
    var board = $('.board')                          //gets all board div
    var numSquares = ( this.numRows * this.numColumns );
    var allSquares = $('.square');
    board.css( { "background":"white" } );
    for ( var i = 0; i < numSquares; i++ ){
        allSquares.eq(i).css( { "background":"white" } ); //clearing background
        allSquares.eq(i).on( "click" , this.takeTurn );      //re-enables event listener
    }
    this.squaresClicked = 0;                             //resetting square counter
    this.boardSpeed = 0.6;
    this.currentPlayer = this.player1;                   //defaulting back to player1
    this.board = [];                                   //resets board array
    board.children().remove();                     //removes square divs from board div
    this.createBoard();                                //creates new board div

  },

  checkForReset: function(){
    var picRef = "losers";
     if (Game.squaresClicked >= (Game.numRows * Game.numColumns)){  //checks if all squares flipped and resets board
        Game.displayOutcome("You're both....", picRef);     //displays to screen
        setTimeout(function(){ Game.resetBoard(); }, 3000);
        return true;
     }else{
       return false;
     }
  },

  displayOutcome: function(message, imgRef){
    var board = $('.board');                          //gets all board div
    var displayMessage = $('.message');
    Game.stopAnimation();
    board.children().remove();                     //removes square divs from board div
    board.css( { "background":"url("+imgRef+".png)", "background-size":"100%",
    "background-repeat":"no-repeat" } );
    displayMessage.text(message);
 },

 threeInRow: function(row) {
  var picRef = this.currentPlayer;
  var board = $('.board');
  if ( row.every( (val, i, arr) => val == arr[0] ) ) {     //checks all elements in array are equal
    Game.displayOutcome( "Winner is...", picRef );         //displays to screen
    setTimeout(function(){ Game.resetBoard(); }, 3000);
    return true;
   }else{
    return this.checkForReset();
   }
 },

 checkRows: function(){                           //checks if rows in array have three matches
    var board = this.board;
    var numRows = board.length;

    for ( var i = 0; i < numRows; i++ ) {
      if ( this.threeInRow( board[i] ) ) {
        return true;
      }                 //check if all items in row array match
    }
  return false;
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
      if ( this.threeInRow(col) ){                   // checking if all items in col array all match
        return true;
      }
    }
    return false;
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
    if ( this.threeInRow(line1) || this.threeInRow(line2) ){
       return true;
    }
    return false;
  },

 checkWin:function(){
    if ( this.checkRows() === false ){
      if ( this.checkColumns() === false ){
        if ( this.checkDiagonals() === false ){
           Game.switchPlayer();
         }
      }
   }
},

  manageSpeed: function(speed){  //managing event handles not an easy task when they can accumulate
   Game.boardSpeed = speed;       //speeds up or slows down movement depending on user buttons
   var slowButton = $('.slow');
   var fastButton = $('.fast');
   slowButton.off( 'click', Game.slowBoard );
   fastButton.off( 'click', Game.fastBoard );

   if ( Game.boardSpeed >= 1.6 ){
      slowButton.on( 'click', Game.slowBoard );
    }else if ( Game.boardSpeed < 1.6 && Game.boardSpeed > 0.3 ) {
      fastButton.on( 'click', Game.speedUpBoard );
      slowButton.on( 'click', Game.slowBoard );
    }else if ( Game.boardSpeed <= 0.3 ) {
      fastButton.on( 'click', Game.speedUpBoard );
    }
 },

  speedUpBoard: function(){
   var newSpeed = parseFloat(Game.boardSpeed + 0.2);
   Game.manageSpeed(newSpeed);
  },

  slowBoard: function(){
   var newSpeed = parseFloat(Game.boardSpeed - 0.2);
   Game.manageSpeed(newSpeed);
  },

 stopAnimation: function(){                    //stops board spinning and repositions to center
  var board = $('.board');
    board.stop();
    board.removeClass('rotate');
    board.css( {'top':'160px', 'left':'30%'} );
 },

  animateBoard: function(){                    //animates board
    var board = $('.board');
    var newPosition = Game.makeNewPosition();
    var oldPosition = board.offset();
    var speed = Game.calcSpeed([oldPosition.top, oldPosition.left], newPosition);

    board.animate({ top: newPosition[0], left: newPosition[1] }, speed, function(){
    board.addClass('rotate');
    Game.animateBoard();
    });
  },

  makeNewPosition: function(){                   //calculates a random position for animation
    var h = $(window).height() - 400;
    var w = $(window).width() - 150;
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);

    return [nh,nw];
 },

  calcSpeed: function(prev, next) {                     //calculates speed of movement
   var x = Math.abs(prev[1] - next[1]);
   var y = Math.abs(prev[0] - next[0]);
   var greatest = x > y ? x : y;
   var speedModifier = this.boardSpeed;
   var speed = Math.ceil(greatest/speedModifier);
   return speed;
 }

};

Game.createBoard();



