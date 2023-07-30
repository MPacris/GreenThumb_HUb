import React from "react";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./NavBar.css";

const Navbar = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="navBar">
      <ul>     
        <Link to="/" >
        <img src="/uploadpictures/GreenThumbLogo.png" alt="GreenThumb Hub" className="logo" />
          </Link>
        
        <li>
          <Link to="/gardens" style={{ fontSize: "1em", textDecoration: "none", color: "white",textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
            Gardens Page
          </Link>
        </li>
  
        <li>
          <Link to="/plants" style={{ fontSize: "1em", textDecoration: "none", color: "white",textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
            Plants List
          </Link>
        </li>
        <li>
          <Link to="/tasks" style={{ fontSize: "1em", textDecoration: "none", color: "white",textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
            My Tasks
          </Link>
        </li>
        <li>
          <Link to="/harvests" style={{ fontSize: "1em", textDecoration: "none", color: "white",textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
            Harvest Tracker
          </Link>
        </li>
 
        <li>
          <Link to="/weather-page" style={{ fontSize: "1em", textDecoration: "none", color: "white",textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>
            Weather 
          </Link>
        </li>

        <li>
          {user ? (
            <button onClick={logoutUser}>Logout</button>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;