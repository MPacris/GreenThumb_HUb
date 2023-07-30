import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import EditGardenDetails from "../../utils/EditGardenDetails/EditGardenDetails";
import "./GardenDetails.css";

const defaultValues = {
  type: "",
  location: "",
};

const GardenDetails = () => {
  const { garden_id } = useParams();
  const [garden, setGarden] = useState(null);
  const [plants, setPlants] = useState([]);
  const [user, token] = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(defaultValues);

  useEffect(() => {
    let mounted = true;

    const fetchGardenDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/gardens/${garden_id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (mounted) {
          setGarden(response.data);
        }
      } catch (error) {
        // Handle error
      }
    };

    const fetchPlants = async () => {
      try {
        const plantResponse = await axios.get(
          "http://localhost:5000/api/plants",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const plantData = plantResponse.data;

        const harvestResponse = await axios.get(
          "http://localhost:5000/api/harvests",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const harvestData = harvestResponse.data;

        const plantMap = {};

        harvestData.forEach((harvest) => {
          if (!plantMap[harvest.plant_id]) {
            plantMap[harvest.plant_id] = {
              totalRating: 0,
              count: 0,
            };
          }

          plantMap[harvest.plant_id].totalRating += harvest.rating;
          plantMap[harvest.plant_id].count++;
        });

        const updatedPlants = plantData.map((plant) => {
          const averageRating =
            plantMap[plant.id] && plantMap[plant.id].count
              ? plantMap[plant.id].totalRating / plantMap[plant.id].count
              : 0;

          return {
            ...plant,
            average_harvest_rating: averageRating,
          };
        });

        if (mounted) {
          setPlants(updatedPlants);
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchGardenDetails();
    fetchPlants();

    return () => {
      mounted = false;
    };
  }, [garden_id, token]);

  if (!garden) {
    return <p>Garden not found</p>;
  }

  const filteredPlants = plants.filter(
    (plant) => plant.garden_id === parseInt(garden_id)
  );

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
          garden_id: parseInt(garden_id),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setFormData(defaultValues);
      navigate('/plants');
 
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleSave = (data) => {
    setGarden((prevGarden) => ({
      ...prevGarden,
      type: data.type,
      location: data.location,
    }));
    setEditMode(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/gardens/${garden_id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      navigate("/gardens");
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="container-fluid">
      <div className="top-container">
        <div className="col-lg-4 col-lg-3">
          <div className="description">
          <h1 className="welcome-message">{garden.name}</h1>
            <p>{garden.notes}</p>

            <Link className="garden-link" to="/gardens">Back to Gardens Page</Link>
            <div className="buttons">
            <button onClick={handleDelete} className="submit-button">
                Delete Garden
              </button>
            {!editMode ? (
              <button
                type="submit"
                onClick={() => setEditMode(true)}
                className="submit-button"
              >
                Edit Garden
              </button>

              
            ) : (
              <button
                type="submit"
                onClick={() => setEditMode(false)}
                className="submit-button"
              >
                Cancel Edit
              </button>
              
            )}
        
        </div>
              {editMode ? (
                <EditGardenDetails
                  garden={garden}
                  token={token}
                  handleSave={handleSave}
                />
              ) : (
                <></>
              )}

          </div>
        </div>

        <div className="col-lg-4 col-lg-3">
          <div className="add-plant">
            <h3>Add a New Plant</h3>

            <form className="form-group" onSubmit={handleSubmit}>
              <label className="form-label" element="type">Type:</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-control"
              />

              <label className="form-label" element="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-control"
              />

              <button className="submit-button" type="submit">Add plant</button>
            </form>
          </div>
        </div>

        <div className="col-lg-4 col-lg-3">
  <div className="users">
    <h3>Active Gardeners:</h3>
    <div>
      {garden.users.map((user) => (
        <li key={user.id}>
          {user.username} (User ID: {user.id})
        </li>
      ))}
    </div>
  </div>
</div>
      </div>
      <div className="row">
        <div className="bottom-container">
          {filteredPlants.map((plant) => (
            <div
              className={`plant-card ${
                plant.average_harvest_rating <= 2 ? "red-background" : ""
              }`}
              key={plant.id}
            >
              <Link to={`/plant-details/${plant.id}`}>
                <div>{plant.type}</div>
                <div>{plant.location}</div>
                {plant.image_url && (
                  <img
                    src={`http://localhost:5000/static/images/${plant.image_url}`}
                    alt="Plant Image"
                    className="plant-picture"
                  />
                )}
                <div>Garden ID: {plant.garden_id}</div>
                <div>
                  Avg Harvest Rating:{" "}
                  {plant.average_harvest_rating.toFixed(1)}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GardenDetails;
