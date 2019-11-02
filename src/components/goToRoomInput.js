import React, { useState } from 'react'

const goToRoom = (history, roomId) => {
  history.push(`videollamada/${roomId}`)
}


export function GoToRoomInput({history}) {
  let [roomId, setRoomId] = useState('abc');

  return (<div className="enter-room-container">
    <form>
          <input type="text" value={roomId} placeholder="Room id" onChange={(event) => {
            setRoomId(event.target.value)
          }}/>
          <button onClick={() => {
            goToRoom(history, roomId)
          }}>Enter</button>
          </form>
        </div>)
}