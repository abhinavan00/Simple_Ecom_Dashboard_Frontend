import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * A component that wraps routes that should only be accessible to authenticated users.
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The component to render if authenticated (e.g., <Dashboard />).
 */

const ProtectedRoute = ({children}) => {
    // Get the Authentication status from our hook
    const { isAuthenticated, isLoading } = useAuth(); 

    // While Authentication status is being checked
    if(isLoading) {
        return <div className="flex justify-center items-center h-screen text-xl">Loading Authentication...</div>
    }

    // If Authentication Failed
    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }

    // If check is completed and user is authenticated
    return children;
}

export default ProtectedRoute;