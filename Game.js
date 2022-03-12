//game.js
import * as Chess from 'chess.js'
import { map } from 'rxjs/operators'
import { auth, db } from './firebase'
import { fromDocRef } from 'rxfire/firestore'
import firebase from "firebase/app";

let gameRef
let member

const chess = new Chess()







export let gameSubject


const updateUserCurrentGameDetails = (gameId) => {

    if(!auth.currentUser){
      window.location.href = '/';
    }

db.collection("users").doc(auth.currentUser.email).update({
    "currentGame": `${gameId}`
})


}



export async function initGame(gameRefFb,gameId,userRating,username) {

    const { currentUser } = auth

    if (!currentUser) {
          window.location.href = '/login'
    }

//gameRefFb is a database route eg. db.doc(`games/${id}`
    if (gameRefFb) {
        gameRef = gameRefFb

        const initialGame = await gameRefFb.get().then(doc => doc.data())

        if (!initialGame) {
            return 'notfound'
        }
       

        const creator = initialGame.members.find(m => m.creator === true)

        if (initialGame.status === 'waiting' && creator.uid !== currentUser.uid) {

            var piece = creator.piece === 'w' ? 'b' : 'w';

            const currUser = {
                uid: currentUser.uid,
                piece,
                rating: userRating,
                email: auth.currentUser.email,
                username:  username
            }
            const updatedMembers = [...initialGame.members, currUser]


            await gameRefFb.update({ members: updatedMembers, status: 'ready',timestampForLastmove: Date.now(),
            "blackPlayer": auth.currentUser.email,
           })

           var gameStatus = "ready"


     new Audio("/gameStart.mov").play()

  
updateUserCurrentGameDetails(gameId)
             
        } else if (!initialGame.members.map(m => m.uid).includes(currentUser.uid)) {
            return 'intruder'
        }
        chess.reset()

        
        gameSubject = fromDocRef(gameRefFb).pipe(
            map(gameDoc => {
                const game = gameDoc.data()

            
            const { pendingPromotion , gameData, ...restOfGame } = game

               
                member = game.members.find(m => m.uid === currentUser.uid)

                const oponent = game.members.find(m => m.uid !== currentUser.uid)
               
                if (gameData) {
                    chess.load(gameData)
                }

                const isGameOver = chess.game_over()

                
                return {
                    board: chess.board(),
                    pendingPromotion,
                    isGameOver,
                    position: member.piece,
                    member,
                    oponent,
                    status: gameStatus,
                    result: isGameOver ? getGameResult() : null,
                    ...restOfGame
                }
            })
        )
    } 
}




export async function resetGame() {
    if (gameRef) {
        //pendingPromotion, reset
        
        await updateGame(null, true)
        chess.reset()
      
    } else {
        chess.reset()
        updateGame()
    }

}


const deleteUsersCurrentGameFieldAndGame = (id) =>{
    
        let docRef= db.collection("users").doc(auth.currentUser.email)
        const currentGame = "currentGame"
        docRef.update({
            [currentGame]: firebase.firestore.FieldValue.delete()
        });

        db.collection("games").doc(id).delete()
}






export async function abortGame(id) {
 
var docRef = db.collection("games").doc(id);

docRef.get().then((doc) => {
    if (doc.exists) {

var CurrentMemberValue 

let memberOneUID = doc.data().members[0].uid
//if no other players just delete
if (!doc.data().members[1]){
docRef.delete()
deleteUsersCurrentGameFieldAndGame(id)
window.location.href = '/'
return
}

if (auth.currentUser.uid === memberOneUID) {
    CurrentMemberValue = 0
} else {
  CurrentMemberValue = 1
}

let currentUserColor = doc.data().members[CurrentMemberValue].piece


if (currentUserColor === "b") {

db.collection("games").doc(id).update({"winnerByOtherPlayerAborting":"w"})
} 
if (currentUserColor === "w") {

    db.collection("games").doc(id).update({"winnerByOtherPlayerAborting":"b"})
}

    } 
}).catch((error) => {
    console.log("Error getting document:", error);
});
   
 
}







export async function offerRematch() {
    console.log("offerRematch called")
   
   }

