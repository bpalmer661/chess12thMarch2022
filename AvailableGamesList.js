//conversationsPage.js

import React, { useEffect, useState } from 'react';


import 'firebase/firestore';
import 'firebase/auth';
// import jwtDecode from 'jwt-decode';

// import { useDispatch, useSelector } from 'react-redux';

import {db } from './firebase'

import { Link } from 'react-router-dom';

     
export default function AvailableGamesList() {



  const [availableGames, setAvailableGames] = useState();




  // const [loading, setLoading ] = useState(true);
  // const [ error, setError ] = useState(false);


  useEffect(() => {



      if (availableGames && availableGames.length > 0) {
         return; // we  have data, so no need to run this again
      }

      const unsubscribe = db
        .collection("games")
        .onSnapshot((snapshot) => {
          const games = snapshot.docs.map((doc) => ({
            id: doc.id,
            gameId:doc.data().gameId,
            shortName: doc.data().shortName,
            location: doc.data().location
          }));
          setAvailableGames(games);
          console.log("games", games)
        }, () => {
          // setError(true)
        });
        // setLoading(false);
        return() => unsubscribe();
     
    
  }, [availableGames]);






  

   return (


     <div
     style={{backgroundColor:"red"}}
     >
       <h1 style={{textAlign:"center", padding:"40px"}}>Available Games</h1>

{ availableGames && availableGames.map(game => (


  

 

<Link 
to={{ 
    pathname: `/game/${game.gameId}`, 
  }}

>


<button>     
{  `  ${game.gameId}`} 
 </button>
   
 
 </Link>

       


   )
  
)
}


</div>

   )



}


