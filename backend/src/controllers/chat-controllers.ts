import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configureOpenAI } from "../config/openai-config.js";

interface Chat{
    role: string;
    content: string;
}


export const generateChatCompletion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { message } = req.body;
    console.log("We are in generateChatCompletion()");

    try {
        const user = await User.findById(res.locals.jwtData.id);
        console.log(user)
        if (!user) {
          return res
            .status(401)
            .json({ message: "User not registered OR Token malfunctioned" });
        }
    
        // Grab chats of user and ensure proper structure
        const chats: Chat[] = user.chats.map(({ role, content }: Chat) => ({
          role,
          content,
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
    
        // Send all chats with the new one to OpenAI/Google Generative AI API
        const googleai = new GoogleGenerativeAI(process.env.GOOGLE_AI_SECRET);

        const model= googleai.getGenerativeModel({
            model: "gemini-1.5-flash"
        })

        
        // Assuming the correct structure expected by Google Generative AI API
        const chatResponse = await model.generateContent("Google");
    
        const result = chatResponse.response.text(); // Adjust based on actual response structure
        console.log(result);
        user.chats.push({ content: result, role: "assistant" });
        await user.save();
        console.log(user.chats+"This is result")
    
        return res.status(200).json({ chats: user.chats });   
     } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      return res.status(500).send({error:error.message})
    }
  };






export const sendChatsToUser = async(
    req:Request, res: Response, next: NextFunction
) =>{
    const { message } = req.body
    try {
        const user = await User.findById(res.locals.jwtData.id);
        console.log(user);
    if(!user){
        return res.status(401).json({message: "User not registered Or Token malfunctioned."})
    }
    if(user._id.toString() !== res.locals.jwtData.id){
        return res.status(401).send("Permission did'nt match");
    }
        return res.status(200).json({chats: user.chats})
        // get latest response
    } catch (error) {
        console.log("");
        return res.status(500).json({message: "Unable to send chat to user"});
    }
        // get latest response

}
export const deleteChats = async(
    req:Request, res: Response, next: NextFunction
) =>{
    const { message } = req.body
    try {
        const user = await User.findById(res.locals.jwtData.id);
    if(!user){
        return res.status(401).json({message: "User not registered Or Token malfunctioned."})
    }
    if(user._id.toString() !== res.locals.jwtData.id){
        return res.status(401).send("Permission did'nt match");
    }
    // @ts-ignore
    user.chats=[];
    await user.save();
        return res.status(200).json({message: "OK"})
        // get latest response
    } catch (error) {
        console.log("");
        return res.status(500).json({message: "Unable to delete"});
    }
        // get latest response

}
