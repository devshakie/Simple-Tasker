
import { Link } from "react-router-dom"; 
import "./styles.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Simple Tasker
        </Link>
      </div>

      <ul className="navbar-links">
        
        
        <li>
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
