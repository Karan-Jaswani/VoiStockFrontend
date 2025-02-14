import React, { createContext, useContext, useState, ReactNode } from "react";

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
    setUserProfileUrl: (url: string | null) => void; // Corrected property name
}

// Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Check if auth token is available in sessionStorage
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!sessionStorage.getItem("authToken")
    );
    // Get user details from sessionStorage
    const [userEmail, setUserEmail] = useState(sessionStorage.getItem("userEmail"));
    const [userName, setUserName] = useState(sessionStorage.getItem("userName"));
    const [userToken, setUserToken] = useState(sessionStorage.getItem("authToken"));
    const [userState, setUserState] = useState(sessionStorage.getItem("userState"));
    const [userPhonenum, setUserPhonenum] = useState(sessionStorage.getItem("userPhonenum"));
    const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
    const [userFirstName, setUserFirstName] = useState(sessionStorage.getItem("userFirstName"));
    const [userProfileUrl, setUserProfileUrl] = useState(sessionStorage.getItem("userProfileUrl"));
    const API_URL = process.env.REACT_APP_VOISTOCK_API_URL;

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.status === 200) {
                const data = await response.json();
                sessionStorage.setItem("authToken", data.token); // Save the token to sessionStorage
                sessionStorage.setItem("userEmail", data.email); // Save the email to sessionStorage
                sessionStorage.setItem("userName", data.username);  // Save the username to sessionStorage
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
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userEmail"); // Remove email from sessionStorage on logout
        setIsAuthenticated(false);
        setUserEmail(null); // Reset email state
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
            setUserProfileUrl // Corrected property name
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