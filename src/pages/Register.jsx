import React, {useState} from "react";

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
        <div style={{padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px'}}>
            <h2>Register User</h2>
            {/* Display error message if state has one */}
            {error && <p style={{color: 'red', border: '1px solid red', padding: '10px'}}>{error}</p>}
            
            {/* Form structure */}
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="name" style={{display: 'block', marginBottom: '5px'}}>Name</label>
                    <input 
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <div style={{marginBottom: '15px'}}>
                    <label htmlFor="email" style={{display: 'block', marginBottom: '5px'}}>Email</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <div style={{marginBottom: '20px'}}>
                    <label htmlFor="password" style={{display: 'block', marginBottom: '5px'}}>Password</label>
                    <input 
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <button type="submit" style={{width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                    Register
                </button>
            </form>
        </div>
    )
}

export default Register;