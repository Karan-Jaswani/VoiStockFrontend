import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the shape of the context value
interface AuthContextType {
    isAuthenticated: boolean;
    userEmail: string | null;
    userName: string | null;
    userToken: string | null;
    userPhonenum: string | null;
    userState: string | null;
    userId: string | null;
    userFirstName: string | null;
    userProfileUrl: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUserProfileUrl: (url: string | null) => void;
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!sessionStorage.getItem("authToken"));
    const [userEmail, setUserEmail] = useState<string | null>(sessionStorage.getItem("userEmail"));
    const [userName, setUserName] = useState<string | null>(sessionStorage.getItem("userName"));
    const [userToken, setUserToken] = useState<string | null>(sessionStorage.getItem("authToken"));
    const [userState, setUserState] = useState<string | null>(sessionStorage.getItem("userState"));
    const [userPhonenum, setUserPhonenum] = useState<string | null>(sessionStorage.getItem("userPhonenum"));
    const [userId, setUserId] = useState<string | null>(sessionStorage.getItem("userId"));
    const [userFirstName, setUserFirstName] = useState<string | null>(sessionStorage.getItem("userFirstName"));
    const [userProfileUrl, setUserProfileUrl] = useState<string | null>(sessionStorage.getItem("userProfileUrl"));
    
    const API_URL = process.env.REACT_APP_VOISTOCK_API_URL;

    // Sync state with sessionStorage across tabs
    useEffect(() => {
        const syncAuthState = () => {
            setIsAuthenticated(!!sessionStorage.getItem("authToken"));
            setUserEmail(sessionStorage.getItem("userEmail"));
            setUserName(sessionStorage.getItem("userName"));
            setUserToken(sessionStorage.getItem("authToken"));
            setUserState(sessionStorage.getItem("userState"));
            setUserPhonenum(sessionStorage.getItem("userPhonenum"));
            setUserId(sessionStorage.getItem("userId"));
            setUserFirstName(sessionStorage.getItem("userFirstName"));
            setUserProfileUrl(sessionStorage.getItem("userProfileUrl"));
        };

        window.addEventListener("storage", syncAuthState);
        return () => window.removeEventListener("storage", syncAuthState);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.status === 200) {
                const data = await response.json();
                sessionStorage.setItem("authToken", data.token);
                sessionStorage.setItem("userEmail", data.email);
                sessionStorage.setItem("userName", data.username);
                sessionStorage.setItem("userPhonenum", data.phonenum);
                sessionStorage.setItem("userState", data.state);
                sessionStorage.setItem("userId", data.userid);
                sessionStorage.setItem("userFirstName", data.name);
                sessionStorage.setItem("userProfileUrl", data.profileurl);

                setIsAuthenticated(true);
                setUserEmail(data.email);
                setUserId(data.userid);
                setUserPhonenum(data.phonenum);
                setUserState(data.state);
                setUserName(data.username);
                setUserToken(data.token);
                setUserProfileUrl(data.profileurl);
                setUserFirstName(data.name);

                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Login Error:", error);
            return false;
        }
    };

    const logout = () => {
        sessionStorage.clear(); // Clears all session storage data
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserName(null);
        setUserId(null);
        setUserToken(null);
        setUserPhonenum(null);
        setUserState(null);
        setUserFirstName(null);
        setUserProfileUrl(null);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userEmail,
            login,
            logout,
            userName,
            userToken,
            userPhonenum,
            userState,
            userId,
            userFirstName,
            userProfileUrl,
            setUserProfileUrl
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
