import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./AddPlant.css"

const defaultValues = {
  type: "",
  location: "",
  garden_id: "",
};

const AddPlant = () => {
  const [user, token] = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultValues);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const gardenIdFromQuery = searchParams.get("garden_id");
    setFormData((prevData) => ({
      ...prevData,
      garden_id: gardenIdFromQuery,
    }));
  }, [location.search]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };


  async function postNewPlant() {
    try {

      const form = new FormData();
      form.append("type", formData.type);
      form.append("location", formData.location);

      form.append("garden_id", formData.garden_id);

      const response = await axios.post(

        "http://localhost:5000/api/plants",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setFormData(defaultValues);
      navigate("/plants");
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    postNewPlant();
  };

  return (
    <div>
      <div className="row">      
      <div className="col-4"></div>      
      <div className="col-4">
      <div className="add-plant-container">      
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
        <h3>Add a New Plant</h3>
          <label className="form-label" htmlFor="type">Type:</label>
          <input
            className="form-control"
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label className="form-label" htmlFor="location">Location:</label>
          <input
            className="form-control"
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>
  
        <div className="form-group">
          <label className="form-label" htmlFor="garden_id">Garden ID:</label>
          <input
            className="form-control"
            type="number"
            id="garden_id"
            name="garden_id"
            value={formData.garden_id}
            onChange={handleInputChange}
          />
        </div>
  
        <button className="submit-button" type="submit">Add Plant</button>
      </form>
  
      <div className="link">
        <Link to="/gardens">Go to back to Gardens Page</Link>
      </div>
      </div>
      </div>
      <div className="col-4"></div>
      </div>
    
    </div>
    
  );
};

export default AddPlant;