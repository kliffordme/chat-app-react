import React, {useState, useEffect, useCallback} from 'react'
import { Button } from 'react-bootstrap'
import { io } from "socket.io-client";
import { Form } from 'react-bootstrap';
import { EnterRoom } from './EnterRoom';

const socket = io('http://localhost:4000')

const Dashboard = () => {
    const [messages, setMessages] = useState([])
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [room, setRoom] = useState('')
    const [formData, setformData] = useState({
        name: '',
        message: '',
        userId: '',
    })
    const setRef = useCallback(node => {
        if(node){
            node.scrollIntoView({smooth: true})
        }
    }, [])

    const formHandler = (key, data) => {
        setformData({...formData, [key]: data})
    }


    const joinRoom = (room) => {
        socket.emit('join-room', room, msg=>{
            console.log(msg)
            setMessages(messages=>[...messages,
                 {message: msg,
                name: 'Admin'}
                ])
        })
        setRoom(room)
    }

    const onClick = (e) => {
        e.preventDefault()

        console.log(formData)
        if(formData.name === null || formData.name.length === 0){
            return setError('please enter a username')
        }

        setSuccess(true)
    }


    useEffect(()=>{

        socket.on('connect', ()=>{
            setformData({
                name: localStorage.getItem('name'),
                message: formData.message,
                userId: socket.id,
            })
        })

        socket.on('receive', data =>{
            setMessages(messages => [...messages, data])
        })

        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
              console.log("Enter key was pressed. Run your function.");
              event.preventDefault();
              // callMyFunction();
              
            }
          };
          document.addEventListener("keydown", listener);
          return () => {
            document.removeEventListener("keydown", listener);
          };
    },[])


    const onSubmit = () => {
        if(formData.message === ''){
            return
        }
        socket.emit('send', formData, room)
        setMessages([...messages, formData])
        setformData({
            name: formData.name,
            message: '',
            userId: formData.userId
        })
    }



  return (
    <div  >
        {success ? 
        <div id='dashboard'>
            <div>
                {room ? <div className='py-2 d-flex justify-content-center'>{room} room</div> : <div className='py-2 d-flex justify-content-center'>You are sending messages to everyone</div>}
                <div  id="border" className='d-flex flex-column align-items-end justify-content-end px-3'>
                    <div  className='w-100 d-flex flex-column overflow-auto'>
                    {messages.map((message, index)=>{
                        const lastMessage = messages.length - 1 === index
                        return(
                        message.userId === formData.userId ? 
                        <div ref={lastMessage ? setRef : null} id="you" key={index} className="rounded d-flex align-self-end">You: {message.message}</div>
                        :
                        <div ref={lastMessage ? setRef : null}  id="sender" key={index} className="rounded d-flex align-self-start">
                            {message.name}: {message.message}
                        </div>
                    )})}
                    </div>

                </div>
                <div  className='rounded d-flex flex-column w-75 m-auto my-2'>
                    <div className='py-3'>
                        <div>
                        {formData.name} 
                        </div>
                        <div>
                        ID: {formData.userId} 
                        </div>
                    </div>
                    <textarea className='mb-2' value={formData.message} onChange={(e)=>formHandler('message', e.target.value)} placeholder='write something' />
                    <Button  onClick={onSubmit}>Enter</Button>
                </div>
                <div className='d-flex justify-content-center'>
                    <EnterRoom joinRoom={joinRoom} />
                </div>

            </div>

        </div>
        :

        <div id="namePage" className=''>
            <div className='w-75 m-auto'>
                <h2 className='mb-5'>Chat-app (socket.io)</h2>
            <Form.Group className="mb-3" >
                <Form.Label>Name</Form.Label>
                <Form.Control className='mb-2' onChange={(e)=>formHandler('name', e.target.value)} type="text" placeholder="Enter name" />
                <div className='mb-2'>
                {error ? error : null}

                </div>
                <Button onClick={onClick} variant="primary" type="submit">
                    Submit
                </Button>
            </Form.Group>
            </div>
        </div>
        }

    </div>
  )
}

export default Dashboard