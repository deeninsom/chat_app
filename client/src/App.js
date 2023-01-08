/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import './index.css';

const webSoket = new WebSocket('ws://localhost:3000/websoket')

const App = () => {

  const [showData, setShowData] = useState([]);
  const [id, setId] = useState("")
  const [body, setBody] = useState("");

  //show data
  const getDataMessage = async () =>{
    const respons = await axios.get('http://localhost:3000/messages')
    const data = await respons.data.data
    setShowData(data)
  }

  useEffect(() => {
    getDataMessage()
  }, [])



  //connecting to websoket
  webSoket.onopen = () => {
    console.log("websoket is connecting")
    setId(Math.random().toString(20).substring(2, 15))
    webSoket.send(
      JSON.stringify({
        command: "subs",
        identifier: JSON.stringify({
          id: id,
          channel: "MessageChannel"
        })
      })
    )
  }

  //post data
  const handleMessage = async (e) =>{
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/messages',{
        body
      })
      setBody('')
    } catch (error) {
      console.log(error);
    }
  }

  //on realtime websoket
  webSoket.onmessage = () => {
    getDataMessage()
  }

  return (
    <section className='room-chat'>
      <div className='message-app '>
        <div className='title text-[30px] pb-5 font-bold text-teal-400 text-center pt-6 '>Message App</div>
        <div className='flex rounded-t-md bg-slate-600 m-auto w-[80%] p-3 justify-between'>
        <div className='head-room  text-white '>Chat Room</div>
        </div>
        <div className='body-chat bg-slate-400 h-[400px] m-auto w-[80%] flex flex-col space-y-4 p-3  overflow-y-auto'>
          {/* first chat */}
          <div className='msg' >
            <div className='flex items-end'>
              <div className='flex flex-col space-y-2 text-xs max-w-xs order-2 items-start' >
              {
                showData.map((data)=>{
                  return (
                    <div key={data.id}>
                    <span className='px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-700' id='message' > {data.body} </span>
                    </div>
                    )
                  })
                }
                </div>
            </div>
          </div>

        </div>
        <div className='sendMessage flex rounded-b-md bg-slate-600 mx-auto w-[80%] p-4 '>
          <form onSubmit={handleMessage}>
            <input className='messageInput rounded lg:w-[1000px] lg:h-[120%] pl-2 mx-auto' type="text" placeholder='send message' value={body} onChange={(e) => setBody(e.target.value)} />
            <button type='submit' className='bg-gray-500 ml-2 rounded-md w-[50px] h-[125%]'>send</button>
          </form>
        </div>
      </div>
    </section>

  )
}

export default App



