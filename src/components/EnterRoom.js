import React, {useState} from 'react'
import { Button } from 'react-bootstrap'

export const EnterRoom = ({joinRoom}) => {
    const [success, setSuccess] = useState(false)
    const [roomName, setRoomName] = useState('')

    const onClick = () => {
        console.log(roomName)
        joinRoom(roomName)
        setSuccess(false)
    }

  return (
      <>
          {success ? <div className='h-100'>
            <div className='m-auto'>
            <div>Enter the room's name</div>
            <input value={roomName} onChange={(e)=>setRoomName(e.target.value)} type='text' />
            <Button onClick={onClick}>Enter</Button>
            </div>

            </div>
            :
            <div>
                <Button onClick={()=>setSuccess(true)}>Join a custom room</Button>
            </div>
            }
      </>

  )
}
