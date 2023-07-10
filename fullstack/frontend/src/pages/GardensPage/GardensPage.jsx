import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './GardensPage.css'

const GardensPage = () => {
  const [user, token] = useAuth();
  const [gardens, setGardens] = useState([]);
  const [username, setUsername] = useState("");
  const [gardenId, setGardenId] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        const response = await axios.get("http://18.117.255.133/api/user_gardens", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setGardens(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    fetchGardens();
  }, [token]);

  useEffect(() => {
    if (user) {
      setUsername("");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://18.117.255.133/api/user_gardens",
        {
          username,
          garden_id: gardenId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log(response.data);
      setSubmissionStatus("Gardener Added!!!");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          {user && (
            <h1 className="welcome-message">Welcome Back, {user.username}!</h1>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="garden-list">
            <Link to="/add-garden" className="add-garden-link">
              <p className="add-garden-text">Click Here to Add a New Garden</p>
            </Link>
            <div className="section-title">Your Gardens</div>
            {gardens.map((garden) => (
              <Link
                to={`/garden-details/${garden.id}`}
                key={garden.id}
                className="garden-link"
              >
                <p className="garden-item">{garden.name}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="add-gardener-form">
            <div className="section-title">Add a Gardener to a Garden</div>
            <div className="form-group">
              <label element="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label element="gardenId" className="form-label">
                Garden ID:
              </label>
              <select
                id="gardenId"
                name="gardenId"
                value={gardenId}
                onChange={(e) => setGardenId(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select a garden</option>
                {gardens.map((garden) => (
                  <option key={garden.id} value={garden.id}>
                    {garden.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
            {submissionStatus && (
              <p className="submission-status">{submissionStatus}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default GardensPage;