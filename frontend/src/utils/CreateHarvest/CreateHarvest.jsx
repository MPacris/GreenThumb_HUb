import React, { useState, useEffect } from "react";
import './CreateHarvest.css'

const CreateHarvest = () => {
  const [formData, setFormData] = useState({
    rating: "1", // Set default rating to 1
    image_url: "",
    notes: "",
    task_id: "",
    plant_id: "",
    task_completed: "", // Set task_completed as an empty string initially
  });

  useEffect(() => {
    // Retrieve query parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const task_id = searchParams.get("task_id");
    const plant_id = searchParams.get("plant_id");
    const completedDate = searchParams.get("completed_date"); // Get completed date from URL query parameter

    // Set task_id, plant_id, and completed date in the form data
    setFormData((prevState) => ({
      ...prevState,
      task_id: task_id,
      plant_id: plant_id,
      task_completed: completedDate || "", // Set completed date in the form if available
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Do something with the form data
  };

  return (
    <div className="create-harvest">
      <h3 className="create-harvest__title">Create Harvest</h3>
      <form onSubmit={handleSubmit}>
        <div className="create-harvest__item">
          <label className="create-harvest__label" htmlFor="rating">
            Rating:
          </label>
          <select
            className="create-harvest__input"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="create-harvest__item">
          <label className="create-harvest__label" htmlFor="image_url">
            Image URL:
          </label>
          <input
            className="create-harvest__input"
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <div className="create-harvest__item">
          <label className="create-harvest__label" htmlFor="notes">
            Notes:
          </label>
          <textarea
            className="create-harvest__input"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="create-harvest__item">
          <label className="create-harvest__label" htmlFor="task_id">
            Task ID:
          </label>
          <input
            className="create-harvest__input"
            type="text"
            id="task_id"
            name="task_id"
            value={formData.task_id}
            onChange={handleChange}
          />
        </div>
        <div className="create-harvest__item">
          <label className="create-harvest__label" htmlFor="plant_id">
            Plant ID:
          </label>
          <input
            className="create-harvest__input"
            type="text"
            id="plant_id"
            name="plant_id"
            value={formData.plant_id}
            onChange={handleChange}
          />
        </div>
        <div className="create-harvest__item">
          <label className="create-harvest__label" htmlFor="task_completed">
            Task Completed:
          </label>
          <input
            className="form-control"
            type="date"
            id="task_completed"
            name="task_completed"
            value={formData.task_completed}
            onChange={handleChange}
          />
        </div>
        <button className="create-harvest__button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateHarvest;