



// to deploy app watch this video
// https://www.youtube.com/watch?v=IDHfvpsYShs
//steps 

//step one
//npm run build - this create a build folder of static files that work 
//om most if not all browsers

//step two
//firebase  init
//select  hosting
// what do you want to use as your public directory? 
//  Enter "build"
//configure as a single page app? YES
//File build/index.html already exists. Overwrite? No

//wait until complete should be fast
//then enter in the console "firebase deploy"
//select no to deleting functions




//TO DO LIST

//do paid withdrawals page



// double check that opponents username is loaded into transactions correctly when each person runs out of time , so let white run out , then let black run out

// check when we win or lose if our tokens are tracked corretly and make it so the correct amount
// of tokens shows up in navbar and also make it so when we win or lose it shows the oponnents
// username in the transactions page 

// when we check mate - take and add point accordingly 


// also have to deal with a draw, just make it so both players get all their tokens back 



//make it so people can creat games , for , 5 mins or 3 mins and for token amount then always just take 1 token 
//and then do a total of games played so you know how much money you have made.

// bpx do a draw on repitition 

//do another website or youtube video on how to access crypto chess,  like you need etheruem , meta mask , vpn etc, also say don't bet with to much money
//and don't put alot of money into meta mask etc


//sounds when we move
//rating add to rating then later match rating to similar ratings
//add score down the bottom to see who is winning on pieces





import React, { useEffect, useState } from 'react'
import './App.css'
import { gameSubject, initGame, abortGame,offerRematch, getTurn} from './Game'
import Board from './Board'
import { useParams } from 'react-router-dom'
import { db,auth } from './firebase'
import BlackCountDownTimer from './BlackCountDownTimer'
import WhiteCountDownTimer from './WhiteCountDownTimer'
import { useDispatch,useSelector } from "react-redux";
import { setClockValuesAndTimeStamp,setPlayersColor } from './redux/actions/userActions'
import firebase from "firebase/app"
import CircularProgress from '@material-ui/core/CircularProgress'


import elephant from './Images/elephantChess.png'



import { useHistory } from 'react-router-dom'



