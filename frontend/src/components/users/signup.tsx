import React, { useState } from "react";
//import axios from "axios";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [role, setRole] = useState("team_member"); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const response = await axios.post("http://localhost:8000/api/auth/register", {
      //   name, 
      //   email,
      //   password,
        // role,
      // });

      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-type":"application/json"
        },
        body:JSON.stringify({name,email,password,role})
      })

      if (!response.ok) {
        console.log("not okay");
        
      } else {
        console.log(response);
        
      }
      // localStorage.setItem("token", response.data.token);
      setSuccessMessage("Signup successful! Redirecting to dashboard..."); 
      setErrorMessage("");
      setTimeout(() => {
        navigate("/dashboard"); 
      }, 2000); 
    } catch (error) {
      console.error("Signup failed", error);
      setErrorMessage("Signup failed. Please try again.");
      setSuccessMessage(""); 
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Welcome onboard!</h2>
        <h4>Enter your credentials to register</h4>
        <form onSubmit={handleSubmit}>
          <label>Name</label> 
          <input
            type="text"
            placeholder="Enter your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />

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

          {/* Role Selection Dropdown */}
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="team_member">Team Member</option> 
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        {/* Success and Error Messages */}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

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
