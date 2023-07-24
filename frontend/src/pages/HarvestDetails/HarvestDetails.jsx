import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import EditHarvestDetails from "../../utils/EditHarvestDetails/EditHarvestDetails";
import UploadHarvestImage from "../../utils/UploadHarvestImage/UploadHarvestImage";
import "./HarvestDetails.css";

const HarvestDetails = () => {
  const { harvest_id } = useParams();
  const [harvest, setHarvest] = useState(null);
  const [task, setTask] = useState(null);
  const [plantType, setPlantType] = useState(null);
  const [user, token] = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchHarvestDetails = async () => {
    try {
      const harvestResponse = await axios.get(
        `http://localhost:5000/api/harvests/${harvest_id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const taskResponse = await axios.get(
        `http://localhost:5000/api/tasks/${harvestResponse.data.task_id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const plantResponse = await axios.get(
        `http://localhost:5000/api/plants/${taskResponse.data.plant_id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setHarvest(harvestResponse.data);
      setTask(taskResponse.data);
      setPlantType(plantResponse.data.type);

      return Promise.resolve();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Harvest not found or User not able to edit Harvest");
      } else {
        setError("Error fetching harvest details");
      }
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    fetchHarvestDetails();
  }, [harvest_id, token]);

  const handleSave = (data) => {
    setHarvest((prevHarvest) => ({
      ...prevHarvest,
      rating: data.rating,
      notes: data.notes,
    }));
  };

  const handleImageUpload = () => {
    navigate("/harvests");
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!harvest || !task) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="harvest-information">
            <h3 className="mb-3">Harvest Information:</h3>
            <div>Harvest ID: {harvest.id}</div>
            <div>Task ID: {harvest.task_id}</div>
            <div>Rating: {harvest.rating}</div>
          </div>

          <div className="task-information">
            <h3 className="mb-3">Task Information:</h3>
            <div>Plant ID: {task.plant_id}</div>
            <div>Plant Type: {plantType}</div>
            <div>Task Scheduled: {task.task_scheduled}</div>
            <div>Task Completed: {task.task_completed}</div>
            <div>Assigned User: {task.user_id}</div>
          </div>

          <EditHarvestDetails className="edit-harvest-details" harvest={harvest} token={token} handleSave={handleSave} />


        </div>

        <div className="col-md-6">
          <div className="image-container">
            {harvest.image_url ? (
              <img
                className="harvest-image"
                src={`http://localhost:5000/static/images/${harvest.image_url}`}
                alt="Harvest Image"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <div><UploadHarvestImage
            harvest={harvest}
            token={token}
            onImageUpload={handleImageUpload}
          /></div>
        </div>
      </div>
    </div>
  );
};

export default HarvestDetails;