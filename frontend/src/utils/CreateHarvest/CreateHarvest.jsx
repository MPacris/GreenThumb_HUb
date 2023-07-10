import React, { useState } from "react";

const CreateHarvest = () => {
  const [formData, setFormData] = useState({
    rating: "",
    image_url: "",
    notes: "",
    task_id: "",
    plant_id: "",
    task_completed: "", // Set task_completed as an empty string initially
  });

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
    <div>
      <h1>Create Harvest</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label element="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>
        <div>
          <label element="image_url">Image URL:</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label element="notes">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label element="task_id">Task ID:</label>
          <input
            type="text"
            id="task_id"
            name="task_id"
            value={formData.task_id}
            onChange={handleChange}
          />
        </div>
        <div>
          <label element="plant_id">Plant ID:</label>
          <input
            type="text"
            id="plant_id"
            name="plant_id"
            value={formData.plant_id}
            onChange={handleChange}
          />
        </div>
        <div>
          <label element="task_completed">Task Completed:</label>
          <input
            type="text"
            id="task_completed"
            name="task_completed"
            value={formData.task_completed}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateHarvest;