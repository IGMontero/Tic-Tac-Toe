var $mainContainer = $("#main-container"),
    $screen = $("#screen"),
    $gameMode = $("#game-mode"),
    $pickToken = $("#pick-token"),
    $gameBoard = $("#game-board"),
    $two_player_pick_text = $("#two-player-pick-text"),
    $gameMenu = $("#game-menu"),
    $player1Score = $("#score-1"),
    $player2Score = $("#score-2"),
    $actualTurnContainer = $("#actual-turn"),
    $actualTurn = $("#actual-turn span"),
    $winScreen = $("#win-screen");


var gameStatus = "",
    pickedMode = "",
    pickedToken = "",
    player1Score = 0,
    player2Score = 0,
    player1Token = "",
    player2Token = "",
    gameEndend = true,
    turn = "";


var board = [
  [0,0,0],
  [0,0,0],
  [0,0,0]
];


$("document").ready(function(){
  

  
  resetGame();
  
  
  $('a').on("click",function(){
    
    var value = this.getAttribute("value");
    
    if(value=='reset'){
      resetGame();
    }
    if(value=="back"){
      if(gameStatus=="pick-token"){
        $pickToken.fadeTo("slow",0,function(){
          $pickToken.hide();
          changeScene("game-mode");
        })
      }
    }
    if(value=="one-player"){
      if(gameStatus=="game-mode"){
        pickedMode = "one-player";
        changeScene("pick-token");
      }
    }
    if(value=="two-players"){
      if(gameStatus=="game-mode"){
        pickedMode = "two-players";
        changeScene("pick-token");
      }
    }
    if(value=="token-o"){
      if(gameStatus=="pick-token"){
        pickedToken = "o";
        changeScene("game-board");
      }
    }
    if(value=="token-x"){
      if(gameStatus=="pick-token"){
        pickedToken = "x";
        changeScene("game-board");
      }
    }
    
  });
  
  $('td').on("click",function(){
    if(pickedMode=="two-players"||turn==player1Token){
      var value = this.getAttribute("value");
      var position = value.split(" ");
      var xPos = position[0];
      var yPos = position[1];

      if(!gameEnded){
        if(board[xPos][yPos]===0){
          board[xPos][yPos]=turn;
          $(this).text(turn.toUpperCase());
          checkWinner();
          if(!gameEnded){
              changeTurn();
            if(pickedMode=="one-player")
              setTimeout(makeComputerMove,1500);
          }
        }
      }
    }
  })
  
  
});

function resetGame(){
  $gameMode.show();
  $gameMenu.css("opacity",0);
  $actualTurnContainer.css("opacity",0);
  $winScreen.css("opacity",0);
  $winScreen.hide();
  $gameMode.css("opacity",0);
  $pickToken.css("opacity",0);
  $gameBoard.css("opacity",0);
  changeScene("game-mode");
  emptyBoard();
  gameEnded = true;
  player1Score = 0;
  player2Score=0;
  $player1Score.text("0");
  $player2Score.text("0");
}

function changeScene(scene){
  if(scene=="game-mode"){
    $gameMode.fadeTo("slow",1);
    gameStatus= "game-mode";
  }
  if(scene=="pick-token"){
    if(pickedMode=="one-player"){
      $two_player_pick_text.hide();
    }else{
      $two_player_pick_text.show();
    }
    $gameMode.fadeTo("slow",0,function(){
      $gameMode.hide();
      $pickToken.fadeTo("slow",1,function(){
         gameStatus="pick-token";
      });
    });
  }
  if(scene=="game-board"){
    $gameMenu.fadeTo("slow",1);
    $pickToken.fadeTo("slow",0,function(){
      $pickToken.hide();
      $gameBoard.fadeTo("slow",1,function(){
        gameStatus="game-board";
        startGame();
      })
    });
  }
}


function emptyBoard(){
  board = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ]
  $('td').text("");
}


