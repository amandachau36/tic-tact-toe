console.log('JS is working!')

const tic = {
  boxNumber: [],
  lastPlayed: 'O',
  // if last value was X than next value will be O, vice versa
  nextPlay: function(){
    if (this.lastPlayed === 'X'){
      return 'O';
    } else {
      return 'X';
    }
  },
  numCols: 3, // number of columns and rows
  createBoxNumber: function(){

    this.boxNumber = [];

    for (let i = 0; i < this.numCols**2; i++) {
      this.boxNumber.push(i);
    }
  },
  oScore: 0,
  xScore: 0,
  isMatch: function(line){
    // Checks if every item in the arrays below are ALL the same
    if (line.every(x => x === 'X') || line.every(x => x === 'O')) {
      return true;
    }
    // return line.every(x => x === player); //|| line.every(x => x === 'O');

  },
  win: function(){
    // this creates arrays for each possible winning line (rows,
    // columns, diagonals x 2)
    // Then the isMatch() is used to determine if all values within each
    // array are the SAME
    // If SAME then this function evaluates to true

    let x = this.numCols;

    let diagonal1 = [];
    for ( let j = 0; j < this.boxNumber.length; j+=(x+1) ) {
      diagonal1.push(this.boxNumber[j]);
    };

    if( this.isMatch(diagonal1) ){
      return true;
    };   // end of diagonal1


    let diagonal2 = [];

    for ( let j = (x-1); j < this.boxNumber.length-1; j+=(x-1) ) {
      diagonal2.push(this.boxNumber[j]);
    };

    if( this.isMatch(diagonal2) ){
      return true;
    }; // end of diagonal2


    let cols = [];

    for(let j = 0; j < x; j++){
    // creates an array within cols (i.e. cols will be an array of arrays)
      cols[j] = [];
      for ( let i = j; i < this.boxNumber.length; i+=x ) {
        cols[j].push(this.boxNumber[i]);
      }
    };

    for (let i = 0; i < cols.length; i++) {
      if( this.isMatch(cols[i]) ){
        return true;
      }
    }; // end of columns


    let rows = [];

    for(let j = 0, k = 0; j < this.boxNumber.length; j+=x, k++){
      //k is only the number for arrays, this removes empty arrays problem when using row[j]
      rows[k] = [];
      for ( let i = j; i < (j+x); i++ ) {
        rows[k].push(this.boxNumber[i]);
      }
    };

    for(let i = 0; i < rows.length; i++){
      if( this.isMatch(rows[i]) ){
        return true;
      }
    }; // end of rows


  },
  randomMove: function(){
    //Create an array of empty boxes
    const possibleMoves = this.boxNumber.filter(x => typeof(x) === 'number');
    //Pick a
    const randomIndex = Math.floor(Math.random()*(possibleMoves.length));
      console.log(randomIndex);
      console.log(possibleMoves[randomIndex]);
      return possibleMoves[randomIndex];
  },
  singlePlayer: false,


};// end to tic object

//end of game logic

let countPlays = 0;
let gameIsWon = false;
let computerTurn = false;


const clear = function(){

//hides winner/draw banner
    $('.outcome').hide();

//reset to initial conditions
  countPlays = 0;
  gameIsWon = false;
  computerTurn = false;
  // setting tic.lastPlayed maybe problematic for the 2 player version.
  tic.lastPlayed = 'O';

// generates boxNumber array with numbers again
  tic.createBoxNumber();


};





//change board size
$('.quarter.size').on('click', function(){

  //boardSize will be 3x3, 4x4 or 5x5 depending on what gets clicked
  const boardSize = parseInt($(this).attr("index"));

  //fix game logic based on board size
  tic.numCols = boardSize;

  // resets to initial settings and regenerates array
  clear();

  //clear previous divs that were appended
  $( ".board" ).empty();

  // append appropriate num of divs based on boardSize
  for(i = 0; i < boardSize**2; i++){
    $(`<div class="box${i}" index="${i}"></div>`).appendTo('.board');
  };

  //calculate CSS settings based on
  const fontSize = 7+(5/boardSize)**4;

  $('.board').css({
    gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
    gridTemplateRows:  `repeat(${boardSize}, 1fr)`,
    fontSize: `${fontSize}vw`,
  });


}); // end of boardsize




$('#reset').on('click', function(){

  // clear x and o from board
  $('.board > div').html('');

  clear();

});

