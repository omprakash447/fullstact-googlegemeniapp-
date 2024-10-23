// src/Components/Signup/Signup.jsx
import { motion } from 'framer-motion'; // Import motion from framer-motion
import React, { useState } from 'react';
import App from "../../App"; // Import App to navigate to it
import Login from '../login/login';
import './signup.css';

function Signup() {
    // State for managing form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [navigate, setNavigate] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "", redirect: "" }); // Notification state

    // Function to handle navigation
    const handleNavigate = (parameter) => {
        setNavigate(parameter);
    }

    // Function to show notification bar
    const showNotification = (message, type, redirect = "") => {
        setNotification({ message, type, redirect });
    };

    // Function to handle OK click on notification
    const handleOkClick = () => {
        if (notification.redirect) {
            handleNavigate(notification.redirect); // Redirect based on notification state if success
        }
        setNotification({ message: "", type: "", redirect: "" }); // Clear notification for both success and error
    };

    // Conditional rendering based on navigation state
    if (navigate === "homepage") {
        return <App />;
    }
    if (navigate === "loginpage") {
        return <Login />;
    }

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch("http://localhost:4000/gemeni/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password }),
            });
            if (response.ok) {
                showNotification("Signup successful! Click OK to proceed.", "success", "homepage"); // Success notification and redirect
                setName(""); // Clear name input
                setEmail(""); // Clear email input
                setPassword(""); // Clear password input
            } else {
                showNotification("Signup failed. Please try again.", "error"); // Error notification without redirect
                setName("");
                setEmail("");
                setPassword("");
            }
        } catch (err) {
            console.log(err);
            showNotification("Error occurred during signup. Please check your network and try again.", "error"); // Error notification for network failure
        }
    }

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

            <h1 id='heading' style={{background: "-webkit-linear-gradient(16deg, #4b90ff, #ff5546)"}}>Sign Up for AetherAI</h1>
            <form onSubmit={handleSubmit} id='form'> {/* Attach handleSubmit to form's onSubmit */}
                <div>
                    <input
                        className='inputs'
                        type="text"
                        name="name"
                        placeholder="Enter name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Sign Up</button>
                <p id='paragraph'>Already have an account? <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => { handleNavigate("loginpage") }}>Login</span></p>
            </form>
        </motion.div>
        </div>
    );
}

export default Signup;