function GameApp() {

  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  const [position, setPosition] = useState()
  const [initResult, setInitResult] = useState(null)
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line
  const [status, setStatus] = useState('')
  const [game, setGame] = useState({})
  // eslint-disable-next-line
const [timestampForLastmove,setTimestampForLastmove] = useState()
  const { id } = useParams()
 
  const [whiteClockOn, setWhiteClockOn] = useState(false)
  const [blackClockOn, setBlackClockOn] = useState(false)
  const [blackTime, setBlackTime] = useState()
  const [whiteTime, setWhiteTime] = useState()
  const [gameStatusReady, setGameStatusReady] = useState(false)
  var [whitePlayerRating, setWhitePlayerRating] = useState(null)
  var [blackPlayersRating, setblackPlayersRating] = useState(null)
  // eslint-disable-next-line
  var [opponentsRating, setOpponentsRating] = useState(null)

  var [WhiteHasMoved, setWhiteHasMoved] = useState(null)
  var [BlackHasMoved, setBlackHasMoved] = useState(null)
  var [gameResigned, setGameResignedBoolean] = useState(false)

var [aborter,SetGameAborter] = useState("")
  var [gameAborted, setGameAbortedBoolean] = useState(false)


  var [winnersColor, setWinnersColor] = useState()
  var [losersColor, setLosersColor] = useState()

  var [playerOne, setPlayerOne] = useState()
  var [playerTwo, setPlayerTwo] = useState()


  var [gameWinner, SetGameWinner] = useState()
  


//this is originally set by dispatch setPlayersColor in board.jsx
const currentUsersColor = useSelector(state => state.user.position) 

  
const currentUsersRating  = useSelector(state => state.user.rating) 

const usersTokens = useSelector(state => state.user.tokens) 


const username = useSelector(state => state.user.username) 




var opponent

  

if (username !== playerOne) {
  console.log("opponent is: " + playerOne)
   opponent = playerOne ?? "NA"
 } 
 
 if (username !== playerTwo){
   console.log("opponent is: " + playerTwo)
  opponent = playerTwo ?? "NA"
 }
 



const SetGamesInitialStartTimeIfNoneAndSetOpponentsRating = () => {


  db.collection("games").doc(id).get().then((doc) => {
    if (doc.exists) {


doc.data().members.forEach((member) => {

  //get opponents rating
  if (member.uid !== auth.currentUser.uid){
    opponentsRating = member.rating


    //get opponents color and set clock with rating
if (member.piece === "w"){
  setWhitePlayerRating(opponentsRating)
  setblackPlayersRating(currentUsersRating)
} else {
  setWhitePlayerRating(currentUsersRating)
  setblackPlayersRating(opponentsRating)

}


    


  } 
  
})




  if (doc.data().timestampForLastmove === null ){
    db.collection("games").doc(id).update({
      "timestampForLastmove": Date.now(),
     "whiteClockOn": true,
    })
  } 
    }
  })
}




const dispatch = useDispatch();

const gameData = useSelector(state => state.user)





useEffect(() => { 


  setTimeout(() => {
    

 
 
  
if (gameData.status  !== "ready"){
  return 
} 


var updatedData;
var whiteTime = gameData.whiteTime
var blackTime = gameData.blackTime
var timestampForLastmove = gameData.timestampForLastmove
var difference = Date.now() - timestampForLastmove



  whiteTime = whiteTime - difference
  blackTime = blackTime - difference


const turn = getTurn()


if (turn === "w"){
  updatedData = { whiteTime, "timestampForLastmove" : Date.now()
 }
} else {
  updatedData = { blackTime, "timestampForLastmove" : Date.now()}
}



db.collection("games").doc(id).update(updatedData)

dispatch(setClockValuesAndTimeStamp(updatedData));
}, 500);
/* eslint-disable */
}, [])



const gameReadyMarkup = gameStatusReady === false ? (
  <div style={{backgroundColor:"black", height:"600px",width:"600px", position: "absolute",
  marginTop:"50px", zIndex:1
  
  
  
  }}>
<center>

<img 
style={{width:"150px", 
padding:"5px",
marginTop:"30px",
}}
src={elephant} alt="hammer" 
/>
  <p
  style={{padding:"50px", fontSize:"20px",color:"white",}}
  >  Waiting For An Opponent - To avoid long wait times please arrange to play against a friend 
  ensuring that you have selected the same game length and bet amount.
 </p>
 <br/>
 
 <CircularProgress/>

 <p
  style={{padding:"50px", fontSize:"20px",color:"white",}}
  >  PUT YOUR ADD HERE - PERHAPS FOR A VPN
 </p>

</center>




  
  </div>
) : (
  null
)





const history = useHistory()


const gameResignedFunction = () => {

  console.log(" gameResignedFunction called")
  db.collection('users').doc(auth.currentUser.email).update({
    ["currentGame"]: firebase.firestore.FieldValue.delete()
    }).catch((error) => {
      alert("error "+ error)
    });

     db.collection("games").doc(id).get() 
    .then(doc => {
    
 let gameStatus = doc.data().status 

if (gameStatus === "waiting"){
  db.collection("games").doc(id).delete()
  history.push('/')
  return
}

     var OnePlayerHasClickedThrough = doc.data().OnePlayerHasClickedThrough
    
if (!OnePlayerHasClickedThrough){
  db.collection("games").doc(id).update({OnePlayerHasClickedThrough: true})
  history.push('/')
} else {

  db.collection("games").doc(id).delete()
  history.push('/')
}

    })


   

    setGameResignedBoolean(false)
   
    
    
}

















const PlayerResignsAlert = gameResigned === true ? (

<div
  
  style={{
   backgroundColor:"white", height:"200px",width:"450px", fontSize:"20px", position: "absolute",
   zIndex:3, borderRadius: "15px",
 
 }}>
<p  
style={{textAlign:"center",
 verticalAlign: "middle", 
 marginTop: "20px",
 marginLeft: "10px",
 marginRight: "10px",
 color:"black",
 }}
>
{aborter} Has Aborted - No points or token deductions as {aborter} has not moved yet.
</p>

<div
style={{
 
 width: "200px",
 height: "40px",
 margin: "auto",
 marginTop: "30px",

}}
>

<button 

style={{width:"100%",
height:"40px",
color: "white",
backgroundColor:"#008CBA",
margin: "auto",
fontSize: "20px",
borderRadius: "5px",
}}

onClick={gameResignedFunction}> OK </button>

 </div>
 </div>
 

) : (
  null
)











const blocker = gameResigned | gameAborted | isGameOver === true ? (
  <div
   style={{
    backgroundColor:"white", height:"900px",width:"900px", fontSize:"20px", position: "absolute",
    zIndex:2, borderRadius: "15px",
  backgroundColor:"black", 
  opacity:0.5,
  }}>

  </div>
) : (
  null
)










const gameAbortedFinishingFunction = () => {


  var usersColor;

  if (auth.currentUser.email === game.whitePlayer){
    usersColor = "w"
  }
  
  if (auth.currentUser.email === game.blackPlayer){
    usersColor = "b"
  }
  
  
  if (usersColor === game.winnerByOtherPlayerAborting) {
    setWinnersColor(game.winnerByOtherPlayerAborting)
    
  if (game.winnerByOtherPlayerAborting === "w"){
    setLosersColor("b")
  } else {
    setLosersColor("w")
  }
  
    var newRating = currentUsersRating + 4

    usersNewTokenCount = usersTokens + 4.5

    const timestamp =  Date.now()



db.collection("users").doc(auth.currentUser.email).collection("transactions").add({amount:`+${4.5}`,
balance:usersNewTokenCount, creditOrDebit: "credit",opponentsUsername: opponent, 
opponentEmail: "NA",opponentsUID: "NA", 
timestamp, type: "Win",
 winOrLoss: "Win", ResultBy: "Opponent Aborted Game", ratingChange:`+${4}`,rating: newRating });

  
         db.collection('users').doc(auth.currentUser.email).update({
           rating: newRating,
           tokens: usersNewTokenCount,
           ["currentGame"]: firebase.firestore.FieldValue.delete()
         
           }).catch((error) => {
             alert("error "+ error)
             
           });
  
           setGameAbortedBoolean(true)
  
  
  } else {

    setWinnersColor(game.winnerByOtherPlayerAborting)
    setLosersColor(usersColor)
  
  var newRatingTwo = currentUsersRating - 4

  var usersNewTokenCount = usersTokens - 5
  const timestamp =  Date.now()

db.collection("users").doc(auth.currentUser.email).collection("transactions").add({amount:`-${5}`,
balance:usersNewTokenCount, creditOrDebit: "debit", opponentsUsername: opponent, opponentEmail: "NA",opponentsUID: "NA", timestamp, type: "Loss", 
winOrLoss: "Loss", ResultBy: "You Aborted Game",ratingChange:`-${4}`,rating: newRatingTwo  });


  
         db.collection('users').doc(auth.currentUser.email).update({
           rating: newRatingTwo,
           tokens: usersNewTokenCount,
           ["currentGame"]: firebase.firestore.FieldValue.delete()
           }).catch((error) => {
             alert("error "+ error)
             
           });
  
    setGameAbortedBoolean(true)
  
  }


  //this code makes sure the seccond person to click through is the one who deletes the game
  //this avoids san error from a user trying subscribing to a deleted game

if (!game.OnePlayerHasClickedThrough){
  alert("was no game.OnePlayerHasClickedThrough ")
  db.collection("games").doc(id).update({OnePlayerHasClickedThrough: true})
  history.push('/')
} else {
  alert("there was a game.OnePlayerHasClickedThrough ")
  db.collection("games").doc(id).delete()
  history.push('/')
}


 



}

















var [winnersColor, setWinnersColor] = useState()
var [losersColor, setLosersColor] = useState()



const handleDraw = () => {

  var newRating = currentUsersRating - 1 

  var theUsersNewTokenCount = usersTokens - 1
  const timestamp =  Date.now()

  db.collection("users").doc(auth.currentUser.email).collection("transactions").add({amount:`-${1}`,
  balance:theUsersNewTokenCount, creditOrDebit: "debit",opponentsUsername: opponent, opponentEmail: "NA",opponentsUID: "NA", timestamp, type: "Draw",
   winOrLoss: "Draw", ResultBy: result, ratingChange:`+${1}`,rating: newRating  });
  
    
           db.collection('users').doc(auth.currentUser.email).update({
             rating: newRating,
             tokens: theUsersNewTokenCount,
             ["currentGame"]: firebase.firestore.FieldValue.delete()
           
             }).then(() =>{
              window.location.href = "/"
             }).catch((error) => {
               alert("error "+ error)
               
             });
}




const gameIsOverFinishingFunction = (winner) => {

 

if (result !== `CHECKMATE`){
  handleDraw()
  return
}





  var usersColor;

  if (auth.currentUser.email === game.whitePlayer){
    usersColor = "w"
  }
  
  if (auth.currentUser.email === game.blackPlayer){
    usersColor = "b"
  }
  
  //winners color is set to b or w 
  if (usersColor === winnersColor) {
   
    var newRating = currentUsersRating + 4

    var NewTokenCount; 
    NewTokenCount = usersTokens + 4.5

    const timestamp =  Date.now()

db.collection("users").doc(auth.currentUser.email).collection("transactions").add({amount:`+${4.5}`,
balance:NewTokenCount, creditOrDebit: "credit",opponentsUsername: opponent, opponentEmail: "NA",opponentsUID: "NA", timestamp, type: "Win",
 winOrLoss: "Win", ResultBy: `${result}`, ratingChange:`+${4}`,rating: newRating  });

  
         db.collection('users').doc(auth.currentUser.email).update({
           rating: newRating,
           tokens: NewTokenCount,
           ["currentGame"]: firebase.firestore.FieldValue.delete()
         
           }).catch((error) => {
             alert("error "+ error)
             
           });
  
  } else {

  var newRatingTwo = currentUsersRating - 4
 
  var usersNewTokenCount = usersTokens - 5
  const timestamp =  Date.now()

db.collection("users").doc(auth.currentUser.email).collection("transactions").add({amount:`-${5}`,
balance:usersNewTokenCount, creditOrDebit: "debit", opponentsUsername: opponent, opponentEmail: "NA",opponentsUID: "NA", timestamp, type: "Loss", 
winOrLoss: "Loss", ResultBy: `${result}`, ratingChange:`-${4}`,rating: newRatingTwo   });

         db.collection('users').doc(auth.currentUser.email).update({
           rating: newRatingTwo,
           tokens: usersNewTokenCount,
           ["currentGame"]: firebase.firestore.FieldValue.delete()
           }).catch((error) => {
             alert("error "+ error)
           });
  
  
  }

    //here we just let the winner delete the game from the database , not both players
    if (currentUsersColor === winner){

      setTimeout(deleteGame, 1000); //execute greet after 2000 milliseconds (2 seconds)
     
         }
         
         window.location.href = "/"
}



// when does draw insufficient material occur when there is no way to win ?

// or it is when your opponent only has a king left and your time runs out? 



const gameIsOverMarkup = isGameOver === true ? (
  <div
  
  style={{
   backgroundColor:"white", height:"200px",width:"450px", fontSize:"20px", position: "absolute",
   zIndex:3, borderRadius: "15px",
 }}>
<p  
style={{textAlign:"center",
 verticalAlign: "middle", 
 marginTop: "20px",
 marginLeft: "10px",
 marginRight: "10px",
 color:"black",
 }}
>
GAME IS OVER -  {result} 

</p>

<div
style={{
 
 width: "200px",
 height: "40px",
 margin: "auto",
 marginTop: "30px",

}}
>

<button 

style={{width:"100%",
height:"40px",
color: "white",
backgroundColor:"#008CBA",
margin: "auto",
fontSize: "20px",
borderRadius: "5px",
}}

onClick={gameIsOverFinishingFunction}> OK
 </button>

 </div>
 </div>
) : (
  null
)








const playerAbortsAlert = gameAborted === true ? (
  <div
  
  style={{
   backgroundColor:"white", height:"200px",width:"450px", fontSize:"20px", position: "absolute",
   zIndex:3, borderRadius: "15px",
 
 }}>
<p  
style={{textAlign:"center",
 verticalAlign: "middle", 
 marginTop: "20px",
 marginLeft: "10px",
 marginRight: "10px",
 color:"black",
 }}
>
{losersColor} has aborted - {winnersColor} Wins 
</p>

<div
style={{
 
 width: "200px",
 height: "40px",
 margin: "auto",
 marginTop: "30px",

}}
>

<button 

style={{width:"100%",
height:"40px",
color: "white",
backgroundColor:"#008CBA",
margin: "auto",
fontSize: "20px",
borderRadius: "5px",
}}

onClick={gameAbortedFinishingFunction}> OK
 </button>

 </div>
 </div>
) : (
  null
)




         //in this case 
        //resign means you haven't made a move
        //and won't be deducted any points
        //and abort means you have made a move.
        const pickAbortOrResign = (id) => {

          //get players color, 
          if (currentUsersColor === "w"){

            if(WhiteHasMoved){
              abortGame(id)
            } else {
              resign()
            }
          }

            if (currentUsersColor === "b"){
              if(BlackHasMoved){
                abortGame(id)
              } else {
                resign()
              }
          }

          


        }
        



//resign should only get called if the player calling it hasn't made a move
const resign = () => {
  if (currentUsersColor === "b") {
    db.collection("games").doc(id).update({"winnerByOtherPlayerResigning":"w"})
}
if (currentUsersColor === "w") {
  db.collection("games").doc(id).update({"winnerByOtherPlayerResigning":"b"})
}

}



//this is set in start online game - in checkUserIsNotAlreadyInGame - around line 116
const userRating = useSelector(state => state.user.rating) ?? 500


function deleteGame() {


  db.collection("games").doc(id).delete().then(() => {
    console.log("Document successfully deleted!");
    goToHomePage()
  }).catch((error) => {
    alert("error "+ error)
  });
  goToHomePage()
 }












 
 const goToHomePage = () => {
  window.location.href = "/"
 }




  useEffect(() => {


    let subscribe
    async function init() {

      const user = auth.currentUser
      if (user === null){
        window.location.href = '/login'
        return
      }


const res = await initGame(db.doc(`games/${id}`), id,userRating,username)


      setInitResult(res)


      setLoading(false)
      if (!res) {

        subscribe = gameSubject.subscribe((game) => {



dispatch(setPlayersColor(game.piece));

//winnerByOtherPlayerResigning means a person aborts with out moving
if(game.winnerByOtherPlayerResigning){




  new Audio("/gameOver.mov").play()


  setWhiteClockOn(false)
  setBlackClockOn(false)
var winner;
var aborter
if (game.winnerByOtherPlayerResigning === "w"){
  winner = "white" 
  aborter = "black"
} else {
  winner = "black"
  aborter = "white"
}
  SetGameWinner(winner)
  SetGameAborter(aborter)
  setGameResignedBoolean(true)


}




if (game.result){
        
  setWhiteClockOn(false)
  setBlackClockOn(false)

  //const winner = chess.turn() === "w" ? 'b' : 'w'
  const winner = game.winner ? game.winner : "NA"

  setWinnersColor(winner)


 }






       
      if(game.winnerByOtherPlayerAborting){

  new Audio("/gameOver.mov").play()

  setWhiteClockOn(false)
  setBlackClockOn(false)
  setWinnersColor(game.winnerByOtherPlayerAborting)

  if (game.winnerByOtherPlayerAborting === "w"){
    setLosersColor("b")
  } else {
    setLosersColor("w")
  }

setGameAbortedBoolean(true)
      }



dispatch(setClockValuesAndTimeStamp(game));
          setBoard(game.board)
          setIsGameOver(game.isGameOver)
          setResult(game.result)
          setPosition(game.position)
          setStatus(game.status)
          setGame(game)
         setTimestampForLastmove(game.timestampForLastmove)
          setWhiteTime(game.whiteTime)
         setBlackTime(game.blackTime)
         setWhiteClockOn(game.whiteClockOn)
         setBlackClockOn(game.blackClockOn)
        setWhiteHasMoved(game.WhiteHasMoved)
       setBlackHasMoved(game.BlackHasMoved)
       if(game.isGameOver){
         setWhiteClockOn(false)
         setBlackClockOn(false)
         return
       }

      //  when check mate is achieved you cant move the pieces try and see if you can do this when someone aborts etc?? but not really needed
     


      //  below seems to print fine so now use hooks to set player one and two then pass them down to be save in transactions when someone wins or loses  ,
       if (game.members[0] && game.members[0].username){
         console.log("member 0 " + game.members[0].username)
         setPlayerOne(game.members[0].username)
       }


       if (game.members[1] && game.members[1].username){
        console.log("member 1 " + game.members[1].username)
        setPlayerTwo(game.members[1].username)
      }
        

if (game.status  === "ready"){


  setGameStatusReady(true)
  SetGamesInitialStartTimeIfNoneAndSetOpponentsRating()

  const turn = getTurn()

    if (!game.winnerByOtherPlayerAborting && !game.winnerByOtherPlayerResigning) {
  if (turn === "w"){
    setWhiteClockOn(true)
  } else {
    setBlackClockOn(true)
  }
}
}

        })
      } else {
        //else there was a response
      }
    }

    init()

    return () => subscribe && subscribe.unsubscribe()
    // eslint-disable-next-line
    
  }, [id])






  
  if (loading) {
    return 'Loading ...'
  }
  if (initResult === 'notfound') {
    console.log("no game found")
    
    db.collection("games").doc(id).delete().then(() => {
      window.location.href = "/"
      console.log("Document successfully deleted!");
  }).catch((error) => {
      console.error("Error removing document: ", error);
      window.location.href = "/"
  });
  window.location.href = "/"
    
    //return 'Game Not found'
  }

  if (initResult === 'intruder') {
    alert("two people are already playing on this game")
    return 'The game is already full'
  }



  




  const oppositionsClock = currentUsersColor === "w" ? (
    <BlackCountDownTimer 
    blackClockOn={blackClockOn}
  gameId={id}
  blackTime={blackTime}
  blackPlayersRating={blackPlayersRating}
  playerOne = {playerOne}
  playerTwo = {playerTwo}
    />
  ) : (
    <WhiteCountDownTimer 
  whiteClockOn={whiteClockOn}
       gameId={id}
       whiteTime={whiteTime}
       whitePlayerRating={whitePlayerRating}
       playerOne = {playerOne}
  playerTwo = {playerTwo}
       
  />
  )


  
  const currentUsersClock = currentUsersColor === "w" ? (


    <WhiteCountDownTimer 
    style={{marginBottom: "40px"}}
    whiteClockOn={whiteClockOn}
       gameId={id}
       whiteTime={whiteTime}
       whitePlayerRating={whitePlayerRating}
       playerOne = {playerOne}
  playerTwo = {playerTwo}
  
    />
    
  ) : (
    <BlackCountDownTimer 
    blackClockOn={blackClockOn}
  gameId={id}
  blackTime={blackTime}
  blackPlayersRating={blackPlayersRating}
  playerOne = {playerOne}
  playerTwo = {playerTwo}
  />
  )


  return (
    <div className="app-container">
   

      {blocker}
{PlayerResignsAlert}
{playerAbortsAlert}
{gameIsOverMarkup}
        

      <div className="board-container">


      {gameReadyMarkup} 
     

        <Board board={board} position={position} />
        {game.member && game.member.name && <span className="tag is-link">{game.member.name}</span>}

       

      </div>




      <div className="board-side-bar"
        style={{
          position: "relative",
          //  display: "flex",
   alignItems: "center",
  justifyContent: "center",

         }}
      >




{ oppositionsClock }
    

<br/>
<br/>
<br/>
<br/>




        <button 
        style={{fontSize:"15px", width: "120px", 
        margin: "0 auto" ,
    display:"block",
        }}
        onClick={() => pickAbortOrResign(id)}
        className="abort-game-button" >Abort Game
        </button>



    


    
    

        <br/>

        <button 
        style={{fontSize:"15px", width: "120px", 
        margin: "0 auto" ,
    display:"block",
        }}
        className="abort-game-button" >Offer Draw
        </button>

<br/>
        <button 
        style={{fontSize:"15px", width: "120px", 
        margin: "0 auto" ,
    display:"block",
        }}
        onClick={offerRematch}
        className="abort-game-button" >Offer Rematch
        </button>



        <br/>
<br/>
<br/>
<br/>



{ currentUsersClock }
       
       

      </div>

      {result && <p className="vertical-text">{result}</p>}
      






      

    </div>
  )
}

export default GameApp






