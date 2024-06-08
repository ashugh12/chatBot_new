import { Avatar, Box, Button, IconButton, Typography } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { red } from '@mui/material/colors';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"


const discussion = [
  { role: 'user', content: 'Hello, how can I help you?' },
  { role: 'assistant', content: "Hi there! I'm here to assist you." },
  { role: 'user', content: "I'm having trouble with my computer. It keeps crashing." },
  { role: 'assistant', content: 'I see. Have you tried restarting your computer?' },
  { role: 'user', content: "Yes, I've tried restarting it multiple times, but the issue persists." },
  { role: 'assistant', content: 'In that case, it might be a hardware issue. Have you checked your hardware components?' },
  { role: 'user', content: "No, I haven't. How can I do that?" },
  { role: 'assistant', content: 'You can try running diagnostic tests or checking for any loose connections.' },
  { role: 'user', content: "Okay, I'll give that a try. Thank you!" },
  { role: 'assistant', content: "You're welcome! Let me know if you need further assistance." }
  // Add more messages as the discussion continues
];



type Message = {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    try {
      // Ensure inputRef.current is not null before accessing its value
      const content = inputRef.current?.value?.trim();

      if (!content) {
        return; // Do not submit empty or whitespace-only messages
      }

      // Clear input field after submitting
      if (inputRef.current) {
        inputRef.current.value = '';
      }

      // Create a new message object
      const newMessage: Message = { role: 'user', content };

      // Update chat messages state by appending the new message

      setChatMessages(prev => 
        [...prev, newMessage]);

      // Send message to the backend and retrieve response
      const chatData = await sendChatRequest(content);

      // Append new messages received from the backend to the chat messages state
      setChatMessages(prev => [...prev, ...chatData.chats]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deleteChats" });
      await deleteUserChats();
      toast.success("Deleted chats", { id: "deleteChats" })
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed")

    }
  }

  useLayoutEffect(() => {
    try {
      if (auth?.isLoggedIn && auth?.user) {
        toast.loading("Loading Chats", { id: "loadchats" })
        getUserChats().then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded Chats", { id: "loadchats" })
        })
      }
    } catch (error) {
      console.log(error);
      toast.error("Loading of chats Failed", { id: "loadchats" })
    }

  }, [auth])

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/chat");
    }
  }, [auth]);

  return (
    <Box sx={{
      display: 'flex', flex: 1, width: "100%", height: "100%",
      mt: 3, gap: 3
    }}>
      <Box sx={{ display: { md: 'flex', xs: 'none', sm: 'none' }, flex: 0.2, flexDirection: "column" }}>
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
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}>
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1][0]}
          </ Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "Poppins" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "Poppins", my: 4, p: 3 }}> You can ask some questions related to Knowledge, Business, Advices, Education etc. But avoid sharing personal info.
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px", my: "auto", color: "white", fontWeight: "700", borderRadius: 3, mx: "auto", bgcolor: red[400],
              ":hover": {
                bgcolor: red.A700,

              }
            }}>
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flex: { md: .8, xs: 1, sm: 1 }, flexDirection: "column", px: 3 }}>
        <Typography sx={{ textAlign: 'center', fontSize: "40px", color: "white", mb: 2, mx: "auto" }}>
          Model - GPT 3.5
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: "scroll", overflowX: "hidden", overflowY: "auto", scrollBehavior: "smooth" }}>
          {chatMessages.map((chat, index) =>
            //@ts-ignore
            (
            <ChatItem content={chat.content} role={chat.role} key={index} />))}
        </Box>
        <div style={{ width: '100%', padding: '20px', borderRadius: 8, backgroundColor: 'rgb(17, 27, 39)', display: 'flex', margin: 'auto' }}>
          <input
            ref={inputRef}
            type='text'
            style={{ width: 'calc(100% - 40px)', backgroundColor: 'transparent', padding: '10px', border: 'none', outline: 'none', color: 'white', fontSize: '20px' }}
            placeholder="Type your message here..."
          />
          <IconButton onClick={handleSubmit} sx={{ color: 'white' }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  )
}

export default Chat