function startGame(){
  
  $actualTurnContainer.fadeTo("slow",1);
  gameEnded = false;
  //Limpiar el board
  emptyBoard();
  
  //Asignar tokens y puntuacion inicial.
  player1Score = 0;
  player2Score = 0;
  $player1Score.text(player1Score);
  $player2Score.text(player2Score);
    //token asign
  player1Token = pickedToken;
  if(pickedToken=="o")
    player2Token = "x";
  else
    player2Token="o";
 
  //Elegir el turno
  if(Math.random()>0.5)
      turn = "x";
    else
      turn = "o";
  
  if(player1Token==turn)
    $actualTurn.text("1 ("+player1Token.toUpperCase()+")");
  else
    $actualTurn.text("2 ("+player2Token.toUpperCase()+")");
  
  
  if(pickedMode=="one-player"){
    if(turn==player2Token){
      setTimeout(makeComputerMove,1500);
    }
  }
  
}

function makeComputerMove(){
  var movX=undefined;
  var movY=undefined;
  for(var i=0 ; i<board.length;i++){
    for(var j=0 ; j<board.length;j++){
      if(board[i][j]==0){
        movX=i;
        movY=j;
        break;
      }
    }
    if(movX&&movY)
      break;
  }
  board[movX][movY] = player2Token;
  var cell = $("td[value=\""+movX+" "+movY+"\"]");
  cell.text(player2Token.toUpperCase());
  console.log(board);
  changeTurn();
}

function changeTurn(){
  if(turn=="x"){
    turn="o";
  }else{
    turn="x";
  }
  
  if(player1Token==turn)
    $actualTurn.text("1 ("+player1Token.toUpperCase()+")");
  else
    $actualTurn.text("2 ("+player2Token.toUpperCase()+")");
  
}

function checkWinner(){
    
  //Filas 
  board.forEach((row,index)=>{
    var first = row[0];
    if(first !== 0 && row.every(function(element){
      return element===first;
    })){
      gameEnded = true;
      console.log("Row "+index+" winner. Symbol: "+first);
      sumScore(first);
      showWinScreen(first);
    }
  })
  
  if(gameEnded)
    return;
  
  // COLUMNAS
  
  for(var i=0 ; i<board.length; i++){
    var first = board[0][i];
    if(first !== 0 && board[1][i]==first && board[2][i] == first){
      gameEnded = true;
      console.log("Column "+i+" winner. Symbol: "+first);
      sumScore(first);
      showWinScreen(first);
    }
  }
  
  if(gameEnded)
    return;
   
  //DIAGONALES
  //Diagonal \

  var res = board[0][0];
  if(res!==0 && board[1][1]==res && board[2][2]==res){
    gameEnded = true;
    console.log("Diagonal \\ winner. Symbol: "+res);
    sumScore(res);
    showWinScreen(res);
  }
  
  if(gameEnded)
    return;
  
  
//   //Diagonal /

  res = board[2][0];
  if(res!==0 && board[1][1]==res && board[0][2]==res){
    gameEnded = true;
    console.log("Diagonal / winner. Symbol: "+res);
    sumScore(res);
    showWinScreen(res);
  }
  if(gameEnded)
    return;
  
  //Draw
  res = false;
  board.forEach((row)=>{
    if(row.indexOf(0)!=-1){
      res=true;
    }
  })
  
  if(!res){
    gameEnded=true;
    console.log("Game draw");
    showWinScreen("draw");
    //animar por 10 segunods y mostrar
  }
  
}

function showWinScreen(winner){
  var wintext;
  if(winner=='draw'){
    wintext="It is a DRAW!"
  }else{
  wintext = "Player 1 wins!";
    if(winner==player2Token)
      wintext = "Player 2 wins!";
  }
  $winScreen.text(wintext);
  $winScreen.show();
  $actualTurnContainer.fadeTo("slow",0);
  $gameBoard.fadeTo("slow",0,function(){
    emptyBoard();
    changeTurn();
    $winScreen.fadeTo("slow",1,function(){
      $winScreen.fadeTo("slow",0,function(){
        $winScreen.hide();
        $actualTurnContainer.fadeTo("slow",1);
        $gameBoard.fadeTo("slow",1,function(){
          gameEnded=false;
          if(pickedMode=="one-player"&&turn==player2Token){
             setTimeout(makeComputerMove,1500);
             }
        })
      });
    })
  })
  
}

function sumScore(winner){
  if(winner==player1Token){
    player1Score++;
    $player1Score.text(player1Score);
  }else{
    player2Score++;
    $player2Score.text(player2Score);
  }
}