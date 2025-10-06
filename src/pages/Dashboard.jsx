import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Backend server URL
const API_BASE_URL = 'http://localhost:3001';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // function to fetch the protected data
    const fetchDashboardData = async () => {
        // get auth token from local storage
        const token = localStorage.getItem('authToken');

        // check if token exist
        if (!token) {
            console.error('No authentication code found, Redirecting to Log In!');
            navigate('/login');
            return;
        }

        try {
            // Make authenticated request to /dashboard route
            const response = await axios.get(`${API_BASE_URL}`, {
                headers: {
                    // Send JWT as a Bearer Token to Autherization Header
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Store the fetch data
            setDashboardData(response.data.dashBoardMetrics);

        } catch (error) {
            // handle errors
            console.error('Error Fetching Dashboard Data:', error);

            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // if token is invalid, clear it and redirect to /login
                localStorage.removeItem('authToken');
                setError('Session is expired or invalid, Please log in again.');
                navigate('/login');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch Data')
            }
        } finally {
            setLoading(false);
        }
    };

    // Run only once on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // --- RENDERING LOGIC ---
    if (loading) {
        return <div className="min-h-screen flex items-center justify center bg-gray-100 text-lg">Loading Dashboard Data...</div>
    }

    if (error) {
        // if Error display a button to retry or navigate
        return (
            <div className="min-h-scree flex flex-col items-center justify-center bg-red-50 p-6">
                <p className="text-xl font-semibold text-red-800 mb-4">{error}</p>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                >
                    Retry Fetching Data
                </button>
            </div>
        );
    }

    // Default Data structure if API returns null or 0s (for preveting system from crash)
    const metrics = dashboardData || {
        TimePeriod: "N/A",
        TotalSales: 0,
        TotalAdSpend: 0,
        ROAS: 0,
    };

    // helper function for currency
    const formatCurrency = (value) => {`$${Number(value).toFixed(2)}`}
    const formatRoas = (value) => Number(value).toFixed(2);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">E-commerce Dashboard</h1>

            <div className="mb-6 text-lg text-gray-600 font-medium">
                Metrics For: <span className="text-indigo-600">{metrics.TimePeriod}</span>
            </div>

            {/* Dashboard Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: Total Sales */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                    <p className="text-sm font-medium text-gray-500">Total Sales Shopify</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(metrics.TotalSales)}</p>
                </div>

                {/* Card 2: Total Ad Spend */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-pink-500">
                    <p className="text-sm font-medium text-gray-500">Total Ad Spend (Meta & Google)</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(metrics.TotalAdSpend)}</p>
                </div>

                {/* Card 3: ROAS */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <p className="text-sm font-medium text-gray-500">ROAS (Return on Ad Spend)</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                        {metrics.TotalAdSpend > 0 ? formatRoas(metrics.ROAS) : "N/A"}
                    </p>
                </div>

                {/* Card 4: Log Out Button */}
                <div className="bg-gray-100 p-6 rounded-xl shadow-lg flex items-center justify-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem('authToken');
                            navigate('/login');
                        }}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

            </div>

            {/* Display API message if Available */}
            {dashboardData && dashboardData.message && (
                <div className="mt-8 p-4 bg-blue-100 text-blue-800 rounded-lg">
                    <p className="text-sm">{dashboardData.message}</p>
                </div>
            )}
        </div>
    )
}

export default Dashboard;