export function handleMove(from, to,whiteTime,blackTime,timestampForLastmove) {

  


    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)
    console.table(promotions)
    let pendingPromotion
    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        pendingPromotion = { from, to, color: promotions[0].color }
updateGame(pendingPromotion,null,whiteTime,blackTime,timestampForLastmove)

    }

    if (!pendingPromotion) {


        move(from, to,null,whiteTime,blackTime,timestampForLastmove)
    }
}






export function getTurn() {
    let turn = chess.turn()
  return turn
}









export function move(from, to, promotion,whiteTime,blackTime,timestampForLastmove) {
    


    let tempMove = { from, to }

    if (promotion) {
        console.log("promotion was true , this is promotion: " + promotion)
        tempMove.promotion = promotion
    }



    if (gameRef) {
  
        if (member.piece === chess.turn()) {
            const legalMove = chess.move(tempMove)
            if (legalMove) {
              
   
    
                updateGame(null, null,whiteTime,blackTime)

        new Audio("/move.mov").play()
            }
        } else {
            console.log("it's not your turn")
        }


    } else {
      
        const legalMove = chess.move(tempMove)
        if (legalMove) {
          
            updateGame(null, null,whiteTime,blackTime)

        new Audio("/move.mov").play()
            
        }
    }

}






export async function updateGame(pendingPromotion, reset,whiteTime,blackTime) {

  
    const isGameOver = chess.game_over()


//!!!!!! turn will log ("w" for white or "b" for black) , it will straight away log 
        //the opposite player to who just moved - eg if you just moved
        //white it will log b
        let turn = chess.turn()

    if (gameRef) {

 var updatedData;


 let resultAndWinnerArray = getGameResult();

 const result = resultAndWinnerArray[0]
 const winner = resultAndWinnerArray[1]

 let gameLength = localStorage.getItem("gameLength") ?? 180000


///when white makes a move turn = "b" - so be opposite  we log BlackHasMoved when turn === "w"
if (turn === "w"){
         updatedData = { gameData: chess.fen(), pendingPromotion: pendingPromotion || null
            ,turn: turn, blackTime: blackTime ?? gameLength, "timestampForLastmove" : Date.now(),
           BlackHasMoved: true, winner, result
        }
    } else {
         updatedData = { gameData: chess.fen(), pendingPromotion: pendingPromotion || null
            ,turn: turn, whiteTime: whiteTime ?? gameLength, "timestampForLastmove" : Date.now(),
            WhiteHasMoved: true, winner, result
        }
    }
        
        if (reset) {
            updatedData.status = 'over'
        }

    


        await gameRef.update(updatedData)
    } else {


        let resultAndWinnerArray = getGameResult();

        const result = resultAndWinnerArray[0]
        const winner = resultAndWinnerArray[1]
             
        
        const newGame = {
            board: chess.board(),
            pendingPromotion,
            isGameOver,
            position: chess.turn(),
            result: isGameOver ? result : null,
            winner

        }
        localStorage.setItem('savedGame', chess.fen())
        gameSubject.next(newGame)
    }
}




function getGameResult() {

    // //stalemate
    // do code to handle a stalemate  , line below puts game in a stalemate , 
    // chess.load('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78')

    //insufficient
    // chess.load('k7/8/n7/8/8/8/8/7K b - - 0 1')
    
 
    if(chess.in_threefold_repetition()){
alert("get game result called - this is chess.in_threefold_repetition() " + chess.in_threefold_repetition())
    } 

    if (chess.in_checkmate()) {

       

    new Audio("/elephantSoundEffect.mp3").play()
        
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
        return [`CHECKMATE`, winner]
    } else if (chess.in_draw()) {
    
        let reason = ['50 - MOVES - RULE',null]
        if (chess.in_stalemate()) {
            reason = ['STALEMATE', null]
           
        new Audio("/gameOverStalemate.mov").play()
        } else if (chess.in_threefold_repetition()) {
            alert("repetition acheived")
            reason = ['REPETITION',null]
            // return [`REPETITION`, null]
            
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL"
        }
        return [`DRAW - ${reason}`,null]
    } else {
        return [null,null]
    }
}















