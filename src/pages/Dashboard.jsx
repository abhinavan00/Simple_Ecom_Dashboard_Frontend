import React, {useState, useEffect} from "react";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the Necessary components from chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

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

    // --- CHART DATA AND OPTIONS ---
    const chartData = {
        // We only have one data point (Last 7 days) for MVP
        labels: ['Last 7 Days'],
        datasets: [
            {
                label: 'Total Sales (USD)',
                data: [metrics.TotalSales],
                backgroundColor: 'rgba(79, 70, 229, 0.6)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
                yAxisID: 'y' // Primary axis
            },
            {
                label: 'Total Ad Spend (USD',
                data: [metrics.TotalAdSpend],
                backgroundColor: 'rgba(236, 72, 153, 0.6)',
                borderColor: 'rgba(236, 72, 153, 1)',
                borderWidth: 1,
                yAxisID: 'y'
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart container to define the size
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales vs. Ad Spend Comparison',
                font: {
                    size: 16
                }
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Amount (USD)'
                },
                beginAtZero: true,
            },
            x: {
                grid: {
                    display: false,
                },
            }
        },
    };

    // --- ROAS Chart Data & Options (Horizontal Bar Meter) ---
    const roasValue = metrics.TotalAdSpend > 0 ? metrics.ROAS : 0 ;
    const roasTarget = 4.0; // A good business ROAS Target to visualize against

    const roasChartData = {
        labels: ['ROAS'],
        datasets: [
            {
                label: 'ROAS Achieved',
                data: [roasValue],
                backgroundColor: roasValue >= roasTarget ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)', // Green or Red based on performance
                borderColor: roasValue >= roasTarget ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                borderWidth: 1,
                // Custom bar thickness to make it look like a meter
                barThickness: 30,
            },
        ],
    };

    const roasChartOptions = {
        indexAxis: 'y', // Make it a horizontal bar
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `ROAS Performance (Target: ${roasTarget.toFixed(2)}:1)`,
                font: {
                    size: 16
                }
            },
        },
        scales: {
            x: {
                min: 0,
                max: roasTarget * 2, // Set max scale to double the target for context
                title: {
                    display: true,
                    text: 'Return on Ad Spend (ROAS)',
                },
                grid: {
                    display: true,
                },
                // Add a line for the Target Goal
                ticks: {
                    callback: function(value, index, values) {
                        return value === roasTarget ? 'Target' : value;
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                },
            }
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            {/* HEADER STRUCTURE */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4">
                {/* Title and Time Period */}
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">E-commerce Dashboard</h1>
                    <div className="text-lg text-gray-600 font-medium">
                        Metrics For: <span className="text-indigo-600">{metrics.TimePeriod}</span>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="mt-4 md:mt-0 w-full md:w-auto">
                    <button
                        onClick={() => {
                            localStorage.removeItem('authToken');
                            navigate('/login');
                        }}
                        className="w-full md:w-40 py-3 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Dashboard Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">

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

            </div>

            {/* Chart Visualization Section */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Side: Sales vs. Spend Chart (Bar) */}
                <div className="bg-white p-6 rounded-xl shadow-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Sales vs. Ad Spend</h3>
                    <div className="h-96">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Right Side: ROAS Visualization (Meter) */}
                <div className="bg-white p-6 rounded-xl shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">ROAS Goal Tracker</h3>
                        <div className="h-96 flex items-center justify-center">
                            {/* Display the ROAS value prominently */}
                            <div className="text-center w-full">
                                <p className="text-6xl font-extrabold" style={{ color: roasValue >= roasTarget ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)' }}>
                                    {roasValue.toFixed(2)}:1
                                </p>
                                <p className="text-gray-500 mt-2">Achieved ROAS (Target: {roasTarget.toFixed(2)}:1)</p>
                                
                                {/* ROAS Meter Chart (Optional - a visual enhancement) */}
                                <div className="mt-8 mx-auto w-3/4">
                                    <Bar data={roasChartData} options={roasChartOptions} />
                                </div>
                            </div>
                        </div>
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