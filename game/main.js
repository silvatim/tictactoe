
var Game = {
  board:[ ["O","O","O"],
          ["O","X","X"],
          ["X","X","X"] ],

  threeInRow: function(row) {
    if ( row.every( (val, i, arr) => val == arr[0] ) ) {
      console.log("You have a match");
    }
  },
  checkRows: function(){
    var board = this.board;
    var numRows = board.length;
    for (var i = 0; i < numRows; i++) {
      console.log(board[i]);
      this.threeInRow(board[i]);
      }
  },
  checkColumns: function(){
    var board = this.board;
    var numCols = board[0].length;
    for (var i = 0; i < numCols; i++) {
      var col = [];
      for (var j = 0; j < numCols; j++) {
        col.push(board[j][i]);
      }
      console.log(col);
      this.threeInRow(col);
      }
  },
  checkDiagonals: function(){
    var board = this.board;
    var numCols = board[0].length;
    var countBack = numCols;
    var line1 = [];
    var line2 = [];
    for (var i = 0; i < numCols; i++) {
         line1.push(board[i][i]);
         line2.push(board[i][countBack -= 1]);
    }
    console.log(line1);
    this.threeInRow(line1);
    console.log(line2);
    this.threeInRow(line2);
  },

  play: function(){
    this.checkRows();
    this.checkColumns();
    this.checkDiagonals();
  }
};

Game.play();
