import React, { useEffect, useState } from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { handleMove } from './Game'
import { gameSubject } from './Game'
import Promote from './Promote'

import { useSelector } from 'react-redux'








export default function BoardSquare({
  piece,
  black,
  position,
  
})



{
  const [promotion, setPromotion] = useState(null)

var whiteTime = useSelector(state => state.user.whiteTime)

var blackTime = useSelector(state => state.user.blackTime)


const timestampForLastmove = useSelector(state => state.user.timestampForLastmove)

var gameStarted = useSelector(state => state.user.status)

  
  const [, drop] = useDrop({
    
    
    accept: 'piece',
    drop: (item) => {

    
      if (gameStarted === "waiting"){
        return
      }


      const [fromPosition] = item.id.split('_')




   whiteTime = whiteTime - (Date.now() - timestampForLastmove)


   blackTime = blackTime - (Date.now() - timestampForLastmove)

  

      handleMove(fromPosition, position,whiteTime,blackTime,timestampForLastmove)



    },
  })





  useEffect(() => {
    const subscribe = gameSubject.subscribe(
      ({ pendingPromotion }) =>
        pendingPromotion && pendingPromotion.to === position
          ? setPromotion(pendingPromotion)
          : setPromotion(null)
    )


    return () => subscribe.unsubscribe()
  }, [position])
  return (
    <div className="board-square" ref={drop}>
      <Square black={black}>
        {promotion ? (
          <Promote promotion={promotion} />
        ) : piece ? (
          <Piece piece={piece} position={position} />
        ) : null}
      </Square>
    </div>
  )
}


