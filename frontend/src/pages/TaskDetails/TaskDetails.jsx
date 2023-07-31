import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import "./TaskDetails.css"



const TaskDetails = () => {
  const { task_id } = useParams();
  const [task, setTask] = useState(null);
  const [user, token] = useAuth();
  const [harvestFormData, setHarvestFormData] = useState({
    rating: "",
    notes: "",
  });
  const [plantType, setPlantType] = useState("");
  const navigate = useNavigate();
  const ratingOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/tasks/${task_id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setTask(response.data);

        const plantResponse = await axios.get(
          `http://localhost:8000/api/plants/${response.data.plant_id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setPlantType(plantResponse.data.type);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTaskDetails();
  }, [task_id, token]);

  const handleHarvestChange = (e) => {
    const { name, value } = e.target;

    setHarvestFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleHarvestSubmit = async (e) => {
    e.preventDefault();

    try {
      const harvestData = {
        ...harvestFormData,
        task_id,
        plant_id: task.plant_id,
        task_completed: task.task_completed,
      };

      await axios.post("http://localhost:8000/api/harvests", harvestData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log("Harvest created:", harvestData);
      navigate("/tasks");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (formData) => {
    try {
      await axios.post(
        `http://localhost:8000/api/harvestImage/${task.id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      window.location.reload();
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  if (!task) {
    return <p>Task not found</p>;
  }

  return (
    <div className="container-text-center">
      <div className="task-details">
        <h3>Task Information:</h3>

        <div>
          <div>Task ID: {task.id}</div>
          <div>Plant ID: {task.plant_id}</div>
          <div>Plant Type: {plantType}</div>
          <div>Task Type: {task.task_type}</div>
          <div>Task Scheduled: {task.task_scheduled}</div>
          <div>Task Completed: {task.task_completed}</div>
        </div>

        <div>
          <Link to="/plants">Back to Plants</Link>
        </div>
        <div>
          <Link to="/tasks">Back to Tasks</Link>
        </div>
        <div>
          <Link to={`/edit-task-details/${task.id}?user_id=${task.user_id}`}>
            Edit Task Details
          </Link>
        </div>

        {task.task_type === "harvest" && (
          <div className="create-harvest-container">
            <h3>Create Harvest</h3>
            <div>
              <form onSubmit={handleHarvestSubmit}>
                <div>
                  <label className="form-label" element="rating">Rating:</label>
                  <select
                    id="rating"
                    name="rating"
                    value={harvestFormData.rating}
                    onChange={handleHarvestChange}
                    className="form-select"
                  >
                    <option value="">Select rating</option>
                    {ratingOptions.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" element="notes">Notes:</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    value={harvestFormData.notes}
                    onChange={handleHarvestChange}
                  ></textarea>
                </div>
                <button className="submit-button" type="submit">Create Harvest</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;