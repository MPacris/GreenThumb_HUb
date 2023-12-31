import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import "./EditTaskDetails.css";

const EditTaskDetails = () => {
  const { task_id } = useParams();
  const [task, setTask] = useState(null);
  const [user, token] = useAuth();
  const [newUserId, setNewUserId] = useState("");
  const [newCompleted, setNewCompleted] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isHarvest, setIsHarvest] = useState(false);

  
  
  const handleDelete = async () => {
    try {
      await axios.delete(`http://18.117.255.133:8000/api/tasks/${task_id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      navigate(`/tasks`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `http://18.117.255.133:8000/api/tasks/${task_id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setTask(response.data);
        setNewUserId(new URLSearchParams(location.search).get("user_id")); // Set the initial value for newUserId
        setIsHarvest(response.data.task_type === "harvest"); // Determine if the task is a Harvest
      } catch (error) {
        console.error(error);
      }
    };

    fetchTaskDetails();
  }, [task_id, token, location.search]);

  const handleUpdate = async () => {
    try {
      const data = {
        user_id: newUserId || task.user_id,
        task_completed: newCompleted || task.task_completed,
      };

      await axios.put(`http://18.117.255.133:8000/api/tasks/${task_id}`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      navigate(`/tasks`);
    } catch (error) {
      console.error(error);
    }
  };



  if (!task) {
    return <p>Task not found</p>;
  }

  const handleCancel = () => {
    navigate("/tasks"); // Navigate back to the Task page
  };

  const handleCreateHarvest = () => {
    navigate(`/create-harvest?task_id=${task.id}&plant_id=${task.plant_id}`);
  };

  

  

  return (
    <div className="edit-task-details">
      <h3 className="edit-task-details__title">Edit Task Details:</h3>
      <div className="edit-task-details__item">
        <span className="edit-task-details__label">Task ID:</span> {task.id}
      </div>
      <div className="edit-task-details__item">
        <span className="edit-task-details__label">Task Type:</span> {task.task_type}
      </div>
      <div className="edit-task-details__item">
        <span className="edit-task-details__label">Task Scheduled:</span> {task.task_scheduled}
      </div>
      <div className="edit-task-details__item">
        <label className="form-label">Task Completed:</label>
        <input
          className="form-control"
          type="date"
          value={newCompleted}
          onChange={(e) => setNewCompleted(e.target.value)}
          min="1000-01-01"
        />
      </div>
      <div className="edit-task-details__item">
        <label className="form-label">User ID:</label>
        <input
          className="form-control"
          type="text"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
        />
      </div>
      <div className="edit-task-details__item">
        <span className="edit-task-details__label">Plant ID:</span> {task.plant_id}
      </div>
      <div className="buttons">
      <button className="submit-button" onClick={handleDelete}>
        Delete Task
      </button>
      <button className="submit-button" onClick={handleUpdate}>Save Changes</button>
      <button className="submit-button" onClick={handleCancel}>
          Cancel
        </button>
        {isHarvest && (
        <Link to={`/create-harvest?task_id=${task.id}&plant_id=${task.plant_id}`} className="submit-button">
          Create Harvest
        </Link>
      )}
        
      </div>
    </div>
  );
};

export default EditTaskDetails;