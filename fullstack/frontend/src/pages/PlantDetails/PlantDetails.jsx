import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import EditPlantDetails from "../../utils/EditPlantDetails/EditPlantDetails";
import UploadPlantImage from "../../utils/UploadPlantImage/UploadPlantImage";
import TaskHistory from "./../../utils/TaskHistory/TaskHistory";
import HarvestHistory from "../../utils/HarvestHistory/HarvestHistory";
import HarvestTracker from "../../utils/HarvestTracker/HarvestTracker";
import "./PlantDetails.css";

const PlantDetails = () => {
  const { plant_id } = useParams();
  const [plant, setPlant] = useState(null);
  const [user, token] = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    location: "",
  });

  const fetchPlantDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/plants/${plant_id}?include_type=true`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setPlant(response.data);
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchPlantDetails();
  }, [plant_id, token]);

  const handleSave = (data) => {
    setPlant((prevPlant) => ({
      ...prevPlant,
      type: data.type,
      location: data.location,
    }));
    setEditMode(false);
  };

  const handleImageUpload = async () => {
    await fetchPlantDetails();
    navigate(`/garden-details/${plant.garden_id}`);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.type || !formData.location) {
      console.log("Type and location are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/plants",
        {
          type: formData.type,
          location: formData.location,
          garden_id: parseInt(plant.garden_id),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setFormData({
        type: "",
        location: "",
      });
      navigate(`/garden-details/${plant.garden_id}`);
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  if (!plant) {
    return <p>Plant not found</p>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-4">
          <div className="top-row-container">
            <div className="plant-information">
            <h1 className="welcome-message">Plant Information:</h1>
              <div>
                <div>Plant ID: {plant_id}</div>
                <div>Plant Type: {plant.type}</div>
                <div>Plant Location: {plant.location}</div>

                {editMode ? (
                  <div className="edit-plant-details-container">
                    <EditPlantDetails
                      plant={plant}
                      token={token}
                      handleSave={handleSave}
                    />
                  </div>
                ) : (
                  <></>
                )}
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="edit-plant-submit-button"
                  >
                    Edit Plant Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="top-row-container">
            <div className="upload-container">
              <UploadPlantImage
                plant={plant}
                token={token}
                handleImageUpload={handleImageUpload}
              />
              <div className="links">
              <Link to={`/create-task?plant_id=${plant_id}`}>
                Create a New Task
              </Link>
            </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="top-row-container">
            <div className="plant-image-container">
              <img
                className="plant-image"
                src={`http://localhost:5000/static/images/${
                  plant.image_url || ""
                }`}
                alt="Plant"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-4">
          <div className="task-history">
            <TaskHistory plant={plant} token={token} />
          </div>
        </div>

        <div className="col-4">
          <div className="task-history">
            <HarvestHistory plant={plant} token={token} />
          </div>
        </div>

        <div className="col-4">
          <div className="harvest-tracker">
            <HarvestTracker plant={plant} token={token} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
