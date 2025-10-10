import { useState, useEffect } from "react";
import axios from "axios";

// Get the Base URL from Enviroment Variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
 
export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async() => {
            try{
                const response = await axios.get(`${API_BASE_URL}/check-auth`, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                    // The Backend sends back the userId if authentication succeeds
                    setUserId(response.data.userId);
                }
            } catch (err) {
                // If backend returns 401 or 403 on failure
                console.error('Authentication Check Failed:', err.response?.status);
                setIsAuthenticated(false);
                setUserId(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Return the states for use in other components
    return {isAuthenticated, isLoading, userId};
}