import { motion } from 'framer-motion'; // Import motion from framer-motion
import React, { useState } from 'react';
import App from "../../App"; // Import App to navigate to it
import Signup from "../signup/signup";
import './login.css'; // Make sure you have the appropriate CSS for the notification

function Login() {
    // State for managing form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [navigate, setNavigate] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "", redirect: "" }); // Notification state

    // Navigation handling function
    const handelnavigate = (parameter) => {
        setNavigate(parameter);
    };

    // Function to show notification
    const showNotification = (message, type, redirect = "") => {
        setNotification({ message, type, redirect });
    };

    // Function to handle OK click on notification
    const handleOkClick = () => {
        if (notification.redirect) {
            handelnavigate(notification.redirect); // Redirect if success
        }
        setNotification({ message: "", type: "", redirect: "" }); // Clear notification
    };

    // Redirect logic
    if (navigate === "homepage") {
        return <App />;
    }
    if (navigate === "Signup") {
        return <Signup />;
    }

    // Form submit handling function
    const handelsubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4000/login/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                showNotification("Login successful! Click OK to proceed.", "success", "homepage"); // Show success notification
                setEmail(""); // Clear email input
                setPassword(""); // Clear password input
            } else {
                showNotification("Invalid credentials. Please try again.", "error"); // Show error notification
            }
        } catch (err) {
            showNotification("Error occurred during login. Please try again.", "error"); // Error notification for network failure
        }
    };

    return (
        <div className="parent">
            <motion.div 
                initial={{ opacity: 0 }} // Initial opacity
                animate={{ opacity: 1 }} // Animate to full opacity
                exit={{ opacity: 0 }} // Fade out on exit
                transition={{ duration: 0.5 }} // Duration of the animation
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '30px' }}
            >
                {/* Notification bar */}
                {notification.message && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                        <button onClick={handleOkClick} className="ok-button">OK</button>
                    </div>
                )}

                <h1 id='heading'  style={{background: "-webkit-linear-gradient(16deg, #4b90ff, #ff5546)"}}>Login to AetherAI</h1>
                <form onSubmit={handelsubmit} id='form'>
                    <div>
                        <input
                            className='inputs'
                            type="email"
                            name="email"
                            placeholder="Enter email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className='inputs'
                            type="password"
                            name="password"
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <p id='paragraph'>
                        Don't have an account? 
                        <span 
                            style={{ textDecoration: "underline", cursor: "pointer" }} 
                            onClick={() => { handelnavigate("Signup") }}
                        >
                            Signup
                        </span>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}

export default Login;
