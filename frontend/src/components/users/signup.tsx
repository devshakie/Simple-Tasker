import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; 
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");  // Optional: if you want a username field

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/signup", {  // Changed to signup endpoint
        email,
        password,
        username,  // Add username if it's needed for signup
      });
      localStorage.setItem("token", response.data.token);  // Token might be sent after signup
      // navigate("/dashboard"); // Uncomment this if you're using React Router for navigation
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Welcome onboard!</h2>  {/* Fix typo */}
        <h4>Enter your credentials to register</h4>
        <form onSubmit={handleSubmit}>

          {/* Optional username input */}
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // Add username state handling
          />

          <label>Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit" className="signup-button">Sign Up</button>  {/* Updated to say "Sign Up" */}
        </form>

        <div className="divider">or</div>

        <p className="login">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>

      <div className="signup-image">
        <img src="/images/tmloginn.jpg" alt="Signup background" />
      </div>
    </div>
  );
};

export default Signup;
