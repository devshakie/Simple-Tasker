import React, { useState } from "react";
import "./styles.css"; 
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        setErrorMessage("Login failed. Please try again.");
        setSuccessMessage("");
        console.log("Login failed:", response.statusText);
      } else {
        const data = await response.json();
        console.log("Login successful.....");
        setSuccessMessage("Login successful! Redirecting to dashboard...");
        setErrorMessage("");

        // Optional: Store token in localStorage or context
        localStorage.setItem("token", data.token);

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
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
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}


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
