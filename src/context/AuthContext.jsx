import React, { useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const restoreSession = async () => {
        const storedToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedRefreshToken && storedUser) {
        try {
            const filter = btoa(JSON.stringify({ Skip: 0, Limit: 1, Types: [1] }));
            await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Materials/GetAll/?filter=${filter}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
            });
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setRefreshToken(storedRefreshToken);
        } catch (error) {
            console.error('Token validation error:', error);
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
            logout();
            }
        }
        }
        setIsLoading(false);
    };

    restoreSession();
    }, []);

    const login = async (username, password) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/AdminAccount/Login`, {
        UserName: username,
        Password: password
        });
        if (response.data.Success) {
        setUser(response.data.User);
        setToken(response.data.Token);
        setRefreshToken(response.data.RefreshToken);
        localStorage.setItem('accessToken', response.data.Token);
        localStorage.setItem('refreshToken', response.data.RefreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.User));
        return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
    };

    const refreshAccessToken = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Account/RefreshToken`, {
        AccessToken: token,
        RefreshToken: refreshToken
        });
        if (response.data.Success) {
        setToken(response.data.Token);
        setRefreshToken(response.data.RefreshToken);
        setUser(response.data.User);
        localStorage.setItem('accessToken', response.data.Token);
        localStorage.setItem('refreshToken', response.data.RefreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.User));
        return true;
        }
        return false;
    } catch (error) {
        console.error('Refresh token error:', error);
        return false;
    }
    };

    const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    };

    return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshAccessToken }}>
        {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-gray-600">Loading...</p>
        </div>
        ) : (
        children
        )}
    </AuthContext.Provider>
    );
};