import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { blue, red } from '@mui/material/colors';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import {useNavigate} from "react-router-dom"

const chatMessages =[
    { role: "user", content: "Hello, AI assistant!" },
    { role: "assistant", content: "Hello! How can I assist you today?" },
    { role: "user", content: "Can you tell me a joke?" },
    { role: "assistant", content: "Sure! Why did the scarecrow win an award? Because he was outstanding in his field!" },
    { role: "user", content: "That's funny. Can you give me a quote?" },
    { role: "assistant", content: "Of course! 'The only way to do great work is to love what you do.' - Steve Jobs" },
    { role: "user", content: "Thanks for the quote. What's the weather like today?" },
    { role: "assistant", content: "I don't have real-time data, but you can check a weather website for the latest updates." }
  ];
  
type Message ={
  role:"user" | "assistant";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const handleSubmit = async() =>{
    const content=inputRef.current?.value as string;
    if(inputRef && inputRef.current){
      inputRef.current.value=""
    }
    const newMessage:Message = {role: "user", content}
    setChatMessages((prev)=>[...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats])
  }

  useLayoutEffect(()=>{
    if(auth?.isLoggedIn && auth.user){
      toast.loading("Loading Chats", {id:"loadchats"})
      getUserChats().then((data)=>{
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded Chats", {id:"loadchats"})
      }).catch(err=>{console.log(err);
        toast.error("Loading Failed", {id:"loadchats"})
      })
    }
  },[auth])

  useEffect(()=>{
    if(!auth?.user){
      return navigate("/login");
    }
  },[auth])

  const handleDeleteChats = async () =>{
    try {
      toast.loading("Deleting Chats",{id:"deleteChats"});
      await deleteUserChats();
      toast.success("Deleted chats", {id:"deleteChats"})
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed")
      
    }
  }
  return (
    <Box sx= {{display:'flex', flex:1,width:"100%", height: "100%",
      mt:3, gap:3
    }}>
      <Box sx={{display:{md:'flex', xs:'none',sm:'none'}, flex: 0.2, flexDirection:"column"}}>
        <Box 
          sx={{
            display: "flex",
            width: '100%', 
            height: '60vh',
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: 'column',
            mx: 3
          }}>
        
        <Avatar 
        sx={{
          mx:"auto",
          my:2, 
          bgcolor: "white",
          color: "black",
          fontWeight: 700,
        }}>A
        {auth?.user?.name[0]}
        {auth?.user?.name.split("")[1][0]}
        </ Avatar>
          <Typography sx ={{mx:"auto", fontFamily: "Poppins"}}>
            You are talking to a ChatBOT
          </Typography>
        <Typography sx={{mx:"auto", fontFamily: "Poppins", my:4, p:3}}> You can ask some questions related to Knowledge, Business, Advices, Education etc. But avoid sharing personal info.
        </Typography>
        <Button
        onClick={handleDeleteChats} 
        sx={{width: "200px", my: "auto", color: "white", fontWeight:"700", borderRadius:3, mx:"auto", bgcolor: red[400], 
          ":hover":{
            bgcolor: red.A700,

          }
        }}>
          Clear Conversation
        </Button>
        </Box>
      </Box>
      <Box sx={{display: "flex", flex:{md: .8, xs: 1, sm:1}, flexDirection: "column", px:3}}>
      <Typography sx={{textAlign: 'center', fontSize: "40px", color: "white", mb: 2, mx: "auto"}}>
        Model - GPT 3.5
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: "scroll", overflowX: "hidden",overflowY:"auto", scrollBehavior: "smooth"}}>
        {chatMessages.map((chat, index)=>
          //@ts-ignore
          (<ChatItem content={chat.content} role={chat.role} key={index}/>))}
      </Box>
      <div style={{width: "100%", padding:"20px", borderRadius: 8, backgroundColor:"rgb(17, 27, 39)", display: "flex", margin:'auto'}}>
        {" "}
      <input 
      ref={inputRef}
      type='text' style={{width: "100%", backgroundColor: 'transparent', padding:"10px", border: 'none', outline:"none", color: 'white', fontSize: '20px'}}/>
      <IconButton onClick={handleSubmit} sx={{ml:"auto", color:"white"}}>
      <IoMdSend />
      </IconButton>
      </div>
      </Box>
    </Box>
  )
}

export default Chat
