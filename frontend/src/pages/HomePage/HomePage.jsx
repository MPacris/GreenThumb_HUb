import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [user, token] = useAuth();
  const [gardens, setGardens] = useState([]);
  const [username, setUsername] = useState("");
  const [gardenId, setGardenId] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const navigate = useNavigate();


  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-md-12">
      
            <h1 className="welcome-message">
              Welcome to the GreenThumb Hub !!!!
            </h1>
            <p className="quote">
              Click on the Images to Navigate Through the App
            </p>
      
        </div>

      </div>

      <div className="row">
        <div className="col-3">
          <Link to="/gardens">
            <img
              src="/uploadpictures/insidelook.jpg"
              alt="garden"
              className="homepage-image"
              title="Go to Gardens"
            />
          </Link>
        </div>
        <div className="col-3">
          <Link to="/plants">
            <img
              src="/uploadpictures/flower.jpg"
              alt="plant"
              className="homepage-image"
              title="Go to Plants"
            />
          </Link>
        </div>
        <div className="col-3">
          <Link to="/tasks">
            <img
              src="/uploadpictures/watering.jpg"
              alt="task"
              className="homepage-image"
              title="Go to Tasks"
            />
          </Link>
        </div>
        <div className="col-3">
          <Link to="/harvests">
            <img
              src="/uploadpictures/farmeranddog.jpg"
              alt="harvests"
              className="homepage-image"
              title="Go to Harvests"
            />
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-3">
          <Link to="/weather-page">
            <img
              src="/uploadpictures/outsidelook.jpg"
              alt="weather"
              className="homepage-image"
              title="Go to Weather"
            />
          </Link>
        </div>

        <div className="col-3">
          <Link to="/login">
            <img
              src="/uploadpictures/breesfence.jpg"
              alt="home"
              className="homepage-image"
              title="Go to Login"
            />
          </Link>
        </div>

        <div className="col-6">
          <div className="inspirational-quotes-container">
            <p className="quote">
              "Flowers are the music of the ground. From Earth's lips spoken without sound." - Edwin Curran
            </p>
            <p className="quote">
              "Gardening is the art that uses flowers and plants as paint, and the soil and sky as canvas." - Elizabeth Murray
            </p>
          
            <p className="quote">
              "Life is a garden. Dig it!" - Joe Dirt
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;