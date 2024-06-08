import { Box, Button, Typography } from "@mui/material"
import CustomizedInput from "../components/shared/CustomizedInput"

import {IoIosLogIn} from 'react-icons/io'

import  {toast} from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


const Login = () => {
  console.log("We are in Login()");

  const Navigate = useNavigate();

  const auth = useAuth();
  const handleSubmit =async(e: React.FormEvent<HTMLFormElement>)=> {
    console.log("We are in handleSubmit of Login");

  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log(email, password);

  console.log(auth?.isLoggedIn);  
  try{
    toast.loading("Signing In!", {id:"login"})
    await auth?.login(email, password);
    toast.success("Signed In Successfully", {id:'login'})
    
  } catch(error){
    toast.error("Signing In failed", {id:"login"})
    console.log(error);
  }
};
  useEffect(()=>{
    console.log("We are in useEffect() of Login()");

    if(auth?.user){
      return Navigate("/chat")
    }
  }, [auth])
  return (
    <Box width={"100%"} height={"100%"} display="flex" >
      <Box padding={8} mt={8} display={{md:"flex", sm:"none", xs:"none"}}>
        <img src="airobot.png" alt="Robot" style={{width:"100%", height:"600px"}} />
      </Box>
      <Box  width={"280px"} display={"flex"} flex={{xs:1, md: 0.5}} justifyContent={"center"} alignItems={"center"} padding={30} ml={"auto"} mt={1}>
        <form 
        onSubmit={handleSubmit}
        style={{margin: "auto",
          padding: "30px",
          boxShadow: "10px 10px 20px #000",
          borderRadius:"10px",
          border:"10px",
        }}>
          <Box sx={{display:'flex', flexDirection: "column", justifyContent:"center"}}>
            <Typography variant="h4" textAlign="center" padding={2}
            fontWeight={600} fontSize={30} >Login</Typography>
            <CustomizedInput type="email" name="email" label="Email"/>
            <CustomizedInput type="password" name="password" label="Password"/>
            <Button type="submit" sx={{px:2, py:1, mt:2, width:'100%', borderRadius:2, bgcolor: "white",
            ":hover":{bgcolor:"gray", color:"white", fontWeight:600},
            color:"black", fontWeight:600
            }} endIcon={<IoIosLogIn />}>Login</Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default Login
