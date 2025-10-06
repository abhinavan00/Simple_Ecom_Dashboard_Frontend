import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Backend server URL
const API_BASE_URL = 'http://localhost:3001';
const Register = () => {
    // state to hold the form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // state to handle potential errors
    const [error, setError] = useState(null);

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
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default browser form submission
        console.log('Register attemped with', formData);
        // Logic to call API will go here
    }

    return (
        // Outer Container
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

            {/* Form Card */}
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">

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
                    <button 
                        type="submit" 
                        className="w-full flex justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out" 
                    >
                        Register
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?
                    <Link to='/login' className="font-medium text-indigo-600 hover:underline hover:text-indigo-500 ml-1">
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Register;