import React, { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import useCustomForm from "../../hooks/useCustomForm";
import { Link } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const { loginUser, isServerError } = useContext(AuthContext);
  const defaultValues = { username: "", password: "" };
  const [formData, handleInputChange, handleSubmit, reset] = useCustomForm(
    defaultValues,
    loginUser
  );

  useEffect(() => {
    if (isServerError) {
      reset();
    }
  }, [isServerError]);

  return (
    <div className="login-container">

<img src="/uploadpictures/GreenThumbLogo.png" alt="Background" className="login-img" />
     
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Username:{" "}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>
          <label className="form-label">
            Password:{" "}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          {isServerError ? (
            <p className="error">Login failed, incorrect credentials!</p>
          ) : null}
          <button className="submit-button">Login!</button>
                <Link to="/register" className="form-link">
          Click to register!
        </Link>
        </form>
       
      </div>
     
    </div>
  );
};

export default LoginPage;