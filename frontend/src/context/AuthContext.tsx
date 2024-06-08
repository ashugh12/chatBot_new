import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { checkAuthStatus, loginUser, logoutUser, signupUser } from "../helpers/api-communicator";



type User = {
    name: string;
    email: string;
}


type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}


const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    try {
        const [user, setUser] = useState<User | null>(null)
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        console.log("We are in authprovider");

        useEffect(() => {
            //fetch if the user's cookies are valid then skip login
            async function checkStatus() {
                console.log("In checkStatus()");

                const data = await checkAuthStatus();
                // console.log(data)
                // console.log(data.email, data.name);
                if (data) {
                    setUser({ email: data.email, name: data.name });
                    setIsLoggedIn(true);
                    
                }
            }
            checkStatus();
        }, []);

        const login = async (email: string, password: string) => {
            console.log("Before loginUser() in AuthContext auth provider");
            
            const data = await loginUser(email, password);
            console.log("after loginUser() in AuthContext auth provider");
            console.log(email, password)
            if (data) {
                setUser({ email: data.email, name: data.name });
                setIsLoggedIn(true);
            }
        }
        const signup = async (name: string, email: string, password: string) => {
            console.log("Before signupUser() in AuthContext auth provider");


            const data = await signupUser(name, email, password);
            if (data) {
                setUser({ email: data.email, name: data.name });
                setIsLoggedIn(true)
            }
        }
        const logout = async () => {
            console.log("Before logoutUser() in AuthContext auth provider");
            
            await logoutUser();
            setIsLoggedIn(false);
            setUser(null);
            window.location.reload();
        }

        const value = {
            user,
            isLoggedIn,
            login,
            logout,
            signup
        };
        return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>)
    }
    catch (error) { console.log(error) }
}

export const useAuth = () => useContext(AuthContext);
