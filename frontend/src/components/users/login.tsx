import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; 
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      // navigate("/dashboard"); // Uncomment this if you're using React Router for navigation
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Welcome back!</h2>
        <h4>Enter your credentials to access your account</h4>
        <form onSubmit={handleSubmit}>
            
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
            {/* <div className="options">
            <a href="#" className="forgot-password">Forgot password?</a>
            <input type="checkbox" /> Remember me
          </div>    */}


          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="divider">or</div>

        <p className="signup">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      <div className="login-image">
        <img src="/images/tmloginn.jpg" alt="Login background" />
      </div>
    </div>
  );
};

export default Login;
