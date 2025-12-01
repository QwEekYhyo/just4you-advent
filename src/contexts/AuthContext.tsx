import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { BACKEND_URL } from "@/lib/api";

interface User {
    username: string;
    name: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                // TODO: check token expiration
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await fetch(BACKEND_URL + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const body = await response.json();
                const userData = {
                    name: body.user.name,
                    username: body.user.username,
                    token: body.token,
                };
                setUser(userData);
                setIsLoading(false);
                return true;
            }

            console.error(await response.json());
            setIsLoading(false);
            return false;
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
