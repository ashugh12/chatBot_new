import axios from "axios";


export const loginUser = async (email: string, password: string) => {
    const res = await axios.post("/user/login", { email, password });
    console.log(res.status);
    
    if (res.status !== 201) {
        throw new Error("Unable to login");
    }
    const data = await res.data;
    console.log(data+"This is of loginUser")
    return data
}
export const signupUser = async (name: string, email: string, password: string) => {
    const res = await axios.post("/user/signup", { name, email, password });

    if (res.status !== 201) {
        throw new Error("Unable to Sign Up");
    }
    const data = await res.data;
    console.log(data)
    return data
}

export const checkAuthStatus = async () => {
    console.log("We are in checkAuthStatus");

    const res = await axios.get("/user/auth-status");
    if (res.status !== 200) {
        throw new Error("Unable to authenticate");
    }
    const data = await res.data;
    console.log(data+"This is of check Auth status")
    return data;
}
export const sendChatRequest = async (message: string) => {
    console.log("This is send chat request");

    const res = await axios.post("/chat/new", {message});
    if (res.status >= 200 && res.status < 300) {
            throw new Error("Unable to send chat");
        }
        const data = await res.data;
        console.log(data+"This is send chat request");
        return data;
}
export const getUserChats = async () => {
    const res = await axios.get("/chat/all-chat");
    if (res.status !== 200) {
        throw new Error("Unable to get chat");
    }
    const data = await res.data;
    console.log(data+"getUserChats()")

    return data;
}
export const deleteUserChats = async () => {
    const res = await axios.delete("/chat/delete");
    if (res.status !== 200) {
        throw new Error("Unable to delete chat");
    }
    const data = await res.data;
    console.log(data + " deleteUserChats")

    return data;
}
export const logoutUser = async () => {
    const res = await axios.get("/user/logout");
    if (res.status !== 200) {
        throw new Error("Unable to logout");
    }
    const data = await res.data;
    console.log(data)

    return data;
}