$('#single').on('click', function(){
  tic.singlePlayer = true;
  $(this).css("color", "rgb(215, 214, 218)");
  $('.board > div').html('');
  clear();

});


//UI update if there is a win
const youWin = function(play){
  $('.outcome').html(`Player ${play} wins!`);
  $('.outcome, .outcomeBackground').show();
  gameIsWon = true;
  if (play === 'X'){
    tic.xScore += 1;
  } else {
    tic.oScore += 1;
  };
  $('#xScore').html(`${tic.xScore}`);
  $('#oScore').html(`${tic.oScore}`);

};

//UI update if there is a draw
const draw = function(){
    $('.outcome').html('Draw game!');
    $('.outcome, .outcomeBackground').show();
};






  $(document).on('click', '.board > div', function(){

    // $('.board > div').on('click', function(){
    // this allows you to click anywhere on the board
    // and to return the index depending where you click

    // disables the rest of code if player has won or if waiting for the comp to take a turn
    if (gameIsWon || computerTurn ) {
      return;
    }

    // let boxNum = $(e.target).attr('index');
    // this refers to the box you clicked on in $('.board > div')
    let boxNum = $(this).attr('index');

    console.log(boxNum);


    // if spot is empty then run code below
    if ($(this).html().length === 0 ) {

      // find out if its X or O
      let play = tic.nextPlay();

      // insert X or O into box clicked
      $(this).html(play);

      // updated lastPlayed value, turn index(string) into a number
      tic.boxNumber[parseInt(boxNum)] = play; //

      // updated lastPlayed value, turn index(string) into a number
      tic.lastPlayed = play;

      countPlays += 1;

      if (countPlays === (tic.numCols)**2) {
        draw();
      }
      // also need to display draw no one wins - needs counter

      if (tic.win()){
        youWin(play);

      }

      if (tic.singlePlayer === true) {
      // disable clicks until computer plays
        computerTurn = true;

        if (gameIsWon === false){
          window.setTimeout(function(){

              play = tic.nextPlay();

              // save random available index
              const computerMove = tic.randomMove();

              // put computer's play on screen
              $(`.box${computerMove}`).html(play);

              //update tic object
              tic.boxNumber[computerMove] = play;
              tic.lastPlayed = play;
              countPlays += 1;
              if (tic.win()){
                youWin(play);
              }
              if (countPlays === (tic.numCols)**2) {
                draw();
              }
              computerTurn = false;
          }, 800);
        }
      }
    }
});




// event delegation - attach a click handler to the
// entire document, and test the selector AT CLICK time
// before running the handler function (only if it matches)
// $(document).on('click', '.board > div', function(){
//
//   // $('.board > div').on('click', function(){
//   // this allows you to click anywhere on the board
//   // and to return the index depending where you click
//
//   // disables the rest of code after a player wins by exiting function
//   if (gameIsWon) {
//     return
//   }
//
//   // let boxNum = $(e.target).attr('index');
//   // this refers to the box you clicked on in $('.board > div')
//   let boxNum = $(this).attr('index');
//
//   console.log(boxNum);
//   // console.log($(this).html());
//
//
//   // if spot is empty then run code below
//   if ($(this).html().length === 0 ) {
//
//     // find out if its X or O
//     const play = tic.nextPlay();
//
//     // insert X or O into box clicked
//     $(this).html(play);
//
//     // updated lastPlayed value, turn index(string) into a number
//     tic.boxNumber[parseInt(boxNum)] = play; //
//
//     // updated lastPlayed value, turn index(string) into a number
//     tic.lastPlayed = play;
//
//     countPlays += 1;
//
//     // also need to display draw no one wins - needs counter
//     if (countPlays === (tic.numCols)**2) {
//       $('.outcome').html('Draw game!').show();
//     }
//     // also need to display draw no one wins - needs counter
//
//     if (tic.win()){
//       $('.outcome').html(`Player ${play} you win!`);
//       $('.outcome, .outcomeBackground').show();
//       gameIsWon = true;
//       if (play === 'X'){
//         tic.xScore += 1;
//       } else {
//         tic.oScore += 1;
//       }
//       $('#xScore').html(`${tic.xScore}`);
//       $('#oScore').html(`${tic.oScore}`);
//     }
//
//   }
//
// }); //end of event handler for clicks
