import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

// Backend server URL
const API_BASE_URL = 'http://localhost:3001';

const Register = () => {
    // useNavigate to redrict the user
    const navigate = useNavigate();

    // state to hold the form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // state to handle potential errors
    const [error, setError] = useState(null);
    // state to handle loading
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to update state when any input changes
    const handleChange = (e) => {
        setFormData({
            ...formData, // keep existing data
            [e.target.name]: e.target.value //update the specific field
        });
        // clear any preveous error when user starts typing
        setError(null);
    }

    // Placeholder for submission logic
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default browser form submission
        setError(null);
        setIsLoading(true); // start loading
        
        try {
            // Post request to backend /register route
            const response = await axios.post(`${API_BASE_URL}/register`, formData);

            //check the server response
            if (response.status === 201) {
                // Alert the User
                alert('Registeration Successfull!')

                // Navigate the user to the Login Page
                navigate('/login');
            }
        } catch (error) {
            // Handle errors from the backend
            if (error.response && error.response.data) {
                // Display error message from the server
                setError(error.response.data.message || error.response.data);
            } else {
                // Handle Network and other potential errors
                setError('Regirstration Failed! Plase try after sometime.');
            }

        } finally {
            // Stop Loading regardless of success or failure.
            setIsLoading(false); 
        }
    }

    return (
        // Outer Container
        <motion.div 
            className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
            // Initial State
            initial={{opacity: 0, y: 50, scale: 0.9}}
            // Final State
            animate={{opacity: 1, y: 0, scale: 1}}
            // Transition Properties
            transition={{duration: 0.5, ease: 'easeOut'}}
        >

            {/* Form Card */}
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl z-10">

                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Create Your Account
                </h2>

                {/* Display error message if state has one */}
                {error && (
                    <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </p>
                )}
                
                {/* Form structure */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input Group */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1" >
                            Name
                        </label>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your Full Name"
                        />
                    </div>

                    {/* Email Input Group */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" >
                            Email
                        </label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password Input Group */}
                    <div >
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1" >
                            Password
                        </label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Minimum 6 Character"
                        />
                    </div>
                    <motion.button 
                        type="submit" 
                        className="w-full flex justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out cursor-pointer"
                        // Animation on hover
                        whileHover={{y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"}}
                        // Animation on Tap
                        whileTap={{scale: 0.98}}
                        // Transition Properties
                        transition={{duration: 0.2}}
                        disabled={isLoading} // Disable the button while Loading 
                    >
                        {/* Display Loading text if in Progress */}
                        {isLoading? 'Registering...' : 'Register'}
                    </motion.button>
                </form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?
                    <Link to='/login' className="font-medium text-indigo-600 hover:underline hover:text-indigo-500 ml-1">
                        Sign In
                    </Link>
                </p>

            </div>
        </motion.div>
    )
}

export default Register;