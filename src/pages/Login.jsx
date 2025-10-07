import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// The URL for the backend server
const API_BASE_URL = 'http://localhost:3001'; 

const Login = () => {
    // useNavigate hook to redirect the user
    const navigate = useNavigate();

    // State to hold log in data
    const [logInData, setLogInData] = useState({
        email: '',
        password: ''
    });

    // state to handle errors
    const [error, setError] = useState(null);
    // state to handle loading
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to update the state, if any changes happen
    const handleChange = (e) => {
        setLogInData({
            ...logInData, // keep existing data
            [e.target.name]: e.target.value 
        });
        // clear any preveous error if user starts typing
        setError(null);
    }

    // Placeholder for submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true); // start loading

        try {
            // Post request to backend log in route
            const response = await axios.post(`${API_BASE_URL}/login`, logInData);

            // Check the response
            if (response.status === 201 && response.data.token) {
                // store the jwt token securely in local storage
                localStorage.setItem('authToken', response.data.token);

                // Navigate the user to the dashboard route
                navigate('/')
            }

        } catch (error) {
            // Handle error from the backend
            if (error.response && error.response.data) {
                // Display the specific error from the backend server
                setError(error.response.data.message || error.response.data);
            } else {
                // handle other unexpleected Newprk or 
                setError('Login Failed, Please try again after some time.')
            }
        } finally {
            // Stop reccoring either login sucess or failed.
            setIsLoading(false);
        }
    }

    return (
        // Outer Container
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* Form Card */}
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">

                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    User Login
                </h2>

                {/* Display Error Message if State has one */}
                {error && (
                    <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </p>
                )}

                {/* Form Structure */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email Input Group  */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={logInData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter Your Registered Email"
                        />
                    </div>
                    {/* Password Input Group */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            value={logInData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter Password"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full flex justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out cursor-pointer"
                    >
                        {/* Display Loading text if in progress */}
                        {isLoading? 'Signing In' : 'Sign In'}
                    </button>
                </form>

                {/* Register Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?
                    <Link to='/register' className="font-medium text-indigo-600 hover:underline hover:text-indigo-500 ml-1">
                        Create One
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login;