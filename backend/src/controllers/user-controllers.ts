import { NextFunction, Request, Response } from "express";
import User from "../models/User.js"
import { compare, hash } from "bcrypt"
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // get all users
    try {
        const users = await User.find();
        return res.status(200).json({ message: "OK", users })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ message: "Error", cause: error.message })
    }
}

export const userSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // user sign up
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(401).send('User already exist')
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword })
        await user.save();

        //create token and store cookie
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        })


        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true, })

        return res.status(201).json({ message: "OK", name: user.name, email: user.email })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ message: "Error", cause: error.message })
    }
}

export const userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("We are in userLogin of User-controllers");

    // user login  

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        console.log(user.email);
        if (!user) {
            return res.status(401).send("User is not registered")
        }
        const isPasswordCorrect = await compare(password, user.password)
        if (!isPasswordCorrect) { return res.status(403).send("Incorrect Password") }

        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true,
        })


        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: "/", domain: "localhost", expires, httpOnly: true, signed: true, })


        return res.status(201).json({ message: "OK", name: user.name, email: user.email })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ message: "Error", cause: error.message })
    }
}

export const userLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    console.log("We are in userLogout of user-controllers");

    try {
        const user = await User.findById(res.locals.jwtData.id)
        // console.log(user);
        if (!user) {
            return res.status(401).send("User is not registered or Token malfunctioned.")
        }
        // console.log(user._id.toString(), res.locals.jwtData.id)
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permission did'nt match")
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/"       
        })
        return res.status(200).json({ message: "OK", name: user.name, email: user.email })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ message: "Error", cause: error.message })
    }
}

export const verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("We are in VerifyUser of user-controllers");

    // user verification  

    try {
        const user = await User.findById(res.locals.jwtData.id)
        console.log(user);
        if (!user) {
            return res.status(401).send("User is not registered or Token malfunctioned.")
        }
        console.log(user._id.toString(), res.locals.jwtData.id)
        if(user._id.toString() !== res.locals.jwtData.id){
            return res.status(401).send("Permission did'nt match")
        }
        
        return res.status(200).json({ message: "OK", name: user.name, email: user.email })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ message: "Error", cause: error.message })
    }
}
