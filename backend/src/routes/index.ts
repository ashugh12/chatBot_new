import { Router } from "express";
import userRoutes from "./user-routes.js"
import chatRoutes from "./chat-routes.js";
const appRouter = Router();

console.log("We are in the index.ts file");

appRouter.use("/user", userRoutes); //domain/api/v1/user --->  userRoutes called
appRouter.use("/chat", chatRoutes); // domain/api/v1/chats --> chatRoutes called



export default appRouter;
